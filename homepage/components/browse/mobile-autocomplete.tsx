"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { 
  Search,
  TrendingUp, 
  Clock,
  User,
  Tag,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface AutocompleteSuggestion {
  id: string
  text: string
  type: "query" | "creator" | "category" | "location" | "filter"
  icon?: React.ReactNode
  metadata?: string
  popularity?: number
  action?: string
}

interface MobileAutocompleteProps {
  query: string
  suggestions?: AutocompleteSuggestion[]
  onSelect: (suggestion: AutocompleteSuggestion) => void
  loading?: boolean
  className?: string
}

// Common search shortcuts
const commonShortcuts = [
  { text: "birthday", icon: "🎂" },
  { text: "wedding", icon: "💒" },
  { text: "anniversary", icon: "💑" },
  { text: "graduation", icon: "🎓" },
  { text: "congratulations", icon: "🎉" },
  { text: "motivation", icon: "💪" },
  { text: "comedy", icon: "😂" },
  { text: "music", icon: "🎵" }
]

// Quick input assists
const quickAssists = [
  { prefix: "under $", suffix: "50", icon: DollarSign },
  { prefix: "near ", suffix: "me", icon: MapPin },
  { prefix: "available ", suffix: "today", icon: Calendar },
  { prefix: "speaks ", suffix: "kreyol", icon: "🇭🇹" }
]

