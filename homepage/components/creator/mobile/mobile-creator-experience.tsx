"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Phone,
  MessageSquare,
  Camera,
  Mic,
  DollarSign,
  Clock,
  Calendar,
  Star,
  Users,
  Bell,
  BellOff,
  Settings,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Square,
  CircleDot,
  Send,
  Image as ImageIcon,
  Video,
  FileText,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Heart,
  Share2,
  Copy,
  ExternalLink,
  Zap,
  Target,
  TrendingUp,
  Activity,
  RefreshCw,
  CloudOff,
  Cloud,
  Smartphone,
  Headphones,
  Volume2,
  VolumeX
} from "lucide-react"
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Interfaces
interface VideoRequest {
  id: string
  customerName: string
  customerAvatar?: string
  occasion: string
  message: string
  price: number
  deadline: string
  priority: 'urgent' | 'high' | 'normal' | 'low'
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined'
  requestedAt: string
  specialInstructions?: string
  attachments?: Array<{
    type: 'image' | 'video' | 'text'
    url: string
    name: string
  }>
}

interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<any>
  type: 'accept' | 'decline' | 'voice' | 'photo' | 'withdraw' | 'status'
  color: string
  action: () => void
}

interface NotificationSettings {
  newRequests: boolean
  deadlines: boolean
  earnings: boolean
  messages: boolean
  platformUpdates: boolean
  pushEnabled: boolean
}

interface OfflineItem {
  id: string
  type: 'response' | 'video' | 'message' | 'status'
  data: any
  timestamp: string
  synced: boolean
}

// Props interface
interface MobileCreatorExperienceProps {
  userId: string
  requests?: VideoRequest[]
  earnings?: {
    today: number
    thisWeek: number
    thisMonth: number
  }
  onAcceptRequest?: (requestId: string) => void
  onDeclineRequest?: (requestId: string) => void
  onRecordResponse?: (requestId: string, type: 'voice' | 'video') => void
  onQuickWithdraw?: () => void
  onUpdateStatus?: (status: string) => void
  className?: string
}

// Mock Data
const mockRequests: VideoRequest[] = [
  {
    id: "req-001",
    customerName: "Marie Dubois",
    customerAvatar: "/placeholder-user.jpg",
    occasion: "Birthday",
    message: "Bonjour! I would love a birthday message for my daughter Sophie who is turning 25. She's been following your career and would be so excited!",
    price: 75,
    deadline: "2024-01-20T15:00:00Z",
    priority: 'urgent',
    status: 'pending',
    requestedAt: "2024-01-18T10:30:00Z",
    specialInstructions: "Please mention she's studying medicine in Paris",
    attachments: [
      { type: 'image', url: '/photos/sophie.jpg', name: 'sophie.jpg' }
    ]
  },
  {
    id: "req-002", 
    customerName: "Jean-Pierre Voltaire",
    customerAvatar: "/avatars/jean-pierre.jpg",
    occasion: "Anniversary",
    message: "Ayisyen pòtrè! I need a special message for my wife's 50th birthday. We've been married 25 years and she loves your work!",
    price: 120,
    deadline: "2024-01-22T18:00:00Z", 
    priority: 'high',
    status: 'pending',
    requestedAt: "2024-01-18T14:20:00Z"
  },
  {
    id: "req-003",
    customerName: "Sarah Johnson",
    customerName: "Sarah Johnson",
    occasion: "Graduation",
    message: "Hi! My son is graduating from college and he's a huge fan. Could you congratulate him and maybe say something inspirational?",
    price: 85,
    deadline: "2024-01-25T12:00:00Z",
    priority: 'normal', 
    status: 'pending',
    requestedAt: "2024-01-18T16:45:00Z"
  }
]

const mockEarnings = {
  today: 195,
  thisWeek: 840,
  thisMonth: 3420
}

