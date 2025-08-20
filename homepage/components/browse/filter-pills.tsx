"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { FilterState } from "./filter-sidebar"

interface FilterPillsProps {
  filters: FilterState
  onRemoveFilter: (filterType: keyof FilterState, value?: string | number) => void
  onClearAll: () => void
  onOpenFilters?: () => void
  className?: string
}

const categoryLabels: Record<string, string> = {
  musician: "🎵 Musicians",
  singer: "🎤 Singers",
  comedian: "😂 Comedians",
  actor: "🎭 Actors",
  dj: "🎧 DJs",
  "radio-host": "📻 Radio Hosts",
  influencer: "📱 Influencers",
  athlete: "🏆 Athletes",
}

const languageLabels: Record<string, string> = {
  english: "🇺🇸 English",
  french: "🇫🇷 French",
  kreyol: "🇭🇹 Kreyòl",
  spanish: "🇪🇸 Spanish",
}

const responseTimeLabels: Record<string, string> = {
  "24hr": "⚡ 24 hours",
  "2days": "🚀 2 days",
  "3days": "📅 3 days",
  "1week": "📆 1 week",
}

const availabilityLabels: Record<string, string> = {
  all: "All Creators",
  available: "Available Now",
  "this-week": "This Week",
  "this-month": "This Month",
}

export function FilterPills({
  filters,
  onRemoveFilter,
  onClearAll,
  onOpenFilters,
  className
}: FilterPillsProps) {
  const pills: Array<{ type: keyof FilterState; label: string; value?: string | number }> = []

  // Categories
  filters.categories.forEach(category => {
    pills.push({
      type: "categories",
      label: categoryLabels[category] || category,
      value: category
    })
  })

  // Price Range
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
    pills.push({
      type: "priceRange",
      label: `💵 $${filters.priceRange[0]} - $${filters.priceRange[1]}`
    })
  }

  // Response Time
  filters.responseTime.forEach(time => {
    pills.push({
      type: "responseTime",
      label: responseTimeLabels[time] || time,
      value: time
    })
  })

  // Languages
  filters.languages.forEach(language => {
    pills.push({
      type: "languages",
      label: languageLabels[language] || language,
      value: language
    })
  })

  // Rating
  if (filters.rating > 0) {
    pills.push({
      type: "rating",
      label: `⭐ ${filters.rating}+ stars`
    })
  }

  // Availability
  if (filters.availability !== "all") {
    pills.push({
      type: "availability",
      label: `📅 ${availabilityLabels[filters.availability] || filters.availability}`
    })
  }

  // Verified
  if (filters.verified) {
    pills.push({
      type: "verified",
      label: "✓ Verified Only"
    })
  }

  if (pills.length === 0) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenFilters}
        className="md:hidden"
      >
        <Filter className="h-4 w-4 mr-1" />
        Filters
        {pills.length > 0 && (
          <Badge variant="secondary" className="ml-2 h-5 px-1">
            {pills.length}
          </Badge>
        )}
      </Button>

      {/* Filter Pills */}
      <AnimatePresence mode="popLayout">
        {pills.map((pill, index) => (
          <motion.div
            key={`${pill.type}-${pill.value || index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              variant="secondary"
              className="pl-3 pr-1 py-1.5 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition group"
            >
              <span className="text-sm">{pill.label}</span>
              <button
                onClick={() => onRemoveFilter(pill.type, pill.value)}
                className="ml-2 p-0.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition"
                aria-label={`Remove ${pill.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Clear All Button */}
      <AnimatePresence>
        {pills.length > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Clear all
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}