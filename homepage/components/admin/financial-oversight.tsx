"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
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
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Receipt,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  User,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  PieChart,
  BarChart3,
  LineChart,
  FileText,
  Shield,
  Building
} from "lucide-react"

interface Transaction {
  id: string
  type: "payment" | "payout" | "refund" | "fee"
  amount: number
  currency: string
  status: "completed" | "pending" | "failed" | "disputed"
  createdAt: string
  processedAt?: string
  orderId?: string
  customerId: string
  customerName: string
  creatorId?: string
  creatorName?: string
  paymentMethod: string
  platformFee: number
  creatorEarnings?: number
  description: string
  notes?: string
}

interface FinancialMetrics {
  totalRevenue: number
  platformFees: number
  creatorPayouts: number
  pendingPayouts: number
  refunds: number
  disputes: number
  monthlyGrowth: number
  averageOrderValue: number
  transactionVolume: number
  conversionRate: number
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN001",
    type: "payment",
    amount: 95,
    currency: "USD",
    status: "completed",
    createdAt: "2024-01-15T10:30:00",
    processedAt: "2024-01-15T10:31:00",
    orderId: "ORD001",
    customerId: "USR001",
    customerName: "Marie Laurent",
    creatorId: "CRT001",
    creatorName: "Ti Jo Zenny",
    paymentMethod: "Credit Card",
    platformFee: 10,
    creatorEarnings: 85,
    description: "Birthday message video"
  },
  {
    id: "TXN002",
    type: "payout",
    amount: 1250,
    currency: "USD",
    status: "pending",
    createdAt: "2024-01-14T15:00:00",
    customerId: "CRT001",
    customerName: "Ti Jo Zenny",
    paymentMethod: "Bank Transfer",
    platformFee: 0,
    description: "Weekly creator payout"
  },
  {
    id: "TXN003",
    type: "refund",
    amount: 110,
    currency: "USD",
    status: "completed",
    createdAt: "2024-01-13T09:15:00",
    processedAt: "2024-01-13T09:16:00",
    orderId: "ORD004",
    customerId: "USR003",
    customerName: "Nadine L.",
    creatorId: "CRT002",
    creatorName: "Carel Pedre",
    paymentMethod: "Credit Card",
    platformFee: -5,
    description: "Order cancellation refund"
  },
  {
    id: "TXN004",
    type: "payment",
    amount: 150,
    currency: "USD",
    status: "disputed",
    createdAt: "2024-01-12T14:20:00",
    orderId: "ORD005",
    customerId: "USR004",
    customerName: "Alex T.",
    creatorId: "CRT003",
    creatorName: "Wyclef Jean",
    paymentMethod: "Credit Card",
    platformFee: 15,
    creatorEarnings: 135,
    description: "Anniversary celebration video",
    notes: "Customer disputes quality of video"
  }
]

const mockMetrics: FinancialMetrics = {
  totalRevenue: 125000,
  platformFees: 18750,
  creatorPayouts: 106250,
  pendingPayouts: 15420,
  refunds: 2340,
  disputes: 890,
  monthlyGrowth: 15.2,
  averageOrderValue: 87.50,
  transactionVolume: 1429,
  conversionRate: 94.2
}

