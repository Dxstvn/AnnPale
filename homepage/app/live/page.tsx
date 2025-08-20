'use client';

import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/use-media-query';
import { FeaturedStreamHero } from '@/components/live/featured-stream-hero';
import { LiveStreamsGrid } from '@/components/live/live-streams-grid';
import { UpcomingStreamsTimeline } from '@/components/live/upcoming-streams-timeline';
import { StreamFilters } from '@/components/live/stream-filters';
import { 
  StreamDiscoveryAlgorithm,
  calculateStreamMetrics,
  generateMockPersonalizationData
} from '@/lib/algorithms/stream-discovery';
import {
  LiveStream,
  UpcomingStream,
  StreamDiscoveryFilter,
  SortOption,
  STREAM_CATEGORIES,
  StreamCategory,
  DiscoveryPageData
} from '@/lib/types/live-discovery';
import { 
  TrendingUp, 
  Users, 
  Calendar,
  Play,
  Sparkles,
  Star,
  RefreshCw,
  Heart,
  MessageCircle,
  Share2,
  Gift,
  Crown,
  Zap,
  Bell,
  Eye,
  Settings,
  Filter,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/language-context';

// Translations
const liveTranslations: Record<string, Record<string, string>> = {
  live_directory: {
    en: "Live Directory",
    fr: "Répertoire en direct",
    ht: "Anrejistreman dirèk"
  },
  discover_streams: {
    en: "Discover amazing live streams from Haitian creators around the world",
    fr: "Découvrez des streams en direct incroyables de créateurs haïtiens du monde entier",
    ht: "Dekouvri emisyon dirèk etonan nan men kreyatè ayisyen atravè mond lan"
  },
  live_now: {
    en: "Live Now",
    fr: "En direct maintenant",
    ht: "Dirèk kounye a"
  },
  upcoming: {
    en: "Upcoming",
    fr: "À venir",
    ht: "K ap vini"
  },
  categories: {
    en: "Categories",
    fr: "Catégories",
    ht: "Kategori"
  },
  watching: {
    en: "watching",
    fr: "regardent",
    ht: "ap gade"
  },
  join_stream: {
    en: "Join Stream",
    fr: "Rejoindre le stream",
    ht: "Antre nan emisyon"
  },
  send_gift: {
    en: "Send Gift",
    fr: "Envoyer un cadeau",
    ht: "Voye kado"
  },
  super_chat: {
    en: "Super Chat",
    fr: "Super Chat",
    ht: "Super Chat"
  },
  subscribe: {
    en: "Subscribe",
    fr: "S'abonner",
    ht: "Abòne"
  },
  notify_me: {
    en: "Notify Me",
    fr: "Me notifier",
    ht: "Avèti m"
  }
};

export default function LiveDirectoryPage() {
  const { language } = useLanguage();
  
  const t = (key: string) => {
    return liveTranslations[key]?.[language] || liveTranslations[key]?.en || key;
  };
  const [activeTab, setActiveTab] = useState('live');
  const [filter, setFilter] = useState<StreamDiscoveryFilter>({});
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const algorithm = new StreamDiscoveryAlgorithm();
  const personalization = generateMockPersonalizationData();

  // Mock data - in a real app, this would come from an API
  const [discoveryData, setDiscoveryData] = useState<DiscoveryPageData>({
    featuredStream: null,
    liveStreams: [],
    upcomingStreams: [],
    trendingStreams: [],
    followedCreatorStreams: [],
    categories: [],
    totalLiveStreams: 0,
    totalViewers: 0
  });

  // Initialize timestamp on client-side to avoid hydration mismatch
  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    loadDiscoveryData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadDiscoveryData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadDiscoveryData = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData = generateMockDiscoveryData();
    setDiscoveryData(mockData);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const filteredAndSortedStreams = useMemo(() => {
    let streams = discoveryData.liveStreams;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      streams = streams.filter(stream =>
        stream.title.toLowerCase().includes(query) ||
        stream.creatorName.toLowerCase().includes(query) ||
        stream.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    streams = algorithm.filterStreams(streams, filter);

    // Calculate metrics for sorting
    const metrics = streams.reduce((acc, stream) => {
      acc[stream.id] = calculateStreamMetrics(stream);
      return acc;
    }, {} as Record<string, any>);

    // Apply sorting
    streams = algorithm.sortStreams(streams, sortBy, metrics, personalization);

    return streams;
  }, [discoveryData.liveStreams, filter, sortBy, searchQuery, algorithm, personalization]);

  const handleStreamClick = (stream: LiveStream | UpcomingStream) => {
    console.log('Stream clicked:', stream.id);
    // In a real app, navigate to the stream page
  };

  const handleJoinStream = (streamId: string) => {
    console.log('Join stream:', streamId);
    // In a real app, navigate to the stream page
  };

  const handleFollowCreator = (creatorId: string) => {
    console.log('Follow creator:', creatorId);
    // In a real app, call follow API
  };

  const handleSetReminder = (streamId: string, enabled?: boolean) => {
    console.log('Set reminder:', streamId, enabled);
    // In a real app, call reminder API
  };

  const handleRefresh = () => {
    loadDiscoveryData();
  };

  const clearFilters = () => {
    setFilter({});
    setSearchQuery('');
    setSortBy('trending');
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('live_directory')}
          </h1>
        </div>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          {t('discover_streams')}
        </p>
        
        {/* Stats */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Play className="w-4 h-4 text-green-500" />
            <span className="font-medium">{discoveryData.totalLiveStreams}</span>
            <span className="text-gray-600 dark:text-gray-400">live</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{discoveryData.totalViewers.toLocaleString()}</span>
            <span className="text-gray-600 dark:text-gray-400">{t('watching')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="font-medium">{discoveryData.upcomingStreams.length}</span>
            <span className="text-gray-600 dark:text-gray-400">upcoming</span>
          </div>
        </div>
      </div>

      {/* Featured Stream */}
      {discoveryData.featuredStream && (
        <FeaturedStreamHero
          stream={discoveryData.featuredStream}
          onJoinStream={handleJoinStream}
          onFollowCreator={handleFollowCreator}
        />
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {t('live_now')}
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('upcoming')}
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('categories')}
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
              {!isMobile && <span className="ml-1">Refresh</span>}
            </Button>
          </div>
        </div>

        <TabsContent value="live" className="space-y-6">
          {/* Quick Actions Bar */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Button variant="default" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Zap className="w-4 h-4 mr-2" />
                  Go Live
                </Button>
                <Button variant="outline">
                  <Crown className="w-4 h-4 mr-2" />
                  VIP Streams
                </Button>
                <Button variant="outline">
                  <Gift className="w-4 h-4 mr-2" />
                  {t('send_gift')}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Heart className="w-3 h-3 mr-1" />
                  Your Favorites: 12
                </Badge>
                <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                  <Bell className="w-3 h-3 mr-1" />
                  3 Starting Soon
                </Badge>
              </div>
            </div>
          </div>
          {/* Filters */}
          <StreamFilters
            filter={filter}
            sortBy={sortBy}
            searchQuery={searchQuery}
            onFilterChange={setFilter}
            onSortChange={setSortBy}
            onSearchChange={setSearchQuery}
            onClearFilters={clearFilters}
            streamCount={filteredAndSortedStreams.length}
            isMobile={isMobile}
          />

          {/* Live Streams Grid */}
          <LiveStreamsGrid
            streams={filteredAndSortedStreams}
            onStreamClick={handleStreamClick}
            onFollowCreator={handleFollowCreator}
            onSetReminder={handleSetReminder}
            columns={isMobile ? 2 : 3}
          />
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <UpcomingStreamsTimeline
            streams={discoveryData.upcomingStreams}
            onSetReminder={handleSetReminder}
            onStreamClick={handleStreamClick}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryGrid 
            categories={discoveryData.categories}
            onCategoryClick={(category) => {
              setActiveTab('live');
              setFilter({ category: [category] });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CategoryGridProps {
  categories: DiscoveryPageData['categories'];
  onCategoryClick: (category: StreamCategory) => void;
}

function CategoryGrid({ categories, onCategoryClick }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => {
        const categoryInfo = STREAM_CATEGORIES[category.category];
        return (
          <Card
            key={category.category}
            className="cursor-pointer hover:shadow-lg transition-all group"
            onClick={() => onCategoryClick(category.category)}
          >
            <CardContent className="p-6 text-center">
              <div className={cn(
                'w-16 h-16 rounded-full bg-gradient-to-r mx-auto mb-4 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform',
                categoryInfo.color
              )}>
                {category.icon}
              </div>
              <h3 className="font-semibold mb-2">{category.displayName}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {category.description}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary">
                  {category.streamCount} live
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Mock data generator
function generateMockDiscoveryData(): DiscoveryPageData {
  const mockStreams: LiveStream[] = [
    {
      id: 'stream-1',
      title: 'Live Kompa Performance from Port-au-Prince',
      description: 'Join me for an authentic Haitian kompa music session with traditional instruments and special guests.',
      creatorId: 'creator-1',
      creatorName: 'Jean Baptiste',
      creatorAvatar: '/api/placeholder/150/150',
      creatorVerified: true,
      thumbnailUrl: '/api/placeholder/400/225',
      streamUrl: '/api/placeholder/video.mp4',
      category: 'music-performance',
      status: 'live',
      viewerCount: 1247,
      peakViewerCount: 1689,
      startTime: new Date('2024-01-15T14:00:00'),
      duration: 3600,
      language: 'ht',
      tags: ['kompa', 'live music', 'haiti', 'traditional'],
      isFollowed: true,
      isFeatured: true,
      quality: 'hd',
      hasChat: true,
      isRecorded: true,
      isPremium: false
    },
    {
      id: 'stream-2',
      title: 'Cooking Traditional Haitian Griot',
      description: 'Learn how to make authentic Haitian griot with step-by-step instructions.',
      creatorId: 'creator-2',
      creatorName: 'Marie Carmel',
      creatorAvatar: '/api/placeholder/150/150',
      creatorVerified: false,
      thumbnailUrl: '/api/placeholder/400/225',
      category: 'cooking',
      status: 'live',
      viewerCount: 567,
      peakViewerCount: 892,
      startTime: new Date('2024-01-15T14:30:00'),
      duration: 1800,
      language: 'fr',
      tags: ['cooking', 'griot', 'tutorial', 'haitian cuisine'],
      isFollowed: false,
      quality: 'hd',
      hasChat: true,
      isRecorded: true,
      isPremium: false
    }
  ];

  const mockUpcoming: UpcomingStream[] = [
    {
      id: 'upcoming-1',
      title: 'Q&A: Life in the Haitian Diaspora',
      description: 'Open discussion about experiences living abroad while maintaining Haitian culture.',
      creatorId: 'creator-3',
      creatorName: 'Paul Lafontant',
      creatorAvatar: '/api/placeholder/150/150',
      creatorVerified: true,
      thumbnailUrl: '/api/placeholder/400/225',
      category: 'qa-session',
      scheduledStartTime: new Date('2024-01-15T17:00:00'),
      estimatedDuration: 3600,
      language: 'en',
      tags: ['diaspora', 'qa', 'culture', 'discussion'],
      isFollowed: false,
      reminderSet: false,
      expectedViewers: 800,
      isPremium: false
    }
  ];

  return {
    featuredStream: mockStreams[0],
    liveStreams: mockStreams,
    upcomingStreams: mockUpcoming,
    trendingStreams: mockStreams,
    followedCreatorStreams: mockStreams.filter(s => s.isFollowed),
    categories: Object.entries(STREAM_CATEGORIES).map(([key, info]) => ({
      category: key as StreamCategory,
      displayName: info.displayName,
      icon: info.icon,
      streamCount: Math.floor(Math.random() * 10) + 1,
      description: info.description
    })),
    totalLiveStreams: mockStreams.length,
    totalViewers: mockStreams.reduce((sum, s) => sum + s.viewerCount, 0)
  };
}