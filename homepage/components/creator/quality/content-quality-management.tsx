"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  Camera,
  Mic,
  Video,
  Sun,
  Volume2,
  Monitor,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Award,
  Trophy,
  Shield,
  Zap,
  Brain,
  Eye,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Square,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Lightbulb,
  MessageSquare,
  Users,
  Heart,
  ThumbsUp,
  Timer,
  Gauge,
  Filter,
  Database,
  LineChart,
  PieChart,
  FileText,
  Edit,
  Check,
  X,
  AlertTriangle,
  HelpCircle,
  Send,
  Download,
  Upload,
  Share2,
  Copy,
  Trash2,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Headphones,
  Wifi,
  Signal,
  Battery,
  Cpu,
  Server,
  Cloud,
  Bell,
  Flag,
  Hash,
  Tag,
  Folder,
  Archive,
  Box,
  Package,
  Layers,
  Layout,
  Grid,
  List,
  Map,
  Globe,
  Compass,
  Navigation,
  MapPin,
  Landmark,
  Building,
  Home,
  Store,
  ShoppingCart,
  CreditCard,
  Wallet,
  Receipt,
  File,
  Mail,
  MessageCircle,
  Phone,
  Droplet,
  Thermometer,
  Umbrella,
  Coffee,
  Pizza,
  Cake,
  Beer,
  Wine,
  Utensils,
  HeartOff,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Angry,
  RotateCcw,
  Save,
  Lock,
  Unlock,
  Search,
  ExternalLink,
  Link,
  Image,
  Music,
  Film,
  Tv,
  Radio,
  Podcast,
  Voicemail,
  PhoneCall,
  PhoneOff,
  VideoOff,
  MicOff,
  VolumeX,
  Volume1,
  Vibrate,
  BellOff,
  BellRing,
  Notification
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ComposedChart,
  RadialBarChart,
  RadialBar
} from "recharts"

// Quality checkpoint types
type CheckpointStage = "pre-record" | "recording" | "post-record" | "pre-delivery" | "post-delivery"
type CheckpointStatus = "pending" | "checking" | "passed" | "failed" | "warning"

interface QualityCheckpoint {
  stage: CheckpointStage
  checkType: string
  criteria: string[]
  status: CheckpointStatus
  score?: number
  issues?: string[]
  suggestions?: string[]
  automation: boolean
}

interface QualityMetrics {
  overall: number
  technical: {
    score: number
    videoQuality: number
    audioClarity: number
    lighting: number
    framing: number
    background: number
  }
  content: {
    score: number
    messageAccuracy: number
    energyLevel: number
    personalization: number
    scriptAdherence: number
    engagement: number
  }
  delivery: {
    score: number
    onTimeRate: number
    responseTime: number
    customerSatisfaction: number
    reRecordRate: number
    editRate: number
  }
}

interface ImprovementSuggestion {
  id: string
  category: "technical" | "content" | "delivery"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  impact: number
  effort: number
  aiGenerated: boolean
}

interface ContentQualityManagementProps {
  onCheckpointUpdate?: (checkpoint: QualityCheckpoint) => void
  onQualityImprove?: (suggestion: ImprovementSuggestion) => void
  onMetricsRefresh?: () => void
  enableAISuggestions?: boolean
  enableRealTimeMonitoring?: boolean
  enablePeerComparison?: boolean
  className?: string
}

// Mock data generators
const generateQualityTrends = () => {
  const data = []
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      technical: 85 + Math.random() * 10,
      content: 80 + Math.random() * 15,
      delivery: 88 + Math.random() * 10,
      overall: 84 + Math.random() * 12
    })
  }
  return data
}

const generateIssueDistribution = () => [
  { issue: "Audio Levels", count: 23, severity: "medium" },
  { issue: "Lighting", count: 18, severity: "low" },
  { issue: "Background Noise", count: 15, severity: "high" },
  { issue: "Framing", count: 12, severity: "low" },
  { issue: "Energy Level", count: 10, severity: "medium" },
  { issue: "Script Accuracy", count: 8, severity: "low" }
]

