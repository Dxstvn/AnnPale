import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    
    // Sign out the user
    await supabase.auth.signOut()
    
    // Create response that clears cookies and redirects
    const response = NextResponse.json({ success: true })
    
    // Clear auth cookies
    response.cookies.set('sb-access-token', '', {
      path: '/',
      maxAge: 0,
    })
    response.cookies.set('sb-refresh-token', '', {
      path: '/',
      maxAge: 0,
    })
    
    return response
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 })
  }
}

export async function GET() {
  // For GET requests, redirect to home after signing out
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  }
}