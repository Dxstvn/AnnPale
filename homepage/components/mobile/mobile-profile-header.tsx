"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  Clock,
  MapPin,
  Languages,
  Heart,
  Share2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Calendar,
  MessageSquare,
  CheckCircle,
  Shield,
  TrendingUp,
  Users,
  Video
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/hooks/use-media-query"
import type { ProfileHeroData } from "@/components/profile/profile-hero"

interface MobileProfileHeaderProps {
  data: ProfileHeroData
  onBook: () => void
  onFollow?: () => void
  onShare?: () => void
  onMessage?: () => void
  className?: string
}

// Verification level icons
const verificationIcons = {
  identity: Shield,
  platform: CheckCircle,
  celebrity: Star,
  elite: TrendingUp
}

// Compact stats bar
function MobileStatsBar({
  rating,
  reviews,
  videos,
  responseTime
}: {
  rating: number
  reviews: number
  videos: number
  responseTime: number
}) {
  return (
    <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <div className="flex items-center justify-center gap-1">
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
          <span className="text-sm font-bold">{rating}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">Rating</p>
      </div>
      <div className="text-center">
        <div className="text-sm font-bold">{reviews}+</div>
        <p className="text-xs text-gray-500 mt-0.5">Reviews</p>
      </div>
      <div className="text-center">
        <div className="text-sm font-bold">{videos}+</div>
        <p className="text-xs text-gray-500 mt-0.5">Videos</p>
      </div>
      <div className="text-center">
        <div className="text-sm font-bold">{responseTime}h</div>
        <p className="text-xs text-gray-500 mt-0.5">Response</p>
      </div>
    </div>
  )
}

// Expandable bio section
function ExpandableBio({
  bio,
  tagline
}: {
  bio: string
  tagline: string
}) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const maxLength = 100
  const shouldTruncate = bio.length > maxLength
  
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {tagline}
      </p>
      <div className="relative">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {shouldTruncate && !isExpanded ? `${bio.slice(0, maxLength)}...` : bio}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-purple-600 font-medium mt-1 flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                Show less
                <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Read more
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// Quick info pills
function QuickInfoPills({
  location,
  languages,
  category
}: {
  location?: string
  languages: string[]
  category: string
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary" className="text-xs">
        {category}
      </Badge>
      {location && (
        <Badge variant="outline" className="text-xs">
          <MapPin className="h-3 w-3 mr-1" />
          {location}
        </Badge>
      )}
      {languages.length > 0 && (
        <Badge variant="outline" className="text-xs">
          <Languages className="h-3 w-3 mr-1" />
          {languages.length} languages
        </Badge>
      )}
    </div>
  )
}

// Mobile action buttons
function MobileActions({
  price,
  originalPrice,
  discount,
  onBook,
  onFollow,
  onShare,
  onMessage
}: {
  price: number
  originalPrice?: number
  discount?: number
  onBook: () => void
  onFollow?: () => void
  onShare?: () => void
  onMessage?: () => void
}) {
  const [showMore, setShowMore] = React.useState(false)
  
  return (
    <div className="space-y-3">
      {/* Primary CTA */}
      <Button
        onClick={onBook}
        size="lg"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Book Now
        <div className="ml-auto flex items-center gap-2">
          {originalPrice && originalPrice > price && (
            <span className="text-xs line-through opacity-75">
              ${originalPrice}
            </span>
          )}
          <span className="font-bold">${price}</span>
        </div>
      </Button>
      
      {/* Secondary actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onFollow}
          className="flex-1"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Follow</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onMessage}
          className="flex-1"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Message</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMore(!showMore)}
          className="flex-1"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </div>
      
      {/* More options */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Discount badge */}
      {discount && (
        <div className="text-center">
          <Badge className="bg-red-500 text-white">
            Save {discount}% Today!
          </Badge>
        </div>
      )}
    </div>
  )
}

// Intro video player (mobile optimized)
function MobileIntroVideo({
  videoUrl,
  thumbnail,
  name
}: {
  videoUrl?: string
  thumbnail?: string
  name: string
}) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  
  if (!videoUrl) return null
  
  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
      {!isPlaying ? (
        <>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={`${name} intro`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600" />
          )}
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/30"
          >
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Video className="h-8 w-8 text-purple-600 ml-1" />
            </div>
          </button>
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-black/50 text-white">
              <Video className="h-3 w-3 mr-1" />
              Intro Video
            </Badge>
          </div>
        </>
      ) : (
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-full"
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </div>
  )
}

// Main mobile profile header component
export function MobileProfileHeader({
  data,
  onBook,
  onFollow,
  onShare,
  onMessage,
  className
}: MobileProfileHeaderProps) {
  const isMobile = useIsMobile()
  
  // Only render mobile version on mobile devices
  if (!isMobile) {
    return null
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Cover image with overlay */}
      <div className="relative h-48 -mx-4 -mt-4">
        {data.coverImage ? (
          <img
            src={data.coverImage}
            alt={`${data.name} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Profile photo overlay */}
        <div className="absolute bottom-4 left-4 flex items-end gap-3">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
            <AvatarImage src={data.profilePhoto} alt={data.name} />
            <AvatarFallback>{data.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="text-white mb-2">
            <h1 className="text-xl font-bold">{data.name}</h1>
            <div className="flex items-center gap-2">
              {data.verificationLevels?.map((level) => {
                const Icon = verificationIcons[level]
                return (
                  <Icon key={level} className="h-4 w-4" />
                )
              })}
              {data.isOnline && (
                <Badge className="bg-green-500 text-white text-xs">
                  Online
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content card */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Quick info pills */}
          <QuickInfoPills
            location={data.location}
            languages={data.languages}
            category={data.category}
          />
          
          {/* Stats bar */}
          <MobileStatsBar
            rating={data.rating}
            reviews={data.reviewCount}
            videos={data.videosDelivered}
            responseTime={data.responseTime}
          />
          
          {/* Bio section */}
          <ExpandableBio
            bio={data.bio}
            tagline={data.tagline}
          />
          
          {/* Intro video */}
          {data.introVideo && (
            <MobileIntroVideo
              videoUrl={data.introVideo}
              thumbnail={data.profilePhoto}
              name={data.name}
            />
          )}
          
          {/* Action buttons */}
          <MobileActions
            price={data.price}
            originalPrice={data.originalPrice}
            discount={data.discount}
            onBook={onBook}
            onFollow={onFollow}
            onShare={onShare}
            onMessage={onMessage}
          />
        </CardContent>
      </Card>
    </div>
  )
}