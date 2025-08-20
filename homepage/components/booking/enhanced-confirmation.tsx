"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  CheckCircle2,
  Copy,
  Share2,
  Facebook,
  Twitter,
  Mail,
  MessageCircle,
  Download,
  Calendar,
  Clock,
  User,
  Video,
  Gift,
  Heart,
  Star,
  TrendingUp,
  ArrowRight,
  Sparkles,
  PartyPopper,
  Bell,
  Smartphone,
  ChevronRight,
  Trophy,
  Users,
  Zap,
  ShoppingCart,
  Percent,
  Timer,
  Camera,
  Send,
  Eye,
  ThumbsUp,
  Award,
  Rocket
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import confetti from "canvas-confetti"

// Timeline step interface
interface TimelineStep {
  id: string
  title: string
  description: string
  icon: React.ElementType
  status: "completed" | "current" | "pending"
  estimatedTime?: string
  timestamp?: Date
}

// Notification interface
interface Notification {
  id: string
  type: "email" | "sms" | "push" | "in-app"
  title: string
  message: string
  timing: string
  sent?: boolean
}

// Share button component
const ShareButton = ({ 
  platform, 
  icon: Icon, 
  color,
  onClick 
}: {
  platform: string
  icon: React.ElementType
  color: string
  onClick: () => void
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg transition-all",
        "hover:shadow-md",
        color
      )}
    >
      <Icon className="h-5 w-5 text-white" />
    </motion.button>
  )
}

// Animated success animation
const SuccessAnimation = ({ onComplete }: { onComplete?: () => void }) => {
  React.useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    // Complete animation after delay
    const timer = setTimeout(() => {
      onComplete?.()
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [onComplete])
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-gray-900/90"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1 }}
        className="relative"
      >
        <div className="h-32 w-32 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center">
          <CheckCircle2 className="h-20 w-20 text-white" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.5 }}
          className="absolute -top-4 -right-4"
        >
          <PartyPopper className="h-12 w-12 text-yellow-500" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Upsell card component
