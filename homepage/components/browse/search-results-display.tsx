"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Grid3x3,
  List,
  LayoutGrid,
  Search,
  TrendingUp,
  Sparkles,
  DollarSign,
  Clock,
  Globe,
  Star,
  CheckCircle,
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  Users,
  MessageSquare,
  Calendar,
  Video,
  Hash,
  Info,
  ExternalLink,
  Eye,
  Heart,
  Share2,
  SortAsc,
  SortDesc,
  Shuffle,
  Target,
  Award,
  Zap,
  Flame,
  Crown,
  Percent,
  UserCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Import existing components
import { EnhancedCreatorCard } from "./enhanced-creator-card"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { SearchQuery } from "./search-intent-engine"
import type { SearchInputEvent } from "./multi-modal-search"

// Result type definitions
export type ResultType = 
  | "creator_card"        // Individual creator result
  | "category_group"      // Grouped category results  
  | "quick_answer"        // Direct answer to query
  | "suggestion"          // Alternative search suggestion
  | "no_results"          // No results found

export type ResultLayout = 
  | "grid"      // Grid layout (default)
  | "list"      // List layout
  | "carousel"  // Carousel layout
  | "masonry"   // Masonry layout
  | "compact"   // Compact layout

export type VisualBadgeType =
  | "sponsored"       // Paid placement
  | "verified"        // Verified creator
  | "new"            // New to platform
  | "trending"       // Currently trending
  | "available_now"  // Available immediately
  | "featured"       // Platform featured
  | "sale"          // On sale/discount
  | "top_rated"     // Highly rated

// Ranking factors interface
interface RankingFactors {
  queryMatch: number      // 0-1, weight: 40%
  creatorPopularity: number  // 0-1, weight: 20%
  userPreferences: number    // 0-1, weight: 15%
  availability: number       // 0-1, weight: 10%
  responseTime: number       // 0-1, weight: 10%
  priceMatch: number        // 0-1, weight: 5%
}

// Search result interface
export interface SearchResult {
  id: string
  type: ResultType
  score: number
  rankingFactors: RankingFactors
  data: any
  metadata?: {
    groupId?: string
    position?: number
    source?: string
    badges?: VisualBadgeType[]
    explanation?: string
  }
}

// Result group interface
export interface ResultGroup {
  id: string
  title: string
  type: "top_matches" | "categories" | "all_results" | "suggestions"
  results: SearchResult[]
  expanded: boolean
  metadata?: {
    totalCount?: number
    hasMore?: boolean
    priority?: number
  }
}

interface SearchResultsDisplayProps {
  searchQuery?: SearchQuery
  searchEvent?: SearchInputEvent
  results?: SearchResult[]
  groups?: ResultGroup[]
  layout?: ResultLayout
  onLayoutChange?: (layout: ResultLayout) => void
  onResultClick?: (result: SearchResult) => void
  onLoadMore?: (groupId: string) => void
  onCreatorSelect?: (creator: EnhancedCreator) => void
  onSearch?: (query: string) => void
  enableRanking?: boolean
  enableGrouping?: boolean
  showExplanations?: boolean
  className?: string
}

// Ranking algorithm implementation
export class SearchRankingAlgorithm {
  private weights = {
    queryMatch: 0.40,
    creatorPopularity: 0.20,
    userPreferences: 0.15,
    availability: 0.10,
    responseTime: 0.10,
    priceMatch: 0.05
  }

  calculateScore(factors: RankingFactors): number {
    let score = 0
    
    score += factors.queryMatch * this.weights.queryMatch
    score += factors.creatorPopularity * this.weights.creatorPopularity
    score += factors.userPreferences * this.weights.userPreferences
    score += factors.availability * this.weights.availability
    score += factors.responseTime * this.weights.responseTime
    score += factors.priceMatch * this.weights.priceMatch
    
    return Math.min(1, Math.max(0, score))
  }

  rankResults(results: SearchResult[]): SearchResult[] {
    return results
      .map(result => ({
        ...result,
        score: this.calculateScore(result.rankingFactors)
      }))
      .sort((a, b) => b.score - a.score)
  }

  explainRanking(factors: RankingFactors): string {
    const contributions = [
      { name: "Query Match", value: factors.queryMatch * this.weights.queryMatch * 100 },
      { name: "Popularity", value: factors.creatorPopularity * this.weights.creatorPopularity * 100 },
      { name: "Preferences", value: factors.userPreferences * this.weights.userPreferences * 100 },
      { name: "Availability", value: factors.availability * this.weights.availability * 100 },
      { name: "Response Time", value: factors.responseTime * this.weights.responseTime * 100 },
      { name: "Price", value: factors.priceMatch * this.weights.priceMatch * 100 }
    ]

    const topFactors = contributions
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map(f => `${f.name}: ${f.value.toFixed(0)}%`)
      .join(", ")

    return `Ranking factors: ${topFactors}`
  }
}

