'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Flag,
  AlertTriangle,
  Shield,
  Users,
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Search,
  Filter,
  TrendingUp,
  User,
  FileText,
  Image as ImageIcon,
  Video,
  Link,
  Hash,
  MoreHorizontal,
  ChevronRight,
  Info,
  Ban,
  AlertOctagon,
  Zap,
  Star,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterAvatar?: string;
  contentId: string;
  contentType: 'post' | 'comment' | 'message' | 'profile' | 'image' | 'video';
  contentPreview?: string;
  authorId: string;
  authorName: string;
  category: 'spam' | 'harassment' | 'hate-speech' | 'misinformation' | 'nsfw' | 'copyright' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence?: string[];
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed' | 'escalated';
  priority: number;
  votes: {
    agree: number;
    disagree: number;
    userVote?: 'agree' | 'disagree' | null;
  };
  reviewers: string[];
  resolution?: {
    action: 'removed' | 'warned' | 'banned' | 'no-action';
    reason: string;
    moderator: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface ReportCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  examples: string[];
}

interface TrustedReviewer {
  id: string;
  name: string;
  avatar: string;
  level: number;
  accuracy: number;
  reviewsCompleted: number;
  specialties: string[];
  isOnline: boolean;
}

interface CommunityReportingProps {
  currentUserId?: string;
  userRole?: 'member' | 'trusted' | 'moderator' | 'admin';
  onSubmitReport?: (report: Partial<Report>) => void;
  onVoteReport?: (reportId: string, vote: 'agree' | 'disagree') => void;
  onReviewReport?: (reportId: string, action: string) => void;
  onEscalateReport?: (reportId: string) => void;
  showQueue?: boolean;
  showStats?: boolean;
}

