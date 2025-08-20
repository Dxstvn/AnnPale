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
  TreemapChart,
  Treemap,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
} from "recharts"
import {
  ArrowLeft,
  FileText,
  Play,
  Square,
  Gift,
  MessageSquare,
  Sparkles,
  Clock,
  Star,
  Users,
  Zap,
  Activity,
  TrendingUp,
  BarChart3,
  Info,
  Download,
  Settings,
  Sliders,
  Filter,
  ChevronRight,
  Database,
  Save,
  Edit,
  Copy,
  Trash2,
  Share2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Layers,
  Layout,
  Palette,
  Wand2,
  Magic,
  Award,
  Trophy,
  Target,
  Flag,
  Bookmark,
  Hash,
  Tag,
  Folder,
  FolderOpen,
  FolderPlus,
  Archive,
  GitBranch,
  GitMerge,
  Package,
  Box,
  Timer,
  Gauge,
  PieChart as PieIcon,
  Calendar,
  User,
  Heart,
  Music,
  Video,
  Camera,
  Mic,
  Headphones,
  Film
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TemplateSystemDesign } from "@/components/creator/content/template-system-design"

// Demo data for visualizations
const templateCategoryStats = [
  { category: "Intros", count: 12, usage: 1456, timeSaved: 436, color: "#3B82F6" },
  { category: "Outros", count: 8, usage: 1234, timeSaved: 246, color: "#10B981" },
  { category: "Occasions", count: 25, usage: 892, timeSaved: 2230, color: "#8B5CF6" },
  { category: "Responses", count: 15, usage: 567, timeSaved: 2835, color: "#F97316" },
  { category: "Effects", count: 20, usage: 345, timeSaved: 345, color: "#EC4899" }
]

const templateUsageTimeline = [
  { month: "Jan", intros: 120, outros: 100, occasions: 80, responses: 60, effects: 40 },
  { month: "Feb", intros: 140, outros: 110, occasions: 95, responses: 70, effects: 45 },
  { month: "Mar", intros: 160, outros: 125, occasions: 110, responses: 85, effects: 55 },
  { month: "Apr", intros: 180, outros: 140, occasions: 130, responses: 95, effects: 65 },
  { month: "May", intros: 200, outros: 155, occasions: 145, responses: 110, effects: 75 },
  { month: "Jun", intros: 220, outros: 170, occasions: 160, responses: 125, effects: 85 }
]

const customizationLevels = [
  { level: "Low", templates: 28, avgUsage: 156, satisfaction: 92 },
  { level: "Medium", templates: 32, avgUsage: 89, satisfaction: 88 },
  { level: "High", templates: 20, avgUsage: 45, satisfaction: 95 }
]

const templateBuildingBlocks = [
  { block: "Opening", usage: 95, avgDuration: 5, customizable: true },
  { block: "Greeting", usage: 92, avgDuration: 3, customizable: true },
  { block: "Main Content", usage: 100, avgDuration: 45, customizable: true },
  { block: "Personalization", usage: 78, avgDuration: 10, customizable: true },
  { block: "Closing", usage: 88, avgDuration: 5, customizable: false },
  { block: "Call-to-Action", usage: 65, avgDuration: 8, customizable: false },
  { block: "Effects", usage: 45, avgDuration: 0, customizable: true },
  { block: "Music", usage: 72, avgDuration: 0, customizable: false }
]

const timeSavingsAnalysis = [
  { category: "Daily Tasks", withoutTemplates: 45, withTemplates: 12, saved: 33 },
  { category: "Weekly Projects", withoutTemplates: 180, withTemplates: 60, saved: 120 },
  { category: "Special Occasions", withoutTemplates: 90, withTemplates: 25, saved: 65 },
  { category: "Quick Responses", withoutTemplates: 15, withTemplates: 3, saved: 12 },
  { category: "Brand Content", withoutTemplates: 30, withTemplates: 8, saved: 22 }
]

const templateVersioning = [
  { version: "v1.0", created: "Jan 1", changes: 0, usage: 45 },
  { version: "v1.1", created: "Jan 15", changes: 3, usage: 78 },
  { version: "v1.2", created: "Feb 1", changes: 5, usage: 123 },
  { version: "v2.0", created: "Feb 20", changes: 12, usage: 234 },
  { version: "v2.1", created: "Mar 5", changes: 2, usage: 156 }
]

