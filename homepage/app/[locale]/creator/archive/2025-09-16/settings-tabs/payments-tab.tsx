// Archived from creator/settings/page.tsx on 2025-09-16
// This tab was used for payment setup and Stripe onboarding

import React from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { StripeOnboarding } from "@/components/creator/stripe-onboarding"

interface PaymentsTabProps {
  userId: string
  creatorName: string
  stripeStatus: {
    isOnboarded: boolean
    chargesEnabled: boolean
    payoutsEnabled: boolean
  }
}

export function PaymentsTab({ userId, creatorName, stripeStatus }: PaymentsTabProps) {
  return (
    <TabsContent value="payments" className="space-y-6">
      <StripeOnboarding
        creatorId={userId}
        creatorName={creatorName}
        isOnboarded={stripeStatus.isOnboarded}
        chargesEnabled={stripeStatus.chargesEnabled}
        payoutsEnabled={stripeStatus.payoutsEnabled}
      />
    </TabsContent>
  )
}