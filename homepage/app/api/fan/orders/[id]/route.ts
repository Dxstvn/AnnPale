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

    // Get video request details directly from database
    const { data: order, error: orderError } = await supabase
      .from('video_requests')
      .select(`
        *,
        creator:profiles!creator_id(
          id,
          display_name,
          avatar_url
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

    // Video URL will be added when video is completed and uploaded
    // For now, we don't have a separate video_uploads table integration

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