export function MobileCreatorExperience({
  userId,
  requests = mockRequests,
  earnings = mockEarnings,
  onAcceptRequest,
  onDeclineRequest,
  onRecordResponse,
  onQuickWithdraw,
  onUpdateStatus,
  className
}: MobileCreatorExperienceProps) {
  const [activeTab, setActiveTab] = React.useState("requests")
  const [selectedRequest, setSelectedRequest] = React.useState<VideoRequest | null>(null)
  const [isRecording, setIsRecording] = React.useState(false)
  const [recordingType, setRecordingType] = React.useState<'voice' | 'video'>('voice')
  const [notifications, setNotifications] = React.useState<NotificationSettings>({
    newRequests: true,
    deadlines: true,
    earnings: true,
    messages: true,
    platformUpdates: false,
    pushEnabled: true
  })
  const [offlineItems, setOfflineItems] = React.useState<OfflineItem[]>([])
  const [isOnline, setIsOnline] = React.useState(true)
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [showRecorder, setShowRecorder] = React.useState(false)
  const [recordingDuration, setRecordingDuration] = React.useState(0)

  // Swipe gesture handling
  const x = useMotionValue(0)
  const scale = useTransform(x, [-150, 0, 150], [0.8, 1, 0.8])
  const rotateX = useTransform(x, [-150, 0, 150], [-10, 0, 10])
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5])

  // Network status simulation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1) // 90% online
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Recording timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)
    } else {
      setRecordingDuration(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleSwipeEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, request: VideoRequest) => {
    const threshold = 100
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swiped right - Accept
        handleAcceptRequest(request.id)
        toast.success(`Accepted request from ${request.customerName}`)
      } else {
        // Swiped left - Decline
        handleDeclineRequest(request.id)
        toast.error(`Declined request from ${request.customerName}`)
      }
    }
    x.set(0)
  }

  const handleAcceptRequest = (requestId: string) => {
    onAcceptRequest?.(requestId)
    if (!isOnline) {
      addToOfflineQueue('accept', { requestId })
    }
  }

  const handleDeclineRequest = (requestId: string) => {
    onDeclineRequest?.(requestId)
    if (!isOnline) {
      addToOfflineQueue('decline', { requestId })
    }
  }

  const addToOfflineQueue = (type: string, data: any) => {
    const newItem: OfflineItem = {
      id: Date.now().toString(),
      type: type as any,
      data,
      timestamp: new Date().toISOString(),
      synced: false
    }
    setOfflineItems(prev => [...prev, newItem])
  }

  const startRecording = (type: 'voice' | 'video') => {
    setRecordingType(type)
    setIsRecording(true)
    setShowRecorder(true)
    toast.success(`Started ${type} recording`)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setShowRecorder(false)
    if (recordingDuration > 0) {
      toast.success(`${recordingType} recorded (${recordingDuration}s)`)
    }
    setRecordingDuration(0)
  }

  const getPriorityColor = (priority: VideoRequest['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'  
      case 'normal': return 'bg-blue-500'
      case 'low': return 'bg-gray-500'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDeadline = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diff = deadlineDate.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 0) return 'Overdue'
    if (hours < 1) return 'Due soon'
    if (hours < 24) return `${hours}h left`
    return `${Math.floor(hours / 24)}d left`
  }

  const quickActions: QuickAction[] = [
    {
      id: 'accept',
      label: 'Quick Accept',
      icon: Check,
      type: 'accept',
      color: 'bg-green-500',
      action: () => selectedRequest && handleAcceptRequest(selectedRequest.id)
    },
    {
      id: 'decline', 
      label: 'Quick Decline',
      icon: X,
      type: 'decline',
      color: 'bg-red-500',
      action: () => selectedRequest && handleDeclineRequest(selectedRequest.id)
    },
    {
      id: 'voice',
      label: 'Voice Response',
      icon: Mic,
      type: 'voice',
      color: 'bg-blue-500',
      action: () => startRecording('voice')
    },
    {
      id: 'photo',
      label: 'Photo Response',
      icon: Camera,
      type: 'photo', 
      color: 'bg-purple-500',
      action: () => toast.success('Camera opened')
    },
    {
      id: 'withdraw',
      label: 'Quick Withdraw',
      icon: DollarSign,
      type: 'withdraw',
      color: 'bg-green-600',
      action: () => onQuickWithdraw?.()
    },
    {
      id: 'status',
      label: 'Update Status',
      icon: Activity,
      type: 'status',
      color: 'bg-orange-500',
      action: () => onUpdateStatus?.('Available')
    }
  ]

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900", className)}>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/creator-avatar.jpg" />
              <AvatarFallback>CR</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-lg">Creator Hub</h1>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Wifi className="h-3 w-3" />
                    Online
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <WifiOff className="h-3 w-3" />
                    Offline
                  </div>
                )}
                {offlineItems.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {offlineItems.length} pending sync
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowNotifications(true)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {requests.filter(r => r.status === 'pending').length > 0 && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">
                    {requests.filter(r => r.status === 'pending').length}
                  </span>
                </div>
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Earnings Banner */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold">${earnings.today}</div>
                <div className="text-xs opacity-90">Today</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">${earnings.thisWeek}</div>
                <div className="text-xs opacity-90">Week</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">${earnings.thisMonth}</div>
                <div className="text-xs opacity-90">Month</div>
              </div>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={onQuickWithdraw}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Download className="h-4 w-4 mr-1" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4 mx-4 my-3">
          <TabsTrigger value="requests" className="text-xs">
            Requests
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <Badge className="ml-1 h-4 w-4 p-0 text-xs bg-red-500">
                {requests.filter(r => r.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
          <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
          <TabsTrigger value="offline" className="text-xs">
            Offline
            {offlineItems.length > 0 && (
              <Badge className="ml-1 h-4 w-4 p-0 text-xs bg-orange-500">
                {offlineItems.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Requests Tab */}
        <TabsContent value="requests" className="px-4 pb-20">
          <div className="space-y-3">
            {requests.filter(r => r.status === 'pending').map((request) => (
              <motion.div
                key={request.id}
                style={{ x, scale, rotateX, opacity }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(event, info) => handleSwipeEnd(event, info, request)}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Card className="relative overflow-hidden cursor-pointer">
                  {/* Priority Indicator */}
                  <div className={cn("absolute left-0 top-0 bottom-0 w-1", getPriorityColor(request.priority))} />
                  
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={request.customerAvatar} />
                        <AvatarFallback>
                          {request.customerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-sm">{request.customerName}</h3>
                            <p className="text-xs text-gray-600">{request.occasion}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">${request.price}</div>
                            <div className="text-xs text-gray-500">
                              {formatDeadline(request.deadline)}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                          {request.message}
                        </p>
                        
                        {request.specialInstructions && (
                          <Alert className="mb-3 py-2">
                            <AlertDescription className="text-xs">
                              <strong>Special:</strong> {request.specialInstructions}
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {request.attachments && request.attachments.length > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            {request.attachments.map((attachment, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {attachment.type === 'image' && <ImageIcon className="h-3 w-3 mr-1" />}
                                {attachment.type === 'video' && <Video className="h-3 w-3 mr-1" />}
                                {attachment.type === 'text' && <FileText className="h-3 w-3 mr-1" />}
                                {attachment.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* Mobile Actions */}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleDeclineRequest(request.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Swipe Hints */}
                  <motion.div 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600"
                    animate={{ opacity: x.get() > 50 ? 1 : 0 }}
                  >
                    <Check className="h-6 w-6" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-600"
                    animate={{ opacity: x.get() < -50 ? 1 : 0 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                </Card>
                
                {/* Swipe Instructions */}
                <div className="text-xs text-center text-gray-500 mt-1">
                  Swipe right to accept, left to decline
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Quick Actions Tab */}
        <TabsContent value="actions" className="px-4 pb-20">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Card key={action.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3", action.color)}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{action.label}</h3>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={action.action}
                    >
                      Execute
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Voice Recording Widget */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Quick Voice Response
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <Button
                  size="lg"
                  className={cn(
                    "h-16 w-16 rounded-full",
                    isRecording 
                      ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                      : "bg-blue-500 hover:bg-blue-600"
                  )}
                  onClick={isRecording ? stopRecording : () => startRecording('voice')}
                >
                  {isRecording ? (
                    <Square className="h-6 w-6 text-white" />
                  ) : (
                    <Mic className="h-6 w-6 text-white" />
                  )}
                </Button>
              </div>
              
              {isRecording && (
                <div className="text-center">
                  <div className="text-lg font-mono">{formatTime(recordingDuration)}</div>
                  <div className="text-sm text-gray-600">Recording...</div>
                </div>
              )}
              
              <p className="text-sm text-center text-gray-600">
                Tap to {isRecording ? 'stop' : 'start'} voice recording
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="px-4 pb-20">
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>MD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">Marie Dubois</h3>
                    <p className="text-xs text-gray-600">Thank you so much for the video! Perfect!</p>
                  </div>
                  <div className="text-xs text-gray-500">2m</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>JP</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">Jean-Pierre Voltaire</h3>
                    <p className="text-xs text-gray-600">Can you add a few more details about...</p>
                  </div>
                  <div className="text-xs text-gray-500">1h</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Offline Tab */}
        <TabsContent value="offline" className="px-4 pb-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CloudOff className="h-5 w-5" />
                Offline Queue
              </CardTitle>
              <CardDescription>
                Actions saved while offline will sync when connected
              </CardDescription>
            </CardHeader>
            <CardContent>
              {offlineItems.length === 0 ? (
                <div className="text-center py-8">
                  <Cloud className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No offline items</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {offlineItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm capitalize">{item.type}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={item.synced ? "default" : "secondary"}>
                        {item.synced ? "Synced" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Offline Capabilities */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Available Offline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "View Requests", icon: Eye },
                  { label: "Record Videos", icon: Video },
                  { label: "Draft Messages", icon: MessageSquare },
                  { label: "Check Schedule", icon: Calendar }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-center gap-2 p-2">
                      <Icon className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notifications Sheet */}
      <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Notification Settings</SheetTitle>
            <SheetDescription>
              Manage your mobile notifications
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
                <Button
                  variant={value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                >
                  {value ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Request Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedRequest.customerAvatar} />
                  <AvatarFallback>
                    {selectedRequest.customerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedRequest.customerName}</h3>
                  <p className="text-sm text-gray-600">{selectedRequest.occasion}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Message</h4>
                <p className="text-sm text-gray-700">{selectedRequest.message}</p>
              </div>
              
              {selectedRequest.specialInstructions && (
                <div>
                  <h4 className="font-medium mb-2">Special Instructions</h4>
                  <p className="text-sm text-gray-700">{selectedRequest.specialInstructions}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={() => {
                    handleAcceptRequest(selectedRequest.id)
                    setSelectedRequest(null)
                  }}
                >
                  Accept ${selectedRequest.price}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    handleDeclineRequest(selectedRequest.id)
                    setSelectedRequest(null)
                  }}
                >
                  Decline
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}