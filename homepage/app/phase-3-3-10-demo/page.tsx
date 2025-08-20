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
  Smartphone,
  Camera,
  Video,
  Upload,
  Download,
  Edit,
  Search,
  Filter,
  Grid,
  List,
  Play,
  Pause,
  MoreVertical,
  Plus,
  X,
  Star,
  Heart,
  Share2,
  Save,
  Trash2,
  Archive,
  FolderOpen,
  Tag,
  Clock,
  Calendar,
  User,
  Bell,
  Settings,
  RefreshCw,
  WifiOff,
  Wifi,
  Eye,
  Mic,
  Volume2,
  StopCircle,
  FileVideo,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  Cloud,
  CloudOff,
  Folder,
  Target,
  Layers,
  Navigation,
  MapPin,
  Zap,
  Sparkles,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Users,
  ThumbsUp,
  MessageSquare,
  Layout,
  Package,
  Gauge,
  Timer,
  Phone,
  Tablet,
  Monitor,
  Laptop,
  Watch,
  Headphones
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { MobileContentManagement } from "@/components/creator/mobile/mobile-content-management"

// Demo data for visualizations
const mobileUsageStats = [
  { device: "Mobile", users: 68, sessions: 1234, avgTime: 14.5, satisfaction: 92 },
  { device: "Desktop", users: 32, sessions: 567, avgTime: 28.3, satisfaction: 89 },
  { device: "Tablet", users: 12, sessions: 189, avgTime: 19.2, satisfaction: 94 }
]

const mobileFeatureAdoption = [
  { feature: "Camera Upload", usage: 89, efficiency: 95 },
  { feature: "Voice Search", usage: 67, efficiency: 88 },
  { feature: "Gesture Control", usage: 45, efficiency: 82 },
  { feature: "Offline Mode", usage: 78, efficiency: 91 },
  { feature: "Quick Actions", usage: 92, efficiency: 97 }
]

const uploadMethods = [
  { method: "Camera", count: 456, percentage: 45 },
  { method: "Gallery", count: 234, percentage: 23 },
  { method: "Drag & Drop", count: 189, percentage: 19 },
  { method: "File Browser", count: 132, percentage: 13 }
]

const mobileWorkflow = [
  { step: "Record", desktop: 45, mobile: 12, optimization: 73 },
  { step: "Edit", desktop: 28, mobile: 8, optimization: 71 },
  { step: "Upload", desktop: 15, mobile: 3, optimization: 80 },
  { step: "Organize", desktop: 35, mobile: 5, optimization: 86 },
  { step: "Share", desktop: 12, mobile: 2, optimization: 83 }
]

const offlineCapabilities = [
  { capability: "Local Recording", availability: 100, usage: 78 },
  { capability: "Queue Uploads", availability: 95, usage: 67 },
  { capability: "Cached Library", availability: 85, usage: 89 },
  { capability: "Offline Editing", availability: 70, usage: 45 },
  { capability: "Sync When Online", availability: 98, usage: 92 }
]

const gestureActions = [
  { gesture: "Swipe Left", action: "Quick Actions", accuracy: 94 },
  { gesture: "Swipe Right", action: "Close Panel", accuracy: 96 },
  { gesture: "Swipe Up", action: "Open Filters", accuracy: 88 },
  { gesture: "Swipe Down", action: "Close Filters", accuracy: 91 },
  { gesture: "Pinch", action: "Zoom Content", accuracy: 97 },
  { gesture: "Long Press", action: "Select Mode", accuracy: 93 }
]

const mobilePerformance = [
  { metric: "Load Time", mobile: 2.1, desktop: 1.8, target: 3.0 },
  { metric: "Upload Speed", mobile: 8.5, desktop: 12.3, target: 10.0 },
  { metric: "Search Speed", mobile: 0.8, desktop: 0.6, target: 1.0 },
  { metric: "Gesture Response", mobile: 0.2, desktop: 0.0, target: 0.5 },
  { metric: "Offline Sync", mobile: 5.2, desktop: 3.1, target: 8.0 }
]

