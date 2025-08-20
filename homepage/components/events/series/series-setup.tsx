'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  Clock,
  Target,
  FileText,
  Hash,
  Sparkles,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Users,
  TrendingUp,
  Award,
  Info,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventInSeries {
  id: string;
  title: string;
  date: Date;
  time: string;
  theme?: string;
  description?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface SeriesGoal {
  type: 'attendance' | 'revenue' | 'engagement' | 'completion';
  target: number;
  current: number;
  unit: string;
}

interface SeriesSetupProps {
  onCreateSeries?: (series: any) => void;
  onUpdateSeries?: (series: any) => void;
  onAddEvent?: (event: EventInSeries) => void;
  onRemoveEvent?: (eventId: string) => void;
}

export function SeriesSetup({
  onCreateSeries,
  onUpdateSeries,
  onAddEvent,
  onRemoveEvent
}: SeriesSetupProps) {
  const [seriesTitle, setSeriesTitle] = React.useState('');
  const [seriesTheme, setSeriesTheme] = React.useState('');
  const [numberOfEvents, setNumberOfEvents] = React.useState(4);
  const [schedulePattern, setSchedulePattern] = React.useState<'weekly' | 'biweekly' | 'monthly' | 'custom'>('weekly');
  const [seriesDescription, setSeriesDescription] = React.useState('');
  const [seriesGoals, setSeriesGoals] = React.useState<SeriesGoal[]>([
    { type: 'attendance', target: 500, current: 0, unit: 'attendees' },
    { type: 'revenue', target: 10000, current: 0, unit: 'USD' },
    { type: 'engagement', target: 80, current: 0, unit: '%' },
    { type: 'completion', target: 70, current: 0, unit: '%' }
  ]);
  const [events, setEvents] = React.useState<EventInSeries[]>([]);
  const [seriesTags, setSeriesTags] = React.useState<string[]>(['masterclass', 'series', 'haitian-culture']);
  const [newTag, setNewTag] = React.useState('');

  // Schedule patterns
  const patterns = [
    { value: 'weekly', label: 'Weekly', description: 'Every week at the same time' },
    { value: 'biweekly', label: 'Bi-weekly', description: 'Every two weeks' },
    { value: 'monthly', label: 'Monthly', description: 'Once a month' },
    { value: 'custom', label: 'Custom', description: 'Set your own schedule' }
  ];

  // Generate sample events based on pattern
  const generateEvents = () => {
    const baseDate = new Date();
    const newEvents: EventInSeries[] = [];
    
    for (let i = 0; i < numberOfEvents; i++) {
      const eventDate = new Date(baseDate);
      
      switch (schedulePattern) {
        case 'weekly':
          eventDate.setDate(eventDate.getDate() + (i * 7));
          break;
        case 'biweekly':
          eventDate.setDate(eventDate.getDate() + (i * 14));
          break;
        case 'monthly':
          eventDate.setMonth(eventDate.getMonth() + i);
          break;
        default:
          eventDate.setDate(eventDate.getDate() + (i * 7));
      }
      
      newEvents.push({
        id: `event-${i + 1}`,
        title: `${seriesTitle} - Episode ${i + 1}`,
        date: eventDate,
        time: '7:00 PM EST',
        theme: `Theme for episode ${i + 1}`,
        status: 'scheduled'
      });
    }
    
    setEvents(newEvents);
  };

  const handleAddTag = () => {
    if (newTag && !seriesTags.includes(newTag)) {
      setSeriesTags([...seriesTags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSeriesTags(seriesTags.filter(t => t !== tag));
  };

  const getGoalProgress = (goal: SeriesGoal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getGoalColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Series Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Series Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Series Title</Label>
            <Input
              value={seriesTitle}
              onChange={(e) => setSeriesTitle(e.target.value)}
              placeholder="Enter your series title..."
              className="mt-1"
            />
          </div>

          <div>
            <Label>Series Theme</Label>
            <Input
              value={seriesTheme}
              onChange={(e) => setSeriesTheme(e.target.value)}
              placeholder="What's the overarching theme?"
              className="mt-1"
            />
            <p className="text-xs text-gray-600 mt-1">
              This helps maintain consistency across all events in the series
            </p>
          </div>

          <div>
            <Label>Series Description</Label>
            <Textarea
              value={seriesDescription}
              onChange={(e) => setSeriesDescription(e.target.value)}
              placeholder="Describe what attendees will learn or experience throughout the series..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Series Tags</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {seriesTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  <Hash className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Number of Events</Label>
              <Input
                type="number"
                value={numberOfEvents}
                onChange={(e) => setNumberOfEvents(parseInt(e.target.value))}
                min="2"
                max="52"
                className="mt-1"
              />
              <p className="text-xs text-gray-600 mt-1">
                Between 2 and 52 events
              </p>
            </div>

            <div>
              <Label>Schedule Pattern</Label>
              <select
                value={schedulePattern}
                onChange={(e) => setSchedulePattern(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg mt-1"
              >
                {patterns.map((pattern) => (
                  <option key={pattern.value} value={pattern.value}>
                    {pattern.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {patterns.map((pattern) => (
              <div
                key={pattern.value}
                className={cn(
                  "p-3 border rounded-lg cursor-pointer transition-colors",
                  schedulePattern === pattern.value
                    ? "border-purple-600 bg-purple-50"
                    : "hover:bg-gray-50"
                )}
                onClick={() => setSchedulePattern(pattern.value as any)}
              >
                <p className="font-medium text-sm">{pattern.label}</p>
                <p className="text-xs text-gray-600 mt-1">{pattern.description}</p>
              </div>
            ))}
          </div>

          <Button 
            onClick={generateEvents}
            className="w-full"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Generate Event Schedule
          </Button>
        </CardContent>
      </Card>

      {/* Event Schedule Preview */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Event Schedule Preview
              </CardTitle>
              <Badge>{events.length} Events</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.slice(0, 5).map((event, index) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {event.date.toLocaleDateString()} at {event.time}
                      </p>
                      {event.theme && (
                        <p className="text-xs text-gray-500 mt-1">{event.theme}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{event.status}</Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onRemoveEvent?.(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {events.length > 5 && (
                <p className="text-sm text-gray-600 text-center">
                  And {events.length - 5} more events...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Series Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Series Goals & Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {seriesGoals.map((goal) => {
              const progress = getGoalProgress(goal);
              return (
                <div key={goal.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium capitalize">{goal.type}</p>
                      <p className="text-xs text-gray-600">
                        Target: {goal.target} {goal.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-lg font-bold", getGoalColor(progress))}>
                        {progress.toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-600">
                        {goal.current} / {goal.target}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all",
                        progress >= 80 ? "bg-green-600" :
                        progress >= 60 ? "bg-yellow-600" :
                        progress >= 40 ? "bg-orange-600" :
                        "bg-red-600"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Series Benefits */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Series Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Build Momentum</p>
                <p className="text-xs text-gray-600">
                  Each event builds on the previous, creating anticipation
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Recurring Revenue</p>
                <p className="text-xs text-gray-600">
                  Predictable income from series passes and subscriptions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Community Building</p>
                <p className="text-xs text-gray-600">
                  Foster a dedicated community around your series
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Content Efficiency</p>
                <p className="text-xs text-gray-600">
                  Plan and produce content more efficiently in batches
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Series Analytics Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Expected Series Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Based on similar series, expect 15-20% higher attendance for series events compared to standalone events, 
              with 60% of attendees purchasing series passes.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-bold">2,000</p>
              <p className="text-xs text-gray-600">Est. Total Attendees</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold">$40K</p>
              <p className="text-xs text-gray-600">Est. Revenue</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-lg font-bold">85%</p>
              <p className="text-xs text-gray-600">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Series Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Save as Draft
        </Button>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600"
          onClick={() => onCreateSeries?.({
            title: seriesTitle,
            theme: seriesTheme,
            description: seriesDescription,
            numberOfEvents,
            schedulePattern,
            events,
            goals: seriesGoals,
            tags: seriesTags
          })}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Create Series
        </Button>
      </div>
    </div>
  );
}