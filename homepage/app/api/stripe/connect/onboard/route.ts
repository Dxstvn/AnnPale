import { NextRequest, NextResponse } from 'next/server'
import { StripeConnectService } from '@/lib/stripe/connect-service'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Get country from request body
    const body = await request.json()
    const { country } = body

    // Get the authenticated user
    const supabase = await createClient()

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
      .select('id, role, stripe_account_id, onboarding_started_at, stripe_charges_enabled, stripe_payouts_enabled')
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

      try {
        const account = await stripeService.getAccount(profile.stripe_account_id)

        // Check if the account's country matches the requested country
        if (country && account.country && account.country !== country) {
          console.log(`Country mismatch: Account has ${account.country}, user selected ${country}`)

          // In test/sandbox mode, we could delete and recreate
          // For now, we'll proceed with the existing account but log the issue
          console.warn('Warning: Cannot change country after Stripe account creation')
        }

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

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const accountLink = await stripeClient.accountLinks.create({
          account: profile.stripe_account_id,
          refresh_url: `${appUrl}/creator/dashboard?onboarding=refresh`,
          return_url: `${appUrl}/creator/dashboard?onboarding=complete&account=${profile.stripe_account_id}`,
          type: 'account_onboarding',
        })

        return NextResponse.json({
          accountId: profile.stripe_account_id,
          onboardingUrl: accountLink.url,
          warning: country && account.country && account.country !== country
            ? `Note: Your account was created for ${account.country}. Country cannot be changed after account creation.`
            : undefined,
        })
      } catch (error) {
        console.error('Error retrieving Stripe account:', error)
        // If the account doesn't exist or is invalid, clear it and create a new one
        await supabase
          .from('profiles')
          .update({ stripe_account_id: null })
          .eq('id', user.id)

        // Fall through to create a new account
      }
    }

    // Create new Stripe Connect account with specified country
    const stripeService = new StripeConnectService()
    const { accountId, onboardingUrl } = await stripeService.createConnectedAccount(user.id, country)

    // Update onboarding_started_at timestamp
    await supabase
      .from('profiles')
      .update({
        onboarding_started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

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