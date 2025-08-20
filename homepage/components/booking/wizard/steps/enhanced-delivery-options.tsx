"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Clock,
  Zap,
  Calendar as CalendarIcon,
  Package,
  Rocket,
  Gift,
  Mail,
  Phone,
  Download,
  AlertCircle,
  Info,
  Check,
  Star,
  TrendingUp,
  Users,
  Shield,
  Sparkles,
  Timer,
  Eye,
  EyeOff,
  Flame,
  Heart,
  Award,
  Target,
  ThumbsUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays, isBefore, isAfter, startOfDay } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { StepComponentProps } from "../multi-step-wizard"

import {
  UrgencyCountdownTimer,
  SocialProofStats,
  LiveActivityFeed,
  ValueCalculator,
  ScarcityIndicator,
  DeliveryTestimonials,
  PeaceOfMindGuarantees,
  PsychologyOptimizedDeliveryCard
} from "../../enhanced-delivery-psychology"

// Enhanced delivery tier configuration with psychology data
const enhancedDeliveryTiers = [
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
      "Standard video quality",
      "24/7 customer support"
    ],
    availability: "always",
    popularityPercent: 25,
    description: "Perfect when you're planning ahead",
    psychology: {
      useCase: "Planning ahead - no rush",
      valueProposition: "Most economical option",
      customerType: "Budget-conscious planners"
    }
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
      "HD video quality guaranteed",
      "Priority customer support",
      "Rush processing available"
    ],
    availability: "always",
    popularityPercent: 60,
    scarcityMessage: "60% of customers choose express - join the majority!",
    description: "The sweet spot between speed and value",
    psychology: {
      useCase: "Some urgency - perfect balance",
      valueProposition: "Best value for faster delivery",
      customerType: "Most popular choice",
      socialProof: "6 out of 10 customers choose this option"
    }
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
      "Direct creator notification",
      "Dedicated support line",
      "Rush guarantee promise"
    ],
    availability: "limited",
    slotsRemaining: 3,
    popularityPercent: 35,
    scarcityMessage: "Only 3 rush slots left today - act fast!",
    description: "For last-minute gifts and urgent occasions",
    psychology: {
      useCase: "Urgent - last minute gifts",
      valueProposition: "Peace of mind for urgent needs",
      customerType: "Emergency situations",
      urgencyTrigger: "Time-sensitive occasions"
    }
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
      "Reminder notifications",
      "Perfect timing guarantee"
    ],
    availability: "always",
    popularityPercent: 20,
    description: "Perfect timing for special occasions",
    psychology: {
      useCase: "Special occasions - perfect timing",
      valueProposition: "Guaranteed perfect timing",
      customerType: "Special event planners"
    }
  }
]

// Gift delivery methods with psychology enhancements
const enhancedGiftDeliveryMethods = [
  {
    id: "email",
    label: "Email Delivery",
    icon: Mail,
    description: "Instant delivery with beautiful email presentation",
    requiresField: "email",
    popularity: 70,
    recommended: true
  },
  {
    id: "sms",
    label: "SMS Delivery",
    icon: Phone,
    description: "Quick text with link - perfect for mobile users",
    requiresField: "phone",
    popularity: 20
  },
  {
    id: "surprise",
    label: "Surprise Page",
    icon: Gift,
    description: "Create a magical surprise reveal experience",
    requiresField: "none",
    premium: true,
    popularity: 8,
    wow_factor: true
  },
  {
    id: "download",
    label: "Manual Download",
    icon: Download,
    description: "Download yourself and deliver personally",
    requiresField: "none",
    popularity: 2
  }
]

