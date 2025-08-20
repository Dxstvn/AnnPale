'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy,
  Star,
  Gift,
  Crown,
  Award,
  Coins,
  TrendingUp,
  Heart,
  Flame,
  Target,
  Zap,
  Calendar,
  Users,
  ChevronRight,
  Play,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Info,
  BarChart3,
  Shield,
  Clock,
  Rocket,
  Medal
} from 'lucide-react';
import { RecognitionLayout } from '@/components/community/rewards/recognition-layout';

export default function Phase437Demo() {
  const [activeDemo, setActiveDemo] = React.useState('overview');

  const demoSections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Community Rewards & Recognition platform introduction',
      icon: Trophy
    },
    {
      id: 'points',
      title: 'Points System',
      description: 'Earn and track points for activities',
      icon: Coins
    },
    {
      id: 'badges',
      title: 'Badge Collection',
      description: 'Unlock and showcase achievements',
      icon: Award
    },
    {
      id: 'levels',
      title: 'Member Levels',
      description: 'Progress through membership tiers',
      icon: Crown
    },
    {
      id: 'leaderboards',
      title: 'Leaderboards',
      description: 'Rankings and recognition',
      icon: BarChart3
    },
    {
      id: 'store',
      title: 'Rewards Store',
      description: 'Redeem points for rewards',
      icon: Gift
    }
  ];

  const platformFeatures = [
    {
      title: 'Points System',
      description: 'Comprehensive point earning and redemption system',
      icon: Coins,
      highlights: [
        'Daily login bonuses and streak multipliers',
        'Action-based point rewards',
        'Quality bonuses for contributions',
        'Special event multipliers',
        'Real-time point tracking'
      ]
    },
    {
      title: 'Badge Categories',
      description: 'Six categories of collectible achievements',
      icon: Award,
      highlights: [
        'Participation badges for engagement',
        'Expertise badges for knowledge',
        'Helpfulness badges for support',
        'Creativity badges for content',
        'Leadership badges for influence',
        'Special event limited editions'
      ]
    },
    {
      title: 'Member Levels',
      description: 'Progressive membership tiers with exclusive benefits',
      icon: Crown,
      highlights: [
        '6 levels from Newcomer to Legend',
        'Unlock exclusive benefits at each level',
        'Progressive discounts and perks',
        'VIP access to events and features',
        'Custom badges and recognition'
      ]
    },
    {
      title: 'Rewards Store',
      description: 'Redeem points for valuable rewards',
      icon: Gift,
      highlights: [
        'Digital goods and downloads',
        'Platform service discounts',
        'Exclusive access passes',
        'Physical merchandise',
        'Special experiences and events'
      ]
    }
  ];

  const recognitionStats = [
    { label: 'Total Members', value: '8,567', color: 'text-blue-600', description: 'Active participants' },
    { label: 'Points Distributed', value: '2.4M', color: 'text-purple-600', description: 'Total points earned' },
    { label: 'Badges Unlocked', value: '45,234', color: 'text-yellow-600', description: 'Achievements earned' },
    { label: 'Rewards Claimed', value: '3,456', color: 'text-green-600', description: 'Items redeemed' },
    { label: 'Daily Active', value: '1,234', color: 'text-orange-600', description: 'Members today' },
    { label: 'Avg Engagement', value: '87%', color: 'text-pink-600', description: 'Member activity' }
  ];

  const levelProgression = [
    {
      level: 'Newcomer',
      range: '0-100',
      benefits: ['Forum access', 'Basic badges', 'Daily rewards'],
      icon: Rocket,
      color: 'bg-gray-100 text-gray-600'
    },
    {
      level: 'Member',
      range: '101-500',
      benefits: ['5% discount', 'Priority support', 'Member events'],
      icon: Star,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      level: 'Contributor',
      range: '501-2000',
      benefits: ['10% discount', 'Early access', 'VIP events'],
      icon: Award,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      level: 'Expert',
      range: '2001-5000',
      benefits: ['15% discount', 'Beta testing', 'Direct connections'],
      icon: Shield,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      level: 'Leader',
      range: '5001-10000',
      benefits: ['20% discount', 'Council membership', 'Custom merch'],
      icon: Crown,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      level: 'Legend',
      range: '10000+',
      benefits: ['25% lifetime discount', 'Hall of Fame', 'VIP everything'],
      icon: Trophy,
      color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600'
    }
  ];

  const recognitionTypes = [
    {
      type: 'Daily Active',
      trigger: 'Login streak',
      visibility: 'Private',
      value: 'Points',
      impact: 'Retention'
    },
    {
      type: 'Top Contributor',
      trigger: 'Monthly activity',
      visibility: 'Public',
      value: 'Badge + prize',
      impact: 'Status'
    },
    {
      type: 'Helper Award',
      trigger: 'Answers provided',
      visibility: 'Public',
      value: 'Badge',
      impact: 'Reputation'
    },
    {
      type: 'Creative Star',
      trigger: 'Challenge wins',
      visibility: 'Featured',
      value: 'Showcase',
      impact: 'Fame'
    },
    {
      type: 'Community Choice',
      trigger: 'Peer votes',
      visibility: 'Homepage',
      value: 'Trophy',
      impact: 'Influence'
    }
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
              Community Rewards & Recognition
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Phase 4.3.7: Motivate participation and recognize valuable contributions 
              through meaningful rewards and comprehensive status systems.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm px-4 py-2">
                Rekonpans Kominoté
              </Badge>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-sm px-4 py-2">
                Gamification System
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recognitionStats.map((stat) => (
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
        <h2 className="text-2xl font-bold mb-6">Recognition Framework</h2>
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

      {/* Level Progression */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Member Level Progression</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {levelProgression.map((level) => {
            const Icon = level.icon;
            return (
              <Card key={level.level} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${level.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{level.level}</h3>
                  <Badge variant="outline" className="mb-3">{level.range} points</Badge>
                  <div className="space-y-1">
                    {level.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recognition Types */}
      <Card>
        <CardHeader>
          <CardTitle>Recognition Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Recognition</th>
                  <th className="text-left py-2">Trigger</th>
                  <th className="text-left py-2">Visibility</th>
                  <th className="text-left py-2">Value</th>
                  <th className="text-left py-2">Impact</th>
                </tr>
              </thead>
              <tbody>
                {recognitionTypes.map((type) => (
                  <tr key={type.type} className="border-b">
                    <td className="py-2 font-medium">{type.type}</td>
                    <td className="py-2 text-sm text-gray-600">{type.trigger}</td>
                    <td className="py-2">
                      <Badge variant="outline" className="text-xs">
                        {type.visibility}
                      </Badge>
                    </td>
                    <td className="py-2 text-sm">{type.value}</td>
                    <td className="py-2">
                      <Badge className="text-xs">
                        {type.impact}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            Explore the different components of the rewards and recognition system. 
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

      {/* Success Metrics */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <TrendingUp className="h-5 w-5" />
            System Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">68%</div>
              <div className="text-sm text-gray-600">Engagement Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">45%</div>
              <div className="text-sm text-gray-600">Retention Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">3.2x</div>
              <div className="text-sm text-gray-600">Activity Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">92%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
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
                  'Points System with multipliers',
                  'Badge System with 6 categories',
                  'Member Levels and progression',
                  'Recognition Leaderboards',
                  'Rewards Store with redemption',
                  'Recognition Layout and navigation'
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
                  'Comprehensive gamification system',
                  'Multi-tier recognition framework',
                  'Real-time progress tracking',
                  'Automated reward distribution',
                  'Social recognition features',
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
      'points': 'points',
      'badges': 'badges',
      'levels': 'levels',
      'leaderboards': 'leaderboards',
      'store': 'store'
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
        <RecognitionLayout
          initialView={viewMap[activeDemo] || 'dashboard'}
          userId="demo-user"
          isAuthenticated={true}
          onNavigate={(view) => {
            // Map view back to demo section
            const reverseMap = {
              'dashboard': 'overview',
              'points': 'points',
              'badges': 'badges',
              'levels': 'levels',
              'leaderboards': 'leaderboards',
              'store': 'store'
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