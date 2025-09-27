import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

// Test configuration
const TEST_USER = {
  email: 'e2e.subscriber@annpale.com',
  password: 'E2ETest123!'
}

const TEST_CREATOR = {
  email: 'e2e.creator@annpale.com',
  password: 'E2ETest123!',
  displayName: 'Test Creator'
}

// Initialize Supabase client for test data setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

test.describe('Subscription Flow E2E', () => {
  let creatorId: string
  let tierId: string
  let userId: string

  test.beforeAll(async () => {
    console.log('Setting up test data...')

    // Clean up existing test users
    await supabase.auth.admin.deleteUser(TEST_USER.email).catch(() => {})
    await supabase.auth.admin.deleteUser(TEST_CREATOR.email).catch(() => {})

    // Create test subscriber
    const { data: userData } = await supabase.auth.admin.createUser({
      email: TEST_USER.email,
      password: TEST_USER.password,
      email_confirm: true
    })
    userId = userData?.user?.id!

    await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: TEST_USER.email,
        display_name: 'Test Subscriber',
        role: 'fan'
      })

    // Create test creator
    const { data: creatorData } = await supabase.auth.admin.createUser({
      email: TEST_CREATOR.email,
      password: TEST_CREATOR.password,
      email_confirm: true
    })
    creatorId = creatorData?.user?.id!

    await supabase
      .from('profiles')
      .upsert({
        id: creatorId,
        email: TEST_CREATOR.email,
        display_name: TEST_CREATOR.displayName,
        role: 'creator',
        bio: 'Test creator for E2E testing',
        is_public: true
      })

    // Create subscription tier
    const { data: tier } = await supabase
      .from('creator_subscription_tiers')
      .insert({
        creator_id: creatorId,
        tier_name: 'E2E Test Tier',
        description: 'Test tier for E2E testing',
        price: 9.99, // Price as decimal
        billing_period: 'monthly',
        benefits: ['Access to exclusive content', 'Monthly video calls'],
        is_active: true
      })
      .select()
      .single()

    tierId = tier?.id!
    console.log('Test data setup complete')
  })

  test.afterAll(async () => {
    console.log('Cleaning up test data...')

    // Clean up subscriptions
    await supabase
      .from('subscription_orders')
      .delete()
      .eq('user_id', userId)

    // Clean up tier
    await supabase
      .from('creator_subscription_tiers')
      .delete()
      .eq('id', tierId)

    // Clean up users
    await supabase.auth.admin.deleteUser(userId).catch(() => {})
    await supabase.auth.admin.deleteUser(creatorId).catch(() => {})

    console.log('Cleanup complete')
  })

  test('Complete subscription flow', async ({ page }) => {
    // 1. Navigate to homepage
    await test.step('Navigate to homepage', async () => {
      await page.goto('/')
      await expect(page).toHaveTitle(/Ann Pale/i)
    })

    // 2. Sign in as subscriber
    await test.step('Sign in as subscriber', async () => {
      // Click sign in button
      await page.getByRole('button', { name: /sign in/i }).click()

      // Fill in credentials
      await page.getByLabel(/email/i).fill(TEST_USER.email)
      await page.getByLabel(/password/i).fill(TEST_USER.password)

      // Submit form
      await page.getByRole('button', { name: /sign in/i, exact: true }).click()

      // Wait for redirect
      await expect(page).toHaveURL('/', { timeout: 10000 })
    })

    // 3. Navigate to browse page
    await test.step('Navigate to browse creators', async () => {
      await page.getByRole('link', { name: /browse/i }).click()
      await expect(page).toHaveURL(/\/browse/)
    })

    // 4. Find and visit creator profile
    await test.step('Visit creator profile', async () => {
      // Search or find the test creator
      const creatorCard = page.locator(`text=${TEST_CREATOR.displayName}`).first()
      await expect(creatorCard).toBeVisible({ timeout: 10000 })

      // Click to view profile
      await creatorCard.click()

      // Verify we're on the creator's page
      await expect(page).toHaveURL(new RegExp(`/creator/${creatorId}`))
      await expect(page.locator('h1', { hasText: TEST_CREATOR.displayName })).toBeVisible()
    })

    // 5. Subscribe to creator
    await test.step('Subscribe to creator tier', async () => {
      // Find subscription tier card
      const tierCard = page.locator('[data-testid="subscription-tier"]').filter({
        hasText: 'E2E Test Tier'
      })
      await expect(tierCard).toBeVisible()

      // Check price is displayed correctly
      await expect(tierCard.locator('text=$9.99')).toBeVisible()

      // Click subscribe button
      const subscribeButton = tierCard.getByRole('button', { name: /subscribe/i })
      await subscribeButton.click()

      // Wait for success message or redirect
      await expect(page.locator('text=/success|subscribed/i')).toBeVisible({ timeout: 10000 })
    })

    // 6. Verify subscription in fan portal
    await test.step('Verify subscription in fan portal', async () => {
      // Navigate to fan subscriptions page
      await page.goto('/fan/subscriptions')

      // Check that our subscription is listed
      const subscriptionCard = page.locator('[data-testid="subscription-card"]').filter({
        hasText: TEST_CREATOR.displayName
      })
      await expect(subscriptionCard).toBeVisible()

      // Verify status is active
      await expect(subscriptionCard.locator('text=/active/i')).toBeVisible()

      // Verify tier name
      await expect(subscriptionCard.locator('text=E2E Test Tier')).toBeVisible()
    })

    // 7. Test subscription management
    await test.step('Test subscription management', async () => {
      // Find manage button
      const manageButton = page.getByRole('button', { name: /manage/i }).first()
      await manageButton.click()

      // Cancel subscription
      const cancelButton = page.getByRole('button', { name: /cancel subscription/i })
      await expect(cancelButton).toBeVisible()
      await cancelButton.click()

      // Confirm cancellation
      const confirmButton = page.getByRole('button', { name: /confirm/i })
      await confirmButton.click()

      // Verify cancellation success
      await expect(page.locator('text=/cancelled|canceled/i')).toBeVisible({ timeout: 10000 })
    })

    // 8. Verify access to subscribed content
    await test.step('Verify content access', async () => {
      // Go back to creator profile
      await page.goto(`/creator/${creatorId}`)

      // Check for subscriber-only content indicator
      const subscriberBadge = page.locator('text=/subscriber|subscribed/i')
      await expect(subscriberBadge).toBeVisible()
    })
  })

  test('Prevent duplicate subscriptions', async ({ page }) => {
    // Sign in
    await page.goto('/')
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.getByLabel(/email/i).fill(TEST_USER.email)
    await page.getByLabel(/password/i).fill(TEST_USER.password)
    await page.getByRole('button', { name: /sign in/i, exact: true }).click()
    await expect(page).toHaveURL('/')

    // Create initial subscription via API
    const response = await page.request.post('/api/subscriptions/subscribe', {
      data: {
        creatorId: creatorId,
        tierId: tierId
      }
    })
    expect(response.status()).toBe(201)

    // Navigate to creator profile
    await page.goto(`/creator/${creatorId}`)

    // Try to subscribe again
    const tierCard = page.locator('[data-testid="subscription-tier"]').filter({
      hasText: 'E2E Test Tier'
    })

    // Should show already subscribed state
    await expect(tierCard.locator('text=/subscribed|active/i')).toBeVisible()

    // Subscribe button should be disabled or show different text
    const subscribeButton = tierCard.getByRole('button')
    const buttonText = await subscribeButton.textContent()
    expect(buttonText?.toLowerCase()).toMatch(/subscribed|active|manage/)
  })

  test('Subscription appears in monitoring dashboard', async ({ page }) => {
    // Create admin user
    const { data: adminData } = await supabase.auth.admin.createUser({
      email: 'e2e.admin@annpale.com',
      password: 'AdminE2E123!',
      email_confirm: true
    })

    const adminId = adminData?.user?.id!

    await supabase
      .from('profiles')
      .upsert({
        id: adminId,
        email: 'e2e.admin@annpale.com',
        role: 'admin'
      })

    try {
      // Sign in as admin
      await page.goto('/')
      await page.getByRole('button', { name: /sign in/i }).click()
      await page.getByLabel(/email/i).fill('e2e.admin@annpale.com')
      await page.getByLabel(/password/i).fill('AdminE2E123!')
      await page.getByRole('button', { name: /sign in/i, exact: true }).click()

      // Navigate to monitoring dashboard
      await page.goto('/en/admin/subscriptions')

      // Check for dashboard elements
      await expect(page.locator('h1', { hasText: 'Subscription Monitoring' })).toBeVisible()

      // Check for stats
      await expect(page.locator('text=/Total Subscriptions/i')).toBeVisible()
      await expect(page.locator('text=/Monthly Recurring Revenue/i')).toBeVisible()

      // Run sync
      const syncButton = page.getByRole('button', { name: /run sync/i })
      if (await syncButton.isVisible()) {
        await syncButton.click()
        await expect(page.locator('text=/syncing/i')).toBeVisible()
        await expect(page.locator('text=/syncing/i')).not.toBeVisible({ timeout: 30000 })
      }

    } finally {
      // Clean up admin user
      await supabase.auth.admin.deleteUser(adminId)
    }
  })
})

