'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  Clock,
  Heart,
  HeartOff,
  Share2,
  MoreHorizontal,
  DollarSign,
  Star,
  Bell,
  BellOff,
  Flag,
  Copy,
  MessageCircle,
  TrendingUp,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LiveStream } from '@/lib/types/live-discovery';
import { ViewerProfile, StreamAnalytics } from '@/lib/types/live-viewer';

interface StreamInfoBarProps {
  stream: LiveStream;
  analytics: StreamAnalytics;
  userProfile: ViewerProfile;
  onFollow: () => void;
  onSubscribe: (tier: string) => void;
  onShare: () => void;
  onReport: () => void;
  onNotifications: (enabled: boolean) => void;
  onTip: () => void;
  className?: string;
}

export function StreamInfoBar({
  stream,
  analytics,
  userProfile,
  onFollow,
  onSubscribe,
  onShare,
  onReport,
  onNotifications,
  onTip,
  className
}: StreamInfoBarProps) {
  const [duration, setDuration] = useState(0);
  const [isFollowing, setIsFollowing] = useState(userProfile.isFollowing);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [viewerCountAnimation, setViewerCountAnimation] = useState(false);
  const [previousViewerCount, setPreviousViewerCount] = useState(analytics.viewerCount);

  // Update duration every second
  useEffect(() => {
    const startTime = new Date(stream.startTime).getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      setDuration(Math.floor((now - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [stream.startTime]);

  // Animate viewer count changes
  useEffect(() => {
    if (analytics.viewerCount !== previousViewerCount) {
      setViewerCountAnimation(true);
      setPreviousViewerCount(analytics.viewerCount);
      setTimeout(() => setViewerCountAnimation(false), 1000);
    }
  }, [analytics.viewerCount, previousViewerCount]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow();
  };

  const handleNotifications = () => {
    setHasNotifications(!hasNotifications);
    onNotifications(!hasNotifications);
  };

  const copyStreamUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    // Show toast notification
  };

  return (
    <div className={cn(
      'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4',
      className
    )}>
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Creator Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Avatar className="w-12 h-12 ring-2 ring-purple-500/20">
            <AvatarImage src={stream.creatorAvatar} />
            <AvatarFallback>
              {stream.creatorName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-lg truncate">
                {stream.title}
              </h2>
              {stream.creatorVerified && (
                <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{stream.creatorName}</span>
              {stream.isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Center Section - Live Stats */}
        <div className="flex items-center gap-6 text-sm">
          <motion.div 
            className="flex items-center gap-1"
            animate={viewerCountAnimation ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Users className="w-4 h-4 text-red-500" />
            <span className="font-medium text-red-500">
              {formatNumber(analytics.viewerCount)}
            </span>
          </motion.div>

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{formatDuration(duration)}</span>
          </div>

          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>{formatNumber(analytics.peakViewers)} peak</span>
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <span>{formatNumber(analytics.chatMessages)}</span>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Follow Button */}
          <Button
            variant={isFollowing ? "secondary" : "default"}
            onClick={handleFollow}
            className={cn(
              "transition-all",
              isFollowing 
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            )}
          >
            {isFollowing ? (
              <>
                <HeartOff className="w-4 h-4 mr-2" />
                Following
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Follow
              </>
            )}
          </Button>

          {/* Notifications */}
          {isFollowing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNotifications}
              className={cn(
                hasNotifications && "bg-blue-50 border-blue-200 text-blue-700"
              )}
            >
              {hasNotifications ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </Button>
          )}

          {/* Tip Button */}
          <Button
            variant="outline"
            onClick={onTip}
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Tip
          </Button>

          {/* Share Button */}
          <Button
            variant="outline"
            onClick={onShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={copyStreamUrl}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onSubscribe('basic')}>
                <Star className="w-4 h-4 mr-2" />
                Subscribe
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={onReport}>
                <Flag className="w-4 h-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stream Description (if expanded) */}
      <AnimatePresence>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {stream.description}
          </p>
          
          {/* Tags */}
          {stream.tags && stream.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {stream.tags.slice(0, 5).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  #{tag}
                </Badge>
              ))}
              {stream.tags.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{stream.tags.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Real-time Engagement Indicators */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ 
            width: `${Math.min(100, (analytics.engagementRate / 100) * 100)}%` 
          }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}