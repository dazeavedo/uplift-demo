# Database Schema

## Overview

Uplift uses PostgreSQL 15+ with the following extensions:
- `uuid-ossp` - UUID generation
- `pgcrypto` - Encryption functions

---

## Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐
│  organizations   │───────│      users       │
│                  │       │                  │
│  id (PK)         │       │  id (PK)         │
│  name            │       │  organization_id │
│  slug            │       │  email           │
│  settings        │       │  password_hash   │
│  billing_email   │       │  role            │
└────────┬─────────┘       │  employee_id     │
         │                 └────────┬─────────┘
         │                          │
         ▼                          ▼
┌──────────────────┐       ┌──────────────────┐
│    locations     │       │    employees     │
│                  │       │                  │
│  id (PK)         │       │  id (PK)         │
│  organization_id │       │  organization_id │
│  name            │       │  user_id         │
│  address         │       │  first_name      │
│  lat/lng         │       │  last_name       │
│  geofence_radius │       │  hourly_rate     │
└────────┬─────────┘       │  manager_id      │
         │                 └────────┬─────────┘
         │                          │
         ▼                          ▼
┌──────────────────┐       ┌──────────────────┐
│      roles       │       │     shifts       │
│                  │       │                  │
│  id (PK)         │◀──────│  id (PK)         │
│  organization_id │       │  organization_id │
│  name            │       │  location_id     │
│  color           │       │  role_id         │
│  hourly_rate     │       │  employee_id     │
└──────────────────┘       │  date            │
                           │  start_time      │
                           │  end_time        │
                           └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │   time_entries   │
                           │                  │
                           │  id (PK)         │
                           │  employee_id     │
                           │  shift_id        │
                           │  clock_in        │
                           │  clock_out       │
                           │  status          │
                           └──────────────────┘
```

---

## Core Tables

### organizations

The root tenant table. All data is scoped to an organization.

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  billing_email VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### users

Authentication and authorization records.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'worker',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  avatar_url VARCHAR(500),
  email_verified BOOLEAN DEFAULT FALSE,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  employee_id UUID REFERENCES employees(id),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(email),
  CHECK (role IN ('worker', 'manager', 'admin', 'superadmin'))
);

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
```

### employees

HR records for workers (may or may not have user login).

```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  hire_date DATE,
  termination_date DATE,
  job_title VARCHAR(255),
  hourly_rate DECIMAL(10,2),
  employment_type VARCHAR(50) DEFAULT 'full_time',
  status VARCHAR(50) DEFAULT 'active',
  manager_id UUID REFERENCES employees(id),
  primary_location_id UUID REFERENCES locations(id),
  primary_role_id UUID REFERENCES roles(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (status IN ('active', 'inactive', 'terminated')),
  CHECK (employment_type IN ('full_time', 'part_time', 'contractor', 'seasonal'))
);

CREATE INDEX idx_employees_org ON employees(organization_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_manager ON employees(manager_id);
```

### locations

Physical work locations.

```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'United Kingdom',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  geofence_radius INTEGER DEFAULT 100, -- meters
  timezone VARCHAR(50) DEFAULT 'Europe/London',
  settings JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locations_org ON locations(organization_id);
```

### roles

Job roles (not auth roles).

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6366F1',
  default_hourly_rate DECIMAL(10,2),
  required_skills JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_roles_org ON roles(organization_id);
```

---

## Scheduling Tables

### shifts

Individual shift assignments.

```sql
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  employee_id UUID REFERENCES employees(id),
  date DATE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  break_minutes INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'scheduled',
  is_open BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  color VARCHAR(7),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'))
);

CREATE INDEX idx_shifts_org_date ON shifts(organization_id, date);
CREATE INDEX idx_shifts_employee ON shifts(employee_id);
CREATE INDEX idx_shifts_location ON shifts(location_id);
CREATE INDEX idx_shifts_open ON shifts(is_open) WHERE is_open = TRUE;
```

### shift_templates

Reusable shift patterns.

```sql
CREATE TABLE shift_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location_id UUID REFERENCES locations(id),
  role_id UUID REFERENCES roles(id),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_minutes INTEGER DEFAULT 0,
  days_of_week INTEGER[] DEFAULT '{}', -- 0=Sun, 6=Sat
  color VARCHAR(7),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### shift_swaps

Shift swap requests between employees.

```sql
CREATE TABLE shift_swaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  shift_id UUID NOT NULL REFERENCES shifts(id),
  requester_id UUID NOT NULL REFERENCES employees(id),
  target_id UUID REFERENCES employees(id),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled'))
);

CREATE INDEX idx_swaps_status ON shift_swaps(status);
```

