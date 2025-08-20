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
  Target,
  TrendingUp,
  DollarSign,
  Star,
  Clock,
  Share2,
  PackagePlus,
  BarChart3,
  Award,
  GraduationCap,
  Lightbulb,
  Zap,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Brain,
  Rocket,
  Activity,
  Globe,
  BookOpen,
  Video,
  FileText,
  MessageCircle,
  Headphones,
  Play,
  Eye,
  ThumbsUp,
  Heart,
  ExternalLink,
  Plus,
  Info,
  Sparkles,
  Timer,
  RefreshCw,
  Calendar,
  Mic,
  Camera,
  Edit,
  Settings,
  Filter,
  Search
} from "lucide-react"
import { motion } from "framer-motion"

// Import the main component
import { GrowthOptimizationCenter } from "@/components/creator/growth/growth-optimization-center"

// Growth impact data
const growthImpactMetrics = [
  {
    lever: "Pricing Optimization",
    before: "$75",
    after: "$98",
    improvement: "+30%",
    impact: "Revenue increase of $2,300/month",
    icon: DollarSign,
    color: "green"
  },
  {
    lever: "Quality Enhancement", 
    before: "4.2/5",
    after: "4.7/5",
    improvement: "+0.5",
    impact: "25% more repeat customers",
    icon: Star,
    color: "yellow"
  },
  {
    lever: "Response Speed",
    before: "6 hours",
    after: "2 hours",
    improvement: "+67%",
    impact: "25% booking rate increase",
    icon: Clock,
    color: "blue"
  },
  {
    lever: "Marketing Reach",
    before: "1,200",
    after: "1,680",
    improvement: "+40%",
    impact: "480 new followers/month",
    icon: Share2,
    color: "purple"
  },
  {
    lever: "Upselling Strategy",
    before: "$85",
    after: "$115",
    improvement: "+35%",
    impact: "Higher order values",
    icon: PackagePlus,
    color: "pink"
  }
]

// Success stories data
const successStories = [
  {
    creator: "Marie Jean-Baptiste",
    category: "Music Artist",
    improvement: "Revenue +180%",
    timeframe: "3 months",
    story: "Optimized pricing strategy and added premium packages",
    metrics: {
      before: { revenue: 2100, rating: 4.1, orders: 28 },
      after: { revenue: 5880, rating: 4.8, orders: 56 }
    },
    image: "/placeholder-user.jpg"
  },
  {
    creator: "Jean-Claude Voltaire",
    category: "Actor/Comedian", 
    improvement: "Bookings +150%",
    timeframe: "6 weeks",
    story: "Improved response time and video quality",
    metrics: {
      before: { revenue: 3200, rating: 4.3, orders: 32 },
      after: { revenue: 6400, rating: 4.9, orders: 80 }
    },
    image: "/creator-avatars/jean-claude.jpg"
  }
]

// Best practices by category
const bestPracticesByCategory = {
  pricing: [
    "Start with market research in your category",
    "Test 10-15% price increases gradually", 
    "Create premium tiers for special occasions",
    "Use dynamic pricing during holidays",
    "Bundle complementary services together"
  ],
  quality: [
    "Invest in proper lighting equipment",
    "Use a dedicated microphone for audio",
    "Practice your delivery and pacing",
    "Add personalized touches to each video",
    "Review and re-record if needed"
  ],
  speed: [
    "Set up mobile push notifications",
    "Use quick response templates",
    "Batch process similar requests",
    "Set specific response time windows",
    "Automate initial confirmations"
  ],
  marketing: [
    "Share customer testimonials weekly", 
    "Post behind-the-scenes content",
    "Cross-promote on multiple platforms",
    "Collaborate with other creators",
    "Use relevant hashtags and trends"
  ],
  upselling: [
    "Create themed package bundles",
    "Offer rush delivery options",
    "Suggest gift wrapping services",
    "Add follow-up video options",
    "Provide exclusive content tiers"
  ]
}

