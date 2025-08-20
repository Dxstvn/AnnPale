'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Heart,
  DollarSign,
  Clock,
  Bell,
  Eye,
  Star,
  Share2,
  Gift,
  UserPlus,
  Video,
  Radio,
  Wifi,
  WifiOff,
  RefreshCw,
  BarChart3,
  Activity,
  Target,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
  Filter,
  Settings,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Signal,
  Gauge,
  LineChart,
  PieChart,
  Info,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types for Live Stream Analytics
export interface LiveStreamMetrics {
  // Real-time metrics
  viewerCount: number;
  peakViewers: number;
  averageViewers: number;
  chatRate: number; // messages per minute
  engagementRate: number;
  revenuePerMinute: number;
  newFollowers: number;
  
  // Stream health
  streamHealth: {
    bitrate: number;
    frameRate: number;
    resolution: string;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    droppedFrames: number;
    latency: number; // milliseconds
  };
  
  // Revenue metrics
  revenue: {
    total: number;
    tips: number;
    gifts: number;
    subscriptions: number;
    superChats: number;
  };
  
  // Engagement metrics
  interactions: {
    chatMessages: number;
    reactions: number;
    shares: number;
    clips: number;
    polls: number;
  };
}

export interface ViewerDemographics {
  total: number;
  byDevice: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  byRegion: {
    name: string;
    count: number;
    percentage: number;
  }[];
  byAge: {
    '13-17': number;
    '18-24': number;
    '25-34': number;
    '35-44': number;
    '45-54': number;
    '55+': number;
  };
  newVsReturning: {
    new: number;
    returning: number;
  };
}

export interface StreamEvent {
  id: string;
  timestamp: Date;
  type: 'milestone' | 'spike' | 'dip' | 'goal' | 'alert';
  title: string;
  description: string;
  value?: number;
  icon: React.ElementType;
  color: string;
}

export interface PostStreamReport {
  duration: number; // minutes
  totalViewers: number;
  uniqueViewers: number;
  peakConcurrent: number;
  averageWatchTime: number;
  totalRevenue: number;
  engagementScore: number;
  retentionRate: number;
  topMoments: StreamEvent[];
  audienceGrowth: number;
  performanceComparison: {
    metric: string;
    current: number;
    previous: number;
    change: number;
  }[];
}

interface LiveStreamAnalyticsProps {
  streamId: string;
  isLive: boolean;
  metrics: LiveStreamMetrics;
  demographics: ViewerDemographics;
  events: StreamEvent[];
  postStreamReport?: PostStreamReport;
  onExport?: (format: 'pdf' | 'csv' | 'json') => void;
  onAlert?: (alert: StreamEvent) => void;
  className?: string;
}

