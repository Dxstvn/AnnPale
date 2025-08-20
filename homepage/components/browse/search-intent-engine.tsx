"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Brain,
  Search,
  Target,
  TrendingUp,
  Users,
  ShoppingCart,
  HelpCircle,
  Compass,
  Zap,
  Globe,
  Clock,
  DollarSign,
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Filter,
  BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { FilterState } from "./filter-sidebar"

// Search Pattern Types from Phase 2.2.1
export type SearchPattern = 
  | "known_item"      // Find specific creator
  | "exploratory"     // Browse category  
  | "descriptive"     // Find by attributes
  | "navigational"    // Go to page
  | "transactional"   // Book service
  | "informational"   // Learn about

export type SearchIntent = "high" | "medium" | "low" | "discovery"

export type SearchLanguage = "english" | "french" | "kreyol" | "mixed" | "unknown"

export interface SearchQuery {
  original: string
  cleaned: string
  tokens: string[]
  length: number
  language: SearchLanguage
  pattern: SearchPattern
  intent: SearchIntent
  confidence: number
  extractedEntities: {
    creators?: string[]
    categories?: string[]
    priceRange?: [number, number]
    urgencyMarkers?: string[]
    dates?: string[]
    locations?: string[]
    languages?: string[]
    qualifiers?: string[]
  }
  suggestedFilters: Partial<FilterState>
  responseStrategy: ResponseStrategy
}

export interface ResponseStrategy {
  type: "direct_match" | "curated_list" | "filtered_results" | "suggestions" | "help_content" | "discovery"
  priority: "immediate" | "high" | "normal" | "low"
  components: Array<{
    component: string
    weight: number
    params: Record<string, any>
  }>
  fallbackStrategy?: ResponseStrategy
}

interface SearchIntentEngineProps {
  onIntentDetected?: (query: SearchQuery) => void
  onResponseStrategy?: (strategy: ResponseStrategy) => void
  enableLearning?: boolean
  debugMode?: boolean
  className?: string
}

// Intent Classification Patterns
const SEARCH_PATTERNS = {
  known_item: [
    // Direct creator names
    /^[A-Z][a-z]+ [A-Z][a-z]+$/,
    /^@\w+$/,
    // Specific artist mentions
    /(wyclef|ti jo|richard cave|michael brun|rutshelle)/i,
    // Quoted exact matches
    /"[^"]+"/
  ],
  
  exploratory: [
    // Category browsing
    /^(musicians?|singers?|comedians?|actors?|djs?|athletes?)$/i,
    /^(kompa|zouk|rap|gospel|pop) (artists?|musicians?|singers?)$/i,
    /(browse|explore|show me) (all|some)?/i,
    /what (kind of|types of)/i
  ],
  
  descriptive: [
    // Attribute-based searches
    /(funny|best|top|famous|popular|talented)/i,
    /\b(haitian|creole|french|bilingual)\b.*\b(comedian|musician|singer)\b/i,
    /(young|old|new|experienced|professional)/i,
    /\b\d+\s*(year|yr)s?\s*(old|experience)\b/i
  ],
  
  navigational: [
    // Page navigation
    /^(dashboard|profile|settings|help|about|contact)$/i,
    /^(my|user) (account|profile|dashboard|bookings?)$/i,
    /(go to|navigate to|take me to)/i,
    /^(home|homepage|main page)$/i
  ],
  
  transactional: [
    // Booking/purchase intent
    /(book|hire|order|buy|purchase|get)/i,
    /\$\d+/,
    /(birthday|anniversary|wedding|graduation) (message|video|greeting)/i,
    /(urgent|asap|today|tomorrow|this week)/i,
    /(cheap|affordable|budget|expensive|premium)/i
  ],
  
  informational: [
    // Learning/help queries
    /(how (to|do|does)|what is|why|when|where)/i,
    /(help|support|guide|tutorial|faq)/i,
    /(explain|tell me about|what are)/i,
    /(cost|price|pricing|rates|fees)/i
  ]
}

