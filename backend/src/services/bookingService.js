import crypto from "node:crypto";
import { DateTime } from "luxon";
import { db } from "../db/database.js";
import {
  findAvailableMentors,
  selectMentor
} from "./mentorService.js";
import {
  isValidTimezone,
  toUtc
} from "../utils/timezone.js";

export const CLASS_DURATION_MINUTES = 60;
export const MIN_BOOKING_NOTICE_MINUTES = 5;

function fail(message, statusCode = 400) {
  throw Object.assign(
    new Error(message),
    { statusCode }
  );
}

function validateRequest({
  name,
  email,
  course,
  timezone,
  startTime
}) {
  if (
    !name ||
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 20
  ) {
    fail("Please enter a valid parent name.");
  }

  if (
    !email ||
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    fail("Please enter a valid email address.");
  }

  if (
    !course ||
    typeof course !== "string" ||
    course.trim().length === 0
  ) {
    fail("Please select a course or domain.");
  }

  const selectedCourse = db
    .prepare(`
      SELECT
        id,
        name,
        description
      FROM courses
      WHERE name = ?
        AND active = 1
    `)
    .get(course.trim());

  if (!selectedCourse) {
    fail("Please select a valid course or domain.");
  }

  if (!isValidTimezone(timezone)) {
    fail("Please select a valid timezone.");
  }

  if (
    !startTime ||
    typeof startTime !== "string"
  ) {
    fail("Please select a valid date and time.");
  }

  return selectedCourse;
}

function generateMeetingLink() {
  return `https://demo.codeyoung.com/class/${crypto
    .randomBytes(8)
    .toString("hex")}`;
}

function findOrCreateParent(
  name,
  email,
  timezone
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const existing = db
    .prepare(`
      SELECT id
      FROM parents
      WHERE email = ?
    `)
    .get(normalizedEmail);

  if (existing) {
    db.prepare(`
      UPDATE parents
      SET
        name = ?,
        timezone = ?
      WHERE id = ?
    `).run(
      name.trim(),
      timezone,
      existing.id
    );

    return db
      .prepare(`
        SELECT *
        FROM parents
        WHERE id = ?
      `)
      .get(existing.id);
  }

  const result = db
    .prepare(`
      INSERT INTO parents (
        name,
        email,
        timezone
      )
      VALUES (?, ?, ?)
    `)
    .run(
      name.trim(),
      normalizedEmail,
      timezone
    );

  return db
    .prepare(`
      SELECT *
      FROM parents
      WHERE id = ?
    `)
    .get(result.lastInsertRowid);
}

function assertFuture(startUtc) {
  const minimum = DateTime.utc().plus({
    minutes: MIN_BOOKING_NOTICE_MINUTES
  });

  if (startUtc <= minimum) {
    fail(
      `Please choose a time at least ${MIN_BOOKING_NOTICE_MINUTES} minutes from now.`
    );
  }
}

function withImmediateTransaction(work) {
  db.exec("BEGIN IMMEDIATE");

  try {
    const result = work();

    db.exec("COMMIT");

    return result;
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      // Transaction may already have been rolled back.
    }

    throw error;
  }
}

/*
 * Find the mentor requested by the parent from the
 * already verified list of available mentors.
 *
 * This is deliberately done inside the transaction so
 * the mentor's availability is checked again immediately
 * before the booking is inserted.
 */
function selectRequestedMentor(
  eligibleMentors,
  mentorId
) {
  if (
    mentorId === undefined ||
    mentorId === null ||
    mentorId === ""
  ) {
    /*
     * Backward-compatible fallback:
     * if no mentor was explicitly selected,
     * use the existing automatic assignment logic.
     */
    return selectMentor(
      eligibleMentors
    );
  }

  const requestedMentorId =
    Number(mentorId);

  if (
    !Number.isInteger(
      requestedMentorId
    ) ||
    requestedMentorId <= 0
  ) {
    fail(
      "Invalid mentor selection.",
      400
    );
  }

  const mentor =
    eligibleMentors.find(
      (item) =>
        Number(item.id) ===
        requestedMentorId
    );

  if (!mentor) {
    fail(
      "The selected mentor is no longer available for this time. Please choose another available mentor.",
      409
    );
  }

  return mentor;
}

