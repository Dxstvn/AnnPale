"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  Clock,
  Star,
  Filter,
  Target,
  Activity,
  BarChart3,
  Sparkles,
  Info,
  ChevronRight,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { SearchHistoryEntry } from "./search-history-manager"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { SearchQuery } from "./search-intent-engine"

// User profile for personalization
export interface UserProfile {
  id: string
  preferences: {
    categories: Record<string, number> // Category -> affinity score (0-1)
    priceRange: { min: number; max: number; average: number }
    languages: Record<string, number> // Language -> preference score
    responseTime: string[] // Preferred response times
    features: string[] // Preferred creator features
  }
  behavior: {
    searchPatterns: Record<string, number> // Pattern type -> frequency
    averageSessionDuration: number // In seconds
    peakSearchTimes: number[] // Hours of day (0-23)
    deviceTypes: Record<string, number> // Device -> usage percentage
    conversionRate: number // Booking rate
  }
  history: {
    totalSearches: number
    totalBookings: number
    favoriteCreators: string[]
    viewedCreators: Array<{ id: string; count: number; lastViewed: Date }>
    bookingHistory: Array<{ creatorId: string; date: Date; price: number }>
  }
  learning: {
    clickThroughRate: Record<string, number> // Position -> CTR
    dwellTime: Record<string, number> // Creator ID -> average time spent
    bounceRate: number
    refinementRate: number // How often user refines search
  }
  lastUpdated: Date
}

// Personalization signals
export interface PersonalizationSignals {
  query: SearchQuery
  timeOfDay: number
  dayOfWeek: number
  deviceType: string
  location?: string
  sessionLength: number
  previousSearches: SearchHistoryEntry[]
}

// Personalized recommendation
export interface PersonalizedRecommendation {
  creators: EnhancedCreator[]
  reason: string
  confidence: number
  type: "category" | "similar" | "trending" | "price" | "language" | "behavioral"
}

// Personalization weights
interface PersonalizationWeights {
  categoryAffinity: number
  pricePreference: number
  languageMatch: number
  behavioralPattern: number
  historicalInteraction: number
  trendingBoost: number
  availabilityMatch: number
}

interface SearchPersonalizationEngineProps {
  userId?: string
  searchHistory?: SearchHistoryEntry[]
  creators?: EnhancedCreator[]
  currentQuery?: SearchQuery
  onProfileUpdate?: (profile: UserProfile) => void
  enableLearning?: boolean
  showInsights?: boolean
  className?: string
}

// Default personalization weights
const DEFAULT_WEIGHTS: PersonalizationWeights = {
  categoryAffinity: 0.25,
  pricePreference: 0.15,
  languageMatch: 0.15,
  behavioralPattern: 0.15,
  historicalInteraction: 0.15,
  trendingBoost: 0.1,
  availabilityMatch: 0.05
}

