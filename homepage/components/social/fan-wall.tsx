"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  Star,
  Camera,
  Trophy,
  Sparkles,
  MessageSquare,
  Share2,
  Flag,
  ThumbsUp,
  Calendar,
  MapPin,
  Gift,
  PartyPopper,
  Plus,
  ChevronRight,
  Play,
  Image as ImageIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

// Fan Wall data types
export interface FanPost {
  id: string
  author: {
    name: string
    avatar?: string
    location?: string
  }
  type: "testimonial" | "photo" | "video" | "story" | "shoutout"
  content: string
  media?: {
    type: "photo" | "video"
    url: string
    thumbnail?: string
  }
  occasion?: string
  rating?: number
  likes: number
  hasLiked?: boolean
  isFeatured?: boolean
  isVerified?: boolean
  createdAt: Date
  creatorResponse?: {
    message: string
    date: Date
  }
}

export interface FanWallData {
  posts: FanPost[]
  totalPosts: number
  featuredPosts: FanPost[]
  allowSubmissions: boolean
  requireApproval?: boolean
  stats?: {
    totalFans: number
    totalStories: number
    averageRating: number
  }
}

interface FanWallProps {
  data: FanWallData
  creatorName: string
  onPostSubmit?: (post: Partial<FanPost>) => void
  onPostLike?: (postId: string) => void
  onPostReport?: (postId: string) => void
  className?: string
  variant?: "grid" | "list" | "featured"
}

// Post type icons
const postTypeIcons = {
  testimonial: MessageSquare,
  photo: Camera,
  video: Play,
  story: Star,
  shoutout: Trophy
}

const postTypeColors = {
  testimonial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
  photo: "bg-purple-100 text-purple-700 dark:bg-purple-900/30",
  video: "bg-red-100 text-red-700 dark:bg-red-900/30",
  story: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30",
  shoutout: "bg-green-100 text-green-700 dark:bg-green-900/30"
}

