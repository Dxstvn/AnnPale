"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
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
  Crown,
  Star,
  UserCheck,
  AlertCircle,
  Loader2,
  RefreshCw
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { useLanguage } from "@/contexts/language-context"
import { useCreatorAnalytics } from "@/hooks/use-creator-analytics"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import type { AnalyticsPeriod, ExportDataRequest } from "@/types/analytics"

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
  last_90_days: {
    en: "Last 90 Days",
    fr: "90 derniers jours",
    ht: "90 dènye jou"
  },
  last_year: {
    en: "Last Year",
    fr: "Année passée",
    ht: "Ane pase"
  },
  no_data_available: {
    en: "No data available",
    fr: "Aucune donnée disponible",
    ht: "Pa gen done"
  },
  failed_to_load: {
    en: "Failed to load analytics data",
    fr: "Échec du chargement des données",
    ht: "Pa ka chaje done yo"
  }
}

// Chart colors for occasion breakdown
const COLORS = {
  birthday: '#9333EA',
  anniversary: '#EC4899', 
  graduation: '#F59E0B',
  holiday: '#10B981',
  custom: '#3B82F6',
  other: '#6B7280'
}

export default function RevenueAnalyticsPage() {
  const { language } = useLanguage()
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d')
  const [activeTab, setActiveTab] = useState("overview")
  const [exporting, setExporting] = useState<'csv' | 'json' | null>(null)
  
  // Get analytics data using our hook
  const { data, loading, error, refetch, exportData, updateFilters } = useCreatorAnalytics({
    period,
    includeSubscriptions: true
  })
  
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
  
  const handlePeriodChange = (newPeriod: AnalyticsPeriod) => {
    setPeriod(newPeriod)
    updateFilters({ period: newPeriod })
  }
  
  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(format)
    try {
      const exportRequest: ExportDataRequest = {
        format,
        filters: { period, includeSubscriptions: true },
        includeDetails: true
      }
      
      await exportData(exportRequest)
      
      toast({
        title: "Export successful",
        description: `Analytics data exported as ${format.toUpperCase()}`
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive"
      })
    } finally {
      setExporting(null)
    }
  }

  // Format revenue display
  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Format percentage display
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  // Render loading skeleton
  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{t('failed_to_load')}: {error}</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Render no data state
  if (!data || (!data.totalRevenue && !data.totalOrders)) {
    return (
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('revenue_analytics')}</h1>
          <p className="text-gray-600 mt-1">{t('track_earnings')}</p>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <DollarSign className="h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('no_data_available')}
                </h3>
                <p className="text-gray-500">
                  Complete your first video request to see analytics data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[180px] border-purple-200 bg-white/95 backdrop-blur-sm hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">{t('last_7_days')}</SelectItem>
                <SelectItem value="30d">{t('last_30_days')}</SelectItem>
                <SelectItem value="90d">{t('last_90_days')}</SelectItem>
                <SelectItem value="1y">{t('last_year')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              disabled={exporting === 'csv'}
              className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white hover:shadow-md hover:translate-y-[-2px] transition-all"
            >
              {exporting === 'csv' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              CSV
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:translate-y-[-2px] transition-all"
              onClick={() => handleExport('json')}
              disabled={exporting === 'json'}
            >
              {exporting === 'json' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              {t('export_data')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-xl hover:border-purple-300 cursor-pointer transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('total_revenue')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatRevenue(data.totalRevenue)}
              </p>
              <div className="flex items-center mt-2">
                {data.revenueGrowth > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={cn(
                  "text-sm",
                  data.revenueGrowth > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {formatPercentage(data.revenueGrowth)}
                </span>
                <span className="text-xs text-gray-500 ml-1">{t('this_month')}</span>
              </div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl hover:border-purple-300 cursor-pointer transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('total_orders')}</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalOrders}</p>
              <div className="flex items-center mt-2">
                <Package className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-gray-500">
                  {data.monthlyStats.thisMonth.orders} {t('this_month')}
                </span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-xl hover:border-purple-300 cursor-pointer transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.totalSubscribers || 0}
              </p>
              <div className="flex items-center mt-2">
                <Users className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm text-purple-600">
                  {data.activeSubscribers || 0} active
                </span>
                <span className="text-xs text-gray-500 ml-1">subscribers</span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:shadow-xl hover:border-purple-300 cursor-pointer transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Recurring Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatRevenue(data.monthlyRecurringRevenue || 0)}
              </p>
              <div className="flex items-center mt-2">
                {data.subscriptionGrowth > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm ${data.subscriptionGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(data.subscriptionGrowth || 0)}
                </span>
                <span className="text-xs text-gray-500 ml-1">growth</span>
              </div>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-orange-600" />
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
          <Card className="border-purple-100 hover:shadow-xl hover:border-purple-300 cursor-pointer transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 group-hover:text-purple-600 transition-colors">
                {t('daily_revenue')}
              </CardTitle>
              <CardDescription>Revenue trend over the past {period}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.dailyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280" 
                    fontSize={12}
                    tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                  />
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
            <Card className="border-purple-100 hover:shadow-xl hover:border-purple-300 cursor-pointer transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-gray-900 group-hover:text-purple-600 transition-colors">
                  {t('monthly_revenue')}
                </CardTitle>
                <CardDescription>Monthly revenue comparison</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="#9333EA" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="border-purple-100 hover:shadow-xl hover:border-purple-300 cursor-pointer transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-gray-900 group-hover:text-purple-600 transition-colors">
                  {t('revenue_by_category')}
                </CardTitle>
                <CardDescription>Distribution across message types</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.occasionBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ occasion, percentage }) => `${occasion}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {data.occasionBreakdown.map((entry) => (
                        <Cell 
                          key={entry.occasion} 
                          fill={COLORS[entry.occasion] || COLORS.other}
                          stroke="#fff"
                          strokeWidth={2}
                        />
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
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Customers Card */}
            <Card className="border-purple-100 hover:shadow-xl hover:border-purple-300 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      Top Customers
                    </CardTitle>
                    <CardDescription>Customers with most completed video requests</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    <Star className="h-3 w-3 mr-1" />
                    VIP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topCustomers && data.topCustomers.length > 0 ? (
                    data.topCustomers.map((customer, index) => (
                      <div key={customer.customerId} className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={customer.avatarUrl} alt={customer.customerName} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                {customer.customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {index === 0 && (
                              <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{customer.customerName}</p>
                            <p className="text-xs text-gray-500">{customer.totalOrders} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-purple-600">{formatRevenue(customer.totalRevenue)}</p>
                          <p className="text-xs text-gray-500">Avg: {formatRevenue(customer.avgOrderValue)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No customer data available yet</p>
                      <p className="text-xs mt-1">Complete orders to see top customers</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Loyal Subscribers Card */}
            <Card className="border-purple-100 hover:shadow-xl hover:border-purple-300 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-green-500" />
                      Loyal Subscribers
                    </CardTitle>
                    <CardDescription>Longest active subscription holders</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Loyal
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.loyalSubscribers && data.loyalSubscribers.length > 0 ? (
                    data.loyalSubscribers.map((subscriber, index) => (
                      <div key={subscriber.customerId} className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={subscriber.avatarUrl} alt={subscriber.customerName} />
                              <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                                {subscriber.customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {subscriber.subscriptionDuration > 365 && (
                              <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{subscriber.customerName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                {subscriber.tierName}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {Math.floor(subscriber.subscriptionDuration / 30)} months
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-green-600">{formatRevenue(subscriber.totalRevenue)}</p>
                          <p className="text-xs text-gray-500">{formatRevenue(subscriber.tierPrice)}/mo</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <UserCheck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No subscriber data available yet</p>
                      <p className="text-xs mt-1">Get subscribers to see loyalty metrics</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="breakdown" className="space-y-6">
          {/* Period Comparison */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Period Comparison</CardTitle>
                <CardDescription>Current vs previous period performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Current Period</p>
                    <p className="text-sm text-gray-500">{data.startDate} to {data.endDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatRevenue(data.totalRevenue)}</p>
                    <p className="text-sm text-gray-500">{data.totalOrders} orders</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Previous Period</p>
                    <p className="text-sm text-gray-500">Comparable timeframe</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatRevenue(data.monthlyStats.lastMonth.revenue)}</p>
                    <p className="text-sm text-gray-500">{data.monthlyStats.lastMonth.orders} orders</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                  <div>
                    <p className="font-medium">Growth</p>
                    <p className="text-sm text-gray-500">Revenue & Order Growth</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-bold",
                      data.revenueGrowth > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatPercentage(data.revenueGrowth)}
                    </p>
                    <p className={cn(
                      "text-sm",
                      data.orderGrowth > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatPercentage(data.orderGrowth)} orders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics Summary</CardTitle>
                <CardDescription>Important performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.occasionBreakdown.length}
                    </div>
                    <div className="text-sm text-gray-600">Active Categories</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatRevenue(data.avgOrderValue)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Order Value</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {data.totalOrders > 0 ? Math.round(data.totalRevenue / data.totalOrders * 100) / 100 : 0}
                    </div>
                    <div className="text-sm text-gray-600">Revenue per Order</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {data.occasionBreakdown.length > 0 ? 
                        data.occasionBreakdown.reduce((max, curr) => 
                          curr.percentage > max.percentage ? curr : max
                        ).occasion.toUpperCase() : 'N/A'
                      }
                    </div>
                    <div className="text-sm text-gray-600">Top Category</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}