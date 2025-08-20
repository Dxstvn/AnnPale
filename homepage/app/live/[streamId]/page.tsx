'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AdaptiveVideoPlayer } from '@/components/live-viewer/adaptive-video-player';
import { StreamInfoBar } from '@/components/live-viewer/stream-info-bar';
import { LiveChatPanel } from '@/components/live-viewer/live-chat-panel';
import { InteractiveFeatures } from '@/components/live-viewer/interactive-features';
import { useStreamQuality } from '@/hooks/use-stream-quality';
import {
  LiveViewerState,
  ChatMessage,
  ViewerProfile,
  StreamInteraction,
  VirtualGift,
  REACTION_TYPES,
  DEFAULT_VIDEO_SETTINGS,
  DEFAULT_CHAT_SETTINGS
} from '@/lib/types/live-viewer';
import { LiveStream } from '@/lib/types/live-discovery';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  MessageSquare,
  Users,
  Zap,
  Share2,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LiveStreamViewerPage() {
  const params = useParams();
  const router = useRouter();
  const streamId = params.streamId as string;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showChat, setShowChat] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState('chat');

  // Mock stream data - in real app, this would come from API
  const [stream] = useState<LiveStream>({
    id: streamId,
    title: 'Live Kompa Performance from Port-au-Prince',
    description: 'Join me for an authentic Haitian kompa music session with traditional instruments, special guests, and amazing energy. We\'ll be playing classic songs and some new compositions.',
    creatorId: 'creator-1',
    creatorName: 'Jean Baptiste',
    creatorAvatar: '/api/placeholder/150/150',
    creatorVerified: true,
    thumbnailUrl: '/api/placeholder/1920/1080',
    streamUrl: '/api/placeholder/stream.m3u8',
    category: 'music-performance',
    status: 'live',
    viewerCount: 1247,
    peakViewerCount: 1689,
    startTime: new Date(Date.now() - 3600000), // Started 1 hour ago
    duration: 3600,
    language: 'ht',
    tags: ['kompa', 'live music', 'haiti', 'traditional', 'performance'],
    isFollowed: false,
    isFeatured: true,
    quality: 'hd',
    hasChat: true,
    isRecorded: true,
    isPremium: false
  });

  // Mock viewer profile
  const [userProfile] = useState<ViewerProfile>({
    id: 'viewer-1',
    username: 'viewer123',
    displayName: 'Happy Viewer',
    avatar: '/api/placeholder/50/50',
    isFollowing: false,
    isSubscribed: false,
    badges: [],
    totalWatchTime: 0,
    totalDonated: 0,
    joinedDate: new Date(),
    isModerator: false,
    isVip: false,
    preferredLanguage: 'en'
  });

  // Stream quality management
  const {
    settings,
    playerState,
    metrics,
    updateSettings,
    updatePlayerState,
    setVideoElement,
    handleBufferingStart,
    handleBufferingEnd,
    getCurrentEffectiveQuality
  } = useStreamQuality({
    streamUrl: stream.streamUrl || '',
    initialSettings: DEFAULT_VIDEO_SETTINGS,
    onQualityChange: (quality, reason) => {
      console.log(`Quality changed to ${quality}: ${reason}`);
    },
    onConnectionIssue: (issue, severity) => {
      console.warn(`Connection issue (${severity}): ${issue}`);
    }
  });

  // Mock chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'user1',
      username: 'haiti_music_lover',
      displayName: 'Haiti Music Lover',
      avatar: '/api/placeholder/40/40',
      message: 'This kompa is fire! 🔥🔥🔥',
      timestamp: new Date(Date.now() - 120000),
      type: 'message',
      badges: [],
      emotes: []
    },
    {
      id: '2',
      userId: 'user2',
      username: 'dancing_queen',
      displayName: 'Dancing Queen',
      message: 'Can you play "Mwen Renmen Ou"?',
      timestamp: new Date(Date.now() - 60000),
      type: 'message',
      badges: [],
      emotes: []
    }
  ]);

  // Mock interactions
  const [interactions, setInteractions] = useState<StreamInteraction>({
    reactions: REACTION_TYPES,
    gifts: generateMockGifts(),
    polls: [],
    qaQueue: [],
    superChats: [],
    totalTips: 245,
    totalViewTime: 3600,
    userEngagementScore: 75
  });

  // Mock analytics
  const mockAnalytics = useMemo(() => ({
    viewerCount: stream.viewerCount,
    peakViewers: stream.peakViewerCount,
    averageWatchTime: 1800,
    totalWatchTime: stream.viewerCount * 1800,
    chatMessages: chatMessages.length,
    reactionsCount: interactions.reactions.reduce((sum, r) => sum + r.count, 0),
    giftsReceived: 45,
    totalRevenue: interactions.totalTips,
    newFollowers: 89,
    subscriberGrowth: 12,
    engagementRate: 67.5,
    retentionRate: 78.2,
    averageLatency: playerState.latency,
    qualityDistribution: {} as any,
    geographicDistribution: {} as any,
    deviceDistribution: {} as any
  }), [stream, chatMessages, interactions, playerState.latency]);

  // Event handlers
  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: userProfile.id,
      username: userProfile.username,
      displayName: userProfile.displayName,
      avatar: userProfile.avatar,
      message,
      timestamp: new Date(),
      type: 'message',
      badges: userProfile.badges,
      emotes: []
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleReaction = (reactionId: string) => {
    setInteractions(prev => ({
      ...prev,
      reactions: prev.reactions.map(r => 
        r.id === reactionId 
          ? { ...r, count: r.count + 1, userReacted: !r.userReacted }
          : r
      )
    }));
  };

  const handleSendGift = (giftId: string, quantity = 1) => {
    console.log('Send gift:', giftId, quantity);
    // In real app, send gift via API
  };

  const handleGiftFromChat = (giftId: string) => {
    handleSendGift(giftId, 1);
  };

  const handleSuperChat = (message: string, amount: number) => {
    const superChat: ChatMessage = {
      id: Date.now().toString(),
      userId: userProfile.id,
      username: userProfile.username,
      displayName: userProfile.displayName,
      avatar: userProfile.avatar,
      message,
      timestamp: new Date(),
      type: 'super-chat',
      amount,
      highlighted: true,
      badges: userProfile.badges,
      emotes: []
    };
    setChatMessages(prev => [...prev, superChat]);
  };

  const handleFollow = () => {
    console.log('Follow creator');
    // Update follow status
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: stream.title,
        text: `Watch ${stream.creatorName} live on Ann Pale!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          // Toggle play/pause would be handled by video player
          break;
        case 't':
          e.preventDefault();
          setIsTheaterMode(!isTheaterMode);
          break;
        case 'c':
          e.preventDefault();
          setShowChat(!showChat);
          break;
        case 'f':
          e.preventDefault();
          updateSettings({ fullscreen: !settings.fullscreen });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTheaterMode, showChat, settings.fullscreen, updateSettings]);

  if (!stream) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Stream Not Found</h1>
          <Button onClick={() => router.push('/live')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Live Directory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header - Only show if not in theater mode */}
      {!isTheaterMode && (
        <div className="bg-white dark:bg-gray-800 border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => router.push('/live')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Directory
              </Button>

              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white animate-pulse">
                  LIVE
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stream.viewerCount.toLocaleString()} watching
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheaterMode}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={cn(
        'flex flex-col lg:flex-row',
        isTheaterMode ? 'h-screen' : 'min-h-screen'
      )}>
        {/* Video Section */}
        <div className={cn(
          'flex-1 flex flex-col',
          isTheaterMode ? 'h-full' : ''
        )}>
          {/* Stream Info Bar */}
          {!isTheaterMode && (
            <StreamInfoBar
              stream={stream}
              analytics={mockAnalytics}
              userProfile={userProfile}
              onFollow={handleFollow}
              onSubscribe={(tier) => console.log('Subscribe:', tier)}
              onShare={handleShare}
              onReport={() => console.log('Report stream')}
              onNotifications={(enabled) => console.log('Notifications:', enabled)}
              onTip={() => console.log('Open tip modal')}
            />
          )}

          {/* Video Player */}
          <div className={cn(
            'relative',
            isTheaterMode ? 'flex-1' : 'aspect-video'
          )}>
            <AdaptiveVideoPlayer
              streamUrl={stream.streamUrl || ''}
              posterUrl={stream.thumbnailUrl}
              settings={settings}
              playerState={playerState}
              onSettingsChange={updateSettings}
              onPlayerStateChange={updatePlayerState}
              onError={(error) => console.error('Player error:', error)}
              className="w-full h-full"
            />

            {/* Theater Mode Controls */}
            {isTheaterMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4 flex items-center gap-2"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                  className="bg-black/20 hover:bg-black/40 text-white border-0"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleTheaterMode}
                  className="bg-black/20 hover:bg-black/40 text-white border-0"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </div>

          {/* Below Player Content - Only show if not in theater mode */}
          {!isTheaterMode && !isMobile && (
            <div className="p-6 space-y-6">
              {/* Stream Description */}
              <div>
                <h2 className="text-xl font-bold mb-2">{stream.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {stream.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {stream.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Creator Other Content */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">More from {stream.creatorName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Mock related content */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar - Chat and Interactions */}
        {showChat && (
          <div className={cn(
            'bg-white dark:bg-gray-800 border-l',
            isMobile ? 'w-full' : 'w-80',
            isTheaterMode ? 'h-full' : 'min-h-screen'
          )}>
            {isMobile ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="interactions">Interact</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="flex-1 m-0">
                  <LiveChatPanel
                    messages={chatMessages}
                    settings={DEFAULT_CHAT_SETTINGS}
                    userProfile={userProfile}
                    onSendMessage={handleSendMessage}
                    onSuperChat={handleSuperChat}
                    onReaction={handleReaction}
                    onGift={handleGiftFromChat}
                    onModerateMessage={(id, action) => console.log('Moderate:', id, action)}
                    onUserAction={(id, action) => console.log('User action:', id, action)}
                    className="h-full"
                  />
                </TabsContent>
                
                <TabsContent value="interactions" className="flex-1 m-0">
                  <InteractiveFeatures
                    reactions={interactions.reactions}
                    gifts={interactions.gifts}
                    polls={interactions.polls}
                    qaQueue={interactions.qaQueue}
                    onReaction={handleReaction}
                    onSendGift={handleSendGift}
                    onPollVote={(pollId, optionId) => console.log('Vote:', pollId, optionId)}
                    onSubmitQuestion={(question) => console.log('Question:', question)}
                    onUpvoteQuestion={(id) => console.log('Upvote:', id)}
                    onSuperChat={handleSuperChat}
                    className="h-full"
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <LiveChatPanel
                    messages={chatMessages}
                    settings={DEFAULT_CHAT_SETTINGS}
                    userProfile={userProfile}
                    onSendMessage={handleSendMessage}
                    onSuperChat={handleSuperChat}
                    onReaction={handleReaction}
                    onGift={handleGiftFromChat}
                    onModerateMessage={(id, action) => console.log('Moderate:', id, action)}
                    onUserAction={(id, action) => console.log('User action:', id, action)}
                    className="h-full"
                  />
                </div>
                
                <div className="border-t">
                  <InteractiveFeatures
                    reactions={interactions.reactions}
                    gifts={interactions.gifts}
                    polls={interactions.polls}
                    qaQueue={interactions.qaQueue}
                    onReaction={handleReaction}
                    onSendGift={handleSendGift}
                    onPollVote={(pollId, optionId) => console.log('Vote:', pollId, optionId)}
                    onSubmitQuestion={(question) => console.log('Question:', question)}
                    onUpvoteQuestion={(id) => console.log('Upvote:', id)}
                    onSuperChat={handleSuperChat}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Performance Indicators - Show on poor connection */}
      {playerState.connectionQuality === 'poor' && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <Card className="p-3 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Poor connection detected</span>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function generateMockGifts(): VirtualGift[] {
  return [
    {
      id: 'heart1',
      name: 'Heart',
      image: '/api/placeholder/gift-heart.png',
      price: 1,
      currency: 'USD',
      category: 'hearts',
      rarity: 'common',
      description: 'Send some love'
    },
    {
      id: 'rose1',
      name: 'Rose',
      image: '/api/placeholder/gift-rose.png',
      price: 5,
      currency: 'USD',
      category: 'flowers',
      rarity: 'rare',
      description: 'Beautiful rose'
    },
    {
      id: 'diamond1',
      name: 'Diamond',
      image: '/api/placeholder/gift-diamond.png',
      price: 50,
      currency: 'USD',
      category: 'premium',
      rarity: 'legendary',
      description: 'Precious diamond'
    }
  ];
}