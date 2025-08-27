import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Lock, Star, Zap, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TierOption {
  id: string
  name: string
  slug: string
  description: string
  price: number
  color: string
  icon: 'star' | 'zap' | 'trophy'
  benefits: string[]
  subscriberCount: number
  isPopular?: boolean
  isCurrentTier?: boolean
}

interface TierSelectorProps {
  tiers: TierOption[]
  onSelect: (tier: TierOption) => void
  currentTierId?: string
  orientation?: 'horizontal' | 'vertical'
}

export function TierSelector({ 
  tiers, 
  onSelect, 
  currentTierId,
  orientation = 'horizontal' 
}: TierSelectorProps) {
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'zap': return <Zap className="h-6 w-6 text-white" />
      case 'trophy': return <Trophy className="h-6 w-6 text-white" />
      default: return <Star className="h-6 w-6 text-white" />
    }
  }

  return (
    <div className={cn(
      "grid gap-6",
      orientation === 'horizontal' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      orientation === 'vertical' && "grid-cols-1"
    )}>
      {tiers.map((tier) => {
        const isCurrentTier = tier.id === currentTierId || tier.isCurrentTier
        
        return (
          <Card 
            key={tier.id}
            className={cn(
              "relative overflow-hidden hover:shadow-xl transition-all",
              isCurrentTier && "border-2 border-purple-500",
              tier.isPopular && !isCurrentTier && "border-2 border-purple-200"
            )}
          >
            {/* Popular Badge */}
            {tier.isPopular && !isCurrentTier && (
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              </div>
            )}
            
            {/* Current Badge */}
            {isCurrentTier && (
              <div className="absolute top-0 right-0">
                <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  CURRENT PLAN
                </div>
              </div>
            )}
            
            <CardHeader className="pb-4">
              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center mb-4",
                tier.color
              )}>
                {getIcon(tier.icon)}
              </div>
              
              {/* Title and Description */}
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
              
              {/* Price */}
              <div className="mt-4">
                <span className="text-3xl font-bold">${tier.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Benefits List */}
              <ul className="space-y-3 mb-6">
                {tier.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              {/* Action Button */}
              <Button 
                className={cn(
                  "w-full",
                  !isCurrentTier && "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                )}
                disabled={isCurrentTier}
                onClick={() => onSelect(tier)}
              >
                {isCurrentTier ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Current Plan
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Choose {tier.name}
                  </>
                )}
              </Button>
              
              {/* Subscriber Count */}
              <p className="text-xs text-center text-gray-500 mt-3">
                {tier.subscriberCount.toLocaleString()} subscribers
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}