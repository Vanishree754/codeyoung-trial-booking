import { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";

function getRemainingTime(startTimeUtc) {
  const target = DateTime.fromISO(startTimeUtc, {
    zone: "utc",
  });

  if (!target.isValid) {
    return {
      started: false,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const now = DateTime.utc();

  if (target <= now) {
    return {
      started: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.max(
    0,
    Math.floor(target.diff(now, "seconds").seconds)
  );

  return {
    started: false,
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function formatNumber(value) {
  return String(value).padStart(2, "0");
}

function getLocalDateTime(utcTime, timezone) {
  return DateTime.fromISO(utcTime, {
    zone: "utc",
  })
    .setZone(timezone)
    .toFormat("EEE, dd LLL yyyy, h:mm a");
}

function getLocalDate(utcTime, timezone) {
  return DateTime.fromISO(utcTime, {
    zone: "utc",
  })
    .setZone(timezone)
    .toFormat("EEE, dd LLL yyyy");
}

function getLocalTime(utcTime, timezone) {
  return DateTime.fromISO(utcTime, {
    zone: "utc",
  })
    .setZone(timezone)
    .toFormat("h:mm a");
}

export default function BookingConfirmation({
  booking,
  onBookAnother,
}) {
  const [remaining, setRemaining] = useState(() =>
    getRemainingTime(booking.startTimeUtc)
  );

  useEffect(() => {
    const updateCountdown = () => {
      setRemaining(getRemainingTime(booking.startTimeUtc));
    };

    updateCountdown();

    const timer = window.setInterval(
      updateCountdown,
      1000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [booking.startTimeUtc]);

  const bookingId =
    booking.id ?? booking.bookingId;

  const parentTimezone =
    booking.parent?.timezone || "Asia/Kolkata";

  const mentorTimezone =
    booking.mentor?.timezone || "Asia/Kolkata";

  const parentName =
    booking.parent?.name || "Parent";

  const parentEmail =
    booking.parent?.email || "";

  const mentorName =
    booking.mentor?.name || "Assigned Mentor";

  const mentorRating =
    booking.mentor?.rating != null
      ? Number(booking.mentor.rating).toFixed(1)
      : null;

  const courseName =
    booking.course?.name ||
    booking.course ||
    "Trial Class";

  const parentDate = useMemo(
    () =>
      getLocalDate(
        booking.startTimeUtc,
        parentTimezone
      ),
    [booking.startTimeUtc, parentTimezone]
  );

  const parentTime = useMemo(
    () =>
      getLocalTime(
        booking.startTimeUtc,
        parentTimezone
      ),
    [booking.startTimeUtc, parentTimezone]
  );

  const mentorDate = useMemo(
    () =>
      getLocalDate(
        booking.startTimeUtc,
        mentorTimezone
      ),
    [booking.startTimeUtc, mentorTimezone]
  );

  const mentorTime = useMemo(
    () =>
      getLocalTime(
        booking.startTimeUtc,
        mentorTimezone
      ),
    [booking.startTimeUtc, mentorTimezone]
  );

  const parentFullTime = useMemo(
    () =>
      getLocalDateTime(
        booking.startTimeUtc,
        parentTimezone
      ),
    [booking.startTimeUtc, parentTimezone]
  );

  const mentorFullTime = useMemo(
    () =>
      getLocalDateTime(
        booking.startTimeUtc,
        mentorTimezone
      ),
    [booking.startTimeUtc, mentorTimezone]
  );

  /*
   * Prefer the real Google Meet URL returned by the backend.
   *
   * If it is unavailable, fall back to the demo-class page.
   */
  const classroomUrl =
    booking.meetingLink ||
    (bookingId
      ? `/demo-class/${bookingId}`
      : null);

  const isGoogleMeet =
    Boolean(booking.meetingLink);

  return (
    <>
      <style>{`
        .cy-confirmation-page {
          width: 100%;
          min-height: 100vh;
          box-sizing: border-box;
          padding: 48px 20px 70px;
          background:
            radial-gradient(
              circle at top left,
              rgba(99, 102, 241, 0.10),
              transparent 34%
            ),
            radial-gradient(
              circle at top right,
              rgba(236, 72, 153, 0.08),
              transparent 30%
            ),
            #f7f8fc;
          color: #172033;
        }

        .cy-confirmation-container {
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
        }

        .cy-success-card {
          position: relative;
          overflow: hidden;
          text-align: center;
          padding: 46px 30px 40px;
          border-radius: 28px;
          background: #ffffff;
          border: 1px solid #e8eaf2;
          box-shadow:
            0 20px 60px rgba(25, 35, 70, 0.10);
        }

        .cy-success-glow {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.09);
          filter: blur(4px);
          top: -150px;
          left: 50%;
          transform: translateX(-50%);
        }

        .cy-success-icon {
          position: relative;
          width: 76px;
          height: 76px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            #16a34a,
            #22c55e
          );
          color: #ffffff;
          font-size: 36px;
          font-weight: 800;
          box-shadow:
            0 14px 30px rgba(34, 197, 94, 0.25);
        }

        .cy-success-label {
          display: inline-block;
          margin-bottom: 10px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #6366f1;
        }

        .cy-success-card h1 {
          position: relative;
          margin: 0;
          font-size: clamp(30px, 5vw, 44px);
          line-height: 1.1;
          font-weight: 800;
          color: #111827;
        }

        .cy-success-card p {
          position: relative;
          max-width: 620px;
          margin: 14px auto 0;
          font-size: 16px;
          line-height: 1.7;
          color: #667085;
        }

        .cy-countdown {
          margin-top: 24px;
          padding: 26px;
          border-radius: 24px;
          background: linear-gradient(
            135deg,
            #171a3a,
            #292d68
          );
          color: #ffffff;
          box-shadow:
            0 18px 45px rgba(30, 34, 80, 0.20);
        }

        .cy-countdown-title {
          text-align: center;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          opacity: 0.75;
        }

        .cy-countdown-subtitle {
          margin-top: 6px;
          text-align: center;
          font-size: 16px;
          font-weight: 600;
        }

        .cy-countdown-values {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 22px;
        }

        .cy-countdown-unit {
          min-width: 94px;
          padding: 16px 12px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.10);
          text-align: center;
        }

        .cy-countdown-unit strong {
          display: block;
          font-size: 34px;
          line-height: 1;
          font-weight: 800;
        }

        .cy-countdown-unit span {
          display: block;
          margin-top: 8px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          opacity: 0.65;
        }

        .cy-countdown-separator {
          font-size: 30px;
          font-weight: 800;
          opacity: 0.45;
        }

        .cy-ready {
          margin-top: 22px;
          padding: 18px;
          border-radius: 16px;
          background: rgba(34, 197, 94, 0.16);
          text-align: center;
          font-weight: 700;
        }

        .cy-status {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          font-size: 13px;
          opacity: 0.85;
        }

        .cy-status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 0 5px rgba(74, 222, 128, 0.12);
        }

        .cy-section {
          margin-top: 22px;
          padding: 28px;
          border-radius: 24px;
          background: #ffffff;
          border: 1px solid #e8eaf2;
          box-shadow:
            0 12px 35px rgba(25, 35, 70, 0.06);
        }

        .cy-section-heading {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
        }

        .cy-heading-icon {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: #f0f1ff;
          font-size: 23px;
        }

        .cy-eyebrow {
          display: block;
          margin-bottom: 4px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #6366f1;
        }

        .cy-section-heading h2 {
          margin: 0;
          font-size: 22px;
          color: #111827;
        }

        .cy-mentor {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 20px;
          border-radius: 18px;
          background: #f8f9ff;
          border: 1px solid #eaecf8;
        }

        .cy-mentor-avatar {
          width: 68px;
          height: 68px;
          flex: 0 0 68px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            #6366f1,
            #8b5cf6
          );
          color: #ffffff;
          font-size: 30px;
        }

        .cy-mentor-info {
          flex: 1;
          min-width: 0;
        }

        .cy-mentor-info h3 {
          margin: 0;
          font-size: 21px;
          color: #111827;
        }

        .cy-mentor-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px;
          margin-top: 8px;
        }

        .cy-rating {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 9px;
          border-radius: 999px;
          background: #fff7df;
          color: #a16207;
          font-size: 13px;
          font-weight: 800;
        }

        .cy-assigned {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          background: #eaf8ef;
          color: #16803c;
          font-size: 12px;
          font-weight: 800;
        }

        .cy-course {
          margin-top: 7px;
          color: #667085;
          font-size: 14px;
        }

        .cy-time-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: stretch;
          gap: 18px;
        }

        .cy-time-box {
          padding: 24px;
          border-radius: 20px;
          background: #f8f9fc;
          border: 1px solid #e8eaf0;
        }

        .cy-time-role {
          display: block;
          margin-bottom: 9px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.10em;
          color: #667085;
        }

        .cy-time-date {
          display: block;
          color: #475467;
          font-size: 14px;
          font-weight: 600;
        }

        .cy-time-value {
          display: block;
          margin-top: 5px;
          color: #111827;
          font-size: 30px;
          line-height: 1.1;
          font-weight: 800;
        }

        .cy-time-zone {
          display: block;
          margin-top: 8px;
          color: #667085;
          font-size: 13px;
          word-break: break-word;
        }

        .cy-time-connector {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 8px;
          color: #6366f1;
        }

        .cy-time-connector span {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f0f1ff;
          font-size: 18px;
        }

        .cy-time-connector small {
          white-space: nowrap;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #667085;
        }

        .cy-time-note {
          margin-top: 16px;
          padding: 13px 16px;
          border-radius: 12px;
          background: #f4f5ff;
          color: #4f46a5;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
        }

        .cy-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .cy-detail {
          padding: 18px;
          border-radius: 16px;
          background: #f8f9fc;
          border: 1px solid #eaecf0;
        }

        .cy-detail-full {
          grid-column: 1 / -1;
        }

        .cy-detail-label {
          display: block;
          margin-bottom: 7px;
          color: #667085;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .cy-detail strong {
          display: block;
          color: #111827;
          font-size: 16px;
          line-height: 1.5;
        }

        .cy-detail small {
          display: block;
          margin-top: 5px;
          color: #667085;
          font-size: 12px;
          word-break: break-word;
        }

        .cy-status-badge {
          display: inline-flex !important;
          align-items: center;
          width: fit-content;
          padding: 5px 10px;
          border-radius: 999px;
          background: #eaf8ef;
          color: #16803c !important;
          font-size: 12px !important;
          text-transform: uppercase;
        }

        .cy-booking-id {
          color: #6366f1 !important;
          font-family: monospace;
          font-size: 18px !important;
        }

        .cy-classroom {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 28px;
          border-radius: 24px;
          background: linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
          );
          color: #ffffff;
          box-shadow:
            0 18px 45px rgba(79, 70, 229, 0.22);
        }

        .cy-classroom-icon {
          width: 60px;
          height: 60px;
          flex: 0 0 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.14);
          font-size: 28px;
        }

        .cy-classroom-content {
          flex: 1;
        }

        .cy-classroom-content .cy-eyebrow {
          color: rgba(255, 255, 255, 0.68);
        }

        .cy-classroom-content h2 {
          margin: 0;
          font-size: 22px;
        }

        .cy-classroom-content p {
          margin: 7px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 14px;
          line-height: 1.5;
        }

        .cy-join-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-width: 150px;
          padding: 14px 20px;
          border-radius: 12px;
          background: #ffffff;
          color: #4f46e5;
          text-decoration: none;
          font-weight: 800;
          font-size: 14px;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .cy-join-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
        }

        .cy-actions {
          display: flex;
          justify-content: center;
          margin-top: 24px;
        }

        .cy-secondary-button {
          padding: 13px 20px;
          border-radius: 12px;
          border: 1px solid #d9dce5;
          background: #ffffff;
          color: #344054;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .cy-secondary-button:hover {
          background: #f8f9fc;
          transform: translateY(-1px);
        }

        .cy-footer {
          margin: 22px auto 0;
          max-width: 700px;
          text-align: center;
          color: #667085;
          font-size: 12px;
          line-height: 1.6;
        }

        @media (max-width: 760px) {
          .cy-confirmation-page {
            padding: 25px 13px 45px;
          }

          .cy-success-card {
            padding: 34px 18px 30px;
            border-radius: 22px;
          }

          .cy-countdown {
            padding: 20px 12px;
          }

          .cy-countdown-values {
            gap: 5px;
          }

          .cy-countdown-unit {
            min-width: 70px;
            padding: 13px 7px;
          }

          .cy-countdown-unit strong {
            font-size: 25px;
          }

          .cy-countdown-separator {
            font-size: 22px;
          }

          .cy-section {
            padding: 20px 16px;
            border-radius: 20px;
          }

          .cy-mentor {
            align-items: flex-start;
          }

          .cy-time-grid {
            grid-template-columns: 1fr;
          }

          .cy-time-connector {
            flex-direction: row;
          }

          .cy-time-connector span {
            transform: rotate(90deg);
          }

          .cy-details-grid {
            grid-template-columns: 1fr;
          }

          .cy-detail-full {
            grid-column: auto;
          }

          .cy-classroom {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }

          .cy-classroom-icon {
            margin: 0 auto;
          }

          .cy-join-button {
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .cy-countdown-unit {
            min-width: 60px;
          }

          .cy-countdown-unit strong {
            font-size: 22px;
          }

          .cy-countdown-unit span {
            font-size: 8px;
          }

          .cy-time-value {
            font-size: 26px;
          }
        }
      `}</style>

      <main className="cy-confirmation-page">
        <div className="cy-confirmation-container">

          {/* =====================================================
              SUCCESS
              ===================================================== */}

          <section className="cy-success-card">
            <div className="cy-success-glow" />

            <div className="cy-success-icon">
              ✓
            </div>

            <span className="cy-success-label">
              TRIAL CLASS CONFIRMED
            </span>

            <h1>
              Your class is booked! 🎉
            </h1>

            <p>
              Great news, {parentName.split(" ")[0]}!
              Your CodeYoung trial class has been
              successfully scheduled with your mentor.
            </p>
          </section>

          {/* =====================================================
              COUNTDOWN
              ===================================================== */}

          <section className="cy-countdown">
            <div className="cy-countdown-title">
              {remaining.started
                ? "YOUR CLASS IS READY"
                : "YOUR TRIAL CLASS"}
            </div>

            <div className="cy-countdown-subtitle">
              {remaining.started
                ? "Your class has started. You can join now."
                : "Get ready — your class starts in"}
            </div>

            {!remaining.started ? (
              <div className="cy-countdown-values">
                <div className="cy-countdown-unit">
                  <strong>
                    {formatNumber(
                      remaining.hours
                    )}
                  </strong>
                  <span>HOURS</span>
                </div>

                <div className="cy-countdown-separator">
                  :
                </div>

                <div className="cy-countdown-unit">
                  <strong>
                    {formatNumber(
                      remaining.minutes
                    )}
                  </strong>
                  <span>MIN</span>
                </div>

                <div className="cy-countdown-separator">
                  :
                </div>

                <div className="cy-countdown-unit">
                  <strong>
                    {formatNumber(
                      remaining.seconds
                    )}
                  </strong>
                  <span>SEC</span>
                </div>
              </div>
            ) : (
              <div className="cy-ready">
                🟢 Your mentor is ready for the
                trial class.
              </div>
            )}

            <div className="cy-status">
              <span className="cy-status-dot" />
              Booking confirmed by CodeYoung
            </div>
          </section>

          {/* =====================================================
              MENTOR
              ===================================================== */}

          <section className="cy-section">
            <div className="cy-section-heading">
              <div className="cy-heading-icon">
                👨‍🏫
              </div>

              <div>
                <span className="cy-eyebrow">
                  YOUR MENTOR
                </span>

                <h2>
                  Meet your CodeYoung mentor
                </h2>
              </div>
            </div>

            <div className="cy-mentor">
              <div className="cy-mentor-avatar">
                👨‍🏫
              </div>

              <div className="cy-mentor-info">
                <h3>{mentorName}</h3>

                <div className="cy-mentor-meta">
                  {mentorRating && (
                    <span className="cy-rating">
                      ⭐ {mentorRating} rating
                    </span>
                  )}

                  <span className="cy-assigned">
                    ✓ Assigned to you
                  </span>
                </div>

                <div className="cy-course">
                  📚 {courseName}
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              TIMEZONE
              ===================================================== */}

          <section className="cy-section">
            <div className="cy-section-heading">
              <div className="cy-heading-icon">
                🌍
              </div>

              <div>
                <span className="cy-eyebrow">
                  TIMEZONE CONVERSION
                </span>

                <h2>
                  Same class, different local times
                </h2>
              </div>
            </div>

            <div className="cy-time-grid">

              {/* Parent */}
              <div className="cy-time-box">
                <span className="cy-time-role">
                  👤 YOUR LOCAL TIME
                </span>

                <span className="cy-time-date">
                  {parentDate}
                </span>

                <strong className="cy-time-value">
                  {parentTime}
                </strong>

                <span className="cy-time-zone">
                  {parentTimezone}
                </span>
              </div>

              {/* Connector */}
              <div className="cy-time-connector">
                <span>↔</span>
                <small>SAME MOMENT</small>
              </div>

              {/* Mentor */}
              <div className="cy-time-box">
                <span className="cy-time-role">
                  👨‍🏫 MENTOR LOCAL TIME
                </span>

                <span className="cy-time-date">
                  {mentorDate}
                </span>

                <strong className="cy-time-value">
                  {mentorTime}
                </strong>

                <span className="cy-time-zone">
                  {mentorTimezone}
                </span>
              </div>
            </div>

            <div className="cy-time-note">
              ✓ Both times represent the exact same
              moment. Only the timezone display changes.
            </div>
          </section>

          {/* =====================================================
              BOOKING DETAILS
              ===================================================== */}

          <section className="cy-section">
            <div className="cy-section-heading">
              <div className="cy-heading-icon">
                📋
              </div>

              <div>
                <span className="cy-eyebrow">
                  BOOKING DETAILS
                </span>

                <h2>
                  Your appointment
                </h2>
              </div>
            </div>

            <div className="cy-details-grid">

              <div className="cy-detail">
                <span className="cy-detail-label">
                  Parent
                </span>

                <strong>
                  {parentName}
                </strong>

                {parentEmail && (
                  <small>
                    {parentEmail}
                  </small>
                )}
              </div>

              <div className="cy-detail">
                <span className="cy-detail-label">
                  Course
                </span>

                <strong>
                  {courseName}
                </strong>
              </div>

              <div className="cy-detail">
                <span className="cy-detail-label">
                  Status
                </span>

                <strong>
                  <span className="cy-status-badge">
                    {booking.status ||
                      "CONFIRMED"}
                  </span>
                </strong>
              </div>

              <div className="cy-detail">
                <span className="cy-detail-label">
                  Parent local time
                </span>

                <strong>
                  {parentFullTime}
                </strong>

                <small>
                  {parentTimezone}
                </small>
              </div>

              <div className="cy-detail">
                <span className="cy-detail-label">
                  Mentor local time
                </span>

                <strong>
                  {mentorFullTime}
                </strong>

                <small>
                  {mentorTimezone}
                </small>
              </div>

              {bookingId && (
                <div className="cy-detail cy-detail-full">
                  <span className="cy-detail-label">
                    Booking ID
                  </span>

                  <strong className="cy-booking-id">
                    #{bookingId}
                  </strong>
                </div>
              )}
            </div>
          </section>

          {/* =====================================================
              CLASSROOM
              ===================================================== */}

          <section className="cy-classroom">
            <div className="cy-classroom-icon">
              🎥
            </div>

            <div className="cy-classroom-content">
              <span className="cy-eyebrow">
                YOUR CLASSROOM
              </span>

              <h2>
                Your virtual classroom is ready
              </h2>

              <p>
                Join the class using the button below
                when your trial class is about to begin.
              </p>
            </div>

            {classroomUrl ? (
              <a
                className="cy-join-button"
                href={classroomUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  {isGoogleMeet
                    ? "Join Google Meet"
                    : "Open Classroom"}
                </span>

                <span>→</span>
              </a>
            ) : (
              <span>
                Classroom link unavailable
              </span>
            )}
          </section>

          {/* =====================================================
              ACTION
              ===================================================== */}

          <div className="cy-actions">
            <button
              className="cy-secondary-button"
              type="button"
              onClick={onBookAnother}
            >
              ← Book another trial class
            </button>
          </div>

          <p className="cy-footer">
            🔒 Your booking is securely stored.
            Mentor availability and assignment were
            confirmed by the backend.
          </p>

        </div>
      </main>
    </>
  );
}