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

    // Check if user is a creator
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'creator') {
      return NextResponse.json(
        { error: 'Only creators can access posts' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'published'
    const contentType = searchParams.get('contentType')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query for creator's posts
    let query = supabase
      .from('posts')
      .select(`
        *,
        creator:profiles!posts_creator_id_fkey(
          id,
          display_name,
          username,
          avatar_url
        )
      `, { count: 'exact' })
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by status
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    // Filter by content type if specified
    if (contentType && contentType !== 'all') {
      query = query.eq('content_type', contentType)
    }

    const { data: posts, error, count } = await query

    if (error) {
      console.error('Failed to fetch creator posts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    // Format posts with tier information
    const formattedPosts = posts?.map(post => ({
      ...post,
      access_tiers: post.post_access_tiers?.map((at: any) => at.tier) || []
    })) || []

    return NextResponse.json({
      posts: formattedPosts,
      total: count || 0,
      has_more: (count || 0) > offset + limit
    })

  } catch (error) {
    console.error('Get creator posts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a creator
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, display_name')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'creator') {
      return NextResponse.json(
        { error: 'Only creators can create posts' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      content_type,
      thumbnail_url,
      video_url,
      image_url,
      access_tier_ids = [],
      is_public = false,
      is_preview = false,
      is_featured = false,
      preview_order,
      status = 'published'
    } = body

    // Validate required fields
    if (!title || !content_type) {
      return NextResponse.json(
        { error: 'Title and content type are required' },
        { status: 400 }
      )
    }

    // Validate content URLs based on type
    if (content_type === 'video' && !video_url) {
      return NextResponse.json(
        { error: 'Video URL is required for video posts' },
        { status: 400 }
      )
    }
    if (content_type === 'image' && !image_url) {
      return NextResponse.json(
        { error: 'Image URL is required for image posts' },
        { status: 400 }
      )
    }

    // Start transaction
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        creator_id: user.id,
        title,
        description,
        content_type,
        thumbnail_url,
        video_url,
        image_url,
        access_tier_ids,
        is_public,
        is_preview,
        is_featured,
        preview_order,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null
      })
      .select(`
        *,
        creator:profiles!posts_creator_id_fkey(
          id,
          display_name,
          username,
          avatar_url
        )
      `)
      .single()

    if (postError) {
      console.error('Failed to create post:', postError)
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      )
    }

    // If access tiers are specified, create the tier relationships
    if (access_tier_ids.length > 0) {
      const tierRelationships = access_tier_ids.map((tierId: string) => ({
        post_id: post.id,
        tier_id: tierId
      }))

      const { error: tierError } = await supabase
        .from('post_access_tiers')
        .insert(tierRelationships)

      if (tierError) {
        console.error('Failed to create tier relationships:', tierError)
        // Continue - post is created but tier relationships failed
      }
    }

    // Send notifications to subscribers for published posts
    if (status === 'published' && (is_public || access_tier_ids.length > 0)) {
      let subscriberQuery = supabase
        .from('subscription_orders')
        .select('user_id, tier_id')
        .eq('creator_id', user.id)
        .eq('status', 'active')

      const { data: subscribers } = await subscriberQuery

      if (subscribers && subscribers.length > 0) {
        // Filter subscribers based on access tiers if applicable
        let notificationUsers = subscribers
        if (!is_public && access_tier_ids.length > 0) {
          notificationUsers = subscribers.filter(sub => 
            access_tier_ids.includes(sub.tier_id)
          )
        }

        if (notificationUsers.length > 0) {
          const notifications = notificationUsers.map(sub => ({
            user_id: sub.user_id,
            type: 'new_post',
            title: 'New Post',
            message: `${profile.display_name} posted: ${title}`,
            metadata: {
              post_id: post.id,
              creator_id: user.id,
              content_type
            }
          }))

          await supabase
            .from('notifications')
            .insert(notifications)
        }
      }
    }

    return NextResponse.json({ post }, { status: 201 })

  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}