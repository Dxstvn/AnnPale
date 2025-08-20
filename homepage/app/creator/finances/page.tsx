"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Download,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Plus,
  ChevronRight,
  Receipt,
  BanknoteIcon,
  Shield,
  TrendingDown
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Currency formatter based on locale
const formatCurrency = (amount: number, locale: string = 'en') => {
  const currency = locale === 'ht' ? 'HTG' : locale === 'fr' ? 'EUR' : 'USD'
  const formatter = new Intl.NumberFormat(locale === 'ht' ? 'ht-HT' : locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: currency,
  })
  return formatter.format(amount)
}

// Translations
const financesTranslations: Record<string, Record<string, string>> = {
  financial_center: {
    en: "Financial Center",
    fr: "Centre financier",
    ht: "Sant finansye"
  },
  manage_earnings: {
    en: "Manage your earnings and financial operations",
    fr: "Gérez vos revenus et opérations financières",
    ht: "Jere kòb ou fè ak operasyon finansye ou"
  },
  available_balance: {
    en: "Available Balance",
    fr: "Solde disponible",
    ht: "Balans disponib"
  },
  pending_clearance: {
    en: "Pending Clearance",
    fr: "En attente de compensation",
    ht: "K ap tann klarans"
  },
  this_month: {
    en: "This Month",
    fr: "Ce mois",
    ht: "Mwa sa a"
  },
  lifetime_earnings: {
    en: "Lifetime Earnings",
    fr: "Revenus totaux",
    ht: "Total kòb ou fè"
  },
  overview: {
    en: "Overview",
    fr: "Aperçu",
    ht: "Apèsi"
  },
  transactions: {
    en: "Transactions",
    fr: "Transactions",
    ht: "Tranzaksyon"
  },
  payouts: {
    en: "Payouts",
    fr: "Paiements",
    ht: "Peman"
  },
  payment_methods: {
    en: "Payment Methods",
    fr: "Méthodes de paiement",
    ht: "Metòd peman"
  },
  withdraw_funds: {
    en: "Withdraw Funds",
    fr: "Retirer des fonds",
    ht: "Retire kòb"
  },
  view_all: {
    en: "View All",
    fr: "Voir tout",
    ht: "Gade tout"
  },
  recent_transactions: {
    en: "Recent Transactions",
    fr: "Transactions récentes",
    ht: "Dènye tranzaksyon"
  },
  next_payout: {
    en: "Next Payout",
    fr: "Prochain paiement",
    ht: "Pwochèn peman"
  },
  quick_actions: {
    en: "Quick Actions",
    fr: "Actions rapides",
    ht: "Aksyon rapid"
  },
  view_tax_documents: {
    en: "View Tax Documents",
    fr: "Voir les documents fiscaux",
    ht: "Gade dokiman taks"
  },
  generate_invoice: {
    en: "Generate Invoice",
    fr: "Générer une facture",
    ht: "Jenere fakti"
  },
  payout_history: {
    en: "Payout History",
    fr: "Historique des paiements",
    ht: "Istwa peman"
  },
  earnings_breakdown: {
    en: "Earnings Breakdown",
    fr: "Répartition des revenus",
    ht: "Detay kòb ou fè"
  }
}

// Mock data
const mockEarnings = {
  availableBalance: 1875.50,
  pendingClearance: 420.75,
  thisMonthTotal: 2840.25,
  lastMonthTotal: 2450.00,
  totalLifetime: 18750.00,
  nextPayoutDate: "2024-12-15",
  lastUpdate: new Date().toISOString()
}

