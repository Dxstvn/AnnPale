"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Star,
  Target,
  Brain,
  Eye,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Zap,
  Calendar,
  MessageSquare,
  Award,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  HelpCircle,
  Settings,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Plus,
  Minus,
  Search,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Timer,
  Globe,
  Heart,
  ThumbsUp
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Creator Analytics Personas
interface CreatorPersona {
  id: string
  name: string
  primaryQuestions: string[]
  preferredView: string
  decisionFrequency: string
  dataLiteracy: 'Low' | 'Medium' | 'High'
  characteristics: string[]
  metrics: string[]
  visualizations: string[]
  updateFrequency: string
  interactionStyle: string
}

interface AnalyticsQuestion {
  id: string
  category: 'Performance' | 'Revenue' | 'Audience'
  question: string
  answer: string
  metric: string
  visualization: 'score' | 'trend' | 'chart' | 'breakdown' | 'comparison'
  priority: number
  personas: string[]
}

interface MetricData {
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  color: string
}

// Component Props
interface AnalyticsMentalModelsProps {
  creatorId: string
  selectedPersona?: string
  onPersonaChange?: (persona: string) => void
  onQuestionExplore?: (questionId: string) => void
  className?: string
}

// Mock Data
const creatorPersonas: CreatorPersona[] = [
  {
    id: "data-driven",
    name: "Data-Driven",
    primaryQuestions: ["What drives revenue?", "Which metrics correlate?", "What's the conversion funnel?"],
    preferredView: "Detailed charts with correlations",
    decisionFrequency: "Daily analysis",
    dataLiteracy: "High",
    characteristics: ["Loves numbers", "Seeks correlations", "Detail-oriented", "Analytical mindset"],
    metrics: ["Revenue per customer", "Conversion rates", "Customer lifetime value", "Funnel metrics"],
    visualizations: ["Scatter plots", "Correlation matrices", "Multi-axis charts", "Funnel diagrams"],
    updateFrequency: "Real-time",
    interactionStyle: "Deep drill-down exploration"
  },
  {
    id: "intuitive",
    name: "Intuitive",
    primaryQuestions: ["Am I doing well?", "What feels right?", "Are customers happy?"],
    preferredView: "Simple metrics with visual cues",
    decisionFrequency: "Weekly check-ins",
    dataLiteracy: "Medium",
    characteristics: ["Relies on gut feeling", "Prefers visual feedback", "Moderate complexity", "Story-driven"],
    metrics: ["Overall performance score", "Customer satisfaction", "Growth indicators", "Quality metrics"],
    visualizations: ["Progress bars", "Color-coded indicators", "Simple line charts", "Gauge charts"],
    updateFrequency: "Daily summaries",
    interactionStyle: "Hover and quick insights"
  },
  {
    id: "occasional",
    name: "Occasional",
    primaryQuestions: ["How much did I earn?", "Do I need to do anything?", "What's the bottom line?"],
    preferredView: "Key numbers only",
    decisionFrequency: "Monthly reviews",
    dataLiteracy: "Low",
    characteristics: ["Wants simplicity", "Time-constrained", "Results-focused", "Minimal complexity"],
    metrics: ["Total earnings", "Orders completed", "Average rating", "Payout amount"],
    visualizations: ["Large numbers", "Simple icons", "Basic comparisons", "Traffic light status"],
    updateFrequency: "Weekly summaries",
    interactionStyle: "View-only with alerts"
  },
  {
    id: "growth-focused",
    name: "Growth-Focused",
    primaryQuestions: ["How do I improve?", "What's my potential?", "Where are opportunities?"],
    preferredView: "Trends and comparisons",
    decisionFrequency: "Continuous monitoring",
    dataLiteracy: "High",
    characteristics: ["Optimization-minded", "Competitive", "Future-oriented", "Goal-driven"],
    metrics: ["Growth rate", "Market share", "Benchmark comparisons", "Opportunity sizing"],
    visualizations: ["Trend lines", "Benchmark charts", "Opportunity maps", "Goal trackers"],
    updateFrequency: "Real-time",
    interactionStyle: "Interactive exploration with goals"
  },
  {
    id: "time-pressed",
    name: "Time-Pressed",
    primaryQuestions: ["Quick status?", "Any urgent issues?", "What needs attention?"],
    preferredView: "Dashboard summary",
    decisionFrequency: "Quick glances",
    dataLiteracy: "Low",
    characteristics: ["Always busy", "Needs alerts", "Action-oriented", "Efficiency-focused"],
    metrics: ["Status indicators", "Alert notifications", "Key changes", "Action items"],
    visualizations: ["Status dashboard", "Alert panels", "Quick summaries", "Action buttons"],
    updateFrequency: "Real-time alerts",
    interactionStyle: "Glance and act"
  }
]

