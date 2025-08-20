"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"

interface AuthLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  showBackButton?: boolean
  className?: string
  backgroundVariant?: "gradient" | "pattern" | "image" | "simple"
}

export function AuthLayout({
  children,
  title,
  subtitle,
  showBackButton = true,
  className,
  backgroundVariant = "gradient"
}: AuthLayoutProps) {
  const backgroundClasses = {
    gradient: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
    pattern: "bg-white dark:bg-gray-900",
    image: "bg-cover bg-center",
    simple: "bg-gray-50 dark:bg-gray-900"
  }

  return (
    <div className={cn("min-h-screen flex", backgroundClasses[backgroundVariant], className)}>
      {/* Background Pattern Overlay */}
      {backgroundVariant === "pattern" && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="text-4xl">🎤</span>
            <span className="text-2xl font-bold">Ann Pale</span>
          </Link>

          {/* Hero Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Connect with Haitian Celebrities
            </h1>
            <p className="text-lg opacity-90">
              Get personalized video messages from your favorite stars. 
              Perfect for birthdays, celebrations, or just to make someone smile.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm opacity-75">Creators</p>
              </div>
              <div>
                <p className="text-3xl font-bold">50K+</p>
                <p className="text-sm opacity-75">Happy Fans</p>
              </div>
              <div>
                <p className="text-3xl font-bold">4.9</p>
                <p className="text-sm opacity-75">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-6 text-sm opacity-75">
            <Link href="/about" className="hover:opacity-100 transition">About</Link>
            <Link href="/help" className="hover:opacity-100 transition">Help</Link>
            <Link href="/privacy" className="hover:opacity-100 transition">Privacy</Link>
            <Link href="/terms" className="hover:opacity-100 transition">Terms</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-3xl">🎤</span>
              <span className="text-xl font-bold">Ann Pale</span>
            </Link>
          </div>

          {/* Back Button */}
          {showBackButton && (
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to home</span>
            </Link>
          )}

          {/* Card Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {/* Title & Subtitle */}
            {(title || subtitle) && (
              <div className="mb-6 text-center">
                {title && (
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Form Content */}
            {children}
          </div>

          {/* Additional Links */}
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-purple-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-purple-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}