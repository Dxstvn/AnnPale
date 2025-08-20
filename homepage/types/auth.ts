export type UserRole = 'fan' | 'creator' | 'admin'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
  email_verified: boolean
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