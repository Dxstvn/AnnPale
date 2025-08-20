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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  CreditCard,
  Mail,
  Phone,
  Shield,
  FileText,
  Calendar,
  Eye,
  MessageSquare,
  Send,
  UserX,
  UserCheck,
  Ban,
  Unlock,
  DollarSign,
  RefreshCw,
  AlertCircle,
  Info,
  Zap,
  History
} from "lucide-react"

interface WorkflowAction {
  id: string
  type: "suspend" | "activate" | "ban" | "verify" | "adjust_balance" | "send_warning" | "approve_creator" | "delete_account"
  title: string
  description: string
  targetUserId: string
  targetUserName: string
  targetUserEmail: string
  requestedBy: string
  requestedAt: string
  status: "pending" | "approved" | "rejected" | "completed"
  priority: "low" | "medium" | "high" | "critical"
  reason: string
  details?: any
  approvedBy?: string
  approvedAt?: string
  completedAt?: string
  notes?: string
  requiresApproval: boolean
  approvalLevel: "manager" | "senior_admin" | "super_admin"
}

const mockWorkflowActions: WorkflowAction[] = [
  {
    id: "WF001",
    type: "suspend",
    title: "Suspend User Account",
    description: "Temporary suspension due to policy violations",
    targetUserId: "USR001",
    targetUserName: "Marie Laurent",
    targetUserEmail: "marie.laurent@email.com",
    requestedBy: "Admin John",
    requestedAt: "2024-01-15T09:30:00",
    status: "pending",
    priority: "high",
    reason: "Multiple reports of inappropriate messages",
    details: { duration: "7 days", violations: 3 },
    requiresApproval: true,
    approvalLevel: "manager"
  },
  {
    id: "WF002",
    type: "adjust_balance",
    title: "Account Balance Adjustment",
    description: "Refund processing for cancelled order",
    targetUserId: "USR002",
    targetUserName: "Jean Pierre",
    targetUserEmail: "jpierre@email.com",
    requestedBy: "Support Agent Sarah",
    requestedAt: "2024-01-15T14:20:00",
    status: "approved",
    priority: "medium",
    reason: "Order cancellation refund",
    details: { amount: 150, currency: "USD", orderId: "ORD123" },
    approvedBy: "Manager Tom",
    approvedAt: "2024-01-15T15:00:00",
    requiresApproval: true,
    approvalLevel: "manager"
  },
  {
    id: "WF003",
    type: "approve_creator",
    title: "Creator Application Approval",
    description: "Approve pending creator application",
    targetUserId: "CRT003",
    targetUserName: "Marie Ange",
    targetUserEmail: "marie.ange@email.com",
    requestedBy: "Content Manager Lisa",
    requestedAt: "2024-01-14T16:45:00",
    status: "completed",
    priority: "medium",
    reason: "Application meets all requirements",
    details: { category: "Music", verificationScore: 95 },
    approvedBy: "Senior Admin Mike",
    approvedAt: "2024-01-15T08:30:00",
    completedAt: "2024-01-15T09:00:00",
    requiresApproval: true,
    approvalLevel: "senior_admin"
  },
  {
    id: "WF004",
    type: "ban",
    title: "Permanent Account Ban",
    description: "Permanent ban due to severe violations",
    targetUserId: "USR004",
    targetUserName: "Problem User",
    targetUserEmail: "problem@email.com",
    requestedBy: "Security Team",
    requestedAt: "2024-01-15T11:15:00",
    status: "pending",
    priority: "critical",
    reason: "Fraudulent payment activity and harassment",
    details: { severity: "high", fraudAmount: 2500 },
    requiresApproval: true,
    approvalLevel: "super_admin"
  }
]

const getActionIcon = (type: WorkflowAction["type"]) => {
  switch (type) {
    case "suspend": return Ban
    case "activate": return Unlock
    case "ban": return UserX
    case "verify": return Shield
    case "adjust_balance": return DollarSign
    case "send_warning": return AlertTriangle
    case "approve_creator": return UserCheck
    case "delete_account": return Trash2
    default: return FileText
  }
}

