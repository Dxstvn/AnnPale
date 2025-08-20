"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  Users, 
  Target, 
  Lightbulb, 
  DollarSign,
  Star,
  Clock,
  Award,
  ArrowRight,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Globe,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AudienceInsight {
  metric: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
}

interface RevenueOptimization {
  strategy: string
  impact: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
}

interface GrowthRecommendation {
  title: string
  priority: 'high' | 'medium' | 'low'
  category: 'pricing' | 'content' | 'marketing' | 'efficiency'
  description: string
  expectedImpact: string
}

interface InsightsGrowthProps {
  audienceInsights: AudienceInsight[]
  revenueOptimizations: RevenueOptimization[]
  growthRecommendations: GrowthRecommendation[]
  marketTrends: {
    demandScore: number
    competitionLevel: string
    trendingCategories: string[]
  }
  onImplementRecommendation?: (id: string) => void
  onViewDetailedReport?: () => void
}

export function InsightsGrowth({
  audienceInsights,
  revenueOptimizations,
  growthRecommendations,
  marketTrends,
  onImplementRecommendation,
  onViewDetailedReport
}: InsightsGrowthProps) {
  const highPriorityRecommendations = growthRecommendations.filter(r => r.priority === 'high')

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Insights & Growth</h2>
          <p className="text-sm text-gray-600">Deep dive into your performance and opportunities</p>
        </div>
        <Button onClick={onViewDetailedReport} className="bg-gradient-to-r from-purple-600 to-pink-600">
          <BarChart3 className="h-4 w-4 mr-2" />
          Full Analytics Report
        </Button>
      </div>

      {/* Key Insights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-6 w-6 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-800">Market Position</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Demand Score</p>
              <p className="text-2xl font-bold text-gray-900">{marketTrends.demandScore}/100</p>
              <Progress value={marketTrends.demandScore} className="mt-2" />
              <p className="text-xs text-gray-500 mt-2">
                Competition: {marketTrends.competitionLevel}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-6 w-6 text-green-600" />
              <Badge className="bg-green-100 text-green-800">Growth Potential</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenue Opportunity</p>
              <p className="text-2xl font-bold text-gray-900">+35%</p>
              <p className="text-xs text-green-600 mt-2">
                Based on recommended optimizations
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-800">Action Items</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">High Priority Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{highPriorityRecommendations.length}</p>
              <p className="text-xs text-purple-600 mt-2">
                Recommendations ready
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audience Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Audience Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {audienceInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{insight.metric}</span>
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    insight.trend === 'up' ? "text-green-600" :
                    insight.trend === 'down' ? "text-red-600" :
                    "text-gray-600"
                  )}>
                    {insight.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : insight.trend === 'down' ? (
                      <Activity className="h-3 w-3" />
                    ) : null}
                    {insight.change > 0 ? '+' : ''}{insight.change}%
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900">{insight.value}</p>
              </div>
            ))}
          </div>

          {/* Trending Categories */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Trending Categories</h4>
            <div className="flex flex-wrap gap-2">
              {marketTrends.trendingCategories.map((category) => (
                <Badge key={category} variant="outline" className="bg-purple-50 text-purple-700">
                  <Globe className="h-3 w-3 mr-1" />
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueOptimizations.map((optimization, index) => (
              <div 
                key={index} 
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{optimization.strategy}</h4>
                      <Badge 
                        className={cn(
                          optimization.difficulty === 'easy' ? "bg-green-100 text-green-800" :
                          optimization.difficulty === 'medium' ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        )}
                      >
                        {optimization.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{optimization.description}</p>
                    <p className="text-sm font-medium text-green-600">
                      Expected impact: {optimization.impact}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Implement
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Growth Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {growthRecommendations.map((recommendation, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-4 border rounded-lg",
                  recommendation.priority === 'high' ? "border-red-200 bg-red-50" :
                  recommendation.priority === 'medium' ? "border-yellow-200 bg-yellow-50" :
                  "border-gray-200 bg-gray-50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                      <Badge 
                        className={cn(
                          recommendation.priority === 'high' ? "bg-red-600" :
                          recommendation.priority === 'medium' ? "bg-yellow-600" :
                          "bg-gray-600"
                        )}
                      >
                        {recommendation.priority} priority
                      </Badge>
                      <Badge variant="outline">
                        {recommendation.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
                    <p className="text-sm font-medium text-blue-600">
                      Expected impact: {recommendation.expectedImpact}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      Learn More
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => onImplementRecommendation?.(recommendation.title)}
                    >
                      Start Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics Preview */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-300 text-sm mb-4">
                Get detailed insights into your performance, customer behavior, and market opportunities
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  <span className="text-sm">Customer Demographics</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm">Revenue Forecasting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">Performance Trends</span>
                </div>
              </div>
            </div>
            <Button 
              className="bg-white text-gray-900 hover:bg-gray-100"
              onClick={onViewDetailedReport}
            >
              View Full Report
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}