'use client';

import { useState, useMemo } from 'react';
import { StreamAnalytics, ENGAGEMENT_PYRAMID } from '@/lib/types/live-streaming';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Heart, 
  DollarSign,
  Share2,
  Clock,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreamAnalyticsDashboardProps {
  analytics: StreamAnalytics;
  isLive?: boolean;
  className?: string;
}

export function StreamAnalyticsDashboard({
  analytics,
  isLive = false,
  className
}: StreamAnalyticsDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview');

  const engagementDistribution = useMemo(() => {
    const distribution = ENGAGEMENT_PYRAMID.map(level => ({
      ...level,
      count: 0,
      percentage: 0
    }));

    analytics.viewerEngagements.forEach(engagement => {
      const levelIndex = engagement.engagementLevel - 1;
      if (levelIndex >= 0 && levelIndex < distribution.length) {
        distribution[levelIndex].count++;
      }
    });

    const total = analytics.viewerEngagements.length;
    distribution.forEach(level => {
      level.percentage = total > 0 ? (level.count / total) * 100 : 0;
    });

    return distribution;
  }, [analytics.viewerEngagements]);

  const stats = [
    {
      label: 'Current Viewers',
      value: analytics.metrics.viewerCount,
      icon: Users,
      color: 'text-blue-500',
      trend: isLive ? '+12%' : null
    },
    {
      label: 'Peak Viewers',
      value: analytics.metrics.peakViewers,
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      label: 'Avg Watch Time',
      value: `${Math.floor(analytics.metrics.averageWatchTime / 60)}m`,
      icon: Clock,
      color: 'text-purple-500'
    },
    {
      label: 'Chat Messages',
      value: analytics.metrics.chatMessages,
      icon: MessageCircle,
      color: 'text-orange-500'
    },
    {
      label: 'Reactions',
      value: analytics.metrics.reactions,
      icon: Heart,
      color: 'text-red-500'
    },
    {
      label: 'Tips Received',
      value: `$${analytics.metrics.tips}`,
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      label: 'New Followers',
      value: analytics.metrics.newFollowers,
      icon: UserPlus,
      color: 'text-indigo-500'
    },
    {
      label: 'Shares',
      value: analytics.metrics.shareCount,
      icon: Share2,
      color: 'text-pink-500'
    }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {isLive && (
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="animate-pulse">
            LIVE
          </Badge>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Stream started {new Date(analytics.startTime).toLocaleTimeString()}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    {stat.trend && (
                      <p className="text-xs text-green-500 mt-1">{stat.trend}</p>
                    )}
                  </div>
                  <Icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Rate</CardTitle>
              <CardDescription>
                Overall viewer engagement: {analytics.metrics.engagementRate.toFixed(1)}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={analytics.metrics.engagementRate} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Viewer Retention</CardTitle>
              <CardDescription>
                {analytics.metrics.returningViewers} returning viewers ({
                  ((analytics.metrics.returningViewers / Math.max(1, analytics.metrics.viewerCount)) * 100).toFixed(0)
                }%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400">New</div>
                  <div className="text-lg font-semibold">
                    {analytics.metrics.viewerCount - analytics.metrics.returningViewers}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Returning</div>
                  <div className="text-lg font-semibold">
                    {analytics.metrics.returningViewers}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Pyramid Distribution</CardTitle>
              <CardDescription>
                Viewer distribution across engagement levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {engagementDistribution.map((level) => (
                <div key={level.level} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{level.icon}</span>
                      <span className="font-medium">{level.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        {level.count} viewers
                      </span>
                      <Badge variant="outline">
                        {level.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={level.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Peak Moments</CardTitle>
              <CardDescription>
                Highest engagement points during the stream
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.peakMoments.slice(0, 5).map((moment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <p className="text-sm font-medium">{moment.event}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(moment.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {moment.viewerCount} viewers
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>
                Total earnings: ${analytics.revenue.total}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tips</span>
                  <span className="font-medium">${analytics.revenue.tips}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gifts</span>
                  <span className="font-medium">${analytics.revenue.gifts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Subscriptions</span>
                  <span className="font-medium">${analytics.revenue.subscriptions}</span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="font-bold text-lg">${analytics.revenue.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Revenue Per Viewer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${(analytics.revenue.total / Math.max(1, analytics.metrics.viewerCount)).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Per viewer average
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}