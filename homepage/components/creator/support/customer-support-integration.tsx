"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  HelpCircle,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Star,
  Tag,
  TrendingUp,
  User,
  Users,
  Zap,
  AlertTriangle,
  ArrowUp,
  BookOpen,
  Paperclip,
  Share2,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ChevronRight,
  Info,
  Video,
  FileQuestion,
  MessageCircle,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { format, formatDistanceToNow, addHours, differenceInHours } from "date-fns"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"

// Support ticket categories and priorities
export interface TicketCategory {
  id: string
  name: string
  priority: "urgent" | "high" | "medium" | "low"
  sla: number // in hours
  escalation: string
  resolutionPath: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export const ticketCategories: TicketCategory[] = [
  {
    id: "technical",
    name: "Technical Issue",
    priority: "high",
    sla: 2,
    escalation: "Immediate",
    resolutionPath: "Tech support",
    icon: AlertCircle,
    color: "bg-red-500"
  },
  {
    id: "booking",
    name: "Booking Problem",
    priority: "high",
    sla: 4,
    escalation: "If unresolved",
    resolutionPath: "Refund/redo",
    icon: AlertTriangle,
    color: "bg-orange-500"
  },
  {
    id: "general",
    name: "General Question",
    priority: "medium",
    sla: 24,
    escalation: "After 48 hours",
    resolutionPath: "FAQ/guide",
    icon: HelpCircle,
    color: "bg-blue-500"
  },
  {
    id: "feedback",
    name: "Feedback",
    priority: "low",
    sla: 48,
    escalation: "Not needed",
    resolutionPath: "Acknowledge",
    icon: MessageSquare,
    color: "bg-green-500"
  },
  {
    id: "complaint",
    name: "Complaint",
    priority: "urgent",
    sla: 1,
    escalation: "Manager",
    resolutionPath: "Resolution offer",
    icon: AlertTriangle,
    color: "bg-purple-500"
  }
]

// Ticket status types
export type TicketStatus = "new" | "triaged" | "assigned" | "in_progress" | "resolved" | "closed"

// Support ticket interface
export interface SupportTicket {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerAvatar?: string
  category: string
  priority: "urgent" | "high" | "medium" | "low"
  status: TicketStatus
  subject: string
  description: string
  attachments: string[]
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  slaDeadline: Date
  messages: TicketMessage[]
  internalNotes: string[]
  tags: string[]
  satisfaction?: number
}

// Ticket message interface
export interface TicketMessage {
  id: string
  ticketId: string
  senderId: string
  senderName: string
  senderType: "customer" | "support" | "creator"
  message: string
  attachments?: string[]
  timestamp: Date
}

// Knowledge base article interface
export interface KnowledgeArticle {
  id: string
  title: string
  category: string
  content: string
  views: number
  helpful: number
  notHelpful: number
  tags: string[]
  videoUrl?: string
  lastUpdated: Date
}

// Sample tickets data
const sampleTickets: SupportTicket[] = [
  {
    id: "1",
    customerId: "cust1",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    customerAvatar: "/avatars/john.jpg",
    category: "technical",
    priority: "high",
    status: "in_progress",
    subject: "Video message not playing",
    description: "I received a video message but it won't play on my device. I've tried different browsers.",
    attachments: [],
    assignedTo: "Tech Support Team",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    slaDeadline: addHours(new Date(Date.now() - 2 * 60 * 60 * 1000), 2),
    messages: [
      {
        id: "m1",
        ticketId: "1",
        senderId: "support1",
        senderName: "Tech Support",
        senderType: "support",
        message: "Hi John, I understand you're having trouble playing your video message. Can you tell me what device and browser you're using?",
        timestamp: new Date(Date.now() - 90 * 60 * 1000)
      },
      {
        id: "m2",
        ticketId: "1",
        senderId: "cust1",
        senderName: "John Smith",
        senderType: "customer",
        message: "I'm using Chrome on Windows 11. The video just shows a black screen with a loading spinner.",
        timestamp: new Date(Date.now() - 60 * 60 * 1000)
      }
    ],
    internalNotes: ["Customer is a premium subscriber", "Similar issue reported by 3 other users today"],
    tags: ["video-playback", "chrome", "windows"],
    satisfaction: undefined
  },
  {
    id: "2",
    customerId: "cust2",
    customerName: "Marie Joseph",
    customerEmail: "marie@example.com",
    customerAvatar: "/placeholder-user.jpg",
    category: "booking",
    priority: "high",
    status: "assigned",
    subject: "Wrong date for birthday message",
    description: "I booked a birthday message for next week but the creator sent it today instead.",
    attachments: ["booking-confirmation.pdf"],
    assignedTo: "Customer Success",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    slaDeadline: addHours(new Date(Date.now() - 5 * 60 * 60 * 1000), 4),
    messages: [
      {
        id: "m3",
        ticketId: "2",
        senderId: "support2",
        senderName: "Customer Success",
        senderType: "support",
        message: "Hi Marie, I'm so sorry about this mix-up. Let me look into this right away and get it resolved for you.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ],
    internalNotes: ["Booking ID: #12345", "Creator has been notified"],
    tags: ["booking-error", "date-issue"],
    satisfaction: undefined
  },
  {
    id: "3",
    customerId: "cust3",
    customerName: "Pierre Louis",
    customerEmail: "pierre@example.com",
    category: "complaint",
    priority: "urgent",
    status: "new",
    subject: "Very disappointed with video quality",
    description: "The video message I received was very poor quality and the creator seemed unprepared.",
    attachments: [],
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    slaDeadline: addHours(new Date(Date.now() - 30 * 60 * 1000), 1),
    messages: [],
    internalNotes: [],
    tags: ["quality-issue", "complaint"],
    satisfaction: undefined
  }
]

// Sample knowledge base articles
const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "kb1",
    title: "How to Book a Video Message",
    category: "Getting Started",
    content: "Step-by-step guide on booking your first video message...",
    views: 1234,
    helpful: 892,
    notHelpful: 23,
    tags: ["booking", "tutorial", "getting-started"],
    videoUrl: "https://example.com/tutorial1.mp4",
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: "kb2",
    title: "Video Playback Issues - Troubleshooting",
    category: "Technical Support",
    content: "Common solutions for video playback problems...",
    views: 567,
    helpful: 423,
    notHelpful: 12,
    tags: ["video", "playback", "troubleshooting"],
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "kb3",
    title: "Refund and Cancellation Policy",
    category: "Policies",
    content: "Our refund and cancellation policies explained...",
    views: 890,
    helpful: 234,
    notHelpful: 45,
    tags: ["refund", "cancellation", "policy"],
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  }
]

// Canned responses
const cannedResponses = [
  {
    id: "cr1",
    title: "Greeting - Technical Issue",
    content: "Hi {name}, thank you for reaching out. I understand you're experiencing a technical issue. Let me help you resolve this quickly."
  },
  {
    id: "cr2",
    title: "Booking Issue - Apology",
    content: "Hi {name}, I sincerely apologize for the issue with your booking. This isn't the experience we want you to have. Let me make this right for you."
  },
  {
    id: "cr3",
    title: "Request More Information",
    content: "To better assist you, could you please provide: 1) Your booking reference number, 2) The creator's name, 3) The date of your booking"
  },
  {
    id: "cr4",
    title: "Resolution - Refund Approved",
    content: "Good news! Your refund has been approved and will be processed within 3-5 business days. You'll receive an email confirmation shortly."
  }
]

// Support metrics data
const supportMetrics = {
  totalTickets: 156,
  openTickets: 23,
  avgResponseTime: 3.2,
  avgResolutionTime: 8.5,
  satisfactionScore: 4.6,
  firstContactResolution: 82
}

const ticketTrends = [
  { day: "Mon", new: 23, resolved: 21, escalated: 2 },
  { day: "Tue", new: 28, resolved: 25, escalated: 3 },
  { day: "Wed", new: 19, resolved: 22, escalated: 1 },
  { day: "Thu", new: 31, resolved: 28, escalated: 4 },
  { day: "Fri", new: 35, resolved: 33, escalated: 2 },
  { day: "Sat", new: 15, resolved: 14, escalated: 1 },
  { day: "Sun", new: 12, resolved: 13, escalated: 0 }
]

const categoryDistribution = [
  { name: "Technical", value: 35, color: "#ef4444" },
  { name: "Booking", value: 28, color: "#f97316" },
  { name: "General", value: 20, color: "#3b82f6" },
  { name: "Feedback", value: 12, color: "#10b981" },
  { name: "Complaint", value: 5, color: "#8b5cf6" }
]

// Ticket card component
function TicketCard({ 
  ticket, 
  onSelect 
}: { 
  ticket: SupportTicket
  onSelect: (ticket: SupportTicket) => void 
}) {
  const category = ticketCategories.find(c => c.id === ticket.category)
  const priorityColors = {
    urgent: "bg-red-100 text-red-700 border-red-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    medium: "bg-blue-100 text-blue-700 border-blue-200",
    low: "bg-gray-100 text-gray-700 border-gray-200"
  }
  
  const statusColors = {
    new: "bg-purple-100 text-purple-700",
    triaged: "bg-indigo-100 text-indigo-700",
    assigned: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-700"
  }

  const timeUntilSLA = differenceInHours(ticket.slaDeadline, new Date())
  const isOverdue = timeUntilSLA < 0
  const isNearSLA = timeUntilSLA <= 1 && timeUntilSLA > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onSelect(ticket)}
      className="cursor-pointer"
    >
      <Card className={cn(
        "hover:shadow-lg transition-all border-l-4",
        priorityColors[ticket.priority]
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {category && (
                <div className={cn("p-1.5 rounded text-white", category.color)}>
                  <category.icon className="h-3 w-3" />
                </div>
              )}
              <Badge className={statusColors[ticket.status]}>
                {ticket.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className="text-xs">
                #{ticket.id}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
              {isNearSLA && !isOverdue && (
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                  Due soon
                </Badge>
              )}
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <h3 className="font-medium text-sm mb-1">{ticket.subject}</h3>
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">{ticket.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={ticket.customerAvatar} />
                <AvatarFallback className="text-xs">
                  {ticket.customerName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600">{ticket.customerName}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {ticket.messages.length}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Ticket detail view component
function TicketDetail({ 
  ticket,
  onClose,
  onResolve
}: { 
  ticket: SupportTicket
  onClose: () => void
  onResolve: (ticketId: string) => void
}) {
  const [newMessage, setNewMessage] = React.useState("")
  const [selectedCannedResponse, setSelectedCannedResponse] = React.useState("")
  const category = ticketCategories.find(c => c.id === ticket.category)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, would send message
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleUseCannedResponse = (response: string) => {
    setNewMessage(response.replace('{name}', ticket.customerName.split(' ')[0]))
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-semibold">{ticket.subject}</h2>
              <Badge variant="outline">#{ticket.id}</Badge>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {ticket.customerName}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
              </div>
              {ticket.assignedTo && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {ticket.assignedTo}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue={ticket.status}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="triaged">Triaged</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onResolve(ticket.id)}
            >
              Mark Resolved
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Original ticket */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={ticket.customerAvatar} />
                <AvatarFallback>
                  {ticket.customerName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{ticket.customerName}</span>
                  <span className="text-xs text-gray-500">
                    {format(ticket.createdAt, 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-sm">{ticket.description}</p>
                {ticket.attachments.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    {ticket.attachments.map((file, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        <Paperclip className="h-3 w-3 mr-1" />
                        {file}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          {ticket.messages.map((message) => (
            <div 
              key={message.id}
              className={cn(
                "p-4 rounded-lg",
                message.senderType === "customer" 
                  ? "bg-blue-50 ml-8" 
                  : "bg-white border mr-8"
              )}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={cn(
                    "text-xs",
                    message.senderType === "support" && "bg-green-100",
                    message.senderType === "creator" && "bg-purple-100"
                  )}>
                    {message.senderName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{message.senderName}</span>
                    <span className="text-xs text-gray-500">
                      {format(message.timestamp, 'h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Reply section */}
      <div className="border-t p-4 space-y-3">
        {/* Canned responses */}
        <div className="flex items-center gap-2">
          <Select value={selectedCannedResponse} onValueChange={(value) => {
            setSelectedCannedResponse(value)
            const response = cannedResponses.find(r => r.id === value)
            if (response) {
              handleUseCannedResponse(response.content)
            }
          }}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Use canned response..." />
            </SelectTrigger>
            <SelectContent>
              {cannedResponses.map(response => (
                <SelectItem key={response.id} value={response.id}>
                  {response.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Paperclip className="h-4 w-4 mr-1" />
            Attach
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share Screen
          </Button>
        </div>

        {/* Message input */}
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your response..."
            className="min-h-[80px]"
          />
          <Button onClick={handleSendMessage} className="px-8">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

// Knowledge base component
function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")

  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Getting Started">Getting Started</SelectItem>
            <SelectItem value="Technical Support">Technical Support</SelectItem>
            <SelectItem value="Policies">Policies</SelectItem>
            <SelectItem value="Billing">Billing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{article.title}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {article.category}
                  </CardDescription>
                </div>
                {article.videoUrl && (
                  <Badge variant="outline" className="text-xs">
                    <Video className="h-3 w-3 mr-1" />
                    Video
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-2">{article.content}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span>{article.views} views</span>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {article.helpful}
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsDown className="h-3 w-3" />
                    {article.notHelpful}
                  </div>
                </div>
                <ExternalLink className="h-3 w-3" />
              </div>

              <div className="flex flex-wrap gap-1">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Main customer support integration component
export function CustomerSupportIntegration() {
  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicket | null>(null)
  const [tickets, setTickets] = React.useState<SupportTicket[]>(sampleTickets)
  const [selectedTab, setSelectedTab] = React.useState("tickets")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [priorityFilter, setPriorityFilter] = React.useState("all")

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    return matchesStatus && matchesPriority
  })

  const handleResolveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: "resolved" as TicketStatus, resolvedAt: new Date() }
        : ticket
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Support</h1>
          <p className="text-gray-600">Manage support tickets and customer inquiries</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Metrics overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Tickets</p>
                <p className="text-xl font-bold">{supportMetrics.totalTickets}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Open Tickets</p>
                <p className="text-xl font-bold text-orange-600">{supportMetrics.openTickets}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-300" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Avg Response</p>
                <p className="text-xl font-bold">{supportMetrics.avgResponseTime}h</p>
              </div>
              <Clock className="h-8 w-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Resolution Time</p>
                <p className="text-xl font-bold">{supportMetrics.avgResolutionTime}h</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Satisfaction</p>
                <p className="text-xl font-bold">{supportMetrics.satisfactionScore}/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">First Contact</p>
                <p className="text-xl font-bold">{supportMetrics.firstContactResolution}%</p>
              </div>
              <Zap className="h-8 w-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets list */}
            <div className="lg:col-span-1 space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="All Priority" />
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

              {/* Tickets */}
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {filteredTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onSelect={setSelectedTicket}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Ticket detail */}
            <div className="lg:col-span-2">
              {selectedTicket ? (
                <Card className="h-[650px]">
                  <TicketDetail
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    onResolve={handleResolveTicket}
                  />
                </Card>
              ) : (
                <Card className="h-[650px] flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Select a ticket to view details</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <KnowledgeBase />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Ticket trends */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Trends</CardTitle>
              <CardDescription>Daily ticket activity over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={ticketTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="new" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                  <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10b981" fill="#10b981" />
                  <Area type="monotone" dataKey="escalated" stackId="1" stroke="#ef4444" fill="#ef4444" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tickets by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SLA Performance</CardTitle>
                <CardDescription>Tickets meeting SLA targets by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticketCategories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-gray-500">{category.sla}h SLA</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={cn("h-2 rounded-full", category.color)}
                          style={{ width: `${Math.random() * 30 + 70}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Settings</CardTitle>
              <CardDescription>Configure support ticket settings and workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">SLA Configuration</h3>
                {ticketCategories.map((category) => (
                  <div key={category.id} className="grid grid-cols-4 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1 rounded text-white", category.color)}>
                        <category.icon className="h-3 w-3" />
                      </div>
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <Select defaultValue={category.priority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      type="number" 
                      defaultValue={category.sla} 
                      className="w-20"
                    />
                    <span className="text-sm text-gray-500">hours</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Auto-Response Settings</h3>
                <div className="space-y-2">
                  <Label className="text-sm">New Ticket Auto-Reply</Label>
                  <Textarea 
                    defaultValue="Thank you for contacting support. We've received your request and will respond within our SLA timeframe."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}