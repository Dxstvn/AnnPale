"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  RadialBarChart,
  RadialBar
} from "recharts"
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieIcon,
  Target,
  Lightbulb,
  Brain,
  Sparkles,
  Activity,
  Calendar,
  Clock,
  Star,
  Award,
  Users,
  Eye,
  Settings,
  Download,
  Share2,
  RefreshCw,
  Filter,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Info,
  CheckCircle,
  AlertTriangle,
  Zap,
  Calculator,
  PiggyBank,
  Coins,
  HandCoins,
  Crown,
  Gift,
  Package,
  Truck,
  CreditCard,
  Receipt
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { RevenueAnalyticsDesign } from "@/components/creator/analytics/revenue-analytics-design"

// Demo data for visualizations
const revenueMetricsData = [
  { metric: "Total Revenue", value: 8420, target: 10000, achievement: 84.2 },
  { metric: "Avg Order Value", value: 85, target: 95, achievement: 89.5 },
  { metric: "Revenue per Day", value: 280, target: 320, achievement: 87.5 },
  { metric: "Growth Rate", value: 23.5, target: 25, achievement: 94.0 }
]

const revenueBreakdownData = [
  { name: "Base Services", value: 5400, percentage: 70, color: "#6B7280" },
  { name: "Add-ons", value: 1000, percentage: 20, color: "#EC4899" },
  { name: "Tips & Bonuses", value: 500, percentage: 10, color: "#F97316" }
]

const serviceBreakdownData = [
  { name: "Standard Videos", value: 3400, category: "Base", color: "#10B981" },
  { name: "Express Delivery", value: 1200, category: "Base", color: "#3B82F6" },
  { name: "Rush Orders", value: 800, category: "Base", color: "#8B5CF6" },
  { name: "Extended Videos", value: 600, category: "Add-on", color: "#EC4899" },
  { name: "Multiple Takes", value: 400, category: "Add-on", color: "#F472B6" },
  { name: "Customer Tips", value: 500, category: "Bonus", color: "#F97316" }
]

const forecastingData = [
  { month: "Jan", actual: 6800, projected: 6950, confidence: 100 },
  { month: "Feb", actual: 7200, projected: 7100, confidence: 100 },
  { month: "Mar", actual: 7600, projected: 7450, confidence: 100 },
  { month: "Apr", actual: 8100, projected: 8000, confidence: 100 },
  { month: "May", actual: 8420, projected: 8200, confidence: 100 },
  { month: "Jun", projected: 8850, confidence: 95 },
  { month: "Jul", projected: 9200, confidence: 88 },
  { month: "Aug", projected: 9600, confidence: 82 },
  { month: "Sep", projected: 10100, confidence: 76 },
  { month: "Oct", projected: 10500, confidence: 70 },
  { month: "Nov", projected: 11200, confidence: 65 },
  { month: "Dec", projected: 12000, confidence: 60 }
]

const optimizationImpactData = [
  { strategy: "Pricing Optimization", impact: 1200, effort: 2, confidence: 87 },
  { strategy: "Service Mix Balance", impact: 800, effort: 5, confidence: 82 },
  { strategy: "Peak Time Optimization", impact: 600, effort: 1, confidence: 93 },
  { strategy: "Upsell Automation", impact: 450, effort: 8, confidence: 75 },
  { strategy: "Segment Targeting", impact: 950, effort: 6, confidence: 79 }
]

const revenueGrowthData = [
  { period: "Q1", revenue: 21600, growth: 8.5 },
  { period: "Q2", revenue: 24300, growth: 12.5 },
  { period: "Q3", revenue: 27800, growth: 14.4 },
  { period: "Q4", revenue: 31200, growth: 12.2 }
]

const customerSegmentData = [
  { segment: "Premium ($100+)", count: 45, revenue: 6750, percentage: 35 },
  { segment: "Standard ($50-99)", count: 120, revenue: 8400, percentage: 55 },
  { segment: "Basic (<$50)", count: 85, revenue: 1270, percentage: 10 }
]