---

## Time Tracking Tables

### time_entries

Clock in/out records.

```sql
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id),
  shift_id UUID REFERENCES shifts(id),
  location_id UUID REFERENCES locations(id),
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  break_minutes INTEGER DEFAULT 0,
  location_in JSONB, -- {lat, lng, accuracy}
  location_out JSONB,
  photo_in_url VARCHAR(500),
  photo_out_url VARCHAR(500),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (status IN ('pending', 'approved', 'rejected', 'auto_approved'))
);

CREATE INDEX idx_time_entries_employee ON time_entries(employee_id);
CREATE INDEX idx_time_entries_date ON time_entries(organization_id, clock_in);
CREATE INDEX idx_time_entries_status ON time_entries(status);
```

### time_off_requests

Leave requests.

```sql
CREATE TABLE time_off_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id),
  type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (type IN ('annual_leave', 'sick_leave', 'personal', 'bereavement', 'other')),
  CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled'))
);

CREATE INDEX idx_time_off_employee ON time_off_requests(employee_id);
CREATE INDEX idx_time_off_dates ON time_off_requests(start_date, end_date);
```

---

## Skills Tables

### skills

Skill definitions.

```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  verification_required BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_skills_org ON skills(organization_id);
```

### employee_skills

Skills assigned to employees.

```sql
CREATE TABLE employee_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id),
  expires_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(employee_id, skill_id),
  CHECK (level BETWEEN 1 AND 5)
);

CREATE INDEX idx_employee_skills_employee ON employee_skills(employee_id);
```

---

## Jobs Tables

### job_postings

Internal job listings.

```sql
CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location_id UUID REFERENCES locations(id),
  role_id UUID REFERENCES roles(id),
  requirements JSONB DEFAULT '[]',
  salary_range JSONB, -- {min, max, currency}
  status VARCHAR(50) DEFAULT 'draft',
  closes_at DATE,
  posted_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (status IN ('draft', 'open', 'closed', 'filled'))
);
```

### job_applications

Applications to internal jobs.

```sql
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_posting_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id),
  cover_note TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(job_posting_id, employee_id),
  CHECK (status IN ('pending', 'reviewed', 'interviewing', 'offered', 'rejected', 'withdrawn', 'hired'))
);
```

---

## Billing Tables

### subscriptions

Stripe subscription records.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  core_seats INTEGER DEFAULT 0,
  flex_seats INTEGER DEFAULT 0,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (plan IN ('growth', 'scale', 'enterprise')),
  CHECK (status IN ('active', 'past_due', 'cancelled', 'trialing'))
);
```

### seats

Seat allocation tracking.

```sql
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  type VARCHAR(20) NOT NULL,
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  deactivated_at TIMESTAMPTZ,
  
  CHECK (type IN ('core', 'flex'))
);

CREATE INDEX idx_seats_subscription ON seats(subscription_id);
CREATE INDEX idx_seats_employee ON seats(employee_id);
```

---

## Support Tables

### notifications

In-app notifications.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;
```

### activity_log

Audit trail.

```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_org ON activity_log(organization_id);
CREATE INDEX idx_activity_date ON activity_log(created_at);
```

---

## Migrations

Migrations are in `database/migrations/` and should be run in order:

```bash
# Run all migrations
node scripts/migrate.js

# Or manually
psql $DATABASE_URL < database/migrations/20240101000000_initial_schema.sql
psql $DATABASE_URL < database/migrations/20240115000000_billing_schema.sql
psql $DATABASE_URL < database/migrations/20250111000000_commercial_layer.sql
```

---

## Indexes

Key indexes for performance:

```sql
-- Frequently queried columns
CREATE INDEX idx_shifts_org_date ON shifts(organization_id, date);
CREATE INDEX idx_time_entries_employee_date ON time_entries(employee_id, clock_in);
CREATE INDEX idx_employees_org_status ON employees(organization_id, status);

-- Foreign key indexes (PostgreSQL doesn't auto-create these)
CREATE INDEX idx_shifts_location ON shifts(location_id);
CREATE INDEX idx_shifts_role ON shifts(role_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);

-- Partial indexes for common queries
CREATE INDEX idx_shifts_open ON shifts(is_open) WHERE is_open = TRUE;
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;
```

---

## Backup & Restore

```bash
# Full backup
pg_dump -Fc $DATABASE_URL > backup_$(date +%Y%m%d).dump

# Restore
pg_restore -d $DATABASE_URL backup_20240101.dump

# Schema only
pg_dump --schema-only $DATABASE_URL > schema.sql

# Data only
pg_dump --data-only $DATABASE_URL > data.sql
```
