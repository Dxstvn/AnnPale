"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Search,
  Target,
  Zap,
  Activity,
  Settings,
  Download,
  RefreshCw,
  Bell,
  BellOff,
  Play,
  Pause,
  Eye,
  Users,
  Clock,
  Star,
  Globe,
  Layers,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Filter,
  MousePointer,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Database
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { SearchQuery, SearchPattern, SearchIntent, SearchLanguage } from "./search-intent-engine"

// Search analytics data types
export interface SearchAnalytics {
  totalSearches: number
  uniqueUsers: number
  averageSessionLength: number
  searchSuccessRate: number
  patternDistribution: Record<SearchPattern, number>
  languageDistribution: Record<SearchLanguage, number>
  intentAccuracy: Record<SearchIntent, number>
  userSatisfactionScore: number
  topQueries: Array<{
    query: string
    count: number
    successRate: number
    avgResponseTime: number
  }>
  commonFailures: Array<{
    query: string
    failureReason: string
    count: number
    suggestions: string[]
  }>
  learningMetrics: {
    modelAccuracy: number
    confidenceScore: number
    improvementRate: number
    trainingExamples: number
  }
  performanceMetrics: {
    averageResponseTime: number
    cacheHitRate: number
    errorRate: number
    throughput: number
  }
  userBehaviorInsights: {
    refinementRate: number
    abandonmentRate: number
    clickThroughRate: number
    conversionRate: number
  }
}

export interface LearningEvent {
  id: string
  timestamp: number
  eventType: "pattern_detection" | "intent_classification" | "language_detection" | "user_feedback"
  originalQuery: string
  predictedValues: any
  actualValues: any
  confidence: number
  feedback?: "positive" | "negative" | "neutral"
  improvementAction?: string
}

export interface SearchOptimization {
  category: "performance" | "accuracy" | "user_experience" | "language_support"
  issue: string
  recommendation: string
  expectedImpact: number
  implementationEffort: "low" | "medium" | "high"
  priority: "critical" | "high" | "medium" | "low"
  status: "pending" | "in_progress" | "completed"
}

interface SearchAnalyticsLearningProps {
  onLearningUpdate?: (analytics: SearchAnalytics) => void
  onOptimizationGenerated?: (optimizations: SearchOptimization[]) => void
  enableRealTimeLearning?: boolean
  enableUserFeedback?: boolean
  className?: string
}

// Sample analytics data
const INITIAL_ANALYTICS: SearchAnalytics = {
  totalSearches: 12847,
  uniqueUsers: 3291,
  averageSessionLength: 4.2,
  searchSuccessRate: 73.8,
  patternDistribution: {
    exploratory: 38.2,
    known_item: 24.7,
    descriptive: 18.9,
    transactional: 12.4,
    informational: 4.2,
    navigational: 1.6
  },
  languageDistribution: {
    english: 52.3,
    french: 28.1,
    kreyol: 15.7,
    mixed: 3.2,
    unknown: 0.7
  },
  intentAccuracy: {
    high: 89.3,
    medium: 76.8,
    low: 64.2,
    discovery: 81.5
  },
  userSatisfactionScore: 4.2,
  topQueries: [
    { query: "Haitian comedians", count: 324, successRate: 87.2, avgResponseTime: 1.2 },
    { query: "Wyclef Jean", count: 298, successRate: 95.6, avgResponseTime: 0.8 },
    { query: "musicians under $100", count: 267, successRate: 79.4, avgResponseTime: 1.8 },
    { query: "birthday message", count: 234, successRate: 82.1, avgResponseTime: 1.5 },
    { query: "Ti Jo Zenny", count: 198, successRate: 93.4, avgResponseTime: 0.9 }
  ],
  commonFailures: [
    {
      query: "cheap videos",
      failureReason: "Ambiguous intent",
      count: 89,
      suggestions: ["Add specific price range", "Specify creator type", "Use clearer language"]
    },
    {
      query: "best",
      failureReason: "Too vague",
      count: 76,
      suggestions: ["Add category (best musicians)", "Specify criteria", "Browse categories instead"]
    },
    {
      query: "urgent message today",
      failureReason: "No available creators",
      count: 54,
      suggestions: ["Show next available", "Suggest alternatives", "Offer expedited options"]
    }
  ],
  learningMetrics: {
    modelAccuracy: 84.7,
    confidenceScore: 0.81,
    improvementRate: 2.3,
    trainingExamples: 45627
  },
  performanceMetrics: {
    averageResponseTime: 1.4,
    cacheHitRate: 67.8,
    errorRate: 2.1,
    throughput: 156.7
  },
  userBehaviorInsights: {
    refinementRate: 34.2,
    abandonmentRate: 18.7,
    clickThroughRate: 72.3,
    conversionRate: 12.8
  }
}

