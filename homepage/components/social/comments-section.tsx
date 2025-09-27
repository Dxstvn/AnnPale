"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  MoreVertical,
  Flag,
  Trash2,
  Edit2,
  Reply,
  ThumbsUp,
  Star,
  CheckCircle,
  Shield,
  Send,
  Filter,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

// Comment data types
export interface Comment {
  id: string
  author: {
    id: string
    name: string
    avatar?: string
    isCreator?: boolean
    isVerified?: boolean
    isModerator?: boolean
  }
  content: string
  timestamp: Date
  likes: number
  hasLiked?: boolean
  replies?: Comment[]
  isEdited?: boolean
  isPinned?: boolean
  videoId?: string
  videoTitle?: string
}

export interface CommentsSectionData {
  comments: Comment[]
  totalComments: number
  allowComments: boolean
  requireApproval?: boolean
  sortBy?: "newest" | "oldest" | "popular"
}

interface CommentsSectionProps {
  data: CommentsSectionData
  currentUserId?: string
  onCommentSubmit?: (content: string, parentId?: string) => void
  onCommentLike?: (commentId: string) => void
  onCommentDelete?: (commentId: string) => void
  onCommentEdit?: (commentId: string, content: string) => void
  onCommentReport?: (commentId: string) => void
  className?: string
  variant?: "full" | "compact" | "minimal"
}

