import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

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

// POST /api/refunds/process - Process system-initiated refunds
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin (required for system refund operations)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { 
      type = 'expired_orders', 
      orderIds = [],
      reason,
      dryRun = false 
    } = body

    if (!reason) {
      return NextResponse.json(
        { error: 'Refund reason is required' },
        { status: 400 }
      )
    }

    let targetOrders = []

    // Determine which orders to process based on type
    if (type === 'expired_orders') {
      // Find orders that are overdue (pending/accepted for more than 14 days)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - 14)

      const { data: expiredOrders, error: fetchError } = await serviceClient
        .from('orders')
        .select('*')
        .in('status', ['pending', 'accepted'])
        .lt('created_at', cutoffDate.toISOString())
        .is('payment_intent_id', 'not.null')

      if (fetchError) {
        return NextResponse.json(
          { error: 'Failed to fetch expired orders' },
          { status: 500 }
        )
      }

      targetOrders = expiredOrders || []
    } else if (type === 'specific_orders' && orderIds.length > 0) {
      // Process specific order IDs
      const { data: specificOrders, error: fetchError } = await serviceClient
        .from('orders')
        .select('*')
        .in('id', orderIds)
        .is('payment_intent_id', 'not.null')

      if (fetchError) {
        return NextResponse.json(
          { error: 'Failed to fetch specified orders' },
          { status: 500 }
        )
      }

      targetOrders = specificOrders || []
    } else {
      return NextResponse.json(
        { error: 'Invalid refund type or missing orderIds for specific_orders type' },
        { status: 400 }
      )
    }

    console.log(`🔍 Found ${targetOrders.length} orders to process for ${type} refunds`)

    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        ordersToProcess: targetOrders.length,
        totalRefundAmount: targetOrders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0),
        orders: targetOrders.map(order => ({
          id: order.id,
          amount: order.amount,
          status: order.status,
          created_at: order.created_at,
          payment_intent_id: order.payment_intent_id
        }))
      })
    }

    const results = []
    let successCount = 0
    let failureCount = 0

    // Process each order for refund
    for (const order of targetOrders) {
      try {
        console.log(`🔄 Processing refund for order ${order.id}, payment intent: ${order.payment_intent_id}`)
        
        // Create full refund for the order
        const refund = await stripe.refunds.create({
          payment_intent: order.payment_intent_id,
          reason: 'requested_by_customer', // System refunds count as customer request
          metadata: {
            order_id: order.id,
            refund_type: 'system_refund',
            system_reason: reason,
            processed_by: user.id,
            batch_type: type
          }
        })

        const refundData = {
          refund_id: refund.id,
          amount: refund.amount / 100,
          status: refund.status,
          created_at: new Date(refund.created * 1000).toISOString()
        }

        // Update order status
        const { error: updateError } = await serviceClient
          .from('orders')
          .update({
            status: 'refunded',
            metadata: {
              ...order.metadata,
              systemRefundReason: reason,
              systemRefundProcessedAt: new Date().toISOString(),
              systemRefundProcessedBy: user.id,
              refund: refundData
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id)

        if (updateError) {
          throw new Error(`Failed to update order status: ${updateError.message}`)
        }

        // Update corresponding video_request if exists
        if (order.video_request_id) {
          await serviceClient
            .from('video_requests')
            .update({
              status: 'cancelled',
              rejection_reason: `System refund: ${reason}`,
              updated_at: new Date().toISOString()
            })
            .eq('id', order.video_request_id)
        }

        results.push({
          orderId: order.id,
          success: true,
          refund: refundData,
          message: `Refund of $${refundData.amount} processed successfully`
        })

        successCount++
        console.log(`✅ Order ${order.id} refunded successfully: ${refund.id}`)

      } catch (error: any) {
        console.error(`❌ Failed to process refund for order ${order.id}:`, error)
        
        results.push({
          orderId: order.id,
          success: false,
          error: error.message,
          message: `Refund processing failed: ${error.message}`
        })
        
        failureCount++
      }
    }

    console.log(`📊 System refund batch complete: ${successCount} successful, ${failureCount} failed`)

    return NextResponse.json({
      success: true,
      summary: {
        type,
        reason,
        totalOrders: targetOrders.length,
        successCount,
        failureCount,
        totalRefunded: results
          .filter(r => r.success)
          .reduce((sum, r) => sum + (r.refund?.amount || 0), 0)
      },
      results
    })

  } catch (error) {
    console.error('System refund processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/refunds/process - Get refund candidates for review
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'expired_orders'

    let candidates = []

    if (type === 'expired_orders') {
      // Find orders that are overdue (pending/accepted for more than 14 days)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - 14)

      const { data: expiredOrders, error: fetchError } = await serviceClient
        .from('orders')
        .select(`
          *,
          user:profiles!user_id(id, display_name, email),
          creator:profiles!creator_id(id, display_name)
        `)
        .in('status', ['pending', 'accepted'])
        .lt('created_at', cutoffDate.toISOString())
        .is('payment_intent_id', 'not.null')
        .order('created_at', { ascending: true })

      if (fetchError) {
        return NextResponse.json(
          { error: 'Failed to fetch expired orders' },
          { status: 500 }
        )
      }

      candidates = expiredOrders || []
    }

    const totalRefundAmount = candidates.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0)

    return NextResponse.json({
      success: true,
      type,
      candidates: candidates.length,
      totalRefundAmount,
      orders: candidates
    })

  } catch (error) {
    console.error('Get refund candidates error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}