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
  ComposedChart,
  ScatterChart,
  Scatter,
  ReferenceLine
} from "recharts"
import {
  ArrowLeft,
  Trophy,
  Crown,
  Medal,
  Award,
  Star,
  Users,
  User,
  UserCheck,
  Clock,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Gauge,
  Timer,
  DollarSign,
  Percent,
  Hash,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Shield,
  ShieldCheck,
  Brain,
  Lightbulb,
  Sparkles,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Flag,
  Bell,
  Globe
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ComparativeAnalytics } from "@/components/creator/analytics/comparative-analytics"

// Demo data for visualizations
const comparisonTypesData = [
  { type: "Historical Self", baseline: "Previous period", privacy: "Private", motivation: "Progress tracking", color: "#06B6D4" },
  { type: "Category Average", baseline: "Same category", privacy: "Anonymous", motivation: "Market position", color: "#3B82F6" },
  { type: "Top Performers", baseline: "Top 10%", privacy: "Anonymous", motivation: "Aspiration", color: "#10B981" },
  { type: "Similar Creators", baseline: "Peer group", privacy: "Anonymous", motivation: "Competition", color: "#EC4899" },
  { type: "Platform Average", baseline: "All creators", privacy: "Anonymous", motivation: "Context", color: "#6B7280" }
]

const competitiveMetricsData = [
  { metric: "Response Time", you: 2, avg: 5, percentile: 95, status: "Excellent" },
  { metric: "Completion Rate", you: 98, avg: 92, percentile: 88, status: "Excellent" },
  { metric: "Average Rating", you: 4.8, avg: 4.5, percentile: 82, status: "Good" },
  { metric: "Pricing", you: 150, avg: 120, percentile: 75, status: "Good" },
  { metric: "Booking Rate", you: 45, avg: 35, percentile: 78, status: "Good" }
]

const benchmarkComparisonData = [
  { metric: "Response Time", you: 2, categoryAvg: 5, topPerformers: 1.5, platformAvg: 6 },
  { metric: "Completion Rate", you: 98, categoryAvg: 92, topPerformers: 99, platformAvg: 88 },
  { metric: "Rating", you: 4.8, categoryAvg: 4.5, topPerformers: 4.9, platformAvg: 4.3 },
  { metric: "Booking Rate", you: 45, categoryAvg: 35, topPerformers: 65, platformAvg: 30 },
  { metric: "Revenue", you: 150, categoryAvg: 120, topPerformers: 200, platformAvg: 100 }
]

const performanceGapsData = [
  { metric: "Booking Rate", current: 45, target: 65, gap: 20, priority: "High" },
  { metric: "AOV", current: 150, target: 200, gap: 50, priority: "High" },
  { metric: "Repeat Rate", current: 58, target: 70, gap: 12, priority: "Medium" },
  { metric: "Rating", current: 4.8, target: 4.9, gap: 0.1, priority: "Low" }
]

const peerRankingData = [
  { category: "Overall", rank: 12, total: 150, percentile: 92 },
  { category: "Revenue", rank: 8, total: 85, percentile: 91 },
  { category: "Customer Satisfaction", rank: 15, total: 150, percentile: 90 },
  { category: "Response Time", rank: 5, total: 150, percentile: 97 },
  { category: "Growth Rate", rank: 18, total: 150, percentile: 88 }
]

const historicalComparisonData = [
  { month: "Jan", current: 78, previous: 72, yearAgo: 65 },
  { month: "Feb", current: 82, previous: 75, yearAgo: 68 },
  { month: "Mar", current: 85, previous: 78, yearAgo: 70 },
  { month: "Apr", current: 88, previous: 80, yearAgo: 72 },
  { month: "May", current: 92, previous: 84, yearAgo: 75 },
  { month: "Jun", current: 95, previous: 86, yearAgo: 78 }
]

