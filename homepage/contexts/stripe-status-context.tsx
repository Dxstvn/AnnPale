"use client"

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"
import { useSupabaseAuth } from "./supabase-auth-context"

interface StripeStatus {
  hasAccount: boolean
  accountId?: string
  chargesEnabled: boolean
  payoutsEnabled: boolean
  onboardingComplete: boolean
  isLoading: boolean
  error?: string
  lastChecked?: Date
}

interface StripeStatusContextType {
  status: StripeStatus
  refreshStatus: () => Promise<void>
}

const StripeStatusContext = createContext<StripeStatusContextType | undefined>(undefined)

// Cache duration in milliseconds (1 minute)
const CACHE_DURATION = 60000

export function StripeStatusProvider({ children }: { children: ReactNode }) {
  const { user } = useSupabaseAuth()
  const [status, setStatus] = useState<StripeStatus>({
    hasAccount: false,
    chargesEnabled: false,
    payoutsEnabled: false,
    onboardingComplete: false,
    isLoading: true,
    lastChecked: undefined
  })

  const fetchStripeStatus = useCallback(async () => {
    // Check if user exists and is a creator
    if (!user || user.role !== 'creator') {
      setStatus({
        hasAccount: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        onboardingComplete: false,
        isLoading: false
      })
      return
    }

    console.log('Fetching Stripe status for creator...')
    setStatus(prev => ({ ...prev, isLoading: true, error: undefined }))

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: 'Request timed out. Please refresh the page.',
        lastChecked: new Date()
      }))
    }, 10000) // 10 second timeout

    try {
      const response = await fetch('/api/stripe/connect/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('Failed to fetch Stripe status')
      }

      const data = await response.json()

      setStatus({
        hasAccount: data.hasAccount || false,
        accountId: data.accountId,
        chargesEnabled: data.chargesEnabled || false,
        payoutsEnabled: data.payoutsEnabled || false,
        onboardingComplete: data.onboardingComplete || false,
        isLoading: false,
        lastChecked: new Date()
      })
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Error fetching Stripe status:', error)
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load payment status',
        lastChecked: new Date()
      }))
    }
  }, [user])

  const refreshStatus = useCallback(async () => {
    // Force refresh by clearing last checked
    setStatus(prev => ({ ...prev, lastChecked: undefined }))
    await fetchStripeStatus()
  }, [fetchStripeStatus])

  // Fetch status when user changes or component mounts
  useEffect(() => {
    if (user?.role === 'creator') {
      fetchStripeStatus()
    }
  }, [user, fetchStripeStatus])

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