"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTranslations } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  AlertTriangle,
  Ban,
  Check,
  CheckCircle,
  Clock,
  Eye,
  Flag,
  MessageSquare,
  MoreVertical,
  Play,
  Search,
  Shield,
  Trash2,
  User,
  Video,
  X,
  XCircle,
  Filter,
  Download,
  Upload,
  AlertCircle,
  ThumbsDown,
  ThumbsUp,
  UserX,
  FileText,
  Image,
  Volume2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"


// Mock moderation data
const moderationQueue = [
  {
    id: "MOD001",
    type: "video",
    title: "Birthday Message for Jean",
    creator: {
      name: "Sarah Johnson",
      avatar: "/api/placeholder/40/40",
      verified: true
    },
    flaggedBy: "Auto-detection",
    reason: "Potentially inappropriate language",
    severity: "medium",
    reportCount: 1,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "pending",
    duration: "2:45",
    thumbnail: "/api/placeholder/160/90"
  },
  {
    id: "MOD002",
    type: "review",
    content: "This creator is amazing but the video quality was poor and audio was unclear...",
    author: {
      name: "Michael Chen",
      avatar: "/api/placeholder/40/40"
    },
    flaggedBy: "User Report",
    reason: "Spam or misleading",
    severity: "low",
    reportCount: 3,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "pending",
    rating: 2
  },
  {
    id: "MOD003",
    type: "profile",
    creator: {
      name: "Unknown User",
      avatar: "/api/placeholder/40/40",
      verified: false
    },
    flaggedBy: "Multiple Users",
    reason: "Impersonation",
    severity: "high",
    reportCount: 8,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "pending",
    profileFields: ["bio", "profile picture"]
  },
  {
    id: "MOD004",
    type: "message",
    content: "Check out this amazing opportunity to make money fast...",
    author: {
      name: "Spam Account",
      avatar: "/api/placeholder/40/40"
    },
    flaggedBy: "Auto-detection",
    reason: "Spam",
    severity: "medium",
    reportCount: 1,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: "pending"
  },
  {
    id: "MOD005",
    type: "video",
    title: "Wedding Congratulations",
    creator: {
      name: "Marie Pierre",
      avatar: "/api/placeholder/40/40",
      verified: true
    },
    flaggedBy: "User Report",
    reason: "Copyright music",
    severity: "low",
    reportCount: 2,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: "pending",
    duration: "3:15",
    thumbnail: "/api/placeholder/160/90"
  }
]

// Moderation statistics
const moderationStats = {
  pending: 23,
  approvedToday: 145,
  rejectedToday: 12,
  avgReviewTime: "4m 32s",
  reportTrend: "+12%"
}

// Audit log entries
const auditLog = [
  {
    id: "1",
    action: "Content Approved",
    moderator: "Admin User",
    contentId: "MOD098",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    reason: "Content meets guidelines"
  },
  {
    id: "2",
    action: "Content Rejected",
    moderator: "Admin User",
    contentId: "MOD097",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    reason: "Inappropriate language"
  },
  {
    id: "3",
    action: "User Banned",
    moderator: "System",
    userId: "USR456",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    reason: "Multiple violations"
  }
]

