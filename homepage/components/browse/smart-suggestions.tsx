"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Lightbulb,
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  Calendar,
  ChevronRight,
  Search,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { FilterState } from "./filter-sidebar"

interface SmartSuggestion {
  id: string
  type: "spell-check" | "expand" | "alternative" | "category" | "filter-adjust"
  title: string
  description: string
  icon: React.ElementType
  action: () => void
  confidence?: number // 0-100
  priority?: number // For sorting
}

interface SmartSuggestionsProps {
  searchQuery?: string
  currentFilters: FilterState
  totalCreators: number
  onApplySuggestion: (suggestion: SmartSuggestion) => void
  className?: string
}

// Levenshtein distance for spell checking
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
      }
    }
  }

  return dp[m][n]
}

// Common misspellings database
const commonMisspellings: Record<string, string[]> = {
  "birthday": ["birthdy", "bithday", "birtday", "brithday"],
  "wedding": ["weding", "weddin", "weddign"],
  "anniversary": ["aniversary", "anniversery", "anniverary"],
  "comedian": ["comedien", "commedian", "comidian"],
  "musician": ["musicien", "musican", "musisian"],
  "congratulations": ["congradulations", "congratualations", "congrats"],
  "graduation": ["gradutation", "graduaton", "gradution"]
}

// Known categories and their related terms
const categoryRelations: Record<string, string[]> = {
  "Musicians": ["singers", "artists", "bands", "rappers", "djs"],
  "Comedians": ["funny", "humor", "jokes", "stand-up", "comedy"],
  "Athletes": ["sports", "players", "fitness", "trainers", "coaches"],
  "Influencers": ["social media", "content creators", "bloggers", "youtubers"],
  "Actors": ["movies", "films", "drama", "theater", "entertainment"],
  "Chefs": ["cooking", "food", "recipes", "culinary", "restaurant"]
}

