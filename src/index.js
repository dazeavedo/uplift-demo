import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3000;

// Database
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(cors({
  origin: ['https://upliftportaldemo.netlify.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, organizationId: user.organization_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, firstName: user.first_name, lastName: user.last_name } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
      [req.user.userId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get employees
app.get('/api/employees', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM employees WHERE organization_id = $1 ORDER BY first_name',
    [req.user.organizationId]
  );
  res.json({ employees: result.rows });
});

// Get shifts
app.get('/api/shifts', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT s.*, e.first_name, e.last_name FROM shifts s LEFT JOIN employees e ON s.employee_id = e.id WHERE s.organization_id = $1 ORDER BY s.date',
    [req.user.organizationId]
  );
  res.json({ shifts: result.rows });
});

// Get locations
app.get('/api/locations', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM locations WHERE organization_id = $1',
    [req.user.organizationId]
  );
  res.json({ locations: result.rows });
});

// Get skills
app.get('/api/skills', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM skills WHERE organization_id = $1',
    [req.user.organizationId]
  );
  res.json({ skills: result.rows });
});

// Dashboard
app.get('/api/dashboard', auth, async (req, res) => {
  const [employees, shifts, locations] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM employees WHERE organization_id = $1 AND status = $2', [req.user.organizationId, 'active']),
    pool.query('SELECT COUNT(*) FROM shifts WHERE organization_id = $1 AND date >= CURRENT_DATE', [req.user.organizationId]),
    pool.query('SELECT COUNT(*) FROM locations WHERE organization_id = $1', [req.user.organizationId]),
  ]);
  res.json({
    activeEmployees: parseInt(employees.rows[0].count),
    upcomingShifts: parseInt(shifts.rows[0].count),
    locations: parseInt(locations.rows[0].count),
  });
});

app.listen(PORT, () => {
  console.log(`Uplift API running on port ${PORT}`);
});
