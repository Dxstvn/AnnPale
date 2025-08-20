"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
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
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Zap,
  BarChart3,
  PieChart,
  MousePointer,
  Layers,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  Search,
  DollarSign,
  Star,
  Globe,
  Calendar,
  Lightbulb
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { FilterState } from "./filter-sidebar"

// Filter analytics data types
export interface FilterUsageMetric {
  filterId: string
  filterName: string
  filterType: "category" | "price" | "rating" | "location" | "time" | "language" | "feature"
  usageCount: number
  usagePercentage: number
  successRate: number // How often this filter leads to clicks/bookings
  averageResultCount: number
  combinationFrequency: number // How often used with other filters
  abandonmentRate: number // How often users abandon after applying this filter
  timeToApply: number // Average time before users apply this filter
  mostCommonValues: Array<{
    value: string
    count: number
    percentage: number
  }>
}

export interface FilterCombination {
  id: string
  filters: string[]
  frequency: number
  successRate: number
  averageResults: number
  userSatisfaction: number
  recommendedFor: string[]
}

export interface FilterJourney {
  sessionId: string
  filterSequence: Array<{
    filterId: string
    value: any
    timestamp: number
    resultCount: number
    userAction: "applied" | "removed" | "modified"
  }>
  finalAction: "booking" | "abandonment" | "continued_browsing"
  totalTime: number
  satisfactionScore?: number
}

interface FilterAnalyticsProps {
  currentFilters?: FilterState
  onFilterOptimization?: (recommendations: FilterOptimization[]) => void
  className?: string
}

export interface FilterOptimization {
  filterId: string
  issue: string
  suggestion: string
  expectedImpact: number
  effort: "low" | "medium" | "high"
  priority: "high" | "medium" | "low"
}

// Sample filter data
const FILTER_METRICS: FilterUsageMetric[] = [
  {
    filterId: "categories",
    filterName: "Categories",
    filterType: "category",
    usageCount: 1247,
    usagePercentage: 68.2,
    successRate: 72.5,
    averageResultCount: 24,
    combinationFrequency: 89.3,
    abandonmentRate: 12.8,
    timeToApply: 8.5,
    mostCommonValues: [
      { value: "Musicians", count: 523, percentage: 41.9 },
      { value: "Comedians", count: 312, percentage: 25.0 },
      { value: "Singers", count: 287, percentage: 23.0 },
      { value: "Actors", count: 125, percentage: 10.1 }
    ]
  },
  {
    filterId: "priceRange",
    filterName: "Price Range",
    filterType: "price",
    usageCount: 892,
    usagePercentage: 48.7,
    successRate: 65.2,
    averageResultCount: 18,
    combinationFrequency: 76.4,
    abandonmentRate: 18.3,
    timeToApply: 15.2,
    mostCommonValues: [
      { value: "$0-$50", count: 367, percentage: 41.1 },
      { value: "$50-$100", count: 298, percentage: 33.4 },
      { value: "$100-$200", count: 156, percentage: 17.5 },
      { value: "$200+", count: 71, percentage: 8.0 }
    ]
  },
  {
    filterId: "rating",
    filterName: "Rating",
    filterType: "rating",
    usageCount: 654,
    usagePercentage: 35.7,
    successRate: 78.9,
    averageResultCount: 15,
    combinationFrequency: 82.1,
    abandonmentRate: 9.2,
    timeToApply: 22.8,
    mostCommonValues: [
      { value: "4+ stars", count: 423, percentage: 64.7 },
      { value: "4.5+ stars", count: 156, percentage: 23.9 },
      { value: "5 stars", count: 75, percentage: 11.5 }
    ]
  },
  {
    filterId: "responseTime",
    filterName: "Response Time",
    filterType: "time",
    usageCount: 487,
    usagePercentage: 26.6,
    successRate: 58.3,
    averageResultCount: 12,
    combinationFrequency: 67.8,
    abandonmentRate: 25.4,
    timeToApply: 28.3,
    mostCommonValues: [
      { value: "24 hours", count: 234, percentage: 48.1 },
      { value: "2 days", count: 156, percentage: 32.0 },
      { value: "1 week", count: 97, percentage: 19.9 }
    ]
  },
  {
    filterId: "languages",
    filterName: "Languages",
    filterType: "language",
    usageCount: 342,
    usagePercentage: 18.7,
    successRate: 71.4,
    averageResultCount: 9,
    combinationFrequency: 54.2,
    abandonmentRate: 15.7,
    timeToApply: 35.6,
    mostCommonValues: [
      { value: "English", count: 187, percentage: 54.7 },
      { value: "French", count: 89, percentage: 26.0 },
      { value: "Haitian Creole", count: 66, percentage: 19.3 }
    ]
  }
]

