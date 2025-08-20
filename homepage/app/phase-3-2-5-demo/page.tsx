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
  Video,
  PlayCircle,
  Clock,
  Star,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Share2,
  Heart,
  MessageSquare,
  Target,
  Zap,
  Award,
  Brain,
  Lightbulb,
  Activity,
  BarChart3,
  PieChart as PieIcon,
  Filter,
  Calendar,
  Timer,
  Users,
  ThumbsUp,
  Download,
  RefreshCw,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Plus,
  Minus,
  Search,
  SortAsc,
  SortDesc,
  Sparkles,
  Crown,
  Gift,
  Package,
  Truck,
  CreditCard,
  Receipt,
  FileText,
  Gauge,
  Flame,
  Navigation,
  MapPin,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Scissors,
  Palette,
  Music,
  Camera,
  Mic,
  Upload,
  Film,
  Edit3,
  Save,
  Archive,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ContentPerformanceAnalytics } from "@/components/creator/analytics/content-performance-analytics"

// Demo data for visualizations
const contentMetricsOverview = [
  { metric: "Completion Rate", value: 78.5, target: 85, category: "Engagement", color: "#10B981" },
  { metric: "Average Rating", value: 4.6, target: 4.8, category: "Quality", color: "#3B82F6" },
  { metric: "Production Time", value: 45, target: 35, category: "Efficiency", color: "#8B5CF6" },
  { metric: "Earnings per Video", value: 125, target: 150, category: "Revenue", color: "#F59E0B" },
  { metric: "Trending Topics", value: 15, target: 20, category: "Trends", color: "#EC4899" }
]

const performanceMatrixData = [
  { zone: "A (Optimize)", count: 3, description: "High Performance, High Effort", color: "#10B981" },
  { zone: "B (Selective)", count: 2, description: "High Performance, Low Effort", color: "#F59E0B" },
  { zone: "C (Scale)", count: 1, description: "Low Performance, High Effort", color: "#3B82F6" },
  { zone: "D (Eliminate)", count: 2, description: "Low Performance, Low Effort", color: "#EF4444" }
]

const videoPerformanceData = [
  { title: "Birthday Wishes", performance: 92, effort: 35, earnings: 85, zone: "C" },
  { title: "Wedding Anniversary", performance: 88, effort: 65, earnings: 150, zone: "B" },
  { title: "Graduation Congrats", performance: 85, effort: 40, earnings: 100, zone: "A" },
  { title: "Holiday Greetings", performance: 65, effort: 25, earnings: 50, zone: "D" },
  { title: "Business Motivation", performance: 70, effort: 85, earnings: 120, zone: "D" }
]

const successPatternsData = [
  { pattern: "90-120 Second Videos", frequency: 35, performance: 87.2, confidence: 92 },
  { pattern: "Personal Milestones", frequency: 48, performance: 91.5, confidence: 95 },
  { pattern: "Story + Message Format", frequency: 42, performance: 89.8, confidence: 88 },
  { pattern: "Cultural References", frequency: 28, performance: 94.1, confidence: 97 },
  { pattern: "High Energy Opening", frequency: 52, performance: 86.3, confidence: 89 }
]

const improvementOpportunitiesData = [
  { category: "Business Videos", impact: 25, severity: "High", effort: "Medium", timeframe: "2-3 weeks" },
  { category: "Audio Quality", impact: 18, severity: "Medium", effort: "Low", timeframe: "1 week" },
  { category: "Production Time", impact: 22, severity: "Medium", effort: "Medium", timeframe: "2-4 weeks" },
  { category: "Feedback Integration", impact: 15, severity: "Low", effort: "Low", timeframe: "1-2 weeks" },
  { category: "Market Positioning", impact: 30, severity: "Low", effort: "High", timeframe: "1-2 months" }
]

const engagementTrendsData = [
  { month: "Jan", completion: 72, rating: 4.2, earnings: 95 },
  { month: "Feb", completion: 75, rating: 4.3, earnings: 105 },
  { month: "Mar", completion: 78, rating: 4.4, earnings: 115 },
  { month: "Apr", completion: 81, rating: 4.5, earnings: 120 },
  { month: "May", completion: 78, rating: 4.6, earnings: 125 }
]

const contentCategoriesData = [
  { name: "Birthday", count: 15, avgRating: 4.8, earnings: 1275, color: "#10B981" },
  { name: "Anniversary", count: 8, avgRating: 4.9, earnings: 1200, color: "#3B82F6" },
  { name: "Graduation", count: 6, avgRating: 4.7, earnings: 600, color: "#8B5CF6" },
  { name: "Holiday", count: 4, avgRating: 4.2, earnings: 200, color: "#F59E0B" },
  { name: "Business", count: 5, avgRating: 4.3, earnings: 600, color: "#EC4899" }
]

