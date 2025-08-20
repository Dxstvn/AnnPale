"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DollarSign,
  Users,
  Calendar,
  Star,
  Globe,
  Filter,
  X,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Info,
  RotateCcw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Filter pill types
export interface QuickFilter {
  id: string
  type: "price" | "category" | "availability" | "rating" | "language"
  label: string
  value: any
  icon: React.ReactNode
  active: boolean
  count?: number
  color?: string
}

export interface FilterPillsProps {
  onFilterChange?: (filters: QuickFilter[]) => void
  resultCount?: number
  showAdvanced?: boolean
  onAdvancedClick?: () => void
  suggestions?: QuickFilter[]
  className?: string
}

// Default quick filters
const DEFAULT_QUICK_FILTERS: QuickFilter[] = [
  // Price filters
  {
    id: "price_under_50",
    type: "price",
    label: "Under $50",
    value: { min: 0, max: 50 },
    icon: <DollarSign className="h-3 w-3" />,
    active: false,
    color: "green"
  },
  {
    id: "price_50_100",
    type: "price",
    label: "$50-$100",
    value: { min: 50, max: 100 },
    icon: <DollarSign className="h-3 w-3" />,
    active: false,
    color: "blue"
  },
  {
    id: "price_over_100",
    type: "price",
    label: "$100+",
    value: { min: 100, max: 999999 },
    icon: <DollarSign className="h-3 w-3" />,
    active: false,
    color: "purple"
  },
  
  // Category filters
  {
    id: "cat_musicians",
    type: "category",
    label: "Musicians",
    value: "musicians",
    icon: <Users className="h-3 w-3" />,
    active: false
  },
  {
    id: "cat_comedians",
    type: "category",
    label: "Comedians",
    value: "comedians",
    icon: <Users className="h-3 w-3" />,
    active: false
  },
  
  // Availability filters
  {
    id: "avail_today",
    type: "availability",
    label: "Today",
    value: "today",
    icon: <Calendar className="h-3 w-3" />,
    active: false
  },
  {
    id: "avail_week",
    type: "availability",
    label: "This Week",
    value: "this_week",
    icon: <Calendar className="h-3 w-3" />,
    active: false
  },
  
  // Rating filters
  {
    id: "rating_4plus",
    type: "rating",
    label: "4+ Stars",
    value: 4,
    icon: <Star className="h-3 w-3" />,
    active: false
  },
  {
    id: "rating_45plus",
    type: "rating",
    label: "4.5+ Stars",
    value: 4.5,
    icon: <Star className="h-3 w-3" />,
    active: false
  },
  
  // Language filters
  {
    id: "lang_en",
    type: "language",
    label: "English",
    value: "en",
    icon: <Globe className="h-3 w-3" />,
    active: false
  },
  {
    id: "lang_fr",
    type: "language",
    label: "Français",
    value: "fr",
    icon: <Globe className="h-3 w-3" />,
    active: false
  },
  {
    id: "lang_ht",
    type: "language",
    label: "Kreyòl",
    value: "ht",
    icon: <Globe className="h-3 w-3" />,
    active: false
  }
]

