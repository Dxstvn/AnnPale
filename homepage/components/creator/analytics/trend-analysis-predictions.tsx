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
  ComposedChart,
  ReferenceLine,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Treemap
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Calendar,
  Clock,
  Target,
  Zap,
  AlertTriangle,
  Brain,
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
  LineChart as LineIcon,
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
  Umbrella,
  Wind,
  Thermometer,
  Navigation,
  MapPin,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Video,
  PlayCircle,
  Pause,
  FastForward,
  Rewind,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Shuffle,
  Repeat,
  Music,
  Headphones,
  Radio,
  Mic,
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
  ShoppingCart,
  CreditCard,
  Banknote,
  Coins,
  Wallet,
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
  Copy,
  Cut,
  Paste,
  Scissors,
  Paperclip,
  Link,
  Unlink,
  ExternalLink,
  Home,
  Building,
  Store,
  Warehouse,
  Factory,
  Truck,
  Car,
  Bike,
  Bus,
  Train,
  Plane,
  Ship,
  Anchor,
  Compass,
  Map,
  Route,
  Road,
  Bridge,
  Mountain,
  Tree,
  Flower,
  Leaf,
  Sprout,
  Seedling,
  Apple,
  Cherry,
  Grape,
  Banana,
  Orange,
  Lemon,
  Strawberry,
  Carrot,
  Corn,
  Pizza,
  Coffee,
  Wine,
  Beer,
  IceCream,
  Cake,
  Cookie,
  Candy,
  Donut,
  Bread,
  Milk,
  Egg,
  Fish,
  Meat,
  Soup,
  Salad,
  Sandwich,
  Burger,
  Fries,
  HotDog,
  Taco,
  Sushi,
  Ramen,
  Dumpling,
  Rice,
  Pasta,
  Noodles
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Trend Analysis Types
interface TrendDetection {
  id: string
  type: "seasonal" | "growth" | "anomaly" | "emerging" | "declining"
  name: string
  timeWindow: string
  visualization: "overlay_lines" | "trend_arrow" | "spike_indicator" | "rising_keywords" | "falling_graph"
  alertThreshold: string
  actionSuggestion: string
  currentValue: number
  previousValue: number
  variance: number
  status: "normal" | "warning" | "alert" | "critical"
  confidence: number
  impact: "high" | "medium" | "low"
  lastDetected: string
}

interface PredictiveAnalytic {
  id: string
  category: "demand" | "revenue" | "engagement" | "growth" | "risk"
  name: string
  prediction: number | string
  confidence: number
  timeframe: string
  methodology: string
  factors: string[]
  accuracy: number
  trend: "up" | "down" | "stable"
  variance: number
}

interface DemandForecast {
  period: string
  estimate: number
  confidence: number
  factors: string[]
  peakDays: string[]
  quietPeriods: string[]
  specialEvents: string[]
  actualValue?: number
}

interface RevenueProjection {
  period: string
  estimate: number
  confidence: number
  growthTrajectory: number
  goalAchievement: number
  riskFactors: string[]
  opportunities: string[]
  actualValue?: number
}

interface TrendAlert {
  id: string
  type: "spike" | "drop" | "anomaly" | "pattern" | "threshold"
  severity: "low" | "medium" | "high" | "critical"
  metric: string
  description: string
  threshold: number
  currentValue: number
  timeframe: string
  suggestedActions: string[]
  affectedAreas: string[]
  isActive: boolean
  triggeredAt: string
}

// Component Props
interface TrendAnalysisPredictionsProps {
  timeRange?: "7" | "30" | "90" | "365"
  onTimeRangeChange?: (range: "7" | "30" | "90" | "365") => void
  onTrendClick?: (trendId: string) => void
  onForecastUpdate?: (forecastId: string) => void
  onAlertAction?: (alertId: string, action: string) => void
  className?: string
}

