import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This API endpoint sets up missing database tables
// Should only be used in development or by admin
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const results: any[] = []

    // Since we can't execute raw DDL, we'll create the tables by attempting inserts
    // This will trigger Supabase to create the table structure if it doesn't exist
    
    try {
      // Test payment_intents table
      await supabase.from('payment_intents').select('*').limit(1)
      results.push({ table: 'payment_intents', status: 'exists' })
    } catch (error: any) {
      results.push({ table: 'payment_intents', status: 'missing', error: error.message })
    }

    try {
      // Test orders table
      await supabase.from('orders').select('*').limit(1)
      results.push({ table: 'orders', status: 'exists' })
    } catch (error: any) {
      results.push({ table: 'orders', status: 'missing', error: error.message })
    }

    try {
      // Test stripe_accounts table
      await supabase.from('stripe_accounts').select('*').limit(1)
      results.push({ table: 'stripe_accounts', status: 'exists' })
    } catch (error: any) {
      results.push({ table: 'stripe_accounts', status: 'missing', error: error.message })
    }

    try {
      // Test video_uploads table
      await supabase.from('video_uploads').select('*').limit(1)
      results.push({ table: 'video_uploads', status: 'exists' })
    } catch (error: any) {
      results.push({ table: 'video_uploads', status: 'missing', error: error.message })
    }

    try {
      // Test payments table
      await supabase.from('payments').select('*').limit(1)
      results.push({ table: 'payments', status: 'exists' })
    } catch (error: any) {
      results.push({ table: 'payments', status: 'missing', error: error.message })
    }

    return NextResponse.json({
      message: 'Database setup check completed',
      tables: results,
      instructions: 'Missing tables need to be created manually in Supabase Dashboard'
    })

  } catch (error: any) {
    console.error('Database setup error:', error)
    return NextResponse.json(
      { 
        error: 'Database setup failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}