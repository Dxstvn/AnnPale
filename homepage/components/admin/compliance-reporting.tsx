"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
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
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Calendar,
  TrendingUp,
  Lock,
  Globe,
  Users,
  CreditCard,
  Database,
  Info,
  ExternalLink,
  Award,
  ClipboardCheck,
  FileCheck,
  AlertCircle,
  ChevronRight,
  Settings,
  RefreshCw,
  BarChart3,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ComplianceRequirement {
  id: string
  regulation: string
  requirement: string
  category: string
  status: "compliant" | "partial" | "non-compliant" | "pending"
  lastAudit: string
  nextAudit: string
  evidence: string[]
  controls: string[]
  risk: "low" | "medium" | "high" | "critical"
  responsible: string
  notes?: string
}

interface ComplianceReport {
  id: string
  name: string
  type: string
  generatedAt: string
  period: string
  status: "draft" | "final" | "submitted"
  regulations: string[]
  complianceScore: number
}

interface PolicyAdherence {
  policy: string
  category: string
  compliance: number
  violations: number
  lastReview: string
  nextReview: string
  status: "active" | "under_review" | "expired"
}

interface Certification {
  name: string
  issuer: string
  status: "active" | "expired" | "pending"
  issuedDate: string
  expiryDate: string
  scope: string[]
  auditor?: string
}

const complianceRequirements: ComplianceRequirement[] = [
  {
    id: "req-001",
    regulation: "GDPR",
    requirement: "Right to Data Portability",
    category: "Data Protection",
    status: "compliant",
    lastAudit: "2024-02-15",
    nextAudit: "2024-05-15",
    evidence: ["data_export_api.pdf", "user_portal_screenshots.png"],
    controls: ["Automated data export", "User self-service portal"],
    risk: "medium",
    responsible: "Data Protection Officer"
  },
  {
    id: "req-002",
    regulation: "CCPA",
    requirement: "Consumer Right to Delete",
    category: "Privacy",
    status: "compliant",
    lastAudit: "2024-02-20",
    nextAudit: "2024-05-20",
    evidence: ["deletion_process.pdf", "audit_logs.csv"],
    controls: ["Deletion request workflow", "30-day deletion policy"],
    risk: "high",
    responsible: "Privacy Team"
  },
  {
    id: "req-003",
    regulation: "PCI-DSS",
    requirement: "Secure Payment Processing",
    category: "Financial",
    status: "compliant",
    lastAudit: "2024-01-10",
    nextAudit: "2024-04-10",
    evidence: ["pci_certificate.pdf", "security_scan_results.xml"],
    controls: ["Tokenization", "End-to-end encryption", "Regular security scans"],
    risk: "critical",
    responsible: "Security Team"
  },
  {
    id: "req-004",
    regulation: "SOX",
    requirement: "Financial Reporting Accuracy",
    category: "Financial",
    status: "partial",
    lastAudit: "2024-02-01",
    nextAudit: "2024-05-01",
    evidence: ["financial_reports.xlsx", "audit_trail.pdf"],
    controls: ["Automated reconciliation", "Dual approval process"],
    risk: "high",
    responsible: "Finance Team",
    notes: "Implementing additional controls for Q2"
  },
  {
    id: "req-005",
    regulation: "ISO 27001",
    requirement: "Information Security Management",
    category: "Security",
    status: "compliant",
    lastAudit: "2024-01-25",
    nextAudit: "2024-07-25",
    evidence: ["iso_certificate.pdf", "isms_documentation.pdf"],
    controls: ["ISMS implementation", "Regular security audits"],
    risk: "medium",
    responsible: "CISO"
  }
]

const complianceReports: ComplianceReport[] = [
  {
    id: "report-001",
    name: "Q1 2024 GDPR Compliance Report",
    type: "Quarterly",
    generatedAt: "2024-03-31",
    period: "Q1 2024",
    status: "final",
    regulations: ["GDPR"],
    complianceScore: 94
  },
  {
    id: "report-002",
    name: "Annual PCI-DSS Assessment",
    type: "Annual",
    generatedAt: "2024-01-15",
    period: "2023",
    status: "submitted",
    regulations: ["PCI-DSS"],
    complianceScore: 98
  },
  {
    id: "report-003",
    name: "Monthly Security Compliance",
    type: "Monthly",
    generatedAt: "2024-03-01",
    period: "February 2024",
    status: "draft",
    regulations: ["ISO 27001", "SOC 2"],
    complianceScore: 91
  }
]

const policyAdherence: PolicyAdherence[] = [
  {
    policy: "Data Retention Policy",
    category: "Data Management",
    compliance: 95,
    violations: 2,
    lastReview: "2024-02-01",
    nextReview: "2024-05-01",
    status: "active"
  },
  {
    policy: "Access Control Policy",
    category: "Security",
    compliance: 98,
    violations: 0,
    lastReview: "2024-01-15",
    nextReview: "2024-04-15",
    status: "active"
  },
  {
    policy: "Incident Response Policy",
    category: "Security",
    compliance: 92,
    violations: 3,
    lastReview: "2024-02-20",
    nextReview: "2024-05-20",
    status: "under_review"
  },
  {
    policy: "Third-Party Risk Policy",
    category: "Vendor Management",
    compliance: 88,
    violations: 5,
    lastReview: "2023-12-01",
    nextReview: "2024-03-01",
    status: "expired"
  }
]

