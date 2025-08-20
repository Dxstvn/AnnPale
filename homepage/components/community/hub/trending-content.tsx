'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  Flame, 
  Eye,
  MessageSquare,
  Heart,
  Star,
  Calendar,
  Trophy,
  Zap,
  Users,
  ArrowRight,
  Clock,
  Hash,
  Crown,
  Sparkles,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TrendingTopic {
  id: string;
  title: string;
  category: string;
  engagement: number;
  trend: 'rising' | 'hot' | 'declining';
  posts: number;
  participants: number;
  timeframe: '1h' | '6h' | '24h' | '7d';
  tags: string[];
}

interface TrendingCreator {
  id: string;
  name: string;
  avatar: string;
  role: 'creator' | 'member';
  followers: number;
  engagementRate: number;
  recentActivity: string;
  verified?: boolean;
}

interface TrendingEvent {
  id: string;
  title: string;
  type: 'live' | 'upcoming' | 'popular';
  startTime: Date;
  participants: number;
  category: string;
  host: {
    name: string;
    avatar: string;
  };
}

interface HotChallenge {
  id: string;
  title: string;
  description: string;
  prize: string;
  participants: number;
  deadline: Date;
  category: string;
  trending: boolean;
}

interface TrendingContentProps {
  timeframe?: '1h' | '6h' | '24h' | '7d';
  onTimeframeChange?: (timeframe: string) => void;
  onTopicClick?: (topic: TrendingTopic) => void;
  onCreatorClick?: (creator: TrendingCreator) => void;
  onEventClick?: (event: TrendingEvent) => void;
  onChallengeClick?: (challenge: HotChallenge) => void;
}

