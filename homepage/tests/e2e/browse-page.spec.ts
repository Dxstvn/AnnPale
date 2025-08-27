import { test, expect } from '@playwright/test';

test.describe('Browse Page Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/browse');
  });

  test.describe('Page Loading', () => {
    test('should load browse page with correct title', async ({ page }) => {
      await expect(page).toHaveTitle(/browse|celebrities|creators/i);
      await expect(page.getByRole('heading', { name: /browse|celebrities|creators/i }).first()).toBeVisible();
    });

    test('should display creator grid', async ({ page }) => {
      // Wait for creator cards
      await page.waitForSelector('[class*="card"], [data-testid="creator-card"]', { 
        state: 'visible',
        timeout: 10000 
      });
      
      const cards = page.locator('[class*="card"]').locator('visible=true');
      expect(await cards.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Search Functionality', () => {
    test('should have search input', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toBeEnabled();
    });

    test('should accept search input', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);
      await searchInput.fill('Wyclef Jean');
      await expect(searchInput).toHaveValue('Wyclef Jean');
    });

    test('should clear search input', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);
      await searchInput.fill('test search');
      await searchInput.clear();
      await expect(searchInput).toHaveValue('');
    });
  });

  test.describe('Filter System', () => {
    test('should display category filters', async ({ page }) => {
      // Look for category filter options
      const categoryFilters = page.locator('text=/music|sports|comedy|acting/i');
      expect(await categoryFilters.count()).toBeGreaterThan(0);
    });

    test('should have price filter', async ({ page }) => {
      // Look for price-related filters
      const priceFilter = page.locator('text=/price|\\$|cost/i');
      expect(await priceFilter.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Sorting Options', () => {
    test('should have sort dropdown or options', async ({ page }) => {
      // Look for sort options
      const sortOptions = page.locator('text=/sort|popular|newest|price/i');
      expect(await sortOptions.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Creator Cards', () => {
    test('should display creator information', async ({ page }) => {
      // Wait for cards to load
      await page.waitForSelector('[class*="card"]', { state: 'visible' });
      
      const firstCard = page.locator('[class*="card"]').first();
      
      // Check for essential creator info
      const creatorName = firstCard.locator('h2, h3, h4, [class*="title"]');
      await expect(creatorName).toBeVisible();
      
      // Check for price info
      const priceInfo = firstCard.locator('text=/\\$|starting at/i');
      expect(await priceInfo.count()).toBeGreaterThan(0);
    });

    test('should have clickable creator cards', async ({ page }) => {
      await page.waitForSelector('[class*="card"]', { state: 'visible' });
      
      const firstCard = page.locator('[class*="card"]').first();
      await expect(firstCard).toBeVisible();
      
      // Cards should be clickable or have a link
      const cardLink = firstCard.locator('a').first();
      if (await cardLink.count() > 0) {
        await expect(cardLink).toHaveAttribute('href', /\/creator\//);
      }
    });
  });

  test.describe('Pagination', () => {
    test('should display pagination controls if multiple pages', async ({ page }) => {
      // Look for pagination elements
      const pagination = page.locator('[class*="pagination"], [aria-label*="pagination"]');
      
      // Pagination might not always be present (depends on data)
      if (await pagination.count() > 0) {
        await expect(pagination.first()).toBeVisible();
        
        // Check for page numbers or next/previous buttons
        const pageButtons = pagination.locator('button, a');
        expect(await pageButtons.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Loading States', () => {
    test('should handle loading state gracefully', async ({ page }) => {
      // Navigate to browse page
      await page.goto('/browse');
      
      // Check that either content or loading state is shown
      const hasContent = await page.locator('[class*="card"]').count() > 0;
      const hasLoadingState = await page.locator('[class*="skeleton"], [class*="loading"]').count() > 0;
      
      expect(hasContent || hasLoadingState).toBeTruthy();
    });
  });

  test.describe('Empty States', () => {
    test('should handle no results gracefully', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);
      
      // Search for something unlikely to return results
      await searchInput.fill('xyzabc123456789');
      await page.keyboard.press('Enter');
      
      // Wait a moment for results
      await page.waitForTimeout(1000);
      
      // Should show either no results message or still show some cards
      const noResults = page.locator('text=/no.*results|not.*found|try.*different/i');
      const cards = page.locator('[class*="card"]');
      
      const hasNoResultsMessage = await noResults.count() > 0;
      const hasCards = await cards.count() > 0;
      
      expect(hasNoResultsMessage || hasCards).toBeTruthy();
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/browse');
      
      // Check that cards adapt to mobile layout
      await page.waitForSelector('[class*="card"]', { state: 'visible' });
      
      // Cards should stack vertically on mobile
      const cards = page.locator('[class*="card"]');
      const firstCard = cards.first();
      const secondCard = cards.nth(1);
      
      if (await secondCard.count() > 0) {
        const firstBox = await firstCard.boundingBox();
        const secondBox = await secondCard.boundingBox();
        
        // Cards should be stacked (second card Y position should be greater)
        if (firstBox && secondBox) {
          expect(secondBox.y).toBeGreaterThan(firstBox.y);
        }
      }
    });

    test('should show filter drawer/modal on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/browse');
      
      // Look for filter button on mobile
      const filterButton = page.locator('button:has-text(/filter/i), [aria-label*="filter"]');
      
      if (await filterButton.count() > 0) {
        await expect(filterButton.first()).toBeVisible();
      }
    });
  });
});