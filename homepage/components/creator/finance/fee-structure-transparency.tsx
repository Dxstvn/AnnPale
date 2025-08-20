"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { 
  DollarSign,
  Calculator,
  TrendingDown,
  TrendingUp,
  Info,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Target,
  PiggyBank,
  Receipt,
  CreditCard,
  Building,
  Zap,
  Globe,
  AlertTriangle,
  BookOpen,
  Award,
  ArrowRight,
  ArrowDown,
  Percent,
  Coins,
  Wallet,
  BarChart3,
  PieChart as PieChartIcon,
  Sparkles,
  Shield,
  Users,
  Package,
  Clock,
  RefreshCw,
  FileText,
  ExternalLink,
  Download,
  Gift
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

interface FeeType {
  id: string
  name: string
  whenApplied: string
  rate: string
  negotiable: boolean
  waysToReduce: string[]
  description: string
  icon: React.ReactNode
}

interface Transaction {
  baseAmount: number
  platformFee: number
  processingFee: number
  rushBonus?: number
  tip?: number
  netEarnings: number
}

export function FeeStructureTransparency() {
  const [transactionAmount, setTransactionAmount] = useState(100)
  const [includeRushBonus, setIncludeRushBonus] = useState(true)
  const [includeTip, setIncludeTip] = useState(true)
  const [monthlyVolume, setMonthlyVolume] = useState(5000)
  const [expandedFee, setExpandedFee] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState("breakdown")

  // Fee types with detailed information
  const feeTypes: FeeType[] = [
    {
      id: "platform",
      name: "Platform Fee",
      whenApplied: "Every transaction",
      rate: "20%",
      negotiable: true,
      waysToReduce: ["Reach $10k monthly volume", "Annual commitment", "Exclusive partnership"],
      description: "Our platform fee covers hosting, marketing, customer support, and platform development.",
      icon: <Building className="w-5 h-5" />
    },
    {
      id: "processing",
      name: "Processing Fee",
      whenApplied: "Card payments",
      rate: "2.9% + $0.30",
      negotiable: false,
      waysToReduce: ["ACH transfers", "Batch processing", "Higher volume"],
      description: "Payment processor charges for handling secure transactions.",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: "instant",
      name: "Instant Payout",
      whenApplied: "Optional",
      rate: "1.5%",
      negotiable: false,
      waysToReduce: ["Use standard payout", "Schedule weekly payouts", "Bank transfer"],
      description: "Get your money in 30 minutes instead of 2-3 days.",
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: "international",
      name: "International",
      whenApplied: "Cross-border",
      rate: "2%",
      negotiable: false,
      waysToReduce: ["Local payment methods", "Currency accounts", "Regional pricing"],
      description: "Additional fee for international transactions and currency conversion.",
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: "chargeback",
      name: "Chargebacks",
      whenApplied: "Disputes",
      rate: "$15",
      negotiable: false,
      waysToReduce: ["Clear communication", "Detailed descriptions", "Quick delivery", "Good customer service"],
      description: "Fee charged when a customer disputes a transaction.",
      icon: <AlertTriangle className="w-5 h-5" />
    }
  ]

  // Calculate transaction fees
  const calculateFees = (amount: number): Transaction => {
    const platformFee = amount * 0.20
    const processingFee = amount * 0.029 + 0.30
    const rushBonus = includeRushBonus ? 15 : 0
    const tip = includeTip ? amount * 0.10 : 0
    const netEarnings = amount - platformFee - processingFee + rushBonus + tip

    return {
      baseAmount: amount,
      platformFee,
      processingFee,
      rushBonus,
      tip,
      netEarnings
    }
  }

  const transaction = calculateFees(transactionAmount)

  // Pie chart data
  const pieData = [
    { name: "Creator", value: transaction.netEarnings, color: "#10b981" },
    { name: "Platform", value: transaction.platformFee, color: "#9333ea" },
    { name: "Processing", value: transaction.processingFee, color: "#3b82f6" }
  ]

  // Volume discount tiers
  const volumeTiers = [
    { min: 0, max: 5000, rate: 20, label: "Standard" },
    { min: 5000, max: 10000, rate: 18, label: "Silver" },
    { min: 10000, max: 25000, rate: 15, label: "Gold" },
    { min: 25000, max: 50000, rate: 12, label: "Platinum" },
    { min: 50000, max: Infinity, rate: 10, label: "Diamond" }
  ]

  const currentTier = volumeTiers.find(tier => monthlyVolume >= tier.min && monthlyVolume < tier.max) || volumeTiers[0]
  const nextTier = volumeTiers.find(tier => tier.min > monthlyVolume) || null

  // Fee optimization strategies
  const optimizationStrategies = [
    {
      category: "Cost Reduction",
      icon: <TrendingDown className="w-5 h-5" />,
      strategies: [
        { name: "Batch withdrawals", savings: "Save $50-100/month", description: "Combine multiple withdrawals" },
        { name: "Use free methods", savings: "Save 1.5%", description: "Choose bank transfers over instant" },
        { name: "Achieve tier discounts", savings: "Save up to 10%", description: "Increase monthly volume" },
        { name: "Minimize chargebacks", savings: "Save $15/incident", description: "Clear communication" },
        { name: "Local payment methods", savings: "Save 2%", description: "Avoid international fees" }
      ]
    },
    {
      category: "Revenue Optimization",
      icon: <TrendingUp className="w-5 h-5" />,
      strategies: [
        { name: "Price for net earnings", savings: "+25% revenue", description: "Account for fees in pricing" },
        { name: "Encourage tips", savings: "+10-20%", description: "Add tip suggestions" },
        { name: "Offer packages", savings: "+30% AOV", description: "Bundle services together" },
        { name: "Premium services", savings: "+50% per order", description: "Add exclusive options" },
        { name: "Efficient operations", savings: "Save 2-3 hours/week", description: "Streamline workflow" }
      ]
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Fee Structure & Transparency</h2>
          <p className="text-gray-500">Understand exactly how fees work and how to optimize your earnings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            No Hidden Fees
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Fee Guide
          </Button>
        </div>
      </div>

      {/* Interactive Fee Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Interactive Fee Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Side */}
            <div className="space-y-4">
              <div>
                <Label>Transaction Amount</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold">$</span>
                  <Input
                    type="number"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(parseFloat(e.target.value) || 0)}
                    className="text-2xl font-bold"
                  />
                </div>
                <Slider
                  value={[transactionAmount]}
                  onValueChange={([value]) => setTransactionAmount(value)}
                  max={500}
                  min={10}
                  step={10}
                  className="mt-3"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rush"
                      checked={includeRushBonus}
                      onChange={(e) => setIncludeRushBonus(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="rush" className="cursor-pointer">
                      <span className="font-medium">Rush Delivery Bonus</span>
                      <span className="text-sm text-gray-500 block">+$15 for 24hr delivery</span>
                    </label>
                  </div>
                  <Badge variant="outline" className="bg-green-50">+$15</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="tip"
                      checked={includeTip}
                      onChange={(e) => setIncludeTip(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="tip" className="cursor-pointer">
                      <span className="font-medium">Customer Tip</span>
                      <span className="text-sm text-gray-500 block">10% average tip</span>
                    </label>
                  </div>
                  <Badge variant="outline" className="bg-green-50">+${(transactionAmount * 0.10).toFixed(2)}</Badge>
                </div>
              </div>
            </div>

            {/* Breakdown Side */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Transaction Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Amount</span>
                    <span className="font-semibold">${transaction.baseAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-600">
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      Platform Fee (20%)
                    </span>
                    <span className="font-semibold">-${transaction.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-600">
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      Processing Fee
                    </span>
                    <span className="font-semibold">-${transaction.processingFee.toFixed(2)}</span>
                  </div>
                  {includeRushBonus && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        Rush Bonus
                      </span>
                      <span className="font-semibold">+${transaction.rushBonus?.toFixed(2)}</span>
                    </div>
                  )}
                  {includeTip && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="flex items-center gap-1">
                        <Gift className="w-4 h-4" />
                        Customer Tip
                      </span>
                      <span className="font-semibold">+${transaction.tip?.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Net Earnings</span>
                    <span className="font-bold text-2xl text-green-600">
                      ${transaction.netEarnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-center mt-2">
                    <Badge variant="outline" className="bg-green-50">
                      {((transaction.netEarnings / transaction.baseAmount) * 100).toFixed(1)}% of base amount
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Visual Pie Chart */}
              <div className="bg-white border rounded-xl p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Education Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Education Center</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="breakdown">Fee Breakdown</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
              <TabsTrigger value="tiers">Volume Tiers</TabsTrigger>
            </TabsList>

            <TabsContent value="breakdown" className="mt-6">
              <div className="space-y-4">
                {feeTypes.map((fee) => (
                  <motion.div
                    key={fee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedFee(expandedFee === fee.id ? null : fee.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            {fee.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              {fee.name}
                              {fee.negotiable && (
                                <Badge variant="outline" className="text-xs">
                                  Negotiable
                                </Badge>
                              )}
                            </h4>
                            <p className="text-sm text-gray-500">{fee.whenApplied}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="font-mono">
                            {fee.rate}
                          </Badge>
                          {expandedFee === fee.id ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedFee === fee.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4"
                        >
                          <Separator className="mb-4" />
                          <div className="space-y-3">
                            <p className="text-sm text-gray-600">{fee.description}</p>
                            
                            <div>
                              <h5 className="font-medium mb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-yellow-500" />
                                Ways to Reduce
                              </h5>
                              <ul className="space-y-1">
                                {fee.waysToReduce.map((way, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                    {way}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="mt-6">
              <div className="space-y-6">
                {optimizationStrategies.map((category) => (
                  <div key={category.category}>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      {category.icon}
                      {category.category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.strategies.map((strategy) => (
                        <div key={strategy.name} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{strategy.name}</h4>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {strategy.savings}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{strategy.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tiers" className="mt-6">
              <div className="space-y-6">
                <div>
                  <Label>Your Monthly Volume</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      type="number"
                      value={monthlyVolume}
                      onChange={(e) => setMonthlyVolume(parseFloat(e.target.value) || 0)}
                      className="max-w-[200px]"
                    />
                    <span className="text-sm text-gray-500">per month</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Current Tier: {currentTier.label}</h4>
                    <Badge variant="default" className="bg-purple-600">
                      {currentTier.rate}% Platform Fee
                    </Badge>
                  </div>
                  {nextTier && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        Reach ${nextTier.min.toLocaleString()}/month to unlock {nextTier.label} tier ({nextTier.rate}% fee)
                      </p>
                      <Progress 
                        value={(monthlyVolume / nextTier.min) * 100} 
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        ${(nextTier.min - monthlyVolume).toLocaleString()} more to next tier
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {volumeTiers.map((tier) => (
                    <div
                      key={tier.label}
                      className={`p-4 border rounded-lg ${
                        currentTier.label === tier.label ? "border-purple-500 bg-purple-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {tier.label} Tier
                            {currentTier.label === tier.label && (
                              <Badge variant="outline">Current</Badge>
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">
                            ${tier.min.toLocaleString()} - {tier.max === Infinity ? "∞" : `$${tier.max.toLocaleString()}`}/month
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{tier.rate}%</p>
                          <p className="text-xs text-gray-500">Platform Fee</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Tips Alert */}
      <Alert className="border-purple-200 bg-purple-50">
        <Sparkles className="w-4 h-4" />
        <AlertDescription>
          <strong>Pro Tip:</strong> Creators who batch their withdrawals weekly save an average of $600/year in fees. 
          Consider scheduling automatic weekly payouts to optimize your costs!
        </AlertDescription>
      </Alert>
    </div>
  )
}