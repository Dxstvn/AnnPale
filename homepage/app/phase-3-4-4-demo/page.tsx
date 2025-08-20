"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Users,
  UserPlus,
  Crown,
  Star,
  Heart,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Timer,
  Calendar,
  Gift,
  MessageSquare,
  Clock,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Brain,
  Sparkles,
  Trophy,
  Medal,
  PartyPopper,
  Cake
} from "lucide-react"
import { FanRelationshipManagement } from "@/components/creator/fans/fan-relationship-management"
import { motion } from "framer-motion"
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, FunnelChart, Funnel, LabelList } from "recharts"
import { cn } from "@/lib/utils"

// Demo data for analytics
const fanSegmentData = [
  { name: "New Fans", value: 28, count: 45, color: "#3B82F6", engagement: "Low", strategy: "Welcome & educate" },
  { name: "Active Fans", value: 35, count: 56, color: "#10B981", engagement: "Medium", strategy: "Maintain & reward" },
  { name: "Super Fans", value: 22, count: 35, color: "#8B5CF6", engagement: "High", strategy: "VIP treatment" },
  { name: "Advocates", value: 10, count: 16, color: "#F59E0B", engagement: "Very High", strategy: "Amplify & partner" },
  { name: "Dormant", value: 5, count: 8, color: "#6B7280", engagement: "Low", strategy: "Re-engage" }
]

const fanJourneyData = [
  { stage: "Discovery", visitors: 1000, conversion: 25, color: "#3B82F6" },
  { stage: "First Booking", visitors: 250, conversion: 85, color: "#10B981" },
  { stage: "Satisfaction", visitors: 213, conversion: 92, color: "#8B5CF6" },
  { stage: "Repeat", visitors: 196, conversion: 45, color: "#F59E0B" },
  { stage: "Advocacy", visitors: 88, conversion: 15, color: "#EF4444" }
]

const lifetimeValueData = [
  { segment: "New Fans", avgLTV: 65, potential: 150, retention: 45 },
  { segment: "Active Fans", avgLTV: 285, potential: 400, retention: 78 },
  { segment: "Super Fans", avgLTV: 650, potential: 850, retention: 92 },
  { segment: "Advocates", avgLTV: 890, potential: 1200, retention: 96 },
  { segment: "Dormant", avgLTV: 120, potential: 180, retention: 25 }
]

const engagementTrendData = [
  { month: "Aug", newFans: 12, activeFans: 18, superFans: 8, advocates: 3, dormant: 2 },
  { month: "Sep", newFans: 15, activeFans: 22, superFans: 10, advocates: 4, dormant: 3 },
  { month: "Oct", newFans: 18, activeFans: 25, superFans: 12, advocates: 5, dormant: 2 },
  { month: "Nov", newFans: 22, activeFans: 28, superFans: 15, advocates: 6, dormant: 1 },
  { month: "Dec", newFans: 28, activeFans: 32, superFans: 18, advocates: 8, dormant: 1 },
  { month: "Jan", newFans: 35, activeFans: 35, superFans: 22, advocates: 10, dormant: 1 }
]

const campaignPerformanceData = [
  { campaign: "Welcome Series", sent: 125, opened: 95, clicked: 68, converted: 23, roi: 340 },
  { campaign: "Birthday Wishes", sent: 89, opened: 82, clicked: 61, converted: 28, roi: 450 },
  { campaign: "Win-back", sent: 67, opened: 38, clicked: 15, converted: 4, roi: 180 },
  { campaign: "Loyalty Rewards", sent: 56, opened: 52, clicked: 45, converted: 19, roi: 380 },
  { campaign: "Milestone Celebration", sent: 34, opened: 31, clicked: 26, converted: 12, roi: 520 }
]

const fanJourneyMetrics = [
  {
    stage: "Discovery",
    metric: "Awareness",
    current: 78,
    target: 85,
    industry: 65
  },
  {
    stage: "Trial", 
    metric: "Conversion",
    current: 25,
    target: 30,
    industry: 18
  },
  {
    stage: "Delight",
    metric: "Satisfaction",
    current: 92,
    target: 95,
    industry: 82
  },
  {
    stage: "Loyalty",
    metric: "Retention",
    current: 45,
    target: 50,
    industry: 35
  },
  {
    stage: "Advocacy",
    metric: "Referrals",
    current: 15,
    target: 20,
    industry: 8
  }
]

