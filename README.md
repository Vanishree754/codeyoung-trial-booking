🎓 CodeYoung Trial Class Booking Platform

A full-stack, production-style trial class booking platform for CodeYoung.

The application allows parents/students to book a trial class by selecting a course, date, and time. The backend checks mentor availability, mentor capacity, existing bookings, timezone differences, duplicate bookings, and scheduling conflicts before assigning an eligible mentor.

The platform also provides:

Smart best-time recommendations

Timezone visualization

Daylight Saving Time (DST) handling

Mentor assignment and mentor capacity management

Duplicate booking prevention

Transactional/concurrent booking protection

Booking rescheduling

Booking cancellation

Booking-specific classroom/meeting links

Google OAuth integration

Google Calendar / Google Meet integration where configured

Parent and mentor email notifications

Classroom waiting room

Live class countdown

Admin / operations dashboard

Booking analytics

System health monitoring

Responsive mobile-first UI

Loading, error, empty, and success states

Automated tests

🚀 HOW TO EXECUTE THE PROJECT

This section is intentionally placed first so that a developer/evaluator can quickly understand how to run the application.

The application consists of:

Frontend
   ↓
Backend API
   ↓
Database

External integrations:
   ├── Google OAuth
   ├── Google Calendar / Google Meet
   └── SMTP / Email

The frontend and backend must be running simultaneously during local development.

⚡ 1. QUICK START

If all prerequisites, database configuration, and environment variables are already configured:

Terminal 1 — Backend

cd backend
npm install
npm run migrate
npm run seed
npm run dev

Backend:

http://localhost:4000

Terminal 2 — Frontend

cd frontend
npm install
npm run dev

Frontend:

http://localhost:5173

Open the application:

http://localhost:5173

Health check:

http://localhost:4000/api/health

The exact commands available in the project are defined by the package.json files. If a command such as migrate or seed is not present, use the scripts provided by the actual project configuration.

🖥️ 2. RUNNING ENVIRONMENT

The application is a full-stack web application intended to run in a local development environment.

Recommended Environment

Component

Requirement

Operating System

Windows 10/11, Linux, or macOS

Runtime

Node.js LTS

Package Manager

npm

Browser

Google Chrome / Microsoft Edge / Firefox

Database

Database configured by the project

Internet

Required for Google APIs and email

RAM

8 GB recommended

Free Storage

At least 5 GB recommended

The exact Node.js version should be verified from the project's package.json, .nvmrc, or other runtime configuration if present.

💻 3. SYSTEM REQUIREMENTS

Minimum Hardware

CPU:
Dual-core processor

RAM:
4 GB

Storage:
At least 2 GB free

Internet:
Required for external integrations

Recommended Hardware

CPU:
Quad-core processor or better

RAM:
8 GB or more

Storage:
At least 5 GB free

Internet:
Stable broadband connection

📋 4. PREREQUISITES

Install the following before running the project:

Node.js LTS

npm

Git

Required database

Modern web browser

Google Cloud account if Google integration is enabled

SMTP/email account if email functionality is enabled

4.1 Node.js

Install Node.js LTS.

Verify:

node --version

Verify npm:

npm --version

The exact supported version should match the project configuration.

4.2 Git

Verify:

git --version

Git is required if the project is cloned from GitHub.

4.3 Database

Install and start the database required by the backend.

The exact database must match the implementation.

Before running the application, inspect:

backend/
package.json
database/
.env.example
backend database configuration

for the exact database requirements.

4.4 Web Browser

Recommended:

Google Chrome

Microsoft Edge

Mozilla Firefox

Chrome or Edge is recommended when testing Google OAuth, Calendar, and Meet functionality.

4.5 Internet Connection

Internet access is required for:

Google OAuth

Google Calendar API

Google Meet integration

SMTP/email delivery

Other external services

📥 5. GET THE PROJECT

Option A — Clone from GitHub

git clone <YOUR_GITHUB_REPOSITORY_URL>

Enter the project:

cd codeyoung-trial-booking

Replace <YOUR_GITHUB_REPOSITORY_URL> with the actual repository URL.

Option B — ZIP File

If the project is provided as a ZIP:

Extract the ZIP.

Open the extracted folder.

Open it in VS Code or another IDE.

Open a terminal at the project root.

📁 6. PROJECT STRUCTURE

The final project should be organized into modular frontend, backend, and database areas.

A typical structure is:

codeyoung-trial-booking/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   │   ├── booking/
│   │   │   ├── classroom/
│   │   │   ├── admin/
│   │   │   └── analytics/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.*
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── validators/
│   ├── middleware/
│   ├── utils/
│   ├── tests/
│   └── package.json
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── .env.example
├── .gitignore
└── README.md

