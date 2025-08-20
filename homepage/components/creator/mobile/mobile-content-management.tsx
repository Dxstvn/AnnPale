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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Smartphone,
  Camera,
  Video,
  Upload,
  Download,
  Edit,
  Search,
  Filter,
  Grid,
  List,
  Play,
  Pause,
  MoreVertical,
  MoreHorizontal,
  Plus,
  Minus,
  X,
  Check,
  Star,
  Heart,
  Share2,
  Save,
  Trash2,
  Archive,
  FolderOpen,
  Tag,
  Clock,
  Calendar,
  User,
  Bell,
  BellOff,
  Settings,
  RefreshCw,
  WifiOff,
  Wifi,
  Eye,
  EyeOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  StopCircle,
  FileVideo,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Types
interface ContentItem {
  id: string
  type: "video" | "image" | "audio" | "document"
  title: string
  thumbnail?: string
  duration?: string
  size: string
  date: Date
  status: "draft" | "ready" | "delivered" | "archived"
  customer?: string
  occasion?: string
  rating?: number
  isOffline?: boolean
}

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  action: () => void
  isAvailable: boolean
}

interface MobileContentManagementProps {
  onUpload?: (file: File) => void
  onRecord?: () => void
  onEdit?: (item: ContentItem) => void
  onDelete?: (id: string) => void
  onShare?: (id: string) => void
  onOrganize?: (items: string[], action: string) => void
  enableOfflineMode?: boolean
  enableVoiceCommands?: boolean
  enableGestureControls?: boolean
}

// Mock data
const mockContent: ContentItem[] = [
  {
    id: "1",
    type: "video",
    title: "Birthday Message for Sarah",
    thumbnail: "🎂",
    duration: "2:30",
    size: "45MB",
    date: new Date("2024-01-15"),
    status: "delivered",
    customer: "Sarah Johnson",
    occasion: "Birthday",
    rating: 5,
    isOffline: false
  },
  {
    id: "2",
    type: "video",
    title: "Anniversary Celebration",
    thumbnail: "💑",
    duration: "3:15",
    size: "68MB",
    date: new Date("2024-01-14"),
    status: "ready",
    customer: "Mike & Lisa",
    occasion: "Anniversary",
    rating: 4.8,
    isOffline: true
  },
  {
    id: "3",
    type: "video",
    title: "Graduation Message",
    thumbnail: "🎓",
    duration: "2:00",
    size: "38MB",
    date: new Date("2024-01-13"),
    status: "draft",
    customer: "Emily Chen",
    occasion: "Graduation",
    isOffline: false
  }
]

