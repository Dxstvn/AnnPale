export type ViewerPersona = 
  | 'super-fan'
  | 'casual-viewer'
  | 'supporter'
  | 'discoverer'
  | 'event-attendee';

export interface ViewerProfile {
  persona: ViewerPersona;
  primaryMotivation: string;
  engagementStyle: string;
  spendingBehavior: string;
  platformValue: string;
}

export const VIEWER_PERSONAS: Record<ViewerPersona, ViewerProfile> = {
  'super-fan': {
    persona: 'super-fan',
    primaryMotivation: 'Exclusive access',
    engagementStyle: 'High interaction',
    spendingBehavior: 'High tips/gifts',
    platformValue: 'Loyalty driver'
  },
  'casual-viewer': {
    persona: 'casual-viewer',
    primaryMotivation: 'Entertainment',
    engagementStyle: 'Passive watching',
    spendingBehavior: 'Occasional tips',
    platformValue: 'Volume audience'
  },
  'supporter': {
    persona: 'supporter',
    primaryMotivation: 'Help creator',
    engagementStyle: 'Moderate chat',
    spendingBehavior: 'Regular donations',
    platformValue: 'Sustainable revenue'
  },
  'discoverer': {
    persona: 'discoverer',
    primaryMotivation: 'Finding new creators',
    engagementStyle: 'Browsing',
    spendingBehavior: 'Trial purchases',
    platformValue: 'Growth driver'
  },
  'event-attendee': {
    persona: 'event-attendee',
    primaryMotivation: 'Special occasions',
    engagementStyle: 'Event-specific',
    spendingBehavior: 'One-time high',
    platformValue: 'Revenue spikes'
  }
};

export type EngagementLevel = 1 | 2 | 3 | 4 | 5;

export interface EngagementPyramidLevel {
  level: EngagementLevel;
  name: string;
  percentage: string;
  behaviors: string[];
  icon?: string;
}

export const ENGAGEMENT_PYRAMID: EngagementPyramidLevel[] = [
  {
    level: 1,
    name: 'Watching',
    percentage: '80%',
    behaviors: ['Passive consumption', 'Anonymous viewing', 'No interaction'],
    icon: '👀'
  },
  {
    level: 2,
    name: 'Reacting',
    percentage: '15%',
    behaviors: ['Emoji reactions', 'Hearts/likes', 'Simple engagement'],
    icon: '❤️'
  },
  {
    level: 3,
    name: 'Participating',
    percentage: '4%',
    behaviors: ['Chat messages', 'Questions', 'Comments'],
    icon: '💬'
  },
  {
    level: 4,
    name: 'Contributing',
    percentage: '0.9%',
    behaviors: ['Tips/donations', 'Gift sending', 'Paid requests'],
    icon: '💰'
  },
  {
    level: 5,
    name: 'Advocating',
    percentage: '0.1%',
    behaviors: ['Sharing stream', 'Bringing friends', 'Regular support'],
    icon: '🌟'
  }
];

export type CreatorMotivation = 
  | 'audience-building'
  | 'revenue-generation'
  | 'community-building'
  | 'content-creation'
  | 'brand-building';

export interface CreatorStrategy {
  motivation: CreatorMotivation;
  strategy: string;
  featuresNeeded: string[];
  successMetrics: string[];
}

export const CREATOR_MOTIVATIONS: Record<CreatorMotivation, CreatorStrategy> = {
  'audience-building': {
    motivation: 'audience-building',
    strategy: 'Regular schedule',
    featuresNeeded: ['Discovery tools', 'Analytics', 'Scheduling'],
    successMetrics: ['Follower growth', 'Reach', 'New viewer retention']
  },
  'revenue-generation': {
    motivation: 'revenue-generation',
    strategy: 'Monetization focus',
    featuresNeeded: ['Tipping', 'Gifts', 'Paid content'],
    successMetrics: ['Revenue per stream', 'Average tip size', 'Conversion rate']
  },
  'community-building': {
    motivation: 'community-building',
    strategy: 'Interaction heavy',
    featuresNeeded: ['Chat', 'Q&A', 'Polls'],
    successMetrics: ['Engagement rate', 'Chat activity', 'Return viewers']
  },
  'content-creation': {
    motivation: 'content-creation',
    strategy: 'Performance/teaching',
    featuresNeeded: ['Quality tools', 'Recording', 'Effects'],
    successMetrics: ['View duration', 'Content quality', 'Replay views']
  },
  'brand-building': {
    motivation: 'brand-building',
    strategy: 'Professional presence',
    featuresNeeded: ['Branding tools', 'Sponsorships', 'Cross-promotion'],
    successMetrics: ['Brand awareness', 'Partnership opportunities', 'Media mentions']
  }
};

export interface LiveStreamMetrics {
  viewerCount: number;
  peakViewers: number;
  averageWatchTime: number;
  engagementRate: number;
  chatMessages: number;
  reactions: number;
  tips: number;
  newFollowers: number;
  returningViewers: number;
  shareCount: number;
}

export interface ViewerEngagement {
  userId: string;
  streamId: string;
  persona?: ViewerPersona;
  engagementLevel: EngagementLevel;
  watchTime: number;
  interactions: {
    reactions: number;
    messages: number;
    tips: number;
    shares: number;
  };
  joinedAt: Date;
  leftAt?: Date;
}

export interface StreamAnalytics {
  streamId: string;
  creatorId: string;
  startTime: Date;
  endTime?: Date;
  metrics: LiveStreamMetrics;
  viewerEngagements: ViewerEngagement[];
  peakMoments: Array<{
    timestamp: Date;
    viewerCount: number;
    event: string;
  }>;
  revenue: {
    tips: number;
    gifts: number;
    subscriptions: number;
    total: number;
  };
}