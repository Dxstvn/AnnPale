'use client'

import React, { useState, useEffect, useRef } from 'react'
import { VideoPlayer } from './video-player'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Crown, 
  Star, 
  Shield, 
  Lock, 
  LockOpen,
  Tv,
  XCircle,
  CheckCircle,
  Zap,
  Gift,
  Heart,
  Sparkles,
  Clock,
  Volume2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubscriberGatedPlayerProps {
  streamUrl: string
  streamId: string
  isLive?: boolean
  viewerCount?: number
  subscription?: {
    tier: 'basic' | 'premium' | 'vip'
    benefits: string[]
    adFree: boolean
  }
  onSubscribe?: () => void
  onUpgrade?: () => void
  className?: string
}

interface AdData {
  id: string
  url: string
  duration: number
  skipAfter?: number
  type: 'pre-roll' | 'mid-roll' | 'post-roll'
}

const mockAds: AdData[] = [
  {
    id: 'ad-1',
    url: 'https://example.com/ad1.mp4',
    duration: 15,
    skipAfter: 5,
    type: 'pre-roll',
  },
  {
    id: 'ad-2',
    url: 'https://example.com/ad2.mp4',
    duration: 30,
    skipAfter: 5,
    type: 'mid-roll',
  },
]

const tierBenefits = {
  free: {
    name: 'Free Viewer',
    icon: Tv,
    color: 'from-gray-500 to-gray-600',
    benefits: [
      'Watch with ads',
      'SD quality (480p)',
      'Limited chat participation',
      'No exclusive content',
    ],
    limitations: [
      'Ads every 10 minutes',
      'No HD streaming',
      'No priority support',
      'No badges in chat',
    ],
  },
  basic: {
    name: 'Basic Subscriber',
    icon: Star,
    color: 'from-blue-500 to-cyan-600',
    benefits: [
      'Reduced ads (50% less)',
      'HD quality (720p)',
      'Full chat participation',
      'Subscriber badge',
      'Access to VODs',
    ],
    limitations: [
      'Some ads remain',
      'No Full HD (1080p)',
      'No exclusive streams',
    ],
  },
  premium: {
    name: 'Premium Subscriber',
    icon: Shield,
    color: 'from-purple-600 to-indigo-600',
    benefits: [
      'Ad-free viewing',
      'Full HD (1080p)',
      'Priority chat messages',
      'Exclusive emotes',
      'Early access to content',
      'Download for offline',
    ],
    limitations: [],
  },
  vip: {
    name: 'VIP Member',
    icon: Crown,
    color: 'from-yellow-500 to-amber-600',
    benefits: [
      'Everything in Premium',
      '4K quality where available',
      'Direct message creators',
      'VIP-only streams',
      'Monthly virtual meet & greet',
      'Custom badge and emotes',
    ],
    limitations: [],
  },
}

