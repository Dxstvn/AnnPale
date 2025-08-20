"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Users,
  Clock,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Calendar,
  Video,
  Repeat,
  Activity,
  BarChart3,
  Award,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface SocialProofMetrics {
  totalBookings: number
  responseTime: number // in hours
  responseRate: number // percentage
  completionRate: number // percentage
  repeatCustomers: number // percentage
  memberSince: Date
  avgRating: number
  totalReviews: number
  videosDelivered: number
  lastActive?: Date
}

interface MetricDisplayProps {
  metrics: SocialProofMetrics
  variant?: "compact" | "detailed" | "stats-bar"
  showLabels?: boolean
  animated?: boolean
  className?: string
}

// Individual metric component
interface MetricItemProps {
  icon: React.ElementType
  value: string | number
  label: string
  description?: string
  trend?: "up" | "down" | "stable"
  color?: string
  animated?: boolean
}

function MetricItem({
  icon: Icon,
  value,
  label,
  description,
  trend,
  color = "text-gray-600 dark:text-gray-400",
  animated = true
}: MetricItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={animated ? { opacity: 0, y: 10 } : {}}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 cursor-help"
          >
            <Icon className={cn("h-4 w-4", color)} />
            <div className="flex items-center gap-1">
              <span className="font-semibold">{value}</span>
              {trend && (
                <TrendingUp className={cn(
                  "h-3 w-3",
                  trend === "up" && "text-green-500",
                  trend === "down" && "text-red-500 rotate-180",
                  trend === "stable" && "text-gray-400 rotate-90"
                )} />
              )}
            </div>
            <span className="text-sm text-gray-500">{label}</span>
          </motion.div>
        </TooltipTrigger>
        {description && (
          <TooltipContent>
            <p className="text-xs">{description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

// Format metrics for display
function formatMetric(value: number, type: string): string {
  switch (type) {
    case "bookings":
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K+`
      if (value >= 100) return `${value}+`
      if (value >= 10) return `${value}+`
      return value.toString()
    
    case "time":
      if (value < 1) return `${Math.round(value * 60)} min`
      if (value < 24) return `${value} ${value === 1 ? "hour" : "hours"}`
      const days = Math.round(value / 24)
      return `${days} ${days === 1 ? "day" : "days"}`
    
    case "percentage":
      return `${value}%`
    
    case "date":
      const date = new Date(value)
      const years = new Date().getFullYear() - date.getFullYear()
      if (years > 0) return `${years}+ ${years === 1 ? "year" : "years"}`
      const months = new Date().getMonth() - date.getMonth()
      if (months > 0) return `${months} ${months === 1 ? "month" : "months"}`
      return "New member"
    
    default:
      return value.toString()
  }
}

// Compact metrics display (for cards)
function CompactMetrics({ 
  metrics, 
  animated = true 
}: { 
  metrics: SocialProofMetrics
  animated?: boolean 
}) {
  const topMetrics = [
    {
      icon: Video,
      value: formatMetric(metrics.totalBookings, "bookings"),
      label: "videos",
      color: "text-purple-500"
    },
    {
      icon: Clock,
      value: formatMetric(metrics.responseTime, "time"),
      label: "response",
      color: "text-blue-500"
    },
    {
      icon: CheckCircle,
      value: formatMetric(metrics.completionRate, "percentage"),
      label: "completion",
      color: "text-green-500"
    }
  ]

  return (
    <div className="flex items-center gap-4">
      {topMetrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={animated ? { opacity: 0, x: -10 } : {}}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MetricItem {...metric} animated={false} />
        </motion.div>
      ))}
    </div>
  )
}

// Detailed metrics display (for profiles)
function DetailedMetrics({ 
  metrics,
  animated = true
}: { 
  metrics: SocialProofMetrics
  animated?: boolean
}) {
  const detailedMetrics = [
    {
      category: "Performance",
      items: [
        {
          icon: Video,
          value: formatMetric(metrics.videosDelivered, "bookings"),
          label: "videos delivered",
          description: "Total personalized videos created",
          trend: "up" as const,
          color: "text-purple-500"
        },
        {
          icon: CheckCircle,
          value: formatMetric(metrics.completionRate, "percentage"),
          label: "completion rate",
          description: "Percentage of orders fulfilled",
          trend: metrics.completionRate > 95 ? "up" as const : "stable" as const,
          color: "text-green-500"
        },
        {
          icon: MessageSquare,
          value: formatMetric(metrics.responseRate, "percentage"),
          label: "response rate",
          description: "Percentage of messages answered",
          trend: metrics.responseRate > 90 ? "up" as const : "down" as const,
          color: "text-blue-500"
        }
      ]
    },
    {
      category: "Engagement",
      items: [
        {
          icon: Clock,
          value: formatMetric(metrics.responseTime, "time"),
          label: "avg response time",
          description: "How quickly they typically respond",
          color: "text-orange-500"
        },
        {
          icon: Repeat,
          value: formatMetric(metrics.repeatCustomers, "percentage"),
          label: "repeat customers",
          description: "Customers who book again",
          trend: metrics.repeatCustomers > 30 ? "up" as const : "stable" as const,
          color: "text-pink-500"
        },
        {
          icon: Calendar,
          value: formatMetric(metrics.memberSince.getTime(), "date"),
          label: "on platform",
          description: `Member since ${metrics.memberSince.toLocaleDateString()}`,
          color: "text-gray-500"
        }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {detailedMetrics.map((category, categoryIndex) => (
        <div key={category.category} className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {category.category}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {category.items.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={animated ? { opacity: 0, y: 10 } : {}}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (categoryIndex * 3 + index) * 0.1 }}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <MetricItem {...metric} animated={false} />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Stats bar for inline display
function StatsBar({ 
  metrics,
  animated = true
}: { 
  metrics: SocialProofMetrics
  animated?: boolean
}) {
  return (
    <motion.div
      initial={animated ? { opacity: 0 } : {}}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto"
    >
      <Badge variant="secondary" className="whitespace-nowrap">
        <Video className="h-3 w-3 mr-1" />
        {formatMetric(metrics.totalBookings, "bookings")} delivered
      </Badge>
      
      <Badge variant="secondary" className="whitespace-nowrap">
        <Clock className="h-3 w-3 mr-1" />
        Responds in {formatMetric(metrics.responseTime, "time")}
      </Badge>
      
      {metrics.responseRate > 90 && (
        <Badge variant="secondary" className="whitespace-nowrap">
          <MessageSquare className="h-3 w-3 mr-1" />
          {formatMetric(metrics.responseRate, "percentage")} response
        </Badge>
      )}
      
      {metrics.completionRate >= 99 && (
        <Badge variant="secondary" className="whitespace-nowrap">
          <CheckCircle className="h-3 w-3 mr-1" />
          {formatMetric(metrics.completionRate, "percentage")} completion
        </Badge>
      )}
      
      {metrics.repeatCustomers > 30 && (
        <Badge variant="secondary" className="whitespace-nowrap">
          <Repeat className="h-3 w-3 mr-1" />
          {formatMetric(metrics.repeatCustomers, "percentage")} repeat
        </Badge>
      )}
    </motion.div>
  )
}

// Main component
export function SocialProofMetrics({
  metrics,
  variant = "compact",
  animated = true,
  className
}: MetricDisplayProps) {
  switch (variant) {
    case "detailed":
      return (
        <div className={className}>
          <DetailedMetrics metrics={metrics} animated={animated} />
        </div>
      )
    
    case "stats-bar":
      return (
        <div className={className}>
          <StatsBar metrics={metrics} animated={animated} />
        </div>
      )
    
    case "compact":
    default:
      return (
        <div className={className}>
          <CompactMetrics metrics={metrics} animated={animated} />
        </div>
      )
  }
}

// Highlight card for exceptional metrics
export function MetricHighlight({
  metrics,
  className
}: {
  metrics: SocialProofMetrics
  className?: string
}) {
  const highlights = []

  if (metrics.totalBookings >= 500) {
    highlights.push({
      icon: Award,
      label: "500+ Videos",
      description: "Experienced creator",
      color: "from-purple-500 to-pink-500"
    })
  }

  if (metrics.responseTime <= 2) {
    highlights.push({
      icon: Zap,
      label: "Fast Response",
      description: `Responds in ${formatMetric(metrics.responseTime, "time")}`,
      color: "from-blue-500 to-cyan-500"
    })
  }

  if (metrics.completionRate >= 99) {
    highlights.push({
      icon: CheckCircle,
      label: "Reliable",
      description: "99%+ completion rate",
      color: "from-green-500 to-emerald-500"
    })
  }

  if (highlights.length === 0) return null

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-3", className)}>
      {highlights.map((highlight, index) => {
        const Icon = highlight.icon
        return (
          <motion.div
            key={highlight.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className={cn(
                "h-1 bg-gradient-to-r",
                highlight.color
              )} />
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg bg-gradient-to-br",
                    highlight.color,
                    "bg-opacity-10"
                  )}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{highlight.label}</p>
                    <p className="text-xs text-gray-500">{highlight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}