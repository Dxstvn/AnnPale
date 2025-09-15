import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountId } = body

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      )
    }

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
      .select('id, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'creator') {
      return NextResponse.json(
        { error: 'Only creators can complete payment setup' },
        { status: 403 }
      )
    }

    // Verify the Stripe account exists and is properly onboarded
    const account = await stripe.accounts.retrieve(accountId)

    if (!account) {
      return NextResponse.json(
        { error: 'Invalid Stripe account' },
        { status: 400 }
      )
    }

    // Check if onboarding is actually complete
    if (!account.charges_enabled || !account.payouts_enabled) {
      return NextResponse.json(
        { error: 'Onboarding is not complete. Please finish all required steps.' },
        { status: 400 }
      )
    }

    // Now save the account ID to the database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        stripe_account_id: accountId,
        stripe_charges_enabled: account.charges_enabled,
        stripe_payouts_enabled: account.payouts_enabled,
        onboarding_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile with Stripe account:', updateError)
      return NextResponse.json(
        { error: 'Failed to save payment setup' },
        { status: 500 }
      )
    }

    console.log(`Successfully saved Stripe account ${accountId} for user ${user.id}`)

    return NextResponse.json({
      success: true,
      accountId,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    })
  } catch (error) {
    console.error('Error completing Stripe onboarding:', error)
    return NextResponse.json(
      { error: 'Failed to complete payment setup' },
      { status: 500 }
    )
  }
}