The exact structure may differ slightly depending on the implementation.

📦 7. INSTALL DEPENDENCIES

Backend

Open a terminal:

cd backend
npm install

Frontend

Open another terminal:

cd frontend
npm install

If the project has a root-level package manager/workspace configuration, follow the root-level commands instead.

🔐 8. ENVIRONMENT VARIABLES

Environment variables are used for:

database connection

frontend/backend URLs

SMTP

Google OAuth

Google Calendar

Google Meet

other service configuration

Never hardcode secrets into source files.

8.1 Backend .env

A typical configuration is:

PORT=4000

DATABASE_URL=your_database_connection

FRONTEND_URL=http://localhost:5173

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password_or_app_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback

GOOGLE_CALENDAR_ID=primary

Use the exact environment variable names expected by the actual backend.

8.2 Frontend .env

A typical configuration is:

VITE_API_URL=http://localhost:4000

Use the exact variable name expected by the actual frontend.

8.3 .env.example

The repository should contain an example file containing variable names but no real secrets.

Example:

PORT=4000

DATABASE_URL=

FRONTEND_URL=http://localhost:5173

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback

GOOGLE_CALENDAR_ID=primary

🗄️ 9. DATABASE SETUP

Start the database service required by the project.

Configure the database connection in .env.

Example:

DATABASE_URL=...

Then run the migration command provided by the project.

Typical:

cd backend
npm run migrate

If the project uses a different command, run:

npm run

and use the migration script defined in package.json.

🔄 10. DATABASE MIGRATIONS

Migrations create and update the database schema.

General flow:

Fresh Database
      ↓
Run Migrations
      ↓
Tables Created/Updated
      ↓
Run Seed
      ↓
Demo Data Available

Do not manually create tables if the project provides migrations.

🌱 11. SEED DATA

Seed data may contain:

mentors

mentor availability

courses

demo bookings

scheduling data

sample operational data

Typical command:

npm run seed

Seed data is intended for development/testing.

Do not use destructive seed/reset commands against production data.

🔑 12. GOOGLE OAUTH SETUP

Google OAuth is required for Google API functionality when enabled.

Step 1 — Open Google Cloud Console

Open:

https://console.cloud.google.com/

Create or select a Google Cloud project.

Step 2 — Enable Required APIs

Enable the APIs required by the implementation.

Depending on the configured functionality, this can include:

Google Calendar API

Google Meet-related APIs

Required Google Workspace APIs

Step 3 — Create OAuth Credentials

Create an OAuth client suitable for a web application.

Typical application type:

Web application

Step 4 — Configure Redirect URI

For local development, an example is:

http://localhost:4000/auth/google/callback

The redirect URI configured in Google Cloud must exactly match the redirect URI used by the application.

For example:

GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback

Do not change:

localhost
port
path
protocol
trailing slash

unless the Google Cloud configuration is changed accordingly.

Step 5 — Configure Credentials

Add:

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback

Never commit these credentials.

📅 13. GOOGLE CALENDAR / GOOGLE MEET SETUP

When configured, Google Calendar/Meet integration follows this general flow:

Booking
   ↓
Google OAuth
   ↓
Authorized Google Account
   ↓
Google Calendar Event
   ↓
Conference / Google Meet
   ↓
Unique Meeting URL
   ↓
Save Meeting Information
   ↓
Associate with Booking

Google Calendar supports conference information for events when the Calendar API is configured appropriately.

If real Google Meet generation is not configured in a particular environment, the application should use its configured development/classroom provider rather than pretending that a real Google Meet room was created.

🎥 14. BOOKING-SPECIFIC GOOGLE MEET / CLASSROOM LINK

A critical requirement is that the application must not use one global meeting link for every booking.

Incorrect:

All bookings
      ↓
https://meet.google.com/common-room

Correct:

Booking #101
      ↓
Meeting/Classroom A

Booking #102
      ↓
Meeting/Classroom B

Booking #103
      ↓
Meeting/Classroom C

Each booking must store its own meeting/classroom reference.

Conceptually:

BOOKING
------------------------------------
id
parent
mentor
startUtc
endUtc
status
meetingProvider
meetingUrl
meetingId
------------------------------------

🧩 15. MEETING PROVIDER ARCHITECTURE

Meeting functionality should be isolated behind a provider abstraction.

Conceptually:

Booking Service
      ↓
MeetingProvider
      │
      ├── DevelopmentMeetingProvider
      │
      └── GoogleMeetProvider

