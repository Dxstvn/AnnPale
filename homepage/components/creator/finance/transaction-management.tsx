"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DollarSign,
  Search,
  Filter,
  Download,
  Printer,
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  User,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Timer,
  TrendingUp,
  FileText,
  Tag,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Plus,
  Banknote,
  Receipt,
  ShoppingBag,
  Gift,
  Briefcase,
  Star,
  Video,
  MessageSquare,
  Music,
  Heart,
  Activity,
  Info,
  ExternalLink,
  Copy,
  Edit3
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

interface Transaction {
  id: string
  amount: number
  customer: {
    name: string
    avatar?: string
    id: string
  }
  date: Date
  type: string
  status: "completed" | "processing" | "clearing" | "available" | "withdrawn"
  fees: {
    platform: number
    payment: number
    total: number
  }
  paymentMethod: string
  category: string
  notes?: string
  transactionId: string
  net: number
}

interface FilterState {
  dateRange: { from: Date | undefined; to: Date | undefined }
  amountRange: { min: number | undefined; max: number | undefined }
  type: string
  status: string
  customer: string
  paymentMethod: string
  category: string
}

export function TransactionManagement() {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: undefined, to: undefined },
    amountRange: { min: undefined, max: undefined },
    type: "all",
    status: "all",
    customer: "",
    paymentMethod: "all",
    category: "all"
  })

  // Mock transactions data
  const transactions: Transaction[] = [
    {
      id: "1",
      amount: 75.00,
      customer: {
        name: "Marie Joseph",
        avatar: "https://i.pravatar.cc/150?img=1",
        id: "cust_1"
      },
      date: new Date("2024-12-27T14:30:00"),
      type: "Birthday Video",
      status: "completed",
      fees: {
        platform: 7.50,
        payment: 2.25,
        total: 9.75
      },
      paymentMethod: "Credit Card",
      category: "celebration",
      notes: "18th birthday message",
      transactionId: "TXN-2024-001",
      net: 65.25
    },
    {
      id: "2",
      amount: 150.00,
      customer: {
        name: "Jean Baptiste",
        avatar: "https://i.pravatar.cc/150?img=2",
        id: "cust_2"
      },
      date: new Date("2024-12-27T10:15:00"),
      type: "Business Shoutout",
      status: "processing",
      fees: {
        platform: 15.00,
        payment: 4.50,
        total: 19.50
      },
      paymentMethod: "PayPal",
      category: "business",
      transactionId: "TXN-2024-002",
      net: 130.50
    },
    {
      id: "3",
      amount: 200.00,
      customer: {
        name: "Sophia Laurent",
        avatar: "https://i.pravatar.cc/150?img=3",
        id: "cust_3"
      },
      date: new Date("2024-12-26T20:45:00"),
      type: "Wedding Message",
      status: "clearing",
      fees: {
        platform: 20.00,
        payment: 6.00,
        total: 26.00
      },
      paymentMethod: "Credit Card",
      category: "wedding",
      notes: "Congratulations video for wedding",
      transactionId: "TXN-2024-003",
      net: 174.00
    },
    {
      id: "4",
      amount: 100.00,
      customer: {
        name: "Pierre Michel",
        avatar: "https://i.pravatar.cc/150?img=4",
        id: "cust_4"
      },
      date: new Date("2024-12-26T15:20:00"),
      type: "Graduation",
      status: "available",
      fees: {
        platform: 10.00,
        payment: 3.00,
        total: 13.00
      },
      paymentMethod: "Apple Pay",
      category: "graduation",
      transactionId: "TXN-2024-004",
      net: 87.00
    },
    {
      id: "5",
      amount: 50.00,
      customer: {
        name: "Anna Claire",
        avatar: "https://i.pravatar.cc/150?img=5",
        id: "cust_5"
      },
      date: new Date("2024-12-25T18:00:00"),
      type: "Holiday Greeting",
      status: "withdrawn",
      fees: {
        platform: 5.00,
        payment: 1.50,
        total: 6.50
      },
      paymentMethod: "Google Pay",
      category: "holiday",
      notes: "Christmas greeting",
      transactionId: "TXN-2024-005",
      net: 43.50
    }
  ]

  const transactionCategories = [
    { id: "celebration", label: "Celebration", icon: <Star className="w-4 h-4" /> },
    { id: "business", label: "Business", icon: <Briefcase className="w-4 h-4" /> },
    { id: "wedding", label: "Wedding", icon: <Heart className="w-4 h-4" /> },
    { id: "graduation", label: "Graduation", icon: <FileText className="w-4 h-4" /> },
    { id: "holiday", label: "Holiday", icon: <Gift className="w-4 h-4" /> }
  ]

  const statusConfig = {
    completed: { color: "green", icon: <CheckCircle2 className="w-4 h-4" />, label: "Completed" },
    processing: { color: "blue", icon: <Clock className="w-4 h-4" />, label: "Processing" },
    clearing: { color: "yellow", icon: <Timer className="w-4 h-4" />, label: "Clearing" },
    available: { color: "purple", icon: <Banknote className="w-4 h-4" />, label: "Available" },
    withdrawn: { color: "gray", icon: <CheckCircle2 className="w-4 h-4" />, label: "Withdrawn" }
  }

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(transactions.map(t => t.id))
    }
  }

  const handleSelectTransaction = (id: string) => {
    setSelectedTransactions(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    )
  }

  const handleBulkExport = () => {
    console.log("Exporting transactions:", selectedTransactions)
  }

  const handleBulkPrint = () => {
    console.log("Printing transactions:", selectedTransactions)
  }

  const handleBulkCategorize = () => {
    console.log("Categorizing transactions:", selectedTransactions)
  }

  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !transaction.customer.name.toLowerCase().includes(query) &&
        !transaction.transactionId.toLowerCase().includes(query) &&
        !transaction.type.toLowerCase().includes(query) &&
        !transaction.notes?.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    // Status filter
    if (filters.status !== "all" && transaction.status !== filters.status) {
      return false
    }

    // Category filter
    if (filters.category !== "all" && transaction.category !== filters.category) {
      return false
    }

    // Payment method filter
    if (filters.paymentMethod !== "all" && transaction.paymentMethod !== filters.paymentMethod) {
      return false
    }

    // Date range filter
    if (filters.dateRange.from && transaction.date < filters.dateRange.from) {
      return false
    }
    if (filters.dateRange.to && transaction.date > filters.dateRange.to) {
      return false
    }

    // Amount range filter
    if (filters.amountRange.min && transaction.amount < filters.amountRange.min) {
      return false
    }
    if (filters.amountRange.max && transaction.amount > filters.amountRange.max) {
      return false
    }

    return true
  })

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalFees = filteredTransactions.reduce((sum, t) => sum + t.fees.total, 0)
  const totalNet = filteredTransactions.reduce((sum, t) => sum + t.net, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header with Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Transaction Management</h2>
          <p className="text-gray-500">Complete transparency into all financial transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {filteredTransactions.length} transactions
          </Badge>
          <Badge variant="outline">
            ${totalAmount.toFixed(2)} total
          </Badge>
          <Badge variant="outline">
            ${totalNet.toFixed(2)} net
          </Badge>
        </div>
      </div>

      {/* Transaction Status Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction Lifecycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto">
            {Object.entries(statusConfig).map(([key, config], index) => (
              <div key={key} className="flex items-center">
                <div className="text-center min-w-[100px]">
                  <div className={`mx-auto w-12 h-12 rounded-full bg-${config.color}-100 flex items-center justify-center mb-2`}>
                    {config.icon}
                  </div>
                  <p className="text-sm font-medium">{config.label}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {key === "completed" && "Instant"}
                    {key === "processing" && "1-2 hours"}
                    {key === "clearing" && "2-3 days"}
                    {key === "available" && "Ready"}
                    {key === "withdrawn" && "To bank"}
                  </p>
                </div>
                {index < Object.keys(statusConfig).length - 1 && (
                  <ChevronRight className="w-6 h-6 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by customer, ID, amount, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="min-w-[120px]"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Date Range */}
                  <div>
                    <Label>Date Range</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {filters.dateRange.from ? format(filters.dateRange.from, "MMM d") : "From"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.from}
                            onSelect={(date) => setFilters(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, from: date }
                            }))}
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {filters.dateRange.to ? format(filters.dateRange.to, "MMM d") : "To"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.to}
                            onSelect={(date) => setFilters(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, to: date }
                            }))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Amount Range */}
                  <div>
                    <Label>Amount Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.amountRange.min || ""}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          amountRange: { ...prev.amountRange, min: e.target.value ? Number(e.target.value) : undefined }
                        }))}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.amountRange.max || ""}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          amountRange: { ...prev.amountRange, max: e.target.value ? Number(e.target.value) : undefined }
                        }))}
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <Label>Status</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>{config.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <Label>Category</Label>
                    <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {transactionCategories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Method Filter */}
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={filters.paymentMethod} onValueChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All methods" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                        <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                        <SelectItem value="Google Pay">Google Pay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => setFilters({
                        dateRange: { from: undefined, to: undefined },
                        amountRange: { min: undefined, max: undefined },
                        type: "all",
                        status: "all",
                        customer: "",
                        paymentMethod: "all",
                        category: "all"
                      })}
                      className="w-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      {selectedTransactions.length > 0 && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default">
                  {selectedTransactions.length} selected
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTransactions([])}>
                  Clear selection
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkExport}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkPrint}>
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkCategorize}>
                  <Tag className="w-4 h-4 mr-1" />
                  Categorize
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedTransactions.length === transactions.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-500">Select all</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Transaction Row */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedTransactions.includes(transaction.id)}
                          onCheckedChange={() => handleSelectTransaction(transaction.id)}
                        />
                        
                        {/* Amount - Primary */}
                        <div className="text-right">
                          <p className="text-2xl font-bold">${transaction.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Net: ${transaction.net.toFixed(2)}</p>
                        </div>

                        {/* Customer - Secondary */}
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={transaction.customer.avatar} />
                            <AvatarFallback>
                              {transaction.customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{transaction.customer.name}</p>
                            <p className="text-sm text-gray-500">{transaction.type}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Date/Time - Secondary */}
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {format(transaction.date, "MMM d, yyyy")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(transaction.date, "h:mm a")}
                          </p>
                        </div>

                        {/* Status - Visual */}
                        <Badge variant={
                          transaction.status === "completed" ? "default" :
                          transaction.status === "processing" ? "secondary" :
                          transaction.status === "clearing" ? "outline" :
                          transaction.status === "available" ? "default" :
                          "secondary"
                        }>
                          {statusConfig[transaction.status].icon}
                          <span className="ml-1">{statusConfig[transaction.status].label}</span>
                        </Badge>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedTransaction(
                            expandedTransaction === transaction.id ? null : transaction.id
                          )}
                        >
                          {expandedTransaction === transaction.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedTransaction === transaction.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-gray-500">Transaction ID</Label>
                              <div className="flex items-center gap-2">
                                <p className="font-mono text-sm">{transaction.transactionId}</p>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-gray-500">Payment Method</Label>
                              <p className="font-medium">{transaction.paymentMethod}</p>
                            </div>
                            <div>
                              <Label className="text-gray-500">Category</Label>
                              <div className="flex items-center gap-2">
                                {transactionCategories.find(c => c.id === transaction.category)?.icon}
                                <p className="font-medium">
                                  {transactionCategories.find(c => c.id === transaction.category)?.label}
                                </p>
                              </div>
                            </div>
                            <div>
                              <Label className="text-gray-500">Fees Breakdown</Label>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Platform Fee:</span>
                                  <span>${transaction.fees.platform.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Payment Fee:</span>
                                  <span>${transaction.fees.payment.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium border-t pt-1">
                                  <span>Total Fees:</span>
                                  <span>${transaction.fees.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            {transaction.notes && (
                              <div className="md:col-span-2">
                                <Label className="text-gray-500">Notes</Label>
                                <p className="text-sm">{transaction.notes}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm">
                              <Edit3 className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Receipt className="w-4 h-4 mr-1" />
                              Receipt
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Summary Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-500">Total Amount</Label>
              <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500">Total Fees</Label>
              <p className="text-2xl font-bold text-red-600">${totalFees.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500">Net Earnings</Label>
              <p className="text-2xl font-bold text-green-600">${totalNet.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500">Average Transaction</Label>
              <p className="text-2xl font-bold">
                ${filteredTransactions.length > 0 
                  ? (totalAmount / filteredTransactions.length).toFixed(2)
                  : "0.00"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}