export function SmartSuggestions({
  searchQuery = "",
  currentFilters,
  totalCreators,
  onApplySuggestion,
  className
}: SmartSuggestionsProps) {
  // Generate smart suggestions based on context
  const suggestions = React.useMemo(() => {
    const suggestions: SmartSuggestion[] = []
    const query = searchQuery.toLowerCase().trim()

    // 1. Spell check suggestions
    if (query) {
      for (const [correct, misspellings] of Object.entries(commonMisspellings)) {
        for (const misspelling of misspellings) {
          if (levenshteinDistance(query, misspelling) <= 2) {
            suggestions.push({
              id: `spell-${correct}`,
              type: "spell-check",
              title: `Did you mean "${correct}"?`,
              description: "Common spelling correction",
              icon: Lightbulb,
              action: () => console.log(`Search for: ${correct}`),
              confidence: 90,
              priority: 1
            })
            break
          }
        }
      }
    }

    // 2. Category expansion suggestions
    if (query) {
      for (const [category, related] of Object.entries(categoryRelations)) {
        if (related.some(term => query.includes(term))) {
          suggestions.push({
            id: `category-${category}`,
            type: "category",
            title: `Browse all ${category}`,
            description: `See all creators in the ${category} category`,
            icon: Users,
            action: () => console.log(`Filter by category: ${category}`),
            confidence: 80,
            priority: 2
          })
        }
      }
    }

    // 3. Filter adjustment suggestions
    const activeFilterCount = [
      currentFilters.categories.length,
      currentFilters.languages.length,
      currentFilters.responseTime.length,
      currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 500 ? 1 : 0,
      currentFilters.rating > 0 ? 1 : 0,
      currentFilters.verified ? 1 : 0
    ].reduce((a, b) => a + b, 0)

    if (activeFilterCount > 2) {
      suggestions.push({
        id: "reduce-filters",
        type: "filter-adjust",
        title: "Try fewer filters",
        description: `You have ${activeFilterCount} active filters. Removing some might show more results.`,
        icon: Filter,
        action: () => console.log("Reduce filters"),
        confidence: 85,
        priority: 3
      })
    }

    // 4. Price range expansion
    if (currentFilters.priceRange[1] < 100) {
      suggestions.push({
        id: "expand-price",
        type: "filter-adjust",
        title: "Expand price range",
        description: `Try increasing your budget to $${currentFilters.priceRange[1] + 50}`,
        icon: DollarSign,
        action: () => console.log("Expand price range"),
        confidence: 75,
        priority: 4
      })
    }

    // 5. Language expansion
    if (currentFilters.languages.length === 1) {
      suggestions.push({
        id: "add-languages",
        type: "filter-adjust",
        title: "Add more languages",
        description: "Many creators speak multiple languages",
        icon: Globe,
        action: () => console.log("Add languages"),
        confidence: 70,
        priority: 5
      })
    }

    // 6. Alternative search terms
    if (query) {
      const alternatives: Record<string, string[]> = {
        "birthday": ["anniversary", "celebration", "special day"],
        "wedding": ["marriage", "engagement", "proposal"],
        "motivation": ["inspiration", "encouragement", "support"],
        "funny": ["comedy", "humor", "entertainment"]
      }

      for (const [term, alts] of Object.entries(alternatives)) {
        if (query.includes(term)) {
          suggestions.push({
            id: `alt-${alts[0]}`,
            type: "alternative",
            title: `Try searching for "${alts[0]}"`,
            description: "Related search term",
            icon: Search,
            action: () => console.log(`Search for: ${alts[0]}`),
            confidence: 65,
            priority: 6
          })
        }
      }
    }

    // 7. Time-based suggestions
    const now = new Date()
    const hour = now.getHours()
    
    if (hour >= 6 && hour < 12) {
      suggestions.push({
        id: "morning-creators",
        type: "alternative",
        title: "Morning motivation creators",
        description: "Perfect for starting your day",
        icon: Sparkles,
        action: () => console.log("Morning creators"),
        confidence: 60,
        priority: 7
      })
    } else if (hour >= 18 && hour < 23) {
      suggestions.push({
        id: "evening-entertainment",
        type: "alternative",
        title: "Evening entertainment",
        description: "Comedians and entertainers",
        icon: Sparkles,
        action: () => console.log("Evening creators"),
        confidence: 60,
        priority: 7
      })
    }

    // Sort by priority and confidence
    return suggestions.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority
      return (b.confidence || 0) - (a.confidence || 0)
    })
  }, [searchQuery, currentFilters])

  if (suggestions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-4", className)}
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h3 className="font-medium">Smart suggestions</h3>
      </div>

      <div className="grid gap-3">
        {suggestions.slice(0, 5).map((suggestion) => {
          const Icon = suggestion.icon
          
          return (
            <Card
              key={suggestion.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onApplySuggestion(suggestion)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    suggestion.type === "spell-check" && "bg-blue-100 dark:bg-blue-900/30",
                    suggestion.type === "category" && "bg-purple-100 dark:bg-purple-900/30",
                    suggestion.type === "filter-adjust" && "bg-orange-100 dark:bg-orange-900/30",
                    suggestion.type === "alternative" && "bg-green-100 dark:bg-green-900/30",
                    suggestion.type === "expand" && "bg-pink-100 dark:bg-pink-900/30"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      suggestion.type === "spell-check" && "text-blue-600 dark:text-blue-400",
                      suggestion.type === "category" && "text-purple-600 dark:text-purple-400",
                      suggestion.type === "filter-adjust" && "text-orange-600 dark:text-orange-400",
                      suggestion.type === "alternative" && "text-green-600 dark:text-green-400",
                      suggestion.type === "expand" && "text-pink-600 dark:text-pink-400"
                    )} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{suggestion.title}</p>
                      {suggestion.confidence && suggestion.confidence >= 80 && (
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                  
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {suggestions.length > 5 && (
        <Button variant="ghost" className="w-full" size="sm">
          Show {suggestions.length - 5} more suggestions
        </Button>
      )}
    </motion.div>
  )
}