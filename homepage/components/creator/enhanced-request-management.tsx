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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  UserX,
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
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Github,
  Gitlab,
  Cpu,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Tv,
  Laptop,
  Keyboard,
  Mouse,
  Headphones,
  Speaker,
  Inbox,
  FilePlus,
  FileCheck,
  FileMinus,
  FileX,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  Disc,
  Album,
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
  Command as CommandIcon,
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
  FlagIcon,
  FlagOff,
  Locate,
  LocateFixed,
  LocateOff,
  Route,
  Navigation2,
  NavigationOff,
  Waypoints,
  Footprints,
  PersonStanding,
  Accessibility,
  Baby,
  HeartIcon,
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
  Flame,
  FlameKindling,
  Sparkle,
  SparklesIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Request state type
export type RequestState = "new" | "accepted" | "recording" | "in-review" | "delivered" | "expired"

// Request type
export interface VideoRequest {
  id: string
  customerName: string
  customerImage?: string
  recipientName: string
  occasion: string
  instructions: string
  price: number
  state: RequestState
  createdAt: Date
  deadline: Date
  responseDeadline?: Date
  deliveryDeadline?: Date
  isUrgent: boolean
  isRepeatCustomer: boolean
  complexity: "simple" | "moderate" | "complex"
  estimatedTime: number // in minutes
  similarRequests?: string[] // IDs of similar requests
  tags: string[]
  rating?: number
  message?: string
}

// Request state configurations
const requestStateConfigs: Record<RequestState, {
  label: string
  icon: React.ElementType
  color: string
  badgeVariant: "default" | "secondary" | "destructive" | "outline"
  actions: string[]
  bulkSupport: boolean
  timePressure: "none" | "low" | "medium" | "high"
}> = {
  new: {
    label: "New Request",
    icon: AlertCircle,
    color: "yellow",
    badgeVariant: "default",
    actions: ["Accept", "Decline", "Message"],
    bulkSupport: true,
    timePressure: "medium"
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle,
    color: "green",
    badgeVariant: "secondary",
    actions: ["Record", "Cancel", "Message"],
    bulkSupport: true,
    timePressure: "high"
  },
  recording: {
    label: "Recording",
    icon: Circle,
    color: "red",
    badgeVariant: "destructive",
    actions: ["Complete", "Pause"],
    bulkSupport: false,
    timePressure: "none"
  },
  "in-review": {
    label: "In Review",
    icon: Edit,
    color: "orange",
    badgeVariant: "secondary",
    actions: ["Edit", "Submit"],
    bulkSupport: true,
    timePressure: "none"
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "gray",
    badgeVariant: "outline",
    actions: ["View", "Download"],
    bulkSupport: false,
    timePressure: "none"
  },
  expired: {
    label: "Expired",
    icon: XCircle,
    color: "red",
    badgeVariant: "destructive",
    actions: ["Explain", "Refund"],
    bulkSupport: true,
    timePressure: "high"
  }
}

// Filter options
const filterOptions = {
  state: ["new", "accepted", "recording", "in_review", "delivered", "expired"],
  urgency: ["urgent", "normal"],
  customer: ["repeat", "new"],
  complexity: ["simple", "moderate", "complex"],
  price: ["< $50", "$50-100", "$100-200", "> $200"]
}

// Sort options
const sortOptions = [
  { value: "deadline", label: "Deadline (Urgent first)", icon: Clock },
  { value: "price_desc", label: "Price (Highest first)", icon: DollarSign },
  { value: "type", label: "Type (Group similar)", icon: Layers },
  { value: "customer", label: "Customer (Repeat first)", icon: Users },
  { value: "complexity", label: "Complexity (Quick wins)", icon: Zap }
]

