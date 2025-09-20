"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import CreatorSubscriptionTiers from "@/components/creator/creator-subscription-tiers"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionTierModalProps {
  creator: {
    id: string
    name: string
    image?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SubscriptionTierModal({
  creator,
  open,
  onOpenChange
}: SubscriptionTierModalProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleSubscribe = (tierId: string, tierName: string, price: number) => {
    // For now, just show a success message and navigate to subscription checkout
    toast({
      title: "Redirecting to checkout...",
      description: `Subscribe to ${creator.name}'s ${tierName} tier for $${price}/month`,
    })

    // Close modal
    onOpenChange(false)

    // Navigate to subscription checkout page with the tier information
    router.push(`/fan/subscribe/${creator.id}?tier=${tierId}&name=${encodeURIComponent(tierName)}&price=${price}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subscribe to {creator.name}</DialogTitle>
          <DialogDescription>
            Choose a subscription tier to get exclusive content, early access, and more perks from {creator.name}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <CreatorSubscriptionTiers
            creatorId={creator.id}
            creatorName={creator.name}
            onSubscribe={handleSubscribe}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}