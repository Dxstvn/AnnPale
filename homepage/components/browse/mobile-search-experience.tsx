"use client"

import * as React from "react"
import { MobileSearch } from "./mobile-search"
import { MobileFilterSheet } from "./mobile-filter-sheet"
import { MobileAutocomplete } from "./mobile-autocomplete"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { FilterState } from "./filter-sidebar"
import type { EnhancedCreator } from "./enhanced-creator-card"

interface MobileSearchExperienceProps {
  creators?: EnhancedCreator[]
  onSearch: (query: string, filters?: FilterState) => void
  className?: string
}

export function MobileSearchExperience({
  creators = [],
  onSearch,
  className
}: MobileSearchExperienceProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
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
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Load recent searches
  React.useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Handle search
  const handleSearch = React.useCallback((query: string) => {
    setIsSearching(true)
    onSearch(query, filters)
    
    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
    
    setTimeout(() => setIsSearching(false), 500)
  }, [filters, recentSearches, onSearch])

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    if (searchQuery) {
      handleSearch(searchQuery)
    }
  }

  // Calculate active filter count
  const filterCount = React.useMemo(() => {
    let count = 0
    if (filters.categories.length > 0) count += filters.categories.length
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++
    if (filters.languages.length > 0) count += filters.languages.length
    if (filters.rating > 0) count++
    if (filters.responseTime.length > 0) count += filters.responseTime.length
    if (filters.availability !== "any") count++
    if (filters.verified) count++
    if (filters.location) count++
    return count
  }, [filters])

  // Popular searches based on current time
  const trendingSearches = React.useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      return ["Morning motivation", "Birthday wishes", "Good morning messages"]
    } else if (hour < 18) {
      return ["Afternoon greetings", "Wedding congratulations", "Anniversary wishes"]
    } else {
      return ["Evening entertainment", "Comedians", "Music artists"]
    }
  }, [])

  // Popular categories
  const popularCategories = ["Musicians", "Comedians", "Athletes", "Influencers"]

  if (!isMobile) {
    // Desktop fallback - use regular search components
    return null
  }

  return (
    <div className={cn("relative", className)}>
      {/* Mobile Search Bar */}
      <MobileSearch
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        onClear={() => setSearchQuery("")}
        onFilterClick={() => setIsFilterOpen(true)}
        recentSearches={recentSearches}
        trendingSearches={trendingSearches}
        popularCategories={popularCategories}
        loading={isSearching}
        filterCount={filterCount}
      />

      {/* Filter Bottom Sheet */}
      <MobileFilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        creatorCount={creators.length}
      />

      {/* Search Results Feedback */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 left-4 right-4 z-30"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <div>
                  <p className="text-sm font-medium">Searching creators...</p>
                  <p className="text-xs text-gray-500">
                    {filterCount > 0 ? `With ${filterCount} filters applied` : "All creators"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Haptic Feedback Hook */}
      <HapticFeedback />
    </div>
  )
}

// Haptic feedback component for mobile interactions
function HapticFeedback() {
  React.useEffect(() => {
    const handleTouchStart = () => {
      // Trigger haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(10) // Short vibration for touch feedback
      }
    }

    // Add to all interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, .touch-manipulation, input, textarea'
    )
    
    interactiveElements.forEach(el => {
      el.addEventListener('touchstart', handleTouchStart, { passive: true })
    })

    return () => {
      interactiveElements.forEach(el => {
        el.removeEventListener('touchstart', handleTouchStart)
      })
    }
  }, [])

  return null
}

// Export individual components for flexibility
export { MobileSearch, MobileFilterSheet, MobileAutocomplete }