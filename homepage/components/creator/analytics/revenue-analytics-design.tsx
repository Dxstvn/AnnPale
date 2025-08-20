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
  ComposedChart,
  Treemap,
  CalendarChart
} from "recharts"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Activity,
  Clock,
  Star,
  Award,
  Users,
  Eye,
  Settings,
  Filter,
  Download,
  Share2,
  RefreshCw,
  Lightbulb,
  Brain,
  Sparkles,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  Calculator,
  PiggyBank,
  Coins,
  HandCoins,
  Receipt,
  FileText,
  Gauge,
  Timer,
  Flame,
  MapPin,
  Globe,
  Crown,
  Gift,
  Heart,
  MessageSquare,
  Video,
  ShoppingBag,
  Package,
  Truck,
  CreditCard
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Revenue Data Types
interface RevenueMetric {
  id: string
  name: string
  value: number
  change: number
  trend: "up" | "down" | "stable"
  visualization: "line" | "bar" | "heatmap" | "donut" | "trend"
  timeRange: string
  drillDown: string[]
  actionTrigger: string
  target?: number
  benchmark?: number
}

interface RevenueBreakdown {
  category: string
  subcategories: {
    name: string
    amount: number
    percentage: number
    color: string
  }[]
  totalAmount: number
  percentage: number
  color: string
}

interface PredictiveData {
  period: string
  actual?: number
  projected: number
  confidence: number
  seasonal_factor?: number
  trend_factor?: number
}

interface OptimizationSuggestion {
  id: string
  type: "pricing" | "service_mix" | "peak_time" | "upsell" | "segment"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  effort: "low" | "medium" | "high"
  potential_revenue: number
  confidence: number
  timeframe: string
  actions: string[]
  metrics: string[]
}

// Component Props
interface RevenueAnalyticsDesignProps {
  timeRange?: "7" | "30" | "90" | "365"
  onTimeRangeChange?: (range: "7" | "30" | "90" | "365") => void
  onMetricClick?: (metricId: string) => void
  onOptimizationImplement?: (suggestionId: string) => void
  className?: string
}

// Color Scheme
const REVENUE_COLORS = {
  primary: "#10B981",     // Green - Revenue growth
  secondary: "#3B82F6",   // Blue - Neutral metrics  
  tertiary: "#8B5CF6",    // Purple - Premium services
  warning: "#F59E0B",     // Yellow - Attention needed
  danger: "#EF4444",      // Red - Decline/issues
  base: "#6B7280",        // Gray - Base services
  addon: "#EC4899",       // Pink - Add-ons
  tips: "#F97316"         // Orange - Tips & bonuses
}

// Mock Data Generation
const generateRevenueData = (days: number) => {
  const data = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Seasonal patterns for more realistic data
    const dayOfWeek = date.getDay()
    const weekendBoost = dayOfWeek === 5 || dayOfWeek === 6 ? 1.3 : 1.0
    const monthlyTrend = 1 + (Math.sin((date.getDate() / 30) * Math.PI) * 0.2)
    
    const baseRevenue = 100 + Math.random() * 200
    const totalRevenue = baseRevenue * weekendBoost * monthlyTrend
    
    data.push({
      date: date.toISOString().split('T')[0],
      period: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
      total_revenue: Math.round(totalRevenue),
      standard_videos: Math.round(totalRevenue * 0.6),
      express_delivery: Math.round(totalRevenue * 0.25),
      rush_orders: Math.round(totalRevenue * 0.15),
      extended_videos: Math.round(totalRevenue * 0.1),
      multiple_takes: Math.round(totalRevenue * 0.05),
      tips: Math.round(totalRevenue * 0.08),
      avg_order_value: Math.round(50 + Math.random() * 40),
      orders: Math.round(totalRevenue / (50 + Math.random() * 40)),
      hour: date.getHours(),
      day_of_week: dayOfWeek
    })
  }
  
  return data
}