// Color Scheme
const TREND_COLORS = {
  seasonal: "#3B82F6",      // Blue - Seasonal patterns
  growth: "#10B981",        // Green - Growth trends
  anomaly: "#EF4444",       // Red - Anomalies
  emerging: "#8B5CF6",      // Purple - Emerging trends
  declining: "#F59E0B",     // Yellow - Declining trends
  prediction: "#06B6D4",    // Cyan - Predictions
  forecast: "#EC4899",      // Pink - Forecasts
  normal: "#10B981",
  warning: "#F59E0B",
  alert: "#EF4444",
  critical: "#DC2626"
}

// Mock Data Generation
const generateTrendData = (days: number) => {
  const data = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Seasonal patterns
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
    const seasonal = 1 + 0.3 * Math.sin((dayOfYear / 365) * 2 * Math.PI)
    
    // Weekly patterns
    const dayOfWeek = date.getDay()
    const weekly = dayOfWeek === 5 || dayOfWeek === 6 ? 1.4 : dayOfWeek === 1 ? 0.7 : 1.0
    
    // Growth trend
    const growthTrend = 1 + ((days - i) / days) * 0.25
    
    // Add some noise and anomalies
    const noise = 0.9 + Math.random() * 0.2
    const anomaly = Math.random() < 0.05 ? 1.8 : 1.0 // 5% chance of anomaly
    
    const baseValue = 100
    const requests = Math.round(baseValue * seasonal * weekly * growthTrend * noise * anomaly)
    const revenue = requests * (80 + Math.random() * 40)
    const engagement = 60 + Math.random() * 35
    
    data.push({
      date: date.toISOString().split('T')[0],
      period: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
      requests: requests,
      revenue: Math.round(revenue),
      engagement: Math.round(engagement),
      seasonal_factor: seasonal,
      weekly_factor: weekly,
      growth_factor: growthTrend,
      anomaly_factor: anomaly,
      predicted_requests: Math.round(requests * (0.95 + Math.random() * 0.1)),
      predicted_revenue: Math.round(revenue * (0.95 + Math.random() * 0.1))
    })
  }
  
  return data
}

const generateSeasonalData = () => [
  { month: "Jan", thisYear: 85, lastYear: 78, predicted: 92 },
  { month: "Feb", thisYear: 120, lastYear: 95, predicted: 135 },
  { month: "Mar", thisYear: 95, lastYear: 88, predicted: 105 },
  { month: "Apr", thisYear: 110, lastYear: 102, predicted: 125 },
  { month: "May", thisYear: 130, lastYear: 115, predicted: 145 },
  { month: "Jun", thisYear: 105, lastYear: 98, predicted: 115 },
  { month: "Jul", thisYear: 140, lastYear: 125, predicted: 155 },
  { month: "Aug", thisYear: 135, lastYear: 120, predicted: 150 },
  { month: "Sep", thisYear: 115, lastYear: 105, predicted: 125 },
  { month: "Oct", thisYear: 125, lastYear: 110, predicted: 135 },
  { month: "Nov", thisYear: 160, lastYear: 145, predicted: 175 },
  { month: "Dec", thisYear: 190, lastYear: 170, predicted: 210 }
]

