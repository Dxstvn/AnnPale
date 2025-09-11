# Stripe Integration Testing Guide

## Overview

This guide explains the difference between unit tests with mocks and real integration tests for Stripe, and how to properly test the 70/30 revenue split implementation.

## Test Types

### 1. Unit Tests with Mocks (❌ Not Real Integration Tests)
Location: `__tests__/integration/stripe/connect-onboarding.integration.test.ts`

These tests:
- Mock the Stripe SDK
- Mock database calls
- Don't interact with Stripe's infrastructure
- Test business logic in isolation
- Run fast and don't require network

**Problem:** They don't verify actual Stripe API behavior or webhook processing.

### 2. Real Integration Tests (✅ Actual Integration)
Location: `__tests__/integration/stripe/stripe-real.integration.test.ts`

These tests:
- Use real Stripe test API keys
- Create actual resources in Stripe's test environment
- Verify real API responses
- Test actual webhook delivery
- Validate the complete payment flow

## Running Real Stripe Integration Tests

### Prerequisites

1. **Stripe Test API Keys**
   ```bash
   # In .env.local
   STRIPE_SANDBOX_SECRET_KEY=sk_test_...
   STRIPE_SANDBOX_PUBLIC_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

2. **Stripe CLI Installation**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # or download from https://stripe.com/docs/stripe-cli
   ```

3. **Login to Stripe CLI**
   ```bash
   stripe login
   ```

### Running Tests

#### Quick Test (Mocked)
```bash
npm test -- __tests__/unit/stripe-connect.test.ts
```

#### Real Integration Tests
```bash
# Run real Stripe integration tests
npm run test:integration:stripe

# This sets ENABLE_STRIPE_INTEGRATION_TESTS=true
# Without this flag, tests are skipped to avoid CI issues
```

#### Webhook Testing
```bash
# Terminal 1: Start local server
npm run dev

# Terminal 2: Forward webhooks
npm run stripe:listen
# or
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Terminal 3: Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

## Interactive Webhook Testing

We provide an interactive script for webhook testing:

```bash
npm run stripe:webhook
```

This script provides options to:
1. Forward webhooks to local server
2. Trigger test webhook events
3. Create test payments with 70/30 split
4. List recent webhook events
5. Run full test suite

## Verifying the 70/30 Split

### In Code
The split is defined in `lib/stripe/connect-service.ts`:
```typescript
const PLATFORM_FEE_PERCENTAGE = 0.30 // Platform takes 30%
```

### In Real Tests
```typescript
// Create a $100 payment
const paymentIntent = await stripe.paymentIntents.create({
  amount: 10000, // $100 in cents
  application_fee_amount: 3000, // $30 platform fee (30%)
  transfer_data: {
    destination: connectedAccountId, // Creator gets remaining 70%
  }
})
```

### Verification Steps

1. **Check Payment Intent**
   ```bash
   stripe payment_intents retrieve pi_test_xxxx
   ```
   Verify:
   - `amount`: 10000 (total)
   - `application_fee_amount`: 3000 (30%)
   - Transfer to creator: 7000 (70%)

2. **Check in Stripe Dashboard**
   - Go to test dashboard: https://dashboard.stripe.com/test
   - Navigate to Payments
   - Click on a payment
   - Check "Transfer" and "Application fee" amounts

3. **Check Database Records**
   ```sql
   SELECT 
     amount,
     platform_fee,
     creator_earnings,
     (creator_earnings::float / amount) as creator_percentage
   FROM transactions
   WHERE stripe_payment_intent_id = 'pi_test_xxxx';
   ```

## Test Data Cleanup

Test mode data in Stripe cannot be fully deleted but doesn't affect production:
- Connected accounts persist but are isolated to test mode
- Payment intents remain for audit purposes
- Test customers can be archived but not deleted

## Common Issues

### Issue: "No such destination"
**Solution:** The connected account isn't properly onboarded. In test mode, you need to:
1. Create the account
2. Complete test onboarding (can't be automated)
3. Or use a pre-onboarded test account

### Issue: Webhooks not received
**Solution:**
1. Ensure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. Check webhook signing secret matches
3. Verify endpoint URL is correct

### Issue: Tests timeout
**Solution:** Increase timeout in test file:
```typescript
const TEST_TIMEOUT = 30000 // 30 seconds
test('...', async () => {
  // test code
}, TEST_TIMEOUT)
```

## Best Practices

1. **Use Test Helpers**
   ```typescript
   import { 
     createTestPaymentWith7030Split,
     verify7030Split 
   } from './__tests__/integration/stripe/test-helpers'
   ```

2. **Always Verify Splits**
   ```typescript
   const verification = verify7030Split(paymentIntent)
   expect(verification.isValid).toBe(true)
   expect(verification.creatorPercent).toBe(0.70)
   ```

3. **Test Both Success and Failure Cases**
   - Successful payments
   - Failed payments
   - Refunds with fee reversal
   - Partial refunds

4. **Use Stripe CLI for Webhook Testing**
   Don't mock webhooks - use real events from Stripe CLI

## CI/CD Considerations

For CI environments:
1. Tests are skipped by default (no `ENABLE_STRIPE_INTEGRATION_TESTS`)
2. Use mock tests for fast CI runs
3. Run real integration tests in staging deploys
4. Consider scheduled integration test runs

## Summary

✅ **Real Integration Testing Involves:**
- Real API calls to Stripe
- Actual webhook delivery
- Database persistence
- Complete payment flow
- Stripe CLI for webhook forwarding

❌ **Mock Tests Are Not Integration Tests:**
- They test business logic
- They don't verify API behavior
- They can't test webhooks
- They miss real-world edge cases

Always supplement mock tests with real integration tests to ensure your Stripe implementation works correctly!