"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Settings,
  Video,
  Package,
  BarChart3,
  LogOut,
  DollarSign,
  Shield,
  HelpCircle,
  Layout
} from "lucide-react"

export function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const menuItems = {
    customer: [
      {
        label: "My Profile",
        href: "/profile",
        icon: User
      },
      {
        label: "My Orders",
        href: "/orders",
        icon: Package
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings
      },
      {
        label: "Help & Support",
        href: "/help",
        icon: HelpCircle
      }
    ],
    creator: [
      {
        label: "Creator Dashboard",
        href: "/creator/dashboard",
        icon: Layout
      },
      {
        label: "My Videos",
        href: "/creator/content",
        icon: Video
      },
      {
        label: "Analytics",
        href: "/creator/analytics",
        icon: BarChart3
      },
      {
        label: "Earnings",
        href: "/creator/finances",
        icon: DollarSign
      },
      {
        label: "Settings",
        href: "/creator/settings",
        icon: Settings
      }
    ],
    admin: [
      {
        label: "Admin Dashboard",
        href: "/admin/dashboard",
        icon: Shield
      },
      {
        label: "User Management",
        href: "/admin/users",
        icon: User
      },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings
      }
    ]
  }

  const userMenuItems = menuItems[user.role] || menuItems.customer

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
          <Avatar className="h-8 w-8 border-2 border-purple-600">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {user.role === "creator" && (
            <Badge variant="secondary" className="text-xs">
              Creator
            </Badge>
          )}
          {user.role === "admin" && (
            <Badge variant="destructive" className="text-xs">
              Admin
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userMenuItems.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link href={item.href} className="cursor-pointer">
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}