'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users,
  Briefcase,
  Target,
  Star,
  Plus,
  Search,
  Filter,
  Bell,
  Settings,
  Home,
  User,
  MessageSquare,
  Calendar,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Heart,
  Handshake,
  Globe,
  Menu,
  X,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import collaboration components
import { CollaborationBoard } from './collaboration-board';
import { ProjectWizard } from './project-wizard';
import { MemberProfiles } from './member-profiles';
import { MatchingSystem } from './matching-system';
import { ProjectManagement } from './project-management';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  badge?: number;
  requiresAuth?: boolean;
}

interface CollaborationStats {
  totalProjects: number;
  activeProjects: number;
  totalMembers: number;
  completedCollaborations: number;
  successRate: number;
  averageProjectValue: string;
  matchesToday: number;
  newMembers: number;
}

interface CollaborationLayoutProps {
  initialView?: 'board' | 'create' | 'members' | 'matching' | 'my-projects' | 'project-details';
  userRole?: 'member' | 'creator' | 'moderator' | 'admin';
  isAuthenticated?: boolean;
  currentUserId?: string;
  projectId?: string;
  onNavigate?: (view: string, params?: any) => void;
}

export function CollaborationLayout({
  initialView = 'board',
  userRole = 'member',
  isAuthenticated = false,
  currentUserId,
  projectId,
  onNavigate
}: CollaborationLayoutProps) {
  const [currentView, setCurrentView] = React.useState(initialView);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<any>(null);
  const [notifications, setNotifications] = React.useState<any[]>([]);

  // Collaboration statistics
  const collaborationStats: CollaborationStats = {
    totalProjects: 127,
    activeProjects: 34,
    totalMembers: 856,
    completedCollaborations: 93,
    successRate: 87,
    averageProjectValue: '$2,500',
    matchesToday: 12,
    newMembers: 8
  };

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      id: 'board',
      label: 'Project Board',
      icon: Briefcase,
      description: 'Browse and discover projects'
    },
    {
      id: 'create',
      label: 'Post Project',
      icon: Plus,
      description: 'Create a new collaboration',
      requiresAuth: true
    },
    {
      id: 'members',
      label: 'Find Collaborators',
      icon: Users,
      description: 'Discover talented members'
    },
    {
      id: 'matching',
      label: 'Smart Matches',
      icon: Target,
      description: 'AI-powered recommendations',
      badge: 5,
      requiresAuth: true
    },
    {
      id: 'my-projects',
      label: 'My Projects',
      icon: Star,
      description: 'Your active collaborations',
      badge: 3,
      requiresAuth: true
    }
  ];

  // Sample recent collaboration for quick stats
  const recentCollaborations = [
    {
      id: 'collab1',
      title: 'Haiti Heritage Documentary',
      participants: 4,
      status: 'active',
      progress: 65,
      value: '$10,000'
    },
    {
      id: 'collab2',
      title: 'Kreyòl Learning App',
      participants: 6,
      status: 'completed',
      progress: 100,
      value: '$15,000'
    },
    {
      id: 'collab3',
      title: 'Community Event Planning',
      participants: 8,
      status: 'active',
      progress: 40,
      value: 'Volunteer'
    }
  ];

  const handleNavigation = (view: string, params?: any) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    if (params?.projectId) {
      setSelectedProject(params.project);
    }
    onNavigate?.(view, params);
  };

  const renderSidebar = () => (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Handshake className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Collaboration Board</h2>
          <p className="text-sm text-gray-600">Depo Kominoté</p>
        </div>

        {/* Quick Stats */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{collaborationStats.activeProjects}</div>
                <div className="text-xs text-gray-600">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">{collaborationStats.totalMembers}</div>
                <div className="text-xs text-gray-600">Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{collaborationStats.successRate}%</div>
                <div className="text-xs text-gray-600">Success</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{collaborationStats.averageProjectValue}</div>
                <div className="text-xs text-gray-600">Avg Value</div>
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

        {/* Featured Opportunities */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-600" />
              Hot Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border border-yellow-200">
                <h4 className="font-semibold text-sm">Tech Startup Co-founder</h4>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                  <DollarSign className="h-3 w-3" />
                  <span>Equity + $5K</span>
                  <Clock className="h-3 w-3 ml-2" />
                  <span>3 months</span>
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-2 bg-gradient-to-r from-yellow-600 to-orange-600"
                  onClick={() => handleNavigation('board')}
                >
                  View Details
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Collaborations */}
        {isAuthenticated && recentCollaborations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCollaborations.slice(0, 2).map((collab) => (
                  <div key={collab.id} className="p-2 bg-gray-50 rounded">
                    <div className="font-medium text-sm line-clamp-1">{collab.title}</div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>{collab.participants} members</span>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          collab.status === 'active' ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                        )}
                      >
                        {collab.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Actions */}
        {isAuthenticated && (
          <div className="space-y-2">
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              onClick={() => handleNavigation('create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Post New Project
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleNavigation('matching')}>
                <Target className="h-4 w-4 mr-1" />
                Matches
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleNavigation('members')}>
                <Users className="h-4 w-4 mr-1" />
                Members
              </Button>
            </div>
          </div>
        )}

        {/* Call to Action for Non-authenticated */}
        {!isAuthenticated && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <h4 className="font-semibold mb-2">Join the Community</h4>
              <p className="text-sm text-gray-600 mb-3">
                Connect with talented creators and build amazing projects together
              </p>
              <Button size="sm" className="w-full">
                Sign Up Free
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Community Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Community Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Projects Completed</span>
                <span className="font-medium">{collaborationStats.completedCollaborations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">New Members Today</span>
                <span className="font-medium">{collaborationStats.newMembers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Smart Matches</span>
                <span className="font-medium">{collaborationStats.matchesToday}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBreadcrumb = () => {
    const breadcrumbs = [];
    
    breadcrumbs.push({ label: 'Collaborations', href: '#', onClick: () => handleNavigation('board') });
    
    if (currentView === 'create') {
      breadcrumbs.push({ label: 'Post Project', href: '#' });
    } else if (currentView === 'members') {
      breadcrumbs.push({ label: 'Find Collaborators', href: '#' });
    } else if (currentView === 'matching') {
      breadcrumbs.push({ label: 'Smart Matches', href: '#' });
    } else if (currentView === 'my-projects') {
      breadcrumbs.push({ label: 'My Projects', href: '#' });
    } else if (currentView === 'project-details') {
      breadcrumbs.push({ label: 'Project Details', href: '#' });
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
      case 'board':
        return (
          <CollaborationBoard
            view="grid"
            filterBy="all"
            sortBy="newest"
            category="all"
            showCreateButton={isAuthenticated}
            onProjectClick={(project) => {
              setSelectedProject(project);
              setCurrentView('project-details');
            }}
            onCreateProject={() => handleNavigation('create')}
            onApplyToProject={(projectId) => {
              console.log('Apply to project:', projectId);
            }}
            onLikeProject={(projectId) => console.log('Like project:', projectId)}
            onBookmarkProject={(projectId) => console.log('Bookmark project:', projectId)}
          />
        );

      case 'create':
        return (
          <ProjectWizard
            mode="create"
            onSave={(data) => console.log('Save draft:', data)}
            onPublish={(data) => {
              console.log('Publish project:', data);
              handleNavigation('board');
            }}
            onCancel={() => handleNavigation('board')}
          />
        );

      case 'members':
        return (
          <MemberProfiles
            view="grid"
            sortBy="compatibility"
            showCompatibilityScore={isAuthenticated}
            currentUserId={currentUserId}
            onProfileClick={(profile) => console.log('Profile clicked:', profile)}
            onContactMember={(memberId) => console.log('Contact member:', memberId)}
            onViewPortfolio={(portfolioId) => console.log('View portfolio:', portfolioId)}
          />
        );

      case 'matching':
        return isAuthenticated ? (
          <MatchingSystem
            userId={currentUserId}
            matchType="members"
            onContactMember={(memberId) => console.log('Contact member:', memberId)}
            onViewProject={(projectId) => console.log('View project:', projectId)}
            onUpdatePreferences={() => console.log('Update preferences')}
            onProvideFeedback={(matchId, helpful) => console.log('Feedback:', matchId, helpful)}
          />
        ) : (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in required</h3>
            <p className="text-gray-600">Please sign in to access smart matching features</p>
          </div>
        );

      case 'my-projects':
        return isAuthenticated ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">My Projects</h2>
              <p className="text-gray-600">Manage your active collaborations and track progress</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentCollaborations.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.participants} members
                      </span>
                      <Badge variant="outline" className={
                        project.status === 'active' ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                      }>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setSelectedProject(project);
                        setCurrentView('project-details');
                      }}
                    >
                      Manage Project
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in required</h3>
            <p className="text-gray-600">Please sign in to view your projects</p>
          </div>
        );

      case 'project-details':
        return selectedProject ? (
          <ProjectManagement
            projectId={selectedProject.id || 'sample-project'}
            currentUserId={currentUserId || 'user1'}
            userRole={userRole === 'creator' ? 'owner' : 'member'}
            onUpdateProject={(data) => console.log('Update project:', data)}
            onInviteMember={(email, role) => console.log('Invite member:', email, role)}
            onRemoveMember={(memberId) => console.log('Remove member:', memberId)}
            onCreateTask={(task) => console.log('Create task:', task)}
            onUpdateTask={(taskId, updates) => console.log('Update task:', taskId, updates)}
            onUploadFile={(file) => console.log('Upload file:', file)}
            onScheduleMeeting={(meeting) => console.log('Schedule meeting:', meeting)}
          />
        ) : (
          <div>Project not found</div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-bold text-lg">Collaborations</h1>
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