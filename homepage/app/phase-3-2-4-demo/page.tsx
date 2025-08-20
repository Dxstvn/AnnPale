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
  FunnelChart,
  Funnel,
  RadialBarChart,
  RadialBar
} from "recharts"
import {
  ArrowLeft,
  Users,
  UserCheck,
  UserPlus,
  MapPin,
  Globe,
  Calendar,
  Star,
  Heart,
  MessageSquare,
  Share2,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Eye,
  BarChart3,
  PieChart as PieIcon,
  Navigation,
  ArrowRight,
  ArrowDown,
  ChevronRight,
  Download,
  RefreshCw,
  Filter,
  Settings,
  Info,
  CheckCircle,
  AlertTriangle,
  Zap,
  Award,
  Crown,
  Gift,
  Sparkles,
  Brain,
  Lightbulb,
  ThumbsUp,
  MessageCircle,
  Repeat,
  Timer,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AudienceInsightsInterface } from "@/components/creator/analytics/audience-insights-interface"

// Demo data for visualizations
const segmentOverviewData = [
  { segment: "Demographics", customers: 805, engagement: 100, insights: "Geographic & age distribution", color: "#3B82F6" },
  { segment: "Behavior", customers: 685, engagement: 85, insights: "Journey flow patterns", color: "#10B981" },
  { segment: "Value", customers: 800, engagement: 60, insights: "Revenue contribution", color: "#8B5CF6" },
  { segment: "Satisfaction", customers: 500, engagement: 92, insights: "Quality perception", color: "#F59E0B" },
  { segment: "Growth", customers: 425, engagement: 78, insights: "Acquisition effectiveness", color: "#EC4899" }
]

const customerJourneyData = [
  { stage: "Discovery", customers: 1000, rate: 100, dropoff: 0 },
  { stage: "Profile View", customers: 850, rate: 85, dropoff: 15 },
  { stage: "Interest", customers: 420, rate: 49, dropoff: 36 },
  { stage: "First Booking", customers: 340, rate: 40, dropoff: 9 },
  { stage: "Return Visit", customers: 204, rate: 60, dropoff: 40 },
  { stage: "Repeat Book", customers: 119, rate: 35, dropoff: 25 },
  { stage: "Become Fan", customers: 51, rate: 15, dropoff: 20 }
]

const engagementTrendsData = [
  { metric: "View-to-Book", q1: 38.2, q2: 41.5, q3: 42.5, target: 45 },
  { metric: "Message Response", q1: 94.1, q2: 95.8, q3: 96.8, target: 98 },
  { metric: "Review Submission", q1: 81.2, q2: 79.8, q3: 78.4, target: 85 },
  { metric: "Sharing Frequency", q1: 19.8, q2: 21.2, q3: 23.6, target: 25 },
  { metric: "Referral Generation", q1: 12.4, q2: 14.1, q3: 15.8, target: 20 }
]

const loyaltyMetricsData = [
  { metric: "Repeat Booking", value: 58.2, change: 4.5, status: "good" },
  { metric: "Customer LTV", value: 285, change: 18.7, status: "excellent" },
  { metric: "Retention Rate", value: 67.5, change: -2.8, status: "warning" },
  { metric: "Advocacy Score", value: 8.4, change: 0.8, status: "good" }
]

const demographicsBreakdown = [
  { segment: "18-24", percentage: 18, customers: 145, revenue: 8200, color: "#3B82F6" },
  { segment: "25-34", percentage: 35, customers: 280, revenue: 18900, color: "#1D4ED8" },
  { segment: "35-44", percentage: 24, customers: 195, revenue: 15600, color: "#2563EB" },
  { segment: "45-54", percentage: 15, customers: 120, revenue: 9800, color: "#1E40AF" },
  { segment: "55+", percentage: 8, customers: 65, revenue: 4200, color: "#1E3A8A" }
]

const valueSegmentsData = [
  { name: "VIP Customers", ltv: 850, customers: 45, percentage: 5.6, color: "#8B5CF6" },
  { name: "Regular Customers", ltv: 320, customers: 180, percentage: 22.5, color: "#A855F7" },
  { name: "Occasional Customers", ltv: 145, customers: 285, percentage: 35.6, color: "#C084FC" },
  { name: "First-time Customers", ltv: 75, customers: 290, percentage: 36.3, color: "#DDD6FE" }
]

