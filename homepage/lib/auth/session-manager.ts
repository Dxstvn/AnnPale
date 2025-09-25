import { SupabaseClient } from '@supabase/supabase-js'

interface SessionInfo {
  expiresAt: number
  refreshToken: string | null
}

/**
 * Manages authentication session lifecycle and refresh
 */
export class SessionManager {
  private static instances = new Map<SupabaseClient, SessionManager>()
  private refreshTimer: NodeJS.Timeout | null = null
  private lastRefreshAttempt = 0
  private refreshBackoff = 1000 // Start with 1 second
  private maxBackoff = 60000 // Max 1 minute

  // Session expires after 1 hour (3600 seconds)
  // Refresh 5 minutes before expiry (300 seconds)
  private static readonly SESSION_DURATION = 3600 * 1000 // 1 hour in ms
  private static readonly REFRESH_BUFFER = 300 * 1000 // 5 minutes in ms
  private static readonly MIN_REFRESH_INTERVAL = 30000 // Don't refresh more than every 30 seconds

  private constructor(private supabase: SupabaseClient) {}

  /**
   * Get or create a SessionManager instance for a Supabase client
   */
  static getInstance(supabase: SupabaseClient): SessionManager {
    if (!SessionManager.instances.has(supabase)) {
      SessionManager.instances.set(supabase, new SessionManager(supabase))
    }
    return SessionManager.instances.get(supabase)!
  }

  /**
   * Start monitoring the session and auto-refresh
   */
  async startMonitoring(): Promise<void> {
    // Clear any existing timer
    this.stopMonitoring()

    // Get current session
    const { data: { session } } = await this.supabase.auth.getSession()
    if (!session) return

    // Schedule next refresh
    this.scheduleRefresh(session)
  }

  /**
   * Stop monitoring the session
   */
  stopMonitoring(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  /**
   * Check if session needs refresh
   */
  async needsRefresh(): Promise<boolean> {
    const { data: { session } } = await this.supabase.auth.getSession()
    if (!session) return false

    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0
    const now = Date.now()
    const timeUntilExpiry = expiresAt - now

    // Refresh if less than 5 minutes until expiry
    return timeUntilExpiry < SessionManager.REFRESH_BUFFER
  }

  /**
   * Manually refresh the session with retry logic
   */
  async refreshSession(): Promise<boolean> {
    // Prevent rapid refresh attempts
    const now = Date.now()
    if (now - this.lastRefreshAttempt < SessionManager.MIN_REFRESH_INTERVAL) {
      return true // Assume session is still valid
    }

    this.lastRefreshAttempt = now

    try {
      const { data: { session }, error } = await this.supabase.auth.refreshSession()

      if (error) {
        console.warn('[SessionManager] Failed to refresh session:', error.message)

        // Exponential backoff for retries
        this.refreshBackoff = Math.min(this.refreshBackoff * 2, this.maxBackoff)

        // Schedule retry
        this.refreshTimer = setTimeout(() => {
          this.refreshSession()
        }, this.refreshBackoff)

        return false
      }

      // Reset backoff on success
      this.refreshBackoff = 1000

      if (session) {
        // Schedule next refresh
        this.scheduleRefresh(session)
        return true
      }

      return false
    } catch (error) {
      console.error('[SessionManager] Unexpected error refreshing session:', error)
      return false
    }
  }

  /**
   * Get session info including expiry time
   */
  async getSessionInfo(): Promise<SessionInfo | null> {
    const { data: { session } } = await this.supabase.auth.getSession()
    if (!session) return null

    return {
      expiresAt: session.expires_at ? session.expires_at * 1000 : 0,
      refreshToken: session.refresh_token
    }
  }

  /**
   * Check if session is expired or about to expire
   */
  async isExpired(): Promise<boolean> {
    const info = await this.getSessionInfo()
    if (!info) return true

    const now = Date.now()
    return now >= info.expiresAt
  }

  /**
   * Get time until session expires (in milliseconds)
   */
  async getTimeUntilExpiry(): Promise<number> {
    const info = await this.getSessionInfo()
    if (!info) return 0

    const now = Date.now()
    return Math.max(0, info.expiresAt - now)
  }

  /**
   * Schedule the next refresh based on session expiry
   */
  private scheduleRefresh(session: any): void {
    // Clear any existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
    }

    if (!session || !session.expires_at) return

    const expiresAt = session.expires_at * 1000
    const now = Date.now()
    const timeUntilExpiry = expiresAt - now

    // Schedule refresh 5 minutes before expiry
    const refreshIn = Math.max(
      SessionManager.MIN_REFRESH_INTERVAL,
      timeUntilExpiry - SessionManager.REFRESH_BUFFER
    )

    if (process.env.NODE_ENV === 'development') {
      const minutesUntilRefresh = Math.round(refreshIn / 60000)
      console.log(`[SessionManager] Scheduling refresh in ${minutesUntilRefresh} minutes`)
    }

    this.refreshTimer = setTimeout(async () => {
      await this.refreshSession()
    }, refreshIn)
  }
}

/**
 * Helper function to ensure session is fresh before an operation
 */
export async function ensureFreshSession(supabase: SupabaseClient): Promise<boolean> {
  const manager = SessionManager.getInstance(supabase)

  if (await manager.needsRefresh()) {
    return await manager.refreshSession()
  }

  return true
}

/**
 * Helper to get time until session expires
 */
export async function getSessionExpiry(supabase: SupabaseClient): Promise<{
  expiresIn: number
  isExpired: boolean
  needsRefresh: boolean
}> {
  const manager = SessionManager.getInstance(supabase)
  const timeUntilExpiry = await manager.getTimeUntilExpiry()

  return {
    expiresIn: timeUntilExpiry,
    isExpired: timeUntilExpiry <= 0,
    needsRefresh: timeUntilExpiry < SessionManager.REFRESH_BUFFER
  }
}