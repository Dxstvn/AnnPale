/**
 * Utility functions for determining the correct site URL
 * Works in both client and server contexts
 */

/**
 * Get the site URL based on the current environment
 * @returns The full site URL including protocol
 */
export function getSiteUrl(): string {
  // Client-side detection
  if (typeof window !== 'undefined') {
    const origin = window.location.origin

    // In production, always use www.annpale.com
    if (origin.includes('annpale.com') && !origin.includes('www.')) {
      return 'https://www.annpale.com'
    }

    return origin
  }

  // Server-side detection
  // Check for explicitly set site URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    // Ensure production always uses www
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (siteUrl.includes('annpale.com') && !siteUrl.includes('www.')) {
      return 'https://www.annpale.com'
    }
    return siteUrl
  }

  // Check Vercel URL (for preview deployments)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }

  // Fallback to localhost for development
  return 'http://localhost:3000'
}

/**
 * Validate if a URL is safe to redirect to
 * @param url The URL to validate
 * @returns True if the URL is safe to redirect to
 */
export function isValidRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url, getSiteUrl())
    const siteUrl = new URL(getSiteUrl())

    // Allow relative URLs and same-origin URLs
    return parsed.origin === siteUrl.origin
  } catch {
    // If URL parsing fails, check if it's a relative path
    return url.startsWith('/') && !url.startsWith('//')
  }
}

/**
 * Ensure a URL is absolute
 * @param url The URL to process
 * @returns An absolute URL
 */
export function ensureAbsoluteUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const siteUrl = getSiteUrl()
  // Remove trailing slash from site URL and leading slash from path
  const cleanSiteUrl = siteUrl.replace(/\/$/, '')
  const cleanPath = url.startsWith('/') ? url : `/${url}`

  return `${cleanSiteUrl}${cleanPath}`
}