const radarComparisonData = [
  { metric: "Speed", you: 95, peers: 75, top: 98 },
  { metric: "Quality", you: 98, peers: 92, top: 99 },
  { metric: "Price", you: 75, peers: 60, top: 90 },
  { metric: "Service", you: 96, peers: 90, top: 98 },
  { metric: "Growth", you: 82, peers: 70, top: 95 },
  { metric: "Loyalty", you: 88, peers: 80, top: 94 }
]

const percentileDistributionData = [
  { range: "0-20%", count: 30, color: "#EF4444" },
  { range: "20-40%", count: 25, color: "#F97316" },
  { range: "40-60%", count: 20, color: "#F59E0B" },
  { range: "60-80%", count: 15, color: "#3B82F6" },
  { range: "80-100%", count: 10, color: "#10B981" }
]

const COLORS = {
  you: "#8B5CF6",
  average: "#3B82F6",
  top: "#10B981",
  platform: "#6B7280",
  excellent: "#10B981",
  good: "#3B82F6",
  average_color: "#F59E0B",
  below: "#F97316",
  poor: "#EF4444"
}

export default function Phase327Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [timeRange, setTimeRange] = React.useState<"7" | "30" | "90" | "365">("30")
  const [comparisonType, setComparisonType] = React.useState<"historical_self" | "category_average" | "top_performers" | "similar_creators" | "platform_average">("category_average")

  const handleTimeRangeChange = (range: "7" | "30" | "90" | "365") => {
    setTimeRange(range)
  }

  const handleComparisonTypeChange = (type: "historical_self" | "category_average" | "top_performers" | "similar_creators" | "platform_average") => {
    setComparisonType(type)
  }

  const handleMetricClick = (metricId: string) => {
    console.log("Metric clicked:", metricId)
  }

  const handleInsightAction = (insightId: string) => {
    console.log("Insight action:", insightId)
  }

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
                <h1 className="text-xl font-semibold">Phase 3.2.7 Demo</h1>
                <p className="text-sm text-gray-600">Comparative Analytics</p>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Benchmarking
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                Performance Context
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
              <Trophy className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="benchmarks" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Benchmarks
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Analysis
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
                  <Trophy className="h-5 w-5 text-purple-600" />
                  Comparative Analytics Framework
                </CardTitle>
                <CardDescription>
                  Five comparison types with privacy-aware benchmarking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Comparison Types */}
                  <div>
                    <h4 className="font-semibold mb-4">Comparison Frameworks</h4>
                    <div className="space-y-3">
                      {comparisonTypesData.map((type, index) => (
                        <motion.div
                          key={type.type}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: type.color }}
                              />
                              <h5 className="font-medium">{type.type}</h5>
                            </div>
                            <Badge variant="outline">
                              {type.privacy}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Baseline: {type.baseline}</div>
                            <div>Motivation: {type.motivation}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Competitive Intelligence */}
                  <div>
                    <h4 className="font-semibold mb-4">Competitive Intelligence</h4>
                    <div className="space-y-3">
                      {competitiveMetricsData.map((metric, index) => (
                        <motion.div
                          key={metric.metric}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-white dark:bg-gray-900 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{metric.metric}</span>
                            <Badge 
                              variant="outline"
                              className={cn(
                                metric.status === "Excellent" && "text-green-600 border-green-300",
                                metric.status === "Good" && "text-blue-600 border-blue-300"
                              )}
                            >
                              {metric.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              You: {metric.you} | Avg: {metric.avg}
                            </span>
                            <span className="font-medium">Top {100 - metric.percentile}%</span>
                          </div>
                          <Progress value={metric.percentile} className="h-2 mt-1" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Percentile Distribution & Peer Ranking */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-green-600" />
                    Percentile Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={percentileDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="count"
                          nameKey="range"
                        >
                          {percentileDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${value}%`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Medal className="h-5 w-5 text-yellow-600" />
                    Peer Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {peerRankingData.map((rank, index) => (
                      <motion.div
                        key={rank.category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{rank.category}</div>
                          <div className="text-sm text-gray-600">
                            Rank #{rank.rank} of {rank.total}
                          </div>
                        </div>
                        <Badge 
                          className={cn(
                            rank.percentile >= 95 && "bg-green-100 text-green-800",
                            rank.percentile >= 90 && rank.percentile < 95 && "bg-blue-100 text-blue-800",
                            rank.percentile < 90 && "bg-yellow-100 text-yellow-800"
                          )}
                        >
                          Top {100 - rank.percentile}%
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Benchmarks Tab */}
          <TabsContent value="benchmarks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Multi-Level Benchmarking
                </CardTitle>
                <CardDescription>
                  Compare your performance across different baselines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={benchmarkComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="you" fill={COLORS.you} name="You" />
                      <Bar dataKey="categoryAvg" fill={COLORS.average} name="Category Avg" />
                      <Bar dataKey="topPerformers" fill={COLORS.top} name="Top 10%" />
                      <Bar dataKey="platformAvg" fill={COLORS.platform} name="Platform Avg" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Historical Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-cyan-600" />
                    Historical Self-Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="current"
                          stroke={COLORS.you}
                          strokeWidth={3}
                          name="Current"
                        />
                        <Line
                          type="monotone"
                          dataKey="previous"
                          stroke={COLORS.average}
                          strokeWidth={2}
                          name="Previous Period"
                        />
                        <Line
                          type="monotone"
                          dataKey="yearAgo"
                          stroke={COLORS.platform}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Year Ago"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Radar Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-pink-600" />
                    Peer Group Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarComparisonData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="You"
                          dataKey="you"
                          stroke={COLORS.you}
                          fill={COLORS.you}
                          fillOpacity={0.3}
                        />
                        <Radar
                          name="Peers"
                          dataKey="peers"
                          stroke={COLORS.average}
                          fill={COLORS.average}
                          fillOpacity={0.1}
                        />
                        <Radar
                          name="Top 10%"
                          dataKey="top"
                          stroke={COLORS.top}
                          fill={COLORS.top}
                          fillOpacity={0.1}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  Performance Gap Analysis
                </CardTitle>
                <CardDescription>
                  Identify gaps between current performance and top performer benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceGapsData.map((gap, index) => (
                    <motion.div
                      key={gap.metric}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{gap.metric}</h5>
                        <Badge 
                          variant={gap.priority === "High" ? "destructive" : 
                                 gap.priority === "Medium" ? "default" : "secondary"}
                          className={cn(
                            gap.priority === "High" && "bg-red-100 text-red-800",
                            gap.priority === "Medium" && "bg-yellow-100 text-yellow-800",
                            gap.priority === "Low" && "bg-green-100 text-green-800"
                          )}
                        >
                          {gap.priority} Priority
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Current: </span>
                          <span className="font-medium">{gap.current}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Target: </span>
                          <span className="font-medium text-green-600">{gap.target}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Gap: </span>
                          <span className="font-medium text-orange-600">{gap.gap}</span>
                        </div>
                      </div>
                      <Progress 
                        value={(gap.current / gap.target) * 100} 
                        className="h-2"
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benchmarking Strategy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Benchmarking Strategy Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3">Privacy Protection</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Historical self-comparison is private",
                        "Category averages are anonymized",
                        "Peer comparisons protect identities",
                        "Platform-wide metrics aggregated"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3">Motivation & Context</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Progress tracking for self-improvement",
                        "Market position understanding",
                        "Aspirational benchmarks from top 10%",
                        "Competitive intelligence insights"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600" />
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
                <strong>Interactive Demo:</strong> Experience the complete Comparative Analytics system with 
                5 comparison frameworks, competitive intelligence display, performance gap analysis, and 
                peer group benchmarking. All features include privacy-aware comparisons and percentile rankings.
              </AlertDescription>
            </Alert>

            <ComparativeAnalytics
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
              comparisonType={comparisonType}
              onComparisonTypeChange={handleComparisonTypeChange}
              onMetricClick={handleMetricClick}
              onInsightAction={handleInsightAction}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}