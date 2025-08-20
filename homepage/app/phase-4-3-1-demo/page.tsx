'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  BarChart3,
  Users,
  Trophy,
  Target,
  Heart,
  Activity,
  TrendingUp,
  Star,
  Crown,
  MessageSquare,
  Eye,
  HelpCircle,
  Handshake,
  Megaphone,
  Gamepad2,
  ArrowRight,
  BookOpen,
  Compass,
  Settings,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

// Import Phase 4.3.1 components
import { EngagementPyramid } from '@/components/community/psychology/engagement-pyramid';
import { PersonaDetection } from '@/components/community/psychology/persona-detection';
import { AnalyticsDashboard } from '@/components/community/psychology/analytics-dashboard';
import { GamificationSystem } from '@/components/community/psychology/gamification-system';
import { ValueDrivers } from '@/components/community/psychology/value-drivers';
import { OnboardingSystem } from '@/components/community/psychology/onboarding-system';
import { HealthMetrics } from '@/components/community/psychology/health-metrics';

export default function Phase431Demo() {
  const [activeDemo, setActiveDemo] = React.useState<string>('overview');
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  const demoSections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Brain,
      description: 'Community Psychology & Engagement Dynamics'
    },
    {
      id: 'pyramid',
      title: 'Engagement Pyramid',
      icon: BarChart3,
      description: '5-level user engagement tracking'
    },
    {
      id: 'personas',
      title: 'Persona Detection',
      icon: Users,
      description: '6 community persona types'
    },
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      icon: Activity,
      description: 'Community psychology insights'
    },
    {
      id: 'gamification',
      title: 'Gamification',
      icon: Trophy,
      description: 'Recognition and reward systems'
    },
    {
      id: 'value-drivers',
      title: 'Value Drivers',
      icon: Target,
      description: '6 core community value types'
    },
    {
      id: 'onboarding',
      title: 'Smart Onboarding',
      icon: Star,
      description: 'Personalized user onboarding'
    },
    {
      id: 'health',
      title: 'Health Metrics',
      icon: Heart,
      description: 'Community wellness monitoring'
    }
  ];

  const psychologyFramework = [
    {
      title: 'Engagement Pyramid',
      description: '5-level hierarchy from Lurkers to Leaders',
      icon: BarChart3,
      details: [
        'Level 1: Lurkers (50%) - Silent observers',
        'Level 2: Observers (30%) - Occasional participants',
        'Level 3: Participants (15%) - Active members',
        'Level 4: Contributors (4%) - Content creators',
        'Level 5: Leaders (1%) - Community moderators'
      ],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Community Personas',
      description: '6 distinct behavioral types',
      icon: Users,
      details: [
        'Leaders: Recognition & influence seekers',
        'Contributors: Expression & connection focused',
        'Lurkers: Information & belonging oriented',
        'Questioners: Help & answer seekers',
        'Connectors: Networking & relationship builders',
        'Advocates: Mission & purpose supporters'
      ],
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Value Drivers',
      description: '6 core motivations for participation',
      icon: Target,
      details: [
        'Information: Knowledge & learning access',
        'Connection: Relationships & networking',
        'Recognition: Status & achievements',
        'Support: Help & emotional connection',
        'Entertainment: Fun & engaging content',
        'Purpose: Shared mission & meaningful impact'
      ],
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  const features = [
    {
      title: 'Psychological Profiling',
      description: 'Advanced algorithms to detect user personas and preferences',
      icon: Brain,
      highlights: ['Behavioral analysis', 'Pattern recognition', 'Predictive modeling']
    },
    {
      title: 'Engagement Tracking',
      description: 'Monitor user progression through community engagement levels',
      icon: TrendingUp,
      highlights: ['Level progression', 'Activity monitoring', 'Engagement scoring']
    },
    {
      title: 'Smart Gamification',
      description: 'Personalized rewards and recognition systems',
      icon: Trophy,
      highlights: ['Achievement systems', 'Personalized rewards', 'Progress tracking']
    },
    {
      title: 'Value Optimization',
      description: 'Maximize community value for all stakeholder types',
      icon: Target,
      highlights: ['Member satisfaction', 'Creator retention', 'Platform growth']
    },
    {
      title: 'Health Monitoring',
      description: 'Comprehensive community wellness and performance metrics',
      icon: Heart,
      highlights: ['Wellness indicators', 'Performance tracking', 'Early warning systems']
    },
    {
      title: 'Adaptive Onboarding',
      description: 'Personalized first-time user experience based on detected persona',
      icon: Star,
      highlights: ['Persona-specific flows', 'Value-based customization', 'Progressive disclosure']
    }
  ];

  const renderDemo = () => {
    switch (activeDemo) {
      case 'pyramid':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Community Engagement Pyramid</h2>
              <p className="text-gray-600">Track user progression through 5 engagement levels</p>
            </div>
            <EngagementPyramid 
              showPersonalProgress={true}
              showCommunityStats={true}
              onLevelUp={(level) => console.log('Level up:', level)}
              onActivityComplete={(activity, points) => console.log('Activity:', activity, points)}
            />
          </div>
        );
      
      case 'personas':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Community Persona Detection</h2>
              <p className="text-gray-600">AI-powered behavioral analysis and persona classification</p>
            </div>
            <PersonaDetection 
              showAnalysis={true}
              showRecommendations={true}
              onPersonaDetected={(persona, confidence) => 
                console.log('Persona detected:', persona, confidence)
              }
            />
          </div>
        );
      
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Community Psychology Analytics</h2>
              <p className="text-gray-600">Deep insights into community behavior and engagement patterns</p>
            </div>
            <AnalyticsDashboard 
              timeRange="30d"
              onTimeRangeChange={(range) => console.log('Time range:', range)}
              onExport={(format) => console.log('Export:', format)}
              onRefresh={() => console.log('Refresh analytics')}
            />
          </div>
        );
      
      case 'gamification':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Gamification & Recognition System</h2>
              <p className="text-gray-600">Achievements, badges, and leaderboards to drive engagement</p>
            </div>
            <GamificationSystem 
              showLeaderboard={true}
              showAchievements={true}
              showStreaks={true}
              onAchievementUnlock={(achievement) => console.log('Achievement:', achievement)}
              onLevelUp={(level, badge) => console.log('Level up:', level, badge)}
            />
          </div>
        );
      
      case 'value-drivers':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Community Value Drivers</h2>
              <p className="text-gray-600">Understanding what motivates community participation</p>
            </div>
            <ValueDrivers 
              showPersonalInsights={true}
              showCommunityMetrics={true}
              onDriverUpdate={(driverId, satisfaction) => 
                console.log('Driver update:', driverId, satisfaction)
              }
            />
          </div>
        );
      
      case 'onboarding':
        return (
          <div className="h-screen">
            <OnboardingSystem 
              onComplete={(profile) => {
                console.log('Onboarding complete:', profile);
                setShowOnboarding(false);
                setActiveDemo('overview');
              }}
              onSkip={() => {
                setShowOnboarding(false);
                setActiveDemo('overview');
              }}
              showProgress={true}
            />
          </div>
        );
      
      case 'health':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Community Health Metrics</h2>
              <p className="text-gray-600">Monitor community wellness and performance indicators</p>
            </div>
            <HealthMetrics 
              timeRange="30d"
              showAlerts={true}
              showRecommendations={true}
              onMetricClick={(metric) => console.log('Metric clicked:', metric)}
              onRefresh={() => console.log('Refresh health metrics')}
            />
          </div>
        );
      
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                <Brain className="h-4 w-4" />
                Phase 4.3.1: Community Psychology & Engagement Dynamics
              </div>
              <h1 className="text-3xl font-bold">
                Understanding Community Psychology
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                A comprehensive framework for understanding the psychological drivers of community participation, 
                designed to foster meaningful connections and sustained engagement through data-driven insights.
              </p>
            </div>

            {/* Psychology Framework */}
            <div className="grid md:grid-cols-3 gap-6">
              {psychologyFramework.map((framework) => {
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
              {features.map((feature) => {
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
                    <h4 className="font-semibold text-sm">Core Psychology Components</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>EngagementPyramid</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>PersonaDetection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>AnalyticsDashboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>GamificationSystem</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>ValueDrivers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>OnboardingSystem</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Component</Badge>
                        <span>HealthMetrics</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Psychological Insights</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Brain className="h-3 w-3 text-blue-600" />
                        <span>Behavioral pattern analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-green-600" />
                        <span>Persona-driven personalization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-purple-600" />
                        <span>Value-based engagement optimization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-yellow-600" />
                        <span>Progression pathway mapping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-3 w-3 text-red-600" />
                        <span>Community wellness monitoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-orange-600" />
                        <span>Achievement-driven motivation</span>
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
                
                <div className="mt-6">
                  <Button 
                    onClick={() => setShowOnboarding(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Experience Smart Onboarding Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Value Proposition */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  Community Psychology Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">For Members</h4>
                    <p className="text-sm text-gray-600">Personalized experience, meaningful connections, clear progression paths</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-2">For Creators</h4>
                    <p className="text-sm text-gray-600">Better audience understanding, increased engagement, stronger community bonds</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">For Platform</h4>
                    <p className="text-sm text-gray-600">Higher retention, organic growth, sustainable engagement, data-driven insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  if (showOnboarding) {
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
              <p className="text-xs text-gray-600">Phase 4.3.1 Demo</p>
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
                <h2 className="font-bold text-lg">Phase 4.3.1</h2>
                <p className="text-sm text-gray-600">Community Psychology & Engagement Dynamics</p>
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