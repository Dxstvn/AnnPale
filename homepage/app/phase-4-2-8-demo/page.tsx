'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceMetrics } from '@/components/events/analytics/attendance-metrics';
import { RevenueAnalytics } from '@/components/events/analytics/revenue-analytics';
import { EngagementData } from '@/components/events/analytics/engagement-data';
import { AudienceInsights } from '@/components/events/analytics/audience-insights';
import { QualityMetrics } from '@/components/events/analytics/quality-metrics';
import { PostEventReports } from '@/components/events/analytics/post-event-reports';
import {
  Users,
  DollarSign,
  MessageSquare,
  Globe,
  Activity,
  FileText,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Download,
  Eye,
  Calendar,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function Phase428Demo() {
  const [activeTab, setActiveTab] = useState('attendance');

  // Demo event data
  const eventData = {
    id: 'demo-event-428',
    title: 'Haitian Music & Culture Festival 2024',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  };

  // Phase statistics
  const phaseStats = {
    components: 6,
    metricsTracked: 50,
    reportTypes: 5,
    dataPoints: 200
  };

  // Sample attendance data
  const attendanceData = {
    registered: 650,
    attended: 487,
    noShows: 163,
    dropOffs: 45,
    avgDuration: 72,
    peakConcurrent: 423,
    showUpRate: 75,
    completionRate: 82
  };

  // Sample timeline data
  const timelineData = [
    { time: '7:00 PM', viewers: 120, joiners: 120, leavers: 0 },
    { time: '7:15 PM', viewers: 285, joiners: 165, leavers: 0 },
    { time: '7:30 PM', viewers: 423, joiners: 138, leavers: 0 },
    { time: '7:45 PM', viewers: 410, joiners: 42, leavers: 55 },
    { time: '8:00 PM', viewers: 395, joiners: 25, leavers: 40 },
    { time: '8:15 PM', viewers: 380, joiners: 15, leavers: 30 },
    { time: '8:30 PM', viewers: 320, joiners: 10, leavers: 70 },
    { time: '8:45 PM', viewers: 180, joiners: 5, leavers: 145 }
  ];

  // Sample revenue data
  const revenueData = {
    totalRevenue: 24350,
    netRevenue: 19480,
    ticketsSold: 487,
    avgTicketPrice: 50,
    refunds: 750,
    refundRate: 3.1,
    platformFees: 2435,
    paymentFees: 1685
  };

  const tierBreakdown = [
    { tier: 'General', tickets: 250, revenue: 7500, percentage: 31, avgPrice: 30 },
    { tier: 'VIP', tickets: 180, revenue: 10800, percentage: 44, avgPrice: 60 },
    { tier: 'Platinum', tickets: 57, revenue: 6050, percentage: 25, avgPrice: 106 }
  ];

  const promoImpact = [
    { code: 'EARLY20', uses: 125, discount: 20, lostRevenue: 1250, conversions: 125 },
    { code: 'FRIEND10', uses: 45, discount: 10, lostRevenue: 225, conversions: 45 },
    { code: 'VIP15', uses: 30, discount: 15, lostRevenue: 270, conversions: 30 }
  ];

  const salesTimeline = [
    { date: 'Week 4', sales: 45, revenue: 2250, cumulative: 2250 },
    { date: 'Week 3', sales: 125, revenue: 6250, cumulative: 8500 },
    { date: 'Week 2', sales: 180, revenue: 9000, cumulative: 17500 },
    { date: 'Week 1', sales: 100, revenue: 5000, cumulative: 22500 },
    { date: 'Event Day', sales: 37, revenue: 1850, cumulative: 24350 }
  ];

  // Sample engagement metrics
  const engagementMetrics = {
    chatMessages: 1234,
    uniqueChatters: 156,
    qaSubmissions: 45,
    qaAnswered: 38,
    pollResponses: 289,
    pollParticipation: 68,
    reactions: 567,
    networkConnections: 42,
    shares: 28,
    virtualGifts: 23
  };

  const engagementTimeline = [
    { time: '7:00 PM', messages: 45, reactions: 12, questions: 5, polls: 0 },
    { time: '7:15 PM', messages: 125, reactions: 45, questions: 12, polls: 89 },
    { time: '7:30 PM', messages: 234, reactions: 89, questions: 18, polls: 145 },
    { time: '7:45 PM', messages: 189, reactions: 123, questions: 8, polls: 55 },
    { time: '8:00 PM', messages: 267, reactions: 156, questions: 2, polls: 0 },
    { time: '8:15 PM', messages: 178, reactions: 89, questions: 0, polls: 0 },
    { time: '8:30 PM', messages: 145, reactions: 45, questions: 0, polls: 0 },
    { time: '8:45 PM', messages: 51, reactions: 8, questions: 0, polls: 0 }
  ];

  const interactionTypes = [
    { type: 'Chat Messages', count: 1234, percentage: 45, trend: 'up' as const },
    { type: 'Reactions', count: 567, percentage: 21, trend: 'up' as const },
    { type: 'Q&A', count: 45, percentage: 2, trend: 'stable' as const },
    { type: 'Polls', count: 289, percentage: 11, trend: 'up' as const },
    { type: 'Networking', count: 42, percentage: 2, trend: 'down' as const },
    { type: 'Other', count: 523, percentage: 19, trend: 'stable' as const }
  ];

  // Sample audience data
  const demographics = {
    ageGroups: [
      { range: '18-24', count: 89, percentage: 18 },
      { range: '25-34', count: 178, percentage: 37 },
      { range: '35-44', count: 134, percentage: 28 },
      { range: '45-54', count: 56, percentage: 11 },
      { range: '55+', count: 30, percentage: 6 }
    ],
    gender: [
      { type: 'Female', count: 268, percentage: 55 },
      { type: 'Male', count: 195, percentage: 40 },
      { type: 'Other', count: 24, percentage: 5 }
    ],
    interests: [
      { category: 'Music', count: 423 },
      { category: 'Culture', count: 367 },
      { category: 'Entertainment', count: 289 },
      { category: 'Business', count: 178 },
      { category: 'Technology', count: 134 }
    ]
  };

  const geographic = {
    countries: [
      { name: 'United States', count: 289, percentage: 59 },
      { name: 'Haiti', count: 89, percentage: 18 },
      { name: 'Canada', count: 56, percentage: 12 },
      { name: 'France', count: 34, percentage: 7 },
      { name: 'Other', count: 19, percentage: 4 }
    ],
    cities: [
      { name: 'Miami', count: 89 },
      { name: 'New York', count: 67 },
      { name: 'Port-au-Prince', count: 45 },
      { name: 'Montreal', count: 34 },
      { name: 'Boston', count: 28 }
    ],
    timezones: [
      { zone: 'EST', count: 234 },
      { zone: 'CST', count: 123 },
      { zone: 'PST', count: 89 },
      { zone: 'GMT', count: 41 }
    ]
  };

  const deviceStats = {
    types: [
      { device: 'Mobile', count: 268, percentage: 55 },
      { device: 'Desktop', count: 171, percentage: 35 },
      { device: 'Tablet', count: 48, percentage: 10 }
    ],
    browsers: [
      { browser: 'Chrome', count: 234 },
      { browser: 'Safari', count: 156 },
      { browser: 'Firefox', count: 67 },
      { browser: 'Edge', count: 30 }
    ],
    os: [
      { system: 'iOS', count: 189 },
      { system: 'Windows', count: 145 },
      { system: 'Android', count: 89 },
      { system: 'macOS', count: 64 }
    ]
  };

  const referralSources = [
    { source: 'Direct', count: 156, percentage: 32 },
    { source: 'Social Media', count: 134, percentage: 28 },
    { source: 'Email', count: 89, percentage: 18 },
    { source: 'Search', count: 67, percentage: 14 },
    { source: 'Referral', count: 41, percentage: 8 }
  ];

  // Sample quality metrics
  const streamQuality = {
    avgBitrate: 4500,
    avgResolution: '1080p',
    bufferingEvents: 12,
    avgLatency: 45,
    uptime: 99.5,
    qualityScore: 92
  };

  const technicalIssues = {
    total: 8,
    audioIssues: 3,
    videoIssues: 2,
    connectionDrops: 3,
    resolved: 7,
    avgResolutionTime: 12
  };

  const supportTickets = {
    total: 15,
    resolved: 13,
    pending: 2,
    categories: [
      { category: 'Access Issues', count: 6 },
      { category: 'Technical Support', count: 5 },
      { category: 'Payment Questions', count: 3 },
      { category: 'Other', count: 1 }
    ],
    avgResponseTime: 8
  };

  const satisfaction = {
    npsScore: 72,
    satisfactionScore: 88,
    ratings: [
      { stars: 5, count: 234 },
      { stars: 4, count: 156 },
      { stars: 3, count: 67 },
      { stars: 2, count: 23 },
      { stars: 1, count: 7 }
    ],
    feedback: [
      { type: 'positive' as const, count: 367 },
      { type: 'neutral' as const, count: 89 },
      { type: 'negative' as const, count: 31 }
    ]
  };

  const qualityTimeline = [
    { time: '7:00 PM', quality: 95, issues: 0 },
    { time: '7:15 PM', quality: 92, issues: 1 },
    { time: '7:30 PM', quality: 88, issues: 2 },
    { time: '7:45 PM', quality: 91, issues: 1 },
    { time: '8:00 PM', quality: 93, issues: 0 },
    { time: '8:15 PM', quality: 94, issues: 0 },
    { time: '8:30 PM', quality: 95, issues: 0 },
    { time: '8:45 PM', quality: 96, issues: 0 }
  ];

  // Analytics summary metrics
  const analyticsSummary = [
    { metric: 'Show-up Rate', value: '75%', trend: '+5%', status: 'good' },
    { metric: 'Net Revenue', value: '$19.5K', trend: '+23%', status: 'excellent' },
    { metric: 'Engagement Score', value: '82%', trend: '+12%', status: 'excellent' },
    { metric: 'NPS Score', value: '72', trend: '+15', status: 'excellent' },
    { metric: 'Stream Quality', value: '92%', trend: '+3%', status: 'good' }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.2.8: Event Analytics & Reporting
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Comprehensive analytics dashboard with attendance metrics, revenue analysis, 
          engagement tracking, audience insights, quality monitoring, and automated reporting
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Attendance Tracking
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Revenue Analytics
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Engagement Metrics
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Audience Insights
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            Quality Monitoring
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Reports
          </span>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">📊 Analytics Dashboard Ready</h2>
        <p className="mb-6 text-lg opacity-90">
          Complete event analytics platform with real-time metrics, comprehensive insights, 
          quality monitoring, and automated post-event reporting for data-driven optimization
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/events/analytics">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Analytics
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/events/reports">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <FileText className="w-5 h-5 mr-2" />
              Generate Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {analyticsSummary.map((item) => (
              <div key={item.metric} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">{item.metric}</p>
                <p className="text-2xl font-bold">{item.value}</p>
                <Badge variant={
                  item.status === 'excellent' ? 'success' :
                  item.status === 'good' ? 'default' :
                  'secondary'
                } className="mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {item.trend}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="attendance">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="engagement">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Engagement</span>
          </TabsTrigger>
          <TabsTrigger value="audience">
            <Globe className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Audience</span>
          </TabsTrigger>
          <TabsTrigger value="quality">
            <Activity className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Quality</span>
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-6">
          <AttendanceMetrics
            eventId={eventData.id}
            eventTitle={eventData.title}
            attendanceData={attendanceData}
            timelineData={timelineData}
            onExportData={() => console.log('Export attendance data')}
            onViewDetails={(metric) => console.log('View details:', metric)}
          />
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <RevenueAnalytics
            eventId={eventData.id}
            eventTitle={eventData.title}
            revenueData={revenueData}
            tierBreakdown={tierBreakdown}
            promoImpact={promoImpact}
            salesTimeline={salesTimeline}
            onExportReport={() => console.log('Export revenue report')}
            onViewDetails={(section) => console.log('View details:', section)}
          />
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <EngagementData
            eventId={eventData.id}
            eventTitle={eventData.title}
            metrics={engagementMetrics}
            timeline={engagementTimeline}
            interactionTypes={interactionTypes}
            topParticipants={[
              { name: 'Marie Joseph', interactions: 89, tier: 'VIP' },
              { name: 'Jean Pierre', interactions: 67, tier: 'Platinum' },
              { name: 'Sophie Laurent', interactions: 56, tier: 'General' },
              { name: 'Marcus Thompson', interactions: 45, tier: 'VIP' },
              { name: 'Patricia Martin', interactions: 34, tier: 'Platinum' }
            ]}
            onExportData={() => console.log('Export engagement data')}
            onViewDetails={(metric) => console.log('View details:', metric)}
          />
        </TabsContent>

        <TabsContent value="audience" className="mt-6">
          <AudienceInsights
            eventId={eventData.id}
            eventTitle={eventData.title}
            totalAttendees={487}
            newVsReturning={{ new: 312, returning: 175 }}
            referralSources={referralSources}
            demographics={demographics}
            geographic={geographic}
            deviceStats={deviceStats}
            onExportData={() => console.log('Export audience data')}
            onViewDetails={(section) => console.log('View details:', section)}
          />
        </TabsContent>

        <TabsContent value="quality" className="mt-6">
          <QualityMetrics
            eventId={eventData.id}
            eventTitle={eventData.title}
            streamQuality={streamQuality}
            technicalIssues={technicalIssues}
            supportTickets={supportTickets}
            satisfaction={satisfaction}
            qualityTimeline={qualityTimeline}
            onExportReport={() => console.log('Export quality report')}
            onViewDetails={(section) => console.log('View details:', section)}
          />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <PostEventReports
            eventId={eventData.id}
            eventTitle={eventData.title}
            eventDate={eventData.date}
            onGenerateReport={(type) => console.log('Generate report:', type)}
            onDownloadReport={(type) => console.log('Download report:', type)}
            onScheduleReport={(type, schedule) => console.log('Schedule report:', type, schedule)}
            onShareReport={(type, recipients) => console.log('Share report:', type, recipients)}
          />
        </TabsContent>
      </Tabs>

      {/* Report Types */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Executive Summary</h3>
              <p className="text-sm text-gray-600 mb-3">
                High-level overview with key metrics and insights
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
            <div className="text-center p-4 border-2 border-purple-600 rounded-lg bg-purple-50">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-sm text-gray-600 mb-3">
                Complete data analysis with charts and tables
              </p>
              <Button size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Excel
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Star className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Feedback Summary</h3>
              <p className="text-sm text-gray-600 mb-3">
                Survey results and improvement suggestions
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{phaseStats.components}</div>
          <p className="text-gray-600 mt-1">Components</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{phaseStats.metricsTracked}</div>
          <p className="text-gray-600 mt-1">Metrics Tracked</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{phaseStats.reportTypes}</div>
          <p className="text-gray-600 mt-1">Report Types</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">{phaseStats.dataPoints}</div>
          <p className="text-gray-600 mt-1">Data Points</p>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🚀 Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Performance Metrics</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Registration to attendance conversion</li>
              <li>• Real-time viewer tracking</li>
              <li>• Drop-off analysis and timeline</li>
              <li>• Session duration analytics</li>
              <li>• Retention and completion rates</li>
              <li>• Peak concurrent viewers</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Financial Analysis</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Revenue breakdown by tier</li>
              <li>• Promotional code impact</li>
              <li>• Fee analysis and margins</li>
              <li>• Sales timeline tracking</li>
              <li>• Refund rate monitoring</li>
              <li>• ROI calculations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Engagement Tracking</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Chat and Q&A participation</li>
              <li>• Poll response analysis</li>
              <li>• Reaction and gift tracking</li>
              <li>• Network connections made</li>
              <li>• Social sharing metrics</li>
              <li>• Top participant identification</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Audience Intelligence</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Demographics breakdown</li>
              <li>• Geographic distribution</li>
              <li>• Device and platform stats</li>
              <li>• New vs returning analysis</li>
              <li>• Traffic source tracking</li>
              <li>• Interest categorization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}