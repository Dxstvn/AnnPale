"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MessageSquare,
  Send,
  Clock,
  Users,
  Star,
  AlertTriangle,
  CheckCircle,
  Heart,
  Smile,
  Mic,
  Video,
  Paperclip,
  Search,
  Filter,
  Settings,
  Bell,
  BellOff,
  Copy,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
  X,
  Mail,
  MessageCircle,
  Phone,
  Headphones,
  Archive,
  Flag,
  Shield,
  Eye,
  EyeOff,
  Calendar,
  Timer,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Upload,
  RefreshCw,
  MoreHorizontal,
  PlayCircle,
  PauseCircle,
  Volume2,
  Image as ImageIcon,
  FileText,
  Link,
  Hash,
  AtSign,
  Globe,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Types
type MessageType = "new_request" | "clarification" | "thank_you" | "complaint" | "follow_up"
type MessagePriority = "urgent" | "high" | "medium" | "low"
type MessageStatus = "unread" | "read" | "replied" | "archived"

interface Message {
  id: string
  type: MessageType
  priority: MessagePriority
  status: MessageStatus
  subject: string
  content: string
  customerName: string
  customerAvatar?: string
  timestamp: string
  responseTime?: string
  requestId?: string
  attachments?: Attachment[]
  isAutoResponse?: boolean
}

interface Attachment {
  id: string
  name: string
  type: "image" | "video" | "audio" | "document"
  size: string
  url: string
}

interface QuickResponse {
  id: string
  title: string
  content: string
  category: MessageType
  usageCount: number
}

interface BulkMessage {
  id: string
  title: string
  content: string
  recipients: "all" | "active" | "new" | "inactive"
  scheduledFor?: string
  sentAt?: string
  status: "draft" | "scheduled" | "sent"
}

interface BoundarySettings {
  officeHours: {
    enabled: boolean
    start: string
    end: string
    timezone: string
  }
  autoResponses: {
    enabled: boolean
    message: string
    afterHours: boolean
    weekends: boolean
  }
  messageFiltering: {
    profanityFilter: boolean
    spamDetection: boolean
    requireApproval: boolean
  }
  blockList: string[]
}

interface EnhancedCommunicationCenterProps {
  messages?: Message[]
  quickResponses?: QuickResponse[]
  bulkMessages?: BulkMessage[]
  boundarySettings?: BoundarySettings
  onSendMessage?: (messageId: string, reply: string) => void
  onUpdateSettings?: (settings: BoundarySettings) => void
  onCreateTemplate?: (template: QuickResponse) => void
  className?: string
}

// Mock data generators
const generateMockMessages = (): Message[] => {
  const types: MessageType[] = ["new_request", "clarification", "thank_you", "complaint", "follow_up"]
  const priorities: MessagePriority[] = ["urgent", "high", "medium", "low"]
  const statuses: MessageStatus[] = ["unread", "read", "replied", "archived"]
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `msg-${i}`,
    type: types[i % types.length],
    priority: i < 3 ? "urgent" : priorities[i % priorities.length],
    status: statuses[i % statuses.length],
    subject: [
      "New video request for birthday",
      "Question about delivery time",
      "Thank you for amazing video!",
      "Request not as expected",
      "When will my video be ready?"
    ][i % 5],
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    customerName: `Customer ${i + 1}`,
    customerAvatar: undefined,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    responseTime: i % 2 === 0 ? `${(i % 24) + 1}h ${(i * 15) % 60}m` : undefined,
    requestId: i % 3 === 0 ? `req-${i}` : undefined
  }))
}

