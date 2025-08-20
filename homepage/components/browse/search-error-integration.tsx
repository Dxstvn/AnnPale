"use client"

import * as React from "react"
import { SearchErrorHandler, type SearchErrorType } from "./search-error-handler"
import { SmartSuggestions } from "./smart-suggestions"
import { SearchEmptyState } from "./search-empty-states"
import { useSearchResilience, OfflineIndicator, ConnectionSpeedIndicator } from "./search-resilience"
import { toast } from "sonner"
import type { FilterState } from "./filter-sidebar"

interface SearchErrorIntegrationProps {
  searchQuery?: string
  filters: FilterState
  totalResults: number
  isLoading: boolean
  error?: Error | null
  onRetry: () => void
  onClearSearch: () => void
  onClearFilters: () => void
  onBrowseAll: () => void
  onApplyFilters: (filters: FilterState) => void
  onSearch: (query: string) => void
  className?: string
}

/**
 * Integrated Search Error Handling System
 * Combines all error handling, recovery, and suggestion components
 */
export function SearchErrorIntegration({
  searchQuery,
  filters,
  totalResults,
  isLoading,
  error,
  onRetry,
  onClearSearch,
  onClearFilters,
  onBrowseAll,
  onApplyFilters,
  onSearch,
  className
}: SearchErrorIntegrationProps) {
  const [searchError, setSearchError] = React.useState<{
    type: SearchErrorType
    message?: string
    details?: any
    timestamp: Date
    retryable: boolean
    retryCount?: number
  } | null>(null)

  const {
    networkStatus,
    isRetrying,
    resilientSearch,
    getCachedResults
  } = useSearchResilience({
    maxRetries: 3,
    retryDelay: 1000,
    cacheEnabled: true,
    cacheTTL: 5 * 60 * 1000
  })

  // Determine error type from error object
  React.useEffect(() => {
    if (!error) {
      setSearchError(null)
      return
    }

    let errorType: SearchErrorType = "unknown"
    let retryable = true

    if (error.message?.includes("network") || error.message?.includes("fetch")) {
      errorType = "network-error"
    } else if (error.message?.includes("timeout")) {
      errorType = "timeout"
    } else if (error.message?.includes("rate")) {
      errorType = "rate-limited"
      retryable = false
    } else if (error.message?.includes("invalid")) {
      errorType = "invalid-query"
      retryable = false
    } else if (error.message?.includes("server")) {
      errorType = "server-error"
    }

    setSearchError({
      type: errorType,
      message: error.message,
      details: error,
      timestamp: new Date(),
      retryable,
      retryCount: 0
    })
  }, [error])

  // Handle no results scenario
  const hasNoResults = !isLoading && !error && totalResults === 0 && (searchQuery || hasActiveFilters(filters))
  
  // Determine which empty state to show
  const getEmptyStateType = () => {
    if (isLoading) return null
    if (error) return null
    if (!searchQuery && !hasActiveFilters(filters)) return "initial"
    if (hasNoResults) return "no-results"
    return null
  }

  const emptyStateType = getEmptyStateType()

  // Handle retry with resilience
  const handleResilientRetry = async () => {
    try {
      await resilientSearch(
        searchQuery || "",
        filters,
        onRetry
      )
    } catch (err) {
      toast.error("Search failed after multiple retries")
    }
  }

  // Handle suggestion application
  const handleApplySuggestion = (suggestion: any) => {
    if (suggestion.action) {
      suggestion.action()
    }
  }

  // Show network status indicators
  return (
    <>
      {/* Network Status Indicators */}
      <OfflineIndicator />
      <ConnectionSpeedIndicator />

      {/* Error Handler */}
      {searchError && (
        <SearchErrorHandler
          error={searchError}
          searchQuery={searchQuery}
          onRetry={handleResilientRetry}
          onClear={onClearSearch}
          onBrowseAll={onBrowseAll}
          onSuggestionClick={onSearch}
          className={className}
        />
      )}

      {/* Smart Suggestions for No Results */}
      {hasNoResults && !searchError && (
        <div className={className}>
          <SmartSuggestions
            searchQuery={searchQuery}
            currentFilters={filters}
            totalCreators={totalResults}
            onApplySuggestion={handleApplySuggestion}
          />
        </div>
      )}

      {/* Empty States */}
      {emptyStateType && !searchError && (
        <SearchEmptyState
          type={emptyStateType}
          searchQuery={searchQuery}
          filters={filters}
          onAction={emptyStateType === "no-results" ? onClearSearch : onBrowseAll}
          onSecondaryAction={onBrowseAll}
          className={className}
        />
      )}
    </>
  )
}

// Helper function to check if filters are active
function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.categories.length > 0 ||
    filters.languages.length > 0 ||
    filters.responseTime.length > 0 ||
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) ||
    filters.rating > 0 ||
    filters.availability !== "any" ||
    filters.verified ||
    !!filters.location
  )
}

/**
 * Example usage of the integrated error handling system
 */
export function SearchWithErrorHandling() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filters, setFilters] = React.useState<FilterState>({
    categories: [],
    priceRange: [0, 500],
    languages: [],
    rating: 0,
    responseTime: [],
    availability: "any",
    verified: false,
    location: ""
  })
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const performSearch = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      const response = await fetch(`/api/search?q=${searchQuery}`)
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data.results || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Search UI components */}
      
      {/* Integrated Error Handling */}
      <SearchErrorIntegration
        searchQuery={searchQuery}
        filters={filters}
        totalResults={results.length}
        isLoading={isLoading}
        error={error}
        onRetry={performSearch}
        onClearSearch={() => setSearchQuery("")}
        onClearFilters={() => setFilters({
          categories: [],
          priceRange: [0, 500],
          languages: [],
          rating: 0,
          responseTime: [],
          availability: "any",
          verified: false,
          location: ""
        })}
        onBrowseAll={() => {
          setSearchQuery("")
          setFilters({
            categories: [],
            priceRange: [0, 500],
            languages: [],
            rating: 0,
            responseTime: [],
            availability: "any",
            verified: false,
            location: ""
          })
          performSearch()
        }}
        onApplyFilters={setFilters}
        onSearch={(query) => {
          setSearchQuery(query)
          performSearch()
        }}
      />

      {/* Results display */}
      {!error && !isLoading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Render results */}
        </div>
      )}
    </div>
  )
}