'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Smartphone,
  Users,
  CreditCard,
  Video,
  MessageSquare,
  Wifi,
  Battery,
  Settings,
  Zap,
  Star,
  ArrowRight,
  Play,
  Heart,
  Share2,
  Download,
  Calendar
} from 'lucide-react';

// Import mobile components
import { MobileEventBrowsing } from '@/components/events/mobile/mobile-event-browsing';
import { MobileTicketPurchase } from '@/components/events/mobile/mobile-ticket-purchase';
import { MobileEventAttendance } from '@/components/events/mobile/mobile-event-attendance';
import { MobileInteractions } from '@/components/events/mobile/mobile-interactions';
import { MobileNetworking } from '@/components/events/mobile/mobile-networking';
import { MobileOptimizations } from '@/components/events/mobile/mobile-optimizations';

export default function Phase4210Demo() {
  const [activeDemo, setActiveDemo] = React.useState<string>('overview');
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null);

  const demoSections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Smartphone,
      description: 'Mobile Event Experience Platform'
    },
    {
      id: 'browsing',
      title: 'Event Browsing',
      icon: Users,
      description: 'Mobile-first event discovery'
    },
    {
      id: 'purchase',
      title: 'Ticket Purchase',
      icon: CreditCard,
      description: 'Streamlined mobile purchase flow'
    },
    {
      id: 'attendance',
      title: 'Event Attendance',
      icon: Video,
      description: 'Full-screen mobile event viewing'
    },
    {
      id: 'interactions',
      title: 'Live Interactions',
      icon: MessageSquare,
      description: 'Touch-optimized engagement'
    },
    {
      id: 'networking',
      title: 'Mobile Networking',
      icon: Wifi,
      description: 'In-app attendee connections'
    },
    {
      id: 'optimizations',
      title: 'Mobile Optimizations',
      icon: Battery,
      description: 'Performance & battery management'
    }
  ];

  const features = [
    {
      title: 'Mobile-First Design',
      description: 'Optimized for touch interactions and mobile viewport',
      icon: Smartphone,
      highlights: ['Touch-friendly controls', 'Swipe gestures', 'Portrait/landscape support']
    },
    {
      title: 'Streamlined Purchase Flow',
      description: 'Simplified 3-step mobile ticket purchasing',
      icon: CreditCard,
      highlights: ['Apple Pay/Google Pay', 'Gift purchase options', 'Promo code support']
    },
    {
      title: 'Immersive Event Experience',
      description: 'Full-screen event viewing with mobile controls',
      icon: Video,
      highlights: ['Picture-in-picture', 'Audio-only mode', 'Adaptive quality']
    },
    {
      title: 'Real-time Interactions',
      description: 'Touch-optimized chat and reactions',
      icon: MessageSquare,
      highlights: ['Floating reactions', 'Voice messages', 'Quick polls']
    },
    {
      title: 'Mobile Networking',
      description: 'Connect with attendees through mobile interface',
      icon: Users,
      highlights: ['Profile discovery', 'Connection requests', 'In-app messaging']
    },
    {
      title: 'Smart Optimizations',
      description: 'Battery and performance management',
      icon: Zap,
      highlights: ['Battery optimization', 'Data savings', 'Offline support']
    }
  ];

  const renderDemo = () => {
    switch (activeDemo) {
      case 'browsing':
        return (
          <div className="h-screen overflow-hidden">
            <MobileEventBrowsing
              onEventSelect={(event) => setSelectedEvent(event)}
              onPurchase={(eventId) => console.log('Purchase:', eventId)}
              onLike={(eventId) => console.log('Like:', eventId)}
              onBookmark={(eventId) => console.log('Bookmark:', eventId)}
            />
          </div>
        );
      
      case 'purchase':
        return (
          <div className="h-screen overflow-hidden">
            <MobileTicketPurchase
              onPurchase={(data) => console.log('Purchase completed:', data)}
              onBack={() => setActiveDemo('browsing')}
            />
          </div>
        );
      
      case 'attendance':
        return (
          <div className="h-screen overflow-hidden">
            <MobileEventAttendance
              onLeave={() => setActiveDemo('overview')}
              onReaction={(emoji) => console.log('Reaction:', emoji)}
              onChat={(message) => console.log('Chat:', message)}
              onShare={() => console.log('Share event')}
            />
          </div>
        );
      
      case 'interactions':
        return (
          <div className="h-screen bg-gray-900 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900" />
            <MobileInteractions
              isLive={true}
              canInteract={true}
              onSendMessage={(message) => console.log('Message:', message)}
              onReaction={(emoji) => console.log('Reaction:', emoji)}
              onVoiceMessage={(blob) => console.log('Voice message:', blob)}
              onRaiseHand={() => console.log('Hand raised')}
              onPollVote={(pollId, optionId) => console.log('Poll vote:', pollId, optionId)}
            />
          </div>
        );
      
      case 'networking':
        return (
          <div className="h-screen overflow-hidden">
            <MobileNetworking
              onConnect={(userId, message) => console.log('Connect:', userId, message)}
              onMessage={(userId, message) => console.log('Message:', userId, message)}
              onScheduleMeeting={(userId, details) => console.log('Meeting:', userId, details)}
            />
          </div>
        );
      
      case 'optimizations':
        return (
          <div className="h-screen overflow-y-auto bg-gray-50 p-4">
            <MobileOptimizations
              onOptimizationChange={(optimization, enabled) => 
                console.log('Optimization changed:', optimization, enabled)
              }
              onQualityChange={(quality) => console.log('Quality changed:', quality)}
              onNotificationSchedule={(settings) => console.log('Notifications:', settings)}
            />
          </div>
        );
      
      default:
        return (
          <div className="p-6 space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                <Smartphone className="h-4 w-4" />
                Phase 4.2.10: Mobile Event Experience
              </div>
              <h1 className="text-3xl font-bold">
                Mobile-First Event Platform
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                A comprehensive mobile experience for discovering, purchasing, and attending events 
                with touch-optimized interactions and smart performance optimizations.
              </p>
            </div>

            {/* Key Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{feature.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                      <div className="space-y-1">
                        {feature.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-1 h-1 bg-purple-600 rounded-full" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Component Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Component Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Mobile Components</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Core</Badge>
                        <span>MobileEventBrowsing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Core</Badge>
                        <span>MobileTicketPurchase</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Core</Badge>
                        <span>MobileEventAttendance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Enhanced</Badge>
                        <span>MobileInteractions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Enhanced</Badge>
                        <span>MobileNetworking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Enhanced</Badge>
                        <span>MobileOptimizations</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Key Features</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>Touch-optimized interactions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>Swipe navigation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>Adaptive video quality</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>Battery optimization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>Offline functionality</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>Real-time interactions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Interactive Demos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {demoSections.slice(1).map((section) => {
                    const Icon = section.icon;
                    return (
                      <Button
                        key={section.id}
                        variant="outline"
                        className="h-auto p-4 justify-start"
                        onClick={() => setActiveDemo(section.id)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Icon className="h-5 w-5 text-purple-600" />
                          <div className="text-left">
                            <div className="font-medium text-sm">{section.title}</div>
                            <div className="text-xs text-gray-500">{section.description}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-auto" />
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Demo Header */}
      {activeDemo !== 'overview' && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 lg:hidden">
          <div className="flex items-center gap-3 p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveDemo('overview')}
              className="h-8 w-8 p-0"
            >
              ←
            </Button>
            <div>
              <h1 className="font-semibold text-sm">
                {demoSections.find(s => s.id === activeDemo)?.title}
              </h1>
              <p className="text-xs text-gray-600">Phase 4.2.10 Demo</p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:flex">
        <div className="w-80 h-screen bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="font-bold text-lg">Phase 4.2.10</h2>
                <p className="text-sm text-gray-600">Mobile Event Experience</p>
              </div>
              
              <nav className="space-y-2">
                {demoSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={activeDemo === section.id ? "default" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setActiveDemo(section.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Icon className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{section.title}</div>
                          <div className="text-xs opacity-70">{section.description}</div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {renderDemo()}
        </div>
      </div>

      {/* Mobile Full Screen */}
      <div className="lg:hidden">
        {renderDemo()}
      </div>
    </div>
  );
}