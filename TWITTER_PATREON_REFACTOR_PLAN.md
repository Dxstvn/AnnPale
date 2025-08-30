# Twitter/X + Patreon Style Fan UI/UX Refactoring Plan with Full Integration

## 🎯 Project Overview
Transform Ann Pale's fan experience into a Twitter/X-style vertical feed with Patreon-like subscription tiers, seamlessly integrating Cameo-style video booking features - **with complete integration into the production site**.

## 📋 Core Requirements
1. **Twitter/X-style vertical feed** with text, images, and video posts
2. **Creator profiles** with hero image, bio, and integrated feed below
3. **Patreon-style subscription tiers** with clear benefits
4. **Intelligent Cameo integration** for video bookings
5. **Demo profiles** from Supabase (15+ creators)
6. **Test account access** (daj353@nyu.edu) for real profiles
7. **Full production integration** with routing, navigation, and data flow

---

## 🔗 GIT WORKTREE SETUP INSTRUCTIONS

### IMPORTANT: Each Terminal Must Set Up Their Worktree First

Before beginning any development work, each terminal must create their own git worktree to enable parallel development without conflicts:

```bash
# Terminal 1: Feed & Navigation (Coordinator)
git worktree add -b feature/twitter-feed ../AnnPale-twitter-feed main
cd ../AnnPale-twitter-feed
npm install

# Terminal 2: Creator Profiles
git worktree add -b feature/creator-profiles ../AnnPale-creator-profiles main
cd ../AnnPale-creator-profiles
npm install

# Terminal 3: Explore & Discovery
git worktree add -b feature/explore-discovery ../AnnPale-explore main
cd ../AnnPale-explore
npm install

# Terminal 4: Engagement System
git worktree add -b feature/social-engagement ../AnnPale-engagement main
cd ../AnnPale-engagement
npm install

# Terminal 5: Data Layer
git worktree add -b feature/data-layer ../AnnPale-data-layer main
cd ../AnnPale-data-layer
npm install
```

### Verify Your Worktree Setup:
```bash
# Check you're in the correct worktree
pwd  # Should show /Users/.../AnnPale-[your-feature]

# Verify you're on the correct branch
git branch --show-current  # Should show feature/[your-feature]

# Ensure you can run the development server
npm run dev  # Should start without errors
```

### Continuous Integration Process:
```bash
# Regularly sync with main to avoid conflicts
git fetch origin main
git merge origin/main

# Push your progress frequently
git add -A
git commit -m "Terminal [X]: [Feature description]"
git push origin feature/[your-feature]
```

---

## 📝 DETAILED TERMINAL ASSIGNMENTS

### Terminal 1: Feed Architecture & Navigation Integration (Coordinator)
**Branch:** `feature/twitter-feed`
**Worktree:** `../AnnPale-twitter-feed`

#### 🛠️ Setup & Dependencies
```bash
npm install framer-motion react-intersection-observer date-fns react-player
npm install --save-dev @types/react-player
```

#### 📁 Step 1: Build Core Feed Components

**1.1 Main Feed Page** (`/app/fan/feed/page.tsx`)
```typescript
// Key features to implement:
- Vertical scrolling container with virtual scrolling for performance
- Tab system: "For You" (algorithmic) and "Following" (chronological)
- Infinite scroll using Intersection Observer
- Pull-to-refresh functionality for mobile
- Loading skeletons while fetching
- Empty state for new users
```

**1.2 PostCard Component** (`/components/feed/PostCard.tsx`)
```typescript
// Component structure:
interface PostCardProps {
  post: {
    id: string
    creator: CreatorInfo
    content: string
    mediaUrls?: string[]
    postType: 'text' | 'image' | 'video' | 'poll'
    engagement: EngagementMetrics
    visibility: 'public' | 'subscribers' | 'tier-specific'
    tierRequired?: string
  }
}

// Features to include:
- Render different layouts based on postType
- Show creator avatar, name, username, verification badge
- Display subscription tier badge if subscribed
- Engagement buttons row (like, repost, comment, share)
- Timestamp with relative time (e.g., "2h ago")
- "Show more" for long text content
- Blur gated content for non-subscribers
```

