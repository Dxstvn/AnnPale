'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Shield,
  Star,
  Crown,
  Check,
  X,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Video,
  MessageSquare,
  Users,
  Heart,
  Zap,
  Lock,
  Unlock,
  TrendingUp,
  Calculator,
  Eye,
  EyeOff,
  Filter,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TierFeature {
  id: string;
  name: string;
  category: 'content' | 'communication' | 'support' | 'exclusive' | 'limits';
  description: string;
  bronze: boolean | string | number;
  silver: boolean | string | number;
  gold: boolean | string | number;
  highlight?: boolean;
  icon?: React.ElementType;
}

interface TierInfo {
  id: string;
  name: string;
  price: number;
  annualPrice?: number;
  icon: React.ElementType;
  color: string;
  popular?: boolean;
  description: string;
  bestFor: string[];
}

interface ComparisonFilter {
  categories: string[];
  showOnlyDifferences: boolean;
  highlightUpgrades: boolean;
}

interface TierComparisonToolProps {
  currentTier?: string;
  tiers?: TierInfo[];
  features?: TierFeature[];
  onTierSelect?: (tierId: string) => void;
  onUpgradeClick?: (fromTier: string, toTier: string) => void;
  onDowngradeClick?: (fromTier: string, toTier: string) => void;
  showPricing?: boolean;
  showAnnualPricing?: boolean;
}