test.describe('Subscription API Tests', () => {
  test('API endpoints require authentication', async ({ request }) => {
    // Test list endpoint
    const listResponse = await request.get('/api/subscriptions/list')
    expect(listResponse.status()).toBe(401)

    // Test subscribe endpoint
    const subscribeResponse = await request.post('/api/subscriptions/subscribe', {
      data: { creatorId: 'test', tierId: 'test' }
    })
    expect(subscribeResponse.status()).toBe(401)

    // Test manage endpoint
    const manageResponse = await request.patch('/api/subscriptions/list', {
      data: { subscriptionId: 'test', action: 'cancel' }
    })
    expect(manageResponse.status()).toBe(401)
  })

  test('Webhook endpoint processes events', async ({ request }) => {
    // Create test webhook payload
    const testPayload = {
      id: 'evt_test_' + Date.now(),
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_test_' + Date.now(),
          status: 'active',
          current_period_start: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor(Date.now() / 1000) + 2592000
        }
      }
    }

    // Send to webhook endpoint (will fail signature check but tests endpoint exists)
    const response = await request.post('/api/stripe/subscriptions/webhook', {
      data: testPayload,
      headers: {
        'stripe-signature': 'test_signature'
      }
    })

    // Should return 400 for invalid signature (not 404)
    expect([400, 503]).toContain(response.status())
  })

  test('Sync endpoint runs successfully', async ({ request }) => {
    // Test without auth (should fail)
    const unauthResponse = await request.get('/api/cron/sync-subscriptions')
    expect(unauthResponse.status()).toBe(401)

    // Test with auth header
    const authResponse = await request.get('/api/cron/sync-subscriptions', {
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET || 'test'}`
      }
    })

    // Should either succeed or fail with 503 if Stripe not configured
    expect([200, 503]).toContain(authResponse.status())
  })
})