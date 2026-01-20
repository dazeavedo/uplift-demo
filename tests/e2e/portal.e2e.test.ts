// ============================================================
// UPLIFT PORTAL - E2E TEST SUITE
// Playwright end-to-end tests for web portal
// ============================================================

import { test, expect, Page } from '@playwright/test';

// ============================================================
// TEST CONFIGURATION
// ============================================================

const BASE_URL = process.env.PORTAL_URL || 'http://localhost:5173';

const testUsers = {
  admin: {
    email: 'admin@uplift-test.com',
    password: 'AdminPass123!',
  },
  manager: {
    email: 'manager@uplift-test.com',
    password: 'ManagerPass123!',
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

async function login(page: Page, user = testUsers.admin) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('[data-testid="email-input"]', user.email);
  await page.fill('[data-testid="password-input"]', user.password);
  await page.click('[data-testid="login-btn"]');
  await page.waitForURL('**/dashboard');
}

async function logout(page: Page) {
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-btn"]');
  await page.waitForURL('**/login');
}

// ============================================================
// 1. AUTHENTICATION TESTS
// ============================================================

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.click('[data-testid="login-btn"]');
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[data-testid="email-input"]', 'wrong@email.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-btn"]');
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should login successfully', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await login(page);
    await logout(page);
    await expect(page).toHaveURL(/.*login/);
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page).toHaveURL(/.*login/);
  });

  test('should persist session after page refresh', async ({ page }) => {
    await login(page);
    await page.reload();
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
  });
});

// ============================================================
// 2. DASHBOARD TESTS
// ============================================================

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display dashboard with key metrics', async ({ page }) => {
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="employees-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="locations-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="shifts-today"]')).toBeVisible();
  });

  test('should show today\'s schedule overview', async ({ page }) => {
    await expect(page.locator('[data-testid="today-schedule"]')).toBeVisible();
  });

  test('should show recent activity', async ({ page }) => {
    await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();
  });

  test('should show pending approvals for managers', async ({ page }) => {
    await expect(page.locator('[data-testid="pending-approvals"]')).toBeVisible();
  });

  test('should navigate to employees from quick link', async ({ page }) => {
    await page.click('[data-testid="quick-link-employees"]');
    await expect(page).toHaveURL(/.*employees/);
  });
});

// ============================================================
// 3. EMPLOYEE MANAGEMENT TESTS
// ============================================================

test.describe('Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/employees`);
  });

  test('should display employee list', async ({ page }) => {
    await expect(page.locator('[data-testid="employees-table"]')).toBeVisible();
  });

  test('should search employees', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'John');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    // Results should be filtered
    await expect(page.locator('text=John')).toBeVisible();
  });

  test('should filter employees by status', async ({ page }) => {
    await page.click('[data-testid="filter-status"]');
    await page.click('text=Active');
    await page.waitForTimeout(500);
  });

  test('should open add employee modal', async ({ page }) => {
    await page.click('[data-testid="add-employee-btn"]');
    await expect(page.locator('[data-testid="employee-modal"]')).toBeVisible();
  });

  test('should create new employee', async ({ page }) => {
    await page.click('[data-testid="add-employee-btn"]');
    
    await page.fill('[data-testid="first-name-input"]', 'Test');
    await page.fill('[data-testid="last-name-input"]', 'Employee');
    await page.fill('[data-testid="email-input"]', `test-${Date.now()}@example.com`);
    await page.selectOption('[data-testid="employment-type"]', 'full_time');
    
    await page.click('[data-testid="save-employee-btn"]');
    
    await expect(page.locator('text=Employee created')).toBeVisible();
  });

  test('should view employee details', async ({ page }) => {
    await page.click('[data-testid="employee-row-0"]');
    await expect(page).toHaveURL(/.*employees\/.*/);
    await expect(page.locator('[data-testid="employee-detail"]')).toBeVisible();
  });

  test('should edit employee', async ({ page }) => {
    await page.click('[data-testid="employee-row-0"]');
    await page.click('[data-testid="edit-employee-btn"]');
    
    await page.fill('[data-testid="first-name-input"]', 'Updated');
    await page.click('[data-testid="save-employee-btn"]');
    
    await expect(page.locator('text=Employee updated')).toBeVisible();
  });

  test('should deactivate employee', async ({ page }) => {
    await page.click('[data-testid="employee-row-0"]');
    await page.click('[data-testid="actions-menu"]');
    await page.click('[data-testid="deactivate-btn"]');
    await page.click('[data-testid="confirm-deactivate"]');
    
    await expect(page.locator('text=Employee deactivated')).toBeVisible();
  });

  test('should bulk import employees', async ({ page }) => {
    await page.click('[data-testid="bulk-import-btn"]');
    await expect(page.locator('[data-testid="import-modal"]')).toBeVisible();
    
    // Upload CSV file
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'employees.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('firstName,lastName,email\nTest,User,test@example.com'),
    });
    
    await page.click('[data-testid="import-btn"]');
    await expect(page.locator('text=Import complete')).toBeVisible();
  });
});

