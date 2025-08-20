'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Users,
  Video,
  MessageSquare,
  Mic,
  Gamepad2,
  BookOpen,
  Trophy,
  PartyPopper,
  Music,
  Flag,
  Utensils,
  Heart,
  Coffee,
  Gift,
  Star,
  Sparkles,
  Globe,
  MapPin,
  Zap,
  Target,
  Award,
  ChevronRight,
  Info,
  TrendingUp,
  BarChart3,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EventType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: 'regular' | 'special' | 'member-led' | 'cultural';
  frequency?: string;
  avgAttendance?: number;
  totalEvents?: number;
  popularTimes?: string[];
  benefits: string[];
  requirements?: string[];
  examples: string[];
}

interface EventStatistics {
  totalEvents: number;
  totalAttendees: number;
  avgRating: number;
  topHosts: Array<{
    name: string;
    events: number;
    rating: number;
  }>;
  trending: string[];
}

interface EventTypesProps {
  selectedType?: string;
  onTypeSelect?: (typeId: string) => void;
  onCreateEvent?: (typeId: string) => void;
  showStatistics?: boolean;
  showExamples?: boolean;
}

export function EventTypes({
  selectedType,
  onTypeSelect,
  onCreateEvent,
  showStatistics = true,
  showExamples = true
}: EventTypesProps) {
  const [expandedType, setExpandedType] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  // Event type definitions
  const eventTypes: EventType[] = [
    // Regular Events
    {
      id: 'weekly-meetup',
      name: 'Weekly Meetups',
      description: 'Regular community gatherings for connection and networking',
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
      category: 'regular',
      frequency: 'Every week',
      avgAttendance: 45,
      totalEvents: 156,
      popularTimes: ['Thursday 7PM', 'Saturday 3PM'],
      benefits: [
        'Build consistent connections',
        'Regular networking opportunities',
        'Predictable schedule',
        'Community building'
      ],
      examples: [
        'Kreyòl Conversation Club',
        'Creators Coffee Chat',
        'Tech Talks Thursday'
      ]
    },
    {
      id: 'monthly-townhall',
      name: 'Monthly Townhalls',
      description: 'Platform updates and community Q&A sessions',
      icon: Mic,
      color: 'bg-purple-100 text-purple-700',
      category: 'regular',
      frequency: 'Monthly',
      avgAttendance: 250,
      totalEvents: 24,
      popularTimes: ['Last Thursday 7PM'],
      benefits: [
        'Direct platform communication',
        'Community voice heard',
        'Transparency and updates',
        'Influence platform direction'
      ],
      requirements: [
        'Active member status',
        'Community guidelines agreement'
      ],
      examples: [
        'Platform Update Townhall',
        'Creator Success Stories',
        'Community Feedback Session'
      ]
    },
    {
      id: 'game-night',
      name: 'Game Nights',
      description: 'Fun virtual game sessions and tournaments',
      icon: Gamepad2,
      color: 'bg-green-100 text-green-700',
      category: 'regular',
      frequency: 'Twice weekly',
      avgAttendance: 75,
      totalEvents: 89,
      popularTimes: ['Friday 8PM', 'Sunday 4PM'],
      benefits: [
        'Casual social interaction',
        'Prize opportunities',
        'Stress relief',
        'Community bonding'
      ],
      examples: [
        'Dominoes Tournament',
        'Trivia Night',
        'Virtual Karaoke'
      ]
    },
    {
      id: 'study-group',
      name: 'Study Groups',
      description: 'Educational sessions and skill-sharing workshops',
      icon: BookOpen,
      color: 'bg-indigo-100 text-indigo-700',
      category: 'regular',
      frequency: 'Weekly',
      avgAttendance: 30,
      totalEvents: 67,
      popularTimes: ['Tuesday 6PM', 'Saturday 2PM'],
      benefits: [
        'Learn new skills',
        'Share knowledge',
        'Collaborative learning',
        'Professional development'
      ],
      examples: [
        'Language Exchange',
        'Content Creation Workshop',
        'Business Strategy Session'
      ]
    },

    // Special Events
    {
      id: 'launch-party',
      name: 'Launch Parties',
      description: 'Celebrations for new features and creator milestones',
      icon: PartyPopper,
      color: 'bg-pink-100 text-pink-700',
      category: 'special',
      avgAttendance: 500,
      totalEvents: 12,
      benefits: [
        'Exclusive first access',
        'Special rewards',
        'Meet platform team',
        'Celebration atmosphere'
      ],
      examples: [
        'New Feature Launch',
        'Creator Milestone Celebration',
        'Platform Anniversary'
      ]
    },
    {
      id: 'competition',
      name: 'Competitions',
      description: 'Contests and challenges with prizes',
      icon: Trophy,
      color: 'bg-yellow-100 text-yellow-700',
      category: 'special',
      avgAttendance: 300,
      totalEvents: 8,
      benefits: [
        'Win prizes',
        'Showcase talents',
        'Gain recognition',
        'Competitive fun'
      ],
      requirements: [
        'Registration required',
        'Competition rules agreement'
      ],
      examples: [
        'Creator of the Month',
        'Content Challenge',
        'Talent Showcase'
      ]
    },
    {
      id: 'fundraiser',
      name: 'Fundraisers',
      description: 'Charity events supporting Haitian causes',
      icon: Heart,
      color: 'bg-red-100 text-red-700',
      category: 'special',
      avgAttendance: 450,
      totalEvents: 6,
      benefits: [
        'Support good causes',
        'Community impact',
        'Tax deductible donations',
        'Social responsibility'
      ],
      examples: [
        'Haiti Relief Fund',
        'Education Initiative',
        'Healthcare Support'
      ]
    },
    {
      id: 'awards-show',
      name: 'Awards Shows',
      description: 'Annual recognition ceremonies',
      icon: Award,
      color: 'bg-orange-100 text-orange-700',
      category: 'special',
      avgAttendance: 800,
      totalEvents: 3,
      benefits: [
        'Industry recognition',
        'Networking opportunity',
        'Exclusive access',
        'Memorable experience'
      ],
      examples: [
        'Creator Awards',
        'Community Choice Awards',
        'Platform Excellence Awards'
      ]
    },

    // Member-Led Events
    {
      id: 'interest-group',
      name: 'Interest Groups',
      description: 'Member-organized groups around shared interests',
      icon: Users,
      color: 'bg-teal-100 text-teal-700',
      category: 'member-led',
      frequency: 'Varies',
      avgAttendance: 25,
      totalEvents: 134,
      benefits: [
        'Connect with like-minded people',
        'Deep dive into interests',
        'Small group intimacy',
        'Member leadership'
      ],
      examples: [
        'Photography Club',
        'Entrepreneur Network',
        'Fitness Group'
      ]
    },
    {
      id: 'skill-workshop',
      name: 'Skill Workshops',
      description: 'Members teaching their expertise',
      icon: Zap,
      color: 'bg-cyan-100 text-cyan-700',
      category: 'member-led',
      frequency: 'Weekly',
      avgAttendance: 40,
      totalEvents: 78,
      benefits: [
        'Learn from peers',
        'Hands-on training',
        'Skill development',
        'Community expertise'
      ],
      examples: [
        'Cooking Classes',
        'Dance Lessons',
        'Tech Tutorials'
      ]
    },
    {
      id: 'book-club',
      name: 'Book Clubs',
      description: 'Literary discussions and reading groups',
      icon: BookOpen,
      color: 'bg-emerald-100 text-emerald-700',
      category: 'member-led',
      frequency: 'Monthly',
      avgAttendance: 20,
      totalEvents: 45,
      benefits: [
        'Literary exploration',
        'Thoughtful discussion',
        'Cultural literacy',
        'Reading motivation'
      ],
      examples: [
        'Haitian Literature',
        'Business Books',
        'Fiction Fridays'
      ]
    },
    {
      id: 'support-group',
      name: 'Support Groups',
      description: 'Safe spaces for community support',
      icon: Heart,
      color: 'bg-rose-100 text-rose-700',
      category: 'member-led',
      frequency: 'Bi-weekly',
      avgAttendance: 15,
      totalEvents: 56,
      benefits: [
        'Emotional support',
        'Shared experiences',
        'Safe environment',
        'Community care'
      ],
      requirements: [
        'Confidentiality agreement',
        'Respectful participation'
      ],
      examples: [
        'New Creators Support',
        'Diaspora Connection',
        'Wellness Circle'
      ]
    },

    // Cultural Events
    {
      id: 'holiday-celebration',
      name: 'Haitian Holidays',
      description: 'Celebrating Haitian national and cultural holidays',
      icon: Flag,
      color: 'bg-blue-100 text-blue-700',
      category: 'cultural',
      avgAttendance: 600,
      totalEvents: 15,
      benefits: [
        'Cultural connection',
        'Heritage celebration',
        'Community unity',
        'Traditional activities'
      ],
      examples: [
        'Independence Day',
        'Flag Day',
        'Carnival Season'
      ]
    },
    {
      id: 'music-festival',
      name: 'Music Festivals',
      description: 'Virtual concerts and music celebrations',
      icon: Music,
      color: 'bg-purple-100 text-purple-700',
      category: 'cultural',
      avgAttendance: 450,
      totalEvents: 8,
      benefits: [
        'Live performances',
        'Artist discovery',
        'Cultural music',
        'Dance and celebration'
      ],
      examples: [
        'Konpa Festival',
        'Rara Celebration',
        'Jazz Night'
      ]
    },
    {
      id: 'food-event',
      name: 'Food Events',
      description: 'Culinary experiences and cooking demonstrations',
      icon: Utensils,
      color: 'bg-orange-100 text-orange-700',
      category: 'cultural',
      avgAttendance: 80,
      totalEvents: 24,
      benefits: [
        'Learn traditional recipes',
        'Cultural cuisine',
        'Cooking skills',
        'Food community'
      ],
      examples: [
        'Griot Masterclass',
        'Soup Joumou Tradition',
        'Street Food Tour'
      ]
    },
    {
      id: 'heritage-month',
      name: 'Heritage Months',
      description: 'Month-long cultural celebrations and education',
      icon: Globe,
      color: 'bg-green-100 text-green-700',
      category: 'cultural',
      avgAttendance: 350,
      totalEvents: 4,
      benefits: [
        'Cultural education',
        'Heritage pride',
        'Extended programming',
        'Community engagement'
      ],
      examples: [
        'Haitian Heritage Month',
        'Black History Month',
        'Creole Heritage Week'
      ]
    }
  ];

  // Event statistics
  const eventStatistics: EventStatistics = {
    totalEvents: 847,
    totalAttendees: 45620,
    avgRating: 4.7,
    topHosts: [
      { name: 'Marie Delacroix', events: 45, rating: 4.9 },
      { name: 'Jean Baptiste', events: 38, rating: 4.8 },
      { name: 'Sophia Laurent', events: 32, rating: 4.7 }
    ],
    trending: ['Game Nights', 'Language Exchange', 'Cooking Classes']
  };

  const getCategoryStats = (category: string) => {
    const categoryEvents = eventTypes.filter(t => t.category === category);
    const totalEvents = categoryEvents.reduce((sum, t) => sum + (t.totalEvents || 0), 0);
    const avgAttendance = Math.round(
      categoryEvents.reduce((sum, t) => sum + (t.avgAttendance || 0), 0) / categoryEvents.length
    );
    return { totalEvents, avgAttendance };
  };

  const renderEventTypeCard = (type: EventType) => {
    const Icon = type.icon;
    const isExpanded = expandedType === type.id;
    const isSelected = selectedType === type.id;

    return (
      <motion.div
        key={type.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className={cn(
            "hover:shadow-lg transition-all cursor-pointer",
            isSelected && "border-purple-500 bg-purple-50"
          )}
          onClick={() => setExpandedType(isExpanded ? null : type.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  type.color
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">{type.name}</h4>
                  <Badge variant="outline" className="text-xs mt-1">
                    {type.category}
                  </Badge>
                </div>
              </div>
              {type.frequency && (
                <Badge variant="secondary" className="text-xs">
                  {type.frequency}
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-3">{type.description}</p>

            {/* Quick Stats */}
            {type.totalEvents && (
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {type.totalEvents} events
                </span>
                {type.avgAttendance && (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    ~{type.avgAttendance} avg
                  </span>
                )}
              </div>
            )}

            {/* Expanded Content */}
            {isExpanded && (
              <div className="space-y-4 pt-4 border-t">
                {/* Benefits */}
                <div>
                  <h5 className="font-medium text-sm mb-2">Benefits</h5>
                  <div className="space-y-1">
                    {type.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                {type.requirements && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">Requirements</h5>
                    <div className="space-y-1">
                      {type.requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Info className="h-3 w-3" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples */}
                {showExamples && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">Popular Examples</h5>
                    <div className="flex flex-wrap gap-1">
                      {type.examples.map((example, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Times */}
                {type.popularTimes && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">Popular Times</h5>
                    <div className="flex gap-2">
                      {type.popularTimes.map((time, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTypeSelect?.(type.id);
                    }}
                  >
                    View Events
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateEvent?.(type.id);
                    }}
                  >
                    Create This Event
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const categories = [
    { id: 'regular', name: 'Regular Events', icon: Calendar, color: 'bg-blue-100 text-blue-700' },
    { id: 'special', name: 'Special Events', icon: Sparkles, color: 'bg-purple-100 text-purple-700' },
    { id: 'member-led', name: 'Member-Led', icon: Users, color: 'bg-green-100 text-green-700' },
    { id: 'cultural', name: 'Cultural Events', icon: Globe, color: 'bg-orange-100 text-orange-700' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Event Types</h2>
          <p className="text-gray-600">Explore different types of community events</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {showStatistics && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{eventStatistics.totalEvents}</div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{(eventStatistics.totalAttendees / 1000).toFixed(1)}K</div>
                <div className="text-sm text-gray-600">Total Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{eventStatistics.avgRating}</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{eventTypes.length}</div>
                <div className="text-sm text-gray-600">Event Types</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        {categories.map(category => {
          const stats = getCategoryStats(category.id);
          const Icon = category.icon;
          
          return (
            <Card key={category.id} className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    category.color
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">{category.name}</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Events:</span>
                    <span className="font-medium">{stats.totalEvents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Attendance:</span>
                    <span className="font-medium">{stats.avgAttendance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Event Types */}
      <div>
        <h3 className="font-semibold mb-4">All Event Types</h3>
        <div className={cn(
          viewMode === 'grid' 
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        )}>
          {eventTypes.map(renderEventTypeCard)}
        </div>
      </div>

      {/* Trending */}
      {eventStatistics.trending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Event Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {eventStatistics.trending.map((trend, index) => (
                <Badge key={index} className="text-sm">
                  {trend}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}