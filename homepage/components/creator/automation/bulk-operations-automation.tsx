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
import { Checkbox } from "@/components/ui/checkbox"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CheckSquare,
  Square,
  MinusSquare,
  MoreVertical,
  Folder,
  FolderOpen,
  Tags,
  Trash2,
  Download,
  Upload,
  Edit,
  Copy,
  FileText,
  Filter,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Save,
  Archive,
  Package,
  Database,
  Zap,
  Clock,
  Calendar,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  RefreshCw,
  Activity,
  BarChart3,
  Target,
  Award,
  Trophy,
  Brain,
  Eye,
  Send,
  Mail,
  MessageSquare,
  Users,
  Heart,
  ThumbsUp,
  Timer,
  Gauge,
  LineChart,
  PieChart,
  Sparkles,
  Lightbulb,
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
  Layers,
  Layout,
  Grid,
  List,
  Map,
  Globe,
  Compass,
  Navigation,
  MapPin,
  Building,
  Home,
  Store,
  ShoppingCart,
  CreditCard,
  Wallet,
  Receipt,
  File,
  MessageCircle,
  Phone,
  Video,
  Mic,
  Camera,
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
  Volume2,
  Vibrate,
  BellOff,
  BellRing,
  Notification,
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
  Plus,
  Minus,
  X,
  Check,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Link,
  Share2,
  Lock,
  Unlock,
  Search,
  Star,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronLeft,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  Move,
  Shuffle,
  Repeat,
  FastForward,
  Rewind,
  SkipForward,
  SkipBack,
  StopCircle,
  PlayCircle,
  PauseCircle,
  History,
  Bookmark,
  BookmarkCheck,
  Scissors,
  Clipboard,
  ClipboardCheck,
  ClipboardX,
  Paperclip,
  Trash,
  FolderPlus,
  FolderMinus,
  FolderCheck,
  FolderX,
  FilePlus,
  FileMinus,
  FileCheck,
  FileX,
  FileCode,
  FileJson,
  FileLock,
  FileKey,
  FileSearch,
  FileArchive,
  FileAudio,
  FileVideo,
  FileImage,
  FileSpreadsheet,
  Wand2,
  Magic
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
  Treemap
} from "recharts"

// Types
type OperationType = "categorize" | "tag" | "delete" | "export" | "update" | "template"
type AutomationType = "organization" | "processing" | "delivery" | "maintenance"
type RiskLevel = "low" | "medium" | "high"

interface BulkOperation {
  id: string
  type: OperationType
  name: string
  applyTo: string
  timeSaved: number
  riskLevel: RiskLevel
  undoSupport: boolean | string
  icon: any
  color: string
}

interface AutomationWorkflow {
  id: string
  type: AutomationType
  name: string
  description: string
  tasks: AutomationTask[]
  enabled: boolean
  schedule?: string
  lastRun?: Date
  nextRun?: Date
  stats: {
    runs: number
    itemsProcessed: number
    timeSaved: number
    successRate: number
  }
}

interface AutomationTask {
  id: string
  name: string
  action: string
  condition?: string
  parameters?: Record<string, any>
  enabled: boolean
}

interface SelectedItem {
  id: string
  title: string
  type: string
  date: Date
  size: number
  status: string
}

interface UndoHistory {
  id: string
  operation: string
  items: number
  timestamp: Date
  canUndo: boolean
  expiresIn?: number
}

interface BulkOperationsAutomationProps {
  onBulkOperation?: (operation: BulkOperation, items: string[]) => void
  onAutomationToggle?: (workflow: AutomationWorkflow) => void
  onUndo?: (historyId: string) => void
  enableAutomation?: boolean
  enableUndo?: boolean
  enablePreview?: boolean
  className?: string
}

// Mock data generators
const generateOperationHistory = () => {
  const operations = ["Categorized", "Tagged", "Exported", "Updated", "Deleted", "Applied Template"]
  const data = []
  for (let i = 7; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      operations: Math.floor(Math.random() * 20) + 5,
      itemsProcessed: Math.floor(Math.random() * 100) + 20,
      timeSaved: Math.floor(Math.random() * 60) + 10
    })
  }
  return data
}

