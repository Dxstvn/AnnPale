#!/usr/bin/env node

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yijizsscwkvepljqojkz.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNTI3NzIsImV4cCI6MjA0MTgyODc3Mn0.a8obCCT-GSpTqmySMWvvNVrwzRu-_mo4cKCjwbeVJSA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Utility function to prompt user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = (question) => new Promise(resolve => rl.question(question, resolve));

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

async function authenticateUser() {
  log('\n=== User Authentication ===', 'cyan');

  const email = await prompt('Enter user email (or press Enter for test account): ');
  const password = await prompt('Enter password: ');

  const testEmail = email || 'dustinjasmin@outlook.com';
  const testPassword = password || 'test123';

  log(`\nAuthenticating as ${testEmail}...`, 'yellow');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });

  if (error) {
    log(`Authentication failed: ${error.message}`, 'red');
    throw error;
  }

  log('Authentication successful!', 'green');
  return { user: data.user, session: data.session };
}

async function fetchSubscriptions(token) {
  log('\n=== Fetching User Subscriptions ===', 'cyan');

  const response = await fetch(`${BASE_URL}/api/subscriptions/list`, {
    headers: {
      'Cookie': `sb-yijizsscwkvepljqojkz-auth-token=${token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    log(`Failed to fetch subscriptions: ${error}`, 'red');
    return [];
  }

  const data = await response.json();
  const subscriptions = data.subscriptions || [];

  if (subscriptions.length === 0) {
    log('No active subscriptions found', 'yellow');
    return [];
  }

  log(`Found ${subscriptions.length} subscription(s):`, 'green');
  subscriptions.forEach((sub, index) => {
    log(`  ${index + 1}. ${sub.creator.name} - ${sub.tier.name} ($${sub.tier.price}/month) - Status: ${sub.status}`, 'blue');
  });

  return subscriptions;
}

async function testPauseResume(subscription, token) {
  log('\n=== Testing Pause/Resume Functionality ===', 'cyan');

  // Test pause
  log('Testing pause subscription...', 'yellow');
  const pauseResponse = await fetch(`${BASE_URL}/api/stripe/subscriptions/manage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `sb-yijizsscwkvepljqojkz-auth-token=${token}`
    },
    body: JSON.stringify({
      subscriptionOrderId: subscription.id,
      action: 'pause'
    })
  });

  if (!pauseResponse.ok) {
    const error = await pauseResponse.text();
    log(`Failed to pause subscription: ${error}`, 'red');
    return false;
  }

  const pauseData = await pauseResponse.json();
  log('Subscription paused successfully!', 'green');
  log(`  Stripe status: ${pauseData.subscription?.status || 'N/A'}`, 'blue');

  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test resume
  log('\nTesting resume subscription...', 'yellow');
  const resumeResponse = await fetch(`${BASE_URL}/api/stripe/subscriptions/manage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `sb-yijizsscwkvepljqojkz-auth-token=${token}`
    },
    body: JSON.stringify({
      subscriptionOrderId: subscription.id,
      action: 'resume'
    })
  });

  if (!resumeResponse.ok) {
    const error = await resumeResponse.text();
    log(`Failed to resume subscription: ${error}`, 'red');
    return false;
  }

  const resumeData = await resumeResponse.json();
  log('Subscription resumed successfully!', 'green');
  log(`  Stripe status: ${resumeData.subscription?.status || 'N/A'}`, 'blue');

  return true;
}

async function testCancel(subscription, token) {
  log('\n=== Testing Cancel Functionality ===', 'cyan');

  const confirm = await prompt('Are you sure you want to test cancellation? (y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    log('Cancellation test skipped', 'yellow');
    return false;
  }

  log('Testing cancel subscription...', 'yellow');
  const cancelResponse = await fetch(`${BASE_URL}/api/stripe/subscriptions/manage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `sb-yijizsscwkvepljqojkz-auth-token=${token}`
    },
    body: JSON.stringify({
      subscriptionOrderId: subscription.id,
      action: 'cancel'
    })
  });

  if (!cancelResponse.ok) {
    const error = await cancelResponse.text();
    log(`Failed to cancel subscription: ${error}`, 'red');
    return false;
  }

  const cancelData = await cancelResponse.json();
  log('Subscription cancelled successfully!', 'green');
  log(`  Will remain active until: ${new Date(cancelData.subscription?.current_period_end * 1000).toLocaleDateString() || 'end of period'}`, 'blue');
  log(`  Cancel at period end: ${cancelData.subscription?.cancel_at_period_end}`, 'blue');

  // Test reactivation
  const reactivate = await prompt('Do you want to test reactivation? (y/n): ');
  if (reactivate.toLowerCase() === 'y') {
    log('\nTesting reactivate subscription...', 'yellow');
    const reactivateResponse = await fetch(`${BASE_URL}/api/stripe/subscriptions/manage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sb-yijizsscwkvepljqojkz-auth-token=${token}`
      },
      body: JSON.stringify({
        subscriptionOrderId: subscription.id,
        action: 'reactivate'
      })
    });

    if (!reactivateResponse.ok) {
      const error = await reactivateResponse.text();
      log(`Failed to reactivate subscription: ${error}`, 'red');
      return false;
    }

    const reactivateData = await reactivateResponse.json();
    log('Subscription reactivated successfully!', 'green');
    log(`  Stripe status: ${reactivateData.subscription?.status || 'N/A'}`, 'blue');
  }

  return true;
}

