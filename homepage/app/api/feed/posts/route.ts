import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const searchParams = request.nextUrl.searchParams
    const creatorId = searchParams.get('creatorId')
    const contentType = searchParams.get('contentType')
    const isPreview = searchParams.get('preview') === 'true'
    const excludeLockedContent = searchParams.get('excludeLockedContent') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Check authentication for non-preview requests
    const { data: { user } } = await supabase.auth.getUser()

    // Build base query
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
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by creator if specified
    if (creatorId) {
      query = query.eq('creator_id', creatorId)
    }

    // Filter by content type if specified
    if (contentType) {
      query = query.eq('content_type', contentType)
    }

    // Handle preview mode (non-authenticated users)
    if (isPreview || !user) {
      query = query.eq('is_public', true)
    }

    const { data: posts, error, count } = await query

    if (error) {
      console.error('Failed to fetch posts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    // Process posts and check tier access for authenticated users
    let formattedPosts = posts || []
    
    if (user && formattedPosts.length > 0) {
      // Get user's active subscriptions with tier information
      const { data: userSubscriptions } = await supabase
        .from('subscription_orders')
        .select('creator_id, tier_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
      
      // Create a map of creator_id to tier_id for quick lookup
      const subscriptionMap = new Map<string, string>()
      userSubscriptions?.forEach(sub => {
        subscriptionMap.set(sub.creator_id, sub.tier_id)
      })
      
      const postIds = formattedPosts.map(p => p.id)
      
      // Get user's likes for these posts
      const { data: userLikes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds)
      
      const likedPostIds = new Set(userLikes?.map(like => like.post_id) || [])
      
      // Process each post to determine access and add metadata
      formattedPosts = formattedPosts.map(post => {
        // Determine if user has access to this post
        let hasAccess = false
        
        // Public posts are always accessible
        if (post.is_public) {
          hasAccess = true
        }
        // User's own posts are always accessible
        else if (post.creator_id === user.id) {
          hasAccess = true
        }
        // Check subscription and tier access
        else if (subscriptionMap.has(post.creator_id)) {
          const userTierId = subscriptionMap.get(post.creator_id)
          
          // If post has no tier restrictions, any subscription gives access
          if (!post.access_tier_ids || post.access_tier_ids.length === 0) {
            hasAccess = true
          }
          // Check if user's tier is in the allowed tiers
          else if (userTierId && post.access_tier_ids.includes(userTierId)) {
            hasAccess = true
          }
        }
        
        return {
          ...post,
          is_liked: likedPostIds.has(post.id),
          has_access: hasAccess
        }
      })
    } else if (!user) {
      // For non-authenticated users, mark all posts as having no access unless public
      formattedPosts = formattedPosts.map(post => ({
        ...post,
        has_access: post.is_public
      }))
    }

    // Filter out locked content if requested (for home feed)
    let finalPosts = formattedPosts
    if (excludeLockedContent) {
      finalPosts = formattedPosts.filter(post => post.has_access === true)
    }

    return NextResponse.json({
      posts: finalPosts,
      total: finalPosts.length,
      has_more: (count || 0) > offset + limit
    })

  } catch (error) {
    console.error('Get feed posts error:', error)
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
      .select('role')
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
      tier_required,
      is_public,
      is_preview,
      preview_duration,
      preview_order
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

    // If setting preview order, ensure it's unique
    if (preview_order !== undefined && preview_order !== null) {
      // Shift other preview posts if needed
      await supabase
        .from('posts')
        .update({ preview_order: null })
        .eq('creator_id', user.id)
        .eq('preview_order', preview_order)
    }

    // Create the post
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
        tier_required,
        is_public: is_public || false,
        is_preview: is_preview || false,
        preview_duration,
        preview_order,
        status: 'published'
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

    // Send notifications to subscribers if not a preview post
    if (!is_preview && !tier_required) {
      const { data: subscribers } = await supabase
        .from('creator_subscriptions')
        .select('subscriber_id')
        .eq('creator_id', user.id)
        .eq('status', 'active')

      if (subscribers && subscribers.length > 0) {
        const notifications = subscribers.map(sub => ({
          user_id: sub.subscriber_id,
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

    return NextResponse.json({ post }, { status: 201 })

  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}