// Request card component
const RequestCard = ({
  request,
  isSelected,
  onSelect,
  onAction,
  showIntelligence = true
}: {
  request: VideoRequest
  isSelected: boolean
  onSelect: (selected: boolean) => void
  onAction: (action: string, requestId: string) => void
  showIntelligence?: boolean
}) => {
  const config = requestStateConfigs[request.state]
  const [isExpanded, setIsExpanded] = React.useState(false)
  
  // Calculate time remaining
  const timeRemaining = React.useMemo(() => {
    const now = new Date()
    const deadline = request.state === "new" && request.responseDeadline ? new Date(request.responseDeadline) :
                     request.state === "accepted" && request.deliveryDeadline ? new Date(request.deliveryDeadline) :
                     new Date(request.deadline)
    const diff = deadline.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours < 0) return "Overdue"
    if (hours === 0) return `${minutes}min`
    if (hours < 24) return `${hours}hr ${minutes}min`
    return `${Math.floor(hours / 24)}d ${hours % 24}hr`
  }, [request])
  
  const urgencyColor = request.isUrgent ? "text-red-600" :
                       timeRemaining.includes("hr") && parseInt(timeRemaining) < 6 ? "text-orange-600" :
                       "text-gray-600"
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "relative border rounded-lg p-4 transition-all",
        isSelected && "ring-2 ring-purple-600 bg-purple-50 dark:bg-purple-900/20",
        request.state === "expired" && "opacity-60"
      )}
    >
      {/* Selection checkbox */}
      {config.bulkSupport && (
        <div className="absolute top-4 left-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
          />
        </div>
      )}
      
      {/* Main content */}
      <div className={cn("space-y-3", config.bulkSupport && "ml-8")}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {request.customerImage ? (
              <img
                src={request.customerImage}
                alt={request.customerName}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{request.customerName}</h4>
                {request.isRepeatCustomer && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Repeat
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                For: {request.recipientName} • {request.occasion}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={config.badgeVariant}>
              <config.icon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
            {request.state === "recording" && (
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            )}
          </div>
        </div>
        
        {/* Price and time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-bold text-lg">${request.price}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Clock className={cn("h-4 w-4", urgencyColor)} />
              <span className={cn("text-sm font-medium", urgencyColor)}>
                {timeRemaining}
              </span>
            </div>
            {request.estimatedTime && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Timer className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{request.estimatedTime}min</span>
                </div>
              </>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden"
            >
              {/* Instructions */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm">{request.instructions}</p>
              </div>
              
              {/* Intelligence insights */}
              {showIntelligence && request.similarRequests && request.similarRequests.length > 0 && (
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tip:</strong> You have {request.similarRequests.length} similar requests. 
                    Consider batching them together.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Tags */}
              {request.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {request.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Complexity indicator */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Complexity:</span>
                <div className="flex items-center gap-1">
                  {["simple", "moderate", "complex"].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-2 w-8 rounded-full",
                        level === request.complexity || 
                        (request.complexity === "moderate" && level === "simple") ||
                        (request.complexity === "complex" && level !== "complex")
                          ? "bg-purple-500"
                          : "bg-gray-200 dark:bg-gray-700"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium capitalize">{request.complexity}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {config.actions.map((action) => (
              <Button
                key={action}
                size="sm"
                variant={action === config.actions[0] ? "default" : "outline"}
                onClick={() => onAction(action.toLowerCase(), request.id)}
              >
                {action === "Accept" && <CheckCircle className="h-3 w-3 mr-1" />}
                {action === "Decline" && <XCircle className="h-3 w-3 mr-1" />}
                {action === "Record" && <Camera className="h-3 w-3 mr-1" />}
                {action === "Message" && <MessageSquare className="h-3 w-3 mr-1" />}
                {action}
              </Button>
            ))}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-3 w-3 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-3 w-3 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="h-3 w-3 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-3 w-3 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  )
}

// Batch operations bar
const BatchOperationsBar = ({
  selectedCount,
  onBatchAction
}: {
  selectedCount: number
  onBatchAction: (action: string) => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 border"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span className="text-sm font-bold text-purple-600">{selectedCount}</span>
          </div>
          <span className="text-sm font-medium">requests selected</span>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => onBatchAction("accept")}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Accept All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onBatchAction("decline")}
          >
            <XCircle className="h-3 w-3 mr-1" />
            Decline All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onBatchAction("message")}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Message All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onBatchAction("template")}
          >
            <FileText className="h-3 w-3 mr-1" />
            Apply Template
          </Button>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onBatchAction("clear")}
        >
          Clear Selection
        </Button>
      </div>
    </motion.div>
  )
}

// Main component props
interface EnhancedRequestManagementProps {
  requests?: VideoRequest[]
  onRequestAction?: (action: string, requestId: string) => void
  onBatchAction?: (action: string, requestIds: string[]) => void
  className?: string
}

