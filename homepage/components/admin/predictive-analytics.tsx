"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  AlertTriangle,
  DollarSign,
  Users,
  UserMinus,
  Activity,
  Zap,
  BarChart3,
  LineChart,
  Calendar,
  Clock,
  Info,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Sparkles,
  Shield,
  RefreshCw,
  Settings,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"

interface GrowthForecast {
  metric: string
  currentValue: number
  predicted30Days: number
  predicted60Days: number
  predicted90Days: number
  confidence: number
  trend: "accelerating" | "steady" | "decelerating"
  factors: string[]
}

interface ChurnPrediction {
  segment: string
  currentChurn: number
  predictedChurn: number
  riskLevel: "high" | "medium" | "low"
  atRiskUsers: number
  preventableChurn: number
  recommendedActions: string[]
}

interface RevenueProjection {
  period: string
  baseCase: number
  optimistic: number
  pessimistic: number
  probability: {
    base: number
    optimistic: number
    pessimistic: number
  }
  drivers: Array<{
    factor: string
    impact: "positive" | "negative"
    magnitude: number
  }>
}

interface CapacityPlan {
  resource: string
  currentUsage: number
  projectedUsage: number
  capacity: number
  scalePoint: number
  recommendation: string
  urgency: "immediate" | "soon" | "planned" | "monitor"
}

interface RiskAssessment {
  category: string
  risk: string
  probability: number
  impact: "high" | "medium" | "low"
  trend: "increasing" | "stable" | "decreasing"
  mitigation: string
  status: "active" | "monitoring" | "mitigated"
}

const growthForecasts: GrowthForecast[] = [
  {
    metric: "Monthly Active Users",
    currentValue: 45892,
    predicted30Days: 52340,
    predicted60Days: 58920,
    predicted90Days: 65800,
    confidence: 82,
    trend: "accelerating",
    factors: ["Seasonal trends", "Marketing campaigns", "Product improvements"]
  },
  {
    metric: "Creator Base",
    currentValue: 1247,
    predicted30Days: 1380,
    predicted60Days: 1520,
    predicted90Days: 1675,
    confidence: 78,
    trend: "steady",
    factors: ["Onboarding improvements", "Creator incentives", "Market expansion"]
  },
  {
    metric: "Monthly Revenue",
    currentValue: 125430,
    predicted30Days: 142000,
    predicted60Days: 158500,
    predicted90Days: 176200,
    confidence: 75,
    trend: "accelerating",
    factors: ["User growth", "AOV increase", "New features"]
  }
]

const churnPredictions: ChurnPrediction[] = [
  {
    segment: "New Users (0-30 days)",
    currentChurn: 35,
    predictedChurn: 32,
    riskLevel: "high",
    atRiskUsers: 1094,
    preventableChurn: 328,
    recommendedActions: [
      "Improve onboarding flow",
      "Send welcome series emails",
      "Offer first-time user discount"
    ]
  },
  {
    segment: "Regular Users (30-180 days)",
    currentChurn: 15,
    predictedChurn: 14,
    riskLevel: "medium",
    atRiskUsers: 687,
    preventableChurn: 172,
    recommendedActions: [
      "Engagement campaigns",
      "Feature education",
      "Loyalty rewards"
    ]
  },
  {
    segment: "Power Users (180+ days)",
    currentChurn: 5,
    predictedChurn: 4.5,
    riskLevel: "low",
    atRiskUsers: 115,
    preventableChurn: 46,
    recommendedActions: [
      "VIP support",
      "Early access features",
      "Exclusive content"
    ]
  }
]

const revenueProjections: RevenueProjection[] = [
  {
    period: "Q2 2024",
    baseCase: 420000,
    optimistic: 485000,
    pessimistic: 380000,
    probability: {
      base: 60,
      optimistic: 25,
      pessimistic: 15
    },
    drivers: [
      { factor: "User acquisition", impact: "positive", magnitude: 35 },
      { factor: "Creator growth", impact: "positive", magnitude: 28 },
      { factor: "Market competition", impact: "negative", magnitude: 15 },
      { factor: "Seasonal demand", impact: "positive", magnitude: 22 }
    ]
  },
  {
    period: "Q3 2024",
    baseCase: 510000,
    optimistic: 620000,
    pessimistic: 450000,
    probability: {
      base: 55,
      optimistic: 30,
      pessimistic: 15
    },
    drivers: [
      { factor: "Platform features", impact: "positive", magnitude: 40 },
      { factor: "International expansion", impact: "positive", magnitude: 30 },
      { factor: "Economic conditions", impact: "negative", magnitude: 20 },
      { factor: "Partnership deals", impact: "positive", magnitude: 25 }
    ]
  }
]

