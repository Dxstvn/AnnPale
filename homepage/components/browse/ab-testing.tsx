"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  TestTube,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MousePointer,
  ShoppingCart,
  Heart,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Square,
  AlertTriangle,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// A/B Test Types
export interface ABTestVariant {
  id: string
  name: string
  description: string
  weight: number // Percentage of traffic (0-100)
  config: Record<string, any>
  isControl?: boolean
}

export interface ABTest {
  id: string
  name: string
  description: string
  status: "draft" | "running" | "paused" | "completed"
  variants: ABTestVariant[]
  metrics: ABTestMetric[]
  startDate?: Date
  endDate?: Date
  targetSampleSize: number
  confidenceLevel: number
  minimumDetectableEffect: number
  createdAt: Date
  createdBy?: string
  tags: string[]
}

export interface ABTestMetric {
  id: string
  name: string
  type: "conversion" | "numeric" | "duration"
  primary: boolean
  description: string
  goal: "increase" | "decrease"
}

export interface ABTestResult {
  testId: string
  variantId: string
  metric: string
  participants: number
  conversions?: number
  conversionRate?: number
  averageValue?: number
  standardDeviation?: number
  confidenceInterval?: [number, number]
  pValue?: number
  isSignificant?: boolean
  percentChange?: number
}

export interface ABTestSession {
  userId: string
  sessionId: string
  testId: string
  variantId: string
  assignedAt: Date
  interactions: ABTestInteraction[]
}

export interface ABTestInteraction {
  type: string
  timestamp: Date
  value?: number
  metadata?: Record<string, any>
}

interface ABTestingProps {
  userId?: string
  sessionId?: string
  isAdmin?: boolean
  className?: string
}

// Sample tests for demonstration
const sampleTests: ABTest[] = [
  {
    id: "creator-card-layout",
    name: "Creator Card Layout Test",
    description: "Testing different creator card layouts for better engagement",
    status: "running",
    variants: [
      {
        id: "control",
        name: "Original Layout",
        description: "Current creator card design",
        weight: 50,
        config: { layout: "original" },
        isControl: true
      },
      {
        id: "enhanced",
        name: "Enhanced Layout",
        description: "New layout with video preview",
        weight: 50,
        config: { layout: "enhanced", showVideoPreview: true }
      }
    ],
    metrics: [
      {
        id: "click-rate",
        name: "Creator Click Rate",
        type: "conversion",
        primary: true,
        description: "Percentage of users who click on creator cards",
        goal: "increase"
      },
      {
        id: "time-to-click",
        name: "Time to First Click",
        type: "duration",
        primary: false,
        description: "Average time before first creator card click",
        goal: "decrease"
      }
    ],
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    targetSampleSize: 1000,
    confidenceLevel: 95,
    minimumDetectableEffect: 5,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    tags: ["ui", "engagement"]
  },
  {
    id: "search-suggestions",
    name: "Search Suggestions Test",
    description: "Testing AI-powered vs manual search suggestions",
    status: "running",
    variants: [
      {
        id: "manual",
        name: "Manual Suggestions",
        description: "Curated search suggestions",
        weight: 40,
        config: { suggestionType: "manual" },
        isControl: true
      },
      {
        id: "ai-powered",
        name: "AI-Powered Suggestions",
        description: "ML-generated personalized suggestions",
        weight: 60,
        config: { suggestionType: "ai", personalization: true }
      }
    ],
    metrics: [
      {
        id: "search-engagement",
        name: "Search Engagement Rate",
        type: "conversion",
        primary: true,
        description: "Users who perform searches after seeing suggestions",
        goal: "increase"
      }
    ],
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    targetSampleSize: 500,
    confidenceLevel: 95,
    minimumDetectableEffect: 10,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    tags: ["search", "ai", "personalization"]
  }
]

