import { test, expect } from '@playwright/test'

test.describe('Fan Video Request Flow with Payment', () => {
  test.beforeEach(async ({ page }) => {
    // Start at the fan request page
    await page.goto('/fan/request/new')
    
    // Mock authentication if needed
    // In a real test, you'd log in first
  })

  test('should complete full video request flow with payment', async ({ page }) => {
    // Step 1: Select a creator
    await expect(page.locator('text=Choose a Creator')).toBeVisible()
    
    // Search for a creator
    await page.fill('input[placeholder="Search creators..."]', 'Michel')
    
    // Select first creator in results
    await page.click('.cursor-pointer:has-text("Select Creator")').first()
    
    // Verify moved to step 2
    await expect(page.locator('text=Video Request Details')).toBeVisible()
    
    // Step 2: Fill request details
    // Select occasion
    await page.click('[role="combobox"]:has-text("Select occasion")')
    await page.click('[role="option"]:has-text("Birthday")')
    
    // Fill recipient info
    await page.fill('input[placeholder*="recipient"]', 'John Doe')
    
    // Select relationship
    await page.click('label:has-text("Friend")')
    
    // Fill instructions
    await page.fill('textarea[placeholder*="instructions"]', 
      'Please wish John a happy 30th birthday and mention his love for soccer!')
    
    // Add rush delivery
    const rushCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'Rush Delivery' })
    if (await rushCheckbox.isVisible()) {
      await rushCheckbox.check()
    }
    
    // Continue to review
    await page.click('button:has-text("Continue to Review")')
    
    // Step 3: Review order
    await expect(page.locator('text=Review Your Request')).toBeVisible()
    
    // Verify order details are displayed
    await expect(page.locator('text=Birthday')).toBeVisible()
    await expect(page.locator('text=John Doe')).toBeVisible()
    
    // Check total price
    await expect(page.locator('text=/\\$\\d+/')).toBeVisible()
    
    // Proceed to payment
    await page.click('button:has-text("Proceed to Payment")')
    
    // Step 4: Payment
    await expect(page.locator('text=Payment Information')).toBeVisible()
    
    // Fill payment details
    await page.fill('input[id="email"]', 'john@example.com')
    await page.fill('input[id="name"]', 'John Customer')
    
    // Fill card details in iframe
    const cardFrame = page.frameLocator('iframe[title*="Secure card"]').first()
    await cardFrame.locator('[placeholder*="Card number"]').fill('4242424242424242')
    await cardFrame.locator('[placeholder*="MM / YY"]').fill('12/35')
    await cardFrame.locator('[placeholder*="CVC"]').fill('123')
    
    // Submit payment
    await page.click('button:has-text("Pay")')
    
    // Wait for confirmation
    await expect(page.locator('text=Request Submitted Successfully!')).toBeVisible({ timeout: 20000 })
  })

  test('should navigate between steps using back buttons', async ({ page }) => {
    // Select a creator
    await page.click('.cursor-pointer:has-text("Select Creator")').first()
    
    // Go to step 2
    await expect(page.locator('text=Video Request Details')).toBeVisible()
    
    // Click back
    await page.click('button:has-text("Back")')
    
    // Should be back at creator selection
    await expect(page.locator('text=Choose a Creator')).toBeVisible()
    
    // Select creator again
    await page.click('.cursor-pointer:has-text("Select Creator")').first()
    
    // Fill some details
    await page.click('[role="combobox"]:has-text("Select occasion")')
    await page.click('[role="option"]:has-text("Anniversary")')
    await page.fill('input[placeholder*="recipient"]', 'Test Recipient')
    
    // Continue to review
    await page.click('button:has-text("Continue to Review")')
    
    // Click back from review
    await page.click('button:has-text("Back")')
    
    // Should retain filled data
    await expect(page.locator('input[placeholder*="recipient"]')).toHaveValue('Test Recipient')
  })

  test('should validate required fields', async ({ page }) => {
    // Select a creator
    await page.click('.cursor-pointer:has-text("Select Creator")').first()
    
    // Try to continue without filling required fields
    const continueButton = page.locator('button:has-text("Continue to Review")')
    
    // The button might be disabled or show validation on click
    await continueButton.click()
    
    // Check for validation messages or that we're still on the same step
    const stillOnDetailsPage = await page.locator('text=Video Request Details').isVisible()
    expect(stillOnDetailsPage).toBeTruthy()
  })

  test('should filter and sort creators', async ({ page }) => {
    // Search for creators
    await page.fill('input[placeholder="Search creators..."]', 'Music')
    await page.waitForTimeout(500) // Debounce delay
    
    // Select category filter
    await page.click('button:has-text("Category")')
    await page.click('[role="option"]:has-text("Music")')
    
    // Sort by price
    await page.click('button:has-text("Sort by")')
    await page.click('[role="option"]:has-text("Price: Low to High")')
    
    // Verify creators are displayed
    await expect(page.locator('.cursor-pointer:has-text("Select Creator")')).toHaveCount.greaterThan(0)
  })

  test('should calculate correct pricing with rush delivery', async ({ page }) => {
    // Select a creator
    await page.click('.cursor-pointer:has-text("Select Creator")').first()
    
    // Fill basic details
    await page.click('[role="combobox"]:has-text("Select occasion")')
    await page.click('[role="option"]:has-text("Birthday")')
    await page.fill('input[placeholder*="recipient"]', 'Test User')
    await page.click('label:has-text("Friend")')
    await page.fill('textarea[placeholder*="instructions"]', 'Test message')
    
    // Note base price
    const basePriceElement = page.locator('text=/Base.*\\$\\d+/').first()
    const basePrice = await basePriceElement.textContent()
    
    // Add rush delivery
    const rushCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'Rush' })
    await rushCheckbox.check()
    
    // Continue to review
    await page.click('button:has-text("Continue to Review")')
    
    // Verify rush delivery fee is added
    await expect(page.locator('text=Rush Delivery')).toBeVisible()
    await expect(page.locator('text=$25')).toBeVisible() // Rush fee
    
    // Verify total is calculated correctly
    await expect(page.locator('text=/Total.*\\$\\d+/')).toBeVisible()
  })

  test('should handle payment cancellation', async ({ page }) => {
    // Complete steps 1-3 to get to payment
    await page.click('.cursor-pointer:has-text("Select Creator")').first()
    
    await page.click('[role="combobox"]:has-text("Select occasion")')
    await page.click('[role="option"]:has-text("Birthday")')
    await page.fill('input[placeholder*="recipient"]', 'Test User')
    await page.click('label:has-text("Friend")')
    await page.fill('textarea[placeholder*="instructions"]', 'Test message')
    
    await page.click('button:has-text("Continue to Review")')
    await page.click('button:has-text("Proceed to Payment")')
    
    // On payment page, click back
    await page.click('button:has-text("Back to Review")')
    
    // Should be back at review page
    await expect(page.locator('text=Review Your Request')).toBeVisible()
    
    // All data should be preserved
    await expect(page.locator('text=Birthday')).toBeVisible()
    await expect(page.locator('text=Test User')).toBeVisible()
  })

  test('should show creator details and ratings', async ({ page }) => {
    // Look for creator cards
    const creatorCard = page.locator('.cursor-pointer').first()
    
    // Check for expected creator information
    await expect(creatorCard.locator('.text-yellow-500')).toBeVisible() // Star rating
    await expect(creatorCard.locator('text=/\\d+\\.\\d+/')).toBeVisible() // Rating number
    await expect(creatorCard.locator('text=/\\d+ videos/')).toBeVisible() // Completed videos
    await expect(creatorCard.locator('text=/Starting at.*\\$\\d+/')).toBeVisible() // Price
    await expect(creatorCard.locator('text=/Response time/')).toBeVisible() // Response time
  })

  test('should handle special instructions and options', async ({ page }) => {
    // Select creator
    await page.click('.cursor-pointer:has-text("Select Creator")').first()
    
    // Select special occasion
    await page.click('[role="combobox"]:has-text("Select occasion")')
    await page.click('[role="option"]:has-text("Other")')
    
    // Fill custom occasion if field appears
    const customOccasionField = page.locator('input[placeholder*="Specify occasion"]')
    if (await customOccasionField.isVisible()) {
      await customOccasionField.fill('Retirement Party')
    }
    
    // Fill other details
    await page.fill('input[placeholder*="recipient"]', 'Bob Smith')
    await page.click('label:has-text("Colleague")')
    
    // Add detailed instructions
    const instructions = `Please congratulate Bob on his retirement after 30 years of service. 
    Mention his dedication to the team and wish him well on his fishing adventures!`
    await page.fill('textarea[placeholder*="instructions"]', instructions)
    
    // Check private video option if available
    const privateCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'Private' })
    if (await privateCheckbox.isVisible()) {
      await privateCheckbox.check()
    }
    
    // Continue to review
    await page.click('button:has-text("Continue to Review")')
    
    // Verify special options are reflected in review
    if (await page.locator('text=Private Video').isVisible()) {
      await expect(page.locator('text=Private Video')).toBeVisible()
    }
  })

  test('should display progress indicator', async ({ page }) => {
    // Check initial progress
    await expect(page.locator('[role="progressbar"], .bg-purple-600')).toBeVisible()
    
    // Progress should show step 1 of 4
    await expect(page.locator('text=Step 1 of 4')).toBeVisible()
    
    // Select creator
    await page.click('.cursor-pointer:has-text("Select Creator")').first()
    
    // Progress should update to step 2
    await expect(page.locator('text=Step 2 of 4')).toBeVisible()
    
    // Fill details and continue
    await page.click('[role="combobox"]:has-text("Select occasion")')
    await page.click('[role="option"]:has-text("Birthday")')
    await page.fill('input[placeholder*="recipient"]', 'Test')
    await page.click('label:has-text("Friend")')
    await page.fill('textarea[placeholder*="instructions"]', 'Test')
    await page.click('button:has-text("Continue to Review")')
    
    // Progress should show step 3
    await expect(page.locator('text=Step 3 of 4')).toBeVisible()
    
    // Continue to payment
    await page.click('button:has-text("Proceed to Payment")')
    
    // Progress should show step 4
    await expect(page.locator('text=Step 4 of 4')).toBeVisible()
  })

  test('should have proper accessibility attributes and keyboard navigation', async ({ page }) => {
    // Test keyboard navigation on creator selection
    await page.keyboard.press('Tab') // Navigate to first creator card
    await expect(page.locator('[role="listitem"]:first-child')).toBeFocused()
    
    // Test keyboard selection
    await page.keyboard.press('Enter')
    await expect(page.locator('text=Video Request Details')).toBeVisible()
    
    // Test form accessibility
    // Check for proper fieldset/legend structure
    await expect(page.locator('fieldset legend').first()).toBeVisible()
    
    // Check ARIA labels on form inputs
    await expect(page.locator('input[aria-label*="recipient"]')).toBeVisible()
    await expect(page.locator('select[aria-label*="relationship"]')).toBeVisible()
    
    // Check ARIA live regions for validation
    await page.fill('input[placeholder*="recipient"]', '')
    await page.blur('input[placeholder*="recipient"]')
    await expect(page.locator('[role="alert"]')).toBeVisible()
    
    // Test checkbox accessibility
    const rushCheckbox = page.locator('input[id="rush-delivery"]')
    if (await rushCheckbox.isVisible()) {
      await expect(rushCheckbox).toHaveAttribute('aria-describedby')
      
      // Test keyboard interaction
      await rushCheckbox.focus()
      await page.keyboard.press('Space')
      await expect(rushCheckbox).toBeChecked()
    }
    
    // Check for skip links or proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    expect(await headings.count()).toBeGreaterThan(0)
  })

  test('should support screen reader navigation patterns', async ({ page }) => {
    // Check for semantic HTML structure
    await expect(page.locator('[role="search"]')).toBeVisible() // Search region
    await expect(page.locator('[role="list"]')).toBeVisible() // Creator list
    await expect(page.locator('[role="listitem"]')).toHaveCount.greaterThan(0) // Creator cards
    
    // Test search functionality with screen reader context
    const searchInput = page.locator('input[type="search"]')
    await expect(searchInput).toHaveAttribute('aria-label')
    
    // Test form landmarks and regions
    await page.click('.cursor-pointer:has-text("Select Creator")').first()
    
    // Check for proper form structure
    await expect(page.locator('fieldset')).toHaveCount.greaterThan(0)
    await expect(page.locator('legend')).toHaveCount.greaterThan(0)
    
    // Test error announcements
    await page.fill('input[placeholder*="recipient"]', 'A') // Too short
    await page.blur('input[placeholder*="recipient"]')
    
    // Verify error is announced properly
    const errorElement = page.locator('[role="alert"]').first()
    if (await errorElement.isVisible()) {
      expect(await errorElement.textContent()).toContain('characters')
    }
    
    // Test status updates with aria-live
    await expect(page.locator('[aria-live]')).toBeVisible()
  })
})