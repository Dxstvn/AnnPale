export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      payment_intents: {
        Row: {
          id: string
          user_id: string
          creator_id: string
          amount: number
          currency: string
          status: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          creator_id: string
          amount: number
          currency?: string
          status: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          creator_id?: string
          amount?: number
          currency?: string
          status?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          creator_id: string
          video_request_id: string
          payment_intent_id: string | null
          amount: number
          currency: string
          platform_fee: number
          creator_earnings: number
          status: string
          metadata: Json
          accepted_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          creator_id: string
          video_request_id: string
          payment_intent_id?: string | null
          amount: number
          currency?: string
          platform_fee: number
          creator_earnings: number
          status?: string
          metadata?: Json
          accepted_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          creator_id?: string
          video_request_id?: string
          payment_intent_id?: string | null
          amount?: number
          currency?: string
          platform_fee?: number
          creator_earnings?: number
          status?: string
          metadata?: Json
          accepted_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stripe_accounts: {
        Row: {
          id: string
          creator_id: string
          stripe_account_id: string
          charges_enabled: boolean
          payouts_enabled: boolean
          onboarding_complete: boolean
          requirements_currently_due: string[] | null
          requirements_eventually_due: string[] | null
          requirements_past_due: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          stripe_account_id: string
          charges_enabled?: boolean
          payouts_enabled?: boolean
          onboarding_complete?: boolean
          requirements_currently_due?: string[] | null
          requirements_eventually_due?: string[] | null
          requirements_past_due?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          stripe_account_id?: string
          charges_enabled?: boolean
          payouts_enabled?: boolean
          onboarding_complete?: boolean
          requirements_currently_due?: string[] | null
          requirements_eventually_due?: string[] | null
          requirements_past_due?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      video_uploads: {
        Row: {
          id: string
          order_id: string
          creator_id: string
          original_filename: string
          video_url: string | null
          thumbnail_url: string | null
          duration: number | null
          size_bytes: number | null
          processing_status: string
          processing_error: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          creator_id: string
          original_filename: string
          video_url?: string | null
          thumbnail_url?: string | null
          duration?: number | null
          size_bytes?: number | null
          processing_status?: string
          processing_error?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          creator_id?: string
          original_filename?: string
          video_url?: string | null
          thumbnail_url?: string | null
          duration?: number | null
          size_bytes?: number | null
          processing_status?: string
          processing_error?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          stripe_payment_id: string
          amount: number
          platform_fee: number
          creator_earnings: number
          status: string
          stripe_fee: number | null
          net_platform_fee: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          stripe_payment_id: string
          amount: number
          platform_fee: number
          creator_earnings: number
          status: string
          stripe_fee?: number | null
          net_platform_fee?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          stripe_payment_id?: string
          amount?: number
          platform_fee?: number
          creator_earnings?: number
          status?: string
          stripe_fee?: number | null
          net_platform_fee?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          avatar_url: string | null
          user_type: string
          bio: string | null
          location: string | null
          website_url: string | null
          twitter_handle: string | null
          instagram_handle: string | null
          tiktok_handle: string | null
          youtube_handle: string | null
          facebook_handle: string | null
          category: string | null
          price_per_video: number | null
          video_turnaround_days: number | null
          is_available: boolean
          stripe_account_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          user_type?: string
          bio?: string | null
          location?: string | null
          website_url?: string | null
          twitter_handle?: string | null
          instagram_handle?: string | null
          tiktok_handle?: string | null
          youtube_handle?: string | null
          facebook_handle?: string | null
          category?: string | null
          price_per_video?: number | null
          video_turnaround_days?: number | null
          is_available?: boolean
          stripe_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          user_type?: string
          bio?: string | null
          location?: string | null
          website_url?: string | null
          twitter_handle?: string | null
          instagram_handle?: string | null
          tiktok_handle?: string | null
          youtube_handle?: string | null
          facebook_handle?: string | null
          category?: string | null
          price_per_video?: number | null
          video_turnaround_days?: number | null
          is_available?: boolean
          stripe_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      video_requests: {
        Row: {
          id: string
          user_id: string
          creator_id: string
          title: string
          description: string | null
          occasion: string | null
          recipient_name: string | null
          price: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          creator_id: string
          title: string
          description?: string | null
          occasion?: string | null
          recipient_name?: string | null
          price: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          creator_id?: string
          title?: string
          description?: string | null
          occasion?: string | null
          recipient_name?: string | null
          price?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      webhook_events: {
        Row: {
          id: string
          provider: string
          event_type: string
          event_id: string
          payload: Json
          processed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          provider: string
          event_type: string
          event_id: string
          payload: Json
          processed_at: string
          created_at?: string
        }
        Update: {
          id?: string
          provider?: string
          event_type?: string
          event_id?: string
          payload?: Json
          processed_at?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          type: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          data: Json
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          data?: Json
          created_at?: string
        }
      }
      disputes: {
        Row: {
          id: string
          order_id: string
          user_id: string
          creator_id: string
          reason: string
          description: string | null
          evidence: Json
          status: string
          admin_notes: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          user_id: string
          creator_id: string
          reason: string
          description?: string | null
          evidence?: Json
          status?: string
          admin_notes?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          user_id?: string
          creator_id?: string
          reason?: string
          description?: string | null
          evidence?: Json
          status?: string
          admin_notes?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      creator_stats: {
        Row: {
          id: string
          creator_id: string
          total_orders: number
          pending_orders: number
          accepted_orders: number
          completed_orders: number
          rejected_orders: number
          refunded_orders: number
          total_earnings: number
          pending_earnings: number
          available_balance: number
          total_refunds: number
          average_completion_time: string | null
          completion_rate: number
          acceptance_rate: number
          average_rating: number
          total_reviews: number
          last_order_at: string | null
          last_payout_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          total_orders?: number
          pending_orders?: number
          accepted_orders?: number
          completed_orders?: number
          rejected_orders?: number
          refunded_orders?: number
          total_earnings?: number
          pending_earnings?: number
          available_balance?: number
          total_refunds?: number
          average_completion_time?: string | null
          completion_rate?: number
          acceptance_rate?: number
          average_rating?: number
          total_reviews?: number
          last_order_at?: string | null
          last_payout_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          total_orders?: number
          pending_orders?: number
          accepted_orders?: number
          completed_orders?: number
          rejected_orders?: number
          refunded_orders?: number
          total_earnings?: number
          pending_earnings?: number
          available_balance?: number
          total_refunds?: number
          average_completion_time?: string | null
          completion_rate?: number
          acceptance_rate?: number
          average_rating?: number
          total_reviews?: number
          last_order_at?: string | null
          last_payout_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      platform_revenue: {
        Row: {
          id: string
          order_id: string | null
          payment_intent_id: string | null
          platform_fee: number
          stripe_fee: number
          net_revenue: number
          currency: string
          status: string
          refund_amount: number
          creator_id: string | null
          fan_id: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          payment_intent_id?: string | null
          platform_fee: number
          stripe_fee?: number
          net_revenue: number
          currency?: string
          status?: string
          refund_amount?: number
          creator_id?: string | null
          fan_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          payment_intent_id?: string | null
          platform_fee?: number
          stripe_fee?: number
          net_revenue?: number
          currency?: string
          status?: string
          refund_amount?: number
          creator_id?: string | null
          fan_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      daily_platform_stats: {
        Row: {
          id: string
          date: string
          total_orders: number
          completed_orders: number
          refunded_orders: number
          gross_revenue: number
          platform_fees: number
          stripe_fees: number
          net_revenue: number
          total_refunds: number
          active_creators: number
          active_fans: number
          new_creators: number
          new_fans: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          total_orders?: number
          completed_orders?: number
          refunded_orders?: number
          gross_revenue?: number
          platform_fees?: number
          stripe_fees?: number
          net_revenue?: number
          total_refunds?: number
          active_creators?: number
          active_fans?: number
          new_creators?: number
          new_fans?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          total_orders?: number
          completed_orders?: number
          refunded_orders?: number
          gross_revenue?: number
          platform_fees?: number
          stripe_fees?: number
          net_revenue?: number
          total_refunds?: number
          active_creators?: number
          active_fans?: number
          new_creators?: number
          new_fans?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}