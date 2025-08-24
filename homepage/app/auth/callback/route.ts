import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/fan/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const state = searchParams.get('state')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    
    // Special handling for Twitter email error
    if (errorDescription?.includes('Error getting user email from external provider')) {
      // Twitter doesn't always provide email - this is expected
      // Continue with the authentication flow anyway
      console.log('Twitter OAuth: Email not provided by Twitter, continuing anyway...')
      // Don't return here - let the code continue to check for the code parameter
    } else {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(errorDescription || error)}`
      )
    }
  }

  if (code) {
    try {
      const supabase = await createClient()
      
      // Exchange the code for a session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
        )
      }

      if (!data?.user) {
        console.error('No user data after code exchange')
        return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
      }

      console.log('Successfully authenticated user:', data.user.email)

      // Try to get role from state parameter
      let intendedRole: 'fan' | 'creator' | 'admin' = 'fan'
      
      // Parse state parameter to get intended role
      if (state) {
        try {
          const decodedState = decodeURIComponent(state)
          const stateData = JSON.parse(atob(decodedState))
          intendedRole = stateData.role || 'fan'
          console.log('Role from OAuth state parameter:', intendedRole)
        } catch (e) {
          console.warn('Failed to parse OAuth state, defaulting to fan:', e)
          intendedRole = 'fan'
        }
      } else {
        console.log('No state parameter provided, defaulting to fan role')
      }

      // Check if user is admin (overrides intended role)
      const adminEmails = ['jasmindustin@gmail.com', 'loicjasmin@gmail.com']
      const isAdmin = adminEmails.includes(data.user.email || '')
      const userRole = isAdmin ? 'admin' : intendedRole
      
      console.log('Determined user role:', userRole, 'Is admin:', isAdmin)

      // Check if user has a profile to determine redirect
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      console.log('Profile fetch result:', { profile, error: profileError?.message, code: profileError?.code })

      // If profile doesn't exist, redirect to role selection page
      if (profileError && profileError.code === 'PGRST116') {
        console.log('Profile not found, redirecting to role selection page')
        
        // Admin users should have profiles created automatically
        if (isAdmin) {
          console.log('Admin user without profile, creating profile automatically')
          const userMetadata = data.user.user_metadata
          const profileData = {
            id: data.user.id,
            email: data.user.email,
            name: userMetadata?.full_name || 
                  userMetadata?.name || 
                  data.user.email?.split('@')[0] || 
                  'Admin',
            role: 'admin',
            avatar_url: userMetadata?.avatar_url || userMetadata?.picture || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          const { error: createError } = await supabase
            .from('profiles')
            .insert(profileData)
          
          if (createError) {
            console.error('Admin profile creation error:', createError)
          }
          
          // Redirect admin to admin dashboard
          const adminRedirectUrl = isLocalEnv 
            ? `${origin}/admin/dashboard`
            : forwardedHost 
              ? `https://${forwardedHost}/admin/dashboard`
              : `${origin}/admin/dashboard`
          
          return NextResponse.redirect(adminRedirectUrl)
        }
        
        // Non-admin users without profiles should choose their role
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const roleSelectionUrl = isLocalEnv 
          ? `${origin}/auth/role-selection`
          : forwardedHost 
            ? `https://${forwardedHost}/auth/role-selection`
            : `${origin}/auth/role-selection`
        
        console.log('Redirecting to role selection:', roleSelectionUrl)
        return NextResponse.redirect(roleSelectionUrl)
      } else if (profileError) {
        console.error('Profile fetch error:', profileError)
        // For other errors, redirect to role selection to be safe
        const roleSelectionUrl = isLocalEnv 
          ? `${origin}/auth/role-selection`
          : forwardedHost 
            ? `https://${forwardedHost}/auth/role-selection`
            : `${origin}/auth/role-selection`
        
        return NextResponse.redirect(roleSelectionUrl)
      }

      // Log the profile for debugging
      console.log('User profile:', profile)
      console.log('User email:', data.user.email)
      console.log('Is admin email?:', isAdmin)

      // For existing users, use their profile role. For new users, use the determined role
      const finalRole = profile?.role || userRole
      
      // Determine redirect path based on role
      const redirectPath = 
        finalRole === 'admin' ? '/admin/dashboard' :
        finalRole === 'creator' ? '/creator/dashboard' :
        next.startsWith('/') ? next : '/fan/dashboard'
      
      console.log(`Redirecting user with role '${finalRole}' to: ${redirectPath}`)

      // Add a small delay to ensure the session is properly set
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Handle redirect based on environment
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      // Build the final redirect URL
      const finalRedirectUrl = isLocalEnv 
        ? `${origin}${redirectPath}`
        : forwardedHost 
          ? `https://${forwardedHost}${redirectPath}`
          : `${origin}${redirectPath}`
      
      console.log('Final redirect URL:', finalRedirectUrl)
      return NextResponse.redirect(finalRedirectUrl)
      
    } catch (error) {
      console.error('Unexpected error during authentication:', error)
      return NextResponse.redirect(`${origin}/login?error=An unexpected error occurred`)
    }
  }

  // No code parameter, redirect to login
  console.log('No authorization code received')
  return NextResponse.redirect(`${origin}/login?error=No authorization code received`)
}