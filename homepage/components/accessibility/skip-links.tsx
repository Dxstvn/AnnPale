"use client"

import { cn } from "@/lib/utils"

interface SkipLinksProps {
  className?: string
}

export function SkipLinks({ className }: SkipLinksProps) {
  return (
    <div className={cn("sr-only focus-within:not-sr-only", className)}>
      <div className="absolute top-0 left-0 z-[100] bg-white dark:bg-gray-900 p-2">
        <a
          href="#main-content"
          className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <a
          href="#main-navigation"
          className="inline-block ml-2 px-4 py-2 bg-purple-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Skip to navigation
        </a>
        <a
          href="#footer"
          className="inline-block ml-2 px-4 py-2 bg-purple-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Skip to footer
        </a>
      </div>
    </div>
  )
}