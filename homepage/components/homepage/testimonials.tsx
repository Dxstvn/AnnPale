"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Quote, Star, Play, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { useTranslations } from "next-intl"

interface Testimonial {
  id: string
  type: "text" | "video"
  author: {
    name: string
    location: string
    avatar?: string
  }
  creator?: {
    name: string
    category: string
  }
  content: string
  rating: number
  videoUrl?: string
  thumbnailUrl?: string
  date: string
}

interface TestimonialsProps {
  testimonials?: Testimonial[]
  variant?: "carousel" | "grid" | "featured"
  autoplay?: boolean
  className?: string
}

const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    type: "video",
    author: {
      name: "Marie Joseph",
      location: "Miami, FL",
      avatar: "/placeholder-user.jpg"
    },
    creator: {
      name: "Wyclef Jean",
      category: "Music"
    },
    content: "My mother cried tears of joy when she received the birthday message from Wyclef! It was the perfect gift that connected her back to Haiti.",
    rating: 5,
    videoUrl: "/videos/testimonial-1.mp4",
    thumbnailUrl: "/placeholder.jpg",
    date: "2 weeks ago"
  },
  {
    id: "2",
    type: "text",
    author: {
      name: "Jean-Pierre Louis",
      location: "Montreal, Canada",
      avatar: "/placeholder-user.jpg"
    },
    creator: {
      name: "Ti Jo Zenny",
      category: "Comedy"
    },
    content: "Ti Jo's message had our entire family laughing! He personalized the jokes perfectly for my brother's graduation. Worth every penny!",
    rating: 5,
    date: "1 month ago"
  },
  {
    id: "3",
    type: "text",
    author: {
      name: "Sophia Michel",
      location: "Brooklyn, NY",
      avatar: "/placeholder-user.jpg"
    },
    creator: {
      name: "Darline Desca",
      category: "Actress"
    },
    content: "Darline's encouragement message for my daughter was so heartfelt and inspiring. She really took the time to make it special.",
    rating: 5,
    date: "3 weeks ago"
  },
  {
    id: "4",
    type: "video",
    author: {
      name: "Emmanuel Toussaint",
      location: "Paris, France",
      avatar: "/placeholder-user.jpg"
    },
    creator: {
      name: "Michael Brun",
      category: "DJ/Producer"
    },
    content: "The wedding congratulations from Michael Brun made our special day even more memorable. All our guests were amazed!",
    rating: 5,
    videoUrl: "/videos/testimonial-2.mp4",
    thumbnailUrl: "/placeholder.jpg",
    date: "2 months ago"
  }
]

// Single Testimonial Card
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [playVideo, setPlayVideo] = React.useState(false)

  return (
    <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow p-6">
      {/* Quote Icon */}
      <div className="mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          <Quote className="h-6 w-6 text-purple-600" />
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < testimonial.rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
        ))}
      </div>

      {/* Content */}
      {testimonial.type === "video" && testimonial.thumbnailUrl && !playVideo ? (
        <div className="relative mb-4 rounded-lg overflow-hidden group cursor-pointer"
             onClick={() => setPlayVideo(true)}>
          <img
            src={testimonial.thumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="h-6 w-6 text-purple-600 ml-0.5" />
            </div>
          </div>
        </div>
      ) : testimonial.type === "video" && playVideo ? (
        <div className="mb-4 rounded-lg overflow-hidden">
          <video
            src={testimonial.videoUrl}
            controls
            autoPlay
            className="w-full h-48 object-cover"
          />
        </div>
      ) : null}

      <p className="text-gray-700 mb-4 line-clamp-3">
        "{testimonial.content}"
      </p>

      {/* Creator Info */}
      {testimonial.creator && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Video from <span className="font-semibold text-purple-600">{testimonial.creator.name}</span>
          </p>
          <p className="text-xs text-gray-500">{testimonial.creator.category}</p>
        </div>
      )}

      {/* Author */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={testimonial.author.avatar} />
            <AvatarFallback>
              {testimonial.author.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm text-gray-900">{testimonial.author.name}</p>
            <p className="text-xs text-gray-500">{testimonial.author.location}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">{testimonial.date}</p>
      </div>
    </div>
  )
}

// Featured Testimonial
function FeaturedTestimonial({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Video/Image */}
          {testimonial.type === "video" && testimonial.thumbnailUrl && (
            <div className="flex-shrink-0">
              <div className="relative w-full md:w-80 rounded-xl overflow-hidden">
                <img
                  src={testimonial.thumbnailUrl}
                  alt="Testimonial"
                  className="w-full h-48 md:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="h-8 w-8 text-purple-600 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            <Quote className="h-12 w-12 text-purple-600 mb-4" />
            
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 mb-6">
              "{testimonial.content}"
            </p>

            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={testimonial.author.avatar} />
                <AvatarFallback>
                  {testimonial.author.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{testimonial.author.name}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {testimonial.author.location} • {testimonial.date}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Testimonials Component
export function Testimonials({
  testimonials = mockTestimonials,
  variant = "carousel",
  autoplay = true,
  className
}: TestimonialsProps) {
  const t = useTranslations('common.testimonials')
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    autoplay ? [Autoplay({ delay: 6000, stopOnInteraction: true })] : []
  )
  
  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (variant === "featured" && testimonials.length > 0) {
    return (
      <div className={className}>
        <FeaturedTestimonial testimonial={testimonials[0]} />
      </div>
    )
  }

  if (variant === "grid") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {testimonials.slice(0, 6).map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    )
  }

  // Carousel variant
  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="hidden md:flex justify-between mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default Testimonials
