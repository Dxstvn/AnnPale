// Script to create missing database tables via Supabase REST API
// Run this with: node scripts/create-database-tables.js

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// SQL statements to create each table
const SQL_STATEMENTS = [
  // Enable UUID extension
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
  
  // payment_intents table
  `CREATE TABLE IF NOT EXISTS payment_intents (
    id VARCHAR PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    status VARCHAR(50) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // orders table
  `CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    video_request_id UUID REFERENCES video_requests(id) ON DELETE CASCADE,
    payment_intent_id VARCHAR,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    platform_fee DECIMAL(10,2) NOT NULL,
    creator_earnings DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    accepted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // stripe_accounts table
  `CREATE TABLE IF NOT EXISTS stripe_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    stripe_account_id VARCHAR NOT NULL UNIQUE,
    charges_enabled BOOLEAN DEFAULT false,
    payouts_enabled BOOLEAN DEFAULT false,
    onboarding_complete BOOLEAN DEFAULT false,
    requirements_currently_due TEXT[],
    requirements_eventually_due TEXT[],
    requirements_past_due TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // video_uploads table
  `CREATE TABLE IF NOT EXISTS video_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    original_filename TEXT NOT NULL,
    video_url TEXT,
    thumbnail_url TEXT,
    duration INTEGER,
    size_bytes BIGINT,
    processing_status VARCHAR(50) DEFAULT 'uploading',
    processing_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // payments table
  `CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    stripe_payment_id VARCHAR NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    creator_earnings DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    stripe_fee DECIMAL(10,2),
    net_platform_fee DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // Add indexes
  `CREATE INDEX IF NOT EXISTS idx_payment_intents_user_id ON payment_intents(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_payment_intents_creator_id ON payment_intents(creator_id);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_creator_id ON orders(creator_id);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`,

  // Add constraints
  `ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS orders_amount_positive CHECK (amount > 0);`,
  `ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS orders_platform_fee_valid CHECK (platform_fee >= 0 AND platform_fee <= amount);`,
  `ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS orders_creator_earnings_valid CHECK (creator_earnings >= 0 AND creator_earnings <= amount);`
];

async function executeSQL(sql) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ sql })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    // If exec_sql doesn't work, try creating a custom function
    console.log('exec_sql not available, trying alternative approach...');
    throw error;
  }
}

async function createTablesAlternative() {
  console.log('🔄 Trying alternative approach - creating tables via HTTP...');
  
  // Try to create the functions we need first
  const createFunction = `
    CREATE OR REPLACE FUNCTION create_backend_tables()
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      -- Create payment_intents table
      CREATE TABLE IF NOT EXISTS payment_intents (
        id VARCHAR PRIMARY KEY,
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'usd',
        status VARCHAR(50) NOT NULL,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      -- Create orders table
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        video_request_id UUID REFERENCES video_requests(id) ON DELETE CASCADE,
        payment_intent_id VARCHAR,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'usd',
        platform_fee DECIMAL(10,2) NOT NULL,
        creator_earnings DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        metadata JSONB DEFAULT '{}',
        accepted_at TIMESTAMPTZ,
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    END;
    $$;
  `;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_backend_tables`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to call function:', errorText);
      return false;
    }

    console.log('✅ Tables created successfully via function!');
    return true;
  } catch (error) {
    console.error('Alternative approach failed:', error);
    return false;
  }
}

async function createTables() {
  console.log('🚀 Creating missing database tables...');
  console.log('📡 Supabase URL:', SUPABASE_URL);
  
  try {
    // Try executing each SQL statement
    for (let i = 0; i < SQL_STATEMENTS.length; i++) {
      const sql = SQL_STATEMENTS[i];
      console.log(`\n📋 Executing statement ${i + 1}/${SQL_STATEMENTS.length}:`);
      console.log(sql.substring(0, 100) + '...');
      
      try {
        await executeSQL(sql);
        console.log('✅ Success');
      } catch (error) {
        console.log('❌ Failed:', error.message);
        
        if (i === 0) {
          // If first statement fails, try alternative approach
          const success = await createTablesAlternative();
          if (success) {
            break;
          }
        }
      }
    }

    // Verify tables were created by testing queries
    console.log('\n🔍 Verifying table creation...');
    
    const tables = ['payment_intents', 'orders', 'stripe_accounts', 'video_uploads', 'payments'];
    
    for (const table of tables) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, {
          headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
          }
        });

        if (response.ok) {
          console.log(`✅ ${table}: OK`);
        } else {
          console.log(`❌ ${table}: ${response.status} - ${await response.text()}`);
        }
      } catch (error) {
        console.log(`❌ ${table}: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the script
createTables().then(() => {
  console.log('\n🎉 Database setup complete!');
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});