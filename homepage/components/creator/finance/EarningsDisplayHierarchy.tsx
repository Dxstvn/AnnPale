"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Eye,
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
  Wallet,
  CreditCard,
  RefreshCw,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EarningsData {
  availableBalance: number
  pendingClearance: number
  thisMonthTotal: number
  lastUpdate: string
  nextPayoutDate: string
  totalLifetime: number
}

interface Transaction {
  id: string
  type: 'earning' | 'payout' | 'refund' | 'fee'
  amount: number
  description: string
  customer?: string
  status: 'completed' | 'pending' | 'processing'
  date: string
  fee?: number
}

interface EarningsDisplayHierarchyProps {
  earnings: EarningsData
  recentTransactions: Transaction[]
  isLoading?: boolean
  onWithdraw?: () => void
  onViewHistory?: () => void
  onRefresh?: () => void
}

export function EarningsDisplayHierarchy({
  earnings,
  recentTransactions,
  isLoading = false,
  onWithdraw,
  onViewHistory,
  onRefresh
}: EarningsDisplayHierarchyProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return date.toLocaleDateString()
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earning': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'payout': return <Download className="h-4 w-4 text-blue-600" />
      case 'refund': return <RefreshCw className="h-4 w-4 text-orange-600" />
      case 'fee': return <CreditCard className="h-4 w-4 text-gray-600" />
      default: return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const progressToNextPayout = ((earnings.availableBalance + earnings.pendingClearance) / 100) * 100
  const canWithdraw = earnings.availableBalance >= 10

  return (
    <div className="space-y-6">
      {/* Primary Level: Available Balance */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-green-600" />
              Available Balance
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
              <Badge className="bg-green-100 text-green-800">
                <Eye className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-green-600 mb-2">
              {formatCurrency(earnings.availableBalance)}
            </div>
            <p className="text-sm text-green-700">
              Ready for withdrawal • Updated {formatRelativeTime(earnings.lastUpdate)}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              className={cn(
                "flex-1 bg-green-600 hover:bg-green-700",
                !canWithdraw && "opacity-50 cursor-not-allowed"
              )}
              onClick={onWithdraw}
              disabled={!canWithdraw}
            >
              <Download className="h-4 w-4 mr-2" />
              {canWithdraw ? 'Withdraw Funds' : 'Min $10 Required'}
            </Button>
            <Button variant="outline" onClick={onViewHistory}>
              <Calendar className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Level: Pending & Monthly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Clearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-yellow-600">
                {formatCurrency(earnings.pendingClearance)}
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Processing • Available {earnings.nextPayoutDate}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Processing Progress</span>
                <span className="font-medium">72 hours</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-gray-500">
                Funds typically clear within 2-3 business days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5 text-purple-600" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-purple-600">
                {formatCurrency(earnings.thisMonthTotal)}
              </div>
              <p className="text-sm text-purple-700 mt-1">
                +18% from last month
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-center p-2 bg-white rounded">
                <p className="text-gray-600">Videos</p>
                <p className="font-semibold">12</p>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <p className="text-gray-600">Avg/Video</p>
                <p className="font-semibold">${(earnings.thisMonthTotal / 12).toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tertiary Level: Lifetime Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Lifetime Earnings</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(earnings.totalLifetime)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Monthly Growth</p>
            <p className="text-lg font-bold text-green-600">+18%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Payout Success</p>
            <p className="text-lg font-bold text-gray-900">99.8%</p>
          </CardContent>
        </Card>
      </div>

      {/* Details Level: Transaction List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm" onClick={onViewHistory}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.slice(0, 5).map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                      {transaction.customer && (
                        <p className="text-xs text-gray-500">• {transaction.customer}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      "font-semibold",
                      transaction.type === 'earning' ? "text-green-600" :
                      transaction.type === 'payout' ? "text-blue-600" :
                      transaction.type === 'fee' ? "text-red-600" :
                      "text-gray-900"
                    )}>
                      {transaction.type === 'payout' || transaction.type === 'fee' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    {getStatusBadge(transaction.status)}
                  </div>
                  {transaction.fee && (
                    <p className="text-xs text-gray-500 mt-1">
                      Fee: {formatCurrency(transaction.fee)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {recentTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No transactions yet</p>
              <p className="text-xs mt-1">Your earnings will appear here once you complete videos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Progress Indicator */}
      {progressToNextPayout < 100 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Next Payout Goal</span>
              </div>
              <span className="text-sm text-blue-700">
                ${(100 - (earnings.availableBalance + earnings.pendingClearance)).toFixed(2)} to go
              </span>
            </div>
            <Progress value={progressToNextPayout} className="h-2 mb-2" />
            <p className="text-xs text-blue-700">
              Reach $100 to unlock weekly automatic payouts
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}