const getStatusColor = (status: WorkflowAction["status"]) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "approved": return "bg-blue-100 text-blue-800"
    case "rejected": return "bg-red-100 text-red-800"
    case "completed": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: WorkflowAction["priority"]) => {
  switch (priority) {
    case "critical": return "bg-red-100 text-red-800"
    case "high": return "bg-orange-100 text-orange-800"
    case "medium": return "bg-yellow-100 text-yellow-800"
    case "low": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

interface UserActionWorkflowsProps {
  userRole?: string
  canApprove?: boolean
}

export function UserActionWorkflows({ userRole = "admin", canApprove = false }: UserActionWorkflowsProps) {
  const [workflows, setWorkflows] = useState<WorkflowAction[]>(mockWorkflowActions)
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowAction | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject" | null>(null)
  const [approvalNotes, setApprovalNotes] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  const handleApprovalAction = (workflow: WorkflowAction, action: "approve" | "reject") => {
    setSelectedWorkflow(workflow)
    setApprovalAction(action)
    setIsApprovalDialogOpen(true)
  }

  const confirmApproval = () => {
    if (!selectedWorkflow || !approvalAction) return

    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === selectedWorkflow.id 
          ? {
              ...workflow,
              status: approvalAction === "approve" ? "approved" : "rejected",
              approvedBy: "Current Admin",
              approvedAt: new Date().toISOString(),
              notes: approvalNotes
            }
          : workflow
      )
    )

    setIsApprovalDialogOpen(false)
    setApprovalNotes("")
    setSelectedWorkflow(null)
    setApprovalAction(null)
  }

  const executeWorkflow = (workflowId: string) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === workflowId 
          ? {
              ...workflow,
              status: "completed",
              completedAt: new Date().toISOString()
            }
          : workflow
      )
    )
  }

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesStatus = filterStatus === "all" || workflow.status === filterStatus
    const matchesPriority = filterPriority === "all" || workflow.priority === filterPriority
    return matchesStatus && matchesPriority
  })

  const stats = {
    total: workflows.length,
    pending: workflows.filter(w => w.status === "pending").length,
    approved: workflows.filter(w => w.status === "approved").length,
    completed: workflows.filter(w => w.status === "completed").length,
    critical: workflows.filter(w => w.priority === "critical").length
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Workflows</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
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
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Action Workflows</CardTitle>
              <CardDescription>Manage and approve user account actions requiring workflow approval</CardDescription>
            </div>
            <Button variant="outline">
              <History className="h-4 w-4 mr-2" />
              Workflow History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Status Filter</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority Filter</Label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Workflows Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Target User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkflows.map((workflow) => {
                  const ActionIcon = getActionIcon(workflow.type)
                  return (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gray-100">
                            <ActionIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{workflow.title}</p>
                            <p className="text-sm text-muted-foreground">{workflow.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{workflow.targetUserName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{workflow.targetUserName}</p>
                            <p className="text-sm text-muted-foreground">{workflow.targetUserEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(workflow.priority)}>
                          {workflow.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{new Date(workflow.requestedAt).toLocaleDateString()}</p>
                          <p className="text-muted-foreground">by {workflow.requestedBy}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedWorkflow(workflow)
                              setIsDetailsOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {workflow.status === "pending" && canApprove && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprovalAction(workflow, "approve")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApprovalAction(workflow, "reject")}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {workflow.status === "approved" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => executeWorkflow(workflow.id)}
                            >
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

      {/* Workflow Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Workflow Details</DialogTitle>
            <DialogDescription>
              Complete information about this workflow action
            </DialogDescription>
          </DialogHeader>

          {selectedWorkflow && (
            <div className="space-y-6">
              {/* Action Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 rounded-lg bg-white">
                  {(() => {
                    const ActionIcon = getActionIcon(selectedWorkflow.type)
                    return <ActionIcon className="h-6 w-6" />
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedWorkflow.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedWorkflow.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(selectedWorkflow.status)}>
                      {selectedWorkflow.status}
                    </Badge>
                    <Badge className={getPriorityColor(selectedWorkflow.priority)}>
                      {selectedWorkflow.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Target User */}
              <div>
                <Label className="text-base font-medium">Target User</Label>
                <div className="mt-2 p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{selectedWorkflow.targetUserName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedWorkflow.targetUserName}</p>
                      <p className="text-sm text-muted-foreground">{selectedWorkflow.targetUserEmail}</p>
                      <p className="text-sm text-muted-foreground">ID: {selectedWorkflow.targetUserId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Requested By</Label>
                  <Input value={selectedWorkflow.requestedBy} disabled />
                </div>
                <div>
                  <Label>Request Date</Label>
                  <Input value={new Date(selectedWorkflow.requestedAt).toLocaleString()} disabled />
                </div>
              </div>

              {/* Reason */}
              <div>
                <Label>Reason</Label>
                <Textarea value={selectedWorkflow.reason} disabled rows={2} />
              </div>

              {/* Additional Details */}
              {selectedWorkflow.details && (
                <div>
                  <Label className="text-base font-medium">Additional Details</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <pre className="text-sm">{JSON.stringify(selectedWorkflow.details, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* Approval Info */}
              {(selectedWorkflow.status === "approved" || selectedWorkflow.status === "rejected") && (
                <div>
                  <Label className="text-base font-medium">Approval Information</Label>
                  <div className="mt-2 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Approved By</Label>
                        <Input value={selectedWorkflow.approvedBy || ""} disabled />
                      </div>
                      <div>
                        <Label>Approval Date</Label>
                        <Input value={selectedWorkflow.approvedAt ? new Date(selectedWorkflow.approvedAt).toLocaleString() : ""} disabled />
                      </div>
                    </div>
                    {selectedWorkflow.notes && (
                      <div className="mt-4">
                        <Label>Notes</Label>
                        <Textarea value={selectedWorkflow.notes} disabled rows={2} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Completion Info */}
              {selectedWorkflow.completedAt && (
                <div>
                  <Label className="text-base font-medium">Completion Information</Label>
                  <div className="mt-2 p-4 border rounded-lg">
                    <div>
                      <Label>Completed At</Label>
                      <Input value={new Date(selectedWorkflow.completedAt).toLocaleString()} disabled />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === "approve" ? "Approve Workflow" : "Reject Workflow"}
            </DialogTitle>
            <DialogDescription>
              {approvalAction === "approve" 
                ? "Are you sure you want to approve this workflow action?"
                : "Are you sure you want to reject this workflow action?"
              }
            </DialogDescription>
          </DialogHeader>

          {selectedWorkflow && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This action will {approvalAction} the workflow: <strong>{selectedWorkflow.title}</strong> for user <strong>{selectedWorkflow.targetUserName}</strong>
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="approval-notes">Notes (Optional)</Label>
                <Textarea
                  id="approval-notes"
                  placeholder="Add any notes about this approval/rejection..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={approvalAction === "approve" ? "default" : "destructive"}
              onClick={confirmApproval}
            >
              {approvalAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}