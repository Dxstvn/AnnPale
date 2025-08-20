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
  FunnelChart,
  Funnel,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter
} from "recharts"
import {
  Users,
  UserCheck,
  UserPlus,
  UserX,
  MapPin,
  Globe,
  Calendar,
  Clock,
  Star,
  Heart,
  MessageSquare,
  Share2,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Eye,
  BarChart3,
  PieChart as PieIcon,
  Navigation,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ChevronDown,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  Search,
  SortAsc,
  SortDesc,
  Calendar as CalendarIcon,
  Timer,
  Zap,
  Award,
  Crown,
  Gift,
  Sparkles,
  Brain,
  Lightbulb,
  ThumbsUp,
  MessageCircle,
  Repeat,
  RotateCcw,
  ArrowLeftRight,
  MapPin as LocationIcon,
  Baby,
  User,
  Users2,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Audience Segment Types
interface AudienceSegment {
  id: string
  name: string
  visualization: "charts" | "maps" | "flow" | "cohort" | "funnel"
  keyMetrics: string[]
  insights: string
  actions: string[]
  data: any[]
  color: string
  percentage: number
  totalCustomers: number
}

// Customer Journey Stage
interface JourneyStage {
  id: string
  name: string
  rate: number
  timeframe: string
  description: string
  actionItems: string[]
  dropoffReasons?: string[]
  optimizations?: string[]
}

// Engagement Metric
interface EngagementMetric {
  id: string
  name: string
  category: "interaction" | "loyalty"
  value: number
  change: number
  trend: "up" | "down" | "stable"
  benchmark: number
  target?: number
  description: string
  impact: "high" | "medium" | "low"
}

// Customer Cohort Data
interface CohortData {
  month: string
  newCustomers: number
  returning: { [key: string]: number }
  retention: { [key: string]: number }
  ltv: number
}

// Component Props
interface AudienceInsightsInterfaceProps {
  timeRange?: "30" | "90" | "180" | "365"
  onTimeRangeChange?: (range: "30" | "90" | "180" | "365") => void
  onSegmentSelect?: (segmentId: string) => void
  onActionTrigger?: (action: string, segmentId: string) => void
  className?: string
}

// Color Palette
const AUDIENCE_COLORS = {
  demographics: "#3B82F6",    // Blue
  behavior: "#10B981",        // Green  
  value: "#8B5CF6",           // Purple
  satisfaction: "#F59E0B",    // Yellow
  growth: "#EC4899",          // Pink
  primary: "#6366F1",         // Indigo
  secondary: "#06B6D4",       // Cyan
  accent: "#F97316"           // Orange
}

// Mock Data Generation
const generateDemographicsData = () => [
  // Age Distribution
  { segment: "18-24", count: 145, percentage: 18, revenue: 8200, color: "#3B82F6" },
  { segment: "25-34", count: 280, percentage: 35, revenue: 18900, color: "#1D4ED8" },
  { segment: "35-44", count: 195, percentage: 24, revenue: 15600, color: "#2563EB" },
  { segment: "45-54", count: 120, percentage: 15, revenue: 9800, color: "#1E40AF" },
  { segment: "55+", count: 65, percentage: 8, revenue: 4200, color: "#1E3A8A" }
]

const generateLocationData = () => [
  { country: "United States", customers: 320, percentage: 40, revenue: 28400 },
  { country: "Canada", customers: 95, percentage: 12, revenue: 8200 },
  { country: "France", customers: 85, percentage: 11, revenue: 7100 },
  { country: "Haiti", customers: 150, percentage: 19, revenue: 9800 },
  { country: "Dominican Republic", customers: 65, percentage: 8, revenue: 4100 },
  { country: "Other", customers: 85, percentage: 10, revenue: 5100 }
]

const generateBehaviorData = () => [
  { stage: "Discovery", customers: 1000, rate: 100, timeSpent: "2.3 days" },
  { stage: "Profile View", customers: 850, rate: 85, timeSpent: "8 minutes" },
  { stage: "Interest", customers: 420, rate: 49, timeSpent: "3 days" },
  { stage: "First Booking", customers: 340, rate: 40, timeSpent: "1 day" },
  { stage: "Return Visit", customers: 204, rate: 60, timeSpent: "14 days" },
  { stage: "Repeat Book", customers: 119, rate: 35, timeSpent: "7 days" },
  { stage: "Become Fan", customers: 51, rate: 15, timeSpent: "ongoing" }
]

const generateValueSegments = () => [
  {
    segment: "VIP Customers",
    ltv: 850,
    aov: 125,
    frequency: 4.2,
    customers: 45,
    color: "#8B5CF6",
    characteristics: ["High spenders", "Frequent buyers", "Brand advocates"]
  },
  {
    segment: "Regular Customers", 
    ltv: 320,
    aov: 85,
    frequency: 2.8,
    customers: 180,
    color: "#A855F7",
    characteristics: ["Consistent buyers", "Price conscious", "Quality focused"]
  },
  {
    segment: "Occasional Customers",
    ltv: 145,
    aov: 65,
    frequency: 1.2,
    customers: 285,
    color: "#C084FC",
    characteristics: ["Price sensitive", "Event-driven", "Comparison shoppers"]
  },
  {
    segment: "First-time Customers",
    ltv: 75,
    aov: 75,
    frequency: 1.0,
    customers: 290,
    color: "#DDD6FE",
    characteristics: ["Testing service", "Price cautious", "Need convincing"]
  }
]

const generateSatisfactionData = () => [
  { rating: 5, count: 320, percentage: 64, nps: 85 },
  { rating: 4, count: 125, percentage: 25, nps: 15 },
  { rating: 3, count: 35, percentage: 7, nps: -20 },
  { rating: 2, count: 15, percentage: 3, nps: -85 },
  { rating: 1, count: 5, percentage: 1, nps: -100 }
]

const generateGrowthData = () => [
  { period: "Jan", newCustomers: 45, returning: 28, churn: 8, growth: 22.5 },
  { period: "Feb", newCustomers: 52, returning: 35, churn: 6, growth: 28.1 },
  { period: "Mar", newCustomers: 48, returning: 42, churn: 9, growth: 25.8 },
  { period: "Apr", newCustomers: 65, returning: 48, churn: 7, growth: 31.2 },
  { period: "May", newCustomers: 72, returning: 55, churn: 5, growth: 35.6 },
  { period: "Jun", newCustomers: 68, returning: 58, churn: 8, growth: 32.4 }
]

// Audience Segments Configuration
const audienceSegments: AudienceSegment[] = [
  {
    id: "demographics",
    name: "Demographics",
    visualization: "charts",
    keyMetrics: ["Age", "Location", "Gender", "Device"],
    insights: "Audience composition and geographic distribution",
    actions: ["Content targeting", "Localization", "Device optimization"],
    data: generateDemographicsData(),
    color: AUDIENCE_COLORS.demographics,
    percentage: 100,
    totalCustomers: 805
  },
  {
    id: "behavior", 
    name: "Behavior",
    visualization: "flow",
    keyMetrics: ["Journey", "Frequency", "Engagement", "Path"],
    insights: "Customer engagement patterns and journey flow",
    actions: ["Experience optimization", "Funnel improvement", "Retention strategy"],
    data: generateBehaviorData(),
    color: AUDIENCE_COLORS.behavior,
    percentage: 85,
    totalCustomers: 685
  },
  {
    id: "value",
    name: "Value",
    visualization: "cohort",
    keyMetrics: ["LTV", "AOV", "Frequency", "Profitability"],
    insights: "Customer revenue contribution and lifetime value",
    actions: ["Retention focus", "Upselling", "VIP programs"],
    data: generateValueSegments(),
    color: AUDIENCE_COLORS.value,
    percentage: 60,
    totalCustomers: 800
  },
  {
    id: "satisfaction",
    name: "Satisfaction", 
    visualization: "charts",
    keyMetrics: ["NPS", "Reviews", "Ratings", "Feedback"],
    insights: "Customer satisfaction and quality perception",
    actions: ["Service improvement", "Quality focus", "Feedback integration"],
    data: generateSatisfactionData(),
    color: AUDIENCE_COLORS.satisfaction,
    percentage: 92,
    totalCustomers: 500
  },
  {
    id: "growth",
    name: "Growth",
    visualization: "funnel",
    keyMetrics: ["Acquisition", "Retention", "Churn", "Expansion"],
    insights: "Customer acquisition and retention effectiveness",
    actions: ["Marketing focus", "Retention campaigns", "Referral programs"],
    data: generateGrowthData(),
    color: AUDIENCE_COLORS.growth,
    percentage: 78,
    totalCustomers: 425
  }
]

// Customer Journey Stages
const customerJourney: JourneyStage[] = [
  {
    id: "discovery",
    name: "Discovery",
    rate: 100,
    timeframe: "3 days",
    description: "Initial awareness through marketing channels",
    actionItems: ["Optimize SEO", "Social media presence", "Referral tracking"],
    optimizations: ["Improve search visibility", "Content marketing", "Influencer partnerships"]
  },
  {
    id: "profile_view",
    name: "Profile View",
    rate: 85,
    timeframe: "8 minutes",
    description: "Visitor explores creator profile and services",
    actionItems: ["Profile optimization", "Portfolio enhancement", "Social proof"],
    dropoffReasons: ["Unclear pricing", "Insufficient samples", "Poor reviews"],
    optimizations: ["Video samples", "Clear pricing", "Testimonials"]
  },
  {
    id: "first_booking",
    name: "First Booking",
    rate: 40,
    timeframe: "1 day",
    description: "Customer makes initial purchase decision",
    actionItems: ["Reduce friction", "Trust signals", "Clear process"],
    dropoffReasons: ["Complex booking", "High pricing", "Trust concerns"],
    optimizations: ["Simplified flow", "Money-back guarantee", "Instant booking"]
  },
  {
    id: "return",
    name: "Return",
    rate: 60,
    timeframe: "14 days", 
    description: "Customer comes back to profile after first experience",
    actionItems: ["Follow-up email", "Satisfaction survey", "New content"],
    optimizations: ["Onboarding sequence", "Value demonstration", "Engagement content"]
  },
  {
    id: "repeat_book",
    name: "Repeat Book",
    rate: 35,
    timeframe: "7 days",
    description: "Customer makes second purchase",
    actionItems: ["Loyalty program", "Personalized offers", "Exclusive content"],
    optimizations: ["Subscription model", "Package deals", "VIP access"]
  },
  {
    id: "become_fan",
    name: "Become Fan",
    rate: 15,
    timeframe: "ongoing",
    description: "Customer becomes loyal advocate and regular buyer",
    actionItems: ["VIP treatment", "Exclusive access", "Referral rewards"],
    optimizations: ["Community building", "Ambassador program", "Co-creation"]
  }
]

// Engagement Metrics
const engagementMetrics: EngagementMetric[] = [
  {
    id: "view_to_book",
    name: "View-to-Book Ratio",
    category: "interaction",
    value: 42.5,
    change: 8.2,
    trend: "up",
    benchmark: 35.0,
    target: 45.0,
    description: "Percentage of profile views that result in bookings",
    impact: "high"
  },
  {
    id: "message_response",
    name: "Message Response Rate",
    category: "interaction", 
    value: 96.8,
    change: 2.1,
    trend: "up",
    benchmark: 92.0,
    target: 98.0,
    description: "Percentage of customer messages responded to",
    impact: "high"
  },
  {
    id: "review_submission",
    name: "Review Submission Rate",
    category: "interaction",
    value: 78.4,
    change: -3.2,
    trend: "down",
    benchmark: 82.0,
    target: 85.0,
    description: "Percentage of customers who leave reviews",
    impact: "medium"
  },
  {
    id: "sharing_frequency",
    name: "Sharing Frequency",
    category: "interaction",
    value: 23.6,
    change: 12.4,
    trend: "up",
    benchmark: 18.0,
    description: "Percentage of customers who share content",
    impact: "medium"
  },
  {
    id: "referral_generation",
    name: "Referral Generation",
    category: "interaction",
    value: 15.8,
    change: 5.7,
    trend: "up",
    benchmark: 12.0,
    target: 20.0,
    description: "Percentage of customers who refer others",
    impact: "high"
  },
  {
    id: "repeat_booking",
    name: "Repeat Booking Rate",
    category: "loyalty",
    value: 58.2,
    change: 4.5,
    trend: "up",
    benchmark: 52.0,
    target: 65.0,
    description: "Percentage of customers who book again",
    impact: "high"
  },
  {
    id: "customer_ltv",
    name: "Customer Lifetime Value",
    category: "loyalty",
    value: 285,
    change: 18.7,
    trend: "up",
    benchmark: 220,
    target: 350,
    description: "Average revenue per customer over lifetime",
    impact: "high"
  },
  {
    id: "retention_rate",
    name: "Retention Rate",
    category: "loyalty",
    value: 67.5,
    change: -2.8,
    trend: "down",
    benchmark: 70.0,
    target: 75.0,
    description: "Percentage of customers retained after 6 months",
    impact: "high"
  },
  {
    id: "advocacy_score",
    name: "Advocacy Score",
    category: "loyalty",
    value: 8.4,
    change: 0.8,
    trend: "up",
    benchmark: 7.5,
    target: 9.0,
    description: "NPS-based customer advocacy measurement",
    impact: "medium"
  }
]

// Segment Display Component
const SegmentDisplay = ({ 
  segment, 
  isSelected, 
  onSelect 
}: { 
  segment: AudienceSegment
  isSelected: boolean
  onSelect: (id: string) => void 
}) => {
  const getVisualizationIcon = (type: string) => {
    switch (type) {
      case "charts": return BarChart3
      case "maps": return MapPin
      case "flow": return Navigation
      case "cohort": return Users
      case "funnel": return Target
      default: return Activity
    }
  }

  const Icon = getVisualizationIcon(segment.visualization)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={cn(
          "cursor-pointer transition-all",
          isSelected 
            ? "ring-2 ring-purple-600 bg-purple-50 dark:bg-purple-900/20"
            : "hover:shadow-md"
        )}
        onClick={() => onSelect(segment.id)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${segment.color}20` }}
              >
                <Icon 
                  className="h-5 w-5"
                  style={{ color: segment.color }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{segment.name}</h3>
                <p className="text-sm text-gray-600">{segment.insights}</p>
              </div>
            </div>
            <Badge variant="outline">
              {segment.totalCustomers.toLocaleString()} customers
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Engagement Rate</span>
              <span className="font-medium">{segment.percentage}%</span>
            </div>
            <Progress value={segment.percentage} className="h-2" />
            
            <div className="flex flex-wrap gap-1 mt-3">
              {segment.keyMetrics.map((metric) => (
                <Badge key={metric} variant="secondary" className="text-xs">
                  {metric}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Customer Journey Flow
const CustomerJourneyFlow = ({ journey }: { journey: JourneyStage[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Navigation className="h-5 w-5 text-blue-600" />
        Customer Journey Visualization
      </CardTitle>
      <CardDescription>
        Typical customer path from discovery to becoming a fan
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {/* Journey Flow */}
        <div className="relative">
          <div className="flex flex-col space-y-4">
            {journey.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center space-x-4">
                  {/* Stage Card */}
                  <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{stage.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={cn(
                            stage.rate >= 60 ? "text-green-600" :
                            stage.rate >= 30 ? "text-yellow-600" :
                            "text-red-600"
                          )}
                        >
                          {stage.rate}% rate
                        </Badge>
                        <span className="text-sm text-gray-600">{stage.timeframe}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{stage.description}</p>
                    <div className="flex items-center justify-between">
                      <Progress value={stage.rate} className="flex-1 mr-4 h-2" />
                      <span className="text-sm font-medium">{stage.rate}%</span>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  {index < journey.length - 1 && (
                    <div className="flex flex-col items-center">
                      <ArrowDown className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400 mt-1">
                        {Math.round((journey[index + 1].rate / stage.rate) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Journey Summary */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <div className="text-sm text-gray-600">Profile View Rate</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">40%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">15%</div>
              <div className="text-sm text-gray-600">Fan Conversion</div>
            </div>
          </Card>
        </div>
      </div>
    </CardContent>
  </Card>
)

// Engagement Metrics Display
const EngagementMetricsDisplay = ({ metrics }: { metrics: EngagementMetric[] }) => (
  <div className="space-y-6">
    {/* Interaction Patterns */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" />
          Interaction Patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.filter(m => m.category === "interaction").map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{metric.name}</h4>
                  <div className="flex items-center gap-1">
                    {metric.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                    {metric.trend === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                    {metric.trend === "stable" && <Activity className="h-3 w-3 text-gray-600" />}
                    <span className={cn(
                      "text-xs",
                      metric.trend === "up" ? "text-green-600" :
                      metric.trend === "down" ? "text-red-600" :
                      "text-gray-600"
                    )}>
                      {metric.change > 0 ? "+" : ""}{metric.change}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {metric.name.includes("LTV") ? `$${metric.value}` : `${metric.value}%`}
                </div>
                <div className="text-xs text-gray-600 mb-2">{metric.description}</div>
                {metric.target && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Target: {metric.target}%</span>
                      <span>Benchmark: {metric.benchmark}%</span>
                    </div>
                    <Progress value={(metric.value / metric.target) * 100} className="h-1" />
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Loyalty Indicators */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-600" />
          Loyalty Indicators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.filter(m => m.category === "loyalty").map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{metric.name}</h4>
                  <Badge 
                    variant="outline"
                    className={cn(
                      metric.impact === "high" ? "text-red-600" :
                      metric.impact === "medium" ? "text-yellow-600" :
                      "text-green-600"
                    )}
                  >
                    {metric.impact}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {metric.name.includes("LTV") ? `$${metric.value}` : 
                   metric.name.includes("Score") ? metric.value.toFixed(1) :
                   `${metric.value}%`}
                </div>
                <div className="text-xs text-gray-600 mb-2">{metric.description}</div>
                <div className="flex items-center gap-1">
                  {metric.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                  {metric.trend === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                  {metric.trend === "stable" && <Activity className="h-3 w-3 text-gray-600" />}
                  <span className={cn(
                    "text-xs",
                    metric.trend === "up" ? "text-green-600" :
                    metric.trend === "down" ? "text-red-600" :
                    "text-gray-600"
                  )}>
                    {metric.change > 0 ? "+" : ""}{metric.change}%
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

// Main Component
export function AudienceInsightsInterface({
  timeRange = "90",
  onTimeRangeChange,
  onSegmentSelect,
  onActionTrigger,
  className
}: AudienceInsightsInterfaceProps) {
  const [selectedSegment, setSelectedSegment] = React.useState<string>("demographics")
  const [activeView, setActiveView] = React.useState("overview")

  const currentSegment = audienceSegments.find(s => s.id === selectedSegment) || audienceSegments[0]

  const handleSegmentSelect = (segmentId: string) => {
    setSelectedSegment(segmentId)
    onSegmentSelect?.(segmentId)
  }

  const handleActionTrigger = (action: string) => {
    onActionTrigger?.(action, selectedSegment)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Audience Insights Interface</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Reveal customer patterns and preferences to better serve your audience
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(v) => onTimeRangeChange?.(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-blue-600">
            <Users className="w-3 h-3 mr-1" />
            Customer Analytics
          </Badge>
        </div>
      </div>

      {/* Audience Segmentation Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Audience Segmentation
          </CardTitle>
          <CardDescription>
            Five key customer segments with visualization and action insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {audienceSegments.map((segment) => (
              <SegmentDisplay
                key={segment.id}
                segment={segment}
                isSelected={selectedSegment === segment.id}
                onSelect={handleSegmentSelect}
              />
            ))}
          </div>
          
          {/* Selected Segment Details */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Selected: {currentSegment.name}</h4>
              <Badge style={{ backgroundColor: currentSegment.color, color: "white" }}>
                {currentSegment.visualization} visualization
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{currentSegment.insights}</p>
            <div className="flex flex-wrap gap-2">
              {currentSegment.actions.map((action) => (
                <Button 
                  key={action}
                  variant="outline" 
                  size="sm"
                  onClick={() => handleActionTrigger(action)}
                >
                  {action}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Journey Visualization */}
      <CustomerJourneyFlow journey={customerJourney} />

      {/* Engagement Metrics */}
      <EngagementMetricsDisplay metrics={engagementMetrics} />

      {/* Summary Alert */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <Users className="h-4 w-4" />
        <AlertDescription>
          <strong>Audience Insights Summary:</strong> Your audience is 65% repeat customers with strong loyalty 
          indicators. Focus on the 40% conversion rate in the customer journey and the 15% fan conversion 
          for maximum growth impact. Top opportunity: Improve profile-to-booking conversion.
        </AlertDescription>
      </Alert>
    </div>
  )
}