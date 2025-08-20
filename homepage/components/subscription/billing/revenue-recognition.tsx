'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  Download,
  Filter,
  PieChart,
  BarChart3,
  LineChart,
  Calculator,
  Banknote,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface RevenueMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
  currency: string;
}

interface RevenueCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  transactions: number;
  trend: 'up' | 'down' | 'stable';
}

interface FinancialEvent {
  id: string;
  type: 'payment' | 'refund' | 'chargeback' | 'adjustment' | 'tax';
  description: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  relatedSubscription?: string;
}

interface RevenueRecognitionProps {
  metrics?: RevenueMetric[];
  categories?: RevenueCategory[];
  events?: FinancialEvent[];
  onExportReport?: (type: string) => void;
  onViewDetails?: (category: string) => void;
  showCompliance?: boolean;
}

export function RevenueRecognition({
  metrics = [],
  categories = [],
  events = [],
  onExportReport,
  onViewDetails,
  showCompliance = true
}: RevenueRecognitionProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Sample metrics for demo
  const demoMetrics: RevenueMetric[] = metrics.length > 0 ? metrics : [
    {
      id: 'mrr',
      label: 'Monthly Recurring Revenue',
      value: 45678,
      change: 12.5,
      changeType: 'increase',
      period: 'vs last month',
      currency: 'USD'
    },
    {
      id: 'arr',
      label: 'Annual Recurring Revenue',
      value: 548136,
      change: 18.2,
      changeType: 'increase',
      period: 'vs last year',
      currency: 'USD'
    },
    {
      id: 'arpu',
      label: 'Average Revenue Per User',
      value: 42.50,
      change: 5.3,
      changeType: 'increase',
      period: 'vs last month',
      currency: 'USD'
    },
    {
      id: 'ltv',
      label: 'Customer Lifetime Value',
      value: 510,
      change: -2.1,
      changeType: 'decrease',
      period: 'vs last quarter',
      currency: 'USD'
    }
  ];

  // Sample categories for demo
  const demoCategories: RevenueCategory[] = categories.length > 0 ? categories : [
    {
      id: 'subscriptions',
      name: 'Subscription Revenue',
      amount: 38945,
      percentage: 85.2,
      transactions: 1298,
      trend: 'up'
    },
    {
      id: 'one_time',
      name: 'One-time Purchases',
      amount: 4523,
      percentage: 9.9,
      transactions: 156,
      trend: 'stable'
    },
    {
      id: 'upgrades',
      name: 'Plan Upgrades',
      amount: 1678,
      percentage: 3.7,
      transactions: 42,
      trend: 'up'
    },
    {
      id: 'addons',
      name: 'Add-on Services',
      amount: 532,
      percentage: 1.2,
      transactions: 28,
      trend: 'down'
    }
  ];

  // Sample events for demo
  const demoEvents: FinancialEvent[] = events.length > 0 ? events : [
    {
      id: 'evt_1',
      type: 'payment',
      description: 'Monthly subscription payment',
      amount: 29.99,
      date: new Date(currentTime - 2 * 60 * 60 * 1000),
      status: 'completed',
      relatedSubscription: 'sub_123'
    },
    {
      id: 'evt_2',
      type: 'refund',
      description: 'Partial refund for service issue',
      amount: -10.00,
      date: new Date(currentTime - 5 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: 'evt_3',
      type: 'payment',
      description: 'Annual plan payment',
      amount: 287.88,
      date: new Date(currentTime - 12 * 60 * 60 * 1000),
      status: 'completed',
      relatedSubscription: 'sub_456'
    },
    {
      id: 'evt_4',
      type: 'chargeback',
      description: 'Disputed transaction',
      amount: -29.99,
      date: new Date(currentTime - 24 * 60 * 60 * 1000),
      status: 'pending'
    },
    {
      id: 'evt_5',
      type: 'tax',
      description: 'Sales tax collection',
      amount: 2.45,
      date: new Date(currentTime - 36 * 60 * 60 * 1000),
      status: 'completed'
    }
  ];

  // Accrual and deferred revenue calculations
  const calculateAccrualMetrics = () => {
    const totalRevenue = demoCategories.reduce((sum, cat) => sum + cat.amount, 0);
    const recognizedRevenue = totalRevenue * 0.75; // 75% recognized
    const deferredRevenue = totalRevenue * 0.25; // 25% deferred
    const accruedRevenue = totalRevenue * 0.05; // 5% accrued
    
    return {
      total: totalRevenue,
      recognized: recognizedRevenue,
      deferred: deferredRevenue,
      accrued: accruedRevenue
    };
  };

  const accrualMetrics = calculateAccrualMetrics();

  // Get metric icon and color
  const getMetricDisplay = (metric: RevenueMetric) => {
    const isPositive = metric.changeType === 'increase';
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    
    return { Icon, color };
  };

  // Get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-green-100 text-green-700';
      case 'refund': return 'bg-orange-100 text-orange-700';
      case 'chargeback': return 'bg-red-100 text-red-700';
      case 'adjustment': return 'bg-blue-100 text-blue-700';
      case 'tax': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    const hours = Math.floor((currentTime - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoMetrics.map((metric) => {
          const { Icon, color } = getMetricDisplay(metric);
          
          return (
            <Card key={metric.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold mt-1">
                      {metric.currency === 'USD' ? formatCurrency(metric.value) : metric.value}
                    </p>
                    <div className={cn("flex items-center gap-1 mt-2", color)}>
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {Math.abs(metric.change)}%
                      </span>
                      <span className="text-xs text-gray-600">{metric.period}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Recognition Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Revenue Recognition Overview
            </CardTitle>
            <div className="flex gap-2">
              {['daily', 'weekly', 'monthly', 'quarterly'].map((period) => (
                <Button
                  key={period}
                  size="sm"
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod(period as any)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(accrualMetrics.total)}</p>
              <Progress value={100} className="h-2 mt-2" />
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Recognized Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(accrualMetrics.recognized)}
              </p>
              <Progress value={75} className="h-2 mt-2" />
              <p className="text-xs text-gray-500 mt-1">75% of total</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Deferred Revenue</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(accrualMetrics.deferred)}
              </p>
              <Progress value={25} className="h-2 mt-2" />
              <p className="text-xs text-gray-500 mt-1">25% of total</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Accrued Revenue</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(accrualMetrics.accrued)}
              </p>
              <Progress value={5} className="h-2 mt-2" />
              <p className="text-xs text-gray-500 mt-1">5% of total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Category */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Revenue by Category
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => onExportReport?.('categories')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demoCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all",
                  selectedCategory === category.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-purple-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{category.name}</h4>
                        {category.trend === 'up' && (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        )}
                        {category.trend === 'down' && (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {category.transactions} transactions
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold">{formatCurrency(category.amount)}</p>
                    <p className="text-sm text-gray-600">{category.percentage}% of total</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Progress value={category.percentage} className="h-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Financial Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Recent Financial Events
            </CardTitle>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    event.type === 'payment' ? "bg-green-100" :
                    event.type === 'refund' ? "bg-orange-100" :
                    event.type === 'chargeback' ? "bg-red-100" :
                    event.type === 'tax' ? "bg-purple-100" :
                    "bg-blue-100"
                  )}>
                    {event.type === 'payment' ? <CreditCard className="h-4 w-4 text-green-600" /> :
                     event.type === 'refund' ? <RefreshCw className="h-4 w-4 text-orange-600" /> :
                     event.type === 'chargeback' ? <AlertCircle className="h-4 w-4 text-red-600" /> :
                     event.type === 'tax' ? <Receipt className="h-4 w-4 text-purple-600" /> :
                     <DollarSign className="h-4 w-4 text-blue-600" />}
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm">{event.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={cn("text-xs", getEventTypeColor(event.type))}>
                        {event.type}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                      {event.relatedSubscription && (
                        <span className="text-xs text-gray-500">
                          • {event.relatedSubscription}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={cn(
                    "font-bold",
                    event.amount >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {event.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(event.amount))}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      event.status === 'completed' ? "text-green-600" :
                      event.status === 'pending' ? "text-yellow-600" :
                      "text-red-600"
                    )}
                  >
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Reporting */}
      {showCompliance && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Compliance & Reporting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium">Tax Compliance</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  All tax obligations are current and compliant
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  View Tax Report
                </Button>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Financial Reports</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Generate P&L, balance sheet, and cash flow
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Generate Reports
                </Button>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <LineChart className="h-5 w-5 text-purple-600" />
                  <h4 className="font-medium">Revenue Forecast</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Projected revenue for next quarter
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  View Forecast
                </Button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-green-700" />
                <p className="text-sm text-green-800">
                  All financial records are compliant with GAAP standards and ready for audit
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}