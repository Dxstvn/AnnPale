'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { 
  Bell,
  BellOff,
  Eye,
  EyeOff,
  Settings,
  Users,
  MessageSquare,
  Star,
  Hash,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  Check,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ThreadSubscription {
  id: string;
  threadId: string;
  threadTitle: string;
  category: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: 'member' | 'creator' | 'moderator' | 'admin';
  };
  subscribedAt: Date;
  lastActivity: Date;
  unreadCount: number;
  notificationLevel: 'all' | 'mentions' | 'important' | 'off';
  isBookmarked: boolean;
  tags: string[];
}

interface UserSubscription {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'member' | 'creator' | 'moderator' | 'admin';
  subscribedAt: Date;
  lastSeen: Date;
  notificationLevel: 'all' | 'posts' | 'important' | 'off';
  isFollowing: boolean;
}

interface SubscriptionSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  digestFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly' | 'off';
  mentionNotifications: boolean;
  replyNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface ThreadSubscriptionsProps {
  view?: 'threads' | 'users' | 'settings';
  onThreadClick?: (threadId: string) => void;
  onUserClick?: (userId: string) => void;
  onUnsubscribe?: (subscriptionId: string) => void;
  onUpdateNotificationLevel?: (subscriptionId: string, level: string) => void;
  onUpdateSettings?: (settings: SubscriptionSettings) => void;
}

