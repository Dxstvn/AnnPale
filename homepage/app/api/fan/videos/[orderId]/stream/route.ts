import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/fan/videos/[orderId]/stream - Secure video streaming with authentication
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Verify the user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the order belongs to the current user and has a completed video
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, user_id, creator_id, status, video_url, video_metadata, occasion, creator:profiles!orders_creator_id_fkey(display_name, avatar_url)')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Verify the user is either the customer or the creator
    if (order.user_id !== user.id && order.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Access denied. You do not have permission to view this video.' },
        { status: 403 }
      )
    }

    // Verify the order is completed and has a video
    if (order.status !== 'completed' || !order.video_url) {
      return NextResponse.json(
        { error: 'Video not available. Order must be completed with uploaded video.' },
        { status: 400 }
      )
    }

    // Generate a signed URL for the video with expiry (24 hours)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('video-requests')
      .createSignedUrl(
        order.video_url.split('/').pop() || '', // Extract filename from URL
        86400 // 24 hours
      )

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError)
      return NextResponse.json(
        { error: 'Failed to generate video access URL' },
        { status: 500 }
      )
    }

    // Return the video access information
    return NextResponse.json({
      success: true,
      data: {
        videoUrl: signedUrlData.signedUrl,
        title: order.occasion || 'Personalized Video Message',
        creatorName: order.creator?.display_name,
        creatorAvatar: order.creator?.avatar_url,
        expiresAt: new Date(Date.now() + 86400 * 1000).toISOString(), // 24 hours from now
        metadata: order.video_metadata
      }
    })

  } catch (error) {
    console.error('Video streaming error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// HEAD /api/fan/videos/[orderId]/stream - Check video availability
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params

    if (!orderId) {
      return new NextResponse(null, { status: 400 })
    }

    const supabase = await createClient()
    
    // Verify the user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return new NextResponse(null, { status: 401 })
    }

    // Check if order exists and user has access
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, user_id, creator_id, status, video_url')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return new NextResponse(null, { status: 404 })
    }

    // Verify access
    if (order.user_id !== user.id && order.creator_id !== user.id) {
      return new NextResponse(null, { status: 403 })
    }

    // Check video availability
    if (order.status !== 'completed' || !order.video_url) {
      return new NextResponse(null, { status: 400 })
    }

    return new NextResponse(null, { status: 200 })

  } catch (error) {
    console.error('Video availability check error:', error)
    return new NextResponse(null, { status: 500 })
  }
}