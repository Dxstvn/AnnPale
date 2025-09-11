'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Check, Crown, Star, Zap, Shield, Users } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface SubscriptionTier {
  id: string
  tier_name: string
  tier_type?: string
  description: string
  price: number
  billing_period: 'monthly' | 'yearly'
  benefits: string[]
  features?: any
  ad_free?: boolean
  exclusive_content?: boolean
  priority_chat?: boolean
  vod_access?: boolean
  max_quality?: string
}

interface CreatorSubscriptionTiersProps {
  creatorId: string
  creatorName?: string
  currentTierId?: string
  onSubscribe?: (tierId: string) => void
  className?: string
}

export function CreatorSubscriptionTiers({
  creatorId,
  creatorName = 'this creator',
  currentTierId,
  onSubscribe,
  className
}: CreatorSubscriptionTiersProps) {
  const { toast } = useToast()
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)

  useEffect(() => {
    loadTiers()
  }, [creatorId])

  const loadTiers = async () => {
    try {
      const response = await fetch(`/api/public/creator/${creatorId}/tiers`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch tiers')
      }

      const data = await response.json()
      setTiers(data.tiers || [])
    } catch (error) {
      console.error('Error loading tiers:', error)
      toast({
        title: 'Error',
        description: 'Failed to load subscription tiers',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (tierId: string) => {
    setSubscribing(tierId)
    
    if (onSubscribe) {
      onSubscribe(tierId)
    } else {
      // Default behavior - redirect to checkout
      window.location.href = `/checkout?tier=${tierId}&creator=${creatorId}`
    }
    
    setSubscribing(null)
  }

  const getTierIcon = (tierType?: string, index?: number) => {
    if (tierType === 'vip') return <Crown className="h-6 w-6" />
    if (tierType === 'premium') return <Star className="h-6 w-6" />
    if (tierType === 'basic') return <Shield className="h-6 w-6" />
    
    // Fallback to index-based icons
    const icons = [Shield, Star, Crown]
    const Icon = icons[index ?? 0 % icons.length]
    return <Icon className="h-6 w-6" />
  }

  const getTierColor = (tierType?: string, index?: number) => {
    if (tierType === 'vip') return 'from-yellow-500 to-amber-600'
    if (tierType === 'premium') return 'from-purple-500 to-pink-600'
    if (tierType === 'basic') return 'from-blue-500 to-indigo-600'
    
    // Fallback to index-based colors
    const colors = ['from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-yellow-500 to-amber-600']
    return colors[index ?? 0 % colors.length]
  }

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (tiers.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No subscription tiers available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-2xl font-bold mb-2">Support {creatorName}</h2>
        <p className="text-gray-600">Choose a subscription tier to get exclusive access and benefits</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier, index) => {
          const isCurrentTier = currentTierId === tier.id
          const tierColor = getTierColor(tier.tier_type, index)
          
          return (
            <Card 
              key={tier.id} 
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-xl",
                isCurrentTier && "ring-2 ring-purple-600"
              )}
            >
              {/* Gradient Header */}
              <div className={cn("h-2 bg-gradient-to-r", tierColor)} />
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={cn("p-2 rounded-lg bg-gradient-to-r text-white", tierColor)}>
                    {getTierIcon(tier.tier_type, index)}
                  </div>
                  {isCurrentTier && (
                    <Badge variant="secondary">Current Tier</Badge>
                  )}
                  {tier.tier_type === 'premium' && !isCurrentTier && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                      Most Popular
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-xl">{tier.tier_name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Price */}
                <div className="pb-4 border-b">
                  <p className="text-3xl font-bold">
                    {formatCurrency(tier.price)}
                    <span className="text-sm font-normal text-gray-500">
                      /{tier.billing_period === 'yearly' ? 'year' : 'month'}
                    </span>
                  </p>
                  {tier.billing_period === 'yearly' && (
                    <p className="text-sm text-green-600 mt-1">
                      Save ${(tier.price * 12 * 0.2).toFixed(0)} per year
                    </p>
                  )}
                </div>
                
                {/* Benefits */}
                <div className="space-y-3">
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                  
                  {/* Additional features */}
                  {tier.ad_free && (
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Ad-free experience</span>
                    </div>
                  )}
                  {tier.exclusive_content && (
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Exclusive content access</span>
                    </div>
                  )}
                  {tier.priority_chat && (
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Priority chat support</span>
                    </div>
                  )}
                  {tier.vod_access && (
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">VOD library access</span>
                    </div>
                  )}
                  {tier.max_quality && (
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Up to {tier.max_quality} streaming</span>
                    </div>
                  )}
                </div>
                
                {/* Subscribe Button */}
                <Button
                  className={cn(
                    "w-full",
                    tier.tier_type === 'premium' && !isCurrentTier && "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  )}
                  variant={tier.tier_type === 'premium' || isCurrentTier ? "default" : "outline"}
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={isCurrentTier || subscribing === tier.id}
                >
                  {subscribing === tier.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentTier ? (
                    'Current Plan'
                  ) : (
                    `Subscribe for ${formatCurrency(tier.price)}/mo`
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}