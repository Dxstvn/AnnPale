"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Gift,
  Play,
  Heart,
  Star,
  Sparkles,
  PartyPopper,
  Crown,
  Flame,
  Zap,
  Calendar,
  Award,
  Target,
  Music,
  Volume2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Gift landing page templates for different presentations
export const giftLandingTemplates = {
  classic: {
    name: "Classic Elegance",
    component: ClassicGiftLanding
  },
  festive: {
    name: "Festive Celebration", 
    component: FestiveGiftLanding
  },
  elegant: {
    name: "Elegant Luxury",
    component: ElegantGiftLanding
  },
  playful: {
    name: "Playful & Fun",
    component: PlayfulGiftLanding
  },
  birthday: {
    name: "Birthday Magic",
    component: BirthdayGiftLanding
  },
  romantic: {
    name: "Romantic Touch",
    component: RomanticGiftLanding
  }
}

// Shared props interface
interface GiftLandingProps {
  recipientName?: string
  senderName?: string
  giftMessage?: string
  creatorName: string
  videoThumbnail?: string
  onReveal: () => void
  customization: {
    includeAnimations?: boolean
    addMusic?: boolean
    confettiEffect?: boolean
  }
}

// Classic Elegance Template
function ClassicGiftLanding({
  recipientName,
  senderName,
  giftMessage,
  creatorName,
  onReveal,
  customization
}: GiftLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mb-6"
            >
              <Gift className="h-16 w-16 mx-auto text-slate-700 mb-4" />
              <h1 className="text-2xl font-serif text-slate-800 mb-2">
                You've Received a Gift
              </h1>
              {recipientName && (
                <p className="text-slate-600">Dear {recipientName},</p>
              )}
            </motion.div>

            {giftMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6 p-4 bg-slate-50 rounded-lg"
              >
                <p className="text-slate-700 italic">"{giftMessage}"</p>
                {senderName && (
                  <p className="text-sm text-slate-500 mt-2">- {senderName}</p>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-slate-600 mb-6"
            >
              <p>A personalized video message from</p>
              <p className="font-semibold text-lg text-slate-800">{creatorName}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Button
                onClick={onReveal}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Your Message
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Festive Celebration Template
function FestiveGiftLanding({
  recipientName,
  senderName,
  giftMessage,
  creatorName,
  onReveal,
  customization
}: GiftLandingProps) {
  const [showConfetti, setShowConfetti] = React.useState(false)

  React.useEffect(() => {
    if (customization.confettiEffect) {
      setTimeout(() => setShowConfetti(true), 1000)
    }
  }, [customization.confettiEffect])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      {customization.includeAnimations && (
        <>
          <motion.div
            className="absolute top-10 left-10 text-yellow-300"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Star className="h-8 w-8" />
          </motion.div>
          <motion.div
            className="absolute top-20 right-20 text-pink-300"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>
          <motion.div
            className="absolute bottom-20 left-20 text-blue-300"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="h-10 w-10" />
          </motion.div>
        </>
      )}

      {/* Confetti Effect */}
      {showConfetti && customization.confettiEffect && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded"
              initial={{ y: -100, x: Math.random() * window.innerWidth, rotate: 0 }}
              animate={{ y: window.innerHeight + 100, rotate: 360 }}
              transition={{ duration: 3, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="bg-white/90 backdrop-blur border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <PartyPopper className="h-16 w-16 mx-auto text-pink-500 mb-4" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                Surprise! 🎉
              </h1>
              {recipientName && (
                <p className="text-purple-700 text-lg font-medium">{recipientName}!</p>
              )}
            </motion.div>

            {giftMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border-2 border-pink-200"
              >
                <p className="text-purple-800 font-medium">"{giftMessage}"</p>
                {senderName && (
                  <p className="text-sm text-pink-600 mt-2 font-medium">- {senderName}</p>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-purple-700 mb-6"
            >
              <p className="text-lg">🎬 Special video message from</p>
              <p className="font-bold text-xl text-purple-800">{creatorName}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Button
                onClick={onReveal}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 text-lg font-semibold"
                size="lg"
              >
                <Play className="h-6 w-6 mr-2" />
                Watch Your Surprise! ✨
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Elegant Luxury Template
function ElegantGiftLanding({
  recipientName,
  senderName,
  giftMessage,
  creatorName,
  onReveal,
  customization
}: GiftLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-900 to-amber-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-lg w-full"
      >
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 shadow-2xl">
          <CardContent className="p-10 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="mb-8"
            >
              <Crown className="h-20 w-20 mx-auto text-amber-600 mb-4" />
              <h1 className="text-3xl font-serif text-amber-900 mb-2">
                Exclusive Gift
              </h1>
              {recipientName && (
                <p className="text-amber-700 text-lg italic">For {recipientName}</p>
              )}
            </motion.div>

            {giftMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8 p-6 bg-white/50 rounded-lg border border-amber-300"
              >
                <p className="text-amber-900 font-medium italic text-lg">"{giftMessage}"</p>
                {senderName && (
                  <p className="text-amber-700 mt-3 font-serif">— {senderName}</p>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-amber-800 mb-8"
            >
              <p className="text-lg font-serif">A premium video experience from</p>
              <p className="font-bold text-2xl text-amber-900 font-serif">{creatorName}</p>
              <Badge className="mt-2 bg-amber-600 text-white">Exclusive Content</Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Button
                onClick={onReveal}
                className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white py-4 text-lg font-serif"
                size="lg"
              >
                <Crown className="h-6 w-6 mr-2" />
                Experience Excellence
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Playful & Fun Template
function PlayfulGiftLanding({
  recipientName,
  senderName,
  giftMessage,
  creatorName,
  onReveal,
  customization
}: GiftLandingProps) {
  const [bouncing, setBouncing] = React.useState(false)

  React.useEffect(() => {
    if (customization.includeAnimations) {
      const interval = setInterval(() => {
        setBouncing(true)
        setTimeout(() => setBouncing(false), 1000)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [customization.includeAnimations])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-yellow-300 to-pink-300 flex items-center justify-center p-4 relative">
      {/* Floating Elements */}
      {customization.includeAnimations && (
        <>
          <motion.div
            className="absolute top-16 left-16 text-red-400"
            animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Heart className="h-8 w-8" />
          </motion.div>
          <motion.div
            className="absolute top-32 right-16 text-blue-400"
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="h-6 w-6" />
          </motion.div>
        </>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="max-w-md w-full"
      >
        <Card className="bg-white border-4 border-orange-400 shadow-2xl transform rotate-1">
          <CardContent className="p-8 text-center">
            <motion.div
              className={cn("mb-6", bouncing && "animate-bounce")}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <Gift className="h-16 w-16 mx-auto text-orange-500 mb-4" />
              <h1 className="text-3xl font-bold text-orange-700 mb-2">
                SURPRISE! 🎁
              </h1>
              {recipientName && (
                <p className="text-2xl text-pink-600 font-bold">{recipientName}! 🌟</p>
              )}
            </motion.div>

            {giftMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6 p-4 bg-yellow-100 rounded-lg border-2 border-yellow-300 transform -rotate-1"
              >
                <p className="text-orange-800 font-bold">"{giftMessage}"</p>
                {senderName && (
                  <p className="text-pink-600 mt-2 font-bold">- {senderName} 💖</p>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-orange-700 mb-6"
            >
              <p className="text-xl font-bold">🎬 Fun video from</p>
              <p className="font-black text-2xl text-pink-600">{creatorName}!</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Button
                onClick={onReveal}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-4 text-xl font-bold shadow-lg transform hover:scale-105 transition-transform"
                size="lg"
              >
                <Play className="h-6 w-6 mr-2" />
                LET'S WATCH! 🚀
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Birthday Magic Template
function BirthdayGiftLanding({
  recipientName,
  senderName,
  giftMessage,
  creatorName,
  onReveal,
  customization
}: GiftLandingProps) {
  const [currentConfetti, setCurrentConfetti] = React.useState(0)

  React.useEffect(() => {
    if (customization.confettiEffect) {
      const interval = setInterval(() => {
        setCurrentConfetti(prev => prev + 1)
      }, 500)
      return () => clearInterval(interval)
    }
  }, [customization.confettiEffect])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Birthday Confetti */}
      {customization.confettiEffect && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(currentConfetti % 10)].map((_, i) => (
            <motion.div
              key={`${currentConfetti}-${i}`}
              className="absolute text-white"
              initial={{ 
                y: -50, 
                x: Math.random() * window.innerWidth,
                scale: 0
              }}
              animate={{ 
                y: window.innerHeight + 50,
                scale: [0, 1, 0],
                rotate: 360
              }}
              transition={{ duration: 3 }}
            >
              🎉
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg w-full"
      >
        <Card className="bg-gradient-to-br from-yellow-50 to-pink-50 border-2 border-pink-300 shadow-2xl">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-6"
            >
              <div className="text-6xl mb-4">🎂</div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Happy Birthday!
              </h1>
              {recipientName && (
                <p className="text-2xl text-purple-700 font-bold">{recipientName}! 🎈</p>
              )}
            </motion.div>

            {giftMessage && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6 p-6 bg-white/70 rounded-xl border-2 border-pink-200"
              >
                <p className="text-purple-800 font-semibold text-lg">"{giftMessage}"</p>
                {senderName && (
                  <p className="text-pink-600 mt-3 font-bold">🎁 From {senderName}</p>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-purple-700 mb-6"
            >
              <p className="text-xl font-semibold">🎬 Birthday message from</p>
              <p className="font-black text-2xl text-pink-600">{creatorName}!</p>
              <p className="text-lg mt-2">🌟 Just for you! 🌟</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Button
                onClick={onReveal}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-xl font-bold"
                size="lg"
              >
                <Play className="h-6 w-6 mr-2" />
                🎉 Open Your Gift! 🎉
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Romantic Touch Template
function RomanticGiftLanding({
  recipientName,
  senderName,
  giftMessage,
  creatorName,
  onReveal,
  customization
}: GiftLandingProps) {
  const [heartPulse, setHeartPulse] = React.useState(false)

  React.useEffect(() => {
    if (customization.includeAnimations) {
      const interval = setInterval(() => {
        setHeartPulse(true)
        setTimeout(() => setHeartPulse(false), 1000)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [customization.includeAnimations])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-300 to-red-300 flex items-center justify-center p-4 relative">
      {/* Floating Hearts */}
      {customization.includeAnimations && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/30"
              animate={{
                y: [-100, -window.innerHeight],
                x: [Math.random() * 100 - 50, Math.random() * 100 - 50]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 1.5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%'
              }}
            >
              ❤️
            </motion.div>
          ))}
        </>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 shadow-2xl">
          <CardContent className="p-8 text-center">
            <motion.div
              className={cn("mb-6", heartPulse && "animate-pulse")}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Heart className="h-16 w-16 mx-auto text-rose-500 mb-4 fill-current" />
              <h1 className="text-3xl font-script text-rose-700 mb-2">
                With Love
              </h1>
              {recipientName && (
                <p className="text-xl text-rose-600 italic">For {recipientName} 💕</p>
              )}
            </motion.div>

            {giftMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6 p-6 bg-white/60 rounded-lg border border-rose-300"
              >
                <p className="text-rose-800 italic text-lg font-medium">"{giftMessage}"</p>
                {senderName && (
                  <p className="text-rose-600 mt-3 font-script text-lg">💖 {senderName}</p>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-rose-700 mb-6"
            >
              <p className="text-lg font-medium">💝 A heartfelt message from</p>
              <p className="font-bold text-xl text-rose-800">{creatorName}</p>
              <p className="text-sm mt-1 italic">Made with love, just for you</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Button
                onClick={onReveal}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-4 text-lg font-medium"
                size="lg"
              >
                <Heart className="h-5 w-5 mr-2 fill-current" />
                Open with Love 💕
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Main component to render the appropriate template
export function GiftLandingPage({
  template = "classic",
  ...props
}: GiftLandingProps & { template?: keyof typeof giftLandingTemplates }) {
  const TemplateComponent = giftLandingTemplates[template]?.component || ClassicGiftLanding
  
  return <TemplateComponent {...props} />
}