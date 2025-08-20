"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  Timer,
  Download,
  Filter,
  ChevronRight,
  Trophy,
  Target,
  Activity,
  Zap,
  Wallet,
  PiggyBank,
  Receipt,
  Users,
  Star,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Info,
  ExternalLink,
  Sparkles,
  Banknote
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface Transaction {
  id: string
  type: string
  amount: number
  customer: string
  date: string
  status: "completed" | "pending" | "on-hold"
  fee: number
  net: number
}

interface BalanceStatus {
  available: number
  pending: number
  onHold: number
  thisMonth: number
  lastPayout: string
  nextPayout: string
}

export function EarningsDashboardDesign() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly")
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  // Mock balance data
  const balanceStatus: BalanceStatus = {
    available: 3456.78,
    pending: 892.34,
    onHold: 125.00,
    thisMonth: 4349.12,
    lastPayout: "Dec 15, 2024",
    nextPayout: "In 2 days"
  }

  // Mock secondary metrics
  const secondaryMetrics = {
    todayEarnings: 234.56,
    weeklyAverage: 789.00,
    bestDayEver: 1234.56,
    bestDayDate: "Dec 10, 2024",
    totalCustomers: 127,
    averageOrder: 45.67
  }

  // Mock transactions
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "Birthday Video",
      amount: 75.00,
      customer: "Marie Joseph",
      date: "Today, 2:30 PM",
      status: "completed",
      fee: 7.50,
      net: 67.50
    },
    {
      id: "2",
      type: "Business Shoutout",
      amount: 150.00,
      customer: "Jean Baptiste",
      date: "Today, 10:15 AM",
      status: "pending",
      fee: 15.00,
      net: 135.00
    },
    {
      id: "3",
      type: "Wedding Message",
      amount: 200.00,
      customer: "Sophia Laurent",
      date: "Yesterday, 8:45 PM",
      status: "completed",
      fee: 20.00,
      net: 180.00
    },
    {
      id: "4",
      type: "Graduation",
      amount: 100.00,
      customer: "Pierre Michel",
      date: "Yesterday, 3:20 PM",
      status: "on-hold",
      fee: 10.00,
      net: 90.00
    }
  ]

  // Mock daily earnings data
  const dailyEarnings = [
    { hour: "12am", earnings: 0 },
    { hour: "6am", earnings: 45 },
    { hour: "9am", earnings: 125 },
    { hour: "12pm", earnings: 280 },
    { hour: "3pm", earnings: 450 },
    { hour: "6pm", earnings: 580 },
    { hour: "9pm", earnings: 320 },
    { hour: "11pm", earnings: 150 }
  ]

  // Mock weekly earnings data
  const weeklyEarnings = [
    { day: "Mon", earnings: 456, lastWeek: 380 },
    { day: "Tue", earnings: 589, lastWeek: 420 },
    { day: "Wed", earnings: 723, lastWeek: 550 },
    { day: "Thu", earnings: 892, lastWeek: 680 },
    { day: "Fri", earnings: 1234, lastWeek: 890 },
    { day: "Sat", earnings: 1456, lastWeek: 1100 },
    { day: "Sun", earnings: 967, lastWeek: 780 }
  ]

  // Mock monthly earnings data
  const monthlyEarnings = [
    { date: "Dec 1", earnings: 456, cumulative: 456 },
    { date: "Dec 5", earnings: 789, cumulative: 1245 },
    { date: "Dec 10", earnings: 1234, cumulative: 2479 },
    { date: "Dec 15", earnings: 892, cumulative: 3371 },
    { date: "Dec 20", earnings: 567, cumulative: 3938 },
    { date: "Dec 25", earnings: 411, cumulative: 4349 }
  ]

  // Mock yearly earnings data
  const yearlyEarnings = [
    { month: "Jan", earnings: 3200, tax: 320 },
    { month: "Feb", earnings: 3800, tax: 380 },
    { month: "Mar", earnings: 4200, tax: 420 },
    { month: "Apr", earnings: 3900, tax: 390 },
    { month: "May", earnings: 4500, tax: 450 },
    { month: "Jun", earnings: 5200, tax: 520 },
    { month: "Jul", earnings: 5800, tax: 580 },
    { month: "Aug", earnings: 6200, tax: 620 },
    { month: "Sep", earnings: 5500, tax: 550 },
    { month: "Oct", earnings: 4800, tax: 480 },
    { month: "Nov", earnings: 4200, tax: 420 },
    { month: "Dec", earnings: 4349, tax: 435 }
  ]

  // Service category breakdown
  const categoryBreakdown = [
    { name: "Birthday", value: 35, color: "#9333ea" },
    { name: "Business", value: 25, color: "#3b82f6" },
    { name: "Wedding", value: 20, color: "#ec4899" },
    { name: "Graduation", value: 15, color: "#10b981" },
    { name: "Other", value: 5, color: "#6b7280" }
  ]

  const totalBalance = balanceStatus.available + balanceStatus.pending + balanceStatus.onHold

  return (
    <div className="p-6 space-y-6">
      {/* Primary Display - Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Available Balance */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm opacity-90">Available Balance</span>
              <Badge variant="secondary" className="bg-green-500 text-white border-0">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Ready
              </Badge>
            </div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold mb-4"
            >
              ${balanceStatus.available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </motion.div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-sm opacity-75 mb-1">
                  <Timer className="w-4 h-4" />
                  Pending Clearance
                </div>
                <p className="text-2xl font-semibold">
                  ${balanceStatus.pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm opacity-75 mb-1">
                  <Calendar className="w-4 h-4" />
                  This Month Total
                </div>
                <p className="text-2xl font-semibold">
                  ${balanceStatus.thisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => setShowWithdrawModal(true)}
            >
              <Banknote className="w-5 h-5 mr-2" />
              Withdraw Now
            </Button>
          </div>

          {/* Balance Breakdown Visual */}
          <div className="flex flex-col justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <h3 className="font-semibold mb-3">Balance Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Available</span>
                    <span>${balanceStatus.available.toFixed(2)}</span>
                  </div>
                  <Progress value={75} className="h-2 bg-white/30" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pending</span>
                    <span>${balanceStatus.pending.toFixed(2)}</span>
                  </div>
                  <Progress value={20} className="h-2 bg-white/30" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>On Hold</span>
                    <span>${balanceStatus.onHold.toFixed(2)}</span>
                  </div>
                  <Progress value={5} className="h-2 bg-white/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <Badge variant="outline" className="text-xs">Today</Badge>
            </div>
            <p className="text-2xl font-bold">${secondaryMetrics.todayEarnings.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Today's Earnings</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>+23% vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <Badge variant="outline" className="text-xs">Week</Badge>
            </div>
            <p className="text-2xl font-bold">${secondaryMetrics.weeklyAverage.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Weekly Average</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
              <Activity className="w-3 h-3" />
              <span>Steady growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="w-4 h-4 text-yellow-600" />
              </div>
              <Badge variant="outline" className="text-xs">Record</Badge>
            </div>
            <p className="text-2xl font-bold">${secondaryMetrics.bestDayEver.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Best Day Ever</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
              <Calendar className="w-3 h-3" />
              <span>{secondaryMetrics.bestDayDate}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <Badge variant="outline" className="text-xs">Payout</Badge>
            </div>
            <p className="text-2xl font-bold">{balanceStatus.nextPayout}</p>
            <p className="text-xs text-gray-500 mt-1">Next Payout</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-purple-600">
              <CheckCircle2 className="w-3 h-3" />
              <span>Auto-deposit</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Earnings Overview</CardTitle>
                <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {selectedTimeframe === "daily" && (
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Bar dataKey="earnings" fill="#9333ea" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-900">
                      <strong>Peak Hours:</strong> 3pm-6pm with highest earnings at 6pm ($580)
                    </p>
                  </div>
                </div>
              )}

              {selectedTimeframe === "weekly" && (
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="earnings" stroke="#9333ea" strokeWidth={2} name="This Week" />
                      <Line type="monotone" dataKey="lastWeek" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" name="Last Week" />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Weekly Pattern:</strong> Weekends show 45% higher earnings
                    </p>
                  </div>
                </div>
              )}

              {selectedTimeframe === "monthly" && (
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Area type="monotone" dataKey="cumulative" stroke="#9333ea" fill="#9333ea" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-900">
                        <strong>Month Goal:</strong> $5,000
                      </p>
                      <Progress value={87} className="mt-2" />
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-900">
                        <strong>Days Left:</strong> 6 days to reach goal
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedTimeframe === "yearly" && (
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={yearlyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Bar dataKey="earnings" fill="#9333ea" />
                      <Bar dataKey="tax" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-900">
                      <strong>Tax Preparation:</strong> Estimated tax: $5,565 (Set aside monthly)
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.status === "completed" ? "bg-green-100" :
                        transaction.status === "pending" ? "bg-yellow-100" : "bg-red-100"
                      }`}>
                        <DollarSign className={`w-5 h-5 ${
                          transaction.status === "completed" ? "text-green-600" :
                          transaction.status === "pending" ? "text-yellow-600" : "text-red-600"
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-sm text-gray-500">{transaction.customer} • {transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${transaction.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Fee: ${transaction.fee.toFixed(2)} | Net: ${transaction.net.toFixed(2)}</p>
                      <Badge variant={
                        transaction.status === "completed" ? "default" :
                        transaction.status === "pending" ? "secondary" : "destructive"
                      } className="mt-1">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-6">
          {/* Balance Status Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Balance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Available */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Available</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Instant
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-green-700">${balanceStatus.available.toFixed(2)}</p>
                  <p className="text-xs text-green-600 mt-1">Ready for withdrawal</p>
                </div>

                {/* Pending */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Pending</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                      2-3 days
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-yellow-700">${balanceStatus.pending.toFixed(2)}</p>
                  <p className="text-xs text-yellow-600 mt-1">In clearance period</p>
                </div>

                {/* On Hold */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium">On Hold</span>
                    </div>
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                      Review
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-red-700">${balanceStatus.onHold.toFixed(2)}</p>
                  <p className="text-xs text-red-600 mt-1">Under dispute/review</p>
                  <Button variant="link" className="p-0 h-auto text-xs text-red-600 mt-2">
                    View details <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryBreakdown.map((category) => (
                  <div key={category.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="font-medium">{category.value}%</span>
                  </div>
                ))}
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
                  <Receipt className="w-4 h-4 mr-2" />
                  View All Transactions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="w-4 h-4 mr-2" />
                  Fee Breakdown
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Customer Sources
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Statement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}