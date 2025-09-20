"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: "fan" | "creator" | "admin"
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true,
  requireRole,
  redirectTo = "/login" 
}: AuthGuardProps) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useSupabaseAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    console.log('[AuthGuard] State:', { isLoading, isAuthenticated, userRole: user?.role, requireRole })
    
    // Wait for auth context to finish loading
    if (isLoading) {
      console.log('[AuthGuard] Auth context still loading...')
      return
    }

    // Auth context has loaded, now check authorization
    checkAuth()
  }, [isLoading, isAuthenticated, user, requireRole])

  const checkAuth = () => {
    console.log('[AuthGuard] Checking authorization...')
    
    // Check if authentication is required
    if (requireAuth && !isAuthenticated) {
      console.log('[AuthGuard] Not authenticated, redirecting to:', redirectTo)
      router.push(redirectTo)
      setIsChecking(false)
      return
    }
    
    // Check role requirement
    if (requireRole && user) {
      if (user.role !== requireRole) {
        console.log('[AuthGuard] Role mismatch - Required:', requireRole, 'User role:', user.role)
        // Redirect to appropriate dashboard based on role
        const redirectPath = 
          user.role === "admin" ? "/admin/dashboard" :
          user.role === "creator" ? "/creator/dashboard" :
          "/fan/dashboard"
        
        router.push(redirectPath)
        setIsChecking(false)
        return
      }
    }
    
    // All checks passed
    console.log('[AuthGuard] Authorization granted')
    setIsChecking(false)
  }

  // Show loading while auth context is loading or while checking authorization
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-2 text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and auth is required, don't render anything
  // (user is being redirected)
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // If role doesn't match, don't render anything
  // (user is being redirected)
  if (requireRole && user?.role !== requireRole) {
    return null
  }

  // Authorization successful, render children
  return <>{children}</>
}

// HOC for protecting pages
export function withAuth<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  options?: Omit<AuthGuardProps, "children">
) {
  return function ProtectedComponent(props: T) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}