This allows the application to use a development classroom locally and real Google Meet integration when configured.

📧 16. SMTP / EMAIL SETUP

Configure the SMTP service used by the project.

Example:

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password_or_app_password

The exact values depend on the provider.

The application can send notifications to:

parent

mentor

👨‍👩‍👧 17. PARENT EMAIL

A parent confirmation email should contain information such as:

🎉 Your CodeYoung Trial Class is Confirmed!

Mentor:
Aditya Joshi

Date:
27 September 2026

Your local time:
6:00 PM IST

Classroom:
[ JOIN CLASS ]

The actual values must come from the booking.

👨‍🏫 18. MENTOR EMAIL

A mentor assignment email should contain:

🎓 New Trial Class Assigned

Parent:
Vanishree

Date:
27 September 2026

Your local time:
8:30 AM

Classroom:
[ OPEN CLASSROOM ]

⚠️ 19. EMAIL FAILURE HANDLING

Email delivery is a notification operation.

The recommended sequence is:

Create booking
      ↓
Commit transaction
      ↓
Send email

If the email service fails after the booking has been committed:

Booking remains valid
+
Notification failure is handled/logged

A temporary SMTP failure should not corrupt a successful booking.

▶️ 20. START THE BACKEND

Open Terminal 1.

From the project root:

cd backend

Start development mode:

npm run dev

The backend should normally be available at:

http://localhost:4000

Keep this terminal running.

▶️ 21. START THE FRONTEND

Open Terminal 2.

From the project root:

cd frontend

Start the frontend:

npm run dev

The frontend should normally be available at:

http://localhost:5173

Keep this terminal running.

🌐 22. APPLICATION URLS

Typical local URLs:

Frontend:
http://localhost:5173

Backend:
http://localhost:4000

Health:
http://localhost:4000/api/health

Admin:
http://localhost:5173/admin

Classroom:
http://localhost:5173/classroom/<booking-id>

Actual routes may differ according to the final implementation.

🩺 23. VERIFY THE BACKEND

Open:

http://localhost:4000/api/health

A healthy response may look similar to:

{
  "status": "ok",
  "database": "ok"
}

The exact response depends on the implementation.

If the health endpoint fails, check:

Backend terminal

.env

Database

Port configuration

Dependencies

⚡ 24. COMPLETE EXECUTION IN SHORT FORM

After all prerequisites and configuration are complete:

Terminal 1

cd backend
npm install
npm run migrate
npm run seed
npm run dev

Terminal 2

cd frontend
npm install
npm run dev

Open:

http://localhost:5173

🔄 25. COMPLETE BOOKING FLOW

The complete booking workflow is:

Landing Page
      ↓
Select Course
      ↓
Enter Parent/Student Information
      ↓
Detect Parent Timezone
      ↓
Select Date
      ↓
Select Time
      ↓
Show Timezone Comparison
      ↓
Calculate Recommended Slots
      ↓
Check Mentor Availability
      ↓
Check Mentor Capacity
      ↓
Confirm Booking
      ↓
Backend Validation
      ↓
Duplicate Check
      ↓
Database Transaction
      ↓
Mentor Assignment
      ↓
Create Booking
      ↓
Create/Assign Meeting/Classroom
      ↓
Commit Transaction
      ↓
Send Notifications
      ↓
Booking Confirmation
      ↓
Classroom Waiting Room
      ↓
Live Countdown
      ↓
Join Class

🧠 26. SMART BEST-TIME RECOMMENDATION

The application can recommend suitable slots instead of requiring the parent to manually search through every available time.

Example:

✨ RECOMMENDED FOR YOU

Wednesday
6:30 PM

👨‍🏫 Mentor available
🟢 Low booking load
🌍 Works well for your timezone

[ Choose this time ]

The recommendation should be calculated using actual backend data.

Possible factors:

mentor availability

existing bookings

mentor capacity

parent timezone

mentor timezone

selected course

selected date

booking conflicts

current scheduling state

The frontend should not invent recommendations.

🌍 27. TIMEZONE HANDLING

The application uses UTC as the common representation of a booking timestamp.

General flow:

Parent local date/time
        ↓
Timezone-aware conversion
        ↓
UTC timestamp
        ↓
Database
        ↓
UTC timestamp
        ↓
Viewer timezone conversion
        ↓
Local display

Do not manually add/subtract timezone offsets.

Avoid logic such as:

UTC + 5:30
UTC - 4

Use timezone-aware date/time handling.

🌎 28. TIMEZONE VISUALIZER

Example:

YOUR CLASS TIME

🇮🇳 Parent

27 September
6:00 PM

