"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Heart,
  Video,
  Phone,
  Radio,
  Package,
  MessageSquare,
  CreditCard,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Bell,
  Calendar,
  Star,
  Clock,
  TrendingUp,
  Sparkles,
  LogOut,
  Users,
  Search
} from "lucide-react"
import { FEATURES } from "@/lib/feature-flags"
import { LanguageSwitcher } from "@/components/navigation/language-switcher"

interface CustomerLayoutProps {
  children: ReactNode
}

// Updated to use translation keys
const getNavigation = (t: any) => [
  { nameKey: "navigation.home", href: "/fan/home", icon: Home, helpKey: "help.home" },
  { nameKey: "navigation.explore", href: "/fan/explore", icon: Search, helpKey: "help.explore", badge: "New" },
  // Archived 2025-01-15: { nameKey: "navigation.favorites", href: "/fan/favorites", icon: Heart, helpKey: "help.favorites", badge: "3" },
  // Archived 2025-01-15: { nameKey: "navigation.bookings", href: "/fan/bookings", icon: Video, helpKey: "help.bookings" },
  // Archived 2025-01-15: { nameKey: "navigation.videoCalls", href: "/fan/calls", icon: Phone, helpKey: "help.videoCalls", badge: "New" },
  // Conditionally include Live Streams based on feature flag
  ...(FEATURES.LIVESTREAMING ? [{ nameKey: "navigation.liveStreams", href: "/fan/livestreams", icon: Radio, helpKey: "help.liveStreams" }] : []),
  { nameKey: "navigation.orders", href: "/fan/orders", icon: Package, helpKey: "help.orders" },
  // Archived 2025-01-15: { nameKey: "navigation.messages", href: "/fan/messages", icon: MessageSquare, helpKey: "help.messages", badge: "5" },
  { nameKey: "navigation.settings", href: "/fan/settings", icon: Settings, helpKey: "help.settings" },
]

// Help tooltips now handled by next-intl

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const pathname = usePathname()
  const t = useTranslations('fan')
  const tCommon = useTranslations('common')
  const { logout } = useSupabaseAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const navigation = getNavigation(t)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="flex relative">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md hover:shadow-lg transition-all"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Sidebar Overlay for Mobile */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside 
            className={cn(
              "bg-white shadow-lg min-h-screen transition-all duration-300 z-40",
              // Mobile styles
              "fixed lg:sticky top-0",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
              // Desktop styles
              isSidebarCollapsed ? "lg:w-20" : "lg:w-64"
            )}
          >
            {/* Sidebar Header */}
            <div className={cn(
              "p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50",
              isSidebarCollapsed && "lg:p-4"
            )}>
              <div className="flex items-center justify-between">
                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50" />
                      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Ann Pale
                      </h2>
                      <p className="text-xs text-gray-600">{t('dashboard.title')}</p>
                    </div>
                  </div>
                )}
                {isSidebarCollapsed && (
                  <div className="mx-auto bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                )}

                {/* Desktop Collapse Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex hover:bg-white/50"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                >
                  {isSidebarCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Language Switcher */}
              {!isSidebarCollapsed && (
                <div className="mt-4 flex justify-center">
                  <LanguageSwitcher variant="minimal" align="center" />
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                const itemName = t(item.nameKey)
                const helpText = t(item.helpKey)

                return (
                  <Tooltip key={item.nameKey} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group relative",
                          isActive
                            ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 hover:text-purple-600",
                          isSidebarCollapsed && "lg:justify-center lg:px-3"
                        )}
                      >
                        <item.icon className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isActive && "text-purple-600"
                        )} />

                        {!isSidebarCollapsed && (
                          <>
                            <span className="flex-1">{itemName}</span>

                            {/* Badge */}
                            {item.badge && (
                              <Badge
                                variant={item.badge === "New" ? "default" : "secondary"}
                                className={cn(
                                  "ml-auto",
                                  item.badge === "New" && "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                )}
                              >
                                {item.badge === "New" ? tCommon('badges.new') : item.badge}
                              </Badge>
                            )}

                            {/* Help Icon with Tooltip */}
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <p className="text-sm">{helpText}</p>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}

                        {/* Active Indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-r-full" />
                        )}
                      </Link>
                    </TooltipTrigger>

                    {/* Tooltip for collapsed sidebar */}
                    {isSidebarCollapsed && (
                      <TooltipContent side="right">
                        <div>
                          <p className="font-medium">{itemName}</p>
                          {item.badge && (
                            <Badge variant="secondary" className="mt-1">
                              {item.badge === "New" ? tCommon('badges.new') : item.badge}
                            </Badge>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {helpText}
                          </p>
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                )
              })}
            </nav>

            {/* Quick Stats (Desktop Only) */}
            {!isSidebarCollapsed && (
              <div className="hidden lg:block px-6 py-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {t('stats.nextCall')}
                    </span>
                    <span className="font-semibold text-purple-600">2:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      {t('stats.pendingVideos')}
                    </span>
                    <span className="font-semibold text-orange-600">3</span>
                  </div>
                  {FEATURES.LIVESTREAMING && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Radio className="h-4 w-4" />
                        {t('stats.liveNow')}
                      </span>
                      <span className="font-semibold text-green-600">12</span>
                    </div>
                  )}
                </div>

                {/* Notification Bell */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:translate-y-[-2px] transition-all">
                    <Bell className="h-4 w-4 mr-2" />
                    {t('stats.notifications')}
                    <Badge variant="secondary" className="ml-2 bg-white text-purple-600">
                      8
                    </Badge>
                  </Button>
                </div>
              </div>
            )}

            {/* Sign Out Button */}
            <div className={cn(
              "mt-auto border-t border-gray-200",
              isSidebarCollapsed ? "p-2" : "p-4"
            )}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={async () => {
                      setIsSidebarOpen(false)
                      await logout()
                    }}
                    className={cn(
                      "flex items-center gap-3 w-full rounded-lg text-sm font-medium transition-all",
                      "text-red-600 hover:bg-red-50 hover:text-red-700",
                      isSidebarCollapsed ? "justify-center p-3" : "px-4 py-3"
                    )}
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!isSidebarCollapsed && <span>{tCommon('navigation.logout')}</span>}
                  </button>
                </TooltipTrigger>
                {isSidebarCollapsed && (
                  <TooltipContent side="right">
                    <p>{tCommon('navigation.logout')}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </aside>

          {/* Main Content */}
          <main className={cn(
            "flex-1 min-h-screen",
            "lg:ml-0", // Remove margin since sidebar is sticky
            "pt-16 lg:pt-0" // Add padding top for mobile menu button
          )}>
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}