export function MobileContentManagement({
  onUpload,
  onRecord,
  onEdit,
  onDelete,
  onShare,
  onOrganize,
  enableOfflineMode = true,
  enableVoiceCommands = true,
  enableGestureControls = true
}: MobileContentManagementProps) {
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list")
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isOffline, setIsOffline] = React.useState(false)
  const [uploadQueue, setUploadQueue] = React.useState<File[]>([])
  const [isRecording, setIsRecording] = React.useState(false)
  const [quickActionsOpen, setQuickActionsOpen] = React.useState(false)
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [selectedFilter, setSelectedFilter] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("date")
  const [isSelectionMode, setIsSelectionMode] = React.useState(false)

  // Filter content based on search and filters
  const filteredContent = React.useMemo(() => {
    let content = [...mockContent]

    // Search filter
    if (searchQuery) {
      content = content.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.occasion?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (selectedFilter !== "all") {
      content = content.filter(item => item.status === selectedFilter)
    }

    // Sort
    content.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.getTime() - a.date.getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "size":
          return parseInt(b.size) - parseInt(a.size)
        default:
          return 0
      }
    })

    return content
  }, [searchQuery, selectedFilter, sortBy])

  // Quick actions configuration
  const quickActions: QuickAction[] = [
    {
      id: "record",
      label: "Record",
      icon: <Camera className="h-5 w-5" />,
      color: "bg-red-500",
      action: () => {
        setIsRecording(true)
        onRecord?.()
      },
      isAvailable: !isOffline
    },
    {
      id: "upload",
      label: "Upload",
      icon: <Upload className="h-5 w-5" />,
      color: "bg-blue-500",
      action: () => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "video/*,image/*"
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (file) {
            if (isOffline) {
              setUploadQueue([...uploadQueue, file])
            } else {
              onUpload?.(file)
            }
          }
        }
        input.click()
      },
      isAvailable: true
    },
    {
      id: "search",
      label: "Search",
      icon: <Search className="h-5 w-5" />,
      color: "bg-green-500",
      action: () => {
        // Focus search input
        document.getElementById("mobile-search")?.focus()
      },
      isAvailable: true
    },
    {
      id: "organize",
      label: "Organize",
      icon: <FolderOpen className="h-5 w-5" />,
      color: "bg-purple-500",
      action: () => {
        setIsSelectionMode(true)
      },
      isAvailable: true
    }
  ]

  // Handle touch gestures (simplified for demo)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableGestureControls) return
    const touch = e.touches[0]
    // Store initial touch position for gesture detection
    console.log("Touch gesture started at:", touch.clientX, touch.clientY)
  }

  // Voice command simulation
  React.useEffect(() => {
    if (enableVoiceCommands) {
      // Voice command listener would be implemented here
      const handleVoiceCommand = (command: string) => {
        switch (command.toLowerCase()) {
          case "record":
            quickActions[0].action()
            break
          case "upload":
            quickActions[1].action()
            break
          case "search":
            quickActions[2].action()
            break
          case "organize":
            quickActions[3].action()
            break
        }
      }

      // Simulate voice commands for demo
      console.log("Voice commands enabled: 'record', 'upload', 'search', 'organize'")
    }
  }, [enableVoiceCommands])

  // Handle item selection
  const handleItemToggle = (id: string) => {
    const newSelection = new Set(selectedItems)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedItems(newSelection)
  }

  // Handle batch actions
  const handleBatchAction = (action: string) => {
    const items = Array.from(selectedItems)
    onOrganize?.(items, action)
    setSelectedItems(new Set())
    setIsSelectionMode(false)
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen" onTouchStart={handleTouchStart}>
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Smartphone className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="font-semibold">Content</h1>
              <p className="text-xs text-gray-500">{filteredContent.length} items</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOffline && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuickActionsOpen(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="mobile-search"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {enableVoiceCommands && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("all")}
            className="whitespace-nowrap"
          >
            All
          </Button>
          {["draft", "ready", "delivered"].map((status) => (
            <Button
              key={status}
              variant={selectedFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(status)}
              className="whitespace-nowrap capitalize"
            >
              {status}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFilterOpen(true)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 pb-20">
        {/* Selection Mode Header */}
        <AnimatePresence>
          {isSelectionMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedItems.size} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBatchAction("archive")}
                    disabled={selectedItems.size === 0}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBatchAction("delete")}
                    disabled={selectedItems.size === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsSelectionMode(false)
                      setSelectedItems(new Set())
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Queue */}
        {uploadQueue.length > 0 && (
          <Alert className="mb-4 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <Upload className="h-4 w-4" />
            <AlertDescription>
              {uploadQueue.length} files queued for upload when online
            </AlertDescription>
          </Alert>
        )}

        {/* Content List/Grid */}
        <div className={cn(
          viewMode === "grid" 
            ? "grid grid-cols-2 gap-3" 
            : "space-y-3"
        )}>
          <AnimatePresence>
            {filteredContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "border rounded-lg p-3 bg-white dark:bg-gray-800",
                  isSelectionMode && selectedItems.has(item.id) && "ring-2 ring-blue-500",
                  viewMode === "grid" && "aspect-square"
                )}
                onClick={() => {
                  if (isSelectionMode) {
                    handleItemToggle(item.id)
                  } else {
                    onEdit?.(item)
                  }
                }}
              >
                {viewMode === "list" ? (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="text-2xl">{item.thumbnail}</div>
                      {item.isOffline && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.title}</h3>
                      <p className="text-xs text-gray-500 truncate">{item.customer}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={
                            item.status === "delivered" ? "default" :
                            item.status === "ready" ? "secondary" :
                            "outline"
                          }
                          className="text-xs"
                        >
                          {item.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.duration}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(item)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onShare?.(item.id)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDelete?.(item.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-4xl relative">
                        {item.thumbnail}
                        {item.isOffline && (
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-medium text-xs truncate">{item.title}</h3>
                      <p className="text-xs text-gray-500 truncate">{item.customer}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge 
                          variant={
                            item.status === "delivered" ? "default" :
                            item.status === "ready" ? "secondary" :
                            "outline"
                          }
                          className="text-xs"
                        >
                          {item.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.duration}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <FileVideo className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No content found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery ? "Try adjusting your search" : "Start by recording or uploading content"}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions Sheet */}
      <Sheet open={quickActionsOpen} onOpenChange={setQuickActionsOpen}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>Quick Actions</SheetTitle>
            <SheetDescription>
              {enableGestureControls && "Swipe left to open, right to close"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className={cn(
                  "h-20 flex-col gap-2",
                  !action.isAvailable && "opacity-50"
                )}
                onClick={() => {
                  if (action.isAvailable) {
                    action.action()
                    setQuickActionsOpen(false)
                  }
                }}
                disabled={!action.isAvailable}
              >
                <div className={cn("p-2 rounded-full text-white", action.color)}>
                  {action.icon}
                </div>
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
          {enableVoiceCommands && (
            <Alert className="mt-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <Mic className="h-4 w-4" />
              <AlertDescription>
                Voice commands enabled: Say "record", "upload", "search", or "organize"
              </AlertDescription>
            </Alert>
          )}
        </SheetContent>
      </Sheet>

      {/* Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>Filters & Sort</SheetTitle>
            <SheetDescription>
              Refine your content view
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["all", "draft", "ready", "delivered", "archived"].map((status) => (
                  <Button
                    key={status}
                    variant={selectedFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {enableOfflineMode && (
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Offline Mode</Label>
                <Switch
                  checked={isOffline}
                  onCheckedChange={setIsOffline}
                />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium">Recording</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-red-600 h-6 w-6 p-0"
              onClick={() => setIsRecording(false)}
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hints */}
      {enableGestureControls && (
        <div className="fixed bottom-4 left-4 right-4 bg-gray-900/80 text-white text-xs p-2 rounded-lg text-center">
          Swipe ← for actions, ↑ for filters
        </div>
      )}
    </div>
  )
}