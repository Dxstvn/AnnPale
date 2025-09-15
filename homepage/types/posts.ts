export interface Post {
  id: string
  creator_id: string
  title: string
  description?: string
  content_type: 'video' | 'image' | 'text' | 'live'

  // Media URLs
  thumbnail_url?: string
  video_url?: string
  image_url?: string

  // Access control
  access_tier_ids?: string[]
  is_public: boolean
  is_preview: boolean
  is_featured: boolean

  // Engagement metrics
  likes_count: number
  views_count: number
  comments_count: number
  shares_count: number

  // Status and timing
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  created_at: string
  updated_at: string

  // Relations
  creator?: {
    id: string
    display_name: string
    username: string
    profile_image_url?: string
    avatar_url?: string
  }
  access_tiers?: SubscriptionTier[]

  // User-specific data
  is_liked?: boolean
  is_viewed?: boolean
  has_access?: boolean
}

export interface SubscriptionTier {
  id: string
  name: string
  price: number
  currency?: string
  description?: string
  benefits?: string[]
  color?: string
}

export interface CreatePostData {
  title: string
  description?: string
  content_type: 'video' | 'image' | 'text' | 'live'
  thumbnail_url?: string
  video_url?: string
  image_url?: string
  access_tier_ids?: string[]
  is_public?: boolean
  is_preview?: boolean
  is_featured?: boolean
  preview_order?: number
  status?: 'draft' | 'published'
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string
}

export interface PostEngagement {
  post_id: string
  is_liked: boolean
  likes_count: number
  views_count: number
  comments_count: number
  user_has_access: boolean
}

export interface PostComment {
  id: string
  post_id: string
  user_id: string
  parent_comment_id?: string
  content: string
  likes_count: number
  created_at: string
  updated_at: string

  // Relations
  user?: {
    id: string
    display_name: string
    username: string
    profile_image_url?: string
    avatar_url?: string
  }
  parent_comment?: {
    id: string
    user?: {
      display_name: string
      username: string
    }
  }
  replies?: PostComment[]

  // User-specific data
  is_liked?: boolean
  is_own?: boolean
}

export interface PostView {
  id: string
  post_id: string
  user_id: string
  viewed_at: string
}

export interface MediaUploadResponse {
  success: boolean
  url: string
  storage_path: string
  media_type: 'video' | 'image' | 'thumbnail'
  file_size: number
  file_name: string
  thumbnail_url?: string
}

export interface PostFilters {
  content_type?: 'video' | 'image' | 'text' | 'live' | 'all'
  status?: 'draft' | 'published' | 'archived' | 'all'
  access_level?: 'public' | 'subscribers' | 'tiers' | 'all'
  is_featured?: boolean
  date_range?: {
    start: string
    end: string
  }
}