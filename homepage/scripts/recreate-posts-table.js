const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function recreatePostsTable() {
  console.log('🔧 Recreating posts table with correct structure...')
  
  const sql = `
-- Drop the existing posts table and recreate it
DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('video', 'image', 'text', 'live')),
  thumbnail_url TEXT,
  video_url TEXT,
  image_url TEXT,
  access_tier_ids UUID[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  is_preview BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  preview_order INTEGER,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_posts_creator_id ON posts(creator_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_content_type ON posts(content_type);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies
CREATE POLICY "Anyone can view posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = creator_id);
  `
  
  console.log('📝 Please run this SQL in your Supabase SQL Editor:')
  console.log(sql)
  
  // Also try to test if we can work with the current table
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        creator_id: '530c7ea1-4946-4f34-b636-7530c2e376fb',
        title: 'Test Post',
        description: 'Testing',
        content_type: 'text',
        is_public: true,
        status: 'draft'
      })
      .select()
      .single()
    
    if (error) {
      console.log('\n❌ Cannot insert into current table structure:', error.message)
      console.log('Please run the SQL above to fix the table structure.')
    } else {
      console.log('\n✅ Successfully created test post:', data.id)
      // Delete the test post
      await supabase.from('posts').delete().eq('id', data.id)
    }
  } catch (e) {
    console.error('Error testing posts table:', e)
  }
}

recreatePostsTable().catch(console.error)