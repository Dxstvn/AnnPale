"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Clock,
  Users,
  Globe,
  Search,
  ChevronRight,
  Star,
  Sparkles,
  BarChart3,
  Activity,
  Hash,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  MessageSquare,
  Calendar,
  DollarSign,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"

// Trending search item
export interface TrendingSearch {
  id: string
  query: string
  category?: string
  count: number
  trend: "up" | "down" | "stable"
  trendPercentage: number
  lastHour: number
  last24Hours: number
  last7Days: number
  relatedSearches: string[]
  popularFilters?: Record<string, any>
  peakTime?: Date
  region?: string
}

// Trending creator
export interface TrendingCreator {
  id: string
  name: string
  category: string
  bookings: number
  views: number
  trend: "up" | "down" | "stable"
  trendPercentage: number
  rating: number
  price: number
}

// Search trend analytics
export interface SearchTrendAnalytics {
  totalSearches: number
  uniqueUsers: number
  averageSearchLength: number
  topCategories: Array<{ name: string; count: number; percentage: number }>
  topLanguages: Array<{ language: string; count: number }>
  peakHours: Array<{ hour: number; count: number }>
  conversionRate: number
}

interface TrendingSearchesProps {
  trendingSearches?: TrendingSearch[]
  trendingCreators?: TrendingCreator[]
  analytics?: SearchTrendAnalytics
  onSearchSelect: (query: string, filters?: Record<string, any>) => void
  onCreatorSelect?: (creatorId: string) => void
  refreshInterval?: number // in milliseconds
  showAnalytics?: boolean
  className?: string
}

// Mock data generator for trending searches
const generateMockTrendingSearches = (): TrendingSearch[] => [
  {
    id: "1",
    query: "comedians for birthday",
    category: "comedians",
    count: 1234,
    trend: "up",
    trendPercentage: 45,
    lastHour: 89,
    last24Hours: 456,
    last7Days: 1234,
    relatedSearches: ["birthday wishes", "funny birthday messages", "surprise birthday"],
    popularFilters: { price: [0, 100], availability: "this-week" }
  },
  {
    id: "2",
    query: "musicians under $50",
    category: "musicians",
    count: 987,
    trend: "up",
    trendPercentage: 23,
    lastHour: 67,
    last24Hours: 321,
    last7Days: 987,
    relatedSearches: ["cheap musicians", "budget performers", "affordable music"],
    popularFilters: { price: [0, 50], languages: ["kreyol"] }
  },
  {
    id: "3",
    query: "konpa artists",
    category: "musicians",
    count: 856,
    trend: "stable",
    trendPercentage: 2,
    lastHour: 45,
    last24Hours: 234,
    last7Days: 856,
    relatedSearches: ["haitian music", "kompa bands", "caribbean music"],
    popularFilters: { languages: ["kreyol", "french"] }
  },
  {
    id: "4",
    query: "wedding singers",
    category: "singers",
    count: 734,
    trend: "down",
    trendPercentage: -12,
    lastHour: 34,
    last24Hours: 189,
    last7Days: 734,
    relatedSearches: ["wedding music", "ceremony singers", "reception entertainment"],
    popularFilters: { responseTime: ["24hr", "2days"] }
  },
  {
    id: "5",
    query: "motivational speakers",
    category: "speakers",
    count: 623,
    trend: "up",
    trendPercentage: 67,
    lastHour: 56,
    last24Hours: 234,
    last7Days: 623,
    relatedSearches: ["life coach", "inspirational messages", "business motivation"],
    popularFilters: { verified: true, rating: 4.5 }
  }
]

// Mock trending creators
const generateMockTrendingCreators = (): TrendingCreator[] => [
  {
    id: "c1",
    name: "Jean-Michel Comedy",
    category: "comedians",
    bookings: 45,
    views: 1234,
    trend: "up",
    trendPercentage: 120,
    rating: 4.9,
    price: 75
  },
  {
    id: "c2",
    name: "Marie Chantal",
    category: "singers",
    bookings: 38,
    views: 987,
    trend: "up",
    trendPercentage: 85,
    rating: 4.8,
    price: 100
  },
  {
    id: "c3",
    name: "DJ Kreyol Mix",
    category: "djs",
    bookings: 32,
    views: 856,
    trend: "stable",
    trendPercentage: 5,
    rating: 4.7,
    price: 150
  }
]

