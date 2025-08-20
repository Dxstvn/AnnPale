"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Video,
  Clock,
  DollarSign,
  Star,
  MessageCircle,
  Upload,
  Settings,
  LogOut,
  TrendingUp,
  Target,
  Users,
  Award,
  Heart,
  Brain,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  BarChart3,
  Zap,
  Timer,
  FileVideo,
  Gift,
  Rocket,
  Shield,
  Bell,
  ChevronRight,
  ArrowRight,
  Info,
  HelpCircle,
  BookOpen,
  PlayCircle,
  PauseCircle,
  FastForward,
  Lightbulb,
  Trophy,
  Crown,
  Briefcase,
  Coffee,
  Moon,
  Sun,
  Activity,
  Package,
  Send,
  Download,
  Filter,
  Search,
  MoreVertical,
  ChevronDown,
  User,
  UserCheck,
  UserPlus,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  MessageSquare,
  Mail,
  Phone,
  Camera,
  Mic,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  RefreshCw,
  RotateCw,
  Share2,
  Copy,
  Clipboard,
  Edit,
  Trash2,
  Archive,
  Flag,
  Bookmark,
  Hash,
  AtSign,
  Link,
  Paperclip,
  Image,
  FileText,
  File,
  Folder,
  FolderOpen,
  Database,
  Server,
  Cloud,
  CloudDownload,
  CloudUpload,
  Globe,
  Map,
  MapPin,
  Navigation,
  Compass,
  Home,
  Building,
  Store,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Wallet,
  Percent,
  PieChart,
  LineChart,
  TrendingDown,
  BarChart,
  BarChart2,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Star as StarIcon,
  Heart as HeartIcon,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Shield as ShieldIcon,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  XCircle,
  CheckCircle,
  Check,
  X,
  Plus,
  Minus,
  Equal,
  NotEqual,
  LessThan,
  GreaterThan,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronsDown,
  ChevronLeft,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ExternalLink,
  Maximize,
  Minimize,
  Maximize2,
  Minimize2,
  Move,
  Layers,
  Layout,
  Grid,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Types for creator personas
export type CreatorPersona = 
  | "new_creator"
  | "part_timer"
  | "full_timer"
  | "celebrity"
  | "influencer"

// Types for emotional stages
export type EmotionalStage = 
  | "onboarding"
  | "first_request"
  | "growing"
  | "busy"
  | "plateau"
  | "success"

// Workflow stages
export type WorkflowStage = 
  | "morning_checkin"
  | "review_requests"
  | "plan_recordings"
  | "check_earnings"
  | "accept_decline"
  | "batch_requests"
  | "respond_messages"
  | "set_expectations"
  | "record_videos"
  | "upload_deliver"
  | "track_performance"
  | "withdraw_earnings"

// Creator stats interface
interface CreatorStats {
  totalEarnings: number
  monthlyEarnings: number
  weeklyEarnings: number
  todayEarnings: number
  completedVideos: number
  pendingRequests: number
  averageRating: number
  responseTime: string
  completionRate: number
  followerCount: number
  accountAge: number // days
  videoViews: number
  repeatCustomers: number
  satisfactionScore: number
}

