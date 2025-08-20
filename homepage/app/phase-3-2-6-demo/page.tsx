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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ReferenceLine
} from "recharts"
import {
  ArrowLeft,
  Brain,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Zap,
  AlertTriangle,
  Lightbulb,
  Eye,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Settings,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Award,
  Crown,
  Gift,
  Heart,
  MessageSquare,
  Share2,
  Users,
  DollarSign,
  Calculator,
  PieChart as PieIcon,
  BarChart2,
  BarChart3,
  Gauge,
  Timer,
  RefreshCw,
  Download,
  Upload,
  Sparkles,
  Flame,
  Snowflake,
  Sun,
  Cloud,
  CloudRain,
  Navigation,
  MapPin,
  Globe,
  Video,
  PlayCircle,
  Music,
  Camera,
  Image,
  Film,
  FileText,
  File,
  Folder,
  Archive,
  Package,
  Box,
  ShoppingBag,
  CreditCard,
  Receipt,
  Tag,
  Bookmark,
  Flag,
  Bell,
  BellOff,
  Mail,
  Send,
  Inbox,
  Trash,
  Edit,
  Save,
  Copy
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TrendAnalysisPredictions } from "@/components/creator/analytics/trend-analysis-predictions"

// Demo data for visualizations
const trendDetectionOverview = [
  { type: "Seasonal", count: 3, status: "Normal", threshold: "±20%", color: "#3B82F6" },
  { type: "Growth", count: 2, status: "Warning", threshold: "±15%", color: "#10B981" },
  { type: "Anomaly", count: 1, status: "Alert", threshold: "3σ", color: "#EF4444" },
  { type: "Emerging", count: 4, status: "Normal", threshold: "50%+", color: "#8B5CF6" },
  { type: "Declining", count: 1, status: "Critical", threshold: "-25%", color: "#F59E0B" }
]

const predictionAccuracyData = [
  { category: "Demand", accuracy: 92, confidence: 87, timeframe: "7 days" },
  { category: "Revenue", accuracy: 89, confidence: 85, timeframe: "30 days" },
  { category: "Engagement", accuracy: 84, confidence: 79, timeframe: "14 days" },
  { category: "Growth", accuracy: 86, confidence: 91, timeframe: "90 days" },
  { category: "Risk", accuracy: 78, confidence: 73, timeframe: "30 days" }
]

const seasonalPatternsData = [
  { month: "Jan", requests: 85, revenue: 6800, variance: -12 },
  { month: "Feb", requests: 120, revenue: 9600, variance: 15 },
  { month: "Mar", requests: 95, revenue: 7600, variance: -8 },
  { month: "Apr", requests: 110, revenue: 8800, variance: 12 },
  { month: "May", requests: 130, revenue: 10400, variance: 18 },
  { month: "Jun", requests: 105, revenue: 8400, variance: -3 },
  { month: "Jul", requests: 140, revenue: 11200, variance: 25 },
  { month: "Aug", requests: 135, revenue: 10800, variance: 20 },
  { month: "Sep", requests: 115, revenue: 9200, variance: 8 },
  { month: "Oct", requests: 125, revenue: 10000, variance: 15 },
  { month: "Nov", requests: 160, revenue: 12800, variance: 35 },
  { month: "Dec", requests: 190, revenue: 15200, variance: 45 }
]

const anomalyDetectionData = [
  { time: "00:00", normal: 15, actual: 12, threshold: 25 },
  { time: "04:00", normal: 8, actual: 6, threshold: 20 },
  { time: "08:00", normal: 45, actual: 48, threshold: 65 },
  { time: "12:00", normal: 85, actual: 92, threshold: 110 },
  { time: "16:00", normal: 125, actual: 245, threshold: 150 }, // Anomaly spike
  { time: "20:00", normal: 95, actual: 88, threshold: 120 },
  { time: "24:00", normal: 25, actual: 22, threshold: 40 }
]

const emergingTrendsData = [
  { keyword: "Business Videos", growth: 60.7, volume: 45, confidence: 76 },
  { keyword: "Virtual Events", growth: 85.2, volume: 28, confidence: 82 },
  { keyword: "Remote Celebrations", growth: 42.3, volume: 65, confidence: 89 },
  { keyword: "Corporate Messages", growth: 38.9, volume: 32, confidence: 71 },
  { keyword: "Educational Content", growth: 55.4, volume: 18, confidence: 68 }
]

