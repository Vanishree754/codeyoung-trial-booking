# CodeYoung Trial Class Booking System

A deliberately small but production-minded full-stack trial-class booking system for the CodeYoung Full-Stack Development assignment.

The implementation follows the requested stack: React/Vite, Node.js/Express, SQLite, REST/JSON and Luxon for IANA timezone/DST handling.

## Why this design?

The project prioritizes correctness, maintainability and explainability over unnecessary features.

```text
React
  |
  | REST / JSON
  v
Express Controllers
  |
  v
Booking / Mentor Services
  |
  +--> Luxon timezone utilities
  |
  v
SQLite
```

## Requirements covered

- 10 mentors seeded automatically
- Parent name/email/timezone
- Future date/time selection
- Backend mentor availability
- Automatic deterministic mentor assignment
- Maximum 2 confirmed classes per mentor per mentor-local day
- Overlap detection
- Duplicate parent booking protection
- UTC booking persistence
- Parent and mentor local-time display
- IANA timezone identifiers
- DST-aware conversion
- Explicit handling of nonexistent/ambiguous DST local times
- No-mentor error state
- Backend re-check at booking time
- SQLite write transaction for concurrent booking protection
- Demo class link
- Loading, empty, error and success states
- Automated business/timezone tests
- Mentor demo overview

## Mentor assignment

For a requested one-hour interval:

1. Interpret the parent's local time with Luxon and the supplied IANA timezone.
2. Convert it to UTC.
3. Load active mentors.
4. Load the relevant confirmed bookings in one bounded query.
5. For each mentor, calculate the booking count on that mentor's local calendar date.
6. Remove mentors at their daily limit.
7. Remove mentors with an overlapping booking.
8. Select the eligible mentor with the lowest daily load.
9. Break ties by stable mentor id.

The frontend's availability response is informational. The booking operation repeats the eligibility check inside a SQLite write transaction.

## Concurrency

SQLite is configured with WAL mode, foreign keys and a 5-second busy timeout.

The booking operation begins an `IMMEDIATE` transaction before reading the data used for mentor assignment. This makes the capacity/conflict decision part of the same protected write transaction instead of relying on a stale frontend availability check.

This is appropriate for the small SQLite-backed assignment. A production horizontally scaled service would normally move this responsibility to a server database with stronger multi-instance concurrency controls.

## Timezone and DST

Booking timestamps are stored in UTC.

The application uses IANA identifiers such as:

- `Asia/Kolkata`
- `America/New_York`
- `America/Los_Angeles`
- `Europe/London`

No fixed offsets are hard-coded.

The local-time parser performs a round-trip check to reject a local time that does not exist during a DST spring-forward transition. Ambiguous fall-back times are rejected instead of silently choosing one of two possible instants.

## Database

### parents

- id
- name
- email
- timezone
- created_at

### mentors

- id
- name
- email
- timezone
- max_classes_per_day
- active
- created_at

### bookings

- id
- parent_id
- mentor_id
- start_time_utc
- end_time_utc
- status
- meeting_link
- created_at

Indexes support mentor-time and parent-time queries.

## API

```text
GET  /api/health
GET  /api/mentors
GET  /api/mentors/stats
GET  /api/availability?startTime=...&timezone=...
POST /api/bookings
GET  /api/bookings/:id
GET  /api/bookings
```

### POST /api/bookings

```json
{
  "name": "Siddesh",
  "email": "siddesh@example.com",
  "timezone": "America/New_York",
  "startTime": "2026-09-28T10:00:00"
}
```

The backend interprets `startTime` as local time in `timezone`.

## Setup

Requirements:

- Node.js 18+
- npm

From the project root:

```bash
npm run install:all
```

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

Open:

```text
http://localhost:5173
```

The SQLite database is initialized and seeded automatically.

## Tests

```bash
npm test
```

Tests cover:

- timezone conversion
- DST offsets
- IANA timezone validation
- mentor assignment
- booking persistence
- duplicate booking rejection
- input validation

## Edge cases

The design explicitly considers:

- past booking requests
- minimum booking notice
- invalid name/email
- invalid timezone
- invalid date/time
- nonexistent DST local time
- ambiguous DST local time
- mentor daily capacity
- overlapping mentor bookings
- no available mentors
- duplicate parent booking
- concurrent booking attempts
- backend/API errors
- database errors
- browser refresh/persistent storage
- frontend loading/empty/error states

## Code-quality decisions

The implementation intentionally avoids unnecessary factories, repositories and abstractions.

Controllers are thin. Business rules live in services. Date/time behavior lives in a small timezone utility. Database access remains close to the service operations that require it.

Database queries are batched where practical instead of querying once per mentor for every individual check.

## AI transcript

See `TRANSCRIPT.md`.
