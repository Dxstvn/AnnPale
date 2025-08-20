'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Users,
  Search,
  Plus,
  Bell,
  Star,
  Hash,
  ArrowRight,
  Brain,
  Sparkles,
  Target,
  Activity,
  Heart,
  Settings,
  Grid,
  AtSign,
  Quote,
  Bookmark,
  TrendingUp,
  Award
} from 'lucide-react';

// Import Phase 4.3.3 components
import { ForumLayout } from '@/components/community/forums/forum-layout';
import { ForumCategories } from '@/components/community/forums/forum-categories';
import { ThreadList } from '@/components/community/forums/thread-list';
import { ForumSearch } from '@/components/community/forums/forum-search';
import { ThreadComposer } from '@/components/community/forums/thread-composer';
import { ThreadSubscriptions } from '@/components/community/forums/thread-subscriptions';
import { ThreadMentionsQuotes } from '@/components/community/forums/thread-mentions-quotes';

export default function Phase433Demo() {
  const [activeDemo, setActiveDemo] = React.useState<string>('overview');
  const [userRole, setUserRole] = React.useState<'member' | 'creator' | 'moderator' | 'admin'>('member');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const demoSections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Brain,
      description: 'Discussion Forums System Architecture'
    },
    {
      id: 'full-forum',
      title: 'Complete Forum Experience',
      icon: MessageSquare,
      description: 'Full forum layout with all features'
    },
    {
      id: 'categories',
      title: 'Forum Categories',
      icon: Grid,
      description: 'Hierarchical forum organization'
    },
    {
      id: 'threads',
      title: 'Thread Management',
      icon: Users,
      description: 'Thread lists with karma system'
    },
    {
      id: 'composer',
      title: 'Rich Text Composer',
      icon: Plus,
      description: 'Advanced thread creation'
    },
    {
      id: 'search',
      title: 'Advanced Search',
      icon: Search,
      description: 'Powerful search and filtering'
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions',
      icon: Bell,
      description: 'Thread and user subscriptions'
    },
    {
      id: 'mentions',
      title: 'Mentions & Quotes',
      icon: AtSign,
      description: 'User engagement tracking'
    }
  ];

  const forumFeatures = [
    {
      title: 'Forum Hierarchy',
      description: 'Structured organization with main categories, sub-forums, and thread types',
      icon: Grid,
      highlights: ['7 main categories', 'Sub-forum organization', 'Thread type classification', 'Moderation tools']
    },
    {
      title: 'Thread Interaction Model',
      description: 'Karma-based engagement system with points for quality contributions',
      icon: Award,
      highlights: ['+10 Create Thread', '+5 Quality Reply', '+20 Best Answer', '+3 Share Thread', '+1 Like', '+2 Report']
    },
    {
      title: 'Content Quality Features',
      description: 'Rich text editing, formatting toolbar, and preview functionality',
      icon: Sparkles,
      highlights: ['Markdown-like formatting', 'Real-time preview', 'Keyboard shortcuts', 'Tag management']
    },
    {
      title: 'Discovery & Search',
      description: 'Advanced search with multiple filters and intelligent suggestions',
      icon: Search,
      highlights: ['Multi-criteria filtering', 'Search suggestions', 'Recent searches', 'Related content']
    },
    {
      title: 'Engagement Mechanics',
      description: 'Subscriptions, mentions, quotes, and notification management',
      icon: Heart,
      highlights: ['Thread subscriptions', 'User following', 'Mention tracking', 'Quote references']
    },
    {
      title: 'Community Management',
      description: 'Moderation tools and community health monitoring',
      icon: Settings,
      highlights: ['Role-based permissions', 'Content moderation', 'Community stats', 'Analytics dashboard']
    }
  ];

  const forumArchitecture = [
    {
      title: 'Information Architecture',
      description: 'Strategic content hierarchy for optimal discussion organization',
      icon: Target,
      details: [
        'Main Categories: Topic-based organization',
        'Sub-Forums: Specialized discussion areas',
        'Thread Types: Discussion, Question, Announcement, Poll, Resource, Event',
        'Special Sections: Featured, Pinned, Solved threads',
        'User Profiles: Karma, badges, role-based access'
      ],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Engagement Strategy',
      description: 'Psychology-driven features to maximize meaningful participation',
      icon: Heart,
      details: [
        'Karma System: Points for quality contributions',
        'Subscription Model: Follow threads and users',
        'Mention System: Direct user engagement',
        'Quote References: Content building and attribution',
        'Badge System: Recognition and achievements'
      ],
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Content Quality Framework',
      description: 'Tools and systems to ensure high-quality discussions',
      icon: Star,
      details: [
        'Rich Text Editor: Advanced formatting capabilities',
        'Preview System: Real-time content preview',
        'Tag Management: Content categorization',
        'Search & Discovery: Advanced filtering and suggestions',
        'Moderation Tools: Content review and management'
      ],
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  const renderDemo = () => {
    switch (activeDemo) {
      case 'full-forum':
        return (
          <div className="h-screen">
            <ForumLayout 
              initialView="home"
              userRole={userRole}
              isAuthenticated={isAuthenticated}
              onNavigate={(view, params) => console.log('Navigate:', view, params)}
            />
          </div>
        );
      
      case 'categories':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Forum Categories</h2>
              <p className="text-gray-600">Hierarchical organization with 7 main categories and sub-forums</p>
            </div>
            <div className="container mx-auto px-4">
              <ForumCategories 
                layout="list"
                showSubCategories={true}
                onCategoryClick={(category) => console.log('Category clicked:', category)}
              />
            </div>
          </div>
        );
      
      case 'threads':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Thread Management</h2>
              <p className="text-gray-600">Thread lists with karma system and interaction model</p>
            </div>
            <div className="container mx-auto px-4">
              <ThreadList 
                sortBy="latest"
                filterBy="all"
                showActions={true}
                onThreadClick={(thread) => console.log('Thread clicked:', thread)}
                onAuthorClick={(authorId) => console.log('Author clicked:', authorId)}
                onTagClick={(tag) => console.log('Tag clicked:', tag)}
              />
            </div>
          </div>
        );
      
      case 'composer':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Rich Text Composer</h2>
              <p className="text-gray-600">Advanced thread creation with formatting and preview</p>
            </div>
            <div className="container mx-auto px-4 max-w-4xl">
              <ThreadComposer 
                isReply={false}
                onSubmit={(thread) => console.log('Thread created:', thread)}
                onCancel={() => console.log('Cancelled')}
                onSaveDraft={(draft) => console.log('Draft saved:', draft)}
              />
            </div>
          </div>
        );
      
      case 'search':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Advanced Search</h2>
              <p className="text-gray-600">Powerful search with multiple filters and suggestions</p>
            </div>
            <div className="container mx-auto px-4">
              <ForumSearch 
                onSearch={(filters) => console.log('Search:', filters)}
                onFilterChange={(filters) => console.log('Filters changed:', filters)}
                suggestions={[]}
                relatedThreads={[]}
                recentSearches={['kreyol learning', 'haitian recipes', 'travel tips']}
              />
            </div>
          </div>
        );
      
      case 'subscriptions':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Thread & User Subscriptions</h2>
              <p className="text-gray-600">Manage followed threads and users with notification preferences</p>
            </div>
            <div className="container mx-auto px-4">
              <ThreadSubscriptions 
                view="threads"
                onThreadClick={(threadId) => console.log('Thread clicked:', threadId)}
                onUserClick={(userId) => console.log('User clicked:', userId)}
                onUnsubscribe={(subscriptionId) => console.log('Unsubscribed:', subscriptionId)}
                onUpdateNotificationLevel={(id, level) => console.log('Notification updated:', id, level)}
                onUpdateSettings={(settings) => console.log('Settings updated:', settings)}
              />
            </div>
          </div>
        );
      
      case 'mentions':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Mentions & Quotes</h2>
              <p className="text-gray-600">Track mentions, replies, and content quotes</p>
            </div>
            <div className="container mx-auto px-4">
              <ThreadMentionsQuotes 
                view="mentions"
                currentUserId="current-user"
                onMentionClick={(mention) => console.log('Mention clicked:', mention)}
                onQuoteClick={(quote) => console.log('Quote clicked:', quote)}
                onMarkAsRead={(mentionId) => console.log('Marked as read:', mentionId)}
                onReply={(mentionId) => console.log('Reply to mention:', mentionId)}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                <MessageSquare className="h-4 w-4" />
                Phase 4.3.3: Discussion Forums System
              </div>
              <h1 className="text-3xl font-bold">
                Structured Community Discussions
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                A comprehensive forum system providing structured spaces for meaningful discussions with 
                hierarchical organization, karma-based interactions, and advanced engagement mechanics.
              </p>
            </div>

            {/* Forum Architecture Framework */}
            <div className="grid md:grid-cols-3 gap-6">
              {forumArchitecture.map((framework) => {
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
              {forumFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-purple-600" />
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
                            <div className="w-1 h-1 bg-purple-600 rounded-full" />
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
                    <h4 className="font-semibold text-sm">Core Forum Components</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>ForumLayout</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>ForumCategories</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>ThreadList</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>ThreadComposer</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>ForumSearch</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>ThreadSubscriptions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>ThreadMentionsQuotes</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Forum Features</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Grid className="h-3 w-3 text-blue-600" />
                        <span>Hierarchical organization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-3 w-3 text-green-600" />
                        <span>Karma-based interactions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-purple-600" />
                        <span>Rich text editing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Search className="h-3 w-3 text-yellow-600" />
                        <span>Advanced search & filtering</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="h-3 w-3 text-red-600" />
                        <span>Subscription management</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AtSign className="h-3 w-3 text-orange-600" />
                        <span>Mention & quote tracking</span>
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
                          <Icon className="h-5 w-5 text-purple-600" />
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
                      onClick={() => setActiveDemo('full-forum')}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Experience Full Forum System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  if (activeDemo === 'full-forum') {
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
              <p className="text-xs text-gray-600">Phase 4.3.3 Demo</p>
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
                <h2 className="font-bold text-lg">Phase 4.3.3</h2>
                <p className="text-sm text-gray-600">Discussion Forums System</p>
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