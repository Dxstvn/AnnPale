"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Search,
  Filter,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  Lightbulb,
  Users,
  TrendingUp,
  X,
  Zap,
  Calendar,
  DollarSign,
  Globe,
  Clock,
  Frown,
  Smile,
  Heart,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { FilterState } from "./filter-sidebar"

export type EmptyStateType = 
  | "no-results"
  | "loading-error"
  | "network-offline"
  | "filtered-out"
  | "search-no-match"
  | "initial"
  | "maintenance"

interface EmptyStateProps {
  type: EmptyStateType
  searchTerm?: string
  filters?: FilterState
  totalCount?: number
  filteredCount?: number
  onAction?: () => void
  onClearFilters?: () => void
  onRelaxFilters?: (suggestion: FilterRelaxationSuggestion) => void
  className?: string
}

interface FilterRelaxationSuggestion {
  id: string
  label: string
  description: string
  filterChanges: Partial<FilterState>
  potentialResults: number
  priority: number
}

// Illustrations as simple SVG components
const Illustrations = {
  NoResults: () => (
    <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none">
      <circle cx="64" cy="64" r="60" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="2"/>
      <path d="M40 50 Q64 35 88 50" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" fill="none"/>
      <circle cx="45" cy="45" r="3" className="fill-gray-400"/>
      <circle cx="83" cy="45" r="3" className="fill-gray-400"/>
      <path d="M45 75 Q64 65 83 75" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" fill="none"/>
    </svg>
  ),
  
  NetworkOffline: () => (
    <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none">
      <rect x="30" y="40" width="68" height="48" rx="4" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2"/>
      <path d="M64 55 L64 70 M64 75 L64 77" className="stroke-red-400" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="64" cy="88" r="20" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="2"/>
      <path d="M54 88 L74 88" className="stroke-red-500" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
  
  LoadingError: () => (
    <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none">
      <polygon points="64,20 100,90 28,90" className="stroke-orange-400 dark:stroke-orange-500" strokeWidth="2" fill="none"/>
      <path d="M64 45 L64 65 M64 72 L64 75" className="stroke-orange-500" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
  
  FilteredOut: () => (
    <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none">
      <path d="M30 30 L98 30 L78 60 L78 85 L50 95 L50 60 Z" className="stroke-purple-400 dark:stroke-purple-500" strokeWidth="2" fill="none"/>
      <circle cx="64" cy="60" r="8" className="fill-purple-200 dark:fill-purple-800"/>
      <path d="M45 40 L83 40 M50 50 L78 50" className="stroke-purple-300 dark:stroke-purple-600" strokeWidth="2"/>
    </svg>
  )
}

export function EmptyState({
  type,
  searchTerm,
  filters,
  totalCount = 0,
  filteredCount = 0,
  onAction,
  onClearFilters,
  onRelaxFilters,
  className
}: EmptyStateProps) {
  const [isRetrying, setIsRetrying] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(true)

  const handleRetry = async () => {
    setIsRetrying(true)
    await onAction?.()
    setIsRetrying(false)
  }

  // Generate filter relaxation suggestions
  const getFilterRelaxationSuggestions = (): FilterRelaxationSuggestion[] => {
    if (!filters) return []
    
    const suggestions: FilterRelaxationSuggestion[] = []
    
    // Price range suggestion
    if (filters.priceRange[1] < 500) {
      suggestions.push({
        id: "price-increase",
        label: "Increase price range",
        description: `Try creators up to $${filters.priceRange[1] + 100}`,
        filterChanges: { priceRange: [filters.priceRange[0], filters.priceRange[1] + 100] },
        potentialResults: Math.floor(totalCount * 0.3),
        priority: 1
      })
    }
    
    // Category suggestion
    if (filters.categories.length > 0) {
      suggestions.push({
        id: "remove-category",
        label: "Show all categories",
        description: "Remove category filter to see more options",
        filterChanges: { categories: [] },
        potentialResults: Math.floor(totalCount * 0.5),
        priority: 2
      })
    }
    
    // Language suggestion
    if (filters.languages.length > 0) {
      suggestions.push({
        id: "any-language",
        label: "Any language",
        description: "Remove language requirement",
        filterChanges: { languages: [] },
        potentialResults: Math.floor(totalCount * 0.4),
        priority: 3
      })
    }
    
    // Rating suggestion
    if (filters.rating > 4) {
      suggestions.push({
        id: "lower-rating",
        label: "Lower minimum rating",
        description: `Show creators with ${filters.rating - 0.5}+ stars`,
        filterChanges: { rating: filters.rating - 0.5 },
        potentialResults: Math.floor(totalCount * 0.25),
        priority: 4
      })
    }
    
    // Response time suggestion
    if (filters.responseTime.length > 0) {
      suggestions.push({
        id: "flexible-time",
        label: "Flexible on timing",
        description: "Remove response time filter",
        filterChanges: { responseTime: [] },
        potentialResults: Math.floor(totalCount * 0.2),
        priority: 5
      })
    }
    
    return suggestions.sort((a, b) => a.priority - b.priority)
  }

  const relaxationSuggestions = getFilterRelaxationSuggestions()

  const configs = {
    "no-results": {
      illustration: <Illustrations.NoResults />,
      title: "No creators found",
      description: searchTerm 
        ? `We couldn't find any creators matching "${searchTerm}"`
        : "No creators match your current filters",
      actions: [
        { label: "Clear all filters", onClick: onClearFilters, variant: "default" as const },
        { label: "Browse all creators", onClick: onAction, variant: "outline" as const }
      ]
    },
    "loading-error": {
      illustration: <Illustrations.LoadingError />,
      title: "Having trouble loading",
      description: "We encountered an error while loading creators. This might be temporary.",
      actions: [
        { label: "Try again", onClick: handleRetry, variant: "default" as const, loading: isRetrying },
        { label: "Report issue", onClick: () => toast.error("Issue reported"), variant: "outline" as const }
      ]
    },
    "network-offline": {
      illustration: <Illustrations.NetworkOffline />,
      title: "You're offline",
      description: "Check your internet connection and try again",
      actions: [
        { label: "Retry", onClick: handleRetry, variant: "default" as const, loading: isRetrying }
      ]
    },
    "filtered-out": {
      illustration: <Illustrations.FilteredOut />,
      title: "Your filters are too specific",
      description: `${filteredCount} of ${totalCount} creators filtered out. Try relaxing some filters.`,
      actions: [
        { label: "Reset filters", onClick: onClearFilters, variant: "default" as const },
        { label: "View suggestions", onClick: () => setShowSuggestions(true), variant: "outline" as const }
      ]
    },
    "search-no-match": {
      illustration: <Illustrations.NoResults />,
      title: "No exact matches",
      description: `No creators match "${searchTerm}" exactly, but here are some suggestions`,
      actions: [
        { label: "Clear search", onClick: onClearFilters, variant: "default" as const }
      ]
    },
    "initial": {
      illustration: <Sparkles className="w-16 h-16 text-purple-500" />,
      title: "Start exploring",
      description: "Use filters or search to find your perfect creator",
      actions: [
        { label: "Browse all", onClick: onAction, variant: "default" as const }
      ]
    },
    "maintenance": {
      illustration: <AlertTriangle className="w-16 h-16 text-yellow-500" />,
      title: "Under maintenance",
      description: "We're updating our systems. Please check back in a few minutes.",
      actions: []
    }
  }

  const config = configs[type]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn("py-12", className)}
    >
      {/* Main Empty State */}
      <motion.div variants={item} className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-6">
          {config.illustration}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {config.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          {config.description}
        </p>
        
        {/* Action Buttons */}
        {config.actions.length > 0 && (
          <div className="flex items-center justify-center gap-3">
            {config.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.onClick}
                disabled={action.loading}
                className={cn(
                  action.variant === "default" && 
                  "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                )}
              >
                {action.loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  action.label
                )}
              </Button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Filter Relaxation Suggestions */}
      <AnimatePresence>
        {type === "filtered-out" && showSuggestions && relaxationSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Try adjusting these filters
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSuggestions(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {relaxationSuggestions.slice(0, 3).map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => onRelaxFilters?.(suggestion)}
                    className="w-full p-4 rounded-lg border hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{suggestion.label}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {suggestion.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          +{suggestion.potentialResults} creators
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition" />
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alternative Suggestions */}
      {(type === "no-results" || type === "search-no-match") && (
        <motion.div variants={item} className="mt-12">
          <AlternativeSuggestions
            searchTerm={searchTerm}
            onSearch={(term) => {
              // Handle new search
              console.log("Search for:", term)
            }}
          />
        </motion.div>
      )}

      {/* Network Status Indicator */}
      {type === "network-offline" && (
        <NetworkStatusIndicator />
      )}
    </motion.div>
  )
}

// Alternative suggestions component
function AlternativeSuggestions({
  searchTerm,
  onSearch
}: {
  searchTerm?: string
  onSearch: (term: string) => void
}) {
  const suggestions = [
    { icon: Users, label: "Popular Creators", query: "popular" },
    { icon: TrendingUp, label: "Trending Now", query: "trending" },
    { icon: Heart, label: "Fan Favorites", query: "favorites" },
    { icon: Zap, label: "Fast Response", query: "fast response" }
  ]

  return (
    <div className="text-center space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        You might be interested in
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon
          return (
            <Button
              key={suggestion.query}
              variant="outline"
              onClick={() => onSearch(suggestion.query)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {suggestion.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

// Network status indicator
function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = React.useState(typeof window !== "undefined" ? navigator.onLine : true)
  const [retryIn, setRetryIn] = React.useState(5)

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success("You're back online!")
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      toast.error("Connection lost")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  React.useEffect(() => {
    if (!isOnline && retryIn > 0) {
      const timer = setTimeout(() => setRetryIn(retryIn - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, retryIn])

  return (
    <Alert className="max-w-md mx-auto">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>Connection Status</AlertTitle>
      <AlertDescription>
        {isOnline ? (
          "Connection restored. Refreshing..."
        ) : (
          <>
            You're currently offline. We'll retry automatically in {retryIn} seconds.
            <Progress value={(5 - retryIn) * 20} className="mt-2" />
          </>
        )}
      </AlertDescription>
    </Alert>
  )
}