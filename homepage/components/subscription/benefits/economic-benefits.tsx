'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign,
  Percent,
  Gift,
  Package,
  Truck,
  Tag,
  Cake,
  Users,
  TrendingUp,
  ShoppingBag,
  Ticket,
  Star,
  Crown,
  Shield,
  Calculator,
  PiggyBank,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EconomicBenefit {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  type: 'discount' | 'bonus' | 'cashback' | 'free' | 'bundle';
  value: {
    amount: number;
    isPercentage?: boolean;
    maxValue?: number;
  };
  availability: {
    bronze: boolean;
    silver: boolean;
    gold: boolean;
  };
  usage?: {
    used: number;
    limit?: number;
    expires?: Date;
  };
  conditions?: string[];
}

interface EconomicBenefitsProps {
  currentTier?: 'bronze' | 'silver' | 'gold' | 'none';
  totalSpent?: number;
  onBenefitRedeem?: (benefit: EconomicBenefit) => void;
  showCalculator?: boolean;
}

export function EconomicBenefits({
  currentTier = 'none',
  totalSpent = 0,
  onBenefitRedeem,
  showCalculator = true
}: EconomicBenefitsProps) {
  const [calculatorValue, setCalculatorValue] = React.useState(100);
  const [selectedCategory, setSelectedCategory] = React.useState<'discounts' | 'bundles' | 'rewards' | 'special'>('discounts');

  // Economic benefit categories
  const economicBenefits: Record<string, EconomicBenefit[]> = {
    discounts: [
      {
        id: 'member-discount',
        title: 'Member Discount',
        description: 'Automatic discount on all purchases',
        icon: Percent,
        type: 'discount',
        value: { amount: 10, isPercentage: true },
        availability: { bronze: true, silver: true, gold: true },
        conditions: ['Applied automatically at checkout']
      },
      {
        id: 'vip-discount',
        title: 'VIP Discount',
        description: 'Extra discount for premium members',
        icon: Crown,
        type: 'discount',
        value: { amount: 20, isPercentage: true },
        availability: { bronze: false, silver: true, gold: true },
        conditions: ['Stacks with member discount']
      },
      {
        id: 'merch-discount',
        title: 'Merchandise Discount',
        description: 'Save on all official merchandise',
        icon: ShoppingBag,
        type: 'discount',
        value: { amount: 30, isPercentage: true },
        availability: { bronze: true, silver: true, gold: true },
        usage: { used: 2, limit: 5, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
      },
      {
        id: 'event-discount',
        title: 'Event Tickets Discount',
        description: 'Reduced prices on event tickets',
        icon: Ticket,
        type: 'discount',
        value: { amount: 25, isPercentage: true, maxValue: 50 },
        availability: { bronze: false, silver: true, gold: true }
      }
    ],
    bundles: [
      {
        id: 'content-bundle',
        title: 'Content Bundle Deal',
        description: 'Get multiple content pieces for less',
        icon: Package,
        type: 'bundle',
        value: { amount: 40, isPercentage: true },
        availability: { bronze: false, silver: true, gold: true },
        conditions: ['Minimum 3 items', 'Same category only']
      },
      {
        id: 'annual-bundle',
        title: 'Annual Bundle Savings',
        description: 'Save with annual subscription',
        icon: Calendar,
        type: 'bundle',
        value: { amount: 17, isPercentage: true },
        availability: { bronze: true, silver: true, gold: true },
        conditions: ['2 months free on annual plan']
      },
      {
        id: 'family-bundle',
        title: 'Family Plan Bundle',
        description: 'Add family members at discount',
        icon: Users,
        type: 'bundle',
        value: { amount: 50, isPercentage: true },
        availability: { bronze: false, silver: false, gold: true },
        conditions: ['Up to 4 additional members']
      }
    ],
    rewards: [
      {
        id: 'loyalty-points',
        title: 'Loyalty Points',
        description: 'Earn points on every purchase',
        icon: Star,
        type: 'cashback',
        value: { amount: 5, isPercentage: true },
        availability: { bronze: true, silver: true, gold: true },
        usage: { used: 250, limit: undefined }
      },
      {
        id: 'referral-bonus',
        title: 'Referral Bonus',
        description: 'Earn when friends join',
        icon: Users,
        type: 'bonus',
        value: { amount: 10 },
        availability: { bronze: true, silver: true, gold: true },
        usage: { used: 3, limit: 10 },
        conditions: ['Friend must maintain subscription for 30 days']
      },
      {
        id: 'milestone-rewards',
        title: 'Milestone Rewards',
        description: 'Bonus for subscription anniversaries',
        icon: TrendingUp,
        type: 'bonus',
        value: { amount: 25 },
        availability: { bronze: false, silver: true, gold: true },
        conditions: ['Every 6 months of continuous subscription']
      }
    ],
    special: [
      {
        id: 'birthday-special',
        title: 'Birthday Special',
        description: 'Special discount on your birthday month',
        icon: Cake,
        type: 'discount',
        value: { amount: 50, isPercentage: true },
        availability: { bronze: true, silver: true, gold: true },
        usage: { used: 0, limit: 1, expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
        conditions: ['Valid for entire birthday month', 'One use per year']
      },
      {
        id: 'free-shipping',
        title: 'Free Shipping',
        description: 'No shipping costs on physical items',
        icon: Truck,
        type: 'free',
        value: { amount: 10 },
        availability: { bronze: false, silver: true, gold: true },
        conditions: ['Worldwide shipping included']
      },
      {
        id: 'surprise-gifts',
        title: 'Surprise Gifts',
        description: 'Random free items and bonuses',
        icon: Gift,
        type: 'free',
        value: { amount: 20 },
        availability: { bronze: false, silver: false, gold: true },
        conditions: ['Randomly awarded to active members']
      }
    ]
  };

  // Calculate savings
  const calculateSavings = (amount: number) => {
    const benefits = Object.values(economicBenefits).flat();
    const accessibleBenefits = benefits.filter(b => 
      currentTier !== 'none' && b.availability[currentTier as keyof typeof b.availability]
    );
    
    let totalSavings = 0;
    accessibleBenefits.forEach(benefit => {
      if (benefit.type === 'discount' && benefit.value.isPercentage) {
        const saving = (amount * benefit.value.amount) / 100;
        totalSavings += benefit.value.maxValue ? Math.min(saving, benefit.value.maxValue) : saving;
      } else if (benefit.type === 'cashback' && benefit.value.isPercentage) {
        totalSavings += (amount * benefit.value.amount) / 100;
      } else if (benefit.type === 'free' || benefit.type === 'bonus') {
        totalSavings += benefit.value.amount;
      }
    });
    
    return totalSavings;
  };

  // Categories
  const categories = [
    { id: 'discounts', name: 'Discounts', icon: Percent, color: 'from-green-400 to-green-600' },
    { id: 'bundles', name: 'Bundle Deals', icon: Package, color: 'from-blue-400 to-blue-600' },
    { id: 'rewards', name: 'Loyalty Rewards', icon: Star, color: 'from-yellow-400 to-yellow-600' },
    { id: 'special', name: 'Special Offers', icon: Gift, color: 'from-purple-400 to-purple-600' }
  ];

  // Check access
  const hasAccess = (benefit: EconomicBenefit): boolean => {
    if (currentTier === 'none') return false;
    return benefit.availability[currentTier as keyof typeof benefit.availability];
  };

  // Get tier icon
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return Shield;
      case 'silver': return Star;
      case 'gold': return Crown;
      default: return DollarSign;
    }
  };

  const selectedBenefits = economicBenefits[selectedCategory];
  const selectedCategoryMeta = categories.find(c => c.id === selectedCategory)!;
  const potentialSavings = calculateSavings(calculatorValue);

  return (
    <div className="space-y-6">
      {/* Savings Calculator */}
      {showCalculator && currentTier !== 'none' && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Savings Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Monthly Spending</label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={calculatorValue}
                    onChange={(e) => setCalculatorValue(Number(e.target.value))}
                    className="flex-1"
                  />
                  <div className="w-24 text-right">
                    <span className="text-2xl font-bold">${calculatorValue}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 p-4 bg-white rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Potential Savings</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${potentialSavings.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Annual Savings</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${(potentialSavings * 12).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">per year</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">ROI</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {((potentialSavings / calculatorValue) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-500">return on spending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id as any)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all",
                isSelected 
                  ? "border-purple-500 bg-gradient-to-br " + category.color + " text-white"
                  : "border-gray-200 hover:border-purple-300 bg-white"
              )}
            >
              <Icon className={cn(
                "h-6 w-6 mx-auto mb-2",
                isSelected ? "text-white" : "text-gray-600"
              )} />
              <p className={cn(
                "text-xs font-medium",
                isSelected ? "text-white" : "text-gray-700"
              )}>
                {category.name}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Benefits List */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
              selectedCategoryMeta.color
            )}>
              <selectedCategoryMeta.icon className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg">{selectedCategoryMeta.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedBenefits.map((benefit) => {
              const Icon = benefit.icon;
              const accessible = hasAccess(benefit);
              
              return (
                <motion.div
                  key={benefit.id}
                  whileHover={{ x: accessible ? 4 : 0 }}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    accessible 
                      ? "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                      : "border-gray-100 bg-gray-50 opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        accessible ? "bg-purple-100" : "bg-gray-100"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          accessible ? "text-purple-600" : "text-gray-400"
                        )} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{benefit.title}</h4>
                          {/* Value Badge */}
                          <Badge className={cn(
                            "text-xs",
                            benefit.type === 'discount' ? "bg-green-100 text-green-700" :
                            benefit.type === 'cashback' ? "bg-blue-100 text-blue-700" :
                            benefit.type === 'bonus' ? "bg-yellow-100 text-yellow-700" :
                            "bg-purple-100 text-purple-700"
                          )}>
                            {benefit.value.isPercentage ? (
                              `${benefit.value.amount}% ${benefit.type === 'cashback' ? 'back' : 'off'}`
                            ) : (
                              `$${benefit.value.amount} ${benefit.type === 'bonus' ? 'bonus' : 'value'}`
                            )}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{benefit.description}</p>
                        
                        {/* Usage */}
                        {benefit.usage && (
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">
                                {benefit.usage.limit 
                                  ? `Used ${benefit.usage.used}/${benefit.usage.limit}`
                                  : `Earned: ${benefit.usage.used} points`}
                              </span>
                              {benefit.usage.expires && (
                                <span className="text-xs text-orange-600">
                                  Expires {benefit.usage.expires.toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {benefit.usage.limit && (
                              <Progress 
                                value={(benefit.usage.used / benefit.usage.limit) * 100}
                                className="h-1"
                              />
                            )}
                          </div>
                        )}
                        
                        {/* Conditions */}
                        {benefit.conditions && (
                          <div className="space-y-1">
                            {benefit.conditions.map((condition, idx) => (
                              <p key={idx} className="text-xs text-gray-500">
                                • {condition}
                              </p>
                            ))}
                          </div>
                        )}
                        
                        {/* Tier Availability */}
                        <div className="flex items-center gap-2 mt-2">
                          {(['bronze', 'silver', 'gold'] as const).map((tier) => {
                            const TierIcon = getTierIcon(tier);
                            const available = benefit.availability[tier];
                            
                            return (
                              <div
                                key={tier}
                                className={cn(
                                  "flex items-center gap-1 px-2 py-1 rounded text-xs",
                                  available 
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-50 text-gray-400"
                                )}
                              >
                                <TierIcon className="h-3 w-3" />
                                <span className="capitalize">{tier}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    {accessible && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onBenefitRedeem?.(benefit)}
                      >
                        {benefit.type === 'discount' ? 'Apply' : 'Redeem'}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Total Savings Summary */}
      {currentTier !== 'none' && totalSpent > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Your Total Savings</h3>
                <p className="text-sm text-gray-600">
                  Based on ${totalSpent} spent this year
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">
                  ${calculateSavings(totalSpent).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">saved so far</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Add missing import
import { Calendar } from 'lucide-react';