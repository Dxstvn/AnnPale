"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
  X,
  Mic,
  MicOff,
  Camera,
  TrendingUp,
  Clock,
  Loader2,
  Sparkles,
  Filter,
  Globe,
  DollarSign,
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  Volume2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { FilterState } from "./filter-sidebar"

interface SearchSuggestion {
  id: string
  text: string
  type: "query" | "creator" | "category" | "filter"
  icon?: React.ReactNode
  metadata?: any
  score?: number
}

interface NaturalLanguageFilter {
  categories?: string[]
  priceRange?: [number, number]
  languages?: string[]
  availability?: string
  responseTime?: string[]
  verified?: boolean
  rating?: number
}

interface EnhancedSearchProps {
  onSearch: (query: string, filters?: NaturalLanguageFilter) => void
  onFilterUpdate?: (filters: Partial<FilterState>) => void
  creators?: EnhancedCreator[]
  recentSearches?: string[]
  popularSearches?: string[]
  className?: string
}

// Natural language patterns for parsing
const nlPatterns = {
  price: [
    /under \$?(\d+)/i,
    /below \$?(\d+)/i,
    /less than \$?(\d+)/i,
    /cheaper than \$?(\d+)/i,
    /\$?(\d+) or less/i,
    /between \$?(\d+) and \$?(\d+)/i,
    /\$?(\d+)-\$?(\d+)/i
  ],
  category: [
    /(musician|singer|comedian|actor|dj|radio|influencer|athlete)s?/i,
    /(kompa|zouk|rap|gospel) (artist|singer)s?/i
  ],
  language: [
    /(english|french|spanish|kreyol|creole|haitian)( speaking)?/i,
    /speaks? (english|french|spanish|kreyol|creole)/i
  ],
  availability: [
    /(available|free) (today|tomorrow|this week|this weekend|now)/i,
    /(today|tomorrow|this week|weekend)/i
  ],
  response: [
    /(fast|quick|rapid|express) (response|delivery)/i,
    /within (\d+) (hours?|days?)/i,
    /(\d+) (hours?|days?) or less/i
  ],
  verified: [
    /verified/i,
    /authentic/i,
    /official/i
  ],
  rating: [
    /(\d+(\.\d+)?) stars?( or higher)?/i,
    /(top|best|highest) rated/i,
    /highly rated/i
  ]
}

