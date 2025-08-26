/**
 * Video Management Types
 * Types for video requests, uploads, transactions, and access control
 */

/**
 * Payment provider options
 */
export type PaymentProvider = 'stripe' | 'moncash' | 'paypal'

/**
 * Video request status
 */
export type VideoRequestStatus = 
  | 'pending'      // Request created, awaiting creator acceptance
  | 'accepted'     // Creator accepted, awaiting recording
  | 'rejected'     // Creator rejected the request
  | 'recording'    // Creator is recording the video
  | 'processing'   // Video uploaded, being processed
  | 'completed'    // Video delivered to fan
  | 'cancelled'    // Request cancelled (refunded)
  | 'expired'      // Deadline passed without completion

/**
 * Currency codes supported
 */
export type CurrencyCode = 'USD' | 'HTG' | 'EUR'

/**
 * Video quality options
 */
export type VideoQuality = '720p' | '1080p' | '4k'

/**
 * Video request from a fan to a creator
 */
export interface VideoRequest {
  id: string
  fan_id: string
  creator_id: string
  
  // Request details
  occasion: string
  recipient_name: string
  instructions: string
  is_public: boolean
  
  // Timing
  deadline?: Date
  requested_at: Date
  accepted_at?: Date
  completed_at?: Date
  
  // Status
  status: VideoRequestStatus
  rejection_reason?: string
  
  // Pricing
  price_usd: number
  price_htg?: number
  currency: CurrencyCode
  
  // Relations
  fan?: UserProfile
  creator?: UserProfile
  video?: Video
  transaction?: Transaction
  
  // Metadata
  created_at: Date
  updated_at: Date
}

/**
 * Video file and metadata
 */
export interface Video {
  id: string
  request_id: string
  creator_id: string
  
  // Storage paths
  storage_path: string
  thumbnail_path?: string
  preview_path?: string
  
  // Video metadata
  duration_seconds: number
  file_size_bytes: number
  mime_type: string
  width?: number
  height?: number
  
  // Processing status
  is_processed: boolean
  processing_error?: string
  
  // Visibility
  is_active: boolean
  
  // Analytics
  view_count: number
  download_count: number
  last_viewed_at?: Date
  
  // Relations
  request?: VideoRequest
  creator?: UserProfile
  
  // Timestamps
  recorded_at: Date
  created_at: Date
  updated_at: Date
}

/**
 * Transaction record for payments
 */
export interface Transaction {
  id: string
  request_id?: string
  fan_id: string
  creator_id: string
  
  // Payment details
  amount: number
  currency: CurrencyCode
  payment_provider: PaymentProvider
  provider_transaction_id?: string
  
  // Status
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  failure_reason?: string
  
  // Provider-specific IDs
  stripe_payment_intent_id?: string
  stripe_charge_id?: string
  moncash_transaction_id?: string
  moncash_reference?: string
  
  // Location data
  user_country?: string
  user_region?: string
  detected_location?: GeolocationData
  
  // Fees and payouts
  platform_fee?: number
  creator_payout?: number
  
  // Relations
  request?: VideoRequest
  fan?: UserProfile
  creator?: UserProfile
  
  // Timestamps
  initiated_at: Date
  completed_at?: Date
  refunded_at?: Date
  created_at: Date
  updated_at: Date
}

/**
 * Video access control
 */
export interface VideoAccess {
  id: string
  video_id: string
  user_id: string
  transaction_id?: string
  
  // Access details
  granted_at: Date
  expires_at?: Date
  download_allowed: boolean
  
  // Usage tracking
  view_count: number
  last_viewed_at?: Date
  downloaded_at?: Date
  
  // Relations
  video?: Video
  user?: UserProfile
  transaction?: Transaction
}

/**
 * Creator video settings and preferences
 */
export interface CreatorVideoSettings {
  creator_id: string
  
  // Availability
  is_accepting_requests: boolean
  
  // Pricing
  base_price_usd: number
  base_price_htg?: number
  
  // Turnaround time
  standard_delivery_days: number
  express_delivery_days: number
  express_multiplier: number
  
  // Request preferences
  max_video_length_seconds: number
  auto_accept_requests: boolean
  
  // Recording settings
  default_video_quality: VideoQuality
  add_watermark: boolean
  
  // Payout preferences
  payout_method?: 'stripe' | 'moncash' | 'bank_transfer'
  payout_details?: Record<string, any> // Encrypted
  
  // Statistics
  total_videos_created: number
  total_earnings_usd: number
  average_rating?: number
  
  // Relations
  creator?: UserProfile
  
  // Timestamps
  created_at: Date
  updated_at: Date
}

/**
 * Geolocation data from IP detection
 */
export interface GeolocationData {
  country?: string
  country_code?: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
  timezone?: string
  currency?: CurrencyCode
  is_haiti?: boolean
}

/**
 * Video upload progress
 */
export interface VideoUploadProgress {
  bytesUploaded: number
  totalBytes: number
  percentage: number
  estimatedTimeRemaining?: number
  uploadSpeed?: number
}

/**
 * Video recording session
 */
export interface VideoRecordingSession {
  request_id: string
  creator_id: string
  started_at: Date
  stream?: MediaStream
  recorder?: MediaRecorder
  chunks: Blob[]
  duration: number
  is_recording: boolean
  is_paused: boolean
}

/**
 * Payment method selection
 */
export interface PaymentMethodSelection {
  provider: PaymentProvider
  display_name: string
  icon: string
  is_available: boolean
  is_recommended: boolean
  currency: CurrencyCode
  min_amount?: number
  max_amount?: number
  processing_fee_percentage?: number
  fixed_fee?: number
}

/**
 * Video request form data
 */
export interface VideoRequestFormData {
  creator_id: string
  occasion: string
  recipient_name: string
  instructions: string
  deadline?: Date
  is_public?: boolean
  delivery_speed: 'standard' | 'express'
}

/**
 * Creator earnings summary
 */
export interface CreatorEarnings {
  total_earnings: number
  pending_payouts: number
  available_balance: number
  currency: CurrencyCode
  earnings_by_month: {
    month: string
    amount: number
    video_count: number
  }[]
  top_earning_videos: Video[]
  payment_method?: PaymentProvider
}

/**
 * Import UserProfile type from auth
 */
import type { UserProfile } from './auth'