"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Upload,
  FileVideo,
  Camera,
  Cloud,
  Webcam,
  FolderOpen,
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Settings,
  Zap,
  Download,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Filter,
  Image as ImageIcon,
  Film,
  Mic,
  Smartphone,
  Monitor,
  HardDrive,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Cpu,
  Activity,
  AlertTriangle,
  Info,
  RefreshCw,
  Eye,
  EyeOff,
  Scissors,
  Palette,
  Volume2,
  FileText,
  Hash,
  Calendar,
  User,
  Tag,
  FolderPlus,
  Share2,
  Save,
  Send,
  Archive,
  Trash2,
  Edit,
  Copy,
  Link,
  ExternalLink,
  CloudUpload,
  CloudDownload,
  CloudOff,
  Server,
  Database,
  Shield,
  Lock,
  Unlock,
  Key,
  FileCheck,
  FileX,
  FilePlus,
  Files,
  FolderCheck,
  Package,
  Layers,
  Grid,
  List,
  LayoutGrid,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Sparkles,
  Wand2,
  Magic
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Types
export interface UploadFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  format: string
  uploadMethod: "drag-drop" | "file-browser" | "camera" | "cloud" | "webcam"
  status: "pending" | "uploading" | "processing" | "complete" | "error" | "paused"
  progress: number
  processingStage?: string
  thumbnail?: string
  duration?: number
  resolution?: string
  bitrate?: string
  error?: string
  retryCount: number
  priority: number
  metadata?: {
    customer?: string
    occasion?: string
    tags?: string[]
    notes?: string
  }
  optimization?: {
    originalSize: number
    compressedSize: number
    format: string
    quality: number
  }
  chunks?: {
    total: number
    completed: number
    size: number
  }
}

export interface ProcessingStage {
  id: string
  name: string
  status: "pending" | "active" | "complete" | "error"
  progress: number
  duration?: number
  icon: React.ElementType
}

export interface UploadMethod {
  id: string
  name: string
  description: string
  icon: React.ElementType
  supported: boolean
  color: string
}

export interface CompressionPreset {
  id: string
  name: string
  description: string
  quality: number
  maxResolution: string
  bitrate: string
  format: string
  estimatedSize: string
}

export interface UploadProcessingInterfaceProps {
  onUploadComplete?: (files: UploadFile[]) => void
  onProcessingComplete?: (files: UploadFile[]) => void
  onError?: (error: string, file?: UploadFile) => void
  maxConcurrentUploads?: number
  enableAutoRetry?: boolean
  enableCompression?: boolean
  enableBatchProcessing?: boolean
}

// Mock data generators
const generateUploadMethods = (): UploadMethod[] => {
  return [
    {
      id: "drag-drop",
      name: "Drag & Drop",
      description: "Desktop primary method",
      icon: Upload,
      supported: true,
      color: "text-blue-600"
    },
    {
      id: "file-browser",
      name: "File Browser",
      description: "Traditional file selection",
      icon: FolderOpen,
      supported: true,
      color: "text-green-600"
    },
    {
      id: "camera",
      name: "Mobile Camera",
      description: "Direct recording",
      icon: Camera,
      supported: typeof window !== 'undefined' && 'mediaDevices' in navigator,
      color: "text-purple-600"
    },
    {
      id: "cloud",
      name: "Cloud Import",
      description: "External storage",
      icon: Cloud,
      supported: true,
      color: "text-orange-600"
    },
    {
      id: "webcam",
      name: "Webcam",
      description: "Quick recording",
      icon: Webcam,
      supported: typeof window !== 'undefined' && 'mediaDevices' in navigator,
      color: "text-pink-600"
    }
  ]
}