const generatePeerComparison = () => [
  { metric: "Video Quality", you: 92, peers: 85, top10: 95 },
  { metric: "Audio Clarity", you: 88, peers: 82, top10: 94 },
  { metric: "Delivery Time", you: 95, peers: 78, top10: 96 },
  { metric: "Customer Rating", you: 4.7, peers: 4.3, top10: 4.9 },
  { metric: "Re-record Rate", you: 5, peers: 12, top10: 3 }
]

const generatePerformanceHeatmap = () => {
  const hours = []
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  
  for (let hour = 6; hour <= 22; hour++) {
    for (let day of days) {
      hours.push({
        hour: `${hour}:00`,
        day,
        quality: 70 + Math.random() * 30
      })
    }
  }
  return hours
}

// Checkpoint configurations
const checkpointConfigs = {
  "pre-record": {
    icon: Camera,
    color: "bg-blue-500",
    checks: ["Lighting setup", "Audio test", "Background check", "Equipment ready", "Script review"]
  },
  "recording": {
    icon: Video,
    color: "bg-purple-500",
    checks: ["Audio levels", "Video framing", "Eye contact", "Energy level", "Script delivery"]
  },
  "post-record": {
    icon: Eye,
    color: "bg-green-500",
    checks: ["Content review", "Quality check", "Duration verify", "Requirements met", "Edit needs"]
  },
  "pre-delivery": {
    icon: Shield,
    color: "bg-orange-500",
    checks: ["Final review", "Customer requirements", "Platform specs", "Metadata complete", "Preview ready"]
  },
  "post-delivery": {
    icon: Star,
    color: "bg-pink-500",
    checks: ["Delivery confirmed", "Customer notified", "Feedback requested", "Analytics tracked", "Follow-up scheduled"]
  }
}

