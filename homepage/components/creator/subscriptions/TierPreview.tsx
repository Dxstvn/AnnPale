import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap, Trophy, Gift, Heart, Crown, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CreatorSubscriptionTier } from '@/lib/types/livestream'

interface TierPreviewProps {
  tier: CreatorSubscriptionTier
  isCurrentTier?: boolean
  onSubscribe?: () => void
}

export function TierPreview({ tier, isCurrentTier, onSubscribe }: TierPreviewProps) {
  const getIcon = () => {
    switch(tier.icon) {
      case 'zap': return Zap
      case 'trophy': return Trophy
      case 'gift': return Gift
      case 'heart': return Heart
      case 'crown': return Crown
      default: return Star
    }
  }
  
  const Icon = getIcon()
  
  return (
    <Card className={cn(
      "relative overflow-hidden hover:shadow-xl transition-all",
      isCurrentTier && "border-2 border-purple-500"
    )}>
      {/* Popular/Current Badge */}
      {isCurrentTier && (
        <div className="absolute top-0 right-0">
          <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            CURRENT
          </div>
        </div>
      )}
      
      <CardHeader className="pb-4">
        {/* Icon */}
        <div className={cn(
          "w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center mb-4",
          tier.color || "from-purple-600 to-pink-600"
        )}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        {/* Title and Description */}
        <CardTitle className="text-xl">{tier.tier_name}</CardTitle>
        {tier.description && (
          <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
        )}
        
        {/* Price */}
        <div className="mt-4">
          <span className="text-3xl font-bold">${tier.price}</span>
          <span className="text-gray-600">/{tier.billing_period === 'yearly' ? 'year' : 'month'}</span>
        </div>
        
        {/* Subscriber Count */}
        {tier.subscriber_count !== undefined && (
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            {tier.subscriber_count.toLocaleString()} subscribers
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {/* Benefits List */}
        <ul className="space-y-3 mb-6">
          {Array.isArray(tier.benefits) && tier.benefits.slice(0, 5).map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm">
                {typeof benefit === 'string' ? benefit : benefit.text}
              </span>
            </li>
          ))}
          {tier.benefits.length > 5 && (
            <li className="text-sm text-purple-600 font-medium">
              +{tier.benefits.length - 5} more benefits
            </li>
          )}
        </ul>
        
        {/* Additional Features */}
        <div className="space-y-2 mb-6">
          {tier.ad_free && (
            <Badge variant="secondary" className="text-xs">
              Ad-Free Experience
            </Badge>
          )}
          {tier.exclusive_content && (
            <Badge variant="secondary" className="text-xs">
              Exclusive Content
            </Badge>
          )}
          {tier.priority_chat && (
            <Badge variant="secondary" className="text-xs">
              Priority Chat
            </Badge>
          )}
          {tier.vod_access && (
            <Badge variant="secondary" className="text-xs">
              VOD Access
            </Badge>
          )}
        </div>
        
        {/* Action Button */}
        <Button 
          className={cn(
            "w-full",
            !isCurrentTier && "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          )}
          disabled={isCurrentTier}
          onClick={onSubscribe}
        >
          {isCurrentTier ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Current Plan
            </>
          ) : (
            <>Subscribe Now</>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}