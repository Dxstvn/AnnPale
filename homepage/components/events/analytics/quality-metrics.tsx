'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wifi,
  AlertTriangle,
  HeadphonesIcon,
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  Activity,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Gauge
} from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { cn } from '@/lib/utils';

interface StreamQuality {
  avgBitrate: number;
  avgResolution: string;
  bufferingEvents: number;
  avgLatency: number; // ms
  uptime: number; // percentage
  qualityScore: number; // 0-100
}

interface TechnicalIssues {
  total: number;
  audioIssues: number;
  videoIssues: number;
  connectionDrops: number;
  resolved: number;
  avgResolutionTime: number; // minutes
}

interface SupportTickets {
  total: number;
  resolved: number;
  pending: number;
  categories: Array<{ category: string; count: number }>;
  avgResponseTime: number; // minutes
}

interface Satisfaction {
  npsScore: number;
  satisfactionScore: number; // percentage
  ratings: Array<{ stars: number; count: number }>;
  feedback: Array<{ type: 'positive' | 'negative' | 'neutral'; count: number }>;
}

interface QualityMetricsProps {
  eventId: string;
  eventTitle: string;
  streamQuality: StreamQuality;
  technicalIssues: TechnicalIssues;
  supportTickets: SupportTickets;
  satisfaction: Satisfaction;
  qualityTimeline?: Array<{ time: string; quality: number; issues: number }>;
  onExportReport?: () => void;
  onViewDetails?: (section: string) => void;
}

