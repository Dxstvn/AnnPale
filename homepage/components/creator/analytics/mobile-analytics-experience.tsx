"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import {
  Smartphone,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Calendar,
  Filter,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Bell,
  Award,
  Target,
  Zap,
  RefreshCw,
  Maximize2,
  Minimize2,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  PieChart,
  LineChart,
  Hash,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Gift,
  Trophy,
  Sparkles,
  Flame,
  Timer,
  Settings,
  Download,
  Send,
  Plus,
  Minus,
  X,
  Menu,
  Grid,
  List,
  Layers,
  Gauge,
  Receipt,
  CreditCard,
  ShoppingBag,
  Video,
  PlayCircle,
  Radio,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow
} from "lucide-react"
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSwipeable } from "react-swipeable"

// Types
export interface MobileMetric {
  id: string
  title: string
  value: string | number
  change?: number
  trend?: "up" | "down" | "stable"
  icon: React.ElementType
  color: string
  sparkline?: number[]
  subtitle?: string
  isLive?: boolean
}

export interface MobileWidget {
  id: string
  type: "metric" | "chart" | "list" | "summary"
  title: string
  size: "small" | "medium" | "large"
  data: any
  refreshable?: boolean
  expandable?: boolean
}

export interface GlanceableInsight {
  id: string
  type: "milestone" | "goal" | "alert" | "summary"
  title: string
  description: string
  icon: React.ElementType
  color: string
  action?: string
  priority?: "low" | "medium" | "high"
  timestamp?: Date
}

export interface TouchGesture {
  type: "swipe" | "pinch" | "longPress" | "pull" | "tap"
  direction?: "left" | "right" | "up" | "down"
  action: string
  enabled: boolean
}

export interface MobileAnalyticsExperienceProps {
  onMetricTap?: (metricId: string) => void
  onSwipeAction?: (direction: string, currentView: string) => void
  onPullToRefresh?: () => Promise<void>
  onFilterChange?: (filters: any) => void
  onNotificationTap?: (notificationId: string) => void
}

// Mock data generators
const generateMobileMetrics = (): MobileMetric[] => {
  return [
    {
      id: "revenue_today",
      title: "Today's Revenue",
      value: "$2,847",
      change: 12,
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      sparkline: Array.from({ length: 7 }, () => Math.random() * 100),
      subtitle: "vs yesterday",
      isLive: true
    },
    {
      id: "active_users",
      title: "Active Now",
      value: 147,
      change: 8,
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      sparkline: Array.from({ length: 7 }, () => Math.random() * 150),
      subtitle: "watching"
    },
    {
      id: "pending_requests",
      title: "Pending",
      value: 7,
      trend: "stable",
      icon: Clock,
      color: "text-orange-600",
      subtitle: "requests"
    },
    {
      id: "rating",
      title: "Rating",
      value: "4.9",
      change: 0.1,
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
      subtitle: "this week"
    }
  ]
}

const generateGlanceableInsights = (): GlanceableInsight[] => {
  return [
    {
      id: "milestone_1",
      type: "milestone",
      title: "100 Videos Completed! 🎉",
      description: "You've reached a major milestone",
      icon: Trophy,
      color: "text-yellow-600",
      action: "Share Achievement",
      priority: "high",
      timestamp: new Date()
    },
    {
      id: "goal_1",
      type: "goal",
      title: "Daily Goal: 85% Complete",
      description: "$425 more to reach today's target",
      icon: Target,
      color: "text-blue-600",
      action: "View Progress",
      priority: "medium",
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: "alert_1",
      type: "alert",
      title: "Response Time Alert",
      description: "3 requests approaching deadline",
      icon: AlertCircle,
      color: "text-red-600",
      action: "View Requests",
      priority: "high",
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: "summary_1",
      type: "summary",
      title: "Morning Summary",
      description: "12 new bookings, 5 reviews received",
      icon: Sparkles,
      color: "text-purple-600",
      action: "View Details",
      priority: "low",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
    }
  ]
}

const generateMobileWidgets = (): MobileWidget[] => {
  return [
    {
      id: "quick_stats",
      type: "metric",
      title: "Quick Stats",
      size: "medium",
      data: {
        revenue: "$2,847",
        bookings: 24,
        rating: 4.9,
        response: "98%"
      },
      refreshable: true,
      expandable: false
    },
    {
      id: "mini_chart",
      type: "chart",
      title: "7-Day Trend",
      size: "small",
      data: Array.from({ length: 7 }, (_, i) => ({
        day: ["M", "T", "W", "T", "F", "S", "S"][i],
        value: Math.random() * 100 + 50
      })),
      refreshable: true,
      expandable: true
    },
    {
      id: "recent_activity",
      type: "list",
      title: "Recent Activity",
      size: "large",
      data: [
        { type: "booking", title: "New booking from Sarah M.", time: "2m ago" },
        { type: "review", title: "5-star review received", time: "15m ago" },
        { type: "payment", title: "Payment of $150 received", time: "1h ago" }
      ],
      refreshable: true,
      expandable: true
    }
  ]
}

// Sub-components
const MobileMetricCard: React.FC<{
  metric: MobileMetric
  onTap: () => void
}> = ({ metric, onTap }) => {
  const Icon = metric.icon
  const [isPressed, setIsPressed] = React.useState(false)

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onTapStart={() => setIsPressed(true)}
      onTap={() => {
        setIsPressed(false)
        onTap()
      }}
      onTapCancel={() => setIsPressed(false)}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all",
        isPressed && "ring-2 ring-blue-500 shadow-lg"
      )}>
        {metric.isLive && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="destructive" className="text-xs px-1 py-0">
              <Radio className="h-2 w-2 mr-1 animate-pulse" />
              LIVE
            </Badge>
          </div>
        )}
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", metric.color)}>
              <Icon className="h-4 w-4" />
            </div>
            {metric.trend && (
              <div className="flex items-center gap-1">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : metric.trend === "down" ? (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                ) : (
                  <Minus className="h-3 w-3 text-gray-600" />
                )}
                {metric.change && (
                  <span className={cn(
                    "text-xs font-medium",
                    metric.trend === "up" ? "text-green-600" : 
                    metric.trend === "down" ? "text-red-600" : "text-gray-600"
                  )}>
                    {metric.trend === "up" ? "+" : ""}{metric.change}%
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h4 className="text-xs text-gray-600 dark:text-gray-400">{metric.title}</h4>
            <div className="text-xl font-bold">{metric.value}</div>
            {metric.subtitle && (
              <p className="text-xs text-gray-500">{metric.subtitle}</p>
            )}
          </div>

          {metric.sparkline && (
            <div className="h-6 flex items-end gap-px mt-2">
              {metric.sparkline.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-t"
                  style={{ height: `${(value / Math.max(...metric.sparkline)) * 100}%` }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

const SwipeableView: React.FC<{
  children: React.ReactNode[]
  onSwipe: (direction: string, index: number) => void
}> = ({ children, onSwipe }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isAnimating, setIsAnimating] = React.useState(false)

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < children.length - 1 && !isAnimating) {
        setIsAnimating(true)
        setCurrentIndex(prev => prev + 1)
        onSwipe("left", currentIndex + 1)
        setTimeout(() => setIsAnimating(false), 300)
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0 && !isAnimating) {
        setIsAnimating(true)
        setCurrentIndex(prev => prev - 1)
        onSwipe("right", currentIndex - 1)
        setTimeout(() => setIsAnimating(false), 300)
      }
    },
    trackMouse: false,
    trackTouch: true
  })

  return (
    <div {...handlers} className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1">
          {children.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === currentIndex ? "w-6 bg-blue-600" : "w-1.5 bg-gray-300"
              )}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          {currentIndex + 1} / {children.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {children[currentIndex]}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-4 mt-4">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex(prev => prev - 1)
              onSwipe("right", currentIndex - 1)
            }
          }}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (currentIndex < children.length - 1) {
              setCurrentIndex(prev => prev + 1)
              onSwipe("left", currentIndex + 1)
            }
          }}
          disabled={currentIndex === children.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const PullToRefresh: React.FC<{
  onRefresh: () => Promise<void>
  children: React.ReactNode
}> = ({ onRefresh, children }) => {
  const [isPulling, setIsPulling] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [pullDistance, setPullDistance] = React.useState(0)
  const threshold = 80

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPulling && !isRefreshing) {
      const touch = e.touches[0]
      const distance = Math.min(touch.clientY, threshold * 1.5)
      setPullDistance(distance)
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true)
      await onRefresh()
      setIsRefreshing(false)
    }
    setIsPulling(false)
    setPullDistance(0)
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {(isPulling || isRefreshing) && (
        <div 
          className="absolute top-0 left-0 right-0 flex justify-center items-center transition-all"
          style={{ height: pullDistance, transform: `translateY(-${pullDistance}px)` }}
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : pullDistance * 2 }}
            transition={{ duration: isRefreshing ? 1 : 0, repeat: isRefreshing ? Infinity : 0 }}
          >
            <RefreshCw className={cn(
              "h-6 w-6",
              pullDistance > threshold ? "text-blue-600" : "text-gray-400"
            )} />
          </motion.div>
        </div>
      )}
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  )
}

