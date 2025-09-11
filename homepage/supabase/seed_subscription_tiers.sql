-- Seed personalized subscription tiers for test creators
-- Each creator has unique tier structures reflecting their personality and offerings

-- Clear existing tiers for test creators (if any)
DELETE FROM public.creator_subscription_tiers 
WHERE creator_id IN (
    '338c5187-1f7e-46ab-b3cc-1dbaadf13ebf', -- Wyclef Jean
    'd120ca06-1287-4951-8615-ec924473a139', -- Michael Brun  
    'f323d0df-566b-4426-9201-9c06a3f64f61'  -- Rutshelle Guillaume
);

-- ============================================
-- Wyclef Jean's Tiers (4 tiers - Music Legend)
-- ============================================
INSERT INTO public.creator_subscription_tiers (
    creator_id, tier_name, price, description, benefits, is_active,
    ad_free, early_access, exclusive_content, direct_messaging, 
    group_chat_access, monthly_video_message, priority_requests, behind_scenes
)
VALUES 
-- Tier 1: Refugee Camp ($15/month)
(
    '338c5187-1f7e-46ab-b3cc-1dbaadf13ebf',
    'Refugee Camp',
    15.00,
    'Join the movement and support Haitian music culture',
    ARRAY[
        'Monthly newsletter with personal updates',
        'Behind-the-scenes photos from tours',
        'Access to Refugee Camp community',
        'Early announcements for concerts'
    ],
    true,
    false, false, false, false, true, false, false, true
),
-- Tier 2: Fugees Family ($35/month)
(
    '338c5187-1f7e-46ab-b3cc-1dbaadf13ebf',
    'Fugees Family',
    35.00,
    'Exclusive music content and deeper connection',
    ARRAY[
        'Early access to new music releases',
        'Monthly personalized video message',
        'Songwriting process insights',
        'Private Discord server access',
        'Exclusive acoustic performances',
        'Voting on setlists for concerts'
    ],
    true,
    true, true, true, false, true, true, false, true
),
-- Tier 3: Studio Session ($75/month)
(
    '338c5187-1f7e-46ab-b3cc-1dbaadf13ebf',
    'Studio Session',
    75.00,
    'Get in the studio with me virtually',
    ARRAY[
        'Live monthly studio streaming sessions',
        'Production tutorials and masterclasses',
        'Monthly Q&A video calls',
        'Signed digital artwork and lyrics',
        'Name in album credits as supporter',
        'Exclusive merchandise discounts'
    ],
    true,
    true, true, true, true, true, true, true, true
),
-- Tier 4: VIP Producer ($150/month)
(
    '338c5187-1f7e-46ab-b3cc-1dbaadf13ebf',
    'VIP Producer',
    150.00,
    'The ultimate music collaboration experience',
    ARRAY[
        'Quarterly 1-on-1 video calls (30 mins)',
        'Co-create a beat with Wyclef',
        'Name in official release credits',
        'All previous tier benefits included',
        'Annual signed physical merchandise',
        'VIP concert tickets when available',
        'Direct WhatsApp access for feedback'
    ],
    true,
    true, true, true, true, true, true, true, true
);

-- ================================================
-- Michael Brun's Tiers (2 tiers - EDM Producer)
-- ================================================
INSERT INTO public.creator_subscription_tiers (
    creator_id, tier_name, price, description, benefits, is_active,
    ad_free, early_access, exclusive_content, direct_messaging,
    group_chat_access, monthly_video_message, priority_requests, behind_scenes
)
VALUES
-- Tier 1: Beat Supporter ($20/month)
(
    'd120ca06-1287-4951-8615-ec924473a139',
    'Beat Supporter',
    20.00,
    'Support the beats and get exclusive EDM content',
    ARRAY[
        'Exclusive DJ mix every month',
        'Production tips and tricks videos',
        'Festival and tour updates first',
        'Downloadable sample packs',
        'Behind-the-scenes festival footage'
    ],
    true,
    true, true, true, false, true, false, false, true
),
-- Tier 2: Festival VIP ($100/month)
(
    'd120ca06-1287-4951-8615-ec924473a139',
    'Festival VIP',
    100.00,
    'The complete EDM experience with personal access',
    ARRAY[
        'All DJ set recordings (audio + video)',
        'Monthly production masterclass',
        'Virtual backstage pass to shows',
        'Monthly 1-on-1 video calls (20 mins)',
        'Remix stems for all releases',
        'Guest list spots at select shows',
        'Collaboration on one track per year',
        'Personal feedback on your productions'
    ],
    true,
    true, true, true, true, true, true, true, true
);

-- ====================================================
-- Rutshelle Guillaume's Tiers (3 tiers - Singer)
-- ====================================================
INSERT INTO public.creator_subscription_tiers (
    creator_id, tier_name, price, description, benefits, is_active,
    ad_free, early_access, exclusive_content, direct_messaging,
    group_chat_access, monthly_video_message, priority_requests, behind_scenes
)
VALUES
-- Tier 1: Fanmi ($10/month)
(
    'f323d0df-566b-4426-9201-9c06a3f64f61',
    'Fanmi',
    10.00,
    'Vin jwenn fanmi mizik la! (Join the music family!)',
    ARRAY[
        'Exclusive acoustic covers weekly',
        'Haitian music history lessons',
        'Personal voice messages',
        'Community chat access',
        'Birthday shoutouts'
    ],
    true,
    false, false, true, false, true, false, false, false
),
-- Tier 2: Chante Avèm ($30/month)  
(
    'f323d0df-566b-4426-9201-9c06a3f64f61',
    'Chante Avèm',
    30.00,
    'Sing with me - interactive music experience',
    ARRAY[
        'Monthly karaoke sessions via livestream',
        'Vocal coaching tips and exercises',
        'Personal song dedications',
        'Behind-the-scenes studio content',
        'Early access to new singles',
        'Creole language lessons through music'
    ],
    true,
    true, true, true, false, true, true, false, true
),
-- Tier 3: Zetwal ($60/month)
(
    'f323d0df-566b-4426-9201-9c06a3f64f61',
    'Zetwal',
    60.00,
    'Become a star - premium artistic collaboration',
    ARRAY[
        'Record a duet together (quarterly)',
        'Personal video message every month',
        'VIP meet & greets at concerts',
        'Songwriting collaboration sessions',
        'Name in liner notes as patron',
        'Private Instagram account access',
        'Custom birthday song recording',
        'All previous benefits included'
    ],
    true,
    true, true, true, true, true, true, true, true
);

-- Display confirmation
SELECT 
    p.name as creator_name,
    COUNT(t.id) as tier_count,
    MIN(t.price) as min_price,
    MAX(t.price) as max_price,
    STRING_AGG(t.tier_name, ', ' ORDER BY t.price) as tier_names
FROM profiles p
JOIN creator_subscription_tiers t ON p.id = t.creator_id
WHERE p.id IN (
    '338c5187-1f7e-46ab-b3cc-1dbaadf13ebf',
    'd120ca06-1287-4951-8615-ec924473a139',
    'f323d0df-566b-4426-9201-9c06a3f64f61'
)
GROUP BY p.name
ORDER BY p.name;