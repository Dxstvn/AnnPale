"use client"

import * as React from "react"
import {
  Search,
  MessageSquare,
  Gift,
  Heart,
  ArrowRight,
  Play,
  CheckCircle,
  Clock,
  Shield,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

interface Step {
  number: string
  icon: React.ReactNode
  title: string
  description: string
  detail?: string
}

interface HowItWorksProps {
  variant?: "default" | "compact" | "detailed" | "timeline"
  showVideo?: boolean
  className?: string
}

// Move steps array inside component to use translations
function getSteps(t: any): Step[] {
  return [
    {
      number: "01",
      icon: <Search className="h-6 w-6" />,
      title: t('step1Title'),
      description: t('step1Desc'),
      detail: t('step1Detail')
    },
    {
      number: "02",
      icon: <MessageSquare className="h-6 w-6" />,
      title: t('step2Title'),
      description: t('step2Desc'),
      detail: t('step2Detail')
    },
    {
      number: "03",
      icon: <Gift className="h-6 w-6" />,
      title: t('step3Title'),
      description: t('step3Desc'),
      detail: t('step3Detail')
    },
    {
      number: "04",
      icon: <Heart className="h-6 w-6" />,
      title: t('step4Title'),
      description: t('step4Desc'),
      detail: t('step4Detail')
    }
  ]
}

// Default Step Card
function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center"
    >
      {/* Number Badge */}
      <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full mb-4 font-bold text-lg">
        {step.number}
      </div>

      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
        {step.icon}
      </div>

      {/* Content */}
      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
    </motion.div>
  )
}

// Detailed Step Card
function DetailedStepCard({ step, index }: { step: Step; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className={cn(
        "flex gap-6",
        index % 2 === 1 && "flex-row-reverse"
      )}
    >
      {/* Visual */}
      <div className="flex-1">
        <div className="relative h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white/50 backdrop-blur rounded-full flex items-center justify-center">
              {React.cloneElement(step.icon as React.ReactElement, { className: "h-12 w-12 text-purple-600" })}
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary">{step.number}</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center">
        <div>
          <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{step.description}</p>
          {step.detail && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {step.detail}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Timeline Step
function TimelineStep({ step, index, isLast }: { step: Step; index: number; isLast: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative flex gap-6"
    >
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      )}

      {/* Icon */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-12 h-12 bg-white dark:bg-gray-800 border-2 border-purple-600 rounded-full flex items-center justify-center">
          {step.icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <Badge variant="outline" className="mb-2">{step.number}</Badge>
        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
        {step.detail && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {step.detail}
          </p>
        )}
      </div>
    </motion.div>
  )
}

// Video Section
function VideoSection({ t }: { t: any }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 p-1">
      <div className="relative bg-black rounded-xl overflow-hidden">
        <div className="aspect-video flex items-center justify-center">
          <button className="group">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:bg-white/30 transition">
              <Play className="h-10 w-10 text-white ml-1" />
            </div>
          </button>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <p className="font-semibold">{t('videoTitle')}</p>
          <p className="text-sm opacity-90">{t('videoDuration')}</p>
        </div>
      </div>
    </div>
  )
}

// Main Component
export function HowItWorks({
  variant = "default",
  showVideo = false,
  className
}: HowItWorksProps) {
  const t = useTranslations('common.howItWorks')
  const steps = getSteps(t)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          <Zap className="h-3 w-3 mr-1" />
          {t('badge')}
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Video Section */}
      {showVideo && (
        <div className="max-w-3xl mx-auto mb-12">
          <VideoSection t={t} />
        </div>
      )}

      {/* Steps */}
      {variant === "timeline" && (
        <div className="max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <TimelineStep
              key={step.number}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      )}

      {variant === "detailed" && (
        <div className="space-y-16">
          {steps.map((step, index) => (
            <DetailedStepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      )}

      {variant === "default" && (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </motion.div>
      )}

      {/* Trust Indicators */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 justify-center">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium">{t('trustBadge1')}</span>
        </div>
        <div className="flex items-center gap-3 justify-center">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">{t('trustBadge2')}</span>
        </div>
        <div className="flex items-center gap-3 justify-center">
          <CheckCircle className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium">{t('trustBadge3')}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Button size="lg" variant="primary">
          {t('ctaButton')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default HowItWorks
