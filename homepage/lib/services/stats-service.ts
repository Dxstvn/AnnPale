import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';

export interface FanStats {
  total_bookings: number;
  video_calls: number;
  livestreams_watched: number;
  total_spent: number;
  pending_requests: number;
  completed_requests: number;
}

export interface CreatorStats {
  total_earnings: number;
  pending_requests: number;
  completed_videos: number;
  average_rating: number;
  follower_count: number;
  monthly_earnings: number;
  today_earnings: number;
  avg_response_time_hours: number;
  completion_rate: number;
  customer_satisfaction: number;
}

export interface PlatformStats {
  total_users: number;
  total_creators: number;
  total_fans: number;
  total_videos: number;
  total_revenue: number;
  new_users_this_month: number;
  new_users_last_month: number;
  pending_approvals: number;
  active_orders: number;
  average_rating: number;
  weekly_transactions: number;
  weekly_revenue: number;
  monthly_growth: number;
}

export interface WeeklyEarning {
  day: string;
  amount: number;
}

export interface UpcomingEvent {
  id: string;
  event_type: string;
  creator_name: string;
  scheduled_date: string;
  status: string;
}

export interface RecentActivity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
}

export interface PendingRequest {
  id: string;
  fan_name: string;
  request_type: string;
  occasion: string;
  price: number;
  created_at: string;
  due_date: string;
}

export interface TopVideo {
  id: string;
  title: string;
  views: number;
  rating: number;
  earnings: number;
}

export class StatsService {
  private supabase = createClient();

  /**
   * Get fan dashboard statistics
   */
  async getFanStats(userId: string): Promise<FanStats | null> {
    try {
      const { data, error } = await this.supabase
        .from('fan_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching fan stats:', error);
        return null;
      }

      return {
        total_bookings: data?.total_bookings || 0,
        video_calls: data?.video_calls || 0,
        livestreams_watched: data?.livestreams_watched || 0,
        total_spent: data?.total_spent || 0,
        pending_requests: data?.pending_requests || 0,
        completed_requests: data?.completed_requests || 0,
      };
    } catch (error) {
      console.error('Error in getFanStats:', error);
      return null;
    }
  }

  /**
   * Get creator dashboard statistics
   */
  async getCreatorStats(creatorId: string): Promise<CreatorStats | null> {
    try {
      const { data, error } = await this.supabase
        .from('creator_stats')
        .select('*')
        .eq('creator_id', creatorId)
        .single();

      if (error) {
        console.error('Error fetching creator stats:', error);
        return null;
      }

      return {
        total_earnings: data?.total_earnings || 0,
        pending_requests: data?.pending_requests || 0,
        completed_videos: data?.completed_videos || 0,
        average_rating: data?.average_rating || 0,
        follower_count: data?.follower_count || 0,
        monthly_earnings: data?.monthly_earnings || 0,
        today_earnings: data?.today_earnings || 0,
        avg_response_time_hours: data?.avg_response_time_hours || 24,
        completion_rate: data?.completion_rate || 0,
        customer_satisfaction: data?.customer_satisfaction || 0,
      };
    } catch (error) {
      console.error('Error in getCreatorStats:', error);
      return null;
    }
  }

  /**
   * Get platform-wide admin statistics
   */
  async getAdminStats(): Promise<PlatformStats | null> {
    try {
      const { data, error } = await this.supabase
        .from('platform_stats')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching platform stats:', error);
        return null;
      }

      // Calculate monthly growth percentage
      const { data: growthData } = await this.supabase
        .rpc('get_monthly_growth');

      return {
        total_users: data?.total_users || 0,
        total_creators: data?.total_creators || 0,
        total_fans: data?.total_fans || 0,
        total_videos: data?.total_videos || 0,
        total_revenue: data?.total_revenue || 0,
        new_users_this_month: data?.new_users_this_month || 0,
        new_users_last_month: data?.new_users_last_month || 0,
        pending_approvals: data?.pending_approvals || 0,
        active_orders: data?.active_orders || 0,
        average_rating: data?.average_rating || 0,
        weekly_transactions: data?.weekly_transactions || 0,
        weekly_revenue: data?.weekly_revenue || 0,
        monthly_growth: growthData || 0,
      };
    } catch (error) {
      console.error('Error in getAdminStats:', error);
      return null;
    }
  }

  /**
   * Get weekly earnings for a creator (last 7 days)
   */
  async getWeeklyEarnings(creatorId: string): Promise<WeeklyEarning[]> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_weekly_earnings', { p_creator_id: creatorId });

      if (error) {
        console.error('Error fetching weekly earnings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getWeeklyEarnings:', error);
      return [];
    }
  }

  /**
   * Get upcoming events for a fan
   */
  async getUpcomingEvents(userId: string): Promise<UpcomingEvent[]> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_upcoming_events', { p_fan_id: userId });

      if (error) {
        console.error('Error fetching upcoming events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUpcomingEvents:', error);
      return [];
    }
  }

  /**
   * Get recent activity for a fan
   */
  async getRecentActivity(userId: string): Promise<RecentActivity[]> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_recent_activity', { p_fan_id: userId });

      if (error) {
        console.error('Error fetching recent activity:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecentActivity:', error);
      return [];
    }
  }

  /**
   * Get pending requests for a creator
   */
  async getPendingRequests(creatorId: string): Promise<PendingRequest[]> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_pending_requests', { p_creator_id: creatorId });

      if (error) {
        console.error('Error fetching pending requests:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPendingRequests:', error);
      return [];
    }
  }

  /**
   * Get top videos for a creator
   */
  async getTopVideos(creatorId: string): Promise<TopVideo[]> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_top_videos', { p_creator_id: creatorId });

      if (error) {
        console.error('Error fetching top videos:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTopVideos:', error);
      return [];
    }
  }

  /**
   * Get recent creators (for admin dashboard)
   */
  async getRecentCreators(limit: number = 5): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id, display_name, avatar_url, created_at, user_role')
        .eq('user_role', 'creator')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent creators:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecentCreators:', error);
      return [];
    }
  }

  /**
   * Get recent platform activities (for admin dashboard)
   */
  async getRecentPlatformActivities(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('video_requests')
        .select(`
          id,
          request_type,
          status,
          created_at,
          fan:profiles!video_requests_fan_id_fkey(display_name),
          creator:profiles!video_requests_creator_id_fkey(display_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent activities:', error);
        return [];
      }

      return data?.map(item => ({
        id: item.id,
        type: item.request_type,
        description: `${item.fan?.display_name || 'User'} booked a ${item.request_type} from ${item.creator?.display_name || 'Creator'}`,
        status: item.status,
        timestamp: item.created_at,
      })) || [];
    } catch (error) {
      console.error('Error in getRecentPlatformActivities:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const statsService = new StatsService();