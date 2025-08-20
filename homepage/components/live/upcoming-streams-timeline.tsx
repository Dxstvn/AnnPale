'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  Bell, 
  BellOff,
  Users, 
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UpcomingStream, STREAM_CATEGORIES } from '@/lib/types/live-discovery';

interface UpcomingStreamsTimelineProps {
  streams: UpcomingStream[];
  onSetReminder?: (streamId: string, enabled: boolean) => void;
  onStreamClick?: (stream: UpcomingStream) => void;
  timeZone?: string;
  maxVisible?: number;
  className?: string;
}

interface TimeSlot {
  time: string;
  hour: number;
  date: Date;
  streams: UpcomingStream[];
}

export function UpcomingStreamsTimeline({
  streams,
  onSetReminder,
  onStreamClick,
  timeZone = 'local',
  maxVisible = 5,
  className
}: UpcomingStreamsTimelineProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    generateTimeSlots();
  }, [streams, selectedDate]);

  const generateTimeSlots = () => {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Filter streams for selected date
    const dayStreams = streams.filter(stream => {
      const streamDate = new Date(stream.scheduledStartTime);
      return streamDate >= startOfDay && streamDate <= endOfDay;
    });

    // Group streams by hour
    const hourlySlots: Record<number, UpcomingStream[]> = {};
    
    dayStreams.forEach(stream => {
      const hour = new Date(stream.scheduledStartTime).getHours();
      if (!hourlySlots[hour]) {
        hourlySlots[hour] = [];
      }
      hourlySlots[hour].push(stream);
    });

    // Create time slots for the day
    const slots: TimeSlot[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const slotDate = new Date(selectedDate);
      slotDate.setHours(hour, 0, 0, 0);
      
      slots.push({
        time: formatTime(slotDate),
        hour,
        date: slotDate,
        streams: hourlySlots[hour] || []
      });
    }

    setTimeSlots(slots);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTimeUntilStream = (streamTime: Date) => {
    const diff = streamTime.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return 'Starting soon';
  };

  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const slotsWithStreams = timeSlots.filter(slot => slot.streams.length > 0);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Upcoming Streams</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {streams.length} streams scheduled
          </p>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousDay}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span className="font-medium">{formatDate(selectedDate)}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextDay}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeline */}
      {slotsWithStreams.length > 0 ? (
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {slotsWithStreams.map((slot) => (
              <TimeSlotSection
                key={slot.hour}
                timeSlot={slot}
                currentTime={currentTime}
                onSetReminder={onSetReminder}
                onStreamClick={onStreamClick}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Streams Scheduled
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No streams are scheduled for {formatDate(selectedDate)}
          </p>
        </div>
      )}
    </div>
  );
}

interface TimeSlotSectionProps {
  timeSlot: TimeSlot;
  currentTime: Date;
  onSetReminder?: (streamId: string, enabled: boolean) => void;
  onStreamClick?: (stream: UpcomingStream) => void;
}

function TimeSlotSection({
  timeSlot,
  currentTime,
  onSetReminder,
  onStreamClick
}: TimeSlotSectionProps) {
  const isPast = timeSlot.date < currentTime;
  const isCurrentHour = timeSlot.hour === currentTime.getHours() && 
                       timeSlot.date.toDateString() === currentTime.toDateString();

  return (
    <div className="flex gap-4">
      {/* Time Label */}
      <div className={cn(
        'flex-shrink-0 w-20 text-right',
        isPast ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
      )}>
        <div className={cn(
          'font-medium',
          isCurrentHour && 'text-purple-600 dark:text-purple-400'
        )}>
          {timeSlot.time}
        </div>
      </div>

      {/* Timeline Line */}
      <div className="flex-shrink-0 w-px bg-gray-200 dark:bg-gray-700 relative">
        <div className={cn(
          'absolute -left-1.5 top-0 w-3 h-3 rounded-full border-2',
          isPast 
            ? 'bg-gray-300 border-gray-300 dark:bg-gray-600 dark:border-gray-600'
            : isCurrentHour
            ? 'bg-purple-500 border-purple-500 animate-pulse'
            : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
        )} />
      </div>

      {/* Streams */}
      <div className="flex-1 space-y-3">
        {timeSlot.streams.map((stream, index) => (
          <UpcomingStreamCard
            key={stream.id}
            stream={stream}
            index={index}
            currentTime={currentTime}
            isPast={isPast}
            onSetReminder={onSetReminder}
            onStreamClick={onStreamClick}
          />
        ))}
      </div>
    </div>
  );
}

interface UpcomingStreamCardProps {
  stream: UpcomingStream;
  index: number;
  currentTime: Date;
  isPast: boolean;
  onSetReminder?: (streamId: string, enabled: boolean) => void;
  onStreamClick?: (stream: UpcomingStream) => void;
}

function UpcomingStreamCard({
  stream,
  index,
  currentTime,
  isPast,
  onSetReminder,
  onStreamClick
}: UpcomingStreamCardProps) {
  const [reminderSet, setReminderSet] = useState(stream.reminderSet || false);
  const categoryInfo = STREAM_CATEGORIES[stream.category];

  const handleReminderToggle = () => {
    const newState = !reminderSet;
    setReminderSet(newState);
    onSetReminder?.(stream.id, newState);
  };

  const formatViewerCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getTimeUntilStream = (streamTime: Date) => {
    const diff = streamTime.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) return 'Started';
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    if (minutes > 0) return `in ${minutes}m`;
    return 'Starting soon';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={cn(
        'hover:shadow-md transition-all cursor-pointer',
        isPast && 'opacity-60'
      )}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Thumbnail */}
            <div className="relative w-24 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={stream.thumbnailUrl}
                alt={stream.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  {/* Category and Premium */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{categoryInfo.icon}</span>
                    <Badge variant="outline" className="text-xs">
                      {categoryInfo.displayName}
                    </Badge>
                    {stream.isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h3 
                    className="font-semibold text-sm line-clamp-1 hover:text-purple-600 transition-colors mb-1"
                    onClick={() => onStreamClick?.(stream)}
                  >
                    {stream.title}
                  </h3>

                  {/* Creator */}
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={stream.creatorAvatar} />
                      <AvatarFallback className="text-xs">
                        {stream.creatorName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {stream.creatorName}
                      </span>
                      {stream.creatorVerified && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                    </div>
                  </div>

                  {/* Time and Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeUntilStream(stream.scheduledStartTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {formatViewerCount(stream.expectedViewers)} expected
                    </div>
                  </div>
                </div>

                {/* Reminder Button */}
                <Button
                  size="sm"
                  variant={reminderSet ? "default" : "outline"}
                  className={cn(
                    'flex-shrink-0',
                    reminderSet && 'bg-purple-500 hover:bg-purple-600'
                  )}
                  onClick={handleReminderToggle}
                  disabled={isPast}
                >
                  {reminderSet ? (
                    <>
                      <Bell className="w-4 h-4 mr-1" />
                      Set
                    </>
                  ) : (
                    <>
                      <BellOff className="w-4 h-4 mr-1" />
                      Remind
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}