const forecastAccuracyData = [
  { period: "Week 1", predicted: 47, actual: 45, accuracy: 96 },
  { period: "Week 2", predicted: 52, actual: 49, accuracy: 94 },
  { period: "Week 3", predicted: 48, actual: 51, accuracy: 94 },
  { period: "Week 4", predicted: 55, actual: 53, accuracy: 96 },
  { period: "Week 5", predicted: 58, actual: null, accuracy: null } // Future prediction
]

const alertPriorityData = [
  { severity: "Critical", count: 1, color: "#EF4444" },
  { severity: "High", count: 2, color: "#F97316" },
  { severity: "Medium", count: 3, color: "#F59E0B" },
  { severity: "Low", count: 5, color: "#10B981" }
]

const trendVisualizationTypes = [
  { type: "Overlay Lines", usage: "Seasonal year-over-year comparison", icon: Activity, color: "text-blue-600" },
  { type: "Trend Arrows", usage: "Growth direction indicators", icon: TrendingUp, color: "text-green-600" },
  { type: "Spike Indicators", usage: "Real-time anomaly detection", icon: Zap, color: "text-red-600" },
  { type: "Rising Keywords", usage: "Emerging trend identification", icon: ArrowUp, color: "text-purple-600" },
  { type: "Falling Graphs", usage: "Declining pattern visualization", icon: TrendingDown, color: "text-yellow-600" }
]

const COLORS = {
  seasonal: "#3B82F6",
  growth: "#10B981", 
  anomaly: "#EF4444",
  emerging: "#8B5CF6",
  declining: "#F59E0B",
  prediction: "#06B6D4",
  normal: "#10B981",
  warning: "#F59E0B",
  alert: "#EF4444",
  critical: "#DC2626"
}

