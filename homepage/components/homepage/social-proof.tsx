"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface Testimonial {
  id: string
  name: string
  avatar?: string
  rating: number
  text: string
  role: string
  flag?: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Marie Joseph",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "My favorite artist sent me a birthday message! It was so personal and heartfelt. Best gift ever!",
    role: "Fan from Miami",
    flag: "🇺🇸",
  },
  {
    id: "2",
    name: "Jean Baptiste",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "Ann Pale helps me connect with my fans worldwide. The platform is easy to use and payments are reliable.",
    role: "Music Artist",
    flag: "🇭🇹",
  },
  {
    id: "3",
    name: "Sophie Laurent",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "Surprised my mom with a video from her favorite comedian. She cried tears of joy!",
    role: "Gift Giver from Montreal",
    flag: "🇨🇦",
  },
]

interface SocialProofProps {
  className?: string
  variant?: "carousel" | "grid" | "minimal"
}

export function SocialProof({ className, variant = "grid" }: SocialProofProps) {
  const t = useTranslations('common')
  if (variant === "minimal") {
    return (
      <div className={cn("text-center", className)}>
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-lg font-medium mb-1">Trusted by 25,000+ fans worldwide</p>
        <p className="text-sm text-gray-600">4.9/5 average rating</p>
      </div>
    )
  }

  return (
    <div className={cn("", className)}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          What Our Community Says
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Join thousands of happy fans and creators connecting through personalized videos
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow p-6">
              <Quote className="h-8 w-8 text-purple-200 mb-4" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-600">
                    {testimonial.flag} {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">500+</p>
          <p className="text-sm text-gray-600">Verified Creators</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">24/7</p>
          <p className="text-sm text-gray-600">Customer Support</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">100%</p>
          <p className="text-sm text-gray-600">Secure Payments</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">48hr</p>
          <p className="text-sm text-gray-600">Delivery Guarantee</p>
        </div>
      </div>
    </div>
  )
}

export default SocialProof
