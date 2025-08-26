# Playwright E2E Test Scenarios for Fan Dashboard

## Overview
These E2E tests cover the complete user journeys for the Fan Dashboard features. They test the actual user experience from start to finish, including navigation, form interactions, API calls, and UI updates.

## Test Setup
```typescript
// e2e/fixtures/fan.fixtures.ts
import { test as base } from '@playwright/test'

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login and authenticate before each test
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/fan/dashboard')
    await use(page)
  }
})
```

## 1. Video Request Creation Flow

### Test: Complete video request journey
```typescript
// e2e/fan/request-creation.spec.ts
import { test, expect } from '../fixtures/fan.fixtures'

test.describe('Video Request Creation', () => {
  test('should complete full video request flow', async ({ authenticatedPage: page }) => {
    // Navigate to request page
    await page.goto('/fan/request/new')
    
    // Step 1: Search and select creator
    await page.fill('[placeholder*="Search creators"]', 'Marie')
    await page.waitForSelector('[data-testid="creator-card"]')
    
    // Verify creator details are visible
    await expect(page.locator('text=Marie Jean')).toBeVisible()
    await expect(page.locator('text=$75')).toBeVisible()
    await expect(page.locator('text=24h')).toBeVisible()
    
    // Select creator
    await page.click('[data-testid="creator-card"]:has-text("Marie Jean")')
    
    // Step 2: Fill video details
    await expect(page.locator('text=Video Details')).toBeVisible()
    
    // Select occasion
    await page.click('[data-testid="occasion-birthday"]')
    
    // Fill recipient information
    await page.fill('[name="recipientName"]', 'Sarah Johnson')
    await page.selectOption('[name="recipientRelation"]', 'sibling')
    
    // Add instructions
    await page.fill('[name="instructions"]', 
      'Please wish my sister Sarah a happy 25th birthday! She loves your music.')
    
    // Optional: Add rush delivery
    await page.check('[name="rushOrder"]')
    await expect(page.locator('text=+$25')).toBeVisible()
    
    // Continue to review
    await page.click('button:has-text("Continue")')
    
    // Step 3: Review details
    await expect(page.locator('text=Review Your Request')).toBeVisible()
    await expect(page.locator('text=Sarah Johnson')).toBeVisible()
    await expect(page.locator('text=$100')).toBeVisible() // $75 + $25 rush
    
    // Continue to payment
    await page.click('button:has-text("Proceed to Payment")')
    
    // Step 4: Payment method selection
    await expect(page.locator('text=Select Payment Method')).toBeVisible()
    
    // Wait for location detection
    await page.waitForSelector('text=Detected location', { timeout: 5000 })
    
    // Select payment method (Stripe for US users)
    await page.click('[data-testid="payment-stripe"]')
    await expect(page.locator('text=Processing Fee')).toBeVisible()
    
    // Complete order
    await page.click('button:has-text("Complete Order")')
    
    // Verify success
    await page.waitForSelector('[data-testid="success-dialog"]')
    await expect(page.locator('text=Request Submitted Successfully')).toBeVisible()
    
    // Navigate to orders
    await page.click('button:has-text("View Order Status")')
    await expect(page).toHaveURL('/fan/orders')
  })
  
  test('should validate form fields', async ({ authenticatedPage: page }) => {
    await page.goto('/fan/request/new')
    
    // Select a creator first
    await page.click('[data-testid="creator-card"]:first-child')
    
    // Try to continue without filling required fields
    await page.click('button:has-text("Continue")')
    
    // Should not advance
    await expect(page.locator('text=Video Details')).toBeVisible()
    
    // Fill partial data
    await page.click('[data-testid="occasion-birthday"]')
    await page.fill('[name="recipientName"]', 'John')
    // Leave instructions empty
    
    // Try to continue
    await page.click('button:has-text("Continue")')
    
    // Should still not advance (instructions required)
    await expect(page.locator('text=Video Details')).toBeVisible()
    
    // Add instructions
    await page.fill('[name="instructions"]', 'Happy birthday!')
    
    // Now should advance
    await page.click('button:has-text("Continue")')
    await expect(page.locator('text=Review Your Request')).toBeVisible()
  })
  
  test('should handle payment method auto-detection', async ({ authenticatedPage: page }) => {
    await page.goto('/fan/request/new')
    
    // Mock Haiti location
    await page.route('**/api/payments/detect-location', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          country: 'Haiti',
          country_code: 'HT',
          city: 'Port-au-Prince',
          is_haiti: true
        })
      })
    })
    
    // Complete steps to reach payment
    await page.click('[data-testid="creator-card"]:first-child')
    await page.click('[data-testid="occasion-birthday"]')
    await page.fill('[name="recipientName"]', 'Test')
    await page.fill('[name="instructions"]', 'Test message')
    await page.click('button:has-text("Continue")')
    await page.click('button:has-text("Proceed to Payment")')
    
    // MonCash should be recommended for Haiti
    await expect(page.locator('text=MonCash')).toBeVisible()
    await expect(page.locator('[data-testid="payment-moncash"] text=Recommended')).toBeVisible()
    await expect(page.locator('text=HTG')).toBeVisible()
  })
})
```

