"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  LineChart,
  ArrowUp,
  ArrowDown,
  Info,
  AlertCircle,
  CheckCircle,
  Calendar,
  Clock,
  Zap,
  Target,
  Award,
  ChevronRight,
  RefreshCw,
  Package
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

// Pricing analytics data interface
export interface PricingAnalyticsData {
  // Performance Metrics
  metrics: {
    currentPrice: number
    averageOrderValue: number
    rushDeliveryRate: number
    conversionRate: number
    bookingsThisMonth: number
    revenueThisMonth: number
    
    // Comparisons
    priceVsCategory: number // percentage difference
    conversionVsLastMonth: number // percentage change
    revenueVsLastMonth: number // percentage change
  }
  
  // Price Performance
  pricePerformance: Array<{
    price: number
    bookings: number
    revenue: number
    conversionRate: number
    date: Date
  }>
  
  // Optimization Insights
  insights: {
    optimalPrice: number
    projectedRevenue: number
    elasticityScore: number // 0-100
    demandLevel: "low" | "medium" | "high"
    recommendations: Array<{
      type: "increase" | "decrease" | "maintain" | "test"
      amount: number
      reasoning: string
      impact: string
    }>
  }
  
  // Rush Delivery Analytics
  rushAnalytics: {
    uptakeRate: number
    averageSurcharge: number
    rushRevenue: number
    peakHours: number[]
  }
  
  // Customer Segments
  segments: {
    firstTime: number
    returning: number
    gift: number
    rush: number
  }
}

interface PricingAnalyticsProps {
  data: PricingAnalyticsData
  onUpdatePrice?: (newPrice: number) => void
  onRunExperiment?: (type: string) => void
  className?: string
}

