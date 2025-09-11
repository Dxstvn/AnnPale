import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { OrderService } from '@/lib/services'

// GET /api/fan/orders - Get all orders for the authenticated fan
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const orderService = new OrderService(supabase)

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get query parameters for filtering
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const creatorId = url.searchParams.get('creatorId')
    const limit = url.searchParams.get('limit')

    // Get user orders
    const ordersResult = await orderService.getUserOrders(user.id)

    if (!ordersResult.success) {
      return NextResponse.json(
        { error: ordersResult.error },
        { status: 500 }
      )
    }

    let orders = ordersResult.data || []

    // Apply filters if provided
    if (status) {
      orders = orders.filter(order => order.status === status)
    }

    if (creatorId) {
      orders = orders.filter(order => order.creator_id === creatorId)
    }

    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit)
      if (!isNaN(limitNum) && limitNum > 0) {
        orders = orders.slice(0, limitNum)
      }
    }

    // Calculate summary stats
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      accepted: orders.filter(o => o.status === 'accepted').length,
      in_progress: orders.filter(o => o.status === 'in_progress').length,
      completed: orders.filter(o => o.status === 'completed').length,
      total_spent: orders.reduce((sum, o) => sum + o.amount, 0),
      videos_received: orders.filter(o => o.status === 'completed').length
    }

    return NextResponse.json({
      success: true,
      data: orders,
      stats
    })

  } catch (error) {
    console.error('Fan orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}