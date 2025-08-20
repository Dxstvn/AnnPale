"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Clock,
  Zap,
  Calendar as CalendarIcon,
  Package,
  Rocket,
  AlertTriangle,
  Users,
  Star,
  TrendingUp,
  Timer,
  Eye,
  CheckCircle,
  Shield,
  Award,
  Target,
  ThumbsUp,
  Heart,
  Gift,
  Sparkles,
  ArrowUp,
  DollarSign,
  BarChart3,
  Gauge,
  Flame,
  AlertCircle,
  Info,
  TrendingDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { format, addDays, differenceInHours, differenceInMinutes } from "date-fns"

// Enhanced delivery psychology data
const deliveryPsychologyData = {
  urgencyTactics: {
    scarcityMessages: [
      {
        tier: "rush",
        messages: [
          "Only 2 rush slots available today",
          "Rush delivery closing in 3 hours",
          "Limited rush spots - secure yours now"
        ],
        availability: 2,
        timeLeft: 180 // minutes
      },
      {
        tier: "express",
        messages: [
          "Express delivery 60% full today",
          "Popular choice - limited availability",
          "Express queue filling fast"
        ],
        availability: 8,
        timeLeft: null
      }
    ],
    timeBasedUrgency: {
      rush: {
        cutoffTime: 16, // 4 PM
        message: "Order by 4 PM for same-day rush processing"
      },
      express: {
        cutoffTime: 20, // 8 PM
        message: "Order by 8 PM for express processing"
      }
    }
  },
  socialProof: {
    statistics: [
      { metric: "99.8%", label: "On-time delivery rate", icon: Clock },
      { metric: "4.9★", label: "Average delivery rating", icon: Star },
      { metric: "50K+", label: "Videos delivered", icon: Package },
      { metric: "60%", label: "Choose express or faster", icon: TrendingUp }
    ],
    testimonials: [
      {
        text: "Perfect for last-minute gifts!",
        author: "Sarah M.",
        rating: 5,
        deliveryTier: "rush"
      },
      {
        text: "Express was exactly on time as promised.",
        author: "Mike D.",
        rating: 5,
        deliveryTier: "express"
      },
      {
        text: "Great quality and quick delivery.",
        author: "Lisa K.",
        rating: 5,
        deliveryTier: "express"
      }
    ],
    recentActivity: [
      "Emma just ordered Rush delivery",
      "3 people viewing Express option",
      "James chose Express delivery (2 min ago)",
      "Rush delivery selected 5 times today"
    ]
  },
  valueFraming: {
    perDayCost: true,
    peaceOfMind: [
      "Guaranteed delivery date",
      "Real-time tracking updates", 
      "Priority customer support",
      "100% satisfaction guarantee"
    ],
    occasionImportance: {
      birthday: "Make their special day unforgettable",
      anniversary: "Perfect timing for your milestone",
      graduation: "Celebrate their achievement on time",
      emergency: "Be there when it matters most"
    }
  }
}

// Urgency countdown timer
export function UrgencyCountdownTimer({
  targetTime,
  message,
  variant = "default",
  showIcon = true
}: {
  targetTime: Date
  message: string
  variant?: "default" | "warning" | "danger"
  showIcon?: boolean
}) {
  const [timeLeft, setTimeLeft] = React.useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = React.useState(false)
  
  React.useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const diff = targetTime.getTime() - now.getTime()
      
      if (diff <= 0) {
        setIsExpired(true)
        return
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeLeft({ hours, minutes, seconds })
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [targetTime])
  
  if (isExpired) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Time expired for this delivery option
        </AlertDescription>
      </Alert>
    )
  }
  
  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20"
      case "danger":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20"
      default:
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20"
    }
  }
  
  const getIcon = () => {
    switch (variant) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "danger":
        return <Flame className="h-4 w-4 text-red-600 animate-pulse" />
      default:
        return <Timer className="h-4 w-4 text-blue-600" />
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "p-3 rounded-lg border flex items-center gap-3",
        getVariantStyles()
      )}
    >
      {showIcon && getIcon()}
      <div className="flex-1">
        <p className="font-medium text-sm">{message}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1 text-lg font-bold">
            {timeLeft.hours > 0 && (
              <>
                <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-sm">h</span>
              </>
            )}
            <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-sm">m</span>
            <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="text-sm">s</span>
          </div>
          <span className="text-xs opacity-75">remaining</span>
        </div>
      </div>
    </motion.div>
  )
}

