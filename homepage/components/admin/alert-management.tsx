"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle,
  Clock,
  Filter,
  Info,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Siren,
  User,
  Users,
  XCircle,
  Zap,
  ChevronRight,
  ExternalLink,
  FileText,
  History,
  Play,
  Pause
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SystemAlert {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low" | "info"
  status: "active" | "acknowledged" | "resolved" | "muted"
  service: string
  timestamp: string
  acknowledgedBy?: string
  acknowledgedAt?: string
  resolvedBy?: string
  resolvedAt?: string
  assignedTo?: string
  incidentId?: string
  affectedUsers?: number
  tags: string[]
}

interface EscalationRule {
  id: string
  name: string
  condition: string
  timeThreshold: number
  severity: string[]
  escalateTo: string[]
  enabled: boolean
}

interface ResponseTeam {
  id: string
  name: string
  role: string
  avatar: string
  status: "available" | "busy" | "offline"
  expertise: string[]
  currentIncidents: number
}

interface IncidentHistory {
  id: string
  title: string
  severity: string
  duration: string
  resolvedAt: string
  responders: string[]
  rootCause: string
  resolution: string
}

const activeAlerts: SystemAlert[] = [
  {
    id: "alert-001",
    title: "High API Response Time",
    description: "API response time exceeded 500ms threshold for the past 5 minutes",
    severity: "high",
    status: "active",
    service: "API Gateway",
    timestamp: "2024-03-15T10:25:00Z",
    affectedUsers: 1234,
    tags: ["performance", "api", "latency"]
  },
  {
    id: "alert-002",
    title: "Database Connection Pool Warning",
    description: "Connection pool usage at 85% capacity",
    severity: "medium",
    status: "acknowledged",
    service: "Database",
    timestamp: "2024-03-15T10:20:00Z",
    acknowledgedBy: "John Doe",
    acknowledgedAt: "2024-03-15T10:22:00Z",
    assignedTo: "DBA Team",
    tags: ["database", "capacity"]
  },
  {
    id: "alert-003",
    title: "SSL Certificate Expiring Soon",
    description: "SSL certificate for api.annpale.com expires in 7 days",
    severity: "medium",
    status: "active",
    service: "Security",
    timestamp: "2024-03-15T09:00:00Z",
    tags: ["security", "certificate", "maintenance"]
  },
  {
    id: "alert-004",
    title: "Disk Space Low",
    description: "Server disk usage at 92% on production-server-03",
    severity: "critical",
    status: "active",
    service: "Infrastructure",
    timestamp: "2024-03-15T10:30:00Z",
    affectedUsers: 5000,
    tags: ["infrastructure", "storage", "critical"]
  }
]

const escalationRules: EscalationRule[] = [
  {
    id: "rule-001",
    name: "Critical Alert Escalation",
    condition: "Unacknowledged critical alerts",
    timeThreshold: 5,
    severity: ["critical"],
    escalateTo: ["On-call Engineer", "Engineering Manager", "CTO"],
    enabled: true
  },
  {
    id: "rule-002",
    name: "High Severity Escalation",
    condition: "Unresolved high severity alerts",
    timeThreshold: 15,
    severity: ["high"],
    escalateTo: ["Senior Engineer", "Team Lead"],
    enabled: true
  },
  {
    id: "rule-003",
    name: "Database Issues",
    condition: "Database-related alerts",
    timeThreshold: 10,
    severity: ["high", "critical"],
    escalateTo: ["DBA Team", "Database Lead"],
    enabled: true
  }
]

const responseTeam: ResponseTeam[] = [
  {
    id: "member-001",
    name: "Sarah Chen",
    role: "Senior SRE",
    avatar: "/placeholder-avatar.jpg",
    status: "available",
    expertise: ["Infrastructure", "Kubernetes", "Monitoring"],
    currentIncidents: 1
  },
  {
    id: "member-002",
    name: "Mike Johnson",
    role: "Database Administrator",
    avatar: "/placeholder-avatar.jpg",
    status: "busy",
    expertise: ["PostgreSQL", "Performance", "Replication"],
    currentIncidents: 2
  },
  {
    id: "member-003",
    name: "Emily Rodriguez",
    role: "DevOps Engineer",
    avatar: "/placeholder-avatar.jpg",
    status: "available",
    expertise: ["CI/CD", "AWS", "Automation"],
    currentIncidents: 0
  }
]

const incidentHistory: IncidentHistory[] = [
  {
    id: "inc-001",
    title: "Database Outage",
    severity: "critical",
    duration: "45 minutes",
    resolvedAt: "2024-03-10T15:30:00Z",
    responders: ["Mike Johnson", "Sarah Chen"],
    rootCause: "Deadlock in transaction processing",
    resolution: "Rolled back problematic transaction and optimized query"
  },
  {
    id: "inc-002",
    title: "CDN Performance Degradation",
    severity: "high",
    duration: "2 hours",
    resolvedAt: "2024-03-08T12:00:00Z",
    responders: ["Emily Rodriguez"],
    rootCause: "Misconfigured cache headers",
    resolution: "Updated cache configuration and purged CDN cache"
  }
]

