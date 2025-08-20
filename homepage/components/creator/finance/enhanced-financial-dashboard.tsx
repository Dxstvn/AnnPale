"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Banknote,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Shield,
  Lock,
  CheckCircle2,
  AlertCircle,
  Info,
  Download,
  FileText,
  Calculator,
  Target,
  PiggyBank,
  Receipt,
  Calendar,
  Timer,
  Zap,
  RefreshCw,
  Activity,
  BarChart3,
  PieChart,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
  Minus,
  Settings,
  HelpCircle,
  Award,
  Star,
  Gift,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Coins,
  HandCoins,
  TrendingUp as TrendIcon,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Types
interface FinancialData {
  availableBalance: number
  pendingClearance: number
  processingAmount: number
  thisMonthTotal: number
  lastMonthTotal: number
  thisYearTotal: number
  lifetimeEarnings: number
  nextPayoutDate: string
  lastPayoutAmount: number
  averageMonthly: number
  projectedMonthly: number
  taxEstimate: number
  netIncome: number
}

interface Transaction {
  id: string
  type: "earning" | "payout" | "refund" | "fee" | "adjustment"
  amount: number
  description: string
  customer?: string
  status: "completed" | "pending" | "processing" | "failed"
  date: string
  fee?: number
  tax?: number
  category?: string
  paymentMethod?: string
  reference?: string
}

interface PayoutMethod {
  id: string
  type: "bank" | "paypal" | "card" | "crypto"
  name: string
  last4?: string
  isDefault: boolean
  isVerified: boolean
  minPayout: number
  fee: number | string
  processingTime: string
  icon: React.ElementType
}

interface FinancialGoal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
  category: string
  priority: "high" | "medium" | "low"
}

interface TaxDocument {
  id: string
  year: number
  type: string
  status: "ready" | "pending" | "processing"
  downloadUrl?: string
}

interface EnhancedFinancialDashboardProps {
  financialData?: FinancialData
  transactions?: Transaction[]
  payoutMethods?: PayoutMethod[]
  goals?: FinancialGoal[]
  taxDocuments?: TaxDocument[]
  onWithdraw?: (amount: number, method: string) => void
  onExport?: (format: string) => void
  onUpdateGoal?: (goalId: string, data: any) => void
  className?: string
}

// Mock data generator
const generateMockTransactions = (count: number): Transaction[] => {
  const types: Transaction["type"][] = ["earning", "payout", "fee", "refund", "adjustment"]
  const statuses: Transaction["status"][] = ["completed", "pending", "processing"]
  const categories = ["Birthday", "Anniversary", "Motivation", "Custom", "Holiday"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `trans-${i}`,
    type: types[Math.floor(Math.random() * types.length)],
    amount: Math.floor(Math.random() * 200) + 20,
    description: `Transaction ${i + 1}`,
    customer: i % 3 === 0 ? `Customer ${i}` : undefined,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
    fee: Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 1 : undefined,
    category: categories[Math.floor(Math.random() * categories.length)],
    reference: `REF-${Date.now()}-${i}`
  }))
}

