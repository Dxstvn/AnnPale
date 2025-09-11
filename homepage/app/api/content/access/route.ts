import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ContentAccessService } from '@/lib/services/content-access.service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const contentAccessService = new ContentAccessService(supabase as any)
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    const body = await request.json()
    const { contentId, contentType = 'post' } = body

    if (!contentId) {
      return NextResponse.json({ error: 'Content ID required' }, { status: 400 })
    }

    // Check access based on content type
    let accessResult
    
    if (contentType === 'post') {
      accessResult = await contentAccessService.checkPostAccess(contentId, user?.id)
    } else if (contentType === 'creator') {
      accessResult = await contentAccessService.checkCreatorAccess(contentId, user?.id)
    } else {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    // If no access, return appropriate error with details
    if (!accessResult.hasAccess) {
      const messages = {
        'not_authenticated': 'Please sign in to access this content',
        'no_subscription': 'Subscribe to access this content',
        'subscription_expired': 'Your subscription has expired',
        'tier_mismatch': 'Upgrade your subscription to access this content'
      }

      return NextResponse.json({
        hasAccess: false,
        reason: accessResult.reason,
        message: messages[accessResult.reason || 'no_subscription'],
        requiredTiers: accessResult.reason === 'tier_mismatch' 
          ? await contentAccessService.getRequiredTiers(contentId)
          : []
      }, { status: 403 })
    }

    // Return success with subscription details
    return NextResponse.json({
      hasAccess: true,
      subscription: accessResult.subscription
    })
  } catch (error) {
    console.error('Error checking content access:', error)
    return NextResponse.json({ 
      error: 'Failed to check content access' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const contentAccessService = new ContentAccessService(supabase as any)
    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get('creatorId')
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Return only public content for unauthenticated users
      const { data: publicPosts } = await supabase
        .from('posts')
        .select(`
          *,
          creator:profiles!posts_creator_id_fkey(
            id,
            display_name,
            username,
            profile_image_url
          )
        `)
        .or('is_public.eq.true,is_preview.eq.true')
        .order('published_at', { ascending: false })
        .limit(20)

      return NextResponse.json({
        posts: publicPosts || [],
        hasFullAccess: false
      })
    }

    // Get accessible content for authenticated user
    const accessibleContent = await contentAccessService.getAccessibleContent(
      user.id,
      creatorId || undefined
    )

    // Get user's subscriptions
    let subscriptionsQuery = supabase
      .from('subscription_orders')
      .select(`
        *,
        subscription_tiers(*),
        profiles!subscription_orders_creator_id_fkey(*)
      `)
      .eq('fan_id', user.id)
      .in('status', ['active', 'trialing'])

    if (creatorId) {
      subscriptionsQuery = subscriptionsQuery.eq('creator_id', creatorId)
    }

    const { data: subscriptions } = await subscriptionsQuery

    // Enhance posts with creator info
    const postIds = accessibleContent.map(p => p.id)
    let enhancedPosts = []
    
    if (postIds.length > 0) {
      const { data: postsWithCreators } = await supabase
        .from('posts')
        .select(`
          *,
          creator:profiles!posts_creator_id_fkey(
            id,
            display_name,
            username,
            profile_image_url
          )
        `)
        .in('id', postIds)
        .order('published_at', { ascending: false })

      enhancedPosts = postsWithCreators || []
    }

    return NextResponse.json({
      posts: enhancedPosts,
      subscriptions: subscriptions || [],
      hasFullAccess: subscriptions && subscriptions.length > 0
    })
  } catch (error) {
    console.error('Error fetching accessible content:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch content' 
    }, { status: 500 })
  }
}