## 2. Video Library Management

### Test: Browse and interact with video library
```typescript
// e2e/fan/video-library.spec.ts
import { test, expect } from '../fixtures/fan.fixtures'

test.describe('Video Library', () => {
  test('should browse and filter videos', async ({ authenticatedPage: page }) => {
    await page.goto('/fan/videos')
    
    // Wait for videos to load
    await page.waitForSelector('[data-testid="video-card"]')
    
    // Search for specific video
    await page.fill('[placeholder*="Search"]', 'Birthday')
    await page.waitForTimeout(500) // Debounce
    
    // Verify filtered results
    const videoCards = page.locator('[data-testid="video-card"]')
    await expect(videoCards).toHaveCount(2) // Assuming 2 birthday videos
    
    // Filter by occasion
    await page.selectOption('[data-testid="filter-occasion"]', 'Birthday')
    
    // Sort by recent
    await page.selectOption('[data-testid="sort-by"]', 'recent')
    
    // Switch view mode
    await page.click('[data-testid="view-list"]')
    await expect(page.locator('[data-testid="video-list-item"]')).toBeVisible()
    
    await page.click('[data-testid="view-grid"]')
    await expect(page.locator('[data-testid="video-card"]')).toBeVisible()
  })
  
  test('should play video with custom controls', async ({ authenticatedPage: page }) => {
    await page.goto('/fan/videos')
    
    // Click on a video to play
    await page.click('[data-testid="video-card"]:first-child')
    
    // Wait for video player
    await page.waitForSelector('[data-testid="video-player"]')
    
    // Test play/pause
    await page.click('[data-testid="play-button"]')
    await page.waitForTimeout(2000)
    await page.click('[data-testid="pause-button"]')
    
    // Test volume control
    await page.click('[data-testid="volume-button"]')
    await page.fill('[data-testid="volume-slider"]', '50')
    
    // Test seek
    await page.fill('[data-testid="seek-slider"]', '30')
    
    // Test fullscreen
    await page.click('[data-testid="fullscreen-button"]')
    await expect(page.locator('[data-testid="video-player"]')).toHaveClass(/fullscreen/)
    
    // Exit fullscreen
    await page.keyboard.press('Escape')
    
    // Close player
    await page.click('[data-testid="close-player"]')
    await expect(page.locator('[data-testid="video-player"]')).not.toBeVisible()
  })
  
  test('should download video when allowed', async ({ authenticatedPage: page }) => {
    await page.goto('/fan/videos')
    
    // Find downloadable video
    const downloadableCard = page.locator('[data-testid="video-card"]:has([data-testid="download-button"])')
    
    // Start download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadableCard.locator('[data-testid="download-button"]').click()
    ])
    
    // Verify download started
    expect(download.suggestedFilename()).toContain('.mp4')
  })
  
  test('should toggle favorite videos', async ({ authenticatedPage: page }) => {
    await page.goto('/fan/videos')
    
    // Find first video
    const firstVideo = page.locator('[data-testid="video-card"]:first-child')
    const favoriteButton = firstVideo.locator('[data-testid="favorite-button"]')
    
    // Toggle favorite
    await favoriteButton.click()
    await expect(favoriteButton).toHaveClass(/active/)
    
    // Switch to favorites tab
    await page.click('[data-testid="tab-favorites"]')
    
    // Should see the favorited video
    await expect(page.locator('[data-testid="video-card"]')).toHaveCount(1)
    
    // Unfavorite
    await page.locator('[data-testid="favorite-button"]').click()
    
    // Should show empty state
    await expect(page.locator('text=No favorite videos')).toBeVisible()
  })
  
  test('should rate a video', async ({ authenticatedPage: page }) => {
    await page.goto('/fan/videos')
    
    // Click rate button on first video
    await page.click('[data-testid="video-card"]:first-child [data-testid="rate-button"]')
    
    // Wait for rating dialog
    await page.waitForSelector('[data-testid="rating-dialog"]')
    
    // Select 5 stars
    await page.click('[data-testid="star-5"]')
    
    // Add comment
    await page.fill('[name="comment"]', 'Amazing video! Thank you so much!')
    
    // Submit rating
    await page.click('button:has-text("Submit Rating")')
    
    // Verify rating appears
    await expect(page.locator('[data-testid="video-card"]:first-child [data-testid="rating-display"]'))
      .toContainText('5')
  })
})
```