// A/B Testing examples
const abTestExamples = [
  {
    test: "Profile Headline",
    winner: "Emotional approach",
    improvement: "+38% conversion",
    description: "\"Bring Joy to Loved Ones\" vs \"Professional Video Messages\"",
    confidence: 95
  },
  {
    test: "Pricing Display",
    winner: "Tiered pricing",
    improvement: "+28% AOV",
    description: "Single price vs Three-tier packages",
    confidence: 87
  },
  {
    test: "Response Template",
    winner: "Personal voice",
    improvement: "+22% satisfaction", 
    description: "Formal tone vs Friendly, personal tone",
    confidence: 92
  }
]

// Competitive intelligence sample
const competitiveInsights = [
  {
    metric: "Average Response Time",
    yourValue: "2 hours",
    categoryAverage: "4.2 hours", 
    topPerformer: "45 minutes",
    status: "above_average",
    opportunity: "Maintain competitive advantage"
  },
  {
    metric: "Price Point",
    yourValue: "$75",
    categoryAverage: "$85",
    topPerformer: "$150",
    status: "below_average", 
    opportunity: "Consider 13% price increase"
  },
  {
    metric: "Customer Rating",
    yourValue: "4.7",
    categoryAverage: "4.3",
    topPerformer: "4.9",
    status: "above_average",
    opportunity: "Focus on consistency"
  }
]

