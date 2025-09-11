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

// POST /api/creator/orders/[id]/reject - Reject an order
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
        { error: 'Rejection reason is required' },
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

    // Get order details first to access payment information
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('creator_id', user.id)
      .single()

    if (fetchError || !order) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: fetchError?.code === 'PGRST116' ? 404 : 403 }
      )
    }

    // Process Stripe Connect refund if payment exists
    let refundData = null
    let refundError = null
    
    if (order.payment_intent_id) {
      try {
        console.log(`🔄 Processing Connect refund for payment intent: ${order.payment_intent_id}`)
        
        // Validate refund request first
        const validation = await validateRefundRequest(order.payment_intent_id, parseFloat(order.amount))
        if (!validation.valid) {
          throw new Error(`Refund validation failed: ${validation.error}`)
        }
        
        // Process Connect refund with proper account splits
        const refundResult = await processConnectRefund({
          paymentIntentId: order.payment_intent_id,
          refundAmount: parseFloat(order.amount), // Full refund for rejection
          originalAmount: parseFloat(order.amount),
          creatorAmount: parseFloat(order.creator_earnings),
          platformFee: parseFloat(order.platform_fee),
          reason: 'requested_by_customer',
          metadata: {
            order_id: orderId,
            creator_id: user.id,
            rejection_reason: reason,
            rejection_notes: notes || '',
            refund_type: 'creator_rejection'
          }
        })

        if (refundResult.success) {
          refundData = {
            main_refund_id: refundResult.mainRefund?.id,
            fee_refund_id: refundResult.applicationFeeRefund?.id,
            total_amount: refundResult.totalRefunded,
            creator_refunded: refundResult.creatorRefunded,
            platform_refunded: refundResult.platformRefunded,
            status: 'processing',
            created_at: new Date().toISOString()
          }
          
          // Create refund record in database
          try {
            const { data: refundRecord, error: refundRecordError } = await serviceClient
              .rpc('create_refund_record', {
                p_stripe_refund_id: refundResult.mainRefund?.id || `rejection_${Date.now()}`,
                p_order_id: orderId,
                p_refund_amount: refundResult.totalRefunded,
                p_reason: 'creator_rejection',
                p_initiated_by_type: 'creator',
                p_initiated_by: user.id,
                p_reason_notes: `Creator rejected: ${reason}${notes ? ` - ${notes}` : ''}`,
                p_metadata: JSON.stringify({
                  rejection_reason: reason,
                  rejection_notes: notes,
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
            platform: refundResult.platformRefunded
          })
        } else {
          throw new Error(refundResult.error || 'Connect refund failed')
        }
      } catch (error: any) {
        console.error('❌ Connect refund failed:', error)
        refundError = error.message
        // Continue with order rejection even if refund fails - we can retry refund later
      }
    }

    // Update order status with refund information
    const { data: updatedOrder, error: updateError } = await serviceClient
      .from('orders')
      .update({
        status: 'rejected',
        metadata: {
          rejectionReason: reason,
          rejectionNotes: notes || '',
          rejectedAt: new Date().toISOString(),
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
          status: 'rejected',
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.video_request_id)
      
      if (videoRequestError) {
        console.error('❌ Failed to update video_request status:', videoRequestError)
      }
    }

    console.log(`✅ Order ${orderId} rejected successfully${refundData ? ' with refund processed' : refundError ? ' (refund failed)' : ''}`)

    return NextResponse.json({
      success: true,
      data: {
        ...updatedOrder,
        refund: refundData
      },
      message: refundData 
        ? `Order rejected successfully. Full refund of $${refundData.total_amount} has been processed (Creator: $${refundData.creator_refunded}, Platform: $${refundData.platform_refunded}).`
        : refundError 
          ? 'Order rejected successfully. Refund processing failed - will be retried automatically.'
          : 'Order rejected successfully.'
    })

  } catch (error) {
    console.error('Reject order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}