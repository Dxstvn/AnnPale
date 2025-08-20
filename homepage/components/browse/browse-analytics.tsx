"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
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
  Target,
  Clock,
  MousePointer,
  Filter,
  TrendingUp,
  TrendingDown,
  Eye,
  AlertTriangle,
  CheckCircle,
  Activity,
  Users,
  Zap,
  ArrowDown,
  ArrowUp,
  Gauge,
  Download,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { FilterState } from "./filter-sidebar"

// Browse-specific metrics from Phase 2.1.10
export interface BrowseMetrics {
  filterUsage: {
    percentage: number
    target: number
    status: "success" | "warning" | "error"
    mostUsedFilters: Array<{ name: string; usage: number }>
    filterToResultsRatio: number
  }
  
  avgTimeToClick: {
    seconds: number
    target: number
    status: "success" | "warning" | "error"
    breakdown: {
      firstTimeUsers: number
      returningUsers: number
      mobileUsers: number
      desktopUsers: number
    }
  }
  
  scrollDepth: {
    percentage: number
    target: number
    status: "success" | "warning" | "error"
    heatmap: Array<{ depth: number; users: number }>
  }
  
  conversionRate: {
    percentage: number
    target: number
    status: "success" | "warning" | "error"
    funnel: Array<{
      step: string
      users: number
      conversionRate: number
      dropOff: number
    }>
  }
  
  abandonmentPoints: Array<{
    location: string
    percentage: number
    reason: string
    impact: "high" | "medium" | "low"
    suggestions: string[]
  }>
}

export interface BrowseInteractionEvent {
  type: "filter_apply" | "sort_change" | "card_click" | "scroll_milestone" | "search_query" | "abandonment"
  timestamp: number
  sessionId: string
  data: {
    filterType?: string
    filterValue?: any
    sortOption?: string
    cardPosition?: number
    creatorId?: string
    scrollDepth?: number
    searchQuery?: string
    resultCount?: number
    abandonmentPoint?: string
    timeOnPage?: number
    metadata?: Record<string, any>
  }
}

export interface ConversionFunnelStep {
  id: string
  name: string
  description: string
  order: number
  isRequired: boolean
  targetTime?: number // seconds
}

interface BrowseAnalyticsProps {
  isEnabled?: boolean
  showDashboard?: boolean
  onMetricsUpdate?: (metrics: BrowseMetrics) => void
  className?: string
}

// Predefined funnel steps for browse page
const CONVERSION_FUNNEL: ConversionFunnelStep[] = [
  {
    id: "page_load",
    name: "Page Load",
    description: "User lands on browse page",
    order: 1,
    isRequired: true
  },
  {
    id: "first_interaction",
    name: "First Interaction",
    description: "User filters, searches, or scrolls",
    order: 2,
    isRequired: true,
    targetTime: 15
  },
  {
    id: "results_engagement",
    name: "Results Engagement",
    description: "User views results or applies filters",
    order: 3,
    isRequired: true,
    targetTime: 30
  },
  {
    id: "creator_view",
    name: "Creator Profile View",
    description: "User clicks on creator card",
    order: 4,
    isRequired: true,
    targetTime: 60
  },
  {
    id: "booking_initiation",
    name: "Booking Initiation",
    description: "User starts booking process",
    order: 5,
    isRequired: false,
    targetTime: 120
  },
  {
    id: "booking_completion",
    name: "Booking Completion",
    description: "User completes purchase",
    order: 6,
    isRequired: false,
    targetTime: 300
  }
]

