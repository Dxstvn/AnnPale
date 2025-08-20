"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Lightbulb, 
  Target, 
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  BarChart3,
  Play,
  Pause,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Recommendation {
  id: string
  title: string
  category: 'revenue' | 'performance' | 'growth' | 'efficiency'
  priority: 'critical' | 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  timeframe: string
  description: string
  currentValue: number
  projectedValue: number
  steps: string[]
  metrics: string[]
  confidence: number
  isActive?: boolean
  progress?: number
}

interface ActionableRecommendationsProps {
  recommendations: Recommendation[]
  onImplement?: (id: string) => void
  onDismiss?: (id: string) => void
  onTrackProgress?: (id: string, progress: number) => void
  onViewDetails?: (id: string) => void
}

export function ActionableRecommendations({
  recommendations,
  onImplement,
  onDismiss,
  onTrackProgress,
  onViewDetails
}: ActionableRecommendationsProps) {
  const [activeRecommendations, setActiveRecommendations] = useState<string[]>([])
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return DollarSign
      case 'performance': return Target
      case 'growth': return TrendingUp
      case 'efficiency': return Zap
      default: return Lightbulb
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'text-green-600 bg-green-50'
      case 'performance': return 'text-blue-600 bg-blue-50'
      case 'growth': return 'text-purple-600 bg-purple-50'
      case 'efficiency': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white'
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <TrendingUp className="h-3 w-3" />
      case 'medium': return <BarChart3 className="h-3 w-3" />
      case 'low': return <ArrowRight className="h-3 w-3" />
      default: return <ArrowRight className="h-3 w-3" />
    }
  }

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'low': return <CheckCircle className="h-3 w-3 text-green-600" />
      case 'medium': return <Clock className="h-3 w-3 text-yellow-600" />
      case 'high': return <AlertTriangle className="h-3 w-3 text-red-600" />
      default: return <Clock className="h-3 w-3" />
    }
  }

  const handleImplement = (recommendation: Recommendation) => {
    setActiveRecommendations(prev => [...prev, recommendation.id])
    onImplement?.(recommendation.id)
  }

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    const impactOrder = { high: 3, medium: 2, low: 1 }
    
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    
    return impactOrder[b.impact] - impactOrder[a.impact]
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Actionable Recommendations</h2>
          <p className="text-sm text-gray-600">AI-powered suggestions to optimize your performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            {recommendations.filter(r => r.priority === 'critical' || r.priority === 'high').length} priority actions
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {activeRecommendations.length} active
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Potential Revenue</p>
                <p className="text-lg font-bold text-green-600">
                  +${recommendations.reduce((sum, r) => 
                    r.category === 'revenue' ? sum + (r.projectedValue - r.currentValue) : sum, 0
                  )}
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Performance Boost</p>
                <p className="text-lg font-bold text-blue-600">
                  +{Math.round(recommendations
                    .filter(r => r.category === 'performance')
                    .reduce((sum, r) => sum + (r.projectedValue - r.currentValue), 0)
                  )}%
                </p>
              </div>
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Growth Potential</p>
                <p className="text-lg font-bold text-purple-600">
                  {recommendations.filter(r => r.category === 'growth').length} opportunities
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Time Savings</p>
                <p className="text-lg font-bold text-orange-600">
                  {recommendations.filter(r => r.category === 'efficiency').length} optimizations
                </p>
              </div>
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {sortedRecommendations.map((recommendation) => {
          const CategoryIcon = getCategoryIcon(recommendation.category)
          const isActive = activeRecommendations.includes(recommendation.id) || recommendation.isActive
          
          return (
            <Card 
              key={recommendation.id} 
              className={cn(
                "transition-all",
                isActive && "ring-2 ring-purple-500 bg-purple-50"
              )}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      getCategoryColor(recommendation.category)
                    )}>
                      <CategoryIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(recommendation.priority)}>
                      {recommendation.priority}
                    </Badge>
                    {isActive && (
                      <Badge className="bg-purple-600 text-white">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Metrics and Impact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Current Value</span>
                      <span className="text-sm font-medium">{recommendation.currentValue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Projected Value</span>
                      <span className="text-sm font-bold text-green-600">
                        {recommendation.projectedValue}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Impact</span>
                      <div className="flex items-center gap-1">
                        {getImpactIcon(recommendation.impact)}
                        <span className="text-sm font-medium capitalize">{recommendation.impact}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Effort</span>
                      <div className="flex items-center gap-1">
                        {getEffortIcon(recommendation.effort)}
                        <span className="text-sm font-medium capitalize">{recommendation.effort}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Confidence</span>
                      <span className="text-sm font-medium">{recommendation.confidence}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Timeframe</span>
                      <span className="text-sm font-medium">{recommendation.timeframe}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar (if active) */}
                {isActive && recommendation.progress !== undefined && (
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-purple-900">Implementation Progress</span>
                      <span className="text-purple-700">{recommendation.progress}%</span>
                    </div>
                    <Progress value={recommendation.progress} className="h-2" />
                  </div>
                )}

                {/* Action Steps */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Implementation Steps</h4>
                  <div className="space-y-1">
                    {recommendation.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics to Track */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-600">Track:</span>
                  {recommendation.metrics.map((metric, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {metric}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails?.(recommendation.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismiss?.(recommendation.id)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                  
                  {!isActive ? (
                    <Button
                      onClick={() => handleImplement(recommendation)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Implement Now
                    </Button>
                  ) : (
                    <Button variant="outline">
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Card */}
      {recommendations.length === 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              All Caught Up!
            </h3>
            <p className="text-green-700 text-sm">
              No new recommendations at this time. Keep up the great work!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}