export default function Phase326Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [timeRange, setTimeRange] = React.useState<"7" | "30" | "90" | "365">("30")

  const handleTrendClick = (trendId: string) => {
    console.log("Trend clicked:", trendId)
  }

  const handleForecastUpdate = (forecastId: string) => {
    console.log("Forecast updated:", forecastId)
  }

  const handleAlertAction = (alertId: string, action: string) => {
    console.log("Alert action:", alertId, action)
  }

  const handleTimeRangeChange = (range: "7" | "30" | "90" | "365") => {
    setTimeRange(range)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.2.6 Demo</h1>
                <p className="text-sm text-gray-600">Trend Analysis & Predictions</p>
              </div>
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                Predictive Analytics
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Trend Intelligence
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
              <Brain className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="detection" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Detection
            </TabsTrigger>
            <TabsTrigger value="forecasting" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Forecasting
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
                  <Brain className="h-5 w-5 text-cyan-600" />
                  Trend Analysis Framework
                </CardTitle>
                <CardDescription>
                  Five-type detection system with predictive analytics and alert thresholds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Trend Detection Types */}
                  <div>
                    <h4 className="font-semibold mb-4">Detection Framework</h4>
                    <div className="space-y-3">
                      {trendDetectionOverview.map((trend, index) => (
                        <motion.div
                          key={trend.type}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: trend.color }}
                              />
                              <h5 className="font-medium">{trend.type}</h5>
                            </div>
                            <Badge 
                              variant="outline"
                              className={cn(
                                trend.status === "Normal" && "text-green-600",
                                trend.status === "Warning" && "text-yellow-600",
                                trend.status === "Alert" && "text-orange-600",
                                trend.status === "Critical" && "text-red-600"
                              )}
                            >
                              {trend.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Threshold: {trend.threshold}</span>
                            <span className="font-medium">{trend.count} detected</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Visualization Types */}
                  <div>
                    <h4 className="font-semibold mb-4">Visualization Types</h4>
                    <div className="space-y-3">
                      {trendVisualizationTypes.map(({ type, usage, icon: Icon, color }) => (
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

            {/* Prediction Accuracy & Alert Priorities */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Prediction Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={predictionAccuracyData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Accuracy"
                          dataKey="accuracy"
                          stroke={COLORS.growth}
                          fill={COLORS.growth}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Radar
                          name="Confidence"
                          dataKey="confidence"
                          stroke={COLORS.prediction}
                          fill={COLORS.prediction}
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Alert Priorities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={alertPriorityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="count"
                          nameKey="severity"
                        >
                          {alertPriorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${value} alerts`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trend Detection Tab */}
          <TabsContent value="detection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Seasonal Pattern Analysis
                </CardTitle>
                <CardDescription>
                  Year-over-year seasonal trends with variance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={seasonalPatternsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="requests"
                        fill={COLORS.seasonal}
                        fillOpacity={0.3}
                        stroke={COLORS.seasonal}
                        name="Requests"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="variance"
                        fill={COLORS.growth}
                        name="Variance (%)"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Anomaly Detection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-red-600" />
                    Anomaly Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={anomalyDetectionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="normal"
                          stroke={COLORS.normal}
                          strokeWidth={2}
                          name="Normal Range"
                        />
                        <Line
                          type="monotone"
                          dataKey="actual"
                          stroke={COLORS.anomaly}
                          strokeWidth={3}
                          name="Actual Values"
                        />
                        <Line
                          type="monotone"
                          dataKey="threshold"
                          stroke={COLORS.warning}
                          strokeDasharray="5 5"
                          name="Alert Threshold"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Emerging Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUp className="h-5 w-5 text-purple-600" />
                    Emerging Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emergingTrendsData.map((trend, index) => (
                      <motion.div
                        key={trend.keyword}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{trend.keyword}</h5>
                          <Badge className="bg-purple-100 text-purple-800">
                            +{trend.growth.toFixed(1)}% growth
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Volume: </span>
                            <span className="font-medium">{trend.volume}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Confidence: </span>
                            <span className="font-medium">{trend.confidence}%</span>
                          </div>
                        </div>
                        <Progress value={trend.confidence} className="h-2 mt-2" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Forecasting Tab */}
          <TabsContent value="forecasting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  Forecast Accuracy Tracking
                </CardTitle>
                <CardDescription>
                  Comparing predictions vs actual results to improve model accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={forecastAccuracyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar
                        yAxisId="left"
                        dataKey="predicted"
                        fill={COLORS.prediction}
                        name="Predicted"
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="actual"
                        fill={COLORS.growth}
                        name="Actual"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="accuracy"
                        stroke={COLORS.anomaly}
                        strokeWidth={3}
                        name="Accuracy (%)"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Predictive Features Summary */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">47</div>
                  <div className="text-lg font-medium">Next Week Estimate</div>
                  <div className="text-sm text-gray-600">45-50 requests</div>
                  <div className="text-xs text-green-600 mt-1">87% confidence</div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">$12.5k</div>
                  <div className="text-lg font-medium">Month-end Revenue</div>
                  <div className="text-sm text-gray-600">85% confidence</div>
                  <div className="text-xs text-blue-600 mt-1">92% goal achievement</div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">+15%</div>
                  <div className="text-lg font-medium">Growth Trajectory</div>
                  <div className="text-sm text-gray-600">Monthly trend</div>
                  <div className="text-xs text-purple-600 mt-1">91% confidence</div>
                </div>
              </Card>
            </div>

            {/* Predictive Analytics Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Predictive Analytics Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3">Demand Forecasting</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Next week estimate: 45-50 requests",
                        "Peak days: Tuesday, Saturday",
                        "Quiet periods: Monday morning",
                        "Special events: Valentine's surge expected"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-blue-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3">Revenue Projection</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Month-end estimate: $12,500",
                        "Confidence level: 85%",
                        "Growth trajectory: +15%",
                        "Goal achievement: 92%"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
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
            <Alert className="border-cyan-200 bg-cyan-50 dark:bg-cyan-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Trend Analysis & Predictions system with 
                5-type trend detection framework, predictive analytics dashboard, demand forecasting, revenue projections, 
                and real-time alert system. All features include confidence scoring and action suggestions.
              </AlertDescription>
            </Alert>

            <TrendAnalysisPredictions
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
              onTrendClick={handleTrendClick}
              onForecastUpdate={handleForecastUpdate}
              onAlertAction={handleAlertAction}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}