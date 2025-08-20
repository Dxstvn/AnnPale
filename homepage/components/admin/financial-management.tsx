"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DollarSign,
  CreditCard,
  Banknote,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Edit,
  FileText,
  Calendar,
  User,
  Building,
  Shield,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  Zap,
  AlertCircle,
  History,
  Receipt,
  Wallet
} from "lucide-react"

interface FinancialAdjustment {
  id: string
  type: "credit" | "debit" | "refund" | "fee_waiver" | "penalty" | "bonus" | "correction"
  amount: number
  currency: string
  userId: string
  userName: string
  userEmail: string
  reason: string
  description: string
  status: "pending" | "approved" | "completed" | "rejected" | "failed"
  requestedBy: string
  requestedAt: string
  approvedBy?: string
  approvedAt?: string
  processedAt?: string
  relatedOrderId?: string
  relatedTransactionId?: string
  notes?: string
  requiresApproval: boolean
  approvalLevel: "manager" | "senior_admin" | "finance_team"
  originalBalance: number
  newBalance: number
  verificationStatus: "verified" | "pending_verification" | "failed_verification"
}

interface VerificationRequest {
  id: string
  type: "identity" | "payment_method" | "business" | "tax_info" | "bank_account"
  userId: string
  userName: string
  userType: "customer" | "creator"
  status: "pending" | "approved" | "rejected" | "requires_docs"
  submittedAt: string
  reviewedBy?: string
  reviewedAt?: string
  documents: Array<{
    name: string
    type: string
    status: "pending" | "approved" | "rejected"
    uploadedAt: string
  }>
  notes?: string
  priority: "low" | "medium" | "high" | "urgent"
}

const mockAdjustments: FinancialAdjustment[] = [
  {
    id: "ADJ001",
    type: "refund",
    amount: 150.00,
    currency: "USD",
    userId: "USR001",
    userName: "Marie Laurent",
    userEmail: "marie.laurent@email.com",
    reason: "Order cancellation",
    description: "Refund for cancelled video order #ORD123",
    status: "pending",
    requestedBy: "Support Agent Sarah",
    requestedAt: "2024-01-15T09:30:00",
    relatedOrderId: "ORD123",
    requiresApproval: true,
    approvalLevel: "manager",
    originalBalance: 0,
    newBalance: 150,
    verificationStatus: "verified"
  },
  {
    id: "ADJ002",
    type: "credit",
    amount: 50.00,
    currency: "USD",
    userId: "CRT001",
    userName: "Ti Jo Zenny",
    userEmail: "tijo@annpale.com",
    reason: "Promotional bonus",
    description: "Creator milestone bonus for 100 completed videos",
    status: "completed",
    requestedBy: "Creator Success Team",
    requestedAt: "2024-01-14T16:20:00",
    approvedBy: "Finance Manager",
    approvedAt: "2024-01-14T17:00:00",
    processedAt: "2024-01-14T17:15:00",
    requiresApproval: true,
    approvalLevel: "finance_team",
    originalBalance: 2500,
    newBalance: 2550,
    verificationStatus: "verified"
  },
  {
    id: "ADJ003",
    type: "penalty",
    amount: 25.00,
    currency: "USD",
    userId: "USR002",
    userName: "Jean Pierre",
    userEmail: "jpierre@email.com",
    reason: "Policy violation",
    description: "Penalty for inappropriate message content",
    status: "approved",
    requestedBy: "Moderation Team",
    requestedAt: "2024-01-13T11:45:00",
    approvedBy: "Senior Admin",
    approvedAt: "2024-01-14T08:30:00",
    requiresApproval: true,
    approvalLevel: "senior_admin",
    originalBalance: 125,
    newBalance: 100,
    verificationStatus: "verified"
  },
  {
    id: "ADJ004",
    type: "correction",
    amount: 75.50,
    currency: "USD",
    userId: "CRT002",
    userName: "Sarah Williams",
    userEmail: "sarah.w@email.com",
    reason: "System error correction",
    description: "Correcting duplicate charge from payment processing error",
    status: "pending",
    requestedBy: "Finance Team",
    requestedAt: "2024-01-15T14:20:00",
    requiresApproval: true,
    approvalLevel: "finance_team",
    originalBalance: 200,
    newBalance: 275.50,
    verificationStatus: "pending_verification"
  }
]

