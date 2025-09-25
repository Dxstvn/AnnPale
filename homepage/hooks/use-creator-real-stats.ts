'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useSupabaseAuth } from '@/contexts/supabase-auth-compat';
import { createClient } from '@/lib/supabase/client';

// SWR configuration
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 30 * 1000, // 30 seconds for real-time feel
  dedupingInterval: 10 * 1000, // 10 seconds
};

export interface CreatorAnalytics {
  stats: any;
  recentOrders: number;
  monthlyEarnings: number;
  weeklyEarnings: number;
  topPerformingDays: Array<{ date: string; earnings: number }>;
}

export interface OrderWithDetails {
  id: string;
  user_id: string;
  creator_id: string;
  video_request_id: string;
  amount: number;
  platform_fee: number;
  creator_earnings: number;
  status: string;
  created_at: string;
  completed_at?: string;
  accepted_at?: string;
  metadata?: any;
  user?: {
    display_name?: string;
    avatar_url?: string;
  };
  video_request?: {
    occasion?: string;
    recipient_name?: string;
    instructions?: string;
    due_date?: string;
  };
}

/**
 * Hook to get real creator statistics from database
 */
export function useCreatorRealStats() {
  const { user } = useSupabaseAuth();
  const creatorId = user?.id;
  const supabase = createClient();

  // Fetch creator stats directly
  const { data: creatorStats, error: statsError, mutate: mutateStats } = useSWR(
    creatorId ? ['creatorStats', creatorId] : null,
    async () => {
      try {
        const { data, error } = await supabase
          .from('creator_stats')
          .select('*')
          .eq('creator_id', creatorId!)
          .maybeSingle(); // Use maybeSingle instead of single to handle no rows gracefully

        if (error) {
          console.error('Error fetching creator stats:', error);
          // Return default stats on error
          return {
            creator_id: creatorId,
            total_requests: 0,
            completed_videos: 0,
            pending_requests: 0,
            total_earnings: 0,
            average_rating: 0,
            total_reviews: 0,
            completion_rate: 0
          };
        }

        // If no stats exist, return default stats (view might not have data yet)
        if (!data) {
          return {
            creator_id: creatorId,
            total_requests: 0,
            completed_videos: 0,
            pending_requests: 0,
            total_earnings: 0,
            average_rating: 0,
            total_reviews: 0,
            completion_rate: 0
          };
        }

        return data;
      } catch (err) {
        console.error('Unexpected error in creator stats fetch:', err);
        // Return default stats on any error
        return {
          creator_id: creatorId,
          total_requests: 0,
          completed_videos: 0,
          pending_requests: 0,
          total_earnings: 0,
          average_rating: 0,
          total_reviews: 0,
          completion_rate: 0
        };
      }
    },
    swrConfig
  );
  
  // Fetch earnings for the past 30 days
  const { data: recentEarnings, error: earningsError, mutate: mutateEarnings } = useSWR(
    creatorId ? ['creatorEarnings', creatorId] : null,
    async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: monthlyData } = await supabase
        .from('video_requests')
        .select('creator_earnings, created_at')
        .eq('creator_id', creatorId!)
        .eq('status', 'completed')
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      const { data: weeklyData } = await supabase
        .from('video_requests')
        .select('creator_earnings')
        .eq('creator_id', creatorId!)
        .eq('status', 'completed')
        .gte('created_at', sevenDaysAgo.toISOString());
      
      const monthlyEarnings = monthlyData?.reduce((sum, order) => sum + (order.creator_earnings || 0), 0) || 0;
      const weeklyEarnings = weeklyData?.reduce((sum, order) => sum + (order.creator_earnings || 0), 0) || 0;
      
      // Calculate daily earnings for top performing days
      const dailyEarnings: { [key: string]: number } = {};
      monthlyData?.forEach(order => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        dailyEarnings[date] = (dailyEarnings[date] || 0) + (order.creator_earnings || 0);
      });
      
      const topPerformingDays = Object.entries(dailyEarnings)
        .map(([date, earnings]) => ({ date, earnings }))
        .sort((a, b) => b.earnings - a.earnings)
        .slice(0, 5);
      
      return {
        monthlyEarnings,
        weeklyEarnings,
        topPerformingDays
      };
    },
    swrConfig
  );

  // Fetch pending orders
  const { data: pendingOrders, error: ordersError, mutate: mutateOrders } = useSWR<OrderWithDetails[]>(
    creatorId ? ['creatorPendingOrders', creatorId] : null,
    async () => {
      const { data, error } = await supabase
        .from('video_requests')
        .select(`
          *,
          fan:profiles!video_requests_fan_id_fkey(display_name, avatar_url)
        `)
        .eq('creator_id', creatorId!)
        .in('status', ['pending', 'accepted', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching pending requests:', error);
        return [];
      }

      return data || [];
    },
    swrConfig
  );

  // Fetch recent completed orders for "top videos"
  const { data: completedOrders, error: completedError, mutate: mutateCompleted } = useSWR<OrderWithDetails[]>(
    creatorId ? ['creatorCompletedOrders', creatorId] : null,
    async () => {
      const { data, error } = await supabase
        .from('video_requests')
        .select(`
          *,
          fan:profiles!video_requests_fan_id_fkey(display_name, avatar_url)
        `)
        .eq('creator_id', creatorId!)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching completed requests:', error);
        return [];
      }

      return data || [];
    },
    swrConfig
  );

  // Set up real-time subscriptions for instant updates
  useEffect(() => {
    if (!creatorId) return;

    const channel = supabase.channel(`creator-dashboard-${creatorId}`);

    // Subscribe to database changes
    channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `creator_id=eq.${creatorId}`,
      }, () => {
        // Refresh all data when orders change
        mutateStats();
        mutateEarnings();
        mutateOrders();
        mutateCompleted();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'creator_stats',
        filter: `creator_id=eq.${creatorId}`,
      }, () => {
        // Refresh stats when updated
        mutateStats();
        mutateEarnings();
      })
      // Listen for Broadcast notifications
      .on('broadcast', { event: 'new_order' }, () => {
        mutateOrders();
        mutateStats();
        mutateEarnings();
      })
      .on('broadcast', { event: 'order_status_update' }, () => {
        mutateOrders();
        mutateCompleted();
        mutateStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [creatorId, supabase, mutateStats, mutateEarnings, mutateOrders, mutateCompleted]);

  // Build analytics object
  const analytics: CreatorAnalytics | null = creatorStats && recentEarnings ? {
    stats: creatorStats,
    recentOrders: 0,
    monthlyEarnings: recentEarnings.monthlyEarnings,
    weeklyEarnings: recentEarnings.weeklyEarnings,
    topPerformingDays: recentEarnings.topPerformingDays
  } : null;

  // Transform data for dashboard consumption
  const stats = analytics?.stats ? {
    totalEarnings: analytics.stats.total_earnings || 0,
    pendingRequests: analytics.stats.pending_orders || 0,
    completedVideos: analytics.stats.completed_orders || 0,
    averageRating: analytics.stats.average_rating || 0,
    monthlyEarnings: analytics.monthlyEarnings || 0,
    weeklyEarnings: analytics.weeklyEarnings || 0,
    todayEarnings: analytics.topPerformingDays?.[0]?.earnings || 0,
    completionRate: analytics.stats.completion_rate || 0,
    acceptanceRate: analytics.stats.acceptance_rate || 0,
    totalOrders: analytics.stats.total_orders || 0,
    rejectedOrders: analytics.stats.rejected_orders || 0,
    refundedOrders: analytics.stats.refunded_orders || 0,
  } : null;

  // Transform pending orders for dashboard
  const pendingRequests = pendingOrders?.map(order => ({
    id: order.id,
    recipient: order.video_request?.recipient_name || 'Unknown',
    occasion: order.video_request?.occasion || 'General',
    price: order.creator_earnings,
    totalAmount: order.amount,
    fanName: order.user?.display_name || 'Anonymous',
    dueDate: order.video_request?.due_date,
    createdAt: order.created_at,
    status: order.status,
    instructions: order.video_request?.instructions,
  })) || [];

  // Transform completed orders as "top videos"
  const topVideos = completedOrders?.map(order => ({
    id: order.id,
    title: `${order.video_request?.occasion} for ${order.video_request?.recipient_name}`,
    earnings: order.creator_earnings,
    completedAt: order.completed_at,
    fanName: order.user?.display_name || 'Anonymous',
  })) || [];

  // Calculate growth metrics
  const weekGrowth = analytics ? 
    ((analytics.weeklyEarnings - (analytics.stats?.pending_earnings || 0)) / 
     Math.max(analytics.stats?.pending_earnings || 1, 1)) * 100 : 0;

  const monthGrowth = analytics && analytics.stats ? 
    ((analytics.monthlyEarnings - (analytics.stats.total_earnings - analytics.monthlyEarnings)) / 
     Math.max(analytics.stats.total_earnings - analytics.monthlyEarnings, 1)) * 100 : 0;

  return {
    stats,
    analytics,
    pendingRequests,
    topVideos,
    weekGrowth: Number(weekGrowth.toFixed(1)),
    monthGrowth: Number(monthGrowth.toFixed(1)),
    loading: !analytics && !statsError,
    error: statsError || earningsError || ordersError || completedError,
    refresh: () => {
      mutateStats();
      mutateEarnings();
      mutateOrders();
      mutateCompleted();
    },
  };
}