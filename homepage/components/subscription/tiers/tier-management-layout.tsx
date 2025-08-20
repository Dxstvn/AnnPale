'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown,
  Star,
  Shield,
  BarChart3,
  Settings,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Calculator,
  Package,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import { TierStructure } from './tier-structure';
import { TierComparisonTable } from './tier-comparison-table';
import { TierBenefitsVisualization } from './tier-benefits-visualization';
import { TierSelector } from './tier-selector';
import { PackagingOptimizer } from './packaging-optimizer';

interface TierManagementLayoutProps {
  userId?: string;
  currentTier?: string;
  isAdmin?: boolean;
  onTierSelect?: (tier: string) => void;
}

export function TierManagementLayout({
  userId,
  currentTier,
  isAdmin = false,
  onTierSelect
}: TierManagementLayoutProps) {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [selectedTier, setSelectedTier] = React.useState(currentTier || 'silver');

  // Tier statistics
  const tierStats = [
    {
      label: 'Bronze Members',
      value: '3,456',
      percentage: 35,
      change: '+12%',
      icon: Shield,
      color: 'text-orange-600'
    },
    {
      label: 'Silver Members',
      value: '5,123',
      percentage: 52,
      change: '+18%',
      icon: Star,
      color: 'text-gray-600'
    },
    {
      label: 'Gold Members',
      value: '1,287',
      percentage: 13,
      change: '+25%',
      icon: Crown,
      color: 'text-yellow-600'
    },
    {
      label: 'Total Revenue',
      value: '$287,450',
      percentage: 100,
      change: '+22%',
      icon: DollarSign,
      color: 'text-green-600'
    }
  ];

  // Tab configurations
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Package,
      description: 'Tier structure and pricing'
    },
    {
      id: 'comparison',
      label: 'Comparison',
      icon: BarChart3,
      description: 'Feature comparison table'
    },
    {
      id: 'visualization',
      label: 'Visualization',
      icon: Eye,
      description: 'Benefits visualization'
    },
    {
      id: 'selector',
      label: 'Selector',
      icon: Zap,
      description: 'Interactive tier selection'
    },
    {
      id: 'optimizer',
      label: 'Optimizer',
      icon: Calculator,
      description: 'Packaging optimization'
    }
  ];

  const handleTierSelect = (tier: string) => {
    setSelectedTier(tier);
    onTierSelect?.(tier);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Subscription Tiers & Packaging</h1>
          <p className="text-gray-600">
            Manage and optimize your three-tier subscription structure
          </p>
        </div>
        {isAdmin && (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Admin View
          </Badge>
        )}
      </div>

      {/* Current Tier Display */}
      {currentTier && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Your Current Tier</p>
                <div className="flex items-center gap-3">
                  {currentTier === 'bronze' && <Shield className="h-8 w-8 text-orange-600" />}
                  {currentTier === 'silver' && <Star className="h-8 w-8 text-gray-600" />}
                  {currentTier === 'gold' && <Crown className="h-8 w-8 text-yellow-600" />}
                  <div>
                    <h3 className="text-2xl font-bold capitalize">{currentTier}</h3>
                    <p className="text-sm text-gray-600">
                      {currentTier === 'bronze' && '$9.99/month'}
                      {currentTier === 'silver' && '$24.99/month'}
                      {currentTier === 'gold' && '$49.99/month'}
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline">
                Manage Subscription
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tier Statistics */}
      {isAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tierStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-xs text-green-600">{stat.change}</div>
                        {stat.percentage < 100 && (
                          <Badge variant="secondary" className="text-xs">
                            {stat.percentage}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color} opacity-20`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Psychology Score Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tier Packaging Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-purple-600">85/100</div>
              <p className="text-sm text-gray-600 mt-1">
                Overall tier optimization score
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Value Ladder</span>
                <Badge className="bg-green-100 text-green-700">Optimized</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Price Anchoring</span>
                <Badge className="bg-blue-100 text-blue-700">Strong</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Feature Distribution</span>
                <Badge className="bg-yellow-100 text-yellow-700">Good</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tier Management</CardTitle>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                Three-tier Bronze/Silver/Gold structure
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <TierStructure
                currentTier={currentTier}
                onTierSelect={handleTierSelect}
                showComparison={true}
                showPsychology={true}
                highlightedTier="silver"
              />
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <TierComparisonTable
                highlightDifferences={true}
                showPsychologyInsights={true}
                compactMode={false}
              />
            </TabsContent>

            <TabsContent value="visualization" className="mt-6">
              <TierBenefitsVisualization
                selectedTier={selectedTier}
                onTierSelect={handleTierSelect}
                showValueAnalysis={true}
                showUpgradePaths={true}
              />
            </TabsContent>

            <TabsContent value="selector" className="mt-6">
              <TierSelector
                currentTier={currentTier}
                onTierSelect={handleTierSelect}
                showRecommendation={true}
                showPsychologyFactors={true}
              />
            </TabsContent>

            <TabsContent value="optimizer" className="mt-6">
              <PackagingOptimizer
                showAnalytics={true}
                showRecommendations={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Edit Tier Benefits
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-between">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Analytics
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Member Distribution
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}