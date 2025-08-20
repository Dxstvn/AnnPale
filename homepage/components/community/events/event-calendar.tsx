'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Star,
  Bell,
  BellOff,
  Globe,
  Music,
  Gamepad2,
  BookOpen,
  Trophy,
  Gift,
  Heart,
  Mic,
  Coffee,
  MessageSquare,
  Sparkles,
  PartyPopper,
  Flag,
  Utensils,
  Award,
  ArrowRight,
  Info,
  Share2,
  Download,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface EventItem {
  id: string;
  title: string;
  description: string;
  type: 'regular' | 'special' | 'member-led' | 'cultural';
  category: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: 'virtual' | 'hybrid' | 'in-person';
  locationDetails?: string;
  host: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  capacity?: number;
  registered: number;
  waitlist?: number;
  featured?: boolean;
  premium?: boolean;
  points?: number;
  tags: string[];
  coverImage?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    until?: Date;
  };
  status: 'upcoming' | 'live' | 'ended' | 'cancelled';
}

interface EventCalendarProps {
  events?: EventItem[];
  currentUserId?: string;
  onEventClick?: (event: EventItem) => void;
  onRSVP?: (eventId: string) => void;
  onCreateEvent?: () => void;
  showFilters?: boolean;
  view?: 'calendar' | 'list' | 'grid';
  filteredType?: string;
}

