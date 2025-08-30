import { authenticatedTest, expect } from '../fixtures/authenticated-test'

authenticatedTest.describe('Creator Navigation', () => {
  authenticatedTest('all creator menu items navigate correctly', async ({ creatorPage }) => {
    // Go to landing page
    await creatorPage.goto('/')
    
    // Wait for page to load
    await creatorPage.waitForLoadState('networkidle')
    
    // Open user dropdown menu
    await creatorPage.click('[data-testid="user-menu-trigger"]')
    
    // Wait for dropdown to be visible
    await creatorPage.waitForSelector('[data-testid="creator-dashboard-link"]', { state: 'visible' })
    
    // Test navigation items
    const navigationTests = [
      { 
        testId: 'creator-dashboard-link', 
        url: '/creator/dashboard', 
        title: /Dashboard|Creator/i 
      },
      { 
        testId: 'my-videos-link', 
        url: '/creator/content', 
        title: /Videos|Content/i 
      },
      { 
        testId: 'analytics-link', 
        url: '/creator/analytics', 
        title: /Analytics/i 
      },
      { 
        testId: 'earnings-link', 
        url: '/creator/finances', 
        title: /Earnings|Finance/i 
      },
      { 
        testId: 'settings-link', 
        url: '/creator/settings', 
        title: /Settings/i 
      }
    ]
    
    for (const navTest of navigationTests) {
      // Open dropdown if not visible
      const dropdownVisible = await creatorPage.locator(`[data-testid="${navTest.testId}"]`).isVisible()
      if (!dropdownVisible) {
        await creatorPage.click('[data-testid="user-menu-trigger"]')
        await creatorPage.waitForSelector(`[data-testid="${navTest.testId}"]`, { state: 'visible' })
      }
      
      // Click the navigation item
      await creatorPage.click(`[data-testid="${navTest.testId}"]`)
      
      // Wait for navigation
      await creatorPage.waitForURL(navTest.url, { timeout: 10000 })
      
      // Verify we're on the correct page
      await expect(creatorPage).toHaveURL(navTest.url)
      
      // Verify page loaded (check for heading or main content)
      const pageHeading = creatorPage.locator('h1, h2, [role="heading"]').first()
      await expect(pageHeading).toBeVisible()
      
      // Return to landing page for next test
      await creatorPage.goto('/')
      await creatorPage.waitForLoadState('networkidle')
    }
  })

  authenticatedTest('logout functionality works correctly', async ({ creatorPage }) => {
    // Go to landing page
    await creatorPage.goto('/')
    
    // Open user dropdown
    await creatorPage.click('[data-testid="user-menu-trigger"]')
    
    // Wait for logout button to be visible
    await creatorPage.waitForSelector('[data-testid="logout-button"]', { state: 'visible' })
    
    // Click logout
    await creatorPage.click('[data-testid="logout-button"]')
    
    // Should redirect to home or login page
    await creatorPage.waitForURL(/\/(login|$)/, { timeout: 10000 })
    
    // Verify logged out by trying to access protected route
    await creatorPage.goto('/creator/dashboard')
    
    // Should redirect to login
    await expect(creatorPage).toHaveURL('/login')
  })

  authenticatedTest('user menu displays creator badge', async ({ creatorPage }) => {
    // Go to landing page
    await creatorPage.goto('/')
    
    // Check if creator badge is visible
    const creatorBadge = creatorPage.locator('[data-testid="user-menu-trigger"]').locator('text=Creator')
    const badgeVisible = await creatorBadge.isVisible().catch(() => false)
    
    // Creator badge should be visible for creator users
    expect(badgeVisible).toBe(true)
  })

  authenticatedTest('dropdown menu items have correct icons', async ({ creatorPage }) => {
    // Go to landing page
    await creatorPage.goto('/')
    
    // Open user dropdown
    await creatorPage.click('[data-testid="user-menu-trigger"]')
    
    // Wait for dropdown to be visible
    await creatorPage.waitForSelector('[data-testid="creator-dashboard-link"]', { state: 'visible' })
    
    // Check that each menu item has an icon (svg element)
    const menuItems = [
      'creator-dashboard-link',
      'my-videos-link',
      'analytics-link',
      'earnings-link',
      'settings-link'
    ]
    
    for (const itemId of menuItems) {
      const menuItem = creatorPage.locator(`[data-testid="${itemId}"]`)
      const icon = menuItem.locator('svg')
      await expect(icon).toBeVisible()
    }
  })
})

authenticatedTest.describe('Landing Page Dropdown Verification', () => {
  authenticatedTest('dropdown menu items exist and are clickable', async ({ creatorPage }) => {
    // Go to landing page
    await creatorPage.goto('/')
    
    // Open user dropdown
    await creatorPage.click('[data-testid="user-menu-trigger"]')
    
    // Verify all expected menu items exist
    const expectedItems = [
      { testId: 'creator-dashboard-link', text: 'Creator Dashboard' },
      { testId: 'my-videos-link', text: 'My Videos' },
      { testId: 'analytics-link', text: 'Analytics' },
      { testId: 'earnings-link', text: 'Earnings' },
      { testId: 'settings-link', text: 'Settings' },
      { testId: 'logout-button', text: 'Log Out' }
    ]
    
    for (const item of expectedItems) {
      const element = creatorPage.locator(`[data-testid="${item.testId}"]`)
      
      // Verify element exists and is visible
      await expect(element).toBeVisible()
      
      // Verify text content
      await expect(element).toContainText(item.text)
      
      // Verify element is clickable (not disabled)
      const isDisabled = await element.evaluate(el => 
        el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true'
      )
      expect(isDisabled).toBe(false)
    }
  })

  authenticatedTest('finances link redirects to earnings page', async ({ creatorPage }) => {
    // Go to landing page
    await creatorPage.goto('/')
    
    // Open user dropdown
    await creatorPage.click('[data-testid="user-menu-trigger"]')
    
    // Click earnings link
    await creatorPage.click('[data-testid="earnings-link"]')
    
    // Should navigate to either /creator/finances or /creator/earnings
    await creatorPage.waitForURL(/\/creator\/(finances|earnings)/, { timeout: 10000 })
    
    // Verify we're on a valid earnings/finances page
    const url = creatorPage.url()
    expect(url).toMatch(/\/creator\/(finances|earnings)/)
  })
})