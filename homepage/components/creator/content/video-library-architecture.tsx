"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  Grid,
  List,
  Calendar as CalendarIcon,
  Columns3,
  LayoutGrid,
  FileVideo,
  Film,
  Video,
  PlayCircle,
  Play,
  Pause,
  Upload,
  Download,
  Send,
  Save,
  Archive,
  Trash,
  Edit,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Heart,
  MessageSquare,
  Share2,
  Copy,
  MoreVertical,
  MoreHorizontal,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Clock,
  Timer,
  Calendar as CalendarDays,
  User,
  Users,
  Gift,
  Briefcase,
  Trophy,
  Award,
  DollarSign,
  TrendingUp,
  Hash,
  Tag,
  Tags,
  Folder,
  FolderOpen,
  FolderPlus,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  X,
  Settings,
  RefreshCw,
  Zap,
  Database,
  HardDrive,
  Cloud,
  CloudUpload,
  CloudDownload,
  Sparkles,
  Wand2,
  Image,
  FileText,
  Music,
  Mic,
  Camera,
  Monitor,
  Smartphone,
  Activity,
  BarChart3,
  PieChart,
  TrendingDown,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  BookmarkCheck,
  Bell,
  BellOff,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  ShieldOff
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, rectSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Types
export type ViewType = "grid" | "list" | "timeline" | "kanban" | "gallery"
export type ContentStatus = "drafts" | "processing" | "ready" | "delivered" | "archived"
export type ContentType = "personal" | "business" | "celebration" | "tutorial" | "promotional"
export type ContentQuality = "portfolio" | "standard" | "quick" | "practice"

export interface VideoMetadata {
  title: string
  customer: string
  date: Date
  duration: string
  occasion: string
  tags: string[]
  rating: number
  views: number
  revenue: number
  fileSize: string
  resolution: string
  format: string
}

export interface VideoContent {
  id: string
  thumbnail: string
  metadata: VideoMetadata
  status: ContentStatus
  type: ContentType
  quality: ContentQuality
  isStarred: boolean
  isProtected: boolean
  hasComments: boolean
  createdAt: Date
  updatedAt: Date
  deliveredAt?: Date
}

export interface LibraryCategory {
  id: string
  name: string
  icon: React.ElementType
  color: string
  count: number
  subcategories?: string[]
}

export interface VideoLibraryArchitectureProps {
  viewType?: ViewType
  onViewChange?: (view: ViewType) => void
  onVideoSelect?: (videoId: string) => void
  onVideoAction?: (videoId: string, action: string) => void
  onCategorySelect?: (categoryId: string) => void
  onSearch?: (query: string) => void
  onFilter?: (filters: any) => void
}

// Mock data generators
const generateVideoContent = (): VideoContent[] => {
  const statuses: ContentStatus[] = ["drafts", "processing", "ready", "delivered", "archived"]
  const types: ContentType[] = ["personal", "business", "celebration", "tutorial", "promotional"]
  const qualities: ContentQuality[] = ["portfolio", "standard", "quick", "practice"]
  const occasions = ["Birthday", "Wedding", "Anniversary", "Graduation", "Holiday", "Business", "Other"]
  const customers = ["Sarah Miller", "John Davis", "Emma Thompson", "Mike Wilson", "Tech Corp", "Local Business"]
  
  return Array.from({ length: 24 }, (_, i) => ({
    id: `video_${i + 1}`,
    thumbnail: `/api/placeholder/320/180`,
    metadata: {
      title: `Video Message ${i + 1}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      duration: `${Math.floor(Math.random() * 5) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      occasion: occasions[Math.floor(Math.random() * occasions.length)],
      tags: ["personal", "english", "celebration"].slice(0, Math.floor(Math.random() * 3) + 1),
      rating: Math.random() * 2 + 3,
      views: Math.floor(Math.random() * 1000),
      revenue: Math.floor(Math.random() * 500) + 50,
      fileSize: `${Math.floor(Math.random() * 100) + 10}MB`,
      resolution: Math.random() > 0.5 ? "1080p" : "720p",
      format: "MP4"
    },
    status: statuses[Math.floor(Math.random() * statuses.length)],
    type: types[Math.floor(Math.random() * types.length)],
    quality: qualities[Math.floor(Math.random() * qualities.length)],
    isStarred: Math.random() > 0.8,
    isProtected: Math.random() > 0.9,
    hasComments: Math.random() > 0.7,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    deliveredAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
  }))
}

const generateCategories = (): LibraryCategory[] => {
  return [
    {
      id: "status",
      name: "Status",
      icon: Activity,
      color: "text-blue-600",
      count: 24,
      subcategories: ["Drafts", "Processing", "Ready", "Delivered", "Archived"]
    },
    {
      id: "type",
      name: "Type",
      icon: Film,
      color: "text-purple-600",
      count: 24,
      subcategories: ["Personal", "Business", "Celebrations", "Tutorials", "Promotional"]
    },
    {
      id: "quality",
      name: "Quality",
      icon: Star,
      color: "text-yellow-600",
      count: 24,
      subcategories: ["Portfolio", "Standard", "Quick", "Practice"]
    }
  ]
}

// Sub-components
const ViewToggle: React.FC<{
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}> = ({ currentView, onViewChange }) => {
  const views: { type: ViewType; icon: React.ElementType; label: string }[] = [
    { type: "grid", icon: Grid, label: "Grid" },
    { type: "list", icon: List, label: "List" },
    { type: "timeline", icon: CalendarIcon, label: "Timeline" },
    { type: "kanban", icon: Columns3, label: "Kanban" },
    { type: "gallery", icon: LayoutGrid, label: "Gallery" }
  ]

  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {views.map(view => {
        const Icon = view.icon
        return (
          <Button
            key={view.type}
            size="sm"
            variant={currentView === view.type ? "default" : "ghost"}
            onClick={() => onViewChange(view.type)}
            className="px-3"
          >
            <Icon className="h-4 w-4 mr-1" />
            {view.label}
          </Button>
        )
      })}
    </div>
  )
}

