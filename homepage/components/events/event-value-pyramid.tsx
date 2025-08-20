'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Crown,
  Users,
  Video,
  Gift,
  Award,
  Star,
  Sparkles,
  MessageCircle,
  Trophy,
  Calendar,
  Lock,
  Unlock,
  TrendingUp,
  Target,
  Zap,
  Heart,
  Share2,
  FileText,
  Camera,
  Music,
  Mic,
  UserPlus,
  Globe,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Info,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types for Event Value Pyramid
export interface EventValueTier {
  id: string;
  name: string;
  level: number; // 1-5, with 5 being the top
  description: string;
  valueType: 'exclusivity' | 'interaction' | 'content' | 'community' | 'memorabilia';
  icon: React.ElementType;
  color: string;
  features: EventValueFeature[];
  priceMultiplier: number; // How much this tier adds to base price
  appealToPersonas: string[]; // Which personas value this most
}

export interface EventValueFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  importance: 'essential' | 'important' | 'nice_to_have';
  implementationEffort: 'low' | 'medium' | 'high';
}

// Event Value Pyramid Tiers based on Phase 4.2.1
const EVENT_VALUE_TIERS: EventValueTier[] = [
  {
    id: 'exclusivity',
    name: 'Exclusivity',
    level: 5,
    description: 'Top tier - Limited access and unique experiences',
    valueType: 'exclusivity',
    icon: Crown,
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    priceMultiplier: 3.0,
    appealToPersonas: ['experience_seeker', 'collector'],
    features: [
      {
        id: 'limited_attendance',
        name: 'Limited Attendance',
        description: 'Capped number of participants for intimate experience',
        icon: Lock,
        importance: 'essential',
        implementationEffort: 'low'
      },
      {
        id: 'vip_access',
        name: 'VIP Access',
        description: 'Special privileges and exclusive areas',
        icon: Star,
        importance: 'essential',
        implementationEffort: 'medium'
      },
      {
        id: 'never_repeated',
        name: 'Never Repeated',
        description: 'One-time only event that won\'t happen again',
        icon: Sparkles,
        importance: 'important',
        implementationEffort: 'low'
      },
      {
        id: 'special_guests',
        name: 'Special Guests',
        description: 'Surprise celebrity appearances or collaborations',
        icon: UserPlus,
        importance: 'nice_to_have',
        implementationEffort: 'high'
      }
    ]
  },
  {
    id: 'interaction',
    name: 'Interaction',
    level: 4,
    description: 'High value - Direct engagement with creator',
    valueType: 'interaction',
    icon: MessageCircle,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    priceMultiplier: 2.0,
    appealToPersonas: ['community_member', 'experience_seeker'],
    features: [
      {
        id: 'qa_sessions',
        name: 'Q&A Sessions',
        description: 'Direct question and answer with the creator',
        icon: Mic,
        importance: 'essential',
        implementationEffort: 'low'
      },
      {
        id: 'meet_greets',
        name: 'Meet & Greets',
        description: 'Virtual face-to-face time with creator',
        icon: Users,
        importance: 'essential',
        implementationEffort: 'medium'
      },
      {
        id: 'participation',
        name: 'Participation',
        description: 'Active involvement in activities or performances',
        icon: Zap,
        importance: 'important',
        implementationEffort: 'medium'
      },
      {
        id: 'recognition',
        name: 'Recognition',
        description: 'Personal shout-outs and acknowledgments',
        icon: Award,
        importance: 'important',
        implementationEffort: 'low'
      }
    ]
  },
  {
    id: 'content',
    name: 'Content',
    level: 3,
    description: 'Core value - The main event experience',
    valueType: 'content',
    icon: Video,
    color: 'bg-gradient-to-br from-green-500 to-emerald-500',
    priceMultiplier: 1.0,
    appealToPersonas: ['casual_fan', 'supporter'],
    features: [
      {
        id: 'performance',
        name: 'Performance',
        description: 'Live shows, concerts, or demonstrations',
        icon: Music,
        importance: 'essential',
        implementationEffort: 'medium'
      },
      {
        id: 'teaching',
        name: 'Teaching',
        description: 'Workshops, masterclasses, or tutorials',
        icon: FileText,
        importance: 'essential',
        implementationEffort: 'medium'
      },
      {
        id: 'behind_scenes',
        name: 'Behind Scenes',
        description: 'Exclusive backstage or making-of content',
        icon: Camera,
        importance: 'important',
        implementationEffort: 'low'
      },
      {
        id: 'premiere',
        name: 'Premiere',
        description: 'First viewing of new content or announcements',
        icon: Play,
        importance: 'nice_to_have',
        implementationEffort: 'low'
      }
    ]
  },
  {
    id: 'community',
    name: 'Community',
    level: 2,
    description: 'Social value - Connection with other fans',
    valueType: 'community',
    icon: Users,
    color: 'bg-gradient-to-br from-orange-500 to-red-500',
    priceMultiplier: 0.5,
    appealToPersonas: ['community_member', 'casual_fan'],
    features: [
      {
        id: 'shared_experience',
        name: 'Shared Experience',
        description: 'Watching and reacting together in real-time',
        icon: Heart,
        importance: 'essential',
        implementationEffort: 'low'
      },
      {
        id: 'networking',
        name: 'Networking',
        description: 'Connect with other fans and attendees',
        icon: Globe,
        importance: 'important',
        implementationEffort: 'medium'
      },
      {
        id: 'group_activities',
        name: 'Group Activities',
        description: 'Collaborative games, polls, or challenges',
        icon: Target,
        importance: 'important',
        implementationEffort: 'medium'
      },
      {
        id: 'discussions',
        name: 'Discussions',
        description: 'Moderated chat rooms and forums',
        icon: MessageCircle,
        importance: 'nice_to_have',
        implementationEffort: 'low'
      }
    ]
  },
  {
    id: 'memorabilia',
    name: 'Memorabilia',
    level: 1,
    description: 'Lasting value - Keepsakes and recordings',
    valueType: 'memorabilia',
    icon: Gift,
    color: 'bg-gradient-to-br from-yellow-500 to-amber-500',
    priceMultiplier: 0.3,
    appealToPersonas: ['collector', 'supporter'],
    features: [
      {
        id: 'recordings',
        name: 'Recordings',
        description: 'Access to event replay and highlights',
        icon: Video,
        importance: 'essential',
        implementationEffort: 'low'
      },
      {
        id: 'certificates',
        name: 'Certificates',
        description: 'Proof of attendance or completion',
        icon: Award,
        importance: 'important',
        implementationEffort: 'low'
      },
      {
        id: 'digital_goods',
        name: 'Digital Goods',
        description: 'Exclusive wallpapers, filters, or assets',
        icon: Gift,
        importance: 'nice_to_have',
        implementationEffort: 'medium'
      },
      {
        id: 'exclusive_content',
        name: 'Exclusive Content',
        description: 'Bonus materials only for attendees',
        icon: Lock,
        importance: 'nice_to_have',
        implementationEffort: 'medium'
      }
    ]
  }
];

