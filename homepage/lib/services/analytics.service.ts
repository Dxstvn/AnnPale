// Analytics Service for Revenue Tracking
// Created: 2025-09-12

import { createClient } from '@/lib/supabase/server'
import { analyticsCacheService } from '@/lib/cache/redis'
import type { 
  RevenueAnalyticsResponse,
  AnalyticsFilters,
  DailyRevenueData,
  MonthlyRevenueData,
  OccasionBreakdown,
  AnalyticsSummary,
  GrowthMetrics,
  OccasionType,
  OCCASION_CATEGORIES,
  AnalyticsRow,
  TopCustomer,
  LoyalSubscriber
} from '@/types/analytics'
import { format, subDays, subMonths, startOfMonth, endOfMonth, parseISO, differenceInDays } from 'date-fns'

export class AnalyticsService {
  private supabase: any

  async init() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
    return this.supabase
  }

  /**
   * Get comprehensive revenue analytics for a creator
   */
  async getRevenueAnalytics(
    creatorId: string, 
    filters: AnalyticsFilters
  ): Promise<RevenueAnalyticsResponse> {
    // Initialize supabase client
    await this.init()
    
    const { period, startDate, endDate, occasionType, includeSubscriptions = true } = filters
    
    // Check cache first
    const cachedData = await analyticsCacheService.getRevenueAnalytics(
      creatorId, period, startDate, endDate
    )
    
    if (cachedData) {
      return cachedData
    }

    // Calculate date range
    const dateRange = this.calculateDateRange(period, startDate, endDate)
    
    // Fetch parallel data
    const [
      dailyData,
      monthlyData,
      occasionData,
      totalStats,
      previousPeriodStats,
      topCustomers,
      loyalSubscribers,
      subscriptionStats
    ] = await Promise.all([
      this.getDailyRevenue(creatorId, dateRange.start, dateRange.end, occasionType),
      this.getMonthlyRevenue(creatorId, dateRange.start, dateRange.end),
      this.getOccasionBreakdown(creatorId, dateRange.start, dateRange.end),
      this.getTotalStats(creatorId, dateRange.start, dateRange.end, occasionType),
      this.getPreviousPeriodStats(creatorId, dateRange.start, dateRange.end, period),
      this.getTopCustomers(creatorId, dateRange.start, dateRange.end),
      this.getLoyalSubscribers(creatorId),
      this.getSubscriptionStats(creatorId)
    ])

    // Calculate growth metrics
    const revenueGrowth = this.calculateGrowth(
      totalStats.total_revenue || 0,
      previousPeriodStats.total_revenue || 0
    )

    const orderGrowth = this.calculateGrowth(
      totalStats.total_orders || 0,
      previousPeriodStats.total_orders || 0
    )

    const result: RevenueAnalyticsResponse = {
      totalRevenue: totalStats.total_revenue || 0,
      totalOrders: totalStats.total_orders || 0,
      avgOrderValue: totalStats.total_orders > 0 ? 
        (totalStats.total_revenue || 0) / totalStats.total_orders : 0,
      revenueGrowth: revenueGrowth,
      orderGrowth: orderGrowth,
      totalSubscribers: subscriptionStats.totalSubscribers || 0,
      activeSubscribers: subscriptionStats.activeSubscribers || 0,
      monthlyRecurringRevenue: subscriptionStats.monthlyRecurringRevenue || 0,
      subscriptionGrowth: subscriptionStats.subscriptionGrowth || 0,
      monthlyStats: {
        thisMonth: {
          revenue: totalStats.total_revenue || 0,
          orders: totalStats.total_orders || 0
        },
        lastMonth: {
          revenue: previousPeriodStats.total_revenue || 0,
          orders: previousPeriodStats.total_orders || 0
        }
      },
      dailyRevenue: dailyData,
      monthlyRevenue: monthlyData,
      occasionBreakdown: occasionData,
      topCustomers: topCustomers,
      loyalSubscribers: loyalSubscribers,
      period,
      startDate: format(dateRange.start, 'yyyy-MM-dd'),
      endDate: format(dateRange.end, 'yyyy-MM-dd')
    }

    // Cache the result
    await analyticsCacheService.setRevenueAnalytics(
      creatorId, period, result, startDate, endDate
    )

    return result
  }

  /**
   * Get analytics summary for dashboard cards
   */
  async getAnalyticsSummary(
    creatorId: string,
    period: string = '30d'
  ): Promise<AnalyticsSummary> {
    await this.init()
    const filters: AnalyticsFilters = { period: period as any }
    const analytics = await this.getRevenueAnalytics(creatorId, filters)
    
    // Find top occasion
    const topOccasion = analytics.occasionBreakdown.reduce(
      (max, current) => current.revenue > max.revenue ? current : max,
      { type: 'other' as OccasionType, revenue: 0, percentage: 0 }
    )

    return {
      totalRevenue: analytics.totalRevenue,
      totalOrders: analytics.totalOrders,
      avgOrderValue: analytics.avgOrderValue,
      revenueGrowth: {
        current: analytics.totalRevenue,
        previous: analytics.monthlyStats.lastMonth.revenue,
        change: analytics.totalRevenue - analytics.monthlyStats.lastMonth.revenue,
        percentage: analytics.revenueGrowth,
        trend: analytics.revenueGrowth > 0 ? 'up' : analytics.revenueGrowth < 0 ? 'down' : 'stable'
      },
      orderGrowth: {
        current: analytics.totalOrders,
        previous: analytics.monthlyStats.lastMonth.orders,
        change: analytics.totalOrders - analytics.monthlyStats.lastMonth.orders,
        percentage: analytics.orderGrowth,
        trend: analytics.orderGrowth > 0 ? 'up' : analytics.orderGrowth < 0 ? 'down' : 'stable'
      },
      topOccasion: {
        type: topOccasion.occasion,
        revenue: topOccasion.revenue,
        percentage: topOccasion.percentage
      },
      periodLabel: this.getPeriodLabel(period)
    }
  }

  /**
   * Get daily revenue data for charts
   */
  private async getDailyRevenue(
    creatorId: string,
    startDate: Date,
    endDate: Date,
    occasionType?: OccasionType
  ): Promise<DailyRevenueData[]> {
    await this.init()
    let query = this.supabase
      .from('creator_revenue_analytics')
      .select('date, total_revenue, total_orders')
      .eq('creator_id', creatorId)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'))
      .order('date', { ascending: true })

    // If specific occasion type requested, use occasion analytics instead
    if (occasionType) {
      query = this.supabase
        .from('creator_occasion_analytics')
        .select('date, revenue, order_count')
        .eq('creator_id', creatorId)
        .eq('occasion_type', occasionType)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching daily revenue:', error)
      return []
    }

    // Fill missing dates with zero values
    const result: DailyRevenueData[] = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      const dayData = data?.find((d: any) => d.date === dateStr)
      
      result.push({
        date: dateStr,
        revenue: occasionType ? 
          (dayData?.revenue || 0) : 
          (dayData?.total_revenue || 0),
        orders: occasionType ?
          (dayData?.order_count || 0) :
          (dayData?.total_orders || 0)
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  }

  /**
   * Get monthly revenue data for charts
   */
  private async getMonthlyRevenue(
    creatorId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MonthlyRevenueData[]> {
    await this.init()
    const { data, error } = await this.supabase
      .from('creator_monthly_analytics')
      .select('month, total_revenue, total_orders, revenue_growth_percentage')
      .eq('creator_id', creatorId)
      .gte('month', format(startOfMonth(startDate), 'yyyy-MM-dd'))
      .lte('month', format(startOfMonth(endDate), 'yyyy-MM-dd'))
      .order('month', { ascending: true })

    if (error) {
      console.error('Error fetching monthly revenue:', error)
      return []
    }

    return (data || []).map(item => ({
      month: format(parseISO(item.month), 'MMM'),
      revenue: item.total_revenue || 0,
      orders: item.total_orders || 0,
      growth: item.revenue_growth_percentage || 0
    }))
  }

  /**
   * Get occasion breakdown for pie chart
   */
  private async getOccasionBreakdown(
    creatorId: string,
    startDate: Date,
    endDate: Date
  ): Promise<OccasionBreakdown[]> {
    await this.init()
    const { data, error } = await this.supabase
      .from('creator_occasion_analytics')
      .select('occasion_type, revenue, order_count')
      .eq('creator_id', creatorId)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'))

    if (error) {
      console.error('Error fetching occasion breakdown:', error)
      return []
    }

    // Aggregate by occasion type
    const aggregated = new Map<string, { revenue: number, orders: number }>()
    
    data?.forEach(item => {
      const existing = aggregated.get(item.occasion_type) || { revenue: 0, orders: 0 }
      aggregated.set(item.occasion_type, {
        revenue: existing.revenue + (item.revenue || 0),
        orders: existing.orders + (item.order_count || 0)
      })
    })

    const totalRevenue = Array.from(aggregated.values())
      .reduce((sum, item) => sum + item.revenue, 0)

    const result: OccasionBreakdown[] = []
    
    // Convert to breakdown format
    for (const [occasion, stats] of aggregated) {
      const occasionType = occasion as OccasionType
      const percentage = totalRevenue > 0 ? (stats.revenue / totalRevenue) * 100 : 0
      
      result.push({
        occasion: occasionType,
        revenue: stats.revenue,
        percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
        order_count: stats.orders,
        avg_order_value: stats.orders > 0 ? stats.revenue / stats.orders : 0,
        color: this.getOccasionColor(occasionType)
      })
    }

    // Sort by revenue descending
    return result.sort((a, b) => b.revenue - a.revenue)
  }

  /**
   * Get total stats for the period
   */
  private async getTotalStats(
    creatorId: string,
    startDate: Date,
    endDate: Date,
    occasionType?: OccasionType
  ): Promise<{ total_revenue: number, total_orders: number }> {
    await this.init()
    let query = this.supabase
      .from('creator_revenue_analytics')
      .select('total_revenue, total_orders')
      .eq('creator_id', creatorId)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'))

    if (occasionType) {
      query = this.supabase
        .from('creator_occasion_analytics')
        .select('revenue, order_count')
        .eq('creator_id', creatorId)
        .eq('occasion_type', occasionType)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching total stats:', error)
      return { total_revenue: 0, total_orders: 0 }
    }

    const total = data?.reduce((sum: any, item: any) => ({
      total_revenue: sum.total_revenue + (occasionType ? 
        (item.revenue || 0) : (item.total_revenue || 0)),
      total_orders: sum.total_orders + (occasionType ?
        (item.order_count || 0) : (item.total_orders || 0))
    }), { total_revenue: 0, total_orders: 0 })

    return total || { total_revenue: 0, total_orders: 0 }
  }

  /**
   * Get previous period stats for comparison
   */
  private async getPreviousPeriodStats(
    creatorId: string,
    currentStart: Date,
    currentEnd: Date,
    period: string
  ): Promise<{ total_revenue: number, total_orders: number }> {
    const periodDuration = currentEnd.getTime() - currentStart.getTime()
    const previousStart = new Date(currentStart.getTime() - periodDuration)
    const previousEnd = new Date(currentStart.getTime() - 1) // Day before current period

    return await this.getTotalStats(creatorId, previousStart, previousEnd)
  }

  /**
   * Calculate growth percentage
   */
  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100 * 10) / 10
  }

  /**
   * Calculate date range based on period
   */
  private calculateDateRange(
    period: string,
    startDate?: string,
    endDate?: string
  ): { start: Date, end: Date } {
    const now = new Date()
    
    if (period === 'custom' && startDate && endDate) {
      return {
        start: parseISO(startDate),
        end: parseISO(endDate)
      }
    }

    switch (period) {
      case '7d':
        return {
          start: subDays(now, 7),
          end: now
        }
      case '30d':
        return {
          start: subDays(now, 30),
          end: now
        }
      case '90d':
        return {
          start: subDays(now, 90),
          end: now
        }
      case '1y':
        return {
          start: subDays(now, 365),
          end: now
        }
      default:
        return {
          start: subDays(now, 30),
          end: now
        }
    }
  }

  /**
   * Get color for occasion type
   */
  private getOccasionColor(occasion: OccasionType): string {
    const colors = {
      birthday: '#9333EA',
      anniversary: '#EC4899', 
      graduation: '#F59E0B',
      holiday: '#10B981',
      custom: '#3B82F6',
      other: '#6B7280'
    }
    return colors[occasion] || colors.other
  }

  /**
   * Get display label for period
   */
  private getPeriodLabel(period: string): string {
    const labels = {
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days',
      '90d': 'Last 90 Days', 
      '1y': 'Last Year',
      'custom': 'Custom Range'
    }
    return labels[period as keyof typeof labels] || 'Last 30 Days'
  }

  /**
   * Update analytics for a new/completed order
   */
  async updateAnalyticsForOrder(
    creatorId: string,
    orderId: string,
    amount: number,
    occasionType: OccasionType,
    orderDate: Date = new Date()
  ): Promise<void> {
    await this.init()
    const dateStr = format(orderDate, 'yyyy-MM-dd')
    const monthStr = format(startOfMonth(orderDate), 'yyyy-MM-dd')

    try {
      // Update daily analytics
      await this.supabase
        .from('creator_revenue_analytics')
        .upsert({
          creator_id: creatorId,
          date: dateStr,
          total_revenue: amount,
          total_orders: 1,
          video_request_revenue: amount,
          net_earnings: amount
        }, {
          onConflict: 'creator_id, date',
          ignoreDuplicates: false
        })

      // Update occasion analytics  
      await this.supabase
        .from('creator_occasion_analytics')
        .upsert({
          creator_id: creatorId,
          occasion_type: occasionType,
          date: dateStr,
          revenue: amount,
          order_count: 1,
          avg_order_value: amount
        }, {
          onConflict: 'creator_id, occasion_type, date',
          ignoreDuplicates: false
        })

      // Refresh materialized view
      await this.supabase.rpc('refresh_revenue_summary')

      // Invalidate cache for this creator
      await analyticsCacheService.invalidateCreatorCache(creatorId)

    } catch (error) {
      console.error('Error updating analytics:', error)
      throw error
    }
  }

  /**
   * Process historical data for analytics
   */
  async processHistoricalData(creatorId: string): Promise<void> {
    await this.init()
    try {
      // Get all completed video requests that haven't been processed
      const { data: requests, error } = await this.supabase
        .from('video_requests')
        .select('id, creator_id, creator_earnings, occasion, status, updated_at, analytics_processed')
        .eq('creator_id', creatorId)
        .eq('status', 'completed')
        .eq('analytics_processed', false)
        .gt('creator_earnings', 0)

      if (error) throw error

      // Process each request
      for (const request of requests || []) {
        // Categorize the occasion
        const occasionType = await this.categorizeOccasion(request.occasion)
        
        // Update analytics
        await this.updateAnalyticsForOrder(
          request.creator_id,
          request.id,
          request.creator_earnings,
          occasionType,
          new Date(request.updated_at)
        )

        // Mark as processed
        await this.supabase
          .from('video_requests')
          .update({
            analytics_processed: true,
            processed_at: new Date().toISOString(),
            occasion_category: occasionType
          })
          .eq('id', request.id)
      }

      console.log(`Processed ${requests?.length || 0} historical records for creator ${creatorId}`)

    } catch (error) {
      console.error('Error processing historical data:', error)
      throw error
    }
  }

  /**
   * Categorize occasion text into predefined types
   */
  private async categorizeOccasion(occasion: string): Promise<OccasionType> {
    if (!occasion) return 'other'
    
    const text = occasion.toLowerCase().trim()
    
    // Birthday
    if (text.includes('birthday') || text.includes('bday') || text.includes('born day')) {
      return 'birthday'
    }
    
    // Anniversary  
    if (text.includes('anniversary') || text.includes('wedding') || text.includes('married')) {
      return 'anniversary'
    }
    
    // Graduation
    if (text.includes('graduation') || text.includes('graduate') || text.includes('diploma')) {
      return 'graduation'
    }
    
    // Holiday
    if (text.includes('christmas') || text.includes('holiday') || text.includes('valentine')) {
      return 'holiday'
    }
    
    // Custom
    if (text.includes('custom') || text.includes('special') || text.includes('personal')) {
      return 'custom'
    }
    
    return 'other'
  }

  /**
   * Get top customers by video request orders
   */
  async getTopCustomers(
    creatorId: string,
    startDate: Date,
    endDate: Date,
    limit: number = 5
  ): Promise<TopCustomer[]> {
    await this.init()
    
    try {
      // Query video_requests grouped by fan_id
      const { data: topCustomers, error } = await this.supabase
        .from('video_requests')
        .select(`
          fan_id,
          profiles!video_requests_fan_id_fkey (
            id,
            name,
            email,
            avatar_url
          )
        `)
        .eq('creator_id', creatorId)
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
      
      if (error) {
        console.error('Error fetching top customers:', error)
        return []
      }

      // Group by fan_id and calculate stats
      const customerMap = new Map<string, any>()
      
      for (const request of topCustomers || []) {
        const fanId = request.fan_id
        if (!customerMap.has(fanId)) {
          customerMap.set(fanId, {
            customerId: fanId,
            customerName: request.profiles?.name || 'Unknown',
            customerEmail: request.profiles?.email,
            avatarUrl: request.profiles?.avatar_url,
            orders: [],
            totalOrders: 0,
            totalRevenue: 0
          })
        }
        
        const customer = customerMap.get(fanId)
        customer.orders.push(request)
      }

      // Now fetch order amounts for completed requests
      const { data: orders, error: ordersError } = await this.supabase
        .from('orders')
        .select('fan_id, amount, created_at')
        .eq('creator_id', creatorId)
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      if (!ordersError && orders) {
        for (const order of orders) {
          if (customerMap.has(order.fan_id)) {
            const customer = customerMap.get(order.fan_id)
            customer.totalOrders++
            customer.totalRevenue += parseFloat(order.amount || 0)
            
            // Track dates
            if (!customer.firstOrderDate || order.created_at < customer.firstOrderDate) {
              customer.firstOrderDate = order.created_at
            }
            if (!customer.lastOrderDate || order.created_at > customer.lastOrderDate) {
              customer.lastOrderDate = order.created_at
            }
          }
        }
      }

      // Convert to array and calculate averages
      const customers: TopCustomer[] = Array.from(customerMap.values())
        .map(customer => ({
          customerId: customer.customerId,
          customerName: customer.customerName,
          customerEmail: customer.customerEmail,
          avatarUrl: customer.avatarUrl,
          totalOrders: customer.totalOrders,
          totalRevenue: customer.totalRevenue,
          avgOrderValue: customer.totalOrders > 0 ? customer.totalRevenue / customer.totalOrders : 0,
          firstOrderDate: customer.firstOrderDate,
          lastOrderDate: customer.lastOrderDate
        }))
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, limit)

      return customers

    } catch (error) {
      console.error('Error getting top customers:', error)
      return []
    }
  }

  /**
   * Get loyal subscribers with longest subscription duration
   */
  async getLoyalSubscribers(
    creatorId: string,
    limit: number = 5
  ): Promise<LoyalSubscriber[]> {
    await this.init()
    
    try {
      // Query creator_subscriptions table with subscriber profiles and tier info
      const { data: subscriptions, error } = await this.supabase
        .from('creator_subscriptions')
        .select(`
          id,
          subscriber_id,
          creator_id,
          tier_id,
          status,
          started_at,
          expires_at,
          cancelled_at,
          subscriber:profiles!creator_subscriptions_subscriber_id_fkey (
            id,
            name,
            email,
            avatar_url
          ),
          tier:creator_subscription_tiers!creator_subscriptions_tier_id_fkey (
            id,
            tier_name,
            price
          )
        `)
        .eq('creator_id', creatorId)
        .in('status', ['active', 'paused'])
        .order('started_at', { ascending: true })

      if (error) {
        console.error('Error fetching loyal subscribers:', error)
        return []
      }

      const loyalSubscribers: LoyalSubscriber[] = (subscriptions || [])
        .slice(0, limit)
        .map(sub => {
          const subscriptionDuration = differenceInDays(new Date(), new Date(sub.started_at))
          const monthlyRevenue = sub.tier?.price || 5.00 // Use tier price or default
          const monthsActive = Math.floor(subscriptionDuration / 30)
          
          return {
            customerId: sub.subscriber_id,
            customerName: sub.subscriber?.name || 'Unknown',
            customerEmail: sub.subscriber?.email,
            avatarUrl: sub.subscriber?.avatar_url,
            subscriptionDuration: subscriptionDuration,
            tierName: sub.tier?.tier_name || 'Fan Support', 
            tierPrice: monthlyRevenue,
            totalRevenue: monthlyRevenue * monthsActive,
            startDate: sub.started_at,
            status: sub.status as 'active' | 'paused',
            nextBillingDate: sub.expires_at
          }
        })
        .sort((a, b) => b.subscriptionDuration - a.subscriptionDuration)

      return loyalSubscribers

    } catch (error) {
      console.error('Error getting loyal subscribers:', error)
      return []
    }
  }

  /**
   * Get subscription statistics for a creator
   */
  async getSubscriptionStats(creatorId: string): Promise<any> {
    await this.init()
    
    try {
      // Get all subscriptions for this creator from creator_subscriptions table
      const { data: subscriptions, error } = await this.supabase
        .from('creator_subscriptions')
        .select(`
          *,
          tier:creator_subscription_tiers!creator_subscriptions_tier_id_fkey (
            tier_name,
            price
          )
        `)
        .eq('creator_id', creatorId)

      if (error) {
        console.error('Error fetching subscription stats:', error)
        return {
          totalSubscribers: 0,
          activeSubscribers: 0,
          monthlyRecurringRevenue: 0,
          subscriptionGrowth: 0
        }
      }

      // Calculate stats
      const now = new Date()
      const lastMonth = subMonths(now, 1)
      
      const activeSubscriptions = subscriptions?.filter(s => 
        s.status === 'active' || s.status === 'trialing'
      ) || []
      
      const totalSubscriptions = subscriptions?.length || 0
      const activeCount = activeSubscriptions.length
      
      // Calculate MRR (Monthly Recurring Revenue)
      const mrr = activeSubscriptions.reduce((sum, sub) => {
        const price = sub.tier?.price || 5.00 // Use tier price or default to $5
        return sum + price
      }, 0)
      
      // Calculate growth (subscriptions created in last 30 days)
      const recentSubscriptions = subscriptions?.filter(s => 
        new Date(s.started_at || s.created_at) > lastMonth
      ) || []
      
      const growthPercentage = totalSubscriptions > 0 
        ? (recentSubscriptions.length / totalSubscriptions) * 100
        : 0

      return {
        totalSubscribers: totalSubscriptions,
        activeSubscribers: activeCount,
        monthlyRecurringRevenue: mrr,
        subscriptionGrowth: growthPercentage
      }

    } catch (error) {
      console.error('Error getting subscription stats:', error)
      return {
        totalSubscribers: 0,
        activeSubscribers: 0,
        monthlyRecurringRevenue: 0,
        subscriptionGrowth: 0
      }
    }
  }
}