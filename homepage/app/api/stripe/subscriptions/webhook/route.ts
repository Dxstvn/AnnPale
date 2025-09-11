import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server-admin'

// Initialize Stripe
const stripe = process.env.STRIPE_SANDBOX_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET_SUBSCRIPTIONS

export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ 
      error: 'Stripe is not configured' 
    }, { status: 503 })
  }

  try {
    const body = await request.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ 
        error: 'No signature provided' 
      }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ 
        error: `Webhook Error: ${err.message}` 
      }, { status: 400 })
    }

    const supabase = createClient()

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription') {
          // Update subscription order with Stripe details
          const { error: updateError } = await supabase
            .from('subscription_orders')
            .update({
              status: 'active',
              stripe_subscription_id: session.subscription as string,
              updated_at: new Date().toISOString()
            })
            .eq('stripe_checkout_session_id', session.id)

          if (updateError) {
            console.error('Error updating subscription order:', updateError)
          }

          // Log the successful subscription
          console.log(`Subscription ${session.subscription} activated for session ${session.id}`)
        }
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Update subscription order with subscription details
        const { error: updateError } = await supabase
          .from('subscription_orders')
          .update({
            stripe_subscription_id: subscription.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
            status: subscription.status === 'trialing' ? 'trialing' : 'active'
          })
          .eq('stripe_subscription_id', subscription.id)

        if (updateError) {
          console.error('Error updating subscription details:', updateError)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Map Stripe status to our status
        let status = 'active'
        switch (subscription.status) {
          case 'active':
            status = 'active'
            break
          case 'past_due':
          case 'unpaid':
            status = 'pending'
            break
          case 'canceled':
            status = 'cancelled'
            break
          case 'incomplete':
          case 'incomplete_expired':
            status = 'expired'
            break
          case 'trialing':
            status = 'trialing'
            break
          case 'paused':
            status = 'paused'
            break
        }

        // Update subscription order
        const { error: updateError } = await supabase
          .from('subscription_orders')
          .update({
            status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            next_billing_date: subscription.status === 'active' 
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)

        if (updateError) {
          console.error('Error updating subscription:', updateError)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Mark subscription as cancelled
        const { error: updateError } = await supabase
          .from('subscription_orders')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)

        if (updateError) {
          console.error('Error cancelling subscription:', updateError)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          // Log successful payment
          console.log(`Payment succeeded for subscription ${invoice.subscription}`)
          
          // Could update payment history here if needed
          const { error: logError } = await supabase
            .from('subscription_payments')
            .insert({
              subscription_id: invoice.subscription as string,
              amount: invoice.amount_paid / 100, // Convert from cents
              currency: invoice.currency,
              stripe_invoice_id: invoice.id,
              paid_at: new Date().toISOString()
            })

          if (logError) {
            console.error('Error logging payment:', logError)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          // Update subscription status to pending
          const { error: updateError } = await supabase
            .from('subscription_orders')
            .update({
              status: 'pending',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription)

          if (updateError) {
            console.error('Error updating subscription after failed payment:', updateError)
          }

          // Could send notification to user about failed payment
          console.log(`Payment failed for subscription ${invoice.subscription}`)
        }
        break
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Could send reminder email about trial ending
        console.log(`Trial ending soon for subscription ${subscription.id}`)
        
        // Update subscription with trial end date
        const { error: updateError } = await supabase
          .from('subscription_orders')
          .update({
            trial_ends_at: subscription.trial_end 
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null
          })
          .eq('stripe_subscription_id', subscription.id)

        if (updateError) {
          console.error('Error updating trial end date:', updateError)
        }
        break
      }

      default:
        console.log(`Unhandled subscription event type: ${event.type}`)
    }

    // Record webhook event
    await supabase
      .from('webhook_events')
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        payload: event.data.object,
        processed_at: new Date().toISOString()
      })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed' 
    }, { status: 500 })
  }
}