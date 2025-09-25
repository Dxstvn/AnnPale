import { expect } from '@playwright/test'
import { authenticatedTest as test } from './fixtures/authenticated-test'

test.describe('Profile Settings', () => {
  test('should update bio, extended bio, and languages successfully', async ({ creatorPage }) => {
    // Always start with login page to ensure clean state
    await creatorPage.goto('/login')

    // Perform login
    console.log('Logging in as creator...')
    await creatorPage.fill('#email', 'testcreator@annpale.test')
    await creatorPage.fill('#password', 'TestPassword123!')

    // Click the Sign In button
    await creatorPage.click('button[data-testid="login-submit-btn"]')

    // Wait for navigation to creator dashboard
    await creatorPage.waitForURL('**/creator/**', { timeout: 15000 })
    console.log('Successfully logged in')

    // Now navigate to settings
    await creatorPage.goto('/creator/settings')

    // Wait for page to load
    await creatorPage.waitForTimeout(2000)

    // Wait for the tabs container to be visible with more specific selector
    await creatorPage.waitForSelector('[role="tablist"]', { state: 'visible', timeout: 15000 })

    // The profile tab should be visible
    const profileTab = creatorPage.locator('button[role="tab"]:has-text("Profile")')

    // Click on Profile tab to ensure we're on it
    await profileTab.click()
    await creatorPage.waitForTimeout(1000)

    // Test Bio field
    const bioTextarea = creatorPage.locator('#bio')
    await bioTextarea.fill('')
    await bioTextarea.fill('This is my updated bio for testing')

    // Test Extended Bio field
    const extendedBioTextarea = creatorPage.locator('#extended-bio')
    await extendedBioTextarea.fill('')
    await extendedBioTextarea.fill('This is my extended bio with more details about my background and what I offer to fans.')

    // Test Languages - Add a new language
    const addLanguageButton = creatorPage.locator('button:has(.lucide-plus)').first()
    await addLanguageButton.click()

    // Type new language
    const languageInput = creatorPage.locator('input[placeholder="Language name"]')
    await languageInput.fill('French')
    await languageInput.press('Enter')

    // Verify the new language badge appears
    await expect(creatorPage.locator('span:has-text("French")')).toBeVisible()

    // Save changes
    const saveButton = creatorPage.locator('button:has-text("Save Changes")')
    await saveButton.click()

    // Wait for save to complete
    await creatorPage.waitForTimeout(2000)

    // Verify success toast - look for either the title or description
    await expect(
      creatorPage.locator('text="Settings saved"').or(
        creatorPage.locator('text="Your profile has been updated successfully"')
      )
    ).toBeVisible({ timeout: 10000 })

    // Refresh the page to verify persistence
    await creatorPage.reload()
    await creatorPage.waitForTimeout(2000)

    // Verify the bio is still there
    const bioAfterRefresh = await creatorPage.inputValue('#bio')
    expect(bioAfterRefresh).toBe('This is my updated bio for testing')

    // Verify the extended bio is still there
    const extendedBioAfterRefresh = await creatorPage.inputValue('#extended-bio')
    expect(extendedBioAfterRefresh).toBe('This is my extended bio with more details about my background and what I offer to fans.')

    // Verify French language is still there
    await expect(creatorPage.locator('span:has-text("French")')).toBeVisible()

    // Test removing a language (but not the last one)
    const frenchBadge = creatorPage.locator('span:has-text("French")')
    const removeButton = frenchBadge.locator('button:has-text("×")')
    await removeButton.click()

    // Save changes
    await saveButton.click()
    await creatorPage.waitForTimeout(2000)

    // Verify the language was removed after save
    await creatorPage.reload()
    await creatorPage.waitForTimeout(2000)
    await expect(creatorPage.locator('span:has-text("French")')).not.toBeVisible()

    console.log('✅ Profile settings test completed successfully!')
    console.log('✅ Bio, extended bio, and languages are properly saved to backend')
  })

  test('should not show profile images or social media sections', async ({ creatorPage }) => {
    // Always start with login page to ensure clean state
    await creatorPage.goto('/login')

    // Perform login
    console.log('Logging in as creator...')
    await creatorPage.fill('#email', 'testcreator@annpale.test')
    await creatorPage.fill('#password', 'TestPassword123!')

    // Click the Sign In button
    await creatorPage.click('button[data-testid="login-submit-btn"]')

    // Wait for navigation to creator dashboard
    await creatorPage.waitForURL('**/creator/**', { timeout: 15000 })
    console.log('Successfully logged in')

    // Now navigate to settings
    await creatorPage.goto('/creator/settings')

    await creatorPage.waitForTimeout(2000)

    // Verify profile images section is not visible
    await expect(creatorPage.locator('text="Profile Images"')).not.toBeVisible()
    await expect(creatorPage.locator('text="Profile Photo"')).not.toBeVisible()
    await expect(creatorPage.locator('text="Cover Image"')).not.toBeVisible()

    // Verify social media section is not visible
    await expect(creatorPage.locator('text="Social Media Links"')).not.toBeVisible()
    await expect(creatorPage.locator('label:has-text("Instagram")')).not.toBeVisible()
    await expect(creatorPage.locator('label:has-text("Twitter")')).not.toBeVisible()
    await expect(creatorPage.locator('label:has-text("YouTube")')).not.toBeVisible()

    // Verify specialties section is not visible
    await expect(creatorPage.locator('label:has-text("Specialties")')).not.toBeVisible()

    console.log('✅ UI correctly hides archived sections')
  })
})