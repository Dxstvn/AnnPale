"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MessageSquare,
  Heart,
  Clock,
  Users,
  Star,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Battery,
  BatteryLow,
  Zap,
  Coffee,
  Brain,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  User,
  UserCheck,
  UserX,
  UserPlus,
  Bell,
  BellOff,
  Calendar,
  Inbox,
  Send,
  Reply,
  Archive,
  Trash2,
  Flag,
  MoreVertical,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Play,
  Pause,
  StopCircle,
  RotateCcw,
  RefreshCw,
  Target,
  Gauge,
  Timer,
  Lightbulb,
  HelpCircle,
  Info,
  Sparkles,
  Smile,
  Frown,
  Meh,
  CircleAlert,
  Check,
  X,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Edit,
  Save,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Link,
  Unlink,
  Share2,
  Bookmark,
  BookmarkCheck,
  Tag,
  Hash,
  AtSign,
  Phone,
  Mail,
  MessageCircle,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Headphones,
  Speaker,
  Volume1,
  Volume0,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Database,
  Server,
  Cloud,
  CloudOff,
  HardDrive,
  Folder,
  FolderOpen,
  File,
  FileText,
  Image,
  FileVideo,
  FileAudio,
  PaperclipIcon as Paperclip,
  Layers,
  Layout,
  Grid,
  List,
  Navigation,
  MapPin,
  Crosshair,
  Focus,
  Zoom,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Move,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Scissors,
  PaintBucket,
  Palette,
  Brush,
  Pen,
  PenTool,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Code2,
  Terminal,
  Package,
  Package2,
  Gift,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  Banknote,
  Wallet,
  Receipt,
  Calculator,
  TrendingUpIcon as TrendUp,
  TrendingDownIcon as TrendDown,
  PieChart,
  LineChart,
  BarChart,
  ScatterChart,
  Radar,
  Map,
  Globe,
  Compass,
  Navigation2,
  Route,
  Car,
  Plane,
  Train,
  Bus,
  Bike,
  Walk,
  Home,
  Building,
  Building2,
  Store,
  Warehouse,
  Factory,
  School,
  University,
  Hospital,
  Hotel,
  MapPinIcon as Pin,
  Landmark,
  TreePine,
  Mountain,
  Waves,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  Snowflake,
  Droplets,
  Thermometer,
  Wind,
  Rainbow,
  Sunrise,
  Sunset,
  Eclipse
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { format, addHours, subDays, isWithinInterval } from "date-fns"

// Types
interface Customer {
  id: string
  name: string
  avatar?: string
  type: "first-time" | "repeat" | "vip" | "business" | "problematic"
  totalOrders: number
  totalSpent: number
  avgRating: number
  lastInteraction: Date
  communicationStyle: "formal" | "casual" | "friendly" | "demanding"
  preferredTime?: string
  timezone?: string
  notes?: string
  flags: string[]
  energyLevel: number // 1-5 scale for how much energy they require
  responseTime: number // average hours to respond
  satisfactionScore: number // 1-5 scale
}

interface CommunicationBoundary {
  id: string
  type: "time" | "content" | "emotional" | "volume"
  name: string
  description: string
  rules: BoundaryRule[]
  isActive: boolean
  exceptions?: string[]
}

interface BoundaryRule {
  id: string
  condition: string
  action: string
  severity: "low" | "medium" | "high"
  autoEnforce: boolean
}

interface MessageTemplate {
  id: string
  name: string
  category: "greeting" | "boundary" | "escalation" | "auto-reply" | "closing"
  content: string
  tone: "professional" | "friendly" | "firm" | "empathetic"
  variables: string[]
  usageCount: number
  successRate: number
}

interface EnergyMetrics {
  current: number // 1-100 scale
  daily: number[]
  weeklyAverage: number
  burnoutRisk: "low" | "medium" | "high"
  recommendedBreak: boolean
  optimalResponseTimes: string[]
}

