"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Brain,
  Search,
  Sparkles,
  TrendingUp,
  Activity,
  Settings,
  BarChart3,
  Filter,
  Eye,
  Layers,
  Cpu,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Globe,
  Users,
  MessageSquare,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Import all phase components
import { CompleteSearchSystem } from "./complete-search-system"
import { SearchResultsDisplay, useSearchResults } from "./search-results-display"
import type { SearchResult, ResultLayout, ResultGroup } from "./search-results-display"
import type { SearchQuery } from "./search-intent-engine"
import type { SearchInputEvent } from "./multi-modal-search"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { FilterState } from "./filter-sidebar"

interface UnifiedSearchExperienceProps {
  creators?: EnhancedCreator[]
  recentSearches?: string[]
  popularSearches?: string[]
  onCreatorSelect?: (creator: EnhancedCreator) => void
  onFilterUpdate?: (filters: Partial<FilterState>) => void
  enableAllFeatures?: boolean
  debugMode?: boolean
  className?: string
}

interface SearchFlowState {
  // Query processing
  currentQuery: string
  searchQuery: SearchQuery | null
  inputEvent: SearchInputEvent | null
  
  // Results
  searchResults: SearchResult[]
  resultGroups: ResultGroup[]
  
  // UI State
  resultsLayout: ResultLayout
  isSearching: boolean
  hasSearched: boolean
  
  // Metrics
  searchTime: number
  resultCount: number
  relevanceScore: number
}

interface SearchMetrics {
  totalSearches: number
  avgSearchTime: number
  avgResultCount: number
  avgRelevanceScore: number
  layoutPreference: Record<ResultLayout, number>
  inputMethodUsage: Record<string, number>
  filterUsage: number
  sessionDuration: number
}

