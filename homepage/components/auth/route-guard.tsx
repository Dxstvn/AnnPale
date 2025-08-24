"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: "customer" | "creator" | "admin"
  redirectTo?: string
}

export function RouteGuard({ 
  children, 
  requireAuth = true,
  requireRole,
  redirectTo = "/login"
}: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Replace with actual auth check
        const mockAuth = {
          isAuthenticated: false,
          user: null,
          role: null as string | null
        }

        // Check localStorage for demo auth
        const demoAuth = localStorage.getItem("demoAuth")
        if (demoAuth) {
          const parsed = JSON.parse(demoAuth)
          mockAuth.isAuthenticated = true
          mockAuth.user = parsed.user
          mockAuth.role = parsed.role
        }

        // Check authentication
        if (requireAuth && !mockAuth.isAuthenticated) {
          // Save intended destination
          localStorage.setItem("redirectAfterLogin", pathname)
          router.push(redirectTo)
          return
        }

        // Check role authorization
        if (requireRole && mockAuth.role !== requireRole) {
          // Redirect based on user's actual role
          if (mockAuth.role === "admin") {
            router.push("/admin/dashboard")
          } else if (mockAuth.role === "creator") {
            router.push("/creator/dashboard")
          } else {
            router.push("/")
          }
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push(redirectTo)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, requireAuth, requireRole, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

// HOC for protected pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireRole?: "customer" | "creator" | "admin"
    redirectTo?: string
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <RouteGuard {...options}>
        <Component {...props} />
      </RouteGuard>
    )
  }
}