const generateProcessingStages = (fileType: string): ProcessingStage[] => {
  const baseStages: ProcessingStage[] = [
    {
      id: "upload",
      name: "Uploading",
      status: "active",
      progress: 65,
      icon: Upload
    },
    {
      id: "validate",
      name: "Validating",
      status: "pending",
      progress: 0,
      icon: FileCheck
    },
    {
      id: "process",
      name: "Processing",
      status: "pending",
      progress: 0,
      icon: Cpu
    },
    {
      id: "optimize",
      name: "Optimizing",
      status: "pending",
      progress: 0,
      icon: Zap
    },
    {
      id: "finalize",
      name: "Finalizing",
      status: "pending",
      progress: 0,
      icon: CheckCircle
    }
  ]

  if (fileType.startsWith("video/")) {
    baseStages.splice(2, 0, 
      {
        id: "transcode",
        name: "Transcoding",
        status: "pending",
        progress: 0,
        icon: Film
      },
      {
        id: "thumbnail",
        name: "Generating Thumbnail",
        status: "pending",
        progress: 0,
        icon: ImageIcon
      }
    )
  }

  return baseStages
}

const generateCompressionPresets = (): CompressionPreset[] => {
  return [
    {
      id: "high",
      name: "High Quality",
      description: "Best quality, larger file",
      quality: 95,
      maxResolution: "1920x1080",
      bitrate: "8Mbps",
      format: "H.264",
      estimatedSize: "~50MB/min"
    },
    {
      id: "balanced",
      name: "Balanced",
      description: "Good quality, moderate size",
      quality: 85,
      maxResolution: "1280x720",
      bitrate: "5Mbps",
      format: "H.264",
      estimatedSize: "~30MB/min"
    },
    {
      id: "optimized",
      name: "Optimized",
      description: "Smaller file, web-friendly",
      quality: 75,
      maxResolution: "1280x720",
      bitrate: "3Mbps",
      format: "H.264",
      estimatedSize: "~20MB/min"
    },
    {
      id: "mobile",
      name: "Mobile",
      description: "Best for mobile viewing",
      quality: 70,
      maxResolution: "854x480",
      bitrate: "2Mbps",
      format: "H.264",
      estimatedSize: "~15MB/min"
    }
  ]
}

