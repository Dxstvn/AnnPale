import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

// Import route handlers
import * as PostsRoute from '@/app/api/feed/posts/route'
import * as PreferencesRoute from '@/app/api/feed/preferences/route'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

describe('Feed APIs', () => {
  let testUserId: string
  let testCreatorId: string
  let testPostId: string
  let testTierId: string

  beforeAll(async () => {
    // Create test fan user
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .insert({
        id: crypto.randomUUID(),
        email: 'test-feed-user@example.com',
        username: 'testfeeduser',
        display_name: 'Test Feed User',
        role: 'fan'
      })
      .select()
      .single()
    
    if (userError) {
      console.error('Failed to create test user:', userError)
      throw userError
    }
    testUserId = userData!.id

    // Create test creator
    const { data: creatorData, error: creatorError } = await supabase
      .from('profiles')
      .insert({
        id: crypto.randomUUID(),
        email: 'test-feed-creator@example.com',
        username: 'testfeedcreator',
        display_name: 'Test Feed Creator',
        role: 'creator'
      })
      .select()
      .single()
    
    if (creatorError) {
      console.error('Failed to create test creator:', creatorError)
      throw creatorError
    }
    testCreatorId = creatorData!.id

    // Create test subscription tier
    const { data: tierData } = await supabase
      .from('creator_subscription_tiers')
      .insert({
        creator_id: testCreatorId,
        tier_name: 'Premium',
        description: 'Premium content',
        price: 19.99,
        billing_period: 'monthly'
      })
      .select()
      .single()
    testTierId = tierData!.id

    // Create test posts
    await supabase
      .from('posts')
      .insert([
        {
          creator_id: testCreatorId,
          title: 'Public Post',
          description: 'This is a public post',
          content_type: 'text',
          is_public: true,
          is_preview: false,
          status: 'published'
        },
        {
          creator_id: testCreatorId,
          title: 'Preview Post',
          description: 'This is a preview post',
          content_type: 'video',
          video_url: 'https://example.com/video.mp4',
          thumbnail_url: 'https://example.com/thumb.jpg',
          is_public: false,
          is_preview: true,
          preview_order: 1,
          preview_duration: 30,
          status: 'published'
        },
        {
          creator_id: testCreatorId,
          title: 'Subscriber Only Post',
          description: 'This is for subscribers only',
          content_type: 'image',
          image_url: 'https://example.com/image.jpg',
          is_public: false,
          is_preview: false,
          tier_required: testTierId,
          status: 'published'
        }
      ])
  })

  afterAll(async () => {
    // Clean up test data
    await supabase
      .from('posts')
      .delete()
      .eq('creator_id', testCreatorId)
    await supabase
      .from('creator_subscription_tiers')
      .delete()
      .eq('id', testTierId)
    await supabase
      .from('profiles')
      .delete()
      .in('id', [testUserId, testCreatorId])
  })

  describe('GET /api/feed/posts', () => {
    it('should fetch preview posts for unauthenticated users', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/feed/posts?preview=true', {
        method: 'GET'
      })

      // Mock no auth
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: null },
        error: null
      })

      const response = await PostsRoute.GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toBeDefined()
      expect(Array.isArray(data.posts)).toBe(true)
      // Should only get preview posts
      expect(data.posts.every(p => p.is_preview === true)).toBe(true)

      authSpy.mockRestore()
    })

    it('should fetch posts with pagination', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/feed/posts?limit=2&offset=0', {
        method: 'GET'
      })

      // Mock auth
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: { id: testUserId } as any },
        error: null
      })

      const response = await PostsRoute.GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toBeDefined()
      expect(data.posts.length).toBeLessThanOrEqual(2)
      expect(data.total).toBeDefined()
      expect(data.has_more).toBeDefined()

      authSpy.mockRestore()
    })

    it('should filter posts by content type', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/feed/posts?contentType=video', {
        method: 'GET'
      })

      // Mock auth
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: { id: testUserId } as any },
        error: null
      })

      const response = await PostsRoute.GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toBeDefined()
      expect(data.posts.every(p => p.content_type === 'video')).toBe(true)

      authSpy.mockRestore()
    })

    it('should include subscriber-only posts for active subscribers', async () => {
      // Create active subscription
      await supabase
        .from('subscription_orders')
        .insert({
          user_id: testUserId,
          creator_id: testCreatorId,
          tier_id: testTierId,
          status: 'active',
          amount: 19.99,
          currency: 'USD',
          billing_period: 'monthly'
        })

      const mockRequest = new NextRequest(`http://localhost:3000/api/feed/posts?creatorId=${testCreatorId}`, {
        method: 'GET'
      })

      // Mock auth
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: { id: testUserId } as any },
        error: null
      })

      const response = await PostsRoute.GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toBeDefined()
      // Should include all posts from subscribed creator
      expect(data.posts.length).toBeGreaterThan(1)

      // Clean up subscription
      await supabase
        .from('subscription_orders')
        .delete()
        .eq('user_id', testUserId)
        .eq('creator_id', testCreatorId)

      authSpy.mockRestore()
    })
  })

  describe('POST /api/feed/posts', () => {
    it('should create a new post as creator', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/feed/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'New Test Post',
          description: 'Testing post creation',
          content_type: 'text',
          is_public: true,
          is_preview: false
        })
      })

      // Mock auth as creator
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: { id: testCreatorId } as any },
        error: null
      })

      const response = await PostsRoute.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.post).toBeDefined()
      expect(data.post.title).toBe('New Test Post')
      expect(data.post.creator_id).toBe(testCreatorId)

      testPostId = data.post.id

      // Clean up
      await supabase
        .from('posts')
        .delete()
        .eq('id', testPostId)

      authSpy.mockRestore()
    })

    it('should reject post creation from non-creators', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/feed/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Fan Post',
          description: 'Should not work',
          content_type: 'text'
        })
      })

      // Mock auth as fan
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: { id: testUserId } as any },
        error: null
      })

      const response = await PostsRoute.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Only creators can create posts')

      authSpy.mockRestore()
    })

    it('should validate required content URLs', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/feed/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Video Post',
          description: 'Missing video URL',
          content_type: 'video'
          // Missing video_url
        })
      })

      // Mock auth as creator
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: { id: testCreatorId } as any },
        error: null
      })

      const response = await PostsRoute.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Video URL is required')

      authSpy.mockRestore()
    })
  })

  describe('Feed Preferences APIs', () => {
    describe('GET /api/feed/preferences', () => {
      it('should fetch user preferences', async () => {
        const mockRequest = new NextRequest('http://localhost:3000/api/feed/preferences', {
          method: 'GET'
        })

        // Mock auth
        const authSpy = vi.spyOn(supabase.auth, 'getUser')
        authSpy.mockResolvedValueOnce({
          data: { user: { id: testUserId } as any },
          error: null
        })

        const response = await PreferencesRoute.GET(mockRequest)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.preferences).toBeDefined()
        expect(data.preferences.user_id).toBe(testUserId)
        expect(data.preferences.content_types).toBeDefined()
        expect(data.preferences.autoplay_videos).toBeDefined()

        authSpy.mockRestore()
      })

      it('should return defaults for new users', async () => {
        // Create new user without preferences
        const { data: newUser } = await supabase
          .from('profiles')
          .insert({
            email: 'new-user@example.com',
            username: 'newuser',
            display_name: 'New User',
            role: 'fan'
          })
          .select()
          .single()

        const mockRequest = new NextRequest('http://localhost:3000/api/feed/preferences', {
          method: 'GET'
        })

        // Mock auth
        const authSpy = vi.spyOn(supabase.auth, 'getUser')
        authSpy.mockResolvedValueOnce({
          data: { user: { id: newUser!.id } as any },
          error: null
        })

        const response = await PreferencesRoute.GET(mockRequest)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.preferences).toBeDefined()
        expect(data.preferences.content_types).toEqual(['video', 'image', 'text'])
        expect(data.preferences.autoplay_videos).toBe(true)

        // Clean up
        await supabase
          .from('profiles')
          .delete()
          .eq('id', newUser!.id)

        authSpy.mockRestore()
      })
    })

    describe('PUT /api/feed/preferences', () => {
      it('should update user preferences', async () => {
        const mockRequest = new NextRequest('http://localhost:3000/api/feed/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content_types: ['video', 'image'],
            autoplay_videos: false,
            show_comments: false,
            preferred_language: 'fr'
          })
        })

        // Mock auth
        const authSpy = vi.spyOn(supabase.auth, 'getUser')
        authSpy.mockResolvedValueOnce({
          data: { user: { id: testUserId } as any },
          error: null
        })

        const response = await PreferencesRoute.PUT(mockRequest)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.preferences).toBeDefined()
        expect(data.preferences.content_types).toEqual(['video', 'image'])
        expect(data.preferences.autoplay_videos).toBe(false)
        expect(data.preferences.preferred_language).toBe('fr')

        authSpy.mockRestore()
      })
    })

    describe('PATCH /api/feed/preferences', () => {
      it('should mute a creator', async () => {
        const mockRequest = new NextRequest('http://localhost:3000/api/feed/preferences', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'mute',
            creatorId: testCreatorId
          })
        })

        // Mock auth
        const authSpy = vi.spyOn(supabase.auth, 'getUser')
        authSpy.mockResolvedValueOnce({
          data: { user: { id: testUserId } as any },
          error: null
        })

        const response = await PreferencesRoute.PATCH(mockRequest)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.preferences.muted_creators).toContain(testCreatorId)

        authSpy.mockRestore()
      })

      it('should block a creator', async () => {
        const mockRequest = new NextRequest('http://localhost:3000/api/feed/preferences', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'block',
            creatorId: testCreatorId
          })
        })

        // Mock auth
        const authSpy = vi.spyOn(supabase.auth, 'getUser')
        authSpy.mockResolvedValueOnce({
          data: { user: { id: testUserId } as any },
          error: null
        })

        const response = await PreferencesRoute.PATCH(mockRequest)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.preferences.blocked_creators).toContain(testCreatorId)

        // Clean up preferences
        await supabase
          .from('user_feed_preferences')
          .delete()
          .eq('user_id', testUserId)

        authSpy.mockRestore()
      })
    })
  })
})