import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Build query for creator_subscriptions table
    let query = supabase
      .from('creator_subscriptions')
      .select(`
        *,
        tier:creator_subscription_tiers(
          id,
          tier_name,
          price,
          benefits,
          description
        ),
        creator:profiles!creator_subscriptions_creator_id_fkey(
          id,
          name,
          username,
          email,
          avatar_url,
          bio
        )
      `)
      .eq('subscriber_id', user.id)
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

    // Format subscriptions for the frontend
    const formattedSubscriptions = subscriptions?.map(sub => ({
      id: sub.id,
      status: sub.status,
      started_at: sub.started_at,
      expires_at: sub.expires_at,
      cancelled_at: sub.cancelled_at,
      creator: {
        id: sub.creator?.id,
        name: sub.creator?.name || 'Unknown Creator',
        username: sub.creator?.username,
        avatar_url: sub.creator?.avatar_url || '/placeholder.svg',
        bio: sub.creator?.bio
      },
      tier: {
        id: sub.tier?.id,
        name: sub.tier?.tier_name || 'Basic',
        price: sub.tier?.price || 0,
        benefits: sub.tier?.benefits || [],
        description: sub.tier?.description
      },
      // Calculate if subscription is expired
      is_expired: sub.expires_at ? new Date(sub.expires_at) < new Date() : false,
      // Calculate days remaining
      days_remaining: sub.expires_at ? 
        Math.max(0, Math.ceil((new Date(sub.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 
        null
    }))

    return NextResponse.json({ 
      subscriptions: formattedSubscriptions || [],
      total: formattedSubscriptions?.length || 0
    })
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
    const { subscriptionId, action } = body

    if (!subscriptionId || !action) {
      return NextResponse.json(
        { error: 'Subscription ID and action are required' },
        { status: 400 }
      )
    }

    // Get subscription
    const { data: subscription, error: subError } = await supabase
      .from('creator_subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('subscriber_id', user.id)
      .single()

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    let updates: any = {}

    switch (action) {
      case 'cancel':
        if (subscription.status !== 'active') {
          return NextResponse.json(
            { error: 'Can only cancel active subscriptions' },
            { status: 400 }
          )
        }
        updates = {
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        }
        break

      case 'reactivate':
        if (subscription.status !== 'cancelled') {
          return NextResponse.json(
            { error: 'Can only reactivate cancelled subscriptions' },
            { status: 400 }
          )
        }
        // Check if not expired
        if (subscription.expires_at && new Date(subscription.expires_at) < new Date()) {
          return NextResponse.json(
            { error: 'Cannot reactivate expired subscription' },
            { status: 400 }
          )
        }
        updates = {
          status: 'active',
          cancelled_at: null
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Update subscription
    const { error: updateError } = await supabase
      .from('creator_subscriptions')
      .update(updates)
      .eq('id', subscriptionId)

    if (updateError) {
      console.error('Failed to update subscription:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscriptionId,
        status: updates.status || subscription.status
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