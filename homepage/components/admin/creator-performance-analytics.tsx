"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Star,
  Users,
  Video,
  Activity,
  Target,
  Award,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  CheckCircle,
  XCircle,
  Timer,
  Zap
} from "lucide-react"

interface PerformanceMetric {
  id: string
  name: string
  value: number | string
  change: number
  trend: "up" | "down" | "stable"
  benchmark: number | string
  status: "excellent" | "good" | "warning" | "critical"
  actionRequired: boolean
}

interface CreatorAnalytics {
  creatorId: string
  creatorName: string
  period: string
  revenue: {
    total: number
    monthly: number
    weekly: number
    daily: number
    growth: number
    projectedMonthly: number
  }
  orders: {
    total: number
    completed: number
    pending: number
    cancelled: number
    completionRate: number
    averageValue: number
  }
  performance: {
    responseTime: number // hours
    deliveryTime: number // days
    customerRating: number
    contentQuality: number
    repeatCustomerRate: number
    referralRate: number
  }
  engagement: {
    profileViews: number
    conversionRate: number
    favoriteCount: number
    shareCount: number
    messageResponseRate: number
    lastActive: string
  }
  compliance: {
    policyScore: number
    violations: number
    warnings: number
    trainingCompleted: boolean
    certificationStatus: string
  }
}

const mockAnalytics: CreatorAnalytics = {
  creatorId: "creator-001",
  creatorName: "Marie-Claire Dubois",
  period: "Last 30 Days",
  revenue: {
    total: 8500,
    monthly: 8500,
    weekly: 2125,
    daily: 283,
    growth: 15.5,
    projectedMonthly: 9800
  },
  orders: {
    total: 98,
    completed: 96,
    pending: 2,
    cancelled: 0,
    completionRate: 98,
    averageValue: 87
  },
  performance: {
    responseTime: 12,
    deliveryTime: 2.5,
    customerRating: 4.9,
    contentQuality: 95,
    repeatCustomerRate: 35,
    referralRate: 22
  },
  engagement: {
    profileViews: 1250,
    conversionRate: 7.8,
    favoriteCount: 342,
    shareCount: 89,
    messageResponseRate: 94,
    lastActive: "2 hours ago"
  },
  compliance: {
    policyScore: 100,
    violations: 0,
    warnings: 0,
    trainingCompleted: true,
    certificationStatus: "verified"
  }
}

const performanceIndicators: PerformanceMetric[] = [
  {
    id: "completion-rate",
    name: "Completion Rate",
    value: "98%",
    change: 2.5,
    trend: "up",
    benchmark: "95%",
    status: "excellent",
    actionRequired: false
  },
  {
    id: "response-time",
    name: "Response Time",
    value: "12h",
    change: -15,
    trend: "down",
    benchmark: "24h",
    status: "excellent",
    actionRequired: false
  },
  {
    id: "customer-rating",
    name: "Customer Rating",
    value: "4.9",
    change: 0.1,
    trend: "up",
    benchmark: "4.5",
    status: "excellent",
    actionRequired: false
  },
  {
    id: "revenue-growth",
    name: "Revenue Growth",
    value: "+15.5%",
    change: 15.5,
    trend: "up",
    benchmark: "+10%",
    status: "excellent",
    actionRequired: false
  },
  {
    id: "policy-compliance",
    name: "Policy Compliance",
    value: "100%",
    change: 0,
    trend: "stable",
    benchmark: "100%",
    status: "excellent",
    actionRequired: false
  },
  {
    id: "engagement-level",
    name: "Engagement Level",
    value: "94%",
    change: 5,
    trend: "up",
    benchmark: "80%",
    status: "good",
    actionRequired: false
  }
]