Asia/Calcutta

        ↓

    SAME MOMENT

        ↓

🇺🇸 Mentor

27 September
8:30 AM

America/New_York

The UI should make it clear that both local times represent the same instant.

☀️ 29. DAYLIGHT SAVING TIME

Timezone conversion should use IANA timezone identifiers.

Examples:

Asia/Calcutta
America/New_York
America/Los_Angeles
Europe/London
Australia/Sydney

Do not assume a timezone has a fixed UTC offset for the entire year.

DST-aware libraries should be used where appropriate.

👨‍🏫 30. MENTOR ASSIGNMENT

The backend determines eligible mentors based on actual scheduling state.

Potential rules:

mentor is active

mentor supports the selected subject

mentor is available

mentor is within working hours

mentor does not have a conflicting booking

mentor has remaining capacity

Example:

Requested:
27 September
6:00 PM IST

Mentors:

Aditya
Available

Rahul
Full

Sneha
Available

The backend assigns an eligible mentor.

📊 31. MENTOR CAPACITY

Example:

Aditya
1 / 2

Rahul
2 / 2

Sneha
1 / 2

The backend must prevent a mentor from exceeding configured capacity.

Frontend availability is not the source of truth.

🔐 32. BOOKING RELIABILITY AND CONCURRENCY

The booking system must protect against:

double clicks

duplicate requests

concurrent requests

stale availability

mentor overbooking

malformed input

database failures

partial booking state

General process:

User clicks Book
       ↓
Disable button
       ↓
Validate request
       ↓
Check duplicate
       ↓
Begin transaction
       ↓
Check availability
       ↓
Check capacity
       ↓
Assign mentor
       ↓
Create booking
       ↓
Create/assign classroom
       ↓
Commit transaction
       ↓
Send notifications
       ↓
Return confirmation

If the existing implementation uses a transaction/locking mechanism such as BEGIN IMMEDIATE, preserve and strengthen it rather than removing it.

🛡️ 33. BACKEND VALIDATION

Backend validation should verify:

required fields

email

date

time

timezone

course

mentor where applicable

booking ID

booking status

requested slot

duplicate conditions

Never rely only on frontend validation.

🔁 34. DUPLICATE BOOKING PROTECTION

If the same parent attempts to book the same time again:

Existing Booking
      ↓
Duplicate Check
      ↓
Duplicate Found
      ↓
Reject Request

Example response:

You already have a booking around this time.

⚡ 35. CONCURRENT BOOKING PROTECTION

Example:

User A → sees one slot available
User B → sees one slot available

User A → starts transaction
User B → starts transaction

User A → successfully books

User B → rechecks availability

Result:
User B must not overbook the same capacity.

This is why the final availability check must happen inside the protected backend transaction.

😕 36. BOOKING CONFLICT EXPLANATION

Instead of:

No mentors available.

show useful information:

😕 This time is fully booked

All available mentors are currently unavailable
for this time.

Try one of these:

🟢 5:30 PM
🟢 6:30 PM
🟢 7:00 PM

[ Choose another time ]

Alternative slots must come from actual backend availability.

✏️ 37. CHANGE BOOKING

Where supported:

[ 🚀 Join Class ]

[ ✏ Change Time ]

[ Cancel Booking ]

Rescheduling should:

Validate the existing booking.

Validate access.

Validate the new slot.

Start a database transaction.

Release old capacity.

Check new availability.

Assign a mentor.

Update the booking.

Update/create meeting information if required.

Commit.

Send notifications.

If the new slot is unavailable, the original booking should remain safe.

❌ 38. CANCEL BOOKING

Cancellation should:

validate the booking

validate authorization

update status

release mentor capacity

prevent classroom access

preserve relevant booking history

send notification where configured

Possible statuses include:

PENDING
CONFIRMED
CANCELLED
COMPLETED

Only statuses actually implemented by the application should be documented as supported.

🏫 39. CLASSROOM WAITING ROOM

A classroom can be available through a route similar to:

/classroom/:bookingId

Before the class:

🎓 CODEYOUNG CLASSROOM

        👨‍🏫
     Aditya Joshi

Your class starts in

     01 : 24 : 38

🟢 Appointment confirmed

Please keep this page open.

When the class begins:

🎉 Your mentor is ready!

[ 🚀 JOIN CLASS ]

🔐 40. CLASSROOM SECURITY

The classroom should verify:

booking exists

booking is valid

booking is not cancelled

classroom belongs to the booking

access/token is valid where required

scheduled class information

meeting information

Do not expose another user's private information.

⏱️ 41. LIVE CLASS COUNTDOWN