export function BrowseAnalytics({
  isEnabled = true,
  showDashboard = false,
  onMetricsUpdate,
  className
}: BrowseAnalyticsProps) {
  const [interactions, setInteractions] = React.useState<BrowseInteractionEvent[]>([])
  const [currentSession, setCurrentSession] = React.useState<string>(() => 
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  )
  const [sessionStartTime] = React.useState(Date.now())
  const [scrollMilestones, setScrollMilestones] = React.useState<Set<number>>(new Set())
  const [firstInteractionTime, setFirstInteractionTime] = React.useState<number | null>(null)
  const [isExpanded, setIsExpanded] = React.useState(showDashboard)
  
  // Calculate metrics based on interactions
  const calculateMetrics = React.useCallback((): BrowseMetrics => {
    const totalInteractions = interactions.length
    const uniqueFiltersUsed = new Set(
      interactions
        .filter(i => i.type === "filter_apply")
        .map(i => i.data.filterType)
    ).size
    
    const filterInteractions = interactions.filter(i => i.type === "filter_apply")
    const filterUsagePercentage = totalInteractions > 0 ? (filterInteractions.length / totalInteractions) * 100 : 0
    
    // Calculate time to first click
    const clickInteractions = interactions.filter(i => i.type === "card_click")
    const avgTimeToClick = clickInteractions.length > 0 
      ? clickInteractions.reduce((sum, interaction) => {
          return sum + (interaction.timestamp - sessionStartTime)
        }, 0) / clickInteractions.length / 1000
      : 0
    
    // Calculate scroll depth
    const maxScrollDepth = Math.max(...Array.from(scrollMilestones), 0)
    
    // Calculate conversion rate (simplified)
    const bookingInitiations = interactions.filter(i => 
      i.data.metadata?.action === "booking_initiation"
    ).length
    const conversionRate = totalInteractions > 0 ? (bookingInitiations / totalInteractions) * 100 : 0
    
    // Identify abandonment points
    const abandonmentPoints = [
      {
        location: "Filter Application",
        percentage: filterInteractions.length > 5 ? 20 : 45,
        reason: "Complex filter interface",
        impact: "high" as const,
        suggestions: ["Simplify filter UI", "Add filter presets", "Improve mobile UX"]
      },
      {
        location: "Search Results",
        percentage: 35,
        reason: "Poor result relevance",
        impact: "medium" as const,
        suggestions: ["Improve search algorithm", "Add sorting options", "Better result cards"]
      },
      {
        location: "Creator Cards",
        percentage: 25,
        reason: "Insufficient information",
        impact: "medium" as const,
        suggestions: ["Add video previews", "Show more details", "Improve card design"]
      }
    ]
    
    const metrics: BrowseMetrics = {
      filterUsage: {
        percentage: filterUsagePercentage,
        target: 60,
        status: filterUsagePercentage >= 60 ? "success" : filterUsagePercentage >= 40 ? "warning" : "error",
        mostUsedFilters: [
          { name: "Category", usage: 45 },
          { name: "Price Range", usage: 32 },
          { name: "Rating", usage: 28 },
          { name: "Response Time", usage: 22 },
          { name: "Language", usage: 18 }
        ],
        filterToResultsRatio: 0.8
      },
      
      avgTimeToClick: {
        seconds: avgTimeToClick,
        target: 30,
        status: avgTimeToClick <= 30 ? "success" : avgTimeToClick <= 45 ? "warning" : "error",
        breakdown: {
          firstTimeUsers: avgTimeToClick * 1.3,
          returningUsers: avgTimeToClick * 0.7,
          mobileUsers: avgTimeToClick * 1.2,
          desktopUsers: avgTimeToClick * 0.9
        }
      },
      
      scrollDepth: {
        percentage: maxScrollDepth,
        target: 50,
        status: maxScrollDepth >= 50 ? "success" : maxScrollDepth >= 30 ? "warning" : "error",
        heatmap: [
          { depth: 25, users: 100 },
          { depth: 50, users: 75 },
          { depth: 75, users: 45 },
          { depth: 100, users: 20 }
        ]
      },
      
      conversionRate: {
        percentage: conversionRate,
        target: 5,
        status: conversionRate >= 5 ? "success" : conversionRate >= 3 ? "warning" : "error",
        funnel: [
          { step: "Page Load", users: 1000, conversionRate: 100, dropOff: 0 },
          { step: "First Interaction", users: 850, conversionRate: 85, dropOff: 15 },
          { step: "Filter/Search", users: 680, conversionRate: 68, dropOff: 17 },
          { step: "Creator View", users: 340, conversionRate: 34, dropOff: 34 },
          { step: "Booking", users: 85, conversionRate: 8.5, dropOff: 25.5 },
          { step: "Purchase", users: 50, conversionRate: 5, dropOff: 3.5 }
        ]
      },
      
      abandonmentPoints
    }
    
    return metrics
  }, [interactions, sessionStartTime, scrollMilestones])
  
  const metrics = calculateMetrics()
  
  // Update parent component
  React.useEffect(() => {
    onMetricsUpdate?.(metrics)
  }, [metrics, onMetricsUpdate])
  
  // Track interaction
  const trackInteraction = React.useCallback((
    type: BrowseInteractionEvent["type"],
    data: BrowseInteractionEvent["data"] = {}
  ) => {
    if (!isEnabled) return
    
    const interaction: BrowseInteractionEvent = {
      type,
      timestamp: Date.now(),
      sessionId: currentSession,
      data: {
        ...data,
        timeOnPage: Date.now() - sessionStartTime
      }
    }
    
    setInteractions(prev => [...prev, interaction])
    
    // Track first interaction time
    if (!firstInteractionTime && type !== "scroll_milestone") {
      setFirstInteractionTime(Date.now())
    }
    
    // Log for development
    console.log("Browse Analytics:", interaction)
  }, [isEnabled, currentSession, sessionStartTime, firstInteractionTime])
  
  // Track scroll depth milestones
  React.useEffect(() => {
    if (!isEnabled) return
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      
      // Track milestones at 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100]
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !scrollMilestones.has(milestone)) {
          setScrollMilestones(prev => new Set([...prev, milestone]))
          trackInteraction("scroll_milestone", {
            scrollDepth: milestone,
            timeToMilestone: Date.now() - sessionStartTime
          })
        }
      })
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isEnabled, scrollMilestones, trackInteraction, sessionStartTime])
  
  // Track page abandonment
  React.useEffect(() => {
    if (!isEnabled) return
    
    const handleBeforeUnload = () => {
      trackInteraction("abandonment", {
        abandonmentPoint: "page_exit",
        timeOnPage: Date.now() - sessionStartTime,
        interactionCount: interactions.length
      })
    }
    
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isEnabled, trackInteraction, sessionStartTime, interactions.length])
  
  // Export analytics data
  const exportAnalytics = () => {
    const data = {
      sessionId: currentSession,
      sessionDuration: Date.now() - sessionStartTime,
      interactions,
      metrics,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `browse-analytics-${currentSession}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("Analytics data exported")
  }
  
  // Clear analytics data
  const clearAnalytics = () => {
    setInteractions([])
    setScrollMilestones(new Set())
    setFirstInteractionTime(null)
    setCurrentSession(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    toast.success("Analytics data cleared")
  }
  
  if (!isExpanded) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
      </div>
    )
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn(
          "fixed bottom-4 right-4 w-96 max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border z-50",
          className
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Browse Analytics
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={exportAnalytics}>
                <Download className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Analytics Data</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear all current session analytics data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAnalytics}>
                      Clear Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
              >
                ×
              </Button>
            </div>
          </div>
        </div>
        
        {/* Metrics Dashboard */}
        <div className="p-4 space-y-4">
          {/* Session Overview */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Session Time</span>
                <span className="font-mono">
                  {Math.floor((Date.now() - sessionStartTime) / 60000)}m {Math.floor(((Date.now() - sessionStartTime) % 60000) / 1000)}s
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-600">Interactions</span>
                <span className="font-mono">{interactions.length}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Key Metrics */}
          <div className="space-y-3">
            <MetricCard
              title="Filter Usage"
              value={`${metrics.filterUsage.percentage.toFixed(1)}%`}
              target={`Target: ${metrics.filterUsage.target}%`}
              status={metrics.filterUsage.status}
              icon={<Filter className="h-4 w-4" />}
              details={`${metrics.filterUsage.mostUsedFilters.length} filter types used`}
              onTrack={() => trackInteraction("filter_apply", { filterType: "analytics_demo" })}
            />
            
            <MetricCard
              title="Avg Time to Click"
              value={`${metrics.avgTimeToClick.seconds.toFixed(1)}s`}
              target={`Target: <${metrics.avgTimeToClick.target}s`}
              status={metrics.avgTimeToClick.status}
              icon={<Clock className="h-4 w-4" />}
              details={`First interaction: ${firstInteractionTime ? ((firstInteractionTime - sessionStartTime) / 1000).toFixed(1) : 'N/A'}s`}
              onTrack={() => trackInteraction("card_click", { creatorId: "demo", cardPosition: 1 })}
            />
            
            <MetricCard
              title="Scroll Depth"
              value={`${metrics.scrollDepth.percentage}%`}
              target={`Target: >${metrics.scrollDepth.target}%`}
              status={metrics.scrollDepth.status}
              icon={<ArrowDown className="h-4 w-4" />}
              details={`${scrollMilestones.size} milestones reached`}
            />
            
            <MetricCard
              title="Conversion Rate"
              value={`${metrics.conversionRate.percentage.toFixed(1)}%`}
              target={`Target: >${metrics.conversionRate.target}%`}
              status={metrics.conversionRate.status}
              icon={<Target className="h-4 w-4" />}
              details="Browse to booking rate"
              onTrack={() => trackInteraction("card_click", { 
                metadata: { action: "booking_initiation" }
              })}
            />
          </div>
          
          {/* Conversion Funnel */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {metrics.conversionRate.funnel.slice(0, 4).map((step, index) => (
                <div key={step.step} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{step.step}</span>
                    <span className="font-medium">{step.conversionRate}%</span>
                  </div>
                  <div className="relative">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${step.conversionRate}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    </div>
                    {step.dropOff > 0 && (
                      <span className="absolute right-0 top-2 text-xs text-red-600">
                        -{step.dropOff}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Abandonment Points */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Top Abandonment Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {metrics.abandonmentPoints.slice(0, 3).map((point) => (
                <div key={point.location} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium">{point.location}</p>
                    <p className="text-xs text-gray-500">{point.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      point.impact === "high" ? "destructive" :
                      point.impact === "medium" ? "secondary" : "outline"
                    } className="text-xs">
                      {point.percentage}%
                    </Badge>
                    {point.impact === "high" && (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Most Used Filters */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Filter Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {metrics.filterUsage.mostUsedFilters.map((filter) => (
                <div key={filter.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{filter.name}</span>
                    <span className="font-medium">{filter.usage}%</span>
                  </div>
                  <Progress value={filter.usage} className="h-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Metric Card Component
function MetricCard({
  title,
  value,
  target,
  status,
  icon,
  details,
  onTrack
}: {
  title: string
  value: string
  target: string
  status: "success" | "warning" | "error"
  icon: React.ReactNode
  details?: string
  onTrack?: () => void
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
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <div>
              <p className="text-xs font-medium">{title}</p>
              <p className="text-xs text-gray-500">{target}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{value}</span>
              <StatusIcon className={cn(
                "h-4 w-4",
                status === "success" ? "text-green-500" :
                status === "warning" ? "text-yellow-500" : "text-red-500"
              )} />
            </div>
            {details && (
              <p className="text-xs text-gray-500">{details}</p>
            )}
          </div>
        </div>
        {onTrack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onTrack}
            className="w-full mt-2 text-xs"
          >
            Track Test Event
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Hook for tracking browse interactions
export function useBrowseAnalytics() {
  const [tracker, setTracker] = React.useState<any>(null)
  
  const trackFilter = React.useCallback((filterType: string, filterValue: any) => {
    tracker?.trackInteraction("filter_apply", { filterType, filterValue })
  }, [tracker])
  
  const trackSort = React.useCallback((sortOption: string) => {
    tracker?.trackInteraction("sort_change", { sortOption })
  }, [tracker])
  
  const trackCreatorClick = React.useCallback((creatorId: string, position: number) => {
    tracker?.trackInteraction("card_click", { creatorId, cardPosition: position })
  }, [tracker])
  
  const trackSearch = React.useCallback((query: string, resultCount: number) => {
    tracker?.trackInteraction("search_query", { searchQuery: query, resultCount })
  }, [tracker])
  
  return {
    trackFilter,
    trackSort,
    trackCreatorClick,
    trackSearch,
    setTracker
  }
}