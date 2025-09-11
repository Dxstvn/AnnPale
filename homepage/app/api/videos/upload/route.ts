import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

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
      .select('role, is_creator')
      .eq('id', user.id)
      .single()
    
    if (!profile?.is_creator && profile?.role !== 'creator' && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Only creators can upload videos' }, { status: 403 })
    }
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const requestId = formData.get('request_id') as string
    const duration = parseInt(formData.get('duration') as string) || 0
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }
    
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only MP4, WebM, and QuickTime videos are allowed.' 
      }, { status: 400 })
    }
    
    // Validate file size (max 100MB for now)
    const maxSize = 100 * 1024 * 1024 // 100MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 100MB.' 
      }, { status: 400 })
    }
    
    // Verify ownership of the video request
    const { data: videoRequest, error: requestError } = await supabase
      .from('video_requests')
      .select('creator_id, status')
      .eq('id', requestId)
      .single()
    
    if (requestError || !videoRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }
    
    if (videoRequest.creator_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to upload for this request' }, { status: 403 })
    }
    
    if (!['accepted', 'recording'].includes(videoRequest.status)) {
      return NextResponse.json({ 
        error: 'Cannot upload video for this request. Request must be accepted first.' 
      }, { status: 400 })
    }
    
    // Generate unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${requestId}-${uuidv4()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`
    
    // Create service client for storage operations (bypasses RLS)
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Upload to Supabase Storage using service role
    const { data: uploadData, error: uploadError } = await serviceSupabase.storage
      .from('creator-videos')
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
    
    // Get public URL for the uploaded video
    const { data: urlData } = serviceSupabase.storage
      .from('creator-videos')
      .getPublicUrl(filePath)
    
    // Update video_requests table with video information
    const { data: updatedRequest, error: updateError } = await supabase
      .from('video_requests')
      .update({ 
        status: 'completed',
        video_url: urlData.publicUrl,
        duration: duration,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()
    
    if (updateError) {
      // Try to delete uploaded file if database update fails
      await serviceSupabase.storage.from('creator-videos').remove([filePath])
      
      console.error('Database update error:', updateError)
      return NextResponse.json({ 
        error: 'Failed to save video information. Please try again.' 
      }, { status: 500 })
    }
    
    console.log('✅ Video uploaded successfully:', {
      requestId,
      filePath,
      videoUrl: urlData.publicUrl,
      duration,
      fileSize: file.size
    })
    
    return NextResponse.json({
      success: true,
      video_url: urlData.publicUrl,
      storage_path: filePath,
      duration: duration,
      message: 'Video uploaded successfully!'
    })
    
  } catch (error: any) {
    console.error('Video upload error:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred. Please try again.' 
    }, { status: 500 })
  }
}

// GET endpoint to get video info
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('request_id')
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!requestId) {
      return NextResponse.json({ error: 'Request ID required' }, { status: 400 })
    }
    
    // Get video request details
    const { data: videoRequest, error: requestError } = await supabase
      .from('video_requests')
      .select('*, creator:profiles!creator_id(display_name, username), fan:profiles!fan_id(display_name, username)')
      .eq('id', requestId)
      .single()
    
    if (requestError || !videoRequest) {
      return NextResponse.json({ error: 'Video request not found' }, { status: 404 })
    }
    
    // Check access permissions (creator or fan can access)
    const hasAccess = videoRequest.creator_id === user.id || videoRequest.fan_id === user.id
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    return NextResponse.json({
      video: {
        id: videoRequest.id,
        status: videoRequest.status,
        video_url: videoRequest.video_url,
        thumbnail_url: videoRequest.thumbnail_url,
        duration: videoRequest.duration,
        occasion: videoRequest.occasion,
        recipient_name: videoRequest.recipient_name,
        created_at: videoRequest.created_at,
        completed_at: videoRequest.completed_at
      },
      creator: videoRequest.creator,
      fan: videoRequest.fan
    })
    
  } catch (error: any) {
    console.error('Video fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch video information' 
    }, { status: 500 })
  }
}