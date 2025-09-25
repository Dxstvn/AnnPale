import { expect } from '@playwright/test'
import { authenticatedTest as test } from './fixtures/authenticated-test'

test.describe('Subscription Tier Editing', () => {
  test('should correctly update subscription tier information in backend', async ({ creatorPage }) => {
    // Navigate to creator settings
    await creatorPage.goto('/creator/settings')

    // Wait for initial load
    await creatorPage.waitForTimeout(2000)

    // Click on the Tiers tab using the correct data-testid
    await creatorPage.click('[data-testid="subscription-tiers-tab"]')

    // Wait for tiers content to load
    await creatorPage.waitForTimeout(2000)

    // Check if there are existing tiers, if not create one first
    const noTiersMessage = await creatorPage.locator('text="No subscription tiers created yet"').count()

    let tierName = 'Test Tier ' + Date.now()

    if (noTiersMessage > 0) {
      // Create a new tier first - click the gradient button with "Add Tier" text
      await creatorPage.click('button:has-text("Add Tier")')

      // Wait for dialog to appear
      await creatorPage.waitForSelector('text="Create Subscription Tier"', { timeout: 5000 })

      // Fill in tier details
      await creatorPage.fill('#tier_name', tierName)
      await creatorPage.fill('#price', '9.99')
      await creatorPage.fill('#description', 'Original description for testing')

      // Add a benefit
      const benefitInput = creatorPage.locator('input[placeholder="Enter a benefit"]').first()
      await benefitInput.fill('Original test benefit')

      // Save the tier - click the gradient "Create Tier" button
      await creatorPage.click('button:has-text("Create Tier"):has(.bg-gradient-to-r)')

      // Wait for tier to be created and dialog to close
      await creatorPage.waitForTimeout(3000)
    }

    // Now test editing - click the dropdown menu button (ellipsis-vertical icon)
    // Find the first dropdown trigger button with the three dots icon
    await creatorPage.locator('button[aria-haspopup="menu"]:has(svg.lucide-ellipsis-vertical)').first().click()

    // Wait for dropdown to open
    await creatorPage.waitForTimeout(500)

    // Click Edit option in the dropdown
    await creatorPage.click('div[role="menuitem"]:has-text("Edit")')

    // Wait for edit dialog to appear
    await creatorPage.waitForSelector('text="Edit Subscription Tier"', { timeout: 5000 })

    // Capture original values
    const originalName = await creatorPage.inputValue('#tier_name')
    const originalPrice = await creatorPage.inputValue('#price')
    const originalDescription = await creatorPage.inputValue('#description')

    console.log('Original values:', {
      name: originalName,
      price: originalPrice,
      description: originalDescription
    })

    // Update tier information
    const updatedName = 'Updated Tier ' + Date.now()
    const updatedPrice = '19.99'
    const updatedDescription = 'This is the updated description for testing'

    // Clear and fill new values
    await creatorPage.fill('#tier_name', '')
    await creatorPage.fill('#tier_name', updatedName)

    await creatorPage.fill('#price', '')
    await creatorPage.fill('#price', updatedPrice)

    await creatorPage.fill('#description', '')
    await creatorPage.fill('#description', updatedDescription)

    // Add a new benefit by clicking "Add Benefit" button
    await creatorPage.click('button:has-text("Add Benefit")')
    await creatorPage.waitForTimeout(500)

    // Fill the new empty benefit input
    const emptyBenefitInputs = await creatorPage.locator('input[placeholder="Enter a benefit"][value=""]')
    if (await emptyBenefitInputs.count() > 0) {
      await emptyBenefitInputs.first().fill('New updated benefit')
    }

    // Save changes - click the "Update Tier" button
    await creatorPage.click('button:has-text("Update Tier"):not(:has-text("Cancel"))')

    // Wait for update to complete and dialog to close
    await creatorPage.waitForTimeout(3000)

    // Verify the tier card shows updated information
    await expect(creatorPage.locator(`text="${updatedName}"`)).toBeVisible({ timeout: 10000 })
    await expect(creatorPage.locator(`text="$${updatedPrice}/month"`).or(creatorPage.locator(`text="$${updatedPrice}"`)).first()).toBeVisible()

    // Look for description in the tier card
    const descriptionVisible = await creatorPage.locator(`text="${updatedDescription}"`).count()
    if (descriptionVisible > 0) {
      await expect(creatorPage.locator(`text="${updatedDescription}"`).first()).toBeVisible()
    }

    // Refresh the page to ensure data persists
    await creatorPage.reload()
    await creatorPage.waitForTimeout(2000)

    // Click on the Tiers tab again
    await creatorPage.click('[data-testid="subscription-tiers-tab"]')
    await creatorPage.waitForTimeout(2000)

    // Verify updated data still shows after refresh
    await expect(creatorPage.locator(`text="${updatedName}"`)).toBeVisible({ timeout: 10000 })
    await expect(creatorPage.locator(`text="$${updatedPrice}/month"`).or(creatorPage.locator(`text="$${updatedPrice}"`)).first()).toBeVisible()

    console.log('✅ Tier successfully updated!')
    console.log('Updated values:', {
      name: updatedName,
      price: updatedPrice,
      description: updatedDescription
    })

    // Clean up - delete the test tier
    // Click the dropdown menu for the updated tier
    await creatorPage.locator('button[aria-haspopup="menu"]:has(svg.lucide-ellipsis-vertical)').first().click()
    await creatorPage.waitForTimeout(500)

    // Click Delete option
    await creatorPage.click('div[role="menuitem"]:has-text("Delete")')

    // Wait for delete confirmation dialog
    await creatorPage.waitForSelector('text="Delete Subscription Tier"', { timeout: 5000 })

    // Confirm deletion - click the button that confirms deletion
    await creatorPage.click('button:has-text("Delete"):not(:has-text("Cancel"))')

    // Wait for deletion to complete
    await creatorPage.waitForTimeout(3000)

    console.log('✅ Subscription tier editing test completed successfully!')
    console.log('✅ Test verified that frontend changes properly update the backend')
  })
})