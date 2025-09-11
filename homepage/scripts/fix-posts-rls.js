const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixPostsRLS() {
  console.log('🔧 Fixing posts RLS policies...')
  
  try {
    // First, let's check if the posts table exists and what policies are on it
    const { data: existingPosts, error: checkError } = await supabase
      .from('posts')
      .select('id')
      .limit(1)
    
    if (checkError) {
      console.log('Posts table check error:', checkError.message)
    } else {
      console.log('✅ Posts table exists')
    }
    
    // Try to insert a test post with service role (bypasses RLS)
    const testPost = {
      creator_id: '530c7ea1-4946-4f34-b636-7530c2e376fb',
      title: 'Test Post - Delete Me',
      description: 'This is a test post to verify the table works',
      content_type: 'text',
      is_public: false,
      status: 'draft'
    }
    
    const { data: insertedPost, error: insertError } = await supabase
      .from('posts')
      .insert(testPost)
      .select()
      .single()
    
    if (insertError) {
      console.error('Test insert error:', insertError)
    } else {
      console.log('✅ Test post created successfully:', insertedPost.id)
      
      // Clean up test post
      await supabase
        .from('posts')
        .delete()
        .eq('id', insertedPost.id)
      
      console.log('✅ Test post deleted')
    }
    
    console.log('\n📝 To fix RLS policies, run this SQL in Supabase SQL Editor:')
    console.log(`
-- Drop all existing policies
DROP POLICY IF EXISTS "Posts viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Creators can insert own posts" ON posts;
DROP POLICY IF EXISTS "Creators can update own posts" ON posts;
DROP POLICY IF EXISTS "Creators can delete own posts" ON posts;

-- Create simplified policies
CREATE POLICY "Anyone can view published posts" ON posts
  FOR SELECT
  USING (status = 'published' OR auth.uid() = creator_id);

CREATE POLICY "Users can create posts as themselves" ON posts
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE
  USING (auth.uid() = creator_id);
    `)
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

fixPostsRLS().catch(console.error)