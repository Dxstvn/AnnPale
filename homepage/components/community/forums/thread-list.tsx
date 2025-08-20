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
  Eye,
  Pin,
  Lock,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Star,
  Award,
  Users,
  Crown,
  Shield,
  Bookmark,
  Flag,
  MoreHorizontal,
  Hash,
  Calendar,
  HelpCircle,
  Megaphone,
  FileText,
  BarChart3,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Thread {
  id: string;
  title: string;
  content: string;
  type: 'discussion' | 'question' | 'announcement' | 'poll' | 'resource' | 'event';
  author: {
    id: string;
    name: string;
    avatar: string;
    role: 'member' | 'creator' | 'moderator' | 'admin';
    karma: number;
    badges: string[];
  };
  createdAt: Date;
  lastReply?: {
    author: string;
    avatar: string;
    timestamp: Date;
  };
  stats: {
    replies: number;
    views: number;
    likes: number;
    karma: number;
  };
  isLocked?: boolean;
  isPinned?: boolean;
  isSolved?: boolean;
  isFeatured?: boolean;
  tags: string[];
  category: string;
  subscribed?: boolean;
}

interface ThreadAction {
  type: 'create' | 'reply' | 'like' | 'share' | 'report' | 'best_answer';
  karmaPoints: number;
  description: string;
}

interface ThreadListProps {
  categoryId?: string;
  sortBy?: 'latest' | 'popular' | 'unanswered' | 'karma';
  filterBy?: 'all' | 'pinned' | 'locked' | 'solved' | 'featured';
  onThreadClick?: (thread: Thread) => void;
  onAuthorClick?: (authorId: string) => void;
  onTagClick?: (tag: string) => void;
  showActions?: boolean;
}

