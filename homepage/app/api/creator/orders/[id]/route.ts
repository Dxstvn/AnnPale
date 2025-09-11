import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/creator/orders/[id] - Get specific order details
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

    // Get order details with related data
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:profiles!user_id(id, display_name, avatar_url, email),
        creator:profiles!creator_id(id, display_name, avatar_url),
        video_request:video_requests(id, title, description, occasion, recipient_name),
        video_upload:video_uploads(id, video_url, thumbnail_url, duration, processing_status)
      `)
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check access permissions
    if (order.user_id !== user.id && order.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })

  } catch (error) {
    console.error('Get creator order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/creator/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const body = await request.json()
    const { status, metadata } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Update order status with validation
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('creator_id', user.id) // Ensure only creator can update their orders
      .select()
      .single()

    if (updateError || !updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: updateError?.code === 'PGRST116' ? 404 : 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: `Order status updated to ${status}`
    })

  } catch (error) {
    console.error('Update creator order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}