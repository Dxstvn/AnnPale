"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Heart,
  MessageSquare,
  MoreVertical,
  Send,
  Loader2,
  Reply,
  Trash2,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { PostComment } from "@/types/posts"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CommentsSectionProps {
  postId: string
  isAuthenticated: boolean
  currentUserId?: string
  creatorId?: string
  className?: string
}

export function CommentsSection({
  postId,
  isAuthenticated,
  currentUserId,
  creatorId,
  className
}: CommentsSectionProps) {
  const [comments, setComments] = useState<PostComment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [posting, setPosting] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())

  const { toast } = useToast()

  // Load comments
  const loadComments = useCallback(async (reset: boolean = false) => {
    if (!reset && loadingMore) return

    try {
      if (reset) {
        setLoading(true)
        setOffset(0)
      } else {
        setLoadingMore(true)
      }

      const currentOffset = reset ? 0 : offset
      const response = await fetch(
        `/api/creator/posts/${postId}/comments?offset=${currentOffset}&limit=20`
      )

      if (!response.ok) {
        throw new Error('Failed to load comments')
      }

      const data = await response.json()

      if (reset) {
        setComments(data.comments || [])
      } else {
        setComments(prev => [...prev, ...(data.comments || [])])
      }

      setTotal(data.total || 0)
      setHasMore(data.has_more || false)
      setOffset(currentOffset + (data.comments?.length || 0))

    } catch (error) {
      console.error('Error loading comments:', error)
      toast({
        title: "Failed to load comments",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [postId, offset, loadingMore, toast])

  // Post new comment
  const handlePostComment = async (content: string, parentId?: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive"
      })
      return
    }

    if (!content.trim()) return

    setPosting(true)
    try {
      const response = await fetch(`/api/creator/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content.trim(),
          parent_comment_id: parentId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to post comment')
      }

      const data = await response.json()

      // Ensure the comment has complete user data
      const commentWithFullData = {
        ...data.comment,
        user: data.comment.user || {
          id: userId,
          display_name: userProfile?.display_name || userProfile?.username || 'User',
          username: userProfile?.username || 'user',
          avatar_url: userProfile?.avatar_url || null
        },
        is_own: true,
        is_liked: false
      }

      if (parentId) {
        // Add reply to parent comment
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), commentWithFullData]
            }
          }
          return comment
        }))
        setReplyingTo(null)
        setReplyContent("")
      } else {
        // Add new top-level comment
        setComments(prev => [commentWithFullData, ...prev])
        setNewComment("")
      }

      setTotal(prev => prev + 1)

      toast({
        title: "Comment posted successfully!",
        description: "Your comment has been added to the discussion",
        variant: "success"
      })

    } catch (error) {
      console.error('Error posting comment:', error)
      toast({
        title: "Failed to post comment",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setPosting(false)
    }
  }

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!isAuthenticated) return

    try {
      const response = await fetch(
        `/api/creator/posts/${postId}/comments?commentId=${commentId}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      // Remove comment from list
      setComments(prev => prev.filter(c => c.id !== commentId))
      setTotal(prev => prev - 1)

      toast({
        title: "Comment deleted",
        description: "The comment has been removed"
      })

    } catch (error) {
      console.error('Error deleting comment:', error)
      toast({
        title: "Failed to delete comment",
        description: "Please try again",
        variant: "destructive"
      })
    }
  }

  // Toggle replies expansion
  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev)
      if (next.has(commentId)) {
        next.delete(commentId)
      } else {
        next.add(commentId)
      }
      return next
    })
  }

  // Load initial comments
  useEffect(() => {
    loadComments(true)
  }, [postId])

  // Comment component
  const CommentItem = ({ comment, isReply = false }: { comment: PostComment, isReply?: boolean }) => {
    const isOwn = comment.user_id === currentUserId
    const isCreator = comment.user_id === creatorId
    const hasReplies = (comment.replies?.length || 0) > 0
    const showReplies = expandedReplies.has(comment.id)

    return (
      <div className={cn("flex gap-3", isReply && "ml-12")}>
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.user?.avatar_url} />
          <AvatarFallback>
            {comment.user?.display_name?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {comment.user?.display_name || 'Anonymous'}
                </span>
                {isCreator && (
                  <Badge variant="secondary" className="text-xs">Creator</Badge>
                )}
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              {comment.parent_comment && (
                <p className="text-xs text-gray-500">
                  Replying to @{comment.parent_comment.user?.username}
                </p>
              )}
            </div>

            {(isOwn || currentUserId === creatorId) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <p className="text-sm">{comment.content}</p>

          <div className="flex items-center gap-4">
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  if (replyingTo === comment.id) {
                    setReplyingTo(null)
                    setReplyContent("")
                  } else {
                    setReplyingTo(comment.id)
                    setReplyContent("")
                  }
                }}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}

            {hasReplies && !isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => toggleReplies(comment.id)}
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Hide {comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    View {comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Reply input */}
          {replyingTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[60px] text-sm"
                disabled={posting}
              />
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  onClick={() => handlePostComment(replyContent, comment.id)}
                  disabled={posting || !replyContent.trim()}
                >
                  {posting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyContent("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {showReplies && comment.replies && (
            <div className="mt-3 space-y-3">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Comments list - scrollable */}
      <div className="flex-1 overflow-y-auto max-h-96 space-y-4 mb-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No comments yet</p>
            {isAuthenticated && (
              <p className="text-sm text-gray-400 mt-1">Be the first to comment!</p>
            )}
          </div>
        ) : (
          <>
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => loadComments(false)}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>Load More Comments</>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Comment input - fixed at bottom */}
      {isAuthenticated && (
        <div className="border-t pt-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-[80px]"
                disabled={posting}
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => handlePostComment(newComment)}
                  disabled={posting || !newComment.trim()}
                >
                  {posting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}