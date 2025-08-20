'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy,
  Star,
  Crown,
  Shield,
  Award,
  Zap,
  TrendingUp,
  ChevronUp,
  ChevronRight,
  Lock,
  Unlock,
  CheckCircle,
  Gift,
  Sparkles,
  Target,
  Users,
  Heart,
  MessageSquare,
  Video,
  Calendar,
  Clock,
  Info,
  ArrowUp,
  ArrowRight,
  Medal,
  Gem,
  Diamond,
  Flame,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MemberLevel {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  requirements: {
    points: number;
    badges?: number;
    streak?: number;
    referrals?: number;
  };
  unlocked: boolean;
}

interface LevelBenefit {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  availableAt: string[];
  active: boolean;
}

interface UserProgress {
  currentLevel: number;
  currentLevelName: string;
  currentPoints: number;
  nextLevelPoints: number;
  progress: number;
  totalBadges: number;
  currentStreak: number;
  referrals: number;
  rank?: number;
  percentile?: number;
}

interface MemberLevelsProps {
  userId?: string;
  userProgress?: UserProgress;
  onViewBenefits?: (level: MemberLevel) => void;
  onClaimReward?: (levelId: string) => void;
  onShareProgress?: () => void;
  showRoadmap?: boolean;
  showBenefits?: boolean;
}

