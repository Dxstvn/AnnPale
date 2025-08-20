"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  ShoppingCart,
  Users,
  Package,
  Filter,
  ChevronRight,
  Info,
  AlertCircle
} from "lucide-react"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

// Mock data for revenue analytics
const revenueData = {
  daily: Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), "MMM dd"),
    revenue: Math.floor(Math.random() * 500) + 100,
    orders: Math.floor(Math.random() * 10) + 2,
    avgOrderValue: Math.floor(Math.random() * 50) + 50,
  })),
  monthly: [
    { month: "Jan", revenue: 3420, orders: 45, growth: 12 },
    { month: "Feb", revenue: 4100, orders: 52, growth: 20 },
    { month: "Mar", revenue: 3800, orders: 48, growth: -7 },
    { month: "Apr", revenue: 4500, orders: 58, growth: 18 },
    { month: "May", revenue: 5200, orders: 67, growth: 16 },
    { month: "Jun", revenue: 5800, orders: 74, growth: 12 },
  ],
  categoryBreakdown: [
    { category: "Birthday", value: 35, revenue: 2890 },
    { category: "Anniversary", value: 25, revenue: 2100 },
    { category: "Graduation", value: 20, revenue: 1680 },
    { category: "Custom", value: 15, revenue: 1260 },
    { category: "Other", value: 5, revenue: 420 },
  ],
  topCustomers: [
    { name: "Marie L.", orders: 12, revenue: 1020, avgOrder: 85 },
    { name: "Jean P.", orders: 8, revenue: 680, avgOrder: 85 },
    { name: "Sarah M.", orders: 6, revenue: 510, avgOrder: 85 },
    { name: "David K.", orders: 5, revenue: 425, avgOrder: 85 },
    { name: "Lisa R.", orders: 4, revenue: 340, avgOrder: 85 },
  ],
  paymentMethods: [
    { method: "Credit Card", percentage: 65, transactions: 156 },
    { method: "PayPal", percentage: 25, transactions: 60 },
    { method: "Bank Transfer", percentage: 10, transactions: 24 },
  ],
}

// KPI calculations
const currentMonthRevenue = 5800
const lastMonthRevenue = 5200
const revenueGrowth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
const totalRevenue = revenueData.monthly.reduce((sum, m) => sum + m.revenue, 0)
const totalOrders = revenueData.monthly.reduce((sum, m) => sum + m.orders, 0)
const avgOrderValue = Math.round(totalRevenue / totalOrders)

// Translations
const revenueTranslations: Record<string, Record<string, string>> = {
  revenue_analytics: {
    en: "Revenue Analytics",
    fr: "Analyse des revenus",
    ht: "Analiz revni"
  },
  track_earnings: {
    en: "Track your earnings and financial performance",
    fr: "Suivez vos gains et performances financières",
    ht: "Swiv kòb ou fè ak pèfòmans finansye ou"
  },
  total_revenue: {
    en: "Total Revenue",
    fr: "Revenu total",
    ht: "Total revni"
  },
  this_month: {
    en: "This Month",
    fr: "Ce mois",
    ht: "Mwa sa a"
  },
  last_month: {
    en: "Last Month",
    fr: "Mois dernier",
    ht: "Mwa pase"
  },
  total_orders: {
    en: "Total Orders",
    fr: "Total des commandes",
    ht: "Total kòmand"
  },
  avg_order_value: {
    en: "Avg Order Value",
    fr: "Valeur moyenne commande",
    ht: "Valè mwayèn kòmand"
  },
  revenue_growth: {
    en: "Revenue Growth",
    fr: "Croissance des revenus",
    ht: "Kwasans revni"
  },
  daily_revenue: {
    en: "Daily Revenue",
    fr: "Revenus quotidiens",
    ht: "Revni chak jou"
  },
  monthly_revenue: {
    en: "Monthly Revenue",
    fr: "Revenus mensuels",
    ht: "Revni chak mwa"
  },
  revenue_by_category: {
    en: "Revenue by Category",
    fr: "Revenus par catégorie",
    ht: "Revni pa kategori"
  },
  top_customers: {
    en: "Top Customers",
    fr: "Meilleurs clients",
    ht: "Pi gwo kliyan"
  },
  payment_methods: {
    en: "Payment Methods",
    fr: "Méthodes de paiement",
    ht: "Metòd peman"
  },
  export_data: {
    en: "Export Data",
    fr: "Exporter les données",
    ht: "Ekspòte done"
  },
  date_range: {
    en: "Date Range",
    fr: "Plage de dates",
    ht: "Dat"
  },
  last_7_days: {
    en: "Last 7 Days",
    fr: "7 derniers jours",
    ht: "7 dènye jou"
  },
  last_30_days: {
    en: "Last 30 Days",
    fr: "30 derniers jours",
    ht: "30 dènye jou"
  },
  last_3_months: {
    en: "Last 3 Months",
    fr: "3 derniers mois",
    ht: "3 dènye mwa"
  },
  year_to_date: {
    en: "Year to Date",
    fr: "Année en cours",
    ht: "Ane sa a"
  }
}