const mockVerifications: VerificationRequest[] = [
  {
    id: "VER001",
    type: "identity",
    userId: "CRT003",
    userName: "Marie Ange",
    userType: "creator",
    status: "pending",
    submittedAt: "2024-01-15T08:45:00",
    documents: [
      { name: "passport.jpg", type: "government_id", status: "pending", uploadedAt: "2024-01-15T08:45:00" },
      { name: "selfie.jpg", type: "identity_verification", status: "pending", uploadedAt: "2024-01-15T08:46:00" }
    ],
    priority: "high"
  },
  {
    id: "VER002",
    type: "bank_account",
    userId: "CRT001",
    userName: "Ti Jo Zenny",
    userType: "creator",
    status: "approved",
    submittedAt: "2024-01-14T15:30:00",
    reviewedBy: "Finance Specialist",
    reviewedAt: "2024-01-15T09:00:00",
    documents: [
      { name: "bank_statement.pdf", type: "bank_statement", status: "approved", uploadedAt: "2024-01-14T15:30:00" },
      { name: "void_check.jpg", type: "void_check", status: "approved", uploadedAt: "2024-01-14T15:31:00" }
    ],
    priority: "medium"
  },
  {
    id: "VER003",
    type: "business",
    userId: "CRT004",
    userName: "Business Creator LLC",
    userType: "creator",
    status: "requires_docs",
    submittedAt: "2024-01-13T12:20:00",
    reviewedBy: "Compliance Team",
    reviewedAt: "2024-01-14T10:15:00",
    documents: [
      { name: "business_license.pdf", type: "business_license", status: "rejected", uploadedAt: "2024-01-13T12:20:00" }
    ],
    notes: "Business license is expired. Please provide current documentation.",
    priority: "low"
  }
]

