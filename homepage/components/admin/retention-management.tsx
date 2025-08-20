"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Archive,
  Calendar,
  Clock,
  Database,
  FileText,
  HardDrive,
  Lock,
  Shield,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Save,
  Search,
  Filter,
  Folder,
  FolderOpen,
  File,
  FileCheck,
  FileX,
  Timer,
  Zap,
  TrendingDown,
  BarChart3,
  PieChart,
  AlertCircle,
  Scale,
  Gavel
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RetentionPolicy {
  id: string
  name: string
  dataType: string
  category: string
  retentionPeriod: string
  archivePeriod?: string
  purgeSchedule: string
  complianceStandard: string[]
  legalHold: boolean
  autoDelete: boolean
  lastUpdated: string
  status: "active" | "pending" | "expired"
}

interface ArchiveJob {
  id: string
  name: string
  dataType: string
  recordCount: number
  size: string
  createdAt: string
  scheduledFor: string
  status: "scheduled" | "in_progress" | "completed" | "failed"
  destination: string
  encrypted: boolean
  compressed: boolean
  compressionRatio?: string
}

interface PurgeSchedule {
  id: string
  name: string
  dataType: string
  criteria: string
  frequency: string
  lastRun: string
  nextRun: string
  recordsAffected: number
  status: "active" | "paused" | "disabled"
  requiresApproval: boolean
  approver?: string
}

interface LegalHold {
  id: string
  caseId: string
  caseName: string
  dataTypes: string[]
  startDate: string
  endDate?: string
  status: "active" | "released" | "pending"
  requestedBy: string
  approvedBy: string
  affectedRecords: number
  description: string
}

interface ComplianceVerification {
  id: string
  policy: string
  standard: string
  lastVerified: string
  nextVerification: string
  status: "compliant" | "non-compliant" | "pending"
  issues: string[]
  auditor?: string
}

const retentionPolicies: RetentionPolicy[] = [
  {
    id: "policy-001",
    name: "User Data Retention",
    dataType: "User Profiles",
    category: "Personal Data",
    retentionPeriod: "7 years",
    archivePeriod: "3 years",
    purgeSchedule: "Quarterly",
    complianceStandard: ["GDPR", "CCPA"],
    legalHold: false,
    autoDelete: true,
    lastUpdated: "2024-02-01",
    status: "active"
  },
  {
    id: "policy-002",
    name: "Financial Records",
    dataType: "Transactions",
    category: "Financial",
    retentionPeriod: "10 years",
    archivePeriod: "5 years",
    purgeSchedule: "Annual",
    complianceStandard: ["SOX", "PCI-DSS"],
    legalHold: true,
    autoDelete: false,
    lastUpdated: "2024-01-15",
    status: "active"
  },
  {
    id: "policy-003",
    name: "Security Logs",
    dataType: "Audit Logs",
    category: "Security",
    retentionPeriod: "2 years",
    purgeSchedule: "Monthly",
    complianceStandard: ["ISO 27001"],
    legalHold: false,
    autoDelete: true,
    lastUpdated: "2024-03-01",
    status: "active"
  },
  {
    id: "policy-004",
    name: "Content Moderation",
    dataType: "Flagged Content",
    category: "Content",
    retentionPeriod: "3 years",
    archivePeriod: "1 year",
    purgeSchedule: "Bi-annual",
    complianceStandard: ["Platform Policy"],
    legalHold: false,
    autoDelete: true,
    lastUpdated: "2024-02-15",
    status: "active"
  },
  {
    id: "policy-005",
    name: "System Logs",
    dataType: "Application Logs",
    category: "Technical",
    retentionPeriod: "1 year",
    purgeSchedule: "Weekly",
    complianceStandard: ["Internal Policy"],
    legalHold: false,
    autoDelete: true,
    lastUpdated: "2024-03-10",
    status: "active"
  }
]

const archiveJobs: ArchiveJob[] = [
  {
    id: "archive-001",
    name: "Q4 2023 User Data",
    dataType: "User Profiles",
    recordCount: 125000,
    size: "12.5 GB",
    createdAt: "2024-01-01",
    scheduledFor: "2024-04-01",
    status: "scheduled",
    destination: "AWS Glacier",
    encrypted: true,
    compressed: true,
    compressionRatio: "3:1"
  },
  {
    id: "archive-002",
    name: "2023 Financial Records",
    dataType: "Transactions",
    recordCount: 2500000,
    size: "45.2 GB",
    createdAt: "2024-01-15",
    scheduledFor: "2024-01-15",
    status: "completed",
    destination: "Cold Storage",
    encrypted: true,
    compressed: true,
    compressionRatio: "2.5:1"
  },
  {
    id: "archive-003",
    name: "Security Logs Archive",
    dataType: "Audit Logs",
    recordCount: 5000000,
    size: "8.3 GB",
    createdAt: "2024-03-15",
    scheduledFor: "2024-03-15",
    status: "in_progress",
    destination: "AWS S3 IA",
    encrypted: true,
    compressed: true,
    compressionRatio: "4:1"
  }
]