export function QualityMetrics({
  eventId,
  eventTitle,
  streamQuality,
  technicalIssues,
  supportTickets,
  satisfaction,
  qualityTimeline = [],
  onExportReport,
  onViewDetails
}: QualityMetricsProps) {
  // Calculate overall quality score
  const overallQualityScore = React.useMemo(() => {
    const weights = {
      stream: 0.30,
      issues: 0.20,
      support: 0.20,
      satisfaction: 0.30
    };

    const issueScore = Math.max(0, 100 - (technicalIssues.total * 5));
    const supportScore = (supportTickets.resolved / supportTickets.total) * 100 || 100;
    
    return (
      streamQuality.qualityScore * weights.stream +
      issueScore * weights.issues +
      supportScore * weights.support +
      satisfaction.satisfactionScore * weights.satisfaction
    );
  }, [streamQuality, technicalIssues, supportTickets, satisfaction]);

  // Get quality level
  const getQualityLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', badge: 'success' };
    if (score >= 75) return { level: 'Good', color: 'text-blue-600', badge: 'default' };
    if (score >= 60) return { level: 'Fair', color: 'text-yellow-600', badge: 'secondary' };
    return { level: 'Poor', color: 'text-red-600', badge: 'destructive' };
  };

  const qualityLevel = getQualityLevel(overallQualityScore);

  // NPS category
  const getNPSCategory = (score: number) => {
    if (score >= 50) return { category: 'Excellent', color: 'text-green-600' };
    if (score >= 0) return { category: 'Good', color: 'text-blue-600' };
    if (score >= -50) return { category: 'Needs Improvement', color: 'text-yellow-600' };
    return { category: 'Critical', color: 'text-red-600' };
  };

  const npsCategory = getNPSCategory(satisfaction.npsScore);

  // Format data for radial chart
  const radialData = [{
    name: 'Quality',
    value: overallQualityScore,
    fill: overallQualityScore >= 75 ? '#10B981' : overallQualityScore >= 50 ? '#F59E0B' : '#EF4444'
  }];

  // Issue resolution rate
  const resolutionRate = technicalIssues.total > 0 
    ? ((technicalIssues.resolved / technicalIssues.total) * 100).toFixed(1)
    : '100';

  return (
    <div className="space-y-6">
      {/* Overall Quality Score */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Overall Event Quality</p>
              <div className="flex items-center gap-3">
                <p className={cn("text-4xl font-bold", qualityLevel.color)}>
                  {overallQualityScore.toFixed(0)}%
                </p>
                <Badge variant={qualityLevel.badge as any}>
                  {qualityLevel.level}
                </Badge>
              </div>
              <Progress value={overallQualityScore} className="mt-3 h-3" />
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={150} height={150}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={10} fill="#9333EA" />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                    {overallQualityScore.toFixed(0)}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Quality Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stream Quality</p>
                <p className="text-2xl font-bold">{streamQuality.qualityScore}%</p>
                <p className="text-xs text-gray-500 mt-1">{streamQuality.avgResolution}</p>
              </div>
              <Wifi className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tech Issues</p>
                <p className="text-2xl font-bold">{technicalIssues.total}</p>
                <p className="text-xs text-gray-500 mt-1">{resolutionRate}% resolved</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Support Tickets</p>
                <p className="text-2xl font-bold">{supportTickets.total}</p>
                <p className="text-xs text-gray-500 mt-1">{supportTickets.pending} pending</p>
              </div>
              <HeadphonesIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold">{satisfaction.satisfactionScore}%</p>
                <p className={cn("text-xs mt-1", npsCategory.color)}>
                  NPS: {satisfaction.npsScore}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stream Quality Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stream Quality Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Avg Bitrate</p>
              <p className="text-lg font-bold">{streamQuality.avgBitrate}</p>
              <p className="text-xs text-gray-500">kbps</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Resolution</p>
              <p className="text-lg font-bold">{streamQuality.avgResolution}</p>
              <Badge variant="success" className="mt-1 text-xs">HD</Badge>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Buffering</p>
              <p className="text-lg font-bold">{streamQuality.bufferingEvents}</p>
              <p className="text-xs text-gray-500">events</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Latency</p>
              <p className="text-lg font-bold">{streamQuality.avgLatency}</p>
              <p className="text-xs text-gray-500">ms</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Uptime</p>
              <p className="text-lg font-bold text-green-600">{streamQuality.uptime}%</p>
              <CheckCircle className="h-4 w-4 text-green-600 mx-auto mt-1" />
            </div>
          </div>

          {qualityTimeline.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Quality Over Time</h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={qualityTimeline}>
                  <defs>
                    <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="quality" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorQuality)"
                    name="Quality Score"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="issues" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={false}
                    name="Issues"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technical Issues Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Technical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-sm">Audio Issues</span>
                </div>
                <span className="font-semibold">{technicalIssues.audioIssues}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">Video Issues</span>
                </div>
                <span className="font-semibold">{technicalIssues.videoIssues}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm">Connection Drops</span>
                </div>
                <span className="font-semibold">{technicalIssues.connectionDrops}</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Resolution Time</span>
                  <span className="font-semibold">{technicalIssues.avgResolutionTime} min</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supportTickets.categories.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <span className="text-sm">{category.category}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={(category.count / supportTickets.total) * 100} className="w-20" />
                    <span className="text-sm font-medium w-8">{category.count}</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold">{supportTickets.avgResponseTime} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Resolution Rate</span>
                  <span className="font-semibold text-green-600">
                    {((supportTickets.resolved / supportTickets.total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Satisfaction Ratings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Satisfaction & Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Star Ratings */}
            <div>
              <h4 className="text-sm font-medium mb-3">Rating Distribution</h4>
              <div className="space-y-2">
                {satisfaction.ratings.map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm w-4">{rating.stars}</span>
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <Progress 
                      value={(rating.count / satisfaction.ratings.reduce((sum, r) => sum + r.count, 0)) * 100} 
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-8">{rating.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NPS Score */}
            <div className="text-center">
              <h4 className="text-sm font-medium mb-3">Net Promoter Score</h4>
              <div className="relative inline-flex items-center justify-center">
                <Gauge className="h-24 w-24 text-gray-200" />
                <div className="absolute">
                  <p className={cn("text-2xl font-bold", npsCategory.color)}>
                    {satisfaction.npsScore}
                  </p>
                </div>
              </div>
              <p className={cn("text-sm mt-2", npsCategory.color)}>
                {npsCategory.category}
              </p>
            </div>

            {/* Feedback Summary */}
            <div>
              <h4 className="text-sm font-medium mb-3">Feedback Sentiment</h4>
              <div className="space-y-3">
                {satisfaction.feedback.map((item) => (
                  <div key={item.type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {item.type === 'positive' && <ThumbsUp className="h-4 w-4 text-green-600" />}
                      {item.type === 'negative' && <ThumbsDown className="h-4 w-4 text-red-600" />}
                      {item.type === 'neutral' && <MessageSquare className="h-4 w-4 text-gray-600" />}
                      <span className="text-sm capitalize">{item.type}</span>
                    </div>
                    <Badge variant={
                      item.type === 'positive' ? 'success' : 
                      item.type === 'negative' ? 'destructive' : 
                      'secondary'
                    }>
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quality Improvement Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {streamQuality.bufferingEvents > 10 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  High buffering events detected. Consider optimizing bitrate settings or upgrading streaming infrastructure.
                </AlertDescription>
              </Alert>
            )}
            {technicalIssues.avgResolutionTime > 15 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Issue resolution time exceeds 15 minutes. Improve support response procedures and technical documentation.
                </AlertDescription>
              </Alert>
            )}
            {satisfaction.npsScore < 30 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  NPS score indicates room for improvement. Review attendee feedback and implement suggested changes.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}