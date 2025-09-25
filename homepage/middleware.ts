import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale, getLocaleFromCountry } from './i18n.config'

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

// Simple locale detection - URL based only
// Removing cookies and geolocation for simplicity

// Create the intl middleware with enhanced configuration
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always show locale in URL
  localeDetection: true // Enable detection from cookies and headers
})

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

  // Extract the locale from the pathname (if present)
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Get the pathname without locale for route checking
  const pathnameWithoutLocale = pathnameHasLocale
    ? pathname.split('/').slice(2).join('/') || '/'
    : pathname

  // Let the intl middleware handle the root path redirect
  // We don't need to manually redirect here as it causes conflicts

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
  console.log(`[Middleware] Path: ${pathname}, PathWithoutLocale: ${pathnameWithoutLocale}, User: ${user ? user.id : 'none'}, Error: ${error?.message || 'none'}`)

  // Check if route requires authentication (using path without locale)
  const isProtectedRoute = Object.keys(protectedRoutes).some(route =>
    pathnameWithoutLocale.startsWith(route)
  )
  const requiresAuth = isProtectedRoute || authRequiredRoutes.some(route => pathnameWithoutLocale.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(route + '/'))

  // If route requires auth and user is not authenticated
  if (requiresAuth && !user) {
    console.log(`[Middleware] Redirecting to login - no user for protected route: ${pathname}`)
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check for authenticated users without profiles (handles ProfileRedirect functionality)
  if (user && !isPublicRoute && pathnameWithoutLocale !== '/auth/role-selection') {
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
    // Find the matching protected route (using path without locale)
    const matchedRoute = Object.keys(protectedRoutes).find(route =>
      pathnameWithoutLocale.startsWith(route)
    )

    if (matchedRoute) {
      // Get user's role AND is_creator flag from the database (we know profile exists from earlier check)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_creator')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        console.error(`[Middleware] Error fetching profile for protected route: ${profileError?.message}`)
        // This shouldn't happen since we checked above, but redirect to role selection as fallback
        return NextResponse.redirect(new URL('/auth/role-selection', request.url))
      }

      const userRole = profile.role
      const allowedRoles = protectedRoutes[matchedRoute as keyof typeof protectedRoutes]

      // Check if user has access based on role OR dual-role status
      const hasAccess = allowedRoles.includes(userRole) ||
        (matchedRoute.startsWith('/creator') && profile.is_creator === true)

      if (!hasAccess) {
        console.log(`[Middleware] Access denied: User role ${userRole}, is_creator: ${profile.is_creator}, required roles: ${allowedRoles}`)
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
      if (pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(route + '/')) {
        return NextResponse.redirect(new URL(redirect, request.url))
      }
    }
  }

  // Apply internationalization to the response
  return intlMiddleware(request)
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