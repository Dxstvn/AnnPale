"use client"

import { createContext, useContext, useCallback, ReactNode } from "react"
import { useSupabaseAuth } from "./supabase-auth-compat"

interface StripeStatusContextType {
  /**
   * @deprecated Use user.stripe_charges_enabled and user.stripe_payouts_enabled from useSupabaseAuth instead
   */
  status: {
    hasAccount: boolean
    accountId?: string
    chargesEnabled: boolean
    payoutsEnabled: boolean
    onboardingComplete: boolean
    isLoading: boolean
    error?: string
    lastChecked?: Date
  }
  refreshStatus: () => Promise<void>
}

const StripeStatusContext = createContext<StripeStatusContextType | undefined>(undefined)

export function StripeStatusProvider({ children }: { children: ReactNode }) {
  const { user, updateProfile } = useSupabaseAuth()

  // Create a status object from user profile data for backward compatibility
  const status = {
    hasAccount: !!user?.stripe_account_id,
    accountId: user?.stripe_account_id,
    chargesEnabled: user?.stripe_charges_enabled || false,
    payoutsEnabled: user?.stripe_payouts_enabled || false,
    onboardingComplete: !!user?.onboarding_completed_at,
    isLoading: false, // Profile is already loaded via auth context
    error: undefined,
    lastChecked: new Date()
  }

  const refreshStatus = useCallback(async () => {
    // Refresh profile to get latest Stripe status
    if (!user) return

    try {
      // Call the API to update Stripe status in the profile
      const response = await fetch('/api/stripe/connect/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()

        // Update the user profile with the latest Stripe status
        await updateProfile({
          stripe_account_id: data.accountId,
          stripe_charges_enabled: data.chargesEnabled || false,
          stripe_payouts_enabled: data.payoutsEnabled || false,
          onboarding_completed_at: data.onboardingComplete ? new Date().toISOString() : undefined
        })
      }
    } catch (error) {
      console.error('Error refreshing Stripe status:', error)
    }
  }, [user, updateProfile])

  return (
    <StripeStatusContext.Provider value={{ status, refreshStatus }}>
      {children}
    </StripeStatusContext.Provider>
  )
}

export function useStripeStatus() {
  const context = useContext(StripeStatusContext)
  if (context === undefined) {
    throw new Error('useStripeStatus must be used within a StripeStatusProvider')
  }
  return context
}