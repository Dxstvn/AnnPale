'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiveStreamAnalytics } from '@/components/streaming/live-stream-analytics';
import { RealTimeAnalytics } from '@/components/creator/analytics/real-time-analytics';
import { StreamAnalyticsDashboard } from '@/components/streaming/stream-analytics-dashboard';
import {
  BarChart3,
  Activity,
  Radio,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  Gift,
  UserPlus,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  Download,
  Settings,
  Bell,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Clock,
  Signal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Phase418Demo() {
  const [selectedDemo, setSelectedDemo] = useState('overview');
  const [isLiveSimulation, setIsLiveSimulation] = useState(true);

  // Mock data for live stream analytics (fixed values for SSR compatibility)
  const mockLiveMetrics = {
    viewerCount: 267, // Fixed value instead of random
    peakViewers: 347,
    averageViewers: 245,
    chatRate: 42, // Fixed value instead of random
    engagementRate: 68.5,
    revenuePerMinute: 8.73, // Fixed value instead of random
    newFollowers: 23,
    
    streamHealth: {
      bitrate: 2500,
      frameRate: 30,
      resolution: '1080p',
      quality: 'excellent' as const,
      droppedFrames: 0,
      latency: 250
    },
    
    revenue: {
      total: 1247.83,
      tips: 567.20,
      gifts: 345.15,
      subscriptions: 289.40,
      superChats: 46.08
    },
    
    interactions: {
      chatMessages: 1456,
      reactions: 3247,
      shares: 89,
      clips: 12,
      polls: 3
    }
  };

  const mockDemographics = {
    total: 347,
    byDevice: {
      mobile: 178,
      desktop: 134,
      tablet: 35
    },
    byRegion: [
      { name: 'United States', count: 156, percentage: 45 },
      { name: 'Haiti', count: 78, percentage: 22.5 },
      { name: 'Canada', count: 45, percentage: 13 },
      { name: 'France', count: 34, percentage: 9.8 },
      { name: 'Dominican Republic', count: 23, percentage: 6.6 },
      { name: 'Other', count: 11, percentage: 3.1 }
    ],
    byAge: {
      '13-17': 12,
      '18-24': 89,
      '25-34': 134,
      '35-44': 78,
      '45-54': 23,
      '55+': 11
    },
    newVsReturning: {
      new: 145,
      returning: 202
    }
  };

  const mockEvents = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'milestone' as const,
      title: 'Peak Viewers Milestone',
      description: 'Reached 347 concurrent viewers - new personal best!',
      value: 347,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      type: 'goal' as const,
      title: 'Revenue Goal Reached',
      description: 'Hit $1000 revenue target for this stream',
      value: 1000,
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      type: 'spike' as const,
      title: 'Engagement Spike',
      description: 'Chat activity increased by 200% during music performance',
      value: 200,
      icon: Zap,
      color: 'bg-orange-500'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'milestone' as const,
      title: 'New Follower Milestone',
      description: '50 new followers gained during this stream',
      value: 50,
      icon: UserPlus,
      color: 'bg-blue-500'
    }
  ];

  const mockPostStreamReport = {
    duration: 127, // 2h 7m
    totalViewers: 892,
    uniqueViewers: 567,
    peakConcurrent: 347,
    averageWatchTime: 34.5,
    totalRevenue: 1247.83,
    engagementScore: 8.7,
    retentionRate: 78.5,
    topMoments: mockEvents,
    audienceGrowth: 23,
    performanceComparison: [
      { metric: 'Peak Viewers', current: 347, previous: 298, change: 16.4 },
      { metric: 'Revenue', current: 1247.83, previous: 987.45, change: 26.4 },
      { metric: 'Engagement Rate', current: 68.5, previous: 61.2, change: 11.9 },
      { metric: 'Chat Messages', current: 1456, previous: 1203, change: 21.0 },
      { metric: 'New Followers', current: 23, previous: 18, change: 27.8 }
    ]
  };

  // Mock classic analytics data
  const mockClassicAnalytics = {
    streamId: 'stream_123',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    metrics: {
      viewerCount: mockLiveMetrics.viewerCount,
      peakViewers: mockLiveMetrics.peakViewers,
      averageWatchTime: 34.5 * 60, // seconds
      chatMessages: mockLiveMetrics.interactions.chatMessages,
      reactions: mockLiveMetrics.interactions.reactions,
      tips: mockLiveMetrics.revenue.tips,
      newFollowers: mockLiveMetrics.newFollowers,
      shareCount: mockLiveMetrics.interactions.shares,
      engagementRate: mockLiveMetrics.engagementRate,
      returningViewers: mockDemographics.newVsReturning.returning
    },
    revenue: mockLiveMetrics.revenue,
    viewerEngagements: [],
    peakMoments: mockEvents.map(e => ({
      timestamp: e.timestamp,
      event: e.title,
      viewerCount: e.value || mockLiveMetrics.viewerCount
    }))
  };

  // Phase 4.1.8 statistics
  const phaseStats = {
    totalComponents: 8,
    realTimeMetrics: 12,
    analyticsViews: 4,
    reportTypes: 3,
    exportFormats: 3,
    alertTypes: 5
  };

  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    console.log(`Exporting analytics as ${format.toUpperCase()}`);
  };

  const handleAlert = (alert: any) => {
    console.log('Analytics alert triggered:', alert);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.1.8: Stream Analytics & Performance
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Comprehensive real-time and post-stream analytics providing creators with deep insights 
          into viewer behavior, engagement patterns, revenue optimization, and performance trends.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Real-time Metrics
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Live Analytics
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Performance Reports
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Audience Insights
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            Revenue Analytics
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Export Tools
          </span>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">📊 Advanced Analytics Platform Available</h2>
        <p className="mb-6 text-lg opacity-90">
          Experience comprehensive stream analytics with real-time metrics, audience insights, 
          revenue tracking, and detailed performance reports for data-driven content optimization
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/creator/analytics">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Analytics Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/streaming/analytics">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Radio className="w-5 h-5 mr-2" />
              Live Stream Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Feature Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Feature Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Analytics Type</th>
                  <th className="text-left p-3">Update Rate</th>
                  <th className="text-left p-3">Key Metrics</th>
                  <th className="text-left p-3">Insights</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Real-time</span>
                    </div>
                  </td>
                  <td className="p-3">Every second</td>
                  <td className="p-3">Viewer count, chat rate, revenue/min</td>
                  <td className="p-3">Live performance optimization</td>
                  <td className="p-3">
                    <Badge className="bg-green-100 text-green-700">Instant alerts</Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Engagement</span>
                    </div>
                  </td>
                  <td className="p-3">Per minute</td>
                  <td className="p-3">Chat messages, reactions, interactions</td>
                  <td className="p-3">Audience engagement patterns</td>
                  <td className="p-3">
                    <Badge className="bg-blue-100 text-blue-700">Content timing</Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">Audience</span>
                    </div>
                  </td>
                  <td className="p-3">Real-time</td>
                  <td className="p-3">Demographics, devices, geography</td>
                  <td className="p-3">Viewer composition analysis</td>
                  <td className="p-3">
                    <Badge className="bg-purple-100 text-purple-700">Targeting</Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Revenue</span>
                    </div>
                  </td>
                  <td className="p-3">Per transaction</td>
                  <td className="p-3">Tips, gifts, subscriptions, revenue/viewer</td>
                  <td className="p-3">Monetization performance</td>
                  <td className="p-3">
                    <Badge className="bg-green-100 text-green-700">Goal tracking</Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Signal className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">Technical</span>
                    </div>
                  </td>
                  <td className="p-3">Continuous</td>
                  <td className="p-3">Stream health, quality, latency, bitrate</td>
                  <td className="p-3">Technical performance monitoring</td>
                  <td className="p-3">
                    <Badge className="bg-orange-100 text-orange-700">Quality alerts</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo Tabs */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Interactive Analytics Demo</h2>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Eye className="w-3 h-3 mr-1" />
              {mockLiveMetrics.viewerCount} Viewers
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <DollarSign className="w-3 h-3 mr-1" />
              ${mockLiveMetrics.revenue.total.toFixed(2)} Revenue
            </Badge>
            <Button
              size="sm"
              variant={isLiveSimulation ? "destructive" : "outline"}
              onClick={() => setIsLiveSimulation(!isLiveSimulation)}
            >
              {isLiveSimulation ? (
                <>
                  <Radio className="w-4 h-4 mr-1 animate-pulse" />
                  LIVE
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  OFFLINE
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={selectedDemo} onValueChange={setSelectedDemo}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="live">Live Analytics</TabsTrigger>
            <TabsTrigger value="realtime">Real-time Dashboard</TabsTrigger>
            <TabsTrigger value="classic">Classic Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <h3 className="text-lg font-semibold mb-2">Live Analytics</h3>
                    <div className="text-2xl font-bold text-blue-600">Real-time</div>
                    <p className="text-sm text-gray-600 mt-1">Performance tracking</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-green-600" />
                    <h3 className="text-lg font-semibold mb-2">Engagement</h3>
                    <div className="text-2xl font-bold text-green-600">{mockLiveMetrics.engagementRate.toFixed(1)}%</div>
                    <p className="text-sm text-gray-600 mt-1">Active participation</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                    <h3 className="text-lg font-semibold mb-2">Audience</h3>
                    <div className="text-2xl font-bold text-purple-600">{mockDemographics.total}</div>
                    <p className="text-sm text-gray-600 mt-1">Global viewers</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features Implemented</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Real-time metrics dashboard with live viewer count updates</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Stream health monitoring with quality indicators</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Revenue analytics with breakdown by source</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Audience demographics and geographic distribution</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Engagement metrics with interaction tracking</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Post-stream reports with performance comparison</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Performance Optimization</span>
                        </div>
                        <p className="text-sm text-blue-600">
                          Real-time insights help creators adjust content and timing for maximum engagement
                        </p>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Revenue Growth</span>
                        </div>
                        <p className="text-sm text-green-600">
                          Detailed revenue analytics identify monetization opportunities and successful strategies
                        </p>
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">Audience Understanding</span>
                        </div>
                        <p className="text-sm text-purple-600">
                          Demographics and behavior insights enable targeted content creation
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="live" className="mt-6">
            <LiveStreamAnalytics
              streamId="demo-stream"
              isLive={isLiveSimulation}
              metrics={mockLiveMetrics}
              demographics={mockDemographics}
              events={mockEvents}
              postStreamReport={!isLiveSimulation ? mockPostStreamReport : undefined}
              onExport={handleExport}
              onAlert={handleAlert}
            />
          </TabsContent>

          <TabsContent value="realtime" className="mt-6">
            <RealTimeAnalytics
              onMetricClick={(metricId) => console.log('Metric clicked:', metricId)}
              onActivityAction={(activityId) => console.log('Activity action:', activityId)}
              onQuickAction={(metricId, action) => console.log('Quick action:', metricId, action)}
              refreshInterval={3000}
              showNotifications={true}
            />
          </TabsContent>

          <TabsContent value="classic" className="mt-6">
            <StreamAnalyticsDashboard
              analytics={mockClassicAnalytics}
              isLive={isLiveSimulation}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{phaseStats.realTimeMetrics}</div>
          <p className="text-gray-600 mt-1">Real-time Metrics</p>
          <div className="text-sm text-blue-600 mt-2">Live updating</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{phaseStats.analyticsViews}</div>
          <p className="text-gray-600 mt-1">Analytics Views</p>
          <div className="text-sm text-green-600 mt-2">Comprehensive insights</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{phaseStats.exportFormats}</div>
          <p className="text-gray-600 mt-1">Export Formats</p>
          <div className="text-sm text-purple-600 mt-2">PDF, CSV, JSON</div>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🔧 Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Real-time Analytics</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Live viewer count with second-by-second updates</li>
              <li>• Chat rate monitoring and engagement spikes detection</li>
              <li>• Revenue tracking with per-minute calculations</li>
              <li>• Stream health monitoring with quality indicators</li>
              <li>• Milestone alerts and achievement notifications</li>
              <li>• Performance comparison with previous streams</li>
              <li>• Technical metrics: bitrate, latency, dropped frames</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Post-stream Reports</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Comprehensive performance summary with key metrics</li>
              <li>• Audience retention analysis and watch time distribution</li>
              <li>• Revenue breakdown by source and time periods</li>
              <li>• Engagement highlights and peak moment identification</li>
              <li>• Growth metrics and follower acquisition tracking</li>
              <li>• Export capabilities in multiple formats (PDF, CSV, JSON)</li>
              <li>• Historical comparison with trend analysis</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Audience Analytics</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Device breakdown: mobile, desktop, tablet usage</li>
              <li>• Geographic distribution with regional insights</li>
              <li>• New vs returning viewer analysis</li>
              <li>• Age demographic distribution and preferences</li>
              <li>• Viewing behavior patterns and session duration</li>
              <li>• Engagement correlation with audience segments</li>
              <li>• Cultural preferences for Haitian diaspora</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Performance Optimization</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Real-time alerts for performance issues</li>
              <li>• Engagement rate optimization recommendations</li>
              <li>• Revenue goal tracking and milestone alerts</li>
              <li>• Content timing suggestions based on data</li>
              <li>• Quality improvement recommendations</li>
              <li>• Audience retention strategies</li>
              <li>• A/B testing insights for content optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}