export function SearchPersonalizationEngine({
  userId,
  searchHistory = [],
  creators = [],
  currentQuery,
  onProfileUpdate,
  enableLearning = true,
  showInsights = false,
  className
}: SearchPersonalizationEngineProps) {
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null)
  const [recommendations, setRecommendations] = React.useState<PersonalizedRecommendation[]>([])
  const [personalizationScore, setPersonalizationScore] = React.useState(0)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [insights, setInsights] = React.useState<Array<{
    type: string
    message: string
    impact: "high" | "medium" | "low"
  }>>([])

  // Load user profile
  React.useEffect(() => {
    if (!userId) return

    const stored = localStorage.getItem(`user-profile-${userId}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUserProfile({
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
          history: {
            ...parsed.history,
            viewedCreators: parsed.history.viewedCreators.map((vc: any) => ({
              ...vc,
              lastViewed: new Date(vc.lastViewed)
            })),
            bookingHistory: parsed.history.bookingHistory.map((bh: any) => ({
              ...bh,
              date: new Date(bh.date)
            }))
          }
        })
      } catch (error) {
        console.error("Failed to load user profile:", error)
        initializeProfile()
      }
    } else {
      initializeProfile()
    }
  }, [userId])

  // Initialize new user profile
  const initializeProfile = () => {
    const newProfile: UserProfile = {
      id: userId || `anon_${Date.now()}`,
      preferences: {
        categories: {},
        priceRange: { min: 0, max: 500, average: 100 },
        languages: {},
        responseTime: [],
        features: []
      },
      behavior: {
        searchPatterns: {},
        averageSessionDuration: 0,
        peakSearchTimes: [],
        deviceTypes: {},
        conversionRate: 0
      },
      history: {
        totalSearches: 0,
        totalBookings: 0,
        favoriteCreators: [],
        viewedCreators: [],
        bookingHistory: []
      },
      learning: {
        clickThroughRate: {},
        dwellTime: {},
        bounceRate: 0,
        refinementRate: 0
      },
      lastUpdated: new Date()
    }

    setUserProfile(newProfile)
    if (userId) {
      localStorage.setItem(`user-profile-${userId}`, JSON.stringify(newProfile))
    }
  }

  // Learn from search history
  React.useEffect(() => {
    if (!enableLearning || !userProfile || searchHistory.length === 0) return

    const updatedProfile = learnFromHistory(userProfile, searchHistory)
    setUserProfile(updatedProfile)
    
    if (userId) {
      localStorage.setItem(`user-profile-${userId}`, JSON.stringify(updatedProfile))
    }
    
    onProfileUpdate?.(updatedProfile)
  }, [searchHistory, enableLearning])

  // Learn from search history
  const learnFromHistory = (
    profile: UserProfile,
    history: SearchHistoryEntry[]
  ): UserProfile => {
    const updated = { ...profile }

    // Analyze search patterns
    history.forEach(entry => {
      // Update search patterns
      if (entry.pattern) {
        updated.behavior.searchPatterns[entry.pattern] = 
          (updated.behavior.searchPatterns[entry.pattern] || 0) + 1
      }

      // Update language preferences
      if (entry.language) {
        updated.preferences.languages[entry.language] = 
          (updated.preferences.languages[entry.language] || 0) + 0.1
      }

      // Track successful searches
      if (entry.successful) {
        updated.learning.bounceRate = Math.max(0, updated.learning.bounceRate - 0.01)
      } else {
        updated.learning.bounceRate = Math.min(1, updated.learning.bounceRate + 0.01)
      }

      // Track refinement rate
      if (entry.filters && Object.keys(entry.filters).length > 0) {
        updated.learning.refinementRate = Math.min(1, updated.learning.refinementRate + 0.05)
      }
    })

    // Normalize scores
    Object.keys(updated.preferences.languages).forEach(lang => {
      updated.preferences.languages[lang] = Math.min(1, updated.preferences.languages[lang])
    })

    updated.history.totalSearches = history.length
    updated.lastUpdated = new Date()

    return updated
  }

  // Generate personalized recommendations
  const generateRecommendations = React.useCallback(async () => {
    if (!userProfile || creators.length === 0) return

    setIsProcessing(true)
    const recs: PersonalizedRecommendation[] = []

    // Category-based recommendations
    const topCategories = Object.entries(userProfile.preferences.categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat)

    topCategories.forEach(category => {
      const categoryCreators = creators.filter(c => 
        c.category.toLowerCase() === category.toLowerCase()
      ).slice(0, 5)

      if (categoryCreators.length > 0) {
        recs.push({
          creators: categoryCreators,
          reason: `Based on your interest in ${category}`,
          confidence: userProfile.preferences.categories[category] || 0.5,
          type: "category"
        })
      }
    })

    // Price-based recommendations
    const priceMatchCreators = creators.filter(c => 
      c.price >= userProfile.preferences.priceRange.min &&
      c.price <= userProfile.preferences.priceRange.max
    ).slice(0, 5)

    if (priceMatchCreators.length > 0) {
      recs.push({
        creators: priceMatchCreators,
        reason: `Within your typical budget range`,
        confidence: 0.7,
        type: "price"
      })
    }

    // Language-based recommendations
    const preferredLanguages = Object.entries(userProfile.preferences.languages)
      .filter(([,score]) => score > 0.5)
      .map(([lang]) => lang)

    if (preferredLanguages.length > 0) {
      const languageCreators = creators.filter(c =>
        c.languages.some(lang => 
          preferredLanguages.includes(lang.toLowerCase())
        )
      ).slice(0, 5)

      if (languageCreators.length > 0) {
        recs.push({
          creators: languageCreators,
          reason: `Speaks your preferred languages`,
          confidence: 0.8,
          type: "language"
        })
      }
    }

    // Behavioral pattern recommendations
    const dominantPattern = Object.entries(userProfile.behavior.searchPatterns)
      .sort(([,a], [,b]) => b - a)[0]

    if (dominantPattern) {
      const [pattern] = dominantPattern
      let patternCreators: EnhancedCreator[] = []

      switch (pattern) {
        case "exploratory":
          patternCreators = creators.filter(c => c.featured).slice(0, 5)
          break
        case "transactional":
          patternCreators = creators.filter(c => c.availability === "available").slice(0, 5)
          break
        case "known_item":
          patternCreators = userProfile.history.viewedCreators
            .map(vc => creators.find(c => c.id === vc.id))
            .filter(Boolean) as EnhancedCreator[]
          break
      }

      if (patternCreators.length > 0) {
        recs.push({
          creators: patternCreators.slice(0, 5),
          reason: `Matches your typical search style`,
          confidence: 0.6,
          type: "behavioral"
        })
      }
    }

    setRecommendations(recs)
    setIsProcessing(false)

    // Generate insights
    generateInsights(userProfile, recs)
  }, [userProfile, creators])

  // Generate personalization insights
  const generateInsights = (
    profile: UserProfile,
    recs: PersonalizedRecommendation[]
  ) => {
    const newInsights: typeof insights = []

    // Category insights
    const topCategory = Object.entries(profile.preferences.categories)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (topCategory) {
      newInsights.push({
        type: "category",
        message: `You frequently search for ${topCategory[0]} creators`,
        impact: "high"
      })
    }

    // Price insights
    if (profile.preferences.priceRange.average > 0) {
      newInsights.push({
        type: "price",
        message: `Your average booking price is $${profile.preferences.priceRange.average}`,
        impact: "medium"
      })
    }

    // Behavioral insights
    if (profile.learning.bounceRate > 0.5) {
      newInsights.push({
        type: "behavior",
        message: "Try using more specific search terms for better results",
        impact: "high"
      })
    }

    if (profile.learning.refinementRate > 0.7) {
      newInsights.push({
        type: "behavior",
        message: "You often use filters - save your preferred combinations",
        impact: "medium"
      })
    }

    // Language insights
    const dominantLanguage = Object.entries(profile.preferences.languages)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (dominantLanguage && dominantLanguage[1] > 0.7) {
      newInsights.push({
        type: "language",
        message: `Most of your searches are in ${dominantLanguage[0]}`,
        impact: "low"
      })
    }

    setInsights(newInsights)
  }

  // Calculate personalization score for a creator
  const calculatePersonalizationScore = React.useCallback((
    creator: EnhancedCreator,
    profile: UserProfile,
    weights: PersonalizationWeights = DEFAULT_WEIGHTS
  ): number => {
    let score = 0

    // Category affinity
    const categoryScore = profile.preferences.categories[creator.category.toLowerCase()] || 0
    score += categoryScore * weights.categoryAffinity

    // Price preference
    const priceInRange = creator.price >= profile.preferences.priceRange.min &&
                        creator.price <= profile.preferences.priceRange.max
    score += (priceInRange ? 1 : 0) * weights.pricePreference

    // Language match
    const hasPreferredLanguage = creator.languages.some(lang =>
      (profile.preferences.languages[lang.toLowerCase()] || 0) > 0.5
    )
    score += (hasPreferredLanguage ? 1 : 0) * weights.languageMatch

    // Historical interaction
    const previouslyViewed = profile.history.viewedCreators.find(vc => vc.id === creator.id)
    if (previouslyViewed) {
      score += Math.min(1, previouslyViewed.count * 0.1) * weights.historicalInteraction
    }

    // Trending boost
    if (creator.trending) {
      score += weights.trendingBoost
    }

    // Availability match
    if (creator.availability === "available") {
      score += weights.availabilityMatch
    }

    return Math.min(1, score)
  }, [])

  // Personalize search results
  const personalizeResults = React.useCallback((
    results: EnhancedCreator[],
    profile: UserProfile
  ): EnhancedCreator[] => {
    if (!profile) return results

    return results.map(creator => ({
      ...creator,
      personalizationScore: calculatePersonalizationScore(creator, profile)
    })).sort((a, b) => {
      const scoreA = (a as any).personalizationScore || 0
      const scoreB = (b as any).personalizationScore || 0
      return scoreB - scoreA
    })
  }, [calculatePersonalizationScore])

  // Track creator interaction
  const trackInteraction = React.useCallback((
    creatorId: string,
    interactionType: "view" | "click" | "book",
    duration?: number
  ) => {
    if (!userProfile) return

    const updated = { ...userProfile }

    // Update viewed creators
    const existingView = updated.history.viewedCreators.find(vc => vc.id === creatorId)
    if (existingView) {
      existingView.count++
      existingView.lastViewed = new Date()
    } else {
      updated.history.viewedCreators.push({
        id: creatorId,
        count: 1,
        lastViewed: new Date()
      })
    }

    // Update dwell time
    if (duration) {
      updated.learning.dwellTime[creatorId] = 
        (updated.learning.dwellTime[creatorId] || 0) * 0.7 + duration * 0.3
    }

    // Track bookings
    if (interactionType === "book") {
      updated.history.totalBookings++
      const creator = creators.find(c => c.id === creatorId)
      if (creator) {
        updated.history.bookingHistory.push({
          creatorId,
          date: new Date(),
          price: creator.price
        })
        
        // Update price preferences
        const avgPrice = updated.history.bookingHistory.reduce((sum, b) => sum + b.price, 0) / 
                        updated.history.bookingHistory.length
        updated.preferences.priceRange.average = Math.round(avgPrice)
      }
    }

    updated.lastUpdated = new Date()
    setUserProfile(updated)
    
    if (userId) {
      localStorage.setItem(`user-profile-${userId}`, JSON.stringify(updated))
    }
  }, [userProfile, creators, userId])

  // Calculate overall personalization effectiveness
  React.useEffect(() => {
    if (!userProfile) return

    let score = 0
    let factors = 0

    // Has search history
    if (userProfile.history.totalSearches > 0) {
      score += 0.2
      factors++
    }

    // Has category preferences
    if (Object.keys(userProfile.preferences.categories).length > 0) {
      score += 0.2
      factors++
    }

    // Has language preferences
    if (Object.keys(userProfile.preferences.languages).length > 0) {
      score += 0.2
      factors++
    }

    // Has booking history
    if (userProfile.history.totalBookings > 0) {
      score += 0.2
      factors++
    }

    // Low bounce rate
    if (userProfile.learning.bounceRate < 0.3) {
      score += 0.2
      factors++
    }

    setPersonalizationScore(factors > 0 ? (score / factors) * 100 : 0)
  }, [userProfile])

  // Generate recommendations on profile change
  React.useEffect(() => {
    if (userProfile && creators.length > 0) {
      generateRecommendations()
    }
  }, [userProfile, creators, generateRecommendations])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Personalization Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Personalization Engine
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-600">Effectiveness</p>
                <p className="text-lg font-bold text-purple-600">
                  {personalizationScore.toFixed(0)}%
                </p>
              </div>
              
              <Progress value={personalizationScore} className="w-24" />
            </div>
          </div>
        </CardHeader>
        
        {userProfile && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {userProfile.history.totalSearches}
                </div>
                <p className="text-xs text-gray-600">Total Searches</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userProfile.history.totalBookings}
                </div>
                <p className="text-xs text-gray-600">Bookings</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(userProfile.preferences.categories).length}
                </div>
                <p className="text-xs text-gray-600">Preferences</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {(userProfile.learning.bounceRate * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-gray-600">Bounce Rate</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    {rec.reason}
                  </CardTitle>
                  
                  <Badge variant="secondary" className="text-xs">
                    {(rec.confidence * 100).toFixed(0)}% match
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {rec.creators.map(creator => (
                    <div
                      key={creator.id}
                      className="flex-shrink-0 w-40 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                      onClick={() => trackInteraction(creator.id, "click")}
                    >
                      <div className="aspect-square w-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-2" />
                      <p className="text-sm font-medium truncate">{creator.name}</p>
                      <p className="text-xs text-gray-600">${creator.price}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{creator.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Personalization Insights */}
      {showInsights && insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Personalization Insights
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-2">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-start gap-2 p-2 rounded-lg",
                  insight.impact === "high" && "bg-red-50 dark:bg-red-900/20",
                  insight.impact === "medium" && "bg-yellow-50 dark:bg-yellow-900/20",
                  insight.impact === "low" && "bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs">{insight.message}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}
    </div>
  )
}

// Export personalization utilities
export const PersonalizationUtils = {
  calculatePersonalizationScore: (
    creator: EnhancedCreator,
    profile: UserProfile,
    weights: PersonalizationWeights = DEFAULT_WEIGHTS
  ): number => {
    let score = 0
    
    const categoryScore = profile.preferences.categories[creator.category.toLowerCase()] || 0
    score += categoryScore * weights.categoryAffinity
    
    const priceInRange = creator.price >= profile.preferences.priceRange.min &&
                        creator.price <= profile.preferences.priceRange.max
    score += (priceInRange ? 1 : 0) * weights.pricePreference
    
    return Math.min(1, score)
  },

  personalizeResults: (
    results: EnhancedCreator[],
    profile: UserProfile
  ): EnhancedCreator[] => {
    return results.map(creator => ({
      ...creator,
      personalizationScore: PersonalizationUtils.calculatePersonalizationScore(creator, profile)
    })).sort((a, b) => {
      const scoreA = (a as any).personalizationScore || 0
      const scoreB = (b as any).personalizationScore || 0
      return scoreB - scoreA
    })
  }
}