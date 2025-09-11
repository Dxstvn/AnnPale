import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get post with access control
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        creator:profiles!posts_creator_id_fkey(
          id,
          display_name,
          username,
          profile_image_url
        ),
        post_access_tiers(
          tier:creator_subscription_tiers(
            id,
            name,
            price
          )
        ),
        post_likes(count),
        post_views(count),
        post_comments(count)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user can access this post
    const canAccess = post.creator_id === user.id || post.is_public
    if (!canAccess) {
      // Check if user has subscription for this creator
      const { data: subscription } = await supabase
        .from('subscription_orders')
        .select('tier_id')
        .eq('user_id', user.id)
        .eq('creator_id', post.creator_id)
        .eq('status', 'active')
        .single()

      if (!subscription) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }

      // Check if user's tier has access to this post
      if (post.access_tier_ids?.length > 0 && 
          !post.access_tier_ids.includes(subscription.tier_id)) {
        return NextResponse.json(
          { error: 'Tier access required' },
          { status: 403 }
        )
      }
    }

    // Format response
    const formattedPost = {
      ...post,
      access_tiers: post.post_access_tiers?.map((at: any) => at.tier) || [],
      likes_count: post.post_likes?.[0]?.count || 0,
      views_count: post.post_views?.[0]?.count || 0,
      comments_count: post.post_comments?.[0]?.count || 0
    }

    // Track view if not the creator
    if (user.id !== post.creator_id) {
      await supabase
        .from('post_views')
        .upsert({
          post_id: id,
          user_id: user.id,
          viewed_date: new Date().toISOString().split('T')[0]
        }, {
          onConflict: 'post_id,user_id,viewed_date'
        })
    }

    return NextResponse.json({ post: formattedPost })

  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify post ownership
    const { data: existingPost } = await supabase
      .from('posts')
      .select('creator_id')
      .eq('id', id)
      .single()

    if (!existingPost || existingPost.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Post not found or access denied' },
        { status: 404 }
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
      is_public,
      is_preview,
      is_featured,
      preview_order,
      status
    } = body

    // Update post
    const { data: post, error: updateError } = await supabase
      .from('posts')
      .update({
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
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        creator:profiles!posts_creator_id_fkey(
          id,
          display_name,
          username,
          profile_image_url
        )
      `)
      .single()

    if (updateError) {
      console.error('Failed to update post:', updateError)
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      )
    }

    // Update tier relationships
    if (access_tier_ids) {
      // Delete existing relationships
      await supabase
        .from('post_access_tiers')
        .delete()
        .eq('post_id', id)

      // Insert new relationships
      if (access_tier_ids.length > 0) {
        const tierRelationships = access_tier_ids.map((tierId: string) => ({
          post_id: id,
          tier_id: tierId
        }))

        await supabase
          .from('post_access_tiers')
          .insert(tierRelationships)
      }
    }

    return NextResponse.json({ post })

  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify post ownership
    const { data: existingPost } = await supabase
      .from('posts')
      .select('creator_id')
      .eq('id', id)
      .single()

    if (!existingPost || existingPost.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Post not found or access denied' },
        { status: 404 }
      )
    }

    // Archive post instead of hard delete to maintain data integrity
    const { error: deleteError } = await supabase
      .from('posts')
      .update({
        status: 'archived',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (deleteError) {
      console.error('Failed to archive post:', deleteError)
      return NextResponse.json(
        { error: 'Failed to archive post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}