// Social proof statistics
export function SocialProofStats({
  statistics = deliveryPsychologyData.socialProof.statistics,
  className
}: {
  statistics?: typeof deliveryPsychologyData.socialProof.statistics
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {statistics.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center">
              <CardContent className="pt-4 pb-3">
                <Icon className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {stat.metric}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

// Live activity feed
export function LiveActivityFeed({
  activities = deliveryPsychologyData.socialProof.recentActivity,
  autoScroll = true,
  className
}: {
  activities?: string[]
  autoScroll?: boolean
  className?: string
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  React.useEffect(() => {
    if (!autoScroll) return
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activities.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [activities.length, autoScroll])
  
  return (
    <Card className={cn("border-green-200 bg-green-50/50 dark:bg-green-900/20", className)}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700 dark:text-green-300">
            Live Activity
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-green-600 dark:text-green-400"
          >
            {activities[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// Value calculator
export function ValueCalculator({
  basePrice,
  deliveryPrice,
  timeline,
  occasion,
  className
}: {
  basePrice: number
  deliveryPrice: number
  timeline: string
  occasion?: string
  className?: string
}) {
  const totalPrice = basePrice + deliveryPrice
  const days = timeline.includes("24 hours") ? 1 : 
               timeline.includes("2-3") ? 2.5 :
               timeline.includes("5-7") ? 6 : 7
  
  const perDayCost = deliveryPrice / days
  const occasionMessage = occasion && deliveryPsychologyData.valueFraming.occasionImportance[occasion as keyof typeof deliveryPsychologyData.valueFraming.occasionImportance]
  
  return (
    <Card className={cn("border-blue-200 bg-blue-50/50 dark:bg-blue-900/20", className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Value Analysis</span>
            <Badge variant="outline" className="bg-white">
              <BarChart3 className="h-3 w-3 mr-1" />
              Smart Pricing
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Per-day cost difference:</span>
              <span className="font-medium">${perDayCost.toFixed(2)}/day</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Total investment:</span>
              <span className="font-bold text-lg">${totalPrice}</span>
            </div>
            
            {deliveryPrice > 0 && (
              <div className="pt-2 border-t">
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-300">
                      Worth the upgrade?
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Only ${perDayCost.toFixed(2)} per day faster delivery
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {occasionMessage && (
              <div className="pt-2 border-t">
                <div className="flex items-start gap-2">
                  <Heart className="h-4 w-4 text-purple-600 mt-0.5" />
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    {occasionMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Scarcity indicators
export function ScarcityIndicator({
  tier,
  slotsRemaining,
  totalSlots = 10,
  timeLeft,
  variant = "default"
}: {
  tier: string
  slotsRemaining: number
  totalSlots?: number
  timeLeft?: number // minutes
  variant?: "default" | "urgent" | "critical"
}) {
  const percentage = (slotsRemaining / totalSlots) * 100
  
  const getVariantStyles = () => {
    if (percentage <= 20 || variant === "critical") {
      return {
        container: "bg-red-50 border-red-200 dark:bg-red-900/20",
        text: "text-red-700 dark:text-red-300",
        progress: "bg-red-500",
        icon: <Flame className="h-4 w-4 text-red-600 animate-pulse" />
      }
    } else if (percentage <= 50 || variant === "urgent") {
      return {
        container: "bg-orange-50 border-orange-200 dark:bg-orange-900/20",
        text: "text-orange-700 dark:text-orange-300",
        progress: "bg-orange-500",
        icon: <AlertTriangle className="h-4 w-4 text-orange-600" />
      }
    }
    
    return {
      container: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20",
      text: "text-yellow-700 dark:text-yellow-300",
      progress: "bg-yellow-500",
      icon: <Clock className="h-4 w-4 text-yellow-600" />
    }
  }
  
  const styles = getVariantStyles()
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "p-3 rounded-lg border",
        styles.container
      )}
    >
      <div className="flex items-start gap-3">
        {styles.icon}
        <div className="flex-1">
          <p className={cn("font-medium text-sm", styles.text)}>
            {slotsRemaining <= 2 ? "Almost sold out!" : "Limited availability"}
          </p>
          <p className="text-xs opacity-75 mb-2">
            Only {slotsRemaining} of {totalSlots} {tier} slots remaining
          </p>
          
          <div className="space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn("h-2 rounded-full", styles.progress)}
              />
            </div>
            
            {timeLeft && (
              <div className="flex items-center gap-1 text-xs">
                <Timer className="h-3 w-3" />
                <span>Availability resets in {Math.floor(timeLeft / 60)}h {timeLeft % 60}m</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Testimonial carousel
export function DeliveryTestimonials({
  testimonials = deliveryPsychologyData.socialProof.testimonials,
  autoScroll = true,
  className
}: {
  testimonials?: typeof deliveryPsychologyData.socialProof.testimonials
  autoScroll?: boolean
  className?: string
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  React.useEffect(() => {
    if (!autoScroll) return
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [testimonials.length, autoScroll])
  
  const currentTestimonial = testimonials[currentIndex]
  
  return (
    <Card className={cn("border-purple-200 bg-purple-50/50 dark:bg-purple-900/20", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <ThumbsUp className="h-4 w-4 text-purple-600" />
          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
            Customer Reviews
          </span>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <blockquote className="text-sm italic mb-2">
              "{currentTestimonial.text}"
            </blockquote>
            <div className="flex items-center justify-between">
              <cite className="text-xs text-gray-600 dark:text-gray-400">
                - {currentTestimonial.author}
              </cite>
              <div className="flex items-center gap-1">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
                <Badge variant="outline" className="ml-2 text-xs">
                  {currentTestimonial.deliveryTier}
                </Badge>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center gap-1 mt-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentIndex ? "bg-purple-600" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Peace of mind guarantees
export function PeaceOfMindGuarantees({
  guarantees = deliveryPsychologyData.valueFraming.peaceOfMind,
  className
}: {
  guarantees?: string[]
  className?: string
}) {
  return (
    <Card className={cn("border-green-200 bg-green-50/50 dark:bg-green-900/20", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Peace of Mind Guarantee
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-green-700 dark:text-green-300">
                {guarantee}
              </span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Psychology-optimized delivery tier card
export function PsychologyOptimizedDeliveryCard({
  tier,
  basePrice,
  isSelected,
  onSelect,
  occasion,
  showUrgency = true,
  showSocialProof = true,
  showValueFraming = true
}: {
  tier: {
    id: string
    name: string
    timeline: string
    price: number
    pricePercent?: number
    icon: React.ElementType
    badge?: string
    features: string[]
    availability: string
    popularityPercent: number
    scarcityMessage?: string
    slotsRemaining?: number
  }
  basePrice: number
  isSelected: boolean
  onSelect: () => void
  occasion?: string
  showUrgency?: boolean
  showSocialProof?: boolean
  showValueFraming?: boolean
}) {
  const Icon = tier.icon
  const additionalPrice = tier.pricePercent 
    ? Math.round(basePrice * (tier.pricePercent / 100))
    : tier.price || 0
  
  const isUrgent = tier.id === "rush" && tier.slotsRemaining && tier.slotsRemaining <= 3
  const isPopular = tier.popularityPercent >= 50
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Card
        className={cn(
          "relative cursor-pointer transition-all",
          isSelected 
            ? "ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-900/20"
            : "hover:shadow-lg",
          isUrgent && "border-orange-300 shadow-orange-100",
          isPopular && !isSelected && "border-blue-300 shadow-blue-100"
        )}
        onClick={onSelect}
      >
        {/* Badges */}
        <div className="absolute -top-2 -right-2 flex gap-2">
          {tier.badge && (
            <Badge 
              className={cn(
                tier.badge === "Fastest" ? "bg-orange-500" : 
                tier.badge === "Popular" ? "bg-blue-500" : "bg-purple-600"
              )}
            >
              {tier.badge}
            </Badge>
          )}
          {isUrgent && (
            <Badge className="bg-red-500 animate-pulse">
              <Flame className="h-3 w-3 mr-1" />
              Hot
            </Badge>
          )}
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                tier.id === "rush" ? "bg-orange-100 text-orange-700" :
                tier.id === "express" ? "bg-blue-100 text-blue-700" :
                tier.id === "scheduled" ? "bg-purple-100 text-purple-700" :
                "bg-gray-100 text-gray-700"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">{tier.name}</CardTitle>
                <p className="text-sm text-gray-500">{tier.timeline}</p>
                
                {showSocialProof && isPopular && (
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-600">
                      {tier.popularityPercent}% choose this
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              {additionalPrice > 0 ? (
                <div>
                  <p className="font-bold text-lg">+${additionalPrice}</p>
                  {showValueFraming && (
                    <p className="text-xs text-gray-500">
                      ~${(additionalPrice / (tier.timeline.includes("24 hours") ? 1 : 2.5)).toFixed(2)}/day
                    </p>
                  )}
                </div>
              ) : (
                <Badge variant="secondary">Included</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          {/* Features */}
          <ul className="space-y-1.5 text-sm">
            {tier.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          
          {/* Urgency indicators */}
          {showUrgency && tier.scarcityMessage && (
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <p className="text-xs text-yellow-700 dark:text-yellow-300 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {tier.scarcityMessage}
              </p>
            </div>
          )}
          
          {/* Scarcity for rush */}
          {showUrgency && tier.id === "rush" && tier.slotsRemaining && tier.slotsRemaining <= 5 && (
            <ScarcityIndicator
              tier={tier.name}
              slotsRemaining={tier.slotsRemaining}
              totalSlots={10}
              variant={tier.slotsRemaining <= 2 ? "critical" : "urgent"}
            />
          )}
          
          {/* Popularity bar */}
          {showSocialProof && tier.popularityPercent && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Popularity</span>
                <span className="font-medium">{tier.popularityPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${tier.popularityPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-purple-600 h-2 rounded-full"
                />
              </div>
            </div>
          )}
          
          {/* Selected state */}
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-3 border-t"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Selected - Ready to proceed
                </span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}