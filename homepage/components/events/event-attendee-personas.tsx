'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  Users,
  Music,
  Heart,
  Trophy,
  Star,
  TrendingUp,
  DollarSign,
  MessageCircle,
  Zap,
  Target,
  UserCheck,
  Calendar,
  Ticket,
  Gift,
  Crown,
  Gem,
  PartyPopper,
  Video,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types for Event Attendee Personas
export interface EventAttendeePersona {
  id: string;
  name: string;
  description: string;
  primaryMotivation: string;
  eventPreference: string;
  priceSensitivity: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  engagementLevel: 'low' | 'medium' | 'high' | 'very_high';
  icon: React.ElementType;
  color: string;
  characteristics: string[];
  preferredFeatures: string[];
  painPoints: string[];
  successMetrics: string[];
  demographics: {
    ageRange: string;
    techSavvy: number; // 1-5
    socialActivity: number; // 1-5
    disposableIncome: number; // 1-5
  };
  behaviorPatterns: {
    bookingAdvance: string;
    eventFrequency: string;
    socialSharing: boolean;
    groupAttendance: boolean;
  };
}

// Event Attendee Personas based on Phase 4.2.1 specifications
const EVENT_ATTENDEE_PERSONAS: EventAttendeePersona[] = [
  {
    id: 'experience_seeker',
    name: 'Experience Seeker',
    description: 'Lives for unique, once-in-a-lifetime moments that create lasting memories',
    primaryMotivation: 'Unique moments',
    eventPreference: 'Exclusive, intimate',
    priceSensitivity: 'low',
    engagementLevel: 'very_high',
    icon: Sparkles,
    color: 'bg-purple-500',
    characteristics: [
      'Early adopter of new experiences',
      'Values exclusivity and uniqueness',
      'Active on social media',
      'Seeks bragging rights',
      'Willing to pay premium for quality'
    ],
    preferredFeatures: [
      'VIP access options',
      'Behind-the-scenes content',
      'Meet & greet opportunities',
      'Limited edition memorabilia',
      'Exclusive Q&A sessions'
    ],
    painPoints: [
      'Generic, mass-market events',
      'Poor technical quality',
      'Lack of interaction',
      'No special recognition'
    ],
    successMetrics: [
      'Memorable experience created',
      'Social media engagement',
      'Exclusive access gained',
      'Personal connection made'
    ],
    demographics: {
      ageRange: '25-45',
      techSavvy: 4,
      socialActivity: 5,
      disposableIncome: 4
    },
    behaviorPatterns: {
      bookingAdvance: '2-4 weeks',
      eventFrequency: 'Monthly',
      socialSharing: true,
      groupAttendance: false
    }
  },
  {
    id: 'community_member',
    name: 'Community Member',
    description: 'Seeks belonging and connection with like-minded fans and the creator',
    primaryMotivation: 'Belonging',
    eventPreference: 'Regular gatherings',
    priceSensitivity: 'medium',
    engagementLevel: 'high',
    icon: Users,
    color: 'bg-blue-500',
    characteristics: [
      'Regular participant in fan communities',
      'Values relationships and networking',
      'Enjoys group activities',
      'Loyal to favorite creators',
      'Active in chat and discussions'
    ],
    preferredFeatures: [
      'Regular scheduled events',
      'Community chat rooms',
      'Group activities',
      'Fan recognition programs',
      'Collaborative experiences'
    ],
    painPoints: [
      'Feeling excluded or ignored',
      'One-time only events',
      'No community building',
      'Impersonal experiences'
    ],
    successMetrics: [
      'New connections made',
      'Community participation',
      'Regular attendance',
      'Group engagement'
    ],
    demographics: {
      ageRange: '20-40',
      techSavvy: 3,
      socialActivity: 4,
      disposableIncome: 3
    },
    behaviorPatterns: {
      bookingAdvance: '1-2 weeks',
      eventFrequency: 'Weekly',
      socialSharing: true,
      groupAttendance: true
    }
  },
  {
    id: 'casual_fan',
    name: 'Casual Fan',
    description: 'Looking for entertainment and fun without deep commitment',
    primaryMotivation: 'Entertainment',
    eventPreference: 'Large, popular',
    priceSensitivity: 'high',
    engagementLevel: 'low',
    icon: Music,
    color: 'bg-green-500',
    characteristics: [
      'Occasional participant',
      'Price-conscious decision maker',
      'Prefers passive consumption',
      'Follows trends and popular events',
      'Limited time investment'
    ],
    preferredFeatures: [
      'Affordable pricing',
      'No commitment required',
      'Easy access and setup',
      'Popular content',
      'Flexible scheduling'
    ],
    painPoints: [
      'High ticket prices',
      'Complex setup requirements',
      'Mandatory participation',
      'Long time commitments'
    ],
    successMetrics: [
      'Entertainment value received',
      'Easy participation',
      'Good value for money',
      'Minimal effort required'
    ],
    demographics: {
      ageRange: '18-35',
      techSavvy: 3,
      socialActivity: 3,
      disposableIncome: 2
    },
    behaviorPatterns: {
      bookingAdvance: '1-3 days',
      eventFrequency: 'Monthly',
      socialSharing: false,
      groupAttendance: true
    }
  },
  {
    id: 'supporter',
    name: 'Supporter',
    description: 'Motivated by helping creators succeed and grow their careers',
    primaryMotivation: 'Creator success',
    eventPreference: 'Any creator event',
    priceSensitivity: 'low',
    engagementLevel: 'medium',
    icon: Heart,
    color: 'bg-red-500',
    characteristics: [
      'Patron mindset',
      'Values creator relationship',
      'Consistent financial support',
      'Promotes creator to others',
      'Long-term commitment'
    ],
    preferredFeatures: [
      'Direct creator support options',
      'Patron recognition',
      'Early access privileges',
      'Creator growth metrics',
      'Thank you mentions'
    ],
    painPoints: [
      'No recognition for support',
      'Platform takes large cut',
      'No direct creator benefit',
      'Impersonal transactions'
    ],
    successMetrics: [
      'Creator growth supported',
      'Relationship strengthened',
      'Recognition received',
      'Impact demonstrated'
    ],
    demographics: {
      ageRange: '30-50',
      techSavvy: 3,
      socialActivity: 3,
      disposableIncome: 4
    },
    behaviorPatterns: {
      bookingAdvance: '1-4 weeks',
      eventFrequency: 'Bi-weekly',
      socialSharing: true,
      groupAttendance: false
    }
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Driven by FOMO and the desire to complete collections and experiences',
    primaryMotivation: 'FOMO, completionist',
    eventPreference: 'Limited edition',
    priceSensitivity: 'very_low',
    engagementLevel: 'high',
    icon: Trophy,
    color: 'bg-yellow-500',
    characteristics: [
      'Completionist mentality',
      'Values rarity and exclusivity',
      'Maintains detailed records',
      'High purchase frequency',
      'Status-driven decisions'
    ],
    preferredFeatures: [
      'Limited edition events',
      'Numbered tickets',
      'Collection tracking',
      'Achievement badges',
      'Exclusive certificates'
    ],
    painPoints: [
      'Missing limited events',
      'No collection tracking',
      'Unlimited availability',
      'No proof of attendance'
    ],
    successMetrics: [
      'Collection completed',
      'Rare items obtained',
      'Status achieved',
      'Portfolio value increased'
    ],
    demographics: {
      ageRange: '25-45',
      techSavvy: 4,
      socialActivity: 4,
      disposableIncome: 5
    },
    behaviorPatterns: {
      bookingAdvance: 'Immediately',
      eventFrequency: 'Very frequent',
      socialSharing: true,
      groupAttendance: false
    }
  }
];

