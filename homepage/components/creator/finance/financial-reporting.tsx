"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Plus,
  Eye,
  Send,
  Printer,
  FileSpreadsheet,
  FilePlus,
  FileDown,
  BarChart3,
  LineChart,
  PieChart,
  Receipt,
  Users,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Settings,
  HelpCircle,
  Sparkles,
  Target,
  Shield,
  Zap,
  Mail,
  Share2,
  Archive,
  FolderOpen,
  Database,
  ArrowUp,
  ArrowDown,
  Calculator,
  Briefcase,
  CreditCard,
  Wallet,
  Building,
  Home,
  Car,
  ShoppingCart,
  Gift,
  Heart,
  Star,
  Award,
  Trophy,
  Flag,
  Bookmark,
  Hash,
  Percent,
  Activity,
  TrendingUp as TrendUp,
  TrendingDown as TrendDown,
  MoreVertical,
  Copy,
  ExternalLink
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  Scatter,
  ScatterChart,
  Treemap
} from "recharts"
import { format, subMonths, startOfMonth, endOfMonth, subDays, startOfYear } from "date-fns"

interface Report {
  id: string
  type: "profit-loss" | "cash-flow" | "customer-analysis" | "service-performance" | "tax-summary"
  name: string
  description: string
  frequency: string
  lastGenerated: Date
  format: string[]
  status: "ready" | "generating" | "scheduled" | "error"
  size?: string
  downloads?: number
}

interface ReportData {
  revenue: number
  expenses: number
  netProfit: number
  previousRevenue: number
  previousExpenses: number
  previousNetProfit: number
  growth: number
  margin: number
}

interface Transaction {
  id: string
  date: Date
  type: "income" | "expense"
  category: string
  description: string
  amount: number
  customer?: string
  status: "completed" | "pending" | "failed"
}

