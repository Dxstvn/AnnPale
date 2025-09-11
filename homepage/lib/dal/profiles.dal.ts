import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from './auth.dal'

/**
 * Data Access Layer for Profiles
 * Server-only operations with proper authorization
 */

export interface ProfileDTO {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  bio?: string
  userRole: 'fan' | 'creator' | 'admin'
  price?: number
  responseTime?: string
  rating?: number
  totalReviews?: number
  isVerified?: boolean
  socialLinks?: {
    instagram?: string
    twitter?: string
    youtube?: string
    tiktok?: string
  }
  categories?: string[]
  languages?: string[]
  createdAt: string
}

export interface CreatorProfileDTO extends ProfileDTO {
  totalEarnings?: number
  completedVideos?: number
  responseRate?: number
  subscriptionTiers?: Array<{
    id: string
    name: string
    price: number
    benefits: string[]
  }>
}

/**
 * Get a profile by ID
 */
export const getProfileById = cache(async (profileId: string): Promise<ProfileDTO | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    userRole: data.user_role,
    price: data.price,
    responseTime: data.response_time,
    rating: data.rating,
    totalReviews: data.total_reviews,
    isVerified: data.is_verified,
    socialLinks: data.social_links,
    categories: data.categories,
    languages: data.languages,
    createdAt: data.created_at,
  }
})

/**
 * Get creator profile with additional stats
 */
export const getCreatorProfile = cache(async (creatorId: string): Promise<CreatorProfileDTO | null> => {
  const supabase = await createClient()

  // Get basic profile
  const profile = await getProfileById(creatorId)
  
  if (!profile || profile.userRole !== 'creator') {
    return null
  }

  // Get creator stats
  const { data: stats } = await supabase
    .from('creator_stats')
    .select('total_earnings, completed_orders, completion_rate')
    .eq('creator_id', creatorId)
    .single()

  // Get subscription tiers
  const { data: tiers } = await supabase
    .from('subscription_tiers')
    .select('id, name, price, benefits')
    .eq('creator_id', creatorId)
    .eq('is_active', true)
    .order('price', { ascending: true })

  return {
    ...profile,
    totalEarnings: stats?.total_earnings,
    completedVideos: stats?.completed_orders,
    responseRate: stats?.completion_rate,
    subscriptionTiers: tiers || [],
  }
})

/**
 * Update current user's profile
 */
export async function updateProfile(updates: Partial<{
  displayName: string
  bio: string
  avatarUrl: string
  price: number
  responseTime: string
  socialLinks: any
  categories: string[]
  languages: string[]
}>): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) return false

  const supabase = await createClient()

  const updateData: any = {}
  
  if (updates.displayName !== undefined) updateData.display_name = updates.displayName
  if (updates.bio !== undefined) updateData.bio = updates.bio
  if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl
  if (updates.price !== undefined) updateData.price = updates.price
  if (updates.responseTime !== undefined) updateData.response_time = updates.responseTime
  if (updates.socialLinks !== undefined) updateData.social_links = updates.socialLinks
  if (updates.categories !== undefined) updateData.categories = updates.categories
  if (updates.languages !== undefined) updateData.languages = updates.languages

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)

  return !error
}

/**
 * Get featured creators
 */
export const getFeaturedCreators = cache(async (limit: number = 12): Promise<ProfileDTO[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_role', 'creator')
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error || !data) {
    return []
  }

  return data.map(profile => ({
    id: profile.id,
    email: profile.email,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    userRole: profile.user_role,
    price: profile.price,
    responseTime: profile.response_time,
    rating: profile.rating,
    totalReviews: profile.total_reviews,
    isVerified: profile.is_verified,
    socialLinks: profile.social_links,
    categories: profile.categories,
    languages: profile.languages,
    createdAt: profile.created_at,
  }))
})

/**
 * Search creators by category or name
 */
export const searchCreators = cache(async (
  query?: string,
  category?: string,
  priceRange?: { min: number; max: number },
  limit: number = 50
): Promise<ProfileDTO[]> => {
  const supabase = await createClient()

  let dbQuery = supabase
    .from('profiles')
    .select('*')
    .eq('user_role', 'creator')

  if (query) {
    dbQuery = dbQuery.or(`display_name.ilike.%${query}%,bio.ilike.%${query}%`)
  }

  if (category) {
    dbQuery = dbQuery.contains('categories', [category])
  }

  if (priceRange) {
    dbQuery = dbQuery
      .gte('price', priceRange.min)
      .lte('price', priceRange.max)
  }

  const { data, error } = await dbQuery
    .order('rating', { ascending: false })
    .limit(limit)

  if (error || !data) {
    return []
  }

  return data.map(profile => ({
    id: profile.id,
    email: profile.email,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    userRole: profile.user_role,
    price: profile.price,
    responseTime: profile.response_time,
    rating: profile.rating,
    totalReviews: profile.total_reviews,
    isVerified: profile.is_verified,
    socialLinks: profile.social_links,
    categories: profile.categories,
    languages: profile.languages,
    createdAt: profile.created_at,
  }))
})

/**
 * Get creators by category
 */
export const getCreatorsByCategory = cache(async (
  category: string,
  limit: number = 20
): Promise<ProfileDTO[]> => {
  return searchCreators(undefined, category, undefined, limit)
})

/**
 * Get top rated creators
 */
export const getTopCreators = cache(async (limit: number = 10): Promise<CreatorProfileDTO[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('creator_rankings_mv')
    .select('*')
    .limit(limit)

  if (error || !data) {
    // Fallback to regular query if materialized view doesn't exist
    const { data: profiles } = await supabase
      .from('profiles')
      .select(`
        *,
        creator_stats!inner(total_earnings, completed_orders, average_rating)
      `)
      .eq('user_role', 'creator')
      .order('creator_stats.average_rating', { ascending: false })
      .limit(limit)

    if (!profiles) return []

    return profiles.map(p => ({
      id: p.id,
      email: p.email,
      displayName: p.display_name,
      avatarUrl: p.avatar_url,
      bio: p.bio,
      userRole: p.user_role,
      price: p.price,
      responseTime: p.response_time,
      rating: p.creator_stats?.average_rating,
      totalReviews: p.total_reviews,
      isVerified: p.is_verified,
      socialLinks: p.social_links,
      categories: p.categories,
      languages: p.languages,
      createdAt: p.created_at,
      totalEarnings: p.creator_stats?.total_earnings,
      completedVideos: p.creator_stats?.completed_orders,
    }))
  }

  // Map from materialized view
  return data.map(creator => ({
    id: creator.creator_id,
    email: '', // Not in view
    displayName: creator.display_name,
    avatarUrl: creator.avatar_url,
    bio: creator.bio,
    userRole: 'creator' as const,
    price: creator.price,
    responseTime: creator.response_time,
    rating: creator.average_rating,
    totalReviews: creator.total_orders,
    isVerified: creator.is_verified,
    socialLinks: {},
    categories: creator.categories,
    languages: [],
    createdAt: creator.created_at,
    totalEarnings: creator.total_earnings,
    completedVideos: creator.completed_orders,
    responseRate: creator.completion_rate,
  }))
})

/**
 * Verify if a user can edit a profile
 */
export async function canEditProfile(profileId: string): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) return false
  
  // Users can edit their own profile, admins can edit any
  return profileId === user.id || user.role === 'admin'
}