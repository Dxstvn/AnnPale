-- Add creator stats columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS completed_videos INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS response_time VARCHAR(20) DEFAULT '24hr',
ADD COLUMN IF NOT EXISTS on_time_delivery INTEGER DEFAULT 95,
ADD COLUMN IF NOT EXISTS repeat_customers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earned DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT false;

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_is_creator ON public.profiles(is_creator);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON public.profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_is_featured ON public.profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_profiles_category ON public.profiles(category);

-- Update the test creator profile with initial data
UPDATE public.profiles 
SET 
  tagline = 'Creator on Ann Pale • Bringing joy through personalized messages',
  is_verified = true,
  category = 'Content Creator'
WHERE id = '530c7ea1-4946-4f34-b636-7530c2e376fb';