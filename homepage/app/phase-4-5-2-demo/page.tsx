'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package,
  Crown,
  Star,
  Shield,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  Zap,
  Gift,
  BarChart3,
  CheckCircle,
  Info,
  Play,
  Calculator,
  Lightbulb,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { TierManagementLayout } from '@/components/subscription/tiers/tier-management-layout';

export default function Phase452Demo() {
  const [activeDemo, setActiveDemo] = React.useState('overview');

  const demoSections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Subscription tiers introduction',
      icon: Package
    },
    {
      id: 'live',
      title: 'Live Demo',
      description: 'Interactive tier management',
      icon: Play
    }
  ];

  const tierStructure = [
    {
      tier: 'Bronze',
      price: '$9.99/month',
      target: 'Casual fans',
      features: 5,
      psychology: 'Entry point',
      icon: Shield,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      tier: 'Silver',
      price: '$24.99/month',
      target: 'Regular fans',
      features: 17,
      psychology: 'Sweet spot',
      icon: Star,
      color: 'text-gray-600 bg-gray-100'
    },
    {
      tier: 'Gold',
      price: '$49.99/month',
      target: 'Super fans',
      features: 34,
      psychology: 'Premium status',
      icon: Crown,
      color: 'text-yellow-600 bg-yellow-100'
    }
  ];

  const keyFeatures = [
    {
      category: 'Content',
      bronze: '1 video/month',
      silver: '4 videos/month',
      gold: '30 videos/month',
      psychology: 'Volume value'
    },
    {
      category: 'Access',
      bronze: '24h early',
      silver: '48h early + Live',
      gold: '72h early + VIP',
      psychology: 'Exclusivity'
    },
    {
      category: 'Interaction',
      bronze: 'None',
      silver: '5 DMs/month',
      gold: 'Unlimited + Calls',
      psychology: 'Connection'
    },
    {
      category: 'Perks',
      bronze: '10% discount',
      silver: '20% discount',
      gold: '30% + Gifts',
      psychology: 'Economic benefit'
    },
    {
      category: 'Status',
      bronze: 'Bronze badge',
      silver: 'Silver badge',
      gold: 'Gold VIP badge',
      psychology: 'Social signal'
    }
  ];

  const psychologyPrinciples = [
    {
      principle: 'Anchoring',
      description: 'Gold tier sets high reference point',
      implementation: 'Show premium tier first',
      icon: Target,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      principle: 'Decoy Effect',
      description: 'Bronze makes Silver attractive',
      implementation: '3-tier structure',
      icon: Zap,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      principle: 'Social Proof',
      description: 'Most popular badge on Silver',
      implementation: 'Highlight selection',
      icon: Users,
      color: 'text-green-600 bg-green-100'
    },
    {
      principle: 'Loss Aversion',
      description: 'Feature comparison shows gaps',
      implementation: 'Visual comparison',
      icon: BarChart3,
      color: 'text-red-600 bg-red-100'
    },
    {
      principle: 'Endowment',
      description: 'Try higher tier features',
      implementation: 'Upgrade prompts',
      icon: Gift,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      principle: 'Commitment',
      description: 'Annual plans lock in value',
      implementation: 'Discount for commitment',
      icon: Shield,
      color: 'text-pink-600 bg-pink-100'
    }
  ];

  const implementedComponents = [
    'Tier structure with Bronze/Silver/Gold levels',
    'Comprehensive feature comparison table',
    'Interactive benefits visualization',
    'Intelligent tier selector with quiz',
    'Packaging optimizer with A/B testing',
    'Unified tier management dashboard'
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Subscription Tiers & Packaging
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Phase 4.5.2: Three-tier subscription model optimized for conversion 
              through psychological pricing and value perception.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm px-4 py-2">
                Nivo Abònman
              </Badge>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-sm px-4 py-2">
                Bronze • Silver • Gold
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Structure */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Three-Tier Structure</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tierStructure.map((tier) => {
            const Icon = tier.icon;
            return (
              <Card key={tier.tier} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tier.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {tier.tier}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-3xl font-bold">{tier.price}</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Target</span>
                        <span className="font-medium">{tier.target}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Features</span>
                        <span className="font-medium">{tier.features}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Psychology</span>
                        <span className="font-medium">{tier.psychology}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Key Feature Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Category</th>
                  <th className="text-center py-2">Bronze</th>
                  <th className="text-center py-2">Silver</th>
                  <th className="text-center py-2">Gold</th>
                  <th className="text-left py-2">Psychology</th>
                </tr>
              </thead>
              <tbody>
                {keyFeatures.map((feature) => (
                  <tr key={feature.category} className="border-b">
                    <td className="py-2 font-medium">{feature.category}</td>
                    <td className="py-2 text-center text-sm">{feature.bronze}</td>
                    <td className="py-2 text-center text-sm">{feature.silver}</td>
                    <td className="py-2 text-center text-sm">{feature.gold}</td>
                    <td className="py-2 text-sm text-gray-600">{feature.psychology}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Psychology Principles */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Pricing Psychology Principles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {psychologyPrinciples.map((principle) => {
            const Icon = principle.icon;
            return (
              <Card key={principle.principle} className="hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${principle.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{principle.principle}</h3>
                      <p className="text-xs text-gray-600 mb-2">{principle.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {principle.implementation}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Value Perception */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Value Perception Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Bronze</h3>
              <div className="space-y-2 text-sm">
                <div>Value Index: 100</div>
                <div>Price/Feature: $2.00</div>
                <div>Conversion: 35%</div>
              </div>
            </div>
            <div>
              <Star className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Silver</h3>
              <div className="space-y-2 text-sm">
                <div>Value Index: 250</div>
                <div>Price/Feature: $1.47</div>
                <div>Conversion: 52%</div>
              </div>
              <Badge className="mt-2 bg-purple-100 text-purple-700">Best Value</Badge>
            </div>
            <div>
              <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Gold</h3>
              <div className="space-y-2 text-sm">
                <div>Value Index: 500</div>
                <div>Price/Feature: $1.47</div>
                <div>Conversion: 13%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Interactive Tier Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Explore the complete tier management system with comparison tables, 
            visualization tools, intelligent selector, and packaging optimizer.
          </p>
          <Button
            size="lg"
            className="w-full"
            onClick={() => setActiveDemo('live')}
          >
            Launch Tier Management Dashboard
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Implementation Complete */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Implementation Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Completed Components:</h4>
              <div className="space-y-2">
                {implementedComponents.map((item, index) => (
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
                  'Three-tier Bronze/Silver/Gold structure',
                  '17 feature categories across tiers',
                  'Psychology-based pricing strategy',
                  'Interactive tier recommendation quiz',
                  'A/B testing scenarios for optimization',
                  'Real-time packaging analytics'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
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

  const renderLiveDemo = () => (
    <div className="space-y-4">
      {/* Demo Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Tier Management Dashboard</h2>
              <p className="text-gray-600">Manage and optimize subscription tiers</p>
            </div>
            <Button variant="outline" onClick={() => setActiveDemo('overview')}>
              Back to Overview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tier Management */}
      <TierManagementLayout
        userId="demo-user"
        currentTier="silver"
        isAdmin={true}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {demoSections.map((section) => (
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
        {activeDemo === 'overview' ? renderOverview() : renderLiveDemo()}
      </div>
    </div>
  );
}