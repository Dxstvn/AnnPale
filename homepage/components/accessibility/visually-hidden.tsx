"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface VisuallyHiddenProps {
  children: ReactNode
  className?: string
  as?: "span" | "div" | "p"
}

export function VisuallyHidden({ 
  children, 
  className,
  as: Component = "span" 
}: VisuallyHiddenProps) {
  return (
    <Component
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        className
      )}
    >
      {children}
    </Component>
  )
}