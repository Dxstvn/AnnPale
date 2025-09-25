import { Page, expect } from '@playwright/test'

// Test user credentials - using the existing account from database
export const TEST_FAN_CREDENTIALS = {
  email: 'testfan@annpale.test',
  password: 'TestPassword123!'
}

export const TEST_CREATOR_ID = 'd963aa48-879d-461c-9df3-7dc557b545f9' // Wyclef Jean for testing

/**
 * Login as a fan user through the UI
 */
export async function loginAsFan(page: Page) {
  console.log('🔐 Logging in as fan...')

  // Navigate to login page
  await page.goto('/login')
  await page.waitForLoadState('domcontentloaded')

  // Fill in credentials
  await page.fill('[data-testid="email-input"]', TEST_FAN_CREDENTIALS.email)
  await page.fill('[data-testid="password-input"]', TEST_FAN_CREDENTIALS.password)

  // Submit the form by clicking the button
  await page.click('[data-testid="login-submit-btn"]')

  // Wait for navigation away from login page
  await page.waitForURL(url => !url.toString().includes('/login'), {
    timeout: 15000
  })

  console.log('✅ Logged in successfully')
}

/**
 * Navigate to browse/explore page and select a creator
 */
export async function selectCreator(page: Page) {
  console.log('🔍 Browsing creators...')

  // Navigate to explore page
  await page.goto('/fan/explore')
  await page.waitForLoadState('domcontentloaded')

  // Wait for creators to load
  await page.waitForSelector('[data-testid="view-creator-profile-btn"]', { timeout: 15000 })

  // Find and click on the first creator with a "View Profile" button
  const viewProfileBtn = page.locator('[data-testid="view-creator-profile-btn"]').first()
  await expect(viewProfileBtn).toBeVisible({ timeout: 10000 })

  // Get creator name for logging if available
  try {
    const creatorCard = viewProfileBtn.locator('xpath=ancestor::div[contains(@class, "rounded-xl")]').first()
    const creatorName = await creatorCard.locator('h3').first().textContent()
    console.log(`📍 Selecting creator: ${creatorName}`)
  } catch (e) {
    console.log('📍 Selecting first available creator')
  }

  await viewProfileBtn.click()

  // Wait for navigation to creator profile
  await page.waitForURL(/\/fan\/creators\//, { timeout: 10000 })

  console.log('✅ Creator profile loaded')
}

/**
 * Subscribe to a creator's tier
 */
export async function subscribeToTier(page: Page) {
  console.log('💳 Starting subscription process...')

  // Based on browser analysis, we need to click "View Subscription Tiers" button first
  const viewTiersButton = page.locator('button:has-text("View Subscription Tiers")')

  if (await viewTiersButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await viewTiersButton.click()
    console.log('📝 Clicked View Subscription Tiers button')

    // Wait for modal to open
    await page.waitForTimeout(500)
  }

  // Now look for the subscribe button in the modal or expanded section
  // The button text is "Subscribe" according to browser analysis
  const subscribeButtons = page.locator('button:has-text("Subscribe")')

  // Wait for at least one subscribe button to be visible
  await expect(subscribeButtons.first()).toBeVisible({ timeout: 10000 })

  const subscribeCount = await subscribeButtons.count()
  console.log(`Found ${subscribeCount} subscribe button(s)`)

  // Get tier info for logging if available
  try {
    // The tier info is in a card structure based on browser analysis
    const firstTierCard = subscribeButtons.first().locator('xpath=ancestor::div[contains(@class, "border")]').first()
    const tierTitle = await firstTierCard.locator('h4, h3').first().textContent()
    const tierPrice = await firstTierCard.locator('text=/\$\d+/').first().textContent()
    console.log(`💎 Selecting tier: ${tierTitle} - ${tierPrice}`)
  } catch (e) {
    console.log('💎 Selecting first available subscription tier')
  }

  // Click the first subscribe button
  await subscribeButtons.first().click()

  // Wait for either checkout page or payment modal
  try {
    await page.waitForURL(/\/checkout|\/payment/, { timeout: 10000 })
    console.log('✅ Redirected to checkout')
  } catch (e) {
    console.log('⚠️ No redirect to checkout, checking for payment modal...')
    // Check if a Stripe iframe appeared
    const stripeFrame = page.frameLocator('iframe[name*="stripe"]')
    if (await stripeFrame.locator('[placeholder="Card number"]').isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Stripe payment form appeared')
    }
  }
}

/**
 * Complete the Stripe checkout process with test card
 */
export async function completeStripeCheckout(page: Page) {
  console.log('💰 Completing checkout...')

  // Wait for Stripe iframe to load
  await page.waitForTimeout(3000) // Give Stripe time to load

  // Find the Stripe iframe
  const stripeFrame = page.frameLocator('iframe[name*="stripe"]').first()

  // Fill in test card details
  await stripeFrame.locator('[placeholder="Card number"]').fill('4242424242424242')
  await stripeFrame.locator('[placeholder="MM / YY"]').fill('12/30')
  await stripeFrame.locator('[placeholder="CVC"]').fill('123')

  // Some forms might have a ZIP field
  const zipField = stripeFrame.locator('[placeholder="ZIP"]')
  if (await zipField.isVisible({ timeout: 1000 }).catch(() => false)) {
    await zipField.fill('10001')
  }

  console.log('📝 Filled payment details')

  // Look for a submit button (might have different text)
  const submitButton = page.locator('button:has-text("Subscribe"), button:has-text("Complete"), button:has-text("Pay")')
  await submitButton.first().click()

  console.log('⏳ Processing payment...')

  // Wait for success (could redirect to various success pages)
  await page.waitForURL(url =>
    url.includes('/success') ||
    url.includes('/confirmation') ||
    url.includes('/fan/settings') ||
    url.includes('/fan/home'),
    { timeout: 30000 }
  )

  console.log('✅ Payment successful!')
}

/**
 * Navigate to subscription management in settings
 */
export async function navigateToSubscriptionManagement(page: Page) {
  console.log('⚙️ Navigating to subscription management...')

  // Go to settings page
  await page.goto('/fan/settings')
  await page.waitForLoadState('domcontentloaded')

  // Click on subscriptions tab
  const subscriptionsTab = page.locator('[data-testid="subscriptions-tab"], button:has-text("Subscriptions")')
  await subscriptionsTab.first().click()

  // Wait for subscriptions to load
  await page.waitForSelector('[data-testid*="subscription-item"], [data-testid="subscription-card"]', {
    timeout: 10000
  })

  console.log('✅ Subscription management loaded')
}

/**
 * Pause a subscription
 */
export async function pauseSubscription(page: Page) {
  console.log('⏸️ Pausing subscription...')

  // Find and click the actions menu
  const actionsMenu = page.locator('[data-testid="subscription-actions-menu"]').first()
  await actionsMenu.click()

  // Click pause option
  const pauseBtn = page.locator('[data-testid="pause-subscription-btn"]')
  await pauseBtn.click()

  // Confirm in dialog
  const confirmBtn = page.locator('[data-testid="dialog-confirm-btn"], [data-testid="confirm-action-btn"]')
  await confirmBtn.click()

  // Wait for status update
  await page.waitForTimeout(2000)

  // Verify status changed
  const statusBadge = page.locator('[data-testid="subscription-status-paused"], [data-testid="subscription-status"]')
  await expect(statusBadge.first()).toContainText(/paused/i)

  console.log('✅ Subscription paused')
}

/**
 * Resume a subscription
 */
export async function resumeSubscription(page: Page) {
  console.log('▶️ Resuming subscription...')

  // Find and click the actions menu
  const actionsMenu = page.locator('[data-testid="subscription-actions-menu"]').first()
  await actionsMenu.click()

  // Click resume option
  const resumeBtn = page.locator('[data-testid="resume-subscription-btn"]')
  await resumeBtn.click()

  // Confirm in dialog
  const confirmBtn = page.locator('[data-testid="dialog-confirm-btn"], [data-testid="confirm-action-btn"]')
  await confirmBtn.click()

  // Wait for status update
  await page.waitForTimeout(2000)

  // Verify status changed
  const statusBadge = page.locator('[data-testid="subscription-status-active"], [data-testid="subscription-status"]')
  await expect(statusBadge.first()).toContainText(/active/i)

  console.log('✅ Subscription resumed')
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(page: Page) {
  console.log('❌ Cancelling subscription...')

  // Find and click the actions menu
  const actionsMenu = page.locator('[data-testid="subscription-actions-menu"]').first()
  await actionsMenu.click()

  // Click cancel option
  const cancelBtn = page.locator('[data-testid="cancel-subscription-btn"]')
  await cancelBtn.click()

  // Confirm in dialog
  const confirmBtn = page.locator('[data-testid="dialog-confirm-btn"], [data-testid="confirm-action-btn"]')
  await confirmBtn.click()

  // Wait for status update
  await page.waitForTimeout(2000)

  // Verify status changed
  const statusBadge = page.locator('[data-testid="subscription-status-cancelled"], [data-testid="subscription-status"]')
  await expect(statusBadge.first()).toContainText(/cancelled/i)

  console.log('✅ Subscription cancelled')
}

/**
 * Update payment method
 */
export async function updatePaymentMethod(page: Page) {
  console.log('💳 Updating payment method...')

  // Find and click the actions menu
  const actionsMenu = page.locator('[data-testid="subscription-actions-menu"]').first()
  await actionsMenu.click()

  // Click update payment method option
  const updateBtn = page.locator('[data-testid="update-payment-btn"]')
  await updateBtn.click()

  // This should redirect to Stripe Customer Portal
  // Wait for the redirect
  await page.waitForTimeout(3000)

  // Check if we're on Stripe's domain
  const currentUrl = page.url()
  if (currentUrl.includes('stripe.com') || currentUrl.includes('checkout.stripe.com')) {
    console.log('✅ Redirected to Stripe Customer Portal')
    // Navigate back for the test
    await page.goBack()
  } else {
    console.log('⚠️ Expected Stripe redirect but stayed on:', currentUrl)
  }
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `e2e/screenshots/${timestamp}-${name}.png`
  await page.screenshot({ path: filename, fullPage: true })
  console.log(`📸 Screenshot saved: ${filename}`)
}