import { expect } from '@playwright/test'
import { authenticatedTest } from '../fixtures/authenticated-test'

// Test data
const TEST_VIDEO_REQUEST = {
  recipientName: 'John Smith',
  occasion: 'Birthday',
  instructions: 'Please wish John a happy 30th birthday! He loves soccer and is a huge fan of your music.',
  videoType: 'personal',
}

authenticatedTest.describe('Fan Video Request Complete Flow', () => {
  authenticatedTest('fan navigates through explore and requests video from creator', async ({ fanPage }) => {
    // Step 1: Start from fan home/dashboard
    await fanPage.goto('/fan/home')
    
    // Verify we're logged in as a fan
    await expect(fanPage.locator('h2:has-text("Ann Pale")')).toBeVisible({ timeout: 10000 })
    
    // Step 2: Navigate to Explore via sidebar
    await fanPage.click('a[href="/fan/explore"]')
    await fanPage.waitForURL('**/fan/explore', { timeout: 30000 })
    
    // Step 3: Wait for creators to load
    await expect(fanPage.locator('h1:has-text("Explore Creators")')).toBeVisible()
    
    // Wait for creators to be loaded
    await fanPage.waitForSelector('[data-creators-loaded="true"]', { timeout: 15000 })
    
    // Step 4: Search for a specific creator or click the first available
    const creatorCards = fanPage.locator('[data-testid*="creator-card"]')
    const creatorCount = await creatorCards.count()
    
    if (creatorCount === 0) {
      throw new Error('No creators found on explore page')
    }
    
    // Click on the first creator's "View Profile" button
    const firstCreatorCard = creatorCards.first()
    await firstCreatorCard.locator('button:has-text("View Profile")').click()
    
    // Step 5: Wait for creator profile page to load
    await fanPage.waitForURL('**/fan/creators/**')
    
    // Verify we're on a creator's profile page
    await expect(fanPage.locator('[data-testid="creator-profile"]')).toBeVisible({ timeout: 10000 })
    
    // Step 6: Click Request Video button
    const requestVideoButton = fanPage.locator('[data-testid="request-video-button"], button:has-text("Request Video")')
    await expect(requestVideoButton).toBeVisible({ timeout: 10000 })
    await requestVideoButton.click()
    
    // Step 7: Fill out video request form in modal
    // Wait for modal to open
    await fanPage.waitForSelector('[data-testid="video-order-modal"], [role="dialog"]', { timeout: 10000 })
    
    // Step 7a: Occasion step
    const occasionButton = fanPage.locator(`button:has-text("${TEST_VIDEO_REQUEST.occasion}")`)
    if (await occasionButton.isVisible({ timeout: 2000 })) {
      await occasionButton.click()
    } else {
      // Try selecting from dropdown if buttons aren't visible
      const occasionSelect = fanPage.locator('select[name="occasion"], [data-testid="occasion-select"]')
      if (await occasionSelect.isVisible()) {
        await occasionSelect.selectOption({ label: TEST_VIDEO_REQUEST.occasion })
      }
    }
    
    // Fill recipient name if on same step
    const recipientInput = fanPage.locator('input[placeholder*="recipient"], input[name="recipientName"], [data-testid="recipient-name"]')
    if (await recipientInput.isVisible({ timeout: 2000 })) {
      await recipientInput.fill(TEST_VIDEO_REQUEST.recipientName)
    }
    
    // Click Next
    await fanPage.click('button:has-text("Next"), button:has-text("Continue")')
    
    // Step 7b: Message/Instructions step
    await fanPage.waitForTimeout(500) // Allow for animation
    
    // Fill in the message/instructions
    const messageTextarea = fanPage.locator('textarea[placeholder*="message"], textarea[placeholder*="instructions"], textarea[name="instructions"], [data-testid="instructions"]')
    if (await messageTextarea.isVisible({ timeout: 3000 })) {
      await messageTextarea.fill(TEST_VIDEO_REQUEST.instructions)
      await fanPage.click('button:has-text("Next"), button:has-text("Continue")')
    }
    
    // Step 7c: Skip gift options if present
    if (await fanPage.locator('text="Is this a gift?"').isVisible({ timeout: 2000 })) {
      await fanPage.click('button:has-text("Next"), button:has-text("Continue")')
    }
    
    // Step 7d: Skip delivery options if present (use default)
    if (await fanPage.locator('text="When do you need this?"').isVisible({ timeout: 2000 })) {
      await fanPage.click('button:has-text("Next"), button:has-text("Continue")')
    }
    
    // Step 8: Payment step
    // Wait for payment section to appear
    await fanPage.waitForSelector('text=/Payment|Order Summary|Complete your booking/i', { timeout: 15000 })
    
    // Verify price is shown
    await expect(fanPage.locator('text=/\\$[0-9]+/').first()).toBeVisible()
    
    // Look for Stripe payment form
    const stripeFrame = await fanPage.waitForSelector('iframe[src*="stripe"], iframe[title*="Stripe"], iframe[name*="stripe"]', { timeout: 10000 }).catch(() => null)
    
    if (stripeFrame) {
      // Fill Stripe payment details in iframe
      const frame = fanPage.frameLocator('iframe[src*="stripe"], iframe[title*="Stripe"], iframe[name*="stripe"]').first()
      
      // Fill card details with test card
      await frame.locator('[placeholder*="Card"], input[name="cardnumber"], #cardNumber').fill('4242424242424242')
      await frame.locator('[placeholder*="MM"], input[name="exp-date"], #cardExpiry').fill('12/30')
      await frame.locator('[placeholder*="CVC"], input[name="cvc"], #cardCvc').fill('123')
      
      // Fill ZIP if present
      const zipInput = frame.locator('[placeholder*="ZIP"], input[name="postal"], #billingPostalCode')
      if (await zipInput.isVisible({ timeout: 2000 })) {
        await zipInput.fill('10001')
      }
    } else {
      // Handle inline payment form (non-iframe)
      await fanPage.fill('input[placeholder*="Card"], input[name="cardNumber"], [data-testid="card-number"]', '4242424242424242')
      await fanPage.fill('input[placeholder*="MM"], input[name="expiry"], [data-testid="card-expiry"]', '12/30')
      await fanPage.fill('input[placeholder*="CVC"], input[name="cvc"], [data-testid="card-cvc"]', '123')
      
      const zipInput = fanPage.locator('input[placeholder*="ZIP"], input[name="zip"], [data-testid="card-zip"]')
      if (await zipInput.isVisible({ timeout: 2000 })) {
        await zipInput.fill('10001')
      }
    }
    
    // Step 9: Complete payment
    const payButton = fanPage.locator('button:has-text("Pay"), button:has-text("Complete"), button:has-text("Confirm"), [data-testid="confirm-payment"]')
    await payButton.click()
    
    // Step 10: Wait for success indication
    const successIndicators = [
      '[data-testid="payment-success"]',
      '[data-testid="success-message"]',
      'text=/Success|Thank you|confirmed/i',
      'text="Your video request has been submitted"'
    ]
    
    let successFound = false
    for (const selector of successIndicators) {
      if (await fanPage.locator(selector).isVisible({ timeout: 20000 }).catch(() => false)) {
        successFound = true
        break
      }
    }
    
    expect(successFound).toBe(true)
    console.log('Video request completed successfully!')
  })

  authenticatedTest('fan can search for specific creator and request video', async ({ fanPage }) => {
    // Navigate directly to explore page
    await fanPage.goto('/fan/explore')
    
    // Wait for page to load
    await expect(fanPage.locator('h1:has-text("Explore Creators")')).toBeVisible()
    await fanPage.waitForSelector('[data-creators-loaded="true"]', { timeout: 15000 })
    
    // Search for a creator
    const searchInput = fanPage.locator('[data-testid="search-creators"], input[placeholder*="Search creators"]')
    await searchInput.fill('Wyclef') // Search for Wyclef Jean if available
    await fanPage.waitForTimeout(1000) // Wait for search debounce
    
    // Check if any results found
    const creatorCards = fanPage.locator('[data-testid*="creator-card"]')
    const count = await creatorCards.count()
    
    if (count > 0) {
      // Click on the first search result
      await creatorCards.first().locator('button:has-text("View Profile")').click()
      
      // Wait for creator profile
      await fanPage.waitForURL('**/fan/creators/**')
      await expect(fanPage.locator('[data-testid="creator-profile"]')).toBeVisible({ timeout: 10000 })
      
      // Verify we navigated to a creator profile (any creator from search)
      const creatorName = await fanPage.locator('h1, [data-testid="creator-name"]').first().textContent()
      console.log(`Found and navigated to creator: ${creatorName}`)
    } else {
      // If specific creator not found, clear search and use any creator
      await searchInput.clear()
      await fanPage.waitForTimeout(1000)
      
      const allCreators = fanPage.locator('[data-testid*="creator-card"]')
      const allCount = await allCreators.count()
      expect(allCount).toBeGreaterThan(0)
      
      await allCreators.first().locator('button:has-text("View Profile")').click()
      await fanPage.waitForURL('**/fan/creators/**')
    }
    
    // Now request a video (simplified version)
    const requestButton = fanPage.locator('[data-testid="request-video-button"], button:has-text("Request Video")')
    await expect(requestButton).toBeVisible()
    await requestButton.click()
    
    // Verify modal opens
    await expect(fanPage.locator('[role="dialog"], [data-testid="video-order-modal"]')).toBeVisible({ timeout: 10000 })
  })

  authenticatedTest('fan can filter creators by category', async ({ fanPage }) => {
    // Navigate to explore page
    await fanPage.goto('/fan/explore')
    
    // Wait for page to load
    await expect(fanPage.locator('h1:has-text("Explore Creators")')).toBeVisible()
    await fanPage.waitForSelector('[data-creators-loaded="true"]', { timeout: 15000 })
    
    // Click on a category filter (e.g., Music)
    const musicCategoryButton = fanPage.locator('[data-testid="category-music"], button:has-text("Music")')
    if (await musicCategoryButton.isVisible({ timeout: 5000 })) {
      await musicCategoryButton.click()
      
      // Verify filter is active
      await expect(fanPage.locator('[data-testid="active-filter-Music"]')).toBeVisible({ timeout: 5000 })
      
      // Verify creators are filtered (all should have Music category)
      const creatorCards = fanPage.locator('[data-testid*="creator-card"]')
      const count = await creatorCards.count()
      
      if (count > 0) {
        // Check first creator has Music category
        const firstCreatorCategory = await creatorCards.first().locator('[data-testid="creator-category"]').textContent()
        expect(firstCreatorCategory).toContain('Music')
      }
      
      // Clear filter
      await fanPage.click('[data-testid="clear-all-filters"], button:has-text("Clear all")')
      
      // Verify filter is removed
      await expect(fanPage.locator('[data-testid="active-filter-Music"]')).not.toBeVisible()
    }
  })
})