export function EnhancedSearch({
  onSearch,
  onFilterUpdate,
  creators = [],
  recentSearches = [],
  popularSearches = [],
  className
}: EnhancedSearchProps) {
  const [query, setQuery] = React.useState("")
  const [isListening, setIsListening] = React.useState(false)
  const [isProcessingImage, setIsProcessingImage] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [voiceTranscript, setVoiceTranscript] = React.useState("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const debounceRef = React.useRef<NodeJS.Timeout>()
  
  // Parse natural language query
  const parseNaturalLanguage = (text: string): NaturalLanguageFilter => {
    const filters: NaturalLanguageFilter = {}
    
    // Parse price
    for (const pattern of nlPatterns.price) {
      const match = text.match(pattern)
      if (match) {
        if (match[2]) {
          // Range
          filters.priceRange = [parseInt(match[1]), parseInt(match[2])]
        } else {
          // Upper limit
          filters.priceRange = [0, parseInt(match[1])]
        }
        break
      }
    }
    
    // Parse category
    const categoryMatch = text.match(nlPatterns.category[0])
    if (categoryMatch) {
      filters.categories = [categoryMatch[1].toLowerCase()]
    }
    
    // Parse language
    const languageMatch = text.match(nlPatterns.language[0])
    if (languageMatch) {
      filters.languages = [languageMatch[1].toLowerCase()]
    }
    
    // Parse availability
    const availMatch = text.match(nlPatterns.availability[0])
    if (availMatch) {
      filters.availability = "available"
    }
    
    // Parse response time
    const responseMatch = text.match(nlPatterns.response[1])
    if (responseMatch) {
      const num = parseInt(responseMatch[1])
      const unit = responseMatch[2]
      if (unit.includes("hour")) {
        filters.responseTime = ["24hr"]
      } else if (unit.includes("day") && num <= 2) {
        filters.responseTime = ["2days"]
      }
    }
    
    // Parse verified
    if (nlPatterns.verified.some(pattern => pattern.test(text))) {
      filters.verified = true
    }
    
    // Parse rating
    const ratingMatch = text.match(nlPatterns.rating[0])
    if (ratingMatch) {
      filters.rating = parseFloat(ratingMatch[1])
    } else if (/top|best|highest/i.test(text)) {
      filters.rating = 4.5
    }
    
    return filters
  }
  
  // Generate suggestions based on input
  const generateSuggestions = React.useCallback((input: string) => {
    const suggestions: SearchSuggestion[] = []
    const lowerInput = input.toLowerCase()
    
    // Add matching creators
    creators
      .filter(c => c.name.toLowerCase().includes(lowerInput))
      .slice(0, 3)
      .forEach(creator => {
        suggestions.push({
          id: creator.id,
          text: creator.name,
          type: "creator",
          icon: <CheckCircle className="h-4 w-4 text-blue-500" />,
          metadata: creator,
          score: 1
        })
      })
    
    // Add category suggestions
    const categories = ["Musicians", "Comedians", "Singers", "DJs", "Athletes"]
    categories
      .filter(cat => cat.toLowerCase().includes(lowerInput))
      .forEach(category => {
        suggestions.push({
          id: `cat-${category}`,
          text: category,
          type: "category",
          icon: <Filter className="h-4 w-4 text-purple-500" />,
          score: 0.8
        })
      })
    
    // Add natural language suggestions
    if (input.length > 3) {
      const nlFilters = parseNaturalLanguage(input)
      if (Object.keys(nlFilters).length > 0) {
        suggestions.push({
          id: "nl-filter",
          text: `Apply filters: ${Object.keys(nlFilters).join(", ")}`,
          type: "filter",
          icon: <Sparkles className="h-4 w-4 text-yellow-500" />,
          metadata: nlFilters,
          score: 0.9
        })
      }
    }
    
    // Add spell corrections
    const corrections = getSpellCorrections(input)
    corrections.forEach((correction, index) => {
      suggestions.push({
        id: `spell-${index}`,
        text: correction,
        type: "query",
        icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
        score: 0.7
      })
    })
    
    // Sort by score
    suggestions.sort((a, b) => (b.score || 0) - (a.score || 0))
    
    return suggestions
  }, [creators])
  
  // Simple spell correction
  const getSpellCorrections = (input: string): string[] => {
    const corrections: string[] = []
    const commonMisspellings: Record<string, string> = {
      "musision": "musician",
      "comidian": "comedian",
      "birtday": "birthday",
      "aniversary": "anniversary",
      "congradulations": "congratulations",
      "weding": "wedding"
    }
    
    const lower = input.toLowerCase()
    for (const [wrong, right] of Object.entries(commonMisspellings)) {
      if (lower.includes(wrong)) {
        corrections.push(input.replace(new RegExp(wrong, "gi"), right))
      }
    }
    
    return corrections
  }
  
  // Handle input change with debouncing
  const handleInputChange = (value: string) => {
    setQuery(value)
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      if (value.length > 0) {
        const newSuggestions = generateSuggestions(value)
        setSuggestions(newSuggestions)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)
  }
  
  // Handle search execution
  const executeSearch = (searchQuery?: string, suggestion?: SearchSuggestion) => {
    const finalQuery = searchQuery || query
    
    if (suggestion?.type === "filter" && suggestion.metadata) {
      // Apply natural language filters
      const filters = suggestion.metadata as NaturalLanguageFilter
      onFilterUpdate?.({
        categories: filters.categories || [],
        priceRange: filters.priceRange || [0, 500],
        languages: filters.languages || [],
        rating: filters.rating || 0,
        availability: filters.availability || "all",
        responseTime: filters.responseTime || [],
        verified: filters.verified || false
      })
      onSearch(finalQuery, filters)
      toast.success("Filters applied from your search")
    } else {
      // Regular search
      const nlFilters = parseNaturalLanguage(finalQuery)
      onSearch(finalQuery, nlFilters)
    }
    
    setShowSuggestions(false)
  }
  
  // Voice search implementation
  const startVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Voice search is not supported in your browser")
      return
    }
    
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"
    
    recognition.onstart = () => {
      setIsListening(true)
      setVoiceTranscript("")
    }
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join("")
      
      setVoiceTranscript(transcript)
      setQuery(transcript)
    }
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
      toast.error("Could not understand speech. Please try again.")
    }
    
    recognition.onend = () => {
      setIsListening(false)
      if (voiceTranscript) {
        executeSearch(voiceTranscript)
      }
    }
    
    recognition.start()
  }
  
  // Visual search implementation
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setIsProcessingImage(true)
    
    // Simulate image processing (in production, would call an API)
    setTimeout(() => {
      // Mock: find similar creators based on image
      const mockResults = [
        "Musicians with similar style",
        "Creators with matching aesthetic",
        "Similar video backgrounds"
      ]
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setQuery(randomResult)
      executeSearch(randomResult)
      setIsProcessingImage(false)
      toast.success("Found similar creators based on your image")
    }, 2000)
  }
  
  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-400 pointer-events-none" />
          
          <Input
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                executeSearch()
              }
            }}
            placeholder="Search creators, 'musicians under $100', 'Spanish speaking comedians'..."
            className="pl-12 pr-32 h-12 rounded-full text-base"
          />
          
          {/* Action Buttons */}
          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setQuery("")
                  setSuggestions([])
                }}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {/* Voice Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={startVoiceSearch}
              className={cn(
                "h-8 w-8",
                isListening && "text-red-500"
              )}
            >
              {isListening ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Mic className="h-4 w-4" />
                </motion.div>
              ) : (
                <MicOff className="h-4 w-4" />
              )}
            </Button>
            
            {/* Visual Search */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingImage}
              className="h-8 w-8"
            >
              {isProcessingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
            
            {/* Search Button */}
            <Button
              onClick={() => executeSearch()}
              className="h-8 px-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Search
            </Button>
          </div>
        </div>
        
        {/* Voice Transcript Display */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-2 left-0 right-0 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-sm">
                {voiceTranscript || "Listening..."}
              </span>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border overflow-hidden z-50"
          >
            <div className="p-2 space-y-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => executeSearch(suggestion.text, suggestion)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
                >
                  {suggestion.icon}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{suggestion.text}</p>
                    {suggestion.type === "creator" && suggestion.metadata && (
                      <p className="text-xs text-gray-500">
                        {suggestion.metadata.category} • ${suggestion.metadata.price}
                      </p>
                    )}
                  </div>
                  {suggestion.type === "filter" && (
                    <Badge variant="secondary" className="text-xs">
                      Smart Filter
                    </Badge>
                  )}
                </button>
              ))}
            </div>
            
            {/* Search Tips */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t">
              <p className="text-xs text-gray-500">
                💡 Try: "Comedians under $50", "French speaking musicians", "Available this weekend"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Popular & Recent Searches */}
      {!showSuggestions && !query && (popularSearches.length > 0 || recentSearches.length > 0) && (
        <Card className="absolute top-full mt-2 left-0 right-0 z-40">
          <CardContent className="p-4 space-y-4">
            {popularSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <Badge
                      key={search}
                      variant="secondary"
                      className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30"
                      onClick={() => {
                        setQuery(search)
                        executeSearch(search)
                      }}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Recent</span>
                </div>
                <div className="space-y-1">
                  {recentSearches.slice(0, 3).map((search) => (
                    <button
                      key={search}
                      onClick={() => {
                        setQuery(search)
                        executeSearch(search)
                      }}
                      className="w-full text-left text-sm p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}