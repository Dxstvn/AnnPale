'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  XCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Heart,
  Star,
  Users,
  Crown,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  RefreshCw,
  Pause,
  Settings,
  ExternalLink,
  Shield,
  Zap,
  Gift,
  DollarSign,
  MessageSquare,
  HelpCircle,
  ArrowLeft,
  Frown,
  Meh,
  Smile,
  ThumbsUp,
  ThumbsDown,
  TrendingDown,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CancellationReason {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  retention?: {
    offer: string;
    description: string;
    action: string;
  };
}

interface RetentionOffer {
  id: string;
  type: 'discount' | 'pause' | 'downgrade' | 'free_period';
  title: string;
  description: string;
  details: string;
  value: string;
  duration?: string;
  icon: React.ElementType;
  savings?: string;
}

interface SubscriptionInfo {
  tier: 'bronze' | 'silver' | 'gold';
  nextBilling: Date;
  monthlyPrice: number;
  yearlyDiscount?: number;
  platform: 'ios' | 'android' | 'web';
  benefits: string[];
  usage: {
    videosThisMonth: number;
    messagesReceived: number;
    favoriteCreators: number;
  };
}

interface MobileCancellationFlowProps {
  subscription?: SubscriptionInfo;
  platform?: 'ios' | 'android' | 'web';
  onCancel?: (reason: string, feedback?: string) => void;
  onAcceptOffer?: (offerId: string) => void;
  onPause?: (duration: number) => void;
  onDowngrade?: (newTier: string) => void;
  onClose?: () => void;
  isProcessing?: boolean;
}

