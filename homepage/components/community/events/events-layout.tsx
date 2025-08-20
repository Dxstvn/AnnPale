'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  Search,
  Filter,
  Bell,
  ChevronRight,
  ChevronLeft,
  Star,
  TrendingUp,
  MapPin,
  Globe,
  Sparkles,
  PartyPopper,
  Trophy,
  Heart,
  MessageSquare,
  Gamepad2,
  Music,
  Flag,
  Coffee,
  BookOpen,
  Mic,
  Gift,
  Info,
  ArrowRight,
  Home,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import event components
import { EventCalendar } from './event-calendar';
import { EventTypes } from './event-types';
import { EventParticipation } from './event-participation';
import { EventRSVP } from './event-rsvp';
import { VirtualEventViewer } from './virtual-event-viewer';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  badge?: number | string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: string;
  attendees: number;
  isLive?: boolean;
}

interface EventsLayoutProps {
  initialView?: 'dashboard' | 'calendar' | 'types' | 'participation' | 'my-events' | 'live';
  userId?: string;
  isAuthenticated?: boolean;
  onNavigate?: (view: string, params?: any) => void;
  currentEventId?: string;
}

export function EventsLayout({
  initialView = 'dashboard',
  userId = 'user1',
  isAuthenticated = true,
  onNavigate,
  currentEventId
}: EventsLayoutProps) {
  const [currentView, setCurrentView] = React.useState(initialView);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null);
  const [showEventViewer, setShowEventViewer] = React.useState(false);

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: Home,
      description: 'Events dashboard'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      description: 'View all events',
      badge: '12'
    },
    {
      id: 'types',
      label: 'Event Types',
      icon: Sparkles,
      description: 'Browse categories'
    },
    {
      id: 'participation',
      label: 'My Progress',
      icon: Trophy,
      description: 'Participation stats',
      badge: 'Level 3'
    },
    {
      id: 'my-events',
      label: 'My Events',
      icon: Star,
      description: 'Registered & hosted',
      badge: '4'
    },
    {
      id: 'live',
      label: 'Live Now',
      icon: Video,
      description: 'Active events',
      badge: 'LIVE'
    }
  ];

  // Sample upcoming events
  const upcomingEvents: UpcomingEvent[] = [
    {
      id: 'event1',
      title: 'Kreyòl Konvèsasyon Club',
      date: new Date('2024-03-25T18:00:00'),
      time: '6:00 PM',
      type: 'Language Practice',
      attendees: 24,
      isLive: false
    },
    {
      id: 'event2',
      title: 'Creator Townhall',
      date: new Date('2024-03-28T19:00:00'),
      time: '7:00 PM',
      type: 'Official',
      attendees: 342,
      isLive: false
    },
    {
      id: 'event3',
      title: 'Game Night: Dominoes',
      date: new Date(),
      time: 'Now',
      type: 'Game Night',
      attendees: 67,
      isLive: true
    }
  ];

  // Event statistics
  const eventStats = {
    totalEvents: 847,
    thisWeek: 24,
    registered: 6,
    hosted: 2,
    points: 1850,
    level: 'Active Participant',
    streak: 5,
    badges: 12
  };

  const handleNavigation = (view: string, params?: any) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    onNavigate?.(view, params);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    if (event.status === 'live') {
      setShowEventViewer(true);
    } else {
      handleNavigation('event-details', { eventId: event.id });
    }
  };

  const renderSidebar = () => (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Community Events</h2>
          <p className="text-sm text-gray-600">Connect, learn, and celebrate</p>
        </div>

        {/* Quick Stats */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{eventStats.registered}</div>
                <div className="text-xs text-gray-600">Registered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">{eventStats.points}</div>
                <div className="text-xs text-gray-600">Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{eventStats.streak}</div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{eventStats.badges}</div>
                <div className="text-xs text-gray-600">Badges</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                  isActive
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.label}</div>
                  {item.description && (
                    <div className="text-xs opacity-70 truncate">{item.description}</div>
                  )}
                </div>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs",
                      item.badge === 'LIVE' && "bg-red-600 text-white animate-pulse",
                      item.badge === 'New' && "bg-green-100 text-green-700"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => handleEventClick(event)}
                >
                  {event.isLive && (
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{event.title}</div>
                    <div className="text-xs text-gray-500">
                      {event.isLive ? 'Live Now' : event.time}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {event.attendees}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={() => handleNavigation('create-event')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleNavigation('calendar')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Browse Events
          </Button>
        </div>

        {/* Event Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Popular Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Gamepad2, label: 'Games', color: 'bg-green-100 text-green-700' },
                { icon: MessageSquare, label: 'Language', color: 'bg-blue-100 text-blue-700' },
                { icon: Music, label: 'Music', color: 'bg-purple-100 text-purple-700' },
                { icon: Coffee, label: 'Social', color: 'bg-orange-100 text-orange-700' },
                { icon: BookOpen, label: 'Learn', color: 'bg-pink-100 text-pink-700' },
                { icon: Flag, label: 'Cultural', color: 'bg-yellow-100 text-yellow-700' }
              ].map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={index}
                    className={cn(
                      "p-2 rounded-lg flex flex-col items-center gap-1 hover:shadow-md transition-all",
                      cat.color
                    )}
                    onClick={() => handleNavigation('types')}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Community Events
              </h1>
              <p className="text-gray-600">
                Join virtual gatherings, connect with the community, and earn rewards!
              </p>
            </div>
            <PartyPopper className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{eventStats.thisWeek}</div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
              <Calendar className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{eventStats.registered}</div>
                <div className="text-sm text-gray-600">Registered</div>
              </div>
              <Users className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{eventStats.streak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{eventStats.points}</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <Trophy className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Featured Events This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Haiti Independence Celebration',
                date: 'Jan 1, 6:00 PM',
                type: 'Cultural',
                icon: Flag,
                color: 'bg-blue-100 text-blue-700',
                featured: true
              },
              {
                title: 'Creator Awards 2024',
                date: 'Apr 15, 7:00 PM',
                type: 'Special',
                icon: Trophy,
                color: 'bg-purple-100 text-purple-700',
                featured: true
              },
              {
                title: 'Rara Festival Watch Party',
                date: 'Mar 24, 7:00 PM',
                type: 'Cultural',
                icon: Music,
                color: 'bg-orange-100 text-orange-700',
                featured: true
              }
            ].map((event, index) => {
              const Icon = event.icon;
              return (
                <Card 
                  key={index}
                  className="hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        event.color
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <p className="text-xs text-gray-500">{event.date}</p>
                      </div>
                      {event.featured && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <Button size="sm" className="w-full">
                      RSVP Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Get Started with Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Browse Events</h4>
                <p className="text-xs text-gray-600">
                  Explore calendar for upcoming community gatherings
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">RSVP & Join</h4>
                <p className="text-xs text-gray-600">
                  Register for events and join virtual meetups
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Earn Rewards</h4>
                <p className="text-xs text-gray-600">
                  Participate to earn points, badges, and recognition
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      
      case 'calendar':
        return <EventCalendar onEventClick={handleEventClick} />;
      
      case 'types':
        return <EventTypes onTypeSelect={(typeId) => handleNavigation('calendar', { filter: typeId })} />;
      
      case 'participation':
        return <EventParticipation userId={userId} />;
      
      case 'event-details':
        return selectedEvent ? (
          <EventRSVP 
            event={{
              id: selectedEvent.id,
              title: selectedEvent.title,
              description: selectedEvent.description || 'Event description',
              date: selectedEvent.date || new Date(),
              startTime: selectedEvent.startTime || '7:00 PM',
              endTime: selectedEvent.endTime || '8:30 PM',
              location: 'virtual',
              host: {
                id: 'host1',
                name: 'Event Host',
                role: 'Host'
              },
              capacity: 100,
              registered: 45,
              tags: []
            }}
            userId={userId}
          />
        ) : null;
      
      case 'live':
        return showEventViewer ? (
          <VirtualEventViewer
            eventId={currentEventId || 'event1'}
            eventTitle="Live Community Event"
            onLeaveEvent={() => setShowEventViewer(false)}
          />
        ) : (
          <div className="text-center py-12">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Live Events</h3>
            <p className="text-gray-600">Check back later for live events</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => handleNavigation('calendar')}
            >
              Browse Upcoming Events
            </Button>
          </div>
        );
      
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-bold text-lg">Events</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t bg-white"
            >
              <div className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left",
                        currentView === item.id
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block">
          {renderSidebar()}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}