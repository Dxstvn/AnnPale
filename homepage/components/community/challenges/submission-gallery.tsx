'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart,
  MessageSquare,
  Share2,
  Eye,
  Trophy,
  Star,
  Clock,
  PlayCircle,
  Image as ImageIcon,
  FileText,
  Headphones,
  Filter,
  Grid,
  List,
  Search,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Flag,
  Download,
  ExternalLink,
  Award,
  Crown,
  Medal,
  Users,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Submission {
  id: string;
  challengeId: string;
  title: string;
  description: string;
  submitter: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
    badges: string[];
  };
  content: {
    type: 'video' | 'image' | 'text' | 'audio' | 'mixed';
    url?: string;
    thumbnail?: string;
    text?: string;
    duration?: number; // for video/audio in seconds
    fileSize?: number;
  };
  submission: {
    submittedAt: Date;
    lastUpdated: Date;
    status: 'pending' | 'approved' | 'rejected';
  };
  engagement: {
    votes: number;
    likes: number;
    comments: number;
    shares: number;
    views: number;
    bookmarks: number;
  };
  ranking: {
    position?: number;
    percentile: number;
    trending: boolean;
    featured: boolean;
  };
  tags: string[];
  metadata: {
    device?: string;
    location?: string;
    duration?: string;
    collaborators?: string[];
  };
}

interface Vote {
  id: string;
  submissionId: string;
  userId: string;
  criteria: Record<string, number>; // criteria name -> score (1-10)
  comment?: string;
  timestamp: Date;
  weight: number; // voting weight based on user level/role
}

interface Comment {
  id: string;
  submissionId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: 'member' | 'creator' | 'moderator' | 'admin';
  };
  content: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
  isEdited: boolean;
}

interface SubmissionGalleryProps {
  challengeId: string;
  phase: 'submission' | 'voting' | 'results';
  judgingCriteria: string[];
  userRole?: 'participant' | 'judge' | 'viewer' | 'creator';
  view?: 'grid' | 'list';
  sortBy?: 'newest' | 'popular' | 'trending' | 'rating';
  filterBy?: 'all' | 'pending' | 'approved' | 'featured';
  onSubmissionClick?: (submission: Submission) => void;
  onVote?: (submissionId: string, criteria: Record<string, number>, comment?: string) => void;
  onComment?: (submissionId: string, comment: string) => void;
  onLike?: (submissionId: string) => void;
  onShare?: (submissionId: string) => void;
  canVote?: boolean;
}

