'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Gift,
  Percent,
  Clock,
  Star,
  Crown,
  Unlock,
  Heart,
  Award,
  Sparkles,
  Zap,
  Calendar,
  Users,
  MessageSquare,
  Video,
  Target,
  TrendingUp,
  CheckCircle,
  Timer,
  ArrowRight,
  DollarSign,
  ShoppingBag,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface UpgradeIncentive {
  id: string;
  type: 'discount' | 'bonus_content' | 'skip_trial' | 'loyalty_points' | 'exclusive_badge' | 'creator_thank_you';
  title: string;
  description: string;
  value: string;
  icon: React.ElementType;
  color: string;
  urgency: 'low' | 'medium' | 'high';
  timeLimit?: {
    expiresAt: Date;
    timeLeft: string;
  };
  conditions?: string[];
  targetTier: string;
  conversionBoost: number;
  exclusive?: boolean;
  claimed?: boolean;
}

interface IncentivePersonalization {
  userId: string;
  tierHistory: string[];
  engagementLevel: 'low' | 'medium' | 'high';
  paymentHistory: 'good' | 'average' | 'poor';
  churnRisk: number;
  preferences: {
    pricesensitivity: number;
    contentMotivated: boolean;
    socialMotivated: boolean;
    exclusivityMotivated: boolean;
  };
}

interface UpgradeIncentivesProps {
  targetTier?: string;
  personalization?: IncentivePersonalization;
  incentives?: UpgradeIncentive[];
  onIncentiveSelect?: (incentive: UpgradeIncentive) => void;
  onClaimIncentive?: (incentiveId: string) => void;
  onUpgradeWithIncentive?: (incentive: UpgradeIncentive) => void;
  showPersonalized?: boolean;
}

