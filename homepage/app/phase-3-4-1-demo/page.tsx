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
  Scatter,
  Treemap
} from "recharts"
import {
  ArrowLeft,
  MessageSquare,
  Heart,
  Clock,
  Users,
  Star,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Volume2,
  VolumeX,
  Battery,
  BatteryLow,
  Zap,
  Coffee,
  Brain,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  User,
  UserCheck,
  UserX,
  UserPlus,
  Bell,
  BellOff,
  Calendar,
  Inbox,
  Send,
  Reply,
  Archive,
  Trash2,
  Flag,
  Filter,
  Search,
  Target,
  Gauge,
  Timer,
  Lightbulb,
  HelpCircle,
  Info,
  Sparkles,
  Smile,
  Frown,
  Meh,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Edit,
  Save,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Link,
  Share2,
  Bookmark,
  Tag,
  Hash,
  AtSign,
  Phone,
  Mail,
  MessageCircle,
  Video,
  Mic,
  MicOff,
  Camera,
  Headphones,
  Layout,
  Package,
  Navigation
} from "lucide-react"
import NextLink from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CommunicationPsychologyBoundaries } from "@/components/creator/communication/communication-psychology-boundaries"

// Demo data for visualizations
const relationshipDistribution = [
  { type: "First-time", count: 145, percentage: 45, energy: 2 },
  { type: "Repeat", count: 89, percentage: 28, energy: 3 },
  { type: "VIP/Superfan", count: 34, percentage: 11, energy: 4 },
  { type: "Business", count: 28, percentage: 9, energy: 3 },
  { type: "Problematic", count: 23, percentage: 7, energy: 5 }
]

const communicationPatterns = [
  { day: "Mon", messages: 45, responses: 42, avgTime: 2.3, satisfaction: 4.2 },
  { day: "Tue", messages: 52, responses: 48, avgTime: 2.8, satisfaction: 4.4 },
  { day: "Wed", messages: 38, responses: 35, avgTime: 3.1, satisfaction: 4.1 },
  { day: "Thu", messages: 61, responses: 58, avgTime: 2.1, satisfaction: 4.6 },
  { day: "Fri", messages: 49, responses: 46, avgTime: 2.5, satisfaction: 4.3 },
  { day: "Sat", messages: 23, responses: 21, avgTime: 4.2, satisfaction: 4.0 },
  { day: "Sun", messages: 18, responses: 17, avgTime: 5.1, satisfaction: 3.9 }
]

const boundaryEffectiveness = [
  { boundary: "Time Boundaries", violations: 12, effectiveness: 88, stress: "Low" },
  { boundary: "Volume Boundaries", violations: 23, effectiveness: 77, stress: "Medium" },
  { boundary: "Content Boundaries", violations: 5, effectiveness: 95, stress: "Low" },
  { boundary: "Emotional Boundaries", violations: 8, effectiveness: 92, stress: "Low" }
]

const energyMetrics = [
  { time: "9 AM", energy: 85, messages: 12, burnout: 15 },
  { time: "11 AM", energy: 78, messages: 18, burnout: 22 },
  { time: "1 PM", energy: 70, messages: 22, burnout: 30 },
  { time: "3 PM", energy: 65, messages: 25, burnout: 35 },
  { time: "5 PM", energy: 58, messages: 20, burnout: 42 },
  { time: "7 PM", energy: 52, messages: 15, burnout: 48 },
  { time: "9 PM", energy: 45, messages: 8, burnout: 55 }
]

const templatePerformance = [
  { template: "Professional Greeting", usage: 234, success: 95, timesSaved: 468 },
  { template: "Boundary Setting", usage: 89, success: 92, timesSaved: 178 },
  { template: "VIP Response", usage: 67, success: 98, timesSaved: 134 },
  { template: "Auto-Reply", usage: 156, success: 87, timesSaved: 312 },
  { template: "Escalation", usage: 23, success: 91, timesSaved: 46 },
  { template: "Closure", usage: 78, success: 94, timesSaved: 156 }
]

const customerSatisfactionByCommunication = [
  { style: "Professional", satisfaction: 4.2, retention: 85, referrals: 23 },
  { style: "Friendly", satisfaction: 4.6, retention: 92, referrals: 34 },
  { style: "Firm Boundaries", satisfaction: 4.1, retention: 88, referrals: 19 },
  { style: "Empathetic", satisfaction: 4.8, retention: 95, referrals: 41 },
  { style: "Automated", satisfaction: 3.9, retention: 78, referrals: 12 }
]