export function SubmissionGallery({
  challengeId,
  phase,
  judgingCriteria,
  userRole = 'viewer',
  view = 'grid',
  sortBy = 'popular',
  filterBy = 'all',
  onSubmissionClick,
  onVote,
  onComment,
  onLike,
  onShare,
  canVote = false
}: SubmissionGalleryProps) {
  const [activeView, setActiveView] = React.useState(view);
  const [activeSort, setActiveSort] = React.useState(sortBy);
  const [activeFilter, setActiveFilter] = React.useState(filterBy);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSubmission, setSelectedSubmission] = React.useState<string | null>(null);
  const [votingData, setVotingData] = React.useState<Record<string, number>>({});
  const [votingComment, setVotingComment] = React.useState('');
  const [newComment, setNewComment] = React.useState('');
  const [likedSubmissions, setLikedSubmissions] = React.useState<Set<string>>(new Set());
  const [bookmarkedSubmissions, setBookmarkedSubmissions] = React.useState<Set<string>>(new Set());

  // Sample submissions data
  const submissions: Submission[] = [
    {
      id: 'sub1',
      challengeId,
      title: 'My Family\'s Journey - A Heritage Story',
      description: 'A heartfelt video sharing my grandmother\'s stories of growing up in Haiti and how our traditions have been passed down through generations.',
      submitter: {
        id: 'user1',
        name: 'Nadege Pierre',
        avatar: '👩🏾‍💼',
        verified: false,
        level: 8,
        badges: ['First Timer', 'Storyteller']
      },
      content: {
        type: 'video',
        url: '/videos/heritage-story.mp4',
        thumbnail: '/thumbnails/heritage-story.jpg',
        duration: 58,
        fileSize: 25600000
      },
      submission: {
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'approved'
      },
      engagement: {
        votes: 89,
        likes: 234,
        comments: 45,
        shares: 23,
        views: 1250,
        bookmarks: 67
      },
      ranking: {
        position: 1,
        percentile: 95,
        trending: true,
        featured: true
      },
      tags: ['family', 'tradition', 'storytelling', 'emotional'],
      metadata: {
        device: 'iPhone 13',
        location: 'Miami, FL',
        duration: '58 seconds'
      }
    },
    {
      id: 'sub2',
      challengeId,
      title: 'Haiti Through My Eyes - Visual Poetry',
      description: 'A creative montage combining photos from my recent trip to Haiti with spoken word poetry about cultural identity and belonging.',
      submitter: {
        id: 'user2',
        name: 'Marcus Thompson',
        avatar: '👨🏾‍🎓',
        verified: true,
        level: 12,
        badges: ['Creative', 'Poet', 'Rising Star']
      },
      content: {
        type: 'mixed',
        url: '/videos/visual-poetry.mp4',
        thumbnail: '/thumbnails/visual-poetry.jpg',
        duration: 60,
        fileSize: 32100000
      },
      submission: {
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'approved'
      },
      engagement: {
        votes: 156,
        likes: 445,
        comments: 78,
        shares: 56,
        views: 2100,
        bookmarks: 123
      },
      ranking: {
        position: 2,
        percentile: 88,
        trending: true,
        featured: false
      },
      tags: ['poetry', 'visual', 'identity', 'artistic'],
      metadata: {
        device: 'Canon EOS R5',
        location: 'Port-au-Prince, Haiti',
        duration: '60 seconds',
        collaborators: ['Local photographer in Haiti']
      }
    },
    {
      id: 'sub3',
      challengeId,
      title: 'Kreyòl Lullabies My Mother Sang',
      description: 'Recording of traditional Haitian lullabies with English translations, sharing the beautiful melodies that shaped my childhood.',
      submitter: {
        id: 'user3',
        name: 'Lucienne Toussaint',
        avatar: '👵🏾',
        verified: false,
        level: 5,
        badges: ['Cultural Keeper', 'Music Lover']
      },
      content: {
        type: 'audio',
        url: '/audio/kreyol-lullabies.mp3',
        duration: 45,
        fileSize: 8900000
      },
      submission: {
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'approved'
      },
      engagement: {
        votes: 67,
        likes: 189,
        comments: 34,
        shares: 78,
        views: 890,
        bookmarks: 156
      },
      ranking: {
        position: 3,
        percentile: 75,
        trending: false,
        featured: true
      },
      tags: ['music', 'tradition', 'lullaby', 'language'],
      metadata: {
        device: 'Blue Yeti Microphone',
        location: 'Boston, MA',
        duration: '45 seconds'
      }
    },
    {
      id: 'sub4',
      challengeId,
      title: 'Recipe Stories: Griot and Memories',
      description: 'A cooking demonstration paired with family stories about Sunday dinners and the role of food in keeping our culture alive.',
      submitter: {
        id: 'user4',
        name: 'Jean Baptiste',
        avatar: '👨🏾‍💼',
        verified: false,
        level: 6,
        badges: ['Food Lover', 'Community Builder']
      },
      content: {
        type: 'video',
        url: '/videos/griot-memories.mp4',
        thumbnail: '/thumbnails/griot-memories.jpg',
        duration: 55,
        fileSize: 28700000
      },
      submission: {
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        status: 'approved'
      },
      engagement: {
        votes: 78,
        likes: 167,
        comments: 23,
        shares: 34,
        views: 1100,
        bookmarks: 89
      },
      ranking: {
        position: 4,
        percentile: 65,
        trending: false,
        featured: false
      },
      tags: ['cooking', 'family', 'tradition', 'food'],
      metadata: {
        device: 'Samsung Galaxy S22',
        location: 'New York, NY',
        duration: '55 seconds'
      }
    }
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getContentIcon = (type: Submission['content']['type']) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case 'image': return <ImageIcon className="h-4 w-4 text-green-600" />;
      case 'audio': return <Headphones className="h-4 w-4 text-purple-600" />;
      case 'text': return <FileText className="h-4 w-4 text-gray-600" />;
      case 'mixed': return <Star className="h-4 w-4 text-orange-600" />;
    }
  };

  const getRankingIcon = (position?: number) => {
    if (!position) return null;
    switch (position) {
      case 1: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2: return <Medal className="h-4 w-4 text-gray-400" />;
      case 3: return <Award className="h-4 w-4 text-orange-500" />;
      default: return <Trophy className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleVote = (submissionId: string) => {
    if (!canVote || Object.keys(votingData).length === 0) return;
    
    onVote?.(submissionId, votingData, votingComment);
    setVotingData({});
    setVotingComment('');
    setSelectedSubmission(null);
  };

  const handleLike = (submissionId: string) => {
    setLikedSubmissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(submissionId)) {
        newSet.delete(submissionId);
      } else {
        newSet.add(submissionId);
      }
      return newSet;
    });
    onLike?.(submissionId);
  };

  const handleBookmark = (submissionId: string) => {
    setBookmarkedSubmissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(submissionId)) {
        newSet.delete(submissionId);
      } else {
        newSet.add(submissionId);
      }
      return newSet;
    });
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (activeFilter !== 'all' && submission.submission.status !== activeFilter && activeFilter !== 'featured') return false;
    if (activeFilter === 'featured' && !submission.ranking.featured) return false;
    if (searchQuery && !submission.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !submission.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !submission.submitter.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (activeSort) {
      case 'newest':
        return b.submission.submittedAt.getTime() - a.submission.submittedAt.getTime();
      case 'popular':
        return b.engagement.likes - a.engagement.likes;
      case 'trending':
        return Number(b.ranking.trending) - Number(a.ranking.trending);
      case 'rating':
        return b.engagement.votes - a.engagement.votes;
      default:
        return 0;
    }
  });

  const SubmissionCard = ({ submission }: { submission: Submission }) => (
    <Card className={cn(
      "hover:shadow-lg transition-all cursor-pointer overflow-hidden",
      submission.ranking.featured && "ring-2 ring-yellow-500 ring-opacity-20",
      submission.ranking.trending && "border-l-4 border-l-red-500"
    )}>
      <CardContent className="p-0">
        {/* Thumbnail/Preview */}
        <div className="relative aspect-video bg-gray-100">
          {submission.content.thumbnail ? (
            <img
              src={submission.content.thumbnail}
              alt={submission.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getContentIcon(submission.content.type)}
            </div>
          )}
          
          {/* Overlay indicators */}
          <div className="absolute top-2 left-2 flex items-center gap-1">
            {getContentIcon(submission.content.type)}
            {submission.content.duration && (
              <Badge variant="secondary" className="text-xs bg-black/70 text-white">
                {formatDuration(submission.content.duration)}
              </Badge>
            )}
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-1">
            {submission.ranking.featured && (
              <Badge variant="secondary" className="text-xs bg-yellow-500 text-white">
                Featured
              </Badge>
            )}
            {submission.ranking.trending && (
              <Badge variant="secondary" className="text-xs bg-red-500 text-white">
                Trending
              </Badge>
            )}
          </div>

          {/* Ranking position */}
          {submission.ranking.position && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 rounded px-2 py-1">
              {getRankingIcon(submission.ranking.position)}
              <span className="text-white text-xs font-medium">#{submission.ranking.position}</span>
            </div>
          )}

          {/* Play button for videos */}
          {(submission.content.type === 'video' || submission.content.type === 'mixed') && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button size="sm" className="bg-black/70 hover:bg-black/80 text-white rounded-full">
                <PlayCircle className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Title and Description */}
          <h3 
            className="font-bold text-lg mb-2 hover:text-purple-600 transition-colors line-clamp-2"
            onClick={() => onSubmissionClick?.(submission)}
          >
            {submission.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {submission.description}
          </p>

          {/* Submitter info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={submission.submitter.avatar} />
              <AvatarFallback className="text-xs">{submission.submitter.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{submission.submitter.name}</span>
            {submission.submitter.verified && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                Verified
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              Level {submission.submitter.level}
            </Badge>
          </div>

          {/* Tags */}
          {submission.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {submission.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {submission.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{submission.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Engagement stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {submission.engagement.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {submission.engagement.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {submission.engagement.comments}
              </span>
            </div>
            <span className="text-xs">
              {Math.floor((Date.now() - submission.submission.submittedAt.getTime()) / (1000 * 60 * 60 * 24))}d ago
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex-1",
                likedSubmissions.has(submission.id) && "text-red-600"
              )}
              onClick={() => handleLike(submission.id)}
            >
              <Heart className={cn("h-4 w-4 mr-1", likedSubmissions.has(submission.id) && "fill-current")} />
              Like
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => onShare?.(submission.id)}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                bookmarkedSubmissions.has(submission.id) && "text-blue-600"
              )}
              onClick={() => handleBookmark(submission.id)}
            >
              <Bookmark className={cn("h-4 w-4", bookmarkedSubmissions.has(submission.id) && "fill-current")} />
            </Button>

            {canVote && phase === 'voting' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSubmission(submission.id)}
              >
                <Star className="h-4 w-4 mr-1" />
                Vote
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const VotingModal = () => {
    if (!selectedSubmission) return null;
    
    const submission = submissions.find(s => s.id === selectedSubmission);
    if (!submission) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Vote for: {submission.title}</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedSubmission(null)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Criteria voting */}
            <div>
              <h4 className="font-semibold mb-4">Rate this submission (1-10 scale):</h4>
              <div className="space-y-4">
                {judgingCriteria.map((criteria) => (
                  <div key={criteria} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={criteria}>{criteria}</Label>
                      <span className="font-medium">
                        {votingData[criteria] || 0}/10
                      </span>
                    </div>
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={votingData[criteria] || 5}
                      onChange={(e) => setVotingData(prev => ({
                        ...prev,
                        [criteria]: parseInt(e.target.value)
                      }))}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Optional comment */}
            <div>
              <Label htmlFor="comment">Comment (optional)</Label>
              <Textarea
                id="comment"
                value={votingComment}
                onChange={(e) => setVotingComment(e.target.value)}
                placeholder="Share your thoughts on this submission..."
                rows={3}
              />
            </div>

            {/* Submit vote */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleVote(selectedSubmission)}
                disabled={Object.keys(votingData).length === 0}
                className="flex-1"
              >
                <Star className="h-4 w-4 mr-2" />
                Submit Vote
              </Button>
              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {phase === 'submission' && 'Submissions'}
            {phase === 'voting' && 'Voting Gallery'}
            {phase === 'results' && 'Final Results'}
          </h2>
          <p className="text-gray-600">
            {phase === 'submission' && `${submissions.length} entries submitted`}
            {phase === 'voting' && 'Vote for your favorite submissions'}
            {phase === 'results' && 'Challenge winners and highlights'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
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

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Submissions</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="featured">Featured</option>
            </select>

            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="trending">Trending</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Phase indicator */}
      <div className="flex items-center gap-4">
        <Badge variant={phase === 'submission' ? 'default' : 'outline'}>
          Submission Phase
        </Badge>
        <Badge variant={phase === 'voting' ? 'default' : 'outline'}>
          Voting Phase
        </Badge>
        <Badge variant={phase === 'results' ? 'default' : 'outline'}>
          Results Phase
        </Badge>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
        </p>
        {phase === 'voting' && canVote && (
          <p className="text-sm text-purple-600 font-medium">
            You can vote on multiple submissions
          </p>
        )}
      </div>

      {/* Submissions grid/list */}
      <div className={cn(
        activeView === 'grid' 
          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      )}>
        <AnimatePresence>
          {filteredSubmissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <SubmissionCard submission={submission} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions found</h3>
          <p className="text-gray-600">
            {searchQuery || activeFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Submissions will appear here once the challenge begins'
            }
          </p>
        </div>
      )}

      {/* Voting Modal */}
      <VotingModal />
    </div>
  );
}