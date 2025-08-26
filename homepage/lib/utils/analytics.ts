/**
 * Enhanced video analytics and view tracking utilities
 * Provides session-based tracking and detailed view analytics
 */

export interface ViewSession {
  id: string
  userId?: string
  ipAddress?: string
  userAgent: string
  timestamp: number
  location?: {
    country?: string
    region?: string
    city?: string
  }
}

export interface VideoAnalytics {
  videoId: string
  totalViews: number
  uniqueViews: number
  viewSessions: ViewSession[]
  lastViewedAt?: string
  averageViewDuration?: number
  completionRate?: number
  deviceTypes: Record<string, number>
  locations: Record<string, number>
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Extract device type from user agent
 */
export function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  
  if (/mobile|android|iphone|ipod/.test(ua)) {
    return 'mobile'
  } else if (/tablet|ipad/.test(ua)) {
    return 'tablet'
  } else if (/smart-tv|tv|roku|chromecast/.test(ua)) {
    return 'tv'
  } else {
    return 'desktop'
  }
}

/**
 * Extract browser info from user agent
 */
export function getBrowserInfo(userAgent: string): {
  browser: string
  version: string
} {
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('firefox')) {
    const match = ua.match(/firefox\/(\d+\.\d+)/)
    return { browser: 'Firefox', version: match?.[1] || 'Unknown' }
  } else if (ua.includes('chrome')) {
    const match = ua.match(/chrome\/(\d+\.\d+)/)
    return { browser: 'Chrome', version: match?.[1] || 'Unknown' }
  } else if (ua.includes('safari')) {
    const match = ua.match(/safari\/(\d+\.\d+)/)
    return { browser: 'Safari', version: match?.[1] || 'Unknown' }
  } else if (ua.includes('edge')) {
    const match = ua.match(/edge\/(\d+\.\d+)/)
    return { browser: 'Edge', version: match?.[1] || 'Unknown' }
  }
  
  return { browser: 'Unknown', version: 'Unknown' }
}

/**
 * Check if view should be counted (avoid duplicates within session)
 */
export function shouldCountView(
  existingSessions: ViewSession[],
  currentSession: Partial<ViewSession>,
  sessionDurationMs: number = 24 * 60 * 60 * 1000 // 24 hours
): boolean {
  const now = Date.now()
  
  // Check for duplicate sessions within the time window
  const recentSessions = existingSessions.filter(
    session => now - session.timestamp < sessionDurationMs
  )
  
  // If user is authenticated, check by userId
  if (currentSession.userId) {
    return !recentSessions.some(session => session.userId === currentSession.userId)
  }
  
  // If not authenticated, check by IP + UserAgent combination
  if (currentSession.ipAddress && currentSession.userAgent) {
    return !recentSessions.some(session => 
      session.ipAddress === currentSession.ipAddress &&
      session.userAgent === currentSession.userAgent
    )
  }
  
  // Default: count the view
  return true
}

/**
 * Create view session object
 */
export function createViewSession(
  userId?: string,
  ipAddress?: string,
  userAgent: string = '',
  location?: ViewSession['location']
): ViewSession {
  return {
    id: generateSessionId(),
    userId,
    ipAddress,
    userAgent,
    timestamp: Date.now(),
    location
  }
}

/**
 * Process view tracking data
 */
export function processViewData(
  existingAnalytics: Partial<VideoAnalytics>,
  newSession: ViewSession
): VideoAnalytics {
  const analytics: VideoAnalytics = {
    videoId: existingAnalytics.videoId || '',
    totalViews: existingAnalytics.totalViews || 0,
    uniqueViews: existingAnalytics.uniqueViews || 0,
    viewSessions: existingAnalytics.viewSessions || [],
    deviceTypes: existingAnalytics.deviceTypes || {},
    locations: existingAnalytics.locations || {},
    lastViewedAt: new Date().toISOString(),
    averageViewDuration: existingAnalytics.averageViewDuration,
    completionRate: existingAnalytics.completionRate
  }
  
  // Always increment total views
  analytics.totalViews += 1
  
  // Check if this should count as a unique view
  const shouldCount = shouldCountView(analytics.viewSessions, newSession)
  
  if (shouldCount) {
    analytics.uniqueViews += 1
  }
  
  // Add the session (keep last 1000 sessions max)
  analytics.viewSessions.push(newSession)
  if (analytics.viewSessions.length > 1000) {
    analytics.viewSessions = analytics.viewSessions.slice(-1000)
  }
  
  // Update device type stats
  const deviceType = getDeviceType(newSession.userAgent)
  analytics.deviceTypes[deviceType] = (analytics.deviceTypes[deviceType] || 0) + 1
  
  // Update location stats
  if (newSession.location?.country) {
    const locationKey = newSession.location.city 
      ? `${newSession.location.city}, ${newSession.location.country}`
      : newSession.location.country
    
    analytics.locations[locationKey] = (analytics.locations[locationKey] || 0) + 1
  }
  
  return analytics
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: Request): string | undefined {
  // Check various header sources (in order of preference)
  const headers = [
    'x-forwarded-for',
    'x-real-ip', 
    'cf-connecting-ip', // Cloudflare
    'x-client-ip',
    'x-cluster-client-ip'
  ]
  
  for (const header of headers) {
    const value = request.headers.get(header)
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(',')[0].trim()
      if (ip && ip !== 'unknown') {
        return ip
      }
    }
  }
  
  return undefined
}

