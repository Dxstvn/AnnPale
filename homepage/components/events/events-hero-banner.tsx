'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Users,
  Ticket,
  Play,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  TrendingUp,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface FeaturedEvent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoPreviewUrl?: string;
  creator: {
    id: string;
    name: string;
    avatarUrl: string;
    verified: boolean;
  };
  date: Date;
  duration: number; // minutes
  price: number;
  currency: string;
  spotsRemaining: number;
  totalSpots: number;
  category: string;
  language: string;
  tags: string[];
  isTrending?: boolean;
  isLastChance?: boolean;
  isFeatured?: boolean;
  attendees?: number;
}

interface EventsHeroBannerProps {
  featuredEvents: FeaturedEvent[];
  autoRotate?: boolean;
  rotationInterval?: number;
  onEventClick?: (event: FeaturedEvent) => void;
  onQuickPurchase?: (event: FeaturedEvent) => void;
  className?: string;
}

export function EventsHeroBanner({
  featuredEvents,
  autoRotate = true,
  rotationInterval = 8000,
  onEventClick,
  onQuickPurchase,
  className
}: EventsHeroBannerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [timeRemaining, setTimeRemaining] = React.useState<string>('');
  const [isPlaying, setIsPlaying] = React.useState(false);

  const currentEvent = featuredEvents[currentIndex];

  // Auto-rotation
  React.useEffect(() => {
    if (!autoRotate || featuredEvents.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, featuredEvents.length]);

  // Countdown timer
  React.useEffect(() => {
    if (!currentEvent) return;

    const updateCountdown = () => {
      const now = new Date();
      const eventDate = new Date(currentEvent.date);
      const diff = eventDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Event Started');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${hours}h ${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [currentEvent]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? featuredEvents.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
  };

  if (!currentEvent) return null;

  const spotsPercentage = ((currentEvent.totalSpots - currentEvent.spotsRemaining) / currentEvent.totalSpots) * 100;

  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentEvent.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Background Image/Video */}
          <div className="relative h-[500px] w-full">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10" />
            
            {isPlaying && currentEvent.videoPreviewUrl ? (
              <video
                src={currentEvent.videoPreviewUrl}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
              />
            ) : (
              <div className="absolute inset-0">
                <Image
                  src={currentEvent.imageUrl || '/placeholder-event.jpg'}
                  alt={currentEvent.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Play Button for Video Preview */}
            {currentEvent.videoPreviewUrl && !isPlaying && (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white/90 rounded-full p-4 hover:bg-white transition-colors"
              >
                <Play className="h-8 w-8 text-black" />
              </button>
            )}

            {/* Navigation Arrows */}
            {featuredEvents.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </>
            )}

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
              <div className="max-w-4xl">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentEvent.isFeatured && (
                    <Badge className="bg-yellow-500 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {currentEvent.isTrending && (
                    <Badge className="bg-purple-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {currentEvent.isLastChance && (
                    <Badge className="bg-red-500 text-white">
                      <Clock className="h-3 w-3 mr-1" />
                      Last Chance
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {currentEvent.category}
                  </Badge>
                </div>

                {/* Title and Description */}
                <h1 className="text-4xl font-bold text-white mb-2">
                  {currentEvent.title}
                </h1>
                <p className="text-lg text-white/90 mb-6 line-clamp-2">
                  {currentEvent.description}
                </p>

                {/* Event Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <p className="text-sm opacity-75">Date</p>
                      <p className="font-medium">
                        {new Date(currentEvent.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white">
                    <Clock className="h-5 w-5" />
                    <div>
                      <p className="text-sm opacity-75">Starts in</p>
                      <p className="font-medium">{timeRemaining}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white">
                    <Ticket className="h-5 w-5" />
                    <div>
                      <p className="text-sm opacity-75">Price</p>
                      <p className="font-medium">
                        {currentEvent.currency === 'USD' ? '$' : currentEvent.currency}
                        {currentEvent.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5" />
                    <div>
                      <p className="text-sm opacity-75">Spots</p>
                      <p className="font-medium">
                        {currentEvent.spotsRemaining} / {currentEvent.totalSpots}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spots Progress Bar */}
                {currentEvent.spotsRemaining < currentEvent.totalSpots && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-white mb-2">
                      <span>{currentEvent.totalSpots - currentEvent.spotsRemaining} registered</span>
                      <span>{currentEvent.spotsRemaining} spots left</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${spotsPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                          "h-full",
                          spotsPercentage > 75 ? "bg-red-500" : 
                          spotsPercentage > 50 ? "bg-yellow-500" : "bg-green-500"
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Creator and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12">
                      <Image
                        src={currentEvent.creator.avatarUrl || '/placeholder-avatar.png'}
                        alt={currentEvent.creator.name}
                        fill
                        className="rounded-full object-cover"
                      />
                      {currentEvent.creator.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                          <Star className="h-3 w-3 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-white">
                      <p className="font-medium">{currentEvent.creator.name}</p>
                      <p className="text-sm opacity-75">Event Host</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                      onClick={() => onEventClick?.(currentEvent)}
                    >
                      View Details
                    </Button>
                    <Button
                      className="bg-white text-black hover:bg-gray-100"
                      onClick={() => onQuickPurchase?.(currentEvent)}
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      Quick Purchase
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots Indicator */}
            {featuredEvents.length > 1 && (
              <div className="absolute bottom-4 right-8 z-20 flex gap-2">
                {featuredEvents.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      index === currentIndex 
                        ? "bg-white w-8" 
                        : "bg-white/50 hover:bg-white/75"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}