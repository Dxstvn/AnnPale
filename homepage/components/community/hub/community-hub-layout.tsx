'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Menu,
  X,
  Home,
  MessageSquare,
  Calendar,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import our community components
import { WelcomeHero } from './welcome-hero';
import { ActivityFeed } from './activity-feed';
import { CommunitySections } from './community-sections';
import { TrendingContent } from './trending-content';
import { CommunityStats } from './community-stats';

interface CommunityHubLayoutProps {
  isAuthenticated?: boolean;
  userRole?: 'member' | 'creator' | 'moderator' | 'admin';
  initialTab?: string;
}

export function CommunityHubLayout({
  isAuthenticated = false,
  userRole = 'member',
  initialTab = 'home'
}: CommunityHubLayoutProps) {
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(3);

  const hubTabs = [
    {
      id: 'home',
      label: 'Hub Home',
      icon: Home,
      description: 'Community overview and activity'
    },
    {
      id: 'feed',
      label: 'Activity Feed',
      icon: MessageSquare,
      description: 'Latest discussions and posts'
    },
    {
      id: 'sections',
      label: 'Explore Sections',
      icon: Menu,
      description: 'Browse community topics'
    },
    {
      id: 'trending',
      label: 'Trending',
      icon: TrendingUp,
      description: 'Hot topics and rising stars'
    },
    {
      id: 'analytics',
      label: 'Community Stats',
      icon: BarChart3,
      description: 'Community insights and metrics'
    }
  ];

  // Mobile navigation component
  const MobileNav = () => (
    <div className="lg:hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Community Hub</h1>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="space-y-2">
            {hubTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // Desktop sidebar navigation
  const DesktopNav = () => (
    <div className="hidden lg:block w-80 h-screen bg-white border-r border-gray-200 overflow-y-auto sticky top-0">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Community Hub</h1>
          {isAuthenticated && (
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
          )}
        </div>

        <nav className="space-y-2">
          {hubTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="w-full justify-start h-auto p-3"
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs opacity-70">{tab.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </nav>

        {isAuthenticated && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Start Discussion
            </Button>
          </div>
        )}

        {/* Quick Stats in Sidebar */}
        <div className="mt-6">
          <CommunityStats layout="compact" showGoals={false} showTrends={false} />
        </div>
      </div>
    </div>
  );

  // Content area based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            <WelcomeHero 
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              onJoinCommunity={() => console.log('Join community')}
              onCreatePost={() => setActiveTab('feed')}
              onViewEvents={() => setActiveTab('sections')}
            />
            
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Recent Activity</h2>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('feed')}
                      >
                        View All Activity
                      </Button>
                    </div>
                    <ActivityFeed maxItems={5} showFilters={false} />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Popular Sections</h2>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('sections')}
                      >
                        Explore All
                      </Button>
                    </div>
                    <CommunitySections 
                      maxSections={6} 
                      showStats={true}
                      onSectionClick={(section) => console.log('Section clicked:', section)}
                    />
                  </div>
                </div>
                
                <div className="space-y-8">
                  <TrendingContent 
                    onTopicClick={(topic) => console.log('Topic clicked:', topic)}
                    onCreatorClick={(creator) => console.log('Creator clicked:', creator)}
                    onEventClick={(event) => console.log('Event clicked:', event)}
                    onChallengeClick={(challenge) => console.log('Challenge clicked:', challenge)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'feed':
        return (
          <div className="container mx-auto px-4 py-8">
            <ActivityFeed 
              showFilters={true}
              onItemClick={(item) => console.log('Activity item clicked:', item)}
              onLike={(itemId) => console.log('Liked:', itemId)}
              onComment={(itemId) => console.log('Comment on:', itemId)}
              onShare={(itemId) => console.log('Shared:', itemId)}
            />
          </div>
        );

      case 'sections':
        return (
          <div className="container mx-auto px-4 py-8">
            <CommunitySections 
              layout="grid"
              showStats={true}
              onSectionClick={(section) => console.log('Section clicked:', section)}
              onCreateSection={() => console.log('Create section')}
            />
          </div>
        );

      case 'trending':
        return (
          <div className="container mx-auto px-4 py-8">
            <TrendingContent 
              onTopicClick={(topic) => console.log('Topic clicked:', topic)}
              onCreatorClick={(creator) => console.log('Creator clicked:', creator)}
              onEventClick={(event) => console.log('Event clicked:', event)}
              onChallengeClick={(challenge) => console.log('Challenge clicked:', challenge)}
            />
          </div>
        );

      case 'analytics':
        return (
          <div className="container mx-auto px-4 py-8">
            <CommunityStats 
              layout="grid"
              showGoals={true}
              showTrends={true}
              onStatClick={(stat) => console.log('Stat clicked:', stat)}
            />
          </div>
        );

      default:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
              <p className="text-gray-600 mb-6">The requested content could not be found.</p>
              <Button onClick={() => setActiveTab('home')}>
                Return to Hub Home
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNav />
      
      <div className="flex">
        <DesktopNav />
        
        <div className="flex-1 overflow-hidden">
          {/* Mobile tabs */}
          <div className="lg:hidden border-b border-gray-200 bg-white">
            <div className="flex overflow-x-auto">
              {hubTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    className="flex-shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Main content */}
          <main className="min-h-screen">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}