const getAdjustmentIcon = (type: FinancialAdjustment["type"]) => {
  switch (type) {
    case "credit": return Plus
    case "debit": return Minus
    case "refund": return RefreshCw
    case "fee_waiver": return CheckCircle
    case "penalty": return AlertTriangle
    case "bonus": return TrendingUp
    case "correction": return Edit
    default: return DollarSign
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "approved": return "bg-blue-100 text-blue-800"
    case "completed": return "bg-green-100 text-green-800"
    case "rejected": return "bg-red-100 text-red-800"
    case "failed": return "bg-red-100 text-red-800"
    case "requires_docs": return "bg-orange-100 text-orange-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getVerificationIcon = (type: VerificationRequest["type"]) => {
  switch (type) {
    case "identity": return User
    case "payment_method": return CreditCard
    case "business": return Building
    case "tax_info": return FileText
    case "bank_account": return Banknote
    default: return Shield
  }
}

export function FinancialManagement() {
  const [adjustments, setAdjustments] = useState<FinancialAdjustment[]>(mockAdjustments)
  const [verifications, setVerifications] = useState<VerificationRequest[]>(mockVerifications)
  const [selectedAdjustment, setSelectedAdjustment] = useState<FinancialAdjustment | null>(null)
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null)
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false)
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false)
  const [isCreateAdjustmentOpen, setIsCreateAdjustmentOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("adjustments")

  // Create adjustment form state
  const [newAdjustment, setNewAdjustment] = useState({
    type: "credit" as FinancialAdjustment["type"],
    amount: "",
    userId: "",
    reason: "",
    description: ""
  })

  const handleCreateAdjustment = () => {
    const adjustment: FinancialAdjustment = {
      id: `ADJ${String(adjustments.length + 1).padStart(3, "0")}`,
      type: newAdjustment.type,
      amount: parseFloat(newAdjustment.amount),
      currency: "USD",
      userId: newAdjustment.userId,
      userName: "Selected User", // Would be populated from user lookup
      userEmail: "user@email.com", // Would be populated from user lookup
      reason: newAdjustment.reason,
      description: newAdjustment.description,
      status: "pending",
      requestedBy: "Current Admin",
      requestedAt: new Date().toISOString(),
      requiresApproval: true,
      approvalLevel: "manager",
      originalBalance: 0, // Would be fetched from user's current balance
      newBalance: 0, // Would be calculated
      verificationStatus: "pending_verification"
    }

    setAdjustments(prev => [adjustment, ...prev])
    setIsCreateAdjustmentOpen(false)
    setNewAdjustment({
      type: "credit",
      amount: "",
      userId: "",
      reason: "",
      description: ""
    })
  }

  const handleApproveAdjustment = (adjustmentId: string) => {
    setAdjustments(prev =>
      prev.map(adj =>
        adj.id === adjustmentId
          ? {
              ...adj,
              status: "approved",
              approvedBy: "Current Admin",
              approvedAt: new Date().toISOString()
            }
          : adj
      )
    )
  }

  const handleRejectAdjustment = (adjustmentId: string) => {
    setAdjustments(prev =>
      prev.map(adj =>
        adj.id === adjustmentId
          ? {
              ...adj,
              status: "rejected",
              approvedBy: "Current Admin",
              approvedAt: new Date().toISOString()
            }
          : adj
      )
    )
  }

  const handleApproveVerification = (verificationId: string) => {
    setVerifications(prev =>
      prev.map(ver =>
        ver.id === verificationId
          ? {
              ...ver,
              status: "approved",
              reviewedBy: "Current Admin",
              reviewedAt: new Date().toISOString()
            }
          : ver
      )
    )
  }

  const adjustmentStats = {
    total: adjustments.length,
    pending: adjustments.filter(a => a.status === "pending").length,
    approved: adjustments.filter(a => a.status === "approved").length,
    completed: adjustments.filter(a => a.status === "completed").length,
    totalAmount: adjustments
      .filter(a => a.status === "completed")
      .reduce((sum, a) => sum + a.amount, 0)
  }

  const verificationStats = {
    total: verifications.length,
    pending: verifications.filter(v => v.status === "pending").length,
    approved: verifications.filter(v => v.status === "approved").length,
    rejected: verifications.filter(v => v.status === "rejected").length,
    requiresDocs: verifications.filter(v => v.status === "requires_docs").length
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Adjustments</p>
                <p className="text-2xl font-bold">{adjustmentStats.total}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{adjustmentStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{adjustmentStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Processed</p>
                <p className="text-2xl font-bold">${adjustmentStats.totalAmount.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verifications</p>
                <p className="text-2xl font-bold">{verificationStats.pending}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="adjustments">Financial Adjustments</TabsTrigger>
          <TabsTrigger value="verifications">Verification Management</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="adjustments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Financial Adjustments</CardTitle>
                  <CardDescription>Manage user account balance adjustments and financial corrections</CardDescription>
                </div>
                <Button onClick={() => setIsCreateAdjustmentOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Adjustment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adjustments.map((adjustment) => {
                      const AdjustmentIcon = getAdjustmentIcon(adjustment.type)
                      const isCredit = ["credit", "refund", "bonus", "fee_waiver"].includes(adjustment.type)
                      return (
                        <TableRow key={adjustment.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className={`p-2 rounded-lg ${isCredit ? "bg-green-100" : "bg-red-100"}`}>
                                <AdjustmentIcon className={`h-4 w-4 ${isCredit ? "text-green-600" : "text-red-600"}`} />
                              </div>
                              <div>
                                <p className="font-medium capitalize">{adjustment.type.replace("_", " ")}</p>
                                <p className="text-sm text-muted-foreground">{adjustment.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{adjustment.userName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{adjustment.userName}</p>
                                <p className="text-sm text-muted-foreground">{adjustment.userEmail}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-right">
                              <p className={`font-bold ${isCredit ? "text-green-600" : "text-red-600"}`}>
                                {isCredit ? "+" : "-"}${adjustment.amount.toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground">{adjustment.currency}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{adjustment.reason}</p>
                              <p className="text-sm text-muted-foreground truncate max-w-xs">
                                {adjustment.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(adjustment.status)}>
                              {adjustment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{new Date(adjustment.requestedAt).toLocaleDateString()}</p>
                              <p className="text-muted-foreground">by {adjustment.requestedBy}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedAdjustment(adjustment)
                                  setIsAdjustmentDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {adjustment.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApproveAdjustment(adjustment.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRejectAdjustment(adjustment.id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              {adjustment.status === "approved" && (
                                <Button size="sm" variant="default">
                                  <Zap className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verifications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Verification Management</CardTitle>
                  <CardDescription>Review and manage user verification requests</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifications.map((verification) => {
                      const VerificationIcon = getVerificationIcon(verification.type)
                      return (
                        <TableRow key={verification.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="p-2 rounded-lg bg-blue-100">
                                <VerificationIcon className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium capitalize">{verification.type.replace("_", " ")}</p>
                                <p className="text-sm text-muted-foreground">{verification.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{verification.userName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{verification.userName}</p>
                                <Badge variant="outline" className="text-xs">
                                  {verification.userType}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {verification.documents.map((doc, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <FileText className="h-3 w-3" />
                                  <span className="text-sm">{doc.name}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getStatusColor(doc.status)}`}
                                  >
                                    {doc.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(verification.status)}>
                              {verification.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {verification.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{new Date(verification.submittedAt).toLocaleDateString()}</p>
                              {verification.reviewedBy && (
                                <p className="text-muted-foreground">by {verification.reviewedBy}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedVerification(verification)
                                  setIsVerificationDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {verification.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApproveVerification(verification.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Receipt className="h-5 w-5" />
                  <span>Transaction Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Credits</span>
                    <span className="font-medium text-green-600">$12,450.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Debits</span>
                    <span className="font-medium text-red-600">$3,250.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Net Balance</span>
                    <span className="font-bold text-green-600">$9,200.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5" />
                  <span>Verification Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Approved</span>
                    <span className="font-medium text-green-600">{verificationStats.approved}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="font-medium text-yellow-600">{verificationStats.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rejected</span>
                    <span className="font-medium text-red-600">{verificationStats.rejected}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Financial Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Tax Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <History className="h-4 w-4 mr-2" />
                  View Audit Trail
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Adjustment Dialog */}
      <Dialog open={isCreateAdjustmentOpen} onOpenChange={setIsCreateAdjustmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Financial Adjustment</DialogTitle>
            <DialogDescription>
              Create a new financial adjustment for a user account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Adjustment Type</Label>
                <Select 
                  value={newAdjustment.type} 
                  onValueChange={(value: FinancialAdjustment["type"]) => 
                    setNewAdjustment(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="fee_waiver">Fee Waiver</SelectItem>
                    <SelectItem value="penalty">Penalty</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                    <SelectItem value="correction">Correction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Amount (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newAdjustment.amount}
                  onChange={(e) => setNewAdjustment(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label>User ID</Label>
              <Input
                value={newAdjustment.userId}
                onChange={(e) => setNewAdjustment(prev => ({ ...prev, userId: e.target.value }))}
                placeholder="Enter user ID"
              />
            </div>

            <div>
              <Label>Reason</Label>
              <Input
                value={newAdjustment.reason}
                onChange={(e) => setNewAdjustment(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Brief reason for adjustment"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={newAdjustment.description}
                onChange={(e) => setNewAdjustment(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the adjustment"
                rows={3}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This adjustment will require approval before being processed.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateAdjustmentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAdjustment}>
              Create Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjustment Details Dialog */}
      <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Financial Adjustment Details</DialogTitle>
            <DialogDescription>
              Complete information about this financial adjustment
            </DialogDescription>
          </DialogHeader>

          {selectedAdjustment && (
            <div className="space-y-6">
              {/* Adjustment Summary */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 rounded-lg bg-white">
                  {(() => {
                    const AdjustmentIcon = getAdjustmentIcon(selectedAdjustment.type)
                    const isCredit = ["credit", "refund", "bonus", "fee_waiver"].includes(selectedAdjustment.type)
                    return (
                      <AdjustmentIcon className={`h-6 w-6 ${isCredit ? "text-green-600" : "text-red-600"}`} />
                    )
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold capitalize">{selectedAdjustment.type.replace("_", " ")}</h3>
                  <p className="text-2xl font-bold">
                    {["credit", "refund", "bonus", "fee_waiver"].includes(selectedAdjustment.type) ? "+" : "-"}
                    ${selectedAdjustment.amount.toFixed(2)}
                  </p>
                  <Badge className={getStatusColor(selectedAdjustment.status)}>
                    {selectedAdjustment.status}
                  </Badge>
                </div>
              </div>

              {/* User Information */}
              <div>
                <Label className="text-base font-medium">Target User</Label>
                <div className="mt-2 p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{selectedAdjustment.userName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedAdjustment.userName}</p>
                      <p className="text-sm text-muted-foreground">{selectedAdjustment.userEmail}</p>
                      <p className="text-sm text-muted-foreground">ID: {selectedAdjustment.userId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Information */}
              <div>
                <Label className="text-base font-medium">Balance Changes</Label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Original Balance</p>
                    <p className="text-xl font-bold">${selectedAdjustment.originalBalance.toFixed(2)}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">New Balance</p>
                    <p className="text-xl font-bold">${selectedAdjustment.newBalance.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Adjustment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Reason</Label>
                  <Input value={selectedAdjustment.reason} disabled />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Input value={selectedAdjustment.currency} disabled />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea value={selectedAdjustment.description} disabled rows={3} />
              </div>

              {/* Request Information */}
              <div>
                <Label className="text-base font-medium">Request Information</Label>
                <div className="mt-2 p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Requested By</p>
                      <p className="font-medium">{selectedAdjustment.requestedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Request Date</p>
                      <p className="font-medium">{new Date(selectedAdjustment.requestedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedAdjustment.relatedOrderId && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Related Order</p>
                      <p className="font-medium">{selectedAdjustment.relatedOrderId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Approval Information */}
              {(selectedAdjustment.status === "approved" || selectedAdjustment.status === "rejected") && (
                <div>
                  <Label className="text-base font-medium">Approval Information</Label>
                  <div className="mt-2 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Approved By</p>
                        <p className="font-medium">{selectedAdjustment.approvedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Approval Date</p>
                        <p className="font-medium">
                          {selectedAdjustment.approvedAt ? new Date(selectedAdjustment.approvedAt).toLocaleString() : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustmentDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verification Details Dialog */}
      <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verification Request Details</DialogTitle>
            <DialogDescription>
              Review verification documents and information
            </DialogDescription>
          </DialogHeader>

          {selectedVerification && (
            <div className="space-y-6">
              {/* Verification Summary */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 rounded-lg bg-white">
                  {(() => {
                    const VerificationIcon = getVerificationIcon(selectedVerification.type)
                    return <VerificationIcon className="h-6 w-6 text-blue-600" />
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold capitalize">{selectedVerification.type.replace("_", " ")}</h3>
                  <p className="text-sm text-muted-foreground">{selectedVerification.userName}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(selectedVerification.status)}>
                      {selectedVerification.status.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline">{selectedVerification.priority}</Badge>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <Label className="text-base font-medium">Submitted Documents</Label>
                <div className="mt-2 space-y-3">
                  {selectedVerification.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{doc.type.replace("_", " ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedVerification.notes && (
                <div>
                  <Label className="text-base font-medium">Review Notes</Label>
                  <div className="mt-2 p-4 border rounded-lg bg-yellow-50">
                    <p className="text-sm">{selectedVerification.notes}</p>
                  </div>
                </div>
              )}

              {/* Submission Info */}
              <div>
                <Label className="text-base font-medium">Submission Information</Label>
                <div className="mt-2 p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-medium">{new Date(selectedVerification.submittedAt).toLocaleString()}</p>
                    </div>
                    {selectedVerification.reviewedBy && (
                      <div>
                        <p className="text-sm text-muted-foreground">Reviewed By</p>
                        <p className="font-medium">{selectedVerification.reviewedBy}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerificationDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}