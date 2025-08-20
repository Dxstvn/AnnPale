'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Heart,
  Users,
  MessageSquare,
  Star,
  Shield,
  Clock,
  Target,
  Zap,
  Eye,
  ThumbsUp,
  UserPlus,
  UserMinus,
  BarChart3,
  PieChart,
  LineChart,
  Info,
  RefreshCw,
  Download,
  Calendar,
  Brain,
  Globe,
  Award,
  Handshake
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HealthMetric {
  id: string;
  name: string;
  description: string;
  value: number;
  target: number;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  change: number;
  icon: React.ElementType;
  color: string;
  recommendations?: string[];
  category: 'engagement' | 'growth' | 'quality' | 'retention' | 'wellness';
}

interface CommunityHealthScore {
  overall: number;
  categories: {
    engagement: number;
    growth: number;
    quality: number;
    retention: number;
    wellness: number;
  };
  trends: {
    weekly: number;
    monthly: number;
    quarterly: number;
  };
}

interface HealthAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  recommendation: string;
  timestamp: Date;
  dismissed: boolean;
}

interface HealthMetricsProps {
  timeRange?: '7d' | '30d' | '90d';
  showAlerts?: boolean;
  showRecommendations?: boolean;
  onMetricClick?: (metric: HealthMetric) => void;
  onRefresh?: () => void;
}