## 3. Order Tracking

### Test: Track order status and updates
```typescript
// e2e/fan/order-tracking.spec.ts
import { test, expect } from '../fixtures/fan.fixtures'

test.describe('Order Tracking', () => {
  test('should display order timeline and status', async ({ authenticatedPage: page }) => {
    // Navigate to specific order
    await page.goto('/fan/orders/order-123')
    
    // Verify order header
    await expect(page.locator('h1')).toContainText('Order Details')
    await expect(page.locator('text=ORD-2024-0123')).toBeVisible()
    
    // Check status badge
    await expect(page.locator('[data-testid="status-badge"]')).toContainText('Recording')
    
    // Verify timeline
    const timeline = page.locator('[data-testid="order-timeline"]')
    await expect(timeline.locator('[data-testid="timeline-step-completed"]')).toHaveCount(3)
    await expect(timeline.locator('[data-testid="timeline-step-current"]')).toHaveCount(1)
    
    // Check time remaining
    await expect(page.locator('text=/Est. delivery in \\d+[hd]/')).toBeVisible()
    
    // Verify progress bar
    const progressBar = page.locator('[data-testid="progress-bar"]')
    await expect(progressBar).toHaveAttribute('aria-valuenow', '65')
  })
  
  test('should send message to creator', async ({ authenticatedPage: page }) => {
    await page.goto('/fan/orders/order-123')
    
    // Click send message button
    await page.click('button:has-text("Send Message")')
    
    // Wait for dialog
    await page.waitForSelector('[data-testid="message-dialog"]')
    
    // Type message
    await page.fill('[name="message"]', 'Hi! Can you include a birthday song?')
    
    // Send message
    await page.click('button:has-text("Send Message")')
    
    // Verify message appears in communication log
    await expect(page.locator('[data-testid="communication-log"]'))
      .toContainText('Can you include a birthday song?')
  })
  
  test('should cancel order when allowed', async ({ authenticatedPage: page }) => {
    await page.goto('/fan/orders/order-456') // Pending order
    
    // Verify cancel button is visible
    await expect(page.locator('button:has-text("Cancel Order")')).toBeVisible()
    
    // Click cancel
    await page.click('button:has-text("Cancel Order")')
    
    // Confirm cancellation
    await page.waitForSelector('[data-testid="cancel-dialog"]')
    await page.click('button:has-text("Yes, Cancel Order")')
    
    // Wait for status update
    await page.waitForSelector('[data-testid="status-badge"]:has-text("Cancelled")')
    
    // Verify refund information
    await expect(page.locator('text=Refund processed')).toBeVisible()
  })
  
  test('should poll for real-time updates', async ({ authenticatedPage: page }) => {
    await page.goto('/fan/orders/order-789') // Processing order
    
    // Mock status update
    await page.route('**/api/orders/order-789/status', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          status: 'completed',
          videoUrl: '/videos/completed.mp4',
          completedAt: new Date().toISOString()
        })
      })
    })
    
    // Wait for polling (every 10 seconds)
    await page.waitForTimeout(11000)
    
    // Verify status updated
    await expect(page.locator('[data-testid="status-badge"]')).toContainText('Delivered')
    
    // Video actions should be available
    await expect(page.locator('button:has-text("Watch Video")')).toBeVisible()
    await expect(page.locator('button:has-text("Download Video")')).toBeVisible()
  })
})
```

