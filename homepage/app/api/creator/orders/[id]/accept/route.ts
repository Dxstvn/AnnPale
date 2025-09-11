import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/creator/orders/[id]/accept - Accept an order
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const body = await request.json()
    const { estimatedDelivery, notes } = body

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Accept the order
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        metadata: {
          estimatedDelivery: estimatedDelivery || null,
          creatorNotes: notes || '',
          acceptedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('creator_id', user.id) // Ensure only creator can accept their orders
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
      message: 'Order accepted successfully'
    })

  } catch (error) {
    console.error('Accept order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}