// Real-time metrics card component
function RealTimeMetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  format = 'number',
  isLive = false,
  subtitle
}: {
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
  format?: 'number' | 'currency' | 'percentage' | 'time';
  isLive?: boolean;
  subtitle?: string;
}) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `$${val.toFixed(2)}`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'time':
        return `${Math.floor(val / 60)}:${(val % 60).toString().padStart(2, '0')}`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {isLive && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1">
            <Radio className="h-3 w-3 text-red-500 animate-pulse" />
            <span className="text-xs text-red-500 font-medium">LIVE</span>
          </div>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", color)}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600">{title}</h4>
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <motion.div
            key={value.toString()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold"
          >
            {formatValue(value)}
          </motion.div>
          
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {changeType === 'increase' ? (
                <ArrowUp className="h-3 w-3 text-green-500" />
              ) : changeType === 'decrease' ? (
                <ArrowDown className="h-3 w-3 text-red-500" />
              ) : null}
              <span className={cn(
                "text-xs font-medium",
                changeType === 'increase' ? "text-green-500" :
                changeType === 'decrease' ? "text-red-500" : "text-gray-500"
              )}>
                {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Stream health monitor
function StreamHealthMonitor({ health }: { health: LiveStreamMetrics['streamHealth'] }) {
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'fair': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getQualityScore = (quality: string) => {
    switch (quality) {
      case 'excellent': return 95;
      case 'good': return 80;
      case 'fair': return 60;
      case 'poor': return 30;
      default: return 0;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Signal className="h-5 h-5" />
          Stream Health
        </CardTitle>
        <CardDescription>Real-time technical performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Overall Quality</span>
          <div className="flex items-center gap-2">
            <Badge className={cn("capitalize", getQualityColor(health.quality))}>
              {health.quality}
            </Badge>
            <span className="text-sm font-medium">{getQualityScore(health.quality)}%</span>
          </div>
        </div>
        
        <Progress value={getQualityScore(health.quality)} className="h-2" />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Bitrate</div>
            <div className="font-medium">{health.bitrate} kbps</div>
          </div>
          <div>
            <div className="text-gray-600">Frame Rate</div>
            <div className="font-medium">{health.frameRate} fps</div>
          </div>
          <div>
            <div className="text-gray-600">Resolution</div>
            <div className="font-medium">{health.resolution}</div>
          </div>
          <div>
            <div className="text-gray-600">Latency</div>
            <div className="font-medium">{health.latency}ms</div>
          </div>
        </div>
        
        {health.droppedFrames > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {health.droppedFrames} frames dropped in the last minute
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// Audience demographics visualization
function AudienceDemographics({ demographics }: { demographics: ViewerDemographics }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Device Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(demographics.byDevice).map(([device, count]) => {
              const percentage = (count / demographics.total) * 100;
              const Icon = device === 'mobile' ? Smartphone : 
                          device === 'desktop' ? Monitor : Tablet;
              
              return (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="capitalize text-sm">{device}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demographics.byRegion.slice(0, 5).map((region) => (
              <div key={region.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{region.name}</span>
                  <span className="font-medium">{region.count}</span>
                </div>
                <Progress value={region.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>New vs Returning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {demographics.newVsReturning.new}
              </div>
              <div className="text-sm text-gray-600">New Viewers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {demographics.newVsReturning.returning}
              </div>
              <div className="text-sm text-gray-600">Returning</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Event timeline component
function EventTimeline({ events }: { events: StreamEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Live Events Timeline
        </CardTitle>
        <CardDescription>Key moments during the stream</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            <AnimatePresence>
              {events.map((event) => {
                const Icon = event.icon;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg",
                      event.type === 'milestone' ? 'bg-green-50 border border-green-200' :
                      event.type === 'alert' ? 'bg-red-50 border border-red-200' :
                      'bg-gray-50 border border-gray-200'
                    )}
                  >
                    <div className={cn("p-2 rounded-lg", event.color)}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">{event.title}</h5>
                        <span className="text-xs text-gray-500">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                      {event.value && (
                        <div className="text-xs font-medium mt-1">
                          Value: {event.value.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Post-stream report component
function PostStreamReport({ report }: { report: PostStreamReport }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stream Summary</CardTitle>
          <CardDescription>
            {Math.floor(report.duration / 60)}h {report.duration % 60}m stream completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{report.totalViewers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Viewers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{report.peakConcurrent.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Peak Concurrent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${report.totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.floor(report.averageWatchTime / 60)}m</div>
              <div className="text-sm text-gray-600">Avg Watch Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>vs previous stream</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.performanceComparison.map((comparison) => (
              <div key={comparison.metric} className="flex items-center justify-between">
                <span className="text-sm">{comparison.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comparison.current.toLocaleString()}</span>
                  <div className="flex items-center gap-1">
                    {comparison.change > 0 ? (
                      <ArrowUp className="h-3 w-3 text-green-500" />
                    ) : comparison.change < 0 ? (
                      <ArrowDown className="h-3 w-3 text-red-500" />
                    ) : null}
                    <span className={cn(
                      "text-xs",
                      comparison.change > 0 ? "text-green-500" :
                      comparison.change < 0 ? "text-red-500" : "text-gray-500"
                    )}>
                      {Math.abs(comparison.change).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main component
export function LiveStreamAnalytics({
  streamId,
  isLive,
  metrics,
  demographics,
  events,
  postStreamReport,
  onExport,
  onAlert,
  className
}: LiveStreamAnalyticsProps) {
  const [selectedTab, setSelectedTab] = React.useState('realtime');
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [lastUpdate, setLastUpdate] = React.useState(new Date());

  // Simulate real-time updates
  React.useEffect(() => {
    if (!autoRefresh || !isLive) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, isLive]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stream Analytics</h2>
          <p className="text-gray-600">
            {isLive ? 'Live streaming analytics' : 'Post-stream performance report'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Connected</span>
              </div>
              <Button
                size="sm"
                variant={autoRefresh ? "default" : "outline"}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={cn("h-4 w-4 mr-1", autoRefresh && "animate-spin")} />
                {autoRefresh ? "Auto" : "Manual"}
              </Button>
            </div>
          )}
          
          {onExport && (
            <Select onValueChange={(value) => onExport(value as 'pdf' | 'csv' | 'json')}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
                <SelectItem value="json">JSON Data</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-6">
          {/* Live status */}
          {isLive && (
            <Alert>
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              <AlertDescription>
                Stream is live. Last updated: {lastUpdate.toLocaleTimeString()}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Real-time metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RealTimeMetricCard
              title="Current Viewers"
              value={metrics.viewerCount}
              change={8.5}
              changeType="increase"
              icon={Eye}
              color="bg-blue-500"
              isLive={isLive}
              subtitle="Live count"
            />
            <RealTimeMetricCard
              title="Peak Viewers"
              value={metrics.peakViewers}
              icon={TrendingUp}
              color="bg-green-500"
              subtitle="Session high"
            />
            <RealTimeMetricCard
              title="Chat Rate"
              value={metrics.chatRate}
              change={15.2}
              changeType="increase"
              icon={MessageCircle}
              color="bg-purple-500"
              subtitle="Per minute"
            />
            <RealTimeMetricCard
              title="Revenue/Min"
              value={metrics.revenuePerMinute}
              format="currency"
              change={22.1}
              changeType="increase"
              icon={DollarSign}
              color="bg-green-600"
              isLive={isLive}
              subtitle="Live earnings"
            />
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EventTimeline events={events} />
            </div>
            <StreamHealthMonitor health={metrics.streamHealth} />
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <RealTimeMetricCard
              title="Engagement Rate"
              value={metrics.engagementRate}
              format="percentage"
              icon={Zap}
              color="bg-orange-500"
              subtitle="Active participation"
            />
            <RealTimeMetricCard
              title="Chat Messages"
              value={metrics.interactions.chatMessages}
              icon={MessageCircle}
              color="bg-blue-500"
              subtitle="Total sent"
            />
            <RealTimeMetricCard
              title="Reactions"
              value={metrics.interactions.reactions}
              icon={Heart}
              color="bg-red-500"
              subtitle="Hearts & emojis"
            />
            <RealTimeMetricCard
              title="Shares"
              value={metrics.interactions.shares}
              icon={Share2}
              color="bg-purple-500"
              subtitle="Social shares"
            />
            <RealTimeMetricCard
              title="New Followers"
              value={metrics.newFollowers}
              icon={UserPlus}
              color="bg-green-500"
              subtitle="This stream"
            />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Total: ${metrics.revenue.total.toFixed(2)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tips</span>
                  <span className="font-medium">${metrics.revenue.tips.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gifts</span>
                  <span className="font-medium">${metrics.revenue.gifts.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Super Chats</span>
                  <span className="font-medium">${metrics.revenue.superChats.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Subscriptions</span>
                  <span className="font-medium">${metrics.revenue.subscriptions.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Interaction Metrics</CardTitle>
                <CardDescription>Viewer engagement breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Messages per Viewer</span>
                  <span className="font-medium">
                    {(metrics.interactions.chatMessages / Math.max(1, metrics.viewerCount)).toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reactions per Minute</span>
                  <span className="font-medium">
                    {metrics.interactions.reactions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Revenue per Viewer</span>
                  <span className="font-medium">
                    ${(metrics.revenue.total / Math.max(1, metrics.viewerCount)).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <AudienceDemographics demographics={demographics} />
        </TabsContent>

        <TabsContent value="report" className="space-y-6">
          {postStreamReport ? (
            <PostStreamReport report={postStreamReport} />
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Post-stream report will be available after the stream ends.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}