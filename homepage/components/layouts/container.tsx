"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: boolean
  centered?: boolean
  as?: "div" | "section" | "article" | "main"
}

export function Container({
  children,
  className,
  maxWidth = "2xl",
  padding = true,
  centered = false,
  as: Component = "div"
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full"
  }

  return (
    <Component
      className={cn(
        "w-full",
        maxWidthClasses[maxWidth],
        padding && "px-4 sm:px-6 lg:px-8",
        centered && "mx-auto",
        className
      )}
    >
      {children}
    </Component>
  )
}