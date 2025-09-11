import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SANDBOX_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia'
    })
  : null

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const creatorId = searchParams.get('creatorId')

    // Build query
    let query = supabase
      .from('subscription_orders')
      .select(`
        *,
        tier:creator_subscription_tiers(*),
        creator:profiles!subscription_orders_creator_id_fkey(
          id,
          display_name,
          username
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }
    if (creatorId) {
      query = query.eq('creator_id', creatorId)
    }

    const { data: subscriptions, error } = await query

    if (error) {
      console.error('Failed to fetch subscriptions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error('Get subscriptions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, action } = body

    if (!orderId || !action) {
      return NextResponse.json(
        { error: 'Order ID and action are required' },
        { status: 400 }
      )
    }

    // Get subscription order
    const { data: order, error: orderError } = await supabase
      .from('subscription_orders')
      .select('*, creator:profiles!subscription_orders_creator_id_fkey(display_name)')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    let newStatus = order.status
    let eventType = ''
    let stripeAction = null

    switch (action) {
      case 'pause':
        if (order.status !== 'active') {
          return NextResponse.json(
            { error: 'Can only pause active subscriptions' },
            { status: 400 }
          )
        }
        newStatus = 'paused'
        eventType = 'subscription_paused'
        if (order.stripe_subscription_id && stripe) {
          stripeAction = () => stripe.subscriptions.update(order.stripe_subscription_id, {
            pause_collection: { behavior: 'void' }
          })
        }
        break

      case 'resume':
        if (order.status !== 'paused') {
          return NextResponse.json(
            { error: 'Can only resume paused subscriptions' },
            { status: 400 }
          )
        }
        newStatus = 'active'
        eventType = 'subscription_resumed'
        if (order.stripe_subscription_id && stripe) {
          stripeAction = () => stripe.subscriptions.update(order.stripe_subscription_id, {
            pause_collection: null
          })
        }
        break

      case 'cancel':
        if (!['active', 'paused'].includes(order.status)) {
          return NextResponse.json(
            { error: 'Cannot cancel this subscription' },
            { status: 400 }
          )
        }
        newStatus = 'cancelled'
        eventType = 'subscription_cancelled'
        if (order.stripe_subscription_id && stripe) {
          stripeAction = () => stripe.subscriptions.update(order.stripe_subscription_id, {
            cancel_at_period_end: true
          })
        }
        break

      case 'reactivate':
        if (order.status !== 'cancelled' || !order.current_period_end || 
            new Date(order.current_period_end) < new Date()) {
          return NextResponse.json(
            { error: 'Cannot reactivate this subscription' },
            { status: 400 }
          )
        }
        newStatus = 'active'
        eventType = 'subscription_reactivated'
        if (order.stripe_subscription_id && stripe) {
          stripeAction = () => stripe.subscriptions.update(order.stripe_subscription_id, {
            cancel_at_period_end: false
          })
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Execute Stripe action if needed
    if (stripeAction) {
      try {
        await stripeAction()
      } catch (stripeError: any) {
        console.error('Stripe error:', stripeError)
        return NextResponse.json(
          { error: 'Failed to update subscription with payment provider' },
          { status: 500 }
        )
      }
    }

    // Update subscription status
    const { error: updateError } = await supabase
      .from('subscription_orders')
      .update({
        status: newStatus,
        ...(action === 'cancel' && { cancelled_at: new Date().toISOString() }),
        ...(action === 'pause' && { paused_at: new Date().toISOString() }),
        ...(action === 'resume' && { paused_at: null })
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Failed to update subscription:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      )
    }

    // Log the event
    await supabase
      .from('order_events')
      .insert({
        order_id: orderId,
        event_type: eventType,
        metadata: {
          action,
          previous_status: order.status,
          new_status: newStatus
        }
      })

    // Send notification to creator for cancellation
    if (action === 'cancel') {
      await supabase
        .from('notifications')
        .insert({
          user_id: order.creator_id,
          type: 'subscription_cancelled',
          title: 'Subscription Cancelled',
          message: `A subscriber cancelled their ${order.tier?.tier_name || 'subscription'}`,
          metadata: {
            order_id: orderId,
            subscriber_id: user.id
          }
        })
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: orderId,
        status: newStatus
      }
    })

  } catch (error) {
    console.error('Manage subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get subscription order
    const { data: order, error: orderError } = await supabase
      .from('subscription_orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of cancelled or expired subscriptions
    if (!['cancelled', 'expired'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Can only delete cancelled or expired subscriptions' },
        { status: 400 }
      )
    }

    // If there's a Stripe subscription, cancel it immediately
    if (order.stripe_subscription_id && stripe) {
      try {
        await stripe.subscriptions.cancel(order.stripe_subscription_id, {
          prorate: false
        })
      } catch (stripeError: any) {
        console.error('Stripe cancellation error:', stripeError)
        // Continue even if Stripe fails - subscription might already be cancelled
      }
    }

    // Delete the subscription order
    const { error: deleteError } = await supabase
      .from('subscription_orders')
      .delete()
      .eq('id', orderId)

    if (deleteError) {
      console.error('Failed to delete subscription:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription deleted successfully'
    })

  } catch (error) {
    console.error('Delete subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}