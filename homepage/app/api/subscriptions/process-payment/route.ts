import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia'
    })
  : null

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, paymentMethodId } = body

    if (!orderId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Order ID and payment method are required' },
        { status: 400 }
      )
    }

    // Get subscription order with tier and creator details
    const { data: order, error: orderError } = await supabase
      .from('subscription_orders')
      .select(`
        *,
        tier:creator_subscription_tiers(*),
        creator:profiles!subscription_orders_creator_id_fkey(
          id,
          display_name,
          username,
          stripe_account_id
        ),
        user:profiles!subscription_orders_user_id_fkey(
          id,
          email,
          display_name
        )
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Subscription order not found' },
        { status: 404 }
      )
    }

    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: 'Order has already been processed' },
        { status: 400 }
      )
    }

    // Update order status to processing
    await supabase
      .from('subscription_orders')
      .update({ status: 'processing' })
      .eq('id', orderId)

    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing not configured' },
        { status: 503 }
      )
    }

    try {
      // Create or retrieve Stripe customer
      let customerId = order.user.stripe_customer_id
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: order.user.email,
          metadata: {
            supabase_user_id: user.id
          }
        })
        customerId = customer.id
        
        // Save customer ID to user profile
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id)
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      })

      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      })

      // Create Stripe subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${order.creator.display_name} - ${order.tier.tier_name}`,
              description: order.tier.description || `Subscription to ${order.creator.display_name}`,
              metadata: {
                creator_id: order.creator_id,
                tier_id: order.tier_id
              }
            },
            unit_amount: Math.round(order.amount * 100), // Convert to cents
            recurring: {
              interval: order.billing_period === 'yearly' ? 'year' : 'month'
            }
          }
        }],
        metadata: {
          supabase_order_id: orderId,
          supabase_user_id: user.id,
          supabase_creator_id: order.creator_id,
          supabase_tier_id: order.tier_id
        },
        // If creator has Stripe Connect account, handle platform fees
        ...(order.creator.stripe_account_id && {
          application_fee_percent: 10, // 10% platform fee
          transfer_data: {
            destination: order.creator.stripe_account_id
          }
        })
      })

      // Update subscription order with Stripe details
      const { error: updateError } = await supabase
        .from('subscription_orders')
        .update({
          status: 'active',
          stripe_subscription_id: subscription.id,
          stripe_customer_id: customerId,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
          metadata: {
            ...order.metadata,
            stripe_subscription: {
              id: subscription.id,
              status: subscription.status,
              created: subscription.created
            }
          }
        })
        .eq('id', orderId)

      if (updateError) {
        console.error('Failed to update order:', updateError)
        // Cancel Stripe subscription if we can't update our database
        await stripe.subscriptions.cancel(subscription.id)
        throw new Error('Failed to activate subscription')
      }

      // Log the subscription activation
      await supabase
        .from('order_events')
        .insert({
          order_id: orderId,
          event_type: 'subscription_activated',
          metadata: {
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customerId,
            amount: order.amount,
            billing_period: order.billing_period
          }
        })

      // Send notification to creator
      await supabase
        .from('notifications')
        .insert({
          user_id: order.creator_id,
          type: 'new_subscriber',
          title: 'New Subscriber!',
          message: `${order.user.display_name} subscribed to your ${order.tier.tier_name} tier`,
          metadata: {
            order_id: orderId,
            subscriber_id: user.id,
            tier_name: order.tier.tier_name,
            amount: order.amount
          }
        })

      return NextResponse.json({
        success: true,
        subscription: {
          id: orderId,
          status: 'active',
          stripe_subscription_id: subscription.id
        }
      })

    } catch (stripeError: any) {
      console.error('Stripe error:', stripeError)
      
      // Revert order status
      await supabase
        .from('subscription_orders')
        .update({ 
          status: 'failed',
          metadata: {
            ...order.metadata,
            error: stripeError.message
          }
        })
        .eq('id', orderId)

      // Log the failure
      await supabase
        .from('order_events')
        .insert({
          order_id: orderId,
          event_type: 'payment_failed',
          metadata: {
            error: stripeError.message,
            type: stripeError.type
          }
        })

      return NextResponse.json(
        { error: stripeError.message || 'Payment processing failed' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Process subscription payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}