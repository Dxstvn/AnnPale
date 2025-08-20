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
  Star,
  Eye,
  Heart,
  MessageSquare,
  Video,
  Calendar,
  Clock,
  Target,
  Activity,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Crown,
  Zap,
  Gift,
  Award,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CreatorMetric {
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
  status: 'excellent' | 'good' | 'average' | 'poor';
}

interface CreatorContent {
  id: string;
  title: string;
  type: 'video' | 'live_stream' | 'message' | 'behind_scenes';
  views: number;
  engagement: number;
  revenue: number;
  likes: number;
  comments: number;
  shares: number;
  date: string;
  tier: string;
}

interface CreatorInsight {
  type: 'performance' | 'audience' | 'content' | 'revenue';
  title: string;
  description: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
}

interface CreatorAnalyticsDashboardProps {
  creatorId?: string;
  metrics?: CreatorMetric[];
  content?: CreatorContent[];
  insights?: CreatorInsight[];
  timeRange?: string;
  onMetricClick?: (metricId: string) => void;
  onContentClick?: (contentId: string) => void;
  onTimeRangeChange?: (range: string) => void;
  onExport?: () => void;
  onRefresh?: () => void;
}

export function CreatorAnalyticsDashboard({
  creatorId = 'creator_123',
  metrics = [],
  content = [],
  insights = [],
  timeRange = '30d',
  onMetricClick,
  onContentClick,
  onTimeRangeChange,
  onExport,
  onRefresh
}: CreatorAnalyticsDashboardProps) {
  const [selectedTab, setSelectedTab] = React.useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = React.useState(timeRange);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Default creator metrics
  const defaultMetrics: CreatorMetric[] = metrics.length > 0 ? metrics : [
    {
      id: 'total_subscribers',
      name: 'Total Subscribers',
      value: 1247,
      formattedValue: '1,247',
      change: 8.3,
      changeType: 'increase',
      period: 'vs last month',
      icon: Users,
      color: 'text-blue-600',
      description: 'Total active subscribers across all tiers',
      target: 1500,
      status: 'good'
    },
    {
      id: 'monthly_revenue',
      name: 'Monthly Revenue',
      value: 12450,
      formattedValue: '$12,450',
      change: 15.7,
      changeType: 'increase',
      period: 'vs last month',
      icon: DollarSign,
      color: 'text-green-600',
      description: 'Total subscription revenue for the month',
      target: 15000,
      status: 'good'
    },
    {
      id: 'engagement_rate',
      name: 'Engagement Rate',
      value: 78.4,
      formattedValue: '78.4%',
      change: 3.2,
      changeType: 'increase',
      period: 'vs last month',
      icon: Heart,
      color: 'text-red-600',
      description: 'Average engagement across all content',
      target: 80.0,
      status: 'good'
    },
    {
      id: 'content_views',
      name: 'Content Views',
      value: 28456,
      formattedValue: '28.5K',
      change: 12.1,
      changeType: 'increase',
      period: 'vs last month',
      icon: Eye,
      color: 'text-purple-600',
      description: 'Total views across all content',
      target: 30000,
      status: 'good'
    },
    {
      id: 'avg_session_time',
      name: 'Avg Session Time',
      value: 22.3,
      formattedValue: '22.3 min',
      change: 5.8,
      changeType: 'increase',
      period: 'vs last month',
      icon: Clock,
      color: 'text-orange-600',
      description: 'Average time subscribers spend per session',
      target: 25.0,
      status: 'good'
    },
    {
      id: 'creator_rating',
      name: 'Creator Rating',
      value: 4.8,
      formattedValue: '4.8/5',
      change: 0.1,
      changeType: 'increase',
      period: 'vs last month',
      icon: Star,
      color: 'text-yellow-600',
      description: 'Average rating from subscriber feedback',
      target: 4.5,
      status: 'excellent'
    },
    {
      id: 'response_time',
      name: 'Response Time',
      value: 2.4,
      formattedValue: '2.4 hrs',
      change: -18.5,
      changeType: 'decrease',
      period: 'vs last month',
      icon: MessageSquare,
      color: 'text-indigo-600',
      description: 'Average response time to subscriber messages',
      target: 4.0,
      status: 'excellent'
    },
    {
      id: 'tier_upgrade_rate',
      name: 'Tier Upgrade Rate',
      value: 14.2,
      formattedValue: '14.2%',
      change: 2.7,
      changeType: 'increase',
      period: 'vs last month',
      icon: TrendingUp,
      color: 'text-emerald-600',
      description: 'Percentage of subscribers upgrading tiers',
      target: 15.0,
      status: 'good'
    }
  ];

  // Default content performance
  const defaultContent: CreatorContent[] = content.length > 0 ? content : [
    {
      id: 'content_1',
      title: 'Behind the Scenes: Studio Tour',
      type: 'behind_scenes',
      views: 2847,
      engagement: 92.3,
      revenue: 284.70,
      likes: 267,
      comments: 45,
      shares: 23,
      date: '2024-08-15',
      tier: 'Gold'
    },
    {
      id: 'content_2',
      title: 'Live Q&A Session',
      type: 'live_stream',
      views: 1923,
      engagement: 88.7,
      revenue: 192.30,
      likes: 187,
      comments: 89,
      shares: 12,
      date: '2024-08-14',
      tier: 'Silver'
    },
    {
      id: 'content_3',
      title: 'Personal Thank You Messages',
      type: 'message',
      views: 3456,
      engagement: 95.2,
      revenue: 518.40,
      likes: 341,
      comments: 78,
      shares: 45,
      date: '2024-08-13',
      tier: 'All'
    },
    {
      id: 'content_4',
      title: 'Exclusive Music Preview',
      type: 'video',
      views: 4127,
      engagement: 89.1,
      revenue: 412.70,
      likes: 398,
      comments: 123,
      shares: 67,
      date: '2024-08-12',
      tier: 'Gold'
    },
    {
      id: 'content_5',
      title: 'Weekly Update Vlog',
      type: 'video',
      views: 2654,
      engagement: 76.8,
      revenue: 265.40,
      likes: 234,
      comments: 56,
      shares: 19,
      date: '2024-08-11',
      tier: 'Bronze'
    }
  ];

  // Default insights
  const defaultInsights: CreatorInsight[] = insights.length > 0 ? insights : [
    {
      type: 'content',
      title: 'Behind-the-Scenes Content Performing Best',
      description: 'Your behind-the-scenes content has 15% higher engagement than other content types',
      recommendation: 'Create more behind-the-scenes content, especially studio tours and creative process videos',
      priority: 'high',
      impact: '+$500 potential monthly revenue'
    },
    {
      type: 'audience',
      title: 'Gold Tier Subscribers Most Engaged',
      description: 'Gold tier subscribers have 23% higher engagement and 2.5x longer session times',
      recommendation: 'Focus on exclusive Gold tier content and consider Gold-only live events',
      priority: 'high',
      impact: '18% higher retention rate'
    },
    {
      type: 'performance',
      title: 'Response Time Improvement Needed',
      description: 'While improving, response time is still above subscriber expectations in some regions',
      recommendation: 'Set up automated responses for common questions and schedule regular response windows',
      priority: 'medium',
      impact: '12% satisfaction increase'
    },
    {
      type: 'revenue',
      title: 'Bronze to Silver Conversion Opportunity',
      description: 'Bronze subscribers showing high engagement but low conversion to Silver tier',
      recommendation: 'Create targeted Silver tier preview content and limited-time upgrade incentives',
      priority: 'medium',
      impact: '+$300 potential monthly revenue'
    }
  ];

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

  // Get change icon
  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return ArrowUpRight;
      case 'decrease': return ArrowDownRight;
      default: return ArrowRight;
    }
  };

  // Get content type icon
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'live_stream': return Activity;
      case 'message': return MessageSquare;
      case 'behind_scenes': return Eye;
      default: return Video;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Creator Analytics Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive insights into your content performance and subscriber engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedTimeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="365d">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {defaultMetrics.slice(0, 8).map((metric, index) => {
              const Icon = metric.icon;
              const ChangeIcon = getChangeIcon(metric.changeType);

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
                            {metric.name}
                          </CardTitle>
                        </div>
                        <Badge className={cn("text-xs", getStatusColor(metric.status))}>
                          {metric.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold">{metric.formattedValue}</div>
                        <div className={cn(
                          "flex items-center gap-1 text-sm",
                          metric.changeType === 'increase' ? "text-green-600" : 
                          metric.changeType === 'decrease' ? "text-red-600" : "text-gray-600"
                        )}>
                          <ChangeIcon className="h-3 w-3" />
                          <span>{Math.abs(metric.change)}%</span>
                          <span className="text-gray-500">{metric.period}</span>
                        </div>
                        <p className="text-xs text-gray-600">{metric.description}</p>
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
                    {defaultMetrics.filter(m => m.status === 'excellent').length}
                  </div>
                  <p className="text-sm text-gray-600">Excellent Metrics</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {defaultMetrics.filter(m => m.changeType === 'increase').length}
                  </div>
                  <p className="text-sm text-gray-600">Improving Areas</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {Math.round(defaultMetrics.reduce((sum, m) => sum + m.value, 0) / defaultMetrics.length)}
                  </div>
                  <p className="text-sm text-gray-600">Avg Performance</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {defaultMetrics.filter(m => m.target && m.value >= m.target * 0.9).length}
                  </div>
                  <p className="text-sm text-gray-600">On Track Targets</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Content Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Top Performing Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {defaultContent.map((item, index) => {
                  const Icon = getContentIcon(item.type);
                  
                  return (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => onContentClick?.(item.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{item.views.toLocaleString()} views</span>
                            <span>{item.engagement}% engagement</span>
                            <span>${item.revenue}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.tier}</Badge>
                        <div className="text-sm text-gray-500">{item.date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Content Analytics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">87.3%</div>
                  <p className="text-sm text-gray-600">Average engagement across all content</p>
                  <div className="text-sm text-green-600">+5.2% vs last month</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">$1,673</div>
                  <p className="text-sm text-gray-600">Revenue from content this month</p>
                  <div className="text-sm text-green-600">+12.8% vs last month</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">15.0K</div>
                  <p className="text-sm text-gray-600">Total views this month</p>
                  <div className="text-sm text-green-600">+18.5% vs last month</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          {/* Audience Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Subscriber Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { tier: 'Bronze', count: 687, percentage: 55, color: 'text-amber-600' },
                    { tier: 'Silver', count: 423, percentage: 34, color: 'text-slate-600' },
                    { tier: 'Gold', count: 137, percentage: 11, color: 'text-yellow-600' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.tier} Tier</span>
                        <span className="text-sm">{item.count} subscribers</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={cn("h-2 rounded-full", 
                            item.tier === 'Bronze' ? 'bg-amber-500' :
                            item.tier === 'Silver' ? 'bg-slate-500' :
                            'bg-yellow-500'
                          )}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{item.percentage}% of total</span>
                        <span className={item.color}>●</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Engagement by Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { tier: 'Gold', engagement: 94.2, sessions: 8.3, color: 'text-yellow-600' },
                    { tier: 'Silver', engagement: 81.7, sessions: 6.1, color: 'text-slate-600' },
                    { tier: 'Bronze', engagement: 72.5, sessions: 4.8, color: 'text-amber-600' }
                  ].map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.tier} Tier</span>
                        <Badge className={item.color}>{item.engagement}%</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.sessions} avg sessions/month
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audience Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Audience Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Demographics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Age 18-24:</span>
                      <span>23%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age 25-34:</span>
                      <span>45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age 35-44:</span>
                      <span>24%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age 45+:</span>
                      <span>8%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Geographic Distribution</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>United States:</span>
                      <span>42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Canada:</span>
                      <span>18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>France:</span>
                      <span>15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Haiti:</span>
                      <span>12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other:</span>
                      <span>13%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Insights and Recommendations */}
          <div className="grid gap-6">
            {defaultInsights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                    <Badge className={cn("text-xs", getPriorityColor(insight.priority))}>
                      {insight.priority} priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-700">{insight.description}</p>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Recommendation:</strong> {insight.recommendation}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        <strong>Potential Impact:</strong> {insight.impact}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button className="justify-start" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Create Behind-the-Scenes Content
                </Button>
                <Button className="justify-start" variant="outline">
                  <Gift className="h-4 w-4 mr-2" />
                  Set Up Upgrade Incentive
                </Button>
                <Button className="justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Live Q&A
                </Button>
                <Button className="justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Subscriber Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}