export function SubscriberGatedPlayer({
  streamUrl,
  streamId,
  isLive = true,
  viewerCount,
  subscription,
  onSubscribe,
  onUpgrade,
  className,
}: SubscriberGatedPlayerProps) {
  const [showAd, setShowAd] = useState(false)
  const [currentAd, setCurrentAd] = useState<AdData | null>(null)
  const [adTimeRemaining, setAdTimeRemaining] = useState(0)
  const [canSkip, setCanSkip] = useState(false)
  const [midRollTimer, setMidRollTimer] = useState<NodeJS.Timeout | null>(null)
  const [streamQuality, setStreamQuality] = useState<'auto' | '360p' | '480p' | '720p' | '1080p' | '4k'>('auto')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Determine available quality based on subscription
  const getMaxQuality = () => {
    if (!subscription) return '480p'
    if (subscription.tier === 'basic') return '720p'
    if (subscription.tier === 'premium') return '1080p'
    if (subscription.tier === 'vip') return '4k'
    return '480p'
  }

  // Check if ads should be shown
  const shouldShowAds = () => {
    if (!subscription) return true
    if (subscription.tier === 'basic') return true // Reduced ads
    return false // Premium and VIP are ad-free
  }

  // Ad frequency based on tier
  const getAdFrequency = () => {
    if (!subscription) return 10 * 60 * 1000 // Every 10 minutes for free
    if (subscription.tier === 'basic') return 20 * 60 * 1000 // Every 20 minutes for basic
    return 0 // No ads for premium/VIP
  }

  // Play pre-roll ad for free/basic viewers
  useEffect(() => {
    if (shouldShowAds() && isLive) {
      // Show pre-roll ad
      const ad = mockAds.find(a => a.type === 'pre-roll')
      if (ad) {
        setCurrentAd(ad)
        setShowAd(true)
        setAdTimeRemaining(ad.duration)
      }
    }
  }, [isLive])

  // Schedule mid-roll ads
  useEffect(() => {
    if (shouldShowAds() && isLive) {
      const frequency = getAdFrequency()
      if (frequency > 0) {
        const timer = setInterval(() => {
          const ad = mockAds.find(a => a.type === 'mid-roll')
          if (ad) {
            setCurrentAd(ad)
            setShowAd(true)
            setAdTimeRemaining(ad.duration)
          }
        }, frequency)
        
        setMidRollTimer(timer)
        
        return () => {
          if (timer) clearInterval(timer)
        }
      }
    }
  }, [isLive, subscription])

  // Ad countdown timer
  useEffect(() => {
    if (showAd && adTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setAdTimeRemaining(prev => prev - 1)
        
        // Check if skip is available
        if (currentAd?.skipAfter && adTimeRemaining <= currentAd.duration - currentAd.skipAfter) {
          setCanSkip(true)
        }
        
        // Auto-close ad when finished
        if (adTimeRemaining <= 1) {
          handleSkipAd()
        }
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [showAd, adTimeRemaining, currentAd])

  const handleSkipAd = () => {
    setShowAd(false)
    setCurrentAd(null)
    setAdTimeRemaining(0)
    setCanSkip(false)
  }

  const handleQualityChange = (quality: string) => {
    const maxQuality = getMaxQuality()
    const qualityOrder = ['360p', '480p', '720p', '1080p', '4k']
    const maxIndex = qualityOrder.indexOf(maxQuality)
    const selectedIndex = qualityOrder.indexOf(quality)
    
    if (selectedIndex > maxIndex) {
      setShowUpgradePrompt(true)
      return
    }
    
    setStreamQuality(quality as any)
  }

  const renderTierCard = (tierKey: string) => {
    const tier = tierBenefits[tierKey as keyof typeof tierBenefits]
    const TierIcon = tier.icon
    const isCurrentTier = subscription?.tier === tierKey
    
    return (
      <Card className={cn(
        'relative overflow-hidden transition-all duration-300',
        isCurrentTier && 'ring-2 ring-purple-600'
      )}>
        {isCurrentTier && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-purple-600 text-white">Current</Badge>
          </div>
        )}
        
        <CardHeader>
          <div className={cn('inline-flex p-2 rounded-lg bg-gradient-to-r mb-2', tier.color)}>
            <TierIcon className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-lg">{tier.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Includes:</p>
            <ul className="space-y-1">
              {tier.benefits.map((benefit, idx) => (
                <li key={idx} className="text-sm flex items-start">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {tier.limitations.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Limitations:</p>
              <ul className="space-y-1">
                {tier.limitations.map((limitation, idx) => (
                  <li key={idx} className="text-sm flex items-start">
                    <XCircle className="h-3 w-3 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Ad Overlay */}
      {showAd && currentAd && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Mock Ad Content */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Volume2 className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold mb-2">Advertisement</h3>
                <p className="text-lg mb-4">Support your favorite creators!</p>
                <p className="text-sm opacity-75">This is a mock ad for demonstration</p>
              </div>
            </div>
            
            {/* Ad Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-yellow-600 text-white border-0">
                    <Clock className="h-3 w-3 mr-1" />
                    {adTimeRemaining}s
                  </Badge>
                  <span className="text-sm">
                    {currentAd.type === 'pre-roll' ? 'Starting soon...' : 'We\'ll be right back...'}
                  </span>
                </div>
                
                {canSkip ? (
                  <Button
                    size="sm"
                    onClick={handleSkipAd}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    Skip Ad
                  </Button>
                ) : currentAd.skipAfter && (
                  <span className="text-sm">
                    Skip in {currentAd.skipAfter - (currentAd.duration - adTimeRemaining)}s
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Upgrade for Better Quality</CardTitle>
              <CardDescription>
                Higher video quality is available with a subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {renderTierCard('basic')}
                {renderTierCard('premium')}
                {renderTierCard('vip')}
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowUpgradePrompt(false)}>
                  Maybe Later
                </Button>
                <Button onClick={() => {
                  setShowUpgradePrompt(false)
                  onUpgrade?.()
                }}>
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscription Status Banner */}
      {!showAd && (
        <div className="absolute top-4 left-4 right-4 z-30">
          <Alert className={cn(
            'backdrop-blur-sm border-0',
            subscription?.tier === 'vip' ? 'bg-yellow-500/90 text-white' :
            subscription?.tier === 'premium' ? 'bg-purple-600/90 text-white' :
            subscription?.tier === 'basic' ? 'bg-blue-600/90 text-white' :
            'bg-gray-900/90 text-white'
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {subscription ? (
                  <>
                    {React.createElement(
                      tierBenefits[subscription.tier].icon,
                      { className: 'h-4 w-4 mr-2' }
                    )}
                    <span className="font-semibold">
                      {tierBenefits[subscription.tier].name}
                    </span>
                    {subscription.adFree && (
                      <Badge className="ml-2 bg-white/20 text-white border-white/30">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Ad-Free
                      </Badge>
                    )}
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Watching as Free Viewer</span>
                    <Badge className="ml-2 bg-white/20 text-white border-white/30">
                      With Ads
                    </Badge>
                  </>
                )}
              </div>
              
              {!subscription && onSubscribe && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onSubscribe}
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  <LockOpen className="h-3 w-3 mr-1" />
                  Subscribe
                </Button>
              )}
            </div>
          </Alert>
        </div>
      )}

      {/* Video Player */}
      <VideoPlayer
        streamUrl={streamUrl}
        streamId={streamId}
        isLive={isLive}
        viewerCount={viewerCount}
        onQualityChange={handleQualityChange}
        className={showAd ? 'opacity-0' : 'opacity-100'}
      />
    </div>
  )
}