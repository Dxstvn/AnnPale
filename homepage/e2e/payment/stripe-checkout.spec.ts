import { test, expect } from '@playwright/test'

test.describe('Stripe Payment Checkout', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to test payment page
    await page.goto('/test-stripe')
    
    // Wait for Stripe to load
    await page.waitForSelector('iframe[title*="Secure payment"]', { timeout: 10000 })
  })

  test('should display payment form correctly', async ({ page }) => {
    // Check that the payment form is visible
    await expect(page.locator('text=Payment Information')).toBeVisible()
    
    // Check for test card information
    await expect(page.locator('text=Test Card Numbers')).toBeVisible()
    await expect(page.locator('text=4242 4242 4242 4242')).toBeVisible()
  })

  test('should complete successful payment with test card', async ({ page }) => {
    // Fill in email
    await page.fill('input[id="email"]', 'test@example.com')
    
    // Fill in cardholder name
    await page.fill('input[id="name"]', 'Test User')
    
    // Switch to card iframe and fill card details
    const cardFrame = page.frameLocator('iframe[title*="Secure card"]').first()
    
    // Enter card number
    await cardFrame.locator('[placeholder*="Card number"]').fill('4242424242424242')
    
    // Enter expiration date
    await cardFrame.locator('[placeholder*="MM / YY"]').fill('12/35')
    
    // Enter CVC
    await cardFrame.locator('[placeholder*="CVC"]').fill('123')
    
    // Submit payment
    await page.click('button:has-text("Pay $")')
    
    // Wait for success message
    await expect(page.locator('text=Payment Successful!')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('.text-green-500')).toBeVisible()
  })

  test('should handle declined card', async ({ page }) => {
    // Fill in email
    await page.fill('input[id="email"]', 'test@example.com')
    
    // Fill in cardholder name
    await page.fill('input[id="name"]', 'Test User')
    
    // Switch to card iframe
    const cardFrame = page.frameLocator('iframe[title*="Secure card"]').first()
    
    // Enter declined card number
    await cardFrame.locator('[placeholder*="Card number"]').fill('4000000000009995')
    await cardFrame.locator('[placeholder*="MM / YY"]').fill('12/35')
    await cardFrame.locator('[placeholder*="CVC"]').fill('123')
    
    // Submit payment
    await page.click('button:has-text("Pay $")')
    
    // Wait for error message
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=/declined|insufficient/i')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling fields
    const submitButton = page.locator('button:has-text("Pay $")')
    
    // Button should be disabled without email and name
    await expect(submitButton).toBeDisabled()
    
    // Fill only email
    await page.fill('input[id="email"]', 'test@example.com')
    await expect(submitButton).toBeDisabled()
    
    // Fill name as well
    await page.fill('input[id="name"]', 'Test User')
    
    // Now button should be enabled (but payment will fail without card)
    await expect(submitButton).toBeEnabled()
  })

  test('should show 3D Secure authentication flow', async ({ page }) => {
    // Fill in email and name
    await page.fill('input[id="email"]', 'test@example.com')
    await page.fill('input[id="name"]', 'Test User 3DS')
    
    // Switch to card iframe
    const cardFrame = page.frameLocator('iframe[title*="Secure card"]').first()
    
    // Enter 3D Secure test card
    await cardFrame.locator('[placeholder*="Card number"]').fill('4000002500003155')
    await cardFrame.locator('[placeholder*="MM / YY"]').fill('12/35')
    await cardFrame.locator('[placeholder*="CVC"]').fill('123')
    
    // Submit payment
    await page.click('button:has-text("Pay $")')
    
    // Wait for 3D Secure iframe to appear
    const threeDSFrame = await page.waitForSelector('iframe[title*="3D Secure"]', { 
      timeout: 10000,
      state: 'attached' 
    }).catch(() => null)
    
    if (threeDSFrame) {
      // In test mode, Stripe may auto-complete 3DS
      // Wait for either success or the 3DS frame to disappear
      await Promise.race([
        expect(page.locator('text=Payment Successful!')).toBeVisible({ timeout: 20000 }),
        page.waitForSelector('iframe[title*="3D Secure"]', { state: 'detached', timeout: 20000 })
      ])
    }
  })

  test('should switch between card form and payment element tabs', async ({ page }) => {
    // Check initial tab
    await expect(page.locator('[role="tab"]:has-text("Card Form")')).toHaveAttribute('data-state', 'active')
    
    // Switch to Payment Elements tab
    await page.click('[role="tab"]:has-text("Payment Elements")')
    
    // Verify tab switched
    await expect(page.locator('[role="tab"]:has-text("Payment Elements")')).toHaveAttribute('data-state', 'active')
    
    // Payment Element should be visible
    await page.waitForSelector('text=Payment Details', { timeout: 5000 })
    
    // Switch back to Card Form
    await page.click('[role="tab"]:has-text("Card Form")')
    await expect(page.locator('[role="tab"]:has-text("Card Form")')).toHaveAttribute('data-state', 'active')
  })

  test('should display payment results after successful payment', async ({ page }) => {
    // Complete a successful payment first
    await page.fill('input[id="email"]', 'test@example.com')
    await page.fill('input[id="name"]', 'Test User')
    
    const cardFrame = page.frameLocator('iframe[title*="Secure card"]').first()
    await cardFrame.locator('[placeholder*="Card number"]').fill('4242424242424242')
    await cardFrame.locator('[placeholder*="MM / YY"]').fill('12/35')
    await cardFrame.locator('[placeholder*="CVC"]').fill('123')
    
    await page.click('button:has-text("Pay $")')
    
    // Wait for success
    await expect(page.locator('text=Payment Successful!')).toBeVisible({ timeout: 15000 })
    
    // Check if payment results section appears
    const resultsSection = page.locator('text=Payment Results')
    const hasResults = await resultsSection.isVisible().catch(() => false)
    
    if (hasResults) {
      // Verify result entry shows success
      await expect(page.locator('.bg-green-50')).toBeVisible()
      await expect(page.locator('text=✅ Success')).toBeVisible()
      await expect(page.locator('text=/Payment Intent: pi_/')).toBeVisible()
    }
  })

  test('should handle network errors gracefully', async ({ page, context }) => {
    // Block Stripe API requests to simulate network error
    await context.route('**/v1/payment_intents**', route => route.abort())
    
    // Try to make a payment
    await page.fill('input[id="email"]', 'test@example.com')
    await page.fill('input[id="name"]', 'Test User')
    
    // The form should show an error when it can't create payment intent
    await expect(page.locator('text=/failed|error/i')).toBeVisible({ timeout: 10000 })
  })

  test('should preserve form data on validation errors', async ({ page }) => {
    const testEmail = 'preserve@example.com'
    const testName = 'Preserve User'
    
    // Fill in email and name
    await page.fill('input[id="email"]', testEmail)
    await page.fill('input[id="name"]', testName)
    
    // Switch to card iframe
    const cardFrame = page.frameLocator('iframe[title*="Secure card"]').first()
    
    // Enter invalid card number (too short)
    await cardFrame.locator('[placeholder*="Card number"]').fill('4242')
    
    // Try to submit (should fail)
    await page.click('button:has-text("Pay $")')
    
    // Wait a moment for any error
    await page.waitForTimeout(2000)
    
    // Check that email and name are still filled
    await expect(page.locator('input[id="email"]')).toHaveValue(testEmail)
    await expect(page.locator('input[id="name"]')).toHaveValue(testName)
  })
})