export function createBooking(input) {
  const selectedCourse =
    validateRequest(input);

  /*
   * Convert parent's selected local time
   * into the single authoritative UTC value.
   */
  const startUtc = toUtc(
    input.startTime,
    input.timezone
  );

  assertFuture(startUtc);

  const endUtc = startUtc.plus({
    minutes:
      CLASS_DURATION_MINUTES
  });

  return withImmediateTransaction(() => {
    const parent =
      findOrCreateParent(
        input.name,
        input.email,
        input.timezone
      );

    /*
     * Prevent the same parent from having
     * overlapping confirmed classes.
     */
    const duplicate = db
      .prepare(`
        SELECT
          id
        FROM bookings
        WHERE parent_id = ?
          AND status = 'CONFIRMED'
          AND start_time_utc < ?
          AND end_time_utc > ?
        LIMIT 1
      `)
      .get(
        parent.id,
        endUtc.toISO(),
        startUtc.toISO()
      );

    if (duplicate) {
      fail(
        "You already have another trial class booked at this time. Please select another time.",
        409
      );
    }

    /*
     * IMPORTANT:
     *
     * Availability is checked again inside the
     * transaction. The frontend availability result
     * is never trusted as the final authority.
     */
    const eligibleMentors =
      findAvailableMentors(
        startUtc,
        endUtc,
        selectedCourse.name
      );

    if (
      !eligibleMentors ||
      eligibleMentors.length === 0
    ) {
      fail(
        `No mentors are available for ${selectedCourse.name} at this time. Please choose another time or date.`,
        409
      );
    }

    /*
     * If the parent selected a mentor, use that
     * mentor ONLY if that mentor is still eligible.
     *
     * Otherwise return 409 rather than silently
     * assigning a different mentor.
     */
    const mentor =
      selectRequestedMentor(
        eligibleMentors,
        input.mentorId
      );

    if (!mentor) {
      fail(
        "No mentor is available for the selected time. Please choose another time.",
        409
      );
    }

    const meetingLink =
      generateMeetingLink();

    /*
     * Insert the booking only after:
     *
     * 1. Parent validation
     * 2. Course validation
     * 3. Timezone conversion
     * 4. Future-time validation
     * 5. Duplicate-parent check
     * 6. Course-specific mentor availability
     * 7. Selected mentor validation
     *
     * All of this happens while SQLite is holding
     * the immediate writer transaction.
     */
    const result = db
      .prepare(`
        INSERT INTO bookings (
          parent_id,
          mentor_id,
          course_id,
          start_time_utc,
          end_time_utc,
          status,
          meeting_link
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          'CONFIRMED',
          ?
        )
      `)
      .run(
        parent.id,
        mentor.id,
        selectedCourse.id,
        startUtc.toISO(),
        endUtc.toISO(),
        meetingLink
      );

    return {
      id: Number(
        result.lastInsertRowid
      ),

      parent,

      course: selectedCourse,

      mentor,

      startTimeUtc:
        startUtc.toISO(),

      endTimeUtc:
        endUtc.toISO(),

      meetingLink
    };
  });
}

export function getBookingById(id) {
  return db
    .prepare(`
      SELECT
        b.*,

        p.name AS parent_name,
        p.email AS parent_email,
        p.timezone AS parent_timezone,

        m.name AS mentor_name,
        m.email AS mentor_email,
        m.timezone AS mentor_timezone,
        m.rating AS mentor_rating,

        c.name AS course_name,
        c.description AS course_description

      FROM bookings b

      JOIN parents p
        ON p.id = b.parent_id

      JOIN mentors m
        ON m.id = b.mentor_id

      LEFT JOIN courses c
        ON c.id = b.course_id

      WHERE b.id = ?
    `)
    .get(id);
}

export function listBookings() {
  return db
    .prepare(`
      SELECT
        b.id,
        b.start_time_utc,
        b.end_time_utc,
        b.status,
        b.meeting_link,

        p.name AS parent_name,
        p.email AS parent_email,
        p.timezone AS parent_timezone,

        m.name AS mentor_name,
        m.timezone AS mentor_timezone,
        m.rating AS mentor_rating,

        c.name AS course_name,
        c.description AS course_description

      FROM bookings b

      JOIN parents p
        ON p.id = b.parent_id

      JOIN mentors m
        ON m.id = b.mentor_id

      LEFT JOIN courses c
        ON c.id = b.course_id

      ORDER BY b.start_time_utc DESC
    `)
    .all();
}