// Persona configurations
const personaConfigs = {
  new_creator: {
    title: "New Creator",
    icon: UserPlus,
    color: "blue",
    primaryGoal: "Build reputation",
    keyMetrics: ["Reviews", "Completion Rate", "Response Time"],
    painPoints: ["Getting started", "Understanding platform", "First video anxiety"],
    dashboardFocus: ["Onboarding wizard", "Tutorial videos", "Best practices"],
    tips: [
      "Complete your profile to appear more trustworthy",
      "Respond to requests within 3 hours for better conversion",
      "Your first 10 videos are crucial for building reputation"
    ]
  },
  part_timer: {
    title: "Part-Timer",
    icon: Coffee,
    color: "green",
    primaryGoal: "Extra income",
    keyMetrics: ["Weekly earnings", "Time spent", "$/hour"],
    painPoints: ["Time management", "Balancing with main job", "Efficiency"],
    dashboardFocus: ["Quick actions", "Batch tools", "Schedule management"],
    tips: [
      "Batch similar requests to save time",
      "Set specific hours for Ann Pale work",
      "Use templates for common occasions"
    ]
  },
  full_timer: {
    title: "Full-Timer",
    icon: Briefcase,
    color: "purple",
    primaryGoal: "Maximize revenue",
    keyMetrics: ["Monthly trends", "Growth rate", "Customer lifetime value"],
    painPoints: ["Scaling", "Consistency", "Burnout prevention"],
    dashboardFocus: ["Analytics", "Automation", "Revenue optimization"],
    tips: [
      "Analyze your best performing content",
      "Consider raising prices during peak demand",
      "Delegate or automate repetitive tasks"
    ]
  },
  celebrity: {
    title: "Celebrity",
    icon: Crown,
    color: "yellow",
    primaryGoal: "Brand management",
    keyMetrics: ["Engagement", "Reach", "Brand sentiment"],
    painPoints: ["High volume", "Quality control", "Time constraints"],
    dashboardFocus: ["Delegation tools", "Team management", "Brand protection"],
    tips: [
      "Use team members for initial screening",
      "Create signature video styles",
      "Maintain exclusivity with premium pricing"
    ]
  },
  influencer: {
    title: "Influencer",
    icon: TrendingUp,
    color: "pink",
    primaryGoal: "Audience growth",
    keyMetrics: ["Followers", "Shares", "Viral coefficient"],
    painPoints: ["Content quality", "Cross-platform promotion", "Engagement"],
    dashboardFocus: ["Performance insights", "Social integration", "Content planning"],
    tips: [
      "Share behind-the-scenes content",
      "Cross-promote on your social channels",
      "Create shareable moments in videos"
    ]
  }
}

// Emotional stage configurations
const emotionalStageConfigs = {
  onboarding: {
    emotion: "Anxious",
    icon: AlertCircle,
    color: "yellow",
    needs: ["Clear guidance", "Hand-holding", "Reassurance"],
    solutions: ["Setup wizard", "Video tutorials", "Live chat support"],
    message: "Welcome! Let's get you started with easy steps",
    actionItems: [
      { label: "Complete profile", completed: false },
      { label: "Watch intro video", completed: false },
      { label: "Set your first price", completed: false },
      { label: "Record sample video", completed: false }
    ]
  },
  first_request: {
    emotion: "Excited",
    icon: Sparkles,
    color: "green",
    needs: ["Clear instructions", "Quality guidelines", "Confidence boost"],
    solutions: ["Step-by-step guide", "Example videos", "Checklist"],
    message: "Congratulations on your first request! You've got this!",
    actionItems: [
      { label: "Review request details", completed: false },
      { label: "Prepare your setup", completed: false },
      { label: "Record video", completed: false },
      { label: "Review before sending", completed: false }
    ]
  },
  growing: {
    emotion: "Motivated",
    icon: Rocket,
    color: "blue",
    needs: ["Performance insights", "Growth strategies", "Efficiency tools"],
    solutions: ["Analytics dashboard", "Growth tips", "Automation features"],
    message: "You're on fire! Keep up the momentum",
    actionItems: [
      { label: "Analyze top videos", completed: false },
      { label: "Optimize pricing", completed: false },
      { label: "Expand categories", completed: false },
      { label: "Build regular customers", completed: false }
    ]
  },
  busy: {
    emotion: "Overwhelmed",
    icon: Activity,
    color: "orange",
    needs: ["Time management", "Prioritization", "Stress relief"],
    solutions: ["Bulk actions", "Smart scheduling", "Break reminders"],
    message: "Busy period! Let's help you manage efficiently",
    actionItems: [
      { label: "Prioritize urgent requests", completed: false },
      { label: "Use batch recording", completed: false },
      { label: "Set realistic deadlines", completed: false },
      { label: "Take regular breaks", completed: false }
    ]
  },
  plateau: {
    emotion: "Concerned",
    icon: TrendingDown,
    color: "gray",
    needs: ["New strategies", "Motivation", "Fresh perspective"],
    solutions: ["Recommendations", "A/B testing", "Coaching"],
    message: "Time to try something new and break through",
    actionItems: [
      { label: "Try new video styles", completed: false },
      { label: "Update pricing strategy", completed: false },
      { label: "Refresh profile", completed: false },
      { label: "Engage with community", completed: false }
    ]
  },
  success: {
    emotion: "Confident",
    icon: Trophy,
    color: "purple",
    needs: ["Scaling tools", "Advanced features", "Recognition"],
    solutions: ["Pro tools", "VIP support", "Success badges"],
    message: "You're a top creator! Let's scale your success",
    actionItems: [
      { label: "Mentor new creators", completed: false },
      { label: "Launch premium tier", completed: false },
      { label: "Build your team", completed: false },
      { label: "Expand offerings", completed: false }
    ]
  }
}

