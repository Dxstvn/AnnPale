"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Clock,
  Search,
  X,
  TrendingUp,
  Filter,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { RecentSearch } from "@/hooks/use-filter-persistence"
import { formatDistanceToNow } from "date-fns"

interface RecentSearchesProps {
  searches: RecentSearch[]
  onSelectSearch: (search: RecentSearch) => void
  onClearAll: () => void
  onRemoveSearch?: (searchId: string) => void
  className?: string
  variant?: "inline" | "dropdown" | "sidebar"
}

export function RecentSearches({
  searches,
  onSelectSearch,
  onClearAll,
  onRemoveSearch,
  className,
  variant = "inline"
}: RecentSearchesProps) {
  if (searches.length === 0) {
    return null
  }

  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return "Recently"
    }
  }

  const getFilterCount = (search: RecentSearch) => {
    let count = 0
    const { filters } = search
    
    if (filters.categories.length > 0) count += filters.categories.length
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++
    if (filters.responseTime.length > 0) count += filters.responseTime.length
    if (filters.languages.length > 0) count += filters.languages.length
    if (filters.rating > 0) count++
    if (filters.availability !== "all") count++
    if (filters.verified) count++
    
    return count
  }

  if (variant === "sidebar") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Searches
          </h3>
          {searches.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-7 text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          )}
        </div>

        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {searches.map((search) => (
              <motion.div
                key={search.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="group cursor-pointer hover:shadow-md transition-all p-3"
                  onClick={() => onSelectSearch(search)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Search className="h-3 w-3 text-gray-400" />
                        <p className="text-sm font-medium truncate">
                          {search.query || "Filtered browse"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatTimeAgo(search.timestamp)}</span>
                        {getFilterCount(search) > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Filter className="h-3 w-3" />
                              {getFilterCount(search)} filters
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>{search.resultCount} results</span>
                      </div>
                    </div>
                    {onRemoveSearch && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveSearch(search.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        <X className="h-3 w-3 text-gray-400" />
                      </button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  if (variant === "dropdown") {
    return (
      <div className={cn("p-4 space-y-3", className)}>
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Recent Searches
          </span>
          <button
            onClick={onClearAll}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Clear
          </button>
        </div>
        <div className="space-y-1">
          {searches.slice(0, 5).map((search) => (
            <button
              key={search.id}
              onClick={() => onSelectSearch(search)}
              className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
            >
              <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">
                  {search.query || "Filtered browse"}
                </p>
                <p className="text-xs text-gray-500">
                  {search.resultCount} results • {formatTimeAgo(search.timestamp)}
                </p>
              </div>
              {getFilterCount(search) > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getFilterCount(search)}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Inline variant (default)
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Recent:
      </span>
      <AnimatePresence mode="popLayout">
        {searches.slice(0, 3).map((search) => (
          <motion.div
            key={search.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
              onClick={() => onSelectSearch(search)}
            >
              <Clock className="h-3 w-3 mr-1" />
              {search.query || `${getFilterCount(search)} filters`}
              <span className="ml-2 text-xs opacity-70">
                {search.resultCount}
              </span>
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
      {searches.length > 3 && (
        <span className="text-xs text-gray-500">
          +{searches.length - 3} more
        </span>
      )}
    </div>
  )
}