"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  Gift,
  Mail,
  Phone,
  Download,
  Send,
  AlertCircle,
  Info,
  Check,
  Star,
  TrendingUp,
  Users,
  Shield,
  Sparkles,
  Timer,
  Rocket,
  Package,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays, isBefore, isAfter, startOfDay } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import type { StepComponentProps } from "../multi-step-wizard"

// Delivery tier configuration
const deliveryTiers = [
  {
    id: "standard",
    name: "Standard Delivery",
    timeline: "5-7 days",
    price: 0,
    icon: Package,
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800",
    features: [
      "Regular processing queue",
      "Email notification when ready",
      "Download link valid for 90 days",
      "Standard video quality"
    ],
    availability: "always",
    popularityPercent: 40
  },
  {
    id: "express",
    name: "Express Delivery",
    timeline: "2-3 days",
    price: 30,
    pricePercent: 30,
    icon: Rocket,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
    badge: "Popular",
    features: [
      "Priority processing",
      "Email + SMS notification",
      "Extended download period (180 days)",
      "HD video quality guaranteed"
    ],
    availability: "always",
    popularityPercent: 60,
    scarcityMessage: "60% of customers choose express"
  },
  {
    id: "rush",
    name: "Rush Delivery",
    timeline: "24 hours",
    price: 50,
    pricePercent: 50,
    icon: Zap,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30",
    badge: "Fastest",
    features: [
      "Top priority processing",
      "Real-time status updates",
      "Email + SMS + App notifications",
      "4K video quality when available",
      "Direct creator notification"
    ],
    availability: "limited",
    slotsRemaining: 2,
    popularityPercent: 35,
    scarcityMessage: "Only 2 rush slots left today!"
  },
  {
    id: "scheduled",
    name: "Scheduled Delivery",
    timeline: "Choose date",
    price: 0,
    icon: CalendarIcon,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30",
    features: [
      "Pick exact delivery date",
      "Perfect for special occasions",
      "Automatic delivery at midnight",
      "Reminder notifications"
    ],
    availability: "always",
    popularityPercent: 25
  }
]

// Gift delivery methods
const giftDeliveryMethods = [
  {
    id: "email",
    label: "Email",
    icon: Mail,
    description: "Send video link via email",
    requiresField: "email"
  },
  {
    id: "sms",
    label: "SMS",
    icon: Phone,
    description: "Text message with link",
    requiresField: "phone"
  },
  {
    id: "surprise",
    label: "Surprise Page",
    icon: Gift,
    description: "Create a surprise reveal page",
    requiresField: "none",
    premium: true
  },
  {
    id: "download",
    label: "Download",
    icon: Download,
    description: "Download and send yourself",
    requiresField: "none"
  }
]

