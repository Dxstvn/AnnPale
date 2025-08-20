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
  Trophy,
  Shield,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Camera,
  Mic,
  Video,
  Sun,
  Volume2,
  Monitor,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Award,
  Brain,
  Eye,
  Settings,
  RefreshCw,
  Zap,
  Info,
  Download,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Users,
  Heart,
  ThumbsUp,
  Timer,
  Gauge,
  Filter,
  Database,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Layout,
  Sparkles,
  Lightbulb,
  MessageSquare,
  Send,
  Headphones,
  Wifi,
  Signal,
  Battery,
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
  Map
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ContentQualityManagement } from "@/components/creator/quality/content-quality-management"

// Demo data for visualizations
const checkpointPerformance = [
  { checkpoint: "Pre-record", passRate: 95, avgTime: 3.2, automation: 85 },
  { checkpoint: "Recording", passRate: 88, avgTime: 15.5, automation: 70 },
  { checkpoint: "Post-record", passRate: 92, avgTime: 5.8, automation: 60 },
  { checkpoint: "Pre-delivery", passRate: 97, avgTime: 2.1, automation: 90 },
  { checkpoint: "Post-delivery", passRate: 99, avgTime: 1.5, automation: 95 }
]

const qualityImpact = [
  { month: "Jan", beforeQM: 3.8, afterQM: 3.8 },
  { month: "Feb", beforeQM: 3.9, afterQM: 4.1 },
  { month: "Mar", beforeQM: 4.0, afterQM: 4.3 },
  { month: "Apr", beforeQM: 4.1, afterQM: 4.5 },
  { month: "May", beforeQM: 4.2, afterQM: 4.7 },
  { month: "Jun", beforeQM: 4.3, afterQM: 4.8 }
]

const issueResolution = [
  { issue: "Audio Levels", detected: 234, autoFixed: 189, manualFixed: 45, unresolved: 0 },
  { issue: "Lighting", detected: 156, autoFixed: 98, manualFixed: 52, unresolved: 6 },
  { issue: "Background", detected: 89, autoFixed: 45, manualFixed: 40, unresolved: 4 },
  { issue: "Framing", detected: 67, autoFixed: 56, manualFixed: 11, unresolved: 0 },
  { issue: "Energy", detected: 123, autoFixed: 0, manualFixed: 110, unresolved: 13 }
]

const aiSuggestionAdoption = [
  { category: "Technical", suggestions: 145, adopted: 112, success: 95 },
  { category: "Content", suggestions: 89, adopted: 67, success: 88 },
  { category: "Delivery", suggestions: 56, adopted: 45, success: 92 },
  { category: "Style", suggestions: 34, adopted: 28, success: 86 }
]

const qualityScoreDistribution = [
  { range: "4.8-5.0", count: 145, percentage: 35 },
  { range: "4.5-4.7", count: 189, percentage: 45 },
  { range: "4.0-4.4", count: 67, percentage: 16 },
  { range: "3.5-3.9", count: 15, percentage: 3 },
  { range: "<3.5", count: 4, percentage: 1 }
]

const performanceByCategory = [
  { category: "Video Quality", score: 98, benchmark: 85, improvement: 15 },
  { category: "Audio Clarity", score: 95, benchmark: 80, improvement: 18 },
  { category: "Lighting", score: 97, benchmark: 75, improvement: 29 },
  { category: "Message Accuracy", score: 96, benchmark: 90, improvement: 6 },
  { category: "Energy Level", score: 92, benchmark: 85, improvement: 8 },
  { category: "Personalization", score: 94, benchmark: 88, improvement: 7 }
]

const timeToQuality = [
  { time: "0-1hr", quality: 78, videos: 23 },
  { time: "1-2hr", quality: 85, videos: 67 },
  { time: "2-3hr", quality: 92, videos: 89 },
  { time: "3-4hr", quality: 94, videos: 112 },
  { time: "4-5hr", quality: 91, videos: 78 },
  { time: "5-6hr", quality: 86, videos: 45 },
  { time: "6+hr", quality: 80, videos: 34 }
]

