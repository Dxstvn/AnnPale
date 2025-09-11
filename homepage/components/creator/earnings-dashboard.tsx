'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from 'recharts'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Filter,
  Info
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns'

interface EarningsData {
  totalEarnings: number
  monthlyEarnings: number
  todayEarnings: number
  pendingPayouts: number
  completedOrders: number
  averageOrderValue: number
  platformFees: number
  netEarnings: number
}

interface ChartData {
  date: string
  earnings: number
  orders: number
  platformFee: number
  netEarnings: number
}

interface CategoryBreakdown {
  category: string
  value: number
  percentage: number
  color: string
}

export function EarningsDashboard({ creatorId }: { creatorId: string }) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    todayEarnings: 0,
    pendingPayouts: 0,
    completedOrders: 0,
    averageOrderValue: 0,
    platformFees: 0,
    netEarnings: 0
  })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEarningsData()
  }, [creatorId, timeRange])

  const fetchEarningsData = async () => {
    try {
      setLoading(true)
      
      // Fetch earnings data from API
      const response = await fetch(`/api/creator/earnings?range=${timeRange}`)
      const data = await response.json()
      
      if (data.success) {
        // Set summary data
        setEarningsData({
          totalEarnings: data.summary.total_earnings || 0,
          monthlyEarnings: data.summary.monthly_earnings || 0,
          todayEarnings: data.summary.today_earnings || 0,
          pendingPayouts: data.summary.pending_payouts || 0,
          completedOrders: data.summary.completed_orders || 0,
          averageOrderValue: data.summary.average_order_value || 0,
          platformFees: data.summary.platform_fees || 0,
          netEarnings: data.summary.net_earnings || 0
        })
        
        // Transform chart data
        const transformed = (data.daily || []).map((item: any) => ({
          date: format(new Date(item.date), 'MMM d'),
          earnings: item.gross_earnings || 0,
          orders: item.order_count || 0,
          platformFee: item.platform_fees || 0,
          netEarnings: item.net_earnings || 0
        }))
        setChartData(transformed)
        
        // Set category breakdown (mock data for now)
        setCategoryData([
          { category: 'Birthday Messages', value: 45000, percentage: 35, color: '#8B5CF6' },
          { category: 'Pep Talks', value: 32000, percentage: 25, color: '#EC4899' },
          { category: 'Anniversary', value: 25600, percentage: 20, color: '#10B981' },
          { category: 'Roasts', value: 19200, percentage: 15, color: '#F59E0B' },
          { category: 'Other', value: 6400, percentage: 5, color: '#6B7280' }
        ])
      }
    } catch (error) {
      console.error('Error fetching earnings data:', error)
      // Use mock data for demo
      generateMockData()
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = () => {
    // Generate mock chart data for demo
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const mockChart: ChartData[] = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const earnings = Math.floor(Math.random() * 2000) + 500
      mockChart.push({
        date: format(date, 'MMM d'),
        earnings,
        orders: Math.floor(Math.random() * 10) + 1,
        platformFee: earnings * 0.3,
        netEarnings: earnings * 0.7
      })
    }
    
    setChartData(mockChart)
    
    // Set mock summary data
    const totalEarnings = mockChart.reduce((sum, d) => sum + d.earnings, 0)
    setEarningsData({
      totalEarnings,
      monthlyEarnings: mockChart.slice(-30).reduce((sum, d) => sum + d.earnings, 0),
      todayEarnings: mockChart[mockChart.length - 1]?.earnings || 0,
      pendingPayouts: Math.floor(totalEarnings * 0.15),
      completedOrders: mockChart.reduce((sum, d) => sum + d.orders, 0),
      averageOrderValue: Math.floor(totalEarnings / mockChart.reduce((sum, d) => sum + d.orders, 0)),
      platformFees: totalEarnings * 0.3,
      netEarnings: totalEarnings * 0.7
    })
    
    setCategoryData([
      { category: 'Birthday Messages', value: totalEarnings * 0.35, percentage: 35, color: '#8B5CF6' },
      { category: 'Pep Talks', value: totalEarnings * 0.25, percentage: 25, color: '#EC4899' },
      { category: 'Anniversary', value: totalEarnings * 0.20, percentage: 20, color: '#10B981' },
      { category: 'Roasts', value: totalEarnings * 0.15, percentage: 15, color: '#F59E0B' },
      { category: 'Other', value: totalEarnings * 0.05, percentage: 5, color: '#6B7280' }
    ])
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const calculateGrowth = () => {
    if (chartData.length < 2) return 0
    const recent = chartData.slice(-7).reduce((sum, d) => sum + d.earnings, 0)
    const previous = chartData.slice(-14, -7).reduce((sum, d) => sum + d.earnings, 0)
    if (previous === 0) return 100
    return ((recent - previous) / previous * 100).toFixed(1)
  }

  const growth = parseFloat(calculateGrowth())

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(earningsData.totalEarnings)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  After platform fee: {formatCurrency(earningsData.netEarnings)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(earningsData.monthlyEarnings)}
                </p>
                <div className="flex items-center mt-1">
                  {growth > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-500">+{growth}% from last month</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-xs text-red-500">{growth}% from last month</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(earningsData.pendingPayouts)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Next payout in 3 days
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(earningsData.averageOrderValue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {earningsData.completedOrders} completed orders
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Info className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Track your earnings and platform fees over time</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
                <TabsList>
                  <TabsTrigger value="7d">7 Days</TabsTrigger>
                  <TabsTrigger value="30d">30 Days</TabsTrigger>
                  <TabsTrigger value="90d">90 Days</TabsTrigger>
                  <TabsTrigger value="1y">1 Year</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#8B5CF6" 
                  fillOpacity={1} 
                  fill="url(#colorEarnings)"
                  name="Gross Earnings"
                />
                <Area 
                  type="monotone" 
                  dataKey="netEarnings" 
                  stroke="#10B981" 
                  fillOpacity={1} 
                  fill="url(#colorNet)"
                  name="Net Earnings (70%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown and Revenue Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Earnings by Category</CardTitle>
            <CardDescription>Breakdown of your earnings by video type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.category}: ${entry.percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Split</CardTitle>
            <CardDescription>Understanding your earnings after platform fees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Gross Earnings</p>
                  <p className="text-sm text-gray-500">Total from all orders</p>
                </div>
                <p className="text-xl font-bold">{formatCurrency(earningsData.totalEarnings)}</p>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Platform Fee (30%)</p>
                  <p className="text-sm text-gray-500">Ann Pale service fee</p>
                </div>
                <p className="text-xl font-bold text-red-600">-{formatCurrency(earningsData.platformFees)}</p>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
                <div>
                  <p className="font-medium text-gray-900">Your Net Earnings (70%)</p>
                  <p className="text-sm text-gray-500">Amount you keep</p>
                </div>
                <p className="text-xl font-bold text-green-600">{formatCurrency(earningsData.netEarnings)}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Next payout date:</span>
                <span className="font-medium">January 15, 2025</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Payment method:</span>
                <span className="font-medium">Direct Deposit (**** 4321)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}