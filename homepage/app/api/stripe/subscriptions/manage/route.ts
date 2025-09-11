import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
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
    const { 
      subscriptionOrderId,
      action // 'pause', 'resume', 'cancel'
    } = body

    // Fetch subscription order
    const { data: order, error: orderError } = await supabase
      .from('subscription_orders')
      .select('*, subscription_tiers(*)')
      .eq('id', subscriptionOrderId)
      .eq('fan_id', user.id) // Ensure user owns this subscription
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    if (!order.stripe_subscription_id) {
      return NextResponse.json({ 
        error: 'No Stripe subscription found' 
      }, { status: 400 })
    }

    let updatedSubscription: Stripe.Subscription

    switch (action) {
      case 'pause':
        // Pause subscription using Stripe's pause collection
        updatedSubscription = await stripe.subscriptions.update(
          order.stripe_subscription_id,
          {
            pause_collection: {
              behavior: 'mark_uncollectible'
            },
            metadata: {
              paused_at: new Date().toISOString()
            }
          }
        )

        // Update local database
        await supabase
          .from('subscription_orders')
          .update({ 
            status: 'paused',
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptionOrderId)
        
        break

      case 'resume':
        // Resume subscription
        updatedSubscription = await stripe.subscriptions.update(
          order.stripe_subscription_id,
          {
            pause_collection: null,
            metadata: {
              resumed_at: new Date().toISOString()
            }
          }
        )

        // Update local database
        await supabase
          .from('subscription_orders')
          .update({ 
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptionOrderId)
        
        break

      case 'cancel':
        // Cancel subscription at period end
        updatedSubscription = await stripe.subscriptions.update(
          order.stripe_subscription_id,
          {
            cancel_at_period_end: true,
            metadata: {
              cancelled_by: user.id,
              cancelled_at: new Date().toISOString()
            }
          }
        )

        // Update local database
        await supabase
          .from('subscription_orders')
          .update({ 
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptionOrderId)
        
        break

      case 'reactivate':
        // Reactivate a cancelled subscription (before period end)
        updatedSubscription = await stripe.subscriptions.update(
          order.stripe_subscription_id,
          {
            cancel_at_period_end: false,
            metadata: {
              reactivated_at: new Date().toISOString()
            }
          }
        )

        // Update local database
        await supabase
          .from('subscription_orders')
          .update({ 
            status: 'active',
            cancelled_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptionOrderId)
        
        break

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        cancel_at_period_end: updatedSubscription.cancel_at_period_end,
        current_period_end: updatedSubscription.current_period_end
      }
    })
  } catch (error) {
    console.error('Error managing subscription:', error)
    return NextResponse.json({ 
      error: 'Failed to manage subscription' 
    }, { status: 500 })
  }
}

// Get subscription details
export async function GET(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ 
        error: 'Stripe is not configured',
        fallback: true 
      }, { status: 503 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const subscriptionOrderId = searchParams.get('id')
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!subscriptionOrderId) {
      return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 })
    }

    // Fetch subscription order
    const { data: order, error: orderError } = await supabase
      .from('subscription_orders')
      .select('*, subscription_tiers(*), profiles!subscription_orders_creator_id_fkey(*)')
      .eq('id', subscriptionOrderId)
      .eq('fan_id', user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    // Get Stripe subscription details if available
    let stripeSubscription = null
    if (order.stripe_subscription_id) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(order.stripe_subscription_id)
      } catch (err) {
        console.error('Error fetching Stripe subscription:', err)
      }
    }

    return NextResponse.json({ 
      subscription: {
        ...order,
        stripe_details: stripeSubscription ? {
          status: stripeSubscription.status,
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          current_period_end: stripeSubscription.current_period_end,
          trial_end: stripeSubscription.trial_end,
          pause_collection: stripeSubscription.pause_collection
        } : null
      }
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch subscription' 
    }, { status: 500 })
  }
}