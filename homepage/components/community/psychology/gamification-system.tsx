'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Star,
  Crown,
  Award,
  Target,
  Zap,
  Heart,
  MessageSquare,
  Users,
  Calendar,
  BookOpen,
  Handshake,
  Gift,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Lock,
  Unlock,
  Clock,
  Flame,
  Medal,
  Shield,
  Diamond,
  Gem
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'engagement' | 'content' | 'community' | 'special';
  icon: React.ElementType;
  color: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  requirement: number;
  secret?: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  level: number;
  nextLevelPoints: number;
  currentPoints: number;
  benefits: string[];
}

interface Streak {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  currentStreak: number;
  longestStreak: number;
  lastActivity: Date;
  active: boolean;
  multiplier: number;
}

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  points: number;
  level: number;
  rank: number;
  change: number;
  badges: string[];
  persona: string;
}

interface GamificationSystemProps {
  userId?: string;
  showLeaderboard?: boolean;
  showAchievements?: boolean;
  showStreaks?: boolean;
  onAchievementUnlock?: (achievement: Achievement) => void;
  onLevelUp?: (newLevel: number, badge: Badge) => void;
}

export function GamificationSystem({
  userId = 'user-123',
  showLeaderboard = true,
  showAchievements = true,
  showStreaks = true,
  onAchievementUnlock,
  onLevelUp
}: GamificationSystemProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [showUnlocked, setShowUnlocked] = React.useState(false);
  const [celebratingAchievement, setCelebratingAchievement] = React.useState<Achievement | null>(null);

  // Sample achievements data
  const achievements: Achievement[] = [
    {
      id: 'first_post',
      name: 'First Steps',
      description: 'Create your first post in the community',
      category: 'content',
      icon: MessageSquare,
      color: 'bg-blue-500',
      points: 10,
      rarity: 'common',
      unlocked: true,
      unlockedAt: new Date('2024-01-15'),
      progress: 1,
      requirement: 1
    },
    {
      id: 'helpful_member',
      name: 'Helpful Member',
      description: 'Receive 25 helpful votes on your answers',
      category: 'community',
      icon: Heart,
      color: 'bg-red-500',
      points: 50,
      rarity: 'rare',
      unlocked: true,
      unlockedAt: new Date('2024-02-20'),
      progress: 25,
      requirement: 25
    },
    {
      id: 'content_creator',
      name: 'Content Creator',
      description: 'Create 50 high-quality posts',
      category: 'content',
      icon: Star,
      color: 'bg-yellow-500',
      points: 100,
      rarity: 'epic',
      unlocked: false,
      progress: 23,
      requirement: 50
    },
    {
      id: 'community_leader',
      name: 'Community Leader',
      description: 'Become a moderator and help shape the community',
      category: 'special',
      icon: Crown,
      color: 'bg-purple-500',
      points: 200,
      rarity: 'legendary',
      unlocked: false,
      progress: 0,
      requirement: 1
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Connect with 100 community members',
      category: 'community',
      icon: Users,
      color: 'bg-green-500',
      points: 75,
      rarity: 'rare',
      unlocked: false,
      progress: 67,
      requirement: 100
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Be active during morning hours for 30 days',
      category: 'engagement',
      icon: Clock,
      color: 'bg-orange-500',
      points: 40,
      rarity: 'rare',
      unlocked: false,
      progress: 18,
      requirement: 30
    },
    {
      id: 'knowledge_seeker',
      name: 'Knowledge Seeker',
      description: 'Ask 20 thoughtful questions',
      category: 'engagement',
      icon: BookOpen,
      color: 'bg-indigo-500',
      points: 30,
      rarity: 'common',
      unlocked: true,
      unlockedAt: new Date('2024-03-10'),
      progress: 20,
      requirement: 20
    },
    {
      id: 'event_enthusiast',
      name: 'Event Enthusiast',
      description: 'Attend 15 community events',
      category: 'engagement',
      icon: Calendar,
      color: 'bg-pink-500',
      points: 60,
      rarity: 'rare',
      unlocked: false,
      progress: 8,
      requirement: 15
    },
    {
      id: 'mentor',
      name: 'The Mentor',
      description: 'Help 10 new members get started',
      category: 'community',
      icon: Handshake,
      color: 'bg-teal-500',
      points: 150,
      rarity: 'epic',
      unlocked: false,
      progress: 4,
      requirement: 10
    },
    {
      id: 'anniversary',
      name: 'Anniversary',
      description: 'One year of community membership',
      category: 'special',
      icon: Gift,
      color: 'bg-rose-500',
      points: 100,
      rarity: 'epic',
      unlocked: false,
      progress: 8,
      requirement: 12,
      secret: true
    }
  ];

  // Sample badges/levels
  const badges: Badge[] = [
    {
      id: 'newcomer',
      name: 'Newcomer',
      description: 'Welcome to the community!',
      icon: Sparkles,
      color: 'bg-gray-500',
      level: 1,
      nextLevelPoints: 100,
      currentPoints: 85,
      benefits: ['Basic community access', 'Can comment on posts']
    },
    {
      id: 'member',
      name: 'Community Member',
      description: 'Active community participant',
      icon: Users,
      color: 'bg-blue-500',
      level: 2,
      nextLevelPoints: 300,
      currentPoints: 85,
      benefits: ['Create posts', 'Join discussions', 'Attend events']
    },
    {
      id: 'contributor',
      name: 'Valued Contributor',
      description: 'Regular content creator',
      icon: Star,
      color: 'bg-green-500',
      level: 3,
      nextLevelPoints: 600,
      currentPoints: 0,
      benefits: ['Feature content', 'Host discussions', 'Mentor others']
    },
    {
      id: 'expert',
      name: 'Community Expert',
      description: 'Recognized knowledge leader',
      icon: Award,
      color: 'bg-purple-500',
      level: 4,
      nextLevelPoints: 1000,
      currentPoints: 0,
      benefits: ['Moderation tools', 'Expert badge', 'Priority support']
    },
    {
      id: 'legend',
      name: 'Community Legend',
      description: 'Elite community member',
      icon: Crown,
      color: 'bg-yellow-500',
      level: 5,
      nextLevelPoints: 0,
      currentPoints: 0,
      benefits: ['Full privileges', 'Community influence', 'Special recognition']
    }
  ];

  // Sample streaks
  const streaks: Streak[] = [
    {
      id: 'daily_login',
      name: 'Daily Visitor',
      description: 'Log in every day',
      icon: Calendar,
      currentStreak: 7,
      longestStreak: 15,
      lastActivity: new Date(),
      active: true,
      multiplier: 1.1
    },
    {
      id: 'weekly_post',
      name: 'Weekly Creator',
      description: 'Post at least once per week',
      icon: MessageSquare,
      currentStreak: 3,
      longestStreak: 8,
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      active: true,
      multiplier: 1.2
    },
    {
      id: 'helpful_answers',
      name: 'Helper Streak',
      description: 'Provide helpful answers daily',
      icon: Heart,
      currentStreak: 0,
      longestStreak: 5,
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      active: false,
      multiplier: 1.15
    }
  ];

  // Sample leaderboard
  const leaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      userId: 'user-456',
      username: 'Marie Delacroix',
      avatar: '👩🏾‍🎨',
      points: 2450,
      level: 4,
      rank: 1,
      change: 0,
      badges: ['expert', 'mentor', 'content_creator'],
      persona: 'leader'
    },
    {
      id: '2',
      userId: 'user-789',
      username: 'Jean Baptiste',
      avatar: '👨🏾‍💼',
      points: 2340,
      level: 4,
      rank: 2,
      change: 1,
      badges: ['expert', 'social_butterfly', 'helpful_member'],
      persona: 'contributor'
    },
    {
      id: '3',
      userId: 'user-123',
      username: 'You',
      avatar: '👤',
      points: 2180,
      level: 3,
      rank: 3,
      change: -1,
      badges: ['contributor', 'helpful_member', 'knowledge_seeker'],
      persona: 'contributor'
    },
    {
      id: '4',
      userId: 'user-321',
      username: 'Sophia Laurent',
      avatar: '👩🏾‍💻',
      points: 1950,
      level: 3,
      rank: 4,
      change: 2,
      badges: ['contributor', 'event_enthusiast'],
      persona: 'connector'
    },
    {
      id: '5',
      userId: 'user-654',
      username: 'Marcus Thompson',
      avatar: '👨🏾‍🎓',
      points: 1820,
      level: 3,
      rank: 5,
      change: -1,
      badges: ['contributor', 'knowledge_seeker'],
      persona: 'questioner'
    }
  ];

  const currentUserBadge = badges[1]; // Community Member
  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
    }
  };

  const getRarityBadgeColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (change < 0) return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
    return <TrendingUp className="h-3 w-3 text-gray-600 rotate-90" />;
  };

  const simulateAchievementUnlock = (achievement: Achievement) => {
    setCelebratingAchievement(achievement);
    onAchievementUnlock?.(achievement);
    setTimeout(() => setCelebratingAchievement(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Achievement Celebration Modal */}
      <AnimatePresence>
        {celebratingAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-lg p-6 text-center max-w-sm w-full"
            >
              <div className="mb-4">
                <div className={cn("w-16 h-16 rounded-full mx-auto flex items-center justify-center", celebratingAchievement.color)}>
                  <celebratingAchievement.icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Achievement Unlocked!</h3>
              <h4 className="font-semibold text-purple-600">{celebratingAchievement.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{celebratingAchievement.description}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">+{celebratingAchievement.points} points</span>
              </div>
              <Button onClick={() => setCelebratingAchievement(null)}>
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Level & Progress */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white", currentUserBadge.color)}>
              <currentUserBadge.icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{currentUserBadge.name}</h3>
                <Badge variant="secondary">Level {currentUserBadge.level}</Badge>
              </div>
              <p className="text-sm text-gray-600">{currentUserBadge.description}</p>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress to next level</span>
                  <span>{currentUserBadge.currentPoints}/{currentUserBadge.nextLevelPoints}</span>
                </div>
                <Progress value={(currentUserBadge.currentPoints / currentUserBadge.nextLevelPoints) * 100} className="h-2" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-purple-600">2,180</div>
              <div className="text-xs text-gray-600">Total Points</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-green-600">{achievements.filter(a => a.unlocked).length}</div>
              <div className="text-xs text-gray-600">Achievements</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-blue-600">#{leaderboard.find(l => l.userId === userId)?.rank}</div>
              <div className="text-xs text-gray-600">Ranking</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      {showAchievements && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={showUnlocked ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowUnlocked(!showUnlocked)}
                >
                  {showUnlocked ? 'All' : 'Unlocked'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto">
                {['all', 'engagement', 'content', 'community', 'special'].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAchievements
                .filter(achievement => !showUnlocked || achievement.unlocked)
                .map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all cursor-pointer",
                        getRarityColor(achievement.rarity),
                        achievement.unlocked ? "opacity-100" : "opacity-60"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !achievement.unlocked && achievement.progress && achievement.progress > 0 && 
                        simulateAchievementUnlock(achievement)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", achievement.color)}>
                          {achievement.unlocked ? (
                            <Icon className="h-5 w-5 text-white" />
                          ) : (
                            <Lock className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">{achievement.secret && !achievement.unlocked ? '???' : achievement.name}</h4>
                            <Badge className={cn("text-xs", getRarityBadgeColor(achievement.rarity))}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">
                            {achievement.secret && !achievement.unlocked ? 'Secret achievement' : achievement.description}
                          </p>
                        </div>
                      </div>

                      {!achievement.unlocked && achievement.progress !== undefined && !achievement.secret && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.requirement}</span>
                          </div>
                          <Progress value={(achievement.progress / achievement.requirement) * 100} className="h-1" />
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-yellow-600" />
                          <span className="text-xs font-medium">{achievement.points} pts</span>
                        </div>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <span className="text-xs text-gray-500">
                            {achievement.unlockedAt.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streaks Section */}
      {showStreaks && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-600" />
              Activity Streaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {streaks.map((streak) => {
                const Icon = streak.icon;
                return (
                  <div
                    key={streak.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      streak.active ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        streak.active ? "bg-orange-500" : "bg-gray-500"
                      )}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{streak.name}</h4>
                        <p className="text-xs text-gray-600">{streak.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Current Streak</span>
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-600" />
                          <span className="font-bold text-orange-600">{streak.currentStreak}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>Best: {streak.longestStreak}</span>
                        <span>+{((streak.multiplier - 1) * 100).toFixed(0)}% bonus</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Section */}
      {showLeaderboard && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-yellow-600" />
              Community Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg",
                    entry.userId === userId ? "bg-purple-50 border border-purple-200" : "bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                      entry.rank <= 3 ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"
                    )}>
                      {entry.rank <= 3 ? (
                        entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'
                      ) : (
                        entry.rank
                      )}
                    </div>
                    <div className="text-2xl">{entry.avatar}</div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{entry.username}</h4>
                      {entry.userId === userId && <Badge>You</Badge>}
                      <Badge variant="outline">Level {entry.level}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{entry.points.toLocaleString()} points</span>
                      <span>•</span>
                      <span className="capitalize">{entry.persona}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getChangeIcon(entry.change)}
                    <span className="text-2xl font-bold text-gray-700">#{entry.rank}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}