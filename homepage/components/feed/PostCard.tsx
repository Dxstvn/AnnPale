"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import ReactPlayer from "react-player"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Heart,
  MessageSquare,
  Repeat2,
  Share,
  MoreHorizontal,
  Bookmark,
  Flag,
  UserPlus,
  Lock,
  CheckCircle,
  Play,
  Volume2,
  VolumeX,
  Image as ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"

interface CreatorInfo {
  id: string
  username: string
  displayName: string
  avatar: string
  isVerified: boolean
  subscriberTier?: string
  tierColor?: string
}

interface EngagementMetrics {
  likes: number
  reposts: number
  comments: number
  isLiked: boolean
  isReposted: boolean
  isBookmarked: boolean
}

export interface PostData {
  id: string
  creator: CreatorInfo
  content: string
  mediaUrls?: string[]
  postType: "text" | "image" | "video" | "poll"
  engagement: EngagementMetrics
  visibility: "public" | "subscribers" | "tier-specific"
  tierRequired?: string
  createdAt: string
}

interface PostCardProps {
  post: PostData
  onEngagementUpdate?: () => void
}

export function PostCard({ post, onEngagementUpdate }: PostCardProps) {
  const { user, profile } = useSupabaseAuth()
  const [isLiked, setIsLiked] = useState(post.engagement.isLiked)
  const [isReposted, setIsReposted] = useState(post.engagement.isReposted)
  const [isBookmarked, setIsBookmarked] = useState(post.engagement.isBookmarked)
  const [likeCount, setLikeCount] = useState(post.engagement.likes)
  const [repostCount, setRepostCount] = useState(post.engagement.reposts)
  const [showMore, setShowMore] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  // Check if content is gated
  const isGated = post.visibility !== "public" && !post.creator.subscriberTier
  const canView = !isGated || post.creator.subscriberTier

  // Handle like action
  const handleLike = useCallback(async () => {
    if (!user) {
      window.location.href = "/login"
      return
    }

    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    
    // TODO: API call to update like
    onEngagementUpdate?.()
  }, [isLiked, likeCount, user, onEngagementUpdate])

  // Handle repost action
  const handleRepost = useCallback(async () => {
    if (!user) {
      window.location.href = "/login"
      return
    }

    setIsReposted(!isReposted)
    setRepostCount(isReposted ? repostCount - 1 : repostCount + 1)
    
    // TODO: API call to update repost
    onEngagementUpdate?.()
  }, [isReposted, repostCount, user, onEngagementUpdate])

  // Handle bookmark action
  const handleBookmark = useCallback(async () => {
    if (!user) {
      window.location.href = "/login"
      return
    }

    setIsBookmarked(!isBookmarked)
    // TODO: API call to update bookmark
  }, [isBookmarked, user])

  // Format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  // Truncate long content
  const shouldTruncate = post.content.length > 280
  const displayContent = shouldTruncate && !showMore
    ? post.content.slice(0, 280) + "..."
    : post.content

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <Link 
            href={`/creator/${post.creator.username}`}
            className="flex items-start gap-3 group"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.creator.avatar} />
              <AvatarFallback>{post.creator.displayName[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold group-hover:underline">
                  {post.creator.displayName}
                </span>
                {post.creator.isVerified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
                {post.creator.subscriberTier && (
                  <Badge 
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      post.creator.tierColor && `bg-gradient-to-r ${post.creator.tierColor} text-white`
                    )}
                  >
                    {post.creator.subscriberTier}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>@{post.creator.username}</span>
                <span>·</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: false })}</span>
              </div>
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!post.creator.subscriberTier && (
                <DropdownMenuItem>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow @{post.creator.username}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleBookmark}>
                <Bookmark className={cn(
                  "h-4 w-4 mr-2",
                  isBookmarked && "fill-current"
                )} />
                {isBookmarked ? "Remove Bookmark" : "Bookmark"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag className="h-4 w-4 mr-2" />
                Report Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        {canView ? (
          <>
            <div className="mb-3">
              <p className="whitespace-pre-wrap">{displayContent}</p>
              {shouldTruncate && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-purple-600 hover:underline text-sm mt-1"
                >
                  {showMore ? "Show less" : "Show more"}
                </button>
              )}
            </div>

            {/* Media */}
            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="mb-3 -mx-4">
                {post.postType === "image" && (
                  <div className={cn(
                    "grid gap-2",
                    post.mediaUrls.length === 1 && "grid-cols-1",
                    post.mediaUrls.length === 2 && "grid-cols-2",
                    post.mediaUrls.length === 3 && "grid-cols-2",
                    post.mediaUrls.length >= 4 && "grid-cols-2"
                  )}>
                    {post.mediaUrls.slice(0, 4).map((url, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "relative bg-gray-100",
                          post.mediaUrls!.length === 3 && index === 0 && "row-span-2"
                        )}
                      >
                        <Image
                          src={url}
                          alt=""
                          width={600}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                        {post.mediaUrls!.length > 4 && index === 3 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold">
                            +{post.mediaUrls!.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {post.postType === "video" && (
                  <div className="relative aspect-video bg-black">
                    <ReactPlayer
                      url={post.mediaUrls[0]}
                      width="100%"
                      height="100%"
                      playing={isPlaying}
                      muted={isMuted}
                      controls
                      light
                      playIcon={
                        <Button size="lg" className="bg-white/90 text-black hover:bg-white">
                          <Play className="h-6 w-6" />
                        </Button>
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // Gated content
          <div className="mb-3 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="font-semibold mb-1">Subscriber Only Content</p>
            <p className="text-sm text-gray-600 mb-3">
              {post.tierRequired 
                ? `Subscribe to "${post.tierRequired}" to view this post`
                : "Subscribe to view this creator's exclusive content"}
            </p>
            <Link href={`/creator/${post.creator.username}`}>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                View Subscription Options
              </Button>
            </Link>
          </div>
        )}

        {/* Engagement buttons */}
        <div className="flex items-center justify-between pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              "flex items-center gap-2 hover:text-red-600",
              isLiked && "text-red-600"
            )}
          >
            <Heart className={cn(
              "h-5 w-5",
              isLiked && "fill-current"
            )} />
            <span>{formatNumber(likeCount)}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRepost}
            className={cn(
              "flex items-center gap-2 hover:text-green-600",
              isReposted && "text-green-600"
            )}
          >
            <Repeat2 className="h-5 w-5" />
            <span>{formatNumber(repostCount)}</span>
          </Button>

          <Link href={`/post/${post.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:text-blue-600"
            >
              <MessageSquare className="h-5 w-5" />
              <span>{formatNumber(post.engagement.comments)}</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:text-purple-600"
              >
                <Share className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)}>
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem>
                Share to Twitter/X
              </DropdownMenuItem>
              <DropdownMenuItem>
                Share to WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}