export function HealthMetrics({
  timeRange = '30d',
  showAlerts = true,
  showRecommendations = true,
  onMetricClick,
  onRefresh
}: HealthMetricsProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [loading, setLoading] = React.useState(false);

  // Sample health metrics data
  const healthMetrics: HealthMetric[] = [
    {
      id: 'active_users',
      name: 'Active Users',
      description: 'Percentage of registered users active in the last 30 days',
      value: 73,
      target: 80,
      status: 'warning',
      trend: 'up',
      change: 5.2,
      icon: Users,
      color: 'text-blue-600',
      category: 'engagement',
      recommendations: [
        'Increase personalized content recommendations',
        'Create more interactive events and challenges',
        'Improve onboarding experience for new users'
      ]
    },
    {
      id: 'engagement_rate',
      name: 'Engagement Rate',
      description: 'Average interactions per active user per session',
      value: 4.8,
      target: 5.0,
      status: 'healthy',
      trend: 'up',
      change: 0.3,
      icon: Heart,
      color: 'text-red-600',
      category: 'engagement'
    },
    {
      id: 'content_quality',
      name: 'Content Quality Score',
      description: 'Based on likes, shares, and time spent reading',
      value: 79,
      target: 85,
      status: 'warning',
      trend: 'stable',
      change: 0.1,
      icon: Star,
      color: 'text-yellow-600',
      category: 'quality',
      recommendations: [
        'Encourage more detailed and helpful posts',
        'Implement content moderation guidelines',
        'Reward high-quality content creators'
      ]
    },
    {
      id: 'response_time',
      name: 'Response Time',
      description: 'Average time for questions to receive helpful answers',
      value: 2.3,
      target: 2.0,
      status: 'warning',
      trend: 'down',
      change: -0.5,
      icon: Clock,
      color: 'text-purple-600',
      category: 'quality',
      recommendations: [
        'Incentivize quick, helpful responses',
        'Identify and promote expert contributors',
        'Create better question categorization'
      ]
    },
    {
      id: 'new_member_retention',
      name: 'New Member Retention',
      description: 'Percentage of new members still active after 30 days',
      value: 45,
      target: 65,
      status: 'critical',
      trend: 'down',
      change: -8.2,
      icon: UserPlus,
      color: 'text-green-600',
      category: 'retention',
      recommendations: [
        'Improve onboarding process',
        'Assign mentors to new members',
        'Create beginner-friendly content and spaces'
      ]
    },
    {
      id: 'toxicity_score',
      name: 'Community Toxicity',
      description: 'Percentage of negative interactions (lower is better)',
      value: 8,
      target: 5,
      status: 'warning',
      trend: 'up',
      change: 1.5,
      icon: Shield,
      color: 'text-red-600',
      category: 'wellness',
      recommendations: [
        'Strengthen community guidelines enforcement',
        'Implement better reporting mechanisms',
        'Train community moderators'
      ]
    },
    {
      id: 'growth_rate',
      name: 'Member Growth Rate',
      description: 'New member acquisition rate (monthly)',
      value: 12.5,
      target: 15.0,
      status: 'warning',
      trend: 'stable',
      change: 0.2,
      icon: TrendingUp,
      color: 'text-green-600',
      category: 'growth'
    },
    {
      id: 'knowledge_sharing',
      name: 'Knowledge Sharing Index',
      description: 'Quality of information exchange and learning',
      value: 82,
      target: 85,
      status: 'healthy',
      trend: 'up',
      change: 3.1,
      icon: Brain,
      color: 'text-indigo-600',
      category: 'quality'
    },
    {
      id: 'connection_strength',
      name: 'Connection Strength',
      description: 'Depth of relationships between community members',
      value: 76,
      target: 80,
      status: 'healthy',
      trend: 'up',
      change: 4.2,
      icon: Handshake,
      color: 'text-blue-600',
      category: 'engagement'
    },
    {
      id: 'leadership_pipeline',
      name: 'Leadership Pipeline',
      description: 'Development of community leaders and moderators',
      value: 91,
      target: 85,
      status: 'healthy',
      trend: 'up',
      change: 2.8,
      icon: Award,
      color: 'text-yellow-600',
      category: 'wellness'
    }
  ];

  // Calculate overall health score
  const healthScore: CommunityHealthScore = {
    overall: 76,
    categories: {
      engagement: 78,
      growth: 72,
      quality: 80,
      retention: 68,
      wellness: 85
    },
    trends: {
      weekly: 2.1,
      monthly: 5.3,
      quarterly: 8.7
    }
  };

  // Sample health alerts
  const healthAlerts: HealthAlert[] = [
    {
      id: 'retention-alert',
      type: 'critical',
      title: 'New Member Retention Below Target',
      description: 'Only 45% of new members remain active after 30 days',
      recommendation: 'Implement enhanced onboarding and mentorship program',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      dismissed: false
    },
    {
      id: 'toxicity-alert',
      type: 'warning',
      title: 'Slight Increase in Negative Interactions',
      description: 'Toxicity score has increased by 1.5% this month',
      recommendation: 'Review and update community guidelines',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      dismissed: false
    },
    {
      id: 'growth-info',
      type: 'info',
      title: 'Growth Rate Stabilizing',
      description: 'Member growth rate has plateaued at 12.5%',
      recommendation: 'Consider new marketing initiatives or referral programs',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      dismissed: false
    }
  ];

  const getStatusIcon = (status: HealthMetric['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: HealthMetric['status']) => {
    switch (status) {
      case 'healthy': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'critical': return 'border-red-200 bg-red-50';
    }
  };

  const getTrendIcon = (trend: HealthMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-600" />;
      case 'stable': return <Activity className="h-3 w-3 text-gray-600" />;
    }
  };

  const getAlertIcon = (type: HealthAlert['type']) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info': return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const filteredMetrics = selectedCategory === 'all' 
    ? healthMetrics 
    : healthMetrics.filter(metric => metric.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Metrics', count: healthMetrics.length },
    { id: 'engagement', name: 'Engagement', count: healthMetrics.filter(m => m.category === 'engagement').length },
    { id: 'growth', name: 'Growth', count: healthMetrics.filter(m => m.category === 'growth').length },
    { id: 'quality', name: 'Quality', count: healthMetrics.filter(m => m.category === 'quality').length },
    { id: 'retention', name: 'Retention', count: healthMetrics.filter(m => m.category === 'retention').length },
    { id: 'wellness', name: 'Wellness', count: healthMetrics.filter(m => m.category === 'wellness').length }
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRefresh?.();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Community Health Metrics</h2>
          <p className="text-gray-600">Monitor the overall wellness and performance of your community</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Overall Health Score */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-600" />
            Overall Community Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-purple-600"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + (healthScore.overall / 100) * 50}% 0%, ${50 + (healthScore.overall / 100) * 50}% 100%, 50% 100%)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{healthScore.overall}%</div>
                    <div className="text-xs text-gray-600">Health Score</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+{healthScore.trends.monthly}% this month</span>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(healthScore.categories).map(([category, score]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="font-medium text-sm capitalize">{category}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={score} className="w-24 h-2" />
                    <span className="text-sm font-medium w-12">{score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Alerts */}
      {showAlerts && healthAlerts.filter(alert => !alert.dismissed).length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Health Alerts</h3>
          {healthAlerts.filter(alert => !alert.dismissed).map(alert => (
            <Alert key={alert.id} className={cn(
              "border-l-4",
              alert.type === 'critical' ? "border-l-red-500 bg-red-50" :
              alert.type === 'warning' ? "border-l-yellow-500 bg-yellow-50" :
              "border-l-blue-500 bg-blue-50"
            )}>
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{alert.title}</h4>
                  <AlertDescription className="mt-1">
                    {alert.description}
                  </AlertDescription>
                  <div className="mt-2 p-2 bg-white rounded text-xs">
                    <strong>Recommendation:</strong> {alert.recommendation}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {alert.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.name}
            <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Health Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map(metric => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md border-l-4",
                  getStatusColor(metric.status)
                )}
                onClick={() => onMetricClick?.(metric)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-5 w-5", metric.color)} />
                      {getStatusIcon(metric.status)}
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span className={cn(
                        "text-xs font-medium",
                        metric.trend === 'up' ? "text-green-600" : 
                        metric.trend === 'down' ? "text-red-600" : "text-gray-600"
                      )}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">{metric.name}</h4>
                    <p className="text-xs text-gray-600">{metric.description}</p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Current: {metric.value}{metric.id.includes('time') ? 'h' : '%'}</span>
                        <span>Target: {metric.target}{metric.id.includes('time') ? 'h' : '%'}</span>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                    </div>

                    <Badge variant="outline" className={cn(
                      "text-xs",
                      metric.status === 'healthy' ? "border-green-600 text-green-600" :
                      metric.status === 'warning' ? "border-yellow-600 text-yellow-600" :
                      "border-red-600 text-red-600"
                    )}>
                      {metric.status}
                    </Badge>
                  </div>

                  {showRecommendations && metric.recommendations && metric.status !== 'healthy' && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="font-medium">Recommendations:</p>
                        {metric.recommendations.slice(0, 2).map((rec, index) => (
                          <p key={index}>• {rec}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-lg font-bold text-green-600">
                {healthMetrics.filter(m => m.status === 'healthy').length}
              </div>
              <div className="text-sm text-gray-600">Healthy Metrics</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <div className="text-lg font-bold text-yellow-600">
                {healthMetrics.filter(m => m.status === 'warning').length}
              </div>
              <div className="text-sm text-gray-600">Need Attention</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-lg font-bold text-red-600">
                {healthMetrics.filter(m => m.status === 'critical').length}
              </div>
              <div className="text-sm text-gray-600">Critical Issues</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-lg font-bold text-blue-600">
                {healthMetrics.filter(m => m.trend === 'up').length}
              </div>
              <div className="text-sm text-gray-600">Improving</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}