export function UnifiedSearchExperience({
  creators = [],
  recentSearches = [],
  popularSearches = [],
  onCreatorSelect,
  onFilterUpdate,
  enableAllFeatures = true,
  debugMode = false,
  className
}: UnifiedSearchExperienceProps) {
  const [searchFlow, setSearchFlow] = React.useState<SearchFlowState>({
    currentQuery: "",
    searchQuery: null,
    inputEvent: null,
    searchResults: [],
    resultGroups: [],
    resultsLayout: "grid",
    isSearching: false,
    hasSearched: false,
    searchTime: 0,
    resultCount: 0,
    relevanceScore: 0
  })

  const [searchMetrics, setSearchMetrics] = React.useState<SearchMetrics>({
    totalSearches: 0,
    avgSearchTime: 0,
    avgResultCount: 0,
    avgRelevanceScore: 0,
    layoutPreference: {
      grid: 0,
      list: 0,
      carousel: 0,
      masonry: 0,
      compact: 0
    },
    inputMethodUsage: {},
    filterUsage: 0,
    sessionDuration: Date.now()
  })

  const [activeFilters, setActiveFilters] = React.useState<Partial<FilterState>>({})
  const [showMetrics, setShowMetrics] = React.useState(false)
  
  const { processSearchResults, rankingAlgorithm } = useSearchResults()

  // Process search and generate results
  const performSearch = React.useCallback(async (
    query: string,
    searchData: SearchQuery,
    inputEvent: SearchInputEvent
  ) => {
    const startTime = Date.now()
    
    setSearchFlow(prev => ({
      ...prev,
      currentQuery: query,
      searchQuery: searchData,
      inputEvent,
      isSearching: true,
      hasSearched: true
    }))

    try {
      // Filter creators based on search
      const filteredCreators = filterCreators(creators, searchData, activeFilters)
      
      // Process into search results
      const results = processSearchResults(filteredCreators, searchData)
      
      // Apply ranking
      const rankedResults = rankingAlgorithm.rankResults(results)
      
      // Create result groups
      const groups = createResultGroups(rankedResults, searchData)
      
      // Calculate metrics
      const searchTime = Date.now() - startTime
      const avgRelevance = rankedResults.reduce((sum, r) => sum + r.score, 0) / rankedResults.length || 0
      
      setSearchFlow(prev => ({
        ...prev,
        searchResults: rankedResults,
        resultGroups: groups,
        isSearching: false,
        searchTime,
        resultCount: rankedResults.length,
        relevanceScore: avgRelevance
      }))

      // Update metrics
      setSearchMetrics(prev => ({
        ...prev,
        totalSearches: prev.totalSearches + 1,
        avgSearchTime: (prev.avgSearchTime + searchTime) / 2,
        avgResultCount: (prev.avgResultCount + rankedResults.length) / 2,
        avgRelevanceScore: (prev.avgRelevanceScore + avgRelevance) / 2,
        inputMethodUsage: {
          ...prev.inputMethodUsage,
          [inputEvent.method]: (prev.inputMethodUsage[inputEvent.method] || 0) + 1
        }
      }))

      // Success feedback
      if (rankedResults.length > 0) {
        toast.success(`Found ${rankedResults.length} results in ${searchTime}ms`)
      } else {
        toast.warning("No results found. Try adjusting your search.")
      }

    } catch (error) {
      console.error("Search error:", error)
      setSearchFlow(prev => ({ ...prev, isSearching: false }))
      toast.error("Search failed. Please try again.")
    }
  }, [creators, activeFilters, processSearchResults, rankingAlgorithm])

  // Filter creators based on search and filters
  const filterCreators = (
    creators: EnhancedCreator[],
    searchData: SearchQuery,
    filters: Partial<FilterState>
  ): EnhancedCreator[] => {
    let filtered = [...creators]

    // Apply text search
    if (searchData.cleaned) {
      filtered = filtered.filter(creator => {
        const searchTerms = searchData.tokens
        const creatorText = `${creator.name} ${creator.category} ${creator.bio || ""}`.toLowerCase()
        return searchTerms.some(term => creatorText.includes(term))
      })
    }

    // Apply filters
    if (filters.categories?.length) {
      filtered = filtered.filter(c => filters.categories?.includes(c.category))
    }
    
    if (filters.priceRange) {
      filtered = filtered.filter(c => 
        c.price >= filters.priceRange![0] && c.price <= filters.priceRange![1]
      )
    }

    if (filters.languages?.length) {
      filtered = filtered.filter(c => 
        c.languages.some(lang => filters.languages?.includes(lang.toLowerCase()))
      )
    }

    if (filters.rating) {
      filtered = filtered.filter(c => c.rating >= filters.rating!)
    }

    if (filters.verified) {
      filtered = filtered.filter(c => c.verified)
    }

    if (filters.availability && filters.availability !== "all") {
      filtered = filtered.filter(c => c.availability === filters.availability)
    }

    return filtered
  }

  // Create result groups based on search pattern
  const createResultGroups = (
    results: SearchResult[],
    searchData: SearchQuery
  ): ResultGroup[] => {
    const groups: ResultGroup[] = []

    // Top matches (score > 0.8)
    const topMatches = results.filter(r => r.score > 0.8)
    if (topMatches.length > 0) {
      groups.push({
        id: "top_matches",
        title: "🎯 Top Matches",
        type: "top_matches",
        results: topMatches,
        expanded: true,
        metadata: {
          totalCount: topMatches.length,
          priority: 1
        }
      })
    }

    // Pattern-based grouping
    if (searchData.pattern === "exploratory" || searchData.pattern === "descriptive") {
      // Group by category
      const categoryMap = new Map<string, SearchResult[]>()
      results.forEach(result => {
        if (result.type === "creator_card") {
          const category = result.data.category
          if (!categoryMap.has(category)) {
            categoryMap.set(category, [])
          }
          categoryMap.get(category)!.push(result)
        }
      })

      categoryMap.forEach((categoryResults, category) => {
        if (categoryResults.length > 0) {
          groups.push({
            id: `category_${category}`,
            title: `${getCategoryEmoji(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
            type: "categories",
            results: categoryResults.slice(0, 6),
            expanded: false,
            metadata: {
              totalCount: categoryResults.length,
              hasMore: categoryResults.length > 6,
              priority: 2
            }
          })
        }
      })
    }

    // All remaining results
    const remainingResults = results.filter(r => 
      !topMatches.includes(r) && 
      !groups.some(g => g.results.includes(r))
    )
    
    if (remainingResults.length > 0) {
      groups.push({
        id: "all_results",
        title: "📋 All Results",
        type: "all_results",
        results: remainingResults,
        expanded: false,
        metadata: {
          totalCount: remainingResults.length,
          hasMore: remainingResults.length > 10,
          priority: 3
        }
      })
    }

    return groups
  }

  // Get category emoji
  const getCategoryEmoji = (category: string): string => {
    const emojis: Record<string, string> = {
      musicians: "🎵",
      singers: "🎤",
      comedians: "😄",
      actors: "🎭",
      djs: "🎧",
      radio: "📻",
      influencers: "⭐",
      athletes: "🏃"
    }
    return emojis[category.toLowerCase()] || "👤"
  }

  // Handle layout change
  const handleLayoutChange = (layout: ResultLayout) => {
    setSearchFlow(prev => ({ ...prev, resultsLayout: layout }))
    setSearchMetrics(prev => ({
      ...prev,
      layoutPreference: {
        ...prev.layoutPreference,
        [layout]: prev.layoutPreference[layout] + 1
      }
    }))
  }

  // Handle filter update
  const handleFilterUpdate = (filters: Partial<FilterState>) => {
    setActiveFilters(prev => ({ ...prev, ...filters }))
    setSearchMetrics(prev => ({ ...prev, filterUsage: prev.filterUsage + 1 }))
    onFilterUpdate?.(filters)
    
    // Re-run search if we have a query
    if (searchFlow.searchQuery && searchFlow.inputEvent) {
      performSearch(
        searchFlow.currentQuery,
        searchFlow.searchQuery,
        searchFlow.inputEvent
      )
    }
  }

  // Calculate session duration
  const sessionDuration = React.useMemo(() => {
    const duration = Date.now() - searchMetrics.sessionDuration
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }, [searchMetrics.sessionDuration])

  return (
    <div className={cn("space-y-6", className)}>
      {/* Unified Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle className="text-xl">Ann Pale Search</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unified Search Experience • All Phases Integrated
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                Phase 2.2.1-2.2.4
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetrics(!showMetrics)}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Metrics
              </Button>
              {debugMode && (
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {showMetrics && (
          <CardContent className="border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {searchMetrics.totalSearches}
                </div>
                <div className="text-xs text-gray-600">Total Searches</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {searchMetrics.avgSearchTime.toFixed(0)}ms
                </div>
                <div className="text-xs text-gray-600">Avg Search Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {(searchMetrics.avgRelevanceScore * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600">Avg Relevance</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {sessionDuration}
                </div>
                <div className="text-xs text-gray-600">Session Time</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Complete Search System (Phases 2.2.1-2.2.3) */}
      <CompleteSearchSystem
        creators={creators}
        recentSearches={recentSearches}
        onSearch={performSearch}
        onCreatorSelect={onCreatorSelect}
        onFilterUpdate={handleFilterUpdate}
        enableAdvancedFeatures={enableAllFeatures}
        enableAnalytics={true}
        enableMultiModal={true}
        debugMode={debugMode}
      />

      {/* Search Results Display (Phase 2.2.4) */}
      {searchFlow.hasSearched && (
        <SearchResultsDisplay
          searchQuery={searchFlow.searchQuery || undefined}
          searchEvent={searchFlow.inputEvent || undefined}
          results={searchFlow.searchResults}
          groups={searchFlow.resultGroups}
          layout={searchFlow.resultsLayout}
          onLayoutChange={handleLayoutChange}
          onCreatorSelect={onCreatorSelect}
          onSearch={(query) => {
            // Trigger new search from result interactions
            const searchElement = document.querySelector('[data-search-input]') as HTMLInputElement
            if (searchElement) {
              searchElement.value = query
              searchElement.dispatchEvent(new Event('input', { bubbles: true }))
            }
          }}
          enableRanking={true}
          enableGrouping={true}
          showExplanations={debugMode}
        />
      )}

      {/* Search Flow Status */}
      {searchFlow.isSearching && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="text-gray-600">Searching...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Dashboard */}
      {debugMode && searchFlow.hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Search Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Search Time</span>
                  <span className="font-medium">{searchFlow.searchTime}ms</span>
                </div>
                <Progress value={Math.min(searchFlow.searchTime / 10, 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Result Relevance</span>
                  <span className="font-medium">
                    {(searchFlow.relevanceScore * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={searchFlow.relevanceScore * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Results Found</span>
                  <span className="font-medium">{searchFlow.resultCount}</span>
                </div>
                <Progress value={Math.min(searchFlow.resultCount * 10, 100)} className="h-2" />
              </div>

              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Search Analysis</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Pattern: {searchFlow.searchQuery?.pattern}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Intent: {searchFlow.searchQuery?.intent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Language: {searchFlow.searchQuery?.language}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Input: {searchFlow.inputEvent?.method}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips and Guidance */}
      {!searchFlow.hasSearched && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start Your Search</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Use natural language, voice, or even images to find the perfect Haitian creator
            </p>
            
            <div className="max-w-md mx-auto space-y-2 text-sm text-left">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-purple-500 mt-0.5" />
                <span>Try: "Comedians under $50 available today"</span>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-blue-500 mt-0.5" />
                <span>Search in English, French, or Kreyòl</span>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span>Use voice search for hands-free browsing</span>
              </div>
            </div>

            {popularSearches.length > 0 && (
              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-2">Popular searches:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {popularSearches.slice(0, 5).map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30"
                      onClick={() => {
                        const searchElement = document.querySelector('[data-search-input]') as HTMLInputElement
                        if (searchElement) {
                          searchElement.value = search
                          searchElement.dispatchEvent(new Event('input', { bubbles: true }))
                        }
                      }}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Export hook for using unified search
export function useUnifiedSearch() {
  const [searchState, setSearchState] = React.useState({
    isReady: false,
    hasSearched: false,
    lastQuery: "",
    lastPattern: "",
    lastIntent: "",
    resultCount: 0
  })

  const trackSearch = React.useCallback((
    query: string,
    searchData: SearchQuery,
    resultCount: number
  ) => {
    setSearchState({
      isReady: true,
      hasSearched: true,
      lastQuery: query,
      lastPattern: searchData.pattern,
      lastIntent: searchData.intent,
      resultCount
    })
  }, [])

  return {
    searchState,
    trackSearch
  }
}