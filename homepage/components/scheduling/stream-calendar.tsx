'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  Globe,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Zap,
  Heart,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isSameDay, isAfter, isBefore, startOfDay, endOfDay, addHours, setHours, setMinutes } from 'date-fns';

// Stream scheduling data types
export interface StreamEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  duration: number; // minutes
  type: 'live' | 'scheduled' | 'recurring';
  category: 'music' | 'talk' | 'gaming' | 'education' | 'culture' | 'other';
  timezone: string;
  isPublic: boolean;
  maxViewers?: number;
  thumbnailUrl?: string;
  tags: string[];
  
  // Recurring event properties
  recurringPattern?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[]; // 0-6, Sunday-Saturday
    endDate?: Date;
  };
  
  // RSVP and engagement
  rsvpCount: number;
  interestedCount: number;
  reminder: {
    enabled: boolean;
    time: number; // minutes before
    channels: ('push' | 'email' | 'in-app')[];
  };
  
  // Status and metadata
  status: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamCalendarData {
  events: StreamEvent[];
  timezone: string;
  conflictDetection: boolean;
  viewerPreferences: {
    timezone: string;
    reminderDefaults: {
      time: number;
      channels: ('push' | 'email' | 'in-app')[];
    };
  };
}

interface StreamCalendarProps {
  data: StreamCalendarData;
  onEventCreate?: (event: Omit<StreamEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEventUpdate?: (eventId: string, updates: Partial<StreamEvent>) => void;
  onEventDelete?: (eventId: string) => void;
  onRSVP?: (eventId: string, type: 'rsvp' | 'interested') => void;
  className?: string;
  variant?: 'creator' | 'viewer' | 'public';
}

// Stream categories configuration
const streamCategories = {
  music: { label: 'Music', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: '🎵' },
  talk: { label: 'Talk Show', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: '💬' },
  gaming: { label: 'Gaming', color: 'bg-green-100 text-green-700 border-green-300', icon: '🎮' },
  education: { label: 'Education', color: 'bg-orange-100 text-orange-700 border-orange-300', icon: '📚' },
  culture: { label: 'Cultural', color: 'bg-red-100 text-red-700 border-red-300', icon: '🇭🇹' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: '📺' }
};

// Stream status configuration
const streamStatus = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: Edit },
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700', icon: CalendarIcon },
  live: { label: 'Live Now', color: 'bg-red-100 text-red-700', icon: Video },
  ended: { label: 'Ended', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: AlertCircle }
};

