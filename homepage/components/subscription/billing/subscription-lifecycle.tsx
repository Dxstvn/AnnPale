'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play,
  Pause,
  StopCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  CreditCard,
  RefreshCw,
  ChevronRight,
  Info,
  User,
  Shield,
  Star,
  Crown,
  ArrowUpCircle,
  ArrowDownCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SubscriptionState {
  id: string;
  userId: string;
  tier: 'bronze' | 'silver' | 'gold';
  status: 'trial' | 'active' | 'grace_period' | 'suspended' | 'cancelled' | 'expired';
  startDate: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEndsAt?: Date;
  cancelledAt?: Date;
  pausedAt?: Date;
  resumesAt?: Date;
  gracePeriodEndsAt?: Date;
  amount: number;
  currency: string;
  paymentMethod?: string;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  failedPayments: number;
}

interface LifecycleEvent {
  id: string;
  type: 'created' | 'trial_started' | 'trial_converted' | 'payment_succeeded' | 
        'payment_failed' | 'upgraded' | 'downgraded' | 'paused' | 'resumed' | 
        'cancelled' | 'reactivated' | 'expired';
  timestamp: Date;
  description: string;
  metadata?: any;
}

interface SubscriptionLifecycleProps {
  subscription?: SubscriptionState;
  events?: LifecycleEvent[];
  onActionClick?: (action: string, subscription: SubscriptionState) => void;
  showTimeline?: boolean;
}

