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
  Search,
  Filter,
  Eye,
  Mic,
  Calendar,
  Brain,
  Clock,
  User,
  Gift,
  Star,
  FileText,
  Download,
  Share2,
  Bell,
  Save,
  Folder,
  TrendingUp,
  Image,
  Volume2,
  Database,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  History,
  Bookmark,
  Hash,
  Tag,
  Zap,
  Grid,
  List,
  Settings,
  RefreshCw,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  Target,
  Users,
  Heart,
  ThumbsUp,
  MessageSquare,
  Video,
  Camera,
  Play,
  Pause,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity,
  Layers,
  Map,
  Navigation,
  Globe,
  Link,
  Code,
  Terminal,
  Cpu,
  Server,
  Cloud,
  Wifi,
  Battery,
  Moon,
  Sun,
  Shield,
  Lock,
  Unlock,
  Key,
  Layout,
  Package,
  Gauge,
  Timer
} from "lucide-react"
import NextLink from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { SearchDiscoverySystem } from "@/components/creator/search/search-discovery-system"

// Demo data for visualizations
const searchTypePerformance = [
  { type: "Text", queries: 1245, avgTime: 0.1, accuracy: 98, satisfaction: 95 },
  { type: "Visual", queries: 234, avgTime: 2.5, accuracy: 82, satisfaction: 88 },
  { type: "Audio", queries: 156, avgTime: 1.5, accuracy: 94, satisfaction: 91 },
  { type: "Metadata", queries: 789, avgTime: 0.05, accuracy: 100, satisfaction: 97 },
  { type: "Smart", queries: 456, avgTime: 1.0, accuracy: 96, satisfaction: 93 }
]

const searchTrends = [
  { day: "Mon", text: 234, visual: 45, audio: 23, metadata: 123, smart: 67 },
  { day: "Tue", text: 256, visual: 52, audio: 28, metadata: 145, smart: 78 },
  { day: "Wed", text: 278, visual: 48, audio: 31, metadata: 134, smart: 89 },
  { day: "Thu", text: 301, visual: 56, audio: 29, metadata: 156, smart: 95 },
  { day: "Fri", text: 312, visual: 61, audio: 35, metadata: 167, smart: 102 },
  { day: "Sat", text: 198, visual: 38, audio: 18, metadata: 98, smart: 56 },
  { day: "Sun", text: 167, visual: 32, audio: 15, metadata: 87, smart: 45 }
]

const filterUsage = [
  { filter: "Date Range", usage: 78, effectiveness: 92 },
  { filter: "Customer", usage: 65, effectiveness: 88 },
  { filter: "Occasion", usage: 82, effectiveness: 95 },
  { filter: "Status", usage: 45, effectiveness: 85 },
  { filter: "Quality", usage: 56, effectiveness: 90 },
  { filter: "Custom", usage: 23, effectiveness: 78 }
]

const savedSearches = [
  { name: "High-value birthdays", uses: 145, shares: 23, alerts: 12, lastUsed: "2h ago" },
  { name: "Recent anniversaries", uses: 89, shares: 15, alerts: 8, lastUsed: "1d ago" },
  { name: "Pending deliveries", uses: 234, shares: 34, alerts: 45, lastUsed: "5m ago" },
  { name: "Top-rated videos", uses: 67, shares: 12, alerts: 5, lastUsed: "3h ago" },
  { name: "This week's orders", uses: 312, shares: 45, alerts: 67, lastUsed: "1h ago" }
]

const discoveryMetrics = [
  { feature: "Related Content", clicks: 456, conversions: 123, rate: 27 },
  { feature: "Similar Style", clicks: 234, conversions: 67, rate: 29 },
  { feature: "Same Customer", clicks: 189, conversions: 78, rate: 41 },
  { feature: "Popular Videos", clicks: 567, conversions: 145, rate: 26 },
  { feature: "Trending Themes", clicks: 345, conversions: 98, rate: 28 }
]

const searchAccuracy = [
  { precision: 10, recall: 15, f1Score: 12 },
  { precision: 20, recall: 28, f1Score: 24 },
  { precision: 35, recall: 42, f1Score: 38 },
  { precision: 50, recall: 58, f1Score: 54 },
  { precision: 68, recall: 72, f1Score: 70 },
  { precision: 82, recall: 85, f1Score: 83 },
  { precision: 92, recall: 94, f1Score: 93 },
  { precision: 96, recall: 97, f1Score: 96 }
]

const searchSpeed = [
  { size: "100", text: 0.05, visual: 1.2, audio: 0.8, metadata: 0.02, smart: 0.5 },
  { size: "1K", text: 0.08, visual: 1.5, audio: 1.0, metadata: 0.03, smart: 0.6 },
  { size: "10K", text: 0.12, visual: 2.0, audio: 1.3, metadata: 0.05, smart: 0.8 },
  { size: "100K", text: 0.25, visual: 2.8, audio: 1.8, metadata: 0.08, smart: 1.2 },
  { size: "1M", text: 0.45, visual: 3.5, audio: 2.5, metadata: 0.15, smart: 1.8 }
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

export default function Phase339Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")

  const handleSearch = (query: string, filters: any, type: string) => {
    console.log("Search executed:", { query, filters, type })
  }

  const handleSaveSearch = (search: any) => {
    console.log("Search saved:", search)
  }

  const handleExportResults = (results: any[]) => {
    console.log("Exporting results:", results)
  }

  // Calculate totals
  const totalSearches = searchTypePerformance.reduce((sum, s) => sum + s.queries, 0)
  const avgAccuracy = searchTypePerformance.reduce((sum, s) => sum + s.accuracy, 0) / searchTypePerformance.length
  const totalSavedSearchUses = savedSearches.reduce((sum, s) => sum + s.uses, 0)
  const avgDiscoveryRate = discoveryMetrics.reduce((sum, d) => sum + d.rate, 0) / discoveryMetrics.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <NextLink href="/creator/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </NextLink>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Phase 3.3.9 Demo</h1>
                <p className="text-sm text-gray-600">Search & Discovery</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Search className="h-3 w-3 mr-1" />
                Search System
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-cyan-50 text-cyan-700">
                5 Search Types
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
            <TabsTrigger value="search-types" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Search Types
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
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
                  <Search className="h-5 w-5 text-blue-600" />
                  Search & Discovery Overview
                </CardTitle>
                <CardDescription>
                  Multi-type intelligent search with advanced filtering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Search Volume */}
                  <div>
                    <h4 className="font-semibold mb-4">Search Volume by Type</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={searchTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="text" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} name="Text" />
                          <Area type="monotone" dataKey="metadata" stackId="1" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.6} name="Metadata" />
                          <Area type="monotone" dataKey="smart" stackId="1" stroke={COLORS.tertiary} fill={COLORS.tertiary} fillOpacity={0.6} name="Smart" />
                          <Area type="monotone" dataKey="visual" stackId="1" stroke={COLORS.quaternary} fill={COLORS.quaternary} fillOpacity={0.6} name="Visual" />
                          <Area type="monotone" dataKey="audio" stackId="1" stroke={COLORS.quinary} fill={COLORS.quinary} fillOpacity={0.6} name="Audio" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Search Accuracy */}
                  <div>
                    <h4 className="font-semibold mb-4">Search Accuracy Metrics</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={searchAccuracy}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="precision" stroke={COLORS.primary} strokeWidth={2} name="Precision" />
                          <Line type="monotone" dataKey="recall" stroke={COLORS.secondary} strokeWidth={2} name="Recall" />
                          <Line type="monotone" dataKey="f1Score" stroke={COLORS.tertiary} strokeWidth={2} strokeDasharray="5 5" name="F1 Score" />
                        </LineChart>
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
                      <p className="text-sm text-gray-600">Total Searches</p>
                      <p className="text-2xl font-bold">{totalSearches.toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-1">This week</p>
                    </div>
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Accuracy</p>
                      <p className="text-2xl font-bold">{avgAccuracy.toFixed(0)}%</p>
                      <p className="text-xs text-purple-600 mt-1">Average</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Saved Searches</p>
                      <p className="text-2xl font-bold">{totalSavedSearchUses}</p>
                      <p className="text-xs text-orange-600 mt-1">Total uses</p>
                    </div>
                    <Bookmark className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Discovery Rate</p>
                      <p className="text-2xl font-bold">{avgDiscoveryRate.toFixed(0)}%</p>
                      <p className="text-xs text-green-600 mt-1">Conversion</p>
                    </div>
                    <Sparkles className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Search Types Tab */}
          <TabsContent value="search-types" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Type Performance</CardTitle>
                <CardDescription>
                  Comparison of 5 search capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={searchTypePerformance}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="type" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Accuracy" dataKey="accuracy" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} />
                      <Radar name="Satisfaction" dataKey="satisfaction" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Search Type Details */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { type: "Text", icon: FileText, speed: "Instant", accuracy: "High", scope: "Title, tags, notes", color: "bg-blue-500" },
                { type: "Visual", icon: Image, speed: "2-3 sec", accuracy: "Medium", scope: "Thumbnails, scenes", color: "bg-purple-500" },
                { type: "Audio", icon: Volume2, speed: "1-2 sec", accuracy: "High", scope: "Transcription", color: "bg-green-500" },
                { type: "Metadata", icon: Database, speed: "Instant", accuracy: "Perfect", scope: "All metadata", color: "bg-orange-500" },
                { type: "Smart", icon: Brain, speed: "1 sec", accuracy: "High", scope: "Everything", color: "bg-pink-500" }
              ].map((searchType) => {
                const Icon = searchType.icon
                return (
                  <Card key={searchType.type}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <div className={cn("p-1 rounded", searchType.color)}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        {searchType.type} Search
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Speed:</span>
                        <Badge variant="outline">{searchType.speed}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Accuracy:</span>
                        <Badge variant="secondary">{searchType.accuracy}</Badge>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Scope:</span>
                        <p className="mt-1">{searchType.scope}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Search Speed Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-green-600" />
                  Search Speed vs Library Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={searchSpeed}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="size" />
                      <YAxis label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="text" stroke={COLORS.primary} strokeWidth={2} name="Text" />
                      <Line type="monotone" dataKey="metadata" stroke={COLORS.secondary} strokeWidth={2} name="Metadata" />
                      <Line type="monotone" dataKey="smart" stroke={COLORS.tertiary} strokeWidth={2} name="Smart" />
                      <Line type="monotone" dataKey="audio" stroke={COLORS.quaternary} strokeWidth={2} name="Audio" />
                      <Line type="monotone" dataKey="visual" stroke={COLORS.quinary} strokeWidth={2} name="Visual" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Filters Tab */}
          <TabsContent value="filters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filter Usage & Effectiveness</CardTitle>
                <CardDescription>
                  Advanced filtering capabilities and their impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={filterUsage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="filter" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="usage" fill={COLORS.primary} name="Usage %" />
                      <Line type="monotone" dataKey="effectiveness" stroke={COLORS.success} strokeWidth={3} name="Effectiveness %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Filter Tree Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Filter Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Date Range */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date Range
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Last 7 days
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Last 30 days
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Last 90 days
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Last 365 days
                      </li>
                    </ul>
                  </div>

                  {/* Customer */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Name search
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Category filter
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Value segmentation
                      </li>
                    </ul>
                  </div>

                  {/* Occasion */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      Occasion
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        All occasion types
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Multiple selection
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Custom occasions
                      </li>
                    </ul>
                  </div>

                  {/* Status */}
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Status
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Draft
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Ready
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Delivered
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-orange-600" />
                  Popular Saved Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {savedSearches.map((search) => (
                    <div key={search.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h5 className="font-medium text-sm">{search.name}</h5>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{search.uses} uses</span>
                          <span>{search.shares} shares</span>
                          <span>{search.alerts} alerts</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {search.lastUsed}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Discovery Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Discovery Feature Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={discoveryMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="feature" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="clicks" fill={COLORS.primary} name="Clicks" />
                      <Bar dataKey="conversions" fill={COLORS.success} name="Conversions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid md:grid-cols-5 gap-3 mt-4">
                  {discoveryMetrics.map((metric) => (
                    <div key={metric.feature} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium">{metric.feature}</p>
                      <p className="text-2xl font-bold text-purple-600">{metric.rate}%</p>
                      <p className="text-xs text-gray-500">conversion</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Search Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Search Insights & Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Peak Search Time:</strong> 2-4 PM shows 45% higher search volume with birthday-related queries dominating
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <strong>User Behavior:</strong> 78% of users combine text search with date filters for precise results
                  </AlertDescription>
                </Alert>

                <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Smart Search:</strong> Natural language queries have 93% satisfaction rate, 15% higher than traditional search
                  </AlertDescription>
                </Alert>

                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <Bookmark className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Saved Searches:</strong> Users with saved searches are 3x more likely to complete bookings
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Search Optimization */}
            <Card>
              <CardHeader>
                <CardTitle>Search Optimization Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                        <Zap className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Enable Visual Search</p>
                        <p className="text-xs text-gray-500">28% of users want to search by image</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50">High Impact</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                        <Mic className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Add Voice Search</p>
                        <p className="text-xs text-gray-500">Mobile users prefer voice input</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50">Medium Impact</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded">
                        <Bell className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Search Alerts</p>
                        <p className="text-xs text-gray-500">Notify users of new matching content</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-purple-50">High Impact</Badge>
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
                <strong>Interactive Demo:</strong> Experience the complete Search & Discovery system with 
                5 search types (Text, Visual, Audio, Metadata, Smart), advanced filters, 
                saved searches, and discovery features.
              </AlertDescription>
            </Alert>

            <SearchDiscoverySystem
              onSearch={handleSearch}
              onSaveSearch={handleSaveSearch}
              onExportResults={handleExportResults}
              enableVisualSearch={true}
              enableAudioSearch={true}
              enableSmartSuggestions={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}