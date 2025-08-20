'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Send,
  Smile,
  Gift,
  MoreHorizontal,
  Pin,
  Flag,
  UserX,
  Crown,
  Star,
  Heart,
  Zap,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ChatMessage,
  ChatSettings,
  ViewerProfile,
  SuperChatMessage,
  ChatBadge,
  REACTION_TYPES
} from '@/lib/types/live-viewer';

interface LiveChatPanelProps {
  messages: ChatMessage[];
  settings: ChatSettings;
  userProfile: ViewerProfile;
  onSendMessage: (message: string) => void;
  onSuperChat: (message: string, amount: number) => void;
  onReaction: (reactionId: string) => void;
  onGift: (giftId: string) => void;
  onModerateMessage: (messageId: string, action: 'delete' | 'pin' | 'flag') => void;
  onUserAction: (userId: string, action: 'ban' | 'timeout' | 'mod') => void;
  className?: string;
}

export function LiveChatPanel({
  messages,
  settings,
  userProfile,
  onSendMessage,
  onSuperChat,
  onReaction,
  onGift,
  onModerateMessage,
  onUserAction,
  className
}: LiveChatPanelProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom unless user scrolled up
  useEffect(() => {
    if (!isScrolledUp && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isScrolledUp]);

  // Handle scroll detection
  const handleScroll = useCallback((event: any) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100;
    setIsScrolledUp(!isAtBottom);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !settings.enabled) return;
    
    onSendMessage(message.trim());
    setMessage('');
  }, [message, settings.enabled, onSendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const canSendMessage = () => {
    if (!settings.enabled) return false;
    if (settings.followersOnly && !userProfile.isFollowing) return false;
    if (settings.subscribersOnly && !userProfile.isSubscribed) return false;
    return true;
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStyle = (message: ChatMessage) => {
    if (message.type === 'super-chat') {
      const superChat = message as SuperChatMessage;
      const tierColors = {
        blue: 'bg-blue-500/20 border-blue-500',
        cyan: 'bg-cyan-500/20 border-cyan-500',
        green: 'bg-green-500/20 border-green-500',
        yellow: 'bg-yellow-500/20 border-yellow-500',
        orange: 'bg-orange-500/20 border-orange-500',
        magenta: 'bg-pink-500/20 border-pink-500',
        red: 'bg-red-500/20 border-red-500'
      };
      return tierColors[superChat.tier] || 'bg-blue-500/20 border-blue-500';
    }
    
    if (message.highlighted) {
      return 'bg-purple-500/20 border-purple-500';
    }
    
    if (message.isPinned) {
      return 'bg-yellow-500/20 border-yellow-500';
    }
    
    return '';
  };

  return (
    <div className={cn('flex flex-col h-full bg-white dark:bg-gray-900', className)}>
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Live Chat</h3>
          <div className="flex items-center gap-2">
            {settings.slowMode && (
              <Badge variant="secondary" className="text-xs">
                Slow {settings.slowModeDelay}s
              </Badge>
            )}
            {settings.followersOnly && (
              <Badge variant="secondary" className="text-xs">
                Followers
              </Badge>
            )}
            {settings.subscribersOnly && (
              <Badge variant="secondary" className="text-xs">
                Subscribers
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 p-4"
        onScrollCapture={handleScroll}
      >
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatMessageComponent
                key={msg.id}
                message={msg}
                userProfile={userProfile}
                onModerate={onModerateMessage}
                onUserAction={onUserAction}
                style={getMessageStyle(msg)}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {isScrolledUp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-4"
          >
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setIsScrolledUp(false);
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full shadow-lg"
            >
              New messages
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Reactions */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 overflow-x-auto">
          {REACTION_TYPES.slice(0, 6).map((reaction) => (
            <Button
              key={reaction.id}
              size="sm"
              variant="ghost"
              onClick={() => onReaction(reaction.id)}
              className="flex-shrink-0 text-lg hover:scale-110 transition-transform"
            >
              {reaction.emoji}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {canSendMessage() ? (
          <div className="space-y-3">
            {/* Super Chat Options */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Open super chat modal
                  console.log('Open super chat');
                }}
                className="flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Super Chat
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Open gift modal
                  console.log('Open gifts');
                }}
                className="flex items-center gap-2"
              >
                <Gift className="w-4 h-4" />
                Gift
              </Button>
            </div>

            {/* Message Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Say something nice..."
                  maxLength={settings.maxMessageLength}
                  className="pr-10"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 p-0"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Character Counter */}
            {message.length > settings.maxMessageLength * 0.8 && (
              <div className="text-xs text-gray-500 text-right">
                {message.length}/{settings.maxMessageLength}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-2">
              {!settings.enabled 
                ? 'Chat is disabled' 
                : settings.followersOnly && !userProfile.isFollowing
                ? 'Follow to chat'
                : settings.subscribersOnly && !userProfile.isSubscribed
                ? 'Subscribe to chat'
                : 'Chat unavailable'
              }
            </p>
            {(settings.followersOnly && !userProfile.isFollowing) && (
              <Button size="sm" variant="outline">
                Follow to Chat
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ChatMessageComponentProps {
  message: ChatMessage;
  userProfile: ViewerProfile;
  onModerate: (messageId: string, action: 'delete' | 'pin' | 'flag') => void;
  onUserAction: (userId: string, action: 'ban' | 'timeout' | 'mod') => void;
  style?: string;
}

function ChatMessageComponent({
  message,
  userProfile,
  onModerate,
  onUserAction,
  style
}: ChatMessageComponentProps) {
  const [showMenu, setShowMenu] = useState(false);
  const canModerate = userProfile.isModerator || userProfile.isVip;

  const renderBadges = (badges: ChatBadge[]) => {
    return badges.map((badge) => (
      <img
        key={badge.id}
        src={badge.image}
        alt={badge.name}
        title={badge.tooltip}
        className="w-4 h-4"
      />
    ));
  };

  const getMessageIcon = () => {
    switch (message.type) {
      case 'super-chat':
        return <DollarSign className="w-4 h-4 text-yellow-500" />;
      case 'donation':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'system':
        return <Zap className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors relative',
        style && `border-l-4 ${style}`,
        message.isPinned && 'border border-yellow-500/30'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.avatar} />
          <AvatarFallback className="text-xs">
            {message.displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1">
              {renderBadges(message.badges || [])}
              <span 
                className="font-medium text-sm truncate"
                style={{ color: message.color }}
              >
                {message.displayName}
              </span>
            </div>
            
            {getMessageIcon()}
            
            {message.isPinned && (
              <Pin className="w-3 h-3 text-yellow-500" />
            )}
            
            <span className="text-xs text-gray-500 ml-auto">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>

          {/* Super Chat Amount */}
          {message.type === 'super-chat' && message.amount && (
            <div className="text-sm font-semibold mb-1 text-green-600">
              ${message.amount}
            </div>
          )}

          {/* Message Text */}
          <div className="text-sm break-words">
            {message.message}
          </div>
        </div>

        {/* Message Menu */}
        {canModerate && (
          <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onModerate(message.id, 'pin')}>
                <Pin className="w-4 h-4 mr-2" />
                {message.isPinned ? 'Unpin' : 'Pin'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onModerate(message.id, 'delete')}>
                <UserX className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onModerate(message.id, 'flag')}>
                <Flag className="w-4 h-4 mr-2" />
                Flag
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUserAction(message.userId, 'timeout')}>
                <UserX className="w-4 h-4 mr-2" />
                Timeout User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUserAction(message.userId, 'ban')}>
                <UserX className="w-4 h-4 mr-2" />
                Ban User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.div>
  );
}

function formatTimestamp(timestamp: Date): string {
  return timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}