import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { processConnectRefund, validateRefundRequest } from '@/lib/stripe/refund-handler'

// Service role client for system operations
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// POST /api/fan/orders/[id]/cancel - Cancel an order and process refund
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const body = await request.json()
    const { reason, notes } = body

    if (!reason) {
      return NextResponse.json(
        { error: 'Cancellation reason is required' },
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

    // Get order details to verify ownership and check cancellation eligibility
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id) // Ensure only fan can cancel their orders
      .single()

    if (fetchError || !order) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: fetchError?.code === 'PGRST116' ? 404 : 403 }
      )
    }

    // Check if order is eligible for cancellation
    const now = new Date()
    const orderCreated = new Date(order.created_at)
    const hoursSinceOrder = (now.getTime() - orderCreated.getTime()) / (1000 * 60 * 60)

    // Business rules for cancellation
    let canCancel = false
    let cancellationFee = 0
    let refundAmount = order.amount

    if (order.status === 'pending') {
      // Can cancel pending orders within 24 hours with no fee
      canCancel = hoursSinceOrder <= 24
      cancellationFee = 0
    } else if (order.status === 'accepted' && hoursSinceOrder <= 2) {
      // Can cancel accepted orders within 2 hours with 10% cancellation fee
      canCancel = true
      cancellationFee = Math.round(order.amount * 0.10 * 100) / 100
      refundAmount = order.amount - cancellationFee
    }

    if (!canCancel) {
      return NextResponse.json(
        { 
          error: 'Order cannot be cancelled',
          details: order.status === 'pending' 
            ? 'Orders can only be cancelled within 24 hours of creation'
            : order.status === 'accepted'
              ? 'Accepted orders can only be cancelled within 2 hours'
              : `Orders with status '${order.status}' cannot be cancelled`
        },
        { status: 400 }
      )
    }

    // Process Stripe Connect refund if payment exists
    let refundData = null
    let refundError = null
    
    if (order.payment_intent_id && refundAmount > 0) {
      try {
        console.log(`🔄 Processing Connect cancellation refund for payment intent: ${order.payment_intent_id}`)
        console.log(`💰 Refund details: $${refundAmount} (fee: $${cancellationFee})`)
        
        // Validate refund request first
        const validation = await validateRefundRequest(order.payment_intent_id, refundAmount)
        if (!validation.valid) {
          throw new Error(`Refund validation failed: ${validation.error}`)
        }
        
        // Process Connect refund with proper account splits
        const refundResult = await processConnectRefund({
          paymentIntentId: order.payment_intent_id,
          refundAmount: refundAmount, // Partial refund (minus cancellation fee)
          originalAmount: parseFloat(order.amount),
          creatorAmount: parseFloat(order.creator_earnings),
          platformFee: parseFloat(order.platform_fee),
          reason: 'requested_by_customer',
          metadata: {
            order_id: orderId,
            user_id: user.id,
            cancellation_reason: reason,
            cancellation_notes: notes || '',
            cancellation_fee: cancellationFee.toString(),
            refund_type: 'fan_cancellation'
          }
        })

        if (refundResult.success) {
          refundData = {
            main_refund_id: refundResult.mainRefund?.id,
            fee_refund_id: refundResult.applicationFeeRefund?.id,
            amount: refundResult.totalRefunded,
            creator_refunded: refundResult.creatorRefunded,
            platform_refunded: refundResult.platformRefunded,
            cancellation_fee: cancellationFee,
            status: 'processing',
            created_at: new Date().toISOString()
          }
          
          // Create refund record in database
          try {
            const { data: refundRecord, error: refundRecordError } = await serviceClient
              .rpc('create_refund_record', {
                p_stripe_refund_id: refundResult.mainRefund?.id || `cancellation_${Date.now()}`,
                p_order_id: orderId,
                p_refund_amount: refundResult.totalRefunded,
                p_reason: 'fan_cancellation',
                p_initiated_by_type: 'fan',
                p_initiated_by: user.id,
                p_reason_notes: `Fan cancelled: ${reason}${notes ? ` - ${notes}` : ''}`,
                p_metadata: JSON.stringify({
                  cancellation_reason: reason,
                  cancellation_notes: notes,
                  cancellation_fee: cancellationFee,
                  hours_since_order: hoursSinceOrder,
                  original_order_status: order.status,
                  main_refund_id: refundResult.mainRefund?.id,
                  fee_refund_id: refundResult.applicationFeeRefund?.id,
                  creator_refunded: refundResult.creatorRefunded,
                  platform_refunded: refundResult.platformRefunded
                })
              })
            
            if (refundRecordError) {
              console.error('❌ Failed to create refund record:', refundRecordError)
            } else {
              console.log('✅ Refund record created:', refundRecord)
              refundData.database_id = refundRecord
            }
          } catch (dbError) {
            console.error('❌ Database refund record creation failed:', dbError)
          }
          
          console.log(`✅ Connect refund processed successfully:`, {
            total: refundResult.totalRefunded,
            creator: refundResult.creatorRefunded,
            platform: refundResult.platformRefunded,
            fee: cancellationFee
          })
        } else {
          throw new Error(refundResult.error || 'Connect refund failed')
        }
      } catch (error: any) {
        console.error('❌ Connect refund failed:', error)
        refundError = error.message
        // Continue with order cancellation even if refund fails - we can retry refund later
      }
    }

    // Update order status with cancellation information
    const { data: updatedOrder, error: updateError } = await serviceClient
      .from('orders')
      .update({
        status: 'cancelled',
        metadata: {
          cancellationReason: reason,
          cancellationNotes: notes || '',
          cancelledAt: new Date().toISOString(),
          cancelledBy: 'fan',
          hoursSinceOrder: hoursSinceOrder,
          cancellationFee: cancellationFee,
          refund: refundData,
          refundError: refundError
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (updateError || !updatedOrder) {
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      )
    }

    // Also update the corresponding video_request status for synchronization
    if (order.video_request_id) {
      const { error: videoRequestError } = await serviceClient
        .from('video_requests')
        .update({
          status: 'cancelled',
          rejection_reason: `Fan cancelled: ${reason}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.video_request_id)
      
      if (videoRequestError) {
        console.error('❌ Failed to update video_request status:', videoRequestError)
      }
    }

    console.log(`✅ Order ${orderId} cancelled by fan${refundData ? ' with refund processed' : refundError ? ' (refund failed)' : ''}`)

    return NextResponse.json({
      success: true,
      data: {
        ...updatedOrder,
        refund: refundData,
        cancellationFee: cancellationFee,
        refundAmount: refundAmount
      },
      message: refundData 
        ? `Order cancelled successfully. Refund of $${refundData.amount} has been processed${cancellationFee > 0 ? ` (after $${cancellationFee} cancellation fee)` : ''} - Creator: $${refundData.creator_refunded}, Platform: $${refundData.platform_refunded}.`
        : refundError 
          ? 'Order cancelled successfully. Refund processing failed - will be retried automatically.'
          : 'Order cancelled successfully.'
    })

  } catch (error) {
    console.error('Cancel order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}