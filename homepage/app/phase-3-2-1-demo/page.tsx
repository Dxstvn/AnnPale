"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Brain,
  BarChart3,
  Eye,
  Clock,
  Target,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  HelpCircle,
  Lightbulb,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Star,
  Heart,
  MessageSquare,
  Calendar,
  Award,
  Sparkles,
  Timer,
  RefreshCw,
  Plus,
  Minus,
  Search,
  Filter,
  Globe,
  ThumbsUp
} from "lucide-react"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
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

// Import the main component
import { AnalyticsMentalModels } from "@/components/creator/analytics/analytics-mental-models"

// Analytics Psychology Data
const analyticsPersonasData = [
  {
    persona: "Data-Driven",
    percentage: 25,
    characteristics: ["Loves numbers", "Seeks correlations", "Detail-oriented", "Daily analysis"],
    preferredVisuals: ["Scatter plots", "Multi-axis charts", "Correlation matrices", "Funnel diagrams"],
    keyQuestions: ["What drives revenue?", "Which metrics correlate?", "What's the conversion funnel?"],
    complexity: "High",
    updateFreq: "Real-time",
    color: "blue"
  },
  {
    persona: "Intuitive",
    percentage: 35,
    characteristics: ["Relies on gut feeling", "Visual feedback", "Story-driven", "Weekly check-ins"],
    preferredVisuals: ["Progress bars", "Color indicators", "Simple line charts", "Gauge charts"],
    keyQuestions: ["Am I doing well?", "What feels right?", "Are customers happy?"],
    complexity: "Medium",
    updateFreq: "Daily summaries",
    color: "green"
  },
  {
    persona: "Occasional",
    percentage: 20,
    characteristics: ["Wants simplicity", "Time-constrained", "Results-focused", "Monthly reviews"],
    preferredVisuals: ["Large numbers", "Simple icons", "Basic comparisons", "Traffic lights"],
    keyQuestions: ["How much did I earn?", "Do I need to do anything?", "What's the bottom line?"],
    complexity: "Low",
    updateFreq: "Weekly summaries",
    color: "purple"
  },
  {
    persona: "Growth-Focused",
    percentage: 15,
    characteristics: ["Optimization-minded", "Competitive", "Future-oriented", "Goal-driven"],
    preferredVisuals: ["Trend lines", "Benchmark charts", "Opportunity maps", "Goal trackers"],
    keyQuestions: ["How do I improve?", "What's my potential?", "Where are opportunities?"],
    complexity: "High", 
    updateFreq: "Real-time",
    color: "orange"
  },
  {
    persona: "Time-Pressed",
    percentage: 5,
    characteristics: ["Always busy", "Needs alerts", "Action-oriented", "Quick glances"],
    preferredVisuals: ["Status dashboard", "Alert panels", "Quick summaries", "Action buttons"],
    keyQuestions: ["Quick status?", "Any urgent issues?", "What needs attention?"],
    complexity: "Low",
    updateFreq: "Real-time alerts",
    color: "red"
  }
]

// Question Framework Data
const questionFramework = {
  Performance: [
    {
      question: "How am I doing?",
      answer: "Performance score based on ratings, response time, and completion rate",
      visualization: "Score with progress indicators",
      personas: ["Intuitive", "Occasional", "Time-Pressed"],
      priority: 1
    },
    {
      question: "Am I growing?", 
      answer: "Trend indicators showing month-over-month growth in key metrics",
      visualization: "Trend lines with comparative periods",
      personas: ["Data-Driven", "Growth-Focused"],
      priority: 2
    },
    {
      question: "What's working?",
      answer: "Success patterns in content, timing, and customer interactions",
      visualization: "Heat maps and pattern analysis",
      personas: ["Data-Driven", "Growth-Focused", "Intuitive"],
      priority: 3
    },
    {
      question: "What's not working?",
      answer: "Problem areas requiring attention or improvement", 
      visualization: "Alert system with actionable insights",
      personas: ["Data-Driven", "Growth-Focused", "Time-Pressed"],
      priority: 4
    }
  ],
  Revenue: [
    {
      question: "How much did I earn?",
      answer: "Revenue breakdown by period, source, and service type",
      visualization: "Revenue charts with breakdowns",
      personas: ["Occasional", "Time-Pressed", "Intuitive"],
      priority: 1
    },
    {
      question: "When do I get paid?",
      answer: "Payout schedule and pending earnings timeline",
      visualization: "Timeline with payout dates",
      personas: ["Occasional", "Time-Pressed"],
      priority: 2
    },
    {
      question: "What's most profitable?",
      answer: "Service analysis showing highest margin offerings",
      visualization: "Profitability comparison charts",
      personas: ["Data-Driven", "Growth-Focused"],
      priority: 3
    },
    {
      question: "How to earn more?",
      answer: "Opportunity insights and revenue optimization suggestions",
      visualization: "Opportunity matrix with recommendations",
      personas: ["Growth-Focused", "Data-Driven"],
      priority: 4
    }
  ],
  Audience: [
    {
      question: "Who are my customers?",
      answer: "Demographics, geography, and customer profile analysis",
      visualization: "Demographic charts and maps",
      personas: ["Data-Driven", "Growth-Focused"],
      priority: 1
    },
    {
      question: "What do they want?",
      answer: "Request patterns, popular services, and content preferences",
      visualization: "Preference analysis and trend charts",
      personas: ["Data-Driven", "Intuitive", "Growth-Focused"],
      priority: 2
    },
    {
      question: "When are they active?",
      answer: "Timing insights for optimal posting and availability",
      visualization: "Activity heat maps and time charts",
      personas: ["Data-Driven", "Growth-Focused"],
      priority: 3
    },
    {
      question: "How satisfied are they?",
      answer: "Satisfaction metrics including ratings and feedback analysis",
      visualization: "Satisfaction scores and sentiment analysis",
      personas: ["Intuitive", "Growth-Focused", "Time-Pressed"],
      priority: 4
    }
  ]
}

