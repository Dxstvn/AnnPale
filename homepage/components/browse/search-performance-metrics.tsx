"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  MousePointer,
  Filter,
  DollarSign,
  Users,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Download,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { toast } from "sonner"

// Performance metric types
export interface PerformanceMetric {
  name: string
  value: number
  target: number
  unit: string
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  trendValue: number
  description: string
  action?: string
}

// Search metrics data
export interface SearchMetrics {
  // Performance metrics
  querySpeed: number // milliseconds
  autocompleteSpeed: number // milliseconds
  clickThroughRate: number // percentage
  zeroResultsRate: number // percentage
  refinementRate: number // percentage
  conversionRate: number // percentage
  
  // Volume metrics
  totalSearches: number
  uniqueUsers: number
  searchesPerUser: number
  averageSessionDuration: number // seconds
  
  // Quality metrics
  relevanceScore: number // 0-100
  userSatisfactionScore: number // 0-100
  averagePosition: number // Average position of clicked results
  bounceRate: number // percentage
}

// Time series data point
export interface MetricDataPoint {
  timestamp: Date
  value: number
  metric: string
}

// Search session data
export interface SearchSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  searches: Array<{
    query: string
    timestamp: Date
    responseTime: number
    resultCount: number
    clickedResults: string[]
    refinements: number
    converted: boolean
  }>
}

interface SearchPerformanceMetricsProps {
  metrics?: SearchMetrics
  historicalData?: MetricDataPoint[]
  sessions?: SearchSession[]
  timeRange?: "1h" | "24h" | "7d" | "30d"
  onTimeRangeChange?: (range: "1h" | "24h" | "7d" | "30d") => void
  onMetricClick?: (metric: PerformanceMetric) => void
  autoRefresh?: boolean
  refreshInterval?: number // milliseconds
  showAlerts?: boolean
  className?: string
}

// Default metric targets
const METRIC_TARGETS = {
  querySpeed: 200, // ms
  autocompleteSpeed: 100, // ms
  clickThroughRate: 40, // %
  zeroResultsRate: 5, // %
  refinementRate: 30, // %
  conversionRate: 10, // %
  relevanceScore: 80, // 0-100
  userSatisfactionScore: 75, // 0-100
  bounceRate: 30 // %
}

// Generate mock historical data
const generateMockHistoricalData = (days: number = 7): MetricDataPoint[] => {
  const data: MetricDataPoint[] = []
  const now = new Date()
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i)
    
    // Generate data points for each metric
    ["querySpeed", "clickThroughRate", "conversionRate", "zeroResultsRate"].forEach(metric => {
      for (let hour = 0; hour < 24; hour += 4) {
        const timestamp = new Date(date)
        timestamp.setHours(hour)
        
        let value = 0
        switch (metric) {
          case "querySpeed":
            value = 150 + Math.random() * 100
            break
          case "clickThroughRate":
            value = 35 + Math.random() * 20
            break
          case "conversionRate":
            value = 8 + Math.random() * 8
            break
          case "zeroResultsRate":
            value = 2 + Math.random() * 6
            break
        }
        
        data.push({ timestamp, value, metric })
      }
    })
  }
  
  return data
}

// Generate mock metrics
const generateMockMetrics = (): SearchMetrics => ({
  querySpeed: 175,
  autocompleteSpeed: 85,
  clickThroughRate: 42.3,
  zeroResultsRate: 3.2,
  refinementRate: 28.5,
  conversionRate: 11.8,
  totalSearches: 15234,
  uniqueUsers: 3456,
  searchesPerUser: 4.4,
  averageSessionDuration: 324,
  relevanceScore: 82,
  userSatisfactionScore: 78,
  averagePosition: 2.3,
  bounceRate: 24.5
})

