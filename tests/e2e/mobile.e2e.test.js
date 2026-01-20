// ============================================================
// UPLIFT MOBILE APP - E2E TEST SUITE
// Detox/Jest end-to-end tests for React Native mobile app
// ============================================================

describe('Uplift Mobile App E2E', () => {
  
  // ============================================================
  // TEST CONFIGURATION
  // ============================================================
  
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { location: 'always', notifications: 'YES', camera: 'YES' },
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  // ============================================================
  // 1. ONBOARDING & LOGIN FLOW
  // ============================================================

  describe('Onboarding & Authentication', () => {
    it('should show welcome screen on first launch', async () => {
      await expect(element(by.id('welcome-screen'))).toBeVisible();
      await expect(element(by.text('Welcome to Uplift!'))).toBeVisible();
    });

    it('should navigate through onboarding slides', async () => {
      await expect(element(by.id('onboarding-slide-1'))).toBeVisible();
      
      // Swipe through slides
      await element(by.id('onboarding-carousel')).swipe('left');
      await expect(element(by.id('onboarding-slide-2'))).toBeVisible();
      
      await element(by.id('onboarding-carousel')).swipe('left');
      await expect(element(by.id('onboarding-slide-3'))).toBeVisible();
      
      await element(by.id('onboarding-carousel')).swipe('left');
      await expect(element(by.id('onboarding-slide-4'))).toBeVisible();
    });

    it('should skip onboarding and go to login', async () => {
      await element(by.id('skip-onboarding-btn')).tap();
      await expect(element(by.id('login-screen'))).toBeVisible();
    });

    it('should show login screen', async () => {
      await expect(element(by.id('email-input'))).toBeVisible();
      await expect(element(by.id('password-input'))).toBeVisible();
      await expect(element(by.id('login-btn'))).toBeVisible();
    });

    it('should show validation error for empty fields', async () => {
      await element(by.id('login-btn')).tap();
      await expect(element(by.text('Email is required'))).toBeVisible();
    });

    it('should show error for invalid credentials', async () => {
      await element(by.id('email-input')).typeText('wrong@email.com');
      await element(by.id('password-input')).typeText('wrongpassword');
      await element(by.id('login-btn')).tap();
      
      await waitFor(element(by.text('Invalid credentials')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should login successfully with valid credentials', async () => {
      await element(by.id('email-input')).clearText();
      await element(by.id('email-input')).typeText('demo@uplift.com');
      await element(by.id('password-input')).clearText();
      await element(by.id('password-input')).typeText('Demo123!');
      await element(by.id('login-btn')).tap();
      
      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('should remember user after app restart', async () => {
      await device.terminateApp();
      await device.launchApp();
      
      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  // ============================================================
  // 2. HOME SCREEN
  // ============================================================

  describe('Home Screen', () => {
    beforeEach(async () => {
      // Ensure we're logged in and on home
      await ensureLoggedIn();
    });

    it('should display welcome message with user name', async () => {
      await expect(element(by.id('welcome-message'))).toBeVisible();
    });

    it('should show today\'s shift card', async () => {
      await expect(element(by.id('today-shift-card'))).toBeVisible();
    });

    it('should show quick action buttons', async () => {
      await expect(element(by.id('quick-action-clock-in'))).toBeVisible();
      await expect(element(by.id('quick-action-view-schedule'))).toBeVisible();
      await expect(element(by.id('quick-action-request-time-off'))).toBeVisible();
    });

    it('should show hours worked this week', async () => {
      await expect(element(by.id('hours-this-week'))).toBeVisible();
    });

    it('should show announcements section', async () => {
      await element(by.id('home-screen')).scroll(200, 'down');
      await expect(element(by.id('announcements-section'))).toBeVisible();
    });

    it('should navigate to schedule from quick action', async () => {
      await element(by.id('quick-action-view-schedule')).tap();
      await expect(element(by.id('schedule-screen'))).toBeVisible();
    });

    it('should pull to refresh', async () => {
      await element(by.id('home-scroll-view')).swipe('down', 'slow', 0.5);
      await waitFor(element(by.id('refresh-indicator')))
        .toBeNotVisible()
        .withTimeout(5000);
    });
  });

  // ============================================================
  // 3. SCHEDULE SCREEN
  // ============================================================

  describe('Schedule Screen', () => {
    beforeEach(async () => {
      await ensureLoggedIn();
      await element(by.id('tab-schedule')).tap();
    });

    it('should display week view by default', async () => {
      await expect(element(by.id('schedule-screen'))).toBeVisible();
      await expect(element(by.id('week-view'))).toBeVisible();
    });

    it('should show current week dates', async () => {
      await expect(element(by.id('week-header'))).toBeVisible();
    });

    it('should navigate to next week', async () => {
      await element(by.id('next-week-btn')).tap();
      // Verify date header changed
      await expect(element(by.id('week-header'))).toBeVisible();
    });

    it('should navigate to previous week', async () => {
      await element(by.id('prev-week-btn')).tap();
      await expect(element(by.id('week-header'))).toBeVisible();
    });

    it('should switch to day view', async () => {
      await element(by.id('view-toggle-day')).tap();
      await expect(element(by.id('day-view'))).toBeVisible();
    });

    it('should switch to month view', async () => {
      await element(by.id('view-toggle-month')).tap();
      await expect(element(by.id('month-view'))).toBeVisible();
    });

    it('should tap on shift to see details', async () => {
      await element(by.id('shift-card-0')).tap();
      await expect(element(by.id('shift-detail-modal'))).toBeVisible();
    });

    it('should show shift details in modal', async () => {
      await element(by.id('shift-card-0')).tap();
      await expect(element(by.id('shift-time'))).toBeVisible();
      await expect(element(by.id('shift-location'))).toBeVisible();
      await expect(element(by.id('shift-role'))).toBeVisible();
    });

    it('should close shift detail modal', async () => {
      await element(by.id('shift-card-0')).tap();
      await element(by.id('close-modal-btn')).tap();
      await expect(element(by.id('shift-detail-modal'))).toBeNotVisible();
    });
  });

  // ============================================================
  // 4. TIME TRACKING
  // ============================================================

  describe('Time Tracking', () => {
    beforeEach(async () => {
      await ensureLoggedIn();
      await element(by.id('tab-time')).tap();
    });

    it('should show time tracking screen', async () => {
      await expect(element(by.id('time-tracking-screen'))).toBeVisible();
    });

    it('should show clock in button when not clocked in', async () => {
      await expect(element(by.id('clock-in-btn'))).toBeVisible();
    });

    it('should clock in successfully', async () => {
      await element(by.id('clock-in-btn')).tap();
      
      // May need to confirm location permission
      await waitFor(element(by.id('clock-out-btn')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('should show current shift timer when clocked in', async () => {
      await expect(element(by.id('shift-timer'))).toBeVisible();
    });

    it('should start break', async () => {
      await element(by.id('start-break-btn')).tap();
      await expect(element(by.id('on-break-indicator'))).toBeVisible();
      await expect(element(by.id('end-break-btn'))).toBeVisible();
    });

    it('should end break', async () => {
      await element(by.id('end-break-btn')).tap();
      await expect(element(by.id('start-break-btn'))).toBeVisible();
    });

    it('should clock out successfully', async () => {
      await element(by.id('clock-out-btn')).tap();
      
      // Confirm clock out
      await element(by.id('confirm-clock-out-btn')).tap();
      
      await waitFor(element(by.id('clock-in-btn')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show timesheet summary', async () => {
      await element(by.id('timesheet-tab')).tap();
      await expect(element(by.id('timesheet-summary'))).toBeVisible();
    });

    it('should show weekly hours breakdown', async () => {
      await expect(element(by.id('weekly-hours-card'))).toBeVisible();
    });
  });

  // ============================================================
  // 5. SHIFT MARKETPLACE
  // ============================================================

  describe('Shift Marketplace', () => {
    beforeEach(async () => {
      await ensureLoggedIn();
      await element(by.id('tab-schedule')).tap();
      await element(by.id('marketplace-tab')).tap();
    });

    it('should show available shifts', async () => {
      await expect(element(by.id('shift-marketplace-screen'))).toBeVisible();
    });

    it('should filter shifts by location', async () => {
      await element(by.id('filter-btn')).tap();
      await element(by.id('location-filter')).tap();
      await element(by.text('London')).tap();
      await element(by.id('apply-filters-btn')).tap();
      
      // Verify filter applied
      await expect(element(by.id('active-filters'))).toBeVisible();
    });

    it('should pick up an open shift', async () => {
      await element(by.id('open-shift-0')).tap();
      await element(by.id('pick-up-shift-btn')).tap();
      
      await waitFor(element(by.text('Shift claimed!')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should request shift swap', async () => {
      await element(by.id('my-shifts-tab')).tap();
      await element(by.id('my-shift-0')).tap();
      await element(by.id('swap-shift-btn')).tap();
      
      await expect(element(by.id('swap-request-modal'))).toBeVisible();
    });

    it('should drop a shift', async () => {
      await element(by.id('my-shifts-tab')).tap();
      await element(by.id('my-shift-0')).tap();
      await element(by.id('drop-shift-btn')).tap();
      
      // Confirm drop
      await element(by.id('confirm-drop-btn')).tap();
      
      await waitFor(element(by.text('Shift dropped')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  // ============================================================
  // 6. TIME OFF REQUESTS
  // ============================================================

  describe('Time Off Requests', () => {
    beforeEach(async () => {
      await ensureLoggedIn();
      await element(by.id('tab-time')).tap();
      await element(by.id('time-off-tab')).tap();
    });

    it('should show time off balances', async () => {
      await expect(element(by.id('time-off-balance-card'))).toBeVisible();
    });

    it('should show vacation balance', async () => {
      await expect(element(by.id('vacation-balance'))).toBeVisible();
    });

    it('should show sick leave balance', async () => {
      await expect(element(by.id('sick-balance'))).toBeVisible();
    });

    it('should open new request form', async () => {
      await element(by.id('new-time-off-btn')).tap();
      await expect(element(by.id('time-off-request-form'))).toBeVisible();
    });

    it('should select time off type', async () => {
      await element(by.id('new-time-off-btn')).tap();
      await element(by.id('time-off-type-picker')).tap();
      await element(by.text('Vacation')).tap();
    });

    it('should select date range', async () => {
      await element(by.id('new-time-off-btn')).tap();
      await element(by.id('start-date-picker')).tap();
      // Select a date 2 weeks from now
      await element(by.id('calendar-day-15')).tap();
      
      await element(by.id('end-date-picker')).tap();
      await element(by.id('calendar-day-20')).tap();
    });

    it('should submit time off request', async () => {
      await element(by.id('new-time-off-btn')).tap();
      await element(by.id('time-off-type-picker')).tap();
      await element(by.text('Vacation')).tap();
      
      await element(by.id('start-date-picker')).tap();
      await element(by.id('calendar-day-15')).tap();
      
      await element(by.id('end-date-picker')).tap();
      await element(by.id('calendar-day-20')).tap();
      
      await element(by.id('reason-input')).typeText('Family holiday');
      await element(by.id('submit-request-btn')).tap();
      
      await waitFor(element(by.text('Request submitted!')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show pending requests', async () => {
      await element(by.id('my-requests-tab')).tap();
      await expect(element(by.id('pending-requests-list'))).toBeVisible();
    });

    it('should cancel a pending request', async () => {
      await element(by.id('my-requests-tab')).tap();
      await element(by.id('pending-request-0')).tap();
      await element(by.id('cancel-request-btn')).tap();
      await element(by.id('confirm-cancel-btn')).tap();
      
      await waitFor(element(by.text('Request cancelled')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  // ============================================================
  // 7. FEED & SOCIAL
  // ============================================================

  describe('Feed & Social', () => {
    beforeEach(async () => {
      await ensureLoggedIn();
      await element(by.id('tab-feed')).tap();
    });

    it('should show feed screen', async () => {
      await expect(element(by.id('feed-screen'))).toBeVisible();
    });

    it('should show posts', async () => {
      await expect(element(by.id('post-0'))).toBeVisible();
    });

    it('should pull to refresh feed', async () => {
      await element(by.id('feed-list')).swipe('down', 'slow', 0.5);
    });

    it('should like a post', async () => {
      await element(by.id('like-btn-0')).tap();
      await expect(element(by.id('liked-indicator-0'))).toBeVisible();
    });

    it('should unlike a post', async () => {
      await element(by.id('like-btn-0')).tap();
      await expect(element(by.id('liked-indicator-0'))).toBeNotVisible();
    });

    it('should open comments', async () => {
      await element(by.id('comment-btn-0')).tap();
      await expect(element(by.id('comments-modal'))).toBeVisible();
    });

    it('should add a comment', async () => {
      await element(by.id('comment-btn-0')).tap();
      await element(by.id('comment-input')).typeText('Great post!');
      await element(by.id('send-comment-btn')).tap();
      
      await waitFor(element(by.text('Great post!')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should create a new post', async () => {
      await element(by.id('create-post-btn')).tap();
      await element(by.id('post-content-input')).typeText('Hello team!');
      await element(by.id('publish-post-btn')).tap();
      
      await waitFor(element(by.text('Hello team!')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should give recognition (shoutout)', async () => {
      await element(by.id('create-post-btn')).tap();
      await element(by.id('recognition-btn')).tap();
      await element(by.id('select-colleague')).tap();
      await element(by.text('John Smith')).tap();
      await element(by.id('recognition-message')).typeText('Great job on the project!');
      await element(by.id('send-recognition-btn')).tap();
      
      await waitFor(element(by.text('Recognition sent!')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  // ============================================================
  // 8. PROFILE & SETTINGS
  // ============================================================

  describe('Profile & Settings', () => {
    beforeEach(async () => {
      await ensureLoggedIn();
      await element(by.id('tab-profile')).tap();
    });

    it('should show profile screen', async () => {
      await expect(element(by.id('profile-screen'))).toBeVisible();
    });

    it('should display user info', async () => {
      await expect(element(by.id('user-name'))).toBeVisible();
      await expect(element(by.id('user-email'))).toBeVisible();
      await expect(element(by.id('user-role'))).toBeVisible();
    });

    it('should edit profile', async () => {
      await element(by.id('edit-profile-btn')).tap();
      await expect(element(by.id('edit-profile-screen'))).toBeVisible();
    });

    it('should change profile photo', async () => {
      await element(by.id('change-photo-btn')).tap();
      await expect(element(by.id('photo-options-modal'))).toBeVisible();
    });

    it('should open settings', async () => {
      await element(by.id('settings-btn')).tap();
      await expect(element(by.id('settings-screen'))).toBeVisible();
    });

    it('should change language', async () => {
      await element(by.id('settings-btn')).tap();
      await element(by.id('language-setting')).tap();
      await expect(element(by.id('language-picker'))).toBeVisible();
      
      // Select Spanish
      await element(by.text('Español')).tap();
      
      // Verify UI changed
      await waitFor(element(by.text('Configuración')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should toggle dark mode', async () => {
      await element(by.id('settings-btn')).tap();
      await element(by.id('dark-mode-toggle')).tap();
      // Theme should change
    });

    it('should toggle notifications', async () => {
      await element(by.id('settings-btn')).tap();
      await element(by.id('notifications-setting')).tap();
      await element(by.id('push-notifications-toggle')).tap();
    });

    it('should logout', async () => {
      await element(by.id('settings-btn')).tap();
      await element(by.id('logout-btn')).tap();
      await element(by.id('confirm-logout-btn')).tap();
      
      await waitFor(element(by.id('login-screen')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  // ============================================================
  // 9. SKILLS & CAREER
  // ============================================================

  describe('Skills & Career', () => {
    beforeEach(async () => {
      await ensureLoggedIn();
      await element(by.id('tab-profile')).tap();
      await element(by.id('skills-section')).tap();
    });

    it('should show skills screen', async () => {
      await expect(element(by.id('skills-screen'))).toBeVisible();
    });

    it('should display current skills', async () => {
      await expect(element(by.id('my-skills-list'))).toBeVisible();
    });

    it('should show skill level', async () => {
      await expect(element(by.id('skill-level-0'))).toBeVisible();
    });

    it('should view skill details', async () => {
      await element(by.id('skill-0')).tap();
      await expect(element(by.id('skill-detail-modal'))).toBeVisible();
    });

    it('should show career path', async () => {
      await element(by.id('career-tab')).tap();
      await expect(element(by.id('career-path-screen'))).toBeVisible();
    });

    it('should view job openings', async () => {
      await element(by.id('career-tab')).tap();
      await element(by.id('job-openings-btn')).tap();
      await expect(element(by.id('job-openings-list'))).toBeVisible();
    });

    it('should view training courses', async () => {
      await element(by.id('training-tab')).tap();
      await expect(element(by.id('training-courses-list'))).toBeVisible();
    });
  });

  // ============================================================
  // 10. NOTIFICATIONS
  // ============================================================

  describe('Notifications', () => {
    beforeEach(async () => {
      await ensureLoggedIn();
      await element(by.id('notifications-btn')).tap();
    });

    it('should show notifications screen', async () => {
      await expect(element(by.id('notifications-screen'))).toBeVisible();
    });

    it('should display notification list', async () => {
      await expect(element(by.id('notifications-list'))).toBeVisible();
    });

    it('should mark notification as read', async () => {
      await element(by.id('notification-0')).tap();
      // Notification should be marked as read
    });

    it('should mark all as read', async () => {
      await element(by.id('mark-all-read-btn')).tap();
      await expect(element(by.id('unread-badge'))).toBeNotVisible();
    });

    it('should navigate from notification', async () => {
      // Tap on a schedule notification
      await element(by.id('schedule-notification-0')).tap();
      await expect(element(by.id('schedule-screen'))).toBeVisible();
    });
  });

  // ============================================================
  // 11. OFFLINE MODE
  // ============================================================

  describe('Offline Mode', () => {
    it('should show offline indicator', async () => {
      // Disable network
      await device.setStatusBar({ connectivity: 'none' });
      
      await waitFor(element(by.id('offline-banner')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should queue clock-in action when offline', async () => {
      await device.setStatusBar({ connectivity: 'none' });
      
      await element(by.id('tab-time')).tap();
      await element(by.id('clock-in-btn')).tap();
      
      await expect(element(by.text('Will sync when online'))).toBeVisible();
    });

    it('should sync when back online', async () => {
      // Re-enable network
      await device.setStatusBar({ connectivity: 'wifi' });
      
      await waitFor(element(by.id('offline-banner')))
        .toBeNotVisible()
        .withTimeout(10000);
      
      await waitFor(element(by.text('Synced successfully')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show cached schedule offline', async () => {
      await device.setStatusBar({ connectivity: 'none' });
      
      await element(by.id('tab-schedule')).tap();
      
      // Should still show schedule from cache
      await expect(element(by.id('week-view'))).toBeVisible();
    });
  });

  // ============================================================
  // 12. MANAGER FEATURES
  // ============================================================

  describe('Manager Features', () => {
    beforeEach(async () => {
      await loginAsManager();
      await element(by.id('manager-tab')).tap();
    });

    it('should show manager dashboard', async () => {
      await expect(element(by.id('manager-dashboard'))).toBeVisible();
    });

    it('should show team overview', async () => {
      await expect(element(by.id('team-overview'))).toBeVisible();
    });

    it('should show pending approvals', async () => {
      await expect(element(by.id('pending-approvals-badge'))).toBeVisible();
    });

    it('should approve time off request', async () => {
      await element(by.id('approvals-tab')).tap();
      await element(by.id('time-off-request-0')).tap();
      await element(by.id('approve-btn')).tap();
      
      await waitFor(element(by.text('Approved!')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should reject time off request', async () => {
      await element(by.id('approvals-tab')).tap();
      await element(by.id('time-off-request-1')).tap();
      await element(by.id('reject-btn')).tap();
      await element(by.id('rejection-reason')).typeText('Coverage needed');
      await element(by.id('confirm-reject-btn')).tap();
      
      await waitFor(element(by.text('Rejected')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should approve shift swap', async () => {
      await element(by.id('approvals-tab')).tap();
      await element(by.id('shift-swap-tab')).tap();
      await element(by.id('swap-request-0')).tap();
      await element(by.id('approve-swap-btn')).tap();
    });

    it('should view team schedule', async () => {
      await element(by.id('team-schedule-tab')).tap();
      await expect(element(by.id('team-schedule-view'))).toBeVisible();
    });

    it('should send announcement', async () => {
      await element(by.id('announcements-btn')).tap();
      await element(by.id('new-announcement-btn')).tap();
      await element(by.id('announcement-input')).typeText('Team meeting at 3pm');
      await element(by.id('send-announcement-btn')).tap();
      
      await waitFor(element(by.text('Announcement sent!')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  // ============================================================
  // 13. GAMIFICATION
  // ============================================================

  describe('Gamification', () => {
    beforeEach(async () => {
      await ensureLoggedIn();
      await element(by.id('tab-profile')).tap();
    });

    it('should show level and XP', async () => {
      await expect(element(by.id('level-badge'))).toBeVisible();
      await expect(element(by.id('xp-bar'))).toBeVisible();
    });

    it('should show badges', async () => {
      await element(by.id('badges-section')).tap();
      await expect(element(by.id('badges-grid'))).toBeVisible();
    });

    it('should view badge details', async () => {
      await element(by.id('badges-section')).tap();
      await element(by.id('badge-0')).tap();
      await expect(element(by.id('badge-detail-modal'))).toBeVisible();
    });

    it('should view leaderboard', async () => {
      await element(by.id('leaderboard-btn')).tap();
      await expect(element(by.id('leaderboard-screen'))).toBeVisible();
    });

    it('should show achievements', async () => {
      await element(by.id('achievements-section')).tap();
      await expect(element(by.id('achievements-list'))).toBeVisible();
    });

    it('should view rewards', async () => {
      await element(by.id('rewards-btn')).tap();
      await expect(element(by.id('rewards-screen'))).toBeVisible();
    });
  });

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================

  async function ensureLoggedIn() {
    try {
      await expect(element(by.id('home-screen'))).toBeVisible();
    } catch {
      await element(by.id('email-input')).typeText('demo@uplift.com');
      await element(by.id('password-input')).typeText('Demo123!');
      await element(by.id('login-btn')).tap();
      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(10000);
    }
  }

  async function loginAsManager() {
    // Logout first if needed
    try {
      await element(by.id('tab-profile')).tap();
      await element(by.id('settings-btn')).tap();
      await element(by.id('logout-btn')).tap();
      await element(by.id('confirm-logout-btn')).tap();
    } catch {
      // Not logged in
    }

    await waitFor(element(by.id('login-screen')))
      .toBeVisible()
      .withTimeout(5000);
    
    await element(by.id('email-input')).typeText('manager@uplift.com');
    await element(by.id('password-input')).typeText('Manager123!');
    await element(by.id('login-btn')).tap();
    
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(10000);
  }
});
