import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Helper function to validate JWT format
function isValidJWTFormat(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false

    // Check if all parts are valid base64url
    for (const part of parts) {
      if (!/^[A-Za-z0-9_-]*$/.test(part)) return false
    }
    return true
  } catch {
    return false
  }
}

// Helper function to handle authentication with enhanced error reporting
async function authenticateUser(supabase: any): Promise<{
  user: any | null,
  error: any | null,
  authCode: string | null
}> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      let authCode = 'AUTH_ERROR'

      if (authError.message?.includes('Invalid Base64-URL character')) {
        authCode = 'JWT_MALFORMED'
      } else if (authError.message?.includes('JWT')) {
        authCode = 'JWT_ERROR'
      } else if (authError.message?.includes('expired')) {
        authCode = 'TOKEN_EXPIRED'
      } else if (authError.message?.includes('session missing')) {
        authCode = 'SESSION_MISSING'
      }

      return { user: null, error: authError, authCode }
    }

    return { user, error: null, authCode: null }
  } catch (error) {
    return { user: null, error, authCode: 'UNEXPECTED_ERROR' }
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Use enhanced authentication helper
    const { user, error: authError, authCode } = await authenticateUser(supabase)

    if (authError || !user) {
      console.error('Authentication failed:', {
        message: authError?.message,
        status: authError?.status,
        code: authCode,
        userExists: !!user
      })

      const errorResponses = {
        JWT_MALFORMED: {
          error: 'Authentication token is malformed',
          code: 'JWT_MALFORMED',
          message: 'Your session is corrupted. Please sign in again.',
          action: 'SIGN_IN_REQUIRED'
        },
        JWT_ERROR: {
          error: 'Invalid authentication token',
          code: 'JWT_ERROR',
          message: 'Please sign in again',
          action: 'SIGN_IN_REQUIRED'
        },
        TOKEN_EXPIRED: {
          error: 'Authentication token expired',
          code: 'TOKEN_EXPIRED',
          message: 'Your session has expired. Please sign in again.',
          action: 'SIGN_IN_REQUIRED'
        },
        SESSION_MISSING: {
          error: 'No active session',
          code: 'SESSION_MISSING',
          message: 'Please sign in to access this resource',
          action: 'SIGN_IN_REQUIRED'
        },
        AUTH_ERROR: {
          error: 'Authentication failed',
          code: 'AUTH_ERROR',
          message: 'Please verify your authentication',
          action: 'CHECK_CONNECTION'
        }
      }

      const response = errorResponses[authCode as keyof typeof errorResponses] || errorResponses.AUTH_ERROR

      return NextResponse.json(response, { status: 401 })
    }

    console.log(`Subscriptions request from user: ${user.id}`)

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const creatorId = searchParams.get('creatorId')

    // Build query for subscription_orders table (the authoritative source)
    let query = supabase
      .from('subscription_orders')
      .select(`
        *,
        tier:creator_subscription_tiers(
          id,
          tier_name,
          price,
          benefits,
          description,
          billing_period
        ),
        creator:profiles!subscription_orders_creator_id_fkey(
          id,
          name,
          username,
          email,
          avatar_url,
          bio
        )
      `)
      .eq('user_id', user.id) // Note: subscription_orders uses 'user_id' not 'subscriber_id'
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
      started_at: sub.created_at, // subscription_orders uses created_at
      expires_at: sub.current_period_end, // subscription_orders uses current_period_end
      cancelled_at: sub.cancelled_at,
      billing_period: sub.billing_period,
      stripe_subscription_id: sub.stripe_subscription_id,
      next_billing_date: sub.next_billing_date,
      total_amount: sub.total_amount,
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
        price: sub.tier?.price || sub.total_amount || 0,
        benefits: sub.tier?.benefits || [],
        description: sub.tier?.description,
        billing_period: sub.tier?.billing_period || sub.billing_period
      },
      // Calculate if subscription is expired
      is_expired: sub.status === 'expired' ||
        (sub.current_period_end ? new Date(sub.current_period_end) < new Date() : false),
      // Calculate days remaining
      days_remaining: sub.current_period_end ?
        Math.max(0, Math.ceil((new Date(sub.current_period_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) :
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

    // Use enhanced authentication helper
    const { user, error: authError, authCode } = await authenticateUser(supabase)

    if (authError || !user) {
      console.error('PATCH Authentication failed:', {
        message: authError?.message,
        code: authCode,
        userExists: !!user
      })

      const errorResponses = {
        JWT_MALFORMED: {
          error: 'Authentication token is malformed',
          code: 'JWT_MALFORMED',
          message: 'Your session is corrupted. Please sign in again.',
          action: 'SIGN_IN_REQUIRED'
        },
        SESSION_MISSING: {
          error: 'No active session',
          code: 'SESSION_MISSING',
          message: 'Please sign in to manage subscriptions',
          action: 'SIGN_IN_REQUIRED'
        }
      }

      const response = errorResponses[authCode as keyof typeof errorResponses] || {
        error: 'Authentication failed',
        code: authCode || 'AUTH_ERROR',
        message: 'Please sign in to manage subscriptions',
        action: 'SIGN_IN_REQUIRED'
      }

      return NextResponse.json(response, { status: 401 })
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
      .from('subscription_orders')
      .select('*')
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
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
        const expiryField = subscription.current_period_end || subscription.expires_at
        if (expiryField && new Date(expiryField) < new Date()) {
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
      .from('subscription_orders')
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