const UpsellCard = ({ 
  title, 
  description, 
  discount, 
  icon: Icon,
  onAction 
}: {
  title: string
  description: string
  discount: string
  icon: React.ElementType
  onAction: () => void
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
          <Icon className="h-5 w-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {description}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {discount}
            </Badge>
            <Button size="sm" onClick={onAction}>
              Book Now
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface OrderDetails {
  orderNumber: string
  creatorName: string
  creatorImage?: string
  recipientName: string
  occasion: string
  price: number
  deliveryTime: string
  createdAt: Date
}

interface EnhancedConfirmationProps {
  orderDetails: OrderDetails
  onShare?: (platform: string) => void
  onDownloadReceipt?: () => void
  onBookAnother?: () => void
  onViewProgress?: () => void
  showAnimation?: boolean
}

export function EnhancedConfirmation({
  orderDetails,
  onShare,
  onDownloadReceipt,
  onBookAnother,
  onViewProgress,
  showAnimation = true
}: EnhancedConfirmationProps) {
  const [showSuccess, setShowSuccess] = React.useState(showAnimation)
  const [copied, setCopied] = React.useState(false)
  const [emailForUpdates, setEmailForUpdates] = React.useState("")
  const [phoneForSMS, setPhoneForSMS] = React.useState("")
  const [notificationsEnabled, setNotificationsEnabled] = React.useState({
    email: true,
    sms: false,
    push: false
  })
  
  // Timeline steps
  const timelineSteps: TimelineStep[] = [
    {
      id: "order_placed",
      title: "Order Placed",
      description: "Your request has been received",
      icon: CheckCircle2,
      status: "completed",
      timestamp: orderDetails.createdAt
    },
    {
      id: "creator_notified",
      title: "Creator Notified",
      description: `${orderDetails.creatorName} has been notified`,
      icon: Bell,
      status: "current",
      estimatedTime: "Within 1 hour",
      timestamp: new Date(Date.now() + 3600000)
    },
    {
      id: "video_creation",
      title: "Video Creation",
      description: "Your video is being recorded",
      icon: Camera,
      status: "pending",
      estimatedTime: `Within ${orderDetails.deliveryTime}`
    },
    {
      id: "video_review",
      title: "Quality Review",
      description: "Ensuring everything is perfect",
      icon: Eye,
      status: "pending",
      estimatedTime: "30 minutes"
    },
    {
      id: "delivery",
      title: "Delivered!",
      description: "Your video is ready to view",
      icon: Rocket,
      status: "pending",
      estimatedTime: orderDetails.deliveryTime
    }
  ]
  
  // Notifications schedule
  const notifications: Notification[] = [
    {
      id: "order_confirm",
      type: "email",
      title: "Order Confirmation",
      message: "Your order has been confirmed",
      timing: "Immediate",
      sent: true
    },
    {
      id: "creator_accept",
      type: "push",
      title: "Creator Accepted",
      message: `${orderDetails.creatorName} accepted your request`,
      timing: "1-2 hours"
    },
    {
      id: "production_start",
      type: "email",
      title: "Production Started",
      message: "Your video is being created",
      timing: "Within 24 hours"
    },
    {
      id: "video_ready",
      type: "email",
      title: "Video Ready!",
      message: "Your video is ready to view",
      timing: orderDetails.deliveryTime
    }
  ]
  
  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderDetails.orderNumber)
    setCopied(true)
    toast.success("Order number copied!")
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleShare = (platform: string) => {
    const shareText = `I just booked a personalized video from ${orderDetails.creatorName} on Ann Pale! 🎉`
    const shareUrl = `https://annpale.com/order/${orderDetails.orderNumber}`
    
    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)
        break
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`)
        break
      case "email":
        window.location.href = `mailto:?subject=Check out my Ann Pale order!&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`
        break
    }
    
    onShare?.(platform)
    toast.success(`Shared on ${platform}!`)
  }
  
  const enableNotifications = (type: "email" | "sms" | "push") => {
    setNotificationsEnabled(prev => ({ ...prev, [type]: true }))
    toast.success(`${type === "sms" ? "SMS" : type.charAt(0).toUpperCase() + type.slice(1)} notifications enabled!`)
  }
  
  return (
    <>
      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessAnimation onComplete={() => setShowSuccess(false)} />
        )}
      </AnimatePresence>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mb-4"
          >
            <CheckCircle2 className="h-12 w-12 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-2">Your Order is Confirmed! 🎉</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {orderDetails.creatorName} will create something amazing for {orderDetails.recipientName}
          </p>
          
          {/* Order Number */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-600">Order #</span>
            <span className="font-mono font-bold">{orderDetails.orderNumber}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyOrderNumber}
              className="h-6 w-6 p-0"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
        
        {/* Timeline Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-purple-600" />
              Order Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700" />
              
              {/* Timeline Steps */}
              <div className="space-y-6">
                {timelineSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start gap-4"
                  >
                    {/* Step Icon */}
                    <div className={cn(
                      "relative z-10 h-10 w-10 rounded-full flex items-center justify-center",
                      step.status === "completed" && "bg-green-100 dark:bg-green-900/30",
                      step.status === "current" && "bg-blue-100 dark:bg-blue-900/30 ring-4 ring-blue-200 dark:ring-blue-800",
                      step.status === "pending" && "bg-gray-100 dark:bg-gray-800"
                    )}>
                      <step.icon className={cn(
                        "h-5 w-5",
                        step.status === "completed" && "text-green-600",
                        step.status === "current" && "text-blue-600",
                        step.status === "pending" && "text-gray-400"
                      )} />
                      {step.status === "current" && (
                        <span className="absolute -top-1 -right-1 h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                        </span>
                      )}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn(
                          "font-semibold",
                          step.status === "pending" && "text-gray-400"
                        )}>
                          {step.title}
                        </h4>
                        {step.status === "completed" && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            Completed
                          </Badge>
                        )}
                        {step.status === "current" && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                            In Progress
                          </Badge>
                        )}
                      </div>
                      <p className={cn(
                        "text-sm",
                        step.status === "pending" ? "text-gray-400" : "text-gray-600 dark:text-gray-400"
                      )}>
                        {step.description}
                      </p>
                      {step.estimatedTime && step.status !== "completed" && (
                        <p className="text-xs text-gray-500 mt-1">
                          {step.estimatedTime}
                        </p>
                      )}
                      {step.timestamp && step.status === "completed" && (
                        <p className="text-xs text-gray-500 mt-1">
                          {step.timestamp.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-medium">40%</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        {/* Next Steps & Notifications */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Creator gets notified</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {orderDetails.creatorName} will receive your request immediately
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Video creation begins</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your personalized video will be created with care
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Delivery notification</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You'll be notified as soon as it's ready!
                    </p>
                  </div>
                </div>
              </div>
              
              {onViewProgress && (
                <Button className="w-full" variant="outline" onClick={onViewProgress}>
                  <Eye className="h-4 w-4 mr-2" />
                  Track Progress
                </Button>
              )}
            </CardContent>
          </Card>
          
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-600" />
                Stay Updated
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We'll keep you posted on your order progress:
              </p>
              
              {/* Email Updates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Email Updates</span>
                  </div>
                  {notificationsEnabled.email ? (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Enabled
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => enableNotifications("email")}>
                      Enable
                    </Button>
                  )}
                </div>
                {!notificationsEnabled.email && (
                  <Input
                    type="email"
                    placeholder="Enter email for updates"
                    value={emailForUpdates}
                    onChange={(e) => setEmailForUpdates(e.target.value)}
                    className="text-sm"
                  />
                )}
              </div>
              
              {/* SMS Updates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">SMS Updates</span>
                  </div>
                  {notificationsEnabled.sms ? (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Enabled
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => enableNotifications("sms")}>
                      Enable
                    </Button>
                  )}
                </div>
                {!notificationsEnabled.sms && (
                  <Input
                    type="tel"
                    placeholder="Enter phone for SMS"
                    value={phoneForSMS}
                    onChange={(e) => setPhoneForSMS(e.target.value)}
                    className="text-sm"
                  />
                )}
              </div>
              
              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Push Notifications</span>
                </div>
                {notificationsEnabled.push ? (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    Enabled
                  </Badge>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => enableNotifications("push")}>
                    Enable
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Share Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-600" />
              Share Your Excitement!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-gray-600 dark:text-gray-400">
                Let your friends know about your amazing order!
              </p>
              <div className="flex items-center gap-2">
                <ShareButton
                  platform="facebook"
                  icon={Facebook}
                  color="bg-blue-600"
                  onClick={() => handleShare("facebook")}
                />
                <ShareButton
                  platform="twitter"
                  icon={Twitter}
                  color="bg-sky-500"
                  onClick={() => handleShare("twitter")}
                />
                <ShareButton
                  platform="whatsapp"
                  icon={MessageCircle}
                  color="bg-green-600"
                  onClick={() => handleShare("whatsapp")}
                />
                <ShareButton
                  platform="email"
                  icon={Mail}
                  color="bg-gray-600"
                  onClick={() => handleShare("email")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Upsell Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-600" />
            Complete Your Collection
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <UpsellCard
              title="Book Another Video"
              description="Get 20% off your next order when you book today!"
              discount="Save 20%"
              icon={Video}
              onAction={() => {
                onBookAnother?.()
                toast.success("Discount applied to your next order!")
              }}
            />
            
            <UpsellCard
              title="Gift a Friend"
              description="Send a video gift to someone special"
              discount="Save $10"
              icon={Gift}
              onAction={() => {
                toast.success("Gift option selected!")
              }}
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onDownloadReceipt}>
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email Receipt
            </Button>
          </div>
          
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={onBookAnother}
          >
            Book Another Video
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </>
  )
}