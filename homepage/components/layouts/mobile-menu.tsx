"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu, X, Sparkles, Home, Search, HelpCircle, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface MobileMenuProps {
  navLinks: Array<{
    href: string
    label: string
    iconName: string
  }>
  isAuthenticated: boolean
  locale: string
  currentLanguage: string
}

const iconMap = {
  Home,
  Search,
  HelpCircle,
  Users
}

export function MobileMenu({ navLinks, isAuthenticated, locale, currentLanguage }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all">
          <Menu className="h-6 w-6 text-purple-600" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white shadow-xl p-0 overflow-y-auto">
        {/* Visually hidden title for accessibility */}
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>

        {/* Mobile Menu Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Ann Pale</h2>
            </div>
            <p className="text-sm opacity-90">Connect with Haitian Stars</p>
          </div>
        </div>

        <div className="flex flex-col p-6 space-y-6">
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const Icon = iconMap[link.iconName as keyof typeof iconMap]
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-base">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="h-px bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200" />

          {/* Auth Section */}
          {!isAuthenticated && (
            <div className="space-y-3">
              <Link
                href={`/${locale}/login`}
                onClick={() => setOpen(false)}
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:shadow-md hover:translate-y-[-2px] transition-all"
                >
                  Sign In
                </Button>
              </Link>
              <Link
                href={`/${locale}/signup`}
                onClick={() => setOpen(false)}
                className="block"
              >
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:translate-y-[-2px] transition-all"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Join Now
                </Button>
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex justify-center space-x-2 text-2xl opacity-50">
              <span>🇭🇹</span>
              <span>🎭</span>
              <span>🎵</span>
              <span>🎨</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}