// ============================================================
// 4. LOCATION MANAGEMENT TESTS
// ============================================================

test.describe('Location Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/locations`);
  });

  test('should display locations list', async ({ page }) => {
    await expect(page.locator('[data-testid="locations-table"]')).toBeVisible();
  });

  test('should create new location', async ({ page }) => {
    await page.click('[data-testid="add-location-btn"]');
    
    await page.fill('[data-testid="location-name"]', 'Test Location');
    await page.fill('[data-testid="location-address"]', '123 Test Street');
    await page.fill('[data-testid="location-city"]', 'London');
    await page.selectOption('[data-testid="location-type"]', 'store');
    
    await page.click('[data-testid="save-location-btn"]');
    
    await expect(page.locator('text=Location created')).toBeVisible();
  });

  test('should edit location', async ({ page }) => {
    await page.click('[data-testid="location-row-0"]');
    await page.click('[data-testid="edit-location-btn"]');
    
    await page.fill('[data-testid="location-name"]', 'Updated Location');
    await page.click('[data-testid="save-location-btn"]');
    
    await expect(page.locator('text=Location updated')).toBeVisible();
  });

  test('should view location on map', async ({ page }) => {
    await page.click('[data-testid="map-view-btn"]');
    await expect(page.locator('[data-testid="locations-map"]')).toBeVisible();
  });
});

// ============================================================
// 5. SCHEDULING TESTS
// ============================================================

