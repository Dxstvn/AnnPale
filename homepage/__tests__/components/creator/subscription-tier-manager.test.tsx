import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SubscriptionTierManager } from '@/components/creator/subscription-tier-manager'
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

// Mock fetch
global.fetch = vi.fn()

describe('SubscriptionTierManager', () => {
  const mockToast = vi.fn()

  const mockTiers = [
    {
      id: 'tier-1',
      creator_id: 'test-creator-id',
      tier_name: 'Basic',
      description: 'Basic tier description',
      price: 9.99,
      billing_period: 'monthly' as const,
      benefits: ['Benefit 1', 'Benefit 2'],
      is_active: true,
      subscriber_count: 10,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'tier-2',
      creator_id: 'test-creator-id',
      tier_name: 'Premium',
      description: 'Premium tier description',
      price: 19.99,
      billing_period: 'monthly' as const,
      benefits: ['Premium Benefit 1', 'Premium Benefit 2', 'Premium Benefit 3'],
      is_active: true,
      subscriber_count: 5,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    const { useToast } = require('@/hooks/use-toast')
    useToast.mockReturnValue({ toast: mockToast })
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ tiers: mockTiers })
    })
  })

  describe('Rendering', () => {
    it('should render tier list', async () => {
      render(<SubscriptionTierManager />)

      await waitFor(() => {
        expect(screen.getByText('Basic')).toBeInTheDocument()
        expect(screen.getByText('Premium')).toBeInTheDocument()
      })
    })

    it('should display tier prices correctly', async () => {
      render(<SubscriptionTierManager />)

      await waitFor(() => {
        expect(screen.getByText(/\$9.99/)).toBeInTheDocument()
        expect(screen.getByText(/\$19.99/)).toBeInTheDocument()
      })
    })

    it('should show subscriber counts', async () => {
      render(<SubscriptionTierManager />)

      await waitFor(() => {
        expect(screen.getByText(/10 subscribers/)).toBeInTheDocument()
        expect(screen.getByText(/5 subscribers/)).toBeInTheDocument()
      })
    })

    it('should display benefits for each tier', async () => {
      render(<SubscriptionTierManager />)

      await waitFor(() => {
        expect(screen.getByText('Benefit 1')).toBeInTheDocument()
        expect(screen.getByText('Benefit 2')).toBeInTheDocument()
        expect(screen.getByText('Premium Benefit 1')).toBeInTheDocument()
      })
    })

    it('should show empty state when no tiers', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ tiers: [] })
      })

      render(<SubscriptionTierManager />)

      await waitFor(() => {
        expect(screen.getByText('No subscription tiers created yet')).toBeInTheDocument()
      })
    })

    it('should show loading state initially', () => {
      render(<SubscriptionTierManager />)
      
      const loader = document.querySelector('.animate-spin')
      expect(loader).toBeInTheDocument()
    })
  })

  describe('Creating Tiers', () => {
    it('should open create dialog when Add Tier clicked', async () => {
      render(<SubscriptionTierManager />)

      await waitFor(() => {
        const addButton = screen.getByText('Add Tier')
        fireEvent.click(addButton)
      })

      expect(screen.getByText('Create Subscription Tier')).toBeInTheDocument()
      expect(screen.getByLabelText('Tier Name')).toBeInTheDocument()
    })

    it('should validate required fields', async () => {
      render(<SubscriptionTierManager />)

      await waitFor(() => {
        const addButton = screen.getByText('Add Tier')
        fireEvent.click(addButton)
      })

      const createButton = screen.getByRole('button', { name: /Create Tier/i })
      fireEvent.click(createButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        })
      })
    })

    it('should create tier with valid data', async () => {
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tiers: mockTiers })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tier: { id: 'new-tier' } })
        })

      render(<SubscriptionTierManager />)

      await waitFor(() => {
        const addButton = screen.getByText('Add Tier')
        fireEvent.click(addButton)
      })

      // Fill form
      fireEvent.change(screen.getByLabelText('Tier Name'), {
        target: { value: 'New Tier' }
      })
      fireEvent.change(screen.getByLabelText('Price'), {
        target: { value: '29.99' }
      })
      fireEvent.change(screen.getByLabelText('Description'), {
        target: { value: 'New tier description' }
      })

      const createButton = screen.getByRole('button', { name: /Create Tier/i })
      fireEvent.click(createButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/creator/subscription-tiers',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('New Tier')
          })
        )
      })
    })

    it('should handle benefits management', async () => {
      render(<SubscriptionTierManager />)

      await waitFor(() => {
        const addButton = screen.getByText('Add Tier')
        fireEvent.click(addButton)
      })

      // Add benefit
      const addBenefitButton = screen.getByText('Add Benefit')
      fireEvent.click(addBenefitButton)

      const benefitInputs = screen.getAllByPlaceholderText('Enter a benefit')
      expect(benefitInputs).toHaveLength(2)

      // Remove benefit
      const removeButtons = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg')
        return svg && svg.classList.contains('lucide-x')
      })
      
      if (removeButtons.length > 0) {
        fireEvent.click(removeButtons[0])
        const updatedInputs = screen.getAllByPlaceholderText('Enter a benefit')
        expect(updatedInputs).toHaveLength(1)
      }
    })
  })

  describe('Editing Tiers', () => {
    it('should open edit dialog with tier data', async () => {
      render(<SubscriptionTierManager />)

      await waitFor(() => {
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      const editOption = screen.getByText('Edit')
      fireEvent.click(editOption)

      expect(screen.getByText('Edit Subscription Tier')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Basic')).toBeInTheDocument()
      expect(screen.getByDisplayValue('9.99')).toBeInTheDocument()
    })

    it('should update tier successfully', async () => {
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tiers: mockTiers })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tier: mockTiers[0] })
        })

      render(<SubscriptionTierManager />)

      await waitFor(() => {
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      const editOption = screen.getByText('Edit')
      fireEvent.click(editOption)

      // Update name
      const nameInput = screen.getByDisplayValue('Basic')
      fireEvent.change(nameInput, { target: { value: 'Updated Basic' } })

      const updateButton = screen.getByRole('button', { name: /Update Tier/i })
      fireEvent.click(updateButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/creator/subscription-tiers/tier-1',
          expect.objectContaining({
            method: 'PATCH',
            body: expect.stringContaining('Updated Basic')
          })
        )
      })
    })
  })

  describe('Deleting Tiers', () => {
    it('should open delete confirmation dialog', async () => {
      render(<SubscriptionTierManager />)

      await waitFor(() => {
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      const deleteOption = screen.getByText('Delete')
      fireEvent.click(deleteOption)

      expect(screen.getByText('Delete Subscription Tier')).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to delete "Basic"/)).toBeInTheDocument()
    })

    it('should show warning about deletion', async () => {
      render(<SubscriptionTierManager />)

      await waitFor(() => {
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      const deleteOption = screen.getByText('Delete')
      fireEvent.click(deleteOption)

      expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
      expect(screen.getByText(/Existing subscribers will lose access/)).toBeInTheDocument()
    })

    it('should delete tier when confirmed', async () => {
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tiers: mockTiers })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        })

      render(<SubscriptionTierManager />)

      await waitFor(() => {
        const dropdownButtons = document.querySelectorAll('button[aria-haspopup="menu"]')
        fireEvent.click(dropdownButtons[0])
      })

      const deleteOption = screen.getByText('Delete')
      fireEvent.click(deleteOption)

      const confirmButton = screen.getByRole('button', { name: /Delete Tier/i })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/creator/subscription-tiers/tier-1',
          expect.objectContaining({
            method: 'DELETE'
          })
        )
      })
    })
  })

  describe('Billing Period', () => {
    it('should support monthly and yearly billing', async () => {
      render(<SubscriptionTierManager />)

      await waitFor(() => {
        const addButton = screen.getByText('Add Tier')
        fireEvent.click(addButton)
      })

      const monthlyRadio = screen.getByLabelText('Monthly')
      const yearlyRadio = screen.getByLabelText('Yearly')

      expect(monthlyRadio).toBeChecked()
      expect(yearlyRadio).not.toBeChecked()

      fireEvent.click(yearlyRadio)
      expect(yearlyRadio).toBeChecked()
      expect(monthlyRadio).not.toBeChecked()
    })
  })

  describe('Error Handling', () => {
    it('should show error toast on fetch failure', async () => {
      ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

      render(<SubscriptionTierManager />)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to load subscription tiers',
          variant: 'destructive'
        })
      })
    })

    it('should handle API error responses', async () => {
      ;(global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tiers: mockTiers })
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Server error' })
        })

      render(<SubscriptionTierManager />)

      await waitFor(() => {
        const addButton = screen.getByText('Add Tier')
        fireEvent.click(addButton)
      })

      fireEvent.change(screen.getByLabelText('Tier Name'), {
        target: { value: 'Test' }
      })
      fireEvent.change(screen.getByLabelText('Price'), {
        target: { value: '10' }
      })

      const createButton = screen.getByRole('button', { name: /Create Tier/i })
      fireEvent.click(createButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to save tier',
          variant: 'destructive'
        })
      })
    })
  })
})