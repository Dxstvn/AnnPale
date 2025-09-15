"use client"

import { useState, useEffect } from "react"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { RealContentFeed } from "@/components/feed/real-content-feed"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface SubscribedCreator {
  id: string
  username: string
  display_name: string
  avatar_url: string
  category?: string
}

export default function FanHomePage() {
  const { user, isLoading, isAuthenticated } = useSupabaseAuth()
  const [userSubscriptions, setUserSubscriptions] = useState<{ creator_id: string; tier_id: string }[]>([])
  const [subscribedCreators, setSubscribedCreators] = useState<SubscribedCreator[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const supabase = createClientComponentClient()

  // Pagination settings
  const creatorsPerPage = 8 // Show 8 creators at a time on desktop
  const totalPages = Math.ceil(subscribedCreators.length / creatorsPerPage)

  // Load user subscriptions and creator profiles if authenticated
  useEffect(() => {
    const loadSubscriptions = async () => {
      if (!isAuthenticated || !user) return

      try {
        const response = await fetch('/api/subscriptions/manage')
        if (response.ok) {
          const data = await response.json()
          const subs = data.subscriptions || []
          setUserSubscriptions(subs)

          // Load creator profiles for subscriptions
          if (subs.length > 0) {
            const creatorIds = [...new Set(subs.map((sub: any) => sub.creator_id))]
            const { data: creators } = await supabase
              .from('profiles')
              .select('id, username, display_name, avatar_url, category')
              .in('id', creatorIds)
              .eq('role', 'creator')

            if (creators) {
              setSubscribedCreators(creators)
            }
          }
        }
      } catch (error) {
        console.error('Failed to load subscriptions:', error)
      }
    }

    loadSubscriptions()
  }, [isAuthenticated, user, supabase])

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

          {/* Subscribed Creators Section */}
          {isAuthenticated && (
            <div className="mt-6">
              {subscribedCreators.length > 0 ? (
                <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-purple-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-semibold">Your Creators</h3>
                      <Badge variant="secondary" className="ml-2">
                        {subscribedCreators.length}
                      </Badge>
                    </div>

                    {/* Pagination controls for many creators */}
                    {totalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                          disabled={currentPage === 0}
                          className="h-8 w-8"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {currentPage + 1} / {totalPages}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                          disabled={currentPage === totalPages - 1}
                          className="h-8 w-8"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Creator Avatars Grid */}
                  <div className="flex flex-wrap items-center gap-4">
                    {subscribedCreators
                      .slice(currentPage * creatorsPerPage, (currentPage + 1) * creatorsPerPage)
                      .map((creator) => (
                        <Link
                          key={creator.id}
                          href={`/fan/creators/${creator.id}`}
                          className="group"
                        >
                          <div className="flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105">
                            <div className="relative">
                              <Avatar className="h-16 w-16 ring-2 ring-purple-100 group-hover:ring-purple-400 transition-all">
                                <AvatarImage
                                  src={creator.avatar_url || ''}
                                  alt={creator.display_name}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                                  {creator.display_name?.[0]?.toUpperCase() || creator.username?.[0]?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {/* Online indicator (you can make this dynamic later) */}
                              <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
                            </div>
                            <span className="text-xs font-medium text-gray-700 max-w-20 truncate">
                              {creator.display_name || creator.username}
                            </span>
                          </div>
                        </Link>
                      ))}

                    {/* Explore More Button - always visible */}
                    <Link href="/fan/explore" className="group">
                      <div className="flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center ring-2 ring-purple-100 group-hover:ring-purple-400 transition-all">
                          <Plus className="h-6 w-6 text-purple-600" />
                        </div>
                        <span className="text-xs font-medium text-purple-600">
                          Explore
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link href="/fan/subscriptions">
                      <Button variant="outline" size="sm" className="text-xs">
                        Manage Subscriptions
                      </Button>
                    </Link>
                    {subscribedCreators.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {subscribedCreators.length === 1
                          ? "Following 1 creator"
                          : `Following ${subscribedCreators.length} creators`}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty State - No Subscriptions */
                <Card className="border-dashed border-2 border-purple-200 bg-purple-50/50">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <Heart className="h-10 w-10 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Start Following Creators</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Discover amazing Haitian creators and subscribe to get exclusive content
                    </p>
                    <Link href="/fan/explore">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Explore Creators
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
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