const quickActionUsage = [
  { day: "Mon", record: 89, upload: 145, search: 67, organize: 34 },
  { day: "Tue", record: 94, upload: 156, search: 72, organize: 38 },
  { day: "Wed", record: 87, upload: 134, search: 69, organize: 41 },
  { day: "Thu", record: 102, upload: 167, search: 78, organize: 45 },
  { day: "Fri", record: 98, upload: 189, search: 82, organize: 52 },
  { day: "Sat", record: 67, upload: 98, search: 45, organize: 23 },
  { day: "Sun", record: 54, upload: 76, search: 38, organize: 19 }
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

export default function Phase3310Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")

  const handleUpload = (file: File) => {
    console.log("Mobile upload:", file.name)
  }

  const handleRecord = () => {
    console.log("Mobile record initiated")
  }

  const handleEdit = (item: any) => {
    console.log("Mobile edit:", item.title)
  }

  const handleDelete = (id: string) => {
    console.log("Mobile delete:", id)
  }

  const handleShare = (id: string) => {
    console.log("Mobile share:", id)
  }

  const handleOrganize = (items: string[], action: string) => {
    console.log("Mobile organize:", action, items)
  }

  // Calculate totals
  const totalMobileUsers = mobileUsageStats[0].users
  const avgMobileTime = mobileUsageStats[0].avgTime
  const avgFeatureAdoption = mobileFeatureAdoption.reduce((sum, f) => sum + f.usage, 0) / mobileFeatureAdoption.length
  const totalQuickActions = quickActionUsage.reduce((sum, q) => sum + q.record + q.upload + q.search + q.organize, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.3.10 Demo</h1>
                <p className="text-sm text-gray-600">Mobile Content Management</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Smartphone className="h-3 w-3 mr-1" />
                Mobile-First
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-teal-50 text-teal-700">
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Workflow
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
                  <Smartphone className="h-5 w-5 text-green-600" />
                  Mobile Content Management Overview
                </CardTitle>
                <CardDescription>
                  Full content management capabilities optimized for mobile devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Mobile vs Desktop Usage */}
                  <div>
                    <h4 className="font-semibold mb-4">Device Usage Distribution</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mobileUsageStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="users"
                          >
                            {mobileUsageStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {mobileUsageStats.map((item, index) => (
                        <div key={item.device} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: Object.values(COLORS)[index] }}
                          />
                          <span className="text-sm">{item.device}: {item.users}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload Method Distribution */}
                  <div>
                    <h4 className="font-semibold mb-4">Upload Method Preference</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={uploadMethods}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="method" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill={COLORS.primary} name="Count" />
                        </BarChart>
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
                      <p className="text-sm text-gray-600">Mobile Users</p>
                      <p className="text-2xl font-bold">{totalMobileUsers}%</p>
                      <p className="text-xs text-green-600 mt-1">Primary platform</p>
                    </div>
                    <Smartphone className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Session Time</p>
                      <p className="text-2xl font-bold">{avgMobileTime}min</p>
                      <p className="text-xs text-blue-600 mt-1">Average mobile</p>
                    </div>
                    <Timer className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Feature Adoption</p>
                      <p className="text-2xl font-bold">{avgFeatureAdoption.toFixed(0)}%</p>
                      <p className="text-xs text-purple-600 mt-1">Mobile features</p>
                    </div>
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Quick Actions</p>
                      <p className="text-2xl font-bold">{totalQuickActions}</p>
                      <p className="text-xs text-orange-600 mt-1">This week</p>
                    </div>
                    <Navigation className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mobile-Adapted Features</CardTitle>
                <CardDescription>
                  Desktop vs mobile optimization comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={mobileFeatureAdoption}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="feature" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Usage" dataKey="usage" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} />
                      <Radar name="Efficiency" dataKey="efficiency" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Feature Comparison */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { feature: "Upload", desktop: "Drag & drop", mobile: "Camera/Gallery", optimization: "Native integration", icon: Upload, color: "bg-blue-500" },
                { feature: "Browse", desktop: "Grid view", mobile: "List/Cards", optimization: "Swipe navigation", icon: Grid, color: "bg-green-500" },
                { feature: "Edit", desktop: "Full editor", mobile: "Quick edits", optimization: "Essential tools", icon: Edit, color: "bg-purple-500" },
                { feature: "Organize", desktop: "Multi-select", mobile: "Single actions", optimization: "Gesture-based", icon: FolderOpen, color: "bg-orange-500" },
                { feature: "Search", desktop: "Advanced", mobile: "Voice/Simple", optimization: "Predictive", icon: Search, color: "bg-pink-500" }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.feature}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <div className={cn("p-1 rounded", item.color)}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        {item.feature}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <span className="text-gray-500">Desktop:</span>
                        <p className="mt-1">{item.desktop}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Mobile:</span>
                        <p className="mt-1">{item.mobile}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Optimization:</span>
                        <p className="mt-1 font-medium">{item.optimization}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Gesture Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  Gesture Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {gestureActions.map((gesture) => (
                      <div key={gesture.gesture} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h5 className="font-medium text-sm">{gesture.gesture}</h5>
                          <p className="text-xs text-gray-500">{gesture.action}</p>
                        </div>
                        <Badge variant="secondary">
                          {gesture.accuracy}% accuracy
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                    <h5 className="font-medium mb-3">Gesture Guide</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Swipe left/right for panels</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Swipe up/down for filters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span>Pinch to zoom content</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span>Long press for selection</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6">
            {/* Workflow Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Mobile Workflow Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={mobileWorkflow}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="step" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="desktop" fill={COLORS.quaternary} name="Desktop (sec)" />
                      <Bar dataKey="mobile" fill={COLORS.primary} name="Mobile (sec)" />
                      <Line type="monotone" dataKey="optimization" stroke={COLORS.success} strokeWidth={3} name="Optimization %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Quick Actions Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={quickActionUsage}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="record" stackId="1" stroke={COLORS.danger} fill={COLORS.danger} fillOpacity={0.6} name="Record" />
                        <Area type="monotone" dataKey="upload" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} name="Upload" />
                        <Area type="monotone" dataKey="search" stackId="1" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.6} name="Search" />
                        <Area type="monotone" dataKey="organize" stackId="1" stroke={COLORS.tertiary} fill={COLORS.tertiary} fillOpacity={0.6} name="Organize" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Offline Capabilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CloudOff className="h-5 w-5 text-gray-600" />
                    Offline Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {offlineCapabilities.map((capability) => (
                      <div key={capability.capability}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{capability.capability}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{capability.usage}%</span>
                            <Badge variant="outline" className="text-xs">
                              {capability.availability}% available
                            </Badge>
                          </div>
                        </div>
                        <Progress value={capability.usage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile-First Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Mobile-First Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { tool: "In-app Camera", description: "Native camera integration with filters", icon: Camera, users: "89%" },
                    { tool: "Voice Commands", description: "Hands-free operation with AI", icon: Mic, users: "67%" },
                    { tool: "Quick Filters", description: "One-tap content organization", icon: Filter, users: "78%" },
                    { tool: "Gesture Controls", description: "Intuitive swipe and pinch actions", icon: Navigation, users: "45%" },
                    { tool: "Offline Mode", description: "Work without internet connection", icon: WifiOff, users: "82%" },
                    { tool: "Widget Access", description: "Quick actions from home screen", icon: Package, users: "34%" }
                  ].map((tool) => {
                    const Icon = tool.icon
                    return (
                      <Card key={tool.tool} className="border-l-4 border-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                              <Icon className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{tool.tool}</h5>
                              <p className="text-xs text-gray-600 mt-1">{tool.description}</p>
                              <Badge variant="secondary" className="mt-2 text-xs">
                                {tool.users} adoption
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-blue-600" />
                  Mobile Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mobilePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="mobile" fill={COLORS.primary} name="Mobile (sec)" />
                      <Bar dataKey="desktop" fill={COLORS.secondary} name="Desktop (sec)" />
                      <Bar dataKey="target" fill={COLORS.warning} name="Target (sec)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Optimization Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Mobile Optimization Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Touch Targets:</strong> 89% of interactive elements meet 44px minimum size for optimal touch interaction
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Smartphone className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Viewport Optimization:</strong> Content automatically adjusts to 320px-414px mobile viewports
                  </AlertDescription>
                </Alert>

                <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Quick Actions:</strong> Most-used features accessible within 2 taps from any screen
                  </AlertDescription>
                </Alert>

                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <WifiOff className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Offline First:</strong> 85% of core functionality available without internet connection
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Device-Specific Adaptations */}
            <Card>
              <CardHeader>
                <CardTitle>Device-Specific Adaptations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Phone className="h-6 w-6 text-blue-600" />
                        <h5 className="font-medium">Mobile Phone</h5>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Single-handed operation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Portrait-first layout</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Bottom navigation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Haptic feedback</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Tablet className="h-6 w-6 text-green-600" />
                        <h5 className="font-medium">Tablet</h5>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Split-screen views</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Landscape optimization</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Multi-touch gestures</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Stylus support</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Watch className="h-6 w-6 text-purple-600" />
                        <h5 className="font-medium">Wearable</h5>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Quick notifications</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Voice shortcuts</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Health integration</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Minimal UI</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Mobile Content Management system with 
                native camera integration, gesture controls, voice commands, offline capabilities, 
                and mobile-optimized workflows.
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <div className="max-w-md">
                <MobileContentManagement
                  onUpload={handleUpload}
                  onRecord={handleRecord}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onShare={handleShare}
                  onOrganize={handleOrganize}
                  enableOfflineMode={true}
                  enableVoiceCommands={true}
                  enableGestureControls={true}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}