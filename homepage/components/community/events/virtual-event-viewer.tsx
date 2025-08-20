'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Users,
  MessageSquare,
  Gift,
  Heart,
  ThumbsUp,
  Share2,
  Settings,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  ScreenShare,
  ScreenShareOff,
  Phone,
  PhoneOff,
  Hand,
  Send,
  Smile,
  Star,
  Trophy,
  Sparkles,
  PartyPopper,
  Clock,
  Info,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Download,
  ExternalLink,
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface EventParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'co-host' | 'speaker' | 'attendee';
  isSpeaking?: boolean;
  isMuted?: boolean;
  hasVideo?: boolean;
  reaction?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'question' | 'announcement';
  highlighted?: boolean;
}

interface EventPoll {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  totalVotes: number;
  userVoted?: boolean;
}

interface VirtualEventViewerProps {
  eventId: string;
  eventTitle: string;
  isLive?: boolean;
  participants?: EventParticipant[];
  currentUserId?: string;
  streamUrl?: string;
  onLeaveEvent?: () => void;
  onToggleCamera?: () => void;
  onToggleMic?: () => void;
  onSendMessage?: (message: string) => void;
  onReaction?: (reaction: string) => void;
  showChat?: boolean;
  showParticipants?: boolean;
}

export function VirtualEventViewer({
  eventId,
  eventTitle,
  isLive = true,
  participants = [],
  currentUserId = 'user1',
  streamUrl,
  onLeaveEvent,
  onToggleCamera,
  onToggleMic,
  onSendMessage,
  onReaction,
  showChat = true,
  showParticipants = true
}: VirtualEventViewerProps) {
  const [isMuted, setIsMuted] = React.useState(true);
  const [cameraOn, setCameraOn] = React.useState(false);
  const [isScreenSharing, setIsScreenSharing] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [volumeLevel, setVolumeLevel] = React.useState(75);
  const [chatMessage, setChatMessage] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'chat' | 'participants' | 'polls'>('chat');
  const [connectionQuality, setConnectionQuality] = React.useState<'excellent' | 'good' | 'poor'>('excellent');
  const [handRaised, setHandRaised] = React.useState(false);
  const [showReactions, setShowReactions] = React.useState(false);

  // Sample data
  const sampleParticipants: EventParticipant[] = [
    {
      id: 'host1',
      name: 'Marie Delacroix',
      avatar: '👩🏾‍🎨',
      role: 'host',
      isSpeaking: true,
      hasVideo: true,
      isMuted: false
    },
    {
      id: 'speaker1',
      name: 'Jean Baptiste',
      avatar: '👨🏾‍💼',
      role: 'speaker',
      hasVideo: true,
      isMuted: true
    },
    {
      id: 'user1',
      name: 'You',
      avatar: '🎭',
      role: 'attendee',
      hasVideo: cameraOn,
      isMuted: isMuted
    },
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `attendee${i}`,
      name: `Attendee ${i + 1}`,
      avatar: '👤',
      role: 'attendee' as const,
      isMuted: true,
      hasVideo: false
    }))
  ];

  const chatMessages: ChatMessage[] = [
    {
      id: '1',
      userId: 'system',
      userName: 'System',
      message: 'Welcome to the event! Please keep your microphone muted when not speaking.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'system'
    },
    {
      id: '2',
      userId: 'host1',
      userName: 'Marie Delacroix',
      message: 'Welcome everyone! We\'ll start in just a moment.',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: 'message',
      highlighted: true
    },
    {
      id: '3',
      userId: 'user2',
      userName: 'John Doe',
      message: 'Excited to be here!',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      type: 'message'
    },
    {
      id: '4',
      userId: 'user3',
      userName: 'Sarah Smith',
      message: 'Will there be a Q&A session?',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'question'
    },
    {
      id: '5',
      userId: 'host1',
      userName: 'Marie Delacroix',
      message: 'Yes! We\'ll have Q&A at the end.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'message',
      highlighted: true
    }
  ];

  const currentPoll: EventPoll = {
    id: 'poll1',
    question: 'What topic would you like to discuss next?',
    options: [
      { id: 'opt1', text: 'Content Creation Tips', votes: 45 },
      { id: 'opt2', text: 'Platform Updates', votes: 32 },
      { id: 'opt3', text: 'Success Stories', votes: 28 },
      { id: 'opt4', text: 'Q&A Session', votes: 67 }
    ],
    totalVotes: 172,
    userVoted: false
  };

  const allParticipants = participants.length > 0 ? participants : sampleParticipants;

  const handleToggleMic = () => {
    setIsMuted(!isMuted);
    onToggleMic?.();
  };

  const handleToggleCamera = () => {
    setCameraOn(!cameraOn);
    onToggleCamera?.();
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      onSendMessage?.(chatMessage);
      setChatMessage('');
    }
  };

  const handleReaction = (reaction: string) => {
    onReaction?.(reaction);
    setShowReactions(false);
    
    // Show floating reaction animation
    // This would be handled by a more complex animation system in production
  };

  const reactions = [
    { emoji: '👏', label: 'Clap' },
    { emoji: '❤️', label: 'Love' },
    { emoji: '🎉', label: 'Celebrate' },
    { emoji: '👍', label: 'Like' },
    { emoji: '🔥', label: 'Fire' },
    { emoji: '💯', label: 'Perfect' }
  ];

  const renderVideoGrid = () => {
    const speakers = allParticipants.filter(p => 
      p.role === 'host' || p.role === 'co-host' || p.role === 'speaker'
    );

    return (
      <div className="relative h-full bg-gray-900 rounded-lg overflow-hidden">
        {/* Main Video Area */}
        <div className="relative h-full flex items-center justify-center">
          {streamUrl ? (
            <video
              src={streamUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted={volumeLevel === 0}
            />
          ) : (
            <div className="text-center">
              <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Video stream will appear here</p>
            </div>
          )}

          {/* Live Badge */}
          {isLive && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-600 animate-pulse">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  LIVE
                </span>
              </Badge>
            </div>
          )}

          {/* Event Title */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-black/50 text-white">
              {eventTitle}
            </Badge>
          </div>

          {/* Speaker Overlay */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {speakers.slice(0, 3).map(speaker => (
              <div
                key={speaker.id}
                className="bg-black/50 backdrop-blur rounded-lg p-2 flex items-center gap-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={speaker.avatar} />
                  <AvatarFallback>{speaker.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <div className="text-sm font-medium">{speaker.name}</div>
                  <div className="text-xs opacity-75">{speaker.role}</div>
                </div>
                {speaker.isSpeaking && (
                  <div className="flex gap-0.5">
                    <span className="w-1 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-green-400 rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-green-400 rounded-full animate-pulse delay-150" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Connection Quality */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <Badge 
              variant="outline" 
              className={cn(
                "bg-black/50 border-none text-white",
                connectionQuality === 'excellent' && "text-green-400",
                connectionQuality === 'good' && "text-yellow-400",
                connectionQuality === 'poor' && "text-red-400"
              )}
            >
              <Wifi className="h-3 w-3 mr-1" />
              {connectionQuality}
            </Badge>
          </div>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={isMuted ? "secondary" : "default"}
                onClick={handleToggleMic}
                className="bg-black/50 backdrop-blur"
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant={cameraOn ? "default" : "secondary"}
                onClick={handleToggleCamera}
                className="bg-black/50 backdrop-blur"
              >
                {cameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant={isScreenSharing ? "default" : "secondary"}
                onClick={handleToggleScreenShare}
                className="bg-black/50 backdrop-blur"
              >
                {isScreenSharing ? <ScreenShareOff className="h-4 w-4" /> : <ScreenShare className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant={handRaised ? "default" : "secondary"}
                onClick={() => setHandRaised(!handRaised)}
                className="bg-black/50 backdrop-blur"
              >
                <Hand className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowReactions(!showReactions)}
                className="bg-black/50 backdrop-blur text-white"
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="bg-black/50 backdrop-blur text-white"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-black/50 backdrop-blur text-white"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onLeaveEvent}
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                Leave
              </Button>
            </div>
          </div>

          {/* Reactions Picker */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-2 left-0 bg-black/80 backdrop-blur rounded-lg p-2 flex gap-2"
              >
                {reactions.map(reaction => (
                  <button
                    key={reaction.emoji}
                    onClick={() => handleReaction(reaction.emoji)}
                    className="w-10 h-10 rounded hover:bg-white/20 flex items-center justify-center text-2xl transition-all hover:scale-110"
                  >
                    {reaction.emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderSidebar = () => (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button
              variant={activeTab === 'participants' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('participants')}
            >
              <Users className="h-4 w-4 mr-2" />
              People ({allParticipants.length})
            </Button>
            <Button
              variant={activeTab === 'polls' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('polls')}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Polls
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2",
                    msg.type === 'system' && "justify-center"
                  )}
                >
                  {msg.type === 'system' ? (
                    <div className="bg-gray-100 rounded-lg px-3 py-1 text-xs text-gray-600">
                      {msg.message}
                    </div>
                  ) : (
                    <>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{msg.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{msg.userName}</span>
                          {msg.highlighted && (
                            <Badge variant="secondary" className="text-xs">Host</Badge>
                          )}
                          {msg.type === 'question' && (
                            <Badge variant="outline" className="text-xs">Question</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{msg.message}</p>
                        <span className="text-xs text-gray-500">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Participants Tab */}
        {activeTab === 'participants' && (
          <div className="p-4 space-y-2 overflow-y-auto">
            {allParticipants.map(participant => (
              <div
                key={participant.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback>{participant.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{participant.name}</span>
                    {participant.role !== 'attendee' && (
                      <Badge variant="secondary" className="text-xs">
                        {participant.role}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  {participant.isMuted ? (
                    <MicOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Mic className="h-4 w-4 text-green-600" />
                  )}
                  {participant.hasVideo ? (
                    <Camera className="h-4 w-4 text-green-600" />
                  ) : (
                    <CameraOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Polls Tab */}
        {activeTab === 'polls' && (
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{currentPoll.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentPoll.options.map(option => {
                    const percentage = (option.votes / currentPoll.totalVotes) * 100;
                    return (
                      <div key={option.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{option.text}</span>
                          <span className="text-sm text-gray-500">{option.votes} votes</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
                {!currentPoll.userVoted && (
                  <Button className="w-full mt-4" size="sm">
                    Vote Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="h-screen bg-gray-100 p-4">
      <div className="h-full flex gap-4">
        {/* Main Video Area */}
        <div className="flex-1">
          {renderVideoGrid()}
        </div>

        {/* Sidebar */}
        {(showChat || showParticipants) && (
          <div className="w-96">
            {renderSidebar()}
          </div>
        )}
      </div>
    </div>
  );
}