The countdown is based on the booking's absolute UTC start timestamp.

Example:

CLASS STARTS IN

01 : 24 : 38

HOURS  MINUTES  SECONDS

At zero:

🎉 YOUR CLASS IS READY!

[ 🚀 JOIN CLASS ]

Requirements:

use UTC/absolute timestamp

work across timezones

survive page refresh

stop at zero

never show negative values

avoid unnecessary timer drift

🎉 42. BOOKING SUCCESS EXPERIENCE

After the backend confirms the booking:

✨
🎉 🎉 🎉

BOOKED!

Your trial class
is confirmed.

Then show:

✓ Mentor assigned

Mentor:
Aditya Joshi

Date:
27 September 2026

Time:
6:00 PM IST

Subject:
Coding

Possible actions:

[ 🚀 Join Class ]
[ Add to Calendar ]
[ ✏ Change Booking ]
[ Cancel Booking ]

Do not display a fake success screen before the backend confirms the booking.

📧 43. EMAIL NOTIFICATION FLOW

The notification workflow is:

Booking Transaction
       ↓
Commit
       ↓
Parent Notification
       ↓
Mentor Notification

Parent email contains the parent's local time.

Mentor email can contain the mentor's local time.

Meeting/classroom links must belong to the specific booking.

📊 44. ADMIN / OPERATIONS DASHBOARD

Admin route:

/admin

Example:

CODEYOUNG TRIAL OPERATIONS

Metrics:

Mentors
10

Bookings
16

Today's Classes
7

Available Slots
8

👨‍🏫 45. TODAY'S MENTOR LOAD

Example:

Aditya
███████░░░ 1/2

Rahul
██████████ 2/2

Sneha
█████░░░░░ 1/2

These values should be calculated from actual database data.

📅 46. UPCOMING CLASSES

Example:

Parent       Mentor       Time       Status

Vanishree    Aditya       6:00 PM    Confirmed
Rahul        Sneha        7:00 PM    Confirmed

📈 47. ANALYTICS DASHBOARD

Possible metrics:

bookings today

bookings this week

bookings this month

confirmed

cancelled

completed

mentor utilization

popular subjects

peak booking hours

Example:

TRIAL CLASS ANALYTICS

Bookings this week
42

Confirmed
38

Cancelled
4

Popular subjects:

Coding
████████████

AI
█████████

Math
███████

Robotics
█████

Statistics must come from actual database data.

Do not hardcode analytics.

If there is insufficient data:

No data yet

should be displayed.

🩺 48. SYSTEM HEALTH

The backend should provide:

GET /api/health

Example:

{
  "status": "ok",
  "timestamp": "2026-09-27T12:30:00.000Z",
  "database": "ok",
  "version": "1.0.0",
  "environment": "development"
}

Do not expose:

passwords

API keys

database credentials

OAuth tokens

refresh tokens

private keys

🔌 49. API OVERVIEW

Actual endpoint names should be verified against the final backend implementation.

Typical endpoints:

GET    /api/health

GET    /api/mentors
GET    /api/availability
GET    /api/recommendations

POST   /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
POST   /api/bookings/:id/reschedule
POST   /api/bookings/:id/cancel

GET    /api/classroom/:id

GET    /api/admin/dashboard
GET    /api/admin/analytics

🖥️ 50. FRONTEND ARCHITECTURE

The frontend should use reusable feature-based components.

Conceptually:

src/
│
├── components/
├── pages/
├── features/
│   ├── booking/
│   ├── classroom/
│   ├── admin/
│   └── analytics/
├── services/
├── hooks/
├── utils/
└── styles/

The actual structure may differ depending on the final implementation.

⚙️ 51. BACKEND ARCHITECTURE

Recommended conceptual flow:

HTTP Request
     ↓
Route
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Database

Critical business logic should live in backend services rather than being duplicated in frontend components.

👨‍🏫 52. MENTOR PROFILE

After mentor assignment, display a polished mentor profile.

Example:

👨‍🏫
Aditya Joshi

Coding & Web Development

⭐ 4.9
🧑‍💻 500+ Classes

"I love helping young minds turn ideas into projects."

Only display data that actually exists in the database.

Do not invent real qualifications or credentials.

If information is seed/demo data, it should be treated as demonstration data.

📱 53. MOBILE-FIRST DESIGN

The application should work across:

320px
375px
390px
414px
768px
1024px
Desktop

Important pages:

landing page

booking form

date/time selection

mentor profile

confirmation

classroom

admin dashboard

analytics

Avoid unwanted horizontal scrolling.

✨ 54. MICRO-ANIMATIONS

