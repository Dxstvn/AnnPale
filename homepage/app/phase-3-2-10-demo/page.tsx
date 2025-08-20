"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
  Radar
} from "recharts"
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Calendar,
  Filter,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Bell,
  Award,
  Target,
  Zap,
  RefreshCw,
  Maximize2,
  Minimize2,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Hash,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Gift,
  Trophy,
  Sparkles,
  Flame,
  Timer,
  Settings,
  Download,
  Send,
  Plus,
  Minus,
  X,
  Menu,
  Grid,
  List,
  Layers,
  Gauge,
  Receipt,
  CreditCard,
  ShoppingBag,
  Video,
  PlayCircle,
  Radio,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Hand,
  TouchpadIcon,
  Fingerprint,
  MousePointer
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { MobileAnalyticsExperience } from "@/components/creator/analytics/mobile-analytics-experience"

// Demo data for visualizations
const mobileOptimizationComparison = [
  { element: "Charts", desktop: "Interactive", mobile: "Simplified", adaptation: "Swipe navigation", icon: BarChart3 },
  { element: "Tables", desktop: "Full data", mobile: "Key columns", adaptation: "Horizontal scroll", icon: Grid },
  { element: "Filters", desktop: "Sidebar", mobile: "Bottom sheet", adaptation: "Touch-optimized", icon: Filter },
  { element: "Date ranges", desktop: "Calendar", mobile: "Preset options", adaptation: "Quick selection", icon: Calendar },
  { element: "Dashboards", desktop: "Multi-widget", mobile: "Stacked cards", adaptation: "Vertical scroll", icon: Layers }
]

const touchGestures = [
  { gesture: "Swipe Left/Right", action: "Navigate between periods", icon: ArrowRight, color: "text-blue-600" },
  { gesture: "Pinch to Zoom", action: "Zoom in/out on charts", icon: Maximize2, color: "text-green-600" },
  { gesture: "Long Press", action: "Show detailed tooltip", icon: Fingerprint, color: "text-purple-600" },
  { gesture: "Pull to Refresh", action: "Update data", icon: RefreshCw, color: "text-orange-600" },
  { gesture: "Double Tap", action: "Quick actions", icon: TouchpadIcon, color: "text-pink-600" }
]

const glanceableInsights = [
  { type: "Widget Support", description: "Home screen widgets", status: "Available", icon: Grid },
  { type: "Push Notifications", description: "Real-time alerts", status: "Enabled", icon: Bell },
  { type: "Daily Summary", description: "Morning briefing", status: "Active", icon: Sparkles },
  { type: "Goal Alerts", description: "Achievement notifications", status: "On", icon: Target },
  { type: "Milestone Celebrations", description: "Success animations", status: "Active", icon: Trophy }
]

const deviceUsageData = [
  { device: "Mobile", percentage: 68, sessions: 4520, color: "#3B82F6" },
  { device: "Tablet", percentage: 22, sessions: 1460, color: "#10B981" },
  { device: "Desktop", percentage: 10, sessions: 665, color: "#8B5CF6" }
]

const mobileEngagementData = [
  { hour: "6AM", mobile: 45, desktop: 12 },
  { hour: "9AM", mobile: 125, desktop: 78 },
  { hour: "12PM", mobile: 168, desktop: 95 },
  { hour: "3PM", mobile: 142, desktop: 88 },
  { hour: "6PM", mobile: 178, desktop: 72 },
  { hour: "9PM", mobile: 156, desktop: 45 },
  { hour: "12AM", mobile: 65, desktop: 22 }
]

const gestureUsageData = [
  { gesture: "Swipe", usage: 42, satisfaction: 92 },
  { gesture: "Tap", usage: 35, satisfaction: 95 },
  { gesture: "Pinch", usage: 12, satisfaction: 88 },
  { gesture: "Long Press", usage: 8, satisfaction: 85 },
  { gesture: "Pull", usage: 3, satisfaction: 90 }
]

const mobilePerformanceMetrics = [
  { metric: "Load Time", mobile: 1.2, desktop: 2.8, unit: "s", improvement: 57 },
  { metric: "Interaction", mobile: 50, desktop: 120, unit: "ms", improvement: 58 },
  { metric: "Frame Rate", mobile: 60, desktop: 60, unit: "fps", improvement: 0 },
  { metric: "Battery Usage", mobile: 2, desktop: 0, unit: "%/hr", improvement: -100 }
]

