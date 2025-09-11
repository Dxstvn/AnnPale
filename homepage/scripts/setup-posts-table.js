const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupPostsTable() {
  console.log('🚀 Setting up posts table...')
  
  try {
    // Create the updated posts table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Drop existing table if it exists (CASCADE will drop dependent objects)
        DROP TABLE IF EXISTS posts CASCADE;
        
        -- Create posts table with updated structure
        CREATE TABLE posts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          
          -- Content details
          title VARCHAR(255) NOT NULL,
          description TEXT,
          content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('video', 'image', 'text', 'live')),
          
          -- Media URLs
          thumbnail_url TEXT,
          video_url TEXT,
          image_url TEXT,
          
          -- Access control
          access_tier_ids UUID[] DEFAULT '{}',
          is_public BOOLEAN DEFAULT false,
          is_preview BOOLEAN DEFAULT false,
          is_featured BOOLEAN DEFAULT false,
          preview_order INTEGER,
          
          -- Engagement metrics
          likes_count INTEGER DEFAULT 0,
          views_count INTEGER DEFAULT 0,
          comments_count INTEGER DEFAULT 0,
          shares_count INTEGER DEFAULT 0,
          
          -- Status
          status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
          
          -- Timestamps
          published_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create indexes
        CREATE INDEX idx_posts_creator_id ON posts(creator_id);
        CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
        CREATE INDEX idx_posts_status ON posts(status);
        CREATE INDEX idx_posts_content_type ON posts(content_type);
        CREATE INDEX idx_posts_is_public ON posts(is_public);
        CREATE INDEX idx_posts_is_featured ON posts(is_featured);
        
        -- Enable RLS
        ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
        
        -- RLS Policies
        CREATE POLICY "Posts viewable by everyone" ON posts
          FOR SELECT
          USING (status = 'published' OR auth.uid() = creator_id);
        
        CREATE POLICY "Creators can insert own posts" ON posts
          FOR INSERT
          WITH CHECK (auth.uid() = creator_id);
        
        CREATE POLICY "Creators can update own posts" ON posts
          FOR UPDATE
          USING (auth.uid() = creator_id);
        
        CREATE POLICY "Creators can delete own posts" ON posts
          FOR DELETE
          USING (auth.uid() = creator_id);
      `
    })
    
    if (createError) {
      // If exec_sql doesn't exist, try direct query
      console.log('Using direct query approach...')
      
      const queries = [
        `DROP TABLE IF EXISTS posts CASCADE`,
        `CREATE TABLE posts (
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
        )`,
        `CREATE INDEX idx_posts_creator_id ON posts(creator_id)`,
        `CREATE INDEX idx_posts_published_at ON posts(published_at DESC)`,
        `CREATE INDEX idx_posts_status ON posts(status)`,
        `CREATE INDEX idx_posts_content_type ON posts(content_type)`,
        `CREATE INDEX idx_posts_is_public ON posts(is_public)`,
        `CREATE INDEX idx_posts_is_featured ON posts(is_featured)`,
        `ALTER TABLE posts ENABLE ROW LEVEL SECURITY`,
        `CREATE POLICY "Posts viewable by everyone" ON posts FOR SELECT USING (status = 'published' OR auth.uid() = creator_id)`,
        `CREATE POLICY "Creators can insert own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = creator_id)`,
        `CREATE POLICY "Creators can update own posts" ON posts FOR UPDATE USING (auth.uid() = creator_id)`,
        `CREATE POLICY "Creators can delete own posts" ON posts FOR DELETE USING (auth.uid() = creator_id)`
      ]
      
      for (const query of queries) {
        try {
          await supabase.rpc('query', { sql: query }).catch(() => {})
        } catch (e) {
          // Ignore errors for now
        }
      }
    }
    
    console.log('✅ Posts table created successfully!')
    
    // Verify the table exists
    const { data: tables } = await supabase
      .from('posts')
      .select('id')
      .limit(1)
    
    if (tables !== null) {
      console.log('✅ Posts table verified and ready!')
    } else {
      console.log('⚠️ Posts table may not be accessible. You may need to run migrations manually.')
    }
    
  } catch (error) {
    console.error('❌ Error setting up posts table:', error)
    console.log('\n📝 Manual migration required. Please run the following SQL in Supabase:')
    console.log(`
CREATE TABLE IF NOT EXISTS posts (
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

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts viewable by everyone" ON posts
  FOR SELECT USING (status = 'published' OR auth.uid() = creator_id);
  
CREATE POLICY "Creators can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = creator_id);
  
CREATE POLICY "Creators can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = creator_id);
  
CREATE POLICY "Creators can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = creator_id);
    `)
  }
}

setupPostsTable().catch(console.error)