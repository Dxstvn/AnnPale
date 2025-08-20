'use client';

import * as React from 'react';
import { ContentBenefits } from '@/components/subscription/benefits/content-benefits';
import { AccessBenefits } from '@/components/subscription/benefits/access-benefits';
import { EconomicBenefits } from '@/components/subscription/benefits/economic-benefits';
import { StatusSurpriseBenefits } from '@/components/subscription/benefits/status-surprise-benefits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Video,
  Users,
  DollarSign,
  Trophy,
  Gift,
  Info,
  Settings,
  TrendingUp,
  Star,
  Crown,
  Shield,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function Phase455Demo() {
  const [userTier, setUserTier] = React.useState<'none' | 'bronze' | 'silver' | 'gold'>('silver');
  const [memberSince] = React.useState(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)); // 6 months ago
  const [totalSpent] = React.useState(450);

  // Calculate total benefit value
  const calculateTotalValue = () => {
    const tierValues = {
      none: { perceived: 0, actual: 0, retention: 0 },
      bronze: { perceived: 70, actual: 150, retention: 40 },
      silver: { perceived: 85, actual: 350, retention: 55 },
      gold: { perceived: 95, actual: 600, retention: 70 }
    };
    
    return tierValues[userTier];
  };

  const totalValue = calculateTotalValue();

  // Benefit categories for overview
  const benefitCategories = [
    {
      id: 'content',
      name: 'Content Benefits',
      icon: Video,
      description: 'Exclusive videos, early access, archives',
      count: 15,
      value: 200
    },
    {
      id: 'access',
      name: 'Access Benefits',
      icon: Users,
      description: 'Live streams, events, interactions',
      count: 12,
      value: 150
    },
    {
      id: 'economic',
      name: 'Economic Benefits',
      icon: DollarSign,
      description: 'Discounts, rewards, special offers',
      count: 10,
      value: 100
    },
    {
      id: 'status',
      name: 'Status & Recognition',
      icon: Trophy,
      description: 'Badges, privileges, influence',
      count: 8,
      value: 50
    },
    {
      id: 'surprise',
      name: 'Surprise Benefits',
      icon: Gift,
      description: 'Random rewards, mystery boxes',
      count: 6,
      value: 100
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Phase 4.5.5: Member Benefits & Perks</h1>
              <p className="text-gray-600">Comprehensive value stack for subscription tiers</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700">
            Phase 4.5.5
          </Badge>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Member Benefits System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                A comprehensive benefits system that creates compelling value propositions for each subscription 
                tier while maximizing member retention and satisfaction.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Value Stack Architecture:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Content Benefits - Exclusive access to premium content</li>
                    <li>• Access Benefits - Live events and creator interactions</li>
                    <li>• Economic Benefits - Discounts, rewards, and savings</li>
                    <li>• Status Benefits - Recognition and privileges</li>
                    <li>• Surprise Benefits - Random rewards and delights</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Benefit Value Perception:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Digital Content</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">ROI: 500%+</span>
                        <Badge className="bg-green-100 text-green-700 text-xs">+40% retention</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Direct Interaction</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">ROI: 300%</span>
                        <Badge className="bg-green-100 text-green-700 text-xs">+60% retention</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Surprise Delights</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">ROI: 400%</span>
                        <Badge className="bg-green-100 text-green-700 text-xs">+50% retention</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Demo Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Simulate Member Tier</label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={userTier === 'none' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUserTier('none')}
                  >
                    Non-Member
                  </Button>
                  <Button
                    variant={userTier === 'bronze' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUserTier('bronze')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Bronze
                  </Button>
                  <Button
                    variant={userTier === 'silver' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUserTier('silver')}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Silver
                  </Button>
                  <Button
                    variant={userTier === 'gold' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUserTier('gold')}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Gold
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Change tier to see how benefits change across different membership levels
                </p>
              </div>
              
              {userTier !== 'none' && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Total Benefit Value</h4>
                    <Badge variant="outline">
                      {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Tier
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">${totalValue.actual}</p>
                      <p className="text-xs text-gray-600">Monthly Value</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{totalValue.perceived}%</p>
                      <p className="text-xs text-gray-600">Perceived Value</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">+{totalValue.retention}%</p>
                      <p className="text-xs text-gray-600">Retention Impact</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Catalog */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Benefits Catalog Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {benefitCategories.map((category) => {
                const Icon = category.icon;
                
                return (
                  <div key={category.id} className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-sm mb-1">{category.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{category.count} benefits</p>
                    <Badge variant="secondary" className="text-xs">
                      ${category.value} value
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="content">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="content">
                  <Video className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="access">
                  <Users className="h-4 w-4 mr-2" />
                  Access
                </TabsTrigger>
                <TabsTrigger value="economic">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Economic
                </TabsTrigger>
                <TabsTrigger value="status">
                  <Trophy className="h-4 w-4 mr-2" />
                  Status
                </TabsTrigger>
                <TabsTrigger value="surprise">
                  <Gift className="h-4 w-4 mr-2" />
                  Surprise
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="content">
                  <ContentBenefits 
                    currentTier={userTier}
                    showValue={true}
                  />
                </TabsContent>

                <TabsContent value="access">
                  <AccessBenefits 
                    currentTier={userTier}
                    showUpcoming={true}
                  />
                </TabsContent>

                <TabsContent value="economic">
                  <EconomicBenefits 
                    currentTier={userTier}
                    totalSpent={totalSpent}
                    showCalculator={true}
                  />
                </TabsContent>

                <TabsContent value="status">
                  <StatusSurpriseBenefits 
                    currentTier={userTier}
                    memberSince={memberSince}
                    showProbabilities={false}
                  />
                </TabsContent>

                <TabsContent value="surprise">
                  <StatusSurpriseBenefits 
                    currentTier={userTier}
                    memberSince={memberSince}
                    showProbabilities={true}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Notes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Implementation Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Value Perception:</strong> Benefits are designed to maximize perceived value while 
                minimizing actual costs. Digital benefits have infinite ROI while providing high perceived value.
              </p>
              <p>
                <strong>Retention Impact:</strong> Different benefit types have varying impacts on retention. 
                Direct interaction and surprise delights have the highest retention impact at 60% and 50% respectively.
              </p>
              <p>
                <strong>Tier Progression:</strong> Benefits are structured to encourage tier upgrades by showing 
                locked benefits and providing clear value propositions for each tier level.
              </p>
              <p>
                <strong>Psychological Triggers:</strong> The system uses recognition, exclusivity, savings, and 
                surprise elements to create emotional connections and increase member satisfaction.
              </p>
              <p>
                <strong>Economic Sustainability:</strong> Most benefits have low or zero marginal cost while 
                providing high perceived value, ensuring sustainable creator economics.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}