export function CreatorPerformanceAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days")
  const [selectedMetric, setSelectedMetric] = useState("revenue")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-100"
      case "good": return "text-blue-600 bg-blue-100"
      case "warning": return "text-yellow-600 bg-yellow-100"
      case "critical": return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUp className="h-3 w-3" />
      case "down": return <ArrowDown className="h-3 w-3" />
      default: return <Minus className="h-3 w-3" />
    }
  }

  const getTrendColor = (trend: string, isPositive: boolean = true) => {
    if (trend === "stable") return "text-gray-600"
    if (trend === "up") return isPositive ? "text-green-600" : "text-red-600"
    if (trend === "down") return isPositive ? "text-red-600" : "text-green-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <p className="text-gray-600">Comprehensive creator performance metrics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceIndicators.map((metric) => (
          <Card key={metric.id} className={metric.actionRequired ? "ring-2 ring-orange-200" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                  {metric.status === "excellent" && <CheckCircle className="h-5 w-5" />}
                  {metric.status === "good" && <ChevronUp className="h-5 w-5" />}
                  {metric.status === "warning" && <AlertTriangle className="h-5 w-5" />}
                  {metric.status === "critical" && <XCircle className="h-5 w-5" />}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">vs Benchmark:</span>
                  <span className="font-medium">{metric.benchmark}</span>
                </div>
                <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
              {metric.actionRequired && (
                <div className="mt-3 pt-3 border-t">
                  <Badge variant="outline" className="text-orange-600">
                    Action Required
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Track earnings, growth, and financial performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold">${mockAnalytics.revenue.total.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-sm">+{mockAnalytics.revenue.growth}%</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Average Order Value</span>
                    <Activity className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold">${mockAnalytics.orders.averageValue}</p>
                  <p className="text-sm text-gray-500 mt-1">Per transaction</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Projected Monthly</span>
                    <Target className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold">${mockAnalytics.revenue.projectedMonthly.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">Based on current trend</p>
                </div>
              </div>

              {/* Revenue Breakdown Chart Placeholder */}
              <div className="mt-6 p-8 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center">
                  <BarChart3 className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-center text-gray-600 mt-2">Revenue trend chart would be displayed here</p>
              </div>

              {/* Revenue Table */}
              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Avg Value</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Daily</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>${mockAnalytics.revenue.daily}</TableCell>
                      <TableCell>$94</TableCell>
                      <TableCell className="text-green-600">+12%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Weekly</TableCell>
                      <TableCell>24</TableCell>
                      <TableCell>${mockAnalytics.revenue.weekly.toLocaleString()}</TableCell>
                      <TableCell>$89</TableCell>
                      <TableCell className="text-green-600">+15%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Monthly</TableCell>
                      <TableCell>98</TableCell>
                      <TableCell>${mockAnalytics.revenue.monthly.toLocaleString()}</TableCell>
                      <TableCell>$87</TableCell>
                      <TableCell className="text-green-600">+15.5%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Analytics</CardTitle>
              <CardDescription>Order fulfillment and completion metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Total Orders</span>
                    <Video className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold">{mockAnalytics.orders.total}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Completed</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{mockAnalytics.orders.completed}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Pending</span>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{mockAnalytics.orders.pending}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Cancelled</span>
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">{mockAnalytics.orders.cancelled}</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Completion Rate</span>
                  <span className="text-sm font-semibold">{mockAnalytics.orders.completionRate}%</span>
                </div>
                <Progress value={mockAnalytics.orders.completionRate} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">Target: 95% • Status: Exceeding</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Quality and efficiency indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Response Time</span>
                      </div>
                      <span className="text-sm font-semibold">{mockAnalytics.performance.responseTime}h</span>
                    </div>
                    <Progress value={Math.max(0, 100 - (mockAnalytics.performance.responseTime * 2))} />
                    <p className="text-xs text-gray-500 mt-1">Target: Under 24 hours</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Delivery Time</span>
                      </div>
                      <span className="text-sm font-semibold">{mockAnalytics.performance.deliveryTime} days</span>
                    </div>
                    <Progress value={Math.max(0, 100 - (mockAnalytics.performance.deliveryTime * 10))} />
                    <p className="text-xs text-gray-500 mt-1">Target: Under 3 days</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Customer Rating</span>
                      </div>
                      <span className="text-sm font-semibold">{mockAnalytics.performance.customerRating}/5</span>
                    </div>
                    <Progress value={mockAnalytics.performance.customerRating * 20} />
                    <p className="text-xs text-gray-500 mt-1">Target: Above 4.5 stars</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Content Quality</span>
                      </div>
                      <span className="text-sm font-semibold">{mockAnalytics.performance.contentQuality}%</span>
                    </div>
                    <Progress value={mockAnalytics.performance.contentQuality} />
                    <p className="text-xs text-gray-500 mt-1">Target: Above 90%</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Repeat Customer Rate</span>
                      </div>
                      <span className="text-sm font-semibold">{mockAnalytics.performance.repeatCustomerRate}%</span>
                    </div>
                    <Progress value={mockAnalytics.performance.repeatCustomerRate} />
                    <p className="text-xs text-gray-500 mt-1">Target: Above 30%</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Referral Rate</span>
                      </div>
                      <span className="text-sm font-semibold">{mockAnalytics.performance.referralRate}%</span>
                    </div>
                    <Progress value={mockAnalytics.performance.referralRate} />
                    <p className="text-xs text-gray-500 mt-1">Target: Above 20%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Analytics</CardTitle>
              <CardDescription>Creator activity and audience interaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Profile Views</span>
                    <Activity className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold">{mockAnalytics.engagement.profileViews.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-sm">+23%</span>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <Target className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold">{mockAnalytics.engagement.conversionRate}%</p>
                  <p className="text-sm text-gray-500 mt-1">Views to orders</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Response Rate</span>
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold">{mockAnalytics.engagement.messageResponseRate}%</p>
                  <p className="text-sm text-gray-500 mt-1">Message replies</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Last Active</p>
                    <p className="text-sm text-gray-600">{mockAnalytics.engagement.lastActive}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Training</CardTitle>
              <CardDescription>Policy adherence and certification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">Policy Compliance Score</p>
                      <p className="text-2xl font-bold">{mockAnalytics.compliance.policyScore}%</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Violations</span>
                      {mockAnalytics.compliance.violations > 0 ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-2xl font-bold">{mockAnalytics.compliance.violations}</p>
                    <p className="text-sm text-gray-500 mt-1">This period</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Warnings</span>
                      {mockAnalytics.compliance.warnings > 0 ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-2xl font-bold">{mockAnalytics.compliance.warnings}</p>
                    <p className="text-sm text-gray-500 mt-1">Active warnings</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Training</span>
                      {mockAnalytics.compliance.trainingCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <p className="text-lg font-bold">
                      {mockAnalytics.compliance.trainingCompleted ? "Completed" : "Pending"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Required modules</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Certification Status</p>
                      <p className="text-sm text-gray-600">Platform certification level</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">
                      {mockAnalytics.compliance.certificationStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}