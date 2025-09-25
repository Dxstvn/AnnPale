'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  Crown, Shield, Star, Check, X, CreditCard, Calendar, 
  TrendingUp, Users, Video, Gift, Zap, Clock, Bell,
  ChevronRight, Info, AlertCircle, ArrowRight, Sparkles,
  DollarSign, Tv, MessageSquare, Heart, Trophy, Flame,
  Search, Filter, MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { 
  FanSubscription, 
  CreatorSubscriptionTier,
  SubscriptionTierType 
} from '@/lib/types/livestream'

export default function FanSubscriptionsPage() {
  const t = useTranslations()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('active')
  const [subscriptions, setSubscriptions] = useState<FanSubscription[]>([])
  const [recommendedCreators, setRecommendedCreators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscriptions()
    loadRecommendedCreators()
  }, [])

  const loadSubscriptions = async () => {
    try {
      // First try to fetch real subscriptions from API
      const response = await fetch('/api/subscriptions/list')
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.subscriptions && data.subscriptions.length > 0) {
          // Transform the real data to match the FanSubscription interface
          const transformedSubscriptions = data.subscriptions.map((sub: any) => ({
            id: sub.id,
            fan_id: sub.subscriber_id,
            creator_id: sub.creator.id,
            tier_id: sub.tier.id,
            status: sub.is_expired ? 'expired' as const : sub.status,
            start_date: sub.started_at,
            next_billing_date: sub.expires_at,
            end_date: sub.cancelled_at,
            auto_renew: sub.status === 'active' && !sub.cancelled_at,
            created_at: sub.started_at,
            updated_at: sub.started_at,
            tier: {
              id: sub.tier.id,
              creator_id: sub.creator.id,
              tier_name: sub.tier.name,
              tier_type: 'basic' as const,
              price: sub.tier.price,
              billing_period: 'monthly' as const,
              benefits: sub.tier.benefits || [],
              ad_free: true,
              exclusive_content: true,
              priority_chat: false,
              vod_access: true,
              max_quality: '1080p',
              is_active: true,
              created_at: sub.started_at,
              updated_at: sub.started_at
            },
            creator: {
              id: sub.creator.id,
              name: sub.creator.name,
              avatar_url: sub.creator.avatar_url || '/placeholder.svg'
            }
          }))
          
          setSubscriptions(transformedSubscriptions)
          return
        }
      }
      
      // If no real data or API fails, show mock subscriptions
      const mockSubscriptions: FanSubscription[] = [
      {
        id: 'sub-001',
        fan_id: 'user-123',
        creator_id: 'creator-001',
        tier_id: 'tier-001',
        status: 'active',
        start_date: '2024-01-01',
        next_billing_date: '2024-02-01',
        auto_renew: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        tier: {
          id: 'tier-001',
          creator_id: 'creator-001',
          tier_name: 'Premium',
          tier_type: 'premium',
          price: 9.99,
          billing_period: 'monthly',
          benefits: [
            'Ad-free viewing',
            'HD streaming up to 1080p',
            'Priority chat',
            'Exclusive emotes',
            'VOD access',
            'Monthly Q&A sessions'
          ],
          ad_free: true,
          exclusive_content: true,
          priority_chat: true,
          vod_access: true,
          max_quality: '1080p',
          is_active: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        },
        creator: {
          id: 'creator-001',
          name: 'Marie-Claire Laurent',
          avatar_url: '/api/placeholder/100/100'
        }
      },
      {
        id: 'sub-002',
        fan_id: 'user-123',
        creator_id: 'creator-003',
        tier_id: 'tier-002',
        status: 'active',
        start_date: '2024-01-05',
        next_billing_date: '2024-02-05',
        auto_renew: true,
        created_at: '2024-01-05',
        updated_at: '2024-01-05',
        tier: {
          id: 'tier-002',
          creator_id: 'creator-003',
          tier_name: 'Basic',
          tier_type: 'basic',
          price: 4.99,
          billing_period: 'monthly',
          benefits: [
            'Support the creator',
            'Member badge in chat',
            'Access to member-only streams',
            'VOD access (7 days)'
          ],
          ad_free: false,
          exclusive_content: false,
          priority_chat: false,
          vod_access: true,
          max_quality: '720p',
          is_active: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        },
        creator: {
          id: 'creator-003',
          name: 'Sophie Duval',
          avatar_url: '/api/placeholder/100/100'
        }
      },
      {
        id: 'sub-003',
        fan_id: 'user-123',
        creator_id: 'creator-004',
        tier_id: 'tier-003',
        status: 'cancelled',
        start_date: '2023-11-01',
        end_date: '2023-12-31',
        auto_renew: false,
        created_at: '2023-11-01',
        updated_at: '2023-12-31',
        tier: {
          id: 'tier-003',
          creator_id: 'creator-004',
          tier_name: 'VIP',
          tier_type: 'vip',
          price: 19.99,
          billing_period: 'monthly',
          benefits: [
            'Everything in Premium',
            '4K streaming',
            'Direct messaging with creator',
            'Early access to new content',
            'Monthly virtual meet & greet'
          ],
          ad_free: true,
          exclusive_content: true,
          priority_chat: true,
          vod_access: true,
          max_quality: '4K',
          is_active: true,
          created_at: '2023-11-01',
          updated_at: '2023-11-01'
        },
        creator: {
          id: 'creator-004',
          name: 'Marcus Thompson',
          avatar_url: '/api/placeholder/100/100'
        }
      }
    ]

      setSubscriptions(mockSubscriptions)
    } catch (error) {
      console.error('Error loading subscriptions:', error)
      toast.error('Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const loadRecommendedCreators = async () => {
    try {
      const supabase = createClient()
      
      // Fetch creators with subscription tiers from the database
      const { data: creators, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          avatar_url,
          bio,
          creator_subscription_tiers (
            price,
            is_active
          )
        `)
        .eq('role', 'creator')
        .limit(3)
      
      if (error) {
        console.error('Error fetching creators:', error)
        return
      }
      
      // Process creators data
      const processedCreators = creators?.map(creator => {
        const activeTiers = creator.creator_subscription_tiers?.filter((t: any) => t.is_active) || []
        const lowestPrice = activeTiers.length > 0 
          ? Math.min(...activeTiers.map((t: any) => t.price))
          : 9.99
        
        return {
          id: creator.id,
          name: creator.name,
          avatar_url: creator.avatar_url || '/placeholder.svg',
          category: 'Creator', // Default category
          subscribers: Math.floor(Math.random() * 20000) + 1000, // Mock subscriber count
          liveNow: Math.random() > 0.7, // Random live status for demo
          lowestTierPrice: lowestPrice
        }
      }) || []
      
      setRecommendedCreators(processedCreators)
    } catch (error) {
      console.error('Error loading recommended creators:', error)
    }
  }

  const getTierIcon = (tierType: SubscriptionTierType) => {
    switch (tierType) {
      case 'vip':
        return Crown
      case 'premium':
        return Shield
      case 'basic':
      default:
        return Star
    }
  }

  const getTierColor = (tierType: SubscriptionTierType) => {
    switch (tierType) {
      case 'vip':
        return 'from-yellow-500 to-amber-600'
      case 'premium':
        return 'from-purple-600 to-indigo-600'
      case 'basic':
      default:
        return 'from-blue-500 to-cyan-600'
    }
  }

  const handleManageSubscription = (subscription: FanSubscription) => {
    router.push(`/fan/subscriptions/${subscription.id}/manage`)
  }

  const handleSubscribe = (creatorId: string) => {
    router.push(`/creator/${creatorId}/subscribe`)
  }

  const handleCancelSubscription = async (subscriptionId: string) => {
    // In production, call API to cancel subscription
    toast.success('Subscription will be cancelled at the end of the billing period')
    
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, auto_renew: false, status: 'cancelled' as const }
          : sub
      )
    )
  }

  const handleReactivateSubscription = async (subscriptionId: string) => {
    // In production, call API to reactivate subscription
    toast.success('Subscription reactivated successfully')
    
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, auto_renew: true, status: 'active' as const }
          : sub
      )
    )
  }

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
  const cancelledSubscriptions = subscriptions.filter(s => s.status === 'cancelled' || s.status === 'expired')
  const totalMonthlySpend = activeSubscriptions.reduce((sum, sub) => sum + (sub.tier?.price || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
          <p>Loading subscriptions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Sparkles className="h-8 w-8" />
                My Subscriptions
              </h1>
              <p className="mt-2 text-purple-100">
                Manage your creator subscriptions and membership benefits
              </p>
            </div>
            
            {/* Summary Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{activeSubscriptions.length}</p>
                <p className="text-sm text-purple-100">Active</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">${totalMonthlySpend.toFixed(2)}</p>
                <p className="text-sm text-purple-100">Per Month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-purple-200 hover:border-purple-400 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Trophy className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Loyalty Rewards</p>
                    <p className="text-sm text-gray-600">2 rewards available</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Savings This Month</p>
                    <p className="text-sm text-gray-600">$12.50 on ad-free viewing</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Flame className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Streak</p>
                    <p className="text-sm text-gray-600">3 months continuous</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Active ({activeSubscriptions.length})
            </TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Expired ({cancelledSubscriptions.length})
            </TabsTrigger>
            <TabsTrigger value="recommended" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Recommended
            </TabsTrigger>
          </TabsList>

          {/* Active Subscriptions */}
          <TabsContent value="active" className="mt-6">
            {activeSubscriptions.length > 0 ? (
              <div className="space-y-4">
                {activeSubscriptions.map((subscription) => {
                  const TierIcon = getTierIcon(subscription.tier?.tier_type || 'basic')
                  const tierColor = getTierColor(subscription.tier?.tier_type || 'basic')
                  
                  return (
                    <Card key={subscription.id} className="overflow-hidden">
                      <div className={cn(
                        "h-2 bg-gradient-to-r",
                        tierColor
                      )} />
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 border-2 border-purple-200">
                              <AvatarImage src={subscription.creator?.avatar_url} />
                              <AvatarFallback>{subscription.creator?.name[0]}</AvatarFallback>
                            </Avatar>
                            
                            <div className="space-y-2">
                              <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                  {subscription.creator?.name}
                                  <Badge className={cn(
                                    "bg-gradient-to-r text-white",
                                    tierColor
                                  )}>
                                    <TierIcon className="h-3 w-3 mr-1" />
                                    {subscription.tier?.tier_name}
                                  </Badge>
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Member since {new Date(subscription.start_date).toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4 text-gray-400" />
                                  ${subscription.tier?.price}/{subscription.tier?.billing_period}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  Next bill: {subscription.next_billing_date && 
                                    new Date(subscription.next_billing_date).toLocaleDateString()
                                  }
                                </span>
                                {subscription.auto_renew && (
                                  <Badge className="bg-green-100 text-green-700">
                                    <Check className="h-3 w-3 mr-1" />
                                    Auto-renew
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Benefits */}
                              <div className="pt-2">
                                <p className="text-sm font-medium mb-2">Your Benefits:</p>
                                <div className="flex flex-wrap gap-2">
                                  {subscription.tier?.ad_free && (
                                    <Badge variant="outline" className="text-xs">
                                      <Tv className="h-3 w-3 mr-1" />
                                      Ad-free
                                    </Badge>
                                  )}
                                  {subscription.tier?.priority_chat && (
                                    <Badge variant="outline" className="text-xs">
                                      <MessageSquare className="h-3 w-3 mr-1" />
                                      Priority Chat
                                    </Badge>
                                  )}
                                  {subscription.tier?.exclusive_content && (
                                    <Badge variant="outline" className="text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      Exclusive Content
                                    </Badge>
                                  )}
                                  {subscription.tier?.vod_access && (
                                    <Badge variant="outline" className="text-xs">
                                      <Video className="h-3 w-3 mr-1" />
                                      VOD Access
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {subscription.tier?.max_quality} Quality
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleManageSubscription(subscription)}
                            >
                              Manage
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/creator/${subscription.creator_id}`)}
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Subscriptions</h3>
                  <p className="text-gray-600 mb-4">
                    Subscribe to your favorite creators to support them and unlock exclusive benefits
                  </p>
                  <Button 
                    onClick={() => setActiveTab('recommended')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Discover Creators
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Expired Subscriptions */}
          <TabsContent value="expired" className="mt-6">
            {cancelledSubscriptions.length > 0 ? (
              <div className="space-y-4">
                {cancelledSubscriptions.map((subscription) => (
                  <Card key={subscription.id} className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 grayscale">
                            <AvatarImage src={subscription.creator?.avatar_url} />
                            <AvatarFallback>{subscription.creator?.name[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h3 className="font-semibold">{subscription.creator?.name}</h3>
                            <p className="text-sm text-gray-600">
                              Cancelled on {subscription.end_date && 
                                new Date(subscription.end_date).toLocaleDateString()
                              }
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          onClick={() => handleReactivateSubscription(subscription.id)}
                        >
                          Reactivate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-600">No cancelled subscriptions</p>
              </Card>
            )}
          </TabsContent>

          {/* Recommended */}
          <TabsContent value="recommended" className="mt-6">
            <div className="space-y-6">
              <Alert className="bg-purple-50 border-purple-200">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Recommended for You</AlertTitle>
                <AlertDescription>
                  Based on your viewing history and preferences
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedCreators.map((creator) => (
                  <Card key={creator.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <Avatar className="h-20 w-20 mx-auto">
                          <AvatarImage src={creator.avatar_url} />
                          <AvatarFallback>{creator.name[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-semibold">{creator.name}</h3>
                          <p className="text-sm text-gray-600">{creator.category}</p>
                        </div>
                        
                        <div className="flex items-center justify-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            {creator.subscribers.toLocaleString()}
                          </span>
                          {creator.liveNow && (
                            <Badge className="bg-red-600 text-white animate-pulse">
                              LIVE
                            </Badge>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Starting at ${creator.lowestTierPrice}/mo
                          </p>
                          <Button 
                            className="w-full"
                            onClick={() => handleSubscribe(creator.id)}
                          >
                            Subscribe
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/creators')}
                  className="mt-4"
                >
                  Browse All Creators
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}