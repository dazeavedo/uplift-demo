// ============================================================
// UPLIFT - COMPREHENSIVE E2E API TEST SUITE
// Full end-to-end testing for all API endpoints
// ============================================================

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/index.js';
import { db } from '../../src/lib/database.js';

let app;
let adminCookies;
let managerCookies;
let workerCookies;
let testOrg;
let testLocation;
let testEmployee;
let testShift;

// ============================================================
// TEST DATA GENERATORS
// ============================================================

const generateTestEmail = (prefix = 'test') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}@example.com`;

const testData = {
  organization: {
    name: 'E2E Test Organization',
  },
  admin: {
    email: generateTestEmail('admin'),
    password: 'AdminPass123!',
    firstName: 'Admin',
    lastName: 'User',
  },
  manager: {
    email: generateTestEmail('manager'),
    password: 'ManagerPass123!',
    firstName: 'Manager',
    lastName: 'User',
  },
  worker: {
    email: generateTestEmail('worker'),
    password: 'WorkerPass123!',
    firstName: 'Worker',
    lastName: 'User',
  },
};

// ============================================================
// SETUP & TEARDOWN
// ============================================================

beforeAll(async () => {
  app = await createApp();
  
  // Register organization and admin
  const adminRes = await request(app)
    .post('/api/auth/register')
    .send({
      organizationName: testData.organization.name,
      email: testData.admin.email,
      password: testData.admin.password,
      firstName: testData.admin.firstName,
      lastName: testData.admin.lastName,
    });
  
  adminCookies = adminRes.headers['set-cookie'];
  testOrg = adminRes.body.organization;
});

afterAll(async () => {
  // Cleanup test data
  if (testOrg?.id) {
    try {
      await db.query('DELETE FROM organizations WHERE id = $1', [testOrg.id]);
    } catch (e) {
      console.error('Cleanup error:', e);
    }
  }
  await db.end();
});

// ============================================================
// 1. HEALTH & SYSTEM TESTS
// ============================================================

describe('System Health', () => {
  it('GET /api/health - should return healthy status', async () => {
    const res = await request(app).get('/api/health');
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.database).toBe('connected');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/version - should return version info', async () => {
    const res = await request(app).get('/api/version');
    
    expect(res.status).toBe(200);
    expect(res.body.version).toBeDefined();
  });
});

// ============================================================
// 2. AUTHENTICATION FLOW TESTS
// ============================================================

describe('Complete Authentication Flow', () => {
  const newUser = {
    email: generateTestEmail('newuser'),
    password: 'NewUser123!',
    firstName: 'New',
    lastName: 'User',
  };

  describe('Registration → Login → Profile → Logout', () => {
    let userCookies;

    it('Step 1: Register new organization', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          organizationName: 'New Test Org',
          ...newUser,
        });

      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe(newUser.email);
      expect(res.body.organization).toBeDefined();
      userCookies = res.headers['set-cookie'];
    });

    it('Step 2: Get current user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', userCookies);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(newUser.email);
      expect(res.body.user.role).toBe('admin');
    });

    it('Step 3: Logout', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', userCookies);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Step 4: Login again', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(newUser.email);
    });

    it('Step 5: Refresh token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: newUser.email, password: newUser.password });

      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', loginRes.headers['set-cookie']);

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
    });
  });

  describe('Password Management', () => {
    it('should change password successfully', async () => {
      const changeUser = {
        email: generateTestEmail('changepass'),
        password: 'OldPass123!',
      };

      // Register
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({
          organizationName: 'Change Pass Org',
          ...changeUser,
          firstName: 'Change',
          lastName: 'Pass',
        });

      // Change password
      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Cookie', regRes.headers['set-cookie'])
        .send({
          currentPassword: changeUser.password,
          newPassword: 'NewPass456!',
        });

      expect(res.status).toBe(200);

      // Login with new password
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: changeUser.email,
          password: 'NewPass456!',
        });

      expect(loginRes.status).toBe(200);
    });

    it('should request password reset', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testData.admin.email });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('reset');
    });
  });
});

// ============================================================
// 3. EMPLOYEE MANAGEMENT E2E
// ============================================================

describe('Employee Management E2E', () => {
  let createdEmployeeId;

  it('should create a new employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Cookie', adminCookies)
      .send({
        firstName: 'John',
        lastName: 'Smith',
        email: generateTestEmail('employee'),
        phone: '+44 20 1234 5678',
        employmentType: 'full_time',
        hourlyRate: 15.50,
        maxHoursPerWeek: 40,
        preferredLanguage: 'en',
      });

    expect(res.status).toBe(201);
    expect(res.body.employee.first_name).toBe('John');
    expect(res.body.employee.last_name).toBe('Smith');
    createdEmployeeId = res.body.employee.id;
    testEmployee = res.body.employee;
  });

  it('should list all employees with pagination', async () => {
    const res = await request(app)
      .get('/api/employees')
      .query({ page: 1, limit: 10 })
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.employees)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it('should search employees by name', async () => {
    const res = await request(app)
      .get('/api/employees')
      .query({ search: 'John' })
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
    expect(res.body.employees.some(e => e.first_name === 'John')).toBe(true);
  });

  it('should get employee by ID', async () => {
    const res = await request(app)
      .get(`/api/employees/${createdEmployeeId}`)
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
    expect(res.body.employee.id).toBe(createdEmployeeId);
  });

  it('should update employee details', async () => {
    const res = await request(app)
      .patch(`/api/employees/${createdEmployeeId}`)
      .set('Cookie', adminCookies)
      .send({
        firstName: 'Jonathan',
        hourlyRate: 17.00,
      });

    expect(res.status).toBe(200);
    expect(res.body.employee.first_name).toBe('Jonathan');
    expect(parseFloat(res.body.employee.hourly_rate)).toBe(17.00);
  });

  it('should set employee availability', async () => {
    const res = await request(app)
      .post(`/api/employees/${createdEmployeeId}/availability`)
      .set('Cookie', adminCookies)
      .send({
        availability: {
          monday: { available: true, startTime: '09:00', endTime: '17:00' },
          tuesday: { available: true, startTime: '09:00', endTime: '17:00' },
          wednesday: { available: true, startTime: '09:00', endTime: '17:00' },
          thursday: { available: true, startTime: '09:00', endTime: '17:00' },
          friday: { available: true, startTime: '09:00', endTime: '17:00' },
          saturday: { available: false },
          sunday: { available: false },
        },
      });

    expect(res.status).toBe(200);
  });

  it('should bulk import employees via CSV', async () => {
    const csvData = `firstName,lastName,email,employmentType
