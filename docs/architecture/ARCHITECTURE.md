# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  CLIENTS                                     │
├─────────────────────┬─────────────────────┬─────────────────────────────────┤
│   Customer Portal   │    Mobile App       │   Backoffice / Ops Portal       │
│   (React + Vite)    │  (React Native)     │   (React + Vite)                │
│   Port: 5173        │  (Expo)             │   Ports: 5174, 5175             │
└─────────┬───────────┴──────────┬──────────┴─────────────────┬───────────────┘
          │                      │                            │
          │                      ▼                            │
          │            ┌─────────────────┐                    │
          │            │  Offline Cache  │                    │
          │            │  (AsyncStorage) │                    │
          │            └────────┬────────┘                    │
          │                     │                             │
          ▼                     ▼                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LOAD BALANCER                                   │
│                          (nginx / cloud LB)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Rate Limit  │  │    CORS     │  │    Auth     │  │   CSRF      │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐                                           │
│  │ Idempotency │  │  Request ID │                                           │
│  └─────────────┘  └─────────────┘                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXPRESS.JS API (Node 20+)                          │
│                                 Port: 3000                                   │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                              ROUTES                                     │ │
│  ├──────────┬──────────┬──────────┬──────────┬──────────┬────────────────┤ │
│  │   auth   │scheduling│   time   │  skills  │  users   │   billing      │ │
│  │  (auth)  │ (shifts) │(clock in)│ (career) │(employee)│  (stripe)      │ │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┼────────────────┤ │
│  │dashboard │   core   │   ops    │operations│utilities │    admin       │ │
│  │(metrics) │(org/loc) │(internal)│  (jobs)  │ (files)  │ (superadmin)   │ │
│  └──────────┴──────────┴──────────┴──────────┴──────────┴────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                             SERVICES                                    │ │
│  ├──────────────┬──────────────┬──────────────┬──────────────────────────┤ │
│  │     auth     │   billing    │    email     │     notifications        │ │
│  │  (JWT/MFA)   │  (Stripe)    │  (SendGrid)  │    (push/in-app)         │ │
│  ├──────────────┴──────────────┴──────────────┴──────────────────────────┤ │
│  │                           activity (audit log)                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            POSTGRESQL 15+                                    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  organizations │ users │ employees │ locations │ roles │ shifts        ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  time_entries │ skills │ employee_skills │ job_postings │ applications ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  subscriptions │ seats │ invoices │ notifications │ activity_log      ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL SERVICES                                   │
├───────────────────┬───────────────────┬─────────────────────────────────────┤
│      Stripe       │     SendGrid      │           (Future)                  │
│   (Payments)      │     (Email)       │  Twilio, Firebase, S3               │
└───────────────────┴───────────────────┴─────────────────────────────────────┘
```

---

## Data Flow

### Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│   API    │────▶│  Auth    │────▶│    DB    │
│          │     │          │     │ Service  │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     │  1. POST /auth/login            │                │
     │  {email, password}              │                │
     │ ───────────────────────────────▶│                │
     │                │                │  2. Verify     │
     │                │                │ ───────────────▶
     │                │                │                │
     │                │                │  3. User data  │
     │                │                │ ◀───────────────
     │                │                │                │
     │  4. Set httpOnly cookie         │                │
     │     + CSRF token                │                │
     │ ◀───────────────────────────────│                │
     │                │                │                │
     │  5. Subsequent requests         │                │
     │     Cookie + CSRF header        │                │
     │ ───────────────────────────────▶│                │
```

### Offline Sync Flow (Mobile)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Mobile  │     │  Offline │     │   API    │     │    DB    │
│   App    │     │  Queue   │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     │  1. User action (offline)       │                │
     │ ───────────────▶                │                │
     │                │                │                │
     │  2. Queue with │                │                │
     │     idempotency key             │                │
     │                │                │                │
     │  [Device comes online]          │                │
     │                │                │                │
     │  3. Sync queue │                │                │
     │ ───────────────▶                │                │
     │                │  4. POST with  │                │
     │                │  X-Idempotency-Key              │
     │                │ ───────────────▶                │
     │                │                │  5. Check key  │
     │                │                │ ───────────────▶
     │                │                │                │
     │                │                │  6. Process or │
     │                │                │     replay     │
     │                │ ◀───────────────────────────────│
     │  7. Update UI  │                │                │
     │ ◀───────────────                │                │