// Workflow stage configurations
const workflowStages: WorkflowStage[] = [
  "morning_checkin",
  "review_requests",
  "plan_recordings",
  "check_earnings",
  "accept_decline",
  "batch_requests",
  "respond_messages",
  "set_expectations",
  "record_videos",
  "upload_deliver",
  "track_performance",
  "withdraw_earnings"
]

const workflowStageConfigs = {
  morning_checkin: {
    title: "Morning Check-in",
    icon: Sun,
    time: "5 min",
    description: "Quick overview of overnight activity",
    actions: ["View new requests", "Check messages", "Review schedule"]
  },
  review_requests: {
    title: "Review Requests",
    icon: Eye,
    time: "10-15 min",
    description: "Evaluate and prioritize new bookings",
    actions: ["Sort by deadline", "Check requirements", "Flag complex requests"]
  },
  plan_recordings: {
    title: "Plan Recordings",
    icon: Calendar,
    time: "10 min",
    description: "Organize your recording schedule",
    actions: ["Group similar requests", "Set time blocks", "Prepare props"]
  },
  check_earnings: {
    title: "Check Earnings",
    icon: DollarSign,
    time: "2 min",
    description: "Monitor your financial performance",
    actions: ["View daily total", "Track weekly goal", "Check pending payments"]
  },
  accept_decline: {
    title: "Accept/Decline",
    icon: CheckCircle,
    time: "5-10 min",
    description: "Make decisions on requests",
    actions: ["Accept good fits", "Decline politely", "Suggest alternatives"]
  },
  batch_requests: {
    title: "Batch Requests",
    icon: Layers,
    time: "5 min",
    description: "Group similar videos for efficiency",
    actions: ["Sort by occasion", "Group by tone", "Prepare templates"]
  },
  respond_messages: {
    title: "Respond to Messages",
    icon: MessageSquare,
    time: "10-20 min",
    description: "Communicate with customers",
    actions: ["Answer questions", "Send updates", "Handle feedback"]
  },
  set_expectations: {
    title: "Set Expectations",
    icon: Clock,
    time: "5 min",
    description: "Communicate delivery timelines",
    actions: ["Confirm deadlines", "Send ETAs", "Manage rush requests"]
  },
  record_videos: {
    title: "Record Videos",
    icon: Camera,
    time: "30-90 min",
    description: "Create your video messages",
    actions: ["Check lighting", "Record takes", "Review quality"]
  },
  upload_deliver: {
    title: "Upload & Deliver",
    icon: Upload,
    time: "10-15 min",
    description: "Send completed videos to customers",
    actions: ["Upload files", "Add descriptions", "Send notifications"]
  },
  track_performance: {
    title: "Track Performance",
    icon: BarChart3,
    time: "5 min",
    description: "Monitor video reception and ratings",
    actions: ["Check views", "Read reviews", "Note feedback"]
  },
  withdraw_earnings: {
    title: "Withdraw Earnings",
    icon: Wallet,
    time: "2 min",
    description: "Transfer funds to your account",
    actions: ["Check balance", "Request payout", "Track transfers"]
  }
}

// Component props
interface EnhancedCreatorDashboardProps {
  stats?: CreatorStats
  persona?: CreatorPersona
  emotionalStage?: EmotionalStage
  currentWorkflow?: WorkflowStage
  onPersonaChange?: (persona: CreatorPersona) => void
  onWorkflowProgress?: (stage: WorkflowStage) => void
  className?: string
}

