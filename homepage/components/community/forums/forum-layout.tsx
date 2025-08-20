'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare,
  Search,
  Plus,
  TrendingUp,
  Users,
  Bell,
  Bookmark,
  Settings,
  Filter,
  Grid,
  List,
  Eye,
  Clock,
  Star,
  Hash,
  Globe,
  Home,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import forum components
import { ForumCategories } from './forum-categories';
import { ThreadList } from './thread-list';
import { ForumSearch } from './forum-search';
import { ThreadComposer } from './thread-composer';
import { ThreadSubscriptions } from './thread-subscriptions';
import { ThreadMentionsQuotes } from './thread-mentions-quotes';

interface ForumLayoutProps {
  initialView?: 'home' | 'categories' | 'threads' | 'search' | 'create' | 'subscriptions' | 'mentions';
  initialCategory?: string;
  userRole?: 'member' | 'creator' | 'moderator' | 'admin';
  isAuthenticated?: boolean;
  onNavigate?: (view: string, params?: any) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  badge?: number;
  requiresAuth?: boolean;
}

interface ForumStats {
  totalThreads: number;
  totalPosts: number;
  activeUsers: number;
  onlineNow: number;
  todaysPosts: number;
  trendingTopics: string[];
}

export function ForumLayout({
  initialView = 'home',
  initialCategory,
  userRole = 'member',
  isAuthenticated = false,
  onNavigate
}: ForumLayoutProps) {
  const [currentView, setCurrentView] = React.useState(initialView);
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [layoutMode, setLayoutMode] = React.useState<'grid' | 'list'>('list');

  // Forum statistics
  const forumStats: ForumStats = {
    totalThreads: 5847,
    totalPosts: 32641,
    activeUsers: 1234,
    onlineNow: 89,
    todaysPosts: 156,
    trendingTopics: ['kreyol', 'travel', 'recipes', 'music', 'culture']
  };

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Forum Home',
      icon: Home,
      description: 'Overview and recent activity'
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: Grid,
      description: 'Browse all forum categories'
    },
    {
      id: 'threads',
      label: 'All Threads',
      icon: MessageSquare,
      description: 'View all discussions'
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      description: 'Find threads and posts'
    },
    {
      id: 'create',
      label: 'New Thread',
      icon: Plus,
      description: 'Start a new discussion',
      requiresAuth: true
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: Bell,
      description: 'Your followed threads',
      badge: 5,
      requiresAuth: true
    },
    {
      id: 'mentions',
      label: 'Mentions',
      icon: Star,
      description: 'Your mentions and quotes',
      badge: 3,
      requiresAuth: true
    }
  ];

  const handleNavigation = (view: string, params?: any) => {
    setCurrentView(view);
    if (params?.category) {
      setSelectedCategory(params.category);
    }
    setIsMobileMenuOpen(false);
    onNavigate?.(view, params);
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      handleNavigation('search');
    }
  };

  const renderSidebar = () => (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Logo/Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Community Forums</h2>
          <p className="text-sm text-gray-600">Kominote Ayisyen</p>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Quick search..."
            value={searchQuery}
            onChange={(e) => handleQuickSearch(e.target.value)}
            className="pl-10"
          />
        </div>

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

        {/* Forum Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Forum Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-purple-600">{forumStats.totalThreads.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Threads</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-blue-600">{forumStats.totalPosts.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-600">{forumStats.activeUsers.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Members</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-orange-600">{forumStats.onlineNow}</div>
                <div className="text-xs text-gray-600">Online</div>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-600 mb-1">Today: {forumStats.todaysPosts} new posts</div>
              <div className="text-xs text-gray-600">Trending topics:</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {forumStats.trendingTopics.slice(0, 3).map((topic) => (
                  <Badge key={topic} variant="outline" className="text-xs">
                    <Hash className="h-2 w-2 mr-1" />
                    {topic}
                  </Badge>
                ))}
              </div>
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
              Start New Thread
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleNavigation('subscriptions')}>
                <Bell className="h-4 w-4 mr-1" />
                Subscriptions
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleNavigation('mentions')}>
                <Star className="h-4 w-4 mr-1" />
                Mentions
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderBreadcrumb = () => {
    const breadcrumbs = [];
    
    breadcrumbs.push({ label: 'Forums', href: '#', onClick: () => handleNavigation('home') });
    
    if (currentView === 'categories') {
      breadcrumbs.push({ label: 'Categories', href: '#' });
    } else if (currentView === 'threads') {
      breadcrumbs.push({ label: 'All Threads', href: '#' });
    } else if (currentView === 'search') {
      breadcrumbs.push({ label: 'Search', href: '#' });
    } else if (currentView === 'create') {
      breadcrumbs.push({ label: 'New Thread', href: '#' });
    } else if (currentView === 'subscriptions') {
      breadcrumbs.push({ label: 'Subscriptions', href: '#' });
    } else if (currentView === 'mentions') {
      breadcrumbs.push({ label: 'Mentions & Quotes', href: '#' });
    }

    if (selectedCategory) {
      breadcrumbs.push({ label: selectedCategory, href: '#' });
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
      case 'home':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      Welcome to Ann Pale Forums
                    </h2>
                    <p className="text-gray-600">
                      Connect with the Haitian community worldwide. Share stories, ask questions, and celebrate our culture together.
                    </p>
                  </div>
                  {isAuthenticated ? (
                    <Button onClick={() => handleNavigation('create')}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Thread
                    </Button>
                  ) : (
                    <Button variant="outline">
                      Sign In to Participate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{forumStats.totalThreads.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Threads</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{forumStats.totalPosts.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Posts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{forumStats.activeUsers.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Community Members</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{forumStats.onlineNow}</div>
                  <div className="text-sm text-gray-600">Online Now</div>
                </CardContent>
              </Card>
            </div>

            {/* Categories Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Forum Categories</h3>
                <Button variant="outline" onClick={() => handleNavigation('categories')}>
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <ForumCategories 
                showSubCategories={false}
                onCategoryClick={(category) => handleNavigation('threads', { category: category.id })}
              />
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Forum Categories</h2>
                <p className="text-gray-600">Browse discussions by topic</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLayoutMode(layoutMode === 'grid' ? 'list' : 'grid')}
                >
                  {layoutMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <ForumCategories 
              layout={layoutMode}
              onCategoryClick={(category) => handleNavigation('threads', { category: category.id })}
            />
          </div>
        );

      case 'threads':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedCategory ? `${selectedCategory} Threads` : 'All Threads'}
                </h2>
                <p className="text-gray-600">Recent discussions and conversations</p>
              </div>
              {isAuthenticated && (
                <Button onClick={() => handleNavigation('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Thread
                </Button>
              )}
            </div>
            <ThreadList 
              categoryId={selectedCategory}
              onThreadClick={(thread) => console.log('Thread clicked:', thread)}
              onAuthorClick={(authorId) => console.log('Author clicked:', authorId)}
              onTagClick={(tag) => console.log('Tag clicked:', tag)}
            />
          </div>
        );

      case 'search':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Search Forums</h2>
              <p className="text-gray-600">Find threads, posts, and discussions</p>
            </div>
            <ForumSearch 
              onSearch={(filters) => console.log('Search:', filters)}
              onFilterChange={(filters) => console.log('Filters changed:', filters)}
            />
          </div>
        );

      case 'create':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Create New Thread</h2>
              <p className="text-gray-600">Start a new discussion in the community</p>
            </div>
            <ThreadComposer 
              categoryId={selectedCategory}
              onSubmit={(thread) => {
                console.log('Thread created:', thread);
                handleNavigation('threads');
              }}
              onCancel={() => handleNavigation('home')}
              onSaveDraft={(draft) => console.log('Draft saved:', draft)}
            />
          </div>
        );

      case 'subscriptions':
        return (
          <ThreadSubscriptions 
            onThreadClick={(threadId) => console.log('Thread clicked:', threadId)}
            onUserClick={(userId) => console.log('User clicked:', userId)}
            onUnsubscribe={(subscriptionId) => console.log('Unsubscribed:', subscriptionId)}
            onUpdateNotificationLevel={(id, level) => console.log('Notification level updated:', id, level)}
            onUpdateSettings={(settings) => console.log('Settings updated:', settings)}
          />
        );

      case 'mentions':
        return (
          <ThreadMentionsQuotes 
            onMentionClick={(mention) => console.log('Mention clicked:', mention)}
            onQuoteClick={(quote) => console.log('Quote clicked:', quote)}
            onMarkAsRead={(mentionId) => console.log('Marked as read:', mentionId)}
            onReply={(mentionId) => console.log('Reply to mention:', mentionId)}
          />
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
          <h1 className="font-bold text-lg">Forums</h1>
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