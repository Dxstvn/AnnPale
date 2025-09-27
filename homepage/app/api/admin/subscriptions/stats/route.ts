import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SANDBOX_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia'
    })
  : null

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get subscription statistics
    const { data: subscriptions, error } = await supabase
      .from('subscription_orders')
      .select('status, total_amount, billing_period, created_at, cancelled_at')

    if (error) {
      console.error('Error fetching subscriptions:', error)
      return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
    }

    // Calculate statistics
    const stats = {
      total: subscriptions?.length || 0,
      active: subscriptions?.filter(s => s.status === 'active').length || 0,
      trialing: subscriptions?.filter(s => s.status === 'trialing').length || 0,
      paused: subscriptions?.filter(s => s.status === 'paused').length || 0,
      cancelled: subscriptions?.filter(s => s.status === 'cancelled').length || 0,
      expired: subscriptions?.filter(s => s.status === 'expired').length || 0,
      pending: subscriptions?.filter(s => s.status === 'pending').length || 0,
      totalRevenue: subscriptions?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0,
      monthlyRecurringRevenue: 0,
      averageSubscriptionValue: 0,
      churnRate: 0
    }

    // Calculate MRR (only active subscriptions)
    const activeSubscriptions = subscriptions?.filter(s => s.status === 'active') || []
    stats.monthlyRecurringRevenue = activeSubscriptions.reduce((sum, s) => {
      // Convert to monthly amount
      const amount = s.total_amount || 0
      if (s.billing_period === 'yearly') {
        return sum + (amount / 12)
      }
      return sum + amount
    }, 0)

    // Calculate average subscription value
    if (stats.active > 0) {
      stats.averageSubscriptionValue = stats.monthlyRecurringRevenue / stats.active
    }

    // Calculate churn rate (cancelled in last 30 days / total at start)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentCancellations = subscriptions?.filter(s =>
      s.status === 'cancelled' &&
      s.cancelled_at &&
      new Date(s.cancelled_at) > thirtyDaysAgo
    ).length || 0

    if (stats.total > 0) {
      stats.churnRate = (recentCancellations / stats.total) * 100
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}