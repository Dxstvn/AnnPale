"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  ArrowUp,
  ArrowDown,
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
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
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
  AlignJustify,
  SkipForward,
  SkipBack,
  Rewind,
  Music,
  Volume,
  Headphones,
  Radio,
  Signal,
  Bluetooth,
  Cast,
  Airplay,
  Speaker,
  Inbox,
  FolderPlus,
  FilePlus,
  FileCheck,
  FileMinus,
  FileX,
  FolderMinus,
  FolderX,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Github,
  Gitlab,
  Package2,
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Tv,
  Laptop,
  Keyboard,
  Mouse,
  Gamepad2,
  Joystick,
  Disc,
  Aperture,
  Feather,
  Pen,
  PenTool,
  Brush,
  Palette,
  Pipette,
  Scissors,
  Ruler,
  Eraser,
  Highlighter,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Code2,
  Terminal,
  TerminalSquare,
  Command,
  Cloud as CloudIcon,
  CloudOff,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
  Tornado,
  Rainbow,
  Umbrella,
  Droplet,
  Droplets,
  Waves,
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake,
  Gauge,
  Compass as CompassIcon,
  MapPinned,
  Mountain,
  Trees,
  TreePine,
  Palmtree,
  Sunrise,
  Sunset,
  MoonStar,
  CloudMoon,
  CloudSun,
  Plane,
  Train,
  Car,
  Bus,
  Truck,
  Ship,
  Anchor,
  Bike,
  Fuel,
  ParkingCircle,
  TrafficCone,
  Siren,
  Construction,
  Milestone,
  Signpost,
  Signpost2,
  Flag as FlagIcon,
  FlagOff,
  MapPin as MapPinIcon,
  Locate,
  LocateFixed,
  LocateOff,
  Route,
  Navigation2,
  NavigationOff,
  Send as SendIcon,
  Waypoints,
  Footprints,
  PersonStanding,
  Accessibility,
  Baby,
  Heart as HeartIcon,
  HeartOff,
  HeartCrack,
  HeartHandshake,
  HeartPulse,
  Stethoscope,
  Pill,
  Syringe,
  TestTube,
  TestTube2,
  Dna,
  Microscope,
  Scan,
  ScanLine,
  ScanFace,
  ScanEye,
  BrainCircuit,
  BrainCog,
  Activity as ActivityIcon,
  Zap as ZapIcon,
  Flame,
  FlameKindling,
  Sparkle,
  Sparkles as SparklesIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Widget size configurations
type WidgetSize = "small" | "medium" | "large" | "full"
type WidgetPriority = "critical" | "high" | "medium" | "low"
type WidgetPosition = "top-left" | "top-right" | "top-bar" | "center" | "sidebar" | "below-fold"

// Widget interface
interface DashboardWidget {
  id: string
  title: string
  icon: React.ElementType
  size: WidgetSize
  priority: WidgetPriority
  position: WidgetPosition
  updateFrequency: "real-time" | "hourly" | "daily" | "weekly"
  content: React.ReactNode
  actions?: Array<{
    label: string
    action: () => void
    variant?: "default" | "outline" | "secondary" | "destructive"
  }>
}

// Information hierarchy levels
interface InformationLevel {
  level: 1 | 2 | 3 | 4
  title: string
  description: string
  scrollPosition: "above-fold" | "scroll-1" | "scroll-2" | "deep-dive"
  widgets: DashboardWidget[]
}

// Dashboard stats interface
interface DashboardStats {
  pendingRequests: number
  todayEarnings: number
  weeklyEarnings: number
  monthlyEarnings: number
  responseDeadlines: number
  unreadMessages: number
  completionRate: number
  averageRating: number
  videoViews: number
  followerCount: number
  upcomingEvents: number
  contentLibrarySize: number
}

// Widget size styles
const widgetSizeStyles: Record<WidgetSize, string> = {
  small: "col-span-1 row-span-1",
  medium: "col-span-2 row-span-1 lg:col-span-1",
  large: "col-span-2 row-span-2",
  full: "col-span-full row-span-2"
}

