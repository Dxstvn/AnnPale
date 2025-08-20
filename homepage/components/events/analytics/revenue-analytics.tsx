'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  CreditCard,
  Gift,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar
} from 'lucide-react';
import {
  LineChart,
  Line,
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
  Legend,
  ResponsiveContainer
} from 'recharts';
import { cn } from '@/lib/utils';

interface RevenueData {
  totalRevenue: number;
  netRevenue: number;
  ticketsSold: number;
  avgTicketPrice: number;
  refunds: number;
  refundRate: number;
  platformFees: number;
  paymentFees: number;
}

interface TierBreakdown {
  tier: string;
  tickets: number;
  revenue: number;
  percentage: number;
  avgPrice: number;
}

interface PromoImpact {
  code: string;
  uses: number;
  discount: number;
  lostRevenue: number;
  conversions: number;
}

interface SalesTimeline {
  date: string;
  sales: number;
  revenue: number;
  cumulative: number;
}

interface RevenueAnalyticsProps {
  eventId: string;
  eventTitle: string;
  revenueData: RevenueData;
  tierBreakdown: TierBreakdown[];
  promoImpact: PromoImpact[];
  salesTimeline: SalesTimeline[];
  onExportReport?: () => void;
  onViewDetails?: (section: string) => void;
}

export function RevenueAnalytics({
  eventId,
  eventTitle,
  revenueData,
  tierBreakdown,
  promoImpact,
  salesTimeline,
  onExportReport,
  onViewDetails
}: RevenueAnalyticsProps) {
  // Calculate additional metrics
  const profitMargin = ((revenueData.netRevenue / revenueData.totalRevenue) * 100).toFixed(1);
  const totalFees = revenueData.platformFees + revenueData.paymentFees;
  const feesPercentage = ((totalFees / revenueData.totalRevenue) * 100).toFixed(1);
  
  // Calculate total discount impact
  const totalDiscountImpact = promoImpact.reduce((sum, promo) => sum + promo.lostRevenue, 0);
  const totalPromoConversions = promoImpact.reduce((sum, promo) => sum + promo.conversions, 0);

  // Colors for charts
  const COLORS = ['#9333EA', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Revenue breakdown for pie chart
  const revenueBreakdownData = [
    { name: 'Net Revenue', value: revenueData.netRevenue, color: '#10B981' },
    { name: 'Platform Fees', value: revenueData.platformFees, color: '#3B82F6' },
    { name: 'Payment Fees', value: revenueData.paymentFees, color: '#F59E0B' },
    { name: 'Refunds', value: revenueData.refunds, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(revenueData.totalRevenue)}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +23% vs last event
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(revenueData.netRevenue)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {profitMargin}% margin
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tickets Sold</p>
                <p className="text-2xl font-bold">{revenueData.ticketsSold}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(revenueData.avgTicketPrice)} avg
                </p>
              </div>
              <Tag className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Refunds</p>
                <p className="text-2xl font-bold">{formatCurrency(revenueData.refunds)}</p>
                <p className={cn(
                  "text-xs mt-1",
                  revenueData.refundRate > 5 ? "text-red-600" : "text-gray-500"
                )}>
                  {revenueData.refundRate}% rate
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Sales Timeline & Cumulative Revenue</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onViewDetails?.('timeline')}>
              <Calendar className="h-4 w-4 mr-2" />
              Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Legend />
              <Bar yAxisId="left" dataKey="sales" fill="#9333EA" name="Daily Sales" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Cumulative Revenue"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Tier */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue by Ticket Tier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tierBreakdown} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="tier" type="category" />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#9333EA" />
              </BarChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {tierBreakdown.map((tier, index) => (
                <div key={tier.tier} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <p className="font-medium">{tier.tier}</p>
                      <p className="text-sm text-gray-600">
                        {tier.tickets} tickets • {formatCurrency(tier.avgPrice)} avg
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(tier.revenue)}</p>
                    <p className="text-sm text-gray-600">{tier.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotional Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Promotional Code Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Gift className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-lg font-bold">{promoImpact.length}</p>
                <p className="text-xs text-gray-600">Active Codes</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <Tag className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                <p className="text-lg font-bold">{formatCurrency(totalDiscountImpact)}</p>
                <p className="text-xs text-gray-600">Total Discounts</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold">{totalPromoConversions}</p>
                <p className="text-xs text-gray-600">Conversions</p>
              </div>
            </div>

            <div className="space-y-2">
              {promoImpact.map((promo) => (
                <div key={promo.code} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium text-sm">{promo.code}</p>
                    <p className="text-xs text-gray-600">
                      {promo.uses} uses • {promo.discount}% off
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      -{formatCurrency(promo.lostRevenue)}
                    </p>
                    <p className="text-xs text-green-600">
                      +{promo.conversions} sales
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fee Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={revenueBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2 mt-4">
              {revenueBreakdownData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Revenue Growth</span>
                </div>
                <span className="text-lg font-bold text-green-600">+23%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Profit Margin</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{profitMargin}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Avg Ticket Value</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(revenueData.avgTicketPrice)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Total Fees</span>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {feesPercentage}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Insights */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {revenueData.refundRate > 5 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-900">
                  Refund rate is above 5%. Review event quality and description accuracy to reduce refunds.
                </AlertDescription>
              </Alert>
            )}
            {profitMargin > 70 && (
              <Alert className="border-green-200 bg-green-50">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900">
                  Excellent profit margin! Consider premium pricing for future events.
                </AlertDescription>
              </Alert>
            )}
            {totalPromoConversions > revenueData.ticketsSold * 0.2 && (
              <Alert className="border-blue-200 bg-blue-50">
                <Gift className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  Promotional codes drove {((totalPromoConversions / revenueData.ticketsSold) * 100).toFixed(0)}% of sales. 
                  Continue using targeted promotions.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={onExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Financial Report
        </Button>
      </div>
    </div>
  );
}