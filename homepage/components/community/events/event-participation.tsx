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
  Gift,
  Crown,
  Award,
  Coins,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Target,
  Zap,
  Heart,
  MessageSquare,
  Video,
  Sparkles,
  Ticket,
  Medal,
  Gem,
  Diamond,
  Flame,
  ChevronRight,
  Info,
  Share2,
  Download,
  Bell,
  BellOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticipationIncentive {
  id: string;
  name: string;
  description: string;
  type: 'gamification' | 'access' | 'chance' | 'social' | 'educational';
  icon: React.ElementType;
  value: string | number;
  impact: 'low' | 'medium' | 'high';
  cost: 'low' | 'medium' | 'high';
  roi: 'good' | 'excellent';
  requirements?: string[];
}

interface ParticipationLevel {
  id: string;
  name: string;
  minEvents: number;
  maxEvents: number;
  benefits: string[];
  badge: React.ElementType;
  color: string;
  rewards: {
    points: number;
    badges: string[];
    perks: string[];
  };
}

interface UserParticipation {
  eventsAttended: number;
  eventsHosted: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  level: string;
  nextLevelProgress: number;
  badges: string[];
  upcomingEvents: number;
  raffleEntries: number;
}

interface EventReward {
  id: string;
  name: string;
  description: string;
  pointsValue: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: React.ElementType;
  claimed: boolean;
}

interface EventParticipationProps {
  userId?: string;
  userParticipation?: UserParticipation;
  onClaimReward?: (rewardId: string) => void;
  onViewHistory?: () => void;
  onShareAchievement?: (achievementId: string) => void;
  showIncentives?: boolean;
  showProgress?: boolean;
}

