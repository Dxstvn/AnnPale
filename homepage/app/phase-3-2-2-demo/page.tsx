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
  Cell
} from "recharts"
import {
  ArrowLeft,
  Layers,
  Eye,
  BarChart3,
  Settings,
  Gauge,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Users,
  Star,
  Clock,
  Target,
  Brain,
  Lightbulb,
  Info,
  ChevronRight,
  Home,
  Download,
  Share2,
  RefreshCw,
  Filter,
  Calendar,
  Zap,
  Award,
  MessageSquare,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AnalyticsDashboardArchitecture } from "@/components/creator/analytics/analytics-dashboard-architecture"

// Demo data for visualizations
const dashboardLevelData = [
  { level: "Snapshot", metrics: 6, frequency: "Real-time", interaction: "View only", users: 45 },
  { level: "Overview", metrics: 12, frequency: "Hourly", interaction: "Hover details", users: 32 },
  { level: "Detailed", metrics: 24, frequency: "On-demand", interaction: "Full interactive", users: 18 },
  { level: "Custom", metrics: 16, frequency: "Varies", interaction: "Configurable", users: 12 }
]

const informationHierarchyData = [
  { name: "Essential KPIs", snapshot: 100, overview: 100, detailed: 100, custom: 80 },
  { name: "Trend Context", snapshot: 0, overview: 100, detailed: 100, custom: 90 },
  { name: "Comparisons", snapshot: 20, overview: 80, detailed: 100, custom: 70 },
  { name: "Drill-down", snapshot: 0, overview: 40, detailed: 100, custom: 85 },
  { name: "Customization", snapshot: 0, overview: 0, detailed: 20, custom: 100 }
]

const cognitiveLoadData = [
  { level: "Snapshot", load: 15, effectiveness: 95 },
  { level: "Overview", load: 35, effectiveness: 88 },
  { level: "Detailed", load: 75, effectiveness: 82 },
  { level: "Custom", load: 45, effectiveness: 92 }
]

const usagePatternData = [
  { time: "6am", snapshot: 80, overview: 45, detailed: 20, custom: 25 },
  { time: "9am", snapshot: 65, overview: 85, detailed: 40, custom: 35 },
  { time: "12pm", snapshot: 90, overview: 70, detailed: 35, custom: 30 },
  { time: "3pm", snapshot: 40, overview: 95, detailed: 75, custom: 55 },
  { time: "6pm", snapshot: 35, overview: 60, detailed: 90, custom: 70 },
  { time: "9pm", snapshot: 25, overview: 40, detailed: 85, custom: 80 }
]

const colorPsychologyImpact = [
  { name: "Positive (Green)", recognition: 95, actionRate: 78, satisfaction: 92 },
  { name: "Negative (Red)", recognition: 98, actionRate: 85, satisfaction: 68 },
  { name: "Warning (Yellow)", recognition: 88, actionRate: 82, satisfaction: 75 },
  { name: "Neutral (Blue)", recognition: 82, actionRate: 65, satisfaction: 80 },
  { name: "Brand (Purple)", recognition: 85, actionRate: 70, satisfaction: 88 }
]

const COLORS = {
  primary: "#9333EA",
  secondary: "#EC4899", 
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6"
}

