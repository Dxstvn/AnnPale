"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Brain,
  Clock,
  TrendingUp,
  Shield,
  Search,
  Sparkles,
  Activity,
  Settings,
  Eye,
  EyeOff,
  Star,
  Bell,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Import all Phase 2.2.6 components
import { SearchHistoryManager, useSearchHistory } from "./search-history-manager"
import type { SearchHistoryEntry, SavedSearch, PrivacySettings } from "./search-history-manager"
import { SearchPersonalizationEngine, PersonalizationUtils } from "./search-personalization-engine"
import type { UserProfile, PersonalizedRecommendation } from "./search-personalization-engine"
import { TrendingSearches, useTrendingSearches } from "./trending-searches"
import type { TrendingSearch, TrendingCreator, SearchTrendAnalytics } from "./trending-searches"

// Import existing search components
import { UnifiedSearchExperience } from "./unified-search-experience"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { SearchQuery } from "./search-intent-engine"
import type { SearchInputEvent } from "./multi-modal-search"
import type { FilterState } from "./filter-sidebar"

interface PersonalizedSearchSystemProps {
  userId?: string
  creators?: EnhancedCreator[]
  onCreatorSelect?: (creator: EnhancedCreator) => void
  onFilterUpdate?: (filters: Partial<FilterState>) => void
  enablePersonalization?: boolean
  enableHistory?: boolean
  enableTrending?: boolean
  debugMode?: boolean
  className?: string
}

interface SearchSession {
  id: string
  startTime: Date
  searches: SearchHistoryEntry[]
  interactions: Array<{
    type: "view" | "click" | "book"
    creatorId: string
    timestamp: Date
    duration?: number
  }>
  isIncognito: boolean
}

