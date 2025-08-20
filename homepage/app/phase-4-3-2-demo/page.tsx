'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Home,
  Users,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Calendar,
  ArrowRight,
  Globe,
  Sparkles,
  Target,
  Activity,
  Heart,
  Brain,
  Settings
} from 'lucide-react';

// Import Phase 4.3.2 components
import { CommunityHubLayout } from '@/components/community/hub/community-hub-layout';
import { WelcomeHero } from '@/components/community/hub/welcome-hero';
import { ActivityFeed } from '@/components/community/hub/activity-feed';
import { CommunitySections } from '@/components/community/hub/community-sections';
import { TrendingContent } from '@/components/community/hub/trending-content';
import { CommunityStats } from '@/components/community/hub/community-stats';

export default function Phase432Demo() {
  const [activeDemo, setActiveDemo] = React.useState<string>('overview');
  const [userRole, setUserRole] = React.useState<'member' | 'creator' | 'moderator' | 'admin'>('member');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const demoSections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Brain,
      description: 'Community Hub Homepage Architecture'
    },
    {
      id: 'full-hub',
      title: 'Full Hub Experience',
      icon: Home,
      description: 'Complete community hub layout'
    },
    {
      id: 'welcome-hero',
      title: 'Welcome Hero',
      icon: Sparkles,
      description: 'Community mission & live stats'
    },
    {
      id: 'activity-feed',
      title: 'Activity Feed',
      icon: MessageSquare,
      description: 'Real-time discussions & posts'
    },
    {
      id: 'sections',
      title: 'Community Sections',
      icon: Users,
      description: 'Topic-based navigation'
    },
    {
      id: 'trending',
      title: 'Trending Content',
      icon: TrendingUp,
      description: 'Hot topics & rising stars'
    },
    {
      id: 'stats',
      title: 'Community Analytics',
      icon: BarChart3,
      description: 'Stats & community health'
    }
  ];

  const hubFeatures = [
    {
      title: 'Welcome Experience',
      description: 'Engaging hero section with community mission, live statistics, and cultural greetings',
      icon: Sparkles,
      highlights: ['Cultural greeting system', 'Real-time member stats', 'Activity highlights', 'Personalized CTAs']
    },
    {
      title: 'Activity Feed',
      description: 'Real-time stream of community discussions, creator posts, and member interactions',
      icon: MessageSquare,
      highlights: ['Real-time updates', 'Content filtering', 'Engagement tracking', 'Rich media support']
    },
    {
      title: 'Community Sections',
      description: 'Organized topic areas for focused discussions and community building',
      icon: Users,
      highlights: ['Topic organization', 'Section analytics', 'Activity tracking', 'Mobile optimization']
    },
    {
      title: 'Trending System',
      description: 'Discovery of hot topics, rising community members, and popular content',
      icon: TrendingUp,
      highlights: ['Hot topics ranking', 'Rising creator detection', 'Live events', 'Challenge tracking']
    },
    {
      title: 'Community Analytics',
      description: 'Comprehensive insights into community health, engagement, and growth',
      icon: BarChart3,
      highlights: ['Growth metrics', 'Engagement tracking', 'Goal monitoring', 'Health indicators']
    },
    {
      title: 'Mobile Experience',
      description: 'Fully responsive design optimized for mobile community participation',
      icon: Globe,
      highlights: ['Touch-optimized UI', 'Offline support', 'Progressive Web App', 'Native feel']
    }
  ];

  const hubArchitecture = [
    {
      title: 'Information Architecture',
      description: 'Strategic content hierarchy for optimal discovery',
      icon: Target,
      details: [
        'Activity Feed: Primary engagement driver',
        'Hot Topics: High frequency updates',
        'Community Sections: Organized by interest',
        'Events Calendar: Time-based discovery',
        'Member Directory: Connection facilitation'
      ],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Engagement Strategy',
      description: 'Psychology-driven features to maximize participation',
      icon: Heart,
      details: [
        'Live Activity: Real-time participation signals',
        'Trending Content: FOMO and social proof',
        'Community Stats: Progress and achievement',
        'Personal Progress: Individual milestones',
        'Social Recognition: Public acknowledgment'
      ],
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Navigation Framework',
      description: 'Intuitive wayfinding for all user types',
      icon: Activity,
      details: [
        'Hub Overview: Central starting point',
        'Activity Feed: Chronological content',
        'Section Explorer: Topic-based browsing',
        'Trending Now: Discovery and zeitgeist',
        'Community Stats: Insights and metrics'
      ],
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  const renderDemo = () => {
    switch (activeDemo) {
      case 'full-hub':
        return (
          <div className="h-screen">
            <CommunityHubLayout 
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              initialTab="home"
            />
          </div>
        );
      
      case 'welcome-hero':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Community Welcome Hero</h2>
              <p className="text-gray-600">Engaging entry point with cultural greetings and live stats</p>
            </div>
            <WelcomeHero 
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              onJoinCommunity={() => console.log('Join community')}
              onCreatePost={() => console.log('Create post')}
              onViewEvents={() => console.log('View events')}
            />
          </div>
        );
      
      case 'activity-feed':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Community Activity Feed</h2>
              <p className="text-gray-600">Real-time discussions, creator posts, and community interactions</p>
            </div>
            <div className="container mx-auto px-4">
              <ActivityFeed 
                showFilters={true}
                onItemClick={(item) => console.log('Activity item clicked:', item)}
                onLike={(itemId) => console.log('Liked:', itemId)}
                onComment={(itemId) => console.log('Comment on:', itemId)}
                onShare={(itemId) => console.log('Shared:', itemId)}
              />
            </div>
          </div>
        );
      
      case 'sections':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Community Sections</h2>
              <p className="text-gray-600">Organized topic areas for focused discussions and discovery</p>
            </div>
            <div className="container mx-auto px-4">
              <CommunitySections 
                layout="grid"
                showStats={true}
                onSectionClick={(section) => console.log('Section clicked:', section)}
                onCreateSection={() => console.log('Create section')}
              />
            </div>
          </div>
        );
      
      case 'trending':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Trending Content</h2>
              <p className="text-gray-600">Hot topics, rising stars, and community zeitgeist</p>
            </div>
            <div className="container mx-auto px-4">
              <TrendingContent 
                onTopicClick={(topic) => console.log('Topic clicked:', topic)}
                onCreatorClick={(creator) => console.log('Creator clicked:', creator)}
                onEventClick={(event) => console.log('Event clicked:', event)}
                onChallengeClick={(challenge) => console.log('Challenge clicked:', challenge)}
              />
            </div>
          </div>
        );
      
      case 'stats':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Community Analytics</h2>
              <p className="text-gray-600">Comprehensive insights into community health and engagement</p>
            </div>
            <div className="container mx-auto px-4">
              <CommunityStats 
                layout="grid"
                showGoals={true}
                showTrends={true}
                onStatClick={(stat) => console.log('Stat clicked:', stat)}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                <Home className="h-4 w-4" />
                Phase 4.3.2: Community Hub Homepage
              </div>
              <h1 className="text-3xl font-bold">
                Community Hub Architecture
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                A comprehensive community homepage that showcases activity, facilitates discovery, 
                and encourages participation through strategic information hierarchy and engaging user experience.
              </p>
            </div>

            {/* Hub Architecture Framework */}
            <div className="grid md:grid-cols-3 gap-6">
              {hubArchitecture.map((framework) => {
                const Icon = framework.icon;
                return (
                  <Card key={framework.title} className={`hover:shadow-lg transition-shadow ${framework.color}`}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{framework.title}</CardTitle>
                          <p className="text-sm text-gray-600">{framework.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {framework.details.map((detail, index) => (
                          <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <div className="w-1 h-1 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Key Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hubFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{feature.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                      <div className="space-y-1">
                        {feature.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-1 h-1 bg-blue-600 rounded-full" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Implementation Components */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Implementation Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Core Hub Components</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>CommunityHubLayout</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>WelcomeHero</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>ActivityFeed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>CommunitySections</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>TrendingContent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>CommunityStats</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Hub Features</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-blue-600" />
                        <span>Cultural greeting system</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-3 w-3 text-green-600" />
                        <span>Real-time activity tracking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-purple-600" />
                        <span>Dynamic trending algorithm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-3 w-3 text-yellow-600" />
                        <span>Community health metrics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3 text-red-600" />
                        <span>Mobile-optimized experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-orange-600" />
                        <span>Strategic information hierarchy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Demos */}
            <Card>
              <CardHeader>
                <CardTitle>Interactive Component Demos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {demoSections.slice(1).map((section) => {
                    const Icon = section.icon;
                    return (
                      <Button
                        key={section.id}
                        variant="outline"
                        className="h-auto p-4 justify-start"
                        onClick={() => setActiveDemo(section.id)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <div className="text-left">
                            <div className="font-medium text-sm">{section.title}</div>
                            <div className="text-xs text-gray-500">{section.description}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-auto" />
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* User Role Simulator */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Experience Simulator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Authentication State</label>
                    <div className="flex gap-2">
                      <Button
                        variant={!isAuthenticated ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsAuthenticated(false)}
                      >
                        Guest User
                      </Button>
                      <Button
                        variant={isAuthenticated ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsAuthenticated(true)}
                      >
                        Authenticated
                      </Button>
                    </div>
                  </div>
                  
                  {isAuthenticated && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">User Role</label>
                      <div className="flex gap-2">
                        {(['member', 'creator', 'moderator', 'admin'] as const).map((role) => (
                          <Button
                            key={role}
                            variant={userRole === role ? "default" : "outline"}
                            size="sm"
                            onClick={() => setUserRole(role)}
                            className="capitalize"
                          >
                            {role}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Button 
                      onClick={() => setActiveDemo('full-hub')}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Experience Full Community Hub
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  if (activeDemo === 'full-hub') {
    return renderDemo();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {activeDemo !== 'overview' && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="flex items-center gap-3 p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveDemo('overview')}
              className="h-8 w-8 p-0"
            >
              ←
            </Button>
            <div>
              <h1 className="font-semibold text-sm">
                {demoSections.find(s => s.id === activeDemo)?.title}
              </h1>
              <p className="text-xs text-gray-600">Phase 4.3.2 Demo</p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:flex">
        <div className="w-80 h-screen bg-white border-r border-gray-200 overflow-y-auto sticky top-0">
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="font-bold text-lg">Phase 4.3.2</h2>
                <p className="text-sm text-gray-600">Community Hub Homepage</p>
              </div>
              
              <nav className="space-y-2">
                {demoSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={activeDemo === section.id ? "default" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setActiveDemo(section.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Icon className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{section.title}</div>
                          <div className="text-xs opacity-70">{section.description}</div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            {renderDemo()}
          </div>
        </div>
      </div>

      {/* Mobile Full Screen */}
      <div className="lg:hidden">
        <div className="p-4">
          {renderDemo()}
        </div>
      </div>
    </div>
  );
}