export function SearchAnalyticsLearning({
  onLearningUpdate,
  onOptimizationGenerated,
  enableRealTimeLearning = true,
  enableUserFeedback = true,
  className
}: SearchAnalyticsLearningProps) {
  const [analytics, setAnalytics] = React.useState<SearchAnalytics>(INITIAL_ANALYTICS)
  const [learningEvents, setLearningEvents] = React.useState<LearningEvent[]>([])
  const [optimizations, setOptimizations] = React.useState<SearchOptimization[]>([])
  const [isLearningActive, setIsLearningActive] = React.useState(enableRealTimeLearning)
  const [selectedTimeRange, setSelectedTimeRange] = React.useState("24h")
  const [showAdvancedMetrics, setShowAdvancedMetrics] = React.useState(false)
  const [alertsEnabled, setAlertsEnabled] = React.useState(true)

  // Generate optimizations based on analytics
  const generateOptimizations = React.useCallback((): SearchOptimization[] => {
    const newOptimizations: SearchOptimization[] = []

    // Check success rate
    if (analytics.searchSuccessRate < 75) {
      newOptimizations.push({
        category: "accuracy",
        issue: `Search success rate is ${analytics.searchSuccessRate.toFixed(1)}% (target: >75%)`,
        recommendation: "Improve intent classification and add more training data for common failure patterns",
        expectedImpact: 8.5,
        implementationEffort: "medium",
        priority: "high",
        status: "pending"
      })
    }

    // Check response time
    if (analytics.performanceMetrics.averageResponseTime > 2.0) {
      newOptimizations.push({
        category: "performance",
        issue: `Average response time is ${analytics.performanceMetrics.averageResponseTime.toFixed(1)}s (target: <2s)`,
        recommendation: "Implement query caching and optimize database indexing",
        expectedImpact: 15.2,
        implementationEffort: "medium",
        priority: "high",
        status: "pending"
      })
    }

    // Check abandonment rate
    if (analytics.userBehaviorInsights.abandonmentRate > 20) {
      newOptimizations.push({
        category: "user_experience",
        issue: `User abandonment rate is ${analytics.userBehaviorInsights.abandonmentRate.toFixed(1)}% (target: <20%)`,
        recommendation: "Add progressive search assistance and better onboarding for new users",
        expectedImpact: 12.3,
        implementationEffort: "high",
        priority: "medium",
        status: "pending"
      })
    }

    // Check language support
    if (analytics.languageDistribution.unknown > 5) {
      newOptimizations.push({
        category: "language_support",
        issue: `${analytics.languageDistribution.unknown.toFixed(1)}% of queries have unknown language`,
        recommendation: "Expand language detection patterns and add more cultural context",
        expectedImpact: 6.7,
        implementationEffort: "low",
        priority: "medium",
        status: "pending"
      })
    }

    // Check model accuracy
    if (analytics.learningMetrics.modelAccuracy < 85) {
      newOptimizations.push({
        category: "accuracy",
        issue: `ML model accuracy is ${analytics.learningMetrics.modelAccuracy.toFixed(1)}% (target: >85%)`,
        recommendation: "Retrain models with recent user feedback and add more diverse training examples",
        expectedImpact: 9.8,
        implementationEffort: "medium",
        priority: "critical",
        status: "pending"
      })
    }

    return newOptimizations
  }, [analytics])

  // Update optimizations when analytics change
  React.useEffect(() => {
    const newOptimizations = generateOptimizations()
    setOptimizations(newOptimizations)
    onOptimizationGenerated?.(newOptimizations)
  }, [analytics, generateOptimizations, onOptimizationGenerated])

  // Simulate real-time learning updates
  React.useEffect(() => {
    if (!isLearningActive) return

    const interval = setInterval(() => {
      setAnalytics(prev => {
        const updated = {
          ...prev,
          totalSearches: prev.totalSearches + Math.floor(Math.random() * 5) + 1,
          searchSuccessRate: Math.min(95, prev.searchSuccessRate + (Math.random() - 0.5) * 0.5),
          learningMetrics: {
            ...prev.learningMetrics,
            modelAccuracy: Math.min(95, prev.learningMetrics.modelAccuracy + (Math.random() - 0.3) * 0.2),
            trainingExamples: prev.learningMetrics.trainingExamples + Math.floor(Math.random() * 10) + 1
          },
          performanceMetrics: {
            ...prev.performanceMetrics,
            averageResponseTime: Math.max(0.5, prev.performanceMetrics.averageResponseTime + (Math.random() - 0.5) * 0.1)
          }
        }
        
        onLearningUpdate?.(updated)
        return updated
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [isLearningActive, onLearningUpdate])

  // Add learning event
  const addLearningEvent = React.useCallback((event: Omit<LearningEvent, "id" | "timestamp">) => {
    const newEvent: LearningEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    }

    setLearningEvents(prev => [newEvent, ...prev.slice(0, 99)])

    // Update analytics based on event
    if (event.eventType === "user_feedback" && event.feedback) {
      setAnalytics(prev => ({
        ...prev,
        userSatisfactionScore: event.feedback === "positive" 
          ? Math.min(5, prev.userSatisfactionScore + 0.01)
          : Math.max(1, prev.userSatisfactionScore - 0.01)
      }))
    }
  }, [])

  // Export analytics data
  const exportAnalytics = () => {
    const data = {
      timestamp: new Date().toISOString(),
      timeRange: selectedTimeRange,
      analytics,
      learningEvents: learningEvents.slice(0, 100),
      optimizations,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `search-analytics-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("Analytics data exported successfully")
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-600" />
              Search Analytics & Learning
              {isLearningActive && (
                <Badge variant="default" className="animate-pulse">
                  Learning Active
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-3">
              {/* Learning Toggle */}
              <div className="flex items-center gap-2">
                <Label htmlFor="learning-active" className="text-sm">AI Learning</Label>
                <Switch
                  id="learning-active"
                  checked={isLearningActive}
                  onCheckedChange={setIsLearningActive}
                />
              </div>
              
              {/* Alerts Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAlertsEnabled(!alertsEnabled)}
              >
                {alertsEnabled ? (
                  <Bell className="h-4 w-4 text-blue-500" />
                ) : (
                  <BellOff className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              
              {/* Time Range */}
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1h</SelectItem>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="7d">7d</SelectItem>
                  <SelectItem value="30d">30d</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Export */}
              <Button variant="outline" size="icon" onClick={exportAnalytics}>
                <Download className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analytics.totalSearches.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Searches</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +2.3% vs yesterday
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {analytics.searchSuccessRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-xs text-gray-500 mt-1">
              Target: &gt;75%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.learningMetrics.modelAccuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Model Accuracy</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
              <ArrowUp className="h-3 w-3 text-green-500" />
              +{analytics.learningMetrics.improvementRate.toFixed(1)}% this week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analytics.performanceMetrics.averageResponseTime.toFixed(1)}s
            </div>
            <div className="text-sm text-gray-600">Avg Response</div>
            <div className="text-xs text-gray-500 mt-1">
              Target: &lt;2s
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="patterns" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="patterns">Search Patterns</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pattern Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(analytics.patternDistribution).map(([pattern, percentage]) => (
                  <div key={pattern} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{pattern.replace("_", " ")}</span>
                      <span className="font-medium">{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Intent Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(analytics.intentAccuracy).map(([intent, accuracy]) => (
                  <div key={intent} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{intent}</span>
                      <span className={cn(
                        "font-medium",
                        accuracy >= 85 ? "text-green-600" :
                        accuracy >= 70 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {accuracy.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={accuracy} 
                      className={cn(
                        "h-2",
                        accuracy >= 85 ? "[&>div]:bg-green-500" :
                        accuracy >= 70 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Performing Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topQueries.map((query, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">"{query.query}"</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {query.count} searches • {query.avgResponseTime.toFixed(1)}s avg response
                      </div>
                    </div>
                    <Badge variant={query.successRate >= 85 ? "default" : "secondary"}>
                      {query.successRate.toFixed(1)}% success
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="languages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Language Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(analytics.languageDistribution).map(([lang, percentage]) => (
                  <div key={lang} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span className="capitalize">{lang}</span>
                      </div>
                      <span className="font-medium">{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common Failures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.commonFailures.map((failure, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">"{failure.query}"</span>
                      <Badge variant="destructive" className="text-xs">
                        {failure.count} failures
                      </Badge>
                    </div>
                    <p className="text-xs text-red-600 mb-2">{failure.failureReason}</p>
                    <div className="space-y-1">
                      {failure.suggestions.slice(0, 2).map((suggestion, i) => (
                        <p key={i} className="text-xs text-gray-600 flex items-center gap-1">
                          <Lightbulb className="h-3 w-3" />
                          {suggestion}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-blue-600">
                  {analytics.performanceMetrics.averageResponseTime.toFixed(2)}s
                </div>
                <div className="text-sm text-gray-600">Response Time</div>
                <div className="text-xs text-gray-500 mt-1">
                  Target: &lt;2s
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-green-600">
                  {analytics.performanceMetrics.cacheHitRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Cache Hit Rate</div>
                <div className="text-xs text-gray-500 mt-1">
                  Target: &gt;60%
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-red-600">
                  {analytics.performanceMetrics.errorRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Error Rate</div>
                <div className="text-xs text-gray-500 mt-1">
                  Target: &lt;5%
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-purple-600">
                  {analytics.performanceMetrics.throughput.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Queries/min</div>
                <div className="text-xs text-gray-500 mt-1">
                  Peak capacity
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Behavior Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Engagement Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Click-through Rate:</span>
                      <span className="font-medium">{analytics.userBehaviorInsights.clickThroughRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion Rate:</span>
                      <span className="font-medium">{analytics.userBehaviorInsights.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Refinement Rate:</span>
                      <span className="font-medium">{analytics.userBehaviorInsights.refinementRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Abandonment Rate:</span>
                      <span className={cn(
                        "font-medium",
                        analytics.userBehaviorInsights.abandonmentRate > 20 ? "text-red-600" : "text-green-600"
                      )}>
                        {analytics.userBehaviorInsights.abandonmentRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Quality Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">User Satisfaction:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{analytics.userSatisfactionScore.toFixed(1)}/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Session Length:</span>
                      <span className="font-medium">{analytics.averageSessionLength.toFixed(1)} searches</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Unique Users:</span>
                      <span className="font-medium">{analytics.uniqueUsers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="learning" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-green-600">
                  {analytics.learningMetrics.modelAccuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Model Accuracy</div>
                <div className="text-xs text-gray-500 mt-1">
                  Target: &gt;85%
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-blue-600">
                  {(analytics.learningMetrics.confidenceScore * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Confidence Score</div>
                <div className="text-xs text-gray-500 mt-1">
                  Average prediction confidence
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-purple-600">
                  {analytics.learningMetrics.trainingExamples.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Training Examples</div>
                <div className="text-xs text-gray-500 mt-1">
                  Total data points
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Learning Events</CardTitle>
            </CardHeader>
            <CardContent>
              {learningEvents.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {learningEvents.slice(0, 10).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          event.eventType === "pattern_detection" && "bg-blue-500",
                          event.eventType === "intent_classification" && "bg-green-500",
                          event.eventType === "language_detection" && "bg-yellow-500",
                          event.eventType === "user_feedback" && "bg-purple-500"
                        )} />
                        <span className="font-medium">{event.eventType.replace("_", " ")}</span>
                        <span className="text-gray-500">"{event.originalQuery.slice(0, 30)}..."</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{(event.confidence * 100).toFixed(0)}%</span>
                        {event.feedback && (
                          event.feedback === "positive" ? (
                            <ThumbsUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <ThumbsDown className="h-3 w-3 text-red-500" />
                          )
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No learning events recorded yet</p>
                  <p className="text-xs">Events will appear as the system learns from user interactions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimizations" className="space-y-4">
          <div className="space-y-4">
            {optimizations.map((opt, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      opt.priority === "critical" ? "bg-red-100 dark:bg-red-900/30" :
                      opt.priority === "high" ? "bg-orange-100 dark:bg-orange-900/30" :
                      opt.priority === "medium" ? "bg-yellow-100 dark:bg-yellow-900/30" :
                      "bg-green-100 dark:bg-green-900/30"
                    )}>
                      {opt.priority === "critical" ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : opt.priority === "high" ? (
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                      ) : opt.priority === "medium" ? (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <Lightbulb className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium capitalize">{opt.category.replace("_", " ")} Optimization</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            opt.priority === "critical" ? "destructive" :
                            opt.priority === "high" ? "secondary" :
                            opt.priority === "medium" ? "outline" : "default"
                          }>
                            {opt.priority}
                          </Badge>
                          <Badge variant="outline">
                            +{opt.expectedImpact.toFixed(1)}% impact
                          </Badge>
                          <Badge variant="outline">
                            {opt.implementationEffort} effort
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-red-600 mb-2">
                        <span className="font-medium">Issue:</span> {opt.issue}
                      </p>
                      
                      <p className="text-sm text-green-600 mb-2">
                        <span className="font-medium">Recommendation:</span> {opt.recommendation}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Expected impact: +{opt.expectedImpact.toFixed(1)}% improvement
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            Implement
                          </Button>
                        </div>
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

// Hook for search analytics tracking
export function useSearchAnalytics() {
  const [analytics, setAnalytics] = React.useState<SearchAnalytics>(INITIAL_ANALYTICS)
  const [isTracking, setIsTracking] = React.useState(true)

  const trackSearchEvent = React.useCallback((event: {
    query: string
    pattern: SearchPattern
    intent: SearchIntent
    language: SearchLanguage
    success: boolean
    responseTime: number
  }) => {
    if (!isTracking) return

    setAnalytics(prev => ({
      ...prev,
      totalSearches: prev.totalSearches + 1,
      searchSuccessRate: (prev.searchSuccessRate * 0.99) + (event.success ? 0.01 : 0),
      patternDistribution: {
        ...prev.patternDistribution,
        [event.pattern]: prev.patternDistribution[event.pattern] + 1
      },
      languageDistribution: {
        ...prev.languageDistribution,
        [event.language]: prev.languageDistribution[event.language] + 1
      },
      performanceMetrics: {
        ...prev.performanceMetrics,
        averageResponseTime: (prev.performanceMetrics.averageResponseTime * 0.95) + (event.responseTime * 0.05)
      }
    }))
  }, [isTracking])

  return {
    analytics,
    isTracking,
    setIsTracking,
    trackSearchEvent
  }
}