'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Lock,
  Eye,
  ChevronUp,
  ChevronDown,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { useInView } from 'react-intersection-observer'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Post {
  id: string
  creator_id: string
  title: string
  description: string | null
  content_type: 'video' | 'image' | 'text' | 'live'
  thumbnail_url: string | null
  video_url: string | null
  image_url: string | null
  is_public: boolean
  is_preview: boolean
  preview_duration: number | null
  tier_required: string | null
  likes_count: number
  views_count: number
  comments_count: number
  shares_count: number
  published_at: string
  creator: {
    id: string
    display_name: string
    username: string
    profile_image_url: string | null
  }
  is_liked?: boolean
  has_access?: boolean
}

interface VerticalScrollFeedProps {
  initialPosts?: Post[]
  creatorId?: string
  isAuthenticated?: boolean
  userSubscriptions?: string[] // List of creator IDs user is subscribed to
}

export function VerticalScrollFeed({
  initialPosts = [],
  creatorId,
  isAuthenticated = false,
  userSubscriptions = []
}: VerticalScrollFeedProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(!initialPosts.length)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({})
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Observer for auto-play/pause videos
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Load initial posts
  useEffect(() => {
    if (!initialPosts.length) {
      loadPosts()
    }
  }, [])

  // Set up intersection observer for videos
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Play video when more than 50% visible
            video.play().catch(() => {})
            setCurrentIndex(parseInt(video.dataset.index || '0'))
          } else {
            // Pause video when less than 50% visible
            video.pause()
          }
        })
      },
      { threshold: [0, 0.5, 1] }
    )

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  // Observe videos
  useEffect(() => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video && observerRef.current) {
        observerRef.current.observe(video)
      }
    })

    return () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video && observerRef.current) {
          observerRef.current.unobserve(video)
        }
      })
    }
  }, [posts])

  const loadPosts = async (offset = 0) => {
    try {
      const params = new URLSearchParams({
        limit: '10',
        offset: offset.toString(),
        ...(creatorId && { creatorId }),
        ...(!isAuthenticated && { preview: 'true' })
      })

      const response = await fetch(`/api/feed/posts?${params}`)
      const data = await response.json()

      if (offset === 0) {
        setPosts(data.posts || [])
      } else {
        setPosts(prev => [...prev, ...(data.posts || [])])
      }
      
      setHasMore(data.has_more || false)
    } catch (error) {
      console.error('Error loading posts:', error)
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true)
      loadPosts(posts.length)
    }
  }, [posts.length, loadingMore, hasMore])

  // Infinite scroll trigger
  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && !loadingMore && hasMore) {
        loadMore()
      }
    }
  })

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like posts',
        variant: 'default'
      })
      return
    }

    try {
      const supabase = createClient()
      
      if (isLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      } else {
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: (await supabase.auth.getUser()).data.user?.id
          })
      }

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !isLiked,
              likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      ))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleShare = async (post: Post) => {
    const url = `${window.location.origin}/post/${post.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description || '',
          url
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(url)
      toast({
        title: 'Link copied',
        description: 'Post link copied to clipboard',
      })
    }
  }

  const navigatePost = (direction: 'up' | 'down') => {
    const newIndex = direction === 'down' 
      ? Math.min(currentIndex + 1, posts.length - 1)
      : Math.max(currentIndex - 1, 0)
    
    const element = document.getElementById(`post-${posts[newIndex]?.id}`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const checkAccess = (post: Post): boolean => {
    if (post.is_public || post.is_preview) return true
    if (!isAuthenticated) return false
    return userSubscriptions.includes(post.creator_id)
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-96 w-full rounded-lg" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="relative h-screen overflow-y-auto snap-y snap-mandatory" ref={containerRef}>
      {/* Navigation buttons */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full bg-black/50 hover:bg-black/70 text-white"
          onClick={() => navigatePost('up')}
          disabled={currentIndex === 0}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full bg-black/50 hover:bg-black/70 text-white"
          onClick={() => navigatePost('down')}
          disabled={currentIndex === posts.length - 1}
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>

      {/* Mute button */}
      <Button
        size="icon"
        variant="secondary"
        className="fixed left-4 bottom-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>

      {/* Posts */}
      <div className="max-w-md mx-auto">
        {posts.map((post, index) => {
          const hasAccess = checkAccess(post)
          
          return (
            <div
              key={post.id}
              id={`post-${post.id}`}
              className="h-screen snap-start relative flex items-center justify-center bg-black"
              data-index={index}
            >
              {/* Background */}
              {post.content_type === 'video' && post.video_url ? (
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[post.id] = el
                  }}
                  src={hasAccess ? post.video_url : undefined}
                  poster={post.thumbnail_url || undefined}
                  className="absolute inset-0 w-full h-full object-contain"
                  loop
                  muted={isMuted}
                  playsInline
                  data-index={index}
                />
              ) : post.content_type === 'image' && post.image_url ? (
                <img
                  src={hasAccess ? post.image_url : post.thumbnail_url || ''}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900" />
              )}

              {/* Overlay for locked content */}
              {!hasAccess && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <Lock className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Subscription Required</h3>
                    <p className="text-sm mb-4">
                      Subscribe to {post.creator.display_name} to view this content
                    </p>
                    <Button
                      onClick={() => router.push(`/fan/creators/${post.creator_id}?tab=subscriptions`)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      View Subscription Tiers
                    </Button>
                  </div>
                </div>
              )}

              {/* Content overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Post info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                {/* Creator info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar
                    className="h-12 w-12 border-2 border-white cursor-pointer"
                    onClick={() => router.push(`/fan/creators/${post.creator_id}`)}
                  >
                    <AvatarImage src={post.creator.profile_image_url || undefined} />
                    <AvatarFallback>{post.creator.display_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{post.creator.display_name}</p>
                    <p className="text-sm opacity-80">
                      {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30"
                    onClick={() => router.push(`/fan/creators/${post.creator_id}`)}
                  >
                    View Profile
                  </Button>
                </div>

                {/* Title and description */}
                <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                {post.description && (
                  <p className="text-sm opacity-90 line-clamp-3 mb-4">{post.description}</p>
                )}

                {/* Engagement buttons */}
                <div className="flex items-center gap-6">
                  <button
                    className="flex flex-col items-center gap-1"
                    onClick={() => handleLike(post.id, post.is_liked || false)}
                  >
                    <div className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
                      <Heart 
                        className={cn(
                          "h-6 w-6",
                          post.is_liked && "fill-red-500 text-red-500"
                        )}
                      />
                    </div>
                    <span className="text-xs">{post.likes_count}</span>
                  </button>

                  <button className="flex flex-col items-center gap-1">
                    <div className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <span className="text-xs">{post.comments_count}</span>
                  </button>

                  <button 
                    className="flex flex-col items-center gap-1"
                    onClick={() => handleShare(post)}
                  >
                    <div className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
                      <Share2 className="h-6 w-6" />
                    </div>
                    <span className="text-xs">{post.shares_count}</span>
                  </button>

                  <div className="flex flex-col items-center gap-1">
                    <div className="p-2 rounded-full bg-white/20">
                      <Eye className="h-6 w-6" />
                    </div>
                    <span className="text-xs">{post.views_count}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Load more trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="h-screen flex items-center justify-center bg-black">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center">
              <p className="text-xl mb-2">You've reached the end!</p>
              <p className="text-sm opacity-80">Check back later for more content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}