import { NextRequest, NextResponse } from 'next/server'
import { StripeConnectService } from '@/lib/stripe/connect-service'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
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

    // Verify the user is a creator
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, stripe_account_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'creator') {
      return NextResponse.json(
        { error: 'Only creators can set up payments' },
        { status: 403 }
      )
    }

    // Check if already has a Stripe account
    if (profile.stripe_account_id) {
      // Get the existing account and create a new onboarding link
      const stripeService = new StripeConnectService()
      const account = await stripeService.getAccount(profile.stripe_account_id)
      
      if (account.charges_enabled && account.payouts_enabled) {
        return NextResponse.json({
          message: 'Payment setup already complete',
          accountId: profile.stripe_account_id,
          onboardingUrl: null,
        })
      }
      
      // Create new onboarding link for incomplete account
      const stripe = (await import('stripe')).default
      const stripeClient = new stripe(process.env.STRIPE_SANDBOX_SECRET_KEY || '', {
        apiVersion: '2024-11-20.acacia',
      })

      const accountLink = await stripeClient.accountLinks.create({
        account: profile.stripe_account_id,
        refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/settings/payments?refresh=true`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/settings/payments?success=true`,
        type: 'account_onboarding',
      })

      return NextResponse.json({
        accountId: profile.stripe_account_id,
        onboardingUrl: accountLink.url,
      })
    }

    // Create new Stripe Connect account
    const stripeService = new StripeConnectService()
    const { accountId, onboardingUrl } = await stripeService.createConnectedAccount(user.id)

    return NextResponse.json({
      accountId,
      onboardingUrl,
    })
  } catch (error) {
    console.error('Stripe onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to start payment setup' },
      { status: 500 }
    )
  }
}