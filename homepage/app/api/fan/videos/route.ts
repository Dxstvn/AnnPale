import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { VideoService } from '@/lib/services'

// GET /api/fan/videos - Get all videos received by the fan
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const videoService = new VideoService(supabase)

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get query parameters
    const url = new URL(request.url)
    const status = url.searchParams.get('status') // completed, processing, failed
    const creatorId = url.searchParams.get('creatorId')
    const limit = url.searchParams.get('limit')

    // Get user's videos
    const videosResult = await videoService.getUserVideos(user.id)

    if (!videosResult.success) {
      return NextResponse.json(
        { error: videosResult.error },
        { status: 500 }
      )
    }

    let videos = videosResult.data || []

    // Apply filters
    if (status) {
      videos = videos.filter(video => video.processing_status === status)
    }

    if (creatorId) {
      videos = videos.filter(video => video.order.creator_id === creatorId)
    }

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit)
      if (!isNaN(limitNum) && limitNum > 0) {
        videos = videos.slice(0, limitNum)
      }
    }

    // Filter out video URLs for non-completed orders
    const filteredVideos = videos.map(video => {
      const canViewVideo = video.order.status === 'completed' && 
                           video.processing_status === 'completed'
      
      return {
        ...video,
        video_url: canViewVideo ? video.video_url : null,
        // Always show thumbnail if available
        thumbnail_url: video.thumbnail_url
      }
    })

    // Calculate stats
    const stats = {
      total: videos.length,
      completed: videos.filter(v => v.processing_status === 'completed').length,
      processing: videos.filter(v => v.processing_status === 'processing').length,
      failed: videos.filter(v => v.processing_status === 'failed').length,
      total_duration: videos
        .filter(v => v.duration)
        .reduce((sum, v) => sum + (v.duration || 0), 0)
    }

    return NextResponse.json({
      success: true,
      data: filteredVideos,
      stats
    })

  } catch (error) {
    console.error('Fan videos API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}