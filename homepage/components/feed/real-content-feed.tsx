"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Video,
  Radio,
  Calendar,
  Clock,
  Heart,
  Play,
  Users,
  MessageSquare,
  ChevronRight,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  Share2,
  BookmarkPlus,
  MoreVertical,
  Grid,
  Layers,
  Globe,
  Lock,
  FileText,
  Image as ImageIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
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
  userSubscriptions?: { creator_id: string; tier_id: string }[]
  className?: string
}

export function RealContentFeed({ isAuthenticated, userSubscriptions = [], className }: RealContentFeedProps) {
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
  
  const { toast } = useToast()

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
  }, [activeTab, isAuthenticated])

  const handleLikeToggle = async (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to like posts.",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch(`/api/creator/posts/${postId}/like`, {
        method: 'POST'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to like post')
      }

      const result = await response.json()
      
      // Update post in local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes_count: result.likesCount,
              // Add a temporary is_liked property for UI state
              is_liked: result.isLiked 
            }
          : post
      ))
    } catch (error: any) {
      console.error('Like error:', error)
      toast({
        title: "Failed to like post",
        description: error.message,
        variant: "destructive"
      })
    }
  }

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
    // Public posts are always accessible
    if (post.is_public) return true
    
    // Preview posts are accessible to non-authenticated users
    if (post.is_preview && !isAuthenticated) return true
    
    // Creator can always access their own posts
    if (isAuthenticated && post.creator_id) {
      // Check if user has subscription to this creator
      const hasSubscription = userSubscriptions?.some(sub => sub.creator_id === post.creator_id)
      if (hasSubscription) return true
    }
    
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            ? "grid grid-cols-1 lg:grid-cols-2 gap-6" 
            : "space-y-4"
        )}>
          {filteredPosts.map((post) => {
            const hasAccess = canUserAccessPost(post)
            
            return (
              <Card 
                key={post.id} 
                className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
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
                      className="w-full h-full object-cover"
                    />
                    
                    {!hasAccess && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">Subscribe to Access</p>
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
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.creator?.profile_image_url} />
                        <AvatarFallback>
                          {post.creator?.display_name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{post.creator?.display_name}</p>
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
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                          Save
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
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
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    {post.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
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
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {(post.views_count ?? 0).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {(post.comments_count ?? 0).toLocaleString()}
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleLikeToggle(post.id)}
                      className={cn(
                        "gap-1 hover:text-red-600",
                        (post as any).is_liked && "text-red-600"
                      )}
                    >
                      <Heart 
                        className={cn(
                          "h-4 w-4",
                          (post as any).is_liked && "fill-current"
                        )}
                      />
                      {(post.likes_count ?? 0).toLocaleString()}
                    </Button>
                  </div>
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