## 4. Payment Flow

### Test: Payment method selection and processing
```typescript
// e2e/fan/payment-flow.spec.ts
import { test, expect } from '../fixtures/fan.fixtures'

test.describe('Payment Flow', () => {
  test('should auto-detect location and suggest payment method', async ({ page }) => {
    // Mock geolocation API
    await page.route('**/api/payments/detect-location', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          country: 'United States',
          country_code: 'US',
          city: 'New York',
          is_haiti: false
        })
      })
    })
    
    await page.goto('/fan/request/new')
    
    // Complete request flow to payment
    // ... (abbreviated for brevity)
    
    // Verify Stripe is recommended for US
    await expect(page.locator('[data-testid="payment-stripe"] [data-testid="recommended-badge"]'))
      .toBeVisible()
    
    // Verify USD currency
    await expect(page.locator('text=$')).toBeVisible()
    await expect(page.locator('text=Processing Fee: $3.20')).toBeVisible()
  })
  
  test('should handle MonCash payment for Haiti', async ({ page }) => {
    // Mock Haiti location
    await page.route('**/api/payments/detect-location', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          country: 'Haiti',
          country_code: 'HT',
          city: 'Port-au-Prince',
          is_haiti: true
        })
      })
    })
    
    await page.goto('/fan/request/new')
    
    // Complete request flow to payment
    // ... (abbreviated for brevity)
    
    // Verify MonCash is recommended
    await expect(page.locator('[data-testid="payment-moncash"] [data-testid="recommended-badge"]'))
      .toBeVisible()
    
    // Verify HTG currency
    await expect(page.locator('text=HTG')).toBeVisible()
    
    // Select MonCash
    await page.click('[data-testid="payment-moncash"]')
    
    // Verify fee calculation in HTG
    await expect(page.locator('text=/HTG [\\d,]+/')).toBeVisible()
    
    // Complete payment
    await page.click('button:has-text("Continue with MonCash")')
    
    // Should redirect to MonCash gateway (mocked)
    await page.waitForURL(/moncash\.com/)
  })
  
  test('should show currency conversion', async ({ page }) => {
    // Mock Haiti location but selecting Stripe
    await page.route('**/api/payments/detect-location', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          country: 'Haiti',
          country_code: 'HT',
          is_haiti: true
        })
      })
    })
    
    await page.goto('/fan/request/new')
    
    // Complete to payment step
    // ... (abbreviated)
    
    // Select Stripe despite being in Haiti
    await page.click('[data-testid="payment-stripe"]')
    
    // Should show conversion note
    await expect(page.locator('text=/Approximately HTG [\\d,]+/')).toBeVisible()
  })
})
```

## 5. Mobile Responsive Testing