export function FinancialOversight() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("30")

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "disputed":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: Transaction["type"]) => {
    switch (type) {
      case "payment":
        return "bg-green-100 text-green-800"
      case "payout":
        return "bg-blue-100 text-blue-800"
      case "refund":
        return "bg-red-100 text-red-800"
      case "fee":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleProcessPayout = (transactionId: string) => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === transactionId 
          ? { ...tx, status: "completed", processedAt: new Date().toISOString() }
          : tx
      )
    )
  }

  const handleResolveDispute = (transactionId: string, resolution: "approve" | "refund") => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === transactionId 
          ? { 
            ...tx, 
            status: resolution === "approve" ? "completed" : "failed",
            processedAt: new Date().toISOString() 
          }
          : tx
      )
    )
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.creatorName && tx.creatorName.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === "all" || tx.type === filterType
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${mockMetrics.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+{mockMetrics.monthlyGrowth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Platform Fees</p>
                <p className="text-2xl font-bold">${mockMetrics.platformFees.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">15% of revenue</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Creator Payouts</p>
                <p className="text-2xl font-bold">${mockMetrics.creatorPayouts.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${mockMetrics.pendingPayouts.toLocaleString()} pending
                </p>
              </div>
              <Banknote className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disputes</p>
                <p className="text-2xl font-bold">{mockMetrics.disputes}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${mockMetrics.refunds.toLocaleString()} refunded
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Financial Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>View and manage all platform transactions</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {transactions.filter(t => t.status === "pending").length} Pending
                  </Badge>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="payment">Payments</SelectItem>
                    <SelectItem value="payout">Payouts</SelectItem>
                    <SelectItem value="refund">Refunds</SelectItem>
                    <SelectItem value="fee">Fees</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {/* Transactions Table */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Customer/Creator</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transaction.id}</p>
                            <p className="text-sm text-muted-foreground">{transaction.description}</p>
                            {transaction.orderId && (
                              <p className="text-xs text-muted-foreground">Order: {transaction.orderId}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(transaction.type)}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              ${transaction.amount.toFixed(2)}
                            </p>
                            {transaction.platformFee !== 0 && (
                              <p className="text-xs text-muted-foreground">
                                Fee: ${Math.abs(transaction.platformFee).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transaction.customerName}</p>
                            {transaction.creatorName && (
                              <p className="text-sm text-muted-foreground">→ {transaction.creatorName}</p>
                            )}
                            <p className="text-xs text-muted-foreground">{transaction.paymentMethod}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
                            <p className="text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedTransaction(transaction)
                                setIsTransactionDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {transaction.status === "pending" && transaction.type === "payout" && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleProcessPayout(transaction.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {transaction.status === "disputed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTransaction(transaction)
                                  setIsTransactionDialogOpen(true)
                                }}
                              >
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Creator Payouts</CardTitle>
                  <CardDescription>Manage creator payment schedules and processing</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">
                    ${mockMetrics.pendingPayouts.toLocaleString()} Pending
                  </Badge>
                  <Button>Process All Payouts</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions
                  .filter(t => t.type === "payout")
                  .map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Banknote className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{payout.customerName}</h3>
                          <p className="text-sm text-muted-foreground">{payout.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(payout.status)}>
                              {payout.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {payout.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${payout.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payout.createdAt).toLocaleDateString()}
                        </p>
                        {payout.status === "pending" && (
                          <Button
                            size="sm"
                            className="mt-2 bg-green-600 hover:bg-green-700"
                            onClick={() => handleProcessPayout(payout.id)}
                          >
                            Process Now
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Disputes</CardTitle>
              <CardDescription>Review and resolve payment disputes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions
                  .filter(t => t.status === "disputed")
                  .map((dispute) => (
                    <div key={dispute.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{dispute.id}</h3>
                          <p className="text-sm text-muted-foreground">{dispute.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getStatusColor(dispute.status)}>
                              {dispute.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ${dispute.amount.toFixed(2)} • {dispute.customerName}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">${dispute.amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(dispute.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {dispute.notes && (
                        <div className="p-3 bg-yellow-50 rounded-lg mb-4">
                          <p className="text-sm text-yellow-800">
                            <strong>Dispute Reason:</strong> {dispute.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleResolveDispute(dispute.id, "approve")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Transaction
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleResolveDispute(dispute.id, "refund")}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Issue Refund
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTransaction(dispute)
                            setIsTransactionDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                      <p className="text-2xl font-bold">${mockMetrics.averageOrderValue.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Transaction Volume</p>
                      <p className="text-2xl font-bold">{mockMetrics.transactionVolume.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">{mockMetrics.conversionRate.toFixed(1)}%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Monthly revenue distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>Creator Earnings (85%)</span>
                    </div>
                    <span className="font-semibold">${mockMetrics.creatorPayouts.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span>Platform Fees (15%)</span>
                    </div>
                    <span className="font-semibold">${mockMetrics.platformFees.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span>Refunds</span>
                    </div>
                    <span className="font-semibold">-${mockMetrics.refunds.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Dialog */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              View and manage transaction information
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedTransaction.id}</h3>
                  <p className="text-muted-foreground">{selectedTransaction.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${selectedTransaction.amount.toFixed(2)}</p>
                  <Badge className={getStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Transaction Type</Label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedTransaction.type}</p>
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.paymentMethod}</p>
                </div>
                <div>
                  <Label>Customer</Label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.customerName}</p>
                </div>
                {selectedTransaction.creatorName && (
                  <div>
                    <Label>Creator</Label>
                    <p className="text-sm text-muted-foreground">{selectedTransaction.creatorName}</p>
                  </div>
                )}
                <div>
                  <Label>Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedTransaction.processedAt && (
                  <div>
                    <Label>Processed</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedTransaction.processedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {selectedTransaction.platformFee !== 0 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Fee Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Gross Amount:</span>
                      <span>${selectedTransaction.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>${Math.abs(selectedTransaction.platformFee).toFixed(2)}</span>
                    </div>
                    {selectedTransaction.creatorEarnings && (
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Creator Earnings:</span>
                        <span>${selectedTransaction.creatorEarnings.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedTransaction.notes && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm">{selectedTransaction.notes}</p>
                </div>
              )}

              {selectedTransaction.status === "disputed" && (
                <div className="flex space-x-2">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleResolveDispute(selectedTransaction.id, "approve")
                      setIsTransactionDialogOpen(false)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Transaction
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleResolveDispute(selectedTransaction.id, "refund")
                      setIsTransactionDialogOpen(false)
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Issue Refund
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}