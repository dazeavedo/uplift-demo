# Feature Overview

Uplift is a workforce intelligence platform designed for frontline workers. This document provides a comprehensive overview of all features.

---

## Core Modules

### 1. Scheduling

**Shift Management**
- Create, edit, and delete shifts
- Assign employees to shifts
- Set break times and notes
- Color-coded by role
- Multi-week schedule view

**Schedule Publishing**
- Draft mode for unpublished schedules
- Bulk publish by date range
- Automatic notifications to employees
- Conflict detection

**Open Shifts**
- Post unfilled shifts to marketplace
- Employees can claim open shifts
- Manager approval workflow
- First-come-first-served or approval-based

**Shift Templates**
- Save recurring shift patterns
- Apply templates to date ranges
- Bulk shift creation

**AI Scheduling**
- "AI Fill" for open shifts
- Considers employee availability
- Matches required skills
- Balances weekly hours
- Respects overtime limits

**Demand Forecasting**
- Predicts staffing needs 2+ weeks ahead
- Based on 12 weeks of historical data
- Day-of-week patterns
- Seasonal adjustments
- Confidence scoring
- Staffing recommendations

### 2. Time Tracking

**Clock In/Out**
- Mobile clock in with GPS
- Geofencing verification
- Photo capture (optional)
- Automatic shift association
- Offline support with sync

**Break Management**
- Start/end break tracking
- Break duration enforcement
- Automatic break reminders

**Timesheets**
- Weekly timesheet view
- Pending approval queue
- Manager approval/rejection
- Edit with audit trail
- Export to payroll

**Time Off**
- Request annual leave, sick leave, etc.
- Calendar view of requests
- Manager approval workflow
- Balance tracking
- Conflict detection with schedule

### 3. Workforce Intelligence

**Employee Dashboard**
- "Momentum Score" (engagement metric)
- Skills progress
- Shift completion rate
- Career trajectory

**Manager Dashboard**
- Team size and active count
- Fill rate percentage
- Retention risk alerts
- AI-powered insights
- Pending actions queue

**Analytics & Reports**
- Labour cost analysis
- Hours by location/role
- Fill rate trends
- Overtime tracking
- Export to CSV/Excel

### 4. Skills & Training

**Skills Library**
- Organization-wide skill catalog
- Categorized skills
- Required skills per role
- Verification requirements

**Employee Skills**
- Self-reported skills
- Manager verification
- Skill levels (1-5)
- Expiration dates (certifications)
- Skill gap analysis

**Skill Matching**
- Match employees to shifts by skills
- Highlight skill gaps
- Training recommendations

### 5. Internal Mobility

**Job Postings**
- Internal-only job board
- Requirements and salary ranges
- Application process
- Status tracking

**Applications**
- Employee self-service applications
- Cover note submission
- Application review workflow
- Interview scheduling
- Offer management

**Career Paths**
- Visual career progression
- Required skills for advancement
- Recommended training
- Time-in-role tracking

### 6. Gamification & Engagement

**Momentum Score**
- Composite engagement metric
- Factors: attendance, punctuality, skills, tenure
- Visible to employee and manager

**Badges**
- Achievement unlocks
- Skill milestones
- Attendance streaks
- Peer recognition

**Leaderboards**
- Top performers by location
- Skill achievements
- Engagement rankings

**Rewards**
- Points accumulation
- Reward catalog
- Manager-granted rewards

### 7. Communication

**Notifications**
- In-app notification center
- Push notifications (mobile)
- Email notifications (optional)
- Customizable preferences

**Team Feed (Social)**
- Team announcements
- Peer recognition posts
- Milestone celebrations

**Shift Notes**
- Per-shift instructions
- Manager-to-team communication
- Read receipts

---

## User Roles

### Worker
- View own schedule
- Clock in/out
- Request time off
- Swap shifts (with approval)
- Track skills and career
- View internal job postings
- Apply for internal roles

### Manager
- All worker capabilities
- Create/edit schedules for team
- Approve time off and swaps
- Verify employee skills
- Post internal jobs
- View team analytics
- AI scheduling tools
- Demand forecasting

### Admin
- All manager capabilities
- Organization settings
- User management
- Location management
- Role configuration
- Billing and subscription
- Integration settings

### Superadmin (Internal)
- Platform-wide access
- Multi-tenant management
- Support tools
- Feature flags

---

## Technical Features

### Offline Mode (Mobile)
- Connectivity detection
- Local data caching
- Offline action queue
- Automatic sync when online
- Conflict resolution
- Visual indicators

### Security
- JWT authentication
- httpOnly cookies (XSS protection)
- CSRF protection
- Rate limiting
- Password strength requirements
- Optional MFA (TOTP)
- Audit logging

