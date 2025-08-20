"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Activity,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Info,
  RefreshCw,
  BarChart3,
  Eye,
  Gauge
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Web Vitals Types
interface WebVitalsMetric {
  name: "LCP" | "FID" | "CLS" | "FCP" | "TTFB" | "INP"
  value: number
  rating: "good" | "needs-improvement" | "poor"
  delta?: number
  id: string
  navigationType: string
}

interface PerformanceMetrics {
  lcp?: WebVitalsMetric  // Largest Contentful Paint
  fid?: WebVitalsMetric  // First Input Delay
  cls?: WebVitalsMetric  // Cumulative Layout Shift
  fcp?: WebVitalsMetric  // First Contentful Paint
  ttfb?: WebVitalsMetric // Time to First Byte
  inp?: WebVitalsMetric  // Interaction to Next Paint
  renderTime?: number
  componentCount?: number
  memoryUsage?: number
  domNodes?: number
  jsHeapSize?: number
  resourceTiming?: {
    images: number
    scripts: number
    stylesheets: number
    total: number
  }
}

interface PerformanceMonitorProps {
  showDetails?: boolean
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  autoHide?: boolean
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
  className?: string
}

// Thresholds based on Web Vitals standards
const thresholds = {
  LCP: { good: 2500, poor: 4000 }, // milliseconds
  FID: { good: 100, poor: 300 },   // milliseconds
  CLS: { good: 0.1, poor: 0.25 },  // score
  FCP: { good: 1800, poor: 3000 }, // milliseconds
  TTFB: { good: 800, poor: 1800 }, // milliseconds
  INP: { good: 200, poor: 500 },   // milliseconds
}

// Get rating based on metric value
const getRating = (name: string, value: number): "good" | "needs-improvement" | "poor" => {
  const threshold = thresholds[name as keyof typeof thresholds]
  if (!threshold) return "good"
  
  if (value <= threshold.good) return "good"
  if (value <= threshold.poor) return "needs-improvement"
  return "poor"
}

// Format metric value for display
const formatMetricValue = (name: string, value: number): string => {
  if (name === "CLS") {
    return value.toFixed(3)
  }
  if (value < 1000) {
    return `${Math.round(value)}ms`
  }
  return `${(value / 1000).toFixed(2)}s`
}

