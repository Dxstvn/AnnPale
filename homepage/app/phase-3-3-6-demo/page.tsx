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
  RadialBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ScatterChart,
  Scatter
} from "recharts"
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Package,
  Zap,
  Settings,
  Target,
  Percent,
  Brain,
  BarChart3,
  Info,
  Download,
  ChevronRight,
  Clock,
  Users,
  Award,
  Trophy,
  Shield,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Lock,
  Layers,
  Calculator,
  Gauge,
  Timer,
  Lightbulb,
  RefreshCw,
  Eye,
  Filter,
  Database,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Layout,
  Gift,
  Star,
  Hash,
  Tag
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { DynamicPricingManagement } from "@/components/creator/pricing/dynamic-pricing-management"

// Demo data for visualizations
const pricingModelComparison = [
  { model: "Fixed", revenue: 100, complexity: 20, adoption: 85 },
  { model: "Tiered", revenue: 125, complexity: 40, adoption: 65 },
  { model: "Dynamic", revenue: 145, complexity: 80, adoption: 35 },
  { model: "Seasonal", revenue: 135, complexity: 50, adoption: 45 },
  { model: "Package", revenue: 140, complexity: 45, adoption: 55 }
]

const priceOptimizationImpact = [
  { month: "Jan", baseline: 10000, optimized: 10000 },
  { month: "Feb", baseline: 10500, optimized: 11200 },
  { month: "Mar", baseline: 11000, optimized: 12800 },
  { month: "Apr", baseline: 10800, optimized: 13500 },
  { month: "May", baseline: 11200, optimized: 14800 },
  { month: "Jun", baseline: 11500, optimized: 15900 }
]

const abTestResults = [
  { test: "Price Point A", conversions: 234, revenue: 34866, confidence: 72 },
  { test: "Price Point B", conversions: 312, revenue: 46488, confidence: 95 },
  { test: "Bundle Test", conversions: 189, revenue: 75411, confidence: 88 },
  { test: "Rush Premium", conversions: 156, revenue: 31200, confidence: 91 }
]

const competitivePosition = [
  { competitor: "You", price: 149, quality: 4.8, bookings: 234 },
  { competitor: "Comp A", price: 129, quality: 4.5, bookings: 189 },
  { competitor: "Comp B", price: 179, quality: 4.9, bookings: 156 },
  { competitor: "Comp C", price: 99, quality: 4.2, bookings: 312 },
  { competitor: "Comp D", price: 159, quality: 4.6, bookings: 198 }
]

const elasticityAnalysis = [
  { price: 99, demand: 100, revenue: 9900 },
  { price: 119, demand: 92, revenue: 10948 },
  { price: 139, demand: 83, revenue: 11537 },
  { price: 149, demand: 78, revenue: 11622 },
  { price: 159, demand: 72, revenue: 11448 },
  { price: 179, demand: 65, revenue: 11635 },
  { price: 199, demand: 56, revenue: 11144 },
  { price: 219, demand: 48, revenue: 10512 },
  { price: 239, demand: 40, revenue: 9560 }
]

const modifierImpact = [
  { modifier: "Rush Delivery", usage: 145, revenue: 10875, growth: 32 },
  { modifier: "Extended Length", usage: 89, revenue: 2225, growth: 18 },
  { modifier: "Commercial Use", usage: 45, revenue: 6705, growth: 45 },
  { modifier: "Multiple Takes", usage: 67, revenue: 2010, growth: 12 },
  { modifier: "Premium Package", usage: 34, revenue: 5100, growth: 28 }
]

const discountEffectiveness = [
  { discount: "Bulk Booking", redemptions: 45, revenue: 18045, roi: 220 },
  { discount: "Repeat Customer", redemptions: 123, revenue: 41205, roi: 185 },
  { discount: "Referral", redemptions: 67, revenue: 22145, roi: 156 },
  { discount: "Early Bird", redemptions: 34, revenue: 10200, roi: 142 },
  { discount: "Seasonal", redemptions: 89, revenue: 26700, roi: 198 }
]

const revenueByStrategy = [
  { strategy: "Base Price", value: 45000, percentage: 45 },
  { strategy: "Modifiers", value: 25000, percentage: 25 },
  { strategy: "Dynamic Pricing", value: 15000, percentage: 15 },
  { strategy: "Packages", value: 10000, percentage: 10 },
  { strategy: "Seasonal", value: 5000, percentage: 5 }
]