test.describe('Scheduling', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/schedule`);
  });

  test('should display schedule view', async ({ page }) => {
    await expect(page.locator('[data-testid="schedule-view"]')).toBeVisible();
  });

  test('should switch between week/day/month views', async ({ page }) => {
    await page.click('[data-testid="view-week"]');
    await expect(page.locator('[data-testid="week-view"]')).toBeVisible();
    
    await page.click('[data-testid="view-day"]');
    await expect(page.locator('[data-testid="day-view"]')).toBeVisible();
    
    await page.click('[data-testid="view-month"]');
    await expect(page.locator('[data-testid="month-view"]')).toBeVisible();
  });

  test('should navigate between weeks', async ({ page }) => {
    await page.click('[data-testid="next-week-btn"]');
    await page.waitForTimeout(300);
    await page.click('[data-testid="prev-week-btn"]');
  });

  test('should filter schedule by location', async ({ page }) => {
    await page.click('[data-testid="location-filter"]');
    await page.click('[data-testid="location-option-0"]');
    await page.waitForTimeout(500);
  });

  test('should create new shift', async ({ page }) => {
    await page.click('[data-testid="add-shift-btn"]');
    
    await page.click('[data-testid="employee-select"]');
    await page.click('[data-testid="employee-option-0"]');
    
    await page.fill('[data-testid="shift-date"]', '2024-03-15');
    await page.fill('[data-testid="shift-start-time"]', '09:00');
    await page.fill('[data-testid="shift-end-time"]', '17:00');
    
    await page.click('[data-testid="save-shift-btn"]');
    
    await expect(page.locator('text=Shift created')).toBeVisible();
  });

  test('should drag and drop shift', async ({ page }) => {
    const shift = page.locator('[data-testid="shift-0"]');
    const targetCell = page.locator('[data-testid="schedule-cell-mon"]');
    
    await shift.dragTo(targetCell);
    await expect(page.locator('text=Shift moved')).toBeVisible();
  });

  test('should copy shift', async ({ page }) => {
    await page.click('[data-testid="shift-0"]');
    await page.click('[data-testid="copy-shift-btn"]');
    await page.click('[data-testid="schedule-cell-tue"]');
    
    await expect(page.locator('text=Shift copied')).toBeVisible();
  });

  test('should delete shift', async ({ page }) => {
    await page.click('[data-testid="shift-0"]');
    await page.click('[data-testid="delete-shift-btn"]');
    await page.click('[data-testid="confirm-delete"]');
    
    await expect(page.locator('text=Shift deleted')).toBeVisible();
  });

  test('should publish schedule', async ({ page }) => {
    await page.click('[data-testid="publish-schedule-btn"]');
    await page.click('[data-testid="confirm-publish"]');
    
    await expect(page.locator('text=Schedule published')).toBeVisible();
  });

  test('should show overtime warnings', async ({ page }) => {
    // Assuming there's an employee with overtime
    const warning = page.locator('[data-testid="overtime-warning"]');
    if (await warning.isVisible()) {
      await expect(warning).toContainText('overtime');
    }
  });
});

// ============================================================
// 6. TIME TRACKING TESTS
// ============================================================

test.describe('Time Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/time-tracking`);
  });

  test('should display time tracking view', async ({ page }) => {
    await expect(page.locator('[data-testid="time-tracking-view"]')).toBeVisible();
  });

  test('should show active clock-ins', async ({ page }) => {
    await expect(page.locator('[data-testid="active-clockins"]')).toBeVisible();
  });

  test('should filter by date range', async ({ page }) => {
    await page.fill('[data-testid="date-from"]', '2024-03-01');
    await page.fill('[data-testid="date-to"]', '2024-03-15');
    await page.click('[data-testid="apply-filter"]');
  });

  test('should view timesheet', async ({ page }) => {
    await page.click('[data-testid="timesheets-tab"]');
    await expect(page.locator('[data-testid="timesheets-table"]')).toBeVisible();
  });

  test('should approve timesheet', async ({ page }) => {
    await page.click('[data-testid="timesheets-tab"]');
    await page.click('[data-testid="timesheet-row-0"]');
    await page.click('[data-testid="approve-timesheet-btn"]');
    
    await expect(page.locator('text=Timesheet approved')).toBeVisible();
  });

  test('should add manual time entry', async ({ page }) => {
    await page.click('[data-testid="add-entry-btn"]');
    
    await page.click('[data-testid="employee-select"]');
    await page.click('[data-testid="employee-option-0"]');
    
    await page.fill('[data-testid="entry-date"]', '2024-03-10');
    await page.fill('[data-testid="entry-clock-in"]', '09:00');
    await page.fill('[data-testid="entry-clock-out"]', '17:00');
    
    await page.click('[data-testid="save-entry-btn"]');
    
    await expect(page.locator('text=Entry added')).toBeVisible();
  });

  test('should export timesheet to CSV', async ({ page }) => {
    await page.click('[data-testid="timesheets-tab"]');
    await page.click('[data-testid="export-btn"]');
    
    // Check download started
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv"]'),
    ]);
    
    expect(download.suggestedFilename()).toContain('.csv');
  });
});

// ============================================================
// 7. TIME OFF MANAGEMENT TESTS
// ============================================================

test.describe('Time Off Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/time-off`);
  });

  test('should display time off requests', async ({ page }) => {
    await expect(page.locator('[data-testid="time-off-table"]')).toBeVisible();
  });

  test('should filter by status', async ({ page }) => {
    await page.click('[data-testid="status-filter"]');
    await page.click('text=Pending');
  });

  test('should approve time off request', async ({ page }) => {
    await page.click('[data-testid="request-row-0"]');
    await page.click('[data-testid="approve-request-btn"]');
    
    await expect(page.locator('text=Request approved')).toBeVisible();
  });

  test('should deny time off request', async ({ page }) => {
    await page.click('[data-testid="request-row-0"]');
    await page.click('[data-testid="deny-request-btn"]');
    await page.fill('[data-testid="denial-reason"]', 'Coverage needed');
    await page.click('[data-testid="confirm-deny"]');
    
    await expect(page.locator('text=Request denied')).toBeVisible();
  });

  test('should view team calendar', async ({ page }) => {
    await page.click('[data-testid="calendar-view-btn"]');
    await expect(page.locator('[data-testid="time-off-calendar"]')).toBeVisible();
  });

  test('should configure blackout dates', async ({ page }) => {
    await page.click('[data-testid="settings-tab"]');
    await page.click('[data-testid="add-blackout-btn"]');
    await page.fill('[data-testid="blackout-date"]', '2024-12-25');
    await page.fill('[data-testid="blackout-reason"]', 'Christmas');
    await page.click('[data-testid="save-blackout"]');
    
    await expect(page.locator('text=Blackout date added')).toBeVisible();
  });
});

