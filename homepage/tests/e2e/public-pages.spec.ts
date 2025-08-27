import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test.describe('Homepage', () => {
    test('should load homepage successfully', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Ann Pale/);
      
      // Check hero section
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();
      
      // Check main CTA button
      const ctaButton = page.getByRole('link', { name: /Browse Celebrities|Get Started/i });
      await expect(ctaButton).toBeVisible();
    });

    test('should display how it works section', async ({ page }) => {
      await page.goto('/');
      
      // Look for "How it works" or similar heading
      const howItWorks = page.locator('text=/how.*works/i');
      await expect(howItWorks).toBeVisible();
      
      // Check for 3 steps
      const steps = page.locator('[class*="step"], [class*="feature"]').locator('visible=true');
      expect(await steps.count()).toBeGreaterThanOrEqual(3);
    });

    test('should have working navigation links', async ({ page }) => {
      await page.goto('/');
      
      // Check header navigation
      const browseLink = page.getByRole('link', { name: /browse/i });
      await expect(browseLink).toBeVisible();
      
      const aboutLink = page.getByRole('link', { name: /about/i });
      await expect(aboutLink).toBeVisible();
    });

    test('should display footer with links', async ({ page }) => {
      await page.goto('/');
      
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Check footer links
      const privacyLink = page.getByRole('link', { name: /privacy/i });
      await expect(privacyLink).toBeVisible();
      
      const termsLink = page.getByRole('link', { name: /terms/i });
      await expect(termsLink).toBeVisible();
      
      const contactLink = page.getByRole('link', { name: /contact/i });
      await expect(contactLink).toBeVisible();
    });
  });

  test.describe('About Page', () => {
    test('should load about page', async ({ page }) => {
      await page.goto('/about');
      
      // Check page heading
      const heading = page.getByRole('heading', { name: /about/i, level: 1 });
      await expect(heading).toBeVisible();
      
      // Check for content
      const content = page.locator('main');
      await expect(content).toContainText(/Ann Pale/);
    });

    test('should have mission statement', async ({ page }) => {
      await page.goto('/about');
      
      // Look for mission-related content
      const missionText = page.locator('text=/mission|vision|goal/i');
      await expect(missionText.first()).toBeVisible();
    });
  });

  test.describe('How It Works Page', () => {
    test('should load how it works page', async ({ page }) => {
      await page.goto('/how-it-works');
      
      const heading = page.getByRole('heading', { name: /how.*works/i });
      await expect(heading.first()).toBeVisible();
    });

    test('should display process steps', async ({ page }) => {
      await page.goto('/how-it-works');
      
      // Check for numbered steps or process items
      const steps = page.locator('text=/step|choose|book|receive/i');
      expect(await steps.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Browse Page', () => {
    test('should load browse page', async ({ page }) => {
      await page.goto('/browse');
      
      // Check page loads
      await expect(page.getByRole('heading', { name: /browse|celebrities|creators/i }).first()).toBeVisible();
    });

    test('should display creator cards', async ({ page }) => {
      await page.goto('/browse');
      
      // Wait for creator cards to load
      await page.waitForSelector('[class*="card"]', { timeout: 10000 });
      
      // Check that creator cards are present
      const creatorCards = page.locator('[class*="card"]').locator('visible=true');
      expect(await creatorCards.count()).toBeGreaterThan(0);
    });

    test('should have search functionality', async ({ page }) => {
      await page.goto('/browse');
      
      // Look for search input
      const searchInput = page.getByPlaceholder(/search/i);
      await expect(searchInput).toBeVisible();
      
      // Test search interaction
      await searchInput.fill('test search');
      await expect(searchInput).toHaveValue('test search');
    });

    test('should have filter options', async ({ page }) => {
      await page.goto('/browse');
      
      // Look for filter elements
      const filters = page.locator('text=/filter|category|price/i');
      expect(await filters.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Terms and Privacy Pages', () => {
    test('should load terms page', async ({ page }) => {
      await page.goto('/terms');
      
      const heading = page.getByRole('heading', { name: /terms/i });
      await expect(heading.first()).toBeVisible();
      
      // Check for legal content
      await expect(page.locator('main')).toContainText(/agreement|terms|conditions/i);
    });

    test('should load privacy page', async ({ page }) => {
      await page.goto('/privacy');
      
      const heading = page.getByRole('heading', { name: /privacy/i });
      await expect(heading.first()).toBeVisible();
      
      // Check for privacy content
      await expect(page.locator('main')).toContainText(/privacy|data|information/i);
    });
  });

  test.describe('Contact Page', () => {
    test('should load contact page', async ({ page }) => {
      await page.goto('/contact');
      
      const heading = page.getByRole('heading', { name: /contact/i });
      await expect(heading.first()).toBeVisible();
    });

    test('should have contact form', async ({ page }) => {
      await page.goto('/contact');
      
      // Check for form fields
      const nameField = page.getByLabel(/name/i);
      await expect(nameField).toBeVisible();
      
      const emailField = page.getByLabel(/email/i);
      await expect(emailField).toBeVisible();
      
      const messageField = page.getByLabel(/message/i);
      await expect(messageField).toBeVisible();
      
      const submitButton = page.getByRole('button', { name: /submit|send/i });
      await expect(submitButton).toBeVisible();
    });

    test('should validate contact form', async ({ page }) => {
      await page.goto('/contact');
      
      // Try to submit empty form
      const submitButton = page.getByRole('button', { name: /submit|send/i });
      await submitButton.click();
      
      // Check for validation messages
      // Note: This might need adjustment based on actual validation implementation
      const errors = page.locator('[class*="error"], [aria-invalid="true"]');
      expect(await errors.count()).toBeGreaterThan(0);
    });
  });

  test.describe('404 Error Page', () => {
    test('should display 404 page for non-existent route', async ({ page }) => {
      await page.goto('/this-page-does-not-exist-123456');
      
      // Check for 404 content
      const errorText = page.locator('text=/404|not found|doesn.*exist/i');
      await expect(errorText.first()).toBeVisible();
      
      // Check for home link
      const homeLink = page.getByRole('link', { name: /home|back/i });
      await expect(homeLink).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should be mobile responsive', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Check mobile menu button exists
      const mobileMenuButton = page.locator('[aria-label*="menu"], [class*="mobile-menu"], button:has(svg)').first();
      await expect(mobileMenuButton).toBeVisible();
      
      // Check content is not cut off
      const mainContent = page.locator('main');
      const box = await mainContent.boundingBox();
      expect(box?.width).toBeLessThanOrEqual(375);
    });

    test('should handle tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      
      // Check layout adapts
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });
  });
});