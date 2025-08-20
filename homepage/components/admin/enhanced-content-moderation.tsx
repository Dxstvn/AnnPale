"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Flag,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Video,
  Image as ImageIcon,
  FileText,
  Shield,
  Ban,
  Clock,
  TrendingUp,
  User,
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Info,
  Zap,
  Activity,
  BarChart3,
  Award,
  Target,
  AlertCircle,
  Bot,
  Users,
  Gavel,
  BookOpen,
  CheckSquare,
  X
} from "lucide-react"

interface QueueItem {
  id: string
  type: "video" | "image" | "text" | "review" | "profile" | "message"
  priority: "urgent" | "high" | "medium" | "low"
  source: "automated" | "user_report" | "quality_check" | "appeal" | "escalated"
  title: string
  creator: {
    id: string
    name: string
    avatar: string
    verificationStatus: string
  }
  content: {
    url?: string
    text?: string
    thumbnail?: string
    duration?: string
    transcript?: string
  }
  flags: {
    reason: string
    confidence: number
    details: string[]
  }
  reportedBy?: string
  reportCount: number
  timestamp: string
  sla: {
    hours: number
    remaining: number
  }
  status: "pending" | "in_review" | "approved" | "rejected" | "escalated"
  previousDecisions?: Array<{
    action: string
    moderator: string
    timestamp: string
    reason: string
  }>
}

interface ModerationDecision {
  action: "approve" | "reject" | "escalate" | "warn"
  policyViolations: string[]
  severity: "low" | "medium" | "high" | "critical"
  customReason?: string
  userNotification?: string
  appealRights?: boolean
  duration?: number // For temporary actions
}

interface ModeratorStats {
  todayReviewed: number
  todayAccuracy: number
  weeklyReviewed: number
  weeklyAccuracy: number
  averageReviewTime: number
  consistencyScore: number
  overturnedDecisions: number
  escalations: number
}

const mockQueueItems: QueueItem[] = [
  {
    id: "1",
    type: "video",
    priority: "urgent",
    source: "automated",
    title: "Birthday Celebration Message",
    creator: {
      id: "creator-001",
      name: "Marie-Claire Dubois",
      avatar: "/placeholder-avatar.jpg",
      verificationStatus: "verified"
    },
    content: {
      url: "/sample-video.mp4",
      thumbnail: "/video-thumbnail.jpg",
      duration: "2:45",
      transcript: "Happy birthday to you..."
    },
    flags: {
      reason: "Potential copyright music",
      confidence: 78,
      details: ["Background music detected", "Similarity to copyrighted content: 78%"]
    },
    reportCount: 0,
    timestamp: "10 minutes ago",
    sla: {
      hours: 24,
      remaining: 23.8
    },
    status: "pending"
  },
  {
    id: "2",
    type: "profile",
    priority: "high",
    source: "user_report",
    title: "Profile Information Update",
    creator: {
      id: "creator-002",
      name: "Jean Baptiste",
      avatar: "/placeholder-avatar.jpg",
      verificationStatus: "pending"
    },
    content: {
      text: "Professional musician and entertainer..."
    },
    flags: {
      reason: "Misleading credentials",
      confidence: 65,
      details: ["Unverified claims", "Reported by 3 users"]
    },
    reportedBy: "user-456",
    reportCount: 3,
    timestamp: "1 hour ago",
    sla: {
      hours: 12,
      remaining: 11
    },
    status: "pending"
  },
  {
    id: "3",
    type: "message",
    priority: "medium",
    source: "user_report",
    title: "Direct Message Report",
    creator: {
      id: "creator-003",
      name: "Sophie Laurent",
      avatar: "/placeholder-avatar.jpg",
      verificationStatus: "verified"
    },
    content: {
      text: "Inappropriate message content..."
    },
    flags: {
      reason: "Inappropriate content",
      confidence: 92,
      details: ["Contains prohibited language", "Policy violation detected"]
    },
    reportedBy: "user-789",
    reportCount: 1,
    timestamp: "3 hours ago",
    sla: {
      hours: 6,
      remaining: 3
    },
    status: "in_review"
  }
]

const policyViolations = [
  "Inappropriate content",
  "Copyright infringement",
  "Misleading information",
  "Harassment or bullying",
  "Spam or scam",
  "Privacy violation",
  "Hate speech",
  "Violence or threats",
  "Sexual content",
  "Self-harm content",
  "Dangerous activities",
  "Impersonation"
]

