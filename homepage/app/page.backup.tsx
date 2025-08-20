"use client"

import { Suspense, lazy } from "react"
import dynamic from "next/dynamic"
import { useLanguage } from "@/contexts/language-context"

// Eagerly load above-fold components
import HeroSection from "@/components/homepage/hero-section"
import FeaturedCreatorsCarousel from "@/components/homepage/featured-creators-carousel"
import CategoryShowcase from "@/components/homepage/category-showcase"

// Lazy load below-fold components
const HowItWorks = lazy(() => import("@/components/homepage/how-it-works"))
const Testimonials = lazy(() => import("@/components/homepage/testimonials"))
const SocialProof = lazy(() => import("@/components/homepage/social-proof"))
const CallToAction = lazy(() => import("@/components/homepage/call-to-action"))

// Loading fallback component
const SectionLoader = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 rounded-lg"></div>
  </div>
)

export default function HomePage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Cultural Emojis - Positioned Absolutely */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top-left */}
        <div className="absolute top-20 left-10 text-6xl opacity-10 transform rotate-12 animate-pulse">
          🎵
        </div>
        {/* Bottom-left */}
        <div className="absolute bottom-20 left-16 text-7xl opacity-10 transform rotate-45">
          🎨
        </div>
        {/* Top-right */}
        <div className="absolute top-32 right-12 text-6xl opacity-10 transform -rotate-12">
          🎭
        </div>
        {/* Bottom-right */}
        <div className="absolute bottom-24 right-20 text-8xl opacity-10 transform rotate-12 animate-pulse">
          😂
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section with Phase 0 Gradient */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 transform rotate-180" 
               style={{ background: "linear-gradient(135deg, #9333EA 0%, #EC4899 100%)" }} />
          <div className="relative">
            <HeroSection />
          </div>
        </section>

        {/* Featured Creators Section */}
        <section className="py-16 md:py-24 px-4 md:px-8 section-spacing">
          <div className="container mx-auto">
            <FeaturedCreatorsCarousel />
          </div>
        </section>

        {/* Category Showcase Section */}
        <section className="py-16 md:py-24 px-4 md:px-8 bg-gray-50 section-spacing">
          <div className="container mx-auto">
            <CategoryShowcase />
          </div>
        </section>

        {/* How It Works Section - Lazy Loaded */}
        <section className="py-16 md:py-24 px-4 md:px-8 section-spacing">
          <div className="container mx-auto">
            <Suspense fallback={<SectionLoader />}>
              <HowItWorks />
            </Suspense>
          </div>
        </section>

        {/* Social Proof Section - Lazy Loaded */}
        <section className="py-16 md:py-24 px-4 md:px-8 bg-gray-50 section-spacing">
          <div className="container mx-auto">
            <Suspense fallback={<SectionLoader />}>
              <SocialProof />
            </Suspense>
          </div>
        </section>

        {/* Testimonials Section - Lazy Loaded */}
        <section className="py-16 md:py-24 px-4 md:px-8 section-spacing">
          <div className="container mx-auto">
            <Suspense fallback={<SectionLoader />}>
              <Testimonials />
            </Suspense>
          </div>
        </section>

        {/* Call to Action Section - Lazy Loaded */}
        <section className="relative section-spacing">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600"
               style={{ background: "linear-gradient(135deg, #9333EA 0%, #EC4899 100%)" }} />
          <div className="relative py-16 md:py-24 px-4 md:px-8">
            <div className="container mx-auto">
              <Suspense fallback={<SectionLoader />}>
                <CallToAction />
              </Suspense>
            </div>
          </div>
        </section>
      </div>

    </div>
  )
}