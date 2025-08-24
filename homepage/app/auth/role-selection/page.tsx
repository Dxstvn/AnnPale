"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSupabaseAuth } from '@/contexts/supabase-auth-context'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  Star, 
  DollarSign, 
  Heart, 
  Gift, 
  Video,
  Trophy,
  Sparkles,
  TrendingUp,
  Calendar,
  MessageCircle,
  Check
} from 'lucide-react'

export default function RoleSelectionPage() {
  const router = useRouter()
  const { supabaseUser, refreshSession } = useSupabaseAuth()
  const [isLoading, setIsLoading] = useState<'fan' | 'creator' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRoleSelection = async (role: 'fan' | 'creator') => {
    if (!supabaseUser) {
      setError('No authenticated user found. Please log in again.')
      router.push('/login')
      return
    }

    setIsLoading(role)
    setError(null)

    try {
      const supabase = createClient()
      
      // Create profile with selected role
      const profileData = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.full_name || 
              supabaseUser.user_metadata?.name || 
              supabaseUser.email?.split('@')[0] || 
              'User',
        role: role,
        avatar_url: supabaseUser.user_metadata?.avatar_url || 
                   supabaseUser.user_metadata?.picture || 
                   null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('[RoleSelection] Creating profile with role:', role)
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)

      if (profileError) {
        console.error('[RoleSelection] Profile creation error:', profileError)
        setError('Failed to create profile. Please try again.')
        setIsLoading(null)
        return
      }

      console.log('[RoleSelection] Profile created successfully')
      
      // Refresh the session to update the user context
      await refreshSession()
      
      // Redirect to appropriate dashboard
      const redirectPath = role === 'creator' ? '/creator/dashboard' : '/fan/dashboard'
      console.log('[RoleSelection] Redirecting to:', redirectPath)
      router.push(redirectPath)
      
    } catch (error) {
      console.error('[RoleSelection] Unexpected error:', error)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(null)
    }
  }

  const fanBenefits = [
    { icon: Heart, text: "Connect with your favorite Haitian celebrities" },
    { icon: Gift, text: "Send personalized video gifts to loved ones" },
    { icon: Star, text: "Get exclusive content from creators" },
    { icon: MessageCircle, text: "Request custom video messages" },
    { icon: Calendar, text: "Book videos for special occasions" },
    { icon: Sparkles, text: "Support Haitian talent and culture" }
  ]

  const creatorBenefits = [
    { icon: DollarSign, text: "Monetize your fame and talent" },
    { icon: Users, text: "Build a loyal fan community" },
    { icon: Video, text: "Create personalized videos on your schedule" },
    { icon: TrendingUp, text: "Track your earnings and growth" },
    { icon: Trophy, text: "Become a top creator on the platform" },
    { icon: Heart, text: "Share Haitian culture with the world" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Welcome to Ann Pale! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you'd like to experience our platform. You can always change this later in your settings.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Fan Card */}
          <Card className="relative overflow-hidden border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-bl-full opacity-50"></div>
            
            <div className="p-8 relative">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">I'm a Fan</h2>
              <p className="text-gray-600 mb-6">
                Connect with Haitian celebrities and request personalized video messages
              </p>

              <div className="space-y-3 mb-8">
                {fanBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleRoleSelection('fan')}
                disabled={isLoading !== null}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading === 'fan' ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Creating your profile...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Join as a Fan
                  </span>
                )}
              </Button>
            </div>
          </Card>

          {/* Creator Card */}
          <Card className="relative overflow-hidden border-2 hover:border-pink-300 transition-all duration-300 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-bl-full opacity-50"></div>
            
            <div className="p-8 relative">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">I'm a Creator</h2>
              <p className="text-gray-600 mb-6">
                Share your talent and earn money creating personalized videos for fans
              </p>

              <div className="space-y-3 mb-8">
                {creatorBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-pink-600" />
                    </div>
                    <span className="text-sm text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleRoleSelection('creator')}
                disabled={isLoading !== null}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading === 'creator' ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Creating your profile...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Join as a Creator
                  </span>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Need help deciding? You can always change your account type later in your profile settings.
          </p>
        </div>
      </div>
    </div>
  )
}