const keyQuestions: AnalyticsQuestion[] = [
  // Performance Questions
  {
    id: "how-doing",
    category: "Performance",
    question: "How am I doing?",
    answer: "Performance score based on ratings, response time, and completion rate",
    metric: "Performance Score",
    visualization: "score",
    priority: 1,
    personas: ["intuitive", "occasional", "time-pressed"]
  },
  {
    id: "am-growing",
    category: "Performance", 
    question: "Am I growing?",
    answer: "Trend indicators showing month-over-month growth in key metrics",
    metric: "Growth Trend",
    visualization: "trend",
    priority: 2,
    personas: ["data-driven", "growth-focused"]
  },
  {
    id: "whats-working",
    category: "Performance",
    question: "What's working?",
    answer: "Success patterns in content, timing, and customer interactions",
    metric: "Success Patterns",
    visualization: "chart",
    priority: 3,
    personas: ["data-driven", "growth-focused", "intuitive"]
  },
  {
    id: "whats-not",
    category: "Performance",
    question: "What's not working?",
    answer: "Problem areas requiring attention or improvement",
    metric: "Problem Areas",
    visualization: "breakdown",
    priority: 4,
    personas: ["data-driven", "growth-focused", "time-pressed"]
  },

  // Revenue Questions
  {
    id: "how-much-earned",
    category: "Revenue",
    question: "How much did I earn?",
    answer: "Revenue breakdown by period, source, and service type",
    metric: "Revenue Breakdown",
    visualization: "breakdown",
    priority: 1,
    personas: ["occasional", "time-pressed", "intuitive"]
  },
  {
    id: "when-paid",
    category: "Revenue",
    question: "When do I get paid?",
    answer: "Payout schedule and pending earnings timeline",
    metric: "Payout Schedule",
    visualization: "chart",
    priority: 2,
    personas: ["occasional", "time-pressed"]
  },
  {
    id: "most-profitable",
    category: "Revenue",
    question: "What's most profitable?",
    answer: "Service analysis showing highest margin offerings",
    metric: "Profitability Analysis",
    visualization: "comparison",
    priority: 3,
    personas: ["data-driven", "growth-focused"]
  },
  {
    id: "earn-more",
    category: "Revenue",
    question: "How to earn more?",
    answer: "Opportunity insights and revenue optimization suggestions",
    metric: "Revenue Opportunities",
    visualization: "breakdown",
    priority: 4,
    personas: ["growth-focused", "data-driven"]
  },

  // Audience Questions
  {
    id: "who-customers",
    category: "Audience",
    question: "Who are my customers?",
    answer: "Demographics, geography, and customer profile analysis",
    metric: "Customer Demographics",
    visualization: "breakdown",
    priority: 1,
    personas: ["data-driven", "growth-focused"]
  },
  {
    id: "what-they-want",
    category: "Audience",
    question: "What do they want?",
    answer: "Request patterns, popular services, and content preferences",
    metric: "Request Patterns",
    visualization: "chart",
    priority: 2,
    personas: ["data-driven", "intuitive", "growth-focused"]
  },
  {
    id: "when-active",
    category: "Audience",
    question: "When are they active?",
    answer: "Timing insights for optimal posting and availability",
    metric: "Activity Patterns",
    visualization: "chart",
    priority: 3,
    personas: ["data-driven", "growth-focused"]
  },
  {
    id: "how-satisfied",
    category: "Audience",
    question: "How satisfied are they?",
    answer: "Satisfaction metrics including ratings and feedback analysis",
    metric: "Customer Satisfaction",
    visualization: "score",
    priority: 4,
    personas: ["intuitive", "growth-focused", "time-pressed"]
  }
]

const mockMetrics: Record<string, MetricData[]> = {
  "data-driven": [
    { name: "Revenue per Customer", value: 85.30, change: 12.5, trend: "up", color: "#10b981" },
    { name: "Conversion Rate", value: 23.8, change: -2.1, trend: "down", color: "#ef4444" },
    { name: "Customer LTV", value: 340.50, change: 8.7, trend: "up", color: "#10b981" },
    { name: "Funnel Drop-off", value: 15.2, change: -3.4, trend: "up", color: "#10b981" }
  ],
  "intuitive": [
    { name: "Performance Score", value: 92, change: 5, trend: "up", color: "#10b981" },
    { name: "Customer Happiness", value: 4.7, change: 0.2, trend: "up", color: "#10b981" },
    { name: "Growth Indicator", value: 78, change: 12, trend: "up", color: "#10b981" },
    { name: "Quality Rating", value: 4.8, change: 0.1, trend: "up", color: "#10b981" }
  ],
  "occasional": [
    { name: "Total Earnings", value: 2340, change: 280, trend: "up", color: "#10b981" },
    { name: "Orders Completed", value: 28, change: 4, trend: "up", color: "#10b981" },
    { name: "Average Rating", value: 4.7, change: 0.1, trend: "up", color: "#10b981" },
    { name: "Next Payout", value: 580, change: 0, trend: "stable", color: "#6366f1" }
  ],
  "growth-focused": [
    { name: "Growth Rate", value: 23.5, change: 5.2, trend: "up", color: "#10b981" },
    { name: "Market Position", value: 85, change: 8, trend: "up", color: "#10b981" },
    { name: "Opportunity Score", value: 78, change: 15, trend: "up", color: "#10b981" },
    { name: "Goal Progress", value: 67, change: 12, trend: "up", color: "#10b981" }
  ],
  "time-pressed": [
    { name: "Status", value: 100, change: 0, trend: "stable", color: "#10b981" },
    { name: "Urgent Issues", value: 0, change: -2, trend: "up", color: "#10b981" },
    { name: "Action Items", value: 3, change: 1, trend: "stable", color: "#f59e0b" },
    { name: "Alerts", value: 1, change: 0, trend: "stable", color: "#ef4444" }
  ]
}

