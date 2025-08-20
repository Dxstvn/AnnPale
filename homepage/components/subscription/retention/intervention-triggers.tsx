'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Zap,
  AlertCircle,
  TrendingDown,
  LogOut,
  CreditCard,
  HeadphonesIcon,
  MousePointer,
  XCircle,
  Clock,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Video,
  Gift,
  DollarSign,
  Settings,
  PlayCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface InterventionTrigger {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'engagement' | 'payment' | 'support' | 'navigation';
  condition: string;
  threshold: number;
  currentValue: number;
  status: 'active' | 'triggered' | 'resolved' | 'disabled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  intervention: {
    type: string;
    channel: string;
    message: string;
    automation: boolean;
  };
  lastTriggered?: Date;
  successRate: number;
}

interface InterventionHistory {
  id: string;
  triggerId: string;
  timestamp: Date;
  action: string;
  result: 'success' | 'failed' | 'pending';
  notes?: string;
}

interface InterventionTriggersProps {
  triggers?: InterventionTrigger[];
  history?: InterventionHistory[];
  onTriggerActivate?: (trigger: InterventionTrigger) => void;
  onTriggerConfigure?: (trigger: InterventionTrigger) => void;
  onManualIntervention?: (type: string) => void;
  showAutomation?: boolean;
}