const certifications: Certification[] = [
  {
    name: "ISO 27001:2013",
    issuer: "BSI Group",
    status: "active",
    issuedDate: "2023-07-01",
    expiryDate: "2024-07-01",
    scope: ["Information Security Management"],
    auditor: "John Smith"
  },
  {
    name: "SOC 2 Type II",
    issuer: "Deloitte",
    status: "active",
    issuedDate: "2023-09-01",
    expiryDate: "2024-09-01",
    scope: ["Security", "Availability", "Confidentiality"],
    auditor: "Sarah Johnson"
  },
  {
    name: "PCI-DSS Level 1",
    issuer: "Trustwave",
    status: "active",
    issuedDate: "2024-01-01",
    expiryDate: "2025-01-01",
    scope: ["Payment Card Security"],
    auditor: "Mike Chen"
  }
]

export function ComplianceReporting() {
  const [selectedRegulation, setSelectedRegulation] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("current")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
      case "active":
      case "final":
      case "submitted":
        return "bg-green-100 text-green-800"
      case "partial":
      case "under_review":
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "non-compliant":
      case "expired":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600"
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

  const overallCompliance = {
    score: 93,
    trend: "+2.5%",
    compliant: complianceRequirements.filter(r => r.status === "compliant").length,
    partial: complianceRequirements.filter(r => r.status === "partial").length,
    nonCompliant: complianceRequirements.filter(r => r.status === "non-compliant").length,
    pending: complianceRequirements.filter(r => r.status === "pending").length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compliance Reporting</h2>
          <p className="text-gray-600">Regulatory compliance tracking and reporting</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Overall Compliance</p>
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{overallCompliance.score}%</p>
              <Badge className="bg-green-100 text-green-800">
                {overallCompliance.trend}
              </Badge>
            </div>
            <Progress value={overallCompliance.score} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Compliant</span>
                <span className="font-medium text-green-600">{overallCompliance.compliant}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Partial</span>
                <span className="font-medium text-yellow-600">{overallCompliance.partial}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Non-Compliant</span>
                <span className="font-medium text-red-600">{overallCompliance.nonCompliant}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-2">Active Certifications</p>
            <div className="space-y-1">
              {certifications.filter(c => c.status === "active").slice(0, 3).map((cert) => (
                <div key={cert.name} className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium">{cert.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-2">Upcoming Audits</p>
            <div className="space-y-1">
              <div className="text-xs">
                <p className="font-medium">PCI-DSS Review</p>
                <p className="text-gray-500">April 10, 2024</p>
              </div>
              <div className="text-xs">
                <p className="font-medium">GDPR Assessment</p>
                <p className="text-gray-500">May 15, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requirements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="preparation">Audit Prep</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Compliance Requirements</CardTitle>
                <Select value={selectedRegulation} onValueChange={setSelectedRegulation}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regulations</SelectItem>
                    <SelectItem value="gdpr">GDPR</SelectItem>
                    <SelectItem value="ccpa">CCPA</SelectItem>
                    <SelectItem value="pci-dss">PCI-DSS</SelectItem>
                    <SelectItem value="sox">SOX</SelectItem>
                    <SelectItem value="iso27001">ISO 27001</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Regulation</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Next Audit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceRequirements.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.requirement}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{req.regulation}</Badge>
                      </TableCell>
                      <TableCell>{req.category}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(req.status)}>
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn("font-medium", getRiskColor(req.risk))}>
                          {req.risk}
                        </span>
                      </TableCell>
                      <TableCell>{req.nextAudit}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>Generated compliance reports and assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Period: {report.period} | Type: {report.type}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Compliance Score:</span>
                            <span className="font-medium">{report.complianceScore}%</span>
                          </div>
                          <div className="flex gap-1">
                            {report.regulations.map((reg) => (
                              <Badge key={reg} variant="outline">
                                {reg}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Adherence Monitoring</CardTitle>
              <CardDescription>Track compliance with internal policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policyAdherence.map((policy) => (
                  <div key={policy.policy} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{policy.policy}</h4>
                        <p className="text-sm text-gray-600">{policy.category}</p>
                      </div>
                      <Badge className={getStatusColor(policy.status)}>
                        {policy.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Compliance</p>
                        <div className="flex items-center gap-2">
                          <Progress value={policy.compliance} className="flex-1" />
                          <span className="font-medium">{policy.compliance}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Violations</p>
                        <p className="font-medium">{policy.violations}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Review</p>
                        <p className="font-medium">{policy.lastReview}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Next Review</p>
                        <p className="font-medium">{policy.nextReview}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>Active certifications and compliance standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <Card key={cert.name}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Award className="h-8 w-8 text-blue-600" />
                        <Badge className={getStatusColor(cert.status)}>
                          {cert.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{cert.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">Issued by {cert.issuer}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valid From</span>
                          <span>{cert.issuedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expires</span>
                          <span>{cert.expiryDate}</span>
                        </div>
                        {cert.auditor && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Auditor</span>
                            <span>{cert.auditor}</span>
                          </div>
                        )}
                        <div className="pt-2 border-t">
                          <p className="text-gray-600 mb-1">Scope</p>
                          <div className="flex flex-wrap gap-1">
                            {cert.scope.map((s) => (
                              <Badge key={s} variant="outline" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preparation" className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Next Audit Preparation</AlertTitle>
            <AlertDescription>
              PCI-DSS compliance audit scheduled for April 10, 2024. All evidence documentation must be submitted by April 1, 2024.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Audit Preparation Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="doc1" checked />
                  <Label htmlFor="doc1">Update security policies and procedures</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="doc2" checked />
                  <Label htmlFor="doc2">Compile vulnerability scan reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="doc3" />
                  <Label htmlFor="doc3">Review access control matrices</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="doc4" />
                  <Label htmlFor="doc4">Prepare incident response documentation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="doc5" />
                  <Label htmlFor="doc5">Gather employee training records</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}