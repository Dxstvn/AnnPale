import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/fan/orders/[id] - Get specific order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get order details directly from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        creator:profiles!orders_creator_id_fkey(
          id,
          display_name,
          avatar_url
        ),
        video_upload:video_uploads(
          id,
          video_url,
          thumbnail_url,
          duration,
          processing_status
        )
      `)
      .eq('id', orderId)
      .eq('fan_id', user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      )
    }

    // Get video if available
    if (order.video_upload) {
      // Check if video is ready for viewing
      const canView = order.status === 'completed' && 
                     order.video_upload.processing_status === 'completed' &&
                     order.video_upload.video_url

      // Hide video URL if not ready or not completed
      if (!canView) {
        order.video_upload.video_url = undefined
      }
    }

    return NextResponse.json({
      success: true,
      data: order
    })

  } catch (error) {
    console.error('Get fan order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}