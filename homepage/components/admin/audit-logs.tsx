"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Shield,
  AlertTriangle,
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
  Phone
} from "lucide-react"

interface AuditLog {
  id: string
  timestamp: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
  }
  action: string
  resource: string
  resourceId: string
  details: string
  ipAddress: string
  userAgent: string
  success: boolean
  severity: "low" | "medium" | "high" | "critical"
  category: "auth" | "user" | "content" | "financial" | "system" | "security"
  metadata?: Record<string, any>
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024-01-15T14:30:25Z",
    user: {
      id: "admin_1",
      name: "Sarah Chen",
      email: "sarah.chen@annpale.com",
      role: "Operations Admin"
    },
    action: "USER_SUSPENDED",
    resource: "User",
    resourceId: "user_5678",
    details: "Suspended user account due to policy violations",
    ipAddress: "192.168.1.10",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    success: true,
    severity: "high",
    category: "user",
    metadata: {
      reason: "Multiple policy violations",
      violations: ["inappropriate_content", "harassment"]
    }
  },
  {
    id: "2",
    timestamp: "2024-01-15T14:25:15Z",
    user: {
      id: "admin_2",
      name: "Marcus Johnson",
      email: "marcus.johnson@annpale.com",
      role: "Content Moderator"
    },
    action: "CONTENT_APPROVED",
    resource: "Video",
    resourceId: "video_9012",
    details: "Approved flagged video after review",
    ipAddress: "192.168.1.11",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    success: true,
    severity: "medium",
    category: "content"
  },
  {
    id: "3",
    timestamp: "2024-01-15T14:20:08Z",
    user: {
      id: "admin_3",
      name: "Elena Rodriguez",
      email: "elena.rodriguez@annpale.com",
      role: "Finance Manager"
    },
    action: "PAYOUT_PROCESSED",
    resource: "Transaction",
    resourceId: "txn_3456",
    details: "Processed weekly creator payout batch",
    ipAddress: "192.168.1.12",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    success: true,
    severity: "medium",
    category: "financial",
    metadata: {
      amount: 45000,
      recipients: 156,
      batchId: "batch_2024_w3"
    }
  },
  {
    id: "4",
    timestamp: "2024-01-15T14:15:42Z",
    user: {
      id: "system",
      name: "System",
      email: "system@annpale.com",
      role: "System"
    },
    action: "LOGIN_FAILED",
    resource: "Authentication",
    resourceId: "auth_attempt_7890",
    details: "Failed login attempt with invalid credentials",
    ipAddress: "203.45.67.89",
    userAgent: "curl/7.68.0",
    success: false,
    severity: "critical",
    category: "security",
    metadata: {
      attempts: 5,
      blocked: true,
      suspiciousActivity: true
    }
  },
  {
    id: "5",
    timestamp: "2024-01-15T14:10:30Z",
    user: {
      id: "admin_1",
      name: "Sarah Chen",
      email: "sarah.chen@annpale.com",
      role: "Operations Admin"
    },
    action: "ROLE_UPDATED",
    resource: "User",
    resourceId: "user_1234",
    details: "Updated user role from Creator to Verified Creator",
    ipAddress: "192.168.1.10",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    success: true,
    severity: "medium",
    category: "user",
    metadata: {
      oldRole: "creator",
      newRole: "verified_creator"
    }
  },
  {
    id: "6",
    timestamp: "2024-01-15T14:05:18Z",
    user: {
      id: "admin_4",
      name: "James Wilson",
      email: "james.wilson@annpale.com",
      role: "Super Admin"
    },
    action: "SYSTEM_CONFIG_CHANGED",
    resource: "Configuration",
    resourceId: "config_payment_gateway",
    details: "Updated payment gateway configuration",
    ipAddress: "192.168.1.5",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    success: true,
    severity: "critical",
    category: "system",
    metadata: {
      changes: ["api_endpoint", "timeout_settings"],
      backup_created: true
    }
  }
]

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterUser, setFilterUser] = useState("all")
  const [dateRange, setDateRange] = useState("24h")

  const getSeverityColor = (severity: AuditLog["severity"]) => {
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

  const getCategoryIcon = (category: AuditLog["category"]) => {
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
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getSuccessIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    )
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = filterCategory === "all" || log.category === filterCategory
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity
    const matchesUser = filterUser === "all" || log.user.id === filterUser
    
    return matchesSearch && matchesCategory && matchesSeverity && matchesUser
  })

  const uniqueUsers = Array.from(new Set(logs.map(log => log.user.id)))
    .map(userId => logs.find(log => log.user.id === userId)?.user)
    .filter(Boolean)

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setIsDetailDialogOpen(true)
  }

  const exportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,User,Action,Resource,Details,IP Address,Success,Severity,Category\n" +
      filteredLogs.map(log => 
        `${log.timestamp},${log.user.name},${log.action},${log.resource},${log.details},${log.ipAddress},${log.success},${log.severity},${log.category}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>System activity and administrative actions</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {filteredLogs.length} entries
              </Badge>
              <Button onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search logs..."
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
              </SelectContent>
            </Select>

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger>
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map((user) => (
                  <SelectItem key={user!.id} value={user!.id}>
                    {user!.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>

          {/* Audit Logs Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                        <div className="text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={log.user.avatar} />
                          <AvatarFallback className="text-xs">
                            {log.user.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{log.user.name}</div>
                          <div className="text-xs text-gray-500">{log.user.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{log.action.replace(/_/g, " ")}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{log.details}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{log.resource}</div>
                        <div className="text-gray-500 font-mono text-xs">{log.resourceId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getSuccessIcon(log.success)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(log.severity)}>
                        {log.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(log.category)}
                        <span className="text-sm capitalize">{log.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about this administrative action
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Timestamp</label>
                  <p className="text-sm">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Action</label>
                  <p className="text-sm font-medium">{selectedLog.action.replace(/_/g, " ")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Resource</label>
                  <p className="text-sm">{selectedLog.resource} ({selectedLog.resourceId})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="flex items-center space-x-2">
                    {getSuccessIcon(selectedLog.success)}
                    <span className="text-sm">{selectedLog.success ? "Success" : "Failed"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Severity</label>
                  <Badge className={getSeverityColor(selectedLog.severity)}>
                    {selectedLog.severity}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(selectedLog.category)}
                    <span className="text-sm capitalize">{selectedLog.category}</span>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">User Information</h4>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={selectedLog.user.avatar} />
                    <AvatarFallback>
                      {selectedLog.user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedLog.user.name}</p>
                    <p className="text-sm text-gray-600">{selectedLog.user.email}</p>
                    <p className="text-sm text-gray-600">{selectedLog.user.role}</p>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Technical Details</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">IP Address</label>
                    <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">User Agent</label>
                    <p className="text-sm text-gray-600 break-words">{selectedLog.userAgent}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-sm">{selectedLog.details}</p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              {selectedLog.metadata && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Additional Information</h4>
                  <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}