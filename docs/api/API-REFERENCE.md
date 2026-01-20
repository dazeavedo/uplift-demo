# API Reference

Base URL: `https://api.uplift.hr/api`

## Authentication

All endpoints except `/auth/login`, `/auth/register`, and `/auth/forgot-password` require authentication.

### Headers

```http
Cookie: accessToken=<jwt>; refreshToken=<jwt>
X-CSRF-Token: <csrf-token>
Content-Type: application/json
```

### Getting CSRF Token

```http
GET /auth/csrf-token
```

Response:
```json
{
  "csrfToken": "abc123..."
}
```

---

## Auth Endpoints

### Login

```http
POST /auth/login
```

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "manager",
    "organizationId": "uuid"
  },
  "token": "jwt-token"
}
```

### Register

```http
POST /auth/register
```

Request:
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "organizationName": "Acme Corp"
}
```

### Logout

```http
POST /auth/logout
```

### Refresh Token

```http
POST /auth/refresh
```

### Change Password

```http
POST /auth/change-password
```

Request:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newPassword123!"
}
```

### Forgot Password

```http
POST /auth/forgot-password
```

Request:
```json
{
  "email": "user@example.com"
}
```

### Reset Password

```http
POST /auth/reset-password
```

Request:
```json
{
  "token": "reset-token",
  "password": "newPassword123!"
}
```

---

## Users & Employees

### Get Current User

```http
GET /users/me
```

### Update Profile

```http
PATCH /users/me
```

Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+44 7700 900000"
}
```

### List Employees

```http
GET /users/employees
```

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| perPage | number | Items per page (default: 20, max: 100) |
| search | string | Search by name or email |
| status | string | Filter by status (active, inactive, terminated) |
| locationId | string | Filter by location |
| roleId | string | Filter by role |

Response:
```json
{
  "employees": [...],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Get Employee

```http
GET /users/employees/:id
```

### Create Employee

```http
POST /users/employees
```

Request:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+44 7700 900001",
  "hireDate": "2024-01-15",
  "jobTitle": "Barista",
  "hourlyRate": 12.50,
  "employmentType": "full_time",
  "locationId": "uuid",
  "roleId": "uuid",
  "managerId": "uuid"
}
```

### Update Employee

```http
PATCH /users/employees/:id
```

### Terminate Employee

```http
POST /users/employees/:id/terminate
```

Request:
```json
{
  "reason": "Resignation",
  "effectiveDate": "2024-02-01"
}
```

---

## Scheduling

### List Shifts

```http
GET /scheduling/shifts
```

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | string | Start date (YYYY-MM-DD) - required |
| endDate | string | End date (YYYY-MM-DD) - required |
| locationId | string | Filter by location |
| employeeId | string | Filter by employee |
| status | string | Filter by status |
| includeOpen | boolean | Include open shifts (default: true) |

### Get Shift

```http
GET /scheduling/shifts/:id
```

### Create Shift

```http
POST /scheduling/shifts
```

Request:
```json
{
  "date": "2024-01-20",
  "startTime": "09:00",
  "endTime": "17:00",
  "breakMinutes": 30,
  "locationId": "uuid",
  "roleId": "uuid",
  "employeeId": "uuid",
  "notes": "Opening shift"
}
```

### Update Shift

```http
PATCH /scheduling/shifts/:id
```

### Delete Shift

```http
DELETE /scheduling/shifts/:id
```

### Publish Schedule

```http
POST /scheduling/shifts/publish
```

Request:
```json
{
  "startDate": "2024-01-20",
  "endDate": "2024-01-26",
  "locationId": "uuid"
}
```

### AI Fill Shifts

```http
POST /scheduling/shifts/ai-fill
```

Request:
```json
{
  "shiftIds": ["uuid1", "uuid2"],
  "preferences": {
    "prioritizeAvailability": true,
    "balanceHours": true,
    "considerSkills": true
  }
}
```

### Demand Forecast

```http
GET /scheduling/forecast
```

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| weeks | number | Weeks to forecast (default: 2, max: 8) |
| locationId | string | Filter by location |
| granularity | string | 'day' or 'hour' |

Response:
```json
{
  "forecast": [
    {
      "date": "2024-01-20",
      "dayOfWeek": 6,
      "dayName": "Sat",
      "predictedShifts": 18,
      "predictedHours": 135,
      "predictedHeadcount": 9,
      "expectedFillRate": 85,
      "confidence": 82,
      "alerts": []
    }
  ],
  "summary": {
    "totalPredictedShifts": 126,
    "totalPredictedHours": 945,
    "peakDay": {...},
    "alertCount": 2
  },
  "metadata": {
    "weeksOfHistory": 12,
    "weeksForecasted": 2
  }
}
```

### Forecast Recommendations

```http
GET /scheduling/forecast/recommendations
```

---

## Time Tracking

### Get Clock Status

```http
GET /time/status
```

Response:
```json
{
  "clockedIn": true,
  "entry": {
    "id": "uuid",
    "clockIn": "2024-01-20T09:00:00Z",
    "shiftId": "uuid",
    "locationName": "Central"
  }
}
```

### Clock In

```http
POST /time/clock-in
```

Request:
```json
{
  "shiftId": "uuid",
  "location": {
    "latitude": 51.5074,
    "longitude": -0.1278
  }
}
```

Headers for offline sync:
```http
X-Idempotency-Key: unique-key-123
```

### Clock Out

```http
POST /time/clock-out
```

Request:
```json
{
  "location": {
    "latitude": 51.5074,
    "longitude": -0.1278
  }
}
```

