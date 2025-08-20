'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy,
  Crown,
  Medal,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronUp,
  ChevronDown,
  Calendar,
  Clock,
  Users,
  Filter,
  Globe,
  MapPin,
  Flame,
  Target,
  Zap,
  Heart,
  MessageSquare,
  Video,
  Gift,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Info,
  Share2,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardEntry {
  id: string;
  rank: number;
  previousRank?: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
    level: string;
    country?: string;
    verified?: boolean;
  };
  stats: {
    points: number;
    badges: number;
    streak: number;
    contributions: number;
    helpfulness: number;
  };
  change?: 'up' | 'down' | 'same' | 'new';
  changeAmount?: number;
  specialty?: string;
}

interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  metric: string;
  color: string;
}

interface RecognitionAward {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  recipient?: string;
  date?: Date;
  value?: string;
}

interface RecognitionLeaderboardsProps {
  currentUserId?: string;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'alltime';
  category?: string;
  onViewProfile?: (userId: string) => void;
  onFollowUser?: (userId: string) => void;
  onShareRank?: () => void;
  showRecognition?: boolean;
  showFilters?: boolean;
}

export function RecognitionLeaderboards({
  currentUserId = 'user1',
  timeframe = 'monthly',
  category = 'overall',
  onViewProfile,
  onFollowUser,
  onShareRank,
  showRecognition = true,
  showFilters = true
}: RecognitionLeaderboardsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(timeframe);
  const [selectedCategory, setSelectedCategory] = React.useState(category);
  const [expandedUser, setExpandedUser] = React.useState<string | null>(null);
  const [showMyRank, setShowMyRank] = React.useState(false);

  // Leaderboard categories
  const categories: LeaderboardCategory[] = [
    {
      id: 'overall',
      name: 'Overall',
      description: 'Total points earned',
      icon: Trophy,
      metric: 'points',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'helpfulness',
      name: 'Most Helpful',
      description: 'Community support champions',
      icon: Heart,
      metric: 'helpfulness',
      color: 'text-pink-600 bg-pink-100'
    },
    {
      id: 'creativity',
      name: 'Most Creative',
      description: 'Creative content leaders',
      icon: Star,
      metric: 'contributions',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 'consistency',
      name: 'Consistency',
      description: 'Longest streaks',
      icon: Flame,
      metric: 'streak',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      id: 'creator',
      name: 'Top Creators',
      description: 'Content creation leaders',
      icon: Video,
      metric: 'contributions',
      color: 'text-blue-600 bg-blue-100'
    }
  ];

  // Sample leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    {
      id: '1',
      rank: 1,
      previousRank: 2,
      user: {
        id: 'user2',
        name: 'Marie Delacroix',
        avatar: '👩🏾‍🎨',
        level: 'Expert',
        country: 'Haiti',
        verified: true
      },
      stats: {
        points: 8750,
        badges: 42,
        streak: 85,
        contributions: 234,
        helpfulness: 98
      },
      change: 'up',
      changeAmount: 1,
      specialty: 'Cultural Content'
    },
    {
      id: '2',
      rank: 2,
      previousRank: 1,
      user: {
        id: 'user3',
        name: 'Jean Baptiste',
        avatar: '👨🏾‍💼',
        level: 'Leader',
        country: 'USA',
        verified: true
      },
      stats: {
        points: 8420,
        badges: 38,
        streak: 120,
        contributions: 189,
        helpfulness: 95
      },
      change: 'down',
      changeAmount: 1,
      specialty: 'Community Support'
    },
    {
      id: '3',
      rank: 3,
      previousRank: 3,
      user: {
        id: 'user4',
        name: 'Sophia Laurent',
        avatar: '👩🏾‍🏫',
        level: 'Expert',
        country: 'Canada',
        verified: true
      },
      stats: {
        points: 7890,
        badges: 35,
        streak: 67,
        contributions: 201,
        helpfulness: 92
      },
      change: 'same',
      specialty: 'Educational Content'
    },
    {
      id: '4',
      rank: 4,
      previousRank: 6,
      user: {
        id: 'user5',
        name: 'Marcus Thompson',
        avatar: '👨🏾‍💻',
        level: 'Contributor',
        country: 'UK'
      },
      stats: {
        points: 6540,
        badges: 28,
        streak: 45,
        contributions: 156,
        helpfulness: 88
      },
      change: 'up',
      changeAmount: 2,
      specialty: 'Tech Tutorials'
    },
    {
      id: '5',
      rank: 5,
      previousRank: 4,
      user: {
        id: 'user6',
        name: 'Lucienne Toussaint',
        avatar: '👩🏾‍🎤',
        level: 'Contributor',
        country: 'France'
      },
      stats: {
        points: 5890,
        badges: 25,
        streak: 30,
        contributions: 134,
        helpfulness: 85
      },
      change: 'down',
      changeAmount: 1,
      specialty: 'Music & Arts'
    },
    {
      id: 'current',
      rank: 156,
      previousRank: 162,
      user: {
        id: currentUserId,
        name: 'You',
        avatar: '🎭',
        level: 'Member',
        country: 'USA'
      },
      stats: {
        points: 1250,
        badges: 15,
        streak: 14,
        contributions: 23,
        helpfulness: 45
      },
      change: 'up',
      changeAmount: 6,
      specialty: 'Getting Started'
    }
  ];

  // Recognition awards
  const recognitionAwards: RecognitionAward[] = [
    {
      id: 'contributor-month',
      name: 'Contributor of the Month',
      description: 'Most valuable contributions this month',
      icon: Trophy,
      recipient: 'Marie Delacroix',
      date: new Date('2024-03-01'),
      value: '500 bonus points'
    },
    {
      id: 'helper-week',
      name: 'Helper of the Week',
      description: 'Most helpful community member',
      icon: Heart,
      recipient: 'Jean Baptiste',
      date: new Date('2024-03-15'),
      value: '100 bonus points'
    },
    {
      id: 'creative-star',
      name: 'Creative Star',
      description: 'Most creative content',
      icon: Star,
      recipient: 'Sophia Laurent',
      date: new Date('2024-03-10'),
      value: 'Featured creator status'
    },
    {
      id: 'community-choice',
      name: 'Community Choice',
      description: 'Voted by the community',
      icon: Users,
      recipient: 'Marcus Thompson',
      date: new Date('2024-03-05'),
      value: 'VIP badge'
    }
  ];

  const getRankChange = (entry: LeaderboardEntry) => {
    if (!entry.change || entry.change === 'same') return null;
    
    if (entry.change === 'up') {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUp className="h-3 w-3" />
          <span className="text-xs">{entry.changeAmount}</span>
        </div>
      );
    }
    
    if (entry.change === 'down') {
      return (
        <div className="flex items-center text-red-600">
          <ArrowDown className="h-3 w-3" />
          <span className="text-xs">{entry.changeAmount}</span>
        </div>
      );
    }
    
    if (entry.change === 'new') {
      return <Badge variant="secondary" className="text-xs">New</Badge>;
    }
    
    return <Minus className="h-3 w-3 text-gray-400" />;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />;
    return null;
  };

  const getMetricValue = (entry: LeaderboardEntry, metric: string) => {
    switch (metric) {
      case 'points': return entry.stats.points;
      case 'badges': return entry.stats.badges;
      case 'streak': return entry.stats.streak;
      case 'contributions': return entry.stats.contributions;
      case 'helpfulness': return entry.stats.helpfulness;
      default: return entry.stats.points;
    }
  };

  const currentUserEntry = leaderboardData.find(e => e.user.id === currentUserId);
  const topEntries = leaderboardData.filter(e => e.user.id !== currentUserId).slice(0, 10);

  const renderLeaderboardEntry = (entry: LeaderboardEntry, isCurrentUser = false) => {
    const isExpanded = expandedUser === entry.id;
    const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];
    const metricValue = getMetricValue(entry, currentCategory.metric);

    return (
      <motion.div
        key={entry.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: entry.rank * 0.05 }}
      >
        <Card className={cn(
          "hover:shadow-md transition-all cursor-pointer",
          isCurrentUser && "border-purple-500 bg-purple-50",
          entry.rank <= 3 && "border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50"
        )}
        onClick={() => setExpandedUser(isExpanded ? null : entry.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "text-2xl font-bold",
                    entry.rank === 1 && "text-yellow-500",
                    entry.rank === 2 && "text-gray-400",
                    entry.rank === 3 && "text-orange-600"
                  )}>
                    #{entry.rank}
                  </div>
                  {getRankIcon(entry.rank)}
                  {getRankChange(entry)}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={entry.user.avatar} />
                    <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{entry.user.name}</h4>
                      {entry.user.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {entry.user.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      {entry.user.country && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {entry.user.country}
                        </span>
                      )}
                      {entry.specialty && (
                        <span>{entry.specialty}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Metric */}
              <div className="text-right">
                <div className="text-2xl font-bold">{metricValue.toLocaleString()}</div>
                <div className="text-sm text-gray-500 capitalize">{currentCategory.metric}</div>
              </div>
            </div>

            {/* Expanded Stats */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t"
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-purple-600">{entry.stats.points}</div>
                      <div className="text-xs text-gray-600">Points</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{entry.stats.badges}</div>
                      <div className="text-xs text-gray-600">Badges</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{entry.stats.streak}</div>
                      <div className="text-xs text-gray-600">Streak</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{entry.stats.contributions}</div>
                      <div className="text-xs text-gray-600">Contributions</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-pink-600">{entry.stats.helpfulness}%</div>
                      <div className="text-xs text-gray-600">Helpfulness</div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile?.(entry.user.id);
                      }}
                    >
                      View Profile
                    </Button>
                    {!isCurrentUser && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFollowUser?.(entry.user.id);
                        }}
                      >
                        Follow
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
  };

  const renderRecognitionSection = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Recognition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {recognitionAwards.map((award) => {
              const Icon = award.icon;
              return (
                <div key={award.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{award.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{award.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-600">{award.recipient}</span>
                      {award.value && (
                        <Badge variant="secondary" className="text-xs">
                          {award.value}
                        </Badge>
                      )}
                    </div>
                    {award.date && (
                      <div className="text-xs text-gray-500 mt-1">
                        {award.date.toLocaleDateString()}
                      </div>
                    )}
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
          <h2 className="text-2xl font-bold">Leaderboards & Recognition</h2>
          <p className="text-gray-600">Compete, climb ranks, and earn recognition</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowMyRank(!showMyRank)}
          >
            <Target className="h-4 w-4 mr-2" />
            My Rank: #{currentUserEntry?.rank}
          </Button>
          <Button 
            variant="outline"
            onClick={onShareRank}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Timeframe */}
              <div className="flex gap-2">
                {(['daily', 'weekly', 'monthly', 'alltime'] as const).map((tf) => (
                  <Button
                    key={tf}
                    variant={selectedTimeframe === tf ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeframe(tf)}
                    className="capitalize"
                  >
                    {tf === 'alltime' ? 'All Time' : tf}
                  </Button>
                ))}
              </div>

              {/* Categories */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {cat.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recognition Section */}
      {showRecognition && renderRecognitionSection()}

      {/* Top 3 Podium */}
      <div className="grid md:grid-cols-3 gap-4">
        {topEntries.slice(0, 3).map((entry, index) => {
          const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];
          const metricValue = getMetricValue(entry, currentCategory.metric);
          
          return (
            <Card 
              key={entry.id}
              className={cn(
                "relative overflow-hidden cursor-pointer hover:shadow-lg transition-all",
                index === 0 && "md:order-2 md:scale-105 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50",
                index === 1 && "md:order-1 border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100",
                index === 2 && "md:order-3 border-orange-300 bg-gradient-to-br from-orange-50 to-red-50"
              )}
              onClick={() => onViewProfile?.(entry.user.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="absolute top-2 right-2">
                  {getRankIcon(entry.rank)}
                </div>
                
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarImage src={entry.user.avatar} />
                  <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <h3 className="font-bold text-lg mb-1">{entry.user.name}</h3>
                <Badge variant="outline" className="mb-3">
                  {entry.user.level}
                </Badge>
                
                <div className="text-3xl font-bold mb-1">{metricValue.toLocaleString()}</div>
                <div className="text-sm text-gray-600 capitalize">{currentCategory.metric}</div>
                
                {entry.specialty && (
                  <Badge variant="secondary" className="mt-3 text-xs">
                    {entry.specialty}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <div className="space-y-2">
        {topEntries.slice(3).map((entry) => renderLeaderboardEntry(entry))}
        
        {/* Current User Position */}
        {showMyRank && currentUserEntry && (
          <>
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <div className="h-px bg-gray-300 flex-1" />
                <ChevronDown className="h-4 w-4" />
                <span className="text-sm">Your Position</span>
                <ChevronDown className="h-4 w-4" />
                <div className="h-px bg-gray-300 flex-1" />
              </div>
            </div>
            {renderLeaderboardEntry(currentUserEntry, true)}
          </>
        )}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">
          View Full Leaderboard
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}