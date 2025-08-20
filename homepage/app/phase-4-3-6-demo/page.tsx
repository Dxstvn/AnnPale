'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield,
  Users,
  Bot,
  Flag,
  Gavel,
  Lock,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Heart,
  Zap,
  TrendingUp,
  Clock,
  Award,
  Eye,
  ArrowRight,
  Play,
  Sparkles,
  Star,
  Info,
  Settings,
  Filter,
  UserX,
  MessageSquareOff,
  Bell
} from 'lucide-react';
import { ModerationLayout } from '@/components/community/moderation/moderation-layout';

export default function Phase436Demo() {
  const [activeDemo, setActiveDemo] = React.useState('overview');
  const [userRole, setUserRole] = React.useState<'member' | 'trusted' | 'volunteer' | 'staff' | 'admin'>('member');

  const demoSections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Community Moderation & Safety platform introduction',
      icon: Shield
    },
    {
      id: 'automated',
      title: 'Automated Moderation',
      description: 'AI-powered content moderation systems',
      icon: Bot
    },
    {
      id: 'reporting',
      title: 'Community Reporting',
      description: 'User reporting and review system',
      icon: Flag
    },
    {
      id: 'moderator',
      title: 'Moderator Tools',
      description: 'Dashboard and moderation actions',
      icon: Gavel
    },
    {
      id: 'safety',
      title: 'Safety Features',
      description: 'User protection and privacy controls',
      icon: Lock
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Moderation statistics and trends',
      icon: BarChart3
    }
  ];

  const platformFeatures = [
    {
      title: 'Automated Detection',
      description: 'AI-powered systems detect and handle violations automatically',
      icon: Bot,
      highlights: [
        'Spam detection with 97.8% accuracy',
        'Toxicity filtering and content removal',
        'NSFW image scanning',
        'Phishing and scam detection',
        'Real-time content analysis'
      ]
    },
    {
      title: 'Community Reporting',
      description: 'Empower users to report violations and participate in moderation',
      icon: Users,
      highlights: [
        '6 report categories with severity levels',
        'Community voting on reports',
        'Trusted reviewer system',
        'Evidence submission support',
        'Anonymous reporting options'
      ]
    },
    {
      title: 'Moderator Dashboard',
      description: 'Comprehensive tools for volunteer and staff moderators',
      icon: Gavel,
      highlights: [
        'Case management system',
        'Priority queue for critical issues',
        'Team collaboration tools',
        'Performance tracking',
        'Automated action suggestions'
      ]
    },
    {
      title: 'User Safety',
      description: 'Advanced privacy and protection features for all users',
      icon: Shield,
      highlights: [
        'Privacy level presets',
        'User blocking and muting',
        'Content filtering options',
        'Safety alerts and warnings',
        'Data protection controls'
      ]
    }
  ];

  const moderationStats = [
    { label: 'Community Health', value: '85%', color: 'text-green-600', description: 'Overall safety score' },
    { label: 'Reports Resolved', value: '234', color: 'text-blue-600', description: 'In the last 24 hours' },
    { label: 'AI Accuracy', value: '96.5%', color: 'text-purple-600', description: 'Detection precision' },
    { label: 'Response Time', value: '8 min', color: 'text-yellow-600', description: 'Average moderator response' },
    { label: 'Active Moderators', value: '15', color: 'text-pink-600', description: 'Currently online' },
    { label: 'False Positive Rate', value: '2.3%', color: 'text-indigo-600', description: 'Incorrect detections' }
  ];

  const safetyLevels = [
    {
      level: 'Basic',
      description: 'Essential safety features for all users',
      features: [
        'Report content and users',
        'Block and mute capabilities',
        'Basic privacy settings',
        'Content warnings'
      ],
      available: 'All Users'
    },
    {
      level: 'Enhanced',
      description: 'Additional protection for trusted members',
      features: [
        'Advanced content filters',
        'Custom privacy controls',
        'Priority report review',
        'Safety recommendations'
      ],
      available: 'Trusted Members'
    },
    {
      level: 'Moderator',
      description: 'Tools for community moderators',
      features: [
        'Case management dashboard',
        'Bulk moderation actions',
        'Team collaboration',
        'Analytics access'
      ],
      available: 'Volunteers & Staff'
    },
    {
      level: 'Admin',
      description: 'Full system control and oversight',
      features: [
        'System configuration',
        'AI threshold tuning',
        'Policy management',
        'Full analytics suite'
      ],
      available: 'Administrators'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Moderation & Safety
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Phase 4.3.6: Comprehensive moderation framework combining AI automation, 
              community participation, and professional oversight to ensure a safe platform.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-sm px-4 py-2">
                Pwoteksyon Kominoté
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm px-4 py-2">
                AI-Powered Safety
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moderationStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Moderation Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {platformFeatures.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {feature.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Safety Levels */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Safety Access Levels</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {safetyLevels.map((level) => (
            <Card key={level.level} className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg">{level.level}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{level.description}</p>
                <div className="space-y-2 mb-4">
                  {level.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
                <Badge variant="outline" className="text-xs w-full justify-center">
                  {level.available}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Role Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Demo Role Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Select a role to explore different moderation capabilities and access levels
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {(['member', 'trusted', 'volunteer', 'staff', 'admin'] as const).map((role) => (
              <Button
                key={role}
                variant={userRole === role ? 'default' : 'outline'}
                onClick={() => setUserRole(role)}
                className="capitalize"
              >
                {role}
              </Button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-900 mb-1">Current Role: {userRole}</div>
                <div className="text-blue-700">
                  {userRole === 'member' && 'Basic safety features and reporting capabilities'}
                  {userRole === 'trusted' && 'Enhanced safety features and community review participation'}
                  {userRole === 'volunteer' && 'Access to moderation dashboard and case management'}
                  {userRole === 'staff' && 'Full moderation tools and team collaboration features'}
                  {userRole === 'admin' && 'Complete system access including configuration and analytics'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Interactive Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Explore the different components of the moderation system. 
            Your selected role will determine which features you can access.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoSections.slice(1).map((section) => (
              <Button
                key={section.id}
                variant="outline"
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => setActiveDemo(section.id)}
              >
                <section.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{section.title}</div>
                  <div className="text-xs text-gray-500">{section.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Metrics */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <TrendingUp className="h-5 w-5" />
            Safety Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">78%</div>
              <div className="text-sm text-gray-600">Reduction in Violations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15 min</div>
              <div className="text-sm text-gray-600">Faster Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
              <div className="text-sm text-gray-600">User Safety Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.8/5</div>
              <div className="text-sm text-gray-600">Safety Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Status */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Sparkles className="h-5 w-5" />
            Implementation Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Completed Components:</h4>
              <div className="space-y-2">
                {[
                  'Automated Moderation with AI detection',
                  'Community Reporting system',
                  'Moderator Dashboard with case management',
                  'Safety Features and privacy controls',
                  'Moderation Layout with role-based access',
                  'Analytics and performance tracking'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Key Features:</h4>
              <div className="space-y-2">
                {[
                  'Multi-tiered moderation system',
                  'AI-powered content detection',
                  'Community-driven reporting',
                  'Real-time safety monitoring',
                  'Comprehensive privacy controls',
                  'Role-based access control'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDemo = () => {
    const viewMap = {
      'automated': 'automated',
      'reporting': 'reports',
      'moderator': 'moderator',
      'safety': 'safety',
      'analytics': 'analytics'
    };

    return (
      <div className="space-y-4">
        {/* Demo Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Live Demo: {demoSections.find(s => s.id === activeDemo)?.title}</h2>
                <p className="text-gray-600">{demoSections.find(s => s.id === activeDemo)?.description}</p>
                <Badge variant="outline" className="mt-2">
                  Current Role: {userRole}
                </Badge>
              </div>
              <Button variant="outline" onClick={() => setActiveDemo('overview')}>
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Overview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Content */}
        <ModerationLayout
          initialView={viewMap[activeDemo] || 'dashboard'}
          userRole={userRole}
          isAuthenticated={true}
          currentUserId="demo-user"
          onNavigate={(view) => {
            // Map view back to demo section
            const reverseMap = {
              'dashboard': 'overview',
              'automated': 'automated',
              'reports': 'reporting',
              'moderator': 'moderator',
              'safety': 'safety',
              'analytics': 'analytics'
            };
            if (reverseMap[view]) {
              setActiveDemo(reverseMap[view]);
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Button
              variant={activeDemo === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveDemo('overview')}
            >
              Overview
            </Button>
            {demoSections.slice(1).map((section) => (
              <Button
                key={section.id}
                variant={activeDemo === section.id ? 'default' : 'outline'}
                onClick={() => setActiveDemo(section.id)}
              >
                <section.icon className="h-4 w-4 mr-2" />
                {section.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeDemo === 'overview' ? renderOverview() : renderDemo()}
      </div>
    </div>
  );
}