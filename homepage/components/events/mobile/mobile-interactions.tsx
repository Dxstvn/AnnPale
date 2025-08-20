'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  MessageSquare,
  Mic,
  MicOff,
  Hand,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Star,
  Gift,
  Coffee,
  Clap,
  Fire,
  Zap,
  Send,
  Smile,
  Camera,
  Volume2,
  VolumeX,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  Users,
  Clock,
  AlertCircle,
  Play,
  Pause,
  CheckCircle,
  Eye,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickPoll {
  id: string;
  question: string;
  options: Array<{ id: string; text: string; votes: number }>;
  totalVotes: number;
  timeLeft: number;
  userVoted?: string;
}

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
  timestamp: number;
}

interface VoiceMessage {
  id: string;
  user: string;
  duration: number;
  waveform: number[];
  timestamp: Date;
  playing: boolean;
}

interface MobileInteractionsProps {
  isLive?: boolean;
  canInteract?: boolean;
  onSendMessage?: (message: string) => void;
  onReaction?: (emoji: string) => void;
  onVoiceMessage?: (audioBlob: Blob) => void;
  onRaiseHand?: () => void;
  onPollVote?: (pollId: string, optionId: string) => void;
}

export function MobileInteractions({
  isLive = true,
  canInteract = true,
  onSendMessage,
  onReaction,
  onVoiceMessage,
  onRaiseHand,
  onPollVote
}: MobileInteractionsProps) {
  const [showChat, setShowChat] = React.useState(false);
  const [showReactions, setShowReactions] = React.useState(false);
  const [showPoll, setShowPoll] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [handRaised, setHandRaised] = React.useState(false);
  const [floatingReactions, setFloatingReactions] = React.useState<FloatingReaction[]>([]);

  // Sample chat messages
  const [chatMessages, setChatMessages] = React.useState([
    { id: '1', user: 'Marie D.', message: 'Welcome everyone! 🎵', time: '2 min ago', verified: true },
    { id: '2', user: 'Jean P.', message: 'So excited for this session!', time: '1 min ago', verified: false },
    { id: '3', user: 'Sophia L.', message: 'Can you hear us clearly?', time: '30s ago', verified: false }
  ]);

  // Quick reactions
  const quickReactions = [
    { emoji: '👏', label: 'Clap', count: 245 },
    { emoji: '❤️', label: 'Love', count: 189 },
    { emoji: '🔥', label: 'Fire', count: 156 },
    { emoji: '👍', label: 'Like', count: 134 },
    { emoji: '⭐', label: 'Star', count: 98 },
    { emoji: '✨', label: 'Sparkle', count: 67 }
  ];

  // Extended reactions with categories
  const reactionCategories = [
    {
      name: 'Emotions',
      reactions: ['😀', '😍', '🤩', '😮', '😢', '😂', '🥰', '😎']
    },
    {
      name: 'Gestures',
      reactions: ['👏', '👍', '👌', '✋', '🙌', '🤝', '💪', '🤟']
    },
    {
      name: 'Objects',
      reactions: ['❤️', '🔥', '⭐', '✨', '🎵', '🎉', '🏆', '🎯']
    }
  ];

  // Sample poll
  const [currentPoll, setCurrentPoll] = React.useState<QuickPoll>({
    id: 'poll-1',
    question: 'What genre should we focus on next?',
    options: [
      { id: 'option-1', text: 'Traditional Haitian', votes: 45 },
      { id: 'option-2', text: 'Modern Fusion', votes: 38 },
      { id: 'option-3', text: 'Jazz Influenced', votes: 29 },
      { id: 'option-4', text: 'Pop Crossover', votes: 22 }
    ],
    totalVotes: 134,
    timeLeft: 45,
    userVoted: undefined
  });

  // Voice messages
  const [voiceMessages, setVoiceMessages] = React.useState<VoiceMessage[]>([
    {
      id: '1',
      user: 'Marcus T.',
      duration: 8,
      waveform: [0.2, 0.5, 0.8, 0.3, 0.6, 0.9, 0.4, 0.7, 0.1, 0.5],
      timestamp: new Date(Date.now() - 120000),
      playing: false
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        user: 'You',
        message: message.trim(),
        time: 'now',
        verified: false
      };
      setChatMessages(prev => [...prev, newMessage]);
      setMessage('');
      onSendMessage?.(message);
    }
  };

  const handleReaction = (emoji: string) => {
    // Add floating reaction
    const reaction: FloatingReaction = {
      id: Date.now().toString(),
      emoji,
      x: Math.random() * 100,
      y: Math.random() * 100,
      timestamp: Date.now()
    };
    setFloatingReactions(prev => [...prev, reaction]);

    // Remove after animation
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== reaction.id));
    }, 3000);

    onReaction?.(emoji);
  };

  const handleRaiseHand = () => {
    setHandRaised(!handRaised);
    onRaiseHand?.();
  };

  const handlePollVote = (optionId: string) => {
    if (currentPoll.userVoted) return;
    
    setCurrentPoll(prev => ({
      ...prev,
      userVoted: optionId,
      options: prev.options.map(option =>
        option.id === optionId
          ? { ...option, votes: option.votes + 1 }
          : option
      ),
      totalVotes: prev.totalVotes + 1
    }));
    
    onPollVote?.(currentPoll.id, optionId);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 59) {
          stopVoiceRecording();
          return 59;
        }
        return prev + 1;
      });
    }, 1000);

    // Auto-stop after 60 seconds
    setTimeout(() => {
      if (isRecording) {
        stopVoiceRecording();
      }
    }, 60000);
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    // Here you would handle the actual audio blob
    // onVoiceMessage?.(audioBlob);
  };

  // Poll countdown
  React.useEffect(() => {
    if (currentPoll.timeLeft > 0 && !currentPoll.userVoted) {
      const timer = setTimeout(() => {
        setCurrentPoll(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPoll.timeLeft, currentPoll.userVoted]);

  return (
    <div className="relative">
      {/* Floating Reactions */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <AnimatePresence>
          {floatingReactions.map((reaction) => (
            <motion.div
              key={reaction.id}
              initial={{ 
                opacity: 1, 
                scale: 1,
                x: `${reaction.x}%`,
                y: `${reaction.y}%`
              }}
              animate={{ 
                opacity: 0, 
                scale: 1.5,
                y: `${reaction.y - 50}%`
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute text-4xl"
              style={{ left: 0, top: 0 }}
            >
              {reaction.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Interaction Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40">
        <div className="flex items-center gap-2">
          {/* Chat Button */}
          <Button
            variant={showChat ? "default" : "outline"}
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="flex-1"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>

          {/* Quick Reactions Button */}
          <Button
            variant={showReactions ? "default" : "outline"}
            size="sm"
            onClick={() => setShowReactions(!showReactions)}
          >
            <Heart className="h-4 w-4" />
          </Button>

          {/* Raise Hand */}
          <Button
            variant={handRaised ? "default" : "outline"}
            size="sm"
            onClick={handleRaiseHand}
            className={handRaised ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          >
            <Hand className="h-4 w-4" />
          </Button>

          {/* Voice Message */}
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onMouseDown={startVoiceRecording}
            onMouseUp={stopVoiceRecording}
            onTouchStart={startVoiceRecording}
            onTouchEnd={stopVoiceRecording}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* More Options */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPoll(!showPoll)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="mt-2 flex items-center gap-2 text-red-600">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Recording: {recordingTime}s</span>
            <div className="flex-1 bg-red-100 rounded-full h-1">
              <div 
                className="bg-red-600 h-1 rounded-full transition-all"
                style={{ width: `${(recordingTime / 60) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed bottom-20 left-0 right-0 bg-white h-96 flex flex-col z-50 border-t shadow-lg"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Live Chat</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  487 online
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(false)}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
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

              {/* Voice Messages */}
              {voiceMessages.map((voice) => (
                <div key={voice.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{voice.user}</span>
                    <Badge variant="secondary" className="text-xs">
                      <Mic className="h-3 w-3 mr-1" />
                      {voice.duration}s
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    <div className="flex-1 flex items-center gap-1 h-8">
                      {voice.waveform.map((height, index) => (
                        <div
                          key={index}
                          className="bg-purple-600 w-1 rounded-full"
                          style={{ height: `${height * 20}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <Smile className="h-3 w-3" />
                  </Button>
                </div>
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Reactions Panel */}
      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 right-4 bg-white rounded-2xl shadow-lg border p-4 z-50"
          >
            <div className="grid grid-cols-3 gap-3 mb-4">
              {quickReactions.map((reaction) => (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  className="h-12 w-12 rounded-xl text-2xl hover:bg-gray-100"
                  onClick={() => handleReaction(reaction.emoji)}
                >
                  {reaction.emoji}
                </Button>
              ))}
            </div>

            {/* Extended Reactions */}
            <div className="space-y-3">
              {reactionCategories.map((category) => (
                <div key={category.name}>
                  <p className="text-xs font-medium text-gray-600 mb-2">{category.name}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {category.reactions.map((emoji) => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        className="h-8 w-8 text-lg p-0 hover:bg-gray-100"
                        onClick={() => handleReaction(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReactions(false)}
              className="w-full mt-3"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poll Panel */}
      <AnimatePresence>
        {showPoll && currentPoll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-4 right-4 bg-white rounded-xl shadow-lg border p-4 z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Quick Poll</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {currentPoll.timeLeft}s
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPoll(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-sm mb-4">{currentPoll.question}</p>

            <div className="space-y-2">
              {currentPoll.options.map((option) => {
                const percentage = currentPoll.totalVotes > 0 
                  ? (option.votes / currentPoll.totalVotes) * 100 
                  : 0;
                const isSelected = currentPoll.userVoted === option.id;
                
                return (
                  <Button
                    key={option.id}
                    variant={isSelected ? "default" : "outline"}
                    className="w-full justify-between h-auto p-3"
                    onClick={() => handlePollVote(option.id)}
                    disabled={!!currentPoll.userVoted || currentPoll.timeLeft === 0}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">{option.text}</span>
                      <div className="flex items-center gap-2">
                        {currentPoll.userVoted && (
                          <span className="text-xs">{percentage.toFixed(0)}%</span>
                        )}
                        {isSelected && <CheckCircle className="h-4 w-4" />}
                      </div>
                    </div>
                    {currentPoll.userVoted && (
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-purple-600 rounded-b"
                        style={{ width: `${percentage}%` }}
                      />
                    )}
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
              <span>{currentPoll.totalVotes} votes</span>
              {currentPoll.userVoted && (
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Your vote recorded
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interaction Status Indicators */}
      <div className="fixed top-4 right-4 space-y-2 z-40">
        {handRaised && (
          <Badge className="bg-yellow-500 text-white animate-pulse">
            <Hand className="h-3 w-3 mr-1" />
            Hand Raised
          </Badge>
        )}
        {isLive && (
          <Badge className="bg-red-600 text-white">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            LIVE
          </Badge>
        )}
      </div>
    </div>
  );
}