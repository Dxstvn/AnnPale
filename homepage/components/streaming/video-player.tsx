'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  streamUrl: string;
  streamId: string;
  isLive?: boolean;
  viewerCount?: number;
  onQualityChange?: (quality: string) => void;
  className?: string;
}

type Quality = 'auto' | '720p' | '540p' | '360p';

export function VideoPlayer({
  streamUrl,
  streamId,
  isLive = true,
  viewerCount = 0,
  onQualityChange,
  className
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<Quality>('auto');
  const [availableQualities] = useState<Quality[]>(['auto', '720p', '540p', '360p']);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize HLS.js for HLS streaming
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    const loadHlsPlayer = async () => {
      try {
        // Check if URL is a demo/mock URL
        const isDemoUrl = streamUrl.includes('demo-stream.annpale.com') || 
                         streamUrl.includes('test-stream.annpale.com');
        
        if (isDemoUrl && process.env.NODE_ENV === 'development') {
          // In development, show a mock player for demo URLs
          setError('Demo Mode: Click play to see mock content');
          setIsLoading(false);
          return;
        }
        
        // Check if native HLS is supported (Safari)
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else {
          // Use HLS.js for other browsers
          const Hls = (await import('hls.js')).default;
          
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90
            });

            hls.loadSource(streamUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              setIsLoading(false);
              if (isLive) {
                video.play().catch(console.error);
                setIsPlaying(true);
              }
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
              console.warn('HLS error:', data);
              
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.warn('HLS Network error - attempting recovery');
                    // In development, show a mock player instead of crashing
                    if (process.env.NODE_ENV === 'development') {
                      setError('Demo Mode: Live stream not available');
                      setIsLoading(false);
                      // Don't throw the error in development
                      return;
                    }
                    hls.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.warn('HLS Media error - attempting recovery');
                    hls.recoverMediaError();
                    break;
                  default:
                    setError('Stream temporarily unavailable');
                    setIsLoading(false);
                    break;
                }
              }
            });

            return () => {
              hls.destroy();
            };
          } else {
            setError('Browser does not support HLS streaming');
          }
        }
      } catch (err) {
        console.error('Failed to load HLS player:', err);
        setError('Failed to initialize video player');
      }
    };

    loadHlsPlayer();
  }, [streamUrl, isLive]);

  // Handle play/pause
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  // Handle volume
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    setVolume(newVolume);
    video.volume = newVolume / 100;
    
    if (newVolume === 0) {
      setIsMuted(true);
      video.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  // Handle fullscreen
  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Handle quality change
  const handleQualitySelect = (quality: Quality) => {
    setCurrentQuality(quality);
    onQualityChange?.(quality);
  };

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchstart', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchstart', handleMouseMove);
      }
      clearTimeout(timeout);
    };
  }, []);

  if (error) {
    return (
      <div className={cn(
        "relative bg-black rounded-lg overflow-hidden flex items-center justify-center",
        "aspect-video",
        className
      )}>
        <div className="text-white text-center p-8">
          <p className="text-lg font-semibold mb-2">Unable to load stream</p>
          <p className="text-sm opacity-75">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-lg overflow-hidden group",
        "aspect-video",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        onClick={togglePlayPause}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
        </div>
      )}

      {/* Stream Status Overlay */}
      {isLive && (
        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
          <Badge variant="destructive" className="animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full mr-1.5" />
            LIVE
          </Badge>
          {viewerCount > 0 && (
            <Badge variant="secondary" className="bg-black/50 text-white border-0">
              <Users className="w-3 h-3 mr-1" />
              {viewerCount.toLocaleString()}
            </Badge>
          )}
        </div>
      )}

      {/* Control Bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent",
          "transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          {/* Volume Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={toggleMute}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <div className="w-24 hidden md:block">
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Quality Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              {availableQualities.map((quality) => (
                <DropdownMenuItem
                  key={quality}
                  onClick={() => handleQualitySelect(quality)}
                  className={cn(
                    currentQuality === quality && "font-semibold"
                  )}
                >
                  {quality === 'auto' ? 'Auto' : quality}
                  {currentQuality === quality && ' ✓'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Fullscreen */}
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={toggleFullscreen}
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}