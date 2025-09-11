import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase/server'
import { OrderService, PaymentService, StatsService } from '@/lib/services'
import NotificationServiceServer from '@/lib/services/notification-service-server'
import { createClient } from '@supabase/supabase-js'

// Service role client bypasses RLS policies for webhook processing
const serviceRoleClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  console.log('🔥 DIAGNOSTIC-WEBHOOK-HANDLER-V2 - Webhook request received')
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.log('❌ DIAGNOSTIC - No signature found')
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      // Verify webhook signature if webhook secret is configured
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          webhookSecret
        )
        console.log('✅ DIAGNOSTIC - Webhook signature verified')
      } else {
        // In development without webhook secret, parse event directly
        event = JSON.parse(body) as Stripe.Event
        console.log('⚠️ DIAGNOSTIC - Webhook parsed without signature verification')
      }
    } catch (err) {
      console.error('❌ DIAGNOSTIC - Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('📝 DIAGNOSTIC - Event type:', event.type, 'Event ID:', event.id)

    const supabase = supabaseAdmin
    const dbClient = serviceRoleClient // Use service role for database operations

    console.log('✅ DIAGNOSTIC - Using service role client for database operations')
    // DIAGNOSTIC: Skip service initialization to bypass database issues  
    console.log('🚫 DIAGNOSTIC - SKIPPING service initialization due to database schema issues')
    // const orderService = new OrderService(dbClient)
    // const paymentService = new PaymentService(dbClient)
    // const statsService = new StatsService(dbClient)
    const notificationService = new NotificationServiceServer(supabase)

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        console.log('💳 DIAGNOSTIC - Payment intent succeeded:', paymentIntent.id)
        console.log('🔍 DIAGNOSTIC - Payment metadata:', JSON.stringify(paymentIntent.metadata, null, 2))
        
        // Skip payment intent status update due to database schema issues
        console.log('🚫 DIAGNOSTIC - SKIPPING payment intent status update due to database schema issues')

        // Create order if this is for a video request
        if (paymentIntent.metadata.source === 'ann-pale-video-request' && paymentIntent.metadata.creatorId && paymentIntent.metadata.userId) {
          console.log('✅ DIAGNOSTIC - Payment metadata validation passed - proceeding with order creation')
          
          const amount = paymentIntent.amount / 100 // Convert from cents
          console.log('💰 DIAGNOSTIC - Payment amount:', amount, 'USD')
          
          // Calculate 70/30 split
          const platformFee = Math.round(amount * 0.30) // 30% platform fee
          const creatorEarnings = amount - platformFee   // 70% creator earnings
          console.log('📊 DIAGNOSTIC - Split calculation - Creator:', creatorEarnings, 'Platform:', platformFee)
          
          // Parse request details from metadata
          const requestDetails = paymentIntent.metadata.requestDetails ? 
            JSON.parse(paymentIntent.metadata.requestDetails) : {}
          console.log('📝 DIAGNOSTIC - Request details:', JSON.stringify(requestDetails, null, 2))

          console.log('🔄 DIAGNOSTIC - Attempting to create order in database using service role...')
          
          // Create order directly in database using service role client
          const { data: orderData, error: orderError } = await dbClient
            .from('orders')
            .insert({
              payment_intent_id: paymentIntent.id,
              creator_id: paymentIntent.metadata.creatorId,
              user_id: paymentIntent.metadata.userId,
              amount: amount, // Store as decimal
              creator_earnings: creatorEarnings, // Store as decimal
              platform_fee: platformFee, // Store as decimal
              status: 'pending',
              metadata: { video_request_details: requestDetails },
              created_at: new Date().toISOString()
            })
            .select()
            .single()

          const orderResult = orderError ? 
            { success: false, error: orderError.message } :
            { success: true, data: orderData }

          if (!orderResult.success) {
            console.error('❌ DIAGNOSTIC - Order creation failed:', orderResult.error)
            // Send alert to monitoring system
            await notificationService.sendSystemAlert({
              type: 'order_creation_failed',
              severity: 'critical',
              data: {
                paymentIntentId: paymentIntent.id,
                error: orderResult.error,
                metadata: paymentIntent.metadata
              }
            })
          } else {
            console.log('✅ DIAGNOSTIC - Order created successfully with ID:', orderResult.data?.id)
            
            // Send enhanced real-time notification to creator
            console.log('🔔 Sending detailed notification to creator:', paymentIntent.metadata.creatorId)
            
            // Extract video request details from metadata
            const requestDetails = paymentIntent.metadata.requestDetails ? 
              JSON.parse(paymentIntent.metadata.requestDetails) : {}
            
            const notificationData = {
              creatorId: paymentIntent.metadata.creatorId,
              type: 'new_order' as const,
              title: 'New Video Request!',
              message: `You have a new video request worth $${amount}${requestDetails.occasion ? ` for ${requestDetails.occasion}` : ''}`,
              data: {
                orderId: orderResult.data?.id,
                paymentIntentId: paymentIntent.id,
                amount: amount,
                creatorEarnings: creatorEarnings,
                platformFee: platformFee,
                fanEmail: paymentIntent.metadata.userEmail || 'Unknown fan',
                occasion: requestDetails.occasion || '',
                recipientName: requestDetails.recipientName || '',
                instructions: requestDetails.instructions || '',
                requestType: requestDetails.type || 'video',
                timestamp: new Date().toISOString()
              }
            }
            
            console.log('📝 Notification details:', {
              occasion: notificationData.data.occasion,
              recipient: notificationData.data.recipientName,
              earnings: `$${notificationData.data.creatorEarnings}`
            })
            
            await notificationService.sendCreatorNotification(notificationData)
            console.log('✅ Enhanced creator notification sent successfully')
            
            console.log('🚫 DIAGNOSTIC - SKIPPING payment record creation due to database schema issues')
            console.log('🚫 DIAGNOSTIC - SKIPPING revenue tracking due to database schema issues')
          }
        } else {
          console.warn('⚠️ DIAGNOSTIC - Payment metadata validation failed')
          console.warn('🔍 DIAGNOSTIC - Missing metadata - source:', paymentIntent.metadata.source)
          console.warn('🔍 DIAGNOSTIC - Missing metadata - creatorId:', paymentIntent.metadata.creatorId)
          console.warn('🔍 DIAGNOSTIC - Missing metadata - userId:', paymentIntent.metadata.userId)
          console.warn('📋 DIAGNOSTIC - Full metadata:', JSON.stringify(paymentIntent.metadata, null, 2))
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        console.log('❌ Processing payment_intent.payment_failed:', paymentIntent.id)
        // Skip payment intent status update due to database schema issues
        // TODO: Fix database schema and re-enable payment intent tracking
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        
        console.log('💸 Processing charge.refunded:', charge.id)
        console.log('🔍 Refund details:', {
          payment_intent: charge.payment_intent,
          amount_refunded: charge.amount_refunded / 100,
          total_refunds: charge.refunds?.data?.length || 0
        })
        
        // Update order status and refund record if refunded using service role client
        if (charge.payment_intent) {
          // Get the most recent refund for details
          const latestRefund = charge.refunds?.data?.[0]
          
          if (latestRefund) {
            // Update refund record status
            try {
              const { error: refundUpdateError } = await dbClient
                .rpc('update_refund_status', {
                  p_stripe_refund_id: latestRefund.id,
                  p_status: latestRefund.status === 'succeeded' ? 'succeeded' : 
                           latestRefund.status === 'failed' ? 'failed' : 'processing',
                  p_failure_reason: latestRefund.failure_reason || null,
                  p_stripe_failure_code: latestRefund.failure_code || null
                })
              
              if (refundUpdateError) {
                console.error('❌ Error updating refund record:', refundUpdateError)
              } else {
                console.log('✅ Refund record updated successfully')
              }
            } catch (refundError) {
              console.error('❌ Failed to update refund record:', refundError)
            }
          }
          
          const { data: updatedOrder, error } = await dbClient
            .from('orders')
            .update({
              status: 'refunded',
              metadata: {
                stripeChargeId: charge.id,
                refundAmount: charge.amount_refunded / 100,
                refundReason: latestRefund?.reason || 'unknown',
                refundId: latestRefund?.id,
                refundStatus: latestRefund?.status,
                refundedAt: new Date().toISOString(),
                webhookProcessedAt: new Date().toISOString()
              },
              updated_at: new Date().toISOString()
            })
            .eq('payment_intent_id', charge.payment_intent)
            .select()
            .single()

          if (error) {
            console.error('❌ Error updating refunded order:', error)
          } else if (updatedOrder) {
            console.log('✅ Order refunded successfully:', updatedOrder.id)
            
            // Also update corresponding video_request status
            if (updatedOrder.video_request_id) {
              const { error: videoRequestError } = await dbClient
                .from('video_requests')
                .update({
                  status: 'cancelled',
                  rejection_reason: `Refunded: ${latestRefund?.reason || 'unknown'}`,
                  updated_at: new Date().toISOString()
                })
                .eq('id', updatedOrder.video_request_id)
              
              if (videoRequestError) {
                console.error('❌ Failed to update video_request status:', videoRequestError)
              } else {
                console.log('✅ Updated video_request status to cancelled')
              }
            }
            
            // Send refund notification to fan
            try {
              const refundAmount = charge.amount_refunded / 100
              await notificationService.sendNotification(
                updatedOrder.user_id,
                'Refund Processed',
                `Your refund of $${refundAmount.toFixed(2)} has been processed and will appear in your account within 5-10 business days.`
              )
              
              // Also send notification to creator if it was their rejection
              if (latestRefund?.metadata?.refund_type === 'creator_rejection') {
                await notificationService.sendNotification(
                  updatedOrder.creator_id,
                  'Order Refund Completed',
                  `The refund for your rejected video request has been processed. Amount: $${refundAmount.toFixed(2)}`
                )
              }
              
              console.log('✅ Refund notifications sent successfully')
            } catch (notificationError) {
              console.error('❌ Failed to send refund notification:', notificationError)
            }
          }
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('✅ Processing checkout.session.completed:', session.id)
        console.log('📝 Session mode:', session.mode)
        
        if (session.mode === 'subscription') {
          // Update subscription order to active
          const { error: updateError } = await dbClient
            .from('subscription_orders')
            .update({
              status: 'active',
              stripe_subscription_id: session.subscription as string,
              stripe_customer_id: session.customer as string,
              activated_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('stripe_checkout_session_id', session.id)
          
          if (updateError) {
            console.error('Error updating subscription order:', updateError)
          } else {
            console.log('✅ Subscription activated successfully')
            
            // Send notification to creator
            if (session.metadata?.creator_id) {
              await notificationService.sendNotification(
                session.metadata.creator_id,
                'New subscriber!',
                `You have a new subscriber for your ${session.metadata.tier_name || 'subscription'} tier`
              )
            }
          }
        }
        break
      }
      
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('📝 Processing customer.subscription.created:', subscription.id)
        
        // Update subscription order with Stripe subscription details
        const { error } = await dbClient
          .from('subscription_orders')
          .update({
            status: 'active',
            stripe_subscription_id: subscription.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', subscription.customer)
          .eq('status', 'pending')
        
        if (error) {
          console.error('Error updating subscription on creation:', error)
        }
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('📝 Processing customer.subscription.updated:', subscription.id)
        
        // Map Stripe status to our status
        let status = subscription.status
        if (subscription.status === 'active') status = 'active'
        else if (subscription.status === 'canceled') status = 'cancelled'
        else if (subscription.status === 'past_due') status = 'paused'
        else if (subscription.status === 'unpaid') status = 'failed'
        
        const { error } = await dbClient
          .from('subscription_orders')
          .update({
            status: status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)
        
        if (error) {
          console.error('Error updating subscription:', error)
        }
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('📝 Processing customer.subscription.deleted:', subscription.id)
        
        const { error } = await dbClient
          .from('subscription_orders')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)
        
        if (error) {
          console.error('Error cancelling subscription:', error)
        }
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('💳 Processing invoice.payment_succeeded:', invoice.id)
        
        if (invoice.subscription) {
          // Update last payment info
          const { error } = await dbClient
            .from('subscription_orders')
            .update({
              last_payment_status: 'succeeded',
              last_payment_date: new Date().toISOString(),
              failed_payment_count: 0, // Reset failed count on success
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription)
          
          if (error) {
            console.error('Error updating payment status:', error)
          }
          
          // Log the payment event (optional - create subscription_events table if needed)
          console.log(`✅ Subscription payment successful: $${(invoice.amount_paid / 100).toFixed(2)}`)
        }
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('❌ Processing invoice.payment_failed:', invoice.id)
        
        if (invoice.subscription) {
          // Update failed payment info
          const { data: currentOrder } = await dbClient
            .from('subscription_orders')
            .select('failed_payment_count')
            .eq('stripe_subscription_id', invoice.subscription)
            .single()
          
          const failedCount = (currentOrder?.failed_payment_count || 0) + 1
          
          const { error } = await dbClient
            .from('subscription_orders')
            .update({
              last_payment_status: 'failed',
              failed_payment_count: failedCount,
              status: failedCount >= 3 ? 'paused' : 'active', // Pause after 3 failures
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription)
          
          if (error) {
            console.error('Error updating failed payment:', error)
          }
        }
        break
      }

      case 'checkout.session.completed_old': {
        // Handle successful checkout sessions
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout completed:', session.id)
        break
      }

      // Stripe Connect specific events
      case 'account.updated': {
        const account = event.data.object as Stripe.Account
        console.log('Connect account updated:', account.id)
        
        // Update stripe_accounts table with proper Connect account details using service role client
        const { error: stripeError } = await dbClient
          .from('stripe_accounts')
          .update({
            charges_enabled: account.charges_enabled || false,
            payouts_enabled: account.payouts_enabled || false,
            onboarding_complete: account.details_submitted || false,
            requirements_currently_due: account.requirements?.currently_due || [],
            requirements_eventually_due: account.requirements?.eventually_due || [],
            requirements_past_due: account.requirements?.past_due || [],
            updated_at: new Date().toISOString()
          })
          .eq('stripe_account_id', account.id)

        if (stripeError) {
          console.error('Error updating stripe account:', stripeError)
        }

        // Also update creator profile for backward compatibility using service role client
        const { error: profileError } = await dbClient
          .from('profiles')
          .update({
            updated_at: new Date().toISOString()
          })
          .eq('stripe_account_id', account.id)

        if (profileError) {
          console.error('Error updating creator profile:', profileError)
        } else {
          console.log('🔄 Stripe Connect account updated:', account.id)
        }
        break
      }

      case 'account.application.deauthorized': {
        const application = event.data.object as any
        console.log('Connect account deauthorized:', application.account)
        
        // Remove from stripe_accounts table using service role client
        const { error: deleteError } = await dbClient
          .from('stripe_accounts')
          .delete()
          .eq('stripe_account_id', application.account)

        if (deleteError) {
          console.error('Error removing Stripe account record:', deleteError)
        }

        // Clear Stripe account from creator profile for backward compatibility using service role client
        const { error: profileError } = await dbClient
          .from('profiles')
          .update({
            stripe_account_id: null,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_account_id', application.account)

        if (profileError) {
          console.error('Error clearing Stripe account from profile:', profileError)
        } else {
          console.log('🚫 Stripe Connect account deauthorized and removed:', application.account)
        }
        break
      }

      case 'transfer.created':
      case 'transfer.updated': {
        const transfer = event.data.object as Stripe.Transfer
        console.log('📤 Transfer event:', event.type, transfer.id)
        console.log('🔍 Transfer details:', {
          amount: transfer.amount / 100,
          destination: transfer.destination,
          source_transaction: transfer.source_transaction,
          reversed: transfer.reversed
        })
        
        // Log transfer for tracking using service role client
        const { error } = await dbClient
          .from('transactions')
          .update({
            metadata: {
              ...(await dbClient
                .from('transactions')
                .select('metadata')
                .eq('stripe_payment_intent_id', transfer.source_transaction as string)
                .single()
                .then(res => res.data?.metadata || {})),
              transfer_id: transfer.id,
              transfer_amount: transfer.amount / 100,
              transfer_status: transfer.reversed ? 'reversed' : 'completed',
              transfer_destination: transfer.destination
            },
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', transfer.source_transaction as string)

        if (error) {
          console.error('❌ Error updating transaction with transfer:', error)
        } else {
          console.log('✅ Transaction updated with transfer info')
        }
        break
      }
      
      case 'transfer.reversed': {
        const transfer = event.data.object as Stripe.Transfer
        console.log('🔄 Processing transfer.reversed:', transfer.id)
        
        // When a transfer is reversed (due to refund), update the transaction
        const { error } = await dbClient
          .from('transactions')
          .update({
            metadata: {
              ...(await dbClient
                .from('transactions')
                .select('metadata')
                .eq('stripe_payment_intent_id', transfer.source_transaction as string)
                .single()
                .then(res => res.data?.metadata || {})),
              transfer_reversed: true,
              transfer_reversed_at: new Date().toISOString(),
              transfer_reversal_reason: 'refund_processed'
            },
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', transfer.source_transaction as string)

        if (error) {
          console.error('❌ Error updating reversed transfer:', error)
        } else {
          console.log('✅ Transfer reversal recorded')
        }
        break
      }

      case 'application_fee.created': {
        const fee = event.data.object as Stripe.ApplicationFee
        console.log('💰 Processing application_fee.created:', fee.id)
        console.log('🔍 Fee details:', {
          amount: fee.amount / 100,
          charge: fee.charge,
          refunded: fee.refunded
        })
        
        // Update transaction with fee information using service role client
        const { error } = await dbClient
          .from('transactions')
          .update({
            platform_fee: fee.amount / 100,
            metadata: {
              ...(await dbClient
                .from('transactions')
                .select('metadata')
                .eq('stripe_charge_id', fee.charge as string)
                .single()
                .then(res => res.data?.metadata || {})),
              application_fee_id: fee.id,
              fee_created_at: new Date(fee.created * 1000).toISOString()
            },
            updated_at: new Date().toISOString()
          })
          .eq('stripe_charge_id', fee.charge as string)

        if (error) {
          console.error('❌ Error updating transaction with fee:', error)
        } else {
          console.log('✅ Transaction updated with application fee')
        }
        break
      }
      
      case 'application_fee.refunded': {
        const fee = event.data.object as Stripe.ApplicationFee
        console.log('💸 Processing application_fee.refunded:', fee.id)
        console.log('🔍 Fee refund details:', {
          original_amount: fee.amount / 100,
          amount_refunded: fee.amount_refunded / 100,
          charge: fee.charge
        })
        
        // Update transaction with fee refund information
        const { error } = await dbClient
          .from('transactions')
          .update({
            metadata: {
              ...(await dbClient
                .from('transactions')
                .select('metadata')
                .eq('stripe_charge_id', fee.charge as string)
                .single()
                .then(res => res.data?.metadata || {})),
              application_fee_id: fee.id,
              fee_refunded: true,
              fee_refunded_amount: fee.amount_refunded / 100,
              fee_refunded_at: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
          })
          .eq('stripe_charge_id', fee.charge as string)

        if (error) {
          console.error('❌ Error updating transaction with fee refund:', error)
        } else {
          console.log('✅ Transaction updated with application fee refund')
        }
        break
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute
        console.log('⚖️ Processing charge.dispute.created:', dispute.id)
        console.log('🔍 Dispute details:', {
          amount: dispute.amount / 100,
          reason: dispute.reason,
          status: dispute.status,
          charge: dispute.charge
        })
        
        // Update order with dispute information
        const { error } = await dbClient
          .from('orders')
          .update({
            status: 'disputed',
            metadata: {
              dispute_id: dispute.id,
              dispute_reason: dispute.reason,
              dispute_amount: dispute.amount / 100,
              dispute_status: dispute.status,
              disputed_at: new Date(dispute.created * 1000).toISOString(),
              dispute_evidence_due: dispute.evidence_details?.due_by ? 
                new Date(dispute.evidence_details.due_by * 1000).toISOString() : null
            },
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', await stripe.charges.retrieve(dispute.charge as string)
            .then(charge => charge.payment_intent))

        if (error) {
          console.error('❌ Error updating order with dispute:', error)
        } else {
          console.log('✅ Order updated with dispute information')
          
          // Send alert to admin about dispute
          await notificationService.sendSystemAlert({
            type: 'payment_dispute_created',
            severity: 'high',
            data: {
              dispute_id: dispute.id,
              amount: dispute.amount / 100,
              reason: dispute.reason,
              charge_id: dispute.charge
            }
          })
        }
        break
      }
      
      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`)
    }

    // Log webhook event for audit trail
    console.log('📝 Webhook event processed successfully:', event.type, event.id)
    
    // Store webhook event for audit (optional, can be enabled later)
    try {
      await dbClient
        .from('webhook_events')
        .insert({
          stripe_event_id: event.id,
          event_type: event.type,
          processed_at: new Date().toISOString(),
          api_version: event.api_version,
          livemode: event.livemode
        })
      console.log('✅ Webhook event logged for audit')
    } catch (logError) {
      // Non-critical error, don't fail the webhook
      console.log('⚠️ Could not log webhook event (non-critical):', logError)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}