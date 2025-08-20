"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Gauge,
  Zap,
  Target,
  BarChart3,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Info,
  Download,
  RefreshCw,
  Settings,
  ChevronUp,
  ChevronDown,
  Server,
  Database,
  Network,
  HardDrive,
  Cpu
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PerformanceMetric {
  id: string
  name: string
  value: number
  unit: string
  target: number
  baseline: number
  percentile95: number
  percentile99: number
  samples: number
  trend: "improving" | "degrading" | "stable"
  history: number[]
}

interface ThroughputData {
  service: string
  current: number
  peak: number
  average: number
  capacity: number
  unit: string
}

interface ErrorMetric {
  type: string
  count: number
  rate: number
  impact: "high" | "medium" | "low"
  trend: "increasing" | "decreasing" | "stable"
  lastOccurrence: string
}

interface UserExperienceScore {
  category: string
  score: number
  weight: number
  metrics: {
    name: string
    value: number
    impact: number
  }[]
}

const performanceMetrics: PerformanceMetric[] = [
  {
    id: "response-time",
    name: "API Response Time",
    value: 145,
    unit: "ms",
    target: 200,
    baseline: 150,
    percentile95: 289,
    percentile99: 523,
    samples: 10234,
    trend: "improving",
    history: [160, 155, 150, 148, 145, 143, 145]
  },
  {
    id: "db-query",
    name: "Database Query Time",
    value: 23,
    unit: "ms",
    target: 50,
    baseline: 25,
    percentile95: 45,
    percentile99: 89,
    samples: 8932,
    trend: "stable",
    history: [24, 23, 25, 22, 23, 24, 23]
  },
  {
    id: "page-load",
    name: "Page Load Time",
    value: 1.8,
    unit: "s",
    target: 2.0,
    baseline: 2.1,
    percentile95: 2.5,
    percentile99: 3.2,
    samples: 5421,
    trend: "improving",
    history: [2.1, 2.0, 1.9, 1.9, 1.8, 1.8, 1.8]
  },
  {
    id: "cdn-latency",
    name: "CDN Latency",
    value: 89,
    unit: "ms",
    target: 100,
    baseline: 95,
    percentile95: 142,
    percentile99: 234,
    samples: 45230,
    trend: "improving",
    history: [95, 92, 90, 89, 88, 89, 89]
  }
]

const throughputData: ThroughputData[] = [
  {
    service: "API Gateway",
    current: 2340,
    peak: 3450,
    average: 2100,
    capacity: 5000,
    unit: "req/s"
  },
  {
    service: "Database",
    current: 892,
    peak: 1234,
    average: 750,
    capacity: 2000,
    unit: "queries/s"
  },
  {
    service: "Video Streaming",
    current: 156,
    peak: 234,
    average: 120,
    capacity: 500,
    unit: "streams"
  },
  {
    service: "File Upload",
    current: 45,
    peak: 89,
    average: 35,
    capacity: 200,
    unit: "MB/s"
  }
]

const errorMetrics: ErrorMetric[] = [
  {
    type: "4xx Errors",
    count: 234,
    rate: 0.2,
    impact: "low",
    trend: "stable",
    lastOccurrence: "2 minutes ago"
  },
  {
    type: "5xx Errors",
    count: 12,
    rate: 0.01,
    impact: "high",
    trend: "decreasing",
    lastOccurrence: "15 minutes ago"
  },
  {
    type: "Timeout Errors",
    count: 45,
    rate: 0.04,
    impact: "medium",
    trend: "increasing",
    lastOccurrence: "5 minutes ago"
  },
  {
    type: "Database Errors",
    count: 3,
    rate: 0.003,
    impact: "high",
    trend: "stable",
    lastOccurrence: "1 hour ago"
  }
]

const userExperienceScores: UserExperienceScore[] = [
  {
    category: "Performance",
    score: 88,
    weight: 40,
    metrics: [
      { name: "Page Speed", value: 92, impact: 35 },
      { name: "Interactivity", value: 85, impact: 30 },
      { name: "Visual Stability", value: 87, impact: 35 }
    ]
  },
  {
    category: "Availability",
    score: 99.5,
    weight: 30,
    metrics: [
      { name: "Uptime", value: 99.9, impact: 50 },
      { name: "Error Rate", value: 99.2, impact: 30 },
      { name: "Recovery Time", value: 99.3, impact: 20 }
    ]
  },
  {
    category: "Reliability",
    score: 94,
    weight: 30,
    metrics: [
      { name: "Success Rate", value: 95, impact: 40 },
      { name: "Data Integrity", value: 98, impact: 30 },
      { name: "Consistency", value: 89, impact: 30 }
    ]
  }
]

