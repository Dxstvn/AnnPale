"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ArrowUpDown,
  TrendingUp,
  DollarSign,
  Star,
  Clock,
  Calendar,
  Sparkles,
  Users,
  MapPin,
  BarChart3,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { EnhancedCreator } from "./enhanced-creator-card"

export type SortOption = 
  | "recommended"
  | "popular" 
  | "price-low"
  | "price-high"
  | "rating"
  | "newest"
  | "response"
  | "availability"
  | "distance"
  | "bookings"
  | "trending"

export interface SortConfig {
  id: SortOption
  label: string
  description: string
  icon: React.ElementType
  bestFor: string
  requiresLocation?: boolean
  requiresAuth?: boolean
  beta?: boolean
}

const sortConfigurations: SortConfig[] = [
  {
    id: "recommended",
    label: "Recommended",
    description: "Personalized for you",
    icon: Sparkles,
    bestFor: "Best overall match"
  },
  {
    id: "popular",
    label: "Most Popular",
    description: "Based on bookings",
    icon: TrendingUp,
    bestFor: "Social proof"
  },
  {
    id: "price-low",
    label: "Price: Low to High",
    description: "Budget-friendly first",
    icon: DollarSign,
    bestFor: "Budget conscious"
  },
  {
    id: "price-high",
    label: "Price: High to Low",
    description: "Premium creators first",
    icon: DollarSign,
    bestFor: "Premium seekers"
  },
  {
    id: "rating",
    label: "Highest Rated",
    description: "Top-rated creators",
    icon: Star,
    bestFor: "Quality focus"
  },
  {
    id: "newest",
    label: "Newest First",
    description: "Recently joined",
    icon: Users,
    bestFor: "Early adopters"
  },
  {
    id: "response",
    label: "Fastest Response",
    description: "Quick turnaround",
    icon: Clock,
    bestFor: "Urgent needs"
  },
  {
    id: "availability",
    label: "Soonest Available",
    description: "Available now",
    icon: Calendar,
    bestFor: "Time-sensitive"
  },
  {
    id: "distance",
    label: "Nearest First",
    description: "Closest to you",
    icon: MapPin,
    bestFor: "Local preference",
    requiresLocation: true
  },
  {
    id: "bookings",
    label: "Most Bookings",
    description: "Frequently booked",
    icon: BarChart3,
    bestFor: "Proven performers"
  },
  {
    id: "trending",
    label: "Trending Now",
    description: "Hot right now",
    icon: TrendingUp,
    bestFor: "Current favorites",
    beta: true
  }
]

interface EnhancedSortingProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
  userSegment?: "student" | "business" | "general"
  entryContext?: "homepage" | "browse" | "category" | "search"
  hasLocation?: boolean
  isAuthenticated?: boolean
  className?: string
}

