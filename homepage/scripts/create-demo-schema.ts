/**
 * Create Demo Schema for Entertainment Profiles
 * Creates necessary database schema changes for demo profiles
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials. Check your .env.local file.')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createDemoSchema() {
  console.log('🏗️ Creating demo schema for entertainment profiles...')
  
  try {
    // Add columns to profiles table
    console.log('📝 Adding demo columns to profiles table...')
    
    const profileUpdates = [
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_demo_account boolean DEFAULT false`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS demo_tier varchar(20)`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS public_figure_verified boolean DEFAULT false`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hometown varchar(255)`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_active integer`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subcategory varchar(100)`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS follower_count integer DEFAULT 0`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS monthly_bookings integer DEFAULT 0`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS repeat_customer_rate decimal(3,2) DEFAULT 0.0`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS price_live_call decimal(10,2) DEFAULT 0.0`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS response_time varchar(50) DEFAULT '24 hours'`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_status varchar(20) DEFAULT 'active'`,
      `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active timestamp with time zone DEFAULT NOW()`
    ]
    
    for (const sql of profileUpdates) {
      console.log(`   Running: ${sql.substring(0, 50)}...`)
      const { error } = await supabase.rpc('exec_sql', { sql })
      if (error) {
        console.log(`   ⚠️ Warning: ${error.message}`)
      } else {
        console.log(`   ✅ Success`)
      }
    }
    
    // Create demo tables
    console.log('\n📊 Creating demo tables...')
    
    const createTables = [
      // Demo creator stats table
      `CREATE TABLE IF NOT EXISTS demo_creator_stats (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        total_earnings decimal(10,2) DEFAULT 0,
        videos_this_month integer DEFAULT 0,
        average_turnaround_hours integer DEFAULT 24,
        satisfaction_score decimal(3,2) DEFAULT 4.80,
        featured_category text,
        trending_rank integer,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      
      // Demo reviews table
      `CREATE TABLE IF NOT EXISTS demo_reviews (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        reviewer_name text NOT NULL,
        rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text text NOT NULL,
        video_type varchar(50) DEFAULT 'general',
        language varchar(10) DEFAULT 'en',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      
      // Demo sample videos table
      `CREATE TABLE IF NOT EXISTS demo_sample_videos (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        title text NOT NULL,
        description text,
        duration_seconds integer DEFAULT 60,
        thumbnail_url text,
        category varchar(50) DEFAULT 'general',
        language varchar(10) DEFAULT 'en',
        view_count integer DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
    ]
    
    for (const sql of createTables) {
      console.log(`   Creating table...`)
      const { error } = await supabase.rpc('exec_sql', { sql })
      if (error) {
        console.log(`   ⚠️ Warning: ${error.message}`)
      } else {
        console.log(`   ✅ Table created`)
      }
    }
    
    // Enable RLS on demo tables
    console.log('\n🔐 Setting up Row Level Security...')
    
    const rlsCommands = [
      `ALTER TABLE demo_creator_stats ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE demo_reviews ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE demo_sample_videos ENABLE ROW LEVEL SECURITY`
    ]
    
    for (const sql of rlsCommands) {
      console.log(`   Setting RLS...`)
      const { error } = await supabase.rpc('exec_sql', { sql })
      if (error) {
        console.log(`   ⚠️ Warning: ${error.message}`)
      } else {
        console.log(`   ✅ RLS enabled`)
      }
    }
    
    // Create RLS policies
    console.log('\n🛡️ Creating RLS policies...')
    
    const policies = [
      `CREATE POLICY IF NOT EXISTS "Public can view demo stats" ON demo_creator_stats FOR SELECT USING (true)`,
      `CREATE POLICY IF NOT EXISTS "Public can view demo reviews" ON demo_reviews FOR SELECT USING (true)`,
      `CREATE POLICY IF NOT EXISTS "Public can view demo videos" ON demo_sample_videos FOR SELECT USING (true)`,
      `CREATE POLICY IF NOT EXISTS "Service role can manage demo stats" ON demo_creator_stats FOR ALL USING (auth.role() = 'service_role')`,
      `CREATE POLICY IF NOT EXISTS "Service role can manage demo reviews" ON demo_reviews FOR ALL USING (auth.role() = 'service_role')`,
      `CREATE POLICY IF NOT EXISTS "Service role can manage demo videos" ON demo_sample_videos FOR ALL USING (auth.role() = 'service_role')`
    ]
    
    for (const sql of policies) {
      console.log(`   Creating policy...`)
      const { error } = await supabase.rpc('exec_sql', { sql })
      if (error) {
        console.log(`   ⚠️ Warning: ${error.message}`)
      } else {
        console.log(`   ✅ Policy created`)
      }
    }
    
    console.log('\n🎉 Demo schema creation complete!')
    
  } catch (error) {
    console.error('💥 Schema creation failed:', error)
    process.exit(1)
  }
}

// Run the schema creation
if (require.main === module) {
  createDemoSchema()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Fatal error:', error)
      process.exit(1)
    })
}

export { createDemoSchema }