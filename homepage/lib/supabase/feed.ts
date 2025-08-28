import { createClient } from "@/lib/supabase/client"
import { PostData } from "@/components/feed/PostCard"

const PAGE_SIZE = 10

export async function getFeedPosts(
  userId: string, 
  cursor?: string | null,
  limit: number = PAGE_SIZE
): Promise<{ posts: PostData[], nextCursor: string | null }> {
  const supabase = createClient()
  
  try {
    // For now, since posts table doesn't exist yet, we'll return mock data
    // This will be replaced with actual Supabase queries once database is set up
    
    // Future implementation:
    /*
    let query = supabase
      .from('posts')
      .select(`
        *,
        creator:profiles!creator_id (
          id,
          username,
          display_name,
          avatar_url,
          is_verified
        ),
        engagements:post_engagements (
          engagement_type,
          user_id
        ),
        user_subscription:fan_subscriptions!inner (
          tier:creator_subscription_tiers (
            id,
            name,
            color
          )
        )
      `)
      .or('visibility.eq.public,creator_id.in.(SELECT creator_id FROM fan_subscriptions WHERE user_id = ${userId})')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (cursor) {
      query = query.lt('created_at', cursor)
    }
    
    const { data, error } = await query
    */
    
    // Mock implementation for testing
    const mockPosts: PostData[] = []
    
    // Get some demo profiles to use
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'creator')
      .limit(5)
    
    if (profiles) {
      profiles.forEach((profile, index) => {
        mockPosts.push({
          id: `post-${profile.id}-${index}`,
          creator: {
            id: profile.id,
            username: profile.username || profile.email?.split('@')[0] || 'user',
            displayName: profile.display_name || 'Creator',
            avatar: profile.avatar_url || '/placeholder.svg',
            isVerified: profile.is_verified || false,
            subscriberTier: index % 2 === 0 ? 'Premium' : undefined
          },
          content: `This is a sample post from ${profile.display_name}. Check out my latest content and don't forget to subscribe! 🎵`,
          mediaUrls: index % 3 === 0 ? ['/placeholder.svg'] : undefined,
          postType: index % 3 === 0 ? 'image' : 'text',
          engagement: {
            likes: Math.floor(Math.random() * 1000),
            reposts: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 50),
            isLiked: false,
            isReposted: false,
            isBookmarked: false
          },
          visibility: 'public',
          createdAt: new Date(Date.now() - index * 60 * 60 * 1000).toISOString()
        })
      })
    }
    
    return {
      posts: mockPosts,
      nextCursor: mockPosts.length >= limit ? mockPosts[mockPosts.length - 1].createdAt : null
    }
  } catch (error) {
    console.error('Failed to fetch feed posts:', error)
    return { posts: [], nextCursor: null }
  }
}

export async function getFollowingPosts(
  userId: string,
  cursor?: string | null,
  limit: number = PAGE_SIZE  
): Promise<{ posts: PostData[], nextCursor: string | null }> {
  const supabase = createClient()
  
  try {
    // Get subscribed creators
    const { data: subscriptions } = await supabase
      .from('fan_subscriptions')
      .select(`
        creator:profiles!creator_id (
          id,
          username,
          display_name,
          avatar_url,
          is_verified
        ),
        tier:creator_subscription_tiers (
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
    
    if (!subscriptions || subscriptions.length === 0) {
      return { posts: [], nextCursor: null }
    }
    
    // Mock posts from subscribed creators
    const mockPosts: PostData[] = []
    
    subscriptions.forEach((sub, index) => {
      if (sub.creator) {
        mockPosts.push({
          id: `following-post-${sub.creator.id}-${index}`,
          creator: {
            id: sub.creator.id,
            username: sub.creator.username || 'creator',
            displayName: sub.creator.display_name || 'Creator',
            avatar: sub.creator.avatar_url || '/placeholder.svg',
            isVerified: sub.creator.is_verified || false,
            subscriberTier: sub.tier?.name,
            tierColor: 'from-purple-600 to-pink-600'
          },
          content: `Exclusive content for my subscribers! Thank you for being part of the ${sub.tier?.name || 'community'}! 💜`,
          postType: 'text',
          engagement: {
            likes: Math.floor(Math.random() * 500) + 100,
            reposts: Math.floor(Math.random() * 50) + 10,
            comments: Math.floor(Math.random() * 30) + 5,
            isLiked: Math.random() > 0.5,
            isReposted: false,
            isBookmarked: Math.random() > 0.7
          },
          visibility: 'subscribers',
          tierRequired: sub.tier?.name,
          createdAt: new Date(Date.now() - index * 2 * 60 * 60 * 1000).toISOString()
        })
      }
    })
    
    return {
      posts: mockPosts,
      nextCursor: mockPosts.length >= limit ? mockPosts[mockPosts.length - 1].createdAt : null
    }
  } catch (error) {
    console.error('Failed to fetch following posts:', error)
    return { posts: [], nextCursor: null }
  }
}

export async function createPost(
  userId: string,
  content: string,
  mediaUrls: string[],
  postType: 'text' | 'image' | 'video',
  visibility: 'public' | 'subscribers' | 'tier-specific',
  tierRequired?: string
): Promise<PostData | null> {
  const supabase = createClient()
  
  try {
    // Future implementation when posts table exists
    /*
    const { data, error } = await supabase
      .from('posts')
      .insert({
        creator_id: userId,
        content,
        media_urls: mediaUrls,
        post_type: postType,
        visibility,
        required_tier_id: tierRequired,
      })
      .select(`
        *,
        creator:profiles!creator_id (*)
      `)
      .single()
    */
    
    // Mock implementation
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (!profile) return null
    
    const mockPost: PostData = {
      id: `new-post-${Date.now()}`,
      creator: {
        id: profile.id,
        username: profile.username || 'creator',
        displayName: profile.display_name || 'Creator',
        avatar: profile.avatar_url || '/placeholder.svg',
        isVerified: profile.is_verified || false
      },
      content,
      mediaUrls,
      postType,
      engagement: {
        likes: 0,
        reposts: 0,
        comments: 0,
        isLiked: false,
        isReposted: false,
        isBookmarked: false
      },
      visibility,
      tierRequired,
      createdAt: new Date().toISOString()
    }
    
    return mockPost
  } catch (error) {
    console.error('Failed to create post:', error)
    return null
  }
}

export async function toggleLike(
  userId: string,
  postId: string,
  isLiked: boolean
): Promise<boolean> {
  const supabase = createClient()
  
  try {
    if (isLiked) {
      // Remove like
      /*
      await supabase
        .from('post_engagements')
        .delete()
        .match({
          post_id: postId,
          user_id: userId,
          engagement_type: 'like'
        })
      */
    } else {
      // Add like
      /*
      await supabase
        .from('post_engagements')
        .insert({
          post_id: postId,
          user_id: userId,
          engagement_type: 'like'
        })
      */
    }
    
    return true
  } catch (error) {
    console.error('Failed to toggle like:', error)
    return false
  }
}