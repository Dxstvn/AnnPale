"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  CheckCircle,
  Award,
  Lock,
  CreditCard,
  Star,
  Users,
  TrendingUp,
  Clock,
  Calendar,
  Zap,
  AlertCircle,
  Info,
  Gift,
  Heart,
  MessageSquare,
  Bell,
  Share2,
  Download,
  Phone,
  Mail,
  ChevronRight,
  Timer,
  Percent,
  Globe,
  Verified
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Urgency indicator types
export interface UrgencyData {
  type: "time_limited" | "stock_limited" | "high_demand" | "price_increase" | "exclusive"
  message: string
  severity: "low" | "medium" | "high" | "critical"
  deadline?: Date
  remaining?: number
  total?: number
}

// Trust badge types
export interface TrustBadge {
  id: string
  type: "verification" | "security" | "guarantee" | "certification" | "rating" | "social"
  icon: React.ElementType
  label: string
  description?: string
  verified: boolean
  link?: string
}

// Micro-conversion types
export interface MicroConversion {
  id: string
  type: "view" | "engage" | "save" | "share" | "contact" | "preview" | "waitlist"
  label: string
  action: () => void
  completed?: boolean
  value?: number // Conversion value/weight
}

// Fallback action types
export interface FallbackAction {
  id: string
  type: "save" | "remind" | "waitlist" | "preview" | "chat" | "email" | "call"
  label: string
  description: string
  icon: React.ElementType
  action: () => void
  highlighted?: boolean
}