const generateMockQuickResponses = (): QuickResponse[] => {
  return [
    {
      id: "qr-1",
      title: "Request Received",
      content: "Thank you for your video request! I'll get started on this right away and you can expect your personalized video within 48 hours.",
      category: "new_request",
      usageCount: 45
    },
    {
      id: "qr-2", 
      title: "Need More Info",
      content: "Hi! I'd love to make this video perfect for you. Could you provide a bit more detail about [specific question]?",
      category: "clarification",
      usageCount: 32
    },
    {
      id: "qr-3",
      title: "Thank You Response",
      content: "You're so welcome! It was my pleasure to create that video for you. Thank you for the kind words! ❤️",
      category: "thank_you", 
      usageCount: 78
    },
    {
      id: "qr-4",
      title: "Apology & Resolution",
      content: "I sincerely apologize that the video didn't meet your expectations. Let me make this right - I'll create a new video at no charge.",
      category: "complaint",
      usageCount: 12
    },
    {
      id: "qr-5",
      title: "Follow-up Status",
      content: "Your video is in progress and will be ready within the next 24 hours. I'll send you a notification as soon as it's complete!",
      category: "follow_up",
      usageCount: 38
    }
  ]
}

// Message priority configuration
const messagePriorityConfig = {
  urgent: { color: "red", responseTime: "<1 hour", icon: AlertTriangle },
  high: { color: "orange", responseTime: "<3 hours", icon: Clock },
  medium: { color: "blue", responseTime: "<24 hours", icon: MessageCircle },
  low: { color: "gray", responseTime: "Optional", icon: Mail }
}

// Message type configuration
const messageTypeConfig = {
  new_request: { 
    label: "New Request", 
    color: "green", 
    icon: MessageSquare,
    autoResponse: true,
    template: true
  },
  clarification: { 
    label: "Clarification", 
    color: "blue", 
    icon: MessageCircle,
    autoResponse: false,
    template: true
  },
  thank_you: { 
    label: "Thank You", 
    color: "pink", 
    icon: Heart,
    autoResponse: true,
    template: true
  },
  complaint: { 
    label: "Complaint", 
    color: "red", 
    icon: AlertTriangle,
    autoResponse: false,
    template: true
  },
  follow_up: { 
    label: "Follow-up", 
    color: "purple", 
    icon: RefreshCw,
    autoResponse: true,
    template: true
  }
}

