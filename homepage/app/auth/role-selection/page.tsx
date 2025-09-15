'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/contexts/supabase-auth-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  Video, 
  Star, 
  DollarSign,
  Mic,
  Camera,
  Heart,
  Gift,
  Loader2,
  Info
} from 'lucide-react'
import { toast } from 'sonner'

export default function RoleSelectionPage() {
  const router = useRouter()
  const { supabase } = useSupabaseAuth()
  const [selectedRole, setSelectedRole] = useState<'fan' | 'creator' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [supabase])

  const checkUser = async () => {
    if (!supabase) {
      console.error('Supabase client not available')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    // Check if profile already exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile) {
      // Profile already exists, redirect based on role
      if (profile.role === 'creator') {
        router.push('/creator/dashboard')
      } else if (profile.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/fan/dashboard')
      }
      return
    }

    setUser(user)
  }

  const handleRoleSelection = async (role: 'fan' | 'creator') => {
    if (!user) return
    
    setIsLoading(true)
    setSelectedRole(role)

    try {
      // Create profile with selected role
      const profileData = {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || 
              user.user_metadata?.name || 
              user.email?.split('@')[0] || 
              'User',
        role: role,
        avatar_url: user.user_metadata?.avatar_url || 
                   user.user_metadata?.picture || 
                   null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('profiles')
        .insert(profileData)

      if (error) {
        console.error('Profile creation error:', error)
        toast.error('Failed to create profile. Please try again.')
        setIsLoading(false)
        setSelectedRole(null)
        return
      }

      toast.success(`Welcome as a ${role === 'creator' ? 'Creator' : 'Fan'}!`)
      
      // Redirect based on role
      if (role === 'creator') {
        router.push('/creator/dashboard')
      } else {
        router.push('/fan/dashboard')
      }
    } catch (error) {
      console.error('Role selection error:', error)
      toast.error('An error occurred. Please try again.')
      setIsLoading(false)
      setSelectedRole(null)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome to Ann Pale! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Choose how you want to use our platform
          </p>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            You can always switch between fan and creator modes later in your settings.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Fan Card */}
          <Card 
            className={`cursor-pointer transition-all hover:shadow-xl ${
              selectedRole === 'fan' ? 'ring-2 ring-purple-600' : ''
            }`}
            onClick={() => !isLoading && handleRoleSelection('fan')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Heart className="h-6 w-6 text-pink-600" />
                I'm a Fan
              </CardTitle>
              <CardDescription>
                Get personalized video messages from your favorite Haitian celebrities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span className="text-sm">Request custom video messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <Gift className="h-5 w-5 text-purple-600 mt-0.5" />
                  <span className="text-sm">Send gifts to friends and family</span>
                </li>
                <li className="flex items-start gap-2">
                  <Video className="h-5 w-5 text-blue-600 mt-0.5" />
                  <span className="text-sm">Watch exclusive content</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Connect with your favorite stars</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRoleSelection('fan')
                }}
              >
                {isLoading && selectedRole === 'fan' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Join as a Fan'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Creator Card */}
          <Card 
            className={`cursor-pointer transition-all hover:shadow-xl ${
              selectedRole === 'creator' ? 'ring-2 ring-purple-600' : ''
            }`}
            onClick={() => !isLoading && handleRoleSelection('creator')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Camera className="h-6 w-6 text-purple-600" />
                I'm a Creator
              </CardTitle>
              <CardDescription>
                Share your talent and connect with fans through personalized videos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Earn money from your content</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mic className="h-5 w-5 text-red-600 mt-0.5" />
                  <span className="text-sm">Create personalized messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <span className="text-sm">Build your fanbase</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span className="text-sm">Set your own prices</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRoleSelection('creator')
                }}
              >
                {isLoading && selectedRole === 'creator' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Join as a Creator'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}