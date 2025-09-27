import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SANDBOX_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia'
    })
  : null

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const healthCheck = {
      status: 'healthy' as 'healthy' | 'warning' | 'critical',
      stripeConnected: false,
      databaseConnected: false,
      webhooksActive: false,
      lastSync: null as string | null,
      syncErrors: 0,
      outOfSyncCount: 0
    }

    // Check Stripe connection
    if (stripe) {
      try {
        // Try to list one subscription to verify connection
        await stripe.subscriptions.list({ limit: 1 })
        healthCheck.stripeConnected = true
      } catch {
        healthCheck.stripeConnected = false
      }
    }

    // Check database connection
    try {
      const { error } = await supabase
        .from('subscription_orders')
        .select('id')
        .limit(1)

      healthCheck.databaseConnected = !error
    } catch {
      healthCheck.databaseConnected = false
    }

    // Check for recent webhook events
    const { data: recentWebhooks } = await supabase
      .from('webhook_events')
      .select('processed_at')
      .order('processed_at', { ascending: false })
      .limit(1)

    if (recentWebhooks && recentWebhooks.length > 0) {
      const lastWebhookTime = new Date(recentWebhooks[0].processed_at)
      const hoursSinceLastWebhook = (Date.now() - lastWebhookTime.getTime()) / (1000 * 60 * 60)
      healthCheck.webhooksActive = hoursSinceLastWebhook < 24 // Active if webhook in last 24 hours
    }

    // Get last sync time
    const { data: syncLog } = await supabase
      .from('sync_logs')
      .select('created_at, errors')
      .order('created_at', { ascending: false })
      .limit(1)

    if (syncLog && syncLog.length > 0) {
      healthCheck.lastSync = syncLog[0].created_at
      healthCheck.syncErrors = syncLog[0].errors || 0
    }

    // Check for out-of-sync subscriptions
    if (stripe && healthCheck.stripeConnected) {
      // Get all active subscriptions from Stripe
      const stripeSubscriptions = await stripe.subscriptions.list({
        limit: 100,
        status: 'all'
      })

      // Get all subscriptions from database
      const { data: dbSubscriptions } = await supabase
        .from('subscription_orders')
        .select('stripe_subscription_id, status')
        .not('stripe_subscription_id', 'is', null)

      // Count mismatches
      let mismatches = 0

      // Check for Stripe subscriptions not in database
      for (const stripeSub of stripeSubscriptions.data) {
        const dbSub = dbSubscriptions?.find(s => s.stripe_subscription_id === stripeSub.id)
        if (!dbSub) {
          mismatches++
        } else {
          // Check if status matches
          const stripeStatus = mapStripeStatus(stripeSub.status)
          if (dbSub.status !== stripeStatus) {
            mismatches++
          }
        }
      }

      // Check for database subscriptions not in Stripe
      if (dbSubscriptions) {
        for (const dbSub of dbSubscriptions) {
          if (!dbSub.stripe_subscription_id?.startsWith('demo_')) {
            const exists = stripeSubscriptions.data.some(s => s.id === dbSub.stripe_subscription_id)
            if (!exists) {
              mismatches++
            }
          }
        }
      }

      healthCheck.outOfSyncCount = mismatches
    }

    // Determine overall health status
    if (!healthCheck.stripeConnected || !healthCheck.databaseConnected) {
      healthCheck.status = 'critical'
    } else if (healthCheck.outOfSyncCount > 5 || healthCheck.syncErrors > 0) {
      healthCheck.status = 'warning'
    } else {
      healthCheck.status = 'healthy'
    }

    return NextResponse.json(healthCheck)

  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({
      status: 'critical',
      stripeConnected: false,
      databaseConnected: false,
      webhooksActive: false,
      lastSync: null,
      syncErrors: 0,
      outOfSyncCount: 0
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