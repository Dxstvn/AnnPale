'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Shield,
  Users,
  Bot,
  Flag,
  Settings,
  Bell,
  Home,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Activity,
  Menu,
  X,
  ChevronRight,
  Search,
  User,
  LogOut,
  HelpCircle,
  Lock,
  Filter,
  Gavel,
  Scale,
  Heart,
  TrendingUp,
  Clock,
  Award,
  Zap,
  Info,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import moderation components
import { AutomatedModeration } from './automated-moderation';
import { CommunityReporting } from './community-reporting';
import { ModeratorDashboard } from './moderator-dashboard';
import { SafetyFeatures } from './safety-features';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  badge?: number | string;
  requiresRole?: string[];
}

interface ModerationStats {
  totalReports: number;
  resolvedToday: number;
  pendingReview: number;
  communityHealth: number;
  activeModeratorActions: number;
  automatedDetections: number;
  userSafetyScore: number;
  falsePositiveRate: number;
}

interface ModerationLayoutProps {
  initialView?: 'dashboard' | 'automated' | 'reports' | 'safety' | 'moderator' | 'analytics';
  userRole?: 'member' | 'trusted' | 'volunteer' | 'staff' | 'admin';
  isAuthenticated?: boolean;
  currentUserId?: string;
  onNavigate?: (view: string, params?: any) => void;
}

