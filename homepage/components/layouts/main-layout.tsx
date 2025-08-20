"use client"

import { ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Header, HeaderVariant } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { SearchOverlay } from "@/components/navigation/search-overlay"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { Breadcrumbs } from "@/components/navigation/breadcrumbs"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: ReactNode
  headerVariant?: HeaderVariant
  showBreadcrumbs?: boolean
  showFooter?: boolean
  className?: string
  contentClassName?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: boolean
  animated?: boolean
}

export function MainLayout({
  children,
  headerVariant = "default",
  showBreadcrumbs = true,
  showFooter = true,
  className,
  contentClassName,
  maxWidth = "2xl",
  padding = true,
  animated = false
}: MainLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const pathname = usePathname()

  // Mock auth state - replace with actual auth context
  const isAuthenticated = false
  const user = null

  // Close mobile nav on route change
  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])

  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md", 
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full"
  }

  const content = (
    <>
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Header */}
      <Header
        variant={headerVariant}
        onSearchClick={() => setIsSearchOpen(true)}
        onMenuClick={() => setIsMobileNavOpen(true)}
        isAuthenticated={isAuthenticated}
        user={user}
      />

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <MobileNav
            isOpen={isMobileNavOpen}
            onClose={() => setIsMobileNavOpen(false)}
            isAuthenticated={isAuthenticated}
            user={user}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main 
        id="main-content"
        className={cn(
          "min-h-screen",
          headerVariant === "transparent" ? "pt-0" : "pt-16",
          className
        )}
      >
        {/* Breadcrumbs */}
        {showBreadcrumbs && pathname !== "/" && (
          <div className="container mx-auto px-4 py-4">
            <Breadcrumbs />
          </div>
        )}

        {/* Page Content */}
        <div 
          className={cn(
            "mx-auto",
            maxWidthClasses[maxWidth],
            padding && "px-4 py-8",
            contentClassName
          )}
        >
          {children}
        </div>
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    )
  }

  return content
}