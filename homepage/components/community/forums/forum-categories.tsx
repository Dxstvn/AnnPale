'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Users, 
  Star, 
  HelpCircle,
  Eye,
  Crown,
  Globe,
  ArrowRight,
  Pin,
  Clock,
  TrendingUp,
  Shield,
  Award,
  Bookmark,
  Hash,
  Calendar,
  Music,
  Utensils,
  Briefcase,
  GraduationCap,
  Heart,
  Camera,
  Gamepad2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  threadCount: number;
  postCount: number;
  lastActivity: {
    threadTitle: string;
    author: string;
    avatar: string;
    timestamp: Date;
  };
  subCategories: SubCategory[];
  moderators: Moderator[];
  isLocked?: boolean;
  isPinned?: boolean;
}

interface SubCategory {
  id: string;
  name: string;
  threadCount: number;
  postCount: number;
}

interface Moderator {
  id: string;
  name: string;
  avatar: string;
  role: 'moderator' | 'admin';
}

interface Thread {
  id: string;
  title: string;
  type: 'discussion' | 'question' | 'announcement' | 'poll' | 'resource' | 'event';
  author: {
    id: string;
    name: string;
    avatar: string;
    role: 'member' | 'creator' | 'moderator' | 'admin';
  };
  createdAt: Date;
  lastReply: Date;
  replyCount: number;
  viewCount: number;
  isLocked?: boolean;
  isPinned?: boolean;
  isSolved?: boolean;
  tags: string[];
  karma: number;
}

interface ForumCategoriesProps {
  onCategoryClick?: (category: ForumCategory) => void;
  onThreadClick?: (thread: Thread) => void;
  showSubCategories?: boolean;
  layout?: 'grid' | 'list';
}

