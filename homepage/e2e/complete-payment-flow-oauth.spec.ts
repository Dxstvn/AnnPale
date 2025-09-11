import { test, expect, Page } from '@playwright/test'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

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

async function handleTwitterOAuth(page: Page) {
  console.log('Handling Twitter OAuth flow...')
  
  const username = process.env.TWITTER_USERNAME
  const password = process.env.TWITTER_PASSWORD

  if (!username || !password) {
    throw new Error('Twitter credentials not found in environment variables')
  }

  try {
    // Wait for Twitter OAuth page to load
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 })
    console.log('Twitter OAuth page loaded, current URL:', page.url())
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'twitter-oauth-debug.png' })
    
    // Wait a moment for page to fully render
    await page.waitForTimeout(2000)
    
    // Check if we're on the authorization page (user already logged in)
    // First, let's debug what's actually on the page
    console.log('Analyzing page content for authorization buttons...')
    
    // Log all visible buttons on the page for debugging
    try {
      const allButtons = await page.locator('button, input[type="submit"], input[type="button"], [role="button"]').all()
      console.log(`Found ${allButtons.length} button-like elements on page`)
      
      for (let i = 0; i < Math.min(allButtons.length, 10); i++) { // Limit to first 10
        const buttonText = await allButtons[i].textContent().catch(() => 'N/A')
        const buttonType = await allButtons[i].getAttribute('type').catch(() => 'N/A')
        const buttonValue = await allButtons[i].getAttribute('value').catch(() => 'N/A')
        const buttonDataTestId = await allButtons[i].getAttribute('data-testid').catch(() => 'N/A')
        console.log(`Button ${i}: text="${buttonText}", type="${buttonType}", value="${buttonValue}", data-testid="${buttonDataTestId}"`)
      }
    } catch (e) {
      console.log('Could not analyze buttons:', e.message)
    }
    
    // Try multiple selectors for the authorization button - updated with X-specific text
    const possibleButtons = [
      'button:has-text("Sign in to X")',
      'input[value="Sign in to X"]',
      'button:has-text("Sign In")',
      'button:has-text("Authorize")', 
      'input[value="Authorize"]',
      'button:has-text("Allow")',
      'input[type="submit"]',
      '[data-testid="OAuth_Consent_Button"]',
      // More generic fallbacks
      'button[type="submit"]',
      '[role="button"]:has-text("Sign")',
      '[role="button"]:has-text("Authorize")'
    ]
    
    console.log('Looking for authorization button...')
    let buttonFound = false
    
    for (const selector of possibleButtons) {
      try {
        const button = page.locator(selector).first()
        if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log(`Found authorization button with selector: ${selector}`)
          const buttonText = await button.textContent().catch(() => 'No text')
          console.log(`Button text: "${buttonText}"`)
          
          // Scroll to button and ensure it's in view
          await button.scrollIntoViewIfNeeded()
          await page.waitForTimeout(500) // Brief pause
          
          await button.click()
          buttonFound = true
          console.log('Authorization button clicked!')
          break
        }
      } catch (e) {
        console.log(`Selector "${selector}" failed:`, e.message)
      }
    }
    
    if (buttonFound) {
      console.log('Authorization button clicked, checking what happens next...')
      // Don't return immediately - we need to check if we're redirected to login form
      await page.waitForTimeout(3000) // Wait for any redirects
      
      // Check current URL to see where we ended up
      const currentUrl = page.url()
      console.log('After clicking authorization button, current URL:', currentUrl)
      
      // If we're back to our app callback, we're done
      if (currentUrl.includes('localhost:3000') && (currentUrl.includes('/auth/callback') || !currentUrl.includes('/login'))) {
        console.log('Authorization completed successfully, back to our app')
        return
      }
      
      // Otherwise, continue with credential flow below
      console.log('Need to continue with credential input...')
    }
    
    console.log('Checking for login form...')
    
    // Wait for page to load after clicking sign in button
    await page.waitForTimeout(2000)
    console.log('Current page URL after authorization click:', page.url())
    
    // Check if we're now on a login form (username/password entry)
    // First, look for username field with multiple selectors
    const usernameSelectors = [
      'input[name="text"]',
      'input[name="session[username_or_email]"]', 
      'input[autocomplete="username"]',
      'input[placeholder*="username"]',
      'input[placeholder*="email"]',
      'input[type="text"]'
    ]
    
    let usernameInput = null
    for (const selector of usernameSelectors) {
      const input = page.locator(selector).first()
      if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`Found username input with selector: ${selector}`)
        usernameInput = input
        break
      }
    }
    
    if (usernameInput) {
      console.log('Entering username...')
      await usernameInput.clear()
      await usernameInput.fill(username)
      
      // Look for and click next button
      const nextSelectors = [
        'button:has-text("Next")',
        'div[role="button"]:has-text("Next")',
        'input[type="submit"]',
        'button[type="submit"]'
      ]
      
      let nextClicked = false
      for (const selector of nextSelectors) {
        const button = page.locator(selector).first()
        if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log(`Clicking next button with selector: ${selector}`)
          await button.click()
          nextClicked = true
          break
        }
      }
      
      if (!nextClicked) {
        console.log('No next button found, pressing Enter')
        await usernameInput.press('Enter')
      }
      
      await page.waitForTimeout(2000) // Wait for navigation
    }

    // Now look for password field
    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]', 
      'input[autocomplete="current-password"]',
      'input[placeholder*="password"]'
    ]
    
    let passwordInput = null
    for (const selector of passwordSelectors) {
      const input = page.locator(selector).first()
      if (await input.isVisible({ timeout: 10000 }).catch(() => false)) {
        console.log(`Found password input with selector: ${selector}`)
        passwordInput = input
        break
      }
    }
    
    if (passwordInput) {
      console.log('Entering password...')
      await passwordInput.clear()
      await passwordInput.fill(password)

      // Look for and click login button
      const loginSelectors = [
        'button:has-text("Log in")',
        'div[role="button"]:has-text("Log in")',
        'input[type="submit"]',
        'button[type="submit"]',
        'input[value*="Log in"]'
      ]
      
      let loginClicked = false
      for (const selector of loginSelectors) {
        const button = page.locator(selector).first()
        if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log(`Clicking login button with selector: ${selector}`)
          await button.click()
          loginClicked = true
          break
        }
      }
      
      if (!loginClicked) {
        console.log('No login button found, pressing Enter')
        await passwordInput.press('Enter')
      }

      console.log('Credentials submitted, waiting for authorization...')
      await page.waitForTimeout(3000) // Wait for login to process
    } else {
      console.log('No password field found - might already be logged in or different flow')
    }

    // Wait for authorization page after login
    try {
      // Check if we need to authorize the app
      const postLoginAuthorizeButton = page.locator('button:has-text("Sign In"), button:has-text("Authorize"), input[value="Authorize"], button:has-text("Allow")')
      if (await postLoginAuthorizeButton.isVisible({ timeout: 10000 }).catch(() => false)) {
        console.log('Clicking authorize button after login...')
        await postLoginAuthorizeButton.click()
      }
    } catch (e) {
      console.log('No authorization button found after login, might be auto-authorized')
    }
  } catch (error) {
    console.error('Error during Twitter OAuth:', error)
    await page.screenshot({ path: 'twitter-oauth-error.png' })
    throw error
  }
}

