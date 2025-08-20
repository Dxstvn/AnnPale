'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventsHeroBanner, type FeaturedEvent } from '@/components/events/events-hero-banner';
import { EventsGridListing, type EventCard } from '@/components/events/events-grid-listing';
import { EventsFilterSystem, type EventFilters } from '@/components/events/events-filter-system';
import { EventDiscoveryAlgorithm, type UserPreferences } from '@/lib/events/discovery-algorithm';
import {
  Calendar,
  Grid3X3,
  List,
  Map,
  TrendingUp,
  Sparkles,
  Clock,
  Users,
  Star,
  Filter,
  Search,
  ChevronRight,
  ArrowRight,
  Ticket,
  Music,
  MessageCircle,
  GraduationCap,
  Video,
  PartyPopper,
  Mic
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Phase422Demo() {
  const [selectedView, setSelectedView] = useState<'grid' | 'list' | 'calendar' | 'map'>('grid');
  const [filters, setFilters] = useState<EventFilters>({
    dateRange: { from: undefined, to: undefined },
    priceRange: { min: 0, max: 500 },
    categories: [],
    languages: [],
    creators: [],
    sortBy: 'date',
    showSoldOut: true,
    showPastEvents: false
  });

  // Mock data for featured events
  const featuredEvents: FeaturedEvent[] = [
    {
      id: '1',
      title: 'Exclusive Haitian Music Festival',
      description: 'Join us for an unforgettable night of authentic Haitian music with special guest performances',
      imageUrl: '/api/placeholder/1200/600',
      videoPreviewUrl: undefined,
      creator: {
        id: 'c1',
        name: 'Michel Martelly',
        avatarUrl: '/api/placeholder/100/100',
        verified: true
      },
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      duration: 120,
      price: 75,
      currency: 'USD',
      spotsRemaining: 45,
      totalSpots: 200,
      category: 'Concerts & Shows',
      language: 'Haitian Creole',
      tags: ['music', 'festival', 'live'],
      isTrending: true,
      isFeatured: true,
      attendees: 155
    },
    {
      id: '2',
      title: 'Cooking Masterclass: Traditional Haitian Cuisine',
      description: 'Learn to cook authentic Haitian dishes with renowned chef Marie Pierre',
      imageUrl: '/api/placeholder/1200/600',
      creator: {
        id: 'c2',
        name: 'Chef Marie Pierre',
        avatarUrl: '/api/placeholder/100/100',
        verified: true
      },
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      duration: 90,
      price: 45,
      currency: 'USD',
      spotsRemaining: 8,
      totalSpots: 30,
      category: 'Workshops & Classes',
      language: 'French',
      tags: ['cooking', 'workshop', 'culture'],
      isLastChance: true,
      attendees: 22
    }
  ];

  // Mock data for event listings
  const allEvents: EventCard[] = [
    ...featuredEvents.map(fe => ({
      ...fe,
      rating: 4.8,
      viewCount: 1250,
      savedByUser: false
    })),
    {
      id: '3',
      title: 'Q&A with Wyclef Jean',
      description: 'An intimate conversation about music, culture, and giving back',
      imageUrl: '/api/placeholder/600/400',
      creator: {
        id: 'c3',
        name: 'Wyclef Jean',
        avatarUrl: '/api/placeholder/100/100',
        verified: true
      },
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      duration: 60,
      price: 50,
      originalPrice: 65,
      currency: 'USD',
      spotsRemaining: 100,
      totalSpots: 150,
      category: 'Q&A Sessions',
      language: 'English',
      tags: ['music', 'qa', 'celebrity'],
      attendees: 50,
      rating: 4.9,
      isOnSale: true,
      savedByUser: false,
      viewCount: 890
    },
    {
      id: '4',
      title: 'Haitian Art Exhibition Virtual Tour',
      description: 'Explore contemporary Haitian art with curator Jean-Michel',
      imageUrl: '/api/placeholder/600/400',
      creator: {
        id: 'c4',
        name: 'Jean-Michel Basquiat Gallery',
        avatarUrl: '/api/placeholder/100/100',
        verified: false
      },
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      duration: 45,
      price: 25,
      currency: 'USD',
      spotsRemaining: 200,
      totalSpots: 500,
      category: 'Special Occasions',
      language: 'English',
      tags: ['art', 'culture', 'virtual'],
      attendees: 300,
      rating: 4.7,
      isNew: true,
      savedByUser: true,
      viewCount: 450
    },
    {
      id: '5',
      title: 'Kompa Dance Workshop',
      description: 'Learn the traditional Haitian dance with professional instructors',
      imageUrl: '/api/placeholder/600/400',
      creator: {
        id: 'c5',
        name: 'Dance Haiti Studio',
        avatarUrl: '/api/placeholder/100/100',
        verified: true
      },
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      duration: 90,
      price: 40,
      currency: 'USD',
      spotsRemaining: 2,
      totalSpots: 20,
      category: 'Workshops & Classes',
      language: 'Haitian Creole',
      tags: ['dance', 'workshop', 'culture'],
      attendees: 18,
      rating: 5.0,
      savedByUser: false,
      viewCount: 670
    },
    {
      id: '6',
      title: 'Haiti Independence Day Celebration',
      description: 'Virtual celebration with music, poetry, and historical presentations',
      imageUrl: '/api/placeholder/600/400',
      creator: {
        id: 'c6',
        name: 'Haitian Cultural Center',
        avatarUrl: '/api/placeholder/100/100',
        verified: true
      },
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      duration: 180,
      price: 0,
      currency: 'USD',
      spotsRemaining: 0,
      totalSpots: 1000,
      category: 'Special Occasions',
      language: 'Haitian Creole',
      tags: ['celebration', 'culture', 'free'],
      attendees: 1000,
      rating: 4.9,
      isSoldOut: true,
      savedByUser: false,
      viewCount: 3200
    }
  ];

  // Mock user preferences for algorithm
  const userPreferences: UserPreferences = {
    favoriteCategories: ['Concerts & Shows', 'Workshops & Classes'],
    favoriteCreators: ['c1', 'c3'],
    preferredLanguages: ['English', 'Haitian Creole'],
    priceRange: { min: 0, max: 100 },
    preferredDays: ['friday', 'saturday', 'sunday'],
    preferredTimes: ['evening']
  };

  // Apply discovery algorithm
  const discoveryAlgorithm = useMemo(
    () => new EventDiscoveryAlgorithm(userPreferences),
    []
  );

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    // Apply filters
    if (filters.categories.length > 0) {
      events = events.filter(e => filters.categories.includes(e.category));
    }
    if (filters.languages.length > 0) {
      events = events.filter(e => filters.languages.includes(e.language));
    }
    if (!filters.showSoldOut) {
      events = events.filter(e => !e.isSoldOut);
    }
    if (filters.priceRange.min > 0 || filters.priceRange.max < 500) {
      events = events.filter(e => 
        e.price >= filters.priceRange.min && e.price <= filters.priceRange.max
      );
    }

    // Apply sorting
    if (filters.sortBy === 'price') {
      events.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'popularity') {
      events.sort((a, b) => (b.attendees || 0) - (a.attendees || 0));
    } else if (filters.sortBy === 'spots') {
      events.sort((a, b) => a.spotsRemaining - b.spotsRemaining);
    } else {
      // Use discovery algorithm for default sorting
      events = discoveryAlgorithm.sortEvents(events);
    }

    return events;
  }, [allEvents, filters, discoveryAlgorithm]);

  // Event categories with counts
  const categories = [
    { id: 'concerts', name: 'Concerts & Shows', icon: Music, count: 2, color: 'bg-purple-500' },
    { id: 'meetgreets', name: 'Meet & Greets', icon: Users, count: 0, color: 'bg-blue-500' },
    { id: 'workshops', name: 'Workshops & Classes', icon: GraduationCap, count: 2, color: 'bg-green-500' },
    { id: 'qa', name: 'Q&A Sessions', icon: MessageCircle, count: 1, color: 'bg-yellow-500' },
    { id: 'watch', name: 'Watch Parties', icon: Video, count: 0, color: 'bg-red-500' },
    { id: 'special', name: 'Special Occasions', icon: PartyPopper, count: 2, color: 'bg-pink-500' },
    { id: 'podcasts', name: 'Podcasts & Talks', icon: Mic, count: 0, color: 'bg-indigo-500' }
  ];

  // Mock creators list
  const creators = [
    { id: 'c1', name: 'Michel Martelly', verified: true },
    { id: 'c2', name: 'Chef Marie Pierre', verified: true },
    { id: 'c3', name: 'Wyclef Jean', verified: true },
    { id: 'c4', name: 'Jean-Michel Basquiat Gallery', verified: false },
    { id: 'c5', name: 'Dance Haiti Studio', verified: true },
    { id: 'c6', name: 'Haitian Cultural Center', verified: true }
  ];

  const languages = ['English', 'French', 'Haitian Creole', 'Spanish'];

  // Phase 4.2.2 statistics
  const phaseStats = {
    totalEvents: allEvents.length,
    filteredEvents: filteredEvents.length,
    categories: 7,
    featuredEvents: featuredEvents.length,
    trendingEvents: allEvents.filter(e => e.isTrending).length,
    soldOutEvents: allEvents.filter(e => e.isSoldOut).length
  };

  const handleEventClick = (event: any) => {
    console.log('Event clicked:', event);
  };

  const handleBookmark = (event: any) => {
    console.log('Event bookmarked:', event);
  };

  const handleShare = (event: any) => {
    console.log('Event shared:', event);
  };

  const handleQuickBook = (event: any) => {
    console.log('Quick book:', event);
  };

  const handleQuickPurchase = (event: any) => {
    console.log('Quick purchase:', event);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.2.2: Events Discovery & Listing Page
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Comprehensive event discovery platform with intelligent recommendations, advanced filtering, 
          and multiple viewing options for finding the perfect virtual events
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Hero Banner
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Event Grid
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Smart Filters
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Categories
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            Discovery Algorithm
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Promotional Slots
          </span>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">🎟️ Events Discovery Platform Ready</h2>
        <p className="mb-6 text-lg opacity-90">
          Advanced event discovery with personalized recommendations, smart filtering, 
          and multiple viewing options to help users find their perfect events
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/events">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Events
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/events/calendar">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Calendar View
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Banner */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Featured Events</h2>
        <EventsHeroBanner
          featuredEvents={featuredEvents}
          onEventClick={handleEventClick}
          onQuickPurchase={handleQuickPurchase}
        />
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedView === 'grid' ? 'default' : 'outline'}
              onClick={() => setSelectedView('grid')}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              size="sm"
              variant={selectedView === 'list' ? 'default' : 'outline'}
              onClick={() => setSelectedView('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              size="sm"
              variant={selectedView === 'calendar' ? 'default' : 'outline'}
              onClick={() => setSelectedView('calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button
              size="sm"
              variant={selectedView === 'map' ? 'default' : 'outline'}
              onClick={() => setSelectedView('map')}
              disabled
            >
              <Map className="h-4 w-4 mr-2" />
              Map
            </Button>
          </div>
        </div>

        {/* Filters and Categories */}
        <EventsFilterSystem
          filters={filters}
          categories={categories}
          languages={languages}
          creators={creators}
          onFiltersChange={setFilters}
          onCategorySelect={(category) => console.log('Category:', category)}
          totalEvents={allEvents.length}
          filteredEvents={filteredEvents.length}
        />

        {/* Promotional Slots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                Staff Picks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Curated by our team</p>
              <Badge className="mt-2">2 events</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Popular this week</p>
              <Badge className="mt-2">{phaseStats.trendingEvents} events</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-600" />
                Last Chance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Starting soon</p>
              <Badge className="mt-2">1 event</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Events Listing */}
        {selectedView === 'calendar' ? (
          <Card className="p-8">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Calendar View</h3>
              <p className="text-gray-600">
                Calendar view will display events in a monthly/weekly calendar format
              </p>
            </div>
          </Card>
        ) : (
          <EventsGridListing
            events={filteredEvents}
            view={selectedView as 'grid' | 'list'}
            columns={3}
            onEventClick={handleEventClick}
            onBookmark={handleBookmark}
            onShare={handleShare}
            onQuickBook={handleQuickBook}
          />
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{phaseStats.totalEvents}</div>
          <p className="text-gray-600 mt-1">Total Events</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{phaseStats.categories}</div>
          <p className="text-gray-600 mt-1">Event Categories</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{phaseStats.featuredEvents}</div>
          <p className="text-gray-600 mt-1">Featured Events</p>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🎯 Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Discovery Features</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Rotating hero banner with countdown timer</li>
              <li>• Quick purchase functionality</li>
              <li>• Video preview support</li>
              <li>• Grid and list view options</li>
              <li>• Visual event cards with hierarchy</li>
              <li>• Spots remaining indicator</li>
              <li>• Social proof (attendee count)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Filtering System</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Date range picker</li>
              <li>• Price range slider</li>
              <li>• Category selection</li>
              <li>• Language filtering</li>
              <li>• Creator filtering</li>
              <li>• Sort options (date, price, popularity)</li>
              <li>• Show/hide sold out events</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Discovery Algorithm</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• User preferences (30% weight)</li>
              <li>• Trending velocity (25% weight)</li>
              <li>• Time proximity (20% weight)</li>
              <li>• Creator following (15% weight)</li>
              <li>• Price match (10% weight)</li>
              <li>• Personalized recommendations</li>
              <li>• Promotional slot prioritization</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Promotional Slots</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Featured events (paid)</li>
              <li>• Staff picks (curated)</li>
              <li>• Community choice</li>
              <li>• New creator spotlight</li>
              <li>• Last chance (ending soon)</li>
              <li>• Trending events</li>
              <li>• Priority display positioning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}