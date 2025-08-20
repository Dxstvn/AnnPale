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
  Scatter,
  Treemap
} from "recharts"
import {
  ArrowLeft,
  Package,
  Zap,
  Clock,
  CheckSquare,
  Folder,
  Tags,
  Trash2,
  Download,
  Upload,
  Edit,
  FileText,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Save,
  Archive,
  Database,
  Brain,
  Eye,
  Send,
  Activity,
  BarChart3,
  Target,
  Award,
  Trophy,
  Shield,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Users,
  Heart,
  ThumbsUp,
  Timer,
  Gauge,
  Filter,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Layout,
  Sparkles,
  Lightbulb,
  MessageSquare,
  Cpu,
  Server,
  Cloud,
  Bell,
  Flag,
  Hash,
  Tag,
  Layers,
  Grid,
  List,
  Map,
  ArrowUp,
  ArrowDown,
  History,
  FolderOpen
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { BulkOperationsAutomation } from "@/components/creator/automation/bulk-operations-automation"

// Demo data for visualizations
const operationEfficiency = [
  { operation: "Categorize", manual: 45, automated: 5, timeSaved: 90 },
  { operation: "Tag", manual: 30, automated: 4.5, timeSaved: 85 },
  { operation: "Delete", manual: 20, automated: 1, timeSaved: 95 },
  { operation: "Export", manual: 25, automated: 5, timeSaved: 80 },
  { operation: "Update", manual: 40, automated: 10, timeSaved: 75 },
  { operation: "Template", manual: 35, automated: 10.5, timeSaved: 70 }
]

const automationTrends = [
  { week: "W1", manual: 234, automated: 56 },
  { week: "W2", manual: 198, automated: 89 },
  { week: "W3", manual: 156, automated: 123 },
  { week: "W4", manual: 112, automated: 178 },
  { week: "W5", manual: 78, automated: 234 },
  { week: "W6", manual: 45, automated: 289 }
]

const workflowPerformance = [
  { workflow: "Auto-Organization", runs: 145, success: 98, failures: 2, avgTime: 3.2 },
  { workflow: "Auto-Processing", runs: 234, success: 95, failures: 5, avgTime: 5.8 },
  { workflow: "Auto-Delivery", runs: 89, success: 99, failures: 1, avgTime: 1.5 },
  { workflow: "Auto-Maintenance", runs: 67, success: 100, failures: 0, avgTime: 8.4 }
]

const undoUtilization = [
  { day: "Mon", operations: 45, undos: 3, rate: 6.7 },
  { day: "Tue", operations: 52, undos: 2, rate: 3.8 },
  { day: "Wed", operations: 38, undos: 4, rate: 10.5 },
  { day: "Thu", operations: 41, undos: 1, rate: 2.4 },
  { day: "Fri", operations: 49, undos: 3, rate: 6.1 },
  { day: "Sat", operations: 23, undos: 1, rate: 4.3 },
  { day: "Sun", operations: 18, undos: 0, rate: 0 }
]

const batchSizeOptimization = [
  { size: "1-5", processingTime: 2, efficiency: 60 },
  { size: "6-10", processingTime: 3.5, efficiency: 75 },
  { size: "11-20", processingTime: 6, efficiency: 85 },
  { size: "21-30", processingTime: 8.5, efficiency: 92 },
  { size: "31-50", processingTime: 14, efficiency: 88 },
  { size: "51-100", processingTime: 28, efficiency: 82 },
  { size: "100+", processingTime: 65, efficiency: 75 }
]

const automationROI = [
  { metric: "Time Saved", value: 234, unit: "hours/month", impact: 85 },
  { metric: "Error Reduction", value: 92, unit: "% decrease", impact: 78 },
  { metric: "Throughput", value: 13, unit: "x increase", impact: 95 },
  { metric: "Cost Savings", value: 4500, unit: "$/month", impact: 88 },
  { metric: "Quality", value: 98, unit: "% consistency", impact: 82 }
]

const riskMatrix = [
  { operation: "Categorize", probability: 10, impact: 20, risk: "Low" },
  { operation: "Tag", probability: 15, impact: 15, risk: "Low" },
  { operation: "Update", probability: 30, impact: 40, risk: "Medium" },
  { operation: "Template", probability: 25, impact: 35, risk: "Medium" },
  { operation: "Export", probability: 5, impact: 10, risk: "Low" },
  { operation: "Delete", probability: 20, impact: 80, risk: "High" }
]

const recoveryStats = [
  { type: "Immediate Undo", recoveries: 145, avgTime: 0.5, success: 100 },
  { type: "Recent History", recoveries: 67, avgTime: 2, success: 98 },
  { type: "30-day Recovery", recoveries: 23, avgTime: 15, success: 95 },
  { type: "Archive Restore", recoveries: 8, avgTime: 45, success: 87 }
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

export default function Phase338Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")

  const handleBulkOperation = (operation: any, items: string[]) => {
    console.log("Bulk operation:", operation, "Items:", items)
  }

  const handleAutomationToggle = (workflow: any) => {
    console.log("Automation toggled:", workflow)
  }

  const handleUndo = (historyId: string) => {
    console.log("Undo operation:", historyId)
  }

  // Calculate totals
  const totalTimeSaved = operationEfficiency.reduce((sum, op) => sum + (op.manual - op.automated), 0)
  const totalAutomatedOps = automationTrends[automationTrends.length - 1].automated
  const avgSuccessRate = workflowPerformance.reduce((sum, wf) => sum + wf.success, 0) / workflowPerformance.length
  const totalRecoveries = recoveryStats.reduce((sum, rs) => sum + rs.recoveries, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.3.8 Demo</h1>
                <p className="text-sm text-gray-600">Bulk Operations & Automation</p>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Package className="h-3 w-3 mr-1" />
                Bulk System
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                6 Operations
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
            <TabsTrigger value="operations" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Operations
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
                  <Package className="h-5 w-5 text-purple-600" />
                  Bulk Operations & Automation Overview
                </CardTitle>
                <CardDescription>
                  Efficient management through powerful bulk operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Automation Adoption */}
                  <div>
                    <h4 className="font-semibold mb-4">Manual vs Automated Operations</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={automationTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="manual" stackId="1" stroke={COLORS.quaternary} fill={COLORS.quaternary} fillOpacity={0.5} name="Manual" />
                          <Area type="monotone" dataKey="automated" stackId="1" stroke={COLORS.tertiary} fill={COLORS.tertiary} fillOpacity={0.5} name="Automated" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Efficiency Comparison */}
                  <div>
                    <h4 className="font-semibold mb-4">Operation Efficiency</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={operationEfficiency}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="operation" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar name="Time Saved %" dataKey="timeSaved" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.6} />
                          <Tooltip />
                        </RadarChart>
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
                      <p className="text-sm text-gray-600">Time Saved</p>
                      <p className="text-2xl font-bold">{totalTimeSaved}min</p>
                      <p className="text-xs text-green-600 mt-1">Per batch</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Automated Ops</p>
                      <p className="text-2xl font-bold">{totalAutomatedOps}</p>
                      <p className="text-xs text-purple-600 mt-1">This week</p>
                    </div>
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold">{avgSuccessRate.toFixed(0)}%</p>
                      <p className="text-xs text-blue-600 mt-1">Workflows</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Recoveries</p>
                      <p className="text-2xl font-bold">{totalRecoveries}</p>
                      <p className="text-xs text-orange-600 mt-1">Successful</p>
                    </div>
                    <RotateCcw className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Operation Types</CardTitle>
                <CardDescription>
                  6 powerful operations for efficient content management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { type: "Categorize", icon: Folder, time: "90%", risk: "Low", undo: "Yes", color: "bg-blue-500" },
                    { type: "Tag", icon: Tags, time: "85%", risk: "Low", undo: "Yes", color: "bg-green-500" },
                    { type: "Delete", icon: Trash2, time: "95%", risk: "High", undo: "30-day", color: "bg-red-500" },
                    { type: "Export", icon: Download, time: "80%", risk: "Low", undo: "No", color: "bg-purple-500" },
                    { type: "Update", icon: Edit, time: "75%", risk: "Medium", undo: "Yes", color: "bg-orange-500" },
                    { type: "Template", icon: FileText, time: "70%", risk: "Medium", undo: "Preview", color: "bg-pink-500" }
                  ].map((op) => {
                    const Icon = op.icon
                    return (
                      <Card key={op.type}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <div className={cn("p-1 rounded", op.color)}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            {op.type}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Time Saved:</span>
                            <Badge variant="outline">{op.time}</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Risk Level:</span>
                            <Badge 
                              variant={op.risk === "High" ? "destructive" : op.risk === "Medium" ? "secondary" : "default"}
                              className="text-xs"
                            >
                              {op.risk}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Undo Support:</span>
                            <span className="font-medium">{op.undo}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Risk Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Operation Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="probability" name="Probability" unit="%" />
                      <YAxis dataKey="impact" name="Impact" unit="%" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Operations" data={riskMatrix} fill={COLORS.tertiary}>
                        {riskMatrix.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.risk === "High" ? COLORS.danger :
                            entry.risk === "Medium" ? COLORS.warning :
                            COLORS.success
                          } />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recovery Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  Recovery & Undo Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recoveryStats.map((stat) => (
                    <div key={stat.type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h5 className="font-medium text-sm">{stat.type}</h5>
                        <p className="text-xs text-gray-500">{stat.recoveries} recoveries</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{stat.avgTime}min</p>
                          <p className="text-xs text-gray-500">avg time</p>
                        </div>
                        <Badge variant={stat.success > 95 ? "default" : "secondary"}>
                          {stat.success}% success
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            {/* Workflow Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-purple-600" />
                  Automation Workflow Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workflowPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="workflow" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="runs" fill={COLORS.primary} name="Total Runs" />
                      <Bar dataKey="success" fill={COLORS.success} name="Success %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Automation Workflows */}
            <Card>
              <CardHeader>
                <CardTitle>Automation Workflow Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Auto-Organization */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      Auto-Organization
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Sort by date
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Categorize by type
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Tag by occasion
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Archive old content
                      </li>
                    </ul>
                  </div>

                  {/* Auto-Processing */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      Auto-Processing
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Apply filters
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Add watermark
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Generate thumbnail
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Create preview
                      </li>
                    </ul>
                  </div>

                  {/* Auto-Delivery */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Auto-Delivery
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Send when ready
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Schedule delivery
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Follow-up message
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Request review
                      </li>
                    </ul>
                  </div>

                  {/* Auto-Maintenance */}
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Auto-Maintenance
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Clean duplicates
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Compress old files
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Backup important
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Update metadata
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Automation ROI */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Automation Return on Investment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {automationROI.map((metric) => (
                    <div key={metric.metric}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{metric.value}</span>
                          <span className="text-xs text-gray-500">{metric.unit}</span>
                        </div>
                      </div>
                      <Progress value={metric.impact} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Batch Size Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-blue-600" />
                  Batch Size Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={batchSizeOptimization}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="size" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="processingTime" fill={COLORS.primary} name="Time (min)" />
                      <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke={COLORS.success} strokeWidth={3} name="Efficiency %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <Alert className="mt-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Optimal Batch Size:</strong> 21-30 items provides best efficiency at 92% with reasonable processing time
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Undo Utilization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-orange-600" />
                  Undo Feature Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={undoUtilization}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="operations" fill={COLORS.tertiary} name="Operations" />
                      <Bar dataKey="undos" fill={COLORS.quaternary} name="Undos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Efficiency Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Operational Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Peak Efficiency:</strong> Batch operations save 87% time on average vs manual processing
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Automation Impact:</strong> 289 operations automated this week, saving 48 hours
                  </AlertDescription>
                </Alert>

                <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Smart Scheduling:</strong> Auto-maintenance at 2 AM Sunday minimizes disruption
                  </AlertDescription>
                </Alert>

                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Risk Mitigation:</strong> 30-day recovery window prevents 95% of data loss incidents
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Bulk Operations & Automation system with 
                6 operation types (Categorize, Tag, Delete, Export, Update, Template), 4 automation workflows, 
                undo/recovery support, and comprehensive analytics.
              </AlertDescription>
            </Alert>

            <BulkOperationsAutomation
              onBulkOperation={handleBulkOperation}
              onAutomationToggle={handleAutomationToggle}
              onUndo={handleUndo}
              enableAutomation={true}
              enableUndo={true}
              enablePreview={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}