export function TierComparisonTool({
  currentTier = 'bronze',
  tiers = [],
  features = [],
  onTierSelect,
  onUpgradeClick,
  onDowngradeClick,
  showPricing = true,
  showAnnualPricing = true
}: TierComparisonToolProps) {
  const [selectedTiers, setSelectedTiers] = React.useState<string[]>(['bronze', 'silver', 'gold']);
  const [filter, setFilter] = React.useState<ComparisonFilter>({
    categories: ['content', 'communication', 'support', 'exclusive', 'limits'],
    showOnlyDifferences: false,
    highlightUpgrades: true
  });
  const [annualBilling, setAnnualBilling] = React.useState(false);
  const [expandedFeature, setExpandedFeature] = React.useState<string | null>(null);

  // Default tier information
  const defaultTiers: TierInfo[] = tiers.length > 0 ? tiers : [
    {
      id: 'bronze',
      name: 'Bronze',
      price: 9.99,
      annualPrice: 99.99,
      icon: Shield,
      color: 'from-amber-400 to-amber-600',
      description: 'Perfect for getting started',
      bestFor: ['Casual viewers', 'Budget-conscious fans', 'First-time subscribers']
    },
    {
      id: 'silver',
      name: 'Silver',
      price: 19.99,
      annualPrice: 199.99,
      icon: Star,
      color: 'from-slate-400 to-slate-600',
      popular: true,
      description: 'Most popular choice for fans',
      bestFor: ['Regular viewers', 'Active community members', 'Content enthusiasts']
    },
    {
      id: 'gold',
      name: 'Gold',
      price: 39.99,
      annualPrice: 399.99,
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      description: 'Ultimate fan experience',
      bestFor: ['Super fans', 'VIP experience seekers', 'Premium content lovers']
    }
  ];

  // Default feature comparison
  const defaultFeatures: TierFeature[] = features.length > 0 ? features : [
    {
      id: 'video_limit',
      name: 'Monthly Video Access',
      category: 'limits',
      description: 'Number of videos you can watch each month',
      bronze: '20 videos',
      silver: 'Unlimited',
      gold: 'Unlimited',
      icon: Video,
      highlight: true
    },
    {
      id: 'message_limit',
      name: 'Creator Messages',
      category: 'limits',
      description: 'Monthly limit for receiving creator messages',
      bronze: '50 messages',
      silver: 'Unlimited',
      gold: 'Unlimited',
      icon: MessageSquare
    },
    {
      id: 'live_events',
      name: 'Live Event Access',
      category: 'content',
      description: 'Access to live streaming events',
      bronze: '5 per month',
      silver: 'Unlimited',
      gold: 'Unlimited + VIP',
      icon: Users
    },
    {
      id: 'direct_messaging',
      name: 'Direct Messaging',
      category: 'communication',
      description: 'Send private messages to creators',
      bronze: false,
      silver: true,
      gold: true,
      icon: MessageSquare,
      highlight: true
    },
    {
      id: 'exclusive_content',
      name: 'Exclusive Content',
      category: 'exclusive',
      description: 'Access to premium subscriber-only content',
      bronze: false,
      silver: true,
      gold: true,
      icon: Star
    },
    {
      id: 'video_calls',
      name: 'Monthly Video Calls',
      category: 'communication',
      description: 'One-on-one video calls with creators',
      bronze: false,
      silver: false,
      gold: '1 per month',
      icon: Video,
      highlight: true
    },
    {
      id: 'custom_requests',
      name: 'Custom Content Requests',
      category: 'exclusive',
      description: 'Request personalized content from creators',
      bronze: false,
      silver: false,
      gold: true,
      icon: Heart
    },
    {
      id: 'priority_support',
      name: 'Priority Support',
      category: 'support',
      description: 'Faster response times for customer support',
      bronze: 'Standard',
      silver: 'Priority',
      gold: 'VIP',
      icon: Zap
    },
    {
      id: 'community_access',
      name: 'Community Features',
      category: 'content',
      description: 'Access to community forums and discussions',
      bronze: 'Basic',
      silver: 'Full Access',
      gold: 'VIP Lounge',
      icon: Users
    },
    {
      id: 'merchandise',
      name: 'Exclusive Merchandise',
      category: 'exclusive',
      description: 'Access to subscriber-only merchandise',
      bronze: false,
      silver: false,
      gold: 'Free shipping',
      icon: Heart
    }
  ];

  // Filter features based on current filter settings
  const filteredFeatures = defaultFeatures.filter(feature => {
    // Category filter
    if (!filter.categories.includes(feature.category)) return false;
    
    // Show only differences filter
    if (filter.showOnlyDifferences) {
      const values = [feature.bronze, feature.silver, feature.gold];
      const uniqueValues = new Set(values.map(v => String(v)));
      return uniqueValues.size > 1;
    }
    
    return true;
  });

  // Get tier by ID
  const getTier = (tierId: string) => defaultTiers.find(tier => tier.id === tierId);

  // Check if feature value indicates upgrade
  const isUpgrade = (fromValue: any, toValue: any) => {
    if (typeof fromValue === 'boolean' && typeof toValue === 'boolean') {
      return !fromValue && toValue;
    }
    if (typeof fromValue === 'string' && typeof toValue === 'string') {
      // Special cases for string comparisons
      if (fromValue.includes('Unlimited') || toValue.includes('Unlimited')) {
        return !fromValue.includes('Unlimited') && toValue.includes('Unlimited');
      }
      if (fromValue.includes('VIP') || toValue.includes('VIP')) {
        return !fromValue.includes('VIP') && toValue.includes('VIP');
      }
    }
    return false;
  };

  // Render feature value
  const renderFeatureValue = (value: any, highlight: boolean = false) => {
    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center justify-center">
          {value ? (
            <Check className={cn("h-5 w-5", highlight ? "text-green-600" : "text-green-500")} />
          ) : (
            <X className="h-5 w-5 text-gray-400" />
          )}
        </div>
      );
    }
    
    return (
      <span className={cn(
        "text-sm font-medium text-center",
        highlight && "text-green-600"
      )}>
        {String(value)}
      </span>
    );
  };

  // Calculate annual savings
  const getAnnualSavings = (tier: TierInfo) => {
    if (!tier.annualPrice) return 0;
    const monthlyTotal = tier.price * 12;
    return monthlyTotal - tier.annualPrice;
  };

  // Handle tier toggle
  const handleTierToggle = (tierId: string) => {
    setSelectedTiers(prev => {
      if (prev.includes(tierId)) {
        return prev.filter(id => id !== tierId);
      } else {
        return [...prev, tierId];
      }
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilter({
      categories: ['content', 'communication', 'support', 'exclusive', 'limits'],
      showOnlyDifferences: false,
      highlightUpgrades: true
    });
    setSelectedTiers(['bronze', 'silver', 'gold']);
  };

  const categories = [
    { id: 'content', label: 'Content', icon: Video },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'support', label: 'Support', icon: Heart },
    { id: 'exclusive', label: 'Exclusive', icon: Star },
    { id: 'limits', label: 'Limits', icon: Lock }
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Tier Comparison Tool
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={resetFilters}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Billing Toggle */}
          {showAnnualPricing && (
            <div className="flex items-center justify-center gap-3 p-3 bg-green-50 rounded-lg">
              <span className={cn("text-sm", !annualBilling && "font-medium")}>Monthly</span>
              <Switch
                checked={annualBilling}
                onCheckedChange={setAnnualBilling}
              />
              <span className={cn("text-sm", annualBilling && "font-medium")}>
                Annual
                <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                  Save up to 17%
                </Badge>
              </span>
            </div>
          )}

          {/* Tier Selection */}
          <div>
            <p className="text-sm font-medium mb-2">Compare Tiers:</p>
            <div className="flex gap-2">
              {defaultTiers.map(tier => (
                <Button
                  key={tier.id}
                  size="sm"
                  variant={selectedTiers.includes(tier.id) ? 'default' : 'outline'}
                  onClick={() => handleTierToggle(tier.id)}
                  className="flex items-center gap-2"
                >
                  <tier.icon className="h-4 w-4" />
                  {tier.name}
                  {tier.id === currentTier && (
                    <Badge variant="secondary" className="text-xs">Current</Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Filter Options */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Filter by Category:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  const isSelected = filter.categories.includes(category.id);
                  
                  return (
                    <Button
                      key={category.id}
                      size="sm"
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => setFilter(prev => ({
                        ...prev,
                        categories: isSelected 
                          ? prev.categories.filter(c => c !== category.id)
                          : [...prev.categories, category.id]
                      }))}
                      className="flex items-center gap-1"
                    >
                      <Icon className="h-3 w-3" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={filter.showOnlyDifferences}
                  onCheckedChange={(checked) => setFilter(prev => ({
                    ...prev,
                    showOnlyDifferences: checked
                  }))}
                />
                <span className="text-sm">Show only differences</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={filter.highlightUpgrades}
                  onCheckedChange={(checked) => setFilter(prev => ({
                    ...prev,
                    highlightUpgrades: checked
                  }))}
                />
                <span className="text-sm">Highlight upgrades</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      {showPricing && (
        <div className="grid md:grid-cols-3 gap-4">
          {defaultTiers
            .filter(tier => selectedTiers.includes(tier.id))
            .map(tier => {
              const Icon = tier.icon;
              const isCurrentTier = tier.id === currentTier;
              const price = annualBilling ? tier.annualPrice : tier.price;
              const annualSavings = getAnnualSavings(tier);

              return (
                <Card key={tier.id} className={cn(
                  "transition-all",
                  isCurrentTier && "border-blue-500 bg-blue-50",
                  tier.popular && "border-green-500 ring-1 ring-green-200"
                )}>
                  <CardHeader className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className={cn(
                        "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                        tier.color
                      )}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="flex items-center justify-center gap-2">
                      {tier.name}
                      {tier.popular && (
                        <Badge className="bg-green-100 text-green-700">Popular</Badge>
                      )}
                      {isCurrentTier && (
                        <Badge className="bg-blue-100 text-blue-700">Current</Badge>
                      )}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{tier.description}</p>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div>
                      <div className="text-3xl font-bold">
                        ${price?.toFixed(2)}
                        <span className="text-lg text-gray-600">
                          /{annualBilling ? 'year' : 'month'}
                        </span>
                      </div>
                      {annualBilling && annualSavings > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                          Save ${annualSavings.toFixed(2)}/year
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Best for:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {tier.bestFor.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    {!isCurrentTier && (
                      <div className="flex gap-2">
                        {getTierOrder(tier.id) > getTierOrder(currentTier) ? (
                          <Button 
                            className="flex-1"
                            onClick={() => onUpgradeClick?.(currentTier, tier.id)}
                          >
                            <ArrowUp className="h-4 w-4 mr-1" />
                            Upgrade
                          </Button>
                        ) : (
                          <Button 
                            variant="outline"
                            className="flex-1"
                            onClick={() => onDowngradeClick?.(currentTier, tier.id)}
                          >
                            <ArrowDown className="h-4 w-4 mr-1" />
                            Downgrade
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      {/* Feature Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Feature Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Feature</th>
                  {selectedTiers.map(tierId => {
                    const tier = getTier(tierId);
                    if (!tier) return null;
                    const Icon = tier.icon;
                    
                    return (
                      <th key={tierId} className="text-center p-3 min-w-[120px]">
                        <div className="flex flex-col items-center gap-2">
                          <div className={cn(
                            "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center",
                            tier.color
                          )}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium">{tier.name}</span>
                          {tier.id === currentTier && (
                            <Badge variant="secondary" className="text-xs">Current</Badge>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredFeatures.map(feature => {
                  const Icon = feature.icon;
                  const isExpanded = expandedFeature === feature.id;
                  
                  return (
                    <React.Fragment key={feature.id}>
                      <tr 
                        className={cn(
                          "border-b hover:bg-gray-50 cursor-pointer transition-all",
                          feature.highlight && "bg-yellow-50"
                        )}
                        onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {Icon && (
                              <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                                <Icon className="h-4 w-4 text-gray-600" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{feature.name}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {feature.category}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        {selectedTiers.map(tierId => {
                          const featureValue = feature[tierId as keyof TierFeature];
                          const shouldHighlight = filter.highlightUpgrades && 
                            tierId !== currentTier && 
                            isUpgrade(feature[currentTier as keyof TierFeature], featureValue);
                          
                          return (
                            <td key={tierId} className="p-3 text-center">
                              {renderFeatureValue(featureValue, shouldHighlight)}
                            </td>
                          );
                        })}
                      </tr>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <td colSpan={selectedTiers.length + 1} className="p-3 bg-gray-50">
                              <p className="text-sm text-gray-600">{feature.description}</p>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Comparison Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{filteredFeatures.length}</p>
              <p className="text-sm text-gray-600">Features Compared</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{selectedTiers.length}</p>
              <p className="text-sm text-gray-600">Tiers Selected</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {filteredFeatures.filter(f => f.highlight).length}
              </p>
              <p className="text-sm text-gray-600">Key Features</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Helper function to get tier order
  function getTierOrder(tierId: string) {
    const order = { bronze: 0, silver: 1, gold: 2 };
    return order[tierId as keyof typeof order] || 0;
  }
}