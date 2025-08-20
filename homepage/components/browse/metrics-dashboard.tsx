"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  MousePointer,
  Filter,
  Target,
  Users,
  Eye,
  ArrowDown,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  Gauge,
  Download,
  RefreshCw,
  Settings,
  Play,
  Pause,
  Square,
  Bell,
  BellOff
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Comprehensive metrics tracking according to Phase 2.1.10 requirements
export interface BrowsePageMetrics {
  // Key metrics from requirements
  filterUsage: {
    percentage: number
    target: number
    status: "success" | "warning" | "error"
    trend: number
  }
  
  avgTimeToClick: {
    seconds: number
    target: number
    status: "success" | "warning" | "error"
    trend: number
    breakdown: {
      firstTime: number
      returning: number
      mobile: number
      desktop: number
    }
  }
  
  scrollDepth: {
    percentage: number
    target: number
    status: "success" | "warning" | "error"
    trend: number
    distribution: number[]
  }
  
  conversionRate: {
    percentage: number
    target: number
    status: "success" | "warning" | "error"
    trend: number
    funnel: Array<{
      step: string
      rate: number
      users: number
    }>
  }
  
  abandonmentPoints: Array<{
    location: string
    percentage: number
    reason: string
    impact: "high" | "medium" | "low"
    trend: number
  }>
  
  // Real-time tracking
  currentUsers: number
  sessionsToday: number
  realTimeEvents: Array<{
    type: string
    timestamp: number
    userId: string
    data: any
  }>
}

interface MetricsDashboardProps {
  isRealTime?: boolean
  enableAlerts?: boolean
  showAdvanced?: boolean
  onMetricAlert?: (metric: string, value: number, threshold: number) => void
  className?: string
}

// Sample real-time data generator
function generateRealTimeMetrics(): BrowsePageMetrics {
  const now = Date.now()
  
  return {
    filterUsage: {
      percentage: 58.3 + Math.random() * 10 - 5,
      target: 60,
      status: "warning",
      trend: Math.random() * 4 - 2
    },
    
    avgTimeToClick: {
      seconds: 28.5 + Math.random() * 10 - 5,
      target: 30,
      status: "success",
      trend: Math.random() * 2 - 1,
      breakdown: {
        firstTime: 35.2,
        returning: 22.1,
        mobile: 31.7,
        desktop: 25.8
      }
    },
    
    scrollDepth: {
      percentage: 52.1 + Math.random() * 10 - 5,
      target: 50,
      status: "success",
      trend: Math.random() * 3 - 1.5,
      distribution: [100, 85, 62, 45, 28, 15, 8, 3]
    },
    
    conversionRate: {
      percentage: 4.8 + Math.random() * 2 - 1,
      target: 5,
      status: "warning",
      trend: Math.random() * 1 - 0.5,
      funnel: [
        { step: "Page Load", rate: 100, users: 1000 },
        { step: "First Interaction", rate: 85, users: 850 },
        { step: "Filter/Search", rate: 68, users: 680 },
        { step: "Creator View", rate: 34, users: 340 },
        { step: "Booking Intent", rate: 12, users: 120 },
        { step: "Booking Complete", rate: 4.8, users: 48 }
      ]
    },
    
    abandonmentPoints: [
      {
        location: "Filter Selection",
        percentage: 23.5 + Math.random() * 5 - 2.5,
        reason: "Too many options",
        impact: "high",
        trend: Math.random() * 2 - 1
      },
      {
        location: "Search Results",
        percentage: 18.2 + Math.random() * 3 - 1.5,
        reason: "Poor relevance",
        impact: "medium",
        trend: Math.random() * 1.5 - 0.75
      },
      {
        location: "Creator Cards",
        percentage: 15.7 + Math.random() * 3 - 1.5,
        reason: "Insufficient info",
        impact: "medium",
        trend: Math.random() * 1 - 0.5
      }
    ],
    
    currentUsers: Math.floor(50 + Math.random() * 100),
    sessionsToday: Math.floor(1200 + Math.random() * 300),
    
    realTimeEvents: Array.from({ length: 10 }, (_, i) => ({
      type: ["filter_apply", "creator_click", "scroll", "search", "abandonment"][Math.floor(Math.random() * 5)],
      timestamp: now - i * 30000 - Math.random() * 30000,
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      data: {}
    }))
  }
}

