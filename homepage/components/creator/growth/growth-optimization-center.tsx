"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DollarSign,
  Star,
  Clock,
  Share2,
  PackagePlus,
  Target,
  TrendingUp,
  TrendingDown,
  Zap,
  Users,
  Award,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Brain,
  BookOpen,
  Video,
  MessageSquare,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Play,
  Pause,
  Plus,
  Minus,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Calendar,
  Timer,
  Sparkles,
  Rocket,
  Globe,
  Heart,
  ThumbsUp,
  MessageCircle,
  FileText,
  Headphones,
  GraduationCap,
  HelpCircle,
  ExternalLink
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Growth Lever Interface
interface GrowthLever {
  id: string
  lever: string
  metricImpact: string
  toolProvided: string
  guidanceLevel: string
  currentValue: number
  targetValue: number
  progress: number
  recommendations: string[]
  enabled: boolean
}

// A/B Test Interface
interface ABTest {
  id: string
  name: string
  type: 'profile' | 'pricing' | 'response' | 'availability' | 'service'
  status: 'draft' | 'running' | 'completed' | 'paused'
  startDate: string
  endDate?: string
  variantA: {
    name: string
    description: string
    metrics: {
      views: number
      conversions: number
      revenue: number
    }
  }
  variantB: {
    name: string
    description: string
    metrics: {
      views: number
      conversions: number
      revenue: number
    }
  }
  confidence: number
  winner?: 'A' | 'B' | null
}

// Competitive Benchmark Interface
interface CompetitiveBenchmark {
  category: string
  metric: string
  myValue: number
  categoryAverage: number
  topPerformer: number
  percentile: number
  improvement: number
  recommendation: string
}

// Education Resource Interface
interface EducationResource {
  id: string
  title: string
  type: 'article' | 'video' | 'tutorial' | 'forum' | 'coaching'
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  views: number
  rating: number
  description: string
  tags: string[]
  featured: boolean
}

// Component Props Interface
interface GrowthOptimizationCenterProps {
  creatorId: string
  onUpdateSettings?: (settings: any) => void
  onStartABTest?: (test: ABTest) => void
  onAccessResource?: (resource: EducationResource) => void
  className?: string
}

// Mock Data
const mockGrowthLevers: GrowthLever[] = [
  {
    id: "pricing",
    lever: "Pricing",
    metricImpact: "Revenue +30%",
    toolProvided: "Price optimizer",
    guidanceLevel: "Recommendations",
    currentValue: 75,
    targetValue: 120,
    progress: 65,
    recommendations: [
      "Increase base price by $10-15 based on demand",
      "Add premium package for special occasions",
      "Implement dynamic pricing for holidays"
    ],
    enabled: true
  },
  {
    id: "quality",
    lever: "Quality",
    metricImpact: "Rating +0.5",
    toolProvided: "Quality checklist",
    guidanceLevel: "Tips & examples",
    currentValue: 4.2,
    targetValue: 4.7,
    progress: 80,
    recommendations: [
      "Use better lighting setup in videos",
      "Add personalized touches to each message",
      "Respond to clarifications faster"
    ],
    enabled: true
  },
  {
    id: "speed",
    lever: "Speed",
    metricImpact: "Bookings +25%",
    toolProvided: "Response timer",
    guidanceLevel: "Alerts & goals",
    currentValue: 6,
    targetValue: 2,
    progress: 45,
    recommendations: [
      "Set up mobile notifications",
      "Use quick response templates",
      "Schedule dedicated response times"
    ],
    enabled: false
  },
  {
    id: "marketing",
    lever: "Marketing",
    metricImpact: "Reach +40%",
    toolProvided: "Social sharing",
    guidanceLevel: "Templates",
    currentValue: 1200,
    targetValue: 2000,
    progress: 35,
    recommendations: [
      "Share customer testimonials weekly",
      "Post behind-the-scenes content",
      "Cross-promote on TikTok and Instagram"
    ],
    enabled: true
  },
  {
    id: "upselling",
    lever: "Upselling",
    metricImpact: "AOV +35%",
    toolProvided: "Bundle creator",
    guidanceLevel: "Suggestions",
    currentValue: 85,
    targetValue: 135,
    progress: 20,
    recommendations: [
      "Create birthday bundle packages",
      "Offer add-on services (rush delivery)",
      "Suggest gift wrapping options"
    ],
    enabled: false
  }
]