// Persona Card Component
function PersonaCard({
  persona,
  isSelected = false,
  onSelect,
  showDetails = false
}: {
  persona: EventAttendeePersona;
  isSelected?: boolean;
  onSelect?: (persona: EventAttendeePersona) => void;
  showDetails?: boolean;
}) {
  const Icon = persona.icon;

  const getPriceSensitivityLabel = (sensitivity: string) => {
    const labels: { [key: string]: string } = {
      very_low: 'Price Insensitive',
      low: 'Premium Buyer',
      medium: 'Value Conscious',
      high: 'Budget Focused',
      very_high: 'Highly Sensitive'
    };
    return labels[sensitivity] || sensitivity;
  };

  const getEngagementLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      low: 'Passive',
      medium: 'Moderate',
      high: 'Active',
      very_high: 'Highly Active'
    };
    return labels[level] || level;
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200",
        isSelected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md",
        onSelect && "hover:scale-[1.02]"
      )}
      onClick={() => onSelect?.(persona)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg text-white", persona.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{persona.name}</CardTitle>
              <CardDescription className="mt-1">
                {persona.description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Attributes */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Motivation:</span>
            <p className="font-medium">{persona.primaryMotivation}</p>
          </div>
          <div>
            <span className="text-gray-600">Preference:</span>
            <p className="font-medium">{persona.eventPreference}</p>
          </div>
          <div>
            <span className="text-gray-600">Price Sensitivity:</span>
            <Badge variant="outline" className="mt-1">
              {getPriceSensitivityLabel(persona.priceSensitivity)}
            </Badge>
          </div>
          <div>
            <span className="text-gray-600">Engagement:</span>
            <Badge variant="outline" className="mt-1">
              {getEngagementLabel(persona.engagementLevel)}
            </Badge>
          </div>
        </div>

        {/* Demographics */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Demographics</h5>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tech Savvy</span>
              <div className="flex items-center gap-2">
                <Progress value={persona.demographics.techSavvy * 20} className="w-20 h-2" />
                <span className="text-xs">{persona.demographics.techSavvy}/5</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Social Activity</span>
              <div className="flex items-center gap-2">
                <Progress value={persona.demographics.socialActivity * 20} className="w-20 h-2" />
                <span className="text-xs">{persona.demographics.socialActivity}/5</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Income Level</span>
              <div className="flex items-center gap-2">
                <Progress value={persona.demographics.disposableIncome * 20} className="w-20 h-2" />
                <span className="text-xs">{persona.demographics.disposableIncome}/5</span>
              </div>
            </div>
          </div>
        </div>

        {showDetails && (
          <>
            {/* Behavior Patterns */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Behavior Patterns</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Books:</span>
                  <p className="font-medium">{persona.behaviorPatterns.bookingAdvance} early</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Frequency:</span>
                  <p className="font-medium">{persona.behaviorPatterns.eventFrequency}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Social:</span>
                  <p className="font-medium">{persona.behaviorPatterns.socialSharing ? 'Shares' : 'Private'}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Attendance:</span>
                  <p className="font-medium">{persona.behaviorPatterns.groupAttendance ? 'Group' : 'Solo'}</p>
                </div>
              </div>
            </div>

            {/* Preferred Features */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Preferred Features</h5>
              <div className="flex flex-wrap gap-1">
                {persona.preferredFeatures.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {onSelect && (
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(persona);
            }}
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Main Component
export function EventAttendeePersonas({
  onPersonaSelect,
  selectedPersonaId,
  showComparison = false,
  className
}: {
  onPersonaSelect?: (persona: EventAttendeePersona) => void;
  selectedPersonaId?: string;
  showComparison?: boolean;
  className?: string;
}) {
  const [selectedTab, setSelectedTab] = React.useState('overview');
  const [selectedPersona, setSelectedPersona] = React.useState<EventAttendeePersona | null>(
    selectedPersonaId ? EVENT_ATTENDEE_PERSONAS.find(p => p.id === selectedPersonaId) || null : null
  );

  const handlePersonaSelect = (persona: EventAttendeePersona) => {
    setSelectedPersona(persona);
    onPersonaSelect?.(persona);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-2xl font-bold mb-2">Event Attendee Personas</h2>
        <p className="text-gray-600">
          Understanding different attendee motivations to create targeted event experiences
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EVENT_ATTENDEE_PERSONAS.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                isSelected={selectedPersona?.id === persona.id}
                onSelect={handlePersonaSelect}
                showDetails={false}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {selectedPersona ? (
            <div className="grid lg:grid-cols-2 gap-6">
              <PersonaCard
                persona={selectedPersona}
                showDetails={true}
              />
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Characteristics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPersona.characteristics.map((char, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pain Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPersona.painPoints.map((pain, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-red-500">✗</span>
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Success Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPersona.successMetrics.map((metric, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Target className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="p-8">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Select a Persona</h3>
                <p className="text-gray-600">
                  Choose a persona from the overview to see detailed information
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Persona</th>
                  <th className="text-left p-3">Motivation</th>
                  <th className="text-left p-3">Event Type</th>
                  <th className="text-left p-3">Price Sensitivity</th>
                  <th className="text-left p-3">Engagement</th>
                  <th className="text-left p-3">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {EVENT_ATTENDEE_PERSONAS.map((persona) => {
                  const Icon = persona.icon;
                  return (
                    <tr key={persona.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className={cn("p-1 rounded text-white", persona.color)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{persona.name}</span>
                        </div>
                      </td>
                      <td className="p-3">{persona.primaryMotivation}</td>
                      <td className="p-3">{persona.eventPreference}</td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {persona.priceSensitivity.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {persona.engagementLevel.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3">{persona.behaviorPatterns.eventFrequency}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}