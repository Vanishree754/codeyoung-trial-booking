const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: "The server returned an invalid response.",
  }));

  if (!response.ok) {
    throw new Error(
      payload.message || "Request failed."
    );
  }

  return payload;
}

/*
 * Check whether the selected date/time has
 * an available mentor for the selected course.
 */
export function checkAvailability(
  startTime,
  timezone,
  course,
  email
) {
  const params = new URLSearchParams({
    startTime,
    timezone,
    course,
    email,
  });

  return request(
    `/availability?${params.toString()}`
  );
}

/*
 * Get times already booked by the current parent.
 *
 * Important:
 * The backend checks:
 *   parent email
 *   selected date
 *   parent timezone
 *
 * Course is intentionally NOT included.
 *
 * Therefore, if the parent booked:
 *
 * Python Programming - 10:00
 *
 * then 10:00 will also be hidden when
 * they select Web Development.
 */
export function getParentBookedTimes(
  email,
  date,
  timezone
) {
  const params = new URLSearchParams({
    email,
    date,
    timezone,
  });

  return request(
    `/bookings/parent/times?${params.toString()}`
  );
}

/*
 * Create a booking.
 */
export function createBooking(data) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/*
 * Get all bookings.
 */
export function getBookings() {
  return request("/bookings");
}

/*
 * Get mentor statistics.
 */
export function getMentorStats() {
  return request("/mentors/stats");
}