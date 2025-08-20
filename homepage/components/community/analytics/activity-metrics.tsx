'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users,
  MessageSquare,
  FileText,
  Heart,
  Share2,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  BarChart3,
  Calendar,
  Clock,
  Eye,
  MousePointer,
  Zap,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Info,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ActivityMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  unit?: string;
  change?: number;
  trend: 'up' | 'down' | 'stable';
  target?: number;
  icon: React.ElementType;
  color: string;
  description?: string;
}

interface TimeSeriesData {
  timestamp: Date;
  value: number;
  label?: string;
}

interface ActivityBreakdown {
  category: string;
  count: number;
  percentage: number;
  icon: React.ElementType;
  color: string;
}

interface ActivityMetricsProps {
  timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  onTimeRangeChange?: (range: string) => void;
  onMetricClick?: (metric: ActivityMetric) => void;
  showComparison?: boolean;
  showTargets?: boolean;
  autoRefresh?: boolean;
}

export function ActivityMetrics({
  timeRange = 'week',
  onTimeRangeChange,
  onMetricClick,
  showComparison = true,
  showTargets = true,
  autoRefresh = false
}: ActivityMetricsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState(timeRange);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null);

  // Core activity metrics
  const activityMetrics: ActivityMetric[] = [
    {
      id: 'dau',
      name: 'Daily Active Users',
      value: 3456,
      previousValue: 3120,
      change: 10.8,
      trend: 'up',
      target: 4000,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      description: 'Unique users active in last 24 hours'
    },
    {
      id: 'posts',
      name: 'Posts Per Day',
      value: 892,
      previousValue: 756,
      change: 18.0,
      trend: 'up',
      target: 1000,
      icon: FileText,
      color: 'text-purple-600 bg-purple-100',
      description: 'Average posts created daily'
    },
    {
      id: 'comments',
      name: 'Comments Ratio',
      value: 4.2,
      previousValue: 3.8,
      unit: 'per post',
      change: 10.5,
      trend: 'up',
      target: 5.0,
      icon: MessageSquare,
      color: 'text-green-600 bg-green-100',
      description: 'Average comments per post'
    },
    {
      id: 'threads',
      name: 'Thread Creation',
      value: 234,
      previousValue: 198,
      change: 18.2,
      trend: 'up',
      target: 300,
      icon: Activity,
      color: 'text-orange-600 bg-orange-100',
      description: 'New discussion threads started'
    },
    {
      id: 'shares',
      name: 'Media Shares',
      value: 1567,
      previousValue: 1423,
      change: 10.1,
      trend: 'up',
      target: 2000,
      icon: Share2,
      color: 'text-pink-600 bg-pink-100',
      description: 'Content shared across platform'
    },
    {
      id: 'reactions',
      name: 'Reactions',
      value: 8934,
      previousValue: 7856,
      change: 13.7,
      trend: 'up',
      icon: Heart,
      color: 'text-red-600 bg-red-100',
      description: 'Total reactions on content'
    }
  ];

  // Activity breakdown by type
  const activityBreakdown: ActivityBreakdown[] = [
    { category: 'Posts', count: 892, percentage: 28, icon: FileText, color: 'bg-blue-500' },
    { category: 'Comments', count: 3745, percentage: 42, icon: MessageSquare, color: 'bg-purple-500' },
    { category: 'Reactions', count: 8934, percentage: 18, icon: Heart, color: 'bg-pink-500' },
    { category: 'Shares', count: 1567, percentage: 12, icon: Share2, color: 'bg-green-500' }
  ];

  // Peak activity times
  const peakTimes = [
    { hour: '9 AM', activity: 65, label: 'Morning Peak' },
    { hour: '12 PM', activity: 85, label: 'Lunch Hour' },
    { hour: '3 PM', activity: 70, label: 'Afternoon' },
    { hour: '7 PM', activity: 95, label: 'Evening Peak' },
    { hour: '10 PM', activity: 60, label: 'Late Night' }
  ];

  // User activity segments
  const userSegments = [
    { segment: 'Power Users', count: 234, percentage: 5, description: 'Daily active, high engagement' },
    { segment: 'Regular Users', count: 1876, percentage: 35, description: 'Active 3-4 times/week' },
    { segment: 'Casual Users', count: 2456, percentage: 45, description: 'Active 1-2 times/week' },
    { segment: 'Lurkers', count: 823, percentage: 15, description: 'Read-only activity' }
  ];

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    onTimeRangeChange?.(range);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const getChangeIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4" />;
      case 'down':
        return <ArrowDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', isPositive = true) => {
    if (trend === 'stable') return 'text-gray-600';
    if (trend === 'up') return isPositive ? 'text-green-600' : 'text-red-600';
    return isPositive ? 'text-red-600' : 'text-green-600';
  };

  const renderMetricCard = (metric: ActivityMetric) => {
    const Icon = metric.icon;
    const progress = metric.target ? (metric.value / metric.target) * 100 : 0;
    const isSelected = selectedMetric === metric.id;

    return (
      <motion.div
        key={metric.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className={cn(
            "hover:shadow-lg transition-all cursor-pointer",
            isSelected && "ring-2 ring-purple-500"
          )}
          onClick={() => {
            setSelectedMetric(isSelected ? null : metric.id);
            onMetricClick?.(metric);
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                metric.color
              )}>
                <Icon className="h-5 w-5" />
              </div>
              {showComparison && metric.change !== undefined && (
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  getTrendColor(metric.trend)
                )}>
                  {getChangeIcon(metric.trend)}
                  <span>{Math.abs(metric.change).toFixed(1)}%</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {metric.value.toLocaleString()}
                  </span>
                  {metric.unit && (
                    <span className="text-sm text-gray-500">{metric.unit}</span>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-900">{metric.name}</div>
              </div>

              {showComparison && metric.previousValue && (
                <div className="text-xs text-gray-500">
                  Previous: {metric.previousValue.toLocaleString()}
                </div>
              )}

              {showTargets && metric.target && (
                <>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Target: {metric.target.toLocaleString()}</span>
                    <span className={cn(
                      "font-medium",
                      progress >= 100 ? "text-green-600" : 
                      progress >= 75 ? "text-yellow-600" : "text-red-600"
                    )}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </>
              )}

              {metric.description && (
                <p className="text-xs text-gray-500 pt-2 border-t">
                  {metric.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Metrics</h2>
          <p className="text-gray-600">Monitor community engagement and participation</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(['day', 'week', 'month', 'quarter', 'year'] as const).map((range) => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleTimeRangeChange(range)}
                className="capitalize"
              >
                {range}
              </Button>
            ))}
          </div>

          {autoRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn(
                "h-4 w-4",
                isRefreshing && "animate-spin"
              )} />
            </Button>
          )}

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activityMetrics.map(renderMetricCard)}
      </div>

      {/* Activity Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Activity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Activity Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityBreakdown.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">{activity.category}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-bold">{activity.count.toLocaleString()}</span>
                        <span className="text-gray-500 ml-1">({activity.percentage}%)</span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${activity.percentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={cn("absolute top-0 left-0 h-full", activity.color)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Activities</span>
                <span className="font-bold text-lg">
                  {activityBreakdown.reduce((sum, a) => sum + a.count, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Activity Times */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Peak Activity Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {peakTimes.map((time) => (
                <div key={time.hour}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{time.hour}</span>
                    <span className="text-xs text-gray-500">{time.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={time.activity} className="flex-1 h-2" />
                    <span className="text-sm font-medium w-10 text-right">
                      {time.activity}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <div className="font-medium mb-1">Optimization Tip</div>
                  <div>Schedule important announcements during 7 PM peak for maximum reach</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Activity Segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {userSegments.map((segment) => (
              <div 
                key={segment.segment}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {segment.percentage}%
                </div>
                <div className="font-medium text-sm mb-1">{segment.segment}</div>
                <div className="text-xs text-gray-500 mb-2">{segment.count.toLocaleString()} users</div>
                <div className="text-xs text-gray-600">{segment.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Trends */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Activity Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">+15.2%</div>
              <div className="text-sm text-gray-600">Overall Activity Growth</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">87%</div>
              <div className="text-sm text-gray-600">User Engagement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">4.5x</div>
              <div className="text-sm text-gray-600">Activity Multiplier (Peak)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}