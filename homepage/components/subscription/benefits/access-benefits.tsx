'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Radio,
  Calendar,
  MessageSquare,
  Users,
  Video,
  Headphones,
  Star,
  Crown,
  Shield,
  Zap,
  UserCheck,
  Home,
  Globe,
  Phone,
  Mail,
  CheckCircle,
  Lock,
  Clock,
  TrendingUp,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AccessBenefit {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  frequency?: string;
  availability: {
    bronze: boolean | number;
    silver: boolean | number;
    gold: boolean | number;
  };
  value: {
    perceived: number;
    actual: number;
  };
  nextAvailable?: Date;
  spots?: {
    taken: number;
    total: number;
  };
}

interface AccessBenefitsProps {
  currentTier?: 'bronze' | 'silver' | 'gold' | 'none';
  onAccessRequest?: (benefit: AccessBenefit) => void;
  showUpcoming?: boolean;
}

export function AccessBenefits({
  currentTier = 'none',
  onAccessRequest,
  showUpcoming = true
}: AccessBenefitsProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<'live' | 'events' | 'interaction' | 'community' | 'support'>('live');

  // Access benefit categories
  const accessBenefits: Record<string, AccessBenefit[]> = {
    live: [
      {
        id: 'live-streams',
        title: 'Live Stream Access',
        description: 'Join regular live streaming sessions',
        icon: Radio,
        frequency: 'Weekly',
        availability: { bronze: false, silver: true, gold: true },
        value: { perceived: 85, actual: 30 },
        nextAvailable: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        spots: { taken: 145, total: 200 }
      },
      {
        id: 'vip-streams',
        title: 'VIP Live Rooms',
        description: 'Exclusive small-group live sessions',
        icon: Crown,
        frequency: 'Monthly',
        availability: { bronze: false, silver: false, gold: true },
        value: { perceived: 95, actual: 50 },
        nextAvailable: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        spots: { taken: 18, total: 25 }
      },
      {
        id: 'watch-parties',
        title: 'Watch Parties',
        description: 'Group viewing experiences',
        icon: Users,
        frequency: 'Bi-weekly',
        availability: { bronze: true, silver: true, gold: true },
        value: { perceived: 70, actual: 15 },
        nextAvailable: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      }
    ],
    events: [
      {
        id: 'private-events',
        title: 'Private Events',
        description: 'Members-only special events',
        icon: Calendar,
        frequency: 'Monthly',
        availability: { bronze: 1, silver: 2, gold: 'unlimited' },
        value: { perceived: 90, actual: 40 },
        nextAvailable: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        spots: { taken: 75, total: 100 }
      },
      {
        id: 'virtual-meetups',
        title: 'Virtual Meetups',
        description: 'Online fan gatherings',
        icon: Video,
        frequency: 'Weekly',
        availability: { bronze: false, silver: true, gold: true },
        value: { perceived: 75, actual: 20 },
        nextAvailable: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'qa-sessions',
        title: 'Q&A Sessions',
        description: 'Direct question and answer time',
        icon: MessageSquare,
        frequency: 'Bi-weekly',
        availability: { bronze: false, silver: true, gold: true },
        value: { perceived: 80, actual: 25 },
        nextAvailable: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        spots: { taken: 40, total: 50 }
      }
    ],
    interaction: [
      {
        id: 'direct-messages',
        title: 'Direct Messages',
        description: 'Send messages to creator',
        icon: Mail,
        availability: { bronze: 1, silver: 5, gold: 'unlimited' },
        value: { perceived: 85, actual: 35 },
        frequency: 'Per month'
      },
      {
        id: 'video-calls',
        title: '1-on-1 Video Calls',
        description: 'Personal video call sessions',
        icon: Phone,
        frequency: 'Quarterly',
        availability: { bronze: false, silver: false, gold: 1 },
        value: { perceived: 100, actual: 100 },
        nextAvailable: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        spots: { taken: 3, total: 5 }
      },
      {
        id: 'voice-messages',
        title: 'Voice Messages',
        description: 'Receive personalized voice notes',
        icon: Headphones,
        frequency: 'Monthly',
        availability: { bronze: false, silver: 1, gold: 3 },
        value: { perceived: 75, actual: 20 }
      }
    ],
    community: [
      {
        id: 'community-forum',
        title: 'Community Forum',
        description: 'Access to members-only discussions',
        icon: Users,
        availability: { bronze: true, silver: true, gold: true },
        value: { perceived: 60, actual: 10 }
      },
      {
        id: 'vip-lounge',
        title: 'VIP Lounge',
        description: 'Exclusive community space',
        icon: Home,
        availability: { bronze: false, silver: true, gold: true },
        value: { perceived: 75, actual: 15 }
      },
      {
        id: 'global-community',
        title: 'Global Fan Network',
        description: 'Connect with fans worldwide',
        icon: Globe,
        availability: { bronze: false, silver: false, gold: true },
        value: { perceived: 70, actual: 20 }
      }
    ],
    support: [
      {
        id: 'priority-support',
        title: 'Priority Support',
        description: '24-hour response time',
        icon: Headphones,
        availability: { bronze: false, silver: true, gold: true },
        value: { perceived: 65, actual: 10 }
      },
      {
        id: 'vip-support',
        title: 'VIP Support',
        description: 'Instant support access',
        icon: Zap,
        availability: { bronze: false, silver: false, gold: true },
        value: { perceived: 80, actual: 25 }
      },
      {
        id: 'personal-manager',
        title: 'Personal Account Manager',
        description: 'Dedicated support representative',
        icon: UserCheck,
        availability: { bronze: false, silver: false, gold: true },
        value: { perceived: 90, actual: 50 }
      }
    ]
  };

  // Category metadata
  const categories = [
    { id: 'live', name: 'Live Access', icon: Radio, color: 'from-red-400 to-red-600' },
    { id: 'events', name: 'Private Events', icon: Calendar, color: 'from-purple-400 to-purple-600' },
    { id: 'interaction', name: 'Creator Interaction', icon: MessageSquare, color: 'from-blue-400 to-blue-600' },
    { id: 'community', name: 'Community Spaces', icon: Users, color: 'from-green-400 to-green-600' },
    { id: 'support', name: 'Priority Support', icon: Headphones, color: 'from-orange-400 to-orange-600' }
  ];

  // Check if user has access
  const hasAccess = (benefit: AccessBenefit): boolean => {
    if (currentTier === 'none') return false;
    const access = benefit.availability[currentTier as keyof typeof benefit.availability];
    return access !== false && access !== 0;
  };

  // Get access level
  const getAccessLevel = (benefit: AccessBenefit): string => {
    if (currentTier === 'none') return 'No access';
    const access = benefit.availability[currentTier as keyof typeof benefit.availability];
    if (access === false || access === 0) return 'No access';
    if (access === true || access === 'unlimited') return 'Unlimited';
    return `${access} per ${benefit.frequency?.toLowerCase() || 'month'}`;
  };

  // Format next available date
  const formatNextAvailable = (date: Date) => {
    const days = Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  const selectedBenefits = accessBenefits[selectedCategory];
  const selectedCategoryMeta = categories.find(c => c.id === selectedCategory)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Access Benefits</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Exclusive access to events and interactions</p>
            </div>
            {currentTier !== 'none' && (
              <Badge variant="outline">
                {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Access Level
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Category Selection */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id as any)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all",
                isSelected 
                  ? "border-purple-500 bg-gradient-to-br " + category.color + " text-white"
                  : "border-gray-200 hover:border-purple-300 bg-white"
              )}
            >
              <Icon className={cn(
                "h-6 w-6 mx-auto mb-2",
                isSelected ? "text-white" : "text-gray-600"
              )} />
              <p className={cn(
                "text-xs font-medium",
                isSelected ? "text-white" : "text-gray-700"
              )}>
                {category.name}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Benefits List */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
              selectedCategoryMeta.color
            )}>
              <selectedCategoryMeta.icon className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg">{selectedCategoryMeta.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedBenefits.map((benefit) => {
              const Icon = benefit.icon;
              const accessible = hasAccess(benefit);
              const accessLevel = getAccessLevel(benefit);
              
              return (
                <motion.div
                  key={benefit.id}
                  whileHover={{ x: accessible ? 4 : 0 }}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    accessible 
                      ? "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                      : "border-gray-100 bg-gray-50 opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        accessible ? "bg-purple-100" : "bg-gray-100"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          accessible ? "text-purple-600" : "text-gray-400"
                        )} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{benefit.title}</h4>
                          {benefit.frequency && (
                            <Badge variant="secondary" className="text-xs">
                              {benefit.frequency}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{benefit.description}</p>
                        
                        {/* Access Level */}
                        <div className="flex items-center gap-2 mb-2">
                          {accessible ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {accessLevel}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Upgrade Required
                            </Badge>
                          )}
                        </div>
                        
                        {/* Next Available & Spots */}
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          {benefit.nextAvailable && showUpcoming && (
                            <span>
                              <Clock className="h-3 w-3 inline mr-1" />
                              Next: {formatNextAvailable(benefit.nextAvailable)}
                            </span>
                          )}
                          
                          {benefit.spots && (
                            <span>
                              <Users className="h-3 w-3 inline mr-1" />
                              {benefit.spots.taken}/{benefit.spots.total} spots
                            </span>
                          )}
                        </div>
                        
                        {/* Tier Availability */}
                        <div className="flex items-center gap-2 mt-2">
                          {(['bronze', 'silver', 'gold'] as const).map((tier) => {
                            const TierIcon = tier === 'bronze' ? Shield :
                                           tier === 'silver' ? Star : Crown;
                            const access = benefit.availability[tier];
                            const hasIt = access !== false && access !== 0;
                            
                            return (
                              <div
                                key={tier}
                                className={cn(
                                  "flex items-center gap-1 px-2 py-1 rounded text-xs",
                                  hasIt 
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-50 text-gray-400"
                                )}
                              >
                                <TierIcon className="h-3 w-3" />
                                <span className="capitalize">
                                  {tier}
                                  {typeof access === 'number' && ` (${access})`}
                                  {access === 'unlimited' && ' (∞)'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    {accessible && benefit.nextAvailable && (
                      <Button
                        size="sm"
                        onClick={() => onAccessRequest?.(benefit)}
                      >
                        {benefit.spots ? 'Reserve' : 'Schedule'}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      {showUpcoming && currentTier !== 'none' && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Your Upcoming Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.values(accessBenefits)
                .flat()
                .filter(b => hasAccess(b) && b.nextAvailable)
                .sort((a, b) => (a.nextAvailable?.getTime() || 0) - (b.nextAvailable?.getTime() || 0))
                .slice(0, 3)
                .map((benefit) => {
                  const Icon = benefit.icon;
                  
                  return (
                    <div key={benefit.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{benefit.title}</p>
                          <p className="text-xs text-gray-600">
                            {formatNextAvailable(benefit.nextAvailable!)}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}