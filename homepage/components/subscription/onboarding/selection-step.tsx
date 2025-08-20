'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Shield,
  Star,
  Crown,
  ChevronRight,
  Gift,
  Tag,
  Calendar,
  DollarSign,
  Percent,
  Check,
  Info,
  Sparkles,
  Clock,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectionStepProps {
  onContinue?: (selection: SelectionData) => void;
  onBack?: () => void;
  defaultTier?: 'bronze' | 'silver' | 'gold';
  showAddOns?: boolean;
}

interface SelectionData {
  tier: 'bronze' | 'silver' | 'gold';
  billingCycle: 'monthly' | 'annual';
  addOns: string[];
  isGift: boolean;
  promoCode?: string;
}

export function SelectionStep({
  onContinue,
  onBack,
  defaultTier = 'silver',
  showAddOns = true
}: SelectionStepProps) {
  const [selectedTier, setSelectedTier] = React.useState<'bronze' | 'silver' | 'gold'>(defaultTier);
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('monthly');
  const [selectedAddOns, setSelectedAddOns] = React.useState<string[]>([]);
  const [isGift, setIsGift] = React.useState(false);
  const [promoCode, setPromoCode] = React.useState('');
  const [showPromoField, setShowPromoField] = React.useState(false);
  const [promoApplied, setPromoApplied] = React.useState(false);

  // Tier options with psychological elements
  const tierOptions = [
    {
      id: 'bronze',
      name: 'Bronze',
      icon: Shield,
      monthlyPrice: 9.99,
      annualPrice: 99.90,
      color: 'from-orange-400 to-orange-600',
      borderColor: 'border-orange-300',
      features: ['Monthly video', 'Community access', '10% discount'],
      badge: null,
      description: 'Perfect for getting started'
    },
    {
      id: 'silver',
      name: 'Silver',
      icon: Star,
      monthlyPrice: 24.99,
      annualPrice: 249.90,
      color: 'from-gray-400 to-gray-600',
      borderColor: 'border-purple-500',
      features: ['Weekly content', 'Live streams', 'Direct messages'],
      badge: 'Most Popular',
      description: 'Best value for regular fans'
    },
    {
      id: 'gold',
      name: 'Gold VIP',
      icon: Crown,
      monthlyPrice: 49.99,
      annualPrice: 499.90,
      color: 'from-yellow-400 to-yellow-600',
      borderColor: 'border-yellow-300',
      features: ['Daily content', 'Video calls', 'All perks'],
      badge: 'Premium',
      description: 'Ultimate fan experience'
    }
  ];

  // Add-on options
  const addOnOptions = [
    {
      id: 'priority-requests',
      name: 'Priority Requests',
      price: 9.99,
      description: 'Get your requests answered first',
      icon: TrendingUp
    },
    {
      id: 'extra-dm',
      name: 'Extra DMs',
      price: 4.99,
      description: '+10 direct messages per month',
      icon: MessageSquare
    },
    {
      id: 'merch-discount',
      name: 'Merch Discount Boost',
      price: 2.99,
      description: 'Additional 10% off merchandise',
      icon: Tag
    }
  ];

  const selectedTierData = tierOptions.find(t => t.id === selectedTier)!;
  
  // Calculate total price
  const calculateTotal = () => {
    const basePrice = billingCycle === 'monthly' 
      ? selectedTierData.monthlyPrice 
      : selectedTierData.annualPrice / 12;
    
    const addOnsTotal = selectedAddOns.reduce((sum, id) => {
      const addOn = addOnOptions.find(a => a.id === id);
      return sum + (addOn?.price || 0);
    }, 0);
    
    let total = basePrice + addOnsTotal;
    
    // Apply promo discount (example: 20% off)
    if (promoApplied) {
      total = total * 0.8;
    }
    
    return total;
  };

  const handlePromoApply = () => {
    if (promoCode.toLowerCase() === 'welcome20') {
      setPromoApplied(true);
    }
  };

  const handleContinue = () => {
    onContinue?.({
      tier: selectedTier,
      billingCycle,
      addOns: selectedAddOns,
      isGift,
      promoCode: promoApplied ? promoCode : undefined
    });
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
            ✓
          </div>
          <div className="w-16 h-1 bg-green-600" />
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
            ✓
          </div>
          <div className="w-16 h-1 bg-purple-600" />
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
            3
          </div>
        </div>
        <div className="w-20" />
      </div>

      {/* Tier Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Membership Tier</CardTitle>
          <p className="text-sm text-gray-600">Select the plan that works best for you</p>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedTier} onValueChange={(v) => setSelectedTier(v as any)}>
            <div className="space-y-4">
              {tierOptions.map((tier) => {
                const Icon = tier.icon;
                const isSelected = selectedTier === tier.id;
                
                return (
                  <motion.div
                    key={tier.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Label
                      htmlFor={tier.id}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                        isSelected ? tier.borderColor : "border-gray-200",
                        isSelected && "bg-gradient-to-r from-purple-50 to-pink-50"
                      )}
                    >
                      <RadioGroupItem value={tier.id} id={tier.id} className="mt-1" />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className={cn(
                                "w-8 h-8 rounded-full bg-gradient-to-r flex items-center justify-center",
                                tier.color
                              )}>
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <h3 className="font-semibold text-lg">{tier.name}</h3>
                              {tier.badge && (
                                <Badge className="bg-purple-100 text-purple-700">
                                  {tier.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {tier.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-1 text-xs text-gray-700">
                                  <Check className="h-3 w-3 text-green-600" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              ${billingCycle === 'monthly' ? tier.monthlyPrice : (tier.annualPrice / 12).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">/month</div>
                            {billingCycle === 'annual' && tier.id === selectedTier && (
                              <div className="text-xs text-green-600 mt-1">
                                Save ${(tier.monthlyPrice * 12 - tier.annualPrice).toFixed(2)}/year
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Label>
                  </motion.div>
                );
              })}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Billing Cycle */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Frequency</CardTitle>
          <p className="text-sm text-gray-600">Save with annual billing</p>
        </CardHeader>
        <CardContent>
          <RadioGroup value={billingCycle} onValueChange={(v) => setBillingCycle(v as any)}>
            <div className="grid md:grid-cols-2 gap-4">
              <Label
                htmlFor="monthly"
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer",
                  billingCycle === 'monthly' ? "border-purple-500 bg-purple-50" : "border-gray-200"
                )}
              >
                <RadioGroupItem value="monthly" id="monthly" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Monthly</span>
                  </div>
                  <p className="text-sm text-gray-600">Pay month-to-month</p>
                </div>
              </Label>
              
              <Label
                htmlFor="annual"
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer relative",
                  billingCycle === 'annual' ? "border-purple-500 bg-purple-50" : "border-gray-200"
                )}
              >
                <RadioGroupItem value="annual" id="annual" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Annual</span>
                    <Badge className="bg-green-100 text-green-700">Save 17%</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Get 2 months free!</p>
                </div>
                {billingCycle === 'annual' && (
                  <Sparkles className="absolute top-2 right-2 h-4 w-4 text-yellow-500" />
                )}
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Add-ons */}
      {showAddOns && (
        <Card>
          <CardHeader>
            <CardTitle>Enhance Your Experience (Optional)</CardTitle>
            <p className="text-sm text-gray-600">Add extra features to your subscription</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {addOnOptions.map((addOn) => {
                const Icon = addOn.icon;
                const isSelected = selectedAddOns.includes(addOn.id);
                
                return (
                  <div
                    key={addOn.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                      isSelected ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:bg-gray-50"
                    )}
                    onClick={() => toggleAddOn(addOn.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        isSelected ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{addOn.name}</div>
                        <div className="text-xs text-gray-600">{addOn.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">+${addOn.price}/mo</span>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        isSelected ? "border-purple-600 bg-purple-600" : "border-gray-300"
                      )}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gift Option */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-purple-600" />
              <div>
                <Label htmlFor="gift" className="font-medium">This is a gift</Label>
                <p className="text-sm text-gray-600">Send this subscription as a gift to someone special</p>
              </div>
            </div>
            <Switch
              id="gift"
              checked={isGift}
              onCheckedChange={setIsGift}
            />
          </div>
        </CardContent>
      </Card>

      {/* Promo Code */}
      <Card>
        <CardContent className="p-4">
          {!showPromoField ? (
            <Button
              variant="link"
              className="p-0 h-auto text-purple-600"
              onClick={() => setShowPromoField(true)}
            >
              <Tag className="h-4 w-4 mr-2" />
              Have a promo code?
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={promoApplied}
              />
              {!promoApplied ? (
                <Button onClick={handlePromoApply}>Apply</Button>
              ) : (
                <Badge className="px-4 py-2 bg-green-100 text-green-700">
                  <Check className="h-4 w-4 mr-1" />
                  Applied
                </Badge>
              )}
            </div>
          )}
          {promoApplied && (
            <div className="mt-2 text-sm text-green-600">
              20% discount applied!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{selectedTierData.name} ({billingCycle})</span>
              <span className="font-medium">
                ${billingCycle === 'monthly' 
                  ? selectedTierData.monthlyPrice.toFixed(2)
                  : (selectedTierData.annualPrice / 12).toFixed(2)}/mo
              </span>
            </div>
            
            {selectedAddOns.map(id => {
              const addOn = addOnOptions.find(a => a.id === id);
              return addOn ? (
                <div key={id} className="flex justify-between text-sm">
                  <span>{addOn.name}</span>
                  <span className="font-medium">+${addOn.price.toFixed(2)}/mo</span>
                </div>
              ) : null;
            })}
            
            {promoApplied && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Promo Code (20% off)</span>
                <span className="font-medium">-${(calculateTotal() * 0.25).toFixed(2)}/mo</span>
              </div>
            )}
            
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    ${calculateTotal().toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>
              </div>
            </div>
            
            {billingCycle === 'annual' && (
              <div className="pt-2 text-center">
                <Badge className="bg-green-100 text-green-700">
                  Billed ${(calculateTotal() * 12).toFixed(2)} annually
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-center">
        <Button 
          size="lg"
          className="px-8"
          onClick={handleContinue}
        >
          Continue to Payment
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Add missing import
import { MessageSquare } from 'lucide-react';