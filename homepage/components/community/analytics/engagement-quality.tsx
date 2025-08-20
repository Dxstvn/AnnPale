'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare,
  Clock,
  Heart,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Users,
  Star,
  Zap,
  Target,
  Award,
  Info,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface QualityMetric {
  id: string;
  name: string;
  value: number;
  unit?: string;
  score?: number;
  maxScore?: number;
  benchmark?: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  trend: 'improving' | 'declining' | 'stable';
  description: string;
  icon: React.ElementType;
  color: string;
}

interface EngagementPattern {
  pattern: string;
  frequency: number;
  quality: 'high' | 'medium' | 'low';
  impact: string;
  recommendation?: string;
}

interface ResponseMetric {
  type: string;
  avgTime: string;
  rate: number;
  quality: number;
  trend: 'up' | 'down' | 'stable';
}

interface EngagementQualityProps {
  timeRange?: 'day' | 'week' | 'month' | 'quarter';
  onMetricClick?: (metric: QualityMetric) => void;
  onExportData?: () => void;
  showBenchmarks?: boolean;
  showRecommendations?: boolean;
}

export function EngagementQuality({
  timeRange = 'week',
  onMetricClick,
  onExportData,
  showBenchmarks = true,
  showRecommendations = true
}: EngagementQualityProps) {
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null);
  const [filterQuality, setFilterQuality] = React.useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Quality metrics
  const qualityMetrics: QualityMetric[] = [
    {
      id: 'thread-length',
      name: 'Average Thread Length',
      value: 8.3,
      unit: 'messages',
      benchmark: 7.0,
      status: 'excellent',
      trend: 'improving',
      description: 'Depth of conversations indicates engagement quality',
      icon: MessageSquare,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'response-time',
      name: 'Response Time',
      value: 2.4,
      unit: 'hours',
      benchmark: 4.0,
      status: 'excellent',
      trend: 'improving',
      description: 'How quickly community members respond to each other',
      icon: Clock,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'sentiment-score',
      name: 'Sentiment Score',
      value: 82,
      unit: '%',
      score: 82,
      maxScore: 100,
      benchmark: 75,
      status: 'good',
      trend: 'stable',
      description: 'Overall positivity of community interactions',
      icon: Heart,
      color: 'text-pink-600 bg-pink-100'
    },
    {
      id: 'help-resolution',
      name: 'Help Resolution',
      value: 89,
      unit: '%',
      benchmark: 85,
      status: 'excellent',
      trend: 'improving',
      description: 'Percentage of help requests successfully resolved',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'return-frequency',
      name: 'Return Frequency',
      value: 4.2,
      unit: 'days/week',
      benchmark: 3.5,
      status: 'good',
      trend: 'stable',
      description: 'How often users return to participate',
      icon: Activity,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      id: 'quality-ratio',
      name: 'Quality Content Ratio',
      value: 73,
      unit: '%',
      benchmark: 70,
      status: 'good',
      trend: 'improving',
      description: 'Percentage of high-quality contributions',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-100'
    }
  ];

  // Engagement patterns
  const engagementPatterns: EngagementPattern[] = [
    {
      pattern: 'Deep Discussions',
      frequency: 234,
      quality: 'high',
      impact: 'Knowledge sharing',
      recommendation: 'Feature these in community highlights'
    },
    {
      pattern: 'Quick Answers',
      frequency: 567,
      quality: 'medium',
      impact: 'Problem solving',
      recommendation: 'Create FAQ from common questions'
    },
    {
      pattern: 'Social Interactions',
      frequency: 892,
      quality: 'medium',
      impact: 'Community bonding',
      recommendation: 'Encourage with recognition'
    },
    {
      pattern: 'Content Sharing',
      frequency: 345,
      quality: 'high',
      impact: 'Value creation',
      recommendation: 'Highlight top contributors'
    },
    {
      pattern: 'Support Requests',
      frequency: 123,
      quality: 'high',
      impact: 'Member assistance',
      recommendation: 'Maintain quick response times'
    }
  ];

  // Response metrics
  const responseMetrics: ResponseMetric[] = [
    { type: 'First Response', avgTime: '1.2h', rate: 92, quality: 4.5, trend: 'up' },
    { type: 'Full Resolution', avgTime: '4.8h', rate: 89, quality: 4.3, trend: 'stable' },
    { type: 'Follow-up', avgTime: '2.1h', rate: 78, quality: 4.1, trend: 'up' },
    { type: 'Escalation', avgTime: '6.5h', rate: 95, quality: 4.6, trend: 'down' }
  ];

  // Content quality breakdown
  const contentQuality = [
    { type: 'High Quality', count: 3456, percentage: 73, color: 'bg-green-500' },
    { type: 'Medium Quality', count: 987, percentage: 21, color: 'bg-yellow-500' },
    { type: 'Low Quality', count: 284, percentage: 6, color: 'bg-red-500' }
  ];

  // Engagement depth levels
  const engagementDepth = [
    { level: 'Surface', description: 'Likes & reactions only', users: 1234, percentage: 25 },
    { level: 'Moderate', description: 'Comments & shares', users: 2345, percentage: 48 },
    { level: 'Deep', description: 'Creates content & helps', users: 987, percentage: 20 },
    { level: 'Champion', description: 'Leads & mentors', users: 345, percentage: 7 }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: 'text-green-600 bg-green-100',
      good: 'text-blue-600 bg-blue-100',
      fair: 'text-yellow-600 bg-yellow-100',
      poor: 'text-red-600 bg-red-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getQualityColor = (quality: string) => {
    const colors = {
      high: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-red-600 bg-red-100'
    };
    return colors[quality as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const renderMetricCard = (metric: QualityMetric) => {
    const Icon = metric.icon;
    const isSelected = selectedMetric === metric.id;
    const performance = metric.benchmark 
      ? ((metric.value / metric.benchmark - 1) * 100).toFixed(1)
      : null;

    return (
      <Card
        key={metric.id}
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
            <Badge className={cn("text-xs", getStatusColor(metric.status))}>
              {metric.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{metric.value}</span>
                {metric.unit && (
                  <span className="text-sm text-gray-500">{metric.unit}</span>
                )}
              </div>
              <div className="text-sm font-medium text-gray-900">{metric.name}</div>
            </div>

            {showBenchmarks && metric.benchmark && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Benchmark: {metric.benchmark}</span>
                <span className={cn(
                  "font-medium",
                  performance && parseFloat(performance) >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {performance && parseFloat(performance) >= 0 ? '+' : ''}{performance}%
                </span>
              </div>
            )}

            {metric.score && metric.maxScore && (
              <Progress 
                value={(metric.score / metric.maxScore) * 100} 
                className="h-2"
              />
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-gray-500">Trend</span>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                metric.trend === 'improving' ? "text-green-600" :
                metric.trend === 'declining' ? "text-red-600" : "text-gray-600"
              )}>
                {metric.trend === 'improving' ? <TrendingUp className="h-3 w-3" /> :
                 metric.trend === 'declining' ? <TrendingDown className="h-3 w-3" /> :
                 <Activity className="h-3 w-3" />}
                {metric.trend}
              </div>
            </div>

            <p className="text-xs text-gray-500">{metric.description}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Engagement Quality</h2>
          <p className="text-gray-600">Measure the depth and value of community interactions</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterQuality}
            onChange={(e) => setFilterQuality(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Quality</option>
            <option value="high">High Quality</option>
            <option value="medium">Medium Quality</option>
            <option value="low">Low Quality</option>
          </select>
          
          <Button variant="outline" size="sm" onClick={onExportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quality Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {qualityMetrics.map(renderMetricCard)}
      </div>

      {/* Engagement Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Engagement Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Engagement Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {engagementPatterns
                .filter(p => filterQuality === 'all' || p.quality === filterQuality)
                .map((pattern) => (
                <div 
                  key={pattern.pattern}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-sm">{pattern.pattern}</div>
                      <div className="text-xs text-gray-500">{pattern.impact}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">{pattern.frequency}</div>
                      <Badge className={cn("text-xs", getQualityColor(pattern.quality))}>
                        {pattern.quality}
                      </Badge>
                    </div>
                  </div>
                  {showRecommendations && pattern.recommendation && (
                    <div className="flex items-start gap-2 mt-2 pt-2 border-t">
                      <Info className="h-3 w-3 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-800">{pattern.recommendation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Response Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {responseMetrics.map((metric) => (
                <div key={metric.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{metric.type}</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">{metric.avgTime}</span>
                      <Badge variant="outline" className="text-xs">
                        {metric.rate}% rate
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={metric.rate} className="flex-1 h-2" />
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-medium">{metric.quality}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Quality & Engagement Depth */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Content Quality Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Content Quality Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentQuality.map((quality) => (
                <div key={quality.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{quality.type}</span>
                    <span className="text-sm">
                      <span className="font-bold">{quality.count.toLocaleString()}</span>
                      <span className="text-gray-500 ml-1">({quality.percentage}%)</span>
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${quality.percentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={quality.color}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span>73% high-quality content exceeds industry benchmark of 70%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Depth */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Depth Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {engagementDepth.map((depth, index) => (
                <div 
                  key={depth.level}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-8 rounded-full",
                      index === 0 ? "bg-gray-400" :
                      index === 1 ? "bg-blue-400" :
                      index === 2 ? "bg-purple-400" : "bg-yellow-400"
                    )} />
                    <div>
                      <div className="font-medium text-sm">{depth.level}</div>
                      <div className="text-xs text-gray-500">{depth.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{depth.percentage}%</div>
                    <div className="text-xs text-gray-500">{depth.users.toLocaleString()} users</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Score Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Overall Quality Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">82/100</div>
              <div className="text-sm text-gray-600">Quality Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">A-</div>
              <div className="text-sm text-gray-600">Grade</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">+5.2%</div>
              <div className="text-sm text-gray-600">vs Last Period</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">Top 15%</div>
              <div className="text-sm text-gray-600">Industry Rank</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}