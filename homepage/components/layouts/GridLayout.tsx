'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GridLayoutProps {
  children: ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'sm' | 'md' | 'lg'
  responsive?: boolean
}

/**
 * 12-column responsive grid system following Phase 0 design principles
 * Container max-widths: Mobile (100%), Tablet (768px), Desktop (1280px), Wide (1536px)
 * Consistent gutters: Desktop (24px), Mobile (16px)
 */
export function GridLayout({ 
  children, 
  className,
  columns = 12,
  gap = 'md',
  responsive = true
}: GridLayoutProps) {
  const gapSizes = {
    sm: 'gap-4',     // 16px
    md: 'gap-4 lg:gap-6', // 16px mobile, 24px desktop
    lg: 'gap-6 lg:gap-8'  // 24px mobile, 32px desktop
  }

  const columnClasses = {
    1: 'grid-cols-1',
    2: responsive ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
    3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
    4: responsive ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
    6: responsive ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid-cols-6',
    12: responsive ? 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-12' : 'grid-cols-12'
  }

  return (
    <div className={cn(
      'grid',
      columnClasses[columns],
      gapSizes[gap],
      className
    )}>
      {children}
    </div>
  )
}

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padded?: boolean
}

/**
 * Container component with responsive max-widths
 * Mobile: 100%, Tablet: 768px, Desktop: 1280px, Wide: 1536px
 */
export function Container({ 
  children, 
  className,
  size = 'lg',
  padded = true
}: ContainerProps) {
  const maxWidths = {
    sm: 'max-w-screen-sm',   // 640px
    md: 'max-w-screen-md',   // 768px
    lg: 'max-w-screen-lg',   // 1024px
    xl: 'max-w-screen-xl',   // 1280px
    full: 'max-w-[1536px]'   // 1536px
  }

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidths[size],
      padded && 'px-4 lg:px-6', // 16px mobile, 24px desktop
      className
    )}>
      {children}
    </div>
  )
}

interface SectionProps {
  children: ReactNode
  className?: string
  spacing?: 'sm' | 'md' | 'lg'
  as?: 'section' | 'article' | 'div'
}

/**
 * Section component with consistent spacing
 * Desktop: 64px, Mobile: 48px (default)
 */
export function Section({ 
  children, 
  className,
  spacing = 'md',
  as: Component = 'section'
}: SectionProps) {
  const spacingSizes = {
    sm: 'py-8 lg:py-12',   // 32px mobile, 48px desktop
    md: 'py-12 lg:py-16',  // 48px mobile, 64px desktop
    lg: 'py-16 lg:py-20'   // 64px mobile, 80px desktop
  }

  return (
    <Component className={cn(
      spacingSizes[spacing],
      className
    )}>
      {children}
    </Component>
  )
}

interface ColumnProps {
  children: ReactNode
  className?: string
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  responsiveSpan?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  }
}

/**
 * Column component for use within GridLayout
 */
export function Column({ 
  children, 
  className,
  span = 1,
  start,
  responsiveSpan
}: ColumnProps) {
  const spanClasses = `col-span-${span}`
  const startClasses = start ? `col-start-${start}` : ''
  
  const responsiveClasses = responsiveSpan ? [
    responsiveSpan.sm && `sm:col-span-${responsiveSpan.sm}`,
    responsiveSpan.md && `md:col-span-${responsiveSpan.md}`,
    responsiveSpan.lg && `lg:col-span-${responsiveSpan.lg}`
  ].filter(Boolean).join(' ') : ''

  return (
    <div className={cn(
      spanClasses,
      startClasses,
      responsiveClasses,
      className
    )}>
      {children}
    </div>
  )
}

interface FlexLayoutProps {
  children: ReactNode
  className?: string
  direction?: 'row' | 'col'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: 'sm' | 'md' | 'lg'
  wrap?: boolean
  responsive?: boolean
}

/**
 * Flexible layout component with responsive behavior
 */
export function FlexLayout({ 
  children, 
  className,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  gap = 'md',
  wrap = false,
  responsive = true
}: FlexLayoutProps) {
  const directionClasses = {
    row: responsive ? 'flex-col sm:flex-row' : 'flex-row',
    col: 'flex-col'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  const gapSizes = {
    sm: 'gap-4',     // 16px
    md: 'gap-4 lg:gap-6', // 16px mobile, 24px desktop
    lg: 'gap-6 lg:gap-8'  // 24px mobile, 32px desktop
  }

  return (
    <div className={cn(
      'flex',
      directionClasses[direction],
      alignClasses[align],
      justifyClasses[justify],
      gapSizes[gap],
      wrap && 'flex-wrap',
      className
    )}>
      {children}
    </div>
  )
}