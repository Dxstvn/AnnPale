import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({
        error: 'Authentication required',
        valid: false
      }, { status: 401 })
    }

    const body = await request.json()
    const { type, tierId, creatorId, requestId } = body

    // Validate based on checkout type
    if (type === 'subscription' && tierId && creatorId) {
      // Validate subscription checkout

      // 1. Verify tier exists
      const { data: tier, error: tierError } = await supabase
        .from('creator_subscription_tiers')
        .select('*')
        .eq('id', tierId)
        .single()

      if (tierError || !tier) {
        return NextResponse.json({
          error: 'Invalid subscription tier',
          valid: false
        }, { status: 400 })
      }

      // 2. Verify tier belongs to the specified creator
      if (tier.creator_id !== creatorId) {
        return NextResponse.json({
          error: 'Tier does not belong to this creator',
          valid: false
        }, { status: 400 })
      }

      // 3. Verify creator exists and is active
      const { data: creator, error: creatorError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, stripe_account_id')
        .eq('id', creatorId)
        .single()

      if (creatorError || !creator) {
        return NextResponse.json({
          error: 'Creator not found',
          valid: false
        }, { status: 400 })
      }

      // 4. Check if tier is active
      if (tier.is_active === false) {
        return NextResponse.json({
          error: 'This subscription tier is no longer available',
          valid: false
        }, { status: 400 })
      }

      // 5. Check if user is already subscribed to this tier
      const { data: existingSubscription } = await supabase
        .from('creator_subscriptions')
        .select('*')
        .eq('fan_id', user.id)
        .eq('creator_id', creatorId)
        .eq('subscription_tier_id', tierId)
        .in('status', ['active', 'trialing'])
        .single()

      if (existingSubscription) {
        return NextResponse.json({
          error: 'You are already subscribed to this tier',
          valid: false,
          existingSubscription: true
        }, { status: 400 })
      }

      // Return validated checkout data
      return NextResponse.json({
        valid: true,
        type: 'subscription',
        checkoutData: {
          tier: {
            id: tier.id,
            name: tier.tier_name,
            description: tier.description,
            price: tier.price, // Server-validated price
            features: tier.features || [],
            billingPeriod: 'monthly'
          },
          creator: {
            id: creator.id,
            name: creator.display_name,
            avatar: creator.avatar_url,
            hasPaymentSetup: !!creator.stripe_account_id
          }
        }
      })

    } else if (type === 'video' && requestId) {
      // Validate video checkout

      // 1. Verify video request exists
      const { data: videoRequest, error: requestError } = await supabase
        .from('video_requests')
        .select(`
          *,
          creator:creator_id (
            id,
            display_name,
            avatar_url,
            stripe_account_id
          )
        `)
        .eq('id', requestId)
        .single()

      if (requestError || !videoRequest) {
        return NextResponse.json({
          error: 'Invalid video request',
          valid: false
        }, { status: 400 })
      }

      // 2. Verify request belongs to the user
      if (videoRequest.fan_id !== user.id) {
        return NextResponse.json({
          error: 'This video request does not belong to you',
          valid: false
        }, { status: 403 })
      }

      // 3. Check request status
      if (videoRequest.status !== 'pending_payment') {
        return NextResponse.json({
          error: `Cannot process payment for request with status: ${videoRequest.status}`,
          valid: false
        }, { status: 400 })
      }

      // Return validated checkout data
      return NextResponse.json({
        valid: true,
        type: 'video',
        checkoutData: {
          request: {
            id: videoRequest.id,
            recipientName: videoRequest.recipient_name,
            occasion: videoRequest.occasion,
            instructions: videoRequest.instructions,
            price: videoRequest.price, // Server-validated price
            rushDelivery: videoRequest.rush_delivery || false,
            requestType: videoRequest.request_type
          },
          creator: {
            id: videoRequest.creator.id,
            name: videoRequest.creator.display_name,
            avatar: videoRequest.creator.avatar_url,
            hasPaymentSetup: !!videoRequest.creator.stripe_account_id
          }
        }
      })

    } else {
      return NextResponse.json({
        error: 'Invalid checkout parameters',
        valid: false
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Checkout validation error:', error)
    return NextResponse.json({
      error: 'Failed to validate checkout',
      valid: false
    }, { status: 500 })
  }
}

// GET endpoint for initial page load validation
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const tierId = searchParams.get('tier')
  const creatorId = searchParams.get('creator')
  const requestId = searchParams.get('requestId')

  // Delegate to POST handler with same logic
  return POST(new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ type, tierId, creatorId, requestId }),
    headers: request.headers
  }))
}