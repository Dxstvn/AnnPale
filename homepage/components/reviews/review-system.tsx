"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Camera,
  FileText,
  RefreshCw,
  Zap,
  TrendingUp,
  Award,
  Heart,
  Flag,
  MoreVertical,
  Image as ImageIcon,
  Video,
  Clock,
  DollarSign,
  Sparkles
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Enhanced review interface with trust signals
export interface EnhancedReview {
  id: string
  author: {
    name: string
    avatar?: string
    location?: string
    memberSince?: Date
    reviewCount?: number
  }
  rating: number
  categoryRatings?: {
    quality: number
    communication: number
    deliveryTime: number
    value: number
  }
  date: Date
  occasion?: string
  message: string
  media?: {
    type: "photo" | "video"
    url: string
    thumbnail?: string
  }[]
  helpful: number
  notHelpful: number
  verified: boolean
  repeatCustomer?: boolean
  platformVeteran?: boolean
  detailed?: boolean // 100+ characters
  response?: {
    message: string
    date: Date
  }
  tags?: string[]
}

export interface ReviewSystemData {
  overallRating: number
  totalReviews: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  categoryAverages: {
    quality: number
    communication: number
    deliveryTime: number
    value: number
  }
  reviews: EnhancedReview[]
  highlights: string[] // Top positive quotes
  recommendationRate: number
}

interface ReviewSystemProps {
  data: ReviewSystemData
  onHelpful?: (reviewId: string, helpful: boolean) => void
  onReport?: (reviewId: string) => void
  onFilterChange?: (filters: ReviewFilters) => void
  className?: string
}

interface ReviewFilters {
  rating?: number
  verified?: boolean
  withMedia?: boolean
  sortBy?: "newest" | "oldest" | "helpful" | "rating-high" | "rating-low"
}

