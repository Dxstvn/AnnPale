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

  // Check if table exists
  const { data: tables, error: tableError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_name', 'notifications')

  if (tableError) {
    console.error('Error checking tables:', tableError)
    return
  }

  console.log('Table exists:', tables && tables.length > 0)

  // Get column information
  const { data: columns, error: columnsError } = await supabase.rpc('get_table_columns', {
    table_name_param: 'notifications'
  }).catch(() => ({ data: null, error: 'RPC not found' }))

  // Alternative approach - query notifications table structure
  console.log('\nTrying to query notifications table directly...')

  const { error: queryError } = await supabase
    .from('notifications')
    .select('*')
    .limit(0)

  if (!queryError) {
    console.log('✅ Notifications table exists and is accessible')
  } else {
    console.log('❌ Error accessing notifications table:', queryError.message)
    if (queryError.message.includes('column') && queryError.message.includes('does not exist')) {
      console.log('\n⚠️  The table exists but seems to be missing expected columns')
      console.log('This might mean the migration wasn\'t fully applied')
    }
  }

  // Try to check triggers
  console.log('\nChecking triggers on video_requests table...')
  const { data: triggers, error: triggerError } = await supabase.rpc('get_table_triggers', {
    table_name_param: 'video_requests'
  }).catch(() => ({ data: null, error: 'RPC not found' }))

  if (triggers) {
    console.log('Triggers found:', triggers)
  }
}

// Create RPC functions if they don't exist
async function createHelperFunctions() {
  console.log('Creating helper functions...\n')

  await supabase.rpc('exec_sql', {
    sql_query: `
      CREATE OR REPLACE FUNCTION get_table_columns(table_name_param text)
      RETURNS TABLE(column_name text, data_type text)
      LANGUAGE sql
      STABLE
      AS $$
        SELECT column_name::text, data_type::text
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = table_name_param
        ORDER BY ordinal_position;
      $$;
    `
  }).catch(() => {})

  await supabase.rpc('exec_sql', {
    sql_query: `
      CREATE OR REPLACE FUNCTION get_table_triggers(table_name_param text)
      RETURNS TABLE(trigger_name text)
      LANGUAGE sql
      STABLE
      AS $$
        SELECT trigger_name::text
        FROM information_schema.triggers
        WHERE event_object_table = table_name_param
        AND event_object_schema = 'public';
      $$;
    `
  }).catch(() => {})
}

checkNotificationsTable().catch(console.error)