export function FinancialReporting() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [reportPeriod, setReportPeriod] = useState("month")
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  })
  const [selectedFormat, setSelectedFormat] = useState("pdf")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeDetails, setIncludeDetails] = useState(true)
  const [autoGenerate, setAutoGenerate] = useState(false)

  // Fixed date for consistency
  const currentDate = new Date("2024-12-27T00:00:00.000Z")

  // Mock report types
  const reportTypes: Report[] = [
    {
      id: "1",
      type: "profit-loss",
      name: "Profit & Loss Statement",
      description: "Comprehensive overview of revenue and expenses",
      frequency: "Monthly",
      lastGenerated: new Date("2024-12-01T00:00:00.000Z"),
      format: ["PDF", "Excel", "CSV"],
      status: "ready",
      size: "2.4 MB",
      downloads: 45
    },
    {
      id: "2",
      type: "cash-flow",
      name: "Cash Flow Report",
      description: "Track money movement and liquidity",
      frequency: "Weekly",
      lastGenerated: new Date("2024-12-20T00:00:00.000Z"),
      format: ["Excel", "CSV"],
      status: "ready",
      size: "1.8 MB",
      downloads: 32
    },
    {
      id: "3",
      type: "customer-analysis",
      name: "Customer Analysis",
      description: "Revenue breakdown by customer segments",
      frequency: "Quarterly",
      lastGenerated: new Date("2024-10-01T00:00:00.000Z"),
      format: ["PDF", "PowerPoint"],
      status: "scheduled",
      size: "3.2 MB",
      downloads: 18
    },
    {
      id: "4",
      type: "service-performance",
      name: "Service Performance",
      description: "Analysis of video message types and pricing",
      frequency: "Monthly",
      lastGenerated: new Date("2024-12-15T00:00:00.000Z"),
      format: ["Dashboard", "PDF"],
      status: "ready",
      size: "1.5 MB",
      downloads: 27
    },
    {
      id: "5",
      type: "tax-summary",
      name: "Tax Summary Report",
      description: "Annual tax preparation summary",
      frequency: "Annual",
      lastGenerated: new Date("2024-01-01T00:00:00.000Z"),
      format: ["PDF", "Excel"],
      status: "ready",
      size: "4.1 MB",
      downloads: 8
    }
  ]

  // Mock financial data
  const reportData: ReportData = {
    revenue: 45678,
    expenses: 12543,
    netProfit: 33135,
    previousRevenue: 42150,
    previousExpenses: 11200,
    previousNetProfit: 30950,
    growth: 8.4,
    margin: 72.5
  }

  // Revenue breakdown data
  const revenueBreakdown = [
    { category: "Birthday Messages", value: 18500, percentage: 40.5 },
    { category: "Business Shoutouts", value: 12300, percentage: 26.9 },
    { category: "Wedding Messages", value: 8900, percentage: 19.5 },
    { category: "Holiday Greetings", value: 3500, percentage: 7.7 },
    { category: "Custom Requests", value: 2478, percentage: 5.4 }
  ]

  // Expense categories
  const expenseCategories = [
    { category: "Platform Fees", amount: 9135, percentage: 72.8 },
    { category: "Equipment", amount: 1500, percentage: 12.0 },
    { category: "Marketing", amount: 800, percentage: 6.4 },
    { category: "Software", amount: 450, percentage: 3.6 },
    { category: "Other", amount: 658, percentage: 5.2 }
  ]

  // Monthly trend data
  const monthlyTrend = [
    { month: "Jul", revenue: 32000, expenses: 8500, profit: 23500 },
    { month: "Aug", revenue: 35000, expenses: 9200, profit: 25800 },
    { month: "Sep", revenue: 38500, expenses: 10100, profit: 28400 },
    { month: "Oct", revenue: 41000, expenses: 10800, profit: 30200 },
    { month: "Nov", revenue: 42150, expenses: 11200, profit: 30950 },
    { month: "Dec", revenue: 45678, expenses: 12543, profit: 33135 }
  ]

  // Customer segments
  const customerSegments = [
    { segment: "Individual", count: 234, revenue: 25000, avgOrder: 107 },
    { segment: "Business", count: 45, revenue: 15000, avgOrder: 333 },
    { segment: "Repeat", count: 89, revenue: 5678, avgOrder: 64 }
  ]

  // Service performance data
  const servicePerformance = [
    { service: "Standard Message", orders: 156, revenue: 23400, rating: 4.8 },
    { service: "Premium Message", orders: 78, revenue: 15600, rating: 4.9 },
    { service: "Rush Delivery", orders: 45, revenue: 6678, rating: 4.7 }
  ]

  // Cash flow data
  const cashFlowData = [
    { week: "Week 1", inflow: 11200, outflow: 2800, net: 8400 },
    { week: "Week 2", inflow: 10500, outflow: 3200, net: 7300 },
    { week: "Week 3", inflow: 12300, outflow: 3100, net: 9200 },
    { week: "Week 4", inflow: 11678, outflow: 3443, net: 8235 }
  ]

  // Colors for charts
  const COLORS = ['#9333ea', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      setShowPreview(true)
    }, 2000)
  }

  const handleDownloadReport = (format: string) => {
    console.log(`Downloading report in ${format} format`)
  }

  const handleScheduleReport = () => {
    console.log("Scheduling report generation")
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case "profit-loss":
        return <DollarSign className="w-5 h-5" />
      case "cash-flow":
        return <Activity className="w-5 h-5" />
      case "customer-analysis":
        return <Users className="w-5 h-5" />
      case "service-performance":
        return <Package className="w-5 h-5" />
      case "tax-summary":
        return <Receipt className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-700"
      case "generating":
        return "bg-blue-100 text-blue-700"
      case "scheduled":
        return "bg-yellow-100 text-yellow-700"
      case "error":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Financial Reporting</h2>
          <p className="text-gray-500">Generate comprehensive reports for business analysis and tax preparation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
          <Button onClick={handleGenerateReport}>
            <Plus className="w-4 h-4 mr-1" />
            New Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">${reportData.revenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600">+{reportData.growth}%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expenses</p>
                <p className="text-2xl font-bold">${reportData.expenses.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600">+12.0%</span>
                </div>
              </div>
              <CreditCard className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Net Profit</p>
                <p className="text-2xl font-bold">${reportData.netProfit.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600">+7.1%</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Profit Margin</p>
                <p className="text-2xl font-bold">{reportData.margin}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDown className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-yellow-600">-1.2%</span>
                </div>
              </div>
              <Percent className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profit & Loss Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Profit & Loss Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Revenue</span>
                      <span className="font-medium">${reportData.revenue.toLocaleString()}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Expenses</span>
                      <span className="font-medium">${reportData.expenses.toLocaleString()}</span>
                    </div>
                    <Progress value={(reportData.expenses / reportData.revenue) * 100} className="h-2" />
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Net Profit</span>
                    <span className="text-xl font-bold text-green-600">
                      ${reportData.netProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-700">Profit Margin</span>
                      <span className="font-bold text-purple-700">{reportData.margin}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#9333ea" 
                      fill="#9333ea" 
                      fillOpacity={0.2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown & Expense Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={revenueBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {revenueBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{item.category}</span>
                      </div>
                      <span className="font-medium">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expense Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={expenseCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="amount" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {expenseCategories.slice(0, 4).map((expense, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{expense.category}</span>
                      <span className="font-medium">{expense.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report List */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Available Reports</CardTitle>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportTypes.map((report) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              {getReportIcon(report.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold">{report.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {report.frequency}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Last: {format(report.lastGenerated, "MMM d")}
                                </span>
                                {report.size && (
                                  <span className="flex items-center gap-1">
                                    <Database className="w-3 h-3" />
                                    {report.size}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                            <div className="flex items-center gap-1 mt-2">
                              {report.format.map((fmt) => (
                                <Button
                                  key={fmt}
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDownloadReport(fmt)
                                  }}
                                >
                                  <FileDown className="w-3 h-3" />
                                </Button>
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowPreview(true)
                                }}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Configuration */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Report Period</Label>
                      <Select value={reportPeriod} onValueChange={setReportPeriod}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Last Week</SelectItem>
                          <SelectItem value="month">Last Month</SelectItem>
                          <SelectItem value="quarter">Last Quarter</SelectItem>
                          <SelectItem value="year">Last Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Export Format</Label>
                      <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          <SelectItem value="csv">CSV File</SelectItem>
                          <SelectItem value="ppt">PowerPoint</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="charts">Include Charts</Label>
                        <Switch
                          id="charts"
                          checked={includeCharts}
                          onCheckedChange={setIncludeCharts}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="details">Include Details</Label>
                        <Switch
                          id="details"
                          checked={includeDetails}
                          onCheckedChange={setIncludeDetails}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto">Auto-Generate</Label>
                        <Switch
                          id="auto"
                          checked={autoGenerate}
                          onCheckedChange={setAutoGenerate}
                        />
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Dashboard
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Archive className="w-4 h-4 mr-2" />
                      Archive Old Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Generation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          {/* Cash Flow Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="inflow" fill="#10b981" />
                  <Bar dataKey="outflow" fill="#ef4444" />
                  <Line type="monotone" dataKey="net" stroke="#9333ea" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Segments */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegments.map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{segment.segment}</span>
                        <Badge variant="outline">{segment.count} customers</Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Revenue: ${segment.revenue.toLocaleString()}</span>
                        <span>Avg: ${segment.avgOrder}</span>
                      </div>
                      <Progress 
                        value={(segment.revenue / reportData.revenue) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servicePerformance.map((service, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{service.service}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm">{service.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{service.orders} orders</span>
                        <span className="font-medium">${service.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <TrendUp className="w-4 h-4" />
                    <AlertDescription>
                      Revenue increased by 8.4% compared to last month
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Users className="w-4 h-4" />
                    <AlertDescription>
                      Birthday messages generate 40.5% of total revenue
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Target className="w-4 h-4" />
                    <AlertDescription>
                      Premium messages have the highest satisfaction rating
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Zap className="w-4 h-4" />
                    <AlertDescription>
                      Rush delivery option shows 35% growth potential
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction Details</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-left p-2">Customer</th>
                      <th className="text-right p-2">Amount</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-2">Dec 27</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-green-600">Income</Badge>
                      </td>
                      <td className="p-2">Birthday</td>
                      <td className="p-2">Birthday message for Jean</td>
                      <td className="p-2">Marie J.</td>
                      <td className="p-2 text-right font-medium">$150</td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700">Completed</Badge>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-2">Dec 26</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-red-600">Expense</Badge>
                      </td>
                      <td className="p-2">Platform</td>
                      <td className="p-2">Platform fee</td>
                      <td className="p-2">-</td>
                      <td className="p-2 text-right font-medium text-red-600">-$30</td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700">Completed</Badge>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-2">Dec 26</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-green-600">Income</Badge>
                      </td>
                      <td className="p-2">Business</td>
                      <td className="p-2">Business shoutout</td>
                      <td className="p-2">Tech Co.</td>
                      <td className="p-2 text-right font-medium">$300</td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700">Completed</Badge>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-2">Dec 25</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-green-600">Income</Badge>
                      </td>
                      <td className="p-2">Holiday</td>
                      <td className="p-2">Christmas greeting</td>
                      <td className="p-2">Paul R.</td>
                      <td className="p-2 text-right font-medium">$75</td>
                      <td className="p-2">
                        <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-2">Dec 24</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-red-600">Expense</Badge>
                      </td>
                      <td className="p-2">Equipment</td>
                      <td className="p-2">Ring light purchase</td>
                      <td className="p-2">-</td>
                      <td className="p-2 text-right font-medium text-red-600">-$89</td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700">Completed</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scheduled Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Monthly P&L Report</h4>
                        <p className="text-sm text-gray-600">Generates on the 1st of each month</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Next: Jan 1, 2025
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email to: you@example.com
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Weekly Cash Flow</h4>
                        <p className="text-sm text-gray-600">Generates every Monday</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Next: Dec 30, 2024
                      </span>
                      <span className="flex items-center gap-1">
                        <FileSpreadsheet className="w-3 h-3" />
                        Format: Excel
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Quarterly Tax Summary</h4>
                        <p className="text-sm text-gray-600">Generates quarterly for tax prep</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Next: Jan 15, 2025
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Format: PDF
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Create Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Report Type</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select report" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pl">Profit & Loss</SelectItem>
                        <SelectItem value="cf">Cash Flow</SelectItem>
                        <SelectItem value="ca">Customer Analysis</SelectItem>
                        <SelectItem value="sp">Service Performance</SelectItem>
                        <SelectItem value="ts">Tax Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Delivery Method</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="email" defaultChecked />
                        <Label htmlFor="email" className="cursor-pointer">Email</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="dashboard" />
                        <Label htmlFor="dashboard" className="cursor-pointer">Dashboard</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="download" />
                        <Label htmlFor="download" className="cursor-pointer">Auto-download</Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Recipients</Label>
                    <Input 
                      placeholder="email@example.com" 
                      className="mt-2"
                    />
                  </div>
                  <Button className="w-full" onClick={handleScheduleReport}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Report Preview Content */}
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold">Financial Report</h1>
                    <p className="text-gray-500 mt-1">December 2024 - Profit & Loss Statement</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Generated on</p>
                    <p className="font-medium">{format(currentDate, "MMMM d, yyyy")}</p>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Executive Summary</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-700">${reportData.revenue.toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-1">+8.4% from last month</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-700">${reportData.expenses.toLocaleString()}</p>
                      <p className="text-xs text-red-600 mt-1">+12.0% from last month</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Net Profit</p>
                      <p className="text-2xl font-bold text-purple-700">${reportData.netProfit.toLocaleString()}</p>
                      <p className="text-xs text-purple-600 mt-1">72.5% margin</p>
                    </div>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Revenue Breakdown</h2>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Category</th>
                        <th className="text-right py-2">Amount</th>
                        <th className="text-right py-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueBreakdown.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{item.category}</td>
                          <td className="text-right py-2">${item.value.toLocaleString()}</td>
                          <td className="text-right py-2">{item.percentage}%</td>
                        </tr>
                      ))}
                      <tr className="font-bold">
                        <td className="py-2">Total</td>
                        <td className="text-right py-2">${reportData.revenue.toLocaleString()}</td>
                        <td className="text-right py-2">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="border-t pt-4 mt-8 text-sm text-gray-500">
                  <p>This report was automatically generated by Ann Pale Financial Reporting System</p>
                  <p>For questions, contact support@annpale.com</p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t p-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
                <Button>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}