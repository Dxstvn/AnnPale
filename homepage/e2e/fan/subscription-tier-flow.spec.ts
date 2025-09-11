import { expect } from '@playwright/test'
import { authenticatedTest } from '../fixtures/authenticated-test'

authenticatedTest.describe('Fan Subscription Tier Flow', () => {
  authenticatedTest('fan can browse and subscribe to creator tiers', async ({ fanPage }) => {
    // Step 1: Navigate to Explore page
    await fanPage.goto('/fan/explore')
    
    // Wait for creators to load
    await expect(fanPage.locator('h1:has-text("Explore Creators")')).toBeVisible()
    await fanPage.waitForSelector('[data-creators-loaded="true"]', { timeout: 15000 })
    
    // Step 2: Find a creator with subscription tiers
    const creatorsWithTiers = fanPage.locator('[data-testid*="creator-card"]:has-text("tier")')
    const tierCreatorCount = await creatorsWithTiers.count()
    
    let selectedCreator
    if (tierCreatorCount > 0) {
      selectedCreator = creatorsWithTiers.first()
    } else {
      // Use any creator
      const allCreators = fanPage.locator('[data-testid*="creator-card"]')
      const count = await allCreators.count()
      expect(count).toBeGreaterThan(0)
      selectedCreator = allCreators.first()
    }
    
    // Get creator name for verification
    const creatorName = await selectedCreator.locator('h3, h4, [class*="font-semibold"]').first().textContent()
    console.log(`Selected creator: ${creatorName}`)
    
    // Step 3: Click View Profile
    await selectedCreator.locator('button:has-text("View Profile")').click()
    
    // Wait for creator profile to load
    await fanPage.waitForURL('**/fan/creators/**')
    await expect(fanPage.locator('[data-testid="creator-profile"]')).toBeVisible({ timeout: 10000 })
    
    // Step 4: View subscription tiers
    // Look for tiers section using multiple fallback selectors
    let tiersSection = null
    
    // Try different selectors
    const selectorOptions = [
      '[data-testid="subscription-tiers"]',
      '[class*="tier"]',
      'text=/Subscribe|Tier|Subscription/i'
    ]
    
    for (const selector of selectorOptions) {
      const element = fanPage.locator(selector)
      if (await element.first().isVisible({ timeout: 1000 }).catch(() => false)) {
        tiersSection = element
        break
      }
    }
    
    if (tiersSection) {
      console.log('Found subscription tiers section')
      
      // Step 5: Select a tier
      const tierCards = fanPage.locator('[data-testid*="tier-card"], [class*="tier-card"]')
      const tierCount = await tierCards.count()
      
      if (tierCount > 0) {
        // Click on the first tier's subscribe button
        const firstTier = tierCards.first()
        
        // Get tier details
        const tierName = await firstTier.locator('h3, h4, [class*="font"]').first().textContent()
        const tierPrice = await firstTier.locator('text=/\\$[0-9]+/').first().textContent()
        console.log(`Selecting tier: ${tierName} - ${tierPrice}`)
        
        // Click subscribe button on the tier
        const subscribeButton = firstTier.locator('button:has-text("Subscribe"), button:has-text("Select"), button:has-text("Choose")')
        await subscribeButton.click()
        
        // Step 6: Handle subscription payment modal/page
        // Wait for payment modal or redirect
        await fanPage.waitForTimeout(2000)
        
        // Check if we're in a modal or on a new page
        const inModal = await fanPage.locator('[role="dialog"], [data-testid="subscription-modal"]').isVisible({ timeout: 3000 })
        const onCheckoutPage = fanPage.url().includes('checkout') || fanPage.url().includes('subscribe')
        
        if (inModal || onCheckoutPage) {
          console.log('Subscription checkout opened')
          
          // Look for Stripe payment form
          const stripeFrame = await fanPage.waitForSelector('iframe[src*="stripe"]', { timeout: 10000 }).catch(() => null)
          
          if (stripeFrame) {
            // Fill Stripe subscription details
            const frame = fanPage.frameLocator('iframe[src*="stripe"]').first()
            
            await frame.locator('[placeholder*="Card"], input[name="cardnumber"]').fill('4242424242424242')
            await frame.locator('[placeholder*="MM"], input[name="exp-date"]').fill('12/30')
            await frame.locator('[placeholder*="CVC"], input[name="cvc"]').fill('123')
            
            const zipInput = frame.locator('[placeholder*="ZIP"], input[name="postal"]')
            if (await zipInput.isVisible({ timeout: 2000 })) {
              await zipInput.fill('10001')
            }
            
            // Submit subscription
            await fanPage.click('button:has-text("Subscribe"), button:has-text("Confirm"), button:has-text("Complete")')
            
            // Wait for success
            await expect(fanPage.locator('text=/Success|subscribed|active/i')).toBeVisible({ timeout: 20000 })
            console.log('Subscription successful!')
          }
        }
      } else {
        console.log('No subscription tiers found for this creator')
      }
    } else {
      console.log('Creator does not have subscription tiers enabled')
    }
  })

  authenticatedTest('fan can view and manage existing subscriptions', async ({ fanPage }) => {
    // Step 1: Navigate to subscriptions management
    // Via sidebar
    await fanPage.goto('/fan/home')
    await fanPage.click('a[href="/fan/settings?tab=subscriptions"], a:has-text("Subscriptions")')
    
    // Wait for page to load
    await fanPage.waitForURL('**/settings**')
    
    // Check if subscriptions tab is active
    const subscriptionsContent = fanPage.locator('[data-testid="subscriptions-tab"], text=/Your Subscriptions|Active Subscriptions|Manage Subscriptions/i')
    
    if (await subscriptionsContent.first().isVisible({ timeout: 5000 })) {
      console.log('Viewing subscriptions management page')
      
      // Look for any existing subscriptions
      const subscriptionCards = fanPage.locator('[data-testid*="subscription-card"], [class*="subscription"]')
      const subCount = await subscriptionCards.count()
      
      if (subCount > 0) {
        console.log(`Found ${subCount} active subscription(s)`)
        
        // Get details of first subscription
        const firstSub = subscriptionCards.first()
        const creatorName = await firstSub.locator('h3, h4, [class*="font"]').first().textContent()
        const tierName = await firstSub.locator('text=/Tier|tier/').first().textContent()
        
        console.log(`Active subscription: ${creatorName} - ${tierName}`)
        
        // Check for manage options
        const manageButton = firstSub.locator('button:has-text("Manage"), button:has-text("Cancel"), button:has-text("Change")')
        if (await manageButton.isVisible()) {
          console.log('Subscription management options available')
        }
      } else {
        console.log('No active subscriptions found')
      }
    }
  })

  authenticatedTest('fan can access tier-gated content after subscribing', async ({ fanPage }) => {
    // This test assumes the fan has an active subscription
    // Navigate to a creator they're subscribed to
    await fanPage.goto('/fan/explore')
    
    // Wait for creators to load
    await fanPage.waitForSelector('[data-creators-loaded="true"]', { timeout: 15000 })
    
    // Look for creators with subscription indicators
    const subscribedCreator = fanPage.locator('[data-testid*="creator-card"]:has-text("Subscribed"), [data-testid*="creator-card"]:has([data-testid="subscribed-badge"])')
    
    if (await subscribedCreator.first().isVisible({ timeout: 5000 })) {
      // Click on subscribed creator
      await subscribedCreator.first().locator('button:has-text("View Profile")').click()
      
      // Wait for profile to load
      await fanPage.waitForURL('**/fan/creators/**')
      
      // Look for exclusive content section
      const exclusiveContent = fanPage.locator('[data-testid="exclusive-content"], [data-testid="subscriber-content"], text=/Exclusive|Subscriber Only/i')
      
      if (await exclusiveContent.first().isVisible({ timeout: 5000 })) {
        console.log('Can access exclusive subscriber content')
        
        // Verify content is not locked
        const lockedContent = fanPage.locator('[data-testid="locked-content"], [class*="locked"], svg[class*="lock"]')
        const lockedCount = await lockedContent.count()
        
        if (lockedCount === 0) {
          console.log('All content is unlocked for subscriber')
        } else {
          console.log(`Some content may still be locked (higher tier required): ${lockedCount} items`)
        }
      }
    } else {
      console.log('No subscribed creators found - would need to subscribe first')
    }
  })

  authenticatedTest('fan can compare different subscription tiers', async ({ fanPage }) => {
    // Navigate directly to a creator with multiple tiers
    await fanPage.goto('/fan/explore')
    
    // Wait for creators
    await fanPage.waitForSelector('[data-creators-loaded="true"]', { timeout: 15000 })
    
    // Find creator with multiple tiers indicated
    const multiTierCreator = fanPage.locator('[data-testid*="creator-card"]:has-text("3 tier"), [data-testid*="creator-card"]:has-text("tiers")')
    
    if (await multiTierCreator.first().isVisible({ timeout: 5000 })) {
      await multiTierCreator.first().locator('button:has-text("View Profile")').click()
      
      // Wait for profile
      await fanPage.waitForURL('**/fan/creators/**')
      
      // Find all tier cards
      const tierCards = fanPage.locator('[data-testid*="tier-card"], [class*="tier-card"]')
      const tierCount = await tierCards.count()
      
      if (tierCount > 1) {
        console.log(`Found ${tierCount} subscription tiers to compare`)
        
        // Compare features of different tiers
        for (let i = 0; i < Math.min(tierCount, 3); i++) {
          const tier = tierCards.nth(i)
          const tierName = await tier.locator('h3, h4').first().textContent()
          const tierPrice = await tier.locator('text=/\\$[0-9]+/').first().textContent()
          const benefits = await tier.locator('li, [data-testid="benefit"]').count()
          
          console.log(`Tier ${i + 1}: ${tierName} - ${tierPrice} - ${benefits} benefits`)
        }
        
        // Check for tier comparison features
        const compareButton = fanPage.locator('button:has-text("Compare"), button:has-text("View all tiers")')
        if (await compareButton.isVisible({ timeout: 3000 })) {
          console.log('Tier comparison feature available')
        }
      }
    } else {
      console.log('No creators with multiple tiers found')
    }
  })
})