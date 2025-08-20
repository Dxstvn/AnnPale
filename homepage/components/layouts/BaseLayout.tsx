'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BaseLayoutProps {
  children: ReactNode
  className?: string
  contained?: boolean
  padded?: boolean
}

export function BaseLayout({ 
  children, 
  className,
  contained = true,
  padded = true 
}: BaseLayoutProps) {
  return (
    <div className={cn(
      'min-h-screen bg-background',
      padded && 'py-8 md:py-12 lg:py-16',
      className
    )}>
      {contained ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  )
}

interface SectionProps {
  children: ReactNode
  className?: string
  as?: 'section' | 'article' | 'div'
}

export function Section({ 
  children, 
  className,
  as: Component = 'section' 
}: SectionProps) {
  return (
    <Component className={cn(
      'space-y-6 md:space-y-8 lg:space-y-12',
      className
    )}>
      {children}
    </Component>
  )
}

interface GridProps {
  children: ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 2 | 3 | 4 | 6 | 8
}

export function Grid({ 
  children, 
  className,
  cols = 3,
  gap = 6
}: GridProps) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-12'
  }

  const gapClass = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  }

  return (
    <div className={cn(
      'grid',
      colsClass[cols],
      gapClass[gap],
      className
    )}>
      {children}
    </div>
  )
}

interface FlexProps {
  children: ReactNode
  className?: string
  direction?: 'row' | 'col'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: 2 | 3 | 4 | 6 | 8
  wrap?: boolean
}

export function Flex({ 
  children, 
  className,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  gap = 4,
  wrap = false
}: FlexProps) {
  const directionClass = {
    row: 'flex-row',
    col: 'flex-col'
  }

  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  }

  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  const gapClass = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  }

  return (
    <div className={cn(
      'flex',
      directionClass[direction],
      alignClass[align],
      justifyClass[justify],
      gapClass[gap],
      wrap && 'flex-wrap',
      className
    )}>
      {children}
    </div>
  )
}

interface StackProps {
  children: ReactNode
  className?: string
  spacing?: 2 | 3 | 4 | 6 | 8
}

export function Stack({ 
  children, 
  className,
  spacing = 4
}: StackProps) {
  const spacingClass = {
    2: 'space-y-2',
    3: 'space-y-3',
    4: 'space-y-4',
    6: 'space-y-6',
    8: 'space-y-8'
  }

  return (
    <div className={cn(
      spacingClass[spacing],
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
}

export function Container({ 
  children, 
  className,
  size = 'lg'
}: ContainerProps) {
  const sizeClass = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      sizeClass[size],
      className
    )}>
      {children}
    </div>
  )
}