// Creator result component
function CreatorResult({ 
  result, 
  layout,
  onSelect,
  showExplanation 
}: { 
  result: SearchResult
  layout: ResultLayout
  onSelect?: (creator: EnhancedCreator) => void
  showExplanation?: boolean
}) {
  const creator = result.data as EnhancedCreator
  const badges = result.metadata?.badges || []

  return (
    <div className="relative">
      {/* Visual badges */}
      {badges.length > 0 && (
        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
          {badges.includes("sponsored") && (
            <Badge className="bg-yellow-500/90 backdrop-blur text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Sponsored
            </Badge>
          )}
          {badges.includes("trending") && (
            <Badge className="bg-red-500/90 backdrop-blur text-xs">
              <Flame className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
          {badges.includes("available_now") && (
            <Badge className="bg-green-500/90 backdrop-blur text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Available
            </Badge>
          )}
          {badges.includes("sale") && (
            <Badge className="bg-purple-500/90 backdrop-blur text-xs">
              <Percent className="h-3 w-3 mr-1" />
              Sale
            </Badge>
          )}
        </div>
      )}

      {/* Creator card with layout variant */}
      <EnhancedCreatorCard
        creator={creator}
        variant={layout === "list" ? "list" : layout === "compact" ? "compact" : "default"}
        onQuickBook={() => onSelect?.(creator)}
        interactive={true}
      />

      {/* Ranking explanation */}
      {showExplanation && result.metadata?.explanation && (
        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <Info className="h-3 w-3 inline mr-1" />
            {result.metadata.explanation}
          </p>
        </div>
      )}
    </div>
  )
}

// Category group component
function CategoryGroup({ 
  group,
  layout,
  onCreatorSelect,
  onLoadMore,
  showExplanations
}: {
  group: ResultGroup
  layout: ResultLayout
  onCreatorSelect?: (creator: EnhancedCreator) => void
  onLoadMore?: () => void
  showExplanations?: boolean
}) {
  const [isExpanded, setIsExpanded] = React.useState(group.expanded)
  const displayResults = isExpanded ? group.results : group.results.slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            {group.title}
            {group.metadata?.totalCount && (
              <Badge variant="secondary" className="text-xs">
                {group.metadata.totalCount} results
              </Badge>
            )}
          </CardTitle>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show All
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className={cn(
          layout === "grid" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
          layout === "list" && "space-y-4",
          layout === "carousel" && "flex gap-4 overflow-x-auto pb-2",
          layout === "compact" && "space-y-2"
        )}>
          {displayResults.map((result) => (
            <CreatorResult
              key={result.id}
              result={result}
              layout={layout}
              onSelect={onCreatorSelect}
              showExplanation={showExplanations}
            />
          ))}
        </div>

        {group.metadata?.hasMore && isExpanded && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={onLoadMore}
              className="w-full md:w-auto"
            >
              Load More Results
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Quick answer component
function QuickAnswer({ 
  result,
  onSearch
}: {
  result: SearchResult
  onSearch?: (query: string) => void
}) {
  const answer = result.data

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Quick Answer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-gray-700 dark:text-gray-300">{answer.text}</p>
          
          {answer.suggestions && (
            <div className="flex flex-wrap gap-2">
              {answer.suggestions.map((suggestion: string, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSearch?.(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}

          {answer.source && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Source: {answer.source}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// No results component
function NoResults({ 
  query,
  suggestions,
  onSearch
}: {
  query?: string
  suggestions?: string[]
  onSearch?: (query: string) => void
}) {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="max-w-md mx-auto space-y-4">
          <Search className="h-12 w-12 text-gray-400 mx-auto" />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            {query && (
              <p className="text-gray-600 dark:text-gray-400">
                We couldn't find any results for "{query}"
              </p>
            )}
          </div>

          {suggestions && suggestions.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Try searching for:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onSearch?.(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <p className="text-xs text-gray-500">
              💡 Tip: Try using broader search terms or check your filters
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Results skeleton loader
function ResultsSkeleton({ layout }: { layout: ResultLayout }) {
  const skeletonCount = layout === "list" ? 3 : 6

  return (
    <div className={cn(
      layout === "grid" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
      layout === "list" && "space-y-4"
    )}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function SearchResultsDisplay({
  searchQuery,
  searchEvent,
  results = [],
  groups = [],
  layout = "grid",
  onLayoutChange,
  onResultClick,
  onLoadMore,
  onCreatorSelect,
  onSearch,
  enableRanking = true,
  enableGrouping = true,
  showExplanations = false,
  className
}: SearchResultsDisplayProps) {
  const [currentLayout, setCurrentLayout] = React.useState<ResultLayout>(layout)
  const [sortBy, setSortBy] = React.useState<"relevance" | "price" | "rating" | "availability">("relevance")
  const [isLoading, setIsLoading] = React.useState(false)
  const [processedResults, setProcessedResults] = React.useState<SearchResult[]>([])
  const [resultGroups, setResultGroups] = React.useState<ResultGroup[]>([])
  
  const rankingAlgorithm = React.useMemo(() => new SearchRankingAlgorithm(), [])

  // Process and rank results
  React.useEffect(() => {
    if (!results || results.length === 0) {
      setProcessedResults([])
      return
    }

    setIsLoading(true)
    
    // Apply ranking if enabled
    const rankedResults = enableRanking 
      ? rankingAlgorithm.rankResults(results)
      : results

    // Add explanations if enabled
    if (showExplanations) {
      rankedResults.forEach(result => {
        if (!result.metadata) result.metadata = {}
        result.metadata.explanation = rankingAlgorithm.explainRanking(result.rankingFactors)
      })
    }

    setProcessedResults(rankedResults)
    setIsLoading(false)
  }, [results, enableRanking, showExplanations, rankingAlgorithm])

  // Group results
  React.useEffect(() => {
    if (!enableGrouping || processedResults.length === 0) {
      setResultGroups([{
        id: "all",
        title: "All Results",
        type: "all_results",
        results: processedResults,
        expanded: true
      }])
      return
    }

    // Group by type and score
    const topMatches = processedResults.filter(r => r.score > 0.8)
    const categoryGroups = new Map<string, SearchResult[]>()
    const remaining: SearchResult[] = []

    processedResults.forEach(result => {
      if (topMatches.includes(result)) return
      
      if (result.type === "creator_card" && result.data.category) {
        const category = result.data.category
        if (!categoryGroups.has(category)) {
          categoryGroups.set(category, [])
        }
        categoryGroups.get(category)!.push(result)
      } else {
        remaining.push(result)
      }
    })

    const groups: ResultGroup[] = []

    // Add top matches
    if (topMatches.length > 0) {
      groups.push({
        id: "top_matches",
        title: "Top Matches",
        type: "top_matches",
        results: topMatches,
        expanded: true,
        metadata: {
          totalCount: topMatches.length,
          priority: 1
        }
      })
    }

    // Add category groups
    categoryGroups.forEach((results, category) => {
      groups.push({
        id: `category_${category}`,
        title: category.charAt(0).toUpperCase() + category.slice(1),
        type: "categories",
        results,
        expanded: false,
        metadata: {
          totalCount: results.length,
          hasMore: results.length > 3,
          priority: 2
        }
      })
    })

    // Add remaining results
    if (remaining.length > 0) {
      groups.push({
        id: "all_results",
        title: "All Results",
        type: "all_results",
        results: remaining,
        expanded: false,
        metadata: {
          totalCount: remaining.length,
          hasMore: remaining.length > 6,
          priority: 3
        }
      })
    }

    // Sort groups by priority
    groups.sort((a, b) => (a.metadata?.priority || 999) - (b.metadata?.priority || 999))

    setResultGroups(groups)
  }, [processedResults, enableGrouping])

  // Handle layout change
  const handleLayoutChange = (newLayout: ResultLayout) => {
    setCurrentLayout(newLayout)
    onLayoutChange?.(newLayout)
  }

  // Handle sort change
  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort)
    
    // Re-sort results based on selection
    const sorted = [...processedResults]
    
    switch (newSort) {
      case "price":
        sorted.sort((a, b) => (a.data.price || 0) - (b.data.price || 0))
        break
      case "rating":
        sorted.sort((a, b) => (b.data.rating || 0) - (a.data.rating || 0))
        break
      case "availability":
        sorted.sort((a, b) => {
          const aAvail = a.data.availability === "available" ? 1 : 0
          const bAvail = b.data.availability === "available" ? 1 : 0
          return bAvail - aAvail
        })
        break
      default:
        // Keep relevance order
        break
    }

    setProcessedResults(sorted)
  }

  // Check for no results
  const hasNoResults = !isLoading && processedResults.length === 0

  return (
    <div className={cn("space-y-4", className)}>
      {/* Results header */}
      {!hasNoResults && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              {searchQuery?.original ? (
                <>Search Results for "{searchQuery.original}"</>
              ) : (
                "Search Results"
              )}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {processedResults.length} results found
              {searchEvent && ` • ${searchEvent.method} search`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort selector */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">
                  <Target className="h-4 w-4 mr-2 inline" />
                  Relevance
                </SelectItem>
                <SelectItem value="price">
                  <DollarSign className="h-4 w-4 mr-2 inline" />
                  Price
                </SelectItem>
                <SelectItem value="rating">
                  <Star className="h-4 w-4 mr-2 inline" />
                  Rating
                </SelectItem>
                <SelectItem value="availability">
                  <Clock className="h-4 w-4 mr-2 inline" />
                  Availability
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Layout selector */}
            <div className="flex items-center border rounded-lg">
              <Button
                variant={currentLayout === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => handleLayoutChange("grid")}
                className="rounded-r-none"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={currentLayout === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => handleLayoutChange("list")}
                className="rounded-none border-x"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={currentLayout === "carousel" ? "default" : "ghost"}
                size="icon"
                onClick={() => handleLayoutChange("carousel")}
                className="rounded-l-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && <ResultsSkeleton layout={currentLayout} />}

      {/* No results state */}
      {hasNoResults && (
        <NoResults
          query={searchQuery?.original}
          suggestions={[
            "Musicians",
            "Comedians",
            "Singers",
            "DJs under $100",
            "Available today"
          ]}
          onSearch={onSearch}
        />
      )}

      {/* Results display */}
      {!isLoading && !hasNoResults && (
        <div className="space-y-6">
          {/* Quick answers */}
          {processedResults.find(r => r.type === "quick_answer") && (
            <QuickAnswer
              result={processedResults.find(r => r.type === "quick_answer")!}
              onSearch={onSearch}
            />
          )}

          {/* Grouped results */}
          {enableGrouping ? (
            resultGroups.map(group => (
              <CategoryGroup
                key={group.id}
                group={group}
                layout={currentLayout}
                onCreatorSelect={onCreatorSelect}
                onLoadMore={() => onLoadMore?.(group.id)}
                showExplanations={showExplanations}
              />
            ))
          ) : (
            <div className={cn(
              currentLayout === "grid" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
              currentLayout === "list" && "space-y-4",
              currentLayout === "carousel" && "flex gap-4 overflow-x-auto pb-2",
              currentLayout === "compact" && "space-y-2"
            )}>
              {processedResults.map(result => (
                <CreatorResult
                  key={result.id}
                  result={result}
                  layout={currentLayout}
                  onSelect={onCreatorSelect}
                  showExplanation={showExplanations}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Hook for managing search results
export function useSearchResults() {
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const rankingAlgorithm = React.useMemo(() => new SearchRankingAlgorithm(), [])

  const processSearchResults = React.useCallback((
    creators: EnhancedCreator[],
    query: SearchQuery
  ): SearchResult[] => {
    return creators.map((creator, index) => {
      // Calculate ranking factors
      const factors: RankingFactors = {
        queryMatch: calculateQueryMatch(creator, query),
        creatorPopularity: calculatePopularity(creator),
        userPreferences: Math.random(), // Would use actual user data
        availability: creator.availability === "available" ? 1 : 0.5,
        responseTime: calculateResponseTimeScore(creator.responseTime),
        priceMatch: Math.random() // Would compare with user's typical spending
      }

      // Determine badges
      const badges: VisualBadgeType[] = []
      if (creator.verified) badges.push("verified")
      if (creator.trending) badges.push("trending")
      if (creator.featured) badges.push("featured")
      if (creator.availability === "available") badges.push("available_now")
      if (index === 0) badges.push("sponsored") // Mock sponsored

      return {
        id: creator.id,
        type: "creator_card",
        score: 0, // Will be calculated by ranking algorithm
        rankingFactors: factors,
        data: creator,
        metadata: {
          position: index + 1,
          source: "search",
          badges
        }
      }
    })
  }, [])

  // Helper functions
  function calculateQueryMatch(creator: EnhancedCreator, query: SearchQuery): number {
    const nameMatch = creator.name.toLowerCase().includes(query.cleaned) ? 1 : 0
    const categoryMatch = creator.category.toLowerCase().includes(query.cleaned) ? 0.7 : 0
    const bioMatch = creator.bio?.toLowerCase().includes(query.cleaned) ? 0.5 : 0
    
    return Math.max(nameMatch, categoryMatch, bioMatch)
  }

  function calculatePopularity(creator: EnhancedCreator): number {
    const ratingScore = creator.rating / 5
    const reviewScore = Math.min(creator.reviewCount / 100, 1)
    const videoScore = Math.min((creator.videoCount || 0) / 50, 1)
    
    return (ratingScore * 0.5 + reviewScore * 0.3 + videoScore * 0.2)
  }

  function calculateResponseTimeScore(responseTime: string): number {
    if (responseTime.includes("hour")) return 1
    if (responseTime.includes("1 day")) return 0.8
    if (responseTime.includes("2 day")) return 0.6
    if (responseTime.includes("3 day")) return 0.4
    return 0.2
  }

  return {
    results,
    setResults,
    isLoading,
    setIsLoading,
    processSearchResults,
    rankingAlgorithm
  }
}