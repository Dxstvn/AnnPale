"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Star,
  Users,
  ChevronUp,
  X,
  Sparkles,
  TrendingUp,
  Shield,
  Heart,
  MessageSquare,
  Gift,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { toast } from "sonner"

// Sticky CTA data types
export interface StickyCTAData {
  creatorName: string
  price: {
    amount: number
    currency: string
    originalPrice?: number
    discount?: number
  }
  availability: {
    status: "available" | "limited" | "busy" | "unavailable"
    nextSlot?: Date
    slotsRemaining?: number
  }
  stats: {
    rating: number
    reviews: number
    bookings: number
    responseTime: string
  }
  features: string[]
  urgencyMessage?: string
  trustBadges?: Array<{
    icon: React.ElementType
    label: string
  }>
}

interface StickyCTABarProps {
  data: StickyCTAData
  onBookNow: () => void
  onSaveForLater?: () => void
  onMessage?: () => void
  showThreshold?: number // Scroll percentage to show (default 50%)
  className?: string
  variant?: "full" | "compact" | "minimal"
}

// Price display with discount
function PriceDisplay({
  price,
  size = "default"
}: {
  price: StickyCTAData['price']
  size?: "default" | "sm" | "lg"
}) {
  const fontSize = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg"
  }[size]
  
  return (
    <div className="flex items-center gap-2">
      {price.originalPrice && price.originalPrice > price.amount && (
        <>
          <span className={cn("line-through text-gray-400", fontSize)}>
            {price.currency}{price.originalPrice}
          </span>
          <Badge className="bg-red-500 text-white text-xs">
            -{Math.round(((price.originalPrice - price.amount) / price.originalPrice) * 100)}%
          </Badge>
        </>
      )}
      <span className={cn("font-bold", fontSize)}>
        {price.currency}{price.amount}
      </span>
    </div>
  )
}

// Availability indicator
function AvailabilityIndicator({
  availability
}: {
  availability: StickyCTAData['availability']
}) {
  const statusConfig = {
    available: { color: "text-green-600", icon: "🟢", label: "Available Now" },
    limited: { color: "text-yellow-600", icon: "🟡", label: "Limited Spots" },
    busy: { color: "text-orange-600", icon: "🟠", label: "Busy - Book Early" },
    unavailable: { color: "text-red-600", icon: "🔴", label: "Unavailable" }
  }
  
  const config = statusConfig[availability.status]
  
  return (
    <div className="flex items-center gap-2">
      <span>{config.icon}</span>
      <span className={cn("text-sm font-medium", config.color)}>
        {config.label}
      </span>
      {availability.slotsRemaining && availability.slotsRemaining <= 3 && (
        <Badge className="bg-orange-500 text-white text-xs animate-pulse">
          Only {availability.slotsRemaining} left
        </Badge>
      )}
    </div>
  )
}

// Trust indicators
function TrustIndicators({
  stats,
  compact = false
}: {
  stats: StickyCTAData['stats']
  compact?: boolean
}) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
          <span className="font-medium">{stats.rating}</span>
        </div>
        <span className="text-gray-400">|</span>
        <span className="text-gray-600">{stats.bookings}+ bookings</span>
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 text-yellow-500 fill-current" />
        <span className="font-medium">{stats.rating}</span>
        <span className="text-sm text-gray-500">({stats.reviews})</span>
      </div>
      <div className="flex items-center gap-1">
        <Users className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{stats.bookings}+ bookings</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{stats.responseTime} response</span>
      </div>
    </div>
  )
}

// Minimal variant
function MinimalCTA({
  data,
  onBookNow
}: {
  data: StickyCTAData
  onBookNow: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-gray-900 border-t">
      <div className="flex items-center gap-3">
        <PriceDisplay price={data.price} size="sm" />
        <AvailabilityIndicator availability={data.availability} />
      </div>
      <Button 
        size="sm" 
        onClick={onBookNow}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
      >
        Book Now
      </Button>
    </div>
  )
}

// Compact variant
function CompactCTA({
  data,
  onBookNow,
  onSaveForLater
}: {
  data: StickyCTAData
  onBookNow: () => void
  onSaveForLater?: () => void
}) {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 border-t shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">{data.creatorName}</h3>
            <TrustIndicators stats={data.stats} compact />
          </div>
          <div className="flex items-center gap-4">
            <PriceDisplay price={data.price} />
            <AvailabilityIndicator availability={data.availability} />
          </div>
        </div>
        <div className="flex gap-2">
          {onSaveForLater && (
            <Button variant="outline" size="sm" onClick={onSaveForLater}>
              <Heart className="h-4 w-4" />
            </Button>
          )}
          <Button 
            onClick={onBookNow}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Book Now
            <Zap className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      {data.urgencyMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200"
        >
          <p className="text-sm text-orange-700 dark:text-orange-300 text-center">
            ⚡ {data.urgencyMessage}
          </p>
        </motion.div>
      )}
    </div>
  )
}