**1.3 Post Composer** (`/components/feed/PostComposer.tsx`)
```typescript
// For creators only - check user role
- Text input with character counter (280 chars)
- Media upload (images/videos)
- Visibility selector (public, subscribers only, specific tier)
- Schedule post option
- Post button with loading state
```

**1.4 Feed Data Management** (`/lib/hooks/useFeed.ts`)
```typescript
// Implement custom hook for feed data:
export function useFeed(feedType: 'for-you' | 'following') {
  // Use SWR for caching and real-time updates
  // Implement pagination with cursor-based fetching
  // Filter posts based on subscription status
  // Handle error states and retry logic
  // Return: { posts, isLoading, error, loadMore, refresh }
}
```

#### 📁 Step 2: Navigation Integration

**2.1 Update Fan Layout** (`/app/fan/layout.tsx`)
```typescript
// Changes to make:
- Replace "Home" with "Feed" in navigation array
- Update icon from Home to a feed-specific icon
- Add notification badge component to header
- Ensure active state styling for current route
```

**2.2 Create Redirect** (`/app/fan/home/page.tsx`)
```typescript
// Replace entire content with:
export default function HomePage() {
  redirect('/fan/feed')
}
```

**2.3 Mobile Navigation Updates**
```typescript
// Ensure mobile bottom nav includes:
- Feed icon and route
- Active state indicator
- Badge for new posts indicator
```

#### 📁 Step 3: Integration Testing

**Test Checklist:**
- [ ] Feed loads within 2 seconds
- [ ] Infinite scroll works smoothly
- [ ] Posts render correctly for all types
- [ ] Navigation updates across all pages
- [ ] Mobile responsive at all breakpoints
- [ ] Pull-to-refresh works on mobile
- [ ] Subscription gates display properly

---

### Terminal 2: Creator Profile Pages & Routing Integration
**Branch:** `feature/creator-profiles`
**Worktree:** `../AnnPale-creator-profiles`

#### 🛠️ Setup & Dependencies
```bash
npm install @radix-ui/react-tabs @radix-ui/react-avatar
npm install react-markdown remark-gfm  # For bio rendering
```

#### 📁 Step 1: Profile Architecture

**1.1 Dynamic Profile Route** (`/app/creator/[username]/page.tsx`)
```typescript
// Implementation requirements:
export default async function CreatorProfilePage({ 
  params 
}: { 
  params: { username: string } 
}) {
  // 1. Fetch creator by username from Supabase
  // 2. Check if viewer is subscribed
  // 3. Load creator's posts (paginated)
  // 4. Load subscription tiers
  // 5. Handle 404 for non-existent profiles
  // 6. Check if test account for real profile access
}
```

**1.2 Profile Layout Wrapper** (`/app/creator/[username]/layout.tsx`)
```typescript
// Wrapper for consistent profile styling:
- Set max-width container
- Add back navigation button
- Include meta tags for SEO
- Handle loading states
```

#### 📁 Step 2: Profile Components

**2.1 ProfileHero Component** (`/components/profile/ProfileHero.tsx`)
```typescript
// Visual structure:
- Cover image (1500x500) with gradient overlay
- Avatar (200x200) overlapping cover
- Verified badge for authenticated creators
- Name and @username
- Bio with expandable "Show more"
- Location and join date
- External links (website, social)
```

**2.2 ProfileStats Bar** (`/components/profile/ProfileStats.tsx`)
```typescript
// Display metrics:
- Total followers (formatted: 1.2K, 10M)
- Active subscribers count
- Total posts
- Videos completed (for Cameo feature)
- Average rating with stars
```

**2.3 Profile Content Tabs** (`/components/profile/ProfileTabs.tsx`)
```typescript
// Tab structure:
1. Posts - Creator's feed
2. Media - Images and videos grid
3. About - Detailed bio, languages, categories
4. Reviews - Customer testimonials

// Use Radix UI tabs for accessibility
```

