import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { getBookings, getMentorStats } from "../services/api.js";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getBookings(), getMentorStats()])
      .then(([bookingResult, mentorResult]) => {
        setBookings(bookingResult.data);
        setMentors(mentorResult.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <div className="page-heading compact">
        <span className="eyebrow">DEMO VIEW</span>
        <h1>Booking overview</h1>
        <p>Inspect mentor load, assignments and timezone conversions.</p>
      </div>

      {error && <div className="message error">{error}</div>}

      <div className="mentor-grid">
        {mentors.map((mentor) => (
          <div className="mentor-card" key={mentor.id}>
            <strong>{mentor.name}</strong>
            <span>{mentor.timezone}</span>
            <div>
              {mentor.dailyBookingCount}/{mentor.max_classes_per_day} classes today
            </div>
            <small className={mentor.availableToday ? "available-text" : "full-text"}>
              {mentor.availableToday ? "Available" : "Daily limit reached"}
            </small>
          </div>
        ))}
      </div>

      {bookings.length === 0 && !error ? (
        <div className="empty-state">No bookings have been created yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Parent</th>
                <th>Mentor</th>
                <th>Parent time</th>
                <th>Mentor time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const utc = DateTime.fromISO(booking.start_time_utc, { zone: "utc" });
                return (
                  <tr key={booking.id}>
                    <td>{booking.parent_name}</td>
                    <td>{booking.mentor_name}</td>
                    <td>
                      {utc.setZone(booking.parent_timezone).toFormat("dd LLL, hh:mm a")}
                      <small>{booking.parent_timezone}</small>
                    </td>
                    <td>
                      {utc.setZone(booking.mentor_timezone).toFormat("dd LLL, hh:mm a")}
                      <small>{booking.mentor_timezone}</small>
                    </td>
                    <td><span className="badge">{booking.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