const mockABTests: ABTest[] = [
  {
    id: "profile-headline",
    name: "Profile Headline Test",
    type: "profile",
    status: "running",
    startDate: "2024-01-15",
    variantA: {
      name: "Current Headline",
      description: "Haitian TV Star - Personalized Messages",
      metrics: { views: 1240, conversions: 45, revenue: 3375 }
    },
    variantB: {
      name: "Emotional Headline", 
      description: "Bring Joy to Your Loved Ones - Authentic Messages from Haiti",
      metrics: { views: 1187, conversions: 62, revenue: 4650 }
    },
    confidence: 87,
    winner: "B"
  },
  {
    id: "pricing-structure",
    name: "Pricing Display Test",
    type: "pricing",
    status: "completed",
    startDate: "2024-01-01",
    endDate: "2024-01-14",
    variantA: {
      name: "Simple Pricing",
      description: "$75 per video",
      metrics: { views: 2341, conversions: 134, revenue: 10050 }
    },
    variantB: {
      name: "Tiered Pricing",
      description: "$75 Standard, $120 Premium, $200 Platinum",
      metrics: { views: 2298, conversions: 89, revenue: 12840 }
    },
    confidence: 95,
    winner: "B"
  }
]

const mockBenchmarks: CompetitiveBenchmark[] = [
  {
    category: "Entertainment",
    metric: "Average Price",
    myValue: 75,
    categoryAverage: 85,
    topPerformer: 150,
    percentile: 35,
    improvement: 10,
    recommendation: "Consider 13% price increase to match category average"
  },
  {
    category: "Entertainment", 
    metric: "Response Time (hours)",
    myValue: 6,
    categoryAverage: 4.2,
    topPerformer: 1.5,
    percentile: 25,
    improvement: -2,
    recommendation: "Improve response time by 2 hours to reach category average"
  },
  {
    category: "Entertainment",
    metric: "Customer Rating",
    myValue: 4.2,
    categoryAverage: 4.3,
    topPerformer: 4.9,
    percentile: 45,
    improvement: 0.1,
    recommendation: "Focus on video quality and personalization to improve ratings"
  },
  {
    category: "Entertainment",
    metric: "Monthly Orders",
    myValue: 28,
    categoryAverage: 45,
    topPerformer: 120,
    percentile: 20,
    improvement: 17,
    recommendation: "Increase social media presence and customer testimonials"
  }
]

const mockEducationResources: EducationResource[] = [
  {
    id: "pricing-strategy-guide",
    title: "Dynamic Pricing Strategies for Creators",
    type: "article",
    category: "Pricing",
    difficulty: "intermediate",
    duration: "12 min read",
    views: 2341,
    rating: 4.8,
    description: "Learn how to optimize your pricing based on demand, seasonality, and competition",
    tags: ["pricing", "revenue", "strategy"],
    featured: true
  },
  {
    id: "video-quality-masterclass",
    title: "Creating High-Quality Video Messages",
    type: "video",
    category: "Quality",
    difficulty: "beginner", 
    duration: "25 min",
    views: 5678,
    rating: 4.9,
    description: "Step-by-step guide to lighting, audio, and presentation techniques",
    tags: ["quality", "video", "production"],
    featured: true
  },
  {
    id: "response-time-optimization",
    title: "Speed Wins: Optimizing Your Response Time",
    type: "tutorial",
    category: "Efficiency",
    difficulty: "beginner",
    duration: "8 min",
    views: 1893,
    rating: 4.6,
    description: "Tools and techniques to respond faster and increase booking rates",
    tags: ["speed", "efficiency", "bookings"],
    featured: false
  },
  {
    id: "social-media-marketing",
    title: "Marketing Your Services on Social Media",
    type: "tutorial", 
    category: "Marketing",
    difficulty: "intermediate",
    duration: "18 min",
    views: 3241,
    rating: 4.7,
    description: "Build your audience and drive more bookings through social platforms",
    tags: ["marketing", "social media", "growth"],
    featured: true
  },
  {
    id: "upselling-techniques",
    title: "Advanced Upselling and Package Creation",
    type: "coaching",
    category: "Revenue",
    difficulty: "advanced",
    duration: "45 min session",
    views: 432,
    rating: 4.9,
    description: "One-on-one coaching to create profitable package bundles and upsells",
    tags: ["upselling", "packages", "revenue"],
    featured: false
  }
]

