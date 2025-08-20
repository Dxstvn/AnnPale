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
  ChevronRight
} from "lucide-react"

interface FlaggedContent {
  id: string
  type: "video" | "image" | "text" | "review"
  title: string
  creator: {
    name: string
    id: string
    avatar?: string
  }
  reporter?: {
    name: string
    id: string
    reason: string
  }
  flagReason: string[]
  severity: "low" | "medium" | "high" | "critical"
  status: "pending" | "reviewing" | "approved" | "rejected" | "escalated"
  flaggedAt: string
  reviewedBy?: string
  reviewedAt?: string
  contentUrl?: string
  thumbnail?: string
  description?: string
  violationHistory: number
}

const mockFlaggedContent: FlaggedContent[] = [
  {
    id: "FL001",
    type: "video",
    title: "Birthday Message for Marie",
    creator: {
      name: "Ti Jo Zenny",
      id: "creator_1",
      avatar: "/images/ti-jo-zenny.jpg"
    },
    reporter: {
      name: "User123",
      id: "user_123",
      reason: "Inappropriate language"
    },
    flagReason: ["inappropriate_language", "harassment"],
    severity: "high",
    status: "pending",
    flaggedAt: "2024-01-15T10:30:00",
    thumbnail: "/placeholder.jpg",
    description: "Custom birthday message video",
    violationHistory: 0
  },
  {
    id: "FL002",
    type: "review",
    title: "Review on Wyclef Jean's profile",
    creator: {
      name: "Anonymous User",
      id: "user_456"
    },
    flagReason: ["spam", "fake_review"],
    severity: "medium",
    status: "reviewing",
    flaggedAt: "2024-01-14T15:45:00",
    reviewedBy: "Admin Sarah",
    description: "This creator is amazing! Check out my profile for similar content...",
    violationHistory: 2
  },
  {
    id: "FL003",
    type: "image",
    title: "Profile Picture Update",
    creator: {
      name: "New Creator",
      id: "creator_99"
    },
    flagReason: ["inappropriate_content", "nudity"],
    severity: "critical",
    status: "escalated",
    flaggedAt: "2024-01-13T09:15:00",
    thumbnail: "/placeholder.jpg",
    violationHistory: 1
  }
]

const violationCategories = {
  content: [
    "inappropriate_language",
    "harassment",
    "hate_speech",
    "violence",
    "nudity",
    "sexual_content",
    "child_safety",
    "self_harm"
  ],
  authenticity: [
    "spam",
    "fake_review",
    "impersonation",
    "misleading_content",
    "copyright_violation"
  ],
  community: [
    "bullying",
    "threats",
    "privacy_violation",
    "off_platform_behavior"
  ]
}

