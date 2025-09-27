import { test, expect, type Page } from '@playwright/test'
import { authenticatedTest } from './fixtures/authenticated-test'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for database operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Test user credentials
const TEST_USERS = {
  fan: {
    email: 'testfan@annpale.test',
    password: 'TestPassword123!',
    id: 'c948265a-fb81-4c40-be8d-8dd536433738'
  },
  creator: {
    email: 'testcreator@annpale.test',
    password: 'TestPassword123!',
    id: '0f3753a3-029c-473a-9aee-fc107d10c569'
  }
}

// Helper function to create test video request
async function createTestVideoRequest(fanId: string, creatorId: string, status: string = 'pending') {
  const { data: videoRequest, error } = await supabase
    .from('video_requests')
    .insert({
      fan_id: fanId,
      creator_id: creatorId,
      request_type: 'personal',
      occasion: 'Birthday',
      recipient_name: 'Test User',
      instructions: 'Please say happy birthday!',
      price: 50.00,
      status: status,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create test video request: ${error.message}`)
  }

  return videoRequest
}

// Helper function to clean up test data
async function cleanupTestData(videoRequestId: string) {
  try {
    await supabase
      .from('video_requests')
      .delete()
      .eq('id', videoRequestId)
  } catch (error) {
    console.warn('Cleanup failed:', error)
  }
}

// Helper function to verify timeline step properties
async function verifyTimelineStep(
  page: Page,
  stepId: string,
  expectedTitle: string,
  shouldBeCompleted: boolean = false,
  shouldBeRejected: boolean = false
) {
  const stepSelector = `[data-timeline-step="${stepId}"], [data-testid="timeline-step-${stepId}"]`
  const fallbackSelector = `text=${expectedTitle}`

  // Try to find the step by data attribute first, fallback to text
  let stepElement = page.locator(stepSelector).first()
  if (await stepElement.count() === 0) {
    stepElement = page.locator(fallbackSelector).first()
  }

  await expect(stepElement).toBeVisible()

  if (shouldBeRejected) {
    // Verify rejection styling (red color)
    const iconContainer = page.locator('.bg-red-600').first()
    await expect(iconContainer).toBeVisible()

    const titleText = page.locator('.text-red-600').first()
    await expect(titleText).toBeVisible()
  } else if (shouldBeCompleted) {
    // Verify completion styling (purple color)
    const iconContainer = page.locator('.bg-purple-600').first()
    await expect(iconContainer).toBeVisible()
  }
}

// Helper function to navigate to order detail page
async function navigateToOrderDetail(page: Page, locale: string, orderId: string) {
  await page.goto(`/${locale}/fan/orders/${orderId}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  })

  // Wait for timeline to be visible
  await page.waitForSelector('.relative', { timeout: 10000 })
}

test.describe('Order Timeline Status - Simplified 4-Step Flow', () => {
  let testVideoRequestId: string

  test.afterEach(async () => {
    // Cleanup test data
    if (testVideoRequestId) {
      await cleanupTestData(testVideoRequestId)
    }
  })

  authenticatedTest('should display simplified 4-step timeline for pending order', async ({ fanPage }) => {
    // Create test video request
    const videoRequest = await createTestVideoRequest(TEST_USERS.fan.id, TEST_USERS.creator.id, 'pending')
    testVideoRequestId = videoRequest.id

    // Navigate to order detail page
    await navigateToOrderDetail(fanPage, 'en', videoRequest.id)

    // Verify all 4 steps are present (no recording or processing)
    await verifyTimelineStep(fanPage, 'placed', 'Order Placed', true)
    await verifyTimelineStep(fanPage, 'payment', 'Payment Confirmed', true)
    await verifyTimelineStep(fanPage, 'accepted', 'Creator Accepted', false)
    await verifyTimelineStep(fanPage, 'completed', 'Delivered', false)

    // Verify recording and processing steps are NOT present
    const recordingStep = fanPage.locator('text=Recording Video')
    const processingStep = fanPage.locator('text=Processing')
    await expect(recordingStep).not.toBeVisible()
    await expect(processingStep).not.toBeVisible()
  })

  authenticatedTest('should display rejection with X icon when order is rejected', async ({ fanPage }) => {
    // Create test video request with rejected status
    const videoRequest = await createTestVideoRequest(TEST_USERS.fan.id, TEST_USERS.creator.id, 'rejected')
    testVideoRequestId = videoRequest.id

    // Navigate to order detail page
    await navigateToOrderDetail(fanPage, 'en', videoRequest.id)

    // Verify rejection step with X icon and red styling
    await verifyTimelineStep(fanPage, 'accepted', 'Rejected', true, true)

    // Verify delivered step is disabled/grayed out
    const deliveredStep = fanPage.locator('text=Delivered').first()
    await expect(deliveredStep).toHaveClass(/text-gray-400/)
  })

  authenticatedTest('should show proper progress through acceptance flow', async ({ fanPage }) => {
    // Create test video request with accepted status
    const videoRequest = await createTestVideoRequest(TEST_USERS.fan.id, TEST_USERS.creator.id, 'accepted')
    testVideoRequestId = videoRequest.id

    // Navigate to order detail page
    await navigateToOrderDetail(fanPage, 'en', videoRequest.id)

    // Verify first 3 steps are completed
    await verifyTimelineStep(fanPage, 'placed', 'Order Placed', true)
    await verifyTimelineStep(fanPage, 'payment', 'Payment Confirmed', true)
    await verifyTimelineStep(fanPage, 'accepted', 'Creator Accepted', true)

    // Verify delivered step is pending
    await verifyTimelineStep(fanPage, 'completed', 'Delivered', false)
  })

  authenticatedTest('should show completed timeline for delivered order', async ({ fanPage }) => {
    // Create test video request with completed status
    const videoRequest = await createTestVideoRequest(TEST_USERS.fan.id, TEST_USERS.creator.id, 'completed')
    testVideoRequestId = videoRequest.id

    // Navigate to order detail page
    await navigateToOrderDetail(fanPage, 'en', videoRequest.id)

    // Verify all 4 steps are completed
    await verifyTimelineStep(fanPage, 'placed', 'Order Placed', true)
    await verifyTimelineStep(fanPage, 'payment', 'Payment Confirmed', true)
    await verifyTimelineStep(fanPage, 'accepted', 'Creator Accepted', true)
    await verifyTimelineStep(fanPage, 'completed', 'Delivered', true)
  })
})

