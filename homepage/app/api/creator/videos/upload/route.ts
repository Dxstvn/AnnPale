import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/creator/videos/upload - Upload video for an order
export async function POST(request: NextRequest) {
  try {
    // Check authentication BEFORE parsing FormData
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check Content-Type before attempting to parse FormData
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data for file uploads' },
        { status: 400 }
      )
    }

    // Now parse FormData after authentication check
    const formData = await request.formData()
    const file = formData.get('file') as File
    const orderId = formData.get('orderId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Video file is required' },
        { status: 400 }
      )
    }

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload MP4, WebM, QuickTime, or AVI files.' },
        { status: 400 }
      )
    }

    // Max file size: 500MB
    const maxSize = 500 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 500MB.' },
        { status: 400 }
      )
    }

    // Check order ownership and status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, creator_id, status, user_id')
      .eq('id', orderId)
      .eq('creator_id', user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found or you do not have permission to upload to this order' },
        { status: 404 }
      )
    }

    if (order.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Order must be accepted before uploading video' },
        { status: 400 }
      )
    }

    // Generate unique filename with order ID
    const fileExtension = file.name.split('.').pop() || 'mp4'
    const fileName = `${orderId}/video_${Date.now()}.${fileExtension}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('video-requests')
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload video file' },
        { status: 500 }
      )
    }

    // Get the public URL for the uploaded video
    const { data: { publicUrl } } = supabase.storage
      .from('video-requests')
      .getPublicUrl(fileName)

    // Create video metadata
    const videoMetadata = {
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      fileName: fileName
    }

    // Update the order with video information and change status to in_progress
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        video_url: publicUrl,
        video_metadata: videoMetadata,
        video_uploaded_at: new Date().toISOString(),
        video_size: file.size,
        status: 'in_progress'
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Order update error:', updateError)
      // Try to clean up the uploaded file if order update fails
      await supabase.storage
        .from('video-requests')
        .remove([fileName])
        
      return NextResponse.json(
        { error: 'Failed to update order with video information' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        videoUrl: publicUrl,
        fileName,
        metadata: videoMetadata
      },
      message: 'Video uploaded successfully. Order status updated to in_progress.'
    })

  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}