'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Handshake,
  Users,
  Briefcase,
  Target,
  Plus,
  Star,
  Crown,
  Trophy,
  Gift,
  Zap,
  Calendar,
  ArrowRight,
  CheckCircle,
  Play,
  Sparkles,
  TrendingUp,
  DollarSign,
  Clock,
  MapPin,
  MessageSquare,
  Award,
  Brain
} from 'lucide-react';
import { CollaborationLayout } from '@/components/community/collaborations/collaboration-layout';

export default function Phase435Demo() {
  const [activeDemo, setActiveDemo] = React.useState('overview');
  const [collaborationView, setCollaborationView] = React.useState('board');

  const demoSections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Collaboration Board platform introduction',
      icon: Handshake
    },
    {
      id: 'project-board',
      title: 'Project Board',
      description: 'Browse and discover collaboration opportunities',
      icon: Briefcase
    },
    {
      id: 'create-project',
      title: 'Post Project',
      description: 'Project creation wizard',
      icon: Plus
    },
    {
      id: 'member-profiles',
      title: 'Find Collaborators',
      description: 'Browse member profiles and portfolios',
      icon: Users
    },
    {
      id: 'smart-matching',
      title: 'Smart Matching',
      description: 'AI-powered compatibility system',
      icon: Target
    },
    {
      id: 'project-management',
      title: 'Project Management',
      description: 'Team formation and collaboration tools',
      icon: Star
    }
  ];

  const platformFeatures = [
    {
      title: 'Project Postings',
      description: 'Comprehensive project posting system with detailed requirements and compensation',
      icon: Briefcase,
      highlights: [
        '6 collaboration types (Quick help to mentorship)',
        'Detailed skill requirements and timeline',
        'Multiple compensation models',
        'Urgency and deadline management'
      ]
    },
    {
      title: 'Smart Matching',
      description: 'AI-powered matching system with 8-factor compatibility scoring',
      icon: Brain,
      highlights: [
        'Skill alignment analysis',
        'Availability synchronization',
        'Work style compatibility',
        'Location and budget matching'
      ]
    },
    {
      title: 'Member Profiles',
      description: 'Rich member profiles with portfolios, skills, and collaboration history',
      icon: Users,
      highlights: [
        'Skill endorsements and levels',
        'Portfolio showcases',
        'Success rate tracking',
        'Real-time availability status'
      ]
    },
    {
      title: 'Project Management',
      description: 'Comprehensive tools for team formation and project execution',
      icon: Trophy,
      highlights: [
        'Task management with assignments',
        'Team communication tools',
        'Progress tracking and milestones',
        'File sharing and collaboration'
      ]
    }
  ];

  const collaborationStats = [
    { label: 'Total Projects', value: '127', color: 'text-blue-600', change: '+12 this week' },
    { label: 'Active Projects', value: '34', color: 'text-green-600', change: '85% success rate' },
    { label: 'Community Members', value: '856', color: 'text-purple-600', change: '+8 today' },
    { label: 'Avg Project Value', value: '$2,500', color: 'text-yellow-600', change: '+15% this month' },
    { label: 'Successful Matches', value: '93', color: 'text-pink-600', change: '87% completion' },
    { label: 'Smart Matches Today', value: '12', color: 'text-indigo-600', change: 'AI-powered' }
  ];

  const collaborationTypes = [
    {
      type: 'Quick Help',
      description: 'Get help with a specific task (<1 day)',
      duration: '<1 day',
      teamSize: '1-2',
      successRate: '85%',
      examples: ['Code review', 'Design feedback', 'Quick consultation']
    },
    {
      type: 'Short Project',
      description: 'Complete a project in a week',
      duration: '1 week',
      teamSize: '2-5',
      successRate: '70%',
      examples: ['Website landing page', 'Logo design', 'Content creation']
    },
    {
      type: 'Long Project',
      description: 'Major project over a month',
      duration: '1+ month',
      teamSize: '3-10',
      successRate: '60%',
      examples: ['Mobile app', 'Documentary', 'Business launch']
    },
    {
      type: 'Ongoing',
      description: 'Continuous collaboration',
      duration: 'Continuous',
      teamSize: '2-20',
      successRate: '50%',
      examples: ['Content series', 'Community management', 'Partnership']
    },
    {
      type: 'Mentorship',
      description: 'Long-term guidance and learning',
      duration: '3+ months',
      teamSize: '1-1',
      successRate: '75%',
      examples: ['Skill development', 'Career guidance', 'Business coaching']
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Handshake className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Collaboration Board
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Phase 4.3.5: Enable community members to connect for creative projects, business opportunities, 
              and mutual support through a comprehensive collaboration platform.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm px-4 py-2">
                Depo Kominoté
              </Badge>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-sm px-4 py-2">
                Project Collaboration
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collaborationStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Platform Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {platformFeatures.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-purple-600" />
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

      {/* Collaboration Types */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Collaboration Types</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collaborationTypes.map((collab) => (
            <Card key={collab.type} className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">{collab.type}</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {collab.successRate} success
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-4">{collab.description}</p>
                
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <div className="font-medium">{collab.duration}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Team Size:</span>
                    <div className="font-medium">{collab.teamSize} people</div>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-500 text-sm">Examples:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {collab.examples.map((example, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

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
            Explore the different components of the Collaboration Board platform. 
            Click on any section below to see it in action.
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

      {/* Success Stories */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Trophy className="h-5 w-5" />
            Success Stories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">93</div>
              <div className="text-sm text-gray-600">Projects Completed</div>
              <div className="text-xs text-green-600 mt-1">87% Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">$240K</div>
              <div className="text-sm text-gray-600">Total Project Value</div>
              <div className="text-xs text-blue-600 mt-1">Generated by Community</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">456</div>
              <div className="text-sm text-gray-600">Successful Matches</div>
              <div className="text-xs text-purple-600 mt-1">AI-Powered Matching</div>
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
                  'Collaboration Board with project discovery',
                  'Project Wizard (5-step creation process)',
                  'Member Profiles with portfolios and skills',
                  'Smart Matching with 8-factor compatibility',
                  'Project Management with team tools',
                  'Responsive Layout and Navigation'
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
                  '5 collaboration types with success tracking',
                  'Multi-criteria compatibility scoring',
                  'Real-time availability and status',
                  'Portfolio and work showcase',
                  'Team formation and communication',
                  'Mobile-responsive design'
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
      'project-board': 'board',
      'create-project': 'create',
      'member-profiles': 'members',
      'smart-matching': 'matching',
      'project-management': 'my-projects'
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
              </div>
              <Button variant="outline" onClick={() => setActiveDemo('overview')}>
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Overview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Content */}
        <CollaborationLayout
          initialView={viewMap[activeDemo] || 'board'}
          userRole="creator"
          isAuthenticated={true}
          currentUserId="demo-user"
          onNavigate={(view) => {
            // Map view back to demo section
            const reverseMap = {
              'board': 'project-board',
              'create': 'create-project',
              'members': 'member-profiles',
              'matching': 'smart-matching',
              'my-projects': 'project-management'
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
          <div className="flex items-center gap-4 mb-4">
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