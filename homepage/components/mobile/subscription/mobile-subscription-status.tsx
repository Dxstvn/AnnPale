'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Crown,
  Star,
  Users,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Gift,
  Bell,
  Settings,
  ChevronRight,
  DollarSign,
  Zap,
  Heart,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SubscriptionStatus {
  tier: 'free' | 'bronze' | 'silver' | 'gold';
  status: 'active' | 'trial' | 'past_due' | 'cancelled' | 'expired';
  nextBilling?: Date;
  trialEnds?: Date;
  daysUntilBilling?: number;
  autoRenew: boolean;
  price: number;
  currency: string;
  period: 'month' | 'year';
  platform: 'ios' | 'android' | 'web';
  paymentMethod?: string;
  lastPayment?: Date;
  usage?: {
    videosThisMonth: number;
    videosLimit?: number;
    messagesThisMonth: number;
    messagesLimit?: number;
  };
}

interface UsageMetric {
  name: string;
  current: number;
  limit?: number;
  icon: React.ElementType;
  color: string;
  unit?: string;
}

interface StatusAlert {
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface MobileSubscriptionStatusProps {
  subscription?: SubscriptionStatus;
  onManageSubscription?: () => void;
  onUpgrade?: () => void;
  onUpdatePayment?: () => void;
  onCancelSubscription?: () => void;
  showUsage?: boolean;
  showAlerts?: boolean;
}

export function MobileSubscriptionStatus({
  subscription,
  onManageSubscription,
  onUpgrade,
  onUpdatePayment,
  onCancelSubscription,
  showUsage = true,
  showAlerts = true
}: MobileSubscriptionStatusProps) {
  // Default subscription for demo
  const defaultSubscription: SubscriptionStatus = subscription || {
    tier: 'silver',
    status: 'active',
    nextBilling: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    autoRenew: true,
    price: 19.99,
    currency: 'USD',
    period: 'month',
    platform: 'web',
    paymentMethod: 'Credit Card ****1234',
    lastPayment: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    daysUntilBilling: 15,
    usage: {
      videosThisMonth: 23,
      videosLimit: undefined, // unlimited
      messagesThisMonth: 8,
      messagesLimit: undefined // unlimited
    }
  };

  // Get tier information
  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return { 
          name: 'Bronze', 
          icon: Star, 
          color: 'text-amber-600', 
          bgColor: 'bg-amber-50',
          gradient: 'from-amber-400 to-amber-600'
        };
      case 'silver':
        return { 
          name: 'Silver', 
          icon: Crown, 
          color: 'text-slate-600', 
          bgColor: 'bg-slate-50',
          gradient: 'from-slate-400 to-slate-600'
        };
      case 'gold':
        return { 
          name: 'Gold', 
          icon: Crown, 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-50',
          gradient: 'from-yellow-400 to-yellow-600'
        };
      default:
        return { 
          name: 'Free', 
          icon: Users, 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-50',
          gradient: 'from-gray-400 to-gray-600'
        };
    }
  };

  // Get status information
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          label: 'Active', 
          icon: CheckCircle, 
          color: 'text-green-600', 
          bgColor: 'bg-green-100' 
        };
      case 'trial':
        return { 
          label: 'Trial', 
          icon: Gift, 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-100' 
        };
      case 'past_due':
        return { 
          label: 'Past Due', 
          icon: AlertTriangle, 
          color: 'text-orange-600', 
          bgColor: 'bg-orange-100' 
        };
      case 'cancelled':
        return { 
          label: 'Cancelled', 
          icon: XCircle, 
          color: 'text-red-600', 
          bgColor: 'bg-red-100' 
        };
      case 'expired':
        return { 
          label: 'Expired', 
          icon: Clock, 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100' 
        };
      default:
        return { 
          label: 'Unknown', 
          icon: AlertCircle, 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100' 
        };
    }
  };

  // Get usage metrics
  const getUsageMetrics = (): UsageMetric[] => {
    if (!defaultSubscription.usage) return [];

    return [
      {
        name: 'Videos Watched',
        current: defaultSubscription.usage.videosThisMonth,
        limit: defaultSubscription.usage.videosLimit,
        icon: Eye,
        color: 'text-purple-600',
        unit: 'videos'
      },
      {
        name: 'Messages Received',
        current: defaultSubscription.usage.messagesThisMonth,
        limit: defaultSubscription.usage.messagesLimit,
        icon: Heart,
        color: 'text-red-600',
        unit: 'messages'
      }
    ];
  };

  // Get status alerts
  const getStatusAlerts = (): StatusAlert[] => {
    const alerts: StatusAlert[] = [];

    if (defaultSubscription.status === 'trial' && defaultSubscription.trialEnds) {
      const daysLeft = Math.ceil((defaultSubscription.trialEnds.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      alerts.push({
        type: 'info',
        message: `Your trial ends in ${daysLeft} days`,
        action: {
          label: 'Subscribe Now',
          onClick: () => onUpgrade?.()
        }
      });
    }

    if (defaultSubscription.status === 'past_due') {
      alerts.push({
        type: 'error',
        message: 'Payment failed. Update your payment method to continue service.',
        action: {
          label: 'Update Payment',
          onClick: () => onUpdatePayment?.()
        }
      });
    }

    if (defaultSubscription.daysUntilBilling && defaultSubscription.daysUntilBilling <= 3) {
      alerts.push({
        type: 'warning',
        message: `Your subscription renews in ${defaultSubscription.daysUntilBilling} days`,
        action: {
          label: 'Manage',
          onClick: () => onManageSubscription?.()
        }
      });
    }

    if (defaultSubscription.tier !== 'gold') {
      alerts.push({
        type: 'info',
        message: 'Upgrade to Gold for exclusive features and priority support',
        action: {
          label: 'Upgrade',
          onClick: () => onUpgrade?.()
        }
      });
    }

    return alerts;
  };

  const tierInfo = getTierInfo(defaultSubscription.tier);
  const statusInfo = getStatusInfo(defaultSubscription.status);
  const usageMetrics = getUsageMetrics();
  const statusAlerts = getStatusAlerts();
  const TierIcon = tierInfo.icon;
  const StatusIcon = statusInfo.icon;

  // Format date for mobile
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <Card className={cn("border-l-4", 
        defaultSubscription.status === 'active' ? "border-l-green-500" :
        defaultSubscription.status === 'trial' ? "border-l-blue-500" :
        defaultSubscription.status === 'past_due' ? "border-l-orange-500" :
        "border-l-red-500"
      )}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                tierInfo.gradient
              )}>
                <TierIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{tierInfo.name} Plan</h3>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", statusInfo.bgColor, statusInfo.color)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                  {defaultSubscription.platform && (
                    <span className="text-xs text-gray-500">
                      {defaultSubscription.platform === 'ios' ? '🍎' : 
                       defaultSubscription.platform === 'android' ? '🤖' : '🌐'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onManageSubscription}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Billing Information */}
          <div className="space-y-3">
            {defaultSubscription.tier !== 'free' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monthly cost</span>
                <span className="font-semibold">${defaultSubscription.price}/{defaultSubscription.period}</span>
              </div>
            )}

            {defaultSubscription.nextBilling && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next billing</span>
                <span className="font-medium">{formatDate(defaultSubscription.nextBilling)}</span>
              </div>
            )}

            {defaultSubscription.paymentMethod && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment method</span>
                <span className="font-medium">{defaultSubscription.paymentMethod}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Auto-renewal</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {defaultSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                </span>
                <div className={cn(
                  "w-8 h-4 rounded-full p-0.5 transition-colors",
                  defaultSubscription.autoRenew ? "bg-green-500" : "bg-gray-300"
                )}>
                  <div className={cn(
                    "w-3 h-3 rounded-full bg-white transition-transform",
                    defaultSubscription.autoRenew ? "translate-x-4" : "translate-x-0"
                  )} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Alerts */}
      {showAlerts && statusAlerts.length > 0 && (
        <div className="space-y-2">
          {statusAlerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "border",
                alert.type === 'error' ? "border-red-200 bg-red-50" :
                alert.type === 'warning' ? "border-orange-200 bg-orange-50" :
                alert.type === 'success' ? "border-green-200 bg-green-50" :
                "border-blue-200 bg-blue-50"
              )}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {alert.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {alert.type === 'warning' && <AlertCircle className="h-4 w-4 text-orange-600" />}
                      {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {alert.type === 'info' && <Bell className="h-4 w-4 text-blue-600" />}
                      <p className={cn(
                        "text-sm flex-1",
                        alert.type === 'error' ? "text-red-800" :
                        alert.type === 'warning' ? "text-orange-800" :
                        alert.type === 'success' ? "text-green-800" :
                        "text-blue-800"
                      )}>
                        {alert.message}
                      </p>
                    </div>
                    {alert.action && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className={cn(
                          "text-xs",
                          alert.type === 'error' ? "border-red-300 text-red-700 hover:bg-red-100" :
                          alert.type === 'warning' ? "border-orange-300 text-orange-700 hover:bg-orange-100" :
                          alert.type === 'success' ? "border-green-300 text-green-700 hover:bg-green-100" :
                          "border-blue-300 text-blue-700 hover:bg-blue-100"
                        )}
                        onClick={alert.action.onClick}
                      >
                        {alert.action.label}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Usage Metrics */}
      {showUsage && usageMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">This Month's Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {usageMetrics.map((metric, index) => {
              const Icon = metric.icon;
              const percentage = metric.limit ? (metric.current / metric.limit) * 100 : null;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-4 w-4", metric.color)} />
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">{metric.current}</span>
                      {metric.limit && (
                        <span className="text-xs text-gray-500">/{metric.limit}</span>
                      )}
                      {!metric.limit && (
                        <span className="text-xs text-green-600 ml-1">unlimited</span>
                      )}
                    </div>
                  </div>
                  
                  {percentage !== null && (
                    <div className="space-y-1">
                      <Progress 
                        value={Math.min(percentage, 100)} 
                        className={cn(
                          "h-2",
                          percentage > 90 ? "bg-red-100" :
                          percentage > 75 ? "bg-orange-100" :
                          "bg-green-100"
                        )}
                      />
                      <p className="text-xs text-gray-600">
                        {percentage.toFixed(1)}% used this month
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {defaultSubscription.tier !== 'gold' && (
          <Button 
            className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            onClick={onUpgrade}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="h-12"
          onClick={onManageSubscription}
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage
        </Button>

        {defaultSubscription.status === 'past_due' && (
          <Button 
            className="h-12 bg-orange-500 text-white col-span-2"
            onClick={onUpdatePayment}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment Method
          </Button>
        )}
      </div>
    </div>
  );
}