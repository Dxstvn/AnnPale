import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      return NextResponse.json({ 
        error: error.message,
        hasSession: false 
      }, { status: 500 })
    }
    
    if (session) {
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      return NextResponse.json({
        hasSession: true,
        user: {
          id: session.user.id,
          email: session.user.email,
          provider: session.user.app_metadata.provider
        },
        profile: profile || null
      })
    }
    
    return NextResponse.json({ 
      hasSession: false,
      message: 'No active session'
    })
  } catch (err) {
    return NextResponse.json({ 
      error: 'Server error',
      message: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}