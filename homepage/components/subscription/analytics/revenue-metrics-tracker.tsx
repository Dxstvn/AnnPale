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
  Calculator,
  Target,
  PieChart,
  BarChart3,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Calendar,
  Users,
  CreditCard,
  Wallet,
  Banknote,
  Coins,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface RevenueMetric {
  id: string;
  name: string;
  value: number;
  formattedValue: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
  icon: React.ElementType;
  color: string;
  description: string;
  target?: number;
  benchmark?: number;
  formula?: string;
  insights?: string[];
}

interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
  change: number;
  color: string;
}

interface RevenueForecasting {
  period: string;
  conservative: number;
  realistic: number;
  optimistic: number;
  confidence: number;
}

interface RevenueMetricsTrackerProps {
  metrics?: RevenueMetric[];
  breakdown?: RevenueBreakdown[];
  forecasting?: RevenueForecasting[];
  timeRange?: string;
  onMetricClick?: (metricId: string) => void;
  onTimeRangeChange?: (range: string) => void;
  showForecasting?: boolean;
  showBreakdown?: boolean;
}

export function RevenueMetricsTracker({
  metrics = [],
  breakdown = [],
  forecasting = [],
  timeRange = '30d',
  onMetricClick,
  onTimeRangeChange,
  showForecasting = true,
  showBreakdown = true
}: RevenueMetricsTrackerProps) {
  const [expandedMetric, setExpandedMetric] = React.useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = React.useState(timeRange);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Default revenue metrics based on specification
  const defaultMetrics: RevenueMetric[] = metrics.length > 0 ? metrics : [
    {
      id: 'mrr',
      name: 'Monthly Recurring Revenue',
      value: 12450,
      formattedValue: '$12,450',
      change: 12.5,
      changeType: 'increase',
      period: 'vs last month',
      icon: DollarSign,
      color: 'text-green-600',
      description: 'Predictable monthly revenue from active subscriptions',
      target: 15000,
      benchmark: 10000,
      formula: 'Sum of all monthly subscription fees',
      insights: [
        'Strong growth driven by new Bronze tier subscribers',
        'Silver tier showing highest retention rates',
        'Upsell campaigns contributing 18% of growth'
      ]
    },
    {
      id: 'arr',
      name: 'Annual Recurring Revenue',
      value: 149400,
      formattedValue: '$149,400',
      change: 8.3,
      changeType: 'increase',
      period: 'vs last year',
      icon: Calendar,
      color: 'text-blue-600',
      description: 'Projected annual revenue based on current subscriptions',
      target: 200000,
      benchmark: 120000,
      formula: 'MRR × 12',
      insights: [
        'On track to exceed annual target by Q3',
        'Year-over-year growth accelerating',
        'Q2 performance 23% above projections'
      ]
    },
    {
      id: 'arpu',
      name: 'Average Revenue Per User',
      value: 24.15,
      formattedValue: '$24.15',
      change: -2.1,
      changeType: 'decrease',
      period: 'vs last month',
      icon: Users,
      color: 'text-purple-600',
      description: 'Average monthly revenue generated per active subscriber',
      target: 28.00,
      benchmark: 22.00,
      formula: 'Total Revenue ÷ Number of Active Users',
      insights: [
        'Slight decline due to Bronze tier growth',
        'Gold tier ARPU increased 15%',
        'Focus on upselling Bronze to Silver'
      ]
    },
    {
      id: 'ltv',
      name: 'Customer Lifetime Value',
      value: 186.40,
      formattedValue: '$186.40',
      change: 5.7,
      changeType: 'increase',
      period: 'vs last quarter',
      icon: Target,
      color: 'text-orange-600',
      description: 'Predicted total revenue from average customer relationship',
      target: 220.00,
      benchmark: 150.00,
      formula: 'ARPU ÷ Churn Rate × Gross Margin',
      insights: [
        'Improved retention driving LTV gains',
        'Gold tier LTV 3x higher than Bronze',
        'Churn reduction initiatives showing results'
      ]
    },
    {
      id: 'cac',
      name: 'Customer Acquisition Cost',
      value: 32.50,
      formattedValue: '$32.50',
      change: -8.2,
      changeType: 'decrease',
      period: 'vs last month',
      icon: Calculator,
      color: 'text-pink-600',
      description: 'Average cost to acquire a new subscriber',
      target: 25.00,
      benchmark: 40.00,
      formula: 'Total Marketing Spend ÷ New Customers Acquired',
      insights: [
        'Improved targeting reducing acquisition costs',
        'Organic referrals increasing',
        'Social media campaigns most efficient'
      ]
    },
    {
      id: 'ltv_cac_ratio',
      name: 'LTV:CAC Ratio',
      value: 5.74,
      formattedValue: '5.7:1',
      change: 15.2,
      changeType: 'increase',
      period: 'vs last quarter',
      icon: BarChart3,
      color: 'text-indigo-600',
      description: 'Ratio of lifetime value to acquisition cost',
      target: 6.0,
      benchmark: 3.0,
      formula: 'LTV ÷ CAC',
      insights: [
        'Excellent ratio indicating sustainable growth',
        'Above industry benchmark of 3:1',
        'Room for increased marketing investment'
      ]
    }
  ];

  // Default revenue breakdown
  const defaultBreakdown: RevenueBreakdown[] = breakdown.length > 0 ? breakdown : [
    {
      category: 'Bronze Tier',
      amount: 4980,
      percentage: 40,
      change: 25.3,
      color: 'text-amber-600'
    },
    {
      category: 'Silver Tier',
      amount: 5980,
      percentage: 48,
      change: 8.7,
      color: 'text-slate-600'
    },
    {
      category: 'Gold Tier',
      amount: 1490,
      percentage: 12,
      change: -2.1,
      color: 'text-yellow-600'
    }
  ];

  // Default forecasting data
  const defaultForecasting: RevenueForecasting[] = forecasting.length > 0 ? forecasting : [
    {
      period: 'Next Month',
      conservative: 13200,
      realistic: 14100,
      optimistic: 15300,
      confidence: 85
    },
    {
      period: 'Next Quarter',
      conservative: 42000,
      realistic: 47000,
      optimistic: 52000,
      confidence: 75
    },
    {
      period: 'Next Year',
      conservative: 180000,
      realistic: 210000,
      optimistic: 250000,
      confidence: 60
    }
  ];

  // Get change icon
  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return ArrowUpRight;
      case 'decrease': return ArrowDownRight;
      default: return Minus;
    }
  };

  // Get change color
  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get performance status
  const getPerformanceStatus = (value: number, target?: number, benchmark?: number) => {
    if (!target && !benchmark) return 'neutral';
    
    const referenceValue = target || benchmark;
    if (!referenceValue) return 'neutral';
    
    const performance = (value / referenceValue) * 100;
    
    if (performance >= 90) return 'excellent';
    if (performance >= 70) return 'good';
    if (performance >= 50) return 'average';
    return 'poor';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Calculate total revenue
  const totalRevenue = defaultBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Metrics Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total MRR</p>
              <p className="text-2xl font-bold text-green-600">
                {defaultMetrics.find(m => m.id === 'mrr')?.formattedValue}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                +{defaultMetrics.find(m => m.id === 'mrr')?.change}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">LTV:CAC Ratio</p>
              <p className="text-2xl font-bold text-purple-600">
                {defaultMetrics.find(m => m.id === 'ltv_cac_ratio')?.formattedValue}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Active Metrics</p>
              <p className="text-2xl font-bold">{defaultMetrics.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Revenue Metrics */}
      <div className="grid md:grid-cols-2 gap-4">
        {defaultMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const ChangeIcon = getChangeIcon(metric.changeType);
          const isExpanded = expandedMetric === metric.id;
          const status = getPerformanceStatus(metric.value, metric.target, metric.benchmark);
          const progressPercentage = metric.target ? Math.min((metric.value / metric.target) * 100, 100) : null;

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="transition-all cursor-pointer hover:shadow-md">
                <CardHeader 
                  onClick={() => {
                    setExpandedMetric(isExpanded ? null : metric.id);
                    onMetricClick?.(metric.id);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        "bg-gray-100"
                      )}>
                        <Icon className={cn("h-5 w-5", metric.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{metric.name}</CardTitle>
                        <p className="text-sm text-gray-600">{metric.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", getStatusColor(status))}>
                        {status}
                      </Badge>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">{metric.formattedValue}</div>
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        getChangeColor(metric.changeType)
                      )}>
                        <ChangeIcon className="h-4 w-4" />
                        <span>{Math.abs(metric.change)}%</span>
                        <span className="text-gray-500">{metric.period}</span>
                      </div>
                    </div>

                    {/* Progress to Target */}
                    {progressPercentage && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress to target</span>
                          <span className="font-medium">{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Current: {metric.formattedValue}</span>
                          <span>Target: ${metric.target?.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-4"
                        >
                          {/* Formula */}
                          {metric.formula && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-1">Formula:</p>
                              <p className="text-sm text-gray-600 font-mono">{metric.formula}</p>
                            </div>
                          )}

                          {/* Benchmarks */}
                          <div className="grid grid-cols-2 gap-4">
                            {metric.target && (
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-600">Target</p>
                                <p className="text-lg font-bold text-blue-600">
                                  ${metric.target.toLocaleString()}
                                </p>
                              </div>
                            )}
                            {metric.benchmark && (
                              <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <p className="text-sm text-gray-600">Benchmark</p>
                                <p className="text-lg font-bold text-purple-600">
                                  ${metric.benchmark.toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Insights */}
                          {metric.insights && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Key Insights:</p>
                              <ul className="space-y-1">
                                {metric.insights.map((insight, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                    <Info className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Breakdown */}
      {showBreakdown && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Revenue by Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {defaultBreakdown.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">${item.amount.toLocaleString()}</span>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            item.change > 0 ? "text-green-600" : "text-red-600"
                          )}
                        >
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={item.percentage} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{item.percentage}% of total revenue</span>
                        <span className={item.color}>●</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Revenue Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Revenue Growth</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">Healthy</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Target Progress</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">83%</p>
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Attention Needed</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    ARPU slightly declining due to Bronze tier growth. Consider upselling strategies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Revenue Forecasting */}
      {showForecasting && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Forecasting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {defaultForecasting.map((forecast, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{forecast.period}</h4>
                    <Badge variant="outline" className="text-xs">
                      {forecast.confidence}% confidence
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">Conservative</p>
                      <p className="text-lg font-bold text-red-600">
                        ${forecast.conservative.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Realistic</p>
                      <p className="text-lg font-bold text-blue-600">
                        ${forecast.realistic.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Optimistic</p>
                      <p className="text-lg font-bold text-green-600">
                        ${forecast.optimistic.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <Progress value={forecast.confidence} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}