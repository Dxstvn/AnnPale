'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone,
  CreditCard,
  Calendar,
  Bell,
  Shield,
  Users,
  Crown,
  Star,
  Settings,
  ChevronRight,
  Check,
  X,
  RefreshCw,
  Download,
  ExternalLink,
  Zap,
  Gift,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileSubscription {
  id: string;
  tier: 'bronze' | 'silver' | 'gold';
  status: 'active' | 'cancelled' | 'past_due' | 'trial';
  platform: 'ios' | 'android' | 'web';
  nextBilling: Date;
  price: number;
  currency: string;
  autoRenew: boolean;
  paymentMethod: string;
  benefits: string[];
  usage: {
    videosWatched: number;
    messagesReceived: number;
    exclusiveContent: number;
  };
  trialDaysLeft?: number;
}

interface PlatformFeature {
  name: string;
  ios: boolean;
  android: boolean;
  web: boolean;
  description: string;
}

interface MobileSubscriptionManagerProps {
  subscription?: MobileSubscription;
  userAgent?: string;
  onSubscribe?: (tier: string, platform: string) => void;
  onUpgrade?: (newTier: string) => void;
  onCancel?: () => void;
  onUpdatePayment?: () => void;
  onRestorePurchases?: () => void;
  isLoading?: boolean;
}