const capacityPlans: CapacityPlan[] = [
  {
    resource: "Video Storage",
    currentUsage: 72,
    projectedUsage: 85,
    capacity: 100,
    scalePoint: 80,
    recommendation: "Increase storage by 50TB",
    urgency: "soon"
  },
  {
    resource: "API Requests",
    currentUsage: 65,
    projectedUsage: 78,
    capacity: 100,
    scalePoint: 75,
    recommendation: "Optimize caching strategy",
    urgency: "planned"
  },
  {
    resource: "Database Connections",
    currentUsage: 45,
    projectedUsage: 52,
    capacity: 100,
    scalePoint: 70,
    recommendation: "Monitor growth",
    urgency: "monitor"
  },
  {
    resource: "CDN Bandwidth",
    currentUsage: 88,
    projectedUsage: 95,
    capacity: 100,
    scalePoint: 85,
    recommendation: "Upgrade CDN plan immediately",
    urgency: "immediate"
  }
]

const riskAssessments: RiskAssessment[] = [
  {
    category: "Technical",
    risk: "Platform scalability limits",
    probability: 65,
    impact: "high",
    trend: "increasing",
    mitigation: "Implement auto-scaling infrastructure",
    status: "active"
  },
  {
    category: "Market",
    risk: "Competitor entry",
    probability: 45,
    impact: "medium",
    trend: "stable",
    mitigation: "Strengthen creator relationships",
    status: "monitoring"
  },
  {
    category: "Financial",
    risk: "Payment processor issues",
    probability: 25,
    impact: "high",
    trend: "decreasing",
    mitigation: "Multiple payment provider redundancy",
    status: "mitigated"
  },
  {
    category: "Operational",
    risk: "Creator quality decline",
    probability: 35,
    impact: "medium",
    trend: "stable",
    mitigation: "Enhanced quality monitoring system",
    status: "active"
  }
]

