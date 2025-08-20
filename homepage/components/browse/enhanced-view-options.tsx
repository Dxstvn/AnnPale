"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Grid3X3,
  List,
  LayoutGrid,
  Map,
  Eye,
  Settings,
  Info,
  Zap,
  Gauge,
  Image as ImageIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export type ViewType = "grid" | "list" | "compact" | "map"

export interface ViewConfig {
  type: ViewType
  label: string
  icon: React.ElementType
  density: "low" | "medium" | "high" | "very-high"
  itemsPerPage: number
  description: string
  performance: {
    lazyLoad: boolean
    virtualScroll: boolean
    imageOptimization: "full" | "thumbnail" | "minimal"
    preload: number
  }
  bestFor: string
}

const viewConfigurations: ViewConfig[] = [
  {
    type: "grid",
    label: "Grid View",
    icon: Grid3X3,
    density: "medium",
    itemsPerPage: 12,
    description: "Visual browsing with images",
    performance: {
      lazyLoad: true,
      virtualScroll: false,
      imageOptimization: "full",
      preload: 4
    },
    bestFor: "Visual browsing"
  },
  {
    type: "list",
    label: "List View",
    icon: List,
    density: "high",
    itemsPerPage: 20,
    description: "Detailed information layout",
    performance: {
      lazyLoad: true,
      virtualScroll: true,
      imageOptimization: "thumbnail",
      preload: 6
    },
    bestFor: "Quick scanning"
  },
  {
    type: "compact",
    label: "Compact View",
    icon: LayoutGrid,
    density: "very-high",
    itemsPerPage: 30,
    description: "Maximum information density",
    performance: {
      lazyLoad: true,
      virtualScroll: true,
      imageOptimization: "minimal",
      preload: 10
    },
    bestFor: "Power users"
  },
  {
    type: "map",
    label: "Map View",
    icon: Map,
    density: "low",
    itemsPerPage: 50,
    description: "Location-based browsing",
    performance: {
      lazyLoad: false,
      virtualScroll: false,
      imageOptimization: "thumbnail",
      preload: 0
    },
    bestFor: "Location search"
  }
]

interface EnhancedViewOptionsProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  itemsPerPage?: number
  onItemsPerPageChange?: (count: number) => void
  performanceMode?: "auto" | "quality" | "performance"
  onPerformanceModeChange?: (mode: "auto" | "quality" | "performance") => void
  enableVirtualScroll?: boolean
  enableMapView?: boolean
  className?: string
}

