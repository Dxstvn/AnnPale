"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Search,
  TrendingUp,
  Clock,
  Sparkles,
  Filter,
  Wand2,
  User,
  Users,
  Target,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Zap,
  Globe,
  Calendar,
  Star,
  DollarSign,
  Music,
  Laugh,
  Film,
  Mic2,
  Camera,
  Trophy,
  Hash,
  Slash,
  Lightbulb,
  RotateCcw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { SearchQuery } from "./search-intent-engine"

// Enhanced suggestion types according to Phase 2.2.2 specifications
export type SuggestionType = 
  | "instant_match"    // First letter - indexed creators
  | "recent_searches"  // Focus empty - user history  
  | "trending"         // Focus empty - analytics
  | "categories"       // Partial match - taxonomy
  | "predictive"       // 2+ characters - ML model
  | "commands"         // "/" prefix - system

export interface AutocompleteSuggestion {
  id: string
  text: string
  type: SuggestionType
  displayText?: string
  highlightedText?: string
  icon?: React.ReactNode
  metadata?: {
    creator?: EnhancedCreator
    category?: string
    popularity?: number
    recentUse?: number
    confidence?: number
    source?: string
  }
  score: number
  action?: string
  shortcut?: string
}

export interface AutocompleteCache {
  [key: string]: {
    suggestions: AutocompleteSuggestion[]
    timestamp: number
    expiresAt: number
  }
}

export interface TypoCorrection {
  original: string
  corrected: string
  confidence: number
  source: "dictionary" | "ml" | "common_mistakes"
}

export interface SynonymExpansion {
  term: string
  synonyms: string[]
  context: string
  boost: number
}

interface IntelligentAutocompleteProps {
  onSearch: (query: string) => void
  onSuggestionSelect?: (suggestion: AutocompleteSuggestion) => void
  creators?: EnhancedCreator[]
  recentSearches?: string[]
  enablePredictive?: boolean
  enableTypoCorrection?: boolean
  enableSynonymExpansion?: boolean
  locale?: "en-US" | "fr-FR" | "ht-HT"
  className?: string
}

// Sample data sources for autocomplete
const INDEXED_CREATORS = [
  { id: "wyclef", name: "Wyclef Jean", category: "Musician", popularity: 95 },
  { id: "tijozenny", name: "Ti Jo Zenny", category: "Comedian", popularity: 88 },
  { id: "rutshelle", name: "Rutshelle Guillaume", category: "Singer", popularity: 90 },
  { id: "richard", name: "Richard Cave", category: "Singer", popularity: 85 },
  { id: "michael", name: "Michael Brun", category: "DJ", popularity: 82 },
  { id: "bamby", name: "Bamby", category: "Singer", popularity: 78 },
  { id: "roody", name: "Roody Roodboy", category: "Singer", popularity: 75 },
  { id: "carimi", name: "Carimi", category: "Band", popularity: 92 }
]

const TRENDING_SEARCHES = [
  { query: "birthday message", count: 342, trend: 15.2 },
  { query: "Haitian comedians", count: 298, trend: 8.7 },
  { query: "musicians under $100", count: 267, trend: 12.3 },
  { query: "kompa artists", count: 234, trend: 22.1 },
  { query: "wedding songs", count: 198, trend: 6.4 }
]

const CATEGORIES_TAXONOMY = [
  { id: "musicians", name: "Musicians", icon: <Music className="h-4 w-4" />, count: 156 },
  { id: "comedians", name: "Comedians", icon: <Laugh className="h-4 w-4" />, count: 89 },
  { id: "singers", name: "Singers", icon: <Mic2 className="h-4 w-4" />, count: 134 },
  { id: "actors", name: "Actors", icon: <Film className="h-4 w-4" />, count: 67 },
  { id: "djs", name: "DJs", icon: <Users className="h-4 w-4" />, count: 45 },
  { id: "athletes", name: "Athletes", icon: <Trophy className="h-4 w-4" />, count: 23 }
]