// Single comment component
function CommentItem({
  comment,
  currentUserId,
  onLike,
  onDelete,
  onEdit,
  onReport,
  onReply,
  depth = 0
}: {
  comment: Comment
  currentUserId?: string
  onLike?: (commentId: string) => void
  onDelete?: (commentId: string) => void
  onEdit?: (commentId: string, content: string) => void
  onReport?: (commentId: string) => void
  onReply?: (content: string) => void
  depth?: number
}) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editContent, setEditContent] = React.useState(comment.content)
  const [showReplies, setShowReplies] = React.useState(true)
  const [isReplying, setIsReplying] = React.useState(false)
  const [replyContent, setReplyContent] = React.useState("")
  const [localLikes, setLocalLikes] = React.useState(comment.likes)
  const [hasLiked, setHasLiked] = React.useState(comment.hasLiked)
  const t = useTranslations('components.commentsSection')
  
  const isAuthor = currentUserId === comment.author.id
  const canModerate = comment.author.isModerator || comment.author.isCreator
  
  const handleLike = () => {
    const newLikedState = !hasLiked
    setHasLiked(newLikedState)
    setLocalLikes(prev => newLikedState ? prev + 1 : prev - 1)
    onLike?.(comment.id)
  }
  
  const handleEdit = () => {
    onEdit?.(comment.id, editContent)
    setIsEditing(false)
    toast.success("Comment updated")
  }
  
  const handleReply = () => {
    if (replyContent.trim()) {
      onReply?.(replyContent)
      setReplyContent("")
      setIsReplying(false)
      toast.success("Reply posted")
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "space-y-3",
        depth > 0 && "ml-12 pl-4 border-l-2 border-gray-200 dark:border-gray-700"
      )}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          {/* Author info */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{comment.author.name}</span>
            {comment.author.isCreator && (
              <Badge className="bg-purple-600 text-xs">
                <CheckCircle className="h-3 w-3 mr-0.5" />
                Creator
              </Badge>
            )}
            {comment.author.isVerified && (
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-0.5" />
                Verified
              </Badge>
            )}
            {comment.author.isModerator && (
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-0.5" />
                Mod
              </Badge>
            )}
            {comment.isPinned && (
              <Badge className="bg-yellow-500 text-xs">
                <Star className="h-3 w-3 mr-0.5" />
                Pinned
              </Badge>
            )}
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>
          
          {/* Comment content */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit}>
                  {t('save', { defaultValue: 'Save' })}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(comment.content)
                  }}
                >
                  {t('cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {comment.content}
            </p>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1 text-xs transition-colors",
                hasLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", hasLiked && "fill-current")} />
              <span>{localLikes}</span>
            </button>
            
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-500"
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </button>
            
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-500"
              >
                {showReplies ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span>{comment.replies.length} replies</span>
              </button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthor && (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        onDelete?.(comment.id)
                        toast.success("Comment deleted")
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
                {!isAuthor && (
                  <DropdownMenuItem 
                    onClick={() => {
                      onReport?.(comment.id)
                      toast.info("Comment reported")
                    }}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Reply input */}
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2 pt-2"
            >
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply}>
                  <Send className="h-3 w-3 mr-1" />
                  {t('reply')}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setIsReplying(false)
                    setReplyContent("")
                  }}
                >
                  {t('cancel')}
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && showReplies && (
            <div className="space-y-3 mt-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onLike={onLike}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onReport={onReport}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Comment input form
function CommentInput({
  onSubmit,
  placeholder,
  buttonText
}: {
  onSubmit: (content: string) => void
  placeholder?: string
  buttonText?: string
}) {
  const [content, setContent] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const t = useTranslations('components.commentsSection')
  
  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content)
      setContent("")
      setIsFocused(false)
    }
  }
  
  return (
    <div className="space-y-2">
      <Textarea
        placeholder={placeholder || t('placeholder')}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className={cn(
          "transition-all",
          isFocused ? "min-h-[100px]" : "min-h-[60px]"
        )}
      />
      <AnimatePresence>
        {(isFocused || content) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-end gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setContent("")
                setIsFocused(false)
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!content.trim()}
            >
              <Send className="h-3 w-3 mr-1" />
              {buttonText || t('postButton')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Sort/filter controls
function CommentControls({
  sortBy,
  onSortChange,
  totalComments
}: {
  sortBy: CommentsSectionData['sortBy']
  onSortChange: (sort: CommentsSectionData['sortBy']) => void
  totalComments: number
}) {
  const t = useTranslations('components.commentsSection')
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-gray-500" />
        <span className="font-medium">{totalComments} {t('title')}</span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-3 w-3 mr-1" />
            {t('sortBy')} {sortBy}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSortChange("newest")}>
            {t('newest')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("oldest")}>
            {t('oldest')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("popular")}>
            {t('popular')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Main comments section component
export function CommentsSection({
  data,
  currentUserId,
  onCommentSubmit,
  onCommentLike,
  onCommentDelete,
  onCommentEdit,
  onCommentReport,
  className,
  variant = "full"
}: CommentsSectionProps) {
  const t = useTranslations('components.commentsSection')
  const [sortBy, setSortBy] = React.useState<CommentsSectionData['sortBy']>(
    data.sortBy || "newest"
  )
  const [localComments, setLocalComments] = React.useState(data.comments)
  
  const sortedComments = React.useMemo(() => {
    const sorted = [...localComments]
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      case "oldest":
        return sorted.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      case "popular":
        return sorted.sort((a, b) => b.likes - a.likes)
      default:
        return sorted
    }
  }, [localComments, sortBy])
  
  const pinnedComments = sortedComments.filter(c => c.isPinned)
  const regularComments = sortedComments.filter(c => !c.isPinned)
  
  const handleCommentSubmit = (content: string, parentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        id: currentUserId || "user",
        name: "You",
        isVerified: true
      },
      content,
      timestamp: new Date(),
      likes: 0,
      hasLiked: false
    }
    
    if (parentId) {
      // Add as reply
      setLocalComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newComment]
          }
        }
        return comment
      }))
    } else {
      // Add as top-level comment
      setLocalComments(prev => [newComment, ...prev])
    }
    
    onCommentSubmit?.(content, parentId)
    toast.success("Comment posted!")
  }
  
  if (!data.allowComments) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">{t('disabled')}</p>
        </CardContent>
      </Card>
    )
  }
  
  if (variant === "minimal") {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              {data.totalComments} {t('title')}
            </span>
            <Button variant="outline" size="sm">
              {t('viewAll')}
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {sortedComments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-xs font-medium">{comment.author.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Full variant (default)
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment input */}
        <CommentInput
          onSubmit={(content) => handleCommentSubmit(content)}
          placeholder={data.requireApproval ? `${t('placeholder')} ${t('requiresApproval')}` : t('placeholder')}
        />
        
        {/* Controls */}
        <CommentControls
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalComments={data.totalComments}
        />
        
        {/* Comments list */}
        <div className="space-y-4">
          {/* Pinned comments */}
          {pinnedComments.length > 0 && (
            <div className="space-y-4 pb-4 border-b">
              {pinnedComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={currentUserId}
                  onLike={onCommentLike}
                  onDelete={onCommentDelete}
                  onEdit={onCommentEdit}
                  onReport={onCommentReport}
                  onReply={(content) => handleCommentSubmit(content, comment.id)}
                />
              ))}
            </div>
          )}
          
          {/* Regular comments */}
          {regularComments.length > 0 ? (
            regularComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onLike={onCommentLike}
                onDelete={onCommentDelete}
                onEdit={onCommentEdit}
                onReport={onCommentReport}
                onReply={(content) => handleCommentSubmit(content, comment.id)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t('noComments')} {t('beFirst')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}