**2.4 Subscription Tiers Card** (`/components/profile/SubscriptionTiers.tsx`)
```typescript
// Tier display:
- Show all available tiers (Basic, Premium, VIP)
- Custom tier names from creator
- Price and billing period
- Benefits list with checkmarks
- "Subscribe" button for each
- "Current tier" badge if subscribed
- Comparison mode to see all benefits
```

**2.5 Book Video Button** (`/components/profile/BookVideoButton.tsx`)
```typescript
// Prominent CTA:
- Floating action button on mobile
- Fixed position in sidebar on desktop
- Show video message price
- Turnaround time
- "Book Now" with booking icon
- Link to `/creator/[username]/book`
```

#### 📁 Step 3: Username System

**3.1 Creator Username Mapping** (`/lib/creator-usernames.ts`)
```typescript
export const creatorUsernames = {
  // Music creators
  'wyclef-jean': { id: 'creator-001', displayName: 'Wyclef Jean' },
  'michael-brun': { id: 'creator-002', displayName: 'Michael Brun' },
  'rutshelle': { id: 'creator-003', displayName: 'Rutshelle Guillaume' },
  
  // Entertainment
  'tijo-zenny': { id: 'creator-004', displayName: 'Ti Jo Zenny' },
  'richard-cave': { id: 'creator-005', displayName: 'Richard Cave' },
  
  // Add all 15+ demo creators
}
```

**3.2 Update All Creator Links**
```typescript
// Files to update:
- /app/page.tsx - Landing page creator cards
- /app/browse/page.tsx - Browse page links
- /components/creator/creator-card.tsx - Card component links
- /app/fan/subscriptions/page.tsx - Subscription list links

// Change from: href="/creator/123"
// To: href="/creator/wyclef-jean"
```

#### 📁 Step 4: Integration Points

**4.1 Connect to Booking Flow**
```typescript
// Ensure booking button links properly:
- Pass creator ID to booking page
- Include video message pricing
- Show availability status
```

**4.2 Subscription Management**
```typescript
// Link subscription tiers to:
- Existing subscription flow
- Payment processing
- Access control for content
```

---

### Terminal 3: Explore & Discovery Integration ✅ COMPLETED
**Branch:** `feature/explore-discovery`
**Worktree:** `../AnnPale-explore`
**Status:** ✅ Successfully implemented on 2025-08-28

#### 🛠️ Setup & Dependencies ✅
```bash
npm install react-select @tanstack/react-virtual
npm install fuse.js  # For fuzzy search
npm install lodash.debounce
```

#### 📁 Step 1: Explore Page Structure

**1.1 Main Explore Page** (`/app/fan/explore/page.tsx`)
```typescript
// Page sections:
1. Search bar with real-time results
2. Category filter chips
3. "Trending Now" horizontal scroll
4. "Recommended For You" based on subscriptions
5. "All Creators" grid with pagination
```

**1.2 Explore Layout** (`/app/fan/explore/layout.tsx`)
```typescript
// Layout features:
- Sticky search header on scroll
- Responsive grid system
- Loading states for each section
```

#### 📁 Step 2: Discovery Components

**2.1 Search Implementation** (`/components/explore/SearchBar.tsx`)
```typescript
// Search features:
- Instant search with debounce (300ms)
- Search by: name, username, category, bio
- Recent searches stored in localStorage
- Clear search button
- Search suggestions dropdown
- "See all results" link
```

**2.2 Category System** (`/components/explore/CategoryFilter.tsx`)
```typescript
// Categories to include:
const categories = [
  { id: 'music', label: 'Music', icon: MusicIcon, color: 'purple' },
  { id: 'comedy', label: 'Comedy', icon: SmileIcon, color: 'yellow' },
  { id: 'dance', label: 'Dance', icon: ActivityIcon, color: 'pink' },
  { id: 'sports', label: 'Sports', icon: TrophyIcon, color: 'green' },
  // Add more categories
]

// Features:
- Visual category cards with icons
- Multi-select capability
- Show creator count per category
- Active state styling
```

**2.3 Trending Creators** (`/components/explore/TrendingCreators.tsx`)
```typescript
// Display logic:
- Show top 10 trending creators
- Based on recent engagement
- Horizontal scroll on mobile
- Grid on desktop
- "Live" badge for streaming creators
```