// Psychology Impact Data
const psychologyImpacts = [
  {
    finding: "Persona-based analytics increase engagement",
    impact: "+340% time spent in dashboard",
    description: "When analytics match mental models, creators spend more time exploring insights",
    color: "blue"
  },
  {
    finding: "Question-driven design improves decision making",
    impact: "+85% faster business decisions",
    description: "Organizing data around key questions reduces cognitive load",
    color: "green"
  },
  {
    finding: "Adaptive complexity prevents overwhelm", 
    impact: "-70% dashboard abandonment",
    description: "Matching data complexity to literacy levels keeps creators engaged",
    color: "purple"
  },
  {
    finding: "Action-oriented insights drive behavior",
    impact: "+220% implementation of suggestions",
    description: "When insights clearly point to actions, creators are more likely to act",
    color: "orange"
  }
]

// Visualization Examples
const visualizationExamples = [
  {
    persona: "Data-Driven",
    title: "Correlation Analysis",
    description: "Multi-axis chart showing relationships between pricing, quality, and revenue",
    complexity: "High",
    insights: "Price increases of 10-15% correlate with 8% revenue boost when quality stays above 4.5",
    visual: "correlation"
  },
  {
    persona: "Intuitive", 
    title: "Performance Dashboard",
    description: "Color-coded indicators with simple progress bars and trend arrows",
    complexity: "Medium",
    insights: "Green indicators show you're performing above average in 4/5 key areas",
    visual: "dashboard"
  },
  {
    persona: "Occasional",
    title: "Earnings Summary",
    description: "Large numbers with simple comparisons to previous periods",
    complexity: "Low",
    insights: "$2,340 earned this month (+$280 from last month). Next payout: Friday.",
    visual: "summary"
  },
  {
    persona: "Growth-Focused",
    title: "Opportunity Matrix",
    description: "Bubble chart showing market opportunities vs effort required",
    complexity: "High", 
    insights: "Premium packages show highest growth potential with moderate effort required",
    visual: "matrix"
  },
  {
    persona: "Time-Pressed",
    title: "Alert Dashboard",
    description: "Status indicators with urgent actions and quick glance metrics",
    complexity: "Low",
    insights: "Status: Good | 1 urgent action | 3 pending tasks | Next deadline: 2 hours",
    visual: "alerts"
  }
]

// Mock chart data
const performanceData = [
  { month: 'Jan', datadriven: 85, intuitive: 92, occasional: 78, growth: 88, timepressed: 95 },
  { month: 'Feb', datadriven: 88, intuitive: 94, occasional: 82, growth: 91, timepressed: 97 },
  { month: 'Mar', datadriven: 92, intuitive: 96, occasional: 85, growth: 94, timepressed: 98 },
  { month: 'Apr', datadriven: 95, intuitive: 97, occasional: 88, growth: 96, timepressed: 99 },
]

const usageData = [
  { name: 'Data-Driven', value: 25, sessions: 45, duration: 28 },
  { name: 'Intuitive', value: 35, sessions: 22, duration: 12 },
  { name: 'Occasional', value: 20, sessions: 8, duration: 5 },
  { name: 'Growth-Focused', value: 15, sessions: 38, duration: 35 },
  { name: 'Time-Pressed', value: 5, sessions: 15, duration: 3 },
]

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']

