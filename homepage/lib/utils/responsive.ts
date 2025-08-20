// Responsive breakpoints matching Tailwind defaults
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

// Media query helpers
export const mediaQueries = {
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
  
  // Max width queries
  'max-sm': `(max-width: ${breakpoints.sm - 1}px)`,
  'max-md': `(max-width: ${breakpoints.md - 1}px)`,
  'max-lg': `(max-width: ${breakpoints.lg - 1}px)`,
  'max-xl': `(max-width: ${breakpoints.xl - 1}px)`,
  'max-2xl': `(max-width: ${breakpoints['2xl'] - 1}px)`,
  
  // Range queries
  'sm-md': `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  'md-lg': `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  'lg-xl': `(min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
  
  // Device-specific
  'mobile': `(max-width: ${breakpoints.md - 1}px)`,
  'tablet': `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  'desktop': `(min-width: ${breakpoints.lg}px)`,
  'wide': `(min-width: ${breakpoints['2xl']}px)`,
  
  // Orientation
  'portrait': '(orientation: portrait)',
  'landscape': '(orientation: landscape)',
  
  // High DPI
  'retina': '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Touch devices
  'touch': '(hover: none) and (pointer: coarse)',
  'hover': '(hover: hover) and (pointer: fine)',
} as const

// Utility to check if window matches media query
export function matchesMediaQuery(query: keyof typeof mediaQueries): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(mediaQueries[query]).matches
}

// Get current breakpoint
export function getCurrentBreakpoint(): Breakpoint | 'xs' {
  if (typeof window === 'undefined') return 'xs'
  
  const width = window.innerWidth
  
  if (width < breakpoints.sm) return 'xs'
  if (width < breakpoints.md) return 'sm'
  if (width < breakpoints.lg) return 'md'
  if (width < breakpoints.xl) return 'lg'
  if (width < breakpoints['2xl']) return 'xl'
  return '2xl'
}

// Check if current viewport is mobile
export function isMobile(): boolean {
  return matchesMediaQuery('mobile')
}

// Check if current viewport is tablet
export function isTablet(): boolean {
  return matchesMediaQuery('tablet')
}

// Check if current viewport is desktop
export function isDesktop(): boolean {
  return matchesMediaQuery('desktop')
}

// Check if device supports touch
export function isTouch(): boolean {
  return matchesMediaQuery('touch')
}

// Get responsive value based on current breakpoint
export function getResponsiveValue<T>(
  values: Partial<Record<Breakpoint | 'xs', T>> & { default: T }
): T {
  const breakpoint = getCurrentBreakpoint()
  
  // Find the value for current or smaller breakpoint
  const orderedBreakpoints: (Breakpoint | 'xs')[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = orderedBreakpoints.indexOf(breakpoint)
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = orderedBreakpoints[i]
    if (bp in values && bp !== 'default') {
      return values[bp as keyof typeof values] as T
    }
  }
  
  return values.default
}

// Responsive class builder
export function responsiveClass(
  classes: Partial<Record<Breakpoint | 'xs', string>>
): string {
  return Object.entries(classes)
    .map(([breakpoint, className]) => {
      if (breakpoint === 'xs') return className
      return `${breakpoint}:${className}`
    })
    .join(' ')
}

// Container padding helper
export function getContainerPadding(): string {
  return responsiveClass({
    xs: 'px-4',
    sm: 'px-6',
    lg: 'px-8'
  })
}

// Section spacing helper
export function getSectionSpacing(size: 'sm' | 'md' | 'lg' = 'md'): string {
  const spacingMap = {
    sm: {
      xs: 'py-8',
      md: 'py-12',
      lg: 'py-16'
    },
    md: {
      xs: 'py-12',
      md: 'py-16',
      lg: 'py-20'
    },
    lg: {
      xs: 'py-16',
      md: 'py-20',
      lg: 'py-24'
    }
  }
  
  return responsiveClass(spacingMap[size])
}

// Grid columns helper
export function getGridCols(cols: number): string {
  if (cols === 1) return 'grid-cols-1'
  if (cols === 2) return responsiveClass({ xs: 'grid-cols-1', sm: 'grid-cols-2' })
  if (cols === 3) return responsiveClass({ xs: 'grid-cols-1', sm: 'grid-cols-2', lg: 'grid-cols-3' })
  if (cols === 4) return responsiveClass({ xs: 'grid-cols-1', sm: 'grid-cols-2', lg: 'grid-cols-4' })
  if (cols === 6) return responsiveClass({ xs: 'grid-cols-2', sm: 'grid-cols-3', lg: 'grid-cols-6' })
  if (cols === 12) return responsiveClass({ xs: 'grid-cols-4', sm: 'grid-cols-6', lg: 'grid-cols-12' })
  return `grid-cols-${cols}`
}

// Typography scale helper
export function getTypographyScale(
  element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'small'
): string {
  const scaleMap = {
    h1: responsiveClass({ xs: 'text-4xl', md: 'text-5xl', lg: 'text-6xl' }),
    h2: responsiveClass({ xs: 'text-3xl', md: 'text-4xl', lg: 'text-5xl' }),
    h3: responsiveClass({ xs: 'text-2xl', md: 'text-3xl', lg: 'text-4xl' }),
    h4: responsiveClass({ xs: 'text-xl', md: 'text-2xl', lg: 'text-3xl' }),
    h5: responsiveClass({ xs: 'text-lg', md: 'text-xl', lg: 'text-2xl' }),
    h6: responsiveClass({ xs: 'text-base', md: 'text-lg', lg: 'text-xl' }),
    p: responsiveClass({ xs: 'text-base', lg: 'text-lg' }),
    small: responsiveClass({ xs: 'text-sm', lg: 'text-base' })
  }
  
  return scaleMap[element]
}