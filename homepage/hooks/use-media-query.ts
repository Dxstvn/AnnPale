import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Set the initial state
    setMatches(media.matches)

    // Define the event handler
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)
    
    // Add the event listener
    media.addEventListener('change', handler)
    
    // Clean up
    return () => media.removeEventListener('change', handler)
  }, [query])

  return matches
}

// Preset media queries
export const useIsMobile = () => useMediaQuery('(max-width: 640px)')
export const useIsTablet = () => useMediaQuery('(min-width: 641px) and (max-width: 1023px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1280px)')
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)')
export const useIsReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')