const generateHeatmapData = () => {
  const data = []
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Peak hours: 6-8PM on Fri-Sat, 2-6PM on weekdays
      let intensity = 10 + Math.random() * 20
      
      if ((day === 5 || day === 6) && hour >= 18 && hour <= 20) {
        intensity = 80 + Math.random() * 20 // Peak weekend evening
      } else if (day >= 1 && day <= 5 && hour >= 14 && hour <= 18) {
        intensity = 60 + Math.random() * 20 // Peak weekday afternoon
      } else if (hour >= 9 && hour <= 17) {
        intensity = 30 + Math.random() * 20 // Regular daytime
      }
      
      data.push({
        day: days[day],
        hour: hour,
        value: Math.round(intensity),
        revenue: Math.round(intensity * 3.5) // Convert to revenue estimate
      })
    }
  }
  
  return data
}

// Revenue Metrics Data
const revenueMetrics: RevenueMetric[] = [
  {
    id: "total_revenue",
    name: "Total Revenue",
    value: 8420,
    change: 12.4,
    trend: "up",
    visualization: "line",
    timeRange: "7/30/90/365 days",
    drillDown: ["By service type", "By time period", "By customer segment"],
    actionTrigger: "Growth opportunities",
    target: 10000,
    benchmark: 7200
  },
  {
    id: "avg_order_value",
    name: "Average Order Value",
    value: 85,
    change: 8.7,
    trend: "up",
    visualization: "bar",
    timeRange: "Monthly comparison",
    drillDown: ["By category", "By customer type", "By service tier"],
    actionTrigger: "Pricing optimization",
    target: 95,
    benchmark: 75
  },
  {
    id: "revenue_per_day",
    name: "Revenue per Day",
    value: 280,
    change: 15.2,
    trend: "up",
    visualization: "heatmap",
    timeRange: "Year view",
    drillDown: ["Hourly breakdown", "Day patterns", "Seasonal trends"],
    actionTrigger: "Schedule optimization"
  },
  {
    id: "service_mix",
    name: "Service Mix",
    value: 100, // Percentage
    change: 2.1,
    trend: "stable",
    visualization: "donut",
    timeRange: "Current month",
    drillDown: ["Individual services", "Revenue contribution", "Demand patterns"],
    actionTrigger: "Portfolio balance"
  },
  {
    id: "growth_rate",
    name: "Growth Rate",
    value: 23.5,
    change: 5.2,
    trend: "up",
    visualization: "trend",
    timeRange: "YoY, MoM, WoW",
    drillDown: ["Segment analysis", "Channel performance", "Cohort analysis"],
    actionTrigger: "Performance alerts",
    target: 25,
    benchmark: 18
  }
]

// Revenue Breakdown Data
const revenueBreakdown: RevenueBreakdown[] = [
  {
    category: "Base Services",
    totalAmount: 5400,
    percentage: 70,
    color: REVENUE_COLORS.base,
    subcategories: [
      { name: "Standard videos", amount: 3400, percentage: 44, color: REVENUE_COLORS.primary },
      { name: "Express delivery", amount: 1200, percentage: 16, color: REVENUE_COLORS.secondary },
      { name: "Rush orders", amount: 800, percentage: 10, color: REVENUE_COLORS.tertiary }
    ]
  },
  {
    category: "Add-ons",
    totalAmount: 1000,
    percentage: 20,
    color: REVENUE_COLORS.addon,
    subcategories: [
      { name: "Extended videos", amount: 600, percentage: 12, color: REVENUE_COLORS.addon },
      { name: "Multiple takes", amount: 400, percentage: 8, color: "#F472B6" }
    ]
  },
  {
    category: "Tips & Bonuses",
    totalAmount: 500,
    percentage: 10,
    color: REVENUE_COLORS.tips,
    subcategories: [
      { name: "Customer tips", amount: 500, percentage: 10, color: REVENUE_COLORS.tips }
    ]
  }
]