export function ModerationLayout({
  initialView = 'dashboard',
  userRole = 'member',
  isAuthenticated = false,
  currentUserId,
  onNavigate
}: ModerationLayoutProps) {
  const [currentView, setCurrentView] = React.useState(initialView);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);

  // Moderation statistics
  const moderationStats: ModerationStats = {
    totalReports: 234,
    resolvedToday: 45,
    pendingReview: 23,
    communityHealth: 85,
    activeModeratorActions: 8,
    automatedDetections: 156,
    userSafetyScore: 92,
    falsePositiveRate: 2.3
  };

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: Home,
      description: 'Moderation overview'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: Flag,
      description: 'Community reports',
      badge: moderationStats.pendingReview
    },
    {
      id: 'automated',
      label: 'Automation',
      icon: Bot,
      description: 'AI moderation',
      requiresRole: ['volunteer', 'staff', 'admin']
    },
    {
      id: 'moderator',
      label: 'Moderator Tools',
      icon: Gavel,
      description: 'Moderation actions',
      requiresRole: ['volunteer', 'staff', 'admin'],
      badge: moderationStats.activeModeratorActions
    },
    {
      id: 'safety',
      label: 'Safety',
      icon: Shield,
      description: 'User protection'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Statistics & trends',
      requiresRole: ['staff', 'admin']
    }
  ];

  // Recent activity
  const recentActivity = [
    {
      id: 'activity1',
      type: 'report',
      description: 'New harassment report',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      severity: 'high'
    },
    {
      id: 'activity2',
      type: 'action',
      description: 'Content removed by AI',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      severity: 'medium'
    },
    {
      id: 'activity3',
      type: 'appeal',
      description: 'User appealed timeout',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      severity: 'low'
    }
  ];

  const canAccessView = (item: NavigationItem) => {
    if (!item.requiresRole) return true;
    return item.requiresRole.includes(userRole);
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
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Moderation Center</h2>
          <p className="text-sm text-gray-600">Community Safety Hub</p>
        </div>

        {/* Quick Stats */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{moderationStats.communityHealth}%</div>
                <div className="text-xs text-gray-600">Health Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{moderationStats.pendingReview}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{moderationStats.resolvedToday}</div>
                <div className="text-xs text-gray-600">Resolved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{moderationStats.falsePositiveRate}%</div>
                <div className="text-xs text-gray-600">False Positive</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const canAccess = canAccessView(item);

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
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Priority Alerts */}
        {(userRole === 'volunteer' || userRole === 'staff' || userRole === 'admin') && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                Priority Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-2 bg-white rounded border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <div className="flex-1">
                      <div className="text-xs font-medium">Critical Report</div>
                      <div className="text-xs text-gray-600">Requires immediate review</div>
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600"
                  onClick={() => handleNavigation('reports')}
                >
                  View All Alerts
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5",
                    activity.severity === 'high' && "bg-red-500",
                    activity.severity === 'medium' && "bg-yellow-500",
                    activity.severity === 'low' && "bg-green-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{activity.description}</div>
                    <div className="text-xs text-gray-500">
                      {Math.floor((Date.now() - activity.timestamp.getTime()) / 60000)} min ago
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Role Badge */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                  {userRole.charAt(0).toUpperCase()}
                </div>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">Your Role</div>
                <Badge variant="outline" className="text-xs capitalize">
                  {userRole}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardContent className="p-4 text-center">
            <HelpCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h4 className="font-medium text-sm mb-1">Need Help?</h4>
            <p className="text-xs text-gray-600 mb-3">
              Access moderation guidelines and support resources
            </p>
            <Button size="sm" variant="outline" className="w-full">
              View Guidelines
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Moderation Dashboard
              </h1>
              <p className="text-gray-600">
                Monitor community safety and manage content moderation
              </p>
            </div>
            <Shield className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{moderationStats.communityHealth}%</div>
                <div className="text-sm text-gray-600">Community Health</div>
              </div>
              <Heart className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{moderationStats.userSafetyScore}%</div>
                <div className="text-sm text-gray-600">Safety Score</div>
              </div>
              <Shield className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{moderationStats.automatedDetections}</div>
                <div className="text-sm text-gray-600">AI Detections</div>
              </div>
              <Bot className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{moderationStats.totalReports}</div>
                <div className="text-sm text-gray-600">Total Reports</div>
              </div>
              <Flag className="h-8 w-8 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => handleNavigation('reports')}
            >
              <Flag className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Review Reports</div>
                <div className="text-xs text-gray-500">{moderationStats.pendingReview} pending</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => handleNavigation('automated')}
              disabled={!canAccessView({ requiresRole: ['volunteer', 'staff', 'admin'] } as NavigationItem)}
            >
              <Bot className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">AI Settings</div>
                <div className="text-xs text-gray-500">Configure automation</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => handleNavigation('safety')}
            >
              <Shield className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Safety Controls</div>
                <div className="text-xs text-gray-500">User protection</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Moderation Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Reports', 'Automated Actions', 'Appeals', 'False Positives'].map((metric) => {
                const value = Math.floor(Math.random() * 100);
                const change = Math.floor(Math.random() * 20) - 10;
                return (
                  <div key={metric} className="flex items-center justify-between">
                    <span className="text-sm">{metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{value}</span>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          change > 0 ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {change > 0 ? '+' : ''}{change}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Moderator Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Moderators</span>
                <span className="font-medium">12 / 15</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Avg Response Time</span>
                <span className="font-medium">8 minutes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Cases Resolved Today</span>
                <span className="font-medium">{moderationStats.resolvedToday}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Team Accuracy</span>
                <span className="font-medium">96.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();

      case 'automated':
        return canAccessView({ requiresRole: ['volunteer', 'staff', 'admin'] } as NavigationItem) ? (
          <AutomatedModeration
            onRuleUpdate={(rule) => console.log('Update rule:', rule)}
            onManualReview={(contentId) => console.log('Manual review:', contentId)}
            onSystemToggle={(system, enabled) => console.log('Toggle system:', system, enabled)}
            onThresholdChange={(system, threshold) => console.log('Update threshold:', system, threshold)}
          />
        ) : (
          <div className="text-center py-12">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">You need moderator permissions to access this section</p>
          </div>
        );

      case 'reports':
        return (
          <CommunityReporting
            currentUserId={currentUserId}
            userRole={userRole === 'member' ? 'member' : userRole === 'trusted' ? 'trusted' : 'moderator'}
            onSubmitReport={(report) => console.log('Submit report:', report)}
            onVoteReport={(reportId, vote) => console.log('Vote on report:', reportId, vote)}
            onReviewReport={(reportId, action) => console.log('Review report:', reportId, action)}
            onEscalateReport={(reportId) => console.log('Escalate report:', reportId)}
          />
        );

      case 'moderator':
        return canAccessView({ requiresRole: ['volunteer', 'staff', 'admin'] } as NavigationItem) ? (
          <ModeratorDashboard
            moderatorId={currentUserId}
            role={userRole as any}
            onTakeAction={(action) => console.log('Take action:', action)}
            onAssignCase={(caseId, moderatorId) => console.log('Assign case:', caseId, moderatorId)}
            onEscalateCase={(caseId, reason) => console.log('Escalate case:', caseId, reason)}
            onUpdateSettings={(settings) => console.log('Update settings:', settings)}
          />
        ) : (
          <div className="text-center py-12">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">You need moderator permissions to access this section</p>
          </div>
        );

      case 'safety':
        return (
          <SafetyFeatures
            userId={currentUserId}
            userRole={userRole as any}
            onUpdatePrivacy={(settings) => console.log('Update privacy:', settings)}
            onBlockUser={(userId, reason) => console.log('Block user:', userId, reason)}
            onUnblockUser={(userId) => console.log('Unblock user:', userId)}
            onUpdateFilters={(filters) => console.log('Update filters:', filters)}
            onReportIssue={(issue) => console.log('Report issue:', issue)}
          />
        );

      case 'analytics':
        return canAccessView({ requiresRole: ['staff', 'admin'] } as NavigationItem) ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Moderation Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600">Detailed moderation statistics and trends</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">You need staff permissions to access analytics</p>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  const Avatar = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("rounded-full overflow-hidden", className)}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-bold text-lg">Moderation</h1>
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
                  const canAccess = canAccessView(item);
                  
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
                      {item.badge && (
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
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}