export function TrendingSearches({
  trendingSearches = generateMockTrendingSearches(),
  trendingCreators = generateMockTrendingCreators(),
  analytics,
  onSearchSelect,
  onCreatorSelect,
  refreshInterval = 60000, // 1 minute
  showAnalytics = false,
  className
}: TrendingSearchesProps) {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<"1h" | "24h" | "7d">("24h")
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [lastUpdated, setLastUpdated] = React.useState(new Date())

  // Auto-refresh trending data
  React.useEffect(() => {
    if (refreshInterval <= 0) return

    const interval = setInterval(() => {
      setIsRefreshing(true)
      // Simulate refresh
      setTimeout(() => {
        setIsRefreshing(false)
        setLastUpdated(new Date())
      }, 1000)
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])

  // Get trend icon
  const getTrendIcon = (trend: "up" | "down" | "stable", percentage: number) => {
    if (trend === "up") {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUp className="h-3 w-3" />
          <span className="text-xs ml-1">+{percentage}%</span>
        </div>
      )
    } else if (trend === "down") {
      return (
        <div className="flex items-center text-red-600">
          <ArrowDown className="h-3 w-3" />
          <span className="text-xs ml-1">{percentage}%</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center text-gray-500">
          <Minus className="h-3 w-3" />
          <span className="text-xs ml-1">{percentage}%</span>
        </div>
      )
    }
  }

  // Get count by timeframe
  const getCountByTimeframe = (search: TrendingSearch) => {
    switch (selectedTimeframe) {
      case "1h": return search.lastHour
      case "24h": return search.last24Hours
      case "7d": return search.last7Days
      default: return search.count
    }
  }

  // Sort searches by timeframe
  const sortedSearches = React.useMemo(() => {
    return [...trendingSearches].sort((a, b) => {
      return getCountByTimeframe(b) - getCountByTimeframe(a)
    })
  }, [trendingSearches, selectedTimeframe])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Trending Now
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500">
                Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
              </div>
              
              {isRefreshing && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              )}
              
              <Badge variant="secondary" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Trending Tabs */}
      <Tabs defaultValue="searches" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="searches">
            <Search className="h-4 w-4 mr-2" />
            Searches
          </TabsTrigger>
          <TabsTrigger value="creators">
            <Users className="h-4 w-4 mr-2" />
            Creators
          </TabsTrigger>
          <TabsTrigger value="insights">
            <BarChart3 className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Trending Searches */}
        <TabsContent value="searches" className="space-y-4">
          {/* Timeframe selector */}
          <div className="flex items-center gap-2">
            <Button
              variant={selectedTimeframe === "1h" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe("1h")}
            >
              Last Hour
            </Button>
            <Button
              variant={selectedTimeframe === "24h" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe("24h")}
            >
              24 Hours
            </Button>
            <Button
              variant={selectedTimeframe === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe("7d")}
            >
              7 Days
            </Button>
          </div>

          {/* Search list */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="divide-y">
                  {sortedSearches.map((search, index) => (
                    <motion.div
                      key={search.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer group"
                      onClick={() => onSearchSelect(search.query, search.popularFilters)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 font-bold text-sm">
                              {index + 1}
                            </div>
                            
                            <div className="flex-1">
                              <p className="font-medium group-hover:text-purple-600 transition-colors">
                                {search.query}
                              </p>
                              
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-500">
                                  {getCountByTimeframe(search)} searches
                                </span>
                                
                                {search.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {search.category}
                                  </Badge>
                                )}
                                
                                {getTrendIcon(search.trend, search.trendPercentage)}
                              </div>
                              
                              {search.relatedSearches.length > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs text-gray-500">Related:</span>
                                  <div className="flex gap-1">
                                    {search.relatedSearches.slice(0, 3).map((related, idx) => (
                                      <Badge 
                                        key={idx} 
                                        variant="secondary" 
                                        className="text-xs cursor-pointer hover:bg-purple-100"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          onSearchSelect(related)
                                        }}
                                      >
                                        {related}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trending Creators */}
        <TabsContent value="creators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                Hot Creators This Week
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {trendingCreators.map((creator, index) => (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                    onClick={() => onCreatorSelect?.(creator.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold">
                        {index + 1}
                      </div>
                      
                      <div>
                        <p className="font-medium">{creator.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            {creator.category}
                          </Badge>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span>{creator.rating}</span>
                          </div>
                          <span>•</span>
                          <span>${creator.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(creator.trend, creator.trendPercentage)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {creator.bookings} bookings
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-4">
          {analytics ? (
            <>
              {/* Overview stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analytics.totalSearches.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Total Searches</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.uniqueUsers.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Unique Users</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.averageSearchLength.toFixed(1)}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Avg Search Length</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {(analytics.conversionRate * 100).toFixed(1)}%
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Conversion Rate</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Top Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.topCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={category.percentage} className="w-24 h-2" />
                          <span className="text-xs text-gray-500 w-12 text-right">
                            {category.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Search Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {analytics.topLanguages.map((lang, index) => (
                      <Badge key={index} variant="secondary">
                        {lang.language}: {lang.count}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Analytics data not available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Hook for managing trending data
export function useTrendingSearches() {
  const [trending, setTrending] = React.useState<TrendingSearch[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const fetchTrending = React.useCallback(async () => {
    setIsLoading(true)
    // In production, this would fetch from an API
    setTimeout(() => {
      setTrending(generateMockTrendingSearches())
      setIsLoading(false)
    }, 1000)
  }, [])

  React.useEffect(() => {
    fetchTrending()
  }, [fetchTrending])

  return {
    trending,
    isLoading,
    refresh: fetchTrending
  }
}