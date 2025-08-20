"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
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
  Wallet,
  PiggyBank,
  Receipt,
  Calculator,
  FileText,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Percent,
  Coins,
  Building,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RevenueData {
  period: string
  revenue: number
  transactions: number
  avgOrderValue: number
  growth: number
  commission: number
  netRevenue: number
}

interface CreatorEarning {
  id: string
  name: string
  totalEarnings: number
  pendingPayout: number
  completedVideos: number
  avgPrice: number
  commission: number
  lastPayout: string
  trend: "up" | "down" | "stable"
}

interface TransactionSummary {
  type: string
  count: number
  volume: number
  fees: number
  netAmount: number
  percentOfTotal: number
}

interface ExpenseCategory {
  category: string
  amount: number
  percentOfRevenue: number
  trend: "up" | "down" | "stable"
  budget: number
  variance: number
}

const revenueData: RevenueData[] = [
  {
    period: "January 2024",
    revenue: 98420,
    transactions: 2145,
    avgOrderValue: 45.87,
    growth: 12.3,
    commission: 19684,
    netRevenue: 78736
  },
  {
    period: "February 2024",
    revenue: 112350,
    transactions: 2432,
    avgOrderValue: 46.20,
    growth: 14.2,
    commission: 22470,
    netRevenue: 89880
  },
  {
    period: "March 2024",
    revenue: 125430,
    transactions: 2687,
    avgOrderValue: 46.69,
    growth: 11.6,
    commission: 25086,
    netRevenue: 100344
  }
]

const topCreatorEarnings: CreatorEarning[] = [
  {
    id: "creator-1",
    name: "Wyclef Jean",
    totalEarnings: 45230,
    pendingPayout: 3420,
    completedVideos: 342,
    avgPrice: 150,
    commission: 20,
    lastPayout: "2024-03-01",
    trend: "up"
  },
  {
    id: "creator-2",
    name: "Ti Jo Zenny",
    totalEarnings: 38940,
    pendingPayout: 2100,
    completedVideos: 486,
    avgPrice: 85,
    commission: 20,
    lastPayout: "2024-03-05",
    trend: "up"
  },
  {
    id: "creator-3",
    name: "Marie-Claire Dubois",
    totalEarnings: 32100,
    pendingPayout: 1850,
    completedVideos: 267,
    avgPrice: 125,
    commission: 20,
    lastPayout: "2024-03-03",
    trend: "stable"
  },
  {
    id: "creator-4",
    name: "Jean Baptiste",
    totalEarnings: 28750,
    pendingPayout: 2200,
    completedVideos: 412,
    avgPrice: 75,
    commission: 20,
    lastPayout: "2024-03-02",
    trend: "down"
  }
]

const transactionSummary: TransactionSummary[] = [
  {
    type: "Personal Messages",
    count: 1834,
    volume: 82530,
    fees: 2476,
    netAmount: 80054,
    percentOfTotal: 45
  },
  {
    type: "Business Messages",
    count: 423,
    volume: 31725,
    fees: 952,
    netAmount: 30773,
    percentOfTotal: 20
  },
  {
    type: "Event Greetings",
    count: 892,
    volume: 44600,
    fees: 1338,
    netAmount: 43262,
    percentOfTotal: 25
  },
  {
    type: "Special Occasions",
    count: 234,
    volume: 17550,
    fees: 527,
    netAmount: 17023,
    percentOfTotal: 10
  }
]

const expenseCategories: ExpenseCategory[] = [
  {
    category: "Payment Processing",
    amount: 3766,
    percentOfRevenue: 3,
    trend: "stable",
    budget: 4000,
    variance: -234
  },
  {
    category: "Infrastructure & Hosting",
    amount: 8900,
    percentOfRevenue: 7.1,
    trend: "up",
    budget: 8500,
    variance: 400
  },
  {
    category: "Marketing & Acquisition",
    amount: 15000,
    percentOfRevenue: 12,
    trend: "up",
    budget: 15000,
    variance: 0
  },
  {
    category: "Operations & Support",
    amount: 12500,
    percentOfRevenue: 10,
    trend: "stable",
    budget: 13000,
    variance: -500
  },
  {
    category: "Product Development",
    amount: 18000,
    percentOfRevenue: 14.3,
    trend: "up",
    budget: 17000,
    variance: 1000
  }
]