const generateAutomationMetrics = () => [
  { workflow: "Organization", tasks: 234, success: 98, timeSaved: 45 },
  { workflow: "Processing", tasks: 156, success: 95, timeSaved: 78 },
  { workflow: "Delivery", tasks: 89, success: 99, timeSaved: 23 },
  { workflow: "Maintenance", tasks: 67, success: 100, timeSaved: 12 }
]

const generateEfficiencyGains = () => [
  { task: "Manual Tagging", before: 45, after: 5, improvement: 89 },
  { task: "Categorization", before: 30, after: 3, improvement: 90 },
  { task: "File Organization", before: 60, after: 8, improvement: 87 },
  { task: "Metadata Update", before: 25, after: 4, improvement: 84 },
  { task: "Export Process", before: 20, after: 2, improvement: 90 },
  { task: "Archive Management", before: 35, after: 5, improvement: 86 }
]

// Operation configurations
const bulkOperations: BulkOperation[] = [
  {
    id: "1",
    type: "categorize",
    name: "Categorize",
    applyTo: "Selected items",
    timeSaved: 90,
    riskLevel: "low",
    undoSupport: true,
    icon: Folder,
    color: "bg-blue-500"
  },
  {
    id: "2",
    type: "tag",
    name: "Tag",
    applyTo: "Multiple videos",
    timeSaved: 85,
    riskLevel: "low",
    undoSupport: true,
    icon: Tags,
    color: "bg-green-500"
  },
  {
    id: "3",
    type: "delete",
    name: "Delete",
    applyTo: "Old content",
    timeSaved: 95,
    riskLevel: "high",
    undoSupport: "30-day recovery",
    icon: Trash2,
    color: "bg-red-500"
  },
  {
    id: "4",
    type: "export",
    name: "Export",
    applyTo: "Data/videos",
    timeSaved: 80,
    riskLevel: "low",
    undoSupport: false,
    icon: Download,
    color: "bg-purple-500"
  },
  {
    id: "5",
    type: "update",
    name: "Update Metadata",
    applyTo: "Batch edit",
    timeSaved: 75,
    riskLevel: "medium",
    undoSupport: true,
    icon: Edit,
    color: "bg-orange-500"
  },
  {
    id: "6",
    type: "template",
    name: "Apply Template",
    applyTo: "Multiple items",
    timeSaved: 70,
    riskLevel: "medium",
    undoSupport: "Preview first",
    icon: FileText,
    color: "bg-pink-500"
  }
]