const InsightNotification: React.FC<{
  insight: GlanceableInsight
  onTap: () => void
  onDismiss: () => void
}> = ({ insight, onTap, onDismiss }) => {
  const Icon = insight.icon

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
      className={cn(
        "relative p-3 rounded-lg shadow-lg cursor-pointer",
        insight.priority === "high" ? "bg-red-50 dark:bg-red-900/20 border-red-200" :
        insight.priority === "medium" ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200" :
        "bg-blue-50 dark:bg-blue-900/20 border-blue-200"
      )}
    >
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-1 right-1 h-6 w-6 p-0"
        onClick={(e) => {
          e.stopPropagation()
          onDismiss()
        }}
      >
        <X className="h-3 w-3" />
      </Button>

      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg bg-white dark:bg-gray-800", insight.color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-medium text-sm mb-1">{insight.title}</h5>
          <p className="text-xs text-gray-600 dark:text-gray-400">{insight.description}</p>
          {insight.action && (
            <Button variant="link" className="h-auto p-0 text-xs mt-1">
              {insight.action}
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const MobileFilterSheet: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: any) => void
}> = ({ open, onOpenChange, onApplyFilters }) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState("today")
  const [selectedMetrics, setSelectedMetrics] = React.useState(["revenue", "bookings"])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[400px]">
        <SheetHeader>
          <SheetTitle>Filters & Settings</SheetTitle>
          <SheetDescription>
            Customize your analytics view
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {/* Time Period */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Time Period</Label>
            <div className="grid grid-cols-4 gap-2">
              {["Today", "Week", "Month", "Year"].map(period => (
                <Button
                  key={period}
                  variant={selectedPeriod === period.toLowerCase() ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.toLowerCase())}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Visible Metrics</Label>
            <div className="space-y-2">
              {[
                { id: "revenue", label: "Revenue", icon: DollarSign },
                { id: "bookings", label: "Bookings", icon: ShoppingBag },
                { id: "users", label: "Active Users", icon: Users },
                { id: "rating", label: "Ratings", icon: Star }
              ].map(metric => (
                <label
                  key={metric.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMetrics([...selectedMetrics, metric.id])
                      } else {
                        setSelectedMetrics(selectedMetrics.filter(m => m !== metric.id))
                      }
                    }}
                    className="rounded"
                  />
                  <metric.icon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{metric.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <Button
            className="w-full"
            onClick={() => {
              onApplyFilters({ period: selectedPeriod, metrics: selectedMetrics })
              onOpenChange(false)
            }}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const MobileWidgetGrid: React.FC<{
  widgets: MobileWidget[]
  onWidgetTap: (widgetId: string) => void
  onWidgetRefresh: (widgetId: string) => void
}> = ({ widgets, onWidgetTap, onWidgetRefresh }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {widgets.map(widget => (
        <motion.div
          key={widget.id}
          layoutId={widget.id}
          className={cn(
            widget.size === "large" && "col-span-2",
            widget.size === "medium" && "col-span-2 sm:col-span-1"
          )}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="p-3 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{widget.title}</CardTitle>
                <div className="flex gap-1">
                  {widget.refreshable && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => onWidgetRefresh(widget.id)}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  )}
                  {widget.expandable && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => onWidgetTap(widget.id)}
                    >
                      <Maximize2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {widget.type === "metric" && (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(widget.data).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-bold">{value as string}</div>
                      <div className="text-xs text-gray-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {widget.type === "chart" && (
                <div className="h-20">
                  <div className="flex items-end justify-between h-full gap-1">
                    {(widget.data as any[]).map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-500 rounded-t"
                          style={{ height: `${item.value}%` }}
                        />
                        <span className="text-xs mt-1">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {widget.type === "list" && (
                <div className="space-y-2">
                  {(widget.data as any[]).slice(0, 3).map((item, index) => (
                    <div key={index} className="text-xs">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-gray-500">{item.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// Main component
export const MobileAnalyticsExperience: React.FC<MobileAnalyticsExperienceProps> = ({
  onMetricTap,
  onSwipeAction,
  onPullToRefresh = async () => { await new Promise(resolve => setTimeout(resolve, 1000)) },
  onFilterChange,
  onNotificationTap
}) => {
  const [metrics] = React.useState<MobileMetric[]>(generateMobileMetrics())
  const [insights, setInsights] = React.useState<GlanceableInsight[]>(generateGlanceableInsights())
  const [widgets] = React.useState<MobileWidget[]>(generateMobileWidgets())
  const [showFilters, setShowFilters] = React.useState(false)
  const [activeView, setActiveView] = React.useState<"dashboard" | "metrics" | "insights">("dashboard")
  const [showNotifications, setShowNotifications] = React.useState(true)

  const handleInsightDismiss = (insightId: string) => {
    setInsights(prev => prev.filter(i => i.id !== insightId))
  }

  const handleSwipe = (direction: string, index: number) => {
    console.log(`Swiped ${direction} to index ${index}`)
    onSwipeAction?.(direction, activeView)
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold">Analytics</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {insights.length > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-600 rounded-full" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowFilters(true)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-t">
          {["dashboard", "metrics", "insights"].map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view as any)}
              className={cn(
                "flex-1 py-2 text-xs font-medium capitalize transition-colors",
                activeView === view ? 
                  "text-blue-600 border-b-2 border-blue-600" : 
                  "text-gray-600"
              )}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {showNotifications && insights.length > 0 && (
        <AnimatePresence>
          <div className="px-3 space-y-2">
            {insights.slice(0, 2).map(insight => (
              <InsightNotification
                key={insight.id}
                insight={insight}
                onTap={() => onNotificationTap?.(insight.id)}
                onDismiss={() => handleInsightDismiss(insight.id)}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Main Content with Pull to Refresh */}
      <PullToRefresh onRefresh={onPullToRefresh}>
        <div className="px-3 pb-20">
          {activeView === "dashboard" && (
            <div className="space-y-4">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3">
                {metrics.slice(0, 4).map(metric => (
                  <MobileMetricCard
                    key={metric.id}
                    metric={metric}
                    onTap={() => onMetricTap?.(metric.id)}
                  />
                ))}
              </div>

              {/* Widgets */}
              <MobileWidgetGrid
                widgets={widgets}
                onWidgetTap={(id) => console.log("Widget tapped:", id)}
                onWidgetRefresh={(id) => console.log("Widget refresh:", id)}
              />
            </div>
          )}

          {activeView === "metrics" && (
            <SwipeableView onSwipe={handleSwipe}>
              {metrics.map(metric => (
                <div key={metric.id} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <metric.icon className={cn("h-5 w-5", metric.color)} />
                        {metric.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <div className="text-4xl font-bold mb-2">{metric.value}</div>
                        {metric.change && (
                          <div className={cn(
                            "text-sm font-medium",
                            metric.trend === "up" ? "text-green-600" : "text-red-600"
                          )}>
                            {metric.trend === "up" ? "↑" : "↓"} {metric.change}% {metric.subtitle}
                          </div>
                        )}
                      </div>
                      
                      {metric.sparkline && (
                        <div className="h-32 flex items-end gap-1">
                          {metric.sparkline.map((value, index) => (
                            <div
                              key={index}
                              className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                              style={{ height: `${value}%` }}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </SwipeableView>
          )}

          {activeView === "insights" && (
            <div className="space-y-3">
              {insights.map(insight => (
                <Card key={insight.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", insight.color)}>
                        <insight.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        {insight.action && (
                          <Button size="sm" variant="outline">
                            {insight.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PullToRefresh>

      {/* Filter Sheet */}
      <MobileFilterSheet
        open={showFilters}
        onOpenChange={setShowFilters}
        onApplyFilters={(filters) => {
          onFilterChange?.(filters)
          console.log("Filters applied:", filters)
        }}
      />

      {/* Bottom Navigation (Fixed) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t">
        <div className="flex">
          {[
            { icon: BarChart3, label: "Overview" },
            { icon: TrendingUp, label: "Trends" },
            { icon: Target, label: "Goals" },
            { icon: Settings, label: "Settings" }
          ].map((item, index) => (
            <button
              key={item.label}
              className="flex-1 py-3 flex flex-col items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <item.icon className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-600">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}