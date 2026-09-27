# CodeYoung Trial Class Booking System

A full-stack trial class booking platform built for the CodeYoung technical assignment.

The application allows parents to select a learning domain, enter their details, choose their timezone and preferred date/time, view eligible mentors, select an available mentor, and book a trial class.

The backend is authoritative for mentor eligibility, availability, capacity, conflict checking, timezone conversion, and final booking creation.

---

# 1. Project Overview

The CodeYoung Trial Class Booking System provides a complete trial-class scheduling workflow.

The main flow is:

```text
Parent Details
      ↓
Course / Domain Selection
      ↓
Timezone Selection
      ↓
Date & Time Selection
      ↓
Availability Check
      ↓
Available Mentors
      ↓
Parent Selects Mentor
      ↓
Backend Revalidates Mentor
      ↓
Booking Created
      ↓
Google Meet / Meeting Link
      ↓
Confirmation
