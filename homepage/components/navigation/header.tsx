"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  ShoppingCart,
  ChevronDown,
  Globe
} from "lucide-react"
import { UserMenu } from "./user-menu"
import { MobileNav } from "./mobile-nav"
import { SearchOverlay } from "./search-overlay"
import { LanguageToggle } from "@/components/language-toggle"
import { motion, AnimatePresence } from "framer-motion"

export type HeaderVariant = "default" | "transparent" | "minimal" | "dashboard"

interface HeaderProps {
  variant?: HeaderVariant
  className?: string
}

export function Header({ variant = "default", className }: HeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  
  // Mock auth state - replace with real auth
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [cartCount, setCartCount] = useState(2)
  const [notificationCount, setNotificationCount] = useState(3)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Determine scroll direction
      setIsScrollingUp(currentScrollY < lastScrollY || currentScrollY < 50)
      setLastScrollY(currentScrollY)
      
      // Set scrolled state
      setIsScrolled(currentScrollY > 50)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Determine header style based on variant and scroll
  const isTransparent = variant === "transparent" && !isScrolled
  const shouldHide = !isScrollingUp && isScrolled && variant !== "minimal"

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      "bg-white/95 backdrop-blur-md shadow-sm": !isTransparent,
      "bg-transparent": isTransparent,
      "text-white": isTransparent,
      "text-gray-900": !isTransparent,
      "-translate-y-full": shouldHide,
      "translate-y-0": !shouldHide,
    },
    className
  )

  return (
    <>
      <header className={headerClasses}>
        {/* Top Bar - Desktop Only */}
        {variant === "default" && !isScrolled && (
          <div className="hidden lg:block border-b border-gray-200/20">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-8 text-sm">
                <div className="flex items-center gap-4">
                  <span className="opacity-70">Welcome to Ann Pale</span>
                  <Link href="/help" className="hover:opacity-100 opacity-70 transition">
                    Help
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 hover:opacity-100 opacity-70 transition">
                    <Globe className="h-3 w-3" />
                    <span>USD</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link 
                href="/" 
                className="flex items-center gap-2 font-bold text-xl hover:scale-105 transition-transform"
              >
                <span className="text-2xl">🎤</span>
                <span>Ann Pale</span>
              </Link>

              {/* Desktop Navigation */}
              {variant !== "minimal" && (
                <div className="hidden lg:flex items-center gap-6">
                  <div className="relative group">
                    <button className={cn(
                      "flex items-center gap-1 py-2 transition",
                      isTransparent ? "hover:text-white/80" : "hover:text-purple-600"
                    )}>
                      Browse
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {/* Dropdown will go here */}
                  </div>
                  <Link 
                    href="/how-it-works"
                    className={cn(
                      "py-2 transition",
                      isTransparent ? "hover:text-white/80" : "hover:text-purple-600"
                    )}
                  >
                    How It Works
                  </Link>
                  <Link 
                    href="/business"
                    className={cn(
                      "py-2 transition",
                      isTransparent ? "hover:text-white/80" : "hover:text-purple-600"
                    )}
                  >
                    For Business
                  </Link>
                  {isAuthenticated && (
                    <Link 
                      href="/creator/dashboard"
                      className={cn(
                        "py-2 transition",
                        isTransparent ? "hover:text-white/80" : "hover:text-purple-600"
                      )}
                    >
                      Creator Dashboard
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "relative",
                  isTransparent && "hover:bg-white/10"
                )}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications - Authenticated Only */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative",
                    isTransparent && "hover:bg-white/10"
                  )}
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              )}

              {/* Cart */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative",
                    isTransparent && "hover:bg-white/10"
                  )}
                  asChild
                >
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
              )}

              {/* Language Toggle */}
              <div className="hidden sm:block">
                <LanguageToggle />
              </div>

              {/* User Menu / Auth Buttons */}
              <div className="hidden lg:flex items-center gap-2">
                {isAuthenticated ? (
                  <UserMenu 
                    user={{
                      name: "John Doe",
                      email: "john@example.com",
                      avatar: "/images/avatar.jpg",
                      role: "customer"
                    }}
                  />
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      asChild
                      className={isTransparent ? "hover:bg-white/10" : ""}
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button 
                      variant={isTransparent ? "default" : "primary"}
                      asChild
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "lg:hidden",
                  isTransparent && "hover:bg-white/10"
                )}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileNav
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            isAuthenticated={isAuthenticated}
          />
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <SearchOverlay
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      {variant !== "transparent" && (
        <div className="h-16" />
      )}
    </>
  )
}