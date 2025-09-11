import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface ServiceResult<T> {
  data?: T
  error?: string
  success: boolean
}

export interface ServiceError {
  code: string
  message: string
  details?: any
}

export abstract class BaseService {
  protected supabase: SupabaseClient

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createClient()
  }

  protected handleError(error: any, context: string): ServiceResult<never> {
    console.error(`[${this.constructor.name}] Error in ${context}:`, error)
    
    // Handle Supabase specific errors
    if (error?.code) {
      return {
        success: false,
        error: `Database error: ${error.message || 'Unknown error'}`
      }
    }

    // Handle network errors
    if (error?.name === 'NetworkError' || error?.message?.includes('fetch')) {
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      }
    }

    // Handle generic errors
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred'
    }
  }

  protected async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    
    if (error) {
      throw new Error(`Authentication error: ${error.message}`)
    }

    if (!user) {
      throw new Error('User not authenticated')
    }

    return user
  }

  protected async getUserProfile(userId?: string) {
    const targetUserId = userId || (await this.getCurrentUser()).id
    
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`)
    }

    return profile
  }

  protected validateRequired(value: any, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
      throw new Error(`${fieldName} is required`)
    }
  }

  protected validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address')
    }
  }

  protected validateAmount(amount: number, fieldName: string = 'Amount'): void {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error(`${fieldName} must be a positive number`)
    }
  }

  protected validateUUID(uuid: string, fieldName: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(uuid)) {
      throw new Error(`${fieldName} must be a valid UUID`)
    }
  }

  protected async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        if (attempt === maxRetries) {
          break
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
    
    throw lastError
  }
}

// Server-side base service for API routes
export abstract class BaseServerService extends BaseService {
  constructor() {
    super()
    this.initializeServerClient()
  }

  private async initializeServerClient() {
    this.supabase = await createServerClient()
  }
}