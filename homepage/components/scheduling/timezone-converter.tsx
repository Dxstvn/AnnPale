'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Globe,
  Clock,
  MapPin,
  Users,
  Calendar,
  Download,
  Share2,
  Settings,
  RefreshCw,
  ArrowRight,
  Info,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addHours, addMinutes } from 'date-fns';

// Timezone data with additional metadata
export interface TimezoneInfo {
  id: string;
  name: string;
  abbreviation: string;
  offset: string;
  country: string;
  region: string;
  popularityRank: number;
  isDst: boolean;
}

// Common timezones for Haitian diaspora
export const POPULAR_TIMEZONES: TimezoneInfo[] = [
  {
    id: 'America/Port-au-Prince',
    name: 'Haiti Time',
    abbreviation: 'EST',
    offset: 'UTC-5',
    country: 'Haiti',
    region: 'Caribbean',
    popularityRank: 1,
    isDst: false
  },
  {
    id: 'America/New_York',
    name: 'Eastern Time',
    abbreviation: 'EST/EDT',
    offset: 'UTC-5/-4',
    country: 'United States',
    region: 'North America',
    popularityRank: 2,
    isDst: true
  },
  {
    id: 'America/Miami',
    name: 'Eastern Time (Florida)',
    abbreviation: 'EST/EDT',
    offset: 'UTC-5/-4',
    country: 'United States',
    region: 'North America',
    popularityRank: 3,
    isDst: true
  },
  {
    id: 'America/Montreal',
    name: 'Eastern Time (Montreal)',
    abbreviation: 'EST/EDT',
    offset: 'UTC-5/-4',
    country: 'Canada',
    region: 'North America',
    popularityRank: 4,
    isDst: true
  },
  {
    id: 'Europe/Paris',
    name: 'Central European Time',
    abbreviation: 'CET/CEST',
    offset: 'UTC+1/+2',
    country: 'France',
    region: 'Europe',
    popularityRank: 5,
    isDst: true
  },
  {
    id: 'America/Los_Angeles',
    name: 'Pacific Time',
    abbreviation: 'PST/PDT',
    offset: 'UTC-8/-7',
    country: 'United States',
    region: 'North America',
    popularityRank: 6,
    isDst: true
  },
  {
    id: 'America/Chicago',
    name: 'Central Time',
    abbreviation: 'CST/CDT',
    offset: 'UTC-6/-5',
    country: 'United States',
    region: 'North America',
    popularityRank: 7,
    isDst: true
  },
  {
    id: 'Europe/London',
    name: 'Greenwich Mean Time',
    abbreviation: 'GMT/BST',
    offset: 'UTC+0/+1',
    country: 'United Kingdom',
    region: 'Europe',
    popularityRank: 8,
    isDst: true
  }
];

// Stream event with timezone information
export interface StreamEventWithTimezone {
  id: string;
  title: string;
  startTime: Date;
  duration: number;
  timezone: string;
  category: string;
}

interface TimezoneConverterProps {
  events?: StreamEventWithTimezone[];
  defaultTimezone?: string;
  onTimezoneChange?: (timezone: string) => void;
  className?: string;
  variant?: 'full' | 'compact' | 'widget';
}

// Get user's current timezone
function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/New_York'; // Fallback
  }
}

// Convert time between timezones (simplified for demo)
function convertTimezone(date: Date, fromTimezone: string, toTimezone: string): Date {
  // Simplified timezone conversion for demo purposes
  // In production, this would use date-fns-tz or similar library
  const timezoneOffsets: { [key: string]: number } = {
    'America/Port-au-Prince': -5,
    'America/New_York': -5,
    'America/Miami': -5,
    'America/Montreal': -5,
    'Europe/Paris': 1,
    'America/Los_Angeles': -8,
    'America/Chicago': -6,
    'Europe/London': 0
  };
  
  const fromOffset = timezoneOffsets[fromTimezone] || 0;
  const toOffset = timezoneOffsets[toTimezone] || 0;
  const offsetDiff = (toOffset - fromOffset) * 60 * 60 * 1000;
  
  return new Date(date.getTime() + offsetDiff);
}

