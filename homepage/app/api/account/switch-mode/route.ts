import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { mode } = await request.json()

    // Validate mode
    if (!mode || !['fan', 'creator'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "fan" or "creator"' },
        { status: 400 }
      )
    }

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Call the database function to switch mode
    const { data, error } = await supabase
      .rpc('switch_user_mode', { p_mode: mode })
      .single()

    if (error) {
      console.error('Error switching mode:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to switch mode' },
        { status: 400 }
      )
    }

    // Determine redirect URL based on mode
    const redirectUrl = mode === 'creator' ? '/creator/dashboard' : '/fan/home'

    return NextResponse.json({
      success: true,
      mode,
      message: data?.message || `Switched to ${mode} mode`,
      redirectUrl
    })

  } catch (error) {
    console.error('Unexpected error in switch-mode:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}