"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import {
  Beaker,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  BarChart3,
  Eye,
  MousePointer,
  DollarSign,
  Clock,
  Shuffle,
  Copy,
  Plus,
  ChevronRight,
  Award
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { format, differenceInDays } from "date-fns"

// A/B Test types
export interface ABTest {
  id: string
  name: string
  description: string
  type: "result_layout" | "ranking_algorithm" | "autocomplete" | "filter_presentation" | "visual_elements"
  status: "draft" | "running" | "paused" | "completed"
  variants: TestVariant[]
  metrics: TestMetric[]
  traffic: number // Percentage of traffic
  startDate?: Date
  endDate?: Date
  winner?: string
  confidence?: number
}

export interface TestVariant {
  id: string
  name: string
  description: string
  config: Record<string, any>
  traffic: number // Percentage of test traffic
  results?: VariantResults
}

export interface VariantResults {
  impressions: number
  conversions: number
  conversionRate: number
  averageOrderValue: number
  revenue: number
  clickThroughRate: number
  bounceRate: number
  timeOnPage: number
}

export interface TestMetric {
  name: string
  type: "primary" | "secondary"
  goal: "maximize" | "minimize"
  value?: number
  improvement?: number
}

// Statistical significance
export interface StatisticalResults {
  pValue: number
  confidence: number
  significant: boolean
  sampleSize: number
  powerAnalysis: number
}

interface SearchABTestingProps {
  tests?: ABTest[]
  onCreateTest?: (test: ABTest) => void
  onUpdateTest?: (testId: string, updates: Partial<ABTest>) => void
  onStartTest?: (testId: string) => void
  onStopTest?: (testId: string) => void
  enableAutoOptimization?: boolean
  className?: string
}

// Generate mock test data
const generateMockTests = (): ABTest[] => [
  {
    id: "test_1",
    name: "Grid vs List Layout",
    description: "Testing different result layouts for conversion",
    type: "result_layout",
    status: "running",
    variants: [
      {
        id: "control",
        name: "Grid Layout (Control)",
        description: "Current 3-column grid layout",
        config: { layout: "grid", columns: 3 },
        traffic: 50,
        results: {
          impressions: 12543,
          conversions: 1254,
          conversionRate: 10.0,
          averageOrderValue: 75,
          revenue: 94050,
          clickThroughRate: 42.3,
          bounceRate: 24.5,
          timeOnPage: 145
        }
      },
      {
        id: "variant_a",
        name: "List Layout",
        description: "Single column list with larger images",
        config: { layout: "list", imageSize: "large" },
        traffic: 50,
        results: {
          impressions: 12456,
          conversions: 1495,
          conversionRate: 12.0,
          averageOrderValue: 78,
          revenue: 116610,
          clickThroughRate: 45.6,
          bounceRate: 22.1,
          timeOnPage: 162
        }
      }
    ],
    metrics: [
      { name: "Conversion Rate", type: "primary", goal: "maximize", value: 11.0, improvement: 20 },
      { name: "Click-through Rate", type: "secondary", goal: "maximize", value: 43.95, improvement: 7.8 },
      { name: "Bounce Rate", type: "secondary", goal: "minimize", value: 23.3, improvement: -9.8 }
    ],
    traffic: 20,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    confidence: 95
  },
  {
    id: "test_2",
    name: "Autocomplete Algorithms",
    description: "Testing predictive vs instant autocomplete",
    type: "autocomplete",
    status: "completed",
    variants: [
      {
        id: "control",
        name: "Instant Match",
        description: "Show results immediately on first letter",
        config: { algorithm: "instant", debounce: 0 },
        traffic: 50,
        results: {
          impressions: 8934,
          conversions: 803,
          conversionRate: 9.0,
          averageOrderValue: 70,
          revenue: 56210,
          clickThroughRate: 38.5,
          bounceRate: 28.3,
          timeOnPage: 120
        }
      },
      {
        id: "variant_a",
        name: "Predictive",
        description: "ML-based predictive suggestions",
        config: { algorithm: "ml_predictive", debounce: 150 },
        traffic: 50,
        results: {
          impressions: 8867,
          conversions: 975,
          conversionRate: 11.0,
          averageOrderValue: 72,
          revenue: 70200,
          clickThroughRate: 44.2,
          bounceRate: 25.6,
          timeOnPage: 138
        }
      }
    ],
    metrics: [
      { name: "Conversion Rate", type: "primary", goal: "maximize", value: 10.0, improvement: 22.2 }
    ],
    traffic: 15,
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    winner: "variant_a",
    confidence: 98
  }
]