// Trend Detection Data
const trendDetections: TrendDetection[] = [
  {
    id: "seasonal_holiday",
    type: "seasonal",
    name: "Holiday Season Surge",
    timeWindow: "Year-over-year",
    visualization: "overlay_lines",
    alertThreshold: "±20% variance",
    actionSuggestion: "Prepare inventory",
    currentValue: 190,
    previousValue: 170,
    variance: 11.8,
    status: "normal",
    confidence: 95,
    impact: "high",
    lastDetected: "2024-12-01"
  },
  {
    id: "growth_engagement",
    type: "growth",
    name: "Engagement Growth Trend",
    timeWindow: "30-day rolling",
    visualization: "trend_arrow",
    alertThreshold: "±15% change",
    actionSuggestion: "Adjust capacity",
    currentValue: 78.5,
    previousValue: 68.2,
    variance: 15.1,
    status: "warning",
    confidence: 88,
    impact: "medium",
    lastDetected: "2024-03-15"
  },
  {
    id: "anomaly_spike",
    type: "anomaly",
    name: "Unusual Request Spike",
    timeWindow: "Real-time",
    visualization: "spike_indicator",
    alertThreshold: "3σ deviation",
    actionSuggestion: "Investigate cause",
    currentValue: 245,
    previousValue: 135,
    variance: 81.5,
    status: "alert",
    confidence: 92,
    impact: "high",
    lastDetected: "2024-03-16T14:30:00"
  },
  {
    id: "emerging_business",
    type: "emerging",
    name: "Business Video Demand",
    timeWindow: "7-day window",
    visualization: "rising_keywords",
    alertThreshold: "50% increase",
    actionSuggestion: "Early adoption",
    currentValue: 45,
    previousValue: 28,
    variance: 60.7,
    status: "warning",
    confidence: 76,
    impact: "medium",
    lastDetected: "2024-03-14"
  },
  {
    id: "declining_holiday",
    type: "declining",
    name: "Holiday Message Decline",
    timeWindow: "30-day trend",
    visualization: "falling_graph",
    alertThreshold: "-25% change",
    actionSuggestion: "Pivot strategy",
    currentValue: 35,
    previousValue: 48,
    variance: -27.1,
    status: "critical",
    confidence: 91,
    impact: "high",
    lastDetected: "2024-03-10"
  }
]

// Predictive Analytics Data
const predictiveAnalytics: PredictiveAnalytic[] = [
  {
    id: "demand_weekly",
    category: "demand",
    name: "Next Week Requests",
    prediction: "45-50 requests",
    confidence: 87,
    timeframe: "7 days",
    methodology: "ARIMA + Seasonal",
    factors: ["Historical patterns", "Weekly cycles", "Special events"],
    accuracy: 92,
    trend: "up",
    variance: 8.5
  },
  {
    id: "revenue_monthly",
    category: "revenue",
    name: "Month-end Revenue",
    prediction: 12500,
    confidence: 85,
    timeframe: "30 days",
    methodology: "Linear regression",
    factors: ["Current trajectory", "Seasonal patterns", "Market trends"],
    accuracy: 89,
    trend: "up",
    variance: 15.2
  },
  {
    id: "engagement_forecast",
    category: "engagement",
    name: "Engagement Rate",
    prediction: 82.5,
    confidence: 79,
    timeframe: "14 days",
    methodology: "Moving average",
    factors: ["Content quality", "Audience response", "Platform changes"],
    accuracy: 84,
    trend: "stable",
    variance: 4.2
  },
  {
    id: "growth_projection",
    category: "growth",
    name: "Growth Trajectory",
    prediction: "15% monthly",
    confidence: 91,
    timeframe: "90 days",
    methodology: "Exponential smoothing",
    factors: ["Market expansion", "Content strategy", "Customer acquisition"],
    accuracy: 86,
    trend: "up",
    variance: 12.8
  },
  {
    id: "risk_assessment",
    category: "risk",
    name: "Churn Risk",
    prediction: "8.2% monthly",
    confidence: 73,
    timeframe: "30 days",
    methodology: "Logistic regression",
    factors: ["Engagement decline", "Payment delays", "Competition"],
    accuracy: 78,
    trend: "down",
    variance: 18.5
  }
]

