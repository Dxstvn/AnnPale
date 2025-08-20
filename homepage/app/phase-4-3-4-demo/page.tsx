'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy,
  Users,
  Plus,
  Star,
  Crown,
  Target,
  Gift,
  Zap,
  Calendar,
  ArrowRight,
  CheckCircle,
  Play,
  Sparkles
} from 'lucide-react';
import { ChallengeLayout } from '@/components/community/challenges/challenge-layout';

export default function Phase434Demo() {
  const [activeDemo, setActiveDemo] = React.useState('overview');
  const [challengeView, setChallengeView] = React.useState('hub');

  const demoSections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Creator Challenges Platform introduction',
      icon: Star
    },
    {
      id: 'challenge-hub',
      title: 'Challenge Hub',
      description: 'Discover and browse active challenges',
      icon: Trophy
    },
    {
      id: 'create-challenge',
      title: 'Create Challenge',
      description: 'Challenge creation wizard',
      icon: Plus
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      description: 'Community rankings and gamification',
      icon: Crown
    },
    {
      id: 'submissions',
      title: 'Submissions',
      description: 'Submission gallery and voting system',
      icon: Users
    }
  ];

  const platformFeatures = [
    {
      title: 'Challenge Types',
      description: 'Creative, skill-based, knowledge, physical, social, and charitable challenges',
      icon: Target,
      highlights: ['6 distinct challenge categories', 'Customizable difficulty levels', 'Flexible submission formats']
    },
    {
      title: 'Gamification System',
      description: 'Points, badges, levels, and seasonal rankings to drive engagement',
      icon: Zap,
      highlights: ['Level progression system', 'Achievement badges', 'Streak tracking', 'Seasonal competitions']
    },
    {
      title: 'Voting & Judging',
      description: 'Multi-criteria voting system with community and expert judging',
      icon: Star,
      highlights: ['Multiple judging criteria', 'Weighted voting system', 'Community participation', 'Expert judge integration']
    },
    {
      title: 'Creator Tools',
      description: 'Comprehensive tools for challenge creation and management',
      icon: Gift,
      highlights: ['Step-by-step wizard', 'Prize configuration', 'Timeline management', 'Rules and guidelines']
    }
  ];

  const challengeStats = [
    { label: 'Total Challenges', value: '47', color: 'text-blue-600' },
    { label: 'Active Challenges', value: '12', color: 'text-green-600' },
    { label: 'Community Members', value: '2,341', color: 'text-purple-600' },
    { label: 'Total Prizes', value: '$15,000', color: 'text-yellow-600' },
    { label: 'Submissions Today', value: '23', color: 'text-pink-600' },
    { label: 'Active Voting', value: '8', color: 'text-indigo-600' }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Creator Challenges Platform
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Phase 4.3.4: Drive community engagement through creator-initiated challenges with gamification, 
              submissions galleries, voting systems, and leaderboards.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm px-4 py-2">
                Kominote Kreyatè
              </Badge>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-sm px-4 py-2">
                Community Engagement
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        {challengeStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
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
            Explore the different components of the Creator Challenges Platform. 
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
                  'Challenge Hub with filtering and discovery',
                  'Challenge Creation Wizard (5-step process)',
                  'Submission Gallery with voting system', 
                  'Leaderboard with gamification',
                  'Challenge Participation Flow',
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
                  'Multi-step challenge creation',
                  '6 challenge types with customization',
                  'Points, badges, and level system',
                  'Multi-criteria voting interface',
                  'Real-time engagement tracking',
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
      'challenge-hub': 'hub',
      'create-challenge': 'create',
      'leaderboard': 'leaderboard',
      'submissions': 'submissions'
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
        <ChallengeLayout
          initialView={viewMap[activeDemo] || 'hub'}
          userRole="creator"
          isAuthenticated={true}
          currentUserId="demo-user"
          onNavigate={(view) => {
            // Map view back to demo section
            const reverseMap = {
              'hub': 'challenge-hub',
              'create': 'create-challenge', 
              'leaderboard': 'leaderboard',
              'submissions': 'submissions'
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