'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle,
  DollarSign,
  Activity,
  ThumbsDown,
  HelpCircle,
  Wrench,
  Heart,
  Pause,
  ArrowDown,
  Shield,
  Star,
  Gift,
  Video,
  MessageSquare,
  HeadphonesIcon,
  Calendar,
  Percent,
  Award,
  Users,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DowngradeReason {
  id: string;
  category: 'price_sensitivity' | 'low_usage' | 'content_dissatisfaction' | 'feature_confusion' | 'technical_issues' | 'life_changes';
  label: string;
  description: string;
  icon: React.ElementType;
  commonality: number; // percentage of users who select this reason
}

interface RetentionOffer {
  id: string;
  reasonCategory: string;
  title: string;
  description: string;
  value: string;
  icon: React.ElementType;
  color: string;
  successRate: number;
  conditions?: string[];
  duration?: string;
  exclusive?: boolean;
}

interface DowngradePreventionProps {
  currentTier?: string;
  targetTier?: string;
  reasons?: DowngradeReason[];
  offers?: RetentionOffer[];
  onReasonSelect?: (reason: DowngradeReason) => void;
  onOfferAccept?: (offer: RetentionOffer) => void;
  onOfferDecline?: (offer: RetentionOffer) => void;
  onProceedWithDowngrade?: (reason: DowngradeReason, feedback?: string) => void;
  onCancelDowngrade?: () => void;
  showFeedback?: boolean;
}

