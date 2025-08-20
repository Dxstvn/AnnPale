"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  User,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Server,
  Database,
  Key,
  FileWarning,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  UserX,
  UserCheck,
  LogIn,
  LogOut,
  RefreshCw,
  Download,
  Filter,
  Search,
  AlertCircle,
  Info,
  Zap,
  Fingerprint,
  Map
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AccessAttempt {
  id: string
  timestamp: string
  user: string
  ipAddress: string
  location: string
  device: string
  action: string
  resource: string
  result: "success" | "failed" | "blocked"
  riskScore: number
  suspicious: boolean
  details?: string
}

interface PermissionChange {
  id: string
  timestamp: string
  admin: string
  targetUser: string
  action: "grant" | "revoke" | "modify"
  permission: string
  reason: string
  approved: boolean
  approver?: string
}

interface SuspiciousActivity {
  id: string
  timestamp: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  source: string
  target: string
  description: string
  indicators: string[]
  status: "investigating" | "confirmed" | "false_positive" | "mitigated"
  assignedTo?: string
}

interface DataAccess {
  id: string
  timestamp: string
  user: string
  dataType: string
  operation: "read" | "write" | "delete" | "export"
  recordCount: number
  sensitivity: "public" | "internal" | "confidential" | "restricted"
  authorized: boolean
  justification?: string
}

interface PrivacyIncident {
  id: string
  timestamp: string
  type: string
  affectedUsers: number
  dataTypes: string[]
  severity: "low" | "medium" | "high" | "critical"
  status: "detected" | "contained" | "resolved" | "reported"
  reportedToAuthorities: boolean
  breachNotificationSent: boolean
}

const accessAttempts: AccessAttempt[] = [
  {
    id: "access-001",
    timestamp: "2024-03-15T14:30:25Z",
    user: "john.doe@example.com",
    ipAddress: "192.168.1.100",
    location: "New York, US",
    device: "Chrome/Windows",
    action: "LOGIN",
    resource: "Admin Panel",
    result: "success",
    riskScore: 10,
    suspicious: false
  },
  {
    id: "access-002",
    timestamp: "2024-03-15T14:28:15Z",
    user: "unknown",
    ipAddress: "185.220.101.45",
    location: "Unknown",
    device: "curl/7.68.0",
    action: "BRUTE_FORCE",
    resource: "API",
    result: "blocked",
    riskScore: 95,
    suspicious: true,
    details: "Multiple failed attempts from TOR exit node"
  },
  {
    id: "access-003",
    timestamp: "2024-03-15T14:25:42Z",
    user: "sarah.chen@annpale.com",
    ipAddress: "10.0.0.50",
    location: "Office Network",
    device: "Safari/MacOS",
    action: "MFA_VERIFICATION",
    resource: "Finance Dashboard",
    result: "success",
    riskScore: 5,
    suspicious: false
  },
  {
    id: "access-004",
    timestamp: "2024-03-15T14:20:18Z",
    user: "admin@test.com",
    ipAddress: "203.45.67.89",
    location: "Beijing, CN",
    device: "Unknown",
    action: "SQL_INJECTION",
    resource: "Database",
    result: "blocked",
    riskScore: 100,
    suspicious: true,
    details: "Attempted SQL injection in login form"
  }
]

const permissionChanges: PermissionChange[] = [
  {
    id: "perm-001",
    timestamp: "2024-03-15T13:00:00Z",
    admin: "sarah.chen@annpale.com",
    targetUser: "new.employee@annpale.com",
    action: "grant",
    permission: "content_moderation",
    reason: "New team member onboarding",
    approved: true,
    approver: "james.wilson@annpale.com"
  },
  {
    id: "perm-002",
    timestamp: "2024-03-15T12:30:00Z",
    admin: "james.wilson@annpale.com",
    targetUser: "contractor@external.com",
    action: "revoke",
    permission: "financial_reports",
    reason: "Contract ended",
    approved: true,
    approver: "cfo@annpale.com"
  }
]

