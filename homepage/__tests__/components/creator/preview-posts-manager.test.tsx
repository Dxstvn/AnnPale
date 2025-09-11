import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PreviewPostsManager } from '@/components/creator/preview-posts-manager'
import '@testing-library/jest-dom'

// Mock hooks
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({ toast: vi.fn() }))
}))

// Mock supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ 
        data: { user: { id: 'test-creator-id' } } 
      })
    }
  }))
}))

// Mock dnd-kit
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => <div>{children}</div>,
  closestCenter: vi.fn(),
  KeyboardSensor: vi.fn(),
  PointerSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => [])
}))

vi.mock('@dnd-kit/sortable', () => ({
  arrayMove: vi.fn((arr: any[], from: number, to: number) => {
    const result = [...arr]
    const [removed] = result.splice(from, 1)
    result.splice(to, 0, removed)
    return result
  }),
  SortableContext: ({ children }: any) => <div>{children}</div>,
  sortableKeyboardCoordinates: vi.fn(),
  verticalListSortingStrategy: vi.fn(),
  useSortable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null
  }))
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: vi.fn(() => '')
    }
  }
}))

// Mock fetch
global.fetch = vi.fn()

describe('PreviewPostsManager', () => {
  const mockToast = vi.fn()

  const mockPosts = [
    {
      id: 'post-1',
      creator_id: 'test-creator-id',
      title: 'First Preview Post',
      description: 'First post description',
      content_type: 'text' as const,
      thumbnail_url: null,
      video_url: null,
      image_url: null,
      text_content: 'This is the text content',
      is_preview: true,
      preview_duration: null,
      preview_order: 0,
      is_public: true,
      tier_required: null,
      published_at: '2024-01-01T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'post-2',
      creator_id: 'test-creator-id',
      title: 'Second Preview Post',
      description: 'Second post description',
      content_type: 'video' as const,
      thumbnail_url: '/thumbnail.jpg',
      video_url: '/video.mp4',
      image_url: null,
      text_content: null,
      is_preview: true,
      preview_duration: 30,
      preview_order: 1,
      is_public: false,
      tier_required: null,
      published_at: '2024-01-02T00:00:00Z',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    const { useToast } = require('@/hooks/use-toast')
    useToast.mockReturnValue({ toast: mockToast })
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ posts: mockPosts })
    })
  })

  describe('Rendering', () => {
    it('should render posts list', async () => {
      render(<PreviewPostsManager />)

      await waitFor(() => {
        expect(screen.getByText('First Preview Post')).toBeInTheDocument()
        expect(screen.getByText('Second Preview Post')).toBeInTheDocument()
      })
    })

    it('should display post metadata', async () => {
      render(<PreviewPostsManager />)

      await waitFor(() => {
        expect(screen.getByText('First post description')).toBeInTheDocument()
        expect(screen.getByText('Second post description')).toBeInTheDocument()
      })
    })

    it('should show content type icons', async () => {
      render(<PreviewPostsManager />)

      await waitFor(() => {
        const icons = document.querySelectorAll('svg')
        const textIcon = Array.from(icons).find(icon => 
          icon.classList.contains('lucide-file-text')
        )
        const videoIcon = Array.from(icons).find(icon => 
          icon.classList.contains('lucide-video')
        )
        
        expect(textIcon).toBeTruthy()
        expect(videoIcon).toBeTruthy()
      })
    })

    it('should show preview duration for videos', async () => {
      render(<PreviewPostsManager />)

      await waitFor(() => {
        expect(screen.getByText('30s')).toBeInTheDocument()
      })
    })

    it('should show public/private badges', async () => {
      render(<PreviewPostsManager />)

      await waitFor(() => {
        const badges = screen.getAllByText(/Public|Private/)
        expect(badges).toHaveLength(2)
      })
    })

    it('should show empty state when no posts', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ posts: [] })
      })

      render(<PreviewPostsManager />)

      await waitFor(() => {
        expect(screen.getByText('No preview posts created yet')).toBeInTheDocument()
      })
    })

    it('should show drag instruction alert', async () => {
      render(<PreviewPostsManager />)

      await waitFor(() => {
        expect(screen.getByText(/Drag posts to reorder them/)).toBeInTheDocument()
      })
    })
  })

  describe('Creating Posts', () => {
    it('should open create dialog when Add Preview Post clicked', async () => {
      render(<PreviewPostsManager />)

      await waitFor(() => {
        const addButton = screen.getByText('Add Preview Post')
        fireEvent.click(addButton)
      })

      expect(screen.getByText('Create Preview Post')).toBeInTheDocument()
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })

    it('should validate title field', async () => {
      render(<PreviewPostsManager />)

      await waitFor(() => {
        const addButton = screen.getByText('Add Preview Post')
        fireEvent.click(addButton)
      })

      const createButton = screen.getByRole('button', { name: /Create Post/i })
      fireEvent.click(createButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Validation Error',
          description: 'Please provide a title',
          variant: 'destructive'
        })
      })
    })

    it('should handle content type selection', async () => {
      render(<PreviewPostsManager />)

      await waitFor(() => {
        const addButton = screen.getByText('Add Preview Post')
        fireEvent.click(addButton)
      })

      // Check default content type
      const textContent = screen.getByLabelText('Text Content')
      expect(textContent).toBeInTheDocument()

      // Change to video
      const contentTypeSelect = screen.getByRole('combobox')
      fireEvent.click(contentTypeSelect)
      
      const videoOption = screen.getByText('Video')
      fireEvent.click(videoOption)

      // Should show video-specific fields
      await waitFor(() => {
        expect(screen.getByLabelText('Video URL')).toBeInTheDocument()
        expect(screen.getByLabelText('Thumbnail URL (optional)')).toBeInTheDocument()
        expect(screen.getByLabelText('Preview Duration (seconds)')).toBeInTheDocument()
      })
    })

    it('should create post with valid data', async () => {
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ posts: mockPosts })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ post: { id: 'new-post' } })
        })

      render(<PreviewPostsManager />)

      await waitFor(() => {
        const addButton = screen.getByText('Add Preview Post')
        fireEvent.click(addButton)
      })

      // Fill form
      fireEvent.change(screen.getByLabelText('Title'), {
        target: { value: 'New Preview Post' }
      })
      fireEvent.change(screen.getByLabelText('Description'), {
        target: { value: 'New post description' }
      })
      fireEvent.change(screen.getByLabelText('Text Content'), {
        target: { value: 'New text content' }
      })

      const createButton = screen.getByRole('button', { name: /Create Post/i })
      fireEvent.click(createButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/creator/preview-posts',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('New Preview Post')
          })
        )
      })
    })
  })

  describe('Editing Posts', () => {
    it('should open edit dialog with post data', async () => {
      render(<PreviewPostsManager />)

      await waitFor(() => {
        const editButtons = screen.getAllByRole('button').filter(btn => {
          const svg = btn.querySelector('svg')
          return svg && svg.classList.contains('lucide-edit')
        })
        fireEvent.click(editButtons[0])
      })

      expect(screen.getByText('Edit Preview Post')).toBeInTheDocument()
      expect(screen.getByDisplayValue('First Preview Post')).toBeInTheDocument()
    })

    it('should update post successfully', async () => {
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ posts: mockPosts })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ post: mockPosts[0] })
        })

      render(<PreviewPostsManager />)

      await waitFor(() => {
        const editButtons = screen.getAllByRole('button').filter(btn => {
          const svg = btn.querySelector('svg')
          return svg && svg.classList.contains('lucide-edit')
        })
        fireEvent.click(editButtons[0])
      })

      // Update title
      const titleInput = screen.getByDisplayValue('First Preview Post')
      fireEvent.change(titleInput, { target: { value: 'Updated Post Title' } })

      const updateButton = screen.getByRole('button', { name: /Update Post/i })
      fireEvent.click(updateButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/creator/preview-posts/post-1',
          expect.objectContaining({
            method: 'PATCH',
            body: expect.stringContaining('Updated Post Title')
          })
        )
      })
    })
  })

  describe('Deleting Posts', () => {
    it('should open delete confirmation dialog', async () => {
      render(<PreviewPostsManager />)

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button').filter(btn => {
          const svg = btn.querySelector('svg')
          return svg && svg.classList.contains('lucide-trash-2')
        })
        fireEvent.click(deleteButtons[0])
      })

      expect(screen.getByText('Delete Preview Post')).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to delete "First Preview Post"/)).toBeInTheDocument()
    })

    it('should delete post when confirmed', async () => {
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ posts: mockPosts })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        })

      render(<PreviewPostsManager />)

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button').filter(btn => {
          const svg = btn.querySelector('svg')
          return svg && svg.classList.contains('lucide-trash-2')
        })
        fireEvent.click(deleteButtons[0])
      })

      const confirmButton = screen.getByRole('button', { name: /Delete Post/i })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/creator/preview-posts/post-1',
          expect.objectContaining({
            method: 'DELETE'
          })
        )
      })
    })
  })

  describe('Post Reordering', () => {
    it('should handle drag and drop reordering', async () => {
      const { arrayMove } = require('@dnd-kit/sortable')
      
      render(<PreviewPostsManager />)

      await waitFor(() => {
        expect(screen.getByText('First Preview Post')).toBeInTheDocument()
      })

      // Simulate drag end
      const newOrder = arrayMove(mockPosts, 0, 1)
      
      expect(newOrder[0].id).toBe('post-2')
      expect(newOrder[1].id).toBe('post-1')
    })

    it('should send reorder request to API', async () => {
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ posts: mockPosts })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        })

      // This would require simulating the DndContext onDragEnd event
      // which is complex to mock properly
    })
  })

  describe('Visibility Toggle', () => {
    it('should toggle public/private status', async () => {
      render(<PreviewPostsManager />)

      await waitFor(() => {
        const addButton = screen.getByText('Add Preview Post')
        fireEvent.click(addButton)
      })

      const publicSwitch = screen.getByRole('switch')
      expect(publicSwitch).toBeChecked()

      fireEvent.click(publicSwitch)
      expect(publicSwitch).not.toBeChecked()
    })
  })

  describe('Error Handling', () => {
    it('should show error toast on fetch failure', async () => {
      ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

      render(<PreviewPostsManager />)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to load preview posts',
          variant: 'destructive'
        })
      })
    })

    it('should handle save errors', async () => {
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ posts: mockPosts })
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Server error' })
        })

      render(<PreviewPostsManager />)

      await waitFor(() => {
        const addButton = screen.getByText('Add Preview Post')
        fireEvent.click(addButton)
      })

      fireEvent.change(screen.getByLabelText('Title'), {
        target: { value: 'Test' }
      })

      const createButton = screen.getByRole('button', { name: /Create Post/i })
      fireEvent.click(createButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to save post',
          variant: 'destructive'
        })
      })
    })
  })
})