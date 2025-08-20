'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  PictureInPicture,
  RotateCcw,
  Wifi,
  WifiOff,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  VideoPlayerSettings,
  StreamPlayerState,
  VideoQuality,
  LatencyMode,
  QUALITY_SETTINGS,
  LATENCY_SETTINGS,
  DEFAULT_VIDEO_SETTINGS
} from '@/lib/types/live-viewer';

interface AdaptiveVideoPlayerProps {
  streamUrl: string;
  posterUrl?: string;
  settings: VideoPlayerSettings;
  playerState: StreamPlayerState;
  onSettingsChange: (settings: Partial<VideoPlayerSettings>) => void;
  onPlayerStateChange: (state: Partial<StreamPlayerState>) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function AdaptiveVideoPlayer({
  streamUrl,
  posterUrl,
  settings,
  playerState,
  onSettingsChange,
  onPlayerStateChange,
  onError,
  className
}: AdaptiveVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isUserActive, setIsUserActive] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout>();
  const [buffering, setBuffering] = useState(false);

  // Hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setIsUserActive(true);
      setShowControls(true);
      
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      const timeout = setTimeout(() => {
        if (playerState.isPlaying && !showSettings) {
          setShowControls(false);
          setIsUserActive(false);
        }
      }, 3000);
      
      setControlsTimeout(timeout);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', () => {
        if (playerState.isPlaying && !showSettings) {
          setShowControls(false);
        }
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout, playerState.isPlaying, showSettings]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video) {
        // Pause video and clear src to prevent "media removed" errors
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }, []);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setBuffering(true);
    const handleCanPlay = () => setBuffering(false);
    const handleWaiting = () => setBuffering(true);
    const handlePlaying = () => setBuffering(false);
    
    const handleTimeUpdate = () => {
      onPlayerStateChange({
        currentTime: video.currentTime,
        bufferedPercentage: video.buffered.length > 0 
          ? (video.buffered.end(video.buffered.length - 1) / video.duration) * 100 
          : 0
      });
    };

    const handleError = () => {
      const error = video.error;
      const errorMessage = error ? `Video error: ${error.message}` : 'Unknown video error';
      onError?.(errorMessage);
      onPlayerStateChange({ error: errorMessage });
    };

    const handleLoadedMetadata = () => {
      onPlayerStateChange({
        duration: video.duration,
        error: undefined
      });
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onPlayerStateChange, onError]);

  // Apply settings to video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = settings.volume;
    video.muted = settings.muted;
    video.autoplay = settings.autoplay;

    // Handle play/pause
    if (settings.autoplay && playerState.isPlaying) {
      video.play().catch(err => {
        onError?.(`Autoplay failed: ${err.message}`);
      });
    } else if (!playerState.isPlaying) {
      video.pause();
    }
  }, [settings, playerState.isPlaying, onError]);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.isConnected) return; // Check if video is still in DOM

    if (playerState.isPlaying) {
      try {
        video.pause();
        onPlayerStateChange({ isPlaying: false });
      } catch (err) {
        console.warn('Pause error:', err);
      }
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Only update state if video is still in DOM
          if (video.isConnected) {
            onPlayerStateChange({ isPlaying: true });
          }
        }).catch(err => {
          // Only report error if it's not due to element being removed
          if (video.isConnected) {
            onError?.(`Play failed: ${err.message}`);
          }
        });
      }
    }
  }, [playerState.isPlaying, onPlayerStateChange, onError]);

  const toggleMute = useCallback(() => {
    onSettingsChange({ muted: !settings.muted });
  }, [settings.muted, onSettingsChange]);

  const handleVolumeChange = useCallback((value: number[]) => {
    onSettingsChange({ 
      volume: value[0] / 100,
      muted: value[0] === 0
    });
  }, [onSettingsChange]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!settings.fullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
      onSettingsChange({ fullscreen: true });
    } else {
      if (typeof document !== 'undefined' && document.exitFullscreen) {
        document.exitFullscreen();
      }
      onSettingsChange({ fullscreen: false });
    }
  }, [settings.fullscreen, onSettingsChange]);

  const togglePictureInPicture = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (!settings.pictureInPicture) {
        await video.requestPictureInPicture();
        onSettingsChange({ pictureInPicture: true });
      } else {
        if (typeof document !== 'undefined' && document.exitPictureInPicture) {
          await document.exitPictureInPicture();
        }
        onSettingsChange({ pictureInPicture: false });
      }
    } catch (err) {
      onError?.(`Picture-in-picture failed: ${err}`);
    }
  }, [settings.pictureInPicture, onSettingsChange, onError]);

  const handleQualityChange = useCallback((quality: VideoQuality) => {
    onSettingsChange({ quality });
  }, [onSettingsChange]);

  const handleLatencyModeChange = useCallback((latencyMode: LatencyMode) => {
    onSettingsChange({ latencyMode });
  }, [onSettingsChange]);

  const getConnectionQualityIcon = () => {
    switch (playerState.connectionQuality) {
      case 'excellent':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'good':
        return <Wifi className="w-4 h-4 text-yellow-500" />;
      case 'fair':
        return <Wifi className="w-4 h-4 text-orange-500" />;
      case 'poor':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black rounded-lg overflow-hidden group',
        settings.fullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      style={{ aspectRatio: settings.fullscreen ? 'auto' : '16/9' }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={posterUrl}
        playsInline
        onClick={togglePlayPause}
      >
        <source src={streamUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Buffering Indicator */}
      <AnimatePresence>
        {(buffering || playerState.isBuffering) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <div className="flex items-center gap-3 text-white">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>Buffering...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Overlay */}
      <AnimatePresence>
        {playerState.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80"
          >
            <div className="text-center text-white space-y-4">
              <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Playback Error</h3>
                <p className="text-sm text-gray-300">{playerState.error}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  onPlayerStateChange({ error: undefined });
                  const video = videoRef.current;
                  if (video) {
                    video.load();
                  }
                }}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"
          >
            {/* Top Bar - Connection Status */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">
                  LIVE
                </Badge>
                <div className="flex items-center gap-1 text-white text-sm">
                  {getConnectionQualityIcon()}
                  <span>{playerState.latency}ms</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-white text-sm">
                <span>{QUALITY_SETTINGS[settings.quality].label}</span>
                <span>•</span>
                <span>{playerState.bitrate} kbps</span>
                {settings.quality === 'auto' && (
                  <Badge variant="secondary" className="text-xs">
                    Auto
                  </Badge>
                )}
              </div>
            </div>

            {/* Center Play Button */}
            {!playerState.isPlaying && !buffering && !playerState.error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  onClick={togglePlayPause}
                  className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/40"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </Button>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{ width: `${playerState.bufferedPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span>LIVE</span>
                  <span>{formatTime(playerState.currentTime)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={togglePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {playerState.isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {settings.muted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    
                    <div className="w-20">
                      <Slider
                        value={[settings.muted ? 0 : settings.volume * 100]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>

                  {typeof document !== 'undefined' && document.pictureInPictureEnabled && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={togglePictureInPicture}
                      className="text-white hover:bg-white/20"
                    >
                      <PictureInPicture className="w-5 h-5" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    {settings.fullscreen ? (
                      <Minimize className="w-5 h-5" />
                    ) : (
                      <Maximize className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-0 right-0 bottom-0 w-80 bg-black/90 backdrop-blur-sm p-6 overflow-y-auto"
          >
            <div className="space-y-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Settings</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowSettings(false)}
                  className="text-white hover:bg-white/20"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Quality</label>
                  <Select
                    value={settings.quality}
                    onValueChange={handleQualityChange}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(QUALITY_SETTINGS).map(([key, quality]) => (
                        <SelectItem key={key} value={key}>
                          <div>
                            <div className="font-medium">{quality.label}</div>
                            <div className="text-xs text-gray-500">{quality.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Latency</label>
                  <Select
                    value={settings.latencyMode}
                    onValueChange={handleLatencyModeChange}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LATENCY_SETTINGS).map(([key, latency]) => (
                        <SelectItem key={key} value={key} disabled={latency.premium}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-medium">{latency.label}</div>
                              <div className="text-xs text-gray-500">{latency.description}</div>
                            </div>
                            {latency.premium && (
                              <Badge className="ml-2 bg-yellow-500">Premium</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto Quality</span>
                    <Button
                      size="sm"
                      variant={settings.autoQualityEnabled ? "default" : "outline"}
                      onClick={() => onSettingsChange({ 
                        autoQualityEnabled: !settings.autoQualityEnabled 
                      })}
                    >
                      {settings.autoQualityEnabled ? 'On' : 'Off'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Captions</span>
                    <Button
                      size="sm"
                      variant={settings.captions ? "default" : "outline"}
                      onClick={() => onSettingsChange({ 
                        captions: !settings.captions 
                      })}
                    >
                      {settings.captions ? 'On' : 'Off'}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <h4 className="text-sm font-medium mb-3">Stream Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Connection</span>
                      <span className="capitalize">{playerState.connectionQuality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Latency</span>
                      <span>{playerState.latency}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bitrate</span>
                      <span>{playerState.bitrate} kbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">FPS</span>
                      <span>{playerState.fps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Dropped Frames</span>
                      <span>{playerState.droppedFrames}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}