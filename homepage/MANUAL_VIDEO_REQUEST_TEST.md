# Manual Video Request Test Guide

## Prerequisites

1. **Development Server Running**
   ```bash
   npm run dev
   ```

2. **Stripe CLI Webhook Forwarding**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. **Test Accounts**
   - Fan: `testfan@annpale.test` / `TestPassword123!`
   - Creator: `testcreator@annpale.test` / `TestPassword123!`

## Test Steps

### Step 1: Open Two Browser Windows

1. **Browser 1 (Fan)**: Open http://localhost:3000
2. **Browser 2 (Creator)**: Open http://localhost:3000 in incognito/private window

### Step 2: Login Both Users

**Browser 1 - Fan Login:**
1. Click "Login" 
2. Enter email: `testfan@annpale.test`
3. Enter password: `TestPassword123!`
4. Click "Sign In"
5. Should redirect to `/fan/home`

**Browser 2 - Creator Login:**
1. Click "Login"
2. Enter email: `testcreator@annpale.test`  
3. Enter password: `TestPassword123!`
4. Click "Sign In"
5. Should redirect to `/creator/dashboard`

### Step 3: Creator Dashboard Initial State

**In Browser 2 (Creator):**
1. Note the current "Pending Orders" count
2. Note the current "Total Earnings" amount
3. Keep this tab open to monitor for notifications

### Step 4: Fan Requests Video

**In Browser 1 (Fan):**
1. Navigate to "Explore Creators" or go to `/fan/explore`
2. Find and click on "Test Creator" profile
3. Click "Request Video" button
4. Fill out the form:
   - Recipient Name: `John Smith`
   - Occasion: Select `Birthday`
   - Instructions: `Please wish John a happy 30th birthday!`
5. Click "Continue to Checkout"

### Step 5: Payment Process

**In Browser 1 (Fan):**
1. **Verify you're on `/checkout` page**
2. **Verify price shows $50.00**
3. Enter Stripe test card details:
   - Card Number: `4242 4242 4242 4242`
   - Expiry: `12/30`
   - CVC: `123`
   - ZIP: `10001`
4. Click "Pay $50.00 USD"
5. Wait for payment processing

### Step 6: Verify Payment Split

**Check Stripe CLI Output:**
Look for webhook events showing:
```
payment_intent.succeeded
```

**Expected Split:**
- Total Amount: $50.00
- Creator Share (70%): $35.00
- Platform Fee (30%): $15.00

### Step 7: Verify Creator Notification

**In Browser 2 (Creator Dashboard):**

Within 5-10 seconds after payment:
1. ✅ **Check for notification popup/toast** showing new video request
2. ✅ **Pending Orders count should increase by 1**
3. ✅ **Refresh the page** if needed
4. ✅ **Navigate to "Requests" tab** to see the new video request

### Step 8: Verify Database Records

Run these queries to verify the payment split:

```bash
# Check the order was created with correct split
NEXT_PUBLIC_SUPABASE_URL="https://yijizsscwkvepljqojkz.supabase.co" \
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1OTMyODgsImV4cCI6MjA3MjE2OTI4OH0.ot_XW1tE42_MPuOpoSslnxYcz89TGyDKSkT8IGaGqX8" \
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

(async () => {
  // Get latest order
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  if (order) {
    console.log('Latest Order:');
    console.log('- Total Amount: $' + order.amount);
    console.log('- Creator Earnings: $' + order.creator_earnings);
    console.log('- Platform Fee: $' + order.platform_fee);
    console.log('- Status: ' + order.status);
    
    // Verify 70/30 split
    const expectedCreatorEarnings = order.amount * 0.70;
    const expectedPlatformFee = order.amount * 0.30;
    
    console.log('\\nVerification:');
    console.log('✓ Creator gets 70%: ' + (Math.abs(order.creator_earnings - expectedCreatorEarnings) < 0.01));
    console.log('✓ Platform gets 30%: ' + (Math.abs(order.platform_fee - expectedPlatformFee) < 0.01));
  }
})();
"
```

### Step 9: Verify Stripe Connect Transfer

Check that money was transferred to creator's Stripe Connect account:

```bash
# Check creator's Stripe Connect balance
stripe balance_transactions list \
  --stripe-account acct_1S3TOyEM4K7HiodW \
  --limit 1
```

### Step 10: Verify Fan's Order History

**In Browser 1 (Fan):**
1. Navigate to "My Orders" or `/fan/orders`
2. ✅ Verify the new video request appears
3. ✅ Check status shows "pending" or "paid"
4. ✅ Verify amount shows $50.00

## Success Criteria

✅ **Payment Processing:**
- Payment completes successfully
- Fan is redirected to success page

✅ **70/30 Split Verification:**
- Database shows correct split ($35 creator, $15 platform)
- Stripe webhook confirms payment_intent.succeeded

✅ **Creator Notification:**
- Creator sees real-time notification
- Pending orders count increases
- New request appears in creator's request list

✅ **Money Transfer:**
- Stripe Connect transfer initiated to creator account
- Platform fee retained in platform account

✅ **Order Tracking:**
- Order appears in fan's order history
- Order appears in creator's request queue

## Troubleshooting

**If payment doesn't complete:**
- Check Stripe CLI is running and forwarding webhooks
- Verify test card details are correct
- Check browser console for errors

**If creator doesn't get notification:**
- Refresh creator dashboard
- Check browser console for WebSocket errors
- Verify both users are properly logged in

**If split is incorrect:**
- Check `orders` table in database
- Verify webhook processing in Stripe CLI output
- Check `/api/webhooks/stripe` endpoint logs

## Additional Verification Commands

```bash
# Check recent payments in Stripe
stripe payment_intents list --limit 3

# Check webhook events
stripe events list --limit 5

# Check creator's pending balance
stripe balance retrieve --stripe-account acct_1S3TOyEM4K7HiodW
```

## Notes

- Test card `4242 4242 4242 4242` always succeeds
- Creator's test Stripe account: `acct_1S3TOyEM4K7HiodW`
- Platform retains 30% fee before transfer to creator
- Transfers to creator may take a few seconds to appear in Stripe