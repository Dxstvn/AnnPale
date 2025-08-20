"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  ReferenceArea
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Users,
  User,
  Crown,
  Award,
  Trophy,
  Medal,
  Star,
  Zap,
  Gauge,
  Timer,
  Clock,
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
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
  Unlock,
  Shield,
  ShieldCheck,
  UserCheck,
  UserPlus,
  UserX,
  Users2,
  DollarSign,
  Percent,
  Hash,
  BarChart2,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Calculator,
  Brain,
  Lightbulb,
  Sparkles,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Flag,
  Bell,
  BellOff,
  Mail,
  Send,
  Inbox,
  Archive,
  Trash,
  Edit,
  Save,
  Copy,
  Clipboard,
  ClipboardCheck,
  ClipboardList,
  ClipboardX,
  FileText,
  File,
  Folder,
  FolderOpen,
  Package,
  Box,
  Gift,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Receipt,
  Tag,
  Tags,
  Ticket,
  Award as AwardIcon,
  Medal as MedalIcon,
  Trophy as TrophyIcon,
  Crown as CrownIcon,
  Star as StarIcon,
  Zap as ZapIcon,
  Flame,
  Snowflake,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Droplets,
  Waves,
  Navigation,
  Compass,
  Map,
  MapPin,
  Globe,
  Globe2,
  World
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Comparative Analytics Types
interface ComparisonMetric {
  id: string
  name: string
  value: number
  unit: string
  comparison: number // Comparison value (baseline/average)
  difference: number // Difference from comparison
  percentile: number // Percentile rank
  trend: "up" | "down" | "stable"
  status: "excellent" | "good" | "average" | "below" | "poor"
  description?: string
}

interface ComparisonFramework {
  id: string
  type: "historical_self" | "category_average" | "top_performers" | "similar_creators" | "platform_average"
  name: string
  baseline: string
  visualization: "line_overlay" | "bar_comparison" | "gap_analysis" | "radar_chart" | "percentile_rank"
  privacy: "private" | "anonymous"
  motivation: string
  metrics: ComparisonMetric[]
  insights: string[]
  recommendations: string[]
}

interface PerformanceGap {
  metric: string
  current: number
  target: number
  gap: number
  percentageToTarget: number
  actionRequired: string
  priority: "high" | "medium" | "low"
  estimatedTimeToClose: string
}

interface PeerComparison {
  id: string
  category: string
  peerGroup: string
  yourRank: number
  totalPeers: number
  percentile: number
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

interface BenchmarkData {
  metric: string
  you: number
  categoryAvg: number
  topPerformers: number
  platformAvg: number
  yourPercentile: number
  trend: "improving" | "declining" | "stable"
  recommendation?: string
}

// Component Props
interface ComparativeAnalyticsProps {
  timeRange?: "7" | "30" | "90" | "365"
  onTimeRangeChange?: (range: "7" | "30" | "90" | "365") => void
  comparisonType?: ComparisonFramework["type"]
  onComparisonTypeChange?: (type: ComparisonFramework["type"]) => void
  onMetricClick?: (metricId: string) => void
  onInsightAction?: (insightId: string) => void
  className?: string
}

// Color Scheme
const COMPARISON_COLORS = {
  you: "#8B5CF6",           // Purple - Your performance
  average: "#3B82F6",        // Blue - Average performance
  top: "#10B981",            // Green - Top performers
  platform: "#6B7280",       // Gray - Platform average
  excellent: "#10B981",      // Green
  good: "#3B82F6",           // Blue
  average: "#F59E0B",        // Yellow
  below: "#F97316",          // Orange
  poor: "#EF4444",           // Red
  historical: "#06B6D4",     // Cyan - Historical comparison
  peer: "#EC4899",           // Pink - Peer comparison
  gap: "#F59E0B"            // Yellow - Performance gap
}

// Mock Data Generation
const generateHistoricalComparison = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map((month, index) => ({
    period: month,
    current: 75 + Math.random() * 20 + index * 3,
    previous: 70 + Math.random() * 15 + index * 2,
    improvement: 5 + Math.random() * 10
  }))
}

