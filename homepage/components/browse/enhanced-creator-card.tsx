"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Star,
  Clock,
  Globe,
  CheckCircle,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Heart,
  Play,
  Pause,
  Volume2,
  VolumeX,
  AlertCircle,
  RefreshCw,
  Eye,
  Share2,
  Calendar,
  Video,
  ImageOff,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"
import { VideoOrderModal } from "@/components/video/VideoOrderModal"

export interface EnhancedCreator {
  id: string
  name: string
  category: string
  avatar: string
  coverImage?: string
  videoPreview?: string
  rating: number
  reviewCount: number
  price: number
  responseTime: string
  languages: string[]
  verified: boolean
  trending?: boolean
  featured?: boolean
  videoCount?: number
  availability?: "available" | "busy" | "offline"
  bio?: string
  specialties?: string[]
  completionRate?: number
  lastActive?: string
}

interface EnhancedCreatorCardProps {
  creator: EnhancedCreator
  variant?: "default" | "compact" | "featured" | "list"
  showStats?: boolean
  interactive?: boolean
  onFavorite?: (id: string) => void
  onShare?: (creator: EnhancedCreator) => void
  onQuickBook?: (id: string) => void
  isFavorited?: boolean
  isComparing?: boolean
  onCompare?: (id: string) => void
  className?: string
  priority?: boolean
}

// Loading skeleton component
export function CreatorCardSkeleton({ 
  variant = "default" 
}: { 
  variant?: "default" | "compact" | "featured" | "list" 
}) {
  if (variant === "list") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex gap-4">
            <Skeleton className="h-32 w-32 rounded-lg" />
            <div className="flex-1 p-4 space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  )
}