export default function Phase322Demo() {
  const [activeTab, setActiveTab] = React.useState("architecture")
  const [selectedLevel, setSelectedLevel] = React.useState("overview")

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level)
  }

  const handleKPIClick = (kpiId: string) => {
    console.log("KPI clicked:", kpiId)
  }

  const handleDrillDown = (path: string[]) => {
    console.log("Drill down path:", path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.2.2 Demo</h1>
                <p className="text-sm text-gray-600">Analytics Dashboard Architecture</p>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Information Hierarchy
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Architecture Demo
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
            <TabsTrigger value="architecture" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="psychology" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Psychology
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Live Demo
            </TabsTrigger>
          </TabsList>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  Information Hierarchy Strategy
                </CardTitle>
                <CardDescription>
                  Progressive disclosure approach to analytics complexity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Dashboard Levels Overview */}
                  <div>
                    <h4 className="font-semibold mb-4">Dashboard Levels</h4>
                    <div className="space-y-3">
                      {dashboardLevelData.map((level, index) => (
                        <motion.div
                          key={level.level}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{level.level}</h5>
                            <Badge variant="outline">{level.metrics} metrics</Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Frequency:</span>
                              <span>{level.frequency}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Interaction:</span>
                              <span>{level.interaction}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Users:</span>
                              <span>{level.users}%</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Information Hierarchy Visualization */}
                  <div>
                    <h4 className="font-semibold mb-4">Information Complexity</h4>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={informationHierarchyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="snapshot"
                            stackId="1"
                            stroke={COLORS.info}
                            fill={COLORS.info}
                            fillOpacity={0.3}
                            name="Snapshot"
                          />
                          <Area
                            type="monotone"
                            dataKey="overview"
                            stackId="1"
                            stroke={COLORS.success}
                            fill={COLORS.success}
                            fillOpacity={0.3}
                            name="Overview"
                          />
                          <Area
                            type="monotone"
                            dataKey="detailed"
                            stackId="1"
                            stroke={COLORS.warning}
                            fill={COLORS.warning}
                            fillOpacity={0.3}
                            name="Detailed"
                          />
                          <Area
                            type="monotone"
                            dataKey="custom"
                            stackId="1"
                            stroke={COLORS.primary}
                            fill={COLORS.primary}
                            fillOpacity={0.3}
                            name="Custom"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Card Design Strategy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-green-600" />
                  KPI Card Design Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Card Anatomy Visualization */}
                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-4">Card Anatomy</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                      <div className="border border-gray-300 rounded p-4 bg-white dark:bg-gray-900">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600">Metric Name</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold">$1,234</span>
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span className="text-sm">23%</span>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="h-6 flex items-end gap-1">
                            {[1, 2, 4, 6, 8, 6, 4, 2, 1].map((h, i) => (
                              <div
                                key={i}
                                className="bg-blue-500 rounded-sm"
                                style={{ height: `${h * 3}px`, width: '4px' }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          vs last period: +$234
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Features */}
                  <div>
                    <h4 className="font-semibold mb-4">Key Features</h4>
                    <div className="space-y-3">
                      {[
                        { icon: Info, label: "Contextual tooltips", color: "text-blue-600" },
                        { icon: TrendingUp, label: "Trend indicators", color: "text-green-600" },
                        { icon: Activity, label: "Sparkline charts", color: "text-purple-600" },
                        { icon: Target, label: "Comparison context", color: "text-orange-600" },
                        { icon: Eye, label: "Progressive disclosure", color: "text-gray-600" }
                      ].map(({ icon: Icon, label, color }) => (
                        <div key={label} className="flex items-center gap-3">
                          <Icon className={cn("h-4 w-4", color)} />
                          <span className="text-sm">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Cognitive Load Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Cognitive Load Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cognitiveLoadData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="level" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="load"
                          stroke={COLORS.danger}
                          fill={COLORS.danger}
                          fillOpacity={0.3}
                          name="Cognitive Load"
                        />
                        <Area
                          type="monotone"
                          dataKey="effectiveness"
                          stroke={COLORS.success}
                          fill={COLORS.success}
                          fillOpacity={0.3}
                          name="Effectiveness"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Usage Patterns by Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={usagePatternData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="snapshot"
                          stroke={COLORS.info}
                          strokeWidth={2}
                          name="Snapshot"
                        />
                        <Line
                          type="monotone"
                          dataKey="overview"
                          stroke={COLORS.success}
                          strokeWidth={2}
                          name="Overview"
                        />
                        <Line
                          type="monotone"
                          dataKey="detailed"
                          stroke={COLORS.warning}
                          strokeWidth={2}
                          name="Detailed"
                        />
                        <Line
                          type="monotone"
                          dataKey="custom"
                          stroke={COLORS.primary}
                          strokeWidth={2}
                          name="Custom"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard Level Effectiveness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Dashboard Level Effectiveness
                </CardTitle>
                <CardDescription>
                  Comparing user engagement and task completion across different dashboard levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {dashboardLevelData.map((level, index) => (
                    <motion.div
                      key={level.level}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {level.users}%
                      </div>
                      <div className="text-sm font-medium mb-2">{level.level}</div>
                      <Progress value={level.users} className="h-2" />
                      <div className="text-xs text-gray-600 mt-2">
                        {level.metrics} metrics • {level.frequency}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Psychology Tab */}
          <TabsContent value="psychology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-600" />
                  Color Psychology Impact
                </CardTitle>
                <CardDescription>
                  How different colors affect user recognition, action rates, and satisfaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={colorPsychologyImpact}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="recognition" fill={COLORS.info} name="Recognition %" />
                      <Bar dataKey="actionRate" fill={COLORS.success} name="Action Rate %" />
                      <Bar dataKey="satisfaction" fill={COLORS.primary} name="Satisfaction %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Visual Hierarchy Principles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-purple-600" />
                    Visual Hierarchy Principles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Progressive Disclosure</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Start with overview</li>
                        <li>• Click to drill down</li>
                        <li>• Breadcrumb navigation</li>
                        <li>• Return to summary</li>
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Information Density</h4>
                      <div className="space-y-2">
                        {[
                          { level: "Low", description: "4-6 KPIs (Snapshot)", intensity: 25 },
                          { level: "Medium", description: "8-12 metrics (Overview)", intensity: 50 },
                          { level: "High", description: "All metrics (Detailed)", intensity: 100 },
                          { level: "Custom", description: "User-selected", intensity: 75 }
                        ].map(({ level, description, intensity }) => (
                          <div key={level} className="flex items-center justify-between">
                            <span className="text-sm">{description}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={intensity} className="w-16 h-2" />
                              <span className="text-xs font-medium">{intensity}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Color Psychology Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-600" />
                    Color Psychology Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { color: COLORS.success, label: "Green: Positive/Growth", emotion: "Confidence, Success" },
                      { color: COLORS.danger, label: "Red: Negative/Decline", emotion: "Urgency, Attention" },
                      { color: COLORS.warning, label: "Yellow: Warning/Attention", emotion: "Caution, Awareness" },
                      { color: COLORS.info, label: "Blue: Neutral/Info", emotion: "Trust, Stability" },
                      { color: COLORS.primary, label: "Purple: Brand/Special", emotion: "Premium, Unique" }
                    ].map(({ color, label, emotion }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{label}</div>
                          <div className="text-xs text-gray-600">{emotion}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the Analytics Dashboard Architecture with progressive disclosure, 
                KPI cards with sparklines, and visual hierarchy principles. Switch between dashboard levels to see how 
                information density and interaction patterns change.
              </AlertDescription>
            </Alert>

            <AnalyticsDashboardArchitecture
              initialLevel="overview"
              onLevelChange={handleLevelChange}
              onKPIClick={handleKPIClick}
              onDrillDown={handleDrillDown}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}