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
import { useTranslations } from "next-intl"

// CTA Types
type CTAVariant = "creator" | "fan" | "business" | "gift"

interface CallToActionProps {
  variant?: CTAVariant
  className?: string
}

// Creator Recruitment CTA
function CreatorCTA() {
  const t = useTranslations('common.cta.creator')

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
              {t('title')}
            </h2>

            <p className="text-lg mb-6 text-white/90">
              {t('subtitle')}
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>{t('benefit1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>{t('benefit2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>{t('benefit3')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                {t('applyButton')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                {t('learnMoreButton')}
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
              <p className="text-3xl font-bold">{t('avgEarnings')}</p>
              <p className="text-sm text-white/80">{t('avgEarningsLabel')}</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur rounded-xl p-6 text-center"
            >
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">{t('activeCreators')}</p>
              <p className="text-sm text-white/80">{t('activeCreatorsLabel')}</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur rounded-xl p-6 text-center"
            >
              <Star className="h-8 w-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">{t('satisfaction')}</p>
              <p className="text-sm text-white/80">{t('satisfactionLabel')}</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur rounded-xl p-6 text-center"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">{t('responseTime')}</p>
              <p className="text-sm text-white/80">{t('responseTimeLabel')}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Fan Engagement CTA
function FanCTA() {
  const t = useTranslations('common.cta.fan')

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 md:p-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
          <Heart className="h-8 w-8 text-purple-600" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t('title')}
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="lg" variant="primary">
            {t('browseButton')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline">
            {t('howItWorksButton')}
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4">
          <Badge variant="secondary" className="px-4 py-2">
            {t('trustBadge1')}
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            {t('trustBadge2')}
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            {t('trustBadge3')}
          </Badge>
        </div>
      </div>
    </div>
  )
}

// Business CTA
function BusinessCTA() {
  const t = useTranslations('common.cta.business')

  return (
    <div className="bg-gray-900 text-white rounded-2xl p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-300">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">{t('feature1Title')}</h3>
            <p className="text-sm text-gray-400">
              {t('feature1Desc')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">{t('feature2Title')}</h3>
            <p className="text-sm text-gray-400">
              {t('feature2Desc')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">{t('feature3Title')}</h3>
            <p className="text-sm text-gray-400">
              {t('feature3Desc')}
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            {t('getStartedButton')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Gift CTA
function GiftCTA() {
  const t = useTranslations('common.cta.gift')

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
          {t('title')}
        </h2>

        <p className="text-lg mb-8 text-white/90">
          {t('subtitle')}
        </p>

        <Button
          size="lg"
          className="bg-white text-pink-600 hover:bg-gray-100"
        >
          {t('sendGiftButton')}
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
