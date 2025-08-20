import { StreamCategory } from './live-discovery';
import { ChatMessage, StreamAnalytics } from './live-viewer';

export type StreamStatus = 'setup' | 'preview' | 'countdown' | 'live' | 'paused' | 'ended';

export type StreamPrivacy = 'public' | 'unlisted' | 'subscribers-only' | 'followers-only';

export type DeviceStatus = 'good' | 'warning' | 'error' | 'unavailable';

export interface MediaDevice {
  id: string;
  label: string;
  kind: 'videoinput' | 'audioinput' | 'audiooutput';
  status: DeviceStatus;
  selected: boolean;
}

export interface StreamHealth {
  camera: {
    status: DeviceStatus;
    resolution: string;
    frameRate: number;
    quality: number; // 0-100
  };
  microphone: {
    status: DeviceStatus;
    level: number; // 0-100
    quality: number; // 0-100
  };
  connection: {
    status: DeviceStatus;
    bandwidth: number; // kbps
    latency: number; // ms
    stability: number; // 0-100
  };
  overall: DeviceStatus;
}

export interface StreamSetup {
  title: string;
  description: string;
  category: StreamCategory;
  tags: string[];
  thumbnailUrl?: string;
  language: string;
  privacy: StreamPrivacy;
  enableChat: boolean;
  enableRecording: boolean;
  enableNotifications: boolean;
  scheduledStartTime?: Date;
  estimatedDuration?: number; // minutes
}

export interface MonetizationSettings {
  enableTips: boolean;
  enableGifts: boolean;
  enableSuperChat: boolean;
  enableSubscriptions: boolean;
  tipGoal?: {
    amount: number;
    description: string;
    deadline?: Date;
  };
  specialOffers?: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    duration: number; // minutes
    available: number; // quantity
  }>;
  subscriberPerks: string[];
}

export interface StreamingControls {
  isLive: boolean;
  isPaused: boolean;
  isRecording: boolean;
  selectedCamera: string;
  selectedMicrophone: string;
  isScreenSharing: boolean;
  hasBackgroundEffects: boolean;
  backgroundBlur: number; // 0-100
  filters: Array<{
    id: string;
    name: string;
    enabled: boolean;
    intensity: number; // 0-100
  }>;
  overlays: Array<{
    id: string;
    type: 'logo' | 'donation-goal' | 'recent-follower' | 'chat' | 'timer';
    visible: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }>;
}

export interface LiveMetrics {
  currentViewers: number;
  peakViewers: number;
  totalViewers: number;
  averageWatchTime: number;
  streamDuration: number;
  chatMessages: number;
  reactionsCount: number;
  newFollowers: number;
  earnings: {
    tips: number;
    gifts: number;
    subscriptions: number;
    total: number;
  };
  engagementRate: number;
  retentionRate: number;
}

export interface ModerationAction {
  id: string;
  type: 'ban' | 'timeout' | 'delete' | 'pin' | 'highlight';
  userId: string;
  messageId?: string;
  reason?: string;
  duration?: number; // seconds for timeout
  timestamp: Date;
  moderatorId: string;
}

export interface ModerationTools {
  bannedUsers: string[];
  mutedUsers: Array<{
    userId: string;
    until: Date;
    reason: string;
  }>;
  moderators: string[];
  autoModeration: {
    enabled: boolean;
    profanityFilter: boolean;
    spamDetection: boolean;
    linkProtection: boolean;
    capsFilter: boolean;
    duplicateMessageFilter: boolean;
  };
  chatSettings: {
    slowMode: boolean;
    slowModeDelay: number; // seconds
    subscribersOnly: boolean;
    followersOnly: boolean;
    minimumAccountAge: number; // days
  };
  wordFilters: string[];
  allowedLinks: string[];
}

export interface StreamGoal {
  id: string;
  type: 'tips' | 'followers' | 'subscribers' | 'views' | 'custom';
  title: string;
  description: string;
  target: number;
  current: number;
  reward?: string;
  deadline?: Date;
  isActive: boolean;
  isCompleted: boolean;
}

export interface StreamHighlight {
  id: string;
  title: string;
  startTime: number; // seconds from stream start
  duration: number; // seconds
  thumbnailUrl: string;
  description?: string;
  tags: string[];
  createdAt: Date;
}

export interface CreatorStreamState {
  status: StreamStatus;
  setup: StreamSetup;
  health: StreamHealth;
  controls: StreamingControls;
  metrics: LiveMetrics;
  moderation: ModerationTools;
  monetization: MonetizationSettings;
  goals: StreamGoal[];
  highlights: StreamHighlight[];
  devices: MediaDevice[];
  chatMessages: ChatMessage[];
  moderationActions: ModerationAction[];
  streamKey: string;
  streamUrl: string;
  startTime?: Date;
  endTime?: Date;
}

export interface StreamingEvents {
  onStartStream: () => void;
  onStopStream: () => void;
  onPauseStream: () => void;
  onResumeStream: () => void;
  onDeviceChange: (type: 'camera' | 'microphone', deviceId: string) => void;
  onScreenShare: (enabled: boolean) => void;
  onModerateUser: (userId: string, action: ModerationAction['type'], duration?: number) => void;
  onModerateMessage: (messageId: string, action: 'delete' | 'pin' | 'highlight') => void;
  onUpdateGoal: (goalId: string, current: number) => void;
  onCreateHighlight: (startTime: number, duration: number, title: string) => void;
  onUpdateSetup: (setup: Partial<StreamSetup>) => void;
  onUpdateMonetization: (settings: Partial<MonetizationSettings>) => void;
  onHealthCheck: () => void;
}

