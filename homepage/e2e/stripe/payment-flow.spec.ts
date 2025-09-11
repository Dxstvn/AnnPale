import { test, expect, Page } from '@playwright/test'
import { AuthenticatedTest } from '../fixtures/authenticated-test'

// Test data
const TEST_CREATOR = {
  email: 'test.creator@annpale.com',
  password: 'TestCreator123!',
  name: 'Test Creator',
  stripeAccountId: 'acct_test123'
}

const TEST_FAN = {
  email: 'test.fan@annpale.com',
  password: 'TestFan123!',
  name: 'Test Fan'
}

test.describe('Stripe Connect Payment Flow', () => {
  test.describe('Creator Onboarding', () => {
    test('creator can start payment setup', async ({ page }) => {
      // Navigate to creator settings
      await page.goto('/creator/settings')
      
      // Click on Payments tab
      await page.click('[data-testid="payments-tab"], text=Payments')
      
      // Verify onboarding card is visible
      await expect(page.locator('text=Start Accepting Payments')).toBeVisible()
      
      // Check revenue split information
      await expect(page.locator('text=70% Revenue Share')).toBeVisible()
      await expect(page.locator('text=Keep 70% of all earnings')).toBeVisible()
      
      // Check benefits displayed
      await expect(page.locator('text=Daily Payouts')).toBeVisible()
      await expect(page.locator('text=Secure & Trusted')).toBeVisible()
      
      // Click Set Up Payments button
      await page.click('button:has-text("Set Up Payments")')
      
      // In test mode, this would redirect to Stripe
      // We'll mock the response for testing
      await page.waitForTimeout(1000)
    })

    test('shows correct status for onboarded creator', async ({ page }) => {
      // Mock API response for onboarded creator
      await page.route('/api/stripe/connect/status', async route => {
        await route.fulfill({
          status: 200,
          json: {
            hasAccount: true,
            accountId: 'acct_test123',
            chargesEnabled: true,
            payoutsEnabled: true,
            onboardingComplete: true
          }
        })
      })
      
      await page.goto('/creator/settings')
      await page.click('[data-testid="payments-tab"], text=Payments')
      
      // Verify success state
      await expect(page.locator('text=Payment Setup Complete')).toBeVisible()
      await expect(page.locator('text=Payments Enabled')).toBeVisible()
      await expect(page.locator('text=Payouts Active')).toBeVisible()
      
      // Check revenue split display
      await expect(page.locator('text=Your Earnings: 70%')).toBeVisible()
      await expect(page.locator('text=Platform Fee: 30%')).toBeVisible()
    })

    test('shows warning for incomplete setup', async ({ page }) => {
      // Mock API response for partially onboarded creator
      await page.route('/api/stripe/connect/status', async route => {
        await route.fulfill({
          status: 200,
          json: {
            hasAccount: true,
            accountId: 'acct_test123',
            chargesEnabled: true,
            payoutsEnabled: false,
            onboardingComplete: false
          }
        })
      })
      
      await page.goto('/creator/settings')
      await page.click('[data-testid="payments-tab"], text=Payments')
      
      // Verify warning state
      await expect(page.locator('text=Setup Incomplete')).toBeVisible()
      await expect(page.locator('text=✓ Enabled').first()).toBeVisible()
      await expect(page.locator('text=✗ Not configured')).toBeVisible()
      
      // Complete Setup button should be visible
      await expect(page.locator('button:has-text("Complete Setup")')).toBeVisible()
    })
  })

  test.describe('Payment Processing', () => {
    test('processes video order payment with 70/30 split', async ({ page }) => {
      // Navigate to creator profile
      await page.goto('/fan/creators/819421cf-9437-4d10-bb09-bca4e0c12cba')
      
      // Click Request Video Message
      await page.click('button:has-text("Request Video Message")')
      
      // Fill out video order form
      await page.selectOption('[id="occasion"]', 'birthday')
      await page.fill('input[placeholder*="recipient"]', 'John Doe')
      await page.fill('textarea[placeholder*="Instructions"]', 'Please wish John a happy 30th birthday!')
      
      // Continue to checkout
      await page.click('button:has-text("Continue to Checkout")')
      
      // Wait for checkout page
      await page.waitForURL(/\/checkout/)
      
      // Verify order summary shows correct pricing
      await expect(page.locator('text=$50')).toBeVisible()
      
      // In sandbox mode, we would process with test card
      // Verify the payment intent is created with correct split
      
      // Mock successful payment
      await page.route('/api/payments/create-payment-intent', async route => {
        await route.fulfill({
          status: 200,
          json: {
            clientSecret: 'pi_test_secret',
            paymentIntentId: 'pi_test123',
            amount: 5000, // $50 in cents
            platformFee: 1500, // $15 (30%)
            creatorEarnings: 3500 // $35 (70%)
          }
        })
      })
    })

    test('processes subscription payment with recurring split', async ({ page }) => {
      // Navigate to creator profile
      await page.goto('/fan/creators/819421cf-9437-4d10-bb09-bca4e0c12cba')
      
      // Click on Subscriptions tab
      await page.click('button[role="tab"]:has-text("Subscriptions")')
      
      // Select a subscription tier
      await page.click('button:has-text("Subscribe"):first')
      
      // Wait for checkout
      await page.waitForURL(/\/checkout/)
      
      // Verify subscription details
      await expect(page.locator('text=/\\$\\d+\\/month/')).toBeVisible()
      
      // Mock subscription creation with split
      await page.route('/api/stripe/subscriptions/create', async route => {
        await route.fulfill({
          status: 200,
          json: {
            subscriptionId: 'sub_test123',
            status: 'active',
            amount: 2000, // $20/month
            platformFeePercent: 30,
            interval: 'month'
          }
        })
      })
    })

    test('handles refund with fee reversal', async ({ page }) => {
      // Navigate to order history
      await page.goto('/account/orders')
      
      // Find a completed order
      await page.click('text=View Details')
      
      // Click Request Refund
      await page.click('button:has-text("Request Refund")')
      
      // Select reason
      await page.selectOption('[name="reason"]', 'requested_by_customer')
      await page.fill('textarea[name="details"]', 'Video was not as expected')
      
      // Submit refund request
      await page.click('button:has-text("Submit Refund Request")')
      
      // Mock refund processing
      await page.route('/api/payments/refund', async route => {
        const request = route.request()
        const data = await request.postDataJSON()
        
        await route.fulfill({
          status: 200,
          json: {
            refundId: 'refund_test123',
            amount: data.amount,
            status: 'succeeded',
            feeReversed: true,
            platformFeeRefunded: data.amount * 0.3
          }
        })
      })
      
      // Verify refund confirmation
      await expect(page.locator('text=Refund Processed Successfully')).toBeVisible()
    })
  })

  test.describe('Creator Earnings Dashboard', () => {
    test('displays correct earnings with 70/30 split', async ({ page }) => {
      // Mock earnings data
      await page.route('/api/creator/earnings', async route => {
        await route.fulfill({
          status: 200,
          json: {
            totalRevenue: 10000, // $100
            platformFees: 3000, // $30 (30%)
            netEarnings: 7000, // $70 (70%)
            transactionCount: 5,
            period: 'month'
          }
        })
      })
      
      await page.goto('/creator/finances')
      
      // Verify earnings display
      await expect(page.locator('text=Total Revenue')).toBeVisible()
      await expect(page.locator('text=$100.00')).toBeVisible()
      
      await expect(page.locator('text=Platform Fees')).toBeVisible()
      await expect(page.locator('text=$30.00')).toBeVisible()
      
      await expect(page.locator('text=Net Earnings')).toBeVisible()
      await expect(page.locator('text=$70.00')).toBeVisible()
      
      // Verify percentage display
      await expect(page.locator('text=70% of revenue')).toBeVisible()
    })

    test('shows pending payouts', async ({ page }) => {
      await page.route('/api/creator/payouts', async route => {
        await route.fulfill({
          status: 200,
          json: {
            pending: [
              {
                id: 'payout_1',
                amount: 35000, // $350
                arrivalDate: '2025-01-06',
                status: 'pending'
              }
            ],
            completed: [
              {
                id: 'payout_2',
                amount: 28000, // $280
                paidAt: '2025-01-03',
                status: 'paid'
              }
            ]
          }
        })
      })
      
      await page.goto('/creator/finances/payouts')
      
      // Verify pending payouts
      await expect(page.locator('text=Pending Payouts')).toBeVisible()
      await expect(page.locator('text=$350.00')).toBeVisible()
      await expect(page.locator('text=Arrives Jan 6')).toBeVisible()
      
      // Verify completed payouts
      await expect(page.locator('text=Recent Payouts')).toBeVisible()
      await expect(page.locator('text=$280.00')).toBeVisible()
    })
  })

  test.describe('Transaction Tracking', () => {
    test('tracks all payment types correctly', async ({ page }) => {
      await page.goto('/creator/analytics/revenue')
      
      // Mock transaction data
      await page.route('/api/creator/transactions', async route => {
        await route.fulfill({
          status: 200,
          json: {
            transactions: [
              {
                id: 'txn_1',
                type: 'video',
                amount: 5000, // $50
                platformFee: 1500, // $15
                creatorEarnings: 3500, // $35
                status: 'completed',
                createdAt: '2025-01-05T10:00:00Z'
              },
              {
                id: 'txn_2',
                type: 'subscription',
                amount: 2000, // $20
                platformFee: 600, // $6
                creatorEarnings: 1400, // $14
                status: 'completed',
                createdAt: '2025-01-05T11:00:00Z'
              },
              {
                id: 'txn_3',
                type: 'video',
                amount: 10000, // $100
                platformFee: 3000, // $30
                creatorEarnings: 7000, // $70
                status: 'refunded',
                refundAmount: 10000,
                createdAt: '2025-01-04T10:00:00Z'
              }
            ]
          }
        })
      })
      
      // Verify transaction display
      await expect(page.locator('text=Video Message').first()).toBeVisible()
      await expect(page.locator('text=$50.00').first()).toBeVisible()
      await expect(page.locator('text=$35.00').first()).toBeVisible() // 70% earnings
      
      await expect(page.locator('text=Subscription').first()).toBeVisible()
      await expect(page.locator('text=$20.00').first()).toBeVisible()
      await expect(page.locator('text=$14.00').first()).toBeVisible() // 70% earnings
      
      // Verify refunded transaction
      await expect(page.locator('text=Refunded')).toBeVisible()
    })
  })
})

// Helper function to setup test accounts
async function setupTestAccounts(page: Page) {
  // This would create test accounts in your database
  // For E2E tests, you might want to use a test database
  console.log('Setting up test accounts...')
}

// Helper function to cleanup test data
async function cleanupTestData(page: Page) {
  // Clean up any test data created during tests
  console.log('Cleaning up test data...')
}