export function DowngradePrevention({
  currentTier = 'silver',
  targetTier = 'bronze',
  reasons = [],
  offers = [],
  onReasonSelect,
  onOfferAccept,
  onOfferDecline,
  onProceedWithDowngrade,
  onCancelDowngrade,
  showFeedback = true
}: DowngradePreventionProps) {
  const [step, setStep] = React.useState<'reason' | 'offer' | 'feedback' | 'final'>('reason');
  const [selectedReason, setSelectedReason] = React.useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState('');
  const [showOfferDetails, setShowOfferDetails] = React.useState(false);

  // Default downgrade reasons based on specification
  const defaultReasons: DowngradeReason[] = reasons.length > 0 ? reasons : [
    {
      id: 'price_sensitivity',
      category: 'price_sensitivity',
      label: 'Too Expensive',
      description: 'The subscription cost is higher than I can afford right now',
      icon: DollarSign,
      commonality: 35
    },
    {
      id: 'low_usage',
      category: 'low_usage',
      label: 'Not Using It Enough',
      description: 'I\'m not getting enough value from the features I\'m paying for',
      icon: Activity,
      commonality: 28
    },
    {
      id: 'content_dissatisfaction',
      category: 'content_dissatisfaction',
      label: 'Content Not Meeting Expectations',
      description: 'The content quality or frequency doesn\'t match what I expected',
      icon: ThumbsDown,
      commonality: 15
    },
    {
      id: 'feature_confusion',
      category: 'feature_confusion',
      label: 'Features Too Complicated',
      description: 'I find the features confusing or hard to use',
      icon: HelpCircle,
      commonality: 12
    },
    {
      id: 'technical_issues',
      category: 'technical_issues',
      label: 'Technical Problems',
      description: 'I\'ve been experiencing bugs or technical difficulties',
      icon: Wrench,
      commonality: 6
    },
    {
      id: 'life_changes',
      category: 'life_changes',
      label: 'Life Circumstances Changed',
      description: 'My situation has changed and I need to reduce expenses',
      icon: Heart,
      commonality: 4
    }
  ];

  // Default retention offers based on specification
  const defaultOffers: RetentionOffer[] = offers.length > 0 ? offers : [
    {
      id: 'price_discount',
      reasonCategory: 'price_sensitivity',
      title: '50% Off for 2 Months',
      description: 'Keep your Silver tier at half price for the next 2 months',
      value: '50% OFF',
      icon: Percent,
      color: 'from-green-400 to-green-600',
      successRate: 40,
      conditions: ['Valid for 2 months', 'Auto-renews at full price'],
      duration: '2 months'
    },
    {
      id: 'exclusive_content',
      reasonCategory: 'low_usage',
      title: 'Exclusive Content Package',
      description: 'Get access to premium content library to maximize your subscription value',
      value: '20+ Videos',
      icon: Video,
      color: 'from-purple-400 to-purple-600',
      successRate: 30,
      conditions: ['Immediate access', 'Exclusive library'],
      exclusive: true
    },
    {
      id: 'custom_video',
      reasonCategory: 'content_dissatisfaction',
      title: 'Custom Video Request',
      description: 'Request a personalized video on topics you want to see',
      value: 'Personal Video',
      icon: MessageSquare,
      color: 'from-blue-400 to-blue-600',
      successRate: 35,
      conditions: ['Custom topic', 'Within 7 days'],
      exclusive: true
    },
    {
      id: 'tutorial_session',
      reasonCategory: 'feature_confusion',
      title: 'Personal Tutorial Session',
      description: 'One-on-one tutorial to help you get the most out of your subscription',
      value: '30-min Session',
      icon: Users,
      color: 'from-yellow-400 to-yellow-600',
      successRate: 45,
      conditions: ['1-on-1 guidance', 'Scheduled at your convenience']
    },
    {
      id: 'free_month',
      reasonCategory: 'technical_issues',
      title: 'Free Month + Priority Support',
      description: 'Complimentary month while we resolve your technical issues',
      value: 'Free Month',
      icon: HeadphonesIcon,
      color: 'from-orange-400 to-orange-600',
      successRate: 50,
      conditions: ['Priority support', 'Issue resolution guarantee']
    },
    {
      id: 'pause_subscription',
      reasonCategory: 'life_changes',
      title: 'Pause Your Subscription',
      description: 'Keep your benefits on hold for up to 3 months',
      value: '3-Month Pause',
      icon: Pause,
      color: 'from-gray-400 to-gray-600',
      successRate: 60,
      conditions: ['Benefits preserved', 'Resume anytime'],
      duration: 'Up to 3 months'
    }
  ];

  // Get offers for selected reason
  const getOffersForReason = (reasonId: string): RetentionOffer[] => {
    const reason = defaultReasons.find(r => r.id === reasonId);
    if (!reason) return [];
    
    return defaultOffers.filter(offer => offer.reasonCategory === reason.category);
  };

  // Handle reason selection
  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
    const reason = defaultReasons.find(r => r.id === reasonId);
    if (reason) {
      onReasonSelect?.(reason);
      setStep('offer');
    }
  };

  // Handle offer acceptance
  const handleOfferAccept = (offerId: string) => {
    const offer = defaultOffers.find(o => o.id === offerId);
    if (offer) {
      onOfferAccept?.(offer);
      setSelectedOffer(offerId);
      setStep('final');
    }
  };

  // Handle offer decline
  const handleOfferDecline = () => {
    if (showFeedback) {
      setStep('feedback');
    } else {
      const reason = defaultReasons.find(r => r.id === selectedReason);
      if (reason) {
        onProceedWithDowngrade?.(reason);
        setStep('final');
      }
    }
  };

  // Handle feedback submission
  const handleFeedbackSubmit = () => {
    const reason = defaultReasons.find(r => r.id === selectedReason);
    if (reason) {
      onProceedWithDowngrade?.(reason, feedback);
      setStep('final');
    }
  };

  const selectedReasonData = defaultReasons.find(r => r.id === selectedReason);
  const availableOffers = selectedReason ? getOffersForReason(selectedReason) : [];
  const selectedOfferData = defaultOffers.find(o => o.id === selectedOffer);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-orange-300 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Wait! Before You Downgrade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-800 font-medium">
                We'd hate to see you downgrade from {currentTier.toUpperCase()} to {targetTier.toUpperCase()}
              </p>
              <p className="text-orange-700 text-sm">
                Let us understand why and see if we can help you stay
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-orange-600" />
              <ArrowDown className="h-4 w-4 text-orange-600" />
              <Star className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Reason Selection */}
      <AnimatePresence mode="wait">
        {step === 'reason' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>What's the main reason for downgrading?</CardTitle>
                <p className="text-gray-600">
                  Help us understand so we can offer the best solution for you
                </p>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedReason || ''} onValueChange={handleReasonSelect}>
                  <div className="space-y-3">
                    {defaultReasons.map(reason => {
                      const Icon = reason.icon;
                      
                      return (
                        <div key={reason.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value={reason.id} id={reason.id} className="mt-1" />
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                              <Icon className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor={reason.id} className="font-medium cursor-pointer">
                                {reason.label}
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">{reason.description}</p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {reason.commonality}% of users cite this reason
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Retention Offers */}
        {step === 'offer' && selectedReasonData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="bg-blue-50 border-blue-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-blue-600" />
                  We Have Special Offers for You!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800">
                  Since you mentioned "<strong>{selectedReasonData.label.toLowerCase()}</strong>", 
                  we've prepared some exclusive offers that might help address your concerns.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {availableOffers.map(offer => {
                const Icon = offer.icon;
                
                return (
                  <Card key={offer.id} className={cn(
                    "transition-all cursor-pointer border-2",
                    offer.exclusive && "border-yellow-300 bg-yellow-50"
                  )}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                            offer.color
                          )}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              {offer.title}
                              {offer.exclusive && (
                                <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                                  Exclusive
                                </Badge>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Value */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {offer.value}
                          </div>
                          <p className="text-sm text-gray-600">Retention Value</p>
                        </div>
                        
                        {/* Success Rate */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Success Rate</span>
                            <span className="text-sm font-medium">{offer.successRate}%</span>
                          </div>
                          <Progress value={offer.successRate} className="h-2" />
                        </div>
                        
                        {/* Conditions */}
                        {offer.conditions && (
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">Conditions:</p>
                            <ul className="space-y-1">
                              {offer.conditions.map((condition, idx) => (
                                <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {condition}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Duration */}
                        {offer.duration && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>Duration: {offer.duration}</span>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1"
                            onClick={() => handleOfferAccept(offer.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Offer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Decline Options */}
            <Card className="border-gray-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">None of these work for you?</p>
                    <p className="text-sm text-gray-600">We understand. You can still proceed with the downgrade.</p>
                  </div>
                  <Button variant="outline" onClick={handleOfferDecline}>
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Proceed with Downgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Feedback */}
        {step === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Help Us Improve</CardTitle>
                <p className="text-gray-600">
                  Your feedback helps us create better experiences for all subscribers
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="feedback" className="text-sm font-medium">
                    What could we have done differently? (Optional)
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your thoughts on how we could improve..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="mt-2"
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={handleFeedbackSubmit} className="flex-1">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Submit & Continue with Downgrade
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('offer')}
                  >
                    Back to Offers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Final Confirmation */}
        {step === 'final' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {selectedOfferData ? (
              <Card className="border-green-300 bg-green-50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Great! You're Staying with {currentTier.toUpperCase()}
                  </h3>
                  <p className="text-green-700 mb-4">
                    Your "{selectedOfferData.title}" offer has been applied to your account.
                    You can continue enjoying all your current benefits.
                  </p>
                  <Button onClick={onCancelDowngrade} className="bg-green-600 hover:bg-green-700">
                    <Heart className="h-4 w-4 mr-2" />
                    Continue with Current Tier
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-orange-300 bg-orange-50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowDown className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">
                    Downgrade Confirmed
                  </h3>
                  <p className="text-orange-700 mb-4">
                    Your tier has been changed to {targetTier.toUpperCase()}. 
                    The changes will take effect at your next billing cycle.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" className="border-orange-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Billing Details
                    </Button>
                    <Button onClick={onCancelDowngrade} variant="outline" className="border-orange-300">
                      Back to Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Option */}
      {step !== 'final' && (
        <div className="text-center">
          <Button variant="ghost" onClick={onCancelDowngrade}>
            <XCircle className="h-4 w-4 mr-2" />
            Cancel and Keep Current Tier
          </Button>
        </div>
      )}
    </div>
  );
}