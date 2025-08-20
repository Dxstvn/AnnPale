'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap,
  Crown,
  Star,
  Shield,
  Clock,
  CheckCircle,
  Smartphone,
  CreditCard,
  FaceIcon,
  Fingerprint,
  Lock,
  Gift,
  Users,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
  Heart,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  period: 'month' | 'year';
  icon: React.ElementType;
  color: string;
  gradient: string;
  popular: boolean;
  trial?: {
    days: number;
    description: string;
  };
  features: string[];
  highlights: string[];
  savings?: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ElementType | string;
  platform: 'ios' | 'android' | 'web' | 'all';
  description: string;
  instant: boolean;
  biometric?: boolean;
}

interface MobileQuickSubscribeProps {
  platform?: 'ios' | 'android' | 'web';
  tiers?: SubscriptionTier[];
  onSubscribe?: (tierId: string, paymentMethod: string) => void;
  onClose?: () => void;
  isLoading?: boolean;
  showBiometric?: boolean;
}

export function MobileQuickSubscribe({
  platform = 'web',
  tiers = [],
  onSubscribe,
  onClose,
  isLoading = false,
  showBiometric = true
}: MobileQuickSubscribeProps) {
  const [selectedTier, setSelectedTier] = React.useState<string>('silver');
  const [selectedPayment, setSelectedPayment] = React.useState<string>('default');
  const [showPaymentMethods, setShowPaymentMethods] = React.useState(false);
  const [processingPayment, setProcessingPayment] = React.useState(false);

  // Default subscription tiers
  const defaultTiers: SubscriptionTier[] = tiers.length > 0 ? tiers : [
    {
      id: 'bronze',
      name: 'Bronze',
      price: 9.99,
      currency: 'USD',
      period: 'month',
      icon: Star,
      color: 'text-amber-600',
      gradient: 'from-amber-400 to-amber-600',
      popular: false,
      trial: {
        days: 7,
        description: '7-day free trial'
      },
      features: [
        '5 video messages per month',
        'Basic customer support',
        'Mobile app access',
        'HD video quality'
      ],
      highlights: ['Perfect for casual users', 'Great value for money']
    },
    {
      id: 'silver',
      name: 'Silver',
      price: 19.99,
      originalPrice: 24.99,
      currency: 'USD',
      period: 'month',
      icon: Crown,
      color: 'text-slate-600',
      gradient: 'from-slate-400 to-slate-600',
      popular: true,
      trial: {
        days: 14,
        description: '14-day free trial'
      },
      features: [
        'Unlimited video messages',
        'Priority customer support',
        'Exclusive content access',
        '4K video quality',
        'Advanced features'
      ],
      highlights: ['Most popular choice', 'Best value overall'],
      savings: 20
    },
    {
      id: 'gold',
      name: 'Gold',
      price: 39.99,
      currency: 'USD',
      period: 'month',
      icon: Crown,
      color: 'text-yellow-600',
      gradient: 'from-yellow-400 to-yellow-600',
      popular: false,
      trial: {
        days: 30,
        description: '30-day free trial'
      },
      features: [
        'Everything in Silver',
        'VIP customer support',
        'Behind-the-scenes content',
        'Early access to features',
        'Personal thank you videos',
        'Monthly live Q&A access'
      ],
      highlights: ['Ultimate experience', 'Exclusive perks']
    }
  ];

  // Payment methods based on platform
  const getPaymentMethods = (): PaymentMethod[] => {
    const methods: PaymentMethod[] = [];

    if (platform === 'ios') {
      methods.push({
        id: 'apple_pay',
        name: 'Apple Pay',
        icon: '🍎',
        platform: 'ios',
        description: 'Touch ID or Face ID',
        instant: true,
        biometric: true
      });
    }

    if (platform === 'android') {
      methods.push({
        id: 'google_pay',
        name: 'Google Pay',
        icon: '🤖',
        platform: 'android',
        description: 'Fingerprint or PIN',
        instant: true,
        biometric: true
      });
    }

    methods.push({
      id: 'credit_card',
      name: 'Credit Card',
      icon: CreditCard,
      platform: 'all',
      description: 'Visa, Mastercard, etc.',
      instant: platform !== 'web'
    });

    if (platform === 'web') {
      methods.push({
        id: 'paypal',
        name: 'PayPal',
        icon: '💳',
        platform: 'web',
        description: 'Secure payment',
        instant: true
      });
    }

    return methods;
  };

  const paymentMethods = getPaymentMethods();
  const selectedTierData = defaultTiers.find(t => t.id === selectedTier);
  const selectedPaymentData = paymentMethods.find(p => p.id === selectedPayment) || paymentMethods[0];

  // Handle subscription
  const handleSubscribe = async () => {
    if (!selectedTierData || !selectedPaymentData) return;

    setProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSubscribe?.(selectedTier, selectedPayment);
    setProcessingPayment(false);
  };

  // Get platform display name
  const getPlatformDisplay = () => {
    switch (platform) {
      case 'ios': return 'App Store';
      case 'android': return 'Play Store';
      default: return 'Web';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white w-full max-w-md rounded-t-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Quick Subscribe</h2>
                <p className="text-xs text-gray-600">via {getPlatformDisplay()}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Tier Selection */}
          <div className="space-y-3">
            <h3 className="font-medium">Choose Your Plan</h3>
            {defaultTiers.map((tier, index) => {
              const Icon = tier.icon;
              const isSelected = selectedTier === tier.id;

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all",
                      isSelected && "border-purple-500 ring-2 ring-purple-200",
                      tier.popular && "border-purple-300"
                    )}
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                            tier.gradient
                          )}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{tier.name}</span>
                              {tier.popular && (
                                <Badge className="bg-purple-100 text-purple-700 text-xs">
                                  Most Popular
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">${tier.price}</span>
                              {tier.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${tier.originalPrice}
                                </span>
                              )}
                              <span className="text-sm text-gray-600">/{tier.period}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-purple-500" />
                          )}
                          {tier.savings && (
                            <Badge className="bg-green-100 text-green-700 text-xs mt-1">
                              Save {tier.savings}%
                            </Badge>
                          )}
                        </div>
                      </div>

                      {tier.trial && (
                        <div className="flex items-center gap-2 mb-3">
                          <Gift className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-blue-600 font-medium">
                            {tier.trial.description}
                          </span>
                        </div>
                      )}

                      <div className="space-y-1">
                        {tier.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-gray-600">{feature}</span>
                          </div>
                        ))}
                        {tier.features.length > 3 && (
                          <p className="text-xs text-gray-500 mt-1">
                            +{tier.features.length - 3} more features
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Selected Tier Summary */}
          {selectedTierData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-purple-50 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">You're choosing {selectedTierData.name}</span>
              </div>
              {selectedTierData.highlights.map((highlight, idx) => (
                <p key={idx} className="text-sm text-purple-700">• {highlight}</p>
              ))}
            </motion.div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Payment Method</h3>
              {platform !== 'web' && showBiometric && (
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">Secured</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {paymentMethods.map((method, index) => {
                const isSelected = selectedPayment === method.id;
                const IconComponent = typeof method.icon === 'string' ? 
                  () => <span>{method.icon}</span> : method.icon;

                return (
                  <Card
                    key={method.id}
                    className={cn(
                      "cursor-pointer transition-all",
                      isSelected && "border-purple-500 ring-2 ring-purple-200"
                    )}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <IconComponent />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{method.name}</p>
                            <p className="text-xs text-gray-600">{method.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {method.instant && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              Instant
                            </Badge>
                          )}
                          {method.biometric && (
                            <Fingerprint className="h-4 w-4 text-blue-500" />
                          )}
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Subscribe Button */}
          <div className="space-y-3">
            <Button
              className="w-full h-12 text-base font-medium"
              onClick={handleSubscribe}
              disabled={processingPayment || isLoading}
            >
              {processingPayment ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {selectedPaymentData?.biometric && showBiometric ? (
                    <Fingerprint className="h-4 w-4" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  <span>
                    {selectedTierData?.trial ? 
                      `Start ${selectedTierData.trial.description}` : 
                      `Subscribe for $${selectedTierData?.price}/month`}
                  </span>
                </div>
              )}
            </Button>

            {/* Terms and Platform Info */}
            <div className="text-center space-y-2">
              {selectedTierData?.trial && (
                <p className="text-xs text-gray-600">
                  Free for {selectedTierData.trial.days} days, then ${selectedTierData.price}/month
                </p>
              )}
              
              <p className="text-xs text-gray-500">
                {platform === 'ios' ? 
                  'Subscription managed through App Store. Cancel anytime in Settings.' :
                  platform === 'android' ?
                  'Subscription managed through Play Store. Cancel anytime in Settings.' :
                  'Cancel anytime. No long-term commitments.'}
              </p>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>Terms of Service</span>
                <span>•</span>
                <span>Privacy Policy</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}