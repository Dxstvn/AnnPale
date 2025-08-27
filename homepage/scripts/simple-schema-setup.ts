/**
 * Simple Schema Setup for Demo Profiles
 * Just creates the essential tables needed for the demo profiles
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupSimpleSchema() {
  console.log('🔧 Setting up simple demo schema...')
  
  try {
    // First, let's just add the essential columns to profiles
    console.log('📝 Adding essential columns to profiles table...')
    
    const { error: alterError } = await supabase.rpc('sql', {
      query: `
        ALTER TABLE profiles 
        ADD COLUMN IF NOT EXISTS is_demo_account boolean DEFAULT false,
        ADD COLUMN IF NOT EXISTS demo_tier varchar(20),
        ADD COLUMN IF NOT EXISTS account_status varchar(20) DEFAULT 'active',
        ADD COLUMN IF NOT EXISTS hometown varchar(255),
        ADD COLUMN IF NOT EXISTS years_active integer,
        ADD COLUMN IF NOT EXISTS subcategory varchar(100),
        ADD COLUMN IF NOT EXISTS follower_count integer DEFAULT 0,
        ADD COLUMN IF NOT EXISTS monthly_bookings integer DEFAULT 0,
        ADD COLUMN IF NOT EXISTS repeat_customer_rate decimal(3,2) DEFAULT 0.0,
        ADD COLUMN IF NOT EXISTS price_live_call decimal(10,2) DEFAULT 0.0,
        ADD COLUMN IF NOT EXISTS response_time varchar(50) DEFAULT '24 hours',
        ADD COLUMN IF NOT EXISTS last_active timestamp with time zone DEFAULT NOW();
      `
    })
    
    if (alterError) {
      console.log(`⚠️ Profile table update warning: ${alterError.message}`)
    } else {
      console.log('✅ Profile table updated successfully')
    }
    
    // Create demo_creator_stats table
    console.log('📊 Creating demo_creator_stats table...')
    
    const { error: statsError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS demo_creator_stats (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          total_earnings decimal(10,2) DEFAULT 0,
          videos_this_month integer DEFAULT 0,
          average_turnaround_hours integer DEFAULT 24,
          satisfaction_score decimal(3,2) DEFAULT 4.80,
          featured_category text,
          trending_rank integer,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE demo_creator_stats ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Public can view demo stats" 
        ON demo_creator_stats FOR SELECT USING (true);
        
        CREATE POLICY IF NOT EXISTS "Service role full access to demo stats" 
        ON demo_creator_stats FOR ALL USING (auth.role() = 'service_role');
      `
    })
    
    if (statsError) {
      console.log(`⚠️ Stats table warning: ${statsError.message}`)
    } else {
      console.log('✅ Demo creator stats table created')
    }
    
    // Create demo_reviews table
    console.log('⭐ Creating demo_reviews table...')
    
    const { error: reviewsError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS demo_reviews (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          reviewer_name text NOT NULL,
          rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
          review_text text NOT NULL,
          video_type varchar(50) DEFAULT 'general',
          language varchar(10) DEFAULT 'en',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE demo_reviews ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Public can view demo reviews" 
        ON demo_reviews FOR SELECT USING (true);
        
        CREATE POLICY IF NOT EXISTS "Service role full access to demo reviews" 
        ON demo_reviews FOR ALL USING (auth.role() = 'service_role');
      `
    })
    
    if (reviewsError) {
      console.log(`⚠️ Reviews table warning: ${reviewsError.message}`)
    } else {
      console.log('✅ Demo reviews table created')
    }
    
    // Create demo_sample_videos table
    console.log('🎬 Creating demo_sample_videos table...')
    
    const { error: videosError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS demo_sample_videos (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          title text NOT NULL,
          description text,
          duration_seconds integer DEFAULT 60,
          thumbnail_url text,
          category varchar(50) DEFAULT 'general',
          language varchar(10) DEFAULT 'en',
          view_count integer DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE demo_sample_videos ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Public can view demo videos" 
        ON demo_sample_videos FOR SELECT USING (true);
        
        CREATE POLICY IF NOT EXISTS "Service role full access to demo videos" 
        ON demo_sample_videos FOR ALL USING (auth.role() = 'service_role');
      `
    })
    
    if (videosError) {
      console.log(`⚠️ Videos table warning: ${videosError.message}`)
    } else {
      console.log('✅ Demo sample videos table created')
    }
    
    console.log('\n🎉 Simple schema setup complete!')
    console.log('✅ Ready to seed entertainment profiles')
    
  } catch (error) {
    console.error('💥 Schema setup failed:', error)
    process.exit(1)
  }
}

// Run the schema setup
if (require.main === module) {
  setupSimpleSchema()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Fatal error:', error)
      process.exit(1)
    })
}

export { setupSimpleSchema }