export function EnhancedSorting({
  currentSort,
  onSortChange,
  userSegment = "general",
  entryContext = "browse",
  hasLocation = false,
  isAuthenticated = false,
  className
}: EnhancedSortingProps) {
  // Get context-aware default sort
  const getDefaultSort = (): SortOption => {
    // Context-based defaults
    if (entryContext === "homepage") return "recommended"
    if (entryContext === "search") return "popular"
    if (entryContext === "category") return "rating"
    
    // User segment defaults
    if (userSegment === "student") return "price-low"
    if (userSegment === "business") return "rating"
    
    return "popular"
  }

  // Filter available sort options based on requirements
  const availableSorts = sortConfigurations.filter(sort => {
    if (sort.requiresLocation && !hasLocation) return false
    if (sort.requiresAuth && !isAuthenticated) return false
    return true
  })

  const currentConfig = sortConfigurations.find(s => s.id === currentSort)

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-2", className)}>
        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[200px]">
            {currentConfig && <currentConfig.icon className="h-4 w-4 mr-2" />}
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {availableSorts.map((sort) => {
              const Icon = sort.icon
              return (
                <SelectItem 
                  key={sort.id} 
                  value={sort.id}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="flex items-center gap-1">
                          <span>{sort.label}</span>
                          {sort.beta && (
                            <Badge variant="secondary" className="text-xs h-4">
                              Beta
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{sort.description}</p>
                      </div>
                    </div>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        {currentConfig && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{currentConfig.label}</p>
              <p className="text-xs">{currentConfig.bestFor}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}

// Sorting functions for creators
export const sortCreators = (
  creators: EnhancedCreator[],
  sortOption: SortOption,
  userPreferences?: {
    viewHistory?: string[]
    bookingHistory?: string[]
    favoriteCategories?: string[]
    userLocation?: { lat: number; lng: number }
  }
): EnhancedCreator[] => {
  const sorted = [...creators]

  switch (sortOption) {
    case "recommended":
      // ML-based recommendation (simplified version)
      return sorted.sort((a, b) => {
        let scoreA = 0, scoreB = 0
        
        // Factor in user preferences
        if (userPreferences) {
          // Boost if category matches favorites
          if (userPreferences.favoriteCategories?.includes(a.category)) scoreA += 3
          if (userPreferences.favoriteCategories?.includes(b.category)) scoreB += 3
          
          // Boost if previously viewed
          if (userPreferences.viewHistory?.includes(a.id)) scoreA += 1
          if (userPreferences.viewHistory?.includes(b.id)) scoreB += 1
        }
        
        // Factor in quality signals
        scoreA += a.rating * 2
        scoreB += b.rating * 2
        
        scoreA += Math.min(a.reviewCount / 100, 3)
        scoreB += Math.min(b.reviewCount / 100, 3)
        
        if (a.verified) scoreA += 2
        if (b.verified) scoreB += 2
        
        if (a.trending) scoreA += 3
        if (b.trending) scoreB += 3
        
        if (a.featured) scoreA += 2
        if (b.featured) scoreB += 2
        
        return scoreB - scoreA
      })

    case "popular":
      return sorted.sort((a, b) => {
        // Sort by a combination of reviews and ratings
        const popularityA = a.reviewCount * a.rating
        const popularityB = b.reviewCount * b.rating
        return popularityB - popularityA
      })

    case "price-low":
      return sorted.sort((a, b) => a.price - b.price)

    case "price-high":
      return sorted.sort((a, b) => b.price - a.price)

    case "rating":
      return sorted.sort((a, b) => {
        // Sort by rating, then by review count as tiebreaker
        if (b.rating === a.rating) {
          return b.reviewCount - a.reviewCount
        }
        return b.rating - a.rating
      })

    case "newest":
      // Would use actual join date in production
      return sorted.reverse()

    case "response":
      return sorted.sort((a, b) => {
        const timeToHours = (time: string) => {
          const num = parseInt(time)
          if (time.includes("hour")) return num
          if (time.includes("day")) return num * 24
          if (time.includes("week")) return num * 168
          return num * 24 // default to days
        }
        return timeToHours(a.responseTime) - timeToHours(b.responseTime)
      })

    case "availability":
      return sorted.sort((a, b) => {
        const availabilityOrder = { "available": 0, "busy": 1, "offline": 2 }
        const orderA = availabilityOrder[a.availability || "offline"]
        const orderB = availabilityOrder[b.availability || "offline"]
        return orderA - orderB
      })

    case "distance":
      if (userPreferences?.userLocation) {
        // In production, would calculate actual distances
        return sorted
      }
      return sorted

    case "bookings":
      // Would use actual booking count in production
      return sorted.sort((a, b) => (b.videoCount || 0) - (a.videoCount || 0))

    case "trending":
      return sorted.sort((a, b) => {
        if (a.trending && !b.trending) return -1
        if (!a.trending && b.trending) return 1
        // For trending items, sort by popularity
        return (b.reviewCount * b.rating) - (a.reviewCount * a.rating)
      })

    default:
      return sorted
  }
}

// Hook for smart sorting with persistence
export function useSmartSorting(
  initialSort?: SortOption,
  options?: {
    userSegment?: "student" | "business" | "general"
    entryContext?: "homepage" | "browse" | "category" | "search"
    persistKey?: string
  }
) {
  const getDefaultSort = (): SortOption => {
    const { userSegment = "general", entryContext = "browse" } = options || {}
    
    if (entryContext === "homepage") return "recommended"
    if (entryContext === "search") return "popular"
    if (entryContext === "category") return "rating"
    
    if (userSegment === "student") return "price-low"
    if (userSegment === "business") return "rating"
    
    return "popular"
  }

  const [currentSort, setCurrentSort] = React.useState<SortOption>(
    initialSort || getDefaultSort()
  )

  // Persist sort preference
  React.useEffect(() => {
    if (options?.persistKey) {
      localStorage.setItem(`sort-${options.persistKey}`, currentSort)
    }
  }, [currentSort, options?.persistKey])

  // Load persisted sort on mount
  React.useEffect(() => {
    if (options?.persistKey) {
      const saved = localStorage.getItem(`sort-${options.persistKey}`)
      if (saved) {
        setCurrentSort(saved as SortOption)
      }
    }
  }, [options?.persistKey])

  return {
    currentSort,
    setCurrentSort,
    defaultSort: getDefaultSort()
  }
}