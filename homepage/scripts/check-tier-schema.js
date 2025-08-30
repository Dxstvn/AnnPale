const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAndUpdateSchema() {
  console.log('🔍 Checking creator_subscription_tiers table schema...')
  
  try {
    // First, try to get the table structure by querying it
    const { data: existingData, error: queryError } = await supabase
      .from('creator_subscription_tiers')
      .select('*')
      .limit(1)
    
    if (queryError) {
      console.log('Query error:', queryError.message)
      
      // If table doesn't exist or has issues, we might need to create/update it
      // For now, let's try to insert a test row to see what columns exist
      const testTier = {
        id: 'test-' + Date.now(),
        creator_id: '00000000-0000-0000-0000-000000000000',
        tier_name: 'Test Tier',
        price_cents: 1000, // Store price in cents to avoid float issues
        description: 'Test tier description',
        benefits: ['Benefit 1', 'Benefit 2'],
        is_active: true,
        max_subscribers: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('creator_subscription_tiers')
        .insert(testTier)
        .select()
      
      if (insertError) {
        console.log('\n⚠️  Table structure issue:', insertError.message)
        console.log('\nExpected columns:')
        console.log('- id (uuid, primary key)')
        console.log('- creator_id (uuid, foreign key to profiles)')
        console.log('- tier_name (text)')
        console.log('- price_cents (integer)')
        console.log('- description (text)')
        console.log('- benefits (text[])')
        console.log('- is_active (boolean)')
        console.log('- max_subscribers (integer, nullable)')
        console.log('- created_at (timestamp)')
        console.log('- updated_at (timestamp)')
        
        console.log('\n📝 SQL to create/update table:')
        console.log(`
-- Create table if not exists
CREATE TABLE IF NOT EXISTS creator_subscription_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier_name TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  description TEXT,
  benefits TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  max_subscribers INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, tier_name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_creator_tiers_creator_id ON creator_subscription_tiers(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_tiers_active ON creator_subscription_tiers(is_active);

-- Enable RLS
ALTER TABLE creator_subscription_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Creators can view all tiers (for browsing)
CREATE POLICY "Anyone can view active tiers"
  ON creator_subscription_tiers FOR SELECT
  USING (is_active = true);

-- Creators can manage their own tiers
CREATE POLICY "Creators can manage own tiers"
  ON creator_subscription_tiers FOR ALL
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Service role bypass (for admin operations)
CREATE POLICY "Service role bypass"
  ON creator_subscription_tiers FOR ALL
  USING (auth.role() = 'service_role');
`)
      } else {
        console.log('✅ Successfully inserted test tier!')
        console.log('Inserted data:', insertData)
        
        // Clean up test data
        await supabase
          .from('creator_subscription_tiers')
          .delete()
          .eq('id', testTier.id)
        
        console.log('🧹 Cleaned up test data')
      }
    } else {
      if (existingData && existingData.length > 0) {
        console.log('✅ Table exists with columns:', Object.keys(existingData[0]))
      } else {
        console.log('✅ Table exists but is empty')
        console.log('\nTrying to discover structure...')
        
        // Try inserting to discover structure
        const testTier = {
          creator_id: '00000000-0000-0000-0000-000000000000',
          tier_name: 'Discovery Test',
          price_cents: 1000,
          description: 'Test',
          benefits: ['Test'],
          is_active: true
        }
        
        const { data, error } = await supabase
          .from('creator_subscription_tiers')
          .insert(testTier)
          .select()
        
        if (error) {
          console.log('Structure discovery failed:', error.message)
        } else if (data) {
          console.log('✅ Table structure:', Object.keys(data[0]))
          
          // Clean up
          await supabase
            .from('creator_subscription_tiers')
            .delete()
            .eq('id', data[0].id)
        }
      }
    }
    
    // Check RLS policies
    console.log('\n🔒 Checking RLS policies...')
    // Note: We can't directly query policies via Supabase client,
    // but we can test if RLS is enabled by trying operations
    
    console.log('\n✨ Schema check complete!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

checkAndUpdateSchema()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })