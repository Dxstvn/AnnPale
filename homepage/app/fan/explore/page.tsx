'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, TrendingUp, Sparkles, Users, Hash, Music, Smile, Activity, Trophy, Radio, Mic, Filter } from 'lucide-react'
import { SearchBar } from '@/components/explore/SearchBar'
import { CategoryFilter } from '@/components/explore/CategoryFilter'
import { TrendingCreators } from '@/components/explore/TrendingCreators'
import { CreatorPreviewCard } from '@/components/explore/CreatorPreviewCard'
import { RecommendedSection } from '@/components/explore/RecommendedSection'
import { useCreatorSearch } from '@/lib/hooks/useCreatorSearch'
import { useRecommendations } from '@/lib/hooks/useRecommendations'
import { useTrendingCreators } from '@/lib/hooks/useTrendingCreators'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSupabaseAuth } from '@/contexts/supabase-auth-context'
import { cn } from '@/lib/utils'

// Category configuration
export const CATEGORIES = [
  { id: 'music', label: 'Music', icon: Music, color: 'purple' },
  { id: 'comedy', label: 'Comedy', icon: Smile, color: 'yellow' },
  { id: 'dance', label: 'Dance', icon: Activity, color: 'pink' },
  { id: 'sports', label: 'Sports', icon: Trophy, color: 'green' },
  { id: 'media', label: 'Media', icon: Radio, color: 'blue' },
  { id: 'entertainment', label: 'Entertainment', icon: Sparkles, color: 'orange' },
  { id: 'podcaster', label: 'Podcasters', icon: Mic, color: 'red' },
  { id: 'all', label: 'All', icon: Users, color: 'gray' },
]

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const { user } = useSupabaseAuth()
  
  // State management
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Custom hooks for data
  const { 
    creators, 
    isLoading: searchLoading, 
    error: searchError,
    loadMore,
    hasMore,
    refresh
  } = useCreatorSearch(searchQuery, { categories: selectedCategories })
  
  const { 
    recommendations, 
    isLoading: recLoading 
  } = useRecommendations(user?.id)
  
  const { 
    trending, 
    isLoading: trendingLoading 
  } = useTrendingCreators()

  // Handle category selection
  const handleCategoryToggle = useCallback((categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories([])
    } else {
      setSelectedCategories(prev => 
        prev.includes(categoryId) 
          ? prev.filter(id => id !== categoryId)
          : [...prev, categoryId]
      )
    }
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategories([])
  }, [])

  const hasActiveFilters = searchQuery || selectedCategories.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header with Search */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Explore</h1>
                  <p className="text-sm text-gray-500">Discover amazing creators</p>
                </div>
              </div>
              
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  Grid
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Search Bar Section */}
          <div className="py-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <SearchBar 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search creators by name, category, or bio..."
                  className="w-full"
                />
              </div>
              
              {/* Filter Toggle Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "hidden md:flex items-center gap-2",
                  showFilters && "bg-purple-50 border-purple-300"
                )}
              >
                <Filter className="h-4 w-4" />
                Filters
                {selectedCategories.length > 0 && (
                  <Badge className="ml-1">{selectedCategories.length}</Badge>
                )}
              </Button>
            </div>

            {/* Category Filter Bar */}
            {(showFilters || selectedCategories.length > 0) && (
              <div className="mt-4 pb-2">
                <CategoryFilter
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                />
              </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-gray-500">Active:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    <Search className="h-3 w-3" />
                    "{searchQuery}"
                  </Badge>
                )}
                {selectedCategories.map(cat => {
                  const category = CATEGORIES.find(c => c.id === cat)
                  return category ? (
                    <Badge key={cat} variant="secondary" className="gap-1">
                      <category.icon className="h-3 w-3" />
                      {category.label}
                    </Badge>
                  ) : null
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Trending Section - Only show when no search */}
        {!searchQuery && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900">Trending Now</h2>
                <Badge variant="secondary" className="ml-2">Live</Badge>
              </div>
              <Button variant="ghost" size="sm">
                See all
              </Button>
            </div>
            
            <TrendingCreators 
              creators={trending}
              isLoading={trendingLoading}
            />
          </section>
        )}

        {/* Recommended For You - Only for authenticated users */}
        {user && !searchQuery && recommendations.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-900">Recommended For You</h2>
              </div>
              <Button variant="ghost" size="sm">
                See all
              </Button>
            </div>
            
            <RecommendedSection
              creators={recommendations}
              isLoading={recLoading}
            />
          </section>
        )}

        {/* Search Results / All Creators */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Creators'}
            </h2>
            {creators.length > 0 && (
              <span className="text-sm text-gray-500">
                {creators.length} creators found
              </span>
            )}
          </div>

          {/* Loading State */}
          {searchLoading && (
            <div className={cn(
              "grid gap-4",
              viewMode === 'grid' 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}>
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          )}

          {/* Error State */}
          {searchError && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Error loading creators</p>
              <Button onClick={refresh} variant="outline">
                Try again
              </Button>
            </div>
          )}

          {/* Results Grid/List */}
          {!searchLoading && !searchError && creators.length > 0 && (
            <>
              <div className={cn(
                "grid gap-4",
                viewMode === 'grid' 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}>
                {creators.map((creator) => (
                  <CreatorPreviewCard
                    key={creator.id}
                    creator={creator}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-8">
                  <Button
                    onClick={loadMore}
                    variant="outline"
                    className="min-w-[200px]"
                  >
                    Load more creators
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!searchLoading && !searchError && creators.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No creators found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? "Try adjusting your search or filters"
                  : "Check back soon for new creators"}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}