const purgeSchedules: PurgeSchedule[] = [
  {
    id: "purge-001",
    name: "Old Session Data",
    dataType: "User Sessions",
    criteria: "Age > 30 days",
    frequency: "Daily",
    lastRun: "2024-03-14",
    nextRun: "2024-03-15",
    recordsAffected: 15234,
    status: "active",
    requiresApproval: false
  },
  {
    id: "purge-002",
    name: "Expired Temp Files",
    dataType: "Temporary Files",
    criteria: "Age > 7 days",
    frequency: "Weekly",
    lastRun: "2024-03-10",
    nextRun: "2024-03-17",
    recordsAffected: 8923,
    status: "active",
    requiresApproval: false
  },
  {
    id: "purge-003",
    name: "Deleted User Data",
    dataType: "User Profiles",
    criteria: "Deletion requested > 30 days ago",
    frequency: "Monthly",
    lastRun: "2024-02-15",
    nextRun: "2024-03-15",
    recordsAffected: 234,
    status: "paused",
    requiresApproval: true,
    approver: "DPO"
  }
]

const legalHolds: LegalHold[] = [
  {
    id: "hold-001",
    caseId: "CASE-2024-001",
    caseName: "Smith vs AnnPale",
    dataTypes: ["User Data", "Transactions", "Communications"],
    startDate: "2024-01-15",
    status: "active",
    requestedBy: "Legal Department",
    approvedBy: "General Counsel",
    affectedRecords: 5432,
    description: "Litigation hold for ongoing dispute"
  },
  {
    id: "hold-002",
    caseId: "REG-2024-002",
    caseName: "Regulatory Investigation",
    dataTypes: ["Financial Records", "Audit Logs"],
    startDate: "2024-02-01",
    endDate: "2024-03-01",
    status: "released",
    requestedBy: "Compliance Team",
    approvedBy: "Chief Compliance Officer",
    affectedRecords: 12890,
    description: "Regulatory audit documentation preservation"
  }
]

const complianceVerifications: ComplianceVerification[] = [
  {
    id: "verify-001",
    policy: "User Data Retention",
    standard: "GDPR",
    lastVerified: "2024-02-15",
    nextVerification: "2024-05-15",
    status: "compliant",
    issues: []
  },
  {
    id: "verify-002",
    policy: "Financial Records",
    standard: "SOX",
    lastVerified: "2024-01-31",
    nextVerification: "2024-04-30",
    status: "compliant",
    issues: [],
    auditor: "External Auditor"
  },
  {
    id: "verify-003",
    policy: "Security Logs",
    standard: "ISO 27001",
    lastVerified: "2024-03-01",
    nextVerification: "2024-06-01",
    status: "pending",
    issues: ["Log rotation not configured properly"],
    auditor: "Internal Audit"
  }
]