const specialDatesUpcoming = [
  { fanName: "Marie Destine", occasion: "Birthday", date: "Jan 20", daysAway: 5, segment: "super_fans" },
  { fanName: "Jean Baptiste", occasion: "Business Anniversary", date: "Jan 25", daysAway: 10, segment: "active_fans" },
  { fanName: "Sophia Laurent", occasion: "Birthday", date: "Feb 2", daysAway: 18, segment: "new_fans" },
  { fanName: "Lisa Rodriguez", occasion: "Daughter's Graduation", date: "Feb 8", daysAway: 24, segment: "advocates" },
  { fanName: "Michael Thompson", occasion: "Birthday", date: "Feb 14", daysAway: 30, segment: "dormant" }
]

export default function Phase344Demo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Phase 3.4.4: Fan Relationship Management</h1>
            <p className="text-xl opacity-90">
              Systematic Fan Engagement & Personalized Relationship Building
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="segmentation">Fan Segmentation</TabsTrigger>
            <TabsTrigger value="journey">Fan Journey</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  Fan Relationship Management Overview
                </CardTitle>
                <CardDescription>
                  Systematic approach to building and nurturing loyal fan relationships through segmentation, personalization, and automated engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Fan Segmentation</h3>
                    <p className="text-sm text-gray-600">
                      5-segment model with targeted strategies for each fan type
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ArrowRight className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Journey Mapping</h3>
                    <p className="text-sm text-gray-600">
                      Track fans through discovery to advocacy with optimized touchpoints
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Smart Profiles</h3>
                    <p className="text-sm text-gray-600">
                      Comprehensive fan database with preferences and interaction history
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Automation</h3>
                    <p className="text-sm text-gray-600">
                      Personalized campaigns and timely engagement triggers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-600" />
                    Fan Segment Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          dataKey="value"
                          data={fanSegmentData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {fanSegmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {fanSegmentData.map((segment) => (
                      <div key={segment.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="text-sm">{segment.name}: {segment.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Lifetime Value by Segment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={lifetimeValueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="segment" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgLTV" fill="#3B82F6" name="Current LTV" />
                        <Bar dataKey="potential" fill="#10B981" name="Potential LTV" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">$425</div>
                      <div className="text-sm text-gray-500">Avg Current LTV</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">$556</div>
                      <div className="text-sm text-gray-500">Avg Potential LTV</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Fan Relationship Strategy Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {fanSegmentData.map((segment, index) => (
                    <div key={segment.name} className="text-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white"
                        style={{ backgroundColor: segment.color }}
                      >
                        {segment.name === "New Fans" && <UserPlus className="h-6 w-6" />}
                        {segment.name === "Active Fans" && <Users className="h-6 w-6" />}
                        {segment.name === "Super Fans" && <Star className="h-6 w-6" />}
                        {segment.name === "Advocates" && <Crown className="h-6 w-6" />}
                        {segment.name === "Dormant" && <Clock className="h-6 w-6" />}
                      </div>
                      <h4 className="font-semibold mb-2">{segment.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{segment.engagement} Engagement</p>
                      <p className="text-xs text-gray-500">{segment.strategy}</p>
                      <div className="mt-3">
                        <Badge variant="outline" className="text-xs">
                          {segment.count} fans
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-pink-600" />
                    Upcoming Special Dates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {specialDatesUpcoming.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Cake className="h-4 w-4 text-pink-500" />
                            <span className="font-medium text-sm">{item.fanName}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.occasion}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{item.date}</div>
                          <div className="text-xs text-gray-500">{item.daysAway} days away</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Engagement Growth Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={engagementTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="advocates" 
                          stackId="1"
                          stroke="#F59E0B" 
                          fill="#F59E0B" 
                          fillOpacity={0.8}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="superFans" 
                          stackId="1"
                          stroke="#8B5CF6" 
                          fill="#8B5CF6" 
                          fillOpacity={0.8}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="activeFans" 
                          stackId="1"
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.8}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="newFans" 
                          stackId="1"
                          stroke="#3B82F6" 
                          fill="#3B82F6" 
                          fillOpacity={0.8}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="segmentation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {fanSegmentData.map((segment, index) => (
                <Card key={segment.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: segment.color }}
                      >
                        {segment.name === "New Fans" && <UserPlus className="h-4 w-4" />}
                        {segment.name === "Active Fans" && <Users className="h-4 w-4" />}
                        {segment.name === "Super Fans" && <Star className="h-4 w-4" />}
                        {segment.name === "Advocates" && <Crown className="h-4 w-4" />}
                        {segment.name === "Dormant" && <Clock className="h-4 w-4" />}
                      </div>
                      {segment.name}
                    </CardTitle>
                    <CardDescription>
                      {segment.engagement} engagement level
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold" style={{ color: segment.color }}>
                          {segment.count}
                        </div>
                        <div className="text-sm text-gray-500">Total Fans</div>
                        <div className="text-lg font-semibold mt-2">
                          {segment.value}%
                        </div>
                        <div className="text-xs text-gray-500">of fan base</div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Strategy</h4>
                        <p className="text-sm text-gray-600">{segment.strategy}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Key Characteristics</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {segment.name === "New Fans" && (
                            <>
                              <li>• First booking completed</li>
                              <li>• Learning about your content</li>
                              <li>• Need onboarding support</li>
                            </>
                          )}
                          {segment.name === "Active Fans" && (
                            <>
                              <li>• Regular bookings</li>
                              <li>• Familiar with service</li>
                              <li>• Appreciate loyalty rewards</li>
                            </>
                          )}
                          {segment.name === "Super Fans" && (
                            <>
                              <li>• High frequency bookings</li>
                              <li>• Premium content preference</li>
                              <li>• VIP service expectations</li>
                            </>
                          )}
                          {segment.name === "Advocates" && (
                            <>
                              <li>• Actively refer others</li>
                              <li>• High social engagement</li>
                              <li>• Perfect ambassadors</li>
                            </>
                          )}
                          {segment.name === "Dormant" && (
                            <>
                              <li>• Previously active</li>
                              <li>• No recent bookings</li>
                              <li>• Need re-engagement</li>
                            </>
                          )}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Recommended Tools</h4>
                        <div className="space-y-1">
                          {segment.name === "New Fans" && (
                            <Badge variant="outline" className="text-xs mr-1 mb-1">Onboarding series</Badge>
                          )}
                          {segment.name === "Active Fans" && (
                            <Badge variant="outline" className="text-xs mr-1 mb-1">Loyalty program</Badge>
                          )}
                          {segment.name === "Super Fans" && (
                            <Badge variant="outline" className="text-xs mr-1 mb-1">Exclusive access</Badge>
                          )}
                          {segment.name === "Advocates" && (
                            <Badge variant="outline" className="text-xs mr-1 mb-1">Ambassador program</Badge>
                          )}
                          {segment.name === "Dormant" && (
                            <Badge variant="outline" className="text-xs mr-1 mb-1">Win-back campaigns</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Segmentation Best Practices</CardTitle>
                <CardDescription>
                  Guidelines for effective fan segmentation and targeted engagement strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Segmentation Criteria
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Booking frequency and recency
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Lifetime value and spending patterns
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Engagement level and interaction quality
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Referral activity and social sharing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Content preferences and occasion types
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      Engagement Strategies
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Personalized welcome journeys for new fans
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Loyalty rewards for active engagement
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        VIP experiences for super fans
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Ambassador programs for advocates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Win-back campaigns for dormant fans
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Success Metrics
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Segment movement and progression rates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Lifetime value growth by segment
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Engagement score improvements
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Referral rates and advocacy metrics
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Campaign response and conversion rates
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journey" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-6 w-6 text-blue-600" />
                  Fan Journey Funnel
                </CardTitle>
                <CardDescription>
                  Track fans through each stage of their relationship journey with conversion optimization insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="horizontal" data={fanJourneyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="stage" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="visitors" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {fanJourneyData.map((stage, index) => (
                      <div key={stage.stage} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                            style={{ backgroundColor: stage.color }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{stage.stage}</div>
                            <div className="text-sm text-gray-500">{stage.visitors} visitors</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{stage.conversion}%</div>
                          <div className="text-sm text-gray-500">conversion</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Journey Performance Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={fanJourneyMetrics}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="stage" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar 
                          name="Current" 
                          dataKey="current" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.3} 
                        />
                        <Radar 
                          name="Target" 
                          dataKey="target" 
                          stroke="#82ca9d" 
                          fill="#82ca9d" 
                          fillOpacity={0.3} 
                        />
                        <Radar 
                          name="Industry" 
                          dataKey="industry" 
                          stroke="#ffc658" 
                          fill="#ffc658" 
                          fillOpacity={0.3} 
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {fanJourneyMetrics.map((metric) => (
                      <div key={metric.stage} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{metric.stage}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-blue-600">Current: {metric.current}%</span>
                            <span className="text-green-600">Target: {metric.target}%</span>
                            <span className="text-gray-500">Industry: {metric.industry}%</span>
                          </div>
                        </div>
                        <Progress value={(metric.current / metric.target) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Discovery Stage</CardTitle>
                  <CardDescription>Awareness & Initial Interest</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">1,000</div>
                      <div className="text-sm text-gray-500">Monthly Visitors</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Conversion Rate</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={25} className="flex-1" />
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Optimization Tips</Label>
                      <ul className="text-xs space-y-1 text-gray-600">
                        <li>• Improve social proof and testimonials</li>
                        <li>• Clarify value proposition</li>
                        <li>• Create urgency with limited offers</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Satisfaction Stage</CardTitle>
                  <CardDescription>Video Delivery & Experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">92%</div>
                      <div className="text-sm text-gray-500">Satisfaction Rate</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Quality Score</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={92} className="flex-1" />
                        <span className="text-sm font-medium">4.6★</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Optimization Tips</Label>
                      <ul className="text-xs space-y-1 text-gray-600">
                        <li>• Maintain consistent quality standards</li>
                        <li>• Proactive delivery communication</li>
                        <li>• Follow-up satisfaction surveys</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Advocacy Stage</CardTitle>
                  <CardDescription>Referrals & Promotion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">15%</div>
                      <div className="text-sm text-gray-500">Referral Rate</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Ambassador Potential</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={60} className="flex-1" />
                        <span className="text-sm font-medium">60%</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Optimization Tips</Label>
                      <ul className="text-xs space-y-1 text-gray-600">
                        <li>• VIP treatment and exclusive access</li>
                        <li>• Referral incentive programs</li>
                        <li>• Social media ambassador features</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Campaign Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaignPerformanceData.map((campaign, index) => (
                      <div key={campaign.campaign} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{campaign.campaign}</h4>
                          <Badge variant="outline" className={cn(
                            "text-xs",
                            campaign.roi >= 400 ? "bg-green-100 text-green-800" :
                            campaign.roi >= 300 ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          )}>
                            {campaign.roi}% ROI
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Sent:</span>
                            <div className="font-medium">{campaign.sent}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Opened:</span>
                            <div className="font-medium">{campaign.opened}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Clicked:</span>
                            <div className="font-medium">{campaign.clicked}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Converted:</span>
                            <div className="font-medium">{campaign.converted}</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Conversion Rate</span>
                            <span>{((campaign.converted / campaign.sent) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(campaign.converted / campaign.sent) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Automation Triggers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium">Welcome Series</h4>
                        <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Triggered when new fan completes first booking
                      </p>
                      <div className="text-xs text-gray-500">
                        <strong>Sequence:</strong> Welcome email → Tips & expectations → Feedback request → Next booking offer
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium">Birthday Campaign</h4>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Triggered 7 days before fan's birthday
                      </p>
                      <div className="text-xs text-gray-500">
                        <strong>Content:</strong> Personalized birthday wishes + 25% discount offer
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="h-5 w-5 text-orange-600" />
                        <h4 className="font-medium">Win-back Series</h4>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 text-xs">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Triggered when fan hasn't booked in 90 days
                      </p>
                      <div className="text-xs text-gray-500">
                        <strong>Sequence:</strong> Miss you email → What's new update → Special offer → Final attempt
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Trophy className="h-5 w-5 text-purple-600" />
                        <h4 className="font-medium">Milestone Celebration</h4>
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 text-xs">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Triggered on fan anniversary and booking milestones
                      </p>
                      <div className="text-xs text-gray-500">
                        <strong>Milestones:</strong> 1st anniversary, 5th booking, 10th booking, $500 spent
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Automation Best Practices</CardTitle>
                <CardDescription>
                  Guidelines for creating effective automated engagement campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Timer className="h-5 w-5 text-blue-600" />
                      Timing Strategy
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Welcome series within 24 hours of first booking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Birthday campaigns 7 days before special dates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Win-back campaigns after 60-90 days inactivity
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Follow-up surveys 3-7 days after delivery
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      Personalization
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Use fan's name and personal details
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Reference previous bookings and occasions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Customize content by segment and preferences
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Respect communication channel preferences
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      Performance Tracking
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Monitor open and click-through rates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Track conversion to bookings
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Measure ROI and lifetime value impact
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        A/B test subject lines and content
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>Live Fan Relationship Management Demo</CardTitle>
                <CardDescription>
                  Interactive demonstration of the fan database and relationship management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                  <FanRelationshipManagement />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}