export function CommunityReporting({
  currentUserId,
  userRole = 'member',
  onSubmitReport,
  onVoteReport,
  onReviewReport,
  onEscalateReport,
  showQueue = true,
  showStats = true
}: CommunityReportingProps) {
  const [activeTab, setActiveTab] = React.useState<'submit' | 'queue' | 'review' | 'stats'>('queue');
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [reportDescription, setReportDescription] = React.useState('');
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Report categories
  const reportCategories: ReportCategory[] = [
    {
      id: 'spam',
      label: 'Spam',
      description: 'Unwanted promotional content or repetitive messages',
      icon: Hash,
      severity: 'low',
      examples: ['Excessive self-promotion', 'Repetitive messages', 'Irrelevant links']
    },
    {
      id: 'harassment',
      label: 'Harassment',
      description: 'Targeted attacks or bullying behavior',
      icon: AlertTriangle,
      severity: 'high',
      examples: ['Personal attacks', 'Threats', 'Stalking behavior']
    },
    {
      id: 'hate-speech',
      label: 'Hate Speech',
      description: 'Content promoting hatred based on identity',
      icon: Ban,
      severity: 'critical',
      examples: ['Racial slurs', 'Religious intolerance', 'Gender-based attacks']
    },
    {
      id: 'misinformation',
      label: 'Misinformation',
      description: 'False or misleading information',
      icon: AlertOctagon,
      severity: 'medium',
      examples: ['False claims', 'Manipulated media', 'Conspiracy theories']
    },
    {
      id: 'nsfw',
      label: 'NSFW Content',
      description: 'Inappropriate or explicit content',
      icon: Eye,
      severity: 'high',
      examples: ['Explicit images', 'Gore', 'Adult content']
    },
    {
      id: 'copyright',
      label: 'Copyright Violation',
      description: 'Unauthorized use of copyrighted material',
      icon: Shield,
      severity: 'medium',
      examples: ['Stolen content', 'Unauthorized reproductions', 'Piracy']
    }
  ];

  // Sample reports
  const sampleReports: Report[] = [
    {
      id: 'report1',
      reporterId: 'user1',
      reporterName: 'Marie Delacroix',
      reporterAvatar: '👩🏾‍🎨',
      contentId: 'post-123',
      contentType: 'post',
      contentPreview: 'Buy now! Limited time offer! Click here for amazing deals...',
      authorId: 'spammer1',
      authorName: 'SpamBot123',
      category: 'spam',
      severity: 'medium',
      description: 'This user is constantly posting promotional content and spam links in multiple threads.',
      evidence: ['screenshot1.jpg', 'screenshot2.jpg'],
      status: 'pending',
      priority: 5,
      votes: { agree: 12, disagree: 2, userVote: null },
      reviewers: [],
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 'report2',
      reporterId: 'user2',
      reporterName: 'Marcus Thompson',
      reporterAvatar: '👨🏾‍💻',
      contentId: 'comment-456',
      contentType: 'comment',
      contentPreview: '[Content removed for review]',
      authorId: 'toxic1',
      authorName: 'ToxicUser',
      category: 'harassment',
      severity: 'high',
      description: 'User is harassing multiple community members with personal attacks and threats.',
      status: 'reviewing',
      priority: 8,
      votes: { agree: 23, disagree: 1, userVote: 'agree' },
      reviewers: ['moderator1', 'moderator2'],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      id: 'report3',
      reporterId: 'user3',
      reporterName: 'Sophia Laurent',
      reporterAvatar: '👩🏾‍🏫',
      contentId: 'image-789',
      contentType: 'image',
      authorId: 'nsfw1',
      authorName: 'InappropriateUser',
      category: 'nsfw',
      severity: 'critical',
      description: 'User posted explicit content without warning in a public forum.',
      status: 'resolved',
      priority: 10,
      votes: { agree: 45, disagree: 0 },
      reviewers: ['moderator1', 'admin1'],
      resolution: {
        action: 'banned',
        reason: 'Violation of community guidelines - explicit content',
        moderator: 'admin1',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  ];

  // Trusted reviewers
  const trustedReviewers: TrustedReviewer[] = [
    {
      id: 'reviewer1',
      name: 'Jean Baptiste',
      avatar: '👨🏾‍💼',
      level: 5,
      accuracy: 96.5,
      reviewsCompleted: 234,
      specialties: ['spam', 'misinformation'],
      isOnline: true
    },
    {
      id: 'reviewer2',
      name: 'Lucienne Toussaint',
      avatar: '👩🏾‍🏫',
      level: 4,
      accuracy: 94.2,
      reviewsCompleted: 189,
      specialties: ['harassment', 'hate-speech'],
      isOnline: false
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'reviewing': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'dismissed': return 'bg-gray-100 text-gray-700';
      case 'escalated': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSubmitReport = () => {
    if (!selectedCategory || !reportDescription.trim()) return;
    
    const category = reportCategories.find(c => c.id === selectedCategory);
    onSubmitReport?.({
      category: selectedCategory as Report['category'],
      severity: category?.severity,
      description: reportDescription,
      status: 'pending',
      createdAt: new Date()
    });
    
    setSelectedCategory('');
    setReportDescription('');
    setShowReportModal(false);
  };

  const renderReportForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit a Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">What are you reporting?</label>
            <div className="grid md:grid-cols-2 gap-3">
              {reportCategories.map((category) => (
                <div
                  key={category.id}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                    selectedCategory === category.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-start gap-3">
                    <category.icon className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">{category.label}</div>
                      <div className="text-sm text-gray-600 mb-2">{category.description}</div>
                      <Badge variant="outline" className={cn("text-xs", getSeverityColor(category.severity))}>
                        {category.severity} severity
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Describe the issue</label>
                <Textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Please provide details about what you're reporting..."
                  rows={4}
                />
              </div>

              {/* Examples for selected category */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-900 mb-1">Common examples:</div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {reportCategories.find(c => c.id === selectedCategory)?.examples.map((example, index) => (
                        <li key={index}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSubmitReport}
                disabled={!reportDescription.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderReportQueue = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
              <option value="escalated">Escalated</option>
            </select>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {sampleReports
          .filter(report => filterStatus === 'all' || report.status === filterStatus)
          .map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className={getSeverityColor(report.severity)}>
                      {report.severity}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {Math.floor((Date.now() - report.createdAt.getTime()) / (1000 * 60 * 60))} hours ago
                    </span>
                  </div>

                  {/* Content Preview */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      {report.contentType === 'post' && <FileText className="h-4 w-4" />}
                      {report.contentType === 'comment' && <MessageSquare className="h-4 w-4" />}
                      {report.contentType === 'image' && <ImageIcon className="h-4 w-4" />}
                      {report.contentType === 'video' && <Video className="h-4 w-4" />}
                      <span className="font-medium">{report.category}</span>
                      <span className="text-sm text-gray-500">• {report.contentType}</span>
                    </div>
                    {report.contentPreview && (
                      <p className="text-sm text-gray-600 italic line-clamp-2">
                        "{report.contentPreview}"
                      </p>
                    )}
                  </div>

                  {/* Reporter Info */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={report.reporterAvatar} />
                        <AvatarFallback>{report.reporterName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>Reported by {report.reporterName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Against {report.authorName}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {report.description}
                  </p>

                  {/* Voting */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          report.votes.userVote === 'agree' && "text-green-600"
                        )}
                        onClick={() => onVoteReport?.(report.id, 'agree')}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {report.votes.agree}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          report.votes.userVote === 'disagree' && "text-red-600"
                        )}
                        onClick={() => onVoteReport?.(report.id, 'disagree')}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {report.votes.disagree}
                      </Button>
                    </div>

                    {report.reviewers.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        {report.reviewers.length} reviewing
                      </div>
                    )}

                    {report.evidence && report.evidence.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {report.evidence.length} evidence items
                      </Badge>
                    )}
                  </div>

                  {/* Resolution (if any) */}
                  {report.resolution && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Resolved:</span>
                        <Badge variant="outline">{report.resolution.action}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {report.resolution.reason}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        By {report.resolution.moderator} • {Math.floor((Date.now() - report.resolution.timestamp.getTime()) / (1000 * 60 * 60))} hours ago
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReport(report)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  {(userRole === 'moderator' || userRole === 'admin') && report.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReviewReport?.(report.id, 'review')}
                      >
                        Review
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => onEscalateReport?.(report.id)}
                      >
                        Escalate
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTrustedReviewers = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trusted Community Reviewers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Community members with high accuracy in report reviews help moderate content
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {trustedReviewers.map((reviewer) => (
              <Card key={reviewer.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={reviewer.avatar} />
                        <AvatarFallback>{reviewer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {reviewer.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{reviewer.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Level {reviewer.level}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {reviewer.accuracy}% accuracy
                        </span>
                      </div>
                    </div>
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Reviews:</span>
                      <div className="font-medium">{reviewer.reviewsCompleted}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Specialties:</span>
                      <div className="flex flex-wrap gap-1">
                        {reviewer.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">234</div>
            <div className="text-sm text-gray-600">Total Reports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">45</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">189</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">92%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Reports by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportCategories.map((category) => {
              const count = Math.floor(Math.random() * 50) + 10;
              const percentage = (count / 234) * 100;
              return (
                <div key={category.id} className="flex items-center gap-3">
                  <category.icon className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{category.label}</span>
                      <span className="text-sm text-gray-500">{count} reports</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
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
          <h2 className="text-2xl font-bold">Community Reporting</h2>
          <p className="text-gray-600">Help keep our community safe by reporting violations</p>
        </div>
        
        <Button 
          onClick={() => setShowReportModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          <Flag className="h-4 w-4 mr-2" />
          Report Content
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'queue', label: 'Report Queue', icon: FileText, show: showQueue },
            { id: 'submit', label: 'Submit Report', icon: Flag, show: true },
            { id: 'review', label: 'Trusted Reviewers', icon: Users, show: userRole !== 'member' },
            { id: 'stats', label: 'Statistics', icon: TrendingUp, show: showStats }
          ].filter(tab => tab.show).map((tab) => (
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
          {activeTab === 'submit' && renderReportForm()}
          {activeTab === 'queue' && showQueue && renderReportQueue()}
          {activeTab === 'review' && userRole !== 'member' && renderTrustedReviewers()}
          {activeTab === 'stats' && showStats && renderStats()}
        </motion.div>
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Report Content</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowReportModal(false)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {renderReportForm()}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}