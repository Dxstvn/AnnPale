"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MessageCircle, Heart, MoreHorizontal, Send, Loader2, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  post_id: string
  user_id: string
  parent_comment_id?: string
  content: string
  likes_count: number
  created_at: string
  user: {
    id: string
    name: string
    username?: string
    avatar_url?: string
  }
  replies?: Comment[]
  isLiked?: boolean
}

interface CommentThreadProps {
  postId: string
  initialCount?: number
  showThread?: boolean
  onCommentChange?: (count: number) => void
}

export function CommentThread({
  postId,
  initialCount = 0,
  showThread = false,
  onCommentChange,
}: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [count, setCount] = useState(initialCount)
  const [isExpanded, setIsExpanded] = useState(showThread)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const { user } = useSupabaseAuth()
  const supabase = createClient()
  const commentsPerPage = 10
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load comments when thread is expanded
  useEffect(() => {
    if (isExpanded && comments.length === 0) {
      loadComments()
    }
  }, [isExpanded])

  // Set up real-time subscription
  useEffect(() => {
    if (!isExpanded || !postId) return

    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${postId}`
        },
        handleNewComment
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isExpanded, postId])

  const handleNewComment = (payload: any) => {
    // Add new comment to the thread in real-time
    if (payload.new && payload.new.id) {
      loadSingleComment(payload.new.id)
    }
  }

  const loadSingleComment = async (commentId: string) => {
    const { data, error } = await supabase
      .from("post_comments")
      .select(`
        *,
        user:profiles!user_id(id, name, display_name, avatar_url)
      `)
      .eq("id", commentId)
      .single()

    if (data && !error) {
      const newComment = formatComment(data)
      setComments(prev => [newComment, ...prev])
      setCount(prev => prev + 1)
      onCommentChange?.(count + 1)
    }
  }

  const formatComment = (raw: any): Comment => {
    return {
      ...raw,
      user: {
        id: raw.user.id,
        name: raw.user.display_name || raw.user.name,
        username: raw.user.display_name?.toLowerCase().replace(/\s/g, ''),
        avatar_url: raw.user.avatar_url
      }
    }
  }

  const loadComments = async (loadMore = false) => {
    if (loadMore) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
    }

    try {
      const from = loadMore ? page * commentsPerPage : 0
      const to = from + commentsPerPage - 1

      const { data, error, count: totalCount } = await supabase
        .from("post_comments")
        .select(`
          *,
          user:profiles!user_id(id, name, display_name, avatar_url)
        `, { count: 'exact' })
        .eq("post_id", postId)
        .is("parent_comment_id", null)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) throw error

      const formattedComments = data?.map(formatComment) || []
      
      // Load replies for each comment
      for (const comment of formattedComments) {
        const { data: replies } = await supabase
          .from("post_comments")
          .select(`
            *,
            user:profiles!user_id(id, name, display_name, avatar_url)
          `)
          .eq("parent_comment_id", comment.id)
          .order("created_at", { ascending: true })
          .limit(3) // Show max 3 replies initially

        comment.replies = replies?.map(formatComment) || []
      }

      if (loadMore) {
        setComments(prev => [...prev, ...formattedComments])
        setPage(prev => prev + 1)
      } else {
        setComments(formattedComments)
        if (totalCount) {
          setCount(totalCount)
          onCommentChange?.(totalCount)
        }
      }

      setHasMore(formattedComments.length === commentsPerPage)
    } catch (error) {
      console.error("Error loading comments:", error)
      toast.error("Failed to load comments")
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error("Please sign in to comment")
      return
    }

    if (newComment.trim().length === 0) {
      toast.error("Please write a comment")
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim()
        })
        .select()
        .single()

      if (error) throw error

      // Update comment count on post
      await supabase
        .from("posts")
        .update({ comments_count: count + 1 })
        .eq("id", postId)

      setNewComment("")
      toast.success("Comment posted!")
      
      // Reload comments to get the new one with user data
      loadComments()
    } catch (error) {
      console.error("Error posting comment:", error)
      toast.error("Failed to post comment")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!user) {
      toast.error("Please sign in to reply")
      return
    }

    if (replyText.trim().length === 0) {
      toast.error("Please write a reply")
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          parent_comment_id: parentId,
          content: replyText.trim()
        })

      if (error) throw error

      setReplyText("")
      setReplyingTo(null)
      toast.success("Reply posted!")
      
      // Reload comments to get the new reply
      loadComments()
    } catch (error) {
      console.error("Error posting reply:", error)
      toast.error("Failed to post reply")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLikeComment = async (commentId: string, isLiked: boolean) => {
    if (!user) {
      toast.error("Please sign in to like comments")
      return
    }

    try {
      if (!isLiked) {
        await supabase
          .from("comment_likes")
          .insert({
            comment_id: commentId,
            user_id: user.id
          })
      } else {
        await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", user.id)
      }

      // Update local state
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: !isLiked,
              likes_count: isLiked ? comment.likes_count - 1 : comment.likes_count + 1
            }
          }
          return comment
        })
      )
    } catch (error) {
      console.error("Error toggling comment like:", error)
      toast.error("Failed to update like")
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={cn("flex gap-3", isReply && "ml-12")}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.user.avatar_url} />
        <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{comment.user.name}</span>
          {comment.user.username && (
            <span className="text-gray-500 text-sm">@{comment.user.username}</span>
          )}
          <span className="text-gray-500 text-xs">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
        </div>
        
        <p className="text-sm text-gray-900">{comment.content}</p>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleLikeComment(comment.id, comment.isLiked || false)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            <Heart className={cn(
              "h-3.5 w-3.5",
              comment.isLiked && "fill-current text-red-500"
            )} />
            {comment.likes_count > 0 && comment.likes_count}
          </button>
          
          {!isReply && (
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="text-xs text-gray-500 hover:text-blue-500 transition-colors"
            >
              Reply
            </button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Report</DropdownMenuItem>
              {user?.id === comment.user_id && (
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Reply input */}
        {replyingTo === comment.id && (
          <div className="flex gap-2 mt-2">
            <Textarea
              placeholder={`Reply to @${comment.user.username || comment.user.name}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 min-h-[60px] text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmitReply(comment.id)
                }
              }}
            />
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                onClick={() => handleSubmitReply(comment.id)}
                disabled={isLoading || replyText.trim().length === 0}
              >
                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReplyingTo(null)
                  setReplyText("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-3 mt-3">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-3">
      {/* Comment button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="gap-1.5 hover:text-blue-600"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">{count}</span>
      </Button>

      {/* Comment thread */}
      {isExpanded && (
        <div className="space-y-4 border-t pt-4">
          {/* New comment input */}
          {user && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  ref={textareaRef}
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmitComment()
                    }
                  }}
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSubmitComment}
                    disabled={isLoading || newComment.trim().length === 0}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        Post
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Comments list */}
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
              
              {hasMore && (
                <Button
                  variant="ghost"
                  onClick={() => loadComments(true)}
                  disabled={isLoadingMore}
                  className="w-full"
                >
                  {isLoadingMore ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Load more comments
                    </>
                  )}
                </Button>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  )
}