export function SearchPerformanceMetrics({
  metrics = generateMockMetrics(),
  historicalData = generateMockHistoricalData(7),
  sessions = [],
  timeRange = "24h",
  onTimeRangeChange,
  onMetricClick,
  autoRefresh = true,
  refreshInterval = 60000, // 1 minute
  showAlerts = true,
  className
}: SearchPerformanceMetricsProps) {
  const [selectedMetric, setSelectedMetric] = React.useState<string>("querySpeed")
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [lastUpdated, setLastUpdated] = React.useState(new Date())
  
  // Auto-refresh
  React.useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      setIsRefreshing(true)
      setTimeout(() => {
        setIsRefreshing(false)
        setLastUpdated(new Date())
        toast.success("Metrics refreshed")
      }, 1000)
    }, refreshInterval)
    
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  // Calculate performance metrics
  const performanceMetrics: PerformanceMetric[] = [
    {
      name: "Query Speed",
      value: metrics.querySpeed,
      target: METRIC_TARGETS.querySpeed,
      unit: "ms",
      status: metrics.querySpeed <= METRIC_TARGETS.querySpeed ? "good" : 
              metrics.querySpeed <= METRIC_TARGETS.querySpeed * 1.5 ? "warning" : "critical",
      trend: "down",
      trendValue: -12,
      description: "Average server response time",
      action: metrics.querySpeed > METRIC_TARGETS.querySpeed ? "Optimize database indexes" : undefined
    },
    {
      name: "Autocomplete",
      value: metrics.autocompleteSpeed,
      target: METRIC_TARGETS.autocompleteSpeed,
      unit: "ms",
      status: metrics.autocompleteSpeed <= METRIC_TARGETS.autocompleteSpeed ? "good" :
              metrics.autocompleteSpeed <= METRIC_TARGETS.autocompleteSpeed * 1.5 ? "warning" : "critical",
      trend: "stable",
      trendValue: 0,
      description: "Keystroke to suggestion time",
      action: metrics.autocompleteSpeed > METRIC_TARGETS.autocompleteSpeed ? "Implement cache warming" : undefined
    },
    {
      name: "Click-through",
      value: metrics.clickThroughRate,
      target: METRIC_TARGETS.clickThroughRate,
      unit: "%",
      status: metrics.clickThroughRate >= METRIC_TARGETS.clickThroughRate ? "good" :
              metrics.clickThroughRate >= METRIC_TARGETS.clickThroughRate * 0.75 ? "warning" : "critical",
      trend: "up",
      trendValue: 5,
      description: "Clicks per search",
      action: metrics.clickThroughRate < METRIC_TARGETS.clickThroughRate ? "Improve result relevance" : undefined
    },
    {
      name: "Zero Results",
      value: metrics.zeroResultsRate,
      target: METRIC_TARGETS.zeroResultsRate,
      unit: "%",
      status: metrics.zeroResultsRate <= METRIC_TARGETS.zeroResultsRate ? "good" :
              metrics.zeroResultsRate <= METRIC_TARGETS.zeroResultsRate * 2 ? "warning" : "critical",
      trend: "down",
      trendValue: -8,
      description: "Searches with no results",
      action: metrics.zeroResultsRate > METRIC_TARGETS.zeroResultsRate ? "Expand matching criteria" : undefined
    },
    {
      name: "Refinement",
      value: metrics.refinementRate,
      target: METRIC_TARGETS.refinementRate,
      unit: "%",
      status: metrics.refinementRate <= METRIC_TARGETS.refinementRate ? "good" :
              metrics.refinementRate <= METRIC_TARGETS.refinementRate * 1.5 ? "warning" : "critical",
      trend: "down",
      trendValue: -3,
      description: "Filter usage rate",
      action: metrics.refinementRate > METRIC_TARGETS.refinementRate ? "Improve initial results" : undefined
    },
    {
      name: "Conversion",
      value: metrics.conversionRate,
      target: METRIC_TARGETS.conversionRate,
      unit: "%",
      status: metrics.conversionRate >= METRIC_TARGETS.conversionRate ? "good" :
              metrics.conversionRate >= METRIC_TARGETS.conversionRate * 0.75 ? "warning" : "critical",
      trend: "up",
      trendValue: 15,
      description: "Bookings per search",
      action: metrics.conversionRate < METRIC_TARGETS.conversionRate ? "Optimize ranking algorithm" : undefined
    }
  ]

  // Get status color
  const getStatusColor = (status: "good" | "warning" | "critical") => {
    switch (status) {
      case "good": return "text-green-600 bg-green-50 dark:bg-green-900/20"
      case "warning": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
      case "critical": return "text-red-600 bg-red-50 dark:bg-red-900/20"
    }
  }

  // Get trend icon
  const getTrendIcon = (trend: "up" | "down" | "stable", value: number) => {
    if (trend === "up") {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUp className="h-3 w-3" />
          <span className="text-xs ml-1">+{Math.abs(value)}%</span>
        </div>
      )
    } else if (trend === "down") {
      return (
        <div className="flex items-center text-red-600">
          <ArrowDown className="h-3 w-3" />
          <span className="text-xs ml-1">-{Math.abs(value)}%</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center text-gray-500">
          <Minus className="h-3 w-3" />
          <span className="text-xs ml-1">0%</span>
        </div>
      )
    }
  }

  // Filter historical data by time range
  const filteredData = React.useMemo(() => {
    const now = new Date()
    let startDate: Date
    
    switch (timeRange) {
      case "1h":
        startDate = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case "24h":
        startDate = subDays(now, 1)
        break
      case "7d":
        startDate = subDays(now, 7)
        break
      case "30d":
        startDate = subDays(now, 30)
        break
      default:
        startDate = subDays(now, 1)
    }
    
    return historicalData.filter(d => d.timestamp >= startDate)
  }, [historicalData, timeRange])

  // Prepare chart data
  const chartData = React.useMemo(() => {
    const grouped = new Map<string, any>()
    
    filteredData
      .filter(d => d.metric === selectedMetric)
      .forEach(point => {
        const key = format(point.timestamp, timeRange === "1h" ? "HH:mm" : "MMM dd")
        if (!grouped.has(key)) {
          grouped.set(key, {
            time: key,
            value: point.value,
            count: 1
          })
        } else {
          const existing = grouped.get(key)
          existing.value = (existing.value * existing.count + point.value) / (existing.count + 1)
          existing.count++
        }
      })
    
    return Array.from(grouped.values())
  }, [filteredData, selectedMetric, timeRange])

  // Calculate health score
  const healthScore = React.useMemo(() => {
    const scores = performanceMetrics.map(m => {
      if (m.status === "good") return 1
      if (m.status === "warning") return 0.5
      return 0
    })
    return (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
  }, [performanceMetrics])

  // Get critical alerts
  const criticalAlerts = performanceMetrics.filter(m => m.status === "critical" && m.action)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle className="text-xl">Search Performance</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time search metrics and optimization insights
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Health Score */}
              <div className="text-right">
                <p className="text-xs text-gray-600">Health Score</p>
                <div className="flex items-center gap-2">
                  <Progress value={healthScore} className="w-20" />
                  <span className="text-lg font-bold">
                    {healthScore.toFixed(0)}%
                  </span>
                </div>
              </div>
              
              {/* Time Range Selector */}
              <Select value={timeRange} onValueChange={onTimeRangeChange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Refresh Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setIsRefreshing(true)
                  setTimeout(() => {
                    setIsRefreshing(false)
                    setLastUpdated(new Date())
                  }, 1000)
                }}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Critical Alerts */}
      {showAlerts && criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Critical Performance Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{alert.name}</p>
                  <p className="text-xs text-gray-600">{alert.action}</p>
                </div>
                <Badge variant="destructive">
                  {alert.value.toFixed(1)}{alert.unit}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {performanceMetrics.map((metric) => (
          <motion.div
            key={metric.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all",
                selectedMetric === metric.name.toLowerCase().replace(/\s+/g, '') && "ring-2 ring-purple-600"
              )}
              onClick={() => {
                setSelectedMetric(metric.name.toLowerCase().replace(/\s+/g, ''))
                onMetricClick?.(metric)
              }}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">{metric.name}</p>
                    {getTrendIcon(metric.trend, metric.trendValue)}
                  </div>
                  
                  <div className="text-2xl font-bold">
                    {metric.value.toFixed(metric.unit === "ms" ? 0 : 1)}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {metric.unit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Target: {metric.target}{metric.unit}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", getStatusColor(metric.status))}
                    >
                      {metric.status}
                    </Badge>
                  </div>
                  
                  <Progress
                    value={
                      metric.unit === "%" 
                        ? metric.value
                        : Math.min(100, (metric.target / metric.value) * 100)
                    }
                    className="h-1"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trend">Trend Analysis</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        {/* Trend Analysis */}
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#9333ea"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution */}
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Metric Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={performanceMetrics.map(m => ({
                    name: m.name,
                    value: m.value,
                    target: m.target
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#9333ea" />
                  <Bar dataKey="target" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Performance vs Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => {
                  const percentage = metric.unit === "%" 
                    ? (metric.value / metric.target) * 100
                    : (metric.target / metric.value) * 100
                  
                  return (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <span className="text-sm text-gray-600">
                          {metric.value.toFixed(1)}{metric.unit} / {metric.target}{metric.unit}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(100, percentage)}
                        className={cn(
                          "h-2",
                          metric.status === "good" && "[&>div]:bg-green-500",
                          metric.status === "warning" && "[&>div]:bg-yellow-500",
                          metric.status === "critical" && "[&>div]:bg-red-500"
                        )}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Searches</p>
                <p className="text-2xl font-bold">{metrics.totalSearches.toLocaleString()}</p>
              </div>
              <Search className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Unique Users</p>
                <p className="text-2xl font-bold">{metrics.uniqueUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Relevance Score</p>
                <p className="text-2xl font-bold">{metrics.relevanceScore}%</p>
              </div>
              <Target className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold">{metrics.userSatisfactionScore}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="text-xs text-gray-500 text-center">
        Last updated: {format(lastUpdated, "MMM dd, yyyy HH:mm:ss")}
      </div>
    </div>
  )
}

// Export hook for using performance metrics
export function useSearchPerformanceMetrics() {
  const [metrics, setMetrics] = React.useState<SearchMetrics | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const fetchMetrics = React.useCallback(async () => {
    setIsLoading(true)
    // In production, fetch from API
    setTimeout(() => {
      setMetrics(generateMockMetrics())
      setIsLoading(false)
    }, 1000)
  }, [])

  React.useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  return {
    metrics,
    isLoading,
    refresh: fetchMetrics
  }
}