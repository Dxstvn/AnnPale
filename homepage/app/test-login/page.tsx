'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Video, 
  Heart, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  User,
  Key,
  Zap
} from 'lucide-react'

export default function TestLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const testAccounts = [
    {
      role: 'creator',
      title: 'Test Creator Account',
      description: 'Access creator dashboard, streaming tools, and analytics',
      icon: Video,
      color: 'from-purple-600 to-pink-600',
      features: [
        'Stream Management',
        'Analytics Dashboard',
        'Fan Messages',
        'Earnings Overview'
      ]
    },
    {
      role: 'fan',
      title: 'Test Fan Account',
      description: 'Browse streams, watch content, and interact with creators',
      icon: Heart,
      color: 'from-blue-600 to-purple-600',
      features: [
        'Watch Live Streams',
        'Browse Creators',
        'Send Messages',
        'View Orders'
      ]
    },
    {
      role: 'admin',
      title: 'Test Admin Account',
      description: 'Full admin access to manage platform and users',
      icon: Shield,
      color: 'from-red-600 to-orange-600',
      features: [
        'User Management',
        'Content Moderation',
        'System Settings',
        'Analytics'
      ]
    }
  ]

  const handleTestLogin = async (role: string) => {
    setLoading(role)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/auth/test-login?role=${role}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }

      setSuccess(`Successfully logged in as ${role}!`)
      
      // Redirect based on role
      setTimeout(() => {
        if (role === 'creator') {
          router.push('/creator/streaming/test')
        } else if (role === 'fan') {
          router.push('/fan/livestreams')
        } else if (role === 'admin') {
          router.push('/admin/dashboard')
        }
      }, 1500)
    } catch (err) {
      console.error('Test login error:', err)
      setError(err instanceof Error ? err.message : 'Failed to login')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <Badge className="mb-4 bg-yellow-500 text-white border-0">
            <Zap className="h-3 w-3 mr-1" />
            Development Mode
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Test Account Login
          </h1>
          <p className="text-lg text-gray-600">
            Quick access to different user roles for testing
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <Alert className="mb-6 max-w-2xl mx-auto border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 max-w-2xl mx-auto border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Warning Alert */}
        <Alert className="mb-8 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Development Only:</strong> These test accounts are only available in development mode. 
            They will automatically create necessary database records for testing.
          </AlertDescription>
        </Alert>

        {/* Test Account Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testAccounts.map((account) => {
            const Icon = account.icon
            const isLoading = loading === account.role
            
            return (
              <Card 
                key={account.role}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${account.color}`} />
                
                <CardHeader>
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${account.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{account.title}</CardTitle>
                  <CardDescription>{account.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Features List */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-600">Access to:</p>
                    <ul className="space-y-1">
                      {account.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Credentials Info */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                    <div className="flex items-center text-xs text-gray-600">
                      <User className="h-3 w-3 mr-1" />
                      <span className="font-mono">{account.role}@annpale.test</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Key className="h-3 w-3 mr-1" />
                      <span className="font-mono">testpassword123!</span>
                    </div>
                  </div>

                  {/* Login Button */}
                  <Button
                    className={`w-full bg-gradient-to-r ${account.color} text-white hover:opacity-90`}
                    onClick={() => handleTestLogin(account.role)}
                    disabled={loading !== null}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Login as {account.role.charAt(0).toUpperCase() + account.role.slice(1)}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Or navigate directly to:
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/creator/streaming/test')}
            >
              Creator Stream Test
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/fan/livestreams')}
            >
              Fan Livestreams
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/live/watch/test-stream')}
            >
              Watch Test Stream
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}