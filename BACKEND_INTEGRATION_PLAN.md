# AnnPale Backend Integration Plan - Test-Driven Development Approach

## Executive Summary
This comprehensive TDD-based plan ensures every feature is built with testing first, with extensive integration and E2E tests that genuinely verify core functionality. Tests will use real authenticated sessions for fan, creator, and admin roles to test auth-guarded features. **Creators have full control over their subscription tiers and pricing.**

## Core Testing Strategy
- **Red-Green-Refactor Cycle**: Write failing tests → Implement feature → Refactor
- **Test Pyramid**: 70% Unit, 20% Integration, 10% E2E
- **Continuous Verification**: Run tests after each implementation step
- **Test Coverage Target**: Minimum 80% for critical paths
- **Authentication Testing**: Real login flows for all user roles

## UI/UX Design Requirements
All components created during backend integration must follow Ann Pale's design system:

### Design Principles
- **Brand Colors**: Purple (#9333EA) to Pink (#EC4899) gradient for CTAs and accents
- **Typography**: Geist font family throughout
- **Layout**: Card-based design with consistent shadows (`shadow-xl`, `shadow-2xl`)
- **Interactions**: 
  - Hover effects: `hover:shadow-xl hover:-translate-y-1` for elevation
  - Transitions: `transition-all` for smooth animations
- **Borders**: Purple-tinted borders (`border-purple-100` light, `border-purple-900` dark)
- **Backgrounds**: Clean white/dark backgrounds with purple accents
- **Cultural Elements**: Haitian imagery and emojis where appropriate
- **Responsive**: Mobile-first approach with proper breakpoints

### Component Standards
- **Dialogs/Modals**: White background with purple borders, shadow-2xl
- **Buttons**: Primary actions use gradient, secondary use purple borders
- **Cards**: Consistent shadows with hover elevation effects
- **Forms**: Purple focus states and validation colors
- **Toasts**: Purple-bordered with appropriate shadows

### Phase-Specific UI Requirements
- Each phase must maintain visual consistency with existing components
- New features should enhance, not disrupt, the established design language
- All components must be accessible and follow WCAG 2.1 guidelines

## Phase 0: Test Authentication Setup (Day 1) ✅ COMPLETED

### 0.1 Create Test Accounts & Auth Helpers ✅ COMPLETED
```typescript
// e2e/helpers/auth.helper.ts
export class AuthHelper {
  async createTestAccounts() {
    // Create accounts via Supabase Admin API
    const testFan = await createUser('testfan@annpale.test', 'TestFan123!', 'fan')
    const testCreator = await createUser('testcreator@annpale.test', 'TestCreator123!', 'creator')
    const testAdmin = await createUser('testadmin@annpale.test', 'TestAdmin123!', 'admin')
    return { testFan, testCreator, testAdmin }
  }

  async loginAs(page: Page, role: 'fan' | 'creator' | 'admin') {
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', `test${role}@annpale.test`)
    await page.fill('[data-testid="password-input"]', `Test${role.charAt(0).toUpperCase() + role.slice(1)}123!`)
    await page.click('[data-testid="login-button"]')
    await page.waitForURL(`/${role}/dashboard`)
    // Store auth session for reuse
    return await page.context().storageState()
  }
}

// e2e/fixtures/authenticated-test.ts
export const authenticatedTest = test.extend<{
  fanPage: Page
  creatorPage: Page
  adminPage: Page
}>({
  fanPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'e2e/.auth/fan.json'
    })
    const page = await context.newPage()
    await use(page)
  },
  creatorPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'e2e/.auth/creator.json'
    })
    const page = await context.newPage()
    await use(page)
  },
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'e2e/.auth/admin.json'
    })
    const page = await context.newPage()
    await use(page)
  }
})
```

### 0.2 Auth Guard Testing ✅ COMPLETED
```typescript
// e2e/auth/auth-guards.spec.ts
test.describe('Authentication Guards', () => {
  test('unauthenticated user redirected from /fan to /login', async ({ page }) => {
    await page.goto('/fan/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('fan cannot access creator dashboard', async ({ page }) => {
    const auth = new AuthHelper()
    await auth.loginAs(page, 'fan')
    await page.goto('/creator/dashboard')
    await expect(page).toHaveURL('/fan/dashboard') // Redirected back
  })

  test('creator cannot access admin dashboard', async ({ page }) => {
    const auth = new AuthHelper()
    await auth.loginAs(page, 'creator')
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL('/creator/dashboard')
  })
})
```

## Phase 1: Database Schema Enhancement & Testing Infrastructure (Days 2-4)

### 1.1 Comprehensive Database Integration Tests ✅ COMPLETED
```typescript
// __tests__/integration/database/creator-tiers.integration.test.ts
describe('Creator Tiers Database Integration', () => {
  let supabase: SupabaseClient
  let testCreatorId: string

  beforeAll(async () => {
    supabase = createClient()
    // Create test creator
    const { data: creator } = await supabase.auth.signUp({
      email: 'tier-test-creator@test.com',
      password: 'TestPass123!'
    })
    testCreatorId = creator.user.id
  })

  test('creator can create multiple subscription tiers', async () => {
    const tiers = [
      { name: 'Bronze', price: 10, benefits: ['Basic access'] },
      { name: 'Silver', price: 25, benefits: ['All Bronze perks', 'Exclusive content'] },
      { name: 'Gold', price: 50, benefits: ['All Silver perks', 'Monthly video call'] }
    ]

    for (const tier of tiers) {
      const { data, error } = await supabase
        .from('creator_subscription_tiers')
        .insert({
          creator_id: testCreatorId,
          ...tier
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data.name).toBe(tier.name)
      expect(data.price).toBe(tier.price)
    }

    // Verify all tiers exist
    const { data: allTiers } = await supabase
      .from('creator_subscription_tiers')
      .select('*')
      .eq('creator_id', testCreatorId)

    expect(allTiers).toHaveLength(3)
  })

  test('RLS policies prevent cross-creator tier access', async () => {
    // Create another creator
    const { data: otherCreator } = await supabase.auth.signUp({
      email: 'other-creator@test.com',
      password: 'TestPass123!'
    })

    // Try to modify first creator's tier as second creator
    const { error } = await supabase
      .from('creator_subscription_tiers')
      .update({ price: 999 })
      .eq('creator_id', testCreatorId)

    expect(error).not.toBeNull()
    expect(error.code).toBe('42501') // Insufficient privilege
  })
})
```

### 1.2 Database View Integration Tests [HIGH] ✅ COMPLETED
**Status: ✅ Complete**
- Created comprehensive database views for creator and platform statistics
- Implemented integration tests for all views with proper test data helpers
- All 24 tests passing with proper authentication and RLS validation

```typescript
// __tests__/integration/database/stats-views.integration.test.ts
describe('Stats Views Integration', () => {
  test('creator_stats view aggregates data correctly', async () => {
    // Create test data
    const creatorId = await createTestCreator()
    await createTestOrders(creatorId, 10)
    await createTestEarnings(creatorId, 5000)

    // Query view
    const { data: stats } = await supabase
      .from('creator_stats')
      .select('*')
      .eq('creator_id', creatorId)
      .single()

    expect(stats.total_earnings).toBe(5000)
    expect(stats.completed_videos).toBe(10)
    expect(stats.average_rating).toBeGreaterThan(0)
    expect(stats.completion_rate).toBeGreaterThan(0)
  })

  test('platform_stats view provides accurate metrics', async () => {
    const { data: stats } = await supabase
      .from('platform_stats')
      .select('*')
      .single()

    expect(stats).toMatchObject({
      total_users: expect.any(Number),
      total_creators: expect.any(Number),
      total_revenue: expect.any(Number),
      average_rating: expect.any(Number)
    })
  })
})
```

## Phase 2: Creator Subscription Tiers & Pricing System (Days 5-7)

### 2.1 Extensive E2E Tier Management Tests
```typescript
// e2e/creator/tier-management-complete.spec.ts
import { authenticatedTest } from '../fixtures/authenticated-test'

authenticatedTest.describe('Creator Tier Management Complete Flow', () => {
  authenticatedTest('creator sets up full tier system', async ({ creatorPage }) => {
    // Navigate to settings
    await creatorPage.goto('/creator/settings')
    await creatorPage.click('[data-testid="subscription-tiers-tab"]')

    // Create first tier
    await creatorPage.click('[data-testid="add-tier-button"]')
    await creatorPage.fill('[data-testid="tier-name"]', 'Fan Club')
    await creatorPage.fill('[data-testid="tier-price"]', '10')
    await creatorPage.fill('[data-testid="tier-description"]', 'Basic access to my content')
    
    // Add benefits
    await creatorPage.click('[data-testid="add-benefit"]')
    await creatorPage.fill('[data-testid="benefit-0"]', 'Access to exclusive posts')
    await creatorPage.click('[data-testid="add-benefit"]')
    await creatorPage.fill('[data-testid="benefit-1"]', 'Monthly newsletter')
    
    await creatorPage.click('[data-testid="save-tier"]')
    
    // Verify tier appears
    await expect(creatorPage.locator('[data-testid="tier-card-fan-club"]')).toBeVisible()
    await expect(creatorPage.locator('[data-testid="tier-price-fan-club"]')).toContainText('$10')

    // Create premium tier
    await creatorPage.click('[data-testid="add-tier-button"]')
    await creatorPage.fill('[data-testid="tier-name"]', 'VIP Access')
    await creatorPage.fill('[data-testid="tier-price"]', '50')
    await creatorPage.fill('[data-testid="tier-description"]', 'All perks plus personal interaction')
    await creatorPage.click('[data-testid="save-tier"]')

    // Test tier editing
    await creatorPage.click('[data-testid="edit-tier-fan-club"]')
    await creatorPage.fill('[data-testid="tier-price"]', '12')
    await creatorPage.click('[data-testid="save-changes"]')
    
    // Verify price updated
    await expect(creatorPage.locator('[data-testid="tier-price-fan-club"]')).toContainText('$12')

    // Test tier deactivation
    await creatorPage.click('[data-testid="tier-menu-vip-access"]')
    await creatorPage.click('[data-testid="deactivate-tier"]')
    await creatorPage.click('[data-testid="confirm-deactivate"]')
    
    // Verify tier marked as inactive
    await expect(creatorPage.locator('[data-testid="tier-status-vip-access"]')).toContainText('Inactive')
  })

  authenticatedTest('creator sets video request pricing', async ({ creatorPage }) => {
    await creatorPage.goto('/creator/settings')
    await creatorPage.click('[data-testid="video-pricing-tab"]')

    // Set different prices for video types
    const videoPrices = [
      { type: 'personal', price: '50' },
      { type: 'business', price: '150' },
      { type: 'roast', price: '75' },
      { type: 'pep_talk', price: '40' }
    ]

    for (const { type, price } of videoPrices) {
      await creatorPage.fill(`[data-testid="price-${type}"]`, price)
    }

    // Set rush delivery fee
    await creatorPage.fill('[data-testid="rush-delivery-fee"]', '25')
    
    // Enable bulk discount
    await creatorPage.check('[data-testid="enable-bulk-discount"]')
    await creatorPage.fill('[data-testid="bulk-discount-threshold"]', '5')
    await creatorPage.fill('[data-testid="bulk-discount-percentage"]', '15')

    await creatorPage.click('[data-testid="save-pricing"]')

    // Verify savings message
    await expect(creatorPage.locator('[data-testid="pricing-saved-message"]')).toBeVisible()

    // Navigate to public profile to verify pricing display
    await creatorPage.goto('/creator/public-preview')
    await expect(creatorPage.locator('[data-testid="video-price-personal"]')).toContainText('$50')
    await expect(creatorPage.locator('[data-testid="platform-fee-notice"]')).toContainText('You earn: $40')
  })
})
```

### 2.2 Fan Subscription Flow E2E Tests
```typescript
// e2e/fan/subscription-complete-flow.spec.ts
authenticatedTest.describe('Fan Subscription Complete Journey', () => {
  authenticatedTest('fan discovers creator and subscribes to tier', async ({ fanPage, page }) => {
    // Browse creators
    await fanPage.goto('/fan/discover')
    
    // Search for specific creator
    await fanPage.fill('[data-testid="search-creators"]', 'Marie Jean')
    await fanPage.press('[data-testid="search-creators"]', 'Enter')
    
    // Click on creator card
    await fanPage.click('[data-testid="creator-card-marie-jean"]')
    
    // View creator profile with tiers
    await expect(fanPage).toHaveURL(/\/creators\/[\w-]+/)
    await expect(fanPage.locator('[data-testid="creator-name"]')).toContainText('Marie Jean')
    
    // View available tiers
    const tiers = fanPage.locator('[data-testid^="tier-option-"]')
    await expect(tiers).toHaveCount(3)
    
    // Select middle tier
    await fanPage.click('[data-testid="tier-option-silver"]')
    await expect(fanPage.locator('[data-testid="tier-benefits-silver"]')).toBeVisible()
    await expect(fanPage.locator('[data-testid="tier-price-silver"]')).toContainText('$25/month')
    
    // Click subscribe
    await fanPage.click('[data-testid="subscribe-button-silver"]')
    
    // Fill payment details (Stripe Elements)
    const stripeFrame = fanPage.frameLocator('[data-testid="stripe-card-frame"]')
    await stripeFrame.locator('[placeholder="Card number"]').fill('4242424242424242')
    await stripeFrame.locator('[placeholder="MM / YY"]').fill('12/30')
    await stripeFrame.locator('[placeholder="CVC"]').fill('123')
    await stripeFrame.locator('[placeholder="ZIP"]').fill('10001')
    
    // Confirm subscription
    await fanPage.click('[data-testid="confirm-subscription"]')
    
    // Wait for success
    await expect(fanPage.locator('[data-testid="subscription-success"]')).toBeVisible()
    await expect(fanPage.locator('[data-testid="success-message"]')).toContainText('You are now subscribed to Silver tier')
    
    // Verify redirect to creator's exclusive content
    await fanPage.click('[data-testid="view-exclusive-content"]')
    await expect(fanPage).toHaveURL(/\/fan\/subscriptions\/[\w-]+/)
    
    // Verify tier badge appears
    await expect(fanPage.locator('[data-testid="user-tier-badge"]')).toContainText('Silver')
    
    // Test accessing tier-locked content
    await fanPage.click('[data-testid="post-silver-exclusive"]')
    await expect(fanPage.locator('[data-testid="post-content"]')).toBeVisible()
    
    // Try to access higher tier content (should be blocked)
    await fanPage.click('[data-testid="post-gold-exclusive"]')
    await expect(fanPage.locator('[data-testid="upgrade-prompt"]')).toBeVisible()
    await expect(fanPage.locator('[data-testid="upgrade-message"]')).toContainText('Upgrade to Gold tier')
  })

  authenticatedTest('fan manages multiple subscriptions', async ({ fanPage }) => {
    // Navigate to subscriptions
    await fanPage.goto('/fan/subscriptions')
    
    // Verify current subscriptions
    const subscriptions = fanPage.locator('[data-testid^="subscription-card-"]')
    await expect(subscriptions).toHaveCount(3)
    
    // Test filtering
    await fanPage.selectOption('[data-testid="filter-status"]', 'active')
    await expect(subscriptions).toHaveCount(2)
    
    // Test cancellation flow
    await fanPage.click('[data-testid="subscription-card-marie-jean"]')
    await fanPage.click('[data-testid="manage-subscription"]')
    await fanPage.click('[data-testid="cancel-subscription"]')
    
    // Confirm cancellation
    await fanPage.selectOption('[data-testid="cancellation-reason"]', 'too_expensive')
    await fanPage.fill('[data-testid="cancellation-feedback"]', 'The price increased recently')
    await fanPage.click('[data-testid="confirm-cancel"]')
    
    // Verify cancellation
    await expect(fanPage.locator('[data-testid="cancellation-confirmed"]')).toBeVisible()
    await expect(fanPage.locator('[data-testid="subscription-status-marie-jean"]')).toContainText('Cancels on')
  })
})
```

## Phase 3: Stripe Connect Integration with Dynamic Pricing (Days 8-11)

### 3.1 Comprehensive Payment Integration Tests
```typescript
// __tests__/integration/stripe/connect-onboarding.integration.test.ts
describe('Stripe Connect Onboarding Integration', () => {
  let stripeService: StripeConnectService
  let testCreatorId: string

  beforeAll(async () => {
    stripeService = new StripeConnectService()
    testCreatorId = await createTestCreator()
  })

  test('complete creator onboarding flow', async () => {
    // Start onboarding
    const { accountId, onboardingUrl } = await stripeService.createConnectedAccount(testCreatorId)
    
    expect(accountId).toMatch(/^acct_/)
    expect(onboardingUrl).toContain('https://connect.stripe.com')
    
    // Simulate completing onboarding (in test mode)
    await stripeService.simulateOnboardingComplete(accountId)
    
    // Verify account is ready
    const account = await stripeService.getAccount(accountId)
    expect(account.charges_enabled).toBe(true)
    expect(account.payouts_enabled).toBe(true)
    
    // Test creating a payment with split
    const paymentIntent = await stripeService.createPaymentWithSplit({
      amount: 100, // $100
      creatorAccountId: accountId,
      customerId: 'test_customer',
      metadata: {
        videoRequestId: 'req_123',
        tierName: 'Gold'
      }
    })
    
    // Verify split calculation
    expect(paymentIntent.amount).toBe(10000) // cents
    expect(paymentIntent.transfer_data.destination).toBe(accountId)
    expect(paymentIntent.application_fee_amount).toBe(2000) // 20% = $20
    
    // Simulate successful payment
    await stripeService.confirmPayment(paymentIntent.id)
    
    // Verify transfer created
    const transfers = await stripeService.getTransfers(accountId)
    expect(transfers[0].amount).toBe(8000) // Creator gets $80
  })

  test('handles refunds with fee reversal', async () => {
    // Create and confirm payment
    const payment = await stripeService.createAndConfirmPayment({
      amount: 50,
      creatorAccountId: 'acct_test',
      customerId: 'cust_test'
    })
    
    // Process refund
    const refund = await stripeService.refundPayment(payment.id, {
      reason: 'requested_by_customer',
      refundApplicationFee: true
    })
    
    expect(refund.status).toBe('succeeded')
    expect(refund.amount).toBe(5000)
    
    // Verify fee was reversed
    const feeRefunds = await stripeService.getApplicationFeeRefunds(payment.application_fee)
    expect(feeRefunds[0].amount).toBe(1000) // 20% of $50
  })
})
```

### 3.2 E2E Payment Flow Tests
```typescript
// e2e/payments/complete-payment-flow.spec.ts
authenticatedTest.describe('Complete Payment Flow E2E', () => {
  authenticatedTest('fan requests video with payment', async ({ fanPage, creatorPage }) => {
    // Fan navigates to creator profile
    await fanPage.goto('/creators/marie-jean')
    
    // Click request video
    await fanPage.click('[data-testid="request-video-button"]')
    
    // Fill video request form
    await fanPage.selectOption('[data-testid="video-type"]', 'personal')
    await fanPage.fill('[data-testid="recipient-name"]', 'John Smith')
    await fanPage.selectOption('[data-testid="occasion"]', 'birthday')
    await fanPage.fill('[data-testid="instructions"]', 'Please wish John a happy 30th birthday!')
    
    // Verify price calculation
    await expect(fanPage.locator('[data-testid="base-price"]')).toContainText('$50')
    await expect(fanPage.locator('[data-testid="platform-fee"]')).toContainText('$10')
    await expect(fanPage.locator('[data-testid="creator-earnings"]')).toContainText('Creator receives: $40')
    
    // Add rush delivery
    await fanPage.check('[data-testid="rush-delivery"]')
    await expect(fanPage.locator('[data-testid="rush-fee"]')).toContainText('$25')
    await expect(fanPage.locator('[data-testid="total-price"]')).toContainText('$75')
    
    // Continue to payment
    await fanPage.click('[data-testid="continue-to-payment"]')
    
    // Fill Stripe payment
    const stripeFrame = fanPage.frameLocator('[data-testid="stripe-payment-frame"]')
    await stripeFrame.locator('[placeholder="Card number"]').fill('4242424242424242')
    await stripeFrame.locator('[placeholder="MM / YY"]').fill('12/30')
    await stripeFrame.locator('[placeholder="CVC"]').fill('123')
    
    // Confirm payment
    await fanPage.click('[data-testid="confirm-payment"]')
    
    // Wait for success
    await fanPage.waitForSelector('[data-testid="payment-success"]')
    await expect(fanPage.locator('[data-testid="order-number"]')).toBeVisible()
    const orderId = await fanPage.locator('[data-testid="order-number"]').textContent()
    
    // Switch to creator account to verify order received
    await creatorPage.goto('/creator/orders')
    await creatorPage.waitForSelector(`[data-testid="order-${orderId}"]`)
    
    // Verify order details
    await creatorPage.click(`[data-testid="order-${orderId}"]`)
    await expect(creatorPage.locator('[data-testid="order-amount"]')).toContainText('$75')
    await expect(creatorPage.locator('[data-testid="your-earnings"]')).toContainText('$60') // 80% of $75
    await expect(creatorPage.locator('[data-testid="order-status"]')).toContainText('Pending')
    
    // Verify real-time notification
    await expect(creatorPage.locator('[data-testid="notification-badge"]')).toContainText('1')
    await creatorPage.click('[data-testid="notifications"]')
    await expect(creatorPage.locator('[data-testid="notification-message"]')).toContainText('New video request from')
  })
})
```

## Phase 4: Creator Order Management System (Days 12-15)

### 4.1 Extensive Order Management E2E Tests
```typescript
// e2e/creator/order-management-complete.spec.ts
authenticatedTest.describe('Creator Order Management Complete Flow', () => {
  let orderId: string

  authenticatedTest.beforeEach(async ({ page }) => {
    // Create test order
    orderId = await createTestVideoOrder({
      creatorId: 'test-creator',
      fanId: 'test-fan',
      price: 100,
      type: 'personal'
    })
  })

  authenticatedTest('creator fulfills video order end-to-end', async ({ creatorPage, fanPage }) => {
    // Creator views orders dashboard
    await creatorPage.goto('/creator/orders')
    
    // Verify order appears in pending tab
    await expect(creatorPage.locator('[data-testid="pending-count"]')).toContainText('1')
    await expect(creatorPage.locator(`[data-testid="order-${orderId}"]`)).toBeVisible()
    
    // Click to view order details
    await creatorPage.click(`[data-testid="order-${orderId}"]`)
    
    // Verify order information
    await expect(creatorPage.locator('[data-testid="order-instructions"]')).toBeVisible()
    await expect(creatorPage.locator('[data-testid="deadline"]')).toBeVisible()
    await expect(creatorPage.locator('[data-testid="fan-tier"]')).toContainText('Gold') // Shows fan's subscription tier
    
    // Accept order
    await creatorPage.click('[data-testid="accept-order"]')
    await expect(creatorPage.locator('[data-testid="order-status"]')).toContainText('In Progress')
    
    // Record video
    await creatorPage.click('[data-testid="record-video"]')
    
    // Grant camera permission and record
    await creatorPage.click('[data-testid="grant-permission"]')
    await creatorPage.waitForSelector('[data-testid="camera-preview"]')
    
    // Start recording
    await creatorPage.click('[data-testid="start-recording"]')
    await creatorPage.waitForTimeout(5000) // Record for 5 seconds
    await creatorPage.click('[data-testid="stop-recording"]')
    
    // Preview recording
    await expect(creatorPage.locator('[data-testid="video-preview"]')).toBeVisible()
    await creatorPage.click('[data-testid="play-preview"]')
    
    // Add personalized message
    await creatorPage.fill('[data-testid="personal-note"]', 'Hope you enjoy this video!')
    
    // Upload video
    await creatorPage.click('[data-testid="upload-video"]')
    await expect(creatorPage.locator('[data-testid="upload-progress"]')).toBeVisible()
    await creatorPage.waitForSelector('[data-testid="upload-complete"]', { timeout: 30000 })
    
    // Verify order marked as completed
    await expect(creatorPage.locator('[data-testid="order-status"]')).toContainText('Completed')
    
    // Check earnings updated
    await creatorPage.goto('/creator/earnings')
    await expect(creatorPage.locator('[data-testid="pending-earnings"]')).toContainText('$80')
    
    // Switch to fan account to verify delivery
    await fanPage.goto('/fan/orders')
    await fanPage.click(`[data-testid="order-${orderId}"]`)
    
    // Verify video received
    await expect(fanPage.locator('[data-testid="video-player"]')).toBeVisible()
    await fanPage.click('[data-testid="play-video"]')
    
    // Leave review
    await fanPage.click('[data-testid="leave-review"]')
    await fanPage.click('[data-testid="star-5"]')
    await fanPage.fill('[data-testid="review-text"]', 'Amazing video! Thank you so much!')
    await fanPage.click('[data-testid="submit-review"]')
    
    // Verify review appears
    await expect(fanPage.locator('[data-testid="review-submitted"]')).toBeVisible()
  })

  authenticatedTest('creator manages multiple orders efficiently', async ({ creatorPage }) => {
    // Create multiple test orders
    await createTestVideoOrder({ creatorId: 'test-creator', status: 'pending' })
    await createTestVideoOrder({ creatorId: 'test-creator', status: 'pending' })
    await createTestVideoOrder({ creatorId: 'test-creator', status: 'in_progress' })
    await createTestVideoOrder({ creatorId: 'test-creator', status: 'completed' })
    
    await creatorPage.goto('/creator/orders')
    
    // Test tab navigation
    await expect(creatorPage.locator('[data-testid="pending-count"]')).toContainText('3')
    await expect(creatorPage.locator('[data-testid="in-progress-count"]')).toContainText('1')
    await expect(creatorPage.locator('[data-testid="completed-count"]')).toContainText('1')
    
    // Test bulk actions
    await creatorPage.click('[data-testid="select-all"]')
    await creatorPage.click('[data-testid="bulk-accept"]')
    await creatorPage.click('[data-testid="confirm-bulk-accept"]')
    
    // Verify all moved to in-progress
    await creatorPage.click('[data-testid="in-progress-tab"]')
    await expect(creatorPage.locator('[data-testid^="order-"]')).toHaveCount(4)
    
    // Test filtering
    await creatorPage.fill('[data-testid="search-orders"]', 'birthday')
    await creatorPage.selectOption('[data-testid="filter-price"]', 'high-to-low')
    await creatorPage.click('[data-testid="apply-filters"]')
    
    // Test order prioritization
    await creatorPage.click('[data-testid="order-rush-delivery"]')
    await expect(creatorPage.locator('[data-testid="rush-badge"]')).toBeVisible()
  })
})
```

## Phase 5: Content Management & Feed System (Days 16-19)

### 5.1 Creator Post Management E2E Tests
```typescript
// e2e/creator/post-management-complete.spec.ts
authenticatedTest.describe('Creator Post Management', () => {
  authenticatedTest('creator creates tiered content post', async ({ creatorPage }) => {
    await creatorPage.goto('/creator/posts')
    
    // Click create new post
    await creatorPage.click('[data-testid="create-post"]')
    
    // Write post content
    await creatorPage.fill('[data-testid="post-title"]', 'Exclusive Behind the Scenes')
    
    // Use rich text editor
    const editor = creatorPage.locator('[data-testid="rich-text-editor"]')
    await editor.click()
    await editor.type('Check out this exclusive content from my latest project!')
    
    // Add media
    await creatorPage.click('[data-testid="add-media"]')
    await creatorPage.setInputFiles('[data-testid="media-upload"]', [
      'test-assets/video1.mp4',
      'test-assets/image1.jpg'
    ])
    
    // Wait for upload
    await creatorPage.waitForSelector('[data-testid="upload-complete"]')
    
    // Set tier visibility
    await creatorPage.click('[data-testid="tier-visibility"]')
    await creatorPage.check('[data-testid="tier-silver"]')
    await creatorPage.check('[data-testid="tier-gold"]')
    
    // Preview how each tier sees it
    await creatorPage.click('[data-testid="preview-as"]')
    await creatorPage.selectOption('[data-testid="preview-tier"]', 'bronze')
    await expect(creatorPage.locator('[data-testid="locked-content"]')).toBeVisible()
    
    await creatorPage.selectOption('[data-testid="preview-tier"]', 'silver')
    await expect(creatorPage.locator('[data-testid="full-content"]')).toBeVisible()
    
    // Schedule post
    await creatorPage.check('[data-testid="schedule-post"]')
    await creatorPage.fill('[data-testid="schedule-date"]', '2025-01-15')
    await creatorPage.fill('[data-testid="schedule-time"]', '14:00')
    
    // Publish
    await creatorPage.click('[data-testid="publish-post"]')
    await expect(creatorPage.locator('[data-testid="post-published"]')).toBeVisible()
    
    // Verify in posts list
    await creatorPage.goto('/creator/posts')
    await expect(creatorPage.locator('[data-testid="scheduled-posts"]')).toContainText('1')
  })

  authenticatedTest('creator manages content library', async ({ creatorPage }) => {
    await creatorPage.goto('/creator/content')
    
    // View analytics for posts
    await creatorPage.click('[data-testid="post-analytics"]')
    await expect(creatorPage.locator('[data-testid="total-views"]')).toBeVisible()
    await expect(creatorPage.locator('[data-testid="engagement-rate"]')).toBeVisible()
    await expect(creatorPage.locator('[data-testid="tier-breakdown"]')).toBeVisible()
    
    // Edit existing post
    await creatorPage.click('[data-testid="edit-post-1"]')
    await creatorPage.fill('[data-testid="post-title"]', 'Updated: Exclusive Content')
    await creatorPage.click('[data-testid="save-changes"]')
    
    // Delete post
    await creatorPage.click('[data-testid="delete-post-2"]')
    await creatorPage.click('[data-testid="confirm-delete"]')
    await expect(creatorPage.locator('[data-testid="post-deleted"]')).toBeVisible()
  })
})
```

### 5.2 Fan Feed Experience E2E Tests
```typescript
// e2e/fan/feed-experience-complete.spec.ts
authenticatedTest.describe('Fan Feed Experience', () => {
  authenticatedTest('fan interacts with personalized feed', async ({ fanPage }) => {
    await fanPage.goto('/fan/home')
    
    // Verify feed loads with real data
    await fanPage.waitForSelector('[data-testid="feed-item"]')
    const feedItems = fanPage.locator('[data-testid="feed-item"]')
    await expect(feedItems).toHaveCount(10) // Initial load
    
    // Interact with post
    const firstPost = feedItems.first()
    await firstPost.locator('[data-testid="like-button"]').click()
    await expect(firstPost.locator('[data-testid="like-count"]')).toContainText('1')
    
    // Comment on post
    await firstPost.locator('[data-testid="comment-button"]').click()
    await fanPage.fill('[data-testid="comment-input"]', 'Great content!')
    await fanPage.press('[data-testid="comment-input"]', 'Enter')
    await expect(firstPost.locator('[data-testid="comment-count"]')).toContainText('1')
    
    // Share post
    await firstPost.locator('[data-testid="share-button"]').click()
    await fanPage.click('[data-testid="copy-link"]')
    await expect(fanPage.locator('[data-testid="link-copied"]')).toBeVisible()
    
    // Test infinite scroll
    await fanPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await fanPage.waitForSelector('[data-testid="feed-item"]:nth-child(20)')
    await expect(feedItems).toHaveCount(20)
    
    // Test tier-locked content
    const lockedPost = fanPage.locator('[data-testid="locked-post"]').first()
    await expect(lockedPost.locator('[data-testid="lock-icon"]')).toBeVisible()
    await lockedPost.click()
    
    // Upgrade prompt appears
    await expect(fanPage.locator('[data-testid="upgrade-modal"]')).toBeVisible()
    await expect(fanPage.locator('[data-testid="required-tier"]')).toContainText('Gold')
    await expect(fanPage.locator('[data-testid="upgrade-price"]')).toContainText('$50/month')
    
    // Test real-time updates
    // Simulate creator posting new content
    await createNewPost({ creatorId: 'subscribed-creator', tier: 'silver' })
    
    // New post notification appears
    await expect(fanPage.locator('[data-testid="new-posts-notification"]')).toBeVisible()
    await fanPage.click('[data-testid="load-new-posts"]')
    
    // Verify new post at top of feed
    const newPost = feedItems.first()
    await expect(newPost.locator('[data-testid="post-timestamp"]')).toContainText('Just now')
  })

  authenticatedTest('fan discovers content through explore', async ({ fanPage }) => {
    await fanPage.goto('/fan/explore')
    
    // Test trending content
    await fanPage.click('[data-testid="trending-tab"]')
    await expect(fanPage.locator('[data-testid="trending-post"]')).toHaveCount(10)
    
    // Test category filtering
    await fanPage.click('[data-testid="category-music"]')
    const musicPosts = fanPage.locator('[data-testid="post-category-music"]')
    await expect(musicPosts).toHaveCount(await musicPosts.count())
    
    // Test search
    await fanPage.fill('[data-testid="search-content"]', 'comedy')
    await fanPage.press('[data-testid="search-content"]', 'Enter')
    await expect(fanPage.locator('[data-testid="search-result"]')).toHaveCountGreaterThan(0)
  })
})
```

## Phase 6: Analytics & Reporting (Days 20-22)

### 6.1 Comprehensive Analytics Integration Tests
```typescript
// __tests__/integration/analytics/creator-analytics.integration.test.ts
describe('Creator Analytics Integration', () => {
  test('calculates accurate earnings over time', async () => {
    const creatorId = await createTestCreator()
    
    // Create various transactions
    await createTransaction({ creatorId, amount: 100, date: '2025-01-01' })
    await createTransaction({ creatorId, amount: 200, date: '2025-01-15' })
    await createTransaction({ creatorId, amount: 150, date: '2025-02-01' })
    
    const analytics = new AnalyticsService()
    const earnings = await analytics.getCreatorEarnings(creatorId, {
      startDate: '2025-01-01',
      endDate: '2025-02-28'
    })
    
    expect(earnings.total).toBe(450)
    expect(earnings.platformFees).toBe(90) // 20%
    expect(earnings.creatorNet).toBe(360) // 80%
    expect(earnings.byMonth).toEqual({
      'January 2025': 300,
      'February 2025': 150
    })
  })

  test('tracks tier performance metrics', async () => {
    const creatorId = await createTestCreator()
    await createCreatorTiers(creatorId, ['Bronze', 'Silver', 'Gold'])
    await createSubscribers(creatorId, {
      bronze: 50,
      silver: 30,
      gold: 10
    })
    
    const tierAnalytics = await analytics.getTierPerformance(creatorId)
    
    expect(tierAnalytics.bronze.subscribers).toBe(50)
    expect(tierAnalytics.bronze.mrr).toBe(500) // 50 * $10
    expect(tierAnalytics.silver.subscribers).toBe(30)
    expect(tierAnalytics.silver.mrr).toBe(750) // 30 * $25
    expect(tierAnalytics.gold.subscribers).toBe(10)
    expect(tierAnalytics.gold.mrr).toBe(500) // 10 * $50
    expect(tierAnalytics.totalMRR).toBe(1750)
  })
})
```

### 6.2 Analytics Dashboard E2E Tests
```typescript
// e2e/analytics/dashboard-complete.spec.ts
authenticatedTest.describe('Analytics Dashboard Complete Tests', () => {
  authenticatedTest('creator views comprehensive analytics', async ({ creatorPage }) => {
    await creatorPage.goto('/creator/analytics')
    
    // Verify all metrics load
    await expect(creatorPage.locator('[data-testid="total-earnings"]')).toBeVisible()
    await expect(creatorPage.locator('[data-testid="monthly-earnings"]')).toBeVisible()
    await expect(creatorPage.locator('[data-testid="average-order-value"]')).toBeVisible()
    await expect(creatorPage.locator('[data-testid="completion-rate"]')).toBeVisible()
    
    // Test date range selector
    await creatorPage.click('[data-testid="date-range"]')
    await creatorPage.click('[data-testid="last-30-days"]')
    await expect(creatorPage.locator('[data-testid="chart"]')).toBeVisible()
    
    // Test chart interactions
    await creatorPage.hover('[data-testid="chart-datapoint-15"]')
    await expect(creatorPage.locator('[data-testid="tooltip"]')).toBeVisible()
    await expect(creatorPage.locator('[data-testid="tooltip-value"]')).toContainText('$')
    
    // Export data
    await creatorPage.click('[data-testid="export-data"]')
    await creatorPage.click('[data-testid="export-csv"]')
    const download = await creatorPage.waitForEvent('download')
    expect(download.suggestedFilename()).toContain('analytics')
    
    // View tier breakdown
    await creatorPage.click('[data-testid="tier-analytics-tab"]')
    await expect(creatorPage.locator('[data-testid="tier-chart"]')).toBeVisible()
    await expect(creatorPage.locator('[data-testid="tier-bronze-revenue"]')).toBeVisible()
    await expect(creatorPage.locator('[data-testid="tier-silver-revenue"]')).toBeVisible()
    await expect(creatorPage.locator('[data-testid="tier-gold-revenue"]')).toBeVisible()
  })

  authenticatedTest('admin views platform-wide metrics', async ({ adminPage }) => {
    await adminPage.goto('/admin/analytics')
    
    // Platform metrics
    await expect(adminPage.locator('[data-testid="total-users"]')).toBeVisible()
    await expect(adminPage.locator('[data-testid="active-creators"]')).toBeVisible()
    await expect(adminPage.locator('[data-testid="platform-revenue"]')).toBeVisible()
    await expect(adminPage.locator('[data-testid="average-commission"]')).toContainText('20%')
    
    // Real-time dashboard
    await adminPage.click('[data-testid="real-time-tab"]')
    await expect(adminPage.locator('[data-testid="active-users-now"]')).toBeVisible()
    await expect(adminPage.locator('[data-testid="orders-last-hour"]')).toBeVisible()
    
    // Creator rankings
    await adminPage.click('[data-testid="top-creators-tab"]')
    const topCreators = adminPage.locator('[data-testid^="creator-rank-"]')
    await expect(topCreators).toHaveCount(10)
    await expect(topCreators.first().locator('[data-testid="creator-earnings"]')).toBeVisible()
  })
})
```

## Phase 7: Complete Integration Testing (Days 23-25)

### 7.1 End-to-End User Journey Tests
```typescript
// e2e/journeys/complete-platform-journey.spec.ts
authenticatedTest.describe('Complete Platform Journey', () => {
  authenticatedTest('full creator journey from signup to payout', async ({ page }) => {
    // 1. Creator signup
    await page.goto('/signup')
    await page.click('[data-testid="signup-as-creator"]')
    await page.fill('[data-testid="email"]', 'newcreator@test.com')
    await page.fill('[data-testid="password"]', 'SecurePass123!')
    await page.fill('[data-testid="name"]', 'Test Creator')
    await page.click('[data-testid="create-account"]')
    
    // 2. Email verification (simulate)
    await page.goto('/auth/verify?token=test-token')
    await expect(page.locator('[data-testid="verification-success"]')).toBeVisible()
    
    // 3. Complete profile
    await page.goto('/creator/onboarding')
    await page.fill('[data-testid="bio"]', 'Professional content creator')
    await page.setInputFiles('[data-testid="avatar"]', 'test-assets/avatar.jpg')
    await page.selectOption('[data-testid="category"]', 'entertainment')
    await page.click('[data-testid="continue"]')
    
    // 4. Set up tiers
    await page.fill('[data-testid="tier-1-name"]', 'Starter')
    await page.fill('[data-testid="tier-1-price"]', '10')
    await page.fill('[data-testid="tier-2-name"]', 'Pro')
    await page.fill('[data-testid="tier-2-price"]', '30')
    await page.click('[data-testid="save-tiers"]')
    
    // 5. Stripe Connect onboarding
    await page.click('[data-testid="setup-payouts"]')
    await page.waitForURL(/connect\.stripe\.com/)
    // Simulate Stripe onboarding completion
    await page.goto('/creator/onboarding/complete?account=acct_test')
    
    // 6. Receive first order
    await createTestVideoOrder({ creatorId: 'newcreator', amount: 100 })
    await page.goto('/creator/orders')
    await expect(page.locator('[data-testid="new-order-notification"]')).toBeVisible()
    
    // 7. Fulfill order
    await page.click('[data-testid="order-1"]')
    await page.click('[data-testid="accept-order"]')
    await page.setInputFiles('[data-testid="upload-video"]', 'test-assets/video.mp4')
    await page.click('[data-testid="deliver-video"]')
    
    // 8. Check earnings
    await page.goto('/creator/earnings')
    await expect(page.locator('[data-testid="pending-payout"]')).toContainText('$80')
    
    // 9. Request payout
    await page.click('[data-testid="request-payout"]')
    await expect(page.locator('[data-testid="payout-scheduled"]')).toBeVisible()
  })

  authenticatedTest('complete fan journey with multiple interactions', async ({ page }) => {
    // 1. Fan discovers platform
    await page.goto('/')
    await page.click('[data-testid="browse-creators"]')
    
    // 2. Sign up
    await page.click('[data-testid="signup"]')
    await page.fill('[data-testid="email"]', 'newfan@test.com')
    await page.fill('[data-testid="password"]', 'FanPass123!')
    await page.click('[data-testid="create-account"]')
    
    // 3. Browse and filter creators
    await page.goto('/fan/discover')
    await page.selectOption('[data-testid="filter-category"]', 'music')
    await page.selectOption('[data-testid="filter-price"]', '0-50')
    await page.click('[data-testid="apply-filters"]')
    
    // 4. Subscribe to creator
    await page.click('[data-testid="creator-marie-jean"]')
    await page.click('[data-testid="subscribe-silver"]')
    await completeStripePayment(page, '4242424242424242')
    
    // 5. Access exclusive content
    await page.goto('/fan/subscriptions/marie-jean')
    await expect(page.locator('[data-testid="exclusive-posts"]')).toHaveCountGreaterThan(0)
    
    // 6. Request personalized video
    await page.click('[data-testid="request-video"]')
    await fillVideoRequestForm(page)
    await completeStripePayment(page, '4242424242424242')
    
    // 7. Receive and review video
    await page.waitForTimeout(5000) // Simulate creator fulfillment
    await page.goto('/fan/orders')
    await page.click('[data-testid="completed-order"]')
    await page.click('[data-testid="play-video"]')
    await page.click('[data-testid="leave-review"]')
    await page.click('[data-testid="5-stars"]')
    await page.fill('[data-testid="review"]', 'Amazing!')
    await page.click('[data-testid="submit-review"]')
    
    // 8. Interact with feed
    await page.goto('/fan/home')
    await page.click('[data-testid="like-post"]')
    await page.fill('[data-testid="comment"]', 'Great content!')
    await page.press('[data-testid="comment"]', 'Enter')
    
    // 9. Manage subscription
    await page.goto('/fan/subscriptions')
    await page.click('[data-testid="manage-marie-jean"]')
    await page.click('[data-testid="upgrade-to-gold"]')
    await expect(page.locator('[data-testid="tier-upgraded"]')).toBeVisible()
  })
})
```

## Testing Infrastructure & Commands

### Test Database Setup
```typescript
// scripts/setup-test-db.ts
export async function setupTestDatabase() {
  // Create test database
  await execSync('npx supabase db reset')
  
  // Run migrations
  await execSync('npx supabase db push')
  
  // Seed test data
  await seedTestAccounts()
  await seedTestCreators()
  await seedTestContent()
  await seedTestOrders()
}
```

### Continuous Testing Pipeline
```yaml
# .github/workflows/test-pipeline.yml
name: Complete Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run test:unit -- --coverage
      - run: npm run test:integration
      
  e2e-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: supabase/postgres
      stripe:
        image: stripe/stripe-mock
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npx playwright install
      - run: npm run test:e2e
      
  load-tests:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - run: npm run test:load
```

### Test Execution Commands
```bash
# Development testing
npm run test:watch          # Watch mode for TDD
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests
npm run test:e2e:headed     # E2E with browser
npm run test:e2e:debug      # Debug E2E tests

# CI/CD testing
npm run test:ci             # All tests for CI
npm run test:coverage       # Coverage report
npm run test:e2e:parallel   # Parallel E2E execution

# Specific feature testing
npm run test:payments       # Payment system tests
npm run test:orders         # Order management tests
npm run test:auth           # Authentication tests
npm run test:feed           # Feed system tests

# Performance testing
npm run test:load           # Load testing
npm run test:stress         # Stress testing
```

## Success Metrics & Verification

### Test Coverage Requirements
- Unit Tests: 85% coverage minimum
- Integration Tests: All API endpoints tested
- E2E Tests: All critical user paths covered
- Performance: <3s page load, <200ms API response

### Verification Checklist
- [ ] All auth guards properly tested
- [ ] Payment split calculations verified
- [ ] Creator tier system fully functional
- [ ] Real-time notifications working
- [ ] Video upload/delivery complete
- [ ] Feed personalization accurate
- [ ] Analytics calculations correct
- [ ] Mobile responsiveness tested
- [ ] Cross-browser compatibility verified
- [ ] Security vulnerabilities checked

## Implementation Timeline

### Week 1: Foundation & Testing Infrastructure
- Day 1: Set up test authentication and helpers
- Days 2-4: Create database schema migrations and views

### Week 2: Creator Features & Payments
- Days 5-7: Implement creator tier and pricing system
- Days 8-11: Set up Stripe Connect integration

### Week 3: Orders & Content
- Days 12-15: Build creator order management system
- Days 16-19: Create content management and feed system

### Week 4: Analytics & Polish
- Days 20-22: Build analytics and reporting
- Days 23-25: Complete integration testing

## Next Steps
1. Review and approve this plan
2. Set up test infrastructure
3. Begin Phase 0 implementation
4. Run tests continuously during development
5. Deploy to staging for QA testing

This comprehensive TDD plan ensures every feature is thoroughly tested with real authentication, extensive integration tests, and complete E2E scenarios that verify the entire platform works correctly from multiple user perspectives.