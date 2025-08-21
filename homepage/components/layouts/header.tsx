"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/navigation/user-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Globe, Menu, X, Home, Search, HelpCircle, Users, User, Settings, LogOut, LayoutDashboard, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type Language = "en" | "fr" | "ht"

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ht", name: "Kreyòl", flag: "🇭🇹" },
]

export function Header() {
  const { language, setLanguage } = useLanguage()
  const { isAuthenticated, user } = useSupabaseAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const currentLanguage = languages.find((l) => l.code === language) || languages[0]

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse", label: "Browse", icon: Search },
    { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
    { href: "/for-creators", label: "For Creators", icon: Users },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-purple-100/50 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-white/50 to-pink-50/50 pointer-events-none" />
      
      <div className="container mx-auto flex h-20 items-center justify-between px-4 relative">
        {/* Logo with Icon */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ann Pale
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors group"
            >
              <span className={pathname === link.href ? "text-purple-600" : ""}>
                {link.label}
              </span>
              <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform origin-left transition-transform ${
                pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>
          ))}
        </nav>

        {/* Right side actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <Globe className="h-4 w-4 text-purple-600" />
                <span>{currentLanguage.flag}</span>
                <span>{currentLanguage.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-purple-100">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`cursor-pointer hover:bg-purple-50 transition-all ${
                    language === lang.code ? "bg-gradient-to-r from-purple-50 to-pink-50" : ""
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <span className="ml-auto text-purple-600">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sign In / Sign Up or User Menu */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/login">
                <Button 
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:shadow-md hover:translate-y-[-2px] transition-all"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:translate-y-[-2px] transition-all">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Join Now
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button and Language Switcher */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Mobile Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-purple-50 transition-colors">
                <Globe className="h-5 w-5 text-purple-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-purple-100">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`cursor-pointer hover:bg-purple-50 transition-all ${
                    language === lang.code ? "bg-gradient-to-r from-purple-50 to-pink-50" : ""
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <span className="ml-auto text-purple-600">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
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
                  onClick={() => setMobileMenuOpen(false)}
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
                    const Icon = link.icon
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative overflow-hidden group ${
                          isActive 
                            ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 font-medium" 
                            : "text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                        }`}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-200 ${
                          isActive 
                            ? "opacity-0 group-hover:opacity-100 translate-x-0" 
                            : "opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-0"
                        }`} />
                        <Icon className="h-5 w-5" />
                        <span className="text-base">{link.label}</span>
                      </Link>
                    )
                  })}
                </nav>

                <div className="h-px bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200" />

                {/* Mobile Auth Section */}
                {isAuthenticated ? (
                  <div className="space-y-4">
                    {/* User Profile Card */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      {user?.role === 'creator' && (
                        <Link
                          href="/creator/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:translate-y-[-2px] transition-all group">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Creator Dashboard
                          </Button>
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:translate-y-[-2px] transition-all">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Button>
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button variant="ghost" className="w-full justify-start hover:bg-purple-50 hover:text-purple-600">
                          <User className="h-4 w-4 mr-3" />
                          My Profile
                        </Button>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button variant="ghost" className="w-full justify-start hover:bg-purple-50 hover:text-purple-600">
                          <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </Button>
                      </Link>
                      <div className="h-px bg-gray-200 my-2" />
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => {
                          // Add logout logic here
                          setMobileMenuOpen(false)
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
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
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block"
                    >
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:translate-y-[-2px] transition-all"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Join Now
                      </Button>
                    </Link>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Join thousands connecting with Haitian celebrities
                    </p>
                  </div>
                )}

                {/* Footer Section */}
                <div className="mt-auto pt-6 border-t border-gray-200">
                  <div className="flex justify-center space-x-4 mb-4">
                    <Link href="/help" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                      Help
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link href="/blog" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                      Blog
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link href="/about" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                      About
                    </Link>
                  </div>
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
        </div>
      </div>

      {/* Bottom gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 opacity-50" />
    </header>
  )
}