export function BulkOperationsAutomation({
  onBulkOperation,
  onAutomationToggle,
  onUndo,
  enableAutomation = true,
  enableUndo = true,
  enablePreview = true,
  className
}: BulkOperationsAutomationProps) {
  const [activeTab, setActiveTab] = React.useState("operations")
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())
  const [selectedOperation, setSelectedOperation] = React.useState<OperationType>("categorize")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [selectionMode, setSelectionMode] = React.useState(false)
  
  // Sample items for demonstration
  const [items] = React.useState<SelectedItem[]>([
    { id: "1", title: "Birthday Message", type: "video", date: new Date(), size: 125, status: "ready" },
    { id: "2", title: "Anniversary Wish", type: "video", date: new Date(), size: 98, status: "ready" },
    { id: "3", title: "Graduation Congrats", type: "video", date: new Date(), size: 145, status: "processing" },
    { id: "4", title: "Holiday Greeting", type: "video", date: new Date(), size: 112, status: "ready" },
    { id: "5", title: "Thank You Message", type: "video", date: new Date(), size: 87, status: "ready" },
    { id: "6", title: "Welcome Video", type: "video", date: new Date(), size: 156, status: "ready" }
  ])

  // Automation workflows
  const [workflows, setWorkflows] = React.useState<AutomationWorkflow[]>([
    {
      id: "1",
      type: "organization",
      name: "Auto-Organization",
      description: "Automatically organize content based on rules",
      tasks: [
        { id: "1", name: "Sort by date", action: "sort", enabled: true },
        { id: "2", name: "Categorize by type", action: "categorize", enabled: true },
        { id: "3", name: "Tag by occasion", action: "tag", enabled: false },
        { id: "4", name: "Archive old content", action: "archive", condition: ">30 days", enabled: true }
      ],
      enabled: true,
      schedule: "Daily at 2 AM",
      lastRun: new Date(Date.now() - 86400000),
      nextRun: new Date(Date.now() + 43200000),
      stats: { runs: 145, itemsProcessed: 3456, timeSaved: 234, successRate: 98 }
    },
    {
      id: "2",
      type: "processing",
      name: "Auto-Processing",
      description: "Apply processing rules to new content",
      tasks: [
        { id: "1", name: "Apply filters", action: "filter", enabled: true },
        { id: "2", name: "Add watermark", action: "watermark", enabled: true },
        { id: "3", name: "Generate thumbnail", action: "thumbnail", enabled: true },
        { id: "4", name: "Create preview", action: "preview", enabled: false }
      ],
      enabled: true,
      schedule: "On upload",
      stats: { runs: 234, itemsProcessed: 567, timeSaved: 123, successRate: 95 }
    },
    {
      id: "3",
      type: "delivery",
      name: "Auto-Delivery",
      description: "Automate content delivery workflow",
      tasks: [
        { id: "1", name: "Send when ready", action: "send", enabled: true },
        { id: "2", name: "Schedule delivery", action: "schedule", enabled: false },
        { id: "3", name: "Follow-up message", action: "followup", condition: "after 24h", enabled: true },
        { id: "4", name: "Request review", action: "review", condition: "after delivery", enabled: true }
      ],
      enabled: false,
      schedule: "Real-time",
      stats: { runs: 89, itemsProcessed: 178, timeSaved: 45, successRate: 99 }
    },
    {
      id: "4",
      type: "maintenance",
      name: "Auto-Maintenance",
      description: "Keep content library optimized",
      tasks: [
        { id: "1", name: "Clean duplicates", action: "dedupe", enabled: true },
        { id: "2", name: "Compress old files", action: "compress", condition: ">90 days", enabled: true },
        { id: "3", name: "Backup important", action: "backup", enabled: true },
        { id: "4", name: "Update metadata", action: "metadata", enabled: false }
      ],
      enabled: true,
      schedule: "Weekly Sunday",
      lastRun: new Date(Date.now() - 604800000),
      nextRun: new Date(Date.now() + 172800000),
      stats: { runs: 67, itemsProcessed: 1234, timeSaved: 89, successRate: 100 }
    }
  ])

  // Undo history
  const [undoHistory] = React.useState<UndoHistory[]>([
    { id: "1", operation: "Bulk Tag: Holiday", items: 23, timestamp: new Date(Date.now() - 3600000), canUndo: true, expiresIn: 23 },
    { id: "2", operation: "Categorize: Birthday", items: 15, timestamp: new Date(Date.now() - 7200000), canUndo: true, expiresIn: 22 },
    { id: "3", operation: "Delete: Old drafts", items: 8, timestamp: new Date(Date.now() - 86400000), canUndo: true, expiresIn: 29 },
    { id: "4", operation: "Export: Monthly report", items: 45, timestamp: new Date(Date.now() - 172800000), canUndo: false }
  ])

  // Data for visualizations
  const operationHistory = React.useMemo(() => generateOperationHistory(), [])
  const automationMetrics = React.useMemo(() => generateAutomationMetrics(), [])
  const efficiencyGains = React.useMemo(() => generateEfficiencyGains(), [])

  // Toggle item selection
  const toggleItemSelection = (itemId: string) => {
    const newSelection = new Set(selectedItems)
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId)
    } else {
      newSelection.add(itemId)
    }
    setSelectedItems(newSelection)
  }

  // Select all items
  const selectAll = () => {
    setSelectedItems(new Set(items.map(item => item.id)))
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedItems(new Set())
  }

  // Execute bulk operation
  const executeBulkOperation = () => {
    if (selectedItems.size === 0) return
    
    setIsProcessing(true)
    const operation = bulkOperations.find(op => op.type === selectedOperation)
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      clearSelection()
      if (operation && onBulkOperation) {
        onBulkOperation(operation, Array.from(selectedItems))
      }
    }, 2000)
  }

  // Toggle workflow
  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(wf => 
      wf.id === workflowId ? { ...wf, enabled: !wf.enabled } : wf
    ))
  }

  // Toggle task
  const toggleTask = (workflowId: string, taskId: string) => {
    setWorkflows(prev => prev.map(wf => 
      wf.id === workflowId 
        ? {
            ...wf,
            tasks: wf.tasks.map(task => 
              task.id === taskId ? { ...task, enabled: !task.enabled } : task
            )
          }
        : wf
    ))
  }

  // Get risk color
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "low": return "text-green-600"
      case "medium": return "text-yellow-600"
      case "high": return "text-red-600"
    }
  }

  // Calculate total stats
  const totalItemsProcessed = workflows.reduce((sum, wf) => sum + wf.stats.itemsProcessed, 0)
  const totalTimeSaved = workflows.reduce((sum, wf) => sum + wf.stats.timeSaved, 0)
  const avgSuccessRate = workflows.reduce((sum, wf) => sum + wf.stats.successRate, 0) / workflows.length

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600" />
            Bulk Operations & Automation
          </CardTitle>
          <CardDescription>
            Efficiently manage multiple content pieces with powerful automation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Items Selected</p>
                    <p className="text-2xl font-bold">{selectedItems.size}</p>
                  </div>
                  <CheckSquare className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Time Saved</p>
                    <p className="text-2xl font-bold">{totalTimeSaved}h</p>
                  </div>
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Processed</p>
                    <p className="text-2xl font-bold">{totalItemsProcessed}</p>
                  </div>
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold">{avgSuccessRate.toFixed(0)}%</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selection Mode Toggle */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className={cn("h-5 w-5", selectionMode ? "text-purple-600" : "text-gray-400")} />
              <div>
                <p className="font-medium text-sm">Selection Mode</p>
                <p className="text-xs text-gray-500">Select multiple items for bulk operations</p>
              </div>
            </div>
            <Switch checked={selectionMode} onCheckedChange={setSelectionMode} />
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
          {/* Operation Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Bulk Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {bulkOperations.map((operation) => {
                  const Icon = operation.icon
                  const isSelected = selectedOperation === operation.type
                  
                  return (
                    <motion.button
                      key={operation.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedOperation(operation.type)}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all text-left",
                        isSelected
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className={cn("p-2 rounded-lg", operation.color)}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getRiskColor(operation.riskLevel)}
                        >
                          {operation.riskLevel} risk
                        </Badge>
                      </div>
                      <h4 className="font-medium mt-3">{operation.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{operation.applyTo}</p>
                      <div className="flex items-center justify-between mt-3 text-xs">
                        <span className="text-gray-500">Saves {operation.timeSaved}% time</span>
                        {operation.undoSupport && (
                          <Badge variant="secondary" className="text-xs">
                            {typeof operation.undoSupport === "string" ? operation.undoSupport : "Undo"}
                          </Badge>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Item Selection */}
          {selectionMode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Select Items</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={selectAll}>
                      Select All
                    </Button>
                    <Button size="sm" variant="outline" onClick={clearSelection}>
                      Clear
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "p-3 rounded-lg border-2 cursor-pointer transition-all",
                        selectedItems.has(item.id)
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => toggleItemSelection(item.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{item.title}</h5>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>{item.type}</span>
                            <span>{item.size}MB</span>
                            <Badge variant="outline" className="text-xs">
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Execute Operation */}
                {selectedItems.size > 0 && (
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Ready to {bulkOperations.find(op => op.type === selectedOperation)?.name.toLowerCase()} {selectedItems.size} items
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          This will save approximately {Math.round(selectedItems.size * 2.5)} minutes
                        </p>
                      </div>
                      <Button 
                        onClick={executeBulkOperation}
                        disabled={isProcessing}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Execute Operation
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          {enableAutomation && (
            <>
              {/* Automation Workflows */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Automation Workflows
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workflows.map((workflow) => {
                    const categoryIcons = {
                      organization: FolderOpen,
                      processing: Cpu,
                      delivery: Send,
                      maintenance: Settings
                    }
                    const Icon = categoryIcons[workflow.type]
                    
                    return (
                      <motion.div
                        key={workflow.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "p-4 rounded-lg border-2",
                          workflow.enabled 
                            ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-200 bg-gray-50 dark:bg-gray-800"
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              workflow.enabled ? "bg-green-500" : "bg-gray-400"
                            )}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium">{workflow.name}</h4>
                              <p className="text-sm text-gray-600">{workflow.description}</p>
                              {workflow.schedule && (
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {workflow.schedule}
                                  </span>
                                  {workflow.lastRun && (
                                    <span>Last run: {workflow.lastRun.toLocaleDateString()}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <Switch
                            checked={workflow.enabled}
                            onCheckedChange={() => toggleWorkflow(workflow.id)}
                          />
                        </div>

                        {/* Tasks */}
                        <div className="space-y-2 mt-4">
                          {workflow.tasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={task.enabled}
                                  onCheckedChange={() => toggleTask(workflow.id, task.id)}
                                  disabled={!workflow.enabled}
                                />
                                <span className="text-sm">{task.name}</span>
                                {task.condition && (
                                  <Badge variant="outline" className="text-xs">
                                    {task.condition}
                                  </Badge>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-3 mt-4 pt-3 border-t">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Runs</p>
                            <p className="font-bold">{workflow.stats.runs}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Processed</p>
                            <p className="font-bold">{workflow.stats.itemsProcessed}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Time Saved</p>
                            <p className="font-bold">{workflow.stats.timeSaved}h</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Success</p>
                            <p className="font-bold text-green-600">{workflow.stats.successRate}%</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Automation Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Automation Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={automationMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="workflow" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="tasks" fill="#8B5CF6" name="Tasks Run" />
                        <Bar dataKey="timeSaved" fill="#10B981" name="Hours Saved" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          {enableUndo && (
            <>
              {/* Undo History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Operation History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {undoHistory.map((history) => (
                      <div key={history.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <RotateCcw className={cn(
                            "h-5 w-5",
                            history.canUndo ? "text-blue-600" : "text-gray-400"
                          )} />
                          <div>
                            <p className="font-medium text-sm">{history.operation}</p>
                            <p className="text-xs text-gray-500">
                              {history.items} items • {history.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {history.expiresIn && (
                            <Badge variant="outline" className="text-xs">
                              Expires in {history.expiresIn}h
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!history.canUndo}
                            onClick={() => onUndo?.(history.id)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Undo
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Operation Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Operation Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={operationHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <RechartsTooltip />
                        <Area yAxisId="left" type="monotone" dataKey="itemsProcessed" fill="#8B5CF6" fillOpacity={0.3} stroke="#8B5CF6" name="Items" />
                        <Line yAxisId="right" type="monotone" dataKey="timeSaved" stroke="#10B981" strokeWidth={3} name="Time Saved (min)" />
                        <Bar yAxisId="left" dataKey="operations" fill="#F97316" name="Operations" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Efficiency Gains */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Efficiency Gains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={efficiencyGains}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="task" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="before" fill="#EF4444" name="Before (min)" />
                    <Bar dataKey="after" fill="#10B981" name="After (min)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <Card className="border-green-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Avg Time Saved</p>
                    <p className="text-2xl font-bold text-green-600">87%</p>
                    <p className="text-xs text-gray-500 mt-1">Per operation</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Items/Hour</p>
                    <p className="text-2xl font-bold text-blue-600">156</p>
                    <p className="text-xs text-gray-500 mt-1">vs 12 manual</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">ROI</p>
                    <p className="text-2xl font-bold text-purple-600">423%</p>
                    <p className="text-xs text-gray-500 mt-1">Time value</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Optimization Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Peak Efficiency:</strong> Batch operations between 2-4 AM show 35% faster processing
                </AlertDescription>
              </Alert>

              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Optimal Batch Size:</strong> Groups of 20-30 items process most efficiently
                </AlertDescription>
              </Alert>

              <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>Smart Scheduling:</strong> Weekly maintenance on Sunday 2 AM minimizes disruption
                </AlertDescription>
              </Alert>

              <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Automation Sweet Spot:</strong> 78% of repetitive tasks can be fully automated
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Add missing imports
const TrendingUp = ArrowUp
const History = Clock