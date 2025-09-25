"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AnimatedBackground } from "./animated-background"
import { StatsCounter } from "./stats-counter"
import { Search, Play, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTranslations } from "next-intl"

interface HeroSectionProps {
  variant?: "default" | "video" | "carousel" | "split"
  title?: string
  subtitle?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export function HeroSection({
  variant = "default",
  title,
  subtitle,
  searchPlaceholder,
  onSearch,
  className,
}: HeroSectionProps) {
  const t = useTranslations('common.hero')
  const tButtons = useTranslations('common.buttons')
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  // Get translated content
  const defaultTitle = title || t('title')
  const defaultSubtitle = subtitle || t('subtitle')
  const defaultPlaceholder = searchPlaceholder || t('searchPlaceholder')
  
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim())
      } else {
        // Default behavior: navigate to browse page with search query
        router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <section
      ref={heroRef}
      className={cn(
        "relative overflow-hidden",
        variant === "default" && "bg-gradient-to-r from-purple-600 to-pink-600",
        variant === "video" && "bg-black",
        className
      )}
    >
      {/* Animated Background */}
      {variant === "default" && (
        <AnimatedBackground variant="blobs" className="opacity-30" />
      )}

      {/* Video Background */}
      {variant === "video" && (
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        </div>
      )}

      {/* Parallax Background Layer */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">
          🎤
        </div>
        <div className="absolute top-40 right-20 text-5xl opacity-20 animate-float animation-delay-2000">
          🎵
        </div>
        <div className="absolute bottom-20 left-1/4 text-7xl opacity-20 animate-float animation-delay-4000">
          🎭
        </div>
        <div className="absolute bottom-40 right-1/4 text-6xl opacity-20 animate-float animation-delay-6000">
          🎨
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10"
      >
        <div className="container mx-auto px-4 py-16 sm:py-24 md:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="max-w-4xl mx-auto text-center text-white"
          >
            {/* Announcement Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Sparkles className="h-3 w-3 mr-1" />
                {t('badge')}
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-100">
                {defaultTitle}
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto"
            >
              {defaultSubtitle}
            </motion.p>

            {/* Search Bar or CTAs */}
            <motion.div variants={itemVariants} className="mb-12">
              {variant === "split" ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl"
                    asChild
                  >
                    <Link href="/browse">
                      {tButtons('viewAll')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/signup">
                      {tButtons('getStarted')}
                      <Play className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
                >
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={defaultPlaceholder}
                      className="h-14 pl-12 pr-4 text-lg bg-white/90 backdrop-blur border-0 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 px-8 bg-white text-purple-600 hover:bg-gray-100 shadow-xl"
                  >
                    {t('searchButton')}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={itemVariants}>
              <StatsCounter />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

    </section>
  )
}

export default HeroSection
