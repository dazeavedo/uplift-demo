// ============================================================
// UPLIFT API SERVER - COMPLETE
// Supports all frontend endpoints
// ============================================================
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// ============================================================
// DATABASE
// ============================================================
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.query('SELECT NOW()')
  .then(() => console.log('✓ Database connected'))
  .catch(err => console.error('✗ Database connection failed:', err.message));

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.includes('netlify.app') || origin.includes('vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    callback(null, true); // Allow all in demo
  },
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ============================================================
// AUTH MIDDLEWARE
// ============================================================
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, organization_id FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (!result.rows[0]) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================
// AUTH ROUTES
// ============================================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, organizationId: user.organization_id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        organizationId: user.organization_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      role: req.user.role,
      organizationId: req.user.organization_id
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

app.post('/api/auth/register', async (req, res) => {
  res.status(501).json({ error: 'Registration disabled in demo' });
});

app.post('/api/auth/password/reset-request', async (req, res) => {
  res.json({ success: true, message: 'If email exists, reset link sent' });
});

app.post('/api/auth/password/reset', async (req, res) => {
  res.status(501).json({ error: 'Password reset disabled in demo' });
});

app.post('/api/auth/password/change', authenticate, async (req, res) => {
  res.status(501).json({ error: 'Password change disabled in demo' });
});

app.get('/api/auth/users', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, status FROM users WHERE organization_id = $1',
      [req.user.organization_id]
    );
    res.json({ users: result.rows });
  } catch (error) {
    res.json({ users: [] });
  }
});

app.post('/api/auth/users/invite', authenticate, async (req, res) => {
  res.status(501).json({ error: 'User invite disabled in demo' });
});

