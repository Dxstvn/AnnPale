'use client';

import useSWR from 'swr';
import { 
  statsService,
  FanStats,
  CreatorStats,
  PlatformStats,
  WeeklyEarning,
  UpcomingEvent,
  RecentActivity,
  PendingRequest,
  TopVideo
} from '@/lib/services/stats-service';
import { useSupabaseAuth } from '@/contexts/supabase-auth-compat';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// SWR configuration
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  dedupingInterval: 30 * 1000, // 30 seconds
};

/**
 * Hook to get fan dashboard statistics
 */
export function useFanStats() {
  const { user } = useSupabaseAuth();
  const userId = user?.id;

  const { data: stats, error: statsError, mutate: mutateStats } = useSWR<FanStats | null>(
    userId ? ['fanStats', userId] : null,
    () => statsService.getFanStats(userId!),
    swrConfig
  );

  const { data: upcomingEvents, error: eventsError, mutate: mutateEvents } = useSWR<UpcomingEvent[]>(
    userId ? ['upcomingEvents', userId] : null,
    () => statsService.getUpcomingEvents(userId!),
    swrConfig
  );

  const { data: recentActivity, error: activityError, mutate: mutateActivity } = useSWR<RecentActivity[]>(
    userId ? ['recentActivity', userId] : null,
    () => statsService.getRecentActivity(userId!),
    swrConfig
  );

  // Set up real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channel = supabase.channel('fan-stats-' + userId);

    // Subscribe to video_requests changes
    channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'video_requests',
        filter: `fan_id=eq.${userId}`,
      }, () => {
        // Refresh all data when there's a change
        mutateStats();
        mutateEvents();
        mutateActivity();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions',
      }, () => {
        // Refresh stats when transaction occurs
        mutateStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, mutateStats, mutateEvents, mutateActivity]);

  return {
    stats,
    upcomingEvents: upcomingEvents || [],
    recentActivity: recentActivity || [],
    loading: !stats && !statsError,
    error: statsError || eventsError || activityError,
    refresh: () => {
      mutateStats();
      mutateEvents();
      mutateActivity();
    },
  };
}

/**
 * Hook to get creator dashboard statistics
 */
