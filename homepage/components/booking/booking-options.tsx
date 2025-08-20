"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DollarSign,
  Clock,
  Zap,
  Gift,
  Calendar,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
  Star,
  Info,
  ChevronRight,
  Sparkles,
  Heart,
  Package,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { PricingCalculator, ConversionOptimizer } from "./pricing-calculator"
import type { CreatorPricingConfig } from "./creator-pricing-config"
import type { BookingOptions as BookingOptionsType, PricingBreakdown, UserPricingContext } from "./pricing-calculator"

interface BookingOptionsProps {
  creatorName: string
  config: CreatorPricingConfig
  userContext?: UserPricingContext
  availability: {
    standard: number // days until available
    rush: number // hours until available
    rushSlotsRemaining: number
    rushOrdersToday: number
  }
  analytics?: {
    recentBookings: number
    totalBookings: number
    repeatRate: number
    categoryAverage: number
  }
  onBook: (options: BookingOptionsType, breakdown: PricingBreakdown) => void
  className?: string
}

// Individual booking option card
function BookingOptionCard({
  title,
  price,
  originalPrice,
  description,
  features,
  selected,
  popular,
  limited,
  urgencyMessage,
  onSelect,
  disabled
}: {
  title: string
  price: number
  originalPrice?: number
  description: string
  features: string[]
  selected: boolean
  popular?: boolean
  limited?: boolean
  urgencyMessage?: string
  onSelect: () => void
  disabled?: boolean
}) {
  const savings = originalPrice ? originalPrice - price : 0
  const savingsPercent = originalPrice ? Math.round((savings / originalPrice) * 100) : 0
  
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        "relative",
        popular && "md:-mt-4"
      )}
    >
      <Card
        className={cn(
          "relative cursor-pointer transition-all",
          selected && "ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-900/20",
          popular && "border-purple-500 shadow-lg",
          limited && "border-orange-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && onSelect()}
      >
        {/* Badges */}
        <div className="absolute -top-3 left-4 right-4 flex justify-between">
          {popular && (
            <Badge className="bg-purple-600">
              <Star className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          )}
          {limited && (
            <Badge className="bg-orange-600">
              <Zap className="h-3 w-3 mr-1" />
              Limited
            </Badge>
          )}
          {savings > 0 && (
            <Badge className="bg-green-600">
              Save {savingsPercent}%
            </Badge>
          )}
        </div>
        
        <CardContent className="p-6 pt-8">
          <div className="space-y-4">
            {/* Selection indicator */}
            <div className="flex items-start gap-3">
              <div className={cn(
                "mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center",
                selected ? "border-purple-500 bg-purple-500" : "border-gray-300"
              )}>
                {selected && <CheckCircle className="h-3 w-3 text-white" />}
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{title}</h4>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </div>
            </div>
            
            {/* Pricing */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  ${price}
                </span>
                {originalPrice && originalPrice > price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ${originalPrice}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      -{savingsPercent}%
                    </Badge>
                  </>
                )}
              </div>
              
              {urgencyMessage && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {urgencyMessage}
                </p>
              )}
            </div>
            
            {/* Features */}
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Price breakdown display
function PriceBreakdown({
  breakdown,
  showDetails
}: {
  breakdown: PricingBreakdown
  showDetails: boolean
}) {
  return (
    <AnimatePresence>
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2 text-sm"
        >
          <div className="flex justify-between">
            <span className="text-gray-500">Base price</span>
            <span>${breakdown.basePrice.toFixed(2)}</span>
          </div>
          
          {breakdown.rushSurcharge > 0 && (
            <div className="flex justify-between text-orange-600">
              <span>Rush delivery</span>
              <span>+${breakdown.rushSurcharge.toFixed(2)}</span>
            </div>
          )}
          
          {breakdown.bundleDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Bundle discount</span>
              <span>-${breakdown.bundleDiscount.toFixed(2)}</span>
            </div>
          )}
          
          {breakdown.promoDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Promo discount</span>
              <span>-${breakdown.promoDiscount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="pt-2 border-t">
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span className="text-xl">${breakdown.total.toFixed(2)}</span>
            </div>
            
            {breakdown.savings > 0 && (
              <p className="text-xs text-green-600 mt-1">
                You're saving ${breakdown.savings.toFixed(2)}!
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Main booking options component
export function BookingOptions({
  creatorName,
  config,
  userContext,
  availability,
  analytics,
  onBook,
  className
}: BookingOptionsProps) {
  const [selectedOption, setSelectedOption] = React.useState<"standard" | "rush">("standard")
  const [quantity, setQuantity] = React.useState(1)
  const [isGift, setIsGift] = React.useState(false)
  const [showBreakdown, setShowBreakdown] = React.useState(false)
  
  const calculator = React.useMemo(
    () => new PricingCalculator(config),
    [config]
  )
  
  // Calculate pricing for current options
  const bookingOptions: BookingOptionsType = {
    rushDelivery: selectedOption === "rush",
    quantity,
    isGift,
    firstTimeCustomer: userContext?.isFirstTime || false
  }
  
  const breakdown = calculator.calculateTotal(bookingOptions, userContext)
  const rushAvailability = calculator.getRushAvailability(availability.rushOrdersToday)
  
  // Get conversion optimization messages
  const pricingMessage = analytics ? ConversionOptimizer.getPricingMessage(
    config.basePrice.amount,
    analytics.categoryAverage,
    userContext || { isFirstTime: false, previousBookings: 0, giftPurchase: isGift }
  ) : null
  
  const urgencyMessage = analytics ? ConversionOptimizer.getUrgencyMessage(
    availability.rushSlotsRemaining,
    analytics.recentBookings
  ) : null
  
  const socialProof = analytics ? ConversionOptimizer.getSocialProofMessage(
    analytics.totalBookings,
    analytics.repeatRate
  ) : null
  
  const handleBook = () => {
    onBook(bookingOptions, breakdown)
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Creator-set pricing header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Personal Video Message</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Price set by {creatorName}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                ${config.basePrice.amount}
              </div>
              <p className="text-xs text-gray-500">base price</p>
            </div>
          </div>
          
          {/* Social proof and messaging */}
          <div className="mt-4 space-y-2">
            {socialProof && (
              <Badge variant="secondary" className="text-xs">
                {socialProof}
              </Badge>
            )}
            {pricingMessage && (
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {pricingMessage}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Delivery Options */}
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-500" />
          Choose Delivery Speed
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <BookingOptionCard
            title="Standard Delivery"
            price={config.basePrice.amount * quantity}
            description={`Delivered in ${availability.standard} days`}
            features={[
              "Regular delivery queue",
              `Available in ${availability.standard} days`,
              "Standard processing",
              "Email notification"
            ]}
            selected={selectedOption === "standard"}
            onSelect={() => setSelectedOption("standard")}
          />
          
          <BookingOptionCard
            title="Rush Delivery"
            price={calculator.calculateTotal({
              ...bookingOptions,
              rushDelivery: true
            }).total}
            originalPrice={config.basePrice.amount * quantity}
            description={`Delivered in ${config.rushDelivery.deliveryTime} hours`}
            features={[
              "Priority processing",
              `${config.rushDelivery.deliveryTime}-hour delivery`,
              "Jump the queue",
              "SMS + Email notification"
            ]}
            selected={selectedOption === "rush"}
            popular={true}
            limited={rushAvailability.slotsRemaining <= 2}
            urgencyMessage={rushAvailability.slotsRemaining <= 2 ? rushAvailability.message : undefined}
            onSelect={() => setSelectedOption("rush")}
            disabled={!rushAvailability.available}
          />
        </div>
        
        {urgencyMessage && (
          <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-600" />
            <p className="text-sm text-orange-700 dark:text-orange-300">
              {urgencyMessage}
            </p>
          </div>
        )}
      </div>
      
      {/* Additional Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quantity selector */}
          {config.bundles && config.bundles.some(b => b.enabled) && (
            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                >
                  +
                </Button>
                {quantity > 1 && breakdown.bundleDiscount > 0 && (
                  <Badge className="bg-green-600 ml-2">
                    Bundle discount applied!
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {/* Gift option */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-purple-500" />
              <Label htmlFor="gift-option">Send as a gift</Label>
            </div>
            <Switch
              id="gift-option"
              checked={isGift}
              onCheckedChange={setIsGift}
            />
          </div>
          
          {isGift && (
            <div className="pl-6 text-sm text-gray-600 dark:text-gray-400">
              Perfect for birthdays, anniversaries, and special occasions!
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Price Summary */}
      <Card>
        <CardHeader>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center justify-between w-full"
          >
            <CardTitle className="text-base">Price Summary</CardTitle>
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              showBreakdown && "rotate-90"
            )} />
          </button>
        </CardHeader>
        <CardContent>
          <PriceBreakdown breakdown={breakdown} showDetails={showBreakdown} />
          
          {!showBreakdown && (
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${breakdown.total.toFixed(2)}
                </div>
                {breakdown.savings > 0 && (
                  <p className="text-xs text-green-600">
                    Save ${breakdown.savings.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Book Button */}
      <Button
        size="lg"
        className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        onClick={handleBook}
      >
        <Calendar className="h-5 w-5 mr-2" />
        Book {selectedOption === "rush" ? "Rush" : "Standard"} Delivery
        <span className="ml-2">• ${breakdown.total.toFixed(2)}</span>
      </Button>
      
      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>100% Satisfaction</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="h-3 w-3" />
          <span>Money Back Guarantee</span>
        </div>
      </div>
    </div>
  )
}