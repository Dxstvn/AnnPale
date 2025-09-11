-- Add subscription tiers for test creators

-- Wyclef Jean's tiers
INSERT INTO creator_subscription_tiers (creator_id, tier_name, description, price, benefits, tier_type, is_active)
VALUES 
  ('d963aa48-879d-461c-9df3-7dc557b545f9', 'Refugee Camp', 'Join the Refugee Camp community', 15, 
   '["Monthly newsletter with personal updates", "Behind-the-scenes photos from tours", "Early access to new music releases", "Member-only community chat"]'::jsonb, 
   'basic', true),
  ('d963aa48-879d-461c-9df3-7dc557b545f9', 'Fugees Family', 'Become part of the Fugees Family', 35, 
   '["Everything in Refugee Camp", "Monthly video messages", "Exclusive acoustic performances", "Birthday shoutouts"]'::jsonb, 
   'premium', true),
  ('d963aa48-879d-461c-9df3-7dc557b545f9', 'Studio Session', 'Get inside the creative process', 75, 
   '["Everything in Fugees Family", "Live studio session streams", "Song creation process videos", "Name in album credits"]'::jsonb, 
   'vip', true),
  ('d963aa48-879d-461c-9df3-7dc557b545f9', 'VIP Producer', 'Executive producer access', 150, 
   '["Everything in Studio Session", "Personal video calls quarterly", "Co-producer credit on select tracks", "VIP concert tickets when available"]'::jsonb, 
   'vip', true)
ON CONFLICT (creator_id, tier_name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  benefits = EXCLUDED.benefits,
  is_active = EXCLUDED.is_active;

-- Michael Brun's tiers
INSERT INTO creator_subscription_tiers (creator_id, tier_name, description, price, benefits, tier_type, is_active)
VALUES 
  ('819421cf-9437-4d10-bb09-bca4e0c12cba', 'Bayo Beats', 'Access to the Bayo movement', 20, 
   '["Monthly DJ mix exclusives", "Production tips and tutorials", "Discount on Bayo merchandise", "Member-only Discord"]'::jsonb, 
   'basic', true),
  ('819421cf-9437-4d10-bb09-bca4e0c12cba', 'Producer Circle', 'Learn production from Michael', 100, 
   '["Everything in Bayo Beats", "Weekly production masterclasses", "Stems and samples from tracks", "Direct feedback on your music"]'::jsonb, 
   'vip', true)
ON CONFLICT (creator_id, tier_name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  benefits = EXCLUDED.benefits,
  is_active = EXCLUDED.is_active;

-- Rutshelle Guillaume's tiers
INSERT INTO creator_subscription_tiers (creator_id, tier_name, description, price, benefits, tier_type, is_active)
VALUES 
  ('cbce25c9-04e0-45c7-b872-473fed4eeb1d', 'Fanmi Mwen', 'Join my musical family', 10, 
   '["Exclusive covers and acoustic versions", "Personal voice messages monthly", "Behind-the-scenes content", "Fan appreciation posts"]'::jsonb, 
   'basic', true),
  ('cbce25c9-04e0-45c7-b872-473fed4eeb1d', 'VIP Supporters', 'Closer connection with Rutshelle', 25, 
   '["Everything in Fanmi Mwen", "Monthly video calls", "Your name in concert thank yous", "Signed digital photos"]'::jsonb, 
   'premium', true),
  ('cbce25c9-04e0-45c7-b872-473fed4eeb1d', 'Inner Circle', 'Ultimate Rutshelle experience', 50, 
   '["Everything in VIP Supporters", "Private concerts streaming", "Personal birthday videos", "Direct messaging access"]'::jsonb, 
   'vip', true)
ON CONFLICT (creator_id, tier_name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  benefits = EXCLUDED.benefits,
  is_active = EXCLUDED.is_active;