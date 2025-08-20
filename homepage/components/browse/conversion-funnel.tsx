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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Activity,
  TrendingDown,
  Clock,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Zap,
  Eye,
  MousePointer,
  ShoppingCart,
  CreditCard,
  Lightbulb,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Funnel step definition
export interface FunnelStep {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  order: number
  isRequired: boolean
  targetTime?: number // seconds
  targetConversion?: number // percentage
  category: "awareness" | "interest" | "consideration" | "intent" | "purchase"
}

// Funnel metrics for each step
export interface FunnelMetrics {
  stepId: string
  totalUsers: number
  uniqueUsers: number
  conversions: number
  conversionRate: number
  averageTime: number
  dropOffRate: number
  dropOffReasons: Array<{
    reason: string
    percentage: number
    impact: "high" | "medium" | "low"
  }>
  improvements: Array<{
    suggestion: string
    expectedImpact: number
    effort: "low" | "medium" | "high"
  }>
}

// User journey tracking
export interface UserJourney {
  userId: string
  sessionId: string
  startTime: Date
  currentStep: string
  completedSteps: string[]
  timePerStep: Record<string, number>
  abandonedAt?: string
  completedFunnel: boolean
  metadata: {
    source: string
    device: string
    location?: string
    userType: "new" | "returning"
  }
}

interface ConversionFunnelProps {
  dateRange?: string
  segment?: string
  showOptimizations?: boolean
  onStepAnalysis?: (stepId: string) => void
  className?: string
}

// Predefined funnel steps for browse to booking
const BROWSE_FUNNEL_STEPS: FunnelStep[] = [
  {
    id: "page_load",
    name: "Page Load",
    description: "User lands on browse page",
    icon: <Eye className="h-4 w-4" />,
    order: 1,
    isRequired: true,
    targetConversion: 100,
    category: "awareness"
  },
  {
    id: "first_interaction",
    name: "First Interaction",
    description: "User scrolls, searches, or filters",
    icon: <MousePointer className="h-4 w-4" />,
    order: 2,
    isRequired: true,
    targetTime: 15,
    targetConversion: 85,
    category: "interest"
  },
  {
    id: "results_engagement",
    name: "Results Engagement",
    description: "User views search results or applies filters",
    icon: <BarChart3 className="h-4 w-4" />,
    order: 3,
    isRequired: true,
    targetTime: 30,
    targetConversion: 70,
    category: "interest"
  },
  {
    id: "creator_discovery",
    name: "Creator Discovery",
    description: "User browses and discovers creators",
    icon: <Users className="h-4 w-4" />,
    order: 4,
    isRequired: true,
    targetTime: 60,
    targetConversion: 50,
    category: "consideration"
  },
  {
    id: "creator_profile",
    name: "Creator Profile View",
    description: "User clicks on creator card to view profile",
    icon: <Target className="h-4 w-4" />,
    order: 5,
    isRequired: true,
    targetTime: 90,
    targetConversion: 25,
    category: "consideration"
  },
  {
    id: "booking_intent",
    name: "Booking Intent",
    description: "User shows interest in booking (favorites, shares, etc.)",
    icon: <Zap className="h-4 w-4" />,
    order: 6,
    isRequired: false,
    targetTime: 120,
    targetConversion: 15,
    category: "intent"
  },
  {
    id: "booking_initiation",
    name: "Booking Start",
    description: "User clicks 'Book Now' and starts booking flow",
    icon: <ShoppingCart className="h-4 w-4" />,
    order: 7,
    isRequired: false,
    targetTime: 180,
    targetConversion: 10,
    category: "intent"
  },
  {
    id: "booking_completion",
    name: "Purchase Complete",
    description: "User completes payment and booking",
    icon: <CreditCard className="h-4 w-4" />,
    order: 8,
    isRequired: false,
    targetTime: 300,
    targetConversion: 6,
    category: "purchase"
  }
]

