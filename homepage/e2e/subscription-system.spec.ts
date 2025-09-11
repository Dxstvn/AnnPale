import { test, expect } from '@playwright/test'
import { authenticateUser } from './helpers/auth.helper'

test.describe('Subscription System E2E Tests', () => {
  test.describe('Fan Subscription Flow', () => {
    test('should complete full subscription flow', async ({ page }) => {
      // Authenticate as fan
      await authenticateUser(page, 'fan')
      
      // Navigate to creators page
      await page.goto('/fan/home')
      await page.waitForLoadState('networkidle')
      
      // Find and click on a creator
      const creatorCard = page.locator('[data-testid="creator-card"]').first()
      await expect(creatorCard).toBeVisible()
      await creatorCard.click()
      
      // Should be on creator profile page
      await expect(page).toHaveURL(/\/fan\/creators\//)
      
      // Click on subscriptions tab
      await page.click('[data-testid="subscriptions-tab"]')
      
      // Should see subscription tiers
      const tierCard = page.locator('[data-testid="subscription-tier-card"]').first()
      await expect(tierCard).toBeVisible()
      
      // Click subscribe button
      await tierCard.locator('button:has-text("Subscribe")').click()
      
      // Should redirect to checkout
      await expect(page).toHaveURL(/\/checkout/)
      
      // Fill payment information (using test card)
      const stripeFrame = page.frameLocator('iframe[title="Secure payment input frame"]')
      await stripeFrame.locator('[placeholder="Card number"]').fill('4242424242424242')
      await stripeFrame.locator('[placeholder="MM / YY"]').fill('12/30')
      await stripeFrame.locator('[placeholder="CVC"]').fill('123')
      await stripeFrame.locator('[placeholder="ZIP"]').fill('10001')
      
      // Complete payment
      await page.click('button:has-text("Complete Subscription")')
      
      // Should show success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
      
      // Should redirect to subscriptions page
      await page.waitForURL('/fan/subscriptions')
      
      // Should see active subscription
      const activeSubscription = page.locator('[data-testid="subscription-item"]').first()
      await expect(activeSubscription).toContainText('Active')
    })

    test('should manage subscription (pause, resume, cancel)', async ({ page }) => {
      // Authenticate as fan with existing subscription
      await authenticateUser(page, 'fan')
      
      // Navigate to settings
      await page.goto('/fan/settings')
      await page.click('[data-testid="subscriptions-tab"]')
      
      // Find active subscription
      const subscription = page.locator('[data-testid="subscription-item"]').first()
      await expect(subscription).toBeVisible()
      
      // Open actions menu
      await subscription.locator('button[aria-label="More options"]').click()
      
      // Pause subscription
      await page.click('text=Pause Subscription')
      await page.click('button:has-text("Confirm Pause")')
      
      // Should show paused status
      await expect(subscription).toContainText('Paused')
      
      // Resume subscription
      await subscription.locator('button[aria-label="More options"]').click()
      await page.click('text=Resume Subscription')
      await page.click('button:has-text("Confirm Resume")')
      
      // Should show active status
      await expect(subscription).toContainText('Active')
      
      // Cancel subscription
      await subscription.locator('button[aria-label="More options"]').click()
      await page.click('text=Cancel Subscription')
      
      // Should show warning
      await expect(page.locator('text=You may lose any special pricing')).toBeVisible()
      
      await page.click('button:has-text("Confirm Cancel")')
      
      // Should show cancelled status
      await expect(subscription).toContainText('Cancelled')
    })

    test('should show vertical scroll feed with access control', async ({ page }) => {
      // Authenticate as fan
      await authenticateUser(page, 'fan')
      
      // Navigate to home
      await page.goto('/fan/home')
      
      // Toggle to vertical view
      await page.click('[data-testid="view-mode-vertical"]')
      
      // Should show vertical scroll feed
      const verticalFeed = page.locator('[data-testid="vertical-scroll-feed"]')
      await expect(verticalFeed).toBeVisible()
      
      // Check for locked content
      const lockedPost = page.locator('[data-testid="locked-post"]').first()
      if (await lockedPost.isVisible()) {
        await expect(lockedPost).toContainText('Subscription Required')
        
        // Click to view subscription tiers
        await lockedPost.locator('button:has-text("View Subscription Tiers")').click()
        
        // Should navigate to creator's subscription page
        await expect(page).toHaveURL(/tab=subscriptions/)
      }
      
      // Check for accessible content
      const publicPost = page.locator('[data-testid="public-post"]').first()
      await expect(publicPost).toBeVisible()
      
      // Should be able to interact with public posts
      await publicPost.locator('button[aria-label="Like"]').click()
      await expect(publicPost.locator('[data-testid="like-count"]')).toHaveText(/\d+/)
    })
  })

  test.describe('Creator Subscription Management', () => {
    test('should create and manage subscription tiers', async ({ page }) => {
      // Authenticate as creator
      await authenticateUser(page, 'creator')
      
      // Navigate to settings
      await page.goto('/creator/settings')
      await page.click('[data-testid="subscription-tiers-tab"]')
      
      // Click add tier
      await page.click('button:has-text("Add Tier")')
      
      // Fill tier information
      await page.fill('[placeholder="Tier Name"]', 'Premium Tier')
      await page.fill('[placeholder="9.99"]', '19.99')
      await page.fill('[placeholder="Description"]', 'Get exclusive content and perks')
      
      // Add benefits
      await page.fill('[placeholder="Enter a benefit"]', 'Exclusive videos')
      await page.click('button:has-text("Add Benefit")')
      await page.locator('[placeholder="Enter a benefit"]').last().fill('Early access')
      
      // Select billing period
      await page.click('label:has-text("Monthly")')
      
      // Create tier
      await page.click('button:has-text("Create Tier")')
      
      // Should show success message
      await expect(page.locator('[data-testid="success-toast"]')).toBeVisible()
      
      // Should see new tier in list
      const tierCard = page.locator('[data-testid="tier-card"]:has-text("Premium Tier")')
      await expect(tierCard).toBeVisible()
      await expect(tierCard).toContainText('$19.99/month')
      
      // Edit tier
      await tierCard.locator('button[aria-label="More options"]').click()
      await page.click('text=Edit')
      
      // Update price
      await page.fill('[value="19.99"]', '24.99')
      await page.click('button:has-text("Update Tier")')
      
      // Should reflect changes
      await expect(tierCard).toContainText('$24.99/month')
    })

    test('should manage preview posts', async ({ page }) => {
      // Authenticate as creator
      await authenticateUser(page, 'creator')
      
      // Navigate to settings
      await page.goto('/creator/settings')
      await page.click('[data-testid="preview-posts-tab"]')
      
      // Click add preview post
      await page.click('button:has-text("Add Preview Post")')
      
      // Fill post information
      await page.fill('[placeholder="Enter post title"]', 'Welcome to my content!')
      await page.fill('[placeholder="Optional description"]', 'Check out what I offer')
      
      // Select content type
      await page.click('[data-testid="content-type-select"]')
      await page.click('text=Video')
      
      // Add video details
      await page.fill('[placeholder="Enter video URL"]', 'https://example.com/video.mp4')
      await page.fill('[placeholder="e.g., 30"]', '60')
      
      // Toggle public visibility
      const publicSwitch = page.locator('[data-testid="public-switch"]')
      await publicSwitch.click()
      
      // Create post
      await page.click('button:has-text("Create Post")')
      
      // Should show success
      await expect(page.locator('[data-testid="success-toast"]')).toBeVisible()
      
      // Should see post in list
      const postItem = page.locator('[data-testid="preview-post"]:has-text("Welcome to my content!")')
      await expect(postItem).toBeVisible()
      await expect(postItem).toContainText('60s')
      
      // Test drag and drop reordering (if multiple posts exist)
      const posts = page.locator('[data-testid="preview-post"]')
      if (await posts.count() > 1) {
        const firstPost = posts.first()
        const secondPost = posts.nth(1)
        
        // Drag first post to second position
        await firstPost.dragTo(secondPost)
        
        // Order should be updated
        await expect(posts.first()).not.toContainText('Welcome to my content!')
      }
    })

    test('should view subscription analytics', async ({ page }) => {
      // Authenticate as creator
      await authenticateUser(page, 'creator')
      
      // Navigate to dashboard
      await page.goto('/creator/dashboard')
      
      // Should see subscription stats
      await expect(page.locator('[data-testid="total-subscribers"]')).toBeVisible()
      await expect(page.locator('[data-testid="monthly-revenue"]')).toBeVisible()
      await expect(page.locator('[data-testid="new-subscribers"]')).toBeVisible()
      
      // Check unified orders
      const ordersTab = page.locator('[data-testid="orders-tab"]')
      if (await ordersTab.isVisible()) {
        await ordersTab.click()
        
        // Should see subscription orders
        const subscriptionOrder = page.locator('[data-testid="order-item"][data-type="subscription"]').first()
        if (await subscriptionOrder.isVisible()) {
          await expect(subscriptionOrder).toContainText('Subscription')
          await expect(subscriptionOrder).toContainText(/\$\d+/)
        }
      }
    })
  })

  test.describe('Real-time Updates', () => {
    test('should receive real-time subscription notifications', async ({ page, context }) => {
      // Open two pages - creator and fan
      const creatorPage = page
      const fanPage = await context.newPage()
      
      // Authenticate creator
      await authenticateUser(creatorPage, 'creator')
      await creatorPage.goto('/creator/dashboard')
      
      // Authenticate fan in second page
      await authenticateUser(fanPage, 'fan')
      await fanPage.goto('/fan/creators/test-creator-id')
      
      // Subscribe from fan page
      await fanPage.click('[data-testid="subscription-tier-card"]')
      await fanPage.click('button:has-text("Subscribe")')
      
      // Complete mock payment
      await fanPage.fill('[data-testid="mock-payment"]', '4242424242424242')
      await fanPage.click('button:has-text("Complete")')
      
      // Creator should receive notification
      await creatorPage.waitForSelector('[data-testid="new-subscriber-notification"]', { timeout: 10000 })
      const notification = creatorPage.locator('[data-testid="new-subscriber-notification"]')
      await expect(notification).toContainText('New Subscriber')
      
      // Stats should update
      const subscriberCount = creatorPage.locator('[data-testid="total-subscribers"]')
      const initialCount = await subscriberCount.textContent()
      await expect(subscriberCount).not.toHaveText(initialCount!)
    })
  })

  test.describe('Content Access Control', () => {
    test('should restrict content based on subscription', async ({ page }) => {
      // Test without authentication
      await page.goto('/fan/creators/test-creator-id')
      
      // Should see preview posts
      const previewPost = page.locator('[data-testid="preview-post"]').first()
      await expect(previewPost).toBeVisible()
      
      // Should see locked posts
      const lockedPost = page.locator('[data-testid="locked-post"]').first()
      await expect(lockedPost).toBeVisible()
      await expect(lockedPost).toContainText('Subscribe to access')
      
      // Authenticate as fan without subscription
      await authenticateUser(page, 'fan')
      await page.goto('/fan/creators/test-creator-id')
      
      // Should still see locked content
      await expect(lockedPost).toBeVisible()
      await expect(lockedPost).toContainText('Subscribe to access')
      
      // Subscribe to creator
      await page.click('[data-testid="subscription-tier-card"]')
      await page.click('button:has-text("Subscribe")')
      
      // Complete subscription (mock)
      await page.fill('[data-testid="mock-payment"]', '4242424242424242')
      await page.click('button:has-text("Complete")')
      
      // Navigate back to creator page
      await page.goto('/fan/creators/test-creator-id')
      
      // Should now have access to content
      const unlockedPost = page.locator('[data-testid="unlocked-post"]').first()
      await expect(unlockedPost).toBeVisible()
      await expect(unlockedPost).not.toContainText('Subscribe to access')
    })
  })

  test.describe('Stripe Integration', () => {
    test('should handle Stripe subscription lifecycle', async ({ page }) => {
      // This test would require Stripe test mode setup
      test.skip(true, 'Requires Stripe test environment')
      
      // Authenticate as fan
      await authenticateUser(page, 'fan')
      
      // Subscribe with Stripe
      await page.goto('/fan/creators/test-creator-id')
      await page.click('[data-testid="subscription-tier-card"]')
      await page.click('button:has-text("Subscribe")')
      
      // Should redirect to Stripe checkout
      await page.waitForURL(/checkout\.stripe\.com/)
      
      // Fill Stripe form
      await page.fill('[placeholder="Email"]', 'test@example.com')
      await page.fill('[placeholder="Card number"]', '4242424242424242')
      await page.fill('[placeholder="MM / YY"]', '12/30')
      await page.fill('[placeholder="CVC"]', '123')
      
      // Complete payment
      await page.click('button[type="submit"]')
      
      // Should redirect back with success
      await page.waitForURL(/success=true/)
      
      // Should have active subscription
      await page.goto('/fan/settings')
      await page.click('[data-testid="subscriptions-tab"]')
      
      const subscription = page.locator('[data-testid="subscription-item"]').first()
      await expect(subscription).toContainText('Active')
      await expect(subscription).toContainText('Next billing')
    })
  })
})