import { useState, useCallback, useEffect } from "react"
import useSWR from "swr"
import { PostData } from "@/components/feed/PostCard"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { getFeedPosts, getFollowingPosts } from "@/lib/supabase/feed"

interface UseFeedReturn {
  posts: PostData[]
  isLoading: boolean
  isLoadingMore: boolean
  error: any
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  hasMore: boolean
}

const PAGE_SIZE = 10

export function useFeed(feedType: "for-you" | "following"): UseFeedReturn {
  const { user, profile } = useSupabaseAuth()
  const [posts, setPosts] = useState<PostData[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Key for SWR based on feed type and user
  const swrKey = user ? `feed-${feedType}-${user.id}` : null

  // Fetcher function for initial data
  const fetcher = useCallback(async () => {
    if (!user) return []

    // For now, return mock data - will be replaced with actual Supabase queries
    const mockPosts: PostData[] = [
      {
        id: "1",
        creator: {
          id: "creator-001",
          username: "wyclef-jean",
          displayName: "Wyclef Jean",
          avatar: "/placeholder.svg",
          isVerified: true,
          subscriberTier: "VIP",
          tierColor: "from-purple-600 to-pink-600"
        },
        content: "Just finished recording a new track with some amazing Haitian artists! Can't wait for you all to hear it. The culture is alive and thriving! 🇭🇹🎵 #HaitianMusic #NewMusic",
        mediaUrls: ["/placeholder.svg"],
        postType: "image",
        engagement: {
          likes: 1542,
          reposts: 234,
          comments: 89,
          isLiked: false,
          isReposted: false,
          isBookmarked: false
        },
        visibility: "public",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "2",
        creator: {
          id: "creator-002",
          username: "michel-martelly",
          displayName: "Michel Martelly",
          avatar: "/placeholder.svg",
          isVerified: true,
          subscriberTier: undefined
        },
        content: "Exclusive content for my subscribers! Behind the scenes from my latest concert tour. Thank you for all the support! 🎤✨",
        postType: "text",
        engagement: {
          likes: 892,
          reposts: 123,
          comments: 67,
          isLiked: true,
          isReposted: false,
          isBookmarked: false
        },
        visibility: "subscribers",
        tierRequired: "Fan Club",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "3",
        creator: {
          id: "creator-003",
          username: "rutshelle",
          displayName: "Rutshelle Guillaume",
          avatar: "/placeholder.svg",
          isVerified: true,
          subscriberTier: "Premium"
        },
        content: "New music video dropping tomorrow! Here's a sneak peek for my amazing fans. Your support means everything! 💜",
        mediaUrls: ["/placeholder.svg"],
        postType: "video",
        engagement: {
          likes: 2341,
          reposts: 456,
          comments: 234,
          isLiked: false,
          isReposted: true,
          isBookmarked: true
        },
        visibility: "public",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "4",
        creator: {
          id: "creator-004",
          username: "kenny-haiti",
          displayName: "Kenny Haiti",
          avatar: "/placeholder.svg",
          isVerified: false,
          subscriberTier: "Basic"
        },
        content: "Working on something special for the Haitian diaspora. Music that connects us all, no matter where we are in the world. Stay tuned! 🌍🇭🇹",
        postType: "text",
        engagement: {
          likes: 567,
          reposts: 89,
          comments: 45,
          isLiked: true,
          isReposted: false,
          isBookmarked: false
        },
        visibility: "public",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "5",
        creator: {
          id: "creator-005",
          username: "ti-jo-zenny",
          displayName: "Ti Jo Zenny",
          avatar: "/placeholder.svg",
          isVerified: true,
          subscriberTier: undefined
        },
        content: "New comedy sketch coming this weekend! Who's ready to laugh? 😂 Tag someone who needs a good laugh today!",
        postType: "text",
        engagement: {
          likes: 1823,
          reposts: 342,
          comments: 156,
          isLiked: false,
          isReposted: false,
          isBookmarked: false
        },
        visibility: "public",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Filter based on feed type
    if (feedType === "following") {
      // Only show posts from subscribed creators
      return mockPosts.filter(post => post.creator.subscriberTier !== undefined)
    }

    return mockPosts
  }, [feedType, user])

  // Use SWR for initial data and caching
  const { data, error, mutate } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
  })

  // Set initial posts when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setPosts(data)
      setHasMore(data.length >= PAGE_SIZE)
    }
  }, [data])

  // Load more posts
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return

    setIsLoadingMore(true)

    try {
      // Simulate loading more posts - will be replaced with actual pagination
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo, just duplicate existing posts with new IDs
      const morePosts = posts.slice(0, 5).map((post, index) => ({
        ...post,
        id: `${post.id}-more-${Date.now()}-${index}`,
        createdAt: new Date(Date.now() - (posts.length + index + 1) * 60 * 60 * 1000).toISOString()
      }))

      setPosts([...posts, ...morePosts])
      
      // Simulate end of feed after 3 loads
      if (posts.length > 15) {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Failed to load more posts:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [posts, hasMore, isLoadingMore])

  // Refresh feed
  const refresh = useCallback(async () => {
    setCursor(null)
    setHasMore(true)
    await mutate()
  }, [mutate])

  return {
    posts,
    isLoading: !data && !error,
    isLoadingMore,
    error,
    loadMore,
    refresh,
    hasMore
  }
}