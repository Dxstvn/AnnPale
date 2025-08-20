'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Reusable layout primitives beyond standard components
 * Following Phase 0 design system principles
 */

// Stack primitive for vertical layouts
interface StackProps {
  children: ReactNode
  className?: string
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
}

export function Stack({ 
  children, 
  className,
  spacing = 'md',
  align = 'stretch'
}: StackProps) {
  const spacingClasses = {
    xs: 'space-y-2',    // 8px
    sm: 'space-y-3',    // 12px
    md: 'space-y-4',    // 16px
    lg: 'space-y-6',    // 24px
    xl: 'space-y-8'     // 32px
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: ''
  }

  return (
    <div className={cn(
      'flex flex-col',
      spacingClasses[spacing],
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  )
}

// Inline primitive for horizontal layouts
interface InlineProps {
  children: ReactNode
  className?: string
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  wrap?: boolean
}

export function Inline({ 
  children, 
  className,
  spacing = 'md',
  align = 'center',
  wrap = false
}: InlineProps) {
  const spacingClasses = {
    xs: 'gap-2',    // 8px
    sm: 'gap-3',    // 12px
    md: 'gap-4',    // 16px
    lg: 'gap-6',    // 24px
    xl: 'gap-8'     // 32px
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  }

  return (
    <div className={cn(
      'flex',
      spacingClasses[spacing],
      alignClasses[align],
      wrap && 'flex-wrap',
      className
    )}>
      {children}
    </div>
  )
}

// Center primitive for centering content
interface CenterProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  horizontally?: boolean
  vertically?: boolean
  intrinsic?: boolean
}

export function Center({ 
  children, 
  className,
  maxWidth,
  horizontally = true,
  vertically = false,
  intrinsic = false
}: CenterProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full'
  }

  return (
    <div className={cn(
      'flex',
      horizontally && 'justify-center',
      vertically && 'items-center',
      intrinsic && 'w-fit mx-auto',
      maxWidth && maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  )
}

// Spacer primitive for adding space
interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  axis?: 'horizontal' | 'vertical' | 'both'
}

export function Spacer({ 
  size = 'md',
  axis = 'vertical'
}: SpacerProps) {
  const sizes = {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px'
  }

  const style = {
    width: axis === 'horizontal' || axis === 'both' ? sizes[size] : undefined,
    height: axis === 'vertical' || axis === 'both' ? sizes[size] : undefined,
    flexShrink: 0
  }

  return <div style={style} aria-hidden="true" />
}

// Divider primitive
interface DividerProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

export function Divider({ 
  className,
  orientation = 'horizontal',
  decorative = true
}: DividerProps) {
  return (
    <div
      role={decorative ? 'presentation' : 'separator'}
      className={cn(
        'bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
    />
  )
}

// Aspect Ratio primitive
interface AspectRatioProps {
  children: ReactNode
  className?: string
  ratio?: number | '1:1' | '4:3' | '16:9' | '21:9'
}

export function AspectRatio({ 
  children, 
  className,
  ratio = '16:9'
}: AspectRatioProps) {
  const ratioMap = {
    '1:1': 1,
    '4:3': 4/3,
    '16:9': 16/9,
    '21:9': 21/9
  }

  const aspectRatio = typeof ratio === 'string' ? ratioMap[ratio] : ratio

  return (
    <div 
      className={cn('relative w-full', className)}
      style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  )
}

// Cluster primitive for wrapping layouts
interface ClusterProps {
  children: ReactNode
  className?: string
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end'
  justify?: 'start' | 'center' | 'end' | 'between'
}

export function Cluster({ 
  children, 
  className,
  spacing = 'md',
  align = 'center',
  justify = 'start'
}: ClusterProps) {
  const spacingClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  }

  return (
    <div className={cn(
      'flex flex-wrap',
      spacingClasses[spacing],
      alignClasses[align],
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  )
}

// Sidebar layout primitive
interface SidebarLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  className?: string
  sidebarPosition?: 'left' | 'right'
  sidebarWidth?: 'sm' | 'md' | 'lg'
  gap?: 'sm' | 'md' | 'lg'
}

export function SidebarLayout({ 
  children,
  sidebar,
  className,
  sidebarPosition = 'left',
  sidebarWidth = 'md',
  gap = 'md'
}: SidebarLayoutProps) {
  const widthClasses = {
    sm: 'w-48',     // 192px
    md: 'w-64',     // 256px
    lg: 'w-80'      // 320px
  }

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  return (
    <div className={cn(
      'flex flex-col lg:flex-row',
      gapClasses[gap],
      sidebarPosition === 'right' && 'lg:flex-row-reverse',
      className
    )}>
      <aside className={cn('flex-shrink-0', widthClasses[sidebarWidth])}>
        {sidebar}
      </aside>
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}

// Split layout primitive
interface SplitLayoutProps {
  left: ReactNode
  right: ReactNode
  className?: string
  ratio?: '1:1' | '1:2' | '2:1' | '1:3' | '3:1'
  gap?: 'sm' | 'md' | 'lg'
  stackAt?: 'sm' | 'md' | 'lg'
}

export function SplitLayout({ 
  left,
  right,
  className,
  ratio = '1:1',
  gap = 'md',
  stackAt = 'md'
}: SplitLayoutProps) {
  const ratioClasses = {
    '1:1': 'lg:grid-cols-2',
    '1:2': 'lg:grid-cols-3',
    '2:1': 'lg:grid-cols-3',
    '1:3': 'lg:grid-cols-4',
    '3:1': 'lg:grid-cols-4'
  }

  const leftSpan = {
    '1:1': '',
    '1:2': 'lg:col-span-1',
    '2:1': 'lg:col-span-2',
    '1:3': 'lg:col-span-1',
    '3:1': 'lg:col-span-3'
  }

  const rightSpan = {
    '1:1': '',
    '1:2': 'lg:col-span-2',
    '2:1': 'lg:col-span-1',
    '1:3': 'lg:col-span-3',
    '3:1': 'lg:col-span-1'
  }

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  const stackClasses = {
    sm: 'grid-cols-1 sm:',
    md: 'grid-cols-1 md:',
    lg: 'grid-cols-1 lg:'
  }

  return (
    <div className={cn(
      'grid',
      `${stackClasses[stackAt]}${ratioClasses[ratio].replace('lg:', '')}`,
      gapClasses[gap],
      className
    )}>
      <div className={leftSpan[ratio]}>
        {left}
      </div>
      <div className={rightSpan[ratio]}>
        {right}
      </div>
    </div>
  )
}