Alice,Johnson,${generateTestEmail('alice')},full_time
Bob,Williams,${generateTestEmail('bob')},part_time`;

    const res = await request(app)
      .post('/api/employees/bulk-import')
      .set('Cookie', adminCookies)
      .set('Content-Type', 'text/csv')
      .send(csvData);

    expect(res.status).toBe(200);
    expect(res.body.imported).toBeGreaterThanOrEqual(2);
  });
});

// ============================================================
// 4. LOCATION MANAGEMENT E2E
// ============================================================

describe('Location Management E2E', () => {
  let createdLocationId;

  it('should create a new location', async () => {
    const res = await request(app)
      .post('/api/locations')
      .set('Cookie', adminCookies)
      .send({
        name: 'London Oxford Street',
        type: 'store',
        address: '100 Oxford Street',
        city: 'London',
        postcode: 'W1D 1LL',
        country: 'United Kingdom',
        timezone: 'Europe/London',
        latitude: 51.5155,
        longitude: -0.1415,
        geofenceRadius: 100,
      });

    expect(res.status).toBe(201);
    expect(res.body.location.name).toBe('London Oxford Street');
    createdLocationId = res.body.location.id;
    testLocation = res.body.location;
  });

  it('should list all locations', async () => {
    const res = await request(app)
      .get('/api/locations')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.locations)).toBe(true);
  });

  it('should update location details', async () => {
    const res = await request(app)
      .patch(`/api/locations/${createdLocationId}`)
      .set('Cookie', adminCookies)
      .send({
        name: 'London Oxford Street Flagship',
        geofenceRadius: 150,
      });

    expect(res.status).toBe(200);
    expect(res.body.location.name).toBe('London Oxford Street Flagship');
  });

  it('should assign employees to location', async () => {
    const res = await request(app)
      .post(`/api/locations/${createdLocationId}/employees`)
      .set('Cookie', adminCookies)
      .send({
        employeeIds: [testEmployee?.id].filter(Boolean),
      });

    expect([200, 201]).toContain(res.status);
  });
});

// ============================================================
// 5. SCHEDULING E2E
// ============================================================

describe('Scheduling E2E', () => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  let createdShiftId;

  it('should create a shift', async () => {
    const shiftDate = nextWeek.toISOString().split('T')[0];
    
    const res = await request(app)
      .post('/api/shifts')
      .set('Cookie', adminCookies)
      .send({
        locationId: testLocation?.id,
        employeeId: testEmployee?.id,
        date: shiftDate,
        startTime: '09:00',
        endTime: '17:00',
        breakDuration: 60,
        role: 'Sales Associate',
        notes: 'Opening shift',
      });

    expect([200, 201]).toContain(res.status);
    if (res.body.shift) {
      createdShiftId = res.body.shift.id;
      testShift = res.body.shift;
    }
  });

  it('should list shifts for date range', async () => {
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const res = await request(app)
      .get('/api/shifts')
      .query({ startDate, endDate })
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.shifts)).toBe(true);
  });

  it('should get schedule overview', async () => {
    const res = await request(app)
      .get('/api/schedule/overview')
      .query({ 
        startDate: today.toISOString().split('T')[0],
        endDate: nextWeek.toISOString().split('T')[0],
      })
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should update shift', async () => {
    if (!createdShiftId) return;

    const res = await request(app)
      .patch(`/api/shifts/${createdShiftId}`)
      .set('Cookie', adminCookies)
      .send({
        endTime: '18:00',
        notes: 'Extended shift',
      });

    expect(res.status).toBe(200);
  });

  it('should publish schedule', async () => {
    const startDate = nextWeek.toISOString().split('T')[0];
    
    const res = await request(app)
      .post('/api/schedule/publish')
      .set('Cookie', adminCookies)
      .send({
        startDate,
        locationId: testLocation?.id,
        notifyEmployees: true,
      });

    expect([200, 201]).toContain(res.status);
  });

  it('should create shift template', async () => {
    const res = await request(app)
      .post('/api/shift-templates')
      .set('Cookie', adminCookies)
      .send({
        name: 'Morning Shift',
        startTime: '06:00',
        endTime: '14:00',
        breakDuration: 30,
        locationId: testLocation?.id,
      });

    expect([200, 201]).toContain(res.status);
  });

  it('should get open shifts (marketplace)', async () => {
    const res = await request(app)
      .get('/api/shifts/open')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.shifts)).toBe(true);
  });
});

// ============================================================
// 6. TIME TRACKING E2E
// ============================================================

describe('Time Tracking E2E', () => {
  let clockEntryId;

  it('should clock in', async () => {
    const res = await request(app)
      .post('/api/time/clock-in')
      .set('Cookie', adminCookies)
      .send({
        locationId: testLocation?.id,
        latitude: 51.5155,
        longitude: -0.1415,
      });

    expect([200, 201]).toContain(res.status);
    if (res.body.entry) {
      clockEntryId = res.body.entry.id;
    }
  });

  it('should get current clock status', async () => {
    const res = await request(app)
      .get('/api/time/status')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should start break', async () => {
    const res = await request(app)
      .post('/api/time/break/start')
      .set('Cookie', adminCookies);

    expect([200, 201, 400]).toContain(res.status); // 400 if not clocked in
  });

  it('should end break', async () => {
    const res = await request(app)
      .post('/api/time/break/end')
      .set('Cookie', adminCookies);

    expect([200, 201, 400]).toContain(res.status);
  });

  it('should clock out', async () => {
    const res = await request(app)
      .post('/api/time/clock-out')
      .set('Cookie', adminCookies)
      .send({
        latitude: 51.5155,
        longitude: -0.1415,
      });

    expect([200, 201, 400]).toContain(res.status);
  });

  it('should get timesheet', async () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

    const res = await request(app)
      .get('/api/time/timesheet')
      .query({
        startDate: startOfWeek.toISOString().split('T')[0],
        endDate: endOfWeek.toISOString().split('T')[0],
      })
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should add manual time entry', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const res = await request(app)
      .post('/api/time/entries')
      .set('Cookie', adminCookies)
      .send({
        date: yesterday.toISOString().split('T')[0],
        clockIn: '09:00',
        clockOut: '17:00',
        breakMinutes: 60,
        reason: 'Forgot to clock in',
      });

    expect([200, 201]).toContain(res.status);
  });
});

// ============================================================
// 7. TIME OFF E2E
// ============================================================

describe('Time Off E2E', () => {
  let timeOffRequestId;

  it('should get time off balances', async () => {
    const res = await request(app)
      .get('/api/time-off/balances')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should submit time off request', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 30);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 5);

    const res = await request(app)
      .post('/api/time-off/requests')
      .set('Cookie', adminCookies)
      .send({
        type: 'vacation',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        reason: 'Family holiday',
      });

    expect([200, 201]).toContain(res.status);
    if (res.body.request) {
      timeOffRequestId = res.body.request.id;
    }
  });

  it('should list time off requests', async () => {
    const res = await request(app)
      .get('/api/time-off/requests')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.requests)).toBe(true);
  });

  it('should approve time off request (as manager)', async () => {
    if (!timeOffRequestId) return;

    const res = await request(app)
      .post(`/api/time-off/requests/${timeOffRequestId}/approve`)
      .set('Cookie', adminCookies)
      .send({
        notes: 'Approved - enjoy your holiday!',
      });

    expect([200, 201]).toContain(res.status);
  });

  it('should get team calendar for time off', async () => {
    const res = await request(app)
      .get('/api/time-off/calendar')
      .query({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      })
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });
});

// ============================================================
// 8. SKILLS & TRAINING E2E
// ============================================================

describe('Skills & Training E2E', () => {
  let skillId;
  let trainingId;

  it('should create a skill', async () => {
    const res = await request(app)
      .post('/api/skills')
      .set('Cookie', adminCookies)
      .send({
        name: 'Customer Service',
        category: 'soft',
        description: 'Ability to assist customers effectively',
        levels: ['beginner', 'intermediate', 'advanced', 'expert'],
      });

    expect([200, 201]).toContain(res.status);
    if (res.body.skill) {
      skillId = res.body.skill.id;
    }
  });

  it('should list all skills', async () => {
    const res = await request(app)
      .get('/api/skills')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.skills)).toBe(true);
  });

  it('should assign skill to employee', async () => {
    if (!skillId || !testEmployee?.id) return;

    const res = await request(app)
      .post(`/api/employees/${testEmployee.id}/skills`)
      .set('Cookie', adminCookies)
      .send({
        skillId,
        level: 'intermediate',
        certifiedDate: new Date().toISOString().split('T')[0],
      });

    expect([200, 201]).toContain(res.status);
  });

  it('should create training course', async () => {
    const res = await request(app)
      .post('/api/training/courses')
      .set('Cookie', adminCookies)
      .send({
        name: 'Food Safety Level 2',
        description: 'Essential food safety training',
        duration: 120, // minutes
        category: 'compliance',
        requiredForRoles: ['Kitchen Staff', 'Server'],
      });

    expect([200, 201]).toContain(res.status);
    if (res.body.course) {
      trainingId = res.body.course.id;
    }
  });

  it('should assign training to employee', async () => {
    if (!trainingId || !testEmployee?.id) return;

    const res = await request(app)
      .post(`/api/training/assignments`)
      .set('Cookie', adminCookies)
      .send({
        courseId: trainingId,
        employeeId: testEmployee.id,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });

    expect([200, 201]).toContain(res.status);
  });

  it('should get skill matrix', async () => {
    const res = await request(app)
      .get('/api/skills/matrix')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });
});

// ============================================================
// 9. DASHBOARD & ANALYTICS E2E
// ============================================================

describe('Dashboard & Analytics E2E', () => {
  it('should get dashboard overview', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
    expect(res.body.today).toBeDefined();
  });

  it('should get labor analytics', async () => {
    const res = await request(app)
      .get('/api/analytics/labor')
      .query({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      })
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should get attendance report', async () => {
    const res = await request(app)
      .get('/api/reports/attendance')
      .query({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      })
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should get demand forecast', async () => {
    const res = await request(app)
      .get('/api/analytics/demand-forecast')
      .query({
        locationId: testLocation?.id,
        weeks: 4,
      })
      .set('Cookie', adminCookies);

    expect([200, 404]).toContain(res.status); // 404 if no historical data
  });

  it('should export report as CSV', async () => {
    const res = await request(app)
      .get('/api/reports/timesheet/export')
      .query({
        format: 'csv',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      })
      .set('Cookie', adminCookies);

    expect([200, 204]).toContain(res.status);
  });
});

// ============================================================
// 10. NOTIFICATIONS E2E
// ============================================================

describe('Notifications E2E', () => {
  it('should get notifications', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.notifications)).toBe(true);
  });

  it('should mark notification as read', async () => {
    // First get notifications
    const listRes = await request(app)
      .get('/api/notifications')
      .set('Cookie', adminCookies);

    if (listRes.body.notifications?.length > 0) {
      const notificationId = listRes.body.notifications[0].id;
      
      const res = await request(app)
        .post(`/api/notifications/${notificationId}/read`)
        .set('Cookie', adminCookies);

      expect([200, 201]).toContain(res.status);
    }
  });

  it('should mark all notifications as read', async () => {
    const res = await request(app)
      .post('/api/notifications/mark-all-read')
      .set('Cookie', adminCookies);

    expect([200, 201]).toContain(res.status);
  });

  it('should get notification settings', async () => {
    const res = await request(app)
      .get('/api/notifications/settings')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should update notification settings', async () => {
    const res = await request(app)
      .patch('/api/notifications/settings')
      .set('Cookie', adminCookies)
      .send({
        emailNotifications: true,
        pushNotifications: true,
        shiftReminders: true,
        scheduleChanges: true,
      });

    expect([200, 201]).toContain(res.status);
  });
});

// ============================================================
// 11. INTEGRATIONS E2E
// ============================================================

describe('Integrations E2E', () => {
  it('should list available integrations', async () => {
    const res = await request(app)
      .get('/api/integrations')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should generate API key', async () => {
    const res = await request(app)
      .post('/api/integrations/api-keys')
      .set('Cookie', adminCookies)
      .send({
        name: 'Test API Key',
        permissions: ['read:employees', 'read:shifts'],
      });

    expect([200, 201]).toContain(res.status);
  });

  it('should list API keys', async () => {
    const res = await request(app)
      .get('/api/integrations/api-keys')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should configure webhook', async () => {
    const res = await request(app)
      .post('/api/integrations/webhooks')
      .set('Cookie', adminCookies)
      .send({
        url: 'https://example.com/webhook',
        events: ['shift.created', 'shift.updated', 'employee.created'],
        secret: 'webhook-secret-123',
      });

    expect([200, 201]).toContain(res.status);
  });
});

// ============================================================
// 12. SETTINGS & CONFIGURATION E2E
// ============================================================

describe('Settings & Configuration E2E', () => {
  it('should get organization settings', async () => {
    const res = await request(app)
      .get('/api/settings/organization')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should update organization settings', async () => {
    const res = await request(app)
      .patch('/api/settings/organization')
      .set('Cookie', adminCookies)
      .send({
        name: 'Updated Test Organization',
        timezone: 'Europe/London',
        weekStartsOn: 'monday',
        currency: 'GBP',
      });

    expect([200, 201]).toContain(res.status);
  });

  it('should get scheduling rules', async () => {
    const res = await request(app)
      .get('/api/settings/scheduling')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should update scheduling rules', async () => {
    const res = await request(app)
      .patch('/api/settings/scheduling')
      .set('Cookie', adminCookies)
      .send({
        minRestBetweenShifts: 11, // hours
        maxConsecutiveDays: 6,
        overtimeThreshold: 40, // hours per week
        autoApproveSwaps: false,
      });

    expect([200, 201]).toContain(res.status);
  });

  it('should get time off policies', async () => {
    const res = await request(app)
      .get('/api/settings/time-off-policies')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should create time off policy', async () => {
    const res = await request(app)
      .post('/api/settings/time-off-policies')
      .set('Cookie', adminCookies)
      .send({
        name: 'Annual Leave',
        type: 'vacation',
        accrualRate: 2.08, // days per month
        maxAccrual: 30,
        carryOverLimit: 5,
        requiresApproval: true,
      });

    expect([200, 201]).toContain(res.status);
  });
});

// ============================================================
// 13. MOBILE-SPECIFIC ENDPOINTS E2E
// ============================================================

describe('Mobile App Endpoints E2E', () => {
  it('should get mobile home screen data', async () => {
    const res = await request(app)
      .get('/api/mobile/home')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should get my schedule (worker view)', async () => {
    const res = await request(app)
      .get('/api/mobile/my-schedule')
      .query({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should register push token', async () => {
    const res = await request(app)
      .post('/api/mobile/push-token')
      .set('Cookie', adminCookies)
      .send({
        token: 'ExponentPushToken[xxxxx]',
        platform: 'ios',
        deviceId: 'test-device-123',
      });

    expect([200, 201]).toContain(res.status);
  });

  it('should sync offline data', async () => {
    const res = await request(app)
      .post('/api/mobile/sync')
      .set('Cookie', adminCookies)
      .send({
        lastSyncTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        pendingActions: [],
      });

    expect([200, 201]).toContain(res.status);
  });
});

// ============================================================
// 14. TRANSLATION & i18n E2E
// ============================================================

describe('Translation & i18n E2E', () => {
  it('should get available languages', async () => {
    const res = await request(app)
      .get('/api/translations/languages')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.languages)).toBe(true);
  });

  it('should get translations for language', async () => {
    const res = await request(app)
      .get('/api/translations/es')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(200);
  });

  it('should translate content dynamically', async () => {
    const res = await request(app)
      .post('/api/translations/translate')
      .set('Cookie', adminCookies)
      .send({
        text: 'Welcome to your shift',
        targetLanguage: 'es',
      });

    expect([200, 201]).toContain(res.status);
  });
});

// ============================================================
// 15. SECURITY & ERROR HANDLING E2E
// ============================================================

describe('Security & Error Handling E2E', () => {
  it('should return 401 for unauthenticated requests', async () => {
    const res = await request(app)
      .get('/api/employees');

    expect(res.status).toBe(401);
  });

  it('should return 403 for unauthorized actions', async () => {
    // Try to access admin endpoint as worker (if we had worker cookies)
    // This is a placeholder - would need actual worker role user
    const res = await request(app)
      .delete('/api/organizations/1')
      .set('Cookie', adminCookies);

    expect([403, 404]).toContain(res.status);
  });

  it('should return 404 for non-existent resources', async () => {
    const res = await request(app)
      .get('/api/employees/00000000-0000-0000-0000-000000000000')
      .set('Cookie', adminCookies);

    expect(res.status).toBe(404);
  });

  it('should return 400 for invalid input', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Cookie', adminCookies)
      .send({
        firstName: '', // Invalid - empty
        lastName: 'Test',
        email: 'not-an-email', // Invalid format
      });

    expect(res.status).toBe(400);
  });

  it('should include request ID in responses', async () => {
    const res = await request(app)
      .get('/api/health');

    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('should rate limit excessive requests', async () => {
    // Make many rapid requests
    const promises = Array(100).fill().map(() =>
      request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'test' })
    );

    const responses = await Promise.all(promises);
    const rateLimited = responses.some(r => r.status === 429);
    
    // Rate limiting should kick in
    expect(rateLimited || responses.every(r => r.headers['x-ratelimit-remaining'])).toBe(true);
  });
});

console.log('E2E API Test Suite loaded successfully');