test.describe('Complete Payment Flow with OAuth E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies()
  })

  test('complete flow: login via OAuth → explore → select creator → book video → pay', async ({ page, context }) => {
    // Step 1: Start from login page
    console.log('Step 1: Navigating to login page...')
    await page.goto('http://localhost:3000/login')
    await page.waitForLoadState('networkidle')

    // Step 2: Login via Twitter OAuth
    console.log('Step 2: Starting Twitter OAuth login...')
    const twitterButton = page.locator('button:has-text("X")').or(
      page.locator('button:has-text("Twitter")')
    )
    
    await expect(twitterButton).toBeVisible({ timeout: 10000 })
    console.log('Twitter/X button found, clicking...')
    
    // Start waiting for popup/redirect before clicking
    const [oauthPage] = await Promise.all([
      context.waitForEvent('page').catch(() => null), // Wait for new page/popup
      twitterButton.click()
    ])

    // If OAuth opened in a new window/tab
    if (oauthPage && oauthPage.url() !== page.url()) {
      console.log('OAuth opened in new window, URL:', oauthPage.url())
      
      // Handle Twitter OAuth flow
      await handleTwitterOAuth(oauthPage)
      
      // Wait for callback
      console.log('Waiting for OAuth callback...')
      await page.waitForURL('**/auth/callback**', { timeout: 30000 }).catch(() => {
        console.log('OAuth callback URL not detected, checking if already redirected...')
      })
    } else {
      // OAuth in same window
      console.log('OAuth in same window, current URL:', page.url())
      
      // Check if we're redirected to Twitter
      if (page.url().includes('twitter.com') || page.url().includes('x.com')) {
        await handleTwitterOAuth(page)
      }
      
      // Wait for callback
      console.log('Waiting for OAuth callback...')
      await page.waitForURL('**/auth/callback**', { timeout: 30000 }).catch(() => {
        console.log('OAuth callback URL not detected, checking if already redirected...')
      })
    }

    // Wait for any redirect after OAuth
    await page.waitForTimeout(3000)
    console.log('OAuth complete, current URL:', page.url())

    // Step 3: Navigate to Explore tab
    console.log('Step 3: Navigating to Explore tab...')
    
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

    // Step 4: Find and select Wyclef Jean from the creator list
    console.log('Step 4: Finding Wyclef Jean in creator list...')
    
    // Wait for creator cards to load - use more specific selectors based on the actual page
    await page.waitForSelector('text="18 Creators Found", button:has-text("View Profile"), .grid', { timeout: 10000 })
    
    // Look for Wyclef Jean by name - he might be displayed as "Wyclef Jean" text
    // First, let's see what creators are actually available
    const creatorNames = await page.locator('text=/Carel|CaRiMi|DJ|Wyclef/').all()
    console.log(`Found ${creatorNames.length} potential creator name elements`)
    
    // Try to find Wyclef Jean's card by looking for his name or ID
    // Since we're testing with ID "1", look for any creator card container
    const creatorCard = page.locator(`
      :has-text("${TEST_CREATOR.displayName}"),
      :has-text("Wyclef"),
      div:has(button:has-text("View Profile")):has-text("Wyclef")
    `).first()
    
    // If Wyclef Jean is not found, let's use the first available creator for testing
    const fallbackCard = page.locator('button:has-text("View Profile")').first()
    
    let selectedCard = null
    if (await creatorCard.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Found Wyclef Jean card')
      selectedCard = creatorCard
    } else {
      console.log('Wyclef Jean not found, using first available creator for testing')
      selectedCard = fallbackCard
    }
    
    // Scroll to the selected card if needed
    await selectedCard.scrollIntoViewIfNeeded()
    
    // Click on "View Profile" button to go to creator profile
    console.log('Clicking View Profile button...')
    if (selectedCard === fallbackCard) {
      // If using fallback, just click the View Profile button
      await selectedCard.click()
    } else {
      // Look for View Profile button within the selected creator's card
      const viewProfileButton = selectedCard.locator('button:has-text("View Profile")').first()
      await viewProfileButton.click()
    }
    
    await page.waitForLoadState('networkidle')
    console.log('Navigated to creator profile page')
    
    // On the profile page, look for Book Video button
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
    
    // Step 5c: Gift Options step (skip)
    if (await page.locator('text="Is this a gift?"').isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Skipping gift options...')
      await page.click('button:has-text("Next"), button:has-text("Continue")')
      await page.waitForTimeout(1000)
    }
    
    // Step 5d: Delivery step (skip)
    if (await page.locator('text="When do you need this?"').isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Skipping delivery options...')
      await page.click('button:has-text("Next"), button:has-text("Continue")')
      await page.waitForTimeout(1000)
    }
    
    // Step 6: Payment step
    console.log('Step 6: Entering payment information...')
    await page.waitForSelector('text="Payment", text="Complete your booking", text="Order Summary"', { timeout: 10000 })
    
    // Wait for Stripe iframe
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
      
      // Fill card details
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
    console.log('Full flow: Login → OAuth → Explore → Select Creator → Book Video → Payment → Success')
  })
})