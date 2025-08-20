"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Shield,
  Lock,
  CheckCircle,
  Star,
  Users,
  Clock,
  Award,
  TrendingUp,
  Heart,
  MessageSquare,
  DollarSign,
  CreditCard,
  RefreshCw,
  Info,
  Zap,
  Globe,
  ThumbsUp,
  ShieldCheck,
  UserCheck,
  Eye,
  Calendar,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"

// Security indicator component
export function SecurityIndicator({
  level = "high",
  showDetails = true,
  className
}: {
  level?: "high" | "medium" | "low"
  showDetails?: boolean
  className?: string
}) {
  const levels = {
    high: {
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      icon: ShieldCheck,
      text: "Bank-level Security"
    },
    medium: {
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      icon: Shield,
      text: "Secure Connection"
    },
    low: {
      color: "text-gray-600",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
      icon: Lock,
      text: "Protected"
    }
  }
  
  const config = levels[level]
  const Icon = config.icon
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("p-2 rounded-lg", config.bgColor)}>
        <Icon className={cn("h-5 w-5", config.color)} />
      </div>
      {showDetails && (
        <div>
          <p className="text-sm font-medium">{config.text}</p>
          <p className="text-xs text-gray-500">256-bit SSL encryption</p>
        </div>
      )}
    </div>
  )
}

// Social proof ticker
export function SocialProofTicker({
  activities,
  className
}: {
  activities: Array<{
    id: string
    user: string
    action: string
    time: Date
    location?: string
  }>
  className?: string
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [activities.length])
  
  const current = activities[currentIndex]
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg",
          className
        )}
      >
        <Users className="h-4 w-4 text-blue-600" />
        <p className="text-sm">
          <span className="font-medium">{current.user}</span>
          {current.location && (
            <span className="text-gray-500"> from {current.location}</span>
          )}
          <span className="text-gray-600"> {current.action}</span>
          <span className="text-gray-400 ml-1">
            {formatDistanceToNow(current.time, { addSuffix: true })}
          </span>
        </p>
      </motion.div>
    </AnimatePresence>
  )
}

