'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Users,
  Video,
  PartyPopper,
  Star,
  Trophy,
  Gift,
  Sparkles,
  Clock,
  MapPin,
  Globe,
  Music,
  Gamepad2,
  BookOpen,
  Coffee,
  Flag,
  Heart,
  MessageSquare,
  Mic,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Info,
  Play,
  ChevronRight
} from 'lucide-react';
import { EventsLayout } from '@/components/community/events/events-layout';

export default function Phase438Demo() {
  const [activeDemo, setActiveDemo] = React.useState('overview');

  const demoSections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Community Events & Meetups platform introduction',
      icon: PartyPopper
    },
    {
      id: 'calendar',
      title: 'Event Calendar',
      description: 'Browse and discover events',
      icon: Calendar
    },
    {
      id: 'types',
      title: 'Event Types',
      description: 'Categories and event formats',
      icon: Sparkles
    },
    {
      id: 'participation',
      title: 'Participation',
      description: 'Track engagement and rewards',
      icon: Trophy
    },
    {
      id: 'live',
      title: 'Virtual Viewer',
      description: 'Join live virtual events',
      icon: Video
    }
  ];

  const eventCategories = [
    {
      name: 'Regular Events',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-700',
      types: ['Weekly meetups', 'Monthly townhalls', 'Game nights', 'Study groups'],
      frequency: 'Recurring',
      avgAttendance: 50
    },
    {
      name: 'Special Events',
      icon: Star,
      color: 'bg-purple-100 text-purple-700',
      types: ['Launch parties', 'Competitions', 'Fundraisers', 'Awards shows'],
      frequency: 'Occasional',
      avgAttendance: 300
    },
    {
      name: 'Member-Led',
      icon: Users,
      color: 'bg-green-100 text-green-700',
      types: ['Interest groups', 'Skill workshops', 'Book clubs', 'Support groups'],
      frequency: 'Varies',
      avgAttendance: 25
    },
    {
      name: 'Cultural Events',
      icon: Globe,
      color: 'bg-orange-100 text-orange-700',
      types: ['Haitian holidays', 'Music festivals', 'Food events', 'Heritage months'],
      frequency: 'Seasonal',
      avgAttendance: 400
    }
  ];

  const participationIncentives = [
    {
      incentive: 'Attendance Points',
      type: 'Gamification',
      impact: 'High',
      cost: 'Low',
      roi: 'Excellent',
      description: 'Earn points for every event attended'
    },
    {
      incentive: 'Exclusive Content',
      type: 'Access',
      impact: 'Medium',
      cost: 'Medium',
      roi: 'Good',
      description: 'Access to recordings and special content'
    },
    {
      incentive: 'Raffle Entries',
      type: 'Chance',
      impact: 'High',
      cost: 'Low',
      roi: 'Excellent',
      description: 'Win prizes through participation'
    },
    {
      incentive: 'Networking',
      type: 'Social',
      impact: 'Medium',
      cost: 'Low',
      roi: 'Good',
      description: 'Connect with community members'
    },
    {
      incentive: 'Learning',
      type: 'Educational',
      impact: 'High',
      cost: 'Medium',
      roi: 'Excellent',
      description: 'Gain knowledge and skills'
    }
  ];

  const platformStats = [
    { label: 'Total Events', value: '847', color: 'text-purple-600', description: 'Events hosted' },
    { label: 'Active Members', value: '12.3K', color: 'text-blue-600', description: 'Participating users' },
    { label: 'Avg Attendance', value: '65', color: 'text-green-600', description: 'Per event' },
    { label: 'Satisfaction', value: '4.8★', color: 'text-yellow-600', description: 'Event rating' },
    { label: 'Points Awarded', value: '1.2M', color: 'text-orange-600', description: 'Total points' },
    { label: 'Live Events', value: '3-5/day', color: 'text-red-600', description: 'Daily average' }
  ];

  const features = [
    {
      title: 'Event Calendar',
      description: 'Comprehensive calendar with multiple views',
      icon: Calendar,
      highlights: [
        'Monthly, weekly, and list views',
        'Filter by event type and category',
        'Quick event preview',
        'Date-based navigation',
        'Upcoming events sidebar'
      ]
    },
    {
      title: 'Event Types System',
      description: 'Organized categories for all event types',
      icon: Sparkles,
      highlights: [
        '16+ event type definitions',
        'Category-based organization',
        'Frequency and attendance stats',
        'Popular times tracking',
        'Requirements and benefits'
      ]
    },
    {
      title: 'RSVP & Registration',
      description: 'Seamless event registration process',
      icon: CheckCircle,
      highlights: [
        'Quick RSVP forms',
        'Guest management',
        'Waitlist functionality',
        'QR code tickets',
        'Calendar integration'
      ]
    },
    {
      title: 'Virtual Event Viewer',
      description: 'Interactive live event platform',
      icon: Video,
      highlights: [
        'HD video streaming',
        'Live chat and reactions',
        'Participant management',
        'Screen sharing',
        'Polls and Q&A'
      ]
    },
    {
      title: 'Participation Tracking',
      description: 'Comprehensive engagement system',
      icon: Trophy,
      highlights: [
        'Attendance tracking',
        'Points and rewards',
        'Level progression',
        'Streak bonuses',
        'Achievement badges'
      ]
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Events & Meetups
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Phase 4.3.8: Virtual community gatherings that strengthen bonds through 
              regular events and shared experiences.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm px-4 py-2">
                Rasanbleman Kominoté
              </Badge>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-sm px-4 py-2">
                Virtual Events Platform
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platformStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event Categories */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Event Category Structure</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {eventCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.name} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Frequency:</span>
                      <Badge variant="outline">{category.frequency}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Avg Attendance:</span>
                      <span className="font-medium">{category.avgAttendance}</span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Event Types:</div>
                      <div className="flex flex-wrap gap-1">
                        {category.types.map((type, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Participation Incentives */}
      <Card>
        <CardHeader>
          <CardTitle>Event Participation Incentives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Incentive</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Impact</th>
                  <th className="text-left py-2">Cost</th>
                  <th className="text-left py-2">ROI</th>
                </tr>
              </thead>
              <tbody>
                {participationIncentives.map((item) => (
                  <tr key={item.incentive} className="border-b">
                    <td className="py-2">
                      <div>
                        <div className="font-medium">{item.incentive}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </td>
                    <td className="py-2">
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </td>
                    <td className="py-2">
                      <Badge 
                        className={`text-xs ${
                          item.impact === 'High' ? 'bg-green-100 text-green-700' :
                          item.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.impact}
                      </Badge>
                    </td>
                    <td className="py-2">
                      <span className="text-sm">{item.cost}</span>
                    </td>
                    <td className="py-2">
                      <Badge className="text-xs bg-purple-100 text-purple-700">
                        {item.roi}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Interactive Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Explore the full community events platform with calendar, event types, 
            participation tracking, and virtual event viewer.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoSections.slice(1).map((section) => (
              <Button
                key={section.id}
                variant="outline"
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => setActiveDemo(section.id)}
              >
                <section.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{section.title}</div>
                  <div className="text-xs text-gray-500">{section.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Event Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: MessageSquare, name: 'Kreyòl Konvèsasyon', type: 'Language', time: 'Weekly', color: 'bg-blue-100 text-blue-700' },
              { icon: Mic, name: 'Creator Townhall', type: 'Official', time: 'Monthly', color: 'bg-purple-100 text-purple-700' },
              { icon: Gamepad2, name: 'Dominoes Tournament', type: 'Games', time: 'Weekly', color: 'bg-green-100 text-green-700' },
              { icon: Flag, name: 'Independence Day', type: 'Cultural', time: 'Annual', color: 'bg-yellow-100 text-yellow-700' },
              { icon: BookOpen, name: 'Book Club', type: 'Learning', time: 'Monthly', color: 'bg-pink-100 text-pink-700' },
              { icon: Music, name: 'Rara Festival', type: 'Cultural', time: 'Seasonal', color: 'bg-orange-100 text-orange-700' }
            ].map((event, index) => {
              const Icon = event.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${event.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{event.name}</div>
                    <div className="text-xs text-gray-500">{event.type} • {event.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Success Metrics */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <TrendingUp className="h-5 w-5" />
            Platform Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">78%</div>
              <div className="text-sm text-gray-600">Member Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">92%</div>
              <div className="text-sm text-gray-600">Event Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">3.5x</div>
              <div className="text-sm text-gray-600">Community Growth</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">45min</div>
              <div className="text-sm text-gray-600">Avg Session Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Complete */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Sparkles className="h-5 w-5" />
            Implementation Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Completed Components:</h4>
              <div className="space-y-2">
                {[
                  'Event Calendar with multiple views',
                  'Event Types system (16+ types)',
                  'Participation tracking & rewards',
                  'RSVP and registration flow',
                  'Virtual event viewer platform',
                  'Events layout and navigation'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Key Features:</h4>
              <div className="space-y-2">
                {[
                  'Regular, special, member-led & cultural events',
                  'Virtual event streaming capabilities',
                  'Comprehensive participation incentives',
                  'Real-time chat and interactions',
                  'Points and badge rewards system',
                  'Mobile-responsive design'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDemo = () => (
    <div className="space-y-4">
      {/* Demo Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Live Demo: {demoSections.find(s => s.id === activeDemo)?.title}</h2>
              <p className="text-gray-600">{demoSections.find(s => s.id === activeDemo)?.description}</p>
            </div>
            <Button variant="outline" onClick={() => setActiveDemo('overview')}>
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Overview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Content */}
      <EventsLayout
        initialView={activeDemo === 'overview' ? 'dashboard' : activeDemo}
        userId="demo-user"
        isAuthenticated={true}
        onNavigate={(view) => {
          // Map views to demo sections
          const viewMap: Record<string, string> = {
            'dashboard': 'overview',
            'calendar': 'calendar',
            'types': 'types',
            'participation': 'participation',
            'live': 'live'
          };
          if (viewMap[view]) {
            setActiveDemo(viewMap[view]);
          }
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Button
              variant={activeDemo === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveDemo('overview')}
            >
              Overview
            </Button>
            {demoSections.slice(1).map((section) => (
              <Button
                key={section.id}
                variant={activeDemo === section.id ? 'default' : 'outline'}
                onClick={() => setActiveDemo(section.id)}
              >
                <section.icon className="h-4 w-4 mr-2" />
                {section.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeDemo === 'overview' ? renderOverview() : renderDemo()}
      </div>
    </div>
  );
}