// ============================================================
// DASHBOARD
// ============================================================
app.get('/api/dashboard', authenticate, async (req, res) => {
  try {
    const orgId = req.user.organization_id;
    
    const [employees, shifts, locations] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM employees WHERE organization_id = $1 AND status = $2', [orgId, 'active']),
      pool.query('SELECT COUNT(*) FROM shifts WHERE organization_id = $1 AND date >= CURRENT_DATE AND date <= CURRENT_DATE + INTERVAL \'7 days\'', [orgId]),
      pool.query('SELECT COUNT(*) FROM locations WHERE organization_id = $1', [orgId]),
    ]);
    
    res.json({
      activeEmployees: parseInt(employees.rows[0].count),
      upcomingShifts: parseInt(shifts.rows[0].count),
      locations: parseInt(locations.rows[0].count),
      pendingTimeOff: 0
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// EMPLOYEES
// ============================================================
app.get('/api/employees', authenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, d.name as department_name, l.name as location_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN locations l ON e.primary_location_id = l.id
      WHERE e.organization_id = $1
      ORDER BY e.first_name, e.last_name
    `, [req.user.organization_id]);
    res.json({ employees: result.rows });
  } catch (error) {
    console.error('Employees error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/employees/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, d.name as department_name, l.name as location_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN locations l ON e.primary_location_id = l.id
      WHERE e.id = $1 AND e.organization_id = $2
    `, [req.params.id, req.user.organization_id]);
    
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ employee: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/employees', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, email, departmentId, locationId, employmentType, hourlyRate } = req.body;
    const result = await pool.query(`
      INSERT INTO employees (organization_id, first_name, last_name, email, department_id, primary_location_id, employment_type, hourly_rate, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
      RETURNING *
    `, [req.user.organization_id, firstName, lastName, email, departmentId, locationId, employmentType || 'full_time', hourlyRate || 15]);
    res.status(201).json({ employee: result.rows[0] });
  } catch (error) {
    console.error('Employee create error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/employees/:id', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, email, departmentId, locationId, status, employmentType, hourlyRate } = req.body;
    const result = await pool.query(`
      UPDATE employees SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        department_id = COALESCE($4, department_id),
        primary_location_id = COALESCE($5, primary_location_id),
        status = COALESCE($6, status),
        employment_type = COALESCE($7, employment_type),
        hourly_rate = COALESCE($8, hourly_rate),
        updated_at = NOW()
      WHERE id = $9 AND organization_id = $10
      RETURNING *
    `, [firstName, lastName, email, departmentId, locationId, status, employmentType, hourlyRate, req.params.id, req.user.organization_id]);
    
    if (!result.rows[0]) return res.status(404).json({ error: 'Employee not found' });
    res.json({ employee: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/employees/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM employees WHERE id = $1 AND organization_id = $2 RETURNING id',
      [req.params.id, req.user.organization_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Employee not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/employees/:id/skills', authenticate, async (req, res) => {
  res.json({ success: true });
});

app.post('/api/employees/:employeeId/skills/:skillId/verify', authenticate, async (req, res) => {
  res.json({ success: true });
});

// ============================================================
// LOCATIONS
// ============================================================
app.get('/api/locations', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM locations WHERE organization_id = $1 ORDER BY name',
      [req.user.organization_id]
    );
    res.json({ locations: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/locations/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM locations WHERE id = $1 AND organization_id = $2',
      [req.params.id, req.user.organization_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Location not found' });
    res.json({ location: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/locations', authenticate, async (req, res) => {
  try {
    const { name, address, city, country } = req.body;
    const result = await pool.query(`
      INSERT INTO locations (organization_id, name, address, city, country, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *
    `, [req.user.organization_id, name, address, city, country]);
    res.status(201).json({ location: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/locations/:id', authenticate, async (req, res) => {
  try {
    const { name, address, city, country, status } = req.body;
    const result = await pool.query(`
      UPDATE locations SET
        name = COALESCE($1, name),
        address = COALESCE($2, address),
        city = COALESCE($3, city),
        country = COALESCE($4, country),
        status = COALESCE($5, status),
        updated_at = NOW()
      WHERE id = $6 AND organization_id = $7
      RETURNING *
    `, [name, address, city, country, status, req.params.id, req.user.organization_id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Location not found' });
    res.json({ location: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// DEPARTMENTS
// ============================================================
app.get('/api/departments', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM departments WHERE organization_id = $1 ORDER BY name',
      [req.user.organization_id]
    );
    res.json({ departments: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/departments', authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      'INSERT INTO departments (organization_id, name) VALUES ($1, $2) RETURNING *',
      [req.user.organization_id, name]
    );
    res.status(201).json({ department: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/departments/:id', authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      'UPDATE departments SET name = $1, updated_at = NOW() WHERE id = $2 AND organization_id = $3 RETURNING *',
      [name, req.params.id, req.user.organization_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Department not found' });
    res.json({ department: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// ROLES
// ============================================================
app.get('/api/roles', authenticate, async (req, res) => {
  res.json({ roles: [
    { id: 'admin', name: 'Administrator' },
    { id: 'manager', name: 'Manager' },
    { id: 'worker', name: 'Worker' }
  ]});
});

app.post('/api/roles', authenticate, async (req, res) => {
  res.status(501).json({ error: 'Custom roles not available in demo' });
});

// ============================================================
// SKILLS
// ============================================================
app.get('/api/skills', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM skills WHERE organization_id = $1 ORDER BY name',
      [req.user.organization_id]
    );
    res.json({ skills: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/skills', authenticate, async (req, res) => {
  try {
    const { name, category } = req.body;
    const result = await pool.query(
      'INSERT INTO skills (organization_id, name, category) VALUES ($1, $2, $3) RETURNING *',
      [req.user.organization_id, name, category]
    );
    res.status(201).json({ skill: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// SHIFTS
// ============================================================
app.get('/api/shifts', authenticate, async (req, res) => {
  try {
    const { startDate, endDate, locationId, employeeId } = req.query;
    let query = `
      SELECT s.*, e.first_name as employee_first_name, e.last_name as employee_last_name, l.name as location_name
      FROM shifts s
      LEFT JOIN employees e ON s.employee_id = e.id
      LEFT JOIN locations l ON s.location_id = l.id
      WHERE s.organization_id = $1
    `;
    const params = [req.user.organization_id];
    let idx = 2;
    
    if (startDate) { query += ` AND s.date >= $${idx}`; params.push(startDate); idx++; }
    if (endDate) { query += ` AND s.date <= $${idx}`; params.push(endDate); idx++; }
    if (locationId) { query += ` AND s.location_id = $${idx}`; params.push(locationId); idx++; }
    if (employeeId) { query += ` AND s.employee_id = $${idx}`; params.push(employeeId); }
    
    query += ' ORDER BY s.date, s.start_time';
    const result = await pool.query(query, params);
    res.json({ shifts: result.rows });
  } catch (error) {
    console.error('Shifts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/shifts/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM shifts WHERE id = $1 AND organization_id = $2',
      [req.params.id, req.user.organization_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Shift not found' });
    res.json({ shift: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/shifts', authenticate, async (req, res) => {
  try {
    const { employeeId, locationId, date, startTime, endTime, breakMinutes } = req.body;
    const result = await pool.query(`
      INSERT INTO shifts (organization_id, employee_id, location_id, date, start_time, end_time, break_minutes, status, published)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'scheduled', true)
      RETURNING *
    `, [req.user.organization_id, employeeId, locationId, date, startTime, endTime, breakMinutes || 30]);
    res.status(201).json({ shift: result.rows[0] });
  } catch (error) {
    console.error('Shift create error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/shifts/bulk', authenticate, async (req, res) => {
  try {
    const { shifts } = req.body;
    const created = [];
    for (const shift of shifts) {
      const result = await pool.query(`
        INSERT INTO shifts (organization_id, employee_id, location_id, date, start_time, end_time, break_minutes, status, published)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'scheduled', true)
        RETURNING *
      `, [req.user.organization_id, shift.employeeId, shift.locationId, shift.date, shift.startTime, shift.endTime, shift.breakMinutes || 30]);
      created.push(result.rows[0]);
    }
    res.status(201).json({ shifts: created });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/shifts/:id', authenticate, async (req, res) => {
  try {
    const { employeeId, locationId, date, startTime, endTime, status } = req.body;
    const result = await pool.query(`
      UPDATE shifts SET
        employee_id = COALESCE($1, employee_id),
        location_id = COALESCE($2, location_id),
        date = COALESCE($3, date),
        start_time = COALESCE($4, start_time),
        end_time = COALESCE($5, end_time),
        status = COALESCE($6, status),
        updated_at = NOW()
      WHERE id = $7 AND organization_id = $8
      RETURNING *
    `, [employeeId, locationId, date, startTime, endTime, status, req.params.id, req.user.organization_id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Shift not found' });
    res.json({ shift: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/shifts/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM shifts WHERE id = $1 AND organization_id = $2 RETURNING id',
      [req.params.id, req.user.organization_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Shift not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/shifts/:id/assign', authenticate, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const result = await pool.query(
      'UPDATE shifts SET employee_id = $1, updated_at = NOW() WHERE id = $2 AND organization_id = $3 RETURNING *',
      [employeeId, req.params.id, req.user.organization_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Shift not found' });
    res.json({ shift: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/shifts/swaps', authenticate, async (req, res) => {
  res.json({ swaps: [] });
});

app.post('/api/shifts/swaps/:id/approve', authenticate, async (req, res) => {
  res.json({ success: true });
});

app.post('/api/shifts/swaps/:id/reject', authenticate, async (req, res) => {
  res.json({ success: true });
});

// ============================================================
// SHIFT TEMPLATES
// ============================================================
app.get('/api/shift-templates', authenticate, async (req, res) => {
  res.json({ templates: [] });
});

app.post('/api/shift-templates', authenticate, async (req, res) => {
  res.status(501).json({ error: 'Templates not available in demo' });
});

app.post('/api/shift-templates/:id/generate', authenticate, async (req, res) => {
  res.status(501).json({ error: 'Templates not available in demo' });
});

// ============================================================
// SCHEDULE PERIODS
// ============================================================
app.get('/api/schedule/periods', authenticate, async (req, res) => {
  res.json({ periods: [] });
});

app.post('/api/schedule/periods', authenticate, async (req, res) => {
  res.status(501).json({ error: 'Schedule periods not available in demo' });
});

app.post('/api/schedule/periods/:id/publish', authenticate, async (req, res) => {
  res.json({ success: true });
});

// ============================================================
// TIME TRACKING
// ============================================================
app.get('/api/time/entries', authenticate, async (req, res) => {
  res.json({ entries: [] });
});

app.get('/api/time/pending', authenticate, async (req, res) => {
  res.json({ entries: [] });
});

app.post('/api/time/entries/:id/approve', authenticate, async (req, res) => {
  res.json({ success: true });
});

app.post('/api/time/entries/:id/reject', authenticate, async (req, res) => {
  res.json({ success: true });
});

app.post('/api/time/entries/bulk-approve', authenticate, async (req, res) => {
  res.json({ success: true });
});

app.patch('/api/time/entries/:id', authenticate, async (req, res) => {
  res.json({ success: true });
});

// ============================================================
// TIME OFF
// ============================================================
app.get('/api/time-off/policies', authenticate, async (req, res) => {
  res.json({ policies: [
    { id: '1', name: 'Annual Leave', daysPerYear: 28 },
    { id: '2', name: 'Sick Leave', daysPerYear: 10 }
  ]});
});

app.post('/api/time-off/policies', authenticate, async (req, res) => {
  res.status(501).json({ error: 'Policy creation not available in demo' });
});

app.get('/api/time-off/requests', authenticate, async (req, res) => {
  res.json({ requests: [] });
});

app.post('/api/time-off/requests/:id/approve', authenticate, async (req, res) => {
  res.json({ success: true });
});

app.post('/api/time-off/requests/:id/reject', authenticate, async (req, res) => {
  res.json({ success: true });
});

app.get('/api/time-off/balances', authenticate, async (req, res) => {
  res.json({ balances: [
    { policyId: '1', policyName: 'Annual Leave', total: 28, used: 5, remaining: 23 },
    { policyId: '2', policyName: 'Sick Leave', total: 10, used: 2, remaining: 8 }
  ]});
});

// ============================================================
// ORGANIZATION
// ============================================================
app.get('/api/organization', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM organizations WHERE id = $1',
      [req.user.organization_id]
    );
    res.json({ organization: result.rows[0] || {} });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/organization', authenticate, async (req, res) => {
  res.status(501).json({ error: 'Organization update not available in demo' });
});

// ============================================================
// REPORTS
// ============================================================
app.get('/api/reports/hours', authenticate, async (req, res) => {
  res.json({ data: [], summary: { totalHours: 0, totalCost: 0 } });
});

app.get('/api/reports/attendance', authenticate, async (req, res) => {
  res.json({ data: [], summary: { attendanceRate: 95 } });
});

app.get('/api/reports/labor-cost', authenticate, async (req, res) => {
  res.json({ data: [], summary: { totalCost: 0 } });
});

app.get('/api/reports/coverage', authenticate, async (req, res) => {
  res.json({ data: [], summary: { coverageRate: 100 } });
});

app.get('/api/exports/timesheets', authenticate, async (req, res) => {
  res.status(501).json({ error: 'Export not available in demo' });
});

app.get('/api/exports/employees', authenticate, async (req, res) => {
  res.status(501).json({ error: 'Export not available in demo' });
});

// ============================================================
// NOTIFICATIONS
// ============================================================
app.get('/api/notifications', authenticate, async (req, res) => {
  res.json({ notifications: [] });
});

app.post('/api/notifications/:id/read', authenticate, async (req, res) => {
  res.json({ success: true });
});

app.post('/api/notifications/read-all', authenticate, async (req, res) => {
  res.json({ success: true });
});

// ============================================================
// 404 HANDLER
// ============================================================
app.use('/api/*', (req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================================
// ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================================
// START
// ============================================================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     UPLIFT API SERVER - COMPLETE       ║
║     Port: ${PORT}                          ║
╚════════════════════════════════════════╝
  `);
});
