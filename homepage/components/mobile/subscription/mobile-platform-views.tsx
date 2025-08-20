'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone,
  ExternalLink,
  Settings,
  CreditCard,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  RefreshCw,
  Download,
  FileText,
  Bell,
  Lock,
  Users,
  Crown,
  Star,
  ChevronRight,
  X,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PlatformSubscription {
  platform: 'ios' | 'android' | 'web';
  subscriptionId: string;
  receipt?: string;
  storeTransactionId?: string;
  managementUrl?: string;
  canModifyInApp: boolean;
  cancellationPolicy: string;
  refundPolicy: string;
  features: PlatformFeature[];
}

interface PlatformFeature {
  id: string;
  name: string;
  available: boolean;
  description: string;
  restriction?: string;
}

interface PlatformRule {
  platform: 'ios' | 'android' | 'web';
  rule: string;
  description: string;
  type: 'payment' | 'content' | 'management' | 'cancellation';
  compliance: 'required' | 'recommended' | 'optional';
}

interface MobilePlatformViewsProps {
  platform?: 'ios' | 'android' | 'web';
  subscription?: PlatformSubscription;
  onManageInStore?: () => void;
  onRestorePurchases?: () => void;
  onContactSupport?: () => void;
  onViewReceipt?: () => void;
}

