'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertCircle,
  RefreshCw,
  Mail,
  MessageSquare,
  Phone,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Settings,
  ChevronRight,
  Info,
  Zap,
  Gift,
  DollarSign,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface RetryAttempt {
  id: string;
  attemptNumber: number;
  timestamp: Date;
  method: string;
  amount: number;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  errorCode?: string;
  errorMessage?: string;
  successRate: number;
}

interface RecoveryStrategy {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  timing: string;
  successRate: number;
  action: 'retry' | 'email' | 'sms' | 'in_app' | 'offer' | 'downgrade';
  automated: boolean;
  conditions?: string[];
}

interface PaymentRecoveryProps {
  failedPaymentAmount?: number;
  failedPaymentDate?: Date;
  retryAttempts?: RetryAttempt[];
  recoveryStrategies?: RecoveryStrategy[];
  gracePeriodEnds?: Date;
  onRetryNow?: () => void;
  onUpdatePaymentMethod?: () => void;
  onContactSupport?: () => void;
  showMetrics?: boolean;
}

export function PaymentRecovery({
  failedPaymentAmount = 29.99,
  failedPaymentDate,
  retryAttempts = [],
  recoveryStrategies = [],
  gracePeriodEnds,
  onRetryNow,
  onUpdatePaymentMethod,
  onContactSupport,
  showMetrics = true
}: PaymentRecoveryProps) {
  const [selectedStrategy, setSelectedStrategy] = React.useState<string | null>(null);
  const [isRetrying, setIsRetrying] = React.useState(false);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());
  
  // Default values using stable time
  const defaultFailedPaymentDate = failedPaymentDate || new Date(currentTime - 3 * 24 * 60 * 60 * 1000);
  const defaultGracePeriodEnds = gracePeriodEnds || new Date(currentTime + 4 * 24 * 60 * 60 * 1000);

  // Sample retry attempts for demo
  const demoAttempts: RetryAttempt[] = retryAttempts.length > 0 ? retryAttempts : [
    {
      id: 'attempt_1',
      attemptNumber: 1,
      timestamp: new Date(defaultFailedPaymentDate.getTime() + 1000),
      method: 'Same card',
      amount: failedPaymentAmount,
      status: 'failed',
      errorCode: 'insufficient_funds',
      errorMessage: 'Your card has insufficient funds',
      successRate: 30
    },
    {
      id: 'attempt_2',
      attemptNumber: 2,
      timestamp: new Date(currentTime - 24 * 60 * 60 * 1000),
      method: 'Same card',
      amount: failedPaymentAmount,
      status: 'failed',
      errorCode: 'card_declined',
      errorMessage: 'Your card was declined',
      successRate: 20
    },
    {
      id: 'attempt_3',
      attemptNumber: 3,
      timestamp: new Date(currentTime + 2 * 24 * 60 * 60 * 1000),
      method: 'Same card',
      amount: failedPaymentAmount,
      status: 'pending',
      successRate: 15
    }
  ];

  // Recovery strategies
  const demoStrategies: RecoveryStrategy[] = recoveryStrategies.length > 0 ? recoveryStrategies : [
    {
      id: 'instant_retry',
      name: 'Instant Retry',
      description: 'Immediately retry the payment',
      icon: RefreshCw,
      timing: 'Immediate',
      successRate: 30,
      action: 'retry',
      automated: true
    },
    {
      id: 'smart_retry',
      name: 'Smart Retry',
      description: 'Retry at optimal times based on success patterns',
      icon: Zap,
      timing: 'Day 3, 5, 7',
      successRate: 20,
      action: 'retry',
      automated: true,
      conditions: ['After banking hours', 'Start of month']
    },
    {
      id: 'email_reminder',
      name: 'Email Notification',
      description: 'Send payment failure notification',
      icon: Mail,
      timing: 'Within 24 hours',
      successRate: 25,
      action: 'email',
      automated: true
    },
    {
      id: 'in_app_notice',
      name: 'In-App Notification',
      description: 'Show payment update request in app',
      icon: MessageSquare,
      timing: 'On next login',
      successRate: 35,
      action: 'in_app',
      automated: true
    },
    {
      id: 'sms_alert',
      name: 'SMS Alert',
      description: 'Send text message if opted in',
      icon: Phone,
      timing: 'Day 5',
      successRate: 40,
      action: 'sms',
      automated: true,
      conditions: ['SMS opt-in required']
    },
    {
      id: 'special_offer',
      name: 'Win-back Offer',
      description: 'Offer discount to prevent churn',
      icon: Gift,
      timing: 'Day 7',
      successRate: 45,
      action: 'offer',
      automated: false,
      conditions: ['High-value customer', 'Long tenure']
    },
    {
      id: 'downgrade_option',
      name: 'Downgrade Suggestion',
      description: 'Offer lower-tier plan to maintain relationship',
      icon: TrendingDown,
      timing: 'Grace period end',
      successRate: 30,
      action: 'downgrade',
      automated: false
    }
  ];

  // Calculate days until grace period ends
  const daysUntilGracePeriodEnds = Math.floor((defaultGracePeriodEnds.getTime() - currentTime) / (1000 * 60 * 60 * 24));
  const gracePeriodProgress = ((7 - daysUntilGracePeriodEnds) / 7) * 100;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Handle retry
  const handleRetry = async () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      onRetryNow?.();
    }, 2000);
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Payment Failure Alert */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Payment Failed
            </CardTitle>
            <Badge className="bg-red-100 text-red-700">
              Action Required
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Failed Amount</p>
                <p className="text-2xl font-bold text-red-600">${failedPaymentAmount}</p>
                <p className="text-xs text-gray-500">Failed on {formatDate(defaultFailedPaymentDate)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Grace Period Remaining</p>
                <p className="text-2xl font-bold text-orange-600">{daysUntilGracePeriodEnds} days</p>
                <Progress value={gracePeriodProgress} className="h-2 mt-2" />
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Retry Attempts</p>
                <p className="text-2xl font-bold">{demoAttempts.length}/5</p>
                <p className="text-xs text-gray-500">
                  Next retry in {demoAttempts.find(a => a.status === 'pending') ? '2 days' : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleRetry}
                disabled={isRetrying}
                className="bg-green-600 hover:bg-green-700"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Now
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={onUpdatePaymentMethod}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Update Payment Method
              </Button>
              <Button 
                variant="outline"
                onClick={onContactSupport}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retry History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Payment Retry History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoAttempts.map((attempt) => (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "p-3 rounded-lg border",
                  attempt.status === 'pending' ? "border-yellow-200 bg-yellow-50" : "border-gray-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      attempt.status === 'succeeded' ? "bg-green-100" :
                      attempt.status === 'failed' ? "bg-red-100" :
                      attempt.status === 'processing' ? "bg-blue-100" :
                      "bg-yellow-100"
                    )}>
                      {attempt.status === 'succeeded' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                       attempt.status === 'failed' ? <XCircle className="h-4 w-4 text-red-600" /> :
                       attempt.status === 'processing' ? <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" /> :
                       <Clock className="h-4 w-4 text-yellow-600" />}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Attempt #{attempt.attemptNumber}</p>
                        <Badge className={cn("text-xs", getStatusColor(attempt.status))}>
                          {attempt.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {attempt.status === 'pending' ? 'Scheduled for' : 'Attempted on'} {formatDate(attempt.timestamp)}
                      </p>
                      {attempt.errorMessage && (
                        <p className="text-xs text-red-600 mt-1">{attempt.errorMessage}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">${attempt.amount}</p>
                    <p className="text-xs text-gray-500">{attempt.method}</p>
                    {attempt.successRate && (
                      <p className="text-xs text-gray-500">{attempt.successRate}% success rate</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recovery Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Recovery Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {demoStrategies.map((strategy) => {
              const Icon = strategy.icon;
              const isActive = selectedStrategy === strategy.id;
              
              return (
                <motion.div
                  key={strategy.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedStrategy(strategy.id)}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    isActive 
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isActive ? "bg-purple-100" : "bg-gray-100"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        isActive ? "text-purple-600" : "text-gray-600"
                      )} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{strategy.name}</h4>
                        {strategy.automated && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            Automated
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{strategy.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          <Clock className="h-3 w-3 inline mr-1" />
                          {strategy.timing}
                        </span>
                        <span>
                          <TrendingUp className="h-3 w-3 inline mr-1" />
                          {strategy.successRate}% success
                        </span>
                      </div>
                      
                      {strategy.conditions && (
                        <div className="mt-2 space-y-1">
                          {strategy.conditions.map((condition, idx) => (
                            <p key={idx} className="text-xs text-gray-500">
                              • {condition}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recovery Metrics */}
      {showMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recovery Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Overall Recovery Rate</p>
                <p className="text-2xl font-bold text-green-600">68%</p>
                <Progress value={68} className="h-2 mt-2" />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg Recovery Time</p>
                <p className="text-2xl font-bold">4.2 days</p>
                <p className="text-xs text-gray-500">Industry avg: 7 days</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Revenue Recovered</p>
                <p className="text-2xl font-bold text-green-600">$12,450</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Churn Prevention</p>
                <p className="text-2xl font-bold text-blue-600">82%</p>
                <p className="text-xs text-gray-500">Of failed payments</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Smart Recovery is working!</p>
                  <p className="text-sm text-green-600">
                    Your recovery rate is 18% above industry average
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}