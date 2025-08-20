"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Filter,
  Settings,
  TrendingUp,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Heart,
  Eye,
  BarChart3,
  Layers,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Import filter components
import { QuickFilterPills, FilterCombinationHints } from "./quick-filter-pills"
import type { QuickFilter } from "./quick-filter-pills"
import { AdvancedFilterPanel, useFilterPersistence, DEFAULT_ADVANCED_FILTERS } from "./advanced-filter-panel"
import type { AdvancedFilterState } from "./advanced-filter-panel"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { SearchQuery } from "./search-intent-engine"

interface IntegratedFilterSystemProps {
  creators?: EnhancedCreator[]
  searchQuery?: SearchQuery
  onFiltersChange: (filters: CombinedFilterState) => void
  onSearch?: (query: string) => void
  resultCount?: number
  enableSmartSuggestions?: boolean
  enablePersistence?: boolean
  showAnalytics?: boolean
  className?: string
}

// Combined filter state
export interface CombinedFilterState {
  quick: QuickFilter[]
  advanced: AdvancedFilterState
  active: boolean
  timestamp: number
}

// Filter analytics
interface FilterAnalytics {
  totalFiltersApplied: number
  averageFiltersPerSearch: number
  mostUsedFilters: Record<string, number>
  filterEffectiveness: number
  noResultsCount: number
  filterCombinations: Array<{
    filters: string[]
    count: number
    avgResults: number
  }>
}

// Smart filter suggestions based on context
interface SmartSuggestion {
  type: "filter" | "combination" | "alternative"
  title: string
  description: string
  filters: Partial<AdvancedFilterState>
  confidence: number
  reason: string
}

