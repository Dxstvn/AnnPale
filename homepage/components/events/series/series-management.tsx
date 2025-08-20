'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  Eye,
  Download,
  Share2,
  BarChart3,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Star,
  MessageSquare,
  Settings,
  Plus
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';

interface SeriesEvent {
  id: string;
  title: string;
  date: Date;
  duration: number;
  status: 'draft' | 'scheduled' | 'live' | 'completed' | 'cancelled';
  attendees: number;
  maxCapacity: number;
  revenue: number;
  rating: number;
  completionRate: number;
}

interface SeriesMetrics {
  totalEvents: number;
  completedEvents: number;
  totalRevenue: number;
  totalAttendees: number;
  avgRating: number;
  avgAttendance: number;
  retentionRate: number;
  completionRate: number;
}

interface SeriesManagementProps {
  seriesId?: string;
  seriesTitle?: string;
  onEditSeries?: () => void;
  onDuplicateSeries?: () => void;
  onArchiveSeries?: () => void;
}

export function SeriesManagement({
  seriesId = "series-001",
  seriesTitle = "Haitian Culture & Heritage Series",
  onEditSeries,
  onDuplicateSeries,
  onArchiveSeries
}: SeriesManagementProps) {
  const [activeTab, setActiveTab] = React.useState('overview');

  // Sample series data
  const seriesEvents: SeriesEvent[] = [
    {
      id: 'event-1',
      title: 'Historical Foundations',
      date: new Date('2024-09-01'),
      duration: 90,
      status: 'completed',
      attendees: 487,
      maxCapacity: 500,
      revenue: 24350,
      rating: 4.8,
      completionRate: 92
    },
    {
      id: 'event-2',
      title: 'Art & Music Traditions',
      date: new Date('2024-09-08'),
      duration: 75,
      status: 'completed',
      attendees: 456,
      maxCapacity: 500,
      revenue: 22800,
      rating: 4.9,
      completionRate: 88
    },
    {
      id: 'event-3',
      title: 'Modern Haiti & Diaspora',
      date: new Date('2024-09-15'),
      duration: 90,
      status: 'live',
      attendees: 423,
      maxCapacity: 500,
      revenue: 21150,
      rating: 4.7,
      completionRate: 85
    },
    {
      id: 'event-4',
      title: 'Community Q&A',
      date: new Date('2024-09-22'),
      duration: 60,
      status: 'scheduled',
      attendees: 0,
      maxCapacity: 500,
      revenue: 0,
      rating: 0,
      completionRate: 0
    }
  ];

  // Calculate metrics
  const metrics: SeriesMetrics = React.useMemo(() => {
    const completedEvents = seriesEvents.filter(e => e.status === 'completed');
    const totalRevenue = seriesEvents.reduce((sum, event) => sum + event.revenue, 0);
    const totalAttendees = seriesEvents.reduce((sum, event) => sum + event.attendees, 0);
    const avgRating = completedEvents.length > 0 
      ? completedEvents.reduce((sum, event) => sum + event.rating, 0) / completedEvents.length 
      : 0;
    const avgAttendance = completedEvents.length > 0 
      ? completedEvents.reduce((sum, event) => sum + (event.attendees / event.maxCapacity * 100), 0) / completedEvents.length 
      : 0;
    const avgCompletion = completedEvents.length > 0 
      ? completedEvents.reduce((sum, event) => sum + event.completionRate, 0) / completedEvents.length 
      : 0;

    return {
      totalEvents: seriesEvents.length,
      completedEvents: completedEvents.length,
      totalRevenue,
      totalAttendees,
      avgRating,
      avgAttendance,
      retentionRate: completedEvents.length > 1 ? 
        ((completedEvents[1].attendees / completedEvents[0].attendees) * 100) : 0,
      completionRate: avgCompletion
    };
  }, [seriesEvents]);

  // Performance trends
  const performanceData = seriesEvents.map((event, index) => ({
    event: `Event ${index + 1}`,
    attendance: (event.attendees / event.maxCapacity) * 100,
    revenue: event.revenue / 1000, // in thousands
    rating: event.rating * 20, // scale to 0-100
    completion: event.completionRate
  }));

  // Revenue breakdown
  const revenueData = [
    { category: 'Series Passes', amount: 45000, percentage: 65, color: '#9333EA' },
    { category: 'Individual Tickets', amount: 18000, percentage: 26, color: '#EC4899' },
    { category: 'VIP Upgrades', amount: 6000, percentage: 9, color: '#3B82F6' }
  ];

  // Attendance trends
  const attendanceTrends = [
    { week: 'Week 1', registered: 500, attended: 487, completed: 448 },
    { week: 'Week 2', registered: 480, attended: 456, completed: 401 },
    { week: 'Week 3', registered: 450, attended: 423, completed: 360 },
    { week: 'Week 4', registered: 430, attended: 0, completed: 0 }
  ];

  // Top performing content
  const contentPerformance = [
    { title: 'Art & Music Traditions', rating: 4.9, engagement: 95, feedback: 'Excellent' },
    { title: 'Historical Foundations', rating: 4.8, engagement: 92, feedback: 'Outstanding' },
    { title: 'Modern Haiti & Diaspora', rating: 4.7, engagement: 88, feedback: 'Very Good' }
  ];

  // Community engagement
  const communityMetrics = {
    totalMembers: 750,
    activeMembers: 567,
    newMembers: 123,
    posts: 234,
    discussions: 45,
    networkingConnections: 189
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'live': return 'text-blue-600 bg-blue-50';
      case 'scheduled': return 'text-purple-600 bg-purple-50';
      case 'draft': return 'text-gray-600 bg-gray-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'live': return Play;
      case 'scheduled': return Calendar;
      case 'draft': return Edit;
      case 'cancelled': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Series Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{seriesTitle}</h1>
              <p className="text-gray-600">Series ID: {seriesId}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEditSeries}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={onDuplicateSeries}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+23% vs target</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Attendees</p>
                <p className="text-2xl font-bold">{metrics.totalAttendees.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">{metrics.avgAttendance.toFixed(0)}% avg attendance</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{metrics.avgRating.toFixed(1)}</p>
                <p className="text-xs text-yellow-600 mt-1">★★★★★</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{metrics.completionRate.toFixed(0)}%</p>
                <p className="text-xs text-purple-600 mt-1">Above average</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Series Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Series Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Events Completed</span>
                    <span className="text-sm">{metrics.completedEvents}/{metrics.totalEvents}</span>
                  </div>
                  <Progress value={(metrics.completedEvents / metrics.totalEvents) * 100} />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold">{metrics.retentionRate.toFixed(0)}%</p>
                    <p className="text-xs text-gray-600">Retention Rate</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold">${(metrics.totalRevenue / metrics.totalEvents).toFixed(0)}</p>
                    <p className="text-xs text-gray-600">Revenue per Event</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold">{(metrics.totalAttendees / metrics.completedEvents).toFixed(0)}</p>
                    <p className="text-xs text-gray-600">Avg Attendees</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold">{communityMetrics.activeMembers}</p>
                    <p className="text-xs text-gray-600">Active Members</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="event" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attendance" stroke="#9333EA" strokeWidth={2} name="Attendance %" />
                  <Line type="monotone" dataKey="rating" stroke="#EC4899" strokeWidth={2} name="Rating (scaled)" />
                  <Line type="monotone" dataKey="completion" stroke="#10B981" strokeWidth={2} name="Completion %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6 space-y-6">
          {/* Events List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Event Management</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {seriesEvents.map((event) => {
                  const StatusIcon = getStatusIcon(event.status);
                  return (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getStatusColor(event.status))}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-600">
                            {event.date.toLocaleDateString()} • {event.duration} min
                          </p>
                          {event.status === 'completed' && (
                            <div className="flex items-center gap-4 mt-1 text-xs">
                              <span>{event.attendees}/{event.maxCapacity} attended</span>
                              <span>${event.revenue.toLocaleString()} revenue</span>
                              <span>★ {event.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          event.status === 'completed' ? 'success' :
                          event.status === 'live' ? 'default' :
                          event.status === 'scheduled' ? 'secondary' :
                          'outline'
                        } className="capitalize">
                          {event.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6 space-y-6">
          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount"
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {revenueData.map((item) => (
                    <div key={item.category} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.category}</span>
                      </div>
                      <span className="font-medium">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={attendanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="registered" fill="#E5E7EB" name="Registered" />
                    <Bar dataKey="attended" fill="#9333EA" name="Attended" />
                    <Bar dataKey="completed" fill="#10B981" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Content Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contentPerformance.map((content, index) => (
                  <div key={content.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{content.title}</h3>
                      <p className="text-sm text-gray-600">Engagement: {content.engagement}%</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{content.rating}</span>
                      </div>
                      <Badge variant="success" className="mt-1">
                        {content.feedback}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="mt-6 space-y-6">
          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{communityMetrics.totalMembers}</p>
                <p className="text-sm text-gray-600">Total Members</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{communityMetrics.posts}</p>
                <p className="text-sm text-gray-600">Community Posts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{communityMetrics.newMembers}</p>
                <p className="text-sm text-gray-600">New This Month</p>
              </CardContent>
            </Card>
          </div>

          {/* Community Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Community Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Active Members</span>
                    <span className="text-sm font-medium">
                      {communityMetrics.activeMembers}/{communityMetrics.totalMembers}
                    </span>
                  </div>
                  <Progress value={(communityMetrics.activeMembers / communityMetrics.totalMembers) * 100} />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold">{communityMetrics.discussions}</p>
                    <p className="text-xs text-gray-600">Active Discussions</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold">{communityMetrics.networkingConnections}</p>
                    <p className="text-xs text-gray-600">Connections Made</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold">92%</p>
                    <p className="text-xs text-gray-600">Satisfaction Score</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onArchiveSeries}>
          <Trash2 className="h-4 w-4 mr-2" />
          Archive Series
        </Button>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Analytics Report
          </Button>
        </div>
      </div>
    </div>
  );
}