const generateRadarData = () => [
  { metric: "Response Time", you: 95, peers: 75, top: 98, full: 100 },
  { metric: "Completion Rate", you: 98, peers: 92, top: 99, full: 100 },
  { metric: "Rating", you: 96, peers: 90, top: 98, full: 100 },
  { metric: "Booking Rate", you: 45, peers: 35, top: 65, full: 100 },
  { metric: "Revenue", you: 75, peers: 60, top: 90, full: 100 },
  { metric: "Engagement", you: 82, peers: 70, top: 95, full: 100 }
]

// Comparison Metrics Data
const comparisonMetrics: ComparisonMetric[] = [
  {
    id: "response_time",
    name: "Response Time",
    value: 2,
    unit: "hours",
    comparison: 5,
    difference: -3,
    percentile: 95,
    trend: "up",
    status: "excellent",
    description: "60% faster than category average"
  },
  {
    id: "completion_rate",
    name: "Completion Rate",
    value: 98,
    unit: "%",
    comparison: 92,
    difference: 6,
    percentile: 88,
    trend: "stable",
    status: "excellent",
    description: "6% above category average"
  },
  {
    id: "avg_rating",
    name: "Average Rating",
    value: 4.8,
    unit: "stars",
    comparison: 4.5,
    difference: 0.3,
    percentile: 82,
    trend: "up",
    status: "good",
    description: "Top 18% of creators"
  },
  {
    id: "pricing",
    name: "Pricing",
    value: 150,
    unit: "$",
    comparison: 120,
    difference: 30,
    percentile: 75,
    trend: "stable",
    status: "good",
    description: "25% premium positioning"
  },
  {
    id: "booking_rate",
    name: "Booking Rate",
    value: 45,
    unit: "%",
    comparison: 35,
    difference: 10,
    percentile: 78,
    trend: "up",
    status: "good",
    description: "29% better conversion"
  },
  {
    id: "repeat_rate",
    name: "Repeat Rate",
    value: 58,
    unit: "%",
    comparison: 52,
    difference: 6,
    percentile: 71,
    trend: "up",
    status: "good",
    description: "Above average retention"
  }
]

// Benchmark Data
const benchmarkData: BenchmarkData[] = [
  {
    metric: "Response Time",
    you: 2,
    categoryAvg: 5,
    topPerformers: 1.5,
    platformAvg: 6,
    yourPercentile: 95,
    trend: "improving",
    recommendation: "Maintain excellent response time"
  },
  {
    metric: "Completion Rate",
    you: 98,
    categoryAvg: 92,
    topPerformers: 99,
    platformAvg: 88,
    yourPercentile: 88,
    trend: "stable",
    recommendation: "Close to top performer level"
  },
  {
    metric: "Average Rating",
    you: 4.8,
    categoryAvg: 4.5,
    topPerformers: 4.9,
    platformAvg: 4.3,
    yourPercentile: 82,
    trend: "improving",
    recommendation: "Focus on 5-star experiences"
  },
  {
    metric: "Booking Rate",
    you: 45,
    categoryAvg: 35,
    topPerformers: 65,
    platformAvg: 30,
    yourPercentile: 78,
    trend: "improving",
    recommendation: "Optimize profile for conversions"
  },
  {
    metric: "Revenue/Video",
    you: 150,
    categoryAvg: 120,
    topPerformers: 200,
    platformAvg: 100,
    yourPercentile: 75,
    trend: "stable",
    recommendation: "Consider premium upsells"
  }
]

// Performance Gaps Data
const performanceGaps: PerformanceGap[] = [
  {
    metric: "Booking Rate",
    current: 45,
    target: 65,
    gap: 20,
    percentageToTarget: 69,
    actionRequired: "Optimize profile and samples",
    priority: "high",
    estimatedTimeToClose: "2-3 months"
  },
  {
    metric: "Average Order Value",
    current: 150,
    target: 200,
    gap: 50,
    percentageToTarget: 75,
    actionRequired: "Introduce premium services",
    priority: "high",
    estimatedTimeToClose: "1-2 months"
  },
  {
    metric: "Repeat Customer Rate",
    current: 58,
    target: 70,
    gap: 12,
    percentageToTarget: 83,
    actionRequired: "Enhance customer experience",
    priority: "medium",
    estimatedTimeToClose: "3-4 months"
  },
  {
    metric: "Average Rating",
    current: 4.8,
    target: 4.9,
    gap: 0.1,
    percentageToTarget: 98,
    actionRequired: "Focus on service details",
    priority: "low",
    estimatedTimeToClose: "1 month"
  }
]