const chartData = [
  { name: 'Jan', revenue: 1200, orders: 15, rating: 4.5 },
  { name: 'Feb', revenue: 1800, orders: 22, rating: 4.6 },
  { name: 'Mar', revenue: 2100, orders: 28, rating: 4.7 },
  { name: 'Apr', revenue: 2340, orders: 31, rating: 4.8 },
  { name: 'May', revenue: 2800, orders: 35, rating: 4.7 },
  { name: 'Jun', revenue: 3200, orders: 42, rating: 4.8 }
]

export function AnalyticsMentalModels({
  creatorId,
  selectedPersona = "intuitive",
  onPersonaChange,
  onQuestionExplore,
  className
}: AnalyticsMentalModelsProps) {
  const [activePersona, setActivePersona] = React.useState<string>(selectedPersona)
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [viewMode, setViewMode] = React.useState<"overview" | "detailed">("overview")
  const [showPersonaDetails, setShowPersonaDetails] = React.useState(false)

  const currentPersona = creatorPersonas.find(p => p.id === activePersona) || creatorPersonas[1]
  const currentMetrics = mockMetrics[activePersona] || mockMetrics["intuitive"]
  
  const filteredQuestions = keyQuestions.filter(q => 
    (selectedCategory === "all" || q.category === selectedCategory) &&
    q.personas.includes(activePersona)
  )

  const handlePersonaChange = (personaId: string) => {
    setActivePersona(personaId)
    onPersonaChange?.(personaId)
  }

  const getVisualizationComponent = (question: AnalyticsQuestion) => {
    switch (question.visualization) {
      case 'score':
        return (
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {question.id === 'how-doing' ? '92' : 
               question.id === 'how-satisfied' ? '4.7' : '85'}
            </div>
            <Progress value={question.id === 'how-doing' ? 92 : 85} className="w-full" />
          </div>
        )
      
      case 'trend':
        return (
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'chart':
        return (
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData.slice(-3)}>
              <Bar dataKey="orders" fill="#6366f1" />
              <XAxis dataKey="name" />
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'breakdown':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Video Messages</span>
              <span className="font-medium">$1,840 (65%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Live Sessions</span>
              <span className="font-medium">$680 (25%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Custom Content</span>
              <span className="font-medium">$300 (10%)</span>
            </div>
          </div>
        )
      
      case 'comparison':
        return (
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={chartData.slice(-4)}>
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b98120" />
              <XAxis dataKey="name" />
            </AreaChart>
          </ResponsiveContainer>
        )
      
      default:
        return <div className="text-sm text-gray-500">Visualization not available</div>
    }
  }

  const getPersonaIcon = (personaId: string) => {
    switch (personaId) {
      case 'data-driven': return BarChart3
      case 'intuitive': return Eye
      case 'occasional': return Clock
      case 'growth-focused': return Target
      case 'time-pressed': return Zap
      default: return Activity
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Performance': return Activity
      case 'Revenue': return DollarSign
      case 'Audience': return Users
      default: return HelpCircle
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Mental Models</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Personalized analytics based on your decision-making style
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-purple-600">
            <Brain className="w-3 h-3 mr-1" />
            Psychology-Based
          </Badge>
        </div>
      </div>

      {/* Persona Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Your Analytics Persona
              </CardTitle>
              <CardDescription>
                Choose how you prefer to consume and analyze data
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPersonaDetails(!showPersonaDetails)}
            >
              {showPersonaDetails ? <ChevronDown /> : <ChevronRight />}
              Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {creatorPersonas.map((persona) => {
              const Icon = getPersonaIcon(persona.id)
              return (
                <motion.div
                  key={persona.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all",
                      activePersona === persona.id 
                        ? "ring-2 ring-purple-600 bg-purple-50 dark:bg-purple-900/20" 
                        : "hover:shadow-md"
                    )}
                    onClick={() => handlePersonaChange(persona.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2",
                        activePersona === persona.id ? "bg-purple-600" : "bg-gray-100 dark:bg-gray-800"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          activePersona === persona.id ? "text-white" : "text-gray-600"
                        )} />
                      </div>
                      <h3 className="font-semibold text-sm">{persona.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{persona.decisionFrequency}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Persona Details */}
          <AnimatePresence>
            {showPersonaDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">{currentPersona.name} Profile</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Literacy:</span>
                        <Badge className={
                          currentPersona.dataLiteracy === 'High' ? 'bg-green-100 text-green-800' :
                          currentPersona.dataLiteracy === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {currentPersona.dataLiteracy}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Update Frequency:</span>
                        <span>{currentPersona.updateFrequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interaction Style:</span>
                        <span>{currentPersona.interactionStyle}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Key Characteristics</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentPersona.characteristics.map((char, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Key Metrics for Persona */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Your Key Metrics
          </CardTitle>
          <CardDescription>
            Metrics tailored to your {currentPersona.name.toLowerCase()} approach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentMetrics.map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{metric.name}</span>
                      {metric.trend === 'up' ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : metric.trend === 'down' ? (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="text-2xl font-bold" style={{ color: metric.color }}>
                      {metric.name.includes('Rate') || metric.name.includes('Score') || metric.name.includes('Rating') 
                        ? metric.value.toFixed(metric.value % 1 === 0 ? 0 : 1) 
                        : metric.value.toLocaleString()}
                    </div>
                    {metric.change !== 0 && (
                      <div className={cn(
                        "text-xs",
                        metric.trend === 'up' ? "text-green-600" : 
                        metric.trend === 'down' ? "text-red-600" : 
                        "text-gray-600"
                      )}>
                        {metric.change > 0 ? '+' : ''}{metric.change}
                        {metric.name.includes('Rate') || metric.name.includes('Score') ? '' : metric.name.includes('Rating') ? '' : ''}
                        {metric.trend === 'up' && metric.change > 0 ? ' ↑' : metric.trend === 'down' && metric.change < 0 ? ' ↓' : ''}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Questions Framework */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-orange-600" />
                Your Key Questions
              </CardTitle>
              <CardDescription>
                Analytics designed around the questions you ask most
              </CardDescription>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Performance">Performance</SelectItem>
                <SelectItem value="Revenue">Revenue</SelectItem>
                <SelectItem value="Audience">Audience</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQuestions.map((question, index) => {
              const CategoryIcon = getCategoryIcon(question.category)
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CategoryIcon className="h-4 w-4 text-blue-600" />
                            <Badge variant="outline" className="text-xs">
                              {question.category}
                            </Badge>
                          </div>
                          <h4 className="font-semibold mb-2 text-purple-700">
                            "{question.question}"
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {question.answer}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Metric: {question.metric}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onQuestionExplore?.(question.id)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Explore
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <div className="w-full">
                            {getVisualizationComponent(question)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Persona Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Personalized Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activePersona === 'data-driven' && (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <BarChart3 className="h-4 w-4" />
                <AlertDescription>
                  <strong>For Data-Driven Creators:</strong> Your conversion rate dipped 2.1% but customer LTV increased 8.7%. 
                  This suggests you're attracting higher-quality customers. Consider A/B testing your pricing strategy.
                </AlertDescription>
              </Alert>
            )}

            {activePersona === 'intuitive' && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  <strong>Intuitive Insight:</strong> Your performance score of 92 puts you in the top 15% of creators. 
                  Customers love your personal touch - your satisfaction rating increased to 4.7!
                </AlertDescription>
              </Alert>
            )}

            {activePersona === 'occasional' && (
              <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Quick Update:</strong> You earned $2,340 this month (+$280 from last month). 
                  Your next payout of $580 is scheduled for Friday. Everything looks great!
                </AlertDescription>
              </Alert>
            )}

            {activePersona === 'growth-focused' && (
              <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>Growth Opportunity:</strong> You're 67% towards your monthly goal. 
                  Your growth rate of 23.5% exceeds the category average of 18%. 
                  Focus on premium services to maximize this momentum.
                </AlertDescription>
              </Alert>
            )}

            {activePersona === 'time-pressed' && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Action Required:</strong> You have 3 pending actions and 1 alert. 
                  Most urgent: Respond to Marie's clarification request (due in 2 hours).
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator className="my-4" />

          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {currentPersona.primaryQuestions.length}
              </div>
              <p className="text-sm text-gray-600">Primary Questions Addressed</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {currentPersona.visualizations.length}
              </div>
              <p className="text-sm text-gray-600">Visualization Types</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {currentPersona.dataLiteracy}
              </div>
              <p className="text-sm text-gray-600">Complexity Level</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}