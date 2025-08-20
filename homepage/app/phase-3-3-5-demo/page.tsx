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
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ScatterChart,
  Scatter
} from "recharts"
import {
  ArrowLeft,
  Calendar,
  Clock,
  List,
  Grid,
  Brain,
  Activity,
  TrendingUp,
  BarChart3,
  Info,
  Download,
  Settings,
  Zap,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Shield,
  RefreshCw,
  Sun,
  Moon,
  Coffee,
  Briefcase,
  Home,
  MapPin,
  Globe,
  Wifi,
  Battery,
  Gauge,
  Timer,
  Target,
  Award,
  Trophy,
  Flag,
  Bookmark,
  Hash,
  Tag,
  Folder,
  Archive,
  Database,
  Server,
  Cloud,
  Package,
  Box,
  FileText,
  FileCheck,
  Filter,
  Search,
  Eye,
  Bell,
  Sparkles,
  CalendarDays,
  CalendarClock,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarHeart,
  CalendarRange,
  Link as LinkIcon,
  ExternalLink,
  Heart,
  Layers,
  Layout,
  Monitor,
  Smartphone,
  Headphones,
  Play,
  Pause,
  Square,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { SchedulingAvailabilityTools } from "@/components/creator/content/scheduling-availability-tools"

// Demo data for visualizations
const availabilityViewStats = [
  { view: "Calendar", usage: 45, satisfaction: 92, features: 8 },
  { view: "Timeline", usage: 25, satisfaction: 88, features: 6 },
  { view: "List", usage: 15, satisfaction: 85, features: 5 },
  { view: "Heatmap", usage: 10, satisfaction: 90, features: 4 },
  { view: "Smart", usage: 5, satisfaction: 95, features: 10 }
]

const schedulingRulesImpact = [
  { rule: "Work Hours", applied: 1234, saved: 180, efficiency: 92 },
  { rule: "Capacity Limits", applied: 567, saved: 45, efficiency: 88 },
  { rule: "Break Times", applied: 890, saved: 60, efficiency: 95 },
  { rule: "Holidays", applied: 123, saved: 24, efficiency: 100 },
  { rule: "Peak Pricing", applied: 456, saved: 0, efficiency: 85 }
]

const calendarSyncMetrics = [
  { provider: "Google", users: 456, syncs: 12340, conflicts: 23, success: 98.1 },
  { provider: "Apple", users: 234, syncs: 6780, conflicts: 12, success: 98.2 },
  { provider: "Outlook", users: 123, syncs: 3450, conflicts: 8, success: 97.8 }
]

const timeUtilization = [
  { hour: "9 AM", weekday: 45, weekend: 20 },
  { hour: "10 AM", weekday: 68, weekend: 35 },
  { hour: "11 AM", weekday: 82, weekend: 45 },
  { hour: "12 PM", weekday: 35, weekend: 30 },
  { hour: "1 PM", weekday: 40, weekend: 28 },
  { hour: "2 PM", weekday: 92, weekend: 55 },
  { hour: "3 PM", weekday: 95, weekend: 60 },
  { hour: "4 PM", weekday: 88, weekend: 50 },
  { hour: "5 PM", weekday: 75, weekend: 35 },
  { hour: "6 PM", weekday: 50, weekend: 25 }
]

const automationMetrics = [
  { action: "Auto-accept", count: 234, timeSaved: 39, accuracy: 96 },
  { action: "Auto-decline", count: 89, timeSaved: 15, accuracy: 98 },
  { action: "Buffer enforce", count: 156, timeSaved: 26, accuracy: 100 },
  { action: "Break remind", count: 312, timeSaved: 52, accuracy: 100 },
  { action: "Overtime warn", count: 45, timeSaved: 8, accuracy: 92 }
]

const capacityAnalysis = [
  { day: "Monday", capacity: 10, booked: 8, utilization: 80 },
  { day: "Tuesday", capacity: 10, booked: 9, utilization: 90 },
  { day: "Wednesday", capacity: 10, booked: 7, utilization: 70 },
  { day: "Thursday", capacity: 10, booked: 10, utilization: 100 },
  { day: "Friday", capacity: 10, booked: 8, utilization: 80 },
  { day: "Saturday", capacity: 5, booked: 4, utilization: 80 },
  { day: "Sunday", capacity: 0, booked: 0, utilization: 0 }
]

const revenueOptimization = [
  { strategy: "Peak Pricing", baseline: 1000, optimized: 1300, increase: 30 },
  { strategy: "Smart Scheduling", baseline: 1000, optimized: 1150, increase: 15 },
  { strategy: "Buffer Time", baseline: 1000, optimized: 950, increase: -5 },
  { strategy: "Weekend Premium", baseline: 500, optimized: 650, increase: 30 },
  { strategy: "Early Bird", baseline: 800, optimized: 920, increase: 15 }
]

const workLifeBalance = [
  { metric: "Work Hours/Week", current: 45, target: 40, status: "warning" },
  { metric: "Break Compliance", current: 85, target: 100, status: "good" },
  { metric: "Weekend Work", current: 8, target: 5, status: "warning" },
  { metric: "Overtime Hours", current: 5, target: 0, status: "alert" },
  { metric: "Vacation Days", current: 12, target: 15, status: "good" }
]

const COLORS = {
  primary: "#3B82F6",
  secondary: "#10B981",
  tertiary: "#8B5CF6",
  quaternary: "#F97316",
  quinary: "#EC4899",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4"
}

export default function Phase335Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")

  const handleScheduleUpdate = (schedule: any[]) => {
    console.log("Schedule updated:", schedule)
  }

  const handleRuleCreate = (rule: any) => {
    console.log("Rule created:", rule)
  }

  const handleIntegrationConnect = (integration: any) => {
    console.log("Integration connected:", integration)
  }

  const handleAvailabilityChange = (pattern: any) => {
    console.log("Availability changed:", pattern)
  }

  // Calculate totals
  const totalTimeSaved = automationMetrics.reduce((sum, m) => sum + m.timeSaved, 0)
  const totalAutomations = automationMetrics.reduce((sum, m) => sum + m.count, 0)
  const avgAccuracy = automationMetrics.reduce((sum, m) => sum + m.accuracy, 0) / automationMetrics.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.3.5 Demo</h1>
                <p className="text-sm text-gray-600">Scheduling & Availability Tools</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Calendar className="h-3 w-3 mr-1" />
                Scheduling System
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                5 View Types
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="views" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Views
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
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
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Scheduling & Availability System Overview
                </CardTitle>
                <CardDescription>
                  Comprehensive tools for managing availability and work-life balance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Time Utilization */}
                  <div>
                    <h4 className="font-semibold mb-4">Hourly Utilization Patterns</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timeUtilization}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="weekday" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} name="Weekday %" />
                          <Area type="monotone" dataKey="weekend" stackId="2" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.6} name="Weekend %" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Capacity Analysis */}
                  <div>
                    <h4 className="font-semibold mb-4">Weekly Capacity Utilization</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={capacityAnalysis}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="capacity" fill={COLORS.quaternary} fillOpacity={0.3} name="Capacity" />
                          <Bar dataKey="booked" fill={COLORS.primary} name="Booked" />
                          <Line type="monotone" dataKey="utilization" stroke={COLORS.danger} strokeWidth={3} name="Utilization %" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold">156</p>
                      <p className="text-xs text-green-600 mt-1">+12% this week</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Utilization Rate</p>
                      <p className="text-2xl font-bold">75%</p>
                      <p className="text-xs text-blue-600 mt-1">Optimal range</p>
                    </div>
                    <Gauge className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Time Saved</p>
                      <p className="text-2xl font-bold">{totalTimeSaved}h</p>
                      <p className="text-xs text-purple-600 mt-1">Via automation</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Revenue/Day</p>
                      <p className="text-2xl font-bold">$1,234</p>
                      <p className="text-xs text-green-600 mt-1">+8% optimized</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Views Tab */}
          <TabsContent value="views" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Availability Management Views</CardTitle>
                <CardDescription>
                  Multiple perspectives for managing your schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { view: "Calendar", purpose: "Overview", scale: "Month/Week/Day", interaction: "Click to toggle", info: "Blocked/Available", icon: Calendar },
                    { view: "Timeline", purpose: "Detailed", scale: "Hourly", interaction: "Drag to adjust", info: "Specific hours", icon: Clock },
                    { view: "List", purpose: "Quick edit", scale: "Next 30 days", interaction: "Bulk actions", info: "Text-based", icon: List },
                    { view: "Heatmap", purpose: "Patterns", scale: "Year view", interaction: "Visual analysis", info: "Busy periods", icon: Grid },
                    { view: "Smart", purpose: "AI-assisted", scale: "Optimal times", interaction: "Auto-suggest", info: "Revenue-based", icon: Brain }
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.view} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-white dark:bg-gray-700">
                            <Icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h5 className="font-medium">{item.view}</h5>
                            <p className="text-sm text-gray-600">{item.purpose}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Scale:</span>
                            <span className="ml-2 font-medium">{item.scale}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Interaction:</span>
                            <span className="ml-2 font-medium">{item.interaction}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Info:</span>
                            <span className="ml-2 font-medium">{item.info}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* View Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  View Usage & Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={availabilityViewStats}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="view" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Usage %" dataKey="usage" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} />
                      <Radar name="Satisfaction %" dataKey="satisfaction" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            {/* Scheduling Rules Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Scheduling Rules Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schedulingRulesImpact.map((rule) => (
                    <div key={rule.rule} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h5 className="font-medium">{rule.rule}</h5>
                        <p className="text-sm text-gray-600">
                          Applied {rule.applied} times • Saved {rule.saved} hours
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={rule.efficiency} className="w-24" />
                        <span className="text-sm font-medium">{rule.efficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Automation Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Automation Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={automationMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="action" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.primary} name="Count" />
                      <Bar dataKey="timeSaved" fill={COLORS.secondary} name="Hours Saved" />
                      <Bar dataKey="accuracy" fill={COLORS.tertiary} name="Accuracy %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Sync */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  Calendar Integration Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {calendarSyncMetrics.map((cal) => (
                    <div key={cal.provider} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h5 className="font-medium mb-2">{cal.provider}</h5>
                      <div className="text-3xl font-bold mb-1">{cal.users}</div>
                      <div className="text-sm text-gray-600 mb-3">users</div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Syncs:</span>
                          <span className="font-medium">{cal.syncs.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conflicts:</span>
                          <span className="font-medium text-orange-600">{cal.conflicts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Success:</span>
                          <span className="font-medium text-green-600">{cal.success}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Revenue Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Revenue Optimization Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={revenueOptimization}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="strategy" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="baseline" fill={COLORS.quaternary} fillOpacity={0.5} name="Baseline $" />
                      <Bar dataKey="optimized" fill={COLORS.success} name="Optimized $" />
                      <Line type="monotone" dataKey="increase" stroke={COLORS.danger} strokeWidth={3} name="Increase %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Work-Life Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Work-Life Balance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workLifeBalance.map((metric) => (
                    <div key={metric.metric}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{metric.current}/{metric.target}</span>
                          <Badge 
                            variant={
                              metric.status === "good" ? "default" :
                              metric.status === "warning" ? "secondary" :
                              "destructive"
                            }
                            className="text-xs"
                          >
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                      <Progress 
                        value={(metric.current / metric.target) * 100} 
                        className={cn(
                          "h-2",
                          metric.status === "alert" && "[&>div]:bg-red-500",
                          metric.status === "warning" && "[&>div]:bg-yellow-500"
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Peak Performance Times */}
            <Card>
              <CardHeader>
                <CardTitle>Scheduling Rules Structure</CardTitle>
                <CardDescription>
                  Hierarchical organization of availability rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Regular Schedule */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Regular Schedule
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Work hours: 9am-6pm
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Days off: Sunday
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Lunch break: 12-1pm
                      </li>
                    </ul>
                  </div>

                  {/* Capacity Limits */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Capacity Limits
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Max daily: 10 videos
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Max weekly: 50 videos
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Buffer time: 30 min
                      </li>
                    </ul>
                  </div>

                  {/* Special Rules */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Special Rules
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Holidays: Blocked
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Vacation: Auto-decline
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Emergency: Override
                      </li>
                    </ul>
                  </div>

                  {/* Smart Scheduling */}
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Smart Scheduling
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Peak times: Premium pricing
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Slow times: Promotions
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Optimization: AI suggestions
                      </li>
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
                <strong>Interactive Demo:</strong> Experience the complete Scheduling & Availability Tools with 
                5 view types (Calendar, Timeline, List, Heatmap, Smart), scheduling rules engine, 
                calendar integrations, and automated actions for work-life balance.
              </AlertDescription>
            </Alert>

            <SchedulingAvailabilityTools
              onScheduleUpdate={handleScheduleUpdate}
              onRuleCreate={handleRuleCreate}
              onIntegrationConnect={handleIntegrationConnect}
              onAvailabilityChange={handleAvailabilityChange}
              enableSmartScheduling={true}
              enableCalendarSync={true}
              enableAutomation={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}