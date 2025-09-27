"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from 'next-intl'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Video,
  DollarSign,
  Star,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Target,
  Clock,
  MessageSquare,
  RefreshCw,
  Download,
  Filter,
  Eye,
  ArrowUp,
  ArrowDown,
  Activity
} from "lucide-react"

interface AnalyticsData {
  userGrowth: {
    total: number
    change: number
    trend: "up" | "down"
    newUsers: number
    activeUsers: number
    retentionRate: number
  }
  revenue: {
    total: number
    change: number
    trend: "up" | "down"
    averageOrderValue: number
    conversionRate: number
    recurringCustomers: number
  }
  content: {
    totalVideos: number
    change: number
    trend: "up" | "down"
    averageRating: number
    completionRate: number
    flaggedContent: number
  }
  creators: {
    total: number
    active: number
    pending: number
    topEarner: string
    averageEarnings: number
    satisfactionScore: number
  }
  geographic: {
    [country: string]: {
      users: number
      revenue: number
      percentage: number
    }
  }
  devices: {
    mobile: number
    desktop: number
    tablet: number
  }
  timeMetrics: {
    averageSessionDuration: string
    bounceRate: number
    pageViews: number
  }
}

const mockAnalytics: AnalyticsData = {
  userGrowth: {
    total: 12450,
    change: 15.2,
    trend: "up",
    newUsers: 842,
    activeUsers: 8934,
    retentionRate: 73.4
  },
  revenue: {
    total: 125000,
    change: 22.8,
    trend: "up",
    averageOrderValue: 87.50,
    conversionRate: 4.2,
    recurringCustomers: 3245
  },
  content: {
    totalVideos: 8920,
    change: 18.5,
    trend: "up",
    averageRating: 4.7,
    completionRate: 94.2,
    flaggedContent: 23
  },
  creators: {
    total: 156,
    active: 134,
    pending: 8,
    topEarner: "Wyclef Jean",
    averageEarnings: 2850,
    satisfactionScore: 4.6
  },
  geographic: {
    "United States": { users: 4850, revenue: 62500, percentage: 39 },
    "Canada": { users: 2340, revenue: 28750, percentage: 19 },
    "Haiti": { users: 1890, revenue: 15000, percentage: 15 },
    "France": { users: 1450, revenue: 12250, percentage: 12 },
    "Other": { users: 1920, revenue: 6500, percentage: 15 }
  },
  devices: {
    mobile: 68,
    desktop: 25,
    tablet: 7
  },
  timeMetrics: {
    averageSessionDuration: "8m 34s",
    bounceRate: 32.1,
    pageViews: 45820
  }
}

