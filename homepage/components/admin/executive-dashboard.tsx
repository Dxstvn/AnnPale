"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Video,
  Target,
  AlertCircle,
  CheckCircle,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  RefreshCw,
  Settings,
  ChevronUp,
  ChevronDown,
  Star,
  ShieldCheck,
  Zap,
  Globe,
  Clock,
  Award
} from "lucide-react"
import { cn } from "@/lib/utils"

interface KPIMetric {
  name: string
  value: string | number
  change: number
  changeType: "increase" | "decrease"
  target?: number
  unit?: string
  sparkline?: number[]
  status: "excellent" | "good" | "warning" | "critical"
}

interface PlatformHealth {
  overall: number
  categories: {
    performance: number
    security: number
    reliability: number
    userSatisfaction: number
  }
  issues: Array<{
    severity: "critical" | "high" | "medium" | "low"
    title: string
    impact: string
  }>
}

interface StrategicGoal {
  id: string
  title: string
  progress: number
  target: string
  deadline: string
  status: "on_track" | "at_risk" | "delayed" | "completed"
  keyResults: Array<{
    metric: string
    current: number
    target: number
  }>
}

const kpiMetrics: KPIMetric[] = [
  {
    name: "Monthly Revenue",
    value: "$125,430",
    change: 15.3,
    changeType: "increase",
    target: 130000,
    unit: "$",
    sparkline: [100, 105, 110, 108, 115, 120, 125],
    status: "excellent"
  },
  {
    name: "Active Users",
    value: "45,892",
    change: 8.7,
    changeType: "increase",
    target: 50000,
    sparkline: [40, 41, 42, 43, 44, 45, 46],
    status: "good"
  },
  {
    name: "Creator Count",
    value: "1,247",
    change: 12.4,
    changeType: "increase",
    target: 1500,
    sparkline: [1000, 1050, 1100, 1150, 1200, 1247],
    status: "good"
  },
  {
    name: "Video Completions",
    value: "8,934",
    change: -2.1,
    changeType: "decrease",
    target: 10000,
    sparkline: [9500, 9300, 9100, 9000, 8900, 8934],
    status: "warning"
  },
  {
    name: "Avg Rating",
    value: 4.7,
    change: 0.2,
    changeType: "increase",
    unit: "/5",
    sparkline: [4.5, 4.5, 4.6, 4.6, 4.7, 4.7],
    status: "excellent"
  },
  {
    name: "Response Time",
    value: "245ms",
    change: -15,
    changeType: "decrease",
    target: 200,
    unit: "ms",
    sparkline: [300, 280, 260, 250, 245, 245],
    status: "good"
  }
]

const platformHealth: PlatformHealth = {
  overall: 92,
  categories: {
    performance: 94,
    security: 96,
    reliability: 91,
    userSatisfaction: 88
  },
  issues: [
    {
      severity: "medium",
      title: "Increased API response times",
      impact: "5% of users experiencing delays"
    },
    {
      severity: "low",
      title: "Minor UI inconsistencies",
      impact: "Mobile app navigation"
    }
  ]
}

const strategicGoals: StrategicGoal[] = [
  {
    id: "goal-1",
    title: "Expand Creator Base to 2000",
    progress: 62,
    target: "2000 creators",
    deadline: "Q2 2024",
    status: "on_track",
    keyResults: [
      { metric: "Total Creators", current: 1247, target: 2000 },
      { metric: "Verified Creators", current: 892, target: 1500 },
      { metric: "Active Creators", current: 1034, target: 1800 }
    ]
  },
  {
    id: "goal-2",
    title: "Achieve $500K Monthly Revenue",
    progress: 25,
    target: "$500K MRR",
    deadline: "Q4 2024",
    status: "at_risk",
    keyResults: [
      { metric: "Monthly Revenue", current: 125430, target: 500000 },
      { metric: "Transaction Volume", current: 8934, target: 30000 },
      { metric: "Average Order Value", current: 45, target: 75 }
    ]
  },
  {
    id: "goal-3",
    title: "Launch International Markets",
    progress: 45,
    target: "5 new countries",
    deadline: "Q3 2024",
    status: "on_track",
    keyResults: [
      { metric: "Countries Launched", current: 2, target: 5 },
      { metric: "International Users", current: 5420, target: 15000 },
      { metric: "Localization Complete", current: 40, target: 100 }
    ]
  }
]

export function ExecutiveDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [refreshing, setRefreshing] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600"
      case "good": return "text-blue-600"
      case "warning": return "text-yellow-600"
      case "critical": return "text-red-600"
      case "on_track": return "bg-green-100 text-green-800"
      case "at_risk": return "bg-yellow-100 text-yellow-800"
      case "delayed": return "bg-red-100 text-red-800"
      case "completed": return "bg-blue-100 text-blue-800"
      default: return "text-gray-600"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

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
          <h2 className="text-2xl font-bold">Executive Dashboard</h2>
          <p className="text-gray-600">Platform performance overview and strategic insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">{metric.name}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xl font-bold">{metric.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {metric.changeType === "increase" ? (
                        <ArrowUpRight className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-600" />
                      )}
                      <span className={cn(
                        "text-xs font-medium",
                        metric.changeType === "increase" ? "text-green-600" : "text-red-600"
                      )}>
                        {Math.abs(metric.change)}%
                      </span>
                    </div>
                  </div>
                  <div className={getStatusColor(metric.status)}>
                    {metric.sparkline && <Sparkline data={metric.sparkline} />}
                  </div>
                </div>
                {metric.target && (
                  <Progress 
                    value={typeof metric.value === 'string' 
                      ? (parseFloat(metric.value.replace(/[^0-9.-]/g, '')) / metric.target) * 100
                      : (metric.value as number / metric.target) * 100
                    } 
                    className="h-1" 
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Health */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>System performance and reliability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{platformHealth.overall}%</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Healthy
                </Badge>
              </div>
              
              <div className="space-y-3">
                {Object.entries(platformHealth.categories).map(([category, value]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>

              {platformHealth.issues.length > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium mb-2">Active Issues</p>
                  <div className="space-y-2">
                    {platformHealth.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Badge className={cn("mt-0.5", getSeverityColor(issue.severity))}>
                          {issue.severity}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{issue.title}</p>
                          <p className="text-xs text-gray-500">{issue.impact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Strategic Goals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Strategic Goals Progress</CardTitle>
            <CardDescription>Quarterly objectives and key results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strategicGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge className={getStatusColor(goal.status)}>
                          {goal.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {goal.target}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {goal.deadline}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{goal.progress}%</p>
                    </div>
                  </div>
                  
                  <Progress value={goal.progress} className="h-2 mb-3" />
                  
                  <div className="grid grid-cols-3 gap-2">
                    {goal.keyResults.map((kr, idx) => (
                      <div key={idx} className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">{kr.metric}</p>
                        <p className="text-sm font-medium">
                          {kr.current.toLocaleString()} / {kr.target.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.round((kr.current / kr.target) * 100)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              User Insights
            </Button>
            <Button variant="outline" className="justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Financial Summary
            </Button>
            <Button variant="outline" className="justify-start">
              <Activity className="h-4 w-4 mr-2" />
              Performance Metrics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}