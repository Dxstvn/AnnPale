"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DollarSign,
  Star,
  Clock,
  Video,
  TrendingUp,
  Info,
  Zap,
  Gift,
  Calendar,
  AlertCircle,
  CheckCircle,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { RatingDisplay } from "@/components/trust/rating-reviews"
import { ResponseIndicator } from "@/components/trust/response-indicators"
import type { ResponseTimeData } from "@/components/trust/response-indicators"

export interface PricingTier {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  features: string[]
  popular?: boolean
  limitedTime?: boolean
  deliveryTime?: string
}

export interface DecisionFactorsData {
  // Pricing
  basePricing: PricingTier
  additionalTiers?: PricingTier[]
  discountPercentage?: number
  discountEndDate?: Date
  
  // Ratings
  rating: number
  totalReviews: number
  recommendationRate?: number
  
  // Response
  responseTime: number
  responseRate: number
  isOnline?: boolean
  lastActive?: Date
  
  // Delivery
  videosDelivered: number
  averageDeliveryTime?: number
  rushDeliveryAvailable?: boolean
  
  // Trust
  completionRate: number
  refundRate?: number
  satisfactionGuarantee?: boolean
}

interface DecisionFactorsProps {
  data: DecisionFactorsData
  onSelectTier?: (tier: PricingTier) => void
  onBookNow?: () => void
  variant?: "compact" | "detailed" | "sidebar"
  className?: string
}

// Pricing card component
function PricingCard({
  tier,
  isSelected,
  onSelect,
  discount
}: {
  tier: PricingTier
  isSelected?: boolean
  onSelect?: () => void
  discount?: number
}) {
  const finalPrice = discount 
    ? tier.price * (1 - discount / 100)
    : tier.price

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={cn(
          "relative cursor-pointer transition-all",
          isSelected && "ring-2 ring-purple-500",
          tier.popular && "border-purple-500"
        )}
        onClick={onSelect}
      >
        {tier.popular && (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600">
            Most Popular
          </Badge>
        )}
        
        {tier.limitedTime && (
          <Badge className="absolute -top-3 right-3 bg-red-500">
            <Zap className="h-3 w-3 mr-1" />
            Limited Time
          </Badge>
        )}

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">{tier.name}</h4>
              <p className="text-xs text-gray-500">{tier.description}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                ${Math.round(finalPrice)}
              </span>
              {tier.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${tier.originalPrice}
                </span>
              )}
              {discount && (
                <Badge variant="destructive" className="text-xs">
                  -{discount}%
                </Badge>
              )}
            </div>

            {tier.deliveryTime && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{tier.deliveryTime} delivery</span>
              </div>
            )}

            <ul className="space-y-1">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Key metrics display
