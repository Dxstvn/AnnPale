import { test, expect } from '@playwright/test'

// Test credentials - easy reference for future tests
const TEST_CREDENTIALS = {
  fan: {
    email: 'testfan@annpale.test',
    password: 'testpassword123'
  },
  creator: {
    email: 'testcreator@annpale.test', 
    password: 'testpassword123'
  },
  admin: {
    email: 'testadmin@annpale.test',
    password: 'testpassword123'
  }
}

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

test.describe('Complete Payment Flow E2E - Email Login', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies()
  })

  test('complete flow: email login → explore → select creator → book video → pay', async ({ page }) => {
    // Step 1: Navigate to login page and login with email/password
    console.log('Step 1: Navigating to login page and logging in...')
    await page.goto('http://localhost:3000/login')
    await page.waitForLoadState('networkidle')

    // Fill in email and password
    await page.waitForSelector('#email', { timeout: 10000 })
    await page.fill('#email', TEST_CREDENTIALS.fan.email)
    await page.fill('#password', TEST_CREDENTIALS.fan.password)
    
    // Click the Sign In button
    await page.click('button:has-text("Sign In")')
    
    // Wait for redirect after login
    await page.waitForFunction(
      () => !window.location.pathname.includes('/login'),
      { timeout: 15000 }
    )
    console.log('Successfully logged in, current URL:', page.url())

    // Step 2: Navigate to Explore page
    console.log('Step 2: Navigating to Explore page...')
    
    // Look for Explore link in navigation
    const exploreLink = page.locator('a[href*="/explore"], button:has-text("Explore"), [data-testid="explore-link"]')
    if (await exploreLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await exploreLink.click()
      await page.waitForLoadState('networkidle')
    } else {
      // Navigate directly if link not found
      await page.goto('http://localhost:3000/fan/explore')
      await page.waitForLoadState('networkidle')
    }

    // Step 3: Find and select a creator from the list
    console.log('Step 3: Finding creators in creator list...')
    
    // Wait for creator cards to load - more flexible selectors
    await page.waitForSelector('button:has-text("View Profile"), .grid, [class*="creator"]', { timeout: 10000 })
    
    // Look for Wyclef Jean by name first, fallback to any creator
    const wyclefCard = page.locator(`:has-text("${TEST_CREATOR.displayName}"), :has-text("Wyclef")`).first()
    
    // If Wyclef Jean is not found, use the first available creator for testing
    const fallbackCard = page.locator('button:has-text("View Profile")').first()
    
    let selectedCard = null
    if (await wyclefCard.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Found Wyclef Jean, clicking his View Profile button')
      selectedCard = wyclefCard.locator('button:has-text("View Profile")').first()
    } else {
      console.log('Wyclef Jean not found, using first available creator for testing')
      selectedCard = fallbackCard
    }
    
    // Click on "View Profile" button to go to creator profile
    console.log('Clicking View Profile button...')
    await selectedCard.scrollIntoViewIfNeeded()
    await selectedCard.click()
    
    await page.waitForLoadState('networkidle')
    console.log('Navigated to creator profile page')
    
    // Step 4: On the profile page, look for Book Video button
    console.log('Step 4: Looking for booking button on profile page...')
    const profileBookButton = page.locator('button:has-text("Book"), button:has-text("Request Video"), [data-testid="book-video-button"], button:has-text("Request")')
    
    if (await profileBookButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('Found Book/Request button on profile page, clicking...')
      await profileBookButton.click()
    } else {
      // If no book button found, try to navigate directly to booking page
      console.log('No book button found, trying direct navigation to booking page...')
      const currentUrl = page.url()
      const creatorId = currentUrl.split('/').pop() // Get creator ID from URL
      await page.goto(`/book/${creatorId}`)
    }

    // Step 5: Fill out the video request form (booking wizard)
    console.log('Step 5: Starting booking wizard...')
    
    // Wait for booking page to load
    await page.waitForURL('**/book/**', { timeout: 10000 })
    
    // Step 5a: Select occasion
    await page.waitForSelector('text="What\'s the occasion?"', { timeout: 10000 })
    console.log('Selecting occasion: Birthday')
    
    // Click on Birthday option
    await page.click('button:has-text("Birthday")').catch(async () => {
      // If button fails, try radio/label version
      await page.click('label:has-text("Birthday")')
    })
    
    // Fill in recipient name if visible
    const recipientInput = page.locator('input[placeholder*="recipient"], input[placeholder*="name"], input[type="text"]').first()
    if (await recipientInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Entering recipient name:', TEST_VIDEO_REQUEST.recipientName)
      await recipientInput.fill(TEST_VIDEO_REQUEST.recipientName)
    }
    
    // Click Next
    await page.click('button:has-text("Next"), button:has-text("Continue")')
    await page.waitForTimeout(1000)
    
    // Step 5b: Message step
    if (await page.locator('text="Tell us more about this video"').isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Entering video instructions...')
      const messageTextarea = page.locator('textarea').first()
      await messageTextarea.fill(TEST_VIDEO_REQUEST.instructions)
      await page.click('button:has-text("Next"), button:has-text("Continue")')
      await page.waitForTimeout(1000)
    }
    
    // Step 5c: Skip remaining steps (Gift Options, Delivery, etc.)
    let stepCount = 0
    while (stepCount < 5) { // Max 5 steps to avoid infinite loop
      const nextButton = page.locator('button:has-text("Next"), button:has-text("Continue")')
      const paymentText = page.locator('text="Payment", text="Complete your booking", text="Order Summary"')
      
      // Check if we've reached payment step
      if (await paymentText.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Reached payment step')
        break
      }
      
      // If Next button is visible, click it
      if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`Clicking Next button (step ${stepCount + 1})...`)
        await nextButton.click()
        await page.waitForTimeout(1000)
        stepCount++
      } else {
        break
      }
    }
    
    // Step 6: Payment step
    console.log('Step 6: Entering payment information...')
    await page.waitForSelector('text="Payment", text="Complete your booking", text="Order Summary"', { timeout: 10000 })
    
    // Look for Stripe iframe or payment form
    const stripeFrame = await page.waitForSelector('iframe[src*="stripe"], iframe[title*="Stripe"], iframe[name*="stripe"]', { timeout: 15000 }).catch(() => null)
    
    if (!stripeFrame) {
      // If no Stripe iframe, look for inline payment form
      console.log('No Stripe iframe found, looking for inline form...')
      await page.waitForSelector('input[placeholder*="Card"], input[name="cardNumber"], [data-testid="card-input"]', { timeout: 10000 })
    }
    
    // Wait for Stripe to fully load
    await page.waitForTimeout(2000)
    
    if (stripeFrame) {
      console.log('Filling Stripe payment form in iframe...')
      const frame = page.frameLocator('iframe[name*="stripe"], iframe[title*="Stripe"], iframe[src*="checkout.stripe"]').first()
      
      // Fill card details using test card
      await frame.locator('[placeholder*="Card"], input[name="cardnumber"], #cardNumber').fill('4242424242424242')
      await frame.locator('[placeholder*="MM"], input[name="exp-date"], #cardExpiry').fill('12/30')
      await frame.locator('[placeholder*="CVC"], input[name="cvc"], #cardCvc').fill('123')
      await frame.locator('[placeholder*="ZIP"], input[name="postal"], #billingPostalCode').fill('10001')
    } else {
      console.log('Filling inline payment form...')
      await page.fill('input[placeholder*="Card"], input[name="cardNumber"]', '4242424242424242')
      await page.fill('input[placeholder*="MM"], input[name="expiry"]', '12/30')
      await page.fill('input[placeholder*="CVC"], input[name="cvc"]', '123')
      await page.fill('input[placeholder*="ZIP"], input[name="zip"]', '10001')
    }
    
    // Step 7: Complete payment
    console.log('Step 7: Completing payment...')
    const payButton = page.locator('[data-testid="confirm-payment"], button:has-text("Pay"), button:has-text("Complete"), button:has-text("Book Now")')
    await payButton.click()
    
    // Step 8: Wait for success
    console.log('Step 8: Waiting for payment confirmation...')
    await Promise.race([
      page.waitForSelector('[data-testid="payment-success"]', { timeout: 20000 }),
      page.waitForURL('**/success**', { timeout: 20000 }),
      page.waitForSelector(':text("Payment successful")', { timeout: 20000 }),
      page.waitForSelector(':text("Thank you")', { timeout: 20000 }),
      page.waitForSelector(':text("Order confirmed")', { timeout: 20000 })
    ])
    
    // Step 9: Verify success
    console.log('Step 9: Verifying payment success...')
    const successIndicators = [
      '[data-testid="success-message"]',
      ':text("Payment successful")',
      ':text("Thank you")',
      ':text("Order confirmed")',
      ':text("Your video request")'
    ]
    
    let successFound = false
    for (const selector of successIndicators) {
      const element = page.locator(selector).first()
      if (await element.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(element).toBeVisible()
        successFound = true
        console.log(`Success indicator found: ${selector}`)
        break
      }
    }
    
    if (!successFound) {
      console.error('No success indicator found after payment')
      await page.screenshot({ path: 'payment-result.png' })
      throw new Error('Payment success confirmation not found')
    }
    
    console.log('✅ Payment flow completed successfully!')
    console.log('Full flow: Email Login → Explore → Select Creator → Book Video → Payment → Success')
  })
})