export default function Phase319DemoPage() {
  const [activeTab, setActiveTab] = React.useState("demo")
  const [selectedLever, setSelectedLever] = React.useState("all")
  const [selectedStory, setSelectedStory] = React.useState(0)
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading growth optimization tools...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-purple-600">
                  Phase 3.1.9
                </Badge>
                <Badge variant="outline">Growth & Optimization</Badge>
              </div>
              <h1 className="text-3xl font-bold">Growth & Optimization Tools</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Success enablement tools and insights to help creators grow their business
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <Rocket className="w-3 h-3 mr-1" />
                Performance Boost
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics Overview */}
        <div className="grid lg:grid-cols-5 gap-4 mb-8">
          {growthImpactMetrics.map((metric, index) => (
            <motion.div
              key={metric.lever}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 bg-${metric.color}-100 dark:bg-${metric.color}-900/30 rounded-lg`}>
                      <metric.icon className={`h-4 w-4 text-${metric.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{metric.lever}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Before:</span>
                      <span>{metric.before}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">After:</span>
                      <span className="font-medium">{metric.after}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={`bg-${metric.color}-100 text-${metric.color}-800 text-xs`}>
                        {metric.improvement}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Component Demo */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="success">Success Stories</TabsTrigger>
            <TabsTrigger value="testing">A/B Testing</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth & Optimization Center</CardTitle>
                <CardDescription>
                  Complete growth toolkit with 5 key levers, A/B testing, competitive intelligence, and education resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GrowthOptimizationCenter
                  creatorId="creator-123"
                  onUpdateSettings={(settings) => console.log("Update settings:", settings)}
                  onStartABTest={(test) => console.log("Start A/B test:", test)}
                  onAccessResource={(resource) => console.log("Access resource:", resource)}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="impact" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Growth Levers Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Growth Levers Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {growthImpactMetrics.map((metric, index) => (
                    <div key={metric.lever} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.lever}</span>
                        <Badge className={`bg-${metric.color}-100 text-${metric.color}-800`}>
                          {metric.improvement}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{metric.impact}</p>
                      <Progress 
                        value={parseInt(metric.improvement.replace(/[^0-9]/g, ""))} 
                        className="h-1.5" 
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* ROI Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    ROI Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">+$6,840</div>
                        <p className="text-sm text-gray-600">Additional Monthly Revenue</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Before Optimization</p>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Avg. Order Value:</span>
                            <span>$85</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Orders/Month:</span>
                            <span>28</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Monthly Revenue:</span>
                            <span>$2,380</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 mb-1">After Optimization</p>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Avg. Order Value:</span>
                            <span className="text-green-600">$115</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Orders/Month:</span>
                            <span className="text-green-600">80</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Monthly Revenue:</span>
                            <span className="text-green-600">$9,200</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">287% Growth</div>
                      <p className="text-xs text-gray-600">In 3-6 months with optimization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature Comparison */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Before vs After Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-red-600 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Without Optimization Tools
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Manual pricing decisions without data</li>
                      <li>• No quality improvement guidance</li>
                      <li>• Slow response times hurt bookings</li>
                      <li>• Limited marketing reach and strategy</li>
                      <li>• Missing upselling opportunities</li>
                      <li>• No competitive intelligence</li>
                      <li>• Learning through trial and error</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      With Growth & Optimization Tools
                    </h4>
                    <ul className="space-y-2 text-sm text-green-600">
                      <li>• AI-powered pricing recommendations (+30% revenue)</li>
                      <li>• Quality checklists and tips (+0.5 rating)</li>
                      <li>• Response time alerts and goals (+25% bookings)</li>
                      <li>• Social sharing templates (+40% reach)</li>
                      <li>• Bundle creation suggestions (+35% AOV)</li>
                      <li>• Real-time competitive benchmarking</li>
                      <li>• Curated education and expert coaching</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="success" className="mt-6">
            <div className="space-y-6">
              {/* Success Story Selector */}
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Creator Success Stories</h3>
                <Select value={selectedStory.toString()} onValueChange={(v) => setSelectedStory(parseInt(v))}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {successStories.map((story, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {story.creator} - {story.improvement}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Featured Success Story */}
              <Card className="border-l-4 border-l-purple-600">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {successStories[selectedStory].creator.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <CardTitle>{successStories[selectedStory].creator}</CardTitle>
                        <CardDescription>{successStories[selectedStory].category}</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {successStories[selectedStory].improvement}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <Rocket className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Success Strategy:</strong> {successStories[selectedStory].story}
                      </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-red-600 mb-1">
                          ${successStories[selectedStory].metrics.before.revenue.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">Before Revenue</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {successStories[selectedStory].metrics.before.orders} orders • {successStories[selectedStory].metrics.before.rating}/5 rating
                        </div>
                      </div>

                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <ArrowRight className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                        <p className="text-sm font-medium">{successStories[selectedStory].timeframe}</p>
                        <p className="text-xs text-gray-600">Optimization Period</p>
                      </div>

                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          ${successStories[selectedStory].metrics.after.revenue.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">After Revenue</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {successStories[selectedStory].metrics.after.orders} orders • {successStories[selectedStory].metrics.after.rating}/5 rating
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Success Factors */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      Success Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Data-driven pricing decisions</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Consistent quality improvements</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Faster response times</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Strategic marketing efforts</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Effective upselling strategies</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="h-5 w-5 text-blue-600" />
                      Implementation Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm">Week 1-2: Price optimization setup</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm">Week 3-4: Quality improvement focus</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm">Week 5-6: Response time optimization</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm">Week 7-8: Marketing strategy rollout</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-sm">Week 9+: Results and optimization</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="testing" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    A/B Testing Results
                  </CardTitle>
                  <CardDescription>
                    Real test results showing the power of optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {abTestExamples.map((test, index) => (
                      <div key={test.test} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{test.test}</h4>
                          <Badge className="bg-green-100 text-green-800">
                            {test.improvement}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Winner: {test.winner}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {test.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* A/B Test Categories */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { type: "Profile Variations", icon: Users, tests: 12 },
                  { type: "Pricing Experiments", icon: DollarSign, tests: 8 },
                  { type: "Response Templates", icon: MessageCircle, tests: 15 },
                  { type: "Availability Windows", icon: Calendar, tests: 6 },
                  { type: "Service Offerings", icon: Star, tests: 10 }
                ].map((category, index) => (
                  <Card key={category.type}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
                          <category.icon className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{category.type}</h4>
                          <p className="text-xs text-gray-500">{category.tests} tests available</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Play className="w-3 h-3 mr-1" />
                        Start Test
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="benchmarks" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Competitive Intelligence
                </CardTitle>
                <CardDescription>
                  See how you stack up against other creators in your category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {competitiveInsights.map((insight, index) => (
                    <div key={insight.metric} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{insight.metric}</h4>
                        <Badge className={
                          insight.status === 'above_average' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }>
                          {insight.status === 'above_average' ? 'Above Average' : 'Below Average'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <p className="text-blue-600 font-bold">{insight.yourValue}</p>
                          <p className="text-xs text-gray-500">Your Value</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-bold">{insight.categoryAverage}</p>
                          <p className="text-xs text-gray-500">Category Avg</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                          <p className="text-green-600 font-bold">{insight.topPerformer}</p>
                          <p className="text-xs text-gray-500">Top Performer</p>
                        </div>
                      </div>

                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Opportunity:</strong> {insight.opportunity}
                        </AlertDescription>
                      </Alert>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <div className="space-y-6">
              {/* Education Categories */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { category: "Pricing", icon: DollarSign, resources: 12, color: "green" },
                  { category: "Quality", icon: Star, resources: 15, color: "yellow" },
                  { category: "Efficiency", icon: Clock, resources: 8, color: "blue" },
                  { category: "Marketing", icon: Share2, resources: 20, color: "purple" },
                  { category: "Revenue", icon: TrendingUp, resources: 10, color: "pink" }
                ].map((cat, index) => (
                  <Card key={cat.category}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 bg-${cat.color}-100 dark:bg-${cat.color}-900/30 rounded`}>
                          <cat.icon className={`w-5 h-5 text-${cat.color}-600`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{cat.category}</h4>
                          <p className="text-sm text-gray-500">{cat.resources} resources</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" size="sm">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explore
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Featured Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    Featured Learning Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Dynamic Pricing Masterclass",
                        type: "video",
                        duration: "45 min",
                        rating: 4.9,
                        description: "Learn advanced pricing strategies",
                        icon: Video
                      },
                      {
                        title: "A/B Testing Guide",
                        type: "article", 
                        duration: "12 min read",
                        rating: 4.7,
                        description: "Step-by-step testing framework",
                        icon: FileText
                      },
                      {
                        title: "Growth Coaching Session",
                        type: "coaching",
                        duration: "60 min",
                        rating: 5.0,
                        description: "1-on-1 optimization consultation",
                        icon: Headphones
                      },
                      {
                        title: "Creator Community Forum",
                        type: "forum",
                        duration: "Ongoing",
                        rating: 4.8,
                        description: "Connect with successful creators",
                        icon: MessageCircle
                      }
                    ].map((resource, index) => (
                      <div key={resource.title} className="p-4 border rounded-lg hover:shadow-sm transition">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
                            <resource.icon className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm mb-1">{resource.title}</h5>
                            <p className="text-xs text-gray-600 mb-2">{resource.description}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">{resource.duration}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{resource.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Summary */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader>
            <CardTitle>Phase 3.1.9 Implementation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Completed Features
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>5 growth levers with impact tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>A/B testing tools for optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Competitive intelligence benchmarking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Education resources and expert coaching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Success enablement recommendations</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Growth Impact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Revenue Growth</span>
                    <span className="font-semibold text-green-600">+30-180%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Quality Improvement</span>
                    <span className="font-semibold text-yellow-600">+0.5 rating</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Booking Increase</span>
                    <span className="font-semibold text-blue-600">+25-150%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Time to Results</span>
                    <span className="font-semibold text-purple-600">3-6 weeks</span>
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