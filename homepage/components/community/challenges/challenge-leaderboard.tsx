'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy,
  Crown,
  Medal,
  Award,
  Star,
  Zap,
  Flame,
  Target,
  TrendingUp,
  Calendar,
  Users,
  BarChart3,
  ChevronUp,
  ChevronDown,
  Filter,
  Clock,
  Gift,
  Sparkles,
  Heart,
  MessageSquare,
  Eye,
  Share2,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  level: number;
  stats: {
    totalPoints: number;
    challengesWon: number;
    challengesParticipated: number;
    streakCurrent: number;
    streakBest: number;
    monthlyPoints: number;
    weeklyPoints: number;
  };
  badges: Badge[];
  recentActivity: {
    type: 'won' | 'participated' | 'created' | 'voted';
    challengeTitle: string;
    points: number;
    timestamp: Date;
  }[];
  ranking: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'same';
    percentile: number;
  };
  achievements: {
    firstWin: Date | null;
    perfectStreak: number;
    totalVotes: number;
    helpfulVotes: number;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'participation' | 'achievement' | 'skill' | 'social' | 'special';
  earnedAt: Date;
}

interface Season {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  theme: string;
  rewards: {
    position: number;
    reward: string;
    description: string;
  }[];
  isActive: boolean;
}

interface ChallengeLeaderboardProps {
  view?: 'overall' | 'weekly' | 'monthly' | 'seasonal';
  timeframe?: 'all-time' | 'current-month' | 'current-week';
  category?: 'all' | 'creative' | 'skill' | 'knowledge' | 'physical' | 'social' | 'charitable';
  showHallOfFame?: boolean;
  onUserClick?: (userId: string) => void;
  onBadgeClick?: (badge: Badge) => void;
  userRole?: 'member' | 'creator' | 'moderator' | 'admin';
  currentUserId?: string;
}

