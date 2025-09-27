import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Stripe
const stripe = process.env.STRIPE_SANDBOX_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia'
    })
  : null

// Service role client for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  // Verify this is called from a trusted source (e.g., cron job)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  console.log('🔄 Starting subscription synchronization...')

  try {
    const syncResults = {
      checked: 0,
      synced: 0,
      errors: 0,
      mismatches: [] as any[]
    }

    // Fetch all subscriptions from Stripe
    const stripeSubscriptions = await stripe.subscriptions.list({
      limit: 100, // Adjust for pagination if needed
      expand: ['data.customer']
    })

    for (const stripeSub of stripeSubscriptions.data) {
      syncResults.checked++

      // Get corresponding database record
      const { data: dbSub, error: dbError } = await supabase
        .from('subscription_orders')
        .select('*')
        .eq('stripe_subscription_id', stripeSub.id)
        .single()

      if (dbError && dbError.code !== 'PGRST116') { // PGRST116 = no rows
        console.error(`Error fetching subscription ${stripeSub.id}:`, dbError)
        syncResults.errors++
        continue
      }

      if (!dbSub) {
        // Subscription exists in Stripe but not in database
        console.warn(`⚠️ Subscription ${stripeSub.id} not found in database`)
        syncResults.mismatches.push({
          stripe_id: stripeSub.id,
          issue: 'missing_in_database',
          stripe_status: stripeSub.status
        })

        // Optional: Create the missing subscription in database
        // This would require fetching customer details, tier info, etc.
        continue
      }

      // Check if status matches
      const stripeStatus = mapStripeStatus(stripeSub.status)
      if (dbSub.status !== stripeStatus) {
        console.log(`🔄 Updating status for ${stripeSub.id}: ${dbSub.status} → ${stripeStatus}`)

        const { error: updateError } = await supabase
          .from('subscription_orders')
          .update({
            status: stripeStatus,
            current_period_start: new Date(stripeSub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(stripeSub.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', stripeSub.id)

        if (updateError) {
          console.error(`Error updating subscription ${stripeSub.id}:`, updateError)
          syncResults.errors++
        } else {
          syncResults.synced++
        }
      }

      // Check billing dates
      const periodEnd = new Date(stripeSub.current_period_end * 1000).toISOString()
      if (dbSub.current_period_end !== periodEnd) {
        console.log(`🔄 Updating billing period for ${stripeSub.id}`)

        const { error: updateError } = await supabase
          .from('subscription_orders')
          .update({
            current_period_start: new Date(stripeSub.current_period_start * 1000).toISOString(),
            current_period_end: periodEnd,
            next_billing_date: periodEnd,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', stripeSub.id)

        if (updateError) {
          console.error(`Error updating billing dates for ${stripeSub.id}:`, updateError)
          syncResults.errors++
        } else {
          syncResults.synced++
        }
      }
    }

    // Check for database subscriptions not in Stripe
    const { data: dbSubs, error: dbListError } = await supabase
      .from('subscription_orders')
      .select('stripe_subscription_id, status')
      .not('stripe_subscription_id', 'is', null)
      .in('status', ['active', 'trialing', 'paused'])

    if (!dbListError && dbSubs) {
      for (const dbSub of dbSubs) {
        if (!dbSub.stripe_subscription_id?.startsWith('demo_')) { // Skip demo subscriptions
          const exists = stripeSubscriptions.data.some(s => s.id === dbSub.stripe_subscription_id)
          if (!exists) {
            console.warn(`⚠️ Database subscription ${dbSub.stripe_subscription_id} not found in Stripe`)
            syncResults.mismatches.push({
              stripe_id: dbSub.stripe_subscription_id,
              issue: 'missing_in_stripe',
              db_status: dbSub.status
            })

            // Mark as expired if not in Stripe
            await supabase
              .from('subscription_orders')
              .update({
                status: 'expired',
                updated_at: new Date().toISOString()
              })
              .eq('stripe_subscription_id', dbSub.stripe_subscription_id)
          }
        }
      }
    }

    console.log('✅ Synchronization complete:', syncResults)

    // Save sync results to database
    const timestamp = new Date().toISOString()
    await supabase
      .from('sync_logs')
      .insert({
        results: syncResults,
        errors: syncResults.errors,
        created_at: timestamp
      })
      .select()
      .single()
      .catch(err => {
        console.error('Error saving sync log:', err)
        // Continue even if log save fails
      })

    // Send alert if there are mismatches
    if (syncResults.mismatches.length > 0) {
      // TODO: Send notification to admin
      console.error('🚨 Subscription mismatches detected:', syncResults.mismatches)
    }

    return NextResponse.json({
      success: true,
      results: syncResults,
      timestamp
    })

  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({
      error: 'Synchronization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function mapStripeStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case 'active':
      return 'active'
    case 'past_due':
    case 'unpaid':
      return 'pending'
    case 'canceled':
      return 'cancelled'
    case 'incomplete':
    case 'incomplete_expired':
      return 'expired'
    case 'trialing':
      return 'trialing'
    case 'paused':
      return 'paused'
    default:
      return 'pending'
  }
}