import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Improved Supabase-first middleware following best practices
 */
export async function middleware(request: NextRequest) {
  // TEMPORARILY DISABLED FOR TESTING - uncomment when ready
  // return NextResponse.next()
  
  const path = request.nextUrl.pathname
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/auth/callback',
    '/auth/role-selection',
    '/forgot-password',
    '/reset-password'
  ]
  
  // Skip middleware for public routes and static assets
  if (
    publicRoutes.includes(path) ||
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/static') ||
    path.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Create response and supabase client
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createClient()
  
  try {
    // Get current session using Supabase's built-in method
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('[Middleware] Session error:', error)
      return redirectToLogin(request.url, path)
    }
    
    if (!session?.user) {
      console.log('[Middleware] No session found, redirecting to login')
      return redirectToLogin(request.url, path)
    }
    
    // Get user profile to check role-based access
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
    
    if (!profile) {
      console.log('[Middleware] No profile found, redirecting to role selection')
      return NextResponse.redirect(new URL('/auth/role-selection', request.url))
    }
    
    // Check role-based access
    if (path.startsWith('/admin') && profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    if (path.startsWith('/creator') && !['creator', 'admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    if (path.startsWith('/fan') && !['fan', 'creator', 'admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    return response
    
  } catch (error) {
    console.error('[Middleware] Unexpected error:', error)
    return redirectToLogin(request.url, path)
  }
}

function redirectToLogin(currentUrl: string, path: string) {
  const loginUrl = new URL('/login', currentUrl)
  loginUrl.searchParams.set('from', path)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}