export default function Phase321DemoPage() {
  const [activeTab, setActiveTab] = React.useState("demo")
  const [selectedPersona, setSelectedPersona] = React.useState("intuitive")
  const [selectedCategory, setSelectedCategory] = React.useState("Performance")
  const [showComparison, setShowComparison] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics mental models...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-purple-600">
                  Phase 3.2.1
                </Badge>
                <Badge variant="outline">Analytics Mental Models</Badge>
              </div>
              <h1 className="text-3xl font-bold">Analytics Mental Models & Information Needs</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Psychology-based analytics that inspire action rather than overwhelm
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Brain className="w-3 h-3 mr-1" />
                Psychology-Driven
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Creator Personas Overview */}
        <div className="grid lg:grid-cols-5 gap-4 mb-8">
          {analyticsPersonasData.map((persona, index) => (
            <motion.div
              key={persona.persona}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className={`w-12 h-12 rounded-full bg-${persona.color}-100 dark:bg-${persona.color}-900/30 flex items-center justify-center mx-auto mb-3`}>
                    {persona.persona === 'Data-Driven' && <BarChart3 className={`h-6 w-6 text-${persona.color}-600`} />}
                    {persona.persona === 'Intuitive' && <Eye className={`h-6 w-6 text-${persona.color}-600`} />}
                    {persona.persona === 'Occasional' && <Clock className={`h-6 w-6 text-${persona.color}-600`} />}
                    {persona.persona === 'Growth-Focused' && <Target className={`h-6 w-6 text-${persona.color}-600`} />}
                    {persona.persona === 'Time-Pressed' && <Zap className={`h-6 w-6 text-${persona.color}-600`} />}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{persona.persona}</h3>
                  <div className="text-2xl font-bold text-purple-600 mb-1">{persona.percentage}%</div>
                  <p className="text-xs text-gray-600">of creators</p>
                  <Badge className={`bg-${persona.color}-100 text-${persona.color}-800 text-xs mt-2`}>
                    {persona.complexity} Complexity
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Component Demo */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="personas">Personas</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="psychology">Psychology</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Mental Models System</CardTitle>
                <CardDescription>
                  Adaptive analytics interface that changes based on creator psychology and data consumption patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsMentalModels
                  creatorId="demo-creator"
                  selectedPersona={selectedPersona}
                  onPersonaChange={setSelectedPersona}
                  onQuestionExplore={(questionId) => console.log("Explore question:", questionId)}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="personas" className="mt-6">
            <div className="space-y-6">
              {/* Persona Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Creator Analytics Personas Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex justify-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={usageData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {usageData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Key Insights</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span><strong>Intuitive (35%)</strong> - Largest group, prefers visual feedback</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span><strong>Data-Driven (25%)</strong> - High engagement, loves detailed charts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span><strong>Occasional (20%)</strong> - Simple needs, monthly check-ins</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span><strong>Growth-Focused (15%)</strong> - Goal-oriented, optimization-minded</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span><strong>Time-Pressed (5%)</strong> - Need alerts and quick status</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Persona Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                {analyticsPersonasData.map((persona, index) => (
                  <motion.div
                    key={persona.persona}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {persona.persona === 'Data-Driven' && <BarChart3 className={`h-5 w-5 text-${persona.color}-600`} />}
                          {persona.persona === 'Intuitive' && <Eye className={`h-5 w-5 text-${persona.color}-600`} />}
                          {persona.persona === 'Occasional' && <Clock className={`h-5 w-5 text-${persona.color}-600`} />}
                          {persona.persona === 'Growth-Focused' && <Target className={`h-5 w-5 text-${persona.color}-600`} />}
                          {persona.persona === 'Time-Pressed' && <Zap className={`h-5 w-5 text-${persona.color}-600`} />}
                          {persona.persona}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Characteristics</h4>
                          <div className="flex flex-wrap gap-1">
                            {persona.characteristics.map((char, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {char}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Key Questions</h4>
                          <div className="space-y-1 text-sm">
                            {persona.keyQuestions.map((question, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                                <span className="italic text-purple-700">"{question}"</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Preferred Visuals</h4>
                          <div className="text-sm text-gray-600">
                            {persona.preferredVisuals.slice(0, 2).join(", ")}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Update Frequency:</span>
                            <p className="font-medium">{persona.updateFreq}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Complexity:</span>
                            <Badge className={`bg-${persona.color}-100 text-${persona.color}-800`}>
                              {persona.complexity}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            <div className="space-y-6">
              {/* Category Selector */}
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Question Framework</h3>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Performance">Performance Questions</SelectItem>
                    <SelectItem value="Revenue">Revenue Questions</SelectItem>
                    <SelectItem value="Audience">Audience Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Questions Grid */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedCategory === 'Performance' && <Activity className="h-5 w-5 text-blue-600" />}
                    {selectedCategory === 'Revenue' && <DollarSign className="h-5 w-5 text-green-600" />}
                    {selectedCategory === 'Audience' && <Users className="h-5 w-5 text-purple-600" />}
                    {selectedCategory} Questions
                  </CardTitle>
                  <CardDescription>
                    Key questions that {selectedCategory.toLowerCase()} analytics must answer for creators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {questionFramework[selectedCategory as keyof typeof questionFramework].map((q, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-semibold text-purple-700 mb-2">
                                "{q.question}"
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">{q.answer}</p>
                              <Badge className="text-xs">Priority {q.priority}</Badge>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-2 text-sm">Visualization</h5>
                              <p className="text-sm text-gray-600 mb-3">{q.visualization}</p>
                              <h5 className="font-medium mb-2 text-sm">Relevant Personas</h5>
                              <div className="flex flex-wrap gap-1">
                                {q.personas.map(persona => (
                                  <Badge key={persona} variant="outline" className="text-xs">
                                    {persona}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-center">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                {selectedCategory === 'Performance' && <Activity className="h-8 w-8 text-blue-600" />}
                                {selectedCategory === 'Revenue' && <DollarSign className="h-8 w-8 text-green-600" />}
                                {selectedCategory === 'Audience' && <Users className="h-8 w-8 text-purple-600" />}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="psychology" className="mt-6">
            <div className="space-y-6">
              {/* Psychology Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Creator Analytics Psychology Impact
                  </CardTitle>
                  <CardDescription>
                    How psychological principles improve analytics engagement and decision-making
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {psychologyImpacts.map((impact, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-4 h-full">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 bg-${impact.color}-100 dark:bg-${impact.color}-900/30 rounded-lg`}>
                              <Lightbulb className={`h-5 w-5 text-${impact.color}-600`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">{impact.finding}</h4>
                              <div className="text-2xl font-bold text-green-600 mb-2">
                                {impact.impact}
                              </div>
                              <p className="text-sm text-gray-600">{impact.description}</p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Engagement by Persona */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics by Persona</CardTitle>
                  <CardDescription>
                    How different personas interact with analytics when designed for their mental models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="datadriven" fill="#3b82f6" name="Data-Driven" />
                      <Bar dataKey="intuitive" fill="#10b981" name="Intuitive" />
                      <Bar dataKey="occasional" fill="#8b5cf6" name="Occasional" />
                      <Bar dataKey="growth" fill="#f59e0b" name="Growth-Focused" />
                      <Bar dataKey="timepressed" fill="#ef4444" name="Time-Pressed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cognitive Load Principles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-orange-600" />
                    Cognitive Load Design Principles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">✅ Psychology-Based Design</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Adaptive complexity based on data literacy</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Question-driven information architecture</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Persona-specific visualization preferences</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Progressive disclosure of details</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Action-oriented insights</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">❌ Traditional Approach</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span>One-size-fits-all dashboard</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span>Data-first, not question-first design</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span>Fixed complexity regardless of user needs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span>All information visible simultaneously</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span>Descriptive rather than actionable</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {visualizationExamples.map((example, index) => (
                <motion.div
                  key={example.persona}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {example.persona === 'Data-Driven' && <BarChart3 className="h-5 w-5 text-blue-600" />}
                        {example.persona === 'Intuitive' && <Eye className="h-5 w-5 text-green-600" />}
                        {example.persona === 'Occasional' && <Clock className="h-5 w-5 text-purple-600" />}
                        {example.persona === 'Growth-Focused' && <Target className="h-5 w-5 text-orange-600" />}
                        {example.persona === 'Time-Pressed' && <Zap className="h-5 w-5 text-red-600" />}
                        {example.persona}: {example.title}
                      </CardTitle>
                      <CardDescription>{example.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[120px] flex items-center justify-center">
                        {example.visual === 'correlation' && (
                          <div className="text-center">
                            <div className="grid grid-cols-3 gap-2 mb-2">
                              <div className="w-12 h-8 bg-blue-200 rounded"></div>
                              <div className="w-12 h-12 bg-blue-400 rounded"></div>
                              <div className="w-12 h-10 bg-blue-300 rounded"></div>
                            </div>
                            <div className="text-xs text-gray-600">Multi-axis correlation</div>
                          </div>
                        )}
                        {example.visual === 'dashboard' && (
                          <div className="space-y-2 w-full">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                              <div className="flex-1 bg-green-200 h-2 rounded"></div>
                              <span className="text-xs">92%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                              <div className="flex-1 bg-yellow-200 h-2 rounded"></div>
                              <span className="text-xs">78%</span>
                            </div>
                          </div>
                        )}
                        {example.visual === 'summary' && (
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-1">$2,340</div>
                            <div className="text-sm text-gray-600">+$280 from last month</div>
                          </div>
                        )}
                        {example.visual === 'matrix' && (
                          <div className="relative w-full h-20">
                            <div className="absolute top-2 left-8 w-6 h-6 bg-orange-400 rounded-full"></div>
                            <div className="absolute top-8 left-16 w-4 h-4 bg-orange-300 rounded-full"></div>
                            <div className="absolute bottom-2 left-4 w-3 h-3 bg-orange-200 rounded-full"></div>
                            <div className="text-xs text-gray-600 absolute bottom-0 right-0">
                              Opportunity vs Effort
                            </div>
                          </div>
                        )}
                        {example.visual === 'alerts' && (
                          <div className="space-y-2 w-full">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm">Status: Good</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-sm">1 Urgent Action</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Key Insight</h4>
                        <p className="text-sm text-gray-600 italic">"{example.insights}"</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Badge className={
                          example.complexity === 'High' ? 'bg-red-100 text-red-800' :
                          example.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {example.complexity} Complexity
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View Example
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="impact" className="mt-6">
            <div className="space-y-6">
              {/* Impact Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Mental Models Implementation Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-1">+340%</div>
                      <div className="text-sm text-gray-600">Dashboard Engagement</div>
                      <div className="text-xs text-gray-500 mt-1">Time spent analyzing</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-1">+85%</div>
                      <div className="text-sm text-gray-600">Faster Decisions</div>
                      <div className="text-xs text-gray-500 mt-1">Question-driven design</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-1">-70%</div>
                      <div className="text-sm text-gray-600">Dashboard Abandonment</div>
                      <div className="text-xs text-gray-500 mt-1">Adaptive complexity</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600 mb-1">+220%</div>
                      <div className="text-sm text-gray-600">Action Implementation</div>
                      <div className="text-xs text-gray-500 mt-1">Actionable insights</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Before vs After */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Traditional Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <strong>One-size-fits-all dashboard</strong>
                        <p className="text-gray-600 mt-1">Same interface for all creators regardless of needs</p>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <strong>Information overwhelm</strong>
                        <p className="text-gray-600 mt-1">All data visible at once, causing analysis paralysis</p>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <strong>Descriptive, not actionable</strong>
                        <p className="text-gray-600 mt-1">Shows what happened, not what to do next</p>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <strong>High abandonment rate</strong>
                        <p className="text-gray-600 mt-1">Creators find analytics too complex or irrelevant</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      Psychology-Based Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <strong>Adaptive persona-based interface</strong>
                        <p className="text-gray-600 mt-1">Changes based on creator's mental model and preferences</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <strong>Progressive information disclosure</strong>
                        <p className="text-gray-600 mt-1">Right level of detail for each creator's data literacy</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <strong>Question-driven insights</strong>
                        <p className="text-gray-600 mt-1">Answers specific questions creators actually ask</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <strong>High engagement and action</strong>
                        <p className="text-gray-600 mt-1">Creators spend more time and implement more suggestions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Success Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Success Metrics by Implementation Phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="datadriven" stroke="#3b82f6" name="Engagement Score" />
                      <Line type="monotone" dataKey="intuitive" stroke="#10b981" name="Decision Speed" />
                      <Line type="monotone" dataKey="growth" stroke="#f59e0b" name="Action Rate" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Summary */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle>Phase 3.2.1 Implementation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Psychology-Based Features
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>5 creator analytics personas with adaptive interfaces</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Question-driven information architecture framework</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Performance, Revenue & Audience question categories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Adaptive complexity based on data literacy levels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Action-oriented insights with personalized recommendations</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  Psychology Impact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Dashboard Engagement</span>
                    <span className="font-semibold text-green-600">+340%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Decision Speed</span>
                    <span className="font-semibold text-blue-600">+85%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Abandonment Reduction</span>
                    <span className="font-semibold text-purple-600">-70%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Action Implementation</span>
                    <span className="font-semibold text-orange-600">+220%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}