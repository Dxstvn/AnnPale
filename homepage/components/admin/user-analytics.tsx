"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  UserPlus,
  UserMinus,
  Activity,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Clock,
  Eye,
  MousePointer,
  Target,
  Map,
  BarChart3,
  PieChart,
  Download,
  Filter,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Zap,
  Heart
} from "lucide-react"
import { cn } from "@/lib/utils"

interface UserMetrics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  returningUsers: number
  churnedUsers: number
  engagementRate: number
  sessionDuration: number
  pageViews: number
}

interface AcquisitionChannel {
  channel: string
  users: number
  percentage: number
  conversionRate: number
  avgLifetimeValue: number
  trend: "up" | "down" | "stable"
}

interface RetentionCohort {
  cohort: string
  size: number
  day1: number
  day7: number
  day30: number
  day60: number
  day90: number
}

interface GeographicData {
  country: string
  flag: string
  users: number
  percentage: number
  avgSessionTime: number
  conversionRate: number
}

interface DeviceUsage {
  device: string
  icon: any
  users: number
  percentage: number
  avgSessionTime: number
  bounceRate: number
}

interface UserSegment {
  segment: string
  size: number
  characteristics: string[]
  engagementLevel: "high" | "medium" | "low"
  value: "high" | "medium" | "low"
  churnRisk: "high" | "medium" | "low"
}

const userMetrics: UserMetrics = {
  totalUsers: 45892,
  activeUsers: 12847,
  newUsers: 3421,
  returningUsers: 9426,
  churnedUsers: 892,
  engagementRate: 28,
  sessionDuration: 7.3,
  pageViews: 189234
}

const acquisitionChannels: AcquisitionChannel[] = [
  {
    channel: "Organic Search",
    users: 13767,
    percentage: 30,
    conversionRate: 4.2,
    avgLifetimeValue: 120,
    trend: "up"
  },
  {
    channel: "Social Media",
    users: 11473,
    percentage: 25,
    conversionRate: 3.8,
    avgLifetimeValue: 95,
    trend: "up"
  },
  {
    channel: "Direct",
    users: 9178,
    percentage: 20,
    conversionRate: 5.1,
    avgLifetimeValue: 150,
    trend: "stable"
  },
  {
    channel: "Referral",
    users: 6884,
    percentage: 15,
    conversionRate: 3.5,
    avgLifetimeValue: 110,
    trend: "down"
  },
  {
    channel: "Email",
    users: 4589,
    percentage: 10,
    conversionRate: 6.2,
    avgLifetimeValue: 180,
    trend: "up"
  }
]

const retentionCohorts: RetentionCohort[] = [
  {
    cohort: "January 2024",
    size: 5234,
    day1: 100,
    day7: 65,
    day30: 42,
    day60: 35,
    day90: 28
  },
  {
    cohort: "February 2024",
    size: 6102,
    day1: 100,
    day7: 68,
    day30: 45,
    day60: 38,
    day90: 30
  },
  {
    cohort: "March 2024",
    size: 7421,
    day1: 100,
    day7: 70,
    day30: 48,
    day60: 40,
    day90: 0
  }
]

const geographicData: GeographicData[] = [
  {
    country: "United States",
    flag: "🇺🇸",
    users: 18357,
    percentage: 40,
    avgSessionTime: 8.2,
    conversionRate: 4.5
  },
  {
    country: "Haiti",
    flag: "🇭🇹",
    users: 11473,
    percentage: 25,
    avgSessionTime: 9.1,
    conversionRate: 5.2
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    users: 6884,
    percentage: 15,
    avgSessionTime: 7.8,
    conversionRate: 4.1
  },
  {
    country: "France",
    flag: "🇫🇷",
    users: 4589,
    percentage: 10,
    avgSessionTime: 6.5,
    conversionRate: 3.8
  },
  {
    country: "Dominican Republic",
    flag: "🇩🇴",
    users: 4589,
    percentage: 10,
    avgSessionTime: 7.2,
    conversionRate: 4.3
  }
]

const deviceUsage: DeviceUsage[] = [
  {
    device: "Mobile",
    icon: Smartphone,
    users: 27535,
    percentage: 60,
    avgSessionTime: 6.8,
    bounceRate: 42
  },
  {
    device: "Desktop",
    icon: Monitor,
    users: 13768,
    percentage: 30,
    avgSessionTime: 9.2,
    bounceRate: 35
  },
  {
    device: "Tablet",
    icon: Tablet,
    users: 4589,
    percentage: 10,
    avgSessionTime: 7.5,
    bounceRate: 38
  }
]

const userSegments: UserSegment[] = [
  {
    segment: "Power Users",
    size: 2295,
    characteristics: ["Daily visits", "Multiple bookings", "High engagement"],
    engagementLevel: "high",
    value: "high",
    churnRisk: "low"
  },
  {
    segment: "Regular Customers",
    size: 9178,
    characteristics: ["Weekly visits", "Occasional bookings", "Moderate engagement"],
    engagementLevel: "medium",
    value: "medium",
    churnRisk: "medium"
  },
  {
    segment: "New Users",
    size: 3421,
    characteristics: ["Recent signup", "Exploring platform", "Low activity"],
    engagementLevel: "low",
    value: "low",
    churnRisk: "high"
  },
  {
    segment: "At-Risk Users",
    size: 1836,
    characteristics: ["Declining activity", "No recent bookings", "Low engagement"],
    engagementLevel: "low",
    value: "medium",
    churnRisk: "high"
  }
]

