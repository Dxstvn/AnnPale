'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  Share2,
  Bookmark,
  Play,
  ChevronRight,
  Star,
  AlertCircle,
  Shield,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface EventDetailsHero {
  id: string;
  title: string;
  tagline: string;
  description: string;
  bannerUrl: string;
  videoUrl?: string;
  date: Date;
  endDate?: Date;
  timezone: string;
  duration: number; // minutes
  location?: string; // Virtual platform or physical location
  isVirtual: boolean;
  category: string;
  tags: string[];
  spotsTaken: number;
  totalSpots: number;
  registrationDeadline?: Date;
  isLive?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
}

interface EventDetailsHeroProps {
  event: EventDetailsHero;
  onRegister: () => void;
  onShare: () => void;
  onSave: () => void;
  isSaved?: boolean;
  className?: string;
}

export function EventDetailsHeroSection({
  event,
  onRegister,
  onShare,
  onSave,
  isSaved = false,
  className
}: EventDetailsHeroProps) {
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const [timeUntilEvent, setTimeUntilEvent] = React.useState<string>('');
  const [urgencyLevel, setUrgencyLevel] = React.useState<'low' | 'medium' | 'high'>('low');

  // Calculate time until event
  React.useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const eventDate = new Date(event.date);
      const diff = eventDate.getTime() - now.getTime();

      if (diff <= 0) {
        if (event.isLive) {
          setTimeUntilEvent('Event is LIVE now!');
          setUrgencyLevel('high');
        } else {
          setTimeUntilEvent('Event has ended');
          setUrgencyLevel('low');
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 7) {
        setTimeUntilEvent(`${days} days`);
        setUrgencyLevel('low');
      } else if (days > 0) {
        setTimeUntilEvent(`${days}d ${hours}h`);
        setUrgencyLevel('medium');
      } else if (hours > 0) {
        setTimeUntilEvent(`${hours}h ${minutes}m`);
        setUrgencyLevel('high');
      } else {
        setTimeUntilEvent(`${minutes} minutes`);
        setUrgencyLevel('high');
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [event.date, event.isLive]);

  const spotsPercentage = (event.spotsTaken / event.totalSpots) * 100;
  const spotsRemaining = event.totalSpots - event.spotsTaken;
  const isSoldOut = spotsRemaining === 0;

  const formatEventDate = () => {
    const date = new Date(event.date);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatEventTime = () => {
    const date = new Date(event.date);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatDuration = () => {
    const hours = Math.floor(event.duration / 60);
    const minutes = event.duration % 60;
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Hero Background */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-b-2xl">
        {/* Background Image/Video */}
        <div className="absolute inset-0">
          {isVideoPlaying && event.videoUrl ? (
            <video
              src={event.videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              controls
            />
          ) : (
            <>
              <Image
                src={event.bannerUrl || '/placeholder-event.jpg'}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              {event.videoUrl && (
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                >
                  <div className="bg-white rounded-full p-6 shadow-lg">
                    <Play className="h-12 w-12 text-black fill-black" />
                  </div>
                </button>
              )}
            </>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="max-w-6xl mx-auto">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {event.isFeatured && (
                <Badge className="bg-yellow-500/90 text-white border-0">
                  <Star className="h-3 w-3 mr-1 fill-white" />
                  Featured Event
                </Badge>
              )}
              {event.isTrending && (
                <Badge className="bg-purple-500/90 text-white border-0">
                  <Zap className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {event.isLive && (
                <Badge className="bg-red-500/90 text-white border-0 animate-pulse">
                  <div className="h-2 w-2 bg-white rounded-full mr-2 animate-pulse" />
                  LIVE NOW
                </Badge>
              )}
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {event.category}
              </Badge>
              {event.isVirtual && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Globe className="h-3 w-3 mr-1" />
                  Virtual Event
                </Badge>
              )}
            </div>

            {/* Title and Tagline */}
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              {event.title}
            </h1>
            {event.tagline && (
              <p className="text-lg md:text-xl opacity-90 mb-4">
                {event.tagline}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className={cn(
                  "font-semibold",
                  urgencyLevel === 'high' 
                    ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                    : "bg-white text-black hover:bg-gray-100"
                )}
                onClick={onRegister}
                disabled={isSoldOut && !event.isLive}
              >
                {event.isLive ? (
                  <>
                    Join Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                ) : isSoldOut ? (
                  'Sold Out'
                ) : (
                  <>
                    Register Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={onSave}
              >
                <Bookmark className={cn("h-5 w-5 mr-2", isSaved && "fill-white")} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={onShare}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Information Bar */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium text-sm">{formatEventDate()}</p>
                <p className="text-sm">{formatEventTime()}</p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{formatDuration()}</p>
              </div>
            </div>

            {/* Location/Platform */}
            <div className="flex items-start gap-3">
              {event.isVirtual ? (
                <Globe className="h-5 w-5 text-gray-500 mt-0.5" />
              ) : (
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              )}
              <div>
                <p className="text-sm text-gray-500">
                  {event.isVirtual ? 'Platform' : 'Location'}
                </p>
                <p className="font-medium text-sm">
                  {event.location || 'Online'}
                </p>
              </div>
            </div>

            {/* Spots Available */}
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Spots</p>
                <p className="font-medium">
                  {isSoldOut ? (
                    <span className="text-red-600">Sold Out</span>
                  ) : (
                    <>
                      {spotsRemaining} / {event.totalSpots}
                      {spotsRemaining < 10 && (
                        <span className="text-red-600 text-xs ml-1">
                          (Filling fast!)
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Time Until Event */}
            <div className="flex items-start gap-3">
              <AlertCircle 
                className={cn(
                  "h-5 w-5 mt-0.5",
                  urgencyLevel === 'high' ? "text-red-500" :
                  urgencyLevel === 'medium' ? "text-yellow-500" :
                  "text-gray-500"
                )}
              />
              <div>
                <p className="text-sm text-gray-500">Starts in</p>
                <p className={cn(
                  "font-medium",
                  urgencyLevel === 'high' && "text-red-600",
                  urgencyLevel === 'medium' && "text-yellow-600"
                )}>
                  {timeUntilEvent}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar for Spots */}
          {!isSoldOut && spotsPercentage > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{event.spotsTaken} registered</span>
                <span>{spotsRemaining} spots remaining</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${spotsPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full",
                    spotsPercentage > 80 ? "bg-red-500" :
                    spotsPercentage > 60 ? "bg-yellow-500" :
                    "bg-green-500"
                  )}
                />
              </div>
            </div>
          )}

          {/* Registration Deadline Warning */}
          {event.registrationDeadline && !isSoldOut && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Registration closes {new Date(event.registrationDeadline).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}