export function EnhancedContentModeration() {
  const [selectedQueue, setSelectedQueue] = useState<"priority" | "automated" | "reports" | "quality" | "appeals" | "escalated">("priority")
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [decision, setDecision] = useState<ModerationDecision>({
    action: "approve",
    policyViolations: [],
    severity: "low",
    appealRights: true
  })
  const [bulkSelection, setBulkSelection] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const moderatorStats: ModeratorStats = {
    todayReviewed: 45,
    todayAccuracy: 94.5,
    weeklyReviewed: 312,
    weeklyAccuracy: 93.2,
    averageReviewTime: 2.3,
    consistencyScore: 88,
    overturnedDecisions: 3,
    escalations: 7
  }

  const getQueueCount = (queue: string) => {
    switch (queue) {
      case "priority": return 12
      case "automated": return 45
      case "reports": return 23
      case "quality": return 8
      case "appeals": return 5
      case "escalated": return 3
      default: return 0
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "automated": return <Bot className="h-4 w-4" />
      case "user_report": return <Flag className="h-4 w-4" />
      case "quality_check": return <CheckSquare className="h-4 w-4" />
      case "appeal": return <Gavel className="h-4 w-4" />
      case "escalated": return <TrendingUp className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const handleReview = (item: QueueItem) => {
    setSelectedItem(item)
    setIsReviewDialogOpen(true)
  }

  const handleDecisionSubmit = () => {
    // Submit decision logic
    console.log("Decision submitted:", decision)
    setIsReviewDialogOpen(false)
    setSelectedItem(null)
    setDecision({
      action: "approve",
      policyViolations: [],
      severity: "low",
      appealRights: true
    })
  }

  const handleBulkAction = (action: string) => {
    console.log("Bulk action:", action, "on items:", bulkSelection)
    setBulkSelection([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Moderation Dashboard</h2>
          <p className="text-gray-600">Review and moderate platform content</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Queue
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Reviews</p>
                <p className="text-2xl font-bold">{moderatorStats.todayReviewed}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {moderatorStats.todayAccuracy}% accuracy
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Review Time</p>
                <p className="text-2xl font-bold">{moderatorStats.averageReviewTime}m</p>
                <p className="text-xs text-gray-500 mt-1">Per item</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Consistency Score</p>
                <p className="text-2xl font-bold">{moderatorStats.consistencyScore}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {moderatorStats.overturnedDecisions} overturned
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Escalations</p>
                <p className="text-2xl font-bold">{moderatorStats.escalations}</p>
                <p className="text-xs text-gray-500 mt-1">This week</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Queue Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Review Queues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedQueue === "priority" ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => setSelectedQueue("priority")}
              >
                <span className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Priority Queue
                </span>
                <Badge variant="destructive">{getQueueCount("priority")}</Badge>
              </Button>
              <Button
                variant={selectedQueue === "automated" ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => setSelectedQueue("automated")}
              >
                <span className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Automated Flags
                </span>
                <Badge>{getQueueCount("automated")}</Badge>
              </Button>
              <Button
                variant={selectedQueue === "reports" ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => setSelectedQueue("reports")}
              >
                <span className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  User Reports
                </span>
                <Badge>{getQueueCount("reports")}</Badge>
              </Button>
              <Button
                variant={selectedQueue === "quality" ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => setSelectedQueue("quality")}
              >
                <span className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Quality Checks
                </span>
                <Badge>{getQueueCount("quality")}</Badge>
              </Button>
              <Button
                variant={selectedQueue === "appeals" ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => setSelectedQueue("appeals")}
              >
                <span className="flex items-center gap-2">
                  <Gavel className="h-4 w-4" />
                  Appeal Reviews
                </span>
                <Badge>{getQueueCount("appeals")}</Badge>
              </Button>
              <Button
                variant={selectedQueue === "escalated" ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => setSelectedQueue("escalated")}
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Escalated
                </span>
                <Badge variant="outline">{getQueueCount("escalated")}</Badge>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Filters */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Quick Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Content Type</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="profile">Profiles</SelectItem>
                    <SelectItem value="message">Messages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority Level</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Time Range</Label>
                <Select defaultValue="24h">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last Hour</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Queue Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedQueue === "priority" && "Priority Queue"}
                  {selectedQueue === "automated" && "Automated Flags"}
                  {selectedQueue === "reports" && "User Reports"}
                  {selectedQueue === "quality" && "Quality Checks"}
                  {selectedQueue === "appeals" && "Appeal Reviews"}
                  {selectedQueue === "escalated" && "Escalated Decisions"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search queue..."
                      className="pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {bulkSelection.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {bulkSelection.length} selected
                      </span>
                      <Button size="sm" onClick={() => handleBulkAction("approve")}>
                        Approve All
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleBulkAction("reject")}>
                        Reject All
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockQueueItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Checkbox 
                          checked={bulkSelection.includes(item.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBulkSelection([...bulkSelection, item.id])
                            } else {
                              setBulkSelection(bulkSelection.filter(id => id !== item.id))
                            }
                          }}
                        />
                        <Avatar>
                          <AvatarImage src={item.creator.avatar} />
                          <AvatarFallback>
                            {item.creator.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getSourceIcon(item.source)}
                              {item.source.replace('_', ' ')}
                            </Badge>
                            {item.type === "video" && <Video className="h-4 w-4 text-gray-400" />}
                            {item.type === "image" && <ImageIcon className="h-4 w-4 text-gray-400" />}
                            {item.type === "text" && <FileText className="h-4 w-4 text-gray-400" />}
                            {item.type === "message" && <MessageSquare className="h-4 w-4 text-gray-400" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Creator: {item.creator.name} • {item.timestamp}
                          </p>
                          <div className="bg-red-50 p-3 rounded-lg mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-red-800">
                                {item.flags.reason}
                              </span>
                              <Badge className="bg-red-100 text-red-800">
                                {item.flags.confidence}% confidence
                              </Badge>
                            </div>
                            <ul className="text-xs text-red-700 space-y-1">
                              {item.flags.details.map((detail, idx) => (
                                <li key={idx}>• {detail}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              SLA: {item.sla.remaining}h remaining
                            </span>
                            {item.reportCount > 0 && (
                              <span className="flex items-center gap-1">
                                <Flag className="h-3 w-3" />
                                {item.reportCount} reports
                              </span>
                            )}
                            <Badge variant={item.status === "pending" ? "outline" : "secondary"}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => handleReview(item)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Review</DialogTitle>
            <DialogDescription>
              Review the content and make a moderation decision
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              {/* Content Preview */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Content Preview</h3>
                {selectedItem.type === "video" && (
                  <div className="space-y-3">
                    <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                      <Button size="sm" variant="outline">
                        <Volume2 className="h-4 w-4 mr-1" />
                        Audio
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Transcript
                      </Button>
                    </div>
                  </div>
                )}
                {selectedItem.type === "text" && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm">{selectedItem.content.text}</p>
                  </div>
                )}
              </div>

              {/* Analysis Tools */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Analysis Tools</h3>
                <Tabs defaultValue="metadata">
                  <TabsList>
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    <TabsTrigger value="context">Context</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="policy">Policy Reference</TabsTrigger>
                  </TabsList>
                  <TabsContent value="metadata" className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Creator:</span> {selectedItem.creator.name}
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span> {selectedItem.type}
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span> {selectedItem.timestamp}
                      </div>
                      <div>
                        <span className="text-gray-600">Reports:</span> {selectedItem.reportCount}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="context">
                    <p className="text-sm text-gray-600">
                      Creator verification status: {selectedItem.creator.verificationStatus}
                    </p>
                  </TabsContent>
                  <TabsContent value="history">
                    <p className="text-sm text-gray-600">No previous violations</p>
                  </TabsContent>
                  <TabsContent value="policy">
                    <div className="space-y-2">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Review content against platform community guidelines
                        </AlertDescription>
                      </Alert>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Decision Interface */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-medium">Moderation Decision</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Action</Label>
                    <Select 
                      value={decision.action} 
                      onValueChange={(value: any) => setDecision({...decision, action: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approve">Approve</SelectItem>
                        <SelectItem value="reject">Reject</SelectItem>
                        <SelectItem value="escalate">Escalate</SelectItem>
                        <SelectItem value="warn">Warn Creator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Severity</Label>
                    <Select 
                      value={decision.severity}
                      onValueChange={(value: any) => setDecision({...decision, severity: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {decision.action !== "approve" && (
                  <>
                    <div>
                      <Label>Policy Violations</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {policyViolations.map((violation) => (
                          <div key={violation} className="flex items-center space-x-2">
                            <Checkbox 
                              checked={decision.policyViolations.includes(violation)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDecision({
                                    ...decision,
                                    policyViolations: [...decision.policyViolations, violation]
                                  })
                                } else {
                                  setDecision({
                                    ...decision,
                                    policyViolations: decision.policyViolations.filter(v => v !== violation)
                                  })
                                }
                              }}
                            />
                            <Label className="text-sm font-normal cursor-pointer">
                              {violation}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Custom Reason</Label>
                      <Textarea 
                        placeholder="Provide additional context for the decision..."
                        value={decision.customReason || ""}
                        onChange={(e) => setDecision({...decision, customReason: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label>User Notification</Label>
                      <Textarea 
                        placeholder="Message to be sent to the creator..."
                        value={decision.userNotification || ""}
                        onChange={(e) => setDecision({...decision, userNotification: e.target.value})}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        checked={decision.appealRights}
                        onCheckedChange={(checked) => setDecision({...decision, appealRights: !!checked})}
                      />
                      <Label>Allow appeal for this decision</Label>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDecisionSubmit}>
              Submit Decision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}