// Calendar view component
function CalendarView({ 
  data,
  selectedDate,
  onDateSelect,
  onEventSelect,
  viewMode = 'month'
}: { 
  data: StreamCalendarData;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventSelect?: (event: StreamEvent) => void;
  viewMode?: 'month' | 'week' | 'day';
}) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  const getEventsForDate = (date: Date) => {
    if (!date || isNaN(date.getTime())) return [];
    return data.events.filter(event => {
      if (!event.startTime || isNaN(event.startTime.getTime())) return false;
      return isSameDay(event.startTime, date);
    });
  };
  
  const getEventIndicators = (date: Date) => {
    if (!date || isNaN(date.getTime())) return null;
    const events = getEventsForDate(date);
    if (events.length === 0) return null;
    
    return (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
        {events.slice(0, 3).map((event, index) => {
          const category = streamCategories[event.category];
          return (
            <div
              key={event.id}
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                event.status === 'live' ? 'bg-red-500 animate-pulse' :
                event.status === 'scheduled' ? 'bg-blue-500' :
                'bg-gray-400'
              )}
              title={event.title}
            />
          );
        })}
        {events.length > 3 && (
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" title={`+${events.length - 3} more`} />
        )}
      </div>
    );
  };
  
  if (viewMode === 'week') {
    const startOfWeek = currentMonth && !isNaN(currentMonth.getTime()) ? startOfDay(currentMonth) : startOfDay(new Date());
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));
    
    return (
      <div className="space-y-4">
        {/* Week navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(prev => addDays(prev, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium">
            {weekDays[0] && !isNaN(weekDays[0].getTime()) ? format(weekDays[0], 'MMM d') : '---'} - {weekDays[6] && !isNaN(weekDays[6].getTime()) ? format(weekDays[6], 'MMM d, yyyy') : '---'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(prev => addDays(prev, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Week grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, index) => {
            if (!date || isNaN(date.getTime())) return null;
            const events = getEventsForDate(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onDateSelect?.(date)}
                className={cn(
                  "p-3 rounded-lg border text-center transition-all min-h-[120px] flex flex-col",
                  isSelected 
                    ? "border-purple-500 bg-purple-50" 
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-600">
                    {date && !isNaN(date.getTime()) ? format(date, 'EEE') : '---'}
                  </p>
                  <p className="text-lg font-bold">
                    {date && !isNaN(date.getTime()) ? format(date, 'd') : '?'}
                  </p>
                </div>
                
                <div className="flex-1 space-y-1">
                  {events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventSelect?.(event);
                      }}
                      className={cn(
                        "text-xs p-1 rounded truncate text-left cursor-pointer",
                        streamCategories[event.category].color
                      )}
                    >
                      {event.startTime && !isNaN(event.startTime.getTime()) ? format(event.startTime, 'HH:mm') : '--:--'} {event.title}
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div className="text-xs text-gray-500">+{events.length - 3} more</div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }
  
  if (viewMode === 'day') {
    const selectedDay = selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate : new Date();
    const events = getEventsForDate(selectedDay).sort((a, b) => {
      if (!a.startTime || !b.startTime || isNaN(a.startTime.getTime()) || isNaN(b.startTime.getTime())) return 0;
      return a.startTime.getTime() - b.startTime.getTime();
    });
    
    return (
      <div className="space-y-4">
        {/* Day navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateSelect?.(addDays(selectedDay, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium">
            {selectedDay && !isNaN(selectedDay.getTime()) ? format(selectedDay, 'EEEE, MMMM d, yyyy') : 'Invalid Date'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateSelect?.(addDays(selectedDay, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Day schedule */}
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No streams scheduled for this day</p>
            </div>
          ) : (
            events.map((event) => {
              const category = streamCategories[event.category];
              const status = streamStatus[event.status];
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-lg border-l-4 cursor-pointer hover:bg-gray-50 transition-colors",
                    category.color.replace('bg-', 'border-l-').replace('-100', '-400')
                  )}
                  onClick={() => onEventSelect?.(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{category.icon}</span>
                        <h4 className="font-semibold">{event.title}</h4>
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {event.startTime && !isNaN(event.startTime.getTime()) ? format(event.startTime, 'HH:mm') : '--:--'} - {event.startTime && !isNaN(event.startTime.getTime()) ? format(addHours(event.startTime, event.duration / 60), 'HH:mm') : '--:--'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event.rsvpCount + event.interestedCount} interested</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <span>{event.timezone}</span>
                        </div>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                      )}
                      
                      {event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    );
  }
  
  // Month view (default)
  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(prev => addDays(prev, -30))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-medium">
          {currentMonth && !isNaN(currentMonth.getTime()) ? format(currentMonth, 'MMMM yyyy') : 'Invalid Date'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(prev => addDays(prev, 30))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Calendar */}
      <div className="relative">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect?.(date)}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-md border"
          components={{
            DayButton: ({ day, ...props }) => (
              <button {...props} className={cn(props.className, "relative")}>
                {day?.date && !isNaN(day.date.getTime()) ? format(day.date, 'd') : '?'}
                {day?.date && !isNaN(day.date.getTime()) ? getEventIndicators(day.date) : null}
              </button>
            )
          }}
        />
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span>Live Now</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-400 rounded-full" />
          <span>Draft/Other</span>
        </div>
      </div>
    </div>
  );
}