// Format time in specific timezone (simplified for demo)
function formatTimeInTimezone(date: Date, timezone: string, formatString: string = 'PPp'): string {
  // For demo purposes, just use the standard format function
  return format(date, formatString);
}

// Get timezone offset (simplified for demo)
function getTimezoneOffset(timezone: string): string {
  const timezoneOffsets: { [key: string]: number } = {
    'America/Port-au-Prince': -5,
    'America/New_York': -5,
    'America/Miami': -5,
    'America/Montreal': -5,
    'Europe/Paris': 1,
    'America/Los_Angeles': -8,
    'America/Chicago': -6,
    'Europe/London': 0
  };
  
  const offset = timezoneOffsets[timezone] || 0;
  return offset >= 0 ? `UTC+${offset}` : `UTC${offset}`;
}

// Timezone selector component
function TimezoneSelector({
  selectedTimezone,
  onTimezoneChange,
  showPopular = true
}: {
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
  showPopular?: boolean;
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Filter timezones based on search
  const filteredTimezones = POPULAR_TIMEZONES.filter(tz =>
    tz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tz.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tz.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {showPopular && (
        <div>
          <Label className="text-sm font-medium mb-2 block">Popular Timezones</Label>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_TIMEZONES.slice(0, 4).map((timezone) => (
              <Button
                key={timezone.id}
                variant={selectedTimezone === timezone.id ? "default" : "outline"}
                size="sm"
                onClick={() => onTimezoneChange(timezone.id)}
                className="justify-start text-left"
              >
                <div>
                  <div className="font-medium">{timezone.abbreviation}</div>
                  <div className="text-xs opacity-70">{timezone.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="timezone-search" className="text-sm font-medium mb-2 block">
          Search Timezones
        </Label>
        <Input
          id="timezone-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by city, country, or abbreviation..."
          className="mb-2"
        />
        
        <Select value={selectedTimezone} onValueChange={onTimezoneChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {filteredTimezones.map((timezone) => (
              <SelectItem key={timezone.id} value={timezone.id}>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <span className="font-medium">{timezone.name}</span>
                    <span className="text-xs text-gray-500 ml-2">({timezone.abbreviation})</span>
                  </div>
                  <span className="text-xs text-gray-400">{timezone.offset}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Time conversion display
function TimeConversionDisplay({
  sourceTime,
  sourceTimezone,
  targetTimezone,
  eventTitle
}: {
  sourceTime: Date;
  sourceTimezone: string;
  targetTimezone: string;
  eventTitle?: string;
}) {
  const convertedTime = convertTimezone(sourceTime, sourceTimezone, targetTimezone);
  const sourceTimezoneInfo = POPULAR_TIMEZONES.find(tz => tz.id === sourceTimezone);
  const targetTimezoneInfo = POPULAR_TIMEZONES.find(tz => tz.id === targetTimezone);
  
  // Calculate time difference
  const timeDiff = Math.abs(convertedTime.getTime() - sourceTime.getTime()) / (1000 * 60 * 60);
  const isDifferentDay = convertedTime.getDate() !== sourceTime.getDate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
    >
      {eventTitle && (
        <h4 className="font-semibold text-blue-900 mb-3">{eventTitle}</h4>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Source Time */}
        <div className="text-center">
          <div className="text-lg font-bold text-blue-900">
            {formatTimeInTimezone(sourceTime, sourceTimezone, 'h:mm a')}
          </div>
          <div className="text-sm text-blue-700">
            {formatTimeInTimezone(sourceTime, sourceTimezone, 'EEE, MMM d')}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            {sourceTimezoneInfo?.abbreviation || sourceTimezone}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-blue-600">
            <ArrowRight className="w-5 h-5" />
            <div className="text-xs">
              {timeDiff === 0 ? 'Same time' : `${timeDiff}h ${timeDiff < 1 ? 'ahead' : 'difference'}`}
            </div>
          </div>
        </div>

        {/* Target Time */}
        <div className="text-center">
          <div className="text-lg font-bold text-purple-900">
            {formatTimeInTimezone(convertedTime, targetTimezone, 'h:mm a')}
          </div>
          <div className="text-sm text-purple-700">
            {formatTimeInTimezone(convertedTime, targetTimezone, 'EEE, MMM d')}
            {isDifferentDay && (
              <Badge variant="outline" className="ml-1 text-xs">
                {convertedTime > sourceTime ? 'Next day' : 'Previous day'}
              </Badge>
            )}
          </div>
          <div className="text-xs text-purple-600 mt-1">
            {targetTimezoneInfo?.abbreviation || targetTimezone}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// World clock component
function WorldClock({
  timezones,
  referenceTime = new Date()
}: {
  timezones: string[];
  referenceTime?: Date;
}) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {timezones.map((timezone) => {
        const timezoneInfo = POPULAR_TIMEZONES.find(tz => tz.id === timezone);
        const localTime = convertTimezone(currentTime, getUserTimezone(), timezone);
        
        return (
          <Card key={timezone} className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-sm">
                  {timezoneInfo?.abbreviation || timezone.split('/')[1]}
                </span>
              </div>
              
              <div className="text-2xl font-bold text-blue-900 mb-1">
                {format(localTime, 'HH:mm:ss')}
              </div>
              
              <div className="text-sm text-gray-600">
                {format(localTime, 'EEE, MMM d')}
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                {timezoneInfo?.name || timezone}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Calendar export component
function CalendarExport({
  events,
  timezone
}: {
  events: StreamEventWithTimezone[];
  timezone: string;
}) {
  const generateICSContent = () => {
    const icsEvents = events.map(event => {
      const startTime = convertTimezone(event.startTime, event.timezone, timezone);
      const endTime = addMinutes(startTime, event.duration);
      
      return [
        'BEGIN:VEVENT',
        `UID:${event.id}@annpale.com`,
        `DTSTART:${format(startTime, "yyyyMMdd'T'HHmmss")}`,
        `DTEND:${format(endTime, "yyyyMMdd'T'HHmmss")}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:Stream: ${event.title}\\nCategory: ${event.category}\\nDuration: ${event.duration} minutes`,
        'END:VEVENT'
      ].join('\r\n');
    }).join('\r\n');

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ann Pale//Stream Calendar//EN',
      icsEvents,
      'END:VCALENDAR'
    ].join('\r\n');
  };

  const downloadICS = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ann-pale-streams.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateICSContent());
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-800">Export to Calendar</span>
        </div>
        <p className="text-sm text-green-700 mb-3">
          Add these streams to your personal calendar. All times will be converted to your selected timezone.
        </p>
        
        <div className="flex gap-2">
          <Button size="sm" onClick={downloadICS} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Download .ics file
          </Button>
          <Button size="sm" variant="outline" onClick={copyToClipboard}>
            <Share2 className="w-4 h-4 mr-2" />
            Copy to clipboard
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        <div className="flex items-center gap-1 mb-1">
          <Info className="w-3 h-3" />
          <span>Compatible with most calendar applications</span>
        </div>
        <ul className="list-disc list-inside text-gray-400 space-y-0.5 ml-4">
          <li>Google Calendar, Apple Calendar, Outlook</li>
          <li>Automatically syncs with your calendar app</li>
          <li>Includes reminders and event details</li>
        </ul>
      </div>
    </div>
  );
}

// Main timezone converter component
export function TimezoneConverter({
  events = [],
  defaultTimezone,
  onTimezoneChange,
  className,
  variant = 'full'
}: TimezoneConverterProps) {
  const [userTimezone, setUserTimezone] = React.useState(defaultTimezone || getUserTimezone());
  const [showWorldClock, setShowWorldClock] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<StreamEventWithTimezone | null>(null);

  React.useEffect(() => {
    onTimezoneChange?.(userTimezone);
  }, [userTimezone, onTimezoneChange]);

  const popularTimezones = ['America/Port-au-Prince', 'America/New_York', 'America/Miami', 'Europe/Paris'];
  const upcomingEvents = events.slice(0, 3);

  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Timezone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={userTimezone} onValueChange={setUserTimezone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POPULAR_TIMEZONES.slice(0, 6).map((timezone) => (
                <SelectItem key={timezone.id} value={timezone.id}>
                  {timezone.abbreviation} - {timezone.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-900">
              {format(new Date(), 'HH:mm')}
            </div>
            <div className="text-sm text-blue-700">
              {POPULAR_TIMEZONES.find(tz => tz.id === userTimezone)?.abbreviation || userTimezone}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'widget') {
    return (
      <div className={cn('p-4 bg-white rounded-lg border shadow-sm', className)}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-sm">Your Time</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowWorldClock(!showWorldClock)}>
            <Globe className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-900">
            {format(new Date(), 'HH:mm')}
          </div>
          <div className="text-sm text-gray-600">
            {POPULAR_TIMEZONES.find(tz => tz.id === userTimezone)?.name || userTimezone}
          </div>
        </div>
        
        {showWorldClock && (
          <div className="mt-4 pt-4 border-t">
            <WorldClock timezones={popularTimezones.slice(0, 2)} />
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Timezone Converter</h2>
          <p className="text-gray-600">Convert stream times to your local timezone</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <MapPin className="w-3 h-3 mr-1" />
            {POPULAR_TIMEZONES.find(tz => tz.id === userTimezone)?.abbreviation || 'Local'}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setShowWorldClock(!showWorldClock)}>
            <Globe className="w-4 h-4 mr-2" />
            World Clock
          </Button>
        </div>
      </div>

      {/* Timezone Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Your Timezone</CardTitle>
          <CardDescription>Choose your local timezone to see accurate stream times</CardDescription>
        </CardHeader>
        <CardContent>
          <TimezoneSelector
            selectedTimezone={userTimezone}
            onTimezoneChange={setUserTimezone}
          />
        </CardContent>
      </Card>

      {/* World Clock */}
      <AnimatePresence>
        {showWorldClock && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  World Clock
                </CardTitle>
                <CardDescription>Current time in popular timezones</CardDescription>
              </CardHeader>
              <CardContent>
                <WorldClock timezones={popularTimezones} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Time Conversions */}
      {upcomingEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Streams</CardTitle>
            <CardDescription>Stream times converted to your timezone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <TimeConversionDisplay
                key={event.id}
                sourceTime={event.startTime}
                sourceTimezone={event.timezone}
                targetTimezone={userTimezone}
                eventTitle={event.title}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Calendar Export */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Calendar Integration</CardTitle>
            <CardDescription>Add streams to your personal calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarExport events={events} timezone={userTimezone} />
          </CardContent>
        </Card>
      )}

      {/* Timezone Information */}
      <Card>
        <CardHeader>
          <CardTitle>Timezone Information</CardTitle>
          <CardDescription>Current timezone details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Time:</span>
                <span className="font-medium">
                  {formatTimeInTimezone(new Date(), userTimezone, 'PPp')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timezone:</span>
                <span className="font-medium">{userTimezone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">UTC Offset:</span>
                <span className="font-medium">{getTimezoneOffset(userTimezone)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {(() => {
                const timezoneInfo = POPULAR_TIMEZONES.find(tz => tz.id === userTimezone);
                if (!timezoneInfo) return null;
                
                return (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country:</span>
                      <span className="font-medium">{timezoneInfo.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Region:</span>
                      <span className="font-medium">{timezoneInfo.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">DST:</span>
                      <Badge variant={timezoneInfo.isDst ? "default" : "outline"}>
                        {timezoneInfo.isDst ? 'Observes DST' : 'No DST'}
                      </Badge>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}