export function EventCalendar({
  events = [],
  currentUserId,
  onEventClick,
  onRSVP,
  onCreateEvent,
  showFilters = true,
  view = 'calendar',
  filteredType
}: EventCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedView, setSelectedView] = React.useState(view);
  const [filterType, setFilterType] = React.useState(filteredType || 'all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedEvent, setSelectedEvent] = React.useState<EventItem | null>(null);

  // Sample events data
  const sampleEvents: EventItem[] = [
    // Regular Events
    {
      id: 'weekly1',
      title: 'Kreyòl Konvèsasyon Club',
      description: 'Weekly Haitian Creole conversation practice for all levels',
      type: 'regular',
      category: 'language',
      date: new Date('2024-03-25T18:00:00'),
      startTime: '6:00 PM',
      endTime: '7:30 PM',
      location: 'virtual',
      host: {
        id: 'host1',
        name: 'Marie Delacroix',
        avatar: '👩🏾‍🏫',
        role: 'Language Coach'
      },
      capacity: 30,
      registered: 24,
      points: 50,
      tags: ['Language', 'Weekly', 'Beginners Welcome'],
      recurring: {
        frequency: 'weekly'
      },
      status: 'upcoming'
    },
    {
      id: 'monthly1',
      title: 'Creator Townhall',
      description: 'Monthly community meeting with platform updates and Q&A',
      type: 'regular',
      category: 'townhall',
      date: new Date('2024-03-28T19:00:00'),
      startTime: '7:00 PM',
      endTime: '8:30 PM',
      location: 'virtual',
      host: {
        id: 'admin1',
        name: 'Ann Pale Team',
        avatar: '🎭',
        role: 'Platform Admin'
      },
      capacity: 500,
      registered: 342,
      featured: true,
      points: 100,
      tags: ['Official', 'Monthly', 'Updates'],
      recurring: {
        frequency: 'monthly'
      },
      status: 'upcoming'
    },
    {
      id: 'weekly2',
      title: 'Game Night: Dominoes Tournament',
      description: 'Traditional Haitian dominoes tournament with prizes',
      type: 'regular',
      category: 'game',
      date: new Date('2024-03-26T20:00:00'),
      startTime: '8:00 PM',
      endTime: '10:00 PM',
      location: 'virtual',
      host: {
        id: 'host2',
        name: 'Jean Baptiste',
        avatar: '🎲',
        role: 'Community Leader'
      },
      capacity: 100,
      registered: 67,
      points: 75,
      tags: ['Games', 'Tournament', 'Prizes'],
      recurring: {
        frequency: 'weekly'
      },
      status: 'upcoming'
    },

    // Special Events
    {
      id: 'special1',
      title: 'Haiti Independence Day Celebration',
      description: 'Virtual celebration of Haiti\'s Independence with music, history, and culture',
      type: 'special',
      category: 'celebration',
      date: new Date('2024-01-01T18:00:00'),
      startTime: '6:00 PM',
      endTime: '11:00 PM',
      location: 'virtual',
      host: {
        id: 'platform',
        name: 'Ann Pale',
        avatar: '🇭🇹',
        role: 'Platform'
      },
      registered: 1250,
      featured: true,
      premium: true,
      points: 200,
      tags: ['Holiday', 'Cultural', 'Special Event'],
      coverImage: '/haiti-flag.jpg',
      status: 'ended'
    },
    {
      id: 'special2',
      title: 'Creator Awards 2024',
      description: 'Annual awards ceremony recognizing top creators',
      type: 'special',
      category: 'awards',
      date: new Date('2024-04-15T19:00:00'),
      startTime: '7:00 PM',
      endTime: '9:00 PM',
      location: 'virtual',
      host: {
        id: 'platform',
        name: 'Ann Pale',
        avatar: '🏆',
        role: 'Platform'
      },
      capacity: 1000,
      registered: 856,
      featured: true,
      points: 150,
      tags: ['Awards', 'Annual', 'Exclusive'],
      status: 'upcoming'
    },

    // Member-Led Events
    {
      id: 'member1',
      title: 'Haitian Cooking Class: Griot',
      description: 'Learn to cook traditional Haitian griot with Chef Pierre',
      type: 'member-led',
      category: 'workshop',
      date: new Date('2024-03-27T17:00:00'),
      startTime: '5:00 PM',
      endTime: '6:30 PM',
      location: 'virtual',
      host: {
        id: 'member1',
        name: 'Chef Pierre',
        avatar: '👨🏾‍🍳',
        role: 'Community Member'
      },
      capacity: 50,
      registered: 45,
      waitlist: 12,
      points: 60,
      tags: ['Cooking', 'Workshop', 'Haitian Cuisine'],
      status: 'upcoming'
    },
    {
      id: 'member2',
      title: 'Book Club: Breath, Eyes, Memory',
      description: 'Monthly book discussion featuring Haitian literature',
      type: 'member-led',
      category: 'bookclub',
      date: new Date('2024-03-30T15:00:00'),
      startTime: '3:00 PM',
      endTime: '4:30 PM',
      location: 'virtual',
      host: {
        id: 'member2',
        name: 'Sophia Laurent',
        avatar: '📚',
        role: 'Book Club Leader'
      },
      capacity: 25,
      registered: 18,
      points: 40,
      tags: ['Literature', 'Discussion', 'Monthly'],
      status: 'upcoming'
    },

    // Cultural Events
    {
      id: 'cultural1',
      title: 'Rara Festival Watch Party',
      description: 'Virtual watch party of Haiti\'s traditional Rara festival',
      type: 'cultural',
      category: 'festival',
      date: new Date('2024-03-24T19:00:00'),
      startTime: '7:00 PM',
      endTime: '9:00 PM',
      location: 'virtual',
      host: {
        id: 'cultural',
        name: 'Cultural Committee',
        avatar: '🎭',
        role: 'Committee'
      },
      registered: 234,
      featured: true,
      points: 80,
      tags: ['Cultural', 'Music', 'Festival'],
      status: 'upcoming'
    },
    {
      id: 'cultural2',
      title: 'Haitian Heritage Month Kickoff',
      description: 'Opening ceremony for Haitian Heritage Month celebrations',
      type: 'cultural',
      category: 'heritage',
      date: new Date('2024-05-01T18:00:00'),
      startTime: '6:00 PM',
      endTime: '8:00 PM',
      location: 'hybrid',
      locationDetails: 'Miami, FL + Virtual',
      host: {
        id: 'platform',
        name: 'Ann Pale',
        avatar: '🌺',
        role: 'Platform'
      },
      capacity: 500,
      registered: 389,
      featured: true,
      points: 100,
      tags: ['Heritage', 'Cultural', 'Hybrid'],
      status: 'upcoming'
    }
  ];

  const allEvents = events.length > 0 ? events : sampleEvents;

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Get month calendar data
  const getMonthCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      calendar.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return calendar;
  };

  // Filter events
  const filteredEvents = React.useMemo(() => {
    let filtered = allEvents;

    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
    }

    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents, filterType, searchQuery, selectedDate]);

  const getEventIcon = (category: string) => {
    const icons: Record<string, React.ElementType> = {
      language: MessageSquare,
      townhall: Mic,
      game: Gamepad2,
      celebration: PartyPopper,
      awards: Trophy,
      workshop: BookOpen,
      bookclub: BookOpen,
      festival: Music,
      heritage: Flag,
      food: Utensils,
      support: Heart,
      networking: Users,
      education: BookOpen
    };
    return icons[category] || Calendar;
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      regular: 'bg-blue-100 text-blue-700',
      special: 'bg-purple-100 text-purple-700',
      'member-led': 'bg-green-100 text-green-700',
      cultural: 'bg-orange-100 text-orange-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const renderCalendarView = () => {
    const calendar = getMonthCalendar();
    const today = new Date();
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{monthYear}</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setCurrentDate(newDate);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendar.map((date, index) => {
            const events = getEventsForDate(date);
            const isToday = date.toDateString() === today.toDateString();
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "min-h-[80px] p-2 border rounded-lg text-left transition-all hover:bg-gray-50",
                  !isCurrentMonth && "opacity-50",
                  isToday && "border-purple-500 bg-purple-50",
                  isSelected && "ring-2 ring-purple-500"
                )}
              >
                <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                {events.length > 0 && (
                  <div className="space-y-1">
                    {events.slice(0, 2).map((event, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "text-xs px-1 py-0.5 rounded truncate",
                          getEventTypeColor(event.type)
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{events.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Events on {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map(event => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => onEventClick?.(event)}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        getEventTypeColor(event.type)
                      )}>
                        {React.createElement(getEventIcon(event.category), { 
                          className: "h-5 w-5" 
                        })}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.startTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.registered} attending
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No events scheduled for this date
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderListView = () => {
    const groupedEvents = filteredEvents.reduce((acc, event) => {
      const date = new Date(event.date).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    }, {} as Record<string, EventItem[]>);

    return (
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([dateStr, events]) => {
          const date = new Date(dateStr);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div key={dateStr}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold">
                  {date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                {isToday && (
                  <Badge className="text-xs">Today</Badge>
                )}
              </div>

              <div className="space-y-3">
                {events.map(event => renderEventCard(event))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGridView = () => {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map(event => renderEventCard(event))}
      </div>
    );
  };

  const renderEventCard = (event: EventItem) => {
    const Icon = getEventIcon(event.category);
    const isLive = event.status === 'live';
    const isFull = event.capacity && event.registered >= event.capacity;

    return (
      <Card 
        key={event.id}
        className={cn(
          "hover:shadow-lg transition-all cursor-pointer",
          isLive && "border-green-500 bg-green-50",
          event.featured && "border-purple-500"
        )}
        onClick={() => onEventClick?.(event)}
      >
        <CardContent className="p-4">
          {/* Event Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                getEventTypeColor(event.type)
              )}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">{event.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={event.host.avatar} />
                    <AvatarFallback>{event.host.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{event.host.name}</span>
                </div>
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex flex-col gap-1 items-end">
              {isLive && (
                <Badge className="bg-green-600 animate-pulse">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Live
                  </span>
                </Badge>
              )}
              {event.featured && (
                <Badge variant="secondary">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {event.premium && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Premium
                </Badge>
              )}
            </div>
          </div>

          {/* Event Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {event.location === 'virtual' ? (
                <>
                  <Video className="h-4 w-4" />
                  <span>Virtual Event</span>
                </>
              ) : event.location === 'hybrid' ? (
                <>
                  <Globe className="h-4 w-4" />
                  <span>Hybrid: {event.locationDetails}</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  <span>{event.locationDetails}</span>
                </>
              )}
            </div>

            {event.capacity && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className={cn(
                    isFull ? "text-red-600" : "text-gray-600"
                  )}>
                    {event.registered}/{event.capacity} registered
                  </span>
                  {event.waitlist && event.waitlist > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {event.waitlist} waitlist
                    </Badge>
                  )}
                </div>
                {event.points && (
                  <Badge variant="secondary" className="text-xs">
                    +{event.points} pts
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Button */}
          <Button 
            className="w-full"
            variant={isLive ? "default" : isFull ? "secondary" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onRSVP?.(event.id);
            }}
          >
            {isLive ? (
              <>
                Join Now
                <ExternalLink className="h-4 w-4 ml-2" />
              </>
            ) : isFull ? (
              "Join Waitlist"
            ) : (
              <>
                RSVP
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Events</h2>
          <p className="text-gray-600">Join virtual gatherings and connect with the community</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCreateEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['calendar', 'list', 'grid'] as const).map((v) => (
            <Button
              key={v}
              variant={selectedView === v ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView(v)}
              className="capitalize"
            >
              {v === 'calendar' && <Calendar className="h-4 w-4 mr-2" />}
              {v}
            </Button>
          ))}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Events</option>
              <option value="regular">Regular Events</option>
              <option value="special">Special Events</option>
              <option value="member-led">Member-Led</option>
              <option value="cultural">Cultural Events</option>
            </select>
          </div>
        )}
      </div>

      {/* Event Views */}
      {selectedView === 'calendar' && renderCalendarView()}
      {selectedView === 'list' && renderListView()}
      {selectedView === 'grid' && renderGridView()}
    </div>
  );
}