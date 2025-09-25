'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/language-context'
import { LandingHeader } from '@/components/layouts/landing-header'
import { Footer } from '@/components/navigation/footer'

// Eagerly load above-fold components
import HeroSection from '@/components/homepage/hero-section'
import FeaturedCreatorsCarousel from '@/components/homepage/featured-creators-carousel'
import CategoryShowcase from '@/components/homepage/category-showcase'

// Use dynamic imports with ssr: false for below-fold components to prevent hydration issues
const HowItWorks = dynamic(() => import('@/components/homepage/how-it-works'), {
  loading: () => <div className="animate-pulse h-64 rounded-lg bg-gray-200"></div>,
  ssr: false
})
const Testimonials = dynamic(() => import('@/components/homepage/testimonials'), {
  loading: () => <div className="animate-pulse h-64 rounded-lg bg-gray-200"></div>,
  ssr: false
})
const SocialProof = dynamic(() => import('@/components/homepage/social-proof'), {
  loading: () => <div className="animate-pulse h-64 rounded-lg bg-gray-200"></div>,
  ssr: false
})
const CallToAction = dynamic(() => import('@/components/homepage/call-to-action'), {
  loading: () => <div className="animate-pulse h-64 rounded-lg bg-gray-200"></div>,
  ssr: false
})

// Loading fallback component
const SectionLoader = () => (
  <div className="animate-pulse">
    <div className="h-64 rounded-lg bg-gray-200"></div>
  </div>
)

export default function HomePage() {
  const { language } = useLanguage()

  return (
    <div>
      <LandingHeader />
      <div className="relative min-h-screen overflow-hidden bg-white">
        {/* Decorative Cultural Emojis - Positioned Absolutely */}
        <div className="pointer-events-none fixed inset-0 z-0">
          {/* Top-left */}
          <div className="absolute top-20 left-10 rotate-12 transform animate-pulse text-6xl opacity-10">
            🎵
          </div>
          {/* Bottom-left */}
          <div className="absolute bottom-20 left-16 rotate-45 transform text-7xl opacity-10">
            🎨
          </div>
          {/* Top-right */}
          <div className="absolute top-32 right-12 -rotate-12 transform text-6xl opacity-10">
            🎭
          </div>
          {/* Bottom-right */}
          <div className="absolute right-20 bottom-24 rotate-12 transform animate-pulse text-8xl opacity-10">
            😂
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Hero Section with Phase 0 Gradient */}
          <section className="relative">
            <div
              className="absolute inset-0 rotate-180 transform bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600"
              style={{ background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)' }}
            />
            <div className="relative">
              <HeroSection />
            </div>
          </section>

          {/* Featured Creators Section */}
          <section className="section-spacing px-4 py-16 md:px-8 md:py-24">
            <div className="container mx-auto">
              <FeaturedCreatorsCarousel />
            </div>
          </section>

          {/* Category Showcase Section */}
          <section className="section-spacing bg-gray-50 px-4 py-16 md:px-8 md:py-24">
            <div className="container mx-auto">
              <CategoryShowcase />
            </div>
          </section>

          {/* How It Works Section - Lazy Loaded */}
          <section className="section-spacing px-4 py-16 md:px-8 md:py-24">
            <div className="container mx-auto">
              <HowItWorks />
            </div>
          </section>

          {/* Social Proof Section - Lazy Loaded */}
          <section className="section-spacing bg-gray-50 px-4 py-16 md:px-8 md:py-24">
            <div className="container mx-auto">
              <SocialProof />
            </div>
          </section>

          {/* Testimonials Section - Lazy Loaded */}
          <section className="section-spacing px-4 py-16 md:px-8 md:py-24">
            <div className="container mx-auto">
              <Testimonials />
            </div>
          </section>

          {/* Call to Action Section - Lazy Loaded */}
          <section className="section-spacing relative">
            <div
              className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600"
              style={{ background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)' }}
            />
            <div className="relative px-4 py-16 md:px-8 md:py-24">
              <div className="container mx-auto">
                <CallToAction />
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
