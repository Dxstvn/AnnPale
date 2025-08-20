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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  MessageSquare,
  Inbox,
  Send,
  Star,
  StarOff,
  Clock,
  Users,
  Search,
  Filter,
  MoreHorizontal,
  MoreVertical,
  Bell,
  BellOff,
  Bookmark,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  Flag,
  Shield,
  Heart,
  Reply,
  Forward,
  Edit,
  Copy,
  Download,
  Upload,
  Paperclip,
  Smile,
  Gif,
  Mic,
  Video,
  Camera,
  Phone,
  MapPin,
  Calendar,
  Timer,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Zap,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Globe,
  Languages,
  Brain,
  Lightbulb,
  Gauge,
  Plus,
  Minus,
  X,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  RefreshCw,
  Settings,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  FileText,
  Link,
  Hash,
  AtSign
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns"

// Types
interface Customer {
  id: string
  name: string
  avatar?: string
  email: string
  joinedDate: Date
  totalBookings: number
  lastInteraction: Date
  location: string
  timezone: string
  preferredLanguage: string
  notes: string
  tags: string[]
  isVip: boolean
  totalSpent: number
  satisfaction: number
  responseRate: number
}

interface Message {
  id: string
  customerId: string
  content: string
  timestamp: Date
  isFromCustomer: boolean
  type: "text" | "image" | "video" | "audio" | "file" | "booking" | "system"
  category: "new_booking" | "active_conversation" | "follow_up" | "thank_you" | "archived"
  priority: "high" | "medium" | "low"
  status: "unread" | "read" | "replied" | "starred" | "snoozed" | "archived"
  sentiment: "positive" | "neutral" | "negative"
  aiSuggestions?: string[]
  attachments?: string[]
  bookingReference?: string
  translatedContent?: string
  responseTime?: number
  qualityScore?: number
}

interface Conversation {
  id: string
  customer: Customer
  messages: Message[]
  lastMessage: Message
  unreadCount: number
  isStarred: boolean
  isPinned: boolean
  tags: string[]
  avgResponseTime: number
  satisfactionScore: number
  totalMessages: number
}

interface MessageCenterArchitectureProps {
  onSendMessage?: (conversationId: string, content: string) => void
  onMarkAsRead?: (messageId: string) => void
  onStarConversation?: (conversationId: string) => void
  onArchiveConversation?: (conversationId: string) => void
  onSnoozeMessage?: (messageId: string, duration: number) => void
  onBlockCustomer?: (customerId: string) => void
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Marie Destine",
    avatar: "👩🏾‍💼",
    email: "marie@example.com",
    joinedDate: new Date("2023-06-15"),
    totalBookings: 8,
    lastInteraction: new Date("2024-01-15T10:30:00"),
    location: "Montreal, Canada",
    timezone: "EST",
    preferredLanguage: "French",
    notes: "VIP customer, prefers personal messages about family celebrations",
    tags: ["VIP", "Repeat Customer", "Family Events"],
    isVip: true,
    totalSpent: 450,
    satisfaction: 4.9,
    responseRate: 0.95
  },
  {
    id: "2",
    name: "Jean Baptiste",
    avatar: "👨🏾‍💻",
    email: "jean@example.com",
    joinedDate: new Date("2023-08-20"),
    totalBookings: 3,
    lastInteraction: new Date("2024-01-14T15:45:00"),
    location: "Port-au-Prince, Haiti",
    timezone: "EST",
    preferredLanguage: "Haitian Creole",
    notes: "Enjoys motivational messages, works in tech",
    tags: ["Professional", "Motivational"],
    isVip: false,
    totalSpent: 180,
    satisfaction: 4.7,
    responseRate: 0.88
  },
  {
    id: "3",
    name: "Sophia Laurent",
    avatar: "👩🏾‍🎨",
    email: "sophia@example.com",
    joinedDate: new Date("2023-11-10"),
    totalBookings: 5,
    lastInteraction: new Date("2024-01-13T09:15:00"),
    location: "Paris, France",
    timezone: "CET",
    preferredLanguage: "French",
    notes: "Artist, appreciates creative and artistic references",
    tags: ["Creative", "Art Lover"],
    isVip: false,
    totalSpent: 275,
    satisfaction: 4.8,
    responseRate: 0.92
  }
]

