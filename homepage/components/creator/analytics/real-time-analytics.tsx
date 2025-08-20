"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Bell,
  Eye,
  MessageSquare,
  Video,
  Star,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Zap,
  Timer,
  Target,
  Heart,
  Share2,
  Gift,
  CreditCard,
  PlayCircle,
  Radio,
  Wifi,
  WifiOff,
  RefreshCw,
  BarChart3,
  Hash,
  UserCheck,
  Send,
  Receipt,
  Sparkles,
  Flame,
  Award,
  ShoppingBag,
  Calendar,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Filter,
  Settings,
  Download,
  Info,
  X,
  Plus,
  Minus
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Types
export interface RealTimeMetric {
  id: string
  name: string
  value: number | string
  previousValue?: number | string
  change?: number
  changeType?: "increase" | "decrease" | "neutral"
  updateRate: string
  displayFormat: "counter" | "ticker" | "badge" | "countdown" | "indicator"
  alertCondition?: string
  quickAction?: {
    label: string
    action: () => void
  }
  icon: React.ElementType
  color: string
  sparkline?: number[]
  isLive?: boolean
  lastUpdated?: Date
}

export interface ActivityItem {
  id: string
  type: "booking" | "video_completed" | "message" | "review" | "payment" | "alert"
  title: string
  description: string
  timestamp: Date
  icon: React.ElementType
  color: string
  actionLabel?: string
  actionUrl?: string
  isNew?: boolean
  priority?: "low" | "medium" | "high" | "critical"
}

export interface PerformancePulse {
  metric: string
  current: number
  target: number
  previous: number
  trend: "up" | "down" | "stable"
  hourlyData: Array<{ hour: number; value: number }>
}

export interface RealTimeAnalyticsProps {
  onMetricClick?: (metricId: string) => void
  onActivityAction?: (activityId: string) => void
  onQuickAction?: (metricId: string, action: string) => void
  refreshInterval?: number
  showNotifications?: boolean
}

// Mock data generators
const generateRealTimeMetrics = (): RealTimeMetric[] => {
  const baseMetrics: RealTimeMetric[] = [
    {
      id: "active_viewers",
      name: "Active Viewers",
      value: 156, // Fixed initial value for SSR
      previousValue: 115,
      change: 8.7,
      changeType: "increase",
      updateRate: "Every second",
      displayFormat: "counter",
      alertCondition: "Spike detected",
      quickAction: {
        label: "Go Live",
        action: () => console.log("Going live...")
      },
      icon: Eye,
      color: "text-blue-600",
      sparkline: [75, 80, 65, 90, 85, 70, 95, 88, 76, 82], // Fixed sparkline for SSR
      isLive: true,
      lastUpdated: new Date()
    },
    {
      id: "current_earnings",
      name: "Current Earnings",
      value: "$2,847.50", // Fixed initial value for SSR
      previousValue: "$2,450.00",
      change: 12.4,
      changeType: "increase",
      updateRate: "Per transaction",
      displayFormat: "ticker",
      alertCondition: "Goal reached",
      quickAction: {
        label: "Celebrate",
        action: () => console.log("Celebrating...")
      },
      icon: DollarSign,
      color: "text-green-600",
      sparkline: [180, 220, 195, 240, 210, 185, 230, 205, 190, 215], // Fixed sparkline for SSR
      isLive: true,
      lastUpdated: new Date()
    },
    {
      id: "pending_requests",
      name: "Pending Requests",
      value: 7,
      previousValue: 5,
      change: 40,
      changeType: "increase",
      updateRate: "Instant",
      displayFormat: "badge",
      alertCondition: "New arrival",
      quickAction: {
        label: "Review Now",
        action: () => console.log("Reviewing requests...")
      },
      icon: Bell,
      color: "text-orange-600",
      isLive: true,
      lastUpdated: new Date()
    },
    {
      id: "response_timer",
      name: "Response Timer",
      value: "0:47:23",
      updateRate: "Per minute",
      displayFormat: "countdown",
      alertCondition: "< 1 hour left",
      quickAction: {
        label: "Respond",
        action: () => console.log("Responding...")
      },
      icon: Timer,
      color: "text-red-600",
      isLive: true,
      lastUpdated: new Date()
    },
    {
      id: "trend_detection",
      name: "Trend Detection",
      value: "Rising",
      change: 15,
      changeType: "increase",
      updateRate: "5 minutes",
      displayFormat: "indicator",
      alertCondition: "Significant change",
      quickAction: {
        label: "Investigate",
        action: () => console.log("Investigating trend...")
      },
      icon: TrendingUp,
      color: "text-purple-600",
      sparkline: [45, 52, 38, 60, 55, 42, 58, 50, 47, 53], // Fixed sparkline for SSR
      isLive: true,
      lastUpdated: new Date()
    }
  ]

  return baseMetrics
}