export function PersonalizedSearchSystem({
  userId,
  creators = [],
  onCreatorSelect,
  onFilterUpdate,
  enablePersonalization = true,
  enableHistory = true,
  enableTrending = true,
  debugMode = false,
  className
}: PersonalizedSearchSystemProps) {
  const [currentSession, setCurrentSession] = React.useState<SearchSession>({
    id: `session_${Date.now()}`,
    startTime: new Date(),
    searches: [],
    interactions: [],
    isIncognito: false
  })

  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null)
  const [privacySettings, setPrivacySettings] = React.useState<PrivacySettings>({
    saveHistory: true,
    personalizeResults: true,
    shareAnonymousData: false,
    incognitoMode: false,
    autoDeleteAfterDays: 30,
    dataRetention: "30days"
  })

  const [personalizedCreators, setPersonalizedCreators] = React.useState<EnhancedCreator[]>(creators)
  const [activeTab, setActiveTab] = React.useState<"search" | "history" | "trending">("search")
  
  const { history, addEntry, isIncognito, toggleIncognito } = useSearchHistory(userId)
  const { trending, refresh: refreshTrending } = useTrendingSearches()

  // Track search in history
  const trackSearch = React.useCallback((
    query: string,
    searchData: SearchQuery,
    inputEvent: SearchInputEvent,
    results: EnhancedCreator[]
  ) => {
    if (privacySettings.incognitoMode) return

    const entry: Omit<SearchHistoryEntry, "id"> = {
      query,
      timestamp: new Date(),
      filters: {}, // Would extract from current filter state
      resultCount: results.length,
      clickedResults: [],
      searchMethod: inputEvent.method,
      language: searchData.language,
      pattern: searchData.pattern,
      intent: searchData.intent,
      duration: 0,
      successful: results.length > 0
    }

    addEntry(entry)

    // Update session
    setCurrentSession(prev => ({
      ...prev,
      searches: [...prev.searches, { ...entry, id: `search_${Date.now()}` }]
    }))

    // Track in personalization engine if enabled
    if (enablePersonalization && userProfile) {
      // Update user profile based on search
      const updatedProfile = { ...userProfile }
      updatedProfile.history.totalSearches++
      
      // Track search patterns
      if (searchData.pattern) {
        updatedProfile.behavior.searchPatterns[searchData.pattern] = 
          (updatedProfile.behavior.searchPatterns[searchData.pattern] || 0) + 1
      }

      // Track language preferences
      if (searchData.language) {
        updatedProfile.preferences.languages[searchData.language] = 
          Math.min(1, (updatedProfile.preferences.languages[searchData.language] || 0) + 0.1)
      }

      setUserProfile(updatedProfile)
    }
  }, [privacySettings.incognitoMode, addEntry, enablePersonalization, userProfile])

  // Track creator interaction
  const trackInteraction = React.useCallback((
    creatorId: string,
    type: "view" | "click" | "book",
    duration?: number
  ) => {
    // Update session
    setCurrentSession(prev => ({
      ...prev,
      interactions: [
        ...prev.interactions,
        {
          type,
          creatorId,
          timestamp: new Date(),
          duration
        }
      ]
    }))

    // Track in user profile
    if (enablePersonalization && userProfile) {
      const creator = creators.find(c => c.id === creatorId)
      if (creator) {
        const updatedProfile = { ...userProfile }
        
        // Update category preferences
        updatedProfile.preferences.categories[creator.category.toLowerCase()] = 
          Math.min(1, (updatedProfile.preferences.categories[creator.category.toLowerCase()] || 0) + 0.1)
        
        // Track viewed creators
        const existingView = updatedProfile.history.viewedCreators.find(vc => vc.id === creatorId)
        if (existingView) {
          existingView.count++
          existingView.lastViewed = new Date()
        } else {
          updatedProfile.history.viewedCreators.push({
            id: creatorId,
            count: 1,
            lastViewed: new Date()
          })
        }

        // Track bookings
        if (type === "book") {
          updatedProfile.history.totalBookings++
          updatedProfile.history.bookingHistory.push({
            creatorId,
            date: new Date(),
            price: creator.price
          })
        }

        setUserProfile(updatedProfile)
      }
    }
  }, [enablePersonalization, userProfile, creators])

  // Personalize search results
  React.useEffect(() => {
    if (!enablePersonalization || !userProfile || creators.length === 0) {
      setPersonalizedCreators(creators)
      return
    }

    const personalized = PersonalizationUtils.personalizeResults(creators, userProfile)
    setPersonalizedCreators(personalized)
  }, [creators, userProfile, enablePersonalization])

  // Handle privacy settings change
  const handlePrivacyChange = React.useCallback((settings: PrivacySettings) => {
    setPrivacySettings(settings)
    
    if (settings.incognitoMode) {
      setCurrentSession(prev => ({ ...prev, isIncognito: true }))
      toast.info("Incognito mode enabled - your searches won't be saved")
    } else if (!settings.incognitoMode && currentSession.isIncognito) {
      setCurrentSession(prev => ({ ...prev, isIncognito: false }))
      toast.info("Incognito mode disabled")
    }

    if (!settings.personalizeResults) {
      setPersonalizedCreators(creators)
    }
  }, [currentSession.isIncognito, creators])

  // Handle search from history or trending
  const handleSearchFromSource = React.useCallback((query: string, filters?: Record<string, any>) => {
    // Switch to search tab
    setActiveTab("search")
    
    // Trigger search in unified search experience
    const searchElement = document.querySelector('[data-search-input]') as HTMLInputElement
    if (searchElement) {
      searchElement.value = query
      searchElement.dispatchEvent(new Event('input', { bubbles: true }))
    }

    // Apply filters if provided
    if (filters) {
      onFilterUpdate?.(filters as Partial<FilterState>)
    }

    toast.success(`Searching for "${query}"`)
  }, [onFilterUpdate])

  // Enhanced creator select with tracking
  const handleCreatorSelect = React.useCallback((creator: EnhancedCreator) => {
    trackInteraction(creator.id, "click")
    onCreatorSelect?.(creator)
  }, [trackInteraction, onCreatorSelect])

  // Calculate system stats
  const systemStats = React.useMemo(() => {
    const sessionDuration = (new Date().getTime() - currentSession.startTime.getTime()) / 1000 / 60 // minutes
    const searchesPerMinute = currentSession.searches.length / Math.max(1, sessionDuration)
    const interactionRate = currentSession.interactions.length / Math.max(1, currentSession.searches.length)
    
    return {
      sessionDuration: Math.round(sessionDuration),
      totalSearches: currentSession.searches.length,
      totalInteractions: currentSession.interactions.length,
      searchesPerMinute: searchesPerMinute.toFixed(2),
      interactionRate: (interactionRate * 100).toFixed(0)
    }
  }, [currentSession])

  return (
    <div className={cn("space-y-6", className)}>
      {/* System Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle className="text-xl">Personalized Search</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {privacySettings.incognitoMode ? (
                    <span className="flex items-center gap-1">
                      <EyeOff className="h-3 w-3" />
                      Incognito Mode Active
                    </span>
                  ) : enablePersonalization ? (
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Personalized for You
                    </span>
                  ) : (
                    "Standard Search"
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Phase 2.2.6
              </Badge>
              
              {debugMode && (
                <div className="flex items-center gap-2 text-xs">
                  <span>Session: {systemStats.sessionDuration}m</span>
                  <span>•</span>
                  <span>{systemStats.totalSearches} searches</span>
                  <span>•</span>
                  <span>{systemStats.interactionRate}% CTR</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            History
            {history.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {history.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
            <Badge variant="secondary" className="ml-1 text-xs">
              Live
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Search Area */}
            <div className="lg:col-span-2">
              <UnifiedSearchExperience
                creators={enablePersonalization ? personalizedCreators : creators}
                onCreatorSelect={handleCreatorSelect}
                onFilterUpdate={onFilterUpdate}
                enableAllFeatures={true}
                debugMode={debugMode}
              />
            </div>

            {/* Personalization Sidebar */}
            <div className="space-y-4">
              {enablePersonalization && (
                <SearchPersonalizationEngine
                  userId={userId}
                  searchHistory={history}
                  creators={creators}
                  onProfileUpdate={setUserProfile}
                  enableLearning={!privacySettings.incognitoMode}
                  showInsights={true}
                />
              )}
            </div>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          {enableHistory && (
            <SearchHistoryManager
              userId={userId}
              onSearch={handleSearchFromSource}
              onPrivacyChange={handlePrivacyChange}
            />
          )}
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending">
          {enableTrending && (
            <TrendingSearches
              trendingSearches={trending}
              onSearchSelect={handleSearchFromSource}
              onCreatorSelect={(creatorId) => {
                const creator = creators.find(c => c.id === creatorId)
                if (creator) {
                  handleCreatorSelect(creator)
                }
              }}
              showAnalytics={true}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      {(history.length > 0 || trending.length > 0) && activeTab === "search" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {history.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("history")}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Recent: {history[0]?.query}
                  </Button>
                )}
                
                {trending.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearchFromSource(trending[0].query)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending: {trending[0].query}
                  </Button>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleIncognito}
              >
                {isIncognito ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Exit Incognito
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Go Incognito
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Export hook for using personalized search
export function usePersonalizedSearch(userId?: string) {
  const [isPersonalized, setIsPersonalized] = React.useState(false)
  const [profile, setProfile] = React.useState<UserProfile | null>(null)

  React.useEffect(() => {
    if (!userId) return

    const stored = localStorage.getItem(`user-profile-${userId}`)
    if (stored) {
      try {
        setProfile(JSON.parse(stored))
        setIsPersonalized(true)
      } catch (error) {
        console.error("Failed to load user profile:", error)
      }
    }
  }, [userId])

  return {
    isPersonalized,
    profile,
    updateProfile: setProfile
  }
}