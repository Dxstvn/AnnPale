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

    // Fetch creator's preview posts ordered by preview_order
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('creator_id', user.id)
      .eq('is_preview', true)
      .order('preview_order', { ascending: true })

    if (error) {
      console.error('Error fetching preview posts:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    return NextResponse.json({ posts: posts || [] })
  } catch (error) {
    console.error('Error in GET /api/creator/preview-posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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

    const body = await request.json()
    const {
      title,
      description,
      content_type,
      thumbnail_url,
      video_url,
      image_url,
      text_content,
      is_preview,
      preview_duration,
      is_public,
      tier_required
    } = body

    // Validate required fields
    if (!title || !content_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the next preview_order value
    const { data: existingPosts } = await supabase
      .from('posts')
      .select('preview_order')
      .eq('creator_id', user.id)
      .eq('is_preview', true)
      .order('preview_order', { ascending: false })
      .limit(1)

    const nextOrder = existingPosts && existingPosts.length > 0 
      ? (existingPosts[0].preview_order || 0) + 1 
      : 0

    // Create new post
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        creator_id: user.id,
        title,
        description,
        content_type,
        thumbnail_url,
        video_url,
        image_url,
        text_content,
        is_preview: true,
        preview_duration,
        preview_order: nextOrder,
        is_public: is_public !== undefined ? is_public : true,
        tier_required,
        published_at: new Date().toISOString(),
        likes_count: 0,
        views_count: 0,
        comments_count: 0,
        shares_count: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error in POST /api/creator/preview-posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}