// Chart colors
const COLORS = ['#9333EA', '#EC4899', '#F59E0B', '#10B981', '#3B82F6']

export default function RevenueAnalyticsPage() {
  const { language } = useLanguage()
  const [dateRange, setDateRange] = useState("last_30_days")
  const [activeTab, setActiveTab] = useState("overview")
  
  const t = (key: string) => {
    return revenueTranslations[key]?.[language] || revenueTranslations[key]?.en || key
  }
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }
  
  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting data as ${format}`)
    // Implementation for data export
  }
  
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('revenue_analytics')}</h1>
            <p className="text-gray-600 mt-1">{t('track_earnings')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">{t('last_7_days')}</SelectItem>
                <SelectItem value="last_30_days">{t('last_30_days')}</SelectItem>
                <SelectItem value="last_3_months">{t('last_3_months')}</SelectItem>
                <SelectItem value="year_to_date">{t('year_to_date')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
              onClick={() => handleExport('pdf')}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('export_data')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('total_revenue')}</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+{revenueGrowth}%</span>
                <span className="text-xs text-gray-500 ml-1">{t('this_month')}</span>
              </div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('total_orders')}</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <div className="flex items-center mt-2">
                <Package className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-gray-500">74 {t('this_month')}</span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('avg_order_value')}</p>
              <p className="text-2xl font-bold text-gray-900">${avgOrderValue}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm text-purple-600">+$5</span>
                <span className="text-xs text-gray-500 ml-1">{t('last_month')}</span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('revenue_growth')}</p>
              <p className="text-2xl font-bold text-gray-900">+{revenueGrowth}%</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-sm text-gray-500">vs {t('last_month')}</span>
              </div>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('daily_revenue')}</CardTitle>
              <CardDescription>Revenue trend over the past 30 days</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData.daily}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#9333EA" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Monthly Comparison */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('monthly_revenue')}</CardTitle>
                <CardDescription>Monthly revenue comparison</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueData.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="#9333EA" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('revenue_by_category')}</CardTitle>
                <CardDescription>Distribution across message types</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={revenueData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, value }) => `${category}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle>{t('top_customers')}</CardTitle>
              <CardDescription>Your highest revenue customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                        index === 0 ? "bg-gradient-to-r from-purple-600 to-pink-600" :
                        index === 1 ? "bg-gray-400" :
                        index === 2 ? "bg-orange-400" : "bg-gray-300"
                      )}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${customer.revenue}</p>
                      <p className="text-sm text-gray-500">Avg: ${customer.avgOrder}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>{t('payment_methods')}</CardTitle>
              <CardDescription>Payment method distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.paymentMethods.map((method, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{method.method}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{method.percentage}%</span>
                        <span className="text-sm text-gray-500 ml-2">({method.transactions} transactions)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                        style={{ width: `${method.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="breakdown" className="space-y-6">
          {/* Detailed Revenue Table */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown by Category</CardTitle>
              <CardDescription>Detailed analysis of revenue sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-right py-3 px-4">Orders</th>
                      <th className="text-right py-3 px-4">Revenue</th>
                      <th className="text-right py-3 px-4">% of Total</th>
                      <th className="text-right py-3 px-4">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.categoryBreakdown.map((category, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{category.category}</td>
                        <td className="text-right py-3 px-4">{Math.round(category.revenue / 85)}</td>
                        <td className="text-right py-3 px-4">${category.revenue.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">{category.value}%</td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            {index % 2 === 0 ? (
                              <>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">+12%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-4 w-4 text-red-600" />
                                <span className="text-red-600">-5%</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td className="py-3 px-4">Total</td>
                      <td className="text-right py-3 px-4">{totalOrders}</td>
                      <td className="text-right py-3 px-4">${totalRevenue.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">100%</td>
                      <td className="text-right py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">+{revenueGrowth}%</span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}