export function MemberLevels({
  userId,
  userProgress = {
    currentLevel: 3,
    currentLevelName: 'Contributor',
    currentPoints: 1250,
    nextLevelPoints: 2000,
    progress: 62.5,
    totalBadges: 15,
    currentStreak: 14,
    referrals: 3,
    rank: 156,
    percentile: 15
  },
  onViewBenefits,
  onClaimReward,
  onShareProgress,
  showRoadmap = true,
  showBenefits = true
}: MemberLevelsProps) {
  const [activeTab, setActiveTab] = React.useState<'progress' | 'levels' | 'benefits' | 'roadmap'>('progress');
  const [expandedLevel, setExpandedLevel] = React.useState<string | null>(null);

  // Member levels definition
  const memberLevels: MemberLevel[] = [
    {
      id: 'newcomer',
      name: 'Newcomer',
      description: 'Just getting started on your journey',
      icon: Rocket,
      color: 'bg-gray-100 text-gray-600',
      minPoints: 0,
      maxPoints: 100,
      benefits: [
        'Access to community forums',
        'Basic badge collection',
        'Daily login rewards',
        'Welcome bonus points'
      ],
      requirements: {
        points: 0
      },
      unlocked: true
    },
    {
      id: 'member',
      name: 'Member',
      description: 'Active community participant',
      icon: Star,
      color: 'bg-blue-100 text-blue-600',
      minPoints: 101,
      maxPoints: 500,
      benefits: [
        'All Newcomer benefits',
        'Priority customer support',
        '5% discount on services',
        'Access to member-only events',
        'Custom profile badge'
      ],
      requirements: {
        points: 101,
        badges: 5,
        streak: 3
      },
      unlocked: true
    },
    {
      id: 'contributor',
      name: 'Contributor',
      description: 'Valuable community contributor',
      icon: Award,
      color: 'bg-purple-100 text-purple-600',
      minPoints: 501,
      maxPoints: 2000,
      benefits: [
        'All Member benefits',
        '10% discount on services',
        'Early access to new features',
        'Contributor badge and title',
        'Monthly bonus points',
        'Invitation to VIP events'
      ],
      requirements: {
        points: 501,
        badges: 10,
        streak: 7,
        referrals: 2
      },
      unlocked: true
    },
    {
      id: 'expert',
      name: 'Expert',
      description: 'Recognized community expert',
      icon: Shield,
      color: 'bg-yellow-100 text-yellow-600',
      minPoints: 2001,
      maxPoints: 5000,
      benefits: [
        'All Contributor benefits',
        '15% discount on services',
        'Expert verification badge',
        'Content promotion priority',
        'Direct creator connections',
        'Quarterly rewards package',
        'Beta testing opportunities'
      ],
      requirements: {
        points: 2001,
        badges: 20,
        streak: 14,
        referrals: 5
      },
      unlocked: false
    },
    {
      id: 'leader',
      name: 'Leader',
      description: 'Community leader and influencer',
      icon: Crown,
      color: 'bg-orange-100 text-orange-600',
      minPoints: 5001,
      maxPoints: 10000,
      benefits: [
        'All Expert benefits',
        '20% discount on services',
        'Leadership council membership',
        'Event hosting privileges',
        'Custom merchandise',
        'Annual VIP retreat invitation',
        'Platform feature input'
      ],
      requirements: {
        points: 5001,
        badges: 35,
        streak: 30,
        referrals: 10
      },
      unlocked: false
    },
    {
      id: 'legend',
      name: 'Legend',
      description: 'Legendary status in the community',
      icon: Diamond,
      color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600',
      minPoints: 10001,
      maxPoints: 999999,
      benefits: [
        'All Leader benefits',
        '25% lifetime discount',
        'Legend exclusive badge',
        'Named community award',
        'Lifetime VIP access',
        'Personal account manager',
        'Custom platform features',
        'Hall of Fame inclusion'
      ],
      requirements: {
        points: 10001,
        badges: 50,
        streak: 60,
        referrals: 20
      },
      unlocked: false
    }
  ];

  // Level benefits
  const levelBenefits: LevelBenefit[] = [
    {
      id: 'forum-access',
      name: 'Forum Access',
      description: 'Participate in community discussions',
      icon: MessageSquare,
      availableAt: ['newcomer', 'member', 'contributor', 'expert', 'leader', 'legend'],
      active: true
    },
    {
      id: 'discount-5',
      name: '5% Discount',
      description: 'Save on all platform services',
      icon: Gift,
      availableAt: ['member', 'contributor', 'expert', 'leader', 'legend'],
      active: true
    },
    {
      id: 'discount-10',
      name: '10% Discount',
      description: 'Enhanced savings on services',
      icon: Gift,
      availableAt: ['contributor', 'expert', 'leader', 'legend'],
      active: true
    },
    {
      id: 'early-access',
      name: 'Early Access',
      description: 'Try new features before everyone',
      icon: Zap,
      availableAt: ['contributor', 'expert', 'leader', 'legend'],
      active: true
    },
    {
      id: 'vip-events',
      name: 'VIP Events',
      description: 'Exclusive event invitations',
      icon: Calendar,
      availableAt: ['contributor', 'expert', 'leader', 'legend'],
      active: true
    },
    {
      id: 'creator-connect',
      name: 'Creator Connections',
      description: 'Direct access to top creators',
      icon: Users,
      availableAt: ['expert', 'leader', 'legend'],
      active: false
    },
    {
      id: 'beta-testing',
      name: 'Beta Testing',
      description: 'Test and shape new features',
      icon: Target,
      availableAt: ['expert', 'leader', 'legend'],
      active: false
    },
    {
      id: 'leadership-council',
      name: 'Leadership Council',
      description: 'Influence platform decisions',
      icon: Crown,
      availableAt: ['leader', 'legend'],
      active: false
    },
    {
      id: 'lifetime-vip',
      name: 'Lifetime VIP',
      description: 'Permanent VIP status',
      icon: Diamond,
      availableAt: ['legend'],
      active: false
    }
  ];

  const getCurrentLevel = () => {
    return memberLevels.find(level => 
      userProgress.currentPoints >= level.minPoints && 
      userProgress.currentPoints <= level.maxPoints
    ) || memberLevels[0];
  };

  const getNextLevel = () => {
    const currentIndex = memberLevels.findIndex(l => l.id === getCurrentLevel().id);
    return memberLevels[currentIndex + 1] || null;
  };

  const renderProgressOverview = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();

    return (
      <div className="space-y-6">
        {/* Current Level Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center",
                  currentLevel.color
                )}>
                  <currentLevel.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{currentLevel.name}</h3>
                  <p className="text-gray-600">{currentLevel.description}</p>
                </div>
              </div>
              {userProgress.rank && (
                <div className="text-right">
                  <div className="text-2xl font-bold">#{userProgress.rank}</div>
                  <div className="text-sm text-gray-600">Global Rank</div>
                  {userProgress.percentile && (
                    <Badge variant="outline" className="mt-1">
                      Top {userProgress.percentile}%
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Progress to Next Level */}
            {nextLevel && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress to {nextLevel.name}</span>
                  <span className="font-medium">{userProgress.progress}%</span>
                </div>
                <Progress value={userProgress.progress} className="h-3" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{userProgress.currentPoints} points</span>
                  <span>{userProgress.nextLevelPoints - userProgress.currentPoints} points to go</span>
                  <span>{userProgress.nextLevelPoints} required</span>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{userProgress.currentPoints}</div>
                <div className="text-xs text-gray-600">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{userProgress.totalBadges}</div>
                <div className="text-xs text-gray-600">Badges</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">{userProgress.currentStreak}</div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{userProgress.referrals}</div>
                <div className="text-xs text-gray-600">Referrals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Level Requirements */}
        {nextLevel && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Requirements for {nextLevel.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(nextLevel.requirements).map(([key, value]) => {
                  const current = key === 'points' ? userProgress.currentPoints :
                                key === 'badges' ? userProgress.totalBadges :
                                key === 'streak' ? userProgress.currentStreak :
                                key === 'referrals' ? userProgress.referrals : 0;
                  const met = current >= value;
                  
                  return (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {met ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                        <span className={cn("capitalize", met && "text-green-600 font-medium")}>
                          {key === 'points' ? 'Points' :
                           key === 'badges' ? 'Badges Earned' :
                           key === 'streak' ? 'Day Streak' :
                           key === 'referrals' ? 'Friend Referrals' : key}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={cn("font-medium", met ? "text-green-600" : "text-gray-900")}>
                          {current}
                        </span>
                        <span className="text-gray-500"> / {value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Your Active Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {currentLevel.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAllLevels = () => (
    <div className="space-y-4">
      {memberLevels.map((level, index) => {
        const Icon = level.icon;
        const isCurrentLevel = level.id === getCurrentLevel().id;
        const isExpanded = expandedLevel === level.id;

        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "hover:shadow-md transition-all cursor-pointer",
              isCurrentLevel && "border-purple-500 bg-purple-50",
              !level.unlocked && "opacity-75"
            )}
            onClick={() => setExpandedLevel(isExpanded ? null : level.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      level.color
                    )}>
                      {level.unlocked ? (
                        <Icon className="h-6 w-6" />
                      ) : (
                        <Lock className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{level.name}</h3>
                        {isCurrentLevel && (
                          <Badge className="bg-purple-600">Current</Badge>
                        )}
                        {level.unlocked && !isCurrentLevel && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{level.description}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {level.minPoints.toLocaleString()} - {level.maxPoints === 999999 ? '∞' : level.maxPoints.toLocaleString()} points
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={cn(
                    "h-5 w-5 text-gray-400 transition-transform",
                    isExpanded && "rotate-90"
                  )} />
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t"
                    >
                      <div className="space-y-4">
                        {/* Requirements */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">Requirements</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(level.requirements).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                <span className="capitalize text-gray-600">
                                  {key}: {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Benefits */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">Benefits</h4>
                          <div className="space-y-1">
                            {level.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {!level.unlocked && (
                          <Button 
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewBenefits?.(level);
                            }}
                          >
                            View Requirements
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  const renderBenefits = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Level Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {levelBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.id} className={cn(
                  "flex items-start gap-3 p-3 rounded",
                  benefit.active ? "bg-green-50" : "bg-gray-50"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    benefit.active ? "bg-green-100" : "bg-gray-200"
                  )}>
                    {benefit.active ? (
                      <Icon className="h-5 w-5 text-green-600" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{benefit.name}</h4>
                      {benefit.active && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{benefit.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {benefit.availableAt.map((levelId) => {
                        const level = memberLevels.find(l => l.id === levelId);
                        return level ? (
                          <Badge key={levelId} variant="secondary" className="text-xs">
                            {level.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Member Levels</h2>
          <p className="text-gray-600">Progress through levels and unlock exclusive benefits</p>
        </div>
        
        <Button 
          variant="outline"
          onClick={onShareProgress}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Progress
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'progress', label: 'My Progress', icon: TrendingUp },
            { id: 'levels', label: 'All Levels', icon: Trophy },
            { id: 'benefits', label: 'Benefits', icon: Gift },
            { id: 'roadmap', label: 'Roadmap', icon: Target, show: showRoadmap }
          ].filter(tab => tab.show !== false).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'progress' && renderProgressOverview()}
          {activeTab === 'levels' && renderAllLevels()}
          {activeTab === 'benefits' && showBenefits && renderBenefits()}
          {activeTab === 'roadmap' && showRoadmap && (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Level Roadmap</h3>
              <p className="text-gray-600">Your personalized progression path</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}