// Sub-components
const UploadMethodCard: React.FC<{
  method: UploadMethod
  onSelect: () => void
}> = ({ method, onSelect }) => {
  const Icon = method.icon

  return (
    <motion.div
      whileHover={{ scale: method.supported ? 1.02 : 1 }}
      whileTap={{ scale: method.supported ? 0.98 : 1 }}
    >
      <Card 
        className={cn(
          "cursor-pointer transition-all",
          method.supported 
            ? "hover:shadow-md hover:border-purple-300" 
            : "opacity-50 cursor-not-allowed"
        )}
        onClick={method.supported ? onSelect : undefined}
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className={cn("p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-3", method.color)}>
              <Icon className="h-6 w-6" />
            </div>
            <h4 className="font-medium mb-1">{method.name}</h4>
            <p className="text-xs text-gray-600">{method.description}</p>
            {!method.supported && (
              <Badge variant="secondary" className="mt-2 text-xs">
                Not Available
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const ProcessingPipeline: React.FC<{
  stages: ProcessingStage[]
  currentStage?: string
}> = ({ stages, currentStage }) => {
  return (
    <div className="space-y-3">
      {stages.map((stage, index) => {
        const Icon = stage.icon
        const isActive = stage.status === "active"
        const isComplete = stage.status === "complete"
        const isError = stage.status === "error"
        
        return (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all",
              isActive && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200",
              isComplete && "bg-green-50 dark:bg-green-900/20",
              isError && "bg-red-50 dark:bg-red-900/20"
            )}
          >
            <div className={cn(
              "p-2 rounded-full",
              isActive && "bg-blue-100 dark:bg-blue-800",
              isComplete && "bg-green-100 dark:bg-green-800",
              isError && "bg-red-100 dark:bg-red-800",
              !isActive && !isComplete && !isError && "bg-gray-100 dark:bg-gray-800"
            )}>
              {isActive ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              ) : isComplete ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : isError ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <Icon className="h-4 w-4 text-gray-600" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-sm font-medium",
                  isActive && "text-blue-900 dark:text-blue-100"
                )}>
                  {stage.name}
                </span>
                {stage.status !== "pending" && (
                  <span className="text-xs text-gray-500">
                    {stage.progress}%
                  </span>
                )}
              </div>
              {isActive && (
                <Progress value={stage.progress} className="h-1" />
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

const SortableUploadItem: React.FC<{
  file: UploadFile
  onRetry?: () => void
  onRemove?: () => void
  onPause?: () => void
  onResume?: () => void
  onPriorityChange?: (priority: number) => void
}> = ({ file, onRetry, onRemove, onPause, onResume, onPriorityChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: file.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploading": return "text-blue-600"
      case "processing": return "text-purple-600"
      case "complete": return "text-green-600"
      case "error": return "text-red-600"
      case "paused": return "text-yellow-600"
      default: return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading": return Upload
      case "processing": return Cpu
      case "complete": return CheckCircle
      case "error": return AlertCircle
      case "paused": return Pause
      default: return Clock
    }
  }

  const StatusIcon = getStatusIcon(file.status)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg border p-4 transition-all",
        isDragging && "opacity-50 shadow-lg"
      )}
      {...attributes}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <div {...listeners} className="cursor-move mt-1">
          <Grid className="h-4 w-4 text-gray-400" />
        </div>

        {/* File Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h5 className="font-medium text-sm">{file.name}</h5>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                <span>{formatFileSize(file.size)}</span>
                <span>{file.format}</span>
                {file.duration && <span>{formatDuration(file.duration)}</span>}
                {file.resolution && <span>{file.resolution}</span>}
              </div>
            </div>
            
            <Badge className={cn("text-xs", getStatusColor(file.status))}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {file.status}
            </Badge>
          </div>

          {/* Progress Bar */}
          {(file.status === "uploading" || file.status === "processing") && (
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">
                  {file.processingStage || "Uploading"}
                </span>
                <span className="text-xs font-medium">{file.progress}%</span>
              </div>
              <Progress value={file.progress} className="h-2" />
              
              {/* Chunk Progress */}
              {file.chunks && (
                <div className="text-xs text-gray-500 mt-1">
                  Chunk {file.chunks.completed} of {file.chunks.total}
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {file.error && (
            <Alert className="mt-2 p-2">
              <AlertCircle className="h-3 w-3" />
              <AlertDescription className="text-xs">
                {file.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Optimization Info */}
          {file.optimization && (
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
              <Zap className="h-3 w-3 text-green-600" />
              <span>
                Compressed: {formatFileSize(file.optimization.originalSize)} → {formatFileSize(file.optimization.compressedSize)} 
                ({Math.round((1 - file.optimization.compressedSize / file.optimization.originalSize) * 100)}% saved)
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            {file.status === "paused" && onResume && (
              <Button size="sm" variant="outline" onClick={onResume}>
                <Play className="h-3 w-3 mr-1" />
                Resume
              </Button>
            )}
            
            {file.status === "uploading" && onPause && (
              <Button size="sm" variant="outline" onClick={onPause}>
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </Button>
            )}
            
            {file.status === "error" && onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                <RotateCcw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
            
            {file.status === "pending" && (
              <Select
                value={file.priority.toString()}
                onValueChange={(value) => onPriorityChange?.(parseInt(value))}
              >
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">High</SelectItem>
                  <SelectItem value="2">Normal</SelectItem>
                  <SelectItem value="3">Low</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {onRemove && (
              <Button size="sm" variant="ghost" onClick={onRemove}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const UploadQueue: React.FC<{
  files: UploadFile[]
  onReorder?: (files: UploadFile[]) => void
  onRetry?: (fileId: string) => void
  onRemove?: (fileId: string) => void
  onPause?: (fileId: string) => void
  onResume?: (fileId: string) => void
  onPriorityChange?: (fileId: string, priority: number) => void
}> = ({ files, onReorder, onRetry, onRemove, onPause, onResume, onPriorityChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = files.findIndex(f => f.id === active.id)
      const newIndex = files.findIndex(f => f.id === over.id)
      const newFiles = arrayMove(files, oldIndex, newIndex)
      onReorder?.(newFiles)
    }
  }

  // Group files by status
  const groupedFiles = {
    active: files.filter(f => f.status === "uploading" || f.status === "processing"),
    queued: files.filter(f => f.status === "pending"),
    paused: files.filter(f => f.status === "paused"),
    completed: files.filter(f => f.status === "complete"),
    failed: files.filter(f => f.status === "error")
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {/* Active Uploads */}
        {groupedFiles.active.length > 0 && (
          <div>
            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Active ({groupedFiles.active.length})
            </h5>
            <SortableContext
              items={groupedFiles.active.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {groupedFiles.active.map(file => (
                  <SortableUploadItem
                    key={file.id}
                    file={file}
                    onRetry={() => onRetry?.(file.id)}
                    onRemove={() => onRemove?.(file.id)}
                    onPause={() => onPause?.(file.id)}
                    onResume={() => onResume?.(file.id)}
                    onPriorityChange={(p) => onPriorityChange?.(file.id, p)}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        )}

        {/* Queued */}
        {groupedFiles.queued.length > 0 && (
          <div>
            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              Queued ({groupedFiles.queued.length})
            </h5>
            <SortableContext
              items={groupedFiles.queued.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {groupedFiles.queued.map(file => (
                  <SortableUploadItem
                    key={file.id}
                    file={file}
                    onRemove={() => onRemove?.(file.id)}
                    onPriorityChange={(p) => onPriorityChange?.(file.id, p)}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        )}

        {/* Paused */}
        {groupedFiles.paused.length > 0 && (
          <div>
            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Pause className="h-4 w-4 text-yellow-600" />
              Paused ({groupedFiles.paused.length})
            </h5>
            <div className="space-y-2">
              {groupedFiles.paused.map(file => (
                <SortableUploadItem
                  key={file.id}
                  file={file}
                  onResume={() => onResume?.(file.id)}
                  onRemove={() => onRemove?.(file.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Failed */}
        {groupedFiles.failed.length > 0 && (
          <div>
            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              Failed ({groupedFiles.failed.length})
            </h5>
            <div className="space-y-2">
              {groupedFiles.failed.map(file => (
                <SortableUploadItem
                  key={file.id}
                  file={file}
                  onRetry={() => onRetry?.(file.id)}
                  onRemove={() => onRemove?.(file.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {groupedFiles.completed.length > 0 && (
          <div>
            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Completed ({groupedFiles.completed.length})
            </h5>
            <div className="space-y-2">
              {groupedFiles.completed.map(file => (
                <SortableUploadItem
                  key={file.id}
                  file={file}
                  onRemove={() => onRemove?.(file.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DndContext>
  )
}

// Main component
export const UploadProcessingInterface: React.FC<UploadProcessingInterfaceProps> = ({
  onUploadComplete,
  onProcessingComplete,
  onError,
  maxConcurrentUploads = 3,
  enableAutoRetry = true,
  enableCompression = true,
  enableBatchProcessing = true
}) => {
  const [uploadMethods] = React.useState<UploadMethod[]>(generateUploadMethods())
  const [processingStages] = React.useState<ProcessingStage[]>(generateProcessingStages("video/mp4"))
  const [compressionPresets] = React.useState<CompressionPreset[]>(generateCompressionPresets())
  
  const [selectedMethod, setSelectedMethod] = React.useState<string>("drag-drop")
  const [uploadQueue, setUploadQueue] = React.useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [selectedPreset, setSelectedPreset] = React.useState<string>("balanced")
  const [networkStatus, setNetworkStatus] = React.useState<"online" | "offline" | "slow">("online")
  
  // Settings
  const [autoRetry, setAutoRetry] = React.useState(enableAutoRetry)
  const [compression, setCompression] = React.useState(enableCompression)
  const [batchProcessing, setBatchProcessing] = React.useState(enableBatchProcessing)
  const [chunkSize, setChunkSize] = React.useState([5]) // MB

  // Simulate network status
  React.useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random()
      if (random > 0.95) {
        setNetworkStatus("offline")
      } else if (random > 0.85) {
        setNetworkStatus("slow")
      } else {
        setNetworkStatus("online")
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFilesSelect(files, "drag-drop")
  }

  const handleFilesSelect = (files: File[], method: string) => {
    const newFiles: UploadFile[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      format: file.type.split("/")[1]?.toUpperCase() || "Unknown",
      uploadMethod: method as UploadFile["uploadMethod"],
      status: "pending",
      progress: 0,
      retryCount: 0,
      priority: 2,
      chunks: {
        total: Math.ceil(file.size / (chunkSize[0] * 1024 * 1024)),
        completed: 0,
        size: chunkSize[0] * 1024 * 1024
      }
    }))

    setUploadQueue([...uploadQueue, ...newFiles])
    
    // Simulate upload start
    setTimeout(() => {
      simulateUpload(newFiles[0]?.id)
    }, 1000)
  }

  const simulateUpload = (fileId: string) => {
    if (!fileId) return

    const interval = setInterval(() => {
      setUploadQueue(prev => {
        const updated = [...prev]
        const fileIndex = updated.findIndex(f => f.id === fileId)
        
        if (fileIndex === -1) {
          clearInterval(interval)
          return prev
        }

        const file = updated[fileIndex]
        
        if (file.status === "pending") {
          file.status = "uploading"
          file.progress = 0
        } else if (file.status === "uploading") {
          file.progress = Math.min(file.progress + Math.random() * 10, 100)
          
          if (file.chunks) {
            file.chunks.completed = Math.floor(file.progress / 100 * file.chunks.total)
          }
          
          if (file.progress >= 100) {
            file.status = "processing"
            file.progress = 0
            file.processingStage = "Validating"
          }
        } else if (file.status === "processing") {
          file.progress = Math.min(file.progress + Math.random() * 15, 100)
          
          // Update processing stage
          if (file.progress < 20) {
            file.processingStage = "Validating"
          } else if (file.progress < 40) {
            file.processingStage = "Processing"
          } else if (file.progress < 60) {
            file.processingStage = "Optimizing"
          } else if (file.progress < 80) {
            file.processingStage = "Generating Thumbnail"
          } else {
            file.processingStage = "Finalizing"
          }
          
          if (file.progress >= 100) {
            file.status = "complete"
            
            // Add optimization info
            if (compression) {
              file.optimization = {
                originalSize: file.size,
                compressedSize: Math.round(file.size * 0.65),
                format: "H.264",
                quality: 85
              }
            }
            
            clearInterval(interval)
            
            // Start next file
            const nextFile = updated.find(f => f.status === "pending")
            if (nextFile) {
              setTimeout(() => simulateUpload(nextFile.id), 500)
            }
          }
        }
        
        return updated
      })
    }, 500)
  }

  const handleRetry = (fileId: string) => {
    setUploadQueue(prev => {
      const updated = [...prev]
      const file = updated.find(f => f.id === fileId)
      if (file) {
        file.status = "pending"
        file.progress = 0
        file.error = undefined
        file.retryCount++
        setTimeout(() => simulateUpload(fileId), 500)
      }
      return updated
    })
  }

  const handleRemove = (fileId: string) => {
    setUploadQueue(prev => prev.filter(f => f.id !== fileId))
  }

  const handlePause = (fileId: string) => {
    setUploadQueue(prev => {
      const updated = [...prev]
      const file = updated.find(f => f.id === fileId)
      if (file && file.status === "uploading") {
        file.status = "paused"
      }
      return updated
    })
  }

  const handleResume = (fileId: string) => {
    setUploadQueue(prev => {
      const updated = [...prev]
      const file = updated.find(f => f.id === fileId)
      if (file && file.status === "paused") {
        file.status = "uploading"
        setTimeout(() => simulateUpload(fileId), 500)
      }
      return updated
    })
  }

  const handlePriorityChange = (fileId: string, priority: number) => {
    setUploadQueue(prev => {
      const updated = [...prev]
      const file = updated.find(f => f.id === fileId)
      if (file) {
        file.priority = priority
      }
      // Re-sort by priority
      return updated.sort((a, b) => a.priority - b.priority)
    })
  }

  const handleReorder = (files: UploadFile[]) => {
    setUploadQueue(files)
  }

  // Calculate stats
  const stats = {
    total: uploadQueue.length,
    completed: uploadQueue.filter(f => f.status === "complete").length,
    failed: uploadQueue.filter(f => f.status === "error").length,
    active: uploadQueue.filter(f => f.status === "uploading" || f.status === "processing").length,
    queued: uploadQueue.filter(f => f.status === "pending").length,
    totalSize: uploadQueue.reduce((sum, f) => sum + f.size, 0),
    uploadedSize: uploadQueue.reduce((sum, f) => {
      if (f.status === "complete") return sum + f.size
      if (f.status === "uploading" || f.status === "processing") {
        return sum + (f.size * f.progress / 100)
      }
      return sum
    }, 0)
  }

  return (
    <div className="space-y-6">
      {/* Network Status */}
      <Alert className={cn(
        "transition-all",
        networkStatus === "offline" && "border-red-200 bg-red-50 dark:bg-red-900/20",
        networkStatus === "slow" && "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {networkStatus === "online" ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : networkStatus === "slow" ? (
              <Wifi className="h-4 w-4 text-yellow-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription>
              {networkStatus === "online" && "Connection stable - optimal upload speed"}
              {networkStatus === "slow" && "Slow connection detected - uploads may take longer"}
              {networkStatus === "offline" && "No connection - uploads paused automatically"}
            </AlertDescription>
          </div>
          {networkStatus === "offline" && autoRetry && (
            <Badge variant="outline" className="text-xs">
              Auto-retry enabled
            </Badge>
          )}
        </div>
      </Alert>

      {/* Upload Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Upload Method</CardTitle>
          <CardDescription>
            Select how you want to upload your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {uploadMethods.map(method => (
              <UploadMethodCard
                key={method.id}
                method={method}
                onSelect={() => setSelectedMethod(method.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Upload Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upload Zone</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {stats.active}/{maxConcurrentUploads} active
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setUploadQueue([])}
                    disabled={uploadQueue.length === 0}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-all",
                  isDragging 
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
                    : "border-gray-300 dark:border-gray-700 hover:border-purple-400"
                )}
              >
                <Cloud className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">
                  {isDragging ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse from your device
                </p>
                <Button variant="outline">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
              </div>

              {/* Upload Queue */}
              {uploadQueue.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Upload Queue</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{stats.completed}/{stats.total} complete</span>
                      <span>{formatFileSize(stats.uploadedSize)} / {formatFileSize(stats.totalSize)}</span>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    <UploadQueue
                      files={uploadQueue}
                      onReorder={handleReorder}
                      onRetry={handleRetry}
                      onRemove={handleRemove}
                      onPause={handlePause}
                      onResume={handleResume}
                      onPriorityChange={handlePriorityChange}
                    />
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Settings & Pipeline */}
        <div className="space-y-6">
          {/* Processing Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Processing Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProcessingPipeline 
                stages={processingStages}
                currentStage="upload"
              />
            </CardContent>
          </Card>

          {/* Compression Settings */}
          {compression && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Compression Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPreset} onValueChange={setSelectedPreset}>
                  {compressionPresets.map(preset => (
                    <div key={preset.id} className="flex items-start space-x-2 mb-3">
                      <RadioGroupItem value={preset.id} id={preset.id} />
                      <Label htmlFor={preset.id} className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium text-sm">{preset.name}</div>
                          <div className="text-xs text-gray-600">{preset.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {preset.quality}% quality
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {preset.estimatedSize}
                            </Badge>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Upload Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Upload Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-retry" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Auto-retry on failure
                </Label>
                <Switch
                  id="auto-retry"
                  checked={autoRetry}
                  onCheckedChange={setAutoRetry}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="compression" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Enable compression
                </Label>
                <Switch
                  id="compression"
                  checked={compression}
                  onCheckedChange={setCompression}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="batch" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Batch processing
                </Label>
                <Switch
                  id="batch"
                  checked={batchProcessing}
                  onCheckedChange={setBatchProcessing}
                />
              </div>
              
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4" />
                  Chunk size: {chunkSize[0]} MB
                </Label>
                <Slider
                  value={chunkSize}
                  onValueChange={setChunkSize}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Utility functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}