// Quick action card component
const QuickActionCard = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  variant = "default"
}: {
  icon: React.ElementType
  title: string
  description: string
  onClick: () => void
  variant?: "default" | "urgent" | "success"
}) => {
  const variantStyles = {
    default: "hover:bg-gray-50 dark:hover:bg-gray-800",
    urgent: "border-red-200 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30",
    success: "border-green-200 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30"
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "p-4 border rounded-lg text-left transition-all",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Icon className="h-5 w-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  )
}

// Metric card component
const MetricCard = ({
  icon: Icon,
  label,
  value,
  change,
  trend,
  color = "blue"
}: {
  icon: React.ElementType
  label: string
  value: string | number
  change?: number
  trend?: "up" | "down" | "stable"
  color?: string
}) => {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className={cn("h-4 w-4", `text-${color}-600`)} />
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
              <TrendIcon className="h-3 w-3" />
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{label}</p>
      </CardContent>
    </Card>
  )
}

// Main enhanced creator dashboard component
export function EnhancedCreatorDashboard({
  stats = {
    totalEarnings: 15420,
    monthlyEarnings: 3850,
    weeklyEarnings: 890,
    todayEarnings: 125,
    completedVideos: 156,
    pendingRequests: 8,
    averageRating: 4.8,
    responseTime: "2.5hr",
    completionRate: 96,
    followerCount: 2850,
    accountAge: 45,
    videoViews: 28500,
    repeatCustomers: 42,
    satisfactionScore: 94
  },
  persona: initialPersona,
  emotionalStage: initialStage,
  currentWorkflow = "morning_checkin",
  onPersonaChange,
  onWorkflowProgress,
  className
}: EnhancedCreatorDashboardProps) {
  // Determine persona based on stats if not provided
  const determinePersona = (): CreatorPersona => {
    if (initialPersona) return initialPersona
    if (stats.accountAge < 30) return "new_creator"
    if (stats.monthlyEarnings > 10000) return "celebrity"
    if (stats.followerCount > 5000) return "influencer"
    if (stats.monthlyEarnings > 3000) return "full_timer"
    return "part_timer"
  }
  
  // Determine emotional stage based on stats if not provided
  const determineEmotionalStage = (): EmotionalStage => {
    if (initialStage) return initialStage
    if (stats.accountAge < 7) return "onboarding"
    if (stats.completedVideos === 0) return "first_request"
    if (stats.pendingRequests > 15) return "busy"
    if (stats.completedVideos > 100 && stats.monthlyEarnings > 5000) return "success"
    if (stats.completedVideos > 50 && stats.monthlyEarnings < 1000) return "plateau"
    return "growing"
  }
  
  const [selectedPersona, setSelectedPersona] = React.useState<CreatorPersona>(determinePersona())
  const [selectedStage, setSelectedStage] = React.useState<EmotionalStage>(determineEmotionalStage())
  const [workflowStep, setWorkflowStep] = React.useState<WorkflowStage>(currentWorkflow)
  const [showTutorial, setShowTutorial] = React.useState(stats.accountAge < 7)
  
  const personaConfig = personaConfigs[selectedPersona]
  const stageConfig = emotionalStageConfigs[selectedStage]
  const workflowConfig = workflowStageConfigs[workflowStep]
  
  const handlePersonaChange = (persona: CreatorPersona) => {
    setSelectedPersona(persona)
    onPersonaChange?.(persona)
    toast.success(`Dashboard customized for ${personaConfigs[persona].title}`)
  }
  
  const handleWorkflowProgress = (stage: WorkflowStage) => {
    setWorkflowStep(stage)
    onWorkflowProgress?.(stage)
    toast.info(`Moving to: ${workflowStageConfigs[stage].title}`)
  }
  
  const getWorkflowProgress = () => {
    const currentIndex = workflowStages.indexOf(workflowStep)
    return ((currentIndex + 1) / workflowStages.length) * 100
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with persona selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Customized for your success journey
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            value={selectedPersona}
            onValueChange={(value) => handlePersonaChange(value as CreatorPersona)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(personaConfigs).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <config.icon className="h-4 w-4" />
                    <span>{config.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Emotional Journey Card */}
      <Card className={cn(
        "border-2",
        stageConfig.color === "yellow" && "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20",
        stageConfig.color === "green" && "border-green-200 bg-green-50 dark:bg-green-900/20",
        stageConfig.color === "blue" && "border-blue-200 bg-blue-50 dark:bg-blue-900/20",
        stageConfig.color === "orange" && "border-orange-200 bg-orange-50 dark:bg-orange-900/20",
        stageConfig.color === "gray" && "border-gray-200 bg-gray-50 dark:bg-gray-800",
        stageConfig.color === "purple" && "border-purple-200 bg-purple-50 dark:bg-purple-900/20"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <stageConfig.icon className="h-5 w-5" />
            {stageConfig.message}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Your Action Items</h4>
              <div className="space-y-2">
                {stageConfig.actionItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0"
                      onClick={() => toast.success(`Completed: ${item.label}`)}
                    >
                      {item.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Support Available</h4>
              <div className="space-y-2">
                {stageConfig.solutions.map((solution, index) => (
                  <Badge key={index} variant="secondary" className="mr-2">
                    {solution}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign}
          label="Today's Earnings"
          value={`$${stats.todayEarnings}`}
          change={12}
          trend="up"
          color="green"
        />
        <MetricCard
          icon={Video}
          label="Pending Requests"
          value={stats.pendingRequests}
          change={stats.pendingRequests > 10 ? 25 : -5}
          trend={stats.pendingRequests > 10 ? "up" : "down"}
          color="blue"
        />
        <MetricCard
          icon={Star}
          label="Average Rating"
          value={stats.averageRating}
          change={2}
          trend="up"
          color="yellow"
        />
        <MetricCard
          icon={Clock}
          label="Response Time"
          value={stats.responseTime}
          change={-15}
          trend="down"
          color="purple"
        />
      </div>
      
      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Daily Workflow Progress
            </span>
            <Badge variant="outline">
              {Math.round(getWorkflowProgress())}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={getWorkflowProgress()} className="h-2" />
            
            <div className="flex items-center justify-between flex-wrap gap-2">
              {workflowStages.slice(0, 6).map((stage) => {
                const config = workflowStageConfigs[stage]
                const isActive = stage === workflowStep
                const isComplete = workflowStages.indexOf(stage) < workflowStages.indexOf(workflowStep)
                
                return (
                  <TooltipProvider key={stage}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleWorkflowProgress(stage)}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            isActive && "bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-600",
                            isComplete && "bg-green-100 dark:bg-green-900/30",
                            !isActive && !isComplete && "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                          )}
                        >
                          <config.icon className={cn(
                            "h-5 w-5",
                            isActive && "text-purple-600",
                            isComplete && "text-green-600",
                            !isActive && !isComplete && "text-gray-600"
                          )} />
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-medium">{config.title}</p>
                          <p className="text-xs text-gray-500">{config.time}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast.info("View all workflow stages")}
              >
                View All
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            
            {/* Current Stage Details */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-start gap-3">
                <workflowConfig.icon className="h-6 w-6 text-purple-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold">{workflowConfig.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {workflowConfig.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {workflowConfig.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success(`${action} completed`)}
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Persona-Specific Dashboard Focus */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Quick Actions for {personaConfig.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {personaConfig.dashboardFocus.map((focus, index) => (
                <QuickActionCard
                  key={index}
                  icon={
                    focus.includes("Onboarding") ? UserPlus :
                    focus.includes("Tutorial") ? PlayCircle :
                    focus.includes("Analytics") ? BarChart3 :
                    focus.includes("Automation") ? Zap :
                    focus.includes("Quick") ? Rocket :
                    focus.includes("Batch") ? Layers :
                    focus.includes("Schedule") ? Calendar :
                    focus.includes("Delegation") ? Users :
                    focus.includes("Team") ? Users :
                    focus.includes("Brand") ? Shield :
                    focus.includes("Performance") ? TrendingUp :
                    focus.includes("Social") ? Share2 :
                    BookOpen
                  }
                  title={focus}
                  description={`Optimized for ${personaConfig.primaryGoal.toLowerCase()}`}
                  onClick={() => toast.info(`Opening ${focus}`)}
                  variant={index === 0 ? "urgent" : "default"}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Personalized Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Tips for Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {personaConfig.tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-purple-600">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm">{tip}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tutorial/Help Section (for new creators) */}
      {showTutorial && selectedPersona === "new_creator" && (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              New to Ann Pale? Take our quick tutorial to get started faster!
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => {
                  toast.success("Starting tutorial...")
                  setShowTutorial(false)
                }}
              >
                Start Tutorial
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowTutorial(false)}
              >
                Skip
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}