export function MetricsDashboard({
  isRealTime = false,
  enableAlerts = false,
  showAdvanced = false,
  onMetricAlert,
  className
}: MetricsDashboardProps) {
  const [metrics, setMetrics] = React.useState<BrowsePageMetrics>(generateRealTimeMetrics)
  const [isLive, setIsLive] = React.useState(isRealTime)
  const [alertsEnabled, setAlertsEnabled] = React.useState(enableAlerts)
  const [refreshInterval, setRefreshInterval] = React.useState("30")
  const [selectedTimeRange, setSelectedTimeRange] = React.useState("1h")
  const [showRealTimeEvents, setShowRealTimeEvents] = React.useState(false)
  
  // Real-time updates
  React.useEffect(() => {
    if (!isLive) return
    
    const interval = setInterval(() => {
      const newMetrics = generateRealTimeMetrics()
      setMetrics(newMetrics)
      
      // Check for alerts
      if (alertsEnabled) {
        checkMetricAlerts(newMetrics)
      }
    }, parseInt(refreshInterval) * 1000)
    
    return () => clearInterval(interval)
  }, [isLive, refreshInterval, alertsEnabled])
  
  // Alert checking
  const checkMetricAlerts = React.useCallback((metrics: BrowsePageMetrics) => {
    // Filter usage below target
    if (metrics.filterUsage.percentage < metrics.filterUsage.target) {
      onMetricAlert?.("filter_usage", metrics.filterUsage.percentage, metrics.filterUsage.target)
    }
    
    // Time to click above target
    if (metrics.avgTimeToClick.seconds > metrics.avgTimeToClick.target) {
      onMetricAlert?.("time_to_click", metrics.avgTimeToClick.seconds, metrics.avgTimeToClick.target)
    }
    
    // Conversion rate below target
    if (metrics.conversionRate.percentage < metrics.conversionRate.target) {
      onMetricAlert?.("conversion_rate", metrics.conversionRate.percentage, metrics.conversionRate.target)
    }
  }, [onMetricAlert])
  
  // Export metrics data
  const exportMetrics = () => {
    const data = {
      timestamp: new Date().toISOString(),
      timeRange: selectedTimeRange,
      metrics,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `browse-metrics-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("Metrics exported successfully")
  }
  
  // Reset all metrics
  const resetMetrics = () => {
    setMetrics(generateRealTimeMetrics())
    toast.success("Metrics reset")
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Dashboard Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              <Gauge className="h-6 w-6 text-purple-600" />
              Browse Page Metrics Dashboard
              {isLive && (
                <Badge variant="default" className="animate-pulse">
                  LIVE
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-3">
              {/* Real-time Toggle */}
              <div className="flex items-center gap-2">
                <Label htmlFor="live-mode" className="text-sm">Live</Label>
                <Switch
                  id="live-mode"
                  checked={isLive}
                  onCheckedChange={setIsLive}
                />
              </div>
              
              {/* Alerts Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                >
                  {alertsEnabled ? (
                    <Bell className="h-4 w-4 text-blue-500" />
                  ) : (
                    <BellOff className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              
              {/* Time Range */}
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1h</SelectItem>
                  <SelectItem value="6h">6h</SelectItem>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="7d">7d</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Actions */}
              <Button variant="outline" size="icon" onClick={exportMetrics}>
                <Download className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Metrics</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all current metrics data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetMetrics}>
                      Reset Metrics
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Real-time Status */}
      {isLive && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Monitoring Active</span>
                </div>
                <div className="text-sm text-gray-600">
                  Current Users: <span className="font-bold">{metrics.currentUsers}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Sessions Today: <span className="font-bold">{metrics.sessionsToday}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="refresh-interval" className="text-xs">Refresh:</Label>
                <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10s</SelectItem>
                    <SelectItem value="30">30s</SelectItem>
                    <SelectItem value="60">1m</SelectItem>
                    <SelectItem value="300">5m</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Filter Usage"
          value={`${metrics.filterUsage.percentage.toFixed(1)}%`}
          target={`Target: >${metrics.filterUsage.target}%`}
          status={metrics.filterUsage.status}
          trend={metrics.filterUsage.trend}
          icon={<Filter className="h-5 w-5" />}
          description="Users applying filters"
        />
        
        <MetricCard
          title="Avg Time to Click"
          value={`${metrics.avgTimeToClick.seconds.toFixed(1)}s`}
          target={`Target: <${metrics.avgTimeToClick.target}s`}
          status={metrics.avgTimeToClick.status}
          trend={metrics.avgTimeToClick.trend}
          icon={<Clock className="h-5 w-5" />}
          description="Time to first creator click"
        />
        
        <MetricCard
          title="Scroll Depth"
          value={`${metrics.scrollDepth.percentage.toFixed(1)}%`}
          target={`Target: >${metrics.scrollDepth.target}%`}
          status={metrics.scrollDepth.status}
          trend={metrics.scrollDepth.trend}
          icon={<ArrowDown className="h-5 w-5" />}
          description="Average page scroll depth"
        />
        
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate.percentage.toFixed(1)}%`}
          target={`Target: >${metrics.conversionRate.target}%`}
          status={metrics.conversionRate.status}
          trend={metrics.conversionRate.trend}
          icon={<Target className="h-5 w-5" />}
          description="Browse to booking rate"
        />
      </div>
      
      {/* Detailed Analytics */}
      <Tabs defaultValue="funnel" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="abandonment">Abandonment</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>
        
        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversion Funnel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.conversionRate.funnel.map((step, index) => (
                  <div key={step.step} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{step.step}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          {step.users.toLocaleString()} users
                        </span>
                        <span className="font-bold">{step.rate.toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${step.rate}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      
                      {index > 0 && (
                        <div className="absolute right-0 top-8 text-xs text-red-600">
                          -{(metrics.conversionRate.funnel[index - 1].rate - step.rate).toFixed(1)}% drop
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="abandonment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.abandonmentPoints.map((point) => (
              <Card key={point.location}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium">{point.location}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        point.impact === "high" ? "destructive" :
                        point.impact === "medium" ? "secondary" : "outline"
                      }>
                        {point.percentage.toFixed(1)}%
                      </Badge>
                      {point.trend > 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{point.reason}</p>
                  
                  <div className="flex items-center gap-2">
                    <Progress value={point.percentage} className="flex-1 h-2" />
                    <span className="text-xs font-mono">
                      {point.trend > 0 ? "+" : ""}{point.trend.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Interactions Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Time to Click Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">First-time users:</span>
                      <span className="font-medium">{metrics.avgTimeToClick.breakdown.firstTime.toFixed(1)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Returning users:</span>
                      <span className="font-medium">{metrics.avgTimeToClick.breakdown.returning.toFixed(1)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mobile users:</span>
                      <span className="font-medium">{metrics.avgTimeToClick.breakdown.mobile.toFixed(1)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Desktop users:</span>
                      <span className="font-medium">{metrics.avgTimeToClick.breakdown.desktop.toFixed(1)}s</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Scroll Depth Distribution</h4>
                  <div className="space-y-2">
                    {metrics.scrollDepth.distribution.map((percentage, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm w-12">{index * 12.5}%:</span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono w-12">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Real-time Events</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRealTimeEvents(!showRealTimeEvents)}
                >
                  {showRealTimeEvents ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {showRealTimeEvents ? "Pause" : "Start"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showRealTimeEvents ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {metrics.realTimeEvents.map((event, index) => (
                      <motion.div
                        key={`${event.timestamp}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            event.type === "filter_apply" && "bg-blue-500",
                            event.type === "creator_click" && "bg-green-500",
                            event.type === "scroll" && "bg-yellow-500",
                            event.type === "search" && "bg-purple-500",
                            event.type === "abandonment" && "bg-red-500"
                          )} />
                          <span className="font-medium">{event.type.replace("_", " ")}</span>
                          <span className="text-gray-500">by {event.userId}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Real-time monitoring paused</p>
                  <p className="text-xs">Click Start to begin monitoring events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Metric Card Component
function MetricCard({
  title,
  value,
  target,
  status,
  trend,
  icon,
  description
}: {
  title: string
  value: string
  target: string
  status: "success" | "warning" | "error"
  trend: number
  icon: React.ReactNode
  description: string
}) {
  const statusColors = {
    success: "border-green-500 bg-green-50 dark:bg-green-900/20",
    warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
    error: "border-red-500 bg-red-50 dark:bg-red-900/20"
  }
  
  const statusIcons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertTriangle
  }
  
  const StatusIcon = statusIcons[status]
  
  return (
    <Card className={cn("border-l-4", statusColors[status])}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-medium text-sm">{title}</h3>
          </div>
          <StatusIcon className={cn(
            "h-4 w-4",
            status === "success" ? "text-green-500" :
            status === "warning" ? "text-yellow-500" : "text-red-500"
          )} />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">{value}</span>
            <div className="flex items-center gap-1 text-xs">
              {trend > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={trend > 0 ? "text-green-600" : "text-red-600"}>
                {trend > 0 ? "+" : ""}{trend.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500">{target}</p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}