Use subtle animations for:

cards entering

button hover

loading

mentor assignment

booking success

countdown

availability checking

toasts/modals

Respect:

prefers-reduced-motion

Animations should not distract from the booking process.

⏳ 55. LOADING STATES

Examples:

Checking availability...

◌
◌ ◌
◌ ◌ ◌

Then:

✓ Mentor found!

Aditya Joshi is available.

Every important asynchronous operation should provide feedback.

❌ 56. ERROR STATES

Examples:

We couldn't load availability.

Please try again.

or:

We couldn't complete your booking.

Your original selection has not been changed.

Avoid blank screens.

🟢 57. EMPTY STATES

Example:

No upcoming classes.

Book your first CodeYoung trial class.

🛡️ 58. SECURITY

The application should protect against:

SQL injection

XSS

malformed requests

IDOR

unauthorized classroom access

exposed secrets

token leakage

unsafe URLs

duplicate submissions

booking manipulation

Backend validation is mandatory.

🔒 59. DO NOT COMMIT SECRETS

Never commit:

.env
.env.local
.env.production
client_secret.json
credentials.json
token.json
*.pem
private keys
OAuth refresh tokens
SMTP passwords
database credentials
API keys

Recommended .gitignore:

node_modules/
.env
.env.*
!.env.example

dist/
build/
coverage/

*.log

client_secret.json
credentials.json
token.json

*.pem

.DS_Store
Thumbs.db

🧪 60. TESTING

Critical tests should cover:

Successful booking

Duplicate booking

Unavailable mentor

Mentor capacity

Concurrent booking

Invalid timezone

Timezone conversion

DST conversion

Cancellation

Rescheduling

Classroom access

Booking-specific meeting link

Analytics

Health endpoint

Malformed requests

▶️ 61. RUN AUTOMATED TESTS

Run:

npm test

If frontend and backend have separate test suites, run the appropriate command in each directory.

See available scripts:

npm run

🧪 62. MANUAL END-TO-END TEST

Test 1 — Successful Booking

Open http://localhost:5173.

Select a course.

Enter parent/student details.

Select a date.

Select a time.

Verify timezone visualization.

Verify recommended time.

Confirm booking.

Verify mentor assignment.

Verify confirmation.

Verify email.

Open classroom.

Expected:

Booking created successfully.
Mentor assigned.
Unique classroom/meeting created.

🧪 63. DUPLICATE BOOKING TEST

Create a booking.

Attempt to create the same booking again.

Expected:

Duplicate booking rejected.

🧪 64. MENTOR CAPACITY TEST

Fill a mentor's daily capacity.

Attempt another booking.

Expected:

Mentor unavailable

or assignment to another eligible mentor.

🧪 65. TIMEZONE TEST

Test:

Parent:
Asia/Calcutta

Mentor:
America/New_York

Verify:

Same UTC instant
Different local display times

🧪 66. DST TEST

Test a timezone affected by daylight saving time.

Verify that the application does not use a fixed offset.

🧪 67. RESCHEDULING TEST

Create a booking.

Select Change Booking.

Select another available slot.

Confirm.

Verify new time.

Verify mentor.

Verify classroom/meeting information.

Verify notification.

🧪 68. CANCELLATION TEST

Create booking.

Cancel it.

Verify status.

Verify mentor capacity is released.

Try opening the classroom.

Expected:

Cancelled bookings cannot join the class.

🧪 69. BOOKING-SPECIFIC MEETING TEST

Create two bookings.

Verify:

Booking A → Meeting/Classroom A
Booking B → Meeting/Classroom B

They must not share one global meeting URL.

🧪 70. ADMIN TEST

Open:

http://localhost:5173/admin

Verify:

mentor count

booking count

today's classes

mentor load

upcoming classes

analytics

🧪 71. HEALTH TEST

Open:

http://localhost:4000/api/health

Verify that the application reports a healthy status.

🏗️ 72. PRODUCTION BUILD

Frontend

cd frontend
npm run build

The build should complete without errors.

Backend

Use the production script defined in:

backend/package.json

Typically:

npm start

🌐 73. PRODUCTION ENVIRONMENT

Production should use:

HTTPS

production database

production SMTP

production Google OAuth credentials

production Google redirect URI

production frontend URL

production backend URL

secure secret storage

Never use development credentials in production.

🔑 74. PRODUCTION GOOGLE OAUTH

Development example:

http://localhost:4000/auth/google/callback

Production example:

https://your-domain.com/auth/google/callback

The production redirect URI must be configured in Google Cloud.

🐛 75. TROUBLESHOOTING

