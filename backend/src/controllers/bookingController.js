import { DateTime } from "luxon";
import { db } from "../db/database.js";
import {
  createBooking,
  getBookingById,
  listBookings
} from "../services/bookingService.js";
import { createGoogleMeetEvent } from "../services/googleCalendarService.js";
import { sendBookingConfirmationEmail } from "../services/emailService.js";
import { findAvailableMentors } from "../services/mentorService.js";
import { isValidTimezone, toUtc } from "../utils/timezone.js";

export function getMentors(req, res) {
  const mentors = db.prepare(`
    SELECT
      id,
      name,
      email,
      timezone,
      max_classes_per_day,
      rating,
      active
    FROM mentors
    WHERE active = 1
    ORDER BY id
  `).all();

  res.json({
    success: true,
    data: mentors
  });
}

export function getAvailability(req, res, next) {
  try {
    const {
      startTime,
      timezone,
      course,
      email
    } = req.query;

    // --------------------------------------------------
    // Validate availability request
    // --------------------------------------------------
    if (
      !startTime ||
      !isValidTimezone(timezone) ||
      !course ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A valid startTime, timezone, course and email are required."
      });
    }

    // --------------------------------------------------
    // Convert parent's local time to UTC
    // --------------------------------------------------
    const startUtc = toUtc(startTime, timezone);
    const endUtc = startUtc.plus({ minutes: 60 });

    // --------------------------------------------------
    // Check whether this parent already has a booking
    // overlapping this time.
    //
    // UTC comparison ensures different timezones and DST
    // are handled correctly.
    // --------------------------------------------------
    const existingParentBooking = db.prepare(`
      SELECT
        b.id,
        b.start_time_utc,
        b.end_time_utc
      FROM bookings b
      INNER JOIN parents p
        ON p.id = b.parent_id
      WHERE LOWER(TRIM(p.email)) = LOWER(TRIM(?))
        AND b.status = 'CONFIRMED'
        AND b.start_time_utc < ?
        AND b.end_time_utc > ?
      LIMIT 1
    `).get(
      email,
      endUtc.toISO(),
      startUtc.toISO()
    );

    // --------------------------------------------------
    // Same parent already has a class at this time
    // --------------------------------------------------
    if (existingParentBooking) {
      return res.json({
        success: true,
        data: {
          startTimeUtc: startUtc.toISO(),
          endTimeUtc: endUtc.toISO(),
          available: false,
          availableMentorCount: 0,
          reason: "PARENT_ALREADY_BOOKED",
          message:
            "You already have a trial class booked at this time. Please choose another time."
        }
      });
    }

    // --------------------------------------------------
    // Find mentors who:
    // - teach the selected course
    // - are active
    // - are within working hours
    // - have no overlapping booking
    // - have not reached their daily capacity
    // --------------------------------------------------
    const mentors = findAvailableMentors(
      startUtc,
      endUtc,
      course
    );

    res.json({
      success: true,
      data: {
        startTimeUtc: startUtc.toISO(),
        endTimeUtc: endUtc.toISO(),
        available: mentors.length > 0,
        availableMentorCount: mentors.length,
        mentors: mentors.map((mentor) => ({
          id: mentor.id,
          name: mentor.name,
          rating: mentor.rating,
          timezone: mentor.timezone,
          dailyBookingCount: mentor.dailyBookingCount
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

// ======================================================
// GET TIMES ALREADY BOOKED BY THIS PARENT
// ======================================================
//
// Example:
// GET /api/bookings/parent/times
//     ?email=parent@gmail.com
//     &date=2026-09-28
//     &timezone=Asia/Kolkata
//
// Returns:
//
// {
//   success: true,
//   data: {
//     date: "2026-09-28",
//     timezone: "Asia/Kolkata",
//     bookedTimes: ["10:00", "14:00"]
//   }
// }
//
// These times will be hidden from the frontend.
//
// IMPORTANT:
// This is based on parent email + date + time.
// Course does NOT matter.
//
// If a parent already booked:
//
// Python Programming - 10:00
//
// then:
//
// Web Development - 10:00
//
// should also be hidden for the same parent.
//
export function getParentBookedTimes(req, res, next) {
  try {
    const {
      email,
      date,
      timezone
    } = req.query;

    // --------------------------------------------------
    // Validate email
    // --------------------------------------------------
    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required."
      });
    }

    // --------------------------------------------------
    // Validate date
    // --------------------------------------------------
    if (
      !date ||
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid date is required."
      });
    }

    // --------------------------------------------------
    // Validate timezone
    // --------------------------------------------------
    if (!isValidTimezone(timezone)) {
      return res.status(400).json({
        success: false,
        message: "A valid timezone is required."
      });
    }

    // --------------------------------------------------
    // Determine the complete selected day in the
    // parent's timezone.
    //
    // We deliberately convert the day boundaries to UTC
    // instead of assuming a fixed UTC offset.
    //
    // This keeps the logic correct across DST changes.
    // --------------------------------------------------
    const dayStart = DateTime
      .fromISO(date, {
        zone: timezone
      })
      .startOf("day");

    const dayEnd = dayStart.plus({
      days: 1
    });

    const startUtc = dayStart
      .toUTC()
      .toISO();

    const endUtc = dayEnd
      .toUTC()
      .toISO();

    // --------------------------------------------------
    // Find this parent's confirmed bookings for the
    // selected local day.
    // --------------------------------------------------
    const bookings = db.prepare(`
      SELECT
        b.start_time_utc,
        b.end_time_utc
      FROM bookings b
      INNER JOIN parents p
        ON p.id = b.parent_id
      WHERE LOWER(TRIM(p.email)) = LOWER(TRIM(?))
        AND b.status = 'CONFIRMED'
        AND b.start_time_utc >= ?
        AND b.start_time_utc < ?
      ORDER BY b.start_time_utc
    `).all(
      email.trim(),
      startUtc,
      endUtc
    );

    // --------------------------------------------------
    // Convert every booking back into the parent's
    // selected timezone.
    // --------------------------------------------------
    const bookedTimes = bookings.map((booking) => {
      return DateTime
        .fromISO(booking.start_time_utc, {
          zone: "utc"
        })
        .setZone(timezone)
        .toFormat("HH:mm");
    });

    res.json({
      success: true,
      data: {
        date,
        timezone,
        bookedTimes
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function postBooking(req, res, next) {
  try {
    // --------------------------------------------------
    // 1. Create the booking
    // --------------------------------------------------
    // This performs:
    // - Request validation
    // - Course validation
    // - Timezone conversion
    // - Future-time validation
    // - Duplicate booking check
    // - Mentor availability check
    // - Mentor assignment
    // - SQLite transaction
    // - Booking insertion
    const booking = createBooking(req.body);

    // --------------------------------------------------
    // 2. Create the REAL Google Meet event
    // --------------------------------------------------
    //
    // The database booking is already committed at this
    // point. We now create the Google Calendar event.
    //
    // The same Google Meet link is shared with:
    // - Parent
    // - Mentor
    //
    let meetingLink = booking.meetingLink;

    try {
      const googleMeet = await createGoogleMeetEvent({
        bookingId: booking.id,

        courseName:
          booking.course?.name ||
          req.body.course ||
          "CodeYoung Trial Class",

        parent: {
          name: booking.parent.name,
          email: booking.parent.email
        },

        mentor: {
          name: booking.mentor.name,
          email: booking.mentor.email
        },

        startTimeUtc: booking.startTimeUtc,
        endTimeUtc: booking.endTimeUtc
      });

      meetingLink = googleMeet.meetingLink;

      // ------------------------------------------------
      // Update the database with the REAL Google Meet
      // link.
      // ------------------------------------------------
      db.prepare(`
        UPDATE bookings
        SET meeting_link = ?
        WHERE id = ?
      `).run(
        meetingLink,
        booking.id
      );

      // Keep the response/email object in sync.
      booking.meetingLink = meetingLink;

      console.log(
        `Google Meet created for booking #${booking.id}: ${meetingLink}`
      );
    } catch (googleError) {
      console.error(
        `Booking #${booking.id} was created, but Google Meet creation failed:`,
        googleError.response?.data || googleError.message
      );

      // Do NOT send an email containing the old dummy link.
      return res.status(502).json({
        success: false,
        message:
          "Your booking was created, but we could not create the Google Meet link. Please contact support or try another booking.",
        bookingId: booking.id
      });
    }

    // --------------------------------------------------
    // 3. Send confirmation email
    // --------------------------------------------------
    //
    // The email now contains the REAL Google Meet link.
    //
    // emailService already sends the message to:
    // - Parent
    // - Mentor
    //
    try {
      await sendBookingConfirmationEmail({
        booking,
        meetingLink
      });

      console.log(
        `Confirmation email sent to ${booking.parent.email} and ${booking.mentor.email}`
      );
    } catch (emailError) {
      // Email failure does NOT cancel the booking.
      //
      // The Google Meet link is still stored in the database
      // and returned to the frontend.
      console.error(
        `Booking #${booking.id} was created and Google Meet was created, but confirmation email failed:`,
        emailError.message
      );
    }

    // --------------------------------------------------
    // 4. Return successful booking response
    // --------------------------------------------------
    res.status(201).json({
      success: true,
      data: {
        bookingId: booking.id,

        parent: {
          name: booking.parent.name,
          email: booking.parent.email,
          timezone: booking.parent.timezone
        },

        mentor: {
          name: booking.mentor.name,
          timezone: booking.mentor.timezone,
          rating: booking.mentor.rating
        },

        course: booking.course
          ? {
              name: booking.course.name,
              description: booking.course.description
            }
          : null,

        startTimeUtc: booking.startTimeUtc,
        endTimeUtc: booking.endTimeUtc,

        // REAL GOOGLE MEET LINK
        meetingLink
      }
    });
  } catch (error) {
    next(error);
  }
}

export function getBooking(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking id."
    });
  }

  const booking = getBookingById(id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found."
    });
  }

  res.json({
    success: true,
    data: booking
  });
}

export function getBookings(req, res) {
  res.json({
    success: true,
    data: listBookings()
  });
}