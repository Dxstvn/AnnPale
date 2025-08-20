"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Activity,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Download,
  Eye,
  User,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  Database,
  CreditCard,
  Users,
  Video,
  FileText,
  Lock,
  Unlock,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  Server,
  Globe,
  Mail,
  Phone,
  Clock,
  TrendingUp,
  ArrowRight,
  History,
  ChevronDown,
  Archive,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface ActivityLog {
  id: string
  timestamp: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
    department?: string
  }
  action: string
  actionType: "create" | "read" | "update" | "delete" | "auth" | "system"
  resource: string
  resourceId: string
  details: string
  ipAddress: string
  location?: string
  userAgent: string
  sessionId: string
  success: boolean
  duration: number
  severity: "info" | "low" | "medium" | "high" | "critical"
  category: "auth" | "user" | "content" | "financial" | "system" | "security" | "compliance"
  tags: string[]
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  metadata?: Record<string, any>
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: "act-001",
    timestamp: "2024-03-15T14:30:25Z",
    user: {
      id: "admin_1",
      name: "Sarah Chen",
      email: "sarah.chen@annpale.com",
      role: "Operations Admin",
      department: "Operations"
    },
    action: "USER_PROFILE_UPDATED",
    actionType: "update",
    resource: "User Profile",
    resourceId: "user_5678",
    details: "Updated user verification status and added verification badge",
    ipAddress: "192.168.1.10",
    location: "New York, US",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    sessionId: "sess_abc123",
    success: true,
    duration: 234,
    severity: "medium",
    category: "user",
    tags: ["verification", "profile", "badge"],
    changes: [
      { field: "verified", oldValue: false, newValue: true },
      { field: "verificationBadge", oldValue: null, newValue: "blue_check" }
    ]
  },
  {
    id: "act-002",
    timestamp: "2024-03-15T14:25:15Z",
    user: {
      id: "admin_2",
      name: "Marcus Johnson",
      email: "marcus.johnson@annpale.com",
      role: "Content Moderator",
      department: "Trust & Safety"
    },
    action: "VIDEO_REVIEWED",
    actionType: "update",
    resource: "Video Content",
    resourceId: "video_9012",
    details: "Reviewed and approved flagged video content after manual review",
    ipAddress: "192.168.1.11",
    location: "Los Angeles, US",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    sessionId: "sess_def456",
    success: true,
    duration: 4523,
    severity: "medium",
    category: "content",
    tags: ["moderation", "video", "approval"],
    metadata: {
      reviewDuration: "4.5 seconds",
      flagReason: "inappropriate_content",
      decision: "approved"
    }
  },
  {
    id: "act-003",
    timestamp: "2024-03-15T14:20:08Z",
    user: {
      id: "system",
      name: "System",
      email: "system@annpale.com",
      role: "Automated Process",
      department: "System"
    },
    action: "DATA_EXPORT_REQUESTED",
    actionType: "read",
    resource: "User Data",
    resourceId: "export_789",
    details: "GDPR data export requested by user",
    ipAddress: "10.0.0.5",
    userAgent: "AnnPale-System/1.0",
    sessionId: "sys_auto",
    success: true,
    duration: 1234,
    severity: "high",
    category: "compliance",
    tags: ["gdpr", "data-export", "privacy"],
    metadata: {
      requestType: "full_data_export",
      dataCategories: ["profile", "videos", "transactions", "messages"],
      estimatedSize: "245MB"
    }
  },
  {
    id: "act-004",
    timestamp: "2024-03-15T14:15:42Z",
    user: {
      id: "admin_3",
      name: "Elena Rodriguez",
      email: "elena.rodriguez@annpale.com",
      role: "Finance Manager",
      department: "Finance"
    },
    action: "PAYOUT_PROCESSED",
    actionType: "create",
    resource: "Financial Transaction",
    resourceId: "txn_3456",
    details: "Processed weekly creator payout batch",
    ipAddress: "192.168.1.12",
    location: "Miami, US",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    sessionId: "sess_ghi789",
    success: true,
    duration: 3456,
    severity: "high",
    category: "financial",
    tags: ["payout", "batch", "creators"],
    metadata: {
      amount: 45000,
      currency: "USD",
      recipients: 156,
      batchId: "batch_2024_w3",
      paymentMethod: "bank_transfer"
    }
  },
  {
    id: "act-005",
    timestamp: "2024-03-15T14:10:30Z",
    user: {
      id: "admin_4",
      name: "James Wilson",
      email: "james.wilson@annpale.com",
      role: "Security Admin",
      department: "Security"
    },
    action: "SECURITY_POLICY_UPDATED",
    actionType: "update",
    resource: "Security Policy",
    resourceId: "policy_sec_001",
    details: "Updated password policy requirements",
    ipAddress: "192.168.1.5",
    location: "Boston, US",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    sessionId: "sess_jkl012",
    success: true,
    duration: 567,
    severity: "critical",
    category: "security",
    tags: ["policy", "password", "security"],
    changes: [
      { field: "minLength", oldValue: 8, newValue: 12 },
      { field: "requireSpecialChar", oldValue: false, newValue: true },
      { field: "passwordExpiry", oldValue: 90, newValue: 60 }
    ]
  }
]

