import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { creatorId, tierId } = body

    // Validate required fields
    if (!creatorId || !tierId) {
      return NextResponse.json(
        { error: 'Creator ID and Tier ID are required' },
        { status: 400 }
      )
    }

    // Check if user already has an active subscription to this creator
    const { data: existingSubscription } = await supabase
      .from('creator_subscriptions')
      .select('id, status')
      .eq('subscriber_id', user.id)
      .eq('creator_id', creatorId)
      .eq('status', 'active')
      .single()

    if (existingSubscription) {
      return NextResponse.json(
        { 
          error: 'You already have an active subscription to this creator',
          existingSubscriptionId: existingSubscription.id 
        },
        { status: 400 }
      )
    }

    // Get tier details
    const { data: tier, error: tierError } = await supabase
      .from('creator_subscription_tiers')
      .select('*')
      .eq('id', tierId)
      .eq('is_active', true)
      .single()

    if (tierError || !tier) {
      return NextResponse.json(
        { error: 'Subscription tier not found or inactive' },
        { status: 404 }
      )
    }

    // Create new subscription
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1) // Default to 1 month

    const { data: newSubscription, error: subError } = await supabase
      .from('creator_subscriptions')
      .insert({
        subscriber_id: user.id,
        creator_id: creatorId,
        tier_id: tierId,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        // For demo/testing, we're not using Stripe yet
        stripe_subscription_id: `demo_${Date.now()}`
      })
      .select()
      .single()

    if (subError) {
      console.error('Subscription creation error:', subError)
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      subscription: newSubscription,
      redirectUrl: `/fan/creators/${creatorId}?subscription=success`
    }, { status: 201 })

  } catch (error) {
    console.error('Subscribe error:', error)
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

    const { searchParams } = new URL(request.url)
    const subscriptionId = searchParams.get('id')

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }

    // Cancel subscription (set status to cancelled and update cancelled_at)
    const { error } = await supabase
      .from('creator_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .eq('subscriber_id', user.id) // Ensure user can only cancel their own subscriptions

    if (error) {
      console.error('Cancel subscription error:', error)
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Subscription cancelled successfully'
    })

  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}