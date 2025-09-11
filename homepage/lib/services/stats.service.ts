import { BaseService, ServiceResult } from './base.service'
import type { Database } from '@/types/supabase'

type CreatorStats = Database['public']['Tables']['creator_stats']['Row']
type PlatformRevenue = Database['public']['Tables']['platform_revenue']['Row']
type DailyPlatformStats = Database['public']['Tables']['daily_platform_stats']['Row']

export interface CreatorAnalytics {
  stats: CreatorStats
  recentOrders: number
  monthlyEarnings: number
  weeklyEarnings: number
  topPerformingDays: Array<{ date: string; earnings: number }>
  rank?: {
    earnings: number
    orders: number
    rating: number
  }
}

export interface PlatformAnalytics {
  dailyStats: DailyPlatformStats
  totalRevenue: number
  totalOrders: number
  activeCreators: number
  activeFans: number
  revenueGrowth: number
  orderGrowth: number
}

export class StatsService extends BaseService {
  /**
   * Get or create creator statistics
   */
  async getCreatorStats(creatorId: string): Promise<ServiceResult<CreatorStats>> {
    try {
      this.validateRequired(creatorId, 'Creator ID')
      this.validateUUID(creatorId, 'Creator ID')

      // Try to get existing stats
      let { data: stats, error } = await this.supabase
        .from('creator_stats')
        .select('*')
        .eq('creator_id', creatorId)
        .single()

      // If no stats exist, create them
      if (!stats) {
        const { data: newStats, error: insertError } = await this.supabase
          .from('creator_stats')
          .insert({ creator_id: creatorId })
          .select()
          .single()

        if (insertError) {
          return this.handleError(insertError, 'getCreatorStats')
        }

        stats = newStats
      }

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        return this.handleError(error, 'getCreatorStats')
      }

      return {
        success: true,
        data: stats!
      }
    } catch (error) {
      return this.handleError(error, 'getCreatorStats')
    }
  }

  /**
   * Update creator statistics manually
   * (Most updates happen via database triggers, but this allows manual updates)
   */
  async updateCreatorStats(
    creatorId: string,
    updates: Partial<CreatorStats>
  ): Promise<ServiceResult<CreatorStats>> {
    try {
      this.validateRequired(creatorId, 'Creator ID')
      this.validateUUID(creatorId, 'Creator ID')

      const { data, error } = await this.supabase
        .from('creator_stats')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('creator_id', creatorId)
        .select()
        .single()

      if (error) {
        return this.handleError(error, 'updateCreatorStats')
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      return this.handleError(error, 'updateCreatorStats')
    }
  }

  /**
   * Get comprehensive creator analytics
   */
  async getCreatorAnalytics(creatorId: string): Promise<ServiceResult<CreatorAnalytics>> {
    try {
      this.validateRequired(creatorId, 'Creator ID')
      this.validateUUID(creatorId, 'Creator ID')

      // Get basic stats
      const statsResult = await this.getCreatorStats(creatorId)
      if (!statsResult.success || !statsResult.data) {
        return {
          success: false,
          error: 'Failed to retrieve creator stats'
        }
      }

      // Get recent orders count (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: recentOrders } = await this.supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creatorId)
        .gte('created_at', thirtyDaysAgo.toISOString())

      // Get monthly earnings
      const { data: monthlyEarningsData } = await this.supabase
        .from('orders')
        .select('creator_earnings')
        .eq('creator_id', creatorId)
        .eq('status', 'completed')
        .gte('created_at', thirtyDaysAgo.toISOString())

      const monthlyEarnings = monthlyEarningsData?.reduce(
        (sum, order) => sum + (order.creator_earnings || 0),
        0
      ) || 0

      // Get weekly earnings
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data: weeklyEarningsData } = await this.supabase
        .from('orders')
        .select('creator_earnings')
        .eq('creator_id', creatorId)
        .eq('status', 'completed')
        .gte('created_at', sevenDaysAgo.toISOString())

      const weeklyEarnings = weeklyEarningsData?.reduce(
        (sum, order) => sum + (order.creator_earnings || 0),
        0
      ) || 0

      // Get top performing days
      const { data: dailyEarnings } = await this.supabase
        .rpc('get_creator_daily_earnings', {
          p_creator_id: creatorId,
          p_days: 30
        })

      const topPerformingDays = (dailyEarnings || [])
        .sort((a: any, b: any) => b.earnings - a.earnings)
        .slice(0, 5)
        .map((day: any) => ({
          date: day.date,
          earnings: day.earnings
        }))

      // Get creator ranking (if materialized view exists)
      const { data: ranking } = await this.supabase
        .from('creator_rankings')
        .select('earnings_rank, orders_rank, rating_rank')
        .eq('creator_id', creatorId)
        .single()

      return {
        success: true,
        data: {
          stats: statsResult.data,
          recentOrders: recentOrders || 0,
          monthlyEarnings,
          weeklyEarnings,
          topPerformingDays,
          rank: ranking ? {
            earnings: ranking.earnings_rank,
            orders: ranking.orders_rank,
            rating: ranking.rating_rank
          } : undefined
        }
      }
    } catch (error) {
      return this.handleError(error, 'getCreatorAnalytics')
    }
  }

  /**
   * Record platform revenue from an order
   */
  async recordPlatformRevenue(params: {
    orderId: string
    paymentIntentId: string
    platformFee: number
    stripeFee?: number
    creatorId: string
    fanId: string
    metadata?: any
  }): Promise<ServiceResult<PlatformRevenue>> {
    try {
      this.validateRequired(params.orderId, 'Order ID')
      this.validateRequired(params.paymentIntentId, 'Payment Intent ID')
      this.validateAmount(params.platformFee, 'Platform fee')
      this.validateUUID(params.orderId, 'Order ID')
      this.validateUUID(params.creatorId, 'Creator ID')
      this.validateUUID(params.fanId, 'Fan ID')

      const netRevenue = params.platformFee - (params.stripeFee || 0)

      const { data, error } = await this.supabase
        .from('platform_revenue')
        .insert({
          order_id: params.orderId,
          payment_intent_id: params.paymentIntentId,
          platform_fee: params.platformFee,
          stripe_fee: params.stripeFee || 0,
          net_revenue: netRevenue,
          creator_id: params.creatorId,
          fan_id: params.fanId,
          metadata: params.metadata || {},
          status: 'completed'
        })
        .select()
        .single()

      if (error) {
        return this.handleError(error, 'recordPlatformRevenue')
      }

      // Update daily stats
      await this.updateDailyStats({
        gross_revenue: params.platformFee,
        platform_fees: params.platformFee,
        stripe_fees: params.stripeFee || 0,
        net_revenue: netRevenue
      })

      return {
        success: true,
        data
      }
    } catch (error) {
      return this.handleError(error, 'recordPlatformRevenue')
    }
  }

  /**
   * Update daily platform statistics
   */
  async updateDailyStats(updates: Partial<DailyPlatformStats>): Promise<ServiceResult<DailyPlatformStats>> {
    try {
      const today = new Date().toISOString().split('T')[0]

      // Upsert daily stats
      const { data, error } = await this.supabase
        .from('daily_platform_stats')
        .upsert({
          date: today,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'date'
        })
        .select()
        .single()

      if (error) {
        return this.handleError(error, 'updateDailyStats')
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      return this.handleError(error, 'updateDailyStats')
    }
  }

  /**
   * Get platform-wide analytics
   */
  async getPlatformAnalytics(days: number = 30): Promise<ServiceResult<PlatformAnalytics>> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get today's stats
      const today = new Date().toISOString().split('T')[0]
      const { data: todayStats } = await this.supabase
        .from('daily_platform_stats')
        .select('*')
        .eq('date', today)
        .single()

      // Get total revenue for period
      const { data: revenueData } = await this.supabase
        .from('platform_revenue')
        .select('net_revenue')
        .gte('created_at', startDate.toISOString())
        .eq('status', 'completed')

      const totalRevenue = revenueData?.reduce(
        (sum, record) => sum + (record.net_revenue || 0),
        0
      ) || 0

      // Get total orders for period
      const { count: totalOrders } = await this.supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())

      // Get active users
      const { count: activeCreators } = await this.supabase
        .from('orders')
        .select('creator_id', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())

      const { count: activeFans } = await this.supabase
        .from('orders')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())

      // Calculate growth rates (compare to previous period)
      const previousStartDate = new Date(startDate)
      previousStartDate.setDate(previousStartDate.getDate() - days)

      const { data: previousRevenueData } = await this.supabase
        .from('platform_revenue')
        .select('net_revenue')
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString())
        .eq('status', 'completed')

      const previousRevenue = previousRevenueData?.reduce(
        (sum, record) => sum + (record.net_revenue || 0),
        0
      ) || 0

      const { count: previousOrders } = await this.supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString())

      const revenueGrowth = previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0

      const orderGrowth = previousOrders && previousOrders > 0
        ? ((totalOrders! - previousOrders) / previousOrders) * 100
        : 0

      return {
        success: true,
        data: {
          dailyStats: todayStats || {
            id: '',
            date: today,
            total_orders: 0,
            completed_orders: 0,
            refunded_orders: 0,
            gross_revenue: 0,
            platform_fees: 0,
            stripe_fees: 0,
            net_revenue: 0,
            total_refunds: 0,
            active_creators: 0,
            active_fans: 0,
            new_creators: 0,
            new_fans: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          totalRevenue,
          totalOrders: totalOrders || 0,
          activeCreators: activeCreators || 0,
          activeFans: activeFans || 0,
          revenueGrowth,
          orderGrowth
        }
      }
    } catch (error) {
      return this.handleError(error, 'getPlatformAnalytics')
    }
  }

  /**
   * Update average completion time for a creator
   */
  async updateAverageCompletionTime(creatorId: string): Promise<ServiceResult<void>> {
    try {
      this.validateRequired(creatorId, 'Creator ID')
      this.validateUUID(creatorId, 'Creator ID')

      // Call the database function to calculate average completion time
      const { data, error } = await this.supabase
        .rpc('calculate_average_completion_time', {
          p_creator_id: creatorId
        })

      if (error) {
        return this.handleError(error, 'updateAverageCompletionTime')
      }

      // Update the creator stats with the calculated average
      if (data) {
        await this.supabase
          .from('creator_stats')
          .update({
            average_completion_time: data,
            updated_at: new Date().toISOString()
          })
          .eq('creator_id', creatorId)
      }

      return { success: true }
    } catch (error) {
      return this.handleError(error, 'updateAverageCompletionTime')
    }
  }

  /**
   * Refresh creator rankings materialized view
   */
  async refreshCreatorRankings(): Promise<ServiceResult<void>> {
    try {
      const { error } = await this.supabase
        .rpc('refresh_creator_rankings')

      if (error) {
        return this.handleError(error, 'refreshCreatorRankings')
      }

      return { success: true }
    } catch (error) {
      return this.handleError(error, 'refreshCreatorRankings')
    }
  }
}