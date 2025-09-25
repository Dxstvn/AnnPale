"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Globe,
  CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { useTranslations } from "next-intl"

// Creator data type
interface Creator {
  id: string
  name: string
  category: string
  avatar: string
  coverImage?: string
  rating: number
  price: number
  responseTime: string
  languages: string[]
  verified: boolean
  videoCount: number
}

// Carousel props
interface FeaturedCreatorsCarouselProps {
  creators?: Creator[]
  variant?: "default" | "featured" | "compact"
  autoplay?: boolean
  autoplayDelay?: number
  className?: string
}

// Mock data for demonstration
const mockCreators: Creator[] = [
  {
    id: "1",
    name: "Wyclef Jean",
    category: "music",
    avatar: "/images/wyclef-jean.png",
    coverImage: "/images/wyclef-jean.png",
    rating: 4.9,
    price: 250,
    responseTime: "responseTime24Hours",
    languages: ["English", "Haitian Creole", "French"],
    verified: true,
    videoCount: 342
  },
  {
    id: "2",
    name: "Ti Jo Zenny",
    category: "comedy",
    avatar: "/images/ti-jo-zenny.jpg",
    coverImage: "/images/ti-jo-zenny.jpg",
    rating: 4.8,
    price: 75,
    responseTime: "responseTime2Days",
    languages: ["Haitian Creole"],
    verified: true,
    videoCount: 156
  },
  {
    id: "3",
    name: "Michael Brun",
    category: "djProducer",
    avatar: "/images/michael-brun.jpg",
    coverImage: "/images/michael-brun.jpg",
    rating: 4.9,
    price: 150,
    responseTime: "responseTime3Days",
    languages: ["English", "French"],
    verified: true,
    videoCount: 89
  },
  {
    id: "4",
    name: "Rutshelle Guillaume",
    category: "singer",
    avatar: "/images/rutshelle-guillaume.jpg",
    coverImage: "/images/rutshelle-guillaume.jpg",
    rating: 4.7,
    price: 100,
    responseTime: "responseTime24Hours",
    languages: ["Haitian Creole", "English"],
    verified: true,
    videoCount: 203
  },
  {
    id: "5",
    name: "Carel Pedre",
    category: "radioHost",
    avatar: "/images/carel-pedre.jpg",
    coverImage: "/images/carel-pedre.jpg",
    rating: 4.8,
    price: 200,
    responseTime: "responseTime5Days",
    languages: ["Haitian Creole", "French"],
    verified: true,
    videoCount: 178
  }
]

// Creator Card Component
function CreatorCard({
  creator,
  variant = "default"
}: {
  creator: Creator
  variant?: "default" | "featured" | "compact"
}) {
  const t = useTranslations('common.creators')
  const tCategories = useTranslations('common.categories')
  const [isHovered, setIsHovered] = React.useState(false)
  // Ensure translation hook is available throughout component

  const cardSizes = {
    default: "w-[280px] h-[400px]",
    featured: "w-[320px] h-[450px]",
    compact: "w-[200px] h-[250px]"
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className={cn(
          "relative overflow-hidden cursor-pointer group card-hover",
          "transition-all duration-300 hover:scale-105",
          "hover:shadow-2xl hover:ring-2 hover:ring-purple-400/50",
          cardSizes[variant]
        )}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-gradient-to-b from-transparent to-black/60"
            style={{
              backgroundImage: `url(${creator.coverImage || creator.avatar})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
        </div>

        {/* Content */}
        <CardContent className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
          {/* Creator Info */}
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={creator.avatar} />
              <AvatarFallback>{creator.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{creator.name}</h3>
                {creator.verified && (
                  <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-300">{tCategories(creator.category)}</p>
            </div>
          </div>

          {/* Stats */}
          {variant !== "compact" && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{creator.rating}</span>
                  <span className="text-gray-400">({creator.videoCount})</span>
                </div>
                <span className="font-semibold">${creator.price}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-300">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{t(creator.responseTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span>{creator.languages.length} {t('languages')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action */}
          {variant === "featured" && (
            <Button
              size="sm"
              variant="primary"
              className="w-full mt-3 bg-white/20 backdrop-blur hover:bg-white/30"
            >
              {t('bookNow')}
            </Button>
          )}
        </CardContent>

        {/* Badges */}
        {variant !== "compact" && (
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {creator.videoCount > 100 && (
              <Badge variant="success" className="bg-green-500/90 backdrop-blur">
                {t('popular')}
              </Badge>
            )}
            {creator.responseTime === "responseTime24Hours" && (
              <Badge variant="info" className="bg-blue-500/90 backdrop-blur">
                {t('fastResponse')}
              </Badge>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  )
}

// Main Carousel Component
export function FeaturedCreatorsCarousel({
  creators = mockCreators,
  variant = "default",
  autoplay = true,
  autoplayDelay = 5000,
  className
}: FeaturedCreatorsCarouselProps) {
  const t = useTranslations('common.creators')
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      skipSnaps: false,
      containScroll: "trimSnaps"
    },
    autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: true })] : []
  )

  const [prevBtnEnabled, setPrevBtnEnabled] = React.useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = React.useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return

    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div className={cn("relative", className)}>
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 md:gap-6">
          {creators.map((creator) => (
            <div key={creator.id} className="flex-[0_0_auto]">
              <CreatorCard creator={creator} variant={variant} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Desktop Only */}
      <div className="hidden md:block">
        <button
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4",
            "w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg",
            "flex items-center justify-center",
            "hover:bg-gray-50 dark:hover:bg-gray-700 transition",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4",
            "w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg",
            "flex items-center justify-center",
            "hover:bg-gray-50 dark:hover:bg-gray-700 transition",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === selectedIndex 
                ? "w-8 bg-purple-600" 
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default FeaturedCreatorsCarousel