// Demand Forecasting Data
const demandForecasts: DemandForecast[] = [
  {
    period: "Next Week",
    estimate: 47,
    confidence: 87,
    factors: ["Historical average", "Weekly seasonality", "Trend growth"],
    peakDays: ["Tuesday", "Saturday"],
    quietPeriods: ["Monday morning", "Wednesday evening"],
    specialEvents: ["Weekend promotions"]
  },
  {
    period: "Next Month",
    estimate: 195,
    confidence: 82,
    factors: ["Seasonal patterns", "Growth trajectory", "Market conditions"],
    peakDays: ["Fridays", "Saturdays", "Sundays"],
    quietPeriods: ["Early weekdays"],
    specialEvents: ["Valentine's surge expected", "Spring break uptick"]
  },
  {
    period: "Next Quarter",
    estimate: 620,
    confidence: 76,
    factors: ["Yearly patterns", "Business expansion", "Marketing campaigns"],
    peakDays: ["Weekends", "Holidays"],
    quietPeriods: ["Mid-week periods"],
    specialEvents: ["Summer vacation season", "Back-to-school period"]
  }
]

// Revenue Projections Data
const revenueProjections: RevenueProjection[] = [
  {
    period: "Month-end",
    estimate: 12500,
    confidence: 85,
    growthTrajectory: 15,
    goalAchievement: 92,
    riskFactors: ["Market competition", "Seasonal slowdown"],
    opportunities: ["Premium service expansion", "New customer segments"]
  },
  {
    period: "Quarter-end",
    estimate: 38500,
    confidence: 78,
    growthTrajectory: 18,
    goalAchievement: 96,
    riskFactors: ["Economic uncertainty", "Platform changes"],
    opportunities: ["International expansion", "Corporate partnerships"]
  },
  {
    period: "Year-end",
    estimate: 165000,
    confidence: 71,
    growthTrajectory: 22,
    goalAchievement: 103,
    riskFactors: ["Market saturation", "Competitive pressure"],
    opportunities: ["New product lines", "Technology integration"]
  }
]

// Trend Alerts Data
const trendAlerts: TrendAlert[] = [
  {
    id: "alert_spike",
    type: "spike",
    severity: "high",
    metric: "Request Volume",
    description: "Unusual 80% spike in requests detected in the last 4 hours",
    threshold: 150,
    currentValue: 245,
    timeframe: "4 hours",
    suggestedActions: [
      "Investigate traffic source",
      "Check for viral content",
      "Prepare for increased capacity",
      "Monitor system performance"
    ],
    affectedAreas: ["Order processing", "Response time", "Quality control"],
    isActive: true,
    triggeredAt: "2024-03-16T14:30:00"
  },
  {
    id: "alert_decline",
    type: "drop",
    severity: "medium",
    metric: "Engagement Rate",
    description: "25% decline in engagement rate over the past week",
    threshold: 70,
    currentValue: 52,
    timeframe: "7 days",
    suggestedActions: [
      "Review content quality",
      "Analyze customer feedback",
      "Refresh marketing strategy",
      "Engage with audience"
    ],
    affectedAreas: ["Customer satisfaction", "Repeat bookings", "Revenue"],
    isActive: true,
    triggeredAt: "2024-03-14T09:15:00"
  },
  {
    id: "alert_pattern",
    type: "pattern",
    severity: "low",
    metric: "Seasonal Pattern",
    description: "Early indicators of Valentine's Day demand surge detected",
    threshold: 120,
    currentValue: 135,
    timeframe: "2 weeks",
    suggestedActions: [
      "Prepare Valentine's templates",
      "Increase availability",
      "Create romantic themes",
      "Plan promotional campaign"
    ],
    affectedAreas: ["Inventory planning", "Scheduling", "Marketing"],
    isActive: false,
    triggeredAt: "2024-01-28T12:00:00"
  }
]

