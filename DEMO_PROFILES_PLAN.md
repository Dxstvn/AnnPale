# 🎭 DEMO PROFILES PARALLEL DEVELOPMENT PLAN

## 📋 Executive Summary
Create authentic demo profiles for Haitian creators using 4 parallel terminals. Each terminal will research real celebrities, gather public data, source appropriate images, and create Supabase-integrated profiles with authentication.

**Goal:** Populate the Ann Pale platform with 15+ realistic creator profiles representing authentic Haitian talent across music, comedy, media, and entertainment.

---

## 👥 CREATOR ASSIGNMENTS

### Terminal 1: Music Superstars 🎵
**Creators:** 3 profiles
1. **Wyclef Jean** - Grammy-winning musician, Fugees member
2. **Michael Brun** - International DJ/Producer
3. **Rutshelle Guillaume** - Popular singer

### Terminal 2: Entertainment Icons 🎭
**Creators:** 3 profiles
1. **Ti Jo Zenny** - Beloved comedian
2. **Richard Cave** - Award-winning actor
3. **Carel Pedre** - Radio/TV personality

### Terminal 3: DJs & Modern Artists 🎧
**Creators:** 3 profiles
1. **DJ K9** - Popular DJ
2. **DJ Bullet** - Event DJ
3. **J Perry** - Contemporary singer

### Terminal 4: Bands & Additional Artists 🎸
**Creators:** 6 profiles
1. **Kenny** - Singer
2. **T-Vice** - Popular band (group profile)
3. **Carimi** - Legendary band (group profile)
4. **Djakout** - Music group
5. **Harmonik** - Contemporary band
6. **BelO** - Singer/songwriter (bonus)

---

## 📊 PROFILE DATA STRUCTURE

### Required Information per Creator:
```typescript
interface CreatorProfile {
  // Basic Information
  id: string                    // UUID from Supabase
  email: string                  // format: firstname.lastname@annpale.demo
  username: string               // lowercase, no spaces
  full_name: string             // Real name
  display_name: string          // Stage/professional name
  
  // Professional Details
  category: string              // musician | comedian | actor | dj | radioHost | band
  subcategory?: string          // e.g., "konpa", "rasin", "hip-hop"
  verified: boolean             // All demo profiles = true
  
  // Biographical
  bio: string                   // 150-200 words, factual from research
  career_highlights: string[]   // 3-5 major achievements
  years_active: number          // Years in entertainment
  hometown: string              // City in Haiti or diaspora location
  
  // Languages & Availability
  languages: string[]           // ["Haitian Creole", "English", "French"]
  response_time: string         // "24 hours" | "2 days" | "3 days"
  
  // Pricing & Stats
  price_video_message: number   // $50-$500 based on fame level
  price_live_call: number       // 2-3x video message price
  rating: number                // 4.5-5.0
  total_reviews: number         // 100-2000
  total_videos: number          // 50-1000
  completion_rate: number       // 0.85-0.98
  
  // Media
  profile_image: string         // URL to stored image
  cover_image: string          // URL to banner image
  intro_video?: string         // Optional welcome video URL
  sample_videos: string[]      // 2-3 example video descriptions
  
  // Social Proof
  follower_count: number       // Realistic based on actual social media
  monthly_bookings: number     // 10-200 based on tier
  repeat_customer_rate: number // 0.15-0.40
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
  last_active: timestamp
  account_status: 'active' | 'busy' | 'vacation'
}
```

### Authentication Details:
```typescript
interface CreatorAuth {
  email: string                // firstname.lastname@annpale.demo
  password: string             // Secure, standardized: AnnPale2024_FirstName
  role: 'creator'
  email_verified: true
  phone?: string              // Optional: +1-XXX-XXX-XXXX format
}
```

---

## 🗄️ SUPABASE SCHEMA