export function ContentModeration() {
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>(mockFlaggedContent)
  const [selectedContent, setSelectedContent] = useState<FlaggedContent | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [moderationNotes, setModerationNotes] = useState("")
  const [selectedViolations, setSelectedViolations] = useState<string[]>([])

  const handleApprove = (contentId: string) => {
    setFlaggedContent(prev => 
      prev.map(content => 
        content.id === contentId 
          ? { ...content, status: "approved", reviewedAt: new Date().toISOString(), reviewedBy: "Current Admin" }
          : content
      )
    )
    setIsReviewDialogOpen(false)
  }

  const handleReject = (contentId: string) => {
    setFlaggedContent(prev => 
      prev.map(content => 
        content.id === contentId 
          ? { ...content, status: "rejected", reviewedAt: new Date().toISOString(), reviewedBy: "Current Admin" }
          : content
      )
    )
    setIsReviewDialogOpen(false)
  }

  const handleEscalate = (contentId: string) => {
    setFlaggedContent(prev => 
      prev.map(content => 
        content.id === contentId 
          ? { ...content, status: "escalated" }
          : content
      )
    )
  }

  const getSeverityColor = (severity: FlaggedContent["severity"]) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: FlaggedContent["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewing":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "escalated":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getContentIcon = (type: FlaggedContent["type"]) => {
    switch (type) {
      case "video":
        return Video
      case "image":
        return ImageIcon
      case "text":
        return FileText
      case "review":
        return MessageSquare
      default:
        return FileText
    }
  }

  const filteredContent = flaggedContent.filter(content => {
    const matchesSearch = 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || content.status === filterStatus
    const matchesSeverity = filterSeverity === "all" || content.severity === filterSeverity
    return matchesSearch && matchesStatus && matchesSeverity
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Moderation Queue</CardTitle>
              <CardDescription>Review and moderate flagged content</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="destructive">
                {flaggedContent.filter(c => c.status === "pending").length} Pending
              </Badge>
              <Badge variant="secondary">
                {flaggedContent.filter(c => c.severity === "critical").length} Critical
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </Button>
          </div>

          {/* Content List */}
          <div className="space-y-4">
            {filteredContent.map((content) => {
              const ContentIcon = getContentIcon(content.type)
              return (
                <Card key={content.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {content.thumbnail ? (
                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={content.thumbnail} 
                              alt={content.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ContentIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{content.title}</h3>
                            <Badge className={getSeverityColor(content.severity)}>
                              {content.severity}
                            </Badge>
                            <Badge className={getStatusColor(content.status)}>
                              {content.status}
                            </Badge>
                            {content.violationHistory > 0 && (
                              <Badge variant="outline" className="text-red-600 border-red-600">
                                {content.violationHistory} prior violations
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{content.creator.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(content.flaggedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ContentIcon className="h-3 w-3" />
                              <span className="capitalize">{content.type}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Flagged for:</span>{" "}
                              {content.flagReason.map(reason => reason.replace("_", " ")).join(", ")}
                            </p>
                            {content.reporter && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Reported by:</span>{" "}
                                {content.reporter.name} - "{content.reporter.reason}"
                              </p>
                            )}
                            {content.description && (
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {content.description}
                              </p>
                            )}
                          </div>

                          {content.reviewedBy && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs text-muted-foreground">
                                Reviewed by {content.reviewedBy} on {new Date(content.reviewedAt!).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedContent(content)
                            setIsReviewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        
                        {content.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(content.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(content.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            {content.severity === "high" || content.severity === "critical" ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleEscalate(content.id)}
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Escalate
                              </Button>
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Review</DialogTitle>
            <DialogDescription>
              Review the flagged content and take appropriate action
            </DialogDescription>
          </DialogHeader>
          
          {selectedContent && (
            <div className="space-y-6">
              {/* Content Preview */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Content Preview</h3>
                {selectedContent.type === "video" ? (
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                ) : selectedContent.thumbnail ? (
                  <img 
                    src={selectedContent.thumbnail} 
                    alt={selectedContent.title}
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                ) : (
                  <div className="p-8 bg-gray-100 rounded-lg">
                    <p className="text-gray-600">{selectedContent.description}</p>
                  </div>
                )}
              </div>

              {/* Content Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Content Type</Label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedContent.type}</p>
                </div>
                <div>
                  <Label>Creator</Label>
                  <p className="text-sm text-muted-foreground">{selectedContent.creator.name}</p>
                </div>
                <div>
                  <Label>Flagged At</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedContent.flaggedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label>Severity</Label>
                  <Badge className={getSeverityColor(selectedContent.severity)}>
                    {selectedContent.severity}
                  </Badge>
                </div>
              </div>

              {/* Violation Categories */}
              <div>
                <Label>Violation Categories</Label>
                <div className="space-y-3 mt-2">
                  {Object.entries(violationCategories).map(([category, violations]) => (
                    <div key={category}>
                      <p className="text-sm font-medium mb-2 capitalize">{category.replace("_", " ")}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {violations.map((violation) => (
                          <div key={violation} className="flex items-center space-x-2">
                            <Checkbox
                              id={violation}
                              checked={selectedViolations.includes(violation)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedViolations([...selectedViolations, violation])
                                } else {
                                  setSelectedViolations(selectedViolations.filter(v => v !== violation))
                                }
                              }}
                            />
                            <Label 
                              htmlFor={violation}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {violation.replace(/_/g, " ")}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moderation Notes */}
              <div>
                <Label htmlFor="notes">Moderation Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about your decision..."
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>

              {/* Creator History */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Creator Violation History</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Violations:</span>
                    <span className="font-medium">{selectedContent.violationHistory}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account Status:</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Member Since:</span>
                    <span>Jan 2023</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <div className="flex gap-2 flex-1">
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedContent.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Content
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedContent.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Remove Content
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleEscalate(selectedContent.id)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Escalate
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}