export function ConversionFunnel({
  dateRange = "7d",
  segment = "all",
  showOptimizations = true,
  onStepAnalysis,
  className
}: ConversionFunnelProps) {
  const [selectedDateRange, setSelectedDateRange] = React.useState(dateRange)
  const [selectedSegment, setSelectedSegment] = React.useState(segment)
  const [selectedStep, setSelectedStep] = React.useState<string | null>(null)
  const [showBottlenecks, setShowBottlenecks] = React.useState(true)
  
  // Generate sample metrics data
  const generateMetrics = React.useCallback((): FunnelMetrics[] => {
    return BROWSE_FUNNEL_STEPS.map((step, index) => {
      const baseUsers = 1000
      const conversionDecline = Math.pow(0.85, index)
      const totalUsers = Math.floor(baseUsers * conversionDecline)
      const conversions = index < BROWSE_FUNNEL_STEPS.length - 1 
        ? Math.floor(totalUsers * 0.85) 
        : totalUsers
      
      const dropOffRate = index > 0 
        ? ((BROWSE_FUNNEL_STEPS.map((_, i) => Math.floor(baseUsers * Math.pow(0.85, i)))[index - 1] - totalUsers) / BROWSE_FUNNEL_STEPS.map((_, i) => Math.floor(baseUsers * Math.pow(0.85, i)))[index - 1]) * 100
        : 0
      
      return {
        stepId: step.id,
        totalUsers,
        uniqueUsers: Math.floor(totalUsers * 0.9),
        conversions,
        conversionRate: (conversions / totalUsers) * 100,
        averageTime: (step.targetTime || 30) + Math.random() * 20 - 10,
        dropOffRate,
        dropOffReasons: [
          {
            reason: index === 1 ? "Slow page load" : index === 4 ? "Insufficient creator info" : "Complex interface",
            percentage: Math.random() * 30 + 20,
            impact: "high"
          },
          {
            reason: index === 2 ? "Poor search results" : "Mobile UX issues",
            percentage: Math.random() * 20 + 15,
            impact: "medium"
          },
          {
            reason: "User distraction",
            percentage: Math.random() * 15 + 10,
            impact: "low"
          }
        ],
        improvements: [
          {
            suggestion: index === 1 ? "Optimize page loading speed" : index === 4 ? "Add creator video previews" : "Simplify user interface",
            expectedImpact: Math.random() * 15 + 10,
            effort: index % 2 === 0 ? "medium" : "low"
          },
          {
            suggestion: "A/B test new layouts",
            expectedImpact: Math.random() * 10 + 5,
            effort: "high"
          }
        ]
      }
    })
  }, [])
  
  const metrics = generateMetrics()
  
  // Calculate overall funnel performance
  const overallMetrics = React.useMemo(() => {
    const firstStep = metrics[0]
    const lastStep = metrics[metrics.length - 1]
    const overallConversion = (lastStep.totalUsers / firstStep.totalUsers) * 100
    
    // Find biggest drop-off
    let biggestDropOff = { stepIndex: 0, dropOff: 0 }
    metrics.forEach((metric, index) => {
      if (metric.dropOffRate > biggestDropOff.dropOff) {
        biggestDropOff = { stepIndex: index, dropOff: metric.dropOffRate }
      }
    })
    
    return {
      totalUsers: firstStep.totalUsers,
      completedUsers: lastStep.totalUsers,
      overallConversion,
      biggestBottleneck: BROWSE_FUNNEL_STEPS[biggestDropOff.stepIndex],
      biggestDropOff: biggestDropOff.dropOff,
      averageTime: metrics.reduce((sum, m) => sum + m.averageTime, 0)
    }
  }, [metrics])
  
  // Export funnel data
  const exportFunnelData = () => {
    const data = {
      dateRange: selectedDateRange,
      segment: selectedSegment,
      overallMetrics,
      stepMetrics: metrics,
      funnelSteps: BROWSE_FUNNEL_STEPS,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `conversion-funnel-${selectedDateRange}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("Funnel data exported")
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Conversion Funnel Analysis
            </CardTitle>
            <div className="flex items-center gap-3">
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
                  <SelectItem value="new">New Users</SelectItem>
                  <SelectItem value="returning">Returning Users</SelectItem>
                  <SelectItem value="mobile">Mobile Users</SelectItem>
                  <SelectItem value="desktop">Desktop Users</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" onClick={exportFunnelData}>
                Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {overallMetrics.totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {overallMetrics.overallConversion.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Overall Conversion</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(overallMetrics.averageTime)}s
            </div>
            <div className="text-sm text-gray-600">Avg. Funnel Time</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {overallMetrics.biggestDropOff.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Biggest Drop-off</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Funnel Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {BROWSE_FUNNEL_STEPS.map((step, index) => {
              const metric = metrics.find(m => m.stepId === step.id)
              if (!metric) return null
              
              const isSelected = selectedStep === step.id
              const isBottleneck = metric.dropOffRate > 20
              
              return (
                <motion.div
                  key={step.id}
                  layout
                  className={cn(
                    "relative border rounded-lg p-4 cursor-pointer transition-all",
                    isSelected && "border-purple-500 bg-purple-50 dark:bg-purple-900/20",
                    isBottleneck && "border-red-300 bg-red-50 dark:bg-red-900/20"
                  )}
                  onClick={() => {
                    setSelectedStep(isSelected ? null : step.id)
                    onStepAnalysis?.(step.id)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-full",
                          step.category === "awareness" && "bg-blue-100 dark:bg-blue-900/30",
                          step.category === "interest" && "bg-green-100 dark:bg-green-900/30",
                          step.category === "consideration" && "bg-yellow-100 dark:bg-yellow-900/30",
                          step.category === "intent" && "bg-orange-100 dark:bg-orange-900/30",
                          step.category === "purchase" && "bg-purple-100 dark:bg-purple-900/30"
                        )}>
                          {step.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{step.name}</h3>
                          <p className="text-xs text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {metric.totalUsers.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Users</div>
                      </div>
                      
                      <div className="text-center">
                        <div className={cn(
                          "text-lg font-bold",
                          metric.conversionRate >= (step.targetConversion || 50) ? "text-green-600" : "text-red-600"
                        )}>
                          {metric.conversionRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Conversion</div>
                      </div>
                      
                      {metric.dropOffRate > 0 && (
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-red-600">
                            <TrendingDown className="h-4 w-4" />
                            <span className="font-bold">{metric.dropOffRate.toFixed(1)}%</span>
                          </div>
                          <div className="text-xs text-gray-500">Drop-off</div>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <div className="text-sm font-bold">
                          {Math.round(metric.averageTime)}s
                        </div>
                        <div className="text-xs text-gray-500">Avg. Time</div>
                      </div>
                      
                      {isBottleneck && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>High drop-off rate detected</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                  
                  {/* Funnel Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Conversion Rate</span>
                      <span>Target: {step.targetConversion || 50}%</span>
                    </div>
                    <div className="relative">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            "h-full transition-all duration-500",
                            metric.conversionRate >= (step.targetConversion || 50)
                              ? "bg-gradient-to-r from-green-500 to-green-600"
                              : "bg-gradient-to-r from-red-500 to-red-600"
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, metric.conversionRate)}%` }}
                          transition={{ delay: index * 0.1 }}
                        />
                      </div>
                      {step.targetConversion && (
                        <div 
                          className="absolute top-0 w-0.5 h-3 bg-gray-400"
                          style={{ left: `${step.targetConversion}%` }}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Step Details (Expanded) */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Drop-off Reasons */}
                          <div>
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-red-500" />
                              Top Drop-off Reasons
                            </h4>
                            <div className="space-y-2">
                              {metric.dropOffReasons.map((reason, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                  <span className="text-xs">{reason.reason}</span>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={
                                      reason.impact === "high" ? "destructive" :
                                      reason.impact === "medium" ? "secondary" : "outline"
                                    } className="text-xs">
                                      {reason.percentage.toFixed(1)}%
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Improvements */}
                          {showOptimizations && (
                            <div>
                              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                Optimization Suggestions
                              </h4>
                              <div className="space-y-2">
                                {metric.improvements.map((improvement, idx) => (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs">{improvement.suggestion}</span>
                                      <Badge variant="outline" className="text-xs">
                                        +{improvement.expectedImpact.toFixed(1)}%
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Effort: {improvement.effort}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Key Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Critical Bottleneck</h4>
                <p className="text-xs text-gray-600 mt-1">
                  {overallMetrics.biggestBottleneck.name} shows highest drop-off rate at {overallMetrics.biggestDropOff.toFixed(1)}%. 
                  Focus optimization efforts here for maximum impact.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">High Performing Steps</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Steps with conversion rates above target are performing well. 
                  Consider applying successful patterns to underperforming steps.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Optimization Opportunity</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Improving just the biggest bottleneck by 10% could increase overall conversion by 
                  {(overallMetrics.biggestDropOff * 0.1).toFixed(1)} percentage points.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for tracking funnel progression
export function useFunnelTracking() {
  const [currentStep, setCurrentStep] = React.useState<string>("page_load")
  const [completedSteps, setCompletedSteps] = React.useState<string[]>([])
  const [stepTimes, setStepTimes] = React.useState<Record<string, number>>({})
  
  const progressToStep = React.useCallback((stepId: string) => {
    setCurrentStep(stepId)
    setCompletedSteps(prev => [...new Set([...prev, stepId])])
    setStepTimes(prev => ({
      ...prev,
      [stepId]: Date.now()
    }))
  }, [])
  
  const getStepDuration = React.useCallback((stepId: string): number => {
    const stepTime = stepTimes[stepId]
    if (!stepTime) return 0
    
    const previousStepIndex = BROWSE_FUNNEL_STEPS.findIndex(s => s.id === stepId) - 1
    if (previousStepIndex < 0) return 0
    
    const previousStepId = BROWSE_FUNNEL_STEPS[previousStepIndex].id
    const previousStepTime = stepTimes[previousStepId]
    
    return previousStepTime ? stepTime - previousStepTime : 0
  }, [stepTimes])
  
  return {
    currentStep,
    completedSteps,
    progressToStep,
    getStepDuration,
    totalSteps: BROWSE_FUNNEL_STEPS.length,
    completionPercentage: (completedSteps.length / BROWSE_FUNNEL_STEPS.length) * 100
  }
}