export function EnhancedViewOptions({
  currentView,
  onViewChange,
  itemsPerPage = 12,
  onItemsPerPageChange,
  performanceMode = "auto",
  onPerformanceModeChange,
  enableVirtualScroll = true,
  enableMapView = false,
  className
}: EnhancedViewOptionsProps) {
  const [showPerformanceInfo, setShowPerformanceInfo] = React.useState(false)
  
  const availableViews = viewConfigurations.filter(view => 
    view.type !== "map" || enableMapView
  )
  
  const currentConfig = viewConfigurations.find(v => v.type === currentView)

  // Performance metrics
  const getPerformanceMetrics = () => {
    const metrics = {
      estimatedLoadTime: 0,
      memoryUsage: "low",
      scrollPerformance: "smooth"
    }

    switch (currentView) {
      case "grid":
        metrics.estimatedLoadTime = itemsPerPage * 50 // ms
        metrics.memoryUsage = "medium"
        metrics.scrollPerformance = "smooth"
        break
      case "list":
        metrics.estimatedLoadTime = itemsPerPage * 30
        metrics.memoryUsage = enableVirtualScroll ? "low" : "medium"
        metrics.scrollPerformance = enableVirtualScroll ? "smooth" : "normal"
        break
      case "compact":
        metrics.estimatedLoadTime = itemsPerPage * 20
        metrics.memoryUsage = enableVirtualScroll ? "low" : "high"
        metrics.scrollPerformance = enableVirtualScroll ? "smooth" : "heavy"
        break
      case "map":
        metrics.estimatedLoadTime = 500
        metrics.memoryUsage = "high"
        metrics.scrollPerformance = "smooth"
        break
    }

    if (performanceMode === "performance") {
      metrics.estimatedLoadTime *= 0.7
    } else if (performanceMode === "quality") {
      metrics.estimatedLoadTime *= 1.3
    }

    return metrics
  }

  const metrics = getPerformanceMetrics()

  const itemsPerPageOptions = [6, 12, 24, 48, 96]

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-4", className)}>
        {/* View Mode Selector */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {availableViews.map((view) => {
            const Icon = view.icon
            const isActive = currentView === view.type
            
            return (
              <Tooltip key={view.type}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onViewChange(view.type)}
                    className={cn(
                      "p-2 rounded transition-all",
                      isActive
                        ? "bg-white dark:bg-gray-900 shadow-sm"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                    aria-label={view.label}
                  >
                    <Icon className={cn(
                      "h-4 w-4",
                      isActive && "text-purple-600 dark:text-purple-400"
                    )} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-medium">{view.label}</p>
                    <p className="text-xs text-gray-500">{view.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className="h-5">
                        {view.itemsPerPage} items
                      </Badge>
                      <Badge variant="outline" className="h-5">
                        {view.density} density
                      </Badge>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {/* Items per page selector */}
        {onItemsPerPageChange && currentView !== "map" && (
          <Select 
            value={itemsPerPage.toString()} 
            onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <Eye className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Performance Mode Selector */}
        {onPerformanceModeChange && (
          <Select value={performanceMode} onValueChange={onPerformanceModeChange}>
            <SelectTrigger className="w-[140px]">
              <Gauge className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <div>
                    <p>Auto</p>
                    <p className="text-xs text-gray-500">Balanced</p>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="quality">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <div>
                    <p>Quality</p>
                    <p className="text-xs text-gray-500">Best images</p>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="performance">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <div>
                    <p>Performance</p>
                    <p className="text-xs text-gray-500">Fastest load</p>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Performance Info Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowPerformanceInfo(!showPerformanceInfo)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2">
              <p className="font-medium">Performance Metrics</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Load time:</span>
                  <span>~{Math.round(metrics.estimatedLoadTime)}ms</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Memory:</span>
                  <span>{metrics.memoryUsage}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Scroll:</span>
                  <span>{metrics.scrollPerformance}</span>
                </div>
              </div>
              {currentConfig && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    {currentConfig.performance.lazyLoad && "✓ Lazy loading"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentConfig.performance.virtualScroll && "✓ Virtual scroll"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Image: {currentConfig.performance.imageOptimization}
                  </p>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Settings Button */}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Performance Info Panel */}
      {showPerformanceInfo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">View Performance</h4>
            <button
              onClick={() => setShowPerformanceInfo(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Current View</p>
              <p className="font-medium">{currentConfig?.label}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Items Loaded</p>
              <p className="font-medium">{itemsPerPage}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Performance Mode</p>
              <p className="font-medium capitalize">{performanceMode}</p>
            </div>
          </div>
        </motion.div>
      )}
    </TooltipProvider>
  )
}

// Hook for view options with persistence
export function useViewOptions(
  defaultView: ViewType = "grid",
  options?: {
    persistKey?: string
    enableMapView?: boolean
    defaultItemsPerPage?: number
  }
) {
  const [currentView, setCurrentView] = React.useState<ViewType>(defaultView)
  const [itemsPerPage, setItemsPerPage] = React.useState(
    options?.defaultItemsPerPage || 12
  )
  const [performanceMode, setPerformanceMode] = React.useState<"auto" | "quality" | "performance">("auto")

  // Load preferences from localStorage
  React.useEffect(() => {
    if (options?.persistKey) {
      const saved = localStorage.getItem(`view-${options.persistKey}`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setCurrentView(parsed.view || defaultView)
          setItemsPerPage(parsed.itemsPerPage || 12)
          setPerformanceMode(parsed.performanceMode || "auto")
        } catch {}
      }
    }
  }, [options?.persistKey, defaultView])

  // Save preferences to localStorage
  React.useEffect(() => {
    if (options?.persistKey) {
      localStorage.setItem(
        `view-${options.persistKey}`,
        JSON.stringify({
          view: currentView,
          itemsPerPage,
          performanceMode
        })
      )
    }
  }, [currentView, itemsPerPage, performanceMode, options?.persistKey])

  // Get view configuration
  const viewConfig = viewConfigurations.find(v => v.type === currentView)

  return {
    currentView,
    setCurrentView,
    itemsPerPage,
    setItemsPerPage,
    performanceMode,
    setPerformanceMode,
    viewConfig
  }
}