'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Shield,
  MessageSquare,
  Users,
  Ban,
  Clock,
  Flag,
  Pin,
  Trash2,
  Crown,
  Star,
  Heart,
  Gift,
  Zap,
  Settings,
  Filter,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  Smile,
  Send,
  MoreHorizontal,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Timer,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChatModerationSettings {
  profanityFilter: boolean;
  spamDetection: boolean;
  linkBlocking: boolean;
  repetitionLimits: boolean;
  rateLimiting: boolean;
  slowMode: boolean;
  slowModeDelay: number;
  followersOnly: boolean;
  subscribersOnly: boolean;
  wordBlacklist: string[];
  autoModeration: boolean;
  chatDelay: number;
  maxMessageLength: number;
  allowEmotes: boolean;
  allowMedia: boolean;
  allowMentions: boolean;
  allowLinks: boolean;
}

export interface ModerationAction {
  id: string;
  type: 'delete' | 'timeout' | 'ban' | 'pin' | 'highlight';
  userId: string;
  messageId?: string;
  reason: string;
  duration?: number;
  moderatorId: string;
  timestamp: Date;
}

export interface ChatUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  badges: string[];
  isFollowing: boolean;
  isSubscribed: boolean;
  isModerator: boolean;
  isVip: boolean;
  joinedDate: Date;
  messageCount: number;
  timeouts: number;
  lastMessage?: Date;
}

export interface EnhancedChatMessage {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'super-chat' | 'system' | 'welcome' | 'celebration';
  badges: string[];
  mentions: string[];
  emotes: Array<{ id: string; name: string; url: string }>;
  isModerated: boolean;
  isPinned: boolean;
  isHighlighted: boolean;
  amount?: number;
  color?: string;
  reactions: Record<string, number>;
  moderationFlags?: string[];
}

interface EnhancedChatSystemProps {
  messages: EnhancedChatMessage[];
  users: ChatUser[];
  settings: ChatModerationSettings;
  moderationActions: ModerationAction[];
  onSendMessage: (message: string) => void;
  onModerateMessage: (messageId: string, action: ModerationAction['type'], reason?: string) => void;
  onModerateUser: (userId: string, action: ModerationAction['type'], duration?: number, reason?: string) => void;
  onUpdateSettings: (settings: Partial<ChatModerationSettings>) => void;
  userRole: 'viewer' | 'moderator' | 'creator';
  className?: string;
}

