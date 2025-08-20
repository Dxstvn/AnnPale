'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
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
  BarChart3,
  Users,
  Eye,
  MessageSquare,
  Heart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  UserPlus,
  Activity,
  Shield,
  Ban,
  Clock3,
  Trash2,
  Pin,
  Star,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Settings,
  Filter,
  Search,
  RefreshCw,
  Download,
  Share2,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LiveMetrics,
  ModerationAction,
  ModerationTools,
  StreamGoal
} from '@/lib/types/creator-streaming';
import { ChatMessage } from '@/lib/types/live-viewer';

interface MetricsModerationProps {
  metrics: LiveMetrics;
  moderation: ModerationTools;
  goals: StreamGoal[];
  chatMessages: ChatMessage[];
  moderationActions: ModerationAction[];
  onModerateUser: (userId: string, action: ModerationAction['type'], duration?: number) => void;
  onModerateMessage: (messageId: string, action: 'delete' | 'pin' | 'highlight') => void;
  onUpdateModerationSettings: (settings: Partial<ModerationTools>) => void;
  onUpdateGoal: (goalId: string, current: number) => void;
  className?: string;
}

export function MetricsModeration({
  metrics,
  moderation,
  goals,
  chatMessages,
  moderationActions,
  onModerateUser,
  onModerateMessage,
  onUpdateModerationSettings,
  onUpdateGoal,
  className
}: MetricsModerationProps) {
  const [activeTab, setActiveTab] = useState('metrics');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('live');
  const [showModerationDialog, setShowModerationDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [banDuration, setBanDuration] = useState(60);
  const [newWordFilter, setNewWordFilter] = useState('');

  // Filter chat messages based on search
  const filteredMessages = chatMessages.filter(message =>
    message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Recent moderation actions (last 10)
  const recentActions = moderationActions.slice(-10).reverse();

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Handle moderation action
  const handleModerateUser = (action: ModerationAction['type']) => {
    if (!selectedUser) return;
    
    const duration = action === 'timeout' ? banDuration : undefined;
    onModerateUser(selectedUser, action, duration);
    setShowModerationDialog(false);
    setSelectedUser(null);
    setModerationReason('');
  };

  // Add word filter
  const addWordFilter = () => {
    if (newWordFilter.trim() && !moderation.wordFilters.includes(newWordFilter.trim())) {
      onUpdateModerationSettings({
        wordFilters: [...moderation.wordFilters, newWordFilter.trim()]
      });
      setNewWordFilter('');
    }
  };

  // Remove word filter
  const removeWordFilter = (word: string) => {
    onUpdateModerationSettings({
      wordFilters: moderation.wordFilters.filter(w => w !== word)
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Moderation</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your stream performance and manage your community
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="session">This Session</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Analytics</TabsTrigger>
          <TabsTrigger value="chat">Chat Monitor</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6 mt-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Current Viewers
                    </p>
                    <p className="text-2xl font-bold">{formatNumber(metrics.currentViewers)}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">Peak: {formatNumber(metrics.peakViewers)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Watch Time
                    </p>
                    <p className="text-2xl font-bold">{Math.round(metrics.averageWatchTime / 60)}m</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <span className="text-gray-600">
                    Retention: {metrics.retentionRate.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Engagement
                    </p>
                    <p className="text-2xl font-bold">{metrics.engagementRate.toFixed(1)}%</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-600">{formatNumber(metrics.chatMessages)} messages</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Earnings
                    </p>
                    <p className="text-2xl font-bold">${metrics.earnings.total}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <UserPlus className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">+{metrics.newFollowers} followers</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tips</span>
                    <span className="font-medium">${metrics.earnings.tips}</span>
                  </div>
                  <Progress value={(metrics.earnings.tips / metrics.earnings.total) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gifts</span>
                    <span className="font-medium">${metrics.earnings.gifts}</span>
                  </div>
                  <Progress value={(metrics.earnings.gifts / metrics.earnings.total) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Subscriptions</span>
                    <span className="font-medium">${metrics.earnings.subscriptions}</span>
                  </div>
                  <Progress value={(metrics.earnings.subscriptions / metrics.earnings.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stream Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Stream Duration</p>
                    <p className="font-medium">{Math.round(metrics.streamDuration / 60)} minutes</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Total Viewers</p>
                    <p className="font-medium">{formatNumber(metrics.totalViewers)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Reactions</p>
                    <p className="font-medium">{formatNumber(metrics.reactionsCount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Peak Concurrent</p>
                    <p className="font-medium">{formatNumber(metrics.peakViewers)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6 mt-6">
          {/* Chat Monitor Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search messages or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Badge variant="outline">
                {filteredMessages.length} messages
              </Badge>
            </div>

            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Chat Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Live Chat Monitor</CardTitle>
              <CardDescription>Monitor and moderate chat messages in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border',
                      message.type === 'super-chat' && 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
                      message.highlighted && 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    )}
                  >
                    <img
                      src={message.avatar}
                      alt={message.username}
                      className="w-8 h-8 rounded-full"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{message.displayName}</span>
                        {message.badges.map((badge) => (
                          <Badge key={badge} variant="outline" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <p className="text-sm break-words">{message.message}</p>
                      
                      {message.type === 'super-chat' && message.amount && (
                        <div className="mt-2 flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-yellow-600" />
                          <span className="text-xs font-medium text-yellow-600">
                            ${message.amount}
                          </span>
                        </div>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onModerateMessage(message.id, 'pin')}>
                          <Pin className="w-4 h-4 mr-2" />
                          Pin Message
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onModerateMessage(message.id, 'highlight')}>
                          <Star className="w-4 h-4 mr-2" />
                          Highlight
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onModerateMessage(message.id, 'delete')}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedUser(message.userId);
                            setShowModerationDialog(true);
                          }}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Moderate User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-6 mt-6">
          {/* Moderation Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Moderation</CardTitle>
                <CardDescription>Automatic content filtering and spam detection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Enable Auto-Moderation</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically moderate inappropriate content
                    </div>
                  </div>
                  <Switch
                    checked={moderation.autoModeration.enabled}
                    onCheckedChange={(checked) => 
                      onUpdateModerationSettings({
                        autoModeration: { ...moderation.autoModeration, enabled: checked }
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profanity Filter</span>
                    <Switch
                      checked={moderation.autoModeration.profanityFilter}
                      onCheckedChange={(checked) => 
                        onUpdateModerationSettings({
                          autoModeration: { ...moderation.autoModeration, profanityFilter: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Spam Detection</span>
                    <Switch
                      checked={moderation.autoModeration.spamDetection}
                      onCheckedChange={(checked) => 
                        onUpdateModerationSettings({
                          autoModeration: { ...moderation.autoModeration, spamDetection: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Link Protection</span>
                    <Switch
                      checked={moderation.autoModeration.linkProtection}
                      onCheckedChange={(checked) => 
                        onUpdateModerationSettings({
                          autoModeration: { ...moderation.autoModeration, linkProtection: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Caps Filter</span>
                    <Switch
                      checked={moderation.autoModeration.capsFilter}
                      onCheckedChange={(checked) => 
                        onUpdateModerationSettings({
                          autoModeration: { ...moderation.autoModeration, capsFilter: checked }
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chat Settings</CardTitle>
                <CardDescription>Control who can participate in chat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Slow Mode</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Limit message frequency
                    </div>
                  </div>
                  <Switch
                    checked={moderation.chatSettings.slowMode}
                    onCheckedChange={(checked) => 
                      onUpdateModerationSettings({
                        chatSettings: { ...moderation.chatSettings, slowMode: checked }
                      })
                    }
                  />
                </div>

                {moderation.chatSettings.slowMode && (
                  <div className="space-y-2">
                    <Label className="text-sm">Slow Mode Delay (seconds)</Label>
                    <Select
                      value={moderation.chatSettings.slowModeDelay.toString()}
                      onValueChange={(value) => 
                        onUpdateModerationSettings({
                          chatSettings: { 
                            ...moderation.chatSettings, 
                            slowModeDelay: parseInt(value) 
                          }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 seconds</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Subscribers Only</span>
                    <Switch
                      checked={moderation.chatSettings.subscribersOnly}
                      onCheckedChange={(checked) => 
                        onUpdateModerationSettings({
                          chatSettings: { ...moderation.chatSettings, subscribersOnly: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Followers Only</span>
                    <Switch
                      checked={moderation.chatSettings.followersOnly}
                      onCheckedChange={(checked) => 
                        onUpdateModerationSettings({
                          chatSettings: { ...moderation.chatSettings, followersOnly: checked }
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Word Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Word Filters</CardTitle>
              <CardDescription>Block specific words or phrases from chat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a word or phrase to filter..."
                  value={newWordFilter}
                  onChange={(e) => setNewWordFilter(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addWordFilter()}
                />
                <Button onClick={addWordFilter} disabled={!newWordFilter.trim()}>
                  Add Filter
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {moderation.wordFilters.map((word) => (
                  <Badge
                    key={word}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {word}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWordFilter(word)}
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
                
                {moderation.wordFilters.length === 0 && (
                  <p className="text-sm text-gray-500">No word filters added</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Moderation Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActions.map((action) => (
                  <div key={action.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Shield className="w-4 h-4 text-orange-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {action.type} action on user {action.userId}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {action.reason && `Reason: ${action.reason} • `}
                        {action.timestamp.toLocaleString()}
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {action.type}
                    </Badge>
                  </div>
                ))}
                
                {recentActions.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent moderation actions
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6 mt-6">
          {/* Active Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className={cn(
                goal.isCompleted && 'border-green-500 bg-green-50 dark:bg-green-900/20'
              )}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {goal.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Target className="w-5 h-5 text-blue-500" />
                      )}
                      <Badge variant={goal.isActive ? "default" : "secondary"}>
                        {goal.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.current} / {goal.target}</span>
                    </div>
                    <Progress 
                      value={(goal.current / goal.target) * 100} 
                      className="h-3"
                    />
                    <div className="text-xs text-gray-600 dark:text-gray-400 text-right">
                      {((goal.current / goal.target) * 100).toFixed(1)}% complete
                    </div>
                  </div>

                  {goal.reward && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Reward: {goal.reward}
                      </div>
                    </div>
                  )}

                  {goal.deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline: {goal.deadline.toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {goals.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Goals Set</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Set goals to engage your audience and track your progress
                </p>
                <Button>
                  <Zap className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Moderation Dialog */}
      <Dialog open={showModerationDialog} onOpenChange={setShowModerationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderate User</DialogTitle>
            <DialogDescription>
              Choose a moderation action for this user
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Textarea
                placeholder="Enter reason for moderation action..."
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleModerateUser('timeout')}
                className="flex-1"
              >
                <Clock3 className="w-4 h-4 mr-2" />
                Timeout
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleModerateUser('ban')}
                className="flex-1"
              >
                <Ban className="w-4 h-4 mr-2" />
                Ban
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Timeout Duration (minutes)</Label>
              <Select value={banDuration.toString()} onValueChange={(value) => setBanDuration(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="1440">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}