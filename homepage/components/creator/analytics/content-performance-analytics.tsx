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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from "recharts"
import {
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
  Image as ImageIcon,
  Edit3,
  Save,
  Archive,
  Trash2,
  Copy,
  ExternalLink,
  Link,
  Hash,
  Type,
  AlignLeft,
  AlignCenter,
  Bold,
  Italic,
  Underline
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Content Performance Types
interface ContentMetric {
  id: string
  category: "engagement" | "quality" | "efficiency" | "revenue" | "trends"
  name: string
  primaryKPI: string
  value: number
  change: number
  trend: "up" | "down" | "stable"
  visualization: "line" | "bar" | "gauge" | "stacked_bar" | "word_cloud"
  secondaryMetrics: string[]
  optimizationFocus: string
  target?: number
  benchmark?: number
  impact: "high" | "medium" | "low"
}

interface VideoPerformance {
  id: string
  title: string
  type: string
  occasion: string
  length: number // seconds
  completionRate: number
  avgRating: number
  views: number
  shares: number
  saves: number
  earnings: number
  productionTime: number // minutes
  performance: "high" | "medium" | "low"
  effort: "high" | "medium" | "low"
  zone: "A" | "B" | "C" | "D"
  createdAt: string
  thumbnailUrl?: string
}

interface SuccessPattern {
  id: string
  pattern: string
  category: "length" | "occasion" | "format" | "theme" | "style"
  description: string
  frequency: number
  avgPerformance: number
  examples: string[]
  recommendations: string[]
  confidence: number
}

interface ImprovementOpportunity {
  id: string
  category: "underperforming" | "quality" | "delivery" | "feedback" | "competitive"
  title: string
  description: string
  severity: "high" | "medium" | "low"
  effort: "low" | "medium" | "high"
  impact: number
  affectedVideos: number
  recommendations: string[]
  metrics: string[]
  timeframe: string
}

// Component Props
interface ContentPerformanceAnalyticsProps {
  timeRange?: "7" | "30" | "90" | "365"
  onTimeRangeChange?: (range: "7" | "30" | "90" | "365") => void
  onMetricClick?: (metricId: string) => void
  onVideoSelect?: (videoId: string) => void
  onPatternAnalyze?: (patternId: string) => void
  onOpportunityImplement?: (opportunityId: string) => void
  className?: string
}

// Color Scheme
const CONTENT_COLORS = {
  engagement: "#10B981",     // Green - Engagement metrics
  quality: "#3B82F6",        // Blue - Quality metrics
  efficiency: "#8B5CF6",     // Purple - Efficiency metrics
  revenue: "#F59E0B",        // Yellow - Revenue metrics
  trends: "#EC4899",         // Pink - Trend metrics
  zoneA: "#10B981",          // Optimize - Green
  zoneB: "#F59E0B",          // Selective - Yellow
  zoneC: "#3B82F6",          // Scale - Blue
  zoneD: "#EF4444",          // Eliminate - Red
  high: "#10B981",
  medium: "#F59E0B",
  low: "#EF4444"
}

// Mock Data Generation
const generateContentMetrics = (): ContentMetric[] => [
  {
    id: "engagement_completion",
    category: "engagement",
    name: "Completion Rate",
    primaryKPI: "Avg. Completion",
    value: 78.5,
    change: 12.3,
    trend: "up",
    visualization: "line",
    secondaryMetrics: ["Views", "Shares", "Saves"],
    optimizationFocus: "Content quality",
    target: 85,
    benchmark: 72,
    impact: "high"
  },
  {
    id: "quality_rating",
    category: "quality",
    name: "Average Rating",
    primaryKPI: "Avg. Star Rating",
    value: 4.6,
    change: 8.7,
    trend: "up",
    visualization: "bar",
    secondaryMetrics: ["Rating distribution", "Review count"],
    optimizationFocus: "Service improvement",
    target: 4.8,
    benchmark: 4.2,
    impact: "high"
  },
  {
    id: "efficiency_production",
    category: "efficiency",
    name: "Production Time",
    primaryKPI: "Avg. Time per Video",
    value: 45,
    change: -15.2,
    trend: "up", // Down is good for time
    visualization: "gauge",
    secondaryMetrics: ["Setup time", "Recording time", "Edit time"],
    optimizationFocus: "Workflow optimization",
    target: 35,
    benchmark: 55,
    impact: "medium"
  },
  {
    id: "revenue_earnings",
    category: "revenue",
    name: "Earnings per Video",
    primaryKPI: "Avg. Revenue",
    value: 125,
    change: 18.9,
    trend: "up",
    visualization: "stacked_bar",
    secondaryMetrics: ["By type", "By occasion", "Tips"],
    optimizationFocus: "Portfolio mix",
    target: 150,
    benchmark: 95,
    impact: "high"
  },
  {
    id: "trends_themes",
    category: "trends",
    name: "Popular Themes",
    primaryKPI: "Trending Topics",
    value: 15,
    change: 25.0,
    trend: "up",
    visualization: "word_cloud",
    secondaryMetrics: ["Emerging requests", "Seasonal patterns"],
    optimizationFocus: "Content planning",
    impact: "medium"
  }
]

const generateVideoPerformances = (): VideoPerformance[] => [
  {
    id: "vid_001",
    title: "Birthday Wishes for Marie",
    type: "Birthday",
    occasion: "Birthday",
    length: 90,
    completionRate: 92,
    avgRating: 4.8,
    views: 245,
    shares: 18,
    saves: 12,
    earnings: 85,
    productionTime: 35,
    performance: "high",
    effort: "low",
    zone: "C",
    createdAt: "2024-03-15"
  },
  {
    id: "vid_002", 
    title: "Wedding Anniversary Message",
    type: "Anniversary",
    occasion: "Anniversary",
    length: 150,
    completionRate: 88,
    avgRating: 4.9,
    views: 182,
    shares: 25,
    saves: 19,
    earnings: 150,
    productionTime: 65,
    performance: "high",
    effort: "high",
    zone: "B",
    createdAt: "2024-03-12"
  },
  {
    id: "vid_003",
    title: "Graduation Congratulations",
    type: "Graduation",
    occasion: "Achievement",
    length: 120,
    completionRate: 85,
    avgRating: 4.7,
    views: 156,
    shares: 14,
    saves: 8,
    earnings: 100,
    productionTime: 40,
    performance: "high",
    effort: "medium",
    zone: "A",
    createdAt: "2024-03-10"
  },
  {
    id: "vid_004",
    title: "Holiday Greetings",
    type: "Holiday",
    occasion: "Holiday",
    length: 75,
    completionRate: 65,
    avgRating: 4.2,
    views: 89,
    shares: 5,
    saves: 3,
    earnings: 50,
    productionTime: 25,
    performance: "low",
    effort: "low",
    zone: "D",
    createdAt: "2024-03-08"
  },
  {
    id: "vid_005",
    title: "Business Motivation",
    type: "Business",
    occasion: "Professional",
    length: 180,
    completionRate: 70,
    avgRating: 4.3,
    views: 124,
    shares: 8,
    saves: 6,
    earnings: 120,
    productionTime: 85,
    performance: "low",
    effort: "high",
    zone: "D",
    createdAt: "2024-03-05"
  }
]

const generateSuccessPatterns = (): SuccessPattern[] => [
  {
    id: "pattern_length",
    pattern: "90-120 Second Videos",
    category: "length",
    description: "Videos between 90-120 seconds show highest completion rates and engagement",
    frequency: 35,
    avgPerformance: 87.2,
    examples: ["Birthday wishes", "Thank you messages", "Congratulations"],
    recommendations: [
      "Keep core messages within 90-120 seconds",
      "Use quick intro and outro format",
      "Focus on key emotional moments"
    ],
    confidence: 92
  },
  {
    id: "pattern_occasion",
    pattern: "Personal Milestone Celebrations",
    category: "occasion",
    description: "Birthday, anniversary, and graduation videos consistently outperform general requests",
    frequency: 48,
    avgPerformance: 91.5,
    examples: ["Birthday messages", "Anniversary wishes", "Graduation congratulations"],
    recommendations: [
      "Create templates for milestone occasions",
      "Develop celebration-specific props",
      "Offer milestone package deals"
    ],
    confidence: 95
  },
  {
    id: "pattern_format",
    pattern: "Story + Message Structure",
    category: "format",
    description: "Videos with personal story followed by direct message achieve higher ratings",
    frequency: 42,
    avgPerformance: 89.8,
    examples: ["Personal anecdote + birthday wish", "Shared experience + congratulations"],
    recommendations: [
      "Develop story bank for different occasions",
      "Practice smooth story-to-message transitions",
      "Ask customers for context to personalize stories"
    ],
    confidence: 88
  },
  {
    id: "pattern_theme",
    pattern: "Cultural References",
    category: "theme",
    description: "Videos incorporating Haitian cultural elements receive significantly higher engagement",
    frequency: 28,
    avgPerformance: 94.1,
    examples: ["Haitian proverbs", "Cultural celebrations", "Language mixing"],
    recommendations: [
      "Build library of cultural references",
      "Incorporate traditional elements",
      "Use appropriate cultural context for occasions"
    ],
    confidence: 97
  },
  {
    id: "pattern_style",
    pattern: "High Energy Opening",
    category: "style",
    description: "Videos starting with high energy and enthusiasm maintain viewer attention longer",
    frequency: 52,
    avgPerformance: 86.3,
    examples: ["Energetic greeting", "Excited announcement", "Upbeat tone"],
    recommendations: [
      "Practice energetic openings",
      "Use dynamic body language",
      "Start with attention-grabbing phrases"
    ],
    confidence: 89
  }
]

const generateImprovementOpportunities = (): ImprovementOpportunity[] => [
  {
    id: "opp_underperforming",
    category: "underperforming",
    title: "Low Engagement Business Videos",
    description: "Professional/business category videos show 35% lower completion rates compared to personal messages",
    severity: "high",
    effort: "medium",
    impact: 25,
    affectedVideos: 12,
    recommendations: [
      "Research business video best practices",
      "Create more engaging business templates", 
      "Add personal touches to professional messages",
      "Optimize video length for business context"
    ],
    metrics: ["Completion Rate", "View Duration", "Engagement Score"],
    timeframe: "2-3 weeks"
  },
  {
    id: "opp_quality",
    title: "Audio Quality Issues",
    category: "quality",
    description: "15% of videos receive lower ratings due to background noise or audio clarity issues",
    severity: "medium",
    effort: "low",
    impact: 18,
    affectedVideos: 8,
    recommendations: [
      "Invest in better microphone equipment",
      "Record in quieter environment",
      "Use noise reduction software",
      "Do audio checks before recording"
    ],
    metrics: ["Average Rating", "Audio Quality Score", "Re-record Rate"],
    timeframe: "1 week"
  },
  {
    id: "opp_delivery",
    title: "Extended Production Times",
    description: "25% of videos exceed target production time, affecting profitability and scheduling",
    category: "delivery",
    severity: "medium",
    effort: "medium",
    impact: 22,
    affectedVideos: 15,
    recommendations: [
      "Create streamlined templates for common requests",
      "Practice efficient recording workflows",
      "Set up dedicated recording space",
      "Batch similar video types together"
    ],
    metrics: ["Production Time", "Efficiency Ratio", "Scheduling Accuracy"],
    timeframe: "2-4 weeks"
  },
  {
    id: "opp_feedback",
    title: "Customer Feedback Integration",
    description: "Positive feedback themes not being leveraged, and constructive criticism not addressed systematically",
    category: "feedback",
    severity: "low",
    effort: "low",
    impact: 15,
    affectedVideos: 0,
    recommendations: [
      "Create feedback analysis system",
      "Track and implement positive feedback patterns",
      "Address recurring constructive criticism",
      "Follow up with customers for detailed feedback"
    ],
    metrics: ["Feedback Implementation Rate", "Customer Satisfaction", "Repeat Booking Rate"],
    timeframe: "1-2 weeks"
  },
  {
    id: "opp_competitive",
    title: "Market Positioning Analysis",
    description: "Opportunity to differentiate content style and offerings based on competitor analysis gaps",
    category: "competitive", 
    severity: "low",
    effort: "high",
    impact: 30,
    affectedVideos: 0,
    recommendations: [
      "Analyze top performer content strategies",
      "Identify unique value proposition opportunities",
      "Develop signature style elements",
      "Create competitive pricing strategies"
    ],
    metrics: ["Market Share", "Unique Booking Rate", "Premium Service Uptake"],
    timeframe: "1-2 months"
  }
]

// Performance Matrix Component
const PerformanceMatrix = ({ 
  videos, 
  onVideoSelect 
}: { 
  videos: VideoPerformance[]
  onVideoSelect?: (videoId: string) => void 
}) => {
  const zoneData = {
    A: videos.filter(v => v.zone === "A"),
    B: videos.filter(v => v.zone === "B"), 
    C: videos.filter(v => v.zone === "C"),
    D: videos.filter(v => v.zone === "D")
  }

  const getZoneColor = (zone: string) => {
    switch(zone) {
      case "A": return CONTENT_COLORS.zoneA
      case "B": return CONTENT_COLORS.zoneB
      case "C": return CONTENT_COLORS.zoneC
      case "D": return CONTENT_COLORS.zoneD
      default: return "#gray"
    }
  }

  const getZoneLabel = (zone: string) => {
    switch(zone) {
      case "A": return "Optimize"
      case "B": return "Selective"
      case "C": return "Scale"
      case "D": return "Eliminate"
      default: return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Performance Matrix
        </CardTitle>
        <CardDescription>
          Content categorized by performance vs effort for strategic decision making
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Zone A - High Performance, High Effort */}
          <div className="p-4 border-2 border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-800">Zone A - Optimize</h4>
              <Badge style={{ backgroundColor: CONTENT_COLORS.zoneA, color: "white" }}>
                {zoneData.A.length} videos
              </Badge>
            </div>
            <p className="text-sm text-green-700 mb-3">High Performance, High Effort</p>
            <div className="space-y-2">
              {zoneData.A.map((video) => (
                <div 
                  key={video.id}
                  className="p-2 bg-white dark:bg-gray-800 rounded cursor-pointer hover:shadow-sm"
                  onClick={() => onVideoSelect?.(video.id)}
                >
                  <div className="text-sm font-medium">{video.title}</div>
                  <div className="text-xs text-gray-600">
                    {video.completionRate}% completion • ${video.earnings} • {video.productionTime}min
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone B - High Performance, Low Effort */}
          <div className="p-4 border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-yellow-800">Zone B - Selective</h4>
              <Badge style={{ backgroundColor: CONTENT_COLORS.zoneB, color: "white" }}>
                {zoneData.B.length} videos
              </Badge>
            </div>
            <p className="text-sm text-yellow-700 mb-3">High Performance, Low Effort</p>
            <div className="space-y-2">
              {zoneData.B.map((video) => (
                <div 
                  key={video.id}
                  className="p-2 bg-white dark:bg-gray-800 rounded cursor-pointer hover:shadow-sm"
                  onClick={() => onVideoSelect?.(video.id)}
                >
                  <div className="text-sm font-medium">{video.title}</div>
                  <div className="text-xs text-gray-600">
                    {video.completionRate}% completion • ${video.earnings} • {video.productionTime}min
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone C - Low Performance, High Effort */}
          <div className="p-4 border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-blue-800">Zone C - Scale</h4>
              <Badge style={{ backgroundColor: CONTENT_COLORS.zoneC, color: "white" }}>
                {zoneData.C.length} videos
              </Badge>
            </div>
            <p className="text-sm text-blue-700 mb-3">Low Performance, High Effort</p>
            <div className="space-y-2">
              {zoneData.C.map((video) => (
                <div 
                  key={video.id}
                  className="p-2 bg-white dark:bg-gray-800 rounded cursor-pointer hover:shadow-sm"
                  onClick={() => onVideoSelect?.(video.id)}
                >
                  <div className="text-sm font-medium">{video.title}</div>
                  <div className="text-xs text-gray-600">
                    {video.completionRate}% completion • ${video.earnings} • {video.productionTime}min
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone D - Low Performance, Low Effort */}
          <div className="p-4 border-2 border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-red-800">Zone D - Eliminate</h4>
              <Badge style={{ backgroundColor: CONTENT_COLORS.zoneD, color: "white" }}>
                {zoneData.D.length} videos
              </Badge>
            </div>
            <p className="text-sm text-red-700 mb-3">Low Performance, Low Effort</p>
            <div className="space-y-2">
              {zoneData.D.map((video) => (
                <div 
                  key={video.id}
                  className="p-2 bg-white dark:bg-gray-800 rounded cursor-pointer hover:shadow-sm"
                  onClick={() => onVideoSelect?.(video.id)}
                >
                  <div className="text-sm font-medium">{video.title}</div>
                  <div className="text-xs text-gray-600">
                    {video.completionRate}% completion • ${video.earnings} • {video.productionTime}min
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{zoneData.A.length}</div>
              <div className="text-sm text-gray-600">Optimize</div>
              <div className="text-xs text-green-600">Improve efficiency</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{zoneData.B.length}</div>
              <div className="text-sm text-gray-600">Selective</div>
              <div className="text-xs text-yellow-600">Choose carefully</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{zoneData.C.length}</div>
              <div className="text-sm text-gray-600">Scale</div>
              <div className="text-xs text-blue-600">Do more of these</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{zoneData.D.length}</div>
              <div className="text-sm text-gray-600">Eliminate</div>
              <div className="text-xs text-red-600">Stop or fix</div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

// Content Metrics Dashboard Component
const ContentMetricsDashboard = ({ 
  metrics, 
  onMetricClick 
}: { 
  metrics: ContentMetric[]
  onMetricClick?: (metricId: string) => void 
}) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => onMetricClick?.(metric.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{metric.name}</h3>
                  <p className="text-sm text-gray-600">{metric.primaryKPI}</p>
                </div>
                <div className="flex items-center gap-1">
                  {metric.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                  {metric.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                  {metric.trend === "stable" && <Activity className="h-4 w-4 text-gray-600" />}
                  <span className={cn(
                    "text-sm font-medium",
                    metric.trend === "up" ? "text-green-600" : 
                    metric.trend === "down" ? "text-red-600" : "text-gray-600"
                  )}>
                    {metric.change > 0 ? "+" : ""}{metric.change}%
                  </span>
                </div>
              </div>
              
              <div className="text-3xl font-bold mb-2">
                {metric.category === "efficiency" ? `${metric.value}min` :
                 metric.category === "quality" ? metric.value.toFixed(1) :
                 metric.category === "revenue" ? `$${metric.value}` :
                 metric.category === "trends" ? metric.value :
                 `${metric.value}%`}
              </div>
              
              {metric.target && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target Progress</span>
                    <span className="font-medium">
                      {Math.round((metric.value / metric.target) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-2"
                    style={{ background: `${CONTENT_COLORS[metric.category]}20` }}
                  />
                </div>
              )}
              
              <div className="mt-4 flex items-center justify-between">
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ color: CONTENT_COLORS[metric.category] }}
                >
                  {metric.optimizationFocus}
                </Badge>
                <Badge
                  variant={metric.impact === "high" ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    metric.impact === "high" && "bg-red-100 text-red-800",
                    metric.impact === "medium" && "bg-yellow-100 text-yellow-800",
                    metric.impact === "low" && "bg-green-100 text-green-800"
                  )}
                >
                  {metric.impact} impact
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
)

// Success Pattern Analysis Component
const SuccessPatternAnalysis = ({ 
  patterns, 
  onPatternAnalyze 
}: { 
  patterns: SuccessPattern[]
  onPatternAnalyze?: (patternId: string) => void 
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-blue-600" />
        Success Pattern Analysis
      </CardTitle>
      <CardDescription>
        Identify and leverage what works best in your content
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {patterns.map((pattern, index) => (
          <motion.div
            key={pattern.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{pattern.pattern}</h3>
                      <Badge variant="outline" className="text-xs">
                        {pattern.category}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{pattern.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {pattern.frequency}%
                        </div>
                        <div className="text-xs text-gray-600">Frequency</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {pattern.avgPerformance.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600">Avg Performance</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          {pattern.confidence}%
                        </div>
                        <div className="text-xs text-gray-600">Confidence</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Examples:</h5>
                        <div className="flex flex-wrap gap-1">
                          {pattern.examples.map((example, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-2">Recommendations:</h5>
                        <ul className="text-sm space-y-1">
                          {pattern.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Pattern Strength:</span>
                    <Progress value={pattern.confidence} className="w-24 h-2" />
                  </div>
                  <Button 
                    onClick={() => onPatternAnalyze?.(pattern.id)}
                    variant="outline"
                    size="sm"
                  >
                    Analyze Pattern
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
)

// Improvement Opportunities Component  
const ImprovementOpportunities = ({ 
  opportunities, 
  onOpportunityImplement 
}: { 
  opportunities: ImprovementOpportunity[]
  onOpportunityImplement?: (opportunityId: string) => void 
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-yellow-600" />
        Improvement Opportunities
      </CardTitle>
      <CardDescription>
        Areas for enhancement to boost content performance
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {opportunities.map((opportunity, index) => (
          <motion.div
            key={opportunity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={opportunity.severity === "high" ? "destructive" : 
                               opportunity.severity === "medium" ? "default" : "secondary"}
                        className={cn(
                          opportunity.severity === "high" && "bg-red-100 text-red-800",
                          opportunity.severity === "medium" && "bg-yellow-100 text-yellow-800",
                          opportunity.severity === "low" && "bg-green-100 text-green-800"
                        )}
                      >
                        {opportunity.severity} priority
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {opportunity.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{opportunity.title}</h3>
                    <p className="text-gray-600 mb-3">{opportunity.description}</p>
                    
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">
                          +{opportunity.impact}%
                        </div>
                        <div className="text-xs text-gray-600">Potential Impact</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {opportunity.affectedVideos}
                        </div>
                        <div className="text-xs text-gray-600">Affected Videos</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          {opportunity.timeframe}
                        </div>
                        <div className="text-xs text-gray-600">Timeframe</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold text-gray-600">
                          {opportunity.effort}
                        </div>
                        <div className="text-xs text-gray-600">Effort Level</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm mb-2">Action Items:</h5>
                      <ul className="text-sm space-y-1">
                        {opportunity.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Target className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Priority:</span>
                    <Badge 
                      variant="outline"
                      className={cn(
                        opportunity.severity === "high" && "border-red-300 text-red-700",
                        opportunity.severity === "medium" && "border-yellow-300 text-yellow-700",
                        opportunity.severity === "low" && "border-green-300 text-green-700"
                      )}
                    >
                      {opportunity.severity}
                    </Badge>
                  </div>
                  <Button 
                    onClick={() => onOpportunityImplement?.(opportunity.id)}
                    className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                  >
                    Implement Fix
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
)

// Main Component
export function ContentPerformanceAnalytics({
  timeRange = "30",
  onTimeRangeChange,
  onMetricClick,
  onVideoSelect,
  onPatternAnalyze,
  onOpportunityImplement,
  className
}: ContentPerformanceAnalyticsProps) {
  const [activeView, setActiveView] = React.useState("overview")
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null)
  
  const contentMetrics = React.useMemo(() => generateContentMetrics(), [])
  const videoPerformances = React.useMemo(() => generateVideoPerformances(), [])
  const successPatterns = React.useMemo(() => generateSuccessPatterns(), [])
  const improvementOpportunities = React.useMemo(() => generateImprovementOpportunities(), [])
  
  const handleMetricClick = (metricId: string) => {
    setSelectedMetric(metricId)
    onMetricClick?.(metricId)
  }
  
  const handleVideoSelect = (videoId: string) => {
    console.log("Video selected:", videoId)
    onVideoSelect?.(videoId)
  }
  
  const handlePatternAnalyze = (patternId: string) => {
    console.log("Pattern analyzed:", patternId)
    onPatternAnalyze?.(patternId)
  }
  
  const handleOpportunityImplement = (opportunityId: string) => {
    console.log("Opportunity implemented:", opportunityId)
    onOpportunityImplement?.(opportunityId)
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Performance Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Understand what resonates and optimize your creative output
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
            <Video className="w-3 h-3 mr-1" />
            Content Strategy
          </Badge>
        </div>
      </div>
      
      {/* Content Metrics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Content Metrics Dashboard
          </CardTitle>
          <CardDescription>
            Five key content categories with performance insights and optimization focus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentMetricsDashboard 
            metrics={contentMetrics}
            onMetricClick={handleMetricClick}
          />
        </CardContent>
      </Card>
      
      {/* Performance Matrix */}
      <PerformanceMatrix 
        videos={videoPerformances}
        onVideoSelect={handleVideoSelect}
      />
      
      {/* Success Pattern Analysis */}
      <SuccessPatternAnalysis 
        patterns={successPatterns}
        onPatternAnalyze={handlePatternAnalyze}
      />
      
      {/* Improvement Opportunities */}
      <ImprovementOpportunities 
        opportunities={improvementOpportunities}
        onOpportunityImplement={handleOpportunityImplement}
      />
      
      {/* Summary Alert */}
      <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
        <Video className="h-4 w-4" />
        <AlertDescription>
          <strong>Content Performance Summary:</strong> Your 90-120 second personal milestone videos in Zone C 
          are ideal for scaling. Focus on improving business video engagement (+25% impact) and reducing 
          production time inefficiencies. Top pattern: Cultural references achieve 94.1% avg performance.
        </AlertDescription>
      </Alert>
    </div>
  )
}