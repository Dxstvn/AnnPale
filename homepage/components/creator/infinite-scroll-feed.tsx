"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Video,
  Image as ImageIcon,
  MessageSquare,
  Heart,
  Eye,
  Share2,
  Lock,
  Play,
  ChevronDown,
  Radio
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface Post {
  id: string
  creator_id: string
  title?: string
  description?: string
  content?: string
  content_type?: string
  thumbnail_url?: string
  video_url?: string
  image_url?: string
  images?: string[]
  videos?: string[]
  hashtags?: string[]
  is_public: boolean
  is_premium?: boolean
  access_tier_ids?: string[]
  visibility?: string
  view_count?: number
  created_at: string
  updated_at?: string
  // Virtual fields from joins
  author?: {
    id: string
    name: string
    username: string
    avatar_url: string
  }
  likes_count?: number
  comments_count?: number
  has_liked?: boolean
  has_access?: boolean
}

interface InfiniteScrollFeedProps {
  creatorId: string
  creatorName?: string
  creatorAvatar?: string
  userTier?: string | null
  initialLimit?: number
  loadMoreLimit?: number
  userId?: string | null
}

export function InfiniteScrollFeed({
  creatorId,
  creatorName,
  creatorAvatar,
  userTier,
  initialLimit = 3,
  loadMoreLimit = 6,
  userId
}: InfiniteScrollFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null) // null = loading, false = not subscribed, true = subscribed
  const [userSubscriptionTier, setUserSubscriptionTier] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver>()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (!userId) {
        setIsSubscribed(false)
        setUserSubscriptionTier(null)
        return
      }
      
      const { data: subscription } = await supabase
        .from('creator_subscriptions')
        .select('tier_id, status')
        .eq('subscriber_id', userId)
        .eq('creator_id', creatorId)
        .eq('status', 'active')
        .single()
      
      if (subscription) {
        console.log('Subscription found:', subscription)
        setIsSubscribed(true)
        setUserSubscriptionTier(subscription.tier_id)
      } else {
        console.log('No subscription found for user:', userId, 'creator:', creatorId)
        setIsSubscribed(false)
        setUserSubscriptionTier(null)
      }
    }
    
    checkSubscription()
  }, [userId, creatorId])

  // Determine if user has access based on subscription
  const hasAccessToPost = (postIsPublic: boolean, postTierIds?: string[]): boolean => {
    // Public posts are always accessible
    if (postIsPublic) return true
    
    // User's own posts are always accessible
    if (userId === creatorId) return true
    
    // If user is not subscribed, no access to non-public posts
    if (!isSubscribed) return false
    
    // If post has no tier restrictions, any subscription gives access
    if (!postTierIds || postTierIds.length === 0) return true
    
    // Check if user's tier is in the allowed tiers
    return userSubscriptionTier ? postTierIds.includes(userSubscriptionTier) : false
  }

  const fetchPosts = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const limit = isLoadMore ? loadMoreLimit : initialLimit
      const currentOffset = isLoadMore ? offset : 0

      // Query posts with engagement data
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("creator_id", creatorId)
        .order("created_at", { ascending: false })
        .range(currentOffset, currentOffset + limit - 1)

      if (error) throw error

      const processedPosts = (data || []).map(post => {
        const access = hasAccessToPost(post.is_public, post.access_tier_ids)
        console.log(`Post ${post.id}: public=${post.is_public}, tiers=${post.access_tier_ids}, subscribed=${isSubscribed}, access=${access}`)
        return {
          ...post,
          author: {
            id: creatorId,
            name: creatorName || "Creator",
            username: creatorName?.toLowerCase().replace(/\s+/g, "") || "creator",
            avatar_url: creatorAvatar || ""
          },
          likes_count: post.likes_count || 0,
          comments_count: post.comments_count || 0,
          has_access: access
        }
      })

      if (isLoadMore) {
        setPosts(prev => [...prev, ...processedPosts])
      } else {
        setPosts(processedPosts)
      }

      setOffset(currentOffset + processedPosts.length)
      setHasMore(processedPosts.length === limit)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [creatorId, creatorName, creatorAvatar, offset, initialLimit, loadMoreLimit, isSubscribed, userSubscriptionTier])

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (loading || loadingMore || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchPosts(true)
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loading, loadingMore, hasMore, fetchPosts])

  // Initial load and reload when subscription status changes
  useEffect(() => {
    // Only fetch posts after subscription status has been checked
    // or if there's no user (public view)
    if (userId === null || isSubscribed !== null) {
      fetchPosts(false)
    }
  }, [creatorId, isSubscribed, userSubscriptionTier])

  const handleLike = async (postId: string) => {
    // Like functionality would go here
    console.log("Like post:", postId)
  }

  const handleShare = async (postId: string) => {
    // Share functionality would go here
    console.log("Share post:", postId)
  }

  const renderPostContent = (post: Post) => {
    const hasMedia = post.thumbnail_url || (post.images?.length || 0) > 0 || (post.videos?.length || 0) > 0

    return (
      <Card 
        key={post.id}
        className={cn(
          "overflow-hidden transition-all hover:shadow-lg",
          !post.has_access && "opacity-90"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author?.avatar_url} />
                <AvatarFallback>{post.author?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-sm">{post.author?.name}</h4>
                <p className="text-xs text-muted-foreground">
                  @{post.author?.username} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            {!post.is_public && (
              <Badge 
                variant={post.has_access ? "default" : "secondary"}
                className="text-xs"
              >
                {post.access_tier_ids?.length ? "Premium" : "Subscribers"}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Post title if exists */}
          {post.title && (
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
          )}
          
          {/* Post content */}
          <div className="mb-3">
            <p className={cn(
              "text-sm whitespace-pre-wrap",
              !post.has_access && "line-clamp-2 blur-[2px]"
            )}>
              {post.description || post.title || ""}
            </p>
            
            {/* Content type badge */}
            {post.content_type && (
              <div className="flex items-center gap-2 mt-2">
                {post.content_type === 'image' && (
                  <>
                    <ImageIcon className="h-4 w-4" />
                    <Badge variant="secondary" className="text-xs">image</Badge>
                  </>
                )}
                {post.content_type === 'video' && (
                  <>
                    <Video className="h-4 w-4" />
                    <Badge variant="secondary" className="text-xs">video</Badge>
                  </>
                )}
                {!post.is_public && (
                  <Lock className="h-4 w-4 text-purple-600" />
                )}
              </div>
            )}
          </div>

          {/* Media preview */}
          {hasMedia && (
            <div className="relative rounded-lg overflow-hidden bg-muted mb-3">
              {!post.has_access ? (
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                  <div className="text-center p-4">
                    <Lock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm font-semibold text-purple-900">Premium Content</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Subscribe to view
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {post.thumbnail_url ? (
                    <div className="aspect-video relative">
                      <img 
                        src={post.thumbnail_url} 
                        alt={post.title || "Post image"}
                        className="w-full h-full object-cover"
                      />
                      {post.content_type === 'video' && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button 
                            size="lg" 
                            className="bg-white/90 text-black hover:bg-white"
                          >
                            <Play className="h-5 w-5 mr-2" />
                            Play
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : post.videos && post.videos.length > 0 ? (
                    <div className="aspect-video relative group cursor-pointer">
                      <img 
                        src={post.videos[0]} 
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="lg" 
                          className="bg-white/90 text-black hover:bg-white"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Play
                        </Button>
                      </div>
                      <Badge className="absolute top-2 right-2 bg-black/70">
                        <Video className="h-3 w-3 mr-1" />
                        Video
                      </Badge>
                    </div>
                  ) : post.images && post.images.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {post.images.slice(0, 4).map((image, idx) => (
                        <img 
                          key={idx}
                          src={image} 
                          alt={`Image ${idx + 1}`}
                          className="w-full rounded-lg object-cover"
                        />
                      ))}
                      {post.images.length > 4 && (
                        <div className="text-center py-2 text-sm text-muted-foreground">
                          +{post.images.length - 4} more images
                        </div>
                      )}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          )}

          {/* Engagement buttons */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => handleLike(post.id)}
                disabled={!post.has_access}
              >
                <Heart className={cn(
                  "h-4 w-4 mr-1",
                  post.has_liked && "fill-red-500 text-red-500"
                )} />
                {post.likes_count || 0}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                disabled={!post.has_access}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                {post.comments_count || 0}
              </Button>

              <span className="text-xs text-muted-foreground flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {post.view_count || 0}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => handleShare(post.id)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-3" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Feed header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Content Feed</h2>
        {!userTier && posts.some(p => !p.has_access) && (
          <Badge variant="outline" className="text-xs">
            <Lock className="h-3 w-3 mr-1" />
            Subscribe for full access
          </Badge>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map(post => renderPostContent(post))}
      </div>

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="py-4 text-center">
          {loadingMore ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
              <span className="text-sm text-muted-foreground">Loading more posts...</span>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => fetchPosts(true)}
              className="w-full max-w-xs"
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Load More
            </Button>
          )}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          You've reached the end of the feed
        </p>
      )}

      {posts.length === 0 && !loading && (
        <Card className="py-12">
          <CardContent className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No posts yet</h3>
            <p className="text-sm text-muted-foreground">
              {creatorName} hasn't posted any content yet. Check back later!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}