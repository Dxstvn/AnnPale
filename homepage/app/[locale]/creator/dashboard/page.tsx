"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CreatorRealDashboard } from "@/components/creator/real-dashboard"
import { OnboardingGate } from "@/components/creator/onboarding-gate"
import { OnboardingBanner } from "@/components/creator/onboarding-banner"
import { StripeOnboardingRedirect } from "@/components/creator/stripe-onboarding-redirect"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"
import { useStripeStatus } from "@/contexts/stripe-status-context"
import { toast } from "sonner"
import { CheckCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function CreatorDashboard() {
  const { user: authUser, supabase } = useSupabaseAuth()
  const { refreshStatus: refreshStripeStatus } = useStripeStatus()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessingOnboarding, setIsProcessingOnboarding] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // Load profile data with Stripe information
  useEffect(() => {
    const loadProfile = async () => {
      if (!authUser) return

      setIsLoadingProfile(true)
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('id, role, is_creator, stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled')
          .eq('id', authUser.id)
          .single()

        if (!error && profileData) {
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [authUser, supabase])

  // Handle onboarding completion
  useEffect(() => {
    const onboarding = searchParams.get('onboarding')
    const accountId = searchParams.get('account')

    if (onboarding === 'complete' && accountId && !isProcessingOnboarding) {
      handleOnboardingComplete(accountId)
    } else if (onboarding === 'refresh') {
      // User needs to continue onboarding
      toast("Please complete all required steps to finish payment setup", {
        icon: '📝',
        style: {
          background: '#eff6ff',
          color: '#1e40af',
          border: '1px solid #bfdbfe'
        }
      })
      // Clear the URL params
      router.replace('/creator/dashboard')
    }
  }, [searchParams, isProcessingOnboarding])

  const handleOnboardingComplete = async (accountId: string) => {
    setIsProcessingOnboarding(true)

    try {
      console.log('Completing Stripe onboarding for account:', accountId)

      const response = await fetch('/api/stripe/connect/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Refresh the Stripe status
        await refreshStripeStatus()

        // Show success message with welcome
        toast.success(
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Welcome to Ann Pale!</p>
              <p className="text-sm text-gray-600 mt-1">
                Your payment setup is complete. You can now start accepting video requests from fans!
              </p>
            </div>
          </div>,
          {
            duration: 7000,
          }
        )

        // Clear the URL params to prevent re-processing on refresh
        router.replace('/creator/dashboard')
      } else {
        console.error('Failed to complete onboarding:', data.error)
        toast.error(data.error || 'Failed to complete payment setup. Please try again.', {
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca'
          }
        })

        // Clear the URL params
        router.replace('/creator/dashboard')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toast.error('An error occurred while completing payment setup. Please try again.', {
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca'
          }
        })

      // Clear the URL params
      router.replace('/creator/dashboard')
    } finally {
      setIsProcessingOnboarding(false)
    }
  }

  // Show loading state during processing or profile loading
  if (isProcessingOnboarding || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-lg font-medium">
            {isProcessingOnboarding ? "Completing your payment setup..." : "Loading dashboard..."}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {isProcessingOnboarding ? "Please wait while we finalize your account" : "Please wait..."}
          </p>
        </div>
      </div>
    )
  }

  // Show onboarding flow for new creators who haven't connected Stripe
  // Check if profile exists and hasn't completed Stripe onboarding
  // For dual-role users (fans who became creators), check if they have creator access
  const isCreatorOrDualRole = profile?.role === 'creator' || profile?.is_creator === true
  const needsOnboarding = profile && isCreatorOrDualRole && (!profile.stripe_account_id || !profile.stripe_charges_enabled || !profile.stripe_payouts_enabled)

  if (needsOnboarding) {
    return (
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <StripeOnboardingRedirect />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Show persistent banner if not onboarded */}
      <OnboardingBanner className="mx-6 lg:mx-8 mt-6 lg:mt-8" />

      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <OnboardingGate
          featureName="Creator Dashboard"
          description="Complete payment setup to access your dashboard and start accepting video requests from fans."
        >
          <CreatorRealDashboard />
        </OnboardingGate>
      </div>
    </div>
  )
}