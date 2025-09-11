const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixSubscriptionOrdersSchema() {
  console.log('🔧 Fixing subscription_orders table schema...');
  
  try {
    // Check if stripe_checkout_session_id column exists
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_column_info', { table_name: 'subscription_orders' })
    
    if (columnsError && !columnsError.message.includes('does not exist')) {
      console.log('📄 Checking table structure with direct SQL...');
      
      // Add missing column
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: `
          DO $$ 
          BEGIN
            -- Add stripe_checkout_session_id column if it doesn't exist
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'subscription_orders' 
              AND column_name = 'stripe_checkout_session_id'
            ) THEN
              ALTER TABLE subscription_orders 
              ADD COLUMN stripe_checkout_session_id TEXT;
              RAISE NOTICE 'Added stripe_checkout_session_id column';
            ELSE
              RAISE NOTICE 'stripe_checkout_session_id column already exists';
            END IF;
          END $$;
        `
      });
      
      if (alterError) {
        console.error('❌ Error using exec_sql function:', alterError);
        console.log('🔄 Trying direct ALTER TABLE...');
        
        // Try direct approach - this might work if the table exists
        try {
          await supabase
            .from('subscription_orders')
            .select('stripe_checkout_session_id')
            .limit(1);
          console.log('✅ stripe_checkout_session_id column already exists');
        } catch (selectError) {
          if (selectError.message.includes('stripe_checkout_session_id')) {
            console.log('❌ Column stripe_checkout_session_id is missing');
            console.log('📝 Creating migration script instead...');
            
            const migrationSQL = `
-- Add missing columns to subscription_orders table
ALTER TABLE subscription_orders 
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscription_orders_checkout_session 
ON subscription_orders(stripe_checkout_session_id);
`;
            
            console.log('📄 Migration SQL:');
            console.log(migrationSQL);
            console.log('💡 Please run this SQL in your Supabase dashboard SQL editor.');
            return false;
          }
        }
      } else {
        console.log('✅ Schema fix completed successfully');
      }
    } else {
      console.log('✅ Table schema appears to be correct');
    }
    
    // Verify the fix
    try {
      const { data, error } = await supabase
        .from('subscription_orders')
        .select('id, stripe_checkout_session_id')
        .limit(1);
        
      if (error) {
        console.error('❌ Verification failed:', error);
        return false;
      }
      
      console.log('✅ Schema verification passed');
      return true;
    } catch (err) {
      console.error('❌ Verification error:', err);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Schema fix failed:', error);
    return false;
  }
}

fixSubscriptionOrdersSchema().then((success) => {
  console.log(success ? '✅ Schema fix completed' : '❌ Schema fix failed');
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});