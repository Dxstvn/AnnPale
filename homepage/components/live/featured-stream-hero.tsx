'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreatorAvatar } from '@/components/ui/avatar-with-fallback';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Users, 
  Heart,
  Share2,
  Clock,
  Check,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LiveStream, STREAM_CATEGORIES } from '@/lib/types/live-discovery';

interface FeaturedStreamHeroProps {
  stream: LiveStream | null;
  onJoinStream?: (streamId: string) => void;
  onFollowCreator?: (creatorId: string) => void;
  className?: string;
}

export function FeaturedStreamHero({
  stream,
  onJoinStream,
  onFollowCreator,
  className
}: FeaturedStreamHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream) {
      setIsFollowed(stream.isFollowed || false);
    }
  }, [stream]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleJoinStream = () => {
    if (stream) {
      onJoinStream?.(stream.id);
    }
  };

  const handleFollowCreator = () => {
    if (stream) {
      setIsFollowed(!isFollowed);
      onFollowCreator?.(stream.creatorId);
    }
  };

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

  if (!stream) {
    return (
      <div className={cn(
        'relative h-[60vh] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl overflow-hidden',
        'flex items-center justify-center',
        className
      )}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse mx-auto" />
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-48" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-32" />
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = STREAM_CATEGORIES[stream.category];

  return (
    <div className={cn(
      'relative h-[60vh] rounded-xl overflow-hidden group',
      className
    )}>
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={stream.thumbnailUrl}
          muted={isMuted}
          loop
          playsInline
        >
          <source src={stream.streamUrl} type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Live Badge */}
      <div className="absolute top-6 left-6">
        <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full mr-2" />
          LIVE
        </Badge>
      </div>

      {/* Video Controls */}
      <div className="absolute top-6 right-6 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="bg-black/20 hover:bg-black/40 border-0"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-black/20 hover:bg-black/40 border-0"
          onClick={handleMuteToggle}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Stream Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-end justify-between">
          <div className="flex-1 space-y-4">
            {/* Category */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">{categoryInfo.icon}</span>
              <Badge 
                variant="secondary" 
                className={cn(
                  'bg-gradient-to-r text-white',
                  categoryInfo.color
                )}
              >
                {categoryInfo.displayName}
              </Badge>
            </div>

            {/* Title and Description */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold leading-tight">
                {stream.title}
              </h1>
              <p className="text-lg text-white/90 max-w-2xl line-clamp-2">
                {stream.description}
              </p>
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-4">
              <CreatorAvatar 
                src={stream.creatorAvatar}
                name={stream.creatorName}
                size="lg"
                verified={stream.creatorVerified}
                className="ring-2 ring-white/20"
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{stream.creatorName}</h3>
                  {stream.creatorVerified && (
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {formatViewerCount(stream.viewerCount)} watching
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(stream.duration)}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8"
                onClick={handleJoinStream}
              >
                <Play className="w-5 h-5 mr-2" />
                Join Stream
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                onClick={handleFollowCreator}
              >
                {isFollowed ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Follow
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block bg-black/20 backdrop-blur-sm rounded-lg p-4 min-w-[200px]"
          >
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatViewerCount(stream.viewerCount)}
                </div>
                <div className="text-sm text-white/80">Current Viewers</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-semibold">
                  {formatViewerCount(stream.peakViewerCount)}
                </div>
                <div className="text-xs text-white/80">Peak Today</div>
              </div>

              <div className="text-center">
                <div className="text-lg font-medium">
                  {stream.quality.toUpperCase()}
                </div>
                <div className="text-xs text-white/80">Quality</div>
              </div>

              {stream.tags.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs text-white/80">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {stream.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs text-white border-white/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}