### 1. Profiles Table Enhancement
```sql
-- Add demo-specific fields to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  is_demo_account boolean DEFAULT false,
  demo_tier varchar(20), -- 'superstar' | 'celebrity' | 'rising_star'
  public_figure_verified boolean DEFAULT false,
  wikipedia_url text,
  official_website text,
  press_kit_url text;

-- Create demo_creator_stats table
CREATE TABLE IF NOT EXISTS demo_creator_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_earnings decimal(10,2) DEFAULT 0,
  videos_this_month integer DEFAULT 0,
  average_turnaround_hours integer DEFAULT 24,
  satisfaction_score decimal(3,2) DEFAULT 4.80,
  featured_category text,
  trending_rank integer,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo_reviews table  
CREATE TABLE IF NOT EXISTS demo_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  video_type varchar(50), -- 'birthday' | 'encouragement' | 'anniversary'
  language varchar(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo_sample_videos table
CREATE TABLE IF NOT EXISTS demo_sample_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration_seconds integer,
  thumbnail_url text,
  category varchar(50),
  language varchar(10),
  view_count integer DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. RLS Policies
```sql
-- Enable RLS
ALTER TABLE demo_creator_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_sample_videos ENABLE ROW LEVEL SECURITY;

-- Public read access for demo data
CREATE POLICY "Public can view demo stats" ON demo_creator_stats
  FOR SELECT USING (true);

CREATE POLICY "Public can view demo reviews" ON demo_reviews
  FOR SELECT USING (true);

CREATE POLICY "Public can view demo samples" ON demo_sample_videos
  FOR SELECT USING (true);
```

---

## 📸 IMAGE SOURCING GUIDELINES

### Acceptable Sources (Copyright-Free):
1. **Wikimedia Commons** - First priority
2. **Official artist websites** - With press kit permission
3. **Pexels/Unsplash** - For generic category images only
4. **AI-generated** - As last resort for placeholder

### Image Requirements:
- **Profile Photo:** 500x500px minimum, square crop
- **Cover Image:** 1920x480px, landscape banner
- **Format:** JPEG or PNG, optimized under 500KB
- **Quality:** Professional, well-lit, recent (within 5 years)

### Storage Structure:
```
/public/images/creators/
  ├── profiles/
  │   ├── wyclef-jean.jpg
  │   ├── michael-brun.jpg
  │   └── ...
  └── covers/
      ├── wyclef-jean-banner.jpg
      ├── michael-brun-banner.jpg
      └── ...
```

---

## 🔍 RESEARCH REQUIREMENTS

### Information Sources:
1. **Wikipedia** - Basic biography, career highlights
2. **Official Websites** - Current projects, booking info
3. **Social Media** - Follower counts, engagement rates
4. **Music Platforms** - Spotify/Apple Music for discography
5. **News Articles** - Recent activities, achievements

### Data to Collect:
- [ ] Full legal name
- [ ] Stage/professional name
- [ ] Date of birth (for age calculation)
- [ ] Hometown/origin city
- [ ] Career start year
- [ ] Major achievements/awards
- [ ] Languages spoken
- [ ] Current residence (Haiti/US/Canada/France)
- [ ] Social media follower counts
- [ ] Notable works/albums/shows
- [ ] Charitable work/causes

### Research Template:
```markdown
# Creator: [Name]

## Basic Info
- Full Name: 
- Stage Name: 
- Born: 
- Origin: 
- Current Location: 

## Career
- Years Active: 
- Category: 
- Genre/Style: 
- Major Works: 
  - 
  - 

## Achievements
- 
- 

## Social Media Presence
- Instagram: @username (XXk followers)
- Twitter: @username (XXk followers)
- Facebook: /username (XXk followers)

## Languages
- [ ] Haitian Creole
- [ ] English  
- [ ] French
- [ ] Spanish

## Pricing Tier Recommendation
Based on fame level: $XXX for video message

## Bio Draft
[150-200 word biography]