const SYSTEM_COMMANDS = [
  { command: "/browse", description: "Browse all creators", icon: <Users className="h-4 w-4" /> },
  { command: "/trending", description: "Show trending creators", icon: <TrendingUp className="h-4 w-4" /> },
  { command: "/categories", description: "View categories", icon: <Filter className="h-4 w-4" /> },
  { command: "/help", description: "Get help", icon: <Lightbulb className="h-4 w-4" /> },
  { command: "/clear", description: "Clear search", icon: <RotateCcw className="h-4 w-4" /> }
]

// Common typos and corrections for Haitian creator names and terms
const TYPO_CORRECTIONS: Record<string, string> = {
  "msicians": "musicians",
  "comidian": "comedian",
  "comidians": "comedians",
  "wycliff": "wyclef",
  "wyeclef": "wyclef",
  "ti joe": "ti jo",
  "tijo": "ti jo",
  "rutshel": "rutshelle",
  "richard cave": "richard cave",
  "michael burn": "michael brun",
  "brun": "brun",
  "kompia": "kompa",
  "kompha": "kompa",
  "zouke": "zouk",
  "creol": "creole",
  "haiten": "haitian",
  "hayitian": "haitian",
  "birtday": "birthday",
  "aniversary": "anniversary",
  "weding": "wedding"
}

// Synonym expansion for search terms
const SYNONYM_EXPANSIONS: Record<string, SynonymExpansion> = {
  "funny": {
    term: "funny",
    synonyms: ["comedy", "humor", "hilarious", "comedian", "jokes"],
    context: "comedy_search",
    boost: 1.2
  },
  "music": {
    term: "music",
    synonyms: ["songs", "musical", "musician", "artist", "singer"],
    context: "music_search", 
    boost: 1.1
  },
  "party": {
    term: "party",
    synonyms: ["celebration", "event", "birthday", "anniversary", "wedding"],
    context: "event_search",
    boost: 1.3
  },
  "cheap": {
    term: "cheap",
    synonyms: ["affordable", "budget", "inexpensive", "under $50"],
    context: "price_search",
    boost: 1.0
  },
  "best": {
    term: "best",
    synonyms: ["top", "popular", "highly rated", "recommended", "featured"],
    context: "quality_search",
    boost: 1.4
  }
}

// Locale-specific term adaptations
const LOCALE_ADAPTATIONS: Record<string, Record<string, string>> = {
  "en-US": {
    "futbol": "soccer",
    "football": "american football"
  },
  "fr-FR": {
    "soccer": "football",
    "comedian": "comédien"
  },
  "ht-HT": {
    "soccer": "futbol",
    "music": "mizik",
    "comedian": "komèdyen"
  }
}