const generateActivityStream = (): ActivityItem[] => {
  const activities: ActivityItem[] = [
    {
      id: "act_1",
      type: "booking",
      title: "New Booking Request",
      description: "Sarah M. requested a birthday message",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      icon: ShoppingBag,
      color: "text-blue-600",
      actionLabel: "View Details",
      isNew: true,
      priority: "high"
    },
    {
      id: "act_2",
      type: "video_completed",
      title: "Video Completed",
      description: "Anniversary message for John & Mary",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      icon: Video,
      color: "text-green-600",
      actionLabel: "View Video",
      isNew: true
    },
    {
      id: "act_3",
      type: "message",
      title: "New Customer Message",
      description: "Question about custom requests",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      icon: MessageSquare,
      color: "text-purple-600",
      actionLabel: "Reply",
      isNew: true,
      priority: "medium"
    },
    {
      id: "act_4",
      type: "review",
      title: "5-Star Review",
      description: "\"Amazing! Made our day special!\"",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      icon: Star,
      color: "text-yellow-600",
      actionLabel: "Thank Customer"
    },
    {
      id: "act_5",
      type: "payment",
      title: "Payment Received",
      description: "$150 for business greeting",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      icon: CreditCard,
      color: "text-green-600"
    },
    {
      id: "act_6",
      type: "alert",
      title: "Response Time Alert",
      description: "3 requests approaching deadline",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      icon: AlertCircle,
      color: "text-red-600",
      actionLabel: "View Requests",
      priority: "critical"
    }
  ]

  return activities
}

const generatePerformancePulse = (): PerformancePulse[] => {
  // Fixed data for SSR compatibility
  const fixedHourlyData1 = [45, 52, 38, 60, 55, 42, 58, 50, 47, 53, 65, 72, 68, 70, 75, 80, 78, 82, 76, 85, 88, 79, 73, 68];
  const fixedHourlyData2 = [25, 32, 28, 35, 42, 38, 45, 50, 47, 53, 58, 62, 65, 68, 72, 75, 78, 80, 76, 72, 68, 65, 58, 52];
  const fixedHourlyData3 = [85, 92, 78, 105, 120, 108, 135, 150, 142, 158, 165, 172, 168, 175, 180, 185, 190, 195, 188, 182, 175, 168, 155, 142];
  const fixedHourlyData4 = [88, 92, 85, 90, 87, 95, 92, 90, 93, 88, 85, 90, 88, 92, 90, 87, 85, 88, 92, 90, 87, 85, 88, 90];
  
  return [
    {
      metric: "Day Progress",
      current: 68,
      target: 100,
      previous: 62,
      trend: "up",
      hourlyData: fixedHourlyData1.map((value, i) => ({
        hour: i,
        value
      }))
    },
    {
      metric: "Conversion Rate",
      current: 42,
      target: 50,
      previous: 38,
      trend: "up",
      hourlyData: fixedHourlyData2.map((value, i) => ({
        hour: i,
        value
      }))
    },
    {
      metric: "Active Sessions",
      current: 156,
      target: 200,
      previous: 142,
      trend: "up",
      hourlyData: fixedHourlyData3.map((value, i) => ({
        hour: i,
        value
      }))
    },
    {
      metric: "Response Rate",
      current: 92,
      target: 95,
      previous: 94,
      trend: "down",
      hourlyData: fixedHourlyData4.map((value, i) => ({
        hour: i,
        value
      }))
    }
  ]
}

