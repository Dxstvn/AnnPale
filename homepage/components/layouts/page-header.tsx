"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  breadcrumbs?: ReactNode
  className?: string
  variant?: "default" | "hero" | "compact" | "centered"
  backgroundImage?: string
  children?: ReactNode
}

export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className,
  variant = "default",
  backgroundImage,
  children
}: PageHeaderProps) {
  const variants = {
    default: "py-8 bg-white dark:bg-gray-800 border-b",
    hero: "py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white",
    compact: "py-4 bg-gray-50 dark:bg-gray-900 border-b",
    centered: "py-12 bg-white dark:bg-gray-800 text-center border-b"
  }

  const content = (
    <>
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      <div className={cn(
        "container mx-auto px-4 relative",
        variant === "centered" && "max-w-3xl"
      )}>
        {breadcrumbs && (
          <div className="mb-4">
            {breadcrumbs}
          </div>
        )}
        
        <div className={cn(
          "flex items-center justify-between gap-4",
          variant === "centered" && "flex-col text-center"
        )}>
          <div className={cn(
            "flex-1",
            variant === "centered" && "w-full"
          )}>
            <h1 className={cn(
              "font-bold",
              variant === "hero" ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl",
              variant === "compact" && "text-xl md:text-2xl"
            )}>
              {title}
            </h1>
            
            {subtitle && (
              <p className={cn(
                "mt-2",
                variant === "hero" 
                  ? "text-lg md:text-xl opacity-90" 
                  : "text-gray-600 dark:text-gray-400"
              )}>
                {subtitle}
              </p>
            )}
            
            {children && (
              <div className="mt-4">
                {children}
              </div>
            )}
          </div>
          
          {actions && (
            <div className={cn(
              "flex items-center gap-3",
              variant === "centered" && "mt-6"
            )}>
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        variants[variant],
        "relative overflow-hidden",
        className
      )}
    >
      {content}
    </motion.header>
  )
}