// Predictive Revenue Data
const generatePredictiveData = () => {
  const data: PredictiveData[] = []
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  
  // Historical data (6 months back)
  for (let i = 6; i >= 1; i--) {
    const month = (currentMonth - i + 12) % 12
    const baseValue = 7000 + Math.random() * 2000
    const seasonalFactor = 1 + (Math.sin((month / 12) * 2 * Math.PI) * 0.15)
    const trendFactor = 1 + (0.05 * (6 - i)) // Growing trend
    
    data.push({
      period: months[month],
      actual: Math.round(baseValue * seasonalFactor * trendFactor),
      projected: Math.round(baseValue * seasonalFactor * trendFactor),
      confidence: 100,
      seasonal_factor: seasonalFactor,
      trend_factor: trendFactor
    })
  }
  
  // Current month (actual data)
  data.push({
    period: months[currentMonth],
    actual: 8420,
    projected: 8200,
    confidence: 100,
    seasonal_factor: 1.05,
    trend_factor: 1.25
  })
  
  // Future projections (6 months ahead)
  for (let i = 1; i <= 6; i++) {
    const month = (currentMonth + i) % 12
    const baseValue = 8000 + (i * 200) // Growth projection
    const seasonalFactor = 1 + (Math.sin(((month + 6) / 12) * 2 * Math.PI) * 0.15)
    const confidence = Math.max(60, 95 - (i * 7)) // Decreasing confidence over time
    
    data.push({
      period: months[month],
      projected: Math.round(baseValue * seasonalFactor),
      confidence: confidence,
      seasonal_factor: seasonalFactor,
      trend_factor: 1 + (0.05 * i)
    })
  }
  
  return data
}

// Optimization Suggestions
const optimizationSuggestions: OptimizationSuggestion[] = [
  {
    id: "pricing_optimization",
    type: "pricing",
    title: "Optimize Premium Pricing",
    description: "Increase premium service pricing by 15% based on demand analysis and competitor benchmarking.",
    impact: "high",
    effort: "low",
    potential_revenue: 1200,
    confidence: 87,
    timeframe: "2-3 weeks",
    actions: [
      "Test price increase on premium packages",
      "Monitor conversion rates for 2 weeks",
      "Adjust pricing based on customer response",
      "Implement dynamic pricing for rush orders"
    ],
    metrics: ["Average Order Value", "Conversion Rate", "Revenue per Customer"]
  },
  {
    id: "service_mix_balance",
    type: "service_mix",
    title: "Rebalance Service Portfolio",
    description: "Promote add-on services to increase revenue per transaction and improve profit margins.",
    impact: "high",
    effort: "medium",
    potential_revenue: 800,
    confidence: 82,
    timeframe: "1-2 months",
    actions: [
      "Create bundled service packages",
      "Implement upselling prompts in booking flow",
      "Develop add-on service templates",
      "Train on consultative selling approach"
    ],
    metrics: ["Service Mix Distribution", "Add-on Attachment Rate", "Average Order Value"]
  },
  {
    id: "peak_time_optimization",
    type: "peak_time",
    title: "Maximize Peak Hour Revenue",
    description: "Optimize scheduling and pricing for high-demand time slots to capture maximum revenue.",
    impact: "medium",
    effort: "low",
    potential_revenue: 600,
    confidence: 93,
    timeframe: "1 week",
    actions: [
      "Implement peak hour pricing premiums",
      "Block out highest-value time slots",
      "Create urgency-based booking incentives",
      "Optimize calendar availability display"
    ],
    metrics: ["Revenue per Hour", "Time Slot Utilization", "Booking Conversion Rate"]
  },
  {
    id: "upsell_automation",
    type: "upsell",
    title: "Automated Upselling System",
    description: "Implement intelligent upselling recommendations based on customer history and preferences.",
    impact: "medium",
    effort: "high",
    potential_revenue: 450,
    confidence: 75,
    timeframe: "2-3 months",
    actions: [
      "Develop customer preference profiles",
      "Create automated upsell recommendation engine",
      "Design smart upsell messaging",
      "Implement A/B testing for upsell strategies"
    ],
    metrics: ["Upsell Success Rate", "Customer Lifetime Value", "Revenue per Transaction"]
  },
  {
    id: "segment_targeting",
    type: "segment",
    title: "High-Value Customer Focus",
    description: "Create specialized offerings and experiences for your highest-value customer segments.",
    impact: "high",
    effort: "medium",
    potential_revenue: 950,
    confidence: 79,
    timeframe: "1-2 months",
    actions: [
      "Analyze customer value segments",
      "Develop VIP customer program",
      "Create premium service tiers",
      "Implement personalized marketing campaigns"
    ],
    metrics: ["Customer Lifetime Value", "Repeat Purchase Rate", "Revenue Concentration"]
  }
]

