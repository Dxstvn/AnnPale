'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy,
  Award,
  Medal,
  Crown,
  Star,
  Shield,
  User,
  Sparkles,
  Gift,
  Package,
  Shuffle,
  MessageSquare,
  Heart,
  Zap,
  PartyPopper,
  Gem,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusBenefit {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  type: 'badge' | 'recognition' | 'privilege' | 'influence';
  tier: 'bronze' | 'silver' | 'gold';
  earned?: boolean;
  progress?: number;
  requirements?: string[];
}

interface SurpriseBenefit {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  value: number;
  received?: boolean;
  receivedDate?: Date;
  probability?: number;
}

interface StatusSurpriseBenefitsProps {
  currentTier?: 'bronze' | 'silver' | 'gold' | 'none';
  memberSince?: Date;
  onBenefitClaim?: (benefit: StatusBenefit | SurpriseBenefit) => void;
  showProbabilities?: boolean;
}

export function StatusSurpriseBenefits({
  currentTier = 'none',
  memberSince = new Date(),
  onBenefitClaim,
  showProbabilities = false
}: StatusSurpriseBenefitsProps) {
  const [activeTab, setActiveTab] = React.useState<'status' | 'surprise'>('status');
  const [revealingSurprise, setRevealingSurprise] = React.useState<string | null>(null);

  // Calculate membership duration
  const membershipMonths = Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30));

  // Status Benefits
  const statusBenefits: StatusBenefit[] = [
    // Badges
    {
      id: 'member-badge',
      title: 'Member Badge',
      description: 'Display your membership status',
      icon: Shield,
      type: 'badge',
      tier: 'bronze',
      earned: currentTier !== 'none',
      requirements: ['Active subscription']
    },
    {
      id: 'vip-badge',
      title: 'VIP Badge',
      description: 'Exclusive VIP status indicator',
      icon: Star,
      type: 'badge',
      tier: 'silver',
      earned: currentTier === 'silver' || currentTier === 'gold',
      requirements: ['Silver tier or higher']
    },
    {
      id: 'elite-badge',
      title: 'Elite Badge',
      description: 'Top tier member recognition',
      icon: Crown,
      type: 'badge',
      tier: 'gold',
      earned: currentTier === 'gold',
      requirements: ['Gold tier membership']
    },
    
    // Recognition
    {
      id: 'anniversary-recognition',
      title: 'Anniversary Recognition',
      description: 'Celebrated on membership anniversaries',
      icon: Calendar,
      type: 'recognition',
      tier: 'bronze',
      earned: membershipMonths >= 12,
      progress: Math.min((membershipMonths / 12) * 100, 100),
      requirements: ['1 year continuous membership']
    },
    {
      id: 'top-fan',
      title: 'Top Fan Status',
      description: 'Recognition as a top supporter',
      icon: Trophy,
      type: 'recognition',
      tier: 'silver',
      earned: membershipMonths >= 6 && (currentTier === 'silver' || currentTier === 'gold'),
      progress: Math.min((membershipMonths / 6) * 100, 100),
      requirements: ['6 months at Silver+', 'High engagement']
    },
    {
      id: 'hall-of-fame',
      title: 'Hall of Fame',
      description: 'Permanent recognition in creator\'s hall of fame',
      icon: Award,
      type: 'recognition',
      tier: 'gold',
      earned: membershipMonths >= 24 && currentTier === 'gold',
      progress: Math.min((membershipMonths / 24) * 100, 100),
      requirements: ['2 years at Gold tier']
    },
    
    // Privileges
    {
      id: 'priority-replies',
      title: 'Priority Replies',
      description: 'Your messages get priority responses',
      icon: MessageSquare,
      type: 'privilege',
      tier: 'silver',
      earned: currentTier === 'silver' || currentTier === 'gold'
    },
    {
      id: 'custom-username',
      title: 'Custom Display Name',
      description: 'Choose a unique display name',
      icon: User,
      type: 'privilege',
      tier: 'gold',
      earned: currentTier === 'gold'
    },
    
    // Influence
    {
      id: 'content-voting',
      title: 'Content Voting Rights',
      description: 'Vote on upcoming content decisions',
      icon: Target,
      type: 'influence',
      tier: 'silver',
      earned: currentTier === 'silver' || currentTier === 'gold'
    },
    {
      id: 'beta-access',
      title: 'Beta Feature Access',
      description: 'Try new features before anyone else',
      icon: Zap,
      type: 'influence',
      tier: 'gold',
      earned: currentTier === 'gold'
    }
  ];

  // Surprise Benefits
  const surpriseBenefits: SurpriseBenefit[] = [
    {
      id: 'mystery-merch',
      title: 'Mystery Merchandise',
      description: 'Exclusive merch item surprise',
      icon: Package,
      rarity: 'common',
      value: 25,
      probability: 30,
      received: Math.random() > 0.7,
      receivedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'signed-item',
      title: 'Signed Item',
      description: 'Personally signed merchandise',
      icon: Award,
      rarity: 'rare',
      value: 50,
      probability: 15,
      received: Math.random() > 0.85
    },
    {
      id: 'personal-video',
      title: 'Personal Video Message',
      description: 'Custom video just for you',
      icon: Video,
      rarity: 'epic',
      value: 100,
      probability: 5,
      received: false
    },
    {
      id: 'vip-experience',
      title: 'VIP Experience Package',
      description: 'Ultimate fan experience',
      icon: Gem,
      rarity: 'legendary',
      value: 500,
      probability: 1,
      received: false
    },
    {
      id: 'birthday-surprise',
      title: 'Birthday Surprise',
      description: 'Special gift on your birthday',
      icon: PartyPopper,
      rarity: 'rare',
      value: 35,
      probability: 100,
      received: false
    },
    {
      id: 'random-upgrade',
      title: 'Random Tier Upgrade',
      description: 'Free tier upgrade for a month',
      icon: TrendingUp,
      rarity: 'epic',
      value: 75,
      probability: 3,
      received: false
    }
  ];

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700';
      case 'rare': return 'bg-blue-100 text-blue-700';
      case 'epic': return 'bg-purple-100 text-purple-700';
      case 'legendary': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get tier color
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  // Handle surprise reveal
  const handleSurpriseReveal = (surpriseId: string) => {
    setRevealingSurprise(surpriseId);
    setTimeout(() => {
      setRevealingSurprise(null);
      onBenefitClaim?.(surpriseBenefits.find(s => s.id === surpriseId)!);
    }, 2000);
  };

  // Filter status benefits by current tier
  const accessibleStatusBenefits = statusBenefits.filter(benefit => {
    if (currentTier === 'none') return false;
    const tierOrder = { bronze: 1, silver: 2, gold: 3 };
    return tierOrder[currentTier] >= tierOrder[benefit.tier];
  });

  // Filter surprise benefits by tier
  const accessibleSurprises = currentTier === 'none' ? [] :
    currentTier === 'bronze' ? surpriseBenefits.filter(s => s.rarity === 'common') :
    currentTier === 'silver' ? surpriseBenefits.filter(s => s.rarity !== 'legendary') :
    surpriseBenefits;

  return (
    <div className="space-y-6">
      {/* Tab Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={activeTab === 'status' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setActiveTab('status')}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Status Benefits
            </Button>
            <Button
              variant={activeTab === 'surprise' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setActiveTab('surprise')}
            >
              <Gift className="h-4 w-4 mr-2" />
              Surprise Benefits
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeTab === 'status' ? (
        <>
          {/* Status Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {['badge', 'recognition', 'privilege', 'influence'].map((type) => {
              const benefits = accessibleStatusBenefits.filter(b => b.type === type);
              if (benefits.length === 0) return null;
              
              return (
                <Card key={type}>
                  <CardHeader>
                    <CardTitle className="text-base capitalize">{type}s</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        
                        return (
                          <motion.div
                            key={benefit.id}
                            whileHover={{ x: 4 }}
                            className={cn(
                              "p-3 rounded-lg border transition-all",
                              benefit.earned 
                                ? "border-green-200 bg-green-50"
                                : "border-gray-200 bg-white"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                benefit.earned
                                  ? "bg-gradient-to-br " + getTierColor(benefit.tier)
                                  : "bg-gray-100"
                              )}>
                                <Icon className={cn(
                                  "h-5 w-5",
                                  benefit.earned ? "text-white" : "text-gray-400"
                                )} />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm">{benefit.title}</h4>
                                  {benefit.earned ? (
                                    <Badge className="bg-green-100 text-green-700 text-xs">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Earned
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-xs">
                                      <Lock className="h-3 w-3 mr-1" />
                                      Locked
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-xs text-gray-600 mb-2">{benefit.description}</p>
                                
                                {benefit.progress !== undefined && !benefit.earned && (
                                  <div className="mb-2">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs text-gray-600">Progress</span>
                                      <span className="text-xs font-medium">{benefit.progress.toFixed(0)}%</span>
                                    </div>
                                    <Progress value={benefit.progress} className="h-1" />
                                  </div>
                                )}
                                
                                {benefit.requirements && !benefit.earned && (
                                  <div className="space-y-1">
                                    {benefit.requirements.map((req, idx) => (
                                      <p key={idx} className="text-xs text-gray-500">
                                        • {req}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Status Summary */}
          {currentTier !== 'none' && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Your Status Summary</h3>
                    <p className="text-sm text-gray-600">
                      {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} member for {membershipMonths} months
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">
                      {accessibleStatusBenefits.filter(b => b.earned).length}/{accessibleStatusBenefits.length}
                    </p>
                    <p className="text-sm text-gray-600">benefits earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <>
          {/* Surprise Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessibleSurprises.map((surprise) => {
              const Icon = surprise.icon;
              const isRevealing = revealingSurprise === surprise.id;
              
              return (
                <motion.div
                  key={surprise.id}
                  whileHover={{ scale: surprise.received ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={cn(
                    "relative overflow-hidden transition-all cursor-pointer",
                    surprise.received ? "border-green-300" : "border-purple-300 hover:border-purple-500"
                  )}>
                    <CardContent className="p-4">
                      <AnimatePresence>
                        {isRevealing && (
                          <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            exit={{ scale: 0 }}
                            className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center z-10"
                          >
                            <Sparkles className="h-12 w-12 text-white animate-pulse" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <div className={cn(
                        "relative",
                        isRevealing && "opacity-0"
                      )}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-6 w-6 text-purple-600" />
                          </div>
                          <Badge className={cn("text-xs", getRarityColor(surprise.rarity))}>
                            {surprise.rarity}
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium mb-1">{surprise.title}</h4>
                        <p className="text-xs text-gray-600 mb-3">{surprise.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-gray-600">Value: </span>
                            <span className="font-bold text-purple-600">${surprise.value}</span>
                          </div>
                          
                          {showProbabilities && !surprise.received && (
                            <div className="text-xs text-gray-500">
                              {surprise.probability}% chance
                            </div>
                          )}
                        </div>
                        
                        {surprise.received ? (
                          <div className="mt-3 p-2 bg-green-50 rounded text-xs text-green-700">
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            Received {surprise.receivedDate?.toLocaleDateString()}
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => handleSurpriseReveal(surprise.id)}
                            disabled={currentTier === 'none'}
                          >
                            <Gift className="h-4 w-4 mr-2" />
                            {currentTier === 'none' ? 'Locked' : 'Check Availability'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Mystery Box */}
          {currentTier !== 'none' && (
            <Card className="bg-gradient-to-r from-purple-100 to-pink-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg">
                      <Shuffle className="h-8 w-8 text-purple-600 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Mystery Box Available!</h3>
                      <p className="text-sm text-gray-600">
                        Random surprise benefit waiting to be claimed
                      </p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Open Mystery Box
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// Add missing import
import { Video } from 'lucide-react';