"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Check,
  X,
  Star,
  Crown,
  Sparkles,
  Zap,
  Gift,
  Heart,
  Shield,
  Rocket,
  ChevronRight
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

const subscriptionTiers = [
  {
    id: "basic",
    name: "Basic",
    price: 4.99,
    icon: Star,
    color: "from-gray-600 to-gray-800",
    features: [
      "Access to subscriber-only content",
      "Ad-free experience",
      "Early access to videos",
      "Basic chat badge",
      "Monthly subscriber events"
    ],
    notIncluded: [
      "Custom emotes",
      "Priority support",
      "Exclusive merchandise",
      "VIP live streams"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: 9.99,
    icon: Crown,
    color: "from-purple-600 to-pink-600",
    popular: true,
    features: [
      "Everything in Basic",
      "Custom emotes in chat",
      "Priority customer support",
      "Exclusive behind-the-scenes content",
      "Premium chat badge",
      "50% off merchandise",
      "Access to premium live streams"
    ],
    notIncluded: [
      "Personal shoutouts",
      "1-on-1 video calls"
    ]
  },
  {
    id: "vip",
    name: "VIP",
    price: 24.99,
    icon: Sparkles,
    color: "from-yellow-500 to-orange-500",
    features: [
      "Everything in Premium",
      "Monthly personal shoutout",
      "Quarterly 1-on-1 video call",
      "Free exclusive merchandise",
      "VIP chat badge with effects",
      "Name in credits",
      "Direct message access",
      "Exclusive VIP-only events",
      "Custom requests priority"
    ],
    notIncluded: []
  }
]

export default function SubscriptionsPage() {
  const { language } = useLanguage()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const handleSubscribe = (tierId: string) => {
    setSelectedTier(tierId)
    // Handle subscription logic
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Choose Your Subscription
        </h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Support your favorite creators and unlock exclusive perks
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Label htmlFor="billing" className={cn(
            "text-lg",
            billingCycle === "monthly" ? "text-gray-900 dark:text-gray-50" : "text-gray-600 dark:text-gray-400"
          )}>
            Monthly
          </Label>
          <Switch
            id="billing"
            checked={billingCycle === "yearly"}
            onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
          />
          <Label htmlFor="billing" className={cn(
            "text-lg",
            billingCycle === "yearly" ? "text-gray-900 dark:text-gray-50" : "text-gray-600 dark:text-gray-400"
          )}>
            Yearly
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
              Save 20%
            </Badge>
          </Label>
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {subscriptionTiers.map((tier) => {
          const TierIcon = tier.icon
          const price = billingCycle === "yearly" ? tier.price * 12 * 0.8 : tier.price
          const isYearly = billingCycle === "yearly"

          return (
            <Card 
              key={tier.id} 
              className={cn(
                "relative overflow-hidden transition-all",
                tier.popular && "ring-2 ring-purple-600 shadow-xl scale-105"
              )}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <CardHeader className="pb-8">
                <div className={cn(
                  "w-16 h-16 rounded-full bg-gradient-to-r flex items-center justify-center text-white mb-4",
                  tier.color
                )}>
                  <TierIcon className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${isYearly ? (price / 12).toFixed(2) : price.toFixed(2)}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">/month</span>
                  {isYearly && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Billed ${price.toFixed(2)} yearly
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {tier.notIncluded.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 opacity-50">
                      <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={cn(
                    "w-full",
                    tier.popular && "bg-gradient-to-r from-purple-600 to-pink-600"
                  )}
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(tier.id)}
                >
                  Subscribe to {tier.name}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle>Why Subscribe?</CardTitle>
          <CardDescription>Supporting creators has never been more rewarding</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">Support Creators</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">Help your favorite creators continue making amazing content</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-1">Exclusive Perks</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">Access special content and features not available to others</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Ad-Free Experience</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">Enjoy content without interruptions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Early Access</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">Be the first to see new content and features</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}