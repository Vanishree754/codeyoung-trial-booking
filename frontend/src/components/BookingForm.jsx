import { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";

import {
  checkAvailability,
  createBooking,
  getParentBookedTimes,
} from "../services/api.js";

const TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Singapore",
  "Australia/Sydney",
];

function PythonLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#3776AB"
        d="M126.9 20c-35.7 0-33.5 15.5-33.5 15.5l.1 16.1h34v4.8H80.1C43.1 56.4 32 79.1 32 116.6c0 37.5 9.7 59.2 48.1 59.2h13.7v-19.1c0-22.2 19.1-41.7 41.7-41.7h34c0 0 19.1.3 19.1-18.5V54.8C188.6 54.8 185.5 20 126.9 20Zm-18.7 21.1c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6Z"
      />

      <path
        fill="#FFD43B"
        d="M129.1 236c35.7 0 33.5-15.5 33.5-15.5l-.1-16.1h-34v-4.8h47.4c37 0 48.1-22.7 48.1-60.2 0-37.5-9.7-59.2-48.1-59.2h-13.7v19.1c0 22.2-19.1 41.7-41.7 41.7h-34c0 0-19.1-.3-19.1 18.5v41.7c0 0 3.1 34.8 61.7 34.8Zm18.7-21.1c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6Z"
      />
    </svg>
  );
}

const COURSES = [
  {
    name: "Python Programming",
    description:
      "Learn programming fundamentals and problem solving.",
    icon: <PythonLogo />,
  },
  {
    name: "Web Development",
    description:
      "Build modern websites and interactive web applications.",
    icon: "🌐",
  },
  {
    name: "AI & Machine Learning",
    description:
      "Explore AI, machine learning and intelligent applications.",
    icon: "🤖",
  },
  {
    name: "Game Development",
    description:
      "Create games and learn interactive development concepts.",
    icon: "🎮",
  },
  {
    name: "Coding & Programming",
    description:
      "Build strong coding and logical thinking skills.",
    icon: "💻",
  },
  {
    name: "Data Science",
    description:
      "Learn data analysis, visualization and data-driven thinking.",
    icon: "📊",
  },
];

function getDefaultDate() {
  return DateTime.now()
    .plus({ days: 1 })
    .toISODate();
}

function createTimeOptions() {
  return Array.from({ length: 16 }, (_, index) => {
    const hour = 8 + index;

    return `${String(hour).padStart(2, "0")}:00`;
  });
}

function formatTime(time) {
  return DateTime.fromFormat(
    time,
    "HH:mm"
  ).toFormat("h:mm a");
}