// Peer Comparison Data
const peerComparisons: PeerComparison[] = [
  {
    id: "category_peers",
    category: "Entertainment",
    peerGroup: "Similar experience level",
    yourRank: 12,
    totalPeers: 150,
    percentile: 92,
    strengths: ["Response time", "Completion rate", "Customer satisfaction"],
    weaknesses: ["Pricing optimization", "Upselling"],
    opportunities: ["Premium services", "Corporate clients"],
    threats: ["New competitors", "Market saturation"]
  },
  {
    id: "revenue_peers",
    category: "Revenue Range",
    peerGroup: "$10K-15K monthly",
    yourRank: 8,
    totalPeers: 85,
    percentile: 91,
    strengths: ["Consistent bookings", "High ratings"],
    weaknesses: ["Limited service variety"],
    opportunities: ["Service expansion", "Higher pricing"],
    threats: ["Economic downturn", "Platform changes"]
  }
]

// Competitive Intelligence Display Component
const CompetitiveIntelligenceDisplay = ({ 
  metrics,
  onMetricClick
}: { 
  metrics: ComparisonMetric[]
  onMetricClick?: (metricId: string) => void
}) => {
  const getProgressColor = (percentile: number) => {
    if (percentile >= 90) return COMPARISON_COLORS.excellent
    if (percentile >= 75) return COMPARISON_COLORS.good
    if (percentile >= 50) return COMPARISON_COLORS.average
    if (percentile >= 25) return COMPARISON_COLORS.below
    return COMPARISON_COLORS.poor
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-600" />
          Competitive Intelligence Display
        </CardTitle>
        <CardDescription>
          Your performance vs category average with percentile ranking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-4 rounded-lg transition-colors"
              onClick={() => onMetricClick?.(metric.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">{metric.name}</h4>
                  <Badge 
                    variant="outline"
                    className={cn(
                      metric.status === "excellent" && "text-green-600 border-green-300",
                      metric.status === "good" && "text-blue-600 border-blue-300",
                      metric.status === "average" && "text-yellow-600 border-yellow-300",
                      metric.status === "below" && "text-orange-600 border-orange-300",
                      metric.status === "poor" && "text-red-600 border-red-300"
                    )}
                  >
                    {metric.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">
                      {metric.value}{metric.unit === "stars" ? "" : metric.unit === "%" ? "%" : ` ${metric.unit}`}
                    </div>
                    <div className="text-xs text-gray-600">
                      Avg: {metric.comparison}{metric.unit === "stars" ? "" : metric.unit === "%" ? "%" : ` ${metric.unit}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {metric.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                    {metric.trend === "stable" && <Activity className="h-4 w-4 text-gray-600" />}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Category Average</span>
                  <span>You: Top {100 - metric.percentile}%</span>
                </div>
                <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  {/* Background segments */}
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 bg-red-100 dark:bg-red-900/30" />
                    <div className="flex-1 bg-orange-100 dark:bg-orange-900/30" />
                    <div className="flex-1 bg-yellow-100 dark:bg-yellow-900/30" />
                    <div className="flex-1 bg-blue-100 dark:bg-blue-900/30" />
                    <div className="flex-1 bg-green-100 dark:bg-green-900/30" />
                  </div>
                  
                  {/* Your position */}
                  <div 
                    className="absolute top-0 left-0 h-full flex items-center justify-end pr-2"
                    style={{ 
                      width: `${metric.percentile}%`,
                      backgroundColor: getProgressColor(metric.percentile)
                    }}
                  >
                    <span className="text-xs font-medium text-white">
                      {metric.percentile}%
                    </span>
                  </div>
                  
                  {/* Average marker */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-gray-600"
                    style={{ left: "50%" }}
                  />
                </div>
              </div>
              
              {metric.description && (
                <p className="text-sm text-gray-600 mt-2">{metric.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Comparison Frameworks Component
const ComparisonFrameworks = ({ 
  type,
  radarData,
  historicalData
}: { 
  type: ComparisonFramework["type"]
  radarData: any[]
  historicalData: any[]
}) => {
  const renderVisualization = () => {
    switch(type) {
      case "historical_self":
        return (
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke={COMPARISON_COLORS.you}
                  strokeWidth={3}
                  name="Current Period"
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke={COMPARISON_COLORS.historical}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Previous Period"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      case "similar_creators":
        return (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="You"
                  dataKey="you"
                  stroke={COMPARISON_COLORS.you}
                  fill={COMPARISON_COLORS.you}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Peer Average"
                  dataKey="peers"
                  stroke={COMPARISON_COLORS.peer}
                  fill={COMPARISON_COLORS.peer}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar
                  name="Top Performers"
                  dataKey="top"
                  stroke={COMPARISON_COLORS.top}
                  fill={COMPARISON_COLORS.top}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )

      case "category_average":
      case "top_performers":
      case "platform_average":
      default:
        return (
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="you" fill={COMPARISON_COLORS.you} name="You" />
                <Bar dataKey="categoryAvg" fill={COMPARISON_COLORS.average} name="Category Avg" />
                <Bar dataKey="topPerformers" fill={COMPARISON_COLORS.top} name="Top 10%" />
                <Bar dataKey="platformAvg" fill={COMPARISON_COLORS.platform} name="Platform Avg" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
    }
  }

  const getFrameworkTitle = () => {
    switch(type) {
      case "historical_self": return "Historical Self-Comparison"
      case "category_average": return "Category Average Comparison"
      case "top_performers": return "Top Performers Benchmark"
      case "similar_creators": return "Similar Creators Analysis"
      case "platform_average": return "Platform Average Comparison"
      default: return "Performance Comparison"
    }
  }

  const getFrameworkDescription = () => {
    switch(type) {
      case "historical_self": return "Track your progress over time"
      case "category_average": return "Compare with creators in your category"
      case "top_performers": return "Benchmark against the top 10%"
      case "similar_creators": return "Analyze performance vs peer group"
      case "platform_average": return "See where you stand platform-wide"
      default: return "Comparative performance analysis"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          {getFrameworkTitle()}
        </CardTitle>
        <CardDescription>
          {getFrameworkDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderVisualization()}
      </CardContent>
    </Card>
  )
}

// Performance Gap Analysis Component
const PerformanceGapAnalysis = ({ 
  gaps 
}: { 
  gaps: PerformanceGap[] 
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Target className="h-5 w-5 text-orange-600" />
        Performance Gap Analysis
      </CardTitle>
      <CardDescription>
        Identify and close gaps to reach top performer status
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {gaps.map((gap, index) => (
          <motion.div
            key={gap.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{gap.metric}</h3>
                      <Badge 
                        variant={gap.priority === "high" ? "destructive" : 
                               gap.priority === "medium" ? "default" : "secondary"}
                        className={cn(
                          gap.priority === "high" && "bg-red-100 text-red-800",
                          gap.priority === "medium" && "bg-yellow-100 text-yellow-800",
                          gap.priority === "low" && "bg-green-100 text-green-800"
                        )}
                      >
                        {gap.priority} priority
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {gap.current}
                        </div>
                        <div className="text-xs text-gray-600">Current</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {gap.target}
                        </div>
                        <div className="text-xs text-gray-600">Target</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">
                          {gap.gap}
                        </div>
                        <div className="text-xs text-gray-600">Gap</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {gap.percentageToTarget}%
                        </div>
                        <div className="text-xs text-gray-600">Progress</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress to Target</span>
                        <span className="font-medium">{gap.percentageToTarget}%</span>
                      </div>
                      <Progress value={gap.percentageToTarget} className="h-2" />
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Action Required:</div>
                          <div className="text-sm text-gray-600">{gap.actionRequired}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Estimated time to close: {gap.estimatedTimeToClose}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
)

// Peer Group Analysis Component
const PeerGroupAnalysis = ({ 
  comparisons 
}: { 
  comparisons: PeerComparison[] 
}) => (
  <div className="space-y-6">
    {comparisons.map((comparison, index) => (
      <motion.div
        key={comparison.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                {comparison.category} Comparison
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-purple-600">
                  Rank #{comparison.yourRank} of {comparison.totalPeers}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  Top {100 - comparison.percentile}%
                </Badge>
              </div>
            </div>
            <CardDescription>
              {comparison.peerGroup}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* SWOT Analysis */}
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm mb-2 text-green-600">Strengths</h5>
                  <ul className="space-y-1">
                    {comparison.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2 text-red-600">Weaknesses</h5>
                  <ul className="space-y-1">
                    {comparison.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <XCircle className="h-3 w-3 text-red-600" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm mb-2 text-blue-600">Opportunities</h5>
                  <ul className="space-y-1">
                    {comparison.opportunities.map((opportunity, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Lightbulb className="h-3 w-3 text-blue-600" />
                        <span>{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2 text-orange-600">Threats</h5>
                  <ul className="space-y-1">
                    {comparison.threats.map((threat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-3 w-3 text-orange-600" />
                        <span>{threat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Percentile Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Your Position</span>
                <span>Percentile: {comparison.percentile}%</span>
              </div>
              <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-end pr-2"
                  style={{ width: `${comparison.percentile}%` }}
                >
                  <span className="text-xs font-medium text-white">
                    Top {100 - comparison.percentile}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
)

// Main Component
export function ComparativeAnalytics({
  timeRange = "30",
  onTimeRangeChange,
  comparisonType = "category_average",
  onComparisonTypeChange,
  onMetricClick,
  onInsightAction,
  className
}: ComparativeAnalyticsProps) {
  const [activeView, setActiveView] = React.useState("overview")
  const [selectedComparison, setSelectedComparison] = React.useState(comparisonType)
  
  const historicalData = React.useMemo(() => generateHistoricalComparison(), [])
  const radarData = React.useMemo(() => generateRadarData(), [])
  
  const handleMetricClick = (metricId: string) => {
    console.log("Metric clicked:", metricId)
    onMetricClick?.(metricId)
  }
  
  const handleInsightAction = (insightId: string) => {
    console.log("Insight action:", insightId)
    onInsightAction?.(insightId)
  }
  
  const handleComparisonTypeChange = (type: ComparisonFramework["type"]) => {
    setSelectedComparison(type)
    onComparisonTypeChange?.(type)
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Comparative Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Understand your relative performance and identify improvement opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(v) => onTimeRangeChange?.(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-purple-600">
            <Trophy className="w-3 h-3 mr-1" />
            Benchmarking
          </Badge>
        </div>
      </div>
      
      {/* Comparison Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-purple-600" />
            Comparison Framework
          </CardTitle>
          <CardDescription>
            Select the type of comparison to analyze your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { type: "historical_self" as const, name: "Historical Self", icon: Clock, privacy: "Private" },
              { type: "category_average" as const, name: "Category Average", icon: BarChart3, privacy: "Anonymous" },
              { type: "top_performers" as const, name: "Top Performers", icon: Crown, privacy: "Anonymous" },
              { type: "similar_creators" as const, name: "Similar Creators", icon: Users, privacy: "Anonymous" },
              { type: "platform_average" as const, name: "Platform Average", icon: Globe, privacy: "Anonymous" }
            ].map(({ type, name, icon: Icon, privacy }) => (
              <Button
                key={type}
                variant={selectedComparison === type ? "default" : "outline"}
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleComparisonTypeChange(type)}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{name}</span>
                <Badge variant="secondary" className="text-xs">
                  {privacy}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Competitive Intelligence Display */}
      <CompetitiveIntelligenceDisplay 
        metrics={comparisonMetrics}
        onMetricClick={handleMetricClick}
      />
      
      {/* Comparison Frameworks Visualization */}
      <ComparisonFrameworks 
        type={selectedComparison}
        radarData={radarData}
        historicalData={historicalData}
      />
      
      {/* Performance Gap Analysis */}
      <PerformanceGapAnalysis gaps={performanceGaps} />
      
      {/* Peer Group Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="h-5 w-5 text-purple-600" />
            Peer Group Analysis
          </CardTitle>
          <CardDescription>
            SWOT analysis and ranking within your peer groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PeerGroupAnalysis comparisons={peerComparisons} />
        </CardContent>
      </Card>
      
      {/* Summary Alert */}
      <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
        <Trophy className="h-4 w-4" />
        <AlertDescription>
          <strong>Comparative Summary:</strong> You're in the top 8% of creators in your category, 
          with response time and completion rate as key strengths. Focus on closing the 20% booking 
          rate gap to reach top performer status. Your percentile rank has improved by 12 points over 
          the last quarter.
        </AlertDescription>
      </Alert>
    </div>
  )
}