export function ChallengeLeaderboard({
  view = 'overall',
  timeframe = 'all-time',
  category = 'all',
  showHallOfFame = true,
  onUserClick,
  onBadgeClick,
  userRole = 'member',
  currentUserId
}: ChallengeLeaderboardProps) {
  const [activeView, setActiveView] = React.useState(view);
  const [activeTimeframe, setActiveTimeframe] = React.useState(timeframe);
  const [activeCategory, setActiveCategory] = React.useState(category);
  const [showDetails, setShowDetails] = React.useState<Set<string>>(new Set());

  // Sample seasons data
  const currentSeason: Season = {
    id: 'heritage-2024',
    name: 'Heritage Celebration 2024',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    theme: 'Celebrating Haitian culture and heritage',
    rewards: [
      { position: 1, reward: '$1000 Prize', description: 'Grand champion award + featured profile' },
      { position: 2, reward: '$500 Prize', description: 'Runner-up award + premium badge' },
      { position: 3, reward: '$250 Prize', description: 'Third place award + special recognition' },
      { position: 10, reward: 'Top 10 Badge', description: 'Exclusive top performer badge' }
    ],
    isActive: true
  };

  // Sample badges data
  const availableBadges: Badge[] = [
    {
      id: 'first-win',
      name: 'First Victory',
      description: 'Won your first challenge',
      icon: '🏆',
      rarity: 'common',
      category: 'achievement',
      earnedAt: new Date()
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Maintained a 10-challenge participation streak',
      icon: '🔥',
      rarity: 'rare',
      category: 'participation',
      earnedAt: new Date()
    },
    {
      id: 'culture-keeper',
      name: 'Culture Keeper',
      description: 'Won 5 heritage-related challenges',
      icon: '🇭🇹',
      rarity: 'epic',
      category: 'skill',
      earnedAt: new Date()
    },
    {
      id: 'community-champion',
      name: 'Community Champion',
      description: 'Helped judge 100 submissions',
      icon: '⭐',
      rarity: 'legendary',
      category: 'social',
      earnedAt: new Date()
    }
  ];

  // Sample leaderboard data
  const leaderboardUsers: LeaderboardUser[] = [
    {
      id: 'user1',
      name: 'Marie Delacroix',
      avatar: '👩🏾‍🎨',
      verified: true,
      level: 15,
      stats: {
        totalPoints: 12450,
        challengesWon: 8,
        challengesParticipated: 23,
        streakCurrent: 7,
        streakBest: 12,
        monthlyPoints: 3200,
        weeklyPoints: 850
      },
      badges: availableBadges.slice(0, 3),
      recentActivity: [
        { type: 'won', challengeTitle: 'Heritage Video Challenge', points: 500, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { type: 'participated', challengeTitle: 'Kreyòl Tongue Twister', points: 100, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
      ],
      ranking: {
        current: 1,
        previous: 2,
        trend: 'up',
        percentile: 99
      },
      achievements: {
        firstWin: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        perfectStreak: 8,
        totalVotes: 245,
        helpfulVotes: 189
      }
    },
    {
      id: 'user2',
      name: 'Marcus Thompson',
      avatar: '👨🏾‍🎓',
      verified: true,
      level: 13,
      stats: {
        totalPoints: 11200,
        challengesWon: 6,
        challengesParticipated: 19,
        streakCurrent: 4,
        streakBest: 9,
        monthlyPoints: 2800,
        weeklyPoints: 720
      },
      badges: availableBadges.slice(1, 4),
      recentActivity: [
        { type: 'participated', challengeTitle: 'Recipe Recreation', points: 150, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        { type: 'voted', challengeTitle: 'Heritage Video Challenge', points: 25, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
      ],
      ranking: {
        current: 2,
        previous: 1,
        trend: 'down',
        percentile: 95
      },
      achievements: {
        firstWin: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
        perfectStreak: 6,
        totalVotes: 178,
        helpfulVotes: 156
      }
    },
    {
      id: 'user3',
      name: 'Sophia Laurent',
      avatar: '👩🏾‍💻',
      verified: false,
      level: 11,
      stats: {
        totalPoints: 9800,
        challengesWon: 4,
        challengesParticipated: 16,
        streakCurrent: 5,
        streakBest: 8,
        monthlyPoints: 2400,
        weeklyPoints: 600
      },
      badges: [availableBadges[0], availableBadges[2]],
      recentActivity: [
        { type: 'won', challengeTitle: 'Community Kindness Challenge', points: 300, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      ],
      ranking: {
        current: 3,
        previous: 4,
        trend: 'up',
        percentile: 88
      },
      achievements: {
        firstWin: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        perfectStreak: 5,
        totalVotes: 134,
        helpfulVotes: 98
      }
    },
    {
      id: 'user4',
      name: 'Jean Baptiste',
      avatar: '👨🏾‍💼',
      verified: false,
      level: 9,
      stats: {
        totalPoints: 8900,
        challengesWon: 3,
        challengesParticipated: 14,
        streakCurrent: 3,
        streakBest: 6,
        monthlyPoints: 2100,
        weeklyPoints: 450
      },
      badges: [availableBadges[0]],
      recentActivity: [
        { type: 'participated', challengeTitle: 'Haiti Trivia Master', points: 75, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
      ],
      ranking: {
        current: 4,
        previous: 3,
        trend: 'down',
        percentile: 75
      },
      achievements: {
        firstWin: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        perfectStreak: 3,
        totalVotes: 89,
        helpfulVotes: 67
      }
    },
    {
      id: 'user5',
      name: 'Lucienne Toussaint',
      avatar: '👵🏾',
      verified: false,
      level: 8,
      stats: {
        totalPoints: 7600,
        challengesWon: 2,
        challengesParticipated: 12,
        streakCurrent: 2,
        streakBest: 5,
        monthlyPoints: 1800,
        weeklyPoints: 350
      },
      badges: [availableBadges[0], availableBadges[2]],
      recentActivity: [
        { type: 'participated', challengeTitle: 'Heritage Video Challenge', points: 100, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) }
      ],
      ranking: {
        current: 5,
        previous: 5,
        trend: 'same',
        percentile: 65
      },
      achievements: {
        firstWin: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        perfectStreak: 4,
        totalVotes: 67,
        helpfulVotes: 45
      }
    }
  ];

  const getRankingIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-500" />;
      default: return <Trophy className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />;
      case 'same': return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBadgeRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const toggleDetails = (userId: string) => {
    setShowDetails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const formatPoints = (points: number) => {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points.toString();
  };

  const LeaderboardEntry = ({ user, index }: { user: LeaderboardUser; index: number }) => (
    <Card className={cn(
      "hover:shadow-md transition-all",
      user.id === currentUserId && "ring-2 ring-purple-500 ring-opacity-20",
      index < 3 && "border-l-4",
      index === 0 && "border-l-yellow-500",
      index === 1 && "border-l-gray-400",
      index === 2 && "border-l-orange-500"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Ranking */}
          <div className="flex-shrink-0 w-12 text-center">
            <div className="flex items-center justify-center mb-1">
              {getRankingIcon(user.ranking.current)}
            </div>
            <div className="text-lg font-bold">#{user.ranking.current}</div>
            <div className="flex items-center justify-center">
              {getTrendIcon(user.ranking.trend)}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1" onClick={() => onUserClick?.(user.id)}>
            <div className="flex items-center gap-3 mb-2 cursor-pointer">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold hover:text-purple-600 transition-colors">
                    {user.name}
                  </h3>
                  {user.verified && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Verified
                    </Badge>
                  )}
                  {user.id === currentUserId && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      You
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>Level {user.level}</span>
                  <span>•</span>
                  <span>{user.stats.challengesWon} wins</span>
                  <span>•</span>
                  <span>{user.stats.streakCurrent} streak</span>
                </div>
              </div>
            </div>

            {/* Points and Progress */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatPoints(user.stats.totalPoints)}
                </div>
                <div className="text-xs text-gray-500">Total Points</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {formatPoints(user.stats.monthlyPoints)} this month
                </div>
                <div className="text-xs text-gray-500">
                  {formatPoints(user.stats.weeklyPoints)} this week
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1 mb-3">
              {user.badges.slice(0, 3).map((badge) => (
                <Button
                  key={badge.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 px-2 text-xs",
                    getBadgeRarityColor(badge.rarity)
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBadgeClick?.(badge);
                  }}
                >
                  <span className="mr-1">{badge.icon}</span>
                  {badge.name}
                </Button>
              ))}
              {user.badges.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{user.badges.length - 3}
                </Badge>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                {user.stats.challengesParticipated} challenges
              </span>
              <span className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                {user.stats.streakBest} best streak
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {user.achievements.helpfulVotes} helpful votes
              </span>
            </div>
          </div>

          {/* Expand Details */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleDetails(user.id)}
            className="flex-shrink-0"
          >
            {showDetails.has(user.id) ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails.has(user.id) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t space-y-4"
            >
              {/* Recent Activity */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  {user.recentActivity.slice(0, 3).map((activity, activityIndex) => (
                    <div key={activityIndex} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {activity.type === 'won' && <Crown className="h-4 w-4 text-yellow-600" />}
                        {activity.type === 'participated' && <Users className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'created' && <Plus className="h-4 w-4 text-green-600" />}
                        {activity.type === 'voted' && <Star className="h-4 w-4 text-purple-600" />}
                        <span className="text-gray-700">{activity.challengeTitle}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          +{activity.points} pts
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {Math.floor((Date.now() - activity.timestamp.getTime()) / (1000 * 60 * 60 * 24))}d ago
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Stats */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Win Rate</div>
                    <div className="font-medium">
                      {Math.round((user.stats.challengesWon / user.stats.challengesParticipated) * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Percentile</div>
                    <div className="font-medium">{user.ranking.percentile}th</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Perfect Streak</div>
                    <div className="font-medium">{user.achievements.perfectStreak}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Vote Accuracy</div>
                    <div className="font-medium">
                      {Math.round((user.achievements.helpfulVotes / user.achievements.totalVotes) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Challenge Leaderboard</h2>
          <p className="text-gray-600">Community champions and top performers</p>
        </div>
      </div>

      {/* Current Season Banner */}
      {currentSeason.isActive && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-purple-900 mb-1">
                  🏆 {currentSeason.name}
                </h3>
                <p className="text-purple-700 text-sm mb-2">{currentSeason.theme}</p>
                <div className="text-sm text-purple-600">
                  Ends in {Math.ceil((currentSeason.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-900">
                  {currentSeason.rewards[0].reward}
                </div>
                <div className="text-sm text-purple-700">Grand Prize</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={activeTimeframe}
                onChange={(e) => setActiveTimeframe(e.target.value as any)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="all-time">All Time</option>
                <option value="current-month">This Month</option>
                <option value="current-week">This Week</option>
              </select>
            </div>

            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value as any)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="all">All Categories</option>
              <option value="creative">Creative</option>
              <option value="skill">Skill-based</option>
              <option value="knowledge">Knowledge</option>
              <option value="physical">Physical</option>
              <option value="social">Social</option>
              <option value="charitable">Charitable</option>
            </select>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant={activeView === 'overall' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('overall')}
              >
                Overall
              </Button>
              <Button
                variant={activeView === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('weekly')}
              >
                Weekly
              </Button>
              <Button
                variant={activeView === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('monthly')}
              >
                Monthly
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Podium */}
      <div className="grid md:grid-cols-3 gap-4">
        {leaderboardUsers.slice(0, 3).map((user, index) => (
          <Card key={user.id} className={cn(
            "text-center hover:shadow-lg transition-all cursor-pointer",
            index === 0 && "ring-2 ring-yellow-500 ring-opacity-20",
            index === 1 && "ring-2 ring-gray-400 ring-opacity-20",
            index === 2 && "ring-2 ring-orange-500 ring-opacity-20"
          )}>
            <CardContent className="p-6" onClick={() => onUserClick?.(user.id)}>
              <div className="flex justify-center mb-4">
                {getRankingIcon(index + 1)}
              </div>
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg mb-1">{user.name}</h3>
              <div className="text-sm text-gray-600 mb-3">Level {user.level}</div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {formatPoints(user.stats.totalPoints)}
              </div>
              <div className="text-xs text-gray-500 mb-3">Total Points</div>
              <div className="flex justify-center gap-1">
                {user.badges.slice(0, 2).map((badge) => (
                  <span key={badge.id} className="text-lg" title={badge.name}>
                    {badge.icon}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Full Rankings</h3>
        <div className="space-y-3">
          {leaderboardUsers.map((user, index) => (
            <LeaderboardEntry key={user.id} user={user} index={index} />
          ))}
        </div>
      </div>

      {/* Hall of Fame */}
      {showHallOfFame && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Hall of Fame
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Most Challenge Wins</h4>
                <div className="space-y-2">
                  {leaderboardUsers
                    .sort((a, b) => b.stats.challengesWon - a.stats.challengesWon)
                    .slice(0, 3)
                    .map((user, index) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{user.name}</span>
                      <Badge variant="secondary">{user.stats.challengesWon} wins</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Longest Streaks</h4>
                <div className="space-y-2">
                  {leaderboardUsers
                    .sort((a, b) => b.stats.streakBest - a.stats.streakBest)
                    .slice(0, 3)
                    .map((user, index) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{user.name}</span>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        <Flame className="h-3 w-3 mr-1" />
                        {user.stats.streakBest}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}