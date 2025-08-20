"use client"

import * as React from "react"
import { MobileSearchExperience } from "./mobile-search-experience"
import { SearchBar } from "@/components/ui/search-bar"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { FilterState } from "./filter-sidebar"

interface MobileSearchIntegrationProps {
  creators?: EnhancedCreator[]
  onSearch: (query: string, filters?: FilterState) => void
  className?: string
}

/**
 * Mobile-optimized search integration that automatically switches between
 * desktop and mobile search experiences based on screen size.
 * 
 * Features:
 * - Responsive design with automatic switching
 * - Mobile-first optimizations for touch devices
 * - Voice search on mobile
 * - Bottom sheet filters on mobile
 * - Expandable search interface on mobile
 * - Haptic feedback for touch interactions
 * - Intelligent autocomplete with shortcuts
 */
export function MobileSearchIntegration({
  creators = [],
  onSearch,
  className
}: MobileSearchIntegrationProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [searchQuery, setSearchQuery] = React.useState("")

  // Handle desktop search
  const handleDesktopSearch = (query: string) => {
    onSearch(query)
  }

  if (isMobile) {
    // Mobile experience with all optimizations
    return (
      <MobileSearchExperience
        creators={creators}
        onSearch={onSearch}
        className={className}
      />
    )
  }

  // Desktop experience
  return (
    <SearchBar
      value={searchQuery}
      onChange={setSearchQuery}
      onSearch={handleDesktopSearch}
      variant="large"
      className={className}
      placeholder="Search for creators, categories, or occasions..."
      showSuggestions={true}
    />
  )
}

// Example usage in a page component
export function MobileSearchExample() {
  const [searchResults, setSearchResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSearch = async (query: string, filters?: FilterState) => {
    setIsLoading(true)
    
    // Simulate API call
    console.log("Searching for:", query, "with filters:", filters)
    
    try {
      // Your actual search implementation here
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Set results
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with mobile search */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-3">
          <MobileSearchIntegration
            onSearch={handleSearch}
          />
        </div>
      </header>

      {/* Results */}
      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span>Searching...</span>
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Render search results */}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Start searching to find amazing creators!</p>
          </div>
        )}
      </main>
    </div>
  )
}