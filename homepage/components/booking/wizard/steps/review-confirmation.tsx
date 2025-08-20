"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Rocket
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { motion } from "framer-motion"
import type { StepComponentProps } from "../multi-step-wizard"

// Helper function to get occasion icon
const getOccasionIcon = (occasionId: string) => {
  const icons: Record<string, React.ElementType> = {
    birthday: PartyPopper,
    anniversary: Heart,
    graduation: GraduationCap,
    wedding: Heart,
    new_job: Briefcase,
    get_well: Heart,
    christmas: Gift,
    mothers_day: Heart,
    fathers_day: Coffee,
    valentines: Heart,
    retirement: Trophy,
    promotion: Trophy,
    thank_you: MessageSquare,
    congratulations: Star,
    new_home: Package,
    fundraiser: DollarSign,
    celebration: PartyPopper,
    support: Heart,
    milestone: Trophy,
    holiday: Calendar,
    just_because: Smile,
    business: Briefcase,
    baby: Baby,
    sports: Award
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

export function ReviewConfirmation({
  data,
  updateData,
  errors,
  isActive
}: StepComponentProps) {
  const [editingSection, setEditingSection] = React.useState<string | null>(null)
  const [showAllDetails, setShowAllDetails] = React.useState(false)
  
  // Calculate totals
  const basePrice = data.basePrice || 150
  const deliveryPrice = data.deliveryPrice || 0
  const serviceFee = Math.round(basePrice * 0.1) // 10% service fee
  const discount = data.discount || 0
  const total = basePrice + deliveryPrice + serviceFee - discount
  const savings = discount > 0 ? discount : (data.originalPrice ? data.originalPrice - basePrice : 0)
  
  // Format delivery date
  const formatDeliveryDate = () => {
    if (data.scheduledDate) {
      return format(new Date(data.scheduledDate), "EEEE, MMMM d, yyyy")
    }
    if (data.expectedDelivery) {
      return format(new Date(data.expectedDelivery), "EEEE, MMMM d, yyyy")
    }
    return "5-7 business days"
  }
  
  const OccasionIcon = getOccasionIcon(data.occasion || data.occasionCategory)
  const DeliveryIcon = getDeliveryIcon(data.deliveryTier)
  
  const handleEdit = (section: string) => {
    // In a real implementation, this would navigate back to the specific step
    console.log(`Edit section: ${section}`)
    setEditingSection(section)
    // You could emit an event to parent to go to specific step
  }
  
  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              Almost Done!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Review your order details and confirm to complete your booking
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Creator Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Creator</CardTitle>
            <Badge variant="secondary">
              <Star className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
              {data.creatorName?.charAt(0) || "C"}
            </div>
            <div>
              <h4 className="font-semibold text-lg">{data.creatorName || "Creator Name"}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {data.deliveryTimeline || "2-3 days"}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  4.9 (1.2k reviews)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Order Details */}
      <div className="space-y-4">
        {/* Occasion & Message */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <OccasionIcon className="h-5 w-5 text-purple-600" />
                Message Details
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit("message")}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Occasion</p>
              <p className="font-medium">{data.occasionLabel || data.customOccasion || "Not specified"}</p>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-gray-500">For</p>
              <p className="font-medium">
                {data.recipientName || "Not specified"}
                {data.relationship && ` (${data.relationship})`}
                {data.pronouns && ` • ${data.pronouns}`}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="font-medium">{data.fromName || "Not specified"}</p>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-gray-500">Instructions</p>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">
                  {showAllDetails || (data.instructions || "").length <= 150
                    ? data.instructions
                    : `${(data.instructions || "").substring(0, 150)}...`}
                </p>
                {(data.instructions || "").length > 150 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllDetails(!showAllDetails)}
                    className="mt-2 p-0 h-auto text-purple-600"
                  >
                    {showAllDetails ? "Show less" : "Show more"}
                  </Button>
                )}
              </div>
            </div>
            
            {data.specialDetails && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Special Details</p>
                  <p className="text-sm mt-1">{data.specialDetails}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Delivery Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <DeliveryIcon className="h-5 w-5 text-purple-600" />
                Delivery
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit("delivery")}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Delivery Speed</p>
                <p className="font-medium capitalize">{data.deliveryTier || "Standard"} Delivery</p>
              </div>
              <Badge variant="secondary">
                {data.deliveryTimeline || "5-7 days"}
              </Badge>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-gray-500">Expected Delivery</p>
              <p className="font-medium">{formatDeliveryDate()}</p>
            </div>
            
            {data.isGift && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Gift className="h-4 w-4" />
                    Gift Delivery
                  </p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      {data.giftMethod === "email" && <Mail className="h-4 w-4" />}
                      {data.giftMethod === "sms" && <Phone className="h-4 w-4" />}
                      {data.giftMethod === "download" && <Download className="h-4 w-4" />}
                      <span className="text-sm">
                        {data.giftMethod === "email" && `Email to ${data.recipientEmail}`}
                        {data.giftMethod === "sms" && `SMS to ${data.recipientPhone}`}
                        {data.giftMethod === "download" && "Download link"}
                        {data.giftMethod === "surprise" && "Surprise reveal page"}
                      </span>
                    </div>
                    {data.hidePrice && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <EyeOff className="h-4 w-4" />
                        Price hidden from recipient
                      </div>
                    )}
                    {data.giftMessage && (
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <p className="text-sm italic">"{data.giftMessage}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Price Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              Price Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Video Message</span>
              <span className="font-medium">${basePrice}</span>
            </div>
            
            {deliveryPrice > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {data.deliveryTier === "rush" ? "Rush" : "Express"} Delivery
                </span>
                <span className="font-medium">${deliveryPrice}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
              <span className="font-medium">${serviceFee}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount Applied</span>
                <span className="font-medium">-${discount}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold">Total</span>
              <div className="text-right">
                <p className="text-2xl font-bold">${total}</p>
                {savings > 0 && (
                  <p className="text-xs text-green-600">You save ${savings}!</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Terms & Trust Signals */}
      <Card className="bg-gray-50/50 dark:bg-gray-900/50">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">100% Satisfaction Guarantee</p>
                <p className="text-gray-500">Not happy? We'll make it right or refund you</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Secure Payment</p>
                <p className="text-gray-500">Your payment info is encrypted and secure</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-purple-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">On-Time Delivery</p>
                <p className="text-gray-500">99.8% of videos delivered on schedule</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <p className="text-xs text-gray-500 text-center">
            By confirming this booking, you agree to our{" "}
            <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>
          </p>
        </CardContent>
      </Card>
      
      {/* Important Notice */}
      {data.deliveryTier === "rush" && (
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-orange-700 dark:text-orange-300">
                Rush Delivery Selected
              </p>
              <p className="text-orange-600 dark:text-orange-400">
                Your video will be prioritized and delivered within 24 hours. 
                The creator will be notified immediately.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Completion Status */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Occasion</span>
          </div>
          <ChevronRight className="h-3 w-3" />
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Details</span>
          </div>
          <ChevronRight className="h-3 w-3" />
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Delivery</span>
          </div>
          <ChevronRight className="h-3 w-3" />
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="font-medium">Review</span>
          </div>
          <ChevronRight className="h-3 w-3" />
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-gray-300" />
            <span>Payment</span>
          </div>
        </div>
      </div>
    </div>
  )
}