export function EnhancedChatSystem({
  messages,
  users,
  settings,
  moderationActions,
  onSendMessage,
  onModerateMessage,
  onModerateUser,
  onUpdateSettings,
  userRole,
  className
}: EnhancedChatSystemProps) {
  const [activeTab, setActiveTab] = useState('chat');
  const [messageInput, setMessageInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'flagged' | 'super-chat'>('all');
  const [showModerationPanel, setShowModerationPanel] = useState(false);

  // Chat engagement metrics
  const chatMetrics = {
    totalMessages: messages.length,
    activeUsers: users.filter(u => u.lastMessage && Date.now() - u.lastMessage.getTime() < 300000).length,
    superChats: messages.filter(m => m.type === 'super-chat').length,
    moderationActions: moderationActions.length,
    averageMessageLength: messages.reduce((sum, m) => sum + m.message.length, 0) / messages.length || 0,
    engagementRate: (messages.filter(m => Object.keys(m.reactions).length > 0).length / messages.length) * 100 || 0
  };

  // Filter messages based on type
  const filteredMessages = messages.filter(message => {
    switch (filterType) {
      case 'flagged':
        return message.moderationFlags && message.moderationFlags.length > 0;
      case 'super-chat':
        return message.type === 'super-chat';
      default:
        return true;
    }
  });

  // Handle message send
  const handleSendMessage = useCallback(() => {
    if (messageInput.trim() && !settings.slowMode) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  }, [messageInput, settings.slowMode, onSendMessage]);

  // Auto-moderation checks
  const checkAutoModeration = useCallback((message: string): string[] => {
    const flags: string[] = [];
    
    if (settings.profanityFilter) {
      // Simulate profanity detection
      const profanityWords = ['spam', 'fake', 'scam'];
      if (profanityWords.some(word => message.toLowerCase().includes(word))) {
        flags.push('profanity');
      }
    }
    
    if (settings.spamDetection) {
      // Check for excessive capitalization
      if (message.length > 0 && message.split('').filter(c => c === c.toUpperCase()).length / message.length > 0.7) {
        flags.push('spam');
      }
    }
    
    if (settings.linkBlocking && message.includes('http')) {
      flags.push('link');
    }
    
    return flags;
  }, [settings]);

  return (
    <div className={cn('bg-white rounded-xl border shadow-sm', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Live Chat & Moderation
            </h2>
            {(userRole === 'creator' || userRole === 'moderator') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModerationPanel(!showModerationPanel)}
              >
                <Shield className="w-4 h-4 mr-2" />
                Moderation
              </Button>
            )}
          </div>

          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat">
              Chat ({chatMetrics.totalMessages})
            </TabsTrigger>
            <TabsTrigger value="users">
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="moderation">
              Moderation
            </TabsTrigger>
            <TabsTrigger value="settings">
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4">
          <TabsContent value="chat" className="space-y-4 m-0">
            {/* Chat Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{chatMetrics.activeUsers}</div>
                <div className="text-sm text-blue-600">Active Users</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{chatMetrics.superChats}</div>
                <div className="text-sm text-green-600">Super Chats</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{chatMetrics.engagementRate.toFixed(1)}%</div>
                <div className="text-sm text-purple-600">Engagement</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{chatMetrics.moderationActions}</div>
                <div className="text-sm text-orange-600">Mod Actions</div>
              </div>
            </div>

            {/* Message Filters */}
            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType as any}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="flagged">Flagged Messages</SelectItem>
                  <SelectItem value="super-chat">Super Chats</SelectItem>
                </SelectContent>
              </Select>
              
              {settings.slowMode && (
                <Badge className="bg-yellow-100 text-yellow-700">
                  <Timer className="w-3 h-3 mr-1" />
                  Slow Mode ({settings.slowModeDelay}s)
                </Badge>
              )}
              
              {settings.followersOnly && (
                <Badge className="bg-blue-100 text-blue-700">
                  <UserCheck className="w-3 h-3 mr-1" />
                  Followers Only
                </Badge>
              )}
            </div>

            {/* Chat Messages */}
            <ScrollArea className="h-96 border rounded-lg p-4">
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredMessages.map((message) => (
                    <ChatMessageComponent
                      key={message.id}
                      message={message}
                      userRole={userRole}
                      onModerate={onModerateMessage}
                      autoModerationFlags={checkAutoModeration(message.message)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={
                    settings.followersOnly ? "Follow to chat" :
                    settings.subscribersOnly ? "Subscribe to chat" :
                    "Type a message..."
                  }
                  disabled={settings.followersOnly || settings.subscribersOnly}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  maxLength={settings.maxMessageLength}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {messageInput.length}/{settings.maxMessageLength}
                </div>
              </div>
              <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 m-0">
            <div className="space-y-2">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  userRole={userRole}
                  onModerate={onModerateUser}
                  onSelect={setSelectedUser}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-4 m-0">
            <ModerationPanel
              actions={moderationActions}
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              userRole={userRole}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 m-0">
            <ChatSettingsPanel
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              userRole={userRole}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// Chat Message Component
interface ChatMessageComponentProps {
  message: EnhancedChatMessage;
  userRole: 'viewer' | 'moderator' | 'creator';
  onModerate: (messageId: string, action: ModerationAction['type'], reason?: string) => void;
  autoModerationFlags: string[];
}

function ChatMessageComponent({ message, userRole, onModerate, autoModerationFlags }: ChatMessageComponentProps) {
  const canModerate = userRole === 'creator' || userRole === 'moderator';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3 p-3 rounded-lg transition-colors',
        message.type === 'super-chat' && 'bg-yellow-50 border border-yellow-200',
        message.isHighlighted && 'bg-blue-50 border border-blue-200',
        autoModerationFlags.length > 0 && 'bg-red-50 border border-red-200'
      )}
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={message.avatar} />
        <AvatarFallback className="text-xs">
          {message.displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{message.displayName}</span>
          {message.badges.map((badge) => (
            <Badge key={badge} variant="outline" className="text-xs px-1">
              {badge}
            </Badge>
          ))}
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString()}
          </span>
          {autoModerationFlags.length > 0 && (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
        </div>
        
        <p className="text-sm">{message.message}</p>
        
        {message.type === 'super-chat' && message.amount && (
          <div className="mt-2 flex items-center gap-2">
            <Badge className="bg-yellow-500 text-white">
              <Gift className="w-3 h-3 mr-1" />
              ${message.amount}
            </Badge>
          </div>
        )}
      </div>

      {canModerate && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onModerate(message.id, 'pin')}>
              <Pin className="w-4 h-4 mr-2" />
              Pin Message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onModerate(message.id, 'highlight')}>
              <Star className="w-4 h-4 mr-2" />
              Highlight
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onModerate(message.id, 'delete')}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </motion.div>
  );
}

// User Card Component
interface UserCardProps {
  user: ChatUser;
  userRole: 'viewer' | 'moderator' | 'creator';
  onModerate: (userId: string, action: ModerationAction['type'], duration?: number, reason?: string) => void;
  onSelect: (user: ChatUser) => void;
}

function UserCard({ user, userRole, onModerate, onSelect }: UserCardProps) {
  const canModerate = userRole === 'creator' || userRole === 'moderator';

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="text-xs">
            {user.displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{user.displayName}</span>
            {user.isModerator && <Crown className="w-3 h-3 text-yellow-500" />}
            {user.isVip && <Star className="w-3 h-3 text-purple-500" />}
            {user.isSubscribed && <Heart className="w-3 h-3 text-red-500" />}
          </div>
          <div className="text-xs text-gray-500">
            {user.messageCount} messages • {user.timeouts} timeouts
          </div>
        </div>
      </div>

      {canModerate && !user.isModerator && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onModerate(user.id, 'timeout', 300)}>
              <Clock className="w-4 h-4 mr-2" />
              Timeout (5m)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onModerate(user.id, 'ban')}>
              <Ban className="w-4 h-4 mr-2" />
              Ban User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

// Moderation Panel
interface ModerationPanelProps {
  actions: ModerationAction[];
  settings: ChatModerationSettings;
  onUpdateSettings: (settings: Partial<ChatModerationSettings>) => void;
  userRole: 'viewer' | 'moderator' | 'creator';
}

function ModerationPanel({ actions, settings, onUpdateSettings, userRole }: ModerationPanelProps) {
  const canModerate = userRole === 'creator' || userRole === 'moderator';

  if (!canModerate) {
    return <div className="text-center text-gray-500">Access restricted to moderators</div>;
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            onClick={() => onUpdateSettings({ slowMode: !settings.slowMode })}
            className={settings.slowMode ? 'bg-yellow-50 border-yellow-200' : ''}
          >
            <Timer className="w-4 h-4 mr-2" />
            Slow Mode
          </Button>
          <Button
            variant="outline"
            onClick={() => onUpdateSettings({ followersOnly: !settings.followersOnly })}
            className={settings.followersOnly ? 'bg-blue-50 border-blue-200' : ''}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Followers Only
          </Button>
          <Button
            variant="outline"
            onClick={() => onUpdateSettings({ subscribersOnly: !settings.subscribersOnly })}
            className={settings.subscribersOnly ? 'bg-purple-50 border-purple-200' : ''}
          >
            <Crown className="w-4 h-4 mr-2" />
            Subs Only
          </Button>
          <Button variant="outline">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
        </CardContent>
      </Card>

      {/* Recent Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Moderation Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actions.slice(0, 10).map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    action.type === 'ban' && 'bg-red-500',
                    action.type === 'timeout' && 'bg-yellow-500',
                    action.type === 'delete' && 'bg-orange-500'
                  )} />
                  <div>
                    <div className="font-medium text-sm">{action.type.toUpperCase()}</div>
                    <div className="text-xs text-gray-500">{action.reason}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {action.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Chat Settings Panel
interface ChatSettingsPanelProps {
  settings: ChatModerationSettings;
  onUpdateSettings: (settings: Partial<ChatModerationSettings>) => void;
  userRole: 'viewer' | 'moderator' | 'creator';
}

function ChatSettingsPanel({ settings, onUpdateSettings, userRole }: ChatSettingsPanelProps) {
  const canModerate = userRole === 'creator' || userRole === 'moderator';

  return (
    <div className="space-y-6">
      {/* Automated Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Automated Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Profanity Filter</div>
                <div className="text-sm text-gray-500">Block inappropriate language</div>
              </div>
              <Switch
                checked={settings.profanityFilter}
                onCheckedChange={(checked) => onUpdateSettings({ profanityFilter: checked })}
                disabled={!canModerate}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Spam Detection</div>
                <div className="text-sm text-gray-500">Detect repetitive messages</div>
              </div>
              <Switch
                checked={settings.spamDetection}
                onCheckedChange={(checked) => onUpdateSettings({ spamDetection: checked })}
                disabled={!canModerate}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Link Blocking</div>
                <div className="text-sm text-gray-500">Block external links</div>
              </div>
              <Switch
                checked={settings.linkBlocking}
                onCheckedChange={(checked) => onUpdateSettings({ linkBlocking: checked })}
                disabled={!canModerate}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Rate Limiting</div>
                <div className="text-sm text-gray-500">Limit message frequency</div>
              </div>
              <Switch
                checked={settings.rateLimiting}
                onCheckedChange={(checked) => onUpdateSettings({ rateLimiting: checked })}
                disabled={!canModerate}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Behavior */}
      <Card>
        <CardHeader>
          <CardTitle>Chat Behavior Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Slow Mode Delay (seconds)</label>
              <Input
                type="number"
                value={settings.slowModeDelay}
                onChange={(e) => onUpdateSettings({ slowModeDelay: parseInt(e.target.value) || 0 })}
                min="0"
                max="300"
                disabled={!canModerate}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Message Length</label>
              <Input
                type="number"
                value={settings.maxMessageLength}
                onChange={(e) => onUpdateSettings({ maxMessageLength: parseInt(e.target.value) || 500 })}
                min="50"
                max="2000"
                disabled={!canModerate}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Chat Delay (seconds)</label>
              <Input
                type="number"
                value={settings.chatDelay}
                onChange={(e) => onUpdateSettings({ chatDelay: parseInt(e.target.value) || 0 })}
                min="0"
                max="60"
                disabled={!canModerate}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Allow Emotes</div>
                <div className="text-sm text-gray-500">Enable emoji reactions</div>
              </div>
              <Switch
                checked={settings.allowEmotes}
                onCheckedChange={(checked) => onUpdateSettings({ allowEmotes: checked })}
                disabled={!canModerate}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Allow Media</div>
                <div className="text-sm text-gray-500">Enable image sharing</div>
              </div>
              <Switch
                checked={settings.allowMedia}
                onCheckedChange={(checked) => onUpdateSettings({ allowMedia: checked })}
                disabled={!canModerate}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Allow Mentions</div>
                <div className="text-sm text-gray-500">Enable @username mentions</div>
              </div>
              <Switch
                checked={settings.allowMentions}
                onCheckedChange={(checked) => onUpdateSettings({ allowMentions: checked })}
                disabled={!canModerate}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Allow Links</div>
                <div className="text-sm text-gray-500">Enable link sharing</div>
              </div>
              <Switch
                checked={settings.allowLinks}
                onCheckedChange={(checked) => onUpdateSettings({ allowLinks: checked })}
                disabled={!canModerate}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}