const mockMessages: Message[] = [
  {
    id: "1",
    customerId: "1",
    content: "Bonjour! I would like to request a birthday message for my daughter's 16th birthday. She's a huge fan and this would mean the world to her! 🎂",
    timestamp: new Date("2024-01-15T10:30:00"),
    isFromCustomer: true,
    type: "text",
    category: "new_booking",
    priority: "high",
    status: "unread",
    sentiment: "positive",
    aiSuggestions: [
      "Accept the booking request warmly",
      "Ask for specific details about the daughter",
      "Mention your excitement to create this special message"
    ],
    responseTime: 0,
    qualityScore: 0
  },
  {
    id: "2",
    customerId: "2",
    content: "Thank you so much for the amazing graduation message! My son was in tears of joy. You truly captured the essence of what this milestone means to our family. Mèsi anpil! 🎓❤️",
    timestamp: new Date("2024-01-14T15:45:00"),
    isFromCustomer: true,
    type: "text",
    category: "thank_you",
    priority: "low",
    status: "read",
    sentiment: "positive",
    responseTime: 120,
    qualityScore: 4.9
  },
  {
    id: "3",
    customerId: "3",
    content: "Hi! I ordered a motivational message last week but haven't received it yet. Could you please check on the status? I'm really excited to see it! 😊",
    timestamp: new Date("2024-01-13T09:15:00"),
    isFromCustomer: true,
    type: "text",
    category: "follow_up",
    priority: "medium",
    status: "starred",
    sentiment: "neutral",
    aiSuggestions: [
      "Apologize for the delay",
      "Provide specific timeline update",
      "Offer compensation if appropriate"
    ],
    responseTime: 0,
    qualityScore: 0
  }
]

const mockConversations: Conversation[] = mockCustomers.map((customer, index) => ({
  id: customer.id,
  customer,
  messages: mockMessages.filter(msg => msg.customerId === customer.id),
  lastMessage: mockMessages.find(msg => msg.customerId === customer.id)!,
  unreadCount: index === 0 ? 1 : 0,
  isStarred: index === 2,
  isPinned: index === 0,
  tags: customer.tags,
  avgResponseTime: 180 + (index * 60),
  satisfactionScore: customer.satisfaction,
  totalMessages: 3 + (index * 2)
}))