export const DEFAULT_STREAM_SETUP: StreamSetup = {
  title: '',
  description: '',
  category: 'casual-chat',
  tags: [],
  language: 'en',
  privacy: 'public',
  enableChat: true,
  enableRecording: true,
  enableNotifications: true
};

export const DEFAULT_MONETIZATION_SETTINGS: MonetizationSettings = {
  enableTips: true,
  enableGifts: true,
  enableSuperChat: true,
  enableSubscriptions: false,
  subscriberPerks: []
};

export const DEFAULT_STREAMING_CONTROLS: StreamingControls = {
  isLive: false,
  isPaused: false,
  isRecording: false,
  selectedCamera: '',
  selectedMicrophone: '',
  isScreenSharing: false,
  hasBackgroundEffects: false,
  backgroundBlur: 0,
  filters: [],
  overlays: []
};

export const DEFAULT_MODERATION_TOOLS: ModerationTools = {
  bannedUsers: [],
  mutedUsers: [],
  moderators: [],
  autoModeration: {
    enabled: true,
    profanityFilter: true,
    spamDetection: true,
    linkProtection: true,
    capsFilter: false,
    duplicateMessageFilter: true
  },
  chatSettings: {
    slowMode: false,
    slowModeDelay: 5,
    subscribersOnly: false,
    followersOnly: false,
    minimumAccountAge: 0
  },
  wordFilters: [],
  allowedLinks: []
};

export const STREAMING_WORKFLOW_STEPS = [
  {
    id: 'equipment-check',
    title: 'Equipment Check',
    description: 'Test camera, microphone, and internet connection',
    required: true
  },
  {
    id: 'stream-details',
    title: 'Stream Details',
    description: 'Set title, description, category, and tags',
    required: true
  },
  {
    id: 'monetization',
    title: 'Monetization Setup',
    description: 'Configure tips, goals, and subscriber perks',
    required: false
  },
  {
    id: 'promotion',
    title: 'Promote Stream',
    description: 'Notify followers and share on social media',
    required: false
  },
  {
    id: 'go-live',
    title: 'Go Live',
    description: 'Start your broadcast',
    required: true
  }
];

export const STREAM_QUALITY_REQUIREMENTS = {
  minimum: {
    camera: {
      resolution: '480p',
      frameRate: 15,
      quality: 40
    },
    microphone: {
      quality: 50
    },
    connection: {
      bandwidth: 1000, // kbps
      latency: 5000, // ms
      stability: 60
    }
  },
  recommended: {
    camera: {
      resolution: '720p',
      frameRate: 30,
      quality: 70
    },
    microphone: {
      quality: 80
    },
    connection: {
      bandwidth: 2500, // kbps
      latency: 3000, // ms
      stability: 85
    }
  },
  optimal: {
    camera: {
      resolution: '1080p',
      frameRate: 60,
      quality: 90
    },
    microphone: {
      quality: 95
    },
    connection: {
      bandwidth: 5000, // kbps
      latency: 1000, // ms
      stability: 95
    }
  }
};

export const BACKGROUND_EFFECTS = [
  {
    id: 'blur',
    name: 'Background Blur',
    type: 'blur',
    intensity: 50
  },
  {
    id: 'office',
    name: 'Virtual Office',
    type: 'background',
    imageUrl: '/backgrounds/office.jpg'
  },
  {
    id: 'studio',
    name: 'Studio Setup',
    type: 'background',
    imageUrl: '/backgrounds/studio.jpg'
  },
  {
    id: 'haiti-flag',
    name: 'Haiti Flag',
    type: 'background',
    imageUrl: '/backgrounds/haiti-flag.jpg'
  },
  {
    id: 'tropical',
    name: 'Tropical Beach',
    type: 'background',
    imageUrl: '/backgrounds/tropical.jpg'
  }
];

export const STREAM_OVERLAYS = [
  {
    id: 'donation-goal',
    name: 'Donation Goal',
    type: 'donation-goal' as const,
    defaultPosition: { x: 20, y: 20 },
    defaultSize: { width: 300, height: 100 }
  },
  {
    id: 'recent-follower',
    name: 'Recent Follower',
    type: 'recent-follower' as const,
    defaultPosition: { x: 20, y: 140 },
    defaultSize: { width: 250, height: 60 }
  },
  {
    id: 'chat-overlay',
    name: 'Chat Overlay',
    type: 'chat' as const,
    defaultPosition: { x: 400, y: 20 },
    defaultSize: { width: 300, height: 400 }
  },
  {
    id: 'stream-timer',
    name: 'Stream Timer',
    type: 'timer' as const,
    defaultPosition: { x: 20, y: 220 },
    defaultSize: { width: 150, height: 40 }
  },
  {
    id: 'logo',
    name: 'Brand Logo',
    type: 'logo' as const,
    defaultPosition: { x: 600, y: 20 },
    defaultSize: { width: 100, height: 100 }
  }
];