**2.4 Creator Preview Card** (`/components/explore/CreatorPreviewCard.tsx`)
```typescript
// Card structure:
- Avatar with online indicator
- Name and username
- Category badge
- Subscriber count
- Recent post preview (text truncated)
- Price range for tiers
- Quick "Subscribe" button
- Click to view full profile
```

#### 📁 Step 3: Search & Filter Logic

**3.1 Search Hook** (`/lib/hooks/useSearch.ts`)
```typescript
export function useCreatorSearch(query: string, filters: Filters) {
  // Implement fuzzy search with Fuse.js
  // Filter by categories
  // Sort by relevance
  // Cache results
  // Return paginated results
}
```

**3.2 Recommendation Algorithm** (`/lib/recommendation.ts`)
```typescript
// Recommendation logic:
- Based on current subscriptions
- Similar category creators
- Engagement patterns
- Exclude already subscribed
```

#### 📁 Step 4: Navigation Integration

**4.1 Update Navigation**
```typescript
// In /app/fan/layout.tsx:
- Replace "Favorites" with "Explore"
- Use Search or Compass icon
- Add to mobile bottom navigation
```

**4.2 API Routes** (`/app/api/creators/search/route.ts`)
```typescript
// Search endpoint:
export async function GET(request: Request) {
  // Parse search params
  // Query Supabase with filters
  // Return paginated results
  // Cache for performance
}
```

---

### Terminal 4: Engagement System & Real-time Integration
**Branch:** `feature/social-engagement`
**Worktree:** `../AnnPale-engagement`

#### 🛠️ Setup & Dependencies
```bash
npm install react-hot-toast @supabase/realtime-js
npm install react-transition-group  # For animations
npm install copy-to-clipboard
```

#### 📁 Step 1: Engagement Components

**1.1 Like Button** (`/components/engagement/LikeButton.tsx`)
```typescript
// Features:
- Heart icon that fills on click
- Optimistic UI updates
- Animation on interaction (scale + color)
- Count display with formatting (1.2K)
- Disabled state for non-authenticated
```

**1.2 Repost System** (`/components/engagement/RepostButton.tsx`)
```typescript
// Repost options:
1. Quick repost (one click)
2. Quote repost (with comment)
3. Share to story (future feature)

// Implementation:
- Modal for quote repost
- Character limit for quotes
- Show repost count
- "Unrepost" option
```

**1.3 Comment Thread** (`/components/engagement/CommentThread.tsx`)
```typescript
// Comment features:
- Nested replies (2 levels max)
- Load more pagination
- Real-time new comments
- Like comments
- Report/moderate options
- @mentions with autocomplete
```

**1.4 Share Modal** (`/components/engagement/ShareModal.tsx`)
```typescript
// Share options:
- Copy link to clipboard
- Share to Twitter/X
- Share to Facebook
- Share to WhatsApp
- Email share
- QR code for mobile
```

#### 📁 Step 2: Notification System

**2.1 Notification Page** (`/app/fan/notifications/page.tsx`)
```typescript
// Notification types:
- New follower
- Post liked
- Comment on your post
- Repost of your content
- New subscriber
- Subscription renewal

// Features:
- Group similar notifications
- Mark as read (single/all)
- Filter by type
- Infinite scroll
- Time-based sections (Today, Yesterday, This Week)
```

**2.2 Notification Provider** (`/contexts/notification-context.tsx`)
```typescript
// Context features:
- Real-time notification count
- WebSocket connection management
- Notification queue
- Toast notifications for new items
- Sound/vibration settings
```

**2.3 Notification Badge** (`/components/NotificationBadge.tsx`)
```typescript
// Badge display:
- Show count up to 99+
- Red dot for unread
- Click to open dropdown
- Quick preview of recent 5
- "See all" link to page
```

#### 📁 Step 3: Real-time Integration

**3.1 WebSocket Manager** (`/lib/realtime/websocket-manager.ts`)
```typescript
// Connection management:
- Single connection instance
- Auto-reconnect on disconnect
- Subscribe to channels
- Handle connection states
- Cleanup on unmount
```

