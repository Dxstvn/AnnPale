"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  MousePointer,
  Eye,
  Search,
  Filter,
  Heart,
  ShoppingCart,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Calendar,
  Map,
  Download,
  RefreshCw,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Behavior Data Types
export interface UserBehaviorMetrics {
  totalUsers: number
  uniqueUsers: number
  sessionsPerUser: number
  averageSessionDuration: number
  bounceRate: number
  conversionRate: number
  topExitPages: Array<{ page: string; exitRate: number }>
  userFlowSteps: Array<{ step: string; dropOffRate: number }>
}

export interface InteractionHeatmap {
  elementType: string
  elementId: string
  clicks: number
  hovers: number
  views: number
  coordinates: Array<{ x: number; y: number; intensity: number }>
}

export interface SearchBehavior {
  totalSearches: number
  uniqueSearchTerms: number
  averageResultsClicked: number
  searchToBookingRate: number
  topSearchTerms: Array<{ term: string; count: number; successRate: number }>
  searchPatterns: Array<{ pattern: string; frequency: number }>
  refinementRate: number
}

export interface FilterUsage {
  totalFilterApplications: number
  averageFiltersPerSession: number
  mostUsedFilters: Array<{ filter: string; usage: number }>
  filterCombinations: Array<{ combination: string[]; frequency: number }>
  filterToResultsRatio: number
  abandonmentAfterFilter: number
}

export interface ConversionFunnel {
  steps: Array<{
    name: string
    users: number
    conversionRate: number
    dropOff: number
    averageTime: number
  }>
  bottlenecks: Array<{
    step: string
    issue: string
    impact: number
    suggestion: string
  }>
}

export interface UserSegment {
  id: string
  name: string
  size: number
  characteristics: string[]
  behavior: {
    averageSessionDuration: number
    pagesPerSession: number
    conversionRate: number
    preferredCategories: string[]
    priceRange: [number, number]
  }
  trends: {
    growth: number
    engagement: number
    satisfaction: number
  }
}

interface BehaviorInsightsProps {
  dateRange?: string
  segment?: string
  isAdmin?: boolean
  className?: string
}

// Sample data for demonstration
const sampleMetrics: UserBehaviorMetrics = {
  totalUsers: 15420,
  uniqueUsers: 12350,
  sessionsPerUser: 2.3,
  averageSessionDuration: 245, // seconds
  bounceRate: 32.5,
  conversionRate: 8.7,
  topExitPages: [
    { page: "/browse", exitRate: 45.2 },
    { page: "/creator/[id]", exitRate: 38.7 },
    { page: "/book/[id]", exitRate: 25.1 }
  ],
  userFlowSteps: [
    { step: "Landing", dropOffRate: 0 },
    { step: "Browse", dropOffRate: 15.2 },
    { step: "Creator View", dropOffRate: 32.8 },
    { step: "Booking Form", dropOffRate: 45.5 },
    { step: "Payment", dropOffRate: 18.3 }
  ]
}

const sampleSegments: UserSegment[] = [
  {
    id: "power-users",
    name: "Power Users",
    size: 12,
    characteristics: ["High engagement", "Multiple bookings", "Early adopters"],
    behavior: {
      averageSessionDuration: 480,
      pagesPerSession: 8.5,
      conversionRate: 25.3,
      preferredCategories: ["Musicians", "Comedians"],
      priceRange: [100, 300]
    },
    trends: {
      growth: 15.2,
      engagement: 23.1,
      satisfaction: 92
    }
  },
  {
    id: "casual-browsers",
    name: "Casual Browsers",
    size: 58,
    characteristics: ["Price-sensitive", "Occasional use", "Social driven"],
    behavior: {
      averageSessionDuration: 125,
      pagesPerSession: 3.2,
      conversionRate: 4.8,
      preferredCategories: ["Singers", "DJs"],
      priceRange: [25, 100]
    },
    trends: {
      growth: 8.7,
      engagement: -2.3,
      satisfaction: 76
    }
  },
  {
    id: "gift-buyers",
    name: "Gift Buyers",
    size: 30,
    characteristics: ["Seasonal activity", "Higher spend", "Quality focused"],
    behavior: {
      averageSessionDuration: 320,
      pagesPerSession: 6.1,
      conversionRate: 18.9,
      preferredCategories: ["Musicians", "Actors"],
      priceRange: [75, 250]
    },
    trends: {
      growth: 22.4,
      engagement: 18.6,
      satisfaction: 88
    }
  }
]

