-- Add category column to profiles table for creator categorization
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_category ON profiles(category);

-- Update existing test creators with categories
UPDATE profiles SET category = 'Music' 
WHERE name IN ('Wyclef Jean', 'Michael Brun', 'Rutshelle Guillaume');

-- Update other known creators with appropriate categories
UPDATE profiles SET category = 'Music' WHERE name LIKE '%DJ%' OR name LIKE '%dj%';
UPDATE profiles SET category = 'Entertainment' WHERE bio LIKE '%comedy%' OR bio LIKE '%comedian%';
UPDATE profiles SET category = 'Media' WHERE bio LIKE '%radio%' OR bio LIKE '%podcast%';

-- Add comment to column
COMMENT ON COLUMN profiles.category IS 'Primary category for creator classification (Music, Entertainment, Media, Sports, Culinary, Visual Arts, Education)';