export function IntegratedFilterSystem({
  creators = [],
  searchQuery,
  onFiltersChange,
  onSearch,
  resultCount = 0,
  enableSmartSuggestions = true,
  enablePersistence = true,
  showAnalytics = false,
  className
}: IntegratedFilterSystemProps) {
  const [quickFilters, setQuickFilters] = React.useState<QuickFilter[]>([])
  const [advancedFilters, setAdvancedFilters] = React.useState<AdvancedFilterState>(DEFAULT_ADVANCED_FILTERS)
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [predictedCount, setPredictedCount] = React.useState<number | undefined>()
  const [smartSuggestions, setSmartSuggestions] = React.useState<SmartSuggestion[]>([])
  const [filterAnalytics, setFilterAnalytics] = React.useState<FilterAnalytics>({
    totalFiltersApplied: 0,
    averageFiltersPerSearch: 0,
    mostUsedFilters: {},
    filterEffectiveness: 0,
    noResultsCount: 0,
    filterCombinations: []
  })
  const [isProcessing, setIsProcessing] = React.useState(false)
  
  const { savedFilters, saveFilter, useFilter } = useFilterPersistence()

  // Combine quick and advanced filters
  const combineFilters = React.useCallback((): CombinedFilterState => {
    return {
      quick: quickFilters,
      advanced: advancedFilters,
      active: quickFilters.length > 0 || JSON.stringify(advancedFilters) !== JSON.stringify(DEFAULT_ADVANCED_FILTERS),
      timestamp: Date.now()
    }
  }, [quickFilters, advancedFilters])

  // Handle quick filter changes
  const handleQuickFilterChange = React.useCallback((filters: QuickFilter[]) => {
    setQuickFilters(filters)
    
    // Sync with advanced filters
    const updatedAdvanced = { ...advancedFilters }
    
    // Map quick filters to advanced filter state
    filters.forEach(filter => {
      if (filter.active) {
        switch (filter.type) {
          case "price":
            updatedAdvanced.priceRange = [filter.value.min, filter.value.max]
            break
          case "category":
            if (!updatedAdvanced.categories.includes(filter.value)) {
              updatedAdvanced.categories.push(filter.value)
            }
            break
          case "availability":
            updatedAdvanced.availability = filter.value
            break
          case "rating":
            updatedAdvanced.rating = filter.value
            break
          case "language":
            if (!updatedAdvanced.languages.includes(filter.value)) {
              updatedAdvanced.languages.push(filter.value)
            }
            break
        }
      }
    })
    
    setAdvancedFilters(updatedAdvanced)
    
    // Predict results
    predictResultCount(filters, updatedAdvanced)
    
    // Notify parent
    onFiltersChange(combineFilters())
    
    // Update analytics
    updateFilterAnalytics(filters, updatedAdvanced)
  }, [advancedFilters, combineFilters, onFiltersChange])

  // Handle advanced filter changes
  const handleAdvancedFilterChange = React.useCallback((filters: AdvancedFilterState) => {
    setAdvancedFilters(filters)
    
    // Sync with quick filters
    const updatedQuick = quickFilters.map(qf => {
      // Update quick filter active state based on advanced filters
      let shouldBeActive = false
      
      switch (qf.type) {
        case "price":
          shouldBeActive = filters.priceRange[0] === qf.value.min && 
                          filters.priceRange[1] === qf.value.max
          break
        case "category":
          shouldBeActive = filters.categories.includes(qf.value)
          break
        case "availability":
          shouldBeActive = filters.availability === qf.value
          break
        case "rating":
          shouldBeActive = filters.rating === qf.value
          break
        case "language":
          shouldBeActive = filters.languages.includes(qf.value)
          break
      }
      
      return { ...qf, active: shouldBeActive }
    })
    
    setQuickFilters(updatedQuick)
    
    // Predict results
    predictResultCount(updatedQuick, filters)
    
    // Notify parent
    onFiltersChange(combineFilters())
    
    // Update analytics
    updateFilterAnalytics(updatedQuick, filters)
  }, [quickFilters, combineFilters, onFiltersChange])

  // Predict result count based on filters
  const predictResultCount = React.useCallback(async (
    quick: QuickFilter[],
    advanced: AdvancedFilterState
  ) => {
    setIsProcessing(true)
    
    // Simulate prediction (in production, would call an API)
    setTimeout(() => {
      let predicted = creators.length
      
      // Apply filter reduction estimates
      if (advanced.categories.length > 0) {
        predicted *= 0.3 // Categories typically reduce by 70%
      }
      if (advanced.priceRange[1] < 500) {
        predicted *= 0.8 // Price filters reduce by 20%
      }
      if (advanced.rating > 0) {
        predicted *= (5 - advanced.rating) / 5 // Higher ratings = fewer results
      }
      if (advanced.languages.length > 0) {
        predicted *= 0.6 // Language filters reduce by 40%
      }
      if (advanced.verified) {
        predicted *= 0.4 // Verified only reduces by 60%
      }
      
      setPredictedCount(Math.floor(predicted))
      setIsProcessing(false)
      
      // Generate smart suggestions if results are low
      if (predicted < 5 && enableSmartSuggestions) {
        generateSmartSuggestions(quick, advanced, predicted)
      }
    }, 300)
  }, [creators.length, enableSmartSuggestions])

  // Generate smart filter suggestions
  const generateSmartSuggestions = React.useCallback((
    quick: QuickFilter[],
    advanced: AdvancedFilterState,
    predictedResults: number
  ) => {
    const suggestions: SmartSuggestion[] = []
    
    // Suggest removing restrictive filters
    if (predictedResults < 5) {
      if (advanced.verified) {
        suggestions.push({
          type: "alternative",
          title: "Include non-verified creators",
          description: "Expand your options by including all creators",
          filters: { ...advanced, verified: false },
          confidence: 0.9,
          reason: "Too few verified creators match your criteria"
        })
      }
      
      if (advanced.rating >= 4.5) {
        suggestions.push({
          type: "alternative",
          title: "Lower rating threshold",
          description: "Consider creators with 4+ stars",
          filters: { ...advanced, rating: 4 },
          confidence: 0.85,
          reason: "Very few creators have 4.5+ rating"
        })
      }
      
      if (advanced.priceRange[1] < 100) {
        suggestions.push({
          type: "alternative",
          title: "Increase budget",
          description: "More options available at $100-150",
          filters: { ...advanced, priceRange: [advanced.priceRange[0], 150] },
          confidence: 0.8,
          reason: "Limited creators in this price range"
        })
      }
    }
    
    // Suggest popular combinations based on search query
    if (searchQuery) {
      if (searchQuery.pattern === "exploratory") {
        suggestions.push({
          type: "combination",
          title: "Popular filters for browsing",
          description: "Most users apply these filters when exploring",
          filters: {
            ...advanced,
            categories: ["musicians", "comedians"],
            priceRange: [0, 100],
            availability: "this-week"
          },
          confidence: 0.75,
          reason: "Based on popular browsing patterns"
        })
      }
      
      if (searchQuery.intent === "high") {
        suggestions.push({
          type: "filter",
          title: "Ready to book filters",
          description: "Find creators available immediately",
          filters: {
            ...advanced,
            availability: "available",
            responseTime: ["24hr"]
          },
          confidence: 0.7,
          reason: "You seem ready to book"
        })
      }
    }
    
    setSmartSuggestions(suggestions)
  }, [searchQuery])

  // Update filter analytics
  const updateFilterAnalytics = React.useCallback((
    quick: QuickFilter[],
    advanced: AdvancedFilterState
  ) => {
    setFilterAnalytics(prev => {
      const activeFilters = quick.filter(f => f.active).map(f => f.label)
      
      // Track filter usage
      const updatedMostUsed = { ...prev.mostUsedFilters }
      activeFilters.forEach(filter => {
        updatedMostUsed[filter] = (updatedMostUsed[filter] || 0) + 1
      })
      
      // Track combinations
      const combinationKey = activeFilters.sort().join("+")
      const existingCombo = prev.filterCombinations.find(c => 
        c.filters.sort().join("+") === combinationKey
      )
      
      let updatedCombinations = [...prev.filterCombinations]
      if (existingCombo) {
        existingCombo.count++
        existingCombo.avgResults = (existingCombo.avgResults + resultCount) / 2
      } else if (activeFilters.length > 0) {
        updatedCombinations.push({
          filters: activeFilters,
          count: 1,
          avgResults: resultCount
        })
      }
      
      // Sort combinations by usage
      updatedCombinations.sort((a, b) => b.count - a.count)
      
      // Calculate effectiveness
      const effectiveness = resultCount > 0 ? 
        Math.min(100, (resultCount / creators.length) * 100) : 0
      
      return {
        totalFiltersApplied: prev.totalFiltersApplied + activeFilters.length,
        averageFiltersPerSearch: activeFilters.length,
        mostUsedFilters: updatedMostUsed,
        filterEffectiveness: effectiveness,
        noResultsCount: resultCount === 0 ? prev.noResultsCount + 1 : prev.noResultsCount,
        filterCombinations: updatedCombinations.slice(0, 10) // Keep top 10
      }
    })
  }, [resultCount, creators.length])

  // Reset all filters
  const resetAllFilters = React.useCallback(() => {
    setQuickFilters([])
    setAdvancedFilters(DEFAULT_ADVANCED_FILTERS)
    setPredictedCount(undefined)
    setSmartSuggestions([])
    onFiltersChange({
      quick: [],
      advanced: DEFAULT_ADVANCED_FILTERS,
      active: false,
      timestamp: Date.now()
    })
    toast.success("All filters cleared")
  }, [onFiltersChange])

  // Apply smart suggestion
  const applySuggestion = React.useCallback((suggestion: SmartSuggestion) => {
    setAdvancedFilters(suggestion.filters as AdvancedFilterState)
    handleAdvancedFilterChange(suggestion.filters as AdvancedFilterState)
    toast.success(`Applied: ${suggestion.title}`)
  }, [handleAdvancedFilterChange])

  // Calculate active filter count
  const activeFilterCount = React.useMemo(() => {
    let count = quickFilters.filter(f => f.active).length
    
    // Add advanced filters
    if (advancedFilters.verified) count++
    if (advancedFilters.trending) count++
    if (advancedFilters.featured) count++
    if (advancedFilters.responseTime.length > 0) count++
    if (advancedFilters.videoCount[1] < 100) count++
    if (advancedFilters.reviewCount[1] < 1000) count++
    if (advancedFilters.completionRate > 0) count++
    
    return count
  }, [quickFilters, advancedFilters])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold">Filters & Refinement</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {showAnalytics && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Toggle analytics view
                toast.info("Filter analytics displayed below")
              }}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          )}
          
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAllFilters}
              className="text-red-600 hover:text-red-700"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset all
            </Button>
          )}
        </div>
      </div>

      {/* Quick filter pills */}
      <QuickFilterPills
        onFilterChange={handleQuickFilterChange}
        resultCount={resultCount}
        showAdvanced={true}
        onAdvancedClick={() => setShowAdvanced(true)}
        suggestions={quickFilters.filter(f => !f.active).slice(0, 3)}
      />

      {/* Filter combination hints */}
      {activeFilterCount > 0 && (
        <FilterCombinationHints
          activeFilters={quickFilters.filter(f => f.active)}
          onSuggestionClick={(suggestion) => {
            onSearch?.(suggestion)
          }}
        />
      )}

      {/* Smart suggestions */}
      {enableSmartSuggestions && smartSuggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Smart Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {smartSuggestions.slice(0, 3).map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => applySuggestion(suggestion)}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{suggestion.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {suggestion.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <Info className="h-3 w-3 inline mr-1" />
                    {suggestion.reason}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {Math.round(suggestion.confidence * 100)}% match
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Result prediction */}
      {predictedCount !== undefined && predictedCount !== resultCount && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">Calculating results...</span>
                  </>
                ) : predictedCount === 0 ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      No results expected with these filters
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      Expected: ~{predictedCount} results
                    </span>
                  </>
                )}
              </div>
              
              {predictedCount === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetAllFilters}
                >
                  Adjust filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics dashboard */}
      {showAnalytics && filterAnalytics.totalFiltersApplied > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Filter Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {filterAnalytics.totalFiltersApplied}
                </div>
                <div className="text-xs text-gray-600">Filters Applied</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {filterAnalytics.filterEffectiveness.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600">Effectiveness</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {filterAnalytics.averageFiltersPerSearch.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Avg per Search</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {filterAnalytics.noResultsCount}
                </div>
                <div className="text-xs text-gray-600">No Results</div>
              </div>
            </div>

            {/* Most used filters */}
            {Object.keys(filterAnalytics.mostUsedFilters).length > 0 && (
              <div>
                <h4 className="text-xs font-medium mb-2">Most Used Filters</h4>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(filterAnalytics.mostUsedFilters)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([filter, count]) => (
                      <Badge key={filter} variant="secondary" className="text-xs">
                        {filter} ({count})
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Popular combinations */}
            {filterAnalytics.filterCombinations.length > 0 && (
              <div>
                <h4 className="text-xs font-medium mb-2">Popular Combinations</h4>
                <div className="space-y-1">
                  {filterAnalytics.filterCombinations.slice(0, 3).map((combo, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        {combo.filters.join(" + ")}
                      </span>
                      <span className="text-gray-500">
                        {combo.count}x • ~{combo.avgResults.toFixed(0)} results
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Advanced filter panel */}
      <AdvancedFilterPanel
        filters={advancedFilters}
        onFiltersChange={handleAdvancedFilterChange}
        onReset={resetAllFilters}
        resultCount={resultCount}
        predictedCount={predictedCount}
        isOpen={showAdvanced}
        onClose={() => setShowAdvanced(false)}
        savedFilters={enablePersistence ? savedFilters : undefined}
        onSaveFilter={enablePersistence ? saveFilter : undefined}
      />
    </div>
  )
}

// Export hook for filter state management
export function useIntegratedFilters() {
  const [filterState, setFilterState] = React.useState<CombinedFilterState>({
    quick: [],
    advanced: DEFAULT_ADVANCED_FILTERS,
    active: false,
    timestamp: Date.now()
  })

  const [filterHistory, setFilterHistory] = React.useState<CombinedFilterState[]>([])

  // Track filter changes
  const updateFilters = React.useCallback((newState: CombinedFilterState) => {
    setFilterState(newState)
    setFilterHistory(prev => [...prev, newState].slice(-10)) // Keep last 10 states
  }, [])

  // Undo last filter change
  const undoFilters = React.useCallback(() => {
    if (filterHistory.length > 1) {
      const previousState = filterHistory[filterHistory.length - 2]
      setFilterState(previousState)
      setFilterHistory(prev => prev.slice(0, -1))
      toast.success("Filter change undone")
    }
  }, [filterHistory])

  return {
    filterState,
    updateFilters,
    undoFilters,
    canUndo: filterHistory.length > 1
  }
}