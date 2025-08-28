"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useInView } from "react-intersection-observer"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PostCard } from "@/components/feed/PostCard"
import { PostComposer } from "@/components/feed/PostComposer"
import { useFeed } from "@/lib/hooks/useFeed"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { RefreshCw, TrendingUp, Users, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FeedPage() {
  const { user, profile } = useSupabaseAuth()
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Infinite scroll trigger
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  })

  // Custom hook for feed data
  const { 
    posts, 
    isLoading, 
    isLoadingMore,
    error, 
    loadMore, 
    refresh,
    hasMore 
  } = useFeed(activeTab)

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      loadMore()
    }
  }, [inView, hasMore, isLoadingMore, loadMore])

  // Pull to refresh for mobile
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await refresh()
    setIsRefreshing(false)
  }, [refresh])

  // Check if user is a creator
  const isCreator = profile?.role === "creator"

  // Empty state component
  const EmptyState = () => (
    <Card className="p-12 text-center">
      <div className="flex justify-center mb-4">
        {activeTab === "for-you" ? (
          <Sparkles className="h-12 w-12 text-purple-600" />
        ) : (
          <Users className="h-12 w-12 text-purple-600" />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {activeTab === "for-you" 
          ? "Welcome to Ann Pale!" 
          : "Follow creators to see their posts"}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {activeTab === "for-you"
          ? "We're curating the best content from Haitian creators just for you. Check back soon!"
          : "Subscribe to your favorite creators to see their latest posts, updates, and exclusive content here."}
      </p>
      <Button 
        onClick={() => window.location.href = '/fan/explore'}
        className="bg-gradient-to-r from-purple-600 to-pink-600"
      >
        Discover Creators
      </Button>
    </Card>
  )

  // Loading skeleton
  const LoadingSkeleton = () => (
    <>
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </Card>
      ))}
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header with tabs */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b mb-6 -mx-4 px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Feed
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={cn(
                "transition-transform",
                isRefreshing && "animate-spin"
              )}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="for-you" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                For You
              </TabsTrigger>
              <TabsTrigger value="following" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Following
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Post Composer for creators */}
        {isCreator && (
          <div className="mb-6">
            <PostComposer onPostCreated={refresh} />
          </div>
        )}

        {/* Feed content */}
        <div 
          ref={scrollContainerRef}
          className="space-y-4"
        >
          {/* Loading state */}
          {isLoading && <LoadingSkeleton />}

          {/* Error state */}
          {error && !isLoading && (
            <Card className="p-6 text-center">
              <p className="text-red-600 mb-4">Failed to load posts</p>
              <Button onClick={refresh} variant="outline">
                Try Again
              </Button>
            </Card>
          )}

          {/* Posts */}
          {!isLoading && posts.length > 0 && (
            <>
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onEngagementUpdate={refresh}
                />
              ))}
              
              {/* Load more trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="py-4">
                  {isLoadingMore && (
                    <div className="text-center">
                      <Skeleton className="h-10 w-32 mx-auto" />
                    </div>
                  )}
                </div>
              )}

              {/* End of feed */}
              {!hasMore && posts.length > 10 && (
                <Card className="p-6 text-center text-gray-500">
                  <p>You've reached the end! 🎉</p>
                </Card>
              )}
            </>
          )}

          {/* Empty state */}
          {!isLoading && !error && posts.length === 0 && <EmptyState />}
        </div>
      </div>
    </div>
  )
}