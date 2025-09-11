import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/creator/earnings - Get creator earnings and statistics
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

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

    // Get query parameters
    const url = new URL(request.url)
    const range = url.searchParams.get('range') || '30d'
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch(range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
    }

    // Get earnings data from orders table
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('creator_id', user.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('Error fetching orders:', ordersError)
      return NextResponse.json(
        { error: 'Failed to fetch earnings data' },
        { status: 500 }
      )
    }

    const earnings = orders || []

    // Calculate statistics
    const completedOrders = earnings.filter(e => e.status === 'completed')
    const pendingOrders = earnings.filter(e => ['pending', 'accepted', 'in_progress'].includes(e.status))
    
    const totalEarnings = completedOrders.reduce((sum, e) => sum + (e.creator_earnings || 0), 0)
    const totalGross = completedOrders.reduce((sum, e) => sum + (e.total_amount || 0), 0)
    const platformFees = completedOrders.reduce((sum, e) => sum + (e.platform_fee || 0), 0)
    
    // Get today's earnings
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayEarnings = completedOrders
      .filter(e => new Date(e.completed_at || e.created_at) >= today)
      .reduce((sum, e) => sum + (e.creator_earnings || 0), 0)
    
    // Get this month's earnings
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthlyEarnings = completedOrders
      .filter(e => new Date(e.completed_at || e.created_at) >= startOfMonth)
      .reduce((sum, e) => sum + (e.creator_earnings || 0), 0)
    
    const stats = {
      total_earnings: totalEarnings,
      monthly_earnings: monthlyEarnings,
      today_earnings: todayEarnings,
      pending_payouts: pendingOrders.reduce((sum, e) => sum + (e.creator_earnings || 0), 0),
      completed_orders: completedOrders.length,
      average_order_value: completedOrders.length > 0 ? totalGross / completedOrders.length : 0,
      platform_fees: platformFees,
      net_earnings: totalEarnings
    }

    // Group earnings by day for chart data
    const dailyEarnings: Record<string, any> = {}
    
    // Initialize all days in range with zero values
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0]
      dailyEarnings[dateKey] = {
        date: dateKey,
        gross_earnings: 0,
        net_earnings: 0,
        platform_fees: 0,
        order_count: 0
      }
    }
    
    // Fill in actual earnings data
    completedOrders.forEach(order => {
      const dateKey = (order.completed_at || order.created_at).split('T')[0]
      if (dailyEarnings[dateKey]) {
        dailyEarnings[dateKey].gross_earnings += order.total_amount || 0
        dailyEarnings[dateKey].net_earnings += order.creator_earnings || 0
        dailyEarnings[dateKey].platform_fees += order.platform_fee || 0
        dailyEarnings[dateKey].order_count += 1
      }
    })

    const daily = Object.values(dailyEarnings).sort((a: any, b: any) => 
      a.date.localeCompare(b.date)
    )

    return NextResponse.json({
      success: true,
      summary: stats,
      daily,
      range
    })

  } catch (error) {
    console.error('Creator earnings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}