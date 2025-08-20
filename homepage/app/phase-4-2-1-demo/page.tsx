'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventAttendeePersonas } from '@/components/events/event-attendee-personas';
import { EventValuePyramid } from '@/components/events/event-value-pyramid';
import { CreatorEventMotivations } from '@/components/events/creator-event-motivations';
import {
  Users,
  Target,
  TrendingUp,
  Calendar,
  Ticket,
  Star,
  CheckCircle,
  ArrowRight,
  Brain,
  Heart,
  DollarSign,
  Sparkles,
  Trophy,
  Building,
  MessageCircle,
  Zap,
  Crown,
  Gift,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Phase421Demo() {
  const [selectedDemo, setSelectedDemo] = useState('overview');

  // Phase 4.2.1 statistics
  const phaseStats = {
    attendeePersonas: 5,
    valueTiers: 5,
    creatorMotivations: 5,
    successMetrics: 20,
    eventTypes: 8,
    revenueModels: 6
  };

  // Event Psychology Key Concepts
  const psychologyInsights = [
    {
      title: 'FOMO & Exclusivity',
      description: 'Limited availability drives immediate action',
      icon: Crown,
      color: 'text-purple-600',
      stats: '+67% conversion'
    },
    {
      title: 'Social Proof',
      description: 'Community participation validates decisions',
      icon: Users,
      color: 'text-blue-600',
      stats: '+45% attendance'
    },
    {
      title: 'Value Stacking',
      description: 'Multiple benefits justify premium pricing',
      icon: Gift,
      color: 'text-green-600',
      stats: '+3x pricing power'
    },
    {
      title: 'Emotional Connection',
      description: 'Personal relationships drive loyalty',
      icon: Heart,
      color: 'text-red-600',
      stats: '+82% retention'
    }
  ];

  // Event Success Framework
  const successFramework = [
    {
      phase: 'Discovery',
      description: 'Attendees find and evaluate events',
      keyFactors: ['Visual appeal', 'Clear value prop', 'Social signals', 'Price transparency'],
      conversion: '15-20%'
    },
    {
      phase: 'Consideration',
      description: 'Decision-making and comparison',
      keyFactors: ['Reviews/testimonials', 'FOMO triggers', 'Risk mitigation', 'Bonus incentives'],
      conversion: '25-35%'
    },
    {
      phase: 'Purchase',
      description: 'Completing the transaction',
      keyFactors: ['Simple checkout', 'Multiple payment options', 'Trust badges', 'Guarantees'],
      conversion: '60-70%'
    },
    {
      phase: 'Experience',
      description: 'Attending and engaging',
      keyFactors: ['Easy access', 'Quality content', 'Interaction opportunities', 'Technical reliability'],
      satisfaction: '85%+'
    },
    {
      phase: 'Advocacy',
      description: 'Sharing and returning',
      keyFactors: ['Memorable moments', 'Social sharing', 'Follow-up engagement', 'Loyalty rewards'],
      retention: '40-50%'
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.2.1: Event Psychology & Attendee Motivations
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Understanding the psychological drivers behind virtual event attendance to create 
          experiences that justify ticket purchases and sustain engagement
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Attendee Personas
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Value Pyramid
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Creator Motivations
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Engagement Models
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            Success Metrics
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Revenue Strategy
          </span>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">🧠 Event Psychology Platform Ready</h2>
        <p className="mb-6 text-lg opacity-90">
          Data-driven insights for creating virtual events that resonate with attendee motivations, 
          maximize creator revenue, and build lasting community connections
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/events">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Events Platform
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/creator/events">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Target className="w-5 h-5 mr-2" />
              Event Planning
            </Button>
          </Link>
        </div>
      </div>

      {/* Psychology Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {psychologyInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <Icon className={cn("w-12 h-12 mx-auto mb-3", insight.color)} />
                <h3 className="font-semibold mb-2">{insight.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                <Badge className="bg-green-100 text-green-700">
                  {insight.stats}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Interactive Demo */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Interactive Psychology Framework</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Brain className="w-3 h-3 mr-1" />
              Psychology-Driven
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Target className="w-3 h-3 mr-1" />
              Data-Backed
            </Badge>
          </div>
        </div>

        <Tabs value={selectedDemo} onValueChange={setSelectedDemo}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personas">Attendee Personas</TabsTrigger>
            <TabsTrigger value="value">Value Pyramid</TabsTrigger>
            <TabsTrigger value="motivations">Creator Motivations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              {/* Success Framework */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Success Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {successFramework.map((phase, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{phase.phase}</h4>
                          <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {phase.keyFactors.map((factor, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-green-600">
                              {phase.conversion || phase.satisfaction || phase.retention}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Key Features Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Psychological Drivers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Experience Seeking</div>
                          <div className="text-sm text-gray-600">Unique moments and exclusive access</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Community Belonging</div>
                          <div className="text-sm text-gray-600">Connection with like-minded fans</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="font-medium">Status & Recognition</div>
                          <div className="text-sm text-gray-600">VIP treatment and special acknowledgment</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="font-medium">Creator Support</div>
                          <div className="text-sm text-gray-600">Direct contribution to creator success</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Value Creation Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Crown className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Exclusivity</div>
                          <div className="text-sm text-gray-600">Limited attendance, never repeated</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Interaction</div>
                          <div className="text-sm text-gray-600">Q&A, meet & greets, participation</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Content</div>
                          <div className="text-sm text-gray-600">Performances, teaching, premieres</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-orange-600" />
                        <div>
                          <div className="font-medium">Memorabilia</div>
                          <div className="text-sm text-gray-600">Recordings, certificates, digital goods</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="personas" className="mt-6">
            <EventAttendeePersonas 
              showComparison={true}
              onPersonaSelect={(persona) => console.log('Selected persona:', persona)}
            />
          </TabsContent>

          <TabsContent value="value" className="mt-6">
            <EventValuePyramid 
              showCalculator={true}
              onTierSelect={(tier) => console.log('Selected tier:', tier)}
            />
          </TabsContent>

          <TabsContent value="motivations" className="mt-6">
            <CreatorEventMotivations 
              showStrategyBuilder={true}
              onMotivationSelect={(motivation) => console.log('Selected motivation:', motivation)}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{phaseStats.attendeePersonas}</div>
          <p className="text-gray-600 mt-1">Attendee Personas</p>
          <div className="text-sm text-blue-600 mt-2">Behavioral profiles</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{phaseStats.valueTiers}</div>
          <p className="text-gray-600 mt-1">Value Tiers</p>
          <div className="text-sm text-green-600 mt-2">Pyramid levels</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{phaseStats.creatorMotivations}</div>
          <p className="text-gray-600 mt-1">Creator Motivations</p>
          <div className="text-sm text-purple-600 mt-2">Strategic goals</div>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🧠 Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Attendee Psychology</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5 distinct attendee personas with motivations</li>
              <li>• Behavioral patterns and preferences</li>
              <li>• Price sensitivity analysis</li>
              <li>• Engagement level predictions</li>
              <li>• Demographic insights</li>
              <li>• Success metrics per persona</li>
              <li>• Pain points identification</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Value Framework</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5-tier value pyramid structure</li>
              <li>• Price multiplier calculations</li>
              <li>• Feature importance ratings</li>
              <li>• Implementation effort analysis</li>
              <li>• Persona appeal mapping</li>
              <li>• Interactive value calculator</li>
              <li>• ROI projections</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Creator Strategy</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5 motivation categories</li>
              <li>• Event type recommendations</li>
              <li>• Frequency optimization</li>
              <li>• Revenue model selection</li>
              <li>• Success metrics tracking</li>
              <li>• Strategy builder tool</li>
              <li>• Monthly projections</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Engagement Models</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Purchase funnel optimization</li>
              <li>• Conversion rate benchmarks</li>
              <li>• Retention strategies</li>
              <li>• Community building tactics</li>
              <li>• FOMO trigger implementation</li>
              <li>• Social proof mechanisms</li>
              <li>• Advocacy programs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}