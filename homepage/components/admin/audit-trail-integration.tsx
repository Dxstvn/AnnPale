"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Activity,
  User,
  Users,
  DollarSign,
  Shield,
  Settings,
  AlertTriangle,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Clock,
  Calendar,
  Search,
  FileText,
  Monitor,
  Smartphone,
  Globe,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Mail,
  MessageSquare,
  Video,
  CreditCard,
  Ban,
  UserCheck,
  Zap,
  Database,
  Server,
  AlertCircle
} from "lucide-react"

interface AuditLogEntry {
  id: string
  timestamp: string
  eventType: "user_action" | "system_event" | "security_event" | "admin_action" | "financial_event" | "content_event"
  action: string
  actor: {
    id: string
    name: string
    type: "user" | "admin" | "system"
    ip?: string
    userAgent?: string
  }
  target?: {
    id: string
    type: "user" | "order" | "video" | "payment" | "setting"
    name?: string
  }
  details: Record<string, any>
  severity: "low" | "medium" | "high" | "critical"
  status: "success" | "failed" | "pending"
  metadata: {
    source: string
    sessionId?: string
    requestId?: string
    location?: string
  }
}

interface SystemMetrics {
  activeUsers: number
  lastUpdate: string
  errorRate: number
  responseTime: number
  uptime: number
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkTraffic: number
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "LOG001",
    timestamp: "2024-01-15T14:30:25.123Z",
    eventType: "admin_action",
    action: "user_suspended",
    actor: {
      id: "ADM001",
      name: "Admin John",
      type: "admin",
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    target: {
      id: "USR001",
      type: "user",
      name: "Marie Laurent"
    },
    details: {
      reason: "Policy violation",
      duration: "7 days",
      previousStatus: "active",
      newStatus: "suspended",
      violationType: "inappropriate_content"
    },
    severity: "high",
    status: "success",
    metadata: {
      source: "admin_panel",
      sessionId: "sess_abc123",
      requestId: "req_def456",
      location: "New York, NY"
    }
  },
  {
    id: "LOG002",
    timestamp: "2024-01-15T14:25:10.456Z",
    eventType: "financial_event",
    action: "payment_processed",
    actor: {
      id: "USR002",
      name: "Jean Pierre",
      type: "user",
      ip: "10.0.0.50",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"
    },
    target: {
      id: "PAY001",
      type: "payment",
      name: "Order Payment"
    },
    details: {
      amount: 150.00,
      currency: "USD",
      paymentMethod: "credit_card",
      orderId: "ORD123",
      transactionId: "txn_789xyz",
      processorResponse: "approved"
    },
    severity: "low",
    status: "success",
    metadata: {
      source: "payment_gateway",
      sessionId: "sess_xyz789",
      requestId: "req_abc123"
    }
  },
  {
    id: "LOG003",
    timestamp: "2024-01-15T14:20:45.789Z",
    eventType: "security_event",
    action: "failed_login_attempt",
    actor: {
      id: "unknown",
      name: "Unknown User",
      type: "user",
      ip: "45.123.456.789",
      userAgent: "curl/7.68.0"
    },
    target: {
      id: "USR003",
      type: "user",
      name: "Target Account"
    },
    details: {
      email: "user@example.com",
      attemptCount: 5,
      isBlocked: true,
      reason: "too_many_attempts",
      suspiciousActivity: true
    },
    severity: "critical",
    status: "failed",
    metadata: {
      source: "auth_service",
      location: "Unknown Location"
    }
  },
  {
    id: "LOG004",
    timestamp: "2024-01-15T14:15:30.012Z",
    eventType: "content_event",
    action: "video_approved",
    actor: {
      id: "MOD001",
      name: "Content Moderator",
      type: "admin",
      ip: "192.168.1.200"
    },
    target: {
      id: "VID001",
      type: "video",
      name: "Creator Video"
    },
    details: {
      creatorId: "CRT001",
      creatorName: "Ti Jo Zenny",
      duration: 120,
      category: "birthday",
      moderationScore: 95,
      flags: []
    },
    severity: "low",
    status: "success",
    metadata: {
      source: "moderation_panel",
      sessionId: "sess_mod123"
    }
  },
  {
    id: "LOG005",
    timestamp: "2024-01-15T14:10:15.345Z",
    eventType: "system_event",
    action: "database_backup_completed",
    actor: {
      id: "system",
      name: "Database Backup Service",
      type: "system"
    },
    details: {
      backupSize: "2.4 GB",
      duration: "12 minutes",
      tables: 45,
      records: 1234567,
      compressionRatio: 0.75,
      storageLocation: "s3://backups/prod/"
    },
    severity: "low",
    status: "success",
    metadata: {
      source: "backup_service",
      requestId: "backup_req_123"
    }
  }
]

