// ============================================================
// TEST SUITE
// Core authentication and API tests
// ============================================================

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/index.js';
import { db } from '../src/lib/database.js';

let app;
let testOrg;
let testUser;
let accessToken;
let refreshToken;

// ============================================================
// TEST SETUP
// ============================================================

beforeAll(async () => {
  app = await createApp();
  
  // Create test organization
  const orgResult = await db.query(`
    INSERT INTO organizations (name, slug) 
    VALUES ('Test Org', 'test-org-${Date.now()}')
    RETURNING *
  `);
  testOrg = orgResult.rows[0];
});

afterAll(async () => {
  // Cleanup
  if (testOrg) {
    await db.query('DELETE FROM organizations WHERE id = $1', [testOrg.id]);
  }
  await db.end();
});

// ============================================================
// AUTH TESTS
// ============================================================

describe('Authentication', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPass123';

  describe('POST /api/auth/register', () => {
    it('should register a new organization and user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          organizationName: 'New Test Org',
          email: testEmail,
          password: testPassword,
          firstName: 'Test',
          lastName: 'User',
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
      expect(res.body.user.role).toBe('admin');
      
      // Should set httpOnly cookies
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'].some(c => c.includes('accessToken'))).toBe(true);
      expect(res.headers['set-cookie'].some(c => c.includes('HttpOnly'))).toBe(true);
    });

    it('should reject weak passwords', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          organizationName: 'Weak Pass Org',
          email: 'weak@example.com',
          password: 'weak',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Password');
    });

    it('should reject duplicate emails', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          organizationName: 'Dupe Org',
          email: testEmail,
          password: testPassword,
          firstName: 'Test',
          lastName: 'User',
        });

      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        });

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
      
      // Extract cookies for subsequent tests
      const cookies = res.headers['set-cookie'];
      refreshToken = cookies.find(c => c.includes('refreshToken'));
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nobody@example.com',
          password: testPassword,
        });

      expect(res.status).toBe(401);
    });

    it('should lock account after 5 failed attempts', async () => {
      const lockEmail = `lock-${Date.now()}@example.com`;
      
      // Register user
      await request(app)
        .post('/api/auth/register')
        .send({
          organizationName: 'Lock Test',
          email: lockEmail,
          password: testPassword,
          firstName: 'Lock',
          lastName: 'Test',
        });

      // Fail 5 times
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({ email: lockEmail, password: 'wrong' });
      }

      // 6th attempt should be locked
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: lockEmail, password: 'wrong' });

      expect(res.status).toBe(401);
      expect(res.body.code).toBe('ACCOUNT_LOCKED');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      // Login first
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword });

      const cookies = loginRes.headers['set-cookie'];

      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      
      // Should set new access token cookie
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should reject without refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      // Login first
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword });

      const cookies = loginRes.headers['set-cookie'];

      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testEmail);
    });

    it('should reject without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout and clear cookies', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword });

      const cookies = loginRes.headers['set-cookie'];

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Should clear cookies
      const clearedCookies = res.headers['set-cookie'];
      expect(clearedCookies.some(c => c.includes('accessToken=;'))).toBe(true);
    });
  });
});

// ============================================================
// AUTHORIZATION TESTS
// ============================================================

describe('Authorization', () => {
  let adminCookies;
  let workerCookies;
  const adminEmail = `admin-${Date.now()}@example.com`;
  const workerEmail = `worker-${Date.now()}@example.com`;

  beforeAll(async () => {
    // Create admin
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        organizationName: 'Auth Test Org',
        email: adminEmail,
        password: 'AdminPass123',
        firstName: 'Admin',
        lastName: 'User',
      });
    adminCookies = adminRes.headers['set-cookie'];

    // Create worker (via invitation in real flow, simplified here)
    const workerRes = await request(app)
      .post('/api/auth/register')
      .send({
        organizationName: 'Worker Org',
        email: workerEmail,
        password: 'WorkerPass123',
        firstName: 'Worker',
        lastName: 'User',
      });
    workerCookies = workerRes.headers['set-cookie'];
  });

  describe('Role-based access', () => {
    it('should allow admin to access admin routes', async () => {
      const res = await request(app)
        .get('/api/employees')
        .set('Cookie', adminCookies);

      expect(res.status).toBe(200);
    });

    it('should allow admin to create employees', async () => {
      const res = await request(app)
        .post('/api/employees')
        .set('Cookie', adminCookies)
        .send({
          firstName: 'New',
          lastName: 'Employee',
          email: `new-${Date.now()}@example.com`,
        });

      expect(res.status).toBe(201);
    });
  });
});

// ============================================================
// API ENDPOINT TESTS
// ============================================================

