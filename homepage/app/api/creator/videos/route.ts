import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// GET: Fetch creator's completed video requests for selection
export async function GET(request: NextRequest) {
  try {
    console.log('[Videos API] Starting GET request')
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Ignore - called from Server Component
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Ignore - called from Server Component
            }
          },
        },
      }
    )
    console.log('[Videos API] Supabase client created')

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[Videos API] Auth error:', authError)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('[Videos API] Authenticated user:', user.id)

    // Check if user is a creator
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_creator')
      .eq('id', user.id)
      .single()

    console.log('[Videos API] Profile fetch result:', { profile, error: profileError })

    if (profileError) {
      console.error('[Videos API] Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      )
    }

    // Check if user is a creator (either by role or is_creator flag)
    if (!profile || (profile.role !== 'creator' && !profile.is_creator)) {
      console.error('[Videos API] Access denied - user role:', profile?.role, 'is_creator:', profile?.is_creator)
      return NextResponse.json(
        { error: 'Creator access required' },
        { status: 403 }
      )
    }

    // Fetch creator's completed video requests
    const { data: videoRequests, error } = await supabase
      .from('video_requests')
      .select(`
        id,
        request_type,
        recipient_name,
        instructions,
        video_url,
        thumbnail_url,
        duration,
        completed_at,
        rating,
        review,
        status,
        price,
        created_at
      `)
      .eq('creator_id', user.id)
      .eq('status', 'completed')
      .not('video_url', 'is', null)
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('Error fetching video requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch video requests' },
        { status: 500 }
      )
    }

    return NextResponse.json(videoRequests || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}