// Error state component
export function CreatorCardError({ 
  onRetry,
  onHide 
}: { 
  onRetry?: () => void
  onHide?: () => void 
}) {
  return (
    <Card className="overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="aspect-square w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <ImageOff className="h-12 w-12 text-gray-400" />
      </div>
      <CardContent className="p-4 text-center">
        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Failed to load creator
        </p>
        <div className="flex gap-2 justify-center">
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
          {onHide && (
            <Button variant="ghost" size="sm" onClick={onHide}>
              Hide
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function EnhancedCreatorCard({
  creator,
  variant = "default",
  showStats = true,
  interactive = true,
  onFavorite,
  onShare,
  onQuickBook,
  isFavorited = false,
  isComparing = false,
  onCompare,
  className,
  priority = false
}: EnhancedCreatorCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [videoLoaded, setVideoLoaded] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const { isAuthenticated } = useSupabaseAuth()

  // Auto-play video on hover
  React.useEffect(() => {
    if (isHovered && creator.videoPreview && videoRef.current && videoLoaded) {
      videoRef.current.play().catch(() => {
        // Fallback if autoplay fails
        setIsPlaying(false)
      })
    } else if (!isHovered && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }, [isHovered, creator.videoPreview, videoLoaded])

  const handleVideoToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavorite?.(creator.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onShare?.(creator)
  }

  const handleQuickBook = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      // Redirect to signup with return URL for better conversion
      // Properly encode the full destination URL including query parameters
      const returnUrl = `/fan/creators/${creator.id}?openBooking=true`
      router.push(`/signup?returnTo=${encodeURIComponent(returnUrl)}`)
    } else {
      // Open the booking modal for authenticated users
      setIsBookingModalOpen(true)
      // Still call the callback if provided
      onQuickBook?.(creator.id)
    }
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onCompare?.(creator.id)
  }

  // Error state
  if (hasError) {
    return (
      <CreatorCardError
        onRetry={() => setHasError(false)}
        onHide={() => setHasError(false)}
      />
    )
  }

  // List variant
  if (variant === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200">
        <CardContent className="p-0">
          <div className="flex gap-4">
            {/* Image/Video Section */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <img
                src={creator.coverImage || creator.avatar}
                alt={creator.name}
                className="w-full h-full object-cover rounded-l-lg"
                onError={() => setHasError(true)}
              />
              {creator.verified && (
                <Badge className="absolute top-2 left-2 bg-blue-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {creator.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {creator.bio || creator.category}
                  </p>
                </div>
                <button
                  onClick={handleFavorite}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                >
                  <Heart className={cn(
                    "h-5 w-5",
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
                  )} />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{creator.rating}</span>
                  <span className="text-gray-500">({creator.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{creator.responseTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span>{creator.languages.length} languages</span>
                </div>
                {creator.videoCount && (
                  <div className="flex items-center gap-1">
                    <Video className="h-4 w-4 text-gray-400" />
                    <span>{creator.videoCount} videos</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${creator.price}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={handleQuickBook}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Book Now - ${creator.price}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <Card className="group overflow-hidden hover:shadow-md transition-all duration-200">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={creator.avatar} />
              <AvatarFallback className="bg-purple-600 text-white">
                {creator.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{creator.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {creator.rating}
                </span>
                <span>•</span>
                <span>{creator.category}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-sm">${creator.price}</div>
              <div className="text-xs text-gray-500">{creator.responseTime}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default and Featured variants
  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
        className={className}
      >
        <Card 
          className={cn(
            "group overflow-hidden transition-all duration-300",
            interactive && "cursor-pointer",
            isHovered && "shadow-2xl",
            variant === "featured" && "border-purple-200 dark:border-purple-800 ring-2 ring-purple-500/20",
            isComparing && "ring-2 ring-green-500"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Media Section */}
          <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
            {/* Image */}
            <img
              src={creator.coverImage || creator.avatar}
              alt={creator.name}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-500",
                imageLoaded ? "opacity-100" : "opacity-0",
                isHovered && creator.videoPreview ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setHasError(true)}
              loading={priority ? "eager" : "lazy"}
            />

            {/* Video Preview */}
            {creator.videoPreview && (
              <video
                ref={videoRef}
                src={creator.videoPreview}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                  isHovered && videoLoaded ? "opacity-100" : "opacity-0"
                )}
                muted={isMuted}
                loop
                playsInline
                onLoadedData={() => setVideoLoaded(true)}
              />
            )}

            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {creator.verified && (
                <Badge className="bg-blue-600/90 backdrop-blur">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              {creator.trending && (
                <Badge className="bg-yellow-500/90 backdrop-blur">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {creator.featured && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            {/* Rating Badge */}
            <div className="absolute top-3 right-3">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{creator.rating}</span>
              </div>
            </div>

            {/* Video Controls */}
            {creator.videoPreview && isHovered && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-3 left-3 flex gap-2"
                >
                  <button
                    onClick={handleVideoToggle}
                    className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full hover:bg-white dark:hover:bg-gray-900 transition"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={handleMuteToggle}
                    className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full hover:bg-white dark:hover:bg-gray-900 transition"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Quick Actions (Hover) */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-3 right-3 flex gap-2"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleFavorite}
                        className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full hover:bg-white dark:hover:bg-gray-900 transition"
                      >
                        <Heart className={cn(
                          "h-4 w-4",
                          isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                        )} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isFavorited ? "Remove from favorites" : "Add to favorites"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleShare}
                        className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full hover:bg-white dark:hover:bg-gray-900 transition"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share</p>
                    </TooltipContent>
                  </Tooltip>

                  {onCompare && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleCompare}
                          className={cn(
                            "p-2 backdrop-blur rounded-full transition",
                            isComparing 
                              ? "bg-green-500 text-white" 
                              : "bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900"
                          )}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isComparing ? "Remove from comparison" : "Compare"}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Availability Indicator */}
            {creator.availability && (
              <div className="absolute bottom-3 left-3">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  creator.availability === "available" && "bg-green-500",
                  creator.availability === "busy" && "bg-yellow-500",
                  creator.availability === "offline" && "bg-gray-400"
                )} />
              </div>
            )}
          </div>

          {/* Content Section */}
          <CardContent className="p-4">
            {/* Basic Info */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {creator.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {creator.category.charAt(0).toUpperCase() + creator.category.slice(1)}
                </p>
              </div>
              {creator.completionRate && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="text-xs text-gray-500">
                      {creator.completionRate}% completion
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Order completion rate</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Extended Info (Hover) */}
            <AnimatePresence>
              {isHovered && creator.specialties && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-3 overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1">
                    {creator.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            {showStats && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${creator.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{creator.responseTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{creator.reviewCount} reviews</span>
                  </div>
                  {creator.videoCount && (
                    <span>{creator.videoCount} videos</span>
                  )}
                </div>

                {creator.languages.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Globe className="h-3 w-3" />
                    <span>{creator.languages.join(", ")}</span>
                  </div>
                )}
              </div>
            )}

            {/* Quick Book Button (Hover) */}
            <AnimatePresence>
              {isHovered && onQuickBook && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3"
                >
                  <Button
                    onClick={handleQuickBook}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Video Order Modal */}
      <VideoOrderModal
        creator={{
          id: creator.id,
          name: creator.name,
          avatar: creator.avatar,
          responseTime: creator.responseTime,
          rating: creator.rating,
          price: creator.price
        }}
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
      />
    </TooltipProvider>
  )
}