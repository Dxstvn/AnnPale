'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  MessageCircle,
  Calendar,
  Trophy,
  Users,
  Pin,
  Flame,
  TrendingUp,
  Clock,
  Eye,
  ThumbsUp,
  Reply,
  Bookmark,
  MoreHorizontal,
  Sparkles,
  Crown,
  Star,
  CheckCircle,
  Shield,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityItem {
  id: string;
  type: 'discussion' | 'creator_post' | 'event' | 'milestone' | 'poll' | 'announcement';
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: 'member' | 'creator' | 'moderator' | 'admin';
    verified?: boolean;
  };
  timestamp: Date;
  category: string;
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  isPinned?: boolean;
  isTrending?: boolean;
  isLive?: boolean;
  hasImage?: boolean;
  imageUrl?: string;
  tags?: string[];
}

interface ActivityFeedProps {
  filter?: 'all' | 'discussions' | 'creator_posts' | 'events' | 'trending';
  showFilters?: boolean;
  maxItems?: number;
  onItemClick?: (item: ActivityItem) => void;
  onLike?: (itemId: string) => void;
  onComment?: (itemId: string) => void;
  onShare?: (itemId: string) => void;
}

export function ActivityFeed({
  filter = 'all',
  showFilters = true,
  maxItems = 10,
  onItemClick,
  onLike,
  onComment,
  onShare
}: ActivityFeedProps) {
  const [selectedFilter, setSelectedFilter] = React.useState(filter);
  const [likedItems, setLikedItems] = React.useState<Set<string>>(new Set());

  // Sample activity data
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'announcement',
      title: '🎉 Welcome to Our New Community Features!',
      content: 'We\'re excited to announce the launch of our enhanced community hub with new discussion forums, event calendar, and creator collaboration tools. Join us in exploring these new features and connecting with fellow community members!',
      author: {
        id: 'admin-1',
        name: 'Ann Pale Team',
        avatar: '🎤',
        role: 'admin',
        verified: true
      },
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      category: 'Announcements',
      stats: { likes: 124, comments: 28, shares: 15, views: 892 },
      isPinned: true,
      tags: ['community', 'features', 'announcement']
    },
    {
      id: '2',
      type: 'creator_post',
      title: 'Behind the Scenes: Recording My Latest Message',
      content: 'Just finished recording a special message for a fan celebrating their graduation! The joy in creating these personalized moments never gets old. What moments in your life would you want celebrated? 🎓✨',
      author: {
        id: 'creator-1',
        name: 'Marie Delacroix',
        avatar: '👩🏾‍🎨',
        role: 'creator',
        verified: true
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: 'Creator Stories',
      stats: { likes: 89, comments: 34, shares: 12, views: 456 },
      isTrending: true,
      hasImage: true,
      imageUrl: '/creator-behind-scenes.jpg',
      tags: ['behind-scenes', 'graduation', 'personalized']
    },
    {
      id: '3',
      type: 'discussion',
      title: 'Best Haitian Restaurants in Miami - Share Your Favorites!',
      content: 'Planning a trip to Miami next month and would love recommendations for authentic Haitian cuisine. What are your go-to spots for the best griot, diri ak djon djon, and plantains? Drop your favorites below! 🇭🇹🍽️',
      author: {
        id: 'member-1',
        name: 'Jean Baptiste',
        avatar: '👨🏾‍💼',
        role: 'member'
      },
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      category: 'Food & Culture',
      stats: { likes: 67, comments: 52, shares: 8, views: 234 },
      tags: ['miami', 'restaurants', 'haitian-food', 'travel']
    },
    {
      id: '4',
      type: 'event',
      title: '🎵 Virtual Konpa Night - Live Music & Dancing',
      content: 'Join us this Saturday at 8 PM EST for a virtual Konpa music night! We\'ll have live performances, dancing, and great conversation. Dress up in your favorite Haitian colors and let\'s celebrate our music together!',
      author: {
        id: 'moderator-1',
        name: 'Sophia Laurent',
        avatar: '👩🏾‍💻',
        role: 'moderator'
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      category: 'Community Events',
      stats: { likes: 156, comments: 43, shares: 29, views: 678 },
      isLive: false,
      tags: ['konpa', 'music', 'virtual-event', 'saturday']
    },
    {
      id: '5',
      type: 'discussion',
      title: 'Learning Kreyòl: Resources and Practice Partners',
      content: 'Bonjou everyone! I\'m working on improving my Kreyòl and wondering if anyone has recommendations for good learning resources or would be interested in practicing together. Any favorite apps, books, or conversation groups?',
      author: {
        id: 'member-2',
        name: 'Marcus Thompson',
        avatar: '👨🏾‍🎓',
        role: 'member'
      },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      category: 'Language Learning',
      stats: { likes: 45, comments: 38, shares: 6, views: 189 },
      tags: ['kreyol', 'language-learning', 'practice', 'resources']
    },
    {
      id: '6',
      type: 'milestone',
      title: '🏆 Community Milestone: 12,000 Members!',
      content: 'We\'ve reached an incredible milestone - 12,000 community members! Thank you to everyone who makes this space special. Here\'s to continuing to grow, support each other, and celebrate our amazing culture together.',
      author: {
        id: 'admin-1',
        name: 'Ann Pale Team',
        avatar: '🎤',
        role: 'admin',
        verified: true
      },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      category: 'Milestones',
      stats: { likes: 203, comments: 67, shares: 45, views: 1234 },
      isTrending: true,
      tags: ['milestone', '12k-members', 'celebration']
    },
    {
      id: '7',
      type: 'creator_post',
      title: 'New Collaboration Opportunity: Haiti Documentary',
      content: 'Excited to share that I\'m working on a documentary about Haiti\'s music history and looking for community input! If you have stories, photos, or memories about Haitian music that shaped you, I\'d love to hear from you.',
      author: {
        id: 'creator-2',
        name: 'Claudette Joseph',
        avatar: '👩🏾‍🎤',
        role: 'creator',
        verified: true
      },
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      category: 'Collaborations',
      stats: { likes: 78, comments: 22, shares: 11, views: 345 },
      tags: ['documentary', 'haiti-music', 'collaboration', 'stories']
    },
    {
      id: '8',
      type: 'discussion',
      title: 'Young Entrepreneurs: Starting a Business in Haiti',
      content: 'I\'m a young entrepreneur looking to start a sustainable business in Haiti. Would love to connect with others who have experience or are on a similar journey. What challenges have you faced and how did you overcome them?',
      author: {
        id: 'member-3',
        name: 'Nadege Pierre',
        avatar: '👩🏾‍💼',
        role: 'member'
      },
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      category: 'Business & Entrepreneurship',
      stats: { likes: 92, comments: 56, shares: 18, views: 432 },
      tags: ['entrepreneurship', 'haiti-business', 'young-entrepreneurs', 'sustainability']
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Activity', icon: MessageSquare },
    { value: 'discussions', label: 'Discussions', icon: MessageCircle },
    { value: 'creator_posts', label: 'Creator Posts', icon: Star },
    { value: 'events', label: 'Events', icon: Calendar },
    { value: 'trending', label: 'Trending', icon: TrendingUp }
  ];

  const filteredActivities = activities
    .filter(activity => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'trending') return activity.isTrending || activity.isPinned;
      return activity.type === selectedFilter || activity.category.toLowerCase().includes(selectedFilter);
    })
    .slice(0, maxItems);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3 text-yellow-600" />;
      case 'moderator': return <Shield className="h-3 w-3 text-blue-600" />;
      case 'creator': return <Star className="h-3 w-3 text-purple-600" />;
      default: return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'moderator': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'creator': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Sparkles className="h-4 w-4 text-yellow-600" />;
      case 'creator_post': return <Star className="h-4 w-4 text-purple-600" />;
      case 'event': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'milestone': return <Trophy className="h-4 w-4 text-green-600" />;
      case 'poll': return <BarChart3 className="h-4 w-4 text-orange-600" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const formatStats = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
    onLike?.(itemId);
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      {showFilters && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={selectedFilter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(option.value)}
                className="whitespace-nowrap"
              >
                <Icon className="h-4 w-4 mr-2" />
                {option.label}
              </Button>
            );
          })}
        </div>
      )}

      {/* Activity Feed */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className={cn(
                "hover:shadow-md transition-all cursor-pointer",
                activity.isPinned && "border-yellow-300 bg-yellow-50/50",
                activity.isTrending && "border-red-300 bg-red-50/50"
              )}
                onClick={() => onItemClick?.(activity)}
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.author.avatar} />
                      <AvatarFallback>{activity.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{activity.author.name}</span>
                        {activity.author.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                        {getRoleIcon(activity.author.role)}
                        <Badge variant="outline" className={cn("text-xs", getRoleBadgeColor(activity.author.role))}>
                          {activity.author.role}
                        </Badge>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(activity.type)}
                        <span className="text-xs text-gray-600">{activity.category}</span>
                        {activity.isPinned && (
                          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                            <Pin className="h-3 w-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                        {activity.isTrending && (
                          <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                            <Flame className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {activity.isLive && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                            Live
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="ml-13 space-y-3">
                    <h3 className="font-semibold text-gray-900 leading-tight">{activity.title}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{activity.content}</p>
                    
                    {/* Image */}
                    {activity.hasImage && activity.imageUrl && (
                      <div className="rounded-lg overflow-hidden bg-gray-100 aspect-video">
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Eye className="h-8 w-8" />
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {activity.tags && activity.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {activity.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <button
                          className={cn(
                            "flex items-center gap-1 text-sm transition-colors",
                            likedItems.has(activity.id) ? "text-red-600" : "text-gray-600 hover:text-red-600"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(activity.id);
                          }}
                        >
                          <Heart className={cn("h-4 w-4", likedItems.has(activity.id) && "fill-current")} />
                          <span>{formatStats(activity.stats.likes + (likedItems.has(activity.id) ? 1 : 0))}</span>
                        </button>
                        
                        <button
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onComment?.(activity.id);
                          }}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{formatStats(activity.stats.comments)}</span>
                        </button>
                        
                        <button
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onShare?.(activity.id);
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                          <span>{formatStats(activity.stats.shares)}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye className="h-3 w-3" />
                        <span>{formatStats(activity.stats.views)} views</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {filteredActivities.length >= maxItems && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Activity
          </Button>
        </div>
      )}
    </div>
  );
}