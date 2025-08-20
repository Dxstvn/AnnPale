'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone,
  Monitor,
  Tablet,
  Play,
  RotateCcw,
  Zap,
  Crown,
  Star,
  CreditCard,
  Settings,
  Users,
  RefreshCw,
  X,
  ChevronRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import our mobile subscription components
import { MobileSubscriptionManager } from '@/components/mobile/subscription/mobile-subscription-manager';
import { MobileQuickSubscribe } from '@/components/mobile/subscription/mobile-quick-subscribe';
import { MobilePlatformViews } from '@/components/mobile/subscription/mobile-platform-views';
import { MobileSubscriptionStatus } from '@/components/mobile/subscription/mobile-subscription-status';
import { MobileTierComparison } from '@/components/mobile/subscription/mobile-tier-comparison';
import { MobileCrossPlatformSync } from '@/components/mobile/subscription/mobile-cross-platform-sync';
import { MobilePaymentUpdate } from '@/components/mobile/subscription/mobile-payment-update';
import { MobileCancellationFlow } from '@/components/mobile/subscription/mobile-cancellation-flow';

type DemoComponent = 
  | 'subscription-manager'
  | 'quick-subscribe' 
  | 'platform-views'
  | 'subscription-status'
  | 'tier-comparison'
  | 'cross-platform-sync'
  | 'payment-update'
  | 'cancellation-flow';

interface ComponentDemo {
  id: DemoComponent;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  platforms: ('ios' | 'android' | 'web')[];
  features: string[];
}

interface DevicePreview {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'desktop';
  platform: 'ios' | 'android' | 'web';
  dimensions: { width: number; height: number };
  scale: number;
}

