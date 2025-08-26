import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { 
  createViewSession, 
  processViewData, 
  getClientIP, 
  getLocationFromIP,
  type VideoAnalytics 
} from '@/lib/utils/analytics'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check if user is a creator
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role !== 'creator' && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Only creators can upload videos' }, { status: 403 })
    }
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const requestId = formData.get('request_id') as string
    const isTemp = formData.get('is_temp') === 'true'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only MP4, WebM, and QuickTime videos are allowed.' 
      }, { status: 400 })
    }
    
    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024 // 500MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 500MB.' 
      }, { status: 400 })
    }
    
    // If uploading for a specific request, verify ownership
    if (requestId && !isTemp) {
      const { data: videoRequest } = await supabase
        .from('video_requests')
        .select('creator_id, status')
        .eq('id', requestId)
        .single()
      
      if (!videoRequest) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 })
      }
      
      if (videoRequest.creator_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized to upload for this request' }, { status: 403 })
      }
      
      if (videoRequest.status !== 'accepted' && videoRequest.status !== 'recording') {
        return NextResponse.json({ 
          error: 'Cannot upload video for this request. Request must be accepted first.' 
        }, { status: 400 })
      }
    }
    
    // Generate unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    
    // Determine storage bucket and path
    const bucket = isTemp ? 'temp-recordings' : 'creator-videos'
    const filePath = `${user.id}/${fileName}`
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ 
        error: 'Failed to upload video. Please try again.' 
      }, { status: 500 })
    }
    
    // If this is a final upload (not temp), create video record
    if (!isTemp && requestId) {
      // Get video duration (would need client to send this)
      const duration = parseInt(formData.get('duration') as string) || 0
      
      // Create video record in database
      const { data: video, error: videoError } = await supabase
        .from('videos')
        .insert({
          request_id: requestId,
          creator_id: user.id,
          storage_path: filePath,
          duration_seconds: duration,
          file_size_bytes: file.size,
          mime_type: file.type,
          is_processed: true, // Set to true for now, implement processing later
          recorded_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (videoError) {
        // Try to delete uploaded file if database insert fails
        await supabase.storage.from(bucket).remove([filePath])
        
        console.error('Database error:', videoError)
        return NextResponse.json({ 
          error: 'Failed to save video information. Please try again.' 
        }, { status: 500 })
      }
      
      // Update request status to completed
      await supabase
        .from('video_requests')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', requestId)
      
      // Grant access to the fan who requested the video
      const { data: request } = await supabase
        .from('video_requests')
        .select('fan_id')
        .eq('id', requestId)
        .single()
      
      if (request?.fan_id) {
        await supabase
          .from('video_access')
          .insert({
            video_id: video.id,
            user_id: request.fan_id,
            granted_at: new Date().toISOString(),
            download_allowed: true
          })
      }
      
      return NextResponse.json({
        success: true,
        video_id: video.id,
        storage_path: filePath,
        message: 'Video uploaded successfully!'
      })
    }
    
    // For temp uploads, just return the path
    return NextResponse.json({
      success: true,
      storage_path: filePath,
      bucket: bucket,
      message: 'Video uploaded to temporary storage'
    })
    
  } catch (error: any) {
    console.error('Video upload error:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred. Please try again.' 
    }, { status: 500 })
  }
}

// GET endpoint to check upload status or get signed URL
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('video_id')
    const action = searchParams.get('action') // 'url' or 'status'
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!videoId) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 })
    }
    
    // Get video details
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*, request:video_requests(*)')
      .eq('id', videoId)
      .single()
    
    if (videoError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    
    // Check access permissions
    const hasAccess = video.creator_id === user.id || 
                     video.request?.fan_id === user.id ||
                     await checkVideoAccess(supabase, videoId, user.id)
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    if (action === 'url') {
      // Generate signed URL for video streaming
      const { data: signedUrl, error: urlError } = await supabase.storage
        .from('creator-videos')
        .createSignedUrl(video.storage_path, 3600) // 1 hour expiry
      
      if (urlError) {
        console.error('Signed URL error:', urlError)
        return NextResponse.json({ error: 'Failed to generate video URL' }, { status: 500 })
      }
      
      // Enhanced view tracking with session-based analytics
      try {
        const ipAddress = getClientIP(request)
        const userAgent = request.headers.get('user-agent') || ''
        const location = ipAddress ? await getLocationFromIP(ipAddress) : undefined
        
        // Create view session
        const viewSession = createViewSession(
          user.id,
          ipAddress,
          userAgent,
          location
        )
        
        // Get existing analytics from video record
        const existingAnalytics: Partial<VideoAnalytics> = {
          videoId: video.id,
          totalViews: video.view_count || 0,
          uniqueViews: video.unique_views || 0,
          viewSessions: video.analytics?.viewSessions || [],
          deviceTypes: video.analytics?.deviceTypes || {},
          locations: video.analytics?.locations || {},
          lastViewedAt: video.last_viewed_at,
          averageViewDuration: video.analytics?.averageViewDuration,
          completionRate: video.analytics?.completionRate
        }
        
        // Process the new view
        const updatedAnalytics = processViewData(existingAnalytics, viewSession)
        
        // Update video record with enhanced analytics
        await supabase
          .from('videos')
          .update({ 
            view_count: updatedAnalytics.totalViews,
            unique_views: updatedAnalytics.uniqueViews,
            last_viewed_at: updatedAnalytics.lastViewedAt,
            analytics: {
              viewSessions: updatedAnalytics.viewSessions.slice(-100), // Keep last 100 sessions
              deviceTypes: updatedAnalytics.deviceTypes,
              locations: updatedAnalytics.locations,
              averageViewDuration: updatedAnalytics.averageViewDuration,
              completionRate: updatedAnalytics.completionRate
            }
          })
          .eq('id', videoId)
        
        // Update access record if exists
        await supabase
          .from('video_access')
          .update({
            view_count: updatedAnalytics.totalViews,
            last_viewed_at: updatedAnalytics.lastViewedAt
          })
          .eq('video_id', videoId)
          .eq('user_id', user.id)
          
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError)
        
        // Fallback to simple view count increment
        await supabase
          .from('videos')
          .update({ 
            view_count: video.view_count + 1,
            last_viewed_at: new Date().toISOString()
          })
          .eq('id', videoId)
      }
      
      return NextResponse.json({
        url: signedUrl.signedUrl,
        expires_in: 3600,
        video: {
          id: video.id,
          duration: video.duration_seconds,
          mime_type: video.mime_type,
          created_at: video.created_at
        }
      })
    }
    
    // Return video status/details
    return NextResponse.json({
      video: {
        id: video.id,
        status: video.is_processed ? 'ready' : 'processing',
        duration: video.duration_seconds,
        size: video.file_size_bytes,
        views: video.view_count,
        created_at: video.created_at
      },
      request: video.request ? {
        id: video.request.id,
        occasion: video.request.occasion,
        recipient: video.request.recipient_name
      } : null
    })
    
  } catch (error: any) {
    console.error('Video fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch video information' 
    }, { status: 500 })
  }
}

// Helper function to check video access
async function checkVideoAccess(supabase: any, videoId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('video_access')
    .select('id')
    .eq('video_id', videoId)
    .eq('user_id', userId)
    .single()
  
  return !!data
}