export function ContentQualityManagement({
  onCheckpointUpdate,
  onQualityImprove,
  onMetricsRefresh,
  enableAISuggestions = true,
  enableRealTimeMonitoring = true,
  enablePeerComparison = true,
  className
}: ContentQualityManagementProps) {
  const [activeTab, setActiveTab] = React.useState("checkpoints")
  const [selectedCheckpoint, setSelectedCheckpoint] = React.useState<CheckpointStage>("pre-record")
  const [isMonitoring, setIsMonitoring] = React.useState(false)
  
  // Initialize checkpoints
  const [checkpoints, setCheckpoints] = React.useState<QualityCheckpoint[]>([
    {
      stage: "pre-record",
      checkType: "Setup",
      criteria: checkpointConfigs["pre-record"].checks,
      status: "passed",
      score: 95,
      automation: true
    },
    {
      stage: "recording",
      checkType: "Real-time",
      criteria: checkpointConfigs["recording"].checks,
      status: "checking",
      score: 88,
      issues: ["Audio levels slightly low"],
      automation: true
    },
    {
      stage: "post-record",
      checkType: "Review",
      criteria: checkpointConfigs["post-record"].checks,
      status: "pending",
      automation: false
    },
    {
      stage: "pre-delivery",
      checkType: "Final",
      criteria: checkpointConfigs["pre-delivery"].checks,
      status: "pending",
      automation: true
    },
    {
      stage: "post-delivery",
      checkType: "Feedback",
      criteria: checkpointConfigs["post-delivery"].checks,
      status: "pending",
      automation: false
    }
  ])

  // Quality metrics
  const [metrics] = React.useState<QualityMetrics>({
    overall: 4.8,
    technical: {
      score: 4.9,
      videoQuality: 98,
      audioClarity: 95,
      lighting: 97,
      framing: 96,
      background: 94
    },
    content: {
      score: 4.7,
      messageAccuracy: 96,
      energyLevel: 92,
      personalization: 94,
      scriptAdherence: 93,
      engagement: 90
    },
    delivery: {
      score: 4.8,
      onTimeRate: 99,
      responseTime: 2.5,
      customerSatisfaction: 95,
      reRecordRate: 5,
      editRate: 12
    }
  })

  // Improvement suggestions
  const [suggestions] = React.useState<ImprovementSuggestion[]>([
    {
      id: "1",
      category: "technical",
      priority: "high",
      title: "Improve Audio Levels",
      description: "Your audio levels are 5-10dB lower than optimal. Adjust microphone gain or position.",
      impact: 85,
      effort: 20,
      aiGenerated: true
    },
    {
      id: "2",
      category: "technical",
      priority: "medium",
      title: "Optimize Lighting Position",
      description: "Move key light 15° to the left to reduce shadows on face.",
      impact: 70,
      effort: 15,
      aiGenerated: true
    },
    {
      id: "3",
      category: "content",
      priority: "medium",
      title: "Increase Energy Level",
      description: "Energy drops 20% in middle sections. Try standing or taking a brief break.",
      impact: 75,
      effort: 30,
      aiGenerated: true
    },
    {
      id: "4",
      category: "content",
      priority: "low",
      title: "Add Personal Touch",
      description: "Include more personal anecdotes to increase engagement by 15%.",
      impact: 60,
      effort: 25,
      aiGenerated: false
    },
    {
      id: "5",
      category: "delivery",
      priority: "low",
      title: "Batch Recording Sessions",
      description: "Group similar videos to maintain consistency and save 30% setup time.",
      impact: 65,
      effort: 40,
      aiGenerated: true
    }
  ])

  // Data for visualizations
  const qualityTrends = React.useMemo(() => generateQualityTrends(), [])
  const issueDistribution = React.useMemo(() => generateIssueDistribution(), [])
  const peerComparison = React.useMemo(() => generatePeerComparison(), [])
  const performanceHeatmap = React.useMemo(() => generatePerformanceHeatmap(), [])

  // Toggle monitoring
  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
  }

  // Update checkpoint status
  const updateCheckpointStatus = (stage: CheckpointStage, status: CheckpointStatus) => {
    setCheckpoints(prev => prev.map(cp => 
      cp.stage === stage ? { ...cp, status } : cp
    ))
  }

  // Get status icon
  const getStatusIcon = (status: CheckpointStatus) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "checking":
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  // Get status color
  const getStatusColor = (status: CheckpointStatus) => {
    switch (status) {
      case "passed":
        return "border-green-200 bg-green-50 dark:bg-green-900/20"
      case "failed":
        return "border-red-200 bg-red-50 dark:bg-red-900/20"
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"
      case "checking":
        return "border-blue-200 bg-blue-50 dark:bg-blue-900/20"
      default:
        return "border-gray-200 bg-gray-50 dark:bg-gray-800"
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Quality Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Content Quality Management
          </CardTitle>
          <CardDescription>
            Maintain high content standards with systematic quality checks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Overall Quality Score */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="md:col-span-1 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Overall Quality</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">{metrics.overall}/5.0</p>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < Math.floor(metrics.overall) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Scores */}
            <Card className="border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Technical</span>
                  <span className="text-2xl font-bold">{metrics.technical.score}</span>
                </div>
                <Progress value={metrics.technical.score * 20} className="h-2" />
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>Video: {metrics.technical.videoQuality}%</div>
                  <div>Audio: {metrics.technical.audioClarity}%</div>
                  <div>Light: {metrics.technical.lighting}%</div>
                  <div>Frame: {metrics.technical.framing}%</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Content</span>
                  <span className="text-2xl font-bold">{metrics.content.score}</span>
                </div>
                <Progress value={metrics.content.score * 20} className="h-2" />
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>Message: {metrics.content.messageAccuracy}%</div>
                  <div>Energy: {metrics.content.energyLevel}%</div>
                  <div>Personal: {metrics.content.personalization}%</div>
                  <div>Engage: {metrics.content.engagement}%</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Delivery</span>
                  <span className="text-2xl font-bold">{metrics.delivery.score}</span>
                </div>
                <Progress value={metrics.delivery.score * 20} className="h-2" />
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>On-time: {metrics.delivery.onTimeRate}%</div>
                  <div>Response: {metrics.delivery.responseTime}h</div>
                  <div>Satisfaction: {metrics.delivery.customerSatisfaction}%</div>
                  <div>Re-record: {metrics.delivery.reRecordRate}%</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Monitoring Toggle */}
          {enableRealTimeMonitoring && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className={cn("h-5 w-5", isMonitoring ? "text-green-600" : "text-gray-400")} />
                <div>
                  <p className="font-medium text-sm">Real-time Quality Monitoring</p>
                  <p className="text-xs text-gray-500">Automatically check quality during recording</p>
                </div>
              </div>
              <Switch checked={isMonitoring} onCheckedChange={toggleMonitoring} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checkpoints">Checkpoints</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Checkpoints Tab */}
        <TabsContent value="checkpoints" className="space-y-6">
          {/* Checkpoint Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Quality Checkpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checkpoints.map((checkpoint, index) => {
                  const config = checkpointConfigs[checkpoint.stage]
                  const Icon = config.icon
                  
                  return (
                    <motion.div
                      key={checkpoint.stage}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all cursor-pointer",
                        getStatusColor(checkpoint.status),
                        selectedCheckpoint === checkpoint.stage && "ring-2 ring-purple-500"
                      )}
                      onClick={() => setSelectedCheckpoint(checkpoint.stage)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-lg", config.color)}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium capitalize">{checkpoint.stage.replace("-", " ")}</h4>
                              {checkpoint.automation && (
                                <Badge variant="secondary" className="text-xs">
                                  <Cpu className="h-3 w-3 mr-1" />
                                  Automated
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Check Type: {checkpoint.checkType}</p>
                            
                            {/* Criteria List */}
                            <div className="mt-3 space-y-1">
                              {checkpoint.criteria.map((criterion, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                  {checkpoint.status === "passed" ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : checkpoint.status === "failed" && i === 0 ? (
                                    <XCircle className="h-3 w-3 text-red-600" />
                                  ) : checkpoint.status === "checking" && i === 0 ? (
                                    <RefreshCw className="h-3 w-3 text-blue-600 animate-spin" />
                                  ) : (
                                    <Circle className="h-3 w-3 text-gray-400" />
                                  )}
                                  <span className={cn(
                                    checkpoint.status === "passed" ? "text-green-700" : "text-gray-600"
                                  )}>
                                    {criterion}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Issues */}
                            {checkpoint.issues && checkpoint.issues.length > 0 && (
                              <Alert className="mt-3 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  {checkpoint.issues[0]}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          {getStatusIcon(checkpoint.status)}
                          {checkpoint.score && (
                            <Badge variant="outline">
                              {checkpoint.score}%
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {checkpoint.status === "failed" && (
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Re-check
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Fix Issues
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-3">
                <Button variant="outline" className="justify-start">
                  <Camera className="h-4 w-4 mr-2" />
                  Test Setup
                </Button>
                <Button variant="outline" className="justify-start">
                  <Mic className="h-4 w-4 mr-2" />
                  Audio Check
                </Button>
                <Button variant="outline" className="justify-start">
                  <Sun className="h-4 w-4 mr-2" />
                  Lighting Guide
                </Button>
                <Button variant="outline" className="justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Preview Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Quality Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Quality Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={qualityTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[70, 100]} />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="overall" stroke="#8B5CF6" strokeWidth={3} name="Overall" />
                    <Line type="monotone" dataKey="technical" stroke="#3B82F6" strokeWidth={2} name="Technical" />
                    <Line type="monotone" dataKey="content" stroke="#10B981" strokeWidth={2} name="Content" />
                    <Line type="monotone" dataKey="delivery" stroke="#F97316" strokeWidth={2} name="Delivery" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Issue Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Common Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {issueDistribution.map((issue) => (
                    <div key={issue.issue} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          issue.severity === "high" ? "bg-red-500" :
                          issue.severity === "medium" ? "bg-yellow-500" :
                          "bg-green-500"
                        )} />
                        <span className="text-sm font-medium">{issue.issue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{issue.count} occurrences</span>
                        <Badge 
                          variant={
                            issue.severity === "high" ? "destructive" :
                            issue.severity === "medium" ? "secondary" :
                            "outline"
                          }
                          className="text-xs"
                        >
                          {issue.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">First-time Pass Rate</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Auto-check Success</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">AI Suggestion Adoption</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Quality Improvement</span>
                      <span className="text-sm font-medium text-green-600">+15%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Quality by Time of Day
              </CardTitle>
              <CardDescription>
                Identify your peak performance times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium p-1">
                    {day}
                  </div>
                ))}
                {performanceHeatmap.slice(0, 119).map((slot, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger>
                      <div
                        className={cn(
                          "h-6 rounded cursor-pointer transition-all hover:ring-2 hover:ring-purple-500",
                          slot.quality > 90 ? "bg-green-500" :
                          slot.quality > 80 ? "bg-green-400" :
                          slot.quality > 70 ? "bg-yellow-400" :
                          "bg-red-400"
                        )}
                        style={{ opacity: slot.quality / 100 }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{slot.hour} - {slot.day}</p>
                      <p className="text-xs font-medium">Quality: {slot.quality.toFixed(0)}%</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-red-400 rounded" />
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-yellow-400 rounded" />
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-green-400 rounded" />
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-green-500 rounded" />
                  <span>Excellent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Improvements Tab */}
        <TabsContent value="improvements" className="space-y-6">
          {/* AI-Powered Suggestions */}
          {enableAISuggestions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI-Powered Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestions.map((suggestion) => {
                    const priorityColors = {
                      high: "border-red-200 bg-red-50 dark:bg-red-900/20",
                      medium: "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20",
                      low: "border-green-200 bg-green-50 dark:bg-green-900/20"
                    }
                    
                    const categoryIcons = {
                      technical: Camera,
                      content: MessageSquare,
                      delivery: Send
                    }
                    
                    const CategoryIcon = categoryIcons[suggestion.category]
                    
                    return (
                      <motion.div
                        key={suggestion.id}
                        whileHover={{ scale: 1.01 }}
                        className={cn(
                          "p-4 rounded-lg border-2",
                          priorityColors[suggestion.priority]
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <CategoryIcon className="h-5 w-5 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{suggestion.title}</h4>
                                {suggestion.aiGenerated && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    AI
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                              
                              <div className="flex items-center gap-4 mt-3 text-xs">
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>Impact: {suggestion.impact}%</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Timer className="h-3 w-3" />
                                  <span>Effort: {suggestion.effort}min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  <span>ROI: {(suggestion.impact / suggestion.effort * 10).toFixed(0)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Button size="sm" variant="outline">
                            Apply
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Improvement Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Improvement Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Lighting Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Optimal 3-point lighting setup</p>
                    <Button size="sm" variant="link" className="mt-2 p-0">
                      View Tutorial →
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      Audio Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Room treatment & mic placement</p>
                    <Button size="sm" variant="link" className="mt-2 p-0">
                      Learn More →
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Energy & Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Maintain high energy levels</p>
                    <Button size="sm" variant="link" className="mt-2 p-0">
                      Get Tips →
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Peer Comparison */}
          {enablePeerComparison && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Peer Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={peerComparison}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="You" dataKey="you" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      <Radar name="Peer Avg" dataKey="peers" stroke="#F97316" fill="#F97316" fillOpacity={0.3} />
                      <Radar name="Top 10%" dataKey="top10" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Success Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Best Performance:</strong> Morning sessions (9-11 AM) show 15% higher quality scores
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Optimal Setup:</strong> 3-point lighting with key light at 45° produces best results
                  </AlertDescription>
                </Alert>

                <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Energy Boost:</strong> Standing delivery increases engagement by 22%
                  </AlertDescription>
                </Alert>

                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Consistency:</strong> Batch recording maintains 30% better quality consistency
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Quality Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Impact on Business</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">+23%</p>
                  <p className="text-sm text-gray-600 mt-1">Booking increase</p>
                  <p className="text-xs text-gray-500 mt-2">From 4.5 → 4.8 rating</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">-45%</p>
                  <p className="text-sm text-gray-600 mt-1">Re-record requests</p>
                  <p className="text-xs text-gray-500 mt-2">Quality checks help</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">+$127</p>
                  <p className="text-sm text-gray-600 mt-1">Avg order value</p>
                  <p className="text-xs text-gray-500 mt-2">Premium quality</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">89%</p>
                  <p className="text-sm text-gray-600 mt-1">5-star reviews</p>
                  <p className="text-xs text-gray-500 mt-2">Quality focused</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Add missing Circle import
const Circle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
  </svg>
)