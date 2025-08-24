"use client"

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldOff, ArrowLeft, Home } from 'lucide-react'
import { useSupabaseAuth } from '@/contexts/supabase-auth-context'
import { getDashboardPath } from '@/types/auth'

export default function UnauthorizedPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useSupabaseAuth()
  
  const requiredRole = searchParams.get('required')
  const minimumRole = searchParams.get('minimum')
  
  const handleGoBack = () => {
    router.back()
  }
  
  const handleGoToDashboard = () => {
    if (user) {
      router.push(getDashboardPath(user.role))
    } else {
      router.push('/')
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldOff className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Access Denied
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            {requiredRole && (
              <>You need <strong>{requiredRole}</strong> privileges to access this page.</>
            )}
            {minimumRole && (
              <>You need at least <strong>{minimumRole}</strong> privileges to access this page.</>
            )}
            {!requiredRole && !minimumRole && (
              <>You don't have permission to access this page.</>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              {user ? (
                <>
                  You are currently logged in as a <strong>{user.role}</strong>.
                  If you believe you should have access to this page, please contact support.
                </>
              ) : (
                <>
                  You are not currently logged in. Please sign in to continue.
                </>
              )}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={handleGoToDashboard}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Home className="h-4 w-4 mr-2" />
              {user ? 'My Dashboard' : 'Home'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}