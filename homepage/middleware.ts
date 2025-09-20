import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'

// Define protected routes and their required roles
const protectedRoutes = {
  '/creator': ['creator', 'admin'],
  '/admin': ['admin'],
  '/fan': ['fan', 'creator', 'admin'],
  '/profile': ['fan', 'creator', 'admin'],
  '/orders': ['fan', 'creator', 'admin'],
  '/settings': ['fan', 'creator', 'admin']
}

// Routes that require authentication but no specific role
const authRequiredRoutes = [
  '/logout'
]

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/browse',
  '/auth/callback',
  '/auth/role-selection',
  '/test-auth-flow'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/auth/callback')
  ) {
    return NextResponse.next()
  }

  // Create response to modify
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client with middleware-specific handling
  const supabase = createMiddlewareClient(request, response)

  // CRITICAL: Refresh session and update cookies
  // This ensures tokens are always fresh and properly stored
  const { data: { user }, error } = await supabase.auth.getUser()

  // Log for debugging
  console.log(`[Middleware] Path: ${pathname}, User: ${user ? user.id : 'none'}, Error: ${error?.message || 'none'}`)

  // Check if route requires authentication
  const isProtectedRoute = Object.keys(protectedRoutes).some(route =>
    pathname.startsWith(route)
  )
  const requiresAuth = isProtectedRoute || authRequiredRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  // If route requires auth and user is not authenticated
  if (requiresAuth && !user) {
    console.log(`[Middleware] Redirecting to login - no user for protected route: ${pathname}`)
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check for authenticated users without profiles (handles ProfileRedirect functionality)
  if (user && !isPublicRoute && pathname !== '/auth/role-selection') {
    // Get user's profile to check if they need role selection
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()

    // If no profile exists, redirect to role selection
    if (profileError?.code === 'PGRST116' || !profile) {
      console.log(`[Middleware] User ${user.id} has no profile, redirecting to role selection`)
      return NextResponse.redirect(new URL('/auth/role-selection', request.url))
    }
  }

  // If user is authenticated and route has role requirements
  if (user && isProtectedRoute) {
    // Find the matching protected route
    const matchedRoute = Object.keys(protectedRoutes).find(route =>
      pathname.startsWith(route)
    )

    if (matchedRoute) {
      // Get user's role from the database (we know profile exists from earlier check)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        console.error(`[Middleware] Error fetching profile for protected route: ${profileError?.message}`)
        // This shouldn't happen since we checked above, but redirect to role selection as fallback
        return NextResponse.redirect(new URL('/auth/role-selection', request.url))
      }

      const userRole = profile.role
      const allowedRoles = protectedRoutes[matchedRoute as keyof typeof protectedRoutes]

      if (!allowedRoles.includes(userRole)) {
        console.log(`[Middleware] Role mismatch: User role ${userRole} not in ${allowedRoles}`)
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
  }

  // Handle livestreaming feature flag
  if (process.env.NEXT_PUBLIC_ENABLE_LIVESTREAMING !== 'true') {
    const livestreamRedirects: Record<string, string> = {
      '/creator/streaming': '/creator/dashboard',
      '/admin/streaming': '/admin/dashboard',
      '/fan/livestreams': '/fan/dashboard',
      '/live': '/',
    }

    for (const [route, redirect] of Object.entries(livestreamRedirects)) {
      if (pathname === route || pathname.startsWith(route + '/')) {
        return NextResponse.redirect(new URL(redirect, request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\..*|auth/callback).*)',
  ],
}