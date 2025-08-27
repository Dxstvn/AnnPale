# QUICK START GUIDE - TERMINAL SETUP
## Copy & Paste Commands for Each Terminal

---

## 🚀 TERMINAL 2 - Hide Livestreaming
```bash
# Setup (run these in order)
cd /Users/dustinjasmin
git -C AnnPale worktree add -b feature/hide-livestreaming AnnPale-hide-livestreaming main
cd AnnPale-hide-livestreaming
cd homepage
npm install

# Your tasks:
# 1. Create /homepage/lib/feature-flags.ts
# 2. Update /homepage/app/fan/layout.tsx (hide livestreams)
# 3. Update /homepage/app/creator/layout.tsx (hide streaming)
# 4. Update /homepage/app/admin/layout.tsx (hide streaming)
# 5. Add NEXT_PUBLIC_ENABLE_LIVESTREAMING=false to .env.local
# 6. Test: npm run build

# When done:
git add .
git commit -m "feat(T2): hide livestreaming features from UI"
git push origin feature/hide-livestreaming
```

---

## 🚀 TERMINAL 3 - Real Stats Implementation
```bash
# Setup (run these in order)
cd /Users/dustinjasmin
git -C AnnPale worktree add -b feature/real-stats AnnPale-real-stats main
cd AnnPale-real-stats
cd homepage
npm install

# Your tasks:
# 1. Create /homepage/lib/services/stats-service.ts
# 2. Create /homepage/hooks/use-stats.ts
# 3. Update /homepage/app/fan/dashboard/page.tsx (real data)
# 4. Update /homepage/app/creator/dashboard/page.tsx (real data)
# 5. Update /homepage/app/admin/dashboard/page.tsx (real data)
# 6. Test: npm run build

# When done:
git add .
git commit -m "feat(T3): implement real statistics across dashboards"
git push origin feature/real-stats
```

---

## 🚀 TERMINAL 4 - Patreon Subscriptions
```bash
# Setup (run these in order)
cd /Users/dustinjasmin
git -C AnnPale worktree add -b feature/subscription-system AnnPale-subscriptions main
cd AnnPale-subscriptions
cd homepage
npm install

# Your tasks:
# 1. Update /homepage/app/fan/layout.tsx (Dashboard → Home, add Subscriptions)
# 2. Create /homepage/app/fan/home/page.tsx
# 3. Move dashboard content to home
# 4. Create /homepage/app/fan/subscriptions/page.tsx
# 5. Create /homepage/app/fan/creators/[id]/page.tsx
# 6. Create /homepage/lib/services/feed-service.ts
# 7. Test: npm run build

# When done:
git add .
git commit -m "feat(T4): implement Patreon-like subscription system"
git push origin feature/subscription-system
```

---

## 🚀 TERMINAL 5 - Testing Infrastructure
```bash
# Setup (run these in order)
cd /Users/dustinjasmin
git -C AnnPale worktree add -b feature/testing-infra AnnPale-testing main
cd AnnPale-testing
cd homepage
npm install

# Your tasks:
# 1. Setup Storybook: npx storybook@latest init
# 2. Create stories for UI components (button, card, input, badge)
# 3. Create /homepage/tests/e2e/stable-flows.spec.ts
# 4. Create /homepage/tests/e2e/auth.spec.ts
# 5. Run tests: npm run test-storybook
# 6. Run E2E: npx playwright test

# When done:
git add .
git commit -m "test(T5): setup testing infrastructure with Storybook and Playwright"
git push origin feature/testing-infra
```

---

## 📋 TERMINAL 1 - Main Coordinator

### Check Status
```bash
cd /Users/dustinjasmin/AnnPale
git worktree list
git status
```

### Merge Completed Features (example for Terminal 2)
```bash
git checkout main
git pull origin main
git merge --no-ff feature/hide-livestreaming -m "feat: hide livestreaming features"
git push origin main

# Notify other terminals to rebase:
# "Terminal 2 merged. Please rebase: git fetch origin && git rebase origin/main"
```

### Clean Up After Merge
```bash
git branch -d feature/hide-livestreaming
git worktree remove /Users/dustinjasmin/AnnPale-hide-livestreaming
```

---

## 🔄 DAILY SYNC COMMANDS (ALL TERMINALS)

### Morning Pull
```bash
git fetch origin
git rebase origin/main
```

### Evening Push
```bash
git add .
git commit -m "feat(TX): description of today's work"
git push origin feature/your-branch-name
```

---

## ⚠️ IMPORTANT REMINDERS

1. **Check PARALLEL_DEVELOPMENT_PLAN.md** for detailed tasks
2. **Update progress** with checkmarks in the plan
3. **Don't modify files** owned by other terminals
4. **Test locally** before pushing
5. **Include terminal number** in commit messages (T2, T3, T4, T5)

---

## 🆘 IF YOU GET STUCK

1. Check file ownership in PARALLEL_DEVELOPMENT_PLAN.md
2. Run `npm run build` to verify no errors
3. Run `git status` to check for conflicts
4. Update the NOTES section in the plan
5. Wait for Terminal 1 to coordinate

---

**Remember:** Terminal 1 (main branch) coordinates all merges!