```

---

## Database Schema

### Core Entities

```sql
-- Organization (Tenant)
organizations
├── id (UUID, PK)
├── name
├── slug (unique)
├── settings (JSONB)
├── billing_email
└── created_at, updated_at

-- User (Login/Auth)
users
├── id (UUID, PK)
├── organization_id (FK)
├── email (unique)
├── password_hash
├── role (worker|manager|admin|superadmin)
├── mfa_enabled, mfa_secret
└── employee_id (FK, nullable)

-- Employee (HR Record)
employees
├── id (UUID, PK)
├── organization_id (FK)
├── user_id (FK, nullable)
├── first_name, last_name
├── email, phone
├── hire_date, job_title
├── hourly_rate, employment_type
├── status (active|inactive|terminated)
├── manager_id (FK, self-reference)
└── metadata (JSONB)

-- Location
locations
├── id (UUID, PK)
├── organization_id (FK)
├── name, address
├── latitude, longitude
├── geofence_radius
└── settings (JSONB)

-- Role (Job Role, not Auth Role)
roles
├── id (UUID, PK)
├── organization_id (FK)
├── name, color
├── default_hourly_rate
└── required_skills (JSONB)
```

### Scheduling Entities

```sql
-- Shift
shifts
├── id (UUID, PK)
├── organization_id (FK)
├── location_id (FK)
├── role_id (FK)
├── employee_id (FK, nullable for open shifts)
├── date, start_time, end_time
├── break_minutes
├── status (scheduled|completed|cancelled)
├── is_open (boolean)
├── notes
└── created_by (FK → users)

-- Time Entry
time_entries
├── id (UUID, PK)
├── organization_id (FK)
├── employee_id (FK)
├── shift_id (FK, nullable)
├── clock_in, clock_out
├── break_minutes
├── location_in, location_out (JSONB)
├── status (pending|approved|rejected)
└── approved_by (FK → users)

-- Shift Swap
shift_swaps
├── id (UUID, PK)
├── shift_id (FK)
├── requester_id (FK → employees)
├── target_id (FK → employees, nullable)
├── status (pending|accepted|rejected|cancelled)
└── notes
```

### Skills & Career

```sql
-- Skill
skills
├── id (UUID, PK)
├── organization_id (FK)
├── name, category
├── description
└── verification_required (boolean)

-- Employee Skill
employee_skills
├── id (UUID, PK)
├── employee_id (FK)
├── skill_id (FK)
├── level (1-5)
├── verified_at
├── verified_by (FK → users)
└── expires_at (nullable)

-- Job Posting (Internal)
job_postings
├── id (UUID, PK)
├── organization_id (FK)
├── title, description
├── location_id (FK)
├── role_id (FK)
├── status (draft|open|closed|filled)
├── required_skills (JSONB)
├── salary_range (JSONB)
└── posted_by (FK → users)

-- Job Application
job_applications
├── id (UUID, PK)
├── job_posting_id (FK)
├── employee_id (FK)
├── status (pending|reviewed|interviewing|offered|rejected|withdrawn)
├── cover_note
└── reviewed_by (FK → users)
```

### Billing

```sql
-- Subscription
subscriptions
├── id (UUID, PK)
├── organization_id (FK)
├── stripe_subscription_id
├── plan (growth|scale|enterprise)
├── status (active|past_due|cancelled)
├── current_period_start, current_period_end
├── core_seats, flex_seats
└── cancelled_at (nullable)

-- Seat
seats
├── id (UUID, PK)
├── subscription_id (FK)
├── employee_id (FK)
├── type (core|flex)
├── activated_at
└── deactivated_at (nullable)

