"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Brain,
  Search,
  Zap,
  Target,
  TrendingUp,
  Users,
  Settings,
  Activity,
  Sparkles,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Import Phase 2.2.1 components
import { SearchIntentEngine, useSearchIntent } from "./search-intent-engine"
import type { SearchQuery, SearchPattern, SearchIntent, SearchLanguage } from "./search-intent-engine"
import { AdaptiveSearchResponse } from "./adaptive-search-response"
import { SearchPatternDetector } from "./search-pattern-detector"
import { MultiLanguageSearch } from "./multi-language-search"

// Import Phase 2.2.2 component
import { IntelligentAutocomplete } from "./intelligent-autocomplete"
import type { AutocompleteSuggestion, SuggestionType } from "./intelligent-autocomplete"

// Import analytics components
import { useSearchAnalytics } from "./search-analytics-learning"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { FilterState } from "./filter-sidebar"

interface IntegratedSearchSystemProps {
  creators?: EnhancedCreator[]
  recentSearches?: string[]
  onSearch?: (query: string, searchData: SearchQuery) => void
  onCreatorSelect?: (creator: EnhancedCreator) => void
  onFilterUpdate?: (filters: Partial<FilterState>) => void
  enableAdvancedFeatures?: boolean
  enableAnalytics?: boolean
  debugMode?: boolean
  className?: string
}

interface SearchSessionData {
  sessionId: string
  startTime: number
  queries: Array<{
    query: string
    source: "typing" | "autocomplete" | "voice" | "command"
    suggestionType?: SuggestionType
    searchPattern?: SearchPattern
    searchIntent?: SearchIntent
    language?: SearchLanguage
    timestamp: number
    responseTime: number
  }>
  autocompleteUsage: {
    suggestionsShown: number
    suggestionsSelected: number
    typoCorrections: number
    predictiveUse: number
  }
  intentClassification: {
    totalQueries: number
    accurateClassifications: number
    confidenceScores: number[]
  }
  performanceMetrics: {
    averageResponseTime: number
    cacheHitRate: number
    prefetchSuccess: number
  }
}