export function EventParticipation({
  userId,
  userParticipation = {
    eventsAttended: 24,
    eventsHosted: 3,
    totalPoints: 1850,
    currentStreak: 5,
    longestStreak: 14,
    level: 'Active Participant',
    nextLevelProgress: 65,
    badges: ['Early Bird', 'Regular', 'Host', 'Networker'],
    upcomingEvents: 4,
    raffleEntries: 12
  },
  onClaimReward,
  onViewHistory,
  onShareAchievement,
  showIncentives = true,
  showProgress = true
}: EventParticipationProps) {
  const [selectedIncentive, setSelectedIncentive] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'rewards' | 'achievements' | 'leaderboard'>('overview');

  // Participation incentives
  const incentives: ParticipationIncentive[] = [
    {
      id: 'attendance-points',
      name: 'Attendance Points',
      description: 'Earn points for every event you attend',
      type: 'gamification',
      icon: Coins,
      value: '50-200 pts/event',
      impact: 'high',
      cost: 'low',
      roi: 'excellent'
    },
    {
      id: 'exclusive-content',
      name: 'Exclusive Content',
      description: 'Access special content and recordings',
      type: 'access',
      icon: Star,
      value: 'VIP Access',
      impact: 'medium',
      cost: 'medium',
      roi: 'good'
    },
    {
      id: 'raffle-entries',
      name: 'Raffle Entries',
      description: 'Win prizes through event participation',
      type: 'chance',
      icon: Ticket,
      value: '1-5 entries',
      impact: 'high',
      cost: 'low',
      roi: 'excellent'
    },
    {
      id: 'networking',
      name: 'Networking',
      description: 'Connect with community members',
      type: 'social',
      icon: Users,
      value: 'Connections',
      impact: 'medium',
      cost: 'low',
      roi: 'good'
    },
    {
      id: 'learning',
      name: 'Learning',
      description: 'Gain knowledge and skills',
      type: 'educational',
      icon: BookOpen,
      value: 'Education',
      impact: 'high',
      cost: 'medium',
      roi: 'excellent'
    }
  ];

  // Participation levels
  const participationLevels: ParticipationLevel[] = [
    {
      id: 'newcomer',
      name: 'Event Newcomer',
      minEvents: 0,
      maxEvents: 5,
      benefits: [
        'Basic event access',
        'Welcome bonus points',
        'Community member badge'
      ],
      badge: Star,
      color: 'bg-gray-100 text-gray-700',
      rewards: {
        points: 100,
        badges: ['Newcomer'],
        perks: ['Event reminders']
      }
    },
    {
      id: 'regular',
      name: 'Regular Attendee',
      minEvents: 6,
      maxEvents: 20,
      benefits: [
        'Priority event registration',
        'Early bird notifications',
        'Bonus point multiplier (1.2x)'
      ],
      badge: Medal,
      color: 'bg-blue-100 text-blue-700',
      rewards: {
        points: 250,
        badges: ['Regular', 'Dedicated'],
        perks: ['Reserved seats', 'Event recordings']
      }
    },
    {
      id: 'active',
      name: 'Active Participant',
      minEvents: 21,
      maxEvents: 50,
      benefits: [
        'VIP event access',
        'Double raffle entries',
        'Bonus point multiplier (1.5x)',
        'Host privileges'
      ],
      badge: Trophy,
      color: 'bg-purple-100 text-purple-700',
      rewards: {
        points: 500,
        badges: ['Active', 'Engaged', 'Contributor'],
        perks: ['Create events', 'VIP lounge access']
      }
    },
    {
      id: 'champion',
      name: 'Community Champion',
      minEvents: 51,
      maxEvents: 100,
      benefits: [
        'All event access',
        'Triple raffle entries',
        'Bonus point multiplier (2x)',
        'Featured host status',
        'Custom event themes'
      ],
      badge: Crown,
      color: 'bg-yellow-100 text-yellow-700',
      rewards: {
        points: 1000,
        badges: ['Champion', 'Leader', 'Influencer'],
        perks: ['Premium features', 'Direct support']
      }
    },
    {
      id: 'legend',
      name: 'Event Legend',
      minEvents: 101,
      maxEvents: 999999,
      benefits: [
        'Lifetime VIP status',
        'Maximum point multipliers',
        'Event naming rights',
        'Platform advisory role',
        'Annual rewards package'
      ],
      badge: Diamond,
      color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700',
      rewards: {
        points: 2500,
        badges: ['Legend', 'Hall of Fame'],
        perks: ['Everything included', 'Legacy status']
      }
    }
  ];

  // Event rewards
  const eventRewards: EventReward[] = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Register for event 7+ days early',
      pointsValue: 50,
      rarity: 'common',
      icon: Clock,
      claimed: true
    },
    {
      id: 'full-attendance',
      name: 'Full Attendance',
      description: 'Stay for entire event duration',
      pointsValue: 100,
      rarity: 'common',
      icon: CheckCircle,
      claimed: true
    },
    {
      id: 'active-participant',
      name: 'Active Participant',
      description: 'Engage in chat and activities',
      pointsValue: 75,
      rarity: 'rare',
      icon: MessageSquare,
      claimed: false
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Attend 5 events in a row',
      pointsValue: 250,
      rarity: 'epic',
      icon: Flame,
      claimed: false
    },
    {
      id: 'super-host',
      name: 'Super Host',
      description: 'Host a successful event',
      pointsValue: 500,
      rarity: 'legendary',
      icon: Crown,
      claimed: false
    }
  ];

  const getCurrentLevel = () => {
    return participationLevels.find(level => 
      userParticipation.eventsAttended >= level.minEvents && 
      userParticipation.eventsAttended <= level.maxEvents
    ) || participationLevels[0];
  };

  const getNextLevel = () => {
    const currentIndex = participationLevels.findIndex(l => l.id === getCurrentLevel().id);
    return participationLevels[currentIndex + 1] || null;
  };

  const getIncentiveTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      gamification: 'bg-purple-100 text-purple-700',
      access: 'bg-blue-100 text-blue-700',
      chance: 'bg-green-100 text-green-700',
      social: 'bg-orange-100 text-orange-700',
      educational: 'bg-pink-100 text-pink-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'bg-gray-100 text-gray-700',
      rare: 'bg-blue-100 text-blue-700',
      epic: 'bg-purple-100 text-purple-700',
      legendary: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700'
    };
    return colors[rarity] || 'bg-gray-100 text-gray-700';
  };

  const renderOverview = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();
    const LevelIcon = currentLevel.badge;

    return (
      <div className="space-y-6">
        {/* User Stats */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center",
                  currentLevel.color
                )}>
                  <LevelIcon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{currentLevel.name}</h3>
                  <p className="text-gray-600">Level {participationLevels.indexOf(currentLevel) + 1} of {participationLevels.length}</p>
                </div>
              </div>
              <Button variant="outline" onClick={onShareAchievement}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Progress to Next Level */}
            {nextLevel && (
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress to {nextLevel.name}</span>
                  <span className="font-medium">{userParticipation.nextLevelProgress}%</span>
                </div>
                <Progress value={userParticipation.nextLevelProgress} className="h-3" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{userParticipation.eventsAttended} events attended</span>
                  <span>{nextLevel.minEvents - userParticipation.eventsAttended} more to go</span>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userParticipation.eventsAttended}</div>
                <div className="text-xs text-gray-600">Events Attended</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userParticipation.eventsHosted}</div>
                <div className="text-xs text-gray-600">Events Hosted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{userParticipation.currentStreak}</div>
                <div className="text-xs text-gray-600">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userParticipation.totalPoints}</div>
                <div className="text-xs text-gray-600">Total Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Your Current Benefits
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

        {/* Upcoming Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Participation Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Upcoming Events</div>
                    <div className="text-sm text-gray-600">You have {userParticipation.upcomingEvents} events this week</div>
                  </div>
                </div>
                <Badge variant="secondary">+{userParticipation.upcomingEvents * 50} pts</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Ticket className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Raffle Entries</div>
                    <div className="text-sm text-gray-600">You have {userParticipation.raffleEntries} active entries</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">View Raffles</Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Flame className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-medium">Streak Bonus</div>
                    <div className="text-sm text-gray-600">Keep your {userParticipation.currentStreak} day streak!</div>
                  </div>
                </div>
                <Badge className="bg-orange-600">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRewards = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {eventRewards.map(reward => {
              const Icon = reward.icon;
              return (
                <div
                  key={reward.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    reward.claimed && "opacity-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      getRarityColor(reward.rarity)
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{reward.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {reward.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          <Coins className="h-3 w-3 mr-1" />
                          {reward.pointsValue} pts
                        </Badge>
                        {reward.claimed ? (
                          <Badge className="bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Claimed
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onClaimReward?.(reward.id)}
                          >
                            Claim
                          </Button>
                        )}
                      </div>
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

  const renderIncentives = () => (
    <div className="space-y-6">
      {showIncentives && (
        <Card>
          <CardHeader>
            <CardTitle>Participation Incentives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incentives.map(incentive => {
                const Icon = incentive.icon;
                const isSelected = selectedIncentive === incentive.id;

                return (
                  <div
                    key={incentive.id}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                      isSelected && "border-purple-500 bg-purple-50"
                    )}
                    onClick={() => setSelectedIncentive(isSelected ? null : incentive.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        getIncentiveTypeColor(incentive.type)
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{incentive.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {incentive.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{incentive.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Impact: <Badge variant="secondary" className="text-xs">{incentive.impact}</Badge>
                          </span>
                          <span className="flex items-center gap-1">
                            <Coins className="h-3 w-3" />
                            Cost: <Badge variant="secondary" className="text-xs">{incentive.cost}</Badge>
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            ROI: <Badge className="text-xs bg-green-600">{incentive.roi}</Badge>
                          </span>
                        </div>

                        {isSelected && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Value:</span>
                              <Badge>{incentive.value}</Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participation Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Participation Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {participationLevels.map((level, index) => {
              const Icon = level.badge;
              const isCurrent = level.id === getCurrentLevel().id;
              const isUnlocked = userParticipation.eventsAttended >= level.minEvents;

              return (
                <div
                  key={level.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    isCurrent && "bg-purple-50 border border-purple-500",
                    !isUnlocked && "opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    level.color
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{level.name}</h4>
                      {isCurrent && (
                        <Badge className="bg-purple-600 text-xs">Current</Badge>
                      )}
                      {isUnlocked && !isCurrent && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {level.minEvents}+ events • {level.rewards.points} points reward
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
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
          <h2 className="text-2xl font-bold">Event Participation</h2>
          <p className="text-gray-600">Track your engagement and earn rewards</p>
        </div>
        
        <Button variant="outline" onClick={onViewHistory}>
          <Clock className="h-4 w-4 mr-2" />
          View History
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'rewards', label: 'Rewards', icon: Gift },
            { id: 'achievements', label: 'Incentives', icon: Trophy }
          ].map((tab) => (
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
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'rewards' && renderRewards()}
          {activeTab === 'achievements' && renderIncentives()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const BookOpen = MessageSquare; // Using MessageSquare as placeholder for BookOpen