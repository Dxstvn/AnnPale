import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST to record a view
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
      // Views are only tracked for authenticated users
      return NextResponse.json({ tracked: false })
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

    // Check if view already exists (to avoid duplicates)
    const { data: existingView } = await supabase
      .from('post_views')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single()

    if (existingView) {
      // View already tracked
      return NextResponse.json({
        tracked: false,
        message: 'View already recorded'
      })
    }

    // Record the view
    const { error } = await supabase
      .from('post_views')
      .insert({
        post_id: postId,
        user_id: user.id
      })

    if (error) {
      // Handle unique constraint violation gracefully
      if (error.code === '23505') {
        return NextResponse.json({
          tracked: false,
          message: 'View already recorded'
        })
      }

      console.error('Failed to record view:', error)
      return NextResponse.json(
        { error: 'Failed to record view' },
        { status: 500 }
      )
    }

    // Get updated view count
    const { data: viewsData } = await supabase
      .from('post_views')
      .select('id', { count: 'exact' })
      .eq('post_id', postId)

    return NextResponse.json({
      tracked: true,
      viewsCount: viewsData?.length || 0
    })

  } catch (error) {
    console.error('Record view error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}