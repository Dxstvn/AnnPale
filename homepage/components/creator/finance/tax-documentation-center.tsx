"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { 
  FileText,
  Download,
  Upload,
  Calculator,
  Calendar as CalendarIcon,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Receipt,
  Car,
  Home,
  Laptop,
  BookOpen,
  Users,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Filter,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  FileDown,
  Mail,
  Building,
  PieChart,
  BarChart3,
  Info,
  Shield,
  Briefcase,
  Package,
  Camera,
  Percent,
  FileSpreadsheet,
  Database,
  ExternalLink,
  Archive,
  FolderOpen,
  Star,
  RefreshCw,
  Target,
  Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

interface TaxDocument {
  id: string
  type: string
  year: number
  name: string
  generated: Date
  status: "ready" | "pending" | "processing"
  downloadUrl?: string
}

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: Date
  receipt?: string
  deductible: boolean
}

interface QuarterlyPayment {
  quarter: string
  dueDate: Date
  estimated: number
  paid: number
  status: "paid" | "due" | "upcoming"
}

export function TaxDocumentationCenter() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedTab, setSelectedTab] = useState("overview")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: 0,
    deductible: true
  })
  const [taxRate, setTaxRate] = useState(25)
  const [selectedState, setSelectedState] = useState("FL")
  const [showAddExpense, setShowAddExpense] = useState(false)

  // Current year financials
  const currentYear = {
    earnings: 45678,
    platformFees: 9135,
    processingFees: 1327,
    netIncome: 35216,
    deductions: 8750,
    taxableIncome: 26466,
    estimatedTax: 6617,
    quarterlyPayment: 1654
  }

  // Mock tax documents
  const taxDocuments: TaxDocument[] = [
    {
      id: "1",
      type: "1099-NEC",
      year: 2024,
      name: "1099-NEC Tax Form",
      generated: new Date("2024-01-15"),
      status: "ready",
      downloadUrl: "#"
    },
    {
      id: "2",
      type: "Annual Summary",
      year: 2024,
      name: "2024 Annual Tax Summary",
      generated: new Date("2024-12-31"),
      status: "processing"
    },
    {
      id: "3",
      type: "Monthly Statement",
      year: 2024,
      name: "December 2024 Statement",
      generated: new Date("2024-12-31"),
      status: "ready",
      downloadUrl: "#"
    },
    {
      id: "4",
      type: "W-9",
      year: 2024,
      name: "W-9 Form",
      generated: new Date("2024-01-01"),
      status: "ready",
      downloadUrl: "#"
    }
  ]

  // Quarterly payments
  const quarterlyPayments: QuarterlyPayment[] = [
    {
      quarter: "Q1 2024",
      dueDate: new Date("2024-04-15"),
      estimated: 1654,
      paid: 1654,
      status: "paid"
    },
    {
      quarter: "Q2 2024",
      dueDate: new Date("2024-06-15"),
      estimated: 1654,
      paid: 1654,
      status: "paid"
    },
    {
      quarter: "Q3 2024",
      dueDate: new Date("2024-09-15"),
      estimated: 1654,
      paid: 1654,
      status: "paid"
    },
    {
      quarter: "Q4 2024",
      dueDate: new Date("2025-01-15"),
      estimated: 1654,
      paid: 0,
      status: "due"
    }
  ]

  // Deduction categories
  const deductionCategories = [
    { id: "equipment", name: "Equipment", icon: <Laptop className="w-4 h-4" />, total: 2500 },
    { id: "home-office", name: "Home Office", icon: <Home className="w-4 h-4" />, total: 1800 },
    { id: "mileage", name: "Mileage", icon: <Car className="w-4 h-4" />, total: 1200 },
    { id: "software", name: "Software", icon: <Package className="w-4 h-4" />, total: 750 },
    { id: "education", name: "Education", icon: <BookOpen className="w-4 h-4" />, total: 500 },
    { id: "marketing", name: "Marketing", icon: <TrendingUp className="w-4 h-4" />, total: 2000 }
  ]

  // Tax tips for creators
  const taxTips = [
    {
      title: "Track Equipment Purchases",
      description: "Cameras, lighting, and computers can be deducted",
      icon: <Camera className="w-5 h-5" />
    },
    {
      title: "Home Office Deduction",
      description: "Deduct a portion of rent/mortgage if you work from home",
      icon: <Home className="w-5 h-5" />
    },
    {
      title: "Save Quarterly",
      description: "Set aside 25-30% of earnings for taxes",
      icon: <PiggyBank className="w-5 h-5" />
    },
    {
      title: "Document Everything",
      description: "Keep receipts and records for all business expenses",
      icon: <Receipt className="w-5 h-5" />
    }
  ]

  // Calculate tax estimates
  const calculateTax = (income: number, deductions: number, rate: number) => {
    const taxableIncome = Math.max(0, income - deductions)
    const federalTax = taxableIncome * (rate / 100)
    const selfEmploymentTax = income * 0.1413 // 14.13% SE tax
    return {
      taxableIncome,
      federalTax,
      selfEmploymentTax,
      totalTax: federalTax + selfEmploymentTax,
      effectiveRate: ((federalTax + selfEmploymentTax) / income) * 100
    }
  }

  const taxCalculation = calculateTax(currentYear.netIncome, currentYear.deductions, taxRate)

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount > 0) {
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        description: newExpense.description,
        amount: newExpense.amount,
        date: new Date(),
        deductible: newExpense.deductible
      }
      setExpenses([...expenses, expense])
      setNewExpense({ category: "", description: "", amount: 0, deductible: true })
      setShowAddExpense(false)
    }
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "1099-NEC": return <FileText className="w-5 h-5" />
      case "W-9": return <FileSpreadsheet className="w-5 h-5" />
      case "Annual Summary": return <BarChart3 className="w-5 h-5" />
      case "Monthly Statement": return <Calendar className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tax Documentation Center</h2>
          <p className="text-gray-500">Simplify tax compliance with organized documentation and tools</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <HelpCircle className="w-4 h-4 mr-1" />
            Get Help
          </Button>
        </div>
      </div>

      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-500" />
              <Badge variant="outline" className="text-xs">YTD</Badge>
            </div>
            <p className="text-2xl font-bold">${currentYear.earnings.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Gross Earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Receipt className="w-8 h-8 text-blue-500" />
              <Badge variant="outline" className="text-xs">Total</Badge>
            </div>
            <p className="text-2xl font-bold">${currentYear.deductions.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Deductions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Calculator className="w-8 h-8 text-purple-500" />
              <Badge variant="outline" className="text-xs">Estimated</Badge>
            </div>
            <p className="text-2xl font-bold">${taxCalculation.totalTax.toFixed(0)}</p>
            <p className="text-xs text-gray-500">Tax Liability</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-orange-500" />
              <Badge variant="outline" className="text-xs">Quarterly</Badge>
            </div>
            <p className="text-2xl font-bold">${currentYear.quarterlyPayment}</p>
            <p className="text-xs text-gray-500">Next Payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Year Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Year {selectedYear} Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gross Earnings</span>
                      <span className="font-medium">${currentYear.earnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Platform Fees</span>
                      <span>-${currentYear.platformFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Processing Fees</span>
                      <span>-${currentYear.processingFees.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Net Income</span>
                      <span>${currentYear.netIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Deductions</span>
                      <span>-${currentYear.deductions.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Taxable Income</span>
                      <span>${taxCalculation.taxableIncome.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Estimated Tax</span>
                      <span className="text-2xl font-bold text-purple-600">
                        ${taxCalculation.totalTax.toFixed(0)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Effective Rate: {taxCalculation.effectiveRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quarterly Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Tax Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quarterlyPayments.map((payment) => (
                    <div key={payment.quarter} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.quarter}</p>
                        <p className="text-sm text-gray-500">
                          Due: {format(payment.dueDate, "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${payment.estimated}</p>
                        <Badge variant={
                          payment.status === "paid" ? "default" :
                          payment.status === "due" ? "destructive" : "secondary"
                        }>
                          {payment.status === "paid" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {payment.status === "due" && <AlertCircle className="w-3 h-3 mr-1" />}
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-900">
                    <Info className="w-4 h-4" />
                    <p className="text-sm">
                      Next payment of <strong>${currentYear.quarterlyPayment}</strong> due January 15, 2025
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deduction Categories Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Deduction Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {deductionCategories.map((category) => (
                  <div key={category.id} className="text-center">
                    <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                      {category.icon}
                    </div>
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-lg font-bold">${category.total}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tax Documents</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-1" />
                    Upload W-9
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {taxDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        {getDocumentIcon(doc.type)}
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          Generated: {format(doc.generated, "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        doc.status === "ready" ? "default" :
                        doc.status === "processing" ? "secondary" : "outline"
                      }>
                        {doc.status}
                      </Badge>
                      {doc.status === "ready" && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Generate Documents */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Generate Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Annual Summary
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Receipt className="w-4 h-4 mr-2" />
                    Expense Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export to Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Estimator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Side */}
                <div className="space-y-4">
                  <div>
                    <Label>Annual Income</Label>
                    <Input
                      type="number"
                      value={currentYear.earnings}
                      className="mt-2"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <Label>Total Deductions</Label>
                    <Input
                      type="number"
                      value={currentYear.deductions}
                      className="mt-2"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label>Federal Tax Rate (%)</Label>
                    <div className="mt-2 space-y-2">
                      <Slider
                        value={[taxRate]}
                        onValueChange={([value]) => setTaxRate(value)}
                        max={37}
                        min={10}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>10%</span>
                        <span className="font-medium text-black">{taxRate}%</span>
                        <span>37%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>State</Label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FL">Florida (0%)</SelectItem>
                        <SelectItem value="CA">California (13.3%)</SelectItem>
                        <SelectItem value="NY">New York (10.9%)</SelectItem>
                        <SelectItem value="TX">Texas (0%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Results Side */}
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <h3 className="font-semibold mb-4">Tax Calculation</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxable Income</span>
                        <span className="font-medium">
                          ${taxCalculation.taxableIncome.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Federal Tax</span>
                        <span className="font-medium">
                          ${taxCalculation.federalTax.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Self-Employment Tax</span>
                        <span className="font-medium">
                          ${taxCalculation.selfEmploymentTax.toFixed(0)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Tax Liability</span>
                        <span className="text-purple-600">
                          ${taxCalculation.totalTax.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Effective Rate</span>
                        <span>{taxCalculation.effectiveRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Sparkles className="w-4 h-4" />
                    <AlertDescription>
                      <strong>Quarterly Payment:</strong> ${(taxCalculation.totalTax / 4).toFixed(0)} 
                      <br />
                      Set aside this amount every quarter to avoid penalties.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deductions Tab */}
        <TabsContent value="deductions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Expense Tracking</CardTitle>
                <Button onClick={() => setShowAddExpense(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Add Expense Form */}
              <AnimatePresence>
                {showAddExpense && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-6 p-4 border rounded-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Select 
                        value={newExpense.category} 
                        onValueChange={(value) => setNewExpense({...newExpense, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {deductionCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Description"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={newExpense.amount || ""}
                        onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleAddExpense}>Add</Button>
                        <Button variant="outline" onClick={() => setShowAddExpense(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Deduction Categories with Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {deductionCategories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          {category.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-sm text-gray-500">YTD Total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${category.total}</p>
                        <Badge variant="outline" className="text-xs">
                          Deductible
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(category.total / 5000) * 100} className="h-2" />
                    <p className="text-xs text-gray-500 mt-2">
                      ${(5000 - category.total).toLocaleString()} until limit
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent Expenses */}
              {expenses.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Recent Expenses</h4>
                  <div className="space-y-2">
                    {expenses.slice(-5).reverse().map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-gray-500">
                            {expense.category} • {format(expense.date, "MMM d, yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${expense.amount.toFixed(2)}</p>
                          {expense.deductible && (
                            <Badge variant="outline" className="text-xs">Deductible</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tax Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Tips for Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxTips.map((tip, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                        {tip.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{tip.title}</h4>
                        <p className="text-sm text-gray-600">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resources & Links */}
            <Card>
              <CardHeader>
                <CardTitle>Resources & Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      Export to QuickBooks
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      TurboTax Import
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      State Tax Guide
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Find a CPA
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      IRS Resources
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Important Tax Dates 2024-2025</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="font-semibold text-red-900">January 15, 2025</p>
                  <p className="text-sm text-red-700">Q4 2024 Estimated Tax Due</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-orange-900">January 31, 2025</p>
                  <p className="text-sm text-orange-700">1099-NEC Forms Sent</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="font-semibold text-yellow-900">April 15, 2025</p>
                  <p className="text-sm text-yellow-700">Tax Filing Deadline</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-900">April 15, 2025</p>
                  <p className="text-sm text-green-700">Q1 2025 Estimated Tax Due</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Add missing PiggyBank icon implementation
const PiggyBank = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)