export function ThreadSubscriptions({
  view = 'threads',
  onThreadClick,
  onUserClick,
  onUnsubscribe,
  onUpdateNotificationLevel,
  onUpdateSettings
}: ThreadSubscriptionsProps) {
  const [activeView, setActiveView] = React.useState(view);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [filterNotificationLevel, setFilterNotificationLevel] = React.useState('all');
  const [selectedSubscriptions, setSelectedSubscriptions] = React.useState<Set<string>>(new Set());

  // Sample thread subscriptions
  const threadSubscriptions: ThreadSubscription[] = [
    {
      id: 'sub1',
      threadId: 'thread1',
      threadTitle: 'Best places to visit in Port-au-Prince for first-time travelers',
      category: 'general',
      author: {
        id: 'user1',
        name: 'Jean Baptiste',
        avatar: '👨🏾‍💼',
        role: 'member'
      },
      subscribedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 23 * 60 * 1000),
      unreadCount: 3,
      notificationLevel: 'all',
      isBookmarked: true,
      tags: ['travel', 'port-au-prince', 'tourism']
    },
    {
      id: 'sub2',
      threadId: 'thread2',
      threadTitle: 'Learning Kreyòl as an adult - Tips and resources needed',
      category: 'culture-heritage',
      author: {
        id: 'user2',
        name: 'Marcus Thompson',
        avatar: '👨🏾‍🎓',
        role: 'member'
      },
      subscribedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
      unreadCount: 7,
      notificationLevel: 'mentions',
      isBookmarked: false,
      tags: ['kreyol', 'language-learning', 'culture']
    },
    {
      id: 'sub3',
      threadId: 'thread3',
      threadTitle: 'Behind the Scenes: Recording my latest video message',
      category: 'creator-spaces',
      author: {
        id: 'creator1',
        name: 'Marie Delacroix',
        avatar: '👩🏾‍🎨',
        role: 'creator'
      },
      subscribedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 45 * 60 * 1000),
      unreadCount: 0,
      notificationLevel: 'all',
      isBookmarked: true,
      tags: ['behind-scenes', 'creator-life']
    }
  ];

  // Sample user subscriptions
  const userSubscriptions: UserSubscription[] = [
    {
      id: 'usub1',
      userId: 'creator1',
      userName: 'Marie Delacroix',
      userAvatar: '👩🏾‍🎨',
      userRole: 'creator',
      subscribedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      notificationLevel: 'all',
      isFollowing: true
    },
    {
      id: 'usub2',
      userId: 'mod1',
      userName: 'Sophia Laurent',
      userAvatar: '👩🏾‍💻',
      userRole: 'moderator',
      subscribedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      notificationLevel: 'posts',
      isFollowing: true
    }
  ];

  // Default subscription settings
  const [settings, setSettings] = React.useState<SubscriptionSettings>({
    emailNotifications: true,
    pushNotifications: true,
    digestFrequency: 'daily',
    mentionNotifications: true,
    replyNotifications: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getNotificationIcon = (level: string, hasUnread: boolean = false) => {
    switch (level) {
      case 'all': return hasUnread ? <Bell className="h-4 w-4 text-blue-600" /> : <Bell className="h-4 w-4 text-gray-400" />;
      case 'mentions': return <Volume2 className="h-4 w-4 text-yellow-600" />;
      case 'important': return <Star className="h-4 w-4 text-purple-600" />;
      case 'off': return <BellOff className="h-4 w-4 text-gray-400" />;
      default: return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'moderator': return '🛡️';
      case 'creator': return '⭐';
      default: return null;
    }
  };

  const handleSelectSubscription = (subscriptionId: string) => {
    setSelectedSubscriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subscriptionId)) {
        newSet.delete(subscriptionId);
      } else {
        newSet.add(subscriptionId);
      }
      return newSet;
    });
  };

  const handleBulkAction = (action: 'unsubscribe' | 'mark_read' | 'update_level') => {
    selectedSubscriptions.forEach(subscriptionId => {
      if (action === 'unsubscribe') {
        onUnsubscribe?.(subscriptionId);
      }
    });
    setSelectedSubscriptions(new Set());
  };

  const filteredThreadSubscriptions = threadSubscriptions.filter(sub => {
    if (filterCategory !== 'all' && sub.category !== filterCategory) return false;
    if (filterNotificationLevel !== 'all' && sub.notificationLevel !== filterNotificationLevel) return false;
    return true;
  });

  const renderThreadSubscriptions = () => (
    <div className="space-y-4">
      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All Categories</option>
                      <option value="general">General Discussion</option>
                      <option value="creator-spaces">Creator Spaces</option>
                      <option value="culture-heritage">Culture & Heritage</option>
                      <option value="help-support">Help & Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notification Level</label>
                    <select
                      value={filterNotificationLevel}
                      onChange={(e) => setFilterNotificationLevel(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All Levels</option>
                      <option value="all">All Notifications</option>
                      <option value="mentions">Mentions Only</option>
                      <option value="important">Important Only</option>
                      <option value="off">No Notifications</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" onClick={() => {
                      setFilterCategory('all');
                      setFilterNotificationLevel('all');
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      {selectedSubscriptions.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedSubscriptions.size} subscription(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('mark_read')}>
                  <Check className="h-4 w-4 mr-1" />
                  Mark Read
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('unsubscribe')}>
                  <X className="h-4 w-4 mr-1" />
                  Unsubscribe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thread Subscriptions List */}
      <div className="space-y-3">
        {filteredThreadSubscriptions.map((subscription) => (
          <Card key={subscription.id} className={cn(
            "hover:shadow-md transition-all cursor-pointer",
            subscription.unreadCount > 0 && "border-l-4 border-l-blue-500 bg-blue-50/30"
          )}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Selection Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={selectedSubscriptions.has(subscription.id)}
                    onChange={() => handleSelectSubscription(subscription.id)}
                    className="rounded border-gray-300"
                  />
                </div>

                {/* Thread Info */}
                <div className="flex-1 min-w-0" onClick={() => onThreadClick?.(subscription.threadId)}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-1">
                      {subscription.threadTitle}
                    </h3>
                    <div className="flex items-center gap-2 ml-2">
                      {subscription.isBookmarked && (
                        <BookmarkCheck className="h-4 w-4 text-blue-600" />
                      )}
                      {subscription.unreadCount > 0 && (
                        <Badge variant="default" className="bg-blue-600">
                          {subscription.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Author & Category */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={subscription.author.avatar} />
                        <AvatarFallback className="text-xs">{subscription.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">{subscription.author.name}</span>
                      {getRoleIcon(subscription.author.role) && (
                        <span className="text-xs">{getRoleIcon(subscription.author.role)}</span>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {subscription.category}
                    </Badge>
                  </div>

                  {/* Tags */}
                  {subscription.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {subscription.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Hash className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {subscription.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{subscription.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Timing */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Subscribed {formatTimeAgo(subscription.subscribedAt)}</span>
                    <span>•</span>
                    <span>Last activity {formatTimeAgo(subscription.lastActivity)}</span>
                  </div>
                </div>

                {/* Notification Controls */}
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(subscription.notificationLevel, subscription.unreadCount > 0)}
                    <select
                      value={subscription.notificationLevel}
                      onChange={(e) => onUpdateNotificationLevel?.(subscription.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All</option>
                      <option value="mentions">Mentions</option>
                      <option value="important">Important</option>
                      <option value="off">Off</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnsubscribe?.(subscription.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredThreadSubscriptions.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No subscriptions found</h3>
          <p className="text-gray-600">Subscribe to threads to get notified of new replies!</p>
        </div>
      )}
    </div>
  );

  const renderUserSubscriptions = () => (
    <div className="space-y-4">
      {userSubscriptions.map((subscription) => (
        <Card key={subscription.id} className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-4" onClick={() => onUserClick?.(subscription.userId)}>
              <Avatar className="h-12 w-12">
                <AvatarImage src={subscription.userAvatar} />
                <AvatarFallback>{subscription.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold hover:text-purple-600 transition-colors">
                    {subscription.userName}
                  </h3>
                  {getRoleIcon(subscription.userRole) && (
                    <span className="text-sm">{getRoleIcon(subscription.userRole)}</span>
                  )}
                  <Badge variant="secondary" className="text-xs capitalize">
                    {subscription.userRole}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Following since {formatTimeAgo(subscription.subscribedAt)}</span>
                  <span>•</span>
                  <span>Last seen {formatTimeAgo(subscription.lastSeen)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getNotificationIcon(subscription.notificationLevel)}
                <select
                  value={subscription.notificationLevel}
                  onChange={(e) => onUpdateNotificationLevel?.(subscription.id, e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="all">All Posts</option>
                  <option value="posts">New Posts</option>
                  <option value="important">Important</option>
                  <option value="off">Off</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnsubscribe?.(subscription.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {userSubscriptions.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No user subscriptions</h3>
          <p className="text-gray-600">Follow creators and community members to stay updated!</p>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Email Notifications</label>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Push Notifications</label>
                <p className="text-sm text-gray-600">Receive browser push notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Mention Notifications</label>
                <p className="text-sm text-gray-600">Get notified when someone mentions you</p>
              </div>
              <Switch
                checked={settings.mentionNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, mentionNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Reply Notifications</label>
                <p className="text-sm text-gray-600">Get notified of replies to your posts</p>
              </div>
              <Switch
                checked={settings.replyNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, replyNotifications: checked }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="font-medium block">Digest Frequency</label>
            <select
              value={settings.digestFrequency}
              onChange={(e) => setSettings(prev => ({ ...prev, digestFrequency: e.target.value as any }))}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="immediate">Immediate</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="off">Off</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-medium">Quiet Hours</label>
              <Switch
                checked={settings.quietHours.enabled}
                onCheckedChange={(checked) => setSettings(prev => ({ 
                  ...prev, 
                  quietHours: { ...prev.quietHours, enabled: checked }
                }))}
              />
            </div>
            
            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, start: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, end: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <Button onClick={() => onUpdateSettings?.(settings)} className="w-full">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subscriptions</h2>
          <p className="text-gray-600">Manage your thread and user subscriptions</p>
        </div>
        <div className="flex items-center gap-2">
          {activeView === 'threads' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </Button>
          )}
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex border-b">
        {[
          { id: 'threads', label: 'Thread Subscriptions', icon: MessageSquare },
          { id: 'users', label: 'User Subscriptions', icon: Users },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border-b-2 transition-colors",
              activeView === id
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeView === 'threads' && renderThreadSubscriptions()}
        {activeView === 'users' && renderUserSubscriptions()}
        {activeView === 'settings' && renderSettings()}
      </div>
    </div>
  );
}