// Intent Level Indicators
const INTENT_MARKERS = {
  high: [
    // Strong purchase intent
    /\$([\d,]+)/,
    /(book now|hire now|order now|buy now)/i,
    /(today|tomorrow|this week|urgent|asap)/i,
    /(birthday|anniversary|wedding|special occasion)/i,
    /(need|want|looking for|searching for) .*(today|tomorrow|asap)/i
  ],
  
  medium: [
    // Qualified interest
    /(best|top|good|recommended)/i,
    /(category|type) \+ (qualifier)/,
    /(around|about|approximately) \$\d+/i,
    /(experienced|professional|talented)/i
  ],
  
  low: [
    // General browsing
    /^(musicians?|singers?|comedians?)$/i,
    /^[a-z]{1,3}$/i,
    /(just looking|browsing|exploring)/i
  ],
  
  discovery: [
    // Exploration mode
    /(show me|browse|explore|discover)/i,
    /(what's|whats) (new|popular|trending)/i,
    /(surprise me|random|anything)/i,
    /(featured|spotlight|recommended)/i
  ]
}

// Language Detection Patterns
const LANGUAGE_PATTERNS = {
  kreyol: [
    /(kominikè|pwodiktè|atistè|kompa|zouk)/i,
    /(chantè|komèdyen|aktyè)/i,
    /(nan|ak|pou|sou|nan)/i
  ],
  french: [
    /(musicien|chanteur|comédien|acteur)/i,
    /(pour|avec|dans|sur|de la|du|des)/i,
    /(français|francophone|québécois)/i
  ],
  english: [
    /(the|and|or|for|with|in|on|at)/i,
    /(musician|singer|comedian|actor|artist)/i
  ]
}

export function SearchIntentEngine({
  onIntentDetected,
  onResponseStrategy,
  enableLearning = true,
  debugMode = false,
  className
}: SearchIntentEngineProps) {
  const [lastQuery, setLastQuery] = React.useState<SearchQuery | null>(null)
  const [queryHistory, setQueryHistory] = React.useState<SearchQuery[]>([])
  const [learningData, setLearningData] = React.useState<Record<string, number>>({})
  
  // Main search analysis function
  const analyzeSearch = React.useCallback((query: string): SearchQuery => {
    const cleaned = query.trim().toLowerCase()
    const tokens = cleaned.split(/\s+/).filter(token => token.length > 0)
    const length = tokens.length
    
    // Detect language
    const language = detectLanguage(cleaned)
    
    // Classify pattern
    const pattern = classifyPattern(cleaned, tokens)
    
    // Determine intent level
    const intent = determineIntent(cleaned, pattern, length)
    
    // Extract entities
    const entities = extractEntities(cleaned, tokens)
    
    // Generate suggested filters
    const suggestedFilters = generateSuggestedFilters(entities, pattern, intent)
    
    // Determine response strategy
    const responseStrategy = generateResponseStrategy(pattern, intent, entities)
    
    // Calculate confidence based on pattern matches and entity extraction
    const confidence = calculateConfidence(pattern, entities, length)
    
    const searchQuery: SearchQuery = {
      original: query,
      cleaned,
      tokens,
      length,
      language,
      pattern,
      intent,
      confidence,
      extractedEntities: entities,
      suggestedFilters,
      responseStrategy
    }
    
    return searchQuery
  }, [])
  
  // Language detection
  const detectLanguage = (query: string): SearchLanguage => {
    let scores = { kreyol: 0, french: 0, english: 0 }
    
    Object.entries(LANGUAGE_PATTERNS).forEach(([lang, patterns]) => {
      patterns.forEach(pattern => {
        if (pattern.test(query)) {
          scores[lang as keyof typeof scores]++
        }
      })
    })
    
    const maxScore = Math.max(...Object.values(scores))
    if (maxScore === 0) return "unknown"
    if (maxScore === scores.kreyol + scores.french + scores.english) return "mixed"
    
    return Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0] as SearchLanguage
  }
  
  // Pattern classification
  const classifyPattern = (query: string, tokens: string[]): SearchPattern => {
    const patterns = Object.entries(SEARCH_PATTERNS)
    
    for (const [pattern, regexList] of patterns) {
      for (const regex of regexList) {
        if (regex.test(query)) {
          return pattern as SearchPattern
        }
      }
    }
    
    // Fallback logic based on query structure
    if (tokens.length === 1) return "exploratory"
    if (tokens.length === 2 && /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(query)) return "known_item"
    if (tokens.length > 4) return "descriptive"
    
    return "exploratory"
  }
  
  // Intent determination
  const determineIntent = (query: string, pattern: SearchPattern, length: number): SearchIntent => {
    // Check high intent markers first
    for (const marker of INTENT_MARKERS.high) {
      if (marker.test(query)) return "high"
    }
    
    // Check for discovery intent
    for (const marker of INTENT_MARKERS.discovery) {
      if (marker.test(query)) return "discovery"
    }
    
    // Check medium intent
    for (const marker of INTENT_MARKERS.medium) {
      if (marker.test(query)) return "medium"
    }
    
    // Check low intent
    for (const marker of INTENT_MARKERS.low) {
      if (marker.test(query)) return "low"
    }
    
    // Pattern-based intent
    switch (pattern) {
      case "transactional":
        return "high"
      case "known_item":
        return length > 2 ? "high" : "medium"
      case "descriptive":
        return "medium"
      case "navigational":
        return "low"
      case "informational":
        return "low"
      default:
        return "discovery"
    }
  }
  
  // Entity extraction
  const extractEntities = (query: string, tokens: string[]) => {
    const entities: SearchQuery["extractedEntities"] = {}
    
    // Extract price ranges
    const priceMatch = query.match(/\$?(\d+)(?:\s*-\s*\$?(\d+))?/)
    if (priceMatch) {
      if (priceMatch[2]) {
        entities.priceRange = [parseInt(priceMatch[1]), parseInt(priceMatch[2])]
      } else {
        entities.priceRange = [0, parseInt(priceMatch[1])]
      }
    }
    
    // Extract categories
    const categoryPatterns = /(musician|singer|comedian|actor|dj|radio|influencer|athlete)s?/gi
    const categoryMatches = query.match(categoryPatterns)
    if (categoryMatches) {
      entities.categories = [...new Set(categoryMatches.map(m => m.toLowerCase().replace(/s$/, '')))]
    }
    
    // Extract urgency markers
    const urgencyPattern = /(today|tomorrow|asap|urgent|this week|this weekend|now)/gi
    const urgencyMatches = query.match(urgencyPattern)
    if (urgencyMatches) {
      entities.urgencyMarkers = urgencyMatches
    }
    
    // Extract qualifiers
    const qualifierPattern = /(best|top|good|popular|famous|talented|experienced|professional|young|funny)/gi
    const qualifierMatches = query.match(qualifierPattern)
    if (qualifierMatches) {
      entities.qualifiers = qualifierMatches
    }
    
    // Extract languages
    const langPattern = /(english|french|kreyol|creole|haitian|bilingual)/gi
    const langMatches = query.match(langPattern)
    if (langMatches) {
      entities.languages = langMatches
    }
    
    return entities
  }
  
  // Generate suggested filters
  const generateSuggestedFilters = (
    entities: SearchQuery["extractedEntities"],
    pattern: SearchPattern,
    intent: SearchIntent
  ): Partial<FilterState> => {
    const filters: Partial<FilterState> = {}
    
    if (entities.categories) {
      filters.categories = entities.categories
    }
    
    if (entities.priceRange) {
      filters.priceRange = entities.priceRange
    }
    
    if (entities.languages) {
      filters.languages = entities.languages
    }
    
    if (entities.urgencyMarkers) {
      if (entities.urgencyMarkers.some(m => ["today", "asap", "urgent"].includes(m.toLowerCase()))) {
        filters.responseTime = ["24hr"]
      }
    }
    
    if (entities.qualifiers?.includes("best") || entities.qualifiers?.includes("top")) {
      filters.rating = 4.5
    }
    
    if (intent === "high") {
      filters.availability = "available"
    }
    
    return filters
  }
  
  // Generate response strategy
  const generateResponseStrategy = (
    pattern: SearchPattern,
    intent: SearchIntent,
    entities: SearchQuery["extractedEntities"]
  ): ResponseStrategy => {
    switch (pattern) {
      case "known_item":
        return {
          type: "direct_match",
          priority: "immediate",
          components: [
            { component: "CreatorProfile", weight: 0.8, params: { exact: true } },
            { component: "SimilarCreators", weight: 0.2, params: { limit: 3 } }
          ]
        }
      
      case "transactional":
        return {
          type: "filtered_results",
          priority: intent === "high" ? "immediate" : "high",
          components: [
            { component: "BookingReadyResults", weight: 0.7, params: { sortBy: "availability" } },
            { component: "QuickBookingFlow", weight: 0.3, params: { prefill: true } }
          ]
        }
      
      case "exploratory":
        return {
          type: "curated_list",
          priority: "normal",
          components: [
            { component: "CategoryResults", weight: 0.6, params: { showFilters: true } },
            { component: "FeaturedCreators", weight: 0.4, params: { category: entities.categories?.[0] } }
          ]
        }
      
      case "descriptive":
        return {
          type: "filtered_results",
          priority: intent === "high" ? "high" : "normal",
          components: [
            { component: "SmartFilteredResults", weight: 0.8, params: { useNLP: true } },
            { component: "RelatedSuggestions", weight: 0.2, params: {} }
          ]
        }
      
      case "navigational":
        return {
          type: "direct_match",
          priority: "immediate",
          components: [
            { component: "NavigationRedirect", weight: 1.0, params: { showBreadcrumb: true } }
          ]
        }
      
      case "informational":
        return {
          type: "help_content",
          priority: "normal",
          components: [
            { component: "HelpContent", weight: 0.7, params: { contextual: true } },
            { component: "RelatedFAQ", weight: 0.3, params: {} }
          ]
        }
      
      default:
        return {
          type: "discovery",
          priority: "normal",
          components: [
            { component: "TrendingCreators", weight: 0.4, params: {} },
            { component: "PersonalizedSuggestions", weight: 0.3, params: {} },
            { component: "CategoryShowcase", weight: 0.3, params: {} }
          ]
        }
    }
  }
  
  // Calculate confidence score
  const calculateConfidence = (
    pattern: SearchPattern,
    entities: SearchQuery["extractedEntities"],
    length: number
  ): number => {
    let confidence = 0.5 // Base confidence
    
    // Pattern confidence boost
    const patternConfidence = {
      known_item: 0.9,
      transactional: 0.8,
      navigational: 0.95,
      descriptive: 0.7,
      exploratory: 0.6,
      informational: 0.7
    }
    confidence = Math.max(confidence, patternConfidence[pattern])
    
    // Entity extraction boost
    const entityCount = Object.values(entities).filter(v => v && v.length > 0).length
    confidence += entityCount * 0.1
    
    // Query length factor
    if (length === 1) confidence -= 0.2
    if (length > 5) confidence += 0.1
    
    return Math.min(0.95, Math.max(0.1, confidence))
  }
  
  // Process search query
  const processSearch = React.useCallback((query: string) => {
    if (!query.trim()) return
    
    const analysis = analyzeSearch(query)
    setLastQuery(analysis)
    
    // Update history
    setQueryHistory(prev => [analysis, ...prev.slice(0, 9)])
    
    // Learning mechanism
    if (enableLearning) {
      setLearningData(prev => ({
        ...prev,
        [analysis.pattern]: (prev[analysis.pattern] || 0) + 1,
        [`${analysis.pattern}_${analysis.intent}`]: (prev[`${analysis.pattern}_${analysis.intent}`] || 0) + 1
      }))
    }
    
    // Notify parent components
    onIntentDetected?.(analysis)
    onResponseStrategy?.(analysis.responseStrategy)
  }, [analyzeSearch, enableLearning, onIntentDetected, onResponseStrategy])
  
  // Get pattern icon
  const getPatternIcon = (pattern: SearchPattern) => {
    const icons = {
      known_item: Target,
      exploratory: Compass,
      descriptive: Search,
      navigational: Compass,
      transactional: ShoppingCart,
      informational: HelpCircle
    }
    return icons[pattern]
  }
  
  // Get intent color
  const getIntentColor = (intent: SearchIntent) => {
    const colors = {
      high: "text-red-600 bg-red-100 dark:bg-red-900/30",
      medium: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30", 
      low: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
      discovery: "text-purple-600 bg-purple-100 dark:bg-purple-900/30"
    }
    return colors[intent]
  }
  
  if (!debugMode && !lastQuery) return null
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Debug Mode Interface */}
      {debugMode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Search Intent Engine
              <Badge variant="outline" className="text-xs">Debug Mode</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Test Search Query:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter search query to analyze..."
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        processSearch(e.currentTarget.value)
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector('input[type="text"]') as HTMLInputElement
                      if (input?.value) processSearch(input.value)
                    }}
                  >
                    Analyze
                  </Button>
                </div>
              </div>
              
              {/* Quick test queries */}
              <div>
                <p className="text-sm font-medium mb-2">Quick Tests:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Wyclef Jean",
                    "funny Haitian comedian",
                    "musicians under $100",
                    "book birthday message",
                    "how it works",
                    "browse singers"
                  ].map(query => (
                    <Badge
                      key={query}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => processSearch(query)}
                    >
                      {query}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Last Query Analysis */}
      {lastQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Search Analysis</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", getIntentColor(lastQuery.intent))}>
                    {lastQuery.intent} intent
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {(lastQuery.confidence * 100).toFixed(0)}% confidence
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Query breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Query Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original:</span>
                      <span className="font-mono">"{lastQuery.original}"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Language:</span>
                      <Badge variant="outline" className="text-xs">
                        {lastQuery.language}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pattern:</span>
                      <div className="flex items-center gap-1">
                        {React.createElement(getPatternIcon(lastQuery.pattern), { className: "h-3 w-3" })}
                        <span>{lastQuery.pattern.replace("_", " ")}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tokens:</span>
                      <span>{lastQuery.tokens.length}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Extracted Entities</h4>
                  <div className="space-y-1">
                    {Object.entries(lastQuery.extractedEntities).map(([key, value]) => (
                      value && value.length > 0 && (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(value) ? value.map((item, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {typeof item === "string" ? item : JSON.stringify(item)}
                              </Badge>
                            )) : (
                              <Badge variant="secondary" className="text-xs">
                                {typeof value === "string" ? value : JSON.stringify(value)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Response Strategy */}
              <div>
                <h4 className="font-medium text-sm mb-2">Response Strategy</h4>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {lastQuery.responseStrategy.type.replace("_", " ")}
                    </span>
                    <Badge variant={
                      lastQuery.responseStrategy.priority === "immediate" ? "default" :
                      lastQuery.responseStrategy.priority === "high" ? "secondary" : "outline"
                    } className="text-xs">
                      {lastQuery.responseStrategy.priority}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {lastQuery.responseStrategy.components.map((comp, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span>{comp.component}</span>
                        <span className="text-gray-500">{(comp.weight * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Query History */}
      {debugMode && queryHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {queryHistory.slice(0, 5).map((query, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                  <span className="font-mono">"{query.original}"</span>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", getIntentColor(query.intent))}>
                      {query.intent}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {query.pattern.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Learning Statistics */}
      {debugMode && enableLearning && Object.keys(learningData).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(learningData).map(([key, count]) => (
                <div key={key} className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-xs">{key.replace("_", " ")}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Hook for using search intent analysis
export function useSearchIntent() {
  const [currentIntent, setCurrentIntent] = React.useState<SearchQuery | null>(null)
  const [intentHistory, setIntentHistory] = React.useState<SearchQuery[]>([])
  
  const analyzeSearchIntent = React.useCallback((query: string): SearchQuery => {
    // This would normally use the SearchIntentEngine
    // For now, return a basic analysis
    return {
      original: query,
      cleaned: query.toLowerCase(),
      tokens: query.toLowerCase().split(" "),
      length: query.split(" ").length,
      language: "english",
      pattern: "exploratory",
      intent: "medium",
      confidence: 0.7,
      extractedEntities: {},
      suggestedFilters: {},
      responseStrategy: {
        type: "curated_list",
        priority: "normal",
        components: []
      }
    }
  }, [])
  
  return {
    currentIntent,
    intentHistory,
    analyzeSearchIntent,
    setCurrentIntent
  }
}