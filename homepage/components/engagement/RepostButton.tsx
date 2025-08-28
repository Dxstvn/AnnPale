"use client"

import { useState, useEffect } from "react"
import { Repeat2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

interface RepostButtonProps {
  postId: string
  creatorName: string
  initialReposted?: boolean
  initialCount?: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  onRepostChange?: (reposted: boolean, count: number) => void
}

export function RepostButton({
  postId,
  creatorName,
  initialReposted = false,
  initialCount = 0,
  size = "md",
  showCount = true,
  onRepostChange,
}: RepostButtonProps) {
  const [reposted, setReposted] = useState(initialReposted)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)
  const [quoteText, setQuoteText] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const { user } = useSupabaseAuth()
  const supabase = createClient()

  // Check if user has reposted this post on mount
  useEffect(() => {
    if (user && postId) {
      checkUserRepost()
    }
  }, [user, postId])

  const checkUserRepost = async () => {
    const { data, error } = await supabase
      .from("post_engagements")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user?.id)
      .eq("engagement_type", "repost")
      .single()

    if (data && !error) {
      setReposted(true)
    }
  }

  const formatCount = (num: number): string => {
    if (num < 1000) return num.toString()
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
    return `${(num / 1000000).toFixed(1)}M`
  }

  const handleQuickRepost = async () => {
    if (!user) {
      toast.error("Please sign in to repost")
      return
    }

    if (reposted) {
      // Show unrepost confirmation
      handleUnrepost()
    } else {
      await performRepost()
    }
  }

  const handleQuoteRepost = () => {
    if (!user) {
      toast.error("Please sign in to quote repost")
      return
    }
    setShowQuoteDialog(true)
  }

  const performRepost = async (quote?: string) => {
    // Optimistic update
    const newCount = count + 1
    setReposted(true)
    setCount(newCount)
    setIsAnimating(true)
    setIsLoading(true)

    // Trigger animation
    setTimeout(() => setIsAnimating(false), 600)

    try {
      // Add repost engagement
      const { error: engagementError } = await supabase
        .from("post_engagements")
        .insert({
          post_id: postId,
          user_id: user!.id,
          engagement_type: "repost",
          metadata: quote ? { quote } : null
        })

      if (engagementError) throw engagementError

      // Create a new post if it's a quote repost
      if (quote) {
        const { error: postError } = await supabase
          .from("posts")
          .insert({
            creator_id: user!.id,
            content: quote,
            post_type: "quote",
            referenced_post_id: postId,
            visibility: "public"
          })

        if (postError) throw postError
      }

      // Update reposts count
      const { error: updateError } = await supabase
        .from("posts")
        .update({ reposts_count: newCount })
        .eq("id", postId)

      if (updateError) throw updateError

      onRepostChange?.(true, newCount)
      toast.success(quote ? "Quote reposted!" : "Reposted!")
    } catch (error) {
      // Revert on error
      console.error("Error reposting:", error)
      setReposted(false)
      setCount(count)
      toast.error("Failed to repost")
    } finally {
      setIsLoading(false)
      setShowQuoteDialog(false)
      setQuoteText("")
    }
  }

  const handleUnrepost = async () => {
    if (!user) return

    // Optimistic update
    const newCount = Math.max(0, count - 1)
    setReposted(false)
    setCount(newCount)
    setIsLoading(true)

    try {
      // Remove repost engagement
      const { error: deleteError } = await supabase
        .from("post_engagements")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .eq("engagement_type", "repost")

      if (deleteError) throw deleteError

      // Update reposts count
      const { error: updateError } = await supabase
        .from("posts")
        .update({ reposts_count: newCount })
        .eq("id", postId)

      if (updateError) throw updateError

      onRepostChange?.(false, newCount)
      toast.success("Unreposted")
    } catch (error) {
      // Revert on error
      console.error("Error unreposting:", error)
      setReposted(true)
      setCount(count)
      toast.error("Failed to unrepost")
    } finally {
      setIsLoading(false)
    }
  }

  const submitQuoteRepost = () => {
    if (quoteText.trim().length === 0) {
      toast.error("Please add a comment")
      return
    }
    if (quoteText.length > 280) {
      toast.error("Quote must be 280 characters or less")
      return
    }
    performRepost(quoteText)
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
    <>
      <div className="inline-flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleQuickRepost}
          disabled={isLoading || !user}
          className={cn(
            "group relative gap-1.5 transition-all",
            sizeConfig.button,
            reposted && "text-green-600 hover:text-green-700",
            !reposted && "hover:text-green-600"
          )}
        >
          <Repeat2
            className={cn(
              sizeConfig.icon,
              "transition-all duration-300",
              isAnimating && "rotate-180 scale-110"
            )}
          />
          
          {showCount && (
            <span className={cn(
              sizeConfig.text,
              "font-medium transition-all",
              isAnimating && "scale-110"
            )}>
              {formatCount(count)}
            </span>
          )}
        </Button>

        {/* Quote Repost Option - only show when not already reposted */}
        {!reposted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleQuoteRepost}
            disabled={isLoading || !user}
            className={cn(
              "ml-1",
              sizeConfig.button,
              "hover:text-green-600"
            )}
          >
            <span className={sizeConfig.text}>Quote</span>
          </Button>
        )}
      </div>

      {/* Quote Repost Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Quote Repost</DialogTitle>
            <DialogDescription>
              Add your thoughts about @{creatorName}'s post
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Add a comment..."
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={280}
            />
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>{quoteText.length}/280</span>
              {quoteText.length > 260 && (
                <span className="text-orange-500">
                  {280 - quoteText.length} characters left
                </span>
              )}
            </div>

            {/* Original post preview */}
            <div className="p-3 border rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">
                <span className="font-medium">@{creatorName}</span>'s post will appear here
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowQuoteDialog(false)
                setQuoteText("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={submitQuoteRepost}
              disabled={isLoading || quoteText.trim().length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Quote Repost
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}