"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock,
  Star,
  Target,
  Calendar,
  BarChart3,
  Activity,
  Lightbulb,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RevenueInsight {
  type: 'best-times' | 'optimal-pricing' | 'high-value-customers' | 'growth-opportunities'
  title: string
  value: string
  change: number
  description: string
  actionable: string
  priority: 'high' | 'medium' | 'low'
  impact: string
}

interface PerformanceInsight {
  type: 'response-time' | 'quality-balance' | 'satisfaction-drivers' | 'improvement-recs'
  title: string
  current: number
  target: number
  description: string
  recommendations: string[]
  priority: 'high' | 'medium' | 'low'
}

interface GrowthInsight {
  type: 'market-trends' | 'competition' | 'expansion-opportunities' | 'marketing-effectiveness'
  title: string
  trend: 'up' | 'down' | 'stable'
  confidence: number
  description: string
  nextSteps: string[]
  timeframe: string
}

interface InsightCategoriesProps {
  revenueInsights: RevenueInsight[]
  performanceInsights: PerformanceInsight[]
  growthInsights: GrowthInsight[]
  onTakeAction?: (category: string, type: string) => void
  onViewDetails?: (category: string, type: string) => void
}

export function InsightCategories({
  revenueInsights,
  performanceInsights,
  growthInsights,
  onTakeAction,
  onViewDetails
}: InsightCategoriesProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <Activity className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Revenue Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Revenue Insights</h2>
          <Badge className="bg-green-100 text-green-800">
            {revenueInsights.filter(r => r.priority === 'high').length} high priority
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {revenueInsights.map((insight, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{insight.title}</CardTitle>
                  <Badge className={getPriorityColor(insight.priority)}>
                    {insight.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">{insight.value}</span>
                  <div className="flex items-center gap-1">
                    {insight.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <Activity className="h-4 w-4 text-red-600" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      insight.change > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {insight.change > 0 ? '+' : ''}{insight.change}%
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{insight.description}</p>
                
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Actionable Insight</p>
                      <p className="text-xs text-blue-800">{insight.actionable}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Potential Impact: {insight.impact}</span>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onViewDetails?.('revenue', insight.type)}
                    >
                      Details
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => onTakeAction?.('revenue', insight.type)}
                    >
                      Take Action
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Performance Insights</h2>
          <Badge className="bg-blue-100 text-blue-800">
            {performanceInsights.filter(p => p.priority === 'high').length} needs attention
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceInsights.map((insight, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{insight.title}</CardTitle>
                  <Badge className={getPriorityColor(insight.priority)}>
                    {insight.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Performance</span>
                    <span className="font-medium">{insight.current}%</span>
                  </div>
                  <Progress value={insight.current} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Target: {insight.target}%</span>
                    <span className={cn(
                      insight.current >= insight.target ? "text-green-600" : "text-red-600"
                    )}>
                      {insight.current >= insight.target ? (
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                      )}
                      {insight.current >= insight.target ? 'On Track' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{insight.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                  <ul className="space-y-1">
                    {insight.recommendations.map((rec, recIndex) => (
                      <li key={recIndex} className="flex items-start gap-2">
                        <span className="text-purple-500 text-xs mt-1">•</span>
                        <span className="text-xs text-gray-600">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onViewDetails?.('performance', insight.type)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => onTakeAction?.('performance', insight.type)}
                  >
                    Improve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Growth Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Growth Insights</h2>
          <Badge className="bg-purple-100 text-purple-800">
            {growthInsights.filter(g => g.confidence > 80).length} high confidence
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {growthInsights.map((insight, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {getTrendIcon(insight.trend)}
                    {insight.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}% confident
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {insight.timeframe}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Progress value={insight.confidence} className="flex-1 h-2" />
                  <span className="text-xs text-gray-500">Confidence</span>
                </div>
                
                <p className="text-sm text-gray-600">{insight.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Next Steps:</p>
                  <div className="space-y-1">
                    {insight.nextSteps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-2">
                        <span className="bg-purple-100 text-purple-800 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
                          {stepIndex + 1}
                        </span>
                        <span className="text-xs text-gray-600">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onViewDetails?.('growth', insight.type)}
                  >
                    Explore
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => onTakeAction?.('growth', insight.type)}
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Act Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Insights Summary
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-purple-700 font-medium">Revenue</p>
                  <p className="text-purple-600">
                    {revenueInsights.filter(r => r.priority === 'high').length} high priority actions
                  </p>
                </div>
                <div>
                  <p className="text-purple-700 font-medium">Performance</p>
                  <p className="text-purple-600">
                    {performanceInsights.filter(p => p.current < p.target).length} areas to improve
                  </p>
                </div>
                <div>
                  <p className="text-purple-700 font-medium">Growth</p>
                  <p className="text-purple-600">
                    {growthInsights.filter(g => g.trend === 'up').length} positive trends
                  </p>
                </div>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Full Analytics Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}