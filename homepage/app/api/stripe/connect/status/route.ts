import { NextRequest, NextResponse } from 'next/server'
import { StripeConnectService } from '@/lib/stripe/connect-service'
import { createClient } from '@/lib/supabase/server'

// Simple in-memory cache for Stripe status
const statusCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 30000 // 30 seconds

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the user's Stripe account ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_account_id, onboarding_completed_at')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || !profile.stripe_account_id) {
      return NextResponse.json({
        hasAccount: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        onboardingComplete: false,
      })
    }

    // Check cache first
    const cacheKey = `stripe_status_${user.id}`
    const cached = statusCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached Stripe status for user:', user.id)
      return NextResponse.json(cached.data)
    }

    // Get account status from Stripe
    const stripeService = new StripeConnectService()
    const account = await stripeService.getAccount(profile.stripe_account_id)

    // Check if onboarding just completed
    const isFullyOnboarded = account.charges_enabled && account.payouts_enabled
    const updateData: any = {
      stripe_charges_enabled: account.charges_enabled,
      stripe_payouts_enabled: account.payouts_enabled,
      stripe_onboarding_completed: account.details_submitted,
      updated_at: new Date().toISOString()
    }

    // If onboarding just completed and we don't have a completion timestamp, set it
    if (isFullyOnboarded && !profile.onboarding_completed_at) {
      updateData.onboarding_completed_at = new Date().toISOString()
    }

    // Update database with current status
    await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)

    const responseData = {
      hasAccount: true,
      accountId: account.id,
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
      onboardingComplete: account.details_submitted || false,
      requirements: account.requirements,
    }

    // Cache the response
    statusCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    })

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Stripe status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}