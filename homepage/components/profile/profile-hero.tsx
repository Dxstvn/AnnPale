"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  Clock,
  Globe,
  MapPin,
  Heart,
  Share2,
  Play,
  Calendar,
  DollarSign,
  MessageSquare,
  CheckCircle,
  Shield,
  TrendingUp,
  ChevronDown,
  Video
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { VerificationBadge, CompositeVerification } from "@/components/trust/verification-badges"
import { RatingDisplay } from "@/components/trust/rating-reviews"
import { ResponseIndicator } from "@/components/trust/response-indicators"
import type { VerificationLevel } from "@/components/trust/verification-badges"
import type { ResponseTimeData } from "@/components/trust/response-indicators"

export interface ProfileHeroData {
  // Basic info
  id: string
  name: string
  category: string
  tagline?: string
  bio?: string
  
  // Media
  profilePhoto: string
  coverImage?: string
  introVideo?: string
  
  // Pricing
  price: number
  originalPrice?: number
  discount?: number
  
  // Ratings & Reviews
  rating: number
  reviewCount: number
  
  // Response
  responseTime: number
  responseRate: number
  isOnline?: boolean
  
  // Verification
  verificationLevels: VerificationLevel[]
  
  // Location & Languages
  location?: string
  timezone?: string
  languages: string[]
  
  // Stats
  videosDelivered: number
  memberSince: Date
  completionRate: number
  repeatCustomers?: number
  
  // Social
  followers?: number
  following?: boolean
  socialLinks?: {
    instagram?: string
    twitter?: string
    facebook?: string
    youtube?: string
  }
}

interface ProfileHeroProps {
  data: ProfileHeroData
  onBook?: () => void
  onFollow?: () => void
  onShare?: () => void
  onMessage?: () => void
  className?: string
}

export function ProfileHero({
  data,
  onBook,
  onFollow,
  onShare,
  onMessage,
  className
}: ProfileHeroProps) {
  const [isFollowing, setIsFollowing] = React.useState(data.following || false)
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [showVideo, setShowVideo] = React.useState(false)
  
  // Parallax effect for cover image
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, 100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5])

  const hasDiscount = data.discount && data.originalPrice
  const responseData: ResponseTimeData = {
    averageTime: data.responseTime,
    fastestTime: data.responseTime * 0.7,
    responseRate: data.responseRate,
    isOnline: data.isOnline
  }

  return (
    <div className={cn("relative", className)}>
      {/* Hero Section with Cover Image */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-br from-purple-900 to-pink-900">
        {data.coverImage ? (
          <motion.div
            style={{ y, opacity }}
            className="absolute inset-0"
          >
            <Image
              src={data.coverImage}
              alt={`${data.name} cover`}
              fill
              className={cn(
                "object-cover transition-opacity duration-700",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              priority
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Play button for intro video */}
        {data.introVideo && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            onClick={() => setShowVideo(true)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-white/90 backdrop-blur rounded-full hover:bg-white transition group"
          >
            <Play className="h-8 w-8 text-purple-600 fill-current group-hover:scale-110 transition" />
          </motion.button>
        )}

        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => window.history.back()}
          >
            ← Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => {
                setIsFollowing(!isFollowing)
                onFollow?.()
              }}
            >
              <Heart className={cn(
                "h-5 w-5",
                isFollowing && "fill-current text-red-500"
              )} />
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative -mt-32 md:-mt-40">
        <div className="container mx-auto px-4 md:px-6">
          {/* Level 1: Profile Photo + Basic Info */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Profile Photo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="relative group">
                <Avatar className="h-32 w-32 md:h-48 md:w-48 border-4 border-white shadow-2xl">
                  <AvatarImage src={data.profilePhoto} alt={data.name} />
                  <AvatarFallback className="text-2xl md:text-4xl">
                    {data.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                {/* Online indicator */}
                {data.isOnline && (
                  <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 rounded-full border-4 border-white">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping" />
                  </div>
                )}
                
                {/* Hover overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  onClick={() => setShowVideo(true)}
                >
                  <Play className="h-12 w-12 text-white fill-current" />
                </motion.div>
              </div>
            </motion.div>

            {/* Name, Category, Verification */}
            <div className="flex-1 space-y-3 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold">{data.name}</h1>
                    <CompositeVerification verifications={data.verificationLevels} size="md" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{data.category}</p>
                  {data.tagline && (
                    <p className="text-sm text-gray-500 mt-2 italic">{data.tagline}</p>
                  )}
                </div>
              </div>

              {/* Level 2: Decision Factors */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                {/* Price */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Starting at</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-bold text-purple-600">
                      ${data.price}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          ${data.originalPrice}
                        </span>
                        <Badge variant="destructive" className="animate-pulse">
                          -{data.discount}%
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Rating</p>
                  <RatingDisplay
                    rating={data.rating}
                    totalReviews={data.reviewCount}
                    size="sm"
                  />
                </div>

                {/* Response Time */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Response</p>
                  <ResponseIndicator
                    data={responseData}
                    variant="badge"
                  />
                </div>

                {/* Videos Delivered */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Delivered</p>
                  <div className="flex items-center gap-1">
                    <Video className="h-4 w-4 text-purple-500" />
                    <span className="font-semibold">{data.videosDelivered.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <Button
                  size="lg"
                  className="flex-1 md:flex-none md:w-48 h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={onBook}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Now
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 md:flex-none"
                  onClick={onMessage}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Message
                </Button>

                <Button
                  size="lg"
                  variant="ghost"
                  className="md:ml-auto"
                  onClick={() => {
                    setIsFollowing(!isFollowing)
                    onFollow?.()
                  }}
                >
                  <Heart className={cn(
                    "h-5 w-5 mr-2",
                    isFollowing && "fill-current text-red-500"
                  )} />
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            </div>
          </div>

          {/* Level 3: Supporting Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bio */}
            <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold mb-3">About</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {data.bio}
              </p>
            </div>

            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg space-y-3">
              <h3 className="font-semibold mb-3">Quick Info</h3>
              
              {/* Languages */}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {data.languages.join(", ")}
                </span>
              </div>

              {/* Location */}
              {data.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {data.location}
                  </span>
                </div>
              )}

              {/* Member Since */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Member since {data.memberSince.getFullYear()}
                </span>
              </div>

              {/* Completion Rate */}
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {data.completionRate}% completion rate
                </span>
              </div>

              {/* Repeat Customers */}
              {data.repeatCustomers && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {data.repeatCustomers}% repeat customers
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}