export function IntegratedSearchSystem({
  creators = [],
  recentSearches = [],
  onSearch,
  onCreatorSelect,
  onFilterUpdate,
  enableAdvancedFeatures = true,
  enableAnalytics = true,
  debugMode = false,
  className
}: IntegratedSearchSystemProps) {
  const [currentQuery, setCurrentQuery] = React.useState("")
  const [currentSearchData, setCurrentSearchData] = React.useState<SearchQuery | null>(null)
  const [sessionData, setSessionData] = React.useState<SearchSessionData>({
    sessionId: `session_${Date.now()}`,
    startTime: Date.now(),
    queries: [],
    autocompleteUsage: {
      suggestionsShown: 0,
      suggestionsSelected: 0,
      typoCorrections: 0,
      predictiveUse: 0
    },
    intentClassification: {
      totalQueries: 0,
      accurateClassifications: 0,
      confidenceScores: []
    },
    performanceMetrics: {
      averageResponseTime: 0,
      cacheHitRate: 0,
      prefetchSuccess: 0
    }
  })

  const [systemSettings, setSystemSettings] = React.useState({
    enableAutocomplete: true,
    enableIntentClassification: true,
    enablePatternDetection: true,
    enableMultiLanguage: true,
    enableAdaptiveResponses: true,
    enablePredictive: true,
    enableTypoCorrection: true,
    locale: "en-US" as "en-US" | "fr-FR" | "ht-HT"
  })

  const [performanceMode, setPerformanceMode] = React.useState<"fast" | "balanced" | "comprehensive">("balanced")
  const [showSystemInsights, setShowSystemInsights] = React.useState(false)

  // Hooks from different phases
  const { analyzeSearchIntent } = useSearchIntent()
  const { analytics, trackSearchEvent } = useSearchAnalytics()

  // Analyze search query with intent engine
  const analyzeQuery = React.useCallback(async (query: string): Promise<SearchQuery> => {
    const startTime = Date.now()
    
    try {
      // Use Phase 2.2.1 search intent engine
      const searchData = analyzeSearchIntent(query)
      
      // Track performance
      const responseTime = Date.now() - startTime
      setSessionData(prev => ({
        ...prev,
        performanceMetrics: {
          ...prev.performanceMetrics,
          averageResponseTime: (prev.performanceMetrics.averageResponseTime + responseTime) / 2
        }
      }))

      return searchData
    } catch (error) {
      console.error("Error analyzing search query:", error)
      // Fallback basic search data
      return {
        original: query,
        cleaned: query.toLowerCase(),
        tokens: query.toLowerCase().split(" "),
        length: query.split(" ").length,
        language: "english",
        pattern: "exploratory",
        intent: "medium",
        confidence: 0.5,
        extractedEntities: {},
        suggestedFilters: {},
        responseStrategy: {
          type: "curated_list",
          priority: "normal",
          components: []
        }
      }
    }
  }, [analyzeSearchIntent])

  // Handle search execution from autocomplete or direct input
  const handleSearch = React.useCallback(async (query: string, source: "typing" | "autocomplete" | "voice" | "command" = "typing", suggestionType?: SuggestionType) => {
    if (!query.trim()) return

    setCurrentQuery(query)
    
    // Analyze query with intent engine
    const searchData = await analyzeQuery(query)
    setCurrentSearchData(searchData)

    // Track session data
    setSessionData(prev => ({
      ...prev,
      queries: [
        ...prev.queries,
        {
          query,
          source,
          suggestionType,
          searchPattern: searchData.pattern,
          searchIntent: searchData.intent,
          language: searchData.language,
          timestamp: Date.now(),
          responseTime: Date.now() - prev.startTime
        }
      ],
      intentClassification: {
        totalQueries: prev.intentClassification.totalQueries + 1,
        accurateClassifications: prev.intentClassification.accurateClassifications + (searchData.confidence > 0.7 ? 1 : 0),
        confidenceScores: [...prev.intentClassification.confidenceScores, searchData.confidence]
      }
    }))

    // Track analytics if enabled
    if (enableAnalytics) {
      trackSearchEvent({
        query,
        pattern: searchData.pattern,
        intent: searchData.intent,
        language: searchData.language,
        success: true, // Assume success for now
        responseTime: Date.now() - Date.now() // This would be calculated properly
      })
    }

    // Notify parent component
    onSearch?.(query, searchData)

    toast.success(`Search executed: "${query}" (${searchData.pattern} pattern, ${searchData.intent} intent)`)
  }, [analyzeQuery, enableAnalytics, trackSearchEvent, onSearch])

  // Handle autocomplete suggestion selection
  const handleSuggestionSelect = React.useCallback((suggestion: AutocompleteSuggestion) => {
    setSessionData(prev => ({
      ...prev,
      autocompleteUsage: {
        ...prev.autocompleteUsage,
        suggestionsSelected: prev.autocompleteUsage.suggestionsSelected + 1,
        typoCorrections: suggestion.metadata?.source === "typo_correction" 
          ? prev.autocompleteUsage.typoCorrections + 1 
          : prev.autocompleteUsage.typoCorrections,
        predictiveUse: suggestion.type === "predictive" 
          ? prev.autocompleteUsage.predictiveUse + 1 
          : prev.autocompleteUsage.predictiveUse
      }
    }))

    handleSearch(suggestion.text, "autocomplete", suggestion.type)
  }, [handleSearch])

  // Handle intent detection from Phase 2.2.1
  const handleIntentDetected = React.useCallback((searchData: SearchQuery) => {
    setCurrentSearchData(searchData)
    
    if (debugMode) {
      console.log("Intent detected:", {
        pattern: searchData.pattern,
        intent: searchData.intent,
        confidence: searchData.confidence,
        language: searchData.language
      })
    }
  }, [debugMode])

  // Calculate system performance metrics
  const systemMetrics = React.useMemo(() => {
    const avgConfidence = sessionData.intentClassification.confidenceScores.length > 0
      ? sessionData.intentClassification.confidenceScores.reduce((sum, score) => sum + score, 0) / sessionData.intentClassification.confidenceScores.length
      : 0

    const autocompleteEffectiveness = sessionData.autocompleteUsage.suggestionsShown > 0
      ? (sessionData.autocompleteUsage.suggestionsSelected / sessionData.autocompleteUsage.suggestionsShown) * 100
      : 0

    const intentAccuracy = sessionData.intentClassification.totalQueries > 0
      ? (sessionData.intentClassification.accurateClassifications / sessionData.intentClassification.totalQueries) * 100
      : 0

    return {
      avgConfidence: avgConfidence * 100,
      autocompleteEffectiveness,
      intentAccuracy,
      totalQueries: sessionData.queries.length,
      avgResponseTime: sessionData.performanceMetrics.averageResponseTime
    }
  }, [sessionData])

  return (
    <div className={cn("space-y-6", className)}>
      {/* System Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Integrated Search System
              <Badge variant="default" className="text-xs">
                Phases 2.2.1 + 2.2.2
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Select value={performanceMode} onValueChange={setPerformanceMode}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Fast</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSystemInsights(!showSystemInsights)}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {showSystemInsights && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {systemMetrics.totalQueries}
                </div>
                <div className="text-xs text-gray-600">Total Queries</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {systemMetrics.intentAccuracy.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">Intent Accuracy</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {systemMetrics.autocompleteEffectiveness.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">Autocomplete Use</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {systemMetrics.avgResponseTime.toFixed(0)}ms
                </div>
                <div className="text-xs text-gray-600">Avg Response</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Main Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Intelligent Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Phase 2.2.2 Intelligent Autocomplete */}
          {systemSettings.enableAutocomplete && (
            <IntelligentAutocomplete
              onSearch={(query) => handleSearch(query, "typing")}
              onSuggestionSelect={handleSuggestionSelect}
              creators={creators}
              recentSearches={recentSearches}
              enablePredictive={systemSettings.enablePredictive}
              enableTypoCorrection={systemSettings.enableTypoCorrection}
              locale={systemSettings.locale}
            />
          )}

          {/* System Controls */}
          <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center gap-2">
              <Switch
                checked={systemSettings.enableAutocomplete}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, enableAutocomplete: checked }))}
              />
              <Label className="text-sm">Autocomplete</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={systemSettings.enableIntentClassification}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, enableIntentClassification: checked }))}
              />
              <Label className="text-sm">Intent AI</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={systemSettings.enableMultiLanguage}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, enableMultiLanguage: checked }))}
              />
              <Label className="text-sm">Multi-language</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={systemSettings.enablePredictive}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, enablePredictive: checked }))}
              />
              <Label className="text-sm">Predictive</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase 2.2.1 Search Intent Engine Integration */}
      {systemSettings.enableIntentClassification && debugMode && (
        <SearchIntentEngine
          onIntentDetected={handleIntentDetected}
          enableLearning={true}
          debugMode={debugMode}
        />
      )}

      {/* Adaptive Search Responses */}
      {currentSearchData && systemSettings.enableAdaptiveResponses && (
        <AdaptiveSearchResponse
          searchQuery={currentSearchData}
          creators={creators}
          onCreatorSelect={onCreatorSelect}
          onFilterApply={onFilterUpdate}
          onSearch={(query) => handleSearch(query, "typing")}
        />
      )}

      {/* Multi-language Search Support */}
      {systemSettings.enableMultiLanguage && debugMode && (
        <MultiLanguageSearch
          defaultLanguage={systemSettings.locale === "en-US" ? "english" : systemSettings.locale === "fr-FR" ? "french" : "kreyol"}
          enableTranslation={true}
          enableCulturalAdaptation={true}
        />
      )}

      {/* Pattern Detection */}
      {systemSettings.enablePatternDetection && debugMode && (
        <SearchPatternDetector
          userId="current_user"
          enableLearning={true}
          showInsights={true}
        />
      )}

      {/* Session Analytics */}
      {enableAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Session Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Search Patterns</h4>
                <div className="space-y-2">
                  {sessionData.queries.slice(-3).map((query, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="font-mono truncate">"{query.query}"</span>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {query.searchPattern?.replace("_", " ")}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {query.source}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Autocomplete Usage</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Suggestions Selected:</span>
                    <span className="font-medium">{sessionData.autocompleteUsage.suggestionsSelected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Typo Corrections:</span>
                    <span className="font-medium">{sessionData.autocompleteUsage.typoCorrections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Predictive Use:</span>
                    <span className="font-medium">{sessionData.autocompleteUsage.predictiveUse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Effectiveness:</span>
                    <span className={cn(
                      "font-medium",
                      systemMetrics.autocompleteEffectiveness > 50 ? "text-green-600" : "text-orange-600"
                    )}>
                      {systemMetrics.autocompleteEffectiveness.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Insights */}
      {debugMode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">System Integration</span>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {systemMetrics.avgConfidence.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Avg Confidence</div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {sessionData.performanceMetrics.cacheHitRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Cache Hit Rate</div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {sessionData.performanceMetrics.prefetchSuccess.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Prefetch Success</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Export hook for using the integrated system
export function useIntegratedSearchSystem() {
  const [isSystemReady, setIsSystemReady] = React.useState(false)
  const [systemHealth, setSystemHealth] = React.useState({
    autocomplete: true,
    intentEngine: true,
    patternDetection: true,
    multiLanguage: true,
    analytics: true
  })

  React.useEffect(() => {
    // Initialize system health check
    const healthCheck = () => {
      setIsSystemReady(Object.values(systemHealth).every(Boolean))
    }
    
    healthCheck()
  }, [systemHealth])

  return {
    isSystemReady,
    systemHealth,
    setSystemHealth
  }
}