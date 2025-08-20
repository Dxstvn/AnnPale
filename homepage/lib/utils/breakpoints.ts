/**
 * Responsive breakpoints as specified in INTEGRATION_PLAN.md
 * Mobile: 0-639px
 * Tablet: 640px-1023px
 * Desktop: 1024px-1279px
 * Wide: 1280px+
 */

export const breakpoints = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
  wide: 1280,
} as const

export const mediaQueries = {
  // Min-width queries
  tablet: `(min-width: ${breakpoints.tablet}px)`,
  desktop: `(min-width: ${breakpoints.desktop}px)`,
  wide: `(min-width: ${breakpoints.wide}px)`,
  
  // Max-width queries
  mobileOnly: `(max-width: ${breakpoints.tablet - 1}px)`,
  tabletOnly: `(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
  desktopOnly: `(min-width: ${breakpoints.desktop}px) and (max-width: ${breakpoints.wide - 1}px)`,
  
  // Range queries
  belowTablet: `(max-width: ${breakpoints.tablet - 1}px)`,
  belowDesktop: `(max-width: ${breakpoints.desktop - 1}px)`,
  belowWide: `(max-width: ${breakpoints.wide - 1}px)`,
  
  // Device orientation
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  
  // High DPI screens
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Touch capability
  touch: '(hover: none) and (pointer: coarse)',
  hover: '(hover: hover) and (pointer: fine)',
} as const

export type Breakpoint = keyof typeof breakpoints
export type MediaQuery = keyof typeof mediaQueries

/**
 * Hook to detect current breakpoint
 */
export function useBreakpoint() {
  if (typeof window === 'undefined') return 'mobile'
  
  const width = window.innerWidth
  
  if (width < breakpoints.tablet) return 'mobile'
  if (width < breakpoints.desktop) return 'tablet'
  if (width < breakpoints.wide) return 'desktop'
  return 'wide'
}

/**
 * Check if window matches a media query
 */
export function matchesQuery(query: MediaQuery): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(mediaQueries[query]).matches
}

/**
 * Get responsive value based on current breakpoint
 */
export function getResponsiveValue<T>(values: {
  mobile?: T
  tablet?: T
  desktop?: T
  wide?: T
  default: T
}): T {
  const breakpoint = useBreakpoint()
  
  switch (breakpoint) {
    case 'wide':
      return values.wide ?? values.desktop ?? values.tablet ?? values.mobile ?? values.default
    case 'desktop':
      return values.desktop ?? values.tablet ?? values.mobile ?? values.default
    case 'tablet':
      return values.tablet ?? values.mobile ?? values.default
    case 'mobile':
    default:
      return values.mobile ?? values.default
  }
}

/**
 * Tailwind classes for responsive breakpoints
 */
export const tw = {
  // Display utilities
  hideOnMobile: 'hidden sm:block',
  hideOnTablet: 'hidden lg:block',
  hideOnDesktop: 'hidden xl:block',
  showOnMobile: 'block sm:hidden',
  showOnTablet: 'hidden sm:block lg:hidden',
  showOnDesktop: 'hidden lg:block xl:hidden',
  showOnWide: 'hidden xl:block',
  
  // Container widths
  containerMobile: 'w-full',
  containerTablet: 'sm:max-w-screen-md',
  containerDesktop: 'lg:max-w-screen-xl',
  containerWide: 'xl:max-w-[1536px]',
  
  // Padding/spacing
  gutterMobile: 'px-4',
  gutterDesktop: 'lg:px-6',
  sectionSpacingMobile: 'py-12',
  sectionSpacingDesktop: 'lg:py-16',
  
  // Grid columns
  gridMobile: 'grid-cols-4',
  gridTablet: 'sm:grid-cols-6',
  gridDesktop: 'lg:grid-cols-12',
} as const

/**
 * CSS custom properties for breakpoints
 */
export const cssVars = `
  :root {
    --breakpoint-mobile: 0px;
    --breakpoint-tablet: 640px;
    --breakpoint-desktop: 1024px;
    --breakpoint-wide: 1280px;
    
    --container-mobile: 100%;
    --container-tablet: 768px;
    --container-desktop: 1280px;
    --container-wide: 1536px;
    
    --gutter-mobile: 16px;
    --gutter-desktop: 24px;
    
    --section-spacing-mobile: 48px;
    --section-spacing-desktop: 64px;
  }
`