interface CommunicationPsychologyBoundariesProps {
  onBoundaryUpdate?: (boundary: CommunicationBoundary) => void
  onTemplateUse?: (template: MessageTemplate) => void
  onEnergyUpdate?: (metrics: EnergyMetrics) => void
  enableAutomation?: boolean
  enableAnalytics?: boolean
  enableWellnessMode?: boolean
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "SJ",
    type: "vip",
    totalOrders: 15,
    totalSpent: 750,
    avgRating: 5.0,
    lastInteraction: new Date("2024-01-15T10:30:00"),
    communicationStyle: "friendly",
    preferredTime: "evenings",
    timezone: "EST",
    notes: "Always very appreciative, loves personal touches",
    flags: ["high-value", "repeat-customer"],
    energyLevel: 2,
    responseTime: 2,
    satisfactionScore: 5
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "MC",
    type: "business",
    totalOrders: 8,
    totalSpent: 480,
    avgRating: 4.8,
    lastInteraction: new Date("2024-01-14T14:20:00"),
    communicationStyle: "formal",
    preferredTime: "business-hours",
    timezone: "PST",
    notes: "Corporate events, prefers detailed communication",
    flags: ["business-client", "bulk-orders"],
    energyLevel: 3,
    responseTime: 4,
    satisfactionScore: 4.8
  },
  {
    id: "3",
    name: "Jessica Williams",
    avatar: "JW",
    type: "problematic",
    totalOrders: 3,
    totalSpent: 150,
    avgRating: 2.5,
    lastInteraction: new Date("2024-01-13T20:45:00"),
    communicationStyle: "demanding",
    preferredTime: "anytime",
    timezone: "CST",
    notes: "Frequently requests revisions, can be difficult",
    flags: ["high-maintenance", "complaint-history"],
    energyLevel: 5,
    responseTime: 1,
    satisfactionScore: 2.5
  }
]

const defaultBoundaries: CommunicationBoundary[] = [
  {
    id: "time-1",
    type: "time",
    name: "Business Hours",
    description: "Respond to messages only during 9am-6pm weekdays",
    rules: [
      {
        id: "r1",
        condition: "Outside business hours",
        action: "Auto-reply with availability",
        severity: "medium",
        autoEnforce: true
      }
    ],
    isActive: true,
    exceptions: ["emergency", "vip-urgent"]
  },
  {
    id: "volume-1",
    type: "volume",
    name: "Daily Message Limit",
    description: "Maximum 50 messages per day to prevent overwhelm",
    rules: [
      {
        id: "r2",
        condition: "Messages > 50/day",
        action: "Defer to next day",
        severity: "high",
        autoEnforce: false
      }
    ],
    isActive: true
  },
  {
    id: "emotional-1",
    type: "emotional",
    name: "Emotional Labor Protection",
    description: "Detect and redirect emotional support requests",
    rules: [
      {
        id: "r3",
        condition: "Therapy/counseling request detected",
        action: "Refer to professional resources",
        severity: "high",
        autoEnforce: true
      }
    ],
    isActive: true
  }
]

const messageTemplates: MessageTemplate[] = [
  {
    id: "greeting-1",
    name: "Professional Greeting",
    category: "greeting",
    content: "Hi {customerName}, thank you for your message! I'll get back to you within {responseTime}.",
    tone: "professional",
    variables: ["customerName", "responseTime"],
    usageCount: 234,
    successRate: 95
  },
  {
    id: "boundary-1",
    name: "After Hours Auto-Reply",
    category: "auto-reply",
    content: "Thanks for reaching out! I'm currently offline but will respond during business hours (9am-6pm EST). For urgent matters, please mark your message as priority.",
    tone: "friendly",
    variables: [],
    usageCount: 156,
    successRate: 89
  },
  {
    id: "escalation-1",
    name: "Professional Referral",
    category: "escalation",
    content: "I appreciate you sharing this with me. For the support you're looking for, I'd recommend connecting with a professional counselor. Here are some resources: {resources}",
    tone: "empathetic",
    variables: ["resources"],
    usageCount: 23,
    successRate: 92
  }
]