const mockTransactions = [
  {
    id: '1',
    type: 'earning' as const,
    amount: 85.00,
    description: 'Birthday message for Sarah',
    customer: 'Sarah M.',
    status: 'completed' as const,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'Birthday'
  },
  {
    id: '2',
    type: 'earning' as const,
    amount: 120.00,
    description: 'Wedding congratulations',
    customer: 'Michael R.',
    status: 'completed' as const,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    category: 'Wedding'
  },
  {
    id: '3',
    type: 'payout' as const,
    amount: 500.00,
    description: 'Weekly payout to Chase ****1234',
    status: 'processing' as const,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    fee: 12.50
  },
  {
    id: '4',
    type: 'earning' as const,
    amount: 95.00,
    description: 'Holiday greetings',
    customer: 'Lisa K.',
    status: 'completed' as const,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    category: 'Holiday'
  },
  {
    id: '5',
    type: 'refund' as const,
    amount: 75.00,
    description: 'Refund for canceled order',
    customer: 'John D.',
    status: 'completed' as const,
    date: new Date(Date.now() - 48 * 60 * 60 * 1000),
    orderId: '#ORD-2024-0892'
  }
]

const mockPaymentMethods = [
  {
    id: '1',
    type: 'bank' as const,
    name: 'Chase Checking',
    details: '****1234',
    description: 'Primary bank account',
    isDefault: true,
    isVerified: true,
    icon: BanknoteIcon
  },
  {
    id: '2',
    type: 'card' as const,
    name: 'Visa Debit',
    details: '****5678',
    description: 'Instant withdrawal',
    isDefault: false,
    isVerified: true,
    icon: CreditCard
  },
  {
    id: '3',
    type: 'paypal' as const,
    name: 'PayPal',
    details: 'creator@email.com',
    description: 'PayPal account',
    isDefault: false,
    isVerified: true,
    icon: Wallet
  }
]

const mockPayoutHistory = [
  { id: '1', date: '2024-12-08', amount: 500.00, method: 'Chase ****1234', status: 'completed' as const },
  { id: '2', date: '2024-12-01', amount: 650.00, method: 'Chase ****1234', status: 'completed' as const },
  { id: '3', date: '2024-11-24', amount: 420.00, method: 'PayPal', status: 'completed' as const },
  { id: '4', date: '2024-11-17', amount: 380.00, method: 'Chase ****1234', status: 'completed' as const },
]

const earningsBreakdown = [
  { category: 'Birthday', amount: 890, percentage: 35, count: 12 },
  { category: 'Anniversary', amount: 640, percentage: 25, count: 8 },
  { category: 'Graduation', amount: 510, percentage: 20, count: 6 },
  { category: 'Holiday', amount: 380, percentage: 15, count: 5 },
  { category: 'Other', amount: 130, percentage: 5, count: 2 },
]