const COLORS = {
  primary: "#3B82F6",
  secondary: "#10B981",
  tertiary: "#8B5CF6",
  quaternary: "#F97316",
  quinary: "#EC4899",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4"
}

export default function Phase336Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")

  const handleStrategyChange = (strategy: any) => {
    console.log("Strategy changed:", strategy)
  }

  const handleTestCreate = (test: any) => {
    console.log("Test created:", test)
  }

  const handlePriceUpdate = (price: number) => {
    console.log("Price updated:", price)
  }

  // Calculate totals
  const totalRevenue = revenueByStrategy.reduce((sum, s) => sum + s.value, 0)
  const avgTestConfidence = abTestResults.reduce((sum, t) => sum + t.confidence, 0) / abTestResults.length
  const totalModifierRevenue = modifierImpact.reduce((sum, m) => sum + m.revenue, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.3.6 Demo</h1>
                <p className="text-sm text-gray-600">Dynamic Pricing Management</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <DollarSign className="h-3 w-3 mr-1" />
                Pricing System
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                5 Models
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Models
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Optimization
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
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
                  Dynamic Pricing System Overview
                </CardTitle>
                <CardDescription>
                  Data-driven pricing optimization for maximum revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Revenue Impact */}
                  <div>
                    <h4 className="font-semibold mb-4">Revenue Impact Over Time</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={priceOptimizationImpact}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="baseline" stackId="1" stroke={COLORS.quaternary} fill={COLORS.quaternary} fillOpacity={0.5} name="Baseline" />
                          <Area type="monotone" dataKey="optimized" stackId="2" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.5} name="Optimized" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Revenue Breakdown */}
                  <div>
                    <h4 className="font-semibold mb-4">Revenue by Strategy</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={revenueByStrategy}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {revenueByStrategy.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {revenueByStrategy.map((item, index) => (
                        <div key={item.strategy} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: Object.values(COLORS)[index] }}
                          />
                          <span className="text-sm">{item.strategy}: {item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-green-600 mt-1">+38% optimized</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Order Value</p>
                      <p className="text-2xl font-bold">$178</p>
                      <p className="text-xs text-blue-600 mt-1">+19% increase</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Test Confidence</p>
                      <p className="text-2xl font-bold">{avgTestConfidence.toFixed(0)}%</p>
                      <p className="text-xs text-purple-600 mt-1">4 active tests</p>
                    </div>
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold">3.8%</p>
                      <p className="text-xs text-orange-600 mt-1">+0.6% this week</p>
                    </div>
                    <Target className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Model Comparison</CardTitle>
                <CardDescription>
                  Performance analysis of different pricing strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={pricingModelComparison}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="model" />
                      <PolarRadiusAxis angle={90} domain={[0, 150]} />
                      <Radar name="Revenue Index" dataKey="revenue" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.3} />
                      <Radar name="Complexity" dataKey="complexity" stroke={COLORS.danger} fill={COLORS.danger} fillOpacity={0.3} />
                      <Radar name="Adoption %" dataKey="adoption" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Model Details */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { model: "Fixed", icon: Lock, revenue: "Baseline", complexity: "Low", management: "Set once", best: "Simplicity" },
                { model: "Tiered", icon: Layers, revenue: "+20-30%", complexity: "Medium", management: "Occasional", best: "Service levels" },
                { model: "Dynamic", icon: Activity, revenue: "+30-50%", complexity: "High", management: "Algorithm", best: "Max revenue" },
                { model: "Seasonal", icon: Calendar, revenue: "+25-40%", complexity: "Medium", management: "Calendar", best: "Events" },
                { model: "Package", icon: Package, revenue: "+35% AOV", complexity: "Medium", management: "Strategic", best: "Bundles" }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.model}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Icon className="h-4 w-4" />
                        {item.model} Pricing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Revenue Impact:</span>
                        <Badge variant="outline">{item.revenue}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Complexity:</span>
                        <span className="font-medium">{item.complexity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Management:</span>
                        <span className="font-medium">{item.management}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">Best for: <span className="font-medium text-gray-700">{item.best}</span></p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pricing Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Structure Hierarchy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Base Price */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Base Price: $149
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">Foundation pricing for standard service</p>
                  </div>

                  {/* Modifiers */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Modifiers
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Rush delivery: +50% ($75)
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Extended length: +$25/min
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Multiple takes: +$30
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Commercial use: 2x base
                      </li>
                    </ul>
                  </div>

                  {/* Discounts */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Discounts
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Bulk booking: -10%
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Repeat customer: -15%
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Promotional: -20%
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Referral: -10%
                      </li>
                    </ul>
                  </div>

                  {/* Dynamic Factors */}
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Dynamic Factors
                    </h5>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        High demand: +25%
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Low availability: +30%
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Special occasion: +20%
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Off-peak: -15%
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            {/* Elasticity Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  Price Elasticity & Revenue Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={elasticityAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="price" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Area yAxisId="left" type="monotone" dataKey="demand" fill={COLORS.primary} fillOpacity={0.3} stroke={COLORS.primary} name="Demand" />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={COLORS.success} strokeWidth={3} name="Revenue" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-900/20">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Optimal Price Point:</strong> $179 maximizes revenue at $11,635 with 65 expected bookings
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Competitive Position */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Competitive Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="price" name="Price" unit="$" />
                      <YAxis dataKey="quality" name="Quality Rating" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Market Position" data={competitivePosition} fill={COLORS.tertiary}>
                        {competitivePosition.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.competitor === "You" ? COLORS.success : COLORS.tertiary} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-4">
                  <Card className="border-blue-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Market Position</p>
                      <p className="text-xl font-bold">60th percentile</p>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">vs Competition</p>
                      <p className="text-xl font-bold text-green-600">+7.2%</p>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Opportunity</p>
                      <p className="text-xl font-bold">$20-30</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* A/B Test Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  A/B Testing Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {abTestResults.map((test) => (
                    <div key={test.test} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{test.test}</h5>
                        <Badge 
                          variant={test.confidence >= 95 ? "default" : test.confidence >= 85 ? "secondary" : "outline"}
                        >
                          {test.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Conversions:</span>
                          <span className="ml-2 font-medium">{test.conversions}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Revenue:</span>
                          <span className="ml-2 font-medium">${test.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                      <Progress value={test.confidence} className="mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Modifier Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-green-600" />
                  Price Modifier Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modifierImpact}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="modifier" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="usage" fill={COLORS.primary} name="Usage Count" />
                      <Bar dataKey="revenue" fill={COLORS.success} name="Revenue ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium">Total Modifier Revenue: ${totalModifierRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 mt-1">Contributing 27% of total revenue</p>
                </div>
              </CardContent>
            </Card>

            {/* Discount Effectiveness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-purple-600" />
                  Discount ROI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {discountEffectiveness.map((discount) => (
                    <div key={discount.discount} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h5 className="font-medium text-sm">{discount.discount}</h5>
                        <p className="text-xs text-gray-500">{discount.redemptions} redemptions</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">${(discount.revenue / 1000).toFixed(1)}K</p>
                          <p className="text-xs text-gray-500">revenue</p>
                        </div>
                        <Badge variant={discount.roi > 180 ? "default" : "secondary"}>
                          {discount.roi}% ROI
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-orange-600" />
                  Pricing Intelligence Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Revenue Opportunity:</strong> Increasing base price to $179 could generate +23% revenue based on elasticity analysis
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Competitive Advantage:</strong> Your quality rating (4.8) justifies premium pricing 20% above market average
                  </AlertDescription>
                </Alert>

                <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                  <Package className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Bundle Opportunity:</strong> 3-video packages show 35% higher AOV with minimal conversion impact
                  </AlertDescription>
                </Alert>

                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Seasonal Strategy:</strong> December pricing (+40%) generates 2.3x normal revenue with stable demand
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Dynamic Pricing Management system with 
                5 pricing models (Fixed, Tiered, Dynamic, Seasonal, Package), A/B testing capabilities, 
                competitive intelligence, and revenue maximization tools.
              </AlertDescription>
            </Alert>

            <DynamicPricingManagement
              onStrategyChange={handleStrategyChange}
              onTestCreate={handleTestCreate}
              onPriceUpdate={handlePriceUpdate}
              enableABTesting={true}
              enableCompetitiveIntel={true}
              enableRevenuMax={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}