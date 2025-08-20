"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  RefreshCw,
  ChevronRight,
  Lightbulb
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { FilterState } from "./filter-sidebar"

interface NoResultsProps {
  searchTerm?: string
  filters: FilterState
  suggestions?: Array<{
    text: string
    action: () => FilterState
  }>
  trendingSearches?: string[]
  popularCategories?: Array<{
    id: string
    name: string
    count: number
    emoji: string
  }>
  onClearFilters: () => void
  onApplySuggestion: (filters: FilterState) => void
  onSearch: (term: string) => void
  onSelectCategory: (categoryId: string) => void
  className?: string
}

export function NoResults({
  searchTerm,
  filters,
  suggestions = [],
  trendingSearches = [],
  popularCategories = [],
  onClearFilters,
  onApplySuggestion,
  onSearch,
  onSelectCategory,
  className
}: NoResultsProps) {
  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500 ||
    filters.responseTime.length > 0 ||
    filters.languages.length > 0 ||
    filters.rating > 0 ||
    filters.availability !== "all" ||
    filters.verified ||
    searchTerm

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
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No creators found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          {searchTerm 
            ? `We couldn't find any creators matching "${searchTerm}"`
            : "No creators match your current filters"}
        </p>
      </motion.div>

      {/* Quick Actions */}
      {hasActiveFilters && (
        <motion.div variants={item} className="flex justify-center gap-3 mb-8">
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Clear all filters
          </Button>
          {searchTerm && (
            <Button
              onClick={() => onSearch("")}
              variant="outline"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear search
            </Button>
          )}
        </motion.div>
      )}

      {/* Filter Suggestions */}
      {suggestions.length > 0 && (
        <motion.div variants={item} className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <h4 className="font-medium">Try adjusting your filters</h4>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onApplySuggestion(suggestion.action())}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left group"
                  >
                    <span className="text-sm">{suggestion.text}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Popular Categories */}
      {popularCategories.length > 0 && (
        <motion.div variants={item} className="mb-8">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
            Browse popular categories
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {popularCategories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition px-3 py-1.5"
                onClick={() => onSelectCategory(category.id)}
              >
                <span className="mr-1">{category.emoji}</span>
                {category.name}
                <span className="ml-2 text-xs opacity-70">
                  {category.count}
                </span>
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Trending Searches */}
      {trendingSearches.length > 0 && (
        <motion.div variants={item}>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending searches
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {trendingSearches.map((term) => (
              <button
                key={term}
                onClick={() => onSearch(term)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition text-sm font-medium"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Alternative Actions */}
      <motion.div variants={item} className="mt-12 text-center">
        <div className="inline-flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Can't find who you're looking for?
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              We're adding new creators every day. Check back soon!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}