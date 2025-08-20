'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Trophy,
  Users,
  Clock,
  Star,
  Gift,
  Zap,
  Camera,
  Mic,
  Palette,
  Dumbbell,
  Brain,
  Heart,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Flame,
  PlayCircle,
  ArrowRight,
  Eye,
  MessageSquare,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Challenge {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  type: 'creative' | 'skill' | 'knowledge' | 'physical' | 'social' | 'charitable';
  status: 'upcoming' | 'active' | 'voting' | 'completed';
  creator: {
    id: string;
    name: string;
    avatar: string;
    role: 'creator' | 'admin';
    verified: boolean;
  };
  prize: {
    type: 'money' | 'product' | 'experience' | 'recognition';
    value: string;
    description: string;
  };
  participation: {
    current: number;
    limit?: number;
    entries: number;
  };
  timeline: {
    startDate: Date;
    endDate: Date;
    votingEndDate: Date;
    resultsDate: Date;
  };
  rules: string[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  trending: boolean;
  featured: boolean;
  category: string;
  socialMetrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

interface ChallengeHubProps {
  view?: 'grid' | 'list';
  filterBy?: 'all' | 'active' | 'upcoming' | 'voting' | 'completed';
  sortBy?: 'newest' | 'ending_soon' | 'popular' | 'trending';
  showFilters?: boolean;
  onChallengeClick?: (challenge: Challenge) => void;
  onCreateChallenge?: () => void;
  onJoinChallenge?: (challengeId: string) => void;
}

export function ChallengeHub({
  view = 'grid',
  filterBy = 'all',
  sortBy = 'trending',
  showFilters = true,
  onChallengeClick,
  onCreateChallenge,
  onJoinChallenge
}: ChallengeHubProps) {
  const [activeView, setActiveView] = React.useState(view);
  const [activeFilter, setActiveFilter] = React.useState(filterBy);
  const [activeSort, setActiveSort] = React.useState(sortBy);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<string>('all');

  // Sample challenges data
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Haitian Heritage Video Challenge',
      description: 'Create a 60-second video showcasing what Haitian heritage means to you. Share stories, traditions, food, music, or any aspect of our beautiful culture that inspires you.',
      shortDescription: 'Create a 60-second video about Haitian heritage',
      type: 'creative',
      status: 'active',
      creator: {
        id: 'creator1',
        name: 'Marie Delacroix',
        avatar: '👩🏾‍🎨',
        role: 'creator',
        verified: true
      },
      prize: {
        type: 'money',
        value: '$500',
        description: 'First place winner receives $500 cash prize'
      },
      participation: {
        current: 234,
        limit: 500,
        entries: 89
      },
      timeline: {
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
        votingEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        resultsDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000)
      },
      rules: [
        'Video must be 60 seconds or less',
        'Original content only',
        'Must include #HaitianHeritage tag',
        'Family-friendly content required'
      ],
      tags: ['heritage', 'culture', 'video', 'creativity'],
      difficulty: 'beginner',
      trending: true,
      featured: true,
      category: 'creative',
      socialMetrics: {
        views: 12500,
        likes: 892,
        comments: 156,
        shares: 78
      }
    },
    {
      id: '2',
      title: 'Kreyòl Tongue Twister Championship',
      description: 'Master and perform the most challenging Kreyòl tongue twisters! Test your pronunciation skills and help preserve our language through fun linguistic challenges.',
      shortDescription: 'Master challenging Kreyòl tongue twisters',
      type: 'skill',
      status: 'active',
      creator: {
        id: 'admin1',
        name: 'Ann Pale Team',
        avatar: '🎤',
        role: 'admin',
        verified: true
      },
      prize: {
        type: 'recognition',
        value: 'Champion Badge',
        description: 'Winner receives Kreyòl Champion badge and feature spotlight'
      },
      participation: {
        current: 156,
        entries: 67
      },
      timeline: {
        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        votingEndDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        resultsDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      },
      rules: [
        'Perform 3 provided tongue twisters',
        'Video must be clear and audible',
        'Native or fluent Kreyòl speakers preferred',
        'Creativity in presentation encouraged'
      ],
      tags: ['kreyol', 'language', 'skill', 'performance'],
      difficulty: 'intermediate',
      trending: false,
      featured: false,
      category: 'skill',
      socialMetrics: {
        views: 8900,
        likes: 445,
        comments: 89,
        shares: 34
      }
    },
    {
      id: '3',
      title: 'Haitian Recipe Recreation',
      description: 'Cook a traditional Haitian dish and share your family recipe or unique twist! Show your cooking process and the final delicious result.',
      shortDescription: 'Cook and share traditional Haitian recipes',
      type: 'creative',
      status: 'upcoming',
      creator: {
        id: 'creator2',
        name: 'Chef Claudette Joseph',
        avatar: '👩🏾‍🍳',
        role: 'creator',
        verified: true
      },
      prize: {
        type: 'product',
        value: 'Cooking Set',
        description: 'Professional Haitian cookbook and premium cooking utensils'
      },
      participation: {
        current: 78,
        limit: 200,
        entries: 0
      },
      timeline: {
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
        votingEndDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
        resultsDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
      },
      rules: [
        'Traditional Haitian dish required',
        'Show cooking process',
        'Include ingredient list',
        'Share recipe story or family connection'
      ],
      tags: ['cooking', 'recipe', 'tradition', 'food'],
      difficulty: 'beginner',
      trending: false,
      featured: true,
      category: 'creative',
      socialMetrics: {
        views: 5600,
        likes: 234,
        comments: 45,
        shares: 67
      }
    },
    {
      id: '4',
      title: 'Haiti Trivia Master',
      description: 'Test your knowledge of Haitian history, culture, geography, and current events in this comprehensive trivia challenge!',
      shortDescription: 'Test your Haiti knowledge in trivia format',
      type: 'knowledge',
      status: 'voting',
      creator: {
        id: 'admin1',
        name: 'Ann Pale Team',
        avatar: '🎤',
        role: 'admin',
        verified: true
      },
      prize: {
        type: 'experience',
        value: 'Virtual Tour',
        description: 'Winner receives guided virtual tour of Haiti with cultural expert'
      },
      participation: {
        current: 345,
        entries: 345
      },
      timeline: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        votingEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        resultsDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      },
      rules: [
        '50 multiple choice questions',
        'Single attempt per participant',
        'Covers history, culture, geography',
        'Time limit: 30 minutes'
      ],
      tags: ['trivia', 'knowledge', 'history', 'culture'],
      difficulty: 'advanced',
      trending: false,
      featured: false,
      category: 'knowledge',
      socialMetrics: {
        views: 15600,
        likes: 678,
        comments: 234,
        shares: 89
      }
    },
    {
      id: '5',
      title: 'Community Kindness Challenge',
      description: 'Perform acts of kindness in your community and document the positive impact. Help spread joy and strengthen our global Haitian community bonds.',
      shortDescription: 'Spread kindness and document community impact',
      type: 'social',
      status: 'active',
      creator: {
        id: 'creator3',
        name: 'Sophia Laurent',
        avatar: '👩🏾‍💻',
        role: 'creator',
        verified: false
      },
      prize: {
        type: 'money',
        value: '$250',
        description: 'Donation to charity of winner\'s choice plus recognition'
      },
      participation: {
        current: 189,
        entries: 45
      },
      timeline: {
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        votingEndDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        resultsDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      rules: [
        'Document 3 acts of kindness',
        'Must impact others positively',
        'Include photos or videos',
        'Explain the impact made'
      ],
      tags: ['kindness', 'community', 'social', 'impact'],
      difficulty: 'beginner',
      trending: true,
      featured: false,
      category: 'social',
      socialMetrics: {
        views: 7800,
        likes: 567,
        comments: 123,
        shares: 89
      }
    }
  ];

  const challengeTypes = [
    { id: 'all', label: 'All Challenges', icon: Target, color: 'text-gray-600' },
    { id: 'creative', label: 'Creative', icon: Palette, color: 'text-purple-600' },
    { id: 'skill', label: 'Skill-based', icon: Star, color: 'text-blue-600' },
    { id: 'knowledge', label: 'Knowledge', icon: Brain, color: 'text-green-600' },
    { id: 'physical', label: 'Physical', icon: Dumbbell, color: 'text-red-600' },
    { id: 'social', label: 'Social', icon: Heart, color: 'text-pink-600' },
    { id: 'charitable', label: 'Charitable', icon: Gift, color: 'text-orange-600' }
  ];

  const formatTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diffInMs = endDate.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffInDays > 0) {
      return `${diffInDays}d ${diffInHours}h left`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h left`;
    } else {
      return 'Ending soon';
    }
  };

  const getStatusBadge = (status: Challenge['status']) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>;
      case 'active':
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case 'voting':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Voting</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Completed</Badge>;
    }
  };

  const getTypeIcon = (type: Challenge['type']) => {
    switch (type) {
      case 'creative': return <Palette className="h-4 w-4 text-purple-600" />;
      case 'skill': return <Star className="h-4 w-4 text-blue-600" />;
      case 'knowledge': return <Brain className="h-4 w-4 text-green-600" />;
      case 'physical': return <Dumbbell className="h-4 w-4 text-red-600" />;
      case 'social': return <Heart className="h-4 w-4 text-pink-600" />;
      case 'charitable': return <Gift className="h-4 w-4 text-orange-600" />;
    }
  };

  const getPrizeIcon = (type: Challenge['prize']['type']) => {
    switch (type) {
      case 'money': return <Trophy className="h-4 w-4 text-yellow-600" />;
      case 'product': return <Gift className="h-4 w-4 text-blue-600" />;
      case 'experience': return <Star className="h-4 w-4 text-purple-600" />;
      case 'recognition': return <Award className="h-4 w-4 text-green-600" />;
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    if (activeFilter !== 'all' && challenge.status !== activeFilter) return false;
    if (selectedType !== 'all' && challenge.type !== selectedType) return false;
    if (searchQuery && !challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !challenge.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (activeSort) {
      case 'newest':
        return b.timeline.startDate.getTime() - a.timeline.startDate.getTime();
      case 'ending_soon':
        return a.timeline.endDate.getTime() - b.timeline.endDate.getTime();
      case 'popular':
        return b.socialMetrics.views - a.socialMetrics.views;
      case 'trending':
        return Number(b.trending) - Number(a.trending);
      default:
        return 0;
    }
  });

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => (
    <Card className={cn(
      "hover:shadow-lg transition-all cursor-pointer overflow-hidden",
      challenge.featured && "ring-2 ring-purple-500 ring-opacity-20",
      challenge.trending && "border-l-4 border-l-orange-500"
    )}>
      <CardContent className="p-0">
        {/* Header with status and trending indicators */}
        <div className="relative p-4 pb-2">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {getTypeIcon(challenge.type)}
              {getStatusBadge(challenge.status)}
              {challenge.featured && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {challenge.trending && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  <Flame className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
          </div>

          {/* Title and description */}
          <h3 
            className="font-bold text-lg mb-2 hover:text-purple-600 transition-colors line-clamp-2"
            onClick={() => onChallengeClick?.(challenge)}
          >
            {challenge.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {challenge.shortDescription}
          </p>

          {/* Creator info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={challenge.creator.avatar} />
              <AvatarFallback className="text-xs">{challenge.creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{challenge.creator.name}</span>
            {challenge.creator.verified && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                Verified
              </Badge>
            )}
          </div>

          {/* Prize info */}
          <div className="flex items-center gap-2 mb-4 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            {getPrizeIcon(challenge.prize.type)}
            <span className="font-semibold text-sm text-yellow-800">{challenge.prize.value}</span>
            <span className="text-xs text-yellow-700">Prize</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium">{challenge.participation.current}</div>
                <div className="text-xs text-gray-500">Participants</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium">{challenge.participation.entries}</div>
                <div className="text-xs text-gray-500">Entries</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              {challenge.status === 'upcoming' 
                ? `Starts ${formatTimeRemaining(challenge.timeline.startDate)}`
                : formatTimeRemaining(challenge.timeline.endDate)
              }
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {challenge.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {challenge.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{challenge.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Social metrics */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {challenge.socialMetrics.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {challenge.socialMetrics.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {challenge.socialMetrics.comments}
            </span>
          </div>

          {/* Action button */}
          <Button 
            className="w-full"
            variant={challenge.status === 'active' ? 'default' : 'outline'}
            onClick={() => onJoinChallenge?.(challenge.id)}
            disabled={challenge.status === 'completed'}
          >
            {challenge.status === 'upcoming' && 'Join Challenge'}
            {challenge.status === 'active' && 'Submit Entry'}
            {challenge.status === 'voting' && 'View Submissions'}
            {challenge.status === 'completed' && 'View Results'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Creator Challenges</h2>
          <p className="text-gray-600">Join exciting challenges created by your favorite Haitian creators</p>
        </div>
        <Button onClick={onCreateChallenge} className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Challenge types */}
              <div className="flex flex-wrap gap-2">
                {challengeTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedType(type.id)}
                      className="flex items-center gap-2"
                    >
                      <Icon className={cn("h-4 w-4", type.color)} />
                      {type.label}
                    </Button>
                  );
                })}
              </div>

              {/* Filters and sort */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value as any)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="voting">Voting</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <select
                    value={activeSort}
                    onChange={(e) => setActiveSort(e.target.value as any)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    <option value="trending">Trending</option>
                    <option value="newest">Newest</option>
                    <option value="ending_soon">Ending Soon</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant={activeView === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveView('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeView === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveView('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Challenge grid/list */}
      <div className={cn(
        activeView === 'grid' 
          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      )}>
        <AnimatePresence>
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ChallengeCard challenge={challenge} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No challenges found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedType !== 'all' || activeFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Be the first to create an exciting challenge for the community!'
            }
          </p>
          {(!searchQuery && selectedType === 'all' && activeFilter === 'all') && (
            <Button onClick={onCreateChallenge}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Challenge
            </Button>
          )}
        </div>
      )}
    </div>
  );
}