export default function Phase4510Demo() {
  const [activeComponent, setActiveComponent] = React.useState<DemoComponent>('subscription-manager');
  const [activePlatform, setActivePlatform] = React.useState<'ios' | 'android' | 'web'>('web');
  const [activeDevice, setActiveDevice] = React.useState<string>('iphone');
  const [isComponentVisible, setIsComponentVisible] = React.useState(false);
  const [userAgent, setUserAgent] = React.useState('web');

  // Component demos configuration
  const componentDemos: ComponentDemo[] = [
    {
      id: 'subscription-manager',
      name: 'Subscription Manager',
      description: 'Complete mobile subscription management with platform detection and tabbed navigation',
      icon: Smartphone,
      color: 'bg-purple-500',
      platforms: ['ios', 'android', 'web'],
      features: [
        'Platform-specific UI',
        'Tabbed navigation',
        'Usage statistics',
        'Billing information',
        'Auto-renewal controls'
      ]
    },
    {
      id: 'quick-subscribe',
      name: 'Quick Subscribe',
      description: 'Mobile-optimized subscription flow with platform-specific payment methods',
      icon: Zap,
      color: 'bg-blue-500',
      platforms: ['ios', 'android', 'web'],
      features: [
        'Platform payment detection',
        'Biometric authentication',
        'Trial period handling',
        'Tier comparison',
        'One-tap subscription'
      ]
    },
    {
      id: 'platform-views',
      name: 'Platform Views',
      description: 'Platform-specific subscription management with compliance handling',
      icon: Monitor,
      color: 'bg-green-500',
      platforms: ['ios', 'android', 'web'],
      features: [
        'App Store compliance',
        'Play Store integration',
        'Receipt management',
        'Platform restrictions',
        'Store-specific actions'
      ]
    },
    {
      id: 'subscription-status',
      name: 'Subscription Status',
      description: 'Mobile subscription status card with usage metrics and alerts',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      platforms: ['ios', 'android', 'web'],
      features: [
        'Real-time status',
        'Usage tracking',
        'Billing alerts',
        'Platform indicators',
        'Quick actions'
      ]
    },
    {
      id: 'tier-comparison',
      name: 'Tier Comparison',
      description: 'Mobile tier comparison with pricing and feature comparison modes',
      icon: Crown,
      color: 'bg-yellow-500',
      platforms: ['ios', 'android', 'web'],
      features: [
        'Pricing comparison',
        'Feature breakdown',
        'Category filtering',
        'Current tier highlighting',
        'Upgrade flows'
      ]
    },
    {
      id: 'cross-platform-sync',
      name: 'Cross-Platform Sync',
      description: 'Cross-platform synchronization with device management and conflict resolution',
      icon: RefreshCw,
      color: 'bg-indigo-500',
      platforms: ['ios', 'android', 'web'],
      features: [
        'Device synchronization',
        'Conflict resolution',
        'Sync health monitoring',
        'Data usage tracking',
        'Cross-device management'
      ]
    },
    {
      id: 'payment-update',
      name: 'Payment Update',
      description: 'Mobile payment method management with platform-specific flows',
      icon: CreditCard,
      color: 'bg-rose-500',
      platforms: ['ios', 'android', 'web'],
      features: [
        'Payment method management',
        'Platform-specific options',
        'Biometric integration',
        'Secure form validation',
        'Multi-step flow'
      ]
    },
    {
      id: 'cancellation-flow',
      name: 'Cancellation Flow',
      description: 'Comprehensive cancellation flow with retention offers and feedback collection',
      icon: X,
      color: 'bg-red-500',
      platforms: ['ios', 'android', 'web'],
      features: [
        'Reason collection',
        'Retention offers',
        'Platform compliance',
        'Feedback gathering',
        'Multi-step confirmation'
      ]
    }
  ];

  // Device previews
  const devicePreviews: DevicePreview[] = [
    {
      id: 'iphone',
      name: 'iPhone 15 Pro',
      type: 'phone',
      platform: 'ios',
      dimensions: { width: 375, height: 812 },
      scale: 0.8
    },
    {
      id: 'android',
      name: 'Pixel 8',
      type: 'phone',
      platform: 'android',
      dimensions: { width: 412, height: 892 },
      scale: 0.8
    },
    {
      id: 'tablet',
      name: 'iPad Pro',
      type: 'tablet',
      platform: 'ios',
      dimensions: { width: 768, height: 1024 },
      scale: 0.6
    },
    {
      id: 'web',
      name: 'Web Browser',
      type: 'desktop',
      platform: 'web',
      dimensions: { width: 480, height: 800 },
      scale: 0.9
    }
  ];

  // Get current demo and device info
  const currentDemo = componentDemos.find(demo => demo.id === activeComponent);
  const currentDevice = devicePreviews.find(device => device.id === activeDevice);

  // Update platform when device changes
  React.useEffect(() => {
    if (currentDevice) {
      setActivePlatform(currentDevice.platform);
      setUserAgent(currentDevice.platform === 'ios' ? 'iPhone' : 
                   currentDevice.platform === 'android' ? 'Android' : 'web');
    }
  }, [currentDevice]);

  // Show component demo
  const showComponent = () => {
    setIsComponentVisible(true);
  };

  // Hide component demo
  const hideComponent = () => {
    setIsComponentVisible(false);
  };

  // Reset demo
  const resetDemo = () => {
    hideComponent();
    setTimeout(() => {
      setActiveComponent('subscription-manager');
      setActiveDevice('iphone');
    }, 300);
  };

  // Render component demo
  const renderComponentDemo = () => {
    const commonProps = {
      platform: activePlatform,
      userAgent: userAgent,
      onClose: hideComponent
    };

    switch (activeComponent) {
      case 'subscription-manager':
        return <MobileSubscriptionManager {...commonProps} />;
      case 'quick-subscribe':
        return <MobileQuickSubscribe {...commonProps} />;
      case 'platform-views':
        return <MobilePlatformViews {...commonProps} />;
      case 'subscription-status':
        return <MobileSubscriptionStatus {...commonProps} />;
      case 'tier-comparison':
        return <MobileTierComparison {...commonProps} />;
      case 'cross-platform-sync':
        return <MobileCrossPlatformSync {...commonProps} />;
      case 'payment-update':
        return <MobilePaymentUpdate {...commonProps} />;
      case 'cancellation-flow':
        return <MobileCancellationFlow {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Phase 4.5.10 Demo</h1>
                <p className="text-sm text-gray-600">Mobile Subscription Experience</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-100 text-purple-700">
                8 Components
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                Mobile-First
              </Badge>
              <Badge className="bg-green-100 text-green-700">
                Cross-Platform
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Selection */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phase Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Phase 4.5.10 Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Mobile-optimized subscription lifecycle management across iOS, Android, and Web platforms, 
                  respecting platform requirements while maximizing conversion.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Platform-specific payment handling</li>
                    <li>• Mobile-optimized interfaces</li>
                    <li>• Cross-platform synchronization</li>
                    <li>• Compliance with store policies</li>
                    <li>• Retention flow optimization</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={resetDemo} variant="outline">
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Component List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {componentDemos.map((demo) => {
                  const Icon = demo.icon;
                  const isActive = activeComponent === demo.id;
                  
                  return (
                    <Card 
                      key={demo.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        isActive && "border-purple-500 ring-2 ring-purple-200"
                      )}
                      onClick={() => setActiveComponent(demo.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", demo.color)}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{demo.name}</p>
                            <p className="text-xs text-gray-600 line-clamp-2">{demo.description}</p>
                          </div>
                          {isActive && (
                            <CheckCircle className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            {/* Device Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {devicePreviews.map((device) => {
                    const isActive = activeDevice === device.id;
                    
                    return (
                      <Button
                        key={device.id}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className="justify-start h-auto p-2"
                        onClick={() => setActiveDevice(device.id)}
                      >
                        <div className="text-left">
                          <p className="font-medium text-xs">{device.name}</p>
                          <p className="text-xs opacity-70">{device.platform.toUpperCase()}</p>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Platform:</strong> {activePlatform.toUpperCase()}</p>
                  <p><strong>Dimensions:</strong> {currentDevice?.dimensions.width}×{currentDevice?.dimensions.height}</p>
                  <p><strong>Type:</strong> {currentDevice?.type}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Demo Header */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {currentDemo && (
                      <>
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", currentDemo.color)}>
                          <currentDemo.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{currentDemo.name}</h3>
                          <p className="text-sm text-gray-600">{currentDemo.description}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <Button onClick={showComponent} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Demo
                  </Button>
                </div>

                {/* Features */}
                {currentDemo && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Features:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {currentDemo.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Device Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Device Preview - {currentDevice?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div 
                    className="bg-gray-900 rounded-3xl p-2 shadow-2xl"
                    style={{
                      width: currentDevice ? currentDevice.dimensions.width * currentDevice.scale + 16 : 316,
                      height: currentDevice ? currentDevice.dimensions.height * currentDevice.scale + 16 : 656
                    }}
                  >
                    <div 
                      className="bg-white rounded-2xl overflow-hidden relative"
                      style={{
                        width: currentDevice ? currentDevice.dimensions.width * currentDevice.scale : 300,
                        height: currentDevice ? currentDevice.dimensions.height * currentDevice.scale : 640
                      }}
                    >
                      {/* Device Screen Content */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <div className="text-center space-y-4 p-6">
                          {currentDemo && (
                            <>
                              <div className={cn("w-16 h-16 mx-auto rounded-2xl flex items-center justify-center", currentDemo.color)}>
                                <currentDemo.icon className="h-8 w-8 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{currentDemo.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{currentDemo.description}</p>
                              </div>
                              <Button 
                                onClick={showComponent}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Try Demo
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Status bar for mobile devices */}
                      {(currentDevice?.type === 'phone' || currentDevice?.type === 'tablet') && (
                        <div className="absolute top-0 left-0 right-0 h-6 bg-black bg-opacity-5 flex items-center justify-between px-4 text-xs">
                          <span>9:41</span>
                          <span>100%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Compatibility */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {['ios', 'android', 'web'].map((platform) => {
                    const isSupported = currentDemo?.platforms.includes(platform as any);
                    const isActive = activePlatform === platform;
                    
                    return (
                      <div 
                        key={platform}
                        className={cn(
                          "p-3 rounded-lg border-2 text-center transition-all",
                          isSupported 
                            ? isActive 
                              ? "border-purple-500 bg-purple-50" 
                              : "border-green-200 bg-green-50"
                            : "border-gray-200 bg-gray-50 opacity-50"
                        )}
                      >
                        <div className="text-2xl mb-1">
                          {platform === 'ios' ? '🍎' : platform === 'android' ? '🤖' : '🌐'}
                        </div>
                        <p className="font-medium text-sm capitalize">{platform}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {isSupported ? (isActive ? 'Active' : 'Supported') : 'Not Supported'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Component Demo Modal */}
      <AnimatePresence>
        {isComponentVisible && (
          <>
            {renderComponentDemo()}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}