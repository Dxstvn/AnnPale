"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Auto-generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/" }
    ]
    
    let currentPath = ""
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      const label = path
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      
      breadcrumbs.push({
        label,
        href: index === paths.length - 1 ? undefined : currentPath
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbItems = items || generateBreadcrumbs()
  
  if (breadcrumbItems.length <= 1) {
    return null
  }
  
  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1
        const isFirst = index === 0
        
        return (
          <div key={index} className="flex items-center">
            {!isFirst && (
              <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
            )}
            
            {isFirst && item.href && (
              <Link
                href={item.href}
                className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">{item.label}</span>
              </Link>
            )}
            
            {!isFirst && (
              <>
                {isLast || !item.href ? (
                  <span className="text-gray-900 font-medium">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-purple-600 transition"
                  >
                    {item.label}
                  </Link>
                )}
              </>
            )}
          </div>
        )
      })}
    </nav>
  )
}