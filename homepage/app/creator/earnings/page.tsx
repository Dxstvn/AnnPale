'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Calendar,
  Video,
  Users,
  Clock,
  ArrowUp,
  ArrowDown,
  Download,
  Eye,
  Star
} from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface EarningsData {
  totalEarnings: number
  pendingEarnings: number
  availableBalance: number
  videoCount: number
  averagePrice: number
  completionRate: number
  transactions: Transaction[]
  chartData: ChartData[]
  topOccasions: OccasionData[]
}

interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'processing'
  provider: 'stripe' | 'moncash'
  created_at: string
  video_request: {
    occasion: string
    recipient_name: string
  }
}

interface ChartData {
  date: string
  earnings: number
  videos: number
}

interface OccasionData {
  occasion: string
  count: number
  earnings: number
  percentage: number
}

export default function CreatorEarningsPage() {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedTab, setSelectedTab] = useState('overview')
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchEarningsData()
  }, [timeRange])

  const fetchEarningsData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Calculate date range
      const now = new Date()
      let startDate = new Date()
      
      switch (timeRange) {
        case 'week':
          startDate = startOfWeek(now)
          break
        case 'month':
          startDate = startOfMonth(now)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate = subDays(now, 7)
      }

      // Fetch transactions
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select(`
          *,
          video_request:video_requests!inner(
            occasion,
            recipient_name,
            status
          )
        `)
        .eq('creator_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      if (txError) throw txError

      // Fetch completed videos count
      const { count: videoCount, error: videoError } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', user.id)
        .gte('created_at', startDate.toISOString())

      if (videoError) throw videoError

      // Calculate earnings
      const completedTransactions = transactions?.filter(t => t.status === 'completed') || []
      const totalEarnings = completedTransactions.reduce((sum, t) => sum + t.amount, 0)
      const pendingEarnings = transactions?.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0) || 0
      const availableBalance = totalEarnings * 0.8 // 80% after platform fee

      // Calculate average price
      const averagePrice = transactions?.length > 0 
        ? totalEarnings / transactions.length 
        : 0

      // Calculate completion rate
      const { count: totalRequests } = await supabase
        .from('video_requests')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', user.id)
        .gte('created_at', startDate.toISOString())

      const completionRate = totalRequests ? (videoCount || 0) / totalRequests * 100 : 0

      // Prepare chart data
      const chartData: ChartData[] = []
      const days = timeRange === 'month' ? 30 : timeRange === 'year' ? 12 : 7
      
      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(now, i)
        const dayTransactions = transactions?.filter(t => {
          const txDate = new Date(t.created_at)
          return txDate.toDateString() === date.toDateString()
        }) || []
        
        chartData.push({
          date: format(date, timeRange === 'year' ? 'MMM' : 'MMM d'),
          earnings: dayTransactions.reduce((sum, t) => sum + t.amount, 0),
          videos: dayTransactions.length
        })
      }

      // Calculate top occasions
      const occasionMap = new Map<string, { count: number, earnings: number }>()
      transactions?.forEach(t => {
        const occasion = t.video_request.occasion
        const current = occasionMap.get(occasion) || { count: 0, earnings: 0 }
        occasionMap.set(occasion, {
          count: current.count + 1,
          earnings: current.earnings + t.amount
        })
      })

      const topOccasions: OccasionData[] = Array.from(occasionMap.entries())
        .map(([occasion, data]) => ({
          occasion,
          count: data.count,
          earnings: data.earnings,
          percentage: (data.earnings / totalEarnings) * 100
        }))
        .sort((a, b) => b.earnings - a.earnings)
        .slice(0, 5)

      setEarningsData({
        totalEarnings,
        pendingEarnings,
        availableBalance,
        videoCount: videoCount || 0,
        averagePrice,
        completionRate,
        transactions: transactions || [],
        chartData,
        topOccasions
      })
    } catch (error: any) {
      console.error('Error fetching earnings data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load earnings data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B']

  if (loading) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!earningsData) {
    return null
  }

  const weeklyChange = earningsData.chartData.length >= 2
    ? ((earningsData.chartData[earningsData.chartData.length - 1].earnings - 
        earningsData.chartData[earningsData.chartData.length - 2].earnings) /
        earningsData.chartData[earningsData.chartData.length - 2].earnings) * 100
    : 0

  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Earnings & Analytics</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground">
          Track your earnings and video performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(earningsData.totalEarnings)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {weeklyChange > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">{weeklyChange.toFixed(1)}%</span>
                </>
              ) : weeklyChange < 0 ? (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{Math.abs(weeklyChange).toFixed(1)}%</span>
                </>
              ) : (
                <span>No change</span>
              )}
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(earningsData.availableBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              After platform fees (20%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos Completed</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earningsData.videoCount}</div>
            <p className="text-xs text-muted-foreground">
              {earningsData.completionRate.toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(earningsData.averagePrice)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per video
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Over Time</CardTitle>
              <CardDescription>Your earnings trend for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={earningsData.chartData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Area 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#8B5CF6" 
                    fillOpacity={1} 
                    fill="url(#colorEarnings)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Occasions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Occasions</CardTitle>
                <CardDescription>Most requested video types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={earningsData.topOccasions}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ occasion, percentage }) => `${occasion} ${percentage.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="earnings"
                    >
                      {earningsData.topOccasions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution by provider</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['stripe', 'moncash'].map(provider => {
                    const providerTransactions = earningsData.transactions.filter(t => t.provider === provider)
                    const providerEarnings = providerTransactions.reduce((sum, t) => sum + t.amount, 0)
                    const percentage = (providerEarnings / earningsData.totalEarnings) * 100
                    
                    return (
                      <div key={provider} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={provider === 'stripe' ? 'default' : 'secondary'}>
                              {provider === 'stripe' ? 'Stripe' : 'MonCash'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {providerTransactions.length} transactions
                            </span>
                          </div>
                          <span className="font-medium">
                            {formatCurrency(providerEarnings)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              provider === 'stripe' ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest earnings from completed videos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earningsData.transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">
                        {transaction.video_request.occasion} for {transaction.video_request.recipient_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={transaction.status === 'completed' ? 'success' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                        <Badge variant="outline">
                          {transaction.provider === 'stripe' ? 'Stripe' : 'MonCash'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(transaction.created_at), 'PPp')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key indicators of your success</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={earningsData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="earnings" fill="#8B5CF6" name="Earnings ($)" />
                  <Bar yAxisId="right" dataKey="videos" fill="#EC4899" name="Videos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">2.5</span>
                  <span className="text-muted-foreground">hours avg</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Time to accept requests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">4.8</span>
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on fan reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Repeat Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">35%</span>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Fans who ordered again
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Withdrawal Section */}
      {earningsData.availableBalance > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Withdraw Earnings</CardTitle>
            <CardDescription>Transfer your available balance to your bank account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(earningsData.availableBalance)}
                </p>
                <p className="text-sm text-muted-foreground">Available for withdrawal</p>
              </div>
              <Button size="lg">
                <Download className="mr-2 h-4 w-4" />
                Withdraw Funds
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}