const satisfactionDistribution = [
  { rating: "5 Stars", count: 320, percentage: 64, nps: 85, color: "#10B981" },
  { rating: "4 Stars", count: 125, percentage: 25, nps: 15, color: "#84CC16" },
  { rating: "3 Stars", count: 35, percentage: 7, nps: -20, color: "#F59E0B" },
  { rating: "2 Stars", count: 15, percentage: 3, nps: -85, color: "#F97316" },
  { rating: "1 Star", count: 5, percentage: 1, nps: -100, color: "#EF4444" }
]

const acquisitionChannels = [
  { channel: "Social Media", customers: 185, cost: 45, ltv: 280, efficiency: 6.2 },
  { channel: "Referrals", customers: 125, cost: 12, ltv: 420, efficiency: 35.0 },
  { channel: "Search", customers: 95, cost: 85, ltv: 245, efficiency: 2.9 },
  { channel: "Direct", customers: 85, cost: 0, ltv: 380, efficiency: "∞" },
  { channel: "Email", customers: 65, cost: 15, ltv: 320, efficiency: 21.3 }
]

const COLORS = {
  primary: "#6366F1",
  secondary: "#06B6D4",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
  blue: "#3B82F6"
}

export default function Phase324Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [timeRange, setTimeRange] = React.useState<"30" | "90" | "180" | "365">("90")
  const [selectedSegment, setSelectedSegment] = React.useState("demographics")

  const handleSegmentSelect = (segmentId: string) => {
    setSelectedSegment(segmentId)
    console.log("Segment selected:", segmentId)
  }

  const handleActionTrigger = (action: string, segmentId: string) => {
    console.log("Action triggered:", action, "for segment:", segmentId)
  }

  const handleTimeRangeChange = (range: "30" | "90" | "180" | "365") => {
    setTimeRange(range)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.2.4 Demo</h1>
                <p className="text-sm text-gray-600">Audience Insights Interface</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Customer Analytics
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                Insights Interface
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
              <Users className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="journey" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Journey
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Engagement
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
                  <Users className="h-5 w-5 text-blue-600" />
                  Audience Segmentation Overview
                </CardTitle>
                <CardDescription>
                  Five key customer segments with engagement and insight metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Segment Distribution */}
                  <div>
                    <h4 className="font-semibold mb-4">Segment Distribution</h4>
                    <div className="space-y-3">
                      {segmentOverviewData.map((segment, index) => (
                        <motion.div
                          key={segment.segment}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: segment.color }}
                              />
                              <h5 className="font-medium">{segment.segment}</h5>
                            </div>
                            <Badge variant="outline">
                              {segment.customers} customers
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{segment.insights}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Engagement</span>
                            <span className="font-medium">{segment.engagement}%</span>
                          </div>
                          <Progress value={segment.engagement} className="h-2 mt-1" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Segment Visualization Types */}
                  <div>
                    <h4 className="font-semibold mb-4">Visualization Types</h4>
                    <div className="space-y-3">
                      {[
                        { segment: "Demographics", type: "Charts & Maps", usage: "Age, location, gender analysis", icon: BarChart3, color: "text-blue-600" },
                        { segment: "Behavior", type: "Flow Diagrams", usage: "Customer journey visualization", icon: Navigation, color: "text-green-600" },
                        { segment: "Value", type: "Cohort Grid", usage: "LTV and frequency analysis", icon: Users, color: "text-purple-600" },
                        { segment: "Satisfaction", type: "Rating Distribution", usage: "NPS and review analysis", icon: Star, color: "text-yellow-600" },
                        { segment: "Growth", type: "Acquisition Funnel", usage: "Channel effectiveness", icon: Target, color: "text-pink-600" }
                      ].map(({ segment, type, usage, icon: Icon, color }) => (
                        <div key={segment} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
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

            {/* Demographics & Value Segments */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Demographics Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={demographicsBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="percentage"
                          nameKey="segment"
                        >
                          {demographicsBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${value}%`, 'Share']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-purple-600" />
                    Value Segments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {valueSegmentsData.map((segment, index) => (
                      <motion.div
                        key={segment.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{segment.name}</h5>
                          <Badge 
                            variant="outline"
                            style={{ borderColor: segment.color, color: segment.color }}
                          >
                            {segment.customers} customers
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">LTV: ${segment.ltv}</span>
                          <span className="text-sm text-gray-600">{segment.percentage}%</span>
                        </div>
                        <Progress 
                          value={segment.percentage} 
                          className="h-2"
                          style={{ background: `${segment.color}20` }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Journey Tab */}
          <TabsContent value="journey" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-green-600" />
                  Customer Journey Flow
                </CardTitle>
                <CardDescription>
                  Typical customer path from discovery to becoming a fan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={customerJourneyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="customers"
                        stroke={COLORS.primary}
                        fill={COLORS.primary}
                        fillOpacity={0.3}
                        name="Customers"
                      />
                      <Area
                        type="monotone"
                        dataKey="rate"
                        stroke={COLORS.success}
                        fill={COLORS.success}
                        fillOpacity={0.3}
                        name="Conversion Rate (%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mt-6">
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">85%</div>
                      <div className="text-sm text-gray-600">Profile View Rate</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">40%</div>
                      <div className="text-sm text-gray-600">First Booking Rate</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">60%</div>
                      <div className="text-sm text-gray-600">Return Rate</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">15%</div>
                      <div className="text-sm text-gray-600">Fan Conversion</div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Journey Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    Optimization Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { stage: "Profile View", opportunity: "Add video samples", impact: "High", color: "text-red-600" },
                      { stage: "First Booking", opportunity: "Reduce friction", impact: "High", color: "text-red-600" },
                      { stage: "Return Visit", opportunity: "Follow-up emails", impact: "Medium", color: "text-yellow-600" },
                      { stage: "Repeat Book", opportunity: "Loyalty program", impact: "Medium", color: "text-yellow-600" },
                      { stage: "Become Fan", opportunity: "VIP treatment", impact: "Low", color: "text-green-600" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium">{item.stage}</div>
                          <div className="text-sm text-gray-600">{item.opportunity}</div>
                        </div>
                        <Badge variant="outline" className={item.color}>
                          {item.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Drop-off Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customerJourneyData.filter(stage => stage.dropoff > 0).map((stage, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{stage.stage}</span>
                          <span className="text-red-600 font-bold">{stage.dropoff}% drop-off</span>
                        </div>
                        <Progress value={100 - stage.dropoff} className="h-2" />
                        <div className="text-sm text-gray-600 mt-1">
                          {stage.customers} → {stage.customers - Math.round(stage.customers * stage.dropoff / 100)} customers
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Engagement Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Engagement Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={engagementTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="q1"
                          stroke={COLORS.danger}
                          strokeWidth={2}
                          name="Q1"
                        />
                        <Line
                          type="monotone"
                          dataKey="q2"
                          stroke={COLORS.warning}
                          strokeWidth={2}
                          name="Q2"
                        />
                        <Line
                          type="monotone"
                          dataKey="q3"
                          stroke={COLORS.success}
                          strokeWidth={2}
                          name="Q3 (Current)"
                        />
                        <Line
                          type="monotone"
                          dataKey="target"
                          stroke={COLORS.purple}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Target"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Loyalty Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-600" />
                    Loyalty Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loyaltyMetricsData.map((metric, index) => (
                      <motion.div
                        key={metric.metric}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{metric.metric}</h5>
                          <Badge 
                            variant="outline"
                            className={cn(
                              metric.status === "excellent" ? "text-green-600" :
                              metric.status === "good" ? "text-blue-600" :
                              metric.status === "warning" ? "text-yellow-600" :
                              "text-red-600"
                            )}
                          >
                            {metric.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">
                            {metric.metric === "Customer LTV" ? `$${metric.value}` : `${metric.value}%`}
                          </span>
                          <div className="flex items-center gap-1">
                            {metric.change > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className={cn(
                              "text-sm",
                              metric.change > 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {metric.change > 0 ? "+" : ""}{metric.change}%
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Satisfaction & Acquisition */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Satisfaction Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {satisfactionDistribution.map((rating, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: rating.color }}
                          />
                          <span className="text-sm">{rating.rating}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">{rating.count} ({rating.percentage}%)</span>
                          <Badge 
                            variant="outline"
                            className={cn(
                              rating.nps > 50 ? "text-green-600" :
                              rating.nps > 0 ? "text-yellow-600" :
                              "text-red-600"
                            )}
                          >
                            NPS: {rating.nps}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                    Acquisition Channels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {acquisitionChannels.map((channel, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{channel.channel}</span>
                          <Badge variant="outline">{channel.customers} customers</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">LTV: </span>
                            <span className="font-medium">${channel.ltv}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Cost: </span>
                            <span className="font-medium">${channel.cost}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">ROI: </span>
                            <span className="font-medium">{channel.efficiency}x</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Audience Insights Interface with 
                5 customer segments, customer journey visualization, engagement metrics tracking, and 
                loyalty indicators. Click segments to explore different visualizations and insights.
              </AlertDescription>
            </Alert>

            <AudienceInsightsInterface
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
              onSegmentSelect={handleSegmentSelect}
              onActionTrigger={handleActionTrigger}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}