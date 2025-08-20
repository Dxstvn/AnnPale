'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy,
  Users,
  Plus,
  Search,
  Filter,
  Bell,
  BarChart3,
  Calendar,
  Crown,
  Star,
  Zap,
  Target,
  Gift,
  Menu,
  X,
  Home,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Clock,
  Eye,
  Heart,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import challenge components
import { ChallengeHub } from './challenge-hub';
import { ChallengeWizard } from './challenge-wizard';
import { SubmissionGallery } from './submission-gallery';
import { ChallengeLeaderboard } from './challenge-leaderboard';
import { ChallengeParticipationFlow } from './challenge-participation-flow';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  badge?: number;
  requiresAuth?: boolean;
}

interface ChallengeStats {
  totalChallenges: number;
  activeChallenges: number;
  totalParticipants: number;
  totalPrizeValue: string;
  submissionsToday: number;
  votingActive: number;
}

interface ChallengeLayoutProps {
  initialView?: 'hub' | 'create' | 'leaderboard' | 'my-challenges' | 'submissions';
  userRole?: 'member' | 'creator' | 'moderator' | 'admin';
  isAuthenticated?: boolean;
  currentUserId?: string;
  onNavigate?: (view: string, params?: any) => void;
}

export function ChallengeLayout({
  initialView = 'hub',
  userRole = 'member',
  isAuthenticated = false,
  currentUserId,
  onNavigate
}: ChallengeLayoutProps) {
  const [currentView, setCurrentView] = React.useState(initialView);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [selectedChallenge, setSelectedChallenge] = React.useState<any>(null);
  const [notifications, setNotifications] = React.useState<any[]>([]);

  // Challenge statistics
  const challengeStats: ChallengeStats = {
    totalChallenges: 47,
    activeChallenges: 12,
    totalParticipants: 2341,
    totalPrizeValue: '$15,000',
    submissionsToday: 23,
    votingActive: 8
  };

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      id: 'hub',
      label: 'Challenge Hub',
      icon: Home,
      description: 'Discover active challenges'
    },
    {
      id: 'create',
      label: 'Create Challenge',
      icon: Plus,
      description: 'Start a new challenge',
      requiresAuth: true
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      description: 'Community rankings'
    },
    {
      id: 'my-challenges',
      label: 'My Challenges',
      icon: Star,
      description: 'Your participated challenges',
      badge: 3,
      requiresAuth: true
    },
    {
      id: 'submissions',
      label: 'My Submissions',
      icon: Eye,
      description: 'Track your entries',
      requiresAuth: true
    }
  ];

  // Sample challenge for participation flow
  const sampleChallenge = {
    id: 'heritage-video',
    title: 'Haitian Heritage Video Challenge',
    description: 'Create a 60-second video showcasing what Haitian heritage means to you. Share stories, traditions, food, music, or any aspect of our beautiful culture that inspires you.',
    type: 'creative' as const,
    creator: {
      id: 'creator1',
      name: 'Marie Delacroix',
      avatar: '👩🏾‍🎨',
      verified: true
    },
    prize: {
      type: 'money' as const,
      value: '$500',
      description: 'First place winner receives $500 cash prize'
    },
    timeline: {
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      votingEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },
    rules: [
      'Video must be 60 seconds or less',
      'Original content only',
      'Must include #HaitianHeritage tag',
      'Family-friendly content required'
    ],
    submissionFormat: 'video' as const,
    submissionGuidelines: 'Upload high-quality videos in MP4 format. Maximum file size: 100MB. Ensure good audio quality and proper lighting.',
    judgingCriteria: ['Creativity', 'Cultural Authenticity', 'Technical Quality', 'Emotional Impact'],
    tags: ['heritage', 'culture', 'video', 'creativity'],
    difficulty: 'beginner' as const,
    participation: {
      current: 234,
      limit: 500,
      userStatus: 'not_joined' as const
    }
  };

  const handleNavigation = (view: string, params?: any) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    onNavigate?.(view, params);
  };

  const renderSidebar = () => (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Creator Challenges</h2>
          <p className="text-sm text-gray-600">Kominote Kreyatè</p>
        </div>

        {/* Quick Stats */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{challengeStats.activeChallenges}</div>
                <div className="text-xs text-gray-600">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">{challengeStats.totalPrizeValue}</div>
                <div className="text-xs text-gray-600">Prizes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{challengeStats.totalParticipants.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Participants</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{challengeStats.submissionsToday}</div>
                <div className="text-xs text-gray-600">Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const canAccess = !item.requiresAuth || isAuthenticated;

            if (!canAccess) return null;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                disabled={!canAccess}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                  isActive
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "text-gray-700 hover:bg-gray-100",
                  !canAccess && "opacity-50 cursor-not-allowed"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.label}</div>
                  {item.description && (
                    <div className="text-xs opacity-70 truncate">{item.description}</div>
                  )}
                </div>
                {item.badge && item.badge > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Featured Challenge */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-600" />
              Featured Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Heritage Video Challenge</h4>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Gift className="h-3 w-3" />
                <span>$500 Prize</span>
                <Clock className="h-3 w-3 ml-2" />
                <span>11 days left</span>
              </div>
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600"
                onClick={() => {
                  setSelectedChallenge(sampleChallenge);
                  setCurrentView('participate');
                }}
              >
                Join Challenge
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Actions */}
        {isAuthenticated && (
          <div className="space-y-2">
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              onClick={() => handleNavigation('create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Challenge
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleNavigation('submissions')}>
                <Eye className="h-4 w-4 mr-1" />
                Submissions
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleNavigation('leaderboard')}>
                <Trophy className="h-4 w-4 mr-1" />
                Rankings
              </Button>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {notifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notification, index) => (
                  <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                    {notification.message}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderBreadcrumb = () => {
    const breadcrumbs = [];
    
    breadcrumbs.push({ label: 'Challenges', href: '#', onClick: () => handleNavigation('hub') });
    
    if (currentView === 'create') {
      breadcrumbs.push({ label: 'Create Challenge', href: '#' });
    } else if (currentView === 'leaderboard') {
      breadcrumbs.push({ label: 'Leaderboard', href: '#' });
    } else if (currentView === 'my-challenges') {
      breadcrumbs.push({ label: 'My Challenges', href: '#' });
    } else if (currentView === 'submissions') {
      breadcrumbs.push({ label: 'My Submissions', href: '#' });
    } else if (currentView === 'participate') {
      breadcrumbs.push({ label: 'Participate', href: '#' });
    }

    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ArrowRight className="h-4 w-4" />}
            <button
              onClick={crumb.onClick}
              className={cn(
                "hover:text-purple-600 transition-colors",
                index === breadcrumbs.length - 1 && "text-gray-900 font-medium"
              )}
            >
              {crumb.label}
            </button>
          </React.Fragment>
        ))}
      </nav>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'hub':
        return (
          <ChallengeHub 
            view="grid"
            filterBy="all"
            sortBy="trending"
            showFilters={true}
            onChallengeClick={(challenge) => {
              setSelectedChallenge(challenge);
              setCurrentView('participate');
            }}
            onCreateChallenge={() => handleNavigation('create')}
            onJoinChallenge={(challengeId) => {
              console.log('Join challenge:', challengeId);
              // Handle join logic here
            }}
          />
        );

      case 'create':
        return (
          <ChallengeWizard 
            mode="create"
            onSave={(data) => console.log('Save draft:', data)}
            onPublish={(data) => {
              console.log('Publish challenge:', data);
              handleNavigation('hub');
            }}
            onCancel={() => handleNavigation('hub')}
          />
        );

      case 'leaderboard':
        return (
          <ChallengeLeaderboard 
            view="overall"
            timeframe="all-time"
            category="all"
            showHallOfFame={true}
            userRole={userRole}
            currentUserId={currentUserId}
            onUserClick={(userId) => console.log('User clicked:', userId)}
            onBadgeClick={(badge) => console.log('Badge clicked:', badge)}
          />
        );

      case 'my-challenges':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">My Challenges</h2>
              <p className="text-gray-600">Track your challenge participation and performance</p>
            </div>

            <Tabs defaultValue="participating" className="space-y-6">
              <TabsList>
                <TabsTrigger value="participating">Participating</TabsTrigger>
                <TabsTrigger value="created">Created</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="participating">
                <ChallengeHub 
                  view="list"
                  filterBy="active"
                  sortBy="ending_soon"
                  showFilters={false}
                  onChallengeClick={(challenge) => {
                    setSelectedChallenge(challenge);
                    setCurrentView('participate');
                  }}
                  onJoinChallenge={(challengeId) => console.log('Join:', challengeId)}
                />
              </TabsContent>

              <TabsContent value="created">
                <div className="text-center py-12">
                  <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No challenges created yet</h3>
                  <p className="text-gray-600 mb-4">Start engaging the community with your own challenge</p>
                  <Button onClick={() => handleNavigation('create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Challenge
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed challenges</h3>
                  <p className="text-gray-600">Complete challenges to see your results here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'submissions':
        return (
          <SubmissionGallery 
            challengeId="sample"
            phase="submission"
            judgingCriteria={['Creativity', 'Quality', 'Originality']}
            userRole="participant"
            view="grid"
            sortBy="newest"
            filterBy="all"
            canVote={false}
            onSubmissionClick={(submission) => console.log('Submission clicked:', submission)}
            onVote={(submissionId, criteria, comment) => console.log('Vote:', submissionId, criteria, comment)}
            onComment={(submissionId, comment) => console.log('Comment:', submissionId, comment)}
            onLike={(submissionId) => console.log('Like:', submissionId)}
            onShare={(submissionId) => console.log('Share:', submissionId)}
          />
        );

      case 'participate':
        return selectedChallenge ? (
          <ChallengeParticipationFlow 
            challenge={selectedChallenge}
            currentStep="overview"
            userRole={userRole}
            isAuthenticated={isAuthenticated}
            onJoin={(challengeId) => console.log('Joined challenge:', challengeId)}
            onSubmit={(challengeId, submission) => console.log('Submitted:', challengeId, submission)}
            onWithdraw={(challengeId) => console.log('Withdrew from:', challengeId)}
            onShare={(challengeId) => console.log('Shared challenge:', challengeId)}
          />
        ) : (
          <div>Challenge not found</div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  // For full-screen participation flow
  if (currentView === 'participate' && selectedChallenge) {
    return renderContent();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-bold text-lg">Challenges</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t bg-white"
            >
              <div className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const canAccess = !item.requiresAuth || isAuthenticated;
                  
                  if (!canAccess) return null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left",
                        currentView === item.id
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block">
          {renderSidebar()}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            {renderBreadcrumb()}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}