'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Award,
  Building,
  Calendar,
  BarChart3,
  Heart,
  Zap,
  Star,
  Clock,
  Repeat,
  Trophy,
  MessageCircle,
  UserPlus,
  Globe,
  Megaphone,
  CheckCircle,
  ArrowRight,
  Info,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types for Creator Event Motivations
export interface CreatorEventMotivation {
  id: string;
  motivation: string;
  description: string;
  eventType: string;
  frequency: string;
  revenueModel: string;
  successMetrics: string[];
  icon: React.ElementType;
  color: string;
  targetAudience: string;
  effortLevel: 'low' | 'medium' | 'high';
  expectedROI: 'low' | 'medium' | 'high' | 'very_high';
  recommendations: EventRecommendation[];
}

export interface EventRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'must_have' | 'should_have' | 'nice_to_have';
  icon: React.ElementType;
}

export interface EventStrategy {
  id: string;
  name: string;
  description: string;
  motivations: string[];
  monthlyEvents: number;
  averagePrice: number;
  projectedRevenue: number;
  audienceGrowth: number;
  engagementScore: number;
}

// Creator Event Motivations based on Phase 4.2.1
const CREATOR_EVENT_MOTIVATIONS: CreatorEventMotivation[] = [
  {
    id: 'revenue_spike',
    motivation: 'Revenue Spike',
    description: 'Generate significant income through premium event pricing',
    eventType: 'Premium shows',
    frequency: 'Monthly',
    revenueModel: 'High ticket price',
    successMetrics: ['Total revenue', 'Profit margin', 'Ticket sales velocity', 'Premium tier conversion'],
    icon: DollarSign,
    color: 'bg-green-500',
    targetAudience: 'High-value fans',
    effortLevel: 'high',
    expectedROI: 'very_high',
    recommendations: [
      {
        id: 'exclusive_content',
        title: 'Create Exclusive Content',
        description: 'Offer content that can\'t be found anywhere else',
        priority: 'must_have',
        icon: Star
      },
      {
        id: 'vip_tiers',
        title: 'Multiple VIP Tiers',
        description: 'Offer different levels of premium access',
        priority: 'should_have',
        icon: Trophy
      },
      {
        id: 'limited_seats',
        title: 'Limited Availability',
        description: 'Create scarcity to drive demand',
        priority: 'must_have',
        icon: Clock
      }
    ]
  },
  {
    id: 'audience_growth',
    motivation: 'Audience Growth',
    description: 'Attract new followers and expand fan base',
    eventType: 'Free/low cost',
    frequency: 'Weekly',
    revenueModel: 'Volume sales',
    successMetrics: ['New followers', 'Reach expansion', 'Viral coefficient', 'Conversion to paid'],
    icon: TrendingUp,
    color: 'bg-blue-500',
    targetAudience: 'New audiences',
    effortLevel: 'medium',
    expectedROI: 'medium',
    recommendations: [
      {
        id: 'shareable_moments',
        title: 'Shareable Moments',
        description: 'Create viral-worthy content during events',
        priority: 'must_have',
        icon: Globe
      },
      {
        id: 'referral_rewards',
        title: 'Referral Incentives',
        description: 'Reward fans for bringing friends',
        priority: 'should_have',
        icon: UserPlus
      },
      {
        id: 'cross_promotion',
        title: 'Cross-Promotion',
        description: 'Partner with other creators',
        priority: 'nice_to_have',
        icon: Megaphone
      }
    ]
  },
  {
    id: 'deep_engagement',
    motivation: 'Deep Engagement',
    description: 'Build stronger connections with existing fans',
    eventType: 'Workshops',
    frequency: 'Bi-weekly',
    revenueModel: 'Medium price',
    successMetrics: ['Completion rate', 'Engagement score', 'Return attendance', 'Community growth'],
    icon: Heart,
    color: 'bg-purple-500',
    targetAudience: 'Core fanbase',
    effortLevel: 'high',
    expectedROI: 'high',
    recommendations: [
      {
        id: 'interactive_format',
        title: 'Interactive Elements',
        description: 'Include Q&A, polls, and participation',
        priority: 'must_have',
        icon: MessageCircle
      },
      {
        id: 'small_groups',
        title: 'Intimate Settings',
        description: 'Keep groups small for personal attention',
        priority: 'should_have',
        icon: Users
      },
      {
        id: 'follow_up',
        title: 'Post-Event Follow-up',
        description: 'Continue engagement after the event',
        priority: 'nice_to_have',
        icon: Heart
      }
    ]
  },
  {
    id: 'brand_building',
    motivation: 'Brand Building',
    description: 'Establish authority and increase brand value',
    eventType: 'Special occasions',
    frequency: 'Quarterly',
    revenueModel: 'Varied',
    successMetrics: ['Media coverage', 'Brand mentions', 'Partnership offers', 'Premium positioning'],
    icon: Building,
    color: 'bg-orange-500',
    targetAudience: 'Industry & media',
    effortLevel: 'high',
    expectedROI: 'high',
    recommendations: [
      {
        id: 'production_value',
        title: 'High Production Value',
        description: 'Invest in professional quality',
        priority: 'must_have',
        icon: Award
      },
      {
        id: 'special_guests',
        title: 'Celebrity Guests',
        description: 'Collaborate with notable figures',
        priority: 'should_have',
        icon: Star
      },
      {
        id: 'press_coverage',
        title: 'Media Outreach',
        description: 'Invite press and influencers',
        priority: 'should_have',
        icon: Megaphone
      }
    ]
  },
  {
    id: 'community',
    motivation: 'Community',
    description: 'Foster fan community and loyalty',
    eventType: 'Regular meetups',
    frequency: 'Weekly',
    revenueModel: 'Subscription',
    successMetrics: ['Retention', 'Community activity', 'User-generated content', 'Lifetime value'],
    icon: Users,
    color: 'bg-red-500',
    targetAudience: 'Loyal fans',
    effortLevel: 'low',
    expectedROI: 'medium',
    recommendations: [
      {
        id: 'regular_schedule',
        title: 'Consistent Schedule',
        description: 'Same time every week for habit formation',
        priority: 'must_have',
        icon: Calendar
      },
      {
        id: 'fan_spotlight',
        title: 'Feature Fans',
        description: 'Highlight community members',
        priority: 'should_have',
        icon: Star
      },
      {
        id: 'collaborative',
        title: 'Co-creation',
        description: 'Let fans contribute to events',
        priority: 'nice_to_have',
        icon: Heart
      }
    ]
  }
];

