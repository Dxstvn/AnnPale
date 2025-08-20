"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
  BarChart3,
  Mic,
  Camera,
  Hand,
  Clipboard,
  QrCode,
  FileText,
  Eye,
  Ear,
  MousePointer,
  Volume2,
  Image,
  Link,
  Layers,
  Network,
  Cpu,
  Database
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Import all search components from previous phases
import { SearchIntentEngine, useSearchIntent } from "./search-intent-engine"
import type { SearchQuery, SearchPattern, SearchIntent, SearchLanguage } from "./search-intent-engine"
import { AdaptiveSearchResponse } from "./adaptive-search-response"
import { SearchPatternDetector } from "./search-pattern-detector"
import { MultiLanguageSearch } from "./multi-language-search"
import { IntelligentAutocomplete } from "./intelligent-autocomplete"
import type { AutocompleteSuggestion, SuggestionType } from "./intelligent-autocomplete"
import { MultiModalSearch, useMultiModalSearch } from "./multi-modal-search"
import type { SearchInputMethod, SearchInputEvent } from "./multi-modal-search"
import { useSearchAnalytics } from "./search-analytics-learning"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { FilterState } from "./filter-sidebar"

interface CompleteSearchSystemProps {
  creators?: EnhancedCreator[]
  recentSearches?: string[]
  onSearch?: (query: string, searchData: SearchQuery, inputEvent: SearchInputEvent) => void
  onCreatorSelect?: (creator: EnhancedCreator) => void
  onFilterUpdate?: (filters: Partial<FilterState>) => void
  enableAdvancedFeatures?: boolean
  enableAnalytics?: boolean
  enableMultiModal?: boolean
  debugMode?: boolean
  className?: string
}

interface SystemConfiguration {
  // Phase 2.2.1 - Search Intent
  enableIntentClassification: boolean
  enablePatternDetection: boolean
  enableMultiLanguage: boolean
  enableAdaptiveResponses: boolean
  
  // Phase 2.2.2 - Autocomplete
  enableAutocomplete: boolean
  enablePredictive: boolean
  enableTypoCorrection: boolean
  enableSynonymExpansion: boolean
  
  // Phase 2.2.3 - Multi-Modal
  enableVoiceSearch: boolean
  enableImageSearch: boolean
  enableGestureInput: boolean
  enablePasteInput: boolean
  enableQRScanning: boolean
  
  // Performance & Analytics
  enableRealTimeLearning: boolean
  enablePerformanceTracking: boolean
  enableUserFeedback: boolean
  
  // Locale & Accessibility
  locale: "en-US" | "fr-FR" | "ht-HT"
  accessibilityMode: boolean
  reducedMotion: boolean
}

interface ComprehensiveSearchData {
  // Core search data
  query: string
  searchData: SearchQuery
  inputEvent: SearchInputEvent
  
  // Processing pipeline
  processingSteps: Array<{
    step: string
    duration: number
    success: boolean
    output?: any
  }>
  
  // Analytics
  performance: {
    totalProcessingTime: number
    cacheHits: number
    mlInferenceTime: number
    uiRenderTime: number
  }
  
  // User experience
  userInteractions: Array<{
    type: "input" | "suggestion_select" | "voice_command" | "gesture" | "correction"
    timestamp: number
    data: any
  }>
}

const DEFAULT_CONFIGURATION: SystemConfiguration = {
  enableIntentClassification: true,
  enablePatternDetection: true,
  enableMultiLanguage: true,
  enableAdaptiveResponses: true,
  enableAutocomplete: true,
  enablePredictive: true,
  enableTypoCorrection: true,
  enableSynonymExpansion: true,
  enableVoiceSearch: true,
  enableImageSearch: true,
  enableGestureInput: true,
  enablePasteInput: true,
  enableQRScanning: true,
  enableRealTimeLearning: true,
  enablePerformanceTracking: true,
  enableUserFeedback: true,
  locale: "en-US",
  accessibilityMode: false,
  reducedMotion: false
}