const improvementROI = [
  { improvement: "Audio Setup", investment: 500, return: 2300, roi: 360 },
  { improvement: "Lighting Kit", investment: 800, return: 3200, roi: 300 },
  { improvement: "Background", investment: 200, return: 600, roi: 200 },
  { improvement: "Training", investment: 300, return: 1500, roi: 400 },
  { improvement: "Software", investment: 150, return: 900, roi: 500 }
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

export default function Phase337Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")

  const handleCheckpointUpdate = (checkpoint: any) => {
    console.log("Checkpoint updated:", checkpoint)
  }

  const handleQualityImprove = (suggestion: any) => {
    console.log("Improvement applied:", suggestion)
  }

  const handleMetricsRefresh = () => {
    console.log("Metrics refreshed")
  }

  // Calculate totals
  const totalIssuesDetected = issueResolution.reduce((sum, i) => sum + i.detected, 0)
  const totalAutoFixed = issueResolution.reduce((sum, i) => sum + i.autoFixed, 0)
  const avgPassRate = checkpointPerformance.reduce((sum, c) => sum + c.passRate, 0) / checkpointPerformance.length
  const totalSuggestions = aiSuggestionAdoption.reduce((sum, s) => sum + s.suggestions, 0)
  const totalAdopted = aiSuggestionAdoption.reduce((sum, s) => sum + s.adopted, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.3.7 Demo</h1>
                <p className="text-sm text-gray-600">Content Quality Management</p>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Trophy className="h-3 w-3 mr-1" />
                Quality System
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                5 Checkpoints
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
            <TabsTrigger value="checkpoints" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Checkpoints
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Metrics
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
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Content Quality Management Overview
                </CardTitle>
                <CardDescription>
                  Systematic quality checks and improvement tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Quality Impact */}
                  <div>
                    <h4 className="font-semibold mb-4">Quality Score Evolution</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={qualityImpact}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[3.5, 5]} />
                          <Tooltip />
                          <Area type="monotone" dataKey="beforeQM" stackId="1" stroke={COLORS.quaternary} fill={COLORS.quaternary} fillOpacity={0.5} name="Before QM" />
                          <Area type="monotone" dataKey="afterQM" stackId="2" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.5} name="After QM" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Quality Distribution */}
                  <div>
                    <h4 className="font-semibold mb-4">Quality Score Distribution</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={qualityScoreDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="count"
                          >
                            {qualityScoreDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {qualityScoreDistribution.map((item, index) => (
                        <div key={item.range} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: Object.values(COLORS)[index] }}
                          />
                          <span className="text-sm">{item.range}: {item.percentage}%</span>
                        </div>
                      ))}
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
                      <p className="text-sm text-gray-600">Quality Score</p>
                      <p className="text-2xl font-bold">4.8/5.0</p>
                      <p className="text-xs text-green-600 mt-1">+0.5 improvement</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pass Rate</p>
                      <p className="text-2xl font-bold">{avgPassRate.toFixed(0)}%</p>
                      <p className="text-xs text-blue-600 mt-1">First-time pass</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Auto-Fix Rate</p>
                      <p className="text-2xl font-bold">{((totalAutoFixed / totalIssuesDetected) * 100).toFixed(0)}%</p>
                      <p className="text-xs text-purple-600 mt-1">AI-powered</p>
                    </div>
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Satisfaction</p>
                      <p className="text-2xl font-bold">95%</p>
                      <p className="text-xs text-orange-600 mt-1">Customer rating</p>
                    </div>
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Checkpoints Tab */}
          <TabsContent value="checkpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Checkpoint Performance</CardTitle>
                <CardDescription>
                  Systematic quality checks throughout content creation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={checkpointPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="checkpoint" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="passRate" fill={COLORS.success} name="Pass Rate %" />
                      <Bar yAxisId="left" dataKey="automation" fill={COLORS.primary} name="Automation %" />
                      <Line yAxisId="right" type="monotone" dataKey="avgTime" stroke={COLORS.danger} strokeWidth={3} name="Avg Time (min)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Checkpoint Details */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { stage: "Pre-record", icon: Camera, checks: ["Lighting", "Audio", "Background"], color: "bg-blue-500" },
                { stage: "Recording", icon: Video, checks: ["Levels", "Framing", "Energy"], color: "bg-purple-500" },
                { stage: "Post-record", icon: Eye, checks: ["Review", "Quality", "Duration"], color: "bg-green-500" },
                { stage: "Pre-delivery", icon: Shield, checks: ["Final", "Requirements", "Preview"], color: "bg-orange-500" },
                { stage: "Post-delivery", icon: Star, checks: ["Feedback", "Analytics", "Follow-up"], color: "bg-pink-500" }
              ].map((checkpoint) => {
                const Icon = checkpoint.icon
                return (
                  <Card key={checkpoint.stage}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <div className={cn("p-1 rounded", checkpoint.color)}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        {checkpoint.stage}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {checkpoint.checks.map((check) => (
                          <div key={check} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{check}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Pass Rate:</span>
                          <span className="font-medium">
                            {checkpointPerformance.find(c => c.checkpoint.includes(checkpoint.stage.split("-")[0]))?.passRate || 0}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Checkpoint Flow */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Control Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  {[
                    { stage: "Pre-record", status: "Setup", action: "Guidance tips", automation: "Checklist" },
                    { stage: "Recording", status: "Real-time", action: "Live feedback", automation: "Monitoring" },
                    { stage: "Post-record", status: "Review", action: "Re-record option", automation: "AI analysis" },
                    { stage: "Pre-delivery", status: "Final", action: "Edit required", automation: "Validation" },
                    { stage: "Post-delivery", status: "Feedback", action: "Follow-up", automation: "Surveys" }
                  ].map((item, index) => (
                    <div key={item.stage} className="relative flex items-center gap-4 mb-6">
                      <div className="z-10 w-16 h-16 bg-white border-2 border-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h5 className="font-medium">{item.stage}</h5>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-gray-500">Check:</span>
                            <span className="ml-2">{item.status}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">If Failed:</span>
                            <span className="ml-2">{item.action}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Auto:</span>
                            <span className="ml-2">{item.automation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            {/* Issue Resolution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Issue Detection & Resolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={issueResolution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="issue" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="detected" fill={COLORS.danger} name="Detected" />
                      <Bar dataKey="autoFixed" fill={COLORS.success} name="Auto-Fixed" />
                      <Bar dataKey="manualFixed" fill={COLORS.warning} name="Manual Fix" />
                      <Bar dataKey="unresolved" fill={COLORS.quaternary} name="Unresolved" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Performance by Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Performance by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceByCategory.map((category) => (
                      <div key={category.category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{category.score}%</span>
                            <Badge variant="outline" className="text-xs">
                              +{category.improvement}%
                            </Badge>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={category.score} className="h-2" />
                          <div 
                            className="absolute top-0 h-2 bg-gray-300 opacity-30"
                            style={{ left: 0, width: `${category.benchmark}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Benchmark: {category.benchmark}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Suggestion Adoption */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Suggestion Effectiveness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiSuggestionAdoption.map((category) => (
                      <div key={category.category} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{category.category}</span>
                          <Badge variant="secondary">
                            {((category.adopted / category.suggestions) * 100).toFixed(0)}% adopted
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <p className="font-bold">{category.suggestions}</p>
                            <p className="text-gray-500">Suggested</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold">{category.adopted}</p>
                            <p className="text-gray-500">Adopted</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-green-600">{category.success}%</p>
                            <p className="text-gray-500">Success</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm font-medium">Overall Adoption Rate: {((totalAdopted / totalSuggestions) * 100).toFixed(0)}%</p>
                    <p className="text-xs text-gray-600 mt-1">AI suggestions improving quality by 23% on average</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time vs Quality */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Recording Duration vs Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timeToQuality}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Area yAxisId="left" type="monotone" dataKey="quality" fill={COLORS.tertiary} fillOpacity={0.3} stroke={COLORS.tertiary} strokeWidth={2} name="Quality %" />
                      <Bar yAxisId="right" dataKey="videos" fill={COLORS.primary} name="Video Count" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <Alert className="mt-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Insight:</strong> Optimal quality achieved in 2-4 hour recording sessions with proper breaks
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* ROI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Quality Investment ROI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={improvementROI}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="improvement" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="investment" fill={COLORS.danger} name="Investment ($)" />
                      <Bar dataKey="return" fill={COLORS.success} name="Return ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid md:grid-cols-5 gap-3 mt-4">
                  {improvementROI.map((item) => (
                    <div key={item.improvement} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium">{item.improvement}</p>
                      <p className="text-2xl font-bold text-green-600">{item.roi}%</p>
                      <p className="text-xs text-gray-500">ROI</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Impact on Business */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Impact on Business Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Trophy className="h-6 w-6 text-yellow-600" />
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold">+26%</p>
                      <p className="text-sm text-gray-600">Booking Increase</p>
                      <p className="text-xs text-gray-500 mt-1">From quality improvement</p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Star className="h-6 w-6 text-yellow-500" />
                        <ArrowUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold">4.8/5.0</p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                      <p className="text-xs text-gray-500 mt-1">Up from 4.3</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <RefreshCw className="h-6 w-6 text-purple-600" />
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold">-67%</p>
                      <p className="text-sm text-gray-600">Re-record Rate</p>
                      <p className="text-xs text-gray-500 mt-1">Quality checks help</p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Heart className="h-6 w-6 text-red-600" />
                        <ChevronRight className="h-4 w-4 text-orange-600" />
                      </div>
                      <p className="text-2xl font-bold">95%</p>
                      <p className="text-sm text-gray-600">Satisfaction</p>
                      <p className="text-xs text-gray-500 mt-1">Customer happiness</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Success Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Quality Success Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Lighting:</strong> 3-point setup with 5600K temperature produces 98% quality scores
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Mic className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Audio:</strong> Lavalier mic at 6" distance with -12dB peaks optimal for clarity
                  </AlertDescription>
                </Alert>

                <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                  <Video className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Framing:</strong> Eye-level camera with rule of thirds increases engagement 22%
                  </AlertDescription>
                </Alert>

                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Timing:</strong> 10-11 AM sessions show 15% higher quality and energy levels
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Content Quality Management system with 
                5 quality checkpoints (Pre-record, Recording, Post-record, Pre-delivery, Post-delivery), 
                AI-powered suggestions, real-time monitoring, and comprehensive analytics.
              </AlertDescription>
            </Alert>

            <ContentQualityManagement
              onCheckpointUpdate={handleCheckpointUpdate}
              onQualityImprove={handleQualityImprove}
              onMetricsRefresh={handleMetricsRefresh}
              enableAISuggestions={true}
              enableRealTimeMonitoring={true}
              enablePeerComparison={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}