export function ThreadList({
  categoryId,
  sortBy = 'latest',
  filterBy = 'all',
  onThreadClick,
  onAuthorClick,
  onTagClick,
  showActions = true
}: ThreadListProps) {
  const [likedThreads, setLikedThreads] = React.useState<Set<string>>(new Set());
  const [bookmarkedThreads, setBookmarkedThreads] = React.useState<Set<string>>(new Set());

  // Thread actions with karma points (as per spec)
  const threadActions: Record<string, ThreadAction> = {
    create: { type: 'create', karmaPoints: 10, description: 'Create Thread' },
    reply: { type: 'reply', karmaPoints: 5, description: 'Quality Reply' },
    like: { type: 'like', karmaPoints: 1, description: 'Receive Like' },
    best_answer: { type: 'best_answer', karmaPoints: 20, description: 'Best Answer' },
    share: { type: 'share', karmaPoints: 3, description: 'Share Thread' },
    report: { type: 'report', karmaPoints: 2, description: 'Report Issue' }
  };

  // Sample threads data
  const threads: Thread[] = [
    {
      id: '1',
      title: 'Best places to visit in Port-au-Prince for first-time travelers',
      content: 'Planning my first trip to Haiti and would love local recommendations for must-see places in Port-au-Prince. Any hidden gems or cultural sites I shouldn\'t miss?',
      type: 'question',
      author: {
        id: 'user1',
        name: 'Jean Baptiste',
        avatar: '👨🏾‍💼',
        role: 'member',
        karma: 245,
        badges: ['Helpful', 'Explorer']
      },
      createdAt: new Date(Date.now() - 23 * 60 * 1000),
      lastReply: {
        author: 'Marie Delacroix',
        avatar: '👩🏾‍🎨',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      stats: { replies: 12, views: 89, likes: 23, karma: 67 },
      tags: ['travel', 'port-au-prince', 'tourism', 'recommendations'],
      category: 'general',
      isFeatured: true
    },
    {
      id: '2',
      title: '[ANNOUNCEMENT] New Community Guidelines - Please Read',
      content: 'We\'ve updated our community guidelines to ensure a better experience for everyone. Please take a moment to review the changes.',
      type: 'announcement',
      author: {
        id: 'admin1',
        name: 'Ann Pale Team',
        avatar: '🎤',
        role: 'admin',
        karma: 1250,
        badges: ['Official', 'Founder']
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastReply: {
        author: 'Community Mod',
        avatar: '🛠️',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      stats: { replies: 5, views: 234, likes: 45, karma: 85 },
      isPinned: true,
      tags: ['announcement', 'guidelines', 'community'],
      category: 'general'
    },
    {
      id: '3',
      title: 'Learning Kreyòl as an adult - Tips and resources needed',
      content: 'I\'m trying to reconnect with my Haitian roots by learning Kreyòl. What are the best resources for adult learners? Any conversation practice groups?',
      type: 'question',
      author: {
        id: 'user2',
        name: 'Marcus Thompson',
        avatar: '👨🏾‍🎓',
        role: 'member',
        karma: 134,
        badges: ['Learner']
      },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      lastReply: {
        author: 'Language Expert',
        avatar: '📚',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      stats: { replies: 18, views: 156, likes: 34, karma: 89 },
      isSolved: true,
      tags: ['kreyol', 'language-learning', 'resources', 'culture'],
      category: 'culture-heritage'
    },
    {
      id: '4',
      title: 'Behind the Scenes: Recording my latest video message',
      content: 'Thought you\'d enjoy seeing the process behind creating personalized video messages. From setup to final edit!',
      type: 'discussion',
      author: {
        id: 'creator1',
        name: 'Marie Delacroix',
        avatar: '👩🏾‍🎨',
        role: 'creator',
        karma: 892,
        badges: ['Creator', 'Popular', 'Verified']
      },
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      lastReply: {
        author: 'Fan Account',
        avatar: '⭐',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      },
      stats: { replies: 27, views: 445, likes: 78, karma: 156 },
      tags: ['behind-scenes', 'creator-life', 'video-production'],
      category: 'creator-spaces',
      isFeatured: true
    },
    {
      id: '5',
      title: '[HELP] Can\'t upload my profile picture - getting error message',
      content: 'Every time I try to upload a new profile picture, I get an error. Has anyone else experienced this? Need help troubleshooting.',
      type: 'question',
      author: {
        id: 'user3',
        name: 'Nadege Pierre',
        avatar: '👩🏾‍💼',
        role: 'member',
        karma: 67,
        badges: ['New Member']
      },
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      lastReply: {
        author: 'Support Team',
        avatar: '🛠️',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      stats: { replies: 4, views: 23, likes: 8, karma: 15 },
      tags: ['help', 'technical', 'profile', 'upload'],
      category: 'help-support'
    },
    {
      id: '6',
      title: '[POLL] What type of events would you like to see more of?',
      content: 'Help us plan better community events by voting on what interests you most!',
      type: 'poll',
      author: {
        id: 'mod1',
        name: 'Sophia Laurent',
        avatar: '👩🏾‍💻',
        role: 'moderator',
        karma: 543,
        badges: ['Moderator', 'Event Organizer']
      },
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      lastReply: {
        author: 'Community Member',
        avatar: '👤',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      stats: { replies: 45, views: 234, likes: 67, karma: 123 },
      tags: ['poll', 'events', 'community-feedback'],
      category: 'general'
    },
    {
      id: '7',
      title: 'Traditional Haitian Recipes - Share your family favorites',
      content: 'Let\'s create a collection of traditional Haitian recipes passed down through families. Share yours with the community!',
      type: 'resource',
      author: {
        id: 'user4',
        name: 'Lucienne Toussaint',
        avatar: '👵🏾',
        role: 'member',
        karma: 378,
        badges: ['Recipe Master', 'Cultural Keeper']
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      lastReply: {
        author: 'Home Cook',
        avatar: '👩🏾‍🍳',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      stats: { replies: 23, views: 178, likes: 45, karma: 98 },
      tags: ['recipes', 'culture', 'food', 'tradition'],
      category: 'culture-heritage'
    },
    {
      id: '8',
      title: '[LOCKED] Inappropriate content - Thread closed',
      content: 'This thread has been locked due to violation of community guidelines.',
      type: 'discussion',
      author: {
        id: 'user5',
        name: 'Deleted User',
        avatar: '❌',
        role: 'member',
        karma: 0,
        badges: []
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      stats: { replies: 3, views: 12, likes: 0, karma: -5 },
      isLocked: true,
      tags: ['locked'],
      category: 'general'
    }
  ];

  const getThreadTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return <HelpCircle className="h-4 w-4 text-blue-600" />;
      case 'announcement': return <Megaphone className="h-4 w-4 text-red-600" />;
      case 'poll': return <BarChart3 className="h-4 w-4 text-green-600" />;
      case 'resource': return <FileText className="h-4 w-4 text-purple-600" />;
      case 'event': return <Calendar className="h-4 w-4 text-orange-600" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3 text-yellow-600" />;
      case 'moderator': return <Shield className="h-3 w-3 text-blue-600" />;
      case 'creator': return <Star className="h-3 w-3 text-purple-600" />;
      default: return null;
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

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleLike = (threadId: string) => {
    setLikedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  };

  const handleBookmark = (threadId: string) => {
    setBookmarkedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  };

  const filteredThreads = threads.filter(thread => {
    if (categoryId && thread.category !== categoryId) return false;
    
    switch (filterBy) {
      case 'pinned': return thread.isPinned;
      case 'locked': return thread.isLocked;
      case 'solved': return thread.isSolved;
      case 'featured': return thread.isFeatured;
      default: return true;
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular': return b.stats.likes - a.stats.likes;
      case 'karma': return b.stats.karma - a.stats.karma;
      case 'unanswered': return a.stats.replies - b.stats.replies;
      default: return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  return (
    <div className="space-y-4">
      {filteredThreads.map((thread, index) => (
        <motion.div
          key={thread.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className={cn(
            "hover:shadow-md transition-all cursor-pointer",
            thread.isPinned && "border-yellow-300 bg-yellow-50/50",
            thread.isFeatured && "border-purple-300 bg-purple-50/50",
            thread.isLocked && "opacity-60"
          )}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Thread Stats (Left) */}
                <div className="flex-shrink-0 w-16 text-center space-y-1">
                  <div className="text-lg font-bold text-gray-900">{thread.stats.karma}</div>
                  <div className="text-xs text-gray-500">karma</div>
                  <div className="text-sm text-gray-600">{thread.stats.replies}</div>
                  <div className="text-xs text-gray-500">replies</div>
                  <div className="text-sm text-gray-600">{formatNumber(thread.stats.views)}</div>
                  <div className="text-xs text-gray-500">views</div>
                </div>

                {/* Thread Content (Center) */}
                <div className="flex-1 min-w-0" onClick={() => onThreadClick?.(thread)}>
                  <div className="flex items-start gap-2 mb-2">
                    {getThreadTypeIcon(thread.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2">
                          {thread.title}
                        </h3>
                        {thread.isPinned && <Pin className="h-4 w-4 text-yellow-600 flex-shrink-0" />}
                        {thread.isLocked && <Lock className="h-4 w-4 text-red-600 flex-shrink-0" />}
                        {thread.isSolved && <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />}
                        {thread.isFeatured && <Star className="h-4 w-4 text-purple-600 flex-shrink-0" />}
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {thread.content}
                      </p>

                      {/* Tags */}
                      {thread.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {thread.tags.slice(0, 4).map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="secondary" 
                              className="text-xs cursor-pointer hover:bg-purple-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                onTagClick?.(tag);
                              }}
                            >
                              <Hash className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {thread.tags.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{thread.tags.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Author & Timing */}
                      <div className="flex items-center gap-3 text-sm">
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:text-purple-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAuthorClick?.(thread.author.id);
                          }}
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={thread.author.avatar} />
                            <AvatarFallback className="text-xs">{thread.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{thread.author.name}</span>
                          {getRoleIcon(thread.author.role)}
                          <span className="text-gray-500">({thread.author.karma} karma)</span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{formatTimeAgo(thread.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions & Last Reply (Right) */}
                <div className="flex-shrink-0 w-32 text-right space-y-3">
                  {/* Actions */}
                  {showActions && !thread.isLocked && (
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0",
                          likedThreads.has(thread.id) && "text-red-600"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(thread.id);
                        }}
                      >
                        <Heart className={cn("h-4 w-4", likedThreads.has(thread.id) && "fill-current")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0",
                          bookmarkedThreads.has(thread.id) && "text-blue-600"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(thread.id);
                        }}
                      >
                        <Bookmark className={cn("h-4 w-4", bookmarkedThreads.has(thread.id) && "fill-current")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Last Reply */}
                  {thread.lastReply && (
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center justify-end gap-1 mb-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={thread.lastReply.avatar} />
                          <AvatarFallback className="text-xs">{thread.lastReply.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{thread.lastReply.author}</span>
                      </div>
                      <div>{formatTimeAgo(thread.lastReply.timestamp)}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {filteredThreads.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No threads found</h3>
          <p className="text-gray-600">Be the first to start a discussion in this category!</p>
        </div>
      )}
    </div>
  );
}