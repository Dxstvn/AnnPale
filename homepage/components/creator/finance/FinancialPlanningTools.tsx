"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Target,
  Calculator, 
  TrendingUp,
  DollarSign,
  PiggyBank,
  Receipt,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
  Lightbulb,
  Shield,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EarningsProjection {
  month: string
  projected: number
  conservative: number
  optimistic: number
  actual?: number
}

interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: 'emergency' | 'equipment' | 'vacation' | 'business' | 'other'
  priority: 'high' | 'medium' | 'low'
}

interface Expense {
  id: string
  category: string
  amount: number
  frequency: 'monthly' | 'quarterly' | 'yearly'
  description: string
  isBusinessExpense: boolean
  date: string
}

interface FinancialPlanningToolsProps {
  currentEarnings: number
  monthlyAverage: number
  yearToDateEarnings: number
  goals: Goal[]
  expenses: Expense[]
  onAddGoal?: (goal: Omit<Goal, 'id'>) => void
  onAddExpense?: (expense: Omit<Expense, 'id'>) => void
  onExportData?: (type: 'tax' | 'business' | 'goals') => void
}

export function FinancialPlanningTools({
  currentEarnings,
  monthlyAverage,
  yearToDateEarnings,
  goals,
  expenses,
  onAddGoal,
  onAddExpense,
  onExportData
}: FinancialPlanningToolsProps) {
  const [activeTab, setActiveTab] = useState('projections')
  const [newGoalAmount, setNewGoalAmount] = useState('')
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [taxScenario, setTaxScenario] = useState<'conservative' | 'optimistic'>('conservative')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Calculate earnings projections
  const projections: EarningsProjection[] = [
    { month: 'Jan', projected: monthlyAverage * 0.9, conservative: monthlyAverage * 0.7, optimistic: monthlyAverage * 1.2, actual: 2180 },
    { month: 'Feb', projected: monthlyAverage * 1.0, conservative: monthlyAverage * 0.8, optimistic: monthlyAverage * 1.3, actual: 2450 },
    { month: 'Mar', projected: monthlyAverage * 1.1, conservative: monthlyAverage * 0.9, optimistic: monthlyAverage * 1.4 },
    { month: 'Apr', projected: monthlyAverage * 1.0, conservative: monthlyAverage * 0.8, optimistic: monthlyAverage * 1.3 },
    { month: 'May', projected: monthlyAverage * 1.2, conservative: monthlyAverage * 1.0, optimistic: monthlyAverage * 1.5 },
    { month: 'Jun', projected: monthlyAverage * 1.1, conservative: monthlyAverage * 0.9, optimistic: monthlyAverage * 1.4 }
  ]

  // Tax calculations
  const estimatedQuarterlyTax = yearToDateEarnings * 0.25 // Conservative 25% estimate
  const businessExpenses = expenses.filter(e => e.isBusinessExpense).reduce((sum, e) => {
    const multiplier = e.frequency === 'monthly' ? 12 : e.frequency === 'quarterly' ? 4 : 1
    return sum + (e.amount * multiplier)
  }, 0)

  // Goal progress calculations
  const totalGoalProgress = goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount) * 100, 0) / goals.length

  const getGoalPriority = (goal: Goal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100
    const daysToDeadline = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    
    if (progress < 25 && daysToDeadline < 30) return 'urgent'
    if (progress > 75) return 'on-track'
    return 'needs-attention'
  }

  const maxProjection = Math.max(...projections.map(p => p.optimistic))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Planning</h2>
          <p className="text-sm text-gray-600 mt-1">
            Plan your financial future with earnings projections and goal tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Secure Planning
          </Badge>
          <Button variant="outline" size="sm" onClick={() => onExportData?.('business')}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projections" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Projections
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Expenses
          </TabsTrigger>
          <TabsTrigger value="taxes" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Tax Planning
          </TabsTrigger>
        </TabsList>

        {/* Earnings Projections */}
        <TabsContent value="projections" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-green-700">6-Month Conservative</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(projections.reduce((sum, p) => sum + p.conservative, 0))}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-blue-700">6-Month Projected</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(projections.reduce((sum, p) => sum + p.projected, 0))}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs text-purple-700">6-Month Optimistic</p>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(projections.reduce((sum, p) => sum + p.optimistic, 0))}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Earnings Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chart */}
                <div className="grid grid-cols-6 gap-2 h-40">
                  {projections.map((month, index) => (
                    <div key={index} className="flex flex-col items-center justify-end space-y-1">
                      <div className="text-xs font-medium text-gray-600">
                        {formatCurrency(month.optimistic).replace('$', '$').slice(0, 4)}
                      </div>
                      <div className="w-full space-y-1">
                        <div 
                          className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-md opacity-30"
                          style={{ height: `${(month.optimistic / maxProjection) * 100}%` }}
                        />
                        <div 
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-md opacity-70"
                          style={{ height: `${(month.projected / maxProjection) * 80}%` }}
                        />
                        <div 
                          className="w-full bg-gradient-to-t from-green-600 to-green-500 rounded-t-md"
                          style={{ height: `${(month.conservative / maxProjection) * 60}%` }}
                        />
                        {month.actual && (
                          <div 
                            className="w-full bg-gray-800 rounded-t-md"
                            style={{ height: `${(month.actual / maxProjection) * 70}%` }}
                          />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {month.month}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded" />
                    <span>Conservative</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded" />
                    <span>Projected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded" />
                    <span>Optimistic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-800 rounded" />
                    <span>Actual</span>
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Planning Insights</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Your conservative projections show consistent growth</li>
                        <li>• May shows highest projected earnings due to holiday season</li>
                        <li>• Consider setting aside 25-30% for taxes and business expenses</li>
                        <li>• Track actual vs projected monthly to refine future forecasts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Goals */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <PiggyBank className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Total Target</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(goals.reduce((sum, g) => sum + g.targetAmount, 0))}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Average Progress</p>
                <p className="text-2xl font-bold text-gray-900">{totalGoalProgress.toFixed(0)}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Add New Goal */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Add New Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Goal title"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Target amount"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                />
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    if (newGoalTitle && newGoalAmount) {
                      onAddGoal?.({
                        title: newGoalTitle,
                        targetAmount: parseFloat(newGoalAmount),
                        currentAmount: 0,
                        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        category: 'other',
                        priority: 'medium'
                      })
                      setNewGoalTitle('')
                      setNewGoalAmount('')
                    }
                  }}
                >
                  Add Goal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Goals List */}
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const priority = getGoalPriority(goal)
              const daysToDeadline = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              
              return (
                <Card key={goal.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{goal.title}</h3>
                        <Badge className={cn(
                          priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          priority === 'on-track' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        )}>
                          {priority === 'urgent' ? 'Urgent' : priority === 'on-track' ? 'On Track' : 'Needs Attention'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</p>
                        <p className="text-xs text-gray-500">{daysToDeadline} days left</p>
                      </div>
                    </div>
                    <Progress value={progress} className="mb-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{progress.toFixed(1)}% complete</span>
                      <span>{formatCurrency(goal.targetAmount - goal.currentAmount)} remaining</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Expense Tracking */}
        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Receipt className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Monthly Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(expenses.filter(e => e.frequency === 'monthly').reduce((sum, e) => sum + e.amount, 0))}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Business Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(businessExpenses)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Calculator className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Tax Deductible</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(businessExpenses * 0.25)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Expense Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(
                  expenses.reduce((acc, expense) => {
                    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
                    return acc
                  }, {} as Record<string, number>)
                ).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium capitalize">{category}</span>
                    <span className="font-semibold">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Planning */}
        <TabsContent value="taxes" className="space-y-6">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Quarterly Tax Estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Estimated Tax Owed</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {formatCurrency(estimatedQuarterlyTax)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on current year earnings
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Business Deductions</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(businessExpenses)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Potential tax savings: {formatCurrency(businessExpenses * 0.25)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => onExportData?.('tax')}>
                  <Download className="h-4 w-4 mr-1" />
                  Export Tax Summary
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule Payment
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Tax Planning Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Set aside 25-30% of earnings for taxes throughout the year</li>
                  <li>• Track all business expenses including equipment, software, and marketing</li>
                  <li>• Consider quarterly estimated tax payments to avoid penalties</li>
                  <li>• Consult a tax professional for personalized advice</li>
                  <li>• Keep detailed records of all income and expenses</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}