Backend Does Not Start

Check:

node --version
npm --version

Then:

npm install
npm run dev

Check:

.env

database

port

dependencies

Port 4000 Already in Use

Windows:

netstat -ano | findstr :4000

Then:

taskkill /PID <PID> /F

Port 5173 Already in Use

netstat -ano | findstr :5173

Stop the process if required.

📧 76. SMTP 535 ERROR

If you receive:

535 Authentication failed

check:

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

Also verify:

SMTP host

SMTP port

TLS settings

username

password/app password

provider requirements

Never print passwords in logs.

🔑 77. GOOGLE OAUTH REDIRECT ERROR

If you see:

redirect_uri_mismatch

compare:

GOOGLE_REDIRECT_URI=

with the Google Cloud OAuth configuration.

Check:

protocol

hostname

port

path

trailing slash

They must match exactly.

🔐 78. GOOGLE INVALID CLIENT

Check:

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

Make sure the credentials belong to the correct Google Cloud project.

📅 79. GOOGLE CALENDAR ERROR

Check:

Calendar API is enabled.

OAuth credentials are correct.

Required scopes are configured.

User has authorized the application.

Calendar access is available.

Access/refresh token handling is working.

🎥 80. GOOGLE MEET NOT CREATED

Check:

Required Google APIs are enabled.

OAuth credentials are valid.

Required scopes are configured.

Calendar integration is working.

Conference creation is configured.

Correct Google account is authorized.

If real Google Meet creation is not configured, use the configured development classroom provider.

🌐 81. FRONTEND CANNOT CONNECT TO BACKEND

Check:

Frontend:
http://localhost:5173

Backend:
http://localhost:4000

Check the frontend API configuration:

VITE_API_URL=http://localhost:4000

Also verify backend CORS configuration.

🗄️ 82. DATABASE CONNECTION ERROR

Check:

DATABASE_URL=

Then verify:

database is running

database exists

username/password are correct

host/port are correct

migrations have run

🔄 83. MIGRATION ERROR

Run:

npm run

and inspect the available migration command.

Use the project's defined migration process.

🌱 84. SEED ERROR

If seed data already exists, a seed command may fail due to duplicate records.

For development, use the project's documented reset procedure if available.

Never reset production data.

🧹 85. DEVELOPMENT RESET

If the project provides a reset command, it may be used during development.

Example:

npm run db:reset

WARNING:

A reset may delete development data.

Never run destructive reset commands against production.

📦 86. DEPENDENCY PROBLEMS

If dependencies become corrupted, reinstall them.

Windows PowerShell:

Remove-Item -Recurse -Force node_modules
npm install

Do this only when necessary.

🔍 87. CHECK AVAILABLE COMMANDS

Run:

npm run

This displays scripts defined in package.json.

Possible scripts include:

dev
start
build
test
migrate
seed
lint

The exact list depends on the implementation.

🧱 88. ARCHITECTURE PRINCIPLES

The application follows separation of concerns.

Frontend:

UI
 ↓
API Service
 ↓
Backend

Backend:

Route
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Database

Critical business logic belongs on the backend.

🧠 89. BUSINESS LOGIC

Backend responsibilities include:

mentor availability

mentor capacity

mentor assignment

duplicate booking detection

booking conflict detection

timezone normalization

booking transactions

cancellation

rescheduling

meeting association

analytics

The frontend should display backend state rather than being the source of truth.

🗃️ 90. BOOKING DATA

A booking may contain:

id
parent/student information
parent email
course/subject
mentor
startUtc
endUtc
parentTimezone
mentorTimezone
status
meetingProvider
meetingUrl
meetingId
createdAt
updatedAt

The exact fields depend on the final database schema.

👨‍🏫 91. MENTOR DATA

A mentor may contain:

id
name
timezone
subjects
availability
dailyCapacity
status
profile information

Only information actually stored in the database should be displayed.

🔐 92. CLASSROOM ACCESS

A user should not be able to access another user's private booking simply by changing a numeric booking ID.

Where appropriate, use:

authentication

authorization

secure classroom tokens

signed URLs

server-side access checks

🛡️ 93. SECURITY CHECKLIST

Before submission:

✓ No secrets in Git
✓ No passwords in logs
✓ No OAuth tokens in frontend
✓ Backend validates requests
✓ Database constraints are present
✓ Booking transaction is protected
✓ Classroom access is protected
✓ Meeting links are booking-specific
✓ Admin routes are protected where required
✓ User data is not unnecessarily exposed

📱 94. RESPONSIVE DESIGN

Test the application at:

320px
375px
390px
414px
768px
1024px
Desktop

