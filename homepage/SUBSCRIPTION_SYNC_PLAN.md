# Subscription Management Synchronization Plan

## Executive Summary
This plan outlines the complete migration from dual-table subscription tracking (`creator_subscriptions` and `subscription_orders`) to a single unified `subscription_orders` table that maintains 100% synchronization with Stripe.

## Current State Analysis

### Two Separate Tables Problem
- **`creator_subscriptions`**: Simple table, minimal Stripe integration
- **`subscription_orders`**: Complete table with full payment tracking and Stripe integration
- **Issue**: Frontend reads from `creator_subscriptions`, but Stripe operations update `subscription_orders`
- **Result**: Data inconsistency causing subscriptions to appear/disappear

## Completed Steps ✅

### Phase 1: Immediate Fix (COMPLETED)
1. ✅ Updated `/api/subscriptions/list` to query `subscription_orders`
2. ✅ Mapped fields correctly for backward compatibility
3. ✅ Updated `SubscriptionManagement` component to handle both field formats
4. ✅ Tested subscription display in fan portal

### Phase 2: Data Migration (COMPLETED)
1. ✅ Created migration script: `20250926_migrate_subscriptions_to_orders.sql`
2. ✅ Migration includes:
   - Transfer existing subscriptions to `subscription_orders`
   - Calculate proper platform fees (30%) and creator earnings (70%)
   - Create backward-compatibility view `creator_subscriptions_view`
   - Add performance indexes

### Phase 3: Webhook Handling (PARTIALLY COMPLETE)
1. ✅ `/api/stripe/subscriptions/webhook` already updates `subscription_orders`
2. ✅ Handles: `customer.subscription.created`, `.updated`, `.deleted`
3. ⚠️ Need to add: `.paused`, `.resumed`, `invoice.payment_succeeded`

## Remaining Work

### Phase 4: Complete API Migration (2-3 hours)
Update remaining APIs to use `subscription_orders`:

#### 1. `/api/subscriptions/subscribe`
- Currently creates in `creator_subscriptions`
- Update to create in `subscription_orders`
- Include Stripe subscription ID

#### 2. `/api/subscriptions/manage`
- Update status changes to sync with `subscription_orders`
- Ensure Stripe webhook also updates same record

#### 3. `/api/content/access`
- Check subscription access using `subscription_orders`
- Consider subscription status and expiry dates

#### 4. Post visibility checks
- Update any queries that check `creator_subscriptions`
- Use `subscription_orders` or the compatibility view

### Phase 5: Enhanced Webhook Handling (2 hours)
Add missing webhook events:

```typescript
// Add to /api/stripe/subscriptions/webhook/route.ts

case 'customer.subscription.paused':
  // Update status to 'paused' in subscription_orders

case 'customer.subscription.resumed':
  // Update status to 'active' in subscription_orders

case 'invoice.payment_succeeded':
  // Update payment dates and ensure subscription is active

case 'invoice.payment_failed':
  // Update failed payment count
  // Set status to 'pending' after grace period
```

### Phase 6: Reconciliation System (3 hours)
Create daily sync job to ensure consistency:

```typescript
// /app/api/cron/sync-subscriptions/route.ts
export async function GET() {
  // 1. Fetch all Stripe subscriptions
  // 2. Compare with subscription_orders
  // 3. Update any mismatched records
  // 4. Alert on discrepancies
}
```

### Phase 7: Monitoring Dashboard (2 hours)
Create admin dashboard to monitor subscription health:

- Total active subscriptions
- Stripe vs Database mismatches
- Failed payment trends
- Revenue tracking
- Subscription lifecycle metrics

## Database Schema Decision

### Recommendation: Use `subscription_orders` Exclusively
**Reasons:**
1. Complete Stripe integration fields
2. Financial tracking (fees, earnings)
3. Billing lifecycle management
4. Already used by payment operations
5. Supports all subscription states

### Migration Strategy:
1. **Short term**: Use compatibility view for old code
2. **Medium term**: Update all code to use `subscription_orders`
3. **Long term**: Archive `creator_subscriptions` table

## Implementation Checklist

- [x] Update `/api/subscriptions/list` endpoint
- [x] Fix frontend field mapping
- [x] Create data migration script
- [x] Run migration in production
- [x] Update `/api/subscriptions/subscribe`
- [x] Update `/api/subscriptions/manage` (via list route)
- [x] Update content access checks (checkout/validate)
- [x] Add missing webhook events
- [x] Create reconciliation job
- [x] Build monitoring dashboard
- [ ] Run monitoring tables migration
- [ ] Test complete subscription flow
- [ ] Archive old table (after 30 days)

## Testing Plan

### Integration Tests:
1. Create new subscription → Verify in `subscription_orders`
2. Pause subscription → Verify status update
3. Resume subscription → Verify billing resumes
4. Cancel subscription → Verify access until period end
5. Payment failure → Verify status changes

### End-to-End Tests:
1. Complete subscription flow with real Stripe
2. Verify webhook updates database
3. Check subscription appears in fan portal
4. Test payment method updates
5. Verify cancellation flow

## Rollback Plan

If issues arise:
1. Revert API changes to use `creator_subscriptions`
2. Use compatibility view for transition
3. Manually sync critical subscriptions
4. Monitor and fix incrementally

## Success Metrics

- **Zero** subscription display inconsistencies
- **100%** match between Stripe and database
- **< 1 second** subscription status updates
- **Zero** missed webhook events
- **100%** payment reconciliation accuracy

## Timeline

- **Day 1**: Complete API migrations (4 hours)
- **Day 2**: Enhanced webhooks + reconciliation (5 hours)
- **Day 3**: Monitoring dashboard + testing (4 hours)
- **Day 4-5**: Production deployment + monitoring
- **Day 30**: Archive old table

## Notes

- Always use `subscription_orders` for new features
- Keep compatibility view for 30 days minimum
- Monitor webhook reliability closely
- Document any custom subscription logic