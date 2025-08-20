"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { 
  Shield,
  Lock,
  Eye,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Banknote,
  Calendar,
  Globe,
  Users,
  Heart,
  Brain,
  Zap,
  ShieldCheck,
  FileText,
  HelpCircle,
  Calculator,
  PiggyBank,
  Wallet,
  Receipt,
  Building,
  Award,
  Info,
  ArrowRight,
  ChevronRight,
  Star,
  Sparkles,
  Target,
  Activity,
  BarChart3,
  Briefcase,
  Home,
  Plane,
  Coffee
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface FinancialPersona {
  id: string
  name: string
  icon: React.ReactNode
  primaryConcern: string
  financialLiteracy: "Basic" | "Moderate" | "High" | "Varies"
  payoutPreference: string
  supportNeeds: string
  monthlyEarnings: string
  anxietyLevel: number
  trustScore: number
}

interface TrustFactor {
  category: string
  icon: React.ReactNode
  items: string[]
  trustImpact: number
  currentScore: number
}

interface AnxietyTrigger {
  trigger: string
  fear: string
  solution: string
  impact: number
  status: "resolved" | "pending" | "in-progress"
}

export function FinancialPsychologyTrust() {
  const [selectedPersona, setSelectedPersona] = useState<string>("side-hustler")
  const [trustScore, setTrustScore] = useState(82)
  const [showPersonaDetails, setShowPersonaDetails] = useState(false)

  // Financial Personas
  const personas: FinancialPersona[] = [
    {
      id: "side-hustler",
      name: "Side Hustler",
      icon: <Coffee className="w-5 h-5" />,
      primaryConcern: "Extra income",
      financialLiteracy: "Basic",
      payoutPreference: "Weekly, small amounts",
      supportNeeds: "Simple tracking",
      monthlyEarnings: "$500-$2,000",
      anxietyLevel: 30,
      trustScore: 75
    },
    {
      id: "professional",
      name: "Professional",
      icon: <Briefcase className="w-5 h-5" />,
      primaryConcern: "Stable income",
      financialLiteracy: "Moderate",
      payoutPreference: "Bi-weekly, predictable",
      supportNeeds: "Business tools",
      monthlyEarnings: "$2,000-$5,000",
      anxietyLevel: 45,
      trustScore: 82
    },
    {
      id: "full-timer",
      name: "Full-Timer",
      icon: <Home className="w-5 h-5" />,
      primaryConcern: "Primary income",
      financialLiteracy: "High",
      payoutPreference: "Optimized schedule",
      supportNeeds: "Tax planning",
      monthlyEarnings: "$5,000-$15,000",
      anxietyLevel: 65,
      trustScore: 88
    },
    {
      id: "seasonal",
      name: "Seasonal",
      icon: <Calendar className="w-5 h-5" />,
      primaryConcern: "Irregular flow",
      financialLiteracy: "Varies",
      payoutPreference: "Flexible",
      supportNeeds: "Cash flow help",
      monthlyEarnings: "$0-$10,000",
      anxietyLevel: 70,
      trustScore: 70
    },
    {
      id: "international",
      name: "International",
      icon: <Globe className="w-5 h-5" />,
      primaryConcern: "Currency/fees",
      financialLiteracy: "Varies",
      payoutPreference: "Local methods",
      supportNeeds: "Multi-currency",
      monthlyEarnings: "Varies",
      anxietyLevel: 55,
      trustScore: 78
    }
  ]

  // Trust Building Factors
  const trustFactors: TrustFactor[] = [
    {
      category: "Transparency",
      icon: <Eye className="w-5 h-5" />,
      items: [
        "Clear fee structure",
        "Real-time balances",
        "Detailed breakdowns",
        "No hidden charges"
      ],
      trustImpact: 40,
      currentScore: 92
    },
    {
      category: "Security",
      icon: <Shield className="w-5 h-5" />,
      items: [
        "Bank-level encryption",
        "PCI compliance",
        "Fraud protection",
        "Account verification"
      ],
      trustImpact: 35,
      currentScore: 95
    },
    {
      category: "Reliability",
      icon: <Clock className="w-5 h-5" />,
      items: [
        "On-time payments",
        "Multiple payout methods",
        "Clear timelines",
        "Support availability"
      ],
      trustImpact: 30,
      currentScore: 88
    },
    {
      category: "Control",
      icon: <Target className="w-5 h-5" />,
      items: [
        "Flexible scheduling",
        "Multiple options",
        "Instant access",
        "Full history"
      ],
      trustImpact: 25,
      currentScore: 85
    }
  ]

  // Anxiety Triggers and Solutions
  const anxietyTriggers: AnxietyTrigger[] = [
    {
      trigger: "Unclear fees",
      fear: "Hidden costs",
      solution: "Upfront disclosure",
      impact: 40,
      status: "resolved"
    },
    {
      trigger: "Payment delays",
      fear: "Cash flow issues",
      solution: "Clear timeline",
      impact: 35,
      status: "resolved"
    },
    {
      trigger: "Complex taxes",
      fear: "IRS problems",
      solution: "Simple documentation",
      impact: 45,
      status: "in-progress"
    },
    {
      trigger: "Platform changes",
      fear: "Lost earnings",
      solution: "Grandfathering",
      impact: 50,
      status: "resolved"
    },
    {
      trigger: "Technical errors",
      fear: "Lost money",
      solution: "Instant support",
      impact: 30,
      status: "pending"
    }
  ]

  // Mock earnings data
  const earningsData = [
    { month: "Jan", earnings: 3200, trust: 75 },
    { month: "Feb", earnings: 3800, trust: 78 },
    { month: "Mar", earnings: 4200, trust: 80 },
    { month: "Apr", earnings: 3900, trust: 82 },
    { month: "May", earnings: 4500, trust: 85 },
    { month: "Jun", earnings: 5200, trust: 88 }
  ]

  // Payout preference distribution
  const payoutDistribution = [
    { name: "Weekly", value: 35, color: "#9333ea" },
    { name: "Bi-weekly", value: 30, color: "#3b82f6" },
    { name: "Monthly", value: 20, color: "#10b981" },
    { name: "On-demand", value: 15, color: "#f59e0b" }
  ]

  const selectedPersonaData = personas.find(p => p.id === selectedPersona)

  return (
    <div className="p-6 space-y-6">
      {/* Header Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Shield className="w-8 h-8 text-green-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{trustScore}%</p>
                <p className="text-xs text-gray-500">Trust Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Brain className="w-8 h-8 text-purple-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-gray-500">Personas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Heart className="w-8 h-8 text-pink-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">92%</p>
                <p className="text-xs text-gray-500">Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <AlertCircle className="w-8 h-8 text-orange-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-gray-500">Active Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-gray-500">On-time Pay</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Personas */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Creator Financial Personas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {personas.map((persona) => (
                  <motion.div
                    key={persona.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={selectedPersona === persona.id ? "default" : "outline"}
                      className="w-full h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => {
                        setSelectedPersona(persona.id)
                        setShowPersonaDetails(true)
                      }}
                    >
                      <div className={`p-2 rounded-full ${
                        selectedPersona === persona.id ? "bg-white/20" : "bg-gray-100"
                      }`}>
                        {persona.icon}
                      </div>
                      <span className="text-sm font-medium">{persona.name}</span>
                      <span className="text-xs opacity-75">{persona.monthlyEarnings}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>

              {showPersonaDetails && selectedPersonaData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-full">
                        {selectedPersonaData.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{selectedPersonaData.name}</h3>
                        <p className="text-sm text-gray-500">{selectedPersonaData.monthlyEarnings}/month</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      Financial Literacy: {selectedPersonaData.financialLiteracy}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Primary Concern</Label>
                      <p className="font-medium">{selectedPersonaData.primaryConcern}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Payout Preference</Label>
                      <p className="font-medium">{selectedPersonaData.payoutPreference}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Support Needs</Label>
                      <p className="font-medium">{selectedPersonaData.supportNeeds}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Trust Score</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedPersonaData.trustScore} className="flex-1" />
                        <span className="text-sm font-medium">{selectedPersonaData.trustScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-500">Anxiety Level</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress 
                        value={selectedPersonaData.anxietyLevel} 
                        className="flex-1"
                        style={{
                          background: `linear-gradient(to right, 
                            ${selectedPersonaData.anxietyLevel < 30 ? '#10b981' : 
                              selectedPersonaData.anxietyLevel < 60 ? '#f59e0b' : '#ef4444'} 
                            ${selectedPersonaData.anxietyLevel}%, #e5e7eb ${selectedPersonaData.anxietyLevel}%)`
                        }}
                      />
                      <span className={`text-sm font-medium ${
                        selectedPersonaData.anxietyLevel < 30 ? 'text-green-600' :
                        selectedPersonaData.anxietyLevel < 60 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {selectedPersonaData.anxietyLevel}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-900">
                      <strong>Recommended Actions:</strong> Provide {
                        selectedPersonaData.financialLiteracy === "Basic" ? "simple tutorials and guides" :
                        selectedPersonaData.financialLiteracy === "Moderate" ? "business tools and analytics" :
                        selectedPersonaData.financialLiteracy === "High" ? "advanced tax planning resources" :
                        "customized support based on needs"
                      } to support this persona's financial journey.
                    </p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Trust & Earnings Correlation */}
          <Card>
            <CardHeader>
              <CardTitle>Trust Score Impact on Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#9333ea" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#9333ea" 
                    strokeWidth={2}
                    name="Earnings ($)"
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="trust" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Trust Score (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <span className="text-sm">Earnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm">Trust Score</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Anxiety Triggers Management */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Anxiety Mitigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anxietyTriggers.map((trigger, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span className="font-medium">{trigger.trigger}</span>
                        </div>
                        <p className="text-sm text-gray-500">Fear: {trigger.fear}</p>
                      </div>
                      <Badge variant={
                        trigger.status === "resolved" ? "default" :
                        trigger.status === "in-progress" ? "secondary" : "outline"
                      }>
                        {trigger.status}
                      </Badge>
                    </div>
                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <p className="text-sm">
                        <strong>Solution:</strong> {trigger.solution}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Trust Impact: <span className="font-medium text-green-600">+{trigger.impact}%</span>
                      </div>
                      {trigger.status === "pending" && (
                        <Button size="sm" variant="outline">
                          Implement Solution
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Building Elements */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trust Building Elements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trustFactors.map((factor, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          {factor.icon}
                        </div>
                        <span className="font-medium">{factor.category}</span>
                      </div>
                      <Badge variant="outline">
                        +{factor.trustImpact}% trust
                      </Badge>
                    </div>
                    <Progress value={factor.currentScore} className="h-2" />
                    <div className="pl-10 space-y-1">
                      {factor.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          {item}
                        </div>
                      ))}
                    </div>
                    {index < trustFactors.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payout Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Payout Preferences Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={payoutDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {payoutDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {payoutDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Trust Building Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calculator className="w-4 h-4 mr-2" />
                  Fee Calculator
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Tax Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Banknote className="w-4 h-4 mr-2" />
                  Payout Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Security Center
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Financial Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}