#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Get the code from command line argument
const code = process.argv[2]

if (!code) {
  console.error('Please provide a code as argument')
  console.log('Usage: node test-code-exchange.js <code>')
  process.exit(1)
}

async function testCodeExchange() {
  console.log('Testing code exchange...')
  console.log('Code:', code)
  console.log('URL:', supabaseUrl)
  console.log('')
  
  try {
    console.log('Starting exchange at:', new Date().toISOString())
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Exchange completed at:', new Date().toISOString())
    
    if (error) {
      console.error('❌ Exchange failed:', error.message)
      console.error('Error details:', error)
    } else if (data?.session) {
      console.log('✅ Exchange successful!')
      console.log('User ID:', data.session.user.id)
      console.log('Email:', data.session.user.email)
      console.log('Provider:', data.session.user.app_metadata.provider)
    } else {
      console.log('❌ No session data returned')
    }
  } catch (err) {
    console.error('❌ Exception during exchange:', err.message)
    console.error(err)
  }
}

testCodeExchange()