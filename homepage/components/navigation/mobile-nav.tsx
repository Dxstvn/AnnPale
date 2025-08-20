"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LanguageToggle } from "@/components/language-toggle"
import {
  X,
  ChevronRight,
  User,
  Package,
  Mail,
  Settings,
  HelpCircle,
  LogOut,
  Home,
  Search,
  Grid,
  Info,
  Briefcase,
  Video,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
    role: "customer" | "creator" | "admin"
  }
}

export function MobileNav({ isOpen, onClose, isAuthenticated = false, user }: MobileNavProps) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleSignOut = () => {
    // Handle sign out
    console.log("Signing out...")
    onClose()
    router.push("/")
  }

  const navigationItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Browse Creators", href: "/browse", icon: Search },
    { label: "Categories", href: "/categories", icon: Grid },
    { label: "How It Works", href: "/how-it-works", icon: Info },
    { label: "For Business", href: "/business", icon: Briefcase },
  ]

  const userMenuItems = [
    { label: "My Orders", href: "/orders", icon: Package, badge: "2" },
    { label: "Messages", href: "/messages", icon: Mail, badge: "5" },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Help & Support", href: "/help", icon: HelpCircle },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/annpale" },
    { icon: Twitter, href: "https://twitter.com/annpale" },
    { icon: Instagram, href: "https://instagram.com/annpale" },
    { icon: Youtube, href: "https://youtube.com/annpale" },
  ]

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[400px] bg-white dark:bg-gray-900 shadow-xl z-[70] lg:hidden overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎤</span>
              <span className="font-bold text-lg">Ann Pale</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Section */}
          {isAuthenticated && user ? (
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              {user.role !== "customer" && (
                <Badge variant="secondary" className="mt-2">
                  {user.role === "creator" ? "Creator Account" : "Admin"}
                </Badge>
              )}
            </div>
          ) : (
            <div className="p-4 border-b space-y-2">
              <Button 
                className="w-full" 
                variant="primary"
                onClick={() => {
                  router.push("/signup")
                  onClose()
                }}
              >
                Sign Up
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  router.push("/login")
                  onClose()
                }}
              >
                Sign In
              </Button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-gray-500" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>

            {isAuthenticated && (
              <>
                <Separator className="my-4" />
                
                {/* Creator Dashboard Link */}
                {user?.role === "creator" && (
                  <Link
                    href="/creator/dashboard"
                    onClick={onClose}
                    className="flex items-center justify-between p-3 bg-purple-50 text-purple-600 rounded-lg mb-4"
                  >
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5" />
                      <span className="font-medium">Creator Dashboard</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}

                {/* User Menu Items */}
                <div className="space-y-1">
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-gray-500" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge variant="secondary" className="h-5">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-4">
            {/* Language Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Language</span>
              <LanguageToggle />
            </div>

            {/* App Download Links */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Get the app</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  App Store
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Google Play
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-purple-600 transition"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}