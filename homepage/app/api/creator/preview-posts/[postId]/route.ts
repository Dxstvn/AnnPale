import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      content_type,
      thumbnail_url,
      video_url,
      image_url,
      text_content,
      preview_duration,
      is_public,
      tier_required
    } = body

    // Verify ownership
    const { data: existingPost } = await supabase
      .from('posts')
      .select('creator_id')
      .eq('id', postId)
      .single()

    if (!existingPost || existingPost.creator_id !== user.id) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 })
    }

    // Update post
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Only include fields that are provided
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (content_type !== undefined) updateData.content_type = content_type
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url
    if (video_url !== undefined) updateData.video_url = video_url
    if (image_url !== undefined) updateData.image_url = image_url
    if (text_content !== undefined) updateData.text_content = text_content
    if (preview_duration !== undefined) updateData.preview_duration = preview_duration
    if (is_public !== undefined) updateData.is_public = is_public
    if (tier_required !== undefined) updateData.tier_required = tier_required

    const { data: post, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .select()
      .single()

    if (error) {
      console.error('Error updating post:', error)
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error in PATCH /api/creator/preview-posts/[postId]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const { data: existingPost } = await supabase
      .from('posts')
      .select('creator_id, preview_order')
      .eq('id', postId)
      .single()

    if (!existingPost || existingPost.creator_id !== user.id) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 })
    }

    // Delete post
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (deleteError) {
      console.error('Error deleting post:', deleteError)
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }

    // Update preview_order for remaining posts
    if (existingPost.preview_order !== null) {
      await supabase
        .from('posts')
        .update({ preview_order: supabase.raw('preview_order - 1') })
        .eq('creator_id', user.id)
        .eq('is_preview', true)
        .gt('preview_order', existingPost.preview_order)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/creator/preview-posts/[postId]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}