export function ABTestingFramework({
  userId = "guest",
  sessionId,
  isAdmin = false,
  className
}: ABTestingProps) {
  const [tests, setTests] = React.useState<ABTest[]>(sampleTests)
  const [userAssignments, setUserAssignments] = React.useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`abTestAssignments_${userId}`)
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })
  
  const [isEnabled, setIsEnabled] = React.useState(true)
  const [showDebugMode, setShowDebugMode] = React.useState(false)
  const [selectedTest, setSelectedTest] = React.useState<string>("")
  
  // Save assignments to localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`abTestAssignments_${userId}`, JSON.stringify(userAssignments))
    }
  }, [userAssignments, userId])
  
  // Assign user to test variants
  const assignUserToTest = React.useCallback((testId: string): string => {
    // Check if user already assigned
    if (userAssignments[testId]) {
      return userAssignments[testId]
    }
    
    const test = tests.find(t => t.id === testId)
    if (!test || test.status !== "running") {
      return ""
    }
    
    // Weighted random assignment
    const random = Math.random() * 100
    let cumulative = 0
    
    for (const variant of test.variants) {
      cumulative += variant.weight
      if (random <= cumulative) {
        setUserAssignments(prev => ({
          ...prev,
          [testId]: variant.id
        }))
        
        // Track assignment
        trackTestAssignment(testId, variant.id)
        
        return variant.id
      }
    }
    
    // Fallback to control variant
    const controlVariant = test.variants.find(v => v.isControl)
    if (controlVariant) {
      setUserAssignments(prev => ({
        ...prev,
        [testId]: controlVariant.id
      }))
      return controlVariant.id
    }
    
    return ""
  }, [tests, userAssignments])
  
  // Get variant configuration
  const getVariantConfig = React.useCallback((testId: string, variantId?: string): Record<string, any> => {
    const test = tests.find(t => t.id === testId)
    if (!test) return {}
    
    const assignedVariantId = variantId || userAssignments[testId] || assignUserToTest(testId)
    const variant = test.variants.find(v => v.id === assignedVariantId)
    
    return variant?.config || {}
  }, [tests, userAssignments, assignUserToTest])
  
  // Track test assignment
  const trackTestAssignment = (testId: string, variantId: string) => {
    if (!isEnabled) return
    
    const event = {
      type: "ab_test_assignment",
      testId,
      variantId,
      userId,
      sessionId,
      timestamp: new Date()
    }
    
    // In production, send to analytics service
    console.log("AB Test Assignment:", event)
  }
  
  // Track test interaction
  const trackTestInteraction = React.useCallback((
    testId: string,
    interactionType: string,
    value?: number,
    metadata?: Record<string, any>
  ) => {
    if (!isEnabled) return
    
    const variantId = userAssignments[testId]
    if (!variantId) return
    
    const event = {
      type: "ab_test_interaction",
      testId,
      variantId,
      interactionType,
      value,
      metadata,
      userId,
      sessionId,
      timestamp: new Date()
    }
    
    // In production, send to analytics service
    console.log("AB Test Interaction:", event)
  }, [isEnabled, userAssignments, userId, sessionId])
  
  // Hook for components to use A/B testing
  const useABTest = React.useCallback((testId: string) => {
    const variantId = userAssignments[testId] || assignUserToTest(testId)
    const config = getVariantConfig(testId, variantId)
    
    return {
      variantId,
      config,
      track: (interactionType: string, value?: number, metadata?: Record<string, any>) =>
        trackTestInteraction(testId, interactionType, value, metadata)
    }
  }, [userAssignments, assignUserToTest, getVariantConfig, trackTestInteraction])
  
  // Calculate sample test results (mock data)
  const calculateTestResults = (test: ABTest): ABTestResult[] => {
    return test.variants.map(variant => {
      const participants = Math.floor(Math.random() * 500) + 100
      const conversionRate = 0.1 + Math.random() * 0.2 // 10-30%
      const conversions = Math.floor(participants * conversionRate)
      
      // Calculate statistical significance (simplified)
      const pValue = Math.random() * 0.1
      const isSignificant = pValue < 0.05
      
      const controlVariant = test.variants.find(v => v.isControl)
      const controlRate = controlVariant?.id === variant.id ? conversionRate : 0.15
      const percentChange = ((conversionRate - controlRate) / controlRate) * 100
      
      return {
        testId: test.id,
        variantId: variant.id,
        metric: test.metrics[0].id,
        participants,
        conversions,
        conversionRate,
        pValue,
        isSignificant,
        percentChange: variant.isControl ? 0 : percentChange,
        confidenceInterval: [
          conversionRate - 0.02,
          conversionRate + 0.02
        ] as [number, number]
      }
    })
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TestTube className="h-5 w-5 text-blue-600" />
              A/B Testing Framework
            </CardTitle>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDebugMode(!showDebugMode)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Label htmlFor="ab-enabled">Enabled</Label>
                <Switch
                  id="ab-enabled"
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        {/* Debug Mode */}
        {showDebugMode && isAdmin && (
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Label>Force Assignment:</Label>
                <Select value={selectedTest} onValueChange={setSelectedTest}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select test" />
                  </SelectTrigger>
                  <SelectContent>
                    {tests.map(test => (
                      <SelectItem key={test.id} value={test.id}>
                        {test.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTest && (
                  <Select
                    value={userAssignments[selectedTest] || ""}
                    onValueChange={(variantId) => {
                      setUserAssignments(prev => ({
                        ...prev,
                        [selectedTest]: variantId
                      }))
                      toast.success("Assignment updated")
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {tests.find(t => t.id === selectedTest)?.variants.map(variant => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                Current Assignments: {JSON.stringify(userAssignments, null, 2)}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Active Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tests.filter(test => test.status === "running").map(test => (
          <TestCard
            key={test.id}
            test={test}
            userVariant={userAssignments[test.id]}
            results={calculateTestResults(test)}
            isAdmin={isAdmin}
          />
        ))}
      </div>
      
      {/* Test Management (Admin Only) */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Test Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" className="w-full">
              <TabsList>
                <TabsTrigger value="active">Active Tests</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active">
                <div className="space-y-2">
                  {tests.filter(t => t.status === "running").map(test => (
                    <TestManagementRow key={test.id} test={test} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="completed">
                <div className="space-y-2">
                  {tests.filter(t => t.status === "completed").map(test => (
                    <TestManagementRow key={test.id} test={test} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="draft">
                <div className="space-y-2">
                  {tests.filter(t => t.status === "draft").map(test => (
                    <TestManagementRow key={test.id} test={test} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Test Card Component
function TestCard({
  test,
  userVariant,
  results,
  isAdmin
}: {
  test: ABTest
  userVariant?: string
  results: ABTestResult[]
  isAdmin: boolean
}) {
  const assignedVariant = test.variants.find(v => v.id === userVariant)
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">{test.name}</h3>
            <p className="text-xs text-gray-500">{test.description}</p>
          </div>
          <Badge variant={
            test.status === "running" ? "default" :
            test.status === "completed" ? "secondary" :
            "outline"
          }>
            {test.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* User Assignment */}
        {assignedVariant && (
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">
                You're in: {assignedVariant.name}
              </span>
            </div>
          </div>
        )}
        
        {/* Variants */}
        <div className="space-y-2">
          {test.variants.map(variant => {
            const result = results.find(r => r.variantId === variant.id)
            return (
              <div
                key={variant.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded border",
                  variant.id === userVariant && "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    variant.isControl ? "bg-gray-400" : "bg-purple-500"
                  )} />
                  <div>
                    <p className="text-xs font-medium">{variant.name}</p>
                    <p className="text-xs text-gray-500">{variant.weight}% traffic</p>
                  </div>
                </div>
                
                {isAdmin && result && (
                  <div className="text-right">
                    <p className="text-xs font-medium">
                      {(result.conversionRate! * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.participants} users
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Results Summary (Admin Only) */}
        {isAdmin && results.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Primary Metric</span>
              <span className="font-medium">{test.metrics[0]?.name}</span>
            </div>
            
            {results.map(result => {
              if (result.variantId === test.variants.find(v => v.isControl)?.id) return null
              
              return (
                <div key={result.variantId} className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    vs Control:
                  </span>
                  <div className="flex items-center gap-1">
                    {result.percentChange! > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={cn(
                      "text-xs font-medium",
                      result.percentChange! > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {result.percentChange! > 0 ? "+" : ""}{result.percentChange!.toFixed(1)}%
                    </span>
                    {result.isSignificant && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Test Management Row Component
function TestManagementRow({ test }: { test: ABTest }) {
  const totalParticipants = Math.floor(Math.random() * 1000) + 200
  const progress = (totalParticipants / test.targetSampleSize) * 100
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">{test.name}</h4>
          <div className="flex gap-1">
            {test.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
          <span>{test.variants.length} variants</span>
          <span>{totalParticipants} participants</span>
          <span>{progress.toFixed(0)}% complete</span>
        </div>
        
        <Progress value={Math.min(100, progress)} className="h-1 mt-2" />
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {test.status === "running" ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {test.status === "running" ? "Pause Test" : "Resume Test"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Square className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Hook for components to use A/B testing
export function useABTest(testId: string) {
  const [assignment, setAssignment] = React.useState<string>("")
  const [config, setConfig] = React.useState<Record<string, any>>({})
  
  React.useEffect(() => {
    // This would normally get the assignment from the ABTestingFramework context
    // For now, we'll use a simple random assignment
    const variant = Math.random() > 0.5 ? "control" : "variant"
    setAssignment(variant)
    setConfig({ variant })
  }, [testId])
  
  const track = React.useCallback((event: string, value?: number) => {
    // Track A/B test interaction
    console.log(`AB Test ${testId} - ${assignment}: ${event}`, value)
  }, [testId, assignment])
  
  return { variant: assignment, config, track }
}