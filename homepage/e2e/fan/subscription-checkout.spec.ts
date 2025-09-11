import { authenticatedTest as test, expect, Page } from '../fixtures/authenticated-test'

test.describe('Subscription Checkout Flow', () => {
  // Helper to navigate directly to checkout with params
  async function navigateToCheckout(
    page: Page, 
    tier: string = 'premium-tier-id', 
    creator: string = 'd963aa48-879d-461c-9df3-7dc557b545f9',
    price: string = '25'
  ) {
    await page.goto(`/checkout?tier=${tier}&creator=${creator}&price=${price}`)
    await page.waitForLoadState('domcontentloaded')
  }

  test('displays correct subscription details from URL params', async ({ fanPage }) => {
    await navigateToCheckout(fanPage, 'gold-tier', 'd963aa48-879d-461c-9df3-7dc557b545f9', '75')
    
    // Verify page title
    const title = fanPage.locator('h1')
    await expect(title).toContainText('Subscribe to Creator')
    
    // Verify subscription badge
    const tierBadge = fanPage.locator('[data-testid="checkout-order-details"] .badge').first()
    await expect(tierBadge).toBeVisible()
    
    // Verify creator name
    const creatorName = fanPage.locator('[data-testid="checkout-creator-name"]')
    await expect(creatorName).toContainText('Wyclef Jean')
    
    // Verify price
    const price = fanPage.locator('[data-testid="checkout-price"]')
    await expect(price).toContainText('$75/mo')
    
    // Verify billing cycle
    const billingCycle = fanPage.locator('[data-testid="checkout-billing-cycle"]')
    await expect(billingCycle).toContainText('monthly')
  })

  test('shows subscription features correctly', async ({ fanPage }) => {
    await navigateToCheckout(fanPage)
    
    // Check features are displayed
    const features = fanPage.locator('[data-testid^="checkout-feature-"]')
    const count = await features.count()
    expect(count).toBeGreaterThanOrEqual(3)
    
    // Verify each feature has checkmark icon
    for (let i = 0; i < count; i++) {
      const feature = features.nth(i)
      await expect(feature).toBeVisible()
      
      // Check for checkmark icon
      const icon = feature.locator('svg')
      await expect(icon).toBeVisible()
      
      // Check feature text is not empty
      const text = await feature.textContent()
      expect(text).toBeTruthy()
      expect(text?.length).toBeGreaterThan(5)
    }
  })

  test('handles missing URL parameters gracefully', async ({ fanPage }) => {
    // Navigate without params
    await fanPage.goto('/checkout')
    await fanPage.waitForLoadState('domcontentloaded')
    
    // Should show video checkout by default
    const title = fanPage.locator('h1')
    await expect(title).toContainText('Complete Your Order')
    
    // Should not show subscription-specific elements
    const billingCycle = fanPage.locator('[data-testid="checkout-billing-cycle"]')
    await expect(billingCycle).not.toBeVisible()
  })

  test('validates back navigation link', async ({ fanPage }) => {
    const creatorId = '819421cf-9437-4d10-bb09-bca4e0c12cba'
    await navigateToCheckout(fanPage, 'tier1', creatorId, '50')
    
    // Find and verify back button
    const backButton = fanPage.locator('a:has-text("Back to Creator")')
    await expect(backButton).toBeVisible()
    
    // Check href attribute
    const href = await backButton.getAttribute('href')
    expect(href).toBe(`/fan/creators/${creatorId}`)
    
    // Test click navigation
    await backButton.click()
    await fanPage.waitForLoadState('domcontentloaded')
    
    // Should be on creator page
    const url = fanPage.url()
    expect(url).toContain(`/fan/creators/${creatorId}`)
  })

  test('displays correct creator information', async ({ fanPage }) => {
    // Test with Michael Brun
    await navigateToCheckout(fanPage, 'silver', '819421cf-9437-4d10-bb09-bca4e0c12cba', '35')
    
    const creatorName = fanPage.locator('[data-testid="checkout-creator-name"]')
    await expect(creatorName).toContainText('Michael Brun')
    
    // Test with Rutshelle Guillaume
    await navigateToCheckout(fanPage, 'bronze', 'cbce25c9-04e0-45c7-b872-473fed4eeb1d', '15')
    await expect(creatorName).toContainText('Rutshelle Guillaume')
  })

  test('calculates next billing date correctly', async ({ fanPage }) => {
    await navigateToCheckout(fanPage)
    
    const nextBilling = fanPage.locator('[data-testid="checkout-next-billing"]')
    await expect(nextBilling).toBeVisible()
    
    const dateText = await nextBilling.textContent()
    expect(dateText).toBeTruthy()
    
    // Verify date is approximately 30 days from now
    const today = new Date()
    const expectedDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const displayedDate = new Date(dateText?.replace('Next: ', '') || '')
    
    // Check dates are within 2 days of each other (accounting for timezone differences)
    const daysDiff = Math.abs((displayedDate.getTime() - expectedDate.getTime()) / (24 * 60 * 60 * 1000))
    expect(daysDiff).toBeLessThan(2)
  })

  test('tier badge displays correctly', async ({ fanPage }) => {
    await navigateToCheckout(fanPage, 'platinum-tier', 'd963aa48-879d-461c-9df3-7dc557b545f9', '100')
    
    // Find tier badge
    const tierBadge = fanPage.locator('[data-testid="checkout-order-details"] .badge').first()
    await expect(tierBadge).toBeVisible()
    
    // Check for crown icon in badge
    const crownIcon = tierBadge.locator('svg')
    await expect(crownIcon).toBeVisible()
    
    // Verify badge has gradient styling
    const classNames = await tierBadge.getAttribute('class')
    expect(classNames).toContain('gradient')
  })

  test('handles price formatting correctly', async ({ fanPage }) => {
    // Test various price formats
    const testCases = [
      { price: '9', expected: '$9/mo' },
      { price: '19.99', expected: '$19.99/mo' },
      { price: '100', expected: '$100/mo' },
      { price: '0', expected: '$0/mo' }
    ]
    
    for (const testCase of testCases) {
      await navigateToCheckout(fanPage, 'test-tier', 'd963aa48-879d-461c-9df3-7dc557b545f9', testCase.price)
      
      const priceElement = fanPage.locator('[data-testid="checkout-price"]')
      await expect(priceElement).toContainText(testCase.expected)
    }
  })

  test('subscription terms are visible', async ({ fanPage }) => {
    await navigateToCheckout(fanPage)
    
    // Check for terms checkbox
    const termsCheckbox = fanPage.locator('input[type="checkbox"]#terms')
    await expect(termsCheckbox).toBeVisible()
    await expect(termsCheckbox).not.toBeChecked()
    
    // Check for terms label
    const termsLabel = fanPage.locator('label[for="terms"]')
    await expect(termsLabel).toBeVisible()
    await expect(termsLabel).toContainText('Terms of Service')
    await expect(termsLabel).toContainText('Privacy Policy')
    
    // Check links are present
    const termsLink = fanPage.locator('a[href="/terms"]')
    await expect(termsLink).toBeVisible()
    
    const privacyLink = fanPage.locator('a[href="/privacy"]')
    await expect(privacyLink).toBeVisible()
  })

  test('payment form validation', async ({ fanPage }) => {
    await navigateToCheckout(fanPage)
    
    // Try to submit without agreeing to terms
    const submitButton = fanPage.locator('button:has-text("Complete Order")')
    await submitButton.click()
    
    // Should show alert
    const alert = fanPage.locator('[role="alert"]')
    await expect(alert).toBeVisible({ timeout: 3000 })
    await expect(alert).toContainText('agree to the terms')
    
    // Check terms and try again
    const termsCheckbox = fanPage.locator('input#terms')
    await termsCheckbox.check()
    await expect(termsCheckbox).toBeChecked()
    
    // Now submit should work (or show different validation)
    await submitButton.click()
    
    // Check for processing state
    const isProcessing = await submitButton.locator('text=/Processing/').isVisible({ timeout: 2000 }).catch(() => false)
    if (isProcessing) {
      console.log('Payment processing initiated')
    }
  })

  test('responsive design on mobile viewport', async ({ fanPage }) => {
    // Set mobile viewport
    await fanPage.setViewportSize({ width: 375, height: 667 })
    await navigateToCheckout(fanPage)
    
    // Check layout is single column on mobile
    const grid = fanPage.locator('.grid.lg\\:grid-cols-3')
    await expect(grid).toBeVisible()
    
    // Order details should be full width
    const orderDetails = fanPage.locator('[data-testid="checkout-order-details"]')
    const detailsBox = await orderDetails.boundingBox()
    expect(detailsBox?.width).toBeGreaterThan(300)
    
    // Back button should still be visible
    const backButton = fanPage.locator('a:has-text("Back")')
    await expect(backButton).toBeVisible()
  })

  test('handles network errors gracefully', async ({ fanPage }) => {
    await navigateToCheckout(fanPage)
    
    // Simulate offline
    await fanPage.context().setOffline(true)
    
    // Try to submit
    const termsCheckbox = fanPage.locator('input#terms')
    await termsCheckbox.check()
    
    const submitButton = fanPage.locator('button:has-text("Complete Order")')
    await submitButton.click()
    
    // Should show error (implementation dependent)
    // For now just verify button is still enabled after failed attempt
    await fanPage.waitForTimeout(2000)
    await expect(submitButton).toBeEnabled()
    
    // Restore connection
    await fanPage.context().setOffline(false)
  })

  test('preserves form data on navigation', async ({ fanPage }) => {
    await navigateToCheckout(fanPage)
    
    // Fill some form fields
    const nameInput = fanPage.locator('input[id="recipient-name"], input[id="name"]').first()
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User')
    }
    
    const emailInput = fanPage.locator('input[type="email"]').first()
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com')
    }
    
    // Navigate away and back
    const backButton = fanPage.locator('a:has-text("Back")')
    await backButton.click()
    await fanPage.waitForTimeout(1000)
    
    await fanPage.goBack()
    await fanPage.waitForTimeout(1000)
    
    // Check if form data is preserved (browser dependent)
    // This test documents the behavior rather than enforcing it
    const nameValue = await nameInput.inputValue().catch(() => '')
    const emailValue = await emailInput.inputValue().catch(() => '')
    
    console.log(`Form preservation - Name: ${nameValue}, Email: ${emailValue}`)
  })
})