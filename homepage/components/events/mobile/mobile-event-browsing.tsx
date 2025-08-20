'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  Heart,
  Share2,
  Bookmark,
  DollarSign,
  ChevronDown,
  SlidersHorizontal,
  Flame,
  TrendingUp,
  Music,
  Mic,
  Video,
  Camera,
  X,
  ArrowLeft,
  MoreVertical,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  date: Date;
  duration: number;
  price: number;
  category: string;
  type: 'live' | 'video-message' | 'meet-greet' | 'workshop';
  attendees: number;
  maxAttendees: number;
  rating: number;
  image: string;
  description: string;
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
  distance?: string;
  trending: boolean;
}

interface MobileEventBrowsingProps {
  events?: Event[];
  onEventSelect?: (event: Event) => void;
  onSearch?: (query: string) => void;
  onFilter?: (filters: any) => void;
  onLike?: (eventId: string) => void;
  onBookmark?: (eventId: string) => void;
  onShare?: (event: Event) => void;
}

export function MobileEventBrowsing({
  events = [],
  onEventSelect,
  onSearch,
  onFilter,
  onLike,
  onBookmark,
  onShare
}: MobileEventBrowsingProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('trending');
  const [viewMode, setViewMode] = React.useState<'cards' | 'list'>('cards');

  // Sample events data
  const sampleEvents: Event[] = [
    {
      id: '1',
      title: 'Haitian Music Masterclass',
      creator: {
        name: 'Marie Delacroix',
        avatar: '👩🏾‍🎤',
        verified: true
      },
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: 90,
      price: 75,
      category: 'Music',
      type: 'workshop',
      attendees: 45,
      maxAttendees: 50,
      rating: 4.9,
      image: '/api/placeholder/400/300',
      description: 'Learn traditional Haitian music techniques and rhythms',
      tags: ['music', 'culture', 'workshop'],
      isLiked: false,
      isBookmarked: true,
      distance: '2.5 mi',
      trending: true
    },
    {
      id: '2',
      title: 'Personal Message from Jean-Baptiste',
      creator: {
        name: 'Jean-Baptiste Pierre',
        avatar: '👨🏾‍🎨',
        verified: true
      },
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      duration: 5,
      price: 25,
      category: 'Personal',
      type: 'video-message',
      attendees: 1,
      maxAttendees: 1,
      rating: 5.0,
      image: '/api/placeholder/400/300',
      description: 'Get a personalized video message for any occasion',
      tags: ['personal', 'video', 'celebration'],
      isLiked: true,
      isBookmarked: false,
      trending: false
    },
    {
      id: '3',
      title: 'Cooking with Chef Sophia',
      creator: {
        name: 'Sophia Laurent',
        avatar: '👩🏾‍🍳',
        verified: false
      },
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      duration: 120,
      price: 40,
      category: 'Cooking',
      type: 'live',
      attendees: 28,
      maxAttendees: 30,
      rating: 4.7,
      image: '/api/placeholder/400/300',
      description: 'Learn to cook authentic Haitian dishes',
      tags: ['cooking', 'culture', 'food'],
      isLiked: false,
      isBookmarked: false,
      distance: '5.1 mi',
      trending: false
    }
  ];

  const displayEvents = events.length > 0 ? events : sampleEvents;

  const categories = [
    { id: 'all', name: 'All', icon: TrendingUp },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'cooking', name: 'Cooking', icon: Flame },
    { id: 'personal', name: 'Personal', icon: Heart },
    { id: 'workshop', name: 'Workshop', icon: Users }
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'date', label: 'Date' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
    { value: 'distance', label: 'Distance' }
  ];

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'live': return Video;
      case 'video-message': return Camera;
      case 'meet-greet': return Users;
      case 'workshop': return Mic;
      default: return Video;
    }
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'live': return 'bg-red-100 text-red-700';
      case 'video-message': return 'bg-blue-100 text-blue-700';
      case 'meet-greet': return 'bg-green-100 text-green-700';
      case 'workshop': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleEventSwipe = (eventId: string, direction: 'left' | 'right') => {
    if (direction === 'right') {
      onLike?.(eventId);
    } else if (direction === 'left') {
      onBookmark?.(eventId);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch?.(e.target.value);
                }}
                className="pl-10 pr-4 h-10 rounded-full bg-gray-100 border-0"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 w-10 rounded-full bg-gray-100"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  <Icon className="h-3 w-3" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 p-4 bg-gray-50"
            >
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {displayEvents.map((event, index) => {
            const EventTypeIcon = getEventTypeIcon(event.type);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card 
                  className="overflow-hidden cursor-pointer active:scale-95 transition-transform"
                  onClick={() => onEventSelect?.(event)}
                >
                  <div className="relative">
                    {/* Event Image */}
                    <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20" />
                      
                      {/* Event Type Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={cn("flex items-center gap-1 text-xs", getEventTypeColor(event.type))}>
                          <EventTypeIcon className="h-3 w-3" />
                          {event.type.replace('-', ' ')}
                        </Badge>
                      </div>

                      {/* Trending Badge */}
                      {event.trending && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-orange-500 text-white flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            Trending
                          </Badge>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            onShare?.(event);
                          }}
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className={cn(
                            "h-8 w-8 rounded-full bg-white/90 hover:bg-white",
                            event.isBookmarked && "bg-yellow-500 text-white hover:bg-yellow-600"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookmark?.(event.id);
                          }}
                        >
                          <Bookmark className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className={cn(
                            "h-8 w-8 rounded-full bg-white/90 hover:bg-white",
                            event.isLiked && "bg-red-500 text-white hover:bg-red-600"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onLike?.(event.id);
                          }}
                        >
                          <Heart className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Event Content */}
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Creator Info */}
                        <div className="flex items-center gap-2">
                          <div className="text-2xl">{event.creator.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-sm">{event.creator.name}</span>
                              {event.creator.verified && (
                                <Badge variant="secondary" className="h-4 w-4 p-0">
                                  ✓
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs text-gray-600">{event.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Event Title */}
                        <h3 className="font-semibold text-lg leading-tight">{event.title}</h3>

                        {/* Event Details */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{event.date.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{event.duration}min</span>
                          </div>
                          {event.distance && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{event.distance}</span>
                            </div>
                          )}
                        </div>

                        {/* Attendance */}
                        {event.type !== 'video-message' && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Attendance</span>
                              <span className="font-medium">{event.attendees}/{event.maxAttendees}</span>
                            </div>
                            <Progress value={(event.attendees / event.maxAttendees) * 100} className="h-1" />
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {event.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Price & Book Button */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-lg font-bold text-green-600">${event.price}</span>
                          </div>
                          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                            <Zap className="h-3 w-3 mr-1" />
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Load More */}
        <div className="p-4">
          <Button variant="outline" className="w-full">
            Load More Events
          </Button>
        </div>
      </div>

      {/* Mobile Swipe Instructions */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>Swipe right to like</span>
          </div>
          <div className="flex items-center gap-1">
            <Bookmark className="h-3 w-3" />
            <span>Swipe left to save</span>
          </div>
        </div>
      </div>
    </div>
  );
}