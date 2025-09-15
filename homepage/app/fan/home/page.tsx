"use client"

import { useState, useEffect } from "react"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { RealContentFeed } from "@/components/feed/real-content-feed"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Star, TrendingUp, Heart } from "lucide-react"
import Link from "next/link"

export default function FanHomePage() {
  const { user, isLoading, isAuthenticated } = useSupabaseAuth()
  const [userSubscriptions, setUserSubscriptions] = useState<{ creator_id: string; tier_id: string }[]>([])
  const [subscriptionStats, setSubscriptionStats] = useState({
    total: 0,
    active: 0,
    totalSpent: 0
  })

  // Load user subscriptions if authenticated
  useEffect(() => {
    const loadSubscriptions = async () => {
      if (!isAuthenticated || !user) return
      
      try {
        const response = await fetch('/api/subscriptions/manage')
        if (response.ok) {
          const data = await response.json()
          setUserSubscriptions(data.subscriptions || [])
          
          // Calculate stats
          const active = data.subscriptions?.filter((sub: any) => sub.status === 'active').length || 0
          const totalSpent = data.subscriptions?.reduce((sum: number, sub: any) => sum + (sub.amount || 0), 0) || 0
          
          setSubscriptionStats({
            total: data.subscriptions?.length || 0,
            active,
            totalSpent
          })
        }
      } catch (error) {
        console.error('Failed to load subscriptions:', error)
      }
    }

    loadSubscriptions()
  }, [isAuthenticated, user])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isAuthenticated ? `Welcome back, ${user?.email?.split('@')[0]}!` : 'Welcome to Ann Pale'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isAuthenticated 
                  ? "Discover exclusive content from your favorite Haitian creators"
                  : "Sign in to access exclusive content from Haitian creators"
                }
              </p>
            </div>
            
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Subscription Stats for authenticated users */}
          {isAuthenticated && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{subscriptionStats.total}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Subscriptions</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{subscriptionStats.active}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Active</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">${subscriptionStats.totalSpent}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Link href="/fan/subscriptions">
                    <Button className="w-full" size="sm">
                      Manage Subscriptions
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Main Content Feed */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <RealContentFeed
            isAuthenticated={isAuthenticated}
            userId={user?.id}
            userSubscriptions={userSubscriptions}
            excludeLockedContent={true}
          />
        </div>

        {/* Footer CTA for non-authenticated users */}
        {!isAuthenticated && (
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Ready to Connect with Haitian Creators?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Sign up to access exclusive content, live streams, and personalized video messages 
                  from your favorite Haitian celebrities and creators.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="gap-2">
                      <Heart className="h-5 w-5" />
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/browse">
                    <Button variant="outline" size="lg">
                      Browse Creators
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}