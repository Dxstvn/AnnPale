"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
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
  Bell
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useCreatorNotifications } from "@/hooks/use-creator-notifications"
import { NotificationBadge, NotificationPanel } from "@/components/creator/video-request-notification"
import { useToast } from "@/hooks/use-toast"
import { notificationService } from "@/lib/services/notification-service"

interface CreatorLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/creator/dashboard", icon: Home, helpKey: "dashboard_help" },
  { name: "Requests", href: "/creator/requests", icon: Bell, helpKey: "requests_help", badge: "newRequests" },
  { name: "Revenue", href: "/creator/analytics/revenue", icon: DollarSign, helpKey: "revenue_help" },
  { name: "Audience", href: "/creator/analytics/audience", icon: Users, helpKey: "audience_help" },
  { name: "Content", href: "/creator/content", icon: Video, helpKey: "content_help" },
  { name: "Templates", href: "/creator/templates", icon: FileText, helpKey: "templates_help" },
  { name: "Schedule", href: "/creator/schedule", icon: Calendar, helpKey: "schedule_help" },
  { name: "Messages", href: "/creator/messages", icon: MessageSquare, helpKey: "messages_help" },
  { name: "Reviews", href: "/creator/reviews", icon: Star, helpKey: "reviews_help" },
  { name: "Fans", href: "/creator/fans", icon: Heart, helpKey: "fans_help" },
  { name: "Settings", href: "/creator/settings", icon: Settings, helpKey: "settings_help" },
]

// Help tooltips in multiple languages
const helpTooltips: Record<string, Record<string, string>> = {
  dashboard_help: {
    en: "View your overall performance and key metrics",
    fr: "Consultez vos performances globales et métriques clés",
    ht: "Gade pèfòmans jeneral ou ak mezi enpòtan yo"
  },
  requests_help: {
    en: "Manage and respond to video requests",
    fr: "Gérez et répondez aux demandes de vidéo",
    ht: "Jere ak reponn a demann videyo"
  },
  revenue_help: {
    en: "Track your earnings and financial analytics",
    fr: "Suivez vos revenus et analyses financières",
    ht: "Swiv kòb ou fè ak analiz finansye"
  },
  audience_help: {
    en: "Understand your audience demographics and behavior",
    fr: "Comprenez la démographie et le comportement de votre audience",
    ht: "Konprann demografik ak konpòtman odyans ou"
  },
  content_help: {
    en: "Manage your videos and content library",
    fr: "Gérez vos vidéos et bibliothèque de contenu",
    ht: "Jere videyo ou ak bibliyotèk kontni"
  },
  templates_help: {
    en: "Create and manage video templates",
    fr: "Créez et gérez des modèles de vidéo",
    ht: "Kreye ak jere modèl videyo"
  },
  schedule_help: {
    en: "Plan and organize your recording schedule",
    fr: "Planifiez et organisez votre calendrier d'enregistrement",
    ht: "Planifye ak òganize orè anrejistreman ou"
  },
  messages_help: {
    en: "Communicate with your customers",
    fr: "Communiquez avec vos clients",
    ht: "Kominike avèk kliyan ou yo"
  },
  reviews_help: {
    en: "View and respond to customer reviews",
    fr: "Consultez et répondez aux avis clients",
    ht: "Gade ak reponn a revizyon kliyan"
  },
  fans_help: {
    en: "Manage your fan relationships and engagement",
    fr: "Gérez vos relations avec les fans et l'engagement",
    ht: "Jere relasyon ak angajman fanatik ou yo"
  },
  settings_help: {
    en: "Configure your account and preferences",
    fr: "Configurez votre compte et préférences",
    ht: "Konfigire kont ou ak preferans"
  }
}

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { language } = useLanguage()
  const { logout, user } = useSupabaseAuth()
  const { toast } = useToast()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Set up real-time notifications
  const { newRequests, unreadCount, markAsRead, isConnected } = useCreatorNotifications({
    creatorId: user?.id || '',
    onNewRequest: async (newRequest) => {
      // Show browser notification
      await notificationService.showVideoRequestNotification(newRequest)
    },
    playSound: true,
    showToast: true,
  })
  
  // Request notification permission on mount
  useEffect(() => {
    if (user) {
      notificationService.requestPermission()
    }
  }, [user])

  const getHelpText = (helpKey: string) => {
    return helpTooltips[helpKey]?.[language] || helpTooltips[helpKey]?.en || ""
  }

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
                      Creator Studio
                    </h2>
                  </div>
                )}
                {isSidebarCollapsed && (
                  <span className="text-2xl">🎤</span>
                )}
                
                <div className="flex items-center gap-2">
                  {/* Notification Badge */}
                  <div className="relative">
                    <NotificationBadge 
                      count={unreadCount} 
                      onClick={() => setShowNotifications(!showNotifications)}
                    />
                    
                    {/* Notification Panel Dropdown */}
                    {showNotifications && !isSidebarCollapsed && (
                      <div className="absolute top-12 right-0 w-96 bg-white rounded-lg shadow-xl border z-50">
                        <NotificationPanel
                          requests={newRequests}
                          onView={(id) => {
                            markAsRead([id])
                            setShowNotifications(false)
                            router.push(`/creator/requests?highlight=${id}`)
                          }}
                          onAccept={async (id) => {
                            markAsRead([id])
                            router.push(`/creator/requests?highlight=${id}`)
                          }}
                          onReject={async (id) => {
                            markAsRead([id])
                            router.push(`/creator/requests?highlight=${id}`)
                          }}
                          onDismiss={(id) => markAsRead([id])}
                          onClearAll={() => markAsRead()}
                        />
                      </div>
                    )}
                  </div>
                  
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
              
              {/* Connection Status */}
              {isConnected && !isSidebarCollapsed && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                  <span>Live Updates Active</span>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                
                return (
                  <Tooltip key={item.name} delayDuration={0}>
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
                            <span className="flex-1">{item.name}</span>
                            
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
                                <p className="text-sm">{getHelpText(item.helpKey)}</p>
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
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {getHelpText(item.helpKey)}
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
                    <span className="text-gray-600">Today's Earnings</span>
                    <span className="font-semibold text-green-600">$245</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pending Requests</span>
                    <span className="font-semibold text-orange-600">8</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Response Rate</span>
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
                    {!isSidebarCollapsed && <span>Sign Out</span>}
                  </button>
                </TooltipTrigger>
                {isSidebarCollapsed && (
                  <TooltipContent side="right">
                    <p>Sign Out</p>
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