/**
 * Get location from IP address (mock implementation)
 * In production, you'd use a service like MaxMind, ipapi.co, or similar
 */
export async function getLocationFromIP(ipAddress: string): Promise<ViewSession['location'] | undefined> {
  try {
    // Mock implementation - in production use a real IP geolocation service
    if (ipAddress === '127.0.0.1' || ipAddress === '::1') {
      return {
        country: 'Local',
        region: 'Local',
        city: 'Local'
      }
    }
    
    // You could integrate with a service like:
    // const response = await fetch(`https://ipapi.co/${ipAddress}/json/`)
    // const data = await response.json()
    // return {
    //   country: data.country_name,
    //   region: data.region,
    //   city: data.city
    // }
    
    // For now, return undefined to avoid external API calls
    return undefined
  } catch (error) {
    console.warn('Failed to get location from IP:', error)
    return undefined
  }
}

/**
 * Calculate view analytics summary
 */
export function calculateViewSummary(analytics: VideoAnalytics): {
  viewsToday: number
  viewsThisWeek: number
  viewsThisMonth: number
  topDeviceType: string
  topLocation: string
} {
  const now = Date.now()
  const oneDayMs = 24 * 60 * 60 * 1000
  const oneWeekMs = 7 * oneDayMs
  const oneMonthMs = 30 * oneDayMs
  
  const viewsToday = analytics.viewSessions.filter(
    session => now - session.timestamp < oneDayMs
  ).length
  
  const viewsThisWeek = analytics.viewSessions.filter(
    session => now - session.timestamp < oneWeekMs
  ).length
  
  const viewsThisMonth = analytics.viewSessions.filter(
    session => now - session.timestamp < oneMonthMs
  ).length
  
  // Find most common device type
  const topDeviceType = Object.entries(analytics.deviceTypes)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown'
  
  // Find most common location
  const topLocation = Object.entries(analytics.locations)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown'
  
  return {
    viewsToday,
    viewsThisWeek,
    viewsThisMonth,
    topDeviceType,
    topLocation
  }
}

/**
 * Clean up old view sessions to prevent memory bloat
 */
export function cleanupOldSessions(
  analytics: VideoAnalytics,
  maxAgeMs: number = 90 * 24 * 60 * 60 * 1000 // 90 days
): VideoAnalytics {
  const cutoffTime = Date.now() - maxAgeMs
  
  const cleanedSessions = analytics.viewSessions.filter(
    session => session.timestamp > cutoffTime
  )
  
  return {
    ...analytics,
    viewSessions: cleanedSessions
  }
}

/**
 * Format analytics data for display
 */
export function formatAnalyticsForDisplay(analytics: VideoAnalytics) {
  const summary = calculateViewSummary(analytics)
  
  return {
    overview: {
      totalViews: analytics.totalViews.toLocaleString(),
      uniqueViews: analytics.uniqueViews.toLocaleString(),
      viewsToday: summary.viewsToday.toLocaleString(),
      viewsThisWeek: summary.viewsThisWeek.toLocaleString(),
      lastViewed: analytics.lastViewedAt ? new Date(analytics.lastViewedAt).toLocaleDateString() : 'Never'
    },
    breakdown: {
      devices: Object.entries(analytics.deviceTypes)
        .sort(([,a], [,b]) => b - a)
        .map(([device, count]) => ({ device, count, percentage: Math.round((count / analytics.totalViews) * 100) })),
      locations: Object.entries(analytics.locations)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10) // Top 10 locations
        .map(([location, count]) => ({ location, count, percentage: Math.round((count / analytics.totalViews) * 100) }))
    }
  }
}