export function useCreatorStats() {
  const { user } = useSupabaseAuth();
  const creatorId = user?.id;

  const { data: stats, error: statsError, mutate: mutateStats } = useSWR<CreatorStats | null>(
    creatorId ? ['creatorStats', creatorId] : null,
    () => statsService.getCreatorStats(creatorId!),
    swrConfig
  );

  const { data: weeklyEarnings, error: earningsError, mutate: mutateEarnings } = useSWR<WeeklyEarning[]>(
    creatorId ? ['weeklyEarnings', creatorId] : null,
    () => statsService.getWeeklyEarnings(creatorId!),
    swrConfig
  );

  const { data: pendingRequests, error: requestsError, mutate: mutateRequests } = useSWR<PendingRequest[]>(
    creatorId ? ['pendingRequests', creatorId] : null,
    () => statsService.getPendingRequests(creatorId!),
    swrConfig
  );

  const { data: topVideos, error: videosError, mutate: mutateVideos } = useSWR<TopVideo[]>(
    creatorId ? ['topVideos', creatorId] : null,
    () => statsService.getTopVideos(creatorId!),
    swrConfig
  );

  // Set up real-time subscriptions
  useEffect(() => {
    if (!creatorId) return;

    const supabase = createClient();
    const channel = supabase.channel('creator-stats-' + creatorId);

    // Subscribe to video_requests changes
    channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'video_requests',
        filter: `creator_id=eq.${creatorId}`,
      }, () => {
        // Refresh all data when there's a change
        mutateStats();
        mutateRequests();
        mutateVideos();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions',
      }, () => {
        // Refresh stats and earnings when transaction occurs
        mutateStats();
        mutateEarnings();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'creator_followers',
        filter: `creator_id=eq.${creatorId}`,
      }, () => {
        // Refresh stats when followers change
        mutateStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [creatorId, mutateStats, mutateEarnings, mutateRequests, mutateVideos]);

  // Calculate week and month growth percentages
  const weekGrowth = stats ? calculateWeekGrowth(weeklyEarnings || []) : 0;
  const monthGrowth = stats ? calculateMonthGrowth(stats) : 0;

  // Format response time
  const responseTime = stats?.avg_response_time_hours 
    ? formatResponseTime(stats.avg_response_time_hours)
    : '24hr';

  return {
    stats: stats ? {
      totalEarnings: stats.total_earnings,
      pendingRequests: stats.pending_requests,
      completedVideos: stats.completed_videos,
      averageRating: stats.average_rating,
      monthlyEarnings: stats.monthly_earnings,
      responseTime,
      followerCount: stats.follower_count,
      todayEarnings: stats.today_earnings,
      weekGrowth,
      monthGrowth,
      completionRate: stats.completion_rate,
      customerSatisfaction: stats.customer_satisfaction,
    } : null,
    weeklyEarnings: weeklyEarnings || [],
    pendingRequests: pendingRequests || [],
    topVideos: topVideos || [],
    loading: !stats && !statsError,
    error: statsError || earningsError || requestsError || videosError,
    refresh: () => {
      mutateStats();
      mutateEarnings();
      mutateRequests();
      mutateVideos();
    },
  };
}

/**
 * Hook to get admin dashboard statistics
 */
export function useAdminStats() {
  const { user } = useSupabaseAuth();
  const isAdmin = user?.user_metadata?.role === 'admin';

  const { data: stats, error: statsError, mutate: mutateStats } = useSWR<PlatformStats | null>(
    isAdmin ? 'adminStats' : null,
    () => statsService.getAdminStats(),
    swrConfig
  );

  const { data: recentActivities, error: activitiesError, mutate: mutateActivities } = useSWR(
    isAdmin ? 'recentPlatformActivities' : null,
    () => statsService.getRecentPlatformActivities(),
    swrConfig
  );

  const { data: creators, error: creatorsError, mutate: mutateCreators } = useSWR(
    isAdmin ? 'recentCreators' : null,
    () => statsService.getRecentCreators(),
    swrConfig
  );

  // Set up real-time subscriptions
  useEffect(() => {
    if (!isAdmin) return;

    const supabase = createClient();
    const channel = supabase.channel('admin-stats');

    // Subscribe to multiple table changes
    channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
      }, () => {
        mutateStats();
        mutateCreators();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'video_requests',
      }, () => {
        mutateStats();
        mutateActivities();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions',
      }, () => {
        mutateStats();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'creator_applications',
      }, () => {
        mutateStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, mutateStats, mutateActivities, mutateCreators]);

  return {
    stats: stats ? {
      totalUsers: stats.total_users,
      totalCreators: stats.total_creators,
      totalVideos: stats.total_videos,
      totalRevenue: stats.total_revenue,
      monthlyGrowth: stats.monthly_growth,
      pendingApprovals: stats.pending_approvals,
      activeOrders: stats.active_orders,
      averageRating: stats.average_rating,
    } : null,
    recentActivities: recentActivities || [],
    creators: creators || [],
    loading: !stats && !statsError,
    error: statsError || activitiesError || creatorsError,
    refresh: () => {
      mutateStats();
      mutateActivities();
      mutateCreators();
    },
  };
}

// Helper functions
function calculateWeekGrowth(weeklyEarnings: WeeklyEarning[]): number {
  if (weeklyEarnings.length < 2) return 0;
  
  const currentWeek = weeklyEarnings.slice(-7).reduce((sum, day) => sum + day.amount, 0);
  const previousWeek = weeklyEarnings.slice(-14, -7).reduce((sum, day) => sum + day.amount, 0);
  
  if (previousWeek === 0) return currentWeek > 0 ? 100 : 0;
  return Number(((currentWeek - previousWeek) / previousWeek * 100).toFixed(1));
}

function calculateMonthGrowth(stats: CreatorStats): number {
  const lastMonth = stats.monthly_earnings;
  const thisMonth = stats.total_earnings - lastMonth;
  
  if (lastMonth === 0) return thisMonth > 0 ? 100 : 0;
  return Number(((thisMonth - lastMonth) / lastMonth * 100).toFixed(1));
}

function formatResponseTime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}min`;
  } else if (hours < 24) {
    return `${Math.round(hours)}hr`;
  } else {
    const days = Math.round(hours / 24);
    return `${days}d`;
  }
}