export function RetentionManagement() {
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
      case "compliant":
        return "bg-green-100 text-green-800"
      case "pending":
      case "scheduled":
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
      case "failed":
      case "non-compliant":
      case "disabled":
        return "bg-red-100 text-red-800"
      case "released":
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const storageMetrics = {
    totalData: "2.5 TB",
    activeData: "1.8 TB",
    archivedData: "600 GB",
    scheduledForPurge: "100 GB",
    underLegalHold: "50 GB",
    complianceScore: 96
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Retention Management</h2>
          <p className="text-gray-600">Data retention policies, archival, and legal compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Policy
          </Button>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Data</p>
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{storageMetrics.totalData}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Active</p>
              <Folder className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{storageMetrics.activeData}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Archived</p>
              <Archive className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold">{storageMetrics.archivedData}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">To Purge</p>
              <Trash2 className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">{storageMetrics.scheduledForPurge}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Legal Hold</p>
              <Gavel className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold">{storageMetrics.underLegalHold}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Compliance</p>
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{storageMetrics.complianceScore}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="policies">Retention Policies</TabsTrigger>
          <TabsTrigger value="archive">Archive Jobs</TabsTrigger>
          <TabsTrigger value="purge">Purge Schedules</TabsTrigger>
          <TabsTrigger value="legal">Legal Holds</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Data Retention Policies</CardTitle>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="personal">Personal Data</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Name</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Retention</TableHead>
                    <TableHead>Archive</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Legal Hold</TableHead>
                    <TableHead>Auto Delete</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retentionPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">{policy.name}</TableCell>
                      <TableCell>{policy.dataType}</TableCell>
                      <TableCell>{policy.retentionPeriod}</TableCell>
                      <TableCell>{policy.archivePeriod || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {policy.complianceStandard.map((std) => (
                            <Badge key={std} variant="outline" className="text-xs">
                              {std}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {policy.legalHold ? (
                          <Lock className="h-4 w-4 text-red-600" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch checked={policy.autoDelete} disabled />
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(policy.status)}>
                          {policy.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPolicy(policy.id)}
                        >
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

        <TabsContent value="archive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Archive Jobs</CardTitle>
              <CardDescription>Scheduled and completed data archival operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {archiveJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Archive className="h-5 w-5 text-purple-600" />
                          <span className="font-medium">{job.name}</span>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Records: </span>
                            <span className="font-medium">{job.recordCount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Size: </span>
                            <span className="font-medium">{job.size}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Destination: </span>
                            <span className="font-medium">{job.destination}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Scheduled: </span>
                            <span className="font-medium">{job.scheduledFor}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            {job.encrypted ? (
                              <Lock className="h-3 w-3 text-green-600" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-red-600" />
                            )}
                            <span>{job.encrypted ? "Encrypted" : "Not Encrypted"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {job.compressed ? (
                              <FileCheck className="h-3 w-3 text-blue-600" />
                            ) : (
                              <File className="h-3 w-3 text-gray-600" />
                            )}
                            <span>
                              {job.compressed ? `Compressed (${job.compressionRatio})` : "Not Compressed"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {job.status === "in_progress" && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-2">Processing...</p>
                          <Progress value={65} className="w-32" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purge" className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Purge Warning</AlertTitle>
            <AlertDescription>
              Data purging is irreversible. All purge operations are logged and require appropriate authorization.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Purge Schedules</CardTitle>
              <CardDescription>Automated data deletion schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purgeSchedules.map((schedule) => (
                  <div key={schedule.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-5 w-5 text-red-600" />
                          <span className="font-medium">{schedule.name}</span>
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                          {schedule.requiresApproval && (
                            <Badge variant="outline">
                              Requires Approval
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Criteria:</span> {schedule.criteria}
                        </p>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Data Type: </span>
                            <span className="font-medium">{schedule.dataType}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Frequency: </span>
                            <span className="font-medium">{schedule.frequency}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Run: </span>
                            <span className="font-medium">{schedule.lastRun}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Next Run: </span>
                            <span className="font-medium">{schedule.nextRun}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          <span>
                            {schedule.recordsAffected.toLocaleString()} records will be affected
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {schedule.status === "paused" && (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                        )}
                        {schedule.status === "active" && (
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
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

        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Legal Hold Management</CardTitle>
              <CardDescription>Active legal holds and preservation orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {legalHolds.map((hold) => (
                  <div key={hold.id} className="border rounded-lg p-4 border-red-200 bg-red-50">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Gavel className="h-5 w-5 text-red-600" />
                          <span className="font-medium">{hold.caseName}</span>
                          <Badge className={getStatusColor(hold.status)}>
                            {hold.status}
                          </Badge>
                          <Badge variant="outline">{hold.caseId}</Badge>
                        </div>
                        <p className="text-sm text-gray-700">{hold.description}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Start Date: </span>
                            <span className="font-medium">{hold.startDate}</span>
                          </div>
                          {hold.endDate && (
                            <div>
                              <span className="text-gray-600">End Date: </span>
                              <span className="font-medium">{hold.endDate}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-600">Affected Records: </span>
                            <span className="font-medium">{hold.affectedRecords.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="text-gray-600">Requested by: </span>
                            <span className="font-medium">{hold.requestedBy}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-600">Approved by: </span>
                            <span className="font-medium">{hold.approvedBy}</span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-2">
                          <span className="text-sm text-gray-600">Data Types:</span>
                          {hold.dataTypes.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {hold.status === "active" && (
                        <div className="text-right">
                          <Lock className="h-6 w-6 text-red-600" />
                          <p className="text-xs text-red-600 mt-1">Protected</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Verification</CardTitle>
              <CardDescription>Retention policy compliance with regulations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>Standard</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Verified</TableHead>
                    <TableHead>Next Verification</TableHead>
                    <TableHead>Issues</TableHead>
                    <TableHead>Auditor</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceVerifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell className="font-medium">{verification.policy}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{verification.standard}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(verification.status)}>
                          {verification.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{verification.lastVerified}</TableCell>
                      <TableCell className="text-sm">{verification.nextVerification}</TableCell>
                      <TableCell>
                        {verification.issues.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm">{verification.issues.length} issues</span>
                          </div>
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{verification.auditor || "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
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
      </Tabs>
    </div>
  )
}