export function AlertManagement() {
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-blue-100 text-blue-800"
      case "info": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <Siren className="h-4 w-4 text-red-600" />
      case "high": return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "medium": return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "low": return <Info className="h-4 w-4 text-blue-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Bell className="h-4 w-4 text-red-600" />
      case "acknowledged": return <Clock className="h-4 w-4 text-yellow-600" />
      case "resolved": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "muted": return <BellOff className="h-4 w-4 text-gray-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800"
      case "busy": return "bg-yellow-100 text-yellow-800"
      case "offline": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredAlerts = activeAlerts.filter(alert => {
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSeverity && matchesStatus && matchesSearch
  })

  const activeCount = activeAlerts.filter(a => a.status === "active").length
  const criticalCount = activeAlerts.filter(a => a.severity === "critical" && a.status === "active").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Alert Management</h2>
          <p className="text-gray-600">Monitor and respond to system alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="gap-1">
            <Siren className="h-3 w-3" />
            {criticalCount} Critical
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Bell className="h-3 w-3" />
            {activeCount} Active
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      {criticalCount > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <Siren className="h-4 w-4" />
          <AlertTitle>Critical Alerts Active</AlertTitle>
          <AlertDescription>
            {criticalCount} critical alert{criticalCount > 1 ? 's' : ''} require{criticalCount === 1 ? 's' : ''} immediate attention.
            Response team has been notified.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="escalation">Escalation</TabsTrigger>
          <TabsTrigger value="team">Response Team</TabsTrigger>
          <TabsTrigger value="history">Incident History</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="muted">Muted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alert List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Alert Queue</CardTitle>
              <CardDescription>Real-time system alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={cn(
                      "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
                      alert.severity === "critical" && "border-red-500 bg-red-50",
                      alert.severity === "high" && "border-orange-500 bg-orange-50"
                    )}
                    onClick={() => {
                      setSelectedAlert(alert)
                      setIsAlertDialogOpen(true)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(alert.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{alert.title}</h4>
                            {getStatusIcon(alert.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {alert.service}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                            {alert.affectedUsers && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {alert.affectedUsers.toLocaleString()} users affected
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {alert.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        {alert.assignedTo && (
                          <Badge variant="outline" className="text-xs">
                            <User className="h-3 w-3 mr-1" />
                            {alert.assignedTo}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Escalation Rules</CardTitle>
              <CardDescription>Automated alert escalation procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {escalationRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {rule.name}
                          {rule.enabled ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Disabled</Badge>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{rule.condition}</p>
                      </div>
                      <Switch checked={rule.enabled} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Time Threshold</p>
                        <p className="font-medium">{rule.timeThreshold} minutes</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Severity Levels</p>
                        <div className="flex gap-1 mt-1">
                          {rule.severity.map((sev) => (
                            <Badge key={sev} variant="outline" className="text-xs">
                              {sev}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Escalate To</p>
                        <div className="space-y-1 mt-1">
                          {rule.escalateTo.map((person, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <ChevronRight className="h-3 w-3" />
                              <span className="text-xs">{person}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Team Status</CardTitle>
              <CardDescription>On-call engineers and incident responders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {responseTeam.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200" />
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-600">Expertise</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {member.expertise.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-gray-600">Active Incidents</span>
                          <Badge variant="outline">{member.currentIncidents}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incident History</CardTitle>
              <CardDescription>Past incidents and resolutions for reference</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Resolved</TableHead>
                    <TableHead>Responders</TableHead>
                    <TableHead>Root Cause</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidentHistory.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">{incident.title}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{incident.duration}</TableCell>
                      <TableCell>{new Date(incident.resolvedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {incident.responders.slice(0, 2).map((responder, idx) => (
                            <div key={idx} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white" title={responder} />
                          ))}
                          {incident.responders.length > 2 && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              +{incident.responders.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={incident.rootCause}>
                        {incident.rootCause}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure alert notification channels and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive alerts via email</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Slack Integration</p>
                        <p className="text-sm text-gray-600">Send alerts to #incidents channel</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Phone Calls</p>
                        <p className="text-sm text-gray-600">Critical alerts only</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Notification Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="critical" defaultChecked />
                      <Label htmlFor="critical">Critical alerts (immediate)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="high" defaultChecked />
                      <Label htmlFor="high">High severity alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="medium" defaultChecked />
                      <Label htmlFor="medium">Medium severity alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="low" />
                      <Label htmlFor="low">Low severity alerts</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert Details Dialog */}
      <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription>
              Review alert information and take action
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{selectedAlert.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{selectedAlert.description}</p>
                  </div>
                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                    {selectedAlert.severity}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Service</p>
                    <p className="font-medium">{selectedAlert.service}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium">{selectedAlert.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Triggered</p>
                    <p className="font-medium">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Affected Users</p>
                    <p className="font-medium">{selectedAlert.affectedUsers?.toLocaleString() || 'Unknown'}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label>Assign To</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Chen</SelectItem>
                    <SelectItem value="mike">Mike Johnson</SelectItem>
                    <SelectItem value="emily">Emily Rodriguez</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea placeholder="Add notes about this alert..." rows={3} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAlertDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline">
              <BellOff className="h-4 w-4 mr-2" />
              Mute
            </Button>
            <Button>
              <CheckCircle className="h-4 w-4 mr-2" />
              Acknowledge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}