'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone,
  MessageSquare,
  Mic,
  Wifi,
  WifiOff,
  MapPin,
  Bell,
  Share2,
  Calendar,
  Users,
  Zap,
  Trophy,
  Target,
  Camera,
  Download,
  Upload,
  Heart,
  Bookmark,
  ChevronRight,
  CheckCircle,
  Info,
  Play,
  Sparkles
} from 'lucide-react';
import { MobileCommunityLayout } from '@/components/mobile/community/mobile-community-layout';

export default function Phase4310Demo() {
  const [activeDemo, setActiveDemo] = React.useState('overview');
  const [deviceFrame, setDeviceFrame] = React.useState(true);

  const demoSections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Mobile Community Experience introduction',
      icon: Smartphone
    },
    {
      id: 'live',
      title: 'Live Mobile Demo',
      description: 'Interactive mobile community interface',
      icon: Play
    }
  ];

  const mobileFeatures = [
    {
      category: 'Forum Browsing',
      desktop: 'Multi-column layout',
      mobile: 'Single column',
      optimization: 'Infinite scroll',
      icon: MessageSquare
    },
    {
      category: 'Thread Creation',
      desktop: 'Rich editor',
      mobile: 'Simple editor',
      optimization: 'Voice-to-text',
      icon: Mic
    },
    {
      category: 'Media Upload',
      desktop: 'Drag & drop',
      mobile: 'Camera/gallery',
      optimization: 'Instant share',
      icon: Camera
    },
    {
      category: 'Notifications',
      desktop: 'Dashboard',
      mobile: 'Push alerts',
      optimization: 'Smart grouping',
      icon: Bell
    },
    {
      category: 'Events',
      desktop: 'Calendar view',
      mobile: 'List view',
      optimization: 'Native calendar',
      icon: Calendar
    }
  ];

  const quickActions = [
    {
      action: 'Swipe to React',
      description: 'Quick like/bookmark with swipe gestures',
      icon: Heart,
      color: 'bg-red-100 text-red-600'
    },
    {
      action: 'Long Press Menu',
      description: 'Context menu for additional options',
      icon: MessageSquare,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      action: 'Voice Replies',
      description: 'Speak your response instead of typing',
      icon: Mic,
      color: 'bg-green-100 text-green-600'
    },
    {
      action: 'Quick Polls',
      description: 'Create instant polls with one tap',
      icon: Target,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      action: 'Photo Comments',
      description: 'Reply with photos directly from camera',
      icon: Camera,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const offlineFeatures = [
    {
      feature: 'Cached Threads',
      description: 'Browse previously loaded content offline',
      icon: Download,
      status: 'Available'
    },
    {
      feature: 'Draft Posts',
      description: 'Create and save posts for later',
      icon: MessageSquare,
      status: 'Saved'
    },
    {
      feature: 'Saved Content',
      description: 'Access bookmarked items offline',
      icon: Bookmark,
      status: 'Synced'
    },
    {
      feature: 'Queue Actions',
      description: 'Actions sync when reconnected',
      icon: Upload,
      status: 'Pending'
    },
    {
      feature: 'Sync on Connect',
      description: 'Automatic synchronization',
      icon: Wifi,
      status: 'Ready'
    }
  ];

  const engagementFeatures = [
    {
      feature: 'Location-based',
      description: 'Find nearby events and meetups',
      icon: MapPin,
      impact: 'High'
    },
    {
      feature: 'Push Campaigns',
      description: 'Targeted engagement notifications',
      icon: Bell,
      impact: 'Medium'
    },
    {
      feature: 'App Shortcuts',
      description: 'Quick access to key features',
      icon: Zap,
      impact: 'High'
    },
    {
      feature: 'Widget Updates',
      description: 'Home screen community widgets',
      icon: Calendar,
      impact: 'Medium'
    },
    {
      feature: 'Share Sheets',
      description: 'Native sharing capabilities',
      icon: Share2,
      impact: 'High'
    }
  ];

  const platformStats = [
    { label: 'Mobile Users', value: '78%', color: 'text-purple-600', description: 'Access via mobile' },
    { label: 'Engagement', value: '+45%', color: 'text-green-600', description: 'vs desktop' },
    { label: 'Session Time', value: '12min', color: 'text-blue-600', description: 'Average duration' },
    { label: 'Actions/Session', value: '8.5', color: 'text-yellow-600', description: 'User interactions' },
    { label: 'Offline Usage', value: '34%', color: 'text-orange-600', description: 'Use offline features' },
    { label: 'Voice Input', value: '23%', color: 'text-red-600', description: 'Use voice features' }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mobile Community Experience
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Phase 4.3.10: Full community participation through mobile devices with 
              optimized interfaces, gestures, and offline capabilities.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm px-4 py-2">
                Eksperyans Mobil
              </Badge>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-sm px-4 py-2">
                Mobile-First Design
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platformStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile vs Desktop Features */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile Optimization Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Feature</th>
                  <th className="text-left py-2">Desktop</th>
                  <th className="text-left py-2">Mobile</th>
                  <th className="text-left py-2">Mobile Optimization</th>
                </tr>
              </thead>
              <tbody>
                {mobileFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <tr key={feature.category} className="border-b">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{feature.category}</span>
                        </div>
                      </td>
                      <td className="py-2 text-sm text-gray-600">{feature.desktop}</td>
                      <td className="py-2 text-sm text-gray-600">{feature.mobile}</td>
                      <td className="py-2">
                        <Badge variant="secondary" className="text-xs">
                          {feature.optimization}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Mobile Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.action} className="hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      action.color
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{action.action}</h3>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Offline Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="h-5 w-5" />
            Offline Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offlineFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.feature} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{feature.feature}</h4>
                      <Badge variant="outline" className="text-xs">
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Engagement */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Mobile Engagement Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {engagementFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.feature} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base">
                    <Icon className="h-5 w-5" />
                    {feature.feature}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                  <Badge className={cn(
                    "text-xs",
                    feature.impact === 'High' ? "bg-green-100 text-green-700" :
                    "bg-yellow-100 text-yellow-700"
                  )}>
                    {feature.impact} Impact
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Interactive Mobile Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Experience the full mobile community interface with swipe gestures, 
            voice input, offline mode, and location-based features.
          </p>
          <Button
            size="lg"
            className="w-full"
            onClick={() => setActiveDemo('live')}
          >
            Launch Mobile Interface
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Implementation Complete */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Implementation Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Completed Components:</h4>
              <div className="space-y-2">
                {[
                  'Mobile forum browser with infinite scroll',
                  'Thread creator with voice-to-text',
                  'Swipe gestures and long press menus',
                  'Offline caching and sync system',
                  'Location-based engagement features',
                  'Mobile community layout with navigation'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Key Features:</h4>
              <div className="space-y-2">
                {[
                  'Voice input for posts and replies',
                  'Swipe actions for quick interactions',
                  'Offline content availability',
                  'Push notifications and campaigns',
                  'Native mobile integrations',
                  'Optimized for touch interfaces'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLiveDemo = () => (
    <div className="space-y-4">
      {/* Demo Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Mobile Community Interface</h2>
              <p className="text-gray-600">Experience the mobile-optimized community</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={deviceFrame ? "default" : "outline"}
                size="sm"
                onClick={() => setDeviceFrame(!deviceFrame)}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Device Frame
              </Button>
              <Button variant="outline" onClick={() => setActiveDemo('overview')}>
                Back to Overview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Interface */}
      <div className="flex justify-center">
        <div className={cn(
          "transition-all",
          deviceFrame ? "p-8 bg-gray-900 rounded-3xl shadow-2xl" : ""
        )}>
          <div className={cn(
            "bg-white overflow-hidden",
            deviceFrame ? "w-[375px] h-[812px] rounded-2xl" : "w-full max-w-md"
          )}>
            <MobileCommunityLayout
              userId="demo-user"
              isAuthenticated={true}
              initialView="browse"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {demoSections.map((section) => (
              <Button
                key={section.id}
                variant={activeDemo === section.id ? 'default' : 'outline'}
                onClick={() => setActiveDemo(section.id)}
              >
                <section.icon className="h-4 w-4 mr-2" />
                {section.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeDemo === 'overview' ? renderOverview() : renderLiveDemo()}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}