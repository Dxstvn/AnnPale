"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GridProps {
  children: ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | "auto"
  gap?: "none" | "sm" | "md" | "lg" | "xl"
  responsive?: boolean
}

export function Grid({
  children,
  className,
  columns = "auto",
  gap = "md",
  responsive = true
}: GridProps) {
  const columnClasses = {
    1: "grid-cols-1",
    2: responsive ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2",
    3: responsive ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-3",
    4: responsive ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-4",
    5: responsive ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-5",
    6: responsive ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-6",
    auto: "grid-cols-[repeat(auto-fill,minmax(250px,1fr))]"
  }

  const gapClasses = {
    none: "gap-0",
    sm: "gap-2 sm:gap-3",
    md: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8",
    xl: "gap-8 sm:gap-12"
  }

  return (
    <div
      className={cn(
        "grid",
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}