export function ActivityLogViewer() {
  const [logs, setLogs] = useState<ActivityLog[]>(mockActivityLogs)
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterActionType, setFilterActionType] = useState("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  })
  const [viewMode, setViewMode] = useState<"timeline" | "table" | "stream">("stream")

  const getSeverityColor = (severity: ActivityLog["severity"]) => {
    switch (severity) {
      case "info":
        return "bg-gray-100 text-gray-800"
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

  const getActionTypeIcon = (actionType: ActivityLog["actionType"]) => {
    switch (actionType) {
      case "create":
        return <Plus className="h-4 w-4 text-green-600" />
      case "read":
        return <Eye className="h-4 w-4 text-blue-600" />
      case "update":
        return <Edit className="h-4 w-4 text-yellow-600" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-600" />
      case "auth":
        return <Lock className="h-4 w-4 text-purple-600" />
      case "system":
        return <Server className="h-4 w-4 text-gray-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryIcon = (category: ActivityLog["category"]) => {
    switch (category) {
      case "auth":
        return <Lock className="h-4 w-4" />
      case "user":
        return <Users className="h-4 w-4" />
      case "content":
        return <Video className="h-4 w-4" />
      case "financial":
        return <CreditCard className="h-4 w-4" />
      case "system":
        return <Server className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "compliance":
        return <FileText className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = filterCategory === "all" || log.category === filterCategory
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity
    const matchesActionType = filterActionType === "all" || log.actionType === filterActionType
    
    return matchesSearch && matchesCategory && matchesSeverity && matchesActionType
  })

  const activityStats = {
    total: filteredLogs.length,
    successful: filteredLogs.filter(l => l.success).length,
    failed: filteredLogs.filter(l => !l.success).length,
    critical: filteredLogs.filter(l => l.severity === "critical").length,
    avgDuration: Math.round(filteredLogs.reduce((acc, l) => acc + l.duration, 0) / filteredLogs.length)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Log Viewer</h2>
          <p className="text-gray-600">Real-time activity stream and historical audit trails</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold">{activityStats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{activityStats.successful}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{activityStats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-orange-600">{activityStats.critical}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold">{activityStats.avgDuration}ms</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="user">User Management</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterActionType} onValueChange={setFilterActionType}>
              <SelectTrigger>
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                />
              </PopoverContent>
            </Popover>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "stream" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("stream")}
              >
                <Activity className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "timeline" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("timeline")}
              >
                <History className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("table")}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Stream */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Stream</CardTitle>
          <CardDescription>Real-time activity monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getActionTypeIcon(log.actionType)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{log.action.replace(/_/g, " ")}</span>
                          <Badge className={getSeverityColor(log.severity)}>
                            {log.severity}
                          </Badge>
                          {log.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.user.name}
                          </div>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(log.category)}
                            {log.category}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                          {log.location && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {log.location}
                            </div>
                          )}
                        </div>
                        {log.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {log.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {log.changes && log.changes.length > 0 && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <p className="font-medium mb-1">Changes:</p>
                            {log.changes.map((change, idx) => (
                              <div key={idx} className="text-gray-600">
                                {change.field}: {JSON.stringify(change.oldValue)} → {JSON.stringify(change.newValue)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}