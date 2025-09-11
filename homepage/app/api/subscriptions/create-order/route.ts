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
    const { creatorId, tierId, message } = body

    // Validate required fields
    if (!creatorId || !tierId) {
      return NextResponse.json(
        { error: 'Creator ID and Tier ID are required' },
        { status: 400 }
      )
    }

    // Get tier details with creator info
    const { data: tier, error: tierError } = await supabase
      .from('creator_subscription_tiers')
      .select(`
        *,
        creator:profiles!creator_subscription_tiers_creator_id_fkey(
          id,
          display_name,
          username,
          email
        )
      `)
      .eq('id', tierId)
      .eq('is_active', true)
      .single()

    if (tierError || !tier) {
      console.error('Tier fetch error:', tierError)
      return NextResponse.json(
        { error: 'Subscription tier not found or inactive' },
        { status: 404 }
      )
    }

    // Check if user already has an active subscription to this creator
    const { data: existingSubscription } = await supabase
      .from('subscription_orders')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('creator_id', creatorId)
      .in('status', ['active', 'trialing'])
      .single()

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'You already have an active subscription to this creator' },
        { status: 400 }
      )
    }

    // Calculate dates
    const now = new Date()
    const nextBillingDate = new Date(now)
    if (tier.billing_period === 'monthly') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
    } else if (tier.billing_period === 'yearly') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
    }

    // Create subscription order
    const { data: order, error: orderError } = await supabase
      .from('subscription_orders')
      .insert({
        user_id: user.id,
        creator_id: creatorId,
        tier_id: tierId,
        status: 'pending',
        amount: tier.price,
        currency: 'USD',
        billing_period: tier.billing_period,
        next_billing_date: nextBillingDate.toISOString(),
        metadata: {
          tier_name: tier.tier_name,
          message: message || null,
          features: tier.features,
          benefits: tier.benefits
        }
      })
      .select(`
        *,
        tier:creator_subscription_tiers(
          *
        ),
        creator:profiles!subscription_orders_creator_id_fkey(
          id,
          display_name,
          username,
          profile_image_url,
          email
        )
      `)
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: 'Failed to create subscription order' },
        { status: 500 }
      )
    }

    // Log the subscription event
    await supabase
      .from('order_events')
      .insert({
        order_id: order.id,
        event_type: 'subscription_created',
        metadata: {
          tier_id: tierId,
          tier_name: tier.tier_name,
          amount: tier.price,
          billing_period: tier.billing_period
        }
      })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Create subscription order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}