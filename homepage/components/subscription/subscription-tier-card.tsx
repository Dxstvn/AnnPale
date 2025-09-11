'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Star, Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface SubscriptionTier {
  id: string
  tier_name: string
  description: string | null
  price: number
  billing_period: 'monthly' | 'yearly'
  features?: any
  benefits?: string[]
  is_active: boolean
  ad_free?: boolean
  early_access?: boolean
  exclusive_content?: boolean
  direct_messaging?: boolean
  group_chat_access?: boolean
  monthly_video_message?: boolean
  priority_requests?: boolean
  behind_scenes?: boolean
}

interface SubscriptionTierCardProps {
  tier: SubscriptionTier
  isSubscribed?: boolean
  isPopular?: boolean
  onSubscribe: (tierId: string) => void
  loading?: boolean
}

const tierIcons = {
  'Basic': Star,
  'Premium': Crown,
  'VIP': Sparkles,
  'default': Star
}

export function SubscriptionTierCard({
  tier,
  isSubscribed = false,
  isPopular = false,
  onSubscribe,
  loading = false
}: SubscriptionTierCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  
  const Icon = tierIcons[tier.tier_name as keyof typeof tierIcons] || tierIcons.default

  const handleSubscribe = async () => {
    setIsProcessing(true)
    try {
      await onSubscribe(tier.id)
    } finally {
      setIsProcessing(false)
    }
  }

  const features = []
  if (tier.ad_free) features.push('Ad-free experience')
  if (tier.early_access) features.push('Early access to content')
  if (tier.exclusive_content) features.push('Exclusive content')
  if (tier.direct_messaging) features.push('Direct messaging')
  if (tier.group_chat_access) features.push('Group chat access')
  if (tier.monthly_video_message) features.push('Monthly video message')
  if (tier.priority_requests) features.push('Priority requests')
  if (tier.behind_scenes) features.push('Behind the scenes content')
  
  // Add custom benefits
  if (tier.benefits && tier.benefits.length > 0) {
    features.push(...tier.benefits)
  }

  return (
    <Card className={`relative ${isPopular ? 'border-purple-500 shadow-lg' : ''} ${isSubscribed ? 'border-green-500' : ''}`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500">
          Most Popular
        </Badge>
      )}
      
      {isSubscribed && (
        <Badge className="absolute -top-3 right-4 bg-green-500">
          Current Plan
        </Badge>
      )}

      <CardHeader>
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-purple-500" />
          <div className="text-right">
            <div className="text-3xl font-bold">
              {formatCurrency(tier.price)}
            </div>
            <div className="text-sm text-muted-foreground">
              per {tier.billing_period === 'yearly' ? 'year' : 'month'}
            </div>
          </div>
        </div>
        <CardTitle className="mt-4">{tier.tier_name}</CardTitle>
        {tier.description && (
          <CardDescription>{tier.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isSubscribed ? 'outline' : 'default'}
          disabled={isSubscribed || loading || isProcessing || !tier.is_active}
          onClick={handleSubscribe}
        >
          {isSubscribed ? 'Current Plan' : isProcessing ? 'Processing...' : 'Subscribe'}
        </Button>
      </CardFooter>
    </Card>
  )
}