export function SubscriptionLifecycle({
  subscription,
  events = [],
  onActionClick,
  showTimeline = true
}: SubscriptionLifecycleProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Sample subscription for demo
  const demoSubscription: SubscriptionState = subscription || {
    id: 'sub_123',
    userId: 'user_456',
    tier: 'silver',
    status: 'active',
    startDate: new Date(currentTime - 180 * 24 * 60 * 60 * 1000),
    currentPeriodStart: new Date(currentTime - 15 * 24 * 60 * 60 * 1000),
    currentPeriodEnd: new Date(currentTime + 15 * 24 * 60 * 60 * 1000),
    amount: 29.99,
    currency: 'USD',
    paymentMethod: 'card_ending_4242',
    lastPaymentDate: new Date(currentTime - 15 * 24 * 60 * 60 * 1000),
    nextPaymentDate: new Date(currentTime + 15 * 24 * 60 * 60 * 1000),
    failedPayments: 0
  };

  // Sample events for demo
  const demoEvents: LifecycleEvent[] = events.length > 0 ? events : [
    {
      id: 'evt_1',
      type: 'created',
      timestamp: new Date(currentTime - 180 * 24 * 60 * 60 * 1000),
      description: 'Subscription created'
    },
    {
      id: 'evt_2',
      type: 'trial_started',
      timestamp: new Date(currentTime - 180 * 24 * 60 * 60 * 1000),
      description: '7-day trial started'
    },
    {
      id: 'evt_3',
      type: 'trial_converted',
      timestamp: new Date(currentTime - 173 * 24 * 60 * 60 * 1000),
      description: 'Converted to paid subscription'
    },
    {
      id: 'evt_4',
      type: 'payment_succeeded',
      timestamp: new Date(currentTime - 15 * 24 * 60 * 60 * 1000),
      description: 'Payment of $29.99 succeeded'
    },
    {
      id: 'evt_5',
      type: 'upgraded',
      timestamp: new Date(currentTime - 5 * 24 * 60 * 60 * 1000),
      description: 'Upgraded from Bronze to Silver tier'
    }
  ];

  // Lifecycle states
  const lifecycleStates = [
    {
      id: 'trial',
      name: 'Trial Period',
      description: 'Free trial to explore features',
      icon: Clock,
      color: 'from-blue-400 to-blue-600',
      badgeColor: 'bg-blue-100 text-blue-700',
      duration: '7 days',
      actions: ['Convert to Paid', 'Extend Trial']
    },
    {
      id: 'active',
      name: 'Active Subscription',
      description: 'Full access to subscribed features',
      icon: CheckCircle,
      color: 'from-green-400 to-green-600',
      badgeColor: 'bg-green-100 text-green-700',
      duration: 'Ongoing',
      actions: ['Upgrade', 'Downgrade', 'Pause', 'Cancel']
    },
    {
      id: 'grace_period',
      name: 'Grace Period',
      description: 'Payment failed, limited time to update',
      icon: AlertCircle,
      color: 'from-yellow-400 to-yellow-600',
      badgeColor: 'bg-yellow-100 text-yellow-700',
      duration: '7 days',
      actions: ['Update Payment', 'Contact Support']
    },
    {
      id: 'suspended',
      name: 'Suspended',
      description: 'Access restricted due to payment issues',
      icon: Pause,
      color: 'from-orange-400 to-orange-600',
      badgeColor: 'bg-orange-100 text-orange-700',
      duration: 'Until resolved',
      actions: ['Reactivate', 'Update Payment']
    },
    {
      id: 'cancelled',
      name: 'Cancelled',
      description: 'Subscription ended by user',
      icon: StopCircle,
      color: 'from-gray-400 to-gray-600',
      badgeColor: 'bg-gray-100 text-gray-700',
      duration: 'Ended',
      actions: ['Resubscribe', 'Win-back Offer']
    },
    {
      id: 'expired',
      name: 'Expired',
      description: 'Subscription period completed',
      icon: XCircle,
      color: 'from-red-400 to-red-600',
      badgeColor: 'bg-red-100 text-red-700',
      duration: 'Ended',
      actions: ['Renew', 'New Subscription']
    }
  ];

  // Get status color
  const getStatusColor = (status: string) => {
    const state = lifecycleStates.find(s => s.id === status);
    return state?.badgeColor || 'bg-gray-100 text-gray-700';
  };

  // Get tier icon
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return Shield;
      case 'silver': return Star;
      case 'gold': return Crown;
      default: return User;
    }
  };

  // Calculate subscription health
  const calculateHealth = () => {
    if (demoSubscription.status === 'active' && demoSubscription.failedPayments === 0) {
      return { score: 100, label: 'Excellent', color: 'text-green-600' };
    } else if (demoSubscription.status === 'active' && demoSubscription.failedPayments <= 1) {
      return { score: 75, label: 'Good', color: 'text-blue-600' };
    } else if (demoSubscription.status === 'grace_period') {
      return { score: 50, label: 'At Risk', color: 'text-yellow-600' };
    } else if (demoSubscription.status === 'suspended') {
      return { score: 25, label: 'Critical', color: 'text-orange-600' };
    } else {
      return { score: 0, label: 'Inactive', color: 'text-gray-600' };
    }
  };

  const health = calculateHealth();
  const TierIcon = getTierIcon(demoSubscription.tier);

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const days = Math.floor((date.getTime() - currentTime) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days === -1) return 'Yesterday';
    if (days > 0) return `In ${days} days`;
    return `${Math.abs(days)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Subscription Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Subscription Overview
            </CardTitle>
            <Badge className={cn("text-sm", getStatusColor(demoSubscription.status))}>
              {demoSubscription.status.replace('_', ' ').charAt(0).toUpperCase() + 
               demoSubscription.status.replace('_', ' ').slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Subscription Details */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Current Tier</p>
                <div className="flex items-center gap-2 mt-1">
                  <TierIcon className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold capitalize">{demoSubscription.tier}</span>
                  <span className="text-gray-600">${demoSubscription.amount}/mo</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium">{formatDate(demoSubscription.startDate)}</p>
                <p className="text-xs text-gray-500">
                  {Math.floor((currentTime - demoSubscription.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <div className="flex items-center gap-2 mt-1">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">•••• 4242</span>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Current Period</p>
                <p className="font-medium">
                  {formatDate(demoSubscription.currentPeriodStart)} - {formatDate(demoSubscription.currentPeriodEnd)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Next Payment</p>
                <p className="font-medium">{formatDate(demoSubscription.nextPaymentDate!)}</p>
                <p className="text-xs text-gray-500">{formatRelativeTime(demoSubscription.nextPaymentDate!)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Failed Payments</p>
                <div className="flex items-center gap-2 mt-1">
                  {demoSubscription.failedPayments === 0 ? (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      None
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-700">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {demoSubscription.failedPayments} attempts
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Health Score */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Subscription Health</p>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-2xl font-bold", health.color)}>
                      {health.score}%
                    </span>
                    <Badge variant="outline">{health.label}</Badge>
                  </div>
                  <Progress value={health.score} className="h-2" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onActionClick?.('upgrade', demoSubscription)}
                >
                  <ArrowUpCircle className="h-4 w-4 mr-1" />
                  Upgrade
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => onActionClick?.('manage', demoSubscription)}
                >
                  Manage
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifecycle States */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Lifecycle States</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lifecycleStates.map((state) => {
              const Icon = state.icon;
              const isCurrentState = demoSubscription.status === state.id;
              
              return (
                <motion.div
                  key={state.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedStatus(state.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    isCurrentState 
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      state.color
                    )}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{state.name}</h4>
                        {isCurrentState && (
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2">{state.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {state.duration}
                        </Badge>
                        {state.actions.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {state.actions.length} actions
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {showTimeline && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Subscription Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((event, index) => {
                const isLatest = index === 0;
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg",
                      isLatest ? "bg-purple-50 border border-purple-200" : "bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2",
                      isLatest ? "bg-purple-600" : "bg-gray-400"
                    )} />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{event.description}</p>
                        {isLatest && (
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            Latest
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>{formatDate(event.timestamp)}</span>
                        <span>{formatRelativeTime(event.timestamp)}</span>
                        <Badge variant="outline" className="text-xs">
                          {event.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    {event.metadata && (
                      <Button size="sm" variant="ghost">
                        <Info className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}