export function GrowthOptimizationCenter({ 
  creatorId, 
  onUpdateSettings, 
  onStartABTest,
  onAccessResource,
  className 
}: GrowthOptimizationCenterProps) {
  const [activeTab, setActiveTab] = React.useState("levers")
  const [selectedLever, setSelectedLever] = React.useState<GrowthLever | null>(null)
  const [selectedTest, setSelectedTest] = React.useState<ABTest | null>(null)
  const [isNewTestDialogOpen, setIsNewTestDialogOpen] = React.useState(false)
  const [growthLevers, setGrowthLevers] = React.useState<GrowthLever[]>(mockGrowthLevers)
  const [abTests] = React.useState<ABTest[]>(mockABTests)
  const [benchmarks] = React.useState<CompetitiveBenchmark[]>(mockBenchmarks)
  const [resources] = React.useState<EducationResource[]>(mockEducationResources)
  const [selectedCategory, setSelectedCategory] = React.useState("all")

  // Toggle lever enabled state
  const toggleLever = (leverId: string) => {
    setGrowthLevers(prev => prev.map(lever => 
      lever.id === leverId 
        ? { ...lever, enabled: !lever.enabled }
        : lever
    ))
  }

  // Get status color
  const getStatusColor = (status: ABTest['status']) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800 dark:bg-green-900/30'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30'
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30'
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30'
    }
  }

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600'
    if (confidence >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get percentile color
  const getPercentileColor = (percentile: number) => {
    if (percentile >= 75) return 'text-green-600'
    if (percentile >= 50) return 'text-yellow-600'
    if (percentile >= 25) return 'text-orange-600'
    return 'text-red-600'
  }

  // Get resource type icon
  const getResourceIcon = (type: EducationResource['type']) => {
    switch (type) {
      case 'article': return FileText
      case 'video': return Video
      case 'tutorial': return Play
      case 'forum': return MessageCircle
      case 'coaching': return Headphones
      default: return BookOpen
    }
  }

  // Filter resources by category
  const filteredResources = resources.filter(resource => 
    selectedCategory === "all" || resource.category.toLowerCase() === selectedCategory.toLowerCase()
  )

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Growth & Optimization Center</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Tools and insights to grow your creator business
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            Optimization Active
          </Badge>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="levers" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Growth Levers
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            A/B Testing
          </TabsTrigger>
          <TabsTrigger value="benchmarks" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Benchmarks
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Education
          </TabsTrigger>
        </TabsList>

        {/* Growth Levers Tab */}
        <TabsContent value="levers" className="space-y-6">
          <div className="grid gap-6">
            {growthLevers.map((lever, index) => (
              <motion.div
                key={lever.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "relative",
                  !lever.enabled && "opacity-60"
                )}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          {lever.id === "pricing" && <DollarSign className="h-5 w-5 text-purple-600" />}
                          {lever.id === "quality" && <Star className="h-5 w-5 text-purple-600" />}
                          {lever.id === "speed" && <Clock className="h-5 w-5 text-purple-600" />}
                          {lever.id === "marketing" && <Share2 className="h-5 w-5 text-purple-600" />}
                          {lever.id === "upselling" && <PackagePlus className="h-5 w-5 text-purple-600" />}
                        </div>
                        <div>
                          <CardTitle>{lever.lever}</CardTitle>
                          <CardDescription>{lever.metricImpact}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={lever.enabled}
                          onCheckedChange={() => toggleLever(lever.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLever(lever)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {lever.enabled && (
                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress to Target</span>
                          <span className="text-sm text-gray-600">{lever.progress}%</span>
                        </div>
                        <Progress value={lever.progress} className="h-2" />
                      </div>

                      {/* Current vs Target */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Current</span>
                          <p className="font-semibold">
                            {lever.id === "pricing" && `$${lever.currentValue}`}
                            {lever.id === "quality" && `${lever.currentValue}/5`}
                            {lever.id === "speed" && `${lever.currentValue}h`}
                            {lever.id === "marketing" && `${lever.currentValue} reach`}
                            {lever.id === "upselling" && `$${lever.currentValue} AOV`}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Target</span>
                          <p className="font-semibold text-green-600">
                            {lever.id === "pricing" && `$${lever.targetValue}`}
                            {lever.id === "quality" && `${lever.targetValue}/5`}
                            {lever.id === "speed" && `${lever.targetValue}h`}
                            {lever.id === "marketing" && `${lever.targetValue} reach`}
                            {lever.id === "upselling" && `$${lever.targetValue} AOV`}
                          </p>
                        </div>
                      </div>

                      {/* Tool & Guidance */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium">{lever.toolProvided}</span>
                        </div>
                        <Badge variant="outline">{lever.guidanceLevel}</Badge>
                      </div>

                      {/* Quick Recommendations */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium">Quick Wins</span>
                        </div>
                        {lever.recommendations.slice(0, 2).map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                            <span>{rec}</span>
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" className="text-purple-600 h-auto p-0">
                          View all recommendations
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* A/B Testing Tab */}
        <TabsContent value="testing" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">A/B Testing Dashboard</h3>
              <p className="text-sm text-gray-600">Test different variations to optimize performance</p>
            </div>
            <Button onClick={() => setIsNewTestDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Test
            </Button>
          </div>

          <div className="grid gap-4">
            {abTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {test.name}
                          <Badge className={getStatusColor(test.status)}>
                            {test.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {test.type} • Started {new Date(test.startDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {test.confidence && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Confidence</p>
                          <p className={cn("font-semibold", getConfidenceColor(test.confidence))}>
                            {test.confidence}%
                          </p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Variant A */}
                      <div className={cn(
                        "p-4 border rounded-lg",
                        test.winner === 'A' && "border-green-500 bg-green-50 dark:bg-green-900/20"
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium flex items-center gap-1">
                            Variant A
                            {test.winner === 'A' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{test.variantA.description}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Views:</span>
                            <span>{test.variantA.metrics.views.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Conversions:</span>
                            <span>{test.variantA.metrics.conversions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Revenue:</span>
                            <span>${test.variantA.metrics.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Conv. Rate:</span>
                            <span>{((test.variantA.metrics.conversions / test.variantA.metrics.views) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Variant B */}
                      <div className={cn(
                        "p-4 border rounded-lg",
                        test.winner === 'B' && "border-green-500 bg-green-50 dark:bg-green-900/20"
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium flex items-center gap-1">
                            Variant B
                            {test.winner === 'B' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{test.variantB.description}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Views:</span>
                            <span>{test.variantB.metrics.views.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Conversions:</span>
                            <span>{test.variantB.metrics.conversions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Revenue:</span>
                            <span>${test.variantB.metrics.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Conv. Rate:</span>
                            <span>{((test.variantB.metrics.conversions / test.variantB.metrics.views) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Test Actions */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {test.status === 'running' && (
                          <>
                            <Activity className="w-4 h-4 text-green-600" />
                            Test is running
                          </>
                        )}
                        {test.status === 'completed' && test.winner && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Winner: Variant {test.winner}
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        {test.status === 'running' && (
                          <Button variant="outline" size="sm">
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Competitive Benchmarks Tab */}
        <TabsContent value="benchmarks" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Competitive Intelligence</h3>
            <p className="text-sm text-gray-600">See how you stack up against other creators in your category</p>
          </div>

          <div className="grid gap-4">
            {benchmarks.map((benchmark, index) => (
              <motion.div
                key={`${benchmark.category}-${benchmark.metric}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{benchmark.metric}</CardTitle>
                      <Badge className={cn(
                        "font-medium",
                        getPercentileColor(benchmark.percentile)
                      )}>
                        {benchmark.percentile}th percentile
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Comparison Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Your Value</span>
                          <span className="font-medium">{benchmark.myValue}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Category Average</span>
                          <span className="font-medium">{benchmark.categoryAverage}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Top Performer</span>
                          <span className="font-medium">{benchmark.topPerformer}</span>
                        </div>
                      </div>

                      {/* Visual Progress */}
                      <div className="relative">
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-purple-600 rounded-full"
                            style={{ 
                              width: `${Math.min((benchmark.myValue / benchmark.topPerformer) * 100, 100)}%` 
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>0</span>
                          <span>{benchmark.topPerformer}</span>
                        </div>
                      </div>

                      {/* Gap Analysis */}
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">Improvement Opportunity</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{benchmark.recommendation}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">Potential impact:</span>
                          <span className={cn(
                            "text-xs font-medium",
                            benchmark.improvement > 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {benchmark.improvement > 0 ? "+" : ""}{benchmark.improvement}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Education & Support Tab */}
        <TabsContent value="education" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Education & Support</h3>
              <p className="text-sm text-gray-600">Learn best practices and get help from experts</p>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pricing">Pricing</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="efficiency">Efficiency</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Featured Resources */}
          <div className="grid gap-4">
            {filteredResources
              .filter(resource => resource.featured)
              .map((resource, index) => {
                const Icon = getResourceIcon(resource.type)
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Icon className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold mb-1">{resource.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                  <span>{resource.duration}</span>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{resource.rating}</span>
                                  </div>
                                  <span>•</span>
                                  <span>{resource.views.toLocaleString()} views</span>
                                </div>
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {resource.difficulty}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex flex-wrap gap-1">
                                {resource.tags.slice(0, 3).map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <Button 
                                onClick={() => onAccessResource?.(resource)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600"
                              >
                                Access
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
          </div>

          {/* All Resources */}
          <div className="space-y-4">
            <h4 className="font-medium">All Resources</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {filteredResources
                .filter(resource => !resource.featured)
                .map((resource, index) => {
                  const Icon = getResourceIcon(resource.type)
                  return (
                    <Card key={resource.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm mb-1 truncate">{resource.title}</h5>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{resource.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{resource.duration}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                  <span>{resource.rating}</span>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs"
                                onClick={() => onAccessResource?.(resource)}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* New A/B Test Dialog */}
      <Dialog open={isNewTestDialogOpen} onOpenChange={setIsNewTestDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New A/B Test</DialogTitle>
            <DialogDescription>
              Test different variations to optimize your performance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Test Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profile">Profile Variations</SelectItem>
                  <SelectItem value="pricing">Pricing Experiments</SelectItem>
                  <SelectItem value="response">Response Templates</SelectItem>
                  <SelectItem value="availability">Availability Windows</SelectItem>
                  <SelectItem value="service">Service Offerings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Test Name</Label>
              <Input placeholder="e.g., Profile Headline Test" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Variant A Description</Label>
                <Textarea placeholder="Current version description" />
              </div>
              <div>
                <Label>Variant B Description</Label>
                <Textarea placeholder="New version description" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsNewTestDialogOpen(false)}>
              Create Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}