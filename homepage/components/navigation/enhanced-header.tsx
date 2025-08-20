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
  Music,
  Mic,
  Star,
  Users,
  Film,
  Palette
} from "lucide-react"
import { UserMenu } from "./user-menu"
import { MobileNav } from "./mobile-nav"
import { SearchOverlay } from "./search-overlay"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export type HeaderVariant = "default" | "transparent" | "minimal" | "dashboard"

interface HeaderProps {
  variant?: HeaderVariant
  className?: string
}

// Navigation items with translations
const navigationItems = [
  {
    key: 'browse',
    href: '/browse',
    dropdown: true,
    categories: [
      { key: 'musicians', icon: Music, emoji: '🎵' },
      { key: 'actors', icon: Film, emoji: '🎬' },
      { key: 'comedians', icon: Mic, emoji: '🎤' },
      { key: 'athletes', icon: Star, emoji: '⭐' },
      { key: 'influencers', icon: Users, emoji: '📱' },
      { key: 'artists', icon: Palette, emoji: '🎨' },
    ]
  },
  { key: 'howItWorks', href: '/how-it-works' },
  { key: 'forBusiness', href: '/business' },
]

export function EnhancedHeader({ variant = "default", className }: HeaderProps) {
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [browseOpen, setBrowseOpen] = useState(false)
  
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

  // Check if current path is active
  const isActive = (href: string) => pathname === href

  // Language options with flag emojis
  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'ht' as const, name: 'Kreyòl', flag: '🇭🇹' },
  ]

  const currentLanguage = languages.find(lang => lang.code === language)

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      "bg-white/95 backdrop-blur-md": !isTransparent,
      "bg-transparent": isTransparent,
      "text-white": isTransparent,
      "text-gray-900": !isTransparent,
      "-translate-y-full": shouldHide,
      "translate-y-0": !shouldHide,
    },
    // Apply elevation system
    isScrolled && "shadow-[0_1px_3px_rgba(0,0,0,0.1)]",
    className
  )

  return (
    <>
      <header className={headerClasses}>
        {/* Top Bar - Desktop Only with cultural greeting */}
        {variant === "default" && !isScrolled && (
          <div className="hidden lg:block border-b border-gray-200/20">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between h-10 text-sm">
                <div className="flex items-center gap-6">
                  <span className="opacity-70 flex items-center gap-2">
                    <span className="text-lg">🇭🇹</span>
                    {getTranslation('nav.welcome', language, 'Welcome to Ann Pale')}
                  </span>
                  <Link 
                    href="/help" 
                    className="hover:opacity-100 opacity-70 transition flex items-center gap-1"
                  >
                    {getTranslation('nav.help', language)}
                  </Link>
                </div>
                <div className="flex items-center gap-6">
                  {/* Language Selector with Flags */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 hover:opacity-100 opacity-70 transition px-3 py-1.5 rounded-lg hover:bg-white/10">
                        <span className="text-base">{currentLanguage?.flag}</span>
                        <span>{currentLanguage?.name}</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[150px]">
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2",
                            language === lang.code && "bg-purple-50 text-purple-600"
                          )}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation with proper spacing */}
        <div className="container mx-auto px-4 lg:px-6">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section */}
            <div className="flex items-center gap-8 lg:gap-12">
              {/* Logo with cultural emoji */}
              <Link 
                href="/" 
                className="flex items-center gap-2 font-bold text-xl lg:text-2xl hover:scale-105 transition-transform"
              >
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

              {/* Desktop Navigation with proper padding */}
              {variant !== "minimal" && (
                <div className="hidden lg:flex items-center gap-2">
                  {/* Browse Dropdown */}
                  <DropdownMenu open={browseOpen} onOpenChange={setBrowseOpen}>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2.5 rounded-lg transition-all",
                          "hover:bg-purple-50 hover:text-purple-600 hover:shadow-[0_10px_15px_rgba(0,0,0,0.1)]",
                          isTransparent && "hover:bg-white/10 hover:text-white",
                          isActive('/browse') && "bg-purple-50 text-purple-600"
                        )}
                      >
                        {getTranslation('nav.browse', language)}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 p-2">
                      <div className="grid gap-1">
                        {navigationItems[0].categories?.map((category) => (
                          <DropdownMenuItem key={category.key} asChild>
                            <Link 
                              href={`/browse?category=${category.key}`}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-50"
                            >
                              <span className="text-xl">{category.emoji}</span>
                              <span>{getTranslation(`categories.${category.key}`, language)}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/browse" 
                          className="flex items-center justify-center py-2.5 text-purple-600 font-medium"
                        >
                          {getTranslation('browse.viewAll', language)}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Other Nav Items */}
                  <Link 
                    href="/how-it-works"
                    className={cn(
                      "px-4 py-2.5 rounded-lg transition-all",
                      "hover:bg-purple-50 hover:text-purple-600 hover:shadow-[0_10px_15px_rgba(0,0,0,0.1)]",
                      isTransparent && "hover:bg-white/10 hover:text-white",
                      isActive('/how-it-works') && "bg-purple-50 text-purple-600"
                    )}
                  >
                    {getTranslation('nav.howItWorks', language)}
                  </Link>
                  
                  {isAuthenticated && (
                    <Link 
                      href="/creator/dashboard"
                      className={cn(
                        "px-4 py-2.5 rounded-lg transition-all",
                        "hover:bg-purple-50 hover:text-purple-600 hover:shadow-[0_10px_15px_rgba(0,0,0,0.1)]",
                        isTransparent && "hover:bg-white/10 hover:text-white",
                        isActive('/creator/dashboard') && "bg-purple-50 text-purple-600"
                      )}
                    >
                      {getTranslation('nav.dashboard', language)}
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Right Section with proper spacing */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "h-10 w-10 lg:h-11 lg:w-11",
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
                    "relative h-10 w-10 lg:h-11 lg:w-11",
                    isTransparent && "hover:bg-white/10"
                  )}
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
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
                    "relative h-10 w-10 lg:h-11 lg:w-11",
                    isTransparent && "hover:bg-white/10"
                  )}
                  asChild
                >
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
              )}

              {/* User Menu / Auth Buttons */}
              <div className="hidden lg:flex items-center gap-3">
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
                      className={cn(
                        "h-11 px-6",
                        isTransparent ? "hover:bg-white/10" : ""
                      )}
                    >
                      <Link href="/login">
                        {getTranslation('nav.login', language)}
                      </Link>
                    </Button>
                    <Button 
                      className="h-11 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all"
                      asChild
                    >
                      <Link href="/signup">
                        {getTranslation('nav.signup', language)}
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "lg:hidden h-10 w-10",
                  isTransparent && "hover:bg-white/10"
                )}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
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
        <div className="h-16 lg:h-20" />
      )}
    </>
  )
}