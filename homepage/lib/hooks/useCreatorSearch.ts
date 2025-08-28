'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Fuse from 'fuse.js'
import { createClient } from '@/lib/supabase/client'
import { CreatorPreview } from '@/components/explore/CreatorPreviewCard'
import debounce from 'lodash.debounce'

interface SearchFilters {
  categories?: string[]
  priceRange?: { min: number; max: number }
  languages?: string[]
  verified?: boolean
  sortBy?: 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'newest'
}

interface UseCreatorSearchReturn {
  creators: CreatorPreview[]
  isLoading: boolean
  error: Error | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
  totalCount: number
}

const CREATORS_PER_PAGE = 12

export function useCreatorSearch(
  query: string = '',
  filters: SearchFilters = {}
): UseCreatorSearchReturn {
  const [creators, setCreators] = useState<CreatorPreview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  
  const supabase = createClient()
  const abortControllerRef = useRef<AbortController | null>(null)

  // Fuzzy search setup
  const fuseOptions = {
    keys: ['name', 'display_name', 'username', 'bio', 'category'],
    threshold: 0.3,
    includeScore: true
  }

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (searchQuery: string, searchFilters: SearchFilters, currentPage: number) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController()
      
      setIsLoading(true)
      setError(null)

      try {
        // Build Supabase query
        let query = supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .eq('role', 'creator')
          .order('created_at', { ascending: false })

        // Apply filters
        if (searchFilters.categories && searchFilters.categories.length > 0) {
          query = query.in('category', searchFilters.categories)
        }

        if (searchFilters.priceRange) {
          query = query
            .gte('price_video_message', searchFilters.priceRange.min)
            .lte('price_video_message', searchFilters.priceRange.max)
        }

        if (searchFilters.languages && searchFilters.languages.length > 0) {
          query = query.contains('languages', searchFilters.languages)
        }

        if (searchFilters.verified !== undefined) {
          query = query.eq('verified', searchFilters.verified)
        }

        // Apply sorting
        switch (searchFilters.sortBy) {
          case 'price_asc':
            query = query.order('price_video_message', { ascending: true })
            break
          case 'price_desc':
            query = query.order('price_video_message', { ascending: false })
            break
          case 'rating':
            query = query.order('rating', { ascending: false })
            break
          case 'popular':
            query = query.order('total_reviews', { ascending: false })
            break
          case 'newest':
          default:
            // Already ordered by created_at
            break
        }

        // Pagination
        const from = (currentPage - 1) * CREATORS_PER_PAGE
        const to = from + CREATORS_PER_PAGE - 1
        query = query.range(from, to)

        const { data, error: supabaseError, count } = await query

        if (supabaseError) throw supabaseError

        let results = data || []
        
        // Apply fuzzy search if query is provided
        if (searchQuery.trim() && results.length > 0) {
          const fuse = new Fuse(results, fuseOptions)
          const searchResults = fuse.search(searchQuery)
          results = searchResults.map(result => result.item)
        }

        // Transform to CreatorPreview format
        const transformedResults: CreatorPreview[] = results.map(profile => ({
          id: profile.id,
          name: profile.name,
          username: profile.username || profile.email?.split('@')[0] || 'user',
          display_name: profile.display_name || profile.name,
          avatar_url: profile.avatar_url,
          cover_image: profile.cover_image_url,
          bio: profile.bio,
          category: profile.category || 'creator',
          subcategory: profile.subcategory,
          verified: profile.verified || profile.public_figure_verified || false,
          price_video_message: profile.price_video_message || 50,
          price_range: profile.price_range,
          rating: profile.rating,
          total_reviews: profile.total_reviews,
          subscriber_count: profile.follower_count,
          response_time: profile.response_time,
          languages: profile.languages || ['English'],
          is_subscribed: false, // Would need to check user's subscriptions
          is_online: false, // Would need real-time presence
          is_demo: profile.is_demo_account || false
        }))

        if (currentPage === 1) {
          setCreators(transformedResults)
        } else {
          setCreators(prev => [...prev, ...transformedResults])
        }

        setTotalCount(count || 0)
        setHasMore(results.length === CREATORS_PER_PAGE)
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Search error:', err)
          setError(err)
        }
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  // Effect to trigger search
  useEffect(() => {
    setPage(1)
    performSearch(query, filters, 1)

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [query, JSON.stringify(filters)])

  // Load more function
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      performSearch(query, filters, nextPage)
    }
  }, [isLoading, hasMore, page, query, filters, performSearch])

  // Refresh function
  const refresh = useCallback(() => {
    setPage(1)
    performSearch(query, filters, 1)
  }, [query, filters, performSearch])

  return {
    creators,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount
  }
}