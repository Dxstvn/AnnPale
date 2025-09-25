"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, Video, Star, Globe } from "lucide-react"
import { useTranslations } from "next-intl"

interface Stat {
  label: string
  value: number
  suffix?: string
  icon: React.ReactNode
}

function getStats(t: any): Stat[] {
  return [
    {
      label: t('activeCreators'),
      value: 500,
      suffix: "+",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: t('videosDelivered'),
      value: 10000,
      suffix: "+",
      icon: <Video className="h-5 w-5" />,
    },
    {
      label: t('happyCustomers'),
      value: 25000,
      suffix: "+",
      icon: <Star className="h-5 w-5" />,
    },
    {
      label: t('countries'),
      value: 15,
      suffix: "",
      icon: <Globe className="h-5 w-5" />,
    },
  ]
}

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
}

function Counter({ end, duration = 2, suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(countRef, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        requestAnimationFrame(animateCount)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animateCount)
  }, [end, duration, isInView])

  return (
    <div ref={countRef} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </div>
  )
}

export function StatsCounter() {
  const t = useTranslations('common.stats')
  const stats = getStats(t)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur mb-3">
            {stat.icon}
          </div>
          <div className="text-3xl md:text-4xl font-bold mb-1">
            <Counter end={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-sm opacity-80">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}