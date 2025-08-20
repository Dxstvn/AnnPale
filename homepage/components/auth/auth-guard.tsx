"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: "customer" | "creator" | "admin"
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true,
  requireRole,
  redirectTo = "/login" 
}: AuthGuardProps) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Simulate auth check - in real app, this would check session/token
      const isAuthenticated = localStorage.getItem("auth_token") !== null
      const userRole = localStorage.getItem("user_role") as "customer" | "creator" | "admin" | null
      
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo)
        return
      }
      
      if (requireRole && userRole !== requireRole) {
        // Redirect to appropriate dashboard based on role
        if (userRole === "admin") {
          router.push("/admin/dashboard")
        } else if (userRole === "creator") {
          router.push("/creator/dashboard")
        } else {
          router.push("/browse")
        }
        return
      }
      
      setAuthorized(true)
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push(redirectTo)
    } finally {
      setChecking(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

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