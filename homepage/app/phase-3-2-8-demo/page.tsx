"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ReferenceLine
} from "recharts"
import {
  ArrowLeft,
  Activity,
  Radio,
  Eye,
  DollarSign,
  Clock,
  Bell,
  TrendingUp,
  TrendingDown,
  Timer,
  Target,
  Users,
  MessageSquare,
  Video,
  Star,
  CreditCard,
  ShoppingBag,
  AlertCircle,
  Zap,
  Wifi,
  WifiOff,
  RefreshCw,
  BarChart3,
  Heart,
  Share2,
  Gift,
  PlayCircle,
  CheckCircle,
  UserCheck,
  Send,
  Receipt,
  Sparkles,
  Flame,
  Award,
  Calendar,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Filter,
  Settings,
  Download,
  Info,
  Plus,
  Minus,
  Hash,
  Gauge,
  PieChart as PieIcon,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  X
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { RealTimeAnalytics } from "@/components/creator/analytics/real-time-analytics"

// Demo data for visualizations
const realTimeMetricsOverview = [
  { metric: "Active Viewers", value: 147, change: 12, status: "live", color: "#3B82F6" },
  { metric: "Current Earnings", value: 2847, change: 8, status: "live", color: "#10B981" },
  { metric: "Pending Requests", value: 7, change: 40, status: "alert", color: "#F97316" },
  { metric: "Response Timer", value: "0:47:23", change: null, status: "warning", color: "#EF4444" },
  { metric: "Trend Detection", value: "Rising", change: 15, status: "positive", color: "#8B5CF6" }
]

const updateRatesData = [
  { metric: "Active Viewers", rate: "Every second", type: "Counter", priority: "High" },
  { metric: "Current Earnings", rate: "Per transaction", type: "Ticker", priority: "High" },
  { metric: "Pending Requests", rate: "Instant", type: "Badge", priority: "Critical" },
  { metric: "Response Timer", rate: "Per minute", type: "Countdown", priority: "Critical" },
  { metric: "Trend Detection", rate: "5 minutes", type: "Indicator", priority: "Medium" }
]

const activityTypes = [
  { type: "Bookings", count: 24, icon: ShoppingBag, color: "text-blue-600", trend: "up" },
  { type: "Videos", count: 18, icon: Video, color: "text-green-600", trend: "up" },
  { type: "Messages", count: 31, icon: MessageSquare, color: "text-purple-600", trend: "up" },
  { type: "Reviews", count: 12, icon: Star, color: "text-yellow-600", trend: "stable" },
  { type: "Payments", count: 15, icon: CreditCard, color: "text-emerald-600", trend: "up" }
]

const performanceComparison = [
  { hour: "12AM", today: 45, yesterday: 38, target: 50 },
  { hour: "4AM", today: 22, yesterday: 25, target: 30 },
  { hour: "8AM", today: 78, yesterday: 72, target: 80 },
  { hour: "12PM", today: 125, yesterday: 110, target: 120 },
  { hour: "4PM", today: 168, yesterday: 145, target: 150 },
  { hour: "8PM", today: 142, yesterday: 138, target: 140 },
  { hour: "11PM", today: 65, yesterday: 70, target: 60 }
]

const alertConditionsData = [
  { condition: "Spike Detected", metric: "Active Viewers", threshold: "+50%", action: "Go Live", triggered: 2 },
  { condition: "Goal Reached", metric: "Earnings", threshold: "$3000", action: "Celebrate", triggered: 1 },
  { condition: "New Arrival", metric: "Requests", threshold: "Any", action: "Review", triggered: 7 },
  { condition: "< 1 Hour", metric: "Response", threshold: "60 min", action: "Respond", triggered: 3 },
  { condition: "Significant", metric: "Trend", threshold: "±20%", action: "Investigate", triggered: 1 }
]

const liveSessionData = [
  { time: "Now", sessions: 156, conversions: 42, revenue: 2847 },
  { time: "-5m", sessions: 148, conversions: 38, revenue: 2650 },
  { time: "-10m", sessions: 142, conversions: 35, revenue: 2450 },
  { time: "-15m", sessions: 135, conversions: 32, revenue: 2280 },
  { time: "-20m", sessions: 128, conversions: 30, revenue: 2100 },
  { time: "-25m", sessions: 122, conversions: 28, revenue: 1950 },
  { time: "-30m", sessions: 118, conversions: 26, revenue: 1820 }
]

const quickActionsData = [
  { action: "Go Live", count: 147, icon: Radio, color: "bg-blue-600", description: "viewers waiting" },
  { action: "Review", count: 7, icon: Eye, color: "bg-orange-600", description: "pending requests" },
  { action: "Respond", count: 3, icon: Timer, color: "bg-red-600", description: "urgent messages" },
  { action: "Celebrate", count: 1, icon: Award, color: "bg-green-600", description: "goal achieved" }
]

const sentimentData = [
  { sentiment: "Positive", value: 72, color: "#10B981" },
  { sentiment: "Neutral", value: 23, color: "#6B7280" },
  { sentiment: "Negative", value: 5, color: "#EF4444" }
]

const COLORS = {
  live: "#EF4444",
  active: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  critical: "#DC2626",
  neutral: "#6B7280",
  purple: "#8B5CF6"
}

export default function Phase328Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [isLive, setIsLive] = React.useState(true)
  const [autoRefresh, setAutoRefresh] = React.useState(true)

  const handleMetricClick = (metricId: string) => {
    console.log("Metric clicked:", metricId)
  }

  const handleActivityAction = (activityId: string) => {
    console.log("Activity action:", activityId)
  }

  const handleQuickAction = (metricId: string, action: string) => {
    console.log("Quick action:", metricId, action)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/creator/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Phase 3.2.8 Demo</h1>
                <p className="text-sm text-gray-600">Real-Time Analytics</p>
              </div>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <Radio className="h-3 w-3 mr-1 animate-pulse" />
                LIVE
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                Live Dashboard
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Live Metrics
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Activity Stream
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Live Demo
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-600" />
                  Real-Time Analytics Framework
                </CardTitle>
                <CardDescription>
                  Live data strategy with instant updates and alert conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Real-Time Metrics Overview */}
                  <div>
                    <h4 className="font-semibold mb-4">Live Metrics Dashboard</h4>
                    <div className="space-y-3">
                      {realTimeMetricsOverview.map((metric, index) => (
                        <motion.div
                          key={metric.metric}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full animate-pulse"
                                style={{ backgroundColor: metric.color }}
                              />
                              <h5 className="font-medium">{metric.metric}</h5>
                            </div>
                            {metric.status === "live" && (
                              <Badge variant="outline" className="text-red-600 border-red-300">
                                <Radio className="h-3 w-3 mr-1 animate-pulse" />
                                LIVE
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-2xl font-bold">
                              {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
                            </span>
                            {metric.change && (
                              <span className={cn(
                                "font-medium",
                                metric.change > 0 ? "text-green-600" : "text-red-600"
                              )}>
                                {metric.change > 0 ? "+" : ""}{metric.change}%
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Update Rates & Display Formats */}
                  <div>
                    <h4 className="font-semibold mb-4">Update Configuration</h4>
                    <div className="space-y-3">
                      {updateRatesData.map((config, index) => (
                        <motion.div
                          key={config.metric}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-white dark:bg-gray-900 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-sm">{config.metric}</h5>
                              <p className="text-xs text-gray-600 mt-1">
                                Update: {config.rate} • Type: {config.type}
                              </p>
                            </div>
                            <Badge 
                              variant={config.priority === "Critical" ? "destructive" : 
                                     config.priority === "High" ? "default" : "secondary"}
                            >
                              {config.priority}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Types & Performance Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Activity Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityTypes.map((activity) => {
                      const Icon = activity.icon
                      return (
                        <div key={activity.type} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", activity.color)}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{activity.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{activity.count}</span>
                            {activity.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                            {activity.trend === "stable" && <Minus className="h-4 w-4 text-gray-600" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieIcon className="h-5 w-5 text-green-600" />
                    Real-Time Sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {sentimentData.map((item) => (
                      <div key={item.sentiment} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.sentiment}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Performance Comparison
                </CardTitle>
                <CardDescription>
                  Hour-by-hour performance tracking with target comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={performanceComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="target"
                        fill={COLORS.neutral}
                        fillOpacity={0.1}
                        stroke={COLORS.neutral}
                        strokeDasharray="5 5"
                        name="Target"
                      />
                      <Line
                        type="monotone"
                        dataKey="yesterday"
                        stroke={COLORS.warning}
                        strokeWidth={2}
                        name="Yesterday"
                      />
                      <Line
                        type="monotone"
                        dataKey="today"
                        stroke={COLORS.active}
                        strokeWidth={3}
                        name="Today"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Alert Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Alert Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alertConditionsData.map((alert, index) => (
                      <motion.div
                        key={alert.condition}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">{alert.condition}</h5>
                          <Badge variant="destructive">
                            {alert.triggered}x triggered
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Metric: </span>
                            <span className="font-medium">{alert.metric}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Threshold: </span>
                            <span className="font-medium">{alert.threshold}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Action: </span>
                            <span className="font-medium text-blue-600">{alert.action}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Live Session Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Live Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={liveSessionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="sessions"
                          stroke={COLORS.active}
                          strokeWidth={3}
                          name="Active Sessions"
                        />
                        <Line
                          type="monotone"
                          dataKey="conversions"
                          stroke={COLORS.success}
                          strokeWidth={2}
                          name="Conversions"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Stream Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  Quick Actions Dashboard
                </CardTitle>
                <CardDescription>
                  Immediate actions based on real-time conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActionsData.map((action) => {
                    const Icon = action.icon
                    return (
                      <motion.div
                        key={action.action}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer"
                      >
                        <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                          <div className={cn("w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center text-white", action.color)}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="text-2xl font-bold">{action.count}</div>
                          <div className="text-sm text-gray-600">{action.description}</div>
                          <Button size="sm" className="mt-2 w-full">
                            {action.action}
                          </Button>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Real-Time Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-cyan-600" />
                  Real-Time Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3">Activity Stream Types</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "New bookings with instant notifications",
                        "Completed videos with delivery status",
                        "Customer messages requiring response",
                        "Review submissions with ratings",
                        "Payment received confirmations"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3">Performance Pulse Metrics</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Current day progress tracking",
                        "Hour-by-hour comparison charts",
                        "Live conversion rate monitoring",
                        "Active session count display",
                        "Real-time sentiment analysis"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Real-Time Analytics system with 
                live data updates, activity streaming, performance pulse monitoring, alert conditions, 
                and quick action triggers. Updates occur automatically every 5 seconds.
              </AlertDescription>
            </Alert>

            <RealTimeAnalytics
              onMetricClick={handleMetricClick}
              onActivityAction={handleActivityAction}
              onQuickAction={handleQuickAction}
              refreshInterval={5000}
              showNotifications={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}