export function MobileCancellationFlow({
  subscription,
  platform = 'web',
  onCancel,
  onAcceptOffer,
  onPause,
  onDowngrade,
  onClose,
  isProcessing = false
}: MobileCancellationFlowProps) {
  const [currentStep, setCurrentStep] = React.useState<'reason' | 'retention' | 'confirm' | 'feedback' | 'complete'>('reason');
  const [selectedReason, setSelectedReason] = React.useState<string>('');
  const [selectedOffer, setSelectedOffer] = React.useState<string>('');
  const [feedback, setFeedback] = React.useState('');
  const [satisfaction, setSatisfaction] = React.useState<number>(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Default subscription data
  const defaultSubscription: SubscriptionInfo = subscription || {
    tier: 'silver',
    nextBilling: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    monthlyPrice: 19.99,
    yearlyDiscount: 20,
    platform: platform,
    benefits: [
      'Unlimited video messages',
      'Priority customer support',
      'Exclusive content access',
      'Early feature access',
      'Ad-free experience'
    ],
    usage: {
      videosThisMonth: 23,
      messagesReceived: 8,
      favoriteCreators: 5
    }
  };

  // Cancellation reasons
  const cancellationReasons: CancellationReason[] = [
    {
      id: 'too_expensive',
      title: 'Too expensive',
      description: 'The subscription cost is higher than I expected',
      icon: DollarSign,
      retention: {
        offer: '50% off for 3 months',
        description: 'Get your current plan for half the price',
        action: 'Apply Discount'
      }
    },
    {
      id: 'not_using_enough',
      title: 'Not using it enough',
      description: 'I don\'t use the service as much as I thought I would',
      icon: Clock,
      retention: {
        offer: 'Pause for 3 months',
        description: 'Take a break and come back when ready',
        action: 'Pause Subscription'
      }
    },
    {
      id: 'technical_issues',
      title: 'Technical problems',
      description: 'Experiencing bugs, crashes, or performance issues',
      icon: Settings,
      retention: {
        offer: 'Priority technical support',
        description: 'Get dedicated help to resolve your issues',
        action: 'Contact Support'
      }
    },
    {
      id: 'missing_features',
      title: 'Missing features',
      description: 'The app doesn\'t have the features I need',
      icon: Zap,
      retention: {
        offer: 'Early access to new features',
        description: 'Be first to try upcoming features',
        action: 'Join Beta'
      }
    },
    {
      id: 'found_alternative',
      title: 'Found a better alternative',
      description: 'I\'m switching to a different service',
      icon: ArrowLeft
    },
    {
      id: 'temporary_break',
      title: 'Taking a break',
      description: 'I need to pause my subscription temporarily',
      icon: Pause,
      retention: {
        offer: 'Pause instead of cancel',
        description: 'Keep your account and return anytime',
        action: 'Pause Account'
      }
    },
    {
      id: 'privacy_concerns',
      title: 'Privacy concerns',
      description: 'I\'m worried about how my data is used',
      icon: Shield
    },
    {
      id: 'other',
      title: 'Other reason',
      description: 'I have a different reason for canceling',
      icon: MessageSquare
    }
  ];

  // Retention offers based on reason
  const retentionOffers: RetentionOffer[] = [
    {
      id: 'discount_50',
      type: 'discount',
      title: '50% Off for 3 Months',
      description: 'Continue with your current plan at half the price',
      details: 'Pay just $9.99/month instead of $19.99 for the next 3 months',
      value: '$30',
      duration: '3 months',
      icon: DollarSign,
      savings: 'Save $30'
    },
    {
      id: 'pause_3months',
      type: 'pause',
      title: 'Pause for 3 Months',
      description: 'Take a break and return when you\'re ready',
      details: 'Your subscription will be paused. No charges during this time.',
      value: 'Free',
      duration: '3 months',
      icon: Pause
    },
    {
      id: 'downgrade_bronze',
      type: 'downgrade',
      title: 'Switch to Bronze Plan',
      description: 'Lower cost plan with essential features',
      details: 'Get core features for just $9.99/month',
      value: '$9.99',
      duration: 'monthly',
      icon: Star,
      savings: 'Save $10/month'
    },
    {
      id: 'free_month',
      type: 'free_period',
      title: 'One Month Free',
      description: 'Enjoy another month on us',
      details: 'Skip your next billing cycle completely',
      value: 'Free',
      duration: '1 month',
      icon: Gift,
      savings: 'Save $19.99'
    }
  ];

  // Get tier info
  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return { name: 'Bronze', color: 'text-amber-600', icon: Star };
      case 'silver':
        return { name: 'Silver', color: 'text-slate-600', icon: Crown };
      case 'gold':
        return { name: 'Gold', color: 'text-yellow-600', icon: Crown };
      default:
        return { name: 'Free', color: 'text-gray-600', icon: Users };
    }
  };

  // Handle final cancellation
  const handleFinalCancel = async () => {
    setIsSubmitting(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onCancel?.(selectedReason, feedback);
    setIsSubmitting(false);
    setCurrentStep('complete');
  };

  // Handle offer acceptance
  const handleAcceptOffer = async (offerId: string) => {
    setIsSubmitting(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onAcceptOffer?.(offerId);
    setIsSubmitting(false);
    onClose?.();
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get platform specific cancellation info
  const getPlatformCancellationInfo = () => {
    switch (platform) {
      case 'ios':
        return {
          title: 'App Store Subscription',
          description: 'Your subscription is managed through the App Store',
          action: 'Open App Store Settings',
          icon: '🍎',
          note: 'You can also cancel directly in iOS Settings > Apple ID > Subscriptions'
        };
      case 'android':
        return {
          title: 'Play Store Subscription',
          description: 'Your subscription is managed through Google Play',
          action: 'Open Play Store',
          icon: '🤖',
          note: 'You can also cancel in Play Store > Subscriptions'
        };
      default:
        return {
          title: 'Web Subscription',
          description: 'Cancel your subscription directly here',
          action: 'Cancel Subscription',
          icon: '🌐',
          note: 'Your subscription will end at the end of your current billing period'
        };
    }
  };

  const platformInfo = getPlatformCancellationInfo();
  const tierInfo = getTierInfo(defaultSubscription.tier);
  const TierIcon = tierInfo.icon;

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
              {currentStep !== 'reason' && currentStep !== 'complete' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    if (currentStep === 'retention') setCurrentStep('reason');
                    if (currentStep === 'confirm') setCurrentStep('retention');
                    if (currentStep === 'feedback') setCurrentStep('confirm');
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold">
                    {currentStep === 'reason' ? 'Cancel Subscription' :
                     currentStep === 'retention' ? 'Wait! Special Offer' :
                     currentStep === 'confirm' ? 'Confirm Cancellation' :
                     currentStep === 'feedback' ? 'Share Feedback' :
                     'Cancellation Complete'}
                  </h2>
                  <p className="text-xs text-gray-600">{platformInfo.icon} {platformInfo.title}</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Steps */}
          {currentStep !== 'complete' && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2">
                {['reason', 'retention', 'confirm', 'feedback'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                      ['reason', 'retention', 'confirm', 'feedback'].indexOf(currentStep) >= index
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    )}>
                      {index + 1}
                    </div>
                    {index < 3 && (
                      <div className={cn(
                        "w-8 h-0.5 mx-1",
                        ['reason', 'retention', 'confirm', 'feedback'].indexOf(currentStep) > index
                          ? "bg-red-500"
                          : "bg-gray-200"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {/* Step 1: Reason Selection */}
            {currentStep === 'reason' && (
              <motion.div
                key="reason"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Current Subscription Summary */}
                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <TierIcon className={cn("h-5 w-5", tierInfo.color)} />
                      <div>
                        <h3 className="font-semibold">{tierInfo.name} Plan</h3>
                        <p className="text-sm text-gray-600">${defaultSubscription.monthlyPrice}/month</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next billing:</span>
                        <span className="font-medium">{formatDate(defaultSubscription.nextBilling)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Videos watched:</span>
                        <span className="font-medium">{defaultSubscription.usage.videosThisMonth} this month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Messages received:</span>
                        <span className="font-medium">{defaultSubscription.usage.messagesReceived} this month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reason Selection */}
                <div className="space-y-3">
                  <h3 className="font-medium">Why are you canceling?</h3>
                  <p className="text-sm text-gray-600">
                    Help us understand so we can improve your experience
                  </p>
                  
                  <div className="space-y-2">
                    {cancellationReasons.map((reason) => {
                      const Icon = reason.icon;
                      return (
                        <Card
                          key={reason.id}
                          className={cn(
                            "cursor-pointer transition-all",
                            selectedReason === reason.id && "border-red-500 ring-2 ring-red-200"
                          )}
                          onClick={() => setSelectedReason(reason.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-gray-600" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{reason.title}</p>
                                <p className="text-xs text-gray-600">{reason.description}</p>
                              </div>
                              {selectedReason === reason.id && (
                                <Check className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <Button
                  className="w-full h-12"
                  disabled={!selectedReason}
                  onClick={() => {
                    const reason = cancellationReasons.find(r => r.id === selectedReason);
                    if (reason?.retention && platform === 'web') {
                      setCurrentStep('retention');
                    } else {
                      setCurrentStep('confirm');
                    }
                  }}
                >
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Retention Offers */}
            {currentStep === 'retention' && (
              <motion.div
                key="retention"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">We'd hate to see you go!</h3>
                  <p className="text-sm text-gray-600">
                    Before you cancel, here are some special offers just for you
                  </p>
                </div>

                <div className="space-y-3">
                  {retentionOffers.map((offer) => {
                    const Icon = offer.icon;
                    return (
                      <Card
                        key={offer.id}
                        className={cn(
                          "cursor-pointer transition-all border-2",
                          selectedOffer === offer.id ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"
                        )}
                        onClick={() => setSelectedOffer(offer.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Icon className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{offer.title}</h4>
                                {offer.savings && (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    {offer.savings}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{offer.description}</p>
                              <p className="text-xs text-gray-600">{offer.details}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-lg font-bold text-green-600">{offer.value}</span>
                                {offer.duration && (
                                  <span className="text-sm text-gray-600">for {offer.duration}</span>
                                )}
                              </div>
                            </div>
                            {selectedOffer === offer.id && (
                              <Check className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full h-12 bg-green-600 hover:bg-green-700"
                    disabled={!selectedOffer || isSubmitting}
                    onClick={() => selectedOffer && handleAcceptOffer(selectedOffer)}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Applying offer...</span>
                      </div>
                    ) : (
                      <>Accept This Offer</>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full h-12 text-red-600 border-red-200"
                    onClick={() => setCurrentStep('confirm')}
                  >
                    No thanks, continue canceling
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Are you sure?</h3>
                  <p className="text-sm text-gray-600">
                    {platform === 'web' 
                      ? "Your subscription will end at the end of your current billing period"
                      : `You'll need to cancel through ${platform === 'ios' ? 'App Store' : 'Play Store'} settings`}
                  </p>
                </div>

                {/* What you'll lose */}
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-base">You'll lose access to:</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {defaultSubscription.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-orange-800">{benefit}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Platform specific info */}
                {platform !== 'web' && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Platform Requirements</span>
                      </div>
                      <p className="text-sm text-blue-700 mb-3">{platformInfo.note}</p>
                      <Button 
                        variant="outline" 
                        className="w-full border-blue-300 text-blue-700"
                        onClick={() => {
                          // Platform specific cancellation
                          if (platform === 'ios') {
                            window.open('https://apps.apple.com/account/subscriptions', '_blank');
                          } else if (platform === 'android') {
                            window.open('https://play.google.com/store/account/subscriptions', '_blank');
                          }
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {platformInfo.action}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {platform === 'web' && (
                  <div className="space-y-2">
                    <Button
                      className="w-full h-12 bg-red-600 hover:bg-red-700"
                      onClick={() => setCurrentStep('feedback')}
                    >
                      Yes, Cancel My Subscription
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full h-12"
                      onClick={onClose}
                    >
                      Keep My Subscription
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Feedback */}
            {currentStep === 'feedback' && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Help us improve</h3>
                  <p className="text-sm text-gray-600">
                    Your feedback helps us create a better experience for everyone
                  </p>
                </div>

                {/* Satisfaction Rating */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">How satisfied were you overall?</label>
                  <div className="flex justify-center gap-4">
                    {[
                      { value: 1, icon: Frown, label: 'Very unsatisfied' },
                      { value: 2, icon: Meh, label: 'Unsatisfied' },
                      { value: 3, icon: Meh, label: 'Neutral' },
                      { value: 4, icon: Smile, label: 'Satisfied' },
                      { value: 5, icon: Smile, label: 'Very satisfied' }
                    ].map((rating) => {
                      const Icon = rating.icon;
                      return (
                        <button
                          key={rating.value}
                          onClick={() => setSatisfaction(rating.value)}
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                            satisfaction === rating.value
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Text */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional feedback (optional)</label>
                  <Textarea
                    placeholder="Tell us what we could do better..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full h-12 bg-red-600 hover:bg-red-700"
                    onClick={handleFinalCancel}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Canceling subscription...</span>
                      </div>
                    ) : (
                      <>Complete Cancellation</>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setCurrentStep('confirm')}
                  >
                    Go Back
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Complete */}
            {currentStep === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center py-8"
              >
                <div>
                  <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-xl mb-2">Subscription Canceled</h3>
                  <p className="text-gray-600">
                    Your subscription has been canceled. You'll continue to have access until {formatDate(defaultSubscription.nextBilling)}.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-4 text-left space-y-2">
                    <h4 className="font-medium">What happens next:</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>• You can still use all features until {formatDate(defaultSubscription.nextBilling)}</p>
                      <p>• No more charges will be made to your account</p>
                      <p>• You can reactivate anytime before your access ends</p>
                      <p>• Your account data will be preserved for 30 days</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={onClose}
                  >
                    Return to App
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // Reactivate subscription
                      onClose?.();
                    }}
                  >
                    Actually, I changed my mind
                  </Button>
                </div>

                <p className="text-xs text-gray-500">
                  Thank you for being part of the Ann Pale community. We hope to see you again soon! 🇭🇹
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}