export function DeliveryOptions({
  data,
  updateData,
  errors,
  isActive
}: StepComponentProps) {
  const [selectedTier, setSelectedTier] = React.useState(data.deliveryTier || "express")
  const [isGift, setIsGift] = React.useState(data.isGift || false)
  const [giftMethod, setGiftMethod] = React.useState(data.giftMethod || "email")
  const [scheduledDate, setScheduledDate] = React.useState<Date | undefined>(
    data.scheduledDate ? new Date(data.scheduledDate) : undefined
  )
  const [hidePrice, setHidePrice] = React.useState(data.hidePrice !== false)
  const [showUrgencyBanner, setShowUrgencyBanner] = React.useState(true)
  
  const basePrice = data.basePrice || 150 // Get from previous steps
  const selectedTierData = deliveryTiers.find(t => t.id === selectedTier)
  
  // Calculate delivery date based on tier
  const getDeliveryDate = (tierId: string) => {
    const tier = deliveryTiers.find(t => t.id === tierId)
    if (!tier) return null
    
    switch (tierId) {
      case "standard":
        return addDays(new Date(), 7)
      case "express":
        return addDays(new Date(), 3)
      case "rush":
        return addDays(new Date(), 1)
      case "scheduled":
        return scheduledDate || addDays(new Date(), 7)
      default:
        return addDays(new Date(), 7)
    }
  }
  
  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId)
    const tier = deliveryTiers.find(t => t.id === tierId)
    
    updateData({
      deliveryTier: tierId,
      deliveryPrice: tier?.price || 0,
      deliveryTimeline: tier?.timeline,
      expectedDelivery: getDeliveryDate(tierId)?.toISOString(),
      scheduledDate: tierId === "scheduled" ? scheduledDate?.toISOString() : null
    })
  }
  
  const handleScheduledDateChange = (date: Date | undefined) => {
    setScheduledDate(date)
    if (selectedTier === "scheduled" && date) {
      updateData({
        scheduledDate: date.toISOString(),
        expectedDelivery: date.toISOString()
      })
    }
  }
  
  const handleGiftToggle = (checked: boolean) => {
    setIsGift(checked)
    updateData({
      isGift: checked,
      giftMethod: checked ? giftMethod : null,
      hidePrice: checked ? hidePrice : false
    })
  }
  
  const handleGiftMethodChange = (method: string) => {
    setGiftMethod(method)
    updateData({ giftMethod: method })
  }
  
  const handleRecipientInfoChange = (field: string, value: string) => {
    updateData({
      [`recipient${field.charAt(0).toUpperCase() + field.slice(1)}`]: value
    })
  }
  
  return (
    <div className="space-y-6">
      {/* Urgency Banner */}
      {showUrgencyBanner && selectedTier === "rush" && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600 animate-pulse" />
                <div>
                  <p className="font-medium text-orange-700 dark:text-orange-300">
                    Limited Rush Slots Available!
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    Only 2 rush delivery slots remaining today
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUrgencyBanner(false)}
                className="text-orange-600 hover:text-orange-700"
              >
                ×
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      
      {/* Delivery Speed Selection */}
      <div className="space-y-3">
        <h3 className="font-medium">Choose Delivery Speed</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {deliveryTiers.map((tier) => {
            const Icon = tier.icon
            const isSelected = selectedTier === tier.id
            const additionalPrice = tier.pricePercent 
              ? Math.round(basePrice * (tier.pricePercent / 100))
              : tier.price || 0
            
            return (
              <motion.div
                key={tier.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={cn(
                    "relative cursor-pointer transition-all",
                    isSelected 
                      ? "ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-900/20"
                      : "hover:shadow-md",
                    tier.availability === "limited" && tier.slotsRemaining && tier.slotsRemaining <= 2
                      ? "border-orange-300"
                      : ""
                  )}
                  onClick={() => handleTierSelect(tier.id)}
                >
                  {tier.badge && (
                    <Badge 
                      className={cn(
                        "absolute -top-2 -right-2",
                        tier.badge === "Fastest" ? "bg-orange-500" : "bg-purple-600"
                      )}
                    >
                      {tier.badge}
                    </Badge>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("p-2 rounded-lg", tier.color)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{tier.name}</CardTitle>
                          <p className="text-sm text-gray-500">{tier.timeline}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {additionalPrice > 0 ? (
                          <>
                            <p className="font-bold text-lg">+${additionalPrice}</p>
                            <p className="text-xs text-gray-500">
                              {tier.pricePercent}% extra
                            </p>
                          </>
                        ) : (
                          <Badge variant="secondary">Included</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-1.5 text-sm">
                      {tier.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    {tier.scarcityMessage && (
                      <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <p className="text-xs text-yellow-700 dark:text-yellow-300 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {tier.scarcityMessage}
                        </p>
                      </div>
                    )}
                    
                    {tier.popularityPercent && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${tier.popularityPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {tier.popularityPercent}%
                        </span>
                      </div>
                    )}
                    
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          Estimated delivery: {format(getDeliveryDate(tier.id) || new Date(), "MMM d, yyyy")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
      
      {/* Scheduled Delivery Date Picker */}
      {selectedTier === "scheduled" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <Label>Select Delivery Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !scheduledDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={scheduledDate}
                onSelect={handleScheduledDateChange}
                disabled={(date) =>
                  isBefore(date, startOfDay(addDays(new Date(), 5))) ||
                  isAfter(date, addDays(new Date(), 365))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-gray-500">
            <Info className="inline h-3 w-3 mr-1" />
            Select a date at least 5 days from today
          </p>
        </motion.div>
      )}
      
      {/* Gift Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-600" />
            Gift Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-gift"
              checked={isGift}
              onCheckedChange={handleGiftToggle}
            />
            <Label
              htmlFor="is-gift"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              This is a gift for someone else
            </Label>
          </div>
          
          {isGift && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pl-6"
            >
              {/* Delivery Method */}
              <div className="space-y-3">
                <Label>How should we deliver the gift?</Label>
                <RadioGroup value={giftMethod} onValueChange={handleGiftMethodChange}>
                  {giftDeliveryMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <div key={method.id} className="flex items-start space-x-2">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label
                          htmlFor={method.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Icon className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="font-medium">{method.label}</span>
                            {method.premium && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Premium
                              </Badge>
                            )}
                            <p className="text-xs text-gray-500">{method.description}</p>
                          </div>
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              </div>
              
              {/* Recipient Contact Info */}
              {giftMethod === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="recipientEmail">
                    Recipient's email *
                  </Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="their-email@example.com"
                    value={data.recipientEmail || ""}
                    onChange={(e) => handleRecipientInfoChange("email", e.target.value)}
                    className={cn(errors?.recipientEmail && "border-red-500")}
                  />
                  {errors?.recipientEmail && (
                    <p className="text-xs text-red-500">{errors.recipientEmail}</p>
                  )}
                </div>
              )}
              
              {giftMethod === "sms" && (
                <div className="space-y-2">
                  <Label htmlFor="recipientPhone">
                    Recipient's phone number *
                  </Label>
                  <Input
                    id="recipientPhone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={data.recipientPhone || ""}
                    onChange={(e) => handleRecipientInfoChange("phone", e.target.value)}
                    className={cn(errors?.recipientPhone && "border-red-500")}
                  />
                  {errors?.recipientPhone && (
                    <p className="text-xs text-red-500">{errors.recipientPhone}</p>
                  )}
                </div>
              )}
              
              {/* Gift Message */}
              <div className="space-y-2">
                <Label htmlFor="giftMessage">
                  Gift message
                  <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                </Label>
                <Textarea
                  id="giftMessage"
                  placeholder="Happy Birthday! Hope you enjoy this special message..."
                  value={data.giftMessage || ""}
                  onChange={(e) => updateData({ giftMessage: e.target.value })}
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500">
                  {(data.giftMessage || "").length}/200 characters
                </p>
              </div>
              
              {/* Hide Price Option */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hide-price"
                  checked={hidePrice}
                  onCheckedChange={(checked) => {
                    setHidePrice(checked as boolean)
                    updateData({ hidePrice: checked })
                  }}
                />
                <Label
                  htmlFor="hide-price"
                  className="text-sm flex items-center gap-2"
                >
                  <EyeOff className="h-4 w-4" />
                  Hide price from recipient
                </Label>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
      
      {/* Delivery Summary */}
      {selectedTierData && (
        <Card className="bg-purple-50/50 dark:bg-purple-900/20 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <selectedTierData.icon className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium">{selectedTierData.name} Selected</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Delivery by {format(getDeliveryDate(selectedTier) || new Date(), "EEEE, MMMM d")}
                  </p>
                </div>
              </div>
              {selectedTierData.price !== undefined && selectedTierData.price > 0 && (
                <div className="text-right">
                  <p className="font-bold text-lg text-purple-700 dark:text-purple-300">
                    +${selectedTierData.pricePercent 
                      ? Math.round(basePrice * (selectedTierData.pricePercent / 100))
                      : selectedTierData.price}
                  </p>
                  <p className="text-xs text-gray-500">Delivery fee</p>
                </div>
              )}
            </div>
            
            {isGift && (
              <div className="mt-3 pt-3 border-t border-purple-200">
                <div className="flex items-center gap-2 text-sm">
                  <Gift className="h-4 w-4 text-purple-600" />
                  <span>Gift delivery via {giftMethod}</span>
                  {hidePrice && (
                    <Badge variant="secondary" className="text-xs">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Price hidden
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}