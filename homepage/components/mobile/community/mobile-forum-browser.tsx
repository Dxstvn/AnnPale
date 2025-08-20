'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  MoreVertical,
  TrendingUp,
  Clock,
  Eye,
  Pin,
  Filter,
  Search,
  ChevronDown,
  RefreshCw,
  ArrowUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ForumThread {
  id: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
    badge?: string;
  };
  category: string;
  content: string;
  replies: number;
  views: number;
  likes: number;
  isPinned?: boolean;
  isHot?: boolean;
  createdAt: Date;
  lastReply?: Date;
  tags: string[];
}

interface MobileForumBrowserProps {
  onThreadClick?: (thread: ForumThread) => void;
  onRefresh?: () => void;
  onSearch?: (query: string) => void;
  onFilter?: (filters: any) => void;
  showQuickActions?: boolean;
}

export function MobileForumBrowser({
  onThreadClick,
  onRefresh,
  onSearch,
  onFilter,
  showQuickActions = true
}: MobileForumBrowserProps) {
  const [threads, setThreads] = React.useState<ForumThread[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Sample data
  const sampleThreads: ForumThread[] = [
    {
      id: '1',
      title: 'Kijan pou nou ede kominoté a grandi?',
      author: { name: 'Marie L.', avatar: '👩', badge: 'Moderator' },
      category: 'General',
      content: 'Mwen panse nou bezwen plis aktivite ak evènman...',
      replies: 45,
      views: 234,
      likes: 89,
      isPinned: true,
      isHot: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastReply: new Date(Date.now() - 10 * 60 * 1000),
      tags: ['discussion', 'community', 'growth']
    },
    {
      id: '2',
      title: 'Best practices for creator videos',
      author: { name: 'John D.', avatar: '👨' },
      category: 'Creators',
      content: 'Here are some tips I\'ve learned...',
      replies: 23,
      views: 156,
      likes: 67,
      isHot: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      lastReply: new Date(Date.now() - 30 * 60 * 1000),
      tags: ['tips', 'video', 'creators']
    },
    {
      id: '3',
      title: 'Nouvo fonksyonalite platform la',
      author: { name: 'Admin', avatar: '🛡️', badge: 'Staff' },
      category: 'Announcements',
      content: 'Nou gen kèk nouvo bagay pou nou...',
      replies: 67,
      views: 456,
      likes: 234,
      isPinned: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastReply: new Date(Date.now() - 60 * 60 * 1000),
      tags: ['announcement', 'features', 'platform']
    }
  ];

  const categories = [
    { id: 'all', name: 'All', count: 1234 },
    { id: 'general', name: 'General', count: 456 },
    { id: 'creators', name: 'Creators', count: 234 },
    { id: 'support', name: 'Support', count: 167 },
    { id: 'events', name: 'Events', count: 89 }
  ];

  // Load initial threads
  React.useEffect(() => {
    loadThreads();
  }, []);

  // Infinite scroll
  React.useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreThreads();
    }
  }, [inView, hasMore, loading]);

  // Scroll position tracking
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadThreads = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setThreads(sampleThreads);
    setLoading(false);
  };

  const loadMoreThreads = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const moreThreads = sampleThreads.map((thread, index) => ({
      ...thread,
      id: `${thread.id}-page-${page}-${index}`,
      isPinned: false,
      isHot: false
    }));
    
    setThreads(prev => [...prev, ...moreThreads]);
    setPage(prev => prev + 1);
    
    // Simulate end of data
    if (page >= 3) {
      setHasMore(false);
    }
    
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadThreads();
    setRefreshing(false);
    onRefresh?.();
  };

  const handleSwipeAction = (threadId: string, action: 'like' | 'bookmark' | 'share') => {
    console.log(`Swiped ${action} on thread ${threadId}`);
    // Implement swipe action
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const renderThread = (thread: ForumThread) => (
    <motion.div
      key={thread.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      drag={showQuickActions ? "x" : false}
      dragConstraints={{ left: -100, right: 100 }}
      dragElastic={0.2}
      onDragEnd={(e, info) => {
        if (info.offset.x > 50) {
          handleSwipeAction(thread.id, 'like');
        } else if (info.offset.x < -50) {
          handleSwipeAction(thread.id, 'bookmark');
        }
      }}
      className="mb-3"
    >
      <Card 
        className={cn(
          "overflow-hidden touch-manipulation",
          thread.isPinned && "border-purple-300 bg-purple-50/50"
        )}
        onClick={() => onThreadClick?.(thread)}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{thread.author.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">
                    {thread.author.name}
                  </span>
                  {thread.author.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {thread.author.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{thread.category}</span>
                  <span>•</span>
                  <span>{formatTime(thread.createdAt)}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          {/* Title & Content */}
          <div className="mb-3">
            <div className="flex items-start gap-2 mb-2">
              {thread.isPinned && (
                <Pin className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
              )}
              {thread.isHot && (
                <TrendingUp className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <h3 className="font-semibold text-base leading-tight flex-1">
                {thread.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {thread.content}
            </p>
          </div>

          {/* Tags */}
          {thread.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {thread.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{thread.replies}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{thread.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{thread.likes}</span>
              </div>
            </div>
            
            {showQuickActions && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Last Reply Indicator */}
          {thread.lastReply && (
            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              Last reply {formatTime(thread.lastReply)}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b">
        {/* Search Bar */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => onSearch?.(e.target.value)}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-2"
              onClick={() => onFilter?.({})}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-3 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Pull to Refresh */}
      {refreshing && (
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="h-5 w-5 animate-spin text-purple-600" />
          <span className="ml-2 text-sm text-gray-600">Refreshing...</span>
        </div>
      )}

      {/* Thread List */}
      <div className="p-3">
        <AnimatePresence>
          {threads.map(renderThread)}
        </AnimatePresence>

        {/* Load More Trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="py-4 text-center">
            {loading && (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600">Loading more...</span>
              </div>
            )}
          </div>
        )}

        {/* End of Content */}
        {!hasMore && threads.length > 0 && (
          <div className="py-8 text-center text-sm text-gray-500">
            You've reached the end
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-4 z-50 bg-purple-600 text-white rounded-full p-3 shadow-lg"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}