## Sources
- Wikipedia: [URL]
- Official Site: [URL]
- News Article: [URL]
```

---

## 📝 SAMPLE CONTENT GENERATION

### Review Templates:
```javascript
const reviewTemplates = [
  {
    reviewer: "Marie P.",
    rating: 5,
    text: "Perfect birthday message for my mother! She was so surprised and happy. [Creator] spoke in Creole which made it extra special.",
    type: "birthday"
  },
  {
    reviewer: "John D.",
    rating: 5,
    text: "Amazing energy and authenticity. My wife loved the anniversary message. Will definitely book again!",
    type: "anniversary"
  },
  {
    reviewer: "Sandra L.",
    rating: 4,
    text: "Great message, delivered on time. Would have loved it to be a bit longer but overall very happy.",
    type: "encouragement"
  }
]
```

### Sample Video Descriptions:
```javascript
const sampleVideos = [
  {
    title: "Birthday Wishes in Creole",
    description: "Warm birthday message with traditional Haitian blessing",
    duration: 45,
    category: "birthday"
  },
  {
    title: "Graduation Congratulations", 
    description: "Motivational message for new graduates",
    duration: 60,
    category: "achievement"
  },
  {
    title: "Wedding Blessings",
    description: "Beautiful wishes for newlyweds with cultural touches",
    duration: 90,
    category: "wedding"
  }
]
```

---

## 🔗 GIT WORKTREE SETUP

### Prerequisites for Each Terminal
Before starting any tasks, each terminal must create its own git worktree to enable parallel development without conflicts:

```bash
# Terminal 1: Music Superstars (Wyclef, Michael Brun, Rutshelle)
git worktree add -b feature/demo-profiles-music ../AnnPale-demo-music main
cd ../AnnPale-demo-music

# Terminal 2: Entertainment Icons (Ti Jo, Richard Cave, Carel)  
git worktree add -b feature/demo-profiles-entertainment ../AnnPale-demo-entertainment main
cd ../AnnPale-demo-entertainment

# Terminal 3: DJs & Modern Artists (DJ K9, DJ Bullet, J Perry)
git worktree add -b feature/demo-profiles-djs ../AnnPale-demo-djs main
cd ../AnnPale-demo-djs

# Terminal 4: Bands & Additional Artists (Kenny, T-Vice, Carimi, Djakout, Harmonik, BelO)
git worktree add -b feature/demo-profiles-bands ../AnnPale-demo-bands main
cd ../AnnPale-demo-bands
```

### Working Process for Each Terminal
1. **Create worktree** using commands above
2. **Execute assigned tasks** in isolation
3. **Update progress** by editing this file directly
4. **Commit changes** with descriptive messages
5. **Report completion** to Terminal 1 coordinator

### Progress Tracking Method
Each terminal should update their completion status by editing this file:

```bash
# After completing a milestone, update this file:
edit DEMO_PROFILES_PLAN.md

# Find your terminal's section and update checkboxes:
# Change: - [ ] Research complete
# To:     - [x] Research complete

# Commit the progress update:
git add DEMO_PROFILES_PLAN.md
git commit -m "Terminal [X]: Completed [task] for [creator name]"
git push origin feature/demo-profiles-[category]
```

### Merge Coordination
Terminal 1 will coordinate all merges back to main branch once each terminal reports completion.

## 🚀 TERMINAL-SPECIFIC EXECUTION PHASES

### Phase 1: Environment Setup (30 minutes per terminal)

#### All Terminals - Initial Setup:
```bash
# 1. Create your worktree (use your specific command from Git section above)
git worktree add -b feature/demo-profiles-[category] ../AnnPale-demo-[category] main
cd ../AnnPale-demo-[category]

# 2. Verify Supabase access
npm install
cp .env.local .env.local.backup  # Backup current env
echo "SUPABASE_URL=..." >> .env.local  # Verify credentials work

# 3. Create your image folders
mkdir -p public/images/creators/profiles/[category]
mkdir -p public/images/creators/covers/[category]

