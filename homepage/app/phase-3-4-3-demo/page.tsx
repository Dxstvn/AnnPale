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
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  MessageSquare,
  Heart,
  Brain,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Timer,
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Eye,
  Flag,
  Shield,
  Smile,
  Frown,
  Meh,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { ReviewManagementSystem } from "@/components/creator/reviews/review-management-system"
import { motion } from "framer-motion"
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from "recharts"
import { cn } from "@/lib/utils"

// Demo data for analytics
const reviewDistributionData = [
  { name: "5 Stars", value: 57.5, count: 165, color: "#10B981" },
  { name: "4 Stars", value: 31.0, count: 89, color: "#3B82F6" },
  { name: "3 Stars", value: 7.3, count: 21, color: "#F59E0B" },
  { name: "2 Stars", value: 2.8, count: 8, color: "#EF4444" },
  { name: "1 Star", value: 1.4, count: 4, color: "#7C2D12" }
]

const responseTimeData = [
  { timeFrame: "< 2h", count: 12, target: 15, rating: "1-2★" },
  { timeFrame: "< 6h", count: 8, target: 10, rating: "2★" },
  { timeFrame: "< 12h", count: 15, target: 20, rating: "3★" },
  { timeFrame: "< 24h", count: 28, target: 30, rating: "4-5★" },
  { timeFrame: "< 48h", count: 18, target: 25, rating: "4★" },
  { timeFrame: "Overdue", count: 6, target: 0, rating: "Any" }
]

const sentimentTrendData = [
  { month: "Oct", positive: 78, neutral: 15, negative: 7, avgRating: 4.4 },
  { month: "Nov", positive: 82, neutral: 12, negative: 6, avgRating: 4.5 },
  { month: "Dec", positive: 85, neutral: 10, negative: 5, avgRating: 4.7 },
  { month: "Jan", positive: 87, neutral: 8, negative: 5, avgRating: 4.6 }
]

const responseEffectivenessData = [
  { template: "5-Star Glowing", usage: 145, successRate: 98, sentimentImprovement: 0.2, avgTime: 18 },
  { template: "4-Star Appreciation", usage: 89, successRate: 94, sentimentImprovement: 0.3, avgTime: 24 },
  { template: "3-Star Acknowledgment", usage: 34, successRate: 87, sentimentImprovement: 0.5, avgTime: 8 },
  { template: "2-Star Apology", usage: 12, successRate: 82, sentimentImprovement: 0.7, avgTime: 4 },
  { template: "1-Star Crisis", usage: 3, successRate: 75, sentimentImprovement: 0.9, avgTime: 1 }
]

const topicAnalysisData = [
  { topic: "Personalization", mentions: 145, sentiment: 0.8, impact: "High" },
  { topic: "Delivery Time", mentions: 89, sentiment: 0.2, impact: "High" },
  { topic: "Audio Quality", mentions: 67, sentiment: 0.6, impact: "Medium" },
  { topic: "Emotional Impact", mentions: 156, sentiment: 0.9, impact: "High" },
  { topic: "Value for Money", mentions: 78, sentiment: 0.7, impact: "Medium" },
  { topic: "Communication", mentions: 45, sentiment: 0.8, impact: "Medium" }
]

const competitorBenchmarkData = [
  {
    metric: "Response Rate",
    you: 89,
    industry: 65,
    topPerformer: 95
  },
  {
    metric: "Avg Response Time",
    you: 8.5,
    industry: 24,
    topPerformer: 4.2
  },
  {
    metric: "Customer Satisfaction",
    you: 4.6,
    industry: 4.1,
    topPerformer: 4.8
  },
  {
    metric: "Review Volume",
    you: 287,
    industry: 180,
    topPerformer: 450
  }
]

