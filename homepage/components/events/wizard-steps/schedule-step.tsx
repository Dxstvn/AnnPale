'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Repeat,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { EventData } from '../event-creation-wizard';

interface ScheduleStepProps {
  data: EventData;
  onUpdate: (updates: Partial<EventData>) => void;
  errors?: string[];
}

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'America/Port-au-Prince', label: 'Haiti Time' }
];

const DURATION_OPTIONS = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' }
];

export function EventScheduleStep({
  data,
  onUpdate,
  errors = []
}: ScheduleStepProps) {
  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <Label>
          Event Date <span className="text-red-500">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-1",
                !data.date && "text-muted-foreground",
                errors.some(e => e.includes('date')) && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.date ? format(data.date, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={data.date}
              onSelect={(date) => onUpdate({ date })}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="time">
            Start Time <span className="text-red-500">*</span>
          </Label>
          <div className="relative mt-1">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="time"
              type="time"
              value={data.time}
              onChange={(e) => onUpdate({ time: e.target.value })}
              className={cn(
                "pl-10",
                errors.some(e => e.includes('time')) && "border-red-500"
              )}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="timezone">
            Timezone <span className="text-red-500">*</span>
          </Label>
          <Select value={data.timezone} onValueChange={(value) => onUpdate({ timezone: value })}>
            <SelectTrigger 
              id="timezone"
              className={cn(
                "mt-1",
                errors.some(e => e.includes('timezone')) && "border-red-500"
              )}
            >
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Duration */}
      <div>
        <Label htmlFor="duration">
          Duration <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={data.duration.toString()} 
          onValueChange={(value) => onUpdate({ duration: parseInt(value) })}
        >
          <SelectTrigger 
            id="duration"
            className={cn(
              "mt-1",
              errors.some(e => e.includes('duration')) && "border-red-500"
            )}
          >
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {DURATION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Recurring Event */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recurring Event</CardTitle>
            <Switch
              checked={data.isRecurring}
              onCheckedChange={(checked) => onUpdate({ isRecurring: checked })}
            />
          </div>
        </CardHeader>
        {data.isRecurring && (
          <CardContent className="space-y-4">
            <div>
              <Label>Frequency</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 flex items-start gap-2">
                <Repeat className="h-4 w-4 mt-0.5" />
                This will create multiple event instances based on your schedule
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Registration Deadline */}
      <div>
        <Label>Registration Deadline (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal mt-1"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.registrationDeadline 
                ? format(data.registrationDeadline, "PPP") 
                : "No deadline (closes when event starts)"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={data.registrationDeadline}
              onSelect={(date) => onUpdate({ registrationDeadline: date })}
              initialFocus
              disabled={(date) => date < new Date() || (data.date && date > data.date)}
            />
          </PopoverContent>
        </Popover>
        <p className="text-sm text-gray-500 mt-1">
          Set a deadline to create urgency or leave empty to accept registrations until event starts
        </p>
      </div>

      {/* Info Alert */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-900">Time Zone Information</p>
            <p className="text-sm text-yellow-800 mt-1">
              The event time will be displayed in each attendee's local timezone. 
              Make sure to clearly communicate the time in your promotions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}