"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign,
  Star,
  Lightbulb,
  Target,
  Zap,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RequestIntelligenceData {
  similarRequests: number
  suggestedPrice: number
  currentPrice: number
  estimatedTime: string
  successProbability: number
  complexity: 'low' | 'medium' | 'high'
  customerType: 'new' | 'repeat' | 'vip'
  urgencyScore: number
}

interface RequestIntelligenceProps {
  request: {
    id: number
    occasion: string
    recipient: string
    message: string
    price: number
    customer: string
  }
  intelligence: RequestIntelligenceData
  onAccept?: () => void
  onDecline?: () => void
  onSuggestedAction?: (action: string) => void
}

export function RequestIntelligence({ 
  request, 
  intelligence, 
  onAccept, 
  onDecline, 
  onSuggestedAction 
}: RequestIntelligenceProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'new': return 'text-blue-600 bg-blue-50'
      case 'repeat': return 'text-green-600 bg-green-50'
      case 'vip': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const priceDifference = intelligence.suggestedPrice - intelligence.currentPrice
  const priceRecommendation = priceDifference > 0 ? 'increase' : priceDifference < 0 ? 'decrease' : 'maintain'

  return (
    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Request Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Insights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
            <p className="text-xs text-gray-600">Similar Requests</p>
            <p className="font-bold text-lg">{intelligence.similarRequests}</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-gray-600" />
            </div>
            <p className="text-xs text-gray-600">Est. Time</p>
            <p className="font-bold text-lg">{intelligence.estimatedTime}</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-gray-600" />
            </div>
            <p className="text-xs text-gray-600">Success Rate</p>
            <p className="font-bold text-lg">{intelligence.successProbability}%</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <Zap className="h-4 w-4 text-gray-600" />
            </div>
            <p className="text-xs text-gray-600">Urgency</p>
            <p className="font-bold text-lg">{intelligence.urgencyScore}/10</p>
          </div>
        </div>

        {/* Success Probability */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Success Probability</span>
            <Badge className={cn(
              intelligence.successProbability >= 80 ? "bg-green-100 text-green-800" :
              intelligence.successProbability >= 60 ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            )}>
              {intelligence.successProbability >= 80 ? "High" :
               intelligence.successProbability >= 60 ? "Medium" : "Low"}
            </Badge>
          </div>
          <Progress value={intelligence.successProbability} className="h-2" />
          <p className="text-xs text-gray-600 mt-1">
            Based on your {intelligence.similarRequests} similar past requests
          </p>
        </div>

        {/* Request Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-3">Request Profile</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Complexity</span>
                <Badge className={getComplexityColor(intelligence.complexity)}>
                  {intelligence.complexity}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Customer Type</span>
                <Badge className={getCustomerTypeColor(intelligence.customerType)}>
                  {intelligence.customerType}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Occasion Type</span>
                <span className="text-sm font-medium">{request.occasion}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-3">Price Analysis</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Price</span>
                <span className="font-medium">${intelligence.currentPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Suggested Price</span>
                <span className={cn(
                  "font-medium",
                  priceDifference > 0 ? "text-green-600" : 
                  priceDifference < 0 ? "text-red-600" : "text-gray-900"
                )}>
                  ${intelligence.suggestedPrice}
                  {priceDifference !== 0 && (
                    <span className="text-xs ml-1">
                      ({priceDifference > 0 ? '+' : ''}${priceDifference})
                    </span>
                  )}
                </span>
              </div>
              {priceRecommendation !== 'maintain' && (
                <div className="pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full text-xs"
                    onClick={() => onSuggestedAction?.('negotiate-price')}
                  >
                    <DollarSign className="h-3 w-3 mr-1" />
                    Suggest {priceRecommendation === 'increase' ? 'Higher' : 'Lower'} Price
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-purple-600" />
            <h4 className="font-medium text-purple-900">AI Recommendations</h4>
          </div>
          <div className="space-y-2">
            {intelligence.successProbability >= 80 && (
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                <p className="text-sm text-gray-700">
                  High success probability - this matches your strengths perfectly
                </p>
              </div>
            )}
            {intelligence.customerType === 'repeat' && (
              <div className="flex items-start gap-2">
                <Star className="h-4 w-4 text-yellow-600 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Repeat customer - they've booked with you {intelligence.similarRequests} times before
                </p>
              </div>
            )}
            {intelligence.urgencyScore >= 8 && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                <p className="text-sm text-gray-700">
                  High urgency - consider prioritizing this request
                </p>
              </div>
            )}
            {intelligence.complexity === 'low' && (
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Quick win - this should be easy to complete in {intelligence.estimatedTime}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Response Templates */}
        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-medium text-gray-900 mb-3">Suggested Response</h4>
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-700">
              "Hi {request.customer}! Thanks for choosing me for {request.recipient}'s {request.occasion.toLowerCase()}. 
              {intelligence.customerType === 'repeat' ? 'Always a pleasure working with you again! ' : ''}
              I'd love to create something special. Expected delivery: {intelligence.estimatedTime}."
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onSuggestedAction?.('use-template')}
            >
              Use Template
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onSuggestedAction?.('customize-template')}
            >
              Customize
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={onAccept}
          >
            <Target className="h-4 w-4 mr-2" />
            Accept Request
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onDecline}
          >
            Decline Politely
          </Button>
          <Button 
            variant="outline"
            onClick={() => onSuggestedAction?.('message-first')}
          >
            Message First
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}