"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Clock,
  Zap,
  Activity,
  CheckCircle,
  AlertCircle,
  Timer,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface ResponseTimeData {
  averageTime: number // in hours
  fastestTime: number // in hours
  responseRate: number // percentage
  lastActive?: Date
  isOnline?: boolean
  trend?: "improving" | "stable" | "declining"
}

interface ResponseIndicatorProps {
  data: ResponseTimeData
  variant?: "badge" | "detailed" | "minimal" | "live"
  showTrend?: boolean
  animated?: boolean
  className?: string
}

// Get response time category
function getResponseCategory(hours: number): {
  label: string
  color: string
  icon: React.ElementType
  description: string
} {
  if (hours < 1) {
    return {
      label: "Lightning Fast",
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
      icon: Zap,
      description: "Typically responds within minutes"
    }
  } else if (hours <= 2) {
    return {
      label: "Very Fast",
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
      icon: Zap,
      description: "Responds within 2 hours"
    }
  } else if (hours <= 6) {
    return {
      label: "Fast",
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
      icon: Clock,
      description: "Responds within 6 hours"
    }
  } else if (hours <= 24) {
    return {
      label: "Same Day",
      color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
      icon: Clock,
      description: "Responds within 24 hours"
    }
  } else {
    return {
      label: `${Math.ceil(hours / 24)} days`,
      color: "text-gray-600 bg-gray-100 dark:bg-gray-900/30",
      icon: Timer,
      description: `Responds within ${Math.ceil(hours / 24)} days`
    }
  }
}

// Format time for display
function formatResponseTime(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60)
    return `${minutes} min`
  } else if (hours < 24) {
    return `${Math.round(hours)} ${hours === 1 ? "hour" : "hours"}`
  } else {
    const days = Math.round(hours / 24)
    return `${days} ${days === 1 ? "day" : "days"}`
  }
}

// Badge variant
function ResponseBadge({ 
  data, 
  animated = true 
}: { 
  data: ResponseTimeData
  animated?: boolean 
}) {
  const category = getResponseCategory(data.averageTime)
  const Icon = category.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={animated ? { scale: 0 } : {}}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Badge 
              variant="secondary" 
              className={cn(
                "gap-1",
                category.color
              )}
            >
              <Icon className="h-3 w-3" />
              {formatResponseTime(data.averageTime)}
            </Badge>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{category.label}</p>
            <p className="text-xs text-gray-500">{category.description}</p>
            {data.responseRate && (
              <p className="text-xs text-gray-500">
                {data.responseRate}% response rate
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Detailed variant
function ResponseDetailed({ 
  data,
  showTrend = true,
  animated = true
}: { 
  data: ResponseTimeData
  showTrend?: boolean
  animated?: boolean
}) {
  const category = getResponseCategory(data.averageTime)
  const Icon = category.icon

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 10 } : {}}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Main indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            category.color
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">{category.label}</p>
            <p className="text-sm text-gray-500">
              Avg: {formatResponseTime(data.averageTime)}
            </p>
          </div>
        </div>
        
        {showTrend && data.trend && (
          <div className="flex items-center gap-1">
            {data.trend === "improving" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : data.trend === "declining" ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <Activity className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-xs text-gray-500 capitalize">{data.trend}</span>
          </div>
        )}
      </div>

      {/* Additional metrics */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500">Fastest</p>
          <p className="text-sm font-medium">
            {formatResponseTime(data.fastestTime)}
          </p>
        </div>
        
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500">Response Rate</p>
          <p className="text-sm font-medium">{data.responseRate}%</p>
        </div>
        
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500">Status</p>
          <p className="text-sm font-medium">
            {data.isOnline ? (
              <span className="text-green-600">Online</span>
            ) : data.lastActive ? (
              <span className="text-gray-500">
                {formatLastActive(data.lastActive)}
              </span>
            ) : (
              <span className="text-gray-400">Offline</span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Minimal variant
function ResponseMinimal({ 
  data 
}: { 
  data: ResponseTimeData 
}) {
  const category = getResponseCategory(data.averageTime)
  const Icon = category.icon

  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className={cn("h-4 w-4", category.color.split(" ")[0])} />
      <span className="text-gray-600 dark:text-gray-400">
        Responds in {formatResponseTime(data.averageTime)}
      </span>
    </div>
  )
}

// Live status variant
function ResponseLive({ 
  data,
  animated = true
}: { 
  data: ResponseTimeData
  animated?: boolean
}) {
  const isActive = data.isOnline || 
    (data.lastActive && (Date.now() - data.lastActive.getTime()) < 5 * 60 * 1000)

  return (
    <motion.div
      initial={animated ? { opacity: 0 } : {}}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
      <div className="relative">
        <div className={cn(
          "h-2 w-2 rounded-full",
          isActive ? "bg-green-500" : "bg-gray-400"
        )}>
          {isActive && animated && (
            <motion.div
              className="absolute inset-0 rounded-full bg-green-500"
              animate={{
                scale: [1, 2, 1],
                opacity: [1, 0, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
      </div>
      
      <span className="text-sm">
        {data.isOnline ? (
          <span className="text-green-600 font-medium">Online Now</span>
        ) : data.lastActive ? (
          <span className="text-gray-500">
            Active {formatLastActive(data.lastActive)}
          </span>
        ) : (
          <span className="text-gray-400">Offline</span>
        )}
      </span>
      
      {data.averageTime <= 2 && (
        <Badge variant="secondary" className="text-xs ml-2">
          <Zap className="h-3 w-3 mr-1" />
          Fast Response
        </Badge>
      )}
    </motion.div>
  )
}

// Format last active time
function formatLastActive(date: Date): string {
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

// Main component
export function ResponseIndicator({
  data,
  variant = "badge",
  showTrend = false,
  animated = true,
  className
}: ResponseIndicatorProps) {
  switch (variant) {
    case "detailed":
      return (
        <div className={className}>
          <ResponseDetailed data={data} showTrend={showTrend} animated={animated} />
        </div>
      )
    
    case "minimal":
      return (
        <div className={className}>
          <ResponseMinimal data={data} />
        </div>
      )
    
    case "live":
      return (
        <div className={className}>
          <ResponseLive data={data} animated={animated} />
        </div>
      )
    
    case "badge":
    default:
      return (
        <div className={className}>
          <ResponseBadge data={data} animated={animated} />
        </div>
      )
  }
}

// Response time comparison
export function ResponseComparison({
  current,
  average,
  className
}: {
  current: number
  average: number
  className?: string
}) {
  const difference = ((average - current) / average) * 100
  const isFaster = current < average

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium">
          {formatResponseTime(current)}
        </span>
      </div>
      
      {Math.abs(difference) > 10 && (
        <Badge 
          variant={isFaster ? "success" : "warning"} 
          className="text-xs"
        >
          {isFaster ? (
            <>
              <TrendingUp className="h-3 w-3 mr-1" />
              {Math.round(Math.abs(difference))}% faster
            </>
          ) : (
            <>
              <TrendingDown className="h-3 w-3 mr-1" />
              {Math.round(Math.abs(difference))}% slower
            </>
          )}
        </Badge>
      )}
    </div>
  )
}