# 4. Install image optimization tools
npm install sharp imagemin imagemin-mozjpeg imagemin-pngquant
```

#### Terminal-Specific Setup:
**Terminal 1 (Music):** Focus on music platform integrations, lyrics research  
**Terminal 2 (Entertainment):** TV/film databases, comedy archives  
**Terminal 3 (DJs):** Event listings, club databases  
**Terminal 4 (Bands):** Band member research, discography tracking  

---

### Phase 2: Research & Data Collection (2 hours per creator)

#### Step 2.1: Primary Research (45 minutes)
- [ ] **Wikipedia/Official Sites**: Basic bio, career timeline
- [ ] **Social Media**: Current follower counts (Instagram, Facebook, Twitter)
- [ ] **Music Platforms**: Spotify/Apple Music for plays, albums
- [ ] **News Sources**: Recent activities, achievements

#### Step 2.2: Pricing Tier Assessment (15 minutes)
- [ ] **International Fame**: $200-500 (Wyclef, Michael Brun)
- [ ] **Regional Stars**: $100-200 (T-Vice, Carimi, established bands)
- [ ] **Local Celebrities**: $50-100 (DJs, newer artists)
- [ ] **Rising Talent**: $25-75 (emerging artists)

#### Step 2.3: Content Planning (30 minutes)
- [ ] **Bio Writing**: 150-200 words, factual but engaging
- [ ] **Career Highlights**: 3-5 major achievements
- [ ] **Sample Video Ideas**: 3 different occasion types
- [ ] **Review Templates**: Plan 10-15 varied reviews

#### Step 2.4: Image Sourcing (30 minutes)
- [ ] **Profile Photo**: High-quality, professional, recent
- [ ] **Cover Image**: Concert/performance shots preferred
- [ ] **Copyright Check**: Wikimedia Commons first, official press kits second

**Quality Gate**: Each creator must have complete research doc before proceeding to Phase 3

---

### Phase 3: Content Creation (1.5 hours per creator)

#### Step 3.1: Image Processing (30 minutes)
```bash
# Resize profile images to 500x500
npx sharp input.jpg -resize 500 500 -output profiles/[creator-name].jpg

# Create cover images 1920x480
npx sharp input.jpg -resize 1920 480 -output covers/[creator-name]-banner.jpg

