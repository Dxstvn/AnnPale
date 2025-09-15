"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Heart,
  MessageSquare,
  Eye,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { CommentsSection } from "./comments-section"
import { formatNumber } from "@/lib/utils"

interface PostInteractionsProps {
  postId: string
  creatorId: string
  initialLikes?: number
  initialComments?: number
  initialViews?: number
  isLiked?: boolean
  isViewed?: boolean
  isAuthenticated: boolean
  currentUserId?: string
  onLikeChange?: (liked: boolean, count: number) => void
  onCommentChange?: (count: number) => void
  onCommentClick?: (e: React.MouseEvent) => void
  onViewTracked?: (count: number) => void
  className?: string
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export function PostInteractions({
  postId,
  creatorId,
  initialLikes = 0,
  initialComments = 0,
  initialViews = 0,
  isLiked: initialIsLiked = false,
  isViewed: initialIsViewed = false,
  isAuthenticated,
  currentUserId,
  onLikeChange,
  onCommentChange,
  onCommentClick,
  onViewTracked,
  className,
  showLabels = false,
  size = 'md'
}: PostInteractionsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [commentsCount, setCommentsCount] = useState(initialComments)
  const [viewsCount, setViewsCount] = useState(initialViews)
  const [isViewed, setIsViewed] = useState(initialIsViewed)
  const [likePending, setLikePending] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [viewTracked, setViewTracked] = useState(false)

  const { toast } = useToast()

  // Track view when component mounts (if not already viewed)
  useEffect(() => {
    if (!viewTracked && !initialIsViewed && isAuthenticated) {
      trackView()
    }
  }, [postId, isAuthenticated])

  // Track view
  const trackView = async () => {
    if (viewTracked || !isAuthenticated) return

    try {
      const response = await fetch(`/api/creator/posts/${postId}/view`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.tracked) {
          setIsViewed(true)
          setViewsCount(data.viewsCount || viewsCount + 1)
          onViewTracked?.(data.viewsCount || viewsCount + 1)
        }
      }
    } catch (error) {
      console.error('Error tracking view:', error)
    } finally {
      setViewTracked(true)
    }
  }

  // Toggle like
  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive"
      })
      return
    }

    if (likePending) return

    // Optimistic update
    const newIsLiked = !isLiked
    const newCount = newIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1)
    setIsLiked(newIsLiked)
    setLikesCount(newCount)

    setLikePending(true)
    try {
      const response = await fetch(`/api/creator/posts/${postId}/like`, {
        method: 'POST'
      })

      if (!response.ok) {
        // Revert on error
        setIsLiked(!newIsLiked)
        setLikesCount(likesCount)
        throw new Error('Failed to update like')
      }

      const data = await response.json()
      setLikesCount(data.likesCount || newCount)
      onLikeChange?.(newIsLiked, data.likesCount || newCount)

    } catch (error) {
      console.error('Error toggling like:', error)
      toast({
        title: "Failed to update like",
        description: "Please try again",
        variant: "destructive"
      })
    } finally {
      setLikePending(false)
    }
  }

  // Size classes
  const sizeClasses = {
    sm: {
      button: "h-7 px-2",
      icon: "h-3 w-3",
      text: "text-xs"
    },
    md: {
      button: "h-9 px-3",
      icon: "h-4 w-4",
      text: "text-sm"
    },
    lg: {
      button: "h-11 px-4",
      icon: "h-5 w-5",
      text: "text-base"
    }
  }

  const sizes = sizeClasses[size]

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            sizes.button,
            "gap-1.5 transition-all",
            isLiked && "text-red-500"
          )}
          onClick={handleLikeToggle}
          disabled={likePending}
        >
          {likePending ? (
            <Loader2 className={cn(sizes.icon, "animate-spin")} />
          ) : (
            <Heart
              className={cn(
                sizes.icon,
                "transition-all",
                isLiked && "fill-current"
              )}
            />
          )}
          <span className={sizes.text}>{formatNumber(likesCount)}</span>
          {showLabels && <span className={sizes.text}>Likes</span>}
        </Button>

        {/* Comments Button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(sizes.button, "gap-1.5")}
          onClick={(e) => {
            if (onCommentClick) {
              onCommentClick(e)
            } else {
              setShowComments(true)
            }
          }}
        >
          <MessageSquare className={sizes.icon} />
          <span className={sizes.text}>{formatNumber(commentsCount)}</span>
          {showLabels && <span className={sizes.text}>Comments</span>}
        </Button>

        {/* Views Display */}
        <div className={cn("flex items-center gap-1.5 px-3 text-gray-500", sizes.text)}>
          <Eye className={cn(sizes.icon, isViewed && "text-blue-500")} />
          <span>{formatNumber(viewsCount)}</span>
          {showLabels && <span>Views</span>}
        </div>
      </div>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <CommentsSection
            postId={postId}
            isAuthenticated={isAuthenticated}
            currentUserId={currentUserId}
            creatorId={creatorId}
            className="mt-4"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}