// Revenue Metrics Framework Component
const RevenueMetricsFramework = ({ 
  metrics, 
  onMetricClick 
}: { 
  metrics: RevenueMetric[]
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
                  <p className="text-sm text-gray-600">{metric.timeRange}</p>
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
                {metric.name.includes("Revenue") || metric.name.includes("Value") 
                  ? `$${metric.value.toLocaleString()}` 
                  : metric.name.includes("Rate") || metric.name.includes("Mix")
                  ? `${metric.value}%`
                  : metric.value.toLocaleString()}
              </div>
              
              {metric.target && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target Progress</span>
                    <span className="font-medium">
                      {Math.round((metric.value / metric.target) * 100)}%
                    </span>
                  </div>
                  <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                </div>
              )}
              
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {metric.actionTrigger}
                </Badge>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
)

// Revenue Breakdown Tree Component
const RevenueBreakdownTree = ({ breakdown }: { breakdown: RevenueBreakdown[] }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  
  // Prepare data for treemap
  const treemapData = breakdown.map(category => ({
    name: category.category,
    value: category.totalAmount,
    children: category.subcategories.map(sub => ({
      name: sub.name,
      value: sub.amount,
      fill: sub.color
    }))
  }))
  
  return (
    <div className="space-y-6">
      {/* Tree Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieIcon className="h-5 w-5 text-purple-600" />
            Revenue Composition Tree
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Hierarchical Breakdown */}
            <div>
              <h4 className="font-semibold mb-4">Service Categories</h4>
              <div className="space-y-3">
                {breakdown.map((category) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all",
                      selectedCategory === category.category 
                        ? "border-purple-200 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.category ? null : category.category
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        <h5 className="font-medium">{category.category}</h5>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${category.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{category.percentage}%</div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {selectedCategory === category.category && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 space-y-2"
                        >
                          {category.subcategories.map((sub) => (
                            <div key={sub.name} className="flex items-center justify-between ml-6 py-1">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2 h-2 rounded"
                                  style={{ backgroundColor: sub.color }}
                                />
                                <span className="text-sm">{sub.name}</span>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">${sub.amount.toLocaleString()}</span>
                                <span className="text-gray-600 ml-1">({sub.percentage}%)</span>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Donut Chart */}
            <div>
              <h4 className="font-semibold mb-4">Distribution Overview</h4>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="totalAmount"
                      nameKey="category"
                    >
                      {breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Predictive Revenue Component
const PredictiveRevenue = ({ data }: { data: PredictiveData[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Target className="h-5 w-5 text-blue-600" />
        Revenue Forecasting
      </CardTitle>
      <CardDescription>
        Predictive analytics with seasonal adjustments and growth trajectory
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {/* Forecast Chart */}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <RechartsTooltip 
                formatter={(value: number, name: string) => [
                  `$${value?.toLocaleString() || 0}`, 
                  name === 'actual' ? 'Actual Revenue' : 'Projected Revenue'
                ]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                stroke={REVENUE_COLORS.primary}
                fill={REVENUE_COLORS.primary}
                fillOpacity={0.3}
                name="Actual Revenue"
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke={REVENUE_COLORS.secondary}
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Projected Revenue"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Forecast Insights */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                $11.2k
              </div>
              <div className="text-sm text-gray-600">Next Month Projection</div>
              <div className="text-xs text-green-600 mt-1">85% confidence</div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                23.5%
              </div>
              <div className="text-sm text-gray-600">Growth Trajectory</div>
              <div className="text-xs text-blue-600 mt-1">YoY projection</div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                +15%
              </div>
              <div className="text-sm text-gray-600">Seasonal Boost</div>
              <div className="text-xs text-orange-600 mt-1">Holiday period</div>
            </div>
          </Card>
        </div>
      </div>
    </CardContent>
  </Card>
)

// Optimization Suggestions Component
const OptimizationSuggestions = ({ 
  suggestions, 
  onImplement 
}: { 
  suggestions: OptimizationSuggestion[]
  onImplement?: (suggestionId: string) => void 
}) => (
  <div className="space-y-4">
    {suggestions.map((suggestion, index) => (
      <motion.div
        key={suggestion.id}
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
                    variant={suggestion.impact === "high" ? "default" : "secondary"}
                    className={cn(
                      suggestion.impact === "high" && "bg-green-100 text-green-800",
                      suggestion.impact === "medium" && "bg-yellow-100 text-yellow-800",
                      suggestion.impact === "low" && "bg-gray-100 text-gray-800"
                    )}
                  >
                    {suggestion.impact} impact
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.type.replace('_', ' ')}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{suggestion.title}</h3>
                <p className="text-gray-600 mb-3">{suggestion.description}</p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      +${suggestion.potential_revenue}
                    </div>
                    <div className="text-xs text-gray-600">Potential Revenue</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {suggestion.confidence}%
                    </div>
                    <div className="text-xs text-gray-600">Confidence</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {suggestion.timeframe}
                    </div>
                    <div className="text-xs text-gray-600">Timeframe</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Effort:</span>
                <Badge 
                  variant="outline"
                  className={cn(
                    suggestion.effort === "low" && "border-green-300 text-green-700",
                    suggestion.effort === "medium" && "border-yellow-300 text-yellow-700",
                    suggestion.effort === "high" && "border-red-300 text-red-700"
                  )}
                >
                  {suggestion.effort}
                </Badge>
              </div>
              <Button 
                onClick={() => onImplement?.(suggestion.id)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Implement Strategy
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
)

// Main Component
export function RevenueAnalyticsDesign({
  timeRange = "30",
  onTimeRangeChange,
  onMetricClick,
  onOptimizationImplement,
  className
}: RevenueAnalyticsDesignProps) {
  const [activeView, setActiveView] = React.useState("overview")
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null)
  
  const revenueData = React.useMemo(() => generateRevenueData(parseInt(timeRange)), [timeRange])
  const heatmapData = React.useMemo(() => generateHeatmapData(), [])
  const predictiveData = React.useMemo(() => generatePredictiveData(), [])
  
  const handleMetricClick = (metricId: string) => {
    setSelectedMetric(metricId)
    onMetricClick?.(metricId)
  }
  
  const handleOptimizationImplement = (suggestionId: string) => {
    console.log("Implementing optimization:", suggestionId)
    onOptimizationImplement?.(suggestionId)
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Revenue Analytics Design</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Transform financial data into actionable insights for revenue optimization
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
          <Badge variant="outline" className="text-green-600">
            <DollarSign className="w-3 h-3 mr-1" />
            Financial Strategy
          </Badge>
        </div>
      </div>
      
      {/* Revenue Metrics Framework */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Revenue Metrics Framework
          </CardTitle>
          <CardDescription>
            Key financial visualizations with drill-down capabilities and action triggers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueMetricsFramework 
            metrics={revenueMetrics}
            onMetricClick={handleMetricClick}
          />
        </CardContent>
      </Card>
      
      {/* Revenue Breakdown */}
      <RevenueBreakdownTree breakdown={revenueBreakdown} />
      
      {/* Predictive Revenue */}
      <PredictiveRevenue data={predictiveData} />
      
      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Revenue Optimization Strategies
          </CardTitle>
          <CardDescription>
            AI-powered recommendations to maximize revenue potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OptimizationSuggestions 
            suggestions={optimizationSuggestions}
            onImplement={handleOptimizationImplement}
          />
        </CardContent>
      </Card>
      
      {/* Summary Alert */}
      <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <Target className="h-4 w-4" />
        <AlertDescription>
          <strong>Revenue Optimization Summary:</strong> Implementing the top 3 strategies could increase monthly revenue by 
          $2,850 (33.8% growth) with high confidence. Focus on pricing optimization and service mix rebalancing for 
          immediate impact.
        </AlertDescription>
      </Alert>
    </div>
  )
}