async function testPaymentMethodUpdate(subscription, token) {
  log('\n=== Testing Payment Method Update ===', 'cyan');

  log('Requesting Stripe Customer Portal session...', 'yellow');
  const response = await fetch(`${BASE_URL}/api/stripe/subscriptions/payment-method`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `sb-yijizsscwkvepljqojkz-auth-token=${token}`
    },
    body: JSON.stringify({
      subscriptionId: subscription.id
    })
  });

  if (!response.ok) {
    const error = await response.text();
    log(`Failed to get Customer Portal URL: ${error}`, 'red');
    return false;
  }

  const data = await response.json();
  if (data.url) {
    log('Customer Portal URL generated successfully!', 'green');
    log(`Portal URL: ${data.url}`, 'blue');
    log('(This URL would redirect the user to Stripe\'s Customer Portal)', 'yellow');
  } else {
    log('No portal URL received', 'red');
    return false;
  }

  return true;
}

async function verifyDatabaseState(subscriptionId) {
  log('\n=== Verifying Database State ===', 'cyan');

  // Check creator_subscriptions table
  const { data: creatorSub, error: creatorError } = await supabase
    .from('creator_subscriptions')
    .select('*')
    .eq('id', subscriptionId)
    .single();

  if (!creatorError && creatorSub) {
    log('Found in creator_subscriptions table:', 'green');
    log(`  Status: ${creatorSub.status}`, 'blue');
    log(`  Stripe ID: ${creatorSub.stripe_subscription_id || 'None'}`, 'blue');
    log(`  Updated: ${new Date(creatorSub.updated_at).toLocaleString()}`, 'blue');
    return true;
  }

  // Check subscription_orders table as fallback
  const { data: order, error: orderError } = await supabase
    .from('subscription_orders')
    .select('*')
    .eq('id', subscriptionId)
    .single();

  if (!orderError && order) {
    log('Found in subscription_orders table:', 'green');
    log(`  Status: ${order.status}`, 'blue');
    log(`  Stripe ID: ${order.stripe_subscription_id || 'None'}`, 'blue');
    log(`  Updated: ${new Date(order.updated_at).toLocaleString()}`, 'blue');
    return true;
  }

  log('Subscription not found in database', 'red');
  return false;
}

async function runTests() {
  try {
    log('\n' + '='.repeat(50), 'bright');
    log('   SUBSCRIPTION MANAGEMENT TEST SUITE', 'bright');
    log('='.repeat(50) + '\n', 'bright');

    // Authenticate user
    const { session } = await authenticateUser();
    const token = session.access_token;

    // Fetch subscriptions
    const subscriptions = await fetchSubscriptions(token);
    if (subscriptions.length === 0) {
      log('\nNo subscriptions to test. Please create a subscription first.', 'yellow');
      rl.close();
      return;
    }

    // Select subscription to test
    let selectedSub;
    if (subscriptions.length === 1) {
      selectedSub = subscriptions[0];
      log(`\nUsing subscription: ${selectedSub.creator.name}`, 'cyan');
    } else {
      const index = await prompt(`\nSelect subscription to test (1-${subscriptions.length}): `);
      selectedSub = subscriptions[parseInt(index) - 1];
      if (!selectedSub) {
        log('Invalid selection', 'red');
        rl.close();
        return;
      }
    }

    // Run tests
    let results = {
      pauseResume: false,
      cancel: false,
      paymentMethod: false,
      database: false
    };

    // Test pause/resume
    const testPause = await prompt('\nTest pause/resume functionality? (y/n): ');
    if (testPause.toLowerCase() === 'y') {
      results.pauseResume = await testPauseResume(selectedSub, token);
    }

    // Test payment method update
    const testPayment = await prompt('\nTest payment method update? (y/n): ');
    if (testPayment.toLowerCase() === 'y') {
      results.paymentMethod = await testPaymentMethodUpdate(selectedSub, token);
    }

    // Test cancellation (do this last as it changes state)
    const testCancelConfirm = await prompt('\nTest cancel functionality? (y/n): ');
    if (testCancelConfirm.toLowerCase() === 'y') {
      results.cancel = await testCancel(selectedSub, token);
    }

    // Verify database state
    results.database = await verifyDatabaseState(selectedSub.id);

    // Summary
    log('\n' + '='.repeat(50), 'bright');
    log('   TEST RESULTS SUMMARY', 'bright');
    log('='.repeat(50), 'bright');

    Object.entries(results).forEach(([test, passed]) => {
      const testName = test.replace(/([A-Z])/g, ' $1').trim();
      const status = passed ? `✅ PASSED` : `❌ FAILED`;
      const color = passed ? 'green' : 'red';
      log(`${testName}: ${status}`, color);
    });

    const totalPassed = Object.values(results).filter(r => r).length;
    const totalTests = Object.values(results).length;
    log(`\nOverall: ${totalPassed}/${totalTests} tests passed`, totalPassed === totalTests ? 'green' : 'yellow');

  } catch (error) {
    log(`\nUnexpected error: ${error.message}`, 'red');
    console.error(error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Run the test suite
runTests();