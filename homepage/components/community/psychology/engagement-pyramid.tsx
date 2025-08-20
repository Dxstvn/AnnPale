'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Crown,
  Star,
  MessageSquare,
  Eye,
  Ghost,
  TrendingUp,
  Award,
  Target,
  Zap,
  Heart,
  ThumbsUp,
  Share2,
  Calendar,
  Trophy,
  CheckCircle,
  ArrowUp,
  BarChart3,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface EngagementLevel {
  id: string;
  level: number;
  name: string;
  description: string;
  percentage: number;
  color: string;
  icon: React.ElementType;
  requirements: string[];
  benefits: string[];
  activities: string[];
  nextLevelPoints: number;
  currentPoints: number;
}

interface UserEngagementData {
  userId: string;
  currentLevel: number;
  totalPoints: number;
  weeklyActivity: number;
  monthlyActivity: number;
  achievements: string[];
  joinDate: Date;
  lastActive: Date;
  progressToNext: number;
}

interface EngagementPyramidProps {
  userData?: UserEngagementData;
  showPersonalProgress?: boolean;
  showCommunityStats?: boolean;
  onLevelUp?: (newLevel: number) => void;
  onActivityComplete?: (activity: string, points: number) => void;
}

export function EngagementPyramid({
  userData,
  showPersonalProgress = true,
  showCommunityStats = true,
  onLevelUp,
  onActivityComplete
}: EngagementPyramidProps) {
  const [selectedLevel, setSelectedLevel] = React.useState<number | null>(null);
  const [showRewards, setShowRewards] = React.useState(false);

  // Define the 5-level engagement pyramid
  const engagementLevels: EngagementLevel[] = [
    {
      id: 'lurkers',
      level: 1,
      name: 'Lurkers',
      description: 'Silent observers who value reading and learning',
      percentage: 50,
      color: 'bg-gray-500',
      icon: Ghost,
      requirements: ['Account created', 'Email verified'],
      benefits: ['Access to all content', 'Email notifications', 'Bookmark content'],
      activities: ['Read posts', 'View profiles', 'Browse events', 'Save favorites'],
      nextLevelPoints: 100,
      currentPoints: 0
    },
    {
      id: 'observers',
      level: 2,
      name: 'Observers',
      description: 'Occasional participants with growing engagement',
      percentage: 30,
      color: 'bg-blue-500',
      icon: Eye,
      requirements: ['50+ content views', '5+ likes given', '3+ follows'],
      benefits: ['Profile customization', 'Comment on posts', 'Join discussions'],
      activities: ['Like content', 'Follow creators', 'Attend events', 'Share content'],
      nextLevelPoints: 500,
      currentPoints: 100
    },
    {
      id: 'participants',
      level: 3,
      name: 'Participants',
      description: 'Active members contributing regularly',
      percentage: 15,
      color: 'bg-green-500',
      icon: MessageSquare,
      requirements: ['10+ posts/comments', '25+ interactions', '10+ event attendances'],
      benefits: ['Create posts', 'Host discussions', 'Event calendar access'],
      activities: ['Post regularly', 'Comment actively', 'Join events', 'Help others'],
      nextLevelPoints: 1500,
      currentPoints: 500
    },
    {
      id: 'contributors',
      level: 4,
      name: 'Contributors',
      description: 'Content creators and community builders',
      percentage: 4,
      color: 'bg-purple-500',
      icon: Star,
      requirements: ['50+ quality posts', '100+ helpful interactions', 'Mentor 5+ users'],
      benefits: ['Create events', 'Feature content', 'Moderation tools'],
      activities: ['Create content', 'Answer questions', 'Welcome newcomers', 'Share resources'],
      nextLevelPoints: 5000,
      currentPoints: 1500
    },
    {
      id: 'leaders',
      level: 5,
      name: 'Leaders',
      description: 'Community moderators and culture shapers',
      percentage: 1,
      color: 'bg-yellow-500',
      icon: Crown,
      requirements: ['500+ community points', '50+ mentored users', 'Trusted by community'],
      benefits: ['Full moderation', 'Community governance', 'Platform influence'],
      activities: ['Moderate forums', 'Organize events', 'Shape culture', 'Guide strategy'],
      nextLevelPoints: 10000,
      currentPoints: 5000
    }
  ];

  // Sample user data
  const sampleUserData: UserEngagementData = {
    userId: 'user-123',
    currentLevel: 3,
    totalPoints: 750,
    weeklyActivity: 45,
    monthlyActivity: 180,
    achievements: ['First Post', 'Community Helper', 'Event Attendee', 'Rising Star'],
    joinDate: new Date('2023-06-15'),
    lastActive: new Date(),
    progressToNext: 65
  };

  const displayUserData = userData || sampleUserData;
  const currentLevel = engagementLevels.find(level => level.level === displayUserData.currentLevel);
  const nextLevel = engagementLevels.find(level => level.level === displayUserData.currentLevel + 1);

  const handleActivityComplete = (activity: string) => {
    const points = Math.floor(Math.random() * 20) + 5; // 5-25 points
    onActivityComplete?.(activity, points);
  };

  const getLevelIcon = (level: EngagementLevel) => {
    const Icon = level.icon;
    return <Icon className="h-4 w-4" />;
  };

  const calculateCommunityDistribution = () => {
    return engagementLevels.map(level => ({
      ...level,
      memberCount: Math.floor((level.percentage / 100) * 1247) // Sample total members
    }));
  };

  const communityDistribution = calculateCommunityDistribution();

  return (
    <div className="space-y-6">
      {/* Personal Progress Section */}
      {showPersonalProgress && currentLevel && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Your Engagement Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white", currentLevel.color)}>
                {getLevelIcon(currentLevel)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{currentLevel.name}</h3>
                  <Badge variant="secondary">Level {currentLevel.level}</Badge>
                </div>
                <p className="text-sm text-gray-600">{currentLevel.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-purple-600 font-medium">{displayUserData.totalPoints} points</span>
                  <span className="text-gray-500">Active {Math.floor((Date.now() - displayUserData.lastActive.getTime()) / (1000 * 60 * 60 * 24))} days ago</span>
                </div>
              </div>
            </div>

            {nextLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {nextLevel.name}</span>
                  <span>{displayUserData.progressToNext}%</span>
                </div>
                <Progress value={displayUserData.progressToNext} className="h-2" />
                <p className="text-xs text-gray-600">
                  {nextLevel.nextLevelPoints - displayUserData.totalPoints} points to next level
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-green-600">{displayUserData.weeklyActivity}</div>
                <div className="text-xs text-gray-600">Weekly Activity</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-blue-600">{displayUserData.achievements.length}</div>
                <div className="text-xs text-gray-600">Achievements</div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowRewards(!showRewards)}
            >
              <Trophy className="h-4 w-4 mr-2" />
              View Achievements
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Achievements Popup */}
      <AnimatePresence>
        {showRewards && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-lg w-full max-w-md max-h-80 overflow-y-auto">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Your Achievements</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowRewards(false)}>
                    ×
                  </Button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {displayUserData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Engagement Pyramid Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Community Engagement Pyramid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {engagementLevels.reverse().map((level, index) => {
              const communityLevel = communityDistribution.find(cl => cl.level === level.level);
              const isCurrentLevel = displayUserData.currentLevel === level.level;
              
              return (
                <motion.div
                  key={level.id}
                  className={cn(
                    "relative overflow-hidden rounded-lg border transition-all cursor-pointer",
                    isCurrentLevel ? "border-purple-600 shadow-lg" : "border-gray-200 hover:border-gray-300",
                    selectedLevel === level.level && "ring-2 ring-purple-600"
                  )}
                  onClick={() => setSelectedLevel(selectedLevel === level.level ? null : level.level)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", level.color)}>
                        {getLevelIcon(level)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{level.name}</h4>
                          <Badge variant="outline">Level {level.level}</Badge>
                          {isCurrentLevel && <Badge className="bg-purple-600">Your Level</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{level.percentage}%</div>
                        <div className="text-xs text-gray-500">
                          {communityLevel?.memberCount} members
                        </div>
                      </div>
                    </div>

                    {/* Level Details */}
                    <AnimatePresence>
                      {selectedLevel === level.level && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <h5 className="font-medium text-sm mb-2">Requirements</h5>
                              <ul className="space-y-1">
                                {level.requirements.map((req, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-sm mb-2">Benefits</h5>
                              <ul className="space-y-1">
                                {level.benefits.map((benefit, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-600" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-sm mb-2">Activities</h5>
                              <div className="space-y-1">
                                {level.activities.map((activity, idx) => (
                                  <Button
                                    key={idx}
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-1 text-xs justify-start"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleActivityComplete(activity);
                                    }}
                                  >
                                    <Zap className="h-3 w-3 mr-1" />
                                    {activity}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Visual Progress Bar */}
                  <div 
                    className={cn("h-2", level.color)}
                    style={{ width: `${level.percentage}%` }}
                  />
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Community Stats */}
      {showCommunityStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Health Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-sm text-gray-600">Total Members</div>
                <div className="text-xs text-green-600 mt-1">↑ 12% this month</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">73%</div>
                <div className="text-sm text-gray-600">Active Members</div>
                <div className="text-xs text-green-600 mt-1">↑ 8% this week</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">4.8</div>
                <div className="text-sm text-gray-600">Engagement Score</div>
                <div className="text-xs text-green-600 mt-1">↑ 0.3 this month</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">89%</div>
                <div className="text-sm text-gray-600">Retention Rate</div>
                <div className="text-xs text-green-600 mt-1">↑ 5% this quarter</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}