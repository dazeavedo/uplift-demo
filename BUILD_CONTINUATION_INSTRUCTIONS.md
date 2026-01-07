# UPLIFT APP - CONTINUATION INSTRUCTIONS

## WHEN TO RESUME:
When Diogo's context window refreshes (later today)

## WHAT'S BUILT SO FAR:
✅ Complete foundation (design system, mock data, routing, auth)
✅ Login screen  
✅ Bottom Navigation
⏸️ Worker screens (partial)
⏸️ Manager screens (not started)
⏸️ Entry files (partial)

## HOW TO CONTINUE:

### Step 1: Diogo uploads the partial build
```
uplift-complete-app-PARTIAL.tar.gz
```

### Step 2: Claude extracts and reviews
```bash
tar -xzf uplift-complete-app-PARTIAL.tar.gz
cd uplift-complete-app
ls src/components/  # See what's already built
```

### Step 3: Claude continues building
Build remaining screens in this order:
1. Finish Worker screens (Schedule, ShiftDetail, etc.)
2. Build Manager screens (Dashboard, AISchedule, Team)
3. Add entry files (main.jsx, index.html, vite.config.js)
4. Test locally
5. Package final version

### Step 4: Deploy
```bash
npm install
npm run dev  # Test
npm run build  # Production build
vercel  # Deploy
```

## SCREENS STILL NEEDED:
- Worker: Home Feed, Schedule, ShiftDetail, ShiftSwapRequest, ShiftSwapSent, Grow, JobDetail, Applications, Profile, Tasks, Notifications (11 total)
- Manager: Dashboard, AISchedule, Team (3 total)
- Entry: main.jsx, index.html, vite.config.js (3 files)

## DESIGN REFERENCE:
All styling must match the uploaded HTML files:
- home-feed.html
- schedule-main.html
- shift-detail.html
- shift-swap-request.html
- shift-swap-sent.html
- manager-dashboard.html
- etc.

## TOTAL REMAINING: ~14 screens + 3 config files
## ESTIMATED TIME: 45-60 minutes

