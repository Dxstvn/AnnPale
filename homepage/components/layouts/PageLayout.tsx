'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: ReactNode
  className?: string
  animate?: boolean
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

export function PageLayout({ 
  children, 
  className,
  animate = true
}: PageLayoutProps) {
  if (!animate) {
    return (
      <main className={cn('min-h-screen', className)}>
        {children}
      </main>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        className={cn('min-h-screen', className)}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: ReactNode
  className?: string
  gradient?: boolean
}

export function PageHeader({ 
  title, 
  subtitle,
  children,
  className,
  gradient = true
}: PageHeaderProps) {
  return (
    <header className={cn(
      'relative py-12 md:py-16 lg:py-20',
      className
    )}>
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-pink-500/5 to-transparent" />
      )}
      <div className="relative">
        <h1 className={cn(
          'text-4xl md:text-5xl lg:text-6xl font-bold',
          gradient && 'bg-gradient-primary bg-clip-text text-transparent'
        )}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl">
            {subtitle}
          </p>
        )}
        {children && (
          <div className="mt-6 md:mt-8">
            {children}
          </div>
        )}
      </div>
    </header>
  )
}

interface PageContentProps {
  children: ReactNode
  className?: string
}

export function PageContent({ 
  children, 
  className
}: PageContentProps) {
  return (
    <div className={cn(
      'py-8 md:py-12 lg:py-16',
      className
    )}>
      {children}
    </div>
  )
}

interface PageSectionProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  id?: string
}

export function PageSection({ 
  children,
  className,
  title,
  subtitle,
  id
}: PageSectionProps) {
  return (
    <section 
      id={id}
      className={cn(
        'py-12 md:py-16 lg:py-20',
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-8 md:mb-12 text-center">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

interface SplitLayoutProps {
  left: ReactNode
  right: ReactNode
  className?: string
  reverse?: boolean
  ratio?: '1:1' | '1:2' | '2:1'
}

export function SplitLayout({ 
  left,
  right,
  className,
  reverse = false,
  ratio = '1:1'
}: SplitLayoutProps) {
  const ratioClass = {
    '1:1': 'lg:grid-cols-2',
    '1:2': 'lg:grid-cols-3',
    '2:1': 'lg:grid-cols-3'
  }

  return (
    <div className={cn(
      'grid gap-8 lg:gap-12',
      ratioClass[ratio],
      className
    )}>
      <div className={cn(
        ratio === '1:2' && 'lg:col-span-1',
        ratio === '2:1' && 'lg:col-span-2',
        reverse && 'lg:order-2'
      )}>
        {left}
      </div>
      <div className={cn(
        ratio === '1:2' && 'lg:col-span-2',
        ratio === '2:1' && 'lg:col-span-1',
        reverse && 'lg:order-1'
      )}>
        {right}
      </div>
    </div>
  )
}