const VideoCard: React.FC<{
  video: VideoContent
  viewType: ViewType
  onSelect: () => void
  onAction: (action: string) => void
}> = ({ video, viewType, onSelect, onAction }) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case "drafts": return "bg-gray-100 text-gray-800"
      case "processing": return "bg-blue-100 text-blue-800"
      case "ready": return "bg-green-100 text-green-800"
      case "delivered": return "bg-purple-100 text-purple-800"
      case "archived": return "bg-gray-100 text-gray-600"
    }
  }

  const getQualityIcon = (quality: ContentQuality) => {
    switch (quality) {
      case "portfolio": return <Trophy className="h-3 w-3 text-yellow-600" />
      case "standard": return <Star className="h-3 w-3 text-blue-600" />
      case "quick": return <Zap className="h-3 w-3 text-green-600" />
      case "practice": return <Activity className="h-3 w-3 text-gray-600" />
    }
  }

  if (viewType === "list") {
    return (
      <div className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-24 h-14 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
          <img src={video.thumbnail} alt={video.metadata.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 text-white text-xs rounded">
            {video.metadata.duration}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{video.metadata.title}</h4>
            {video.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
            {video.isProtected && <Lock className="h-3 w-3 text-blue-500" />}
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
            <span>{video.metadata.customer}</span>
            <span>{video.metadata.occasion}</span>
            <span>{format(video.metadata.date, "MMM d, yyyy")}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={cn("text-xs", getStatusColor(video.status))}>
            {video.status}
          </Badge>
          {getQualityIcon(video.quality)}
          <div className="text-right">
            <div className="text-sm font-medium">${video.metadata.revenue}</div>
            <div className="text-xs text-gray-500">{video.metadata.views} views</div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onAction("menu")
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Grid view (default)
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className="cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
        onClick={onSelect}
      >
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
          <img src={video.thumbnail} alt={video.metadata.title} className="w-full h-full object-cover" />
          
          {/* Overlay on hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <PlayCircle className="h-12 w-12 text-white" />
            </div>
          )}
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
            {video.metadata.duration}
          </div>
          
          {/* Quality badge */}
          <div className="absolute top-2 left-2">
            {getQualityIcon(video.quality)}
          </div>
          
          {/* Star indicator */}
          {video.isStarred && (
            <div className="absolute top-2 right-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
          )}
        </div>
        
        <CardContent className="p-3">
          <h4 className="font-medium text-sm truncate">{video.metadata.title}</h4>
          <p className="text-xs text-gray-600 mt-1">{video.metadata.customer}</p>
          
          <div className="flex items-center justify-between mt-2">
            <Badge className={cn("text-xs", getStatusColor(video.status))}>
              {video.status}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="h-3 w-3" />
              {video.metadata.views}
            </div>
          </div>
          
          {video.metadata.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {video.metadata.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {video.metadata.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{video.metadata.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

const TimelineView: React.FC<{
  videos: VideoContent[]
  onSelect: (videoId: string) => void
  onAction: (videoId: string, action: string) => void
}> = ({ videos, onSelect, onAction }) => {
  // Group videos by date
  const groupedVideos = React.useMemo(() => {
    const groups: Record<string, VideoContent[]> = {}
    videos.forEach(video => {
      const dateKey = format(video.metadata.date, "yyyy-MM-dd")
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(video)
    })
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  }, [videos])

  return (
    <div className="space-y-6">
      {groupedVideos.map(([date, dateVideos]) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-3">
            <CalendarIcon className="h-4 w-4 text-gray-600" />
            <h3 className="font-medium">{format(new Date(date), "MMMM d, yyyy")}</h3>
            <Badge variant="secondary">{dateVideos.length} videos</Badge>
          </div>
          
          <div className="ml-7 space-y-2">
            {dateVideos.map(video => (
              <div
                key={video.id}
                className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelect(video.id)}
              >
                <div className="w-16 h-9 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <img src={video.thumbnail} alt={video.metadata.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-medium">{video.metadata.title}</h5>
                  <p className="text-xs text-gray-600">{video.metadata.customer} • {video.metadata.duration}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {video.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const KanbanView: React.FC<{
  videos: VideoContent[]
  onSelect: (videoId: string) => void
  onAction: (videoId: string, action: string) => void
}> = ({ videos, onSelect, onAction }) => {
  const columns: ContentStatus[] = ["drafts", "processing", "ready", "delivered", "archived"]
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: any) => {
    console.log("Drag ended:", event)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(column => {
          const columnVideos = videos.filter(v => v.status === column)
          
          return (
            <div key={column} className="min-w-[300px]">
              <div className="flex items-center justify-between mb-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium capitalize">{column}</h3>
                <Badge variant="secondary">{columnVideos.length}</Badge>
              </div>
              
              <SortableContext
                items={columnVideos.map(v => v.id)}
                strategy={rectSortingStrategy}
              >
                <div className="space-y-2">
                  {columnVideos.map(video => (
                    <SortableVideoCard
                      key={video.id}
                      video={video}
                      onSelect={() => onSelect(video.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          )
        })}
      </div>
    </DndContext>
  )
}

const SortableVideoCard: React.FC<{
  video: VideoContent
  onSelect: () => void
}> = ({ video, onSelect }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: video.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "p-3 bg-white dark:bg-gray-800 rounded-lg cursor-move hover:shadow-md transition-shadow",
        isDragging && "opacity-50"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-20 h-12 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
          <img src={video.thumbnail} alt={video.metadata.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-medium truncate">{video.metadata.title}</h5>
          <p className="text-xs text-gray-600">{video.metadata.duration}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">{video.metadata.customer}</span>
        {video.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
      </div>
    </div>
  )
}

const GalleryView: React.FC<{
  videos: VideoContent[]
  onSelect: (videoId: string) => void
  onAction: (videoId: string, action: string) => void
}> = ({ videos, onSelect, onAction }) => {
  // Filter for portfolio/best content
  const showcaseVideos = videos.filter(v => v.quality === "portfolio" || v.isStarred)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {showcaseVideos.map(video => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="overflow-hidden cursor-pointer" onClick={() => onSelect(video.id)}>
            <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
              <img src={video.thumbnail} alt={video.metadata.title} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-semibold mb-1">{video.metadata.title}</h3>
                <p className="text-sm opacity-90">{video.metadata.customer} • {video.metadata.occasion}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{video.metadata.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm">{video.metadata.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">${video.metadata.revenue}</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <Badge className="bg-yellow-500 text-black">
                  Portfolio
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                  {video.metadata.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAction(video.id, "share")
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-sm text-gray-600">
                Created {format(video.createdAt, "MMM d, yyyy")} • {video.metadata.fileSize} • {video.metadata.resolution}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

const MetadataPanel: React.FC<{
  video: VideoContent
  onEdit: () => void
}> = ({ video, onEdit }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Metadata</CardTitle>
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Title:</span>
            <span className="font-medium">{video.metadata.title}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Customer:</span>
            <span className="font-medium">{video.metadata.customer}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{format(video.metadata.date, "MMM d, yyyy")}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{video.metadata.duration}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Occasion:</span>
            <span className="font-medium">{video.metadata.occasion}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Quality:</span>
            <span className="font-medium capitalize">{video.quality}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">File Size:</span>
            <span className="font-medium">{video.metadata.fileSize}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Resolution:</span>
            <span className="font-medium">{video.metadata.resolution}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Format:</span>
            <span className="font-medium">{video.metadata.format}</span>
          </div>
          
          <Separator />
          
          <div>
            <span className="text-gray-600 block mb-2">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {video.metadata.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              <Button size="sm" variant="ghost" className="h-6 px-2">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xl font-bold">{video.metadata.views}</div>
              <div className="text-xs text-gray-600">Views</div>
            </div>
            <div>
              <div className="text-xl font-bold">{video.metadata.rating.toFixed(1)}</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
            <div>
              <div className="text-xl font-bold">${video.metadata.revenue}</div>
              <div className="text-xs text-gray-600">Revenue</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main component
export const VideoLibraryArchitecture: React.FC<VideoLibraryArchitectureProps> = ({
  viewType: initialViewType = "grid",
  onViewChange,
  onVideoSelect,
  onVideoAction,
  onCategorySelect,
  onSearch,
  onFilter
}) => {
  const [viewType, setViewType] = React.useState<ViewType>(initialViewType)
  const [videos] = React.useState<VideoContent[]>(generateVideoContent())
  const [categories] = React.useState<LibraryCategory[]>(generateCategories())
  const [selectedVideo, setSelectedVideo] = React.useState<VideoContent | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [selectedFilters, setSelectedFilters] = React.useState<any>({})

  const handleViewChange = (view: ViewType) => {
    setViewType(view)
    onViewChange?.(view)
  }

  const handleVideoSelect = (videoId: string) => {
    const video = videos.find(v => v.id === videoId)
    setSelectedVideo(video || null)
    onVideoSelect?.(videoId)
  }

  const handleVideoAction = (videoId: string, action: string) => {
    onVideoAction?.(videoId, action)
  }

  const filteredVideos = React.useMemo(() => {
    let filtered = [...videos]
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(v => 
        v.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.metadata.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.metadata.occasion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    // Category filter
    if (selectedCategory !== "all") {
      // Apply category-specific filtering
    }
    
    return filtered
  }, [videos, searchQuery, selectedCategory])

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-2 space-y-2">
                    {["drafts", "processing", "ready", "delivered", "archived"].map(status => (
                      <label key={status} className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Quality</Label>
                  <div className="mt-2 space-y-2">
                    {["portfolio", "standard", "quick", "practice"].map(quality => (
                      <label key={quality} className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm capitalize">{quality}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full">Apply Filters</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <ViewToggle currentView={viewType} onViewChange={handleViewChange} />
      </div>

      {/* Categories */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            All Videos
            <Badge variant="secondary" className="ml-2">
              {videos.length}
            </Badge>
          </Button>
          
          {categories.map(category => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category.id)
                  onCategorySelect?.(category.id)
                }}
              >
                <Icon className={cn("h-4 w-4 mr-2", category.color)} />
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-4 gap-4">
        <div className={cn("lg:col-span-3", selectedVideo && "lg:col-span-3")}>
          {/* View-specific rendering */}
          {viewType === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  viewType={viewType}
                  onSelect={() => handleVideoSelect(video.id)}
                  onAction={(action) => handleVideoAction(video.id, action)}
                />
              ))}
            </div>
          )}
          
          {viewType === "list" && (
            <div className="space-y-2">
              {filteredVideos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  viewType={viewType}
                  onSelect={() => handleVideoSelect(video.id)}
                  onAction={(action) => handleVideoAction(video.id, action)}
                />
              ))}
            </div>
          )}
          
          {viewType === "timeline" && (
            <TimelineView
              videos={filteredVideos}
              onSelect={handleVideoSelect}
              onAction={handleVideoAction}
            />
          )}
          
          {viewType === "kanban" && (
            <KanbanView
              videos={filteredVideos}
              onSelect={handleVideoSelect}
              onAction={handleVideoAction}
            />
          )}
          
          {viewType === "gallery" && (
            <GalleryView
              videos={filteredVideos}
              onSelect={handleVideoSelect}
              onAction={handleVideoAction}
            />
          )}
        </div>

        {/* Metadata Panel */}
        {selectedVideo && (
          <div className="lg:col-span-1">
            <MetadataPanel
              video={selectedVideo}
              onEdit={() => console.log("Edit metadata")}
            />
          </div>
        )}
      </div>

      {/* Library Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{videos.length}</div>
              <div className="text-xs text-gray-600">Total Videos</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {videos.filter(v => v.status === "ready").length}
              </div>
              <div className="text-xs text-gray-600">Ready to Deliver</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {videos.filter(v => v.quality === "portfolio").length}
              </div>
              <div className="text-xs text-gray-600">Portfolio Pieces</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {videos.reduce((sum, v) => sum + v.metadata.views, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Total Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                ${videos.reduce((sum, v) => sum + v.metadata.revenue, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Total Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}