export default function Phase343Demo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Phase 3.4.3: Review Management System</h1>
            <p className="text-xl opacity-90">
              Strategic Review Response Framework with Psychology-Based Templates
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="response-framework">Response Framework</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Review Management System Overview
                </CardTitle>
                <CardDescription>
                  Comprehensive review response strategy with psychology-based templates, sentiment analysis, and reputation building
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Response Psychology</h3>
                    <p className="text-sm text-gray-600">
                      Strategic response framework based on review rating and emotional impact
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">AI-Powered Templates</h3>
                    <p className="text-sm text-gray-600">
                      Smart response templates with variable personalization and success tracking
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Sentiment Tracking</h3>
                    <p className="text-sm text-gray-600">
                      Real-time sentiment analysis with improvement measurement and trending
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Impact Optimization</h3>
                    <p className="text-sm text-gray-600">
                      Strategic response timing and content for maximum reputation building
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
                    Review Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          dataKey="value"
                          data={reviewDistributionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {reviewDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {reviewDistributionData.map((rating) => (
                      <div key={rating.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: rating.color }}
                        />
                        <span className="text-sm">{rating.name}: {rating.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-orange-600" />
                    Response Time Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={responseTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timeFrame" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3B82F6" name="Actual" />
                        <Bar dataKey="target" fill="#10B981" name="Target" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">8.5h</div>
                      <div className="text-sm text-gray-500">Avg Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">89%</div>
                      <div className="text-sm text-gray-500">Response Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Features & Psychology Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      Response Psychology Strategy
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        5-star reviews: Gratitude amplification (24h response)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        4-star reviews: Appreciation + improvement (48h response)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        3-star reviews: Acknowledgment + action plan (12h response)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        2-star reviews: Urgent apology + resolution (6h response)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        1-star reviews: Crisis response + offline resolution (2h response)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI-Enhanced Features
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Sentiment analysis and emotion detection
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Topic extraction and trend analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Template personalization with variables
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Response effectiveness tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Public impact assessment and prioritization
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="response-framework" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-600" />
                    Response Strategy Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                            ))}
                          </div>
                          <span className="font-medium">5-Star Glowing</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">High Positive Impact</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Strategy:</strong> Thank & amplify • <strong>Response:</strong> {"<24 hours"}
                      </p>
                      <p className="text-sm">Express genuine gratitude, highlight specifics, share excitement, invite return engagement</p>
                    </div>

                    <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                            ))}
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                          <span className="font-medium">4-Star Positive</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Moderate Positive Impact</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Strategy:</strong> Thank & improve • <strong>Response:</strong> {"<48 hours"}
                      </p>
                      <p className="text-sm">Show gratitude, note improvement area, commit to excellence, future invitation</p>
                    </div>

                    <div className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(3)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                            ))}
                            {[...Array(2)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300" />
                            ))}
                          </div>
                          <span className="font-medium">3-Star Neutral</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Neutral Impact</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Strategy:</strong> Acknowledge & fix • <strong>Response:</strong> {"<12 hours"}
                      </p>
                      <p className="text-sm">Acknowledge concerns, address specific issues, provide improvement plan, make-right offer</p>
                    </div>

                    <div className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(2)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                            ))}
                            {[...Array(3)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300" />
                            ))}
                          </div>
                          <span className="font-medium">2-Star Negative</span>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">High Negative Impact</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Strategy:</strong> Apologize & resolve • <strong>Response:</strong> {"<6 hours"}
                      </p>
                      <p className="text-sm">Sincere apology, take responsibility, concrete solution, follow-up commitment</p>
                    </div>

                    <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300" />
                            ))}
                          </div>
                          <span className="font-medium">1-Star Crisis</span>
                        </div>
                        <Badge className="bg-red-100 text-red-800">Crisis Level Impact</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Strategy:</strong> Damage control • <strong>Response:</strong> {"<2 hours"}
                      </p>
                      <p className="text-sm">Immediate attention, move offline, resolution offer, service recovery</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Response Effectiveness Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {responseEffectivenessData.map((template, index) => (
                      <div key={template.template} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{template.template}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {template.usage} uses
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                template.successRate >= 95 ? "bg-green-100 text-green-800" :
                                template.successRate >= 85 ? "bg-blue-100 text-blue-800" :
                                "bg-yellow-100 text-yellow-800"
                              )}
                            >
                              {template.successRate}% success
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Sentiment Improvement:</span>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="text-green-600 font-medium">
                                +{(template.sentimentImprovement * 100).toFixed(0)}%
                              </div>
                              <ArrowUp className="h-3 w-3 text-green-600" />
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Avg Response Time:</span>
                            <div className="text-blue-600 font-medium mt-1">
                              {template.avgTime}h
                            </div>
                          </div>
                        </div>
                        <Progress 
                          value={template.successRate} 
                          className="mt-3 h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Psychology-Based Response Framework</CardTitle>
                <CardDescription>
                  Understanding the emotional journey and crafting responses that build reputation and relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Smile className="h-5 w-5 text-green-600" />
                      Positive Reviews (4-5★)
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Emotional State:</strong> Happy, satisfied, grateful</li>
                      <li>• <strong>Goal:</strong> Amplify positive experience</li>
                      <li>• <strong>Strategy:</strong> Thank, highlight specifics, encourage sharing</li>
                      <li>• <strong>Tone:</strong> Warm, genuine, celebratory</li>
                      <li>• <strong>Follow-up:</strong> Invite future engagement</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Meh className="h-5 w-5 text-yellow-600" />
                      Neutral Reviews (3★)
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Emotional State:</strong> Disappointed, uncertain</li>
                      <li>• <strong>Goal:</strong> Address concerns, rebuild confidence</li>
                      <li>• <strong>Strategy:</strong> Acknowledge, explain, improve</li>
                      <li>• <strong>Tone:</strong> Understanding, professional, solution-focused</li>
                      <li>• <strong>Follow-up:</strong> Proactive improvement demonstration</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Frown className="h-5 w-5 text-red-600" />
                      Negative Reviews (1-2★)
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Emotional State:</strong> Frustrated, angry, hurt</li>
                      <li>• <strong>Goal:</strong> De-escalate, resolve, recover relationship</li>
                      <li>• <strong>Strategy:</strong> Apologize, take responsibility, offer solution</li>
                      <li>• <strong>Tone:</strong> Sincere, humble, action-oriented</li>
                      <li>• <strong>Follow-up:</strong> Personal contact and resolution tracking</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Sentiment Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sentimentTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="positive" 
                          stackId="1"
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.8}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="neutral" 
                          stackId="1"
                          stroke="#F59E0B" 
                          fill="#F59E0B" 
                          fillOpacity={0.8}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="negative" 
                          stackId="1"
                          stroke="#EF4444" 
                          fill="#EF4444" 
                          fillOpacity={0.8}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">87%</div>
                      <div className="text-sm text-gray-500">Positive</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">8%</div>
                      <div className="text-sm text-gray-500">Neutral</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">5%</div>
                      <div className="text-sm text-gray-500">Negative</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Topic Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topicAnalysisData.map((topic) => (
                      <div key={topic.topic} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{topic.topic}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {topic.mentions} mentions
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-xs",
                                  topic.impact === "High" ? "bg-red-100 text-red-800" :
                                  topic.impact === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-green-100 text-green-800"
                                )}
                              >
                                {topic.impact} impact
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <Progress 
                                value={topic.sentiment * 100} 
                                className="h-2"
                              />
                            </div>
                            <span className={cn(
                              "text-sm font-medium",
                              topic.sentiment > 0.7 ? "text-green-600" :
                              topic.sentiment > 0.4 ? "text-yellow-600" :
                              "text-red-600"
                            )}>
                              {(topic.sentiment * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Competitive Benchmarking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitorBenchmarkData.map((metric) => (
                      <div key={metric.metric} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{metric.metric}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-blue-600 font-medium">You: {metric.you}</span>
                            <span className="text-gray-500">Industry: {metric.industry}</span>
                            <span className="text-green-600">Top: {metric.topPerformer}</span>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={75} className="h-2" />
                          <div 
                            className="absolute top-0 w-1 h-2 bg-blue-600 rounded"
                            style={{ left: `${(metric.you / metric.topPerformer) * 100}%` }}
                          />
                          <div 
                            className="absolute top-0 w-1 h-2 bg-gray-400 rounded"
                            style={{ left: `${(metric.industry / metric.topPerformer) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">4.6★</div>
                      <div className="text-sm text-gray-500">Average Rating</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <ArrowUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">+0.2 this month</span>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">89%</div>
                      <div className="text-sm text-gray-500">Response Rate</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <ArrowUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">+5% this month</span>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">8.5h</div>
                      <div className="text-sm text-gray-500">Avg Response Time</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <ArrowDown className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">-2h this month</span>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">92%</div>
                      <div className="text-sm text-gray-500">Resolution Rate</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <ArrowUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">+3% this month</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">287</div>
                      <div className="text-sm text-gray-500">Total Reviews</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ThumbsUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">254</div>
                      <div className="text-sm text-gray-500">Positive Reviews</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Reply className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">255</div>
                      <div className="text-sm text-gray-500">Responses Sent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">+12%</div>
                      <div className="text-sm text-gray-500">Sentiment Improvement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {responseEffectivenessData.map((template) => (
                <Card key={template.template}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{template.template}</span>
                      <Badge variant="outline" className={cn(
                        template.successRate >= 95 ? "bg-green-100 text-green-800" :
                        template.successRate >= 85 ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      )}>
                        {template.successRate}% success rate
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Used {template.usage} times • Avg improvement: +{(template.sentimentImprovement * 100).toFixed(0)}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-medium mb-2">Template Content:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {template.template === "5-Star Glowing" && 
                            "{{customerName}}, mèsi anpil for your incredible review! 🌟 Your words about {{specificDetail}} absolutely made my day. I'm so thrilled that {{videoType}} brought such joy to {{recipient}}. It means the world to me when I can create something truly special for families like yours. Can't wait to work with you again! 💙"
                          }
                          {template.template === "4-Star Appreciation" && 
                            "Thank you so much {{customerName}} for taking the time to share your experience! I'm delighted that {{positiveAspect}} exceeded your expectations. I really appreciate your feedback about {{improvementArea}} - it helps me continue to grow and deliver even better experiences. Looking forward to creating something amazing for you again soon!"
                          }
                          {template.template === "3-Star Acknowledgment" && 
                            "Hi {{customerName}}, thank you for your honest feedback. I understand your concerns about {{specificIssue}} and I take full responsibility. Here's what I'm doing to make this right: {{improvementPlan}}. I'd love the opportunity to exceed your expectations next time. Please reach out to me directly so we can discuss how I can better serve you."
                          }
                          {template.template === "2-Star Apology" && 
                            "{{customerName}}, I am truly sorry that your experience didn't meet your expectations. {{specificApology}} is completely unacceptable, and I take full responsibility. I want to make this right immediately: {{concreteAction}}. I'll be personally following up with you within 24 hours to ensure we've resolved this properly. Thank you for giving me the chance to improve."
                          }
                          {template.template === "1-Star Crisis" && 
                            "{{customerName}}, I am deeply sorry and take immediate responsibility for this experience. This is not who I am or what I stand for. I am contacting you directly within the hour to discuss how we can resolve this properly. {{immediateAction}}. Your trust means everything to me, and I'm committed to making this right. Please check your messages for my personal response."
                          }
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Variables Used:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {template.template === "5-Star Glowing" && 
                              ["customerName", "specificDetail", "videoType", "recipient"].map(variable => (
                                <Badge key={variable} variant="secondary" className="text-xs">
                                  {variable}
                                </Badge>
                              ))
                            }
                            {template.template === "4-Star Appreciation" && 
                              ["customerName", "positiveAspect", "improvementArea"].map(variable => (
                                <Badge key={variable} variant="secondary" className="text-xs">
                                  {variable}
                                </Badge>
                              ))
                            }
                            {template.template === "3-Star Acknowledgment" && 
                              ["customerName", "specificIssue", "improvementPlan"].map(variable => (
                                <Badge key={variable} variant="secondary" className="text-xs">
                                  {variable}
                                </Badge>
                              ))
                            }
                            {template.template === "2-Star Apology" && 
                              ["customerName", "specificApology", "concreteAction"].map(variable => (
                                <Badge key={variable} variant="secondary" className="text-xs">
                                  {variable}
                                </Badge>
                              ))
                            }
                            {template.template === "1-Star Crisis" && 
                              ["customerName", "immediateAction"].map(variable => (
                                <Badge key={variable} variant="secondary" className="text-xs">
                                  {variable}
                                </Badge>
                              ))
                            }
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Response Time:</Label>
                          <div className="text-lg font-bold text-blue-600 mt-1">
                            {template.avgTime}h avg
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Performance Metrics:</Label>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Success Rate</span>
                            <span className="font-medium">{template.successRate}%</span>
                          </div>
                          <Progress value={template.successRate} className="h-2" />
                          <div className="flex justify-between text-sm">
                            <span>Sentiment Improvement</span>
                            <span className="font-medium text-green-600">+{(template.sentimentImprovement * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={template.sentimentImprovement * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Template Best Practices</CardTitle>
                <CardDescription>
                  Guidelines for creating effective review responses that build reputation and relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      Emotional Connection
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Use customer's name for personalization</li>
                      <li>• Reference specific details from their review</li>
                      <li>• Match the emotional tone appropriately</li>
                      <li>• Express genuine appreciation or concern</li>
                      <li>• Use culturally relevant expressions (e.g., "mèsi anpil")</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Strategic Messaging
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Address the review's main points directly</li>
                      <li>• Provide specific actions for improvement</li>
                      <li>• Invite continued engagement or return business</li>
                      <li>• Demonstrate accountability and responsibility</li>
                      <li>• Balance public response with private follow-up</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Timing & Impact
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Respond within urgency timeframes</li>
                      <li>• Prioritize by potential public impact</li>
                      <li>• Use templates as starting points, not scripts</li>
                      <li>• Track response effectiveness over time</li>
                      <li>• Continuously refine based on results</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>Live Review Management Demo</CardTitle>
                <CardDescription>
                  Interactive demonstration of the review management system with psychology-based response templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                  <ReviewManagementSystem />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}