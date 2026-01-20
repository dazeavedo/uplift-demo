# UPLIFT - User Acceptance Testing (UAT) Test Plan

## Document Information
- **Version:** 1.0
- **Last Updated:** January 2026
- **Test Environment:** Staging
- **Platforms:** iOS, Android, Web Portal, Ops Portal

---

## Table of Contents
1. [Test Overview](#1-test-overview)
2. [Test Environment Setup](#2-test-environment-setup)
3. [Mobile App UAT Cases](#3-mobile-app-uat-cases)
4. [Web Portal UAT Cases](#4-web-portal-uat-cases)
5. [Integration UAT Cases](#5-integration-uat-cases)
6. [Performance UAT Cases](#6-performance-uat-cases)
7. [Security UAT Cases](#7-security-uat-cases)
8. [Localization UAT Cases](#8-localization-uat-cases)

---

## 1. Test Overview

### 1.1 Scope
This UAT test plan covers end-to-end testing of the Uplift workforce management platform across:
- Mobile applications (iOS & Android)
- Web Portal (Manager/Admin interface)
- Operations Portal
- API integrations
- Internationalization (48 languages)

### 1.2 User Personas
| Persona | Role | Key Features |
|---------|------|--------------|
| **Frontline Worker** | Employee | Clock in/out, view schedule, request time off |
| **Shift Supervisor** | Manager | Approve requests, manage team schedule |
| **Store Manager** | Senior Manager | Full scheduling, reports, analytics |
| **HR Administrator** | Admin | Employee management, settings, compliance |
| **IT Administrator** | System Admin | Integrations, API keys, system settings |

### 1.3 Test Accounts
```
Frontline Worker: worker@test.uplift.com / Worker123!
Supervisor: supervisor@test.uplift.com / Supervisor123!
Manager: manager@test.uplift.com / Manager123!
Admin: admin@test.uplift.com / Admin123!
```

---

## 2. Test Environment Setup

### 2.1 Prerequisites
- [ ] Access to staging environment (staging.uplift.io)
- [ ] Test mobile devices (iOS 15+, Android 12+)
- [ ] Test accounts provisioned
- [ ] Test data seeded (locations, employees, schedules)
- [ ] Push notification certificates configured

### 2.2 Test Data Requirements
- Minimum 3 locations
- Minimum 20 employees across locations
- 4 weeks of schedule data
- Historical time tracking data
- Pending approval requests

---

## 3. Mobile App UAT Cases

### 3.1 Onboarding & Authentication

#### TC-MOB-001: First Launch Onboarding
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Fresh app install, no previous login |

**Steps:**
1. Launch app for the first time
2. View welcome screen
3. Swipe through onboarding slides (4 screens)
4. Tap "Get Started"
5. View login screen

**Expected Results:**
- [ ] Welcome screen displays with Uplift branding
- [ ] All 4 onboarding slides are accessible
- [ ] Skip button is available throughout
- [ ] Get Started navigates to login
- [ ] App respects device language setting

---

#### TC-MOB-002: Login with Valid Credentials
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Valid user account exists |

**Steps:**
1. Enter valid email address
2. Enter valid password
3. Tap "Sign In"

**Expected Results:**
- [ ] Login succeeds within 3 seconds
- [ ] Home screen displays with user's name
- [ ] Today's shift information shown if applicable
- [ ] Session persists across app restarts

---

#### TC-MOB-003: Login with Invalid Credentials
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | None |

**Steps:**
1. Enter invalid email address
2. Enter any password
3. Tap "Sign In"

**Expected Results:**
- [ ] Error message displays: "Invalid email or password"
- [ ] Password field is cleared
- [ ] User remains on login screen
- [ ] No sensitive information exposed in error

---

#### TC-MOB-004: Forgot Password Flow
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Valid user account with verified email |

**Steps:**
1. Tap "Forgot Password?"
2. Enter registered email
3. Tap "Send Reset Link"
4. Check email inbox
5. Click reset link
6. Enter new password (meeting complexity requirements)
7. Confirm password
8. Submit

**Expected Results:**
- [ ] Reset email received within 2 minutes
- [ ] Link valid for 24 hours
- [ ] Password complexity enforced
- [ ] Successful reset allows login with new password
- [ ] Old password no longer works

---

#### TC-MOB-005: Biometric Login (if enabled)
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Device has biometrics, user logged in previously |

**Steps:**
1. Open app after session expired
2. Tap biometric login option
3. Authenticate with Face ID/Touch ID/Fingerprint

**Expected Results:**
- [ ] Biometric prompt appears
- [ ] Successful authentication logs user in
- [ ] Failed authentication allows password fallback

---

### 3.2 Home Screen

#### TC-MOB-006: Home Screen Content Display
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | User logged in |

**Steps:**
1. View home screen
2. Check all sections are present
3. Verify data accuracy

**Expected Results:**
- [ ] Welcome message with user's first name
- [ ] Today's shift card (if scheduled)
- [ ] "No shift today" message (if not scheduled)
- [ ] Hours worked this week displays correctly
- [ ] Quick action buttons visible
- [ ] Announcements section shows recent posts
- [ ] Pull-to-refresh works

---

#### TC-MOB-007: Quick Action - View Schedule
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | User logged in |

**Steps:**
1. From home screen, tap "View Schedule" quick action

**Expected Results:**
- [ ] Navigates to schedule screen
- [ ] Current week is displayed
- [ ] User's shifts are highlighted

---

### 3.3 Schedule Management

#### TC-MOB-008: View Weekly Schedule
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | User has scheduled shifts |

**Steps:**
1. Navigate to Schedule tab
2. View current week
3. Tap on a shift to see details

**Expected Results:**
- [ ] Week header shows correct date range
- [ ] All scheduled shifts visible
- [ ] Shift details include: time, location, role
- [ ] Color coding consistent with status
- [ ] Navigation arrows work for prev/next week

---

#### TC-MOB-009: View Shift Details
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | User has a scheduled shift |

**Steps:**
1. Tap on a scheduled shift
2. View shift detail modal

**Expected Results:**
- [ ] Date and time correct
- [ ] Location name and address shown
- [ ] Role/position displayed
- [ ] Break duration indicated
- [ ] Coworkers list shown (if applicable)
- [ ] Supervisor contact available
- [ ] Directions button links to maps

---

#### TC-MOB-010: Pick Up Open Shift
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Open shifts available in marketplace |

**Steps:**
1. Navigate to Shift Marketplace
2. Find an available open shift
3. Tap "Pick Up" 
4. Confirm selection

**Expected Results:**
- [ ] Shift added to user's schedule
- [ ] Success confirmation displayed
- [ ] Shift removed from marketplace
- [ ] Manager notified (if approval required)
- [ ] Push notification sent upon approval

---

#### TC-MOB-011: Request Shift Swap
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | User has scheduled shift |

**Steps:**
1. Navigate to My Shifts
2. Select a shift to swap
3. Tap "Request Swap"
4. Select preferred colleague(s)
5. Add optional message
6. Submit request

**Expected Results:**
- [ ] Request created successfully
- [ ] Status shows "Pending"
- [ ] Selected colleagues receive notification
- [ ] Request visible in My Requests

---

#### TC-MOB-012: Drop Shift
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | User has scheduled shift, drop allowed by policy |

**Steps:**
1. Navigate to My Shifts
2. Select a shift
3. Tap "Drop Shift"
4. Provide reason
5. Confirm

**Expected Results:**
- [ ] Shift released to marketplace
- [ ] Shift removed from user's schedule
- [ ] Manager notified
- [ ] Appropriate notice period enforced

---

### 3.4 Time Tracking

#### TC-MOB-013: Clock In at Location
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | User at work location, shift scheduled |

**Steps:**
1. Navigate to Time tab
2. Ensure location services enabled
3. Tap "Clock In"
4. Confirm location if prompted

**Expected Results:**
- [ ] Clock in recorded with timestamp
- [ ] GPS coordinates captured
- [ ] UI updates to show "Clocked In" status
- [ ] Timer starts showing shift duration
- [ ] "Start Break" and "Clock Out" buttons appear

---

#### TC-MOB-014: Clock In Outside Geofence
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | User outside location geofence |

**Steps:**
1. Attempt to clock in while outside geofence

**Expected Results:**
- [ ] Warning message displayed
- [ ] Option to proceed with reason required
- [ ] Manager notified of out-of-bounds clock in
- [ ] Entry flagged for review

---

#### TC-MOB-015: Take Break
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | User clocked in |

**Steps:**
1. While clocked in, tap "Start Break"
2. Break timer starts
3. Tap "End Break"

**Expected Results:**
- [ ] Break start time recorded
- [ ] UI shows "On Break" status
- [ ] Break timer visible
- [ ] Break end time recorded
- [ ] Total break time calculated correctly

---

#### TC-MOB-016: Clock Out
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | User clocked in |

**Steps:**
1. Tap "Clock Out"
2. Confirm clock out

**Expected Results:**
- [ ] Clock out timestamp recorded
- [ ] Shift summary displayed (hours worked, break time)
- [ ] Entry added to timesheet
- [ ] UI returns to "Clock In" state

---

#### TC-MOB-017: View Timesheet Summary
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | User has time entries |

**Steps:**
1. Navigate to Time tab
2. View Timesheet section
3. Select date range

**Expected Results:**
- [ ] Daily hours displayed
- [ ] Weekly total calculated
- [ ] Overtime hours highlighted (if applicable)
- [ ] Pay period breakdown available

---

### 3.5 Time Off

#### TC-MOB-018: View Time Off Balances
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | User has time off allocations |

**Steps:**
1. Navigate to Time Off section
2. View balances

**Expected Results:**
- [ ] Vacation balance displayed
- [ ] Sick leave balance displayed
- [ ] Personal time balance displayed
- [ ] Pending requests shown separately
- [ ] Accrual information visible

---

#### TC-MOB-019: Submit Time Off Request
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | User has available balance |

**Steps:**
1. Tap "New Request"
2. Select time off type
3. Select start date
4. Select end date
5. Add reason (optional)
6. Submit request

**Expected Results:**
- [ ] Request created with "Pending" status
- [ ] Balance shows pending deduction
- [ ] Manager receives notification
- [ ] Request visible in My Requests
- [ ] Conflicts flagged (if any)

---

#### TC-MOB-020: Cancel Pending Time Off Request
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | User has pending request |

**Steps:**
1. View My Requests
2. Select pending request
3. Tap "Cancel Request"
4. Confirm

**Expected Results:**
- [ ] Request cancelled
- [ ] Balance restored
- [ ] Manager notified
- [ ] Request removed from pending list

---

### 3.6 Feed & Social

#### TC-MOB-021: View Company Feed
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Posts exist in feed |

**Steps:**
1. Navigate to Feed tab
2. Scroll through posts
3. Pull to refresh

**Expected Results:**
- [ ] Posts displayed in chronological order
- [ ] Announcements pinned at top
- [ ] Images/media render correctly
- [ ] Like counts accurate
- [ ] Comment counts accurate

---

#### TC-MOB-022: Create Post
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | User has posting permissions |

**Steps:**
1. Tap "Create Post"
2. Enter message
3. Optionally add photo
4. Tap "Post"

**Expected Results:**
- [ ] Post appears in feed immediately
- [ ] Photo uploads successfully
- [ ] Post visible to appropriate audience
- [ ] Character limit enforced

---

#### TC-MOB-023: Give Recognition
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Recognition feature enabled |

**Steps:**
1. Tap "Give Recognition"
2. Select colleague
3. Select badge/type
4. Write message
5. Submit

**Expected Results:**
- [ ] Recognition post created
- [ ] Recipient receives notification
- [ ] Points/XP awarded
- [ ] Badge displayed on recipient profile

---

### 3.7 Profile & Settings

#### TC-MOB-024: View Profile
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | User logged in |

**Steps:**
1. Navigate to Profile tab

**Expected Results:**
- [ ] Profile photo displayed
- [ ] Full name correct
- [ ] Role/position shown
- [ ] Contact information visible
- [ ] Skills and badges displayed
- [ ] Level/XP shown (if gamification enabled)

---

#### TC-MOB-025: Edit Profile
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Edit permissions granted |

**Steps:**
1. Tap "Edit Profile"
2. Update phone number
3. Update emergency contact
4. Save changes

**Expected Results:**
- [ ] Changes saved successfully
- [ ] Confirmation message displayed
- [ ] Updated information reflected immediately

---

#### TC-MOB-026: Change Language
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Multiple languages available |

**Steps:**
1. Navigate to Settings
2. Tap Language
3. Select a different language (e.g., Spanish)
4. Confirm

**Expected Results:**
- [ ] App UI changes to selected language
- [ ] All strings translated correctly
- [ ] Navigation labels updated
- [ ] Date/time formats localized
- [ ] Preference persists after restart

---

#### TC-MOB-027: Enable/Disable Notifications
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Notification settings available |

**Steps:**
1. Navigate to Settings > Notifications
2. Toggle specific notification types
3. Save changes

**Expected Results:**
- [ ] Settings saved
- [ ] Disabled notifications not received
- [ ] Enabled notifications received
- [ ] System notification permissions respected

---

#### TC-MOB-028: Logout
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | User logged in |

**Steps:**
1. Navigate to Settings
2. Tap "Sign Out"
3. Confirm logout

**Expected Results:**
- [ ] Session cleared
- [ ] Local data cleared (if policy requires)
- [ ] Returns to login screen
- [ ] Biometric data preserved (optional)

---

### 3.8 Offline Functionality

#### TC-MOB-029: Offline Mode - View Schedule
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Data synced while online |

**Steps:**
1. While online, view schedule to cache data
2. Enable airplane mode
3. Navigate to schedule

**Expected Results:**
- [ ] Offline banner displayed
- [ ] Cached schedule visible
- [ ] Can view shift details
- [ ] Date navigation limited to cached range

---

#### TC-MOB-030: Offline Mode - Clock In
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Device offline |

**Steps:**
1. Enable airplane mode
2. Tap "Clock In"
3. Confirm action

**Expected Results:**
- [ ] Clock in queued locally
- [ ] "Pending sync" indicator shown
- [ ] Local time captured
- [ ] When online, entry syncs automatically

---

#### TC-MOB-031: Sync After Offline Period
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Actions queued while offline |

**Steps:**
1. Perform actions while offline
2. Restore internet connection
3. Wait for sync

**Expected Results:**
- [ ] Automatic sync triggered
- [ ] Queued actions processed
- [ ] Conflicts reported (if any)
- [ ] Success notification shown
- [ ] Data matches server state

---

### 3.9 Manager Features (Mobile)

#### TC-MOB-032: View Team Dashboard
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Manager role logged in |

**Steps:**
1. Navigate to Manager tab
2. View team overview

**Expected Results:**
- [ ] Team members listed
- [ ] Who's working now shown
- [ ] Pending approvals count displayed
- [ ] Quick access to common actions

---

#### TC-MOB-033: Approve Time Off Request (Mobile)
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Pending requests exist |

**Steps:**
1. Navigate to Approvals
2. Select pending time off request
3. Review details
4. Tap "Approve"

**Expected Results:**
- [ ] Request approved
- [ ] Employee notified
- [ ] Approval reflected in calendar
- [ ] Balance adjusted

---

#### TC-MOB-034: Deny Request with Reason
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Pending requests exist |

**Steps:**
1. Select pending request
2. Tap "Deny"
3. Enter reason
4. Confirm

**Expected Results:**
- [ ] Request denied
- [ ] Reason recorded
- [ ] Employee notified with reason
- [ ] Balance unchanged

---

#### TC-MOB-035: Send Team Announcement
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Manager permissions |

**Steps:**
1. Navigate to Manager > Announcements
2. Tap "New Announcement"
3. Enter message
4. Select audience (location/team)
5. Send

**Expected Results:**
- [ ] Announcement posted
- [ ] Push notifications sent to team
- [ ] Announcement appears in feed
- [ ] Read receipts tracked (if enabled)

---

### 3.10 Push Notifications

#### TC-MOB-036: Receive Shift Reminder
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Notifications enabled, shift scheduled |

**Expected Results:**
- [ ] Notification received 30 mins before shift (configurable)
- [ ] Notification shows shift time and location
- [ ] Tapping notification opens app to shift details

---

#### TC-MOB-037: Receive Schedule Change Notification
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Manager modifies user's schedule |

**Expected Results:**
- [ ] Notification received immediately
- [ ] Shows what changed
- [ ] Deep links to updated schedule

---

#### TC-MOB-038: Receive Time Off Decision Notification
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Manager approves/denies request |

**Expected Results:**
- [ ] Notification received immediately
- [ ] Shows approval/denial status
- [ ] Links to request details

---

## 4. Web Portal UAT Cases

### 4.1 Authentication

#### TC-WEB-001: Portal Login
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Manager/Admin account exists |

**Steps:**
1. Navigate to portal.uplift.io
2. Enter credentials
3. Click "Sign In"

**Expected Results:**
- [ ] Login successful
- [ ] Dashboard displayed
- [ ] Session persists
- [ ] Remember me option works

---

### 4.2 Employee Management

#### TC-WEB-002: Add New Employee
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Admin logged in |

**Steps:**
1. Navigate to Employees
2. Click "Add Employee"
3. Fill required fields
4. Save

**Expected Results:**
- [ ] Employee created
- [ ] Appears in employee list
- [ ] Invitation email sent (if configured)
- [ ] Can be assigned to shifts

---

#### TC-WEB-003: Bulk Import Employees
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | CSV file prepared |

**Steps:**
1. Navigate to Employees
2. Click "Bulk Import"
3. Download template
4. Upload completed CSV
5. Map fields
6. Import

**Expected Results:**
- [ ] Validation errors highlighted
- [ ] Valid rows imported
- [ ] Duplicate handling correct
- [ ] Import summary shown

---

### 4.3 Schedule Management

#### TC-WEB-004: Create Weekly Schedule
| Field | Value |
|-------|-------|
| **Priority** | Critical |
| **Preconditions** | Employees and locations exist |

**Steps:**
1. Navigate to Schedule
2. Select week
3. Create shifts via drag-drop or form
4. Review coverage
5. Publish

**Expected Results:**
- [ ] Shifts created successfully
- [ ] Coverage gaps highlighted
- [ ] Overtime warnings shown
- [ ] Publish sends notifications
- [ ] Employees see updated schedule

---

#### TC-WEB-005: Auto-Schedule Generation
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Demand forecast configured |

**Steps:**
1. Navigate to Schedule
2. Click "Auto-Schedule"
3. Configure parameters
4. Generate

**Expected Results:**
- [ ] Schedule generated based on demand
- [ ] Employee preferences respected
- [ ] Labor rules enforced
- [ ] Can modify before publishing

---

### 4.4 Reporting

#### TC-WEB-006: Generate Attendance Report
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Time data exists |

**Steps:**
1. Navigate to Reports
2. Select Attendance Report
3. Set date range
4. Generate

**Expected Results:**
- [ ] Report renders correctly
- [ ] Data accurate
- [ ] Export to CSV works
- [ ] Export to PDF works
- [ ] Filters function correctly

---

### 4.5 Settings & Configuration

#### TC-WEB-007: Configure Organization Settings
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | Admin logged in |

**Steps:**
1. Navigate to Settings
2. Update organization name
3. Configure timezone
4. Save

**Expected Results:**
- [ ] Settings saved
- [ ] Changes reflected immediately
- [ ] Dependent features updated

---

---

## 5. Integration UAT Cases

#### TC-INT-001: API Authentication
| Field | Value |
|-------|-------|
| **Priority** | High |
| **Preconditions** | API key generated |

**Steps:**
1. Make API request with valid key
2. Make API request with invalid key

**Expected Results:**
- [ ] Valid key: 200 OK with data
- [ ] Invalid key: 401 Unauthorized
- [ ] Rate limiting enforced

---

#### TC-INT-002: Webhook Delivery
| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Preconditions** | Webhook configured |

**Steps:**
1. Configure webhook endpoint
2. Trigger an event (e.g., shift created)
3. Verify webhook received

**Expected Results:**
- [ ] Webhook delivered within 5 seconds
- [ ] Payload contains event data
- [ ] Signature verification works
- [ ] Retries on failure

---

## 6. Performance UAT Cases

#### TC-PERF-001: Mobile App Launch Time
| Field | Value |
|-------|-------|
| **Priority** | High |

**Acceptance Criteria:**
- [ ] Cold start < 3 seconds
- [ ] Warm start < 1 second
- [ ] Login < 2 seconds
- [ ] Dashboard load < 2 seconds

---

#### TC-PERF-002: Schedule Load Performance
| Field | Value |
|-------|-------|
| **Priority** | High |

**Acceptance Criteria:**
- [ ] Week view loads < 2 seconds
- [ ] 100+ employees renders smoothly
- [ ] Navigation between weeks < 500ms

---

## 7. Security UAT Cases

#### TC-SEC-001: Session Timeout
| Field | Value |
|-------|-------|
| **Priority** | High |

**Steps:**
1. Login
2. Leave app idle for configured timeout period
3. Attempt to use app

**Expected Results:**
- [ ] Session expires after timeout
- [ ] Redirected to login
- [ ] No cached sensitive data accessible

---

#### TC-SEC-002: Multi-Tenant Data Isolation
| Field | Value |
|-------|-------|
| **Priority** | Critical |

**Steps:**
1. Login as user from Organization A
2. Attempt to access Organization B's data via URL manipulation

**Expected Results:**
- [ ] Access denied
- [ ] 404 or 403 error returned
- [ ] No data leakage

---

## 8. Localization UAT Cases

#### TC-LOC-001: Spanish (es) Language Test
| Field | Value |
|-------|-------|
| **Priority** | High |

**Verification Points:**
- [ ] All UI strings translated
- [ ] No English strings visible
- [ ] Date format: DD/MM/YYYY
- [ ] Time format: 24-hour
- [ ] Currency format: €X,XXX.XX
- [ ] Special characters display correctly
- [ ] Input validation accepts Spanish characters

---

#### TC-LOC-002: Arabic (ar) RTL Test
| Field | Value |
|-------|-------|
| **Priority** | High |

**Verification Points:**
- [ ] Text direction: Right-to-left
- [ ] Navigation mirrors
- [ ] Icons flip appropriately
- [ ] Forms align correctly
- [ ] Numbers display correctly
- [ ] Arabic characters render properly

---

#### TC-LOC-003: Chinese Simplified (zh-CN) Test
| Field | Value |
|-------|-------|
| **Priority** | Medium |

**Verification Points:**
- [ ] All strings translated
- [ ] Chinese characters render correctly
- [ ] Date format: YYYY年MM月DD日
- [ ] Input supports Chinese characters
- [ ] No truncation of longer strings

---

## Test Sign-Off

### UAT Completion Criteria
- [ ] All Critical priority test cases passed
- [ ] All High priority test cases passed (95%+)
- [ ] All Medium priority test cases passed (90%+)
- [ ] No blocking defects open
- [ ] Performance criteria met
- [ ] Security criteria met

### Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Product Owner | | | |
| Development Lead | | | |
| UAT Coordinator | | | |

---

## Appendix A: Test Data

### A.1 Test Locations
| Location | Type | Address |
|----------|------|---------|
| London Oxford St | Store | 100 Oxford Street, W1D 1LL |
| Manchester Arndale | Store | 49 High Street, M4 3AH |
| Birmingham Bullring | Store | 7 Bullring, B5 4BU |

### A.2 Test Employees
| Name | Role | Location |
|------|------|----------|
| John Smith | Sales Associate | London |
| Sarah Johnson | Team Lead | London |
| Mike Brown | Store Manager | London |

---

## Appendix B: Defect Severity Definitions

| Severity | Definition | Example |
|----------|------------|---------|
| **Blocker** | Prevents testing, no workaround | App crashes on launch |
| **Critical** | Core function broken | Cannot clock in |
| **Major** | Feature impacted, workaround exists | Filter doesn't work |
| **Minor** | Cosmetic issue | Alignment off |
| **Trivial** | Suggestion | Better wording needed |