// Rating summary component
function RatingSummary({ data }: { data: ReviewSystemData }) {
  const getPercentage = (count: number) => {
    return (count / data.totalReviews) * 100
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-start gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold">{data.overallRating.toFixed(1)}</div>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-5 w-5",
                    star <= Math.round(data.overallRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {data.totalReviews.toLocaleString()} reviews
            </p>
          </div>

          {/* Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = data.distribution[rating as keyof typeof data.distribution]
              const percentage = getPercentage(count)
              
              return (
                <div key={rating} className="flex items-center gap-3">
                  <button className="flex items-center gap-1 min-w-[60px] hover:text-purple-600 transition">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 fill-current" />
                  </button>
                  <div className="flex-1">
                    <Progress value={percentage} className="h-2" />
                  </div>
                  <span className="text-sm text-gray-500 min-w-[50px] text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category Ratings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
          {Object.entries(data.categoryAverages).map(([category, rating]) => (
            <div key={category} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {category === "quality" && <Award className="h-4 w-4 text-purple-500" />}
                {category === "communication" && <MessageSquare className="h-4 w-4 text-blue-500" />}
                {category === "deliveryTime" && <Clock className="h-4 w-4 text-green-500" />}
                {category === "value" && <DollarSign className="h-4 w-4 text-yellow-500" />}
                <span className="font-semibold">{rating.toFixed(1)}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-xs text-gray-500 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>
          ))}
        </div>

        {/* Recommendation Rate */}
        {data.recommendationRate > 0 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
            <span className="font-semibold text-lg">
              {data.recommendationRate}% recommend this creator
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Review highlights component
function ReviewHighlights({ highlights }: { highlights: string[] }) {
  if (highlights.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Customer Highlights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {highlights.map((quote, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-4 border-l-2 border-purple-200"
            >
              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                "{quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Individual review card
function ReviewCard({
  review,
  onHelpful,
  onReport
}: {
  review: EnhancedReview
  onHelpful?: (helpful: boolean) => void
  onReport?: () => void
}) {
  const [expanded, setExpanded] = React.useState(false)
  const [helpfulVote, setHelpfulVote] = React.useState<boolean | null>(null)

  const handleHelpful = (helpful: boolean) => {
    setHelpfulVote(helpful)
    onHelpful?.(helpful)
  }

  const getTrustBadges = () => {
    const badges = []
    
    if (review.verified) {
      badges.push(
        <TooltipProvider key="verified">
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Confirmed booking</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    if (review.repeatCustomer) {
      badges.push(
        <TooltipProvider key="repeat">
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="gap-1">
                <RefreshCw className="h-3 w-3" />
                Repeat
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Multiple bookings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    if (review.platformVeteran) {
      badges.push(
        <TooltipProvider key="veteran">
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3 w-3" />
                Veteran
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">10+ reviews given</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    if (review.media && review.media.length > 0) {
      badges.push(
        <Badge key="media" variant="secondary" className="gap-1">
          {review.media[0].type === "video" ? (
            <Video className="h-3 w-3" />
          ) : (
            <Camera className="h-3 w-3" />
          )}
          Media
        </Badge>
      )
    }

    if (review.detailed) {
      badges.push(
        <Badge key="detailed" variant="secondary" className="gap-1">
          <FileText className="h-3 w-3" />
          Detailed
        </Badge>
      )
    }

    return badges
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* Author Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={review.author.avatar} />
              <AvatarFallback>
                {review.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{review.author.name}</h4>
                <div className="flex gap-1">
                  {getTrustBadges()}
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                {review.author.location && (
                  <span>{review.author.location}</span>
                )}
                {review.author.reviewCount && (
                  <span>{review.author.reviewCount} reviews</span>
                )}
                <span>{review.date.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onReport}>
                <Flag className="h-4 w-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  star <= review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          
          {review.occasion && (
            <Badge variant="outline">{review.occasion}</Badge>
          )}
        </div>

        {/* Category Ratings (expandable) */}
        {review.categoryRatings && (
          <div className="mb-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
            >
              <span>Detailed ratings</span>
              {expanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
            
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {Object.entries(review.categoryRatings).map(([category, rating]) => (
                      <div key={category} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{rating}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Review Message */}
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {review.message}
        </p>

        {/* Media Attachments */}
        {review.media && review.media.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {review.media.map((media, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
              >
                {media.type === "photo" ? (
                  <Image
                    src={media.thumbnail || media.url}
                    alt="Review media"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={media.thumbnail || "/video-placeholder.jpg"}
                      alt="Video thumbnail"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="h-6 w-6 text-white drop-shadow-lg" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />
              </div>
            ))}
          </div>
        )}

        {/* Creator Response */}
        {review.response && (
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-2 border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-purple-600">Creator Response</Badge>
              <span className="text-xs text-gray-500">
                {review.response.date.toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {review.response.message}
            </p>
          </div>
        )}

        {/* Helpful Section */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Was this helpful?</span>
            <div className="flex items-center gap-2">
              <Button
                variant={helpfulVote === true ? "default" : "outline"}
                size="sm"
                onClick={() => handleHelpful(true)}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {review.helpful}
              </Button>
              <Button
                variant={helpfulVote === false ? "default" : "outline"}
                size="sm"
                onClick={() => handleHelpful(false)}
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {review.tags && review.tags.length > 0 && (
            <div className="flex gap-1">
              {review.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Main review system component
export function ReviewSystem({
  data,
  onHelpful,
  onReport,
  onFilterChange,
  className
}: ReviewSystemProps) {
  const [filters, setFilters] = React.useState<ReviewFilters>({
    sortBy: "helpful"
  })
  const [visibleReviews, setVisibleReviews] = React.useState(10)
  const [activeTab, setActiveTab] = React.useState("recent")

  // Filter reviews based on current filters
  const filteredReviews = React.useMemo(() => {
    let filtered = [...data.reviews]

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter(r => r.rating === filters.rating)
    }

    // Verified filter
    if (filters.verified) {
      filtered = filtered.filter(r => r.verified)
    }

    // Media filter
    if (filters.withMedia) {
      filtered = filtered.filter(r => r.media && r.media.length > 0)
    }

    // Sorting
    switch (filters.sortBy) {
      case "newest":
        filtered.sort((a, b) => b.date.getTime() - a.date.getTime())
        break
      case "oldest":
        filtered.sort((a, b) => a.date.getTime() - b.date.getTime())
        break
      case "helpful":
        filtered.sort((a, b) => b.helpful - a.helpful)
        break
      case "rating-high":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "rating-low":
        filtered.sort((a, b) => a.rating - b.rating)
        break
    }

    return filtered
  }, [data.reviews, filters])

  const handleFilterChange = (newFilters: Partial<ReviewFilters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange?.(updated)
  }

  const recentReviews = filteredReviews.slice(0, 10)
  const displayedReviews = filteredReviews.slice(0, visibleReviews)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Section */}
      <RatingSummary data={data} />

      {/* Highlights */}
      {data.highlights.length > 0 && (
        <ReviewHighlights highlights={data.highlights} />
      )}

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Reviews</CardTitle>
            
            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange({ sortBy: value as any })}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="rating-high">Highest Rating</SelectItem>
                  <SelectItem value="rating-low">Lowest Rating</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleFilterChange({ rating: undefined })}>
                    All Ratings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <DropdownMenuItem
                      key={rating}
                      onClick={() => handleFilterChange({ rating })}
                    >
                      <div className="flex items-center gap-2">
                        <span>{rating}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleFilterChange({ verified: true })}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verified Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange({ withMedia: true })}>
                    <Camera className="h-4 w-4 mr-2" />
                    With Media
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tabs for different views */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="helpful">Most Helpful</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="all">All Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              {recentReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onHelpful={(helpful) => onHelpful?.(review.id, helpful)}
                  onReport={() => onReport?.(review.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="helpful" className="space-y-4">
              {filteredReviews
                .sort((a, b) => b.helpful - a.helpful)
                .slice(0, 10)
                .map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onHelpful={(helpful) => onHelpful?.(review.id, helpful)}
                    onReport={() => onReport?.(review.id)}
                  />
                ))}
            </TabsContent>

            <TabsContent value="critical" className="space-y-4">
              {filteredReviews
                .filter(r => r.rating <= 3)
                .slice(0, 10)
                .map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onHelpful={(helpful) => onHelpful?.(review.id, helpful)}
                    onReport={() => onReport?.(review.id)}
                  />
                ))}
              
              {filteredReviews.filter(r => r.rating <= 3).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No critical reviews found
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {displayedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onHelpful={(helpful) => onHelpful?.(review.id, helpful)}
                  onReport={() => onReport?.(review.id)}
                />
              ))}

              {visibleReviews < filteredReviews.length && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleReviews(prev => prev + 10)}
                  >
                    Load More Reviews
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}