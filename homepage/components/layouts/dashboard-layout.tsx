"use client"

import { ReactNode, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Video,
  DollarSign,
  Calendar,
  MessageSquare,
  Settings,
  BarChart3,
  Users,
  Bell,
  Menu,
  X,
  ChevronLeft,
  HelpCircle,
  LogOut,
  Package,
  Star,
  TrendingUp,
  Shield
} from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
  role?: "creator" | "admin" | "customer"
  user?: {
    name: string
    email: string
    avatar?: string
    role: string
  }
}

const creatorNavItems = [
  { href: "/creator/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/creator/videos", label: "Videos", icon: Video, badge: "3" },
  { href: "/creator/orders", label: "Orders", icon: Package, badge: "5" },
  { href: "/creator/earnings", label: "Earnings", icon: DollarSign },
  { href: "/creator/availability", label: "Availability", icon: Calendar },
  { href: "/creator/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/creator/settings", label: "Settings", icon: Settings },
]

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/creators", label: "Creators", icon: Video },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/revenue", label: "Revenue", icon: TrendingUp },
  { href: "/admin/moderation", label: "Moderation", icon: Shield },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

const customerNavItems = [
  { href: "/account", label: "My Account", icon: LayoutDashboard },
  { href: "/orders", label: "My Orders", icon: Package },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function DashboardLayout({ 
  children, 
  role = "customer",
  user = {
    name: "John Doe",
    email: "john@example.com",
    role: "customer"
  }
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const navItems = role === "creator" 
    ? creatorNavItems 
    : role === "admin" 
    ? adminNavItems
    : customerNavItems

  const handleSignOut = () => {
    console.log("Signing out...")
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-gray-800 border-r transition-all duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isSidebarCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className={cn("flex items-center gap-2", isSidebarCollapsed && "lg:justify-center")}>
            <span className="text-2xl">🎤</span>
            {!isSidebarCollapsed && <span className="font-bold">Ann Pale</span>}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className={cn("p-4 border-b", isSidebarCollapsed && "lg:px-2")}>
          <div className={cn("flex items-center gap-3", isSidebarCollapsed && "lg:justify-center")}>
            <Avatar className={cn("h-10 w-10", isSidebarCollapsed && "lg:h-8 lg:w-8")}>
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-purple-600 text-white">
                {user.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && role !== "customer" && (
            <Badge variant="secondary" className="mt-2 w-full justify-center">
              {role === "creator" ? "Creator" : "Admin"}
            </Badge>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition",
                  isActive 
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-700",
                  isSidebarCollapsed && "lg:justify-center lg:px-2"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-purple-600")} />
                {!isSidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="h-5">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t space-y-2">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition"
          >
            <ChevronLeft className={cn("h-5 w-5 transition", isSidebarCollapsed && "rotate-180")} />
            {!isSidebarCollapsed && <span>Collapse</span>}
          </button>
          
          <Link
            href="/help"
            className={cn(
              "flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition",
              isSidebarCollapsed && "lg:justify-center lg:px-2"
            )}
          >
            <HelpCircle className="h-5 w-5" />
            {!isSidebarCollapsed && <span>Help</span>}
          </Link>
          
          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition",
              isSidebarCollapsed && "lg:justify-center lg:px-2"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex-1 max-w-xl mx-4">
              {/* Optional search bar */}
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>
              
              {/* Quick Actions */}
              {role === "creator" && (
                <Button size="sm" variant="primary">
                  New Video
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}