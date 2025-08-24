#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dnimsnqxayjuqrbdfgqr.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaW1zbnF4YXlqdXFyYmRmZ3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MTM3NDUsImV4cCI6MjA1MTE4OTc0NX0.vEBHDpZQUHnFknhCiCQniDjCgOVOiKbEVJCpTw5pCKc'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuth() {
  console.log('Testing Supabase authentication...')
  
  // Check current session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    console.log('✅ User is authenticated')
    console.log('User ID:', session.user.id)
    console.log('Email:', session.user.email)
    
    // Check profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    if (profile) {
      console.log('✅ Profile found')
      console.log('Role:', profile.role)
      console.log('Name:', profile.name)
    } else {
      console.log('❌ No profile found')
      if (error) console.log('Error:', error.message)
    }
  } else {
    console.log('❌ No active session')
  }
}

testAuth().catch(console.error)