export function FinancialReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReport, setSelectedReport] = useState("revenue")

  const currentMonthRevenue = revenueData[revenueData.length - 1]
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)
  const totalTransactions = revenueData.reduce((sum, d) => sum + d.transactions, 0)
  const totalCommission = revenueData.reduce((sum, d) => sum + d.commission, 0)
  const totalExpenses = expenseCategories.reduce((sum, e) => sum + e.amount, 0)
  const netProfit = currentMonthRevenue.netRevenue - totalExpenses

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down": return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-red-600"
    if (variance < 0) return "text-green-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Reports</h2>
          <p className="text-gray-600">Revenue analytics and financial performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${currentMonthRevenue.revenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+{currentMonthRevenue.growth}%</span>
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
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold">{currentMonthRevenue.transactions.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold">${currentMonthRevenue.avgOrderValue}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+1.1%</span>
                </div>
              </div>
              <Receipt className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <Calculator className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold">${netProfit.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8.7%</span>
                </div>
              </div>
              <PiggyBank className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="creators">Creator Earnings</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="pnl">P&L Statement</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue performance and growth</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead className="text-right">AOV</TableHead>
                    <TableHead className="text-right">Growth</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="text-right">Net Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueData.map((data) => (
                    <TableRow key={data.period}>
                      <TableCell>{data.period}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${data.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{data.transactions.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${data.avgOrderValue}</TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end gap-1">
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">{data.growth}%</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right">${data.commission.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${data.netRevenue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume by Type</CardTitle>
              <CardDescription>Breakdown of transactions and associated fees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactionSummary.map((transaction) => (
                  <div key={transaction.type} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{transaction.type}</h4>
                        <p className="text-sm text-gray-600">
                          {transaction.count.toLocaleString()} transactions
                        </p>
                      </div>
                      <Badge variant="outline">{transaction.percentOfTotal}%</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Volume</p>
                        <p className="font-medium">${transaction.volume.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Processing Fees</p>
                        <p className="font-medium">${transaction.fees.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Net Amount</p>
                        <p className="font-medium">${transaction.netAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <Progress value={transaction.percentOfTotal} className="h-2 mt-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Creator Earnings</CardTitle>
              <CardDescription>Creator revenue and payout information</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creator</TableHead>
                    <TableHead className="text-right">Total Earnings</TableHead>
                    <TableHead className="text-right">Pending Payout</TableHead>
                    <TableHead className="text-right">Videos</TableHead>
                    <TableHead className="text-right">Avg Price</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead>Last Payout</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCreatorEarnings.map((creator) => (
                    <TableRow key={creator.id}>
                      <TableCell className="font-medium">{creator.name}</TableCell>
                      <TableCell className="text-right">
                        ${creator.totalEarnings.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ${creator.pendingPayout.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{creator.completedVideos}</TableCell>
                      <TableCell className="text-right">${creator.avgPrice}</TableCell>
                      <TableCell className="text-right">{creator.commission}%</TableCell>
                      <TableCell>{new Date(creator.lastPayout).toLocaleDateString()}</TableCell>
                      <TableCell>{getTrendIcon(creator.trend)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Operating expenses and budget variance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseCategories.map((expense) => (
                  <div key={expense.category} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{expense.category}</h4>
                        {getTrendIcon(expense.trend)}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${expense.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{expense.percentOfRevenue}% of revenue</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Budget: ${expense.budget.toLocaleString()}</span>
                      <span className={cn("font-medium", getVarianceColor(expense.variance))}>
                        Variance: ${Math.abs(expense.variance).toLocaleString()} 
                        {expense.variance > 0 ? " over" : expense.variance < 0 ? " under" : ""}
                      </span>
                    </div>
                    <Progress 
                      value={(expense.amount / expense.budget) * 100} 
                      className="h-2 mt-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pnl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Statement</CardTitle>
              <CardDescription>March 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-3">Revenue</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Gross Revenue</span>
                      <span className="font-medium">${currentMonthRevenue.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Less: Platform Commission (20%)</span>
                      <span>-${currentMonthRevenue.commission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Net Revenue</span>
                      <span>${currentMonthRevenue.netRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-medium mb-3">Operating Expenses</h4>
                  <div className="space-y-2">
                    {expenseCategories.map((expense) => (
                      <div key={expense.category} className="flex justify-between text-sm">
                        <span>{expense.category}</span>
                        <span>-${expense.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total Operating Expenses</span>
                      <span>-${totalExpenses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Net Profit</span>
                    <span className="text-green-600">${netProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Profit Margin</span>
                    <span>{((netProfit / currentMonthRevenue.revenue) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}