"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ComposedChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  MessageCircle,
  Star,
  Clock,
  CheckCircle,
  Eye,
  Activity,
  Calendar,
  Target,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Download,
  Share2,
  Filter,
  Zap,
  Users,
  Heart,
  ThumbsUp,
  Award,
  Lightbulb,
  Brain,
  Sparkles,
  Info,
  ChevronRight,
  Timer,
  Gauge,
  Flame,
  RefreshCw,
  Globe,
  Map,
  Percent,
  Hash,
  Video,
  FileText,
  HelpCircle,
  TrendingUp as TrendIcon,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  MoreVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Types
interface MetricData {
  current: number
  previous: number
  target?: number
  change: number
  trend: "up" | "down" | "stable"
  benchmark?: number
  status: "good" | "warning" | "critical"
}

interface TimeSeriesData {
  period: string
  value: number
  previousValue?: number
  label?: string
  category?: string
}

interface InsightCategory {
  id: string
  title: string
  icon: React.ElementType
  color: string
  insights: Insight[]
}

interface Insight {
  title: string
  description: string
  impact: "high" | "medium" | "low"
  action?: string
  metric?: string
  value?: string
}

interface EnhancedAnalyticsDashboardProps {
  timeRange?: "7" | "30" | "90"
  onTimeRangeChange?: (range: "7" | "30" | "90") => void
  metrics?: {
    earnings: MetricData & { series: TimeSeriesData[] }
    requests: MetricData & { series: TimeSeriesData[] }
    rating: MetricData & { series: TimeSeriesData[] }
    responseTime: MetricData
    completionRate: MetricData
    views: MetricData & { heatmap?: number[][] }
  }
  className?: string
}

// Color schemes
const CHART_COLORS = {
  primary: "#9333EA",
  secondary: "#EC4899",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  purple: "#9333EA",
  pink: "#EC4899",
  green: "#10B981",
  yellow: "#F59E0B",
  red: "#EF4444",
  blue: "#3B82F6",
  gradient: ["#9333EA", "#EC4899"],
}

// Mock data generator
const generateMockData = (days: number) => {
  const data = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    data.push({
      period: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
      earnings: Math.floor(Math.random() * 500) + 200,
      requests: Math.floor(Math.random() * 15) + 3,
      rating: (Math.random() * 0.5 + 4.5).toFixed(1),
      views: Math.floor(Math.random() * 1000) + 500,
      responseTime: Math.floor(Math.random() * 180) + 60,
      completionRate: Math.floor(Math.random() * 10) + 85,
    })
  }
  
  return data
}