### Integrations
- **Payments:** Stripe
- **Email:** SendGrid
- **Ready for:** Slack, Teams, HRIS systems

### Multi-tenancy
- Organization isolation
- Custom branding (coming soon)
- Per-org settings
- Separate data

---

## Billing Features

### Pricing Tiers

| Feature | Growth (£10/user) | Scale (£8/user) | Enterprise (POA) |
|---------|-------------------|-----------------|------------------|
| Scheduling | ✓ | ✓ | ✓ |
| Time Tracking | ✓ | ✓ | ✓ |
| Mobile App | ✓ | ✓ | ✓ |
| Skills Tracking | ✓ | ✓ | ✓ |
| AI Scheduling | - | ✓ | ✓ |
| Demand Forecasting | - | ✓ | ✓ |
| Advanced Analytics | - | ✓ | ✓ |
| API Access | - | - | ✓ |
| SSO (SAML) | - | - | ✓ |
| Dedicated Support | - | - | ✓ |
| SLAs | - | - | ✓ |

### Seat Model
- **Core Seats:** Permanent employees (always billed)
- **Flex Seats:** Seasonal/variable workers (billed when active)
- Active = logged in or assigned shift in billing period

### Billing Cycle
- Monthly billing
- Prorated additions
- Usage-based flex seats
- Invoice history

---

## Portal Features

### Dashboard
- Today's shifts summary
- Active employees count
- Open shifts alert
- Pending approvals
- Week metrics
- AI demand forecast widget
- Quick actions

### Schedule
- Calendar view (day/week/month)
- Drag-and-drop editing
- Bulk actions
- Filter by location/role
- Publish controls
- Template library

### Employees
- Employee directory
- Search and filters
- Profile management
- Skills overview
- Shift history
- Performance metrics

### Time Tracking
- Pending approvals
- Timesheet review
- Edit capabilities
- Bulk approve
- Export

### Skills
- Skills library management
- Pending verifications
- Skill analytics
- Gap analysis

### Jobs
- Job posting management
- Application pipeline
- Hiring analytics

### Reports
- Pre-built reports
- Custom date ranges
- Multiple export formats
- Scheduled reports (coming soon)

### Settings
- Organization profile
- Locations management
- Roles configuration
- Notification preferences
- Billing & subscription
- API keys
- Integrations

---

## Mobile Features

### Worker Experience

**Home Screen**
- Today's shift card
- Clock in/out button
- Momentum score
- Quick actions
- Recent notifications

**Schedule**
- Week view
- Shift details
- Swap requests
- Time off requests

**Jobs**
- Internal listings
- Application status
- Job alerts

**Career**
- Skills progress
- Career path view
- Training recommendations

**Profile**
- Personal settings
- Notification preferences
- Support access

### Manager Experience

**Dashboard**
- Team metrics
- AI insights panel
- Pending actions
- Demand forecast
- Top performers

**Schedule Builder**
- Visual schedule
- AI Fill button
- Drag-and-drop
- Publish controls

**Team Management**
- Skills verification
- Job postings
- Expense approvals

**Reports**
- Key metrics
- Quick exports

---

## Notifications

### Types
| Event | In-App | Push | Email |
|-------|--------|------|-------|
| New shift assigned | ✓ | ✓ | ✓ |
| Shift cancelled | ✓ | ✓ | ✓ |
| Shift reminder (1hr) | ✓ | ✓ | - |
| Schedule published | ✓ | ✓ | ✓ |
| Swap request received | ✓ | ✓ | ✓ |
| Swap approved/rejected | ✓ | ✓ | ✓ |
| Time off approved | ✓ | ✓ | ✓ |
| New job posting | ✓ | ✓ | - |
| Skill verified | ✓ | - | - |
| Badge earned | ✓ | ✓ | - |

### User Preferences
- Per-channel toggles
- Quiet hours
- Digest mode

---

## Data & Privacy

### Data Retention
- Active data: Indefinite
- Deleted employee data: 90 days
- Audit logs: 7 years
- Time entries: 7 years

### GDPR Compliance
- Data export on request
- Right to erasure
- Consent management
- Data processing agreements

### Security Certifications
- SOC 2 Type II (planned)
- ISO 27001 (planned)

---

## Roadmap (Planned)

### Q1 2026
- [ ] Native biometric clock-in
- [ ] Slack integration
- [ ] Teams integration
- [ ] Custom branding

### Q2 2026
- [ ] AI shift recommendations
- [ ] Predictive retention alerts
- [ ] HRIS integrations
- [ ] Advanced reporting builder

### Q3 2026
- [ ] Multi-currency support
- [ ] International localization
- [ ] Workforce planning tools
- [ ] Learning management

### Q4 2026
- [ ] Labour law compliance engine
- [ ] Advanced forecasting (ML)
- [ ] Marketplace for integrations
- [ ] White-label option
