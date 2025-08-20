"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  MessageSquare,
  Clock,
  TrendingUp,
  Users,
  Heart,
  CheckCircle,
  BarChart3,
  Activity,
  Target,
  Zap,
  AlertCircle,
  ThumbsUp,
  MessageCircle,
  Send,
  Mail,
  Phone,
  Video,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Info,
  Star,
  UserCheck,
  Repeat,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { format, subDays, startOfWeek, endOfWeek } from "date-fns"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts"

// Communication KPIs interface
export interface CommunicationKPI {
  id: string
  name: string
  measurement: string
  current: number
  target: number
  unit: string
  trend: "up" | "down" | "stable"
  trendValue: number
  impact: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

// Communication KPIs data
export const communicationKPIs: CommunicationKPI[] = [
  {
    id: "response_rate",
    name: "Response Rate",
    measurement: "% messages answered",
    current: 96.5,
    target: 95,
    unit: "%",
    trend: "up",
    trendValue: 2.3,
    impact: "Customer satisfaction",
    icon: MessageSquare,
    color: "text-blue-600"
  },
  {
    id: "response_time",
    name: "Response Time",
    measurement: "Average hours",
    current: 3.2,
    target: 4,
    unit: "hrs",
    trend: "down",
    trendValue: -18,
    impact: "Booking conversion",
    icon: Clock,
    color: "text-green-600"
  },
  {
    id: "message_volume",
    name: "Message Volume",
    measurement: "Daily average",
    current: 127,
    target: 150,
    unit: "msgs",
    trend: "stable",
    trendValue: 0.5,
    impact: "Creator burnout",
    icon: Mail,
    color: "text-purple-600"
  },
  {
    id: "sentiment_score",
    name: "Sentiment Score",
    measurement: "Positive %",
    current: 88.3,
    target: 85,
    unit: "%",
    trend: "up",
    trendValue: 3.2,
    impact: "Brand reputation",
    icon: Heart,
    color: "text-pink-600"
  },
  {
    id: "resolution_rate",
    name: "Resolution Rate",
    measurement: "First contact",
    current: 82.7,
    target: 80,
    unit: "%",
    trend: "up",
    trendValue: 5.1,
    impact: "Efficiency",
    icon: CheckCircle,
    color: "text-green-600"
  },
  {
    id: "engagement_rate",
    name: "Engagement Rate",
    measurement: "Active conversations",
    current: 234,
    target: 200,
    unit: "active",
    trend: "up",
    trendValue: 12,
    impact: "Relationship depth",
    icon: Users,
    color: "text-orange-600"
  }
]

// Weekly communication pattern data
const weeklyPatternData = [
  { day: "Monday", messages: 185, responseTime: 2.8, sentiment: 85 },
  { day: "Tuesday", messages: 142, responseTime: 3.1, sentiment: 87 },
  { day: "Wednesday", messages: 118, responseTime: 3.5, sentiment: 89 },
  { day: "Thursday", messages: 156, responseTime: 3.2, sentiment: 86 },
  { day: "Friday", messages: 192, responseTime: 2.9, sentiment: 88 },
  { day: "Saturday", messages: 78, responseTime: 4.2, sentiment: 91 },
  { day: "Sunday", messages: 65, responseTime: 4.5, sentiment: 92 }
]

// Channel distribution data
const channelData = [
  { name: "In-app Messages", value: 45, color: "#8b5cf6" },
  { name: "Email", value: 28, color: "#3b82f6" },
  { name: "SMS", value: 15, color: "#10b981" },
  { name: "Video Call", value: 8, color: "#f59e0b" },
  { name: "Phone", value: 4, color: "#ef4444" }
]

// Message types distribution
const messageTypesData = [
  { type: "Booking Inquiries", count: 342, percentage: 28 },
  { type: "General Questions", count: 298, percentage: 24 },
  { type: "Technical Support", count: 186, percentage: 15 },
  { type: "Feedback", count: 148, percentage: 12 },
  { type: "Complaints", count: 74, percentage: 6 },
  { type: "Praise/Thanks", count: 185, percentage: 15 }
]

// Efficiency metrics data
const efficiencyMetrics = {
  templateUsage: 68,
  automationRate: 42,
  avgTimePerConversation: 8.5,
  bulkMessageImpact: 3.2,
  channelPreferences: {
    inApp: 45,
    email: 28,
    sms: 15,
    video: 8,
    phone: 4
  }
}

// Quality indicators data
const qualityIndicators = {
  customerSatisfaction: 4.6,
  conversationDepth: 3.8,
  problemResolution: 82,
  repeatEngagement: 67,
  referralGeneration: 23
}

// Communication trends over time
const communicationTrends = [
  { month: "Jan", messages: 2890, responseRate: 94, satisfaction: 4.3 },
  { month: "Feb", messages: 3124, responseRate: 95, satisfaction: 4.4 },
  { month: "Mar", messages: 3456, responseRate: 96, satisfaction: 4.5 },
  { month: "Apr", messages: 3289, responseRate: 95.5, satisfaction: 4.5 },
  { month: "May", messages: 3678, responseRate: 96.5, satisfaction: 4.6 },
  { month: "Jun", messages: 3892, responseRate: 97, satisfaction: 4.6 }
]

// Peak hours data
const peakHoursData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  messages: Math.floor(Math.random() * 50) + 10 + (i >= 9 && i <= 17 ? 30 : 0),
  responseTime: 2 + Math.random() * 3
}))

