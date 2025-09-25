"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  BarChart3,
  Users,
  Video,
  FileText,
  Calendar,
  MessageSquare,
  Star,
  Heart,
  DollarSign,
  Home,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  Bell,
  ArrowRightLeft
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useNotificationPolling } from "@/hooks/use-notification-polling"
import { LanguageSwitcher } from "@/components/navigation/language-switcher"

interface CreatorLayoutProps {
  children: ReactNode
}

// Updated to use translation keys
const getNavigation = (t: any) => [
  { nameKey: "navigation.dashboard", href: "/creator/dashboard", icon: Home, helpKey: "help.dashboard" },
  { nameKey: "navigation.requests", href: "/creator/requests", icon: Bell, helpKey: "help.requests", badge: "newRequests" },
  { nameKey: "navigation.revenue", href: "/creator/analytics/revenue", icon: DollarSign, helpKey: "help.revenue" },
  { nameKey: "navigation.content", href: "/creator/content", icon: Video, helpKey: "help.content" },
  { nameKey: "navigation.settings", href: "/creator/settings", icon: Settings, helpKey: "help.settings" },
]

// Help tooltips now handled by next-intl

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('creator')
  const tCommon = useTranslations('common')
  const { logout, user } = useSupabaseAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isSwitchingMode, setIsSwitchingMode] = useState(false)

  // Set up polling for notifications
  const { unreadCount, markAsViewed } = useNotificationPolling({
    creatorId: user?.id || '',
    pollInterval: 30000, // Poll every 30 seconds
    enabled: !!user?.id
  })

  // Mark requests as viewed when navigating to requests page
  useEffect(() => {
    if (pathname === '/creator/requests' && unreadCount > 0) {
      markAsViewed()
    }
  }, [pathname, unreadCount, markAsViewed])

  const navigation = getNavigation(t)

  const handleSwitchToFanMode = async () => {
    setIsSwitchingMode(true)
    try {
      const response = await fetch('/api/account/switch-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'fan' })
      })

      const data = await response.json()

      if (data.success && data.redirectUrl) {
        router.push(data.redirectUrl)
      }
    } catch (error) {
      console.error('Error switching to fan mode:', error)
    } finally {
      setIsSwitchingMode(false)
    }
  }

  // Check if user is a dual-role user (fan with creator access)
  const isDualRoleUser = user?.role === 'fan' && user?.is_creator === true

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="flex relative">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md"
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
              "bg-white shadow-lg min-h-screen transition-all duration-300 z-40 flex flex-col",
              // Mobile styles
              "fixed lg:sticky top-0",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
              // Desktop styles
              isSidebarCollapsed ? "lg:w-20" : "lg:w-64"
            )}
          >
            {/* Sidebar Header */}
            <div className={cn(
              "p-6 border-b border-gray-200",
              isSidebarCollapsed && "lg:p-4"
            )}>
              <div className="flex items-center justify-between">
                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎤</span>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {t('dashboard.title')}
                    </h2>
                  </div>
                )}
                {isSidebarCollapsed && (
                  <span className="text-2xl">🎤</span>
                )}
                
                <div className="flex items-center gap-2">
                  {/* Desktop Collapse Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex"
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  >
                    {isSidebarCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Switch to Fan Portal Button for Dual-Role Users */}
            {isDualRoleUser && (
              <div className="px-4 pb-4 border-b border-gray-200">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200"
                  onClick={handleSwitchToFanMode}
                  disabled={isSwitchingMode}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  {isSwitchingMode ? t('actions.switching') : t('actions.switchToFanPortal')}
                </Button>
                {!isSidebarCollapsed && (
                  <p className="text-xs text-gray-500 mt-2 px-1">
                    {t('actions.switchToFanDescription')}
                  </p>
                )}
              </div>
            )}

            {/* Language Switcher */}
            {!isSidebarCollapsed && (
              <div className="px-6 pb-4 border-b border-gray-200">
                <div className="flex justify-center">
                  <LanguageSwitcher variant="minimal" align="center" />
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
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

                            {/* Badge for unread notifications */}
                            {item.badge === 'newRequests' && unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </span>
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
                    <span className="text-gray-600">{t('stats.todaysEarnings')}</span>
                    <span className="font-semibold text-green-600">$245</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('stats.pendingRequests')}</span>
                    <span className="font-semibold text-orange-600">8</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('stats.responseRate')}</span>
                    <span className="font-semibold text-blue-600">96%</span>
                  </div>
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