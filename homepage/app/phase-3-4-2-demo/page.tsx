"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  MessageSquare,
  Inbox,
  Users,
  Clock,
  TrendingUp,
  Star,
  Heart,
  Brain,
  Zap,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Timer,
  Globe,
  Languages,
  Lightbulb,
  Shield,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Phone,
  Video,
  Send,
  Eye,
  Flag,
  Archive
} from "lucide-react"
import { MessageCenterArchitecture } from "@/components/creator/communication/message-center-architecture"
import { motion } from "framer-motion"
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from "recharts"

// Demo data for analytics
const messageCategoryData = [
  { name: "New Bookings", value: 35, count: 28, color: "#EF4444" },
  { name: "Active Conversations", value: 30, count: 24, color: "#3B82F6" },
  { name: "Follow-ups", value: 20, count: 16, color: "#F59E0B" },
  { name: "Thank You", value: 10, count: 8, color: "#10B981" },
  { name: "Archived", value: 5, count: 4, color: "#6B7280" }
]

const responseTimeData = [
  { hour: "9AM", avgTime: 15, target: 30 },
  { hour: "10AM", avgTime: 12, target: 30 },
  { hour: "11AM", avgTime: 18, target: 30 },
  { hour: "12PM", avgTime: 25, target: 30 },
  { hour: "1PM", avgTime: 22, target: 30 },
  { hour: "2PM", avgTime: 14, target: 30 },
  { hour: "3PM", avgTime: 16, target: 30 },
  { hour: "4PM", avgTime: 20, target: 30 }
]

const sentimentData = [
  { day: "Mon", positive: 85, neutral: 12, negative: 3 },
  { day: "Tue", positive: 78, neutral: 18, negative: 4 },
  { day: "Wed", positive: 92, neutral: 6, negative: 2 },
  { day: "Thu", positive: 88, neutral: 10, negative: 2 },
  { day: "Fri", positive: 90, neutral: 8, negative: 2 },
  { day: "Sat", positive: 95, neutral: 4, negative: 1 },
  { day: "Sun", positive: 87, neutral: 11, negative: 2 }
]

const customerSatisfactionData = [
  { month: "Oct", satisfaction: 4.6, responses: 45 },
  { month: "Nov", satisfaction: 4.7, responses: 52 },
  { month: "Dec", satisfaction: 4.8, responses: 61 },
  { month: "Jan", satisfaction: 4.9, responses: 68 }
]

const conversationMetrics = [
  {
    subject: "Response Time",
    current: 85,
    target: 90,
    industry: 75
  },
  {
    subject: "Customer Satisfaction",
    current: 95,
    target: 92,
    industry: 82
  },
  {
    subject: "Resolution Rate",
    current: 88,
    target: 85,
    industry: 78
  },
  {
    subject: "AI Accuracy",
    current: 92,
    target: 90,
    industry: 85
  },
  {
    subject: "Template Usage",
    current: 78,
    target: 80,
    industry: 70
  }
]

const dailyVolumeData = [
  { time: "6AM", messages: 2, conversations: 1 },
  { time: "8AM", messages: 8, conversations: 5 },
  { time: "10AM", messages: 15, conversations: 12 },
  { time: "12PM", messages: 22, conversations: 18 },
  { time: "2PM", messages: 28, conversations: 22 },
  { time: "4PM", messages: 35, conversations: 28 },
  { time: "6PM", messages: 25, conversations: 20 },
  { time: "8PM", messages: 18, conversations: 15 },
  { time: "10PM", messages: 12, conversations: 8 }
]

