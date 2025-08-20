"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Mail,
  MessageSquare,
  Send,
  Bell,
  Users,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Megaphone,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Volume2,
  VolumeX,
  Target,
  Zap,
  FileText,
  Image,
  Video,
  Globe,
  Smartphone,
  Monitor
} from "lucide-react"

interface Message {
  id: string
  type: "email" | "notification" | "announcement" | "sms"
  title: string
  content: string
  recipients: "all" | "customers" | "creators" | "specific"
  recipientCount: number
  specificRecipients?: string[]
  status: "draft" | "scheduled" | "sent" | "delivered" | "failed"
  sentBy: string
  sentAt?: string
  scheduledFor?: string
  priority: "low" | "medium" | "high" | "urgent"
  template?: string
  attachments?: Array<{name: string, size: string, type: string}>
  deliveryStats?: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    failed: number
  }
}

interface NotificationTemplate {
  id: string
  name: string
  type: "email" | "notification" | "sms"
  subject: string
  content: string
  variables: string[]
  category: "account" | "payment" | "security" | "marketing" | "system"
  isActive: boolean
}

const mockMessages: Message[] = [
  {
    id: "MSG001",
    type: "email",
    title: "Platform Maintenance Notice",
    content: "We will be performing scheduled maintenance on January 20th from 2-4 AM EST. During this time, the platform may be temporarily unavailable.",
    recipients: "all",
    recipientCount: 15420,
    status: "scheduled",
    sentBy: "System Admin",
    scheduledFor: "2024-01-20T02:00:00",
    priority: "high",
    template: "maintenance_notice"
  },
  {
    id: "MSG002",
    type: "notification",
    title: "New Creator Verification Process",
    content: "We've updated our creator verification process to make it faster and more secure. Check out the new requirements in your dashboard.",
    recipients: "creators",
    recipientCount: 2341,
    status: "sent",
    sentBy: "Content Team",
    sentAt: "2024-01-15T10:30:00",
    priority: "medium",
    deliveryStats: {
      sent: 2341,
      delivered: 2338,
      opened: 1456,
      clicked: 234,
      failed: 3
    }
  },
  {
    id: "MSG003",
    type: "email",
    title: "Payment Processing Update",
    content: "Important update regarding payment processing changes effective February 1st, 2024.",
    recipients: "specific",
    recipientCount: 156,
    specificRecipients: ["USR001", "USR002", "CRT001"],
    status: "delivered",
    sentBy: "Finance Team",
    sentAt: "2024-01-14T15:20:00",
    priority: "urgent",
    deliveryStats: {
      sent: 156,
      delivered: 156,
      opened: 89,
      clicked: 23,
      failed: 0
    }
  },
  {
    id: "MSG004",
    type: "announcement",
    title: "Welcome New Users!",
    content: "Welcome to Ann Pale! Here's everything you need to know to get started with our platform.",
    recipients: "customers",
    recipientCount: 523,
    status: "draft",
    sentBy: "Marketing Team",
    priority: "low"
  }
]

const mockTemplates: NotificationTemplate[] = [
  {
    id: "TPL001",
    name: "Welcome Email",
    type: "email",
    subject: "Welcome to Ann Pale, {{user_name}}!",
    content: "Hi {{user_name}},\n\nWelcome to Ann Pale! We're excited to have you join our community...",
    variables: ["user_name", "verification_link"],
    category: "account",
    isActive: true
  },
  {
    id: "TPL002",
    name: "Payment Confirmation",
    type: "email",
    subject: "Payment Received - Order #{{order_id}}",
    content: "Thank you for your payment of ${{amount}} for order #{{order_id}}...",
    variables: ["order_id", "amount", "user_name"],
    category: "payment",
    isActive: true
  },
  {
    id: "TPL003",
    name: "Security Alert",
    type: "notification",
    subject: "Security Alert: {{alert_type}}",
    content: "We detected {{alert_type}} on your account. If this wasn't you, please secure your account immediately.",
    variables: ["alert_type", "ip_address", "location"],
    category: "security",
    isActive: true
  }
]