export function EnhancedDeliveryOptions({
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
  const [showPsychologyHelpers, setShowPsychologyHelpers] = React.useState(true)
  
  const basePrice = data.basePrice || 150
  const selectedTierData = enhancedDeliveryTiers.find(t => t.id === selectedTier)
  
  // Calculate urgency deadline (4 PM for rush, 8 PM for express)
  const currentHour = new Date().getHours()
  const rushDeadline = new Date()
  rushDeadline.setHours(16, 0, 0, 0) // 4 PM
  if (currentHour >= 16) {
    rushDeadline.setDate(rushDeadline.getDate() + 1)
  }
  
  const expressDeadline = new Date()
  expressDeadline.setHours(20, 0, 0, 0) // 8 PM
  if (currentHour >= 20) {
    expressDeadline.setDate(expressDeadline.getDate() + 1)
  }
  
  // Get delivery date based on tier
  const getDeliveryDate = (tierId: string) => {
    const tier = enhancedDeliveryTiers.find(t => t.id === tierId)
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
    const tier = enhancedDeliveryTiers.find(t => t.id === tierId)
    
    updateData({
      deliveryTier: tierId,
      deliveryPrice: tier?.pricePercent 
        ? Math.round(basePrice * (tier.pricePercent / 100))
        : tier?.price || 0,
      deliveryTimeline: tier?.timeline,
      expectedDelivery: getDeliveryDate(tierId)?.toISOString(),
      scheduledDate: tierId === "scheduled" ? scheduledDate?.toISOString() : null
    })
    
    // Psychology feedback
    if (tierId === "rush") {
      toast.success("Rush delivery selected - your video will be prioritized!")
    } else if (tierId === "express") {
      toast.success("Great choice! Express is our most popular option.")
    }
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
    
    if (checked) {
      toast.success("Gift mode activated! 🎁")
    }
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
      {/* Psychology Helpers Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Choose Delivery Speed</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPsychologyHelpers(!showPsychologyHelpers)}
        >
          <Target className="h-4 w-4 mr-2" />
          {showPsychologyHelpers ? "Hide" : "Show"} Smart Insights
        </Button>
      </div>
      
      {/* Urgency Banner for Rush */}
      {showUrgencyBanner && selectedTier === "rush" && currentHour < 16 && (
        <UrgencyCountdownTimer
          targetTime={rushDeadline}
          message="Order by 4 PM today for guaranteed 24-hour rush delivery"
          variant="warning"
        />
      )}
      
      {/* Social Proof Statistics */}
      {showPsychologyHelpers && (
        <SocialProofStats className="mb-6" />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Delivery Options */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enhancedDeliveryTiers.map((tier) => (
              <PsychologyOptimizedDeliveryCard
                key={tier.id}
                tier={tier}
                basePrice={basePrice}
                isSelected={selectedTier === tier.id}
                onSelect={() => handleTierSelect(tier.id)}
                occasion={data.occasion}
                showUrgency={showPsychologyHelpers}
                showSocialProof={showPsychologyHelpers}
                showValueFraming={showPsychologyHelpers}
              />
            ))}
          </div>
          
          {/* Scheduled Delivery Date Picker */}
          {selectedTier === "scheduled" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <Label>Select Perfect Delivery Date</Label>
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
                    {scheduledDate ? format(scheduledDate, "PPP") : "Pick the perfect date"}
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
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Scheduled delivery available 5+ days from today
              </p>
            </motion.div>
          )}
          
          {/* Gift Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Gift className="h-5 w-5 text-purple-600" />
                Gift Options
                <Badge variant="secondary" className="text-xs">
                  Make it special
                </Badge>
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
                  {/* Enhanced Delivery Method */}
                  <div className="space-y-3">
                    <Label>How should we deliver this special gift?</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {enhancedGiftDeliveryMethods.map((method) => {
                        const Icon = method.icon
                        const isSelected = giftMethod === method.id
                        return (
                          <div
                            key={method.id}
                            className={cn(
                              "p-3 rounded-lg border-2 cursor-pointer transition-all",
                              isSelected 
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-200 hover:border-purple-300"
                            )}
                            onClick={() => handleGiftMethodChange(method.id)}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className="h-5 w-5 text-purple-600 mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{method.label}</span>
                                  {method.recommended && (
                                    <Badge className="bg-green-600 text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      Recommended
                                    </Badge>
                                  )}
                                  {method.premium && (
                                    <Badge variant="secondary" className="text-xs">
                                      Premium
                                    </Badge>
                                  )}
                                  {method.wow_factor && (
                                    <Badge className="bg-purple-600 text-xs">
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      Wow Factor
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {method.description}
                                </p>
                                {showPsychologyHelpers && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1">
                                      <Users className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {method.popularity}% choose this
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
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
                      Personal gift message
                      <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                    </Label>
                    <Textarea
                      id="giftMessage"
                      placeholder="Happy Birthday! Hope you enjoy this special message from your favorite creator..."
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
                      Keep the price a surprise
                    </Label>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Psychology Sidebar */}
        {showPsychologyHelpers && (
          <div className="space-y-4">
            {/* Live Activity Feed */}
            <LiveActivityFeed />
            
            {/* Value Calculator */}
            {selectedTierData && selectedTierData.price > 0 && (
              <ValueCalculator
                basePrice={basePrice}
                deliveryPrice={selectedTierData.pricePercent 
                  ? Math.round(basePrice * (selectedTierData.pricePercent / 100))
                  : selectedTierData.price
                }
                timeline={selectedTierData.timeline}
                occasion={data.occasion}
              />
            )}
            
            {/* Delivery Testimonials */}
            <DeliveryTestimonials />
            
            {/* Peace of Mind Guarantees */}
            <PeaceOfMindGuarantees />
          </div>
        )}
      </div>
      
      {/* Enhanced Delivery Summary */}
      {selectedTierData && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <selectedTierData.icon className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {selectedTierData.name} Selected
                    {selectedTierData.badge && (
                      <Badge className="bg-purple-600 text-xs">
                        {selectedTierData.badge}
                      </Badge>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTierData.description}
                  </p>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Delivery by {format(getDeliveryDate(selectedTier) || new Date(), "EEEE, MMMM d")}
                  </p>
                </div>
              </div>
              {selectedTierData.price !== undefined && selectedTierData.price > 0 && (
                <div className="text-right">
                  <p className="font-bold text-xl text-purple-700 dark:text-purple-300">
                    +${selectedTierData.pricePercent 
                      ? Math.round(basePrice * (selectedTierData.pricePercent / 100))
                      : selectedTierData.price}
                  </p>
                  <p className="text-xs text-gray-500">Delivery upgrade</p>
                </div>
              )}
            </div>
            
            {/* Psychology messaging */}
            {showPsychologyHelpers && selectedTierData.psychology && (
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Smart Choice
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedTierData.psychology.valueProposition}
                </p>
                {selectedTierData.psychology.socialProof && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    💡 {selectedTierData.psychology.socialProof}
                  </p>
                )}
              </div>
            )}
            
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
                {data.giftMessage && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    With personal message: "{data.giftMessage.substring(0, 50)}..."
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}