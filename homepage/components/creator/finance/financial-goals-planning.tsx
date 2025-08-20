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
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { 
  Target,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  Trophy,
  Sparkles,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  LineChart,
  PieChart,
  Calculator,
  Lightbulb,
  TrendingDown,
  Award,
  Star,
  Zap,
  Shield,
  PiggyBank,
  Wallet,
  CreditCard,
  Receipt,
  Package,
  Home,
  Car,
  Plane,
  Heart,
  BookOpen,
  Camera,
  Music,
  Gamepad2,
  Gift,
  Flag,
  Rocket,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Settings,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Bell,
  BellOff,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Share2,
  Copy,
  Check,
  X,
  MoreVertical
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts"
import { format, addDays, addMonths, differenceInDays, startOfMonth, endOfMonth } from "date-fns"

interface Goal {
  id: string
  type: "daily" | "weekly" | "monthly" | "annual" | "custom"
  title: string
  target: number
  current: number
  startDate: Date
  endDate: Date
  category: string
  priority: "high" | "medium" | "low"
  icon: React.ReactNode
  color: string
  notifications: boolean
  milestone: {
    25: boolean
    50: boolean
    75: boolean
    100: boolean
  }
  achieved: boolean
  achievedDate?: Date
}

interface Projection {
  date: string
  baseline: number
  conservative: number
  optimistic: number
  actual?: number
}

interface Recommendation {
  id: string
  type: "pricing" | "service" | "cost" | "investment" | "emergency"
  title: string
  description: string
  impact: string
  priority: "high" | "medium" | "low"
  icon: React.ReactNode
}

export function FinancialGoalsPlanning() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [projectionTimeframe, setProjectionTimeframe] = useState("6months")
  const [scenarioType, setScenarioType] = useState("baseline")
  const [newGoal, setNewGoal] = useState({
    type: "monthly",
    title: "",
    target: 0,
    category: "earnings",
    priority: "medium",
    notifications: true
  })

  // Use fixed dates to avoid hydration issues
  const baseDate = new Date("2024-12-27T00:00:00.000Z")
  const monthStart = new Date("2024-12-01T00:00:00.000Z")
  const monthEnd = new Date("2024-12-31T23:59:59.999Z")

  // Mock goals data with fixed dates
  const goals: Goal[] = [
    {
      id: "1",
      type: "daily",
      title: "Daily Earnings Target",
      target: 500,
      current: 385,
      startDate: baseDate,
      endDate: addDays(baseDate, 1),
      category: "earnings",
      priority: "high",
      icon: <DollarSign className="w-4 h-4" />,
      color: "green",
      notifications: true,
      milestone: { 25: true, 50: true, 75: true, 100: false },
      achieved: false
    },
    {
      id: "2",
      type: "weekly",
      title: "Weekly Video Messages",
      target: 3500,
      current: 2450,
      startDate: baseDate,
      endDate: addDays(baseDate, 7),
      category: "earnings",
      priority: "high",
      icon: <Target className="w-4 h-4" />,
      color: "blue",
      notifications: true,
      milestone: { 25: true, 50: true, 75: false, 100: false },
      achieved: false
    },
    {
      id: "3",
      type: "monthly",
      title: "Monthly Revenue Goal",
      target: 15000,
      current: 11250,
      startDate: monthStart,
      endDate: monthEnd,
      category: "earnings",
      priority: "high",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "purple",
      notifications: true,
      milestone: { 25: true, 50: true, 75: true, 100: false },
      achieved: false
    },
    {
      id: "4",
      type: "custom",
      title: "Emergency Fund",
      target: 10000,
      current: 4500,
      startDate: new Date("2024-01-01T00:00:00.000Z"),
      endDate: new Date("2024-12-31T23:59:59.999Z"),
      category: "savings",
      priority: "medium",
      icon: <Shield className="w-4 h-4" />,
      color: "orange",
      notifications: false,
      milestone: { 25: true, 50: false, 75: false, 100: false },
      achieved: false
    },
    {
      id: "5",
      type: "annual",
      title: "Annual Income Target",
      target: 180000,
      current: 165000,
      startDate: new Date("2024-01-01T00:00:00.000Z"),
      endDate: new Date("2024-12-31T23:59:59.999Z"),
      category: "earnings",
      priority: "high",
      icon: <Trophy className="w-4 h-4" />,
      color: "yellow",
      notifications: true,
      milestone: { 25: true, 50: true, 75: true, 100: false },
      achieved: false,
      achievedDate: new Date("2024-11-15T00:00:00.000Z")
    }
  ]

  // Projection data
  const projectionData: Projection[] = [
    { date: "Jan", baseline: 12000, conservative: 10000, optimistic: 14000, actual: 11500 },
    { date: "Feb", baseline: 13000, conservative: 11000, optimistic: 15000, actual: 12800 },
    { date: "Mar", baseline: 14000, conservative: 12000, optimistic: 16500, actual: 14200 },
    { date: "Apr", baseline: 15000, conservative: 13000, optimistic: 17500, actual: 15100 },
    { date: "May", baseline: 16000, conservative: 14000, optimistic: 19000, actual: 16500 },
    { date: "Jun", baseline: 17000, conservative: 15000, optimistic: 20000 },
    { date: "Jul", baseline: 18000, conservative: 16000, optimistic: 21500 },
    { date: "Aug", baseline: 19000, conservative: 17000, optimistic: 23000 },
    { date: "Sep", baseline: 20000, conservative: 18000, optimistic: 24500 },
    { date: "Oct", baseline: 21000, conservative: 19000, optimistic: 26000 },
    { date: "Nov", baseline: 22000, conservative: 20000, optimistic: 27500 },
    { date: "Dec", baseline: 23000, conservative: 21000, optimistic: 29000 }
  ]

  // Goal performance data for chart
  const goalPerformanceData = [
    { name: "Daily", achieved: 73, total: 100 },
    { name: "Weekly", achieved: 68, total: 100 },
    { name: "Monthly", achieved: 61, total: 100 },
    { name: "Annual", achieved: 54, total: 100 },
    { name: "Custom", achieved: 47, total: 100 }
  ]

  // Recommendations
  const recommendations: Recommendation[] = [
    {
      id: "1",
      type: "pricing",
      title: "Optimize Video Pricing",
      description: "Increase premium video messages by 15% based on demand",
      impact: "+$2,500/month",
      priority: "high",
      icon: <Calculator className="w-5 h-5" />
    },
    {
      id: "2",
      type: "service",
      title: "Add Rush Delivery Option",
      description: "Offer 24-hour delivery for 50% premium",
      impact: "+$1,800/month",
      priority: "high",
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: "3",
      type: "cost",
      title: "Reduce Platform Fees",
      description: "Negotiate better rates or explore alternatives",
      impact: "+$800/month",
      priority: "medium",
      icon: <TrendingDown className="w-5 h-5" />
    },
    {
      id: "4",
      type: "emergency",
      title: "Build Emergency Fund",
      description: "Save 3-6 months of expenses for stability",
      impact: "Risk reduction",
      priority: "medium",
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: "5",
      type: "investment",
      title: "Invest in Equipment",
      description: "Upgrade camera and lighting for better quality",
      impact: "+20% bookings",
      priority: "low",
      icon: <Camera className="w-5 h-5" />
    }
  ]

  // Use a fixed reference date to avoid hydration issues
  const currentDate = baseDate

  // Calculate goal progress and projections
  const calculateProgress = (goal: Goal) => {
    return Math.min(100, Math.round((goal.current / goal.target) * 100))
  }

  const calculateDaysRemaining = (goal: Goal) => {
    return Math.max(0, differenceInDays(goal.endDate, currentDate))
  }

  const calculateDailyNeeded = (goal: Goal) => {
    const remaining = goal.target - goal.current
    const daysLeft = calculateDaysRemaining(goal)
    return daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining
  }

  const getGoalStatus = (goal: Goal) => {
    const progress = calculateProgress(goal)
    const daysRemaining = calculateDaysRemaining(goal)
    const totalDays = differenceInDays(goal.endDate, goal.startDate)
    const expectedProgress = ((totalDays - daysRemaining) / totalDays) * 100

    if (goal.achieved) return "achieved"
    if (progress >= 100) return "completed"
    if (progress >= expectedProgress) return "on-track"
    if (progress >= expectedProgress - 10) return "at-risk"
    return "behind"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "achieved":
      case "completed":
        return "text-green-600"
      case "on-track":
        return "text-blue-600"
      case "at-risk":
        return "text-yellow-600"
      case "behind":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />
      case "on-track":
        return <TrendingUp className="w-4 h-4" />
      case "at-risk":
        return <AlertCircle className="w-4 h-4" />
      case "behind":
        return <TrendingDown className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "earnings":
        return <DollarSign className="w-4 h-4" />
      case "savings":
        return <PiggyBank className="w-4 h-4" />
      case "equipment":
        return <Camera className="w-4 h-4" />
      case "vacation":
        return <Plane className="w-4 h-4" />
      case "education":
        return <BookOpen className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const handleAddGoal = () => {
    console.log("Adding new goal:", newGoal)
    setShowAddGoal(false)
    setNewGoal({
      type: "monthly",
      title: "",
      target: 0,
      category: "earnings",
      priority: "medium",
      notifications: true
    })
  }

  // Custom colors for charts
  const COLORS = ['#9333ea', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Financial Goals & Planning</h2>
          <p className="text-gray-500">Set and track your financial objectives with intelligent insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button onClick={() => setShowAddGoal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Goal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="w-8 h-8 text-purple-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{goals.length}</p>
                <p className="text-xs text-gray-500">Active Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">73%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-gray-500">On Track</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-gray-500">At Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-gray-500">Achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Active Goals Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.slice(0, 4).map((goal) => {
                    const progress = calculateProgress(goal)
                    const status = getGoalStatus(goal)
                    const daysRemaining = calculateDaysRemaining(goal)
                    
                    return (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg bg-${goal.color}-100`}>
                              {goal.icon}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{goal.title}</p>
                              <p className="text-xs text-gray-500">
                                {daysRemaining} days left • ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${getStatusColor(status)}`}>
                              {progress}%
                            </span>
                            {getStatusIcon(status)}
                          </div>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Goal Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Goal Achievement Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={goalPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="achieved" fill="#9333ea" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Featured Goal - Monthly Target */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Monthly Revenue Goal</h3>
                      <p className="text-gray-600">December 2024</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Current</p>
                      <p className="text-2xl font-bold">$11,250</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Target</p>
                      <p className="text-2xl font-bold">$15,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Daily Needed</p>
                      <p className="text-2xl font-bold">$469</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Days Left</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">75% Complete</span>
                    </div>
                    <Progress value={75} className="h-3" />
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        On Track
                      </Badge>
                      <span className="text-gray-500">Projected completion: Dec 28</span>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Milestones:</span>
                    <div className="flex items-center gap-1">
                      <Badge variant="default" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        25%
                      </Badge>
                      <Badge variant="default" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        50%
                      </Badge>
                      <Badge variant="default" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        75%
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        100%
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Celebration Section (shown when goal is achieved) */}
                {false && (
                  <div className="ml-8 p-4 bg-white rounded-xl shadow-lg">
                    <div className="text-center space-y-3">
                      <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
                      <div>
                        <p className="font-bold text-lg">Goal Achieved! 🎉</p>
                        <p className="text-sm text-gray-600">You hit $15,000!</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>Time: 23 days</p>
                        <p className="text-green-600">Beat by: 7 days</p>
                        <p className="font-medium">Bonus: $50</p>
                      </div>
                      <Button size="sm" className="w-full">
                        Set Next Goal
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Goals List */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Goals</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-1" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {goals.map((goal) => {
                      const progress = calculateProgress(goal)
                      const status = getGoalStatus(goal)
                      const dailyNeeded = calculateDailyNeeded(goal)
                      
                      return (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedGoal(goal)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg bg-${goal.color}-100`}>
                                {goal.icon}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{goal.title}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {goal.type}
                                  </Badge>
                                  <Badge 
                                    variant={
                                      goal.priority === "high" ? "destructive" :
                                      goal.priority === "medium" ? "default" : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {goal.priority}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                                  <span>•</span>
                                  <span>{calculateDaysRemaining(goal)} days left</span>
                                  {dailyNeeded > 0 && (
                                    <>
                                      <span>•</span>
                                      <span>${dailyNeeded}/day needed</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-lg font-bold ${getStatusColor(status)}`}>
                                  {progress}%
                                </span>
                                {getStatusIcon(status)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Bell className={`w-3 h-3 ${goal.notifications ? '' : 'text-gray-400'}`} />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <Progress value={progress} className="h-2 mt-3" />
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Goal Details */}
            <div className="space-y-6">
              {selectedGoal ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Goal Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg bg-${selectedGoal.color}-100`}>
                          {selectedGoal.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{selectedGoal.title}</h4>
                          <p className="text-sm text-gray-500">{selectedGoal.type} goal</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Current Progress</p>
                          <p className="font-medium">${selectedGoal.current.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Target Amount</p>
                          <p className="font-medium">${selectedGoal.target.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Start Date</p>
                          <p className="font-medium">{format(selectedGoal.startDate, "MMM d, yyyy")}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">End Date</p>
                          <p className="font-medium">{format(selectedGoal.endDate, "MMM d, yyyy")}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Daily Required</p>
                          <p className="font-medium">${calculateDailyNeeded(selectedGoal)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Days Remaining</p>
                          <p className="font-medium">{calculateDaysRemaining(selectedGoal)}</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm font-medium mb-2">Milestones</p>
                        <div className="space-y-2">
                          {Object.entries(selectedGoal.milestone).map(([percentage, achieved]) => (
                            <div key={percentage} className="flex items-center justify-between">
                              <span className="text-sm">{percentage}% Complete</span>
                              {achieved ? (
                                <Badge variant="default" className="text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  Achieved
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Pending
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">Notifications</Label>
                        <Switch
                          id="notifications"
                          checked={selectedGoal.notifications}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Select a goal to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Goal Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Goals</span>
                      <span className="font-medium">{goals.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">On Track</span>
                      <span className="font-medium text-green-600">
                        {goals.filter(g => getGoalStatus(g) === "on-track").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">At Risk</span>
                      <span className="font-medium text-yellow-600">
                        {goals.filter(g => getGoalStatus(g) === "at-risk").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Behind</span>
                      <span className="font-medium text-red-600">
                        {goals.filter(g => getGoalStatus(g) === "behind").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Achieved</span>
                      <span className="font-medium text-blue-600">
                        {goals.filter(g => g.achieved).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Projections Tab */}
        <TabsContent value="projections" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Financial Projections</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={projectionTimeframe} onValueChange={setProjectionTimeframe}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="12months">12 Months</SelectItem>
                      <SelectItem value="24months">24 Months</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={scenarioType} onValueChange={setScenarioType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baseline">Baseline</SelectItem>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="optimistic">Optimistic</SelectItem>
                      <SelectItem value="all">All Scenarios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  {(scenarioType === "all" || scenarioType === "conservative") && (
                    <Area
                      type="monotone"
                      dataKey="conservative"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#fef2f2"
                      name="Conservative"
                    />
                  )}
                  {(scenarioType === "all" || scenarioType === "baseline") && (
                    <Area
                      type="monotone"
                      dataKey="baseline"
                      stackId={scenarioType === "all" ? "2" : "1"}
                      stroke="#9333ea"
                      fill="#faf5ff"
                      name="Baseline"
                    />
                  )}
                  {(scenarioType === "all" || scenarioType === "optimistic") && (
                    <Area
                      type="monotone"
                      dataKey="optimistic"
                      stackId={scenarioType === "all" ? "3" : "1"}
                      stroke="#10b981"
                      fill="#f0fdf4"
                      name="Optimistic"
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                    name="Actual"
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Projection Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Conservative Scenario</h4>
                  <p className="text-2xl font-bold text-red-700">$126,000</p>
                  <p className="text-sm text-red-600">Annual projection</p>
                  <div className="mt-2 space-y-1 text-xs text-red-600">
                    <p>• 10% below baseline</p>
                    <p>• Accounts for market dips</p>
                    <p>• Safety margin included</p>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Baseline Scenario</h4>
                  <p className="text-2xl font-bold text-purple-700">$180,000</p>
                  <p className="text-sm text-purple-600">Annual projection</p>
                  <div className="mt-2 space-y-1 text-xs text-purple-600">
                    <p>• Current growth rate</p>
                    <p>• Historical average</p>
                    <p>• Most likely outcome</p>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Optimistic Scenario</h4>
                  <p className="text-2xl font-bold text-green-700">$234,000</p>
                  <p className="text-sm text-green-600">Annual projection</p>
                  <div className="mt-2 space-y-1 text-xs text-green-600">
                    <p>• 30% above baseline</p>
                    <p>• Best case scenario</p>
                    <p>• Requires optimization</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Planning Tab */}
        <TabsContent value="planning" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* What-If Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>What-If Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Average Video Price</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Slider
                        defaultValue={[150]}
                        max={500}
                        min={50}
                        step={10}
                        className="flex-1"
                      />
                      <span className="w-16 text-right font-medium">$150</span>
                    </div>
                  </div>
                  <div>
                    <Label>Videos per Week</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Slider
                        defaultValue={[15]}
                        max={50}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-16 text-right font-medium">15</span>
                    </div>
                  </div>
                  <div>
                    <Label>Platform Fee (%)</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Slider
                        defaultValue={[20]}
                        max={30}
                        min={10}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-16 text-right font-medium">20%</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Weekly Revenue</span>
                      <span className="font-medium">$2,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly Revenue</span>
                      <span className="font-medium">$9,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Annual Revenue</span>
                      <span className="text-lg font-bold text-purple-600">$108,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Break-Even Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Break-Even Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fixed Costs</Label>
                      <Input type="number" placeholder="0" defaultValue="2000" className="mt-2" />
                    </div>
                    <div>
                      <Label>Variable Cost per Video</Label>
                      <Input type="number" placeholder="0" defaultValue="30" className="mt-2" />
                    </div>
                    <div>
                      <Label>Average Video Price</Label>
                      <Input type="number" placeholder="0" defaultValue="150" className="mt-2" />
                    </div>
                    <div>
                      <Label>Target Profit</Label>
                      <Input type="number" placeholder="0" defaultValue="5000" className="mt-2" />
                    </div>
                  </div>
                  <Separator />
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-600">Videos Needed to Break Even</p>
                      <p className="text-3xl font-bold text-purple-600">17</p>
                      <p className="text-sm text-gray-600">Videos for Target Profit</p>
                      <p className="text-2xl font-bold text-purple-600">58</p>
                    </div>
                  </div>
                  <Alert>
                    <Lightbulb className="w-4 h-4" />
                    <AlertDescription>
                      At your current rate, you'll break even after 17 videos and reach your profit target after 58 videos.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ROI Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>ROI Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Equipment Investment</h4>
                  <p className="text-2xl font-bold">$3,500</p>
                  <p className="text-sm text-gray-600">Initial cost</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>ROI</span>
                      <span className="text-green-600">+285%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Marketing Spend</h4>
                  <p className="text-2xl font-bold">$1,200</p>
                  <p className="text-sm text-gray-600">Last 3 months</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>ROI</span>
                      <span className="text-green-600">+420%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Software Tools</h4>
                  <p className="text-2xl font-bold">$450</p>
                  <p className="text-sm text-gray-600">Monthly</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>ROI</span>
                      <span className="text-green-600">+180%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Training & Education</h4>
                  <p className="text-2xl font-bold">$800</p>
                  <p className="text-sm text-gray-600">Year to date</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>ROI</span>
                      <span className="text-yellow-600">+95%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Intelligent Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className={`p-3 rounded-lg ${
                      rec.priority === "high" ? "bg-red-100" :
                      rec.priority === "medium" ? "bg-yellow-100" : "bg-gray-100"
                    }`}>
                      {rec.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{rec.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {rec.type}
                            </Badge>
                            <span className="text-sm font-medium text-green-600">{rec.impact}</span>
                          </div>
                        </div>
                        <Button size="sm">
                          Implement
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={[
                    { name: 'Q1', value: 68, fill: '#9333ea' },
                    { name: 'Q2', value: 85, fill: '#ec4899' },
                    { name: 'Q3', value: 72, fill: '#3b82f6' },
                    { name: 'Q4', value: 95, fill: '#10b981' }
                  ]}>
                    <RadialBar dataKey="value" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-600 rounded" />
                      Q1 (Jan-Mar)
                    </span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pink-600 rounded" />
                      Q2 (Apr-Jun)
                    </span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded" />
                      Q3 (Jul-Sep)
                    </span>
                    <span className="font-medium">72%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded" />
                      Q4 (Oct-Dec)
                    </span>
                    <span className="font-medium">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-sm">Holiday Season</p>
                        <p className="text-xs text-gray-600">35% increase expected</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Gift className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Birthday Season</p>
                        <p className="text-xs text-gray-600">25% more bookings</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Valentine's Week</p>
                        <p className="text-xs text-gray-600">45% surge predicted</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-sm">Graduation Season</p>
                        <p className="text-xs text-gray-600">30% opportunity</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddGoal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Create New Goal</h3>
              <div className="space-y-4">
                <div>
                  <Label>Goal Type</Label>
                  <Select 
                    value={newGoal.type}
                    onValueChange={(value) => setNewGoal({...newGoal, type: value as any})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Goal Title</Label>
                  <Input
                    placeholder="e.g., Monthly Revenue Target"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Target Amount</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newGoal.target || ""}
                    onChange={(e) => setNewGoal({...newGoal, target: parseFloat(e.target.value) || 0})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value) => setNewGoal({...newGoal, category: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earnings">Earnings</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={newGoal.priority}
                    onValueChange={(value) => setNewGoal({...newGoal, priority: value as any})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="goal-notifications">Enable Notifications</Label>
                  <Switch
                    id="goal-notifications"
                    checked={newGoal.notifications}
                    onCheckedChange={(checked) => setNewGoal({...newGoal, notifications: checked})}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddGoal}>
                  Create Goal
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}