export function SearchABTesting({
  tests = generateMockTests(),
  onCreateTest,
  onUpdateTest,
  onStartTest,
  onStopTest,
  enableAutoOptimization = false,
  className
}: SearchABTestingProps) {
  const [selectedTest, setSelectedTest] = React.useState<ABTest | null>(tests[0] || null)
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [newTest, setNewTest] = React.useState<Partial<ABTest>>({
    name: "",
    description: "",
    type: "result_layout",
    traffic: 10,
    variants: []
  })

  // Calculate statistical significance
  const calculateSignificance = React.useCallback((
    control: VariantResults,
    variant: VariantResults
  ): StatisticalResults => {
    // Simplified statistical calculation
    const controlRate = control.conversionRate / 100
    const variantRate = variant.conversionRate / 100
    const pooledRate = (control.conversions + variant.conversions) / 
                      (control.impressions + variant.impressions)
    
    const standardError = Math.sqrt(
      pooledRate * (1 - pooledRate) * 
      (1 / control.impressions + 1 / variant.impressions)
    )
    
    const zScore = (variantRate - controlRate) / standardError
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)))
    const confidence = (1 - pValue) * 100
    
    return {
      pValue,
      confidence,
      significant: pValue < 0.05,
      sampleSize: control.impressions + variant.impressions,
      powerAnalysis: 0.8 // Simplified
    }
  }, [])

  // Normal CDF approximation
  const normalCDF = (z: number): number => {
    const t = 1 / (1 + 0.2316419 * Math.abs(z))
    const d = 0.3989423 * Math.exp(-z * z / 2)
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return z > 0 ? 1 - p : p
  }

  // Get test status color
  const getStatusColor = (status: ABTest["status"]) => {
    switch (status) {
      case "running": return "bg-green-100 text-green-700 dark:bg-green-900/30"
      case "paused": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30"
      case "completed": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30"
      case "draft": return "bg-gray-100 text-gray-700 dark:bg-gray-900/30"
    }
  }

  // Create new test
  const createTest = React.useCallback(() => {
    if (!newTest.name || !newTest.description) {
      toast.error("Please fill in all required fields")
      return
    }

    const test: ABTest = {
      id: `test_${Date.now()}`,
      name: newTest.name,
      description: newTest.description,
      type: newTest.type as ABTest["type"],
      status: "draft",
      variants: [
        {
          id: "control",
          name: "Control",
          description: "Current implementation",
          config: {},
          traffic: 50
        },
        {
          id: "variant_a",
          name: "Variant A",
          description: "Test variation",
          config: {},
          traffic: 50
        }
      ],
      metrics: [
        { name: "Conversion Rate", type: "primary", goal: "maximize" }
      ],
      traffic: newTest.traffic || 10
    }

    onCreateTest?.(test)
    setShowCreateDialog(false)
    setNewTest({
      name: "",
      description: "",
      type: "result_layout",
      traffic: 10,
      variants: []
    })
    toast.success("A/B test created")
  }, [newTest, onCreateTest])

  // Calculate test duration
  const getTestDuration = (test: ABTest): string => {
    if (!test.startDate) return "Not started"
    const end = test.endDate || new Date()
    const days = differenceInDays(end, test.startDate)
    return `${days} days`
  }

  // Get winning variant
  const getWinningVariant = (test: ABTest): TestVariant | null => {
    if (test.status !== "completed" || !test.winner) return null
    return test.variants.find(v => v.id === test.winner) || null
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Beaker className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle className="text-xl">A/B Testing</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimize search experience through experimentation
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {enableAutoOptimization && (
                <Badge variant="secondary" className="text-xs">
                  <Shuffle className="h-3 w-3 mr-1" />
                  Auto-optimize
                </Badge>
              )}
              
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Test
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Active Tests */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <Card
            key={test.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg",
              selectedTest?.id === test.id && "ring-2 ring-purple-600"
            )}
            onClick={() => setSelectedTest(test)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm">{test.name}</CardTitle>
                  <p className="text-xs text-gray-600 mt-1">{test.description}</p>
                </div>
                <Badge className={getStatusColor(test.status)}>
                  {test.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {/* Metrics */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Primary Metric</span>
                  <div className="flex items-center gap-1">
                    {test.metrics[0]?.improvement && test.metrics[0].improvement > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className="text-sm font-medium">
                      {test.metrics[0]?.improvement 
                        ? `${test.metrics[0].improvement > 0 ? "+" : ""}${test.metrics[0].improvement}%`
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* Traffic allocation */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Traffic</span>
                    <span>{test.traffic}%</span>
                  </div>
                  <Progress value={test.traffic} className="h-1" />
                </div>

                {/* Confidence */}
                {test.confidence && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Confidence</span>
                    <Badge variant="outline" className="text-xs">
                      {test.confidence}%
                    </Badge>
                  </div>
                )}

                {/* Duration */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Duration</span>
                  <span className="text-xs">{getTestDuration(test)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {test.status === "draft" && (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        onStartTest?.(test.id)
                        toast.success("Test started")
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  )}
                  
                  {test.status === "running" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        onStopTest?.(test.id)
                        toast.success("Test paused")
                      }}
                    >
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </Button>
                  )}
                  
                  {test.status === "completed" && test.winner && (
                    <Badge variant="default" className="flex-1 justify-center">
                      <Award className="h-3 w-3 mr-1" />
                      Winner: {test.winner}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Details */}
      {selectedTest && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{selectedTest.name}</CardTitle>
              <Badge className={getStatusColor(selectedTest.status)}>
                {selectedTest.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="results" className="space-y-4">
              <TabsList>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="variants">Variants</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Results Tab */}
              <TabsContent value="results">
                <div className="space-y-4">
                  {/* Variant comparison */}
                  {selectedTest.variants.map((variant) => (
                    <Card key={variant.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{variant.name}</CardTitle>
                          <Badge variant="outline">
                            {variant.traffic}% traffic
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {variant.results ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-600">Impressions</p>
                              <p className="text-lg font-bold">
                                {variant.results.impressions.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Conversions</p>
                              <p className="text-lg font-bold">
                                {variant.results.conversions.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Conv. Rate</p>
                              <p className="text-lg font-bold">
                                {variant.results.conversionRate.toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Revenue</p>
                              <p className="text-lg font-bold">
                                ${variant.results.revenue.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No results yet</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {/* Statistical significance */}
                  {selectedTest.variants.length === 2 && 
                   selectedTest.variants[0].results && 
                   selectedTest.variants[1].results && (
                    <Card className="bg-blue-50 dark:bg-blue-900/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Statistical Significance</span>
                          </div>
                          
                          {(() => {
                            const stats = calculateSignificance(
                              selectedTest.variants[0].results,
                              selectedTest.variants[1].results
                            )
                            return (
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant={stats.significant ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {stats.significant ? "Significant" : "Not Significant"}
                                </Badge>
                                <span className="text-sm">
                                  {stats.confidence.toFixed(1)}% confidence
                                </span>
                                <span className="text-xs text-gray-500">
                                  p-value: {stats.pValue.toFixed(4)}
                                </span>
                              </div>
                            )
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Variants Tab */}
              <TabsContent value="variants">
                <div className="space-y-4">
                  {selectedTest.variants.map((variant) => (
                    <Card key={variant.id}>
                      <CardHeader>
                        <CardTitle className="text-sm">{variant.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{variant.description}</p>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Configuration</Label>
                          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <pre className="text-xs font-mono">
                              {JSON.stringify(variant.config, null, 2)}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Label className="text-xs">Traffic Allocation</Label>
                          <Slider
                            value={[variant.traffic]}
                            onValueChange={(value) => {
                              // Update variant traffic
                            }}
                            max={100}
                            step={5}
                            className="mt-2"
                          />
                          <span className="text-xs text-gray-500">
                            {variant.traffic}% of test traffic
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Performance Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={[
                          { day: "Day 1", control: 8.5, variant: 9.2 },
                          { day: "Day 2", control: 9.1, variant: 10.5 },
                          { day: "Day 3", control: 9.8, variant: 11.2 },
                          { day: "Day 4", control: 10.0, variant: 11.8 },
                          { day: "Day 5", control: 9.9, variant: 12.0 },
                          { day: "Day 6", control: 10.1, variant: 12.3 },
                          { day: "Day 7", control: 10.0, variant: 12.0 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="control"
                          stroke="#9333ea"
                          strokeWidth={2}
                          name="Control"
                        />
                        <Line
                          type="monotone"
                          dataKey="variant"
                          stroke="#ec4899"
                          strokeWidth={2}
                          name="Variant A"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardContent className="space-y-4 pt-6">
                    <div>
                      <Label>Test Name</Label>
                      <Input
                        value={selectedTest.name}
                        className="mt-1"
                        disabled={selectedTest.status !== "draft"}
                      />
                    </div>
                    
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={selectedTest.description}
                        className="mt-1"
                        disabled={selectedTest.status !== "draft"}
                      />
                    </div>
                    
                    <div>
                      <Label>Traffic Allocation</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          value={[selectedTest.traffic]}
                          max={100}
                          step={5}
                          className="flex-1"
                          disabled={selectedTest.status === "completed"}
                        />
                        <span className="text-sm font-medium w-12">
                          {selectedTest.traffic}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Auto-stop on significance</Label>
                      <Switch disabled={selectedTest.status === "completed"} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Create Test Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create A/B Test</DialogTitle>
            <DialogDescription>
              Set up a new experiment to optimize search performance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Test Name</Label>
              <Input
                value={newTest.name}
                onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                placeholder="e.g., Grid vs List Layout"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={newTest.description}
                onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                placeholder="What are you testing and why?"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Test Type</Label>
              <Select
                value={newTest.type}
                onValueChange={(value) => setNewTest({ ...newTest, type: value as ABTest["type"] })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="result_layout">Result Layout</SelectItem>
                  <SelectItem value="ranking_algorithm">Ranking Algorithm</SelectItem>
                  <SelectItem value="autocomplete">Autocomplete Strategy</SelectItem>
                  <SelectItem value="filter_presentation">Filter Presentation</SelectItem>
                  <SelectItem value="visual_elements">Visual Elements</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Traffic Allocation</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[newTest.traffic || 10]}
                  onValueChange={(value) => setNewTest({ ...newTest, traffic: value[0] })}
                  max={50}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12">
                  {newTest.traffic || 10}%
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createTest}>
              Create Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Export A/B testing utilities
export const ABTestingUtils = {
  selectVariant: (test: ABTest, userId: string): TestVariant => {
    // Simple hash-based variant selection
    const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const random = hash % 100
    
    let cumulativeTraffic = 0
    for (const variant of test.variants) {
      cumulativeTraffic += variant.traffic
      if (random < cumulativeTraffic) {
        return variant
      }
    }
    
    return test.variants[0] // Fallback to control
  },

  trackEvent: (testId: string, variantId: string, event: string, value?: number) => {
    // Track test events
    console.log(`A/B Test Event: ${testId}/${variantId} - ${event}`, value)
  }
}