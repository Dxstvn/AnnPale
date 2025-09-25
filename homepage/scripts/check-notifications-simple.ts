#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkNotificationsTable() {
  console.log('Checking notifications table...\n')

  // Try to query notifications table
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .limit(1)

  if (error) {
    console.log('❌ Error accessing notifications table:')
    console.log('   Code:', error.code)
    console.log('   Message:', error.message)
    console.log('   Hint:', error.hint)

    if (error.code === 'PGRST204' || error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('\n⚠️  The notifications table does not exist!')
      console.log('Need to run the migration to create it.')
    }
  } else {
    console.log('✅ Notifications table exists!')
    console.log('Sample data:', data)
  }

  // Check video_requests table
  console.log('\n\nChecking video_requests table...')
  const { data: videoRequests, error: videoError } = await supabase
    .from('video_requests')
    .select('*')
    .limit(1)

  if (videoError) {
    console.log('❌ Error accessing video_requests table:', videoError.message)
  } else {
    console.log('✅ Video requests table exists!')
  }
}

checkNotificationsTable().catch(console.error)