// Template performance data
const templatePerformance = [
  { name: "Welcome Message", usage: 234, responseRate: 92, satisfaction: 4.7 },
  { name: "Booking Confirmation", usage: 189, responseRate: 98, satisfaction: 4.8 },
  { name: "Thank You", usage: 156, responseRate: 85, satisfaction: 4.5 },
  { name: "FAQ Response", usage: 142, responseRate: 78, satisfaction: 4.2 },
  { name: "Apology", usage: 45, responseRate: 88, satisfaction: 4.4 }
]

// KPI Card Component
function KPICard({ kpi }: { kpi: CommunicationKPI }) {
  const isAboveTarget = kpi.current >= kpi.target
  const performancePercentage = (kpi.current / kpi.target) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={cn("p-2 rounded-lg bg-gray-100", kpi.color)}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                kpi.trend === "up" && "text-green-600 border-green-300",
                kpi.trend === "down" && "text-red-600 border-red-300",
                kpi.trend === "stable" && "text-gray-600 border-gray-300"
              )}
            >
              {kpi.trend === "up" && <ChevronUp className="h-3 w-3 mr-1" />}
              {kpi.trend === "down" && <ChevronDown className="h-3 w-3 mr-1" />}
              {Math.abs(kpi.trendValue)}%
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">{kpi.name}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {kpi.current.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">{kpi.unit}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Target: {kpi.target}{kpi.unit}</span>
                <span className={cn(
                  "font-medium",
                  isAboveTarget ? "text-green-600" : "text-orange-600"
                )}>
                  {isAboveTarget ? "Above" : "Below"} target
                </span>
              </div>
              <Progress 
                value={Math.min(performancePercentage, 100)} 
                className="h-1.5"
              />
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Impact:</span> {kpi.impact}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Weekly pattern visualization component
function WeeklyPatternChart() {
  const maxMessages = Math.max(...weeklyPatternData.map(d => d.messages))
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Communication Flow</CardTitle>
        <CardDescription>Message volume patterns throughout the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeklyPatternData.map((day) => (
            <div key={day.day} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium w-24">{day.day}:</span>
                <div className="flex-1 mx-4">
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div 
                        className={cn(
                          "h-6 rounded-full flex items-center justify-end pr-2 text-xs text-white font-medium",
                          day.messages >= 180 ? "bg-red-500" : 
                          day.messages >= 140 ? "bg-orange-500" : 
                          day.messages >= 100 ? "bg-blue-500" : 
                          "bg-gray-400"
                        )}
                        style={{ width: `${(day.messages / maxMessages) * 100}%` }}
                      >
                        {day.messages}
                      </div>
                    </div>
                    <span className="absolute -top-5 left-0 text-xs text-gray-500">
                      {day.messages >= 180 ? "Peak" : 
                       day.messages >= 140 ? "High" : 
                       day.messages >= 100 ? "Normal" : 
                       "Low"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span>{day.responseTime}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-gray-400" />
                    <span>{day.sentiment}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Pattern Insights</h4>
          <ul className="space-y-1 text-xs text-gray-600">
            <li>• Monday & Friday show peak activity (weekend follow-up/prep)</li>
            <li>• Weekend messages have higher sentiment but slower response</li>
            <li>• Optimal staffing needed Tuesday-Thursday for balance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// Efficiency metrics dashboard
function EfficiencyDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Efficiency Metrics</CardTitle>
        <CardDescription>Operational efficiency indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Template Usage</span>
              <span className="text-sm font-medium">{efficiencyMetrics.templateUsage}%</span>
            </div>
            <Progress value={efficiencyMetrics.templateUsage} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Automation Rate</span>
              <span className="text-sm font-medium">{efficiencyMetrics.automationRate}%</span>
            </div>
            <Progress value={efficiencyMetrics.automationRate} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {efficiencyMetrics.avgTimePerConversation} min
            </div>
            <p className="text-xs text-gray-600 mt-1">Avg Time per Conversation</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {efficiencyMetrics.bulkMessageImpact}x
            </div>
            <p className="text-xs text-gray-600 mt-1">Bulk Message Impact</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Channel Preferences</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Quality indicators component
function QualityIndicators() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Indicators</CardTitle>
        <CardDescription>Communication quality metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="font-medium">Customer Satisfaction</p>
                <p className="text-sm text-gray-600">Based on post-conversation surveys</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{qualityIndicators.customerSatisfaction}/5</div>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(qualityIndicators.customerSatisfaction) 
                        ? "fill-yellow-500 text-yellow-500" 
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <span className="text-xs text-green-600">+5%</span>
              </div>
              <div className="text-xl font-bold">{qualityIndicators.conversationDepth}</div>
              <p className="text-xs text-gray-600">Avg Messages per Thread</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-xs text-green-600">+3%</span>
              </div>
              <div className="text-xl font-bold">{qualityIndicators.problemResolution}%</div>
              <p className="text-xs text-gray-600">Problem Resolution Rate</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Repeat className="h-5 w-5 text-purple-500" />
                <span className="text-xs text-orange-600">-2%</span>
              </div>
              <div className="text-xl font-bold">{qualityIndicators.repeatEngagement}%</div>
              <p className="text-xs text-gray-600">Repeat Engagement</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-pink-500" />
                <span className="text-xs text-green-600">+8%</span>
              </div>
              <div className="text-xl font-bold">{qualityIndicators.referralGeneration}%</div>
              <p className="text-xs text-gray-600">Referral Generation</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Message Type Distribution</h4>
          <div className="space-y-2">
            {messageTypesData.map((type) => (
              <div key={type.type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{type.type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <Progress value={type.percentage} className="h-2" />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{type.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main communication analytics component
export function CommunicationAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState("week")
  const [selectedTab, setSelectedTab] = React.useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Communication Analytics</h1>
          <p className="text-gray-600">Data-driven insights into communication patterns and effectiveness</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {communicationKPIs.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Communication trends */}
            <Card>
              <CardHeader>
                <CardTitle>Communication Trends</CardTitle>
                <CardDescription>6-month trend analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={communicationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="messages" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Messages"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="responseRate" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Response Rate %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Peak hours heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Communication Hours</CardTitle>
                <CardDescription>24-hour activity pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="messages" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Template performance */}
          <Card>
            <CardHeader>
              <CardTitle>Template Performance</CardTitle>
              <CardDescription>Effectiveness of message templates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={templatePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usage" fill="#8b5cf6" name="Usage Count" />
                  <Bar dataKey="responseRate" fill="#10b981" name="Response Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <WeeklyPatternChart />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Distribution</CardTitle>
                <CardDescription>Communication channel preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time by Channel</CardTitle>
                <CardDescription>Average response times across channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">In-app Messages</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">2.3 hrs</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">4.8 hrs</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">SMS</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">1.2 hrs</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Video Call</span>
                    </div>
                    <span className="text-sm font-bold text-orange-600">0.5 hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EfficiencyDashboard />
            
            <Card>
              <CardHeader>
                <CardTitle>Automation Impact</CardTitle>
                <CardDescription>Effect of automation on efficiency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Time Saved</span>
                    <span className="text-lg font-bold text-green-600">127 hrs/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Messages Automated</span>
                    <span className="text-lg font-bold text-blue-600">1,234/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cost Reduction</span>
                    <span className="text-lg font-bold text-purple-600">32%</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3">Automation Categories</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Welcome Messages</span>
                      <Progress value={85} className="w-24 h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">FAQ Responses</span>
                      <Progress value={72} className="w-24 h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Booking Confirmations</span>
                      <Progress value={95} className="w-24 h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Follow-ups</span>
                      <Progress value={58} className="w-24 h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <QualityIndicators />
          
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>Customer sentiment trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyPatternData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="sentiment" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                    name="Sentiment Score %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Insights</CardTitle>
              <CardDescription>AI-powered recommendations for improvement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">High Performance Areas</h4>
                    <ul className="mt-2 space-y-1 text-sm text-green-800">
                      <li>• Response rate exceeds target by 1.5% - maintain current practices</li>
                      <li>• First contact resolution at 82.7% - above industry average</li>
                      <li>• Weekend sentiment scores are consistently high (91-92%)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">Areas for Improvement</h4>
                    <ul className="mt-2 space-y-1 text-sm text-orange-800">
                      <li>• Template usage at 68% - increase to reduce response time</li>
                      <li>• Automation rate at 42% - potential for 20% improvement</li>
                      <li>• Weekend response times slower - consider scheduling adjustments</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Recommendations</h4>
                    <ul className="mt-2 space-y-1 text-sm text-blue-800">
                      <li>• Implement AI chatbot for FAQ handling - save 30+ hrs/week</li>
                      <li>• Create templates for top 5 complaint types</li>
                      <li>• Add staff during Monday/Friday peaks</li>
                      <li>• Optimize email response workflow - current lag at 4.8 hrs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>Future trends and projections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <ArrowUpRight className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">+23%</div>
                  <p className="text-sm text-gray-600">Expected message volume</p>
                  <p className="text-xs text-gray-500 mt-1">Next 30 days</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">4.7/5</div>
                  <p className="text-sm text-gray-600">Projected satisfaction</p>
                  <p className="text-xs text-gray-500 mt-1">With optimizations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}