export function AnalyticsDashboard() {
  const t = useTranslations('admin.analytics')
  const tCommon = useTranslations('admin.common')
  const [timeRange, setTimeRange] = useState("30")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  const getChangeIcon = (trend: "up" | "down") => {
    return trend === "up" ? (
      <ArrowUp className="h-3 w-3 text-green-600" />
    ) : (
      <ArrowDown className="h-3 w-3 text-red-600" />
    )
  }

  const getChangeColor = (trend: "up" | "down") => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('title')}</h2>
          <p className="text-muted-foreground">{t('overview')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{tCommon('last', {fallback: 'Last'})} 7 {tCommon('days', {fallback: 'days'})}</SelectItem>
              <SelectItem value="30">{tCommon('last', {fallback: 'Last'})} 30 {tCommon('days', {fallback: 'days'})}</SelectItem>
              <SelectItem value="90">{tCommon('last', {fallback: 'Last'})} 90 {tCommon('days', {fallback: 'days'})}</SelectItem>
              <SelectItem value="365">{tCommon('last', {fallback: 'Last'})} {tCommon('year', {fallback: 'year'})}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {tCommon('export')} {tCommon('report', {fallback: 'Report'})}
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {tCommon('refresh')}
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('metrics.users')}</p>
                <p className="text-2xl font-bold">{mockAnalytics.userGrowth.total.toLocaleString()}</p>
                <div className={`flex items-center text-sm mt-1 ${getChangeColor(mockAnalytics.userGrowth.trend)}`}>
                  {getChangeIcon(mockAnalytics.userGrowth.trend)}
                  <span className="ml-1">+{mockAnalytics.userGrowth.change}%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('metrics.revenue')}</p>
                <p className="text-2xl font-bold">${mockAnalytics.revenue.total.toLocaleString()}</p>
                <div className={`flex items-center text-sm mt-1 ${getChangeColor(mockAnalytics.revenue.trend)}`}>
                  {getChangeIcon(mockAnalytics.revenue.trend)}
                  <span className="ml-1">+{mockAnalytics.revenue.change}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{tCommon('videosCreated', {fallback: 'Videos Created'})}</p>
                <p className="text-2xl font-bold">{mockAnalytics.content.totalVideos.toLocaleString()}</p>
                <div className={`flex items-center text-sm mt-1 ${getChangeColor(mockAnalytics.content.trend)}`}>
                  {getChangeIcon(mockAnalytics.content.trend)}
                  <span className="ml-1">+{mockAnalytics.content.change}%</span>
                </div>
              </div>
              <Video className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{tCommon('averageRating', {fallback: 'Average Rating'})}</p>
                <p className="text-2xl font-bold">{mockAnalytics.content.averageRating}</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <Star className="h-3 w-3 fill-current mr-1" />
                  <span>{tCommon('highSatisfaction', {fallback: 'High satisfaction'})}</span>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{tCommon('overview', {fallback: 'Overview'})}</TabsTrigger>
          <TabsTrigger value="users">{tCommon('users', {fallback: 'Users'})}</TabsTrigger>
          <TabsTrigger value="revenue">{tCommon('revenue', {fallback: 'Revenue'})}</TabsTrigger>
          <TabsTrigger value="content">{tCommon('content', {fallback: 'Content'})}</TabsTrigger>
          <TabsTrigger value="geographic">{tCommon('geographic', {fallback: 'Geographic'})}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tCommon('newUsers', {fallback: 'New Users'})}</p>
                      <p className="text-xl font-bold">{mockAnalytics.userGrowth.newUsers}</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tCommon('conversionRate', {fallback: 'Conversion Rate'})}</p>
                      <p className="text-xl font-bold">{mockAnalytics.revenue.conversionRate}%</p>
                      <p className="text-xs text-muted-foreground">Browse to purchase</p>
                    </div>
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tCommon('sessionDuration', {fallback: 'Session Duration'})}</p>
                      <p className="text-xl font-bold">{mockAnalytics.timeMetrics.averageSessionDuration}</p>
                      <p className="text-xs text-muted-foreground">Average time</p>
                    </div>
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>{tCommon('performanceTrends', {fallback: 'Performance Trends'})}</CardTitle>
                <CardDescription>{tCommon('keyMetricsOverTime', {fallback: 'Key metrics over time'})}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">{tCommon('chartsPlaceholder', {fallback: 'Interactive charts would be displayed here'})}</p>
                    <p className="text-sm text-gray-500">Using libraries like Recharts or Chart.js</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">{mockAnalytics.userGrowth.activeUsers.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Monthly active</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Retention Rate</p>
                      <p className="text-2xl font-bold">{mockAnalytics.userGrowth.retentionRate}%</p>
                      <p className="text-xs text-muted-foreground">30-day retention</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                      <p className="text-2xl font-bold">{mockAnalytics.timeMetrics.bounceRate}%</p>
                      <p className="text-xs text-muted-foreground">Single page visits</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Device Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>How users access the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <span>Mobile</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${mockAnalytics.devices.mobile}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{mockAnalytics.devices.mobile}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-5 w-5 text-green-600" />
                      <span>Desktop</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${mockAnalytics.devices.desktop}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{mockAnalytics.devices.desktop}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Tablet className="h-5 w-5 text-purple-600" />
                      <span>Tablet</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${mockAnalytics.devices.tablet}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{mockAnalytics.devices.tablet}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                      <p className="text-2xl font-bold">${mockAnalytics.revenue.averageOrderValue.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Per transaction</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Recurring Customers</p>
                      <p className="text-2xl font-bold">{mockAnalytics.revenue.recurringCustomers.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Repeat buyers</p>
                    </div>
                    <RefreshCw className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Creator Satisfaction</p>
                      <p className="text-2xl font-bold">{mockAnalytics.creators.satisfactionScore}</p>
                      <p className="text-xs text-muted-foreground">Average rating</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
                <CardDescription>Platform fee vs creator earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>Creator Earnings (85%)</span>
                    </div>
                    <span className="font-semibold">${(mockAnalytics.revenue.total * 0.85).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span>Platform Fees (15%)</span>
                    </div>
                    <span className="font-semibold">${(mockAnalytics.revenue.total * 0.15).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold">{mockAnalytics.content.completionRate}%</p>
                      <p className="text-xs text-muted-foreground">Orders completed</p>
                    </div>
                    <Video className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Flagged Content</p>
                      <p className="text-2xl font-bold">{mockAnalytics.content.flaggedContent}</p>
                      <p className="text-xs text-muted-foreground">Pending review</p>
                    </div>
                    <Eye className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Creators</p>
                      <p className="text-2xl font-bold">{mockAnalytics.creators.active}</p>
                      <p className="text-xs text-muted-foreground">Of {mockAnalytics.creators.total} total</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{tCommon('geographicDistribution', {fallback: 'Geographic Distribution'})}</CardTitle>
              <CardDescription>{tCommon('geographicDescription', {fallback: 'Users and revenue by location'})}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(mockAnalytics.geographic).map(([country, data]) => (
                  <div key={country} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <span className="font-medium">{country}</span>
                        <p className="text-sm text-muted-foreground">{data.users.toLocaleString()} users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${data.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{data.percentage}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}