import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/fan/orders/[id]/dispute - Dispute an order
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const body = await request.json()
    const { reason, description, evidence } = body

    if (!reason) {
      return NextResponse.json(
        { error: 'Dispute reason is required' },
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

    // Update order status to disputed directly
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'disputed',
        metadata: {
          disputeReason: reason,
          disputeDescription: description || '',
          disputeEvidence: evidence || [],
          disputedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('fan_id', user.id)
      .select()
      .single()

    if (updateError || !updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      )
    }

    // Note: disputes table doesn't exist yet, so commenting out for now
    // This will be added in a future phase
    /*
    const { error: disputeError } = await supabase
      .from('disputes')
      .insert({
        order_id: orderId,
        user_id: user.id,
        creator_id: updatedOrder.creator_id,
        reason,
        description: description || '',
        evidence: evidence || [],
        status: 'pending',
        created_at: new Date().toISOString()
      })

    if (disputeError) {
      console.error('Error creating dispute record:', disputeError)
    }
    */

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Dispute submitted successfully. Our team will review it shortly.'
    })

  } catch (error) {
    console.error('Dispute order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}