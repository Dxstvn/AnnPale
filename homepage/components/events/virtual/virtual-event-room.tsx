'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Users,
  MessageSquare,
  HelpCircle,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Camera,
  Play,
  Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VirtualEventData {
  id: string;
  title: string;
  presenter: {
    name: string;
    title: string;
    avatar?: string;
  };
  streamUrl: string;
  isLive: boolean;
  viewerCount: number;
  duration: number;
  startTime: Date;
  features: {
    chat: boolean;
    qa: boolean;
    polls: boolean;
    networking: boolean;
    recording: boolean;
    translation: boolean;
  };
  userTier: 'general' | 'vip' | 'platinum';
}

interface VirtualEventRoomProps {
  event: VirtualEventData;
  onToggleChat?: () => void;
  onToggleFullscreen?: () => void;
  onChangeQuality?: (quality: string) => void;
  onLeaveEvent?: () => void;
  chatOpen?: boolean;
  className?: string;
}

export function VirtualEventRoom({
  event,
  onToggleChat,
  onToggleFullscreen,
  onChangeQuality,
  onLeaveEvent,
  chatOpen = true,
  className
}: VirtualEventRoomProps) {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [selectedQuality, setSelectedQuality] = React.useState('1080p');
  const [showControls, setShowControls] = React.useState(true);
  const [connectionQuality, setConnectionQuality] = React.useState<'excellent' | 'good' | 'poor'>('excellent');

  // Auto-hide controls after 3 seconds of no mouse movement
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    onChangeQuality?.(quality);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    onToggleFullscreen?.();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'good':
        return <Wifi className="h-4 w-4 text-yellow-500" />;
      case 'poor':
        return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className={cn("relative bg-black rounded-lg overflow-hidden", className)}>
      {/* Main Video Area */}
      <div className="relative aspect-video bg-gray-900">
        {/* Video Player Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Live Stream</p>
            {event.isLive && (
              <Badge className="mt-2 bg-red-600 text-white">
                <span className="animate-pulse mr-2">●</span>
                LIVE
              </Badge>
            )}
          </div>
        </div>

        {/* Top Controls Overlay */}
        <div className={cn(
          "absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLeaveEvent}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Leave Event
              </Button>
              <div className="flex items-center gap-2">
                {event.isLive && (
                  <Badge className="bg-red-600 text-white">
                    <span className="animate-pulse mr-2">●</span>
                    LIVE
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-black/50 text-white">
                  <Users className="h-3 w-3 mr-1" />
                  {event.viewerCount.toLocaleString()} watching
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Connection Quality */}
              <div className="flex items-center gap-1 px-2 py-1 bg-black/50 rounded">
                {getConnectionIcon()}
                <span className="text-xs text-white">{selectedQuality}</span>
              </div>

              {/* User Tier Badge */}
              {event.userTier === 'vip' && (
                <Badge className="bg-purple-600 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  VIP
                </Badge>
              )}
              {event.userTier === 'platinum' && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Platinum
                </Badge>
              )}

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Presenter Info Overlay */}
        <div className={cn(
          "absolute bottom-20 left-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}>
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
            <div className="text-white">
              <p className="font-semibold">{event.presenter.name}</p>
              <p className="text-xs text-gray-300">{event.presenter.title}</p>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}>
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-white mb-1">
              <span>{formatDuration(Math.floor(event.duration * 0.3))}</span>
              <span>{formatDuration(event.duration)}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1">
              <div className="bg-white h-1 rounded-full" style={{ width: '30%' }} />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              {/* Volume */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              {/* Time */}
              <span className="text-white text-sm ml-2">
                {formatDuration(Math.floor(event.duration * 0.3))} / {formatDuration(event.duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Quality Selector */}
              <select
                value={selectedQuality}
                onChange={(e) => handleQualityChange(e.target.value)}
                className="bg-black/50 text-white text-sm px-2 py-1 rounded border border-white/20"
              >
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
                <option value="360p">360p</option>
                <option value="Auto">Auto</option>
              </select>

              {/* Picture in Picture */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Monitor className="h-4 w-4" />
              </Button>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullscreen}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-gray-900 border-t border-gray-800 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Chat Toggle */}
            <Button
              variant={chatOpen ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleChat}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Chat
              {chatOpen && <Badge variant="secondary">42</Badge>}
            </Button>

            {/* Q&A */}
            {event.features.qa && (
              <Button variant="outline" size="sm" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Q&A
              </Button>
            )}

            {/* Networking */}
            {event.features.networking && event.userTier !== 'general' && (
              <Button variant="outline" size="sm" className="gap-2">
                <Users className="h-4 w-4" />
                Network
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Share */}
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>

            {/* Download/Record */}
            {event.features.recording && (
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* VIP/Platinum Features Indicator */}
      {event.userTier !== 'general' && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <Card className="bg-black/80 backdrop-blur-sm border-purple-600/50">
            <CardContent className="p-3">
              <p className="text-xs text-purple-400 font-semibold mb-2">
                {event.userTier === 'vip' ? 'VIP' : 'Platinum'} Features
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white text-xs">
                  <Camera className="h-3 w-3" />
                  <span>Backstage Access</span>
                </div>
                <div className="flex items-center gap-2 text-white text-xs">
                  <MessageSquare className="h-3 w-3" />
                  <span>Priority Q&A</span>
                </div>
                {event.userTier === 'platinum' && (
                  <div className="flex items-center gap-2 text-white text-xs">
                    <Users className="h-3 w-3" />
                    <span>Meet & Greet</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}