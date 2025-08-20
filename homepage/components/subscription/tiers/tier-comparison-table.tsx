'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown,
  Star,
  Shield,
  Check,
  X,
  Minus,
  Info,
  TrendingUp,
  Users,
  DollarSign,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TierBenefit } from './tier-structure';

interface ComparisonCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  benefits: TierBenefit[];
}

interface TierComparisonTableProps {
  onFeatureClick?: (feature: TierBenefit) => void;
  highlightDifferences?: boolean;
  showPsychologyInsights?: boolean;
  compactMode?: boolean;
  selectedCategory?: string;
}

export function TierComparisonTable({
  onFeatureClick,
  highlightDifferences = true,
  showPsychologyInsights = true,
  compactMode = false,
  selectedCategory = 'all'
}: TierComparisonTableProps) {
  const [expandedFeatures, setExpandedFeatures] = React.useState<Set<string>>(new Set());
  const [hiddenCategories, setHiddenCategories] = React.useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = React.useState<'detailed' | 'compact'>('detailed');

  // Comprehensive feature comparison
  const allFeatures: TierBenefit[] = [
    // Content Features
    {
      id: 'exclusive-videos',
      feature: 'Exclusive Videos',
      description: 'Members-only video content released regularly',
      bronze: '1/month',
      silver: '4/month',
      gold: '30/month',
      psychology: 'Volume creates value perception',
      category: 'content'
    },
    {
      id: 'behind-scenes',
      feature: 'Behind-the-Scenes',
      description: 'Exclusive look at creator\'s process',
      bronze: false,
      silver: 'Weekly',
      gold: 'Daily',
      psychology: 'Intimacy and authenticity',
      category: 'content'
    },
    {
      id: 'custom-content',
      feature: 'Custom Content Priority',
      description: 'Priority in custom video queue',
      bronze: 'Standard',
      silver: 'Priority',
      gold: 'VIP Express',
      psychology: 'Time value recognition',
      category: 'content'
    },
    
    // Access Features
    {
      id: 'early-access',
      feature: 'Early Access Window',
      description: 'See content before general release',
      bronze: '24 hours',
      silver: '48 hours',
      gold: '72 hours',
      psychology: 'Exclusivity gradient',
      category: 'access'
    },
    {
      id: 'live-streams',
      feature: 'Live Stream Access',
      description: 'Participate in live broadcasts',
      bronze: false,
      silver: true,
      gold: 'VIP Room',
      psychology: 'Real-time connection value',
      category: 'access'
    },
    {
      id: 'event-access',
      feature: 'Virtual Events',
      description: 'Exclusive member events',
      bronze: false,
      silver: 'Monthly',
      gold: 'All Events + VIP',
      psychology: 'Community belonging',
      category: 'access'
    },
    
    // Interaction Features
    {
      id: 'direct-messages',
      feature: 'Direct Messages',
      description: 'Send messages directly to creator',
      bronze: false,
      silver: '5/month',
      gold: 'Unlimited',
      psychology: 'Personal connection driver',
      category: 'interaction'
    },
    {
      id: 'video-calls',
      feature: '1-on-1 Video Calls',
      description: 'Personal video chat sessions',
      bronze: false,
      silver: false,
      gold: 'Quarterly',
      psychology: 'Ultimate connection point',
      category: 'interaction'
    },
    {
      id: 'comment-priority',
      feature: 'Comment Priority',
      description: 'Comments highlighted and prioritized',
      bronze: false,
      silver: 'Highlighted',
      gold: 'Pinned + Response',
      psychology: 'Recognition and visibility',
      category: 'interaction'
    },
    {
      id: 'request-fulfillment',
      feature: 'Content Requests',
      description: 'Request specific content topics',
      bronze: false,
      silver: '1/month',
      gold: '5/month',
      psychology: 'Co-creation participation',
      category: 'interaction'
    },
    
    // Perks & Benefits
    {
      id: 'custom-discount',
      feature: 'Custom Video Discount',
      description: 'Savings on personalized videos',
      bronze: '10%',
      silver: '20%',
      gold: '30%',
      psychology: 'Economic incentive',
      category: 'perks'
    },
    {
      id: 'merchandise',
      feature: 'Merchandise Access',
      description: 'Exclusive merch and discounts',
      bronze: false,
      silver: '10% off',
      gold: '25% off + Exclusive',
      psychology: 'Tangible value',
      category: 'perks'
    },
    {
      id: 'surprise-gifts',
      feature: 'Surprise Gifts',
      description: 'Unexpected bonuses and perks',
      bronze: false,
      silver: 'Occasional',
      gold: 'Monthly',
      psychology: 'Delight and retention',
      category: 'perks'
    },
    {
      id: 'birthday-special',
      feature: 'Birthday Special',
      description: 'Special birthday message/gift',
      bronze: false,
      silver: 'Message',
      gold: 'Custom Video',
      psychology: 'Personal recognition',
      category: 'perks'
    },
    
    // Status Features
    {
      id: 'badge-display',
      feature: 'Profile Badge',
      description: 'Visual status indicator',
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold VIP',
      psychology: 'Social status signaling',
      category: 'status'
    },
    {
      id: 'leaderboard',
      feature: 'Leaderboard Position',
      description: 'Ranking among supporters',
      bronze: false,
      silver: 'Visible',
      gold: 'Top Tier + Perks',
      psychology: 'Competition and recognition',
      category: 'status'
    },
    {
      id: 'shoutouts',
      feature: 'Public Shoutouts',
      description: 'Public recognition from creator',
      bronze: false,
      silver: 'Quarterly',
      gold: 'Monthly',
      psychology: 'Public validation',
      category: 'status'
    }
  ];

  // Group features by category
  const categories: ComparisonCategory[] = [
    {
      id: 'content',
      name: 'Content Access',
      icon: Sparkles,
      benefits: allFeatures.filter(f => f.category === 'content')
    },
    {
      id: 'access',
      name: 'Platform Access',
      icon: Eye,
      benefits: allFeatures.filter(f => f.category === 'access')
    },
    {
      id: 'interaction',
      name: 'Creator Interaction',
      icon: Users,
      benefits: allFeatures.filter(f => f.category === 'interaction')
    },
    {
      id: 'perks',
      name: 'Perks & Benefits',
      icon: Star,
      benefits: allFeatures.filter(f => f.category === 'perks')
    },
    {
      id: 'status',
      name: 'Status & Recognition',
      icon: Crown,
      benefits: allFeatures.filter(f => f.category === 'status')
    }
  ];

  const toggleFeatureExpansion = (featureId: string) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featureId)) {
      newExpanded.delete(featureId);
    } else {
      newExpanded.add(featureId);
    }
    setExpandedFeatures(newExpanded);
  };

  const toggleCategoryVisibility = (categoryId: string) => {
    const newHidden = new Set(hiddenCategories);
    if (newHidden.has(categoryId)) {
      newHidden.delete(categoryId);
    } else {
      newHidden.add(categoryId);
    }
    setHiddenCategories(newHidden);
  };

  const renderValue = (value: string | boolean | number, tierName: string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <div className="flex items-center justify-center">
          <Check className="h-5 w-5 text-green-600" />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <X className="h-5 w-5 text-gray-300" />
        </div>
      );
    }
    
    if (value === 'Standard') {
      return <span className="text-gray-500">{value}</span>;
    }
    
    const isHighValue = 
      (typeof value === 'string' && (value.includes('VIP') || value.includes('Unlimited') || value.includes('Daily'))) ||
      (typeof value === 'number' && tierName === 'gold');
    
    return (
      <span className={cn(
        "font-medium",
        isHighValue && highlightDifferences && "text-purple-600 font-bold"
      )}>
        {value}
      </span>
    );
  };

  const visibleFeatures = selectedCategory === 'all' 
    ? allFeatures.filter(f => !hiddenCategories.has(f.category))
    : allFeatures.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">View Mode:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={viewMode === 'detailed' ? 'default' : 'outline'}
                  onClick={() => setViewMode('detailed')}
                >
                  Detailed
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'compact' ? 'default' : 'outline'}
                  onClick={() => setViewMode('compact')}
                >
                  Compact
                </Button>
              </div>
            </div>
            
            {viewMode === 'detailed' && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {visibleFeatures.length} features shown
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Filters (Detailed View) */}
      {viewMode === 'detailed' && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isHidden = hiddenCategories.has(category.id);
            
            return (
              <Button
                key={category.id}
                size="sm"
                variant={isHidden ? 'outline' : 'default'}
                onClick={() => toggleCategoryVisibility(category.id)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.name}
                {isHidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            );
          })}
        </div>
      )}

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'detailed' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 pr-4">Feature</th>
                    <th className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <Shield className="h-5 w-5 text-orange-600 mb-1" />
                        <span>Bronze</span>
                        <span className="text-xs text-gray-500">$9.99</span>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <Star className="h-5 w-5 text-gray-600 mb-1" />
                        <span>Silver</span>
                        <span className="text-xs text-gray-500">$24.99</span>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <Crown className="h-5 w-5 text-yellow-600 mb-1" />
                        <span>Gold</span>
                        <span className="text-xs text-gray-500">$49.99</span>
                      </div>
                    </th>
                    {showPsychologyInsights && (
                      <th className="text-left py-3 pl-4">Psychology</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => {
                    if (hiddenCategories.has(category.id)) return null;
                    
                    return (
                      <React.Fragment key={category.id}>
                        <tr className="bg-gray-50">
                          <td colSpan={showPsychologyInsights ? 5 : 4} className="py-2 px-4">
                            <div className="flex items-center gap-2 font-medium">
                              <category.icon className="h-4 w-4" />
                              {category.name}
                            </div>
                          </td>
                        </tr>
                        {category.benefits.map((benefit) => {
                          const isExpanded = expandedFeatures.has(benefit.id);
                          
                          return (
                            <React.Fragment key={benefit.id}>
                              <tr 
                                className="border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                  toggleFeatureExpansion(benefit.id);
                                  onFeatureClick?.(benefit);
                                }}
                              >
                                <td className="py-3 pr-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{benefit.feature}</span>
                                    {benefit.description && (
                                      <Info className="h-3 w-3 text-gray-400" />
                                    )}
                                    {isExpanded ? (
                                      <ChevronUp className="h-3 w-3 text-gray-400 ml-auto" />
                                    ) : (
                                      <ChevronDown className="h-3 w-3 text-gray-400 ml-auto" />
                                    )}
                                  </div>
                                </td>
                                <td className="text-center py-3 px-4">
                                  {renderValue(benefit.bronze, 'bronze')}
                                </td>
                                <td className="text-center py-3 px-4">
                                  {renderValue(benefit.silver, 'silver')}
                                </td>
                                <td className="text-center py-3 px-4">
                                  {renderValue(benefit.gold, 'gold')}
                                </td>
                                {showPsychologyInsights && (
                                  <td className="py-3 pl-4">
                                    <span className="text-sm text-gray-600">
                                      {benefit.psychology}
                                    </span>
                                  </td>
                                )}
                              </tr>
                              <AnimatePresence>
                                {isExpanded && benefit.description && (
                                  <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                  >
                                    <td colSpan={showPsychologyInsights ? 5 : 4} className="bg-blue-50 px-6 py-3">
                                      <p className="text-sm text-gray-700">{benefit.description}</p>
                                    </td>
                                  </motion.tr>
                                )}
                              </AnimatePresence>
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // Compact View
            <div className="grid md:grid-cols-3 gap-4">
              {['bronze', 'silver', 'gold'].map((tierName) => {
                const Icon = tierName === 'bronze' ? Shield : tierName === 'silver' ? Star : Crown;
                const color = tierName === 'bronze' ? 'text-orange-600' : tierName === 'silver' ? 'text-gray-600' : 'text-yellow-600';
                
                return (
                  <div key={tierName} className="space-y-3">
                    <div className="flex items-center gap-2 font-semibold capitalize">
                      <Icon className={cn("h-5 w-5", color)} />
                      {tierName}
                    </div>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="text-sm">
                          <div className="font-medium text-gray-700 mb-1">{category.name}</div>
                          <div className="space-y-1">
                            {category.benefits.slice(0, 2).map((benefit) => {
                              const value = benefit[tierName as keyof TierBenefit];
                              if (typeof value === 'boolean' && !value) return null;
                              
                              return (
                                <div key={benefit.id} className="flex items-center gap-1 text-xs">
                                  <Check className="h-3 w-3 text-green-600" />
                                  <span className="text-gray-600">{benefit.feature}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Value Comparison Summary */}
      {showPsychologyInsights && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Value Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">Bronze</div>
                <div className="text-sm text-gray-600 mt-1">Entry Point</div>
                <div className="mt-2 space-y-1 text-xs">
                  <div>✓ 5 core features</div>
                  <div>✓ Basic access</div>
                  <div>✓ Community entry</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">Silver</div>
                <div className="text-sm text-gray-600 mt-1">Sweet Spot</div>
                <div className="mt-2 space-y-1 text-xs">
                  <div>✓ 12 features</div>
                  <div>✓ Live interaction</div>
                  <div>✓ 2.5x value</div>
                </div>
                <Badge className="mt-2 bg-purple-100 text-purple-700">Best Value</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">Gold</div>
                <div className="text-sm text-gray-600 mt-1">Premium Experience</div>
                <div className="mt-2 space-y-1 text-xs">
                  <div>✓ All 17 features</div>
                  <div>✓ VIP treatment</div>
                  <div>✓ 5x value</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}