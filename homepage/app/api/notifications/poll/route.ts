import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/server'

// Polling endpoint for notifications
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const url = new URL(request.url)
    const since = url.searchParams.get('since') // ISO timestamp
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)

    // Build query
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    // If since timestamp provided, only get newer notifications
    if (since) {
      query = query.gt('created_at', since)
    }

    const { data: notifications, error } = await query

    if (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    return NextResponse.json({
      notifications: notifications || [],
      unreadCount: unreadCount || 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Notification poll error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}