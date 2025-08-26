import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
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
      } else {
        // In development without webhook secret, parse event directly
        event = JSON.parse(body) as Stripe.Event
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update payment intent status in database
        const { error: updateError } = await supabase
          .from('payment_intents')
          .update({
            status: 'succeeded',
            updated_at: new Date().toISOString()
          })
          .eq('id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating payment intent:', updateError)
        }

        // Create order if this is for a video request
        if (paymentIntent.metadata.creatorId) {
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: paymentIntent.metadata.userId,
              creator_id: paymentIntent.metadata.creatorId,
              payment_intent_id: paymentIntent.id,
              amount: paymentIntent.amount / 100, // Convert from cents
              currency: paymentIntent.currency,
              status: 'pending',
              metadata: paymentIntent.metadata,
              created_at: new Date().toISOString()
            })
            .select()
            .single()

          if (orderError) {
            console.error('Error creating order:', orderError)
          } else {
            console.log('Order created:', order)
            
            // Send notification to creator
            // This would be implemented with your notification service
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update payment intent status
        const { error } = await supabase
          .from('payment_intents')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', paymentIntent.id)

        if (error) {
          console.error('Error updating failed payment:', error)
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        
        // Update order status if refunded
        if (charge.payment_intent) {
          const { error } = await supabase
            .from('orders')
            .update({
              status: 'refunded',
              updated_at: new Date().toISOString()
            })
            .eq('payment_intent_id', charge.payment_intent)

          if (error) {
            console.error('Error updating refunded order:', error)
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // Handle subscription events if you implement subscription plans
        const subscription = event.data.object as Stripe.Subscription
        console.log('Subscription event:', event.type, subscription.id)
        break
      }

      case 'checkout.session.completed': {
        // Handle successful checkout sessions
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout completed:', session.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Log webhook event
    const { error: logError } = await supabase
      .from('webhook_events')
      .insert({
        provider: 'stripe',
        event_type: event.type,
        event_id: event.id,
        payload: event,
        processed_at: new Date().toISOString()
      })

    if (logError) {
      console.error('Error logging webhook event:', logError)
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