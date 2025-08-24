"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { cn } from "@/lib/utils"
import {
  Activity,
  Shield,
  DollarSign,
  Users,
  AlertTriangle,
  FileText,
  Settings,
  Home,
  Eye,
  Lock,
  LogOut
} from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "System Health", href: "/admin/system", icon: Activity },
  { name: "Moderation", href: "/admin/moderation/queue", icon: Eye },
  { name: "Finances", href: "/admin/finances", icon: DollarSign },
  { name: "Security", href: "/admin/security", icon: Shield },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { logout } = useSupabaseAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white min-h-screen sticky top-0 flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>
          </div>
          <nav className="flex-1 px-4 pb-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1",
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Admin Warning */}
          <div className="mx-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 text-xs">
              <AlertTriangle className="h-4 w-4" />
              <span>Admin Access Active</span>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="mt-auto p-4 border-t border-gray-800">
            <button
              onClick={async () => {
                try {
                  await logout()
                  console.log('[AdminLayout] User signed out successfully')
                } catch (error) {
                  console.error('[AdminLayout] Sign out error:', error)
                }
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all text-red-400 hover:bg-red-900/20 hover:text-red-300"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}