// Live Streaming Type Definitions

export type StreamStatus = 'scheduled' | 'live' | 'ended' | 'cancelled';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due';
export type SubscriptionTierType = 'basic' | 'premium' | 'vip';
export type AdType = 'pre-roll' | 'mid-roll' | 'post-roll';

// ============================================
// Database Types (matching Supabase schema)
// ============================================

export interface CreatorSubscriptionTier {
  id: string;
  creator_id: string;
  tier_name: string;
  tier_slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  sort_order?: number;
  tier_type: SubscriptionTierType;
  price: number;
  billing_period: 'monthly' | 'yearly';
  benefits: string[] | { text: string; icon?: string }[];
  ad_free: boolean;
  exclusive_content: boolean;
  priority_chat: boolean;
  vod_access: boolean;
  max_quality: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subscriber_count?: number;
}

export interface FanSubscription {
  id: string;
  fan_id: string;
  creator_id: string;
  tier_id: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date?: string;
  next_billing_date?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  tier?: CreatorSubscriptionTier;
  creator?: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

export interface LiveStream {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  category?: string;
  tags: string[];
  thumbnail_url?: string;
  stream_key: string;
  ivs_channel_arn?: string;
  ivs_playback_url?: string;
  ivs_ingest_endpoint?: string;
  status: StreamStatus;
  scheduled_start?: string;
  actual_start?: string;
  actual_end?: string;
  is_subscriber_only: boolean;
  min_subscription_tier?: SubscriptionTierType;
  allow_guests: boolean;
  max_viewers?: number;
  chat_enabled: boolean;
  donations_enabled: boolean;
  recording_enabled: boolean;
  recording_url?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  creator?: {
    id: string;
    name: string;
    avatar_url: string;
  };
  current_viewers?: number;
  total_viewers?: number;
}

export interface StreamAnalytics {
  id: string;
  stream_id: string;
  viewer_id?: string;
  session_id: string;
  join_time: string;
  leave_time?: string;
  watch_duration?: string;
  is_subscriber: boolean;
  subscription_tier?: SubscriptionTierType;
  device_type?: string;
  browser?: string;
  country?: string;
  region?: string;
  quality_watched?: string;
  chat_messages_sent: number;
  reactions_sent: number;
  created_at: string;
}

export interface StreamAdCampaign {
  id: string;
  stream_id: string;
  ad_provider: string;
  campaign_name?: string;
  pre_roll_ads: number;
  mid_roll_ads: number;
  post_roll_ads: number;
  ad_frequency_minutes: number;
  revenue_per_thousand: number;
  total_impressions: number;
  total_revenue: number;
  created_at: string;
  updated_at: string;
}

export interface AdImpression {
  id: string;
  campaign_id: string;
  viewer_id?: string;
  stream_id: string;
  ad_type: AdType;
  ad_duration?: number;
  completed: boolean;
  clicked: boolean;
  skipped: boolean;
  timestamp: string;
}

export interface StreamChatMessage {
  id: string;
  stream_id: string;
  user_id?: string;
  message: string;
  is_subscriber: boolean;
  is_moderator: boolean;
  is_creator: boolean;
  deleted: boolean;
  deleted_by?: string;
  deleted_reason?: string;
  timestamp: string;
  // Joined data
  user?: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

export interface StreamDonation {
  id: string;
  stream_id: string;
  donor_id?: string;
  amount: number;
  currency: string;
  message?: string;
  stripe_payment_intent_id?: string;
  processed: boolean;
  created_at: string;
  // Joined data
  donor?: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

export interface CreatorPayout {
  id: string;
  creator_id: string;
  period_start: string;
  period_end: string;
  subscription_revenue: number;
  ad_revenue: number;
  donation_revenue: number;
  total_revenue: number;
  platform_fee: number;
  net_payout: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  stripe_transfer_id?: string;
  paid_at?: string;
  created_at: string;
}

// ============================================
// UI State Types
// ============================================

export interface StreamViewerState {
  streamId: string;
  isSubscribed: boolean;
  subscriptionTier?: SubscriptionTierType;
  analyticsId?: string;
  adState: {
    showingAd: boolean;
    adType?: AdType;
    adDuration?: number;
    nextAdIn?: number;
    canSkip: boolean;
  };
  quality: string;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  chatVisible: boolean;
}

export interface StreamCreatorState {
  stream?: LiveStream;
  isLive: boolean;
  streamHealth: {
    bitrate: number;
    fps: number;
    keyframeInterval: number;
    resolution: string;
    connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  };
  viewers: {
    current: number;
    peak: number;
    total: number;
    subscribers: number;
    nonSubscribers: number;
  };
  revenue: {
    subscriptions: number;
    ads: number;
    donations: number;
    total: number;
  };
  moderationQueue: StreamChatMessage[];
}

export interface StreamBrowseFilters {
  search: string;
  category?: string;
  tags: string[];
  status: StreamStatus[];
  priceRange?: {
    min: number;
    max: number;
  };
  subscriberOnly?: boolean;
  sortBy: 'viewers' | 'newest' | 'starting_soon' | 'price';
}

// ============================================
// API Response Types
// ============================================

export interface StreamListResponse {
  streams: LiveStream[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StreamDetailsResponse {
  stream: LiveStream;
  isSubscribed: boolean;
  subscriptionTier?: SubscriptionTierType;
  playbackUrl: string;
  chatEnabled: boolean;
  canDonate: boolean;
}

export interface SubscriptionCheckResponse {
  isSubscribed: boolean;
  subscription?: FanSubscription;
  tier?: CreatorSubscriptionTier;
  benefits: string[];
}

export interface StreamAnalyticsResponse {
  streamId: string;
  metrics: {
    totalViewers: number;
    currentViewers: number;
    peakViewers: number;
    avgWatchTime: number;
    subscriberPercentage: number;
    adImpressions: number;
    chatMessages: number;
    donations: number;
    revenue: {
      subscriptions: number;
      ads: number;
      donations: number;
      total: number;
    };
  };
  viewersByTime: Array<{
    time: string;
    viewers: number;
    subscribers: number;
  }>;
  viewersByLocation: Array<{
    country: string;
    viewers: number;
  }>;
}

// ============================================
// AWS IVS Types
// ============================================

export interface IVSChannel {
  arn: string;
  name: string;
  latencyMode: 'NORMAL' | 'LOW';
  type: 'STANDARD' | 'BASIC';
  playbackUrl: string;
  ingestEndpoint: string;
}

export interface IVSStreamKey {
  arn: string;
  value: string;
  channelArn: string;
}

export interface IVSStreamSession {
  streamId: string;
  startTime: string;
  endTime?: string;
  channels: {
    video: {
      codec: string;
      targetBitrate: number;
      targetFramerate: number;
      videoHeight: number;
      videoWidth: number;
    };
    audio: {
      codec: string;
      targetBitrate: number;
      channels: number;
      sampleRate: number;
    };
  };
}

// ============================================
// Component Props
// ============================================

export interface StreamPlayerProps {
  stream: LiveStream;
  isSubscribed: boolean;
  onAdStart?: () => void;
  onAdEnd?: () => void;
  onStreamEnd?: () => void;
  onError?: (error: Error) => void;
}

export interface StreamChatProps {
  streamId: string;
  isSubscribed: boolean;
  isModerator: boolean;
  onMessageSend: (message: string) => void;
  onMessageDelete?: (messageId: string) => void;
  onUserBan?: (userId: string) => void;
}

export interface SubscriptionCardProps {
  tier: CreatorSubscriptionTier;
  isSubscribed: boolean;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
}

export interface StreamScheduleProps {
  creatorId: string;
  streams: LiveStream[];
  onStreamClick: (stream: LiveStream) => void;
}

export interface AdOverlayProps {
  adType: AdType;
  duration: number;
  onSkip?: () => void;
  onComplete: () => void;
  canSkip: boolean;
  skipAfterSeconds?: number;
}

// ============================================
// Utility Types
// ============================================

export type StreamPermissions = {
  canChat: boolean;
  canDonate: boolean;
  canModerate: boolean;
  canViewAnalytics: boolean;
  canEndStream: boolean;
  hasAdFreeViewing: boolean;
  hasPriorityChat: boolean;
  hasVODAccess: boolean;
};

export type StreamMetrics = {
  viewership: {
    current: number;
    peak: number;
    average: number;
    total: number;
  };
  engagement: {
    chatMessages: number;
    reactions: number;
    shares: number;
  };
  monetization: {
    newSubscribers: number;
    adRevenue: number;
    donations: number;
    totalRevenue: number;
  };
};