function KeyMetrics({ 
  data 
}: { 
  data: DecisionFactorsData 
}) {
  const responseData: ResponseTimeData = {
    averageTime: data.responseTime,
    fastestTime: data.responseTime * 0.8,
    responseRate: data.responseRate,
    isOnline: data.isOnline,
    lastActive: data.lastActive
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Rating */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Rating</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Based on {data.totalReviews} reviews</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="font-semibold">{data.rating}</span>
          <span className="text-xs text-gray-500">({data.totalReviews})</span>
        </div>
        {data.recommendationRate && (
          <p className="text-xs text-green-600 mt-1">
            {data.recommendationRate}% recommend
          </p>
        )}
      </div>

      {/* Response Time */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Response</span>
          {data.isOnline && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600">Online</span>
            </div>
          )}
        </div>
        <ResponseIndicator
          data={responseData}
          variant="minimal"
        />
        <p className="text-xs text-gray-500 mt-1">
          {data.responseRate}% response rate
        </p>
      </div>

      {/* Videos Delivered */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Delivered</span>
          <Video className="h-3 w-3 text-purple-500" />
        </div>
        <p className="font-semibold">{data.videosDelivered.toLocaleString()}</p>
        {data.averageDeliveryTime && (
          <p className="text-xs text-gray-500 mt-1">
            Avg {data.averageDeliveryTime}h delivery
          </p>
        )}
      </div>

      {/* Completion Rate */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Reliability</span>
          <CheckCircle className="h-3 w-3 text-green-500" />
        </div>
        <p className="font-semibold">{data.completionRate}%</p>
        <p className="text-xs text-gray-500 mt-1">Completion rate</p>
        {data.satisfactionGuarantee && (
          <Badge variant="secondary" className="text-xs mt-1">
            <Gift className="h-3 w-3 mr-1" />
            Guaranteed
          </Badge>
        )}
      </div>
    </div>
  )
}

// Discount countdown timer
function DiscountTimer({ 
  endDate 
}: { 
  endDate: Date 
}) {
  const [timeLeft, setTimeLeft] = React.useState("")

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const end = endDate.getTime()
      const distance = end - now

      if (distance < 0) {
        setTimeLeft("Expired")
        clearInterval(timer)
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        
        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h left`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m left`)
        } else {
          setTimeLeft(`${minutes}m left`)
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <span className="text-sm font-medium text-red-600">
        Limited offer: {timeLeft}
      </span>
    </div>
  )
}

// Main component
export function DecisionFactors({
  data,
  onSelectTier,
  onBookNow,
  variant = "detailed",
  className
}: DecisionFactorsProps) {
  const [selectedTier, setSelectedTier] = React.useState(data.basePricing)
  const allTiers = [data.basePricing, ...(data.additionalTiers || [])]

  const handleSelectTier = (tier: PricingTier) => {
    setSelectedTier(tier)
    onSelectTier?.(tier)
  }

  if (variant === "compact") {
    return (
      <Card className={className}>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Starting at</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">${data.basePricing.price}</span>
                {data.discountPercentage && (
                  <Badge variant="destructive">-{data.discountPercentage}%</Badge>
                )}
              </div>
            </div>
            <Button onClick={onBookNow}>
              Book Now
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <KeyMetrics data={data} />
        </CardContent>
      </Card>
    )
  }

  if (variant === "sidebar") {
    return (
      <div className={cn("space-y-4", className)}>
        <Card className="sticky top-4">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Book a Video</h3>
            
            {data.discountEndDate && (
              <DiscountTimer endDate={data.discountEndDate} />
            )}

            <PricingCard
              tier={selectedTier}
              discount={data.discountPercentage}
            />

            <Button 
              size="lg" 
              className="w-full"
              onClick={onBookNow}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book Now - ${selectedTier.price}
            </Button>

            <KeyMetrics data={data} />

            {data.rushDeliveryAvailable && (
              <Badge variant="secondary" className="w-full justify-center">
                <Zap className="h-3 w-3 mr-1" />
                Rush delivery available
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Detailed variant (default)
  return (
    <div className={cn("space-y-6", className)}>
      {/* Discount banner */}
      {data.discountEndDate && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DiscountTimer endDate={data.discountEndDate} />
        </motion.div>
      )}

      {/* Pricing tiers */}
      {allTiers.length > 1 ? (
        <div>
          <h3 className="font-semibold text-lg mb-4">Choose Your Package</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allTiers.map((tier) => (
              <PricingCard
                key={tier.id}
                tier={tier}
                isSelected={selectedTier.id === tier.id}
                onSelect={() => handleSelectTier(tier)}
                discount={data.discountPercentage}
              />
            ))}
          </div>
        </div>
      ) : (
        <PricingCard
          tier={data.basePricing}
          discount={data.discountPercentage}
        />
      )}

      {/* Key metrics */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Why Book With This Creator</h3>
        <KeyMetrics data={data} />
      </div>

      {/* CTA */}
      <div className="flex flex-col md:flex-row gap-4">
        <Button
          size="lg"
          className="flex-1 md:flex-none md:w-64"
          onClick={onBookNow}
        >
          <Calendar className="h-5 w-5 mr-2" />
          Book Now for ${selectedTier.price}
        </Button>
        
        {data.rushDeliveryAvailable && (
          <Button
            size="lg"
            variant="outline"
            className="flex-1 md:flex-none"
          >
            <Zap className="h-5 w-5 mr-2" />
            Request Rush Delivery
          </Button>
        )}
      </div>
    </div>
  )
}