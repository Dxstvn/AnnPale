'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  MapPin,
  Globe,
  Star,
  TrendingUp,
  Sparkles,
  Heart,
  Share2,
  Bookmark,
  MoreVertical,
  Video,
  Music,
  MessageCircle,
  GraduationCap,
  PartyPopper,
  Mic
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface EventCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  creator: {
    id: string;
    name: string;
    avatarUrl: string;
    verified: boolean;
  };
  date: Date;
  duration: number; // minutes
  price: number;
  originalPrice?: number;
  currency: string;
  spotsRemaining: number;
  totalSpots: number;
  category: string;
  language: string;
  tags: string[];
  attendees?: number;
  rating?: number;
  isTrending?: boolean;
  isNew?: boolean;
  isSoldOut?: boolean;
  isOnSale?: boolean;
  savedByUser?: boolean;
  viewCount?: number;
}

interface EventsGridListingProps {
  events: EventCard[];
  view?: 'grid' | 'list';
  columns?: 1 | 2 | 3 | 4;
  showFilters?: boolean;
  onEventClick?: (event: EventCard) => void;
  onBookmark?: (event: EventCard) => void;
  onShare?: (event: EventCard) => void;
  onQuickBook?: (event: EventCard) => void;
  className?: string;
}

const categoryIcons: { [key: string]: React.ElementType } = {
  'Concerts & Shows': Music,
  'Meet & Greets': Users,
  'Workshops & Classes': GraduationCap,
  'Q&A Sessions': MessageCircle,
  'Watch Parties': Video,
  'Special Occasions': PartyPopper,
  'Podcasts & Talks': Mic
};

function EventCardComponent({
  event,
  view = 'grid',
  onEventClick,
  onBookmark,
  onShare,
  onQuickBook
}: {
  event: EventCard;
  view?: 'grid' | 'list';
  onEventClick?: (event: EventCard) => void;
  onBookmark?: (event: EventCard) => void;
  onShare?: (event: EventCard) => void;
  onQuickBook?: (event: EventCard) => void;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const CategoryIcon = categoryIcons[event.category] || Calendar;

  const formatDate = (date: Date) => {
    const eventDate = new Date(date);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;

    return eventDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const spotsPercentage = ((event.totalSpots - event.spotsRemaining) / event.totalSpots) * 100;

  if (view === 'list') {
    return (
      <Card className="hover:shadow-lg transition-all cursor-pointer">
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-36">
            <Image
              src={event.imageUrl || '/placeholder-event.jpg'}
              alt={event.title}
              fill
              className="object-cover rounded-l-lg"
            />
            {event.isOnSale && event.originalPrice && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                {Math.round((1 - event.price / event.originalPrice) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CategoryIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{event.category}</span>
                  {event.isTrending && (
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {event.isNew && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      New
                    </Badge>
                  )}
                </div>

                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{event.title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {event.language}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src={event.creator.avatarUrl || '/placeholder-avatar.png'}
                      alt={event.creator.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm">{event.creator.name}</span>
                    {event.creator.verified && (
                      <Star className="h-3 w-3 text-blue-500 fill-blue-500" />
                    )}
                  </div>
                  {event.attendees && (
                    <span className="text-sm text-gray-500">
                      {event.attendees} attending
                    </span>
                  )}
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {event.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${event.originalPrice}
                      </span>
                    )}
                    <span className="text-xl font-bold">
                      ${event.price}
                    </span>
                  </div>
                  {event.spotsRemaining < 10 && !event.isSoldOut && (
                    <p className="text-xs text-red-600">Only {event.spotsRemaining} left!</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookmark?.(event);
                    }}
                  >
                    <Bookmark className={cn("h-4 w-4", event.savedByUser && "fill-current")} />
                  </Button>
                  <Button
                    size="sm"
                    disabled={event.isSoldOut}
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickBook?.(event);
                    }}
                  >
                    {event.isSoldOut ? 'Sold Out' : 'Book Now'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className="overflow-hidden cursor-pointer h-full flex flex-col"
        onClick={() => onEventClick?.(event)}
      >
        {/* Image Section - 50% visual weight */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.imageUrl || '/placeholder-event.jpg'}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          
          {/* Overlay Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {event.isTrending && (
              <Badge className="bg-purple-500/90 text-white">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
            {event.isNew && (
              <Badge className="bg-green-500/90 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                New
              </Badge>
            )}
            {event.isOnSale && event.originalPrice && (
              <Badge className="bg-red-500/90 text-white">
                {Math.round((1 - event.price / event.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity"
               style={{ opacity: isHovered ? 1 : 0 }}>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark?.(event);
              }}
            >
              <Bookmark className={cn("h-4 w-4", event.savedByUser && "fill-current")} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(event);
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Category Icon */}
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-full p-2">
            <CategoryIcon className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="flex-1 flex flex-col p-4">
          {/* Title - 20% visual weight */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 flex-shrink-0">
            {event.title}
          </h3>

          {/* Date/Time - 10% visual weight */}
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {event.duration}m
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price - 10% visual weight */}
          <div className="flex items-center justify-between mb-3">
            <div>
              {event.originalPrice && (
                <span className="text-sm text-gray-400 line-through mr-2">
                  ${event.originalPrice}
                </span>
              )}
              <span className="text-xl font-bold">
                ${event.price}
              </span>
            </div>
            {!event.isSoldOut && (
              <div className="text-right">
                <p className="text-xs text-gray-600">
                  {event.spotsRemaining}/{event.totalSpots} spots
                </p>
                {spotsPercentage > 75 && (
                  <p className="text-xs text-red-600">Filling fast!</p>
                )}
              </div>
            )}
            {event.isSoldOut && (
              <Badge variant="destructive">Sold Out</Badge>
            )}
          </div>

          {/* Spots Progress Bar */}
          {!event.isSoldOut && spotsPercentage > 0 && (
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div 
                className={cn(
                  "h-full transition-all",
                  spotsPercentage > 75 ? "bg-red-500" :
                  spotsPercentage > 50 ? "bg-yellow-500" : "bg-green-500"
                )}
                style={{ width: `${spotsPercentage}%` }}
              />
            </div>
          )}

          {/* Creator - 5% visual weight */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={event.creator.avatarUrl || '/placeholder-avatar.png'}
                alt={event.creator.name}
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-sm text-gray-600">{event.creator.name}</span>
              {event.creator.verified && (
                <Star className="h-3 w-3 text-blue-500 fill-blue-500" />
              )}
            </div>

            {/* Attendees - 5% visual weight */}
            {event.attendees && event.attendees > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="h-3 w-3" />
                <span>{event.attendees}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function EventsGridListing({
  events,
  view = 'grid',
  columns = 3,
  showFilters = false,
  onEventClick,
  onBookmark,
  onShare,
  onQuickBook,
  className
}: EventsGridListingProps) {
  const gridClass = view === 'grid' 
    ? `grid gap-6 ${
        columns === 1 ? 'grid-cols-1' :
        columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
        columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }`
    : 'flex flex-col gap-4';

  return (
    <div className={cn("w-full", className)}>
      <div className={gridClass}>
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <EventCardComponent
              event={event}
              view={view}
              onEventClick={onEventClick}
              onBookmark={onBookmark}
              onShare={onShare}
              onQuickBook={onQuickBook}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}