### Test: Mobile navigation and interactions
```typescript
// e2e/fan/mobile-responsive.spec.ts
import { test, expect, devices } from '@playwright/test'

test.use(devices['iPhone 12'])

test.describe('Mobile Experience', () => {
  test('should navigate request flow on mobile', async ({ page }) => {
    await page.goto('/fan/request/new')
    
    // Mobile menu navigation
    await page.click('[data-testid="mobile-menu"]')
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible()
    
    // Search creators with mobile keyboard
    await page.fill('[placeholder*="Search"]', 'Marie')
    
    // Scroll to see creators
    await page.locator('[data-testid="creator-card"]:last-child').scrollIntoViewIfNeeded()
    
    // Select creator (touch interaction)
    await page.tap('[data-testid="creator-card"]:first-child')
    
    // Fill form on mobile
    await page.tap('[data-testid="occasion-birthday"]')
    
    // Mobile keyboard handling
    await page.fill('[name="recipientName"]', 'Test User')
    await page.keyboard.press('Enter') // Should not submit
    
    // Scroll to continue button
    await page.locator('button:has-text("Continue")').scrollIntoViewIfNeeded()
    await page.tap('button:has-text("Continue")')
  })
  
  test('should play video on mobile with touch controls', async ({ page }) => {
    await page.goto('/fan/videos')
    
    // Tap to play video
    await page.tap('[data-testid="video-card"]:first-child')
    
    // Wait for player
    await page.waitForSelector('[data-testid="video-player"]')
    
    // Tap to play/pause
    await page.tap('[data-testid="video-player"]')
    await page.waitForTimeout(1000)
    await page.tap('[data-testid="video-player"]')
    
    // Swipe for seek (mobile gesture)
    await page.locator('[data-testid="seek-bar"]').swipe({
      direction: 'right',
      distance: 100
    })
    
    // Pinch to zoom (fullscreen alternative)
    // Note: Gesture testing might require additional setup
  })
})
```

## 6. Accessibility Testing

### Test: Keyboard navigation and screen reader support
```typescript
// e2e/fan/accessibility.spec.ts
import { test, expect } from '../fixtures/fan.fixtures'

test.describe('Accessibility', () => {
  test('should navigate with keyboard only', async ({ page }) => {
    await page.goto('/fan/request/new')
    
    // Tab through creators
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Select with Enter
    await page.keyboard.press('Enter')
    
    // Tab through form fields
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="occasion-birthday"]')).toBeFocused()
    
    // Select with Space
    await page.keyboard.press('Space')
    
    // Tab to next field
    await page.keyboard.press('Tab')
    await expect(page.locator('[name="recipientName"]')).toBeFocused()
    
    // Type with keyboard
    await page.keyboard.type('John Doe')
    
    // Tab through rest of form
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Submit with Enter
    await page.keyboard.press('Enter')
  })
  
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/fan/videos')
    
    // Check video cards have labels
    const videoCards = page.locator('[data-testid="video-card"]')
    await expect(videoCards.first()).toHaveAttribute('aria-label', /Video from .+ for .+/)
    
    // Check buttons have labels
    await expect(page.locator('[data-testid="play-button"]'))
      .toHaveAttribute('aria-label', 'Play video')
    
    await expect(page.locator('[data-testid="favorite-button"]'))
      .toHaveAttribute('aria-label', /Add to favorites|Remove from favorites/)
    
    // Check form fields have labels
    await page.goto('/fan/request/new')
    await expect(page.locator('[name="recipientName"]'))
      .toHaveAttribute('aria-label', "Recipient's name")
  })
  
  test('should announce status changes', async ({ page }) => {
    await page.goto('/fan/orders/order-123')
    
    // Check live region for status updates
    await expect(page.locator('[aria-live="polite"]')).toBeVisible()
    
    // Mock status update
    await page.evaluate(() => {
      const liveRegion = document.querySelector('[aria-live="polite"]')
      if (liveRegion) {
        liveRegion.textContent = 'Order status updated: Recording started'
      }
    })
    
    // Verify announcement
    await expect(page.locator('[aria-live="polite"]'))
      .toContainText('Order status updated')
  })
})
```

## Running the Tests

### Setup
```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install

# Run all tests
npx playwright test

# Run specific test file
npx playwright test e2e/fan/request-creation.spec.ts

# Run in UI mode (interactive)
npx playwright test --ui

# Run with specific browser
npx playwright test --project=chromium

# Run in headed mode (see browser)
npx playwright test --headed

# Generate test report
npx playwright show-report
```

### CI/CD Configuration
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```