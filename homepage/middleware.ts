import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Define protected routes and their required roles
const protectedRoutes = {
  '/creator': ['creator', 'admin'],
  '/admin': ['admin'],
  '/fan': ['fan', 'creator', 'admin'],
  '/profile': ['fan', 'creator', 'admin'],
  '/orders': ['fan', 'creator', 'admin'],
  '/settings': ['fan', 'creator', 'admin']
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Skip middleware for auth callback and role selection routes
  if (path === '/auth/callback' || path === '/auth/role-selection') {
    return NextResponse.next()
  }
  
  // Create a response object that we'll modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client with proper cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Update both request and response cookies
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          // Remove from response cookies
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check if the path matches any protected route
  const protectedRoute = Object.keys(protectedRoutes).find(route => 
    path.startsWith(route)
  )
  
  if (protectedRoute) {
    // Get the user session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession()
    
    // Log for debugging
    console.log(`[Middleware] Path: ${path}, Session exists: ${!!session}, Error: ${error?.message || 'none'}`)
    
    if (!session) {
      // Redirect to login if not authenticated
      const url = new URL('/login', request.url)
      url.searchParams.set('from', path)
      return NextResponse.redirect(url)
    }
    
    // Verify the user is actually authenticated by calling getUser
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log(`[Middleware] User verification failed: ${userError?.message || 'No user'}`)
      // Session exists but user verification failed - clear session and redirect to login
      const url = new URL('/login', request.url)
      url.searchParams.set('from', path)
      return NextResponse.redirect(url)
    }
    
    // Get user profile to check role
    // Note: Due to RLS recursion issue, we'll be more permissive here
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    // Log the profile fetch result
    console.log(`[Middleware] Profile fetch for ${user.id}: ${profile ? 'found' : 'not found'}, error: ${profileError?.message || 'none'}`)
    
    if (profileError && profileError.message.includes('infinite recursion')) {
      // RLS issue - for now, allow access to fan routes for authenticated users
      console.log(`[Middleware] RLS recursion error - allowing fan access for authenticated user`)
      if (protectedRoute === '/admin' || protectedRoute === '/creator') {
        // Still restrict admin/creator routes
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
      // Allow fan routes
      return response
    }
    
    if (profile) {
      const userRole = profile.role
      const allowedRoles = protectedRoutes[protectedRoute as keyof typeof protectedRoutes]
      
      if (!allowedRoles.includes(userRole)) {
        // User doesn't have the required role
        console.log(`[Middleware] Role mismatch: User role ${userRole} not in ${allowedRoles}`)
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    } else {
      // No profile found, but user is authenticated
      // Default to fan access
      console.log(`[Middleware] No profile found for user ${user.id}, defaulting to fan access`)
      if (protectedRoute === '/admin' || protectedRoute === '/creator') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
  }
  
  return response
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all routes except static files and api routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}