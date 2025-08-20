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
  Lock,
  Unlock,
  Eye,
  Calendar,
  Award,
  Sparkles,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BenefitCategory {
  name: string;
  icon: React.ElementType;
  color: string;
  bronzeCount: number;
  silverCount: number;
  goldCount: number;
}

interface TierValue {
  tier: string;
  features: number;
  value: number;
  roi: number;
  satisfaction: number;
}

interface TierBenefitsVisualizationProps {
  selectedTier?: string;
  onTierSelect?: (tier: string) => void;
  showValueAnalysis?: boolean;
  showUpgradePaths?: boolean;
}

export function TierBenefitsVisualization({
  selectedTier = 'silver',
  onTierSelect,
  showValueAnalysis = true,
  showUpgradePaths = true
}: TierBenefitsVisualizationProps) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'flow' | 'pyramid'>('grid');
  const [highlightCategory, setHighlightCategory] = React.useState<string | null>(null);

  // Benefit categories breakdown
  const benefitCategories: BenefitCategory[] = [
    {
      name: 'Content',
      icon: Video,
      color: 'bg-purple-100 text-purple-600',
      bronzeCount: 2,
      silverCount: 5,
      goldCount: 8
    },
    {
      name: 'Access',
      icon: Unlock,
      color: 'bg-blue-100 text-blue-600',
      bronzeCount: 1,
      silverCount: 3,
      goldCount: 6
    },
    {
      name: 'Interaction',
      icon: MessageSquare,
      color: 'bg-green-100 text-green-600',
      bronzeCount: 0,
      silverCount: 3,
      goldCount: 7
    },
    {
      name: 'Perks',
      icon: Gift,
      color: 'bg-yellow-100 text-yellow-600',
      bronzeCount: 1,
      silverCount: 4,
      goldCount: 8
    },
    {
      name: 'Status',
      icon: Crown,
      color: 'bg-pink-100 text-pink-600',
      bronzeCount: 1,
      silverCount: 2,
      goldCount: 5
    }
  ];

  // Tier value analysis
  const tierValues: TierValue[] = [
    {
      tier: 'bronze',
      features: 5,
      value: 100,
      roi: 180,
      satisfaction: 62
    },
    {
      tier: 'silver',
      features: 17,
      value: 250,
      roi: 320,
      satisfaction: 78
    },
    {
      tier: 'gold',
      features: 34,
      value: 500,
      roi: 450,
      satisfaction: 92
    }
  ];

  // Visual benefit grid
  const benefitGrid = [
    // Bronze benefits (5)
    { tier: 'bronze', category: 'content', name: 'Monthly Video', icon: Video },
    { tier: 'bronze', category: 'content', name: 'Early Access', icon: Clock },
    { tier: 'bronze', category: 'access', name: 'Community', icon: Users },
    { tier: 'bronze', category: 'perks', name: '10% Discount', icon: Percent },
    { tier: 'bronze', category: 'status', name: 'Bronze Badge', icon: Shield },
    
    // Silver additional benefits (12 more)
    { tier: 'silver', category: 'content', name: 'Weekly Videos', icon: Video },
    { tier: 'silver', category: 'content', name: 'Behind Scenes', icon: Eye },
    { tier: 'silver', category: 'content', name: 'Extended Access', icon: Clock },
    { tier: 'silver', category: 'access', name: 'Live Streams', icon: Zap },
    { tier: 'silver', category: 'access', name: 'Monthly Events', icon: Calendar },
    { tier: 'silver', category: 'interaction', name: 'Direct Messages', icon: MessageSquare },
    { tier: 'silver', category: 'interaction', name: 'Comment Priority', icon: Star },
    { tier: 'silver', category: 'interaction', name: 'Content Requests', icon: Heart },
    { tier: 'silver', category: 'perks', name: '20% Discount', icon: Percent },
    { tier: 'silver', category: 'perks', name: 'Merchandise', icon: Gift },
    { tier: 'silver', category: 'perks', name: 'Birthday Message', icon: Award },
    { tier: 'silver', category: 'status', name: 'Silver Badge', icon: Star },
    
    // Gold additional benefits (17 more)
    { tier: 'gold', category: 'content', name: 'Daily Videos', icon: Video },
    { tier: 'gold', category: 'content', name: 'Exclusive Series', icon: Trophy },
    { tier: 'gold', category: 'content', name: 'VIP Archives', icon: Lock },
    { tier: 'gold', category: 'access', name: 'VIP Live Room', icon: Crown },
    { tier: 'gold', category: 'access', name: 'All Events', icon: Calendar },
    { tier: 'gold', category: 'access', name: 'Priority Queue', icon: Zap },
    { tier: 'gold', category: 'interaction', name: 'Video Calls', icon: Users },
    { tier: 'gold', category: 'interaction', name: 'Unlimited DMs', icon: MessageSquare },
    { tier: 'gold', category: 'interaction', name: 'Custom Shoutouts', icon: Heart },
    { tier: 'gold', category: 'interaction', name: 'Co-creation', icon: Sparkles },
    { tier: 'gold', category: 'perks', name: '30% Discount', icon: Percent },
    { tier: 'gold', category: 'perks', name: 'Exclusive Merch', icon: Gift },
    { tier: 'gold', category: 'perks', name: 'Surprise Gifts', icon: Gift },
    { tier: 'gold', category: 'perks', name: 'Custom Birthday', icon: Award },
    { tier: 'gold', category: 'status', name: 'Gold VIP Badge', icon: Crown },
    { tier: 'gold', category: 'status', name: 'Leaderboard', icon: Trophy },
    { tier: 'gold', category: 'status', name: 'Public Recognition', icon: Star }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return Shield;
      case 'silver': return Star;
      case 'gold': return Crown;
      default: return Star;
    }
  };

  const getCategoryBenefits = (tier: string, category: string) => {
    return benefitGrid.filter(b => {
      if (tier === 'bronze') return b.tier === 'bronze' && b.category === category;
      if (tier === 'silver') return (b.tier === 'bronze' || b.tier === 'silver') && b.category === category;
      if (tier === 'gold') return b.category === category;
    });
  };

  const renderGridView = () => (
    <div className="grid md:grid-cols-3 gap-6">
      {['bronze', 'silver', 'gold'].map((tier) => {
        const Icon = getTierIcon(tier);
        const isSelected = selectedTier === tier;
        const benefits = benefitGrid.filter(b => {
          if (tier === 'bronze') return b.tier === 'bronze';
          if (tier === 'silver') return b.tier === 'bronze' || b.tier === 'silver';
          return true; // gold gets all
        });
        
        return (
          <Card
            key={tier}
            className={cn(
              "cursor-pointer transition-all",
              isSelected && "ring-2 ring-purple-500 shadow-lg"
            )}
            onClick={() => onTierSelect?.(tier)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full bg-gradient-to-r flex items-center justify-center",
                  getTierColor(tier)
                )}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="capitalize">{tier}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Summary */}
                <div className="text-center py-3 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold">{benefits.length}</div>
                  <div className="text-sm text-gray-600">Total Benefits</div>
                </div>

                {/* Category breakdown */}
                <div className="space-y-2">
                  {benefitCategories.map((category) => {
                    const categoryBenefits = getCategoryBenefits(tier, category.name.toLowerCase());
                    const CategoryIcon = category.icon;
                    
                    return (
                      <div
                        key={category.name}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg transition-all",
                          highlightCategory === category.name.toLowerCase() && "bg-purple-50",
                          categoryBenefits.length === 0 && "opacity-30"
                        )}
                        onMouseEnter={() => setHighlightCategory(category.name.toLowerCase())}
                        onMouseLeave={() => setHighlightCategory(null)}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", category.color)}>
                            <CategoryIcon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <Badge variant="secondary">{categoryBenefits.length}</Badge>
                      </div>
                    );
                  })}
                </div>

                {/* Value indicator */}
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Value Score</span>
                    <span className="text-xs font-bold">
                      {tier === 'bronze' ? '100' : tier === 'silver' ? '250' : '500'}
                    </span>
                  </div>
                  <Progress 
                    value={tier === 'bronze' ? 20 : tier === 'silver' ? 50 : 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderFlowView = () => (
    <div className="space-y-6">
      {benefitCategories.map((category) => {
        const CategoryIcon = category.icon;
        const isHighlighted = highlightCategory === category.name.toLowerCase();
        
        return (
          <Card 
            key={category.name}
            className={cn(
              "transition-all",
              isHighlighted && "shadow-lg border-purple-500"
            )}
            onMouseEnter={() => setHighlightCategory(category.name.toLowerCase())}
            onMouseLeave={() => setHighlightCategory(null)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", category.color)}>
                  <CategoryIcon className="h-5 w-5" />
                </div>
                {category.name} Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {/* Bronze */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Bronze</span>
                  </div>
                  <div className="space-y-1">
                    {getCategoryBenefits('bronze', category.name.toLowerCase()).map((benefit, idx) => {
                      const BenefitIcon = benefit.icon;
                      return (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <BenefitIcon className="h-3 w-3 text-gray-500" />
                          <span>{benefit.name}</span>
                        </div>
                      );
                    })}
                    {category.bronzeCount === 0 && (
                      <span className="text-xs text-gray-400">Not available</span>
                    )}
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-gray-400" />

                {/* Silver */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Silver</span>
                  </div>
                  <div className="space-y-1">
                    {getCategoryBenefits('silver', category.name.toLowerCase())
                      .filter(b => b.tier === 'silver')
                      .map((benefit, idx) => {
                        const BenefitIcon = benefit.icon;
                        return (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <BenefitIcon className="h-3 w-3 text-gray-500" />
                            <span>{benefit.name}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-gray-400" />

                {/* Gold */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Gold</span>
                  </div>
                  <div className="space-y-1">
                    {getCategoryBenefits('gold', category.name.toLowerCase())
                      .filter(b => b.tier === 'gold')
                      .map((benefit, idx) => {
                        const BenefitIcon = benefit.icon;
                        return (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <BenefitIcon className="h-3 w-3 text-gray-500" />
                            <span>{benefit.name}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderPyramidView = () => (
    <div className="flex justify-center">
      <div className="space-y-4">
        {/* Gold - Top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <Card className="w-64 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300">
            <CardContent className="p-4 text-center">
              <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-bold text-lg mb-1">Gold VIP</h3>
              <div className="text-2xl font-bold text-yellow-600 mb-2">34 Benefits</div>
              <div className="text-xs text-gray-600">Ultimate Experience</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Silver - Middle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <Card className="w-80 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <h3 className="font-bold text-lg mb-1">Silver</h3>
              <div className="text-2xl font-bold text-gray-600 mb-2">17 Benefits</div>
              <div className="text-xs text-gray-600">Best Value</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bronze - Base */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Card className="w-96 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-bold text-lg mb-1">Bronze</h3>
              <div className="text-2xl font-bold text-orange-600 mb-2">5 Benefits</div>
              <div className="text-xs text-gray-600">Entry Level</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Visualization Mode:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'flow' ? 'default' : 'outline'}
                onClick={() => setViewMode('flow')}
              >
                <Activity className="h-4 w-4 mr-2" />
                Flow
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'pyramid' ? 'default' : 'outline'}
                onClick={() => setViewMode('pyramid')}
              >
                <PieChart className="h-4 w-4 mr-2" />
                Pyramid
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualization */}
      {viewMode === 'grid' && renderGridView()}
      {viewMode === 'flow' && renderFlowView()}
      {viewMode === 'pyramid' && renderPyramidView()}

      {/* Value Analysis */}
      {showValueAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Value Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tierValues.map((tier) => {
                const Icon = getTierIcon(tier.tier);
                
                return (
                  <div key={tier.tier} className="flex items-center gap-4">
                    <div className="w-20">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium capitalize">{tier.tier}</span>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-gray-500">Features</div>
                        <div className="font-bold">{tier.features}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Value Index</div>
                        <div className="font-bold">{tier.value}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">ROI</div>
                        <div className="font-bold text-green-600">{tier.roi}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Satisfaction</div>
                        <Progress value={tier.satisfaction} className="mt-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Paths */}
      {showUpgradePaths && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle>Natural Upgrade Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-orange-600" />
                  Bronze → Silver
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>+12 new benefits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Live interaction unlocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>2.5x value for 2.5x price</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-600" />
                  Silver → Gold
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>+17 premium benefits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>1-on-1 video calls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>VIP status & recognition</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}