export function UserAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedMetric, setSelectedMetric] = useState("overview")

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down": return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case "high": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRetentionColor = (value: number) => {
    if (value >= 70) return "bg-green-500"
    if (value >= 50) return "bg-yellow-500"
    if (value >= 30) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Analytics</h2>
          <p className="text-gray-600">User behavior, acquisition, and retention insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* User Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{userMetrics.totalUsers.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <UserPlus className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+{userMetrics.newUsers.toLocaleString()} new</span>
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
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{userMetrics.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{userMetrics.engagementRate}% engagement</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Session</p>
                <p className="text-2xl font-bold">{userMetrics.sessionDuration}m</p>
                <p className="text-xs text-gray-500 mt-1">Per user</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Views</p>
                <p className="text-2xl font-bold">{(userMetrics.pageViews / 1000).toFixed(1)}K</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="acquisition" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
        </TabsList>

        <TabsContent value="acquisition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Acquisition Channels</CardTitle>
              <CardDescription>How users discover and join the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel</TableHead>
                    <TableHead className="text-right">Users</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                    <TableHead className="text-right">Conversion Rate</TableHead>
                    <TableHead className="text-right">Avg LTV</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {acquisitionChannels.map((channel) => (
                    <TableRow key={channel.channel}>
                      <TableCell className="font-medium">{channel.channel}</TableCell>
                      <TableCell className="text-right">{channel.users.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>{channel.percentage}%</span>
                          <Progress value={channel.percentage} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{channel.conversionRate}%</TableCell>
                      <TableCell className="text-right">${channel.avgLifetimeValue}</TableCell>
                      <TableCell>{getTrendIcon(channel.trend)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Retention Cohort Analysis</CardTitle>
              <CardDescription>User retention rates by signup cohort</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cohort</TableHead>
                      <TableHead className="text-right">Size</TableHead>
                      <TableHead className="text-center">Day 1</TableHead>
                      <TableHead className="text-center">Day 7</TableHead>
                      <TableHead className="text-center">Day 30</TableHead>
                      <TableHead className="text-center">Day 60</TableHead>
                      <TableHead className="text-center">Day 90</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {retentionCohorts.map((cohort) => (
                      <TableRow key={cohort.cohort}>
                        <TableCell className="font-medium">{cohort.cohort}</TableCell>
                        <TableCell className="text-right">{cohort.size.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <div className={cn("inline-block px-2 py-1 rounded text-xs text-white", getRetentionColor(cohort.day1))}>
                            {cohort.day1}%
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={cn("inline-block px-2 py-1 rounded text-xs text-white", getRetentionColor(cohort.day7))}>
                            {cohort.day7}%
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={cn("inline-block px-2 py-1 rounded text-xs text-white", getRetentionColor(cohort.day30))}>
                            {cohort.day30}%
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={cn("inline-block px-2 py-1 rounded text-xs text-white", getRetentionColor(cohort.day60))}>
                            {cohort.day60}%
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {cohort.day90 > 0 ? (
                            <div className={cn("inline-block px-2 py-1 rounded text-xs text-white", getRetentionColor(cohort.day90))}>
                              {cohort.day90}%
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>Platform access by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceUsage.map((device) => {
                    const Icon = device.icon
                    return (
                      <div key={device.device} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium">{device.device}</p>
                            <p className="text-sm text-gray-600">
                              {device.users.toLocaleString()} users ({device.percentage}%)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{device.avgSessionTime}m avg</p>
                          <p className="text-xs text-gray-500">{device.bounceRate}% bounce</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Patterns</CardTitle>
                <CardDescription>User activity throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">Peak Hours</span>
                    </div>
                    <span className="text-sm">7-9 PM EST</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Most Active Day</span>
                    </div>
                    <span className="text-sm">Saturday</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Avg Actions/Session</span>
                    </div>
                    <span className="text-sm">12.4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Feature Adoption</span>
                    </div>
                    <span className="text-sm">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Users by country and region</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Users</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                    <TableHead className="text-right">Avg Session</TableHead>
                    <TableHead className="text-right">Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {geographicData.map((country) => (
                    <TableRow key={country.country}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span className="font-medium">{country.country}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{country.users.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>{country.percentage}%</span>
                          <Progress value={country.percentage} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{country.avgSessionTime}m</TableCell>
                      <TableCell className="text-right">{country.conversionRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segmentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Segments</CardTitle>
              <CardDescription>Behavioral segmentation and characteristics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userSegments.map((segment) => (
                  <div key={segment.segment} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{segment.segment}</h4>
                        <p className="text-sm text-gray-600">
                          {segment.size.toLocaleString()} users
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getEngagementColor(segment.engagementLevel)}>
                          {segment.engagementLevel} engagement
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <p className="font-medium mb-1">Characteristics:</p>
                        <ul className="space-y-1">
                          {segment.characteristics.map((char, idx) => (
                            <li key={idx} className="text-gray-600">• {char}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">Value</p>
                          <Badge variant="outline" className={getEngagementColor(segment.value)}>
                            {segment.value}
                          </Badge>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">Churn Risk</p>
                          <Badge variant="outline" className={getEngagementColor(segment.churnRisk === "high" ? "low" : segment.churnRisk === "low" ? "high" : "medium")}>
                            {segment.churnRisk}
                          </Badge>
                        </div>
                      </div>
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