export function UpgradeIncentives({
  targetTier = 'silver',
  personalization,
  incentives = [],
  onIncentiveSelect,
  onClaimIncentive,
  onUpgradeWithIncentive,
  showPersonalized = true
}: UpgradeIncentivesProps) {
  const [selectedIncentive, setSelectedIncentive] = React.useState<string | null>(null);
  const [timeLeft, setTimeLeft] = React.useState<{ [key: string]: string }>({});
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Default personalization
  const defaultPersonalization: IncentivePersonalization = personalization || {
    userId: 'user_123',
    tierHistory: ['bronze'],
    engagementLevel: 'high',
    paymentHistory: 'good',
    churnRisk: 15,
    preferences: {
      pricesensitivity: 70,
      contentMotivated: true,
      socialMotivated: false,
      exclusivityMotivated: true
    }
  };

  // Default incentives based on specification
  const defaultIncentives: UpgradeIncentive[] = incentives.length > 0 ? incentives : [
    {
      id: 'first_month_discount',
      type: 'discount',
      title: 'First Month 50% Off',
      description: 'Upgrade now and save 50% on your first month of Silver tier',
      value: '50% OFF',
      icon: Percent,
      color: 'from-green-400 to-green-600',
      urgency: 'high',
      timeLimit: {
        expiresAt: new Date(currentTime + 72 * 60 * 60 * 1000), // 3 days
        timeLeft: '3 days'
      },
      conditions: ['First-time upgrade', 'Valid for 72 hours'],
      targetTier: 'silver',
      conversionBoost: 65,
      exclusive: false
    },
    {
      id: 'bonus_content_unlock',
      type: 'bonus_content',
      title: 'Exclusive Content Bundle',
      description: 'Get instant access to 10 exclusive behind-the-scenes videos',
      value: '10 Videos',
      icon: Video,
      color: 'from-purple-400 to-purple-600',
      urgency: 'medium',
      conditions: ['Available immediately', 'Exclusive content library'],
      targetTier: 'silver',
      conversionBoost: 45,
      exclusive: true
    },
    {
      id: 'skip_trial_period',
      type: 'skip_trial',
      title: 'Skip Trial, Go Premium',
      description: 'Jump straight to full Silver benefits without trial limitations',
      value: 'Instant Access',
      icon: Zap,
      color: 'from-yellow-400 to-yellow-600',
      urgency: 'medium',
      conditions: ['No trial restrictions', 'Full feature access'],
      targetTier: 'silver',
      conversionBoost: 55
    },
    {
      id: 'loyalty_points_bonus',
      type: 'loyalty_points',
      title: '1000 Loyalty Points',
      description: 'Earn bonus loyalty points that can be redeemed for exclusive perks',
      value: '1000 Points',
      icon: Star,
      color: 'from-blue-400 to-blue-600',
      urgency: 'low',
      conditions: ['Redeemable for perks', 'Never expire'],
      targetTier: 'silver',
      conversionBoost: 25
    },
    {
      id: 'exclusive_badge',
      type: 'exclusive_badge',
      title: 'Early Adopter Badge',
      description: 'Show off your status with an exclusive profile badge and recognition',
      value: 'Exclusive Badge',
      icon: Award,
      color: 'from-pink-400 to-pink-600',
      urgency: 'low',
      conditions: ['Visible on profile', 'Community recognition'],
      targetTier: 'silver',
      conversionBoost: 30,
      exclusive: true
    },
    {
      id: 'creator_thank_you',
      type: 'creator_thank_you',
      title: 'Personal Thank You Video',
      description: 'Receive a personalized thank you message from your favorite creator',
      value: 'Personal Video',
      icon: Heart,
      color: 'from-red-400 to-red-600',
      urgency: 'high',
      timeLimit: {
        expiresAt: new Date(currentTime + 24 * 60 * 60 * 1000), // 1 day
        timeLeft: '24 hours'
      },
      conditions: ['Personalized message', 'From your top creator'],
      targetTier: 'silver',
      conversionBoost: 70,
      exclusive: true
    }
  ];

  // Calculate time left for incentives
  React.useEffect(() => {
    const updateTimeLeft = () => {
      const newTimeLeft: { [key: string]: string } = {};
      
      defaultIncentives.forEach(incentive => {
        if (incentive.timeLimit) {
          const now = Date.now();
          const diff = incentive.timeLimit.expiresAt.getTime() - now;
          
          if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (hours > 24) {
              const days = Math.floor(hours / 24);
              newTimeLeft[incentive.id] = `${days}d ${hours % 24}h`;
            } else if (hours > 0) {
              newTimeLeft[incentive.id] = `${hours}h ${minutes}m`;
            } else {
              newTimeLeft[incentive.id] = `${minutes}m`;
            }
          } else {
            newTimeLeft[incentive.id] = 'Expired';
          }
        }
      });
      
      setTimeLeft(newTimeLeft);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Personalize incentives based on user preferences
  const personalizedIncentives = showPersonalized 
    ? defaultIncentives.sort((a, b) => {
        let scoreA = a.conversionBoost;
        let scoreB = b.conversionBoost;
        
        // Boost price-sensitive incentives for price-sensitive users
        if (defaultPersonalization.preferences.pricesensitivity > 70) {
          if (a.type === 'discount') scoreA += 30;
          if (b.type === 'discount') scoreB += 30;
        }
        
        // Boost content incentives for content-motivated users
        if (defaultPersonalization.preferences.contentMotivated) {
          if (a.type === 'bonus_content' || a.type === 'creator_thank_you') scoreA += 20;
          if (b.type === 'bonus_content' || b.type === 'creator_thank_you') scoreB += 20;
        }
        
        // Boost exclusive incentives for exclusivity-motivated users
        if (defaultPersonalization.preferences.exclusivityMotivated) {
          if (a.exclusive) scoreA += 15;
          if (b.exclusive) scoreB += 15;
        }
        
        // Boost urgency for high churn risk
        if (defaultPersonalization.churnRisk > 50) {
          if (a.urgency === 'high') scoreA += 25;
          if (b.urgency === 'high') scoreB += 25;
        }
        
        return scoreB - scoreA;
      })
    : defaultIncentives;

  // Get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Get urgency badge
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Exclusive Upgrade Incentives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Available Offers</p>
              <p className="text-2xl font-bold">{personalizedIncentives.filter(i => !i.claimed).length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Time-Limited</p>
              <p className="text-2xl font-bold text-red-600">
                {personalizedIncentives.filter(i => i.timeLimit && timeLeft[i.id] !== 'Expired').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Target Tier</p>
              <Badge className="bg-silver text-silver-foreground">
                {targetTier.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalization Notice */}
      {showPersonalized && (
        <Card className="border-blue-300 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-700">
                <strong>Personalized for you:</strong> These offers are tailored based on your preferences and usage patterns.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Incentives Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {personalizedIncentives.map((incentive, index) => {
          const Icon = incentive.icon;
          const isSelected = selectedIncentive === incentive.id;
          const isExpired = incentive.timeLimit && timeLeft[incentive.id] === 'Expired';
          const currentTimeLeft = incentive.timeLimit ? timeLeft[incentive.id] : null;

          return (
            <motion.div
              key={incentive.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "transition-all cursor-pointer",
                isSelected && "border-purple-500 ring-2 ring-purple-200",
                incentive.urgency === 'high' && "border-red-300",
                incentive.exclusive && "border-yellow-400",
                isExpired && "opacity-50",
                incentive.claimed && "bg-gray-50"
              )}
              onClick={() => !isExpired && !incentive.claimed && setSelectedIncentive(isSelected ? null : incentive.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                        incentive.color
                      )}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{incentive.title}</h4>
                          {incentive.exclusive && (
                            <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                              Exclusive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{incentive.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={cn("text-xs", getUrgencyBadge(incentive.urgency))}>
                        {incentive.urgency}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Value Display */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {incentive.value}
                      </div>
                      <p className="text-sm text-gray-600">Incentive Value</p>
                    </div>
                    
                    {/* Time Limit */}
                    {incentive.timeLimit && currentTimeLeft && (
                      <div className={cn(
                        "p-3 rounded-lg text-center",
                        isExpired ? "bg-gray-100" : "bg-red-50 border border-red-200"
                      )}>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Timer className={cn(
                            "h-4 w-4",
                            isExpired ? "text-gray-600" : "text-red-600"
                          )} />
                          <span className={cn(
                            "text-sm font-medium",
                            isExpired ? "text-gray-600" : "text-red-700"
                          )}>
                            {isExpired ? 'Expired' : `${currentTimeLeft} left`}
                          </span>
                        </div>
                        {!isExpired && (
                          <p className="text-xs text-red-600">Limited time offer!</p>
                        )}
                      </div>
                    )}
                    
                    {/* Conditions */}
                    {incentive.conditions && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Conditions:</p>
                        <ul className="space-y-1">
                          {incentive.conditions.map((condition, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {condition}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Conversion Boost */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Conversion boost:</span>
                      <span className="font-medium text-green-600">+{incentive.conversionBoost}%</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      {incentive.claimed ? (
                        <Button disabled className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Claimed
                        </Button>
                      ) : isExpired ? (
                        <Button disabled className="flex-1">
                          Expired
                        </Button>
                      ) : (
                        <>
                          <Button 
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpgradeWithIncentive?.(incentive);
                            }}
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Upgrade Now
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClaimIncentive?.(incentive.id);
                            }}
                          >
                            Claim
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Incentive Details */}
      <AnimatePresence>
        {selectedIncentive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-purple-300 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Ready to Upgrade with This Incentive?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-gray-700">
                    You've selected an amazing offer! This incentive will be applied to your upgrade.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button 
                      size="lg"
                      onClick={() => {
                        const incentive = personalizedIncentives.find(i => i.id === selectedIncentive);
                        if (incentive) onUpgradeWithIncentive?.(incentive);
                      }}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Proceed to Upgrade
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setSelectedIncentive(null)}
                    >
                      Choose Different Offer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Statistics */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Incentive Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {Math.max(...personalizedIncentives.map(i => i.conversionBoost))}%
              </p>
              <p className="text-sm text-gray-600">Highest Boost</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {personalizedIncentives.filter(i => i.exclusive).length}
              </p>
              <p className="text-sm text-gray-600">Exclusive Offers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {personalizedIncentives.filter(i => i.timeLimit).length}
              </p>
              <p className="text-sm text-gray-600">Time-Limited</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(personalizedIncentives.reduce((sum, i) => sum + i.conversionBoost, 0) / personalizedIncentives.length)}%
              </p>
              <p className="text-sm text-gray-600">Avg Conversion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}