# Optimize file sizes
npx imagemin profiles/*.jpg --out-dir=profiles/optimized
```

#### Step 3.2: Profile Data Compilation (45 minutes)
- [ ] **Complete TypeScript interface** with all required fields
- [ ] **Generate realistic stats**: followers, videos, ratings based on research
- [ ] **Create sample videos**: Titles, descriptions, durations
- [ ] **Write authentic reviews**: Various occasions, languages, ratings

#### Step 3.3: Authentication Credentials (15 minutes)
- [ ] **Email**: `firstname.lastname@annpale.demo`
- [ ] **Password**: `AnnPale2024_[FirstName]`
- [ ] **Username**: `[firstname]_[lastname]_official`
- [ ] **Phone**: Generate realistic format if needed

**Quality Gate**: All content created and validated before database insertion

---

### Phase 4: Database Integration (45 minutes per creator)

#### Step 4.1: Supabase Account Creation (15 minutes)
```typescript
// Create auth account
const { data, error } = await supabase.auth.signUp({
  email: 'firstname.lastname@annpale.demo',
  password: 'AnnPale2024_FirstName',
  options: {
    data: {
      name: 'Display Name',
      role: 'creator'
    }
  }
})
```

#### Step 4.2: Profile Data Insertion (20 minutes)
```sql
-- Insert profile with all fields
INSERT INTO profiles (id, email, name, display_name, role, bio, ...)
VALUES (...);

-- Insert creator stats
INSERT INTO demo_creator_stats (profile_id, total_earnings, ...)
VALUES (...);

-- Insert reviews
INSERT INTO demo_reviews (creator_id, reviewer_name, rating, ...)
VALUES (...);
```

#### Step 4.3: Validation Testing (10 minutes)
- [ ] **Login Test**: Verify authentication works
- [ ] **Profile Display**: Check all fields render correctly
- [ ] **Image Loading**: Confirm photos display properly
- [ ] **Search Integration**: Verify profile appears in results

**Quality Gate**: All profiles must pass validation before marking complete

---

### Phase 5: Daily Coordination (15 minutes, 3x daily)

#### Morning Sync (9 AM):
- [ ] **Share overnight research findings**
- [ ] **Report any blockers or issues**
- [ ] **Coordinate shared resource usage**
- [ ] **Update DEMO_PROFILES_PLAN.md progress**

#### Midday Check-in (1 PM):
- [ ] **Image sourcing status update**
- [ ] **Quality issues discovered**
- [ ] **Timeline adjustments needed**

#### Evening Wrap-up (6 PM):
- [ ] **Profiles completed today**
- [ ] **Database entries created**
- [ ] **Push all changes to feature branch**
- [ ] **Update progress tracking**

---

### Phase 6: Integration & Platform Testing (2 hours - All Terminals)

#### Step 6.1: Homepage Integration (30 minutes)
- [ ] **Update featured creator carousel** with new profiles
- [ ] **Verify category distribution** is balanced
- [ ] **Test responsive display** on mobile/desktop

#### Step 6.2: Browse Page Integration (45 minutes)
- [ ] **Populate all creator categories** with new profiles
- [ ] **Test filtering by category, language, price**
- [ ] **Verify search functionality** finds creators by name
- [ ] **Check sorting options** (price, rating, popularity)

#### Step 6.3: Individual Profile Pages (30 minutes)
- [ ] **Test booking flow initiation** for each creator
- [ ] **Verify all profile data displays** correctly
- [ ] **Check image loading** and responsive design
- [ ] **Test review display** and pagination

#### Step 6.4: Cross-Terminal Validation (15 minutes)
- [ ] **No duplicate usernames** across terminals
- [ ] **Email addresses unique** in auth system
- [ ] **Consistent pricing tiers** within categories
- [ ] **Balanced language distribution**

**Final Quality Gate**: All profiles must work end-to-end before marking project complete

---

## ⏱️ TIME ESTIMATES PER TERMINAL

| Terminal | Creators | Setup | Research | Creation | Database | Testing | Total |
|----------|----------|--------|----------|----------|----------|---------|-------|
| Terminal 1 | 3 creators | 0.5h | 6h | 4.5h | 2.25h | 0.5h | **13.75h** |
| Terminal 2 | 3 creators | 0.5h | 6h | 4.5h | 2.25h | 0.5h | **13.75h** |
| Terminal 3 | 3 creators | 0.5h | 6h | 4.5h | 2.25h | 0.5h | **13.75h** |
| Terminal 4 | 6 creators | 0.5h | 12h | 9h | 4.5h | 0.5h | **26.5h** |

**Total Project Estimate: 67.75 hours across 4 terminals (~17h per terminal average)**

---

## 🚨 QUALITY GATES & ROLLBACK PROCEDURES

### Quality Gates:
1. **Research Complete**: All data sources documented, pricing justified
2. **Content Ready**: Images optimized, bio written, reviews drafted
3. **Database Validated**: Profile loads correctly, authentication works
4. **Integration Tested**: Appears in search, booking flow works

### Rollback Procedures:
```bash
# If creator profile fails validation:
git checkout HEAD~1 -- profiles/[creator-name].json
git checkout HEAD~1 -- public/images/creators/profiles/[creator-name]*

# If database insertion fails:
DELETE FROM profiles WHERE email = '[creator]@annpale.demo';
DELETE FROM demo_creator_stats WHERE profile_id = '[uuid]';

# If authentication fails:
# Reset in Supabase dashboard > Authentication > Users
```

---

## 📊 PROGRESS TRACKING

### Terminal 1: Music Superstars ✅ COMPLETED
- [x] Wyclef Jean
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated
- [x] Michael Brun
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated
- [x] Rutshelle Guillaume
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated

### Terminal 2: Entertainment Icons ✅ COMPLETED
- [x] Ti Jo Zenny
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated
- [x] Richard Cave
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated
- [x] Carel Pedre
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated

### Terminal 3: DJs & Modern Artists ✅ COMPLETED
- [x] DJ K9
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated
- [x] DJ Bullet
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated
- [x] J Perry
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated

### Terminal 4: Bands & Additional Artists ✅ COMPLETED
- [x] Kenny
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated
- [x] T-Vice
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated
- [x] Carimi
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated
- [x] Djakout
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated
- [x] Harmonik
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated
- [x] BelO
  - [x] Research complete
  - [x] Images sourced
  - [x] Profile created
  - [x] Auth configured
  - [x] Data populated

---

## 🔐 SECURITY & PRIVACY

### Important Guidelines:
1. **Use only public information** - No private details
2. **Respectful representation** - Accurate, positive portrayals
3. **Demo disclaimer** - Clear marking as demo accounts
4. **Secure passwords** - Standardized but secure format
5. **No real contact info** - Use @annpale.demo emails
6. **Copyright compliance** - Only use permitted images

### Demo Account Markers:
- Email domain: `@annpale.demo`
- Profile field: `is_demo_account: true`
- Username prefix: `demo_` (hidden from UI)
- Bio footer: "Demo profile for illustration purposes"

---

## 📞 COORDINATION POINTS

### Daily Sync Requirements:
1. **Morning:** Check research sources, share findings
2. **Midday:** Image sourcing status update
3. **Evening:** Profile creation progress
4. **End of Day:** Push all data to Supabase

### Conflict Prevention:
- Each terminal works on assigned creators only
- Shared resources (Supabase) accessed sequentially
- Image folders organized by terminal number
- Unique email addresses prevent auth conflicts

---

## ✅ SUCCESS CRITERIA

### Each Profile Must Have:
- [ ] Complete biographical information
- [ ] Professional quality images
- [ ] Working authentication
- [ ] 10+ reviews with variety
- [ ] 3+ sample video descriptions
- [ ] Realistic statistics
- [ ] Proper categorization
- [ ] Language settings
- [ ] Active status

### Platform Integration:
- [ ] Profiles appear in search
- [ ] Category filters work correctly
- [ ] Featured carousel displays properly
- [ ] Individual profile pages load
- [ ] Authentication successful
- [ ] Booking flow initiates correctly

---

## 🎯 FINAL DELIVERABLES

1. **15+ Complete Creator Profiles** with authentic data
2. **Supabase Database** fully populated
3. **Image Library** with optimized assets
4. **Authentication System** with demo accounts
5. **Sample Content** (reviews, videos, stats)
6. **Documentation** of all credentials and data

---

## 📅 TIMELINE

**Estimated Total Time:** 2-3 days

- **Day 1:** Research and data gathering
- **Day 2:** Profile creation and media upload
- **Day 3:** Testing, verification, and integration

**Per Creator Estimate:** 3-4 hours total
- Research: 2 hours
- Profile Setup: 1 hour  
- Testing: 30 minutes
- Integration: 30 minutes

---

## 🆘 TROUBLESHOOTING

### Common Issues:
1. **Image Copyright:** If unsure, use placeholder
2. **Missing Bio Data:** Use category-generic description
3. **Supabase Conflicts:** Check for duplicate emails
4. **Auth Failures:** Verify email format and password
5. **Display Issues:** Check image dimensions and format

### Escalation Path:
1. Try troubleshooting guide
2. Check with other terminals
3. Consult documentation
4. Create placeholder and note issue

---

*This plan ensures authentic, respectful representation of Haitian talent while creating a realistic demo environment for the Ann Pale platform.*