// Motivation Card Component
function MotivationCard({
  motivation,
  isSelected,
  onSelect,
  showDetails = false
}: {
  motivation: CreatorEventMotivation;
  isSelected?: boolean;
  onSelect?: (motivation: CreatorEventMotivation) => void;
  showDetails?: boolean;
}) {
  const Icon = motivation.icon;

  const getROIColor = (roi: string) => {
    switch (roi) {
      case 'very_high': return 'text-green-600 bg-green-50';
      case 'high': return 'text-blue-600 bg-blue-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200",
        isSelected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md",
        onSelect && "hover:scale-[1.02]"
      )}
      onClick={() => onSelect?.(motivation)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg text-white", motivation.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{motivation.motivation}</CardTitle>
              <CardDescription className="mt-1">
                {motivation.description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Event Type:</span>
            <p className="font-medium">{motivation.eventType}</p>
          </div>
          <div>
            <span className="text-gray-600">Frequency:</span>
            <p className="font-medium">{motivation.frequency}</p>
          </div>
          <div>
            <span className="text-gray-600">Revenue Model:</span>
            <p className="font-medium">{motivation.revenueModel}</p>
          </div>
          <div>
            <span className="text-gray-600">Target:</span>
            <p className="font-medium">{motivation.targetAudience}</p>
          </div>
        </div>

        {/* ROI and Effort */}
        <div className="flex items-center gap-3">
          <Badge className={cn("capitalize", getROIColor(motivation.expectedROI))}>
            ROI: {motivation.expectedROI.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className={getEffortColor(motivation.effortLevel)}>
            Effort: {motivation.effortLevel}
          </Badge>
        </div>

        {/* Success Metrics */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Success Metrics</h5>
          <div className="flex flex-wrap gap-1">
            {motivation.successMetrics.slice(0, 3).map((metric, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {metric}
              </Badge>
            ))}
            {motivation.successMetrics.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{motivation.successMetrics.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {showDetails && (
          <>
            {/* Recommendations */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Key Recommendations</h5>
              <div className="space-y-2">
                {motivation.recommendations.map((rec) => {
                  const RecIcon = rec.icon;
                  return (
                    <div key={rec.id} className="flex items-start gap-2">
                      <RecIcon className="h-4 w-4 text-gray-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{rec.title}</p>
                        <p className="text-xs text-gray-600">{rec.description}</p>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs mt-1",
                            rec.priority === 'must_have' && "border-red-500 text-red-600",
                            rec.priority === 'should_have' && "border-yellow-500 text-yellow-600",
                            rec.priority === 'nice_to_have' && "border-green-500 text-green-600"
                          )}
                        >
                          {rec.priority.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Strategy Builder Component
function StrategyBuilder({ motivations }: { motivations: CreatorEventMotivation[] }) {
  const [selectedMotivations, setSelectedMotivations] = React.useState<string[]>([]);
  const [monthlyGoal, setMonthlyGoal] = React.useState('5000');

  const toggleMotivation = (motivationId: string) => {
    setSelectedMotivations(prev =>
      prev.includes(motivationId)
        ? prev.filter(id => id !== motivationId)
        : [...prev, motivationId]
    );
  };

  const calculateStrategy = (): EventStrategy => {
    const selected = motivations.filter(m => selectedMotivations.includes(m.id));
    
    if (selected.length === 0) {
      return {
        id: 'empty',
        name: 'No Strategy Selected',
        description: 'Select motivations to build your event strategy',
        motivations: [],
        monthlyEvents: 0,
        averagePrice: 0,
        projectedRevenue: 0,
        audienceGrowth: 0,
        engagementScore: 0
      };
    }

    // Calculate based on selected motivations
    const monthlyEvents = selected.reduce((sum, m) => {
      const freq = m.frequency.toLowerCase();
      if (freq.includes('weekly')) return sum + 4;
      if (freq.includes('bi-weekly')) return sum + 2;
      if (freq.includes('monthly')) return sum + 1;
      if (freq.includes('quarterly')) return sum + 0.33;
      return sum;
    }, 0);

    const avgPrice = selected.reduce((sum, m) => {
      if (m.revenueModel.includes('High')) return sum + 100;
      if (m.revenueModel.includes('Medium')) return sum + 50;
      if (m.revenueModel.includes('low') || m.revenueModel.includes('Free')) return sum + 10;
      if (m.revenueModel.includes('Volume')) return sum + 20;
      if (m.revenueModel.includes('Subscription')) return sum + 30;
      return sum + 40;
    }, 0) / selected.length;

    const projectedRevenue = Math.round(monthlyEvents * avgPrice * 50); // Assume 50 attendees average
    const audienceGrowth = selected.some(m => m.id === 'audience_growth') ? 25 : 10;
    const engagementScore = selected.some(m => m.id === 'deep_engagement' || m.id === 'community') ? 85 : 65;

    return {
      id: 'custom',
      name: 'Balanced Strategy',
      description: `Mix of ${selected.map(m => m.motivation.toLowerCase()).join(', ')}`,
      motivations: selectedMotivations,
      monthlyEvents: Math.round(monthlyEvents),
      averagePrice: Math.round(avgPrice),
      projectedRevenue,
      audienceGrowth,
      engagementScore
    };
  };

  const strategy = calculateStrategy();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Strategy Builder</CardTitle>
        <CardDescription>
          Select your motivations to generate a personalized event strategy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Motivation Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Your Motivations</label>
          <div className="grid grid-cols-2 gap-2">
            {motivations.map((motivation) => {
              const Icon = motivation.icon;
              const isSelected = selectedMotivations.includes(motivation.id);
              
              return (
                <div
                  key={motivation.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                    isSelected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  )}
                  onClick={() => toggleMotivation(motivation.id)}
                >
                  <div className={cn(
                    "w-4 h-4 rounded border-2 transition-colors",
                    isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                  )}>
                    {isSelected && (
                      <CheckCircle className="w-full h-full text-white" />
                    )}
                  </div>
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{motivation.motivation}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Goal */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Monthly Revenue Goal</label>
          <Select value={monthlyGoal} onValueChange={setMonthlyGoal}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">$1,000</SelectItem>
              <SelectItem value="2500">$2,500</SelectItem>
              <SelectItem value="5000">$5,000</SelectItem>
              <SelectItem value="10000">$10,000</SelectItem>
              <SelectItem value="25000">$25,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Strategy Results */}
        {selectedMotivations.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <h5 className="font-medium">Your Strategy Summary</h5>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Events/Month:</span>
                <p className="font-bold text-lg">{strategy.monthlyEvents}</p>
              </div>
              <div>
                <span className="text-gray-600">Avg Ticket Price:</span>
                <p className="font-bold text-lg">${strategy.averagePrice}</p>
              </div>
              <div>
                <span className="text-gray-600">Projected Revenue:</span>
                <p className="font-bold text-lg text-green-600">
                  ${strategy.projectedRevenue.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Audience Growth:</span>
                <p className="font-bold text-lg text-blue-600">
                  +{strategy.audienceGrowth}%
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Revenue Goal Progress</span>
                <span>{Math.min(100, (strategy.projectedRevenue / parseInt(monthlyGoal)) * 100).toFixed(0)}%</span>
              </div>
              <Progress 
                value={Math.min(100, (strategy.projectedRevenue / parseInt(monthlyGoal)) * 100)} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Engagement Score</span>
                <span>{strategy.engagementScore}%</span>
              </div>
              <Progress value={strategy.engagementScore} className="h-2" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main Component
export function CreatorEventMotivations({
  onMotivationSelect,
  showStrategyBuilder = true,
  className
}: {
  onMotivationSelect?: (motivation: CreatorEventMotivation) => void;
  showStrategyBuilder?: boolean;
  className?: string;
}) {
  const [selectedTab, setSelectedTab] = React.useState('overview');
  const [selectedMotivation, setSelectedMotivation] = React.useState<CreatorEventMotivation | null>(null);

  const handleMotivationSelect = (motivation: CreatorEventMotivation) => {
    setSelectedMotivation(motivation);
    onMotivationSelect?.(motivation);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-2xl font-bold mb-2">Creator Event Motivations</h2>
        <p className="text-gray-600">
          Strategic framework for planning events based on creator goals
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="strategy">Strategy Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CREATOR_EVENT_MOTIVATIONS.map((motivation) => (
              <MotivationCard
                key={motivation.id}
                motivation={motivation}
                isSelected={selectedMotivation?.id === motivation.id}
                onSelect={handleMotivationSelect}
                showDetails={false}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {selectedMotivation ? (
            <div className="grid lg:grid-cols-2 gap-6">
              <MotivationCard
                motivation={selectedMotivation}
                showDetails={true}
              />
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium">Frequency</h5>
                        <p className="text-sm text-gray-600">
                          Run {selectedMotivation.frequency.toLowerCase()} events for optimal results
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium">Target Audience</h5>
                        <p className="text-sm text-gray-600">
                          Focus on {selectedMotivation.targetAudience} for best conversion
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium">Revenue Model</h5>
                        <p className="text-sm text-gray-600">
                          Optimize for {selectedMotivation.revenueModel.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Success Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedMotivation.successMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="p-8">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Select a Motivation</h3>
                <p className="text-gray-600">
                  Choose a motivation from the overview to see detailed analysis
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          {showStrategyBuilder && (
            <StrategyBuilder motivations={CREATOR_EVENT_MOTIVATIONS} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}