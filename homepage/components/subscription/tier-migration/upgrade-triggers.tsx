'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  Lock,
  Eye,
  Zap,
  Calendar,
  Users,
  AlertCircle,
  Crown,
  Star,
  Gift,
  Target,
  ChevronRight,
  Clock,
  Heart,
  ArrowUp,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  PlayCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface UpgradeTrigger {
  id: string;
  type: 'limit_reached' | 'exclusive_content' | 'feature_attempted' | 'promotion' | 'anniversary' | 'peer_influence';
  name: string;
  description: string;
  icon: React.ElementType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  triggerValue: number;
  currentValue: number;
  threshold: number;
  status: 'inactive' | 'approaching' | 'triggered' | 'acted_on';
  conversionRate: number;
  urgency: 'low' | 'medium' | 'high';
  targetTier: string;
  triggerData?: {
    feature?: string;
    content?: string;
    limit?: string;
    timeframe?: string;
  };
  lastTriggered?: Date;
}

interface TriggerContext {
  userId: string;
  currentTier: string;
  usage: {
    videosWatched: number;
    messagesReceived: number;
    liveSessionsAttended: number;
    exclusiveContentViewed: number;
  };
  limits: {
    videoLimit: number;
    messageLimit: number;
    liveLimit: number;
  };
  engagement: {
    frequency: number;
    duration: number;
    satisfaction: number;
  };
  social: {
    friendsWithHigherTier: number;
    recentUpgrades: number;
  };
}

interface UpgradeTriggersProps {
  context?: TriggerContext;
  triggers?: UpgradeTrigger[];
  onTriggerActivate?: (trigger: UpgradeTrigger) => void;
  onUpgradePrompt?: (trigger: UpgradeTrigger) => void;
  onDismissTrigger?: (triggerId: string) => void;
  autoPrompt?: boolean;
}

