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
      return NextResponse.json({ error: 'Only creators can upload media' }, { status: 403 })
    }
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const mediaType = formData.get('type') as string // 'video', 'image', or 'thumbnail'
    const generateThumbnail = formData.get('generateThumbnail') === 'true'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    if (!mediaType) {
      return NextResponse.json({ error: 'Media type is required' }, { status: 400 })
    }
    
    // Validate file type based on media type
    let allowedTypes: string[] = []
    let maxSize: number = 0
    let bucketName: string = ''
    
    switch (mediaType) {
      case 'video':
        allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi']
        maxSize = 500 * 1024 * 1024 // 500MB for videos
        bucketName = 'creator-videos'
        break
      case 'image':
      case 'thumbnail':
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        maxSize = 10 * 1024 * 1024 // 10MB for images
        bucketName = 'creator-images'
        break
      default:
        return NextResponse.json({ error: 'Invalid media type' }, { status: 400 })
    }
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type for ${mediaType}. Allowed types: ${allowedTypes.join(', ')}` 
      }, { status: 400 })
    }
    
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size for ${mediaType} is ${Math.round(maxSize / (1024 * 1024))}MB.` 
      }, { status: 400 })
    }
    
    // Generate unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${mediaType}-${uuidv4()}.${fileExt}`
    const filePath = `${user.id}/posts/${fileName}`
    
    // Create service client for storage operations (bypasses RLS)
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await serviceSupabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ 
        error: 'Failed to upload media. Please try again.' 
      }, { status: 500 })
    }
    
    // Get public URL for the uploaded media
    const { data: urlData } = serviceSupabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)
    
    let thumbnailUrl: string | null = null
    
    // Generate thumbnail for video if requested
    if (mediaType === 'video' && generateThumbnail) {
      try {
        // For now, we'll use a placeholder or extract thumbnail later
        // In a production app, you'd use a service like FFmpeg or cloud video processing
        thumbnailUrl = urlData.publicUrl // Placeholder - you would generate actual thumbnail
      } catch (error) {
        console.warn('Thumbnail generation failed:', error)
      }
    }
    
    const response = {
      success: true,
      url: urlData.publicUrl,
      storage_path: filePath,
      media_type: mediaType,
      file_size: file.size,
      file_name: fileName,
      ...(thumbnailUrl && { thumbnail_url: thumbnailUrl })
    }
    
    console.log('✅ Media uploaded successfully:', {
      mediaType,
      filePath,
      url: urlData.publicUrl,
      fileSize: file.size
    })
    
    return NextResponse.json(response)
    
  } catch (error: any) {
    console.error('Media upload error:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred. Please try again.' 
    }, { status: 500 })
  }
}

// GET endpoint to get media info or generate presigned URLs
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') // 'presign' or 'info'
    const mediaType = searchParams.get('type')
    const fileName = searchParams.get('fileName')
    
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
      return NextResponse.json({ error: 'Only creators can access media' }, { status: 403 })
    }
    
    if (action === 'presign' && mediaType && fileName) {
      // Generate presigned URL for direct upload (for large files)
      const bucketName = mediaType === 'video' ? 'creator-videos' : 'creator-images'
      const filePath = `${user.id}/posts/${fileName}`
      
      const serviceSupabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      const { data, error } = await serviceSupabase.storage
        .from(bucketName)
        .createSignedUploadUrl(filePath)
      
      if (error) {
        console.error('Presigned URL error:', error)
        return NextResponse.json({ 
          error: 'Failed to generate upload URL' 
        }, { status: 500 })
      }
      
      return NextResponse.json({
        upload_url: data.signedUrl,
        file_path: filePath,
        bucket: bucketName
      })
    }
    
    return NextResponse.json({ 
      error: 'Invalid request parameters' 
    }, { status: 400 })
    
  } catch (error: any) {
    console.error('Media info error:', error)
    return NextResponse.json({ 
      error: 'Failed to process request' 
    }, { status: 500 })
  }
}