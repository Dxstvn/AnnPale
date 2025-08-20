"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  ThumbsUp,
  MoreHorizontal,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Filter,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export interface Review {
  id: string
  author: {
    name: string
    avatar?: string
    verified?: boolean
  }
  rating: number
  date: Date
  message: string
  videoUrl?: string
  helpful?: number
  response?: {
    message: string
    date: Date
  }
  tags?: string[]
}

export interface RatingDistribution {
  5: number
  4: number
  3: number
  2: number
  1: number
}

interface RatingDisplayProps {
  rating: number
  totalReviews: number
  size?: "xs" | "sm" | "md" | "lg"
  showCount?: boolean
  interactive?: boolean
  className?: string
}

// Star rating display component
export function RatingDisplay({
  rating,
  totalReviews,
  size = "sm",
  showCount = true,
  interactive = false,
  className
}: RatingDisplayProps) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  const textSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            initial={interactive ? { scale: 0 } : {}}
            animate={{ scale: 1 }}
            transition={{ delay: star * 0.05 }}
            whileHover={interactive ? { scale: 1.2 } : {}}
          >
            <Star
              className={cn(
                sizeClasses[size],
                star <= Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : star <= Math.ceil(rating)
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
              )}
            />
          </motion.div>
        ))}
      </div>
      
      {showCount && (
        <div className={cn("flex items-center gap-1", textSizes[size])}>
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <span className="text-gray-500">({totalReviews.toLocaleString()})</span>
        </div>
      )}
    </div>
  )
}

// Rating breakdown component
export function RatingBreakdown({
  distribution,
  totalReviews,
  className
}: {
  distribution: RatingDistribution
  totalReviews: number
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution[rating as keyof RatingDistribution]
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

        return (
          <motion.div
            key={rating}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (5 - rating) * 0.05 }}
            className="flex items-center gap-3"
          >
            <button className="flex items-center gap-1 hover:text-yellow-500 transition">
              <span className="text-sm w-3">{rating}</span>
              <Star className="h-3 w-3 fill-current" />
            </button>
            
            <div className="flex-1">
              <Progress value={percentage} className="h-2" />
            </div>
            
            <span className="text-xs text-gray-500 w-12 text-right">
              {count.toLocaleString()}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

// Individual review card
export function ReviewCard({
  review,
  showResponse = true,
  onHelpful,
  className
}: {
  review: Review
  showResponse?: boolean
  onHelpful?: (reviewId: string) => void
  className?: string
}) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card>
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.author.avatar} />
                <AvatarFallback>
                  {review.author.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{review.author.name}</span>
                  {review.author.verified && (
                    <CheckCircle className="h-3 w-3 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <RatingDisplay rating={review.rating} totalReviews={0} size="xs" showCount={false} />
                  <span>•</span>
                  <span>{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Review content */}
          <div>
            <p className={cn(
              "text-sm text-gray-700 dark:text-gray-300",
              !isExpanded && review.message.length > 200 && "line-clamp-3"
            )}>
              {review.message}
            </p>
            
            {review.message.length > 200 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-purple-600 hover:text-purple-700 mt-1"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Creator response */}
          {showResponse && review.response && (
            <div className="ml-4 pl-4 border-l-2 border-purple-200 dark:border-purple-800">
              <div className="text-xs text-gray-500 mb-1">Creator response</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {review.response.message}
              </p>
              <span className="text-xs text-gray-500">
                {new Date(review.response.date).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => onHelpful?.(review.id)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Helpful ({review.helpful || 0})</span>
            </button>
            
            {review.videoUrl && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified Purchase
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Reviews section component
export function ReviewsSection({
  reviews,
  distribution,
  averageRating,
  totalReviews,
  onLoadMore,
  hasMore = false,
  loading = false,
  className
}: {
  reviews: Review[]
  distribution: RatingDistribution
  averageRating: number
  totalReviews: number
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
  className?: string
}) {
  const [sortBy, setSortBy] = React.useState<"recent" | "helpful" | "rating">("recent")
  const [filterRating, setFilterRating] = React.useState<number | null>(null)

  const filteredReviews = React.useMemo(() => {
    let filtered = [...reviews]
    
    if (filterRating) {
      filtered = filtered.filter(r => r.rating === filterRating)
    }
    
    switch (sortBy) {
      case "helpful":
        filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0))
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "recent":
      default:
        filtered.sort((a, b) => b.date.getTime() - a.date.getTime())
        break
    }
    
    return filtered
  }, [reviews, sortBy, filterRating])

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average rating */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              <RatingDisplay 
                rating={averageRating} 
                totalReviews={totalReviews} 
                size="lg" 
                showCount={false}
              />
              <p className="text-sm text-gray-500">
                Based on {totalReviews.toLocaleString()} reviews
              </p>
              
              {averageRating >= 4.5 && (
                <Badge variant="success" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Exceptional Rating
                </Badge>
              )}
            </div>
            
            {/* Distribution */}
            <div>
              <RatingBreakdown 
                distribution={distribution} 
                totalReviews={totalReviews}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={filterRating === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRating(null)}
          >
            All
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={filterRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRating(rating)}
              className="gap-1"
            >
              {rating}
              <Star className="h-3 w-3 fill-current" />
            </Button>
          ))}
        </div>
        
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-3 w-3" />
          Sort: {sortBy === "recent" ? "Recent" : sortBy === "helpful" ? "Most Helpful" : "Highest Rated"}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="text-center">
          <Button
            onClick={onLoadMore}
            variant="outline"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Reviews"}
          </Button>
        </div>
      )}
    </div>
  )
}