// ============================================================
// 8. SKILLS MANAGEMENT TESTS
// ============================================================

test.describe('Skills Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/skills`);
  });

  test('should display skills list', async ({ page }) => {
    await expect(page.locator('[data-testid="skills-table"]')).toBeVisible();
  });

  test('should create new skill', async ({ page }) => {
    await page.click('[data-testid="add-skill-btn"]');
    
    await page.fill('[data-testid="skill-name"]', 'Test Skill');
    await page.selectOption('[data-testid="skill-category"]', 'technical');
    await page.fill('[data-testid="skill-description"]', 'Test skill description');
    
    await page.click('[data-testid="save-skill-btn"]');
    
    await expect(page.locator('text=Skill created')).toBeVisible();
  });

  test('should view skill matrix', async ({ page }) => {
    await page.click('[data-testid="matrix-view-btn"]');
    await expect(page.locator('[data-testid="skill-matrix"]')).toBeVisible();
  });

  test('should assign skill to employee', async ({ page }) => {
    await page.click('[data-testid="skill-row-0"]');
    await page.click('[data-testid="assign-employee-btn"]');
    await page.click('[data-testid="employee-option-0"]');
    await page.selectOption('[data-testid="skill-level"]', 'intermediate');
    await page.click('[data-testid="save-assignment"]');
    
    await expect(page.locator('text=Skill assigned')).toBeVisible();
  });
});

// ============================================================
// 9. REPORTS & ANALYTICS TESTS
// ============================================================

test.describe('Reports & Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/reports`);
  });

  test('should display reports page', async ({ page }) => {
    await expect(page.locator('[data-testid="reports-page"]')).toBeVisible();
  });

  test('should generate attendance report', async ({ page }) => {
    await page.click('[data-testid="attendance-report"]');
    await page.fill('[data-testid="date-from"]', '2024-03-01');
    await page.fill('[data-testid="date-to"]', '2024-03-31');
    await page.click('[data-testid="generate-report"]');
    
    await expect(page.locator('[data-testid="report-results"]')).toBeVisible();
  });

  test('should generate labor cost report', async ({ page }) => {
    await page.click('[data-testid="labor-cost-report"]');
    await page.click('[data-testid="generate-report"]');
    
    await expect(page.locator('[data-testid="report-results"]')).toBeVisible();
  });

  test('should export report as PDF', async ({ page }) => {
    await page.click('[data-testid="attendance-report"]');
    await page.click('[data-testid="generate-report"]');
    await page.waitForSelector('[data-testid="report-results"]');
    
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-pdf"]'),
    ]);
    
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('should view demand forecast', async ({ page }) => {
    await page.click('[data-testid="demand-forecast"]');
    await expect(page.locator('[data-testid="forecast-chart"]')).toBeVisible();
  });
});

