import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testOrderFetch() {
  // Get the most recent video request
  const { data: recentRequest, error: recentError } = await supabase
    .from('video_requests')
    .select(`
      *,
      creator:creator_id (
        id,
        display_name,
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (recentError) {
    console.error('Error fetching recent request:', recentError)
    return
  }

  if (recentRequest) {
    console.log('✅ Successfully fetched video request:')
    console.log('  ID:', recentRequest.id)
    console.log('  Status:', recentRequest.status)
    console.log('  Payment Intent:', recentRequest.payment_intent_id || 'Not set')
    console.log('  Creator:', recentRequest.creator?.display_name || recentRequest.creator?.username || 'N/A')
    console.log('  Price:', `$${recentRequest.price}`)
    console.log('  Created:', recentRequest.created_at)

    console.log('\n📝 To view this order, navigate to:')
    console.log(`  http://localhost:3000/en/fan/orders/${recentRequest.id}`)
  }
}

testOrderFetch().catch(console.error)