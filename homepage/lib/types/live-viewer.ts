import { LiveStream } from './live-discovery';

export type VideoQuality = 'audio' | '480p' | '720p' | '1080p' | '4k' | 'auto';

export type LatencyMode = 'ultra-low' | 'low' | 'normal' | 'reduced-data';

export interface VideoPlayerSettings {
  quality: VideoQuality;
  latencyMode: LatencyMode;
  volume: number;
  muted: boolean;
  autoplay: boolean;
  pictureInPicture: boolean;
  fullscreen: boolean;
  autoQualityEnabled: boolean;
  captions: boolean;
  captionLanguage?: string;
}

export interface StreamPlayerState {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  bufferedPercentage: number;
  error?: string;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  latency: number; // milliseconds
  bitrate: number; // kbps
  droppedFrames: number;
  fps: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'super-chat' | 'system' | 'donation' | 'reaction';
  highlighted?: boolean;
  amount?: number; // for donations/super-chat
  color?: string; // for super-chat background
  badges?: ChatBadge[];
  mentions?: string[];
  emotes?: ChatEmote[];
  isModerated?: boolean;
  isPinned?: boolean;
}

export interface ChatBadge {
  id: string;
  name: string;
  image: string;
  tooltip: string;
  color?: string;
}

export interface ChatEmote {
  id: string;
  name: string;
  image: string;
  startIndex: number;
  endIndex: number;
}

export interface ChatSettings {
  enabled: boolean;
  slowMode: boolean;
  slowModeDelay: number; // seconds
  subscribersOnly: boolean;
  followersOnly: boolean;
  moderationEnabled: boolean;
  profanityFilter: boolean;
  allowLinks: boolean;
  allowEmotes: boolean;
  maxMessageLength: number;
  chatDelay: number; // seconds
}

export interface ReactionType {
  id: string;
  emoji: string;
  name: string;
  color: string;
  count: number;
  userReacted: boolean;
  animation?: string;
}

export interface VirtualGift {
  id: string;
  name: string;
  image: string;
  animation?: string;
  price: number;
  currency: string;
  category: 'hearts' | 'flowers' | 'stars' | 'special' | 'premium';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effect?: 'sparkles' | 'fireworks' | 'confetti' | 'hearts' | 'stars';
  description: string;
}

export interface StreamPoll {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }>;
  totalVotes: number;
  duration: number; // seconds
  endTime: Date;
  isActive: boolean;
  allowMultipleChoice: boolean;
  userVote?: string; // option id
  createdBy: string;
}

export interface StreamQA {
  id: string;
  question: string;
  askedBy: string;
  askedByDisplayName: string;
  timestamp: Date;
  isAnswered: boolean;
  answer?: string;
  answeredAt?: Date;
  upvotes: number;
  userUpvoted: boolean;
  isHighlighted: boolean;
  isPinned: boolean;
}

export interface SuperChatMessage extends ChatMessage {
  amount: number;
  currency: string;
  duration: number; // how long it stays pinned (seconds)
  tier: 'blue' | 'cyan' | 'green' | 'yellow' | 'orange' | 'magenta' | 'red';
}

export interface StreamInteraction {
  reactions: ReactionType[];
  gifts: VirtualGift[];
  polls: StreamPoll[];
  qaQueue: StreamQA[];
  superChats: SuperChatMessage[];
  totalTips: number;
  totalViewTime: number;
  userEngagementScore: number;
}

export interface ViewerProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  isFollowing: boolean;
  isSubscribed: boolean;
  subscriptionTier?: 'basic' | 'premium' | 'vip';
  badges: ChatBadge[];
  totalWatchTime: number;
  totalDonated: number;
  joinedDate: Date;
  isModerator: boolean;
  isVip: boolean;
  chatColor?: string;
  preferredLanguage: string;
}

export interface StreamAnalytics {
  viewerCount: number;
  peakViewers: number;
  averageWatchTime: number;
  totalWatchTime: number;
  chatMessages: number;
  reactionsCount: number;
  giftsReceived: number;
  totalRevenue: number;
  newFollowers: number;
  subscriberGrowth: number;
  engagementRate: number;
  retentionRate: number;
  averageLatency: number;
  qualityDistribution: Record<VideoQuality, number>;
  geographicDistribution: Record<string, number>;
  deviceDistribution: Record<string, number>;
}

export interface StreamModerationTools {
  bannedUsers: string[];
  mutedUsers: string[];
  moderators: string[];
  wordFilter: string[];
  autoModeration: {
    enabled: boolean;
    profanityFilter: boolean;
    spamDetection: boolean;
    linkProtection: boolean;
    capsFilter: boolean;
  };
  chatCommands: Array<{
    command: string;
    response: string;
    modOnly: boolean;
  }>;
}