const mockSystemMetrics: SystemMetrics = {
  activeUsers: 1247,
  lastUpdate: new Date().toISOString(),
  errorRate: 0.02,
  responseTime: 125,
  uptime: 99.98,
  cpuUsage: 45,
  memoryUsage: 62,
  diskUsage: 78,
  networkTraffic: 1250
}

const getEventIcon = (eventType: AuditLogEntry["eventType"]) => {
  switch (eventType) {
    case "user_action": return User
    case "admin_action": return Shield
    case "security_event": return Lock
    case "financial_event": return DollarSign
    case "content_event": return Video
    case "system_event": return Server
    default: return Activity
  }
}

const getSeverityColor = (severity: AuditLogEntry["severity"]) => {
  switch (severity) {
    case "critical": return "bg-red-100 text-red-800"
    case "high": return "bg-orange-100 text-orange-800"
    case "medium": return "bg-yellow-100 text-yellow-800"
    case "low": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: AuditLogEntry["status"]) => {
  switch (status) {
    case "success": return "bg-green-100 text-green-800"
    case "failed": return "bg-red-100 text-red-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export function AuditTrailIntegration() {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(mockAuditLogs)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(mockSystemMetrics)
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
  const [filterEventType, setFilterEventType] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("24h")

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const interval = setInterval(() => {
      // Update system metrics
      setSystemMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        lastUpdate: new Date().toISOString(),
        errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.01),
        responseTime: Math.max(50, prev.responseTime + Math.floor(Math.random() * 20 - 10)),
        cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + Math.floor(Math.random() * 6 - 3))),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + Math.floor(Math.random() * 4 - 2))),
        networkTraffic: Math.max(0, prev.networkTraffic + Math.floor(Math.random() * 100 - 50))
      }))

      // Occasionally add new log entries
      if (Math.random() < 0.3) {
        const newLog: AuditLogEntry = {
          id: `LOG${String(Date.now()).slice(-6)}`,
          timestamp: new Date().toISOString(),
          eventType: ["user_action", "system_event", "security_event"][Math.floor(Math.random() * 3)] as any,
          action: "real_time_activity",
          actor: {
            id: "system",
            name: "Real-time Monitor",
            type: "system"
          },
          details: {
            automated: true,
            metric: "activity_update"
          },
          severity: "low",
          status: "success",
          metadata: {
            source: "real_time_monitor"
          }
        }
        setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]) // Keep last 50 entries
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isRealTimeEnabled])

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchQuery === "" || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.target?.name && log.target.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesEventType = filterEventType === "all" || log.eventType === filterEventType
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity
    const matchesStatus = filterStatus === "all" || log.status === filterStatus

    return matchesSearch && matchesEventType && matchesSeverity && matchesStatus
  })

  const stats = {
    total: auditLogs.length,
    critical: auditLogs.filter(l => l.severity === "critical").length,
    failed: auditLogs.filter(l => l.status === "failed").length,
    adminActions: auditLogs.filter(l => l.eventType === "admin_action").length,
    securityEvents: auditLogs.filter(l => l.eventType === "security_event").length
  }

  return (
    <div className="space-y-6">
      {/* Real-time System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{systemMetrics.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold">{(systemMetrics.errorRate * 100).toFixed(2)}%</p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${systemMetrics.errorRate > 0.05 ? "text-red-600" : "text-green-600"}`} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">{systemMetrics.responseTime}ms</p>
              </div>
              <Clock className={`h-8 w-8 ${systemMetrics.responseTime > 200 ? "text-orange-600" : "text-green-600"}`} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold">{systemMetrics.uptime}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CPU Usage</p>
                <p className="text-2xl font-bold">{systemMetrics.cpuUsage}%</p>
              </div>
              <Monitor className={`h-8 w-8 ${systemMetrics.cpuUsage > 80 ? "text-red-600" : "text-blue-600"}`} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Memory</p>
                <p className="text-2xl font-bold">{systemMetrics.memoryUsage}%</p>
              </div>
              <Database className={`h-8 w-8 ${systemMetrics.memoryUsage > 85 ? "text-red-600" : "text-blue-600"}`} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disk Usage</p>
                <p className="text-2xl font-bold">{systemMetrics.diskUsage}%</p>
              </div>
              <Server className={`h-8 w-8 ${systemMetrics.diskUsage > 90 ? "text-red-600" : "text-blue-600"}`} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="text-2xl font-bold">{systemMetrics.networkTraffic}</p>
              </div>
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold">{stats.critical}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admin Actions</p>
                <p className="text-2xl font-bold">{stats.adminActions}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security</p>
                <p className="text-2xl font-bold">{stats.securityEvents}</p>
              </div>
              <Lock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Audit Trail Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Real-time Audit Trail</span>
                {isRealTimeEnabled && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600">Live</span>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Real-time monitoring of all system activities and user actions
                <br />
                <span className="text-xs text-muted-foreground">
                  Last updated: {new Date(systemMetrics.lastUpdate).toLocaleTimeString()}
                </span>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={isRealTimeEnabled} 
                  onCheckedChange={setIsRealTimeEnabled}
                />
                <Label className="text-sm">Real-time</Label>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
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
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterEventType} onValueChange={setFilterEventType}>
              <SelectTrigger>
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="user_action">User Actions</SelectItem>
                <SelectItem value="admin_action">Admin Actions</SelectItem>
                <SelectItem value="security_event">Security Events</SelectItem>
                <SelectItem value="financial_event">Financial Events</SelectItem>
                <SelectItem value="content_event">Content Events</SelectItem>
                <SelectItem value="system_event">System Events</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>

          {/* Audit Log Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const EventIcon = getEventIcon(log.eventType)
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gray-100">
                            <EventIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{log.action.replace(/_/g, " ")}</p>
                            <p className="text-sm text-muted-foreground capitalize">{log.eventType.replace(/_/g, " ")}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{log.actor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{log.actor.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{log.actor.type}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.target ? (
                          <div>
                            <p className="font-medium">{log.target.name || log.target.id}</p>
                            <p className="text-sm text-muted-foreground capitalize">{log.target.type}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                          <p className="text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedLog(log)
                            setIsDetailsOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Log Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Entry Details</DialogTitle>
            <DialogDescription>
              Complete information about this audit log entry
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6">
              {/* Event Summary */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 rounded-lg bg-white">
                  {(() => {
                    const EventIcon = getEventIcon(selectedLog.eventType)
                    return <EventIcon className="h-6 w-6" />
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedLog.action.replace(/_/g, " ")}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{selectedLog.eventType.replace(/_/g, " ")}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getSeverityColor(selectedLog.severity)}>
                      {selectedLog.severity}
                    </Badge>
                    <Badge className={getStatusColor(selectedLog.status)}>
                      {selectedLog.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">ID: {selectedLog.id}</p>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  <TabsTrigger value="context">Context</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  {/* Actor Information */}
                  <div>
                    <Label className="text-base font-medium">Actor</Label>
                    <div className="mt-2 p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{selectedLog.actor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{selectedLog.actor.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {selectedLog.actor.id}</p>
                          <p className="text-sm text-muted-foreground capitalize">Type: {selectedLog.actor.type}</p>
                        </div>
                        <div className="text-right text-sm">
                          {selectedLog.actor.ip && (
                            <p className="text-muted-foreground">IP: {selectedLog.actor.ip}</p>
                          )}
                          {selectedLog.metadata.location && (
                            <p className="text-muted-foreground">{selectedLog.metadata.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Target Information */}
                  {selectedLog.target && (
                    <div>
                      <Label className="text-base font-medium">Target</Label>
                      <div className="mt-2 p-4 border rounded-lg">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">ID</p>
                            <p className="font-medium">{selectedLog.target.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Type</p>
                            <p className="font-medium capitalize">{selectedLog.target.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{selectedLog.target.name || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Event Details</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(selectedLog.details, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Metadata</Label>
                    <div className="mt-2 p-4 border rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Source</p>
                          <p className="font-medium">{selectedLog.metadata.source}</p>
                        </div>
                        {selectedLog.metadata.sessionId && (
                          <div>
                            <p className="text-sm text-muted-foreground">Session ID</p>
                            <p className="font-medium font-mono text-sm">{selectedLog.metadata.sessionId}</p>
                          </div>
                        )}
                        {selectedLog.metadata.requestId && (
                          <div>
                            <p className="text-sm text-muted-foreground">Request ID</p>
                            <p className="font-medium font-mono text-sm">{selectedLog.metadata.requestId}</p>
                          </div>
                        )}
                        {selectedLog.metadata.location && (
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{selectedLog.metadata.location}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  {selectedLog.actor.userAgent && (
                    <div>
                      <Label className="text-base font-medium">User Agent</Label>
                      <div className="mt-2 p-4 border rounded-lg">
                        <p className="text-sm font-mono break-all">{selectedLog.actor.userAgent}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="context" className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Related Events</Label>
                    <div className="mt-2 p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        No related events found in the current time window.
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Impact Assessment</Label>
                    <div className="mt-2 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Risk Level:</span>
                          <Badge className={getSeverityColor(selectedLog.severity)}>
                            {selectedLog.severity}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Affected Users:</span>
                          <span className="text-sm">
                            {selectedLog.target?.type === "user" ? "1 user" : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">System Impact:</span>
                          <span className="text-sm">
                            {selectedLog.status === "success" ? "None" : "Potential disruption"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}