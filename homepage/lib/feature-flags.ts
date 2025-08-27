/**
 * Feature flags for controlling feature visibility across the application
 * These flags can be toggled via environment variables to enable/disable features
 * without modifying or removing code.
 */

export const FEATURES = {
  /**
   * Controls the visibility of livestreaming features throughout the application.
   * When false:
   * - Hides livestream navigation items in fan, creator, and admin layouts
   * - Removes livestream-related dashboard widgets and statistics
   * - Redirects livestream routes to appropriate fallback pages
   * - Hides "Browse Live Streams" buttons and related UI elements
   * 
   * To enable: Set NEXT_PUBLIC_ENABLE_LIVESTREAMING=true in .env.local
   * To disable: Set NEXT_PUBLIC_ENABLE_LIVESTREAMING=false in .env.local
   */
  LIVESTREAMING: process.env.NEXT_PUBLIC_ENABLE_LIVESTREAMING === 'true',
  
  // Future feature flags can be added here
  // Example:
  // VIDEO_CALLS: process.env.NEXT_PUBLIC_ENABLE_VIDEO_CALLS === 'true',
  // SUBSCRIPTIONS: process.env.NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS === 'true',
}

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (feature: keyof typeof FEATURES): boolean => {
  return FEATURES[feature] ?? false
}

// Export type for TypeScript support
export type FeatureFlag = keyof typeof FEATURES