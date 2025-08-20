"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"
import Link from "next/link"
import { Shield, Users, Star, CheckCircle, Globe, Sparkles } from "lucide-react"

interface AuthLayoutProps {
  children: ReactNode
  className?: string
  variant?: "login" | "signup" | "reset"
}

export function AuthLayout({ children, className, variant = "login" }: AuthLayoutProps) {
  const { language } = useLanguage()
  
  // Trust signals data
  const trustSignals = [
    { icon: Shield, key: "secure", color: "text-green-600" },
    { icon: Users, key: "users", color: "text-blue-600" },
    { icon: Star, key: "rating", color: "text-yellow-600" },
    { icon: CheckCircle, key: "verified", color: "text-purple-600" }
  ]

  // Testimonials
  const testimonials = [
    {
      quote: "auth.testimonials.quote1",
      author: "Marie J.",
      role: "auth.testimonials.role1"
    },
    {
      quote: "auth.testimonials.quote2", 
      author: "Pierre L.",
      role: "auth.testimonials.role2"
    },
    {
      quote: "auth.testimonials.quote3",
      author: "Sophia M.", 
      role: "auth.testimonials.role3"
    }
  ]

  const currentTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header */}
        <header className="p-6 lg:p-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl lg:text-2xl">
            <motion.span 
              className="text-2xl lg:text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🎤
            </motion.span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ann Pale
            </span>
          </Link>
        </header>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                <Users className="h-4 w-4" />
                <span>{getTranslation("auth.socialProof", language, "Join 10,000+ happy users")}</span>
              </div>
            </motion.div>

            {/* Main Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={className}
            >
              {children}
            </motion.div>

            {/* Trust Signals */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              {trustSignals.slice(0, 2).map((signal, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <signal.icon className={cn("h-4 w-4", signal.color)} />
                  <span>{getTranslation(`auth.trust.${signal.key}`, language)}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <Link href="/terms" className="hover:text-purple-600 transition">
              {getTranslation("nav.terms", language)}
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/privacy" className="hover:text-purple-600 transition">
              {getTranslation("nav.privacy", language)}
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/help" className="hover:text-purple-600 transition">
              {getTranslation("nav.help", language)}
            </Link>
          </div>
        </footer>
      </div>

      {/* Right Side - Decorative Section (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-600 via-pink-500 to-purple-600 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          {/* Cultural Elements */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 text-6xl">
              <span>🇭🇹</span>
              <span>🎤</span>
              <span>🎵</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-3xl lg:text-4xl font-bold text-center mb-6"
          >
            {getTranslation(`auth.${variant}.hero.title`, language)}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-center mb-12 max-w-md opacity-90"
          >
            {getTranslation(`auth.${variant}.hero.subtitle`, language)}
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4 mb-12"
          >
            {["feature1", "feature2", "feature3"].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="text-lg">
                  {getTranslation(`auth.${variant}.features.${feature}`, language)}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-lg mb-3 italic">
              "{getTranslation(currentTestimonial.quote, language)}"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20" />
              <div>
                <div className="font-semibold">{currentTestimonial.author}</div>
                <div className="text-sm opacity-80">
                  {getTranslation(currentTestimonial.role, language)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 flex items-center gap-2 text-sm opacity-80"
          >
            <Shield className="h-4 w-4" />
            <span>{getTranslation("auth.security.badge", language)}</span>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <Sparkles className="absolute top-10 right-10 h-8 w-8 text-white/20" />
        <Globe className="absolute bottom-10 left-10 h-8 w-8 text-white/20" />
      </div>
    </div>
  )
}