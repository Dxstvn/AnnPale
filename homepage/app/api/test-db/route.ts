import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test auth connection first (this should always work if configured correctly)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError && authError.message !== 'Auth session missing!') {
      throw authError
    }
    
    // The fact we got here means Supabase is connected
    // Now let's try to query any potential tables
    const { data, error } = await supabase
      .from('users')  // Try a common table name
      .select('count')
      .limit(1)
    
    if (error && (error.code === 'PGRST205' || error.code === '42P01')) {
      // Table doesn't exist, but connection works
      return NextResponse.json({
        success: true,
        message: 'Successfully connected to Supabase!',
        details: 'Database connection established. No tables exist yet - ready for schema creation.',
        connectionInfo: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          connected: true,
          authenticated: false,
          tablesExist: false
        }
      })
    }
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase!',
      details: 'Database connection verified with existing tables',
      connectionInfo: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        connected: true,
        authenticated: !!user,
        tablesExist: true
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to Supabase',
      error: error instanceof Error ? error.message : 'Unknown error',
      connectionInfo: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        connected: false
      }
    }, { status: 500 })
  }
}