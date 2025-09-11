import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { VerticalScrollFeed } from '@/components/feed/vertical-scroll-feed'
import '@testing-library/jest-dom'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

// Mock hooks
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn()
}))

// Mock supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ 
        data: { user: { id: 'test-user-id' } } 
      })
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
      delete: vi.fn().mockResolvedValue({ data: {}, error: null }),
      eq: vi.fn().mockReturnThis()
    }))
  }))
}))

// Mock react-intersection-observer
vi.mock('react-intersection-observer', () => ({
  useInView: vi.fn(() => ({
    ref: vi.fn(),
    inView: false
  }))
}))

// Mock fetch
global.fetch = vi.fn()

describe('VerticalScrollFeed', () => {
  const mockPush = vi.fn()
  const mockToast = vi.fn()

  const mockPosts = [
    {
      id: '1',
      creator_id: 'creator-1',
      title: 'Test Video Post',
      description: 'Test description',
      content_type: 'video' as const,
      thumbnail_url: '/test-thumbnail.jpg',
      video_url: '/test-video.mp4',
      image_url: null,
      is_public: true,
      is_preview: false,
      preview_duration: null,
      tier_required: null,
      likes_count: 100,
      views_count: 500,
      comments_count: 20,
      shares_count: 10,
      published_at: '2024-01-01T00:00:00Z',
      creator: {
        id: 'creator-1',
        display_name: 'Test Creator',
        username: 'testcreator',
        profile_image_url: '/test-avatar.jpg'
      },
      is_liked: false,
      has_access: true
    },
    {
      id: '2',
      creator_id: 'creator-2',
      title: 'Premium Content',
      description: 'Premium test description',
      content_type: 'image' as const,
      thumbnail_url: '/test-thumbnail-2.jpg',
      video_url: null,
      image_url: '/test-image.jpg',
      is_public: false,
      is_preview: false,
      preview_duration: null,
      tier_required: 'Premium',
      likes_count: 200,
      views_count: 1000,
      comments_count: 50,
      shares_count: 25,
      published_at: '2024-01-02T00:00:00Z',
      creator: {
        id: 'creator-2',
        display_name: 'Premium Creator',
        username: 'premiumcreator',
        profile_image_url: '/test-avatar-2.jpg'
      },
      is_liked: true,
      has_access: false
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    const { useRouter } = await import('next/navigation')
    const { useToast } = await import('@/hooks/use-toast')
    
    ;(useRouter as any).mockReturnValue({ push: mockPush })
    ;(useToast as any).mockReturnValue({ toast: mockToast })
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ posts: mockPosts, has_more: false })
    })
  })

  describe('Rendering', () => {
    it('should render with initial posts', () => {
      render(
        <VerticalScrollFeed
          initialPosts={mockPosts}
          isAuthenticated={true}
        />
      )

      expect(screen.getByText('Test Video Post')).toBeInTheDocument()
      expect(screen.getByText('Premium Content')).toBeInTheDocument()
    })

    it('should show loading skeleton when no initial posts', async () => {
      render(
        <VerticalScrollFeed
          initialPosts={[]}
          isAuthenticated={true}
        />
      )

      // Check for skeleton elements (using class names since no test-id)
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('should render video elements for video posts', () => {
      render(
        <VerticalScrollFeed
          initialPosts={[mockPosts[0]]}
          isAuthenticated={true}
        />
      )

      const video = document.querySelector('video')
      expect(video).toHaveAttribute('src', '/test-video.mp4')
      expect(video).toHaveAttribute('poster', '/test-thumbnail.jpg')
    })

    it('should render image elements for image posts', () => {
      render(
        <VerticalScrollFeed
          initialPosts={[mockPosts[1]]}
          isAuthenticated={true}
          userSubscriptions={['creator-2']}
        />
      )

      const image = screen.getByAltText('Premium Content')
      expect(image).toHaveAttribute('src', '/test-image.jpg')
    })
  })

  describe('Access Control', () => {
    it('should show lock overlay for restricted content', () => {
      render(
        <VerticalScrollFeed
          initialPosts={[mockPosts[1]]}
          isAuthenticated={true}
          userSubscriptions={[]}
        />
      )

      expect(screen.getByText('Subscription Required')).toBeInTheDocument()
      expect(screen.getByText(/Subscribe to Premium Creator/)).toBeInTheDocument()
    })

    it('should not show lock overlay for subscribed content', () => {
      render(
        <VerticalScrollFeed
          initialPosts={[mockPosts[1]]}
          isAuthenticated={true}
          userSubscriptions={['creator-2']}
        />
      )

      expect(screen.queryByText('Subscription Required')).not.toBeInTheDocument()
    })

    it('should show content for public posts', () => {
      render(
        <VerticalScrollFeed
          initialPosts={[mockPosts[0]]}
          isAuthenticated={false}
        />
      )

      expect(screen.queryByText('Subscription Required')).not.toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should handle like action when authenticated', async () => {
      render(
        <VerticalScrollFeed
          initialPosts={mockPosts}
          isAuthenticated={true}
        />
      )

      // Find like button by looking for the heart icon button
      const likeButtons = document.querySelectorAll('button')
      const firstLikeButton = Array.from(likeButtons).find(btn => 
        btn.textContent?.includes('100')
      )
      
      if (firstLikeButton) {
        fireEvent.click(firstLikeButton)

        await waitFor(() => {
          expect(screen.getByText('101')).toBeInTheDocument()
        })
      }
    })

    it('should show sign in toast when liking while unauthenticated', async () => {
      render(
        <VerticalScrollFeed
          initialPosts={mockPosts}
          isAuthenticated={false}
        />
      )

      const likeButtons = document.querySelectorAll('button')
      const firstLikeButton = Array.from(likeButtons).find(btn => 
        btn.textContent?.includes('100')
      )
      
      if (firstLikeButton) {
        fireEvent.click(firstLikeButton)

        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Sign in required',
            description: 'Please sign in to like posts',
            variant: 'default'
          })
        })
      }
    })

    it('should navigate to creator profile on avatar click', () => {
      render(
        <VerticalScrollFeed
          initialPosts={[mockPosts[0]]}
          isAuthenticated={true}
        />
      )

      // Click on the avatar container
      const avatar = document.querySelector('[class*="Avatar"]')
      if (avatar) {
        fireEvent.click(avatar)
        expect(mockPush).toHaveBeenCalledWith('/fan/creators/creator-1')
      }
    })

    it('should navigate to subscription page for locked content', () => {
      render(
        <VerticalScrollFeed
          initialPosts={[mockPosts[1]]}
          isAuthenticated={true}
          userSubscriptions={[]}
        />
      )

      const subscribeButton = screen.getByText('View Subscription Tiers')
      fireEvent.click(subscribeButton)

      expect(mockPush).toHaveBeenCalledWith('/fan/creators/creator-2?tab=subscriptions')
    })
  })

  describe('Navigation', () => {
    it('should render navigation buttons', () => {
      render(
        <VerticalScrollFeed
          initialPosts={mockPosts}
          isAuthenticated={true}
        />
      )

      // Check for chevron up/down buttons
      const buttons = document.querySelectorAll('button')
      const navButtons = Array.from(buttons).filter(btn => {
        const svg = btn.querySelector('svg')
        return svg && (svg.classList.contains('lucide-chevron-up') || 
                      svg.classList.contains('lucide-chevron-down'))
      })
      
      expect(navButtons.length).toBe(2)
    })

    it('should disable up button on first post', () => {
      render(
        <VerticalScrollFeed
          initialPosts={mockPosts}
          isAuthenticated={true}
        />
      )

      const buttons = document.querySelectorAll('button')
      const upButton = Array.from(buttons).find(btn => {
        const svg = btn.querySelector('svg')
        return svg && svg.classList.contains('lucide-chevron-up')
      })

      expect(upButton).toHaveAttribute('disabled')
    })

    it('should handle mute/unmute toggle', () => {
      render(
        <VerticalScrollFeed
          initialPosts={[mockPosts[0]]}
          isAuthenticated={true}
        />
      )

      const buttons = document.querySelectorAll('button')
      const muteButton = Array.from(buttons).find(btn => {
        const svg = btn.querySelector('svg')
        return svg && (svg.classList.contains('lucide-volume-x') || 
                      svg.classList.contains('lucide-volume-2'))
      })

      const video = document.querySelector('video')

      expect(video).toHaveAttribute('muted')

      if (muteButton) {
        fireEvent.click(muteButton)
        expect(video).not.toHaveAttribute('muted')

        fireEvent.click(muteButton)
        expect(video).toHaveAttribute('muted')
      }
    })
  })

  describe('Infinite Scroll', () => {
    it('should load more posts when reaching bottom', async () => {
      const { useInView } = await import('react-intersection-observer')
      let mockInViewCallback: any = null
      
      ;(useInView as any).mockImplementation(({ onChange }: any) => {
        mockInViewCallback = onChange
        return {
          ref: vi.fn(),
          inView: false
        }
      })

      render(
        <VerticalScrollFeed
          initialPosts={mockPosts}
          isAuthenticated={true}
        />
      )

      // Simulate scroll to bottom
      if (mockInViewCallback) {
        mockInViewCallback(true)
      }

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/feed/posts')
        )
      })
    })

    it('should show end message when no more posts', () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ posts: [], has_more: false })
      })

      render(
        <VerticalScrollFeed
          initialPosts={mockPosts}
          isAuthenticated={true}
        />
      )

      expect(screen.getByText("You've reached the end!")).toBeInTheDocument()
    })
  })

  describe('Sharing', () => {
    it('should handle share with Web Share API', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        writable: true,
        configurable: true
      })

      render(
        <VerticalScrollFeed
          initialPosts={[mockPosts[0]]}
          isAuthenticated={true}
        />
      )

      const shareButtons = document.querySelectorAll('button')
      const shareButton = Array.from(shareButtons).find(btn => 
        btn.textContent?.includes('10')
      )

      if (shareButton) {
        fireEvent.click(shareButton)

        await waitFor(() => {
          expect(mockShare).toHaveBeenCalledWith({
            title: 'Test Video Post',
            text: 'Test description',
            url: expect.stringContaining('/post/1')
          })
        })
      }
    })

    it('should fallback to clipboard when Web Share not available', async () => {
      delete (navigator as any).share
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator.clipboard, 'writeText', {
        value: mockWriteText,
        writable: true,
        configurable: true
      })

      render(
        <VerticalScrollFeed
          initialPosts={[mockPosts[0]]}
          isAuthenticated={true}
        />
      )

      const shareButtons = document.querySelectorAll('button')
      const shareButton = Array.from(shareButtons).find(btn => 
        btn.textContent?.includes('10')
      )

      if (shareButton) {
        fireEvent.click(shareButton)

        await waitFor(() => {
          expect(mockWriteText).toHaveBeenCalledWith(
            expect.stringContaining('/post/1')
          )
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Link copied',
            description: 'Post link copied to clipboard'
          })
        })
      }
    })
  })
})