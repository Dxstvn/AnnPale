import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SANDBOX_SECRET_KEY
  ? new Stripe((process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SANDBOX_SECRET_KEY)!, {
      apiVersion: '2024-11-20.acacia',
    })
  : null

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({
        error: 'Stripe is not configured',
        fallback: true
      }, { status: 503 })
    }

    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { subscriptionId } = body

    if (!subscriptionId) {
      return NextResponse.json({
        error: 'Subscription ID is required'
      }, { status: 400 })
    }

    // First, try to get subscription from creator_subscriptions table
    const { data: creatorSub, error: creatorSubError } = await supabase
      .from('creator_subscriptions')
      .select('*, creator:profiles!creator_subscriptions_creator_id_fkey(*)')
      .eq('id', subscriptionId)
      .eq('subscriber_id', user.id)
      .single()

    let stripeCustomerId: string | null = null

    if (creatorSub && !creatorSubError) {
      // Get the user's Stripe customer ID from their profile
      const { data: fanProfile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single()

      stripeCustomerId = fanProfile?.stripe_customer_id

      // If no customer ID in profile, try to find it from existing subscriptions
      if (!stripeCustomerId && creatorSub.stripe_subscription_id) {
        try {
          const stripeSubscription = await stripe.subscriptions.retrieve(creatorSub.stripe_subscription_id)
          stripeCustomerId = stripeSubscription.customer as string

          // Save customer ID for future use
          await supabase
            .from('profiles')
            .update({ stripe_customer_id: stripeCustomerId })
            .eq('id', user.id)
        } catch (error) {
          console.error('Error retrieving Stripe subscription:', error)
        }
      }
    } else {
      // Try subscription_orders table as fallback
      const { data: order, error: orderError } = await supabase
        .from('subscription_orders')
        .select('*')
        .eq('id', subscriptionId)
        .eq('fan_id', user.id)
        .single()

      if (order && !orderError && order.stripe_subscription_id) {
        try {
          const stripeSubscription = await stripe.subscriptions.retrieve(order.stripe_subscription_id)
          stripeCustomerId = stripeSubscription.customer as string
        } catch (error) {
          console.error('Error retrieving Stripe subscription:', error)
        }
      }
    }

    // If still no customer ID, create one
    if (!stripeCustomerId) {
      // Get user details for creating customer
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('id', user.id)
        .single()

      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.name,
        metadata: {
          user_id: user.id
        }
      })

      stripeCustomerId = customer.id

      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id)
    }

    // Create a Stripe Customer Portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/fan/settings`,
    })

    return NextResponse.json({
      url: session.url,
      success: true
    })
  } catch (error) {
    console.error('Error creating payment portal session:', error)
    return NextResponse.json({
      error: 'Failed to open payment settings'
    }, { status: 500 })
  }
}