// Pyramid Tier Component
function PyramidTier({
  tier,
  isExpanded,
  onToggle,
  isHighlighted
}: {
  tier: EventValueTier;
  isExpanded: boolean;
  onToggle: () => void;
  isHighlighted?: boolean;
}) {
  const Icon = tier.icon;
  
  // Calculate pyramid width based on level (bottom is wider)
  const widthPercentage = 100 - (tier.level - 1) * 15;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (5 - tier.level) * 0.1 }}
      className="relative"
    >
      <div
        className={cn(
          "relative mx-auto cursor-pointer transition-all duration-300",
          isHighlighted && "scale-105 z-10"
        )}
        style={{ width: `${widthPercentage}%` }}
        onClick={onToggle}
      >
        <div
          className={cn(
            "relative p-4 text-white rounded-lg shadow-lg",
            "hover:shadow-xl transform hover:-translate-y-1 transition-all",
            tier.color,
            isExpanded && "ring-4 ring-white ring-opacity-50"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6" />
              <div>
                <h3 className="font-bold text-lg">{tier.name}</h3>
                <p className="text-sm opacity-90">{tier.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30">
                Level {tier.level}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                {tier.priceMultiplier}x
              </Badge>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 mx-auto"
            style={{ width: `${widthPercentage}%` }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {tier.features.map((feature) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div key={feature.id} className="flex items-start gap-3">
                        <FeatureIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{feature.name}</h5>
                          <p className="text-xs text-gray-600 mt-1">
                            {feature.description}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                feature.importance === 'essential' && "border-red-500 text-red-600",
                                feature.importance === 'important' && "border-yellow-500 text-yellow-600",
                                feature.importance === 'nice_to_have' && "border-green-500 text-green-600"
                              )}
                            >
                              {feature.importance.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {feature.implementationEffort} effort
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600">Appeals to:</span>
                      <div className="flex gap-1 mt-1">
                        {tier.appealToPersonas.map((persona) => (
                          <Badge key={persona} variant="secondary" className="text-xs">
                            {persona.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Add to Event
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Value Calculator Component
function ValueCalculator({ tiers }: { tiers: EventValueTier[] }) {
  const [selectedTiers, setSelectedTiers] = React.useState<string[]>([]);
  
  const toggleTier = (tierId: string) => {
    setSelectedTiers(prev => 
      prev.includes(tierId) 
        ? prev.filter(id => id !== tierId)
        : [...prev, tierId]
    );
  };

  const calculateTotalValue = () => {
    const basePrice = 20; // Base event price
    const totalMultiplier = selectedTiers.reduce((sum, tierId) => {
      const tier = tiers.find(t => t.id === tierId);
      return sum + (tier?.priceMultiplier || 0);
    }, 1);
    
    return {
      basePrice,
      totalMultiplier,
      suggestedPrice: basePrice * totalMultiplier,
      selectedCount: selectedTiers.length
    };
  };

  const value = calculateTotalValue();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Value Calculator</CardTitle>
        <CardDescription>
          Select value tiers to calculate suggested event pricing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedTiers.includes(tier.id);
            
            return (
              <div
                key={tier.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                  isSelected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                )}
                onClick={() => toggleTier(tier.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded text-white", tier.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-medium">{tier.name}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      +{((tier.priceMultiplier - 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {tier.priceMultiplier}x
                  </Badge>
                  <div className={cn(
                    "w-5 h-5 rounded border-2 transition-colors",
                    isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                  )}>
                    {isSelected && (
                      <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Base Price:</span>
            <span className="font-medium">${value.basePrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Value Multiplier:</span>
            <span className="font-medium">{value.totalMultiplier.toFixed(1)}x</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Selected Tiers:</span>
            <span className="font-medium">{value.selectedCount} / {tiers.length}</span>
          </div>
          <div className="pt-2 border-t">
            <div className="flex justify-between">
              <span className="font-medium">Suggested Price:</span>
              <span className="text-xl font-bold text-green-600">
                ${value.suggestedPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Component
export function EventValuePyramid({
  onTierSelect,
  showCalculator = true,
  className
}: {
  onTierSelect?: (tier: EventValueTier) => void;
  showCalculator?: boolean;
  className?: string;
}) {
  const [expandedTier, setExpandedTier] = React.useState<string | null>(null);
  const [selectedTab, setSelectedTab] = React.useState('pyramid');

  const handleTierToggle = (tierId: string) => {
    setExpandedTier(expandedTier === tierId ? null : tierId);
    const tier = EVENT_VALUE_TIERS.find(t => t.id === tierId);
    if (tier) {
      onTierSelect?.(tier);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-2xl font-bold mb-2">Event Value Pyramid</h2>
        <p className="text-gray-600">
          Hierarchical value proposition framework for virtual events
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pyramid">Visual Pyramid</TabsTrigger>
          <TabsTrigger value="calculator">Value Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="pyramid" className="space-y-4">
          <div className="space-y-4">
            {EVENT_VALUE_TIERS.sort((a, b) => b.level - a.level).map((tier) => (
              <PyramidTier
                key={tier.id}
                tier={tier}
                isExpanded={expandedTier === tier.id}
                onToggle={() => handleTierToggle(tier.id)}
                isHighlighted={expandedTier === tier.id}
              />
            ))}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">
                    How to Use the Value Pyramid
                  </p>
                  <p className="text-blue-700">
                    Higher tiers represent more exclusive and valuable features. 
                    Stack multiple tiers to create premium event experiences. 
                    Each tier multiplies the base event price based on its value contribution.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          {showCalculator && (
            <ValueCalculator tiers={EVENT_VALUE_TIERS} />
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Pricing Strategy Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h5 className="font-medium">Premium Positioning</h5>
                  <p className="text-sm text-gray-600">
                    Include exclusivity and interaction tiers for 3-5x base price
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-medium">Mass Market</h5>
                  <p className="text-sm text-gray-600">
                    Focus on content and community tiers for 1-2x base price
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium">Quick Win</h5>
                  <p className="text-sm text-gray-600">
                    Add memorabilia tier for minimal effort, 30% price boost
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}