import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if post exists and user has access
    const { data: post } = await supabase
      .from('posts')
      .select('id, creator_id, is_public, access_tier_ids')
      .eq('id', postId)
      .eq('status', 'published')
      .single()

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check access rights (if not public and not creator)
    if (!post.is_public && post.creator_id !== user.id) {
      const { data: subscription } = await supabase
        .from('subscription_orders')
        .select('tier_id')
        .eq('user_id', user.id)
        .eq('creator_id', post.creator_id)
        .eq('status', 'active')
        .single()

      if (!subscription || 
          (post.access_tier_ids?.length > 0 && 
           !post.access_tier_ids.includes(subscription.tier_id))) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
    }

    // Toggle like
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single()

    let isLiked = false

    if (existingLike) {
      // Unlike - remove like
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id)

      if (error) {
        console.error('Failed to unlike post:', error)
        return NextResponse.json(
          { error: 'Failed to unlike post' },
          { status: 500 }
        )
      }
      isLiked = false
    } else {
      // Like - add like
      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id
        })

      if (error) {
        console.error('Failed to like post:', error)
        return NextResponse.json(
          { error: 'Failed to like post' },
          { status: 500 }
        )
      }
      isLiked = true
    }

    // Get updated like count
    const { data: likesCount } = await supabase
      .from('post_likes')
      .select('id', { count: 'exact' })
      .eq('post_id', postId)

    return NextResponse.json({ 
      isLiked,
      likesCount: likesCount?.length || 0
    })

  } catch (error) {
    console.error('Like post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}