import { useEffect, useState } from "react";
import { DateTime } from "luxon";

const API_BASE_URL = "http://localhost:4000/api";

export default function DemoClassPage({ bookingId }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(null);

  /*
   * -------------------------------------------------------
   * Load booking
   * -------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    async function loadBooking() {
      if (!bookingId || bookingId === "undefined") {
        setError(
          "The demo class link does not contain a valid booking ID."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/bookings/${encodeURIComponent(
            bookingId
          )}`
        );

        let result;

        try {
          result = await response.json();
        } catch {
          throw new Error(
            "The server returned an invalid response."
          );
        }

        if (!response.ok) {
          throw new Error(
            result?.error ||
              result?.message ||
              "Unable to load the demo class."
          );
        }

        const bookingData = result?.data;

        if (!bookingData) {
          throw new Error(
            "Booking details were not returned."
          );
        }

        if (!cancelled) {
          setBooking(bookingData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load the demo class."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBooking();

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  /*
   * -------------------------------------------------------
   * Countdown
   *
   * IMPORTANT:
   *
   * We calculate the countdown using the booking's UTC
   * start time.
   *
   * Therefore parent and mentor always have the SAME
   * countdown, even if they are in different timezones.
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!booking?.start_time_utc) {
      return;
    }

    const startUtcMillis = DateTime.fromISO(
      booking.start_time_utc,
      {
        zone: "utc",
      }
    ).toMillis();

    function updateCountdown() {
      const nowUtcMillis = Date.now();

      const differenceMillis =
        startUtcMillis - nowUtcMillis;

      const seconds = Math.max(
        0,
        Math.ceil(differenceMillis / 1000)
      );

      setRemainingSeconds(seconds);
    }

    updateCountdown();

    const interval = setInterval(
      updateCountdown,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [booking]);

  /*
   * -------------------------------------------------------
   * Loading
   * -------------------------------------------------------
   */

  if (loading) {
    return (
      <main className="demo-class-page">
        <section className="demo-class-card">
          <div className="demo-icon">🎓</div>

          <p className="demo-label">
            CODEYOUNG DEMO CLASS
          </p>

          <h1>
            Loading your demo class...
          </h1>

          <p className="muted">
            Please wait while we load your class
            details.
          </p>
        </section>
      </main>
    );
  }

  /*
   * -------------------------------------------------------
   * Error
   * -------------------------------------------------------
   */

  if (error) {
    return (
      <main className="demo-class-page">
        <section className="demo-class-card">
          <div className="demo-icon">⚠️</div>

          <p className="demo-label">
            CODEYOUNG DEMO CLASS
          </p>

          <h1>
            Unable to load demo class
          </h1>

          <p className="muted">
            {error}
          </p>

          <a
            className="join-button"
            href="/"
          >
            Back to booking
          </a>
        </section>
      </main>
    );
  }

  /*
   * -------------------------------------------------------
   * Convert UTC → parent and mentor local time
   * -------------------------------------------------------
   */

  const startUtc = DateTime.fromISO(
    booking.start_time_utc,
    {
      zone: "utc",
    }
  );

  const parentTime = startUtc
    .setZone(booking.parent_timezone)
    .toFormat("dd LLL yyyy, hh:mm a");

  const mentorTime = startUtc
    .setZone(booking.mentor_timezone)
    .toFormat("dd LLL yyyy, hh:mm a");

  /*
   * -------------------------------------------------------
   * Countdown formatting
   * -------------------------------------------------------
   */

  const safeRemainingSeconds =
    remainingSeconds ?? 0;

  const hours = Math.floor(
    safeRemainingSeconds / 3600
  );

  const minutes = Math.floor(
    (safeRemainingSeconds % 3600) / 60
  );

  const seconds =
    safeRemainingSeconds % 60;

  const formattedHours =
    String(hours).padStart(2, "0");

  const formattedMinutes =
    String(minutes).padStart(2, "0");

  const formattedSeconds =
    String(seconds).padStart(2, "0");

  const classStarted =
    remainingSeconds !== null &&
    remainingSeconds <= 0;

  /*
   * -------------------------------------------------------
   * Same class link for parent + mentor
   *
   * This points to the public demo page.
   * -------------------------------------------------------
   */

  const demoClassLink =
    `${window.location.origin}/demo-class/${booking.id}`;

  return (
    <main className="demo-class-page">
      <section className="demo-class-card">

        <div className="demo-icon">
          🎓
        </div>

        <p className="demo-label">
          CODEYOUNG DEMO CLASS
        </p>

        {/* -------------------------------------------------
            Class status
            ------------------------------------------------- */}

        {!classStarted ? (
          <>
            <h1>
              Your trial class is scheduled
            </h1>

            <p className="muted">
              Your mentor has been assigned.
              Please return when the countdown
              reaches zero.
            </p>

            {/* Countdown */}

            <div
              className="class-countdown"
              aria-live="polite"
            >
              <p className="countdown-label">
                Class starts in
              </p>

              <div className="countdown-timer">
                <div className="countdown-unit">
                  <strong>
                    {formattedHours}
                  </strong>

                  <span>
                    HOURS
                  </span>
                </div>

                <div className="countdown-separator">
                  :
                </div>

                <div className="countdown-unit">
                  <strong>
                    {formattedMinutes}
                  </strong>

                  <span>
                    MINUTES
                  </span>
                </div>

                <div className="countdown-separator">
                  :
                </div>

                <div className="countdown-unit">
                  <strong>
                    {formattedSeconds}
                  </strong>

                  <span>
                    SECONDS
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1>
              Your trial class is ready! 🎉
            </h1>

            <p className="muted">
              Your class has started. You can
              now join the demo class.
            </p>
          </>
        )}

        {/* -------------------------------------------------
            Booking details
            ------------------------------------------------- */}

        <div className="demo-details">

          <div>
            <span>
              Parent
            </span>

            <strong>
              {booking.parent_name}
            </strong>
          </div>

          <div>
            <span>
              Mentor
            </span>

            <strong>
              {booking.mentor_name}
            </strong>
          </div>

          <div>
            <span>
              Parent local time
            </span>

            <strong>
              {parentTime}
            </strong>

            <small>
              {booking.parent_timezone}
            </small>
          </div>

          <div>
            <span>
              Mentor local time
            </span>

            <strong>
              {mentorTime}
            </strong>

            <small>
              {booking.mentor_timezone}
            </small>
          </div>

          <div>
            <span>
              Booking status
            </span>

            <strong>
              <span className="status-badge success">
                {booking.status}
              </span>
            </strong>
          </div>

          <div>
            <span>
              Booking ID
            </span>

            <strong>
              #{booking.id}
            </strong>
          </div>

        </div>

        {/* -------------------------------------------------
            Demo meeting
            ------------------------------------------------- */}

        <div className="demo-message">

          <strong>
            Demo meeting
          </strong>

          <p>
            The parent and mentor use the same
            class link. Their displayed times may
            differ because of their timezones, but
            the class starts at the same moment.
          </p>

          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              borderRadius: "8px",
              background: "#f8fafc",
              wordBreak: "break-all",
            }}
          >
            <strong>
              Class link
            </strong>

            <br />

            <a
              href={demoClassLink}
              target="_blank"
              rel="noreferrer"
            >
              {demoClassLink}
            </a>
          </div>

        </div>

        {/* -------------------------------------------------
            Actions
            ------------------------------------------------- */}

        <div className="confirmation-actions">

          {classStarted ? (
            <a
              className="join-button"
              href={demoClassLink}
              target="_blank"
              rel="noreferrer"
            >
              Join Demo Class
            </a>
          ) : (
            <button
              className="join-button"
              type="button"
              disabled
              title="The class has not started yet."
            >
              Class Not Started
            </button>
          )}

          <a
            className="secondary-button"
            href="/bookings"
          >
            View demo overview
          </a>

        </div>

      </section>
    </main>
  );
}