export function TrendingContent({
  timeframe = '24h',
  onTimeframeChange,
  onTopicClick,
  onCreatorClick,
  onEventClick,
  onChallengeClick
}: TrendingContentProps) {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(timeframe);

  // Sample trending topics
  const trendingTopics: TrendingTopic[] = [
    {
      id: '1',
      title: 'Best Haitian Restaurants in Miami',
      category: 'Food & Culture',
      engagement: 95,
      trend: 'hot',
      posts: 47,
      participants: 89,
      timeframe: '6h',
      tags: ['miami', 'restaurants', 'haitian-food']
    },
    {
      id: '2', 
      title: 'Virtual Konpa Night Planning',
      category: 'Events',
      engagement: 88,
      trend: 'rising',
      posts: 32,
      participants: 156,
      timeframe: '24h',
      tags: ['konpa', 'virtual-event', 'music']
    },
    {
      id: '3',
      title: 'Learning Kreyòl Resources',
      category: 'Language Learning',
      engagement: 76,
      trend: 'rising',
      posts: 28,
      participants: 67,
      timeframe: '24h',
      tags: ['kreyol', 'language', 'learning']
    },
    {
      id: '4',
      title: 'Haiti Travel Safety Tips',
      category: 'Travel',
      engagement: 82,
      trend: 'hot',
      posts: 19,
      participants: 45,
      timeframe: '1h',
      tags: ['haiti', 'travel', 'safety']
    },
    {
      id: '5',
      title: 'Young Entrepreneurs Network',
      category: 'Business',
      engagement: 69,
      trend: 'rising',
      posts: 15,
      participants: 34,
      timeframe: '7d',
      tags: ['business', 'entrepreneurship', 'networking']
    }
  ];

  // Sample trending creators
  const trendingCreators: TrendingCreator[] = [
    {
      id: '1',
      name: 'Marie Delacroix',
      avatar: '👩🏾‍🎨',
      role: 'creator',
      followers: 12400,
      engagementRate: 8.7,
      recentActivity: 'Shared behind-the-scenes studio content',
      verified: true
    },
    {
      id: '2',
      name: 'Jean Baptiste',
      avatar: '👨🏾‍💼',
      role: 'member',
      followers: 890,
      engagementRate: 12.3,
      recentActivity: 'Started Miami restaurants discussion'
    },
    {
      id: '3',
      name: 'Claudette Joseph',
      avatar: '👩🏾‍🎤',
      role: 'creator',
      followers: 8900,
      engagementRate: 6.5,
      recentActivity: 'Posted about Haiti music documentary',
      verified: true
    }
  ];

  // Sample trending events
  const trendingEvents: TrendingEvent[] = [
    {
      id: '1',
      title: 'Virtual Konpa Night',
      type: 'upcoming',
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      participants: 245,
      category: 'Music & Dance',
      host: { name: 'Sophia Laurent', avatar: '👩🏾‍💻' }
    },
    {
      id: '2',
      title: 'Haitian Cooking Masterclass',
      type: 'live',
      startTime: new Date(),
      participants: 67,
      category: 'Food & Culture',
      host: { name: 'Chef Pierre', avatar: '👨🏾‍🍳' }
    },
    {
      id: '3',
      title: 'Business Networking Meetup',
      type: 'popular',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      participants: 123,
      category: 'Professional',
      host: { name: 'Marcus Thompson', avatar: '👨🏾‍🎓' }
    }
  ];

  // Sample hot challenges
  const hotChallenges: HotChallenge[] = [
    {
      id: '1',
      title: 'Show Your Haiti Pride',
      description: 'Share photos representing what Haiti means to you',
      prize: '$500 + Creator Feature',
      participants: 189,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      category: 'Photography',
      trending: true
    },
    {
      id: '2',
      title: 'Kreyòl Poetry Challenge',
      description: 'Write and share original poetry in Haitian Creole',
      prize: 'Published in Community Anthology',
      participants: 67,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      category: 'Creative Writing',
      trending: false
    }
  ];

  const timeframeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last Week' }
  ];

  const getTrendIcon = (trend: 'rising' | 'hot' | 'declining') => {
    switch (trend) {
      case 'hot': return <Flame className="h-3 w-3 text-red-500" />;
      case 'rising': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'declining': return <TrendingUp className="h-3 w-3 text-gray-500 rotate-180" />;
    }
  };

  const getTrendColor = (trend: 'rising' | 'hot' | 'declining') => {
    switch (trend) {
      case 'hot': return 'text-red-600 bg-red-50 border-red-200';
      case 'rising': return 'text-green-600 bg-green-50 border-green-200';
      case 'declining': return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatTimeUntil = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `in ${diffInHours}h`;
    } else {
      return `in ${Math.floor(diffInHours / 24)}d`;
    }
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setSelectedTimeframe(newTimeframe);
    onTimeframeChange?.(newTimeframe);
  };

  return (
    <div className="space-y-6">
      {/* Header with Timeframe Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
        </div>
        <div className="flex gap-1">
          {timeframeOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedTimeframe === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeframeChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hot Topics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-red-600" />
              Hot Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingTopics.slice(0, 5).map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onTopicClick?.(topic)}
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  {getTrendIcon(topic.trend)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{topic.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{topic.category}</span>
                    <span>•</span>
                    <span>{topic.posts} posts</span>
                    <span>•</span>
                    <span>{topic.participants} people</span>
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-xs", getTrendColor(topic.trend))}>
                  {topic.engagement}%
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Rising Stars */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Rising Stars
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onCreatorClick?.(creator)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={creator.avatar} />
                  <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{creator.name}</h4>
                    {creator.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Star className="h-2 w-2 text-white" />
                      </div>
                    )}
                    {creator.role === 'creator' && (
                      <Crown className="h-3 w-3 text-purple-600" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatNumber(creator.followers)} followers • {creator.engagementRate}% engagement
                  </div>
                  <div className="text-xs text-gray-600 truncate">{creator.recentActivity}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Live & Upcoming Events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Live & Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onEventClick?.(event)}
              >
                <div className="flex items-center gap-2">
                  {event.type === 'live' && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={event.host.avatar} />
                    <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{event.title}</h4>
                  <div className="text-xs text-gray-500">
                    {event.host.name} • {event.category}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users className="h-3 w-3" />
                    <span>{event.participants}</span>
                    <span>•</span>
                    {event.type === 'live' ? (
                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                        Live Now
                      </Badge>
                    ) : (
                      <span>{formatTimeUntil(event.startTime)}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Hot Challenges */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-600" />
              Hot Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {hotChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 rounded-lg border hover:shadow-md cursor-pointer transition-all"
                onClick={() => onChallengeClick?.(challenge)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm">{challenge.title}</h4>
                  {challenge.trending && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                      <Flame className="h-3 w-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-3">{challenge.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {challenge.participants}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeUntil(challenge.deadline)}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {challenge.prize}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}