test.describe('Order Timeline - Multi-locale Support', () => {
  let testVideoRequestId: string

  test.afterEach(async () => {
    if (testVideoRequestId) {
      await cleanupTestData(testVideoRequestId)
    }
  })

  authenticatedTest('should display timeline in French locale', async ({ fanPage }) => {
    const videoRequest = await createTestVideoRequest(TEST_USERS.fan.id, TEST_USERS.creator.id, 'pending')
    testVideoRequestId = videoRequest.id

    await navigateToOrderDetail(fanPage, 'fr', videoRequest.id)

    // Verify French translations
    await expect(fanPage.locator('text=Commande Placée')).toBeVisible()
    await expect(fanPage.locator('text=Paiement Confirmé')).toBeVisible()
    await expect(fanPage.locator('text=Créateur a Accepté')).toBeVisible()
    await expect(fanPage.locator('text=Livré')).toBeVisible()
  })

  authenticatedTest('should display timeline in Haitian Creole locale', async ({ fanPage }) => {
    const videoRequest = await createTestVideoRequest(TEST_USERS.fan.id, TEST_USERS.creator.id, 'pending')
    testVideoRequestId = videoRequest.id

    await navigateToOrderDetail(fanPage, 'ht', videoRequest.id)

    // Verify Haitian Creole translations
    await expect(fanPage.locator('text=Kòmand Pase')).toBeVisible()
    await expect(fanPage.locator('text=Peman Konfime')).toBeVisible()
    await expect(fanPage.locator('text=Kreyatè Aksepte')).toBeVisible()
    await expect(fanPage.locator('text=Livre')).toBeVisible()
  })

  authenticatedTest('should show rejection in French with proper styling', async ({ fanPage }) => {
    const videoRequest = await createTestVideoRequest(TEST_USERS.fan.id, TEST_USERS.creator.id, 'rejected')
    testVideoRequestId = videoRequest.id

    await navigateToOrderDetail(fanPage, 'fr', videoRequest.id)

    // Verify French rejection text with red styling
    await expect(fanPage.locator('text=Refusée')).toBeVisible()
    await expect(fanPage.locator('.bg-red-600')).toBeVisible()
  })

  authenticatedTest('should show rejection in Haitian Creole with proper styling', async ({ fanPage }) => {
    const videoRequest = await createTestVideoRequest(TEST_USERS.fan.id, TEST_USERS.creator.id, 'rejected')
    testVideoRequestId = videoRequest.id

    await navigateToOrderDetail(fanPage, 'ht', videoRequest.id)

    // Verify Haitian Creole rejection text with red styling
    await expect(fanPage.locator('text=Refize')).toBeVisible()
    await expect(fanPage.locator('.bg-red-600')).toBeVisible()
  })
})

test.describe('Order Timeline - Real-time Updates', () => {
  let testVideoRequestId: string

  test.afterEach(async () => {
    if (testVideoRequestId) {
      await cleanupTestData(testVideoRequestId)
    }
  })

  authenticatedTest('should update timeline when order status changes in database', async ({ fanPage }) => {
    // Create test video request with pending status
    const videoRequest = await createTestVideoRequest(TEST_USERS.fan.id, TEST_USERS.creator.id, 'pending')
    testVideoRequestId = videoRequest.id

    // Navigate to order detail page
    await navigateToOrderDetail(fanPage, 'en', videoRequest.id)

    // Verify initial state - Creator Accepted should be pending
    await expect(fanPage.locator('text=Creator Accepted').first()).toBeVisible()
    await expect(fanPage.locator('.bg-gray-200')).toBeVisible() // Pending state

    // Update order status to accepted in database
    await supabase
      .from('video_requests')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', videoRequest.id)

    // Wait for real-time update (should happen via notification system)
    await fanPage.waitForTimeout(2000)

    // Reload page to verify change (in real app this would be real-time)
    await fanPage.reload({ waitUntil: 'domcontentloaded' })

    // Verify Creator Accepted is now completed (purple)
    await expect(fanPage.locator('.bg-purple-600')).toHaveCount(3) // Placed + Payment + Accepted
  })
})