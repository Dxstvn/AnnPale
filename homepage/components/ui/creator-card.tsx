"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  Clock,
  Globe,
  CheckCircle,
  MessageSquare,
  DollarSign,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"
import { useTranslations } from "next-intl"

export interface Creator {
  id: string
  name: string
  category: string
  avatar: string
  coverImage?: string
  rating: number
  reviewCount: number
  price: number
  responseTime: string
  languages: string[]
  verified: boolean
  trending?: boolean
  featured?: boolean
  videoCount?: number
}

interface CreatorCardProps {
  creator: Creator
  variant?: "default" | "compact" | "featured"
  showStats?: boolean
  interactive?: boolean
  className?: string
}

export function CreatorCard({
  creator,
  variant = "default",
  showStats = true,
  interactive = true,
  className
}: CreatorCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const t = useTranslations('components.creatorCard')

  const cardContent = (
    <Card 
      className={cn(
        "overflow-hidden transition-all",
        interactive && "cursor-pointer hover:shadow-xl",
        variant === "featured" && "border-purple-200 dark:border-purple-800",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        {/* Cover Image with Zoom Effect */}
        <motion.div
          animate={{ scale: isHovered && interactive ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <img
            src={creator.coverImage || creator.avatar}
            alt={creator.name}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {creator.verified && (
            <Badge variant="info" className="bg-blue-500/90 backdrop-blur">
              <CheckCircle className="h-3 w-3 mr-1" />
              {t('verified')}
            </Badge>
          )}
          {creator.trending && (
            <Badge variant="warning" className="bg-yellow-500/90 backdrop-blur">
              <TrendingUp className="h-3 w-3 mr-1" />
              {t('trending')}
            </Badge>
          )}
          {creator.featured && (
            <Badge variant="success" className="bg-green-500/90 backdrop-blur">
              <Star className="h-3 w-3 mr-1" />
              {t('featured')}
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

        {/* Languages Badge */}
        {creator.languages.length > 0 && variant !== "compact" && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur">
              <Globe className="h-3 w-3 mr-1" />
              {creator.languages.length} {creator.languages.length === 1 ? t('language') : t('languages')}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        {/* Creator Info */}
        <div className="flex items-start gap-3">
          <Avatar className={cn(
            "border-2 border-white dark:border-gray-800 shadow-md",
            variant === "compact" ? "h-10 w-10" : "h-12 w-12"
          )}>
            <AvatarImage src={creator.avatar} />
            <AvatarFallback className="bg-purple-600 text-white">
              {creator.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold truncate",
              variant === "compact" ? "text-sm" : "text-base"
            )}>
              {creator.name}
            </h3>
            <p className={cn(
              "text-gray-500 dark:text-gray-400",
              variant === "compact" ? "text-xs" : "text-sm"
            )}>
              {creator.category}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        {showStats && variant !== "compact" && (
          <div className="mt-4 space-y-2">
            {/* Price and Response Time */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${creator.price}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{creator.responseTime}</span>
              </div>
            </div>

            {/* Review Count */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{creator.reviewCount} {t('reviews')}</span>
              </div>
              {creator.videoCount && (
                <span>{creator.videoCount} {t('videos')}</span>
              )}
            </div>
          </div>
        )}

        {/* Compact Stats */}
        {variant === "compact" && (
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="font-semibold">${creator.price}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{creator.rating}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (interactive) {
    return (
      <Link href={`/creator/${creator.id}`}>
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {cardContent}
        </motion.div>
      </Link>
    )
  }

  return cardContent
}

// Loading skeleton for Creator Card
export function CreatorCardSkeleton({ variant = "default" }: { variant?: "default" | "compact" | "featured" }) {
  return (
    <Card className="overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
      
      {/* Content Skeleton */}
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse",
            variant === "compact" ? "h-10 w-10" : "h-12 w-12"
          )} />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
          </div>
        </div>
        
        {variant !== "compact" && (
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}