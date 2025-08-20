import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes and their required roles
const protectedRoutes = {
  '/creator': ['creator', 'admin'],
  '/admin': ['admin'],
  '/profile': ['customer', 'creator', 'admin'],
  '/orders': ['customer', 'creator', 'admin'],
  '/settings': ['customer', 'creator', 'admin']
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Check if the path matches any protected route
  const protectedRoute = Object.keys(protectedRoutes).find(route => 
    path.startsWith(route)
  )
  
  if (protectedRoute) {
    // Get the auth token from cookies (in production, this would be a JWT)
    const authToken = request.cookies.get('auth-token')
    
    if (!authToken) {
      // Redirect to login if not authenticated
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('from', path)
      return NextResponse.redirect(url)
    }
    
    // In production, decode the JWT to get user role
    // For now, we'll parse a simple JSON cookie
    try {
      const userData = JSON.parse(authToken.value)
      const userRole = userData.role
      const allowedRoles = protectedRoutes[protectedRoute as keyof typeof protectedRoutes]
      
      if (!allowedRoles.includes(userRole)) {
        // User doesn't have the required role
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    } catch (error) {
      // Invalid token, redirect to login
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('from', path)
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all routes except static files and api routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}