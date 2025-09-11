import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SubscriptionManagement } from '@/components/subscription/subscription-management'
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
  createClient: vi.fn(() => ({}))
}))

// Mock fetch
global.fetch = vi.fn()

describe('SubscriptionManagement', () => {
  const mockPush = vi.fn()
  const mockToast = vi.fn()

  const mockSubscriptions = [
    {
      id: 'sub-1',
      creator_id: 'creator-1',
      tier_id: 'tier-1',
      status: 'active' as const,
      billing_period: 'monthly' as const,
      current_period_start: '2024-01-01T00:00:00Z',
      current_period_end: '2024-02-01T00:00:00Z',
      next_billing_date: '2024-02-01T00:00:00Z',
      cancelled_at: null,
      total_amount: 9.99,
      creator: {
        id: 'creator-1',
        display_name: 'Test Creator',
        username: 'testcreator',
        profile_image_url: '/test-avatar.jpg'
      },
      tier: {
        id: 'tier-1',
        tier_name: 'Basic Tier',
        description: 'Basic subscription tier',
        price: 9.99,
        benefits: ['Benefit 1', 'Benefit 2']
      }
    },
    {
      id: 'sub-2',
      creator_id: 'creator-2',
      tier_id: 'tier-2',
      status: 'paused' as const,
      billing_period: 'yearly' as const,
      current_period_start: '2024-01-01T00:00:00Z',
      current_period_end: '2025-01-01T00:00:00Z',
      next_billing_date: '2025-01-01T00:00:00Z',
      cancelled_at: null,
      total_amount: 99.99,
      creator: {
        id: 'creator-2',
        display_name: 'Premium Creator',
        username: 'premiumcreator',
        profile_image_url: '/test-avatar-2.jpg'
      },
      tier: {
        id: 'tier-2',
        tier_name: 'Premium Tier',
        description: 'Premium subscription tier',
        price: 99.99,
        benefits: ['Premium Benefit 1', 'Premium Benefit 2']
      }
    }
  ]

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useRouter } = await import('next/navigation')
    const { useToast } = await import('@/hooks/use-toast')
    
    ;(useRouter as any).mockReturnValue({ push: mockPush })
    ;(useToast as any).mockReturnValue({ toast: mockToast })
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ subscriptions: mockSubscriptions })
    })
  })

  describe('Rendering', () => {
    it('should render subscriptions list', async () => {
      render(<SubscriptionManagement />)

      await waitFor(() => {
        expect(screen.getByText('Test Creator')).toBeInTheDocument()
        expect(screen.getByText('Premium Creator')).toBeInTheDocument()
      })
    })

    it('should show loading state initially', () => {
      render(<SubscriptionManagement />)
      
      const loader = document.querySelector('.animate-spin')
      expect(loader).toBeInTheDocument()
    })

    it('should show empty state when no subscriptions', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ subscriptions: [] })
      })

      render(<SubscriptionManagement />)

      await waitFor(() => {
        expect(screen.getByText("You don't have any active subscriptions yet")).toBeInTheDocument()
        expect(screen.getByText('Browse Creators')).toBeInTheDocument()
      })
    })

    it('should display subscription details correctly', async () => {
      render(<SubscriptionManagement />)

      await waitFor(() => {
        // Check tier names and pricing
        expect(screen.getByText(/Basic Tier/)).toBeInTheDocument()
        expect(screen.getByText(/\$9.99\/month/)).toBeInTheDocument()
        expect(screen.getByText(/Premium Tier/)).toBeInTheDocument()
        expect(screen.getByText(/\$99.99\/year/)).toBeInTheDocument()
      })
    })

    it('should show correct status badges', async () => {
      render(<SubscriptionManagement />)

      await waitFor(() => {
        const badges = screen.getAllByRole('status')
        const activeBadge = badges.find(b => b.textContent === 'Active')
        const pausedBadge = badges.find(b => b.textContent === 'Paused')
        
        expect(activeBadge).toBeInTheDocument()
        expect(pausedBadge).toBeInTheDocument()
      })
    })

    it('should display next billing date for active subscriptions', async () => {
      render(<SubscriptionManagement />)

      await waitFor(() => {
        expect(screen.getByText(/Next billing:/)).toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('should navigate to browse page from empty state', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ subscriptions: [] })
      })

      render(<SubscriptionManagement />)

      await waitFor(() => {
        const browseButton = screen.getByText('Browse Creators')
        fireEvent.click(browseButton)
        expect(mockPush).toHaveBeenCalledWith('/browse')
      })
    })

    it('should navigate to creator page on View Creator click', async () => {
      render(<SubscriptionManagement />)

      await waitFor(() => {
        const viewButtons = screen.getAllByText('View Creator')
        fireEvent.click(viewButtons[0])
        expect(mockPush).toHaveBeenCalledWith('/fan/creators/creator-1')
      })
    })
  })

  describe('Subscription Actions', () => {
    it('should open pause dialog for active subscription', async () => {
      render(<SubscriptionManagement />)

      await waitFor(() => {
        // Open dropdown menu for first subscription
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      // Click pause option
      const pauseOption = screen.getByText('Pause Subscription')
      fireEvent.click(pauseOption)

      // Check dialog is open
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to pause/)).toBeInTheDocument()
    })

    it('should open resume dialog for paused subscription', async () => {
      render(<SubscriptionManagement />)

      await waitFor(() => {
        // Open dropdown menu for second subscription (paused)
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[1])
      })

      // Click resume option
      const resumeOption = screen.getByText('Resume Subscription')
      fireEvent.click(resumeOption)

      // Check dialog is open
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/Resume your subscription/)).toBeInTheDocument()
    })

    it('should open cancel dialog with warning', async () => {
      render(<SubscriptionManagement />)

      await waitFor(() => {
        // Open dropdown menu
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      // Click cancel option
      const cancelOption = screen.getByText('Cancel Subscription')
      fireEvent.click(cancelOption)

      // Check dialog and warning
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to cancel/)).toBeInTheDocument()
      expect(screen.getByText(/you may lose any special pricing/)).toBeInTheDocument()
    })

    it('should handle pause action successfully', async () => {
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ subscriptions: mockSubscriptions })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ subscriptions: mockSubscriptions })
        })

      render(<SubscriptionManagement />)

      await waitFor(() => {
        // Open dropdown and click pause
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      const pauseOption = screen.getByText('Pause Subscription')
      fireEvent.click(pauseOption)

      // Confirm in dialog
      const confirmButton = screen.getByRole('button', { name: /^Pause Subscription$/ })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Success',
          description: 'Subscription paused successfully'
        })
      })
    })

    it('should handle action failure', async () => {
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ subscriptions: mockSubscriptions })
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Failed to update' })
        })

      render(<SubscriptionManagement />)

      await waitFor(() => {
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      const pauseOption = screen.getByText('Pause Subscription')
      fireEvent.click(pauseOption)

      const confirmButton = screen.getByRole('button', { name: /^Pause Subscription$/ })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to update subscription',
          variant: 'destructive'
        })
      })
    })

    it('should disable dialog actions while processing', async () => {
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ subscriptions: mockSubscriptions })
        })
        .mockImplementationOnce(() => new Promise(() => {})) // Never resolves

      render(<SubscriptionManagement />)

      await waitFor(() => {
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      const pauseOption = screen.getByText('Pause Subscription')
      fireEvent.click(pauseOption)

      const confirmButton = screen.getByRole('button', { name: /^Pause Subscription$/ })
      fireEvent.click(confirmButton)

      // Check buttons are disabled
      await waitFor(() => {
        expect(screen.getByText('Processing...')).toBeInTheDocument()
        const dialogButtons = screen.getAllByRole('button').filter(btn => 
          btn.textContent === 'Cancel' || btn.textContent?.includes('Processing')
        )
        dialogButtons.forEach(btn => {
          expect(btn).toBeDisabled()
        })
      })
    })
  })

  describe('Error Handling', () => {
    it('should show error toast on fetch failure', async () => {
      ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

      render(<SubscriptionManagement />)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to load subscriptions',
          variant: 'destructive'
        })
      })
    })

    it('should handle API error responses', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' })
      })

      render(<SubscriptionManagement />)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to load subscriptions',
          variant: 'destructive'
        })
      })
    })
  })

  describe('Dialog Interactions', () => {
    it('should close dialog on cancel', async () => {
      render(<SubscriptionManagement />)

      await waitFor(() => {
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      const pauseOption = screen.getByText('Pause Subscription')
      fireEvent.click(pauseOption)

      // Dialog should be open
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      fireEvent.click(cancelButton)

      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('should show correct dialog content for each action type', async () => {
      render(<SubscriptionManagement />)

      // Test cancel dialog
      await waitFor(() => {
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      const cancelOption = screen.getByText('Cancel Subscription')
      fireEvent.click(cancelOption)

      expect(screen.getByText('Cancel Subscription')).toBeInTheDocument()
      expect(screen.getByText(/You'll have access until/)).toBeInTheDocument()

      // Close dialog
      const closeButton = screen.getByRole('button', { name: 'Cancel' })
      fireEvent.click(closeButton)

      // Test pause dialog
      await waitFor(() => {
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      const pauseOption = screen.getByText('Pause Subscription')
      fireEvent.click(pauseOption)

      expect(screen.getByText(/You can resume it anytime/)).toBeInTheDocument()
    })
  })
})