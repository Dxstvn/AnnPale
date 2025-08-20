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
  ScatterChart,
  Scatter,
  Treemap
} from "recharts"
import {
  ArrowLeft,
  Video,
  Grid,
  List,
  Calendar,
  Columns,
  Image,
  Search,
  Filter,
  Database,
  FolderOpen,
  Archive,
  Clock,
  Eye,
  Download,
  Share2,
  Star,
  Play,
  Edit,
  Trash2,
  Tag,
  MoreHorizontal,
  Settings,
  Info,
  TrendingUp,
  HardDrive,
  Activity,
  Layers,
  FileVideo,
  Film,
  Sparkles,
  LayoutGrid,
  LayoutList,
  CalendarDays,
  Kanban,
  GalleryHorizontal,
  Zap,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  BarChart3
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { VideoLibraryArchitecture } from "@/components/creator/content/video-library-architecture"

// Demo data for visualizations
const viewTypeUsage = [
  { name: "Grid", value: 35, color: "#3B82F6", icon: Grid },
  { name: "List", value: 25, color: "#10B981", icon: List },
  { name: "Timeline", value: 20, color: "#8B5CF6", icon: Calendar },
  { name: "Kanban", value: 15, color: "#F97316", icon: Columns },
  { name: "Gallery", value: 5, color: "#EC4899", icon: Image }
]

const contentCategories = [
  { category: "Status", count: 89, growth: 12 },
  { category: "Type", count: 76, growth: 8 },
  { category: "Quality", count: 64, growth: 15 },
  { category: "Customer", count: 52, growth: 20 },
  { category: "Occasion", count: 48, growth: 10 }
]

const metadataStructure = [
  { field: "Title", type: "Text", required: true, usage: 100 },
  { field: "Duration", type: "Time", required: true, usage: 100 },
  { field: "Status", type: "Select", required: true, usage: 95 },
  { field: "Customer", type: "Text", required: false, usage: 85 },
  { field: "Occasion", type: "Select", required: false, usage: 78 },
  { field: "Tags", type: "Multi-select", required: false, usage: 72 },
  { field: "Quality", type: "Select", required: false, usage: 65 },
  { field: "Notes", type: "Text Area", required: false, usage: 45 }
]

const storageAnalytics = [
  { month: "Jan", videos: 120, storage: 45, archived: 10 },
  { month: "Feb", videos: 150, storage: 52, archived: 15 },
  { month: "Mar", videos: 180, storage: 61, archived: 22 },
  { month: "Apr", videos: 210, storage: 68, archived: 30 },
  { month: "May", videos: 245, storage: 75, archived: 38 },
  { month: "Jun", videos: 280, storage: 82, archived: 45 }
]

const searchPatterns = [
  { pattern: "By Customer Name", frequency: 42, success: 92 },
  { pattern: "By Date Range", frequency: 38, success: 88 },
  { pattern: "By Occasion", frequency: 25, success: 95 },
  { pattern: "By Status", frequency: 22, success: 90 },
  { pattern: "By Tags", frequency: 18, success: 85 }
]

const performanceMetrics = [
  { metric: "Load Time", value: 1.2, unit: "sec", benchmark: 2.0, status: "good" },
  { metric: "Search Speed", value: 0.3, unit: "sec", benchmark: 0.5, status: "excellent" },
  { metric: "Filter Apply", value: 0.15, unit: "sec", benchmark: 0.3, status: "excellent" },
  { metric: "View Switch", value: 0.25, unit: "sec", benchmark: 0.4, status: "good" },
  { metric: "Batch Operations", value: 2.5, unit: "sec", benchmark: 3.0, status: "good" }
]

const organizationEfficiency = [
  { task: "Finding Videos", before: 8, after: 2, improvement: 75 },
  { task: "Bulk Operations", before: 15, after: 3, improvement: 80 },
  { task: "Status Updates", before: 5, after: 1, improvement: 80 },
  { task: "Archiving", before: 12, after: 2, improvement: 83 },
  { task: "Searching", before: 6, after: 1, improvement: 83 }
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

export default function Phase332Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [selectedView, setSelectedView] = React.useState("grid")
  const [selectedCategory, setSelectedCategory] = React.useState("status")

  const handleViewChange = (view: string) => {
    setSelectedView(view)
    console.log("View changed to:", view)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    console.log("Category selected:", category)
  }

  const handleVideoOperation = (operation: string, videoId: string) => {
    console.log(`Operation ${operation} on video ${videoId}`)
  }

  const handleBulkOperation = (operation: string, videoIds: string[]) => {
    console.log(`Bulk operation ${operation} on ${videoIds.length} videos`)
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
                <h1 className="text-xl font-semibold">Phase 3.3.2 Demo</h1>
                <p className="text-sm text-gray-600">Video Library Architecture</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Database className="h-3 w-3 mr-1" />
                Library System
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
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
              <LayoutGrid className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="views" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              View Types
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Metadata
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
                  <Video className="h-5 w-5 text-blue-600" />
                  Video Library Architecture System
                </CardTitle>
                <CardDescription>
                  Comprehensive content management with multiple view types and intelligent organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* View Type Distribution */}
                  <div>
                    <h4 className="font-semibold mb-4">View Type Usage Distribution</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={viewTypeUsage}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {viewTypeUsage.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {viewTypeUsage.map((view) => {
                        const Icon = view.icon
                        return (
                          <div key={view.name} className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: view.color }}
                            />
                            <Icon className="h-4 w-4" />
                            <span className="text-sm">{view.name}: {view.value}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Storage Analytics */}
                  <div>
                    <h4 className="font-semibold mb-4">Library Growth & Storage</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={storageAnalytics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Bar yAxisId="left" dataKey="videos" fill={COLORS.primary} name="Videos" />
                          <Line 
                            yAxisId="right" 
                            type="monotone" 
                            dataKey="storage" 
                            stroke={COLORS.secondary} 
                            strokeWidth={3}
                            name="Storage (GB)"
                          />
                          <Line 
                            yAxisId="left" 
                            type="monotone" 
                            dataKey="archived" 
                            stroke={COLORS.warning} 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Archived"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  {performanceMetrics.map((metric) => (
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
                        variant={metric.status === "excellent" ? "default" : "secondary"}
                        className="mt-2 text-xs"
                      >
                        {metric.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* View Types Tab */}
          <TabsContent value="views" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Grid View */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid className="h-5 w-5 text-blue-600" />
                    Grid View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Visual thumbnails
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Quick preview on hover
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Batch selection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Responsive columns
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Usage</div>
                    <Progress value={35} className="h-2" />
                    <div className="text-xs mt-1 font-medium">35% of users</div>
                  </div>
                </CardContent>
              </Card>

              {/* List View */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5 text-green-600" />
                    List View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Detailed metadata
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Sortable columns
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Inline actions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Compact density
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Usage</div>
                    <Progress value={25} className="h-2" />
                    <div className="text-xs mt-1 font-medium">25% of users</div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline View */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Timeline View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Chronological order
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Date grouping
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Activity tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      History view
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Usage</div>
                    <Progress value={20} className="h-2" />
                    <div className="text-xs mt-1 font-medium">20% of users</div>
                  </div>
                </CardContent>
              </Card>

              {/* Kanban View */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Columns className="h-5 w-5 text-orange-600" />
                    Kanban View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Drag & drop
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Status columns
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Workflow management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Progress tracking
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Usage</div>
                    <Progress value={15} className="h-2" />
                    <div className="text-xs mt-1 font-medium">15% of users</div>
                  </div>
                </CardContent>
              </Card>

              {/* Gallery View */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-pink-600" />
                    Gallery View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Full-screen mode
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Slideshow playback
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Portfolio showcase
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Client presentation
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Usage</div>
                    <Progress value={5} className="h-2" />
                    <div className="text-xs mt-1 font-medium">5% of users</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Organization Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Organization Efficiency Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={organizationEfficiency}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="task" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="before" fill={COLORS.danger} name="Before (min)" />
                      <Bar dataKey="after" fill={COLORS.success} name="After (min)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-600" />
                  Metadata Structure & Usage
                </CardTitle>
                <CardDescription>
                  Comprehensive metadata fields for rich content organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metadataStructure.map((field) => (
                    <div key={field.field} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{field.field}</span>
                          <span className="text-xs text-gray-600">{field.type}</span>
                        </div>
                        {field.required && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">{field.usage}%</div>
                          <div className="text-xs text-gray-500">usage</div>
                        </div>
                        <Progress value={field.usage} className="w-24 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-green-600" />
                  Content Categorization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  {contentCategories.map((cat) => (
                    <Card key={cat.category}>
                      <CardContent className="p-4">
                        <h5 className="font-medium text-sm mb-2">{cat.category}</h5>
                        <div className="text-2xl font-bold">{cat.count}</div>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">+{cat.growth}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Search Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-purple-600" />
                  Search Pattern Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={searchPatterns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pattern" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="frequency" fill={COLORS.primary} name="Frequency %" />
                      <Line 
                        type="monotone" 
                        dataKey="success" 
                        stroke={COLORS.success} 
                        strokeWidth={3}
                        name="Success Rate %"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Videos</p>
                      <p className="text-2xl font-bold">1,248</p>
                      <p className="text-xs text-green-600 mt-1">+12% this month</p>
                    </div>
                    <Video className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Storage Used</p>
                      <p className="text-2xl font-bold">82 GB</p>
                      <p className="text-xs text-yellow-600 mt-1">68% of quota</p>
                    </div>
                    <HardDrive className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Archived</p>
                      <p className="text-2xl font-bold">234</p>
                      <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
                    </div>
                    <Archive className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg. Duration</p>
                      <p className="text-2xl font-bold">2:45</p>
                      <p className="text-xs text-blue-600 mt-1">-15s from last month</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Library Activity Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>Library Activity Overview</CardTitle>
                <CardDescription>
                  Content creation and management patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const intensity = Math.random()
                    const color = intensity > 0.8 ? "bg-green-600" : 
                                  intensity > 0.6 ? "bg-green-500" :
                                  intensity > 0.4 ? "bg-green-400" :
                                  intensity > 0.2 ? "bg-green-300" : "bg-gray-100"
                    return (
                      <div
                        key={i}
                        className={cn("aspect-square rounded", color)}
                        title={`Activity level: ${Math.round(intensity * 100)}%`}
                      />
                    )
                  })}
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
                  <span>5 weeks ago</span>
                  <span>Today</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Video Library Architecture with 
                5 view types (Grid, List, Timeline, Kanban, Gallery), comprehensive metadata structure, 
                content categorization, and powerful search & filter capabilities.
              </AlertDescription>
            </Alert>

            <VideoLibraryArchitecture
              onViewChange={handleViewChange}
              onCategorySelect={handleCategorySelect}
              onVideoOperation={handleVideoOperation}
              onBulkOperation={handleBulkOperation}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}