export type StreamCategory = 
  | 'music-performance'
  | 'qa-session'
  | 'behind-scenes'
  | 'tutorial'
  | 'special-event'
  | 'casual-chat'
  | 'workout'
  | 'cooking'
  | 'gaming'
  | 'news';

export type StreamStatus = 'live' | 'upcoming' | 'ended';

export type SortOption = 
  | 'trending'
  | 'most-viewers'
  | 'recently-started'
  | 'category'
  | 'language'
  | 'following';

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorVerified: boolean;
  thumbnailUrl: string;
  streamUrl?: string;
  category: StreamCategory;
  status: StreamStatus;
  viewerCount: number;
  peakViewerCount: number;
  startTime: Date;
  endTime?: Date;
  duration: number;
  language: string;
  tags: string[];
  isFollowed?: boolean;
  isFeatured?: boolean;
  quality: 'sd' | 'hd' | '4k';
  hasChat: boolean;
  isRecorded: boolean;
  price?: number;
  isPremium: boolean;
}

export interface UpcomingStream {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorVerified: boolean;
  thumbnailUrl: string;
  category: StreamCategory;
  scheduledStartTime: Date;
  estimatedDuration: number;
  language: string;
  tags: string[];
  isFollowed?: boolean;
  reminderSet?: boolean;
  expectedViewers: number;
  price?: number;
  isPremium: boolean;
}

export interface StreamDiscoveryFilter {
  category?: StreamCategory[];
  language?: string[];
  status?: StreamStatus[];
  followedOnly?: boolean;
  premiumOnly?: boolean;
  freeOnly?: boolean;
  minViewers?: number;
  maxViewers?: number;
  quality?: Array<'sd' | 'hd' | '4k'>;
}

export interface DiscoveryAlgorithmWeights {
  currentViewerCount: number;
  engagementRate: number;
  creatorReputation: number;
  streamQuality: number;
  newnessBonus: number;
}

export const DEFAULT_ALGORITHM_WEIGHTS: DiscoveryAlgorithmWeights = {
  currentViewerCount: 0.30,
  engagementRate: 0.25,
  creatorReputation: 0.20,
  streamQuality: 0.15,
  newnessBonus: 0.10
};

export interface PersonalizationData {
  viewingHistory: {
    streamId: string;
    watchTime: number;
    completed: boolean;
    rating?: number;
  }[];
  followedCreators: string[];
  categoryPreferences: Record<StreamCategory, number>;
  languagePreferences: string[];
  timeZone: string;
  averageSessionLength: number;
  preferredStreamTimes: Array<{
    dayOfWeek: number;
    hour: number;
  }>;
}

export interface StreamMetrics {
  trendingScore: number;
  velocityScore: number;
  engagementRate: number;
  chatActivity: number;
  retentionRate: number;
  discoveryScore: number;
  qualityScore: number;
}

export interface DiscoveryPageData {
  featuredStream: LiveStream | null;
  liveStreams: LiveStream[];
  upcomingStreams: UpcomingStream[];
  trendingStreams: LiveStream[];
  followedCreatorStreams: LiveStream[];
  categories: Array<{
    category: StreamCategory;
    displayName: string;
    icon: string;
    streamCount: number;
    description: string;
  }>;
  totalLiveStreams: number;
  totalViewers: number;
}

export const STREAM_CATEGORIES: Record<StreamCategory, {
  displayName: string;
  icon: string;
  description: string;
  color: string;
}> = {
  'music-performance': {
    displayName: 'Music Performance',
    icon: '🎵',
    description: 'Live musical performances and concerts',
    color: 'from-purple-500 to-pink-500'
  },
  'qa-session': {
    displayName: 'Q&A Session',
    icon: '❓',
    description: 'Interactive question and answer sessions',
    color: 'from-blue-500 to-cyan-500'
  },
  'behind-scenes': {
    displayName: 'Behind the Scenes',
    icon: '🎬',
    description: 'Exclusive behind-the-scenes content',
    color: 'from-orange-500 to-red-500'
  },
  'tutorial': {
    displayName: 'Tutorial',
    icon: '📚',
    description: 'Educational and instructional content',
    color: 'from-green-500 to-emerald-500'
  },
  'special-event': {
    displayName: 'Special Event',
    icon: '🎉',
    description: 'Special events and celebrations',
    color: 'from-yellow-500 to-orange-500'
  },
  'casual-chat': {
    displayName: 'Casual Chat',
    icon: '💬',
    description: 'Casual conversations and hangouts',
    color: 'from-gray-500 to-slate-500'
  },
  'workout': {
    displayName: 'Workout',
    icon: '💪',
    description: 'Fitness and workout sessions',
    color: 'from-red-500 to-rose-500'
  },
  'cooking': {
    displayName: 'Cooking',
    icon: '👨‍🍳',
    description: 'Cooking demonstrations and recipes',
    color: 'from-amber-500 to-yellow-500'
  },
  'gaming': {
    displayName: 'Gaming',
    icon: '🎮',
    description: 'Live gaming and gameplay',
    color: 'from-indigo-500 to-purple-500'
  },
  'news': {
    displayName: 'News & Updates',
    icon: '📰',
    description: 'News updates and current events',
    color: 'from-slate-500 to-gray-500'
  }
};

export interface StreamSearchResult {
  stream: LiveStream;
  relevanceScore: number;
  matchedFields: string[];
  highlightedTitle: string;
  highlightedDescription: string;
}

export interface DiscoveryStats {
  totalStreams: number;
  totalViewers: number;
  averageViewersPerStream: number;
  topCategory: StreamCategory;
  peakHour: number;
  languageDistribution: Record<string, number>;
  categoryDistribution: Record<StreamCategory, number>;
}