// Trend Detection Framework Component
const TrendDetectionFramework = ({ 
  trends, 
  onTrendClick 
}: { 
  trends: TrendDetection[]
  onTrendClick?: (trendId: string) => void 
}) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case "normal": return TREND_COLORS.normal
      case "warning": return TREND_COLORS.warning
      case "alert": return TREND_COLORS.alert
      case "critical": return TREND_COLORS.critical
      default: return "#gray"
    }
  }

  const getTrendIcon = (type: string) => {
    switch(type) {
      case "seasonal": return Calendar
      case "growth": return TrendingUp
      case "anomaly": return Zap
      case "emerging": return ArrowUp
      case "declining": return TrendingDown
      default: return Activity
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trends.map((trend, index) => {
          const Icon = getTrendIcon(trend.type)
          return (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => onTrendClick?.(trend.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${TREND_COLORS[trend.type]}20` }}
                      >
                        <Icon 
                          className="h-5 w-5"
                          style={{ color: TREND_COLORS[trend.type] }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{trend.name}</h3>
                        <p className="text-sm text-gray-600">{trend.timeWindow}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      style={{ 
                        borderColor: getStatusColor(trend.status), 
                        color: getStatusColor(trend.status) 
                      }}
                    >
                      {trend.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Value</span>
                      <span className="font-bold">{trend.currentValue}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Variance</span>
                      <div className="flex items-center gap-1">
                        {trend.variance > 0 ? (
                          <ArrowUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-red-600" />
                        )}
                        <span className={cn(
                          "text-sm font-medium",
                          trend.variance > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {Math.abs(trend.variance).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <span className="text-sm font-medium">{trend.confidence}%</span>
                    </div>
                    <Progress value={trend.confidence} className="h-2" />
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                      style={{ color: TREND_COLORS[trend.type] }}
                    >
                      {trend.actionSuggestion}
                    </Badge>
                    <Badge
                      variant={trend.impact === "high" ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        trend.impact === "high" && "bg-red-100 text-red-800",
                        trend.impact === "medium" && "bg-yellow-100 text-yellow-800",
                        trend.impact === "low" && "bg-green-100 text-green-800"
                      )}
                    >
                      {trend.impact} impact
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Predictive Analytics Dashboard Component
const PredictiveAnalyticsDashboard = ({ 
  analytics 
}: { 
  analytics: PredictiveAnalytic[] 
}) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {analytics.map((analytic, index) => (
        <motion.div
          key={analytic.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{analytic.name}</h3>
                  <p className="text-sm text-gray-600">{analytic.timeframe} forecast</p>
                </div>
                <Badge variant="outline" className="text-blue-600">
                  {analytic.category}
                </Badge>
              </div>
              
              <div className="text-3xl font-bold mb-2">
                {typeof analytic.prediction === 'number' 
                  ? analytic.category === 'revenue' 
                    ? `$${analytic.prediction.toLocaleString()}`
                    : analytic.prediction.toLocaleString()
                  : analytic.prediction}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Confidence</span>
                  <span className="font-medium">{analytic.confidence}%</span>
                </div>
                <Progress value={analytic.confidence} className="h-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-medium">{analytic.accuracy}%</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Trend</span>
                  <div className="flex items-center gap-1">
                    {analytic.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                    {analytic.trend === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                    {analytic.trend === "stable" && <Activity className="h-3 w-3 text-gray-600" />}
                    <span className={cn(
                      "text-xs",
                      analytic.trend === "up" ? "text-green-600" : 
                      analytic.trend === "down" ? "text-red-600" : "text-gray-600"
                    )}>
                      {analytic.trend}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-gray-600 mb-2">Methodology: {analytic.methodology}</p>
                <div className="flex flex-wrap gap-1">
                  {analytic.factors.slice(0, 2).map((factor, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                  {analytic.factors.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{analytic.factors.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
)

// Demand Forecasting Component
const DemandForecastingDisplay = ({ 
  forecasts,
  onForecastUpdate 
}: { 
  forecasts: DemandForecast[]
  onForecastUpdate?: (forecastId: string) => void 
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-blue-600" />
        Demand Forecasting
      </CardTitle>
      <CardDescription>
        Predictive analysis of upcoming request volume and patterns
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {forecasts.map((forecast, index) => (
          <motion.div
            key={forecast.period}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{forecast.period}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-bold text-blue-600">
                        {forecast.estimate} requests
                      </span>
                      <Badge variant="outline" className="text-blue-600">
                        {forecast.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onForecastUpdate?.(forecast.period)}
                  >
                    Update
                    <RefreshCw className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Peak Days:</h5>
                    <div className="flex flex-wrap gap-1">
                      {forecast.peakDays.map((day, idx) => (
                        <Badge key={idx} className="text-xs bg-green-100 text-green-800">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Quiet Periods:</h5>
                    <div className="flex flex-wrap gap-1">
                      {forecast.quietPeriods.map((period, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {period}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {forecast.specialEvents.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-sm mb-2">Special Events:</h5>
                    <div className="flex flex-wrap gap-1">
                      {forecast.specialEvents.map((event, idx) => (
                        <Badge key={idx} className="text-xs bg-purple-100 text-purple-800">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <h5 className="font-medium text-sm mb-2">Key Factors:</h5>
                  <ul className="text-sm space-y-1">
                    {forecast.factors.map((factor, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-gray-600">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
)

// Revenue Projections Component
const RevenueProjectionsDisplay = ({ 
  projections 
}: { 
  projections: RevenueProjection[] 
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-green-600" />
        Revenue Projections
      </CardTitle>
      <CardDescription>
        Financial forecasts with growth trajectories and goal tracking
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {projections.map((projection, index) => (
          <motion.div
            key={projection.period}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{projection.period}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-bold text-green-600">
                        ${projection.estimate.toLocaleString()}
                      </span>
                      <Badge variant="outline" className="text-green-600">
                        {projection.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      +{projection.growthTrajectory}%
                    </div>
                    <div className="text-xs text-gray-600">Growth Trajectory</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {projection.goalAchievement}%
                    </div>
                    <div className="text-xs text-gray-600">Goal Achievement</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {projection.confidence}%
                    </div>
                    <div className="text-xs text-gray-600">Confidence Level</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2 text-red-600">Risk Factors:</h5>
                    <ul className="text-sm space-y-1">
                      {projection.riskFactors.map((risk, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                          <span className="text-gray-600">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2 text-green-600">Opportunities:</h5>
                    <ul className="text-sm space-y-1">
                      {projection.opportunities.map((opportunity, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Lightbulb className="h-3 w-3 text-green-600" />
                          <span className="text-gray-600">{opportunity}</span>
                        </li>
                      ))}
                    </ul>
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

// Trend Alerts Component
const TrendAlertsDisplay = ({ 
  alerts, 
  onAlertAction 
}: { 
  alerts: TrendAlert[]
  onAlertAction?: (alertId: string, action: string) => void 
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange-600" />
        Trend Alerts
      </CardTitle>
      <CardDescription>
        Real-time alerts for significant pattern changes and anomalies
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "border-l-4",
              alert.severity === "critical" && "border-l-red-500 bg-red-50 dark:bg-red-900/20",
              alert.severity === "high" && "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20",
              alert.severity === "medium" && "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
              alert.severity === "low" && "border-l-green-500 bg-green-50 dark:bg-green-900/20"
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={alert.severity === "critical" || alert.severity === "high" ? "destructive" : "default"}
                        className={cn(
                          alert.severity === "critical" && "bg-red-100 text-red-800",
                          alert.severity === "high" && "bg-orange-100 text-orange-800",
                          alert.severity === "medium" && "bg-yellow-100 text-yellow-800",
                          alert.severity === "low" && "bg-green-100 text-green-800"
                        )}
                      >
                        {alert.severity} severity
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.type}
                      </Badge>
                      {alert.isActive && (
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{alert.metric}</h3>
                    <p className="text-gray-600 mb-3">{alert.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-600">Threshold: </span>
                        <span className="font-medium">{alert.threshold}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Current: </span>
                        <span className="font-medium">{alert.currentValue}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Timeframe: </span>
                        <span className="font-medium">{alert.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Suggested Actions:</h5>
                    <div className="grid gap-2">
                      {alert.suggestedActions.map((action, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => onAlertAction?.(alert.id, action)}
                          className="justify-start text-left"
                        >
                          <Target className="h-3 w-3 mr-2" />
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Affected Areas:</h5>
                    <div className="flex flex-wrap gap-1">
                      {alert.affectedAreas.map((area, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
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

// Main Component
export function TrendAnalysisPredictions({
  timeRange = "30",
  onTimeRangeChange,
  onTrendClick,
  onForecastUpdate,
  onAlertAction,
  className
}: TrendAnalysisPredictionsProps) {
  const [activeView, setActiveView] = React.useState("trends")
  const [selectedTrend, setSelectedTrend] = React.useState<string | null>(null)
  
  const trendData = React.useMemo(() => generateTrendData(parseInt(timeRange)), [timeRange])
  const seasonalData = React.useMemo(() => generateSeasonalData(), [])
  
  const handleTrendClick = (trendId: string) => {
    setSelectedTrend(trendId)
    onTrendClick?.(trendId)
  }
  
  const handleForecastUpdate = (forecastId: string) => {
    console.log("Forecast updated:", forecastId)
    onForecastUpdate?.(forecastId)
  }
  
  const handleAlertAction = (alertId: string, action: string) => {
    console.log("Alert action:", alertId, action)
    onAlertAction?.(alertId, action)
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Trend Analysis & Predictions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Surface patterns and trends to anticipate demand and make proactive decisions
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
          <Badge variant="outline" className="text-cyan-600">
            <Brain className="w-3 h-3 mr-1" />
            Predictive Analytics
          </Badge>
        </div>
      </div>
      
      {/* Trend Detection Framework */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-600" />
            Trend Detection Framework
          </CardTitle>
          <CardDescription>
            Five types of trend detection with visualization and alert thresholds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrendDetectionFramework 
            trends={trendDetections}
            onTrendClick={handleTrendClick}
          />
        </CardContent>
      </Card>
      
      {/* Seasonal Trends Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Seasonal Trends Analysis
          </CardTitle>
          <CardDescription>
            Year-over-year comparison with predictive overlay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="lastYear"
                  stackId="1"
                  stroke={TREND_COLORS.seasonal}
                  fill={TREND_COLORS.seasonal}
                  fillOpacity={0.3}
                  name="Last Year"
                />
                <Line
                  type="monotone"
                  dataKey="thisYear"
                  stroke={TREND_COLORS.growth}
                  strokeWidth={3}
                  name="This Year"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke={TREND_COLORS.prediction}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Predictive Analytics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Predictive Analytics Dashboard
          </CardTitle>
          <CardDescription>
            AI-powered forecasts across demand, revenue, engagement, growth, and risk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PredictiveAnalyticsDashboard analytics={predictiveAnalytics} />
        </CardContent>
      </Card>
      
      {/* Demand Forecasting & Revenue Projections */}
      <div className="grid md:grid-cols-2 gap-6">
        <DemandForecastingDisplay 
          forecasts={demandForecasts}
          onForecastUpdate={handleForecastUpdate}
        />
        <RevenueProjectionsDisplay projections={revenueProjections} />
      </div>
      
      {/* Trend Alerts */}
      <TrendAlertsDisplay 
        alerts={trendAlerts}
        onAlertAction={handleAlertAction}
      />
      
      {/* Summary Alert */}
      <Alert className="border-cyan-200 bg-cyan-50 dark:bg-cyan-900/20">
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>Trend Analysis Summary:</strong> Unusual 80% request spike detected (investigate cause). 
          Valentine's surge expected next week (+50% demand). Holiday message decline (-27%) requires strategy 
          pivot. Revenue projection: $12.5K month-end (85% confidence, 92% goal achievement).
        </AlertDescription>
      </Alert>
    </div>
  )
}