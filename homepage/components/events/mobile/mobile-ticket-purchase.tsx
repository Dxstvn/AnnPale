'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
  Shield,
  Clock,
  Users,
  Calendar,
  MapPin,
  Star,
  Gift,
  Plus,
  Minus,
  Check,
  X,
  AlertCircle,
  Zap,
  Apple,
  DollarSign,
  Info,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TicketTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  benefits: string[];
  available: number;
  maxPerPerson: number;
  popular?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ElementType;
  type: 'card' | 'digital' | 'crypto';
  fees?: number;
  processingTime: string;
  enabled: boolean;
}

interface MobileTicketPurchaseProps {
  event?: {
    id: string;
    title: string;
    creator: string;
    date: Date;
    duration: number;
    image: string;
    location?: string;
    rating: number;
  };
  ticketTiers?: TicketTier[];
  onPurchase?: (purchaseData: any) => void;
  onBack?: () => void;
}

export function MobileTicketPurchase({
  event,
  ticketTiers = [],
  onPurchase,
  onBack
}: MobileTicketPurchaseProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedTiers, setSelectedTiers] = React.useState<Record<string, number>>({});
  const [selectedPayment, setSelectedPayment] = React.useState<string>('apple-pay');
  const [promoCode, setPromoCode] = React.useState('');
  const [promoApplied, setPromoApplied] = React.useState(false);
  const [giftPurchase, setGiftPurchase] = React.useState(false);
  const [recipientEmail, setRecipientEmail] = React.useState('');
  const [giftMessage, setGiftMessage] = React.useState('');
  const [savePayment, setSavePayment] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  // Sample event data
  const sampleEvent = {
    id: 'event-1',
    title: 'Haitian Music Masterclass',
    creator: 'Marie Delacroix',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    duration: 90,
    image: '/api/placeholder/400/300',
    location: 'Virtual Event',
    rating: 4.9
  };

  const displayEvent = event || sampleEvent;

  // Sample ticket tiers
  const sampleTiers: TicketTier[] = [
    {
      id: 'general',
      name: 'General Access',
      price: 45,
      description: 'Basic access to the live event',
      benefits: ['Live event access', 'Q&A participation', 'Recording access (48h)'],
      available: 25,
      maxPerPerson: 4,
      popular: false
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: 75,
      originalPrice: 95,
      description: 'Enhanced experience with exclusive perks',
      benefits: ['All General benefits', 'Private chat with creator', 'Exclusive content', 'Priority support'],
      available: 8,
      maxPerPerson: 2,
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: 120,
      description: 'Complete experience with one-on-one time',
      benefits: ['All VIP benefits', '15-min private session', 'Signed digital certificate', 'Lifetime access'],
      available: 3,
      maxPerPerson: 1,
      popular: false
    }
  ];

  const displayTiers = ticketTiers.length > 0 ? ticketTiers : sampleTiers;

  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      icon: Apple,
      type: 'digital',
      processingTime: 'Instant',
      enabled: true
    },
    {
      id: 'google-pay',
      name: 'Google Pay',
      icon: Wallet,
      type: 'digital',
      processingTime: 'Instant',
      enabled: true
    },
    {
      id: 'credit-card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      type: 'card',
      fees: 2.9,
      processingTime: '1-2 minutes',
      enabled: true
    }
  ];

  const steps = [
    { number: 1, title: 'Select Tickets', icon: Users },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Confirmation', icon: Check }
  ];

  const totalTickets = Object.values(selectedTiers).reduce((sum, count) => sum + count, 0);
  const subtotal = Object.entries(selectedTiers).reduce((sum, [tierId, count]) => {
    const tier = displayTiers.find(t => t.id === tierId);
    return sum + (tier ? tier.price * count : 0);
  }, 0);

  const promoDiscount = promoApplied ? subtotal * 0.1 : 0;
  const processingFee = selectedPayment === 'credit-card' ? subtotal * 0.029 : 0;
  const total = subtotal - promoDiscount + processingFee;

  const updateTicketCount = (tierId: string, increment: boolean) => {
    setSelectedTiers(prev => {
      const current = prev[tierId] || 0;
      const tier = displayTiers.find(t => t.id === tierId);
      if (!tier) return prev;

      if (increment && current < Math.min(tier.available, tier.maxPerPerson)) {
        return { ...prev, [tierId]: current + 1 };
      } else if (!increment && current > 0) {
        const newCount = current - 1;
        if (newCount === 0) {
          const { [tierId]: removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [tierId]: newCount };
      }
      return prev;
    });
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true);
    }
  };

  const handlePurchase = async () => {
    setProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const purchaseData = {
      event: displayEvent,
      tickets: selectedTiers,
      paymentMethod: selectedPayment,
      total,
      giftPurchase,
      recipientEmail: giftPurchase ? recipientEmail : undefined,
      giftMessage: giftPurchase ? giftMessage : undefined
    };

    onPurchase?.(purchaseData);
    setCurrentStep(3);
    setProcessing(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">Purchase Tickets</h1>
            <p className="text-sm text-gray-600">{displayEvent.title}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Step {currentStep}/3
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <Progress value={(currentStep / 3) * 100} className="h-1" />
          <div className="flex justify-between mt-2">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={cn(
                    "flex flex-col items-center text-xs",
                    currentStep >= step.number ? "text-purple-600" : "text-gray-400"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center mb-1",
                    currentStep >= step.number ? "bg-purple-600 text-white" : "bg-gray-200"
                  )}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <span>{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-4 space-y-4"
            >
              {/* Event Summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{displayEvent.title}</h3>
                      <p className="text-sm text-gray-600">{displayEvent.creator}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{displayEvent.date.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{displayEvent.duration}min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span>{displayEvent.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Tiers */}
              <div className="space-y-3">
                <h3 className="font-semibold">Select Tickets</h3>
                {displayTiers.map((tier) => (
                  <Card key={tier.id} className={cn(
                    "overflow-hidden",
                    tier.popular && "border-purple-600 shadow-lg"
                  )}>
                    {tier.popular && (
                      <div className="bg-purple-600 text-white text-xs font-medium text-center py-1">
                        Most Popular
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{tier.name}</h4>
                              {tier.originalPrice && (
                                <Badge variant="destructive" className="text-xs">
                                  Save ${tier.originalPrice - tier.price}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-lg font-bold text-green-600">${tier.price}</span>
                              {tier.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-1">
                                  ${tier.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateTicketCount(tier.id, false)}
                              disabled={!selectedTiers[tier.id]}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {selectedTiers[tier.id] || 0}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateTicketCount(tier.id, true)}
                              disabled={(selectedTiers[tier.id] || 0) >= Math.min(tier.available, tier.maxPerPerson)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {tier.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{tier.available} left</span>
                          <span>Max {tier.maxPerPerson} per person</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Gift Option */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Gift className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-sm">Purchase as Gift</p>
                        <p className="text-xs text-gray-600">Send tickets to someone else</p>
                      </div>
                    </div>
                    <Switch
                      checked={giftPurchase}
                      onCheckedChange={setGiftPurchase}
                    />
                  </div>
                </CardContent>
              </Card>

              {totalTickets > 0 && (
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Total: {totalTickets} ticket{totalTickets > 1 ? 's' : ''}</span>
                    <span className="text-lg font-bold">${subtotal}</span>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    onClick={() => setCurrentStep(2)}
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-4 space-y-4"
            >
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(selectedTiers).map(([tierId, count]) => {
                    const tier = displayTiers.find(t => t.id === tierId);
                    if (!tier) return null;
                    return (
                      <div key={tierId} className="flex justify-between text-sm">
                        <span>{tier.name} × {count}</span>
                        <span>${tier.price * count}</span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Promo Discount</span>
                        <span>-${promoDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    {processingFee > 0 && (
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Processing Fee</span>
                        <span>${processingFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Promo Code */}
              {!promoApplied && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Promo Code</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="outline" onClick={applyPromoCode}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Gift Details */}
              {giftPurchase && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      Gift Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm">Recipient Email</Label>
                      <Input
                        type="email"
                        placeholder="recipient@email.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Gift Message (Optional)</Label>
                      <textarea
                        placeholder="Add a personal message..."
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={cn(
                          "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                          selectedPayment === method.id
                            ? "border-purple-600 bg-purple-50"
                            : "hover:bg-gray-50"
                        )}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          selectedPayment === method.id ? "bg-purple-600 text-white" : "bg-gray-100"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{method.name}</p>
                          <p className="text-xs text-gray-600">{method.processingTime}</p>
                        </div>
                        {method.fees && (
                          <Badge variant="secondary" className="text-xs">
                            {method.fees}% fee
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Your payment information is secure and encrypted. We never store your payment details.
                </AlertDescription>
              </Alert>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">${total.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  onClick={handlePurchase}
                  disabled={processing || (giftPurchase && !recipientEmail)}
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Complete Purchase</span>
                    </div>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Purchase Complete!</h2>
              <p className="text-gray-600 mb-6">
                {giftPurchase 
                  ? `Gift tickets have been sent to ${recipientEmail}`
                  : 'Your tickets have been confirmed and saved to your account'
                }
              </p>
              <div className="w-full max-w-sm space-y-3">
                <Button className="w-full">
                  View My Tickets
                </Button>
                <Button variant="outline" className="w-full">
                  Add to Calendar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}