'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StreamCalendar, type StreamCalendarData, type StreamEvent } from '@/components/scheduling/stream-calendar';
import { NotificationSystem, type NotificationInstance, type NotificationPreferences } from '@/components/scheduling/notification-system';
import { TimezoneConverter, type StreamEventWithTimezone } from '@/components/scheduling/timezone-converter';
import { CreatorSchedulingTools, type StreamTemplate, type BulkScheduleOperation, type ScheduleConflict } from '@/components/scheduling/creator-scheduling-tools';
import {
  Calendar,
  Bell,
  Globe,
  Settings,
  Clock,
  Users,
  Zap,
  Star,
  Heart,
  Video,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  FileText,
  Sparkles,
  BarChart3,
  Activity,
  Eye,
  Smartphone,
  Mail,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { addDays, addHours, addMinutes } from 'date-fns';

export default function Phase417Demo() {
  const [selectedDemo, setSelectedDemo] = useState('overview');
  const [userTimezone, setUserTimezone] = useState('America/New_York');

  // Mock stream events data
  const now = new Date();
  const mockStreamEvents: StreamEvent[] = [
    {
      id: '1',
      title: 'Weekly Music Session',
      description: 'Live Haitian music performance with audience requests',
      startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day from now
      duration: 90,
      type: 'scheduled',
      category: 'music',
      timezone: 'America/Port-au-Prince',
      isPublic: true,
      tags: ['music', 'live', 'haiti', 'requests'],
      rsvpCount: 234,
      interestedCount: 456,
      reminder: {
        enabled: true,
        time: 30,
        channels: ['push', 'email', 'in-app']
      },
      status: 'scheduled',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Cultural Heritage Discussion',
      description: 'Exploring Haitian traditions and their modern relevance',
      startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      duration: 60,
      type: 'scheduled',
      category: 'culture',
      timezone: 'America/Port-au-Prince',
      isPublic: true,
      tags: ['culture', 'education', 'haiti', 'heritage'],
      rsvpCount: 156,
      interestedCount: 289,
      reminder: {
        enabled: true,
        time: 60,
        channels: ['email', 'in-app']
      },
      status: 'scheduled',
      createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Gaming with the Community',
      description: 'Interactive gaming session with live commentary',
      startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      duration: 120,
      type: 'scheduled',
      category: 'gaming',
      timezone: 'America/Port-au-Prince',
      isPublic: true,
      tags: ['gaming', 'interactive', 'community'],
      rsvpCount: 89,
      interestedCount: 167,
      reminder: {
        enabled: true,
        time: 15,
        channels: ['push', 'in-app']
      },
      status: 'scheduled',
      createdAt: new Date(now.getTime() - 72 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 36 * 60 * 60 * 1000)
    }
  ];

  const mockStreamCalendarData: StreamCalendarData = {
    events: mockStreamEvents,
    timezone: 'America/Port-au-Prince',
    conflictDetection: true,
    viewerPreferences: {
      timezone: userTimezone,
      reminderDefaults: {
        time: 30,
        channels: ['push', 'in-app']
      }
    }
  };

  // Mock notification instances
  const mockNotifications: NotificationInstance[] = [
    {
      id: '1',
      type: 'going-live',
      title: 'Marie is going live now!',
      content: 'Join the Weekly Music Session - Live Haitian music with requests',
      channels: ['push', 'in-app'],
      targetAudience: 'all',
      scheduledAt: new Date(now.getTime() - 60 * 60 * 1000),
      sentAt: new Date(now.getTime() - 60 * 60 * 1000),
      status: 'sent',
      metrics: {
        sent: 1250,
        delivered: 1189,
        opened: 456,
        clicked: 123
      },
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'starting-soon',
      title: 'Cultural Discussion starts in 15 minutes',
      content: 'Get ready for an insightful discussion about Haitian heritage',
      channels: ['push', 'email', 'in-app'],
      targetAudience: 'interested',
      scheduledAt: new Date(now.getTime() + 15 * 60 * 1000),
      status: 'scheduled',
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0
      },
      createdAt: new Date(now.getTime() - 30 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 15 * 60 * 1000)
    },
    {
      id: '3',
      type: 'milestones',
      title: '🎉 Goal Achieved: 200 Tips!',
      content: 'Amazing! We reached our tip goal - special song performance unlocked!',
      channels: ['push', 'in-app'],
      targetAudience: 'all',
      scheduledAt: new Date(now.getTime() - 30 * 60 * 1000),
      sentAt: new Date(now.getTime() - 30 * 60 * 1000),
      status: 'sent',
      metrics: {
        sent: 1156,
        delivered: 1089,
        opened: 892,
        clicked: 234
      },
      createdAt: new Date(now.getTime() - 90 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000)
    }
  ];

  const mockNotificationPreferences: NotificationPreferences = {
    userId: 'user-123',
    channels: {
      push: true,
      email: true,
      inApp: true
    },
    types: {
      'going-live': true,
      'starting-soon': true,
      'scheduled-stream': true,
      'highlights': true,
      'milestones': true
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    frequency: 'immediate',
    timezone: userTimezone
  };

  // Mock timezone converter events
  const mockTimezoneEvents: StreamEventWithTimezone[] = mockStreamEvents.map(event => ({
    id: event.id,
    title: event.title,
    startTime: event.startTime,
    duration: event.duration,
    timezone: event.timezone,
    category: event.category
  }));

  // Event handlers
  const handleEventCreate = (event: Omit<StreamEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Create event:', event);
  };

  const handleEventUpdate = (eventId: string, updates: Partial<StreamEvent>) => {
    console.log('Update event:', eventId, updates);
  };

  const handleEventDelete = (eventId: string) => {
    console.log('Delete event:', eventId);
  };

  const handleRSVP = (eventId: string, type: 'rsvp' | 'interested') => {
    console.log('RSVP:', eventId, type);
  };

  const handleSendNotification = (notification: Omit<NotificationInstance, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Send notification:', notification);
  };

  const handleUpdatePreferences = (preferences: NotificationPreferences) => {
    console.log('Update preferences:', preferences);
  };

  const handleToggleNotificationType = (typeId: string, enabled: boolean) => {
    console.log('Toggle notification type:', typeId, enabled);
  };

  const handleToggleChannel = (channelId: string, enabled: boolean) => {
    console.log('Toggle channel:', channelId, enabled);
  };

  const handleCreateTemplate = (template: Omit<StreamTemplate, 'id' | 'usageCount' | 'createdAt'>) => {
    console.log('Create template:', template);
  };

  const handleUpdateTemplate = (templateId: string, updates: Partial<StreamTemplate>) => {
    console.log('Update template:', templateId, updates);
  };

  const handleDeleteTemplate = (templateId: string) => {
    console.log('Delete template:', templateId);
  };

  const handleBulkSchedule = (operation: Omit<BulkScheduleOperation, 'id' | 'createdAt'>) => {
    console.log('Bulk schedule:', operation);
  };

  const handleConflictCheck = async (dates: Date[], times: string[]): Promise<ScheduleConflict[]> => {
    // Mock conflict detection
    return [
      {
        type: 'overlap',
        severity: 'medium',
        message: 'Potential overlap with existing stream on March 15th',
        suggestedAction: 'Consider shifting start time by 30 minutes',
        affectedEvents: ['existing-event-1']
      }
    ];
  };

  // Phase 4.1.7 statistics
  const phaseStats = {
    totalFeatures: 12,
    calendarViews: 3,
    notificationTypes: 5,
    notificationChannels: 3,
    timezoneSupport: 8,
    schedulingTools: 4
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.1.7: Stream Scheduling & Notifications
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Comprehensive scheduling system helping creators build consistent streaming habits while enabling 
          viewers to plan their viewing time with intelligent notifications and time zone support.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Calendar Views
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Smart Notifications
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Timezone Conversion
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Creator Tools
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            RSVP System
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Bulk Scheduling
          </span>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">📅 Complete Scheduling System Available</h2>
        <p className="mb-6 text-lg opacity-90">
          Experience comprehensive stream scheduling with calendar management, intelligent notifications, 
          timezone conversion, and powerful creator tools designed for consistent audience engagement
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/creator/streaming">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Creator Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/live/demo-stream">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Eye className="w-5 h-5 mr-2" />
              Live Demo
            </Button>
          </Link>
        </div>
      </div>

      {/* Notification Strategy Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Strategy Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Timing</th>
                  <th className="text-left p-3">Channels</th>
                  <th className="text-left p-3">Effectiveness</th>
                  <th className="text-left p-3">Opt-in Rate</th>
                  <th className="text-left p-3">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Going Live</span>
                    </div>
                  </td>
                  <td className="p-3">Instant</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      <Monitor className="w-4 h-4 text-green-500" />
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className="bg-green-100 text-green-700">85%</Badge>
                  </td>
                  <td className="p-3">
                    <Badge className="bg-blue-100 text-blue-700">92%</Badge>
                  </td>
                  <td className="p-3">Immediate viewer capture</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">Starting Soon</span>
                    </div>
                  </td>
                  <td className="p-3">15 min before</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      <Mail className="w-4 h-4 text-red-500" />
                      <Monitor className="w-4 h-4 text-green-500" />
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className="bg-green-100 text-green-700">78%</Badge>
                  </td>
                  <td className="p-3">
                    <Badge className="bg-blue-100 text-blue-700">88%</Badge>
                  </td>
                  <td className="p-3">Planning preparation</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Scheduled Stream</span>
                    </div>
                  </td>
                  <td className="p-3">1 day before</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Mail className="w-4 h-4 text-red-500" />
                      <Monitor className="w-4 h-4 text-green-500" />
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className="bg-yellow-100 text-yellow-700">65%</Badge>
                  </td>
                  <td className="p-3">
                    <Badge className="bg-blue-100 text-blue-700">75%</Badge>
                  </td>
                  <td className="p-3">Schedule awareness</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">Highlights</span>
                    </div>
                  </td>
                  <td className="p-3">Post-stream</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Mail className="w-4 h-4 text-red-500" />
                      <Monitor className="w-4 h-4 text-green-500" />
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className="bg-green-100 text-green-700">70%</Badge>
                  </td>
                  <td className="p-3">
                    <Badge className="bg-blue-100 text-blue-700">82%</Badge>
                  </td>
                  <td className="p-3">Content discovery</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Milestones</span>
                    </div>
                  </td>
                  <td className="p-3">During stream</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      <Monitor className="w-4 h-4 text-green-500" />
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className="bg-green-100 text-green-700">88%</Badge>
                  </td>
                  <td className="p-3">
                    <Badge className="bg-blue-100 text-blue-700">95%</Badge>
                  </td>
                  <td className="p-3">Engagement peaks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo Tabs */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Interactive Scheduling Demo</h2>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Globe className="w-3 h-3 mr-1" />
              {userTimezone}
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              {mockStreamEvents.length} Scheduled
            </Badge>
          </div>
        </div>

        <Tabs value={selectedDemo} onValueChange={setSelectedDemo}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="timezone">Timezone</TabsTrigger>
            <TabsTrigger value="tools">Creator Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <h3 className="text-lg font-semibold mb-2">Smart Calendar</h3>
                    <div className="text-2xl font-bold text-blue-600">3 Views</div>
                    <p className="text-sm text-gray-600 mt-1">Month, Week, Day perspectives</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-green-600" />
                    <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                    <div className="text-2xl font-bold text-green-600">5 Types</div>
                    <p className="text-sm text-gray-600 mt-1">Multi-channel delivery</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Globe className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                    <h3 className="text-lg font-semibold mb-2">Global Reach</h3>
                    <div className="text-2xl font-bold text-purple-600">8 Zones</div>
                    <p className="text-sm text-gray-600 mt-1">Automatic conversion</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features Implemented</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Schedule Management System with Month/Week/Day calendar views</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Stream Planning with recurring events and conflict detection</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Viewer features: RSVP, reminders, calendar export</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Notification Strategy with 5 types across 3 channels</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Creator tools: bulk scheduling, templates, guest coordination</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Viewer tools: personalized calendar, smart notifications</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Creator Consistency</span>
                        </div>
                        <p className="text-sm text-blue-600">
                          Scheduling tools help creators maintain regular streaming habits and build reliable audiences
                        </p>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Viewer Planning</span>
                        </div>
                        <p className="text-sm text-green-600">
                          RSVP system and calendar integration help viewers plan their time and never miss streams
                        </p>
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">Global Accessibility</span>
                        </div>
                        <p className="text-sm text-purple-600">
                          Timezone conversion ensures diaspora communities worldwide can participate
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <StreamCalendar
              data={mockStreamCalendarData}
              onEventCreate={handleEventCreate}
              onEventUpdate={handleEventUpdate}
              onEventDelete={handleEventDelete}
              onRSVP={handleRSVP}
              variant="creator"
            />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationSystem
              notifications={mockNotifications}
              preferences={mockNotificationPreferences}
              onSendNotification={handleSendNotification}
              onUpdatePreferences={handleUpdatePreferences}
              onToggleNotificationType={handleToggleNotificationType}
              onToggleChannel={handleToggleChannel}
              variant="creator"
            />
          </TabsContent>

          <TabsContent value="timezone" className="mt-6">
            <TimezoneConverter
              events={mockTimezoneEvents}
              defaultTimezone={userTimezone}
              onTimezoneChange={setUserTimezone}
              variant="full"
            />
          </TabsContent>

          <TabsContent value="tools" className="mt-6">
            <CreatorSchedulingTools
              onCreateTemplate={handleCreateTemplate}
              onUpdateTemplate={handleUpdateTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onBulkSchedule={handleBulkSchedule}
              onConflictCheck={handleConflictCheck}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{phaseStats.calendarViews}</div>
          <p className="text-gray-600 mt-1">Calendar Views</p>
          <div className="text-sm text-blue-600 mt-2">Month, Week, Day</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{phaseStats.notificationTypes}</div>
          <p className="text-gray-600 mt-1">Notification Types</p>
          <div className="text-sm text-green-600 mt-2">Strategic timing</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{phaseStats.timezoneSupport}</div>
          <p className="text-gray-600 mt-1">Timezone Support</p>
          <div className="text-sm text-purple-600 mt-2">Global diaspora</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">85%</div>
          <p className="text-gray-600 mt-1">Effectiveness</p>
          <div className="text-sm text-orange-600 mt-2">Avg notification rate</div>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Schedule Management</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Calendar Grid with Month/Week/Day views and smart filtering</li>
              <li>• Stream Planning with recurring events and automated scheduling</li>
              <li>• Conflict Detection to prevent overlaps and optimize timing</li>
              <li>• RSVP System with viewer interest tracking and analytics</li>
              <li>• Calendar Export to personal calendars (.ics format)</li>
              <li>• Time Zone Conversion for global audience accessibility</li>
              <li>• Guest Coordination for collaborative streaming events</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Notification Strategy</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5 notification types with optimized timing strategies</li>
              <li>• Multi-channel delivery: Push, Email, In-app notifications</li>
              <li>• Smart scheduling based on viewer behavior patterns</li>
              <li>• Personalized preferences with quiet hours and frequency</li>
              <li>• Effectiveness tracking with open rates and engagement</li>
              <li>• Cultural sensitivity with Haitian time preferences</li>
              <li>• A/B testing for notification optimization</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Creator Tools</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Bulk Scheduling for efficient content planning</li>
              <li>• Template System with reusable stream configurations</li>
              <li>• Recurring Schedule automation for regular content</li>
              <li>• Analytics Dashboard for performance insights</li>
              <li>• Guest Coordination tools for collaborative streams</li>
              <li>• Content Planning with cultural event integration</li>
              <li>• Performance optimization recommendations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Viewer Experience</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Personalized Calendar with favorite creators</li>
              <li>• Smart Notifications based on viewing habits</li>
              <li>• Watch Later Queue for scheduled content</li>
              <li>• Cross-platform Reminders with calendar sync</li>
              <li>• Timezone-aware Scheduling for global viewers</li>
              <li>• RSVP Management with social features</li>
              <li>• Cultural Event Integration with Haitian holidays</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}