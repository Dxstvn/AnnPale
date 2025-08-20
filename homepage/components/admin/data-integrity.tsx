"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  Database,
  HardDrive,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  Clock,
  Zap,
  Activity,
  TrendingUp,
  FileCheck,
  FilePlus,
  FileX,
  GitBranch,
  GitCommit,
  GitMerge,
  Hash,
  Lock,
  Unlock,
  Server,
  Archive,
  CloudOff,
  Cloud,
  AlertCircle,
  Info,
  Play,
  Pause,
  RotateCcw,
  Save,
  Search,
  Settings,
  Terminal
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DataChange {
  id: string
  timestamp: string
  table: string
  recordId: string
  operation: "insert" | "update" | "delete"
  user: string
  fields: {
    name: string
    oldValue: any
    newValue: any
  }[]
  verified: boolean
  hash: string
}

interface BackupStatus {
  id: string
  name: string
  type: "full" | "incremental" | "differential"
  status: "completed" | "in_progress" | "failed" | "scheduled"
  size: string
  duration: string
  timestamp: string
  location: string
  encrypted: boolean
  verified: boolean
  retention: string
}

interface ConsistencyCheck {
  id: string
  name: string
  type: string
  status: "passed" | "failed" | "warning"
  lastRun: string
  nextRun: string
  errors: number
  warnings: number
  autoFix: boolean
  details?: string
}

interface RecoveryPoint {
  id: string
  name: string
  timestamp: string
  type: "automatic" | "manual"
  size: string
  rpo: string // Recovery Point Objective
  rto: string // Recovery Time Objective
  tested: boolean
  testResult?: "success" | "failed"
}

interface ValidationRule {
  id: string
  name: string
  table: string
  field: string
  rule: string
  enabled: boolean
  violations: number
  lastCheck: string
  severity: "low" | "medium" | "high" | "critical"
}

const dataChanges: DataChange[] = [
  {
    id: "change-001",
    timestamp: "2024-03-15T14:30:00Z",
    table: "users",
    recordId: "user_1234",
    operation: "update",
    user: "admin@annpale.com",
    fields: [
      { name: "email", oldValue: "old@example.com", newValue: "new@example.com" },
      { name: "verified", oldValue: false, newValue: true }
    ],
    verified: true,
    hash: "a3f5e8c9d2b1"
  },
  {
    id: "change-002",
    timestamp: "2024-03-15T14:25:00Z",
    table: "transactions",
    recordId: "txn_5678",
    operation: "insert",
    user: "system",
    fields: [
      { name: "amount", oldValue: null, newValue: 150.00 },
      { name: "status", oldValue: null, newValue: "completed" }
    ],
    verified: true,
    hash: "b7d4f2a8e1c3"
  },
  {
    id: "change-003",
    timestamp: "2024-03-15T14:20:00Z",
    table: "videos",
    recordId: "video_9012",
    operation: "delete",
    user: "moderator@annpale.com",
    fields: [
      { name: "status", oldValue: "flagged", newValue: null }
    ],
    verified: false,
    hash: "c9e3a7b5f4d2"
  }
]

const backups: BackupStatus[] = [
  {
    id: "backup-001",
    name: "Daily Full Backup",
    type: "full",
    status: "completed",
    size: "45.2 GB",
    duration: "12 min",
    timestamp: "2024-03-15T02:00:00Z",
    location: "AWS S3 - us-east-1",
    encrypted: true,
    verified: true,
    retention: "30 days"
  },
  {
    id: "backup-002",
    name: "Hourly Incremental",
    type: "incremental",
    status: "completed",
    size: "234 MB",
    duration: "45 sec",
    timestamp: "2024-03-15T14:00:00Z",
    location: "AWS S3 - us-east-1",
    encrypted: true,
    verified: true,
    retention: "7 days"
  },
  {
    id: "backup-003",
    name: "Weekly Archive",
    type: "full",
    status: "in_progress",
    size: "42.1 GB",
    duration: "8 min",
    timestamp: "2024-03-15T14:30:00Z",
    location: "Glacier",
    encrypted: true,
    verified: false,
    retention: "1 year"
  }
]

const consistencyChecks: ConsistencyCheck[] = [
  {
    id: "check-001",
    name: "Foreign Key Integrity",
    type: "Referential Integrity",
    status: "passed",
    lastRun: "2024-03-15T14:00:00Z",
    nextRun: "2024-03-15T15:00:00Z",
    errors: 0,
    warnings: 0,
    autoFix: true
  },
  {
    id: "check-002",
    name: "Data Type Validation",
    type: "Schema Validation",
    status: "warning",
    lastRun: "2024-03-15T13:30:00Z",
    nextRun: "2024-03-15T14:30:00Z",
    errors: 0,
    warnings: 3,
    autoFix: false,
    details: "3 fields contain unexpected null values"
  },
  {
    id: "check-003",
    name: "Transaction Balance",
    type: "Business Logic",
    status: "passed",
    lastRun: "2024-03-15T14:15:00Z",
    nextRun: "2024-03-15T14:45:00Z",
    errors: 0,
    warnings: 0,
    autoFix: true
  },
  {
    id: "check-004",
    name: "Duplicate Detection",
    type: "Data Quality",
    status: "failed",
    lastRun: "2024-03-15T14:20:00Z",
    nextRun: "2024-03-15T14:50:00Z",
    errors: 2,
    warnings: 5,
    autoFix: false,
    details: "2 duplicate user records detected"
  }
]

