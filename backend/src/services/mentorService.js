import { DateTime } from "luxon";
import { db } from "../db/database.js";
import { toLocal } from "../utils/timezone.js";

const BOOKING_LOOKAROUND_DAYS = 2;

function getRelevantBookings(startUtc, endUtc) {
  const rangeStart = startUtc
    .minus({ days: BOOKING_LOOKAROUND_DAYS })
    .toISO();

  const rangeEnd = endUtc
    .plus({ days: BOOKING_LOOKAROUND_DAYS })
    .toISO();

  return db
    .prepare(`
      SELECT
        id,
        mentor_id,
        start_time_utc,
        end_time_utc
      FROM bookings
      WHERE status = 'CONFIRMED'
        AND start_time_utc < ?
        AND end_time_utc > ?
    `)
    .all(rangeEnd, rangeStart);
}

function isOverlapping(booking, startUtc, endUtc) {
  return (
    booking.start_time_utc < endUtc.toISO() &&
    booking.end_time_utc > startUtc.toISO()
  );
}

function getLocalDate(utcIso, timezone) {
  return toLocal(utcIso, timezone).toISODate();
}

function isWithinMentorWorkingHours(
  startUtc,
  endUtc,
  mentor
) {
  const mentorStart = toLocal(
    startUtc.toISO(),
    mentor.timezone
  );

  const mentorEnd = toLocal(
    endUtc.toISO(),
    mentor.timezone
  );

  /*
   * The trial class must stay on the mentor's local calendar day.
   */
  if (mentorStart.toISODate() !== mentorEnd.toISODate()) {
    return false;
  }

  const requestedStart = mentorStart.toFormat("HH:mm");
  const requestedEnd = mentorEnd.toFormat("HH:mm");

  return (
    requestedStart >= mentor.availability_start &&
    requestedEnd <= mentor.availability_end
  );
}

function buildMentorAvailability(
  mentors,
  bookings,
  startUtc,
  endUtc
) {
  const requestedUtc = startUtc.toISO();
  const result = [];

  for (const mentor of mentors) {
    const mentorDate = getLocalDate(
      requestedUtc,
      mentor.timezone
    );

    const mentorBookings = bookings.filter(
      (booking) => booking.mentor_id === mentor.id
    );

    const dailyCount = mentorBookings.filter(
      (booking) =>
        getLocalDate(
          booking.start_time_utc,
          mentor.timezone
        ) === mentorDate
    ).length;

    const hasConflict = mentorBookings.some(
      (booking) =>
        isOverlapping(
          booking,
          startUtc,
          endUtc
        )
    );

    const withinWorkingHours =
      isWithinMentorWorkingHours(
        startUtc,
        endUtc,
        mentor
      );

    if (
      dailyCount < mentor.max_classes_per_day &&
      !hasConflict &&
      withinWorkingHours
    ) {
      result.push({
        ...mentor,
        dailyBookingCount: dailyCount,
      });
    }
  }

  return result;
}

export function findAvailableMentors(
  startUtc,
  endUtc,
  course = null
) {
  let mentors;

  if (course) {
    mentors = db
      .prepare(`
        SELECT
          m.id,
          m.name,
          m.email,
          m.timezone,
          m.max_classes_per_day,
          m.rating,
          m.availability_start,
          m.availability_end
        FROM mentors m
        INNER JOIN mentor_courses mc
          ON mc.mentor_id = m.id
        INNER JOIN courses c
          ON c.id = mc.course_id
        WHERE m.active = 1
          AND c.active = 1
          AND c.name = ?
        ORDER BY m.id
      `)
      .all(course);
  } else {
    mentors = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          timezone,
          max_classes_per_day,
          rating,
          availability_start,
          availability_end
        FROM mentors
        WHERE active = 1
        ORDER BY id
      `)
      .all();
  }

  if (mentors.length === 0) {
    return [];
  }

  const bookings = getRelevantBookings(
    startUtc,
    endUtc
  );

  return buildMentorAvailability(
    mentors,
    bookings,
    startUtc,
    endUtc
  );
}

export function selectMentor(mentors) {
  if (mentors.length === 0) {
    return null;
  }

  /*
   * Assignment remains backend-controlled and deterministic.
   *
   * First prefer the mentor with the lowest daily load.
   * If loads are equal, use the mentor rating.
   * If ratings are also equal, use the stable mentor id.
   */
  return [...mentors].sort(
    (a, b) =>
      a.dailyBookingCount - b.dailyBookingCount ||
      b.rating - a.rating ||
      a.id - b.id
  )[0];
}

export function getMentorTodayStats() {
  const mentors = db
    .prepare(`
      SELECT
        id,
        name,
        timezone,
        max_classes_per_day,
        active,
        rating,
        availability_start,
        availability_end
      FROM mentors
      ORDER BY id
    `)
    .all();

  return mentors.map((mentor) => {
    const localToday = DateTime
      .now()
      .setZone(mentor.timezone);

    const dayStartUtc = localToday
      .startOf("day")
      .toUTC()
      .toISO();

    const dayEndUtc = localToday
      .endOf("day")
      .toUTC()
      .toISO();

    const count = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM bookings
        WHERE mentor_id = ?
          AND status = 'CONFIRMED'
          AND start_time_utc >= ?
          AND start_time_utc <= ?
      `)
      .get(
        mentor.id,
        dayStartUtc,
        dayEndUtc
      ).count;

    return {
      ...mentor,
      dailyBookingCount: count,
      availableToday: Boolean(
        mentor.active &&
        count < mentor.max_classes_per_day
      ),
    };
  });
}