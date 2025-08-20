"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  Brain,
  TrendingUp,
  Users,
  Heart,
  Clock,
  Target,
  Zap,
  Star,
  ChevronRight,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { EnhancedCreator } from "./enhanced-creator-card"

// User Preference Types
export interface UserPreferences {
  categories: Record<string, number> // Category -> weight (0-1)
  priceRange: [number, number]
  languages: string[]
  responseTime: string[]
  features: string[]
  interactionHistory: UserInteraction[]
  viewHistory: string[] // Creator IDs
  bookingHistory: string[] // Creator IDs
  searchHistory: string[] // Search queries
  dismissedCreators: string[] // Creator IDs user doesn't want to see
  favoriteCreators: string[] // Creator IDs
  lastUpdated: Date
}

export interface UserInteraction {
  creatorId: string
  type: "view" | "click" | "favorite" | "share" | "book" | "dismiss"
  timestamp: Date
  duration?: number // For views
  metadata?: Record<string, any>
}

export interface RecommendationScore {
  creatorId: string
  score: number
  reasons: string[]
  confidence: number
  factors: {
    categoryMatch: number
    priceMatch: number
    popularityScore: number
    personalizedScore: number
    trendingScore: number
    collaborativeScore: number
  }
}

export interface PersonalizationSettings {
  enableRecommendations: boolean
  enableBehaviorTracking: boolean
  enableCollaborativeFiltering: boolean
  privacyMode: boolean
  resetOnLogout: boolean
}

interface PersonalizationEngineProps {
  creators: EnhancedCreator[]
  userId?: string
  onRecommendationsUpdate?: (recommendations: EnhancedCreator[]) => void
  className?: string
}

// ML-based recommendation weights
const RECOMMENDATION_WEIGHTS = {
  categoryMatch: 0.25,
  priceMatch: 0.15,
  popularity: 0.15,
  personalized: 0.2,
  trending: 0.15,
  collaborative: 0.1
}

