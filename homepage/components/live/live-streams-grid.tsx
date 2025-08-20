'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreatorAvatar } from '@/components/ui/avatar-with-fallback';
import { 
  Play, 
  Users, 
  Clock, 
  Heart,
  Star,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Share2,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LiveStream, STREAM_CATEGORIES } from '@/lib/types/live-discovery';

interface LiveStreamsGridProps {
  streams: LiveStream[];
  onStreamClick?: (stream: LiveStream) => void;
  onFollowCreator?: (creatorId: string) => void;
  onSetReminder?: (streamId: string) => void;
  columns?: 2 | 3 | 4;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export function LiveStreamsGrid({
  streams,
  onStreamClick,
  onFollowCreator,
  onSetReminder,
  columns = 3,
  showViewAll = false,
  onViewAll,
  className
}: LiveStreamsGridProps) {
  const [hoveredStream, setHoveredStream] = useState<string | null>(null);
  const [mutedStreams, setMutedStreams] = useState<Set<string>>(new Set());

  const formatViewerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const toggleMute = (streamId: string) => {
    setMutedStreams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(streamId)) {
        newSet.delete(streamId);
      } else {
        newSet.add(streamId);
      }
      return newSet;
    });
  };

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Currently Live</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {streams.length} streams • {streams.reduce((sum, s) => sum + s.viewerCount, 0).toLocaleString()} total viewers
          </p>
        </div>
        {showViewAll && (
          <Button variant="outline" onClick={onViewAll}>
            View All ({streams.length})
          </Button>
        )}
      </div>

      {/* Grid */}
      <div className={cn('grid gap-6', gridCols[columns])}>
        <AnimatePresence>
          {streams.map((stream, index) => (
            <LiveStreamCard
              key={stream.id}
              stream={stream}
              index={index}
              isHovered={hoveredStream === stream.id}
              isMuted={mutedStreams.has(stream.id)}
              onHover={setHoveredStream}
              onClick={() => onStreamClick?.(stream)}
              onFollow={() => onFollowCreator?.(stream.creatorId)}
              onMuteToggle={() => toggleMute(stream.id)}
              onSetReminder={() => onSetReminder?.(stream.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {streams.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Live Streams
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Check back later for live content from your favorite creators
          </p>
        </div>
      )}
    </div>
  );
}

interface LiveStreamCardProps {
  stream: LiveStream;
  index: number;
  isHovered: boolean;
  isMuted: boolean;
  onHover: (streamId: string | null) => void;
  onClick: () => void;
  onFollow: () => void;
  onMuteToggle: () => void;
  onSetReminder: () => void;
}

function LiveStreamCard({
  stream,
  index,
  isHovered,
  isMuted,
  onHover,
  onClick,
  onFollow,
  onMuteToggle,
  onSetReminder
}: LiveStreamCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const categoryInfo = STREAM_CATEGORIES[stream.category];

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatViewerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleMouseEnter = () => {
    onHover(stream.id);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handle autoplay restrictions
      });
    }
  };

  const handleMouseLeave = () => {
    onHover(null);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-video">
          {/* Thumbnail/Video */}
          <div className="relative w-full h-full bg-gray-900">
            {isHovered && stream.streamUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted={isMuted}
                playsInline
                loop
              >
                <source src={stream.streamUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={stream.thumbnailUrl}
                alt={stream.title}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Live Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse text-xs">
              <div className="w-2 h-2 bg-white rounded-full mr-1" />
              LIVE
            </Badge>
          </div>

          {/* Quality Badge */}
          {stream.quality !== 'sd' && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-black/40 text-white text-xs">
                {stream.quality.toUpperCase()}
              </Badge>
            </div>
          )}

          {/* Hover Controls */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick();
                    }}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Watch
                  </Button>
                  
                  {stream.streamUrl && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMuteToggle();
                      }}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-black/40 rounded-full px-2 py-1">
                  <Users className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    {stream.viewerCount >= 1000 
                      ? `${(stream.viewerCount / 1000).toFixed(1)}K`
                      : stream.viewerCount
                    }
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-black/40 rounded-full px-2 py-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">
                    {formatDuration(stream.duration)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">{categoryInfo.icon}</span>
            <Badge 
              variant="outline" 
              className="text-xs"
            >
              {categoryInfo.displayName}
            </Badge>
            {stream.isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                Premium
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 
            className="font-semibold text-sm mb-2 line-clamp-2 leading-snug hover:text-purple-600 transition-colors"
            onClick={onClick}
          >
            {stream.title}
          </h3>

          {/* Creator Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <CreatorAvatar 
                src={stream.creatorAvatar}
                name={stream.creatorName}
                size="sm"
                verified={stream.creatorVerified}
              />
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium truncate">
                    {stream.creatorName}
                  </span>
                  {stream.creatorVerified && (
                    <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {formatViewerCount(stream.viewerCount)} watching
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onFollow();
                }}
              >
                <Heart className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  // Share functionality
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          {stream.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {stream.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs px-1.5 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {stream.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  +{stream.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}