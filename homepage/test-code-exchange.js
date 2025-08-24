#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MTk4OTAsImV4cCI6MjA3MTM5NTg5MH0.zlQQHLmGBojPbw9GsSJqSpsWT9SlANPtEhZyEYKr4g0'

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