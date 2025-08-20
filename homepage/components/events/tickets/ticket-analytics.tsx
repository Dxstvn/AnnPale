'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
  MousePointer
} from 'lucide-react';

interface AnalyticsData {
  salesFunnel: {
    stage: string;
    count: number;
    percentage: number;
  }[];
  trafficSources: {
    source: string;
    visits: number;
    conversions: number;
    revenue: number;
  }[];
  geographicData: {
    country: string;
    city: string;
    sales: number;
    percentage: number;
  }[];
  deviceBreakdown: {
    device: string;
    sessions: number;
    conversions: number;
    percentage: number;
  }[];
  salesOverTime: {
    date: string;
    sales: number;
    revenue: number;
  }[];
  conversionMetrics: {
    overallRate: number;
    cartAbandonment: number;
    averageOrderValue: number;
    repeatPurchaseRate: number;
  };
}

interface TicketAnalyticsProps {
  eventId: string;
  analyticsData: AnalyticsData;
  dateRange: { start: Date; end: Date };
}

export function TicketAnalytics({
  eventId,
  analyticsData,
  dateRange
}: TicketAnalyticsProps) {
  const COLORS = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  const funnelData = analyticsData.salesFunnel.map((stage, index) => ({
    ...stage,
    fill: COLORS[index % COLORS.length]
  }));

  const deviceIcons = {
    Desktop: Monitor,
    Mobile: Smartphone,
    Tablet: Tablet
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.conversionMetrics.overallRate}%
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">+2.3% vs last event</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cart Abandonment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.conversionMetrics.cartAbandonment}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Optimize checkout flow</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analyticsData.conversionMetrics.averageOrderValue}
            </div>
            <p className="text-xs text-gray-500 mt-1">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Repeat Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.conversionMetrics.repeatPurchaseRate}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Returning customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Funnel Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.salesFunnel.map((stage, index) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <Badge variant="secondary">{stage.count} users</Badge>
                  </div>
                  <span className="text-sm text-gray-600">{stage.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className="h-6 rounded-full flex items-center justify-end pr-2"
                    style={{
                      width: `${stage.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  >
                    {index < analyticsData.salesFunnel.length - 1 && (
                      <span className="text-xs text-white font-medium">
                        {((stage.count / analyticsData.salesFunnel[index + 1].count) * 100).toFixed(1)}% → next
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.trafficSources}
                  dataKey="visits"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ source, visits }) => `${source}: ${visits}`}
                >
                  {analyticsData.trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {analyticsData.trafficSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{source.source}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{source.conversions} conversions</span>
                    <span className="font-medium">${source.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.salesOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  name="Tickets Sold"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#EC4899"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.geographicData.slice(0, 5).map((location) => (
                <div key={`${location.country}-${location.city}`} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{location.city}</div>
                    <div className="text-sm text-gray-500">{location.country}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{location.sales} sales</div>
                    <div className="text-sm text-gray-500">{location.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analyticsData.deviceBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="device" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#8B5CF6" name="Sessions" />
                <Bar dataKey="conversions" fill="#EC4899" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {analyticsData.deviceBreakdown.map((device) => {
                const Icon = deviceIcons[device.device as keyof typeof deviceIcons] || Monitor;
                return (
                  <div key={device.device} className="text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <div className="text-sm font-medium">{device.device}</div>
                    <div className="text-xs text-gray-500">{device.percentage}%</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-sm">Analytics Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Eye className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">High mobile traffic</p>
                <p className="text-blue-700">
                  {analyticsData.deviceBreakdown.find(d => d.device === 'Mobile')?.percentage}% of traffic is mobile. 
                  Ensure mobile checkout is optimized.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ShoppingCart className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Cart abandonment opportunity</p>
                <p className="text-blue-700">
                  Send reminder emails to recover {analyticsData.conversionMetrics.cartAbandonment}% abandoned carts.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Upsell potential</p>
                <p className="text-blue-700">
                  Average order value is ${analyticsData.conversionMetrics.averageOrderValue}. 
                  Consider bundle offers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MousePointer className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Top traffic source</p>
                <p className="text-blue-700">
                  {analyticsData.trafficSources[0]?.source} drives most traffic. 
                  Increase investment here.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}