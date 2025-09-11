#!/bin/bash

# E2E Subscription Test Runner with Money Transfer Verification
# This script runs the subscription test and properly captures the exit code

echo "🚀 Starting E2E Subscription Test with Money Transfer Verification"
echo "=================================================="

# Set up environment
export NODE_ENV=test

# Ensure we're in the right directory
cd "$(dirname "$0")/.." || exit 1

# Check if dev server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "⚠️  Dev server not running. Please start it with 'npm run dev' in another terminal."
    exit 1
fi

# Check if Stripe CLI is listening
if ! pgrep -f "stripe listen" > /dev/null; then
    echo "⚠️  Stripe CLI not listening. Starting it in background..."
    stripe listen --forward-to localhost:3000/api/webhooks/stripe > stripe-webhook.log 2>&1 &
    STRIPE_PID=$!
    echo "Started Stripe CLI with PID: $STRIPE_PID"
    sleep 3
fi

echo ""
echo "📋 Test Configuration:"
echo "  - Test Creator ID: 0f3753a3-029c-473a-9aee-fc107d10c569"
echo "  - Stripe Account: acct_1S3TOyEM4K7HiodW"
echo "  - Test Price: $9.99 (Gold Tier)"
echo "  - Expected Split: 70% to creator ($6.99), 30% platform fee ($3.00)"
echo ""

# Create output directory for test results
mkdir -p test-results

# Run the test with detailed output
echo "🧪 Running Playwright test..."
echo "=================================================="

# Run test and capture output
npx playwright test e2e/subscription-system-complete.spec.ts \
    --reporter=list \
    --output=test-results \
    2>&1 | tee test-results/subscription-test-output.log

# Capture exit code
EXIT_CODE=$?

echo ""
echo "=================================================="

# Analyze results
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ TEST PASSED - All assertions successful"
    echo ""
    echo "🎉 Successfully verified:"
    echo "  ✓ Fan can subscribe to creator"
    echo "  ✓ Subscription checkout completes"
    echo "  ✓ Webhook events are received"
    echo "  ✓ 70% transferred to creator account"
    echo "  ✓ 30% platform fee collected"
    echo "  ✓ Database records created with correct split"
else
    echo "❌ TEST FAILED - Exit code: $EXIT_CODE"
    echo ""
    echo "📋 Check the following:"
    echo "  - test-results/subscription-test-output.log for full output"
    echo "  - stripe-webhook.log for webhook events"
    echo "  - Browser screenshots in test-results/"
    
    # Show last few lines of error
    echo ""
    echo "Last error in test output:"
    tail -20 test-results/subscription-test-output.log | grep -E "Error:|Failed:|✗"
fi

# Clean up Stripe CLI if we started it
if [ ! -z "$STRIPE_PID" ]; then
    echo ""
    echo "Stopping Stripe CLI (PID: $STRIPE_PID)..."
    kill $STRIPE_PID 2>/dev/null
fi

echo ""
echo "📊 Test Summary:"
echo "  - Duration: $(grep "Finished the run" test-results/subscription-test-output.log | cut -d'(' -f2 | cut -d')' -f1 || echo "N/A")"
echo "  - Exit Code: $EXIT_CODE"
echo "  - Timestamp: $(date)"

exit $EXIT_CODE