// Full variant
function FullCTA({
  data,
  onBookNow,
  onSaveForLater,
  onMessage,
  onClose
}: {
  data: StickyCTAData
  onBookNow: () => void
  onSaveForLater?: () => void
  onMessage?: () => void
  onClose: () => void
}) {
  return (
    <Card className="p-6 shadow-2xl border-2 border-purple-200 dark:border-purple-800">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">{data.creatorName}</h3>
            <TrustIndicators stats={data.stats} />
          </div>
          <div className="text-right">
            <PriceDisplay price={data.price} size="lg" />
            <AvailabilityIndicator availability={data.availability} />
          </div>
        </div>
        
        {/* Features */}
        {data.features && data.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                {feature}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Trust badges */}
        {data.trustBadges && data.trustBadges.length > 0 && (
          <div className="flex items-center gap-3 pt-2 border-t">
            {data.trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                <badge.icon className="h-3 w-3" />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Urgency message */}
        {data.urgencyMessage && (
          <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
            <p className="text-sm font-medium text-orange-700 dark:text-orange-300 text-center">
              ⚡ {data.urgencyMessage}
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            size="lg"
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105 transition-all"
            onClick={onBookNow}
          >
            Book Now
            <Calendar className="h-4 w-4 ml-2" />
          </Button>
          {onMessage && (
            <Button variant="outline" size="lg" onClick={onMessage}>
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
          {onSaveForLater && (
            <Button variant="outline" size="lg" onClick={onSaveForLater}>
              <Heart className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Guarantee */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Shield className="h-3 w-3" />
          <span>100% Satisfaction Guaranteed • Secure Booking</span>
        </div>
      </div>
    </Card>
  )
}

// Main sticky CTA bar component
export function StickyCTABar({
  data,
  onBookNow,
  onSaveForLater,
  onMessage,
  showThreshold = 50,
  className,
  variant = "compact"
}: StickyCTABarProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isMinimized, setIsMinimized] = React.useState(false)
  const [hasInteracted, setHasInteracted] = React.useState(false)
  
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, showThreshold / 100], [0, 1])
  
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const shouldShow = latest > showThreshold / 100
      setIsVisible(shouldShow)
      
      // Auto-minimize after showing for 10 seconds
      if (shouldShow && !hasInteracted) {
        const timer = setTimeout(() => {
          if (!hasInteracted) {
            setIsMinimized(true)
          }
        }, 10000)
        return () => clearTimeout(timer)
      }
    })
    
    return () => unsubscribe()
  }, [scrollYProgress, showThreshold, hasInteracted])
  
  const handleBookNow = () => {
    setHasInteracted(true)
    onBookNow()
    toast.success("Redirecting to booking...")
  }
  
  const handleSaveForLater = () => {
    setHasInteracted(true)
    onSaveForLater?.()
    toast.success("Saved for later!")
  }
  
  const handleMessage = () => {
    setHasInteracted(true)
    onMessage?.()
  }
  
  const handleClose = () => {
    setIsMinimized(true)
    setHasInteracted(true)
  }
  
  const handleExpand = () => {
    setIsMinimized(false)
    setHasInteracted(true)
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            height: isMinimized ? "auto" : undefined
          }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50",
            className
          )}
        >
          {isMinimized ? (
            <button
              onClick={handleExpand}
              className="absolute bottom-4 right-4 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transform hover:scale-110 transition-all"
            >
              <ChevronUp className="h-5 w-5" />
              <span className="sr-only">Show booking options</span>
            </button>
          ) : (
            <>
              {variant === "minimal" && (
                <MinimalCTA data={data} onBookNow={handleBookNow} />
              )}
              {variant === "compact" && (
                <CompactCTA 
                  data={data} 
                  onBookNow={handleBookNow}
                  onSaveForLater={handleSaveForLater}
                />
              )}
              {variant === "full" && (
                <div className="p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                  <FullCTA
                    data={data}
                    onBookNow={handleBookNow}
                    onSaveForLater={handleSaveForLater}
                    onMessage={handleMessage}
                    onClose={handleClose}
                  />
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}