// Single fan post card
function FanPostCard({
  post,
  onLike,
  onReport,
  variant = "default"
}: {
  post: FanPost
  onLike?: (id: string) => void
  onReport?: (id: string) => void
  variant?: "default" | "featured" | "compact"
}) {
  const [hasLiked, setHasLiked] = React.useState(post.hasLiked)
  const [likes, setLikes] = React.useState(post.likes)
  const TypeIcon = postTypeIcons[post.type]
  
  const handleLike = () => {
    const newState = !hasLiked
    setHasLiked(newState)
    setLikes(prev => newState ? prev + 1 : prev - 1)
    onLike?.(post.id)
  }
  
  if (variant === "compact") {
    return (
      <div className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{post.author.name}</span>
            {post.isVerified && (
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {post.content}
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={cn(
        "h-full",
        variant === "featured" && "md:col-span-2"
      )}
    >
      <Card className={cn(
        "h-full transition-all hover:shadow-lg",
        post.isFeatured && "border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
      )}>
        {/* Media */}
        {post.media && (
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            {post.media.type === "photo" ? (
              <img 
                src={post.media.url} 
                alt="Fan post"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                <img 
                  src={post.media.thumbnail || post.media.url} 
                  alt="Video thumbnail"
                  className="w-full h-full object-cover opacity-50"
                />
                <Play className="absolute h-12 w-12 text-white" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex gap-2">
              {post.isFeatured && (
                <Badge className="bg-yellow-500">
                  <Star className="h-3 w-3 mr-0.5" />
                  Featured
                </Badge>
              )}
              <Badge className={cn("text-xs", postTypeColors[post.type])}>
                <TypeIcon className="h-3 w-3 mr-0.5" />
                {post.type}
              </Badge>
            </div>
          </div>
        )}
        
        <CardContent className="p-4 space-y-3">
          {/* Author info */}
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{post.author.name}</span>
                  {post.isVerified && (
                    <Badge variant="secondary" className="text-xs">
                      <ThumbsUp className="h-3 w-3 mr-0.5" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {post.author.location && (
                    <>
                      <MapPin className="h-3 w-3" />
                      <span>{post.author.location}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            
            {!post.media && (
              <Badge className={cn("text-xs", postTypeColors[post.type])}>
                <TypeIcon className="h-3 w-3 mr-0.5" />
                {post.type}
              </Badge>
            )}
          </div>
          
          {/* Occasion */}
          {post.occasion && (
            <Badge variant="outline" className="w-fit">
              <Gift className="h-3 w-3 mr-1" />
              {post.occasion}
            </Badge>
          )}
          
          {/* Rating */}
          {post.rating && (
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < post.rating! 
                      ? "text-yellow-500 fill-current" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
          )}
          
          {/* Content */}
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {post.content}
          </p>
          
          {/* Creator response */}
          {post.creatorResponse && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-2 border-purple-500">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-purple-600 text-xs">
                  Creator Response
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(post.creatorResponse.date, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {post.creatorResponse.message}
              </p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1 text-sm transition-colors",
                hasLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", hasLiked && "fill-current")} />
              <span>{likes}</span>
            </button>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8"
                onClick={() => {
                  onReport?.(post.id)
                  toast.info("Post reported")
                }}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Submit post form
function SubmitPostForm({
  onSubmit
}: {
  onSubmit: (post: Partial<FanPost>) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [type, setType] = React.useState<FanPost['type']>("testimonial")
  const [content, setContent] = React.useState("")
  const [occasion, setOccasion] = React.useState("")
  const [rating, setRating] = React.useState(5)
  
  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit({
        type,
        content,
        occasion: occasion || undefined,
        rating: type === "testimonial" ? rating : undefined
      })
      setContent("")
      setOccasion("")
      setRating(5)
      setIsOpen(false)
      toast.success("Your post has been submitted!")
    }
  }
  
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Share Your Story
      </Button>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4 border rounded-lg"
    >
      {/* Post type selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">What would you like to share?</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {Object.entries(postTypeIcons).map(([key, Icon]) => (
            <Button
              key={key}
              variant={type === key ? "default" : "outline"}
              size="sm"
              onClick={() => setType(key as FanPost['type'])}
              className="justify-start"
            >
              <Icon className="h-3 w-3 mr-1" />
              {key}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Occasion */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Occasion (optional)</label>
        <div className="flex flex-wrap gap-2">
          {["Birthday", "Anniversary", "Graduation", "Holiday", "Just Because"].map((occ) => (
            <Badge
              key={occ}
              variant={occasion === occ ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setOccasion(occasion === occ ? "" : occ)}
            >
              {occ}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Rating (for testimonials) */}
      {type === "testimonial" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Rating</label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setRating(i + 1)}
                className="p-1"
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    i < rating 
                      ? "text-yellow-500 fill-current" 
                      : "text-gray-300 hover:text-yellow-400"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Message</label>
        <Textarea
          placeholder="Share your experience..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      {/* Media upload hint */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <ImageIcon className="h-4 w-4 text-gray-500" />
        <p className="text-xs text-gray-500">
          Photo and video uploads coming soon!
        </p>
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={!content.trim()}>
          Submit Post
        </Button>
        <Button 
          variant="outline"
          onClick={() => {
            setIsOpen(false)
            setContent("")
            setOccasion("")
            setRating(5)
          }}
        >
          Cancel
        </Button>
      </div>
    </motion.div>
  )
}

// Fan wall stats
function FanWallStats({
  stats
}: {
  stats: NonNullable<FanWallData['stats']>
}) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">{stats.totalFans}</div>
        <p className="text-xs text-gray-600 dark:text-gray-400">Happy Fans</p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-pink-600">{stats.totalStories}</div>
        <p className="text-xs text-gray-600 dark:text-gray-400">Stories Shared</p>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-1">
          <Star className="h-5 w-5 text-yellow-500 fill-current" />
          <span className="text-2xl font-bold text-yellow-600">
            {stats.averageRating.toFixed(1)}
          </span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">Average Rating</p>
      </div>
    </div>
  )
}

// Main fan wall component
export function FanWall({
  data,
  creatorName,
  onPostSubmit,
  onPostLike,
  onPostReport,
  className,
  variant = "grid"
}: FanWallProps) {
  const [showAll, setShowAll] = React.useState(false)
  
  const displayPosts = showAll ? data.posts : data.posts.slice(0, 6)
  
  if (variant === "featured") {
    return (
      <div className={cn("space-y-6", className)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Featured Fan Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.featuredPosts.map((post) => (
                <FanPostCard
                  key={post.id}
                  post={post}
                  onLike={onPostLike}
                  onReport={onPostReport}
                  variant="compact"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Fan Wall
          </CardTitle>
          <CardDescription>
            Stories and testimonials from {creatorName}'s amazing fans
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.stats && <FanWallStats stats={data.stats} />}
          
          {data.allowSubmissions && (
            <SubmitPostForm onSubmit={onPostSubmit || (() => {})} />
          )}
        </CardContent>
      </Card>
      
      {/* Posts grid */}
      {variant === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayPosts.map((post) => (
            <FanPostCard
              key={post.id}
              post={post}
              onLike={onPostLike}
              onReport={onPostReport}
              variant={post.isFeatured ? "featured" : "default"}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayPosts.map((post) => (
            <FanPostCard
              key={post.id}
              post={post}
              onLike={onPostLike}
              onReport={onPostReport}
            />
          ))}
        </div>
      )}
      
      {/* Load more */}
      {!showAll && data.posts.length > 6 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
          >
            View All {data.totalPosts} Posts
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}