// ============================================================
// 10. SETTINGS TESTS
// ============================================================

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/settings`);
  });

  test('should display settings page', async ({ page }) => {
    await expect(page.locator('[data-testid="settings-page"]')).toBeVisible();
  });

  test('should update organization name', async ({ page }) => {
    await page.click('[data-testid="organization-tab"]');
    await page.fill('[data-testid="org-name"]', 'Updated Org Name');
    await page.click('[data-testid="save-settings"]');
    
    await expect(page.locator('text=Settings saved')).toBeVisible();
  });

  test('should configure scheduling rules', async ({ page }) => {
    await page.click('[data-testid="scheduling-tab"]');
    await page.fill('[data-testid="min-rest-hours"]', '11');
    await page.fill('[data-testid="max-consecutive-days"]', '6');
    await page.click('[data-testid="save-settings"]');
    
    await expect(page.locator('text=Settings saved')).toBeVisible();
  });

  test('should manage integrations', async ({ page }) => {
    await page.click('[data-testid="integrations-tab"]');
    await expect(page.locator('[data-testid="integrations-list"]')).toBeVisible();
  });

  test('should generate API key', async ({ page }) => {
    await page.click('[data-testid="integrations-tab"]');
    await page.click('[data-testid="api-keys-section"]');
    await page.click('[data-testid="generate-api-key"]');
    await page.fill('[data-testid="api-key-name"]', 'Test API Key');
    await page.click('[data-testid="create-key"]');
    
    await expect(page.locator('[data-testid="api-key-value"]')).toBeVisible();
  });

  test('should configure notification preferences', async ({ page }) => {
    await page.click('[data-testid="notifications-tab"]');
    await page.click('[data-testid="email-notifications-toggle"]');
    await page.click('[data-testid="save-settings"]');
  });
});

// ============================================================
// 11. INTERNATIONALIZATION TESTS
// ============================================================

test.describe('Internationalization', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should change language to Spanish', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    await page.click('[data-testid="language-selector"]');
    await page.click('text=Español');
    
    // Verify UI changed
    await expect(page.locator('text=Configuración')).toBeVisible();
  });

  test('should change language to French', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    await page.click('[data-testid="language-selector"]');
    await page.click('text=Français');
    
    await expect(page.locator('text=Paramètres')).toBeVisible();
  });

  test('should persist language preference', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    await page.click('[data-testid="language-selector"]');
    await page.click('text=Deutsch');
    
    await page.reload();
    
    await expect(page.locator('text=Einstellungen')).toBeVisible();
  });

  test('should support RTL languages (Arabic)', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    await page.click('[data-testid="language-selector"]');
    await page.click('text=العربية');
    
    // Check RTL direction
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });
});

// ============================================================
// 12. ACCESSIBILITY TESTS
// ============================================================

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    const h1 = await page.locator('h1').count();
    expect(h1).toBeGreaterThanOrEqual(1);
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should have visible focus indicator
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto(`${BASE_URL}/employees`);
    await page.click('[data-testid="add-employee-btn"]');
    
    const inputs = page.locator('input:not([type="hidden"])');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const id = await inputs.nth(i).getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });
});

// ============================================================
// 13. PERFORMANCE TESTS
// ============================================================

test.describe('Performance', () => {
  test('should load dashboard within 3 seconds', async ({ page }) => {
    await login(page);
    
    const start = Date.now();
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForSelector('[data-testid="dashboard"]');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should load employee list within 2 seconds', async ({ page }) => {
    await login(page);
    
    const start = Date.now();
    await page.goto(`${BASE_URL}/employees`);
    await page.waitForSelector('[data-testid="employees-table"]');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(2000);
  });

  test('should handle large schedule data', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/schedule`);
    
    // Schedule should render without timing out
    await expect(page.locator('[data-testid="schedule-view"]')).toBeVisible({ timeout: 5000 });
  });
});

// ============================================================
// 14. ERROR HANDLING TESTS
// ============================================================

test.describe('Error Handling', () => {
  test('should show 404 page for invalid routes', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/invalid-route-12345`);
    await expect(page.locator('text=Page not found')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await login(page);
    
    // Simulate offline
    await page.route('**/api/**', route => route.abort());
    
    await page.goto(`${BASE_URL}/employees`);
    await expect(page.locator('text=Unable to load')).toBeVisible();
  });

  test('should show error boundary on crash', async ({ page }) => {
    await login(page);
    
    // Inject an error
    await page.evaluate(() => {
      throw new Error('Test error');
    }).catch(() => {});
    
    // Should show error boundary
  });
});

// ============================================================
// 15. RESPONSIVE DESIGN TESTS
// ============================================================

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
    
    await expect(page.locator('[data-testid="mobile-menu-btn"]')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await login(page);
    
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
  });

  test('should collapse sidebar on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
    
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toBeHidden();
  });

  test('should open mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
    
    await page.click('[data-testid="mobile-menu-btn"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });
});