// Urgency indicators component
export function UrgencyIndicators({
  urgency,
  className,
  variant = "default"
}: {
  urgency: UrgencyData[]
  className?: string
  variant?: "default" | "compact" | "banner"
}) {
  const [timeRemaining, setTimeRemaining] = React.useState<{ [key: string]: string }>({})
  
  // Update countdown timers
  React.useEffect(() => {
    const timers = urgency
      .filter(u => u.deadline)
      .map(u => {
        const updateTimer = () => {
          const now = Date.now()
          const deadline = u.deadline!.getTime()
          const diff = deadline - now
          
          if (diff <= 0) {
            setTimeRemaining(prev => ({ ...prev, [u.message]: "Expired" }))
            return null
          }
          
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          
          setTimeRemaining(prev => ({
            ...prev,
            [u.message]: `${hours}h ${minutes}m ${seconds}s`
          }))
        }
        
        updateTimer()
        return setInterval(updateTimer, 1000)
      })
      .filter(Boolean) as NodeJS.Timeout[]
    
    return () => timers.forEach(clearInterval)
  }, [urgency])
  
  const severityConfig = {
    low: {
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200",
      icon: Info
    },
    medium: {
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200",
      icon: AlertCircle
    },
    high: {
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200",
      icon: Clock
    },
    critical: {
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200",
      icon: Zap
    }
  }
  
  if (variant === "banner") {
    const mostUrgent = urgency.reduce((prev, current) => {
      const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 }
      return severityOrder[current.severity] > severityOrder[prev.severity] ? current : prev
    })
    
    const config = severityConfig[mostUrgent.severity]
    const Icon = config.icon
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "p-3 rounded-lg border flex items-center justify-between",
          config.bgColor,
          config.borderColor,
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Icon className={cn("h-5 w-5", config.color)} />
          <span className={cn("font-medium", config.color)}>
            {mostUrgent.message}
          </span>
        </div>
        {mostUrgent.deadline && timeRemaining[mostUrgent.message] && (
          <Badge className={cn("font-mono", config.color, config.bgColor)}>
            <Timer className="h-3 w-3 mr-1" />
            {timeRemaining[mostUrgent.message]}
          </Badge>
        )}
        {mostUrgent.remaining !== undefined && (
          <Badge className={cn(config.color, config.bgColor)}>
            Only {mostUrgent.remaining} left
          </Badge>
        )}
      </motion.div>
    )
  }
  
  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        {urgency.map((item, index) => {
          const config = severityConfig[item.severity]
          const Icon = config.icon
          
          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 text-sm",
                config.color
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.message}</span>
              {item.deadline && timeRemaining[item.message] && (
                <span className="font-mono text-xs">
                  ({timeRemaining[item.message]})
                </span>
              )}
            </div>
          )
        })}
      </div>
    )
  }
  
  // Default variant
  return (
    <div className={cn("space-y-3", className)}>
      {urgency.map((item, index) => {
        const config = severityConfig[item.severity]
        const Icon = config.icon
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-3 rounded-lg border",
              config.bgColor,
              config.borderColor
            )}
          >
            <div className="flex items-start gap-3">
              <Icon className={cn("h-5 w-5 mt-0.5", config.color)} />
              <div className="flex-1">
                <p className={cn("font-medium", config.color)}>
                  {item.message}
                </p>
                {item.deadline && timeRemaining[item.message] && (
                  <div className="flex items-center gap-2 mt-2">
                    <Timer className="h-4 w-4" />
                    <span className="font-mono text-sm">
                      {timeRemaining[item.message]}
                    </span>
                  </div>
                )}
                {item.remaining !== undefined && item.total && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{item.remaining} of {item.total} remaining</span>
                      <span>{Math.round((item.remaining / item.total) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(item.remaining / item.total) * 100}
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// Trust badges component
export function TrustBadges({
  badges,
  className,
  variant = "grid"
}: {
  badges: TrustBadge[]
  className?: string
  variant?: "grid" | "list" | "compact"
}) {
  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {badges.map((badge) => (
          <Badge
            key={badge.id}
            variant={badge.verified ? "default" : "secondary"}
            className="text-xs"
          >
            <badge.icon className="h-3 w-3 mr-1" />
            {badge.label}
            {badge.verified && <CheckCircle className="h-3 w-3 ml-1" />}
          </Badge>
        ))}
      </div>
    )
  }
  
  if (variant === "list") {
    return (
      <div className={cn("space-y-2", className)}>
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              badge.verified 
                ? "bg-green-100 dark:bg-green-900/30" 
                : "bg-gray-100 dark:bg-gray-700"
            )}>
              <badge.icon className={cn(
                "h-5 w-5",
                badge.verified ? "text-green-600" : "text-gray-600"
              )} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{badge.label}</span>
                {badge.verified && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              {badge.description && (
                <p className="text-xs text-gray-500">{badge.description}</p>
              )}
            </div>
            {badge.link && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>
    )
  }
  
  // Grid variant (default)
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-3", className)}>
      {badges.map((badge) => (
        <motion.div
          key={badge.id}
          whileHover={{ scale: 1.05 }}
          className={cn(
            "p-3 rounded-lg border text-center cursor-pointer",
            badge.verified
              ? "border-green-200 bg-green-50 dark:bg-green-900/20"
              : "border-gray-200 bg-gray-50 dark:bg-gray-800"
          )}
        >
          <badge.icon className={cn(
            "h-6 w-6 mx-auto mb-2",
            badge.verified ? "text-green-600" : "text-gray-600"
          )} />
          <p className="text-xs font-medium">{badge.label}</p>
          {badge.verified && (
            <CheckCircle className="h-3 w-3 text-green-600 mx-auto mt-1" />
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Micro-conversion tracker
export function MicroConversionTracker({
  conversions,
  onConversion,
  className
}: {
  conversions: MicroConversion[]
  onConversion?: (id: string, type: string) => void
  className?: string
}) {
  const [completedSteps, setCompletedSteps] = React.useState<Set<string>>(
    new Set(conversions.filter(c => c.completed).map(c => c.id))
  )
  
  const handleConversion = (conversion: MicroConversion) => {
    conversion.action()
    setCompletedSteps(prev => new Set(prev).add(conversion.id))
    onConversion?.(conversion.id, conversion.type)
    
    // Track conversion
    console.log(`Micro-conversion: ${conversion.type} - ${conversion.label}`)
    
    // Show progress
    const totalValue = conversions.reduce((sum, c) => sum + (c.value || 1), 0)
    const completedValue = conversions
      .filter(c => completedSteps.has(c.id) || c.id === conversion.id)
      .reduce((sum, c) => sum + (c.value || 1), 0)
    const progress = Math.round((completedValue / totalValue) * 100)
    
    if (progress === 100) {
      toast.success("🎉 You're ready to book!")
    } else if (progress >= 75) {
      toast.info(`Almost there! ${100 - progress}% to go`)
    }
  }
  
  const totalSteps = conversions.length
  const completedCount = completedSteps.size
  const progressPercent = (completedCount / totalSteps) * 100
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Your Journey</span>
          <Badge variant="secondary">
            {completedCount}/{totalSteps} completed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={progressPercent} className="h-2" />
        
        <div className="space-y-2">
          {conversions.map((conversion) => {
            const isCompleted = completedSteps.has(conversion.id)
            
            return (
              <button
                key={conversion.id}
                onClick={() => !isCompleted && handleConversion(conversion)}
                disabled={isCompleted}
                className={cn(
                  "w-full text-left p-2 rounded-lg transition-all",
                  isCompleted
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200"
                    : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                    isCompleted
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  )}>
                    {isCompleted && (
                      <CheckCircle className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className={cn(
                    "text-sm",
                    isCompleted ? "text-green-700 dark:text-green-300 line-through" : ""
                  )}>
                    {conversion.label}
                  </span>
                  {conversion.value && conversion.value > 1 && (
                    <Badge variant="secondary" className="text-xs ml-auto">
                      +{conversion.value} pts
                    </Badge>
                  )}
                </div>
              </button>
            )
          })}
        </div>
        
        {progressPercent === 100 && (
          <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg text-center">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
              🎉 You're all set! Ready to book your video?
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Fallback actions component
export function FallbackActions({
  actions,
  title = "Not ready to book?",
  className
}: {
  actions: FallbackAction[]
  title?: string
  className?: string
}) {
  const handleAction = (action: FallbackAction) => {
    action.action()
    toast.success(`${action.label} activated!`)
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(action)}
              className={cn(
                "p-3 rounded-lg border text-left transition-all",
                action.highlighted
                  ? "border-purple-200 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100"
                  : "border-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                  action.highlighted
                    ? "bg-purple-100 dark:bg-purple-800"
                    : "bg-gray-100 dark:bg-gray-800"
                )}>
                  <action.icon className={cn(
                    "h-4 w-4",
                    action.highlighted ? "text-purple-600" : "text-gray-600"
                  )} />
                </div>
                <div>
                  <p className="font-medium text-sm">{action.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {action.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Combined conversion optimization dashboard
export function ConversionOptimizationDashboard({
  urgency,
  badges,
  conversions,
  fallbackActions,
  className
}: {
  urgency?: UrgencyData[]
  badges?: TrustBadge[]
  conversions?: MicroConversion[]
  fallbackActions?: FallbackAction[]
  className?: string
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {urgency && urgency.length > 0 && (
        <UrgencyIndicators urgency={urgency} variant="banner" />
      )}
      
      {badges && badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Trust & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrustBadges badges={badges} variant="grid" />
          </CardContent>
        </Card>
      )}
      
      {conversions && conversions.length > 0 && (
        <MicroConversionTracker conversions={conversions} />
      )}
      
      {fallbackActions && fallbackActions.length > 0 && (
        <FallbackActions actions={fallbackActions} />
      )}
    </div>
  )
}

// Export default trust badges
export const defaultTrustBadges: TrustBadge[] = [
  {
    id: "verified",
    type: "verification",
    icon: Verified,
    label: "Verified Creator",
    description: "Identity verified",
    verified: true
  },
  {
    id: "secure",
    type: "security",
    icon: Lock,
    label: "Secure Payment",
    description: "SSL encrypted",
    verified: true
  },
  {
    id: "guarantee",
    type: "guarantee",
    icon: Shield,
    label: "Satisfaction Guarantee",
    description: "100% money back",
    verified: true
  },
  {
    id: "rating",
    type: "rating",
    icon: Star,
    label: "5-Star Rated",
    description: "500+ reviews",
    verified: true
  },
  {
    id: "support",
    type: "social",
    icon: Users,
    label: "24/7 Support",
    description: "Always here to help",
    verified: true
  },
  {
    id: "global",
    type: "certification",
    icon: Globe,
    label: "Global Delivery",
    description: "Worldwide service",
    verified: true
  }
]