'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Sparkles,
  TrendingUp,
  Heart,
  Globe,
  Star,
  Activity,
  UserPlus,
  Clock,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CommunityStats {
  totalMembers: number;
  activeToday: number;
  postsToday: number;
  discussions: number;
  events: number;
  connections: number;
  onlineNow: number;
  newThisWeek: number;
}

interface CommunityMilestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'growth' | 'engagement' | 'content' | 'achievement';
  icon: React.ElementType;
  color: string;
}

interface WelcomeHeroProps {
  isAuthenticated?: boolean;
  userRole?: 'member' | 'creator' | 'moderator' | 'admin';
  onJoinCommunity?: () => void;
  onCreatePost?: () => void;
  onViewEvents?: () => void;
}

export function WelcomeHero({
  isAuthenticated = false,
  userRole = 'member',
  onJoinCommunity,
  onCreatePost,
  onViewEvents
}: WelcomeHeroProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Sample community stats
  const stats: CommunityStats = {
    totalMembers: 12847,
    activeToday: 2341,
    postsToday: 89,
    discussions: 156,
    events: 12,
    connections: 8924,
    onlineNow: 487,
    newThisWeek: 234
  };

  // Sample recent milestones
  const milestones: CommunityMilestone[] = [
    {
      id: '1',
      title: '12K Members Reached!',
      description: 'Our community continues to grow strong',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'growth',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: '2',
      title: 'Marie Delacroix Featured',
      description: 'Creator spotlight in community showcase',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      type: 'achievement',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: '3',
      title: 'Virtual Konpa Night',
      description: 'Amazing turnout with 500+ attendees',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      type: 'engagement',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjou! Good morning';
    if (hour < 17) return 'Bon apre midi! Good afternoon';
    return 'Bonswa! Good evening';
  };

  const formatStat = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-48 h-48 bg-pink-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-300 rounded-full blur-xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Welcome Content */}
          <div className="lg:col-span-2 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Ann Pale Community Hub
                </Badge>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {getGreeting()}, welcome to our community! 🇭🇹
              </h1>
              
              <p className="text-xl lg:text-2xl mb-6 text-white/90 leading-relaxed">
                Connect with fellow Haitians, support amazing creators, and celebrate our rich culture together. 
                This is your home for authentic conversations and meaningful connections.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold">{formatStat(stats.totalMembers)}</div>
                  <div className="text-sm text-white/80">Community Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold">{stats.onlineNow}</div>
                  <div className="text-sm text-white/80">Online Now</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold">{stats.postsToday}</div>
                  <div className="text-sm text-white/80">Posts Today</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {!isAuthenticated ? (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                      onClick={onJoinCommunity}
                    >
                      <UserPlus className="h-5 w-5 mr-2" />
                      Join Our Community
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white text-white hover:bg-white/10 bg-transparent"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Explore Communities
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                      onClick={onCreatePost}
                    >
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Start a Discussion
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white text-white hover:bg-white/10 bg-transparent"
                      onClick={onViewEvents}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      View Events
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Community Activity Sidebar */}
          <div className="space-y-6">
            {/* Live Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5" />
                    Live Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Jean Baptiste posted in Konpa Music</div>
                      <div className="text-xs text-white/70">2 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">5 new replies in "Haiti Travel Tips"</div>
                      <div className="text-xs text-white/70">5 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Virtual Cooking Class starting soon</div>
                      <div className="text-xs text-white/70">in 30 minutes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Community Milestones */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5" />
                    Recent Wins
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {milestones.map((milestone) => {
                    const Icon = milestone.icon;
                    return (
                      <div key={milestone.id} className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", milestone.color === 'text-blue-600' ? 'bg-blue-500' : milestone.color === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-purple-500')}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{milestone.title}</div>
                          <div className="text-xs text-white/70">{milestone.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">+{stats.newThisWeek}</div>
                      <div className="text-xs text-white/70">New Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.discussions}</div>
                      <div className="text-xs text-white/70">Discussions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.events}</div>
                      <div className="text-xs text-white/70">Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-pink-400">{formatStat(stats.connections)}</div>
                      <div className="text-xs text-white/70">Connections</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}