const suspiciousActivities: SuspiciousActivity[] = [
  {
    id: "sus-001",
    timestamp: "2024-03-15T14:15:00Z",
    type: "Unusual Access Pattern",
    severity: "high",
    source: "user_8923",
    target: "User Database",
    description: "Mass data export detected outside business hours",
    indicators: ["Off-hours access", "Large data volume", "New IP address"],
    status: "investigating",
    assignedTo: "security-team"
  },
  {
    id: "sus-002",
    timestamp: "2024-03-15T13:45:00Z",
    type: "Privilege Escalation Attempt",
    severity: "critical",
    source: "185.220.101.45",
    target: "Admin API",
    description: "Multiple attempts to access admin endpoints without authorization",
    indicators: ["Unauthorized access", "Parameter manipulation", "TOR network"],
    status: "mitigated"
  },
  {
    id: "sus-003",
    timestamp: "2024-03-15T13:20:00Z",
    type: "Account Takeover",
    severity: "high",
    source: "unknown",
    target: "user_5647",
    description: "Successful login from unusual location after password reset",
    indicators: ["Geographic anomaly", "Device change", "Behavioral change"],
    status: "confirmed",
    assignedTo: "incident-response"
  }
]

const dataAccessLogs: DataAccess[] = [
  {
    id: "data-001",
    timestamp: "2024-03-15T14:00:00Z",
    user: "data-analyst@annpale.com",
    dataType: "User Analytics",
    operation: "read",
    recordCount: 5000,
    sensitivity: "internal",
    authorized: true,
    justification: "Monthly report generation"
  },
  {
    id: "data-002",
    timestamp: "2024-03-15T13:30:00Z",
    user: "support@annpale.com",
    dataType: "Customer PII",
    operation: "export",
    recordCount: 1,
    sensitivity: "confidential",
    authorized: true,
    justification: "GDPR data request"
  },
  {
    id: "data-003",
    timestamp: "2024-03-15T13:00:00Z",
    user: "contractor@external.com",
    dataType: "Financial Records",
    operation: "read",
    recordCount: 100,
    sensitivity: "restricted",
    authorized: false
  }
]