export function PerformanceMonitor({
  showDetails = false,
  position = "bottom-right",
  autoHide = true,
  onMetricsUpdate,
  className
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({})
  const [isVisible, setIsVisible] = React.useState(!autoHide)
  const [isExpanded, setIsExpanded] = React.useState(showDetails)
  const [isMonitoring, setIsMonitoring] = React.useState(true)
  
  // Monitor Web Vitals
  React.useEffect(() => {
    if (!isMonitoring) return
    
    const observeWebVitals = async () => {
      try {
        // Dynamically import web-vitals
        const { onLCP, onFID, onCLS, onFCP, onTTFB, onINP } = await import("web-vitals")
        
        onLCP((metric) => {
          const rating = getRating("LCP", metric.value)
          setMetrics(prev => ({ 
            ...prev, 
            lcp: { ...metric, rating } as WebVitalsMetric 
          }))
        })
        
        onFID((metric) => {
          const rating = getRating("FID", metric.value)
          setMetrics(prev => ({ 
            ...prev, 
            fid: { ...metric, rating } as WebVitalsMetric 
          }))
        })
        
        onCLS((metric) => {
          const rating = getRating("CLS", metric.value)
          setMetrics(prev => ({ 
            ...prev, 
            cls: { ...metric, rating } as WebVitalsMetric 
          }))
        })
        
        onFCP((metric) => {
          const rating = getRating("FCP", metric.value)
          setMetrics(prev => ({ 
            ...prev, 
            fcp: { ...metric, rating } as WebVitalsMetric 
          }))
        })
        
        onTTFB((metric) => {
          const rating = getRating("TTFB", metric.value)
          setMetrics(prev => ({ 
            ...prev, 
            ttfb: { ...metric, rating } as WebVitalsMetric 
          }))
        })
        
        onINP((metric) => {
          const rating = getRating("INP", metric.value)
          setMetrics(prev => ({ 
            ...prev, 
            inp: { ...metric, rating } as WebVitalsMetric 
          }))
        })
      } catch (error) {
        console.error("Failed to load web-vitals:", error)
      }
    }
    
    observeWebVitals()
  }, [isMonitoring])
  
  // Monitor render performance
  React.useEffect(() => {
    if (!isMonitoring) return
    
    const measureRenderPerformance = () => {
      const startTime = performance.now()
      
      requestAnimationFrame(() => {
        const renderTime = performance.now() - startTime
        const componentCount = document.querySelectorAll("[data-component]").length
        const domNodes = document.getElementsByTagName("*").length
        
        // Memory usage (if available)
        const memoryInfo = (performance as any).memory
        const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1048576 : undefined
        const jsHeapSize = memoryInfo ? memoryInfo.jsHeapSizeLimit / 1048576 : undefined
        
        // Resource timing
        const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
        const resourceTiming = {
          images: resources.filter(r => r.initiatorType === "img").length,
          scripts: resources.filter(r => r.initiatorType === "script").length,
          stylesheets: resources.filter(r => r.initiatorType === "css" || r.initiatorType === "link").length,
          total: resources.length
        }
        
        setMetrics(prev => ({
          ...prev,
          renderTime,
          componentCount,
          domNodes,
          memoryUsage,
          jsHeapSize,
          resourceTiming
        }))
      })
    }
    
    // Initial measurement
    measureRenderPerformance()
    
    // Periodic measurements
    const interval = setInterval(measureRenderPerformance, 5000)
    
    return () => clearInterval(interval)
  }, [isMonitoring])
  
  // Update parent component
  React.useEffect(() => {
    onMetricsUpdate?.(metrics)
  }, [metrics, onMetricsUpdate])
  
  // Calculate overall score
  const calculateScore = (): number => {
    let score = 100
    const weights = {
      lcp: 25,
      fid: 25,
      cls: 25,
      fcp: 15,
      ttfb: 10
    }
    
    Object.entries(weights).forEach(([key, weight]) => {
      const metric = metrics[key as keyof PerformanceMetrics] as WebVitalsMetric
      if (metric) {
        if (metric.rating === "needs-improvement") score -= weight * 0.5
        if (metric.rating === "poor") score -= weight
      }
    })
    
    return Math.max(0, Math.round(score))
  }
  
  const score = calculateScore()
  const scoreRating = score >= 90 ? "good" : score >= 50 ? "needs-improvement" : "poor"
  
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4"
  }
  
  const ratingColors = {
    good: "text-green-600 bg-green-100 dark:bg-green-900/30",
    "needs-improvement": "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
    poor: "text-red-600 bg-red-100 dark:bg-red-900/30"
  }
  
  const ratingIcons = {
    good: CheckCircle,
    "needs-improvement": AlertCircle,
    poor: AlertCircle
  }
  
  if (!isVisible && autoHide) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsVisible(true)}
        className={cn(
          "fixed z-50",
          positionClasses[position],
          className
        )}
      >
        <Gauge className="h-4 w-4" />
      </Button>
    )
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            "fixed z-50",
            positionClasses[position],
            className
          )}
        >
          <Card className={cn(
            "shadow-xl border",
            isExpanded ? "w-96" : "w-64"
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Performance Monitor
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMonitoring(!isMonitoring)}
                    className="h-6 w-6"
                  >
                    {isMonitoring ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3 opacity-50" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-6 w-6"
                  >
                    <BarChart3 className="h-3 w-3" />
                  </Button>
                  {autoHide && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsVisible(false)}
                      className="h-6 w-6"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Overall Score */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">Performance Score</span>
                  <Badge className={cn("text-xs", ratingColors[scoreRating])}>
                    {score}/100
                  </Badge>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Core Web Vitals */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Core Web Vitals
                </h4>
                
                {/* LCP */}
                {metrics.lcp && (
                  <MetricRow
                    name="LCP"
                    label="Largest Contentful Paint"
                    value={formatMetricValue("LCP", metrics.lcp.value)}
                    rating={metrics.lcp.rating}
                    tooltip="Time until the largest content element is rendered"
                  />
                )}
                
                {/* FID/INP */}
                {(metrics.fid || metrics.inp) && (
                  <MetricRow
                    name={metrics.inp ? "INP" : "FID"}
                    label={metrics.inp ? "Interaction to Next Paint" : "First Input Delay"}
                    value={formatMetricValue(
                      metrics.inp ? "INP" : "FID",
                      metrics.inp?.value || metrics.fid?.value || 0
                    )}
                    rating={metrics.inp?.rating || metrics.fid?.rating || "good"}
                    tooltip={metrics.inp 
                      ? "Time from user interaction to next visual update"
                      : "Time from first interaction to browser response"
                    }
                  />
                )}
                
                {/* CLS */}
                {metrics.cls && (
                  <MetricRow
                    name="CLS"
                    label="Cumulative Layout Shift"
                    value={formatMetricValue("CLS", metrics.cls.value)}
                    rating={metrics.cls.rating}
                    tooltip="Visual stability - amount of unexpected layout shift"
                  />
                )}
              </div>
              
              {/* Expanded Metrics */}
              {isExpanded && (
                <>
                  {/* Other Metrics */}
                  <div className="space-y-2 pt-2 border-t">
                    <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Additional Metrics
                    </h4>
                    
                    {metrics.fcp && (
                      <MetricRow
                        name="FCP"
                        label="First Contentful Paint"
                        value={formatMetricValue("FCP", metrics.fcp.value)}
                        rating={metrics.fcp.rating}
                        tooltip="Time until first content is painted"
                      />
                    )}
                    
                    {metrics.ttfb && (
                      <MetricRow
                        name="TTFB"
                        label="Time to First Byte"
                        value={formatMetricValue("TTFB", metrics.ttfb.value)}
                        rating={metrics.ttfb.rating}
                        tooltip="Server response time"
                      />
                    )}
                    
                    {metrics.renderTime && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Render Time</span>
                        <span className="font-mono">{metrics.renderTime.toFixed(2)}ms</span>
                      </div>
                    )}
                    
                    {metrics.domNodes && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">DOM Nodes</span>
                        <span className="font-mono">{metrics.domNodes}</span>
                      </div>
                    )}
                    
                    {metrics.memoryUsage && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Memory Usage</span>
                        <span className="font-mono">{metrics.memoryUsage.toFixed(1)}MB</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Resource Timing */}
                  {metrics.resourceTiming && (
                    <div className="space-y-2 pt-2 border-t">
                      <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Resources Loaded
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Images</span>
                          <span className="font-mono">{metrics.resourceTiming.images}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Scripts</span>
                          <span className="font-mono">{metrics.resourceTiming.scripts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Styles</span>
                          <span className="font-mono">{metrics.resourceTiming.stylesheets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total</span>
                          <span className="font-mono">{metrics.resourceTiming.total}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.reload()
                  }}
                  className="flex-1 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const report = generatePerformanceReport(metrics)
                    navigator.clipboard.writeText(report)
                    toast.success("Performance report copied to clipboard")
                  }}
                  className="flex-1 text-xs"
                >
                  Copy Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Metric Row Component
function MetricRow({
  name,
  label,
  value,
  rating,
  tooltip
}: {
  name: string
  label: string
  value: string
  rating: "good" | "needs-improvement" | "poor"
  tooltip: string
}) {
  const Icon = rating === "good" ? CheckCircle : AlertCircle
  const colors = {
    good: "text-green-600",
    "needs-improvement": "text-yellow-600",
    poor: "text-red-600"
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-between text-xs hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded transition cursor-help">
            <div className="flex items-center gap-2">
              <Icon className={cn("h-3 w-3", colors[rating])} />
              <span className="text-gray-600 dark:text-gray-400">{name}</span>
            </div>
            <span className={cn("font-mono font-medium", colors[rating])}>
              {value}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Generate performance report
function generatePerformanceReport(metrics: PerformanceMetrics): string {
  const timestamp = new Date().toISOString()
  let report = `Performance Report - ${timestamp}\n\n`
  
  report += "Core Web Vitals:\n"
  if (metrics.lcp) report += `  LCP: ${formatMetricValue("LCP", metrics.lcp.value)} (${metrics.lcp.rating})\n`
  if (metrics.fid) report += `  FID: ${formatMetricValue("FID", metrics.fid.value)} (${metrics.fid.rating})\n`
  if (metrics.inp) report += `  INP: ${formatMetricValue("INP", metrics.inp.value)} (${metrics.inp.rating})\n`
  if (metrics.cls) report += `  CLS: ${formatMetricValue("CLS", metrics.cls.value)} (${metrics.cls.rating})\n`
  
  report += "\nAdditional Metrics:\n"
  if (metrics.fcp) report += `  FCP: ${formatMetricValue("FCP", metrics.fcp.value)} (${metrics.fcp.rating})\n`
  if (metrics.ttfb) report += `  TTFB: ${formatMetricValue("TTFB", metrics.ttfb.value)} (${metrics.ttfb.rating})\n`
  if (metrics.renderTime) report += `  Render Time: ${metrics.renderTime.toFixed(2)}ms\n`
  if (metrics.domNodes) report += `  DOM Nodes: ${metrics.domNodes}\n`
  if (metrics.memoryUsage) report += `  Memory Usage: ${metrics.memoryUsage.toFixed(1)}MB\n`
  
  if (metrics.resourceTiming) {
    report += "\nResources:\n"
    report += `  Images: ${metrics.resourceTiming.images}\n`
    report += `  Scripts: ${metrics.resourceTiming.scripts}\n`
    report += `  Stylesheets: ${metrics.resourceTiming.stylesheets}\n`
    report += `  Total: ${metrics.resourceTiming.total}\n`
  }
  
  return report
}