export default function CreatorFinancesPage() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("this_month")
  
  const t = (key: string) => {
    return financesTranslations[key]?.[language] || financesTranslations[key]?.en || key
  }
  
  const monthGrowth = ((mockEarnings.thisMonthTotal - mockEarnings.lastMonthTotal) / mockEarnings.lastMonthTotal * 100).toFixed(1)
  
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Completed", className: "bg-green-500 text-white" },
      processing: { label: "Processing", className: "bg-blue-500 text-white" },
      pending: { label: "Pending", className: "bg-orange-500 text-white" },
      failed: { label: "Failed", className: "bg-red-500 text-white" }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return config ? <Badge className={config.className}>{config.label}</Badge> : null
  }
  
  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'earning':
        return <ArrowDownRight className="h-4 w-4 text-green-600" />
      case 'payout':
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />
      case 'refund':
        return <RefreshCw className="h-4 w-4 text-orange-600" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }
  
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('financial_center')}</h1>
            <p className="text-gray-600 mt-1">{t('manage_earnings')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="year_to_date">Year to Date</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              {t('withdraw_funds')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('available_balance')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(mockEarnings.availableBalance, language)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ready to withdraw</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('pending_clearance')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(mockEarnings.pendingClearance, language)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Clearing in 2-3 days</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('this_month')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(mockEarnings.thisMonthTotal, language)}
              </p>
              <div className="flex items-center mt-1">
                {Number(monthGrowth) > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">+{monthGrowth}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    <span className="text-xs text-red-600">{monthGrowth}%</span>
                  </>
                )}
                <span className="text-xs text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('lifetime_earnings')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(mockEarnings.totalLifetime, language)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Since joining</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t('quick_actions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/creator/finances/payouts">
              <Button variant="outline" className="w-full justify-between group">
                <span className="flex items-center">
                  <BanknoteIcon className="h-4 w-4 mr-2" />
                  Manage Payouts
                </span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/creator/finances/tax">
              <Button variant="outline" className="w-full justify-between group">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('view_tax_documents')}
                </span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/creator/finances/invoices">
              <Button variant="outline" className="w-full justify-between group">
                <span className="flex items-center">
                  <Receipt className="h-4 w-4 mr-2" />
                  {t('generate_invoice')}
                </span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-between group">
              <span className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('transactions')}</TabsTrigger>
          <TabsTrigger value="payouts">{t('payout_history')}</TabsTrigger>
          <TabsTrigger value="methods">{t('payment_methods')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('recent_transactions')}</CardTitle>
                  <Link href="/creator/finances/transactions">
                    <Button variant="ghost" size="sm">
                      {t('view_all')}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {transaction.customer && `${transaction.customer} • `}
                            {format(transaction.date, 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-bold",
                          transaction.type === 'earning' ? 'text-green-600' : 
                          transaction.type === 'refund' ? 'text-orange-600' : 'text-gray-900'
                        )}>
                          {transaction.type === 'earning' ? '+' : '-'}
                          {formatCurrency(transaction.amount, language)}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Earnings Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>{t('earnings_breakdown')}</CardTitle>
                <CardDescription>By message category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsBreakdown.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            index === 0 ? "bg-purple-500" :
                            index === 1 ? "bg-pink-500" :
                            index === 2 ? "bg-blue-500" :
                            index === 3 ? "bg-green-500" : "bg-gray-500"
                          )} />
                          <span className="font-medium text-sm">{category.category}</span>
                          <span className="text-xs text-gray-500">({category.count} videos)</span>
                        </div>
                        <span className="font-bold">{formatCurrency(category.amount, language)}</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(earningsBreakdown.reduce((sum, c) => sum + c.amount, 0), language)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Next Payout */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('next_payout')}</CardTitle>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(mockEarnings.nextPayoutDate), 'EEEE, MMM d')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated payout amount</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(mockEarnings.availableBalance, language)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Payout method</p>
                  <p className="font-medium">Chase ****1234</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4" />
                <span>Payouts are processed weekly on Fridays. Minimum payout amount is {formatCurrency(50, language)}.</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Transactions</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {transaction.customer && (
                            <span className="text-sm text-gray-500">{transaction.customer}</span>
                          )}
                          {transaction.category && (
                            <Badge variant="secondary" className="text-xs">{transaction.category}</Badge>
                          )}
                          {transaction.orderId && (
                            <span className="text-xs text-gray-500">{transaction.orderId}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-bold text-lg",
                        transaction.type === 'earning' ? 'text-green-600' : 
                        transaction.type === 'refund' ? 'text-orange-600' : 'text-gray-900'
                      )}>
                        {transaction.type === 'earning' ? '+' : '-'}
                        {formatCurrency(transaction.amount, language)}
                      </p>
                      {transaction.fee && (
                        <p className="text-xs text-gray-500">Fee: {formatCurrency(transaction.fee, language)}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {format(transaction.date, 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('payout_history')}</CardTitle>
                <Link href="/creator/finances/payouts">
                  <Button variant="outline" size="sm">
                    Manage Payouts
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPayoutHistory.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BanknoteIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Payout to {payout.method}</p>
                        <p className="text-sm text-gray-500">{format(new Date(payout.date), 'MMMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(payout.amount, language)}</p>
                      {getStatusBadge(payout.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="methods" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('payment_methods')}</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPaymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <div key={method.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{method.name}</p>
                            {method.isDefault && (
                              <Badge variant="secondary" className="text-xs">Default</Badge>
                            )}
                            {method.isVerified && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{method.details} • {method.description}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}