export function QuickFilterPills({
  onFilterChange,
  resultCount = 0,
  showAdvanced = true,
  onAdvancedClick,
  suggestions = [],
  className
}: FilterPillsProps) {
  const [filters, setFilters] = React.useState<QuickFilter[]>(DEFAULT_QUICK_FILTERS)
  const [visibleCount, setVisibleCount] = React.useState(5)
  const [showAllFilters, setShowAllFilters] = React.useState(false)
  const [predictedResults, setPredictedResults] = React.useState<Record<string, number>>({})
  const [isCalculating, setIsCalculating] = React.useState(false)
  
  // Get active filters count
  const activeFiltersCount = filters.filter(f => f.active).length
  
  // Get visible filters
  const visibleFilters = showAllFilters ? filters : filters.slice(0, visibleCount)
  const hasMoreFilters = filters.length > visibleCount && !showAllFilters

  // Toggle filter
  const toggleFilter = React.useCallback((filterId: string) => {
    setFilters(prev => {
      const updated = prev.map(filter => {
        if (filter.id === filterId) {
          return { ...filter, active: !filter.active }
        }
        
        // Handle single-select behavior for certain types
        if (filter.active) {
          const clickedFilter = prev.find(f => f.id === filterId)
          if (clickedFilter) {
            // Single-select for category and availability
            if ((filter.type === "category" && clickedFilter.type === "category") ||
                (filter.type === "availability" && clickedFilter.type === "availability") ||
                (filter.type === "rating" && clickedFilter.type === "rating")) {
              return { ...filter, active: false }
            }
          }
        }
        
        return filter
      })
      
      // Notify parent
      onFilterChange?.(updated.filter(f => f.active))
      
      // Predict results
      predictResultCount(updated)
      
      return updated
    })
  }, [onFilterChange])

  // Predict result count for filter combinations
  const predictResultCount = React.useCallback(async (currentFilters: QuickFilter[]) => {
    setIsCalculating(true)
    
    // Simulate prediction calculation
    setTimeout(() => {
      const predictions: Record<string, number> = {}
      
      currentFilters.forEach(filter => {
        if (!filter.active) {
          // Predict what would happen if this filter was added
          const wouldBeActive = [...currentFilters.filter(f => f.active), filter]
          const multiplier = 1 - (wouldBeActive.length * 0.15) // Each filter reduces results
          predictions[filter.id] = Math.floor(resultCount * multiplier * Math.random())
        }
      })
      
      setPredictedResults(predictions)
      setIsCalculating(false)
    }, 300)
  }, [resultCount])

  // Clear all filters
  const clearAllFilters = React.useCallback(() => {
    setFilters(prev => prev.map(f => ({ ...f, active: false })))
    onFilterChange?.([])
    setPredictedResults({})
    toast.success("All filters cleared")
  }, [onFilterChange])

  // Get filter pill variant based on state
  const getFilterVariant = (filter: QuickFilter): string => {
    if (filter.active) return "default"
    if (predictedResults[filter.id] === 0) return "outline opacity-50"
    return "outline"
  }

  // Get filter pill color
  const getFilterColor = (filter: QuickFilter): string => {
    if (!filter.active) return ""
    
    switch (filter.type) {
      case "price": return "bg-green-100 hover:bg-green-200 dark:bg-green-900/30"
      case "category": return "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30"
      case "availability": return "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30"
      case "rating": return "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30"
      case "language": return "bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/30"
      default: return ""
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Filter pills container */}
      <div className="flex flex-wrap items-center gap-2">
        <AnimatePresence mode="popLayout">
          {visibleFilters.map((filter) => (
            <motion.div
              key={filter.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Badge
                variant={filter.active ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:scale-105",
                  filter.active && getFilterColor(filter),
                  predictedResults[filter.id] === 0 && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => {
                  if (predictedResults[filter.id] !== 0 || filter.active) {
                    toggleFilter(filter.id)
                  } else {
                    toast.warning("This filter would return no results")
                  }
                }}
              >
                {filter.icon}
                <span className="ml-1">{filter.label}</span>
                {filter.active && (
                  <X 
                    className="ml-1 h-3 w-3 hover:text-red-500" 
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFilter(filter.id)
                    }}
                  />
                )}
                {!filter.active && predictedResults[filter.id] !== undefined && (
                  <span className="ml-1 text-xs opacity-60">
                    ({predictedResults[filter.id]})
                  </span>
                )}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Show more button */}
        {hasMoreFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllFilters(true)}
            className="h-7"
          >
            <ChevronDown className="h-3 w-3 mr-1" />
            {filters.length - visibleCount} more
          </Button>
        )}

        {/* Advanced filters button */}
        {showAdvanced && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAdvancedClick}
            className="h-7"
          >
            <Filter className="h-3 w-3 mr-1" />
            Advanced
          </Button>
        )}

        {/* Clear all button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 text-red-600 hover:text-red-700"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Clear all ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Filter feedback bar */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
        >
          <div className="flex items-center gap-2">
            {isCalculating ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                <span>Updating results...</span>
              </div>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">
                  {resultCount} results found
                </span>
                <span className="text-xs text-gray-500">
                  with {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>

          {/* Smart suggestions */}
          {suggestions.length > 0 && (
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-gray-600">
                Try also: {suggestions.slice(0, 2).map(s => s.label).join(", ")}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* No results prevention */}
      {resultCount === 0 && activeFiltersCount > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900 dark:text-orange-200">
                  No results with current filters
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  Try removing some filters or adjusting your criteria
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Reset filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Filter combination hints component
export function FilterCombinationHints({
  activeFilters,
  onSuggestionClick
}: {
  activeFilters: QuickFilter[]
  onSuggestionClick: (suggestion: string) => void
}) {
  const [hints, setHints] = React.useState<string[]>([])

  React.useEffect(() => {
    // Generate smart hints based on active filters
    const newHints: string[] = []
    
    if (activeFilters.some(f => f.type === "price" && f.value.max <= 50)) {
      newHints.push("Budget-friendly comedians are popular!")
    }
    
    if (activeFilters.some(f => f.type === "availability" && f.value === "today")) {
      newHints.push("Last-minute bookings may have premium pricing")
    }
    
    if (activeFilters.some(f => f.type === "rating" && f.value >= 4.5)) {
      newHints.push("Top-rated creators book quickly")
    }
    
    if (activeFilters.length >= 3) {
      newHints.push("Too many filters? Try broadening your search")
    }
    
    setHints(newHints)
  }, [activeFilters])

  if (hints.length === 0) return null

  return (
    <div className="space-y-2">
      {hints.map((hint, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
        >
          <Info className="h-4 w-4 text-blue-500" />
          <span className="text-xs text-blue-700 dark:text-blue-300">{hint}</span>
        </motion.div>
      ))}
    </div>
  )
}

export default QuickFilterPills
