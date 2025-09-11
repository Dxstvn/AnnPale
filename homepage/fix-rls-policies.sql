-- Quick fix for RLS policy issues
-- This creates service-role friendly policies for webhook processing

-- Fix payment_intents table RLS policies
DROP POLICY IF EXISTS "payment_intents_insert_policy" ON payment_intents;
DROP POLICY IF EXISTS "payment_intents_select_policy" ON payment_intents;
DROP POLICY IF EXISTS "payment_intents_update_policy" ON payment_intents;
DROP POLICY IF EXISTS "payment_intents_service_policy" ON payment_intents;

-- Create service role policy for payment_intents
CREATE POLICY "payment_intents_service_policy" ON payment_intents 
FOR ALL 
TO service_role
USING (true) 
WITH CHECK (true);

-- Also allow authenticated users to manage their own payment intents
CREATE POLICY "payment_intents_user_policy" ON payment_intents 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Fix orders table RLS policies  
DROP POLICY IF EXISTS "orders_service_policy" ON orders;
CREATE POLICY "orders_service_policy" ON orders 
FOR ALL 
TO service_role
USING (true) 
WITH CHECK (true);

-- Fix payments table RLS policies
DROP POLICY IF EXISTS "payments_service_policy" ON payments;
CREATE POLICY "payments_service_policy" ON payments 
FOR ALL 
TO service_role
USING (true) 
WITH CHECK (true);

-- Grant necessary permissions to service role
GRANT ALL ON payment_intents TO service_role;
GRANT ALL ON orders TO service_role;
GRANT ALL ON payments TO service_role;

-- Refresh policies
NOTIFY pgrst, 'reload schema';

SELECT 'RLS policies fixed for webhook processing' as result;