export function UpgradeTriggers({
  context,
  triggers = [],
  onTriggerActivate,
  onUpgradePrompt,
  onDismissTrigger,
  autoPrompt = true
}: UpgradeTriggersProps) {
  const [expandedTrigger, setExpandedTrigger] = React.useState<string | null>(null);
  const [dismissedTriggers, setDismissedTriggers] = React.useState<Set<string>>(new Set());
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Default context if not provided
  const defaultContext: TriggerContext = context || {
    userId: 'user_123',
    currentTier: 'bronze',
    usage: {
      videosWatched: 18,
      messagesReceived: 47,
      liveSessionsAttended: 3,
      exclusiveContentViewed: 5
    },
    limits: {
      videoLimit: 20,
      messageLimit: 50,
      liveLimit: 5
    },
    engagement: {
      frequency: 85,
      duration: 45,
      satisfaction: 4.2
    },
    social: {
      friendsWithHigherTier: 3,
      recentUpgrades: 2
    }
  };

  // Default triggers based on specification
  const defaultTriggers: UpgradeTrigger[] = triggers.length > 0 ? triggers : [
    {
      id: 'video_limit_reached',
      type: 'limit_reached',
      name: 'Video Limit Almost Reached',
      description: 'You\'ve watched 18 of 20 videos this month',
      icon: Eye,
      priority: 'high',
      triggerValue: 90,
      currentValue: defaultContext.usage.videosWatched,
      threshold: defaultContext.limits.videoLimit,
      status: 'triggered',
      conversionRate: 65,
      urgency: 'high',
      targetTier: 'silver',
      triggerData: {
        feature: 'Video watching',
        limit: '20 videos/month',
        timeframe: 'Monthly reset'
      },
      lastTriggered: new Date(currentTime - 2 * 60 * 60 * 1000)
    },
    {
      id: 'exclusive_content_viewed',
      type: 'exclusive_content',
      name: 'Exclusive Content Interest',
      description: 'Viewed 5 silver-tier exclusive content previews',
      icon: Lock,
      priority: 'medium',
      triggerValue: 5,
      currentValue: defaultContext.usage.exclusiveContentViewed,
      threshold: 3,
      status: 'triggered',
      conversionRate: 45,
      urgency: 'medium',
      targetTier: 'silver',
      triggerData: {
        content: 'Behind-the-scenes videos',
        timeframe: 'Last 7 days'
      },
      lastTriggered: new Date(currentTime - 4 * 60 * 60 * 1000)
    },
    {
      id: 'message_feature_attempted',
      type: 'feature_attempted',
      name: 'Premium Feature Attempted',
      description: 'Tried to send direct message (Silver+ feature)',
      icon: Zap,
      priority: 'urgent',
      triggerValue: 1,
      currentValue: 1,
      threshold: 1,
      status: 'triggered',
      conversionRate: 80,
      urgency: 'high',
      targetTier: 'silver',
      triggerData: {
        feature: 'Direct messaging',
        timeframe: 'Just now'
      },
      lastTriggered: new Date(currentTime - 30 * 60 * 1000)
    },
    {
      id: 'first_month_promotion',
      type: 'promotion',
      name: 'First Month Promotion',
      description: 'Special upgrade offer: 50% off first month',
      icon: Gift,
      priority: 'medium',
      triggerValue: 50,
      currentValue: 50,
      threshold: 1,
      status: 'approaching',
      conversionRate: 40,
      urgency: 'medium',
      targetTier: 'silver',
      triggerData: {
        timeframe: 'Expires in 3 days'
      }
    },
    {
      id: 'anniversary_milestone',
      type: 'anniversary',
      name: '3-Month Anniversary',
      description: 'Celebrating 3 months as a subscriber!',
      icon: Calendar,
      priority: 'low',
      triggerValue: 90,
      currentValue: 92,
      threshold: 90,
      status: 'triggered',
      conversionRate: 30,
      urgency: 'low',
      targetTier: 'silver',
      triggerData: {
        timeframe: '3 months subscriber'
      },
      lastTriggered: new Date(currentTime - 24 * 60 * 60 * 1000)
    },
    {
      id: 'peer_influence',
      type: 'peer_influence',
      name: 'Friends Have Upgraded',
      description: '3 friends recently upgraded to Silver tier',
      icon: Users,
      priority: 'medium',
      triggerValue: 3,
      currentValue: defaultContext.social.friendsWithHigherTier,
      threshold: 2,
      status: 'triggered',
      conversionRate: 35,
      urgency: 'medium',
      targetTier: 'silver',
      triggerData: {
        timeframe: 'Last 2 weeks'
      },
      lastTriggered: new Date(currentTime - 12 * 60 * 60 * 1000)
    }
  ];

  // Filter out dismissed triggers
  const activeTriggers = defaultTriggers.filter(trigger => !dismissedTriggers.has(trigger.id));

  // Get triggered triggers that need immediate attention
  const urgentTriggers = activeTriggers.filter(trigger => 
    trigger.status === 'triggered' && trigger.urgency === 'high'
  );

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered': return 'bg-red-100 text-red-700';
      case 'approaching': return 'bg-yellow-100 text-yellow-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'acted_on': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((currentTime - date.getTime()) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Handle dismiss trigger
  const handleDismissTrigger = (triggerId: string) => {
    setDismissedTriggers(prev => new Set([...prev, triggerId]));
    onDismissTrigger?.(triggerId);
  };

  // Calculate trigger score
  const calculateTriggerScore = (trigger: UpgradeTrigger) => {
    const progressScore = (trigger.currentValue / trigger.threshold) * 100;
    const priorityScore = { urgent: 100, high: 75, medium: 50, low: 25 }[trigger.priority] || 0;
    const conversionScore = trigger.conversionRate;
    return Math.round((progressScore + priorityScore + conversionScore) / 3);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Upgrade Triggers Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Active Triggers</p>
              <p className="text-2xl font-bold">{activeTriggers.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Urgent Actions</p>
              <p className="text-2xl font-bold text-red-600">{urgentTriggers.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Conversion</p>
              <p className="text-2xl font-bold">
                {Math.round(activeTriggers.reduce((sum, t) => sum + t.conversionRate, 0) / activeTriggers.length)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Current Tier</p>
              <Badge className="bg-bronze text-bronze-foreground">
                {defaultContext.currentTier.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Triggers Alert */}
      {urgentTriggers.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Urgent Upgrade Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentTriggers.map(trigger => (
                <div key={trigger.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <trigger.icon className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">{trigger.name}</p>
                      <p className="text-sm text-gray-600">{trigger.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onUpgradePrompt?.(trigger)}
                    >
                      Upgrade Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDismissTrigger(trigger.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Triggers List */}
      <div className="space-y-4">
        {activeTriggers.map(trigger => {
          const Icon = trigger.icon;
          const isExpanded = expandedTrigger === trigger.id;
          const triggerScore = calculateTriggerScore(trigger);
          const progressPercentage = Math.min((trigger.currentValue / trigger.threshold) * 100, 100);

          return (
            <Card key={trigger.id} className={cn(
              "transition-all",
              trigger.priority === 'urgent' && "border-red-300",
              trigger.status === 'triggered' && "bg-gradient-to-r from-yellow-50 to-orange-50"
            )}>
              <CardHeader 
                className="cursor-pointer"
                onClick={() => setExpandedTrigger(isExpanded ? null : trigger.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      trigger.status === 'triggered' ? "bg-red-100" : "bg-gray-100"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        trigger.status === 'triggered' ? "text-red-600" : "text-gray-600"
                      )} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{trigger.name}</h4>
                        <Badge className={cn("text-xs", getPriorityBadge(trigger.priority))}>
                          {trigger.priority}
                        </Badge>
                        <Badge className={cn("text-xs", getStatusColor(trigger.status))}>
                          {trigger.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{trigger.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{trigger.conversionRate}%</p>
                      <p className="text-xs text-gray-500">conversion</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Score: {triggerScore}</p>
                      <p className="text-xs text-gray-500">priority</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Trigger Progress</span>
                            <span className="text-sm font-medium">
                              {trigger.currentValue}/{trigger.threshold}
                            </span>
                          </div>
                          <Progress 
                            value={progressPercentage} 
                            className={cn(
                              "h-2",
                              progressPercentage >= 90 && "bg-red-200"
                            )}
                          />
                        </div>
                        
                        {/* Trigger Data */}
                        {trigger.triggerData && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-2">Trigger Details</p>
                              <div className="space-y-1 text-sm text-gray-600">
                                {trigger.triggerData.feature && (
                                  <p>Feature: {trigger.triggerData.feature}</p>
                                )}
                                {trigger.triggerData.content && (
                                  <p>Content: {trigger.triggerData.content}</p>
                                )}
                                {trigger.triggerData.limit && (
                                  <p>Limit: {trigger.triggerData.limit}</p>
                                )}
                                {trigger.triggerData.timeframe && (
                                  <p>Timeframe: {trigger.triggerData.timeframe}</p>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-2">Recommendation</p>
                              <div className="space-y-1 text-sm">
                                <p className="text-green-700">Target: {trigger.targetTier.toUpperCase()} tier</p>
                                <p className="text-blue-700">Expected conversion: {trigger.conversionRate}%</p>
                                {trigger.lastTriggered && (
                                  <p className="text-gray-600">
                                    Last triggered: {formatTimeAgo(trigger.lastTriggered)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => onUpgradePrompt?.(trigger)}
                            disabled={trigger.status !== 'triggered'}
                          >
                            <ArrowUp className="h-4 w-4 mr-1" />
                            Prompt Upgrade
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onTriggerActivate?.(trigger)}
                          >
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Activate
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDismissTrigger(trigger.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Usage Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Current Usage vs Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Videos Watched</span>
                <span className="text-sm text-gray-600">
                  {defaultContext.usage.videosWatched}/{defaultContext.limits.videoLimit}
                </span>
              </div>
              <Progress 
                value={(defaultContext.usage.videosWatched / defaultContext.limits.videoLimit) * 100} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Messages Received</span>
                <span className="text-sm text-gray-600">
                  {defaultContext.usage.messagesReceived}/{defaultContext.limits.messageLimit}
                </span>
              </div>
              <Progress 
                value={(defaultContext.usage.messagesReceived / defaultContext.limits.messageLimit) * 100} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Live Sessions</span>
                <span className="text-sm text-gray-600">
                  {defaultContext.usage.liveSessionsAttended}/{defaultContext.limits.liveLimit}
                </span>
              </div>
              <Progress 
                value={(defaultContext.usage.liveSessionsAttended / defaultContext.limits.liveLimit) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}