const templateSharingStats = [
  { type: "Private", count: 45, percentage: 56 },
  { type: "Team", count: 25, percentage: 31 },
  { type: "Public", count: 10, percentage: 13 }
]

const templatePerformance = [
  { metric: "Apply Speed", value: 0.8, benchmark: 1.5, unit: "sec" },
  { metric: "Preview Time", value: 0.3, benchmark: 0.5, unit: "sec" },
  { metric: "Save Time", value: 1.2, benchmark: 2.0, unit: "sec" },
  { metric: "Load Time", value: 0.5, benchmark: 1.0, unit: "sec" },
  { metric: "Render Time", value: 1.5, benchmark: 2.5, unit: "sec" }
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

export default function Phase334Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [selectedCategory, setSelectedCategory] = React.useState("all")

  const handleTemplateCreate = (template: any) => {
    console.log("Template created:", template)
  }

  const handleTemplateApply = (templateId: string) => {
    console.log("Applying template:", templateId)
  }

  const handleTemplateEdit = (templateId: string) => {
    console.log("Editing template:", templateId)
  }

  const handleTemplateDelete = (templateId: string) => {
    console.log("Deleting template:", templateId)
  }

  const handleTemplateShare = (templateId: string) => {
    console.log("Sharing template:", templateId)
  }

  // Calculate total metrics
  const totalTemplates = templateCategoryStats.reduce((sum, cat) => sum + cat.count, 0)
  const totalUsage = templateCategoryStats.reduce((sum, cat) => sum + cat.usage, 0)
  const totalTimeSaved = templateCategoryStats.reduce((sum, cat) => sum + cat.timeSaved, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.3.4 Demo</h1>
                <p className="text-sm text-gray-600">Template System Design</p>
              </div>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                <FileText className="h-3 w-3 mr-1" />
                Template System
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                5 Categories
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
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="building" className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              Building
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
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Template System Overview
                </CardTitle>
                <CardDescription>
                  Reusable templates for consistency, efficiency, and personalization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Category Distribution */}
                  <div>
                    <h4 className="font-semibold mb-4">Template Distribution</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={templateCategoryStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="count"
                          >
                            {templateCategoryStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {templateCategoryStats.map((cat) => (
                        <div key={cat.category} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-sm">{cat.category}: {cat.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Usage Timeline */}
                  <div>
                    <h4 className="font-semibold mb-4">Usage Trends</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={templateUsageTimeline}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="intros" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                          <Area type="monotone" dataKey="outros" stackId="1" stroke="#10B981" fill="#10B981" />
                          <Area type="monotone" dataKey="occasions" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                          <Area type="monotone" dataKey="responses" stackId="1" stroke="#F97316" fill="#F97316" />
                          <Area type="monotone" dataKey="effects" stackId="1" stroke="#EC4899" fill="#EC4899" />
                        </AreaChart>
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
                      <p className="text-sm text-gray-600">Total Templates</p>
                      <p className="text-2xl font-bold">{totalTemplates}</p>
                      <p className="text-xs text-green-600 mt-1">+8 this week</p>
                    </div>
                    <FileText className="h-8 w-8 text-indigo-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Usage</p>
                      <p className="text-2xl font-bold">{totalUsage.toLocaleString()}</p>
                      <p className="text-xs text-blue-600 mt-1">+234 today</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Time Saved</p>
                      <p className="text-2xl font-bold">{Math.round(totalTimeSaved / 60)}h</p>
                      <p className="text-xs text-green-600 mt-1">This month</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Rating</p>
                      <p className="text-2xl font-bold">4.8</p>
                      <p className="text-xs text-yellow-600 mt-1">⭐⭐⭐⭐⭐</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Categories Analysis</CardTitle>
                <CardDescription>
                  Purpose, customization levels, and usage patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Intros", purpose: "Brand consistency", customization: "Low", frequency: "Every video", timeSaved: "30 seconds", icon: Play },
                    { category: "Outros", purpose: "Call-to-action", customization: "Low", frequency: "Every video", timeSaved: "20 seconds", icon: Square },
                    { category: "Occasions", purpose: "Common requests", customization: "Medium", frequency: "Daily", timeSaved: "2-3 minutes", icon: Gift },
                    { category: "Responses", purpose: "FAQ answers", customization: "High", frequency: "Weekly", timeSaved: "5 minutes", icon: MessageSquare },
                    { category: "Effects", purpose: "Visual style", customization: "Low", frequency: "Per preference", timeSaved: "1 minute", icon: Sparkles }
                  ].map((cat) => {
                    const Icon = cat.icon
                    return (
                      <div key={cat.category} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-white dark:bg-gray-700">
                            <Icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h5 className="font-medium">{cat.category}</h5>
                            <p className="text-sm text-gray-600">{cat.purpose}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-gray-500">Customization:</span>
                            <Badge variant="outline" className="ml-2">{cat.customization}</Badge>
                          </div>
                          <div>
                            <span className="text-gray-500">Frequency:</span>
                            <span className="ml-2 font-medium">{cat.frequency}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Saves:</span>
                            <span className="ml-2 font-medium text-green-600">{cat.timeSaved}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Customization Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-purple-600" />
                  Customization Level Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={customizationLevels}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="level" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Templates" dataKey="templates" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} />
                      <Radar name="Usage" dataKey="avgUsage" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.3} />
                      <Radar name="Satisfaction" dataKey="satisfaction" stroke={COLORS.tertiary} fill={COLORS.tertiary} fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Building Tab */}
          <TabsContent value="building" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="h-5 w-5 text-orange-600" />
                  Template Building Blocks
                </CardTitle>
                <CardDescription>
                  Core components and their usage in templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={templateBuildingBlocks}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="block" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="usage" fill={COLORS.primary} name="Usage %" />
                      <Line yAxisId="right" type="monotone" dataKey="avgDuration" stroke={COLORS.danger} strokeWidth={3} name="Avg Duration (s)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Template Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Template Structure</CardTitle>
                <CardDescription>
                  Hierarchical organization of template elements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Opening Section */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Opening
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Greeting style
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Introduction
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Energy level
                      </li>
                    </ul>
                  </div>

                  {/* Main Content Section */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Main Content
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Key messages
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Personalization slots
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Story structure
                      </li>
                    </ul>
                  </div>

                  {/* Closing Section */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      Closing
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Sign-off style
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Call-to-action
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Contact info
                      </li>
                    </ul>
                  </div>

                  {/* Style Section */}
                  <div className="border-l-4 border-pink-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Style
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Background
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Music/sounds
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Effects/filters
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Time Savings Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-green-600" />
                  Time Savings Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeSavingsAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="withoutTemplates" fill={COLORS.danger} name="Without Templates (min)" />
                      <Bar dataKey="withTemplates" fill={COLORS.success} name="With Templates (min)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Version Control */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-blue-600" />
                    Version Control
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {templateVersioning.map((version, index) => (
                      <div key={version.version} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <span className="font-medium text-sm">{version.version}</span>
                          <span className="ml-2 text-xs text-gray-500">{version.created}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <Badge variant="outline">{version.changes} changes</Badge>
                          <span>{version.usage} uses</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sharing Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-purple-600" />
                    Sharing Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {templateSharingStats.map((stat) => (
                      <div key={stat.type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{stat.type}</span>
                          <span className="text-sm">{stat.count} templates</span>
                        </div>
                        <Progress value={stat.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-orange-600" />
                  Template Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  {templatePerformance.map((metric) => (
                    <div key={metric.metric} className="text-center">
                      <div className="text-sm text-gray-600 mb-2">{metric.metric}</div>
                      <div className="text-2xl font-bold">
                        {metric.value}
                        <span className="text-sm font-normal ml-1">{metric.unit}</span>
                      </div>
                      <Progress 
                        value={(metric.benchmark - metric.value) / metric.benchmark * 100} 
                        className="h-2 mt-2"
                      />
                      <Badge 
                        variant={metric.value < metric.benchmark * 0.6 ? "default" : "secondary"}
                        className="mt-2 text-xs"
                      >
                        {metric.value < metric.benchmark * 0.6 ? "Excellent" : "Good"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Template System Design with 
                5 categories (Intros, Outros, Occasions, Responses, Effects), template builder wizard, 
                variable placeholders, version control, and smart application features.
              </AlertDescription>
            </Alert>

            <TemplateSystemDesign
              onTemplateCreate={handleTemplateCreate}
              onTemplateApply={handleTemplateApply}
              onTemplateEdit={handleTemplateEdit}
              onTemplateDelete={handleTemplateDelete}
              onTemplateShare={handleTemplateShare}
              enableVersionControl={true}
              enableSharing={true}
              enableAnalytics={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}