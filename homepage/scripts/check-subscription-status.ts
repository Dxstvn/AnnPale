import { createClient } from '@/lib/supabase/server'

async function checkSubscriptionStatus() {
  try {
    const supabase = await createClient()

    // Check recent subscription orders for the user
    const { data, error } = await supabase
      .from('subscription_orders')
      .select(`
        id,
        status,
        cancelled_at,
        updated_at,
        stripe_subscription_id,
        creator:profiles!subscription_orders_creator_id_fkey(name, username)
      `)
      .eq('user_id', 'c948265a-fb81-4c40-be8d-8dd536433738')
      .order('updated_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error fetching subscriptions:', error)
      return
    }

    console.log('Recent subscription orders:')
    console.log(JSON.stringify(data, null, 2))

    // Also check webhook events
    const { data: webhookData, error: webhookError } = await supabase
      .from('webhook_events')
      .select('*')
      .order('processed_at', { ascending: false })
      .limit(5)

    if (!webhookError) {
      console.log('\nRecent webhook events:')
      console.log(JSON.stringify(webhookData, null, 2))
    }

  } catch (error) {
    console.error('Script error:', error)
  }
}

checkSubscriptionStatus()