// Main enhanced request management component
export function EnhancedRequestManagement({
  requests: initialRequests = [],
  onRequestAction,
  onBatchAction,
  className
}: EnhancedRequestManagementProps) {
  const [requests, setRequests] = React.useState<VideoRequest[]>(initialRequests)
  const [selectedRequests, setSelectedRequests] = React.useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = React.useState<Record<string, string[]>>({})
  const [sortBy, setSortBy] = React.useState<string>("deadline")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewMode] = React.useState<"list" | "grid" | "kanban">("list")
  
  // Filter and sort requests
  const processedRequests = React.useMemo(() => {
    let filtered = [...requests]
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.occasion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.instructions.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply filters
    Object.entries(activeFilter).forEach(([key, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter(r => {
          switch (key) {
            case "state":
              return values.includes(r.state)
            case "urgency":
              return values.includes(r.isUrgent ? "urgent" : "normal")
            case "customer":
              return values.includes(r.isRepeatCustomer ? "repeat" : "new")
            case "complexity":
              return values.includes(r.complexity)
            default:
              return true
          }
        })
      }
    })
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case "price_desc":
          return b.price - a.price
        case "type":
          return a.occasion.localeCompare(b.occasion)
        case "customer":
          return (b.isRepeatCustomer ? 1 : 0) - (a.isRepeatCustomer ? 1 : 0)
        case "complexity":
          const complexityOrder = { simple: 0, moderate: 1, complex: 2 }
          return complexityOrder[a.complexity] - complexityOrder[b.complexity]
        default:
          return 0
      }
    })
    
    return filtered
  }, [requests, activeFilter, sortBy, searchQuery])
  
  // Group requests by state for kanban view
  const groupedRequests = React.useMemo(() => {
    const groups: Record<RequestState, VideoRequest[]> = {
      new: [],
      accepted: [],
      recording: [],
      "in-review": [],
      delivered: [],
      expired: []
    }
    
    processedRequests.forEach(request => {
      groups[request.state].push(request)
    })
    
    return groups
  }, [processedRequests])
  
  // Stats calculation
  const stats = React.useMemo(() => ({
    total: requests.length,
    new: requests.filter(r => r.state === "new").length,
    urgent: requests.filter(r => r.isUrgent).length,
    revenue: requests.reduce((sum, r) => sum + r.price, 0),
    avgTime: Math.round(requests.reduce((sum, r) => sum + r.estimatedTime, 0) / requests.length)
  }), [requests])
  
  const handleRequestSelect = (requestId: string, selected: boolean) => {
    setSelectedRequests(prev => {
      const next = new Set(prev)
      if (selected) {
        next.add(requestId)
      } else {
        next.delete(requestId)
      }
      return next
    })
  }
  
  const handleBatchOperation = (action: string) => {
    if (action === "clear") {
      setSelectedRequests(new Set())
    } else if (onBatchAction) {
      onBatchAction(action, Array.from(selectedRequests))
      setSelectedRequests(new Set())
    }
    toast.success(`Batch ${action} for ${selectedRequests.size} requests`)
  }
  
  const handleRequestAction = (action: string, requestId: string) => {
    if (onRequestAction) {
      onRequestAction(action, requestId)
    }
    toast.success(`Action "${action}" for request ${requestId}`)
  }
  
  const handleSelectAll = () => {
    if (selectedRequests.size === processedRequests.length) {
      setSelectedRequests(new Set())
    } else {
      setSelectedRequests(new Set(processedRequests.map(r => r.id)))
    }
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Request Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Streamlined workflow with intelligent assistance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Request
          </Button>
        </div>
      </div>
      
      {/* Stats bar */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Inbox className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-gray-600">New</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.new}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="text-sm text-gray-600">Urgent</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.urgent}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <p className="text-2xl font-bold mt-1">${stats.revenue}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-600">Avg Time</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.avgTime}min</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Controls bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Filters */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {Object.values(activeFilter).flat().length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {Object.values(activeFilter).flat().length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Filter by</h4>
                  {Object.entries(filterOptions).map(([key, options]) => (
                    <div key={key} className="mb-3">
                      <label className="text-sm font-medium capitalize mb-1 block">
                        {key}
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {options.map(option => (
                          <Badge
                            key={option}
                            variant={activeFilter[key]?.includes(option) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              setActiveFilter(prev => {
                                const current = prev[key] || []
                                const next = current.includes(option)
                                  ? current.filter(o => o !== option)
                                  : [...current, option]
                                return { ...prev, [key]: next }
                              })
                            }}
                          >
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveFilter({})}
                >
                  Clear Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* View mode */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "ghost"}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === "grid" ? "default" : "ghost"}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === "kanban" ? "default" : "ghost"}
            onClick={() => setViewMode("kanban")}
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Select all */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleSelectAll}
        >
          {selectedRequests.size === processedRequests.length ? "Deselect All" : "Select All"}
        </Button>
      </div>
      
      {/* Request list/grid/kanban */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {processedRequests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              isSelected={selectedRequests.has(request.id)}
              onSelect={(selected) => handleRequestSelect(request.id, selected)}
              onAction={handleRequestAction}
            />
          ))}
        </div>
      )}
      
      {viewMode === "grid" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedRequests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              isSelected={selectedRequests.has(request.id)}
              onSelect={(selected) => handleRequestSelect(request.id, selected)}
              onAction={handleRequestAction}
              showIntelligence={false}
            />
          ))}
        </div>
      )}
      
      {viewMode === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Object.entries(groupedRequests).map(([state, stateRequests]) => {
            const config = requestStateConfigs[state as RequestState]
            return (
              <div key={state} className="flex-shrink-0 w-80">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <config.icon className="h-4 w-4" />
                    <h3 className="font-semibold">{config.label}</h3>
                  </div>
                  <Badge variant="secondary">{stateRequests.length}</Badge>
                </div>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3 pr-4">
                    {stateRequests.map(request => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        isSelected={selectedRequests.has(request.id)}
                        onSelect={(selected) => handleRequestSelect(request.id, selected)}
                        onAction={handleRequestAction}
                        showIntelligence={false}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Empty state */}
      {processedRequests.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No requests found</h3>
            <p className="text-gray-600">
              {searchQuery || Object.values(activeFilter).flat().length > 0
                ? "Try adjusting your filters or search query"
                : "New requests will appear here"}
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Batch operations bar */}
      <AnimatePresence>
        {selectedRequests.size > 0 && (
          <BatchOperationsBar
            selectedCount={selectedRequests.size}
            onBatchAction={handleBatchOperation}
          />
        )}
      </AnimatePresence>
    </div>
  )
}