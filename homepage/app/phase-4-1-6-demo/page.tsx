'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedVirtualGifts } from '@/components/live-monetization/enhanced-virtual-gifts';
import { RevenueModelsDashboard } from '@/components/live-monetization/revenue-models-dashboard';
import { PaymentIntegration } from '@/components/live-monetization/payment-integration';
import {
  DollarSign,
  Gift,
  Crown,
  Zap,
  Target,
  TrendingUp,
  Users,
  Star,
  Heart,
  Award,
  Sparkles,
  BarChart3,
  PieChart,
  CreditCard,
  Shield,
  ArrowRight,
  CheckCircle,
  Lock,
  Unlock,
  Activity,
  Coins,
  Percent,
  Calendar,
  Clock,
  Flag,
  Globe,
  RefreshCw,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Phase416Demo() {
  const [userBalance, setUserBalance] = useState(150.00);
  const [totalEarnings, setTotalEarnings] = useState(3650.25);
  const [giftsSent, setGiftsSent] = useState(0);
  const [totalProcessed, setTotalProcessed] = useState(15420.75);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [selectedDemo, setSelectedDemo] = useState('overview');

  // Mock goals data
  const mockGoals = [
    {
      id: '1',
      title: 'Reach $200 in Tips',
      description: 'Community goal for this stream',
      target: 200,
      current: 145,
      type: 'tips' as const,
      reward: 'Special Haitian music performance',
      isActive: true,
      isCompleted: false
    },
    {
      id: '2',
      title: '50 New Subscribers',
      description: 'Grow the community family',
      target: 50,
      current: 32,
      type: 'subscribers' as const,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true,
      isCompleted: false
    }
  ];

  // Mock incentives data
  const mockIncentives = [
    {
      id: '1',
      name: 'Happy Hour Tips',
      type: 'tip-matching' as const,
      description: 'Double tip impact for the next hour',
      multiplier: 2,
      isActive: true,
      duration: 60,
      requirements: 'Between 7-8 PM'
    },
    {
      id: '2',
      name: 'Cultural Gift Boost',
      type: 'gift-multiplier' as const,
      description: '3x animation effects for Haiti-themed gifts',
      multiplier: 3,
      isActive: false,
      duration: 30,
      requirements: 'Cultural gifts only'
    }
  ];

  const handleGiftSent = (gift: any, quantity: number, totalAmount: number) => {
    setUserBalance(prev => prev - totalAmount);
    setGiftsSent(prev => prev + quantity);
    
    const transaction = {
      id: `gift-${Date.now()}`,
      type: 'gift' as const,
      amount: totalAmount,
      currency: 'USD',
      paymentMethod: 'stripe-card',
      creatorRevenue: totalAmount * 0.7,
      platformFee: totalAmount * 0.3,
      processingFee: totalAmount * 0.029 + 0.30,
      timestamp: new Date(),
      status: 'completed' as const,
      description: `${gift.name} x${quantity}`,
      giftDetails: {
        giftId: gift.id,
        giftName: gift.name,
        quantity: quantity
      }
    };
    
    setRecentTransactions(prev => [transaction, ...prev]);
    setTotalProcessed(prev => prev + totalAmount);
  };

  const handlePaymentProcess = (action: any) => {
    setRecentTransactions(prev => [action, ...prev]);
    if (action.status === 'completed') {
      setTotalProcessed(prev => prev + action.amount);
      setTotalEarnings(prev => prev + action.creatorRevenue);
    }
  };

  const handleToggleRevenueModel = (method: string, enabled: boolean) => {
    console.log(`Toggle ${method}: ${enabled}`);
  };

  const handleCreateGoal = (goal: any) => {
    console.log('Create goal:', goal);
  };

  const handleToggleIncentive = (incentiveId: string, active: boolean) => {
    console.log(`Toggle incentive ${incentiveId}: ${active}`);
  };

  // Revenue models data from spec
  const revenueModelsData = [
    {
      method: 'Tips',
      viewerCost: '$1-500',
      creatorRevenue: '80%',
      platformFee: '20%',
      engagement: 'Direct support',
      description: 'Instant viewer donations',
      earnings: 1250.75,
      trend: 'up' as const,
      change: 12.5
    },
    {
      method: 'Virtual Gifts',
      viewerCost: '$0.99-99',
      creatorRevenue: '70%',
      platformFee: '30%',
      engagement: 'Fun interaction',
      description: 'Animated gifts with cultural themes',
      earnings: 875.50,
      trend: 'up' as const,
      change: 8.3
    },
    {
      method: 'Super Chat',
      viewerCost: '$2-100',
      creatorRevenue: '70%',
      platformFee: '30%',
      engagement: 'Highlighted message',
      description: 'Premium highlighted messages',
      earnings: 650.25,
      trend: 'stable' as const,
      change: 0
    },
    {
      method: 'Subscriptions',
      viewerCost: '$4.99/mo',
      creatorRevenue: '70%',
      platformFee: '30%',
      engagement: 'Ongoing support',
      description: 'Monthly recurring revenue',
      earnings: 498.00,
      trend: 'up' as const,
      change: 15.2
    },
    {
      method: 'Paid Access',
      viewerCost: '$5-50',
      creatorRevenue: '80%',
      platformFee: '20%',
      engagement: 'Exclusive streams',
      description: 'Premium content access',
      earnings: 320.00,
      trend: 'down' as const,
      change: -5.1
    },
    {
      method: 'Goals/Campaigns',
      viewerCost: 'Variable',
      creatorRevenue: '85%',
      platformFee: '15%',
      engagement: 'Community achievement',
      description: 'Crowdfunding community goals',
      earnings: 56.75,
      trend: 'up' as const,
      change: 25.0
    }
  ];

  const giftCategories = [
    {
      category: 'Basic Gifts',
      priceRange: '$0.99-4.99',
      description: 'Hearts, Roses, Stars, Flags with float/fall animations',
      examples: '❤️ 🌹 ⭐ 🏳️',
      color: 'blue'
    },
    {
      category: 'Premium Gifts',
      priceRange: '$5-24.99',
      description: 'Fireworks, Rainbow, Crown, Music with full screen effects',
      examples: '🎆 🌈 👑 🎵',
      color: 'purple'
    },
    {
      category: 'Mega Gifts',
      priceRange: '$25-99',
      description: 'Celebration, Golden Coins, Love Explosion with epic animations',
      examples: '🎉 🪙 💖 ✨',
      color: 'yellow'
    },
    {
      category: 'Cultural Gifts',
      priceRange: '$7.99-24.99',
      description: 'Haiti-specific: Hibiscus, Drums, Flag Wave, Carnival',
      examples: '🌺 🥁 🇭🇹 🎭',
      color: 'green'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.1.6: Monetization & Virtual Gifts
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Create multiple revenue streams that feel natural and rewarding for both creators and supporters 
          through comprehensive monetization tools, animated virtual gifts, and community engagement features.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            6 Revenue Models
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Virtual Gifts
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Payment Integration
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Goal Tracking
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Cultural Themes
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Incentive Systems
          </span>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">💰 Complete Monetization System Available</h2>
        <p className="mb-6 text-lg opacity-90">
          Experience comprehensive revenue models, animated virtual gifts with cultural themes, 
          secure payment processing, and community engagement tools designed for creator success
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/creator/streaming">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Creator Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/live/demo-stream">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Gift className="w-5 h-5 mr-2" />
              Live Gifts Demo
            </Button>
          </Link>
        </div>
      </div>

      {/* Revenue Models Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Models Specification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Method</th>
                  <th className="text-left p-3">Viewer Cost</th>
                  <th className="text-left p-3">Creator Revenue</th>
                  <th className="text-left p-3">Platform Fee</th>
                  <th className="text-left p-3">Engagement</th>
                  <th className="text-left p-3">Current Earnings</th>
                  <th className="text-left p-3">Trend</th>
                </tr>
              </thead>
              <tbody>
                {revenueModelsData.map((model, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{model.method}</div>
                      <div className="text-xs text-gray-500">{model.description}</div>
                    </td>
                    <td className="p-3">{model.viewerCost}</td>
                    <td className="p-3">
                      <Badge className="bg-green-100 text-green-700">
                        {model.creatorRevenue}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className="bg-gray-100 text-gray-700">
                        {model.platformFee}
                      </Badge>
                    </td>
                    <td className="p-3">{model.engagement}</td>
                    <td className="p-3 font-medium">{formatCurrency(model.earnings)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(model.trend)}
                        <span className={cn(
                          'text-xs',
                          model.trend === 'up' ? 'text-green-600' : 'text-gray-600'
                        )}>
                          {model.change > 0 ? '+' : ''}{model.change}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Virtual Gift Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Virtual Gift System Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftCategories.map((category, index) => (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-lg border-2',
                  category.color === 'blue' && 'border-blue-200 bg-blue-50',
                  category.color === 'purple' && 'border-purple-200 bg-purple-50',
                  category.color === 'yellow' && 'border-yellow-200 bg-yellow-50',
                  category.color === 'green' && 'border-green-200 bg-green-50'
                )}
              >
                <h3 className="font-semibold mb-2">{category.category}</h3>
                <div className="text-2xl mb-3">{category.examples}</div>
                <Badge className={cn(
                  'mb-3',
                  category.color === 'blue' && 'bg-blue-100 text-blue-700',
                  category.color === 'purple' && 'bg-purple-100 text-purple-700',
                  category.color === 'yellow' && 'bg-yellow-100 text-yellow-700',
                  category.color === 'green' && 'bg-green-100 text-green-700'
                )}>
                  {category.priceRange}
                </Badge>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo Tabs */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Interactive Monetization Demo</h2>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Coins className="w-3 h-3 mr-1" />
              Balance: {formatCurrency(userBalance)}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Star className="w-3 h-3 mr-1" />
              Gifts Sent: {giftsSent}
            </Badge>
          </div>
        </div>

        <Tabs value={selectedDemo} onValueChange={setSelectedDemo}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gifts">Virtual Gifts</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Models</TabsTrigger>
            <TabsTrigger value="payments">Payment Processing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 text-green-600" />
                    <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</div>
                    <p className="text-sm text-gray-600 mt-1">All monetization streams</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Gift className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                    <h3 className="text-lg font-semibold mb-2">Active Streams</h3>
                    <div className="text-2xl font-bold text-purple-600">6</div>
                    <p className="text-sm text-gray-600 mt-1">Revenue methods enabled</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <h3 className="text-lg font-semibold mb-2">Growth Rate</h3>
                    <div className="text-2xl font-bold text-blue-600">+24%</div>
                    <p className="text-sm text-gray-600 mt-1">Month over month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features Implemented</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>6 comprehensive revenue models with optimized fee structures</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Animated virtual gifts with Haiti-specific cultural themes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Secure payment processing with multiple methods</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Goal tracking and progress systems</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Incentive systems with multipliers and rewards</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Real-time revenue optimization and AI insights</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cultural Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Flag className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Haitian Cultural Gifts</span>
                        </div>
                        <p className="text-sm text-blue-600">
                          Hibiscus flowers, traditional drums, flag waves, and carnival celebrations
                        </p>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Multi-language Support</span>
                        </div>
                        <p className="text-sm text-green-600">
                          Gift names and descriptions in English and Haitian Creole
                        </p>
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">Cultural Significance</span>
                        </div>
                        <p className="text-sm text-purple-600">
                          Each cultural gift includes educational context about Haitian heritage
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gifts" className="mt-6">
            <EnhancedVirtualGifts
              onGiftSent={handleGiftSent}
              userBalance={userBalance}
            />
          </TabsContent>

          <TabsContent value="revenue" className="mt-6">
            <RevenueModelsDashboard
              totalEarnings={totalEarnings}
              goals={mockGoals}
              incentives={mockIncentives}
              onToggleRevenueModel={handleToggleRevenueModel}
              onCreateGoal={handleCreateGoal}
              onToggleIncentive={handleToggleIncentive}
            />
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <PaymentIntegration
              onPaymentProcess={handlePaymentProcess}
              recentTransactions={recentTransactions}
              totalProcessed={totalProcessed}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">6</div>
          <p className="text-gray-600 mt-1">Revenue Models</p>
          <div className="text-sm text-green-600 mt-2">Multiple income streams</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">20+</div>
          <p className="text-gray-600 mt-1">Virtual Gifts</p>
          <div className="text-sm text-purple-600 mt-2">Including cultural themes</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">98.5%</div>
          <p className="text-gray-600 mt-1">Payment Success</p>
          <div className="text-sm text-blue-600 mt-2">Reliable processing</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">85%</div>
          <p className="text-gray-600 mt-1">Creator Revenue</p>
          <div className="text-sm text-orange-600 mt-2">Best-in-class splits</div>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Revenue Optimization</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 6 monetization methods with optimized fee structures</li>
              <li>• Real-time revenue tracking and analytics</li>
              <li>• AI-powered earning optimization suggestions</li>
              <li>• Goal-based engagement and milestone tracking</li>
              <li>• Incentive systems with multipliers and bonuses</li>
              <li>• Peak hour optimization and scheduling</li>
              <li>• Revenue forecasting and trend analysis</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Virtual Gift System</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 4 gift categories from $0.99 to $99+ with animations</li>
              <li>• Haiti-specific cultural gifts with educational context</li>
              <li>• Advanced animation system with particle effects</li>
              <li>• Rarity tiers from common to legendary</li>
              <li>• Cultural significance and heritage celebration</li>
              <li>• Multi-language support (English/Creole)</li>
              <li>• Gift preview and animation testing</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Payment Integration</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Multiple payment methods (cards, wallets, crypto)</li>
              <li>• PCI-compliant secure payment processing</li>
              <li>• Real-time fee calculation and breakdown</li>
              <li>• 98.5% success rate with instant processing</li>
              <li>• Fraud protection and security monitoring</li>
              <li>• International payment support</li>
              <li>• Transaction history and reporting</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Community Engagement</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Goal tracking with progress visualization</li>
              <li>• Community achievement celebrations</li>
              <li>• Leaderboards and top supporter recognition</li>
              <li>• Special events and promotional campaigns</li>
              <li>• Loyalty rewards and subscriber benefits</li>
              <li>• Cultural celebration and holiday promotions</li>
              <li>• Thank you automation and appreciation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}