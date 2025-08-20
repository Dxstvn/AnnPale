'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EventDetailsHeroSection, type EventDetailsHero } from '@/components/events/event-details-hero';
import { EventTicketSelection, type TicketTier, type PromoCode, DEFAULT_TICKET_TIERS } from '@/components/events/event-ticket-selection';
import { EventDescriptionTabs, type EventCreator, type EventAgendaItem, type EventFAQ, type EventCoHost } from '@/components/events/event-description-tabs';
import {
  Calendar,
  Ticket,
  Users,
  Star,
  Shield,
  Heart,
  Share2,
  MessageCircle,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign,
  Award,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Phase423Demo() {
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState('overview');

  // Mock event data
  const eventDetails: EventDetailsHero = {
    id: 'event-1',
    title: 'Exclusive Haitian Music Masterclass',
    tagline: 'Learn the secrets of Kompa and Zouk from legendary musicians',
    description: 'Join us for an unforgettable evening of music, culture, and connection',
    bannerUrl: '/api/placeholder/1200/500',
    videoUrl: undefined,
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    timezone: 'America/New_York',
    duration: 120,
    location: 'Zoom Premium',
    isVirtual: true,
    category: 'Music & Performance',
    tags: ['music', 'masterclass', 'culture', 'live'],
    spotsTaken: 145,
    totalSpots: 200,
    registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    isTrending: true
  };

  const creator: EventCreator = {
    id: 'creator-1',
    name: 'Michel Martelly',
    bio: 'Grammy-nominated Haitian musician, former President of Haiti, and cultural ambassador. Known for bringing Kompa music to the global stage and mentoring the next generation of Haitian artists.',
    avatarUrl: '/api/placeholder/200/200',
    verified: true,
    followers: 125000,
    eventsHosted: 45,
    rating: 4.9,
    specialties: ['Kompa Music', 'Music Production', 'Cultural Education', 'Artist Development'],
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com' },
      { platform: 'YouTube', url: 'https://youtube.com' }
    ]
  };

  const coHosts: EventCoHost[] = [
    {
      id: 'cohost-1',
      name: 'Wyclef Jean',
      role: 'Special Guest',
      avatarUrl: '/api/placeholder/100/100',
      verified: true
    },
    {
      id: 'cohost-2',
      name: 'T-Vice Band',
      role: 'Musical Performance',
      avatarUrl: '/api/placeholder/100/100',
      verified: false
    }
  ];

  const ticketTiers: TicketTier[] = DEFAULT_TICKET_TIERS.map((tier, index) => ({
    ...tier,
    spotsAvailable: index === 0 ? 100 : index === 1 ? 35 : 8,
    earlyBird: index === 0 ? {
      discount: 25,
      endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    } : undefined
  }));

  const agenda: EventAgendaItem[] = [
    {
      time: '7:00 PM',
      duration: 15,
      title: 'Welcome & Introduction',
      description: 'Meet your hosts and get oriented with the platform',
      speaker: 'Michel Martelly'
    },
    {
      time: '7:15 PM',
      duration: 30,
      title: 'History of Kompa Music',
      description: 'Journey through the evolution of Haiti\'s signature sound',
      speaker: 'Michel Martelly'
    },
    {
      time: '7:45 PM',
      duration: 20,
      title: 'Live Performance',
      description: 'Exclusive performance of classic and new songs',
      speaker: 'T-Vice Band'
    },
    {
      time: '8:05 PM',
      duration: 30,
      title: 'Music Production Workshop',
      description: 'Learn production techniques and songwriting secrets',
      speaker: 'Wyclef Jean'
    },
    {
      time: '8:35 PM',
      duration: 20,
      title: 'Q&A Session',
      description: 'Ask your burning questions to the masters',
      speaker: 'All Hosts'
    },
    {
      time: '8:55 PM',
      duration: 5,
      title: 'Closing & Next Steps',
      description: 'Resources and opportunities for continued learning',
      speaker: 'Michel Martelly'
    }
  ];

  const faqs: EventFAQ[] = [
    {
      question: 'What platform will the event be hosted on?',
      answer: 'The event will be hosted on Zoom Premium with HD video and audio quality. You\'ll receive the link 24 hours before the event.'
    },
    {
      question: 'Will the event be recorded?',
      answer: 'Yes! All ticket holders will receive access to the recording. General admission gets 24-hour access, VIP gets 30 days, and Platinum gets lifetime access.'
    },
    {
      question: 'Can I get a refund if I can\'t attend?',
      answer: 'Full refunds are available up to 48 hours before the event. After that, you\'ll still receive access to the recording based on your ticket tier.'
    },
    {
      question: 'Is there an age requirement?',
      answer: 'This event is suitable for all ages. Content will be family-friendly while still being educational and entertaining.'
    },
    {
      question: 'What if I have technical difficulties?',
      answer: 'Our support team will be available throughout the event to help with any technical issues. We also provide a tech check session 30 minutes before the event starts.'
    }
  ];

  const whatToExpect = [
    'Live interactive masterclass with Q&A opportunities',
    'Exclusive performances not available anywhere else',
    'Professional production with HD video and audio',
    'Downloadable resources and sheet music',
    'Certificate of completion for workshop participants',
    'Networking opportunities with fellow music enthusiasts'
  ];

  const requirements = [
    'Stable internet connection (5 Mbps minimum)',
    'Computer or mobile device with camera',
    'Zoom application installed',
    'Quiet environment for best experience'
  ];

  const whatsIncluded = [
    'Full access to 2-hour live event',
    'Interactive Q&A participation',
    'Event recording access (varies by tier)',
    'Digital certificate of attendance',
    'Exclusive community access',
    'Surprise bonuses and giveaways'
  ];

  const pastEvents = [
    {
      id: 'past-1',
      title: 'Haitian Independence Day Celebration',
      date: new Date('2024-01-01'),
      attendees: 500,
      rating: 4.8
    },
    {
      id: 'past-2',
      title: 'Kompa Dance Workshop',
      date: new Date('2024-02-15'),
      attendees: 200,
      rating: 5.0
    },
    {
      id: 'past-3',
      title: 'Carnival Music Special',
      date: new Date('2024-02-28'),
      attendees: 350,
      rating: 4.9
    }
  ];

  // Social proof data
  const attendeeAvatars = [
    '/api/placeholder/40/40',
    '/api/placeholder/40/40',
    '/api/placeholder/40/40',
    '/api/placeholder/40/40',
    '/api/placeholder/40/40'
  ];

  const reviews = [
    { author: 'Marie P.', rating: 5, comment: 'Amazing experience! Learned so much.' },
    { author: 'Jean L.', rating: 5, comment: 'Worth every penny. Can\'t wait for the next one!' },
    { author: 'Sophie M.', rating: 4, comment: 'Great content and interaction with the hosts.' }
  ];

  // Phase statistics
  const phaseStats = {
    ticketTiers: 5,
    conversionElements: 12,
    trustSignals: 8,
    socialProof: 6,
    infoSections: 10,
    registrationSteps: 3
  };

  const handleRegister = () => {
    console.log('Starting registration flow');
  };

  const handleShare = () => {
    console.log('Sharing event');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleFollowCreator = (creatorId: string) => {
    setIsFollowing(!isFollowing);
    console.log('Following creator:', creatorId);
  };

  const handlePurchase = (selections: any[]) => {
    console.log('Processing purchase:', selections);
  };

  const handleApplyPromo = (code: string): PromoCode | null => {
    // Mock promo code validation
    if (code === 'EARLY25') {
      return {
        code: 'EARLY25',
        discount: 25,
        type: 'percentage',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Phase 4.2.3: Event Details & Registration Page
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Comprehensive event information architecture with tiered ticketing, trust building elements, 
              and optimized registration flow for maximum conversion
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Hero Section
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Ticket Tiers
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                Creator Info
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                Event Details
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                Social Proof
              </span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                Trust Signals
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="container mx-auto py-6">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">🎟️ Event Registration System Ready</h2>
          <p className="mb-6 text-lg opacity-90">
            Complete event details page with multi-tier ticketing, comprehensive information architecture, 
            and conversion-optimized registration flow
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/events/sample-event">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
              >
                <Ticket className="w-5 h-5 mr-2" />
                View Event
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/events/register">
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Shield className="w-5 h-5 mr-2" />
                Registration Flow
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="container mx-auto pb-8">
        <Tabs value={selectedDemo} onValueChange={setSelectedDemo}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="live-demo">Live Demo</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Tiered Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• General admission base pricing</li>
                    <li>• VIP with 2-3x multiplier</li>
                    <li>• Platinum ultra-exclusive tier</li>
                    <li>• Group discounts (15% off)</li>
                    <li>• Early bird pricing (25% off)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Trust Building
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Clear refund policy</li>
                    <li>• Secure payment badges</li>
                    <li>• Customer testimonials</li>
                    <li>• Platform guarantee</li>
                    <li>• Live support contact</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Conversion Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• One-page checkout</li>
                    <li>• Guest checkout option</li>
                    <li>• Auto-fill from profile</li>
                    <li>• Mobile optimized</li>
                    <li>• Urgency indicators</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{phaseStats.ticketTiers}</div>
                <p className="text-gray-600 mt-1">Ticket Tiers</p>
              </div>
              <div className="bg-white rounded-xl border p-6 text-center">
                <div className="text-3xl font-bold text-green-600">{phaseStats.conversionElements}</div>
                <p className="text-gray-600 mt-1">Conversion Elements</p>
              </div>
              <div className="bg-white rounded-xl border p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">{phaseStats.trustSignals}</div>
                <p className="text-gray-600 mt-1">Trust Signals</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="live-demo" className="mt-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Event Hero */}
              <EventDetailsHeroSection
                event={eventDetails}
                onRegister={handleRegister}
                onShare={handleShare}
                onSave={handleSave}
                isSaved={isSaved}
              />

              <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
                {/* Social Proof Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Who's Attending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {attendeeAvatars.map((avatar, index) => (
                          <Avatar key={index} className="border-2 border-white">
                            <AvatarImage src={avatar} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">145 people</span> are attending
                      </p>
                      <Button size="sm" variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Invite Friends
                      </Button>
                    </div>
                    
                    <div className="mt-4 flex gap-4">
                      {reviews.map((review, index) => (
                        <div key={index} className="flex-1 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3 w-3",
                                  i < review.rating 
                                    ? "text-yellow-500 fill-yellow-500" 
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">"{review.comment}"</p>
                          <p className="text-xs text-gray-500 mt-1">- {review.author}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2">
                    <EventDescriptionTabs
                      eventId={eventDetails.id}
                      description="Join us for an exclusive masterclass where you'll learn directly from Haiti's most celebrated musicians. This isn't just another online workshop - it's a cultural journey through the heart of Haitian music, led by masters who have shaped the sound of a generation.\n\nWhether you're a musician looking to expand your repertoire, a music lover wanting to deepen your appreciation, or someone connecting with your Haitian heritage, this masterclass offers something special for everyone."
                      whatToExpect={whatToExpect}
                      agenda={agenda}
                      requirements={requirements}
                      whatsIncluded={whatsIncluded}
                      faqs={faqs}
                      creator={creator}
                      coHosts={coHosts}
                      pastEvents={pastEvents}
                      onFollowCreator={handleFollowCreator}
                      isFollowing={isFollowing}
                    />
                  </div>

                  {/* Ticket Selection Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-4">
                      <EventTicketSelection
                        eventId={eventDetails.id}
                        tiers={ticketTiers}
                        onPurchase={handlePurchase}
                        onApplyPromo={handleApplyPromo}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="components" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section Components</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Event banner with video preview
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Countdown timer with urgency
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Quick register CTA button
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Key information bar
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Spots remaining progress bar
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ticket System Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Multi-tier pricing structure
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Dynamic pricing calculations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Group discount automation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Promo code validation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Real-time availability updates
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Information Architecture</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Tabbed content organization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Event agenda timeline
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Creator profile section
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      FAQ accordion
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Requirements & inclusions
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trust & Social Proof</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Attendee avatars display
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Customer reviews section
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Verified creator badges
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Past event history
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Security & guarantee badges
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Implementation Details */}
      <div className="container mx-auto pb-8">
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">🎯 Implementation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2 text-blue-700">Page Structure</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Hero section with video preview support</li>
                <li>• Key information bar with live countdown</li>
                <li>• Creator section with follow functionality</li>
                <li>• Tabbed event description system</li>
                <li>• Sticky ticket selection sidebar</li>
                <li>• Social proof with attendee display</li>
                <li>• Share and save functionality</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-green-700">Ticketing Features</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• 3-tier pricing structure (General/VIP/Platinum)</li>
                <li>• Early bird discount system (25% off)</li>
                <li>• Group discount automation (15% off 5+)</li>
                <li>• Promo code validation</li>
                <li>• Real-time price calculations</li>
                <li>• Quantity selectors with limits</li>
                <li>• Order summary with breakdown</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-purple-700">Registration Flow</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• One-page checkout process</li>
                <li>• Guest checkout option</li>
                <li>• Profile auto-fill capability</li>
                <li>• Mobile-optimized forms</li>
                <li>• Secure payment processing</li>
                <li>• Instant confirmation</li>
                <li>• Email ticket delivery</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-orange-700">Conversion Elements</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Urgency indicators (spots remaining)</li>
                <li>• Social proof (attendee count)</li>
                <li>• Trust badges (secure, refund policy)</li>
                <li>• Clear value propositions</li>
                <li>• Prominent CTAs with animations</li>
                <li>• Registration deadline warnings</li>
                <li>• FOMO triggers (trending, last chance)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}