const COLORS = {
  primary: "#10B981",
  secondary: "#3B82F6", 
  tertiary: "#8B5CF6",
  warning: "#F59E0B",
  danger: "#EF4444",
  base: "#6B7280",
  addon: "#EC4899",
  tips: "#F97316"
}

export default function Phase323Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [timeRange, setTimeRange] = React.useState<"7" | "30" | "90" | "365">("30")

  const handleMetricClick = (metricId: string) => {
    console.log("Metric clicked:", metricId)
  }

  const handleOptimizationImplement = (suggestionId: string) => {
    console.log("Optimization implemented:", suggestionId)
  }

  const handleTimeRangeChange = (range: "7" | "30" | "90" | "365") => {
    setTimeRange(range)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/creator/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Phase 3.2.3 Demo</h1>
                <p className="text-sm text-gray-600">Revenue Analytics Design</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Financial Visualization
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Revenue Strategy
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieIcon className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="forecasting" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Forecasting
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Live Demo
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Revenue Metrics Framework
                </CardTitle>
                <CardDescription>
                  Five key financial visualizations with drill-down capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Revenue Metrics Summary */}
                  <div>
                    <h4 className="font-semibold mb-4">Key Revenue Metrics</h4>
                    <div className="space-y-3">
                      {revenueMetricsData.map((metric, index) => (
                        <motion.div
                          key={metric.metric}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{metric.metric}</h5>
                            <span className="text-green-600 font-bold">
                              {metric.metric.includes("Revenue") || metric.metric.includes("Value") 
                                ? `$${metric.value.toLocaleString()}` 
                                : `${metric.value}${metric.metric.includes("Rate") ? "%" : ""}`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Target Progress</span>
                            <span className="font-medium">{metric.achievement.toFixed(1)}%</span>
                          </div>
                          <Progress value={metric.achievement} className="h-2 mt-1" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue Visualization Types */}
                  <div>
                    <h4 className="font-semibold mb-4">Visualization Types</h4>
                    <div className="space-y-3">
                      {[
                        { type: "Line Graph", usage: "Total Revenue tracking", icon: Activity, color: "text-blue-600" },
                        { type: "Bar Chart", usage: "Average Order Value comparison", icon: BarChart3, color: "text-green-600" },
                        { type: "Heat Map", usage: "Revenue per Day calendar", icon: Calendar, color: "text-purple-600" },
                        { type: "Donut Chart", usage: "Service Mix distribution", icon: PieIcon, color: "text-pink-600" },
                        { type: "Trend Line", usage: "Growth Rate analysis", icon: TrendingUp, color: "text-orange-600" }
                      ].map(({ type, usage, icon: Icon, color }) => (
                        <div key={type} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
                          <Icon className={cn("h-5 w-5", color)} />
                          <div className="flex-1">
                            <div className="font-medium">{type}</div>
                            <div className="text-sm text-gray-600">{usage}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieIcon className="h-5 w-5 text-purple-600" />
                  Revenue Breakdown Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Service Category Breakdown */}
                  <div>
                    <h4 className="font-semibold mb-4">Service Categories</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={revenueBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                          >
                            {revenueBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Detailed Service Breakdown */}
                  <div>
                    <h4 className="font-semibold mb-4">Service Details</h4>
                    <div className="space-y-2">
                      {serviceBreakdownData.map((service, index) => (
                        <motion.div
                          key={service.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: service.color }}
                            />
                            <span className="text-sm">{service.name}</span>
                          </div>
                          <div className="text-sm font-medium">
                            ${service.value.toLocaleString()}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Revenue Growth Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Revenue Growth Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={revenueGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Bar 
                          yAxisId="left"
                          dataKey="revenue" 
                          fill={COLORS.primary} 
                          name="Revenue ($)"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="growth" 
                          stroke={COLORS.secondary} 
                          strokeWidth={3}
                          name="Growth Rate (%)"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Segment Revenue */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Customer Segment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerSegmentData.map((segment, index) => (
                      <motion.div
                        key={segment.segment}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{segment.segment}</h5>
                          <Badge variant="outline">{segment.count} customers</Badge>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Revenue</span>
                          <span className="font-bold text-green-600">
                            ${segment.revenue.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={segment.percentage * 2} className="h-2" />
                        <div className="text-xs text-gray-600 mt-1">
                          {segment.percentage}% of total revenue
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Optimization Impact Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Optimization Strategy Impact
                </CardTitle>
                <CardDescription>
                  Potential revenue impact vs implementation effort analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={optimizationImpactData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="strategy" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar 
                        yAxisId="left"
                        dataKey="impact" 
                        fill={COLORS.primary} 
                        name="Revenue Impact ($)"
                      />
                      <Bar 
                        yAxisId="right"
                        dataKey="effort" 
                        fill={COLORS.warning} 
                        name="Implementation Effort"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forecasting Tab */}
          <TabsContent value="forecasting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Predictive Revenue Forecasting
                </CardTitle>
                <CardDescription>
                  12-month revenue projection with confidence intervals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={forecastingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `$${value?.toLocaleString() || 0}`,
                          name === 'actual' ? 'Actual Revenue' : 'Projected Revenue'
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke={COLORS.primary}
                        fill={COLORS.primary}
                        fillOpacity={0.3}
                        name="Actual Revenue"
                      />
                      <Line
                        type="monotone"
                        dataKey="projected"
                        stroke={COLORS.secondary}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Projected Revenue"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4 mt-6">
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">$8.85k</div>
                      <div className="text-sm text-gray-600">Next Month</div>
                      <div className="text-xs text-green-600">95% confidence</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">$12k</div>
                      <div className="text-sm text-gray-600">Peak (Dec)</div>
                      <div className="text-xs text-orange-600">60% confidence</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">42.5%</div>
                      <div className="text-sm text-gray-600">Annual Growth</div>
                      <div className="text-xs text-blue-600">Projected YoY</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">$115k</div>
                      <div className="text-sm text-gray-600">Annual Total</div>
                      <div className="text-xs text-purple-600">2024 projection</div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Forecasting Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Forecasting Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { feature: "Next month projection", status: "Active", color: "text-green-600" },
                      { feature: "Seasonal adjustments", status: "Active", color: "text-green-600" },
                      { feature: "Growth trajectory", status: "Active", color: "text-green-600" },
                      { feature: "Goal tracking", status: "Enabled", color: "text-blue-600" },
                      { feature: "What-if scenarios", status: "Available", color: "text-purple-600" }
                    ].map(({ feature, status, color }) => (
                      <div key={feature} className="flex items-center justify-between">
                        <span className="text-sm">{feature}</span>
                        <Badge variant="outline" className={color}>
                          {status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Optimization Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { area: "Pricing recommendations", impact: "High", color: "text-red-600" },
                      { area: "Service mix optimization", impact: "High", color: "text-red-600" },
                      { area: "Peak time targeting", impact: "Medium", color: "text-yellow-600" },
                      { area: "Upsell opportunities", impact: "Medium", color: "text-yellow-600" },
                      { area: "Customer segment focus", impact: "Low", color: "text-green-600" }
                    ].map(({ area, impact, color }) => (
                      <div key={area} className="flex items-center justify-between">
                        <span className="text-sm">{area}</span>
                        <Badge variant="outline" className={color}>
                          {impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Revenue Analytics Design system with 
                5 key visualization types, predictive forecasting, revenue breakdown trees, and AI-powered 
                optimization suggestions. All features include drill-down capabilities and action triggers.
              </AlertDescription>
            </Alert>

            <RevenueAnalyticsDesign
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
              onMetricClick={handleMetricClick}
              onOptimizationImplement={handleOptimizationImplement}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}