export function MessageCenterArchitecture({
  onSendMessage,
  onMarkAsRead,
  onStarConversation,
  onArchiveConversation,
  onSnoozeMessage,
  onBlockCustomer
}: MessageCenterArchitectureProps) {
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(mockConversations[0])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [selectedPriority, setSelectedPriority] = React.useState<string>("all")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all")
  const [messageContent, setMessageContent] = React.useState("")
  const [showTemplates, setShowTemplates] = React.useState(false)
  const [showTranslation, setShowTranslation] = React.useState(false)
  const [showSentiment, setShowSentiment] = React.useState(true)
  const [showAiSuggestions, setShowAiSuggestions] = React.useState(true)
  const [bulkSelectMode, setBulkSelectMode] = React.useState(false)
  const [selectedMessages, setSelectedMessages] = React.useState<Set<string>>(new Set())
  const [isRecording, setIsRecording] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<"list" | "cards">("list")

  // Filter conversations
  const filteredConversations = React.useMemo(() => {
    let filtered = [...mockConversations]

    if (searchQuery) {
      filtered = filtered.filter(conv =>
        conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(conv => conv.lastMessage.category === selectedCategory)
    }

    if (selectedPriority !== "all") {
      filtered = filtered.filter(conv => conv.lastMessage.priority === selectedPriority)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(conv => conv.lastMessage.status === selectedStatus)
    }

    // Sort by priority and timestamp
    filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.lastMessage.priority as keyof typeof priorityOrder]
      const bPriority = priorityOrder[b.lastMessage.priority as keyof typeof priorityOrder]
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      
      return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedPriority, selectedStatus])

  // Get category counts
  const categoryCounts = React.useMemo(() => {
    const counts = {
      all: mockConversations.length,
      new_booking: 0,
      active_conversation: 0,
      follow_up: 0,
      thank_you: 0,
      archived: 0
    }

    mockConversations.forEach(conv => {
      counts[conv.lastMessage.category]++
    })

    return counts
  }, [])

  // Handle message send
  const handleSendMessage = () => {
    if (!messageContent.trim() || !selectedConversation) return

    const newMessage: Message = {
      id: Date.now().toString(),
      customerId: selectedConversation.customer.id,
      content: messageContent,
      timestamp: new Date(),
      isFromCustomer: false,
      type: "text",
      category: "active_conversation",
      priority: "medium",
      status: "read",
      sentiment: "neutral",
      responseTime: 0,
      qualityScore: 0
    }

    onSendMessage?.(selectedConversation.id, messageContent)
    setMessageContent("")
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on ${selectedMessages.size} messages`)
    setSelectedMessages(new Set())
    setBulkSelectMode(false)
  }

  // Format message time
  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, "HH:mm")
    } else if (isYesterday(date)) {
      return "Yesterday"
    } else {
      return format(date, "MMM d")
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "new_booking": return "bg-red-500"
      case "active_conversation": return "bg-blue-500"
      case "follow_up": return "bg-yellow-500"
      case "thank_you": return "bg-green-500"
      case "archived": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar - Inbox */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold">Message Center</h1>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setBulkSelectMode(!bulkSelectMode)}
                      className={bulkSelectMode ? "bg-blue-100 text-blue-600" : ""}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bulk select mode</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive All Read
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="whitespace-nowrap"
              >
                All ({categoryCounts.all})
              </Button>
              <Button
                variant={selectedCategory === "new_booking" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("new_booking")}
                className="whitespace-nowrap"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                New ({categoryCounts.new_booking})
              </Button>
              <Button
                variant={selectedCategory === "active_conversation" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("active_conversation")}
                className="whitespace-nowrap"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
                Active ({categoryCounts.active_conversation})
              </Button>
              <Button
                variant={selectedCategory === "follow_up" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("follow_up")}
                className="whitespace-nowrap"
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
                Follow-up ({categoryCounts.follow_up})
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="starred">Starred</SelectItem>
                  <SelectItem value="snoozed">Snoozed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === "list" ? "cards" : "list")}
              >
                {viewMode === "list" ? <BarChart3 className="h-4 w-4" /> : <Inbox className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          <AnimatePresence>
            {bulkSelectMode && selectedMessages.size > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedMessages.size} selected
                  </span>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("read")}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("star")}>
                      <Star className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("archive")}>
                      <Archive className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("delete")}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              <AnimatePresence>
                {filteredConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-3 rounded-lg mb-2 cursor-pointer transition-all relative",
                      "hover:bg-gray-50 dark:hover:bg-gray-700",
                      selectedConversation?.id === conversation.id && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200",
                      conversation.unreadCount > 0 && "bg-blue-25 border-l-4 border-l-blue-500"
                    )}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    {bulkSelectMode && (
                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          checked={selectedMessages.has(conversation.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedMessages)
                            if (e.target.checked) {
                              newSelected.add(conversation.id)
                            } else {
                              newSelected.delete(conversation.id)
                            }
                            setSelectedMessages(newSelected)
                          }}
                          className="rounded"
                        />
                      </div>
                    )}

                    <div className={cn(
                      "flex items-start gap-3",
                      bulkSelectMode && "ml-6"
                    )}>
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.customer.avatar} />
                          <AvatarFallback>{conversation.customer.avatar}</AvatarFallback>
                        </Avatar>
                        {conversation.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-3 h-3 rounded-full",
                          getCategoryColor(conversation.lastMessage.category)
                        )} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm truncate">
                              {conversation.customer.name}
                            </h3>
                            {conversation.customer.isVip && (
                              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                VIP
                              </Badge>
                            )}
                            {conversation.isStarred && (
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            )}
                            {conversation.isPinned && (
                              <Flag className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={cn("text-xs", getPriorityColor(conversation.lastMessage.priority))}
                          >
                            {conversation.lastMessage.priority}
                          </Badge>
                          {showSentiment && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                conversation.lastMessage.sentiment === "positive" ? "bg-green-100 text-green-800" :
                                conversation.lastMessage.sentiment === "negative" ? "bg-red-100 text-red-800" :
                                "bg-gray-100 text-gray-800"
                              )}
                            >
                              {conversation.lastMessage.sentiment === "positive" ? "😊" :
                               conversation.lastMessage.sentiment === "negative" ? "😔" : "😐"}
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                          {conversation.lastMessage.content}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {conversation.avgResponseTime}m avg
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {conversation.satisfactionScore}★
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {conversation.totalMessages}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content - Conversation View */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.customer.avatar} />
                      <AvatarFallback>{selectedConversation.customer.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold">{selectedConversation.customer.name}</h2>
                        {selectedConversation.customer.isVip && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            VIP
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Customer since {format(selectedConversation.customer.joinedDate, "MMM yyyy")}</span>
                        <span>•</span>
                        <span>{selectedConversation.customer.totalBookings} bookings</span>
                        <span>•</span>
                        <span>Last seen {formatDistanceToNow(selectedConversation.customer.lastInteraction)} ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onStarConversation?.(selectedConversation.id)}
                          className={selectedConversation.isStarred ? "text-yellow-500" : ""}
                        >
                          {selectedConversation.isStarred ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{selectedConversation.isStarred ? "Unstar" : "Star"} conversation</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Call customer</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Video className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Video call</p>
                      </TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Notes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Call
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Shield className="h-4 w-4 mr-2" />
                          Block Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Customer Info Quick Stats */}
                <div className="flex items-center gap-6 mt-3 pt-3 border-t">
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{selectedConversation.customer.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{selectedConversation.customer.preferredLanguage}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Timer className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Avg response: {selectedConversation.avgResponseTime}m</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Heart className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{selectedConversation.satisfactionScore}★ satisfaction</span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 flex">
                {/* Message Thread */}
                <div className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedConversation.messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={cn(
                            "flex gap-3",
                            message.isFromCustomer ? "justify-start" : "justify-end"
                          )}
                        >
                          {message.isFromCustomer && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={selectedConversation.customer.avatar} />
                              <AvatarFallback>{selectedConversation.customer.avatar}</AvatarFallback>
                            </Avatar>
                          )}

                          <div className={cn(
                            "max-w-lg p-3 rounded-lg",
                            message.isFromCustomer 
                              ? "bg-gray-100 dark:bg-gray-700" 
                              : "bg-blue-500 text-white ml-auto"
                          )}>
                            <p className="text-sm">{message.content}</p>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                <Paperclip className="h-4 w-4" />
                                <span className="text-xs">
                                  {message.attachments.length} attachment(s)
                                </span>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-70">
                                {format(message.timestamp, "HH:mm")}
                              </span>
                              
                              {message.isFromCustomer && showSentiment && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    message.sentiment === "positive" ? "bg-green-100 text-green-800" :
                                    message.sentiment === "negative" ? "bg-red-100 text-red-800" :
                                    "bg-gray-100 text-gray-800"
                                  )}
                                >
                                  {message.sentiment === "positive" ? "😊" :
                                   message.sentiment === "negative" ? "😔" : "😐"}
                                </Badge>
                              )}
                            </div>

                            {/* AI Suggestions */}
                            {message.isFromCustomer && message.aiSuggestions && showAiSuggestions && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-2 mb-2">
                                  <Brain className="h-4 w-4 text-purple-500" />
                                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                    AI Suggestions
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {message.aiSuggestions.map((suggestion, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => setMessageContent(suggestion)}
                                      className="block w-full text-left text-xs p-2 bg-purple-50 dark:bg-purple-900/20 rounded hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                                    >
                                      {suggestion}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {!message.isFromCustomer && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>👩🏾‍🎤</AvatarFallback>
                            </Avatar>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Compose Area */}
                  <div className="p-4 border-t bg-white dark:bg-gray-800">
                    {/* Quick Actions Bar */}
                    <div className="flex items-center gap-2 mb-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTemplates(!showTemplates)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Templates
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTranslation(!showTranslation)}
                      >
                        <Languages className="h-4 w-4 mr-1" />
                        Translate
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSentiment(!showSentiment)}
                        className={showSentiment ? "bg-blue-100 text-blue-600" : ""}
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        Sentiment
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAiSuggestions(!showAiSuggestions)}
                        className={showAiSuggestions ? "bg-purple-100 text-purple-600" : ""}
                      >
                        <Lightbulb className="h-4 w-4 mr-1" />
                        AI Help
                      </Button>

                      <div className="ml-auto flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setIsRecording(!isRecording)}
                          className={isRecording ? "bg-red-100 text-red-600" : ""}
                        >
                          {isRecording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon">
                          <Camera className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Templates Panel */}
                    <AnimatePresence>
                      {showTemplates && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMessageContent("Thank you for your message! I'll create something special for you.")}
                            >
                              Thank you
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMessageContent("I'm excited to work on your request! Let me get some more details.")}
                            >
                              Excited to help
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMessageContent("Your video is ready! I hope you love it as much as I enjoyed creating it.")}
                            >
                              Video ready
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMessageContent("I apologize for the delay. Let me prioritize your request.")}
                            >
                              Apologize delay
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Message Input */}
                    <div className="flex items-end gap-2">
                      <div className="flex-1 relative">
                        <Textarea
                          placeholder="Type your message..."
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          className="min-h-[60px] pr-12 resize-none"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-2 right-2"
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageContent.trim()}
                        className="shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Quality Indicators */}
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          Response time: 2m
                        </span>
                        <span className="flex items-center gap-1">
                          <Gauge className="h-3 w-3" />
                          Quality score: 4.8★
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Auto-save enabled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Context Sidebar */}
                <div className="w-80 border-l bg-gray-50 dark:bg-gray-800">
                  <div className="p-4">
                    <Tabs defaultValue="profile" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="profile" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Customer Info</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-center">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={selectedConversation.customer.avatar} />
                                <AvatarFallback className="text-2xl">
                                  {selectedConversation.customer.avatar}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            
                            <div className="text-center">
                              <h3 className="font-medium">{selectedConversation.customer.name}</h3>
                              <p className="text-sm text-gray-500">{selectedConversation.customer.email}</p>
                            </div>

                            <Separator />

                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Joined:</span>
                                <span>{format(selectedConversation.customer.joinedDate, "MMM d, yyyy")}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Location:</span>
                                <span>{selectedConversation.customer.location}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Language:</span>
                                <span>{selectedConversation.customer.preferredLanguage}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Total Spent:</span>
                                <span>${selectedConversation.customer.totalSpent}</span>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-gray-500">TAGS</Label>
                              <div className="flex flex-wrap gap-1">
                                {selectedConversation.customer.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Performance</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Satisfaction</span>
                                <span>{selectedConversation.customer.satisfaction}★</span>
                              </div>
                              <Progress value={selectedConversation.customer.satisfaction * 20} />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Response Rate</span>
                                <span>{Math.round(selectedConversation.customer.responseRate * 100)}%</span>
                              </div>
                              <Progress value={selectedConversation.customer.responseRate * 100} />
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="history" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Recent Orders</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3 p-2 bg-white dark:bg-gray-700 rounded">
                                <div className="text-2xl">🎂</div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">Birthday Message</p>
                                  <p className="text-xs text-gray-500">Jan 10, 2024 • $45</p>
                                  <Badge variant="outline" className="text-xs mt-1">Delivered</Badge>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-2 bg-white dark:bg-gray-700 rounded">
                                <div className="text-2xl">🎓</div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">Graduation Message</p>
                                  <p className="text-xs text-gray-500">Dec 15, 2023 • $50</p>
                                  <Badge variant="outline" className="text-xs mt-1">Delivered</Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="notes" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Customer Notes</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Textarea
                              placeholder="Add notes about this customer..."
                              value={selectedConversation.customer.notes}
                              className="min-h-[120px]"
                              readOnly
                            />
                            <Button size="sm" className="mt-2 w-full">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit Notes
                            </Button>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Flag className="h-4 w-4 text-red-500" />
                              Red Flags
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center py-4">
                              <Shield className="h-8 w-8 mx-auto text-green-500 mb-2" />
                              <p className="text-sm text-gray-500">No red flags detected</p>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}