// Earnings card with visual hierarchy
const EarningsCard = ({ 
  title, 
  amount, 
  subtitle, 
  change, 
  trend, 
  level, 
  updateFrequency,
  icon: Icon,
  showDetails = false,
  onToggleDetails
}: {
  title: string
  amount: number
  subtitle?: string
  change?: number
  trend?: "up" | "down" | "stable"
  level: "primary" | "secondary" | "tertiary"
  updateFrequency?: string
  icon?: React.ElementType
  showDetails?: boolean
  onToggleDetails?: () => void
}) => {
  const levelStyles = {
    primary: "text-4xl font-bold",
    secondary: "text-2xl font-semibold text-gray-700 dark:text-gray-300",
    tertiary: "text-lg font-medium text-gray-500 dark:text-gray-400"
  }
  
  const cardStyles = {
    primary: "bg-gradient-to-br from-purple-600 to-pink-600 text-white",
    secondary: "bg-gray-100 dark:bg-gray-800",
    tertiary: "bg-gray-50 dark:bg-gray-900"
  }
  
  return (
    <Card className={cn("relative overflow-hidden", cardStyles[level])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className={cn(
              "text-sm mb-1",
              level === "primary" ? "text-white/80" : "text-gray-600 dark:text-gray-400"
            )}>
              {title}
            </p>
            <div className={cn("flex items-baseline gap-2", levelStyles[level])}>
              <span>${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              {change !== undefined && (
                <span className={cn(
                  "text-sm font-normal",
                  trend === "up" ? "text-green-500" : 
                  trend === "down" ? "text-red-500" : 
                  "text-gray-500"
                )}>
                  {trend === "up" ? <ArrowUp className="inline h-3 w-3" /> : 
                   trend === "down" ? <ArrowDown className="inline h-3 w-3" /> : null}
                  {Math.abs(change)}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className={cn(
                "text-sm mt-1",
                level === "primary" ? "text-white/60" : "text-gray-500"
              )}>
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn(
              "p-3 rounded-lg",
              level === "primary" ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"
            )}>
              <Icon className={cn(
                "h-6 w-6",
                level === "primary" ? "text-white" : "text-gray-600 dark:text-gray-400"
              )} />
            </div>
          )}
        </div>
        
        {updateFrequency && (
          <div className="flex items-center justify-between">
            <Badge variant={level === "primary" ? "secondary" : "outline"} className="text-xs">
              {updateFrequency}
            </Badge>
            {onToggleDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleDetails}
                className={level === "primary" ? "text-white hover:bg-white/20" : ""}
              >
                {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Payout option card
const PayoutOptionCard = ({
  title,
  fee,
  minAmount,
  processingTime,
  methods,
  icon: Icon,
  recommended = false,
  onSelect
}: {
  title: string
  fee: string
  minAmount: number
  processingTime: string
  methods: string[]
  icon: React.ElementType
  recommended?: boolean
  onSelect: () => void
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={cn(
          "relative cursor-pointer transition-all",
          recommended && "ring-2 ring-purple-600"
        )}
        onClick={onSelect}
      >
        {recommended && (
          <Badge className="absolute -top-2 -right-2 bg-purple-600">
            Recommended
          </Badge>
        )}
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-3 rounded-lg",
              recommended ? "bg-purple-100 dark:bg-purple-900/30" : "bg-gray-100 dark:bg-gray-800"
            )}>
              <Icon className={cn(
                "h-6 w-6",
                recommended ? "text-purple-600" : "text-gray-600 dark:text-gray-400"
              )} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{title}</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Timer className="h-3 w-3" />
                  <span>{processingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3" />
                  <span>Fee: {fee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-3 w-3" />
                  <span>Min: ${minAmount}</span>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex flex-wrap gap-2">
                {methods.map((method, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {method}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Transaction row component
const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  const typeIcons = {
    earning: DollarSign,
    payout: ArrowUp,
    refund: RefreshCw,
    fee: Receipt,
    adjustment: Settings
  }
  
  const statusColors = {
    completed: "text-green-600",
    pending: "text-yellow-600",
    processing: "text-blue-600",
    failed: "text-red-600"
  }
  
  const TypeIcon = typeIcons[transaction.type]
  
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-2 rounded-lg",
          transaction.type === "earning" ? "bg-green-100 dark:bg-green-900/30" :
          transaction.type === "payout" ? "bg-blue-100 dark:bg-blue-900/30" :
          "bg-gray-100 dark:bg-gray-800"
        )}>
          <TypeIcon className={cn(
            "h-5 w-5",
            transaction.type === "earning" ? "text-green-600" :
            transaction.type === "payout" ? "text-blue-600" :
            "text-gray-600"
          )} />
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {transaction.customer && <span>{transaction.customer}</span>}
            <span>•</span>
            <span>{transaction.date}</span>
            {transaction.reference && (
              <>
                <span>•</span>
                <span className="text-xs">{transaction.reference}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <p className={cn(
          "font-semibold text-lg",
          transaction.type === "earning" ? "text-green-600" :
          transaction.type === "payout" || transaction.type === "fee" ? "text-red-600" :
          "text-gray-900 dark:text-gray-100"
        )}>
          {transaction.type === "payout" || transaction.type === "fee" ? "-" : "+"}
          ${transaction.amount.toFixed(2)}
        </p>
        {transaction.fee && (
          <p className="text-xs text-gray-500">Fee: ${transaction.fee.toFixed(2)}</p>
        )}
        <Badge className={cn("text-xs", statusColors[transaction.status])}>
          {transaction.status}
        </Badge>
      </div>
    </div>
  )
}

// Main component
export function EnhancedFinancialDashboard({
  financialData = {
    availableBalance: 2847.50,
    pendingClearance: 523.25,
    processingAmount: 150.00,
    thisMonthTotal: 4250.75,
    lastMonthTotal: 3890.50,
    thisYearTotal: 42500.00,
    lifetimeEarnings: 125000.00,
    nextPayoutDate: "Friday, Jan 19",
    lastPayoutAmount: 1250.00,
    averageMonthly: 3500.00,
    projectedMonthly: 4500.00,
    taxEstimate: 850.00,
    netIncome: 3400.00
  },
  transactions = generateMockTransactions(10),
  payoutMethods = [
    {
      id: "1",
      type: "bank",
      name: "Chase ****1234",
      last4: "1234",
      isDefault: true,
      isVerified: true,
      minPayout: 50,
      fee: "Free",
      processingTime: "2-3 business days",
      icon: Banknote
    },
    {
      id: "2",
      type: "card",
      name: "Debit Card ****5678",
      last4: "5678",
      isDefault: false,
      isVerified: true,
      minPayout: 10,
      fee: "2.5%",
      processingTime: "0-30 minutes",
      icon: CreditCard
    }
  ],
  goals = [
    {
      id: "1",
      name: "Monthly Target",
      target: 5000,
      current: 4250.75,
      deadline: "Jan 31, 2025",
      category: "revenue",
      priority: "high" as const
    },
    {
      id: "2",
      name: "Emergency Fund",
      target: 10000,
      current: 7500,
      deadline: "Mar 31, 2025",
      category: "savings",
      priority: "medium" as const
    }
  ],
  taxDocuments = [
    {
      id: "1",
      year: 2024,
      type: "1099-K",
      status: "ready" as const,
      downloadUrl: "#"
    }
  ],
  onWithdraw,
  onExport,
  onUpdateGoal,
  className
}: EnhancedFinancialDashboardProps) {
  const [showBalanceDetails, setShowBalanceDetails] = React.useState(false)
  const [selectedPayout, setSelectedPayout] = React.useState<string>("standard")
  const [withdrawAmount, setWithdrawAmount] = React.useState("")
  const [selectedTimeRange, setSelectedTimeRange] = React.useState("month")
  const [activeTab, setActiveTab] = React.useState("overview")
  
  // Calculate percentage changes
  const monthlyChange = ((financialData.thisMonthTotal - financialData.lastMonthTotal) / financialData.lastMonthTotal * 100).toFixed(1)
  const projectionChange = ((financialData.projectedMonthly - financialData.averageMonthly) / financialData.averageMonthly * 100).toFixed(1)
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track earnings, manage payouts, and plan your finances
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={() => onExport?.("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Tax Docs
          </Button>
        </div>
      </div>
      
      {/* Trust Signals Bar */}
      <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-900 dark:text-green-100">
            Your earnings are secure and protected
          </p>
          <p className="text-xs text-green-700 dark:text-green-300">
            Bank-level encryption • FDIC insured • PCI compliant
          </p>
        </div>
        <Badge className="bg-green-600 text-white">
          <Lock className="h-3 w-3 mr-1" />
          Secured
        </Badge>
      </div>
      
      {/* Earnings Hierarchy */}
      <div className="grid md:grid-cols-3 gap-4">
        <EarningsCard
          title="Available Balance"
          amount={financialData.availableBalance}
          subtitle="Ready to withdraw"
          change={12.5}
          trend="up"
          level="primary"
          updateFrequency="Real-time"
          icon={Wallet}
          showDetails={showBalanceDetails}
          onToggleDetails={() => setShowBalanceDetails(!showBalanceDetails)}
        />
        
        <EarningsCard
          title="Pending Clearance"
          amount={financialData.pendingClearance}
          subtitle={`Clears by ${financialData.nextPayoutDate}`}
          level="secondary"
          updateFrequency="Hourly"
          icon={Clock}
        />
        
        <EarningsCard
          title="This Month Total"
          amount={financialData.thisMonthTotal}
          subtitle={`${parseFloat(monthlyChange) > 0 ? '+' : ''}${monthlyChange}% vs last month`}
          change={parseFloat(monthlyChange)}
          trend={parseFloat(monthlyChange) > 0 ? "up" : "down"}
          level="tertiary"
          updateFrequency="Daily"
          icon={Calendar}
        />
      </div>
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Lifetime Earnings</span>
                    <span className="font-semibold">${financialData.lifetimeEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">This Year</span>
                    <span className="font-semibold">${financialData.thisYearTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Average</span>
                    <span className="font-semibold">${financialData.averageMonthly.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Projected This Month</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${financialData.projectedMonthly.toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs">
                        +{projectionChange}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated Tax</span>
                    <span className="text-red-600">-${financialData.taxEstimate.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Net Income</span>
                    <span className="font-bold text-lg text-green-600">
                      ${financialData.netIncome.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calculator className="h-4 w-4 mr-2" />
                  Tax Calculator
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Set Financial Goal
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Statement
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Payout Settings
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Transactions Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTab("transactions")}
                >
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transactions.slice(0, 5).map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="earnings">Earnings</SelectItem>
                      <SelectItem value="payouts">Payouts</SelectItem>
                      <SelectItem value="fees">Fees</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <PayoutOptionCard
              title="Instant Payout"
              fee="2.5%"
              minAmount={10}
              processingTime="0-30 minutes"
              methods={["Debit Card", "Digital Wallet"]}
              icon={Zap}
              onSelect={() => setSelectedPayout("instant")}
            />
            
            <PayoutOptionCard
              title="Standard Payout"
              fee="Free"
              minAmount={50}
              processingTime="2-3 business days"
              methods={["Bank Transfer", "ACH"]}
              icon={Banknote}
              recommended
              onSelect={() => setSelectedPayout("standard")}
            />
            
            <PayoutOptionCard
              title="Weekly Auto"
              fee="Free"
              minAmount={100}
              processingTime="Every Friday"
              methods={["Bank", "PayPal"]}
              icon={RefreshCw}
              onSelect={() => setSelectedPayout("weekly")}
            />
          </div>
          
          {/* Payout Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Request Payout</CardTitle>
              <CardDescription>
                Choose your payout method and amount
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Amount</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg"
                      placeholder="0.00"
                      max={financialData.availableBalance}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setWithdrawAmount(financialData.availableBalance.toString())}
                  >
                    Max
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Available: ${financialData.availableBalance.toFixed(2)}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Payout Method</label>
                <Select value={selectedPayout} onValueChange={setSelectedPayout}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant (2.5% fee)</SelectItem>
                    <SelectItem value="standard">Standard (Free)</SelectItem>
                    <SelectItem value="weekly">Weekly Auto (Free)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {selectedPayout === "instant" 
                    ? `Processing fee: $${(parseFloat(withdrawAmount || "0") * 0.025).toFixed(2)}. You'll receive: $${(parseFloat(withdrawAmount || "0") * 0.975).toFixed(2)}`
                    : selectedPayout === "standard"
                    ? "No fees. Funds will arrive in 2-3 business days."
                    : "Set up automatic weekly payouts every Friday."}
                </AlertDescription>
              </Alert>
              
              <Button 
                className="w-full" 
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                onClick={() => onWithdraw?.(parseFloat(withdrawAmount), selectedPayout)}
              >
                Request Payout
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Planning Tab */}
        <TabsContent value="planning" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Financial Goals */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Financial Goals</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Goal
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{goal.name}</p>
                        <p className="text-xs text-gray-500">Due: {goal.deadline}</p>
                      </div>
                      <Badge variant={
                        goal.priority === "high" ? "destructive" :
                        goal.priority === "medium" ? "default" :
                        "secondary"
                      }>
                        {goal.priority}
                      </Badge>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} />
                    <div className="flex items-center justify-between text-sm">
                      <span>${goal.current.toLocaleString()}</span>
                      <span className="text-gray-500">${goal.target.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Tax Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Estimator</CardTitle>
                <CardDescription>
                  Estimate your quarterly tax payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gross Income</span>
                    <span className="font-medium">${financialData.thisYearTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Business Expenses</span>
                    <span className="font-medium">-$5,000</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxable Income</span>
                    <span className="font-medium">${(financialData.thisYearTotal - 5000).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estimated Tax (25%)</span>
                    <span className="font-medium text-red-600">
                      ${((financialData.thisYearTotal - 5000) * 0.25).toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Quarterly Payment</span>
                    <span className="font-bold text-lg">
                      ${(((financialData.thisYearTotal - 5000) * 0.25) / 4).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This is an estimate. Consult a tax professional for accurate calculations.
                  </AlertDescription>
                </Alert>
                
                <Button variant="outline" className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Detailed Calculator
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Tax Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Documents</CardTitle>
              <CardDescription>
                Download your tax forms and statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {taxDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{doc.type} - {doc.year}</p>
                        <p className="text-xs text-gray-500">Tax Year {doc.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={doc.status === "ready" ? "default" : "secondary"}>
                        {doc.status}
                      </Badge>
                      {doc.status === "ready" && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}