const getMessageIcon = (type: Message["type"]) => {
  switch (type) {
    case "email": return Mail
    case "notification": return Bell
    case "announcement": return Megaphone
    case "sms": return MessageSquare
    default: return Mail
  }
}

const getStatusColor = (status: Message["status"]) => {
  switch (status) {
    case "draft": return "bg-gray-100 text-gray-800"
    case "scheduled": return "bg-blue-100 text-blue-800"
    case "sent": return "bg-green-100 text-green-800"
    case "delivered": return "bg-green-100 text-green-800"
    case "failed": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: Message["priority"]) => {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-800"
    case "high": return "bg-orange-100 text-orange-800"
    case "medium": return "bg-yellow-100 text-yellow-800"
    case "low": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export function CommunicationTools() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [templates, setTemplates] = useState<NotificationTemplate[]>(mockTemplates)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Compose message state
  const [composeType, setComposeType] = useState<Message["type"]>("email")
  const [composeTitle, setComposeTitle] = useState("")
  const [composeContent, setComposeContent] = useState("")
  const [composeRecipients, setComposeRecipients] = useState<Message["recipients"]>("all")
  const [composePriority, setComposePriority] = useState<Message["priority"]>("medium")
  const [composeScheduled, setComposeScheduled] = useState(false)
  const [composeScheduleDate, setComposeScheduleDate] = useState("")

  const handleSendMessage = () => {
    const newMessage: Message = {
      id: `MSG${String(messages.length + 1).padStart(3, "0")}`,
      type: composeType,
      title: composeTitle,
      content: composeContent,
      recipients: composeRecipients,
      recipientCount: composeRecipients === "all" ? 15420 : composeRecipients === "creators" ? 2341 : 523,
      status: composeScheduled ? "scheduled" : "sent",
      sentBy: "Current Admin",
      sentAt: composeScheduled ? undefined : new Date().toISOString(),
      scheduledFor: composeScheduled ? composeScheduleDate : undefined,
      priority: composePriority
    }

    setMessages(prev => [newMessage, ...prev])
    setIsComposeOpen(false)
    
    // Reset form
    setComposeTitle("")
    setComposeContent("")
    setComposeRecipients("all")
    setComposePriority("medium")
    setComposeScheduled(false)
    setComposeScheduleDate("")
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || message.status === filterStatus
    const matchesType = filterType === "all" || message.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: messages.length,
    draft: messages.filter(m => m.status === "draft").length,
    scheduled: messages.filter(m => m.status === "scheduled").length,
    sent: messages.filter(m => m.status === "sent" || m.status === "delivered").length,
    totalRecipients: messages.reduce((sum, m) => sum + (m.status !== "draft" ? m.recipientCount : 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
              <Edit className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">{stats.totalRecipients.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages">Messages & Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Communication Center</CardTitle>
                  <CardDescription>Send messages, notifications, and announcements to users</CardDescription>
                </div>
                <Button onClick={() => setIsComposeOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Compose Message
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {/* Messages Table */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Message</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => {
                      const MessageIcon = getMessageIcon(message.type)
                      return (
                        <TableRow key={message.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-gray-100">
                                <MessageIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">{message.title}</p>
                                <p className="text-sm text-muted-foreground truncate max-w-xs">
                                  {message.content}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{message.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="capitalize">{message.recipients}</p>
                              <p className="text-muted-foreground">{message.recipientCount.toLocaleString()} users</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(message.status)}>
                              {message.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(message.priority)}>
                              {message.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {message.sentAt && (
                                <p>{new Date(message.sentAt).toLocaleDateString()}</p>
                              )}
                              {message.scheduledFor && (
                                <p className="text-blue-600">
                                  Scheduled: {new Date(message.scheduledFor).toLocaleDateString()}
                                </p>
                              )}
                              <p className="text-muted-foreground">by {message.sentBy}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedMessage(message)
                                  setIsDetailsOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {message.status === "draft" && (
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Message Templates</CardTitle>
                  <CardDescription>Manage reusable message templates</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="outline">{template.type}</Badge>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={template.isActive} />
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                    <p className="text-sm text-muted-foreground truncate">{template.content}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-muted-foreground">Variables:</span>
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Rate</p>
                    <p className="text-2xl font-bold">98.5%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Rate</p>
                    <p className="text-2xl font-bold">65.2%</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Click Rate</p>
                    <p className="text-2xl font-bold">12.8%</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Bounce Rate</p>
                    <p className="text-2xl font-bold">1.5%</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Compose Message Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
            <DialogDescription>
              Create and send a message to users
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Message Type</Label>
                <Select value={composeType} onValueChange={(value: Message["type"]) => setComposeType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="notification">In-App Notification</SelectItem>
                    <SelectItem value="announcement">Platform Announcement</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Recipients</Label>
                <Select value={composeRecipients} onValueChange={(value: Message["recipients"]) => setComposeRecipients(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="customers">Customers Only</SelectItem>
                    <SelectItem value="creators">Creators Only</SelectItem>
                    <SelectItem value="specific">Specific Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Subject/Title</Label>
              <Input
                value={composeTitle}
                onChange={(e) => setComposeTitle(e.target.value)}
                placeholder="Enter message title or subject"
              />
            </div>

            <div>
              <Label>Message Content</Label>
              <Textarea
                value={composeContent}
                onChange={(e) => setComposeContent(e.target.value)}
                placeholder="Enter your message content..."
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Select value={composePriority} onValueChange={(value: Message["priority"]) => setComposePriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch 
                  checked={composeScheduled} 
                  onCheckedChange={setComposeScheduled}
                />
                <Label>Schedule for later</Label>
              </div>
            </div>

            {composeScheduled && (
              <div>
                <Label>Schedule Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={composeScheduleDate}
                  onChange={(e) => setComposeScheduleDate(e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              {composeScheduled ? "Schedule Message" : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Complete information about this message
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6">
              {/* Message Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 rounded-lg bg-white">
                  {(() => {
                    const MessageIcon = getMessageIcon(selectedMessage.type)
                    return <MessageIcon className="h-6 w-6" />
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedMessage.title}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(selectedMessage.status)}>
                      {selectedMessage.status}
                    </Badge>
                    <Badge className={getPriorityColor(selectedMessage.priority)}>
                      {selectedMessage.priority}
                    </Badge>
                    <Badge variant="outline">{selectedMessage.type}</Badge>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <Label className="text-base font-medium">Message Content</Label>
                <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>

              {/* Recipients */}
              <div>
                <Label className="text-base font-medium">Recipients</Label>
                <div className="mt-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">{selectedMessage.recipients}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMessage.recipientCount.toLocaleString()} users
                      </p>
                    </div>
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Delivery Statistics */}
              {selectedMessage.deliveryStats && (
                <div>
                  <Label className="text-base font-medium">Delivery Statistics</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Sent</p>
                      <p className="text-xl font-bold">{selectedMessage.deliveryStats.sent.toLocaleString()}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Delivered</p>
                      <p className="text-xl font-bold">{selectedMessage.deliveryStats.delivered.toLocaleString()}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Opened</p>
                      <p className="text-xl font-bold">{selectedMessage.deliveryStats.opened.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {((selectedMessage.deliveryStats.opened / selectedMessage.deliveryStats.sent) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Clicked</p>
                      <p className="text-xl font-bold">{selectedMessage.deliveryStats.clicked.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {((selectedMessage.deliveryStats.clicked / selectedMessage.deliveryStats.opened) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Timing */}
              <div>
                <Label className="text-base font-medium">Timing Information</Label>
                <div className="mt-2 p-4 border rounded-lg">
                  <div className="space-y-2">
                    {selectedMessage.sentAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sent:</span>
                        <span className="text-sm">{new Date(selectedMessage.sentAt).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedMessage.scheduledFor && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Scheduled:</span>
                        <span className="text-sm">{new Date(selectedMessage.scheduledFor).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sent by:</span>
                      <span className="text-sm">{selectedMessage.sentBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}