// Metric card component
function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  format = "number",
  trend
}: {
  title: string
  value: number
  change?: number
  icon: React.ElementType
  format?: "currency" | "percentage" | "number"
  trend?: "up" | "down" | "neutral"
}) {
  const formatValue = () => {
    switch (format) {
      case "currency":
        return `$${value.toLocaleString()}`
      case "percentage":
        return `${value}%`
      default:
        return value.toLocaleString()
    }
  }
  
  const getTrendColor = () => {
    if (!trend) return "text-gray-500"
    if (trend === "up") return "text-green-600"
    if (trend === "down") return "text-red-600"
    return "text-gray-500"
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{formatValue()}</p>
            {change !== undefined && (
              <div className={cn("flex items-center gap-1 text-sm", getTrendColor())}>
                {change > 0 ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                <span>{Math.abs(change)}%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-full",
            trend === "up" && "bg-green-100 text-green-600",
            trend === "down" && "bg-red-100 text-red-600",
            !trend && "bg-gray-100 text-gray-600"
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Price optimization card
function PriceOptimizationCard({
  current,
  optimal,
  insights,
  onUpdate
}: {
  current: number
  optimal: number
  insights: PricingAnalyticsData["insights"]
  onUpdate?: (price: number) => void
}) {
  const difference = optimal - current
  const percentChange = ((difference / current) * 100).toFixed(1)
  const isOptimal = Math.abs(difference) < 5
  
  return (
    <Card className={cn(
      "border-l-4",
      isOptimal ? "border-green-500" : "border-orange-500"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Price Optimization
        </CardTitle>
        <CardDescription>
          AI-powered pricing recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current vs Optimal */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Current Price</p>
            <p className="text-2xl font-bold">${current}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Optimal Price</p>
            <p className="text-2xl font-bold text-purple-600">${optimal}</p>
            {!isOptimal && (
              <p className="text-xs text-purple-600">
                {difference > 0 ? "+" : ""}{percentChange}% adjustment
              </p>
            )}
          </div>
        </div>
        
        {/* Elasticity Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Price Elasticity</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-[200px]">
                    How sensitive your customers are to price changes.
                    Lower score = less sensitive.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Progress value={insights.elasticityScore} className="h-2" />
          <p className="text-xs text-gray-500">
            {insights.elasticityScore < 30 && "Low sensitivity - room to increase"}
            {insights.elasticityScore >= 30 && insights.elasticityScore < 70 && "Moderate sensitivity"}
            {insights.elasticityScore >= 70 && "High sensitivity - be cautious"}
          </p>
        </div>
        
        {/* Projected Impact */}
        {!isOptimal && (
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm font-medium">Projected Monthly Revenue</p>
            <p className="text-2xl font-bold text-purple-600">
              ${insights.projectedRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {insights.projectedRevenue > insights.projectedRevenue * (current / optimal) 
                ? `+${((insights.projectedRevenue / (insights.projectedRevenue * (current / optimal)) - 1) * 100).toFixed(0)}% increase`
                : "Potential revenue impact"
              }
            </p>
          </div>
        )}
        
        {/* Recommendations */}
        {insights.recommendations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Recommendations</p>
            {insights.recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-1"
              >
                <div className="flex items-center gap-2">
                  {rec.type === "increase" && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {rec.type === "decrease" && <TrendingDown className="h-4 w-4 text-red-500" />}
                  {rec.type === "test" && <RefreshCw className="h-4 w-4 text-blue-500" />}
                  {rec.type === "maintain" && <CheckCircle className="h-4 w-4 text-gray-500" />}
                  <span className="text-sm font-medium capitalize">{rec.type} Price</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {rec.reasoning}
                </p>
                <p className="text-xs text-purple-600">
                  {rec.impact}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {/* Action Button */}
        {!isOptimal && onUpdate && (
          <Button
            className="w-full"
            onClick={() => onUpdate(optimal)}
          >
            Update to Optimal Price
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
        
        {isOptimal && (
          <Badge className="w-full justify-center bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Your pricing is optimized!
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

// Rush delivery analytics
function RushAnalytics({ data }: { data: PricingAnalyticsData["rushAnalytics"] }) {
  const peakHour = data.peakHours.sort((a, b) => b - a)[0]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-500" />
          Rush Delivery Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Uptake Rate</p>
            <p className="text-2xl font-bold">{data.uptakeRate}%</p>
            <p className="text-xs text-gray-500">of customers</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rush Revenue</p>
            <p className="text-2xl font-bold">${data.rushRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">this month</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-2">Average Surcharge</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">${data.averageSurcharge}</span>
            <Badge variant="secondary">per order</Badge>
          </div>
        </div>
        
        {data.peakHours.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Peak Hours</p>
            <div className="flex flex-wrap gap-2">
              {data.peakHours.slice(0, 3).map((hour) => (
                <Badge key={hour} variant="outline">
                  {hour}:00 - {hour + 1}:00
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Customer segments chart
function CustomerSegments({ segments }: { segments: PricingAnalyticsData["segments"] }) {
  const total = Object.values(segments).reduce((sum, val) => sum + val, 0)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Customer Segments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(segments).map(([segment, value]) => {
          const percentage = ((value / total) * 100).toFixed(1)
          const colors = {
            firstTime: "bg-green-500",
            returning: "bg-blue-500",
            gift: "bg-purple-500",
            rush: "bg-orange-500"
          }
          
          return (
            <div key={segment} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize">{segment.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="font-medium">{percentage}%</span>
              </div>
              <Progress
                value={Number(percentage)}
                className="h-2"
                // @ts-ignore - dynamic class assignment
                indicatorClassName={colors[segment as keyof typeof colors]}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// Main analytics dashboard
export function PricingAnalyticsDashboard({
  data,
  onUpdatePrice,
  onRunExperiment,
  className
}: PricingAnalyticsProps) {
  const [activeTab, setActiveTab] = React.useState("overview")
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monthly Revenue"
          value={data.metrics.revenueThisMonth}
          change={data.metrics.revenueVsLastMonth}
          icon={DollarSign}
          format="currency"
          trend={data.metrics.revenueVsLastMonth > 0 ? "up" : "down"}
        />
        <MetricCard
          title="Avg Order Value"
          value={data.metrics.averageOrderValue}
          icon={TrendingUp}
          format="currency"
          trend="neutral"
        />
        <MetricCard
          title="Conversion Rate"
          value={data.metrics.conversionRate}
          change={data.metrics.conversionVsLastMonth}
          icon={Target}
          format="percentage"
          trend={data.metrics.conversionVsLastMonth > 0 ? "up" : "down"}
        />
        <MetricCard
          title="Bookings"
          value={data.metrics.bookingsThisMonth}
          icon={Users}
          format="number"
          trend="up"
        />
      </div>
      
      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PriceOptimizationCard
              current={data.metrics.currentPrice}
              optimal={data.insights.optimalPrice}
              insights={data.insights}
              onUpdate={onUpdatePrice}
            />
            <RushAnalytics data={data.rushAnalytics} />
          </div>
        </TabsContent>
        
        <TabsContent value="optimization" className="space-y-4 mt-4">
          {/* Price experiments */}
          <Card>
            <CardHeader>
              <CardTitle>Price Experiments</CardTitle>
              <CardDescription>
                Test different pricing strategies to optimize revenue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onRunExperiment?.("ab_test")}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Run A/B Price Test
                <Badge className="ml-auto">Recommended</Badge>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onRunExperiment?.("time_based")}
              >
                <Clock className="h-4 w-4 mr-2" />
                Test Time-Based Pricing
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onRunExperiment?.("bundle")}
              >
                <Package className="h-4 w-4 mr-2" />
                Test Bundle Discounts
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="segments" className="space-y-4 mt-4">
          <CustomerSegments segments={data.segments} />
          
          {/* Segment-specific recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Segment Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.segments.firstTime > 30 && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium">High First-Time Customers</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Consider a first-time discount to improve conversion
                  </p>
                </div>
              )}
              {data.segments.rush > 25 && (
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm font-medium">Strong Rush Demand</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    You could increase rush surcharge by 10-15%
                  </p>
                </div>
              )}
              {data.segments.gift > 20 && (
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm font-medium">Popular for Gifts</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Promote gift options during holidays for higher revenue
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}