const recoveryPoints: RecoveryPoint[] = [
  {
    id: "rp-001",
    name: "Production Snapshot",
    timestamp: "2024-03-15T14:00:00Z",
    type: "automatic",
    size: "45.2 GB",
    rpo: "1 hour",
    rto: "15 minutes",
    tested: true,
    testResult: "success"
  },
  {
    id: "rp-002",
    name: "Pre-Deployment Backup",
    timestamp: "2024-03-15T10:00:00Z",
    type: "manual",
    size: "44.8 GB",
    rpo: "0 minutes",
    rto: "30 minutes",
    tested: true,
    testResult: "success"
  },
  {
    id: "rp-003",
    name: "Daily Checkpoint",
    timestamp: "2024-03-15T02:00:00Z",
    type: "automatic",
    size: "44.5 GB",
    rpo: "24 hours",
    rto: "1 hour",
    tested: false
  }
]

const validationRules: ValidationRule[] = [
  {
    id: "rule-001",
    name: "Email Format",
    table: "users",
    field: "email",
    rule: "REGEX: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    enabled: true,
    violations: 0,
    lastCheck: "2024-03-15T14:00:00Z",
    severity: "high"
  },
  {
    id: "rule-002",
    name: "Amount Range",
    table: "transactions",
    field: "amount",
    rule: "BETWEEN 0.01 AND 10000.00",
    enabled: true,
    violations: 2,
    lastCheck: "2024-03-15T14:00:00Z",
    severity: "critical"
  },
  {
    id: "rule-003",
    name: "Date Consistency",
    table: "bookings",
    field: "end_date",
    rule: "end_date > start_date",
    enabled: true,
    violations: 0,
    lastCheck: "2024-03-15T14:00:00Z",
    severity: "medium"
  }
]

