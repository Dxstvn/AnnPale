'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown,
  Star,
  Shield,
  Video,
  Clock,
  MessageSquare,
  Gift,
  Percent,
  Users,
  Zap,
  Trophy,
  Heart,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Sparkles,
  ChevronRight,
  Award,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface TierBenefit {
  id: string;
  feature: string;
  description?: string;
  icon?: React.ElementType;
  bronze: string | boolean | number;
  silver: string | boolean | number;
  gold: string | boolean | number;
  psychology: string;
  category: 'content' | 'access' | 'interaction' | 'perks' | 'status';
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge: string;
  icon: React.ElementType;
  color: string;
  description: string;
  target: string;
  psychology: string;
  popularityScore: number;
  retentionRate: number;
  benefits: string[];
  limitations?: string[];
}

interface TierStructureProps {
  onTierSelect?: (tier: SubscriptionTier) => void;
  currentTier?: string;
  showComparison?: boolean;
  showPsychology?: boolean;
  highlightedTier?: string;
}

export function TierStructure({
  onTierSelect,
  currentTier,
  showComparison = true,
  showPsychology = true,
  highlightedTier = 'silver'
}: TierStructureProps) {
  const [selectedTier, setSelectedTier] = React.useState<string>(highlightedTier);
  const [expandedBenefit, setExpandedBenefit] = React.useState<string | null>(null);

  // Subscription tiers
  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'bronze',
      name: 'Bronze',
      price: 9.99,
      badge: 'Entry Level',
      icon: Shield,
      color: 'from-orange-400 to-orange-600',
      description: 'Perfect for casual fans who want exclusive content',
      target: 'Casual fans',
      psychology: 'Low-commitment entry point',
      popularityScore: 35,
      retentionRate: 62,
      benefits: [
        'Monthly exclusive video',
        'Early access (24 hours)',
        'Bronze badge',
        'Community access',
        '10% discount on custom videos'
      ],
      limitations: [
        'No live stream access',
        'No direct messages',
        'Limited exclusive content'
      ]
    },
    {
      id: 'silver',
      name: 'Silver',
      price: 24.99,
      originalPrice: 29.99,
      badge: 'Most Popular',
      icon: Star,
      color: 'from-gray-400 to-gray-600',
      description: 'Best value for regular fans with premium access',
      target: 'Regular fans',
      psychology: 'Sweet spot pricing',
      popularityScore: 52,
      retentionRate: 78,
      benefits: [
        'All Bronze benefits',
        'Weekly exclusive content',
        'Live stream access',
        'Direct messages (5/month)',
        'Silver badge',
        '20% discount on custom videos',
        'Priority support'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      price: 49.99,
      badge: 'VIP Status',
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      description: 'Ultimate experience for super fans',
      target: 'Super fans',
      psychology: 'Premium status signal',
      popularityScore: 13,
      retentionRate: 92,
      benefits: [
        'All Silver benefits',
        'Daily exclusive content',
        'Quarterly 1-on-1 video call',
        'Monthly custom shoutout',
        'Unlimited direct messages',
        'Gold VIP badge',
        '30% discount on custom videos',
        'Surprise gifts & merchandise',
        'Early access (72 hours)',
        'Exclusive events invitation'
      ]
    }
  ];

  // Tier benefits comparison
  const tierBenefits: TierBenefit[] = [
    {
      id: 'exclusive-videos',
      feature: 'Exclusive Videos',
      icon: Video,
      bronze: '1/month',
      silver: '4/month',
      gold: '30/month',
      psychology: 'Volume value perception',
      category: 'content'
    },
    {
      id: 'early-access',
      feature: 'Early Access',
      icon: Clock,
      bronze: '24 hours',
      silver: '48 hours',
      gold: '72 hours',
      psychology: 'Exclusivity gradient',
      category: 'access'
    },
    {
      id: 'live-streams',
      feature: 'Live Streams',
      icon: Zap,
      bronze: false,
      silver: true,
      gold: 'Priority',
      psychology: 'Real-time connection',
      category: 'access'
    },
    {
      id: 'direct-messages',
      feature: 'Direct Messages',
      icon: MessageSquare,
      bronze: false,
      silver: '5/month',
      gold: 'Unlimited',
      psychology: 'Personal connection',
      category: 'interaction'
    },
    {
      id: 'video-calls',
      feature: '1-on-1 Video Calls',
      icon: Users,
      bronze: false,
      silver: false,
      gold: 'Quarterly',
      psychology: 'Premium touch point',
      category: 'interaction'
    },
    {
      id: 'custom-discount',
      feature: 'Custom Video Discount',
      icon: Percent,
      bronze: '10%',
      silver: '20%',
      gold: '30%',
      psychology: 'Economic benefit',
      category: 'perks'
    },
    {
      id: 'badge-status',
      feature: 'Badge Status',
      icon: Award,
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold VIP',
      psychology: 'Social signaling',
      category: 'status'
    },
    {
      id: 'surprise-perks',
      feature: 'Surprise Perks',
      icon: Gift,
      bronze: false,
      silver: 'Occasional',
      gold: 'Regular',
      psychology: 'Delight factor',
      category: 'perks'
    }
  ];

  const selectedTierData = subscriptionTiers.find(t => t.id === selectedTier);

  const handleTierSelect = (tier: SubscriptionTier) => {
    setSelectedTier(tier.id);
    onTierSelect?.(tier);
  };

  const renderBenefitValue = (value: string | boolean | number) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle className="h-5 w-5 text-green-600" />
      ) : (
        <XCircle className="h-5 w-5 text-gray-300" />
      );
    }
    return <span className="font-medium">{value}</span>;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'content': return 'text-purple-600 bg-purple-100';
      case 'access': return 'text-blue-600 bg-blue-100';
      case 'interaction': return 'text-green-600 bg-green-100';
      case 'perks': return 'text-yellow-600 bg-yellow-100';
      case 'status': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Subscription Tiers</h2>
        <p className="text-gray-600">
          Choose the perfect membership level for your fan experience
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {subscriptionTiers.map((tier) => {
          const Icon = tier.icon;
          const isSelected = selectedTier === tier.id;
          const isCurrent = currentTier === tier.id;
          const isHighlighted = tier.id === highlightedTier;
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={cn(
                  "relative cursor-pointer transition-all hover:shadow-xl",
                  isSelected && "ring-2 ring-purple-500",
                  isHighlighted && "scale-105 shadow-lg"
                )}
                onClick={() => handleTierSelect(tier)}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className={cn(
                      "px-3 py-1",
                      isHighlighted ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"
                    )}>
                      {tier.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  {/* Icon */}
                  <div className={cn(
                    "w-16 h-16 rounded-full bg-gradient-to-r mx-auto mb-3 flex items-center justify-center",
                    tier.color
                  )}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Name and Price */}
                  <CardTitle className="text-xl mb-2">{tier.name}</CardTitle>
                  <div className="space-y-1">
                    {tier.originalPrice && (
                      <div className="text-gray-400 line-through text-sm">
                        ${tier.originalPrice}/month
                      </div>
                    )}
                    <div className="text-3xl font-bold">
                      ${tier.price}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </div>
                  </div>

                  {isCurrent && (
                    <Badge variant="secondary" className="mt-2">
                      Current Plan
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-sm text-gray-600 text-center">
                    {tier.description}
                  </p>

                  {/* Key Benefits */}
                  <div className="space-y-2">
                    {tier.benefits.slice(0, 5).map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                    {tier.benefits.length > 5 && (
                      <div className="text-xs text-gray-500 pl-6">
                        +{tier.benefits.length - 5} more benefits
                      </div>
                    )}
                  </div>

                  {/* Metrics */}
                  {showPsychology && (
                    <div className="pt-3 border-t space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Popularity</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={tier.popularityScore} 
                            className="w-20 h-2"
                          />
                          <span className="font-medium">{tier.popularityScore}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Retention</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={tier.retentionRate} 
                            className="w-20 h-2"
                          />
                          <span className="font-medium">{tier.retentionRate}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button 
                    className={cn(
                      "w-full",
                      isHighlighted && "bg-purple-600 hover:bg-purple-700"
                    )}
                    variant={isHighlighted ? "default" : "outline"}
                  >
                    {isCurrent ? 'Current Plan' : `Choose ${tier.name}`}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Table */}
      {showComparison && (
        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Feature</th>
                    <th className="text-center py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4 text-orange-600" />
                        Bronze
                      </div>
                    </th>
                    <th className="text-center py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="h-4 w-4 text-gray-600" />
                        Silver
                      </div>
                    </th>
                    <th className="text-center py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-600" />
                        Gold
                      </div>
                    </th>
                    {showPsychology && (
                      <th className="text-left py-3">Psychology</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tierBenefits.map((benefit) => {
                    const Icon = benefit.icon;
                    const isExpanded = expandedBenefit === benefit.id;
                    
                    return (
                      <React.Fragment key={benefit.id}>
                        <tr 
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => setExpandedBenefit(isExpanded ? null : benefit.id)}
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              {Icon && <Icon className="h-4 w-4 text-gray-500" />}
                              <span className="font-medium">{benefit.feature}</span>
                              <Badge className={cn("text-xs ml-2", getCategoryColor(benefit.category))}>
                                {benefit.category}
                              </Badge>
                            </div>
                          </td>
                          <td className="text-center py-3">
                            {renderBenefitValue(benefit.bronze)}
                          </td>
                          <td className="text-center py-3">
                            {renderBenefitValue(benefit.silver)}
                          </td>
                          <td className="text-center py-3">
                            {renderBenefitValue(benefit.gold)}
                          </td>
                          {showPsychology && (
                            <td className="py-3">
                              <span className="text-sm text-gray-600">{benefit.psychology}</span>
                            </td>
                          )}
                        </tr>
                        {isExpanded && benefit.description && (
                          <tr>
                            <td colSpan={showPsychology ? 5 : 4} className="bg-gray-50 px-4 py-2">
                              <p className="text-sm text-gray-600">{benefit.description}</p>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Psychology Insights */}
      {showPsychology && selectedTierData && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {selectedTierData.name} Tier Psychology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Target Audience</h4>
                <p className="text-sm text-gray-600">{selectedTierData.target}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Psychological Driver</h4>
                <p className="text-sm text-gray-600">{selectedTierData.psychology}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Value Perception</h4>
                <div className="flex items-center gap-2">
                  <Progress value={(selectedTierData.price / 49.99) * 100} className="flex-1" />
                  <span className="text-sm font-medium">
                    {Math.round((selectedTierData.price / 49.99) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}