// Stream event form
function StreamEventForm({
  event,
  onSave,
  onCancel,
  timezone
}: {
  event?: Partial<StreamEvent>;
  onSave: (event: Omit<StreamEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  timezone: string;
}) {
  const [formData, setFormData] = React.useState({
    title: event?.title || '',
    description: event?.description || '',
    startTime: event?.startTime || new Date(),
    duration: event?.duration || 60,
    category: event?.category || 'talk' as StreamEvent['category'],
    isPublic: event?.isPublic !== false,
    maxViewers: event?.maxViewers || undefined,
    tags: event?.tags || [],
    reminder: event?.reminder || {
      enabled: true,
      time: 15,
      channels: ['push', 'in-app'] as ('push' | 'email' | 'in-app')[]
    }
  });
  
  const [newTag, setNewTag] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const streamEvent: Omit<StreamEvent, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      type: 'scheduled',
      timezone,
      rsvpCount: 0,
      interestedCount: 0,
      status: 'scheduled'
    };
    
    onSave(streamEvent);
  };
  
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Stream Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="What's your stream about?"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Tell viewers what to expect..."
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value: StreamEvent['category']) => 
              setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(streamCategories).map(([key, category]) => (
                  <SelectItem key={key} value={key}>
                    {category.icon} {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
              min="15"
              max="480"
            />
          </div>
        </div>
      </div>
      
      {/* Scheduling */}
      <div className="space-y-4">
        <h4 className="font-medium">Schedule</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={format(formData.startTime, 'yyyy-MM-dd')}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setFormData(prev => ({
                  ...prev,
                  startTime: setHours(setMinutes(newDate, prev.startTime.getMinutes()), prev.startTime.getHours())
                }));
              }}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          
          <div>
            <Label>Time</Label>
            <Input
              type="time"
              value={format(formData.startTime, 'HH:mm')}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':').map(Number);
                setFormData(prev => ({
                  ...prev,
                  startTime: setHours(setMinutes(prev.startTime, minutes), hours)
                }));
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Tags */}
      <div className="space-y-4">
        <h4 className="font-medium">Tags</h4>
        
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {event ? 'Update Stream' : 'Schedule Stream'}
        </Button>
      </div>
    </form>
  );
}

// Main stream calendar component
export function StreamCalendar({
  data,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onRSVP,
  className,
  variant = 'creator'
}: StreamCalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [viewMode, setViewMode] = React.useState<'month' | 'week' | 'day'>('month');
  const [showEventDialog, setShowEventDialog] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<StreamEvent | null>(null);
  const [showEventForm, setShowEventForm] = React.useState(false);
  
  const handleEventCreate = (event: Omit<StreamEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    onEventCreate?.(event);
    setShowEventForm(false);
  };
  
  const handleEventSelect = (event: StreamEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };
  
  const todayEvents = data.events.filter(event => 
    isSameDay(event.startTime, new Date()) && 
    event.status === 'scheduled'
  );
  
  const upcomingEvents = data.events
    .filter(event => 
      isAfter(event.startTime, new Date()) && 
      event.status === 'scheduled'
    )
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 5);
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stream Calendar</h2>
          <p className="text-gray-600">
            {variant === 'creator' 
              ? 'Manage your streaming schedule'
              : 'Discover upcoming streams'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(mode)}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
          
          {variant === 'creator' && (
            <Button onClick={() => setShowEventForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Stream
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <CalendarView
                data={data}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onEventSelect={handleEventSelect}
                viewMode={viewMode}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's streams */}
          {todayEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-500" />
                  Today's Streams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-red-50 rounded-lg border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
                    onClick={() => handleEventSelect(event)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{streamCategories[event.category].icon}</span>
                      <span className="font-medium text-sm">{event.title}</span>
                    </div>
                    <div className="text-xs text-red-600">
                      {format(event.startTime, 'HH:mm')} • {event.duration} min
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* Upcoming streams */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Upcoming Streams
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No upcoming streams scheduled
                </p>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleEventSelect(event)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{streamCategories[event.category].icon}</span>
                      <span className="font-medium text-sm">{event.title}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {format(event.startTime, 'MMM d, HH:mm')} • {event.duration} min
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        <span>{event.rsvpCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{event.interestedCount}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          
          {/* Quick actions */}
          {variant === 'creator' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setShowEventForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Stream
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Last Stream
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Event creation dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Stream</DialogTitle>
            <DialogDescription>
              Create a new live stream event for your audience
            </DialogDescription>
          </DialogHeader>
          
          <StreamEventForm
            onSave={handleEventCreate}
            onCancel={() => setShowEventForm(false)}
            timezone={data.timezone}
          />
        </DialogContent>
      </Dialog>
      
      {/* Event details dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{streamCategories[selectedEvent.category].icon}</span>
                  {selectedEvent.title}
                </DialogTitle>
                <DialogDescription>
                  {format(selectedEvent.startTime, 'EEEE, MMMM d, yyyy • HH:mm')} • {selectedEvent.duration} minutes
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {selectedEvent.description && (
                  <p className="text-gray-700">{selectedEvent.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{selectedEvent.rsvpCount + selectedEvent.interestedCount} interested</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{selectedEvent.timezone}</span>
                  </div>
                </div>
                
                {selectedEvent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {variant === 'viewer' && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1"
                      onClick={() => onRSVP?.(selectedEvent.id, 'rsvp')}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      RSVP
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => onRSVP?.(selectedEvent.id, 'interested')}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Interested
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}