// Trust badges grid
export function TrustBadgesGrid({
  badges,
  variant = "grid",
  className
}: {
  badges?: Array<{
    icon: React.ElementType
    title: string
    description?: string
    verified?: boolean
  }>
  variant?: "grid" | "list" | "compact"
  className?: string
}) {
  const defaultBadges = badges || [
    {
      icon: Shield,
      title: "100% Safe & Secure",
      description: "Your data is protected",
      verified: true
    },
    {
      icon: RefreshCw,
      title: "Money Back Guarantee",
      description: "Not satisfied? Get a refund",
      verified: true
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Videos within 3 days",
      verified: true
    },
    {
      icon: Users,
      title: "5000+ Happy Customers",
      description: "Join our community",
      verified: true
    }
  ]
  
  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap gap-3", className)}>
        {defaultBadges.map((badge, index) => {
          const Icon = badge.icon
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Icon className="h-4 w-4" />
                    <span>{badge.title}</span>
                    {badge.verified && (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    )
  }
  
  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        {defaultBadges.map((badge, index) => {
          const Icon = badge.icon
          return (
            <div key={index} className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{badge.title}</p>
                  {badge.verified && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
                {badge.description && (
                  <p className="text-xs text-gray-500">{badge.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  
  // Grid variant (default)
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {defaultBadges.map((badge, index) => {
        const Icon = badge.icon
        return (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">{badge.title}</p>
                  {badge.description && (
                    <p className="text-xs text-gray-500">{badge.description}</p>
                  )}
                </div>
              </div>
              {badge.verified && (
                <Badge className="mt-2 text-xs bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Payment method trust signals
export function PaymentMethodTrust({
  methods,
  className
}: {
  methods?: string[]
  className?: string
}) {
  const defaultMethods = methods || ["visa", "mastercard", "amex", "paypal", "apple_pay", "google_pay"]
  
  const methodIcons: { [key: string]: React.ElementType } = {
    visa: CreditCard,
    mastercard: CreditCard,
    amex: CreditCard,
    paypal: DollarSign,
    apple_pay: CreditCard,
    google_pay: CreditCard
  }
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium">Secure Payment Methods</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {defaultMethods.map((method) => {
          const Icon = methodIcons[method] || CreditCard
          return (
            <div
              key={method}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border"
            >
              <Icon className="h-5 w-5 text-gray-600" />
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-500">
        All transactions are encrypted and processed securely
      </p>
    </div>
  )
}

// Satisfaction guarantee card
export function SatisfactionGuarantee({
  percentage = 100,
  days = 30,
  className
}: {
  percentage?: number
  days?: number
  className?: string
}) {
  return (
    <Card className={cn("border-green-200 bg-green-50/50 dark:bg-green-900/20", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
          <Award className="h-5 w-5" />
          {percentage}% Satisfaction Guarantee
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          We're confident you'll love your video. If you're not completely satisfied,
          we'll work with you to make it right or offer a full refund within {days} days.
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>No questions asked</span>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3 text-green-600" />
            <span>Easy refund process</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Live viewer count
export function LiveViewerCount({
  count,
  trend = "up",
  className
}: {
  count: number
  trend?: "up" | "down" | "stable"
  className?: string
}) {
  const [displayCount, setDisplayCount] = React.useState(count)
  
  React.useEffect(() => {
    // Simulate live updates
    const timer = setInterval(() => {
      setDisplayCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        return Math.max(1, prev + change)
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [])
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Eye className="h-5 w-5 text-purple-600" />
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
      </div>
      <div>
        <p className="text-sm font-medium">
          {displayCount} people viewing now
        </p>
        <p className="text-xs text-gray-500">
          {trend === "up" && "Trending up"}
          {trend === "down" && "Limited availability"}
          {trend === "stable" && "Steady interest"}
        </p>
      </div>
    </div>
  )
}

// Urgency countdown timer
export function UrgencyCountdown({
  endTime,
  message = "Offer ends in",
  onExpire,
  className
}: {
  endTime: Date
  message?: string
  onExpire?: () => void
  className?: string
}) {
  const [timeLeft, setTimeLeft] = React.useState("")
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      const end = endTime.getTime()
      const diff = end - now
      
      if (diff <= 0) {
        setTimeLeft("Expired")
        onExpire?.()
        clearInterval(timer)
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      }
    }, 1000)
    
    return () => clearInterval(timer)
  }, [endTime, onExpire])
  
  return (
    <div className={cn(
      "flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg",
      className
    )}>
      <Clock className="h-5 w-5 text-orange-600 animate-pulse" />
      <div>
        <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
          {message}
        </p>
        <p className="text-lg font-bold font-mono text-orange-900 dark:text-orange-100">
          {timeLeft}
        </p>
      </div>
    </div>
  )
}

// Success stories carousel
export function SuccessStoriesCarousel({
  stories,
  className
}: {
  stories?: Array<{
    id: string
    author: string
    content: string
    rating: number
    date: Date
    verified?: boolean
  }>
  className?: string
}) {
  const defaultStories = stories || [
    {
      id: "1",
      author: "Sarah M.",
      content: "The video exceeded all expectations! My husband was so surprised.",
      rating: 5,
      date: new Date(Date.now() - 86400000),
      verified: true
    },
    {
      id: "2",
      author: "John D.",
      content: "Fast delivery and amazing quality. Worth every penny!",
      rating: 5,
      date: new Date(Date.now() - 172800000),
      verified: true
    },
    {
      id: "3",
      author: "Marie L.",
      content: "My daughter cried happy tears. Thank you so much!",
      rating: 5,
      date: new Date(Date.now() - 259200000),
      verified: true
    }
  ]
  
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultStories.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [defaultStories.length])
  
  const story = defaultStories[currentIndex]
  
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={story.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < story.rating
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                {story.verified && (
                  <Badge className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(story.date, { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
              "{story.content}"
            </p>
            <p className="text-sm font-medium mt-2">– {story.author}</p>
          </motion.div>
        </AnimatePresence>
        
        {/* Dots indicator */}
        <div className="flex justify-center gap-1 mt-3">
          {defaultStories.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-all",
                index === currentIndex
                  ? "w-4 bg-purple-600"
                  : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Order summary confidence builder
export function OrderSummaryConfidence({
  items,
  total,
  savings,
  className
}: {
  items: Array<{
    label: string
    value: string | number
    highlight?: boolean
  }>
  total: number
  savings?: number
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex justify-between text-sm",
              item.highlight && "font-medium"
            )}
          >
            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
        
        {savings && savings > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>You save</span>
            <span className="font-medium">-${savings}</span>
          </div>
        )}
        
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Total</span>
            <span className="text-xl font-bold">${total}</span>
          </div>
        </div>
        
        <div className="pt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Shield className="h-3 w-3" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <RefreshCw className="h-3 w-3" />
            <span>30-day money back guarantee</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}