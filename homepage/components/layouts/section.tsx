"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: ReactNode
  title?: string
  subtitle?: string
  actions?: ReactNode
  className?: string
  containerClassName?: string
  variant?: "default" | "alternate" | "featured" | "minimal"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  animated?: boolean
  id?: string
}

export function Section({
  children,
  title,
  subtitle,
  actions,
  className,
  containerClassName,
  variant = "default",
  padding = "lg",
  animated = false,
  id
}: SectionProps) {
  const variantClasses = {
    default: "bg-white dark:bg-gray-800",
    alternate: "bg-gray-50 dark:bg-gray-900",
    featured: "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    minimal: ""
  }

  const paddingClasses = {
    none: "",
    sm: "py-6",
    md: "py-12",
    lg: "py-16",
    xl: "py-24"
  }

  const content = (
    <div className={cn("container mx-auto px-4", containerClassName)}>
      {(title || subtitle || actions) && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex-1">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )

  const sectionContent = (
    <section
      id={id}
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
    >
      {content}
    </section>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        {sectionContent}
      </motion.div>
    )
  }

  return sectionContent
}