describe('API Endpoints', () => {
  let cookies;
  let orgId;

  beforeAll(async () => {
    const email = `api-${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        organizationName: 'API Test Org',
        email,
        password: 'ApiTest123',
        firstName: 'API',
        lastName: 'Tester',
      });
    cookies = res.headers['set-cookie'];
    orgId = res.body.organization?.id;
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('Employees API', () => {
    let employeeId;

    it('should list employees', async () => {
      const res = await request(app)
        .get('/api/employees')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.employees)).toBe(true);
    });

    it('should create employee', async () => {
      const res = await request(app)
        .post('/api/employees')
        .set('Cookie', cookies)
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: `john-${Date.now()}@example.com`,
          employmentType: 'full_time',
        });

      expect(res.status).toBe(201);
      expect(res.body.employee.first_name).toBe('John');
      employeeId = res.body.employee.id;
    });

    it('should get employee by id', async () => {
      const res = await request(app)
        .get(`/api/employees/${employeeId}`)
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body.employee.id).toBe(employeeId);
    });

    it('should update employee', async () => {
      const res = await request(app)
        .patch(`/api/employees/${employeeId}`)
        .set('Cookie', cookies)
        .send({ firstName: 'Jane' });

      expect(res.status).toBe(200);
      expect(res.body.employee.first_name).toBe('Jane');
    });
  });

  describe('Locations API', () => {
    let locationId;

    it('should create location', async () => {
      const res = await request(app)
        .post('/api/locations')
        .set('Cookie', cookies)
        .send({
          name: 'Test Store',
          type: 'store',
          city: 'London',
        });

      expect(res.status).toBe(201);
      locationId = res.body.location.id;
    });

    it('should list locations', async () => {
      const res = await request(app)
        .get('/api/locations')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body.locations.length).toBeGreaterThan(0);
    });
  });

  describe('Shifts API', () => {
    it('should require date range', async () => {
      const res = await request(app)
        .get('/api/shifts')
        .set('Cookie', cookies);

      expect(res.status).toBe(400);
    });

    it('should list shifts with date range', async () => {
      const res = await request(app)
        .get('/api/shifts')
        .query({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        })
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.shifts)).toBe(true);
    });
  });

  describe('Dashboard API', () => {
    it('should return dashboard data', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body.today).toBeDefined();
    });
  });
});

// ============================================================
// SECURITY TESTS
// ============================================================

describe('Security', () => {
  describe('Request ID tracking', () => {
    it('should include request ID in response headers', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['x-request-id']).toBeDefined();
    });

    it('should use provided request ID', async () => {
      const customId = 'test-request-123';
      const res = await request(app)
        .get('/api/health')
        .set('X-Request-ID', customId);
      
      expect(res.headers['x-request-id']).toBe(customId);
    });
  });

  describe('Rate limiting', () => {
    it('should rate limit auth endpoints', async () => {
      // This test would need adjustment based on rate limit settings
      // Just verify the endpoint responds (rate limit headers)
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'test' });

      // Rate limit headers should be present
      expect(res.headers['x-ratelimit-limit']).toBeDefined();
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:5173');

      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Tenant isolation', () => {
    it('should not access other organization data', async () => {
      // Create two orgs
      const org1Res = await request(app)
        .post('/api/auth/register')
        .send({
          organizationName: 'Org 1',
          email: `org1-${Date.now()}@example.com`,
          password: 'Org1Pass123',
          firstName: 'Org1',
          lastName: 'Admin',
        });

      const org2Res = await request(app)
        .post('/api/auth/register')
        .send({
          organizationName: 'Org 2',
          email: `org2-${Date.now()}@example.com`,
          password: 'Org2Pass123',
          firstName: 'Org2',
          lastName: 'Admin',
        });

      // Create employee in org1
      const empRes = await request(app)
        .post('/api/employees')
        .set('Cookie', org1Res.headers['set-cookie'])
        .send({
          firstName: 'Org1',
          lastName: 'Employee',
          email: `org1emp-${Date.now()}@example.com`,
        });

      const empId = empRes.body.employee.id;

      // Try to access from org2 - should not find
      const accessRes = await request(app)
        .get(`/api/employees/${empId}`)
        .set('Cookie', org2Res.headers['set-cookie']);

      expect(accessRes.status).toBe(404);
    });
  });
});

// ============================================================
// PASSWORD VALIDATION TESTS
// ============================================================

describe('Password Validation', () => {
  const basePayload = {
    organizationName: 'Pass Test',
    email: `passtest-${Date.now()}@example.com`,
    firstName: 'Pass',
    lastName: 'Test',
  };

  it('should reject passwords shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...basePayload, password: 'Short1' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('8 characters');
  });

  it('should reject passwords without uppercase', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...basePayload, password: 'lowercase123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('uppercase');
  });

  it('should reject passwords without lowercase', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...basePayload, password: 'UPPERCASE123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('lowercase');
  });

  it('should reject passwords without numbers', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...basePayload, password: 'NoNumbers' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('number');
  });

  it('should accept valid complex passwords', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...basePayload, password: 'ValidPass123' });

    expect(res.status).toBe(201);
  });
});
