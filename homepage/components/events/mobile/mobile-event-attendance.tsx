'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Settings,
  Users,
  MessageSquare,
  Heart,
  ThumbsUp,
  Share2,
  Hand,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneOff,
  MoreVertical,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  PictureInPicture,
  Headphones,
  Download,
  Upload,
  Zap,
  Star,
  Gift,
  Coffee,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface StreamQuality {
  label: string;
  value: string;
  bandwidth: string;
  resolution: string;
}

interface Reaction {
  id: string;
  emoji: string;
  count: number;
  active: boolean;
}

interface MobileEventAttendanceProps {
  event?: {
    id: string;
    title: string;
    creator: string;
    isLive: boolean;
    viewers: number;
    duration: number;
    currentTime: number;
  };
  onLeave?: () => void;
  onReaction?: (emoji: string) => void;
  onChat?: (message: string) => void;
  onShare?: () => void;
}

export function MobileEventAttendance({
  event,
  onLeave,
  onReaction,
  onChat,
  onShare
}: MobileEventAttendanceProps) {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(75);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [pictureInPicture, setPictureInPicture] = React.useState(false);
  const [audioOnly, setAudioOnly] = React.useState(false);
  const [quality, setQuality] = React.useState('auto');
  const [showControls, setShowControls] = React.useState(true);
  const [showChat, setShowChat] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [cameraEnabled, setCameraEnabled] = React.useState(false);
  const [micEnabled, setMicEnabled] = React.useState(false);
  const [isPortrait, setIsPortrait] = React.useState(true);
  const [batteryOptimized, setBatteryOptimized] = React.useState(false);
  const [connectionQuality, setConnectionQuality] = React.useState<'excellent' | 'good' | 'poor'>('good');

  // Sample event data
  const sampleEvent = {
    id: 'event-1',
    title: 'Haitian Music Masterclass',
    creator: 'Marie Delacroix',
    isLive: true,
    viewers: 487,
    duration: 5400, // 90 minutes in seconds
    currentTime: 1800 // 30 minutes in
  };

  const displayEvent = event || sampleEvent;

  // Stream quality options
  const qualityOptions: StreamQuality[] = [
    { label: 'Auto', value: 'auto', bandwidth: 'Adaptive', resolution: 'Adaptive' },
    { label: '1080p', value: '1080p', bandwidth: '5 Mbps', resolution: '1920×1080' },
    { label: '720p', value: '720p', bandwidth: '2.5 Mbps', resolution: '1280×720' },
    { label: '480p', value: '480p', bandwidth: '1 Mbps', resolution: '854×480' },
    { label: '360p', value: '360p', bandwidth: '0.5 Mbps', resolution: '640×360' }
  ];

  // Reaction emojis
  const reactions: Reaction[] = [
    { id: 'heart', emoji: '❤️', count: 234, active: false },
    { id: 'thumbs-up', emoji: '👍', count: 156, active: false },
    { id: 'clap', emoji: '👏', count: 89, active: true },
    { id: 'fire', emoji: '🔥', count: 67, active: false },
    { id: 'star', emoji: '⭐', count: 45, active: false },
    { id: 'sparkles', emoji: '✨', count: 32, active: false }
  ];

  const [chatMessages, setChatMessages] = React.useState([
    { id: '1', user: 'Jean Pierre', message: 'Amazing session! 🎵', time: '2 min ago', verified: true },
    { id: '2', user: 'Sophia L.', message: 'Can you show the chord progression again?', time: '1 min ago', verified: false },
    { id: '3', user: 'Marcus T.', message: 'This is incredible! Learning so much', time: '30s ago', verified: false }
  ]);

  const [newMessage, setNewMessage] = React.useState('');

  const progress = (displayEvent.currentTime / displayEvent.duration) * 100;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        user: 'You',
        message: newMessage,
        time: 'now',
        verified: false
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      onChat?.(newMessage);
    }
  };

  const handleReaction = (emoji: string) => {
    onReaction?.(emoji);
    // Visual feedback for reaction
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return <Signal className="h-4 w-4 text-green-500" />;
      case 'good': return <Wifi className="h-4 w-4 text-yellow-500" />;
      case 'poor': return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  // Auto-hide controls
  React.useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => setShowControls(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, showControls]);

  return (
    <div className={cn(
      "relative bg-black overflow-hidden",
      isFullscreen ? "fixed inset-0 z-50" : "h-screen"
    )}>
      {/* Video Area */}
      <div 
        className="relative h-full w-full flex items-center justify-center"
        onClick={() => setShowControls(!showControls)}
      >
        {/* Video Placeholder */}
        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
          {audioOnly ? (
            <div className="text-center text-white">
              <Headphones className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">{displayEvent.title}</p>
              <p className="text-sm opacity-75">Audio Only Mode</p>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Play className="h-20 w-20 text-white opacity-50" />
            </div>
          )}

          {/* Live Indicator */}
          {displayEvent.isLive && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-600 text-white animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2" />
                LIVE
              </Badge>
            </div>
          )}

          {/* Viewers Count */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-black/50 text-white">
              <Users className="h-3 w-3 mr-1" />
              {displayEvent.viewers}
            </Badge>
          </div>

          {/* Connection Quality */}
          <div className="absolute top-16 right-4">
            {getConnectionIcon()}
          </div>

          {/* Floating Reactions */}
          <AnimatePresence>
            {reactions.filter(r => r.active).map((reaction) => (
              <motion.div
                key={reaction.id}
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -100, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute bottom-20 right-8 text-3xl pointer-events-none"
              >
                {reaction.emoji}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Controls Overlay */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20"
              >
                {/* Top Controls */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg truncate">{displayEvent.title}</h2>
                      <p className="text-sm opacity-75">by {displayEvent.creator}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettings(true)}
                        className="text-white hover:bg-white/20"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onLeave}
                        className="text-white hover:bg-white/20"
                      >
                        <PhoneOff className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Center Play/Pause */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:bg-white/20 w-16 h-16 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <Progress value={progress} className="h-1 bg-white/20" />
                    <div className="flex justify-between text-xs text-white/75">
                      <span>{formatTime(displayEvent.currentTime)}</span>
                      <span>{formatTime(displayEvent.duration)}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="text-white hover:bg-white/20"
                      >
                        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPictureInPicture(!pictureInPicture)}
                        className="text-white hover:bg-white/20"
                      >
                        <PictureInPicture className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowChat(!showChat)}
                        className="text-white hover:bg-white/20"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onShare}
                        className="text-white hover:bg-white/20"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Participant Controls (for interactive events) */}
        <div className="absolute bottom-20 left-4 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCameraEnabled(!cameraEnabled)}
            className={cn(
              "text-white",
              cameraEnabled ? "bg-green-600" : "bg-black/50"
            )}
          >
            {cameraEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMicEnabled(!micEnabled)}
            className={cn(
              "text-white",
              micEnabled ? "bg-green-600" : "bg-black/50"
            )}
          >
            {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white bg-black/50"
          >
            <Hand className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Reactions */}
        <div className="absolute bottom-32 right-4 flex flex-col gap-2">
          {reactions.slice(0, 4).map((reaction) => (
            <Button
              key={reaction.id}
              variant="ghost"
              size="sm"
              onClick={() => handleReaction(reaction.emoji)}
              className="text-white bg-black/50 hover:bg-black/70 w-12 h-12 rounded-full p-0"
            >
              <span className="text-lg">{reaction.emoji}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="absolute bottom-0 left-0 right-0 bg-white h-80 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Live Chat</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
              >
                <Minimize className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{msg.user}</span>
                    {msg.verified && (
                      <Badge variant="secondary" className="h-4 w-4 p-0">
                        ✓
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <Button onClick={handleSendMessage}>
                  Send
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg overflow-y-auto"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Stream Settings</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {/* Quality Settings */}
              <div>
                <h4 className="font-medium mb-3">Video Quality</h4>
                <div className="space-y-2">
                  {qualityOptions.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "p-3 border rounded-lg cursor-pointer",
                        quality === option.value ? "border-purple-600 bg-purple-50" : "hover:bg-gray-50"
                      )}
                      onClick={() => setQuality(option.value)}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-gray-600">{option.bandwidth}</span>
                      </div>
                      <p className="text-xs text-gray-500">{option.resolution}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio Settings */}
              <div>
                <h4 className="font-medium mb-3">Audio</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm block mb-2">Volume</label>
                    <Slider
                      value={[volume]}
                      onValueChange={(value) => setVolume(value[0])}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Audio Only Mode</span>
                    <Button
                      variant={audioOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAudioOnly(!audioOnly)}
                    >
                      <Headphones className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Battery Optimization */}
              <div>
                <h4 className="font-medium mb-3">Battery Optimization</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Low Power Mode</p>
                      <p className="text-xs text-gray-600">Reduces video quality to save battery</p>
                    </div>
                    <Button
                      variant={batteryOptimized ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBatteryOptimized(!batteryOptimized)}
                    >
                      <Battery className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Accessibility */}
              <div>
                <h4 className="font-medium mb-3">Accessibility</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Auto-generated Captions
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Sun className="h-4 w-4 mr-2" />
                    High Contrast Mode
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Optimization Indicators */}
      <div className="absolute top-20 left-4 flex flex-col gap-2">
        {batteryOptimized && (
          <Badge className="bg-green-600 text-white text-xs">
            <Battery className="h-3 w-3 mr-1" />
            Power Saving
          </Badge>
        )}
        {audioOnly && (
          <Badge className="bg-blue-600 text-white text-xs">
            <Headphones className="h-3 w-3 mr-1" />
            Audio Only
          </Badge>
        )}
      </div>
    </div>
  );
}