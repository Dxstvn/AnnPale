import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Public endpoint - no authentication required
export async function GET(
  request: Request,
  { params }: { params: Promise<{ creatorId: string }> }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { creatorId } = await params

    // Fetch active preview videos for the creator
    const { data: previewVideos, error } = await supabase
      .from('creator_preview_videos')
      .select(`
        id,
        title,
        thumbnail_url,
        video_url,
        duration,
        occasion,
        display_order,
        video_request_id
      `)
      .eq('creator_id', creatorId)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(6) // Maximum of 6 preview videos

    if (error) {
      console.error('Error fetching preview videos:', error)
      return NextResponse.json(
        { error: 'Failed to fetch preview videos' },
        { status: 500 }
      )
    }

    // If no custom preview videos, we could optionally fetch recent completed public videos
    if (!previewVideos || previewVideos.length === 0) {
      // Fetch recent completed public videos as fallback
      const { data: recentVideos, error: recentError } = await supabase
        .from('video_requests')
        .select(`
          id,
          occasion,
          video_url,
          thumbnail_url,
          duration
        `)
        .eq('creator_id', creatorId)
        .eq('status', 'completed')
        .eq('is_public', true)
        .not('video_url', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(3)

      if (!recentError && recentVideos) {
        // Format recent videos to match preview video structure
        const formattedVideos = recentVideos.map((video, index) => ({
          id: video.id,
          title: video.occasion || `Sample Video ${index + 1}`,
          thumbnail_url: video.thumbnail_url,
          video_url: video.video_url,
          duration: video.duration,
          occasion: video.occasion,
          display_order: index,
          video_request_id: video.id
        }))

        return NextResponse.json(formattedVideos)
      }
    }

    return NextResponse.json(previewVideos || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}