export function DataIntegrity() {
  const [activeRecovery, setActiveRecovery] = useState<string | null>(null)
  const [runningCheck, setRunningCheck] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
      case "completed":
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
      case "in_progress":
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-blue-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-orange-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const integrityScore = {
    overall: 94,
    changes: dataChanges.filter(c => c.verified).length / dataChanges.length * 100,
    backups: backups.filter(b => b.status === "completed" && b.verified).length / backups.length * 100,
    consistency: consistencyChecks.filter(c => c.status === "passed").length / consistencyChecks.length * 100,
    validation: 100 - (validationRules.reduce((acc, r) => acc + r.violations, 0) / validationRules.length)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Integrity Management</h2>
          <p className="text-gray-600">Monitor data consistency, backups, and recovery procedures</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Run Full Check
          </Button>
        </div>
      </div>

      {/* Integrity Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Integrity Score</p>
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{integrityScore.overall}%</p>
            <Progress value={integrityScore.overall} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Verified Changes</p>
              <FileCheck className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{Math.round(integrityScore.changes)}%</p>
            <p className="text-xs text-gray-500">Last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Backup Health</p>
              <Cloud className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{Math.round(integrityScore.backups)}%</p>
            <p className="text-xs text-gray-500">3 active</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Consistency</p>
              <GitMerge className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold">{Math.round(integrityScore.consistency)}%</p>
            <p className="text-xs text-gray-500">4 checks</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Validation</p>
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{Math.round(integrityScore.validation)}%</p>
            <p className="text-xs text-gray-500">2 violations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="changes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="changes">Change Tracking</TabsTrigger>
          <TabsTrigger value="backups">Backup Verification</TabsTrigger>
          <TabsTrigger value="consistency">Consistency Checks</TabsTrigger>
          <TabsTrigger value="recovery">Recovery Procedures</TabsTrigger>
          <TabsTrigger value="validation">Validation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="changes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Change Tracking</CardTitle>
              <CardDescription>Audit trail of all data modifications with integrity verification</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Operation</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Hash</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataChanges.map((change) => (
                    <TableRow key={change.id}>
                      <TableCell className="text-sm">
                        {new Date(change.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          <p>{change.table}</p>
                          <p className="text-xs text-gray-500">{change.recordId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {change.operation === "insert" && <FilePlus className="h-4 w-4 text-green-600" />}
                          {change.operation === "update" && <RefreshCw className="h-4 w-4 text-blue-600" />}
                          {change.operation === "delete" && <FileX className="h-4 w-4 text-red-600" />}
                          <span className="text-sm">{change.operation}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{change.user}</TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          {change.fields.slice(0, 2).map((field, idx) => (
                            <div key={idx}>
                              <span className="font-medium">{field.name}:</span>{" "}
                              <span className="text-gray-600">
                                {JSON.stringify(field.oldValue)} → {JSON.stringify(field.newValue)}
                              </span>
                            </div>
                          ))}
                          {change.fields.length > 2 && (
                            <span className="text-gray-500">+{change.fields.length - 2} more</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                          {change.hash}
                        </code>
                      </TableCell>
                      <TableCell>
                        {change.verified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Search className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup Verification Status</CardTitle>
              <CardDescription>Monitor backup integrity and restoration capability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div key={backup.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{backup.name}</span>
                          <Badge className={getStatusColor(backup.status)}>
                            {backup.status}
                          </Badge>
                          <Badge variant="outline">{backup.type}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Size: </span>
                            <span className="font-medium">{backup.size}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Duration: </span>
                            <span className="font-medium">{backup.duration}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Location: </span>
                            <span className="font-medium">{backup.location}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Retention: </span>
                            <span className="font-medium">{backup.retention}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            {backup.encrypted ? (
                              <Lock className="h-3 w-3 text-green-600" />
                            ) : (
                              <Unlock className="h-3 w-3 text-red-600" />
                            )}
                            <span>{backup.encrypted ? "Encrypted" : "Not Encrypted"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {backup.verified ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-yellow-600" />
                            )}
                            <span>{backup.verified ? "Verified" : "Pending Verification"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-sm text-gray-500">
                          {new Date(backup.timestamp).toLocaleString()}
                        </p>
                        {backup.status === "completed" && (
                          <Button variant="outline" size="sm">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Test Restore
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consistency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consistency Checks</CardTitle>
              <CardDescription>Automated data consistency and integrity validation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consistencyChecks.map((check) => (
                  <div key={check.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {check.status === "passed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                          {check.status === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                          {check.status === "failed" && <XCircle className="h-5 w-5 text-red-600" />}
                          <span className="font-medium">{check.name}</span>
                          <Badge className={getStatusColor(check.status)}>
                            {check.status}
                          </Badge>
                          <Badge variant="outline">{check.type}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Errors: </span>
                            <span className={cn("font-medium", check.errors > 0 && "text-red-600")}>
                              {check.errors}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Warnings: </span>
                            <span className={cn("font-medium", check.warnings > 0 && "text-yellow-600")}>
                              {check.warnings}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Auto-Fix: </span>
                            <span className="font-medium">{check.autoFix ? "Enabled" : "Disabled"}</span>
                          </div>
                        </div>
                        {check.details && (
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>{check.details}</AlertDescription>
                          </Alert>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Last run: {new Date(check.lastRun).toLocaleString()}</span>
                          <span>Next run: {new Date(check.nextRun).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRunningCheck(check.id)}
                          disabled={runningCheck === check.id}
                        >
                          {runningCheck === check.id ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          Run Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recovery" className="space-y-4">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertTitle>Recovery Readiness</AlertTitle>
            <AlertDescription>
              System is ready for recovery. RPO: 1 hour | RTO: 15 minutes | Last test: 2 hours ago
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Recovery Points</CardTitle>
              <CardDescription>Available restore points for disaster recovery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recoveryPoints.map((point) => (
                  <div key={point.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Archive className="h-5 w-5 text-purple-600" />
                          <span className="font-medium">{point.name}</span>
                          <Badge variant={point.type === "automatic" ? "default" : "outline"}>
                            {point.type}
                          </Badge>
                          {point.tested && (
                            <Badge className={point.testResult === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              Tested: {point.testResult}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Size: </span>
                            <span className="font-medium">{point.size}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">RPO: </span>
                            <span className="font-medium">{point.rpo}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">RTO: </span>
                            <span className="font-medium">{point.rto}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Created: </span>
                            <span className="font-medium">{new Date(point.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!point.tested && (
                          <Button variant="outline" size="sm">
                            <Terminal className="h-4 w-4 mr-2" />
                            Test
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveRecovery(point.id)}
                          disabled={activeRecovery === point.id}
                        >
                          {activeRecovery === point.id ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4 mr-2" />
                          )}
                          Restore
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation Rules</CardTitle>
              <CardDescription>Data validation rules and constraint enforcement</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Table/Field</TableHead>
                    <TableHead>Rule Definition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Violations</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Last Check</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validationRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          <p>{rule.table}</p>
                          <p className="text-xs text-gray-500">{rule.field}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {rule.rule}
                        </code>
                      </TableCell>
                      <TableCell>
                        {rule.enabled ? (
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        ) : (
                          <Badge variant="secondary">Disabled</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={cn("font-medium", rule.violations > 0 && "text-red-600")}>
                          {rule.violations}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn("font-medium", getSeverityColor(rule.severity))}>
                          {rule.severity}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(rule.lastCheck).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}