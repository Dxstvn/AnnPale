import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get last sync log
    const { data: syncLog, error } = await supabase
      .from('sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error fetching sync log:', error)
      // Return empty result if table doesn't exist yet
      return NextResponse.json({
        checked: 0,
        synced: 0,
        errors: 0,
        mismatches: [],
        timestamp: null
      })
    }

    if (!syncLog || syncLog.length === 0) {
      return NextResponse.json({
        checked: 0,
        synced: 0,
        errors: 0,
        mismatches: [],
        timestamp: null
      })
    }

    // Parse the sync results
    const log = syncLog[0]
    const results = log.results || {
      checked: 0,
      synced: 0,
      errors: 0,
      mismatches: []
    }

    return NextResponse.json({
      ...results,
      timestamp: log.created_at
    })

  } catch (error) {
    console.error('Last sync error:', error)
    return NextResponse.json({
      checked: 0,
      synced: 0,
      errors: 0,
      mismatches: [],
      timestamp: null
    })
  }
}