export function CommunicationPsychologyBoundaries({
  onBoundaryUpdate,
  onTemplateUse,
  onEnergyUpdate,
  enableAutomation = true,
  enableAnalytics = true,
  enableWellnessMode = true
}: CommunicationPsychologyBoundariesProps) {
  const [activeTab, setActiveTab] = React.useState("relationships")
  const [customers, setCustomers] = React.useState<Customer[]>(mockCustomers)
  const [boundaries, setBoundaries] = React.useState<CommunicationBoundary[]>(defaultBoundaries)
  const [templates, setTemplates] = React.useState<MessageTemplate[]>(messageTemplates)
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null)
  const [energyLevel, setEnergyLevel] = React.useState([75])
  const [wellnessMode, setWellnessMode] = React.useState(false)
  const [autoResponses, setAutoResponses] = React.useState(true)
  const [messageLimit, setMessageLimit] = React.useState([50])
  const [responseWindow, setResponseWindow] = React.useState("24")
  const [filterType, setFilterType] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("priority")

  // Filter customers based on type
  const filteredCustomers = React.useMemo(() => {
    let filtered = [...customers]
    
    if (filterType !== "all") {
      filtered = filtered.filter(customer => customer.type === filterType)
    }
    
    // Sort customers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return b.energyLevel - a.energyLevel
        case "value":
          return b.totalSpent - a.totalSpent
        case "recent":
          return b.lastInteraction.getTime() - a.lastInteraction.getTime()
        case "satisfaction":
          return b.satisfactionScore - a.satisfactionScore
        default:
          return 0
      }
    })
    
    return filtered
  }, [customers, filterType, sortBy])

  // Calculate communication metrics
  const communicationMetrics = React.useMemo(() => {
    const totalCustomers = customers.length
    const highMaintenanceCount = customers.filter(c => c.energyLevel >= 4).length
    const vipCount = customers.filter(c => c.type === "vip").length
    const avgResponseTime = customers.reduce((sum, c) => sum + c.responseTime, 0) / totalCustomers
    const avgSatisfaction = customers.reduce((sum, c) => sum + c.satisfactionScore, 0) / totalCustomers
    
    return {
      totalCustomers,
      highMaintenanceCount,
      vipCount,
      avgResponseTime,
      avgSatisfaction,
      burnoutRisk: highMaintenanceCount / totalCustomers > 0.3 ? "high" : 
                   highMaintenanceCount / totalCustomers > 0.15 ? "medium" : "low"
    }
  }, [customers])

  // Handle boundary toggle
  const handleBoundaryToggle = (boundaryId: string) => {
    setBoundaries(prev => prev.map(boundary => 
      boundary.id === boundaryId 
        ? { ...boundary, isActive: !boundary.isActive }
        : boundary
    ))
  }

  // Handle template usage
  const handleTemplateUse = (template: MessageTemplate) => {
    setTemplates(prev => prev.map(t => 
      t.id === template.id 
        ? { ...t, usageCount: t.usageCount + 1 }
        : t
    ))
    onTemplateUse?.(template)
  }

  // Handle energy level change
  const handleEnergyChange = (value: number[]) => {
    setEnergyLevel(value)
    
    const metrics: EnergyMetrics = {
      current: value[0],
      daily: [65, 70, 68, 75, 72, 60, 58], // Mock data
      weeklyAverage: 66,
      burnoutRisk: value[0] < 30 ? "high" : value[0] < 60 ? "medium" : "low",
      recommendedBreak: value[0] < 40,
      optimalResponseTimes: value[0] > 70 ? ["morning", "afternoon"] : ["afternoon"]
    }
    
    onEnergyUpdate?.(metrics)
  }

  // Get relationship type badge color
  const getRelationshipBadgeColor = (type: Customer["type"]) => {
    switch (type) {
      case "vip": return "bg-purple-100 text-purple-800"
      case "business": return "bg-blue-100 text-blue-800"
      case "repeat": return "bg-green-100 text-green-800"
      case "problematic": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Get energy level indicator
  const getEnergyIndicator = (level: number) => {
    if (level <= 2) return { icon: Battery, color: "text-green-600", label: "Low Energy" }
    if (level <= 3) return { icon: BatteryLow, color: "text-yellow-600", label: "Medium Energy" }
    return { icon: Zap, color: "text-red-600", label: "High Energy" }
  }

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Communication Psychology & Boundaries
              </CardTitle>
              <CardDescription>
                Manage healthy communication patterns and creator well-being
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {enableWellnessMode && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="wellness-mode" className="text-sm">Wellness Mode</Label>
                  <Switch
                    id="wellness-mode"
                    checked={wellnessMode}
                    onCheckedChange={setWellnessMode}
                  />
                </div>
              )}
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
              <TabsTrigger value="boundaries">Boundaries</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="energy">Energy</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Relationships Tab */}
            <TabsContent value="relationships" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Customer Relationships</h3>
                <div className="flex items-center gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="repeat">Repeat</SelectItem>
                      <SelectItem value="first-time">First-time</SelectItem>
                      <SelectItem value="problematic">Problematic</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="value">Value</SelectItem>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="satisfaction">Satisfaction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredCustomers.map((customer) => {
                  const EnergyIcon = getEnergyIndicator(customer.energyLevel).icon
                  const energyColor = getEnergyIndicator(customer.energyLevel).color
                  
                  return (
                    <Card key={customer.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={customer.avatar} />
                              <AvatarFallback>{customer.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{customer.name}</h4>
                                <Badge className={cn("text-xs", getRelationshipBadgeColor(customer.type))}>
                                  {customer.type}
                                </Badge>
                                {customer.flags.map((flag) => (
                                  <Badge key={flag} variant="outline" className="text-xs">
                                    {flag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                  <span>Orders: {customer.totalOrders}</span>
                                </div>
                                <div>
                                  <span>Spent: ${customer.totalSpent}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  <span>{customer.avgRating.toFixed(1)}</span>
                                </div>
                                <div>
                                  <span>Response: {customer.responseTime}h avg</span>
                                </div>
                              </div>
                              {customer.notes && (
                                <p className="text-sm text-gray-500 mt-2">{customer.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Tooltip>
                              <TooltipTrigger>
                                <EnergyIcon className={cn("h-5 w-5", energyColor)} />
                              </TooltipTrigger>
                              <TooltipContent>
                                {getEnergyIndicator(customer.energyLevel).label}
                              </TooltipContent>
                            </Tooltip>
                            <span className="text-xs text-gray-500">
                              {format(customer.lastInteraction, "MMM d")}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Communication Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Communication Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{communicationMetrics.totalCustomers}</p>
                      <p className="text-sm text-gray-500">Total Customers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{communicationMetrics.vipCount}</p>
                      <p className="text-sm text-gray-500">VIP Customers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{communicationMetrics.highMaintenanceCount}</p>
                      <p className="text-sm text-gray-500">High Maintenance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{communicationMetrics.avgResponseTime.toFixed(1)}h</p>
                      <p className="text-sm text-gray-500">Avg Response</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{communicationMetrics.avgSatisfaction.toFixed(1)}</p>
                      <p className="text-sm text-gray-500">Satisfaction</p>
                    </div>
                  </div>
                  
                  {communicationMetrics.burnoutRisk !== "low" && (
                    <Alert className="mt-4 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Burnout Risk:</strong> {communicationMetrics.burnoutRisk === "high" ? "High" : "Medium"} 
                        - Consider adjusting boundaries or taking breaks
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Boundaries Tab */}
            <TabsContent value="boundaries" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Boundary Management</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Boundary
                </Button>
              </div>

              <div className="space-y-4">
                {boundaries.map((boundary) => (
                  <Card key={boundary.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{boundary.name}</h4>
                            <Badge variant="outline" className="capitalize">
                              {boundary.type}
                            </Badge>
                            <Switch
                              checked={boundary.isActive}
                              onCheckedChange={() => handleBoundaryToggle(boundary.id)}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{boundary.description}</p>
                          
                          <div className="space-y-2">
                            {boundary.rules.map((rule) => (
                              <div key={rule.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={rule.severity === "high" ? "destructive" : rule.severity === "medium" ? "secondary" : "outline"}
                                    className="text-xs"
                                  >
                                    {rule.severity}
                                  </Badge>
                                  <span className="text-sm">{rule.condition} → {rule.action}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {rule.autoEnforce && (
                                    <Badge variant="outline" className="text-xs">
                                      Auto
                                    </Badge>
                                  )}
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Boundary Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Boundary Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Daily Message Limit</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={messageLimit}
                        onValueChange={setMessageLimit}
                        min={10}
                        max={100}
                        step={5}
                        className="flex-1"
                      />
                      <Badge variant="secondary">{messageLimit[0]} messages</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Response Window</Label>
                    <Select value={responseWindow} onValueChange={setResponseWindow}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Auto-responses</Label>
                    <Switch
                      checked={autoResponses}
                      onCheckedChange={setAutoResponses}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Message Templates</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {template.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {template.tone}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleTemplateUse(template)}
                        >
                          Use
                        </Button>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm mb-3">
                        {template.content}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Used {template.usageCount} times</span>
                        <span>{template.successRate}% success rate</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Energy Tab */}
            <TabsContent value="energy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Battery className="h-4 w-4" />
                    Energy Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Current Energy Level</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={energyLevel}
                        onValueChange={handleEnergyChange}
                        min={0}
                        max={100}
                        step={5}
                        className="flex-1"
                      />
                      <Badge 
                        variant={energyLevel[0] < 30 ? "destructive" : energyLevel[0] < 60 ? "secondary" : "default"}
                        className="w-16 justify-center"
                      >
                        {energyLevel[0]}%
                      </Badge>
                    </div>
                  </div>
                  
                  {energyLevel[0] < 40 && (
                    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                      <Coffee className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Low Energy Detected:</strong> Consider taking a break or enabling wellness mode
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Communication Fatigue Prevention</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-sm">Smart Replies</span>
                        </div>
                        <p className="text-xs text-gray-600">AI-suggested responses</p>
                        <Switch className="mt-2" defaultChecked />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">Break Reminders</span>
                        </div>
                        <p className="text-xs text-gray-600">Scheduled wellness breaks</p>
                        <Switch className="mt-2" defaultChecked />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">Priority Queue</span>
                        </div>
                        <p className="text-xs text-gray-600">VIP message prioritization</p>
                        <Switch className="mt-2" defaultChecked />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-orange-600" />
                          <span className="font-medium text-sm">Auto-Boundaries</span>
                        </div>
                        <p className="text-xs text-gray-600">Automatic limit enforcement</p>
                        <Switch className="mt-2" defaultChecked />
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              {enableAnalytics && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Communication Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">234</p>
                          <p className="text-sm text-gray-500">Messages This Week</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">2.3h</p>
                          <p className="text-sm text-gray-500">Avg Response Time</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">94%</p>
                          <p className="text-sm text-gray-500">Satisfaction Rate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Boundary Effectiveness</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {boundaries.map((boundary) => (
                          <div key={boundary.id} className="flex items-center justify-between">
                            <span className="text-sm">{boundary.name}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={Math.random() * 100} className="w-20 h-2" />
                              <span className="text-sm text-gray-500">
                                {Math.floor(Math.random() * 100)}% effective
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}