// Sub-components
const LiveMetricCard: React.FC<{
  metric: RealTimeMetric
  onClick?: () => void
  onQuickAction?: () => void
}> = ({ metric, onClick, onQuickAction }) => {
  const Icon = metric.icon

  const renderValue = () => {
    switch (metric.displayFormat) {
      case "counter":
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{metric.value}</span>
            {metric.change && (
              <span className={cn(
                "text-sm font-medium",
                metric.changeType === "increase" ? "text-green-600" : "text-red-600"
              )}>
                {metric.changeType === "increase" ? "+" : "-"}{Math.abs(metric.change)}%
              </span>
            )}
          </div>
        )
      case "ticker":
        return (
          <motion.div
            key={metric.value.toString()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            {metric.value}
          </motion.div>
        )
      case "badge":
        return (
          <Badge className="px-3 py-1 text-lg">
            {metric.value}
          </Badge>
        )
      case "countdown":
        return (
          <div className="text-2xl font-mono font-bold text-red-600">
            {metric.value}
          </div>
        )
      case "indicator":
        return (
          <div className="flex items-center gap-2">
            {metric.changeType === "increase" ? (
              <TrendingUp className="h-6 w-6 text-green-600" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-600" />
            )}
            <span className="text-lg font-semibold">{metric.value}</span>
          </div>
        )
      default:
        return <span className="text-2xl font-bold">{metric.value}</span>
    }
  }

  return (
    <Card 
      className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {metric.isLive && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1">
            <Radio className="h-3 w-3 text-red-600 animate-pulse" />
            <span className="text-xs text-red-600 font-medium">LIVE</span>
          </div>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", metric.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600">{metric.name}</h4>
              <p className="text-xs text-gray-500">{metric.updateRate}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          {renderValue()}
        </div>

        {metric.sparkline && (
          <div className="h-8 flex items-end gap-1 mb-4">
            {metric.sparkline.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-t"
                style={{ height: `${(value / Math.max(...metric.sparkline)) * 100}%` }}
              />
            ))}
          </div>
        )}

        {metric.quickAction && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onQuickAction?.()
            }}
            className="w-full"
          >
            {metric.quickAction.label}
          </Button>
        )}

        {metric.alertCondition && (
          <div className="mt-2 text-xs text-gray-500">
            Alert: {metric.alertCondition}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const ActivityStreamItem: React.FC<{
  activity: ActivityItem
  onAction?: () => void
}> = ({ activity, onAction }) => {
  const Icon = activity.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
        activity.isNew && "bg-blue-50 dark:bg-blue-900/20"
      )}
    >
      <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", activity.color)}>
        <Icon className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h5 className="font-medium text-sm">{activity.title}</h5>
            <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
          </div>
          {activity.priority && (
            <Badge
              variant={
                activity.priority === "critical" ? "destructive" :
                activity.priority === "high" ? "default" :
                activity.priority === "medium" ? "secondary" : "outline"
              }
              className="text-xs"
            >
              {activity.priority}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            {new Date(activity.timestamp).toLocaleTimeString()}
          </span>
          {activity.actionLabel && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onAction}
              className="h-6 px-2 text-xs"
            >
              {activity.actionLabel}
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const PerformancePulseCard: React.FC<{
  pulse: PerformancePulse
}> = ({ pulse }) => {
  const currentHour = new Date().getHours()
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">{pulse.metric}</h4>
          <div className="flex items-center gap-1">
            {pulse.trend === "up" ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : pulse.trend === "down" ? (
              <TrendingDown className="h-3 w-3 text-red-600" />
            ) : (
              <Minus className="h-3 w-3 text-gray-600" />
            )}
            <span className={cn(
              "text-xs font-medium",
              pulse.trend === "up" ? "text-green-600" :
              pulse.trend === "down" ? "text-red-600" : "text-gray-600"
            )}>
              {pulse.trend === "up" ? "+" : pulse.trend === "down" ? "-" : ""}
              {Math.abs(pulse.current - pulse.previous).toFixed(0)}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold">{pulse.current}</span>
            <span className="text-sm text-gray-500">/ {pulse.target}</span>
          </div>
          <Progress value={(pulse.current / pulse.target) * 100} className="h-2" />
        </div>

        <div className="h-12 flex items-end gap-px">
          {pulse.hourlyData.slice(0, 24).map((data, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 rounded-t transition-colors",
                index === currentHour ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              )}
              style={{ height: `${(data.value / 100) * 100}%` }}
              title={`${data.hour}:00 - ${data.value.toFixed(0)}`}
            />
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>12AM</span>
          <span>Now</span>
          <span>11PM</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Main component
export const RealTimeAnalytics: React.FC<RealTimeAnalyticsProps> = ({
  onMetricClick,
  onActivityAction,
  onQuickAction,
  refreshInterval = 5000,
  showNotifications = true
}) => {
  const [metrics, setMetrics] = React.useState<RealTimeMetric[]>([])
  const [activities, setActivities] = React.useState<ActivityItem[]>([])
  const [performancePulse, setPerformancePulse] = React.useState<PerformancePulse[]>([])
  const [isConnected, setIsConnected] = React.useState(true)
  const [lastUpdate, setLastUpdate] = React.useState(new Date())
  const [autoRefresh, setAutoRefresh] = React.useState(true)
  const [isHydrated, setIsHydrated] = React.useState(false)

  // Initialize data and hydration
  React.useEffect(() => {
    setIsHydrated(true)
    setMetrics(generateRealTimeMetrics())
    setActivities(generateActivityStream())
    setPerformancePulse(generatePerformancePulse())
  }, [])

  // Simulate real-time updates
  React.useEffect(() => {
    if (!autoRefresh || !isHydrated) return

    const interval = setInterval(() => {
      // Update metrics with slight variations
      setMetrics(prev => prev.map(metric => {
        if (metric.id === "active_viewers") {
          const change = Math.floor(Math.random() * 10) - 5
          const newValue = Math.max(0, (metric.value as number) + change)
          return {
            ...metric,
            value: newValue,
            change: ((newValue - (metric.previousValue as number)) / (metric.previousValue as number)) * 100,
            changeType: newValue > (metric.previousValue as number) ? "increase" : "decrease",
            lastUpdated: new Date()
          }
        }
        if (metric.id === "current_earnings") {
          const currentValue = parseFloat((metric.value as string).replace("$", "").replace(",", ""))
          const newValue = currentValue + (Math.random() * 50)
          return {
            ...metric,
            value: `$${newValue.toFixed(2)}`,
            lastUpdated: new Date()
          }
        }
        if (metric.id === "response_timer") {
          // Countdown timer logic
          const [hours, minutes, seconds] = (metric.value as string).split(":").map(Number)
          let totalSeconds = hours * 3600 + minutes * 60 + seconds - 1
          if (totalSeconds < 0) totalSeconds = 0
          const h = Math.floor(totalSeconds / 3600)
          const m = Math.floor((totalSeconds % 3600) / 60)
          const s = totalSeconds % 60
          return {
            ...metric,
            value: `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
            lastUpdated: new Date()
          }
        }
        return { ...metric, lastUpdated: new Date() }
      }))

      // Occasionally add new activities
      if (Math.random() > 0.7) {
        const newActivity: ActivityItem = {
          id: `act_${Date.now()}`,
          type: ["booking", "message", "review", "payment"][Math.floor(Math.random() * 4)] as ActivityItem["type"],
          title: "New Activity",
          description: "Just happened",
          timestamp: new Date(),
          icon: Bell,
          color: "text-blue-600",
          isNew: true
        }
        setActivities(prev => [newActivity, ...prev].slice(0, 10))
      }

      setLastUpdate(new Date())
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, isHydrated])

  // Connection status simulation
  React.useEffect(() => {
    if (!isHydrated) return
    
    const checkConnection = setInterval(() => {
      setIsConnected(Math.random() > 0.1) // 90% uptime simulation
    }, 10000)

    return () => clearInterval(checkConnection)
  }, [isHydrated])

  return (
    <div className="space-y-6">
      {/* Connection Status Bar */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">Reconnecting...</span>
            </>
          )}
          <Separator orientation="vertical" className="h-4" />
          <span className="text-xs text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={cn("h-4 w-4 mr-1", autoRefresh && "animate-spin")} />
            {autoRefresh ? "Auto" : "Manual"}
          </Button>
          {showNotifications && (
            <Button size="sm" variant="outline">
              <Bell className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Real-Time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map(metric => (
          <LiveMetricCard
            key={metric.id}
            metric={metric}
            onClick={() => onMetricClick?.(metric.id)}
            onQuickAction={() => onQuickAction?.(metric.id, "quick")}
          />
        ))}
      </div>

      {/* Activity Stream and Performance Pulse */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Stream */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Stream
              </span>
              <Badge variant="secondary">
                {activities.filter(a => a.isNew).length} new
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time updates from your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <AnimatePresence>
                <div className="space-y-2">
                  {activities.map(activity => (
                    <ActivityStreamItem
                      key={activity.id}
                      activity={activity}
                      onAction={() => onActivityAction?.(activity.id)}
                    />
                  ))}
                </div>
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Performance Pulse */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Pulse
              </CardTitle>
              <CardDescription>
                Hour-by-hour performance tracking
              </CardDescription>
            </CardHeader>
          </Card>
          
          <div className="grid gap-4">
            {performancePulse.map(pulse => (
              <PerformancePulseCard
                key={pulse.metric}
                pulse={pulse}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">↑ 24%</div>
              <div className="text-sm text-gray-600 mt-1">vs Yesterday</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600 mt-1">Active Now</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">4.9</div>
              <div className="text-sm text-gray-600 mt-1">Avg Rating Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">92%</div>
              <div className="text-sm text-gray-600 mt-1">Response Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}