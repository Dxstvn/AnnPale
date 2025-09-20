import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const supabase = await createClient()

    // Get query params for pagination
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Check authentication (optional for viewing)
    const { data: { user } } = await supabase.auth.getUser()

    // Check if post exists and is accessible
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

    // Check access rights if not public
    if (!post.is_public) {
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Check if user is creator or has subscription
      if (post.creator_id !== user.id) {
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
    }

    // Fetch comments first
    const { data: comments, error, count } = await supabase
      .from('post_comments')
      .select('*', { count: 'exact' })
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Failed to fetch comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    // Fetch user profiles for comments
    let enrichedComments = comments || []
    if (comments && comments.length > 0) {
      const userIds = [...new Set(comments.map(c => c.user_id).filter(Boolean))]
      const parentIds = [...new Set(comments.map(c => c.parent_comment_id).filter(Boolean))]

      // Fetch user profiles
      // Using select('*') to ensure resilience to database schema changes
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds)

      // Fetch parent comments if any
      let parentComments: any[] = []
      if (parentIds.length > 0) {
        const { data: parents } = await supabase
          .from('post_comments')
          .select('id, user_id')
          .in('id', parentIds)
        parentComments = parents || []
      }

      // Create lookup maps
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
      const parentMap = new Map(parentComments.map(p => [p.id, p]))

      // Enrich comments with user info
      enrichedComments = comments.map(comment => ({
        ...comment,
        user: profileMap.get(comment.user_id) || null,
        parent_comment: comment.parent_comment_id ? {
          id: comment.parent_comment_id,
          user: profileMap.get(parentMap.get(comment.parent_comment_id)?.user_id) || null
        } : null
      }))
    }

    // Check if current user has liked each comment (if authenticated)
    let commentsWithLikes = enrichedComments
    if (user && comments) {
      // Get all comment likes for the current user
      const commentIds = comments.map(c => c.id)
      const { data: userLikes } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .in('comment_id', commentIds)
        .eq('user_id', user.id)

      const likedCommentIds = new Set(userLikes?.map(l => l.comment_id) || [])

      commentsWithLikes = enrichedComments.map(comment => ({
        ...comment,
        is_liked: likedCommentIds.has(comment.id),
        is_own: comment.user_id === user.id
      }))
    }

    return NextResponse.json({
      comments: commentsWithLikes,
      total: count || 0,
      has_more: (count || 0) > offset + limit
    })

  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST new comment
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
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()
    const { content, parent_comment_id } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
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

    // Check access rights if not public and not creator
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

    // Create the comment
    const { data: newComment, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
        parent_comment_id: parent_comment_id || null
      })
      .select('*')
      .single()

    if (error) {
      console.error('Failed to create comment:', error)
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    // Fetch user profile for the new comment
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('id, display_name, username, avatar_url')
      .eq('id', user.id)
      .single()

    // Enrich the comment with user info
    const enrichedComment = {
      ...newComment,
      user: userProfile || null
    }

    // Send notification to post creator if it's not their own comment
    if (post.creator_id !== user.id) {
      await supabase
        .from('notifications')
        .insert({
          user_id: post.creator_id,
          type: 'new_comment',
          title: 'New Comment',
          message: `${userProfile?.display_name || 'Someone'} commented on your post`,
          metadata: {
            post_id: postId,
            comment_id: newComment.id,
            commenter_id: user.id
          }
        })
    }

    // If it's a reply, notify the parent comment author
    if (parent_comment_id) {
      const { data: parentComment } = await supabase
        .from('post_comments')
        .select('user_id')
        .eq('id', parent_comment_id)
        .single()

      if (parentComment && parentComment.user_id !== user.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: parentComment.user_id,
            type: 'comment_reply',
            title: 'New Reply',
            message: `${userProfile?.display_name || 'Someone'} replied to your comment`,
            metadata: {
              post_id: postId,
              comment_id: newComment.id,
              parent_comment_id,
              replier_id: user.id
            }
          })
      }
    }

    return NextResponse.json({
      comment: {
        ...enrichedComment,
        is_own: true,
        is_liked: false
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const supabase = await createClient()

    // Get comment ID from query params
    const searchParams = request.nextUrl.searchParams
    const commentId = searchParams.get('commentId')

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      )
    }

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if comment exists and belongs to user
    const { data: comment } = await supabase
      .from('post_comments')
      .select('id, user_id, post_id')
      .eq('id', commentId)
      .eq('post_id', postId)
      .single()

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Check if user owns the comment or is the post creator
    const { data: post } = await supabase
      .from('posts')
      .select('creator_id')
      .eq('id', postId)
      .single()

    if (comment.user_id !== user.id && post?.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this comment' },
        { status: 403 }
      )
    }

    // Delete the comment
    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      console.error('Failed to delete comment:', error)
      return NextResponse.json(
        { error: 'Failed to delete comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    })

  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}