const viewportDistribution = [
  { size: "320-375", percentage: 15, label: "Small" },
  { size: "376-414", percentage: 45, label: "Medium" },
  { size: "415-768", percentage: 30, label: "Large" },
  { size: "769+", percentage: 10, label: "XL" }
]

const COLORS = {
  primary: "#3B82F6",
  secondary: "#10B981",
  tertiary: "#8B5CF6",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4"
}

export default function Phase3210Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [selectedDevice, setSelectedDevice] = React.useState<"mobile" | "tablet" | "desktop">("mobile")
  const [demoMode, setDemoMode] = React.useState<"mobile" | "desktop">("mobile")

  const handleMetricTap = (metricId: string) => {
    console.log("Metric tapped:", metricId)
  }

  const handleSwipeAction = (direction: string, currentView: string) => {
    console.log("Swiped:", direction, "from view:", currentView)
  }

  const handlePullToRefresh = async () => {
    console.log("Refreshing data...")
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log("Data refreshed!")
  }

  const handleFilterChange = (filters: any) => {
    console.log("Filters changed:", filters)
  }

  const handleNotificationTap = (notificationId: string) => {
    console.log("Notification tapped:", notificationId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.2.10 Demo</h1>
                <p className="text-sm text-gray-600">Mobile Analytics Experience</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Smartphone className="h-3 w-3 mr-1" />
                Mobile-First
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                Touch Optimized
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
              <Smartphone className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Optimization
            </TabsTrigger>
            <TabsTrigger value="gestures" className="flex items-center gap-2">
              <Hand className="h-4 w-4" />
              Gestures
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
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  Mobile Analytics Strategy
                </CardTitle>
                <CardDescription>
                  Optimized visualizations and touch-friendly interactions for mobile devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Mobile Optimization Elements */}
                  <div>
                    <h4 className="font-semibold mb-4">Optimization Elements</h4>
                    <div className="space-y-3">
                      {mobileOptimizationComparison.map((element, index) => {
                        const Icon = element.icon
                        return (
                          <motion.div
                            key={element.element}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className="h-4 w-4 text-blue-600" />
                              <h5 className="font-medium text-sm">{element.element}</h5>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Desktop: </span>
                                <span className="font-medium">{element.desktop}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Mobile: </span>
                                <span className="font-medium">{element.mobile}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Adapt: </span>
                                <span className="font-medium text-blue-600">{element.adaptation}</span>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Device Usage Distribution */}
                  <div>
                    <h4 className="font-semibold mb-4">Device Usage Distribution</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceUsageData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="percentage"
                          >
                            {deviceUsageData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                      {deviceUsageData.map((device) => (
                        <div key={device.device} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: device.color }}
                          />
                          <span className="text-sm">
                            {device.device}: {device.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Glanceable Insights & Mobile Engagement */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-600" />
                    Glanceable Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {glanceableInsights.map((insight) => {
                      const Icon = insight.icon
                      return (
                        <div key={insight.type} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-gray-600" />
                            <div>
                              <h5 className="font-medium text-sm">{insight.type}</h5>
                              <p className="text-xs text-gray-500">{insight.description}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={insight.status === "Available" || insight.status === "Active" || insight.status === "Enabled" || insight.status === "On" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {insight.status}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Mobile vs Desktop Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mobileEngagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="mobile"
                          stackId="1"
                          stroke={COLORS.primary}
                          fill={COLORS.primary}
                          fillOpacity={0.6}
                          name="Mobile"
                        />
                        <Area
                          type="monotone"
                          dataKey="desktop"
                          stackId="1"
                          stroke={COLORS.tertiary}
                          fill={COLORS.tertiary}
                          fillOpacity={0.6}
                          name="Desktop"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-orange-600" />
                  Mobile Performance Metrics
                </CardTitle>
                <CardDescription>
                  Comparison of mobile vs desktop performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mobilePerformanceMetrics.map((metric) => (
                    <div key={metric.metric} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">{metric.metric}</h5>
                        <Badge 
                          variant={metric.improvement > 0 ? "default" : metric.improvement < 0 ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {metric.improvement > 0 ? `${metric.improvement}% better` : 
                           metric.improvement < 0 ? `${Math.abs(metric.improvement)}% higher` : 
                           "Same"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Mobile</span>
                            <span className="font-medium">{metric.mobile}{metric.unit}</span>
                          </div>
                          <Progress value={metric.mobile / (metric.mobile + metric.desktop) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Desktop</span>
                            <span className="font-medium">{metric.desktop}{metric.unit}</span>
                          </div>
                          <Progress value={metric.desktop / (metric.mobile + metric.desktop) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Viewport Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-cyan-600" />
                  Viewport Size Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={viewportDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `${value}%`} />
                      <Bar dataKey="percentage" fill={COLORS.info}>
                        {viewportDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.info} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {viewportDistribution.map((viewport) => (
                    <div key={viewport.size} className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="text-xs text-gray-600">{viewport.size}px</div>
                      <div className="font-medium">{viewport.label}</div>
                      <div className="text-sm text-gray-600">{viewport.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestures Tab */}
          <TabsContent value="gestures" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hand className="h-5 w-5 text-pink-600" />
                  Touch Gesture Support
                </CardTitle>
                <CardDescription>
                  Supported gestures and their actions in the mobile interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Gesture List */}
                  <div>
                    <h4 className="font-semibold mb-4">Available Gestures</h4>
                    <div className="space-y-3">
                      {touchGestures.map((gesture) => {
                        const Icon = gesture.icon
                        return (
                          <motion.div
                            key={gesture.gesture}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg bg-white dark:bg-gray-900", gesture.color)}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">{gesture.gesture}</h5>
                                  <p className="text-xs text-gray-600">{gesture.action}</p>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Gesture Usage Stats */}
                  <div>
                    <h4 className="font-semibold mb-4">Gesture Usage & Satisfaction</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={gestureUsageData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="gesture" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar
                            name="Usage %"
                            dataKey="usage"
                            stroke={COLORS.primary}
                            fill={COLORS.primary}
                            fillOpacity={0.3}
                          />
                          <Radar
                            name="Satisfaction %"
                            dataKey="satisfaction"
                            stroke={COLORS.secondary}
                            fill={COLORS.secondary}
                            fillOpacity={0.1}
                          />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Mobile-First Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3">Touch Interactions</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Pinch to zoom on charts",
                        "Swipe between time periods",
                        "Long press for detailed tooltips",
                        "Pull to refresh data",
                        "Double tap for quick actions"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <TouchpadIcon className="h-4 w-4 text-blue-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3">Mobile Optimizations</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Simplified chart visualizations",
                        "Bottom sheet filters",
                        "Preset date range options",
                        "Stacked card dashboards",
                        "Touch-friendly hit targets"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-green-600" />
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
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Mobile Analytics Experience with 
                touch-optimized interfaces, swipe navigation, pull-to-refresh, glanceable insights, 
                and responsive visualizations. Best viewed on mobile devices or with device emulation.
              </AlertDescription>
            </Alert>

            {/* Demo Mode Selector */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Label>View Mode:</Label>
                  <RadioGroup value={demoMode} onValueChange={(value: any) => setDemoMode(value)} className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="mobile" />
                      <Label className="flex items-center gap-1">
                        <Smartphone className="h-4 w-4" />
                        Mobile
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="desktop" />
                      <Label className="flex items-center gap-1">
                        <Monitor className="h-4 w-4" />
                        Desktop
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Demo Container */}
            <div className={cn(
              "mx-auto transition-all",
              demoMode === "mobile" ? "max-w-md" : "max-w-full"
            )}>
              <Card className={cn(
                "overflow-hidden",
                demoMode === "mobile" && "border-4 border-gray-800 rounded-3xl shadow-2xl"
              )}>
                {demoMode === "mobile" && (
                  <div className="bg-gray-800 text-white text-center py-2 text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <Wifi className="h-3 w-3" />
                      <span>Carrier</span>
                      <Battery className="h-3 w-3" />
                      <span>9:41 AM</span>
                    </div>
                  </div>
                )}
                
                <CardContent className="p-0">
                  <MobileAnalyticsExperience
                    onMetricTap={handleMetricTap}
                    onSwipeAction={handleSwipeAction}
                    onPullToRefresh={handlePullToRefresh}
                    onFilterChange={handleFilterChange}
                    onNotificationTap={handleNotificationTap}
                  />
                </CardContent>
                
                {demoMode === "mobile" && (
                  <div className="bg-gray-800 h-8 rounded-b-2xl" />
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}