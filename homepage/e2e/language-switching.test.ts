import { test, expect } from '@playwright/test'

test.describe('Language Switching', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the default language (English) on initial load', async ({ page }) => {
    // Check that the page loads with English content
    await expect(page).toHaveURL(/\/en/)
    await expect(page.locator('h1')).toContainText('Connect with your favorite Haitian creators')

    // Check that the language switcher shows English as selected
    await expect(page.locator('[data-testid="language-switcher"]')).toContainText('English')
  })

  test('should switch to French when French is selected', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Click the language switcher
    await page.click('[data-testid="language-switcher"], button:has-text("English")')

    // Select French
    await page.click('text=Français')

    // Wait for navigation and content to load
    await page.waitForLoadState('networkidle')

    // Check that URL changed to French
    await expect(page).toHaveURL(/\/fr/)

    // Check that content is now in French
    await expect(page.locator('h1')).toContainText('Connectez-vous avec vos créateurs haïtiens préférés')

    // Check that language switcher shows French as selected
    await expect(page.locator('button')).toContainText('Français')
  })

  test('should switch to Haitian Creole when Kreyòl is selected', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Click the language switcher
    await page.click('[data-testid="language-switcher"], button:has-text("English")')

    // Select Haitian Creole
    await page.click('text=Kreyòl')

    // Wait for navigation and content to load
    await page.waitForLoadState('networkidle')

    // Check that URL changed to Haitian Creole
    await expect(page).toHaveURL(/\/ht/)

    // Check that content is now in Haitian Creole
    await expect(page.locator('h1')).toContainText('Konekte ak kreyatè ayisyen yo ou renmen yo')

    // Check that language switcher shows Kreyòl as selected
    await expect(page.locator('button')).toContainText('Kreyòl')
  })

  test('should maintain language preference when navigating between pages', async ({ page }) => {
    // Switch to French first
    await page.click('button:has-text("English")')
    await page.click('text=Français')
    await page.waitForLoadState('networkidle')

    // Navigate to browse page
    await page.click('a[href*="browse"], text=Parcourir')
    await page.waitForLoadState('networkidle')

    // Check that we're still in French
    await expect(page).toHaveURL(/\/fr\/browse/)

    // Navigate back to home
    await page.click('a[href="/"], text=Accueil')
    await page.waitForLoadState('networkidle')

    // Check that we're still in French
    await expect(page).toHaveURL(/\/fr/)
    await expect(page.locator('h1')).toContainText('Connectez-vous avec vos créateurs haïtiens préférés')
  })

  test('should persist language preference across browser sessions', async ({ page, context }) => {
    // Switch to French
    await page.click('button:has-text("English")')
    await page.click('text=Français')
    await page.waitForLoadState('networkidle')

    // Close the page and open a new one
    await page.close()
    const newPage = await context.newPage()
    await newPage.goto('/')
    await newPage.waitForLoadState('networkidle')

    // Check that the new page loads in French
    await expect(newPage).toHaveURL(/\/fr/)
    await expect(newPage.locator('h1')).toContainText('Connectez-vous avec vos créateurs haïtiens préférés')
  })

  test('should handle direct URL access with locale parameter', async ({ page }) => {
    // Navigate directly to French homepage
    await page.goto('/fr')
    await page.waitForLoadState('networkidle')

    // Check that content is in French
    await expect(page.locator('h1')).toContainText('Connectez-vous avec vos créateurs haïtiens préférés')

    // Navigate directly to Haitian Creole browse page
    await page.goto('/ht/browse')
    await page.waitForLoadState('networkidle')

    // Check that URL and content are correct
    await expect(page).toHaveURL('/ht/browse')
    // Add specific Creole content check for browse page when available
  })

  test('should redirect unsupported locale to default language', async ({ page }) => {
    // Try to access an unsupported locale
    await page.goto('/es') // Spanish not supported
    await page.waitForLoadState('networkidle')

    // Should redirect to English (default)
    await expect(page).toHaveURL(/\/en/)
    await expect(page.locator('h1')).toContainText('Connect with your favorite Haitian creators')
  })

  test('should update navigation elements when language changes', async ({ page }) => {
    // Check English navigation
    await expect(page.locator('nav a')).toContainText(['Home', 'Browse', 'How It Works', 'For Creators'])

    // Switch to French
    await page.click('button:has-text("English")')
    await page.click('text=Français')
    await page.waitForLoadState('networkidle')

    // Check that navigation is now in French
    await expect(page.locator('nav a')).toContainText(['Accueil', 'Parcourir', 'Comment ça marche', 'Pour les créateurs'])

    // Switch to Haitian Creole
    await page.click('button:has-text("Français")')
    await page.click('text=Kreyòl')
    await page.waitForLoadState('networkidle')

    // Check that navigation is now in Haitian Creole
    await expect(page.locator('nav a')).toContainText(['Lakay', 'Gade', 'Ki jan li fonksyone', 'Pou kreyatè yo'])
  })

  test('should update page metadata when language changes', async ({ page }) => {
    // Check English page title
    await expect(page).toHaveTitle(/Ann Pale/)

    // Switch to French
    await page.click('button:has-text("English")')
    await page.click('text=Français')
    await page.waitForLoadState('networkidle')

    // Check that title updated (if implemented)
    await expect(page).toHaveTitle(/Ann Pale/)

    // Check lang attribute
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  })

  test('should handle browser back/forward with language switching', async ({ page }) => {
    // Start in English
    await expect(page).toHaveURL(/\/en/)

    // Switch to French
    await page.click('button:has-text("English")')
    await page.click('text=Français')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/fr/)

    // Use browser back button
    await page.goBack()
    await page.waitForLoadState('networkidle')

    // Should be back to English
    await expect(page).toHaveURL(/\/en/)
    await expect(page.locator('h1')).toContainText('Connect with your favorite Haitian creators')

    // Use browser forward button
    await page.goForward()
    await page.waitForLoadState('networkidle')

    // Should be back to French
    await expect(page).toHaveURL(/\/fr/)
    await expect(page.locator('h1')).toContainText('Connectez-vous avec vos créateurs haïtiens préférés')
  })

  test('should switch language on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Look for mobile language switcher (globe icon)
    await page.click('[data-testid="mobile-language-switcher"], button svg[data-lucide="globe"]')

    // Select French
    await page.click('text=Français')
    await page.waitForLoadState('networkidle')

    // Check that URL and content changed
    await expect(page).toHaveURL(/\/fr/)
    await expect(page.locator('h1')).toContainText('Connectez-vous avec vos créateurs haïtiens préférés')
  })
})