export function PerformanceMetrics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h")
  const [selectedMetric, setSelectedMetric] = useState("all")

  const getTrendIcon = (trend: string) => {
    if (trend === "improving" || trend === "decreasing") {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    }
    if (trend === "degrading" || trend === "increasing") {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPerformanceStatus = (metric: PerformanceMetric) => {
    const percentOfTarget = (metric.value / metric.target) * 100
    if (percentOfTarget <= 50) return { status: "excellent", color: "text-green-600" }
    if (percentOfTarget <= 75) return { status: "good", color: "text-blue-600" }
    if (percentOfTarget <= 100) return { status: "acceptable", color: "text-yellow-600" }
    return { status: "poor", color: "text-red-600" }
  }

  const overallScore = Math.round(
    userExperienceScores.reduce((acc, cat) => acc + (cat.score * cat.weight / 100), 0)
  )

  const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min
    const width = 100
    const height = 30
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    }).join(' ')

    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-blue-500"
        />
      </svg>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Metrics</h2>
          <p className="text-gray-600">System performance and user experience monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15m">Last 15 min</SelectItem>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* User Experience Score */}
      <Card>
        <CardHeader>
          <CardTitle>User Experience Score</CardTitle>
          <CardDescription>Overall platform performance from user perspective</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{overallScore}</span>
                <span className="text-lg text-gray-600">/100</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Overall Score</p>
            </div>
            <Badge className={cn(
              "text-lg px-4 py-2",
              overallScore >= 90 && "bg-green-100 text-green-800",
              overallScore >= 75 && overallScore < 90 && "bg-blue-100 text-blue-800",
              overallScore >= 60 && overallScore < 75 && "bg-yellow-100 text-yellow-800",
              overallScore < 60 && "bg-red-100 text-red-800"
            )}>
              {overallScore >= 90 ? "Excellent" : overallScore >= 75 ? "Good" : overallScore >= 60 ? "Fair" : "Poor"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userExperienceScores.map((category) => (
              <div key={category.category} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{category.category}</h4>
                  <span className="text-2xl font-bold">{category.score}</span>
                </div>
                <Progress value={category.score} className="h-2 mb-3" />
                <div className="space-y-2">
                  {category.metrics.map((metric) => (
                    <div key={metric.name} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{metric.name}</span>
                      <span className="font-medium">{metric.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="response" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="response">Response Times</TabsTrigger>
          <TabsTrigger value="throughput">Throughput</TabsTrigger>
          <TabsTrigger value="errors">Error Tracking</TabsTrigger>
          <TabsTrigger value="scalability">Scalability</TabsTrigger>
        </TabsList>

        <TabsContent value="response" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Time Analysis</CardTitle>
              <CardDescription>Service response times and latency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => {
                  const status = getPerformanceStatus(metric)
                  return (
                    <div key={metric.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {metric.name}
                            {getTrendIcon(metric.trend)}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {metric.samples.toLocaleString()} samples
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-2xl font-bold", status.color)}>
                            {metric.value}{metric.unit}
                          </p>
                          <p className="text-xs text-gray-500">Target: {metric.target}{metric.unit}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">Baseline</p>
                          <p className="font-medium">{metric.baseline}{metric.unit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">P95</p>
                          <p className="font-medium">{metric.percentile95}{metric.unit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">P99</p>
                          <p className="font-medium">{metric.percentile99}{metric.unit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Trend</p>
                          <Sparkline data={metric.history} />
                        </div>
                      </div>

                      <Progress 
                        value={(metric.value / metric.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="throughput" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Throughput Measurements</CardTitle>
              <CardDescription>Request processing and data transfer rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {throughputData.map((service) => (
                  <div key={service.service} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{service.service}</h4>
                      <Badge variant="outline">
                        {Math.round((service.current / service.capacity) * 100)}% utilization
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Current</p>
                        <p className="font-medium">{service.current.toLocaleString()} {service.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Average</p>
                        <p className="font-medium">{service.average.toLocaleString()} {service.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Peak</p>
                        <p className="font-medium">{service.peak.toLocaleString()} {service.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Capacity</p>
                        <p className="font-medium">{service.capacity.toLocaleString()} {service.unit}</p>
                      </div>
                    </div>

                    <Progress 
                      value={(service.current / service.capacity) * 100}
                      className={cn(
                        "h-2",
                        (service.current / service.capacity) > 0.8 && "bg-orange-100",
                        (service.current / service.capacity) > 0.9 && "bg-red-100"
                      )}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Rate Tracking</CardTitle>
              <CardDescription>System errors and failure analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorMetrics.map((error) => (
                  <div key={error.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <AlertCircle className={cn(
                        "h-5 w-5",
                        error.impact === "high" && "text-red-600",
                        error.impact === "medium" && "text-yellow-600",
                        error.impact === "low" && "text-green-600"
                      )} />
                      <div>
                        <h4 className="font-medium">{error.type}</h4>
                        <p className="text-sm text-gray-600">Last: {error.lastOccurrence}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold">{error.count}</p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">{error.rate}%</p>
                        <p className="text-xs text-gray-500">Rate</p>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Badge className={getImpactColor(error.impact)}>
                          {error.impact} impact
                        </Badge>
                        {getTrendIcon(error.trend)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scalability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scalability Metrics</CardTitle>
              <CardDescription>System capacity and scaling indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  System is currently operating at 47% capacity with good headroom for growth.
                  Auto-scaling is configured and ready to activate at 75% utilization.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Resource Utilization</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU Cores</span>
                        <span>16 / 32 cores</span>
                      </div>
                      <Progress value={50} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Memory</span>
                        <span>48 / 64 GB</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Storage</span>
                        <span>1.2 / 2 TB</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Network Bandwidth</span>
                        <span>4.5 / 10 Gbps</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Scaling Readiness</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Auto-scaling Enabled</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Scale-out Threshold</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Scale-in Threshold</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Max Instances</span>
                      <span className="font-medium">10</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}