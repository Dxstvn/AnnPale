import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
      return NextResponse.json({ error: 'Only creators can upload thumbnails' }, { status: 403 })
    }
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const videoId = formData.get('video_id') as string
    const timestamp = parseFloat(formData.get('timestamp') as string || '0')
    
    if (!file) {
      return NextResponse.json({ error: 'No thumbnail file provided' }, { status: 400 })
    }
    
    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' 
      }, { status: 400 })
    }
    
    // Validate file size (max 10MB for images)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 })
    }
    
    // Verify video ownership
    const { data: video } = await supabase
      .from('videos')
      .select('id, creator_id, storage_path')
      .eq('id', videoId)
      .single()
    
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    
    if (video.creator_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to upload thumbnail for this video' }, { status: 403 })
    }
    
    // Generate thumbnail filename
    const fileExt = file.name.split('.').pop() || 'jpg'
    const thumbnailName = `${videoId}_${timestamp.toFixed(1)}s.${fileExt}`
    const thumbnailPath = `${user.id}/${thumbnailName}`
    
    try {
      // Delete existing thumbnail if it exists
      const { data: existingFiles } = await supabase.storage
        .from('video-thumbnails')
        .list(user.id, {
          search: videoId
        })
      
      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles
          .filter(f => f.name.startsWith(videoId))
          .map(f => `${user.id}/${f.name}`)
        
        if (filesToDelete.length > 0) {
          await supabase.storage
            .from('video-thumbnails')
            .remove(filesToDelete)
        }
      }
    } catch (error) {
      console.warn('Failed to delete existing thumbnails:', error)
      // Continue anyway - not critical
    }
    
    // Upload new thumbnail to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('video-thumbnails')
      .upload(thumbnailPath, file, {
        contentType: file.type,
        upsert: true // Allow overwriting
      })
    
    if (uploadError) {
      console.error('Thumbnail upload error:', uploadError)
      return NextResponse.json({ 
        error: 'Failed to upload thumbnail. Please try again.' 
      }, { status: 500 })
    }
    
    // Get public URL for the thumbnail
    const { data: publicUrlData } = supabase.storage
      .from('video-thumbnails')
      .getPublicUrl(thumbnailPath)
    
    const thumbnailUrl = publicUrlData.publicUrl
    
    // Update video record with thumbnail URL
    const { error: updateError } = await supabase
      .from('videos')
      .update({ 
        thumbnail_url: thumbnailUrl,
        thumbnail_timestamp: timestamp,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId)
    
    if (updateError) {
      console.error('Video thumbnail update error:', updateError)
      
      // Try to delete the uploaded file since we couldn't update the database
      await supabase.storage
        .from('video-thumbnails')
        .remove([thumbnailPath])
      
      return NextResponse.json({ 
        error: 'Failed to save thumbnail information. Please try again.' 
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      thumbnail_url: thumbnailUrl,
      thumbnail_path: thumbnailPath,
      timestamp,
      message: 'Thumbnail uploaded successfully!'
    })
    
  } catch (error: any) {
    console.error('Thumbnail upload error:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred. Please try again.' 
    }, { status: 500 })
  }
}

// GET endpoint to retrieve thumbnail info
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('video_id')
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!videoId) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 })
    }
    
    // Get video thumbnail info
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('id, thumbnail_url, thumbnail_timestamp, creator_id')
      .eq('id', videoId)
      .single()
    
    if (videoError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    
    // Check if user has access to this video
    const hasAccess = video.creator_id === user.id || 
                     await checkVideoAccess(supabase, videoId, user.id)
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    return NextResponse.json({
      video_id: video.id,
      thumbnail_url: video.thumbnail_url,
      timestamp: video.thumbnail_timestamp || 0,
      has_thumbnail: !!video.thumbnail_url
    })
    
  } catch (error: any) {
    console.error('Thumbnail fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch thumbnail information' 
    }, { status: 500 })
  }
}

// DELETE endpoint to remove thumbnail
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('video_id')
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!videoId) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 })
    }
    
    // Get video info
    const { data: video } = await supabase
      .from('videos')
      .select('id, creator_id, thumbnail_url')
      .eq('id', videoId)
      .single()
    
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    
    if (video.creator_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    // Delete thumbnail from storage if exists
    if (video.thumbnail_url) {
      try {
        // Extract path from URL
        const urlParts = video.thumbnail_url.split('/video-thumbnails/')
        if (urlParts.length > 1) {
          const thumbnailPath = urlParts[1]
          
          await supabase.storage
            .from('video-thumbnails')
            .remove([thumbnailPath])
        }
      } catch (error) {
        console.warn('Failed to delete thumbnail from storage:', error)
        // Continue anyway
      }
    }
    
    // Remove thumbnail URL from video record
    const { error: updateError } = await supabase
      .from('videos')
      .update({ 
        thumbnail_url: null,
        thumbnail_timestamp: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId)
    
    if (updateError) {
      console.error('Video thumbnail removal error:', updateError)
      return NextResponse.json({ 
        error: 'Failed to remove thumbnail information' 
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Thumbnail removed successfully'
    })
    
  } catch (error: any) {
    console.error('Thumbnail deletion error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete thumbnail' 
    }, { status: 500 })
  }
}

// Helper function to check video access (reused from upload route)
async function checkVideoAccess(supabase: any, videoId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('video_access')
    .select('id')
    .eq('video_id', videoId)
    .eq('user_id', userId)
    .single()
  
  return !!data
}