export default function ModerationQueuePage() {
  const t = useTranslations('admin.moderation')
  const tCommon = useTranslations('admin.common')
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filterType, setFilterType] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContent, setSelectedContent] = useState<typeof moderationQueue[0] | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [moderationNote, setModerationNote] = useState("")
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false)
  const [bulkAction, setBulkAction] = useState<"approve" | "reject" | null>(null)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredQueue.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    }
  }

  const handleBulkAction = (action: "approve" | "reject") => {
    setBulkAction(action)
    setIsBulkActionDialogOpen(true)
  }

  const executeBulkAction = () => {
    console.log(`${bulkAction} items:`, selectedItems)
    setIsBulkActionDialogOpen(false)
    setSelectedItems([])
  }

  const handleApprove = (itemId: string) => {
    console.log("Approving item:", itemId)
  }

  const handleReject = (itemId: string) => {
    console.log("Rejecting item:", itemId)
  }

  const handleViewDetails = (item: typeof moderationQueue[0]) => {
    setSelectedContent(item)
    setIsDetailsDialogOpen(true)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-blue-500 bg-blue-50 border-blue-200"
      default:
        return "text-gray-500 bg-gray-50 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "review":
        return <MessageSquare className="h-4 w-4" />
      case "profile":
        return <User className="h-4 w-4" />
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "image":
        return <Image className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredQueue = moderationQueue.filter(item => {
    if (activeTab === "approved" && item.status !== "approved") return false
    if (activeTab === "rejected" && item.status !== "rejected") return false
    if (activeTab === "pending" && item.status !== "pending") return false
    if (filterType !== "all" && item.type !== filterType) return false
    if (filterSeverity !== "all" && item.severity !== filterSeverity) return false
    if (searchQuery && !JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{t('title')}</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{t('queue.title')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {tCommon('export')} {tCommon('report', {fallback: 'Report'})}
            </Button>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              {tCommon('guidelines', {fallback: 'Guidelines'})}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('queue.pending')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{moderationStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{tCommon('approvedToday', {fallback: 'Approved Today'})}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{moderationStats.approvedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{tCommon('rejectedToday', {fallback: 'Rejected Today'})}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{moderationStats.rejectedToday}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{tCommon('avgReviewTime', {fallback: 'Avg Review Time'})}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{moderationStats.avgReviewTime}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{tCommon('reportTrend', {fallback: 'Report Trend'})}</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{moderationStats.reportTrend}</p>
              </div>
              <Flag className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={tCommon('searchPlaceholder', {fallback: 'Search by content, creator, or reason...'})}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="profile">Profiles</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-[150px]">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle>
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </AlertTitle>
          <AlertDescription className="mt-3">
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="default"
                onClick={() => handleBulkAction("approve")}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                {t('actions.approve')} {tCommon('selected', {fallback: 'Selected'})}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction("reject")}
              >
                <X className="h-4 w-4 mr-2" />
                {t('actions.reject')} {tCommon('selected', {fallback: 'Selected'})}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedItems([])}
              >
                {tCommon('clear')} {tCommon('selection', {fallback: 'Selection'})}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">
            {t('queue.pending')}
            <Badge className="ml-2" variant="secondary">{moderationStats.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            {t('queue.reviewed')}
          </TabsTrigger>
          <TabsTrigger value="rejected">
            {t('queue.flagged')}
          </TabsTrigger>
          <TabsTrigger value="audit">
            {tCommon('auditLog', {fallback: 'Audit Log'})}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('queue.title')}</CardTitle>
              <CardDescription>{tCommon('moderationDescription', {fallback: 'Review and take action on flagged content'})}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedItems.length === filteredQueue.length && filteredQueue.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>{tCommon('type', {fallback: 'Type'})}</TableHead>
                    <TableHead>{tCommon('content', {fallback: 'Content'})}</TableHead>
                    <TableHead>{tCommon('flaggedBy', {fallback: 'Flagged By'})}</TableHead>
                    <TableHead>{tCommon('reason', {fallback: 'Reason'})}</TableHead>
                    <TableHead>{tCommon('severity', {fallback: 'Severity'})}</TableHead>
                    <TableHead>{tCommon('reports', {fallback: 'Reports'})}</TableHead>
                    <TableHead>{tCommon('time', {fallback: 'Time'})}</TableHead>
                    <TableHead>{tCommon('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueue.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <span className="text-sm capitalize">{item.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          {item.type === "video" && (
                            <div className="flex items-center gap-3">
                              <div className="w-20 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <Play className="h-6 w-6 text-gray-400" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.creator?.name}</p>
                              </div>
                            </div>
                          )}
                          {(item.type === "review" || item.type === "message") && (
                            <p className="text-sm truncate">{item.content}</p>
                          )}
                          {item.type === "profile" && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={item.creator?.avatar} />
                                <AvatarFallback>{item.creator?.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{item.creator?.name}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{item.flaggedBy}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{item.reason}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSeverityColor(item.severity)}>
                          {item.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.reportCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {format(item.timestamp, 'MMM d, HH:mm')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(item.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{tCommon('auditLog', {fallback: 'Audit Log'})}</CardTitle>
              <CardDescription>{tCommon('auditDescription', {fallback: 'Track moderation actions and decisions'})}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={cn(
                      "p-2 rounded-full",
                      entry.action.includes("Approved") && "bg-green-100",
                      entry.action.includes("Rejected") && "bg-red-100",
                      entry.action.includes("Banned") && "bg-orange-100"
                    )}>
                      {entry.action.includes("Approved") && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {entry.action.includes("Rejected") && <XCircle className="h-4 w-4 text-red-600" />}
                      {entry.action.includes("Banned") && <Ban className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{entry.action}</p>
                      <p className="text-sm text-gray-600">{entry.reason}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">By: {entry.moderator}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                          {format(entry.timestamp, 'MMM d, HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{tCommon('contentDetails', {fallback: 'Content Details'})}</DialogTitle>
            <DialogDescription>
              {tCommon('reviewContent', {fallback: 'Review the flagged content and make a moderation decision'})}
            </DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Content Type</p>
                  <p className="text-sm mt-1 capitalize">{selectedContent.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Severity</p>
                  <Badge variant="outline" className={getSeverityColor(selectedContent.severity)}>
                    {selectedContent.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Flagged By</p>
                  <p className="text-sm mt-1">{selectedContent.flaggedBy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Report Count</p>
                  <p className="text-sm mt-1">{selectedContent.reportCount}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Reason for Flagging</p>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{selectedContent.reason}</AlertDescription>
                </Alert>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Moderation Note</p>
                <Textarea
                  placeholder="Add a note about your moderation decision..."
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                handleApprove(selectedContent?.id || "")
                setIsDetailsDialogOpen(false)
              }}
            >
              <Check className="h-4 w-4 mr-2" />
              {t('actions.approve')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleReject(selectedContent?.id || "")
                setIsDetailsDialogOpen(false)
              }}
            >
              <X className="h-4 w-4 mr-2" />
              {t('actions.reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Confirmation Dialog */}
      <Dialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm Bulk {bulkAction === "approve" ? "Approval" : "Rejection"}
            </DialogTitle>
            <DialogDescription>
              You are about to {bulkAction} {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkActionDialogOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button
              variant={bulkAction === "approve" ? "default" : "destructive"}
              onClick={executeBulkAction}
            >
              Confirm {bulkAction === "approve" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}