# Uplift React Demo

**Hybrid demo app - fully functional navigation and core flows.**

## What's Working

### ✅ Complete Features
- **Login system** (worker vs manager)
- **All navigation** (all screens connected)
- **3 Core flows:**
  1. Worker: Apply to job → See in applications (with interview tracking)
  2. Worker: Request shift swap → Confirmation
  3. Manager: View dashboard → AI schedule → Team management

### ✅ All Screens Functional
**Worker (7 screens):**
- Home/Feed - Company posts, job openings
- Schedule - List of shifts with pay
- Shift Detail - Team, weather, swap button
- Grow - Career path with salary breakdown
- Job Detail - Apply button (works!)
- Applications - Track application status
- Profile - Points, leaderboard, stats

**Manager (3 screens):**
- Dashboard - Stats, alerts, who's working
- AI Schedule - Generate optimized schedule
- Team - Team members with promotion alerts

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Open browser
# http://localhost:3000
```

## Demo Credentials

**No password required - just click:**
- "I'm a Worker" → Login as Marc Hunt
- "I'm a Manager" → Login as Sarah Chen

## Tech Stack

- React 18
- React Router 6
- Vite
- Context API (state management)
- localStorage (fake backend)

## Key Flows to Demo

### 1. Worker Job Application Flow
1. Login as worker
2. See job opening in feed
3. Click "Apply Now"
4. View job details with salary
5. Click "Apply Now"
6. Redirects to Applications
7. See interview scheduled

### 2. Worker Shift Management
1. Go to Schedule tab
2. Click any shift
3. See team members, weather
4. Click "Request Swap"
5. See confirmation

### 3. Manager Dashboard Flow
1. Login as manager
2. See live stats (clocked in, attendance)
3. See alerts (Marc ready for promotion)
4. Click "AI Schedule"
5. Generate schedule
6. See results (£220 saved, 100% coverage)

## Data

All data is in `src/data/mockData.js`:
- Pre-seeded users
- Shifts with team/weather
- Jobs with salary breakdowns
- Applications with timeline
- Feed posts
- Manager stats

## Deployment

### Option 1: Vercel (Recommended)
```bash
npm run build
# Upload dist/ folder to Vercel
```

### Option 2: Netlify
```bash
npm run build
# Drag dist/ folder to Netlify
```

## What's NOT Built (Yet)

- Real backend API
- Database
- User signup/registration
- Email notifications
- File uploads
- Advanced AI features
- Integrations (Sage, Xero, etc.)

## Next Steps for Production

1. Add backend (Node.js + PostgreSQL)
2. Real authentication (JWT)
3. WebSockets for real-time updates
4. Push notifications
5. Payment processing (Stripe)
6. Admin panel
7. Analytics dashboard
8. Mobile apps (React Native)

## File Structure

```
src/
├── components/
│   ├── worker/          # 7 worker screens
│   ├── manager/         # 3 manager screens
│   └── shared/          # Login, Nav
├── context/
│   └── AuthContext.jsx  # Login state
├── data/
│   └── mockData.js      # All demo data
└── App.jsx              # Routes
```

## Demo Tips

- **Fast demo (5 mins):** Login → Apply to job → See in applications
- **Full demo (15 mins):** Show all worker screens + manager dashboard
- **Technical demo (30 mins):** Show code, explain architecture

## Support

Questions? Check the code comments or ask Diogo.

Built with ❤️ by Claude & Diogo
