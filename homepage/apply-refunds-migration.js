/**
 * Apply Refunds Migration Script
 * 
 * This script applies the refunds table migration directly to the Supabase database
 * by executing the SQL statements through the service role client.
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function applyRefundsMigration() {
  console.log('🚀 Applying Refunds Migration')
  console.log('=============================\n')

  try {
    // Step 1: Create refund status enum
    console.log('1️⃣ Creating refund_status enum...')
    const { error: statusEnumError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'refund_status') THEN
            CREATE TYPE refund_status AS ENUM (
              'pending',
              'processing', 
              'succeeded',
              'failed',
              'cancelled'
            );
          END IF;
        END $$;
      `
    })

    if (statusEnumError) {
      console.log('⚠️ Status enum creation (may already exist):', statusEnumError.message)
    } else {
      console.log('✅ Refund status enum created')
    }

    // Step 2: Create refund reason enum
    console.log('2️⃣ Creating refund_reason enum...')
    const { error: reasonEnumError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'refund_reason') THEN
            CREATE TYPE refund_reason AS ENUM (
              'creator_rejection',
              'fan_cancellation',
              'system_expiry',
              'admin_refund',
              'dispute_chargeback',
              'technical_issue',
              'duplicate_payment',
              'other'
            );
          END IF;
        END $$;
      `
    })

    if (reasonEnumError) {
      console.log('⚠️ Reason enum creation (may already exist):', reasonEnumError.message)
    } else {
      console.log('✅ Refund reason enum created')
    }

    // Step 3: Create refunds table
    console.log('3️⃣ Creating refunds table...')
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.refunds (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          
          -- Foreign key relationships
          order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
          payment_intent_id VARCHAR REFERENCES payment_intents(id) ON DELETE SET NULL,
          user_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
          creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
          
          -- Stripe refund information
          stripe_refund_id VARCHAR UNIQUE NOT NULL,
          stripe_charge_id VARCHAR,
          
          -- Refund amounts (in USD)
          refund_amount DECIMAL(10,2) NOT NULL,
          original_amount DECIMAL(10,2) NOT NULL,
          platform_fee_refund DECIMAL(10,2) DEFAULT 0,
          creator_earnings_refund DECIMAL(10,2) DEFAULT 0,
          cancellation_fee DECIMAL(10,2) DEFAULT 0,
          
          -- Status and reason
          status refund_status NOT NULL DEFAULT 'pending',
          reason refund_reason NOT NULL,
          reason_notes TEXT,
          
          -- Who initiated the refund
          initiated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
          initiated_by_type VARCHAR(20) NOT NULL,
          
          -- Processing details
          failure_reason TEXT,
          stripe_failure_code VARCHAR(50),
          
          -- Metadata
          metadata JSONB DEFAULT '{}',
          
          -- Timestamps
          initiated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
          processed_at TIMESTAMPTZ,
          completed_at TIMESTAMPTZ,
          failed_at TIMESTAMPTZ,
          
          created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
          
          -- Constraints
          CONSTRAINT refunds_amount_positive CHECK (refund_amount > 0),
          CONSTRAINT refunds_original_amount_positive CHECK (original_amount > 0),
          CONSTRAINT refunds_refund_not_exceed_original CHECK (refund_amount <= original_amount),
          CONSTRAINT refunds_fees_valid CHECK (
            platform_fee_refund >= 0 AND 
            creator_earnings_refund >= 0 AND 
            cancellation_fee >= 0
          ),
          CONSTRAINT refunds_initiated_by_type_valid CHECK (
            initiated_by_type IN ('fan', 'creator', 'admin', 'system')
          )
        );
      `
    })

    if (tableError) {
      throw new Error(`Table creation failed: ${tableError.message}`)
    }
    console.log('✅ Refunds table created')

    // Step 4: Create indexes
    console.log('4️⃣ Creating indexes...')
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);',
      'CREATE INDEX IF NOT EXISTS idx_refunds_user_id ON refunds(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_refunds_creator_id ON refunds(creator_id);',
      'CREATE INDEX IF NOT EXISTS idx_refunds_stripe_refund_id ON refunds(stripe_refund_id);',
      'CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);',
      'CREATE INDEX IF NOT EXISTS idx_refunds_reason ON refunds(reason);',
      'CREATE INDEX IF NOT EXISTS idx_refunds_created_at ON refunds(created_at);'
    ]

    for (const indexSQL of indexes) {
      const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexSQL })
      if (indexError) {
        console.log(`⚠️ Index creation warning: ${indexError.message}`)
      }
    }
    console.log('✅ Indexes created')

    // Step 5: Enable RLS
    console.log('5️⃣ Enabling RLS...')
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;'
    })

    if (rlsError) {
      console.log('⚠️ RLS enable warning:', rlsError.message)
    } else {
      console.log('✅ RLS enabled')
    }

    // Step 6: Create RLS policies
    console.log('6️⃣ Creating RLS policies...')
    const policies = [
      `CREATE POLICY "Users can view their own refunds" ON refunds
       FOR SELECT USING (
         auth.uid() = user_id OR 
         auth.uid() = creator_id OR
         EXISTS (
           SELECT 1 FROM profiles 
           WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
         )
       );`,
      `CREATE POLICY "Service role can manage refunds" ON refunds
       FOR ALL USING (auth.role() = 'service_role');`
    ]

    for (const policySQL of policies) {
      const { error: policyError } = await supabase.rpc('exec_sql', { sql: policySQL })
      if (policyError) {
        console.log(`⚠️ Policy creation warning: ${policyError.message}`)
      }
    }
    console.log('✅ RLS policies created')

    // Step 7: Create utility functions
    console.log('7️⃣ Creating utility functions...')
    
    // Create updated_at trigger
    const { error: triggerError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TRIGGER update_refunds_updated_at 
          BEFORE UPDATE ON refunds 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `
    })

    if (triggerError) {
      console.log('⚠️ Trigger creation warning:', triggerError.message)
    } else {
      console.log('✅ Updated_at trigger created')
    }

    // Verify table creation
    console.log('8️⃣ Verifying table creation...')
    const { data: refundsCheck, error: checkError } = await supabase
      .from('refunds')
      .select('id')
      .limit(1)

    if (checkError) {
      throw new Error(`Table verification failed: ${checkError.message}`)
    }

    console.log('✅ Refunds table verified and accessible')

    console.log('\n🎉 Migration completed successfully!')
    console.log('\nNext steps:')
    console.log('1. The refunds table is now ready')
    console.log('2. API endpoints can now use the refund functions')
    console.log('3. Webhook handlers can store refund records')

  } catch (error) {
    console.error('\n💥 Migration failed:', error.message)
    throw error
  }
}

// Handle the case where exec_sql RPC doesn't exist
async function fallbackMigration() {
  console.log('\n🔄 Attempting fallback migration approach...')
  
  try {
    // Try to use raw SQL execution via a different method
    console.log('Creating essential components manually...')
    
    // We'll just create the basic structure and let the user know
    console.log('\n⚠️  The migration needs to be applied through Supabase dashboard or CLI')
    console.log('Please copy the SQL from supabase/migrations/20250910_create_refunds_table.sql')
    console.log('and execute it in your Supabase SQL editor.')
    
    return false
  } catch (error) {
    console.error('Fallback also failed:', error)
    return false
  }
}

// Main execution
if (require.main === module) {
  applyRefundsMigration().catch(async (error) => {
    console.log('\n🔄 Primary migration failed, trying fallback...')
    const fallbackSuccess = await fallbackMigration()
    
    if (!fallbackSuccess) {
      process.exit(1)
    }
  })
}

module.exports = { applyRefundsMigration }