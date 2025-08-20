"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Gift,
  Clock,
  Percent,
  Mail,
  Star,
  TrendingUp,
  Users,
  Heart,
  Calendar,
  Zap,
  ChevronRight,
  X,
  Bell,
  DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Exit intent data types
export interface ExitIntentData {
  creatorName: string
  creatorImage?: string
  offer: {
    type: "discount" | "free_preview" | "waitlist" | "newsletter" | "limited_time"
    title: string
    description: string
    value?: string // e.g., "20% OFF", "FREE", etc.
    validUntil?: Date
  }
  benefits?: string[]
  testimonial?: {
    text: string
    author: string
    rating: number
  }
  stats?: {
    activeOffers?: number
    peopleWaiting?: number
    spotsRemaining?: number
  }
}

interface ExitIntentModalProps {
  data: ExitIntentData
  onAccept: (email?: string) => void
  onDecline: () => void
  onClose: () => void
  triggerDelay?: number // ms to wait before showing
  className?: string
  variant?: "discount" | "preview" | "waitlist" | "value" | "urgency"
}

// Offer type icons
const offerIcons = {
  discount: Percent,
  free_preview: Gift,
  waitlist: Clock,
  newsletter: Mail,
  limited_time: Zap
}

// Discount offer modal
function DiscountOffer({
  data,
  onAccept,
  onDecline
}: {
  data: ExitIntentData
  onAccept: (email?: string) => void
  onDecline: () => void
}) {
  const [email, setEmail] = React.useState("")
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      onAccept(email)
      toast.success("Discount code sent to your email!")
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Offer badge */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="inline-block"
        >
          <Badge className="text-2xl px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            {data.offer.value || "SPECIAL OFFER"}
          </Badge>
        </motion.div>
      </div>
      
      {/* Offer details */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">{data.offer.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{data.offer.description}</p>
        
        {data.offer.validUntil && (
          <div className="flex items-center justify-center gap-2 text-sm text-orange-600">
            <Clock className="h-4 w-4" />
            <span>Valid for {Math.ceil((data.offer.validUntil.getTime() - Date.now()) / (1000 * 60 * 60))} hours</span>
          </div>
        )}
      </div>
      
      {/* Benefits */}
      {data.benefits && data.benefits.length > 0 && (
        <div className="space-y-2">
          {data.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <ChevronRight className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Email form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-center"
        />
        <div className="flex gap-2">
          <Button 
            type="submit"
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Get My Discount
            <DollarSign className="h-4 w-4 ml-1" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onDecline}
            className="text-gray-500"
          >
            No Thanks
          </Button>
        </div>
      </form>
      
      <p className="text-xs text-center text-gray-500">
        No spam, unsubscribe anytime. Discount applied automatically at checkout.
      </p>
    </div>
  )
}

// Free preview offer
function PreviewOffer({
  data,
  onAccept,
  onDecline
}: {
  data: ExitIntentData
  onAccept: () => void
  onDecline: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Visual header */}
      <div className="relative h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Gift className="h-16 w-16 text-white/20" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-sm font-medium">Exclusive Offer</p>
            <p className="text-2xl font-bold">FREE PREVIEW</p>
          </div>
        </div>
      </div>
      
      {/* Offer details */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold">{data.offer.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{data.offer.description}</p>
      </div>
      
      {/* Creator info */}
      {data.creatorImage && (
        <div className="flex items-center justify-center">
          <img
            src={data.creatorImage}
            alt={data.creatorName}
            className="h-20 w-20 rounded-full border-4 border-purple-200"
          />
        </div>
      )}
      
      {/* Testimonial */}
      {data.testimonial && (
        <Card className="p-4 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < data.testimonial!.rating
                      ? "text-yellow-500 fill-current"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <p className="text-sm italic">"{data.testimonial.text}"</p>
            <p className="text-xs text-gray-500">- {data.testimonial.author}</p>
          </div>
        </Card>
      )}
      
      {/* Actions */}
      <div className="space-y-2">
        <Button
          onClick={onAccept}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
        >
          Get Free Preview
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        <Button
          variant="ghost"
          onClick={onDecline}
          className="w-full text-gray-500"
        >
          Maybe Later
        </Button>
      </div>
    </div>
  )
}

// Waitlist offer
function WaitlistOffer({
  data,
  onAccept,
  onDecline
}: {
  data: ExitIntentData
  onAccept: (email?: string) => void
  onDecline: () => void
}) {
  const [email, setEmail] = React.useState("")
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      onAccept(email)
      toast.success("You're on the waitlist!")
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Stats */}
      {data.stats && (
        <div className="grid grid-cols-3 gap-4">
          {data.stats.activeOffers && (
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {data.stats.activeOffers}
              </div>
              <p className="text-xs text-gray-500">Active Offers</p>
            </div>
          )}
          {data.stats.peopleWaiting && (
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {data.stats.peopleWaiting}
              </div>
              <p className="text-xs text-gray-500">People Waiting</p>
            </div>
          )}
          {data.stats.spotsRemaining && (
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {data.stats.spotsRemaining}
              </div>
              <p className="text-xs text-gray-500">Spots Left</p>
            </div>
          )}
        </div>
      )}
      
      {/* Offer details */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
          <Bell className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold">{data.offer.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{data.offer.description}</p>
      </div>
      
      {/* Benefits */}
      {data.benefits && data.benefits.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Waitlist Benefits:</p>
          <div className="space-y-1">
            {data.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2">
                <ChevronRight className="h-3 w-3 text-purple-600 mt-0.5" />
                <span className="text-xs">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Email form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Enter your email for priority access"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
        >
          Join Waitlist
          <Clock className="h-4 w-4 ml-1" />
        </Button>
      </form>
      
      <button
        onClick={onDecline}
        className="w-full text-xs text-gray-500 hover:text-gray-700"
      >
        No thanks, I'll check back later
      </button>
    </div>
  )
}

// Value proposition offer
function ValueOffer({
  data,
  onAccept,
  onDecline
}: {
  data: ExitIntentData
  onAccept: () => void
  onDecline: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Creator highlight */}
      <div className="text-center space-y-3">
        {data.creatorImage && (
          <img
            src={data.creatorImage}
            alt={data.creatorName}
            className="h-24 w-24 rounded-full mx-auto border-4 border-purple-200"
          />
        )}
        <div>
          <h3 className="text-xl font-bold">Don't Miss Out!</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {data.creatorName} has something special for you
          </p>
        </div>
      </div>
      
      {/* Value props */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 text-center">
          <Users className="h-6 w-6 text-purple-600 mx-auto mb-1" />
          <p className="text-xs font-medium">Exclusive Content</p>
        </Card>
        <Card className="p-3 text-center">
          <Heart className="h-6 w-6 text-pink-600 mx-auto mb-1" />
          <p className="text-xs font-medium">Personal Touch</p>
        </Card>
        <Card className="p-3 text-center">
          <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
          <p className="text-xs font-medium">5-Star Reviews</p>
        </Card>
        <Card className="p-3 text-center">
          <Zap className="h-6 w-6 text-orange-600 mx-auto mb-1" />
          <p className="text-xs font-medium">Fast Delivery</p>
        </Card>
      </div>
      
      {/* Offer */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
        <h4 className="font-bold text-center mb-2">{data.offer.title}</h4>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          {data.offer.description}
        </p>
      </div>
      
      {/* Actions */}
      <div className="space-y-2">
        <Button
          onClick={onAccept}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
        >
          Yes, Show Me More
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        <button
          onClick={onDecline}
          className="w-full text-xs text-gray-500 hover:text-gray-700"
        >
          No thanks
        </button>
      </div>
    </div>
  )
}

// Main exit intent modal component
export function ExitIntentModal({
  data,
  onAccept,
  onDecline,
  onClose,
  triggerDelay = 1000,
  className,
  variant
}: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hasShown, setHasShown] = React.useState(false)
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  
  // Determine variant based on offer type if not specified
  const modalVariant = variant || (
    data.offer.type === "discount" ? "discount" :
    data.offer.type === "free_preview" ? "preview" :
    data.offer.type === "waitlist" ? "waitlist" :
    "value"
  )
  
  React.useEffect(() => {
    if (hasShown) return
    
    let exitTimer: NodeJS.Timeout
    let intentDetected = false
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Detect exit intent (mouse moving towards top of screen)
      if (!intentDetected && e.clientY <= 20 && e.clientX >= 100) {
        intentDetected = true
        exitTimer = setTimeout(() => {
          if (!hasShown) {
            setIsOpen(true)
            setHasShown(true)
          }
        }, triggerDelay)
      }
    }
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Alternative trigger: mouse leaving viewport
      if (!hasShown && e.clientY <= 0) {
        setIsOpen(true)
        setHasShown(true)
      }
    }
    
    // Mobile: trigger on back button or after scroll
    const handlePopState = () => {
      if (!hasShown) {
        setIsOpen(true)
        setHasShown(true)
      }
    }
    
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("popstate", handlePopState)
    
    // Alternative trigger: time-based (30 seconds)
    const timeoutTrigger = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true)
        setHasShown(true)
      }
    }, 30000)
    
    return () => {
      clearTimeout(exitTimer)
      clearTimeout(timeoutTrigger)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [hasShown, triggerDelay])
  
  const handleAccept = (email?: string) => {
    setIsOpen(false)
    onAccept(email)
  }
  
  const handleDecline = () => {
    setIsOpen(false)
    onDecline()
    
    // Don't show again for 24 hours
    localStorage.setItem('exitIntentDeclined', Date.now().toString())
  }
  
  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={cn("max-w-md", className)}>
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={modalVariant}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {modalVariant === "discount" && (
              <DiscountOffer
                data={data}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            )}
            {modalVariant === "preview" && (
              <PreviewOffer
                data={data}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            )}
            {modalVariant === "waitlist" && (
              <WaitlistOffer
                data={data}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            )}
            {modalVariant === "value" && (
              <ValueOffer
                data={data}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}