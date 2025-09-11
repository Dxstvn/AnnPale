"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Crown, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"

interface SubscriptionTier {
  id: string
  tier_name: string
  price: number
  description?: string
  benefits?: string[]
  is_active: boolean
}

interface CreatorSubscriptionTiersProps {
  creatorId: string
  creatorName: string
  onSubscribe?: (tierId: string, tierName: string, price: number) => void
}

export default function CreatorSubscriptionTiers({
  creatorId,
  creatorName,
  onSubscribe
}: CreatorSubscriptionTiersProps) {
  const [tiers, setTiers] = React.useState<SubscriptionTier[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchTiers = async () => {
      if (!creatorId) {
        console.warn('CreatorSubscriptionTiers: No creator ID provided')
        setLoading(false)
        return
      }

      try {
        setError(null)
        const supabase = createClient()
        
        if (!supabase) {
          throw new Error('Failed to initialize Supabase client')
        }
        
        // Map known test creator IDs
        const testCreatorMappings: Record<string, string> = {
          'testcreator': '0f3753a3-029c-473a-9aee-fc107d10c569',
          'wyclef-jean': 'd963aa48-879d-461c-9df3-7dc557b545f9',
          'michael-brun': '819421cf-9437-4d10-bb09-bca4e0c12cba',
          'rutshelle-guillaume': 'cbce25c9-04e0-45c7-b872-473fed4eeb1d',
          // Map numeric IDs to creator UUIDs (actual database IDs)
          '1': 'd963aa48-879d-461c-9df3-7dc557b545f9', // Wyclef Jean
          '2': '819421cf-9437-4d10-bb09-bca4e0c12cba', // Michael Brun
          '6': 'cbce25c9-04e0-45c7-b872-473fed4eeb1d'  // Rutshelle Guillaume
        }
        
        // Use mapping if available, otherwise use the creatorId as is
        let authUserId = testCreatorMappings[creatorId] || creatorId
        
        // If it's a UUID already, use it directly
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (uuidRegex.test(creatorId)) {
          authUserId = creatorId
        }
        
        console.log(`Fetching subscription tiers for creator: ${creatorId} (mapped to: ${authUserId})`)
        
        // Fetch active subscription tiers for this creator
        const { data, error: fetchError } = await supabase
          .from('creator_subscription_tiers')
          .select('*')
          .eq('creator_id', authUserId)
          .eq('is_active', true)
          .order('price', { ascending: true })

        if (fetchError) {
          console.error('Error fetching subscription tiers:', fetchError)
          setError('Failed to load subscription tiers')
        } else {
          console.log(`Found ${data?.length || 0} subscription tiers`)
          setTiers(data || [])
        }
      } catch (err) {
        console.error('Error in fetchTiers:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTiers()
  }, [creatorId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (tiers.length === 0) {
    return null // Don't show anything if creator has no subscription tiers
  }

  const getIcon = (index: number) => {
    const icons = [
      <Star className="h-5 w-5" />,
      <Crown className="h-5 w-5" />,
      <Zap className="h-5 w-5" />
    ]
    return icons[index % icons.length]
  }

  const getColor = (index: number) => {
    const colors = [
      "from-purple-600 to-pink-600",
      "from-blue-600 to-purple-600",
      "from-pink-600 to-red-600"
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Subscription Tiers</h3>
        <p className="text-gray-600">
          Support {creatorName} with a monthly subscription
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="relative overflow-hidden hover:shadow-xl transition-shadow"
              data-testid={`tier-option-${index}`}
            >
              {index === 1 && tiers.length > 1 && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "inline-flex p-2 rounded-lg bg-gradient-to-r text-white",
                    getColor(index)
                  )}>
                    {getIcon(index)}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="text-lg font-bold"
                    data-testid={`tier-price-${index}`}
                  >
                    ${tier.price}/month
                  </Badge>
                </div>
                <CardTitle className="mt-4" data-testid={`tier-name-${index}`}>
                  {tier.tier_name}
                </CardTitle>
                {tier.description && (
                  <p 
                    className="text-sm text-gray-600 mt-2"
                    data-testid={`tier-description-${index}`}
                  >
                    {tier.description}
                  </p>
                )}
              </CardHeader>

              <CardContent>
                {tier.benefits && tier.benefits.length > 0 && (
                  <div 
                    className="space-y-2 mb-4"
                    data-testid={`tier-benefits-${index}`}
                  >
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  className={cn(
                    "w-full bg-gradient-to-r text-white",
                    getColor(index)
                  )}
                  data-testid={`subscribe-button-${index}`}
                  onClick={() => {
                    if (onSubscribe) {
                      onSubscribe(tier.id, tier.tier_name, tier.price)
                    } else {
                      // Default behavior - could open a modal or redirect
                      console.log(`Subscribe clicked for ${tier.tier_name} - $${tier.price}/month`)
                      // You could redirect to checkout or open a payment modal here
                      window.alert(`Subscribe to ${tier.tier_name} for $${tier.price}/month\n\nPayment integration coming soon!`)
                    }
                  }}
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}