export function PredictiveAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("90days")
  const [confidenceThreshold, setConfidenceThreshold] = useState([75])
  const [selectedScenario, setSelectedScenario] = useState("base")

  const getTrendIcon = (trend: string) => {
    if (trend === "accelerating" || trend === "increasing") {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    }
    if (trend === "decelerating" || trend === "decreasing") {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "immediate": return "bg-red-100 text-red-800 animate-pulse"
      case "soon": return "bg-orange-100 text-orange-800"
      case "planned": return "bg-blue-100 text-blue-800"
      case "monitor": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactIcon = (impact: string) => {
    if (impact === "positive") return <ArrowUpRight className="h-3 w-3 text-green-600" />
    return <ArrowDownRight className="h-3 w-3 text-red-600" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Predictive Analytics</h2>
          <p className="text-gray-600">AI-powered forecasting and risk assessment</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="60days">60 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* AI Confidence Indicator */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertTitle>AI Model Performance</AlertTitle>
        <AlertDescription>
          <div className="flex items-center justify-between mt-2">
            <span>Current model accuracy: 84.3% based on historical data</span>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              High Confidence
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="growth">Growth Forecast</TabsTrigger>
          <TabsTrigger value="churn">Churn Prediction</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Projection</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Planning</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Forecasting</CardTitle>
              <CardDescription>ML-based predictions for key growth metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {growthForecasts.map((forecast) => (
                  <div key={forecast.metric} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {forecast.metric}
                          {getTrendIcon(forecast.trend)}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Current: {forecast.currentValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {forecast.confidence}% confidence
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {forecast.trend} growth
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">30 Days</p>
                        <p className="text-lg font-bold">
                          {forecast.predicted30Days.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600">
                          +{Math.round(((forecast.predicted30Days - forecast.currentValue) / forecast.currentValue) * 100)}%
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">60 Days</p>
                        <p className="text-lg font-bold">
                          {forecast.predicted60Days.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600">
                          +{Math.round(((forecast.predicted60Days - forecast.currentValue) / forecast.currentValue) * 100)}%
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">90 Days</p>
                        <p className="text-lg font-bold">
                          {forecast.predicted90Days.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600">
                          +{Math.round(((forecast.predicted90Days - forecast.currentValue) / forecast.currentValue) * 100)}%
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs font-medium text-gray-600 mb-2">Key Growth Factors:</p>
                      <div className="flex flex-wrap gap-2">
                        {forecast.factors.map((factor) => (
                          <Badge key={factor} variant="secondary" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="churn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Churn Prediction</CardTitle>
              <CardDescription>Identify and prevent user churn with AI insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {churnPredictions.map((prediction) => (
                  <div key={prediction.segment} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{prediction.segment}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm">
                          <span className="text-gray-600">
                            Current churn: {prediction.currentChurn}%
                          </span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="font-medium">
                            Predicted: {prediction.predictedChurn}%
                          </span>
                        </div>
                      </div>
                      <Badge className={getRiskColor(prediction.riskLevel)}>
                        {prediction.riskLevel} risk
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center p-2 bg-red-50 rounded">
                        <UserMinus className="h-4 w-4 mx-auto mb-1 text-red-600" />
                        <p className="text-xs text-gray-600">At Risk</p>
                        <p className="font-bold">{prediction.atRiskUsers.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <Shield className="h-4 w-4 mx-auto mb-1 text-yellow-600" />
                        <p className="text-xs text-gray-600">Preventable</p>
                        <p className="font-bold">{prediction.preventableChurn}</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <DollarSign className="h-4 w-4 mx-auto mb-1 text-green-600" />
                        <p className="text-xs text-gray-600">Revenue Impact</p>
                        <p className="font-bold">${(prediction.preventableChurn * 45).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs font-medium text-gray-600 mb-2">Recommended Actions:</p>
                      <ul className="space-y-1">
                        {prediction.recommendedActions.map((action, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue Projections</CardTitle>
                  <CardDescription>Scenario-based revenue forecasting</CardDescription>
                </div>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pessimistic">Pessimistic</SelectItem>
                    <SelectItem value="base">Base Case</SelectItem>
                    <SelectItem value="optimistic">Optimistic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {revenueProjections.map((projection) => (
                  <div key={projection.period} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">{projection.period}</h4>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className={cn(
                        "text-center p-3 rounded",
                        selectedScenario === "pessimistic" ? "bg-red-50 ring-2 ring-red-200" : "bg-gray-50"
                      )}>
                        <p className="text-xs text-gray-600">Pessimistic</p>
                        <p className="text-lg font-bold">${(projection.pessimistic / 1000).toFixed(0)}K</p>
                        <Badge variant="outline" className="text-xs">
                          {projection.probability.pessimistic}% prob
                        </Badge>
                      </div>
                      <div className={cn(
                        "text-center p-3 rounded",
                        selectedScenario === "base" ? "bg-blue-50 ring-2 ring-blue-200" : "bg-gray-50"
                      )}>
                        <p className="text-xs text-gray-600">Base Case</p>
                        <p className="text-lg font-bold">${(projection.baseCase / 1000).toFixed(0)}K</p>
                        <Badge variant="outline" className="text-xs">
                          {projection.probability.base}% prob
                        </Badge>
                      </div>
                      <div className={cn(
                        "text-center p-3 rounded",
                        selectedScenario === "optimistic" ? "bg-green-50 ring-2 ring-green-200" : "bg-gray-50"
                      )}>
                        <p className="text-xs text-gray-600">Optimistic</p>
                        <p className="text-lg font-bold">${(projection.optimistic / 1000).toFixed(0)}K</p>
                        <Badge variant="outline" className="text-xs">
                          {projection.probability.optimistic}% prob
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs font-medium text-gray-600 mb-2">Key Drivers:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {projection.drivers.map((driver, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <span className="flex items-center gap-1">
                              {getImpactIcon(driver.impact)}
                              {driver.factor}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {driver.magnitude}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Capacity Planning</CardTitle>
              <CardDescription>Infrastructure and resource forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {capacityPlans.map((plan) => (
                  <div key={plan.resource} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{plan.resource}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Scale point: {plan.scalePoint}% utilization
                        </p>
                      </div>
                      <Badge className={getUrgencyColor(plan.urgency)}>
                        {plan.urgency}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Current Usage</span>
                          <span className="font-medium">{plan.currentUsage}%</span>
                        </div>
                        <Progress value={plan.currentUsage} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Projected (90 days)</span>
                          <span className="font-medium">{plan.projectedUsage}%</span>
                        </div>
                        <Progress 
                          value={plan.projectedUsage} 
                          className={cn(
                            "h-2",
                            plan.projectedUsage > plan.scalePoint && "bg-orange-100"
                          )}
                        />
                      </div>
                    </div>

                    <Alert className="mt-3">
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {plan.recommendation}
                      </AlertDescription>
                    </Alert>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Matrix</CardTitle>
              <CardDescription>Identified risks and mitigation strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAssessments.map((risk) => (
                  <div key={risk.risk} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge variant="outline" className="mb-2">{risk.category}</Badge>
                        <h4 className="font-medium">{risk.risk}</h4>
                      </div>
                      <div className="text-right">
                        <Badge className={getRiskColor(risk.impact)}>
                          {risk.impact} impact
                        </Badge>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {getTrendIcon(risk.trend)}
                          <span className="text-xs text-gray-600">{risk.trend}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Probability</span>
                          <span className="font-medium">{risk.probability}%</span>
                        </div>
                        <Progress 
                          value={risk.probability} 
                          className={cn(
                            "h-2",
                            risk.probability > 60 && "bg-red-100",
                            risk.probability > 40 && risk.probability <= 60 && "bg-yellow-100",
                            risk.probability <= 40 && "bg-green-100"
                          )}
                        />
                      </div>
                      <Badge variant={risk.status === "active" ? "default" : "secondary"}>
                        {risk.status}
                      </Badge>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-sm">
                        <span className="font-medium">Mitigation: </span>
                        {risk.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  AI Recommendation
                </h4>
                <p className="text-sm text-gray-700">
                  Based on current trends, prioritize mitigating technical scalability risks 
                  and strengthening creator relationships to maintain competitive advantage.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}