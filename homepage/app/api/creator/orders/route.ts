import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { OrderService } from '@/lib/services'

// GET /api/creator/orders - Get all orders for the authenticated creator
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

    // Verify user is a creator
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.user_type !== 'creator') {
      return NextResponse.json(
        { error: 'Creator access required' },
        { status: 403 }
      )
    }

    // Get query parameters for filtering
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const limit = url.searchParams.get('limit')

    // Get creator orders using service layer
    const ordersResult = await orderService.getCreatorOrders(user.id)

    if (!ordersResult.success) {
      return NextResponse.json(
        { error: ordersResult.error || 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    let orders = ordersResult.data || []

    // Apply filters if provided
    if (status) {
      orders = orders.filter(order => order.status === status)
    }

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
      total_earnings: orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.creator_earnings || 0), 0)
    }

    return NextResponse.json({
      success: true,
      data: orders,
      stats
    })

  } catch (error) {
    console.error('Creator orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}