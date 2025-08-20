'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Gift,
  Users,
  Calendar,
  ShoppingCart,
  Tag,
  CreditCard,
  Info,
  Calculator,
  ChevronRight,
  Sparkles,
  Lock,
  Plus
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { cn } from '@/lib/utils';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  savings?: number;
  description: string;
  benefits: string[];
  maxTickets?: number;
  popular?: boolean;
}

interface PricingStrategyProps {
  seriesLength?: number;
  individualEventPrice?: number;
  onUpdatePricing?: (pricing: any) => void;
  onSavePricing?: () => void;
}

export function PricingStrategy({
  seriesLength = 4,
  individualEventPrice = 50,
  onUpdatePricing,
  onSavePricing
}: PricingStrategyProps) {
  const [bundleDiscount, setBundleDiscount] = React.useState(20);
  const [earlyBirdDiscount, setEarlyBirdDiscount] = React.useState(15);
  const [loyaltyDiscount, setLoyaltyDiscount] = React.useState(10);
  const [enableSeriesPass, setEnableSeriesPass] = React.useState(true);
  const [enablePaymentPlan, setEnablePaymentPlan] = React.useState(true);
  const [enableGroupDiscounts, setEnableGroupDiscounts] = React.useState(true);
  const [minimumGroupSize, setMinimumGroupSize] = React.useState(5);
  const [groupDiscount, setGroupDiscount] = React.useState(25);

  // Calculate pricing tiers
  const pricingTiers: PricingTier[] = React.useMemo(() => {
    const fullPrice = individualEventPrice * seriesLength;
    const bundlePrice = fullPrice * (1 - bundleDiscount / 100);
    const earlyPrice = bundlePrice * (1 - earlyBirdDiscount / 100);
    
    return [
      {
        id: 'individual',
        name: 'Individual Events',
        price: individualEventPrice,
        description: 'Pay per event',
        benefits: [
          'Flexible attendance',
          'Choose specific events',
          'No commitment required',
          'Standard support'
        ]
      },
      {
        id: 'series-pass',
        name: 'Series Pass',
        price: bundlePrice,
        originalPrice: fullPrice,
        savings: fullPrice - bundlePrice,
        description: 'Access to all events in the series',
        benefits: [
          'All events included',
          `Save $${(fullPrice - bundlePrice).toFixed(0)}`,
          'Priority registration',
          'Exclusive content',
          'Certificate of completion'
        ],
        popular: true
      },
      {
        id: 'early-bird',
        name: 'Early Bird Special',
        price: earlyPrice,
        originalPrice: fullPrice,
        savings: fullPrice - earlyPrice,
        description: 'Limited time offer',
        benefits: [
          'All series pass benefits',
          `Save $${(fullPrice - earlyPrice).toFixed(0)}`,
          'VIP chat access',
          'Bonus resources',
          'Recording access'
        ],
        maxTickets: 50
      }
    ];
  }, [individualEventPrice, seriesLength, bundleDiscount, earlyBirdDiscount]);

  // Revenue projection data
  const revenueProjection = React.useMemo(() => {
    const weeks = [];
    let cumulativeRevenue = 0;
    
    for (let i = 4; i >= 0; i--) {
      const weekLabel = i === 0 ? 'Event Week' : `Week -${i}`;
      const expectedSales = i === 4 ? 20 : i === 3 ? 35 : i === 2 ? 30 : i === 1 ? 10 : 5;
      const avgPrice = pricingTiers[1].price; // Series pass price
      const weekRevenue = expectedSales * avgPrice;
      cumulativeRevenue += weekRevenue;
      
      weeks.push({
        week: weekLabel,
        sales: expectedSales,
        revenue: weekRevenue,
        cumulative: cumulativeRevenue
      });
    }
    
    return weeks;
  }, [pricingTiers]);

  // Price comparison data
  const priceComparison = [
    { 
      option: 'Individual', 
      price: individualEventPrice * seriesLength,
      savings: 0
    },
    { 
      option: 'Series Pass', 
      price: pricingTiers[1].price,
      savings: pricingTiers[1].savings
    },
    { 
      option: 'Early Bird', 
      price: pricingTiers[2].price,
      savings: pricingTiers[2].savings
    },
    {
      option: 'Group (5+)',
      price: pricingTiers[1].price * (1 - groupDiscount / 100),
      savings: pricingTiers[1].price * (groupDiscount / 100)
    }
  ];

  // Payment plan options
  const paymentPlanOptions = [
    { installments: 2, amount: pricingTiers[1].price / 2, fee: 0 },
    { installments: 3, amount: (pricingTiers[1].price * 1.05) / 3, fee: 5 },
    { installments: 4, amount: (pricingTiers[1].price * 1.08) / 4, fee: 8 }
  ];

  const handleDiscountChange = (type: string, value: number) => {
    switch (type) {
      case 'bundle':
        setBundleDiscount(value);
        break;
      case 'earlyBird':
        setEarlyBirdDiscount(value);
        break;
      case 'loyalty':
        setLoyaltyDiscount(value);
        break;
      case 'group':
        setGroupDiscount(value);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Pricing Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  "relative border rounded-lg p-4",
                  tier.popular && "border-purple-600 shadow-lg"
                )}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-lg">{tier.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                  {tier.maxTickets && (
                    <Badge variant="secondary" className="mt-2">
                      Limited: {tier.maxTickets} spots
                    </Badge>
                  )}
                </div>
                <div className="text-center mb-4">
                  {tier.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      ${tier.originalPrice.toFixed(0)}
                    </p>
                  )}
                  <p className="text-3xl font-bold">
                    ${tier.price.toFixed(0)}
                  </p>
                  {tier.id === 'individual' && (
                    <p className="text-sm text-gray-600">per event</p>
                  )}
                  {tier.savings && (
                    <Badge variant="success" className="mt-2">
                      Save ${tier.savings.toFixed(0)}
                    </Badge>
                  )}
                </div>
                <ul className="space-y-2 mb-4">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={cn(
                    "w-full",
                    tier.popular && "bg-purple-600 hover:bg-purple-700"
                  )}
                  variant={tier.popular ? "default" : "outline"}
                >
                  Select {tier.name}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Discount Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Discount Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bundle Discount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Series Pass Discount</Label>
              <span className="text-sm font-medium">{bundleDiscount}%</span>
            </div>
            <Slider
              value={[bundleDiscount]}
              onValueChange={(value) => handleDiscountChange('bundle', value[0])}
              max={40}
              step={5}
              className="mb-2"
            />
            <p className="text-xs text-gray-600">
              Customers save ${(individualEventPrice * seriesLength * bundleDiscount / 100).toFixed(0)} with series pass
            </p>
          </div>

          {/* Early Bird Discount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Early Bird Discount</Label>
              <span className="text-sm font-medium">{earlyBirdDiscount}%</span>
            </div>
            <Slider
              value={[earlyBirdDiscount]}
              onValueChange={(value) => handleDiscountChange('earlyBird', value[0])}
              max={30}
              step={5}
              className="mb-2"
            />
            <p className="text-xs text-gray-600">
              Additional discount for first 50 registrations
            </p>
          </div>

          {/* Group Discount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Label>Group Discount</Label>
                <Switch
                  checked={enableGroupDiscounts}
                  onCheckedChange={setEnableGroupDiscounts}
                />
              </div>
              <span className="text-sm font-medium">{groupDiscount}%</span>
            </div>
            {enableGroupDiscounts && (
              <>
                <Slider
                  value={[groupDiscount]}
                  onValueChange={(value) => handleDiscountChange('group', value[0])}
                  max={40}
                  step={5}
                  className="mb-2"
                />
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Minimum group size:</Label>
                    <Input
                      type="number"
                      value={minimumGroupSize}
                      onChange={(e) => setMinimumGroupSize(parseInt(e.target.value))}
                      className="w-16 h-8"
                      min="2"
                      max="20"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Loyalty Discount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Returning Customer Discount</Label>
              <span className="text-sm font-medium">{loyaltyDiscount}%</span>
            </div>
            <Slider
              value={[loyaltyDiscount]}
              onValueChange={(value) => handleDiscountChange('loyalty', value[0])}
              max={20}
              step={5}
              className="mb-2"
            />
            <p className="text-xs text-gray-600">
              For customers who attended previous events
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Plans */}
      {enablePaymentPlan && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Plans
              </CardTitle>
              <Switch
                checked={enablePaymentPlan}
                onCheckedChange={setEnablePaymentPlan}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentPlanOptions.map((plan) => (
                <div key={plan.installments} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{plan.installments} Installments</h4>
                  <p className="text-2xl font-bold">${plan.amount.toFixed(0)}</p>
                  <p className="text-sm text-gray-600">per installment</p>
                  {plan.fee > 0 && (
                    <Badge variant="secondary" className="mt-2">
                      {plan.fee}% processing fee
                    </Badge>
                  )}
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-600">
                      Total: ${(plan.amount * plan.installments).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Payment plans help increase accessibility and conversion rates by 30-40%
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Revenue Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Projections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Timeline */}
            <div>
              <h4 className="text-sm font-medium mb-3">Expected Sales Timeline</h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueProjection}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9333EA" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="cumulative" 
                    stroke="#9333EA" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)"
                    name="Cumulative Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Price Comparison */}
            <div>
              <h4 className="text-sm font-medium mb-3">Pricing Options Comparison</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={priceComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="option" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="price" fill="#EC4899" name="Price" />
                  <Bar dataKey="savings" fill="#10B981" name="Savings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Summary */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Calculator className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-bold">
                ${(revenueProjection[revenueProjection.length - 1]?.cumulative || 0).toFixed(0)}
              </p>
              <p className="text-xs text-gray-600">Expected Revenue</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold">100</p>
              <p className="text-xs text-gray-600">Expected Sales</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Tag className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold">
                ${(revenueProjection[revenueProjection.length - 1]?.cumulative / 100 || 0).toFixed(0)}
              </p>
              <p className="text-xs text-gray-600">Avg Ticket Price</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotional Codes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Promotional Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">EARLY20</p>
                <p className="text-sm text-gray-600">20% off for first 50 registrations</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">LOYAL15</p>
                <p className="text-sm text-gray-600">15% off for returning customers</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">GROUP25</p>
                <p className="text-sm text-gray-600">25% off for groups of 5+</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Promotional Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scarcity & Urgency */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Scarcity & Urgency Tactics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-sm">Limited Early Bird Spots</p>
                  <p className="text-xs text-gray-600">Only 50 tickets at discounted price</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-sm">Registration Deadline</p>
                  <p className="text-xs text-gray-600">Close registration 48h before event</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-sm">Price Increases</p>
                  <p className="text-xs text-gray-600">Raise prices as event approaches</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Pricing Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Preview Pricing
        </Button>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600"
          onClick={onSavePricing}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Save Pricing Strategy
        </Button>
      </div>
    </div>
  );
}