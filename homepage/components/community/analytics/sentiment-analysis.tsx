'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Smile,
  Frown,
  Meh,
  Star,
  Flag,
  Shield,
  Activity,
  BarChart3,
  Info,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SentimentMetric {
  id: string;
  name: string;
  score: number;
  previousScore?: number;
  change?: number;
  status: 'positive' | 'neutral' | 'negative';
  description: string;
  icon: React.ElementType;
  color: string;
}

interface SentimentCategory {
  category: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
  trend: 'improving' | 'declining' | 'stable';
}

interface ConflictMetric {
  type: string;
  frequency: number;
  severity: 'low' | 'medium' | 'high';
  resolved: number;
  avgResolutionTime: string;
}

interface SatisfactionMetric {
  area: string;
  score: number;
  target: number;
  feedback: number;
  priority: 'high' | 'medium' | 'low';
}

interface SentimentAnalysisProps {
  timeRange?: 'day' | 'week' | 'month' | 'quarter';
  onMetricClick?: (metric: SentimentMetric) => void;
  onExportData?: () => void;
  showConflicts?: boolean;
  showRecommendations?: boolean;
}

export function SentimentAnalysis({
  timeRange = 'week',
  onMetricClick,
  onExportData,
  showConflicts = true,
  showRecommendations = true
}: SentimentAnalysisProps) {
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null);
  const [filterSentiment, setFilterSentiment] = React.useState<'all' | 'positive' | 'neutral' | 'negative'>('all');

  // Core sentiment metrics
  const sentimentMetrics: SentimentMetric[] = [
    {
      id: 'overall-sentiment',
      name: 'Overall Sentiment',
      score: 82,
      previousScore: 78,
      change: 5.1,
      status: 'positive',
      description: 'General community mood and atmosphere',
      icon: Heart,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'nps-score',
      name: 'NPS Score',
      score: 42,
      previousScore: 38,
      change: 10.5,
      status: 'positive',
      description: 'Net Promoter Score from surveys',
      icon: Star,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'satisfaction',
      name: 'Satisfaction Score',
      score: 4.2,
      previousScore: 4.0,
      change: 5.0,
      status: 'positive',
      description: 'Average satisfaction rating (out of 5)',
      icon: Smile,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'conflict-frequency',
      name: 'Conflict Frequency',
      score: 8,
      previousScore: 12,
      change: -33.3,
      status: 'positive',
      description: 'Number of conflicts per 1000 interactions',
      icon: AlertTriangle,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 'positive-mentions',
      name: 'Positive Mentions',
      score: 73,
      previousScore: 68,
      change: 7.4,
      status: 'positive',
      description: 'Percentage of positive community mentions',
      icon: ThumbsUp,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'support-tickets',
      name: 'Support Tickets',
      score: 23,
      previousScore: 31,
      change: -25.8,
      status: 'positive',
      description: 'Active support tickets (lower is better)',
      icon: MessageSquare,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  // Sentiment by category
  const sentimentCategories: SentimentCategory[] = [
    { category: 'Content Quality', positive: 456, neutral: 123, negative: 45, total: 624, trend: 'improving' },
    { category: 'Platform Features', positive: 389, neutral: 167, negative: 78, total: 634, trend: 'stable' },
    { category: 'Community Support', positive: 512, neutral: 98, negative: 23, total: 633, trend: 'improving' },
    { category: 'Creator Interaction', positive: 423, neutral: 145, negative: 56, total: 624, trend: 'improving' },
    { category: 'Technical Issues', positive: 234, neutral: 189, negative: 123, total: 546, trend: 'declining' }
  ];

  // Conflict metrics
  const conflictMetrics: ConflictMetric[] = [
    { type: 'Disagreements', frequency: 45, severity: 'low', resolved: 42, avgResolutionTime: '2.3h' },
    { type: 'Spam/Abuse', frequency: 23, severity: 'medium', resolved: 23, avgResolutionTime: '0.5h' },
    { type: 'Harassment', frequency: 3, severity: 'high', resolved: 3, avgResolutionTime: '0.2h' },
    { type: 'Misinformation', frequency: 12, severity: 'medium', resolved: 11, avgResolutionTime: '1.8h' },
    { type: 'Off-topic', frequency: 34, severity: 'low', resolved: 32, avgResolutionTime: '3.5h' }
  ];

  // Satisfaction by area
  const satisfactionMetrics: SatisfactionMetric[] = [
    { area: 'Content Discovery', score: 4.1, target: 4.5, feedback: 234, priority: 'high' },
    { area: 'User Experience', score: 4.3, target: 4.5, feedback: 456, priority: 'medium' },
    { area: 'Community Features', score: 4.2, target: 4.0, feedback: 345, priority: 'low' },
    { area: 'Support Quality', score: 4.5, target: 4.5, feedback: 123, priority: 'low' },
    { area: 'Platform Speed', score: 3.8, target: 4.5, feedback: 567, priority: 'high' }
  ];

  // Sentiment trends
  const sentimentTrends = [
    { period: 'Mon', positive: 72, neutral: 20, negative: 8 },
    { period: 'Tue', positive: 75, neutral: 18, negative: 7 },
    { period: 'Wed', positive: 78, neutral: 16, negative: 6 },
    { period: 'Thu', positive: 80, neutral: 15, negative: 5 },
    { period: 'Fri', positive: 82, neutral: 13, negative: 5 },
    { period: 'Sat', positive: 83, neutral: 12, negative: 5 },
    { period: 'Sun', positive: 82, neutral: 13, negative: 5 }
  ];

  const getSentimentIcon = (status: string) => {
    switch (status) {
      case 'positive':
        return <Smile className="h-4 w-4" />;
      case 'negative':
        return <Frown className="h-4 w-4" />;
      default:
        return <Meh className="h-4 w-4" />;
    }
  };

  const getSentimentColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-green-600 bg-green-100';
    }
  };

  const renderMetricCard = (metric: SentimentMetric) => {
    const Icon = metric.icon;
    const isSelected = selectedMetric === metric.id;

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
            <Badge className={cn("text-xs", getSentimentColor(metric.status))}>
              {getSentimentIcon(metric.status)}
              <span className="ml-1">{metric.status}</span>
            </Badge>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">
                  {metric.id === 'satisfaction' ? metric.score.toFixed(1) : metric.score}
                </span>
                {metric.id === 'satisfaction' && (
                  <span className="text-sm text-gray-500">/5</span>
                )}
                {metric.id !== 'satisfaction' && metric.id !== 'nps-score' && (
                  <span className="text-sm text-gray-500">%</span>
                )}
              </div>
              <div className="text-sm font-medium text-gray-900">{metric.name}</div>
            </div>

            {metric.change !== undefined && (
              <div className={cn(
                "flex items-center gap-1 text-sm",
                metric.change > 0 ? "text-green-600" : "text-red-600"
              )}>
                {metric.change > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                <span>{Math.abs(metric.change).toFixed(1)}%</span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            )}

            <p className="text-xs text-gray-500 pt-2 border-t">{metric.description}</p>
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
          <h2 className="text-2xl font-bold">Community Sentiment</h2>
          <p className="text-gray-600">Monitor community mood and satisfaction</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterSentiment}
            onChange={(e) => setFilterSentiment(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Sentiment</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          
          <Button variant="outline" size="sm" onClick={onExportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sentiment Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sentimentMetrics.map(renderMetricCard)}
      </div>

      {/* Sentiment Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sentiment by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sentiment by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sentimentCategories.map((category) => {
                const positivePercent = (category.positive / category.total) * 100;
                const neutralPercent = (category.neutral / category.total) * 100;
                const negativePercent = (category.negative / category.total) * 100;

                return (
                  <div key={category.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {category.total} mentions
                        </Badge>
                        {category.trend === 'improving' && <TrendingUp className="h-3 w-3 text-green-600" />}
                        {category.trend === 'declining' && <TrendingDown className="h-3 w-3 text-red-600" />}
                      </div>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${positivePercent}%` }}
                        className="bg-green-500"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${neutralPercent}%` }}
                        className="bg-gray-400"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${negativePercent}%` }}
                        className="bg-red-500"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{positivePercent.toFixed(0)}% positive</span>
                      <span>{neutralPercent.toFixed(0)}% neutral</span>
                      <span>{negativePercent.toFixed(0)}% negative</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Satisfaction Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Satisfaction by Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {satisfactionMetrics.map((metric) => {
                const progress = (metric.score / 5) * 100;
                const targetProgress = (metric.target / 5) * 100;

                return (
                  <div key={metric.area}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{metric.area}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{metric.score.toFixed(1)}</span>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            metric.priority === 'high' ? "border-red-500 text-red-600" :
                            metric.priority === 'medium' ? "border-yellow-500 text-yellow-600" :
                            "border-green-500 text-green-600"
                          )}
                        >
                          {metric.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={progress} className="h-2" />
                      <div 
                        className="absolute top-0 w-0.5 h-2 bg-red-600"
                        style={{ left: `${targetProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{metric.feedback} responses</span>
                      <span>Target: {metric.target}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflict Analysis */}
      {showConflicts && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Conflict Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {conflictMetrics.map((conflict) => (
                <div key={conflict.type} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm mb-2">{conflict.type}</div>
                  <div className="text-2xl font-bold mb-1">{conflict.frequency}</div>
                  <Badge className={cn("text-xs mb-2", getSeverityColor(conflict.severity))}>
                    {conflict.severity}
                  </Badge>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>{conflict.resolved}/{conflict.frequency} resolved</div>
                    <div>Avg: {conflict.avgResolutionTime}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sentiment Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sentiment Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sentimentTrends.map((day) => (
              <div key={day.period} className="flex items-center gap-3">
                <span className="text-sm font-medium w-12">{day.period}</span>
                <div className="flex-1 flex h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 transition-all duration-500"
                    style={{ width: `${day.positive}%` }}
                  />
                  <div 
                    className="bg-gray-400 transition-all duration-500"
                    style={{ width: `${day.neutral}%` }}
                  />
                  <div 
                    className="bg-red-500 transition-all duration-500"
                    style={{ width: `${day.negative}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{day.positive}%</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-xs">Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <span className="text-xs">Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-xs">Negative</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {showRecommendations && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Sentiment Improvement Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm mb-1">Strengthen Community Support</div>
                  <p className="text-xs text-gray-600">High satisfaction scores indicate strong peer support</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm mb-1">Address Platform Speed</div>
                  <p className="text-xs text-gray-600">Below-target satisfaction needs immediate attention</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm mb-1">Leverage Positive Trends</div>
                  <p className="text-xs text-gray-600">Feature success stories to maintain momentum</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm mb-1">Maintain Quick Moderation</div>
                  <p className="text-xs text-gray-600">Fast conflict resolution preserves positive atmosphere</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}