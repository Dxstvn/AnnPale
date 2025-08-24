/**
 * User roles in the application
 * @enum {string}
 */
export type UserRole = 'fan' | 'creator' | 'admin'

/**
 * User profile stored in the database
 * @interface UserProfile
 */
export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
  email_verified?: boolean
  phone?: string
  location?: string
  language_preference?: 'en' | 'fr' | 'ht'
}

export interface AuthResponse {
  user: UserProfile | null
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
  } | null
  error?: string
}

export interface SignUpRequest {
  email: string
  password?: string
  name: string
  role: 'fan' | 'creator'
  language?: 'en' | 'fr' | 'ht'
}

export interface LoginRequest {
  email: string
  password?: string
  provider?: 'email' | 'google' | 'apple' | 'twitter'
}

export interface MagicLinkRequest {
  email: string
  redirectTo?: string
}

/**
 * Role hierarchy for permission checking
 * Higher numbers indicate higher privileges
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  creator: 2,
  fan: 1,
}

/**
 * Check if a user has at least the required role level
 * @param userRole - The user's current role
 * @param requiredRole - The minimum required role
 * @returns true if user has sufficient privileges
 */
export function hasMinimumRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

/**
 * Check if a user has exactly the specified role
 * @param userRole - The user's current role
 * @param requiredRole - The required role
 * @returns true if roles match exactly
 */
export function hasExactRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  return userRole === requiredRole
}

/**
 * Get the dashboard path for a specific role
 * @param role - The user's role
 * @returns The appropriate dashboard path
 */
export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'creator':
      return '/creator/dashboard'
    case 'fan':
    default:
      return '/fan/dashboard'
  }
}

/**
 * Get the default redirect path after authentication
 * @param role - The user's role
 * @returns The appropriate redirect path
 */
export function getAuthRedirectPath(role: UserRole | undefined): string {
  if (!role) return '/'
  return getDashboardPath(role)
}