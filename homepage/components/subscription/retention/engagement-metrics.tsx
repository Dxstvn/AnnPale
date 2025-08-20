'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  TrendingDown,
  TrendingUp,
  Users,
  MessageSquare,
  AlertCircle,
  CreditCard,
  LogIn,
  Video,
  ThumbsDown,
  HeadphonesIcon,
  BarChart3,
  Clock,
  Eye,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface EngagementMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  unit: string;
  period: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold?: {
    warning: number;
    critical: number;
  };
}

interface MetricCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  metrics: EngagementMetric[];
  overallStatus: 'healthy' | 'warning' | 'critical';
  description: string;
}

interface EngagementMetricsProps {
  userId?: string;
  timeRange?: '7d' | '30d' | '90d' | '365d';
  onMetricClick?: (metric: EngagementMetric) => void;
  onAlertTrigger?: (metric: EngagementMetric) => void;
  showDetails?: boolean;
}

export function EngagementMetrics({
  userId,
  timeRange = '30d',
  onMetricClick,
  onAlertTrigger,
  showDetails = true
}: EngagementMetricsProps) {
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = React.useState(timeRange);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Sample metrics data
  const metricsData: MetricCategory[] = [
    {
      id: 'login',
      name: 'Login Frequency',
      icon: LogIn,
      overallStatus: 'warning',
      description: 'User authentication and session activity',
      metrics: [
        {
          id: 'login_frequency',
          name: 'Login Frequency',
          value: 3,
          previousValue: 8,
          change: -62.5,
          changeType: 'decrease',
          unit: 'times/week',
          period: 'vs last week',
          status: 'warning',
          threshold: { warning: 5, critical: 2 }
        },
        {
          id: 'session_duration',
          name: 'Avg Session Duration',
          value: 12,
          previousValue: 25,
          change: -52,
          changeType: 'decrease',
          unit: 'minutes',
          period: 'vs last week',
          status: 'critical'
        },
        {
          id: 'last_login',
          name: 'Days Since Last Login',
          value: 4,
          previousValue: 1,
          change: 300,
          changeType: 'increase',
          unit: 'days',
          period: 'current',
          status: 'warning'
        }
      ]
    },
    {
      id: 'content',
      name: 'Content Consumption',
      icon: Video,
      overallStatus: 'critical',
      description: 'Video views and content interaction',
      metrics: [
        {
          id: 'videos_watched',
          name: 'Videos Watched',
          value: 2,
          previousValue: 12,
          change: -83.3,
          changeType: 'decrease',
          unit: 'videos',
          period: 'last 30 days',
          status: 'critical'
        },
        {
          id: 'watch_time',
          name: 'Total Watch Time',
          value: 45,
          previousValue: 180,
          change: -75,
          changeType: 'decrease',
          unit: 'minutes',
          period: 'last 30 days',
          status: 'critical'
        },
        {
          id: 'completion_rate',
          name: 'Video Completion Rate',
          value: 35,
          previousValue: 78,
          change: -55.1,
          changeType: 'decrease',
          unit: '%',
          period: 'average',
          status: 'critical'
        }
      ]
    },
    {
      id: 'community',
      name: 'Community Participation',
      icon: Users,
      overallStatus: 'warning',
      description: 'Social interactions and community engagement',
      metrics: [
        {
          id: 'comments_posted',
          name: 'Comments Posted',
          value: 1,
          previousValue: 5,
          change: -80,
          changeType: 'decrease',
          unit: 'comments',
          period: 'last 30 days',
          status: 'critical'
        },
        {
          id: 'likes_given',
          name: 'Likes Given',
          value: 8,
          previousValue: 24,
          change: -66.7,
          changeType: 'decrease',
          unit: 'likes',
          period: 'last 30 days',
          status: 'warning'
        },
        {
          id: 'forum_visits',
          name: 'Forum Visits',
          value: 3,
          previousValue: 8,
          change: -62.5,
          changeType: 'decrease',
          unit: 'visits',
          period: 'last 30 days',
          status: 'warning'
        }
      ]
    },
    {
      id: 'support',
      name: 'Support Interactions',
      icon: HeadphonesIcon,
      overallStatus: 'critical',
      description: 'Customer support tickets and feedback',
      metrics: [
        {
          id: 'support_tickets',
          name: 'Support Tickets',
          value: 3,
          previousValue: 0,
          change: 300,
          changeType: 'increase',
          unit: 'tickets',
          period: 'last 30 days',
          status: 'critical'
        },
        {
          id: 'response_satisfaction',
          name: 'Response Satisfaction',
          value: 2,
          previousValue: 4.5,
          change: -55.6,
          changeType: 'decrease',
          unit: '/5 stars',
          period: 'average',
          status: 'critical'
        }
      ]
    },
    {
      id: 'feedback',
      name: 'User Feedback',
      icon: ThumbsDown,
      overallStatus: 'warning',
      description: 'Ratings and feedback sentiment',
      metrics: [
        {
          id: 'negative_feedback',
          name: 'Negative Feedback',
          value: 2,
          previousValue: 0,
          change: 200,
          changeType: 'increase',
          unit: 'instances',
          period: 'last 30 days',
          status: 'warning'
        },
        {
          id: 'nps_score',
          name: 'NPS Score',
          value: -20,
          previousValue: 45,
          change: -144.4,
          changeType: 'decrease',
          unit: 'points',
          period: 'current',
          status: 'critical'
        }
      ]
    },
    {
      id: 'payment',
      name: 'Payment Health',
      icon: CreditCard,
      overallStatus: 'warning',
      description: 'Payment method status and billing',
      metrics: [
        {
          id: 'payment_failures',
          name: 'Payment Failures',
          value: 1,
          previousValue: 0,
          change: 100,
          changeType: 'increase',
          unit: 'failures',
          period: 'last 30 days',
          status: 'warning'
        },
        {
          id: 'card_expiry',
          name: 'Card Expiring Soon',
          value: 1,
          previousValue: 0,
          change: 100,
          changeType: 'increase',
          unit: 'cards',
          period: 'within 60 days',
          status: 'warning'
        }
      ]
    }
  ];

  // Calculate overall engagement score
  const calculateEngagementScore = () => {
    let totalScore = 0;
    let totalMetrics = 0;
    
    metricsData.forEach(category => {
      category.metrics.forEach(metric => {
        totalMetrics++;
        if (metric.status === 'healthy') totalScore += 100;
        else if (metric.status === 'warning') totalScore += 50;
        else totalScore += 0;
      });
    });
    
    return Math.round(totalScore / totalMetrics);
  };

  const engagementScore = calculateEngagementScore();

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get change icon
  const getChangeIcon = (changeType: string) => {
    return changeType === 'increase' ? ArrowUpRight : ArrowDownRight;
  };

  // Check if metric needs alert
  React.useEffect(() => {
    metricsData.forEach(category => {
      category.metrics.forEach(metric => {
        if (metric.status === 'critical' && onAlertTrigger) {
          onAlertTrigger(metric);
        }
      });
    });
  }, [selectedTimeRange]);

  return (
    <div className="space-y-6">
      {/* Overall Engagement Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Engagement Metrics Dashboard
            </CardTitle>
            <div className="flex gap-2">
              {['7d', '30d', '90d', '365d'].map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={selectedTimeRange === range ? 'default' : 'outline'}
                  onClick={() => setSelectedTimeRange(range as any)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Overall Engagement Score</p>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold">
                  <span className={cn(
                    engagementScore >= 70 ? 'text-green-600' :
                    engagementScore >= 40 ? 'text-yellow-600' :
                    'text-red-600'
                  )}>
                    {engagementScore}
                  </span>
                  <span className="text-gray-400 text-2xl">/100</span>
                </div>
                <Badge className={cn(
                  "text-sm",
                  engagementScore >= 70 ? 'bg-green-100 text-green-700' :
                  engagementScore >= 40 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                )}>
                  {engagementScore >= 70 ? 'Healthy' :
                   engagementScore >= 40 ? 'At Risk' :
                   'Critical'}
                </Badge>
              </div>
              <Progress value={engagementScore} className="h-2 mt-3" />
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Risk Indicators</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600">Critical</span>
                  <span className="font-medium">
                    {metricsData.filter(c => c.overallStatus === 'critical').length} categories
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-600">Warning</span>
                  <span className="font-medium">
                    {metricsData.filter(c => c.overallStatus === 'warning').length} categories
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Healthy</span>
                  <span className="font-medium">
                    {metricsData.filter(c => c.overallStatus === 'healthy').length} categories
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Immediate Actions Needed</p>
              <div className="space-y-2">
                {metricsData
                  .filter(c => c.overallStatus === 'critical')
                  .slice(0, 3)
                  .map(category => (
                    <div key={category.id} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">{category.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Categories */}
      <div className="space-y-4">
        {metricsData.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategory === category.id;
          
          return (
            <Card key={category.id} className={cn(
              "transition-all",
              category.overallStatus === 'critical' && "border-red-300",
              category.overallStatus === 'warning' && "border-yellow-300"
            )}>
              <CardHeader 
                className="cursor-pointer"
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      category.overallStatus === 'healthy' && "bg-green-100",
                      category.overallStatus === 'warning' && "bg-yellow-100",
                      category.overallStatus === 'critical' && "bg-red-100"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        getStatusColor(category.overallStatus)
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusBadge(category.overallStatus)}>
                      {category.overallStatus}
                    </Badge>
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent>
                      <div className="space-y-4">
                        {category.metrics.map((metric) => {
                          const ChangeIcon = getChangeIcon(metric.changeType);
                          const isNegativeChange = metric.changeType === 'decrease' && 
                            !['support_tickets', 'negative_feedback', 'payment_failures'].includes(metric.id);
                          
                          return (
                            <div
                              key={metric.id}
                              className={cn(
                                "p-4 rounded-lg border transition-all cursor-pointer hover:bg-gray-50",
                                metric.status === 'critical' && "border-red-200 bg-red-50",
                                metric.status === 'warning' && "border-yellow-200 bg-yellow-50"
                              )}
                              onClick={() => onMetricClick?.(metric)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium">{metric.name}</h4>
                                    <Badge className={cn("text-xs", getStatusBadge(metric.status))}>
                                      {metric.status}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl font-bold">
                                        {metric.value}
                                      </span>
                                      <span className="text-gray-600">
                                        {metric.unit}
                                      </span>
                                    </div>
                                    
                                    <div className={cn(
                                      "flex items-center gap-1",
                                      isNegativeChange ? "text-red-600" : 
                                      metric.changeType === 'increase' ? "text-green-600" :
                                      "text-gray-600"
                                    )}>
                                      <ChangeIcon className="h-4 w-4" />
                                      <span className="text-sm font-medium">
                                        {Math.abs(metric.change)}%
                                      </span>
                                      <span className="text-xs text-gray-600">
                                        {metric.period}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {metric.threshold && showDetails && (
                                    <div className="mt-2 text-xs text-gray-600">
                                      Warning: {metric.threshold.warning} | Critical: {metric.threshold.critical}
                                    </div>
                                  )}
                                </div>
                                
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Alert Summary */}
      {showDetails && (
        <Card className="bg-gradient-to-r from-red-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metricsData.flatMap(c => 
                c.metrics.filter(m => m.status === 'critical')
              ).slice(0, 5).map(metric => (
                <div key={metric.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="font-medium text-sm">{metric.name}</p>
                      <p className="text-xs text-gray-600">
                        {metric.change > 0 ? 'Increased' : 'Decreased'} by {Math.abs(metric.change)}% {metric.period}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Take Action
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}