export function MobilePlatformViews({
  platform = 'web',
  subscription,
  onManageInStore,
  onRestorePurchases,
  onContactSupport,
  onViewReceipt
}: MobilePlatformViewsProps) {
  // Platform-specific rules and restrictions
  const platformRules: PlatformRule[] = [
    {
      platform: 'ios',
      rule: 'App Store Payment Only',
      description: 'All subscription payments must go through Apple\'s payment system',
      type: 'payment',
      compliance: 'required'
    },
    {
      platform: 'ios',
      rule: 'External Link Restrictions',
      description: 'Cannot direct users to external payment pages from the app',
      type: 'management',
      compliance: 'required'
    },
    {
      platform: 'ios',
      rule: 'Manage via Settings',
      description: 'Users must manage subscriptions through iOS Settings app',
      type: 'management',
      compliance: 'required'
    },
    {
      platform: 'android',
      rule: 'Play Store Billing',
      description: 'Must use Google Play Billing for in-app subscriptions',
      type: 'payment',
      compliance: 'required'
    },
    {
      platform: 'android',
      rule: 'In-app Cancellation',
      description: 'Must provide in-app cancellation option',
      type: 'cancellation',
      compliance: 'required'
    },
    {
      platform: 'web',
      rule: 'Direct Payment',
      description: 'Can use any payment processor for web subscriptions',
      type: 'payment',
      compliance: 'optional'
    },
    {
      platform: 'web',
      rule: 'Full Management',
      description: 'Complete subscription management available in web app',
      type: 'management',
      compliance: 'optional'
    }
  ];

  // Default subscription data
  const defaultSubscription: PlatformSubscription = subscription || {
    platform: platform,
    subscriptionId: `${platform}_sub_123`,
    receipt: platform !== 'web' ? 'MIII...ABC123' : undefined,
    storeTransactionId: platform !== 'web' ? 'txn_12345' : undefined,
    managementUrl: getPlatformManagementUrl(platform),
    canModifyInApp: platform === 'android' || platform === 'web',
    cancellationPolicy: getPlatformCancellationPolicy(platform),
    refundPolicy: getPlatformRefundPolicy(platform),
    features: getPlatformFeatures(platform)
  };

  function getPlatformManagementUrl(platformType: string): string {
    switch (platformType) {
      case 'ios': return 'https://apps.apple.com/account/subscriptions';
      case 'android': return 'https://play.google.com/store/account/subscriptions';
      default: return '/account/subscription';
    }
  }

  function getPlatformCancellationPolicy(platformType: string): string {
    switch (platformType) {
      case 'ios': return 'Cancel anytime through iOS Settings > Apple ID > Subscriptions';
      case 'android': return 'Cancel anytime through Play Store > Subscriptions or in-app';
      default: return 'Cancel anytime in your account settings';
    }
  }

  function getPlatformRefundPolicy(platformType: string): string {
    switch (platformType) {
      case 'ios': return 'Refunds handled by Apple according to App Store terms';
      case 'android': return 'Refunds handled by Google according to Play Store policy';
      default: return 'Refunds processed according to our terms of service';
    }
  }

  function getPlatformFeatures(platformType: string): PlatformFeature[] {
    const baseFeatures = [
      { id: 'unlimited_videos', name: 'Unlimited Videos', available: true, description: 'Access to all video content' },
      { id: 'hd_quality', name: 'HD Quality', available: true, description: '1080p video streaming' },
      { id: 'priority_support', name: 'Priority Support', available: true, description: 'Faster customer service' }
    ];

    const platformSpecific: PlatformFeature[] = [];

    if (platformType === 'ios') {
      platformSpecific.push(
        { id: 'airplay', name: 'AirPlay Support', available: true, description: 'Stream to Apple TV' },
        { id: 'siri_shortcuts', name: 'Siri Shortcuts', available: true, description: 'Voice commands' },
        { id: 'handoff', name: 'Handoff', available: true, description: 'Continue on other Apple devices' }
      );
    }

    if (platformType === 'android') {
      platformSpecific.push(
        { id: 'chromecast', name: 'Chromecast', available: true, description: 'Cast to TV' },
        { id: 'android_auto', name: 'Android Auto', available: true, description: 'Car integration' },
        { id: 'google_assistant', name: 'Google Assistant', available: true, description: 'Voice integration' }
      );
    }

    if (platformType === 'web') {
      platformSpecific.push(
        { id: 'picture_in_picture', name: 'Picture in Picture', available: true, description: 'Floating video player' },
        { id: 'keyboard_shortcuts', name: 'Keyboard Shortcuts', available: true, description: 'Hotkey support' },
        { id: 'fullscreen', name: 'Fullscreen Mode', available: true, description: 'Immersive viewing' },
        { id: 'download', name: 'Download Videos', available: false, description: 'Offline viewing', restriction: 'Not available on web' }
      );
    }

    return [...baseFeatures, ...platformSpecific];
  }

  // Get platform display info
  const getPlatformInfo = () => {
    switch (platform) {
      case 'ios':
        return {
          name: 'iOS App Store',
          icon: '🍎',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          commission: '30%',
          description: 'Managed through Apple\'s subscription system'
        };
      case 'android':
        return {
          name: 'Google Play Store',
          icon: '🤖',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          commission: '30%',
          description: 'Managed through Google\'s billing system'
        };
      default:
        return {
          name: 'Web Platform',
          icon: '🌐',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          commission: '0%',
          description: 'Direct subscription management'
        };
    }
  };

  const platformInfo = getPlatformInfo();
  const currentPlatformRules = platformRules.filter(rule => rule.platform === platform);

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Platform Header */}
      <Card className={cn("border-l-4", 
        platform === 'ios' ? "border-l-blue-500" :
        platform === 'android' ? "border-l-green-500" :
        "border-l-purple-500"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xl", platformInfo.bgColor)}>
              {platformInfo.icon}
            </div>
            <div>
              <h2 className="font-semibold">{platformInfo.name}</h2>
              <p className="text-sm text-gray-600">{platformInfo.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Platform Fee:</span>
              <span className="ml-1 font-medium">{platformInfo.commission}</span>
            </div>
            <div>
              <span className="text-gray-600">Subscription ID:</span>
              <span className="ml-1 font-mono text-xs">{defaultSubscription.subscriptionId.slice(-6)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform-Specific Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subscription Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {platform === 'ios' && (
            <>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={onManageInStore}
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Manage in App Store</span>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={onRestorePurchases}
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Restore Purchases</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">iOS Requirements</span>
                </div>
                <p className="text-xs text-blue-700">
                  Subscription changes must be made through iOS Settings app due to App Store policies.
                </p>
              </div>
            </>
          )}

          {platform === 'android' && (
            <>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={onManageInStore}
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Manage in Play Store</span>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => {}} // Can manage in-app on Android
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Update Payment Method</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-between text-red-600"
                onClick={() => {}} // Can cancel in-app on Android
              >
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  <span>Cancel Subscription</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Android Flexibility</span>
                </div>
                <p className="text-xs text-green-700">
                  Full subscription management available in-app per Google Play policies.
                </p>
              </div>
            </>
          )}

          {platform === 'web' && (
            <>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => {}}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Update Payment Method</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => {}}
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notification Preferences</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={onViewReceipt}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>View Invoices</span>
                </div>
                <Download className="h-4 w-4" />
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-between text-red-600"
                onClick={() => {}}
              >
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  <span>Cancel Subscription</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Web Benefits</span>
                </div>
                <p className="text-xs text-purple-700">
                  Full control over your subscription with no platform restrictions.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Platform Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {defaultSubscription.features.map((feature, index) => (
            <div key={feature.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center",
                  feature.available ? "bg-green-100" : "bg-gray-100"
                )}>
                  {feature.available ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <X className="h-3 w-3 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    feature.available ? "text-gray-900" : "text-gray-500"
                  )}>
                    {feature.name}
                  </p>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                  {feature.restriction && (
                    <p className="text-xs text-red-600">{feature.restriction}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Platform Rules & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentPlatformRules.map((rule, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{rule.rule}</h4>
                <Badge className={cn(
                  "text-xs",
                  rule.compliance === 'required' ? "bg-red-100 text-red-700" :
                  rule.compliance === 'recommended' ? "bg-yellow-100 text-yellow-700" :
                  "bg-green-100 text-green-700"
                )}>
                  {rule.compliance}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">{rule.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Receipt Information */}
      {(platform === 'ios' || platform === 'android') && defaultSubscription.receipt && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receipt Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Receipt:</span>
              <span className="font-mono text-xs">{defaultSubscription.receipt}</span>
            </div>
            {defaultSubscription.storeTransactionId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs">{defaultSubscription.storeTransactionId}</span>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full" onClick={onViewReceipt}>
              <FileText className="h-4 w-4 mr-2" />
              View Full Receipt
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Support */}
      <Card>
        <CardContent className="p-4">
          <Button variant="outline" className="w-full" onClick={onContactSupport}>
            <Users className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <p className="text-xs text-gray-600 text-center mt-2">
            Need help with your {platformInfo.name} subscription?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}