export function MobileSubscriptionManager({
  subscription,
  userAgent = 'web',
  onSubscribe,
  onUpgrade,
  onCancel,
  onUpdatePayment,
  onRestorePurchases,
  isLoading = false
}: MobileSubscriptionManagerProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'benefits' | 'billing' | 'settings'>('overview');
  const [platform, setPlatform] = React.useState<'ios' | 'android' | 'web'>('web');

  React.useEffect(() => {
    // Detect platform from user agent
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      setPlatform('ios');
    } else if (userAgent.includes('Android')) {
      setPlatform('android');
    } else {
      setPlatform('web');
    }
  }, [userAgent]);

  // Default subscription for demo
  const defaultSubscription: MobileSubscription = subscription || {
    id: 'sub_mobile_123',
    tier: 'silver',
    status: 'active',
    platform: platform,
    nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    price: 19.99,
    currency: 'USD',
    autoRenew: true,
    paymentMethod: platform === 'ios' ? 'Apple Pay' : platform === 'android' ? 'Google Pay' : 'Credit Card',
    benefits: [
      'Unlimited video messages',
      'Priority customer support',
      'Exclusive content access',
      'Early feature access',
      'Ad-free experience'
    ],
    usage: {
      videosWatched: 23,
      messagesReceived: 8,
      exclusiveContent: 12
    }
  };

  // Platform-specific features
  const platformFeatures: PlatformFeature[] = [
    {
      name: 'In-App Purchase',
      ios: true,
      android: true,
      web: false,
      description: 'Native platform payment integration'
    },
    {
      name: 'Biometric Auth',
      ios: true,
      android: true,
      web: false,
      description: 'Face ID, Touch ID, or Fingerprint authentication'
    },
    {
      name: 'Push Notifications',
      ios: true,
      android: true,
      web: true,
      description: 'Real-time subscription updates'
    },
    {
      name: 'Offline Content',
      ios: true,
      android: true,
      web: false,
      description: 'Download content for offline viewing'
    },
    {
      name: 'Cross-Device Sync',
      ios: true,
      android: true,
      web: true,
      description: 'Subscription status synced across devices'
    }
  ];

  // Get tier info
  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return { name: 'Bronze', color: 'text-amber-600', icon: Star, price: 9.99 };
      case 'silver':
        return { name: 'Silver', color: 'text-slate-600', icon: Crown, price: 19.99 };
      case 'gold':
        return { name: 'Gold', color: 'text-yellow-600', icon: Crown, price: 39.99 };
      default:
        return { name: 'Free', color: 'text-gray-600', icon: Users, price: 0 };
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'trial': return 'text-blue-600';
      case 'cancelled': return 'text-red-600';
      case 'past_due': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  // Get platform icon
  const getPlatformIcon = (platformType: string) => {
    switch (platformType) {
      case 'ios': return '🍎';
      case 'android': return '🤖';
      case 'web': return '🌐';
      default: return '📱';
    }
  };

  // Format date for mobile
  const formatMobileDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const tierInfo = getTierInfo(defaultSubscription.tier);
  const TierIcon = tierInfo.icon;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Mobile Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Smartphone className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">My Subscription</h1>
              <p className="text-xs text-gray-600">{getPlatformIcon(platform)} {platform.toUpperCase()}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex border-b">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'benefits', label: 'Benefits' },
            { id: 'billing', label: 'Billing' },
            { id: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 py-3 px-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-600"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Subscription Status Card */}
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TierIcon className={cn("h-5 w-5", tierInfo.color)} />
                      <span className="font-semibold">{tierInfo.name} Plan</span>
                    </div>
                    <Badge className={cn("text-xs", getStatusColor(defaultSubscription.status))}>
                      {defaultSubscription.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next billing</span>
                      <span className="font-medium">{formatMobileDate(defaultSubscription.nextBilling)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-medium">${defaultSubscription.price}/month</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment method</span>
                      <span className="font-medium">{defaultSubscription.paymentMethod}</span>
                    </div>
                  </div>

                  {defaultSubscription.status === 'trial' && defaultSubscription.trialDaysLeft && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700">
                          {defaultSubscription.trialDaysLeft} days left in trial
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Usage Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">This Month's Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                        <span className="text-xs">📹</span>
                      </div>
                      <span className="text-sm">Videos watched</span>
                    </div>
                    <span className="font-semibold">{defaultSubscription.usage.videosWatched}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-xs">💬</span>
                      </div>
                      <span className="text-sm">Messages received</span>
                    </div>
                    <span className="font-semibold">{defaultSubscription.usage.messagesReceived}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                        <span className="text-xs">⭐</span>
                      </div>
                      <span className="text-sm">Exclusive content</span>
                    </div>
                    <span className="font-semibold">{defaultSubscription.usage.exclusiveContent}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button 
                  className="w-full justify-between h-12"
                  variant="outline"
                  onClick={() => onUpgrade?.('gold')}
                >
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    <span>Upgrade to Gold</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {platform !== 'web' && (
                  <Button 
                    className="w-full justify-between h-12"
                    variant="outline"
                    onClick={onRestorePurchases}
                  >
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>Restore Purchases</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'benefits' && (
            <motion.div
              key="benefits"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {defaultSubscription.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Platform Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Platform Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {platformFeatures.map((feature, index) => {
                    const isSupported = feature[platform as keyof Omit<PlatformFeature, 'name' | 'description'>];
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center",
                          isSupported ? "bg-green-100" : "bg-gray-100"
                        )}>
                          {isSupported ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <X className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm font-medium",
                              isSupported ? "text-gray-900" : "text-gray-500"
                            )}>
                              {feature.name}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div
              key="billing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{defaultSubscription.paymentMethod}</p>
                        <p className="text-xs text-gray-600">
                          {platform === 'ios' ? 'Managed by App Store' : 
                           platform === 'android' ? 'Managed by Play Store' : 
                           'Expires 12/25'}
                        </p>
                      </div>
                    </div>
                    {platform === 'web' && (
                      <Button variant="outline" size="sm" onClick={onUpdatePayment}>
                        Update
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Billing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { date: 'Aug 15, 2024', amount: '$19.99', status: 'Paid' },
                    { date: 'Jul 15, 2024', amount: '$19.99', status: 'Paid' },
                    { date: 'Jun 15, 2024', amount: '$19.99', status: 'Paid' }
                  ].map((bill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{bill.amount}</p>
                        <p className="text-xs text-gray-600">{bill.date}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {bill.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Download Invoice */}
              {platform === 'web' && (
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoices
                </Button>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Auto-Renewal */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-renewal</p>
                      <p className="text-xs text-gray-600">
                        {defaultSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <div className={cn(
                      "w-12 h-6 rounded-full p-1 transition-colors",
                      defaultSubscription.autoRenew ? "bg-green-500" : "bg-gray-300"
                    )}>
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white transition-transform",
                        defaultSubscription.autoRenew ? "translate-x-6" : "translate-x-0"
                      )} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Billing reminders</p>
                        <p className="text-xs text-gray-600">Get notified before billing</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              {/* Platform Settings */}
              {platform !== 'web' && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">
                            {platform === 'ios' ? 'App Store Settings' : 'Play Store Settings'}
                          </p>
                          <p className="text-xs text-gray-600">Manage subscription in store</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cancel Subscription */}
              <Card className="border-red-200">
                <CardContent className="p-4">
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={onCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {platform === 'ios' ? 'Cancel in App Store' :
                     platform === 'android' ? 'Cancel in Play Store' :
                     'Cancel Subscription'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-sm text-center">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}