-- Invoice
invoices
├── id (UUID, PK)
├── organization_id (FK)
├── stripe_invoice_id
├── amount, currency
├── status (draft|open|paid|void)
├── period_start, period_end
└── line_items (JSONB)
```

---

## API Design

### RESTful Conventions

```
GET    /api/resource          → List (paginated)
GET    /api/resource/:id      → Get single
POST   /api/resource          → Create
PUT    /api/resource/:id      → Full update
PATCH  /api/resource/:id      → Partial update
DELETE /api/resource/:id      → Delete
```

### Response Format

```json
// Success (single)
{
  "user": { "id": "...", "email": "..." }
}

// Success (list)
{
  "users": [...],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  }
}

// Error
{
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format"
  }
}
```

### Authentication Headers

```
Cookie: accessToken=<jwt>; refreshToken=<jwt>
X-CSRF-Token: <csrf-token>
X-Request-ID: <uuid>
X-Idempotency-Key: <unique-key>  (for offline sync)
```

---

## Security Architecture

### Authentication
- **JWT tokens** stored in httpOnly cookies (XSS-safe)
- **Refresh token rotation** on each use
- **CSRF protection** via double-submit cookie pattern
- **MFA support** via TOTP (Google Authenticator compatible)

### Authorization
- **Role-based access control (RBAC)**
  - `worker` - Own data only
  - `manager` - Team data + approvals
  - `admin` - Organization-wide access
  - `superadmin` - Platform-wide (Anthropic staff only)
- **Organization isolation** - All queries scoped by org ID

### Data Protection
- **Passwords** hashed with bcrypt (cost factor 12)
- **Sensitive fields** encrypted at rest
- **Audit logging** for all mutations
- **Rate limiting** per endpoint and IP

---

## Scalability Considerations

### Horizontal Scaling
- **Stateless API** - No server-side sessions
- **Database connection pooling** - pg-pool with max 20 connections
- **Load balancer ready** - Kubernetes deployment included

### Performance
- **Database indexes** on all foreign keys and common queries
- **Query optimization** - Explain analyze on critical paths
- **Pagination** - All list endpoints paginated (default 20, max 100)
- **Caching layer** - Ready for Redis (not implemented)

### Multi-tenancy
- **Logical isolation** - Organization ID on all tables
- **Row-level security ready** - Can enable PostgreSQL RLS
- **Per-tenant rate limits** - Configurable per organization

---

## Deployment Architecture

### Docker

```yaml
services:
  api:
    image: uplift/api:latest
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://...
      JWT_SECRET: ...
      STRIPE_SECRET_KEY: ...

  portal:
    image: uplift/portal:latest
    ports: ["80:80"]

  postgres:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
```

### Kubernetes

```
┌─────────────────────────────────────────────────────────┐
│                      Kubernetes Cluster                  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Ingress   │  │   Ingress   │  │   Ingress   │     │
│  │  api.uplift │  │ app.uplift  │  │ admin.uplift│     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐     │
│  │   Service   │  │   Service   │  │   Service   │     │
│  │    (API)    │  │  (Portal)   │  │ (Backoffice)│     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐     │
│  │ Deployment  │  │ Deployment  │  │ Deployment  │     │
│  │ replicas: 3 │  │ replicas: 2 │  │ replicas: 1 │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Managed PostgreSQL                  │   │
│  │           (Cloud SQL / RDS / Azure)              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Monitoring & Observability

### Logging
- **Structured JSON logs** with request ID correlation
- **Log levels**: error, warn, info, debug
- **Sensitive data redaction** in logs

### Metrics (Recommended)
- Request latency (p50, p95, p99)
- Error rates by endpoint
- Active users / concurrent connections
- Database query performance

### Health Checks
- `GET /health` - API liveness
- `GET /health/ready` - API + DB readiness

---

## Future Architecture Considerations

1. **Redis** - Session store, caching, rate limit state
2. **Message Queue** - RabbitMQ/SQS for async jobs
3. **Search** - Elasticsearch for employee/skill search
4. **CDN** - CloudFront/Cloudflare for static assets
5. **Microservices** - Split billing, notifications into separate services
