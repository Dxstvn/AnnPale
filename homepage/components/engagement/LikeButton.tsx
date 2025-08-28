"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

interface LikeButtonProps {
  postId: string
  initialLiked?: boolean
  initialCount?: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  onLikeChange?: (liked: boolean, count: number) => void
}

export function LikeButton({
  postId,
  initialLiked = false,
  initialCount = 0,
  size = "md",
  showCount = true,
  onLikeChange,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useSupabaseAuth()
  const supabase = createClient()

  // Check if user has liked this post on mount
  useEffect(() => {
    if (user && postId) {
      checkUserLike()
    }
  }, [user, postId])

  const checkUserLike = async () => {
    const { data, error } = await supabase
      .from("post_engagements")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user?.id)
      .eq("engagement_type", "like")
      .single()

    if (data && !error) {
      setLiked(true)
    }
  }

  const formatCount = (num: number): string => {
    if (num < 1000) return num.toString()
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
    return `${(num / 1000000).toFixed(1)}M`
  }

  const handleLike = async () => {
    if (!user) {
      toast.error("Please sign in to like posts")
      return
    }

    // Optimistic update
    const newLiked = !liked
    const newCount = newLiked ? count + 1 : Math.max(0, count - 1)
    
    setLiked(newLiked)
    setCount(newCount)
    setIsAnimating(true)
    setIsLoading(true)

    // Trigger animation
    setTimeout(() => setIsAnimating(false), 600)

    try {
      if (newLiked) {
        // Add like
        const { error } = await supabase
          .from("post_engagements")
          .insert({
            post_id: postId,
            user_id: user.id,
            engagement_type: "like"
          })

        if (error) throw error
      } else {
        // Remove like
        const { error } = await supabase
          .from("post_engagements")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id)
          .eq("engagement_type", "like")

        if (error) throw error
      }

      // Update post likes count
      const { error: updateError } = await supabase
        .from("posts")
        .update({ likes_count: newCount })
        .eq("id", postId)

      if (updateError) throw updateError

      onLikeChange?.(newLiked, newCount)
    } catch (error) {
      // Revert on error
      console.error("Error toggling like:", error)
      setLiked(!newLiked)
      setCount(liked ? count : count + 1)
      toast.error("Failed to update like")
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: {
      button: "h-8 px-2",
      icon: "h-4 w-4",
      text: "text-xs"
    },
    md: {
      button: "h-10 px-3",
      icon: "h-5 w-5",
      text: "text-sm"
    },
    lg: {
      button: "h-12 px-4",
      icon: "h-6 w-6",
      text: "text-base"
    }
  }

  const sizeConfig = sizeClasses[size]

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading || !user}
      className={cn(
        "group relative gap-1.5 transition-all",
        sizeConfig.button,
        liked && "text-red-500 hover:text-red-600",
        !liked && "hover:text-red-500"
      )}
    >
      <div className="relative">
        <Heart
          className={cn(
            sizeConfig.icon,
            "transition-all duration-300",
            liked && "fill-current",
            isAnimating && "scale-125"
          )}
        />
        
        {/* Animation burst effect */}
        {isAnimating && liked && (
          <div className="absolute inset-0 -m-2">
            <div className="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-30" />
            <div className="absolute inset-0 animate-ping bg-red-400 rounded-full opacity-20 animation-delay-100" />
          </div>
        )}
      </div>

      {showCount && (
        <span className={cn(
          sizeConfig.text,
          "font-medium transition-all",
          isAnimating && "scale-110"
        )}>
          {formatCount(count)}
        </span>
      )}

      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-md overflow-hidden">
        <span className={cn(
          "absolute inset-0 bg-red-500 opacity-0 transition-opacity",
          isAnimating && "animate-ripple"
        )} />
      </span>
    </Button>
  )
}

// Add custom animation styles to globals.css
const animationStyles = `
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.3;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 0.6s ease-out;
}

.animation-delay-100 {
  animation-delay: 100ms;
}
`