const burnoutPrevention = [
  { week: "W1", workload: 45, boundaries: 60, wellness: 70, burnout: 30 },
  { week: "W2", workload: 52, boundaries: 65, wellness: 68, burnout: 32 },
  { week: "W3", workload: 48, boundaries: 70, wellness: 72, burnout: 25 },
  { week: "W4", workload: 55, boundaries: 75, wellness: 75, burnout: 22 },
  { week: "W5", workload: 42, boundaries: 80, wellness: 78, burnout: 18 },
  { week: "W6", workload: 38, boundaries: 85, wellness: 82, burnout: 15 }
]

const parasocialManagement = [
  { indicator: "Personal Questions", frequency: 23, management: "Redirect", success: 89 },
  { indicator: "Emotional Dependency", frequency: 12, management: "Boundary", success: 94 },
  { indicator: "Excessive Contact", frequency: 18, management: "Limit", success: 87 },
  { indicator: "Inappropriate Requests", frequency: 7, management: "Block", success: 100 },
  { indicator: "Gift Offers", frequency: 15, management: "Decline", success: 92 }
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

export default function Phase341Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")

  const handleBoundaryUpdate = (boundary: any) => {
    console.log("Boundary updated:", boundary)
  }

  const handleTemplateUse = (template: any) => {
    console.log("Template used:", template)
  }

  const handleEnergyUpdate = (metrics: any) => {
    console.log("Energy updated:", metrics)
  }

  // Calculate totals
  const totalCustomers = relationshipDistribution.reduce((sum, r) => sum + r.count, 0)
  const avgEnergyRequirement = relationshipDistribution.reduce((sum, r) => sum + (r.energy * r.percentage / 100), 0)
  const totalBoundaryViolations = boundaryEffectiveness.reduce((sum, b) => sum + b.violations, 0)
  const avgBoundaryEffectiveness = boundaryEffectiveness.reduce((sum, b) => sum + b.effectiveness, 0) / boundaryEffectiveness.length
  const totalTemplateUsage = templatePerformance.reduce((sum, t) => sum + t.usage, 0)
  const avgTemplateSuccess = templatePerformance.reduce((sum, t) => sum + t.success, 0) / templatePerformance.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <NextLink href="/creator/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </NextLink>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Phase 3.4.1 Demo</h1>
                <p className="text-sm text-gray-600">Communication Psychology & Boundaries</p>
              </div>
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                <MessageSquare className="h-3 w-3 mr-1" />
                Psychology
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-rose-50 text-rose-700">
                Wellness Focused
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
            <TabsTrigger value="relationships" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Relationships
            </TabsTrigger>
            <TabsTrigger value="boundaries" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Boundaries
            </TabsTrigger>
            <TabsTrigger value="wellness" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wellness
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
                  <MessageSquare className="h-5 w-5 text-pink-600" />
                  Communication Psychology & Boundaries Overview
                </CardTitle>
                <CardDescription>
                  Healthy communication patterns balancing engagement with creator well-being
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Relationship Distribution */}
                  <div>
                    <h4 className="font-semibold mb-4">Customer Relationship Types</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={relationshipDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="count"
                          >
                            {relationshipDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {relationshipDistribution.map((item, index) => (
                        <div key={item.type} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: Object.values(COLORS)[index] }}
                          />
                          <span className="text-sm">{item.type}: {item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Communication Patterns */}
                  <div>
                    <h4 className="font-semibold mb-4">Weekly Communication Patterns</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={communicationPatterns}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Bar yAxisId="left" dataKey="messages" fill={COLORS.primary} name="Messages" />
                          <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke={COLORS.success} strokeWidth={3} name="Satisfaction" />
                        </ComposedChart>
                      </ResponsiveContainer>
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
                      <p className="text-sm text-gray-600">Total Customers</p>
                      <p className="text-2xl font-bold">{totalCustomers}</p>
                      <p className="text-xs text-green-600 mt-1">Active relationships</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Energy Need</p>
                      <p className="text-2xl font-bold">{avgEnergyRequirement.toFixed(1)}/5</p>
                      <p className="text-xs text-purple-600 mt-1">Creator investment</p>
                    </div>
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Boundary Health</p>
                      <p className="text-2xl font-bold">{avgBoundaryEffectiveness.toFixed(0)}%</p>
                      <p className="text-xs text-orange-600 mt-1">Effectiveness</p>
                    </div>
                    <Shield className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Template Success</p>
                      <p className="text-2xl font-bold">{avgTemplateSuccess.toFixed(0)}%</p>
                      <p className="text-xs text-green-600 mt-1">Automation rate</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Relationships Tab */}
          <TabsContent value="relationships" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Relationship Analysis</CardTitle>
                <CardDescription>
                  Understanding different communication dynamics and energy requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={customerSatisfactionByCommunication}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="style" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Satisfaction" dataKey="satisfaction" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} />
                      <Radar name="Retention" dataKey="retention" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Relationship Type Details */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { type: "First-time", frequency: "Single interaction", depth: "Surface", boundaries: "Professional", energy: "Low", icon: User, color: "bg-blue-500" },
                { type: "Repeat Customer", frequency: "Multiple touches", depth: "Building", boundaries: "Friendly professional", energy: "Medium", icon: UserCheck, color: "bg-green-500" },
                { type: "VIP/Superfan", frequency: "Regular contact", depth: "Deeper", boundaries: "Managed closeness", energy: "High", icon: Star, color: "bg-purple-500" },
                { type: "Business Client", frequency: "Project-based", depth: "Formal", boundaries: "Clear scope", energy: "Structured", icon: UserPlus, color: "bg-orange-500" },
                { type: "Problematic", frequency: "As needed", depth: "Minimal", boundaries: "Firm limits", energy: "Protective", icon: UserX, color: "bg-red-500" }
              ].map((relationship) => {
                const Icon = relationship.icon
                return (
                  <Card key={relationship.type}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <div className={cn("p-1 rounded", relationship.color)}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        {relationship.type}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <span className="text-gray-500">Frequency:</span>
                        <p className="mt-1">{relationship.frequency}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Depth:</span>
                        <p className="mt-1">{relationship.depth}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Boundaries:</span>
                        <p className="mt-1">{relationship.boundaries}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Creator Energy:</span>
                        <p className="mt-1 font-medium">{relationship.energy}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Parasocial Relationship Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Parasocial Relationship Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {parasocialManagement.map((item) => (
                    <div key={item.indicator} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h5 className="font-medium text-sm">{item.indicator}</h5>
                        <p className="text-xs text-gray-500">{item.frequency} instances this month</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{item.management}</p>
                          <p className="text-xs text-gray-500">Strategy</p>
                        </div>
                        <Badge variant={item.success > 95 ? "default" : "secondary"}>
                          {item.success}% success
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Alert className="mt-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Parasocial Awareness:</strong> Recognizing one-sided emotional connections helps maintain healthy boundaries
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Boundaries Tab */}
          <TabsContent value="boundaries" className="space-y-6">
            {/* Boundary Effectiveness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  Boundary Management Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={boundaryEffectiveness}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="boundary" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="effectiveness" fill={COLORS.success} name="Effectiveness %" />
                      <Bar dataKey="violations" fill={COLORS.danger} name="Violations" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Boundary Types */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Time Boundaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response hours: 9am-6pm</span>
                      <Badge variant="outline">88% effective</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekend policy: Limited</span>
                      <Badge variant="outline">92% effective</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Holiday mode: Auto-response</span>
                      <Badge variant="outline">95% effective</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Emergency only: Defined criteria</span>
                      <Badge variant="outline">97% effective</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Volume Boundaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Max daily messages: 50</span>
                      <Badge variant="outline">77% effective</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response length limits</span>
                      <Badge variant="outline">84% effective</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conversation caps</span>
                      <Badge variant="outline">89% effective</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Block/mute options</span>
                      <Badge variant="outline">100% effective</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Content Boundaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Professional topics only</span>
                      <Badge variant="outline">95% effective</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">No personal details</span>
                      <Badge variant="outline">92% effective</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Platform guidelines</span>
                      <Badge variant="outline">98% effective</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Escalation triggers</span>
                      <Badge variant="outline">94% effective</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Emotional Boundaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Parasocial awareness</span>
                      <Badge variant="outline">92% effective</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Emotional labor limits</span>
                      <Badge variant="outline">89% effective</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Support vs therapy</span>
                      <Badge variant="outline">96% effective</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Referral resources</span>
                      <Badge variant="outline">94% effective</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Template Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Communication Template Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templatePerformance.map((template) => (
                    <div key={template.template} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h5 className="font-medium text-sm">{template.template}</h5>
                        <p className="text-xs text-gray-500">Used {template.usage} times</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{template.timesSaved}min</p>
                          <p className="text-xs text-gray-500">Time saved</p>
                        </div>
                        <Badge variant={template.success > 94 ? "default" : "secondary"}>
                          {template.success}% success
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wellness Tab */}
          <TabsContent value="wellness" className="space-y-6">
            {/* Energy Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="h-5 w-5 text-green-600" />
                  Creator Energy & Burnout Prevention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={energyMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="energy" stackId="1" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.6} name="Energy Level" />
                      <Area type="monotone" dataKey="burnout" stackId="2" stroke={COLORS.danger} fill={COLORS.danger} fillOpacity={0.6} name="Burnout Risk" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Burnout Prevention Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Wellness Intervention Effectiveness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={burnoutPrevention}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="workload" stroke={COLORS.danger} strokeWidth={2} name="Workload" />
                      <Line type="monotone" dataKey="boundaries" stroke={COLORS.tertiary} strokeWidth={2} name="Boundaries" />
                      <Line type="monotone" dataKey="wellness" stroke={COLORS.success} strokeWidth={2} name="Wellness" />
                      <Line type="monotone" dataKey="burnout" stroke={COLORS.warning} strokeWidth={2} strokeDasharray="5 5" name="Burnout Risk" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Communication Fatigue Prevention */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Automated Assistance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { tool: "Smart Reply Suggestions", usage: "89%", impact: "45min saved/day" },
                      { tool: "Template Responses", usage: "76%", impact: "32min saved/day" },
                      { tool: "FAQ Auto-answers", usage: "92%", impact: "28min saved/day" },
                      { tool: "Scheduling Tools", usage: "67%", impact: "15min saved/day" },
                      { tool: "Bulk Messaging", usage: "54%", impact: "22min saved/day" }
                    ].map((tool) => (
                      <div key={tool.tool} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{tool.tool}</p>
                          <p className="text-xs text-gray-500">{tool.impact}</p>
                        </div>
                        <Badge variant="secondary">{tool.usage}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Energy Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { strategy: "Message Prioritization", effectiveness: "94%", stress: "Low" },
                      { strategy: "VIP Identification", effectiveness: "87%", stress: "Medium" },
                      { strategy: "Low-effort Responses", effectiveness: "91%", stress: "Low" },
                      { strategy: "Delegation Options", effectiveness: "78%", stress: "Medium" },
                      { strategy: "Break Reminders", effectiveness: "85%", stress: "Low" }
                    ].map((strategy) => (
                      <div key={strategy.strategy} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{strategy.strategy}</p>
                          <p className="text-xs text-gray-500">Stress level: {strategy.stress}</p>
                        </div>
                        <Badge variant={strategy.effectiveness > "90%" ? "default" : "secondary"}>
                          {strategy.effectiveness}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wellness Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Wellness Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Optimal Response Times:</strong> Your highest satisfaction scores occur during 10am-2pm responses
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Energy Patterns:</strong> Energy drops 15% after 25+ messages. Consider implementing breaks
                  </AlertDescription>
                </Alert>

                <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Boundary Success:</strong> Firm but empathetic boundary setting increases satisfaction by 23%
                  </AlertDescription>
                </Alert>

                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <Coffee className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Break Timing:</strong> 15-minute breaks every 2 hours maintain 85%+ energy levels
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-pink-200 bg-pink-50 dark:bg-pink-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Communication Psychology & Boundaries system with 
                relationship management (5 types), boundary framework (4 categories), fatigue prevention tools, 
                energy tracking, and template automation.
              </AlertDescription>
            </Alert>

            <CommunicationPsychologyBoundaries
              onBoundaryUpdate={handleBoundaryUpdate}
              onTemplateUse={handleTemplateUse}
              onEnergyUpdate={handleEnergyUpdate}
              enableAutomation={true}
              enableAnalytics={true}
              enableWellnessMode={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}