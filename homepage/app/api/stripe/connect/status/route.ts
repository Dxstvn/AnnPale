import { NextRequest, NextResponse } from 'next/server'
import { StripeConnectService } from '@/lib/stripe/connect-service'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    
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
      .select('stripe_account_id')
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

    // Get account status from Stripe
    const stripeService = new StripeConnectService()
    const account = await stripeService.getAccount(profile.stripe_account_id)

    // Update database with current status
    await supabase
      .from('profiles')
      .update({
        stripe_charges_enabled: account.charges_enabled,
        stripe_payouts_enabled: account.payouts_enabled,
        stripe_onboarding_completed: account.details_submitted,
      })
      .eq('id', user.id)

    return NextResponse.json({
      hasAccount: true,
      accountId: account.id,
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
      onboardingComplete: account.details_submitted || false,
      requirements: account.requirements,
    })
  } catch (error) {
    console.error('Stripe status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}