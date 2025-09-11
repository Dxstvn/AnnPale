import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('VideoOrderModal Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a creator page where the modal can be opened
    await page.goto('/fan/creators/8f1b8339-3ca7-4c84-8392-a7e83d534bcc')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
  })

  test('should pass WCAG 2.1 Level AA standards when modal is closed', async ({ page }) => {
    // Run axe accessibility scan on the page
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    // Log any violations found
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:')
      results.violations.forEach(violation => {
        console.log(`- ${violation.id}: ${violation.description}`)
        console.log(`  Impact: ${violation.impact}`)
        console.log(`  Affected elements: ${violation.nodes.length}`)
      })
    }

    // Assert no violations
    expect(results.violations).toHaveLength(0)
  })

  test('should pass WCAG 2.1 Level AA standards when modal is open', async ({ page }) => {
    // Open the video order modal
    const bookVideoButton = page.getByRole('button', { name: /book.*video/i }).first()
    await bookVideoButton.click()

    // Wait for modal to be visible
    await page.waitForSelector('[data-testid="video-order-modal"]', { state: 'visible' })

    // Run axe accessibility scan on the modal
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .include('[data-testid="video-order-modal"]')
      .analyze()

    // Log any violations found
    if (results.violations.length > 0) {
      console.log('Accessibility violations found in modal:')
      results.violations.forEach(violation => {
        console.log(`- ${violation.id}: ${violation.description}`)
        console.log(`  Impact: ${violation.impact}`)
        console.log(`  Help: ${violation.help}`)
        violation.nodes.forEach(node => {
          console.log(`  Element: ${node.html}`)
          console.log(`  Selector: ${node.target}`)
        })
      })
    }

    // Assert no violations
    expect(results.violations).toHaveLength(0)
  })

  test('should have proper color contrast ratios', async ({ page }) => {
    // Open the modal
    const bookVideoButton = page.getByRole('button', { name: /book.*video/i }).first()
    await bookVideoButton.click()
    await page.waitForSelector('[data-testid="video-order-modal"]', { state: 'visible' })

    // Run axe scan specifically for color contrast
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .withRules(['color-contrast'])
      .include('[data-testid="video-order-modal"]')
      .analyze()

    // Assert no color contrast violations
    expect(results.violations).toHaveLength(0)
  })

  test('should have proper form labels and ARIA attributes', async ({ page }) => {
    // Open the modal
    const bookVideoButton = page.getByRole('button', { name: /book.*video/i }).first()
    await bookVideoButton.click()
    await page.waitForSelector('[data-testid="video-order-modal"]', { state: 'visible' })

    // Run axe scan specifically for form-related accessibility
    const results = await new AxeBuilder({ page })
      .withRules([
        'label',
        'label-title-only',
        'form-field-multiple-labels',
        'select-name',
        'aria-valid-attr',
        'aria-valid-attr-value',
        'aria-required-attr',
        'aria-required-children',
        'aria-required-parent'
      ])
      .include('[data-testid="video-order-modal"]')
      .analyze()

    // Assert no form accessibility violations
    expect(results.violations).toHaveLength(0)
  })

  test('should be keyboard navigable', async ({ page }) => {
    // Open the modal
    const bookVideoButton = page.getByRole('button', { name: /book.*video/i }).first()
    await bookVideoButton.click()
    await page.waitForSelector('[data-testid="video-order-modal"]', { state: 'visible' })

    // Test Tab navigation through form elements
    await page.keyboard.press('Tab') // Should focus on first interactive element
    
    // Check that focus is visible
    const focusedElement = await page.evaluateHandle(() => document.activeElement)
    const tagName = await focusedElement.evaluate(el => el?.tagName)
    expect(tagName).toBeTruthy()

    // Run axe scan for keyboard navigation
    const results = await new AxeBuilder({ page })
      .withRules([
        'focus-order-semantics',
        'tabindex',
        'bypass',
        'keyboard-accessible'
      ])
      .include('[data-testid="video-order-modal"]')
      .analyze()

    expect(results.violations).toHaveLength(0)
  })

  test('should handle error states accessibly', async ({ page }) => {
    // Open the modal
    const bookVideoButton = page.getByRole('button', { name: /book.*video/i }).first()
    await bookVideoButton.click()
    await page.waitForSelector('[data-testid="video-order-modal"]', { state: 'visible' })

    // Try to submit without filling required fields to trigger errors
    const submitButton = page.getByRole('button', { name: /continue to checkout/i })
    await submitButton.click()

    // Wait for error messages to appear
    await page.waitForTimeout(500)

    // Run axe scan on form with errors
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .include('[data-testid="video-order-modal"]')
      .analyze()

    // Check specifically for aria-invalid and error message associations
    const recipientInput = page.getByLabel(/who is this video for/i)
    const hasAriaInvalid = await recipientInput.getAttribute('aria-invalid')
    const ariaDescribedBy = await recipientInput.getAttribute('aria-describedby')
    
    expect(hasAriaInvalid).toBe('true')
    expect(ariaDescribedBy).toBeTruthy()

    // Assert no accessibility violations
    expect(results.violations).toHaveLength(0)
  })

  test('should have descriptive button labels', async ({ page }) => {
    // Open the modal
    const bookVideoButton = page.getByRole('button', { name: /book.*video/i }).first()
    await bookVideoButton.click()
    await page.waitForSelector('[data-testid="video-order-modal"]', { state: 'visible' })

    // Check button accessibility
    const results = await new AxeBuilder({ page })
      .withRules([
        'button-name',
        'input-button-name',
        'aria-command-name'
      ])
      .include('[data-testid="video-order-modal"]')
      .analyze()

    expect(results.violations).toHaveLength(0)

    // Verify specific button labels
    const cancelButton = page.getByRole('button', { name: /cancel/i })
    const checkoutButton = page.getByRole('button', { name: /continue to checkout/i })
    
    expect(await cancelButton.getAttribute('aria-label')).toBeTruthy()
    expect(await checkoutButton.getAttribute('aria-label')).toBeTruthy()
  })

  test('should meet minimum touch target sizes', async ({ page }) => {
    // Open the modal
    const bookVideoButton = page.getByRole('button', { name: /book.*video/i }).first()
    await bookVideoButton.click()
    await page.waitForSelector('[data-testid="video-order-modal"]', { state: 'visible' })

    // Check all interactive elements meet minimum size (44x44px)
    const buttons = await page.$$('[data-testid="video-order-modal"] button')
    
    for (const button of buttons) {
      const box = await button.boundingBox()
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    }

    // Run axe scan for target size
    const results = await new AxeBuilder({ page })
      .withRules(['target-size'])
      .include('[data-testid="video-order-modal"]')
      .analyze()

    expect(results.violations).toHaveLength(0)
  })
})