export function InterventionTriggers({
  triggers = [],
  history = [],
  onTriggerActivate,
  onTriggerConfigure,
  onManualIntervention,
  showAutomation = true
}: InterventionTriggersProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [automationEnabled, setAutomationEnabled] = React.useState(true);
  const [expandedTrigger, setExpandedTrigger] = React.useState<string | null>(null);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Sample triggers
  const defaultTriggers: InterventionTrigger[] = triggers.length > 0 ? triggers : [
    {
      id: 'engagement_drop',
      name: '30% Engagement Drop',
      description: 'User engagement decreased by 30% in the last week',
      icon: TrendingDown,
      category: 'engagement',
      condition: 'engagement_score < previous_week * 0.7',
      threshold: 30,
      currentValue: 42,
      status: 'triggered',
      priority: 'high',
      intervention: {
        type: 'email',
        channel: 'Email',
        message: 'We miss you! Here\'s what you\'ve been missing...',
        automation: true
      },
      lastTriggered: new Date(currentTime - 2 * 24 * 60 * 60 * 1000),
      successRate: 65
    },
    {
      id: 'no_login_2months',
      name: '2 Months No Login',
      description: 'User hasn\'t logged in for 60+ days',
      icon: LogOut,
      category: 'engagement',
      condition: 'days_since_login >= 60',
      threshold: 60,
      currentValue: 45,
      status: 'active',
      priority: 'critical',
      intervention: {
        type: 'multi_channel',
        channel: 'Email + SMS',
        message: 'Special offer: Come back and get 50% off next month',
        automation: true
      },
      successRate: 45
    },
    {
      id: 'payment_failure',
      name: 'Payment Failed',
      description: 'Subscription payment failed to process',
      icon: CreditCard,
      category: 'payment',
      condition: 'payment_status === failed',
      threshold: 1,
      currentValue: 1,
      status: 'triggered',
      priority: 'critical',
      intervention: {
        type: 'email',
        channel: 'Email + In-app',
        message: 'Payment issue - Update your payment method to continue',
        automation: true
      },
      lastTriggered: new Date(currentTime - 1 * 24 * 60 * 60 * 1000),
      successRate: 70
    },
    {
      id: 'support_complaint',
      name: 'Support Complaint',
      description: 'User submitted a support complaint',
      icon: HeadphonesIcon,
      category: 'support',
      condition: 'support_ticket_sentiment === negative',
      threshold: 1,
      currentValue: 1,
      status: 'triggered',
      priority: 'high',
      intervention: {
        type: 'personal',
        channel: 'Phone',
        message: 'Personal call from support team',
        automation: false
      },
      lastTriggered: new Date(currentTime - 3 * 24 * 60 * 60 * 1000),
      successRate: 80
    },
    {
      id: 'downgrade_attempt',
      name: 'Downgrade Attempted',
      description: 'User visited downgrade page',
      icon: TrendingDown,
      category: 'navigation',
      condition: 'visited_page === /subscription/downgrade',
      threshold: 1,
      currentValue: 2,
      status: 'triggered',
      priority: 'medium',
      intervention: {
        type: 'offer',
        channel: 'In-app',
        message: 'Keep your current plan and get 20% off',
        automation: true
      },
      lastTriggered: new Date(currentTime - 5 * 24 * 60 * 60 * 1000),
      successRate: 55
    },
    {
      id: 'cancel_click',
      name: 'Cancel Button Clicked',
      description: 'User clicked cancel subscription button',
      icon: XCircle,
      category: 'navigation',
      condition: 'clicked_element === cancel_subscription',
      threshold: 1,
      currentValue: 1,
      status: 'triggered',
      priority: 'critical',
      intervention: {
        type: 'retention_offer',
        channel: 'Modal',
        message: 'Wait! Here\'s a special offer just for you',
        automation: true
      },
      lastTriggered: new Date(currentTime - 12 * 60 * 60 * 1000),
      successRate: 40
    }
  ];

  // Sample history
  const defaultHistory: InterventionHistory[] = history.length > 0 ? history : [
    {
      id: 'hist_1',
      triggerId: 'engagement_drop',
      timestamp: new Date(currentTime - 2 * 24 * 60 * 60 * 1000),
      action: 'Sent re-engagement email',
      result: 'success'
    },
    {
      id: 'hist_2',
      triggerId: 'payment_failure',
      timestamp: new Date(currentTime - 1 * 24 * 60 * 60 * 1000),
      action: 'Payment retry initiated',
      result: 'pending'
    },
    {
      id: 'hist_3',
      triggerId: 'cancel_click',
      timestamp: new Date(currentTime - 12 * 60 * 60 * 1000),
      action: 'Retention offer presented',
      result: 'failed',
      notes: 'User proceeded with cancellation'
    }
  ];

  // Filter triggers by category
  const filteredTriggers = selectedCategory === 'all' 
    ? defaultTriggers 
    : defaultTriggers.filter(t => t.category === selectedCategory);

  // Count active triggers
  const activeTriggers = defaultTriggers.filter(t => t.status === 'triggered').length;
  const criticalTriggers = defaultTriggers.filter(t => t.status === 'triggered' && t.priority === 'critical').length;

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700';
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
      case 'active': return 'bg-green-100 text-green-700';
      case 'resolved': return 'bg-blue-100 text-blue-700';
      case 'disabled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((currentTime - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Intervention Triggers System
            </CardTitle>
            {showAutomation && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Automation</label>
                <Switch
                  checked={automationEnabled}
                  onCheckedChange={setAutomationEnabled}
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Active Triggers</p>
              <p className="text-2xl font-bold">{activeTriggers}</p>
              {criticalTriggers > 0 && (
                <Badge className="bg-red-100 text-red-700 text-xs mt-1">
                  {criticalTriggers} critical
                </Badge>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Success Rate</p>
              <p className="text-2xl font-bold">
                {Math.round(defaultTriggers.reduce((sum, t) => sum + t.successRate, 0) / defaultTriggers.length)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Interventions Today</p>
              <p className="text-2xl font-bold">
                {defaultHistory.filter(h => 
                  h.timestamp.toDateString() === new Date(currentTime).toDateString()
                ).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Automation Status</p>
              <Badge className={automationEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {automationEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {criticalTriggers > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Critical Interventions Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {defaultTriggers
                .filter(t => t.status === 'triggered' && t.priority === 'critical')
                .map(trigger => (
                  <div key={trigger.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <trigger.icon className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">{trigger.name}</p>
                        <p className="text-sm text-gray-600">{trigger.description}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onTriggerActivate?.(trigger)}
                    >
                      Take Action
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex gap-2">
        {['all', 'engagement', 'payment', 'support', 'navigation'].map(category => (
          <Button
            key={category}
            size="sm"
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
            {category !== 'all' && (
              <Badge className="ml-2 text-xs" variant="secondary">
                {defaultTriggers.filter(t => t.category === category && t.status === 'triggered').length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Triggers List */}
      <div className="space-y-4">
        {filteredTriggers.map(trigger => {
          const Icon = trigger.icon;
          const isExpanded = expandedTrigger === trigger.id;
          const progressPercentage = (trigger.currentValue / trigger.threshold) * 100;
          
          return (
            <Card key={trigger.id} className={cn(
              "transition-all",
              trigger.status === 'triggered' && trigger.priority === 'critical' && "border-red-300"
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
                    {trigger.intervention.automation && (
                      <Badge variant="outline" className="text-xs">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Automated
                      </Badge>
                    )}
                    <div className="text-right">
                      <p className="text-sm font-medium">{trigger.successRate}%</p>
                      <p className="text-xs text-gray-500">success rate</p>
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
                        {/* Trigger Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Trigger Progress</span>
                            <span className="text-sm font-medium">
                              {trigger.currentValue}/{trigger.threshold}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(progressPercentage, 100)} 
                            className={cn(
                              "h-2",
                              progressPercentage >= 100 && "bg-red-200"
                            )}
                          />
                        </div>
                        
                        {/* Condition */}
                        <div className="p-3 bg-gray-50 rounded text-sm font-mono">
                          {trigger.condition}
                        </div>
                        
                        {/* Intervention Details */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-2">Intervention</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span>Channel: {trigger.intervention.channel}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MessageSquare className="h-4 w-4 text-gray-500" />
                                <span>Type: {trigger.intervention.type}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-2">Message</p>
                            <p className="text-sm text-gray-600">
                              {trigger.intervention.message}
                            </p>
                          </div>
                        </div>
                        
                        {/* Last Triggered */}
                        {trigger.lastTriggered && (
                          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                            <span className="text-sm">Last triggered</span>
                            <span className="text-sm font-medium">
                              {formatTimeAgo(trigger.lastTriggered)}
                            </span>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => onTriggerActivate?.(trigger)}
                            disabled={trigger.status !== 'triggered'}
                          >
                            Execute Intervention
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onTriggerConfigure?.(trigger)}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
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

      {/* Manual Interventions */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Interventions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { type: 'email', icon: Mail, label: 'Send Email' },
              { type: 'message', icon: MessageSquare, label: 'In-App Message' },
              { type: 'call', icon: Phone, label: 'Phone Call' },
              { type: 'video', icon: Video, label: 'Video Message' },
              { type: 'offer', icon: Gift, label: 'Special Offer' },
              { type: 'discount', icon: DollarSign, label: 'Apply Discount' }
            ].map(item => (
              <Button
                key={item.type}
                variant="outline"
                onClick={() => onManualIntervention?.(item.type)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent History */}
      <Card>
        <CardHeader>
          <CardTitle>Intervention History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {defaultHistory.map(item => {
              const trigger = defaultTriggers.find(t => t.id === item.triggerId);
              
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      item.result === 'success' && "bg-green-100",
                      item.result === 'failed' && "bg-red-100",
                      item.result === 'pending' && "bg-yellow-100"
                    )}>
                      {item.result === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {item.result === 'failed' && <XCircle className="h-4 w-4 text-red-600" />}
                      {item.result === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                    </div>
                    
                    <div>
                      <p className="font-medium text-sm">{item.action}</p>
                      <p className="text-xs text-gray-600">
                        {trigger?.name} • {formatTimeAgo(item.timestamp)}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <Badge className={cn(
                    "text-xs",
                    item.result === 'success' && "bg-green-100 text-green-700",
                    item.result === 'failed' && "bg-red-100 text-red-700",
                    item.result === 'pending' && "bg-yellow-100 text-yellow-700"
                  )}>
                    {item.result}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}