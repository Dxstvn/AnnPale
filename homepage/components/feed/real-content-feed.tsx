"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Video,
  Radio,
  Calendar,
  Clock,
  Play,
  Users,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  ThumbsUp,
  BookmarkPlus,
  MoreVertical,
  Grid,
  Layers,
  Globe,
  Lock,
  FileText,
  Image as ImageIcon,
  Send,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PostInteractions } from "@/components/ui/post-interactions"
import { CommentsSection } from "@/components/ui/comments-section"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Post, SubscriptionTier } from "@/types/posts"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface RealContentFeedProps {
  isAuthenticated: boolean
  userId?: string
  userSubscriptions?: { creator_id: string; tier_id: string }[]
  excludeLockedContent?: boolean
  className?: string
}

export function RealContentFeed({ isAuthenticated, userId, userSubscriptions = [], excludeLockedContent = false, className }: RealContentFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "vertical">("grid")
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  // Load posts from API
  const loadPosts = async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true)
        setOffset(0)
        setError(null)
      } else {
        setLoadingMore(true)
      }
      
      const params = new URLSearchParams()
      
      // Add filters based on active tab
      if (activeTab !== 'all') {
        params.set('contentType', activeTab)
      }
      
      // Add pagination
      const currentOffset = reset ? 0 : offset
      params.set('offset', currentOffset.toString())
      params.set('limit', '10') // Load 10 posts at a time
      
      // If not authenticated, only show preview posts
      if (!isAuthenticated) {
        params.set('preview', 'true')
      }

      // Add excludeLockedContent parameter if set
      if (excludeLockedContent) {
        params.set('excludeLockedContent', 'true')
      }

      const response = await fetch(`/api/feed/posts?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to load posts')
      }
      
      const data = await response.json()
      
      if (reset) {
        setPosts(data.posts || [])
        setOffset(data.posts?.length || 0)
      } else {
        setPosts(prev => [...prev, ...(data.posts || [])])
        setOffset(prev => prev + (data.posts?.length || 0))
      }
      
      setTotal(data.total || 0)
      setHasMore(data.has_more || false)
      
    } catch (error) {
      console.error('Load posts error:', error)
      setError('Failed to load content. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Load more posts for infinite scroll
  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return
    await loadPosts(false)
  }

  useEffect(() => {
    loadPosts(true) // Reset when filters change
  }, [activeTab, isAuthenticated, excludeLockedContent])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />
      case "image": return <ImageIcon className="h-4 w-4" />
      case "text": return <FileText className="h-4 w-4" />
      case "live": return <Radio className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "video": return "default"
      case "image": return "secondary"
      case "text": return "outline"
      case "live": return "destructive"
      default: return "outline"
    }
  }

  const getAccessIcon = (post: Post) => {
    if (post.is_public) return <Globe className="h-4 w-4 text-green-600" />
    return <Lock className="h-4 w-4 text-purple-600" />
  }

  const canUserAccessPost = (post: Post) => {
    // The API already determines access based on tier restrictions
    // Use the has_access field if it exists, otherwise fall back to basic checks
    if ('has_access' in post) {
      return post.has_access ?? false
    }
    
    // Fallback for posts that don't have has_access field
    // Public posts are always accessible
    if (post.is_public) return true
    
    // Preview posts are accessible to non-authenticated users
    if (post.is_preview && !isAuthenticated) return true
    
    return false
  }

  // Filter posts based on search and access
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.creator?.display_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-muted"></div>
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadPosts}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="image">Images</TabsTrigger>
              <TabsTrigger value="text">Posts</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'vertical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('vertical')}
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content Feed */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? "No content found matching your search." 
              : isAuthenticated 
                ? "No content available. Follow some creators to see their posts!"
                : "No preview content available."
            }
          </p>
          {!isAuthenticated && (
            <Link href="/login">
              <Button>Sign In to See More Content</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid'
            ? "flex flex-wrap justify-center gap-6"
            : "space-y-4"
        )}>
          {filteredPosts.map((post) => {
            const hasAccess = canUserAccessPost(post)
            
            return (
              <Card
                key={post.id}
                className={cn(
                  "overflow-hidden hover:shadow-xl transition-all",
                  viewMode === "grid" && "w-full max-w-md hover:-translate-y-1",
                  viewMode !== "grid" && "w-full",
                  expandedPostId === post.id && "ring-2 ring-purple-500/20"
                )}
              >
                {/* Media Thumbnail */}
                {(post.content_type === "video" || post.content_type === "image") && post.thumbnail_url && (
                  <div className="relative aspect-video bg-gray-100">
                    {post.content_type === "live" && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-4 left-4 z-10"
                      >
                        <Radio className="h-3 w-3 mr-1" />
                        LIVE
                      </Badge>
                    )}
                    
                    <img 
                      src={post.thumbnail_url} 
                      alt={post.title}
                      className={cn(
                        "w-full h-full object-cover",
                        !hasAccess && "blur-3xl"
                      )}
                    />
                    
                    {!hasAccess && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="h-12 w-12 mx-auto mb-3" />
                          <p className="text-base font-semibold">Premium Content</p>
                          <p className="text-sm mt-1 opacity-90">Subscribe to view</p>
                        </div>
                      </div>
                    )}
                    
                    {hasAccess && post.content_type === "video" && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button size="lg" className="bg-white/90 text-black hover:bg-white">
                          <Play className="h-5 w-5 mr-2" />
                          Play
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/fan/creators/${post.creator_id}`)
                      }}
                    >
                      <Avatar>
                        <AvatarImage src={post.creator?.profile_image_url} />
                        <AvatarFallback>
                          {post.creator?.display_name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold hover:underline">{post.creator?.display_name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            @{post.creator?.username}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {hasAccess && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedPostId(expandedPostId === post.id ? null : post.id)
                          }}
                          title={expandedPostId === post.id ? "Collapse" : "Expand"}
                        >
                          {expandedPostId === post.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <BookmarkPlus className="h-4 w-4 mr-2" />
                            Save
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div
                    className={hasAccess ? "cursor-pointer" : ""}
                    onClick={() => hasAccess && setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(post.content_type)}
                      <Badge variant={getTypeBadgeVariant(post.content_type)}>
                        {post.content_type}
                      </Badge>
                      {getAccessIcon(post)}
                      {post.is_featured && (
                        <Badge variant="outline" className="text-yellow-600">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <h3 className={cn(
                      "text-lg font-semibold",
                      hasAccess && "hover:text-purple-600 transition-colors",
                      !hasAccess && "blur-md select-none"
                    )}>{post.title}</h3>
                    {post.description && (
                      <p className={cn(
                        "text-sm text-gray-600 mt-1 line-clamp-2",
                        !hasAccess && "blur-lg select-none"
                      )}>
                        {post.description}
                      </p>
                    )}
                  </div>

                  {/* Access Gate for non-accessible content */}
                  {!hasAccess && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                      <p className="text-sm text-purple-700 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {!isAuthenticated 
                          ? "Sign in to access subscriber content"
                          : "Subscribe to access this content"
                        }
                      </p>
                      <Link href={!isAuthenticated ? "/login" : `/creator/${post.creator_id}`}>
                        <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
                          {!isAuthenticated ? "Sign In" : "Subscribe"}
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Engagement Stats */}
                  <div className="pt-2 border-t">
                    <PostInteractions
                      postId={post.id}
                      creatorId={post.creator_id}
                      initialLikes={post.likes_count ?? 0}
                      initialComments={post.comments_count ?? 0}
                      initialViews={post.views_count ?? 0}
                      isLiked={(post as any).is_liked || false}
                      isViewed={(post as any).is_viewed || false}
                      isAuthenticated={isAuthenticated}
                      currentUserId={userId}
                      size="sm"
                      className="justify-between"
                      onCommentClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        setExpandedPostId(expandedPostId === post.id ? null : post.id)
                      }}
                    />
                  </div>

                  {/* Expanded Comments Section */}
                  {expandedPostId === post.id && hasAccess && (
                    <div
                      className="mt-4 pt-4 border-t space-y-4 animate-in slide-in-from-top-2 duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CommentsSection
                        postId={post.id}
                        isAuthenticated={isAuthenticated}
                        currentUserId={userId}
                        creatorId={post.creator_id}
                      />
                    </div>
                  )}
                </CardHeader>
              </Card>
            )
          })}
        </div>
      )}

      {/* Load More / Infinite Scroll */}
      {hasMore && !loading && (
        <div className="text-center pt-8">
          <Button 
            onClick={loadMorePosts}
            disabled={loadingMore}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Loading more...
              </>
            ) : (
              <>Load More Posts</>
            )}
          </Button>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {posts.length} of {total} posts
          </div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center pt-8">
          <p className="text-muted-foreground">
            You've seen all posts! 🎉
          </p>
        </div>
      )}
    </div>
  )
}