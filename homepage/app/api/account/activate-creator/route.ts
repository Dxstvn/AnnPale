import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Call the database function to activate creator features
    const { data, error } = await supabase
      .rpc('activate_creator_features')
      .single()

    if (error) {
      console.error('Error activating creator features:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to activate creator features' },
        { status: 400 }
      )
    }

    // If activation was successful, fetch the updated profile
    if (data?.success) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return NextResponse.json({
        success: true,
        message: data.message,
        profile,
        redirectUrl: '/creator/dashboard'
      })
    }

    // If already activated
    return NextResponse.json({
      success: false,
      message: data?.message || 'Creator features already activated',
      isCreator: true
    })

  } catch (error) {
    console.error('Unexpected error in activate-creator:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}