// Generate heatmap data (7x24 grid for week view)
const generateHeatmapData = () => {
  const data = []
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        day: days[day],
        hour: hour,
        value: Math.floor(Math.random() * 100),
      })
    }
  }
  
  return data
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null
  
  return (
    <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg border">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
          <span className="font-medium" style={{ color: entry.color }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// Metric card component
const MetricCard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  target,
  benchmark,
  status,
  showGraph = false,
  graphData = [],
}: {
  title: string
  value: string | number
  change?: number
  trend?: "up" | "down" | "stable"
  icon: React.ElementType
  color: string
  target?: number
  benchmark?: number
  status?: "good" | "warning" | "critical"
  showGraph?: boolean
  graphData?: any[]
}) => {
  const statusColors = {
    good: "text-green-600",
    warning: "text-yellow-600",
    critical: "text-red-600",
  }
  
  const trendIcons = {
    up: ArrowUpRight,
    down: ArrowDownRight,
    stable: Minus,
  }
  
  const TrendIconComponent = trend ? trendIcons[trend] : null
  
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "p-2 rounded-lg",
              color === "purple" && "bg-purple-100 dark:bg-purple-900/30",
              color === "green" && "bg-green-100 dark:bg-green-900/30",
              color === "blue" && "bg-blue-100 dark:bg-blue-900/30",
              color === "yellow" && "bg-yellow-100 dark:bg-yellow-900/30",
              color === "red" && "bg-red-100 dark:bg-red-900/30",
              color === "pink" && "bg-pink-100 dark:bg-pink-900/30"
            )}
          >
            <Icon className={cn(
              "h-5 w-5",
              color === "purple" && "text-purple-600",
              color === "green" && "text-green-600",
              color === "blue" && "text-blue-600",
              color === "yellow" && "text-yellow-600",
              color === "red" && "text-red-600",
              color === "pink" && "text-pink-600"
            )} />
          </div>
          {status && (
            <Badge variant="outline" className={statusColors[status]}>
              {status}
            </Badge>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && TrendIconComponent && (
              <div className={cn(
                "flex items-center gap-1 text-sm",
                trend === "up" && change > 0 ? "text-green-600" :
                trend === "down" && change < 0 ? "text-red-600" :
                "text-gray-600"
              )}>
                <TrendIconComponent className="h-3 w-3" />
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>
        </div>
        
        {(target || benchmark) && (
          <div className="mt-4 space-y-2">
            {target && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Target</span>
                <span className="font-medium">{target}</span>
              </div>
            )}
            {benchmark && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Benchmark</span>
                <span className="font-medium">{benchmark}</span>
              </div>
            )}
          </div>
        )}
        
        {showGraph && graphData.length > 0 && (
          <div className="mt-4" style={{ width: '100%', height: 48 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={CHART_COLORS[color as keyof typeof CHART_COLORS]}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Gauge chart component
const GaugeChart = ({ value, target, title }: { value: number; target: number; title: string }) => {
  const percentage = Math.min((value / target) * 100, 100)
  const data = [{ name: title, value: percentage, fill: CHART_COLORS.primary }]
  
  return (
    <div className="relative" style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data}>
          <PolarGrid stroke="none" />
          <RadialBar dataKey="value" cornerRadius={10} fill={CHART_COLORS.primary} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-gray-600">of {target}</p>
      </div>
    </div>
  )
}

// Heat map component
const HeatMap = ({ data, title }: { data: any[]; title: string }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  
  const getColor = (value: number) => {
    if (value > 80) return "bg-purple-600"
    if (value > 60) return "bg-purple-500"
    if (value > 40) return "bg-purple-400"
    if (value > 20) return "bg-purple-300"
    return "bg-purple-200"
  }
  
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <div className="w-12" />
        {hours.map(hour => (
          <div key={hour} className="flex-1 text-xs text-center text-gray-600">
            {hour % 6 === 0 ? hour : ""}
          </div>
        ))}
      </div>
      {days.map(day => (
        <div key={day} className="flex gap-1">
          <div className="w-12 text-xs text-gray-600 flex items-center">{day}</div>
          {hours.map(hour => {
            const item = data.find(d => d.day === day && d.hour === hour)
            return (
              <TooltipProvider key={`${day}-${hour}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex-1 aspect-square rounded-sm cursor-pointer hover:opacity-80",
                        item ? getColor(item.value) : "bg-gray-100 dark:bg-gray-800"
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {day} {hour}:00 - {item?.value || 0} views
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// Insight card component
const InsightCard = ({ insight, onAction }: { insight: Insight; onAction?: () => void }) => {
  const impactColors = {
    high: "border-red-200 bg-red-50 dark:bg-red-900/20",
    medium: "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20",
    low: "border-blue-200 bg-blue-50 dark:bg-blue-900/20",
  }
  
  const impactIcons = {
    high: <Flame className="h-4 w-4 text-red-600" />,
    medium: <Zap className="h-4 w-4 text-yellow-600" />,
    low: <Info className="h-4 w-4 text-blue-600" />,
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-lg border",
        impactColors[insight.impact]
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {impactIcons[insight.impact]}
          <h4 className="font-medium">{insight.title}</h4>
        </div>
        {insight.value && (
          <Badge variant="outline">{insight.value}</Badge>
        )}
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {insight.description}
      </p>
      
      {insight.action && (
        <Button
          size="sm"
          variant="outline"
          onClick={onAction}
          className="w-full"
        >
          {insight.action}
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      )}
    </motion.div>
  )
}

// Main component
export function EnhancedAnalyticsDashboard({
  timeRange = "7",
  onTimeRangeChange,
  metrics,
  className
}: EnhancedAnalyticsDashboardProps) {
  const [selectedMetric, setSelectedMetric] = React.useState("earnings")
  const [viewType, setViewType] = React.useState<"line" | "bar" | "area">("area")
  const [showComparison, setShowComparison] = React.useState(true)
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  // Generate mock data
  const chartData = React.useMemo(() => generateMockData(parseInt(timeRange)), [timeRange])
  const heatmapData = React.useMemo(() => generateHeatmapData(), [])
  
  // Revenue insights
  const revenueInsights: Insight[] = [
    {
      title: "Best Performing Day",
      description: "Fridays generate 35% more revenue than average. Consider increasing availability.",
      impact: "high",
      action: "Optimize Friday Schedule",
      value: "+$520"
    },
    {
      title: "Optimal Price Point",
      description: "Videos priced at $75-85 have 2x higher conversion rate.",
      impact: "medium",
      action: "Adjust Pricing",
      value: "$80"
    },
    {
      title: "High-Value Customers",
      description: "3 customers account for 40% of revenue. Prioritize their requests.",
      impact: "high",
      action: "View VIP List",
      value: "3 VIPs"
    },
    {
      title: "Growth Opportunity",
      description: "Birthday messages are trending up 45% this month.",
      impact: "medium",
      action: "Create Birthday Templates",
      value: "+45%"
    }
  ]
  
  // Performance insights
  const performanceInsights: Insight[] = [
    {
      title: "Response Time Impact",
      description: "Requests answered within 3 hours have 85% higher acceptance rate.",
      impact: "high",
      action: "Set Response Alerts",
      value: "3hr target"
    },
    {
      title: "Quality Balance",
      description: "Maintaining 4.8+ rating while completing 10+ videos daily.",
      impact: "low",
      action: "View Quality Metrics",
      value: "4.8 rating"
    },
    {
      title: "Satisfaction Drivers",
      description: "Personalization mentions increase ratings by 0.3 stars.",
      impact: "medium",
      action: "Improve Templates",
      value: "+0.3 stars"
    },
    {
      title: "Improvement Area",
      description: "Audio quality mentioned in 15% of reviews. Consider upgrading mic.",
      impact: "medium",
      action: "View Feedback",
      value: "15% mentions"
    }
  ]
  
  // Growth insights
  const growthInsights: Insight[] = [
    {
      title: "Market Demand",
      description: "Wedding season starting - 200% increase in anniversary requests expected.",
      impact: "high",
      action: "Prepare Templates",
      value: "+200%"
    },
    {
      title: "Competition Analysis",
      description: "You're priced 20% below similar creators with same rating.",
      impact: "medium",
      action: "Analyze Competition",
      value: "-20%"
    },
    {
      title: "Expansion Opportunity",
      description: "Spanish requests increasing - consider bilingual offerings.",
      impact: "medium",
      action: "Add Languages",
      value: "Spanish"
    },
    {
      title: "Marketing Effectiveness",
      description: "Social media posts drive 60% of new customers.",
      impact: "high",
      action: "Boost Social Presence",
      value: "60% traffic"
    }
  ]
  
  const insightCategories: InsightCategory[] = [
    {
      id: "revenue",
      title: "Revenue Insights",
      icon: DollarSign,
      color: "green",
      insights: revenueInsights
    },
    {
      id: "performance",
      title: "Performance Insights",
      icon: Activity,
      color: "blue",
      insights: performanceInsights
    },
    {
      id: "growth",
      title: "Growth Insights",
      icon: TrendingUp,
      color: "purple",
      insights: growthInsights
    }
  ]
  
  // Calculate summary metrics
  const summaryMetrics = {
    totalRevenue: chartData.reduce((sum, d) => sum + d.earnings, 0),
    totalRequests: chartData.reduce((sum, d) => sum + d.requests, 0),
    avgRating: (chartData.reduce((sum, d) => sum + parseFloat(d.rating), 0) / chartData.length).toFixed(1),
    avgResponseTime: Math.floor(chartData.reduce((sum, d) => sum + d.responseTime, 0) / chartData.length),
    avgCompletionRate: Math.floor(chartData.reduce((sum, d) => sum + d.completionRate, 0) / chartData.length),
    totalViews: chartData.reduce((sum, d) => sum + d.views, 0),
  }
  
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Transform data into actionable insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(v) => onTimeRangeChange?.(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Earnings"
          value={`$${summaryMetrics.totalRevenue}`}
          change={12.4}
          trend="up"
          icon={DollarSign}
          color="green"
          target={3000}
          benchmark={2200}
          status="good"
          showGraph
          graphData={chartData.map(d => ({ value: d.earnings }))}
        />
        
        <MetricCard
          title="Requests"
          value={summaryMetrics.totalRequests}
          change={18.4}
          trend="up"
          icon={MessageCircle}
          color="blue"
          target={50}
          benchmark={40}
          status="good"
          showGraph
          graphData={chartData.map(d => ({ value: d.requests }))}
        />
        
        <MetricCard
          title="Rating"
          value={summaryMetrics.avgRating}
          change={2.1}
          trend="up"
          icon={Star}
          color="yellow"
          target={5.0}
          benchmark={4.5}
          status="good"
          showGraph
          graphData={chartData.map(d => ({ value: parseFloat(d.rating) }))}
        />
        
        <MetricCard
          title="Response Time"
          value={`${summaryMetrics.avgResponseTime}min`}
          change={-15.2}
          trend="down"
          icon={Clock}
          color="purple"
          target={180}
          status="good"
        />
        
        <MetricCard
          title="Completion Rate"
          value={`${summaryMetrics.avgCompletionRate}%`}
          change={5.3}
          trend="up"
          icon={CheckCircle}
          color="green"
          target={95}
          status="warning"
        />
        
        <MetricCard
          title="Views"
          value={summaryMetrics.totalViews.toLocaleString()}
          change={25.7}
          trend="up"
          icon={Eye}
          color="pink"
          benchmark={5000}
          status="good"
        />
      </div>
      
      {/* Main Visualization Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6">
          {/* Chart Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Performance Visualization</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={viewType === "line" ? "default" : "outline"}
                    onClick={() => setViewType("line")}
                  >
                    <LineChartIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewType === "bar" ? "default" : "outline"}
                    onClick={() => setViewType("bar")}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewType === "area" ? "default" : "outline"}
                    onClick={() => setViewType("area")}
                  >
                    <Activity className="h-4 w-4" />
                  </Button>
                  
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  
                  <Button
                    size="sm"
                    variant={showComparison ? "default" : "outline"}
                    onClick={() => setShowComparison(!showComparison)}
                  >
                    Compare
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                {viewType === "line" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      name="Earnings ($)"
                    />
                    {showComparison && (
                      <Line
                        type="monotone"
                        dataKey="requests"
                        stroke={CHART_COLORS.secondary}
                        strokeWidth={2}
                        name="Requests"
                        yAxisId="right"
                      />
                    )}
                  </LineChart>
                ) : viewType === "bar" ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="earnings" fill={CHART_COLORS.primary} name="Earnings ($)" />
                    {showComparison && (
                      <Bar dataKey="requests" fill={CHART_COLORS.secondary} name="Requests" />
                    )}
                  </BarChart>
                ) : (
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke={CHART_COLORS.primary}
                      fill={CHART_COLORS.primary}
                      fillOpacity={0.3}
                      name="Earnings ($)"
                    />
                    {showComparison && (
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke={CHART_COLORS.secondary}
                        fill={CHART_COLORS.secondary}
                        fillOpacity={0.3}
                        name="Views"
                      />
                    )}
                  </AreaChart>
                )}
              </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Gauge Charts */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <GaugeChart value={summaryMetrics.avgResponseTime} target={180} title="Minutes" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <GaugeChart value={summaryMetrics.avgCompletionRate} target={95} title="Percent" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <GaugeChart value={parseFloat(summaryMetrics.avgRating) * 20} target={100} title="Rating" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          {insightCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className={cn(
                    "h-5 w-5",
                    category.color === "green" && "text-green-600",
                    category.color === "blue" && "text-blue-600",
                    category.color === "purple" && "text-purple-600"
                  )} />
                  {category.title}
                </CardTitle>
                <CardDescription>
                  Actionable recommendations based on your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.insights.map((insight, index) => (
                    <InsightCard
                      key={index}
                      insight={insight}
                      onAction={() => {
                        toast.success(`Action: ${insight.action}`)
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="patterns" className="space-y-6">
          {/* Heat Map */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Heat Map</CardTitle>
              <CardDescription>
                View patterns by day and hour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HeatMap data={heatmapData} title="Views" />
            </CardContent>
          </Card>
          
          {/* Pattern Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Best Performing Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: "Friday 6-8 PM", value: 95, change: "+35%" },
                    { time: "Saturday 2-4 PM", value: 88, change: "+28%" },
                    { time: "Sunday 7-9 PM", value: 82, change: "+22%" },
                    { time: "Thursday 5-7 PM", value: 78, change: "+18%" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.time}</span>
                          <Badge variant="outline" className="text-green-600">
                            {item.change}
                          </Badge>
                        </div>
                        <Progress value={item.value} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: "Birthday", count: 45, rating: 4.9 },
                    { type: "Anniversary", count: 32, rating: 4.8 },
                    { type: "Motivation", count: 28, rating: 4.7 },
                    { type: "Congratulations", count: 22, rating: 4.9 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">{item.type}</span>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{item.count} videos</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Action Summary */}
      <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Key Recommendations:</strong> Focus on Friday evening availability (+35% revenue),
          adjust pricing to $80 optimal point, and prioritize your 3 VIP customers who generate 40% of revenue.
          Consider adding Spanish language support to capture growing demand.
        </AlertDescription>
      </Alert>
    </div>
  )
}