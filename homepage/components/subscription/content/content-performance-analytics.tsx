'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Clock,
  Calendar,
  DollarSign,
  Star,
  Crown,
  Shield,
  Video,
  Radio,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ContentMetrics {
  contentId: string;
  title: string;
  type: 'video' | 'post' | 'stream' | 'event';
  tier: string;
  publishDate: Date;
  metrics: {
    views: number;
    uniqueViews: number;
    avgWatchTime: string;
    engagement: number;
    likes: number;
    comments: number;
    shares: number;
    revenue: number;
  };
  performance: {
    trend: 'up' | 'down' | 'stable';
    percentChange: number;
    score: number; // 0-100
  };
  audience: {
    tierBreakdown: {
      bronze: number;
      silver: number;
      gold: number;
      free: number;
    };
    retention: number;
    newVsReturning: {
      new: number;
      returning: number;
    };
  };
}

interface ContentPerformanceAnalyticsProps {
  timeRange?: '24h' | '7d' | '30d' | '90d';
  onExport?: () => void;
}

export function ContentPerformanceAnalytics({
  timeRange = '7d',
  onExport
}: ContentPerformanceAnalyticsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState(timeRange);
  const [selectedMetric, setSelectedMetric] = React.useState<'views' | 'engagement' | 'revenue'>('views');

  // Sample content metrics
  const contentMetrics: ContentMetrics[] = [
    {
      contentId: '1',
      title: 'Exclusive Behind-the-Scenes',
      type: 'video',
      tier: 'gold',
      publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      metrics: {
        views: 5234,
        uniqueViews: 4102,
        avgWatchTime: '8:45',
        engagement: 78,
        likes: 892,
        comments: 156,
        shares: 45,
        revenue: 1250.00
      },
      performance: {
        trend: 'up',
        percentChange: 24,
        score: 85
      },
      audience: {
        tierBreakdown: {
          bronze: 10,
          silver: 25,
          gold: 60,
          free: 5
        },
        retention: 72,
        newVsReturning: {
          new: 30,
          returning: 70
        }
      }
    },
    {
      contentId: '2',
      title: 'Weekly Q&A Session',
      type: 'stream',
      tier: 'silver',
      publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      metrics: {
        views: 3421,
        uniqueViews: 2890,
        avgWatchTime: '12:30',
        engagement: 65,
        likes: 623,
        comments: 234,
        shares: 28,
        revenue: 890.00
      },
      performance: {
        trend: 'stable',
        percentChange: 2,
        score: 72
      },
      audience: {
        tierBreakdown: {
          bronze: 20,
          silver: 50,
          gold: 25,
          free: 5
        },
        retention: 68,
        newVsReturning: {
          new: 40,
          returning: 60
        }
      }
    },
    {
      contentId: '3',
      title: 'Photo Collection Drop',
      type: 'post',
      tier: 'bronze',
      publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      metrics: {
        views: 8923,
        uniqueViews: 7234,
        avgWatchTime: '2:15',
        engagement: 45,
        likes: 1523,
        comments: 89,
        shares: 123,
        revenue: 450.00
      },
      performance: {
        trend: 'down',
        percentChange: -12,
        score: 58
      },
      audience: {
        tierBreakdown: {
          bronze: 45,
          silver: 30,
          gold: 15,
          free: 10
        },
        retention: 55,
        newVsReturning: {
          new: 60,
          returning: 40
        }
      }
    }
  ];

  // Calculate aggregate stats
  const aggregateStats = React.useMemo(() => {
    const total = contentMetrics.reduce((acc, content) => ({
      views: acc.views + content.metrics.views,
      engagement: acc.engagement + content.metrics.engagement,
      revenue: acc.revenue + content.metrics.revenue,
      likes: acc.likes + content.metrics.likes,
      comments: acc.comments + content.metrics.comments,
      shares: acc.shares + content.metrics.shares
    }), {
      views: 0,
      engagement: 0,
      revenue: 0,
      likes: 0,
      comments: 0,
      shares: 0
    });

    const avgEngagement = total.engagement / contentMetrics.length;
    
    return {
      ...total,
      avgEngagement,
      contentCount: contentMetrics.length
    };
  }, []);

  // Get trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return ArrowUp;
      case 'down': return ArrowDown;
      default: return Minus;
    }
  };

  // Get trend color
  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get performance score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get content icon
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'post': return MessageSquare;
      case 'stream': return Radio;
      case 'event': return Calendar;
      default: return Video;
    }
  };

  // Get tier icon
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return Shield;
      case 'silver': return Star;
      case 'gold': return Crown;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content Performance Analytics</CardTitle>
            <div className="flex items-center gap-2">
              {/* Time Range Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['24h', '7d', '30d', '90d'].map((range) => (
                  <Button
                    key={range}
                    variant={selectedTimeRange === range ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedTimeRange(range as any)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{aggregateStats.views.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18% vs last period
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">{aggregateStats.avgEngagement.toFixed(0)}%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% vs last period
                </p>
              </div>
              <Heart className="h-8 w-8 text-pink-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${aggregateStats.revenue.toFixed(2)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +22% vs last period
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Content Published</p>
                <p className="text-2xl font-bold">{aggregateStats.contentCount}</p>
                <p className="text-sm text-gray-600 mt-1">
                  This {selectedTimeRange}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content Performance</TabsTrigger>
              <TabsTrigger value="audience">Audience Insights</TabsTrigger>
              <TabsTrigger value="optimization">Optimization Tips</TabsTrigger>
            </TabsList>

            {/* Content Performance Tab */}
            <TabsContent value="content" className="space-y-4">
              {contentMetrics.map((content) => {
                const Icon = getContentIcon(content.type);
                const TierIcon = getTierIcon(content.tier);
                const TrendIcon = getTrendIcon(content.performance.trend);
                
                return (
                  <motion.div
                    key={content.contentId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white border rounded-lg hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-purple-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{content.title}</h4>
                            {TierIcon && (
                              <Badge variant="outline" className="text-xs">
                                <TierIcon className="h-3 w-3 mr-1" />
                                {content.tier}
                              </Badge>
                            )}
                            <Badge className={cn("text-xs", getTrendColor(content.performance.trend))}>
                              <TrendIcon className="h-3 w-3 mr-1" />
                              {Math.abs(content.performance.percentChange)}%
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-4 md:grid-cols-7 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Views</p>
                              <p className="font-semibold">{content.metrics.views.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Watch Time</p>
                              <p className="font-semibold">{content.metrics.avgWatchTime}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Engagement</p>
                              <p className="font-semibold">{content.metrics.engagement}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Likes</p>
                              <p className="font-semibold">{content.metrics.likes}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Comments</p>
                              <p className="font-semibold">{content.metrics.comments}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Shares</p>
                              <p className="font-semibold">{content.metrics.shares}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Revenue</p>
                              <p className="font-semibold text-green-600">${content.metrics.revenue.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          {/* Performance Score Bar */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Performance Score</span>
                              <span className="text-xs font-semibold">{content.performance.score}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={cn("h-2 rounded-full transition-all", getScoreColor(content.performance.score))}
                                style={{ width: `${content.performance.score}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </TabsContent>

            {/* Audience Insights Tab */}
            <TabsContent value="audience" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Tier Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Audience by Tier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Gold</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">35%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Silver</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">40%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-500 h-2 rounded-full" style={{ width: '40%' }} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">Bronze</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">20%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Free</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">5%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '5%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Retention Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Retention & Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Average Retention</span>
                          <span className="text-sm font-semibold">65%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }} />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Returning Viewers</span>
                          <span className="text-sm font-semibold">58%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '58%' }} />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">New Subscribers</span>
                          <span className="text-sm font-semibold">42%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Optimization Tips Tab */}
            <TabsContent value="optimization" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-base text-green-800">What's Working</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5" />
                        <span>Gold tier exclusive content has 78% engagement rate</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5" />
                        <span>Videos posted at 2PM get 45% more views</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5" />
                        <span>Behind-the-scenes content drives most subscriptions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5" />
                        <span>Early access features increase retention by 23%</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-base text-orange-800">Areas to Improve</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-orange-700">
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                        <span>Bronze tier content has lower engagement (45%)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                        <span>Weekend posts receive 30% fewer views</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                        <span>Photo posts need more interactive elements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                        <span>Consider adding more Silver tier benefits</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Increase Gold Tier Content</p>
                          <p className="text-xs text-gray-600">Your Gold tier content performs 45% better</p>
                        </div>
                      </div>
                      <Button size="sm">Apply</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Optimize Posting Schedule</p>
                          <p className="text-xs text-gray-600">Post between 2-4 PM for maximum reach</p>
                        </div>
                      </div>
                      <Button size="sm">Schedule</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Engage Bronze Tier Members</p>
                          <p className="text-xs text-gray-600">Create more interactive content for Bronze tier</p>
                        </div>
                      </div>
                      <Button size="sm">Create</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Add missing imports
import { CheckCircle, AlertCircle } from 'lucide-react';