export function MobileAutocomplete({
  query,
  suggestions = [],
  onSelect,
  loading = false,
  className
}: MobileAutocompleteProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [recentQueries, setRecentQueries] = React.useState<string[]>([])

  // Load recent queries
  React.useEffect(() => {
    const stored = localStorage.getItem('recentQueries')
    if (stored) {
      setRecentQueries(JSON.parse(stored))
    }
  }, [])

  // Generate smart suggestions based on query
  const smartSuggestions = React.useMemo(() => {
    if (!query) return []
    
    const lowercaseQuery = query.toLowerCase()
    const suggestions: AutocompleteSuggestion[] = []

    // Category matching
    const categories = ["musicians", "comedians", "athletes", "influencers", "djs", "actors"]
    categories.forEach(category => {
      if (category.startsWith(lowercaseQuery)) {
        suggestions.push({
          id: `cat-${category}`,
          text: category,
          type: "category",
          icon: <Tag className="h-4 w-4" />,
          metadata: "Category"
        })
      }
    })

    // Price suggestions
    if (lowercaseQuery.includes("under") || lowercaseQuery.includes("cheap") || lowercaseQuery.includes("budget")) {
      suggestions.push(
        {
          id: "price-50",
          text: "Under $50",
          type: "filter",
          icon: <DollarSign className="h-4 w-4" />,
          metadata: "Price filter"
        },
        {
          id: "price-100",
          text: "Under $100",
          type: "filter",
          icon: <DollarSign className="h-4 w-4" />,
          metadata: "Price filter"
        }
      )
    }

    // Availability suggestions
    if (lowercaseQuery.includes("available") || lowercaseQuery.includes("today") || lowercaseQuery.includes("now")) {
      suggestions.push(
        {
          id: "avail-today",
          text: "Available today",
          type: "filter",
          icon: <Calendar className="h-4 w-4" />,
          metadata: "Availability"
        },
        {
          id: "avail-week",
          text: "Available this week",
          type: "filter",
          icon: <Calendar className="h-4 w-4" />,
          metadata: "Availability"
        }
      )
    }

    // Location suggestions
    if (lowercaseQuery.includes("near") || lowercaseQuery.includes("local")) {
      suggestions.push({
        id: "loc-near",
        text: "Near me",
        type: "location",
        icon: <MapPin className="h-4 w-4" />,
        metadata: "Location"
      })
    }

    // Language suggestions
    if (lowercaseQuery.includes("speak") || lowercaseQuery.includes("language")) {
      suggestions.push(
        {
          id: "lang-kreyol",
          text: "Speaks Kreyòl",
          type: "filter",
          icon: "🇭🇹",
          metadata: "Language"
        },
        {
          id: "lang-french",
          text: "Speaks French",
          type: "filter",
          icon: "🇫🇷",
          metadata: "Language"
        }
      )
    }

    return suggestions
  }, [query])

  // Combine all suggestions
  const allSuggestions = React.useMemo(() => {
    const combined = [...suggestions, ...smartSuggestions]
    
    // Remove duplicates
    const seen = new Set()
    return combined.filter(s => {
      if (seen.has(s.text)) return false
      seen.add(s.text)
      return true
    })
  }, [suggestions, smartSuggestions])

  // Get display suggestions
  const displaySuggestions = React.useMemo(() => {
    if (query) {
      return allSuggestions.slice(0, 8)
    }
    
    // Show recent queries when no query
    return recentQueries.slice(0, 5).map(q => ({
      id: `recent-${q}`,
      text: q,
      type: "query" as const,
      icon: <Clock className="h-4 w-4" />,
      metadata: "Recent"
    }))
  }, [query, allSuggestions, recentQueries])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (displaySuggestions.length === 0) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < displaySuggestions.length - 1 ? prev + 1 : 0
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : displaySuggestions.length - 1
          )
          break
        case "Enter":
          if (selectedIndex >= 0 && selectedIndex < displaySuggestions.length) {
            e.preventDefault()
            onSelect(displaySuggestions[selectedIndex])
          }
          break
        case "Escape":
          setSelectedIndex(-1)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [displaySuggestions, selectedIndex, onSelect])

  // Get icon for suggestion type
  const getIcon = (suggestion: AutocompleteSuggestion) => {
    if (suggestion.icon) return suggestion.icon
    
    switch (suggestion.type) {
      case "creator":
        return <User className="h-4 w-4" />
      case "category":
        return <Tag className="h-4 w-4" />
      case "location":
        return <MapPin className="h-4 w-4" />
      case "filter":
        return <Sparkles className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  if (!query && displaySuggestions.length === 0) {
    // Show shortcuts when empty
    return (
      <div className={cn("p-4", className)}>
        <div className="text-sm text-gray-500 mb-3">Quick searches</div>
        <div className="grid grid-cols-4 gap-2">
          {commonShortcuts.map((shortcut) => (
            <button
              key={shortcut.text}
              onClick={() => onSelect({
                id: `shortcut-${shortcut.text}`,
                text: shortcut.text,
                type: "query"
              })}
              className="flex flex-col items-center gap-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl touch-manipulation active:scale-95 transition"
            >
              <span className="text-2xl">{shortcut.icon}</span>
              <span className="text-xs capitalize">{shortcut.text}</span>
            </button>
          ))}
        </div>

        {/* Quick assists */}
        <div className="mt-6">
          <div className="text-sm text-gray-500 mb-3">Try searching for</div>
          <div className="space-y-2">
            {quickAssists.map((assist) => (
              <button
                key={assist.prefix}
                onClick={() => onSelect({
                  id: `assist-${assist.prefix}`,
                  text: `${assist.prefix}${assist.suffix}`,
                  type: "query"
                })}
                className="w-full flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg touch-manipulation active:scale-[0.98] transition"
              >
                {typeof assist.icon === "string" ? (
                  <span className="text-lg">{assist.icon}</span>
                ) : (
                  <assist.icon className="h-4 w-4" />
                )}
                <span className="text-sm">
                  <span className="opacity-70">{assist.prefix}</span>
                  <span className="font-medium">{assist.suffix}</span>
                </span>
                <ArrowUpRight className="h-3 w-3 ml-auto opacity-50" />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn("p-2", className)}
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Search className="h-4 w-4" />
              </motion.div>
              Searching...
            </div>
          </div>
        ) : displaySuggestions.length > 0 ? (
          <div className="space-y-1">
            {displaySuggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => onSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition touch-manipulation active:scale-[0.98]",
                  selectedIndex === index
                    ? "bg-purple-50 dark:bg-purple-900/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                <div className="flex-shrink-0 text-gray-400">
                  {getIcon(suggestion)}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{suggestion.text}</span>
                    {suggestion.popularity && suggestion.popularity > 80 && (
                      <TrendingUp className="h-3 w-3 text-orange-500" />
                    )}
                  </div>
                  {suggestion.metadata && (
                    <span className="text-xs text-gray-500">{suggestion.metadata}</span>
                  )}
                </div>
                {suggestion.type === "filter" && (
                  <Badge variant="secondary" className="text-xs">
                    Filter
                  </Badge>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">
            No suggestions found for "{query}"
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}