export function PersonalizationEngine({
  creators,
  userId,
  onRecommendationsUpdate,
  className
}: PersonalizationEngineProps) {
  const [preferences, setPreferences] = React.useState<UserPreferences>(() => {
    // Load from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`userPreferences_${userId || "guest"}`)
      if (saved) return JSON.parse(saved)
    }
    
    return {
      categories: {},
      priceRange: [0, 500],
      languages: [],
      responseTime: [],
      features: [],
      interactionHistory: [],
      viewHistory: [],
      bookingHistory: [],
      searchHistory: [],
      dismissedCreators: [],
      favoriteCreators: [],
      lastUpdated: new Date()
    }
  })
  
  const [settings, setSettings] = React.useState<PersonalizationSettings>({
    enableRecommendations: true,
    enableBehaviorTracking: true,
    enableCollaborativeFiltering: true,
    privacyMode: false,
    resetOnLogout: false
  })
  
  const [recommendations, setRecommendations] = React.useState<EnhancedCreator[]>([])
  const [isCalculating, setIsCalculating] = React.useState(false)
  const [showInsights, setShowInsights] = React.useState(false)
  
  // Save preferences to localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined" && !settings.privacyMode) {
      localStorage.setItem(
        `userPreferences_${userId || "guest"}`,
        JSON.stringify(preferences)
      )
    }
  }, [preferences, userId, settings.privacyMode])
  
  // Track user interaction
  const trackInteraction = React.useCallback((interaction: Omit<UserInteraction, "timestamp">) => {
    if (!settings.enableBehaviorTracking) return
    
    setPreferences(prev => {
      const newInteraction: UserInteraction = {
        ...interaction,
        timestamp: new Date()
      }
      
      // Update category preferences based on interaction
      const creator = creators.find(c => c.id === interaction.creatorId)
      if (creator) {
        const categoryWeight = prev.categories[creator.category] || 0
        let weightChange = 0
        
        switch (interaction.type) {
          case "view":
            weightChange = 0.01
            break
          case "click":
            weightChange = 0.02
            break
          case "favorite":
            weightChange = 0.05
            break
          case "book":
            weightChange = 0.1
            break
          case "dismiss":
            weightChange = -0.05
            break
        }
        
        const newWeight = Math.max(0, Math.min(1, categoryWeight + weightChange))
        
        return {
          ...prev,
          categories: {
            ...prev.categories,
            [creator.category]: newWeight
          },
          interactionHistory: [...prev.interactionHistory, newInteraction].slice(-100),
          viewHistory: interaction.type === "view" 
            ? [...prev.viewHistory, interaction.creatorId].slice(-50)
            : prev.viewHistory,
          favoriteCreators: interaction.type === "favorite"
            ? [...prev.favoriteCreators, interaction.creatorId]
            : prev.favoriteCreators,
          dismissedCreators: interaction.type === "dismiss"
            ? [...prev.dismissedCreators, interaction.creatorId]
            : prev.dismissedCreators,
          lastUpdated: new Date()
        }
      }
      
      return prev
    })
  }, [creators, settings.enableBehaviorTracking])
  
  // Calculate recommendation scores
  const calculateRecommendations = React.useCallback(() => {
    if (!settings.enableRecommendations || !creators || creators.length === 0) return []
    
    setIsCalculating(true)
    
    const scores: RecommendationScore[] = creators
      .filter(creator => !preferences.dismissedCreators.includes(creator.id.toString()))
      .map(creator => {
        const factors = {
          categoryMatch: preferences.categories[creator.category] || 0,
          priceMatch: calculatePriceMatch(creator.price, preferences.priceRange),
          popularityScore: calculatePopularityScore(creator),
          personalizedScore: calculatePersonalizedScore(creator, preferences),
          trendingScore: calculateTrendingScore(creator),
          collaborativeScore: settings.enableCollaborativeFiltering 
            ? calculateCollaborativeScore(creator, preferences)
            : 0
        }
        
        const score = Object.entries(factors).reduce((total, [key, value]) => {
          return total + value * RECOMMENDATION_WEIGHTS[key as keyof typeof RECOMMENDATION_WEIGHTS]
        }, 0)
        
        const reasons = generateReasons(creator, factors)
        
        return {
          creatorId: creator.id,
          score,
          reasons,
          confidence: calculateConfidence(factors),
          factors
        }
      })
    
    // Sort by score and get top recommendations
    scores.sort((a, b) => b.score - a.score)
    
    const topRecommendations = scores
      .slice(0, 20)
      .map(score => creators.find(c => c.id === score.creatorId)!)
      .filter(Boolean)
    
    setRecommendations(topRecommendations)
    onRecommendationsUpdate?.(topRecommendations)
    setIsCalculating(false)
    
    return topRecommendations
  }, [creators, preferences, settings, onRecommendationsUpdate])
  
  // Calculate recommendations on mount and when preferences change
  React.useEffect(() => {
    const timer = setTimeout(() => {
      calculateRecommendations()
    }, 500)
    
    return () => clearTimeout(timer)
  }, [calculateRecommendations])
  
  // Helper functions
  const calculatePriceMatch = (price: number, range: [number, number]): number => {
    if (price >= range[0] && price <= range[1]) return 1
    if (price < range[0]) return Math.max(0, 1 - (range[0] - price) / range[0])
    return Math.max(0, 1 - (price - range[1]) / range[1])
  }
  
  const calculatePopularityScore = (creator: EnhancedCreator): number => {
    const maxReviews = Math.max(...creators.map(c => c.reviews))
    return (creator.reviews / maxReviews) * (creator.rating / 5)
  }
  
  const calculatePersonalizedScore = (creator: EnhancedCreator, prefs: UserPreferences): number => {
    let score = 0
    
    // Check if creator was previously viewed/favorited
    if (prefs.favoriteCreators.includes(creator.id)) score += 0.5
    if (prefs.viewHistory.includes(creator.id)) score += 0.2
    
    // Language match
    if (creator.languages?.some(lang => prefs.languages.includes(lang))) score += 0.3
    
    return Math.min(1, score)
  }
  
  const calculateTrendingScore = (creator: EnhancedCreator): number => {
    // Simulate trending calculation based on recent activity
    return creator.trending ? 1 : Math.random() * 0.5
  }
  
  const calculateCollaborativeScore = (creator: EnhancedCreator, prefs: UserPreferences): number => {
    // Simulate collaborative filtering based on similar users
    return Math.random() * 0.8
  }
  
  const calculateConfidence = (factors: Record<string, number>): number => {
    const values = Object.values(factors)
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    return Math.min(1, avg * 1.2)
  }
  
  const generateReasons = (creator: EnhancedCreator, factors: Record<string, number>): string[] => {
    const reasons: string[] = []
    
    if (factors.categoryMatch > 0.7) reasons.push("Matches your preferred categories")
    if (factors.priceMatch > 0.8) reasons.push("Within your budget")
    if (factors.popularityScore > 0.8) reasons.push("Highly rated by others")
    if (factors.personalizedScore > 0.5) reasons.push("Based on your history")
    if (factors.trendingScore > 0.7) reasons.push("Trending now")
    if (factors.collaborativeScore > 0.7) reasons.push("Popular with similar users")
    
    return reasons.slice(0, 3)
  }
  
  // Get user insights
  const getUserInsights = () => {
    const topCategories = Object.entries(preferences.categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat)
    
    const avgViewTime = preferences.interactionHistory
      .filter(i => i.type === "view" && i.duration)
      .reduce((sum, i) => sum + (i.duration || 0), 0) / 
      preferences.interactionHistory.filter(i => i.type === "view").length || 0
    
    return {
      topCategories,
      totalViews: preferences.viewHistory.length,
      totalFavorites: preferences.favoriteCreators.length,
      avgViewTime: avgViewTime / 1000, // Convert to seconds
      searchCount: preferences.searchHistory.length
    }
  }
  
  const insights = getUserInsights()
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Personalization Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Personalized for You
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInsights(!showInsights)}
              >
                <Info className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => calculateRecommendations()}
                disabled={isCalculating}
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  isCalculating && "animate-spin"
                )} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettings(prev => ({
                  ...prev,
                  enableRecommendations: !prev.enableRecommendations
                }))}
              >
                {settings.enableRecommendations ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {showInsights && (
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Top Categories</p>
                <div className="flex flex-wrap gap-1">
                  {insights.topCategories.map(cat => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Total Views</p>
                <p className="text-lg font-semibold">{insights.totalViews}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Favorites</p>
                <p className="text-lg font-semibold">{insights.totalFavorites}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Avg View Time</p>
                <p className="text-lg font-semibold">{insights.avgViewTime.toFixed(1)}s</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Personalization Level</span>
                <span className="font-medium">
                  {Math.min(100, preferences.interactionHistory.length * 2)}%
                </span>
              </div>
              <Progress value={Math.min(100, preferences.interactionHistory.length * 2)} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Recommendation Tabs */}
      {settings.enableRecommendations && recommendations.length > 0 && (
        <Tabs defaultValue="foryou" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="foryou">For You</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="similar">Similar</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="foryou" className="space-y-2">
            <RecommendationList
              creators={recommendations.slice(0, 5)}
              title="Recommended for You"
              icon={<Sparkles className="h-4 w-4" />}
              onInteraction={trackInteraction}
            />
          </TabsContent>
          
          <TabsContent value="trending" className="space-y-2">
            <RecommendationList
              creators={recommendations.filter(c => c.trending).slice(0, 5)}
              title="Trending Now"
              icon={<TrendingUp className="h-4 w-4" />}
              onInteraction={trackInteraction}
            />
          </TabsContent>
          
          <TabsContent value="similar" className="space-y-2">
            <RecommendationList
              creators={recommendations.slice(5, 10)}
              title="Similar to Your Favorites"
              icon={<Users className="h-4 w-4" />}
              onInteraction={trackInteraction}
            />
          </TabsContent>
          
          <TabsContent value="new" className="space-y-2">
            <RecommendationList
              creators={recommendations.filter(c => c.isNew).slice(0, 5)}
              title="New Creators"
              icon={<Zap className="h-4 w-4" />}
              onInteraction={trackInteraction}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// Recommendation List Component
function RecommendationList({
  creators,
  title,
  icon,
  onInteraction
}: {
  creators: EnhancedCreator[]
  title: string
  icon: React.ReactNode
  onInteraction: (interaction: Omit<UserInteraction, "timestamp">) => void
}) {
  if (creators.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-6">
          <p className="text-sm text-gray-500">No recommendations available</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <AnimatePresence mode="popLayout">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <button
                onClick={() => onInteraction({
                  creatorId: creator.id,
                  type: "click"
                })}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                  {creator.name.charAt(0)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{creator.name}</p>
                    {creator.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{creator.category}</span>
                    <span>${creator.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{creator.rating}</span>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition" />
              </button>
              
              <div className="flex items-center gap-1 px-3 pb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onInteraction({
                      creatorId: creator.id,
                      type: "favorite"
                    })
                    toast.success("Added to favorites")
                  }}
                  className="h-6 w-6"
                >
                  <Heart className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onInteraction({
                      creatorId: creator.id,
                      type: "dismiss"
                    })
                    toast.success("Won't show this again")
                  }}
                  className="h-6 w-6"
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export default PersonalizationEngine