const FILTER_COMBINATIONS: FilterCombination[] = [
  {
    id: "cat-price",
    filters: ["Categories", "Price Range"],
    frequency: 456,
    successRate: 74.2,
    averageResults: 18,
    userSatisfaction: 8.3,
    recommendedFor: ["Budget-conscious users", "Category-specific searches"]
  },
  {
    id: "cat-rating",
    filters: ["Categories", "Rating"],
    frequency: 387,
    successRate: 81.5,
    averageResults: 12,
    userSatisfaction: 8.7,
    recommendedFor: ["Quality-focused users", "Premium bookings"]
  },
  {
    id: "price-rating",
    filters: ["Price Range", "Rating"],
    frequency: 298,
    successRate: 69.8,
    averageResults: 8,
    userSatisfaction: 7.9,
    recommendedFor: ["Value seekers", "Careful decision makers"]
  }
]

export function FilterAnalytics({
  currentFilters,
  onFilterOptimization,
  className
}: FilterAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = React.useState<string>("usage")
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(null)
  const [showOptimizations, setShowOptimizations] = React.useState(true)
  
  // Calculate filter optimizations
  const generateOptimizations = React.useCallback((): FilterOptimization[] => {
    return [
      {
        filterId: "responseTime",
        issue: "High abandonment rate (25.4%)",
        suggestion: "Simplify response time options to 3 choices max",
        expectedImpact: 12.3,
        effort: "low",
        priority: "high"
      },
      {
        filterId: "priceRange",
        issue: "Long time to apply (15.2s average)",
        suggestion: "Add price range slider for faster selection",
        expectedImpact: 8.7,
        effort: "medium",
        priority: "medium"
      },
      {
        filterId: "languages",
        issue: "Low usage rate (18.7%)",
        suggestion: "Make language filter more prominent in UI",
        expectedImpact: 15.2,
        effort: "low",
        priority: "medium"
      },
      {
        filterId: "categories",
        issue: "Good performance but could be optimized",
        suggestion: "Add category icons and better visual hierarchy",
        expectedImpact: 5.4,
        effort: "low",
        priority: "low"
      }
    ]
  }, [])
  
  const optimizations = generateOptimizations()
  
  React.useEffect(() => {
    onFilterOptimization?.(optimizations)
  }, [optimizations, onFilterOptimization])
  
  // Calculate overall filter performance
  const overallStats = React.useMemo(() => {
    const totalUsers = 1831 // Total users in period
    const usersUsingFilters = Math.max(...FILTER_METRICS.map(m => m.usageCount))
    const averageFiltersPerUser = FILTER_METRICS.reduce((sum, m) => sum + m.usageCount, 0) / totalUsers
    const averageSuccessRate = FILTER_METRICS.reduce((sum, m) => sum + m.successRate, 0) / FILTER_METRICS.length
    const averageAbandonmentRate = FILTER_METRICS.reduce((sum, m) => sum + m.abandonmentRate, 0) / FILTER_METRICS.length
    
    return {
      filterAdoptionRate: (usersUsingFilters / totalUsers) * 100,
      averageFiltersPerUser,
      averageSuccessRate,
      averageAbandonmentRate,
      totalFilterApplications: FILTER_METRICS.reduce((sum, m) => sum + m.usageCount, 0)
    }
  }, [])
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-600" />
              Filter Usage Analytics
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Target: &gt;60% usage
              </Badge>
              <Badge variant={overallStats.filterAdoptionRate >= 60 ? "default" : "destructive"}>
                {overallStats.filterAdoptionRate.toFixed(1)}% adoption
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {overallStats.filterAdoptionRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Filter Adoption</div>
            <div className="text-xs text-gray-500 mt-1">
              Target: &gt;60%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {overallStats.averageSuccessRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Success Rate</div>
            <div className="text-xs text-gray-500 mt-1">
              Filter → Click/Book
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {overallStats.averageFiltersPerUser.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Filters per User</div>
            <div className="text-xs text-gray-500 mt-1">
              Average session
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {overallStats.averageAbandonmentRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Abandonment Rate</div>
            <div className="text-xs text-gray-500 mt-1">
              After filter apply
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Analytics */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
          <TabsTrigger value="combinations">Combinations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Individual Filter Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {FILTER_METRICS.map((metric) => (
                <motion.div
                  key={metric.filterId}
                  layout
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    selectedFilter === metric.filterId && "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  )}
                  onClick={() => setSelectedFilter(
                    selectedFilter === metric.filterId ? null : metric.filterId
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        metric.filterType === "category" && "bg-blue-100 dark:bg-blue-900/30",
                        metric.filterType === "price" && "bg-green-100 dark:bg-green-900/30",
                        metric.filterType === "rating" && "bg-yellow-100 dark:bg-yellow-900/30",
                        metric.filterType === "time" && "bg-orange-100 dark:bg-orange-900/30",
                        metric.filterType === "language" && "bg-purple-100 dark:bg-purple-900/30"
                      )}>
                        {metric.filterType === "category" && <Layers className="h-4 w-4" />}
                        {metric.filterType === "price" && <DollarSign className="h-4 w-4" />}
                        {metric.filterType === "rating" && <Star className="h-4 w-4" />}
                        {metric.filterType === "time" && <Clock className="h-4 w-4" />}
                        {metric.filterType === "language" && <Globe className="h-4 w-4" />}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">{metric.filterName}</h3>
                        <p className="text-sm text-gray-600">
                          {metric.usageCount.toLocaleString()} uses ({metric.usagePercentage.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className={cn(
                          "font-bold",
                          metric.successRate >= 70 ? "text-green-600" : 
                          metric.successRate >= 50 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {metric.successRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Success</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-bold">{metric.averageResultCount}</div>
                        <div className="text-xs text-gray-500">Avg Results</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-bold">{metric.timeToApply.toFixed(1)}s</div>
                        <div className="text-xs text-gray-500">Time to Apply</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Usage Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Usage Rate</span>
                      <span>Target: 60%</span>
                    </div>
                    <Progress 
                      value={metric.usagePercentage} 
                      className="h-2"
                    />
                  </div>
                  
                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedFilter === metric.filterId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">Most Common Values</h4>
                            <div className="space-y-2">
                              {metric.mostCommonValues.map((value) => (
                                <div key={value.value} className="flex items-center justify-between">
                                  <span className="text-sm">{value.value}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                      <div 
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: `${value.percentage}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium w-12">{value.percentage.toFixed(1)}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm mb-2">Performance Metrics</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Combination Usage:</span>
                                <span className="font-medium">{metric.combinationFrequency.toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Abandonment Rate:</span>
                                <span className={cn(
                                  "font-medium",
                                  metric.abandonmentRate > 20 ? "text-red-600" :
                                  metric.abandonmentRate > 15 ? "text-yellow-600" : "text-green-600"
                                )}>
                                  {metric.abandonmentRate.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Success Rate:</span>
                                <span className={cn(
                                  "font-medium",
                                  metric.successRate >= 70 ? "text-green-600" : 
                                  metric.successRate >= 50 ? "text-yellow-600" : "text-red-600"
                                )}>
                                  {metric.successRate.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="combinations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Filter Combinations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {FILTER_COMBINATIONS.map((combo) => (
                <div key={combo.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {combo.filters.map((filter, index) => (
                          <React.Fragment key={filter}>
                            <Badge variant="outline" className="text-xs">{filter}</Badge>
                            {index < combo.filters.length - 1 && (
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold">{combo.frequency}</div>
                        <div className="text-xs text-gray-500">Uses</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{combo.successRate.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">Success</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{combo.userSatisfaction.toFixed(1)}/10</div>
                        <div className="text-xs text-gray-500">Satisfaction</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Recommended for:</span> {combo.recommendedFor.join(", ")}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Success Rate by Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {FILTER_METRICS
                    .sort((a, b) => b.successRate - a.successRate)
                    .map((metric) => (
                      <div key={metric.filterId} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{metric.filterName}</span>
                          <span className="font-medium">{metric.successRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={metric.successRate} className="h-2" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Abandonment Rate by Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {FILTER_METRICS
                    .sort((a, b) => b.abandonmentRate - a.abandonmentRate)
                    .map((metric) => (
                      <div key={metric.filterId} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{metric.filterName}</span>
                          <span className={cn(
                            "font-medium",
                            metric.abandonmentRate > 20 ? "text-red-600" :
                            metric.abandonmentRate > 15 ? "text-yellow-600" : "text-green-600"
                          )}>
                            {metric.abandonmentRate.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={metric.abandonmentRate} className="h-2" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="optimizations" className="space-y-4">
          <div className="space-y-4">
            {optimizations.map((opt) => (
              <Card key={opt.filterId}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      opt.priority === "high" ? "bg-red-100 dark:bg-red-900/30" :
                      opt.priority === "medium" ? "bg-yellow-100 dark:bg-yellow-900/30" :
                      "bg-green-100 dark:bg-green-900/30"
                    )}>
                      {opt.priority === "high" ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : opt.priority === "medium" ? (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <Lightbulb className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          {FILTER_METRICS.find(m => m.filterId === opt.filterId)?.filterName || opt.filterId}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            opt.priority === "high" ? "destructive" :
                            opt.priority === "medium" ? "secondary" : "outline"
                          }>
                            {opt.priority} priority
                          </Badge>
                          <Badge variant="outline">
                            +{opt.expectedImpact.toFixed(1)}% impact
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-red-600 mb-2">
                        <span className="font-medium">Issue:</span> {opt.issue}
                      </p>
                      
                      <p className="text-sm text-green-600 mb-2">
                        <span className="font-medium">Suggestion:</span> {opt.suggestion}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Effort: {opt.effort}</span>
                        <span>Expected impact: +{opt.expectedImpact.toFixed(1)}% conversion</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Hook for tracking filter usage
export function useFilterAnalytics() {
  const [filterHistory, setFilterHistory] = React.useState<FilterJourney[]>([])
  const [currentSession, setCurrentSession] = React.useState<FilterJourney>({
    sessionId: `session_${Date.now()}`,
    filterSequence: [],
    finalAction: "continued_browsing",
    totalTime: 0
  })
  
  const trackFilterApplication = React.useCallback((
    filterId: string,
    value: any,
    resultCount: number
  ) => {
    setCurrentSession(prev => ({
      ...prev,
      filterSequence: [
        ...prev.filterSequence,
        {
          filterId,
          value,
          timestamp: Date.now(),
          resultCount,
          userAction: "applied"
        }
      ]
    }))
  }, [])
  
  const trackFilterRemoval = React.useCallback((filterId: string) => {
    setCurrentSession(prev => ({
      ...prev,
      filterSequence: [
        ...prev.filterSequence,
        {
          filterId,
          value: null,
          timestamp: Date.now(),
          resultCount: 0,
          userAction: "removed"
        }
      ]
    }))
  }, [])
  
  const completeSession = React.useCallback((
    finalAction: "booking" | "abandonment" | "continued_browsing",
    satisfactionScore?: number
  ) => {
    const completedSession = {
      ...currentSession,
      finalAction,
      totalTime: Date.now() - parseInt(currentSession.sessionId.split("_")[1]),
      satisfactionScore
    }
    
    setFilterHistory(prev => [...prev, completedSession])
    setCurrentSession({
      sessionId: `session_${Date.now()}`,
      filterSequence: [],
      finalAction: "continued_browsing",
      totalTime: 0
    })
  }, [currentSession])
  
  return {
    trackFilterApplication,
    trackFilterRemoval,
    completeSession,
    currentSession,
    filterHistory
  }
}