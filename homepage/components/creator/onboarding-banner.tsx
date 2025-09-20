"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  CreditCard,
  X,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"

interface OnboardingBannerProps {
  className?: string
  dismissible?: boolean
  variant?: "warning" | "error" | "info"
}

export function OnboardingBanner({
  className,
  dismissible = false,
  variant = "warning"
}: OnboardingBannerProps) {
  const router = useRouter()
  const { user } = useSupabaseAuth()
  const [isDismissed, setIsDismissed] = useState(false)

  // Determine visibility based on user's Stripe status from profile
  const needsOnboarding = user && (!user.stripe_charges_enabled || !user.stripe_payouts_enabled)
  const isVisible = user?.role === 'creator' && needsOnboarding && !isDismissed

  const handleSetupPayments = () => {
    router.push('/creator/settings?tab=payments')
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    // Store dismissal in localStorage for this session
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding-banner-dismissed', 'true')
    }
  }

  // Check if previously dismissed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('onboarding-banner-dismissed')
      if (dismissed === 'true') {
        setIsDismissed(true)
      }
    }
  }, [])

  if (!isVisible) {
    return null
  }

  const variantStyles = {
    warning: "border-orange-200 bg-orange-50",
    error: "border-red-200 bg-red-50",
    info: "border-blue-200 bg-blue-50"
  }

  const iconColors = {
    warning: "text-orange-600",
    error: "text-red-600",
    info: "text-blue-600"
  }

  const textColors = {
    warning: "text-orange-800",
    error: "text-red-800",
    info: "text-blue-800"
  }

  return (
    <Alert className={cn(
      "relative",
      variantStyles[variant],
      className
    )}>
      <AlertTriangle className={cn("h-4 w-4", iconColors[variant])} />
      <AlertDescription className={cn("pr-8", textColors[variant])}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <strong className="font-semibold">Payment Setup Required</strong>
            <p className="text-sm mt-1">
              {stripeStatus.hasAccount
                ? "Complete your Stripe onboarding to start accepting payments and appear to fans."
                : "Set up payments to unlock all creator features and start earning from your content."
              }
            </p>
            <div className="text-xs mt-2 space-x-4">
              <span>⚠️ Cannot accept video requests</span>
              <span>⚠️ Cannot create subscriptions</span>
              <span>⚠️ Not visible to fans</span>
            </div>
          </div>
          <div className="ml-4">
            <Button
              size="sm"
              onClick={handleSetupPayments}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Setup Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </AlertDescription>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={cn(
            "absolute top-2 right-2 p-1 rounded-md hover:bg-black/10 transition-colors",
            iconColors[variant]
          )}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </Alert>
  )
}