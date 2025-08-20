'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Heart,
  Star,
  Activity,
  Clock,
  Target,
  Zap,
  Award,
  Brain,
  Compass,
  Eye,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  target?: number;
  format: 'number' | 'percentage' | 'time' | 'currency';
}

interface PersonaDistribution {
  personaId: string;
  name: string;
  count: number;
  percentage: number;
  change: number;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface EngagementTrend {
  date: string;
  level1: number; // Lurkers
  level2: number; // Observers
  level3: number; // Participants
  level4: number; // Contributors
  level5: number; // Leaders
  total: number;
}

interface CommunityHealthIndicator {
  id: string;
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  description: string;
  recommendation?: string;
}

interface AnalyticsDashboardProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void;
  onExport?: (format: 'csv' | 'pdf') => void;
  onRefresh?: () => void;
}

export function AnalyticsDashboard({
  timeRange = '30d',
  onTimeRangeChange,
  onExport,
  onRefresh
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [loading, setLoading] = React.useState(false);

  // Sample analytics data
  const keyMetrics: AnalyticsMetric[] = [
    {
      id: 'total_members',
      name: 'Total Members',
      value: 1247,
      change: 12.5,
      trend: 'up',
      period: 'vs last month',
      format: 'number'
    },
    {
      id: 'active_members',
      name: 'Active Members',
      value: 73,
      change: 8.2,
      trend: 'up',
      period: 'this month',
      target: 80,
      format: 'percentage'
    },
    {
      id: 'engagement_score',
      name: 'Engagement Score',
      value: 4.8,
      change: 0.3,
      trend: 'up',
      period: 'out of 5.0',
      target: 4.5,
      format: 'number'
    },
    {
      id: 'retention_rate',
      name: 'Retention Rate',
      value: 89,
      change: 5.1,
      trend: 'up',
      period: '90-day retention',
      target: 85,
      format: 'percentage'
    },
    {
      id: 'avg_session',
      name: 'Avg Session Time',
      value: 28,
      change: -2.3,
      trend: 'down',
      period: 'minutes',
      format: 'time'
    },
    {
      id: 'content_velocity',
      name: 'Content Velocity',
      value: 145,
      change: 18.7,
      trend: 'up',
      period: 'posts per week',
      format: 'number'
    }
  ];

  const personaDistribution: PersonaDistribution[] = [
    {
      personaId: 'leader',
      name: 'Leaders',
      count: 12,
      percentage: 1,
      change: 0.2,
      color: 'bg-yellow-500',
      trend: 'up'
    },
    {
      personaId: 'contributor',
      name: 'Contributors',
      count: 112,
      percentage: 9,
      change: 1.5,
      color: 'bg-purple-500',
      trend: 'up'
    },
    {
      personaId: 'participant',
      name: 'Participants',
      count: 187,
      percentage: 15,
      change: -0.8,
      color: 'bg-green-500',
      trend: 'down'
    },
    {
      personaId: 'observer',
      name: 'Observers',
      count: 374,
      percentage: 30,
      change: 2.1,
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      personaId: 'lurker',
      name: 'Lurkers',
      count: 562,
      percentage: 45,
      change: -1.2,
      color: 'bg-gray-500',
      trend: 'down'
    }
  ];

  const communityHealth: CommunityHealthIndicator[] = [
    {
      id: 'diversity',
      name: 'Persona Diversity',
      value: 85,
      status: 'healthy',
      description: 'Good distribution across all persona types'
    },
    {
      id: 'progression',
      name: 'Member Progression',
      value: 67,
      status: 'warning',
      description: 'Member advancement through engagement levels',
      recommendation: 'Create more pathways for lurkers to become participants'
    },
    {
      id: 'leadership',
      name: 'Leadership Pipeline',
      value: 92,
      status: 'healthy',
      description: 'Strong leadership development and succession'
    },
    {
      id: 'toxicity',
      name: 'Community Toxicity',
      value: 8,
      status: 'healthy',
      description: 'Low levels of negative behavior'
    },
    {
      id: 'knowledge_sharing',
      name: 'Knowledge Sharing',
      value: 76,
      status: 'healthy',
      description: 'Active exchange of information and expertise'
    },
    {
      id: 'newcomer_retention',
      name: 'Newcomer Retention',
      value: 45,
      status: 'critical',
      description: 'Percentage of new members still active after 30 days',
      recommendation: 'Improve onboarding experience and early engagement'
    }
  ];

  // Sample engagement trends (last 30 days)
  const engagementTrends: EngagementTrend[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    return {
      date: date.toISOString().split('T')[0],
      level1: Math.floor(Math.random() * 100) + 450, // Lurkers
      level2: Math.floor(Math.random() * 50) + 300,  // Observers
      level3: Math.floor(Math.random() * 30) + 150,  // Participants
      level4: Math.floor(Math.random() * 20) + 80,   // Contributors
      level5: Math.floor(Math.random() * 5) + 10,    // Leaders
      total: 0
    };
  }).map(trend => ({
    ...trend,
    total: trend.level1 + trend.level2 + trend.level3 + trend.level4 + trend.level5
  }));

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRefresh?.();
    }, 1500);
  };

  const getMetricIcon = (metricId: string) => {
    const iconMap: Record<string, React.ElementType> = {
      total_members: Users,
      active_members: Activity,
      engagement_score: Heart,
      retention_rate: Target,
      avg_session: Clock,
      content_velocity: MessageSquare
    };
    return iconMap[metricId] || BarChart3;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getHealthStatusIcon = (status: CommunityHealthIndicator['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const formatMetricValue = (metric: AnalyticsMetric) => {
    switch (metric.format) {
      case 'percentage':
        return `${metric.value}%`;
      case 'time':
        return `${metric.value}m`;
      case 'currency':
        return `$${metric.value.toLocaleString()}`;
      default:
        return metric.value.toLocaleString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Community Psychology Analytics</h2>
          <p className="text-gray-600">Understanding engagement patterns and member behavior</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => onTimeRangeChange?.(range)}
                className="text-xs"
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport?.('csv')}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {keyMetrics.map((metric) => {
          const Icon = getMetricIcon(metric.id);
          return (
            <Card key={metric.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-5 w-5 text-purple-600" />
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{formatMetricValue(metric)}</p>
                  <p className="text-sm text-gray-600">{metric.name}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={cn(
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    )}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-gray-500">{metric.period}</span>
                  </div>
                  {metric.target && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Target: {metric.target}{metric.format === 'percentage' ? '%' : ''}</span>
                        <span>{((metric.value / metric.target) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-1" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Detailed Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="personas">Personas</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Engagement Pyramid Visualization */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Engagement Pyramid Distribution</h4>
                  <div className="space-y-2">
                    {personaDistribution.reverse().map((persona, index) => (
                      <div key={persona.personaId} className="relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{persona.name}</span>
                          <span className="text-sm text-gray-600">{persona.count} ({persona.percentage}%)</span>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-6">
                            <div 
                              className={cn("h-6 rounded-full flex items-center justify-center", persona.color)}
                              style={{ width: `${persona.percentage * 2}%` }}
                            >
                              <span className="text-white text-xs font-medium">
                                {persona.percentage}%
                              </span>
                            </div>
                          </div>
                          <div className="absolute right-2 top-1.5">
                            {getTrendIcon(persona.trend)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Recent Activity Trends</h4>
                  <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Interactive Chart</p>
                      <p className="text-xs">Last 30 days engagement data</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personas" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personaDistribution.map((persona) => (
                  <Card key={persona.personaId} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", persona.color)}>
                          <span className="text-white font-bold text-sm">{persona.percentage}%</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{persona.name}</h4>
                          <p className="text-sm text-gray-600">{persona.count} members</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Growth</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(persona.trend)}
                          <span className={cn(
                            "text-xs",
                            persona.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          )}>
                            {persona.change > 0 ? '+' : ''}{persona.change}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base">Persona Migration Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Activity className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-sm">Persona transition flow diagram</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Engagement Levels Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Multi-line Chart</p>
                        <p className="text-xs">5 engagement levels tracked</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Activity Heatmap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Calendar className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Activity Heatmap</p>
                        <p className="text-xs">Peak engagement times</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2.3k</div>
                  <div className="text-sm text-gray-600">Daily Interactions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">145</div>
                  <div className="text-sm text-gray-600">Weekly Posts</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">89%</div>
                  <div className="text-sm text-gray-600">Response Rate</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">28m</div>
                  <div className="text-sm text-gray-600">Avg Session</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {communityHealth.map((indicator) => (
                  <Card key={indicator.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{indicator.name}</h4>
                        {getHealthStatusIcon(indicator.status)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">{indicator.value}%</span>
                          <Badge 
                            variant={
                              indicator.status === 'healthy' ? 'default' :
                              indicator.status === 'warning' ? 'secondary' : 'destructive'
                            }
                          >
                            {indicator.status}
                          </Badge>
                        </div>
                        <Progress 
                          value={indicator.value} 
                          className={cn(
                            "h-2",
                            indicator.status === 'healthy' ? "bg-green-100" :
                            indicator.status === 'warning' ? "bg-yellow-100" : "bg-red-100"
                          )}
                        />
                        <p className="text-sm text-gray-600">{indicator.description}</p>
                        {indicator.recommendation && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                            <Info className="h-3 w-3 inline mr-1" />
                            {indicator.recommendation}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}