import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, error_description)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin)
    )
  }

  if (code) {
    const supabase = await createClient()
    
    try {
      console.log('Exchanging OAuth code for session...')
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Session exchange error:', sessionError)
        throw sessionError
      }

      if (!session?.user) {
        throw new Error('No user session created')
      }

      console.log('OAuth session created for user:', session.user.email)

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile check error:', profileError)
      }

      // Determine redirect URL based on profile
      let redirectTo = '/auth/role-selection' // Default for new users

      if (profile) {
        // Existing user - redirect based on role
        if (profile.role === 'admin') {
          redirectTo = '/admin/dashboard'
        } else if (profile.role === 'creator') {
          redirectTo = '/creator/dashboard'
        } else {
          redirectTo = '/fan/home'
        }
      } else {
        // New user - create profile with OAuth data
        const profileData = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || 
                session.user.user_metadata?.name || 
                session.user.email?.split('@')[0] || 
                'User',
          role: 'fan', // Default role for OAuth users
          avatar_url: session.user.user_metadata?.avatar_url || 
                     session.user.user_metadata?.picture || 
                     null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error: createError } = await supabase
          .from('profiles')
          .insert(profileData)

        if (createError) {
          console.error('Profile creation error:', createError)
          // Continue to role selection even if profile creation fails
        }
      }

      // Redirect to the appropriate page
      return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
    } catch (error) {
      console.error('OAuth callback error:', error)
      return NextResponse.redirect(
        new URL('/login?error=oauth_failed', requestUrl.origin)
      )
    }
  }

  // No code provided
  return NextResponse.redirect(
    new URL('/login?error=no_code', requestUrl.origin)
  )
}