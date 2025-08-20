'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText,
  HelpCircle,
  Link2,
  Briefcase,
  DollarSign,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Zap,
  Star,
  CheckCircle,
  Info,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Download,
  Share2,
  MessageSquare,
  ThumbsUp,
  GitBranch,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ValueMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  unit?: string;
  change?: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  trend: 'up' | 'down' | 'stable';
  impact: 'high' | 'medium' | 'low';
  description: string;
  icon: React.ElementType;
  color: string;
}

interface ContentContribution {
  type: string;
  count: number;
  quality: number;
  engagement: number;
  value: number;
  topContributors: number;
}

interface ProblemSolution {
  category: string;
  solved: number;
  pending: number;
  avgTime: string;
  satisfaction: number;
}

interface ConnectionMetric {
  type: string;
  count: number;
  strength: 'strong' | 'moderate' | 'weak';
  outcomes: string;
}

interface ValueCreationProps {
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  onMetricClick?: (metric: ValueMetric) => void;
  onExportData?: () => void;
  showImpact?: boolean;
  showContributors?: boolean;
}

export function ValueCreation({
  timeRange = 'month',
  onMetricClick,
  onExportData,
  showImpact = true,
  showContributors = true
}: ValueCreationProps) {
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null);
  const [filterImpact, setFilterImpact] = React.useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Core value metrics
  const valueMetrics: ValueMetric[] = [
    {
      id: 'content-generated',
      name: 'Content Generated',
      value: 3456,
      previousValue: 2890,
      unit: 'pieces',
      change: 19.6,
      status: 'excellent',
      trend: 'up',
      impact: 'high',
      description: 'Total content pieces created by community',
      icon: FileText,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'problems-solved',
      name: 'Problems Solved',
      value: 892,
      previousValue: 756,
      change: 18.0,
      status: 'good',
      trend: 'up',
      impact: 'high',
      description: 'Community questions answered',
      icon: HelpCircle,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'connections-made',
      name: 'Connections Made',
      value: 1567,
      previousValue: 1234,
      change: 27.0,
      status: 'excellent',
      trend: 'up',
      impact: 'medium',
      description: 'New relationships formed',
      icon: Link2,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'projects-completed',
      name: 'Projects Completed',
      value: 45,
      previousValue: 38,
      change: 18.4,
      status: 'good',
      trend: 'up',
      impact: 'high',
      description: 'Collaborative projects finished',
      icon: Briefcase,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      id: 'revenue-influenced',
      name: 'Revenue Influenced',
      value: 125000,
      previousValue: 98000,
      unit: '$',
      change: 27.6,
      status: 'excellent',
      trend: 'up',
      impact: 'high',
      description: 'Economic value generated',
      icon: DollarSign,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'knowledge-shared',
      name: 'Knowledge Articles',
      value: 234,
      previousValue: 189,
      change: 23.8,
      status: 'good',
      trend: 'up',
      impact: 'medium',
      description: 'Educational resources created',
      icon: BookOpen,
      color: 'text-pink-600 bg-pink-100'
    }
  ];

  // Content contribution breakdown
  const contentContributions: ContentContribution[] = [
    { type: 'Articles', count: 456, quality: 4.5, engagement: 8934, value: 95, topContributors: 23 },
    { type: 'Videos', count: 234, quality: 4.7, engagement: 12456, value: 98, topContributors: 15 },
    { type: 'Tutorials', count: 189, quality: 4.8, engagement: 6789, value: 96, topContributors: 12 },
    { type: 'Discussions', count: 892, quality: 4.2, engagement: 4567, value: 82, topContributors: 67 },
    { type: 'Resources', count: 345, quality: 4.6, engagement: 3456, value: 89, topContributors: 34 }
  ];

  // Problem solution categories
  const problemSolutions: ProblemSolution[] = [
    { category: 'Technical', solved: 234, pending: 12, avgTime: '2.3h', satisfaction: 4.7 },
    { category: 'Business', solved: 189, pending: 23, avgTime: '4.5h', satisfaction: 4.5 },
    { category: 'Creative', solved: 156, pending: 8, avgTime: '3.2h', satisfaction: 4.8 },
    { category: 'General', solved: 313, pending: 45, avgTime: '1.8h', satisfaction: 4.3 }
  ];

  // Connection metrics
  const connectionMetrics: ConnectionMetric[] = [
    { type: 'Mentorships', count: 234, strength: 'strong', outcomes: '89% satisfaction' },
    { type: 'Collaborations', count: 456, strength: 'moderate', outcomes: '67% completed' },
    { type: 'Networking', count: 877, strength: 'moderate', outcomes: '45% active' },
    { type: 'Partnerships', count: 45, strength: 'strong', outcomes: '92% successful' }
  ];

  // Top contributors
  const topContributors = [
    { name: 'Marie L.', contributions: 234, value: 8934, badge: 'Expert', avatar: '👩' },
    { name: 'Jean P.', contributions: 189, value: 7456, badge: 'Pro', avatar: '👨' },
    { name: 'Sophie D.', contributions: 167, value: 6234, badge: 'Expert', avatar: '👩' },
    { name: 'Michel R.', contributions: 145, value: 5678, badge: 'Pro', avatar: '👨' },
    { name: 'Claudine B.', contributions: 123, value: 4567, badge: 'Rising', avatar: '👩' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-red-600 bg-red-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-green-600 bg-green-100';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      default:
        return 'text-red-600';
    }
  };

  const formatValue = (value: number, unit?: string) => {
    if (unit === '$') {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  const renderMetricCard = (metric: ValueMetric) => {
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
            {showImpact && (
              <Badge className={cn("text-xs", getImpactColor(metric.impact))}>
                {metric.impact} impact
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">
                  {formatValue(metric.value, metric.unit)}
                </span>
                {metric.unit && metric.unit !== '$' && (
                  <span className="text-sm text-gray-500">{metric.unit}</span>
                )}
              </div>
              <div className="text-sm font-medium text-gray-900">{metric.name}</div>
            </div>

            {metric.change !== undefined && (
              <div className={cn(
                "flex items-center gap-1 text-sm",
                metric.trend === 'up' ? "text-green-600" : "text-red-600"
              )}>
                {metric.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                <span>{Math.abs(metric.change).toFixed(1)}%</span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <Badge className={cn("text-xs", getStatusColor(metric.status))}>
                {metric.status}
              </Badge>
              <div className={cn(
                "flex items-center gap-1 text-xs",
                metric.trend === 'up' ? "text-green-600" : 
                metric.trend === 'down' ? "text-red-600" : "text-gray-600"
              )}>
                <TrendingUp className="h-3 w-3" />
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
          <h2 className="text-2xl font-bold">Value Creation Metrics</h2>
          <p className="text-gray-600">Measure the tangible value generated by the community</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterImpact}
            onChange={(e) => setFilterImpact(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Impact</option>
            <option value="high">High Impact</option>
            <option value="medium">Medium Impact</option>
            <option value="low">Low Impact</option>
          </select>
          
          <Button variant="outline" size="sm" onClick={onExportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Value Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {valueMetrics
          .filter(m => filterImpact === 'all' || m.impact === filterImpact)
          .map(renderMetricCard)}
      </div>

      {/* Content & Problem Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Content Contributions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentContributions.map((content) => (
                <div key={content.type} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{content.type}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {content.count} items
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs font-medium">{content.quality}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Engagement: </span>
                      <span className="font-medium">{content.engagement.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Value: </span>
                      <span className="font-medium">{content.value}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Contributors: </span>
                      <span className="font-medium">{content.topContributors}</span>
                    </div>
                  </div>
                  <Progress value={content.value} className="h-1 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Problem Solutions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Problem Solutions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {problemSolutions.map((solution) => (
                <div key={solution.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{solution.category}</div>
                    <div className="text-xs text-gray-500">
                      {solution.solved} solved • {solution.pending} pending
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{solution.avgTime}</div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs">{solution.satisfaction}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span>95% resolution rate exceeds industry standard of 85%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connections & Contributors */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Connection Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Connection Outcomes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectionMetrics.map((connection) => (
                <div key={connection.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-8 rounded-full",
                      connection.strength === 'strong' ? "bg-green-500" :
                      connection.strength === 'moderate' ? "bg-yellow-500" : "bg-red-500"
                    )} />
                    <div>
                      <div className="font-medium text-sm">{connection.type}</div>
                      <div className="text-xs text-gray-500">
                        {connection.count} connections
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={cn("text-xs", getStrengthColor(connection.strength))}>
                      {connection.strength}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">{connection.outcomes}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Contributors */}
        {showContributors && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Top Value Creators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topContributors.map((contributor, index) => (
                  <div key={contributor.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-lg">
                        {contributor.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{contributor.name}</div>
                        <div className="text-xs text-gray-500">
                          {contributor.contributions} contributions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={cn(
                        "text-xs",
                        contributor.badge === 'Expert' ? "bg-purple-100 text-purple-700" :
                        contributor.badge === 'Pro' ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"
                      )}>
                        {contributor.badge}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        Value: {contributor.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Impact Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Community Impact Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">15.2K</div>
              <div className="text-sm text-gray-600">Total Contributions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">92%</div>
              <div className="text-sm text-gray-600">Value Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">$125K</div>
              <div className="text-sm text-gray-600">Economic Impact</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">4.6★</div>
              <div className="text-sm text-gray-600">Quality Rating</div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium">Innovation Index</div>
                <div className="text-xs text-gray-600">23% above baseline</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium">Collaboration Rate</div>
                <div className="text-xs text-gray-600">67% of members engaged</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium">Impact Velocity</div>
                <div className="text-xs text-gray-600">3.5x faster than average</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Value Creation Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Recognize Top Contributors</div>
                <p className="text-xs text-gray-600">Feature value creators in community highlights</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Scale Successful Programs</div>
                <p className="text-xs text-gray-600">Expand high-impact initiatives</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GitBranch className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Foster Collaboration</div>
                <p className="text-xs text-gray-600">Create more opportunities for partnerships</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Implement Rewards</div>
                <p className="text-xs text-gray-600">Incentivize high-value contributions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}