export function BehaviorInsights({
  dateRange = "7d",
  segment = "all",
  isAdmin = false,
  className
}: BehaviorInsightsProps) {
  const [selectedDateRange, setSelectedDateRange] = React.useState(dateRange)
  const [selectedSegment, setSelectedSegment] = React.useState(segment)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [showHeatmap, setShowHeatmap] = React.useState(false)
  
  // Calculate insights
  const insights = React.useMemo(() => {
    return {
      topInsight: "Search engagement increased 23% after implementing AI suggestions",
      criticalIssue: "High drop-off rate (45.5%) at booking form step",
      opportunity: "Gift buyer segment shows 22% growth potential",
      recommendation: "Optimize mobile checkout flow - 68% of drop-offs on mobile"
    }
  }, [selectedDateRange, selectedSegment])
  
  // Export insights data
  const exportInsights = () => {
    const data = {
      metrics: sampleMetrics,
      segments: sampleSegments,
      insights,
      dateRange: selectedDateRange,
      segment: selectedSegment,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `behavior-insights-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("Insights exported successfully")
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Behavior Insights
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last Day</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {sampleSegments.map(segment => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="ghost" size="icon" onClick={exportInsights}>
                <Download className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          title="Top Insight"
          content={insights.topInsight}
          icon={<Lightbulb className="h-5 w-5 text-yellow-500" />}
          type="success"
        />
        <InsightCard
          title="Critical Issue"
          content={insights.criticalIssue}
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          type="error"
        />
        <InsightCard
          title="Opportunity"
          content={insights.opportunity}
          icon={<Target className="h-5 w-5 text-green-500" />}
          type="success"
        />
        <InsightCard
          title="Recommendation"
          content={insights.recommendation}
          icon={<Brain className="h-5 w-5 text-blue-500" />}
          type="info"
        />
      </div>
      
      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="predictions">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <OverviewDashboard metrics={sampleMetrics} />
        </TabsContent>
        
        <TabsContent value="funnel" className="space-y-4">
          <ConversionFunnelAnalysis />
        </TabsContent>
        
        <TabsContent value="segments" className="space-y-4">
          <UserSegmentAnalysis segments={sampleSegments} />
        </TabsContent>
        
        <TabsContent value="heatmap" className="space-y-4">
          <InteractionHeatmapView />
        </TabsContent>
        
        <TabsContent value="predictions" className="space-y-4">
          <AIPredictiveInsights />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Insight Card Component
function InsightCard({
  title,
  content,
  icon,
  type
}: {
  title: string
  content: string
  icon: React.ReactNode
  type: "success" | "error" | "info" | "warning"
}) {
  const colors = {
    success: "border-green-200 bg-green-50 dark:bg-green-900/20",
    error: "border-red-200 bg-red-50 dark:bg-red-900/20",
    info: "border-blue-200 bg-blue-50 dark:bg-blue-900/20",
    warning: "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"
  }
  
  return (
    <Card className={cn("border-l-4", colors[type])}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {icon}
          <div className="space-y-1">
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Overview Dashboard Component
function OverviewDashboard({ metrics }: { metrics: UserBehaviorMetrics }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Key Metrics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Total Users"
              value={metrics.totalUsers.toLocaleString()}
              change={12.5}
              icon={<Users className="h-4 w-4" />}
            />
            <MetricCard
              label="Avg Session Duration"
              value={`${Math.floor(metrics.averageSessionDuration / 60)}m ${metrics.averageSessionDuration % 60}s`}
              change={8.3}
              icon={<Clock className="h-4 w-4" />}
            />
            <MetricCard
              label="Bounce Rate"
              value={`${metrics.bounceRate}%`}
              change={-5.2}
              icon={<TrendingDown className="h-4 w-4" />}
            />
            <MetricCard
              label="Conversion Rate"
              value={`${metrics.conversionRate}%`}
              change={15.7}
              icon={<Target className="h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* User Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">User Flow Drop-offs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.userFlowSteps.map((step, index) => (
              <div key={step.step} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>{step.step}</span>
                  <span className="font-medium">{step.dropOffRate}%</span>
                </div>
                <Progress value={100 - step.dropOffRate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Metric Card Component
function MetricCard({
  label,
  value,
  change,
  icon
}: {
  label: string
  value: string
  change: number
  icon: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <div className={cn(
          "flex items-center gap-1 text-xs",
          change > 0 ? "text-green-600" : "text-red-600"
        )}>
          {change > 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  )
}

// Conversion Funnel Analysis Component
function ConversionFunnelAnalysis() {
  const funnelSteps = [
    { name: "Page Visit", users: 10000, rate: 100 },
    { name: "Browse Creators", users: 8500, rate: 85 },
    { name: "View Creator", users: 5200, rate: 52 },
    { name: "Start Booking", users: 2100, rate: 21 },
    { name: "Complete Payment", users: 870, rate: 8.7 }
  ]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Conversion Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funnelSteps.map((step, index) => {
            const dropOff = index > 0 ? funnelSteps[index - 1].rate - step.rate : 0
            return (
              <div key={step.name} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{step.name}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span>{step.users.toLocaleString()} users</span>
                    <span className="text-gray-500">{step.rate}%</span>
                    {dropOff > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        -{dropOff.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${step.rate}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// User Segment Analysis Component
function UserSegmentAnalysis({ segments }: { segments: UserSegment[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {segments.map(segment => (
        <Card key={segment.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{segment.name}</CardTitle>
              <Badge variant="secondary">{segment.size}% of users</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Session Duration</p>
                <p className="font-medium">{Math.floor(segment.behavior.averageSessionDuration / 60)}m</p>
              </div>
              <div>
                <p className="text-gray-500">Conversion Rate</p>
                <p className="font-medium">{segment.behavior.conversionRate}%</p>
              </div>
              <div>
                <p className="text-gray-500">Pages/Session</p>
                <p className="font-medium">{segment.behavior.pagesPerSession}</p>
              </div>
              <div>
                <p className="text-gray-500">Satisfaction</p>
                <p className="font-medium">{segment.trends.satisfaction}%</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-2">Top Categories</p>
              <div className="flex flex-wrap gap-1">
                {segment.behavior.preferredCategories.map(cat => (
                  <Badge key={cat} variant="outline" className="text-xs">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-2">Growth Trend</p>
              <div className="flex items-center gap-2">
                {segment.trends.growth > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  segment.trends.growth > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {segment.trends.growth > 0 ? "+" : ""}{segment.trends.growth}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Interaction Heatmap View Component
function InteractionHeatmapView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MousePointer className="h-5 w-5" />
          Interaction Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Heatmap visualization would appear here
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Showing click patterns and interaction hotspots
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">2,847</p>
              <p className="text-xs text-gray-500">Total Clicks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">1,523</p>
              <p className="text-xs text-gray-500">Creator Card Clicks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">892</p>
              <p className="text-xs text-gray-500">Filter Interactions</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// AI Predictive Insights Component
function AIPredictiveInsights() {
  const predictions = [
    {
      title: "User Churn Prediction",
      prediction: "12% of users at risk of churning in next 7 days",
      confidence: 87,
      action: "Send personalized retention emails"
    },
    {
      title: "Peak Usage Forecast",
      prediction: "35% increase in bookings expected this weekend",
      confidence: 92,
      action: "Scale infrastructure and notify creators"
    },
    {
      title: "Category Trend Analysis",
      prediction: "Musicians category will grow 18% next month",
      confidence: 74,
      action: "Recruit more musicians and adjust recommendations"
    }
  ]
  
  return (
    <div className="space-y-4">
      {predictions.map((insight, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm mb-1">{insight.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {insight.prediction}
                </p>
                <p className="text-xs text-blue-600">
                  Recommended: {insight.action}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 flex items-center justify-center mb-1">
                  <span className="text-xs font-bold">{insight.confidence}%</span>
                </div>
                <p className="text-xs text-gray-500">Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}