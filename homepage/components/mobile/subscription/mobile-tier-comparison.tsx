'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown,
  Star,
  Users,
  Check,
  X,
  Zap,
  Heart,
  MessageSquare,
  Video,
  Headphones,
  Shield,
  Clock,
  Eye,
  Gift,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  Lock,
  Unlock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TierFeature {
  id: string;
  name: string;
  description: string;
  free: boolean | string;
  bronze: boolean | string;
  silver: boolean | string;
  gold: boolean | string;
  icon?: React.ElementType;
  category: 'core' | 'content' | 'support' | 'exclusive';
}

interface TierPricing {
  tier: 'free' | 'bronze' | 'silver' | 'gold';
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  period: 'month' | 'year';
  popular?: boolean;
  trial?: {
    days: number;
    description: string;
  };
  savings?: number;
  icon: React.ElementType;
  color: string;
  gradient: string;
  highlights: string[];
  cta: string;
}

interface MobileTierComparisonProps {
  currentTier?: 'free' | 'bronze' | 'silver' | 'gold';
  showPricing?: boolean;
  onSelectTier?: (tier: string) => void;
  onUpgrade?: (tier: string) => void;
  platform?: 'ios' | 'android' | 'web';
}

export function MobileTierComparison({
  currentTier = 'free',
  showPricing = true,
  onSelectTier,
  onUpgrade,
  platform = 'web'
}: MobileTierComparisonProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'core' | 'content' | 'support' | 'exclusive'>('all');
  const [compareMode, setCompareMode] = React.useState<'pricing' | 'features'>('pricing');

  // Tier pricing information
  const tierPricing: TierPricing[] = [
    {
      tier: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      period: 'month',
      icon: Users,
      color: 'text-gray-600',
      gradient: 'from-gray-400 to-gray-600',
      highlights: ['Basic access', 'Try before you buy'],
      cta: 'Current Plan'
    },
    {
      tier: 'bronze',
      name: 'Bronze',
      price: 9.99,
      currency: 'USD',
      period: 'month',
      trial: {
        days: 7,
        description: '7-day free trial'
      },
      icon: Star,
      color: 'text-amber-600',
      gradient: 'from-amber-400 to-amber-600',
      highlights: ['Great for casual users', 'Essential features'],
      cta: 'Start Free Trial'
    },
    {
      tier: 'silver',
      name: 'Silver',
      price: 19.99,
      originalPrice: 24.99,
      currency: 'USD',
      period: 'month',
      popular: true,
      trial: {
        days: 14,
        description: '14-day free trial'
      },
      savings: 20,
      icon: Crown,
      color: 'text-slate-600',
      gradient: 'from-slate-400 to-slate-600',
      highlights: ['Most popular choice', 'Best value overall', 'Unlimited access'],
      cta: 'Start Free Trial'
    },
    {
      tier: 'gold',
      name: 'Gold',
      price: 39.99,
      currency: 'USD',
      period: 'month',
      trial: {
        days: 30,
        description: '30-day free trial'
      },
      icon: Crown,
      color: 'text-yellow-600',
      gradient: 'from-yellow-400 to-yellow-600',
      highlights: ['Ultimate experience', 'VIP treatment', 'Exclusive perks'],
      cta: 'Start Free Trial'
    }
  ];

  // Feature comparison data
  const features: TierFeature[] = [
    // Core Features
    {
      id: 'video_messages',
      name: 'Video Messages',
      description: 'Personalized video messages from creators',
      free: '1 per month',
      bronze: '5 per month',
      silver: true,
      gold: true,
      icon: Video,
      category: 'core'
    },
    {
      id: 'hd_quality',
      name: 'HD Video Quality',
      description: 'High-definition video streaming',
      free: false,
      bronze: true,
      silver: true,
      gold: true,
      icon: Eye,
      category: 'core'
    },
    {
      id: 'mobile_app',
      name: 'Mobile App Access',
      description: 'Full access to mobile applications',
      free: true,
      bronze: true,
      silver: true,
      gold: true,
      icon: Users,
      category: 'core'
    },
    
    // Content Features
    {
      id: 'exclusive_content',
      name: 'Exclusive Content',
      description: 'Behind-the-scenes and exclusive videos',
      free: false,
      bronze: 'Limited',
      silver: true,
      gold: true,
      icon: Sparkles,
      category: 'content'
    },
    {
      id: 'early_access',
      name: 'Early Access',
      description: 'Get new features and content first',
      free: false,
      bronze: false,
      silver: '24 hours early',
      gold: '1 week early',
      icon: Clock,
      category: 'content'
    },
    {
      id: 'live_events',
      name: 'Live Events',
      description: 'Access to live streaming events',
      free: false,
      bronze: false,
      silver: 'Monthly events',
      gold: 'Weekly events',
      icon: Video,
      category: 'content'
    },
    {
      id: 'downloadable_content',
      name: 'Offline Downloads',
      description: 'Download content for offline viewing',
      free: false,
      bronze: false,
      silver: true,
      gold: true,
      icon: Users,
      category: 'content'
    },
    
    // Support Features
    {
      id: 'customer_support',
      name: 'Customer Support',
      description: 'Help when you need it',
      free: 'Community',
      bronze: 'Email support',
      silver: 'Priority email',
      gold: 'VIP phone support',
      icon: Headphones,
      category: 'support'
    },
    {
      id: 'response_time',
      name: 'Support Response',
      description: 'How quickly we respond to your questions',
      free: '3-5 days',
      bronze: '24-48 hours',
      silver: '12-24 hours',
      gold: '1-4 hours',
      icon: Clock,
      category: 'support'
    },
    
    // Exclusive Features
    {
      id: 'creator_meetups',
      name: 'Creator Meetups',
      description: 'Exclusive in-person events',
      free: false,
      bronze: false,
      silver: false,
      gold: true,
      icon: Users,
      category: 'exclusive'
    },
    {
      id: 'personalized_thank_you',
      name: 'Personal Thank You',
      description: 'Personalized thank you video from creators',
      free: false,
      bronze: false,
      silver: false,
      gold: true,
      icon: Heart,
      category: 'exclusive'
    },
    {
      id: 'gold_badge',
      name: 'Gold Member Badge',
      description: 'Special recognition in community',
      free: false,
      bronze: false,
      silver: false,
      gold: true,
      icon: Award,
      category: 'exclusive'
    }
  ];

  // Filter features by category
  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  // Get feature value display
  const getFeatureValue = (feature: TierFeature, tier: 'free' | 'bronze' | 'silver' | 'gold') => {
    const value = feature[tier];
    
    if (value === true) {
      return <Check className="h-4 w-4 text-green-600" />;
    }
    
    if (value === false) {
      return <X className="h-4 w-4 text-gray-400" />;
    }
    
    if (typeof value === 'string') {
      return <span className="text-xs text-gray-700">{value}</span>;
    }
    
    return <X className="h-4 w-4 text-gray-400" />;
  };

  // Get tier color
  const getTierColor = (tier: string) => {
    const tierData = tierPricing.find(t => t.tier === tier);
    return tierData?.color || 'text-gray-600';
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Toggle between pricing and features */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setCompareMode('pricing')}
          className={cn(
            "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors",
            compareMode === 'pricing' ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
          )}
        >
          Pricing
        </button>
        <button
          onClick={() => setCompareMode('features')}
          className={cn(
            "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors",
            compareMode === 'features' ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
          )}
        >
          Features
        </button>
      </div>

      {compareMode === 'pricing' && (
        <div className="space-y-4">
          {/* Pricing Cards */}
          {tierPricing.map((tier, index) => {
            const Icon = tier.icon;
            const isCurrentTier = tier.tier === currentTier;
            const isUpgrade = tierPricing.findIndex(t => t.tier === currentTier) < tierPricing.findIndex(t => t.tier === tier.tier);

            return (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "relative overflow-hidden",
                  tier.popular && "border-purple-500 ring-2 ring-purple-200",
                  isCurrentTier && "border-green-500 ring-2 ring-green-200"
                )}>
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  {isCurrentTier && (
                    <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-medium">
                      Current Plan
                    </div>
                  )}

                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                        tier.gradient
                      )}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{tier.name}</h3>
                        <div className="flex items-baseline gap-2">
                          {tier.price === 0 ? (
                            <span className="text-xl font-bold">Free</span>
                          ) : (
                            <>
                              <span className="text-2xl font-bold">${tier.price}</span>
                              {tier.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${tier.originalPrice}
                                </span>
                              )}
                              <span className="text-sm text-gray-600">/{tier.period}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {tier.savings && (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          Save {tier.savings}%
                        </Badge>
                      )}
                    </div>

                    {tier.trial && (
                      <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg">
                        <Gift className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700 font-medium">
                          {tier.trial.description}
                        </span>
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      {tier.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-600" />
                          <span className="text-sm text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={cn(
                        "w-full",
                        isCurrentTier && "bg-gray-200 text-gray-700 cursor-not-allowed",
                        tier.popular && !isCurrentTier && "bg-purple-600 hover:bg-purple-700"
                      )}
                      disabled={isCurrentTier}
                      onClick={() => onUpgrade?.(tier.tier)}
                    >
                      {isCurrentTier ? 'Current Plan' : tier.cta}
                      {isUpgrade && !isCurrentTier && <ChevronRight className="h-4 w-4 ml-2" />}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {compareMode === 'features' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All', icon: Users },
              { id: 'core', label: 'Core', icon: Zap },
              { id: 'content', label: 'Content', icon: Video },
              { id: 'support', label: 'Support', icon: Headphones },
              { id: 'exclusive', label: 'VIP', icon: Crown }
            ].map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                    selectedCategory === category.id
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Feature Comparison Table */}
          <Card>
            <CardContent className="p-0">
              {/* Header */}
              <div className="grid grid-cols-5 gap-2 p-3 bg-gray-50 border-b text-xs font-medium">
                <div>Feature</div>
                <div className="text-center">Free</div>
                <div className="text-center">Bronze</div>
                <div className="text-center">Silver</div>
                <div className="text-center">Gold</div>
              </div>

              {/* Features */}
              <div className="divide-y">
                {filteredFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  
                  return (
                    <div key={feature.id} className="grid grid-cols-5 gap-2 p-3 items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className="h-3 w-3 text-gray-600" />}
                          <span className="text-sm font-medium">{feature.name}</span>
                        </div>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                      
                      <div className="text-center">
                        {getFeatureValue(feature, 'free')}
                      </div>
                      <div className="text-center">
                        {getFeatureValue(feature, 'bronze')}
                      </div>
                      <div className="text-center">
                        {getFeatureValue(feature, 'silver')}
                      </div>
                      <div className="text-center">
                        {getFeatureValue(feature, 'gold')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Current Tier Highlight */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className={cn("h-4 w-4", getTierColor(currentTier))} />
                <span className="font-medium">
                  You're on the {tierPricing.find(t => t.tier === currentTier)?.name} plan
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {currentTier === 'free' 
                  ? "Upgrade to unlock more features and get the full Ann Pale experience."
                  : currentTier === 'gold'
                  ? "You have access to all premium features! Enjoy the ultimate Ann Pale experience."
                  : "Consider upgrading to Gold for the ultimate experience with exclusive features."}
              </p>
              
              {currentTier !== 'gold' && (
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={() => onUpgrade?.('gold')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {currentTier === 'free' ? 'Start Your Journey' : 'Upgrade to Gold'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}