**3.2 Post Engagement Updates** (`/lib/realtime/postEngagement.ts`)
```typescript
// Real-time subscriptions:
- Subscribe to post engagement changes
- Update counts without refresh
- Show "New comments" indicator
- Cross-tab synchronization
```

#### 📁 Step 4: Integration with Feed

**4.1 Add to PostCard**
```typescript
// In PostCard component:
- Import all engagement components
- Add engagement row below content
- Connect to Supabase for persistence
- Handle authentication state
```

**4.2 API Endpoints**
```typescript
// Create endpoints:
- POST /api/posts/[id]/like
- POST /api/posts/[id]/repost
- POST /api/posts/[id]/comment
- GET /api/notifications
```

---

### Terminal 5: Data Layer & Access Control Integration ✅ COMPLETED
**Branch:** `feature/data-layer`
**Worktree:** `../AnnPale-data-layer`
**Status:** ✅ Completed on Day 1

#### 🛠️ Setup & Dependencies ✅
```bash
npm install @faker-js/faker  # ✅ Installed
npm install bcryptjs  # For any hashing needs
```

#### 📁 Step 1: Database Schema ✅

**1.1 Create Migration Files** (`/supabase/migrations/`)

```sql
-- 001_create_posts_table.sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  media_urls TEXT[],
  post_type VARCHAR(20) CHECK (post_type IN ('text', 'image', 'video', 'poll')),
  visibility VARCHAR(20) CHECK (visibility IN ('public', 'subscribers', 'tier-specific')),
  required_tier_id UUID REFERENCES creator_subscription_tiers(id),
  likes_count INTEGER DEFAULT 0,
  reposts_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 002_create_engagement_table.sql
CREATE TABLE post_engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  engagement_type VARCHAR(20) CHECK (engagement_type IN ('like', 'repost', 'comment')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id, engagement_type)
);

-- 003_create_comments_table.sql
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id),
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 004_create_notifications_table.sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_posts_creator_id ON posts(creator_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_engagements_post_id ON post_engagements(post_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id, read);
```

**1.2 Update Profiles Table** (`/supabase/migrations/005_update_profiles.sql`)
```sql
-- Add username field for URL-friendly profiles
ALTER TABLE profiles 
ADD COLUMN username VARCHAR(50) UNIQUE,
ADD COLUMN cover_image_url TEXT,
ADD COLUMN is_demo_account BOOLEAN DEFAULT FALSE;

-- Add username for existing demo profiles
UPDATE profiles SET username = 'wyclef-jean' WHERE id = 'creator-001';
-- Continue for all demo creators
```

#### 📁 Step 2: Seed Demo Content ✅

**2.1 Demo Posts Generator** (`/scripts/seed-social-data.ts`) ✅
```typescript
import { faker } from '@faker-js/faker';

// Generate variety of posts for each creator
const generatePosts = (creatorId: string) => {
  const posts = [];
  
  // Text posts
  for (let i = 0; i < 5; i++) {
    posts.push({
      creator_id: creatorId,
      content: faker.lorem.sentences(3),
      post_type: 'text',
      visibility: 'public',
      likes_count: faker.number.int({ min: 10, max: 500 }),
      created_at: faker.date.recent({ days: 30 })
    });
  }
  
  // Image posts
  for (let i = 0; i < 3; i++) {
    posts.push({
      creator_id: creatorId,
      content: faker.lorem.sentence(),
      media_urls: [faker.image.url()],
      post_type: 'image',
      visibility: 'subscribers',
      likes_count: faker.number.int({ min: 50, max: 1000 })
    });
  }
  
  // Add tier-specific content
  // Add video posts
  // Add polls
  
  return posts;
};
```

**2.2 Run Seeding Script**
```bash
# Execute seeding
npx tsx scripts/seed-posts.ts
```

#### 📁 Step 3: Data Access Layer ✅

