'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import {
  Calendar,
  Clock,
  Repeat,
  Settings,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Info,
  Zap,
  Timer
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { cn } from '@/lib/utils';

interface RecurrencePattern {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'custom';
  interval: number;
  duration: number; // in weeks/months
  startDate: Date;
  endDate?: Date;
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  daysOfMonth?: number[]; // 1-31
  timeSlot: string;
  timezone: string;
  active: boolean;
  maxEvents?: number;
}

interface PatternAnalytics {
  expectedAttendance: number;
  dropOffRate: number;
  retentionRate: number;
  optimalFrequency: string;
  seasonalAdjustments: boolean;
}

interface RecurringPatternsProps {
  seriesTitle?: string;
  onSavePattern?: (pattern: RecurrencePattern) => void;
  onActivatePattern?: (patternId: string) => void;
  onPausePattern?: (patternId: string) => void;
}

export function RecurringPatterns({
  seriesTitle = "Haitian Culture & Heritage Series",
  onSavePattern,
  onActivatePattern,
  onPausePattern
}: RecurringPatternsProps) {
  const [selectedPattern, setSelectedPattern] = React.useState<string>('weekly');
  const [customInterval, setCustomInterval] = React.useState(1);
  const [maxEvents, setMaxEvents] = React.useState(12);
  const [timeSlot, setTimeSlot] = React.useState('19:00');
  const [timezone, setTimezone] = React.useState('America/New_York');
  const [selectedDays, setSelectedDays] = React.useState<number[]>([3]); // Wednesday
  const [enableSeasonalAdjustments, setEnableSeasonalAdjustments] = React.useState(true);
  const [autoReschedule, setAutoReschedule] = React.useState(true);
  const [bufferDays, setBufferDays] = React.useState(2);

  // Predefined patterns
  const patterns = [
    {
      id: 'weekly',
      name: 'Weekly',
      description: 'Same day and time every week',
      frequency: 'weekly' as const,
      interval: 1,
      icon: Calendar,
      optimal: true,
      attendanceRate: 85,
      retentionRate: 78
    },
    {
      id: 'biweekly',
      name: 'Bi-weekly',
      description: 'Every two weeks',
      frequency: 'biweekly' as const,
      interval: 2,
      icon: Calendar,
      optimal: false,
      attendanceRate: 92,
      retentionRate: 84
    },
    {
      id: 'monthly',
      name: 'Monthly',
      description: 'Once per month',
      frequency: 'monthly' as const,
      interval: 1,
      icon: Calendar,
      optimal: false,
      attendanceRate: 95,
      retentionRate: 72
    },
    {
      id: 'custom',
      name: 'Custom',
      description: 'Define your own pattern',
      frequency: 'custom' as const,
      interval: 1,
      icon: Settings,
      optimal: false,
      attendanceRate: 88,
      retentionRate: 75
    }
  ];

  // Days of week
  const daysOfWeek = [
    { value: 0, label: 'Sun', name: 'Sunday' },
    { value: 1, label: 'Mon', name: 'Monday' },
    { value: 2, label: 'Tue', name: 'Tuesday' },
    { value: 3, label: 'Wed', name: 'Wednesday' },
    { value: 4, label: 'Thu', name: 'Thursday' },
    { value: 5, label: 'Fri', name: 'Friday' },
    { value: 6, label: 'Sat', name: 'Saturday' }
  ];

  // Time slots
  const timeSlots = [
    { value: '09:00', label: '9:00 AM', popularity: 45 },
    { value: '12:00', label: '12:00 PM', popularity: 60 },
    { value: '15:00', label: '3:00 PM', popularity: 70 },
    { value: '18:00', label: '6:00 PM', popularity: 85 },
    { value: '19:00', label: '7:00 PM', popularity: 95 },
    { value: '20:00', label: '8:00 PM', popularity: 88 },
    { value: '21:00', label: '9:00 PM', popularity: 65 }
  ];

  // Sample analytics data
  const attendanceProjection = React.useMemo(() => {
    const currentPattern = patterns.find(p => p.id === selectedPattern);
    if (!currentPattern) return [];

    const weeks = [];
    for (let i = 1; i <= Math.min(maxEvents, 12); i++) {
      // Simulate natural drop-off over time
      const baseAttendance = currentPattern.attendanceRate;
      const dropOff = Math.max(0, (i - 1) * 2); // 2% drop per event
      const seasonalBoost = enableSeasonalAdjustments && (i % 4 === 0) ? 5 : 0;
      const finalAttendance = Math.max(40, baseAttendance - dropOff + seasonalBoost);
      
      weeks.push({
        event: `Event ${i}`,
        attendance: finalAttendance,
        retention: Math.max(50, currentPattern.retentionRate - (i - 1) * 1.5),
        engagement: Math.max(60, 90 - (i - 1) * 2)
      });
    }
    return weeks;
  }, [selectedPattern, maxEvents, enableSeasonalAdjustments]);

  // Pattern comparison data
  const patternComparison = patterns.map(pattern => ({
    name: pattern.name,
    attendance: pattern.attendanceRate,
    retention: pattern.retentionRate,
    sustainability: pattern.frequency === 'weekly' ? 85 : 
                    pattern.frequency === 'biweekly' ? 92 :
                    pattern.frequency === 'monthly' ? 78 : 80
  }));

  // Generate sample events
  const generateEvents = React.useMemo(() => {
    const events = [];
    const startDate = new Date();
    let currentDate = new Date(startDate);
    
    for (let i = 0; i < Math.min(maxEvents, 8); i++) {
      if (selectedPattern === 'weekly') {
        currentDate.setDate(currentDate.getDate() + (i * 7));
      } else if (selectedPattern === 'biweekly') {
        currentDate.setDate(currentDate.getDate() + (i * 14));
      } else if (selectedPattern === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + i);
      } else {
        currentDate.setDate(currentDate.getDate() + (i * customInterval * 7));
      }
      
      events.push({
        id: i + 1,
        date: new Date(currentDate),
        title: `${seriesTitle} - Episode ${i + 1}`,
        time: timeSlot,
        status: i === 0 ? 'upcoming' : 'scheduled'
      });
    }
    
    return events;
  }, [selectedPattern, maxEvents, customInterval, timeSlot, seriesTitle]);

  const handleDayToggle = (dayValue: number) => {
    setSelectedDays(prev => 
      prev.includes(dayValue) 
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue]
    );
  };

  const currentPattern = patterns.find(p => p.id === selectedPattern);
  const selectedTimeSlot = timeSlots.find(t => t.value === timeSlot);

  return (
    <div className="space-y-6">
      {/* Pattern Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Recurrence Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {patterns.map((pattern) => {
              const Icon = pattern.icon;
              return (
                <div
                  key={pattern.id}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all",
                    selectedPattern === pattern.id
                      ? "border-purple-600 bg-purple-50"
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => setSelectedPattern(pattern.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-sm">{pattern.name}</h3>
                    {pattern.optimal && (
                      <Badge variant="success" className="text-xs">
                        Optimal
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{pattern.description}</p>
                  <div className="flex justify-between text-xs">
                    <span>Attendance: {pattern.attendanceRate}%</span>
                    <span>Retention: {pattern.retentionRate}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedPattern === 'custom' && (
            <div className="p-4 border rounded-lg bg-gray-50 mb-4">
              <h4 className="font-medium mb-3">Custom Pattern Settings</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Repeat every</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={customInterval}
                      onChange={(e) => setCustomInterval(parseInt(e.target.value))}
                      className="w-20"
                      min="1"
                      max="12"
                    />
                    <span className="text-sm">weeks</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Schedule Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Days of Week */}
          <div>
            <Label className="text-sm font-medium">Days of Week</Label>
            <div className="grid grid-cols-7 gap-2 mt-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day.value}
                  variant={selectedDays.includes(day.value) ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => handleDayToggle(day.value)}
                >
                  {day.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Selected: {selectedDays.map(d => daysOfWeek.find(day => day.value === d)?.name).join(', ')}
            </p>
          </div>

          {/* Time Slot */}
          <div>
            <Label className="text-sm font-medium">Time Slot</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mt-2">
              {timeSlots.map((slot) => (
                <div
                  key={slot.value}
                  className={cn(
                    "p-2 border rounded cursor-pointer text-center transition-all",
                    timeSlot === slot.value
                      ? "border-purple-600 bg-purple-50"
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => setTimeSlot(slot.value)}
                >
                  <p className="text-sm font-medium">{slot.label}</p>
                  <p className="text-xs text-gray-600">{slot.popularity}% popular</p>
                </div>
              ))}
            </div>
            {selectedTimeSlot && (
              <Alert className="mt-2">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {selectedTimeSlot.label} is {selectedTimeSlot.popularity}% popular among similar events. 
                  Higher popularity times typically have better attendance rates.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Series Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Number of Events</Label>
              <span className="text-sm font-medium">{maxEvents} events</span>
            </div>
            <Slider
              value={[maxEvents]}
              onValueChange={(value) => setMaxEvents(value[0])}
              max={24}
              min={2}
              step={1}
              className="mb-2"
            />
            <p className="text-xs text-gray-600">
              Series will run for approximately {Math.ceil(maxEvents * (selectedPattern === 'weekly' ? 1 : selectedPattern === 'biweekly' ? 2 : 4))} weeks
            </p>
          </div>

          {/* Timezone */}
          <div>
            <Label className="text-sm font-medium">Timezone</Label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mt-1"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Seasonal Adjustments</p>
              <p className="text-xs text-gray-600">Automatically adjust schedule for holidays and peak seasons</p>
            </div>
            <Switch
              checked={enableSeasonalAdjustments}
              onCheckedChange={setEnableSeasonalAdjustments}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Auto-Reschedule</p>
              <p className="text-xs text-gray-600">Automatically reschedule conflicting events</p>
            </div>
            <Switch
              checked={autoReschedule}
              onCheckedChange={setAutoReschedule}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Buffer Days</Label>
              <span className="text-sm">{bufferDays} days</span>
            </div>
            <Slider
              value={[bufferDays]}
              onValueChange={(value) => setBufferDays(value[0])}
              max={7}
              min={0}
              step={1}
            />
            <p className="text-xs text-gray-600 mt-1">
              Minimum days between rescheduled events
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Generated Schedule Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Schedule Preview</CardTitle>
            <Badge>{generateEvents.length} events scheduled</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generateEvents.slice(0, 6).map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">
                  {event.id}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-gray-600">
                    {event.date.toLocaleDateString()} at {event.time}
                  </p>
                </div>
                <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'} className="text-xs">
                  {event.status}
                </Badge>
              </div>
            ))}
          </div>
          {generateEvents.length > 6 && (
            <p className="text-sm text-gray-600 text-center mt-4">
              And {generateEvents.length - 6} more events...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pattern Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Projection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attendance Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={attendanceProjection}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#9333EA" 
                  fillOpacity={1} 
                  fill="url(#colorAttendance)"
                  name="Attendance %"
                />
                <Line 
                  type="monotone" 
                  dataKey="retention" 
                  stroke="#EC4899" 
                  strokeWidth={2}
                  name="Retention %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pattern Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pattern Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={patternComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="attendance" fill="#9333EA" name="Attendance" />
                <Bar dataKey="retention" fill="#EC4899" name="Retention" />
                <Bar dataKey="sustainability" fill="#10B981" name="Sustainability" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pattern Insights */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Pattern Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentPattern?.optimal && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Weekly patterns show the best balance of engagement and sustainability for cultural series.
                </AlertDescription>
              </Alert>
            )}
            
            {selectedTimeSlot && selectedTimeSlot.popularity > 80 && (
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  Your selected time slot ({selectedTimeSlot.label}) is highly popular and likely to have good attendance.
                </AlertDescription>
              </Alert>
            )}
            
            {maxEvents > 16 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Series longer than 16 events may experience higher drop-off rates. Consider breaking into multiple seasons.
                </AlertDescription>
              </Alert>
            )}
            
            {enableSeasonalAdjustments && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Seasonal adjustments will help maintain engagement during holidays and cultural celebrations.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Pattern */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Test Pattern
        </Button>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600"
          onClick={() => onSavePattern?.({
            id: `pattern-${Date.now()}`,
            name: `${currentPattern?.name} Pattern`,
            description: `${currentPattern?.description} for ${seriesTitle}`,
            frequency: currentPattern?.frequency || 'weekly',
            interval: selectedPattern === 'custom' ? customInterval : currentPattern?.interval || 1,
            duration: maxEvents,
            startDate: new Date(),
            daysOfWeek: selectedDays,
            timeSlot,
            timezone,
            active: true,
            maxEvents
          })}
        >
          <Repeat className="h-4 w-4 mr-2" />
          Save Recurrence Pattern
        </Button>
      </div>
    </div>
  );
}