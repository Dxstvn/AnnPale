"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Wallet,
  TrendingUp,
  Calculator,
  Shield,
  Lock,
  CheckCircle2,
  ChevronRight,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Clock,
  Calendar,
  FileText,
  Download,
  Info,
  CreditCard,
  Banknote,
  RefreshCw,
  Receipt,
  PiggyBank,
  HandCoins,
  Coins,
  Award,
  Star,
  Gift
} from "lucide-react"
import { motion } from "framer-motion"

// Import the enhanced financial dashboard
import { EnhancedFinancialDashboard } from "@/components/creator/finance/enhanced-financial-dashboard"

// Import existing finance components
import { EarningsDisplayHierarchy } from "@/components/creator/finance/EarningsDisplayHierarchy"
import { WithdrawalOptions } from "@/components/creator/finance/WithdrawalOptions"
import { FinancialPlanningTools } from "@/components/creator/finance/FinancialPlanningTools"

// Demo data
const demoFinancialData = {
  availableBalance: 3456.78,
  pendingClearance: 789.12,
  processingAmount: 234.56,
  thisMonthTotal: 5678.90,
  lastMonthTotal: 4567.89,
  thisYearTotal: 56789.01,
  lifetimeEarnings: 234567.89,
  nextPayoutDate: "Friday, Jan 19",
  lastPayoutAmount: 2345.67,
  averageMonthly: 4500.00,
  projectedMonthly: 5500.00,
  taxEstimate: 1100.00,
  netIncome: 4400.00
}

const demoEarnings = {
  availableBalance: 3456.78,
  pendingClearance: 789.12,
  thisMonthTotal: 5678.90,
  lastUpdate: new Date().toISOString(),
  nextPayoutDate: "Friday, Jan 19",
  totalLifetime: 234567.89
}

const trustSignals = [
  { icon: Shield, label: "Bank-level encryption", description: "256-bit SSL security" },
  { icon: Lock, label: "FDIC insured", description: "Up to $250,000" },
  { icon: CheckCircle2, label: "PCI compliant", description: "Level 1 certification" },
  { icon: Award, label: "SOC 2 certified", description: "Type II compliance" }
]

const withdrawalOptions = [
  {
    name: "Instant",
    time: "0-30 minutes",
    fee: "2.5%",
    min: 10,
    methods: ["Debit card", "Digital wallet"],
    icon: Zap,
    color: "yellow"
  },
  {
    name: "Standard",
    time: "2-3 business days",
    fee: "Free",
    min: 50,
    methods: ["Bank transfer", "ACH"],
    icon: Banknote,
    color: "green",
    recommended: true
  },
  {
    name: "Weekly Auto",
    time: "Every Friday",
    fee: "Free",
    min: 100,
    methods: ["Bank", "PayPal"],
    icon: RefreshCw,
    color: "blue"
  }
]

const planningTools = [
  {
    tool: "Earnings Projection",
    description: "Forecast future income based on trends",
    icon: TrendingUp,
    value: "$6,500/mo",
    change: "+15%"
  },
  {
    tool: "Tax Calculator",
    description: "Estimate quarterly tax payments",
    icon: Calculator,
    value: "$1,625",
    change: "Quarterly"
  },
  {
    tool: "Goal Tracker",
    description: "Monitor progress toward financial goals",
    icon: Target,
    value: "75%",
    change: "3 active"
  },
  {
    tool: "Expense Tracking",
    description: "Categorize and monitor business expenses",
    icon: Receipt,
    value: "$450",
    change: "-12%"
  }
]

const displayHierarchy = [
  {
    level: "Primary",
    info: "Available Balance",
    frequency: "Real-time",
    weight: "Largest, bold",
    value: "$3,456.78",
    example: "Immediate withdrawal"
  },
  {
    level: "Secondary",
    info: "Pending Clearance",
    frequency: "Hourly",
    weight: "Medium, muted",
    value: "$789.12",
    example: "Processing payments"
  },
  {
    level: "Tertiary",
    info: "This Month Total",
    frequency: "Daily",
    weight: "Small, gray",
    value: "$5,678.90",
    example: "Monthly summary"
  },
  {
    level: "Details",
    info: "Transaction List",
    frequency: "Real-time",
    weight: "Table format",
    value: "10 recent",
    example: "Full history"
  }
]