// Message list component
const MessageList = ({ 
  messages, 
  selectedMessage, 
  onSelectMessage,
  filters 
}: {
  messages: Message[]
  selectedMessage?: Message
  onSelectMessage: (message: Message) => void
  filters: { status: string; type: string; priority: string }
}) => {
  // Filter messages based on criteria
  const filteredMessages = React.useMemo(() => {
    return messages.filter(message => {
      if (filters.status !== "all" && message.status !== filters.status) return false
      if (filters.type !== "all" && message.type !== filters.type) return false
      if (filters.priority !== "all" && message.priority !== filters.priority) return false
      return true
    })
  }, [messages, filters])

  // Sort by priority and timestamp
  const sortedMessages = React.useMemo(() => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
    return [...filteredMessages].sort((a, b) => {
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
  }, [filteredMessages])

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-2 p-2">
        {sortedMessages.map((message) => {
          const typeConfig = messageTypeConfig[message.type]
          const priorityConfig = messagePriorityConfig[message.priority]
          const isSelected = selectedMessage?.id === message.id
          const isUnread = message.status === "unread"

          return (
            <motion.div
              key={message.id}
              layout
              onClick={() => onSelectMessage(message)}
              className={cn(
                "p-4 border rounded-lg cursor-pointer transition-all",
                isSelected && "ring-2 ring-purple-600 bg-purple-50 dark:bg-purple-900/20",
                isUnread && "bg-blue-50 dark:bg-blue-900/20 border-blue-200",
                !isSelected && !isUnread && "hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isUnread ? "bg-blue-500" : "bg-gray-300"
                  )} />
                  <Badge variant="outline" className={`text-${typeConfig.color}-600`}>
                    {typeConfig.label}
                  </Badge>
                  <Badge variant="outline" className={`text-${priorityConfig.color}-600`}>
                    {message.priority}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {message.customerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                  {message.customerAvatar && (
                    <AvatarImage src={message.customerAvatar} />
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium truncate",
                    isUnread && "font-semibold"
                  )}>
                    {message.subject}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {message.customerName}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {message.content}
              </p>
              
              {message.responseTime && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Response: {message.responseTime}</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

// Message detail view component
const MessageDetailView = ({ 
  message, 
  quickResponses,
  onSendReply,
  onUseTemplate 
}: {
  message: Message
  quickResponses: QuickResponse[]
  onSendReply: (reply: string) => void
  onUseTemplate: (template: QuickResponse) => void
}) => {
  const [replyText, setReplyText] = React.useState("")
  const [showTemplates, setShowTemplates] = React.useState(false)
  
  const typeConfig = messageTypeConfig[message.type]
  const priorityConfig = messagePriorityConfig[message.priority]
  
  // Filter templates for current message type
  const relevantTemplates = quickResponses.filter(template => 
    template.category === message.type
  )
  
  const handleSendReply = () => {
    if (replyText.trim()) {
      onSendReply(replyText)
      setReplyText("")
    }
  }
  
  const handleUseTemplate = (template: QuickResponse) => {
    setReplyText(template.content)
    setShowTemplates(false)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Message Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {message.customerName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
              {message.customerAvatar && (
                <AvatarImage src={message.customerAvatar} />
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold">{message.customerName}</h3>
              <p className="text-sm text-gray-600">
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`bg-${typeConfig.color}-100 text-${typeConfig.color}-800`}>
              {typeConfig.label}
            </Badge>
            <Badge className={`bg-${priorityConfig.color}-100 text-${priorityConfig.color}-800`}>
              {message.priority}
            </Badge>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-2">{message.subject}</h2>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <priorityConfig.icon className="w-4 h-4" />
            <span>Response needed: {priorityConfig.responseTime}</span>
          </div>
          {message.requestId && (
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>Request: {message.requestId}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Message Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-2">Attachments</h4>
            <div className="space-y-2">
              {message.attachments.map(attachment => (
                <div key={attachment.id} className="flex items-center gap-3 p-2 bg-white dark:bg-gray-700 rounded">
                  <Paperclip className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{attachment.name}</span>
                  <span className="text-xs text-gray-500">({attachment.size})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      
      {/* Reply Section */}
      <div className="p-4 border-t">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-medium">Reply</h4>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Templates
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add emoji</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Attach file</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Templates dropdown */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="space-y-2">
                {relevantTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => handleUseTemplate(template)}
                    className="p-2 bg-white dark:bg-gray-700 rounded cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{template.title}</span>
                      <span className="text-xs text-gray-500">Used {template.usageCount}x</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{template.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="space-y-3">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            className="min-h-[100px]"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Mic className="w-4 h-4 mr-1" />
                Voice Note
              </Button>
              <Button variant="outline" size="sm">
                <Video className="w-4 h-4 mr-1" />
                Video Reply
              </Button>
            </div>
            
            <Button onClick={handleSendReply} disabled={!replyText.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Send Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Quick responses management component
const QuickResponsesManager = ({
  responses,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate
}: {
  responses: QuickResponse[]
  onCreateTemplate: (template: Omit<QuickResponse, 'id' | 'usageCount'>) => void
  onEditTemplate: (id: string, template: Partial<QuickResponse>) => void
  onDeleteTemplate: (id: string) => void
}) => {
  const [showCreateForm, setShowCreateForm] = React.useState(false)
  const [editingTemplate, setEditingTemplate] = React.useState<QuickResponse | null>(null)
  
  // Group responses by category
  const groupedResponses = React.useMemo(() => {
    const groups: Record<MessageType, QuickResponse[]> = {
      new_request: [],
      clarification: [],
      thank_you: [],
      complaint: [],
      follow_up: []
    }
    
    responses.forEach(response => {
      groups[response.category].push(response)
    })
    
    return groups
  }, [responses])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Quick Response Templates</h3>
          <p className="text-sm text-gray-600">
            Manage your saved message templates for faster replies
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>
      
      {Object.entries(groupedResponses).map(([type, templates]) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(messageTypeConfig[type as MessageType].icon, { 
                className: "w-5 h-5" 
              })}
              {messageTypeConfig[type as MessageType].label}
              <Badge variant="outline">{templates.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templates.map(template => (
                <div key={template.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{template.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Used {template.usageCount}x
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTemplate(template)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTemplate(template.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {template.content}
                  </p>
                </div>
              ))}
              
              {templates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No templates for this category</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Create/Edit Template Dialog would go here */}
    </div>
  )
}

// Boundary settings component
const BoundarySettingsPanel = ({
  settings,
  onUpdateSettings
}: {
  settings: BoundarySettings
  onUpdateSettings: (settings: BoundarySettings) => void
}) => {
  const handleSettingChange = (key: string, value: any) => {
    onUpdateSettings({
      ...settings,
      [key]: value
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Communication Boundaries</h3>
        <p className="text-sm text-gray-600">
          Set limits and automation to maintain work-life balance
        </p>
      </div>
      
      {/* Office Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Office Hours
          </CardTitle>
          <CardDescription>
            Define when you're available for communication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable office hours</p>
              <p className="text-sm text-gray-600">
                Auto-respond outside business hours
              </p>
            </div>
            <Switch
              checked={settings.officeHours.enabled}
              onCheckedChange={(enabled) => 
                handleSettingChange('officeHours', { ...settings.officeHours, enabled })
              }
            />
          </div>
          
          {settings.officeHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <input
                  type="time"
                  value={settings.officeHours.start}
                  onChange={(e) => 
                    handleSettingChange('officeHours', { 
                      ...settings.officeHours, 
                      start: e.target.value 
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Time</label>
                <input
                  type="time"
                  value={settings.officeHours.end}
                  onChange={(e) => 
                    handleSettingChange('officeHours', { 
                      ...settings.officeHours, 
                      end: e.target.value 
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Auto Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Auto Responses
          </CardTitle>
          <CardDescription>
            Automatic replies to manage expectations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable auto responses</p>
              <p className="text-sm text-gray-600">
                Send automatic replies to certain message types
              </p>
            </div>
            <Switch
              checked={settings.autoResponses.enabled}
              onCheckedChange={(enabled) => 
                handleSettingChange('autoResponses', { ...settings.autoResponses, enabled })
              }
            />
          </div>
          
          {settings.autoResponses.enabled && (
            <>
              <div>
                <label className="text-sm font-medium">Auto response message</label>
                <Textarea
                  value={settings.autoResponses.message}
                  onChange={(e) => 
                    handleSettingChange('autoResponses', { 
                      ...settings.autoResponses, 
                      message: e.target.value 
                    })
                  }
                  placeholder="Thank you for your message! I'll get back to you within..."
                  className="mt-1"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">After hours auto-reply</span>
                  <Switch
                    checked={settings.autoResponses.afterHours}
                    onCheckedChange={(afterHours) => 
                      handleSettingChange('autoResponses', { 
                        ...settings.autoResponses, 
                        afterHours 
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Weekend auto-reply</span>
                  <Switch
                    checked={settings.autoResponses.weekends}
                    onCheckedChange={(weekends) => 
                      handleSettingChange('autoResponses', { 
                        ...settings.autoResponses, 
                        weekends 
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Message Filtering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Message Filtering
          </CardTitle>
          <CardDescription>
            Protect yourself from inappropriate content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Profanity filter</p>
                <p className="text-sm text-gray-600">Block messages with inappropriate language</p>
              </div>
              <Switch
                checked={settings.messageFiltering.profanityFilter}
                onCheckedChange={(profanityFilter) => 
                  handleSettingChange('messageFiltering', { 
                    ...settings.messageFiltering, 
                    profanityFilter 
                  })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Spam detection</p>
                <p className="text-sm text-gray-600">Automatically filter potential spam</p>
              </div>
              <Switch
                checked={settings.messageFiltering.spamDetection}
                onCheckedChange={(spamDetection) => 
                  handleSettingChange('messageFiltering', { 
                    ...settings.messageFiltering, 
                    spamDetection 
                  })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require approval</p>
                <p className="text-sm text-gray-600">Review all messages before they reach you</p>
              </div>
              <Switch
                checked={settings.messageFiltering.requireApproval}
                onCheckedChange={(requireApproval) => 
                  handleSettingChange('messageFiltering', { 
                    ...settings.messageFiltering, 
                    requireApproval 
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main component
export function EnhancedCommunicationCenter({
  messages = generateMockMessages(),
  quickResponses = generateMockQuickResponses(),
  bulkMessages = [],
  boundarySettings = {
    officeHours: {
      enabled: true,
      start: "09:00",
      end: "17:00",
      timezone: "America/New_York"
    },
    autoResponses: {
      enabled: true,
      message: "Thank you for your message! I typically respond within 24 hours during business days.",
      afterHours: true,
      weekends: true
    },
    messageFiltering: {
      profanityFilter: true,
      spamDetection: true,
      requireApproval: false
    },
    blockList: []
  },
  onSendMessage,
  onUpdateSettings,
  onCreateTemplate,
  className
}: EnhancedCommunicationCenterProps) {
  const [activeTab, setActiveTab] = React.useState("inbox")
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filters, setFilters] = React.useState({
    status: "all",
    type: "all", 
    priority: "all"
  })
  
  // Statistics
  const stats = React.useMemo(() => {
    const unreadCount = messages.filter(m => m.status === "unread").length
    const urgentCount = messages.filter(m => m.priority === "urgent").length
    const todayCount = messages.filter(m => 
      new Date(m.timestamp).toDateString() === new Date().toDateString()
    ).length
    
    return { unreadCount, urgentCount, todayCount }
  }, [messages])
  
  const handleSendReply = (reply: string) => {
    if (selectedMessage && onSendMessage) {
      onSendMessage(selectedMessage.id, reply)
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Communication Center</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer messages and communication settings
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {stats.unreadCount} unread
          </Badge>
          {stats.urgentCount > 0 && (
            <Badge variant="destructive">
              {stats.urgentCount} urgent
            </Badge>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Messages</p>
                <p className="text-2xl font-bold">{stats.todayCount}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-blue-600">{stats.unreadCount}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgentCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-green-600">2.5h</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Bulk Messages
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        {/* Inbox Tab */}
        <TabsContent value="inbox" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Messages</CardTitle>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Filters */}
                  <div className="p-4 border-b space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm">
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={filters.status} onValueChange={(value) => 
                        setFilters(prev => ({ ...prev, status: value }))
                      }>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="unread">Unread</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="replied">Replied</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={filters.type} onValueChange={(value) => 
                        setFilters(prev => ({ ...prev, type: value }))
                      }>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="new_request">Requests</SelectItem>
                          <SelectItem value="clarification">Questions</SelectItem>
                          <SelectItem value="thank_you">Thanks</SelectItem>
                          <SelectItem value="complaint">Complaints</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={filters.priority} onValueChange={(value) => 
                        setFilters(prev => ({ ...prev, priority: value }))
                      }>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <MessageList
                    messages={messages}
                    selectedMessage={selectedMessage}
                    onSelectMessage={setSelectedMessage}
                    filters={filters}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Message Detail */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                {selectedMessage ? (
                  <MessageDetailView
                    message={selectedMessage}
                    quickResponses={quickResponses}
                    onSendReply={handleSendReply}
                    onUseTemplate={(template) => console.log("Use template:", template)}
                  />
                ) : (
                  <CardContent className="flex items-center justify-center h-[600px]">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Select a message to view
                      </h3>
                      <p className="text-sm text-gray-500">
                        Choose a message from the list to read and reply
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <QuickResponsesManager
            responses={quickResponses}
            onCreateTemplate={onCreateTemplate || (() => {})}
            onEditTemplate={(id, template) => console.log("Edit template:", id, template)}
            onDeleteTemplate={(id) => console.log("Delete template:", id)}
          />
        </TabsContent>
        
        {/* Bulk Messages Tab */}
        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Messaging</CardTitle>
              <CardDescription>
                Send messages to multiple customers at once
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Bulk messaging coming soon
              </h3>
              <p className="text-sm text-gray-500">
                Send announcements and updates to all your customers
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <BoundarySettingsPanel
            settings={boundarySettings}
            onUpdateSettings={onUpdateSettings || (() => {})}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}