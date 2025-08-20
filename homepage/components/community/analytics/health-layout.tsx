'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity,
  Heart,
  TrendingUp,
  Star,
  Target,
  BarChart3,
  Users,
  Sparkles,
  Calendar,
  Clock,
  Download,
  RefreshCw,
  Settings,
  Info,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActivityMetrics } from './activity-metrics';
import { EngagementQuality } from './engagement-quality';
import { GrowthIndicators } from './growth-indicators';
import { SentimentAnalysis } from './sentiment-analysis';
import { ValueCreation } from './value-creation';

interface HealthScore {
  category: string;
  score: number;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'improving' | 'declining' | 'stable';
  icon: React.ElementType;
  color: string;
}

interface HealthLayoutProps {
  userId?: string;
  isAdmin?: boolean;
  timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  onTimeRangeChange?: (range: string) => void;
  onExportData?: () => void;
  autoRefresh?: boolean;
}

export function HealthLayout({
  userId,
  isAdmin = false,
  timeRange = 'week',
  onTimeRangeChange,
  onExportData,
  autoRefresh = false
}: HealthLayoutProps) {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState(timeRange);
  const [activeTab, setActiveTab] = React.useState('overview');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Health scores
  const healthScores: HealthScore[] = [
    {
      category: 'Activity',
      score: 87,
      status: 'healthy',
      trend: 'improving',
      icon: Activity,
      color: 'text-green-600 bg-green-100'
    },
    {
      category: 'Engagement',
      score: 82,
      status: 'healthy',
      trend: 'stable',
      icon: Heart,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      category: 'Growth',
      score: 68,
      status: 'warning',
      trend: 'improving',
      icon: TrendingUp,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      category: 'Sentiment',
      score: 91,
      status: 'healthy',
      trend: 'improving',
      icon: Star,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      category: 'Value',
      score: 85,
      status: 'healthy',
      trend: 'improving',
      icon: Target,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  // Key insights
  const keyInsights = [
    {
      type: 'success',
      title: 'High Engagement Quality',
      description: 'Thread depth increased by 23% this week',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50'
    },
    {
      type: 'warning',
      title: 'Growth Slowdown',
      description: 'New member acquisition down 15%',
      icon: AlertCircle,
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      type: 'info',
      title: 'Content Milestone',
      description: '10,000 pieces of content created',
      icon: Info,
      color: 'text-blue-600 bg-blue-50'
    }
  ];

  // Overall health calculation
  const overallHealth = Math.round(
    healthScores.reduce((sum, score) => sum + score.score, 0) / healthScores.length
  );

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { status: 'Excellent', color: 'text-green-600' };
    if (score >= 70) return { status: 'Good', color: 'text-blue-600' };
    if (score >= 60) return { status: 'Fair', color: 'text-yellow-600' };
    return { status: 'Poor', color: 'text-red-600' };
  };

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    onTimeRangeChange?.(range);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Community Health Score</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{overallHealth}</span>
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={cn("text-sm", getHealthStatus(overallHealth).color)}>
                  {getHealthStatus(overallHealth).status}
                </Badge>
                <span className="text-sm text-gray-600">
                  Based on 5 key metrics
                </span>
              </div>
            </div>
            <div className="w-32 h-32 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(overallHealth / 100) * 352} 352`}
                  className="text-purple-600"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Scores Grid */}
      <div className="grid md:grid-cols-5 gap-4">
        {healthScores.map((health) => {
          const Icon = health.icon;
          return (
            <Card key={health.category} className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    health.color
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge className={cn(
                    "text-xs",
                    health.status === 'healthy' ? "bg-green-100 text-green-700" :
                    health.status === 'warning' ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {health.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">{health.score}</div>
                  <div className="text-sm font-medium text-gray-900">{health.category}</div>
                  <div className={cn(
                    "text-xs mt-1",
                    health.trend === 'improving' ? "text-green-600" :
                    health.trend === 'declining' ? "text-red-600" : "text-gray-600"
                  )}>
                    {health.trend === 'improving' ? '↑' : 
                     health.trend === 'declining' ? '↓' : '→'} {health.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Key Insights */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {keyInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <Card key={index} className={cn("border", insight.color)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">{insight.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{insight.description}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">3,456</div>
                <div className="text-sm text-gray-600">Daily Active Users</div>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">892</div>
                <div className="text-sm text-gray-600">Posts Today</div>
              </div>
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">82%</div>
                <div className="text-sm text-gray-600">Sentiment Score</div>
              </div>
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">$125K</div>
                <div className="text-sm text-gray-600">Value Created</div>
              </div>
              <Target className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Health Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-sm">Continue High-Quality Engagement</div>
                <div className="text-xs text-gray-600">Thread depth and response quality are excellent</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-600 mt-2" />
              <div>
                <div className="font-medium text-sm">Focus on Member Acquisition</div>
                <div className="text-xs text-gray-600">Implement referral programs to boost growth</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <div className="font-medium text-sm">Maintain Content Quality</div>
                <div className="text-xs text-gray-600">Keep supporting top contributors and creators</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Analytics & Health</h1>
          <p className="text-gray-600">Monitor and optimize community performance</p>
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

          <Button variant="outline" size="sm" onClick={onExportData}>
            <Download className="h-4 w-4" />
          </Button>

          {isAdmin && (
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="value">Value</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityMetrics 
            timeRange={selectedTimeRange as any}
            showComparison={true}
            showTargets={true}
            autoRefresh={autoRefresh}
          />
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <EngagementQuality
            timeRange={selectedTimeRange as any}
            showBenchmarks={true}
            showRecommendations={true}
          />
        </TabsContent>

        <TabsContent value="growth" className="mt-6">
          <GrowthIndicators
            timeRange={selectedTimeRange as any}
            showProjections={true}
            showCohorts={true}
          />
        </TabsContent>

        <TabsContent value="sentiment" className="mt-6">
          <SentimentAnalysis
            timeRange={selectedTimeRange as any}
            showConflicts={true}
            showRecommendations={true}
          />
        </TabsContent>

        <TabsContent value="value" className="mt-6">
          <ValueCreation
            timeRange={selectedTimeRange as any}
            showImpact={true}
            showContributors={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}