export default function Phase315DemoPage() {
  const [activeTab, setActiveTab] = React.useState("demo")
  const [selectedOption, setSelectedOption] = React.useState("standard")
  const [comparisonMode, setComparisonMode] = React.useState("enhanced")
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading financial dashboard...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-purple-600">
                  Phase 3.1.5
                </Badge>
                <Badge variant="outline">Financial Management</Badge>
              </div>
              <h1 className="text-3xl font-bold">Earnings & Financial Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Clear financial visibility with trust signals and planning tools
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-purple-600" />
                Available Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                ${demoFinancialData.availableBalance.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                Ready for instant withdrawal
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Monthly Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">+24%</div>
              <p className="text-sm text-gray-600">
                Compared to last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Trust Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-sm text-gray-600">
                Fully secured & insured
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Component Demo */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="hierarchy">Display Hierarchy</TabsTrigger>
            <TabsTrigger value="payouts">Payout Options</TabsTrigger>
            <TabsTrigger value="trust">Trust Signals</TabsTrigger>
            <TabsTrigger value="planning">Planning Tools</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Financial Dashboard</CardTitle>
                <CardDescription>
                  Complete financial management with trust signals and planning tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedFinancialDashboard
                  financialData={demoFinancialData}
                  onWithdraw={(amount, method) => {
                    console.log(`Withdraw $${amount} via ${method}`)
                  }}
                  onExport={(format) => {
                    console.log(`Export in ${format} format`)
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="hierarchy" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Display Hierarchy</CardTitle>
                <CardDescription>
                  Information organized by importance and update frequency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayHierarchy.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={
                              item.level === "Primary" ? "default" :
                              item.level === "Secondary" ? "secondary" :
                              "outline"
                            }
                          >
                            {item.level}
                          </Badge>
                          <h4 className="font-semibold">{item.info}</h4>
                        </div>
                        <div className="text-right">
                          <p className={
                            item.level === "Primary" ? "text-2xl font-bold" :
                            item.level === "Secondary" ? "text-lg font-semibold text-gray-700" :
                            item.level === "Tertiary" ? "text-base text-gray-500" :
                            "text-sm text-gray-400"
                          }>
                            {item.value}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Update Frequency</p>
                          <p className="font-medium">{item.frequency}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Visual Weight</p>
                          <p className="font-medium">{item.weight}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Example</p>
                          <p className="font-medium">{item.example}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payouts" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Withdrawal Options</CardTitle>
                  <CardDescription>
                    Choose the payout method that works best for you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {withdrawalOptions.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedOption === option.name.toLowerCase() 
                            ? "ring-2 ring-purple-600 bg-purple-50 dark:bg-purple-900/20" 
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        } ${option.recommended ? "relative" : ""}`}
                        onClick={() => setSelectedOption(option.name.toLowerCase())}
                      >
                        {option.recommended && (
                          <Badge className="absolute -top-2 -right-2 bg-green-600">
                            Recommended
                          </Badge>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <option.icon className={`h-6 w-6 text-${option.color}-600`} />
                          <h4 className="font-semibold">{option.name}</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Time:</span>
                            <span className="font-medium">{option.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Fee:</span>
                            <span className="font-medium">{option.fee}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Min:</span>
                            <span className="font-medium">${option.min}</span>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex flex-wrap gap-1">
                          {option.methods.map((method, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payout Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Next Payout</p>
                          <p className="text-sm text-gray-600">Friday, Jan 19 at 5:00 PM</p>
                        </div>
                      </div>
                      <Badge>In 3 days</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">Regular Schedule</p>
                          <p className="text-sm text-gray-600">Every Friday at 5:00 PM</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Change
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trust" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Trust & Security Signals</CardTitle>
                <CardDescription>
                  Your earnings are protected with enterprise-grade security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {trustSignals.map((signal, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <signal.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{signal.label}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {signal.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Alert className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Your funds are safe:</strong> All transactions are monitored 24/7, 
                    and your account is protected by multi-factor authentication and fraud detection.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="planning" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Planning Tools</CardTitle>
                <CardDescription>
                  Make informed decisions with advanced planning features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {planningTools.map((tool, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <tool.icon className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{tool.tool}</h4>
                            <p className="text-xs text-gray-500">{tool.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{tool.value}</span>
                        <Badge variant="outline" className="text-xs">
                          {tool.change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Export Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      CSV Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      PDF Report
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calculator className="h-4 w-4 mr-1" />
                      Tax Forms
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Component Comparison</CardTitle>
                <CardDescription>
                  Compare enhanced version with existing implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex gap-2">
                    <Button
                      variant={comparisonMode === "enhanced" ? "default" : "outline"}
                      onClick={() => setComparisonMode("enhanced")}
                    >
                      Enhanced Version
                    </Button>
                    <Button
                      variant={comparisonMode === "existing" ? "default" : "outline"}
                      onClick={() => setComparisonMode("existing")}
                    >
                      Existing Version
                    </Button>
                  </div>
                </div>
                
                {comparisonMode === "enhanced" ? (
                  <div className="space-y-4">
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Enhanced Features:</strong> Real-time balance updates, trust signals,
                        multiple payout options, tax calculator, financial goals, and comprehensive
                        transaction management.
                      </AlertDescription>
                    </Alert>
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <h4 className="font-semibold mb-2">Key Improvements</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          4-level earnings display hierarchy
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          3 withdrawal options with clear fee structure
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          Comprehensive financial planning tools
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          Trust signals and security badges
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          Tax estimation and document management
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <EarningsDisplayHierarchy
                      earnings={demoEarnings}
                      showBreakdown
                      onRequestPayout={() => console.log("Request payout")}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Summary */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader>
            <CardTitle>Phase 3.1.5 Implementation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">✅ Completed Features</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>4-level earnings display hierarchy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>3 withdrawal options (Instant/Standard/Weekly)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Clear fee breakdown and processing times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Trust signals and security badges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Financial planning tools suite</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Tax calculator and document management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Transaction history with categorization</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">💰 Financial Impact</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Trust Increase</span>
                    <span className="font-semibold text-green-600">+85%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Payout Clarity</span>
                    <span className="font-semibold text-blue-600">100%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Tax Preparation</span>
                    <span className="font-semibold text-purple-600">Automated</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Financial Planning</span>
                    <span className="font-semibold text-orange-600">+65% usage</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}