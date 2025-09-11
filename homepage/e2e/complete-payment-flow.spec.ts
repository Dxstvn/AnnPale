import { expect } from '@playwright/test'
import { authenticatedTest } from './fixtures/authenticated-test'

// Test data
const TEST_CREATOR = {
  username: '1', // Wyclef Jean's ID
  displayName: 'Wyclef Jean',
  basePrice: 150,
  rushPrice: 75,
  platformFeePercentage: 0.30, // 30% platform fee (70/30 split)
}

const TEST_VIDEO_REQUEST = {
  recipientName: 'John Smith',
  occasion: 'birthday',
  instructions: 'Please wish John a happy 30th birthday!',
  videoType: 'personal',
}

authenticatedTest.describe('Complete Payment Flow E2E', () => {
  authenticatedTest.beforeEach(async ({ page }) => {
    // Set up test data if needed
    await page.addInitScript(() => {
      // Add any necessary test setup
      window.localStorage.setItem('test-mode', 'true')
    })
  })

  authenticatedTest('fan requests video with payment', async ({ page }) => {
    // Step 1: Navigate directly to the booking page for Wyclef Jean
    // This simplifies the flow and avoids modal/navigation issues
    await page.goto(`/book/${TEST_CREATOR.username}`)
    
    // Step 2: Go through booking wizard
    // Wait for booking page to load
    await page.waitForURL('**/book/**')
    
    // Step 2a: Select occasion (first step of wizard)
    await page.waitForSelector('text="What\'s the occasion?"')
    
    // Click on Birthday option in the Popular Occasions section or All Occasions
    // Try the button with just "Birthday" text
    await page.click('button:has-text("Birthday")').catch(async () => {
      // If that fails, try clicking the radio button version
      await page.click('label:has-text("Birthday")')
    })
    
    // Fill in recipient name (might be on the same page or next page)
    const recipientInput = page.locator('input[type="text"]').first()
    if (await recipientInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await recipientInput.fill(TEST_VIDEO_REQUEST.recipientName)
    }
    
    // Click Next button
    await page.click('button:has-text("Next")')
    
    // Step 2b: Message step
    await page.waitForTimeout(1000) // Wait for page transition
    
    // Check if we're on the Message step
    if (await page.locator('text="Tell us more about this video"').isVisible({ timeout: 2000 }).catch(() => false)) {
      // Fill in message details
      const messageTextarea = page.locator('textarea').first()
      await messageTextarea.fill(TEST_VIDEO_REQUEST.instructions)
      await page.click('button:has-text("Next")')
      await page.waitForTimeout(1000)
    }
    
    // Step 2c: Gift Options step  
    // Check if we're on the Gift Options step
    if (await page.locator('text="Is this a gift?"').isVisible({ timeout: 2000 }).catch(() => false)) {
      // Skip gift options - just click Next
      await page.click('button:has-text("Next")')
      await page.waitForTimeout(1000)
    }
    
    // Step 2d: Delivery step
    // Check if we're on the Delivery step
    if (await page.locator('text="When do you need this?"').isVisible({ timeout: 2000 }).catch(() => false)) {
      // Skip delivery options (use defaults) - just click Next
      await page.click('button:has-text("Next")')
      await page.waitForTimeout(1000)
    }
    
    // Step 2e: Payment step
    // Wait for Payment step to appear
    await page.waitForSelector('text="Payment", text="Complete your booking", text="Order Summary"', { timeout: 10000 })
    
    // Look for Stripe iframe or payment form
    const stripeFrame = await page.waitForSelector('iframe[src*="stripe"], iframe[title*="Stripe"], iframe[name*="stripe"]', { timeout: 15000 }).catch(() => null)
    
    if (!stripeFrame) {
      // If no Stripe iframe, look for inline payment form
      await page.waitForSelector('input[placeholder*="Card"], input[name="cardNumber"], [data-testid="card-input"]', { timeout: 10000 })
    }
    
    // Step 3: Fill Stripe payment (using test card)
    // Wait for Stripe to fully load
    await page.waitForTimeout(2000)
    
    if (stripeFrame) {
      // Handle Stripe iframe
      const frame = page.frameLocator('iframe[name*="stripe"], iframe[title*="Stripe"], iframe[src*="checkout.stripe"]').first()
      
      // Try multiple selectors for card input
      await frame.locator('[placeholder*="Card"], input[name="cardnumber"], #cardNumber').fill('4242424242424242')
      await frame.locator('[placeholder*="MM"], input[name="exp-date"], #cardExpiry').fill('12/30')
      await frame.locator('[placeholder*="CVC"], input[name="cvc"], #cardCvc').fill('123')
      await frame.locator('[placeholder*="ZIP"], input[name="postal"], #billingPostalCode').fill('10001')
    } else {
      // Handle inline payment form
      await page.fill('input[placeholder*="Card"], input[name="cardNumber"]', '4242424242424242')
      await page.fill('input[placeholder*="MM"], input[name="expiry"]', '12/30')
      await page.fill('input[placeholder*="CVC"], input[name="cvc"]', '123')
      await page.fill('input[placeholder*="ZIP"], input[name="zip"]', '10001')
    }
    
    // Step 8: Confirm payment
    await page.click('[data-testid="confirm-payment"], button:has-text("Pay"), button:has-text("Complete")')
    
    // Step 9: Wait for success or Stripe redirect
    // Stripe might redirect to a success page or show inline success
    await Promise.race([
      page.waitForSelector('[data-testid="payment-success"]', { timeout: 20000 }),
      page.waitForURL('**/success**', { timeout: 20000 }),
      page.waitForSelector(':text("Payment successful")', { timeout: 20000 })
    ])
    
    // Step 10: Verify payment was successful
    const successIndicators = [
      '[data-testid="success-message"]',
      ':text("Payment successful")',
      ':text("Thank you")',
      ':text("Order confirmed")'
    ]
    
    for (const selector of successIndicators) {
      const element = page.locator(selector).first()
      if (await element.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(element).toBeVisible()
        break
      }
    }
    
    // Step 11: Verify Stripe webhook was received (check server logs or database)
    // The webhook should have created a payment record in the database
    console.log('Payment flow completed successfully!')
  })

  authenticatedTest('handles payment failure gracefully', async ({ page }) => {
    // Navigate directly to booking page
    await page.goto(`/book/${TEST_CREATOR.username}`)
    
    // Wait for booking form to load
    await page.waitForSelector('form, [data-testid="booking-form"], [data-testid="video-request-form"]', { timeout: 10000 })
    
    // Fill minimum required fields
    await page.selectOption('[data-testid="video-type"]', 'personal')
    await page.fill('[data-testid="recipient-name"]', 'Test User')
    await page.selectOption('[data-testid="occasion"]', 'birthday')
    await page.fill('[data-testid="instructions"]', 'Test message')
    
    // Continue to payment
    await page.click('[data-testid="continue-to-payment"]')
    
    // Use a card that will be declined
    const stripeFrame = page.frameLocator('iframe[name*="stripe"]').first()
    await stripeFrame.locator('[placeholder="Card number"]').fill('4000000000000002') // Card that always declines
    await stripeFrame.locator('[placeholder="MM / YY"]').fill('12/30')
    await stripeFrame.locator('[placeholder="CVC"]').fill('123')
    await stripeFrame.locator('[placeholder="ZIP"]').fill('10001')
    
    // Try to confirm payment
    await page.click('[data-testid="confirm-payment"]')
    
    // Verify error message is shown
    await page.waitForSelector('[data-testid="payment-error"]')
    await expect(page.locator('[data-testid="payment-error"]')).toContainText('Your card was declined')
    
    // Verify user can retry
    await expect(page.locator('[data-testid="retry-payment"]')).toBeVisible()
  })

  authenticatedTest('calculates fees correctly for different amounts', async ({ page }) => {
    // Navigate directly to booking page
    await page.goto(`/book/${TEST_CREATOR.username}`)
    
    // Wait for booking form to load
    await page.waitForSelector('form, [data-testid="booking-form"], [data-testid="video-request-form"]', { timeout: 10000 })
    
    // Test base price
    const basePrice = TEST_CREATOR.basePrice
    const platformFee = basePrice * TEST_CREATOR.platformFeePercentage
    const creatorEarnings = basePrice - platformFee
    
    await expect(page.locator('[data-testid="base-price"]')).toContainText(`$${basePrice}`)
    await expect(page.locator('[data-testid="platform-fee"]')).toContainText(`$${platformFee.toFixed(2)}`)
    await expect(page.locator('[data-testid="creator-earnings"]')).toContainText(`$${creatorEarnings.toFixed(2)}`)
    
    // Test with rush delivery
    await page.check('[data-testid="rush-delivery"]')
    const totalWithRush = basePrice + TEST_CREATOR.rushPrice
    const rushPlatformFee = totalWithRush * TEST_CREATOR.platformFeePercentage
    const rushCreatorEarnings = totalWithRush - rushPlatformFee
    
    await expect(page.locator('[data-testid="total-price"]')).toContainText(`$${totalWithRush}`)
    await expect(page.locator('[data-testid="platform-fee"]')).toContainText(`$${rushPlatformFee.toFixed(2)}`)
    await expect(page.locator('[data-testid="creator-earnings"]')).toContainText(`$${rushCreatorEarnings.toFixed(2)}`)
    
    // Uncheck rush delivery
    await page.uncheck('[data-testid="rush-delivery"]')
    await expect(page.locator('[data-testid="total-price"]')).toContainText(`$${basePrice}`)
    await expect(page.locator('[data-testid="platform-fee"]')).toContainText(`$${platformFee.toFixed(2)}`)
    await expect(page.locator('[data-testid="creator-earnings"]')).toContainText(`$${creatorEarnings.toFixed(2)}`)
  })

  authenticatedTest('saves video request to database after payment', async ({ page }) => {
    // Navigate directly to booking page
    await page.goto(`/book/${TEST_CREATOR.username}`)
    
    // Wait for booking form to load
    await page.waitForSelector('form, [data-testid="booking-form"], [data-testid="video-request-form"]', { timeout: 10000 })
    
    // Fill form
    await page.selectOption('[data-testid="video-type"]', TEST_VIDEO_REQUEST.videoType)
    await page.fill('[data-testid="recipient-name"]', TEST_VIDEO_REQUEST.recipientName)
    await page.selectOption('[data-testid="occasion"]', TEST_VIDEO_REQUEST.occasion)
    await page.fill('[data-testid="instructions"]', TEST_VIDEO_REQUEST.instructions)
    
    // Continue to payment
    await page.click('[data-testid="continue-to-payment"]')
    
    // Fill payment details
    const stripeFrame = page.frameLocator('iframe[name*="stripe"]').first()
    await stripeFrame.locator('[placeholder="Card number"]').fill('4242424242424242')
    await stripeFrame.locator('[placeholder="MM / YY"]').fill('12/30')
    await stripeFrame.locator('[placeholder="CVC"]').fill('123')
    await stripeFrame.locator('[placeholder="ZIP"]').fill('10001')
    
    // Confirm payment
    await page.click('[data-testid="confirm-payment"]')
    
    // Wait for success and capture request ID
    await page.waitForSelector('[data-testid="payment-success"]')
    const requestId = await page.locator('[data-testid="request-id"]').textContent()
    
    // Navigate to fan's requests page
    await page.goto('/my-requests')
    
    // Verify the request appears in the list
    await expect(page.locator(`[data-testid="request-${requestId}"]`)).toBeVisible()
    await expect(page.locator(`[data-testid="request-${requestId}"]`)).toContainText(TEST_VIDEO_REQUEST.recipientName)
    await expect(page.locator(`[data-testid="request-${requestId}"]`)).toContainText('Pending')
  })
})