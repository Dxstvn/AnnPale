# Manual Database Setup Required

## ⚠️ CRITICAL: Missing Database Tables

The Ann Pale platform backend is broken because these essential tables are missing from the Supabase database:

### 🔥 Tables That Must Be Created NOW:

#### 1. `payment_intents` - Stripe Payment Tracking
```sql
CREATE TABLE payment_intents (
  id VARCHAR PRIMARY KEY, -- Stripe payment intent ID
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(50) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `orders` - Video Orders After Payment (70/30 Split)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_request_id UUID REFERENCES video_requests(id) ON DELETE CASCADE,
  payment_intent_id VARCHAR,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  platform_fee DECIMAL(10,2) NOT NULL, -- 30%
  creator_earnings DECIMAL(10,2) NOT NULL, -- 70%
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `stripe_accounts` - Creator Payout Accounts
```sql
CREATE TABLE stripe_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_account_id VARCHAR NOT NULL UNIQUE,
  charges_enabled BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. `video_uploads` - Video File Management
```sql
CREATE TABLE video_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_filename TEXT NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  size_bytes BIGINT,
  processing_status VARCHAR(50) DEFAULT 'uploading',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. `payments` - Transaction Records
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  stripe_payment_id VARCHAR NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  creator_earnings DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 📊 Essential Indexes for Performance
```sql
-- Payment intents indexes
CREATE INDEX idx_payment_intents_user_id ON payment_intents(user_id);
CREATE INDEX idx_payment_intents_creator_id ON payment_intents(creator_id);
CREATE INDEX idx_payment_intents_status ON payment_intents(status);

-- Orders indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_creator_id ON orders(creator_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Video uploads indexes
CREATE INDEX idx_video_uploads_order_id ON video_uploads(order_id);
CREATE INDEX idx_video_uploads_creator_id ON video_uploads(creator_id);
CREATE INDEX idx_video_uploads_processing_status ON video_uploads(processing_status);
```

### 🔒 Row Level Security Policies
```sql
-- Enable RLS on all tables
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- payment_intents policies
CREATE POLICY "Users can view their own payment intents" ON payment_intents
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = creator_id);

-- orders policies
CREATE POLICY "Users can view their orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = creator_id);

CREATE POLICY "Creators can update their orders" ON orders
  FOR UPDATE USING (auth.uid() = creator_id);

-- stripe_accounts policies
CREATE POLICY "Creators can manage their stripe accounts" ON stripe_accounts
  FOR ALL USING (auth.uid() = creator_id);

-- video_uploads policies
CREATE POLICY "Users can view videos from their orders" ON video_uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = video_uploads.order_id 
      AND (orders.user_id = auth.uid() OR orders.creator_id = auth.uid())
    )
  );

CREATE POLICY "Creators can manage their video uploads" ON video_uploads
  FOR ALL USING (auth.uid() = creator_id);

-- payments policies
CREATE POLICY "Users can view payments from their orders" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND (orders.user_id = auth.uid() OR orders.creator_id = auth.uid())
    )
  );
```

## 🚀 How to Create These Tables

### Option 1: Supabase Dashboard (RECOMMENDED)
1. Go to https://supabase.com/dashboard
2. Select your project: `yijizsscwkvepljqojkz`
3. Navigate to "Database" → "SQL Editor"
4. Copy and paste each CREATE TABLE statement above
5. Execute them one by one

### Option 2: Database URL Connection
If you have the database password:
```bash
psql "postgresql://postgres.yijizsscwkvepljqojkz:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres" -f supabase/migrations/20250905_create_missing_backend_tables.sql
```

## ✅ After Creating Tables

Once these tables are created, the following will immediately work:

1. **Payment Flow**: Stripe webhooks can create orders
2. **Creator Dashboard**: Can display real paid orders
3. **Video Requests**: Will properly transition from request → payment → order
4. **Real-time Notifications**: Will have data to trigger on
5. **Creator Earnings**: 70/30 split will be calculated and stored

## 🔥 Current Broken Features (Without These Tables)

- ❌ Stripe webhook fails to create orders (payment_intents table missing)
- ❌ Creator dashboard shows requests but no actual paid orders
- ❌ Payment success doesn't create trackable orders
- ❌ Video uploads have nowhere to be stored
- ❌ No financial tracking or creator earnings calculation
- ❌ Real-time notifications have no order data to reference

## 📞 URGENT ACTION REQUIRED

**These tables must be created before any payment testing or development can continue.**

The entire backend coordination depends on these foundational tables being present in the database.