const productionEfficiencyData = [
  { type: "Standard", time: 35, revenue: 85, efficiency: 2.4 },
  { type: "Express", time: 45, revenue: 120, efficiency: 2.7 },
  { type: "Premium", time: 65, revenue: 150, efficiency: 2.3 },
  { type: "Extended", time: 85, revenue: 180, efficiency: 2.1 },
  { type: "Rush", time: 25, revenue: 100, efficiency: 4.0 }
]

const COLORS = {
  engagement: "#10B981",
  quality: "#3B82F6", 
  efficiency: "#8B5CF6",
  revenue: "#F59E0B",
  trends: "#EC4899",
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981"
}

export default function Phase325Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [timeRange, setTimeRange] = React.useState<"7" | "30" | "90" | "365">("30")

  const handleMetricClick = (metricId: string) => {
    console.log("Metric clicked:", metricId)
  }

  const handleVideoSelect = (videoId: string) => {
    console.log("Video selected:", videoId)
  }

  const handlePatternAnalyze = (patternId: string) => {
    console.log("Pattern analyzed:", patternId)
  }

  const handleOpportunityImplement = (opportunityId: string) => {
    console.log("Opportunity implemented:", opportunityId)
  }

  const handleTimeRangeChange = (range: "7" | "30" | "90" | "365") => {
    setTimeRange(range)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.2.5 Demo</h1>
                <p className="text-sm text-gray-600">Content Performance Analytics</p>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Video Analytics
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-pink-50 text-pink-700">
                Content Strategy
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
              <Video className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="matrix" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Matrix
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Insights
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
                  <Video className="h-5 w-5 text-purple-600" />
                  Content Performance Framework
                </CardTitle>
                <CardDescription>
                  Five key metrics categories with performance matrix and optimization insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Content Metrics Overview */}
                  <div>
                    <h4 className="font-semibold mb-4">Content Metrics Categories</h4>
                    <div className="space-y-3">
                      {contentMetricsOverview.map((metric, index) => (
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
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: metric.color }}
                              />
                              <h5 className="font-medium">{metric.metric}</h5>
                            </div>
                            <Badge variant="outline" style={{ color: metric.color }}>
                              {metric.category}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              Current: {metric.metric.includes("Time") ? `${metric.value}min` :
                                        metric.metric.includes("Rating") ? metric.value.toFixed(1) :
                                        metric.metric.includes("Earnings") ? `$${metric.value}` :
                                        metric.metric.includes("Topics") ? metric.value :
                                        `${metric.value}%`}
                            </span>
                            <span className="font-medium">
                              Target: {metric.metric.includes("Time") ? `${metric.target}min` :
                                      metric.metric.includes("Rating") ? metric.target.toFixed(1) :
                                      metric.metric.includes("Earnings") ? `$${metric.target}` :
                                      metric.metric.includes("Topics") ? metric.target :
                                      `${metric.target}%`}
                            </span>
                          </div>
                          <Progress 
                            value={metric.metric.includes("Time") 
                              ? (metric.target / metric.value) * 100 // Invert for time (lower is better)
                              : (metric.value / metric.target) * 100} 
                            className="h-2 mt-1" 
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Visualization Types */}
                  <div>
                    <h4 className="font-semibold mb-4">Analytics Visualizations</h4>
                    <div className="space-y-3">
                      {[
                        { type: "Line Graph", usage: "Completion rate trends", icon: Activity, color: "text-green-600" },
                        { type: "Bar Chart", usage: "Rating distribution analysis", icon: BarChart3, color: "text-blue-600" },
                        { type: "Gauge Chart", usage: "Production time efficiency", icon: Gauge, color: "text-purple-600" },
                        { type: "Stacked Bar", usage: "Earnings by video type", icon: DollarSign, color: "text-yellow-600" },
                        { type: "Word Cloud", usage: "Popular theme identification", icon: Brain, color: "text-pink-600" }
                      ].map(({ type, usage, icon: Icon, color }) => (
                        <div key={type} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
                          <Icon className={cn("h-5 w-5", color)} />
                          <div className="flex-1">
                            <div className="font-medium">{type}</div>
                            <div className="text-sm text-gray-600">{usage}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Categories & Performance Trends */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieIcon className="h-5 w-5 text-blue-600" />
                    Content Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={contentCategoriesData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="count"
                          nameKey="name"
                        >
                          {contentCategoriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${value} videos`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={engagementTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="completion"
                          stroke={COLORS.engagement}
                          strokeWidth={2}
                          name="Completion Rate (%)"
                        />
                        <Line
                          type="monotone"
                          dataKey="rating"
                          stroke={COLORS.quality}
                          strokeWidth={2}
                          name="Avg Rating"
                        />
                        <Line
                          type="monotone"
                          dataKey="earnings"
                          stroke={COLORS.revenue}
                          strokeWidth={2}
                          name="Earnings ($)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Matrix Tab */}
          <TabsContent value="matrix" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Performance vs Effort Matrix
                </CardTitle>
                <CardDescription>
                  Strategic categorization of content for optimization decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={videoPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="effort" 
                        name="Effort (minutes)" 
                        domain={[0, 100]}
                        label={{ value: 'Production Effort (minutes)', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        dataKey="performance" 
                        name="Performance (%)" 
                        domain={[50, 100]}
                        label={{ value: 'Performance (%)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          name === 'effort' ? `${value} min` : `${value}%`,
                          name === 'effort' ? 'Production Time' : 'Performance'
                        ]}
                        labelFormatter={(label: string, payload: any) => 
                          payload && payload[0] ? payload[0].payload.title : ''
                        }
                      />
                      <Scatter 
                        dataKey="performance" 
                        fill={COLORS.efficiency}
                        name="Videos"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4 mt-6">
                  {performanceMatrixData.map((zone) => (
                    <Card key={zone.zone} className="p-4">
                      <div className="text-center">
                        <div 
                          className="text-2xl font-bold mb-1"
                          style={{ color: zone.color }}
                        >
                          {zone.count}
                        </div>
                        <div className="text-sm text-gray-600">{zone.zone}</div>
                        <div className="text-xs text-gray-500 mt-1">{zone.description}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Production Efficiency Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Production Efficiency Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productionEfficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar 
                        yAxisId="left"
                        dataKey="time" 
                        fill={COLORS.efficiency} 
                        name="Production Time (min)"
                      />
                      <Bar 
                        yAxisId="right"
                        dataKey="efficiency" 
                        fill={COLORS.revenue} 
                        name="Efficiency Ratio"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Success Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    Success Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {successPatternsData.map((pattern, index) => (
                      <motion.div
                        key={pattern.pattern}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{pattern.pattern}</h5>
                          <Badge variant="outline" className="text-blue-600">
                            {pattern.confidence}% confidence
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Frequency: </span>
                            <span className="font-medium">{pattern.frequency}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Performance: </span>
                            <span className="font-medium">{pattern.performance.toFixed(1)}%</span>
                          </div>
                        </div>
                        <Progress value={pattern.performance} className="h-2 mt-2" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Improvement Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Improvement Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {improvementOpportunitiesData.map((opportunity, index) => (
                      <motion.div
                        key={opportunity.category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{opportunity.category}</h5>
                          <Badge 
                            variant={opportunity.severity === "High" ? "destructive" : 
                                   opportunity.severity === "Medium" ? "default" : "secondary"}
                            className={cn(
                              opportunity.severity === "High" && "bg-red-100 text-red-800",
                              opportunity.severity === "Medium" && "bg-yellow-100 text-yellow-800",
                              opportunity.severity === "Low" && "bg-green-100 text-green-800"
                            )}
                          >
                            {opportunity.severity} priority
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Impact: </span>
                            <span className="font-medium text-green-600">+{opportunity.impact}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Effort: </span>
                            <span className="font-medium">{opportunity.effort}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Timeline: </span>
                            <span className="font-medium">{opportunity.timeframe}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Insights Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Content Insights Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3">Success Pattern Analysis</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Top performing videos identification",
                        "Common elements pattern recognition", 
                        "Optimal length analysis",
                        "Best occasions and formats",
                        "Winning themes and styles"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3">Improvement Opportunities</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Underperforming categories analysis",
                        "Quality issues identification",
                        "Delivery delays tracking",
                        "Customer feedback integration",
                        "Competitive gap analysis"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-orange-600" />
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
            <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Content Performance Analytics system with 
                5 content metrics categories, performance matrix visualization, success pattern analysis, and 
                improvement opportunities identification. All features include optimization insights and action triggers.
              </AlertDescription>
            </Alert>

            <ContentPerformanceAnalytics
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
              onMetricClick={handleMetricClick}
              onVideoSelect={handleVideoSelect}
              onPatternAnalyze={handlePatternAnalyze}
              onOpportunityImplement={handleOpportunityImplement}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}