export function IntelligentAutocomplete({
  onSearch,
  onSuggestionSelect,
  creators = [],
  recentSearches = [],
  enablePredictive = true,
  enableTypoCorrection = true,
  enableSynonymExpansion = true,
  locale = "en-US",
  className
}: IntelligentAutocompleteProps) {
  const [query, setQuery] = React.useState("")
  const [suggestions, setSuggestions] = React.useState<AutocompleteSuggestion[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [cache, setCache] = React.useState<AutocompleteCache>({})
  const [prefetchedResults, setPrefetchedResults] = React.useState<Record<string, any>>({})
  
  const debounceRef = React.useRef<NodeJS.Timeout>()
  const inputRef = React.useRef<HTMLInputElement>(null)
  
  // Constants from Phase 2.2.2 specifications
  const KEYSTROKE_DELAY = 150 // ms
  const MIN_CHARACTERS = 2
  const MAX_SUGGESTIONS = 8
  const MAX_TOTAL_SUGGESTIONS = 20
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // Generate instant match suggestions (first letter)
  const generateInstantMatches = React.useCallback((input: string): AutocompleteSuggestion[] => {
    if (input.length < 1) return []
    
    const matches = INDEXED_CREATORS
      .filter(creator => creator.name.toLowerCase().startsWith(input.toLowerCase()))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4)
      .map(creator => ({
        id: `instant_${creator.id}`,
        text: creator.name,
        type: "instant_match" as SuggestionType,
        displayText: creator.name,
        highlightedText: highlightMatch(creator.name, input),
        icon: <User className="h-4 w-4 text-blue-500" />,
        metadata: { creator, popularity: creator.popularity },
        score: 100 + creator.popularity,
        action: `Search for ${creator.name}`
      }))
    
    return matches
  }, [])

  // Generate recent searches suggestions
  const generateRecentSearches = React.useCallback((): AutocompleteSuggestion[] => {
    return recentSearches.slice(0, 3).map((search, index) => ({
      id: `recent_${index}`,
      text: search,
      type: "recent_searches" as SuggestionType,
      displayText: search,
      icon: <Clock className="h-4 w-4 text-gray-500" />,
      metadata: { recentUse: Date.now() - (index * 60000) },
      score: 90 - index * 5,
      action: `Search again: "${search}"`
    }))
  }, [recentSearches])

  // Generate trending suggestions
  const generateTrendingSuggestions = React.useCallback((): AutocompleteSuggestion[] => {
    return TRENDING_SEARCHES.slice(0, 3).map((trending, index) => ({
      id: `trending_${index}`,
      text: trending.query,
      type: "trending" as SuggestionType,
      displayText: trending.query,
      icon: <TrendingUp className="h-4 w-4 text-purple-500" />,
      metadata: { popularity: trending.count, source: "analytics" },
      score: 80 + trending.trend,
      action: `Join ${trending.count} others searching "${trending.query}"`
    }))
  }, [])

  // Generate category suggestions
  const generateCategorySuggestions = React.useCallback((input: string): AutocompleteSuggestion[] => {
    if (input.length < 2) return []
    
    const matches = CATEGORIES_TAXONOMY
      .filter(category => 
        category.name.toLowerCase().includes(input.toLowerCase()) ||
        category.id.toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, 3)
      .map(category => ({
        id: `category_${category.id}`,
        text: category.name,
        type: "categories" as SuggestionType,
        displayText: category.name,
        highlightedText: highlightMatch(category.name, input),
        icon: category.icon,
        metadata: { category: category.name, count: category.count },
        score: 70 + category.count / 10,
        action: `Browse ${category.name} (${category.count})`
      }))
    
    return matches
  }, [])

  // Generate predictive suggestions using ML model simulation
  const generatePredictiveSuggestions = React.useCallback(async (input: string): Promise<AutocompleteSuggestion[]> => {
    if (!enablePredictive || input.length < 2) return []
    
    // Simulate ML prediction delay
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const predictiveTerms = [
      { term: `${input} for birthday`, confidence: 0.85, context: "event" },
      { term: `best ${input}`, confidence: 0.78, context: "quality" },
      { term: `${input} under $100`, confidence: 0.72, context: "price" },
      { term: `Haitian ${input}`, confidence: 0.68, context: "cultural" }
    ].filter(pred => pred.term !== input)
    
    return predictiveTerms.slice(0, 2).map((pred, index) => ({
      id: `predictive_${index}`,
      text: pred.term,
      type: "predictive" as SuggestionType,
      displayText: pred.term,
      icon: <Wand2 className="h-4 w-4 text-purple-500" />,
      metadata: { confidence: pred.confidence, source: "ml_model" },
      score: 60 + (pred.confidence * 30),
      action: `AI suggests: "${pred.term}"`
    }))
  }, [enablePredictive])

  // Generate system command suggestions
  const generateCommandSuggestions = React.useCallback((input: string): AutocompleteSuggestion[] => {
    if (!input.startsWith("/")) return []
    
    const command = input.slice(1).toLowerCase()
    const matches = SYSTEM_COMMANDS
      .filter(cmd => cmd.command.toLowerCase().includes(command))
      .slice(0, 3)
      .map(cmd => ({
        id: `command_${cmd.command}`,
        text: cmd.command,
        type: "commands" as SuggestionType,
        displayText: `${cmd.command} - ${cmd.description}`,
        icon: cmd.icon,
        metadata: { source: "system" },
        score: 95,
        action: cmd.description,
        shortcut: cmd.command
      }))
    
    return matches
  }, [])

  // Apply typo correction
  const applyTypoCorrection = React.useCallback((input: string): TypoCorrection | null => {
    if (!enableTypoCorrection) return null
    
    const lowercaseInput = input.toLowerCase()
    const correction = TYPO_CORRECTIONS[lowercaseInput]
    
    if (correction) {
      return {
        original: input,
        corrected: correction,
        confidence: 0.9,
        source: "dictionary"
      }
    }
    
    // Check for partial matches (simple Levenshtein distance simulation)
    for (const [typo, correct] of Object.entries(TYPO_CORRECTIONS)) {
      if (levenshteinDistance(lowercaseInput, typo) <= 2 && lowercaseInput.length > 3) {
        return {
          original: input,
          corrected: correct,
          confidence: 0.7,
          source: "common_mistakes"
        }
      }
    }
    
    return null
  }, [enableTypoCorrection])

  // Apply synonym expansion
  const applySynonymExpansion = React.useCallback((input: string): string[] => {
    if (!enableSynonymExpansion) return []
    
    const words = input.toLowerCase().split(' ')
    const expandedTerms: string[] = []
    
    words.forEach(word => {
      const expansion = SYNONYM_EXPANSIONS[word]
      if (expansion) {
        expandedTerms.push(...expansion.synonyms)
      }
    })
    
    return Array.from(new Set(expandedTerms))
  }, [enableSynonymExpansion])

  // Apply locale adaptations
  const applyLocaleAdaptations = React.useCallback((input: string): string => {
    const adaptations = LOCALE_ADAPTATIONS[locale]
    if (!adaptations) return input
    
    let adapted = input
    Object.entries(adaptations).forEach(([original, replacement]) => {
      adapted = adapted.replace(new RegExp(original, 'gi'), replacement)
    })
    
    return adapted
  }, [locale])

  // Generate all suggestions with proper priority ordering
  const generateAllSuggestions = React.useCallback(async (input: string, isEmpty: boolean): Promise<AutocompleteSuggestion[]> => {
    const allSuggestions: AutocompleteSuggestion[] = []
    
    // Check cache first
    const cacheKey = `${input}_${isEmpty}`
    const cached = cache[cacheKey]
    if (cached && Date.now() < cached.expiresAt) {
      return cached.suggestions
    }
    
    try {
      // Phase 2.2.2 priority order:
      
      // 1. Commands (if applicable)
      if (input.startsWith("/")) {
        allSuggestions.push(...generateCommandSuggestions(input))
      }
      
      // 2. Recent searches (if empty focus)
      if (isEmpty) {
        allSuggestions.push(...generateRecentSearches())
      }
      
      // 3. Trending (if empty focus)
      if (isEmpty) {
        allSuggestions.push(...generateTrendingSuggestions())
      }
      
      // 4. Instant matches (first letter)
      if (!isEmpty && !input.startsWith("/")) {
        allSuggestions.push(...generateInstantMatches(input))
      }
      
      // 5. Categories (partial match)
      if (!isEmpty && !input.startsWith("/")) {
        allSuggestions.push(...generateCategorySuggestions(input))
      }
      
      // 6. Predictive (2+ characters)
      if (!isEmpty && input.length >= MIN_CHARACTERS && !input.startsWith("/")) {
        const predictive = await generatePredictiveSuggestions(input)
        allSuggestions.push(...predictive)
      }
      
      // Apply typo correction
      const typoCorrection = applyTypoCorrection(input)
      if (typoCorrection) {
        allSuggestions.unshift({
          id: "typo_correction",
          text: typoCorrection.corrected,
          type: "instant_match",
          displayText: `Did you mean "${typoCorrection.corrected}"?`,
          icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
          metadata: { confidence: typoCorrection.confidence, source: typoCorrection.source },
          score: 110,
          action: `Correct to "${typoCorrection.corrected}"`
        })
      }
      
      // Apply synonym expansion suggestions
      if (!isEmpty && input.length >= MIN_CHARACTERS) {
        const synonyms = applySynonymExpansion(input)
        synonyms.slice(0, 2).forEach((synonym, index) => {
          allSuggestions.push({
            id: `synonym_${index}`,
            text: synonym,
            type: "predictive",
            displayText: `Also try: "${synonym}"`,
            icon: <Sparkles className="h-4 w-4 text-green-500" />,
            metadata: { source: "synonym_expansion" },
            score: 65 - index * 5,
            action: `Search related term: "${synonym}"`
          })
        })
      }
      
      // Sort by score and limit results
      const sortedSuggestions = allSuggestions
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_TOTAL_SUGGESTIONS)
      
      // Cache results
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          suggestions: sortedSuggestions,
          timestamp: Date.now(),
          expiresAt: Date.now() + CACHE_DURATION
        }
      }))
      
      return sortedSuggestions
      
    } catch (error) {
      console.error("Error generating suggestions:", error)
      return []
    }
  }, [cache, generateInstantMatches, generateRecentSearches, generateTrendingSuggestions, generateCategorySuggestions, generatePredictiveSuggestions, generateCommandSuggestions, applyTypoCorrection, applySynonymExpansion])

  // Handle input change with debouncing
  const handleInputChange = React.useCallback((value: string) => {
    setQuery(value)
    setSelectedIndex(-1)
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    // Apply locale adaptations
    const adaptedValue = applyLocaleAdaptations(value)
    if (adaptedValue !== value) {
      setQuery(adaptedValue)
      value = adaptedValue
    }
    
    setIsLoading(true)
    
    // Debounce with Phase 2.2.2 specified delay
    debounceRef.current = setTimeout(async () => {
      const isEmpty = !value.trim()
      const newSuggestions = await generateAllSuggestions(value, isEmpty)
      setSuggestions(newSuggestions.slice(0, MAX_SUGGESTIONS))
      setIsLoading(false)
      setIsOpen(newSuggestions.length > 0 || isEmpty)
    }, KEYSTROKE_DELAY)
  }, [generateAllSuggestions, applyLocaleAdaptations])

  // Prefetch top 3 results as specified in Phase 2.2.2
  React.useEffect(() => {
    if (suggestions.length >= 3) {
      const topSuggestions = suggestions.slice(0, 3)
      topSuggestions.forEach(suggestion => {
        if (!prefetchedResults[suggestion.text]) {
          // Simulate prefetching result data
          setPrefetchedResults(prev => ({
            ...prev,
            [suggestion.text]: { prefetched: true, timestamp: Date.now() }
          }))
        }
      })
    }
  }, [suggestions, prefetchedResults])

  // Handle suggestion selection
  const handleSuggestionSelect = React.useCallback((suggestion: AutocompleteSuggestion) => {
    setQuery(suggestion.text)
    setIsOpen(false)
    onSuggestionSelect?.(suggestion)
    
    // Handle system commands
    if (suggestion.type === "commands") {
      if (suggestion.shortcut === "/clear") {
        setQuery("")
        return
      }
      // Other command handling would go here
    }
    
    onSearch(suggestion.text)
  }, [onSearch, onSuggestionSelect])

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % suggestions.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1)
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedIndex])
        } else {
          onSearch(query)
          setIsOpen(false)
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        break
      case "Tab":
        if (selectedIndex >= 0) {
          e.preventDefault()
          setQuery(suggestions[selectedIndex].text)
        }
        break
    }
  }, [isOpen, suggestions, selectedIndex, handleSuggestionSelect, onSearch, query])

  // Utility function to highlight matching text
  function highlightMatch(text: string, match: string): string {
    if (!match) return text
    const regex = new RegExp(`(${match})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  // Simple Levenshtein distance for typo detection
  function levenshteinDistance(a: string, b: string): number {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null))
    
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        )
      }
    }
    
    return matrix[b.length][a.length]
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (query.trim() === "") {
                  handleInputChange("")
                } else {
                  setIsOpen(suggestions.length > 0)
                }
              }}
              placeholder="Search creators, try '/help' for commands..."
              className="pl-10 pr-4 h-12 text-base"
            />
            
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              </div>
            )}
          </div>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Command className="rounded-lg border shadow-md">
            <CommandList>
              {suggestions.length === 0 && !isLoading && (
                <CommandEmpty>
                  {query.trim() ? "No suggestions found" : "Start typing to see suggestions"}
                </CommandEmpty>
              )}
              
              <ScrollArea className="max-h-80">
                <AnimatePresence mode="popLayout">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                    >
                      <CommandItem
                        value={suggestion.text}
                        onSelect={() => handleSuggestionSelect(suggestion)}
                        className={cn(
                          "flex items-center gap-3 p-3 cursor-pointer",
                          selectedIndex === index && "bg-accent"
                        )}
                      >
                        <div className="flex-shrink-0">
                          {suggestion.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span 
                              className="font-medium truncate"
                              dangerouslySetInnerHTML={{ 
                                __html: suggestion.highlightedText || suggestion.displayText || suggestion.text 
                              }}
                            />
                            {suggestion.type === "instant_match" && (
                              <Badge variant="secondary" className="text-xs ml-2">
                                Exact
                              </Badge>
                            )}
                            {suggestion.type === "predictive" && (
                              <Badge variant="outline" className="text-xs ml-2">
                                AI
                              </Badge>
                            )}
                            {suggestion.type === "trending" && (
                              <Badge variant="default" className="text-xs ml-2">
                                Hot
                              </Badge>
                            )}
                          </div>
                          
                          {suggestion.action && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {suggestion.action}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0 flex items-center gap-1">
                          {prefetchedResults[suggestion.text] && (
                            <Zap className="h-3 w-3 text-green-500" title="Prefetched" />
                          )}
                          {suggestion.shortcut && (
                            <kbd className="px-1 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                              {suggestion.shortcut}
                            </kbd>
                          )}
                        </div>
                      </CommandItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
              
              {suggestions.length > 0 && (
                <>
                  <CommandSeparator />
                  <div className="p-3 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Use ↑ ↓ to navigate • Enter to select • Tab to complete</span>
                      <span>{suggestions.length} of {MAX_TOTAL_SUGGESTIONS}</span>
                    </div>
                  </div>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Hook for using intelligent autocomplete with analytics
export function useIntelligentAutocomplete() {
  const [autocompleteAnalytics, setAutocompleteAnalytics] = React.useState({
    totalSuggestions: 0,
    suggestionSelections: 0,
    typoCorrections: 0,
    cacheHitRate: 0,
    averageResponseTime: 0
  })

  const trackSuggestionUsage = React.useCallback((suggestion: AutocompleteSuggestion) => {
    setAutocompleteAnalytics(prev => ({
      ...prev,
      suggestionSelections: prev.suggestionSelections + 1,
      typoCorrections: suggestion.metadata?.source === "typo_correction" 
        ? prev.typoCorrections + 1 
        : prev.typoCorrections
    }))
  }, [])

  return {
    autocompleteAnalytics,
    trackSuggestionUsage
  }
}

export default IntelligentAutocomplete
