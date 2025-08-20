"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ArrowDown,
  ArrowUp,
  Download,
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  Calendar,
  FileText,
  RefreshCw,
  Filter
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

// Translations
const financeTranslations: Record<string, Record<string, string>> = {
  financial_overview: {
    en: "Financial Overview",
    fr: "Aperçu financier",
    ht: "Apèsi finansye"
  },
  platform_finances: {
    en: "Monitor platform revenue and transactions",
    fr: "Surveiller les revenus et transactions",
    ht: "Siveye revni ak tranzaksyon"
  }
}

// Mock financial data
const revenueData = Array.from({ length: 30 }, (_, i) => ({
  date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), 'MMM d'),
  revenue: Math.floor(Math.random() * 5000 + 10000),
  transactions: Math.floor(Math.random() * 100 + 200)
}))

const transactions = [
  { id: "TXN001", creator: "Sarah Johnson", customer: "Michael Chen", amount: 195, fee: 29.25, net: 165.75, status: "completed", date: new Date() },
  { id: "TXN002", creator: "Marie Pierre", customer: "John Davis", amount: 150, fee: 22.50, net: 127.50, status: "pending", date: new Date() },
  { id: "TXN003", creator: "Jean Baptiste", customer: "Lisa Kim", amount: 250, fee: 37.50, net: 212.50, status: "completed", date: new Date() },
  { id: "TXN004", creator: "Pierre Louis", customer: "Emma Thompson", amount: 100, fee: 15.00, net: 85.00, status: "refunded", date: new Date() },
  { id: "TXN005", creator: "Sarah Johnson", customer: "David Brown", amount: 300, fee: 45.00, net: 255.00, status: "completed", date: new Date() }
]

export default function FinancesPage() {
  const { language } = useLanguage()
  const [timeRange, setTimeRange] = useState("30d")

  const t = (key: string) => {
    return financeTranslations[key]?.[language] || financeTranslations[key]?.en || key
  }

  const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0)
  const totalTransactions = revenueData.reduce((sum, day) => sum + day.transactions, 0)
  const avgOrderValue = totalRevenue / totalTransactions
  const platformFees = totalRevenue * 0.15

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{t('financial_overview')}</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{t('platform_finances')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+23.5%</span>
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
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Transactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{totalTransactions.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+18.2%</span>
                </div>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">${avgOrderValue.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-sm text-red-600">-3.1%</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Platform Fees</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">${platformFees.toLocaleString()}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">15% commission</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Daily revenue over the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest platform transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Platform Fee</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(tx => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                  <TableCell>{tx.creator}</TableCell>
                  <TableCell>{tx.customer}</TableCell>
                  <TableCell>${tx.amount.toFixed(2)}</TableCell>
                  <TableCell>${tx.fee.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">${tx.net.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      tx.status === "completed" ? "default" :
                      tx.status === "pending" ? "secondary" :
                      "destructive"
                    }>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(tx.date, 'MMM d, yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}