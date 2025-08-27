import { test, expect } from '@playwright/test'

test.describe('Live Streaming End-to-End Tests', () => {
  test.describe('Fan Experience', () => {
    test('should browse available livestreams', async ({ page }) => {
      await page.goto('/fan/livestreams')
      
      // Check page loads
      await expect(page.getByRole('heading', { name: /Live Streams/i })).toBeVisible()
      
      // Check filter tabs exist
      await expect(page.getByRole('button', { name: /All Streams/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /Following/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /Popular/i })).toBeVisible()
      
      // Check category filters exist
      await expect(page.getByRole('button', { name: /Music/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /Comedy/i })).toBeVisible()
    })

    test('should show subscription prompt for non-subscribers', async ({ page }) => {
      await page.goto('/fan/livestreams/test-stream-1')
      
      // Should show pre-roll ad for non-subscribers
      await expect(page.getByText(/Advertisement/i)).toBeVisible()
      
      // Should show subscription benefits
      await expect(page.getByText(/Subscribe for ad-free viewing/i)).toBeVisible()
    })

    test('should access subscription management', async ({ page }) => {
      await page.goto('/fan/subscriptions')
      
      // Check subscription tiers
      await expect(page.getByText(/Basic/i)).toBeVisible()
      await expect(page.getByText(/\$4.99/i)).toBeVisible()
      
      await expect(page.getByText(/Premium/i)).toBeVisible()
      await expect(page.getByText(/\$9.99/i)).toBeVisible()
      
      await expect(page.getByText(/VIP/i)).toBeVisible()
      await expect(page.getByText(/\$19.99/i)).toBeVisible()
    })
  })

  test.describe('Creator Experience', () => {
    test('should access streaming dashboard', async ({ page }) => {
      await page.goto('/creator/streaming')
      
      // Check dashboard elements
      await expect(page.getByRole('heading', { name: /Streaming Dashboard/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /Create AWS Channel/i })).toBeVisible()
      
      // Check monetization section
      await expect(page.getByRole('heading', { name: /Monetization/i })).toBeVisible()
    })

    test('should display OBS configuration', async ({ page }) => {
      await page.goto('/creator/streaming')
      
      // Check OBS settings section
      await expect(page.getByText(/OBS Studio Settings/i)).toBeVisible()
      await expect(page.getByText(/Server URL/i)).toBeVisible()
      await expect(page.getByText(/Stream Key/i)).toBeVisible()
    })

    test('should access monetization settings', async ({ page }) => {
      await page.goto('/creator/monetization')
      
      // Check subscription tiers configuration
      await expect(page.getByRole('heading', { name: /Subscription Tiers/i })).toBeVisible()
      
      // Check payout settings
      await expect(page.getByRole('heading', { name: /Payout Settings/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /Connect Stripe/i })).toBeVisible()
    })
  })

  test.describe('Admin Experience', () => {
    test('should access admin dashboard', async ({ page }) => {
      await page.goto('/admin/streaming')
      
      // Check dashboard sections
      await expect(page.getByRole('heading', { name: /Livestream Monitoring/i })).toBeVisible()
      await expect(page.getByText(/Active Streams/i)).toBeVisible()
      await expect(page.getByText(/AWS Infrastructure/i)).toBeVisible()
    })

    test('should display infrastructure metrics', async ({ page }) => {
      await page.goto('/admin/streaming')
      
      // Check metrics cards
      await expect(page.getByText(/Active Channels/i)).toBeVisible()
      await expect(page.getByText(/Total Bandwidth/i)).toBeVisible()
      await expect(page.getByText(/Storage Used/i)).toBeVisible()
      await expect(page.getByText(/Monthly Cost/i)).toBeVisible()
    })
  })

  test.describe('Stream Playback', () => {
    test('should load HLS player on test page', async ({ page }) => {
      await page.goto('/test-stream')
      
      // Check player loads
      await expect(page.getByRole('heading', { name: /AWS IVS Stream Test Page/i })).toBeVisible()
      await expect(page.locator('video')).toBeVisible()
      
      // Check controls are present
      await expect(page.getByRole('button', { name: /Refresh/i })).toBeVisible()
    })

    test('should show stream URL configuration', async ({ page }) => {
      await page.goto('/test-stream')
      
      // Check stream URL input exists
      await expect(page.getByText(/Current Stream URL/i)).toBeVisible()
      await expect(page.getByPlaceholder(/Paste another HLS stream URL/i)).toBeVisible()
    })

    test('should display OBS instructions', async ({ page }) => {
      await page.goto('/test-stream')
      
      // Check OBS setup instructions
      await expect(page.getByText(/OBS Studio Setup Instructions/i)).toBeVisible()
      await expect(page.getByText(/rtmps:\/\/eb5fc6c5eb1d/i)).toBeVisible()
    })
  })
})