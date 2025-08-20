'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  Bell,
  Mail,
  Smartphone,
  Monitor,
  Zap,
  Calendar,
  Star,
  Trophy,
  Video,
  Clock,
  Users,
  Settings,
  Plus,
  Send,
  Eye,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMinutes, addHours, addDays } from 'date-fns';

// Notification types from Phase 4.1.7 specification
export interface NotificationType {
  id: string;
  name: string;
  description: string;
  timing: string;
  channels: ('push' | 'email' | 'in-app')[];
  effectiveness: number; // percentage
  optInRate: number; // percentage
  icon: React.ComponentType<any>;
  color: string;
  isEnabled: boolean;
}

export const NOTIFICATION_TYPES: NotificationType[] = [
  {
    id: 'going-live',
    name: 'Going Live',
    description: 'Stream is starting now',
    timing: 'Instant',
    channels: ['push', 'in-app'],
    effectiveness: 85,
    optInRate: 92,
    icon: Video,
    color: 'bg-red-100 text-red-700 border-red-300',
    isEnabled: true
  },
  {
    id: 'starting-soon',
    name: 'Starting Soon',
    description: 'Stream begins in 15 minutes',
    timing: '15 min before',
    channels: ['push', 'email', 'in-app'],
    effectiveness: 78,
    optInRate: 88,
    icon: Clock,
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    isEnabled: true
  },
  {
    id: 'scheduled-stream',
    name: 'Scheduled Stream',
    description: 'Reminder for tomorrow\'s stream',
    timing: '1 day before',
    channels: ['email', 'in-app'],
    effectiveness: 65,
    optInRate: 75,
    icon: Calendar,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    isEnabled: true
  },
  {
    id: 'highlights',
    name: 'Highlights',
    description: 'Best moments from recent stream',
    timing: 'Post-stream',
    channels: ['email', 'in-app'],
    effectiveness: 70,
    optInRate: 82,
    icon: Star,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    isEnabled: true
  },
  {
    id: 'milestones',
    name: 'Milestones',
    description: 'Goal achievements during stream',
    timing: 'During stream',
    channels: ['push', 'in-app'],
    effectiveness: 88,
    optInRate: 95,
    icon: Trophy,
    color: 'bg-green-100 text-green-700 border-green-300',
    isEnabled: true
  }
];

// Notification channels configuration
export interface NotificationChannel {
  id: 'push' | 'email' | 'in-app';
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  deliveryRate: number; // percentage
  avgOpenRate: number; // percentage
  isEnabled: boolean;
  settings: {
    [key: string]: any;
  };
}

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  {
    id: 'push',
    name: 'Push Notifications',
    description: 'Instant mobile and browser notifications',
    icon: Smartphone,
    deliveryRate: 98,
    avgOpenRate: 15,
    isEnabled: true,
    settings: {
      sound: true,
      vibration: true,
      badge: true,
      quietHours: { start: '22:00', end: '08:00' }
    }
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Rich email notifications with previews',
    icon: Mail,
    deliveryRate: 99,
    avgOpenRate: 25,
    isEnabled: true,
    settings: {
      frequency: 'immediate',
      digest: false,
      richContent: true,
      unsubscribeLink: true
    }
  },
  {
    id: 'in-app',
    name: 'In-App',
    description: 'Notifications within the platform',
    icon: Monitor,
    deliveryRate: 100,
    avgOpenRate: 45,
    isEnabled: true,
    settings: {
      popup: true,
      banner: true,
      sound: false,
      persistence: 'until-read'
    }
  }
];