export default function Phase342Demo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Phase 3.4.2: Message Center Architecture</h1>
            <p className="text-xl opacity-90">
              Unified Messaging Hub for Efficient Customer Communication
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="smart-inbox">Smart Inbox</TabsTrigger>
            <TabsTrigger value="conversation-tools">Conversation Tools</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  Message Center Architecture Overview
                </CardTitle>
                <CardDescription>
                  Centralized communication hub with AI-powered categorization, sentiment analysis, and intelligent response suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Inbox className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Smart Inbox</h3>
                    <p className="text-sm text-gray-600">
                      AI categorization with priority sorting and automated filtering
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Conversation Threads</h3>
                    <p className="text-sm text-gray-600">
                      Rich conversation interface with customer context and history
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">AI-Powered Tools</h3>
                    <p className="text-sm text-gray-600">
                      Sentiment analysis, response suggestions, and quality scoring
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                    <p className="text-sm text-gray-600">
                      Comprehensive metrics and performance insights
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
                    Message Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          dataKey="value"
                          data={messageCategoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {messageCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {messageCategoryData.map((category) => (
                      <div key={category.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm">{category.name}: {category.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-green-600" />
                    Response Time Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={responseTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="avgTime" 
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.3} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="target" 
                          stroke="#EF4444" 
                          strokeDasharray="5 5" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">18m</div>
                      <div className="text-sm text-gray-500">Avg Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">94%</div>
                      <div className="text-sm text-gray-500">Within Target</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Features & Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-red-600" />
                      Message Organization
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Automatic categorization by type and priority
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Smart filtering and search capabilities
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Bulk actions for efficient management
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Visual indicators for status and urgency
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI-Powered Features
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Real-time sentiment analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Intelligent response suggestions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Quality scoring and improvement tips
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Automated translation support
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="smart-inbox" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Inbox className="h-5 w-5 text-red-600" />
                    Priority Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="text-sm font-medium">High Priority</span>
                      </div>
                      <Badge variant="destructive">28</Badge>
                    </div>
                    <Progress value={35} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-sm font-medium">Medium Priority</span>
                      </div>
                      <Badge variant="secondary">32</Badge>
                    </div>
                    <Progress value={40} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm font-medium">Low Priority</span>
                      </div>
                      <Badge variant="outline">20</Badge>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New Bookings</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">2.3h</span>
                        <ArrowDown className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Conversations</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">18m</span>
                        <ArrowDown className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Follow-ups</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">4.2h</span>
                        <Minus className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Thank You</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">1.5d</span>
                        <ArrowUp className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Mark All as Read
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Star className="h-4 w-4 mr-2" />
                      Star Important
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive Completed
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Flag className="h-4 w-4 mr-2" />
                      Flag for Follow-up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Smart Filtering & Search</CardTitle>
                <CardDescription>
                  Advanced filtering capabilities with AI-powered search and categorization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Filter Options</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Message category and type</li>
                      <li>• Customer VIP status</li>
                      <li>• Response time urgency</li>
                      <li>• Sentiment analysis results</li>
                      <li>• Booking reference numbers</li>
                      <li>• Date ranges and timeframes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Search Capabilities</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Full-text content search</li>
                      <li>• Customer name and email</li>
                      <li>• Attachment file names</li>
                      <li>• Message tags and labels</li>
                      <li>• AI-powered semantic search</li>
                      <li>• Voice command support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Bulk Operations</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Multi-select conversations</li>
                      <li>• Batch status updates</li>
                      <li>• Mass archive operations</li>
                      <li>• Bulk priority changes</li>
                      <li>• Group tagging and labeling</li>
                      <li>• Export to CSV/PDF</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversation-tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI-Powered Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-purple-600" />
                        Smart Response Suggestions
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        AI analyzes message context and suggests appropriate responses
                      </p>
                      <div className="space-y-2">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded text-xs">
                          "Thank you for your message! I'll create something special for you."
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-800 rounded text-xs">
                          "I'm excited to work on your request! Let me get some more details."
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-blue-600" />
                        Sentiment Analysis
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Real-time emotional tone detection and appropriate response guidance
                      </p>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-100 text-green-800">😊 Positive: 87%</Badge>
                        <Badge className="bg-gray-100 text-gray-800">😐 Neutral: 11%</Badge>
                        <Badge className="bg-red-100 text-red-800">😔 Negative: 2%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-green-600" />
                    Communication Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-600" />
                        Multi-Language Support
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Automatic translation between English, French, and Haitian Creole
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <Badge variant="outline">🇺🇸 English</Badge>
                        <Badge variant="outline">🇫🇷 Français</Badge>
                        <Badge variant="outline">🇭🇹 Kreyòl</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Timer className="h-4 w-4 text-orange-600" />
                        Quality Tracking
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Message quality scoring and response time optimization
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Response Quality</span>
                          <span className="font-medium">4.8/5.0</span>
                        </div>
                        <Progress value={96} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Conversation Thread Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Customer Context</h4>
                    <p className="text-sm text-gray-600">
                      Full customer profile with booking history and preferences
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Time Tracking</h4>
                    <p className="text-sm text-gray-600">
                      Automatic response time measurement and optimization tips
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Rich Media</h4>
                    <p className="text-sm text-gray-600">
                      Support for voice messages, video calls, and file attachments
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Safety Tools</h4>
                    <p className="text-sm text-gray-600">
                      Red flag detection and customer blocking capabilities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Template Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Thank You Response</span>
                        <Badge variant="outline" className="text-xs">93% success</Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        "Thank you for your message! I'll create something special for you."
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Booking Confirmation</span>
                        <Badge variant="outline" className="text-xs">98% success</Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        "I'm excited to work on your request! Let me get some more details."
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Delivery Notification</span>
                        <Badge variant="outline" className="text-xs">95% success</Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        "Your video is ready! I hope you love it as much as I enjoyed creating it."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" className="justify-start">
                      <Send className="h-4 w-4 mr-2" />
                      Quick Reply
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Star className="h-4 w-4 mr-2" />
                      Star Message
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      Snooze
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Customer
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Video Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Daily Message Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={dailyVolumeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="conversations" fill="#3B82F6" name="Conversations" />
                        <Line 
                          type="monotone" 
                          dataKey="messages" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          name="Messages"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Weekly Sentiment Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sentimentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="positive" 
                          stackId="1"
                          stroke="#10B981" 
                          fill="#10B981" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="neutral" 
                          stackId="1"
                          stroke="#F59E0B" 
                          fill="#F59E0B" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="negative" 
                          stackId="1"
                          stroke="#EF4444" 
                          fill="#EF4444" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Performance Radar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={conversationMetrics}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Customer Satisfaction Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={customerSatisfactionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[4.5, 5.0]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="satisfaction" 
                          stroke="#3B82F6" 
                          strokeWidth={3}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">4.9★</div>
                      <div className="text-sm text-gray-500">Current Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+0.3</div>
                      <div className="text-sm text-gray-500">Improvement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">1,247</div>
                      <div className="text-sm text-gray-500">Total Messages</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">18m</div>
                      <div className="text-sm text-gray-500">Avg Response</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">94%</div>
                      <div className="text-sm text-gray-500">Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Zap className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">87%</div>
                      <div className="text-sm text-gray-500">AI Accuracy</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>Live Message Center Demo</CardTitle>
                <CardDescription>
                  Interactive demonstration of the unified messaging hub with real conversation threads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                  <MessageCenterArchitecture />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}