**3.1 Post Queries** (`/lib/data/posts.ts`) ✅
```typescript
export async function getFeedPosts(userId: string, cursor?: string) {
  // Get posts from subscribed creators
  // Include public posts from non-subscribed
  // Check tier access
  // Paginate with cursor
  // Join with creator info
  // Include engagement status
}

export async function getCreatorPosts(username: string, viewerId: string) {
  // Get creator's posts
  // Filter by subscription status
  // Include engagement metrics
  // Paginate results
}

export async function createPost(post: PostInput) {
  // Validate creator role
  // Insert post
  // Handle media uploads
  // Return created post
}
```

**3.2 Profile Queries** (`/lib/supabase/profiles.ts`)
```typescript
export async function getCreatorByUsername(username: string) {
  // Fetch creator profile
  // Include subscription tiers
  // Include stats
  // Check if demo account
}

export async function getCreatorStats(creatorId: string) {
  // Calculate follower count
  // Get subscriber count
  // Total posts
  // Average engagement
}
```

**3.3 Subscription Queries** (`/lib/supabase/subscriptions.ts`)
```typescript
export async function checkSubscription(userId: string, creatorId: string) {
  // Check if user subscribes to creator
  // Return tier level if subscribed
  // Check expiration date
}

export async function getSubscribedCreators(userId: string) {
  // Get all subscribed creators
  // Include tier information
  // Order by subscription date
}
```

#### 📁 Step 4: Access Control

**4.1 Middleware Updates** (`/middleware.ts`)
```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check authentication
  const session = await getSession();
  
  // Test account detection
  const isTestAccount = session?.user?.email === 'daj353@nyu.edu';
  
  // Route protection
  if (pathname.startsWith('/fan/')) {
    if (!session) {
      return NextResponse.redirect('/login');
    }
  }
  
  // Creator profile access
  if (pathname.startsWith('/creator/')) {
    const username = pathname.split('/')[2];
    const creator = await getCreatorByUsername(username);
    
    // Allow demo profiles for all
    if (creator.is_demo_account) {
      return NextResponse.next();
    }
    
    // Real profiles only for test account
    if (!isTestAccount) {
      return NextResponse.redirect('/explore');
    }
  }
}
```

**4.2 Permission Utilities** (`/lib/access-control.ts`)
```typescript
export function canViewPost(post: Post, userId: string, subscription?: Subscription) {
  // Public posts visible to all
  if (post.visibility === 'public') return true;
  
  // Subscriber-only posts
  if (post.visibility === 'subscribers') {
    return !!subscription;
  }
  
  // Tier-specific posts
  if (post.visibility === 'tier-specific') {
    return subscription?.tier_id === post.required_tier_id;
  }
  
  return false;
}
```

---

## 🔄 INTEGRATION & COORDINATION

### Terminal 1 (Coordinator) Integration Tasks

#### Merge Sequence
```bash
# Order of merging (after all terminals complete their work):
1. git merge origin/feature/data-layer      # Data foundation
2. git merge origin/feature/creator-profiles # Profile pages
3. git merge origin/feature/explore-discovery # Discovery system
4. git merge origin/feature/social-engagement # Engagement features
5. # Terminal 1 merges last with final integration
```

#### Conflict Resolution Strategy
1. **Before merging**: Check for file conflicts
2. **Common conflict areas**:
   - `/app/fan/layout.tsx` - Multiple navigation updates
   - `/lib/supabase/client.ts` - Multiple query additions
   - `/package.json` - Dependency additions
3. **Resolution approach**: Combine changes, don't overwrite

#### Integration Testing Checklist
- [ ] All routes accessible and functional
- [ ] Feed loads with proper data
- [ ] Creator profiles display correctly
- [ ] Explore page shows all creators
- [ ] Engagement features work in real-time
- [ ] Subscriptions gate content properly
- [ ] Test account sees real profiles
- [ ] Mobile navigation works
- [ ] No console errors in production build

---

## 📊 SUCCESS METRICS

### Performance Targets
- **Feed Load Time**: < 2 seconds
- **Profile Load Time**: < 1.5 seconds
- **Infinite Scroll**: 60fps smooth scrolling
- **Search Response**: < 300ms
- **Lighthouse Score**: > 85

