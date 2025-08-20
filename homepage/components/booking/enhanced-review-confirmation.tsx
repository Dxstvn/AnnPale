"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Check,
  Edit2,
  AlertCircle,
  Info,
  Gift,
  Calendar,
  User,
  MessageSquare,
  Clock,
  DollarSign,
  Shield,
  Star,
  ChevronRight,
  Package,
  Zap,
  Mail,
  Phone,
  Download,
  Eye,
  EyeOff,
  PartyPopper,
  Heart,
  Trophy,
  Smile,
  Briefcase,
  Baby,
  Award,
  Coffee,
  GraduationCap,
  Rocket,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Users,
  Lock,
  CreditCard,
  MessageCircle,
  Headphones,
  CheckCircle2,
  TrendingUp,
  Timer,
  ArrowRight,
  Percent
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"

// Trust signal components
const TrustBadge = ({ 
  icon: Icon, 
  title, 
  description, 
  color = "green",
  highlight = false 
}: {
  icon: React.ElementType
  title: string
  description: string
  color?: "green" | "blue" | "purple" | "gold"
  highlight?: boolean
}) => {
  const colors = {
    green: "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200",
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200",
    gold: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "p-3 rounded-lg border transition-all",
        colors[color],
        highlight && "ring-2 ring-offset-2 ring-purple-500"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
          color === "green" && "bg-green-100 dark:bg-green-800",
          color === "blue" && "bg-blue-100 dark:bg-blue-800",
          color === "purple" && "bg-purple-100 dark:bg-purple-800",
          color === "gold" && "bg-yellow-100 dark:bg-yellow-800"
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Live support indicator
const LiveSupportIndicator = () => {
  const [isOnline] = React.useState(true)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border"
    >
      <div className="relative">
        <Headphones className="h-4 w-4 text-gray-600" />
        {isOnline && (
          <div className="absolute -top-1 -right-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
          </div>
        )}
      </div>
      <div className="text-xs">
        <p className="font-medium">Support Available</p>
        <p className="text-gray-500">Average response: 2 min</p>
      </div>
    </motion.div>
  )
}

// Scarcity indicator
const ScarcityIndicator = ({ 
  spotsLeft = 3,
  viewersCount = 47 
}: {
  spotsLeft?: number
  viewersCount?: number
}) => {
  return (
    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-sm">
        <span className="font-semibold text-orange-700 dark:text-orange-300">
          High Demand:
        </span>{" "}
        Only {spotsLeft} spots left today • {viewersCount} people viewing now
      </AlertDescription>
    </Alert>
  )
}

// Price guarantee badge
const PriceGuarantee = () => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200">
      <Percent className="h-4 w-4 text-green-600" />
      <span className="text-xs font-medium text-green-700 dark:text-green-300">
        Best Price Guarantee
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-3 w-3 text-green-600" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-[200px]">
              Found a lower price? We'll match it and give you 10% off!
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

// Social proof ticker
const SocialProofTicker = () => {
  const activities = [
    { name: "Sarah M.", action: "just booked", creator: "Ti Jo Zenny", time: "2 min ago" },
    { name: "John D.", action: "received video from", creator: "Wyclef Jean", time: "5 min ago" },
    { name: "Emma L.", action: "left 5★ review for", creator: "Michael Brun", time: "8 min ago" },
  ]
  
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [activities.length])
  
  return (
    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-xs"
        >
          <Users className="h-3 w-3 text-purple-600" />
          <span>
            <span className="font-medium">{activities[currentIndex].name}</span>{" "}
            {activities[currentIndex].action}{" "}
            <span className="font-medium">{activities[currentIndex].creator}</span>{" "}
            • {activities[currentIndex].time}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

interface EnhancedReviewConfirmationProps {
  data: Record<string, any>
  updateData: (data: Record<string, any>) => void
  onEdit: (section: string) => void
  creatorInfo?: {
    name: string
    rating: number
    reviews: number
    responseTime: string
    image?: string
  }
  isLoading?: boolean
}

export function EnhancedReviewConfirmation({
  data,
  updateData,
  onEdit,
  creatorInfo,
  isLoading = false
}: EnhancedReviewConfirmationProps) {
  const [showAllDetails, setShowAllDetails] = React.useState(false)
  const [promoCode, setPromoCode] = React.useState("")
  const [hasPromoApplied, setHasPromoApplied] = React.useState(false)
  
  // Animation refs
  const { ref: trustRef, inView: trustInView } = useInView({ triggerOnce: true })
  const { ref: priceRef, inView: priceInView } = useInView({ triggerOnce: true })
  
  // Calculate totals
  const basePrice = data.basePrice || 150
  const deliveryPrice = data.deliveryPrice || 0
  const serviceFee = Math.round(basePrice * 0.1) // 10% service fee
  const promoDiscount = hasPromoApplied ? Math.round(basePrice * 0.15) : 0 // 15% promo discount
  const discount = (data.discount || 0) + promoDiscount
  const total = basePrice + deliveryPrice + serviceFee - discount
  const savings = discount > 0 ? discount : (data.originalPrice ? data.originalPrice - basePrice : 0)
  
  // Helper function to get occasion icon
  const getOccasionIcon = (occasionId: string) => {
    const icons: Record<string, React.ElementType> = {
      birthday: PartyPopper,
      anniversary: Heart,
      graduation: GraduationCap,
      wedding: Heart,
      new_job: Briefcase,
      celebration: PartyPopper,
      support: HeartHandshake,
      milestone: Trophy,
      just_because: Smile,
    }
    return icons[occasionId] || Gift
  }
  
  // Helper function to get delivery icon
  const getDeliveryIcon = (deliveryTier: string) => {
    const icons: Record<string, React.ElementType> = {
      standard: Package,
      express: Rocket,
      rush: Zap,
      scheduled: Calendar
    }
    return icons[deliveryTier] || Package
  }
  
  const OccasionIcon = getOccasionIcon(data.occasion || data.occasionCategory)
  const DeliveryIcon = getDeliveryIcon(data.deliveryTier)
  
  // Format delivery date
  const formatDeliveryDate = () => {
    if (data.scheduledDate) {
      return format(new Date(data.scheduledDate), "EEEE, MMMM d, yyyy")
    }
    if (data.expectedDelivery) {
      return format(new Date(data.expectedDelivery), "EEEE, MMMM d, yyyy")
    }
    const days = data.deliveryTier === "rush" ? 1 : data.deliveryTier === "express" ? 3 : 7
    return format(addDays(new Date(), days), "EEEE, MMMM d, yyyy")
  }
  
  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE15") {
      setHasPromoApplied(true)
      updateData({ ...data, promoCode, promoDiscount })
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Trust Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-green-200"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-bold text-green-900 dark:text-green-100">
                100% Satisfaction Guaranteed
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Not happy? We'll make it right or give you a full refund
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <PriceGuarantee />
            <LiveSupportIndicator />
          </div>
        </div>
      </motion.div>
      
      {/* Scarcity & Social Proof */}
      <div className="space-y-3">
        <ScarcityIndicator spotsLeft={2} viewersCount={34} />
        <SocialProofTicker />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Creator Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-1">
              <CardHeader className="bg-white dark:bg-gray-900 m-1 rounded">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Your Creator</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-purple-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                    <Badge variant="secondary">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Top 5%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </div>
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-2xl">
                    {creatorInfo?.name?.charAt(0) || data.creatorName?.charAt(0) || "C"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl">
                    {creatorInfo?.name || data.creatorName || "Creator Name"}
                  </h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">
                        {creatorInfo?.rating || 4.9}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({creatorInfo?.reviews || "1.2k"} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Timer className="h-4 w-4 text-purple-600" />
                      <span>{creatorInfo?.responseTime || "24hr"} delivery</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      500+ videos
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      2.5k fans
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Message Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <OccasionIcon className="h-5 w-5 text-purple-600" />
                  Message Details
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit("message")}
                  className="hover:bg-purple-50"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Occasion</p>
                  <p className="font-semibold mt-1">
                    {data.occasionLabel || data.customOccasion || "Birthday"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">For</p>
                  <p className="font-semibold mt-1">
                    {data.recipientName || "Recipient"}
                    {data.relationship && ` (${data.relationship})`}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Your Instructions
                </p>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                  <p className="text-sm whitespace-pre-wrap">
                    {showAllDetails || (data.instructions || "").length <= 150
                      ? data.instructions || "No instructions provided"
                      : `${(data.instructions || "").substring(0, 150)}...`}
                  </p>
                  {(data.instructions || "").length > 150 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllDetails(!showAllDetails)}
                      className="mt-2 p-0 h-auto text-purple-600 hover:text-purple-700"
                    >
                      {showAllDetails ? "Show less" : "Show more"}
                      <ChevronRight className={cn(
                        "h-4 w-4 ml-1 transition-transform",
                        showAllDetails && "rotate-90"
                      )} />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Delivery Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <DeliveryIcon className="h-5 w-5 text-purple-600" />
                  Delivery Options
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit("delivery")}
                  className="hover:bg-purple-50"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Change
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <div>
                  <p className="font-semibold capitalize">
                    {data.deliveryTier || "Standard"} Delivery
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Expected by {formatDeliveryDate()}
                  </p>
                </div>
                <Badge variant="default" className="bg-purple-600">
                  {data.deliveryTier === "rush" ? "Within 24hr" :
                   data.deliveryTier === "express" ? "2-3 days" : "5-7 days"}
                </Badge>
              </div>
              
              {data.isGift && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Gift Delivery Settings</span>
                    </div>
                    <div className="pl-7 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        {data.giftMethod === "email" && <Mail className="h-4 w-4" />}
                        {data.giftMethod === "sms" && <Phone className="h-4 w-4" />}
                        {data.giftMethod === "surprise" && <Sparkles className="h-4 w-4" />}
                        <span>
                          {data.giftMethod === "email" && `Email to ${data.recipientEmail}`}
                          {data.giftMethod === "sms" && `SMS to ${data.recipientPhone}`}
                          {data.giftMethod === "surprise" && "Surprise reveal page"}
                        </span>
                      </div>
                      {data.hidePrice && (
                        <div className="flex items-center gap-2 text-sm">
                          <EyeOff className="h-4 w-4" />
                          <span>Price hidden from recipient</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Price & Trust */}
        <div className="space-y-4">
          {/* Price Summary - Sticky on desktop */}
          <div className="lg:sticky lg:top-4">
            <Card ref={priceRef} className="overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1">
                <CardHeader className="bg-white dark:bg-gray-900 m-0.5 rounded-t">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Order Summary</span>
                    <Lock className="h-4 w-4 text-gray-400" />
                  </CardTitle>
                </CardHeader>
              </div>
              <CardContent className="pt-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Video Message</span>
                    <span className="font-medium">${basePrice}</span>
                  </div>
                  
                  {deliveryPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-orange-500" />
                        {data.deliveryTier === "rush" ? "Rush" : "Express"} Delivery
                      </span>
                      <span className="font-medium">${deliveryPrice}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1 cursor-help">
                          <span>Service Fee</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-[200px]">
                            Covers payment processing, customer support, and platform maintenance
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="font-medium">${serviceFee}</span>
                  </div>
                  
                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between text-sm text-green-600 font-semibold"
                    >
                      <span>Discount Applied</span>
                      <span>-${discount}</span>
                    </motion.div>
                  )}
                </div>
                
                <Separator />
                
                {/* Promo Code */}
                {!hasPromoApplied && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border rounded-md"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={applyPromoCode}
                        className="text-purple-600 hover:bg-purple-50"
                      >
                        Apply
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Try "SAVE15" for 15% off!
                    </p>
                  </div>
                )}
                
                {hasPromoApplied && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-xs">
                      Promo code applied! You saved ${promoDiscount}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Separator />
                
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-lg font-bold">Total</span>
                    <div className="text-right">
                      <motion.p
                        key={total}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold"
                      >
                        ${total}
                      </motion.p>
                      {savings > 0 && (
                        <p className="text-xs text-green-600 font-medium">
                          You save ${savings}!
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Secure checkout powered by Stripe
                  </p>
                </div>
                
                {/* Payment Methods */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                  <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </CardContent>
            </Card>
            
            {/* Trust Signals */}
            <div ref={trustRef} className="mt-4 space-y-3">
              <TrustBadge
                icon={ShieldCheck}
                title="Money-Back Guarantee"
                description="Full refund if you're not satisfied"
                color="green"
                highlight
              />
              
              <TrustBadge
                icon={Clock}
                title="On-Time Delivery"
                description="99.8% delivered on schedule"
                color="blue"
              />
              
              <TrustBadge
                icon={Star}
                title="Highly Rated"
                description="4.9★ from 10,000+ customers"
                color="gold"
              />
              
              <TrustBadge
                icon={HeartHandshake}
                title="24/7 Support"
                description="We're here to help anytime"
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Action Area */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                By continuing, you agree to our
              </p>
              <div className="flex items-center gap-2 text-xs">
                <a href="/terms" className="text-purple-600 hover:underline">
                  Terms of Service
                </a>
                <span className="text-gray-400">•</span>
                <a href="/privacy" className="text-purple-600 hover:underline">
                  Privacy Policy
                </a>
                <span className="text-gray-400">•</span>
                <a href="/refund" className="text-purple-600 hover:underline">
                  Refund Policy
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => onEdit("message")}
                className="min-w-[120px]"
              >
                Go Back
              </Button>
              <Button
                size="lg"
                className="min-w-[180px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Continue to Payment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Floating Support Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          size="lg"
          className="rounded-full shadow-lg bg-purple-600 hover:bg-purple-700"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Need Help?
        </Button>
      </motion.div>
    </div>
  )
}