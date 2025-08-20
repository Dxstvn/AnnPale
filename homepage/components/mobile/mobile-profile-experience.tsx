"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Star,
  MessageSquare,
  Calendar,
  DollarSign,
  Info,
  Heart,
  Clock,
  ChevronUp,
  Filter,
  X,
  User,
  Video,
  Image as ImageIcon,
  Award,
  HelpCircle,
  Users,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useIsMobile } from "@/hooks/use-media-query"
import { toast } from "sonner"

// Mobile Review Tabs Component
export function MobileReviewTabs({
  reviews,
  stats,
  onFilter,
  onLoadMore
}: {
  reviews: any[]
  stats: {
    average: number
    total: number
    distribution: { [key: number]: number }
  }
  onFilter?: (rating: number | null) => void
  onLoadMore?: () => void
}) {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null)
  const [showFilters, setShowFilters] = React.useState(false)
  
  const handleFilter = (rating: number | null) => {
    setSelectedRating(rating)
    onFilter?.(rating)
    setShowFilters(false)
  }
  
  return (
    <div className="space-y-4">
      {/* Compact stats header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.average}</div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.round(stats.average)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Based on {stats.total} reviews
          </p>
          
          {/* Filter dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t"
              >
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedRating === null ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleFilter(null)}
                  >
                    All
                  </Badge>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Badge
                      key={rating}
                      variant={selectedRating === rating ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleFilter(rating)}
                    >
                      {rating} ★ ({stats.distribution[rating] || 0})
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {/* Review tabs */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="helpful">Helpful</TabsTrigger>
          <TabsTrigger value="photos">With Photos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-3">
          {reviews.slice(0, 5).map((review) => (
            <MobileReviewCard key={review.id} review={review} />
          ))}
        </TabsContent>
        
        <TabsContent value="helpful" className="space-y-3">
          {reviews
            .filter(r => r.helpful > 5)
            .slice(0, 5)
            .map((review) => (
              <MobileReviewCard key={review.id} review={review} />
            ))}
        </TabsContent>
        
        <TabsContent value="photos" className="space-y-3">
          {reviews
            .filter(r => r.media && r.media.length > 0)
            .slice(0, 5)
            .map((review) => (
              <MobileReviewCard key={review.id} review={review} />
            ))}
        </TabsContent>
      </Tabs>
      
      {/* Load more button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={onLoadMore}
      >
        Load More Reviews
      </Button>
    </div>
  )
}

// Mobile Review Card
function MobileReviewCard({ review }: { review: any }) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const maxLength = 150
  const shouldTruncate = review.content.length > maxLength
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{review.author}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < review.rating
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-500">{review.date}</span>
        </div>
        
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {shouldTruncate && !isExpanded
            ? `${review.content.slice(0, maxLength)}...`
            : review.content}
        </p>
        
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-purple-600 font-medium mt-1"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
        
        {review.media && review.media.length > 0 && (
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {review.media.map((media: any, index: number) => (
              <img
                key={index}
                src={media}
                alt={`Review media ${index + 1}`}
                className="h-16 w-16 rounded object-cover flex-shrink-0"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Sticky Mobile Booking Bar
export function StickyMobileBookingBar({
  price,
  originalPrice,
  discount,
  availability,
  onBook,
  show = true
}: {
  price: number
  originalPrice?: number
  discount?: number
  availability: "available" | "limited" | "busy" | "unavailable"
  onBook: () => void
  show?: boolean
}) {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [0, 1])
  const translateY = useTransform(scrollY, [0, 100], [100, 0])
  
  if (!show) return null
  
  const availabilityConfig = {
    available: { color: "bg-green-500", text: "Available" },
    limited: { color: "bg-yellow-500", text: "Limited Spots" },
    busy: { color: "bg-orange-500", text: "Almost Full" },
    unavailable: { color: "bg-red-500", text: "Unavailable" }
  }
  
  const config = availabilityConfig[availability]
  
  return (
    <motion.div
      style={{ opacity, y: translateY }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t shadow-lg"
    >
      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", config.color)} />
              <span className="text-xs font-medium">{config.text}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              {originalPrice && originalPrice > price && (
                <span className="text-sm line-through text-gray-400">
                  ${originalPrice}
                </span>
              )}
              <span className="text-xl font-bold">${price}</span>
              {discount && (
                <Badge className="bg-red-500 text-white text-xs">
                  -{discount}%
                </Badge>
              )}
            </div>
          </div>
          <Button
            onClick={onBook}
            disabled={availability === "unavailable"}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Now
          </Button>
        </div>
        
        {availability === "limited" && (
          <p className="text-xs text-orange-600 mt-2 text-center">
            ⚡ Only a few spots left - Book soon!
          </p>
        )}
      </div>
    </motion.div>
  )
}

// Mobile Navigation Accordion
export function MobileNavigationAccordion({
  sections,
  activeSection,
  onSectionChange
}: {
  sections: Array<{
    id: string
    title: string
    icon: React.ElementType
    content: React.ReactNode
    badge?: string
  }>
  activeSection: string
  onSectionChange: (section: string) => void
}) {
  return (
    <Accordion
      type="single"
      collapsible
      value={activeSection}
      onValueChange={onSectionChange}
      className="w-full"
    >
      {sections.map((section) => {
        const Icon = section.icon
        return (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{section.title}</span>
                </div>
                {section.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {section.badge}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                {section.content}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

// Touch Gesture Handler Hook
export function useTouchGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onLongPress,
  onDoubleTap
}: {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onLongPress?: () => void
  onDoubleTap?: () => void
}) {
  const [touchStart, setTouchStart] = React.useState({ x: 0, y: 0, time: 0 })
  const [lastTap, setLastTap] = React.useState(0)
  const longPressTimer = React.useRef<NodeJS.Timeout>()
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY, time: Date.now() })
    
    // Long press detection
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress()
      }, 500)
    }
    
    // Double tap detection
    const now = Date.now()
    if (onDoubleTap && now - lastTap < 300) {
      onDoubleTap()
    }
    setLastTap(now)
  }
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    clearTimeout(longPressTimer.current)
    
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const deltaTime = Date.now() - touchStart.time
    
    // Swipe detection (min 50px movement in < 300ms)
    if (deltaTime < 300) {
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      }
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          onSwipeDown?.()
        } else {
          onSwipeUp?.()
        }
      }
    }
  }
  
  const handleTouchMove = () => {
    clearTimeout(longPressTimer.current)
  }
  
  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove
  }
}

// Mobile Performance Optimizations Component
export function MobilePerformanceWrapper({
  children,
  enableLazyLoad = true,
  enableImageOptimization = true,
  enableOfflineCache = true
}: {
  children: React.ReactNode
  enableLazyLoad?: boolean
  enableImageOptimization?: boolean
  enableOfflineCache?: boolean
}) {
  React.useEffect(() => {
    // Register service worker for offline caching
    if (enableOfflineCache && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error)
    }
    
    // Lazy load images
    if (enableLazyLoad && "IntersectionObserver" in window) {
      const images = document.querySelectorAll("img[data-src]")
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src || ""
            img.removeAttribute("data-src")
            imageObserver.unobserve(img)
          }
        })
      })
      
      images.forEach((img) => imageObserver.observe(img))
      
      return () => {
        images.forEach((img) => imageObserver.unobserve(img))
      }
    }
  }, [enableLazyLoad, enableOfflineCache])
  
  return <>{children}</>
}

// Pull to Refresh Component
export function PullToRefresh({
  onRefresh,
  children
}: {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [pullDistance, setPullDistance] = React.useState(0)
  const touchStart = React.useRef(0)
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    if (scrollTop === 0) {
      const touchY = e.touches[0].clientY
      const distance = touchY - touchStart.current
      if (distance > 0) {
        setPullDistance(Math.min(distance, 100))
      }
    }
  }
  
  const handleTouchEnd = async () => {
    if (pullDistance > 50) {
      setIsRefreshing(true)
      await onRefresh()
      setIsRefreshing(false)
    }
    setPullDistance(0)
  }
  
  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: pullDistance }}
            exit={{ height: 0 }}
            className="flex items-center justify-center bg-purple-50 dark:bg-purple-900/20"
          >
            {isRefreshing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent" />
            ) : (
              <ChevronUp
                className={cn(
                  "h-6 w-6 text-purple-600 transition-transform",
                  pullDistance > 50 && "rotate-180"
                )}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  )
}

// Mobile Quick Actions Float Button
export function MobileQuickActions({
  actions
}: {
  actions: Array<{
    icon: React.ElementType
    label: string
    action: () => void
    badge?: string | number
  }>
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return (
    <div className="fixed bottom-20 right-4 z-30">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-14 right-0 space-y-2"
          >
            {actions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    action.action()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{action.label}</span>
                  {action.badge && (
                    <Badge className="text-xs">
                      {action.badge}
                    </Badge>
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg transition-transform",
          isOpen && "rotate-45"
        )}
      >
        <Zap className="h-6 w-6" />
      </button>
    </div>
  )
}