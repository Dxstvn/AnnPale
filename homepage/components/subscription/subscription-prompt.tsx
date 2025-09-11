"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Crown, 
  Users, 
  Star, 
  Heart, 
  Video, 
  MessageSquare,
  Gift,
  Zap,
  Check,
  ArrowRight
} from "lucide-react"
import { SubscriptionTier } from "@/types/posts"

interface SubscriptionPromptProps {
  creatorId: string
  creatorName: string
  creatorAvatar?: string
  requiredTiers?: SubscriptionTier[]
  contentType?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SubscriptionPrompt({
  creatorId,
  creatorName,
  creatorAvatar,
  requiredTiers = [],
  contentType = "content",
  isOpen,
  onOpenChange
}: SubscriptionPromptProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const router = useRouter()

  const handleSubscribe = (tierId?: string) => {
    const targetTier = tierId || requiredTiers[0]?.id
    if (targetTier) {
      router.push(`/creator/${creatorId}?tier=${targetTier}`)
    } else {
      router.push(`/creator/${creatorId}`)
    }
  }

  const getTierIcon = (price: number) => {
    if (price < 10) return <Users className="h-5 w-5" />
    if (price < 25) return <Star className="h-5 w-5" />
    return <Crown className="h-5 w-5" />
  }

  const getTierColor = (price: number) => {
    if (price < 10) return "bg-blue-500"
    if (price < 25) return "bg-purple-500"
    return "bg-yellow-500"
  }

  const benefits = [
    {
      icon: <Video className="h-4 w-4" />,
      text: "Exclusive video content"
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      text: "Direct messaging access"
    },
    {
      icon: <Gift className="h-4 w-4" />,
      text: "Special perks and rewards"
    },
    {
      icon: <Zap className="h-4 w-4" />,
      text: "Early access to new content"
    }
  ]

  const PromptContent = () => (
    <div className="space-y-6">
      {/* Creator Header */}
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
          {creatorAvatar ? (
            <img src={creatorAvatar} alt={creatorName} className="w-full h-full rounded-full object-cover" />
          ) : (
            creatorName[0]?.toUpperCase()
          )}
        </div>
        <h3 className="text-xl font-bold">{creatorName}</h3>
        <p className="text-muted-foreground">
          Subscribe to access exclusive {contentType}
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="text-purple-600">
              {benefit.icon}
            </div>
            <span>{benefit.text}</span>
          </div>
        ))}
      </div>

      {/* Subscription Tiers */}
      {requiredTiers.length > 0 ? (
        <div className="space-y-3">
          <h4 className="font-semibold">Choose your subscription tier:</h4>
          <div className="grid gap-3">
            {requiredTiers.map((tier) => (
              <Card 
                key={tier.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTier === tier.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getTierColor(tier.price)} text-white`}>
                        {getTierIcon(tier.price)}
                      </div>
                      <div>
                        <h5 className="font-semibold">{tier.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          ${tier.price}/month
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedTier === tier.id && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                      <Badge variant="secondary">
                        {tier.benefits?.length || 3} benefits
                      </Badge>
                    </div>
                  </div>
                  {tier.description && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {tier.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm">
              Support {creatorName} and unlock all their exclusive content
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={() => handleSubscribe(selectedTier || undefined)}
          className="flex-1 gap-2"
          size="lg"
        >
          <Star className="h-4 w-4" />
          Subscribe Now
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Cancel anytime • Secure payment • Instant access
        </p>
      </div>
    </div>
  )

  if (isOpen !== undefined) {
    // Controlled mode
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-center">Unlock Exclusive Content</DialogTitle>
            <DialogDescription className="text-center">
              Join thousands of fans supporting {creatorName}
            </DialogDescription>
          </DialogHeader>
          <PromptContent />
        </DialogContent>
      </Dialog>
    )
  }

  // Uncontrolled mode with trigger
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="h-4 w-4" />
          Subscribe to Access
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-center">Unlock Exclusive Content</DialogTitle>
          <DialogDescription className="text-center">
            Join thousands of fans supporting {creatorName}
          </DialogDescription>
        </DialogHeader>
        <PromptContent />
      </DialogContent>
    </Dialog>
  )
}