export default function BookingForm({ onBooked }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    timezone:
      Intl.DateTimeFormat().resolvedOptions()
        .timeZone || "Asia/Kolkata",
    date: getDefaultDate(),
    time: "10:00",
  });

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const [availability, setAvailability] =
    useState(null);

  const [selectedMentor, setSelectedMentor] =
    useState(null);

  const [error, setError] = useState("");

  const [errorType, setErrorType] =
    useState("");

  const [bookedTimes, setBookedTimes] =
    useState([]);

  const timeOptions = useMemo(
    createTimeOptions,
    []
  );

  const selectedCourse = COURSES.find(
    (course) => course.name === form.course
  );

  const selectedDateLabel = DateTime.fromISO(
    form.date
  ).toFormat("EEE, dd MMM yyyy");

  /*
   * Load the parent's already booked times.
   *
   * These are disabled only for this parent.
   * Other parents can still book the same time.
   */
  useEffect(() => {
    if (
      !form.email ||
      !form.date ||
      !form.timezone
    ) {
      setBookedTimes([]);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const result =
          await getParentBookedTimes(
            form.email,
            form.date,
            form.timezone
          );

        if (!cancelled) {
          setBookedTimes(
            result?.data?.bookedTimes || []
          );
        }
      } catch {
        if (!cancelled) {
          setBookedTimes([]);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    form.email,
    form.date,
    form.timezone,
  ]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setAvailability(null);
    setSelectedMentor(null);
    setError("");
    setErrorType("");
  }

  function selectCourse(courseName) {
    setForm((current) => ({
      ...current,
      course: courseName,
    }));

    setAvailability(null);
    setSelectedMentor(null);
    setError("");
    setErrorType("");
  }

  function selectTime(time) {
    setForm((current) => ({
      ...current,
      time,
    }));

    setAvailability(null);
    setSelectedMentor(null);
    setError("");
    setErrorType("");
  }

  function localStartTime() {
    return `${form.date}T${form.time}:00`;
  }

  async function handleCheckAvailability(event) {
    event.preventDefault();

    setError("");
    setErrorType("");
    setAvailability(null);
    setSelectedMentor(null);

    if (!form.course) {
      setError(
        "Please select a course or learning domain first."
      );
      setErrorType("VALIDATION");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter your name.");
      setErrorType("VALIDATION");
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Please enter your email address."
      );
      setErrorType("VALIDATION");
      return;
    }

    if (!form.date) {
      setError("Please select a date.");
      setErrorType("VALIDATION");
      return;
    }

    if (!form.time) {
      setError("Please select a time.");
      setErrorType("VALIDATION");
      return;
    }

    /*
     * Client-side duplicate check.
     *
     * The backend performs the authoritative check again.
     */
    if (bookedTimes.includes(form.time)) {
      setError(
        "You already have another trial class booked at this time. Please select another time."
      );
      setErrorType("PARENT_ALREADY_BOOKED");
      return;
    }

    setChecking(true);

    try {
      const result =
        await checkAvailability(
          localStartTime(),
          form.timezone,
          form.course,
          form.email
        );

      const data = result?.data || {};

      setAvailability(data);

      /*
       * IMPORTANT:
       * The backend is authoritative.
       *
       * If the parent already has a booking,
       * show that specific reason.
       */
      if (
        data.reason ===
        "PARENT_ALREADY_BOOKED"
      ) {
        setError(
          data.message ||
            "You already have another trial class booked at this time. Please select another time."
        );

        setErrorType(
          "PARENT_ALREADY_BOOKED"
        );

        return;
      }

      /*
       * No eligible mentor.
       */
      if (!data.available) {
        setError(
          data.message ||
            "No mentors are available for this time. Please select another time or date."
        );

        setErrorType("NO_MENTOR");

        return;
      }

      const mentors = Array.isArray(
        data.mentors
      )
        ? data.mentors
        : [];

      if (mentors.length === 0) {
        setError(
          "No mentors are available for this time. Please select another time or date."
        );

        setErrorType("NO_MENTOR");

        return;
      }

      /*
       * Sort only for presentation/default selection.
       *
       * The backend still performs the final
       * availability and booking validation.
       *
       * Highest rating appears first.
       * If ratings are equal, lower mentor ID
       * comes first for deterministic behavior.
       */
      const sortedMentors = [...mentors].sort(
        (a, b) => {
          const ratingA =
            Number(a.rating) || 0;

          const ratingB =
            Number(b.rating) || 0;

          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }

          return Number(a.id) - Number(b.id);
        }
      );

      /*
       * Keep the complete backend-provided mentor
       * list, but make the highest-rated mentor
       * the initial selection.
       */
      setAvailability({
        ...data,
        mentors: sortedMentors,
      });

      setSelectedMentor(
        sortedMentors[0]
      );

      setError("");
      setErrorType("");
    } catch (err) {
      setAvailability(null);
      setSelectedMentor(null);

      const message =
        err?.message ||
        "We could not check mentor availability. Please try again.";

      setError(message);
      setErrorType("API_ERROR");
    } finally {
      setChecking(false);
    }
  }

  async function handleBooking() {
    if (!selectedMentor) {
      setError(
        "Please select an available mentor before booking."
      );
      setErrorType("VALIDATION");
      return;
    }

    setLoading(true);
    setError("");
    setErrorType("");

    try {
      const result =
        await createBooking({
          name: form.name,
          email: form.email,
          course: form.course,
          timezone: form.timezone,
          startTime: localStartTime(),

          /*
           * This must be respected by the backend.
           */
          mentorId: selectedMentor.id,
        });

      onBooked(result.data);
    } catch (err) {
      const message =
        err?.message ||
        "We could not complete your booking. Please try again.";

      /*
       * Do NOT blindly assume this is a generic
       * server failure.
       *
       * The backend may return:
       * - selected mentor unavailable
       * - parent duplicate
       * - no mentor available
       * - validation error
       */
      if (
        message
          .toLowerCase()
          .includes("selected mentor")
      ) {
        setError(
          "This mentor is no longer available for the selected time. Please choose another available mentor."
        );

        setErrorType(
          "MENTOR_NO_LONGER_AVAILABLE"
        );

        /*
         * Keep the availability section visible.
         * Remove only the mentor that failed.
         */
        setAvailability((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            mentors: (
              current.mentors || []
            ).filter(
              (mentor) =>
                mentor.id !==
                selectedMentor.id
            ),
          };
        });

        setSelectedMentor(null);
      } else if (
        message
          .toLowerCase()
          .includes("already have") ||
        message
          .toLowerCase()
          .includes("already booked")
      ) {
        setError(
          "You already have another trial class booked at this time. Please select another time."
        );

        setErrorType(
          "PARENT_ALREADY_BOOKED"
        );

        setAvailability(null);
        setSelectedMentor(null);
      } else if (
        message
          .toLowerCase()
          .includes("no mentor")
      ) {
        setError(
          "No mentors are available for this time anymore. Please select another time or date."
        );

        setErrorType("NO_MENTOR");

        setSelectedMentor(null);
      } else {
        setError(message);
        setErrorType("API_ERROR");
      }
    } finally {
      setLoading(false);
    }
  }

  const availableMentors =
    availability?.mentors || [];

  const hasMentors =
    availability?.available &&
    availableMentors.length > 0;

  return (
    <form
      className="booking-form-modern"
      onSubmit={handleCheckAvailability}
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="booking-form-intro">
        <div className="booking-form-badge">
          <span>✦</span>
          FREE TRIAL CLASS
        </div>

        <h3>
          Choose what you want to learn.
        </h3>

        <p>
          Select a course first. Then tell us
          about yourself and choose a convenient
          time.
        </p>
      </div>

      {/* =====================================================
          STEP 1 — COURSE
          ===================================================== */}

      <section className="course-selection-card course-first">
        <div className="course-selection-header">
          <div>
            <span className="section-eyebrow">
              STEP 1
            </span>

            <h3>
              What would you like to learn?
            </h3>

            <p>
              Choose one course to continue.
            </p>
          </div>

          {selectedCourse && (
            <div className="selected-course-pill">
              ✓ {selectedCourse.name}
            </div>
          )}
        </div>

        <div className="course-grid">
          {COURSES.map((course) => {
            const isSelected =
              form.course === course.name;

            return (
              <button
                key={course.name}
                type="button"
                className={`course-option ${
                  isSelected
                    ? "course-option-selected"
                    : ""
                }`}
                onClick={() =>
                  selectCourse(course.name)
                }
              >
                <div className="course-option-top">
                  <div className="course-icon">
                    {course.icon}
                  </div>

                  <div
                    className={`course-check ${
                      isSelected
                        ? "course-check-visible"
                        : ""
                    }`}
                  >
                    {isSelected ? "✓" : ""}
                  </div>
                </div>

                <div className="course-option-content">
                  <h4>{course.name}</h4>

                  <p>
                    {course.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          STEP 2 — PARENT DETAILS + TIME
          ===================================================== */}

      <div className="booking-step-section">
        <div className="booking-step-heading">
          <span className="section-eyebrow">
            STEP 2
          </span>

          <h3>
            Tell us about yourself
          </h3>

          <p>
            Enter your details and choose when
            you'd like to attend.
          </p>
        </div>

        <div className="booking-form-grid">
          {/* PARENT DETAILS */}

          <section className="booking-card">
            <div className="booking-card-heading">
              <div className="booking-card-icon">
                👤
              </div>

              <div>
                <h4>Your details</h4>

                <p>
                  Tell us who is joining the
                  trial.
                </p>
              </div>
            </div>

            <div className="booking-field">
              <label htmlFor="parent-name">
                Parent name
              </label>

              <input
                id="parent-name"
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Enter your full name"
                minLength={2}
                maxLength={100}
                required
              />
            </div>

            <div className="booking-field">
              <label htmlFor="parent-email">
                Email address
              </label>

              <input
                id="parent-email"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@example.com"
                required
              />

              <small className="field-help">
                Your booking confirmation will be
                sent here.
              </small>
            </div>
          </section>

          {/* DATE / TIME */}

          <section className="booking-card">
            <div className="booking-card-heading">
              <div className="booking-card-icon">
                📅
              </div>

              <div>
                <h4>Choose date & time</h4>

                <p>
                  Pick a convenient time in your
                  timezone.
                </p>
              </div>
            </div>

            <div className="booking-field">
              <label htmlFor="timezone">
                Your timezone
              </label>

              <select
                id="timezone"
                name="timezone"
                value={form.timezone}
                onChange={updateField}
              >
                {TIMEZONES.map((timezone) => (
                  <option
                    key={timezone}
                    value={timezone}
                  >
                    {timezone}
                  </option>
                ))}
              </select>
            </div>

            <div className="booking-field">
              <label htmlFor="preferred-date">
                Date
              </label>

              <input
                id="preferred-date"
                name="date"
                type="date"
                min={DateTime.now().toISODate()}
                value={form.date}
                onChange={updateField}
                required
              />
            </div>

            <div className="booking-field">
              <label htmlFor="preferred-time">
                Available time
              </label>

              <select
                id="preferred-time"
                name="time"
                value={form.time}
                onChange={(event) =>
                  selectTime(
                    event.target.value
                  )
                }
              >
                {timeOptions.map((time) => {
                  const isBooked =
                    bookedTimes.includes(time);

                  return (
                    <option
                      key={time}
                      value={time}
                      disabled={isBooked}
                    >
                      {formatTime(time)}
                      {isBooked
                        ? " — Already booked"
                        : ""}
                    </option>
                  );
                })}
              </select>

              <small className="field-help">
                Times already booked by you are
                disabled.
              </small>
            </div>
          </section>
        </div>
      </div>

      {/* =====================================================
          SELECTED TIME
          ===================================================== */}

      <div className="selected-time-card">
        <div className="selected-time-icon">
          🕐
        </div>

        <div className="selected-time-content">
          <span>
            SELECTED CLASS TIME
          </span>

          <strong>
            {selectedDateLabel} ·{" "}
            {formatTime(form.time)}
          </strong>

          <small>
            {form.timezone}
          </small>
        </div>

        <div className="selected-time-status">
          <span className="status-dot" />
          Local time
        </div>
      </div>

      {/* =====================================================
          ERROR / INFORMATION MESSAGE
          ===================================================== */}

      {error && (
        <div
          className={`booking-message booking-message-error ${
            errorType ===
            "PARENT_ALREADY_BOOKED"
              ? "booking-message-parent-conflict"
              : ""
          }`}
        >
          <div className="message-icon">
            {errorType ===
            "PARENT_ALREADY_BOOKED"
              ? "!"
              : "!"}
          </div>

          <div>
            <strong>
              {errorType ===
              "PARENT_ALREADY_BOOKED"
                ? "Time already booked"
                : errorType ===
                  "NO_MENTOR"
                ? "No mentors available"
                : errorType ===
                  "MENTOR_NO_LONGER_AVAILABLE"
                ? "Mentor no longer available"
                : errorType ===
                  "VALIDATION"
                ? "Please check your details"
                : "We couldn't complete that"}
            </strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      {/* =====================================================
          STEP 3 — FIND MENTOR
          ===================================================== */}

      <button
        className="booking-primary-button"
        type="submit"
        disabled={
          checking ||
          loading ||
          !form.course
        }
      >
        {checking ? (
          <>
            <span className="button-spinner" />

            Checking mentor availability...
          </>
        ) : (
          <>
            Check availability

            <span>→</span>
          </>
        )}
      </button>

      {/* =====================================================
          STEP 4 — AVAILABLE MENTORS
          ===================================================== */}

      {hasMentors && (
        <section className="mentor-results">
          <div className="mentor-results-header">
            <div>
              <span className="section-eyebrow">
                STEP 4
              </span>

              <h3>
                Choose your mentor
              </h3>

              <p>
                <strong>
                  {availableMentors.length}
                </strong>{" "}
                mentor
                {availableMentors.length !== 1
                  ? "s"
                  : ""}{" "}
                available for{" "}
                <strong>
                  {form.course}
                </strong>
              </p>

              <p className="field-help">
                ⭐ Mentors are shown with their
                ratings. You can choose any
                available mentor.
              </p>
            </div>

            <div className="mentor-count-badge">
              {availableMentors.length}{" "}
              available
            </div>
          </div>

          <div className="mentor-grid">
            {availableMentors.map(
              (mentor) => {
                const isSelected =
                  selectedMentor?.id ===
                  mentor.id;

                return (
                  <button
                    key={mentor.id}
                    type="button"
                    className={`mentor-option ${
                      isSelected
                        ? "mentor-option-selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedMentor(
                        mentor
                      )
                    }
                  >
                    <div className="mentor-option-header">
                      <div className="mentor-avatar">
                        {mentor.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="mentor-check">
                        {isSelected
                          ? "✓"
                          : ""}
                      </div>
                    </div>

                    <div className="mentor-info">
                      <h4>
                        {mentor.name}
                      </h4>

                      <div className="mentor-rating">
                        <span>★</span>

                        <strong>
                          {Number(
                            mentor.rating
                          ).toFixed(1)}
                        </strong>

                        <span className="rating-label">
                          Rating
                        </span>
                      </div>

                      <div className="mentor-meta">
                        <span>
                          🌍{" "}
                          {mentor.timezone}
                        </span>

                        <span>
                          📚{" "}
                          {mentor.dailyBookingCount ||
                            0}
                          /2 classes today
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mentor-selected-label">
                        ✓ Selected mentor
                      </div>
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* BOOKING SUMMARY */}

          {selectedMentor && (
            <div className="booking-summary-card">
              <div>
                <span className="summary-label">
                  READY TO BOOK
                </span>

                <h4>
                  {selectedMentor.name}
                </h4>

                <p>
                  ⭐{" "}
                  {Number(
                    selectedMentor.rating
                  ).toFixed(1)}{" "}
                  · {form.course} ·{" "}
                  {selectedDateLabel} ·{" "}
                  {formatTime(form.time)}
                </p>
              </div>

              <button
                className="booking-confirm-button"
                type="button"
                onClick={handleBooking}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-spinner" />
                    Booking...
                  </>
                ) : (
                  <>
                    Book FREE trial
                    <span>🚀</span>
                  </>
                )}
              </button>
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          NO MENTOR AVAILABLE
          ===================================================== */}

      {availability &&
        !availability.available && (
          <div className="mentor-empty-state">
            <div className="empty-state-icon">
              🕐
            </div>

            <h4>
              No mentors are available
            </h4>

            <p>
              There are no eligible mentors for{" "}
              <strong>
                {form.course}
              </strong>{" "}
              at{" "}
              <strong>
                {formatTime(form.time)}
              </strong>{" "}
              on{" "}
              <strong>
                {selectedDateLabel}
              </strong>
              .
            </p>

            <p>
              Please select another time or date
              and check availability again.
            </p>

            <button
              type="button"
              className="secondary-button-modern"
              onClick={() => {
                setAvailability(null);
                setSelectedMentor(null);
                setError("");
                setErrorType("");
              }}
            >
              Choose another time
            </button>
          </div>
        )}

      {/* =====================================================
          AVAILABLE BUT NO SELECTED MENTOR
          ===================================================== */}

      {availability?.available &&
        availableMentors.length > 0 &&
        !selectedMentor && (
          <div className="mentor-empty-state">
            <div className="empty-state-icon">
              👨‍🏫
            </div>

            <h4>
              Select a mentor to continue
            </h4>

            <p>
              Choose one of the available mentors
              above to continue with your booking.
            </p>
          </div>
        )}
    </form>
  );
}