export interface LiveViewerState {
  stream: LiveStream;
  player: StreamPlayerState;
  settings: VideoPlayerSettings;
  chat: {
    messages: ChatMessage[];
    settings: ChatSettings;
    userProfile: ViewerProfile;
  };
  interactions: StreamInteraction;
  analytics: StreamAnalytics;
  moderation: StreamModerationTools;
  isConnected: boolean;
  reconnectAttempts: number;
  lastActivity: Date;
}

export interface ViewerEvents {
  onJoin: () => void;
  onLeave: () => void;
  onMessage: (message: string) => void;
  onReaction: (reactionId: string) => void;
  onGift: (gift: VirtualGift, quantity: number) => void;
  onFollow: () => void;
  onSubscribe: (tier: string) => void;
  onPollVote: (pollId: string, optionId: string) => void;
  onQASubmit: (question: string) => void;
  onQAUpvote: (questionId: string) => void;
  onSuperChat: (message: string, amount: number) => void;
  onPlayerError: (error: string) => void;
  onPlayerStateChange: (state: Partial<StreamPlayerState>) => void;
  onSettingsChange: (settings: Partial<VideoPlayerSettings>) => void;
}

export const DEFAULT_VIDEO_SETTINGS: VideoPlayerSettings = {
  quality: 'auto',
  latencyMode: 'normal',
  volume: 1.0,
  muted: false,
  autoplay: true,
  pictureInPicture: false,
  fullscreen: false,
  autoQualityEnabled: true,
  captions: false,
  captionLanguage: 'en'
};

export const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  enabled: true,
  slowMode: false,
  slowModeDelay: 5,
  subscribersOnly: false,
  followersOnly: false,
  moderationEnabled: true,
  profanityFilter: true,
  allowLinks: false,
  allowEmotes: true,
  maxMessageLength: 500,
  chatDelay: 0
};

export const QUALITY_SETTINGS: Record<VideoQuality, {
  label: string;
  bandwidth: number; // kbps
  resolution?: string;
  description: string;
}> = {
  'audio': {
    label: 'Audio Only',
    bandwidth: 128,
    description: 'Minimal data usage'
  },
  '480p': {
    label: '480p',
    bandwidth: 1000,
    resolution: '854×480',
    description: 'Standard quality'
  },
  '720p': {
    label: '720p HD',
    bandwidth: 2500,
    resolution: '1280×720',
    description: 'High definition'
  },
  '1080p': {
    label: '1080p HD',
    bandwidth: 5000,
    resolution: '1920×1080',
    description: 'Full HD'
  },
  '4k': {
    label: '4K UHD',
    bandwidth: 15000,
    resolution: '3840×2160',
    description: 'Ultra high definition'
  },
  'auto': {
    label: 'Auto',
    bandwidth: 0,
    description: 'Adapts to connection'
  }
};

export const LATENCY_SETTINGS: Record<LatencyMode, {
  label: string;
  latency: number; // milliseconds
  description: string;
  premium: boolean;
}> = {
  'ultra-low': {
    label: 'Ultra Low',
    latency: 2000,
    description: 'Real-time interaction',
    premium: true
  },
  'low': {
    label: 'Low',
    latency: 5000,
    description: 'Fast interaction',
    premium: false
  },
  'normal': {
    label: 'Normal',
    latency: 10000,
    description: 'Balanced quality',
    premium: false
  },
  'reduced-data': {
    label: 'Reduced Data',
    latency: 15000,
    description: 'Mobile optimized',
    premium: false
  }
};

export const REACTION_TYPES: ReactionType[] = [
  {
    id: 'heart',
    emoji: '❤️',
    name: 'Love',
    color: '#e53e3e',
    count: 0,
    userReacted: false,
    animation: 'heart-float'
  },
  {
    id: 'fire',
    emoji: '🔥',
    name: 'Fire',
    color: '#ff8c00',
    count: 0,
    userReacted: false,
    animation: 'fire-burst'
  },
  {
    id: 'clap',
    emoji: '👏',
    name: 'Applause',
    color: '#38a169',
    count: 0,
    userReacted: false,
    animation: 'clap-wave'
  },
  {
    id: 'laugh',
    emoji: '😂',
    name: 'Laugh',
    color: '#3182ce',
    count: 0,
    userReacted: false,
    animation: 'laugh-bounce'
  },
  {
    id: 'wow',
    emoji: '😮',
    name: 'Wow',
    color: '#805ad5',
    count: 0,
    userReacted: false,
    animation: 'wow-zoom'
  },
  {
    id: 'party',
    emoji: '🎉',
    name: 'Party',
    color: '#d69e2e',
    count: 0,
    userReacted: false,
    animation: 'confetti-burst'
  }
];