'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
  icon: React.ElementType;
  color: string;
  description?: string;
  target?: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

interface TimeRange {
  value: string;
  label: string;
  days: number;
}

interface SubscriptionMetricsDashboardProps {
  creatorId?: string;
  timeRange?: string;
  metricCards?: MetricCard[];
  onTimeRangeChange?: (range: string) => void;
  onMetricClick?: (metricId: string) => void;
  onExportData?: (format: string) => void;
  onRefreshData?: () => void;
  isLoading?: boolean;
}

export function SubscriptionMetricsDashboard({
  creatorId,
  timeRange = '30d',
  metricCards = [],
  onTimeRangeChange,
  onMetricClick,
  onExportData,
  onRefreshData,
  isLoading = false
}: SubscriptionMetricsDashboardProps) {
  const [selectedTab, setSelectedTab] = React.useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = React.useState(timeRange);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Time range options
  const timeRanges: TimeRange[] = [
    { value: '7d', label: 'Last 7 Days', days: 7 },
    { value: '30d', label: 'Last 30 Days', days: 30 },
    { value: '90d', label: 'Last 90 Days', days: 90 },
    { value: '365d', label: 'Last Year', days: 365 },
    { value: 'ytd', label: 'Year to Date', days: 365 },
    { value: 'all', label: 'All Time', days: 1000 }
  ];

  // Default metric cards based on specification
  const defaultMetricCards: MetricCard[] = metricCards.length > 0 ? metricCards : [
    {
      id: 'mrr',
      title: 'Monthly Recurring Revenue',
      value: '$12,450',
      change: 12.5,
      changeType: 'increase',
      period: 'vs last month',
      icon: DollarSign,
      color: 'text-green-600',
      description: 'Predictable monthly revenue from active subscriptions',
      target: 15000
    },
    {
      id: 'arr',
      title: 'Annual Recurring Revenue',
      value: '$149,400',
      change: 8.3,
      changeType: 'increase',
      period: 'vs last year',
      icon: TrendingUp,
      color: 'text-blue-600',
      description: 'Projected annual revenue based on current subscriptions'
    },
    {
      id: 'arpu',
      title: 'Average Revenue Per User',
      value: '$24.15',
      change: -2.1,
      changeType: 'decrease',
      period: 'vs last month',
      icon: Users,
      color: 'text-purple-600',
      description: 'Average monthly revenue generated per active subscriber'
    },
    {
      id: 'ltv',
      title: 'Customer Lifetime Value',
      value: '$186.40',
      change: 5.7,
      changeType: 'increase',
      period: 'vs last quarter',
      icon: Target,
      color: 'text-orange-600',
      description: 'Predicted total revenue from average customer relationship'
    },
    {
      id: 'cac',
      title: 'Customer Acquisition Cost',
      value: '$32.50',
      change: -8.2,
      changeType: 'decrease',
      period: 'vs last month',
      icon: TrendingDown,
      color: 'text-pink-600',
      description: 'Average cost to acquire a new subscriber'
    },
    {
      id: 'ltv_cac_ratio',
      title: 'LTV:CAC Ratio',
      value: '5.7:1',
      change: 15.2,
      changeType: 'increase',
      period: 'vs last quarter',
      icon: BarChart3,
      color: 'text-indigo-600',
      description: 'Ratio of lifetime value to acquisition cost',
      target: 3
    },
    {
      id: 'new_subscribers',
      title: 'New Subscribers',
      value: '284',
      change: 18.9,
      changeType: 'increase',
      period: 'vs last month',
      icon: Users,
      color: 'text-green-600',
      description: 'New subscription activations this period'
    },
    {
      id: 'churn_rate',
      title: 'Churn Rate',
      value: '4.2%',
      change: -1.8,
      changeType: 'decrease',
      period: 'vs last month',
      icon: TrendingDown,
      color: 'text-red-600',
      description: 'Percentage of subscribers who cancelled this period'
    },
    {
      id: 'net_revenue_retention',
      title: 'Net Revenue Retention',
      value: '112%',
      change: 3.4,
      changeType: 'increase',
      period: 'vs last quarter',
      icon: TrendingUp,
      color: 'text-emerald-600',
      description: 'Revenue retention including expansions and contractions'
    },
    {
      id: 'active_subscriber_rate',
      title: 'Active Subscriber %',
      value: '87.3%',
      change: 2.1,
      changeType: 'increase',
      period: 'vs last month',
      icon: Activity,
      color: 'text-blue-600',
      description: 'Percentage of subscribers actively engaging with content'
    }
  ];

  // Handle time range change
  const handleTimeRangeChange = (newRange: string) => {
    setSelectedTimeRange(newRange);
    onTimeRangeChange?.(newRange);
  };

  // Get change icon
  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return ArrowUpRight;
      case 'decrease': return ArrowDownRight;
      default: return Minus;
    }
  };

  // Get change color
  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Calculate progress percentage for metrics with targets
  const getProgressPercentage = (value: string, target?: number) => {
    if (!target) return null;
    
    // Extract numeric value from string
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    return Math.min((numericValue / target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscription Analytics</h1>
          <p className="text-gray-600">
            Comprehensive insights into your subscription performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshData}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExportData?.('csv')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Primary Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultMetricCards.slice(0, 6).map((metric, index) => {
              const Icon = metric.icon;
              const ChangeIcon = getChangeIcon(metric.changeType);
              const progressPercentage = getProgressPercentage(metric.value.toString(), metric.target);

              return (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="transition-all cursor-pointer hover:shadow-md"
                    onClick={() => onMetricClick?.(metric.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            "bg-gray-100"
                          )}>
                            <Icon className={cn("h-4 w-4", metric.color)} />
                          </div>
                          <CardTitle className="text-sm font-medium">
                            {metric.title}
                          </CardTitle>
                        </div>
                        <Eye className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-2xl font-bold">{metric.value}</div>
                        
                        <div className="flex items-center justify-between">
                          <div className={cn(
                            "flex items-center gap-1 text-sm",
                            getChangeColor(metric.changeType)
                          )}>
                            <ChangeIcon className="h-3 w-3" />
                            <span>{Math.abs(metric.change)}%</span>
                            <span className="text-gray-500">{metric.period}</span>
                          </div>
                          
                          {metric.target && (
                            <Badge variant="outline" className="text-xs">
                              Target: {metric.target}
                            </Badge>
                          )}
                        </div>

                        {progressPercentage && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Progress to target</span>
                              <span className="font-medium">{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={cn(
                                  "h-1.5 rounded-full transition-all",
                                  progressPercentage >= 80 ? "bg-green-500" :
                                  progressPercentage >= 60 ? "bg-yellow-500" :
                                  "bg-red-500"
                                )}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {metric.description && (
                          <p className="text-xs text-gray-600">{metric.description}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {defaultMetricCards.filter(m => m.changeType === 'increase').length}
                  </div>
                  <p className="text-sm text-gray-600">Improving Metrics</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {defaultMetricCards.filter(m => m.changeType === 'decrease').length}
                  </div>
                  <p className="text-sm text-gray-600">Declining Metrics</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {defaultMetricCards.filter(m => m.target && getProgressPercentage(m.value.toString(), m.target)! >= 80).length}
                  </div>
                  <p className="text-sm text-gray-600">On Track Targets</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {Math.round(defaultMetricCards.reduce((sum, m) => sum + Math.abs(m.change), 0) / defaultMetricCards.length)}%
                  </div>
                  <p className="text-sm text-gray-600">Avg Change Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {defaultMetricCards.filter(m => 
              ['mrr', 'arr', 'arpu', 'ltv', 'cac', 'ltv_cac_ratio'].includes(m.id)
            ).map((metric, index) => {
              const Icon = metric.icon;
              const ChangeIcon = getChangeIcon(metric.changeType);

              return (
                <Card key={metric.id} className="cursor-pointer hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        "bg-gray-100"
                      )}>
                        <Icon className={cn("h-5 w-5", metric.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{metric.title}</CardTitle>
                        <p className="text-sm text-gray-600">{metric.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">{metric.value}</div>
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        getChangeColor(metric.changeType)
                      )}>
                        <ChangeIcon className="h-4 w-4" />
                        <span>{Math.abs(metric.change)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {defaultMetricCards.filter(m => 
              ['new_subscribers', 'churn_rate', 'net_revenue_retention'].includes(m.id)
            ).map((metric) => {
              const Icon = metric.icon;
              const ChangeIcon = getChangeIcon(metric.changeType);

              return (
                <Card key={metric.id} className="cursor-pointer hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        "bg-gray-100"
                      )}>
                        <Icon className={cn("h-5 w-5", metric.color)} />
                      </div>
                      <CardTitle className="text-base">{metric.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">{metric.value}</div>
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        getChangeColor(metric.changeType)
                      )}>
                        <ChangeIcon className="h-4 w-4" />
                        <span>{Math.abs(metric.change)}% {metric.period}</span>
                      </div>
                      <p className="text-xs text-gray-600">{metric.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {defaultMetricCards.filter(m => 
              ['active_subscriber_rate'].includes(m.id)
            ).map((metric) => {
              const Icon = metric.icon;
              const ChangeIcon = getChangeIcon(metric.changeType);

              return (
                <Card key={metric.id} className="cursor-pointer hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        "bg-gray-100"
                      )}>
                        <Icon className={cn("h-5 w-5", metric.color)} />
                      </div>
                      <CardTitle className="text-base">{metric.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">{metric.value}</div>
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        getChangeColor(metric.changeType)
                      )}>
                        <ChangeIcon className="h-4 w-4" />
                        <span>{Math.abs(metric.change)}% {metric.period}</span>
                      </div>
                      <p className="text-xs text-gray-600">{metric.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Engagement Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Content Consumption', value: '89.2%', change: '+2.3%' },
                  { label: 'Feature Utilization', value: '76.8%', change: '+1.8%' },
                  { label: 'Community Participation', value: '45.6%', change: '-0.9%' },
                  { label: 'Support Interaction', value: '12.4%', change: '-2.1%' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold mb-1">{item.value}</div>
                    <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        item.change.startsWith('+') ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {item.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}