"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Video,
  DollarSign,
  BarChart3,
  Settings,
  Shield,
  FileText,
  MessageSquare,
  AlertCircle,
  Calendar,
  TrendingUp,
  UserCheck,
  Flag,
  CreditCard,
  Globe,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronDown,
  Menu,
  X
} from "lucide-react"

interface NavItem {
  title: string
  href?: string
  icon: React.ElementType
  badge?: number | string
  badgeVariant?: "default" | "destructive" | "outline" | "secondary"
  children?: NavItem[]
  requiredPermission?: string
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/enhanced-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    icon: Users,
    children: [
      {
        title: "All Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Creators",
        href: "/admin/creators",
        icon: Video,
        badge: "8",
        badgeVariant: "secondary",
      },
      {
        title: "Pending Approvals",
        href: "/admin/approvals",
        icon: UserCheck,
        badge: "3",
        badgeVariant: "destructive",
      },
      {
        title: "Verification Requests",
        href: "/admin/verification",
        icon: Shield,
        badge: "5",
      },
    ],
  },
  {
    title: "Content",
    icon: FileText,
    children: [
      {
        title: "Videos",
        href: "/admin/videos",
        icon: Video,
      },
      {
        title: "Flagged Content",
        href: "/admin/moderation",
        icon: Flag,
        badge: "12",
        badgeVariant: "destructive",
      },
      {
        title: "Reviews",
        href: "/admin/reviews",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: Calendar,
    badge: "45",
  },
  {
    title: "Finance",
    icon: DollarSign,
    children: [
      {
        title: "Overview",
        href: "/admin/finance",
        icon: DollarSign,
      },
      {
        title: "Transactions",
        href: "/admin/transactions",
        icon: CreditCard,
      },
      {
        title: "Payouts",
        href: "/admin/payouts",
        icon: TrendingUp,
      },
      {
        title: "Refunds",
        href: "/admin/refunds",
        icon: AlertCircle,
        badge: "2",
      },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    children: [
      {
        title: "Overview",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "User Analytics",
        href: "/admin/analytics/users",
        icon: Users,
      },
      {
        title: "Revenue Analytics",
        href: "/admin/analytics/revenue",
        icon: DollarSign,
      },
      {
        title: "Content Analytics",
        href: "/admin/analytics/content",
        icon: Video,
      },
    ],
  },
  {
    title: "Platform",
    icon: Settings,
    children: [
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Roles & Permissions",
        href: "/admin/roles",
        icon: Shield,
        requiredPermission: "settings_edit",
      },
      {
        title: "Localization",
        href: "/admin/localization",
        icon: Globe,
      },
      {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "Support",
    icon: HelpCircle,
    children: [
      {
        title: "Tickets",
        href: "/admin/support/tickets",
        icon: MessageSquare,
        badge: "18",
      },
      {
        title: "FAQ Management",
        href: "/admin/support/faq",
        icon: HelpCircle,
      },
    ],
  },
  {
    title: "Audit & Logs",
    icon: Shield,
    children: [
      {
        title: "System Logs",
        href: "/admin/audit",
        icon: FileText,
        requiredPermission: "analytics_full",
      },
      {
        title: "User Activity",
        href: "/admin/audit/users",
        icon: Users,
        requiredPermission: "analytics_full",
      },
      {
        title: "Security Events",
        href: "/admin/audit/security",
        icon: Shield,
        requiredPermission: "analytics_full",
      },
    ],
  },
]

interface AdminSidebarProps {
  userRole?: string
  userPermissions?: string[]
}

export function AdminSidebar({ userRole = "super_admin", userPermissions = [] }: AdminSidebarProps) {
  const pathname = usePathname()
  const { logout } = useSupabaseAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Users", "Finance"])
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  const hasPermission = (item: NavItem) => {
    if (!item.requiredPermission) return true
    if (userRole === "super_admin") return true
    return userPermissions.includes(item.requiredPermission)
  }

  const renderNavItem = (item: NavItem, depth = 0) => {
    if (!hasPermission(item)) return null

    const isExpanded = expandedItems.includes(item.title)
    const Icon = item.icon
    const isActive = item.href === pathname
    const hasChildren = item.children && item.children.length > 0

    if (hasChildren) {
      return (
        <div key={item.title}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start mb-1",
              depth > 0 && "pl-8"
            )}
            onClick={() => toggleExpanded(item.title)}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">{item.title}</span>
            {item.badge && (
              <Badge variant={item.badgeVariant || "default"} className="ml-2">
                {item.badge}
              </Badge>
            )}
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 ml-2" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-2" />
            )}
          </Button>
          {isExpanded && (
            <div className="ml-4">
              {item.children?.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link key={item.title} href={item.href || "#"}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start mb-1",
            depth > 0 && "pl-8",
            isActive && "bg-purple-100 text-purple-900 hover:bg-purple-100"
          )}
        >
          <Icon className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">{item.title}</span>
          {item.badge && (
            <Badge variant={item.badgeVariant || "default"} className="ml-2">
              {item.badge}
            </Badge>
          )}
        </Button>
      </Link>
    )
  }

  const sidebarContent = (
    <>
      <div className="px-3 py-2 border-b">
        <div className="flex items-center space-x-2 px-2 py-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold">Ann Pale Admin</h2>
            <p className="text-xs text-muted-foreground capitalize">{userRole.replace("_", " ")}</p>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => renderNavItem(item))}
        </div>
      </ScrollArea>
      <div className="border-t px-3 py-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop Sidebar - Removed to prevent duplicate with admin layout */}
      {/* The admin layout already provides a sidebar */}

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}