-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user role enum
CREATE TYPE user_role AS ENUM ('fan', 'creator', 'admin');

-- Create profiles table that extends auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'fan',
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  language_preference TEXT DEFAULT 'en',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role user_role;
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'jasmindustin@gmail.com' THEN
    user_role := 'admin';
  ELSE
    -- Default to 'fan' role, will be updated during signup process
    user_role := 'fan';
  END IF;

  INSERT INTO public.profiles (id, email, name, role, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    user_role,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Creator-specific tables (for future use)

-- Creator verification status
CREATE TABLE IF NOT EXISTS public.creator_verification (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verification_documents JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creator pricing and availability
CREATE TABLE IF NOT EXISTS public.creator_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  base_price DECIMAL(10, 2) DEFAULT 25.00,
  currency TEXT DEFAULT 'USD',
  turnaround_days INTEGER DEFAULT 7,
  is_accepting_orders BOOLEAN DEFAULT true,
  auto_accept_orders BOOLEAN DEFAULT false,
  categories TEXT[],
  languages TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on creator tables
ALTER TABLE public.creator_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_settings ENABLE ROW LEVEL SECURITY;

-- Policies for creator tables
CREATE POLICY "Creators can view own verification" ON public.creator_verification
  FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "Creators can view and update own settings" ON public.creator_settings
  FOR ALL USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Admin policies for creator tables
CREATE POLICY "Admins can manage verifications" ON public.creator_verification
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all creator settings" ON public.creator_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );