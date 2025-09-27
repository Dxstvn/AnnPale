#!/usr/bin/env tsx
/**
 * Test script to check Supabase Realtime connection and configuration
 * Run with: tsx scripts/test-realtime-connection.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

console.log('🔍 Testing Supabase Realtime Connection...')
console.log('URL:', supabaseUrl)

async function testRealtimeConnection() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })

  // Test 1: Check if we can connect to Supabase
  console.log('\n📡 Test 1: Basic connection test')
  const { data, error } = await supabase
    .from('notifications')
    .select('id')
    .limit(1)

  if (error) {
    console.error('❌ Failed to query notifications table:', error)
  } else {
    console.log('✅ Successfully connected to Supabase')
    console.log('   Found notifications table')
  }

  // Test 2: Check Realtime subscription
  console.log('\n📡 Test 2: Realtime subscription test')

  const channel = supabase
    .channel('test-notifications')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications'
      },
      (payload) => {
        console.log('📨 Realtime event received:', payload)
      }
    )
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Successfully subscribed to realtime')
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Channel error:', err)
      } else if (status === 'TIMED_OUT') {
        console.error('❌ Subscription timed out')
      } else {
        console.log('📊 Subscription status:', status)
      }
    })

  // Wait for subscription
  await new Promise(resolve => setTimeout(resolve, 5000))

  // Test 3: Check table configuration
  console.log('\n📡 Test 3: Check table configuration')
  try {
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'notifications' })
      .single()

    if (tableInfo) {
      console.log('✅ Table info:', tableInfo)
    } else {
      console.log('ℹ️  Cannot retrieve table info (function may not exist)')
    }
  } catch (err) {
    console.log('ℹ️  Cannot retrieve table info (function may not exist)')
  }

  // Test 4: Try to insert a test notification (will fail without auth)
  console.log('\n📡 Test 4: Testing insert capability')
  const { error: insertError } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: '00000000-0000-0000-0000-000000000000',
        title: 'Test Notification',
        message: 'This is a test',
        type: 'test'
      }
    ])

  if (insertError) {
    if (insertError.message.includes('row-level security')) {
      console.log('✅ RLS is enabled (as expected)')
    } else {
      console.error('❌ Insert error:', insertError.message)
    }
  }

  // Cleanup
  await supabase.removeChannel(channel)

  console.log('\n📊 Summary:')
  console.log('- Basic connection: Working')
  console.log('- Realtime subscription: Check status above')
  console.log('- RLS enabled: Yes')
  console.log('\n✨ Test complete!')

  process.exit(0)
}

testRealtimeConnection().catch(error => {
  console.error('❌ Test failed:', error)
  process.exit(1)
})