export function SecurityMonitoring() {
  const [selectedTab, setSelectedTab] = useState("access")
  const [timeRange, setTimeRange] = useState("24h")

  const getSeverityColor = (severity: string) => {
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

  const getResultColor = (result: string) => {
    switch (result) {
      case "success":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-yellow-100 text-yellow-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return "text-red-600"
    if (score >= 60) return "text-orange-600"
    if (score >= 40) return "text-yellow-600"
    return "text-green-600"
  }

  const securityMetrics = {
    blockedAttempts: accessAttempts.filter(a => a.result === "blocked").length,
    suspiciousActivities: suspiciousActivities.filter(a => a.status === "investigating").length,
    unauthorizedAccess: dataAccessLogs.filter(d => !d.authorized).length,
    riskScore: 72,
    trend: "decreasing"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Monitoring</h2>
          <p className="text-gray-600">Real-time security event monitoring and threat detection</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Security Alerts */}
      {securityMetrics.suspiciousActivities > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Security Alert</AlertTitle>
          <AlertDescription>
            {securityMetrics.suspiciousActivities} suspicious activities detected requiring immediate investigation.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Score</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{securityMetrics.riskScore}</p>
                  {securityMetrics.trend === "decreasing" ? (
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <Progress value={100 - securityMetrics.riskScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blocked Attempts</p>
                <p className="text-2xl font-bold text-red-600">{securityMetrics.blockedAttempts}</p>
              </div>
              <ShieldOff className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Threats</p>
                <p className="text-2xl font-bold text-orange-600">{securityMetrics.suspiciousActivities}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unauthorized Access</p>
                <p className="text-2xl font-bold text-yellow-600">{securityMetrics.unauthorizedAccess}</p>
              </div>
              <UserX className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold">243</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="access" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="access">Access Logs</TabsTrigger>
          <TabsTrigger value="permissions">Permission Changes</TabsTrigger>
          <TabsTrigger value="suspicious">Suspicious Activity</TabsTrigger>
          <TabsTrigger value="data">Data Access</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Attempt Logs</CardTitle>
              <CardDescription>Monitor login attempts and access patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessAttempts.map((attempt) => (
                    <TableRow key={attempt.id} className={attempt.suspicious ? "bg-red-50" : ""}>
                      <TableCell className="text-sm">
                        {new Date(attempt.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{attempt.user}</p>
                          <p className="text-gray-500">{attempt.ipAddress}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {attempt.action === "LOGIN" && <LogIn className="h-4 w-4" />}
                          {attempt.action === "LOGOUT" && <LogOut className="h-4 w-4" />}
                          {attempt.action === "MFA_VERIFICATION" && <Fingerprint className="h-4 w-4" />}
                          {attempt.action === "BRUTE_FORCE" && <ShieldAlert className="h-4 w-4 text-red-600" />}
                          {attempt.action === "SQL_INJECTION" && <FileWarning className="h-4 w-4 text-red-600" />}
                          <span className="text-sm">{attempt.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Map className="h-3 w-3" />
                          <span className="text-sm">{attempt.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{attempt.device}</TableCell>
                      <TableCell>
                        <Badge className={getResultColor(attempt.result)}>
                          {attempt.result}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn("font-medium", getRiskScoreColor(attempt.riskScore))}>
                          {attempt.riskScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Change Audit</CardTitle>
              <CardDescription>Track all permission and role modifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissionChanges.map((change) => (
                  <div key={change.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {change.action === "grant" && <Unlock className="h-4 w-4 text-green-600" />}
                          {change.action === "revoke" && <Lock className="h-4 w-4 text-red-600" />}
                          {change.action === "modify" && <Key className="h-4 w-4 text-yellow-600" />}
                          <span className="font-medium">
                            {change.action === "grant" && "Permission Granted"}
                            {change.action === "revoke" && "Permission Revoked"}
                            {change.action === "modify" && "Permission Modified"}
                          </span>
                          <Badge>{change.permission}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Admin: </span>
                            <span className="font-medium">{change.admin}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Target User: </span>
                            <span className="font-medium">{change.targetUser}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Reason: </span>
                            <span>{change.reason}</span>
                          </div>
                          {change.approved && (
                            <div>
                              <span className="text-gray-600">Approved by: </span>
                              <span className="font-medium">{change.approver}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(change.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspicious" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suspicious Activity Detection</CardTitle>
              <CardDescription>AI-powered threat detection and anomaly monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suspiciousActivities.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-4 border-red-200 bg-red-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-red-600" />
                        <span className="font-medium">{activity.type}</span>
                        <Badge className={getSeverityColor(activity.severity)}>
                          {activity.severity}
                        </Badge>
                        <Badge variant="outline">
                          {activity.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{activity.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Source: </span>
                        <span className="font-mono">{activity.source}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Target: </span>
                        <span className="font-mono">{activity.target}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Indicators:</p>
                      <div className="flex flex-wrap gap-2">
                        {activity.indicators.map((indicator, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {activity.assignedTo && (
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-sm text-gray-600">Assigned to: </span>
                        <span className="text-sm font-medium">{activity.assignedTo}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Access Monitoring</CardTitle>
              <CardDescription>Track access to sensitive data and PII</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Operation</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Sensitivity</TableHead>
                    <TableHead>Authorized</TableHead>
                    <TableHead>Justification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataAccessLogs.map((log) => (
                    <TableRow key={log.id} className={!log.authorized ? "bg-red-50" : ""}>
                      <TableCell className="text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm font-medium">{log.user}</TableCell>
                      <TableCell className="text-sm">{log.dataType}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {log.operation === "read" && <Eye className="h-4 w-4" />}
                          {log.operation === "write" && <Edit className="h-4 w-4" />}
                          {log.operation === "delete" && <Trash2 className="h-4 w-4" />}
                          {log.operation === "export" && <Download className="h-4 w-4" />}
                          <span className="text-sm">{log.operation}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{log.recordCount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          log.sensitivity === "restricted" ? "destructive" :
                          log.sensitivity === "confidential" ? "default" :
                          "secondary"
                        }>
                          {log.sensitivity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.authorized ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{log.justification || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Privacy Compliance Status</AlertTitle>
            <AlertDescription>
              All privacy requirements are currently met. Last audit: March 10, 2024. Next scheduled audit: April 10, 2024.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Breach Detection</CardTitle>
              <CardDescription>Monitor for potential data breaches and privacy violations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShieldCheck className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-lg font-medium">No Privacy Breaches Detected</p>
                <p className="text-sm text-gray-600 mt-2">
                  System is actively monitoring for unauthorized data access and potential breaches
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}