### Functionality Verification
- [ ] Feed shows mixed content types
- [ ] Profiles have all sections populated
- [ ] Explore search returns relevant results
- [ ] Likes/reposts update in real-time
- [ ] Notifications appear instantly
- [ ] Subscription tiers display correctly
- [ ] Video booking button prominent
- [ ] Navigation updates site-wide

### User Flow Testing
1. **New User**: Sign up → Browse creators → View profile → Subscribe → See feed
2. **Returning User**: Login → Feed loads → Engage with posts → Explore new creators
3. **Creator**: Login → Create post → View engagement → Check analytics
4. **Test Account**: Login → Access real profiles → Full feature access

---

## 🚀 DEPLOYMENT STRATEGY

### Pre-Deployment Checklist
```bash
# Build verification
npm run build  # No errors
npm run type-check  # No TypeScript errors
npm run lint  # No linting errors

# Test suites
npm run test  # Unit tests pass
npm run test:e2e  # E2E tests pass
```

### Deployment Steps
1. **Staging Deployment**:
   ```bash
   git push origin main
   # Vercel auto-deploys to preview URL
   ```

2. **Production Verification**:
   - Test all user flows on staging
   - Check performance metrics
   - Verify mobile responsiveness
   - Test with real data

3. **Production Release**:
   - Merge to production branch
   - Monitor error tracking
   - Check analytics for user behavior
   - Be ready to rollback if issues

### Feature Flags
```typescript
// In .env.local
NEXT_PUBLIC_FEATURE_NEW_UI=true
NEXT_PUBLIC_TEST_ACCOUNT_EMAIL=daj353@nyu.edu
```

---

## 📝 PROGRESS TRACKING

### Terminal Status Board

#### Terminal 1: Feed & Navigation ✅ COMPLETED
- [x] Worktree setup complete
- [x] Dependencies installed
- [x] Feed page created
- [x] PostCard component built
- [x] Navigation updated
- [x] Integration tested
- [x] Ready for merge
- [x] **COORDINATOR - INTEGRATION COMPLETE**

#### Terminal 2: Creator Profiles ✅ COMPLETED
- [x] Worktree setup complete
- [x] Profile route created
- [x] Hero component built
- [x] Subscription tiers displayed
- [x] Video booking integrated
- [x] All links updated
- [x] Ready for merge
- [x] **MERGED INTO MAIN BRANCH**

#### Terminal 3: Explore & Discovery ✅ COMPLETED
- [x] Worktree setup complete
- [x] Explore page created
- [x] Search implemented
- [x] Categories functional
- [x] Preview cards built
- [x] Navigation updated
- [x] Ready for merge
- [x] **MERGED INTO MAIN BRANCH**

#### Terminal 4: Engagement System ✅ COMPLETED
- [x] Worktree setup complete
- [x] Engagement buttons created
- [x] Notifications built
- [x] Real-time working
- [x] Integration complete
- [x] WebSockets tested
- [x] Ready for merge
- [x] **MERGED INTO MAIN BRANCH**

#### Terminal 5: Data Layer ✅ COMPLETED
- [x] Worktree setup complete
- [x] Migrations created
- [x] Demo data seeded
- [x] Queries implemented
- [x] Access control working
- [x] Test account verified
- [x] Ready for merge
- [x] **MERGED INTO MAIN BRANCH**

---

## 🎉 INTEGRATION COMPLETE - 2025-08-28

**All terminals successfully integrated by Terminal 1 (Coordinator)**

✅ **Build Status**: Production build successful (226 pages compiled)
✅ **Merge Conflicts**: Resolved navigation and dependency conflicts
✅ **Features Integrated**:
- Twitter/X-style vertical feed (`/fan/feed`)
- Username-based creator profiles (`/creator/[username]`)
- Search & discovery system (`/fan/explore`)
- Social engagement & notifications (`/fan/notifications`)
- Complete database schema & demo data

✅ **Navigation Updated**: Feed + Explore now primary navigation
✅ **Performance**: All core pages under 25kB, optimal loading
✅ **Development Server**: Running at http://localhost:3000

---

This comprehensive plan ensures each terminal has clear, actionable steps with specific implementation details, making it suitable for rapid execution with Claude Code assistance.