export function CompleteSearchSystem({
  creators = [],
  recentSearches = [],
  onSearch,
  onCreatorSelect,
  onFilterUpdate,
  enableAdvancedFeatures = true,
  enableAnalytics = true,
  enableMultiModal = true,
  debugMode = false,
  className
}: CompleteSearchSystemProps) {
  const [currentQuery, setCurrentQuery] = React.useState("")
  const [currentSearchData, setCurrentSearchData] = React.useState<SearchQuery | null>(null)
  const [currentInputEvent, setCurrentInputEvent] = React.useState<SearchInputEvent | null>(null)
  const [systemConfig, setSystemConfig] = React.useState<SystemConfiguration>(DEFAULT_CONFIGURATION)
  const [performanceMode, setPerformanceMode] = React.useState<"fast" | "balanced" | "comprehensive">("balanced")
  const [isSystemReady, setIsSystemReady] = React.useState(false)
  
  // Session data tracking
  const [sessionData, setSessionData] = React.useState({
    sessionId: `session_${Date.now()}`,
    startTime: Date.now(),
    searchesCount: 0,
    inputMethodsUsed: new Set<SearchInputMethod>(),
    featuresUsed: new Set<string>(),
    totalProcessingTime: 0,
    userSatisfactionScore: 0,
    errorCount: 0
  })

  // Component hooks
  const { analyzeSearchIntent } = useSearchIntent()
  const { analytics, trackSearchEvent } = useSearchAnalytics()
  const { inputMethodStats, trackInputMethod } = useMultiModalSearch()

  // System initialization
  React.useEffect(() => {
    const initializeSystem = async () => {
      // Simulate system component initialization
      const components = [
        "Intent Classification Engine",
        "Autocomplete System", 
        "Multi-Modal Input",
        "Pattern Detection",
        "Multi-Language Support",
        "Analytics Pipeline"
      ]

      for (const component of components) {
        await new Promise(resolve => setTimeout(resolve, 100))
        console.log(`✓ ${component} initialized`)
      }
      
      setIsSystemReady(true)
      toast.success("Complete Search System initialized")
    }

    initializeSystem()
  }, [])

  // Advanced search processing pipeline
  const processCompleteSearch = React.useCallback(async (
    query: string, 
    inputMethod: SearchInputMethod, 
    inputMetadata?: any
  ): Promise<ComprehensiveSearchData> => {
    const startTime = Date.now()
    const processingSteps: ComprehensiveSearchData["processingSteps"] = []
    
    try {
      // Step 1: Input Processing
      const inputStart = Date.now()
      const inputEvent: SearchInputEvent = {
        method: inputMethod,
        query,
        confidence: inputMetadata?.confidence || 1.0,
        metadata: inputMetadata,
        timestamp: Date.now(),
        processingTime: 0
      }
      processingSteps.push({
        step: "Input Processing",
        duration: Date.now() - inputStart,
        success: true,
        output: inputEvent
      })

      // Step 2: Intent Classification (Phase 2.2.1)
      const intentStart = Date.now()
      let searchData: SearchQuery
      
      if (systemConfig.enableIntentClassification) {
        searchData = analyzeSearchIntent(query)
      } else {
        // Fallback minimal search data
        searchData = {
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
      }
      
      processingSteps.push({
        step: "Intent Classification",
        duration: Date.now() - intentStart,
        success: true,
        output: searchData
      })

      // Step 3: Multi-Language Processing
      const langStart = Date.now()
      if (systemConfig.enableMultiLanguage && searchData.language !== "english") {
        // Apply language-specific processing
        // This would integrate with multi-language search component
      }
      processingSteps.push({
        step: "Language Processing",
        duration: Date.now() - langStart,
        success: true
      })

      // Step 4: Performance Optimization
      const perfStart = Date.now()
      const totalProcessingTime = Date.now() - startTime
      
      // Apply performance mode optimizations
      if (performanceMode === "fast" && totalProcessingTime > 100) {
        // Skip non-essential processing
        console.log("Fast mode: Skipping non-essential processing")
      }
      
      processingSteps.push({
        step: "Performance Optimization",
        duration: Date.now() - perfStart,
        success: true
      })

      // Create comprehensive search data
      const comprehensiveData: ComprehensiveSearchData = {
        query,
        searchData,
        inputEvent,
        processingSteps,
        performance: {
          totalProcessingTime,
          cacheHits: 0, // Would be calculated
          mlInferenceTime: 0, // Would be calculated
          uiRenderTime: 0 // Would be calculated
        },
        userInteractions: [{
          type: "input",
          timestamp: Date.now(),
          data: { method: inputMethod, query }
        }]
      }

      // Update session data
      setSessionData(prev => ({
        ...prev,
        searchesCount: prev.searchesCount + 1,
        inputMethodsUsed: new Set([...prev.inputMethodsUsed, inputMethod]),
        totalProcessingTime: prev.totalProcessingTime + totalProcessingTime
      }))

      // Track analytics
      if (enableAnalytics) {
        trackSearchEvent({
          query,
          pattern: searchData.pattern,
          intent: searchData.intent,
          language: searchData.language,
          success: true,
          responseTime: totalProcessingTime
        })
        
        trackInputMethod(inputMethod)
      }

      return comprehensiveData

    } catch (error) {
      console.error("Search processing error:", error)
      
      // Error handling
      setSessionData(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1
      }))

      throw error
    }
  }, [systemConfig, performanceMode, analyzeSearchIntent, enableAnalytics, trackSearchEvent, trackInputMethod])

  // Handle search from any input method
  const handleCompleteSearch = React.useCallback(async (
    query: string, 
    inputMethod: SearchInputMethod, 
    inputMetadata?: any
  ) => {
    if (!query.trim() || !isSystemReady) return

    try {
      const comprehensiveData = await processCompleteSearch(query, inputMethod, inputMetadata)
      
      setCurrentQuery(query)
      setCurrentSearchData(comprehensiveData.searchData)
      setCurrentInputEvent(comprehensiveData.inputEvent)

      // Notify parent component
      onSearch?.(query, comprehensiveData.searchData, comprehensiveData.inputEvent)

      toast.success(
        `Search completed via ${inputMethod} (${comprehensiveData.performance.totalProcessingTime}ms)`
      )

    } catch (error) {
      toast.error("Search processing failed. Please try again.")
    }
  }, [isSystemReady, processCompleteSearch, onSearch])

  // Handle autocomplete suggestion selection
  const handleAutocompleteSelect = React.useCallback((suggestion: AutocompleteSuggestion) => {
    handleCompleteSearch(suggestion.text, "text", {
      source: "autocomplete",
      suggestionType: suggestion.type,
      confidence: suggestion.score / 100
    })
  }, [handleCompleteSearch])

  // Calculate system health metrics
  const systemHealth = React.useMemo(() => {
    const enabledFeatures = Object.values(systemConfig).filter(Boolean).length
    const totalFeatures = Object.keys(systemConfig).length
    const healthScore = (enabledFeatures / totalFeatures) * 100

    const performanceScore = sessionData.errorCount === 0 ? 100 : 
      Math.max(0, 100 - (sessionData.errorCount * 10))

    return {
      overall: Math.round((healthScore + performanceScore) / 2),
      features: Math.round(healthScore),
      performance: Math.round(performanceScore),
      errors: sessionData.errorCount
    }
  }, [systemConfig, sessionData.errorCount])

  // Performance metrics
  const performanceMetrics = React.useMemo(() => {
    const avgProcessingTime = sessionData.searchesCount > 0 
      ? sessionData.totalProcessingTime / sessionData.searchesCount 
      : 0

    return {
      avgProcessingTime: Math.round(avgProcessingTime),
      totalSearches: sessionData.searchesCount,
      inputMethodsUsed: sessionData.inputMethodsUsed.size,
      featuresUsed: sessionData.featuresUsed.size,
      uptime: Date.now() - sessionData.startTime
    }
  }, [sessionData])

  if (!isSystemReady) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-sm text-gray-600">Initializing Complete Search System...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* System Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-600" />
              Complete Search System
              <Badge variant="default" className="text-xs">
                Phases 2.2.1 + 2.2.2 + 2.2.3
              </Badge>
              <Badge variant={systemHealth.overall > 90 ? "default" : "secondary"} className="text-xs">
                {systemHealth.overall}% Health
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-3">
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
              
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {performanceMetrics.totalSearches}
              </div>
              <div className="text-xs text-gray-600">Total Searches</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {performanceMetrics.avgProcessingTime}ms
              </div>
              <div className="text-xs text-gray-600">Avg Processing</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {performanceMetrics.inputMethodsUsed}/6
              </div>
              <div className="text-xs text-gray-600">Input Methods</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {systemHealth.errors}
              </div>
              <div className="text-xs text-gray-600">Errors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Search Interface - Multi-Modal */}
      {enableMultiModal ? (
        <MultiModalSearch
          onSearch={handleCompleteSearch}
          onMethodChange={(method) => {
            setSessionData(prev => ({
              ...prev,
              inputMethodsUsed: new Set([...prev.inputMethodsUsed, method])
            }))
          }}
          creators={creators}
          voiceConfig={{
            enableLanguageDetection: systemConfig.enableMultiLanguage,
            enableAccentNormalization: true,
            supportedLanguages: ["en-US", "fr-FR", "ht-HT"]
          }}
          enableAllMethods={enableAdvancedFeatures}
        />
      ) : (
        // Fallback to intelligent autocomplete if multi-modal is disabled
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search</CardTitle>
          </CardHeader>
          <CardContent>
            <IntelligentAutocomplete
              onSearch={(query) => handleCompleteSearch(query, "text")}
              onSuggestionSelect={handleAutocompleteSelect}
              creators={creators}
              recentSearches={recentSearches}
              enablePredictive={systemConfig.enablePredictive}
              enableTypoCorrection={systemConfig.enableTypoCorrection}
              locale={systemConfig.locale}
            />
          </CardContent>
        </Card>
      )}

      {/* Adaptive Search Responses */}
      {currentSearchData && systemConfig.enableAdaptiveResponses && (
        <AdaptiveSearchResponse
          searchQuery={currentSearchData}
          creators={creators}
          onCreatorSelect={onCreatorSelect}
          onFilterApply={onFilterUpdate}
          onSearch={(query) => handleCompleteSearch(query, "text")}
        />
      )}

      {/* System Configuration & Analytics */}
      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Phase 2.2.1 Controls */}
              <div>
                <h4 className="font-medium mb-3">Search Intelligence (Phase 2.2.1)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="intent-classification">Intent Classification</Label>
                    <Switch
                      id="intent-classification"
                      checked={systemConfig.enableIntentClassification}
                      onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, enableIntentClassification: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pattern-detection">Pattern Detection</Label>
                    <Switch
                      id="pattern-detection"
                      checked={systemConfig.enablePatternDetection}
                      onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, enablePatternDetection: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="multi-language">Multi-Language</Label>
                    <Switch
                      id="multi-language"
                      checked={systemConfig.enableMultiLanguage}
                      onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, enableMultiLanguage: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="adaptive-responses">Adaptive Responses</Label>
                    <Switch
                      id="adaptive-responses"
                      checked={systemConfig.enableAdaptiveResponses}
                      onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, enableAdaptiveResponses: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* Phase 2.2.2 Controls */}
              <div>
                <h4 className="font-medium mb-3">Autocomplete System (Phase 2.2.2)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autocomplete">Autocomplete</Label>
                    <Switch
                      id="autocomplete"
                      checked={systemConfig.enableAutocomplete}
                      onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, enableAutocomplete: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="predictive">Predictive</Label>
                    <Switch
                      id="predictive"
                      checked={systemConfig.enablePredictive}
                      onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, enablePredictive: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="typo-correction">Typo Correction</Label>
                    <Switch
                      id="typo-correction"
                      checked={systemConfig.enableTypoCorrection}
                      onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, enableTypoCorrection: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="synonym-expansion">Synonym Expansion</Label>
                    <Switch
                      id="synonym-expansion"
                      checked={systemConfig.enableSynonymExpansion}
                      onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, enableSynonymExpansion: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* Phase 2.2.3 Controls */}
              <div>
                <h4 className="font-medium mb-3">Multi-Modal Input (Phase 2.2.3)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-search">Voice Search</Label>
                    <Switch
                      id="voice-search"
                      checked={systemConfig.enableVoiceSearch}
                      onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, enableVoiceSearch: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="image-search">Image Search</Label>
                    <Switch
                      id="image-search"
                      checked={systemConfig.enableImageSearch}
                      onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, enableImageSearch: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gesture-input">Gesture Input</Label>
                    <Switch
                      id="gesture-input"
                      checked={systemConfig.enableGestureInput}
                      onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, enableGestureInput: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="qr-scanning">QR Scanning</Label>
                    <Switch
                      id="qr-scanning"
                      checked={systemConfig.enableQRScanning}
                      onCheckedChange={(checked) => setSystemConfig(prev => ({ ...prev, enableQRScanning: checked }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Input Method Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(inputMethodStats).map(([method, count]) => (
                    <div key={method} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize">{method.replace("_", " ")}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <Progress value={(count / Math.max(1, Math.max(...Object.values(inputMethodStats)))) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Overall Health</span>
                      <span className="font-medium">{systemHealth.overall}%</span>
                    </div>
                    <Progress value={systemHealth.overall} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Feature Availability</span>
                      <span className="font-medium">{systemHealth.features}%</span>
                    </div>
                    <Progress value={systemHealth.features} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Performance Score</span>
                      <span className="font-medium">{systemHealth.performance}%</span>
                    </div>
                    <Progress value={systemHealth.performance} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg text-center">
                  <div className="text-xl font-bold text-green-600">
                    {performanceMetrics.avgProcessingTime}ms
                  </div>
                  <div className="text-xs text-gray-600">Avg Processing Time</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Target: &lt;150ms
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {((Date.now() - sessionData.startTime) / 1000 / 60).toFixed(1)}m
                  </div>
                  <div className="text-xs text-gray-600">Session Duration</div>
                  <div className="text-xs text-gray-500 mt-1">
                    System uptime
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {sessionData.inputMethodsUsed.size}/6
                  </div>
                  <div className="text-xs text-gray-600">Methods Used</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Multi-modal adoption
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="debug" className="space-y-4">
          {debugMode && (
            <>
              {/* Debug components would go here */}
              {systemConfig.enableIntentClassification && (
                <SearchIntentEngine
                  enableLearning={true}
                  debugMode={true}
                />
              )}
              
              {systemConfig.enablePatternDetection && (
                <SearchPatternDetector
                  enableLearning={true}
                  showInsights={true}
                />
              )}
              
              {systemConfig.enableMultiLanguage && (
                <MultiLanguageSearch
                  enableTranslation={true}
                  enableCulturalAdaptation={true}
                />
              )}
            </>
          )}
          
          {!debugMode && (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Debug mode is disabled</p>
                <p className="text-xs text-gray-500 mt-1">Enable debug mode to see detailed system information</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Hook for using the complete search system
export function useCompleteSearchSystem() {
  const [systemMetrics, setSystemMetrics] = React.useState({
    totalSearches: 0,
    successRate: 0,
    avgResponseTime: 0,
    userSatisfaction: 0,
    systemHealth: 100
  })

  const trackSystemUsage = React.useCallback((searchData: ComprehensiveSearchData) => {
    setSystemMetrics(prev => ({
      ...prev,
      totalSearches: prev.totalSearches + 1,
      avgResponseTime: (prev.avgResponseTime + searchData.performance.totalProcessingTime) / 2
    }))
  }, [])

  return {
    systemMetrics,
    trackSystemUsage
  }
}