'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle,
  Star,
  Calculator,
  Users,
  CheckCircle,
  XCircle,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Shield,
  Crown,
  Info,
  MessageSquare,
  Video,
  Gift,
  Calendar,
  Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  tier: string;
  message: string;
  rating: number;
  duration: string;
  avatar?: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface EducationStepProps {
  onContinue?: () => void;
  onBack?: () => void;
  showCalculator?: boolean;
  showTestimonials?: boolean;
}

export function EducationStep({
  onContinue,
  onBack,
  showCalculator = true,
  showTestimonials = true
}: EducationStepProps) {
  const [expandedFAQ, setExpandedFAQ] = React.useState<number | null>(null);
  const [selectedComparison, setSelectedComparison] = React.useState<'bronze' | 'silver' | 'gold'>('silver');
  const [calculatorMonths, setCalculatorMonths] = React.useState(12);

  // Comprehensive benefits explanation
  const tierBenefits = {
    bronze: {
      name: 'Bronze',
      price: 9.99,
      icon: Shield,
      color: 'from-orange-400 to-orange-600',
      benefits: [
        { feature: 'Monthly exclusive video', included: true },
        { feature: '24-hour early access', included: true },
        { feature: 'Community forum access', included: true },
        { feature: '10% merch discount', included: true },
        { feature: 'Bronze supporter badge', included: true },
        { feature: 'Live stream access', included: false },
        { feature: 'Direct messages', included: false },
        { feature: 'Video calls', included: false }
      ]
    },
    silver: {
      name: 'Silver',
      price: 24.99,
      originalPrice: 29.99,
      icon: Star,
      color: 'from-gray-400 to-gray-600',
      benefits: [
        { feature: 'Weekly exclusive videos', included: true },
        { feature: '48-hour early access', included: true },
        { feature: 'Live stream participation', included: true },
        { feature: '5 DMs per month', included: true },
        { feature: '20% merch discount', included: true },
        { feature: 'Silver VIP badge', included: true },
        { feature: 'Priority support', included: true },
        { feature: 'Quarterly video calls', included: false }
      ]
    },
    gold: {
      name: 'Gold',
      price: 49.99,
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      benefits: [
        { feature: 'Daily exclusive content', included: true },
        { feature: '72-hour early access', included: true },
        { feature: 'VIP live stream room', included: true },
        { feature: 'Unlimited direct messages', included: true },
        { feature: 'Quarterly 1-on-1 video calls', included: true },
        { feature: '30% merch discount', included: true },
        { feature: 'Gold VIP badge', included: true },
        { feature: 'Surprise gifts & perks', included: true }
      ]
    }
  };

  // Testimonials
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Marie L.',
      tier: 'Silver',
      message: 'The live streams are amazing! I feel so connected to the community.',
      rating: 5,
      duration: '6 months'
    },
    {
      id: '2',
      name: 'Jean P.',
      tier: 'Gold',
      message: 'The quarterly video calls are worth every penny. Such a personal touch!',
      rating: 5,
      duration: '1 year'
    },
    {
      id: '3',
      name: 'Sophie M.',
      tier: 'Bronze',
      message: 'Perfect entry point. Great content at an affordable price.',
      rating: 4,
      duration: '3 months'
    }
  ];

  // FAQs
  const faqs: FAQ[] = [
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
      category: 'billing'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 7-day free trial for new members. You can experience all the benefits before your first payment.',
      category: 'trial'
    },
    {
      question: 'Can I change my tier later?',
      answer: 'Absolutely! You can upgrade or downgrade your tier at any time. Changes take effect at your next billing cycle.',
      category: 'tiers'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and PayPal. All payments are secure and encrypted.',
      category: 'payment'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for annual subscriptions. Monthly subscriptions can be cancelled anytime.',
      category: 'refunds'
    },
    {
      question: 'How do I access exclusive content?',
      answer: 'Once subscribed, exclusive content will be unlocked automatically in your account. You\'ll also receive email notifications for new releases.',
      category: 'content'
    }
  ];

  // Calculate savings
  const calculateSavings = (tier: 'bronze' | 'silver' | 'gold') => {
    const monthly = tierBenefits[tier].price;
    const annual = monthly * 12;
    const annualDiscounted = annual * 0.83; // 2 months free
    const savings = annual - annualDiscounted;
    return {
      monthly: monthly * calculatorMonths,
      annual: annualDiscounted,
      savings: calculatorMonths === 12 ? savings : 0
    };
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
            1
          </div>
          <div className="w-16 h-1 bg-purple-600" />
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
            2
          </div>
          <div className="w-16 h-1 bg-gray-300" />
          <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">
            3
          </div>
        </div>
        <div className="w-20" /> {/* Spacer for alignment */}
      </div>

      {/* Benefits Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Compare Membership Benefits</CardTitle>
          <p className="text-sm text-gray-600">Choose the perfect tier for your needs</p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedComparison} onValueChange={(v) => setSelectedComparison(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bronze">
                <Shield className="h-4 w-4 mr-2" />
                Bronze
              </TabsTrigger>
              <TabsTrigger value="silver">
                <Star className="h-4 w-4 mr-2" />
                Silver
              </TabsTrigger>
              <TabsTrigger value="gold">
                <Crown className="h-4 w-4 mr-2" />
                Gold
              </TabsTrigger>
            </TabsList>

            {Object.entries(tierBenefits).map(([key, tier]) => (
              <TabsContent key={key} value={key}>
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className={cn(
                      "w-16 h-16 rounded-full bg-gradient-to-r mx-auto mb-3 flex items-center justify-center",
                      tier.color
                    )}>
                      <tier.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">{tier.name}</h3>
                    <div className="mt-2">
                      {tier.originalPrice && (
                        <span className="text-gray-400 line-through text-sm mr-2">
                          ${tier.originalPrice}
                        </span>
                      )}
                      <span className="text-3xl font-bold">${tier.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    {key === 'silver' && (
                      <Badge className="mt-2 bg-purple-100 text-purple-700">
                        Most Popular
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    {tier.benefits.map((benefit, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg",
                          benefit.included ? "bg-green-50" : "bg-gray-50 opacity-60"
                        )}
                      >
                        {benefit.included ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <span className={cn(
                          "text-sm",
                          benefit.included ? "font-medium" : "text-gray-500"
                        )}>
                          {benefit.feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Savings Calculator */}
      {showCalculator && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Savings Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subscription Duration</label>
                <div className="flex gap-2 mt-2">
                  {[1, 3, 6, 12].map((months) => (
                    <Button
                      key={months}
                      variant={calculatorMonths === months ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCalculatorMonths(months)}
                    >
                      {months} {months === 1 ? 'Month' : 'Months'}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(tierBenefits).map(([key, tier]) => {
                  const savings = calculateSavings(key as any);
                  return (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">{tier.name}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly cost:</span>
                          <span className="font-medium">${savings.monthly.toFixed(2)}</span>
                        </div>
                        {calculatorMonths === 12 && (
                          <>
                            <div className="flex justify-between">
                              <span>Annual cost:</span>
                              <span className="font-medium">${savings.annual.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>You save:</span>
                              <span className="font-bold">${savings.savings.toFixed(2)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {calculatorMonths === 12 && (
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-green-800">
                    💡 Get 2 months FREE with annual billing!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Testimonials */}
      {showTestimonials && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              What Members Say
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-gray-500">{testimonial.tier} • {testimonial.duration}</div>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "h-4 w-4",
                          i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 italic">"{testimonial.message}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                >
                  <span className="font-medium text-sm">{faq.question}</span>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-transform",
                    expandedFAQ === idx && "rotate-90"
                  )} />
                </button>
                {expandedFAQ === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-3"
                  >
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 py-4">
        <Badge variant="secondary" className="px-4 py-2">
          <Shield className="h-4 w-4 mr-2" />
          30-Day Guarantee
        </Badge>
        <Badge variant="secondary" className="px-4 py-2">
          <Calendar className="h-4 w-4 mr-2" />
          Cancel Anytime
        </Badge>
        <Badge variant="secondary" className="px-4 py-2">
          <Percent className="h-4 w-4 mr-2" />
          Save with Annual
        </Badge>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <Button 
          size="lg"
          className="px-8"
          onClick={onContinue}
        >
          Continue to Select Your Plan
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}