// Notification instance data structure
export interface NotificationInstance {
  id: string;
  type: string;
  title: string;
  content: string;
  channels: ('push' | 'email' | 'in-app')[];
  targetAudience: 'all' | 'subscribers' | 'interested' | 'custom';
  scheduledAt: Date;
  sentAt?: Date;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Notification preferences for users
export interface NotificationPreferences {
  userId: string;
  channels: {
    push: boolean;
    email: boolean;
    inApp: boolean;
  };
  types: {
    [key: string]: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  timezone: string;
}

interface NotificationSystemProps {
  notifications: NotificationInstance[];
  preferences?: NotificationPreferences;
  onSendNotification?: (notification: Omit<NotificationInstance, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdatePreferences?: (preferences: NotificationPreferences) => void;
  onToggleNotificationType?: (typeId: string, enabled: boolean) => void;
  onToggleChannel?: (channelId: string, enabled: boolean) => void;
  className?: string;
  variant?: 'creator' | 'viewer' | 'admin';
}

// Notification composer component
function NotificationComposer({
  onSend,
  onCancel
}: {
  onSend: (notification: Omit<NotificationInstance, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = React.useState({
    type: 'going-live',
    title: '',
    content: '',
    channels: ['push', 'in-app'] as ('push' | 'email' | 'in-app')[],
    targetAudience: 'all' as NotificationInstance['targetAudience'],
    scheduledAt: new Date()
  });

  const selectedType = NOTIFICATION_TYPES.find(type => type.id === formData.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const notification: Omit<NotificationInstance, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      status: 'scheduled',
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0
      }
    };
    
    onSend(notification);
  };

  const toggleChannel = (channel: 'push' | 'email' | 'in-app') => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notification Type */}
      <div className="space-y-2">
        <Label>Notification Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NOTIFICATION_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{type.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {type.timing}
                    </Badge>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {selectedType && (
          <p className="text-sm text-gray-600">{selectedType.description}</p>
        )}
      </div>

      {/* Title and Content */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Notification title..."
            required
          />
        </div>
        
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Notification message..."
            rows={3}
            required
          />
        </div>
      </div>

      {/* Channels */}
      <div className="space-y-2">
        <Label>Delivery Channels</Label>
        <div className="grid grid-cols-3 gap-3">
          {NOTIFICATION_CHANNELS.map((channel) => {
            const Icon = channel.icon;
            const isSelected = formData.channels.includes(channel.id);
            
            return (
              <Button
                key={channel.id}
                type="button"
                variant={isSelected ? "default" : "outline"}
                onClick={() => toggleChannel(channel.id)}
                className="h-auto p-3 flex flex-col items-center gap-2"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{channel.name}</span>
              </Button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500">
          Recommended: {selectedType?.channels.join(', ')}
        </p>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <Label>Target Audience</Label>
        <Select value={formData.targetAudience} onValueChange={(value: NotificationInstance['targetAudience']) => 
          setFormData(prev => ({ ...prev, targetAudience: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Followers</SelectItem>
            <SelectItem value="subscribers">Subscribers Only</SelectItem>
            <SelectItem value="interested">Interested in Stream</SelectItem>
            <SelectItem value="custom">Custom Segment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Send className="w-4 h-4 mr-2" />
          Send Notification
        </Button>
      </div>
    </form>
  );
}

// Notification metrics component
function NotificationMetrics({
  notifications
}: {
  notifications: NotificationInstance[];
}) {
  const totalSent = notifications.reduce((sum, n) => sum + n.metrics.sent, 0);
  const totalDelivered = notifications.reduce((sum, n) => sum + n.metrics.delivered, 0);
  const totalOpened = notifications.reduce((sum, n) => sum + n.metrics.opened, 0);
  const totalClicked = notifications.reduce((sum, n) => sum + n.metrics.clicked, 0);

  const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent * 100) : 0;
  const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered * 100) : 0;
  const clickRate = totalOpened > 0 ? (totalClicked / totalOpened * 100) : 0;

  const recentNotifications = notifications
    .filter(n => n.status === 'sent')
    .sort((a, b) => (b.sentAt?.getTime() || 0) - (a.sentAt?.getTime() || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold">{deliveryRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold">{openRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold">{clickRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold">{totalSent.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Send className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Types Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Type</CardTitle>
          <CardDescription>Effectiveness of different notification types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {NOTIFICATION_TYPES.map((type) => {
              const Icon = type.icon;
              const typeNotifications = notifications.filter(n => n.type === type.id);
              const typeSent = typeNotifications.reduce((sum, n) => sum + n.metrics.sent, 0);
              const typeOpened = typeNotifications.reduce((sum, n) => sum + n.metrics.opened, 0);
              const typeOpenRate = typeSent > 0 ? (typeOpened / typeSent * 100) : 0;

              return (
                <div key={type.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", type.color.replace('text-', 'text-').replace('border-', 'bg-').replace('-700', '-200'))}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-sm text-gray-600">{type.timing}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{typeOpenRate.toFixed(1)}%</div>
                      <div className="text-gray-500">Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{typeSent}</div>
                      <div className="text-gray-500">Sent</div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={cn(
                        typeOpenRate >= type.effectiveness ? 'border-green-500 text-green-700' : 'border-orange-500 text-orange-700'
                      )}
                    >
                      {typeOpenRate >= type.effectiveness ? 'On Target' : 'Below Target'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Latest notification activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">No notifications sent yet</p>
              </div>
            ) : (
              recentNotifications.map((notification) => {
                const type = NOTIFICATION_TYPES.find(t => t.id === notification.type);
                const Icon = type?.icon || Bell;
                
                return (
                  <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", type?.color || "bg-gray-100")}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-gray-600">
                          {notification.sentAt ? format(notification.sentAt, 'MMM d, HH:mm') : 'Scheduled'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{notification.metrics.sent}</div>
                        <div className="text-gray-500">Sent</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{notification.metrics.opened}</div>
                        <div className="text-gray-500">Opened</div>
                      </div>
                      <Badge 
                        variant="outline"
                        className={cn(
                          notification.status === 'sent' ? 'border-green-500 text-green-700' :
                          notification.status === 'failed' ? 'border-red-500 text-red-700' :
                          'border-blue-500 text-blue-700'
                        )}
                      >
                        {notification.status}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main notification system component
export function NotificationSystem({
  notifications,
  preferences,
  onSendNotification,
  onUpdatePreferences,
  onToggleNotificationType,
  onToggleChannel,
  className,
  variant = 'creator'
}: NotificationSystemProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'compose' | 'settings' | 'metrics'>('overview');
  const [showComposer, setShowComposer] = React.useState(false);

  const handleSendNotification = (notification: Omit<NotificationInstance, 'id' | 'createdAt' | 'updatedAt'>) => {
    onSendNotification?.(notification);
    setShowComposer(false);
  };

  const pendingNotifications = notifications.filter(n => n.status === 'scheduled');
  const sentNotifications = notifications.filter(n => n.status === 'sent');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification System</h2>
          <p className="text-gray-600">
            {variant === 'creator' 
              ? 'Engage your audience with strategic notifications'
              : 'Manage your notification preferences'
            }
          </p>
        </div>

        {variant === 'creator' && (
          <Button onClick={() => setShowComposer(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Notification
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          ...(variant === 'creator' ? [{ id: 'compose', label: 'Compose', icon: Edit }] : []),
          { id: 'settings', label: 'Settings', icon: Settings },
          ...(variant === 'creator' ? [{ id: 'metrics', label: 'Analytics', icon: BarChart3 }] : [])
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Types</p>
                      <p className="text-2xl font-bold">
                        {NOTIFICATION_TYPES.filter(t => t.isEnabled).length}
                      </p>
                    </div>
                    <Bell className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold">{pendingNotifications.length}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sent Today</p>
                      <p className="text-2xl font-bold">{sentNotifications.length}</p>
                    </div>
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Open Rate</p>
                      <p className="text-2xl font-bold">
                        {NOTIFICATION_TYPES.reduce((sum, t) => sum + t.effectiveness, 0) / NOTIFICATION_TYPES.length}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notification Types Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>Configure your notification strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {NOTIFICATION_TYPES.map((type) => {
                    const Icon = type.icon;
                    
                    return (
                      <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={cn("p-3 rounded-lg", type.color.replace('text-', 'text-').replace('border-', 'bg-').replace('-700', '-200'))}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{type.name}</h4>
                            <p className="text-sm text-gray-600">{type.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>Timing: {type.timing}</span>
                              <span>Effectiveness: {type.effectiveness}%</span>
                              <span>Opt-in Rate: {type.optInRate}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex gap-1">
                            {type.channels.map((channel) => {
                              const channelConfig = NOTIFICATION_CHANNELS.find(c => c.id === channel);
                              const ChannelIcon = channelConfig?.icon || Bell;
                              return (
                                <div key={channel} className="p-1 bg-gray-100 rounded" title={channelConfig?.name}>
                                  <ChannelIcon className="w-3 h-3" />
                                </div>
                              );
                            })}
                          </div>
                          
                          <Switch
                            checked={type.isEnabled}
                            onCheckedChange={(checked) => onToggleNotificationType?.(type.id, checked)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'metrics' && variant === 'creator' && (
          <NotificationMetrics notifications={notifications} />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Channel Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Configure delivery methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {NOTIFICATION_CHANNELS.map((channel) => {
                    const Icon = channel.icon;
                    
                    return (
                      <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{channel.name}</h4>
                            <p className="text-sm text-gray-600">{channel.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>Delivery Rate: {channel.deliveryRate}%</span>
                              <span>Avg. Open Rate: {channel.avgOpenRate}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <Switch
                          checked={channel.isEnabled}
                          onCheckedChange={(checked) => onToggleChannel?.(channel.id, checked)}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* User Preferences */}
            {preferences && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Preferences</CardTitle>
                  <CardDescription>Customize your notification experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Notification Channels</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            <span>Push Notifications</span>
                          </div>
                          <Switch checked={preferences.channels.push} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                          </div>
                          <Switch checked={preferences.channels.email} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            <span>In-App</span>
                          </div>
                          <Switch checked={preferences.channels.inApp} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Notification Types</h4>
                      <div className="space-y-3">
                        {NOTIFICATION_TYPES.map((type) => {
                          const Icon = type.icon;
                          return (
                            <div key={type.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span>{type.name}</span>
                              </div>
                              <Switch checked={preferences.types[type.id] !== false} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Notification Composer Dialog */}
      <Dialog open={showComposer} onOpenChange={setShowComposer}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Notification</DialogTitle>
            <DialogDescription>
              Send a targeted notification to your audience
            </DialogDescription>
          </DialogHeader>
          
          <NotificationComposer
            onSend={handleSendNotification}
            onCancel={() => setShowComposer(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}