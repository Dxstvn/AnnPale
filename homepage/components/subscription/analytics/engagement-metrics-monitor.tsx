'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  Eye,
  Play,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  ThumbsUp,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Video,
  Calendar,
  Zap,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface EngagementMetric {
  id: string;
  name: string;
  value: number;
  formattedValue: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
  icon: React.ElementType;
  color: string;
  description: string;
  target?: number;
  benchmark?: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
  trend: 'improving' | 'stable' | 'declining';
  insights?: string[];
}

interface EngagementBreakdown {
  category: string;
  metric: string;
  value: number;
  percentage: number;
  change: number;
  color: string;
  icon: React.ElementType;
}

interface EngagementHeatmap {
  hour: number;
  day: string;
  activity: number;
  engagement: number;
}

interface EngagementMetricsMonitorProps {
  metrics?: EngagementMetric[];
  breakdown?: EngagementBreakdown[];
  heatmap?: EngagementHeatmap[];
  timeRange?: string;
  onMetricClick?: (metricId: string) => void;
  onTimeRangeChange?: (range: string) => void;
  showHeatmap?: boolean;
  showBreakdown?: boolean;
}

export function EngagementMetricsMonitor({
  metrics = [],
  breakdown = [],
  heatmap = [],
  timeRange = '30d',
  onMetricClick,
  onTimeRangeChange,
  showHeatmap = true,
  showBreakdown = true
}: EngagementMetricsMonitorProps) {
  const [expandedMetric, setExpandedMetric] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Default engagement metrics based on specification
  const defaultMetrics: EngagementMetric[] = metrics.length > 0 ? metrics : [
    {
      id: 'content_consumption',
      name: 'Content Consumption Rate',
      value: 89.2,
      formattedValue: '89.2%',
      change: 2.3,
      changeType: 'increase',
      period: 'vs last month',
      icon: Eye,
      color: 'text-blue-600',
      description: 'Percentage of subscribers actively consuming content',
      target: 85.0,
      benchmark: 80.0,
      status: 'excellent',
      trend: 'improving',
      insights: [
        'Video content showing highest engagement rates',
        'Mobile consumption up 18% month over month',
        'Weekend engagement significantly higher than weekdays'
      ]
    },
    {
      id: 'feature_utilization',
      name: 'Feature Utilization Rate',
      value: 76.8,
      formattedValue: '76.8%',
      change: 1.8,
      changeType: 'increase',
      period: 'vs last month',
      icon: Zap,
      color: 'text-purple-600',
      description: 'Percentage of available features being actively used',
      target: 80.0,
      benchmark: 70.0,
      status: 'good',
      trend: 'improving',
      insights: [
        'Live streaming features gaining traction',
        'Community features underutilized',
        'Search functionality heavily used'
      ]
    },
    {
      id: 'community_participation',
      name: 'Community Participation',
      value: 45.6,
      formattedValue: '45.6%',
      change: -0.9,
      changeType: 'decrease',
      period: 'vs last month',
      icon: MessageSquare,
      color: 'text-green-600',
      description: 'Percentage of subscribers participating in community features',
      target: 55.0,
      benchmark: 40.0,
      status: 'good',
      trend: 'stable',
      insights: [
        'Comments section most active community feature',
        'Private messaging adoption slow',
        'Creator Q&A sessions driving engagement'
      ]
    },
    {
      id: 'content_interaction',
      name: 'Content Interaction Rate',
      value: 62.4,
      formattedValue: '62.4%',
      change: 4.2,
      changeType: 'increase',
      period: 'vs last month',
      icon: Heart,
      color: 'text-red-600',
      description: 'Rate of likes, shares, and saves on content',
      target: 65.0,
      benchmark: 55.0,
      status: 'good',
      trend: 'improving',
      insights: [
        'Behind-the-scenes content getting most interactions',
        'Share rate higher for exclusive content',
        'Save functionality very popular with Gold tier'
      ]
    },
    {
      id: 'session_duration',
      name: 'Average Session Duration',
      value: 18.7,
      formattedValue: '18.7 min',
      change: 3.1,
      changeType: 'increase',
      period: 'vs last month',
      icon: Clock,
      color: 'text-orange-600',
      description: 'Average time spent per session on the platform',
      target: 22.0,
      benchmark: 15.0,
      status: 'good',
      trend: 'improving',
      insights: [
        'Video content increasing session length',
        'Notification features improving retention',
        'Mobile sessions averaging 25% shorter'
      ]
    },
    {
      id: 'support_interaction',
      name: 'Support Interaction Rate',
      value: 12.4,
      formattedValue: '12.4%',
      change: -2.1,
      changeType: 'decrease',
      period: 'vs last month',
      icon: Users,
      color: 'text-gray-600',
      description: 'Percentage of subscribers interacting with support',
      target: 10.0,
      benchmark: 15.0,
      status: 'good',
      trend: 'improving',
      insights: [
        'Fewer support tickets indicates improved UX',
        'Self-service options reducing contact rate',
        'FAQ section addressing most common issues'
      ]
    }
  ];

  // Default engagement breakdown
  const defaultBreakdown: EngagementBreakdown[] = breakdown.length > 0 ? breakdown : [
    {
      category: 'Video Content',
      metric: 'Watch Time',
      value: 78.3,
      percentage: 35,
      change: 8.2,
      color: 'text-blue-600',
      icon: Play
    },
    {
      category: 'Live Streams',
      metric: 'Live Engagement',
      value: 82.1,
      percentage: 25,
      change: 12.5,
      color: 'text-red-600',
      icon: Video
    },
    {
      category: 'Community',
      metric: 'Comments & Likes',
      value: 45.6,
      percentage: 20,
      change: -1.2,
      color: 'text-green-600',
      icon: MessageSquare
    },
    {
      category: 'Interactive Features',
      metric: 'Feature Usage',
      value: 56.8,
      percentage: 15,
      change: 3.7,
      color: 'text-purple-600',
      icon: Zap
    },
    {
      category: 'Social Sharing',
      metric: 'Share Activity',
      value: 23.4,
      percentage: 5,
      change: 15.3,
      color: 'text-pink-600',
      icon: Share2
    }
  ];

  // Calculate engagement score
  const calculateEngagementScore = () => {
    const scores = defaultMetrics.map(metric => {
      switch (metric.status) {
        case 'excellent': return 100;
        case 'good': return 75;
        case 'average': return 50;
        case 'poor': return 25;
        default: return 0;
      }
    });
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'declining': return TrendingDown;
      default: return Activity;
    }
  };

  // Get change icon
  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return ArrowUpRight;
      case 'decrease': return ArrowDownRight;
      default: return ArrowRight;
    }
  };

  const engagementScore = calculateEngagementScore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Engagement Metrics Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Engagement Score</p>
              <p className={cn(
                "text-2xl font-bold",
                engagementScore >= 80 ? "text-green-600" :
                engagementScore >= 60 ? "text-yellow-600" :
                "text-red-600"
              )}>
                {engagementScore}/100
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Content Consumption</p>
              <p className="text-2xl font-bold text-blue-600">
                {defaultMetrics.find(m => m.id === 'content_consumption')?.formattedValue}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Session</p>
              <p className="text-2xl font-bold text-orange-600">
                {defaultMetrics.find(m => m.id === 'session_duration')?.formattedValue}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Community Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {defaultMetrics.find(m => m.id === 'community_participation')?.formattedValue}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {defaultMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const ChangeIcon = getChangeIcon(metric.changeType);
          const TrendIcon = getTrendIcon(metric.trend);
          const isExpanded = expandedMetric === metric.id;

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="transition-all cursor-pointer hover:shadow-md">
                <CardHeader 
                  onClick={() => {
                    setExpandedMetric(isExpanded ? null : metric.id);
                    onMetricClick?.(metric.id);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        "bg-gray-100"
                      )}>
                        <Icon className={cn("h-5 w-5", metric.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{metric.name}</CardTitle>
                        <p className="text-sm text-gray-600">{metric.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", getStatusColor(metric.status))}>
                        {metric.status}
                      </Badge>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">{metric.formattedValue}</div>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex items-center gap-1 text-sm",
                          metric.changeType === 'increase' ? "text-green-600" : "text-red-600"
                        )}>
                          <ChangeIcon className="h-4 w-4" />
                          <span>{Math.abs(metric.change)}%</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <TrendIcon className="h-4 w-4" />
                          <span>{metric.trend}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress to Target */}
                    {metric.target && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress to target</span>
                          <span className="font-medium">
                            {Math.round((metric.value / metric.target) * 100)}%
                          </span>
                        </div>
                        <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                      </div>
                    )}

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-4"
                        >
                          {/* Benchmarks */}
                          <div className="grid grid-cols-2 gap-4">
                            {metric.target && (
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-600">Target</p>
                                <p className="text-lg font-bold text-blue-600">
                                  {metric.target}{metric.formattedValue.includes('%') ? '%' : ''}
                                </p>
                              </div>
                            )}
                            {metric.benchmark && (
                              <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <p className="text-sm text-gray-600">Benchmark</p>
                                <p className="text-lg font-bold text-purple-600">
                                  {metric.benchmark}{metric.formattedValue.includes('%') ? '%' : ''}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Insights */}
                          {metric.insights && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Key Insights:</p>
                              <ul className="space-y-1">
                                {metric.insights.map((insight, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                    <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Engagement Breakdown */}
      {showBreakdown && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Engagement by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {defaultBreakdown.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-4 w-4", item.color)} />
                          <span className="text-sm font-medium">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{item.value}%</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs",
                              item.change > 0 ? "text-green-600" : "text-red-600"
                            )}
                          >
                            {item.change > 0 ? '+' : ''}{item.change}%
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={item.percentage * 4} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{item.metric}: {item.value}%</span>
                          <span>{item.percentage}% of total</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Engagement Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Strong Metrics</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      {defaultMetrics.filter(m => m.status === 'excellent' || m.status === 'good').length}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Improving Trends</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {defaultMetrics.filter(m => m.trend === 'improving').length}
                    </p>
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Optimization Areas</span>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Community participation below target</li>
                    <li>• Mobile session duration needs improvement</li>
                    <li>• Interactive features underutilized</li>
                  </ul>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Key Insights</span>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Video content driving highest engagement</li>
                    <li>• Weekend activity significantly higher</li>
                    <li>• Gold tier users most engaged overall</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Engagement Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Engagement Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="h-6 w-6 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {defaultBreakdown.reduce((sum, item) => sum + item.value, 0).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-gray-600">Total Engagement</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {defaultMetrics.filter(m => m.changeType === 'increase').length}
                </span>
              </div>
              <p className="text-sm text-gray-600">Improving Metrics</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="h-6 w-6 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">{engagementScore}</span>
              </div>
              <p className="text-sm text-gray-600">Overall Score</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-6 w-6 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">
                  {defaultMetrics.find(m => m.id === 'session_duration')?.value}m
                </span>
              </div>
              <p className="text-sm text-gray-600">Avg Session</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}