Check:

navigation

booking forms

date/time selection

mentor cards

timezone visualization

countdown

confirmation

classroom

admin dashboard

analytics

tables

✨ 95. UI/UX

The application is designed to feel:

modern

clean

friendly

educational

professional

responsive

Subtle animations can be used for:

card entry

hover states

loading

mentor assignment

success

countdown

availability checking

toasts/modals

Animations should respect:

prefers-reduced-motion

📝 96. LOADING, ERROR, AND EMPTY STATES

Important asynchronous operations should provide feedback.

Example:

Checking availability...

Then:

✓ Mentor found!

Errors should explain what happened and what the user can do next.

Empty states should clearly explain that no data is currently available.

🧪 97. FINAL VERIFICATION CHECKLIST

Environment

Node.js installed

npm installed

Git installed

Database installed/configured

Browser available

Internet available

Installation

Backend dependencies installed

Frontend dependencies installed

Environment variables configured

Database configured

Migrations executed

Seed data inserted

Backend

Backend starts

API responds

Health endpoint works

Database connection works

Frontend

Frontend starts

Homepage loads

Booking flow works

Responsive UI works

Booking

Booking works

Mentor assigned

Capacity enforced

Duplicate booking prevented

Concurrent booking protected

Transaction works

Timezone

Parent timezone works

Mentor timezone works

UTC storage works

Local conversion works

DST works

Date boundary works

Recommendation

Best-time recommendation works

Availability considered

Capacity considered

Alternatives generated

Classroom

Classroom route works

Booking validated

Countdown works

Join button works

Cancelled booking cannot join

Each booking has a unique classroom/meeting reference

Google

OAuth configured

Redirect URI configured

Required APIs enabled

Calendar integration tested if enabled

Meet integration tested if enabled

No credentials committed

Email

Parent email works

Mentor email works

Correct timezone displayed

Correct classroom/meeting link included

Email failure handled correctly

Admin

Dashboard works

Mentor load works

Upcoming classes work

Analytics work

Statistics use actual data

Rescheduling

Change booking works

Old slot released

New slot validated

Mentor reassignment works

Meeting/classroom updated

Notifications updated

Cancellation

Cancellation works

Capacity released

Classroom access disabled

Status updated

Quality

Loading states work

Error states work

Empty states work

Success states work

Animations work

Reduced-motion behavior works

Mobile UI works

Tests pass

Production build succeeds

📚 98. GOOGLE DOCUMENTATION

Google OAuth Web Server Applications:

https://developers.google.com/identity/protocols/oauth2/web-server

Google Calendar API:

https://developers.google.com/workspace/calendar/api

Google Calendar Event Creation:

https://developers.google.com/workspace/calendar/api/guides/create-events

Google Meet REST API:

https://developers.google.com/workspace/meet/api/guides/overview

Google Workspace Credentials:

https://developers.google.com/workspace/guides/create-credentials

🔮 99. FUTURE IMPROVEMENTS

Possible future improvements include:

Parent authentication

Mentor authentication

Role-based access control

Real-time mentor availability

Automated reminders

SMS notifications

WhatsApp notifications

Student profiles

Mentor ratings

Post-class feedback

Attendance tracking

Class recordings

Payment integration

Advanced analytics

Audit logging

Multi-language support

Multiple meeting providers

Calendar synchronization

⚠️ 100. IMPORTANT DEVELOPMENT NOTES

Never commit secrets.

Never use one global meeting link for every booking.

Store booking timestamps consistently in UTC.

Convert UTC to local time only for display.

Do not rely only on frontend validation.

Critical booking logic must run on the backend.

Mentor capacity must be enforced transactionally.

Duplicate bookings must be prevented.

Email failure must not corrupt a committed booking.

Google Meet should only be described as real Google Meet functionality when the required Google APIs and OAuth configuration are actually enabled.

Seed/demo information should not be represented as real production information.

Keep this README synchronized with the actual implementation.

📄 101. PROJECT STATUS

This project demonstrates a complete full-stack trial-class booking workflow involving:

Frontend
+
Backend
+
Database
+
Scheduling
+
Timezone Management
+
DST Handling
+
Mentor Allocation
+
Capacity Management
+
Concurrency Protection
+
Email Notifications
+
Google OAuth
+
Google Calendar
+
Google Meet
+
Classroom
+
Analytics
+
Admin Operations
+
Security
+
Testing

The objective is to demonstrate both a polished user experience and reliable backend engineering.

🎓 CODEYOUNG TRIAL CLASS BOOKING PLATFORM

Learn. Create. Build the future.