### Start Break

```http
POST /time/break/start
```

### End Break

```http
POST /time/break/end
```

### List Time Entries

```http
GET /time/entries
```

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | string | Start date |
| endDate | string | End date |
| employeeId | string | Filter by employee |
| status | string | pending, approved, rejected |

### Approve Time Entry

```http
POST /time/entries/:id/approve
```

### Reject Time Entry

```http
POST /time/entries/:id/reject
```

Request:
```json
{
  "reason": "Incorrect hours"
}
```

---

## Time Off

### Request Time Off

```http
POST /time/time-off
```

Request:
```json
{
  "type": "annual_leave",
  "startDate": "2024-02-01",
  "endDate": "2024-02-05",
  "notes": "Family holiday"
}
```

### List Time Off Requests

```http
GET /time/time-off
```

### Approve Time Off

```http
POST /time/time-off/:id/approve
```

### Reject Time Off

```http
POST /time/time-off/:id/reject
```

---

## Skills

### List Skills

```http
GET /skills
```

### Create Skill

```http
POST /skills
```

Request:
```json
{
  "name": "Barista Level 2",
  "category": "Coffee",
  "description": "Advanced coffee making",
  "verificationRequired": true
}
```

### Get Employee Skills

```http
GET /skills/employee/:employeeId
```

### Add Skill to Employee

```http
POST /skills/employee/:employeeId
```

Request:
```json
{
  "skillId": "uuid",
  "level": 3
}
```

### Verify Skill

```http
POST /skills/employee/:employeeId/verify/:skillId
```

---

## Jobs (Internal Mobility)

### List Job Postings

```http
GET /operations/jobs
```

### Create Job Posting

```http
POST /operations/jobs
```

Request:
```json
{
  "title": "Shift Supervisor",
  "description": "Lead the team...",
  "locationId": "uuid",
  "roleId": "uuid",
  "requirements": ["2+ years experience", "Leadership skills"],
  "salaryRange": {
    "min": 28000,
    "max": 32000
  }
}
```

### Apply to Job

```http
POST /operations/jobs/:id/apply
```

Request:
```json
{
  "coverNote": "I'm interested because..."
}
```

### List Applications

```http
GET /operations/jobs/:id/applications
```

### Update Application Status

```http
PATCH /operations/applications/:id
```

Request:
```json
{
  "status": "interviewing",
  "notes": "Scheduled for Monday"
}
```

---

## Locations

### List Locations

```http
GET /core/locations
```

### Create Location

```http
POST /core/locations
```

Request:
```json
{
  "name": "Central Branch",
  "address": "123 High Street, London",
  "latitude": 51.5074,
  "longitude": -0.1278,
  "geofenceRadius": 100
}
```

---

## Roles

### List Roles

```http
GET /core/roles
```

### Create Role

```http
POST /core/roles
```

Request:
```json
{
  "name": "Barista",
  "color": "#FF6B35",
  "defaultHourlyRate": 12.50,
  "requiredSkills": ["uuid1", "uuid2"]
}
```

---

## Billing

### Get Subscription

```http
GET /billing/subscription
```

### Update Subscription

```http
PATCH /billing/subscription
```

Request:
```json
{
  "plan": "scale",
  "coreSeats": 50
}
```

### Get Invoices

```http
GET /billing/invoices
```

### Get Seat Usage

```http
GET /billing/seats/usage
```

### Create Setup Intent

```http
POST /billing/setup-intent
```

### Update Payment Method

```http
POST /billing/payment-method
```

### Stripe Webhook

```http
POST /billing/webhooks/stripe
```

---

## Dashboard

### Get Dashboard Data

```http
GET /dashboard
```

Response:
```json
{
  "today": {
    "shifts": {
      "total": 24,
      "filled": 22,
      "open": 2
    }
  },
  "activeEmployees": 150,
  "openShifts": 5,
  "pendingApprovals": {
    "timesheets": 8,
    "time_off": 3,
    "swaps": 2
  },
  "weekMetrics": {
    "scheduled": 480,
    "worked": 420,
    "cost_scheduled": 5760,
    "cost_actual": 5040
  }
}
```

---

## Notifications

### List Notifications

```http
GET /utilities/notifications
```

### Mark as Read

```http
POST /utilities/notifications/:id/read
```

### Mark All as Read

```http
POST /utilities/notifications/read-all
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "password": "Must be at least 8 characters"
  }
}
```

### 401 Unauthorized

```json
{
  "error": "No token provided"
}
```

### 403 Forbidden

```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 409 Conflict

```json
{
  "error": "Conflict",
  "message": "Data was modified after your offline action",
  "serverTimestamp": 1705764000000,
  "offlineTimestamp": 1705763000000
}
```

### 429 Too Many Requests

```json
{
  "error": "Too many requests",
  "retryAfter": 60
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "requestId": "uuid"
}
```

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/auth/login` | 5 per minute |
| `/auth/register` | 3 per minute |
| `/auth/forgot-password` | 3 per hour |
| All other endpoints | 100 per minute |

---

## Pagination

All list endpoints support pagination:

```http
GET /users/employees?page=2&perPage=50
```

Response includes pagination metadata:

```json
{
  "employees": [...],
  "pagination": {
    "page": 2,
    "perPage": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

Response headers:
```http
X-Total-Count: 150
X-Page: 2
X-Per-Page: 50
```

---

## OpenAPI Specification

Full OpenAPI 3.0 specification available at:
- Development: http://localhost:3000/api/docs
- Production: https://api.uplift.hr/api/docs

Or see `docs/openapi.yaml` in the repository.