// Priority colors
const priorityColors: Record<WidgetPriority, string> = {
  critical: "border-red-500 bg-red-50 dark:bg-red-900/20",
  high: "border-orange-500 bg-orange-50 dark:bg-orange-900/20",
  medium: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
  low: "border-gray-300 bg-gray-50 dark:bg-gray-800"
}

// Quick action button component
const QuickActionButton = ({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  badge
}: {
  icon: React.ElementType
  label: string
  onClick: () => void
  variant?: "default" | "success" | "warning" | "danger"
  badge?: string | number
}) => {
  const variantStyles = {
    default: "hover:bg-gray-100 dark:hover:bg-gray-800",
    success: "hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600",
    warning: "hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600",
    danger: "hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
              "relative p-3 rounded-lg transition-all",
              variantStyles[variant]
            )}
          >
            <Icon className="h-5 w-5" />
            {badge !== undefined && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {badge}
              </span>
            )}
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Widget component
const DashboardWidgetComponent = ({ widget }: { widget: DashboardWidget }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  
  return (
    <motion.div
      layout
      className={cn(
        "relative",
        widgetSizeStyles[widget.size],
        widget.priority === "critical" && "ring-2 ring-red-500"
      )}
    >
      <Card className={cn(
        "h-full",
        widget.priority === "critical" && priorityColors.critical,
        widget.priority === "high" && priorityColors.high
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <widget.icon className="h-4 w-4" />
              {widget.title}
            </CardTitle>
            <div className="flex items-center gap-1">
              {widget.priority === "critical" && (
                <Badge variant="destructive" className="text-xs">
                  Urgent
                </Badge>
              )}
              {widget.updateFrequency === "real-time" && (
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <Minimize2 className="h-3 w-3 mr-2" /> : <Maximize2 className="h-3 w-3 mr-2" />}
                    {isExpanded ? "Collapse" : "Expand"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-3 w-3 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <EyeOff className="h-3 w-3 mr-2" />
                    Hide Widget
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          {widget.content}
          {widget.actions && (
            <div className="flex gap-2 mt-3">
              {widget.actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || "default"}
                  onClick={action.action}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Component props
interface EnhancedDashboardLayoutProps {
  stats?: DashboardStats
  onWidgetAction?: (widgetId: string, action: string) => void
  customWidgets?: DashboardWidget[]
  className?: string
}

// Main enhanced dashboard layout component
export function EnhancedDashboardLayout({
  stats = {
    pendingRequests: 8,
    todayEarnings: 245,
    weeklyEarnings: 1850,
    monthlyEarnings: 7420,
    responseDeadlines: 3,
    unreadMessages: 12,
    completionRate: 96,
    averageRating: 4.8,
    videoViews: 15420,
    followerCount: 2850,
    upcomingEvents: 5,
    contentLibrarySize: 48
  },
  onWidgetAction,
  customWidgets = [],
  className
}: EnhancedDashboardLayoutProps) {
  const [activeLevel, setActiveLevel] = React.useState<1 | 2 | 3 | 4>(1)
  const [isCompactMode, setIsCompactMode] = React.useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<"today" | "week" | "month">("today")
  
  // Define information hierarchy levels
  const informationLevels: InformationLevel[] = [
    {
      level: 1,
      title: "Immediate Status",
      description: "Action required - Above the fold",
      scrollPosition: "above-fold",
      widgets: [
        {
          id: "pending-requests",
          title: "Pending Requests",
          icon: AlertCircle,
          size: "large",
          priority: "critical",
          position: "top-left",
          updateFrequency: "real-time",
          content: (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{stats.pendingRequests}</span>
                {stats.responseDeadlines > 0 && (
                  <Badge variant="destructive">
                    {stats.responseDeadlines} urgent
                  </Badge>
                )}
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-sm text-gray-600">Response rate: 65%</p>
            </div>
          ),
          actions: [
            { label: "View All", action: () => toast.info("Viewing all requests") },
            { label: "Quick Accept", action: () => toast.success("Quick accept mode"), variant: "outline" }
          ]
        },
        {
          id: "todays-earnings",
          title: "Today's Earnings",
          icon: DollarSign,
          size: "medium",
          priority: "high",
          position: "top-right",
          updateFrequency: "hourly",
          content: (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">${stats.todayEarnings}</span>
                <span className="text-sm text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3" />
                  12%
                </span>
              </div>
              <div className="text-xs text-gray-600">
                Goal: $300 ({Math.round((stats.todayEarnings / 300) * 100)}%)
              </div>
            </div>
          )
        },
        {
          id: "response-alerts",
          title: "Response Deadlines",
          icon: Clock,
          size: "medium",
          priority: stats.responseDeadlines > 0 ? "critical" : "medium",
          position: "top-bar",
          updateFrequency: "real-time",
          content: (
            <div className="space-y-2">
              {stats.responseDeadlines > 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-red-500 animate-pulse" />
                    <span className="font-semibold">{stats.responseDeadlines} due soon</span>
                  </div>
                  <div className="text-xs text-red-600">
                    Next deadline in 2 hours
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-600">
                  All responses on time ✓
                </div>
              )}
            </div>
          )
        },
        {
          id: "quick-actions",
          title: "Quick Actions",
          icon: Zap,
          size: "medium",
          priority: "high",
          position: "top-bar",
          updateFrequency: "daily",
          content: (
            <div className="flex gap-2">
              <QuickActionButton
                icon={CheckCircle}
                label="Accept All"
                onClick={() => toast.success("Accepting all requests")}
                variant="success"
              />
              <QuickActionButton
                icon={XCircle}
                label="Decline"
                onClick={() => toast.info("Decline mode")}
                variant="danger"
              />
              <QuickActionButton
                icon={Video}
                label="Record"
                onClick={() => toast.info("Starting recording")}
                badge={3}
              />
            </div>
          )
        }
      ]
    },
    {
      level: 2,
      title: "Performance Overview",
      description: "Key metrics - First scroll",
      scrollPosition: "scroll-1",
      widgets: [
        {
          id: "weekly-earnings",
          title: "Weekly Earnings",
          icon: TrendingUp,
          size: "large",
          priority: "medium",
          position: "center",
          updateFrequency: "daily",
          content: (
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold">${stats.weeklyEarnings}</span>
                <Badge variant="secondary">+18% vs last week</Badge>
              </div>
              <div className="h-32 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-end justify-around p-2">
                {[40, 65, 45, 80, 90, 75, 95].map((height, i) => (
                  <div
                    key={i}
                    className="w-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          )
        },
        {
          id: "completion-metrics",
          title: "Completion Rate",
          icon: CheckCircle2,
          size: "medium",
          priority: "medium",
          position: "center",
          updateFrequency: "daily",
          content: (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.completionRate}%</span>
                <Badge variant="outline" className="text-xs">Excellent</Badge>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>
          )
        },
        {
          id: "rating-trends",
          title: "Rating Trends",
          icon: Star,
          size: "medium",
          priority: "medium",
          position: "center",
          updateFrequency: "daily",
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{stats.averageRating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i <= Math.floor(stats.averageRating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-600">Based on 156 reviews</div>
            </div>
          )
        },
        {
          id: "video-performance",
          title: "Video Performance",
          icon: PlayCircle,
          size: "medium",
          priority: "low",
          position: "center",
          updateFrequency: "weekly",
          content: (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">{stats.videoViews.toLocaleString()}</span>
                <span className="text-xs text-gray-600">total views</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ThumbsUp className="h-3 w-3" />
                <span>98% satisfaction</span>
              </div>
            </div>
          )
        }
      ]
    },
    {
      level: 3,
      title: "Management Tools",
      description: "Operational tools - Second scroll",
      scrollPosition: "scroll-2",
      widgets: [
        {
          id: "calendar-view",
          title: "Calendar",
          icon: Calendar,
          size: "large",
          priority: "medium",
          position: "center",
          updateFrequency: "hourly",
          content: (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Today's Schedule</span>
                <Badge variant="outline">{stats.upcomingEvents} events</Badge>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span>9:00 AM - Record birthday videos</span>
                    <Badge variant="secondary" className="text-xs">3 videos</Badge>
                  </div>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span>2:00 PM - Customer call</span>
                    <Badge variant="secondary" className="text-xs">30 min</Badge>
                  </div>
                </div>
              </div>
            </div>
          ),
          actions: [
            { label: "View Full Calendar", action: () => toast.info("Opening calendar") }
          ]
        },
        {
          id: "bulk-operations",
          title: "Bulk Operations",
          icon: Layers,
          size: "medium",
          priority: "low",
          position: "center",
          updateFrequency: "daily",
          content: (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.info("Batch accept")}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Batch Accept
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.info("Batch message")}>
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Batch Message
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.info("Batch upload")}>
                  <Upload className="h-3 w-3 mr-1" />
                  Batch Upload
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.info("Batch schedule")}>
                  <Calendar className="h-3 w-3 mr-1" />
                  Batch Schedule
                </Button>
              </div>
            </div>
          )
        },
        {
          id: "message-center",
          title: "Messages",
          icon: MessageCircle,
          size: "medium",
          priority: stats.unreadMessages > 0 ? "high" : "medium",
          position: "sidebar",
          updateFrequency: "real-time",
          content: (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{stats.unreadMessages} unread</span>
                <Badge variant="destructive" className="text-xs">{stats.unreadMessages}</Badge>
              </div>
              <div className="space-y-1">
                <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                  Marie L.: Thank you so much!
                </div>
                <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                  John D.: Can you do a rush order?
                </div>
              </div>
            </div>
          ),
          actions: [
            { label: "View All", action: () => toast.info("Opening messages") }
          ]
        },
        {
          id: "content-library",
          title: "Content Library",
          icon: Folder,
          size: "medium",
          priority: "low",
          position: "center",
          updateFrequency: "weekly",
          content: (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">{stats.contentLibrarySize}</span>
                <span className="text-xs text-gray-600">templates</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <Badge variant="outline" className="text-xs">Birthday</Badge>
                <Badge variant="outline" className="text-xs">Wedding</Badge>
                <Badge variant="outline" className="text-xs">Graduation</Badge>
              </div>
            </div>
          ),
          actions: [
            { label: "Manage", action: () => toast.info("Opening library") }
          ]
        }
      ]
    },
    {
      level: 4,
      title: "Insights & Growth",
      description: "Deep analytics - Below fold",
      scrollPosition: "deep-dive",
      widgets: [
        {
          id: "detailed-analytics",
          title: "Detailed Analytics",
          icon: BarChart3,
          size: "full",
          priority: "low",
          position: "below-fold",
          updateFrequency: "weekly",
          content: (
            <div className="space-y-4">
              <Tabs defaultValue="revenue" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  <TabsTrigger value="growth">Growth</TabsTrigger>
                  <TabsTrigger value="quality">Quality</TabsTrigger>
                </TabsList>
                <TabsContent value="revenue" className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-xl font-bold">${stats.monthlyEarnings}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Order Value</p>
                      <p className="text-xl font-bold">$85</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Growth Rate</p>
                      <p className="text-xl font-bold text-green-600">+24%</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="engagement" className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Video Views</p>
                      <p className="text-xl font-bold">{stats.videoViews.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Engagement Rate</p>
                      <p className="text-xl font-bold">68%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Share Rate</p>
                      <p className="text-xl font-bold">15%</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )
        },
        {
          id: "audience-insights",
          title: "Audience Insights",
          icon: Users,
          size: "large",
          priority: "low",
          position: "below-fold",
          updateFrequency: "weekly",
          content: (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600">Total Followers</p>
                  <p className="text-xl font-bold">{stats.followerCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Repeat Customers</p>
                  <p className="text-xl font-bold">42%</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Age 25-34</span>
                  <div className="flex items-center gap-2">
                    <Progress value={45} className="w-20 h-2" />
                    <span>45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Age 35-44</span>
                  <div className="flex items-center gap-2">
                    <Progress value={30} className="w-20 h-2" />
                    <span>30%</span>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "revenue-optimization",
          title: "Revenue Optimization",
          icon: DollarSign,
          size: "large",
          priority: "low",
          position: "below-fold",
          updateFrequency: "weekly",
          content: (
            <div className="space-y-3">
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  Increase prices by 10% for rush orders to earn +$500/month
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button size="sm" className="w-full" variant="outline">
                  <Percent className="h-3 w-3 mr-2" />
                  Optimize Pricing
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  <Package className="h-3 w-3 mr-2" />
                  Create Bundles
                </Button>
              </div>
            </div>
          )
        },
        {
          id: "growth-recommendations",
          title: "Growth Tips",
          icon: Rocket,
          size: "medium",
          priority: "low",
          position: "below-fold",
          updateFrequency: "weekly",
          content: (
            <div className="space-y-2">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-medium">Expand to wedding category</p>
                <p className="text-xs text-gray-600">+40% potential revenue</p>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium">Improve response time</p>
                <p className="text-xs text-gray-600">Current: 8hr → Target: 3hr</p>
              </div>
            </div>
          ),
          actions: [
            { label: "View All Tips", action: () => toast.info("Opening growth tips") }
          ]
        }
      ]
    }
  ]
  
  // Combine default widgets with custom widgets
  const allWidgets = [
    ...informationLevels.flatMap(level => level.widgets),
    ...customWidgets
  ]
  
  // Filter widgets by level
  const currentLevelWidgets = informationLevels.find(l => l.level === activeLevel)?.widgets || []
  
  // Handle scroll to level
  const scrollToLevel = (level: 1 | 2 | 3 | 4) => {
    setActiveLevel(level)
    const positions = {
      1: 0,
      2: window.innerHeight * 0.8,
      3: window.innerHeight * 1.6,
      4: window.innerHeight * 2.4
    }
    window.scrollTo({ top: positions[level], behavior: "smooth" })
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Controls */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map(level => (
                <Button
                  key={level}
                  size="sm"
                  variant={activeLevel === level ? "default" : "outline"}
                  onClick={() => scrollToLevel(level as 1 | 2 | 3 | 4)}
                  className="h-8"
                >
                  L{level}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select
              value={selectedTimeRange}
              onValueChange={(value) => setSelectedTimeRange(value as "today" | "week" | "month")}
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCompactMode(!isCompactMode)}
            >
              {isCompactMode ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="flex items-center gap-4 mt-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">${stats.todayEarnings}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">{stats.pendingRequests} pending</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">{stats.averageRating} rating</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">{stats.completionRate}% on-time</span>
          </div>
        </div>
      </div>
      
      {/* Level Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            Level {activeLevel}
          </Badge>
          <h2 className="text-lg font-semibold">
            {informationLevels.find(l => l.level === activeLevel)?.title}
          </h2>
          <span className="text-sm text-gray-600">
            {informationLevels.find(l => l.level === activeLevel)?.description}
          </span>
        </div>
      </motion.div>
      
      {/* Widget Grid */}
      <div className={cn(
        "grid gap-4",
        isCompactMode ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        "auto-rows-min"
      )}>
        <AnimatePresence mode="wait">
          {currentLevelWidgets.map((widget) => (
            <DashboardWidgetComponent key={widget.id} widget={widget} />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Navigation Hints */}
      {activeLevel < 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-8"
        >
          <Button
            variant="ghost"
            onClick={() => scrollToLevel((activeLevel + 1) as 1 | 2 | 3 | 4)}
            className="flex items-center gap-2"
          >
            <span>View Level {activeLevel + 1}</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}