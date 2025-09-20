"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Crown, Star, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"

interface SubscriptionTier {
  id: string
  tier_name: string
  price: number
  description?: string
  benefits?: string[]
  is_active: boolean
}

interface CreatorSubscriptionTiersProps {
  creatorId: string
  creatorName: string
  displayMode?: 'grid' | 'carousel'
  onSubscribe?: (tierId: string, tierName: string, price: number) => void
}

export default function CreatorSubscriptionTiers({
  creatorId,
  creatorName,
  displayMode = 'grid',
  onSubscribe
}: CreatorSubscriptionTiersProps) {
  const [tiers, setTiers] = React.useState<SubscriptionTier[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [showLeftButton, setShowLeftButton] = React.useState(false)
  const [showRightButton, setShowRightButton] = React.useState(true)
  const [currentTierIndex, setCurrentTierIndex] = React.useState(0)
  const [touchStart, setTouchStart] = React.useState(0)
  const [touchEnd, setTouchEnd] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [startX, setStartX] = React.useState(0)
  const [isWheelNavigating, setIsWheelNavigating] = React.useState(false)

  React.useEffect(() => {
    const fetchTiers = async () => {
      if (!creatorId) {
        console.warn('CreatorSubscriptionTiers: No creator ID provided')
        setLoading(false)
        return
      }

      try {
        setError(null)
        const supabase = createClient()
        
        if (!supabase) {
          throw new Error('Failed to initialize Supabase client')
        }
        
        // Map known test creator IDs
        const testCreatorMappings: Record<string, string> = {
          'testcreator': '0f3753a3-029c-473a-9aee-fc107d10c569',
          'wyclef-jean': 'd963aa48-879d-461c-9df3-7dc557b545f9',
          'michael-brun': '819421cf-9437-4d10-bb09-bca4e0c12cba',
          'rutshelle-guillaume': 'cbce25c9-04e0-45c7-b872-473fed4eeb1d',
          // Map numeric IDs to creator UUIDs (actual database IDs)
          '1': 'd963aa48-879d-461c-9df3-7dc557b545f9', // Wyclef Jean
          '2': '819421cf-9437-4d10-bb09-bca4e0c12cba', // Michael Brun
          '6': 'cbce25c9-04e0-45c7-b872-473fed4eeb1d'  // Rutshelle Guillaume
        }
        
        // Use mapping if available, otherwise use the creatorId as is
        let authUserId = testCreatorMappings[creatorId] || creatorId
        
        // If it's a UUID already, use it directly
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (uuidRegex.test(creatorId)) {
          authUserId = creatorId
        }
        
        console.log(`Fetching subscription tiers for creator: ${creatorId} (mapped to: ${authUserId})`)
        
        // Fetch active subscription tiers for this creator
        const { data, error: fetchError } = await supabase
          .from('creator_subscription_tiers')
          .select('*')
          .eq('creator_id', authUserId)
          .eq('is_active', true)
          .order('price', { ascending: true })

        if (fetchError) {
          console.error('Error fetching subscription tiers:', fetchError)
          setError('Failed to load subscription tiers')
        } else {
          console.log(`Found ${data?.length || 0} subscription tiers`)
          setTiers(data || [])
        }
      } catch (err) {
        console.error('Error in fetchTiers:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTiers()
  }, [creatorId])

  // Navigation functions for single card carousel
  const goToPrevious = () => {
    if (currentTierIndex > 0) {
      setCurrentTierIndex(currentTierIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentTierIndex < tiers.length - 1) {
      setCurrentTierIndex(currentTierIndex + 1)
    }
  }

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  // Pointer handlers for mouse/trackpad swipe gestures (desktop)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only handle primary button (left click) or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return

    setIsDragging(true)
    setStartX(e.clientX)
    e.currentTarget.style.cursor = 'grabbing'
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return

    const currentX = e.clientX
    const diff = startX - currentX

    // Add visual feedback during drag
    if (e.currentTarget instanceof HTMLElement) {
      const dragAmount = Math.max(-100, Math.min(100, -diff * 0.2))
      e.currentTarget.style.transform = `translateX(${dragAmount}px)`
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return

    setIsDragging(false)
    e.currentTarget.style.cursor = 'grab'

    // Reset transform
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.transform = ''
    }

    const endX = e.clientX
    const distance = startX - endX
    const threshold = 50 // Minimum swipe distance

    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        goToNext() // Swipe left
      } else {
        goToPrevious() // Swipe right
      }
    }
  }

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false)
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.cursor = 'grab'
        e.currentTarget.style.transform = ''
      }
    }
  }

  // Wheel handler for horizontal trackpad scrolling
  const handleWheel = (e: React.WheelEvent) => {
    // Prevent navigation if already navigating
    if (isWheelNavigating) return

    // Check if it's a horizontal scroll (trackpad swipe)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault()

      // Use a threshold to prevent accidental navigation
      if (Math.abs(e.deltaX) > 30) {
        setIsWheelNavigating(true)

        if (e.deltaX > 0) {
          goToNext() // Swipe left
        } else {
          goToPrevious() // Swipe right
        }

        // Reset wheel navigation flag after a delay
        setTimeout(() => {
          setIsWheelNavigating(false)
        }, 500)
      }
    }
  }

  // Helper functions for carousel mode (legacy - for horizontal scroll)
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const cardWidth = container.querySelector('.tier-card')?.clientWidth || 350
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth

    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const isAtStart = container.scrollLeft <= 10
    const isAtEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 10

    setShowLeftButton(!isAtStart)
    setShowRightButton(!isAtEnd)
  }

  // Helper functions for rendering - defined before early returns
  const getIcon = (index: number) => {
    const icons = [
      <Star className="h-5 w-5" key="star" />,
      <Crown className="h-5 w-5" key="crown" />,
      <Zap className="h-5 w-5" key="zap" />
    ]
    return icons[index % icons.length]
  }

  const getColor = (index: number) => {
    const colors = [
      "from-purple-600 to-pink-600",
      "from-blue-600 to-purple-600",
      "from-pink-600 to-red-600"
    ]
    return colors[index % colors.length]
  }

  // Scroll listener effect - must be before early returns to follow Rules of Hooks
  React.useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || displayMode !== 'grid') return

    container.addEventListener('scroll', checkScrollButtons)
    checkScrollButtons() // Initial check

    return () => container.removeEventListener('scroll', checkScrollButtons)
  }, [tiers, displayMode])

  // Early returns after all hooks
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (tiers.length === 0) {
    return null // Don't show anything if creator has no subscription tiers
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Subscription Tiers</h3>
        <p className="text-gray-600 text-sm">
          Support {creatorName} with a monthly subscription
        </p>
      </div>

      {displayMode === 'carousel' && tiers.length > 0 ? (
        <div
          className="relative cursor-grab select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onWheel={handleWheel}
          style={{ touchAction: 'pan-y' }}
        >
          {/* Previous button - desktop only */}
          <button
            onClick={goToPrevious}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white backdrop-blur-sm rounded-full p-3 shadow-xl border border-gray-200 transition-all hidden sm:flex items-center justify-center",
              currentTierIndex > 0 ? "opacity-100 hover:scale-110" : "opacity-30 cursor-not-allowed"
            )}
            disabled={currentTierIndex === 0}
            aria-label="Previous tier"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          {/* Next button - desktop only */}
          <button
            onClick={goToNext}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white backdrop-blur-sm rounded-full p-3 shadow-xl border border-gray-200 transition-all hidden sm:flex items-center justify-center",
              currentTierIndex < tiers.length - 1 ? "opacity-100 hover:scale-110" : "opacity-30 cursor-not-allowed"
            )}
            disabled={currentTierIndex >= tiers.length - 1}
            aria-label="Next tier"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>

          {/* Single card display with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTierIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full"
            >
              {tiers[currentTierIndex] && (
                <Card className="relative w-full max-w-md mx-auto min-h-[500px] hover:shadow-xl transition-shadow" padding="none">
                  {currentTierIndex === 1 && tiers.length > 1 && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white z-10">
                      Most Popular
                    </Badge>
                  )}

                  <CardHeader className="px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "inline-flex p-3 rounded-lg bg-gradient-to-r text-white",
                        getColor(currentTierIndex)
                      )}>
                        {getIcon(currentTierIndex)}
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xl font-bold px-4 py-2"
                        data-testid={`tier-price-${currentTierIndex}`}
                      >
                        ${tiers[currentTierIndex].price}/mo
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold mb-3" data-testid={`tier-name-${currentTierIndex}`}>
                      {tiers[currentTierIndex].tier_name}
                    </CardTitle>
                    {tiers[currentTierIndex].description && (
                      <p
                        className="text-base text-gray-600"
                        data-testid={`tier-description-${currentTierIndex}`}
                      >
                        {tiers[currentTierIndex].description}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="px-6 pb-6 flex flex-col flex-1">
                    <div className="flex-1">
                      {tiers[currentTierIndex].benefits && tiers[currentTierIndex].benefits.length > 0 ? (
                        <div
                          className="space-y-3 mb-6"
                          data-testid={`tier-benefits-${currentTierIndex}`}
                        >
                          {tiers[currentTierIndex].benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-base text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mb-6 py-12 text-center text-gray-500">
                          <p className="text-base">Perfect for getting started!</p>
                        </div>
                      )}
                    </div>

                    <Button
                      className={cn(
                        "w-full bg-gradient-to-r text-white h-12 text-base font-semibold mt-auto",
                        getColor(currentTierIndex)
                      )}
                      data-testid={`subscribe-button-${currentTierIndex}`}
                      onClick={() => {
                        const tier = tiers[currentTierIndex]
                        if (onSubscribe) {
                          onSubscribe(tier.id, tier.tier_name, tier.price)
                        } else {
                          console.log(`Subscribe clicked for ${tier.tier_name} - $${tier.price}/month`)
                          window.alert(`Subscribe to ${tier.tier_name} for $${tier.price}/month\n\nPayment integration coming soon!`)
                        }
                      }}
                    >
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {tiers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTierIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === currentTierIndex
                    ? "bg-purple-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400 w-2"
                )}
                aria-label={`Go to ${tiers[index]?.tier_name || `tier ${index + 1}`}`}
              />
            ))}
          </div>
        </div>
      ) : displayMode === 'grid' ? (
        /* Grid layout for non-modal contexts */
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative h-full hover:shadow-xl transition-shadow" padding="none">
                {index === 1 && tiers.length > 1 && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white z-10">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="px-5 pt-5 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "inline-flex p-3 rounded-lg bg-gradient-to-r text-white",
                      getColor(index)
                    )}>
                      {getIcon(index)}
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-lg font-bold px-3 py-1"
                      data-testid={`tier-price-${index}`}
                    >
                      ${tier.price}/month
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold" data-testid={`tier-name-${index}`}>
                    {tier.tier_name}
                  </CardTitle>
                  {tier.description && (
                    <p
                      className="text-sm text-gray-600 mt-2"
                      data-testid={`tier-description-${index}`}
                    >
                      {tier.description}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="px-5 pb-5 space-y-4">
                  {tier.benefits && tier.benefits.length > 0 && (
                    <div
                      className="space-y-2"
                      data-testid={`tier-benefits-${index}`}
                    >
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    className={cn(
                      "w-full bg-gradient-to-r text-white",
                      getColor(index)
                    )}
                    data-testid={`subscribe-button-${index}`}
                    onClick={() => {
                      if (onSubscribe) {
                        onSubscribe(tier.id, tier.tier_name, tier.price)
                      } else {
                        console.log(`Subscribe clicked for ${tier.tier_name} - $${tier.price}/month`)
                        window.alert(`Subscribe to ${tier.tier_name} for $${tier.price}/month\n\nPayment integration coming soon!`)
                      }
                    }}
                  >
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : null}
    </div>
  )
}