export function ForumCategories({
  onCategoryClick,
  onThreadClick,
  showSubCategories = true,
  layout = 'list'
}: ForumCategoriesProps) {
  // Sample forum categories
  const categories: ForumCategory[] = [
    {
      id: 'general',
      name: 'General Discussion',
      description: 'Open conversations about Haitian culture, life, and experiences',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      threadCount: 1847,
      postCount: 12634,
      lastActivity: {
        threadTitle: 'Best places to visit in Port-au-Prince',
        author: 'Jean Baptiste',
        avatar: '👨🏾‍💼',
        timestamp: new Date(Date.now() - 23 * 60 * 1000)
      },
      subCategories: [
        { id: 'daily-life', name: 'Daily Life', threadCount: 456, postCount: 3241 },
        { id: 'current-events', name: 'Current Events', threadCount: 234, postCount: 1876 },
        { id: 'ask-community', name: 'Ask the Community', threadCount: 567, postCount: 4329 }
      ],
      moderators: [
        { id: 'mod1', name: 'Sophia Laurent', avatar: '👩🏾‍💻', role: 'moderator' },
        { id: 'admin1', name: 'Ann Pale Team', avatar: '🎤', role: 'admin' }
      ],
      isPinned: true
    },
    {
      id: 'creator-spaces',
      name: 'Creator Spaces',
      description: 'Connect with creators, get exclusive content, and participate in fan discussions',
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      threadCount: 892,
      postCount: 7654,
      lastActivity: {
        threadTitle: 'Behind the scenes: Recording process',
        author: 'Marie Delacroix',
        avatar: '👩🏾‍🎨',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      subCategories: [
        { id: 'marie-delacroix', name: 'Marie Delacroix', threadCount: 234, postCount: 2134 },
        { id: 'jean-paul', name: 'Jean Paul Michel', threadCount: 189, postCount: 1543 },
        { id: 'claudette', name: 'Claudette Joseph', threadCount: 167, postCount: 1432 }
      ],
      moderators: [
        { id: 'mod2', name: 'Creator Support', avatar: '⭐', role: 'moderator' }
      ]
    },
    {
      id: 'fan-zones',
      name: 'Fan Zones',
      description: 'Dedicated spaces for fans to celebrate their favorite creators',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      threadCount: 623,
      postCount: 4567,
      lastActivity: {
        threadTitle: 'Fan art gallery - Share your creations',
        author: 'Nadege Pierre',
        avatar: '👩🏾‍💼',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      subCategories: [
        { id: 'fan-art', name: 'Fan Art & Creations', threadCount: 234, postCount: 1876 },
        { id: 'fan-stories', name: 'Fan Stories', threadCount: 123, postCount: 987 },
        { id: 'meetups', name: 'Fan Meetups', threadCount: 89, postCount: 654 }
      ],
      moderators: [
        { id: 'mod3', name: 'Community Mod', avatar: '❤️', role: 'moderator' }
      ]
    },
    {
      id: 'help-support',
      name: 'Help & Support',
      description: 'Get help with platform features, technical issues, and general questions',
      icon: HelpCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      threadCount: 445,
      postCount: 2134,
      lastActivity: {
        threadTitle: 'How to customize my profile page?',
        author: 'Marcus Thompson',
        avatar: '👨🏾‍🎓',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      },
      subCategories: [
        { id: 'platform-help', name: 'Platform Help', threadCount: 234, postCount: 1234 },
        { id: 'technical', name: 'Technical Issues', threadCount: 123, postCount: 567 },
        { id: 'billing', name: 'Billing & Payments', threadCount: 88, postCount: 333 }
      ],
      moderators: [
        { id: 'support1', name: 'Support Team', avatar: '🛠️', role: 'admin' }
      ]
    },
    {
      id: 'showcase',
      name: 'Showcase',
      description: 'Share your work, get feedback, and discover amazing creations',
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      threadCount: 334,
      postCount: 1876,
      lastActivity: {
        threadTitle: 'My latest photography project - Haiti landscapes',
        author: 'Pierre Alexandre',
        avatar: '👨🏾‍🎨',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      subCategories: [
        { id: 'photography', name: 'Photography', threadCount: 145, postCount: 876 },
        { id: 'music', name: 'Music', threadCount: 98, postCount: 543 },
        { id: 'writing', name: 'Writing', threadCount: 91, postCount: 457 }
      ],
      moderators: [
        { id: 'mod4', name: 'Arts Moderator', avatar: '🎨', role: 'moderator' }
      ]
    },
    {
      id: 'culture-heritage',
      name: 'Culture & Heritage',
      description: 'Discuss Haitian culture, traditions, language, and heritage',
      icon: Globe,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      threadCount: 567,
      postCount: 3456,
      lastActivity: {
        threadTitle: 'Traditional Haitian recipes from grandmere',
        author: 'Lucienne Toussaint',
        avatar: '👵🏾',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      subCategories: [
        { id: 'language', name: 'Kreyòl & Language', threadCount: 234, postCount: 1567 },
        { id: 'food', name: 'Food & Recipes', threadCount: 178, postCount: 1234 },
        { id: 'music-culture', name: 'Music & Arts', threadCount: 155, postCount: 655 }
      ],
      moderators: [
        { id: 'culture1', name: 'Cultural Expert', avatar: '🇭🇹', role: 'moderator' }
      ]
    },
    {
      id: 'off-topic',
      name: 'Off-Topic',
      description: 'General conversations about anything not covered in other categories',
      icon: Gamepad2,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      threadCount: 287,
      postCount: 1543,
      lastActivity: {
        threadTitle: 'What are you watching this weekend?',
        author: 'David Charles',
        avatar: '👨🏾‍💻',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      subCategories: [
        { id: 'entertainment', name: 'Entertainment', threadCount: 134, postCount: 765 },
        { id: 'sports', name: 'Sports', threadCount: 89, postCount: 432 },
        { id: 'random', name: 'Random Chat', threadCount: 64, postCount: 346 }
      ],
      moderators: [
        { id: 'mod5', name: 'General Mod', avatar: '💬', role: 'moderator' }
      ]
    }
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
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

  const CategoryCard = ({ category, index }: { category: ForumCategory; index: number }) => {
    const Icon = category.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card 
          className={cn(
            "hover:shadow-lg transition-all cursor-pointer border-l-4",
            category.isLocked && "opacity-60"
          )}
          style={{ borderLeftColor: category.color.replace('text-', '').includes('blue') ? '#2563eb' :
            category.color.replace('text-', '').includes('purple') ? '#9333ea' :
            category.color.replace('text-', '').includes('red') ? '#dc2626' :
            category.color.replace('text-', '').includes('green') ? '#16a34a' :
            category.color.replace('text-', '').includes('orange') ? '#ea580c' :
            category.color.replace('text-', '').includes('indigo') ? '#4f46e5' : '#6b7280'
          }}
          onClick={() => onCategoryClick?.(category)}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Category Icon & Info */}
              <div className="flex-shrink-0">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", category.bgColor)}>
                  <Icon className={cn("h-6 w-6", category.color)} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold hover:text-purple-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.isPinned && (
                    <Pin className="h-4 w-4 text-yellow-600" />
                  )}
                  {category.isLocked && (
                    <Shield className="h-4 w-4 text-red-600" />
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {category.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{formatNumber(category.threadCount)} threads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{formatNumber(category.postCount)} posts</span>
                  </div>
                </div>

                {/* Sub-categories */}
                {showSubCategories && category.subCategories.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {category.subCategories.slice(0, 4).map((sub) => (
                        <Badge key={sub.id} variant="outline" className="text-xs">
                          {sub.name} ({sub.threadCount})
                        </Badge>
                      ))}
                      {category.subCategories.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.subCategories.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Moderators */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gray-500">Moderators:</span>
                  <div className="flex items-center gap-1">
                    {category.moderators.map((mod) => (
                      <div key={mod.id} className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={mod.avatar} />
                          <AvatarFallback className="text-xs">{mod.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600">{mod.name}</span>
                        {mod.role === 'admin' && <Crown className="h-3 w-3 text-yellow-600" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Last Activity */}
              <div className="flex-shrink-0 min-w-0 w-48 hidden md:block">
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Latest Activity</div>
                  <div className="text-sm font-medium text-gray-900 truncate mb-1">
                    {category.lastActivity.threadTitle}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={category.lastActivity.avatar} />
                      <AvatarFallback className="text-xs">
                        {category.lastActivity.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xs text-gray-600">
                      <div>{category.lastActivity.author}</div>
                      <div>{formatTimeAgo(category.lastActivity.timestamp)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (layout === 'grid') {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <CategoryCard key={category.id} category={category} index={index} />
      ))}
    </div>
  );
}