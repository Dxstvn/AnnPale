"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowRight,
  CheckCircle,
  Star,
  Gift,
  Heart
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// CTA Types
type CTAVariant = "creator" | "fan" | "business" | "gift"

interface CallToActionProps {
  variant?: CTAVariant
  className?: string
}

// Creator Recruitment CTA
function CreatorCTA() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-full mb-6">
              <Sparkles className="h-8 w-8" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Are You a Haitian Creator?
            </h2>
            
            <p className="text-lg mb-6 text-white/90">
              Join thousands of Haitian celebrities earning money by creating personalized video messages for fans worldwide.
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Set your own prices and schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Keep 75% of your earnings</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Connect with fans globally</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Apply to Join
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur rounded-xl p-6 text-center"
            >
              <DollarSign className="h-8 w-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">$50K+</p>
              <p className="text-sm text-white/80">Avg Annual Earnings</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur rounded-xl p-6 text-center"
            >
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-white/80">Active Creators</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur rounded-xl p-6 text-center"
            >
              <Star className="h-8 w-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">4.9</p>
              <p className="text-sm text-white/80">Creator Satisfaction</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur rounded-xl p-6 text-center"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">72hr</p>
              <p className="text-sm text-white/80">Avg Response Time</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Fan Engagement CTA
function FanCTA() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 md:p-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
          <Heart className="h-8 w-8 text-purple-600" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Make Someone's Day Special
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Get personalized video messages from your favorite Haitian celebrities. 
          Perfect for birthdays, anniversaries, or just because!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="lg" variant="primary">
            Browse All Creators
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline">
            How It Works
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4">
          <Badge variant="secondary" className="px-4 py-2">
            ✨ 100% Authentic Videos
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            💰 Money-Back Guarantee
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            ⚡ 3-Day Delivery
          </Badge>
        </div>
      </div>
    </div>
  )
}

// Business CTA
function BusinessCTA() {
  return (
    <div className="bg-gray-900 text-white rounded-2xl p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ann Pale for Business
          </h2>
          <p className="text-lg text-gray-300">
            Engage your customers and employees with personalized celebrity messages
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">Employee Recognition</h3>
            <p className="text-sm text-gray-400">
              Celebrate milestones and achievements with celebrity shoutouts
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">Marketing Campaigns</h3>
            <p className="text-sm text-gray-400">
              Boost engagement with authentic celebrity endorsements
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">Client Gifts</h3>
            <p className="text-sm text-gray-400">
              Send memorable gifts that strengthen relationships
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Get Started for Business
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Gift CTA
function GiftCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 to-pink-600 p-8 md:p-12 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
        <div className="absolute bottom-8 left-8 w-32 h-32 bg-white rounded-full" />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <Gift className="h-16 w-16 mx-auto mb-6" />
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          The Perfect Gift for Any Occasion
        </h2>
        
        <p className="text-lg mb-8 text-white/90">
          Surprise someone special with a personalized video message from their favorite Haitian celebrity.
          It's unique, meaningful, and unforgettable!
        </p>

        <Button 
          size="lg" 
          className="bg-white text-pink-600 hover:bg-gray-100"
        >
          Send a Gift
          <Gift className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

// Main Call-to-Action Component
export function CallToAction({
  variant = "creator",
  className
}: CallToActionProps) {
  const variants = {
    creator: <CreatorCTA />,
    fan: <FanCTA />,
    business: <BusinessCTA />,
    gift: <GiftCTA />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {variants[variant]}
    </motion.div>
  )
}

export default CallToAction
